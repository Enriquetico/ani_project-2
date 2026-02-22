import fs from 'node:fs'
import path from 'node:path'

const imagesDir = path.resolve(process.cwd(), 'public/images')

if (!fs.existsSync(imagesDir)) {
  console.error('[validate:images] No existe el directorio public/images')
  process.exit(1)
}

const allowedExt = new Set(['.webp', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.avif'])
const kebabNameRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const invalidFiles = []

for (const entry of fs.readdirSync(imagesDir, { withFileTypes: true })) {
  if (!entry.isFile()) continue

  const fileName = entry.name
  const ext = path.extname(fileName)
  const base = path.basename(fileName, ext)

  if (!allowedExt.has(ext.toLowerCase())) {
    invalidFiles.push({
      fileName,
      reason: `extensión no permitida (${ext || 'sin extensión'})`
    })
    continue
  }

  if (!kebabNameRegex.test(base)) {
    invalidFiles.push({
      fileName,
      reason: 'debe estar en minúsculas y kebab-case (solo a-z, 0-9 y guiones)'
    })
  }
}

if (invalidFiles.length) {
  console.error('\n[validate:images] Se detectaron nombres de imagen no válidos:\n')
  for (const item of invalidFiles) {
    console.error(`- ${item.fileName}: ${item.reason}`)
  }

  console.error('\nFormato esperado: ejemplo-producto-123.webp\n')
  process.exit(1)
}

console.log('[validate:images] OK: nombres de imágenes válidos en public/images')
