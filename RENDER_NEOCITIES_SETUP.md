# Render (API) + Neocities (Frontend) - Setup rápido

## 1) Publicar API en Render

1. Sube este proyecto a GitHub.
2. En Render: **New +** → **Blueprint**.
3. Selecciona tu repo (Render detectará `render.yaml`).
4. Completa secretos obligatorios:
   - `ADMIN_PASSWORD`
   - `JWT_SECRET`
5. Verifica/ajusta variables clave en Render:
   - `FRONTEND_ORIGIN=https://artesaniasani.neocities.org`
   - `COOKIE_SAME_SITE=none`
   - `COOKIE_SECURE=true`
6. Deploy.

Al finalizar obtendrás una URL tipo:

`https://artesaniasani-api.onrender.com`

Prueba salud:

`https://artesaniasani-api.onrender.com/api/health`

Debe responder `{ "ok": true }`.

## 2) Conectar frontend para Neocities

En tu máquina local, desde raíz del proyecto:

```bash
printf "VITE_API_BASE_URL=https://artesaniasani-api.onrender.com/api\n" > .env.production
npm run build:neocities
```

## 3) Subir a Neocities

Sube el **contenido interno** de `dist/` al dashboard de Neocities:

- `index.html`
- `404.html`
- `.nojekyll`
- `assets/`
- `images/` (si cambiaste imágenes)
- resto de carpetas/archivos de `dist`

## 4) Verificar admin

Abre:

`https://artesaniasani.neocities.org/admin`

- Inicia sesión con `ADMIN_USERNAME`/`ADMIN_PASSWORD` configurados en Render.
- Crea un producto de prueba.
- Verifica que aparezca en galería.

## 5) Notas importantes

- Render free puede dormir la API tras inactividad; el primer login puede tardar.
- La base SQLite queda persistente en `/var/data/ani.sqlite` por el disco de Render.
- Si cambias el dominio de Neocities, actualiza `FRONTEND_ORIGIN` en Render.
- En esquema Neocities + Render la cookie debe ser cross-site (`SameSite=None; Secure`) para que `/admin` mantenga sesión.
