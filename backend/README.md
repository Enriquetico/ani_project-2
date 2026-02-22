# Backend API (Fase 2)

Backend mínimo en Node.js + Express + SQLite para reemplazar autenticación y persistencia local insegura.

## 1) Configuración

1. Copia variables de entorno:

```bash
cp .env.backend.example .env.backend
```

2. Edita `.env.backend` y define valores seguros para:
- `ADMIN_PASSWORD`
- `JWT_SECRET`
- `FRONTEND_ORIGIN` (uno o varios, separados por coma)
- `COOKIE_SAME_SITE` (`none` para frontend/API en dominios distintos)
- `COOKIE_SECURE` (`true` en producción; obligatorio si `COOKIE_SAME_SITE=none`)
- `AUTH_LOGIN_WINDOW_MINUTES`
- `AUTH_LOGIN_MAX_ATTEMPTS`
- `AUTH_LOCK_WINDOW_MINUTES`
- `AUTH_LOCK_MAX_FAILURES`
- `AUTH_LOCK_DURATION_MINUTES`

Ejemplo de `FRONTEND_ORIGIN`:

```dotenv
FRONTEND_ORIGIN=https://artesaniasani.com,https://www.artesaniasani.com
```

## 2) Instalar dependencias

```bash
npm install
```

## 3) Ejecutar

Solo backend:

```bash
npm run dev:api
```

Backend + frontend:

```bash
npm run dev:full
```

## Endpoints principales

- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/admin/login-attempts` (protegido)
- `POST /api/admin/optimize-image` (protegido, multipart `image`)
- `GET /api/admin/image-upload-config` (protegido)
- `GET|POST|PUT|DELETE /api/productos` (protegidos)
- `GET /api/public/productos`
- `GET /api/mensajes` (protegido)
- `GET|DELETE /api/suscriptores` (protegidos)
- `POST /api/public/contacto`
- `POST /api/public/suscriptores`

## Notas de seguridad

- Sesión por cookie `HttpOnly`.
- Cookies cross-site soportadas vía `COOKIE_SAME_SITE` y `COOKIE_SECURE`.
- Password de admin hasheada con `bcrypt` en base de datos.
- Sin secretos en frontend.
- Rate-limit en login para mitigar fuerza bruta.
- Validación de payloads con Zod en endpoints críticos.
- Bloqueo progresivo por combinación usuario+IP.
- Auditoría de intentos de login en tabla `login_attempts`.
- Archivo SQLite en `backend/data/ani.sqlite`.

## Optimización de imágenes desde Admin

El endpoint `POST /api/admin/optimize-image` permite subir una imagen, optimizarla con el script `scripts/optimizador_imagenes.py` y devolver la ruta final para guardarla en el producto.

Requisitos del servidor:

- `python3` disponible (o configurar `PYTHON_BIN`)
- Paquete Python `Pillow` instalado (`python3 -m pip install Pillow`)

Variables opcionales:

- `PRODUCT_IMAGES_DIR` (default: `public/images`)
- `IMAGE_MAX_SIZE` (default: `1024`)
- `IMAGE_QUALITY` (default: `80`)
- `IMAGE_SOFT_BLOCK_MB` (default: `8`, límite recomendado en UI)
- `IMAGE_UPLOAD_MAX_MB` (default: `15`, límite máximo de carga)

Perfil equilibrado sugerido para producción:

- `IMAGE_MAX_SIZE=1600`
- `IMAGE_QUALITY=82`
- `IMAGE_SOFT_BLOCK_MB=5`
- `IMAGE_UPLOAD_MAX_MB=12`
