const normalizeApiBase = (value) => {
  const fallback = '/api'
  if (!value || typeof value !== 'string') return fallback

  const trimmed = value.trim()
  if (!trimmed) return fallback

  return trimmed.endsWith('/') ? trimmed.slice(0, -1) : trimmed
}

const API_BASE = normalizeApiBase(import.meta.env.VITE_API_BASE_URL)

const parseResponse = async (response) => {
  const isJson = response.headers.get('content-type')?.includes('application/json')
  const payload = isJson ? await response.json() : null

  if (!response.ok) {
    const message = payload?.error || 'Error en la solicitud'
    const error = new Error(message)
    error.status = response.status
    throw error
  }

  return payload
}

export const apiFetch = async (path, options = {}) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  const isFormData = options.body instanceof FormData
  const headers = {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(options.headers || {})
  }

  const response = await fetch(`${API_BASE}${normalizedPath}`, {
    credentials: 'include',
    headers,
    ...options
  })

  return parseResponse(response)
}

export const api = {
  login: (password) =>
    apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ password })
    }),

  logout: () =>
    apiFetch('/auth/logout', {
      method: 'POST'
    }),

  me: () => apiFetch('/auth/me'),

  getAdminProductos: () => apiFetch('/productos'),
  getAdminBaseProductos: () => apiFetch('/admin/base-productos'),
  createProducto: (payload) =>
    apiFetch('/productos', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  updateProducto: (id, payload) =>
    apiFetch(`/productos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    }),
  deleteProducto: (id) =>
    apiFetch(`/productos/${id}`, {
      method: 'DELETE'
    }),
  deleteBaseProducto: (id) =>
    apiFetch(`/admin/base-productos/${id}`, {
      method: 'DELETE'
    }),

  getPublicProductos: () => apiFetch('/public/productos'),

  sendContacto: (payload) =>
    apiFetch('/public/contacto', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  subscribeNewsletter: (email) =>
    apiFetch('/public/suscriptores', {
      method: 'POST',
      body: JSON.stringify({ email })
    }),

  getMensajes: () => apiFetch('/mensajes'),
  getSuscriptores: () => apiFetch('/suscriptores'),
  getLoginAttempts: (limit = 100) => apiFetch(`/admin/login-attempts?limit=${limit}`),
  getImageUploadConfig: () => apiFetch('/admin/image-upload-config'),
  optimizeProductImage: (file, payload = {}) => {
    const formData = new FormData()
    formData.append('image', file)

    if (payload.productName) formData.append('productName', payload.productName)
    if (payload.categoria) formData.append('categoria', payload.categoria)
    if (payload.tipo) formData.append('tipo', payload.tipo)

    return apiFetch('/admin/optimize-image', {
      method: 'POST',
      body: formData
    })
  },
  deleteSuscriptor: (id) =>
    apiFetch(`/suscriptores/${id}`, {
      method: 'DELETE'
    })
}
