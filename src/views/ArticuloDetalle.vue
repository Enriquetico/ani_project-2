<template>
  <div v-if="articulo" class="articulo-detalle">
    <div class="breadcrumb">
      <router-link to="/blog">← Volver al Blog</router-link>
    </div>

    <div class="container">
      <article class="articulo-full">
        <div class="articulo-header">
          <h1>{{ articulo.titulo }}</h1>
          <p class="meta">{{ articulo.fecha }} • Escrito por {{ articulo.autor }}</p>
        </div>

        <div class="articulo-imagen">
          <div class="image-placeholder">{{ articulo.titulo }}</div>
        </div>

        <div class="articulo-content">
          <p v-for="parrafo in articulo.contenido.split('\n\n')" :key="parrafo" class="parrafo">
            {{ parrafo }}
          </p>
        </div>

        <div class="compartir">
          <h3>Compartir este artículo</h3>
          <div class="compartir-buttons">
            <a href="https://www.facebook.com/sharer/sharer.php" target="_blank" class="btn-compartir facebook">
              Facebook
            </a>
            <a href="https://twitter.com/intent/tweet" target="_blank" class="btn-compartir twitter">
              Twitter
            </a>
            <a :href="'https://wa.me/' + contactoWhatsapp.replace(/\D/g, '')" target="_blank" class="btn-compartir whatsapp">
              WhatsApp
            </a>
          </div>
        </div>

        <div class="cta-section">
          <h3>¿Te interesa alguno de nuestros productos?</h3>
          <router-link to="/galeria" class="btn btn-primary">Ver Galería Completa</router-link>
        </div>
      </article>

      <!-- Artículos Relacionados -->
      <section class="articulos-relacionados">
        <h2>Otros Artículos</h2>
        <div class="articulos-grid">
          <div v-for="art in articulosRelacionados" :key="art.id" class="articulo-card">
            <router-link :to="`/blog/${art.id}`" class="articulo-link">
              <div class="articulo-imagen-peq">
                <div class="image-placeholder">{{ art.titulo }}</div>
              </div>
              <div class="articulo-info">
                <h3>{{ art.titulo }}</h3>
                <p class="fecha">{{ art.fecha }}</p>
              </div>
            </router-link>
          </div>
        </div>
      </section>
    </div>
  </div>

  <div v-else class="no-encontrado">
    <div class="container">
      <h2>Artículo no encontrado</h2>
      <p>Lo sentimos, no pudimos encontrar este artículo.</p>
      <router-link to="/blog" class="btn btn-primary">Volver al Blog</router-link>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { articulos, empresaInfo } from '../data/artesanias'

const route = useRoute()

const articulo = computed(() => {
  return articulos.find(a => a.id === parseInt(route.params.id))
})

const articulosRelacionados = computed(() => {
  if (!articulo.value) return []
  return articulos
    .filter(a => a.id !== articulo.value.id)
    .slice(0, 3)
})

const contactoWhatsapp = empresaInfo.contacto.whatsapp
</script>

<style scoped>
.articulo-detalle {
  background: var(--bg-light);
  padding: 2rem 0;
  min-height: 100vh;
}

.breadcrumb {
  max-width: 900px;
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
  max-width: 900px;
  margin: 0 auto;
  padding: 0 1rem;
}

.articulo-full {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 3rem;
}

.articulo-header {
  margin-bottom: 2rem;
  border-bottom: 2px solid #eee;
  padding-bottom: 1.5rem;
}

.articulo-header h1 {
  color: var(--secondary-natural);
  font-size: 2.5rem;
  margin: 0 0 0.75rem 0;
  line-height: 1.3;
}

.meta {
  color: #999;
  font-size: 0.95rem;
  margin: 0;
}

.articulo-imagen {
  height: 400px;
  background: linear-gradient(135deg, var(--bg-light-3) 0%, var(--bg-light-4) 100%);
  border-radius: 8px;
  margin: 2rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-placeholder {
  font-size: 1.2rem;
  color: #666;
  text-align: center;
  padding: 1rem;
  font-weight: bold;
}

.articulo-content {
  margin: 2rem 0;
  line-height: 2;
}

.parrafo {
  color: #555;
  font-size: 1rem;
  margin-bottom: 1.5rem;
  text-align: justify;
  text-justify: inter-word;
}

/* Compartir */
.compartir {
  margin: 2rem 0;
  padding: 1.5rem;
  background: var(--bg-light-3);
  border-radius: 8px;
}

.compartir h3 {
  color: var(--secondary-natural);
  margin: 0 0 1rem 0;
}

.compartir-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn-compartir {
  padding: 0.6rem 1.2rem;
  border-radius: 5px;
  text-decoration: none;
  font-weight: 500;
  color: white;
  transition: all 0.3s ease;
  display: inline-block;
}

.facebook {
  background: #1877f2;
}

.facebook:hover {
  background: #0a66c2;
}

.twitter {
  background: #1da1f2;
}

.twitter:hover {
  background: #1a91da;
}

.whatsapp {
  background: #25d366;
}

.whatsapp:hover {
  background: #20ba5a;
}

/* CTA Section */
.cta-section {
  background: linear-gradient(135deg, var(--secondary-cream) 0%, var(--bg-light-2) 100%);
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  margin-top: 2rem;
}

.cta-section h3 {
  color: var(--secondary-natural);
  margin: 0 0 1.5rem 0;
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

/* Artículos Relacionados */
.articulos-relacionados {
  margin: 3rem 0;
}

.articulos-relacionados h2 {
  color: var(--secondary-natural);
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2rem;
}

.articulos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.articulo-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.articulo-card:hover {
  transform: translateY(-3px);
}

.articulo-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.articulo-imagen-peq {
  height: 180px;
  background: linear-gradient(135deg, var(--bg-light-3) 0%, var(--bg-light-4) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.articulo-info {
  padding: 1rem;
}

.articulo-info h3 {
  color: var(--secondary-natural);
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
}

.articulo-info .fecha {
  color: #999;
  font-size: 0.8rem;
  margin: 0;
}

/* No encontrado */
.no-encontrado {
  min-height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-light);
  padding: 2rem;
  text-align: center;
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

  .articulo-full {
    padding: 1rem;
  }

  .breadcrumb {
    margin: 1rem 0 1.5rem 0;
    padding: 0.75rem;
  }

  .articulo-header h1 {
    font-size: 1.8rem;
    margin-bottom: 1rem;
  }

  .articulo-header p {
    font-size: 0.95rem;
  }

  .articulo-imagen {
    height: 250px;
    margin-bottom: 1.5rem;
  }

  .compartir-buttons {
    flex-direction: column;
    gap: 0.75rem;
  }

  .btn-compartir {
    width: 100%;
    padding: 0.75rem;
  }

  .parrafo {
    font-size: 0.95rem;
    text-align: left;
    line-height: 1.6;
  }

  .relacionados {
    margin-top: 2rem;
  }

  .articulos-relacionados {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 0.75rem;
  }

  .articulo-full {
    padding: 0.75rem;
  }

  .breadcrumb {
    margin: 0.75rem 0 1rem 0;
    padding: 0.5rem;
    font-size: 0.9rem;
  }

  .articulo-header h1 {
    font-size: 1.5rem;
  }

  .articulo-header p {
    font-size: 0.85rem;
    gap: 0.5rem;
  }

  .articulo-imagen {
    height: 200px;
    margin-bottom: 1rem;
  }

  .compartir-buttons {
    gap: 0.5rem;
  }

  .btn-compartir {
    padding: 0.6rem 0.75rem;
    font-size: 0.85rem;
  }

  .parrafo {
    font-size: 0.9rem;
  }

  .relacionados h2 {
    font-size: 1.3rem;
  }
}
</style>
