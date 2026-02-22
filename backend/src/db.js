import fs from 'node:fs'
import path from 'node:path'
import sqlite3 from 'sqlite3'
import bcrypt from 'bcryptjs'

const DEFAULT_DB_PATH = path.resolve(process.cwd(), 'backend/data/ani.sqlite')
const DB_PATH = path.resolve(process.cwd(), process.env.DB_PATH || DEFAULT_DB_PATH)
const DATA_DIR = path.dirname(DB_PATH)

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

const sqlite = sqlite3.verbose()
const db = new sqlite.Database(DB_PATH)

const run = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.run(sql, params, function onRun(error) {
      if (error) {
        reject(error)
        return
      }
      resolve({ lastID: this.lastID, changes: this.changes })
    })
  })

const get = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.get(sql, params, (error, row) => {
      if (error) {
        reject(error)
        return
      }
      resolve(row)
    })
  })

const all = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.all(sql, params, (error, rows) => {
      if (error) {
        reject(error)
        return
      }
      resolve(rows)
    })
  })

export const initDb = async ({ adminUsername, adminPassword }) => {
  await run(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `)

  await run(`
    CREATE TABLE IF NOT EXISTS productos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      categoria TEXT,
      tipo TEXT,
      tamano TEXT,
      descripcion TEXT,
      colores_json TEXT,
      precio_aproximado TEXT,
      notas TEXT,
      imagen TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `)

  await run(`
    CREATE TABLE IF NOT EXISTS mensajes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      email TEXT NOT NULL,
      telefono TEXT,
      asunto TEXT NOT NULL,
      mensaje TEXT NOT NULL,
      fecha TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `)

  await run(`
    CREATE TABLE IF NOT EXISTS suscriptores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `)

  await run(`
    CREATE TABLE IF NOT EXISTS login_attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      ip TEXT NOT NULL,
      user_agent TEXT,
      success INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `)

  await run('CREATE INDEX IF NOT EXISTS idx_login_attempts_user_ip_created ON login_attempts (username, ip, created_at)')

  const existingAdmin = await get('SELECT id FROM admins WHERE username = ?', [adminUsername])

  if (!existingAdmin) {
    const hash = await bcrypt.hash(adminPassword, 12)
    await run('INSERT INTO admins (username, password_hash) VALUES (?, ?)', [adminUsername, hash])
    return
  }

  const adminRow = await get('SELECT id, password_hash FROM admins WHERE username = ?', [adminUsername])
  if (!adminRow?.password_hash) return

  const matchesCurrentPassword = await bcrypt.compare(adminPassword, adminRow.password_hash)
  if (!matchesCurrentPassword) {
    const hash = await bcrypt.hash(adminPassword, 12)
    await run('UPDATE admins SET password_hash = ? WHERE id = ?', [hash, adminRow.id])
  }
}

export const dbOps = { run, get, all }
