# Despliegue en Hostinger (Frontend + API segura)

Esta guía deja funcionando:

- Frontend estático (Vue/Vite SSG)
- Backend Node.js (Express) con SQLite y cookies `HttpOnly`
- Login de `/admin` en producción

## Arquitectura recomendada

### Opción A (recomendada)

- Frontend en `https://artesaniasani.com`
- Backend en subdominio `https://api.artesaniasani.com`
- Frontend configurado con `VITE_API_BASE_URL=https://api.artesaniasani.com/api`

### Opción B (más simple para cookies/CORS)

- Frontend y backend bajo el mismo dominio usando proxy:
  - Frontend: `https://artesaniasani.com`
  - Proxy: `https://artesaniasani.com/api` → backend Node interno (`127.0.0.1:8787`)
- En este caso el frontend puede seguir usando `VITE_API_BASE_URL=/api`

## 1) Preparar frontend para producción

En local, dentro del proyecto:

```bash
npm install
printf "VITE_API_BASE_URL=https://api.artesaniasani.com/api\n" > .env.production
npm run build
```

Sube el contenido de `dist/` al hosting web de Hostinger (no la carpeta `dist`, sino su contenido interno).

## 2) Preparar backend en Hostinger (Node.js)

En el servidor/app Node de Hostinger:

1. Sube la carpeta del proyecto (o al menos `backend/`, `package.json`, `package-lock.json`).
2. Ejecuta instalación:

```bash
npm install --omit=dev
```

3. Crea `.env.backend` (en la raíz del proyecto) con valores de producción:

```dotenv
API_PORT=8787
NODE_ENV=production
FRONTEND_ORIGIN=https://artesaniasani.com,https://www.artesaniasani.com
ADMIN_USERNAME=admin
ADMIN_PASSWORD=CAMBIA_ESTA_PASSWORD_MUY_SEGURA
JWT_SECRET=CAMBIA_ESTE_SECRETO_MUY_LARGO_Y_UNICO
JWT_EXPIRES_IN=8h
AUTH_LOGIN_WINDOW_MINUTES=15
AUTH_LOGIN_MAX_ATTEMPTS=8
AUTH_LOCK_WINDOW_MINUTES=30
AUTH_LOCK_MAX_FAILURES=5
AUTH_LOCK_DURATION_MINUTES=30
```

4. Inicia la API con:

```bash
npm run start:api
```

Si Hostinger ofrece “Node.js App”, configura el startup command apuntando a:

```bash
node backend/src/server.js
```

## 3) Proxy/reverse proxy (si usas misma raíz con `/api`)

Configura en Hostinger una regla para reenviar:

- `/api/*` → `http://127.0.0.1:8787/api/*`

Con esto:

- Evitas problemas CORS
- Mantienes cookies más simples en mismo sitio
- `VITE_API_BASE_URL` puede quedar como `/api`

## 4) Verificación en producción

Pruebas mínimas:

1. Salud API:

```bash
curl -sS https://api.artesaniasani.com/api/health
```

(o `https://artesaniasani.com/api/health` si usas proxy en mismo dominio)

2. Abre `https://artesaniasani.com/admin`
3. Inicia sesión y verifica que:
   - carga productos,
   - puedes guardar un cambio,
   - puedes cerrar sesión.

## 5) Checklist rápido

- SSL activo en frontend y API (`https`)
- `NODE_ENV=production`
- `ADMIN_PASSWORD` y `JWT_SECRET` únicos y fuertes
- `FRONTEND_ORIGIN` correcto (uno o varios orígenes)
- `VITE_API_BASE_URL` correcto para el frontend publicado

## Notas

- Si frontend y backend quedan en dominios distintos, asegúrate de que `FRONTEND_ORIGIN` incluya exactamente el dominio del frontend.
- La base SQLite queda en `backend/data/ani.sqlite`; haz backup periódico de ese archivo.