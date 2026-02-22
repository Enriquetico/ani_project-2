import Home from '../views/Home.vue'

const Galeria = () => import('../views/Galeria.vue')
const DetalleProducto = () => import('../views/DetalleProducto.vue')
const Sobre = () => import('../views/Sobre.vue')
const Contacto = () => import('../views/Contacto.vue')
const Blog = () => import('../views/Blog.vue')
const Admin = () => import('../views/Admin.vue')
const ArticuloDetalle = () => import('../views/ArticuloDetalle.vue')
const NotFound = () => import('../views/NotFound.vue')

export const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/galeria',
    name: 'Galeria',
    component: Galeria
  },
  {
    path: '/producto/:id',
    name: 'DetalleProducto',
    component: DetalleProducto
  },
  {
    path: '/sobre',
    name: 'Sobre',
    component: Sobre
  },
  {
    path: '/contacto',
    name: 'Contacto',
    component: Contacto
  },
  {
    path: '/blog',
    name: 'Blog',
    component: Blog
  },
  {
    path: '/blog/:id',
    name: 'ArticuloDetalle',
    component: ArticuloDetalle
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
]

const scrollBehavior = (to) => {
  if (to.hash) {
    return {
      el: to.hash,
      behavior: 'smooth'
    }
  }

  return {
    top: 0,
    behavior: 'smooth'
  }
}

const routerOptions = {
  routes,
  scrollBehavior
}

export default routerOptions
