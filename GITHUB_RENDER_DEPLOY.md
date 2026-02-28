# Flujo completo: GitHub -> Render (Frontend + API)

## 1) Validar localmente

```bash
npm install
cp .env.backend.example .env.backend
npm run dev:full
curl -sS http://localhost:8787/api/health
```

Resultado esperado:

```json
{"ok":true}
```

## 2) Subir código a GitHub

```bash
git add .
git commit -m "chore: preparar deploy en render"
git push -u origin main
```

## 3) Crear Blueprint en Render

1. En Render: **New +** -> **Blueprint**
2. Selecciona tu repositorio
3. Render detecta `render.yaml`

## 4) Servicios que se crearán

- `artesaniasani-web` (Static Site)
  - `buildCommand`: `npm install && npm run build`
  - `staticPublishPath`: `dist`
- `artesaniasani-api` (Node Web Service)
  - `buildCommand`: `npm install --omit=dev && python3 -m pip install Pillow`
  - `startCommand`: `npm run start:api`
  - `healthCheckPath`: `/api/health`

## 5) Variables críticas

En `artesaniasani-api` configura como secretos:

- `ADMIN_PASSWORD`
- `JWT_SECRET`

Variables importantes ya definidas en `render.yaml`:

- `FRONTEND_ORIGIN=https://artesaniasani.onrender.com`
- `COOKIE_SAME_SITE=none`
- `COOKIE_SECURE=true`
- `PRODUCT_IMAGES_PUBLIC_BASE_URL=https://artesaniasani-api.onrender.com`

## 6) Verificar despliegue

API:

```bash
curl -sS https://artesaniasani-api.onrender.com/api/health
```

Frontend:

- `https://artesaniasani.onrender.com`

## 7) Si cambian las URLs

Actualiza en Render:

- En `artesaniasani-web`:
  - `VITE_API_BASE_URL=https://TU-API.onrender.com/api`
  - `VITE_SITE_URL=https://TU-WEB.onrender.com`
  - `SITE_URL=https://TU-WEB.onrender.com`
- En `artesaniasani-api`:
  - `FRONTEND_ORIGIN=https://TU-WEB.onrender.com`
  - `PRODUCT_IMAGES_PUBLIC_BASE_URL=https://TU-API.onrender.com`

Y redeploy de ambos servicios.
