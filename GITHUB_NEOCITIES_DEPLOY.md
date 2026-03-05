# Deploy en Neocities (GitHub + subida manual)

## 1) Subir cambios a GitHub

```bash
git add -A
git commit -m "chore: preparar sitio para neocities"
git push origin main
```

## 2) Generar build estatico

```bash
npm install
npm run build:neocities
```

## 3) Subir a Neocities

1. Inicia sesion en `https://neocities.org`.
2. Abre tu sitio (`artesaniasani`) en el File Manager.
3. Sube todo el contenido de `dist/` a la raiz del sitio.
4. Confirma reemplazo de archivos.

## 4) Verificar

- Home: `https://artesaniasani.neocities.org/`
- Galeria: `https://artesaniasani.neocities.org/galeria/`
- Contacto: `https://artesaniasani.neocities.org/contacto/`
