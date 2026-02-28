import { productos, articulos } from '../data/artesanias.js'

const configuredSiteUrl =
  (typeof process !== 'undefined' && process?.env?.SITE_URL) ||
  (typeof import.meta !== 'undefined' && import.meta?.env?.VITE_SITE_URL) ||
  'https://artesaniasani.onrender.com'

export const baseUrl = String(configuredSiteUrl).replace(/\/+$/, '')
export const defaultImage = `${baseUrl}/images/og-artesanias-1200x630.jpg`
export const defaultKeywords = 'artesanías, cerámica pintada, velas decorativas, artesanía costarricense'

const toAbsoluteUrl = (url) => {
  if (!url) return defaultImage
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`
}

export const getSeoForRoute = (path) => {
  let title = 'Artesanías Anita | Cerámica Pintada, Velas Decorativas y Artesanía costarricense'
  let description = 'Artesanías Anita ofrece cerámica pintada a mano, velas decorativas y artesanía costarricense hecha con dedicación y calidad.'
  let robots = 'index, follow'
  let image = defaultImage

  if (path === '/galeria') {
    title = 'Galería de Productos | Artesanías Anita'
    description = 'Explora nuestra galería de piezas artesanales: cerámica pintada a mano, figuras decorativas y velas personalizadas.'
  } else if (path === '/sobre') {
    title = 'Sobre Artesanías Anita | Historia y Proceso Artesanal'
    description = 'Conoce la historia de Artesanías Anita, sus valores y el proceso detrás de cada pieza hecha a mano.'
    image = toAbsoluteUrl('/images/fotoanita.webp')
  } else if (path === '/contacto') {
    title = 'Contacto | Artesanías Anita'
    description = 'Contáctanos por WhatsApp o email para crear tu pieza artesanal personalizada en cerámica o velas.'
  } else if (path === '/blog') {
    title = 'Blog de Artesanías Anita | Novedades y Tips'
    description = 'Lee artículos sobre artesanía, creatividad, decoración y novedades de nuestros diseños personalizados.'
  } else if (path.startsWith('/producto/')) {
    const id = Number(path.split('/').pop())
    const producto = productos.find((item) => item.id === id)

    if (producto) {
      title = `${producto.nombre} | Artesanías Anita`
      description = producto.descripcion
      image = toAbsoluteUrl(producto.imagen)
    } else {
      title = 'Producto no encontrado | Artesanías Anita'
      description = 'No encontramos el producto solicitado. Explora nuestra galería para descubrir más artesanías.'
      robots = 'noindex, follow'
    }
  } else if (path.startsWith('/blog/')) {
    const id = Number(path.split('/').pop())
    const articulo = articulos.find((item) => item.id === id)

    if (articulo) {
      title = `${articulo.titulo} | Blog Artesanías Anita`
      description = articulo.resumen
      image = toAbsoluteUrl(articulo.imagen)
    } else {
      title = 'Artículo no encontrado | Blog Artesanías Anita'
      description = 'No encontramos el artículo solicitado. Visita nuestro blog para leer más contenido.'
      robots = 'noindex, follow'
    }
  } else if (path === '/admin') {
    title = 'Panel de Administración | Artesanías Anita'
    description = 'Acceso administrativo de Artesanías Anita.'
    robots = 'noindex, nofollow'
  } else if (path === '/404' || path === '/:pathMatch(.*)*') {
    title = 'Página no encontrada | Artesanías Anita'
    description = 'La página solicitada no existe. Explora nuestras artesanías y contenido principal.'
    robots = 'noindex, follow'
  }

  const canonical = `${baseUrl}${path === '/' ? '/' : path}`

  return {
    title,
    description,
    robots,
    image,
    canonical
  }
}
