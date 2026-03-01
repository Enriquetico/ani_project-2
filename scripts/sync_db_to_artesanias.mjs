import dotenv from 'dotenv'
import { Pool } from 'pg'
import { productos as productosJs } from '../src/data/artesanias.js'
import { resolve } from 'node:path'
import { writeFileSync, readFileSync } from 'node:fs'

dotenv.config({ path: '.env.backend' })
dotenv.config()

const ARTESANIAS_PATH = resolve(process.cwd(), 'src/data/artesanias.js')
const DATABASE_URL = process.env.DATABASE_URL

function normalizeName(str) {
  return String(str || '')
    .normalize('NFKD')
    .replace(/\s+/g, '')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

function mergeProducts(dbProducts, jsProducts) {
  const jsNormalized = jsProducts.map((p) => ({ ...p, _norm: normalizeName(p.nombre) }))
  const dbNormalized = dbProducts.map((p) => ({ ...p, _norm: normalizeName(p.nombre) }))
  const merged = [...jsNormalized]

  for (const dbProd of dbNormalized) {
    if (!merged.some((p) => p._norm === dbProd._norm)) {
      merged.push({
        id: dbProd.id,
        nombre: dbProd.nombre,
        categoria: dbProd.categoria,
        tipo: dbProd.tipo,
        descripcion: dbProd.descripcion,
        imagen: dbProd.imagen,
        colores: dbProd.colores_json ? JSON.parse(dbProd.colores_json) : [],
        tamaño: dbProd.tamano,
        precioAproximado: dbProd.precio_aproximado,
        notas: dbProd.notas
      })
    }
  }

  return merged.map(({ _norm, ...rest }) => rest)
}

async function sync() {
  if (!DATABASE_URL) {
    console.log('[sync:productos] DATABASE_URL no definido. Se omite sincronización con DB.')
    return
  }

  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  })

  try {
    const dbProductsResult = await pool.query('SELECT * FROM productos')
    const merged = mergeProducts(dbProductsResult.rows, productosJs)
    const fileContent = readFileSync(ARTESANIAS_PATH, 'utf8')

    const productosExportRegex = /export const productos = \[[\s\S]*?\n\];/
    const replacement = `export const productos = ${JSON.stringify(merged, null, 2)};`

    if (!productosExportRegex.test(fileContent)) {
      throw new Error('No se encontró export const productos en artesanias.js')
    }

    const updated = fileContent.replace(productosExportRegex, replacement)
    writeFileSync(ARTESANIAS_PATH, updated, 'utf8')

    console.log(`Sincronización completa: ${merged.length} productos en artesanias.js`)
  } finally {
    await pool.end()
  }
}

sync().catch((err) => {
  console.error('Error al sincronizar productos:', err)
  process.exitCode = 1
})
