import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { resolve, relative } from 'node:path'
import { imageSize } from 'image-size'
import { defaultKeywords, getSeoForRoute } from '../src/seo/route-seo.js'

const distDir = resolve(process.cwd(), 'dist')
const defaultImageWidth = 1200
const defaultImageHeight = 630

const getMimeTypeFromImage = (imageUrl) => {
  const normalized = imageUrl.split('?')[0].split('#')[0].toLowerCase()

  if (normalized.endsWith('.webp')) return 'image/webp'
  if (normalized.endsWith('.png')) return 'image/png'
  if (normalized.endsWith('.gif')) return 'image/gif'
  if (normalized.endsWith('.svg')) return 'image/svg+xml'
  if (normalized.endsWith('.avif')) return 'image/avif'

  return 'image/jpeg'
}

const getImageDimensions = (imageUrl) => {
  try {
    const urlPath = new URL(imageUrl).pathname
    const imagePath = resolve(distDir, `.${urlPath}`)

    if (!existsSync(imagePath)) {
      return { width: defaultImageWidth, height: defaultImageHeight }
    }

    const dimensions = imageSize(imagePath)

    if (!dimensions.width || !dimensions.height) {
      return { width: defaultImageWidth, height: defaultImageHeight }
    }

    return { width: dimensions.width, height: dimensions.height }
  } catch {
    return { width: defaultImageWidth, height: defaultImageHeight }
  }
}

const getTwitterCardType = (width, height) => {
  if (!width || !height) return 'summary_large_image'
  return width > height ? 'summary_large_image' : 'summary'
}

const getForcedTwitterCardForRoute = (path) => {
  if (path === '/' || path === '/galeria' || path === '/blog') return 'summary_large_image'
  return null
}

const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')

const routeFromFile = (filePath) => {
  const rel = relative(distDir, filePath).replaceAll('\\', '/')

  if (rel === 'index.html') return '/'

  if (rel.endsWith('/index.html')) {
    const route = `/${rel.slice(0, -'/index.html'.length)}`
    return route || '/'
  }

  if (rel.endsWith('.html')) {
    return `/${rel.slice(0, -'.html'.length)}`
  }

  return '/'
}

const getSeoForRouteForDist = (path) => {
  const seo = getSeoForRoute(path)
  const imageType = getMimeTypeFromImage(seo.image)
  const imageDimensions = getImageDimensions(seo.image)
  const forcedTwitterCard = getForcedTwitterCardForRoute(path)
  const twitterCard = forcedTwitterCard ?? getTwitterCardType(imageDimensions.width, imageDimensions.height)

  return {
    ...seo,
    imageType,
    imageWidth: imageDimensions.width,
    imageHeight: imageDimensions.height,
    twitterCard
  }
}

const buildSeoBlock = (seo) => {
  const title = escapeHtml(seo.title)
  const description = escapeHtml(seo.description)
  const canonical = escapeHtml(seo.canonical)
  const image = escapeHtml(seo.image)
  const imageType = escapeHtml(seo.imageType)
  const imageWidth = escapeHtml(seo.imageWidth)
  const imageHeight = escapeHtml(seo.imageHeight)
  const twitterCard = escapeHtml(seo.twitterCard)
  const robots = escapeHtml(seo.robots)

  return [
    '    <!-- SEO:BEGIN -->',
    `    <title>${title}</title>`,
    `    <meta name="description" content="${description}">`,
    `    <meta name="keywords" content="${defaultKeywords}">`,
    '    <meta name="author" content="Artesanías Anita">',
    `    <meta name="robots" content="${robots}">`,
    `    <link rel="canonical" href="${canonical}">`,
    `    <meta property="og:title" content="${title}">`,
    `    <meta property="og:description" content="${description}">`,
    `    <meta property="og:image" content="${image}">`,
    `    <meta property="og:image:width" content="${imageWidth}">`,
    `    <meta property="og:image:height" content="${imageHeight}">`,
    `    <meta property="og:image:type" content="${imageType}">`,
    '    <meta property="og:type" content="website">',
    '    <meta property="og:site_name" content="Artesanías Anita">',
    `    <meta property="og:url" content="${canonical}">`,
    `    <meta name="twitter:card" content="${twitterCard}">`,
    `    <meta name="twitter:title" content="${title}">`,
    `    <meta name="twitter:description" content="${description}">`,
    `    <meta name="twitter:image" content="${image}">`,
    '    <!-- SEO:END -->'
  ].join('\n')
}

const cleanExistingSeo = (html) => {
  return html
    .replace(/\s*<!-- SEO:BEGIN -->[\s\S]*?<!-- SEO:END -->\s*/g, '\n')
    .replace(/\s*<title>[\s\S]*?<\/title>\s*/g, '\n')
    .replace(/\s*<meta[^>]+name="description"[^>]*>\s*/g, '\n')
    .replace(/\s*<meta[^>]+name="keywords"[^>]*>\s*/g, '\n')
    .replace(/\s*<meta[^>]+name="author"[^>]*>\s*/g, '\n')
    .replace(/\s*<meta[^>]+name="robots"[^>]*>\s*/g, '\n')
    .replace(/\s*<meta[^>]+name="twitter:[^"]+"[^>]*>\s*/g, '\n')
    .replace(/\s*<meta[^>]+property="og:[^"]+"[^>]*>\s*/g, '\n')
    .replace(/\s*<link[^>]+rel="canonical"[^>]*>\s*/g, '\n')
}

const getHtmlFiles = (dir) => {
  const entries = readdirSync(dir)
  const htmlFiles = []

  for (const entry of entries) {
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

const files = getHtmlFiles(distDir)

for (const filePath of files) {
  const route = routeFromFile(filePath)
  const seo = getSeoForRouteForDist(route)
  const seoBlock = buildSeoBlock(seo)

  const raw = readFileSync(filePath, 'utf8')
  const withoutSeo = cleanExistingSeo(raw)
  const updated = withoutSeo.replace(/<\/head>/i, `${seoBlock}\n  </head>`)

  writeFileSync(filePath, updated, 'utf8')
}

console.log(`Metadatos SEO inyectados en ${files.length} archivos HTML de dist`)
