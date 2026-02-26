import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import bcrypt from 'bcryptjs'
import rateLimit from 'express-rate-limit'
import multer from 'multer'
import os from 'node:os'
import path from 'node:path'
import { pathToFileURL } from 'node:url'
import { promises as fs } from 'node:fs'
import { execFile as execFileCallback } from 'node:child_process'
import { promisify } from 'node:util'
import { z } from 'zod'
import { initDb, dbOps } from './db.js'
import { authMiddleware, getCookieName, signAuthToken } from './auth.js'

dotenv.config({ path: '.env.backend' })
dotenv.config()

const PORT = Number(process.env.PORT || process.env.API_PORT || 8787)
const NODE_ENV = process.env.NODE_ENV || 'development'
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173'
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD
const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h'
const COOKIE_SAME_SITE = String(process.env.COOKIE_SAME_SITE || (NODE_ENV === 'production' ? 'none' : 'lax')).toLowerCase()
const COOKIE_SECURE = process.env.COOKIE_SECURE
  ? String(process.env.COOKIE_SECURE).toLowerCase() === 'true'
  : NODE_ENV === 'production'
const AUTH_LOGIN_WINDOW_MINUTES = Number(process.env.AUTH_LOGIN_WINDOW_MINUTES || 15)
const AUTH_LOGIN_MAX_ATTEMPTS = Number(process.env.AUTH_LOGIN_MAX_ATTEMPTS || 8)
const AUTH_LOCK_WINDOW_MINUTES = Number(process.env.AUTH_LOCK_WINDOW_MINUTES || 30)
const AUTH_LOCK_MAX_FAILURES = Number(process.env.AUTH_LOCK_MAX_FAILURES || 5)
const AUTH_LOCK_DURATION_MINUTES = Number(process.env.AUTH_LOCK_DURATION_MINUTES || 30)
const PRODUCT_IMAGES_DIR = process.env.PRODUCT_IMAGES_DIR || path.resolve(process.cwd(), 'public/images')
const PRODUCT_IMAGES_PUBLIC_BASE_URL = String(process.env.PRODUCT_IMAGES_PUBLIC_BASE_URL || '').trim().replace(/\/+$/, '')
const PYTHON_BIN = process.env.PYTHON_BIN || 'python3'
const IMAGE_MAX_SIZE = Number(process.env.IMAGE_MAX_SIZE || 1024)
const IMAGE_TARGET_SIZE = Number(process.env.IMAGE_TARGET_SIZE || 300)
const IMAGE_QUALITY = Number(process.env.IMAGE_QUALITY || 80)
const IMAGE_SOFT_BLOCK_MB = Number(process.env.IMAGE_SOFT_BLOCK_MB || 8)
const IMAGE_UPLOAD_MAX_MB = Number(process.env.IMAGE_UPLOAD_MAX_MB || 15)
const IMAGE_SOFT_BLOCK_BYTES = Math.max(1, IMAGE_SOFT_BLOCK_MB) * 1024 * 1024
const IMAGE_UPLOAD_MAX_BYTES = Math.max(1, IMAGE_UPLOAD_MAX_MB) * 1024 * 1024
const ARTESANIAS_FILE = path.resolve(process.cwd(), 'src/data/artesanias.js')
const PRODUCTOS_EXPORT_REGEX = /export const productos = \[[\s\S]*?\n\];/
const ALLOWED_ORIGINS = FRONTEND_ORIGIN
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)
const execFile = promisify(execFileCallback)

if (!ADMIN_PASSWORD) {
  throw new Error('Falta ADMIN_PASSWORD en variables de entorno')
}

if (!JWT_SECRET) {
  throw new Error('Falta JWT_SECRET en variables de entorno')
}

if (!['lax', 'strict', 'none'].includes(COOKIE_SAME_SITE)) {
  throw new Error('COOKIE_SAME_SITE inválido. Usa: lax, strict o none')
}

if (COOKIE_SAME_SITE === 'none' && !COOKIE_SECURE) {
  throw new Error('COOKIE_SECURE debe ser true cuando COOKIE_SAME_SITE=none')
}

await initDb({ adminUsername: ADMIN_USERNAME, adminPassword: ADMIN_PASSWORD })

const app = express()

// Expose optimized product images from the API host when needed (e.g. static frontend on Neocities).
app.use('/images', express.static(PRODUCT_IMAGES_DIR))

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true)
        return
      }

      callback(new Error('Origen no permitido por CORS'))
    },
    credentials: true
  })
)
app.use(express.json())
app.use(cookieParser())

const loginSchema = z.object({
  username: z.string().trim().min(1).optional(),
  password: z.string().min(1).max(128)
})

const productoSchema = z.object({
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

const contactoSchema = z.object({
  nombre: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  telefono: z.string().trim().max(50).optional(),
  asunto: z.string().trim().min(2).max(200),
  mensaje: z.string().trim().min(5).max(4000)
})

const suscriptorSchema = z.object({
  email: z.string().trim().email().max(200)
})

const validateBody = (schema) => (req, res, next) => {
  const parsed = schema.safeParse(req.body || {})

  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message || 'Payload inválido' })
    return
  }

  req.validatedBody = parsed.data
  next()
}

const loginRateLimit = rateLimit({
  windowMs: AUTH_LOGIN_WINDOW_MINUTES * 60 * 1000,
  max: AUTH_LOGIN_MAX_ATTEMPTS,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiados intentos de login. Intenta nuevamente más tarde.' }
})

const normalizeSqlDateToMs = (sqlDate) => {
  if (!sqlDate) return null
  const normalized = `${String(sqlDate).replace(' ', 'T')}Z`
  const timestamp = Date.parse(normalized)
  return Number.isNaN(timestamp) ? null : timestamp
}

const getClientIp = (req) => {
  const forwarded = req.headers['x-forwarded-for']
  if (typeof forwarded === 'string' && forwarded.trim()) {
    return forwarded.split(',')[0].trim()
  }
  return req.ip || 'unknown'
}

const recordLoginAttempt = async ({ username, ip, userAgent, success }) => {
  await dbOps.run(
    'INSERT INTO login_attempts (username, ip, user_agent, success) VALUES (?, ?, ?, ?)',
    [username, ip, userAgent || '', success ? 1 : 0]
  )
}

const getLockStatus = async ({ username, ip }) => {
  const row = await dbOps.get(
    `SELECT COUNT(*) AS failures, MAX(created_at) AS last_failure
     FROM login_attempts
     WHERE username = ?
       AND ip = ?
       AND success = 0
       AND created_at >= datetime('now', ?)`,
    [username, ip, `-${AUTH_LOCK_WINDOW_MINUTES} minutes`]
  )

  const failures = Number(row?.failures || 0)
  if (failures < AUTH_LOCK_MAX_FAILURES) {
    return { locked: false, retryAfterSeconds: 0 }
  }

  const lastFailureAt = normalizeSqlDateToMs(row?.last_failure)
  if (!lastFailureAt) {
    return { locked: false, retryAfterSeconds: 0 }
  }

  const unlockAt = lastFailureAt + AUTH_LOCK_DURATION_MINUTES * 60 * 1000
  const now = Date.now()
  if (now >= unlockAt) {
    return { locked: false, retryAfterSeconds: 0 }
  }

  return {
    locked: true,
    retryAfterSeconds: Math.max(1, Math.ceil((unlockAt - now) / 1000))
  }
}

const setAuthCookie = (res, token) => {
  res.cookie(getCookieName(), token, {
    httpOnly: true,
    sameSite: COOKIE_SAME_SITE,
    secure: COOKIE_SECURE,
    path: '/',
    maxAge: 8 * 60 * 60 * 1000
  })
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.post('/api/auth/login', loginRateLimit, validateBody(loginSchema), async (req, res) => {
  const username = String(req.validatedBody.username || ADMIN_USERNAME).trim()
  const password = req.validatedBody.password
  const ip = getClientIp(req)
  const userAgent = String(req.headers['user-agent'] || '')

  const lockStatus = await getLockStatus({ username, ip })
  if (lockStatus.locked) {
    res.setHeader('Retry-After', String(lockStatus.retryAfterSeconds))
    res.status(429).json({ error: 'Cuenta temporalmente bloqueada por intentos fallidos. Intenta nuevamente más tarde.' })
    return
  }

  const admin = await dbOps.get('SELECT id, username, password_hash FROM admins WHERE username = ?', [username])

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

  const token = signAuthToken({ id: admin.id, username: admin.username }, JWT_SECRET, JWT_EXPIRES_IN)
  setAuthCookie(res, token)
  res.json({ ok: true, username: admin.username })
})

app.post('/api/auth/logout', (_req, res) => {
  res.clearCookie(getCookieName(), {
    httpOnly: true,
    sameSite: COOKIE_SAME_SITE,
    secure: COOKIE_SECURE,
    path: '/'
  })
  res.json({ ok: true })
})

app.get('/api/auth/me', authMiddleware(JWT_SECRET), (req, res) => {
  res.json({ ok: true, username: req.admin.username })
})

const requireAuth = authMiddleware(JWT_SECRET)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: IMAGE_UPLOAD_MAX_BYTES
  }
})

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

const loadBaseProductos = async () => {
  const moduleUrl = `${pathToFileURL(ARTESANIAS_FILE).href}?v=${Date.now()}`
  const mod = await import(moduleUrl)
  return Array.isArray(mod.productos) ? mod.productos : []
}

const persistBaseProductos = async (productosBase) => {
  const fileContent = await fs.readFile(ARTESANIAS_FILE, 'utf-8')
  const replacement = `export const productos = ${JSON.stringify(productosBase, null, 2)};`

  if (!PRODUCTOS_EXPORT_REGEX.test(fileContent)) {
    throw new Error('No se encontró export const productos en artesanias.js')
  }

  const updated = fileContent.replace(PRODUCTOS_EXPORT_REGEX, replacement)
  await fs.writeFile(ARTESANIAS_FILE, updated, 'utf-8')
}

app.post('/api/admin/optimize-image', requireAuth, upload.single('image'), async (req, res) => {
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
    await fs.mkdir(PRODUCT_IMAGES_DIR, { recursive: true })

    tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'ani-upload-'))
    const tempInput = path.join(tempDir, `${baseName}${safeExt}`)
    mapFile = path.join(tempDir, 'mapa-upload.json')
    await fs.writeFile(tempInput, req.file.buffer)

    const scriptPath = path.resolve(process.cwd(), 'scripts/optimizador_imagenes.py')
    await execFile(PYTHON_BIN, [
      scriptPath,
      '--source',
      tempDir,
      '--output',
      PRODUCT_IMAGES_DIR,
      '--process-webp',
      '--target-size',
      String(Math.max(64, IMAGE_TARGET_SIZE)),
      '--max-size',
      String(IMAGE_MAX_SIZE),
      '--quality',
      String(IMAGE_QUALITY),
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
    const imagePath = PRODUCT_IMAGES_PUBLIC_BASE_URL
      ? `${PRODUCT_IMAGES_PUBLIC_BASE_URL}/images/${normalizedRelPath}`
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
})

app.get('/api/admin/image-upload-config', requireAuth, (_req, res) => {
  res.json({
    softBlockMb: Math.max(1, IMAGE_SOFT_BLOCK_MB),
    hardMaxMb: Math.max(1, IMAGE_UPLOAD_MAX_MB),
    softBlockBytes: IMAGE_SOFT_BLOCK_BYTES,
    hardMaxBytes: IMAGE_UPLOAD_MAX_BYTES
  })
})

app.get('/api/admin/login-attempts', requireAuth, async (req, res) => {
  const rawLimit = Number(req.query.limit || 100)
  const limit = Number.isInteger(rawLimit) ? Math.min(Math.max(rawLimit, 1), 500) : 100

  const rows = await dbOps.all(
    `SELECT id, username, ip, user_agent, success, created_at
     FROM login_attempts
     ORDER BY id DESC
     LIMIT ?`,
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
})

app.get('/api/admin/base-productos', requireAuth, async (_req, res) => {
  try {
    const baseProductos = await loadBaseProductos()
    res.json(baseProductos)
  } catch (error) {
    console.error('[base-productos] Error obteniendo productos base', error)
    res.status(500).json({ error: 'No se pudieron cargar los productos base.' })
  }
})

app.delete('/api/admin/base-productos/:id', requireAuth, async (req, res) => {
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
})

app.get('/api/productos', requireAuth, async (_req, res) => {
  const rows = await dbOps.all('SELECT * FROM productos ORDER BY id DESC')
  const data = rows.map((row) => ({
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
  }))
  res.json(data)
})

app.get('/api/public/productos', async (_req, res) => {
  const rows = await dbOps.all('SELECT * FROM productos ORDER BY id DESC')
  const data = rows.map((row) => ({
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
  }))
  res.json(data)
})

app.post('/api/productos', requireAuth, validateBody(productoSchema), async (req, res) => {
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

  const result = await dbOps.run(
    `INSERT INTO productos (nombre, categoria, tipo, tamano, descripcion, colores_json, precio_aproximado, notas, imagen)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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

  res.status(201).json({ id: result.lastID })
})

app.put('/api/productos/:id', requireAuth, validateBody(productoSchema), async (req, res) => {
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
     SET nombre = ?, categoria = ?, tipo = ?, tamano = ?, descripcion = ?, colores_json = ?, precio_aproximado = ?, notas = ?, imagen = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
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

  if (!result.changes) {
    res.status(404).json({ error: 'Producto no encontrado' })
    return
  }

  res.json({ ok: true })
})

app.delete('/api/productos/:id', requireAuth, async (req, res) => {
  const id = Number(req.params.id)
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ error: 'ID inválido' })
    return
  }

  const result = await dbOps.run('DELETE FROM productos WHERE id = ?', [id])
  if (!result.changes) {
    res.status(404).json({ error: 'Producto no encontrado' })
    return
  }

  res.json({ ok: true })
})

app.post('/api/public/contacto', validateBody(contactoSchema), async (req, res) => {
  const payload = req.validatedBody

  await dbOps.run(
    'INSERT INTO mensajes (nombre, email, telefono, asunto, mensaje, fecha) VALUES (?, ?, ?, ?, ?, ?)',
    [payload.nombre, payload.email, payload.telefono || '', payload.asunto, payload.mensaje, new Date().toLocaleString('es-CL')]
  )

  res.status(201).json({ ok: true })
})

app.post('/api/public/suscriptores', validateBody(suscriptorSchema), async (req, res) => {
  const email = req.validatedBody.email.toLowerCase()

  try {
    await dbOps.run('INSERT INTO suscriptores (email) VALUES (?)', [email])
    res.status(201).json({ ok: true })
  } catch {
    res.status(409).json({ error: 'Email ya registrado' })
  }
})

app.get('/api/mensajes', requireAuth, async (_req, res) => {
  const rows = await dbOps.all('SELECT id, nombre, email, telefono, asunto, mensaje, fecha FROM mensajes ORDER BY id DESC')
  res.json(rows)
})

app.get('/api/suscriptores', requireAuth, async (_req, res) => {
  const rows = await dbOps.all('SELECT id, email, created_at FROM suscriptores ORDER BY id DESC')
  res.json(rows)
})

app.delete('/api/suscriptores/:id', requireAuth, async (req, res) => {
  const id = Number(req.params.id)
  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({ error: 'ID inválido' })
    return
  }

  const result = await dbOps.run('DELETE FROM suscriptores WHERE id = ?', [id])
  if (!result.changes) {
    res.status(404).json({ error: 'Suscriptor no encontrado' })
    return
  }

  res.json({ ok: true })
})

app.use((error, _req, res, _next) => {
  if (String(error?.message || '').includes('Origen no permitido por CORS')) {
    res.status(403).json({ error: 'Origen no permitido por CORS' })
    return
  }

  if (error?.code === 'LIMIT_FILE_SIZE') {
    res.status(413).json({ error: `La imagen excede el límite permitido de ${Math.max(1, IMAGE_UPLOAD_MAX_MB)} MB.` })
    return
  }

  console.error(error)
  res.status(500).json({ error: 'Error interno del servidor' })
})

app.listen(PORT, () => {
  console.log(`[api] Backend escuchando en http://localhost:${PORT}`)
})
