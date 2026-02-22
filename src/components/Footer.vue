<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h3>ArtesaníasAni</h3>
          <p>{{ empresaInfo.eslogan }}</p>
          <p class="description">Piezas de cerámica pintadas a mano y velas artesanales personalizadas.</p>
        </div>

        <div class="footer-section">
          <h3>Enlaces Rápidos</h3>
          <ul>
            <li><router-link to="/">Inicio</router-link></li>
            <li><router-link to="/galeria">Galería</router-link></li>
            <li><router-link to="/sobre">Sobre Mí</router-link></li>
            <li><router-link to="/blog">Blog</router-link></li>
            <li><router-link to="/contacto">Contacto</router-link></li>
          </ul>
        </div>

        <div class="footer-section">
          <h3>Contacto</h3>
          <ul class="contact-list">
            <li>
              <strong>WhatsApp:</strong>
              <a :href="'https://wa.me/' + empresaInfo.contacto.whatsapp.replace(/\D/g, '')" target="_blank">
                {{ empresaInfo.contacto.whatsapp }}
              </a>
            </li>
            <li>
              <strong>Email:</strong>
              <a :href="'mailto:' + empresaInfo.contacto.email">{{ empresaInfo.contacto.email }}</a>
            </li>
            <li>
              <strong>Horarios:</strong> {{ empresaInfo.contacto.horarios }}
            </li>
          </ul>
        </div>

        <div class="footer-section">
          <h3>Sígueme</h3>
          <div class="social-links">
            <a :href="empresaInfo.contacto.facebook" target="_blank" class="social-link facebook" title="Facebook">
              <i class="icon">f</i> Facebook
            </a>
            <a :href="empresaInfo.contacto.instagram" target="_blank" class="social-link instagram" title="Instagram">
              <i class="icon">📷</i> Instagram
            </a>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; 2026 ArtesaníasAni. Todos los derechos reservados. Hecho con ❤️ por Ana Herrera</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { empresaInfo } from '../data/artesanias'
</script>

<style scoped>
.footer {
  background: linear-gradient(135deg, #3a3a3a 0%, #2a2a2a 100%);
  color: #fff;
  padding: 3rem 0 1rem;
  margin-top: 4rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-section h3 {
  color: var(--secondary-cream);
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.footer-section p {
  margin: 0.5rem 0;
  color: #ccc;
  line-height: 1.6;
}

.description {
  font-size: 0.9rem;
}

.footer-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-section li {
  margin: 0.5rem 0;
}

.footer-section a {
  color: var(--secondary-cream);
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-section a:hover {
  color: var(--secondary-terracotta);
}

.contact-list li {
  margin: 0.75rem 0;
  font-size: 0.95rem;
}

.contact-list strong {
  color: var(--secondary-cream);
}

.social-links {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.social-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(193, 122, 92, 0.2);
  border-radius: 5px;
  color: var(--secondary-cream);
  text-decoration: none;
  transition: background-color 0.3s ease;
  width: fit-content;
}

.social-link:hover {
  background: rgba(193, 122, 92, 0.5);
}

.icon {
  font-size: 1.2rem;
}

.facebook {
  color: #1877f2;
}

.instagram {
  color: #e4405f;
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 1.5rem;
  text-align: center;
  color: #aaa;
  font-size: 0.9rem;
}

@media (max-width: 1024px) {
  .footer-content {
    gap: 1rem;
  }

  .container {
    padding: 0 1rem;
  }
}

@media (max-width: 768px) {
  .footer {
    padding: 2rem 1rem 1rem 1rem;
  }

  .container {
    padding: 0 1rem;
  }

  .footer-content {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .footer-section h3 {
    font-size: 1rem;
  }

  .footer-section p {
    font-size: 0.9rem;
  }

  .social-links {
    gap: 0.75rem;
  }

  .social-link {
    width: 35px;
    height: 35px;
  }
}

@media (max-width: 480px) {
  .footer {
    padding: 1.5rem 0.75rem 0.75rem 0.75rem;
  }

  .container {
    padding: 0 0.75rem;
  }

  .footer-section h3 {
    font-size: 0.95rem;
  }

  .footer-section p {
    font-size: 0.85rem;
  }

  .footer-bottom {
    padding-top: 1rem;
    font-size: 0.8rem;
  }
}
</style>
