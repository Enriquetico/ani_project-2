const HIDDEN_BASE_PRODUCTS_KEY = 'ani_hidden_base_products_v1'

const parseIds = (raw) => {
  try {
    const value = JSON.parse(raw || '[]')
    if (!Array.isArray(value)) return []
    return value
      .map((id) => Number(id))
      .filter((id) => Number.isInteger(id) && id > 0)
  } catch {
    return []
  }
}

export const getHiddenBaseProductIds = () => {
  if (typeof window === 'undefined') return []
  return parseIds(window.localStorage.getItem(HIDDEN_BASE_PRODUCTS_KEY))
}

export const hideBaseProductId = (id) => {
  if (typeof window === 'undefined') return
  const targetId = Number(id)
  if (!Number.isInteger(targetId) || targetId <= 0) return

  const next = new Set(getHiddenBaseProductIds())
  next.add(targetId)
  window.localStorage.setItem(HIDDEN_BASE_PRODUCTS_KEY, JSON.stringify(Array.from(next)))
}
