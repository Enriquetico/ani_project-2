# 📸 INSTRUCCIONES PARA AGREGAR TUS IMÁGENES

Guía paso a paso para integrar las imágenes de tus productos.

## 📁 Carpeta de Imágenes

La carpeta donde deben ir tus imágenes es:
```
/public/images/
```

En tu sistema, la ruta completa es:
```
/home/enriquito/ani_project/ani_project-2/public/images/
```

## 📝 Nombres de Imágenes Sugeridos

Basado en el catálogo de productos precargado, aquí están los nombres recomendados:

```
Animales:
- perro-maceta.jpg          (Maceta Perro Adorable)
- gato-sentado.jpg          (Gato Sentado Decorativo)
- gato-maceta.jpg           (Maceta Gato Acurrucado)

Insectos:
- mariposa.jpg              (Mariposa Multicolor)

Naturaleza:
- hongos.jpg                (Hongos del Bosque)

Religioso:
- angel.jpg                 (Ángel Protector)
- virgen.jpg                (Virgen María Consagrada)

Vehículos:
- carrito.jpg               (Auto Vintage Personalizado)

Navidad:
- santa.jpg                 (Decoración Navideña - Santa)
- arbol-navidad.jpg         (Árbol de Navidad Decorativo)

Anime:
- pikachu.jpg               (Pikachu Pokémon)

Cartoon:
- mario-bros.jpg            (Mario Bros Retro)

Aves:
- loro.jpg                  (Loro Tropical Colorido)
- colibri.jpg               (Colibrí Delicado)

Velas:
- vela.jpg                  (Vela Artesanal Aromatizada)

Blog:
- blog-ceramica.jpg         (Imagen artículo blog)
- blog-decoracion.jpg
- blog-sostenible.jpg
- blog-anime.jpg
```

## 🖼️ Pasos para Agregar Imágenes

### 1. Preparar tus fotos

**Requisitos:**
- Formato: JPG o PNG
- Tamaño: Entre 800x800px y 1200x1200px
- Calidad: Alta resolución
- Fondo: Preferentemente blanco o neutral

**Herramientas útiles:**
- Adobe Lightroom
- Photoshop
- Canva
- GIMP (gratis)

### 2. Nombrar correctamente

Usa los nombres sugeridos arriba, con estas reglas:
- Usar guiones (-) en lugar de espacios
- Nombres en minúsculas
- Sin caracteres especiales
- Ejemplo: `gato-decorativo.jpg` ✓
- NO: `Gato Decorativo.jpg` ✗

### 3. Copiar archivos

Opción A: Usando explorador de archivos
1. Abre: `/home/enriquito/ani_project/ani_project-2/public/images/`
2. Copia tus imágenes aquí

Opción B: Usando terminal
```bash
cp /ruta/a/tus/imagenes/*.jpg /home/enriquito/ani_project/ani_project-2/public/images/
```

### 4. Actualizar rutas en productos

Ve al Panel de administración → Productos:

1. Clic en ✏️ para editar un producto
2. En campo "Ruta de Imagen", ingresa: `/images/nombre-del-archivo.jpg`
3. Ejemplo: `/images/gato-sentado.jpg`
4. Clic en "Actualizar Producto"

**O**, si prefieres editar directamente:
- Abre: `/src/data/artesanias.js`
- Busca el producto
- Actualiza la propiedad `imagen`

Ejemplo:
```javascript
{
  id: 2,
  nombre: 'Gato Sentado Decorativo',
  imagen: '/images/gato-sentado.jpg',  // ← Aquí
  // ...
}
```

### 5. Verificar cambios

1. Guarda los cambios
2. Recarga tu navegador (Ctrl+F5)
3. Ve a Galería y verifica que aparecen las imágenes

---

## 🎯 Alternativa: Usar URLs Externas

Si prefieres no copiar archivos localmente, puedes usar URLs:

1. Sube tus imágenes a un servicio como:
   - Imgur
   - Cloudinary
   - Google Drive
   - AWS S3

2. Obtén el URL de la imagen (Ej: `https://imgur.com/abc123.jpg`)

3. En el Panel de administración o en `artesanias.js`, usa la URL completa:

```javascript
{
  id: 1,
  nombre: 'Perro Decorativo',
  imagen: 'https://imgur.com/perro123.jpg',
  // ...
}
```

---

## 📊 Estado Actual de Imágenes

### Imágenes de Placeholder

Actualmente, todos los productos tienen placeholders (imágenes grisáceas de relleno).

**Productos incluidos**: 15 (Todos con descripción)

```
1. Maceta Perro Adorable
2. Gato Sentado Decorativo
3. Mariposa Multicolor
4. Hongos del Bosque
5. Ángel Protector
6. Virgen María Consagrada
7. Auto Vintage Personalizado
8. Decoración Navideña - Santa
9. Árbol de Navidad Decorativo
10. Pikachu Pokémon
11. Mario Bros Retro
12. Vela Artesanal Aromatizada
13. Loro Tropical Colorido
14. Colibrí Delicado
15. Maceta Gato Acurrucado
```

---

## 🎨 Recomendaciones para Fotos de Productos

### Iluminación
- Usa luz natural o softbox
- Evita sombras duras
- Ilumina uniformemente

### Ángulo
- Frontal para figuras de frente
- 45° para mostrar profundidad
- Desde arriba para macetas

### Fondo
- Blanco o muy neutral
- Consistente en todas las fotos
- Evita distracciones

### Edición
- Ajusta exposición y contraste
- Corta y centra bien
- Mantén consistencia de color

---

## 📱 Tamaño de Archivo

```
Recomendado:
- Ancho: 800-1000px
- Alto: 800-1000px
- Peso: 200-500 KB
- Formato: JPG (comprimido)
```

## 🔄 Cambiar Imagen de un Producto

**Proceso:**
1. Reemplaza el archivo en `/public/images/`
2. Ve al Panel de administración
3. Clic en ✏️ en el producto
4. La imagen se actualiza automáticamente

---

## ⚙️ Solución de Problemas con Imágenes

### "No veo la imagen en la galería"

**Soluciones:**
1. Verifica que el archivo está en `/public/images/`
2. Recarga la página (Ctrl+F5)
3. Comprueba que la ruta en el producto es correcta
4. Comprueba que el nombre del archivo coincide exactamente

### "La imagen se ve pixelada"

**Soluciones:**
1. Usa una imagen más grande (mínimo 800x800px)
2. Asegúrate de usar formato JPG de alta calidad
3. No estires la imagen en CSS

### "Error al cargar la imagen"

**Posibles causas:**
- Ruta incorrecta (verifica mayúsculas/minúsculas)
- Archivo no existe
- Nombre con espacios o caracteres especiales
- Formato no soportado (usa JPG o PNG)

---

## 📸 Ejemplo Práctico

### Tienes una foto: `mi_gato.jpg`

**Paso 1:** Preparar
```bash
# Redimensionar a 800x800px
# (usando Photoshop, GIMP, o online converter)
```

**Paso 2:** Nombrar
```
mi_gato.jpg  →  gato-sentado.jpg
```

**Paso 3:** Copiar
```bash
cp /rutas/fotos/gato-sentado.jpg /home/enriquito/ani_project/ani_project-2/public/images/
```

**Paso 4:** Actualizar en Admin
- Ir a: Admin → Productos
- Buscar: "Gato Sentado Decorativo"
- Clic en: ✏️
- Campo "Ruta de Imagen": `/images/gato-sentado.jpg`
- Clic en: "Actualizar Producto"

**Paso 5:** Verificar
- Recarga la página
- Ve a Galería
- Verifica que se vea tu foto ✓

---

## 🚀 Próxima Vez que Agregues Productos

Cuando añadas un **nuevo** producto desde Admin:

1. Prepara la imagen (revisa arriba)
2. Cópiala a `/public/images/` con buen nombre
3. En Admin, llena el formulario:
   - Nombre: `Mi nuevo producto`
   - Ruta de Imagen: `/images/mi-producto.jpg`
4. Clic en: "Agregar Producto"

¡Listo! El producto aparecerá en la Galería con su imagen.

---

## 📚 Ejemplos de Estructuras

### Carpeta List
```
public/images/
├── perro-maceta.jpg
├── gato-sentado.jpg
├── mariposa.jpg
├── hongos.jpg
├── angel.jpg
├── virgen.jpg
├── carrito.jpg
├── santa.jpg
├── arbol-navidad.jpg
├── pikachu.jpg
├── mario-bros.jpg
├── vela.jpg
├── loro.jpg
├── colibri.jpg
└── gato-maceta.jpg
```

---

## 💡 Tips Adicionales

1. **Backup**: Guarda copia de tus imágenes originales
2. **Consistencia**: Mantén mismo estilo en todas las fotos
3. **Watermark**: Considera agregar tu logo/marca de agua
4. **Números**: Si tienes muchos, organiza por carpetas
5. **Compresión**: Usa TinyPNG para reducir tamaño sin perder calidad

---

¿Preguntas? Contacta a Ana Herrera:
- WhatsApp: +56 9 6040 2979
- Email: cochiherrera@gmail.com

📸 ¡Feliz con tus nuevas imágenes!
