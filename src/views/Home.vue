<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <h1>ArtesaníasAni</h1>
        <p class="hero-eslogan">Pequeños detalles, grandes emociones.</p>
        <p class="hero-description">
          Descubre piezas únicas de cerámica pintada a mano y velas artesanales personalizadas
        </p>
        <div class="hero-buttons">
          <router-link to="/galeria" class="btn btn-primary">Ver Galería</router-link>
          <router-link to="/sobre" class="btn btn-secondary">Conoce Mi Historia</router-link>
        </div>
      </div>
      <div class="hero-image">
        <img src="/images/pintandovasija.webp" alt="Ana Herrera - ArtesaníasAni" class="hero-foto" />
      </div>
    </section>

    <!-- Diferenciador -->
    <section class="diferenciador">
      <div class="container">
        <h2>¿Qué nos hace diferentes?</h2>
        <p class="lead">
          {{ empresaInfo.diferenciador }}
        </p>
      </div>
    </section>

    <!-- GALERÍA DE PRODUCTOS PREVIEW -->
    <section class="galeria-preview">
      <div class="container">
        <div class="galeria-header">
          <h2>Galería de Productos</h2>
          <p class="subtitle">Explora algunas de nuestras creaciones artesanales</p>
          <button @click="obtenerProductosAleatorios" class="btn btn-primary btn-large btn-aleatorio">
            Mostrar Otros Productos
          </button>
        </div>
        
        <div class="productos-grid">
          <div v-for="producto in productosAleatorios" :key="producto.id" class="producto-card">
            <div class="producto-imagen" @click="abrirModal(producto.imagen, producto.nombre)">
              <img :src="producto.imagen" :alt="producto.nombre" class="product-img" />
              <div class="overlay-zoom">🔍</div>
            </div>
            <div class="producto-info">
              <span class="categoria-badge">{{ producto.categoria }}</span>
              <h3>{{ producto.nombre }}</h3>
              <p class="descripcion">{{ producto.descripcion }}</p>
              <p class="precio">{{ producto.precioAproximado }}</p>
            </div>
          </div>
        </div>
        
        <div class="ver-mas">
          <router-link to="/galeria" class="btn btn-primary btn-large">Ver Galería Completa</router-link>
        </div>
      </div>
    </section>

    <!-- Valores -->
    <section class="valores">
      <div class="container">
        <h2>Nuestros Valores</h2>
        <div class="valores-grid">
          <div v-for="valor in empresaInfo.valores" :key="valor.titulo" class="valor-card">
            <h3>{{ valor.titulo }}</h3>
            <p v-if="valor.subtitulo" class="subtitulo">{{ valor.subtitulo }}</p>
            <p>{{ valor.descripcion }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonios -->
    <section class="testimonios">
      <div class="container">
        <h2>Lo Que Dicen Mis Clientes</h2>
        <div class="testimonios-grid">
          <div v-for="testimonio in testimoniosDestacados" :key="testimonio.id" class="testimonio-card">
            <div class="estrellas">
              <span v-for="i in testimonio.calificacion" :key="i">⭐</span>
            </div>
            <p class="texto">{{ testimonio.texto }}</p>
            <p class="autor">— {{ testimonio.nombre }}</p>
            <p class="fecha">{{ testimonio.fecha }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta">
      <div class="container">
        <h2>¿Tienes una visión especial?</h2>
        <p>
          En ArtesaníasAni creamos piezas personalizadas según tus gustos y necesidades.
          Contáctame para hablar sobre tu proyecto.
        </p>
        <router-link to="/contacto" class="btn btn-large">Solicitar Presupuesto</router-link>
      </div>
    </section>

    <!-- Blog Preview -->
    <section class="blog-preview">
      <div class="container">
        <h2>Blog - Novedades y Tips</h2>
        <div class="articulos-grid">
          <div v-for="articulo in articulosDestacados" :key="articulo.id" class="articulo-card">
            <div class="articulo-imagen">
              <div class="image-placeholder">{{ articulo.titulo }}</div>
            </div>
            <h3>{{ articulo.titulo }}</h3>
            <p class="fecha">{{ articulo.fecha }}</p>
            <p class="resumen">{{ articulo.resumen }}</p>
            <router-link :to="`/blog/${articulo.id}`" class="btn btn-sm">Leer Más</router-link>
          </div>
        </div>
        <div class="ver-mas">
          <router-link to="/blog" class="btn btn-primary">Ver Todo el Blog</router-link>
        </div>
      </div>
    </section>

    <!-- Modal de imagen -->
    <ImageModal
      v-model="mostrarModal"
      :imagen-url="imagenModal"
      :titulo="tituloModal"
    />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { empresaInfo, testimonios, articulos, productos } from '../data/artesanias'
import ImageModal from '../components/ImageModal.vue'

const testimoniosDestacados = computed(() => testimonios.slice(0, 3))
const articulosDestacados = computed(() => articulos.slice(0, 3))

// Productos aleatorios
const productosAleatorios = ref([])

const obtenerProductosAleatorios = () => {
  const productosCopia = [...productos]
  const aleatorios = []
  
  for (let i = 0; i < 6 && productosCopia.length > 0; i++) {
    const indiceAleatorio = Math.floor(Math.random() * productosCopia.length)
    aleatorios.push(productosCopia[indiceAleatorio])
    productosCopia.splice(indiceAleatorio, 1)
  }
  
  productosAleatorios.value = aleatorios
}

// Inicializar productos aleatorios al cargar
obtenerProductosAleatorios()

// Modal
const mostrarModal = ref(false)
const imagenModal = ref('')
const tituloModal = ref('')

const abrirModal = (imagen, titulo) => {
  imagenModal.value = imagen
  tituloModal.value = titulo
  mostrarModal.value = true
}
</script>

<style scoped>
.home {
  width: 100%;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Hero Section */
.hero {
  background: linear-gradient(135deg, rgba(245, 230, 211, 0.24) 0%, rgba(232, 212, 192, 0.2) 100%), url('/images/pintandovasija.webp');
  background-size: cover;
  background-position: center;
  background-attachment: scroll;
  padding: 4rem 1rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
}

.hero-content {
  background: transparent;
  border: none;
  border-radius: 0;
  padding: 1.5rem;
  backdrop-filter: none;
}

.hero-content h1 {
  font-size: 3.5rem;
  color: var(--secondary-natural);
  margin: 0 0 1rem 0;
  font-family: 'Georgia', serif;
  font-weight: bold;
}

.hero-eslogan {
  font-size: 1.5rem;
  color: #b73e17;
  font-style: italic;
  margin-bottom: 1rem;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.55);
}

.hero-description {
  font-size: 1.1rem;
  color: #2f2b28;
  margin-bottom: 2rem;
  line-height: 1.6;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.5);
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  display: inline-block;
  text-align: center;
  border: 2px solid transparent;
}

.btn-primary {
  background: var(--secondary-terracotta);
  color: white;
}

.hero-buttons .btn-primary {
  background: transparent;
  color: var(--secondary-terracotta);
  border: 2px solid var(--secondary-terracotta);
}

.btn-primary:hover {
  background: var(--secondary-terracotta-dark);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(193, 122, 92, 0.3);
}

.hero-buttons .btn-primary:hover {
  background: var(--secondary-terracotta-dark);
  border-color: var(--secondary-terracotta-dark);
  color: white;
}

.btn-secondary {
  background: transparent;
  color: var(--secondary-natural);
  border: 2px solid var(--secondary-natural);
}

.btn-secondary:hover {
  background: var(--secondary-natural);
  color: white;
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}

.btn-large {
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
}

.hero-image {
  display: flex;
  justify-content: center;
  align-items: center;
}

.hero-foto {
  width: 100%;
  max-width: 350px;
  height: auto;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  object-fit: cover;
  transition: transform 0.3s ease;
}

.hero-foto:hover {
  transform: scale(1.05);
}

/* Diferenciador */
.diferenciador {
  background: var(--bg-light-2);
  padding: 3rem 1rem;
}

.diferenciador h2 {
  font-size: 2rem;
  color: var(--secondary-natural);
  margin-bottom: 1.5rem;
  text-align: center;
}

.lead {
  font-size: 1.2rem;
  color: #555;
  text-align: center;
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.8;
}

/* GALERÍA PREVIEW */
.galeria-preview {
  padding: 3rem 1rem;
  background:
    radial-gradient(circle at 18% 22%, rgba(255, 107, 53, 0.25) 0%, transparent 42%),
    radial-gradient(circle at 82% 78%, rgba(0, 230, 118, 0.24) 0%, transparent 40%),
    linear-gradient(135deg, var(--secondary-cream) 0%, var(--bg-light-3) 48%, var(--bg-light-4) 100%);
}

.galeria-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.galeria-preview h2 {
  font-size: 2.5rem;
  color: var(--secondary-natural);
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
}

.btn-aleatorio {
  border: none;
  cursor: pointer;
  margin-top: 1rem;
}

.productos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.producto-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.producto-card:hover {
  background: var(--secondary-cream);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.producto-imagen {
  height: 260px;
  position: relative;
  cursor: pointer;
  overflow: hidden;
  background: var(--bg-light);
  padding: 0.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-img {
  width: calc(100% - 0.8rem);
  height: calc(100% - 0.8rem);
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  object-position: center;
  transition: transform 0.4s ease;
}

.producto-imagen:hover .product-img {
  transform: scale(1.1);
}

.overlay-zoom {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 20, 147, 0.8);
  color: white;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.producto-imagen:hover .overlay-zoom {
  opacity: 1;
}

.producto-info {
  padding: 1.5rem;
}

.categoria-badge {
  display: inline-block;
  background: var(--secondary-terracotta);
  color: white;
  padding: 0.35rem 0.85rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.producto-info h3 {
  color: var(--secondary-natural);
  margin: 0.5rem 0;
  font-size: 1.3rem;
}

.descripcion {
  color: #666;
  font-size: 0.95rem;
  margin: 0.75rem 0;
  line-height: 1.6;
}

.precio {
  color: var(--secondary-terracotta);
  font-weight: bold;
  font-size: 1.2rem;
  margin: 0.75rem 0 0 0;
}

.ver-mas {
  text-align: center;
}

/* Valores */
.valores {
  padding: 3rem 1rem;
}

.valores h2 {
  font-size: 2rem;
  color: var(--secondary-natural);
  margin-bottom: 2rem;
  text-align: center;
}

.valores-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.valor-card {
  background: var(--bg-light-3);
  padding: 2rem;
  border-radius: 8px;
  border-left: 4px solid var(--secondary-terracotta);
}

.valor-card h3 {
  color: var(--secondary-natural);
  margin: 0 0 0.5rem 0;
}

.subtitulo {
  font-size: 0.9rem;
  color: var(--secondary-terracotta);
  font-weight: 500;
  margin-bottom: 1rem;
}

.valor-card p {
  color: #666;
  line-height: 1.6;
  margin: 0;
}

/* Testimonios */
.testimonios {
  background: linear-gradient(135deg, var(--secondary-cream) 0%, var(--bg-light-2) 100%);
  padding: 3rem 1rem;
}

.testimonios h2 {
  font-size: 2rem;
  color: var(--secondary-natural);
  text-align: center;
  margin-bottom: 2rem;
}

.testimonios-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(280px, 320px));
  justify-content: center;
  gap: 2rem;
}

.testimonio-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}

.estrellas {
  margin-bottom: 1rem;
}

.texto {
  color: #555;
  font-style: italic;
  margin: 1rem 0;
  line-height: 1.6;
}

.autor {
  color: var(--secondary-natural);
  font-weight: bold;
  margin: 0.75rem 0 0.25rem 0;
}

.fecha {
  color: #999;
  font-size: 0.85rem;
  margin: 0;
}

/* CTA Section */
.cta {
  background: var(--secondary-terracotta);
  color: white;
  padding: 3rem 1rem;
  text-align: center;
}

.cta h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.cta p {
  font-size: 1.1rem;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.btn-large {
  background: white;
  color: var(--secondary-terracotta);
  border: none;
}

.btn-large:hover {
  background: var(--secondary-cream);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

/* Blog Preview */
.blog-preview {
  padding: 3rem 1rem;
}

.blog-preview h2 {
  font-size: 2rem;
  color: var(--secondary-natural);
  text-align: center;
  margin-bottom: 2rem;
}

.articulos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.articulo-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  padding: 1.5rem;
}

.articulo-card:hover {
  transform: translateY(-3px);
}

.articulo-imagen {
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--bg-light-3) 0%, var(--bg-light-4) 100%);
  border-radius: 5px;
  margin-bottom: 1rem;
}

.articulo-card h3 {
  color: var(--secondary-natural);
  margin: 0.5rem 0;
}

.articulo-card .fecha {
  color: #999;
  font-size: 0.85rem;
  margin-bottom: 0.75rem;
}

.resumen {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1rem;
}

/* Responsive */
@media (max-width: 1024px) {
  .hero-foto {
    max-width: 300px;
  }
}

@media (max-width: 768px) {
  .hero {
    grid-template-columns: 1fr;
    padding: 2rem 1rem;
    max-width: 100%;
    margin: 0;
    background-size: cover;
    background-position: center;
  }

  .container {
    padding: 0 1rem;
  }

  .hero-content h1 {
    font-size: 2rem;
  }

  .hero-eslogan {
    font-size: 1.2rem;
  }

  .hero-description {
    font-size: 1rem;
  }

  .hero-buttons {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }

  .btn-aleatorio {
    width: auto;
  }

  .hero-image {
    display: flex;
    order: -1;
    margin-bottom: 1rem;
  }

  .hero-foto {
    width: 80%;
    max-width: 260px;
  }

  h2 {
    font-size: 1.5rem;
  }

  .valores-grid,
  .productos-grid,
  .testimonios-grid,
  .articulos-grid {
    grid-template-columns: 1fr;
  }

  .producto-imagen {
    height: 220px;
  }
}

@media (max-width: 480px) {
  .hero {
    padding: 1.5rem 0.5rem;
  }

  .container {
    padding: 0 0.5rem;
  }

  .hero-content h1 {
    font-size: 1.5rem;
  }

  .hero-eslogan {
    font-size: 1rem;
  }

  .hero-description {
    font-size: 0.95rem;
  }

  .hero-foto {
    width: 85%;
    max-width: 220px;
  }
}
</style>
