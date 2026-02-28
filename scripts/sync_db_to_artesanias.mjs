import { productos as productosJs } from '../src/data/artesanias.js'
import { resolve } from 'node:path'
import { writeFileSync, readFileSync } from 'node:fs'
import sqlite3 from 'sqlite3'

const ARTESANIAS_PATH = resolve(process.cwd(), 'src/data/artesanias.js')
const DB_PATH = resolve(process.cwd(), 'backend/data/ani.sqlite')
const sqlite = sqlite3.verbose()
const db = new sqlite.Database(DB_PATH)

function normalizeName(str) {
  return String(str || '')
    .normalize('NFKD')
    .replace(/\s+/g, '')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

function getDbProducts() {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM productos', (err, rows) => {
      if (err) reject(err)
      else resolve(rows)
    })
  })
}

function mergeProducts(dbProducts, jsProducts) {
  const jsNormalized = jsProducts.map(p => ({ ...p, _norm: normalizeName(p.nombre) }))
  const dbNormalized = dbProducts.map(p => ({ ...p, _norm: normalizeName(p.nombre) }))
  const merged = [...jsNormalized]
  for (const dbProd of dbNormalized) {
    if (!merged.some(p => p._norm === dbProd._norm)) {
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
  // Remove _norm property
  return merged.map(({ _norm, ...rest }) => rest)
}

async function sync() {
  const dbProducts = await getDbProducts()
  const merged = mergeProducts(dbProducts, productosJs)
  // Leer artesanias.js usando readFileSync directamente
    const fileContent = readFileSync(ARTESANIAS_PATH, 'utf8')
  // Reemplazar productos array
  const productosExportRegex = /export const productos = \[[\s\S]*?\n\];/
  const replacement = `export const productos = ${JSON.stringify(merged, null, 2)};`
  if (!productosExportRegex.test(fileContent)) {
    throw new Error('No se encontró export const productos en artesanias.js')
  }
  const updated = fileContent.replace(productosExportRegex, replacement)
    writeFileSync(ARTESANIAS_PATH, updated, 'utf8')
  console.log(`Sincronización completa: ${merged.length} productos en artesanias.js`)
  db.close()
}

sync().catch(err => {
  console.error('Error al sincronizar productos:', err)
  db.close()
})
