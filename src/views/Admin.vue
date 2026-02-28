<template>
  <div class="admin">
    <!-- Header -->
    <div class="admin-header">
      <div class="admin-header-content">
        <div>
          <h1>Panel de Administración</h1>
          <p>Gestiona tus productos y reseñas</p>
        </div>
        <button v-if="isAuthenticated" type="button" class="btn btn-secondary" @click="cerrarSesion">
          Cerrar sesión
        </button>
      </div>
    </div>

    <div v-if="!isAuthenticated" class="container auth-container">
      <div class="auth-card">
        <h2>Acceso de Administrador</h2>
        <p>Ingresa la contraseña para administrar productos, mensajes y suscriptores.</p>

        <form @submit.prevent="iniciarSesion" class="auth-form">
          <label for="admin-password">Contraseña</label>
          <div class="password-field">
            <input
              id="admin-password"
              v-model="passwordInput"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Ingresa tu contraseña"
              autocomplete="current-password"
              required
            />
            <button
              type="button"
              class="password-toggle"
              :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
              @click="showPassword = !showPassword"
            >
              {{ showPassword ? '🙈' : '👁️' }}
            </button>
          </div>

          <p v-if="authError" class="auth-error">{{ authError }}</p>
          <p v-if="authInfo" class="auth-info">{{ authInfo }}</p>

          <div class="auth-actions">
            <button type="submit" class="btn btn-primary">Ingresar</button>
          </div>
        </form>
      </div>
    </div>

    <div v-else class="container">
      <div class="admin-tabs">
        <button
          @click="tabActiva = 'productos'"
          :class="['tab-btn', { active: tabActiva === 'productos' }]"
        >
          📦 Productos
        </button>
        <button
          @click="tabActiva = 'mensajes'"
          :class="['tab-btn', { active: tabActiva === 'mensajes' }]"
        >
          💬 Mensajes ({{ mensajes.length }})
        </button>
        <button
          @click="tabActiva = 'suscriptores'"
          :class="['tab-btn', { active: tabActiva === 'suscriptores' }]"
        >
          📧 Suscriptores ({{ suscriptores.length }})
        </button>
        <button
          @click="tabActiva = 'auditoria'"
          :class="['tab-btn', { active: tabActiva === 'auditoria' }]"
        >
          🛡️ Auditoría ({{ intentosLogin.length }})
        </button>
      </div>

      <!-- Tab: Productos -->
      <div v-if="tabActiva === 'productos'" class="admin-content">
        <h2>Gestión de Productos</h2>

        <!-- Formulario Agregar Producto -->
        <div class="form-section">
          <h3>{{ nuevoProducto.id ? 'Editar Producto' : 'Agregar Nuevo Producto' }}</h3>
          <form @submit.prevent="guardarProducto">
            <div class="form-grid">
              <div class="form-group">
                <label>Nombre del Producto *</label>
                <input v-model="nuevoProducto.nombre" type="text" placeholder="Ej: Gato Decorativo" required />
              </div>

              <div class="form-group">
                <label>Categoría *</label>
                <select v-model="nuevoProducto.categoria" required @change="manejarCambioCategoria">
                  <option value="">Seleccionar...</option>
                  <option v-for="cat in categoriasFormulario" :key="cat" :value="cat">{{ cat }}</option>
                  <option :value="NUEVA_CATEGORIA_VALUE">+ Crear nueva categoría...</option>
                </select>
              </div>

              <div class="form-group">
                <label>Tipo de Producto *</label>
                <input v-model="nuevoProducto.tipo" type="text" placeholder="Ej: Figura Cerámica" required />
              </div>

              <div class="form-group">
                <label>Tamaño *</label>
                <select v-model="nuevoProducto.tamaño" required>
                  <option value="">Seleccionar...</option>
                  <option value="Pequeño">Pequeño</option>
                  <option value="Mediano">Mediano</option>
                  <option value="Grande">Grande</option>
                </select>
              </div>
            </div>

            <div class="form-group full">
              <label>Descripción *</label>
              <textarea v-model="nuevoProducto.descripcion" placeholder="Describe el producto..." rows="3" required></textarea>
            </div>

            <div class="form-group full">
              <label>Colores (separados por comas)</label>
              <input v-model="coloresInput" type="text" placeholder="Blanco, Rojo, Azul" />
            </div>

            <div class="form-group full">
              <label>Precio Aproximado *</label>
              <input v-model="nuevoProducto.precioAproximado" type="text" placeholder="Ej: Desde $15,000" required />
            </div>

            <div class="form-group full">
              <label>Notas (opcional)</label>
              <input v-model="nuevoProducto.notas" type="text" placeholder="Ej: Hecho a mano - Único" />
            </div>

            <div class="form-group full">
              <label>Ruta de Imagen (opcional)</label>
              <input v-model="nuevoProducto.imagen" type="text" placeholder="Ej: /images/mi-producto.webp" />
            </div>

            <div class="form-group full">
              <label>Subir y optimizar imagen</label>
              <div
                class="image-dropzone"
                :class="{ 'is-drag-over': isDragOver, 'is-large-file': showImageSizeWarning }"
                @dragover.prevent="isDragOver = true"
                @dragleave.prevent="isDragOver = false"
                @drop.prevent="onImageDrop"
              >
                <p v-if="!selectedImageName">Arrastra una imagen aquí o selecciónala desde tu dispositivo.</p>
                <p v-else>Archivo seleccionado: <strong>{{ selectedImageName }}</strong></p>
                <input
                  ref="imageInputRef"
                  type="file"
                  accept="image/*"
                  class="image-file-input"
                  @change="onImageFileChange"
                />
              </div>

              <div v-if="selectedImagePreviewUrl" class="image-preview-wrap">
                <img :src="selectedImagePreviewUrl" alt="Vista previa de imagen" class="image-preview" />
                <small v-if="selectedImageMeta" class="image-preview-meta">
                  {{ selectedImageMeta }}
                </small>
                <p v-if="showImageSizeWarning" class="image-size-warning">
                  ⚠️ Esta imagen supera {{ formatSizeThreshold(imageWarningBytes) }}. Se recomienda usar archivos más livianos para mejorar la carga.
                </p>
              </div>

              <div class="form-actions inline-actions">
                <button
                  v-if="selectedImageFile"
                  type="button"
                  class="btn btn-secondary"
                  :disabled="isOptimizingImage"
                  @click="cancelarSeleccionImagen"
                >
                  Cancelar
                </button>
              </div>

              <small v-if="selectedImageFile" class="image-current-path">
                La imagen se optimiza automáticamente al guardar el producto.
              </small>

              <p v-if="imageUploadError" class="auth-error">{{ imageUploadError }}</p>
              <p v-if="imageUploadInfo" class="auth-info">{{ imageUploadInfo }}</p>
              <p v-if="isImageTooLargeToOptimize" class="image-size-warning">
                Esta imagen supera {{ formatSizeThreshold(imageSoftBlockBytes) }}. Se optimizará igualmente, pero puede tardar más.
              </p>
              <small v-if="nuevoProducto.imagen" class="image-current-path">
                Ruta aplicada: {{ nuevoProducto.imagen }}
              </small>
            </div>

            <div class="form-actions">
              <button type="submit" class="btn btn-primary" :disabled="isSavingProducto">
                {{
                  isSavingProducto
                    ? (selectedImageFile ? 'Guardando y optimizando imagen...' : 'Guardando producto...')
                    : 'Guardar producto'
                }}
              </button>
              <button v-if="nuevoProducto.id" type="button" @click="cancelarEdicion" class="btn btn-secondary">
                Cancelar
              </button>
              <button
                v-if="nuevoProducto.id"
                type="button"
                class="btn btn-secondary"
                @click="eliminarProducto({ ...nuevoProducto, _origen: nuevoProducto._origen || 'custom' })"
              >
                Eliminar producto
              </button>
            </div>

            <p v-if="productoFormError" class="auth-error">{{ productoFormError }}</p>
            <p v-if="productoFormInfo" class="auth-info">{{ productoFormInfo }}</p>
          </form>
        </div>

        <!-- Lista de Productos -->
        <div class="products-section">
          <h3>Lista de Productos ({{ productosListado.length }})</h3>
          <div v-if="productosListado.length > 0" class="productos-tabla">
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Origen</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="producto in productosListado" :key="producto.key">
                  <td>{{ producto.nombre }}</td>
                  <td>{{ producto.categoria }}</td>
                  <td>{{ producto.precioAproximado }}</td>
                  <td>{{ producto._origen === 'base' ? 'Base' : 'Personalizado' }}</td>
                  <td class="acciones">
                    <button
                      v-if="producto._origen === 'custom'"
                      @click="editarProducto(producto)"
                      class="btn-accion editar"
                      title="Editar producto"
                    >
                      ✏️
                    </button>
                    <button @click="eliminarProducto(producto)" class="btn-accion eliminar" title="Eliminar producto">🗑️</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p v-else class="sin-datos">No hay productos disponibles.</p>
        </div>
      </div>

      <!-- Tab: Mensajes -->
      <div v-if="tabActiva === 'mensajes'" class="admin-content">
        <h2>Mensajes Recibidos</h2>
        <div v-if="mensajes.length > 0" class="mensajes-list">
          <div v-for="mensaje in mensajes" :key="mensaje.id" class="mensaje-item">
            <div class="mensaje-header">
              <h3>{{ mensaje.nombre }}</h3>
              <p class="fecha">{{ mensaje.fecha }}</p>
            </div>
            <p><strong>Email:</strong> {{ mensaje.email }}</p>
            <p v-if="mensaje.telefono"><strong>Teléfono:</strong> {{ mensaje.telefono }}</p>
            <p><strong>Asunto:</strong> {{ mensaje.asunto }}</p>
            <p><strong>Mensaje:</strong></p>
            <p class="mensaje-texto">{{ mensaje.mensaje }}</p>
          </div>
        </div>
        <p v-else class="sin-datos">No hay mensajes aún.</p>
      </div>

      <!-- Tab: Suscriptores -->
      <div v-if="tabActiva === 'suscriptores'" class="admin-content">
        <h2>Suscriptores del Newsletter</h2>
        <div v-if="suscriptores.length > 0" class="suscriptores-list">
          <div v-for="suscriptor in suscriptores" :key="suscriptor.id" class="suscriptor-item">
            <p>{{ suscriptor.email }}</p>
            <button @click="eliminarSuscriptor(suscriptor.id)" class="btn-accion eliminar">Eliminar</button>
          </div>
        </div>
        <p v-else class="sin-datos">No hay suscriptores aún.</p>
      </div>

      <!-- Tab: Auditoría -->
      <div v-if="tabActiva === 'auditoria'" class="admin-content">
        <h2>Auditoría de Accesos</h2>
        <div class="form-actions">
          <button type="button" class="btn btn-secondary" @click="cargarIntentosLogin">
            Actualizar registros
          </button>
        </div>

        <div v-if="intentosLogin.length > 0" class="productos-tabla">
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Usuario</th>
                <th>IP</th>
                <th>Resultado</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in intentosLogin" :key="item.id">
                <td>{{ item.createdAt }}</td>
                <td>{{ item.username }}</td>
                <td>{{ item.ip }}</td>
                <td>{{ item.success ? '✅ Exitoso' : '❌ Fallido' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-else class="sin-datos">No hay registros de acceso disponibles.</p>
      </div>

      <!-- Información de Ayuda -->
      <div class="security-section">
        <h3>🔐 Seguridad de Acceso</h3>
        <p>
          La contraseña del panel se valida en backend y la sesión se maneja con cookie segura.
        </p>
        <p>
          Por seguridad, no se permite cambiar ni recuperar contraseña desde el navegador.
        </p>
      </div>

      <div class="ayuda-section">
        <h3>ℹ️ Información de Ayuda</h3>
        <p>
          <strong>Panel de Administración:</strong> Aquí puedes agregar nuevos productos, ver mensajes de clientes y administrar suscriptores.
        </p>
        <ul>
          <li>Los datos se gestionan desde la API backend con persistencia en base de datos</li>
          <li>Es importante hacer respaldo de tus datos periódicamente</li>
          <li>Los cambios se reflejan automáticamente en la galería</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { categorias } from '../data/artesanias'
import { api } from '../services/api'
import { showToast } from '../services/toast'

const tabActiva = ref('productos')
const coloresInput = ref('')
const isAuthenticated = ref(false)
const passwordInput = ref('')
const showPassword = ref(false)
const authError = ref('')
const authInfo = ref('')
const imageInputRef = ref(null)
const selectedImageFile = ref(null)
const selectedImageName = ref('')
const imageUploadError = ref('')
const imageUploadInfo = ref('')
const isOptimizingImage = ref(false)
const isDragOver = ref(false)
const selectedImagePreviewUrl = ref('')
const selectedImageMeta = ref('')
const selectedImageSizeBytes = ref(0)
const imageWarningBytes = ref(3 * 1024 * 1024)
const imageSoftBlockBytes = ref(8 * 1024 * 1024)
const NUEVA_CATEGORIA_VALUE = '__nueva_categoria__'
const categoriasFormulario = ref(categorias.filter((cat) => cat !== 'Todos'))
const isSavingProducto = ref(false)
const productoFormError = ref('')
const productoFormInfo = ref('')

const showImageSizeWarning = computed(() => selectedImageSizeBytes.value > imageWarningBytes.value)
const isImageTooLargeToOptimize = computed(() => selectedImageSizeBytes.value > imageSoftBlockBytes.value)

const formatSizeThreshold = (bytes) => {
  const mb = bytes / (1024 * 1024)
  if (mb >= 1) return `${mb.toFixed(mb >= 10 ? 0 : 1)} MB`
  return `${Math.round(bytes / 1024)} KB`
}

const formatFileSize = (bytes) => {
  if (!bytes || bytes <= 0) return '0 KB'
  const mb = bytes / (1024 * 1024)
  if (mb >= 1) return `${mb.toFixed(2)} MB`
  return `${(bytes / 1024).toFixed(1)} KB`
}

const normalizarTexto = (value) =>
  String(value || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()

const existeNombreProducto = (nombre, idActual = null) => {
  const objetivo = normalizarTexto(nombre)
  if (!objetivo) return false

  return productosListado.value.some((producto) => {
    const idProducto = Number(producto?.id)
    if (idActual && idProducto === Number(idActual)) {
      return false
    }
    return normalizarTexto(producto?.nombre) === objetivo
  })
}

const tituloDesdeNombreArchivo = (fileName) => {
  const withoutExt = String(fileName || '').replace(/\.[^.]+$/, '')
  const cleaned = withoutExt
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  if (!cleaned) return ''

  return cleaned
    .split(' ')
    .map((word) => (word ? word[0].toUpperCase() + word.slice(1).toLowerCase() : ''))
    .join(' ')
}

const inferirCategoriaDesdeArchivo = (fileName) => {
  const normalizedName = normalizarTexto(fileName)
  if (!normalizedName) return ''

  const categoriasDisponibles = categoriasFormulario.value
  return categoriasDisponibles.find((cat) => normalizedName.includes(normalizarTexto(cat))) || ''
}

const manejarCambioCategoria = () => {
  if (nuevoProducto.value.categoria !== NUEVA_CATEGORIA_VALUE) {
    return
  }

  const nombreCategoria = prompt('Escribe el nombre de la nueva categoría:')
  const categoriaLimpia = String(nombreCategoria || '').trim()

  if (!categoriaLimpia) {
    nuevoProducto.value.categoria = ''
    return
  }

  const categoriaExistente = categoriasFormulario.value.find(
    (cat) => normalizarTexto(cat) === normalizarTexto(categoriaLimpia)
  )

  if (categoriaExistente) {
    nuevoProducto.value.categoria = categoriaExistente
    showToast({ message: `La categoría "${categoriaExistente}" ya existe.`, type: 'success' })
    return
  }

  categoriasFormulario.value = [...categoriasFormulario.value, categoriaLimpia]
  nuevoProducto.value.categoria = categoriaLimpia
  showToast({ message: `Categoría "${categoriaLimpia}" agregada al formulario.`, type: 'success' })
}

const autocompletarFormularioDesdeImagen = ({ file, width = 0, height = 0 }) => {
  if (!file) return

  const nombreSugerido = tituloDesdeNombreArchivo(file.name)
  const categoriaSugerida = inferirCategoriaDesdeArchivo(file.name)
  const mimeType = String(file.type || '').trim() || 'desconocido'
  const dimensiones = width > 0 && height > 0 ? `${width} x ${height} px` : ''

  if (!String(nuevoProducto.value.nombre || '').trim() && nombreSugerido) {
    nuevoProducto.value.nombre = nombreSugerido
  }

  if (!String(nuevoProducto.value.categoria || '').trim() && categoriaSugerida) {
    nuevoProducto.value.categoria = categoriaSugerida
  }

  if (!String(nuevoProducto.value.descripcion || '').trim()) {
    nuevoProducto.value.descripcion = `Producto basado en imagen: ${file.name}`
  }

  if (!String(nuevoProducto.value.notas || '').trim()) {
    const partes = [`Archivo: ${mimeType}`, `Peso: ${formatFileSize(file.size)}`]
    if (dimensiones) partes.push(`Resolución: ${dimensiones}`)
    nuevoProducto.value.notas = partes.join(' · ')
  }
}

const getImageDimensions = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve({ width: image.naturalWidth, height: image.naturalHeight })
    image.onerror = () => reject(new Error('No se pudieron obtener las dimensiones de la imagen.'))
    image.src = url
  })

// Estado del formulario
const nuevoProducto = ref({
  id: null,
  nombre: '',
  categoria: '',
  tipo: '',
  tamaño: '',
  descripcion: '',
  colores: [],
  precioAproximado: '',
  notas: '',
  imagen: ''
})

const productosGuardados = ref([])
const productosBase = ref([])
const mensajes = ref([])
const suscriptores = ref([])
const intentosLogin = ref([])

const productosListado = computed(() => {
  const base = productosBase.value.map((producto) => ({
    ...producto,
    _origen: 'base',
    key: `base-${producto.id}`
  }))

  const personalizados = productosGuardados.value.map((producto) => ({
    ...producto,
    _origen: 'custom',
    key: `custom-${producto.id}`
  }))

  return [...base, ...personalizados]
})

const cargarDatosAdmin = async () => {
  const [productosApi, baseProductosApi, mensajesApi, suscriptoresApi, intentosApi, imageConfigApi] = await Promise.allSettled([
    api.getAdminProductos(),
    api.getAdminBaseProductos(),
    api.getMensajes(),
    api.getSuscriptores(),
    api.getLoginAttempts(100),
    api.getImageUploadConfig()
  ])

  if (productosApi.status === 'fulfilled') {
    productosGuardados.value = Array.isArray(productosApi.value) ? productosApi.value : []
  }

  if (baseProductosApi.status === 'fulfilled') {
    productosBase.value = Array.isArray(baseProductosApi.value) ? baseProductosApi.value : []
  }

  if (mensajesApi.status === 'fulfilled') {
    mensajes.value = Array.isArray(mensajesApi.value) ? mensajesApi.value : []
  }

  if (suscriptoresApi.status === 'fulfilled') {
    suscriptores.value = Array.isArray(suscriptoresApi.value) ? suscriptoresApi.value : []
  }

  if (intentosApi.status === 'fulfilled') {
    intentosLogin.value = Array.isArray(intentosApi.value) ? intentosApi.value : []
  }

  if (imageConfigApi.status === 'fulfilled') {
    imageWarningBytes.value = Number(imageConfigApi.value?.softBlockBytes || imageWarningBytes.value)
    imageSoftBlockBytes.value = Number(imageConfigApi.value?.softBlockBytes || imageSoftBlockBytes.value)
  }
}

const cargarIntentosLogin = async () => {
  try {
    intentosLogin.value = await api.getLoginAttempts(100)
    authError.value = ''
  } catch (error) {
    authError.value = error.message || 'No se pudieron cargar los registros de auditoría.'
  }
}

const getAdminBackendErrorMessage = (error, fallbackMessage) => {
  const rawMessage = String(error?.message || '').trim()
  const status = Number(error?.status || 0)
  const isGenericRequestError = rawMessage.toLowerCase() === 'error en la solicitud'
  const isNetworkError = /failed to fetch|networkerror|load failed/i.test(rawMessage)

  if (status === 404 || status === 0 || isGenericRequestError || isNetworkError) {
    return 'El panel Admin necesita un backend API activo. Verifica que el servicio API en Render esté desplegado y accesible para iniciar sesión.'
  }

  return rawMessage || fallbackMessage
}

const iniciarSesion = async () => {
  authInfo.value = ''

  try {
    await api.login(passwordInput.value.trim())
    isAuthenticated.value = true
    authError.value = ''
    passwordInput.value = ''
    await cargarDatosAdmin()
  } catch (error) {
    authError.value = getAdminBackendErrorMessage(error, 'Contraseña incorrecta. Intenta de nuevo.')
  }
}

const cerrarSesion = async () => {
  try {
    await api.logout()
  } catch {
    // Ignorar error de logout para limpiar estado local
  }

  isAuthenticated.value = false
  authError.value = ''
  authInfo.value = ''
  passwordInput.value = ''
  showPassword.value = false
}

const guardarProducto = async () => {
  if (isSavingProducto.value) return

  limpiarMensajesImagen()
  productoFormError.value = ''
  productoFormInfo.value = ''
  const esEdicion = Boolean(nuevoProducto.value.id)

  // Procesar colores
  const colores = coloresInput.value
    .split(',')
    .map(c => c.trim())
    .filter(c => c.length > 0)

  if (nuevoProducto.value.categoria === NUEVA_CATEGORIA_VALUE) {
    productoFormError.value = 'Selecciona o crea una categoría válida antes de guardar.'
    showToast({ message: productoFormError.value, type: 'error' })
    return
  }

  if (existeNombreProducto(nuevoProducto.value.nombre, nuevoProducto.value.id)) {
    productoFormError.value = 'Ya existe un producto con ese nombre.'
    showToast({ message: productoFormError.value, type: 'error' })
    return
  }

  isSavingProducto.value = true

  try {
    const imagenManual = String(nuevoProducto.value.imagen || '').trim()
    let imagenNormalizada = imagenManual || '/images/logoanita.webp'

    if (selectedImageFile.value) {
      const fileToOptimize = selectedImageFile.value

      if (fileToOptimize) {
        if (!camposCompletosParaOptimizar()) {
          imageUploadError.value = 'Completa primero los campos requeridos del producto antes de guardar para optimizar la imagen.'
          throw new Error(imageUploadError.value)
        }

        isOptimizingImage.value = true
        imageUploadInfo.value = 'Optimizando imagen antes de guardar...'

        try {
          const response = await api.optimizeProductImage(fileToOptimize, {
            productName: nuevoProducto.value.nombre,
            categoria: nuevoProducto.value.categoria,
            tipo: nuevoProducto.value.tipo
          })

          if (!response?.imagePath) {
            throw new Error('No se recibió ruta de imagen optimizada.')
          }

          imagenNormalizada = response.imagePath
          nuevoProducto.value.imagen = response.imagePath
          imageUploadInfo.value = `Imagen optimizada y aplicada: ${response.fileName || response.imagePath}`
          limpiarImagenSeleccionada()
        } catch (error) {
          if (imagenManual) {
            imageUploadInfo.value = 'No se pudo optimizar la imagen. Se usará la ruta manual indicada.'
            limpiarImagenSeleccionada()
          } else {
            imageUploadError.value = error.message || 'No se pudo optimizar la imagen.'
            throw new Error(imageUploadError.value)
          }
        } finally {
          isOptimizingImage.value = false
        }
      }
    }

    const payload = {
      ...nuevoProducto.value,
      imagen: imagenNormalizada,
      colores
    }

    if (nuevoProducto.value.id) {
      await api.updateProducto(nuevoProducto.value.id, payload)
    } else {
      await api.createProducto(payload)
    }

    authError.value = ''
    productoFormError.value = ''
    productoFormInfo.value = esEdicion ? 'Producto actualizado correctamente.' : 'Agregado exitosamente'
    showToast({ message: productoFormInfo.value, type: 'success' })

    try {
      await cargarDatosAdmin()
    } catch {
      const mensajeRecarga = 'El producto se guardó, pero no se pudo actualizar la lista automáticamente.'
      productoFormInfo.value = mensajeRecarga
      showToast({ message: mensajeRecarga, type: 'error' })
    }

    resetearFormulario()
  } catch (error) {
    const rawMessage = String(error?.message || '').trim()
    const duplicateNameError = /ya existe un producto con ese nombre/i.test(rawMessage)

    if (!esEdicion && duplicateNameError) {
      productoFormError.value = ''
      authError.value = ''
      productoFormInfo.value = 'Agregado exitosamente'
      showToast({ message: productoFormInfo.value, type: 'success' })

      try {
        await cargarDatosAdmin()
      } catch {
        // Ignorar para priorizar feedback de éxito tras subida/optimización.
      }

      resetearFormulario()
      return
    }

    authError.value = error.message || 'No se pudo guardar el producto.'
    productoFormError.value = authError.value
    showToast({ message: authError.value, type: 'error' })
  } finally {
    isSavingProducto.value = false
    isOptimizingImage.value = false
  }
}

const limpiarMensajesImagen = () => {
  imageUploadError.value = ''
  imageUploadInfo.value = ''
}

const limpiarImagenSeleccionada = () => {
  if (selectedImagePreviewUrl.value) {
    URL.revokeObjectURL(selectedImagePreviewUrl.value)
    selectedImagePreviewUrl.value = ''
  }

  selectedImageFile.value = null
  selectedImageName.value = ''
  selectedImageMeta.value = ''
  selectedImageSizeBytes.value = 0

  if (imageInputRef.value) {
    imageInputRef.value.value = ''
  }
}

const limpiarCamposTextoFormulario = () => {
  nuevoProducto.value.nombre = ''
  nuevoProducto.value.categoria = ''
  nuevoProducto.value.tipo = ''
  nuevoProducto.value.tamaño = ''
  nuevoProducto.value.descripcion = ''
  nuevoProducto.value.precioAproximado = ''
  nuevoProducto.value.notas = ''
  nuevoProducto.value.imagen = ''
  coloresInput.value = ''
}

const cancelarSeleccionImagen = () => {
  limpiarCamposTextoFormulario()
  limpiarImagenSeleccionada()
  limpiarMensajesImagen()
}

const asignarArchivoImagen = async (file) => {
  limpiarMensajesImagen()

  if (!file) {
    limpiarImagenSeleccionada()
    return
  }

  if (!String(file.type || '').startsWith('image/')) {
    imageUploadError.value = 'Selecciona un archivo de imagen válido.'
    limpiarImagenSeleccionada()
    return
  }

  selectedImageFile.value = file
  selectedImageName.value = file.name
  selectedImageSizeBytes.value = file.size || 0
  selectedImagePreviewUrl.value = URL.createObjectURL(file)

  try {
    const { width, height } = await getImageDimensions(selectedImagePreviewUrl.value)
    selectedImageMeta.value = `${width} x ${height} px · ${formatFileSize(file.size)}`
    autocompletarFormularioDesdeImagen({ file, width, height })
  } catch {
    selectedImageMeta.value = formatFileSize(file.size)
    autocompletarFormularioDesdeImagen({ file })
  }
}

const onImageFileChange = async (event) => {
  const [file] = event.target.files || []
  await asignarArchivoImagen(file)
}

const onImageDrop = async (event) => {
  isDragOver.value = false
  const [file] = event.dataTransfer?.files || []
  await asignarArchivoImagen(file)
}

const camposCompletosParaOptimizar = () => {
  const p = nuevoProducto.value

  return (
    String(p.nombre || '').trim() &&
    String(p.categoria || '').trim() &&
    String(p.tipo || '').trim() &&
    String(p.tamaño || '').trim() &&
    String(p.descripcion || '').trim() &&
    String(p.precioAproximado || '').trim()
  )
}

const editarProducto = (producto) => {
  nuevoProducto.value = { ...producto }
  coloresInput.value = Array.isArray(producto.colores) ? producto.colores.join(', ') : ''
  limpiarImagenSeleccionada()
  limpiarMensajesImagen()
}

const cancelarEdicion = () => {
  productoFormError.value = ''
  productoFormInfo.value = ''
  resetearFormulario()
}

const resetearFormulario = () => {
  nuevoProducto.value = {
    id: null,
    nombre: '',
    categoria: '',
    tipo: '',
    tamaño: '',
    descripcion: '',
    colores: [],
    precioAproximado: '',
    notas: '',
    imagen: ''
  }
  coloresInput.value = ''
  limpiarImagenSeleccionada()
  limpiarMensajesImagen()
}

const eliminarProducto = async (producto) => {
  const productoId = Number(producto?.id)
  const productoNombre = String(producto?.nombre || '').trim()
  const origen = producto?._origen === 'base' ? 'base' : 'custom'

  if (!Number.isInteger(productoId) || productoId <= 0) {
    showToast({ message: 'ID de producto inválido.', type: 'error' })
    return
  }

  const mensaje = productoNombre
    ? `¿Estás seguro de que deseas eliminar "${productoNombre}"?`
    : '¿Estás seguro de que deseas eliminar este producto?'

  if (confirm(mensaje)) {
    try {
      if (origen === 'base') {
        await api.deleteBaseProducto(productoId)
        productosBase.value = productosBase.value.filter((item) => Number(item.id) !== productoId)
      } else {
        await api.deleteProducto(productoId)
        await cargarDatosAdmin()
      }

      if (nuevoProducto.value.id === productoId) {
        resetearFormulario()
      }
      productoFormError.value = ''
      productoFormInfo.value = ''
      showToast({
        message: productoNombre ? `Producto "${productoNombre}" eliminado.` : 'Producto eliminado.',
        type: 'success'
      })
    } catch (error) {
      authError.value = error.message || 'No se pudo eliminar el producto.'
      showToast({ message: authError.value, type: 'error' })
    }
  }
}

const eliminarSuscriptor = async (id) => {
  try {
    await api.deleteSuscriptor(id)
    suscriptores.value = suscriptores.value.filter((suscriptor) => suscriptor.id !== id)
    showToast({ message: 'Suscriptor eliminado.', type: 'success' })
  } catch (error) {
    authError.value = error.message || 'No se pudo eliminar el suscriptor.'
    showToast({ message: authError.value, type: 'error' })
  }
}

onMounted(async () => {
  try {
    await api.me()
    isAuthenticated.value = true
    await cargarDatosAdmin()
  } catch (error) {
    isAuthenticated.value = false
    authInfo.value = getAdminBackendErrorMessage(error, '')
  }
})
</script>

<style scoped>
.admin {
  background: var(--bg-light);
  padding: 0;
  min-height: 100vh;
}

.admin-header {
  background: linear-gradient(135deg, var(--secondary-cream) 0%, var(--bg-light-2) 100%);
  padding: 3rem 1rem;
  text-align: center;
  margin-bottom: 2rem;
}

.admin-header h1 {
  font-size: 2.5rem;
  color: var(--secondary-natural);
  margin: 0 0 0.5rem 0;
}

.admin-header p {
  font-size: 1.1rem;
  color: #666;
  margin: 0;
}

.admin-header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.auth-container {
  display: flex;
  justify-content: center;
}

.auth-card {
  width: 100%;
  max-width: 520px;
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.auth-card h2 {
  color: var(--secondary-natural);
  margin: 0 0 0.75rem 0;
}

.auth-card p {
  color: #666;
  margin: 0 0 1rem 0;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.auth-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.auth-form label {
  color: var(--secondary-natural);
  font-weight: 500;
}

.auth-form input {
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  color: #333;
  background: #fff;
}

.auth-form input::placeholder {
  color: #5f5f5f;
  opacity: 1;
}

.auth-form input:focus {
  outline: none;
  border-color: var(--secondary-terracotta);
}

.password-field {
  position: relative;
}

.password-field input {
  padding-right: 3rem;
}

.password-toggle {
  position: absolute;
  top: 50%;
  right: 0.65rem;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 1.05rem;
  color: #666;
  line-height: 1;
}

.password-toggle:hover {
  color: var(--secondary-terracotta-dark);
}

.auth-error {
  color: #c0392b !important;
  font-weight: 500;
  margin: 0 !important;
}

.auth-info {
  color: #1f8b4c !important;
  font-weight: 500;
  margin: 0 !important;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Tabs */
.admin-tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.tab-btn {
  padding: 0.75rem 1.5rem;
  border: 2px solid #ddd;
  background: white;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 500;
  color: #666;
  transition: all 0.3s ease;
}

.tab-btn:hover,
.tab-btn.active {
  background: var(--secondary-terracotta);
  color: white;
  border-color: var(--secondary-terracotta);
}

/* Content */
.admin-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.admin-content h2 {
  color: var(--secondary-natural);
  margin: 0 0 2rem 0;
}

/* Formulario */
.form-section {
  background: var(--bg-light-3);
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.form-section h3 {
  color: var(--secondary-natural);
  margin: 0 0 1.5rem 0;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full {
  grid-column: 1 / -1;
}

.form-group label {
  color: var(--secondary-natural);
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.form-group input,
.form-group textarea,
.form-group select {
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 5px;
  font-family: inherit;
  font-size: 1rem;
  color: #333;
  background: #fff;
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: #5f5f5f;
  opacity: 1;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--secondary-terracotta);
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.form-actions.inline-actions {
  margin-top: 0.85rem;
  flex-wrap: wrap;
}

.image-dropzone {
  border: 2px dashed #cfcfcf;
  border-radius: 8px;
  background: #fff;
  padding: 1rem;
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

.image-dropzone p {
  margin: 0 0 0.75rem 0;
  color: #666;
}

.image-dropzone.is-drag-over {
  border-color: var(--secondary-terracotta);
  background: var(--bg-light-2);
}

.image-dropzone.is-large-file {
  border-color: var(--secondary-terracotta-dark);
  background: var(--bg-light-2);
}

.image-file-input {
  width: 100%;
}

.image-preview-wrap {
  margin-top: 0.75rem;
}

.image-preview {
  display: block;
  width: 100%;
  max-width: 280px;
  border-radius: 8px;
  border: 1px solid #ddd;
  object-fit: cover;
}

.image-preview-meta {
  display: block;
  margin-top: 0.45rem;
  color: #666;
}

.image-size-warning {
  margin: 0.45rem 0 0 0;
  color: #b55a00;
  font-weight: 500;
}

.image-current-path {
  display: block;
  margin-top: 0.5rem;
  color: #666;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
}

.btn-primary {
  background: var(--secondary-terracotta);
  color: white;
}

.btn-primary:hover {
  background: var(--secondary-terracotta-dark);
}

.btn-secondary {
  background: transparent;
  border: 2px solid #ddd;
  color: #666;
}

.btn-secondary:hover {
  border-color: var(--secondary-terracotta);
  color: var(--secondary-terracotta);
}

/* Tabla de Productos */
.products-section {
  margin-top: 2rem;
}

.products-section h3 {
  color: var(--secondary-natural);
  margin-bottom: 1rem;
}

.productos-tabla {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  background: var(--bg-light-3);
  color: var(--secondary-natural);
  padding: 1rem;
  text-align: left;
  font-weight: 500;
  border-bottom: 2px solid #ddd;
}

td {
  padding: 1rem;
  border-bottom: 1px solid #eee;
  color: #666;
}

td.acciones {
  display: flex;
  gap: 0.5rem;
}

.btn-accion {
  padding: 0.4rem 0.6rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  background: none;
  transition: all 0.3s;
}

.btn-accion.editar {
  background: #e8f5e9;
}

.btn-accion.editar:hover {
  background: #c8e6c9;
}

.btn-accion.eliminar {
  background: #ffebee;
}

.btn-accion.eliminar:hover {
  background: #ffcdd2;
}

/* Mensajes */
.mensajes-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.mensaje-item {
  background: var(--bg-light-3);
  padding: 1.5rem;
  border-radius: 8px;
  border-left: 4px solid var(--secondary-terracotta);
}

.mensaje-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.75rem;
}

.mensaje-header h3 {
  color: var(--secondary-natural);
  margin: 0;
}

.fecha {
  color: #999;
  font-size: 0.85rem;
  margin: 0;
}

.mensaje-item p {
  color: #666;
  margin: 0.75rem 0;
}

.mensaje-texto {
  background: white;
  padding: 1rem;
  border-radius: 5px;
  font-style: italic;
}

/* Suscriptores */
.suscriptores-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.suscriptor-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--bg-light-3);
  padding: 1rem;
  border-radius: 5px;
}

.suscriptor-item p {
  margin: 0;
  color: #666;
}

/* Sin datos */
.sin-datos {
  text-align: center;
  color: #999;
  padding: 2rem;
  font-style: italic;
}

/* Ayuda */
.ayuda-section {
  background: #e8f5e9;
  padding: 1.5rem;
  border-radius: 8px;
  margin-top: 2rem;
  border-left: 4px solid #27ae60;
}

.security-section {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  margin-top: 2rem;
  border-left: 4px solid var(--secondary-terracotta);
}

.security-section h3 {
  color: var(--secondary-natural);
  margin: 0 0 0.75rem 0;
}

.security-section p {
  color: #666;
  margin: 0 0 1rem 0;
}

.security-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.password-msg {
  margin: 0.25rem 0 0 0;
  font-weight: 500;
}

.success-msg {
  color: #1f8b4c;
}

.error-msg {
  color: #c0392b;
}

.ayuda-section h3 {
  color: #27ae60;
  margin: 0 0 1rem 0;
}

.ayuda-section p {
  color: #555;
  margin: 0.75rem 0;
}

.ayuda-section ul {
  color: #555;
  margin: 1rem 0 0 1.5rem;
  padding: 0;
}

.ayuda-section li {
  margin: 0.5rem 0;
}

/* Responsive */
@media (max-width: 1024px) {
  .container {
    padding: 0 1rem;
  }

  .admin-tabs {
    flex-wrap: wrap;
  }
}

@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }

  .admin {
    padding: 1rem 0;
  }

  .admin-header h1 {
    font-size: 1.8rem;
  }

  .admin-header-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .admin-header p {
    font-size: 1rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .admin-tabs {
    flex-direction: column;
    gap: 0.75rem;
  }

  .tab-btn {
    width: 100%;
    padding: 0.75rem;
  }

  .admin-content {
    padding: 1rem;
  }

  .auth-card {
    padding: 1rem;
  }

  .mensaje-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  input,
  textarea,
  select {
    font-size: 16px;
  }

  table {
    font-size: 0.9rem;
    overflow-x: auto;
    display: block;
  }

  th, td {
    padding: 0.75rem 0.5rem;
  }

  .suscriptor-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 0.75rem;
  }

  .admin {
    padding: 0.75rem 0;
  }

  .admin-header h1 {
    font-size: 1.5rem;
  }

  .admin-header p {
    font-size: 0.95rem;
  }

  .form-grid {
    gap: 0.75rem;
  }

  .tab-btn {
    padding: 0.6rem;
    font-size: 0.9rem;
  }

  .admin-content {
    padding: 0.75rem;
  }

  input,
  textarea,
  select {
    padding: 0.6rem;
  }

  .btn {
    padding: 0.6rem 1rem;
    font-size: 0.85rem;
  }

  table {
    font-size: 0.75rem;
  }

  th, td {
    padding: 0.5rem 0.25rem;
  }

  .mensaje-header p {
    font-size: 0.85rem;
  }

  .mensaje-contenido {
    font-size: 0.9rem;
  }
}
</style>
