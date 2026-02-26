import dotenv from 'dotenv'
import path from 'node:path'
import sqlite3 from 'sqlite3'

dotenv.config({ path: '.env.backend' })
dotenv.config()

const DEFAULT_DB_PATH = path.resolve(process.cwd(), 'backend/data/ani.sqlite')
const dbPath = path.resolve(process.cwd(), process.env.DB_PATH || DEFAULT_DB_PATH)
const adminUsername = process.env.ADMIN_USERNAME || 'admin'
const clearAllUsers = process.argv.includes('--all-users')

const sqlite = sqlite3.verbose()
const db = new sqlite.Database(dbPath)

const run = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.run(sql, params, function onRun(error) {
      if (error) {
        reject(error)
        return
      }

      resolve({ changes: this.changes })
    })
  })

const closeDb = () =>
  new Promise((resolve, reject) => {
    db.close((error) => {
      if (error) {
        reject(error)
        return
      }

      resolve()
    })
  })

try {
  const query = clearAllUsers
    ? 'DELETE FROM login_attempts WHERE success = 0'
    : 'DELETE FROM login_attempts WHERE success = 0 AND username = ?'
  const params = clearAllUsers ? [] : [adminUsername]
  const { changes } = await run(query, params)

  const scope = clearAllUsers ? 'todos los usuarios' : `usuario "${adminUsername}"`
  console.log(`[admin:unlock] Eliminados ${changes} intentos fallidos para ${scope}.`)
} catch (error) {
  console.error('[admin:unlock] No se pudo limpiar login_attempts:', error.message)
  process.exitCode = 1
} finally {
  await closeDb()
}
