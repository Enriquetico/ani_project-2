import jwt from 'jsonwebtoken'

const COOKIE_NAME = 'ani_admin_token'

export const getCookieName = () => COOKIE_NAME

export const signAuthToken = ({ id, username }, jwtSecret, jwtExpiresIn) => {
  return jwt.sign(
    {
      sub: id,
      username
    },
    jwtSecret,
    { expiresIn: jwtExpiresIn }
  )
}

export const verifyToken = (token, jwtSecret) => jwt.verify(token, jwtSecret)

export const authMiddleware = (jwtSecret) => (req, res, next) => {
  const token = req.cookies?.[COOKIE_NAME]

  if (!token) {
    res.status(401).json({ error: 'No autenticado' })
    return
  }

  try {
    req.admin = verifyToken(token, jwtSecret)
    next()
  } catch {
    res.status(401).json({ error: 'Sesión inválida o expirada' })
  }
}
