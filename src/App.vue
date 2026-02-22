<script setup>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import { useToastStore } from './services/toast'

const { toasts, removeToast } = useToastStore()
</script>

<template>
  <Header />
  <main class="main-content">
    <RouterView />
  </main>

  <div class="toast-container" aria-live="polite" aria-atomic="true">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      :class="['toast-item', `toast-${toast.type}`]"
      role="status"
    >
      <p>{{ toast.message }}</p>
      <button type="button" class="toast-close" @click="removeToast(toast.id)">×</button>
    </div>
  </div>

  <Footer />
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
  background-color: var(--bg-light);
}

.main-content {
  min-height: calc(100vh - 200px);
}

html {
  scroll-behavior: smooth;
}

.toast-container {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  max-width: min(420px, calc(100vw - 2rem));
}

.toast-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  border-radius: 8px;
  padding: 0.7rem 0.9rem;
  background: var(--bg-lighter);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.12);
  border-left: 4px solid var(--secondary-terracotta);
}

.toast-item p {
  margin: 0;
  color: var(--text-dark);
  font-weight: 500;
}

.toast-success {
  border-left-color: var(--secondary-terracotta);
}

.toast-error {
  border-left-color: var(--secondary-natural);
}

.toast-close {
  border: none;
  background: transparent;
  color: var(--text-dark);
  font-size: 1.1rem;
  line-height: 1;
  cursor: pointer;
}

/* Scrollbar personalizado */
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: var(--secondary-terracotta);
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--secondary-terracotta-dark);
}
</style>

