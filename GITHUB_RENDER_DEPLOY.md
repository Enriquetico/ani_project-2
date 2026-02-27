# Flujo completo: API local → GitHub → Render → Frontend

## 1) Crear / validar API local

```bash
npm install
npm run dev:api
curl -sS http://localhost:8787/api/health
```

Resultado esperado:

```json
{"ok":true}
```

## 2) Subir código a GitHub

Este proyecto ya está inicializado en Git y con commit en `main`.

Solo falta enlazar tu repositorio y hacer push:

```bash
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
git push -u origin main
```

## 3) Render descarga código desde GitHub

En Render:

1. New + → Blueprint
2. Selecciona tu repo
3. Render detecta `render.yaml`

## 4) Render ejecuta servidor

`render.yaml` ya incluye:

- `buildCommand`: instala dependencias Node y Pillow
- `startCommand`: `npm run start:api`
- `healthCheckPath`: `/api/health`

Variables críticas en Render:

- `ADMIN_PASSWORD` (secret)
- `JWT_SECRET` (secret)
- `FRONTEND_ORIGIN=https://artesaniasani.neocities.org`
- `COOKIE_SAME_SITE=none`
- `COOKIE_SECURE=true`
- `PRODUCT_IMAGES_PUBLIC_BASE_URL=https://artesaniasani-api.onrender.com`

Nota:

- `DB_PATH=/tmp/ani.sqlite` (configurado en `render.yaml`) no es persistente entre reinicios/redeploys.

## 5) Obtener URL pública

Render te entregará una URL similar a:

`https://artesaniasani-api.onrender.com`

Prueba:

```bash
curl -sS https://artesaniasani-api.onrender.com/api/health
```

## 6) Conectar frontend

`.env.production` ya está configurado con:

```dotenv
VITE_API_BASE_URL=https://artesaniasani-api.onrender.com/api
```

Compilar para Neocities:

```bash
npm run build:neocities
```

Luego sube el contenido interno de `dist/` a Neocities.

---

## Si tu URL de Render cambia

Actualiza `.env.production` con la URL real:

```dotenv
VITE_API_BASE_URL=https://TU-URL-REAL.onrender.com/api
```

Y también actualiza en Render la variable:

```dotenv
PRODUCT_IMAGES_PUBLIC_BASE_URL=https://TU-URL-REAL.onrender.com
```

Y vuelve a ejecutar:

```bash
npm run build:neocities
```
