import dotenv from 'dotenv'
import { Pool } from 'pg'

dotenv.config({ path: '.env.backend' })
dotenv.config()

const DATABASE_URL = process.env.DATABASE_URL
const adminUsername = process.env.ADMIN_USERNAME || 'admin'
const clearAllUsers = process.argv.includes('--all-users')

if (!DATABASE_URL) {
  console.error('[admin:unlock] Falta DATABASE_URL en variables de entorno.')
  process.exit(1)
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

try {
  const query = clearAllUsers
    ? 'DELETE FROM login_attempts WHERE success = false'
    : 'DELETE FROM login_attempts WHERE success = false AND username = $1'
  const params = clearAllUsers ? [] : [adminUsername]
  const result = await pool.query(query, params)

  const scope = clearAllUsers ? 'todos los usuarios' : `usuario "${adminUsername}"`
  console.log(`[admin:unlock] Eliminados ${result.rowCount} intentos fallidos para ${scope}.`)
} catch (error) {
  console.error('[admin:unlock] No se pudo limpiar login_attempts:', error.message)
  process.exitCode = 1
} finally {
  await pool.end()
}
