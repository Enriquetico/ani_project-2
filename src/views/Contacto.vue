<template>
  <div class="contacto">
    <!-- Header -->
    <div class="contacto-header">
      <h1>Contacto</h1>
      <p>Me encantaría escuchar sobre tu proyecto</p>
    </div>

    <div class="container">
      <div class="contacto-grid">
        <!-- Información de Contacto -->
        <div class="contacto-info">
          <h2>Información de Contacto</h2>
          
          <div class="info-item">
            <h3>📱 WhatsApp</h3>
            <p>La forma más rápida de contactarme</p>
            <a :href="'https://wa.me/' + empresaInfo.contacto.whatsapp.replace(/\D/g, '')" target="_blank" class="btn btn-primary">
              Enviar Mensaje por WhatsApp
            </a>
          </div>

          <div class="info-item">
            <h3>📧 Email</h3>
            <p>Para consultas más detalladas</p>
            <a :href="'mailto:' + empresaInfo.contacto.email" class="btn btn-primary">
              Enviar Email
            </a>
          </div>

          <div class="info-item">
            <h3>🕐 Horarios de Atención</h3>
            <p>{{ empresaInfo.contacto.horarios }}</p>
            <p class="nota">Me respondo en el horario de oficina</p>
          </div>

          <div class="info-item">
            <h3>📍 Ubicación</h3>
            <p>Taller en {{ empresaInfo.alcance }}</p>
            <p class="nota">Oferezco retiro personal de pedidos</p>
          </div>

          <div class="redes-sociales">
            <h3>Sígueme en Redes Sociales</h3>
            <div class="social-links">
              <a :href="empresaInfo.contacto.facebook" target="_blank" class="social-btn facebook">
                f Facebook
              </a>
              <a :href="empresaInfo.contacto.instagram" target="_blank" class="social-btn instagram">
                📷 Instagram
              </a>
            </div>
          </div>
        </div>

        <!-- Formulario -->
        <div class="contacto-form">
          <h2>Envíame un Mensaje</h2>
          <form @submit.prevent="enviarMensaje">
            <div class="form-group">
              <label for="nombre">Nombre *</label>
              <input
                v-model="formulario.nombre"
                type="text"
                id="nombre"
                placeholder="Tu nombre"
                required
              />
            </div>

            <div class="form-group">
              <label for="email">Email *</label>
              <input
                v-model="formulario.email"
                type="email"
                id="email"
                placeholder="Tu email"
                required
              />
            </div>

            <div class="form-group">
              <label for="telefono">Teléfono (opcional)</label>
              <input
                v-model="formulario.telefono"
                type="tel"
                id="telefono"
                placeholder="Tu teléfono"
              />
            </div>

            <div class="form-group">
              <label for="asunto">Asunto *</label>
              <input
                v-model="formulario.asunto"
                type="text"
                id="asunto"
                placeholder="Asunto del mensaje"
                required
              />
            </div>

            <div class="form-group">
              <label for="mensaje">Mensaje *</label>
              <textarea
                v-model="formulario.mensaje"
                id="mensaje"
                placeholder="Cuéntame sobre tu proyecto..."
                rows="6"
                required
              ></textarea>
            </div>

            <button type="submit" class="btn btn-primary btn-submit" :disabled="enviando">
              {{ enviando ? 'Enviando...' : 'Enviar Mensaje' }}
            </button>

            <p v-if="mensajeExito" class="mensaje-exito">
              ✓ ¡Mensaje enviado exitosamente! Te responderé pronto.
            </p>
            <p v-if="mensajeError" class="mensaje-error">
              ✗ Error al enviar el mensaje. Por favor intenta de nuevo.
            </p>
          </form>
        </div>
      </div>

      <!-- FAQ -->
      <section class="faq">
        <h2>Preguntas Frecuentes</h2>
        <div class="faq-items">
          <div class="faq-item">
            <h3>¿Cuánto tiempo tarda la elaboración?</h3>
            <p>
              El tiempo de elaboración depende de varios factores como la complejidad del diseño y disponibilidad de materiales. No hay un tiempo estimado fijo, pero conversaremos sobre esto en tu consulta inicial.
            </p>
          </div>
          <div class="faq-item">
            <h3>¿Aceptan pedidos personalizados?</h3>
            <p>
              ¡Por supuesto! Todos nuestros productos son personalizables. Puedes especificar colores, tamaños, diseños y mucho más.
            </p>
          </div>
          <div class="faq-item">
            <h3>¿Cuál es el tamaño de los productos?</h3>
            <p>
              Los tamaños varían dependiendo de la pieza. Puedes consultar las especificaciones en cada producto o contactarme para solicitar algo específico.
            </p>
          </div>
          <div class="faq-item">
            <h3>¿Hacen envíos?</h3>
            <p>
              Sí, realizamos envíos a nivel nacional. El costo depende del método y destino. También ofrecemos retiro personal.
            </p>
          </div>
          <div class="faq-item">
            <h3>¿Cuáles son las formas de pago?</h3>
            <p>
              Aceptamos Transferencia bancaria y Simple. Solicitamos el 30% del costo como depósito al recibir el pedido.
            </p>
          </div>
          <div class="faq-item">
            <h3>¿Qué garantía tienen los productos?</h3>
            <p>
              Todos nuestros productos están hechos con materiales de calidad y revisados minuciosamente. Cada pieza es única y está garantizada contra defectos de fabricación.
            </p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { empresaInfo } from '../data/artesanias'
import { api } from '../services/api'

const formulario = reactive({
  nombre: '',
  email: '',
  telefono: '',
  asunto: '',
  mensaje: ''
})

const enviando = ref(false)
const mensajeExito = ref(false)
const mensajeError = ref(false)

const enviarMensaje = async () => {
  enviando.value = true
  mensajeExito.value = false
  mensajeError.value = false

  try {
    await api.sendContacto(formulario)

    // Mostrar éxito
    mensajeExito.value = true
    
    // Limpiar formulario
    formulario.nombre = ''
    formulario.email = ''
    formulario.telefono = ''
    formulario.asunto = ''
    formulario.mensaje = ''

    // Después de 3 segundos, ocultar el mensaje
    setTimeout(() => {
      mensajeExito.value = false
    }, 3000)
  } catch (error) {
    mensajeError.value = true
  } finally {
    enviando.value = false
  }
}
</script>

<style scoped>
.contacto {
  background: var(--bg-light);
  padding: 0;
  min-height: 100vh;
}

.contacto-header {
  background: linear-gradient(135deg, var(--secondary-cream) 0%, var(--bg-light-2) 100%);
  padding: 3rem 1rem;
  text-align: center;
  margin-bottom: 2rem;
}

.contacto-header h1 {
  font-size: 2.5rem;
  color: var(--secondary-natural);
  margin: 0 0 0.5rem 0;
}

.contacto-header p {
  font-size: 1.1rem;
  color: #666;
  margin: 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.contacto-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
}

/* Info de Contacto */
.contacto-info {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  height: fit-content;
}

.contacto-info h2 {
  color: var(--secondary-natural);
  margin: 0 0 2rem 0;
  font-size: 1.8rem;
}

.info-item {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #eee;
}

.info-item:last-of-type {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.info-item h3 {
  color: var(--secondary-natural);
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
}

.info-item p {
  color: #666;
  margin: 0 0 1rem 0;
  line-height: 1.6;
}

.nota {
  font-size: 0.9rem;
  color: #999;
  margin-top: 0.5rem;
}

.redes-sociales {
  border-top: 2px solid var(--secondary-terracotta);
  padding-top: 1.5rem;
  margin-top: 1.5rem;
}

.redes-sociales h3 {
  color: var(--secondary-natural);
  margin: 0 0 1rem 0;
}

.social-links {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.social-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: rgba(193, 122, 92, 0.1);
  border-radius: 5px;
  color: var(--secondary-terracotta);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.social-btn:hover {
  background: rgba(193, 122, 92, 0.2);
  transform: translateX(5px);
}

.facebook {
  color: #1877f2;
  background: rgba(24, 119, 242, 0.1);
}

.facebook:hover {
  background: rgba(24, 119, 242, 0.2);
}

.instagram {
  color: #e4405f;
  background: rgba(228, 64, 95, 0.1);
}

.instagram:hover {
  background: rgba(228, 64, 95, 0.2);
}

/* Formulario */
.contacto-form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}

.contacto-form h2 {
  color: var(--secondary-natural);
  margin: 0 0 1.5rem 0;
  font-size: 1.8rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--secondary-natural);
  font-weight: 500;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 5px;
  font-family: inherit;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
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

.btn-primary:hover:not(:disabled) {
  background: var(--secondary-terracotta-dark);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(193, 122, 92, 0.3);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-submit {
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  margin-top: 1rem;
}

.mensaje-exito {
  color: #27ae60;
  background: #d5f4e6;
  padding: 1rem;
  border-radius: 5px;
  margin-top: 1rem;
  text-align: center;
}

.mensaje-error {
  color: #c0392b;
  background: #fadbd8;
  padding: 1rem;
  border-radius: 5px;
  margin-top: 1rem;
  text-align: center;
}

/* FAQ */
.faq {
  margin: 3rem 0;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}

.faq h2 {
  color: var(--secondary-natural);
  text-align: center;
  margin: 0 0 2rem 0;
  font-size: 2rem;
}

.faq-items {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.faq-item {
  padding: 1.5rem;
  background: var(--bg-light-3);
  border-radius: 8px;
  border-left: 4px solid var(--secondary-terracotta);
}

.faq-item h3 {
  color: var(--secondary-natural);
  margin: 0 0 1rem 0;
}

.faq-item p {
  color: #666;
  margin: 0;
  line-height: 1.6;
  font-size: 0.95rem;
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

  .contacto-header h1 {
    font-size: 1.8rem;
  }

  .contacto-header p {
    font-size: 1rem;
  }

  .contacto-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .contacto-info {
    height: auto;
    padding: 1.5rem;
  }

  .faq-items {
    grid-template-columns: 1fr;
  }

  .btn-submit {
    width: 100%;
  }

  form {
    gap: 1rem;
  }

  input,
  textarea {
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 0.75rem;
  }

  .contacto {
    padding: 1rem 0;
  }

  .contacto-header h1 {
    font-size: 1.5rem;
  }

  .contacto-header p {
    font-size: 0.95rem;
  }

  .contacto-info {
    padding: 1rem;
  }

  .info-item {
    padding: 0.75rem 0;
  }

  .info-item h3 {
    font-size: 0.95rem;
  }

  form {
    padding: 1rem 0.75rem;
  }

  input,
  textarea {
    padding: 0.75rem;
  }

  .faq-item {
    padding: 1rem 0.75rem;
  }

  .faq-question {
    font-size: 0.95rem;
  }
}
</style>
