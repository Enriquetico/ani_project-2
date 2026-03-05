<template>
  <div v-if="producto" class="detalle-producto">
    <div class="breadcrumb">
      <router-link to="/galeria">← Volver a la Galería</router-link>
    </div>

    <div class="container">
      <div class="detalle-grid">
        <!-- Imagen -->
        <div class="detalle-imagen" @click="abrirModal(producto.imagen, producto.nombre)">
          <img
            :src="producto.imagen"
            :alt="producto.nombre"
            class="product-img"
            loading="lazy"
            decoding="async"
          />
          <div class="overlay-zoom">🔍 Ampliar</div>
        </div>

        <!-- Información -->
        <div class="detalle-info">
          <div class="categoria-badge">{{ producto.categoria }}</div>
          <h1>{{ producto.nombre }}</h1>
          <p class="tipo">{{ producto.tipo }}</p>

          <!-- Descripción -->
          <div class="seccion">
            <h3>Descripción</h3>
            <p>{{ producto.descripcion }}</p>
          </div>

          <!-- Características -->
          <div class="seccion">
            <h3>Características</h3>
            <ul class="caracteristicas">
              <li><strong>Tamaño:</strong> {{ producto.tamaño }}</li>
              <li><strong>Colores disponibles:</strong> {{ producto.colores.join(', ') }}</li>
              <li><strong>Tipo:</strong> {{ producto.tipo }}</li>
            </ul>
          </div>

          <!-- Precio -->
          <div class="precio-section">
            <p class="precio">Precio aproximado: {{ producto.precioAproximado }}</p>
            <p class="nota-precio">* El precio final depende del tamaño y personalizaciones</p>
          </div>

          <!-- Notas -->
          <div v-if="producto.notas" class="seccion notas">
            <p>✨ {{ producto.notas }}</p>
          </div>

          <!-- Proceso de pedido -->
          <div class="seccion proceso">
            <h3>Cómo hacer tu pedido</h3>
            <ol class="pasos">
              <li>Contacta con Ana describiendo lo que deseas</li>
              <li>Discute colores, tamaño y personalizaciones</li>
              <li>Recibe el presupuesto</li>
              <li>Realiza el pago del 30% como depósito</li>
              <li>Disfruta de tu pieza única una vez completada</li>
            </ol>
          </div>

          <!-- Botones de acción -->
          <div class="acciones">
            <a :href="'https://wa.me/' + contactoWhatsapp.replace(/\D/g, '')" target="_blank" class="btn btn-primary btn-large">
              💬 Consultar por WhatsApp
            </a>
            <a :href="'mailto:' + contactoEmail" class="btn btn-secondary btn-large">
              ✉️ Enviar Email
            </a>
          </div>
        </div>
      </div>

      <!-- Productos Relacionados -->
      <div class="relacionados">
        <h2>Otros Productos</h2>
        <div class="productos-relacionados">
          <div v-for="prod in productosRelacionados" :key="prod.id" class="producto-card">
            <div class="producto-imagen" @click="abrirModal(prod.imagen, prod.nombre)">
              <img
                :src="prod.imagen"
                :alt="prod.nombre"
                class="product-img"
                loading="lazy"
                decoding="async"
              />
              <div class="overlay-zoom">🔍</div>
            </div>
            <div class="producto-info">
              <h4>{{ prod.nombre }}</h4>
              <p class="categoria">{{ prod.categoria }}</p>
              <router-link :to="`/producto/${prod.id}`" class="btn btn-sm">Ver</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Imagen -->
    <ImageModal 
      v-model="mostrarModal"
      :imagen-url="imagenModal"
      :titulo="tituloModal"
    />
  </div>

  <div v-else class="no-encontrado">
    <div class="container">
      <h2>Producto no encontrado</h2>
      <p>Lo sentimos, no pudimos encontrar este producto.</p>
      <router-link to="/galeria" class="btn btn-primary">Volver a la Galería</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { productos, empresaInfo } from '../data/artesanias'
import ImageModal from '../components/ImageModal.vue'

const route = useRoute()
const mostrarModal = ref(false)
const imagenModal = ref('')
const tituloModal = ref('')

const todosLosProductos = computed(() => {
  return productos
})

const producto = computed(() => {
  return todosLosProductos.value.find(p => p.id === parseInt(route.params.id))
})

const productosRelacionados = computed(() => {
  if (!producto.value) return []
  return todosLosProductos.value
    .filter(p => p.categoria === producto.value.categoria && p.id !== producto.value.id)
    .slice(0, 4)
})

const abrirModal = (imagen, titulo) => {
  imagenModal.value = imagen
  tituloModal.value = titulo
  mostrarModal.value = true
}

const contactoWhatsapp = empresaInfo.contacto.whatsapp
const contactoEmail = empresaInfo.contacto.email
</script>

<style scoped>
.detalle-producto {
  padding: 2rem 0;
  background: var(--bg-light);
  min-height: 100vh;
}

.breadcrumb {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.breadcrumb a {
  color: var(--secondary-terracotta);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.breadcrumb a:hover {
  color: var(--secondary-terracotta-dark);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.detalle-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-bottom: 3rem;
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}

.detalle-imagen {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
  overflow: hidden;
  border-radius: 8px;
  background: var(--bg-light);
  aspect-ratio: 4 / 3;
  min-height: 320px;
}

.detalle-imagen .product-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  image-orientation: from-image;
  object-position: center;
  transition: none;
}

.overlay-zoom {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  opacity: 0;
  transition: opacity 0.3s ease;
  white-space: nowrap;
}

.detalle-imagen:hover .overlay-zoom {
  opacity: 1;
}

.image-placeholder {
  width: 100%;
  height: 400px;
  background: var(--gradient-placeholder);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-weight: bold;
  text-align: center;
  padding: 1rem;
}

.detalle-info {
  display: flex;
  flex-direction: column;
}

.categoria-badge {
  display: inline-block;
  background: var(--secondary-terracotta);
  color: white;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  margin-bottom: 1rem;
  width: fit-content;
}

.detalle-info h1 {
  color: var(--secondary-natural);
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
}

.tipo {
  color: #999;
  font-size: 1rem;
  margin-bottom: 1.5rem;
}

.seccion {
  margin: 1.5rem 0;
}

.seccion h3 {
  color: var(--secondary-natural);
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.seccion p {
  color: #666;
  line-height: 1.6;
  margin: 0;
}

.caracteristicas {
  list-style: none;
  padding: 0;
  margin: 0;
}

.caracteristicas li {
  padding: 0.5rem 0;
  color: #666;
  border-bottom: 1px solid #eee;
}

.caracteristicas li:last-child {
  border-bottom: none;
}

.caracteristicas strong {
  color: var(--secondary-natural);
}

.precio-section {
  background: var(--bg-light-3);
  padding: 1.5rem;
  border-radius: 8px;
  margin: 1.5rem 0;
}

.precio {
  font-size: 1.5rem;
  color: var(--secondary-terracotta);
  font-weight: bold;
  margin: 0;
}

.nota-precio {
  font-size: 0.85rem;
  color: #999;
  margin: 0.5rem 0 0 0;
}

.notas {
  background: var(--bg-light-2);
  padding: 1rem;
  border-left: 4px solid var(--secondary-terracotta);
  border-radius: 4px;
}

.notas p {
  margin: 0;
  color: #666;
}

.proceso {
  background: var(--bg-light-4);
  padding: 1.5rem;
  border-radius: 8px;
}

.proceso h3 {
  color: var(--secondary-natural);
}

.pasos {
  margin: 1rem 0 0 0;
  padding-left: 1.5rem;
  color: #666;
}

.pasos li {
  margin: 0.75rem 0;
  line-height: 1.5;
}

.acciones {
  display: flex;
  gap: 1rem;
  margin: 2rem 0 0 0;
  flex-direction: column;
}

.btn {
  padding: 1rem;
  border-radius: 5px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  text-align: center;
  display: block;
}

.btn-primary {
  background: var(--secondary-terracotta);
  color: white;
}

.btn-primary:hover {
  background: var(--secondary-terracotta-dark);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(193, 122, 92, 0.3);
}

.btn-secondary {
  background: transparent;
  color: var(--secondary-terracotta);
  border: 2px solid var(--secondary-terracotta);
}

.btn-secondary:hover {
  background: var(--secondary-terracotta);
  color: white;
}

.btn-large {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
}

/* Productos Relacionados */
.relacionados {
  margin: 3rem 0;
}

.relacionados h2 {
  color: var(--secondary-natural);
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1.8rem;
}

.productos-relacionados {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.producto-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
  padding: 1rem;
}

.producto-card:hover {
  transform: translateY(-3px);
}

.producto-imagen {
  aspect-ratio: 4 / 3;
  background: var(--bg-light);
  border-radius: 5px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
  overflow: hidden;
}

.producto-imagen .product-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  image-orientation: from-image;
  object-position: center;
  transition: none;
}

.producto-imagen .overlay-zoom {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.producto-imagen:hover .overlay-zoom {
  opacity: 1;
}

.producto-imagen .image-placeholder {
  height: 100%;
  width: 100%;
  font-size: 0.9rem;
}

.producto-info h4 {
  color: var(--secondary-natural);
  margin: 0 0 0.3rem 0;
}

.categoria {
  color: #999;
  font-size: 0.8rem;
  margin: 0 0 0.75rem 0;
}

/* No encontrado */
.no-encontrado {
  min-height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-light);
  padding: 2rem;
}

.no-encontrado h2 {
  color: var(--secondary-natural);
  margin-bottom: 1rem;
}

.no-encontrado p {
  color: #666;
  margin-bottom: 2rem;
}

/* Responsive */
@media (max-width: 1024px) {
  .container {
    padding: 0 1rem;
  }
}

@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }

  .detalle-producto {
    padding: 1rem 0;
  }

  .breadcrumb {
    margin: 1rem 1rem 1.5rem 1rem;
    padding: 0.75rem;
  }

  .detalle-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding: 1rem;
    margin-bottom: 2rem;
  }

  .detalle-imagen {
    min-height: 300px;
  }

  .detalle-info h1 {
    font-size: 1.5rem;
  }

  .acciones {
    flex-direction: column;
  }

  .btn-large {
    width: 100%;
  }

  .productos-relacionados {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .relacionados h2 {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 0.75rem;
  }

  .breadcrumb {
    margin: 0.75rem 0.75rem 1rem 0.75rem;
    padding: 0.5rem;
    font-size: 0.9rem;
  }

  .detalle-grid {
    padding: 0.75rem;
    gap: 1rem;
  }

  .detalle-imagen {
    min-height: 250px;
  }

  .producto-imagen {
    aspect-ratio: 4 / 3;
  }

  .detalle-info h1 {
    font-size: 1.3rem;
  }

  .seccion h3 {
    font-size: 1.1rem;
  }

  .pasos {
    padding-left: 1rem;
  }
}
</style>
