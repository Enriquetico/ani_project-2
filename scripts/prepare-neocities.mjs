import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { dirname, resolve, relative } from 'node:path'

const distDir = resolve(process.cwd(), 'dist')
const indexFile = resolve(distDir, 'index.html')
const notFoundFile = resolve(distDir, '404.html')
const noJekyllFile = resolve(distDir, '.nojekyll')

const getHtmlFiles = (dir) => {
  const htmlFiles = []

  for (const entry of readdirSync(dir)) {
    const fullPath = resolve(dir, entry)
    const stat = statSync(fullPath)

    if (stat.isDirectory()) {
      htmlFiles.push(...getHtmlFiles(fullPath))
      continue
    }

    if (fullPath.endsWith('.html')) {
      htmlFiles.push(fullPath)
    }
  }

  return htmlFiles
}

const createDirectoryRoutes = () => {
  const htmlFiles = getHtmlFiles(distDir)

  for (const filePath of htmlFiles) {
    const rel = relative(distDir, filePath).replaceAll('\\', '/')

    if (rel === 'index.html' || rel === '404.html') continue

    if (rel.endsWith('/index.html')) continue

    if (!rel.endsWith('.html')) continue

    const routeWithoutExt = rel.slice(0, -'.html'.length)
    const target = resolve(distDir, routeWithoutExt, 'index.html')

    mkdirSync(dirname(target), { recursive: true })
    copyFileSync(filePath, target)
  }
}

if (!existsSync(indexFile)) {
  throw new Error('No se encontró dist/index.html. Ejecuta primero el build de Vite.')
}

if (!existsSync(notFoundFile)) {
  copyFileSync(indexFile, notFoundFile)
}
writeFileSync(noJekyllFile, '')
createDirectoryRoutes()

console.log('Neocities listo: verificado dist/404.html, creado dist/.nojekyll y rutas tipo /ruta/index.html')
