# Artesanias Ani Web

Sitio web de **ArtesaníasAni** desarrollado con Vue 3 + Vite para mostrar productos artesanales, historia de la marca, blog y contacto.

## Tecnologías

- Vue 3
- Vue Router
- Vite
- CSS

## Requisitos

- Node.js 18+ (recomendado)
- npm

## Configuración recomendada de IDE

- [VS Code](https://code.visualstudio.com/)
- [Vue (Official) - Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)
- Deshabilitar Vetur si está instalado

## Configuración recomendada del navegador

- Chromium (Chrome, Edge, Brave, etc.)
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Activar Custom Object Formatter en Chrome DevTools](http://bit.ly/object-formatters)
- Firefox
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Activar Custom Object Formatter en Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Personalizar configuración

Consulta la [referencia de configuración de Vite](https://vite.dev/config/)

## Inicio rápido

```bash
npm install
npm run dev
```

Abre: `http://localhost:5173/`

## Scripts disponibles

```bash
npm run dev              # Desarrollo local
npm run dev:api          # Backend API local (auth + datos)
npm run dev:full         # Backend + frontend en paralelo
npm run validate:images  # Valida nombres SEO-friendly en public/images
npm run build            # Compilación de producción
npm run preview          # Vista local de la compilación
npm run build:neocities  # Compilación + ajustes para Neocities (404 + .nojekyll)
```

## Backend (seguridad)

Existe un backend base en `backend/` con autenticación segura (cookie HttpOnly + bcrypt + JWT) y base de datos SQLite.

```bash
cp .env.backend.example .env.backend
npm install
npm run dev:full
```

Documentación detallada: `backend/README.md`.

## Frontend: URL de API por entorno

El frontend usa `VITE_API_BASE_URL`.

- Desarrollo local: no necesitas definirla (usa `/api` con el proxy de Vite).
- Producción (frontend y API en dominios distintos): define `VITE_API_BASE_URL` con la URL base del backend, por ejemplo `https://api.tudominio.com/api`.

Ejemplo:

```bash
echo "VITE_API_BASE_URL=https://api.tudominio.com/api" > .env.production
```

## Configuración del proyecto

```bash
npm install
```

### Compilar y recargar en caliente para desarrollo

```bash
npm run dev
```

### Compilar y minificar para producción

```bash
npm run build
```

## Despliegue en Neocities

1. Genera archivos para despliegue:

   ```bash
   npm run build:neocities
   ```

2. Sube a Neocities el contenido interno de `dist/` (no la carpeta `dist` completa).
3. Reemplaza al menos: `index.html`, `404.html`, `assets/`, `images/` (si hubo cambios de imágenes).

## Despliegue en Hostinger (frontend + backend seguro)

Guía paso a paso: `HOSTINGER_DEPLOY.md`.

## SEO y dominio oficial

- Dominio actual: `https://artesaniasani.neocities.org/`
- `canonical` y metadatos Open Graph/Twitter ya apuntan al dominio nuevo en `index.html`.

## 🔐 Verificación de Google Search Console

Método activo: **meta tag** en `index.html`.

Tag configurado:

```html
<meta name="google-site-verification" content="gCQs3c7xL2sOIdcaPb2GxrNxCS_qfrXNb0o7GxCsams" />
```

## Estructura principal

```txt
src/
  components/
  data/
  router/
  views/
public/
  images/
scripts/
dist/
```
