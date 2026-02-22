# ⚡ INICIO RÁPIDO - 5 MINUTOS

## 🌐 URL oficial publicada

`https://artesaniasani.neocities.org/`

## 🎯 Para empezar AHORA

### 0️⃣ Levanta el proyecto (si aún no está activo)

```bash
npm install
npm run dev
```

### 1️⃣ Accede a tu web
```
http://localhost:5173/
```

### 2️⃣ Explora las páginas
- 🏠 **Inicio**: Presentación
- 🖼️ **Galería**: Tus productos
- 📄 **Sobre**: Tu historia
- 📧 **Contacto**: Formulario
- 📝 **Blog**: Artículos
- ⚙️ **Admin**: Para agregar productos

### 3️⃣ Abre Admin
```
http://localhost:5173/admin
```
Desde aquí puedes:
- ➕ Agregar productos nuevos
- ✏️ Editar productos
- 🗑️ Eliminar productos
- 💬 Ver mensajes de clientes
- 📧 Ver suscriptores

---

## 📚 Lee Esto Next

### 🔴 IMPORTANTE: Leer primero
1. [**GUIA_DE_USO.md**](GUIA_DE_USO.md) ← Empieza aquí
2. [**INSTRUCCIONES_IMAGENES.md**](INSTRUCCIONES_IMAGENES.md) ← Cómo agregar fotos
3. [**PLAN_IMPLEMENTACION.md**](PLAN_IMPLEMENTACION.md) ← Paso a paso

---

## 💡 Técnica Rápida

### ¿Dónde están mis archivos?
```
/home/enriquito/ani_project/ani_project-2/
```

### ¿Cómo agrego mis fotos?
1. Copia imágenes a: `/public/images/`
2. Ve a Admin
3. Edita cada producto con ruta: `/images/nombre.jpg`

### ¿Cómo agrego un nuevo producto?
Admin → Productos → Llenar formulario → Guardar

---

## ✅ Verificación Rápida

Estos deben funcionar:
- ✅ Home carga
- ✅ Galería muestra 15 productos
- ✅ Producto abre detalle
- ✅ Contacto muestra formulario
- ✅ Admin permite crear/editar
- ✅ Funciona en móvil

Si algo no funciona → Revisa GUIA_DE_USO.md sección "Solución de Problemas"

---

## 🚀 Publicar en Neocities (rápido)

1. Genera la compilación para Neocities:

```bash
npm run build:neocities
```

2. En Neocities sube **el contenido interno de `dist/`** (no la carpeta `dist` como tal).
3. Verifica que estén en la raíz del sitio: `index.html`, `404.html`, `assets/`, `images/`.

---

## 🔐 Verificación de Google Search Console

Método activo: **meta tag** en `index.html`.

Tag configurado:

```html
<meta name="google-site-verification" content="gCQs3c7xL2sOIdcaPb2GxrNxCS_qfrXNb0o7GxCsams" />
```

---

## 📞 Soporte y Contacto

¿Emergencia técnica?
- Email: cochiherrera@gmail.com
- WhatsApp: +56 9 6040 2979

---

**¡Tu plataforma está lista!** 🚀

Lee GUIA_DE_USO.md para aprovecharla al máximo.
