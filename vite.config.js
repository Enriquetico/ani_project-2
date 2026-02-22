import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { productos, articulos } from './src/data/artesanias.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8787',
        changeOrigin: true
      }
    }
  },
  ssgOptions: {
    includedRoutes(paths) {
      const productRoutes = productos.map((producto) => `/producto/${producto.id}`)
      const blogRoutes = articulos.map((articulo) => `/blog/${articulo.id}`)
      const staticRoutes = paths.filter((path) => !path.includes(':'))

      return [...new Set([...staticRoutes, ...productRoutes, ...blogRoutes])]
    }
  }
})
