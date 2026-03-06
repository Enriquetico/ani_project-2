import { articulos, empresaInfo, productos } from '../data/artesanias.js'
import { baseUrl } from './route-seo.js'

const BRAND_NAME = 'Artesanías Anita'
const BRAND_LOGO = `${baseUrl}/images/logoanita-180x180.png`
const BRAND_IMAGE = `${baseUrl}/images/og-artesanias-1200x630.jpg`

const monthMap = {
  enero: '01',
  febrero: '02',
  marzo: '03',
  abril: '04',
  mayo: '05',
  junio: '06',
  julio: '07',
  agosto: '08',
  septiembre: '09',
  setiembre: '09',
  octubre: '10',
  noviembre: '11',
  diciembre: '12'
}

const toAbsoluteUrl = (url) => {
  if (!url) return BRAND_IMAGE
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`
}

const toSlug = (value) => String(value || '')
  .trim()
  .toLowerCase()
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/(^-|-$)/g, '')

const toIsoFromMonthYear = (value) => {
  const input = String(value || '').trim().toLowerCase()
  const match = input.match(/^([a-záéíóúüñ]+)\s+(\d{4})$/i)
  if (!match) return null
  const month = monthMap[match[1].normalize('NFKD').replace(/[\u0300-\u036f]/g, '')]
  if (!month) return null
  return `${match[2]}-${month}-01`
}

const businessBase = {
  '@context': 'https://schema.org',
  '@type': 'Store',
  name: BRAND_NAME,
  image: BRAND_IMAGE,
  url: `${baseUrl}/`,
  description: 'Cerámica pintada a mano y velas decorativas artesanales.',
  logo: BRAND_LOGO,
  telephone: empresaInfo.contacto.whatsapp,
  email: empresaInfo.contacto.email,
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'CR'
  },
  areaServed: {
    '@type': 'Country',
    name: 'Costa Rica'
  },
  sameAs: [empresaInfo.contacto.instagram, empresaInfo.contacto.facebook].filter(Boolean)
}

const websiteBase = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: BRAND_NAME,
  url: `${baseUrl}/`
}

const organizationBase = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: BRAND_NAME,
  url: `${baseUrl}/`,
  logo: BRAND_LOGO,
  sameAs: [empresaInfo.contacto.instagram, empresaInfo.contacto.facebook].filter(Boolean)
}

const breadcrumb = (items) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url
  }))
})

const getHomeStructuredData = () => [businessBase, websiteBase, organizationBase]

const getGaleriaStructuredData = () => {
  const listUrl = `${baseUrl}/galeria`
  const itemList = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Galería de Productos de Artesanías Anita',
    itemListOrder: 'https://schema.org/ItemListUnordered',
    numberOfItems: productos.length,
    itemListElement: productos.map((producto, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${baseUrl}/producto/${producto.id}`,
      item: {
        '@type': 'Product',
        name: producto.nombre,
        image: toAbsoluteUrl(producto.imagen),
        category: producto.categoria
      }
    }))
  }

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Galería de Productos',
      url: listUrl
    },
    itemList,
    breadcrumb([
      { name: 'Inicio', url: `${baseUrl}/` },
      { name: 'Galería', url: listUrl }
    ])
  ]
}

const getProductoStructuredData = (id) => {
  const product = productos.find((item) => Number(item.id) === Number(id))
  if (!product) return []

  const productUrl = `${baseUrl}/producto/${product.id}`
  const offerUrl = `${baseUrl}/contacto`

  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.nombre,
      description: product.descripcion,
      image: [toAbsoluteUrl(product.imagen)],
      category: product.categoria,
      brand: {
        '@type': 'Brand',
        name: BRAND_NAME
      },
      sku: `AA-${product.id}`,
      offers: {
        '@type': 'Offer',
        url: offerUrl,
        priceCurrency: 'CRC',
        availability: 'https://schema.org/InStock',
        seller: {
          '@type': 'Organization',
          name: BRAND_NAME
        }
      },
      url: productUrl
    },
    breadcrumb([
      { name: 'Inicio', url: `${baseUrl}/` },
      { name: 'Galería', url: `${baseUrl}/galeria` },
      { name: product.nombre, url: productUrl }
    ])
  ]
}

const getBlogStructuredData = () => {
  const blogUrl = `${baseUrl}/blog`
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: `Blog de ${BRAND_NAME}`,
      url: blogUrl
    },
    breadcrumb([
      { name: 'Inicio', url: `${baseUrl}/` },
      { name: 'Blog', url: blogUrl }
    ])
  ]
}

const getBlogPostStructuredData = (id) => {
  const article = articulos.find((item) => Number(item.id) === Number(id))
  if (!article) return []

  const articleUrl = `${baseUrl}/blog/${article.id}`
  const datePublished = toIsoFromMonthYear(article.fecha)
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.titulo,
    description: article.resumen,
    image: [toAbsoluteUrl(article.imagen)],
    author: {
      '@type': 'Person',
      name: article.autor || empresaInfo.propietaria || 'Artesanías Anita'
    },
    publisher: {
      '@type': 'Organization',
      name: BRAND_NAME,
      logo: {
        '@type': 'ImageObject',
        url: BRAND_LOGO
      }
    },
    mainEntityOfPage: articleUrl,
    url: articleUrl
  }

  if (datePublished) {
    data.datePublished = datePublished
  }

  return [
    data,
    breadcrumb([
      { name: 'Inicio', url: `${baseUrl}/` },
      { name: 'Blog', url: `${baseUrl}/blog` },
      { name: article.titulo, url: articleUrl }
    ])
  ]
}

const getContactoStructuredData = () => {
  const contactUrl = `${baseUrl}/contacto`
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: `Contacto ${BRAND_NAME}`,
      url: contactUrl
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: '¿Cuánto tiempo tarda la elaboración?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Depende de la complejidad del diseño y la disponibilidad de materiales. Se define en la consulta inicial.'
          }
        },
        {
          '@type': 'Question',
          name: '¿Aceptan pedidos personalizados?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Sí. Los productos se pueden personalizar en colores, tamaños y diseño.'
          }
        },
        {
          '@type': 'Question',
          name: '¿Hacen envíos?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Sí, se realizan envíos a nivel nacional y también existe retiro personal.'
          }
        },
        {
          '@type': 'Question',
          name: '¿Cuáles son las formas de pago?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Se acepta transferencia bancaria y SINPE. Se solicita un depósito del 30% al confirmar el pedido.'
          }
        }
      ]
    },
    breadcrumb([
      { name: 'Inicio', url: `${baseUrl}/` },
      { name: 'Contacto', url: contactUrl }
    ])
  ]
}

const getSobreStructuredData = () => [
  {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: `Sobre ${BRAND_NAME}`,
    url: `${baseUrl}/sobre`
  },
  breadcrumb([
    { name: 'Inicio', url: `${baseUrl}/` },
    { name: 'Sobre', url: `${baseUrl}/sobre` }
  ])
]

export const getStructuredDataForRoute = (path) => {
  const cleanPath = String(path || '/')

  if (cleanPath === '/') return getHomeStructuredData()
  if (cleanPath === '/galeria') return getGaleriaStructuredData()
  if (cleanPath === '/blog') return getBlogStructuredData()
  if (cleanPath === '/sobre') return getSobreStructuredData()
  if (cleanPath === '/contacto') return getContactoStructuredData()

  if (cleanPath.startsWith('/producto/')) {
    const id = cleanPath.split('/').pop()
    return getProductoStructuredData(id)
  }

  if (cleanPath.startsWith('/blog/')) {
    const id = cleanPath.split('/').pop()
    return getBlogPostStructuredData(id)
  }

  return []
}

export const toJsonLdString = (entries) => {
  if (!Array.isArray(entries) || entries.length === 0) return ''
  const payload = entries.length === 1 ? entries[0] : entries
  return JSON.stringify(payload)
}

export const getArticleJsonLdId = (title) => `article-${toSlug(title)}`
