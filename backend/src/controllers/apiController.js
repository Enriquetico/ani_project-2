import bcrypt from 'bcryptjs'
import multer from 'multer'
import os from 'node:os'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { promises as fs } from 'node:fs'
import { execFile as execFileCallback } from 'node:child_process'
import { promisify } from 'node:util'
import { z } from 'zod'

export const loginSchema = z.object({
  username: z.string().trim().min(1).optional(),
  password: z.string().min(1).max(128)
})

export const productoSchema = z.object({
  nombre: z.string().trim().min(1).max(120),
  categoria: z.string().trim().max(120).optional(),
  tipo: z.string().trim().max(120).optional(),
  tamaño: z.string().trim().max(120).optional(),
  descripcion: z.string().trim().max(2000).optional(),
  colores: z.array(z.string().trim().max(50)).optional(),
  precioAproximado: z.string().trim().max(120).optional(),
  notas: z.string().trim().max(500).optional(),
  imagen: z.string().trim().max(500).optional()
})

export const contactoSchema = z.object({
  nombre: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  telefono: z.string().trim().max(50).optional(),
  asunto: z.string().trim().min(2).max(200),
  mensaje: z.string().trim().min(5).max(4000)
})

export const suscriptorSchema = z.object({
  email: z.string().trim().email().max(200)
})

const normalizeDateToMs = (value) => {
  if (!value) return null
  const timestamp = new Date(value).getTime()
  return Number.isNaN(timestamp) ? null : timestamp
}

const getClientIp = (req) => {
  const forwarded = req.headers['x-forwarded-for']
  if (typeof forwarded === 'string' && forwarded.trim()) {
    return forwarded.split(',')[0].trim()
  }
  return req.ip || 'unknown'
}

const normalizeName = (value) =>
  String(value || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '') || 'imagen'

const normalizeProductName = (value) =>
  String(value || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()

const mapProductoRow = (row) => ({
  id: row.id,
  nombre: row.nombre,
  categoria: row.categoria,
  tipo: row.tipo,
  tamaño: row.tamano,
  descripcion: row.descripcion,
  colores: row.colores_json ? JSON.parse(row.colores_json) : [],
  precioAproximado: row.precio_aproximado,
  notas: row.notas,
  imagen: row.imagen
})

export const createApiController = (deps) => {
  const {
    dbOps,
    query,
    signAuthToken,
    getCookieName,
    env,
    authConfig,
    imageConfig,
    artifactsConfig
  } = deps

  const upload = multer({ storage: multer.memoryStorage() })
  const execFile = promisify(execFileCallback)

  const loadBaseProductos = async () => {
    const moduleUrl = `${pathToFileURL(artifactsConfig.artesaniasFile).href}?v=${Date.now()}`
    const mod = await import(moduleUrl)
    return Array.isArray(mod.productos) ? mod.productos : []
  }

  const persistBaseProductos = async (productosBase) => {
    const fileContent = await fs.readFile(artifactsConfig.artesaniasFile, 'utf-8')
    const replacement = `export const productos = ${JSON.stringify(productosBase, null, 2)};`

    if (!artifactsConfig.productosExportRegex.test(fileContent)) {
      throw new Error('No se encontró export const productos en artesanias.js')
    }

    const updated = fileContent.replace(artifactsConfig.productosExportRegex, replacement)
    await fs.writeFile(artifactsConfig.artesaniasFile, updated, 'utf-8')
  }

  const setAuthCookie = (res, token) => {
    res.cookie(getCookieName(), token, {
      httpOnly: true,
      sameSite: authConfig.cookieSameSite,
      secure: authConfig.cookieSecure,
      path: '/',
      maxAge: 8 * 60 * 60 * 1000
    })
  }

  const recordLoginAttempt = async ({ username, ip, userAgent, success }) => {
    await query(
      'INSERT INTO login_attempts (username, ip, user_agent, success) VALUES ($1, $2, $3, $4)',
      [username, ip, userAgent || '', success]
    )
  }

  const getLockStatus = async ({ username, ip }) => {
    const row = await dbOps.get(
      `SELECT COUNT(*)::int AS failures, MAX(created_at) AS last_failure
       FROM login_attempts
       WHERE username = $1
         AND ip = $2
         AND success = false
         AND created_at >= NOW() - ($3 * INTERVAL '1 minute')`,
      [username, ip, authConfig.lockWindowMinutes]
    )

    const failures = Number(row?.failures || 0)
    if (failures < authConfig.lockMaxFailures) {
      return { locked: false, retryAfterSeconds: 0 }
    }

    const lastFailureAt = normalizeDateToMs(row?.last_failure)
    if (!lastFailureAt) {
      return { locked: false, retryAfterSeconds: 0 }
    }

    const unlockAt = lastFailureAt + authConfig.lockDurationMinutes * 60 * 1000
    const now = Date.now()
    if (now >= unlockAt) {
      return { locked: false, retryAfterSeconds: 0 }
    }

    return {
      locked: true,
      retryAfterSeconds: Math.max(1, Math.ceil((unlockAt - now) / 1000))
    }
  }

  return {
    upload,

    health: (_req, res) => {
      res.json({ ok: true })
    },

    testDb: async (_req, res) => {
      const result = await query('SELECT NOW() AS now')
      res.json({ ok: true, now: result.rows[0]?.now })
    },

    login: async (req, res) => {
      const username = String(req.validatedBody.username || env.adminUsername).trim()
      const password = req.validatedBody.password
      const ip = getClientIp(req)
      const userAgent = String(req.headers['user-agent'] || '')

      const lockStatus = await getLockStatus({ username, ip })
      if (lockStatus.locked) {
        res.setHeader('Retry-After', String(lockStatus.retryAfterSeconds))
        res.status(429).json({ error: 'Cuenta temporalmente bloqueada por intentos fallidos. Intenta nuevamente más tarde.' })
        return
      }

      const admin = await dbOps.get('SELECT id, username, password_hash FROM admins WHERE username = $1', [username])

      if (!admin) {
        await recordLoginAttempt({ username, ip, userAgent, success: false })
        res.status(401).json({ error: 'Credenciales inválidas' })
        return
      }

      const validPassword = await bcrypt.compare(password, admin.password_hash)
      if (!validPassword) {
        await recordLoginAttempt({ username, ip, userAgent, success: false })
        res.status(401).json({ error: 'Credenciales inválidas' })
        return
      }

      await recordLoginAttempt({ username, ip, userAgent, success: true })

      const token = signAuthToken({ id: admin.id, username: admin.username }, env.jwtSecret, env.jwtExpiresIn)
      setAuthCookie(res, token)
      res.json({ ok: true, username: admin.username })
    },

    logout: (_req, res) => {
      res.clearCookie(getCookieName(), {
        httpOnly: true,
        sameSite: authConfig.cookieSameSite,
        secure: authConfig.cookieSecure,
        path: '/'
      })
      res.json({ ok: true })
    },

    me: (req, res) => {
      res.json({ ok: true, username: req.admin.username })
    },

    optimizeImage: async (req, res) => {
      if (!req.file) {
        res.status(400).json({ error: 'Debes adjuntar una imagen.' })
        return
      }

      if (!String(req.file.mimetype || '').startsWith('image/')) {
        res.status(400).json({ error: 'El archivo debe ser una imagen válida.' })
        return
      }

      const baseName = normalizeName(req.body.productName || req.body.nombre || req.file.originalname)
      const ext = path.extname(req.file.originalname || '').toLowerCase() || '.jpg'
      const safeExt = ['.jpg', '.jpeg', '.png', '.webp'].includes(ext) ? ext : '.jpg'

      let tempDir = ''
      let mapFile = ''

      try {
        await fs.mkdir(imageConfig.productImagesDir, { recursive: true })

        tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ani-upload-'))
        const tempInput = path.join(tempDir, `${baseName}${safeExt}`)
        mapFile = path.join(tempDir, 'mapa-upload.json')
        await fs.writeFile(tempInput, req.file.buffer)

        const scriptPath = path.resolve(process.cwd(), 'scripts/optimizador_imagenes.py')
        await execFile(imageConfig.pythonBin, [
          scriptPath,
          '--source',
          tempDir,
          '--output',
          imageConfig.productImagesDir,
          '--process-webp',
          '--target-size',
          String(Math.max(64, imageConfig.imageTargetSize)),
          '--max-size',
          String(imageConfig.imageMaxSize),
          '--quality',
          String(imageConfig.imageQuality),
          '--map-file',
          mapFile
        ])

        const mapRaw = await fs.readFile(mapFile, 'utf-8')
        const mapData = JSON.parse(mapRaw)
        const firstItem = Array.isArray(mapData.items) ? mapData.items[0] : null
        const optimizedRelPath = firstItem?.optimized_relpath
        const formatoNoCompatible = Boolean(mapData?.unsupported_format)

        if (!optimizedRelPath) {
          if (formatoNoCompatible) {
            res.status(400).json({
              error: 'Formato de imagen no compatible. Usa JPG, PNG, WEBP u otro formato soportado por el servidor.'
            })
            return
          }
          throw new Error('No se obtuvo ruta optimizada del script.')
        }

        const normalizedRelPath = String(optimizedRelPath).replace(/\\/g, '/')
        const imagePath = imageConfig.productImagesPublicBaseUrl
          ? `${imageConfig.productImagesPublicBaseUrl}/images/${normalizedRelPath}`
          : `/images/${normalizedRelPath}`

        res.status(201).json({
          ok: true,
          imagePath,
          fileName: path.basename(normalizedRelPath)
        })
      } catch (error) {
        console.error('[upload] Error optimizando imagen', error)

        if (String(error?.message || '').toLowerCase().includes('cannot identify image file')) {
          res.status(400).json({
            error: 'Formato de imagen no compatible. Usa JPG, PNG, WEBP u otro formato soportado por el servidor.'
          })
          return
        }

        res.status(500).json({ error: 'No se pudo optimizar la imagen en este momento.' })
      } finally {
        if (tempDir) {
          await fs.rm(tempDir, { recursive: true, force: true })
        }
      }
    },

    imageUploadConfig: (_req, res) => {
      res.json({
        softBlockMb: Math.max(1, imageConfig.imageSoftBlockMb),
        softBlockBytes: imageConfig.imageSoftBlockBytes
      })
    },

    loginAttempts: async (req, res) => {
      const rawLimit = Number(req.query.limit || 100)
      const limit = Number.isInteger(rawLimit) ? Math.min(Math.max(rawLimit, 1), 500) : 100

      const rows = await dbOps.all(
        `SELECT id, username, ip, user_agent, success, created_at
         FROM login_attempts
         ORDER BY id DESC
         LIMIT $1`,
        [limit]
      )

      const data = rows.map((row) => ({
        id: row.id,
        username: row.username,
        ip: row.ip,
        userAgent: row.user_agent,
        success: Boolean(row.success),
        createdAt: row.created_at
      }))

      res.json(data)
    },

    getBaseProductos: async (_req, res) => {
      try {
        const baseProductos = await loadBaseProductos()
        res.json(baseProductos)
      } catch (error) {
        console.error('[base-productos] Error obteniendo productos base', error)
        res.status(500).json({ error: 'No se pudieron cargar los productos base.' })
      }
    },

    deleteBaseProducto: async (req, res) => {
      const id = Number(req.params.id)
      if (!Number.isInteger(id) || id <= 0) {
        res.status(400).json({ error: 'ID inválido' })
        return
      }

      try {
        const baseProductos = await loadBaseProductos()
        const filtered = baseProductos.filter((producto) => Number(producto?.id) !== id)

        if (filtered.length === baseProductos.length) {
          res.status(404).json({ error: 'Producto base no encontrado' })
          return
        }

        await persistBaseProductos(filtered)
        res.json({ ok: true })
      } catch (error) {
        console.error('[base-productos] Error eliminando producto base', error)
        res.status(500).json({ error: 'No se pudo eliminar el producto base.' })
      }
    },

    getAdminProductos: async (_req, res) => {
      const rows = await dbOps.all('SELECT * FROM productos ORDER BY id DESC')
      res.json(rows.map(mapProductoRow))
    },

    getPublicProductos: async (_req, res) => {
      const rows = await dbOps.all('SELECT * FROM productos ORDER BY id DESC')
      res.json(rows.map(mapProductoRow))
    },

    createProducto: async (req, res) => {
      const payload = req.validatedBody

      const normalizedName = normalizeProductName(payload.nombre)
      const allDbProducts = await dbOps.all('SELECT id, nombre FROM productos')
      const duplicateInDb = allDbProducts.some(
        (producto) => normalizeProductName(producto.nombre) === normalizedName
      )
      if (duplicateInDb) {
        res.status(409).json({ error: 'Ya existe un producto con ese nombre.' })
        return
      }

      const baseProductos = await loadBaseProductos()
      const existsInBase = baseProductos.some((producto) => normalizeProductName(producto?.nombre) === normalizedName)
      if (existsInBase) {
        res.status(409).json({ error: 'Ya existe un producto con ese nombre.' })
        return
      }

      const result = await query(
        `INSERT INTO productos (nombre, categoria, tipo, tamano, descripcion, colores_json, precio_aproximado, notas, imagen)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING id`,
        [
          payload.nombre,
          payload.categoria || '',
          payload.tipo || '',
          payload.tamaño || '',
          payload.descripcion || '',
          JSON.stringify(Array.isArray(payload.colores) ? payload.colores : []),
          payload.precioAproximado || '',
          payload.notas || '',
          payload.imagen || ''
        ]
      )

      res.status(201).json({ id: result.rows[0].id })
    },

    updateProducto: async (req, res) => {
      const id = Number(req.params.id)
      if (!Number.isInteger(id) || id <= 0) {
        res.status(400).json({ error: 'ID inválido' })
        return
      }

      const payload = req.validatedBody

      const normalizedName = normalizeProductName(payload.nombre)
      const allDbProducts = await dbOps.all('SELECT id, nombre FROM productos')
      const duplicateInDb = allDbProducts.some(
        (producto) => Number(producto.id) !== id && normalizeProductName(producto.nombre) === normalizedName
      )
      if (duplicateInDb) {
        res.status(409).json({ error: 'Ya existe un producto con ese nombre.' })
        return
      }

      const baseProductos = await loadBaseProductos()
      const existsInBase = baseProductos.some((producto) => normalizeProductName(producto?.nombre) === normalizedName)
      if (existsInBase) {
        res.status(409).json({ error: 'Ya existe un producto con ese nombre.' })
        return
      }

      const result = await dbOps.run(
        `UPDATE productos
         SET nombre = $1, categoria = $2, tipo = $3, tamano = $4, descripcion = $5, colores_json = $6, precio_aproximado = $7, notas = $8, imagen = $9, updated_at = NOW()
         WHERE id = $10`,
        [
          payload.nombre,
          payload.categoria || '',
          payload.tipo || '',
          payload.tamaño || '',
          payload.descripcion || '',
          JSON.stringify(Array.isArray(payload.colores) ? payload.colores : []),
          payload.precioAproximado || '',
          payload.notas || '',
          payload.imagen || '',
          id
        ]
      )

      if (!result.rowCount) {
        res.status(404).json({ error: 'Producto no encontrado' })
        return
      }

      res.json({ ok: true })
    },

    deleteProducto: async (req, res) => {
      const id = Number(req.params.id)
      if (!Number.isInteger(id) || id <= 0) {
        res.status(400).json({ error: 'ID inválido' })
        return
      }

      const result = await dbOps.run('DELETE FROM productos WHERE id = $1', [id])
      if (!result.rowCount) {
        res.status(404).json({ error: 'Producto no encontrado' })
        return
      }

      res.json({ ok: true })
    },

    sendContacto: async (req, res) => {
      const payload = req.validatedBody

      await query(
        'INSERT INTO mensajes (nombre, email, telefono, asunto, mensaje, fecha) VALUES ($1, $2, $3, $4, $5, $6)',
        [payload.nombre, payload.email, payload.telefono || '', payload.asunto, payload.mensaje, new Date().toLocaleString('es-CL')]
      )

      res.status(201).json({ ok: true })
    },

    subscribeNewsletter: async (req, res) => {
      const email = req.validatedBody.email.toLowerCase()

      try {
        await query('INSERT INTO suscriptores (email) VALUES ($1)', [email])
        res.status(201).json({ ok: true })
      } catch (error) {
        if (error?.code === '23505') {
          res.status(409).json({ error: 'Email ya registrado' })
          return
        }
        throw error
      }
    },

    getMensajes: async (_req, res) => {
      const rows = await dbOps.all('SELECT id, nombre, email, telefono, asunto, mensaje, fecha FROM mensajes ORDER BY id DESC')
      res.json(rows)
    },

    getSuscriptores: async (_req, res) => {
      const rows = await dbOps.all('SELECT id, email, created_at FROM suscriptores ORDER BY id DESC')
      res.json(rows)
    },

    deleteSuscriptor: async (req, res) => {
      const id = Number(req.params.id)
      if (!Number.isInteger(id) || id <= 0) {
        res.status(400).json({ error: 'ID inválido' })
        return
      }

      const result = await dbOps.run('DELETE FROM suscriptores WHERE id = $1', [id])
      if (!result.rowCount) {
        res.status(404).json({ error: 'Suscriptor no encontrado' })
        return
      }

      res.json({ ok: true })
    }
  }
}
