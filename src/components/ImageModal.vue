<template>
  <transition name="modal">
    <div v-if="modelValue" class="modal-overlay" @click="cerrar">
      <div class="modal-content" @click.stop>
        <button class="modal-close" @click="cerrar">✕</button>
        <img :src="imagenUrl" :alt="titulo" class="modal-imagen" />
        <p v-if="titulo" class="modal-titulo">{{ titulo }}</p>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue'

defineProps({
  modelValue: Boolean,
  imagenUrl: String,
  titulo: String
})

const emit = defineEmits(['update:modelValue'])

const cerrar = () => {
  emit('update:modelValue', false)
}

const onKeyDown = (e) => {
  if (e.key === 'Escape') cerrar()
}

onMounted(() => {
  document.addEventListener('keydown', onKeyDown)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKeyDown)
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  position: relative;
  width: auto;
  max-width: 92vw;
  max-height: 90vh;
  background: transparent;
  border-radius: 0;
  overflow: visible;
  box-shadow: none;
}

.modal-imagen {
  display: block;
  width: auto;
  max-width: 92vw;
  height: auto;
  object-fit: contain;
  max-height: 85vh;
  margin: 0 auto;
}

.modal-titulo {
  padding: 1rem;
  text-align: center;
  color: #fff;
  margin: 0;
  font-weight: 500;
  text-shadow: 0 2px 6px rgba(0, 0, 0, 0.55);
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
  transition: all 0.3s;
}

.modal-close:hover {
  background: white;
  transform: scale(1.1);
}

/* Animación */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .modal-content {
    max-width: 95vw;
  }

  .modal-imagen {
    max-height: 80vh;
  }

  .modal-close {
    width: 35px;
    height: 35px;
    font-size: 1.2rem;
    top: 0.5rem;
    right: 0.5rem;
  }
}
</style>
