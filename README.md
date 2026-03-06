# Artesanias Ani Web

Sitio web de **ArtesaniasAni** hecho con Vue 3 + Vite SSG, preparado para hosting **estatico** en Neocities.

## Estado actual del proyecto

- Produccion orientada a hosting estatico (Neocities).
- El frontend publico usa datos locales desde `src/data/artesanias.js`.
- No se requiere infraestructura externa para publicar el sitio en Neocities.
- El panel `/admin` queda como herramienta opcional para entorno local con backend.

## Requisitos

- Node.js 18+
- npm

## Desarrollo local (solo frontend)

```bash
npm install
npm run dev
```

## Build para Neocities

```bash
npm run build:neocities
```

El sitio listo para subir queda en `dist/`.

## Variables opcionales para SEO/canonical

Crea `.env.production` a partir de `.env.production.example`:

```dotenv
VITE_SITE_URL=https://artesaniasani.neocities.org
SITE_URL=https://artesaniasani.neocities.org
```

Si no defines estas variables, el proyecto usa por defecto `https://artesaniasani.neocities.org`.

## Subida manual a Neocities

1. Ejecuta `npm run build:neocities`.
2. Entra a Neocities y abre el File Manager del sitio.
3. Sube el contenido de `dist/` (archivos y carpetas) a la raiz del sitio.
4. Reemplaza archivos existentes cuando Neocities lo solicite.

Guia corta adicional: `GITHUB_NEOCITIES_DEPLOY.md`.

## Scripts utiles

```bash
npm run dev              # Frontend local
npm run build            # Build estatico
npm run build:neocities  # Alias de build para Neocities
npm run preview          # Vista local del build
npm run validate:images  # Valida nombres SEO-friendly en public/images
npm run generate:sitemap # Regenera public/sitemap.xml
```

## Nota sobre backend

La carpeta `backend/` se conserva para uso local/experimental. No es necesaria para desplegar en Neocities.
