<template>
  <div class="not-found">
    <div class="container">
      <img src="/images/logoanita.webp" alt="Logo Artesanías Anita" class="logo" />
      <h1>404</h1>
      <h2>Página no encontrada</h2>
      <p>
        La ruta que estás buscando no existe o fue movida.
        Puedes volver al inicio y seguir explorando nuestras artesanías.
      </p>
      <router-link to="/" class="btn-home">Volver al inicio</router-link>
    </div>
  </div>
</template>

<style scoped>
.not-found {
  min-height: calc(100vh - 120px);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: var(--bg-light);
  padding: 2rem 1rem;
}

.container {
  max-width: 640px;
  margin: 0 auto;
}

.logo {
  width: 110px;
  height: auto;
  margin-bottom: 1.25rem;
}

h1 {
  font-size: 5rem;
  color: var(--secondary-terracotta);
  line-height: 1;
  margin: 0 0 0.75rem 0;
}

h2 {
  font-size: 1.8rem;
  color: var(--secondary-natural);
  margin: 0 0 0.75rem 0;
}

p {
  color: #666;
  line-height: 1.7;
  margin: 0 0 1.5rem 0;
}

.btn-home {
  display: inline-block;
  text-decoration: none;
  background: var(--secondary-terracotta);
  color: white;
  padding: 0.8rem 1.4rem;
  border-radius: 6px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-home:hover {
  background: var(--secondary-terracotta-dark);
  transform: translateY(-2px);
}

@media (max-width: 480px) {
  h1 {
    font-size: 4rem;
  }

  h2 {
    font-size: 1.4rem;
  }
}
</style>
