<template>
  <div class="galeria">
    <section class="galeria-header">
      <div class="container">
        <h1>Galería de Productos</h1>
        <p>Explora todos nuestros diseños artesanales</p>
      </div>
    </section>

    <section class="galeria-content">
      <div class="container">
        <div class="filtros">
          <button
            v-for="categoria in categorias"
            :key="categoria"
            type="button"
            class="filtro-btn"
            :class="{ active: categoriaActiva === categoria }"
            @click="categoriaActiva = categoria"
          >
            {{ categoria }}
          </button>
        </div>

        <div class="busqueda">
          <input
            v-model="busqueda"
            type="text"
            placeholder="Buscar producto..."
            class="input-busqueda"
          />
        </div>

        <div v-if="productosFiltrados.length" class="productos-grid">
          <div v-for="producto in productosFiltrados" :key="producto.id" class="producto-card">
            <div class="producto-imagen" @click="abrirModal(producto.imagen, producto.nombre)">
              <img :src="producto.imagen" :alt="producto.nombre" class="product-img" />
              <div class="overlay-zoom">🔍</div>
            </div>

            <div class="producto-info">
              <div class="categoria-badge">{{ producto.categoria }}</div>
              <h3>{{ producto.nombre }}</h3>
              <p class="descripcion">{{ producto.descripcion }}</p>
              <p class="precio">{{ producto.precioAproximado }}</p>
              <router-link :to="`/producto/${producto.id}`" class="btn btn-sm">Ver Detalles</router-link>
            </div>
          </div>
        </div>

        <div v-else class="sin-resultados">
          <p>No hay productos para los filtros seleccionados.</p>
          <button type="button" class="btn" @click="limpiarFiltros">Limpiar filtros</button>
        </div>

      </div>
    </section>

    <ImageModal
      v-model="mostrarModal"
      :imagen-url="imagenModal"
      :titulo="tituloModal"
    />
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { categorias, productos } from '../data/artesanias'
import ImageModal from '../components/ImageModal.vue'
import { api } from '../services/api'

const BASE_MAX_ID = Math.max(0, ...productos.map((producto) => Number(producto.id) || 0))
const CUSTOM_ID_OFFSET = BASE_MAX_ID + 100000

const categoriaActiva = ref('Todos')
const busqueda = ref('')
const mostrarModal = ref(false)
const imagenModal = ref('')
const tituloModal = ref('')
const productosPersonalizados = ref([])

const toPublicCustomProduct = (producto) => ({
  ...producto,
  id: CUSTOM_ID_OFFSET + (Number(producto?.id) || 0)
})

const cargarProductosPersonalizados = async () => {
  try {
    productosPersonalizados.value = await api.getPublicProductos()
  } catch {
    productosPersonalizados.value = []
  }
}

const productosDisponibles = computed(() => {
  const mapa = new Map(productos.map((producto) => [producto.id, producto]))

  for (const producto of productosPersonalizados.value) {
    const normalized = toPublicCustomProduct(producto)
    mapa.set(normalized.id, normalized)
  }

  return Array.from(mapa.values())
})

const productosFiltrados = computed(() => {
  let resultado = productosDisponibles.value

  if (categoriaActiva.value !== 'Todos') {
    resultado = resultado.filter((producto) => producto.categoria === categoriaActiva.value)
  }

  if (busqueda.value.trim()) {
    const termino = busqueda.value.toLowerCase().trim()
    resultado = resultado.filter((producto) => {
      return (
        producto.nombre.toLowerCase().includes(termino) ||
        producto.descripcion.toLowerCase().includes(termino) ||
        producto.categoria.toLowerCase().includes(termino)
      )
    })
  }

  return resultado
})

onMounted(async () => {
  await cargarProductosPersonalizados()
})

const abrirModal = (imagen, titulo) => {
  imagenModal.value = imagen
  tituloModal.value = titulo
  mostrarModal.value = true
}

const limpiarFiltros = () => {
  categoriaActiva.value = 'Todos'
  busqueda.value = ''
}
</script>

<style scoped>
.galeria {
  min-height: 100vh;
  background: var(--bg-light);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.galeria-header {
  background: linear-gradient(135deg, var(--secondary-cream) 0%, var(--bg-light-2) 100%);
  padding: 3rem 1rem;
  text-align: center;
}

.galeria-header h1 {
  color: var(--secondary-natural);
  margin: 0 0 0.5rem 0;
  font-size: 2.4rem;
}

.galeria-header p {
  margin: 0;
  color: #666;
}

.galeria-content {
  padding: 2rem 0 3rem;
}

.filtros {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.filtro-btn {
  border: 2px solid #ddd;
  background: white;
  color: #666;
  border-radius: 999px;
  padding: 0.55rem 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filtro-btn.active,
.filtro-btn:hover {
  background: var(--secondary-terracotta);
  color: white;
  border-color: var(--secondary-terracotta);
}

.busqueda {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.input-busqueda {
  width: 100%;
  max-width: 420px;
  border: 2px solid #ddd;
  border-radius: 999px;
  padding: 0.75rem 1rem;
  font-size: 1rem;
}

.input-busqueda:focus {
  outline: none;
  border-color: var(--secondary-terracotta);
}

.productos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.producto-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}

.producto-imagen {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  height: 280px;
  padding: 0.4rem;
  overflow: hidden;
  cursor: pointer;
}

.product-img {
  width: calc(100% - 0.8rem);
  height: calc(100% - 0.8rem);
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  object-position: center;
  transition: transform 0.3s ease;
}

.producto-imagen:hover .product-img {
  transform: scale(1.05);
}

.overlay-zoom {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.35);
  color: white;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.producto-imagen:hover .overlay-zoom {
  opacity: 1;
}

.producto-info {
  padding: 1rem;
}

.categoria-badge {
  display: inline-block;
  background: var(--bg-light-2);
  color: var(--secondary-natural);
  font-size: 0.78rem;
  font-weight: 600;
  border-radius: 999px;
  padding: 0.2rem 0.6rem;
  margin-bottom: 0.6rem;
}

.producto-info h3 {
  margin: 0 0 0.5rem 0;
  color: var(--secondary-natural);
}

.descripcion {
  color: #666;
  font-size: 0.95rem;
  margin: 0 0 0.75rem 0;
}

.precio {
  color: var(--secondary-terracotta);
  font-weight: 600;
  margin: 0 0 0.9rem 0;
}

.btn {
  display: inline-block;
  border: none;
  text-decoration: none;
  border-radius: 6px;
  background: var(--secondary-terracotta);
  color: white;
  padding: 0.55rem 1rem;
  cursor: pointer;
}

.btn-sm {
  font-size: 0.9rem;
}

.sin-resultados {
  text-align: center;
  padding: 2rem 0;
  color: #666;
}

@media (max-width: 768px) {
  .galeria-header {
    padding: 2rem 1rem;
  }

  .galeria-header h1 {
    font-size: 1.9rem;
  }

  .producto-imagen {
    height: 240px;
  }
}
</style>
