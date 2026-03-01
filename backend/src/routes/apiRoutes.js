import express from 'express'

export const validateBody = (schema) => (req, res, next) => {
  const parsed = schema.safeParse(req.body || {})

  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message || 'Payload inválido' })
    return
  }

  req.validatedBody = parsed.data
  next()
}

export const createApiRouter = ({
  controller,
  requireAuth,
  loginRateLimit,
  schemas
}) => {
  const router = express.Router()

  router.get('/health', controller.health)
  router.get('/test-db', controller.testDb)

  router.post('/auth/login', loginRateLimit, validateBody(schemas.loginSchema), controller.login)
  router.post('/auth/logout', controller.logout)
  router.get('/auth/me', requireAuth, controller.me)

  router.post('/admin/optimize-image', requireAuth, controller.upload.single('image'), controller.optimizeImage)
  router.get('/admin/image-upload-config', requireAuth, controller.imageUploadConfig)
  router.get('/admin/login-attempts', requireAuth, controller.loginAttempts)

  router.get('/admin/base-productos', requireAuth, controller.getBaseProductos)
  router.delete('/admin/base-productos/:id', requireAuth, controller.deleteBaseProducto)

  router.get('/productos', requireAuth, controller.getAdminProductos)
  router.post('/productos', requireAuth, validateBody(schemas.productoSchema), controller.createProducto)
  router.put('/productos/:id', requireAuth, validateBody(schemas.productoSchema), controller.updateProducto)
  router.delete('/productos/:id', requireAuth, controller.deleteProducto)

  router.get('/public/productos', controller.getPublicProductos)
  router.post('/public/contacto', validateBody(schemas.contactoSchema), controller.sendContacto)
  router.post('/public/suscriptores', validateBody(schemas.suscriptorSchema), controller.subscribeNewsletter)

  router.get('/mensajes', requireAuth, controller.getMensajes)
  router.get('/suscriptores', requireAuth, controller.getSuscriptores)
  router.delete('/suscriptores/:id', requireAuth, controller.deleteSuscriptor)

  return router
}
