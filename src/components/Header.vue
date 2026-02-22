<template>
  <header class="header">
    <div class="header-top">
      <div class="container">
        <div class="header-content">
          <router-link to="/" class="logo">
            <img src="/images/logoanita.webp" alt="ArtesaníasAni" class="logo-img" />
          </router-link>
          
          <nav class="nav-main">
            <router-link to="/" class="nav-link" @click="scrollToTop">Inicio</router-link>
            <router-link to="/sobre" class="nav-link" @click="scrollToTop">Sobre Mí</router-link>
            <router-link to="/galeria" class="nav-link" @click="scrollToTop">Galería</router-link>
            <router-link to="/blog" class="nav-link" @click="scrollToTop">Blog</router-link>
            <router-link to="/contacto" class="nav-link" @click="scrollToTop">Contacto</router-link>
            <router-link to="/admin" class="nav-link admin-btn" @click="scrollToTop">Admin</router-link>
          </nav>

          <button class="menu-toggle" @click="toggleMenu" :class="{ active: mobileMenuOpen }">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <nav v-if="mobileMenuOpen" class="mobile-menu">
      <router-link to="/" class="mobile-nav-link" @click="closeMobileMenu(true)">Inicio</router-link>
      <router-link to="/sobre" class="mobile-nav-link" @click="closeMobileMenu(true)">Sobre Mí</router-link>
      <router-link to="/galeria" class="mobile-nav-link" @click="closeMobileMenu(true)">Galería</router-link>
      <router-link to="/blog" class="mobile-nav-link" @click="closeMobileMenu(true)">Blog</router-link>
      <router-link to="/contacto" class="mobile-nav-link" @click="closeMobileMenu(true)">Contacto</router-link>
      <router-link to="/admin" class="mobile-nav-link" @click="closeMobileMenu(true)">Admin</router-link>
    </nav>
  </header>
</template>

<script setup>
import { ref } from 'vue'

const mobileMenuOpen = ref(false)

const toggleMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = (goTop = true) => {
  mobileMenuOpen.value = false
  if (goTop) {
    scrollToTop()
  }
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<style scoped>
.header {
  background: var(--gradient-header);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-top {
  padding: 1rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  text-decoration: none;
  color: inherit;
  flex: 1;
  display: flex;
  align-items: center;
}

.logo-img {
  height: 70px;
  width: auto;
  transition: transform 0.3s ease;
}

.logo:hover .logo-img {
  transform: scale(1.05);
}

.nav-main {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.nav-link {
  text-decoration: none;
  color: #555;
  font-weight: 500;
  transition: color 0.3s ease;
  white-space: nowrap;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: var(--secondary-terracotta);
}

.admin-btn {
  background: var(--secondary-terracotta);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  font-size: 0.9rem;
}

.admin-btn:hover {
  background: var(--secondary-terracotta-dark);
  color: white;
}

.menu-toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.menu-toggle span {
  width: 25px;
  height: 3px;
  background: #555;
  border-radius: 2px;
  transition: 0.3s;
}

.menu-toggle.active span:nth-child(1) {
  transform: rotate(45deg) translateY(10px);
}

.menu-toggle.active span:nth-child(2) {
  opacity: 0;
}

.menu-toggle.active span:nth-child(3) {
  transform: rotate(-45deg) translateY(-10px);
}

.mobile-menu {
  display: none;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  background: var(--bg-light-2);
}

.mobile-nav-link {
  display: block;
  padding: 0.75rem;
  text-decoration: none;
  color: #555;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.mobile-nav-link:hover {
  background-color: var(--bg-light-3);
}

/* Responsive */
@media (max-width: 1024px) {
  .nav-main {
    gap: 1rem;
  }

  .nav-link {
    font-size: 0.95rem;
  }
}

@media (max-width: 768px) {
  .header-top {
    padding: 0.75rem 0;
  }

  .header-content {
    padding: 0 0.5rem;
  }

  .logo-img {
    height: 50px;
  }

  .nav-main {
    display: none;
  }

  .menu-toggle {
    display: flex;
  }

  .mobile-menu {
    display: flex;
  }
}

@media (max-width: 480px) {
  .logo-img {
    height: 40px;
  }

  .mobile-nav-link {
    padding: 0.6rem;
    font-size: 0.95rem;
  }

  .mobile-menu {
    padding: 0.75rem;
    gap: 0.25rem;
  }

  .menu-toggle span {
    width: 20px;
    height: 2.5px;
  }
}
</style>
