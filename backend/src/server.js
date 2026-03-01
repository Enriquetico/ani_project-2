import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'
import path from 'node:path'
import { initDb, dbOps, query } from './db.js'
import { authMiddleware, getCookieName, signAuthToken } from './auth.js'
import {
  createApiController,
  loginSchema,
  productoSchema,
  contactoSchema,
  suscriptorSchema
} from './controllers/apiController.js'
import { createApiRouter } from './routes/apiRoutes.js'

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
const IMAGE_SOFT_BLOCK_BYTES = Math.max(1, IMAGE_SOFT_BLOCK_MB) * 1024 * 1024

const ARTESANIAS_FILE = path.resolve(process.cwd(), 'src/data/artesanias.js')
const PRODUCTOS_EXPORT_REGEX = /export const productos = \[[\s\S]*?\n\];/

const ALLOWED_ORIGINS = FRONTEND_ORIGIN
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

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

const loginRateLimit = rateLimit({
  windowMs: AUTH_LOGIN_WINDOW_MINUTES * 60 * 1000,
  max: AUTH_LOGIN_MAX_ATTEMPTS,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiados intentos de login. Intenta nuevamente más tarde.' }
})

const requireAuth = authMiddleware(JWT_SECRET)

const controller = createApiController({
  dbOps,
  query,
  signAuthToken,
  getCookieName,
  env: {
    adminUsername: ADMIN_USERNAME,
    jwtSecret: JWT_SECRET,
    jwtExpiresIn: JWT_EXPIRES_IN
  },
  authConfig: {
    cookieSameSite: COOKIE_SAME_SITE,
    cookieSecure: COOKIE_SECURE,
    lockWindowMinutes: AUTH_LOCK_WINDOW_MINUTES,
    lockMaxFailures: AUTH_LOCK_MAX_FAILURES,
    lockDurationMinutes: AUTH_LOCK_DURATION_MINUTES
  },
  imageConfig: {
    productImagesDir: PRODUCT_IMAGES_DIR,
    productImagesPublicBaseUrl: PRODUCT_IMAGES_PUBLIC_BASE_URL,
    pythonBin: PYTHON_BIN,
    imageTargetSize: IMAGE_TARGET_SIZE,
    imageMaxSize: IMAGE_MAX_SIZE,
    imageQuality: IMAGE_QUALITY,
    imageSoftBlockMb: IMAGE_SOFT_BLOCK_MB,
    imageSoftBlockBytes: IMAGE_SOFT_BLOCK_BYTES
  },
  artifactsConfig: {
    artesaniasFile: ARTESANIAS_FILE,
    productosExportRegex: PRODUCTOS_EXPORT_REGEX
  }
})

app.get('/test-db', controller.testDb)

app.use(
  '/api',
  createApiRouter({
    controller,
    requireAuth,
    loginRateLimit,
    schemas: {
      loginSchema,
      productoSchema,
      contactoSchema,
      suscriptorSchema
    }
  })
)

app.use((error, _req, res, _next) => {
  if (String(error?.message || '').includes('Origen no permitido por CORS')) {
    res.status(403).json({ error: 'Origen no permitido por CORS' })
    return
  }

  console.error(error)
  res.status(500).json({ error: 'Error interno del servidor' })
})

app.listen(PORT, () => {
  console.log(`[api] Backend escuchando en http://localhost:${PORT}`)
})
