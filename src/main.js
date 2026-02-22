import { ViteSSG } from 'vite-ssg'
import './style.css'
import App from './App.vue'
import routerOptions from './router/index.js'
import { getSeoForRoute } from './seo/route-seo.js'

const upsertMetaTag = (selector, attributes) => {
	let element = document.head.querySelector(selector)

	if (!element) {
		element = document.createElement('meta')
		document.head.appendChild(element)
	}

	Object.entries(attributes).forEach(([key, value]) => {
		element.setAttribute(key, value)
	})
}

const upsertCanonical = (href) => {
	let link = document.head.querySelector('link[rel="canonical"]')

	if (!link) {
		link = document.createElement('link')
		link.setAttribute('rel', 'canonical')
		document.head.appendChild(link)
	}

	link.setAttribute('href', href)
}

export const createApp = ViteSSG(App, routerOptions, ({ router, isClient }) => {
	if (!isClient) return

	const applySeo = (path) => {
		const seo = getSeoForRoute(path)

		document.title = seo.title
		upsertMetaTag('meta[name="description"]', { name: 'description', content: seo.description })
		upsertMetaTag('meta[name="robots"]', { name: 'robots', content: seo.robots })
		upsertCanonical(seo.canonical)
	}

	applySeo(router.currentRoute.value.path)

	router.afterEach((to) => {
		applySeo(to.path)
	})
})
