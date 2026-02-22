import { ref } from 'vue'

const toasts = ref([])
let nextToastId = 1

const sanitizeType = (type) => {
  if (type === 'error' || type === 'success') return type
  return 'success'
}

export const removeToast = (id) => {
  toasts.value = toasts.value.filter((toast) => toast.id !== id)
}

export const showToast = ({ message, type = 'success', duration = 3200 }) => {
  const safeMessage = String(message || '').trim()
  if (!safeMessage) return null

  const id = nextToastId++
  const toast = {
    id,
    message: safeMessage,
    type: sanitizeType(type)
  }

  toasts.value = [...toasts.value, toast]

  const safeDuration = Number(duration)
  if (Number.isFinite(safeDuration) && safeDuration > 0) {
    setTimeout(() => {
      removeToast(id)
    }, safeDuration)
  }

  return id
}

export const useToastStore = () => ({
  toasts,
  removeToast
})
