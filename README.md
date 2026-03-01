# Artesanias Ani Web

Sitio web de **ArtesaníasAni** desarrollado con Vue 3 + Vite para mostrar productos artesanales, historia de la marca, blog y contacto.

## Tecnologías

- Vue 3
- Vue Router
- Vite + Vite SSG
- Node.js + Express (API)
- PostgreSQL (Supabase/Render)

## Requisitos

- Node.js 18+ (recomendado)
- npm

## Inicio rápido (local)

```bash
npm install
cp .env.backend.example .env.backend
npm run dev:full
```

- Frontend: `http://localhost:5173`
- API: `http://localhost:8787/api/health`

## Scripts disponibles

```bash
npm run dev              # Frontend local
npm run dev:api          # Backend API local
npm run dev:full         # Backend + frontend en paralelo
npm run admin:unlock     # Limpia bloqueos por intentos fallidos de login
npm run validate:images  # Valida nombres SEO-friendly en public/images
npm run generate:sitemap # Regenera public/sitemap.xml
npm run build            # Build producción (SSG + SEO + rutas estáticas)
npm run build:render     # Alias de build para despliegue en Render
npm run preview          # Vista local del build
```

## Backend (seguridad)

Existe un backend base en `backend/` con autenticación segura (cookie HttpOnly + bcrypt + JWT) y base de datos PostgreSQL.

Documentación detallada: `backend/README.md`.

### Perfil local recomendado (`.env.backend`)

```dotenv
API_PORT=8787
NODE_ENV=development
FRONTEND_ORIGIN=http://localhost:5173
ADMIN_USERNAME=admin
ADMIN_PASSWORD=TU_PASSWORD_LOCAL
JWT_SECRET=TU_SECRETO_LOCAL
COOKIE_SAME_SITE=lax
COOKIE_SECURE=false
```

## Variables frontend para producción

El frontend usa:

- `VITE_API_BASE_URL` (ejemplo: `https://artesaniasani-api.onrender.com/api`)
- `VITE_SITE_URL` (ejemplo: `https://artesaniasani.onrender.com`)

`SITE_URL` también se utiliza en scripts de build para canonical/sitemap.

## Despliegue en Render

Este repo incluye `render.yaml` para desplegar:

- `artesaniasani-web` (Static Site)
- `artesaniasani-api` (Web Service Node)

Pasos:

1. Sube el repo a GitHub.
2. En Render: **New +** -> **Blueprint**.
3. Selecciona el repo.
4. Define secretos en el servicio API:
   - `DATABASE_URL`
   - `ADMIN_PASSWORD`
   - `JWT_SECRET`
5. Espera el deploy de ambos servicios.

## SEO y dominio

- Dominio por defecto de blueprint: `https://artesaniasani.onrender.com`
- Puedes reemplazarlo luego por dominio propio actualizando:
  - `VITE_SITE_URL` y `SITE_URL` en `artesaniasani-web`
  - `FRONTEND_ORIGIN` en `artesaniasani-api`
  - `PRODUCT_IMAGES_PUBLIC_BASE_URL` en `artesaniasani-api` (si cambia la URL del API)

## Verificación rápida post-deploy

```bash
curl -sS https://artesaniasani-api.onrender.com/api/health
```

Debe responder:

```json
{"ok":true}
```
