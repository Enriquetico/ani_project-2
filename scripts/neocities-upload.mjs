import { readFileSync, readdirSync, statSync } from 'node:fs'
import { relative, resolve } from 'node:path'
import { createRequire } from 'node:module'

// Load .env.production so NEOCITIES_API_KEY can live there
const require = createRequire(import.meta.url)
try {
  const dotenv = require('dotenv')
  dotenv.config({ path: '.env.production' })
  dotenv.config()
} catch {
  // dotenv not available; rely on environment variables set externally
}

const NEOCITIES_API_KEY = process.env.NEOCITIES_API_KEY
const DIST_DIR = resolve(process.cwd(), 'dist')
const BATCH_SIZE = 15          // files per request
const BATCH_DELAY_MS = 600     // ms between batches to respect rate limits

if (!NEOCITIES_API_KEY) {
  console.error('Error: falta NEOCITIES_API_KEY.')
  console.error('Agrega NEOCITIES_API_KEY=<tu-api-key> en .env.production o como variable de entorno.')
  console.error('Obtén tu API key en: https://neocities.org/settings#api_key')
  process.exit(1)
}

const collectFiles = (dir) => {
  const files = []
  for (const entry of readdirSync(dir)) {
    const full = resolve(dir, entry)
    if (statSync(full).isDirectory()) {
      files.push(...collectFiles(full))
    } else {
      files.push(full)
    }
  }
  return files
}

const uploadBatch = async (batch) => {
  const formData = new FormData()
  for (const { neocitiesPath, fullPath } of batch) {
    const content = readFileSync(fullPath)
    formData.append(neocitiesPath, new Blob([content]))
  }

  const response = await fetch('https://neocities.org/api/upload', {
    method: 'POST',
    headers: { Authorization: `Bearer ${NEOCITIES_API_KEY}` },
    body: formData
  })

  const json = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(json.message || `HTTP ${response.status}`)
  }

  return json
}

const sleep = (ms) => new Promise((res) => setTimeout(res, ms))

const allFiles = collectFiles(DIST_DIR).map((fullPath) => ({
  fullPath,
  neocitiesPath: relative(DIST_DIR, fullPath).replaceAll('\\', '/')
}))

if (allFiles.length === 0) {
  console.error('dist/ está vacío. Ejecuta primero: npm run build:neocities')
  process.exit(1)
}

console.log(`Subiendo ${allFiles.length} archivos a Neocities en lotes de ${BATCH_SIZE}...\n`)

let uploaded = 0
let failed = 0

for (let i = 0; i < allFiles.length; i += BATCH_SIZE) {
  const batch = allFiles.slice(i, i + BATCH_SIZE)

  process.stdout.write(`[${i + 1}–${Math.min(i + BATCH_SIZE, allFiles.length)}/${allFiles.length}] `)

  try {
    await uploadBatch(batch)
    uploaded += batch.length
    console.log(`✓ ${batch.map((f) => f.neocitiesPath).join(', ')}`)
  } catch (err) {
    failed += batch.length
    console.error(`✗ Error en lote: ${err.message}`)
    console.error(`  Archivos: ${batch.map((f) => f.neocitiesPath).join(', ')}`)
  }

  if (i + BATCH_SIZE < allFiles.length) {
    await sleep(BATCH_DELAY_MS)
  }
}

console.log(`\nSubida completada: ${uploaded} archivos exitosos, ${failed} fallidos.`)

if (failed > 0) {
  process.exit(1)
}
