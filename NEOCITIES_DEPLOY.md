# Subir este proyecto a Neocities

## 1) Generar compilación para Neocities

En la raíz del proyecto ejecuta:

```bash
npm install
npm run build:neocities
```

Esto genera:

- `dist/` con los archivos estáticos
- `dist/404.html` (copia de `index.html` para rutas SPA)
- `dist/.nojekyll`

## 2) Subir al dashboard de Neocities

1. Entra a: `https://neocities.org/dashboard`
2. Abre el administrador de archivos de tu sitio.
3. Sube **todo el contenido de `dist/`** (no la carpeta `dist` completa, sino sus archivos internos).

## 3) Si ya tenías archivos anteriores

- Reemplaza `index.html`, `404.html` y la carpeta `assets/` por los nuevos.
- Si cambiaste imágenes en `public/images`, vuelve a subir también `images/`.

## 4) Verificación rápida

- Abre la home del sitio.
- Navega a una ruta interna (ejemplo: `/galeria`).
- Recarga la página en esa ruta para confirmar que el fallback SPA funciona.
