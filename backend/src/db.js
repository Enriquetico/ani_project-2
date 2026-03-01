import { Pool } from 'pg'
import bcrypt from 'bcryptjs'

const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
  throw new Error('Falta DATABASE_URL en variables de entorno')
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
})

export const query = async (sql, params = []) => pool.query(sql, params)

export const dbOps = {
  query,
  all: async (sql, params = []) => {
    const result = await query(sql, params)
    return result.rows
  },
  get: async (sql, params = []) => {
    const result = await query(sql, params)
    return result.rows[0] || null
  },
  run: async (sql, params = []) => {
    const result = await query(sql, params)
    return {
      rowCount: result.rowCount,
      rows: result.rows
    }
  }
}

export const initDb = async ({ adminUsername, adminPassword }) => {
  await query(`
    CREATE TABLE IF NOT EXISTS admins (
      id SERIAL PRIMARY KEY,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `)

  await query(`
    CREATE TABLE IF NOT EXISTS productos (
      id SERIAL PRIMARY KEY,
      nombre TEXT NOT NULL,
      categoria TEXT,
      tipo TEXT,
      tamano TEXT,
      descripcion TEXT,
      colores_json TEXT,
      precio_aproximado TEXT,
      notas TEXT,
      imagen TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `)

  await query(`
    CREATE TABLE IF NOT EXISTS mensajes (
      id SERIAL PRIMARY KEY,
      nombre TEXT NOT NULL,
      email TEXT NOT NULL,
      telefono TEXT,
      asunto TEXT NOT NULL,
      mensaje TEXT NOT NULL,
      fecha TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `)

  await query(`
    CREATE TABLE IF NOT EXISTS suscriptores (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `)

  await query(`
    CREATE TABLE IF NOT EXISTS login_attempts (
      id SERIAL PRIMARY KEY,
      username TEXT NOT NULL,
      ip TEXT NOT NULL,
      user_agent TEXT,
      success BOOLEAN NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `)

  await query('CREATE INDEX IF NOT EXISTS idx_login_attempts_user_ip_created ON login_attempts (username, ip, created_at)')

  const adminRow = await dbOps.get('SELECT id, password_hash FROM admins WHERE username = $1', [adminUsername])

  if (!adminRow) {
    const hash = await bcrypt.hash(adminPassword, 12)
    await query('INSERT INTO admins (username, password_hash) VALUES ($1, $2)', [adminUsername, hash])
    return
  }

  const matchesCurrentPassword = await bcrypt.compare(adminPassword, adminRow.password_hash)
  if (!matchesCurrentPassword) {
    const hash = await bcrypt.hash(adminPassword, 12)
    await query('UPDATE admins SET password_hash = $1 WHERE id = $2', [hash, adminRow.id])
  }
}
