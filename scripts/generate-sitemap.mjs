import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { productos, articulos } from '../src/data/artesanias.js'

const sitemapPath = resolve(process.cwd(), 'public', 'sitemap.xml')
const baseUrl = String(process.env.SITE_URL || 'https://artesaniasani-web.onrender.com').replace(/\/+$/, '')

const today = new Date().toISOString().slice(0, 10)

const staticPages = [
  { path: '/', priority: '1.0' },
  { path: '/galeria', priority: '0.8' },
  { path: '/sobre', priority: '0.6' },
  { path: '/contacto', priority: '0.6' },
  { path: '/blog', priority: '0.7' }
]

const blogPages = articulos.map((articulo) => ({
  path: `/blog/${articulo.id}`,
  priority: '0.6'
}))

const productPages = productos.map((producto) => ({
  path: `/producto/${producto.id}`,
  priority: '0.65'
}))

const allPages = [...staticPages, ...blogPages, ...productPages]

const entries = allPages
  .map(({ path, priority }) => {
    const url = `${baseUrl}${path}`

    return [
      '  <url>',
      `    <loc>${url}</loc>`,
      `    <lastmod>${today}</lastmod>`,
      `    <priority>${priority}</priority>`,
      '  </url>'
    ].join('\n')
  })
  .join('\n')

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  entries,
  '</urlset>',
  ''
].join('\n')

writeFileSync(sitemapPath, sitemap, 'utf8')

console.log(`Sitemap regenerado (${allPages.length} URLs) con lastmod=${today}`)
