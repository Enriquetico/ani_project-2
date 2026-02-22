<template>
  <div class="sobre">
    <!-- Header -->
    <div class="sobre-header">
      <h1>Sobre ArtesaníasAni</h1>
      <p>Conoce la historia detrás de cada pieza</p>
    </div>

    <div class="container">
      <!-- Historia -->
      <section class="seccion historia">
        <div class="historia-content">
          <div class="historia-texto">
            <h2>Hola, soy {{ empresaInfo.propietaria }}</h2>
            <p>
              Bienvenido a ArtesaníasAni, mi espacio dedicado a crear piezas únicas de cerámica pintada a mano y velas artesanales personalizadas.
            </p>
            <p>
              Cada pieza que sale de mi taller es el resultado de dedicación, pasión y un profundo respeto por los materiales. No creemos en la producción en serie; creemos en la autenticidad de lo hecho a mano.
            </p>
            <p>
              {{ empresaInfo.diferenciador }}
            </p>
          </div>
          <div class="historia-imagen">
            <img src="/images/fotoanita.webp" alt="Ana Herrera - Artesana" class="historia-foto" />
          </div>
        </div>
      </section>

      <!-- Misión -->
      <section class="seccion mision">
        <h2>Mi Misión</h2>
        <p>
          Transformar espacios ordinarios en lugares especiales a través del arte hecho a mano. Cada diseño es una oportunidad para traer alegría, inspiración y calidez a tu hogar.
        </p>
      </section>

      <!-- Valores -->
      <section class="seccion">
        <h2>Nuestros Valores</h2>
        <div class="valores-grid">
          <div v-for="valor in empresaInfo.valores" :key="valor.titulo" class="valor-card">
            <h3>{{ valor.titulo }}</h3>
            <p v-if="valor.subtitulo" class="subtitulo">{{ valor.subtitulo }}</p>
            <p>{{ valor.descripcion }}</p>
          </div>
        </div>
      </section>

      <!-- Productos -->
      <section class="seccion productos">
        <h2>¿Qué Creamos?</h2>
        <div class="productos-info">
          <div class="producto-info-card">
            <h3>🎨 Cerámica Pintada a Mano</h3>
            <p>
              Figuras decorativas de cerámica pintadas con técnicas tradicionales. Las temáticas son diversas: animales, figuras religiosas, personajes de anime, hongos mágicos, vehículos, decoraciones navideñas y mucho más.
            </p>
            <p>
              Cada pieza puede ser personalizada en colores y diseño según tus preferencias.
            </p>
          </div>
          <div class="producto-info-card">
            <h3>🕯️ Velas Artesanales</h3>
            <p>
              Velas hechas a mano con cera natural, completamente personalizables en colores y aromas. Perfectas para crear ambiente y disfrutar de momentos especiales.
            </p>
          </div>
        </div>
      </section>

      <!-- Proceso -->
      <section class="seccion proceso">
        <h2>Nuestro Proceso de Creación</h2>
        <div class="proceso-pasos">
          <div class="paso">
            <div class="paso-numero">1</div>
            <h4>Consulta Inicial</h4>
            <p>Conversamos contigo para entender tu visión y necesidades exactas.</p>
          </div>
          <div class="paso">
            <div class="paso-numero">2</div>
            <h4>Selección de Materiales</h4>
            <p>Elegimos cerámica de calidad y pinturas acrílicas premium para tu pieza.</p>
          </div>
          <div class="paso">
            <div class="paso-numero">3</div>
            <h4>Creación Artesanal</h4>
            <p>Cada pieza es pintada a mano con dedicación y cuidado en los detalles.</p>
          </div>
          <div class="paso">
            <div class="paso-numero">4</div>
            <h4>Control de Calidad</h4>
            <p>Revisamos minuciosamente cada obra antes de entregarla.</p>
          </div>
          <div class="paso">
            <div class="paso-numero">5</div>
            <h4>Entrega</h4>
            <p>Tu pieza llega empacada cuidadosamente en su nuevo hogar.</p>
          </div>
        </div>
      </section>

      <!-- Materiales -->
      <section class="seccion materiales">
        <h2>Materiales Utilizados</h2>
        <div class="materiales-lista">
          <div v-for="material in empresaInfo.materiales" :key="material" class="material-item">
            <span class="material-icon">✓</span>
            <span>{{ material }}</span>
          </div>
        </div>
        <p class="nota-materiales">
          Todos nuestros materiales son de alta calidad, seleccionados para garantizar durabilidad y belleza en cada pieza.
        </p>
      </section>

      <!-- Información de Pedidos -->
      <section class="seccion informacion">
        <h2>Información sobre Pedidos</h2>
        <div class="info-grid">
          <div class="info-card">
            <h3>Sistema de Trabajo</h3>
            <p><strong>{{ empresaInfo.sistema }}</strong></p>
            <p>Cada pieza se elabora especialmente para ti según tus especificaciones.</p>
          </div>
          <div class="info-card">
            <h3>Tiempo de Elaboración</h3>
            <p>{{empresaInfo.tiempoEntrega}}</p>
            <p>El tiempo depende de la complejidad del diseño y disponibilidad de materiales.</p>
          </div>
          <div class="info-card">
            <h3>Envíos</h3>
            <p><strong>Sí enviamos</strong> a nivel {{ empresaInfo.alcance }}</p>
            <p>{{ empresaInfo.costoEnvio }}</p>
          </div>
          <div class="info-card">
            <h3>Retiro Personal</h3>
            <p><strong>Disponible</strong></p>
            <p>Puedes retirar tu pedido directamente en mi taller.</p>
          </div>
          <div class="info-card">
            <h3>Formas de Pago</h3>
            <p>Aceptamos:</p>
            <ul>
              <li>Transferencia bancaria</li>
              <li>Simple</li>
            </ul>
          </div>
          <div class="info-card">
            <h3>Depósito</h3>
            <p>{{ empresaInfo.deposito }}</p>
            <p>Esto asegura la fabricación de tu pieza personalizada.</p>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="seccion cta">
        <h2>Comencemos Tu Proyecto</h2>
        <p>¿Tienes una idea? Me encantaría escucharla y convertirla en realidad.</p>
        <div class="cta-buttons">
          <router-link to="/contacto" class="btn btn-primary btn-large">Contactarme</router-link>
          <router-link to="/galeria" class="btn btn-secondary btn-large">Ver Galería</router-link>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { empresaInfo } from '../data/artesanias'
</script>

<style scoped>
.sobre {
  background: var(--bg-light);
  padding: 0;
}

.sobre-header {
  background: linear-gradient(135deg, var(--secondary-cream) 0%, var(--bg-light-2) 100%);
  padding: 3rem 1rem;
  text-align: center;
  margin-bottom: 2rem;
}

.sobre-header h1 {
  font-size: 2.5rem;
  color: var(--secondary-natural);
  margin: 0 0 0.5rem 0;
}

.sobre-header p {
  font-size: 1.1rem;
  color: #666;
  margin: 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.seccion {
  margin: 3rem 0;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}

.seccion h2 {
  color: var(--secondary-natural);
  font-size: 2rem;
  margin: 0 0 1.5rem 0;
  text-align: center;
}

.seccion h3 {
  color: var(--secondary-natural);
  margin: 0 0 0.75rem 0;
}

.seccion p {
  color: #666;
  line-height: 1.8;
  margin: 0 0 1rem 0;
}

.seccion p:last-child {
  margin-bottom: 0;
}

/* Historia */
.historia-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: center;
}

.historia-texto h2 {
  text-align: left;
  margin: 0 0 1.5rem 0;
  font-size: 1.8rem;
}

.historia-texto p {
  font-size: 1rem;
  line-height: 1.8;
}

.historia-imagen {
  display: flex;
  justify-content: center;
}

.historia-foto {
  width: 100%;
  max-width: 350px;
  height: auto;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  object-fit: cover;
  transition: transform 0.3s ease;
}

.historia-foto:hover {
  transform: scale(1.05);
}

.image-placeholder {
  width: 300px;
  height: 400px;
  background: linear-gradient(135deg, var(--bg-light-3) 0%, var(--bg-light-4) 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-weight: bold;
  text-align: center;
  padding: 1rem;
}

/* Misión */
.mision {
  background: linear-gradient(135deg, #fef3e8 0%, var(--secondary-cream) 100%);
  text-align: center;
  padding: 3rem 2rem;
}

.mision p {
  font-size: 1.1rem;
  max-width: 600px;
  margin: 0 auto;
}

/* Valores Grid */
.valores-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.valor-card {
  background: var(--bg-light-3);
  padding: 1.5rem;
  border-radius: 8px;
  border-left: 4px solid var(--secondary-terracotta);
}

.valor-card h3 {
  margin: 0 0 0.5rem 0;
}

.subtitulo {
  color: var(--secondary-terracotta);
  font-weight: 500;
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
}

.valor-card p {
  margin: 0;
  font-size: 0.95rem;
}

/* Productos Info */
.productos-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.producto-info-card {
  background: var(--bg-light-3);
  padding: 2rem;
  border-radius: 8px;
}

.producto-info-card h3 {
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
}

.producto-info-card p {
  margin: 0 0 1rem 0;
}

.producto-info-card p:last-child {
  margin: 0;
}

/* Proceso */
.proceso-pasos {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.paso {
  text-align: center;
  padding: 1.5rem;
  background: var(--bg-light-3);
  border-radius: 8px;
  position: relative;
}

.paso-numero {
  width: 50px;
  height: 50px;
  background: var(--secondary-terracotta);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0 auto 1rem auto;
}

.paso h4 {
  color: var(--secondary-natural);
  margin: 0 0 0.75rem 0;
}

.paso p {
  font-size: 0.9rem;
  margin: 0;
}

/* Materiales */
.materiales-lista {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.material-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: var(--bg-light-3);
  border-radius: 5px;
}

.material-icon {
  color: var(--secondary-terracotta);
  font-weight: bold;
  font-size: 1.2rem;
}

.nota-materiales {
  text-align: center;
  color: #999;
  font-size: 0.9rem;
}

/* Información */
.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.info-card {
  background: var(--bg-light-3);
  padding: 1.5rem;
  border-radius: 8px;
  border-bottom: 3px solid var(--secondary-terracotta);
}

.info-card h3 {
  margin: 0 0 0.75rem 0;
  font-size: 1.1rem;
}

.info-card p {
  margin: 0.5rem 0;
  font-size: 0.95rem;
}

.info-card ul {
  list-style: none;
  padding: 0.5rem 0;
  margin: 0.5rem 0 0 0;
}

.info-card li {
  padding: 0.3rem 0;
}

.info-card li:before {
  content: "✓ ";
  color: var(--secondary-terracotta);
  font-weight: bold;
  margin-right: 0.5rem;
}

/* CTA */
.cta {
  background: linear-gradient(135deg, var(--secondary-terracotta) 0%, var(--secondary-terracotta-dark) 100%);
  color: white;
  text-align: center;
}

.cta h2 {
  color: white;
  margin-bottom: 1rem;
}

.cta p {
  color: rgba(255, 255, 255, 0.95);
  font-size: 1.1rem;
  max-width: 600px;
  margin: 0 auto 2rem auto;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 5px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  display: inline-block;
  text-align: center;
}

.btn-primary {
  background: white;
  color: var(--secondary-terracotta);
}

.btn-primary:hover {
  background: var(--secondary-cream);
  transform: translateY(-2px);
}

.btn-secondary {
  background: transparent;
  color: white;
  border: 2px solid white;
}

.btn-secondary:hover {
  background: white;
  color: var(--secondary-terracotta);
}

.btn-large {
  padding: 1rem 2rem;
  font-size: 1rem;
}

/* Responsive */
@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }

  .sobre-header h1 {
    font-size: 1.8rem;
  }

  .historia-content {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .historia-foto {
    max-width: 100%;
    height: auto;
    width: 100%;
  }

  .seccion {
    padding: 1.5rem 1rem;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 0.75rem;
  }

  .sobre-header h1 {
    font-size: 1.5rem;
  }

  .historia-foto {
    max-width: 100%;
    width: 100%;
  }

  .seccion {
    padding: 1.5rem 0.75rem;
  }

  .seccion h2 {
    font-size: 1.5rem;
  }

  .cta-buttons {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>
