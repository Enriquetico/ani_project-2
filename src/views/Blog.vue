<template>
  <div class="blog">
    <!-- Header -->
    <div class="blog-header">
      <h1>Blog - Novedades y Tips</h1>
      <p>Artesanía, Diseño y Creatividad</p>
    </div>

    <div class="container">
      <!-- Buscador -->
      <div class="buscador">
        <input
          v-model="busqueda"
          type="text"
          placeholder="Buscar artículos..."
          class="input-busqueda"
        />
      </div>

      <!-- Grid de Artículos -->
      <div v-if="articulosFiltrados.length > 0" class="articulos-grid">
        <article v-for="articulo in articulosFiltrados" :key="articulo.id" class="articulo-card">
          <router-link :to="`/blog/${articulo.id}`" class="articulo-link">
            <div class="articulo-imagen">
              <div class="image-placeholder">{{ articulo.titulo }}</div>
            </div>
            <div class="articulo-content">
              <h2>{{ articulo.titulo }}</h2>
              <p class="fecha">{{ articulo.fecha }} • {{ articulo.autor }}</p>
              <p class="resumen">{{ articulo.resumen }}</p>
              <span class="leer-mas">Leer más →</span>
            </div>
          </router-link>
        </article>
      </div>

      <!-- Sin resultados -->
      <div v-else class="sin-resultados">
        <p>No hay artículos que coincidan con tu búsqueda.</p>
        <button @click="busqueda = ''" class="btn btn-primary">Limpiar búsqueda</button>
      </div>

      <!-- Newsletter -->
      <section class="newsletter">
        <div class="newsletter-content">
          <h2>Suscríbete al Newsletter</h2>
          <p>Recibe novedades, tips de decoración y ofertas especiales directamente en tu email</p>
          <form @submit.prevent="suscribirse" class="newsletter-form">
            <input
              v-model="email"
              type="email"
              placeholder="Tu email"
              required
            />
            <button type="submit" class="btn btn-primary">Suscribirse</button>
          </form>
          <p v-if="mensajeNewsletter" class="mensaje-success">
            ✓ ¡Gracias por suscribirse!
          </p>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { articulos } from '../data/artesanias'
import { api } from '../services/api'

const busqueda = ref('')
const email = ref('')
const mensajeNewsletter = ref(false)

const articulosFiltrados = computed(() => {
  if (!busqueda.value.trim()) {
    return articulos
  }
  
  const termino = busqueda.value.toLowerCase()
  return articulos.filter(
    a => a.titulo.toLowerCase().includes(termino) ||
         a.contenido.toLowerCase().includes(termino) ||
         a.resumen.toLowerCase().includes(termino)
  )
})

const suscribirse = async () => {
  try {
    await api.subscribeNewsletter(email.value)
    mensajeNewsletter.value = true
    email.value = ''
  } catch (error) {
    mensajeNewsletter.value = false
    console.error(error)
  }

  setTimeout(() => {
    mensajeNewsletter.value = false
  }, 3000)
}
</script>

<style scoped>
.blog {
  background: var(--bg-light);
  padding: 0;
  min-height: 100vh;
}

.blog-header {
  background: linear-gradient(135deg, var(--secondary-cream) 0%, var(--bg-light-2) 100%);
  padding: 3rem 1rem;
  text-align: center;
  margin-bottom: 2rem;
}

.blog-header h1 {
  font-size: 2.5rem;
  color: var(--secondary-natural);
  margin: 0 0 0.5rem 0;
}

.blog-header p {
  font-size: 1.1rem;
  color: #666;
  margin: 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Buscador */
.buscador {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.input-busqueda {
  width: 100%;
  max-width: 500px;
  padding: 0.75rem 1rem;
  border: 2px solid #ddd;
  border-radius: 25px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.input-busqueda:focus {
  outline: none;
  border-color: var(--secondary-terracotta);
}

/* Grid de Artículos */
.articulos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.articulo-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.articulo-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.articulo-link {
  text-decoration: none;
  color: inherit;
  display: block;
  height: 100%;
}

.articulo-imagen {
  height: 250px;
  background: linear-gradient(135deg, var(--bg-light-3) 0%, var(--bg-light-4) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-placeholder {
  font-size: 1rem;
  color: #666;
  text-align: center;
  padding: 1rem;
  font-weight: bold;
}

.articulo-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.articulo-content h2 {
  color: var(--secondary-natural);
  margin: 0 0 0.5rem 0;
  font-size: 1.3rem;
  line-height: 1.4;
}

.fecha {
  color: #999;
  font-size: 0.85rem;
  margin: 0 0 1rem 0;
}

.resumen {
  color: #666;
  margin: 0 0 1rem 0;
  flex: 1;
  line-height: 1.6;
}

.leer-mas {
  color: var(--secondary-terracotta);
  font-weight: 500;
  transition: color 0.3s;
}

.articulo-card:hover .leer-mas {
  color: var(--secondary-terracotta-dark);
}

/* Sin resultados */
.sin-resultados {
  text-align: center;
  padding: 3rem 1rem;
  color: #666;
}

.sin-resultados p {
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
}

/* Newsletter */
.newsletter {
  background: linear-gradient(135deg, var(--secondary-cream) 0%, var(--bg-light-2) 100%);
  padding: 3rem;
  border-radius: 8px;
  text-align: center;
  margin: 3rem 0;
}

.newsletter-content h2 {
  color: var(--secondary-natural);
  margin: 0 0 0.75rem 0;
  font-size: 1.8rem;
}

.newsletter-content p {
  color: #666;
  margin: 0 0 1.5rem 0;
  font-size: 1rem;
  line-height: 1.6;
}

.newsletter-form {
  display: flex;
  gap: 0.75rem;
  max-width: 500px;
  margin: 0 auto 1rem auto;
}

.newsletter-form input {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
}

.newsletter-form input:focus {
  outline: none;
  border-color: var(--secondary-terracotta);
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 5px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  display: inline-block;
  text-align: center;
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

.mensaje-success {
  color: #27ae60;
  font-weight: 500;
  margin: 0;
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

  .blog {
    padding: 1rem 0;
  }

  .blog-header h1 {
    font-size: 1.8rem;
  }

  .blog-header p {
    font-size: 1rem;
  }

  .articulos-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .newsletter {
    padding: 1.5rem 1rem;
    margin: 1rem;
  }

  .newsletter-form {
    flex-direction: column;
  }

  .newsletter-form input {
    width: 100%;
  }

  .btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 0.75rem;
  }

  .blog {
    padding: 0.75rem 0;
  }

  .blog-header h1 {
    font-size: 1.5rem;
  }

  .blog-header p {
    font-size: 0.95rem;
  }

  .articulos-grid {
    gap: 1rem;
  }

  .articulo-card {
    padding: 1rem;
  }

  .articulo-card h3 {
    font-size: 1.1rem;
  }

  .newsletter {
    padding: 1.2rem 0.75rem;
    margin: 0.75rem;
  }

  .newsletter h2 {
    font-size: 1.3rem;
  }

  .newsletter-form input {
    font-size: 16px;
    padding: 0.75rem;
  }
}
</style>
