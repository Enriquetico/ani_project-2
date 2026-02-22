# 📚 GUÍA DE USO - ArtesaníasAni

Una guía completa para usar la plataforma web de ArtesaníasAni.

## 🎯 Acceso a la Plataforma

**URL Local**: http://localhost:5173/
**URL Producción**: https://artesaniasani.neocities.org/

Para iniciar el servidor:
```bash
cd /home/enriquito/ani_project/ani_project-2
npm run dev
```

---

## 📖 Navegación por Secciones

### 🏠 **INICIO (Home)**

La página principal que ves al abrir la web.

**Incluye:**
- Logo y eslogan de ArtesaníasAni
- Presentación breve del negocio
- Los 5 valores principales
- 6 productos destacados
- Testimonios de clientes
- Vista previa de artículos del blog

**Acciones:**
- Clic en "Ver Galería" para ir a todos los productos
- Clic en "Conoce Mi Historia" para ir a la página Sobre

---

### 🖼️ **GALERÍA**

Visualiza todos los productos disponibles con opciones avanzadas.

**Funcionalidades:**
- **Filtrado por Categoría**: Selecciona categorías como Animales, Religioso, Navidad, etc.
- **Buscador**: Escribe el nombre o descripción del producto
- **Cards de Producto**: Cada tarjeta muestra:
  - Imagen del producto
  - Nombre y categoría
  - Tipo de producto
  - Descripción breve
  - Colores disponibles
  - Precio aproximado

**Botones en cada Producto:**
- **Ver Detalles**: Abre la página individual del producto
- **Consultar**: Abre WhatsApp directamente para contactar

**Información Adicional:**
- Personalizables
- Trabajo bajo pedido
- Información de envíos y formas de pago

---

### 📄 **DETALLE DEL PRODUCTO**

Al hacer clic en un producto, ves su página completa.

**Información mostrada:**
- Imagen grande del producto
- Nombre y categoría
- Descripción detallada
- Características (tamaño, colores, tipo)
- Precio aproximado
- Notas especiales
- Proceso de pedido (5 pasos)

**Acciones:**
- **Consultar por WhatsApp**: Envía mensaje directo
- **Enviar Email**: Abre cliente de email
- Ver productos relacionados de la misma categoría

---

### ℹ️ **SOBRE MÍ**

Información completa sobre Ana Herrera y ArtesaníasAni.

**Secciones:**
1. **Historia**: Quién es Ana y su misión
2. **Valores Principales**: Los 5 pilares del negocio
3. **Productos**: Descripción de cerámica y velas
4. **Proceso de Creación**: 5 pasos del proceso
5. **Materiales Utilizados**: Calidad garantizada
6. **Información de Pedidos**: Términos y condiciones

---

### 📧 **CONTACTO**

Múltiples formas de comunicarse con Ana.

**Opciones de Contacto:**
1. **Formulario de Contacto**: Envía un mensaje directamente
   - Nombre, email, teléfono (opcional)
   - Asunto y mensaje
   - Se guarda automáticamente

2. **WhatsApp Directo**: Botón para chatear inmediatamente
3. **Email**: Enlace para enviar correo electrónico
4. **Redes Sociales**: Facebook e Instagram

**FAQ (Preguntas Frecuentes):**
- Tiempo de elaboración
- Aceptación de pedidos personalizados
- Tamaños de productos
- Disponibilidad de envíos
- Formas de pago
- Garantía de productos

---

### 📝 **BLOG**

Artículos sobre artesanía, diseño y tips de decoración.

**Funcionalidades:**
- **Buscador**: Encuentra artículos por palabra clave
- **Artículos Disponibles**:
  - El Arte de Pintar Cerámica a Mano
  - Personalizando Tu Espacio
  - Materiales Sostenibles
  - Nueva Colección Anime

**Newsletter**: Suscripción para recibir novedades
- Tu email se guarda en localStorage
- Para propósitos de marketing

**Cada artículo incluye:**
- Fecha de publicación
- Autor (Ana Herrera)
- Contenido completo
- Botones para compartir en redes

---

### ⚙️ **ADMIN (Panel de Administración)**

Solo para administración de la tienda.

#### **TAB 1: Productos**

**Agregar Nuevo Producto:**
1. Completa el formulario con:
   - Nombre del producto *
   - Categoría *
   - Tipo de producto (Ej: Figura Cerámica)
   - Tamaño *
   - Descripción *
   - Colores (separados por comas)
   - Precio aproximado *
   - Notas (opcional)
   - Ruta de imagen (Ej: /images/foto.jpg)

2. Clic en "Agregar Producto"
3. El producto aparece automáticamente en la Galería

**Editar Producto:**
1. Clic en ✏️ en la fila del producto
2. Los datos se cargan en el formulario
3. Realiza cambios
4. Clic en "Actualizar Producto"

**Eliminar Producto:**
1. Clic en 🗑️ en la fila del producto
2. Confirma la eliminación

#### **TAB 2: Mensajes**

Visualiza todos los mensajes del formulario de contacto.

**Información mostrada:**
- Nombre del cliente
- Email de contacto
- Teléfono (si lo proporcionó)
- Asunto del mensaje
- Contenido completo
- Fecha de envío

> **Nota**: Los mensajes se guardan en localStorage del navegador

#### **TAB 3: Suscriptores**

Administra la lista de suscriptores del newsletter.

**Acciones:**
- Ver todos los emails suscritos
- Eliminar suscriptores
- Exportar lista (manual: copiar y pegar en un doc)

> **Nota**: Para envíos masivos, se recomienda usar servicios como Mailchimp

---

## 💾 **Almacenamiento de Datos**

Todos los datos se guardan en el navegador (localStorage).

### Datos Guardados:
1. **Productos personalizados**: Agregados desde Admin
2. **Mensajes de contacto**: Del formulario
3. **Suscriptores**: Del newsletter

### Para Hacer Backup:

Abre la consola del navegador (F12) y ejecuta:

```javascript
// Guardar datos
const datos = {
  productos: localStorage.getItem('productosPersonalizados'),
  mensajes: localStorage.getItem('mensajes'),
  suscriptores: localStorage.getItem('suscriptores')
};
console.log(JSON.stringify(datos));
```

---

## 🖼️ **Cómo Agregar Imágenes de Productos**

### Paso 1: Preparar tus imágenes

Asegúrate de tener tus fotos de productos:
- Formato: JPG, PNG
- Tamaño recomendado: 800x800px o 1000x1000px
- Calidad: Alta definición

### Paso 2: Copiar archivos

Coloca tus imágenes en:
```
/public/images/
```

Ejemplos de nombres:
```
/public/images/perro-maceta.jpg
/public/images/gato-sentado.png
/public/images/mariposa-azul.jpg
```

### Paso 3: Actualizar rutas

Cuando agregues un producto en Admin:
- Campo "Ruta de Imagen": `/images/nombre-del-archivo.jpg`
- Ejemplo: `/images/perro-maceta.jpg`

### Paso 4: Actualizar vista previa

Si necesitas cambiar la imagen de un producto existente:
1. Ve a Admin → Productos
2. Clic en ✏️ para editar
3. Cambia la ruta en el campo "Ruta de Imagen"
4. Clic en "Actualizar"

---

## 📱 **Características de Contacto**

### WhatsApp Integrado

- **Número**: +56 9 6040 2979
- **Ubicación**: Aparece en casi todas las páginas
- **Beneficio**: Los clientes pueden escribir desde donde estén

### Email

- **Correo**: cochiherrera@gmail.com
- **Método**: Formulario en la página de Contacto
- **Almacenamiento**: Los mensajes se guardan localmente

### Redes Sociales

1. **Facebook**: https://www.facebook.com/ana.herrerasalas.1
2. **Instagram**: https://www.instagram.com/anaherrerasalas

---

## 🎨 **Personalización**

### Cambiar Colores

Edita `/src/style.css`:

```css
:root {
  --primary-color: #c17a5c;      /* Naranja-marrón principal */
  --secondary-color: #8b6f47;    /* Marrón secundario */
  --bg-light: #fff9f5;           /* Fondo claro */
}
```

### Cambiar Información de la Empresa

Edita `/src/data/artesanias.js`:

```javascript
export const empresaInfo = {
  nombre: 'ArtesaníasAni',
  propietaria: 'Ana Herrera',
  eslogan: 'tu nuevo eslogan aquí',
  // ... más información
};
```

---

## 🐛 **Solución de Problemas**

### La aplicación no carga

**Solución:**
```bash
npm install
npm run dev
```

### No veo los cambios

**Solución:**
1. Recarga la página (Ctrl+F5)
2. Limpia el caché del navegador
3. Abre las DevTools (F12) y vacía el Storage

### Los productos no aparecen

**Solución:**
1. Verifica que las imágenes están en `/public/images/`
2. Revisa que la ruta es correcta en el producto
3. Recarga la página (Ctrl+F5)

### Perder datos al cambiar de navegador

**Problema**: Los datos se guardan solo en ese navegador

**Solución**: 
- Usar el mismo navegador
- O exportar/importar datos manualmente
- O usar un backend (próxima mejora)

---

## 📈 **Estadísticas y Análisis**

Para rastrear información sobre tus visitantes y clientes:

### Análisis Locales

En Admin → Mensajes y Suscriptores puedes ver:
- Cuántos mensajes has recibido
- Emails de suscriptores
- Asuntos comunes de consultas

### Integración Futura

Se recomienda integrar:
- **Google Analytics**: Para estadísticas de tráfico
- **Mailchimp**: Para gestión de newsletters
- **Backend Real**: Para base de datos segura

---

## ✅ **Checklist de Inicio**

- [ ] Instalar dependencias (`npm install`)
- [ ] Iniciar servidor (`npm run dev`)
- [ ] Acceder a http://localhost:5173/
- [ ] Verificar todas las páginas funcionan
- [ ] Agregar primeros productos desde Admin
- [ ] Copiar imágenes a `/public/images/`
- [ ] Actualizar rutas de imágenes en productos
- [ ] Probar formularios de contacto
- [ ] Hacer backup de la información

---

## 🚀 **Próximos Pasos**

1. **Agregar tus productos reales**
2. **Cargar imágenes de alta calidad**
3. **Personalizar los artículos del blog**
4. **Integrar metodología de pago real**
5. **Publicar en Neocities**
6. **Promocionar en redes sociales**

---

## ☁️ **Despliegue en Neocities**

Para publicar correctamente la web y mantener el fallback SPA:

```bash
npm run build:neocities
```

Esto genera en `dist/`:
- `index.html`
- `404.html`
- carpeta `assets/`
- `.nojekyll`

En Neocities debes subir **el contenido interno de `dist/`** a la raíz del sitio.

---

## 🔐 Verificación de Google Search Console

Método activo: **meta tag** en `index.html`.

Tag configurado:

```html
<meta name="google-site-verification" content="gCQs3c7xL2sOIdcaPb2GxrNxCS_qfrXNb0o7GxCsams" />
```

---

## 📞 Soporte y Contacto

Para preguntas técnicas sobre la plataforma:
- Ana Herrera
- WhatsApp: +56 9 6040 2979
- Email: cochiherrera@gmail.com

---

¡Tu plataforma está lista para comenzar! 🎨✨
