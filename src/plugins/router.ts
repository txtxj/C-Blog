import { createGetRoutes, setupLayouts } from 'virtual:meta-layouts'
import { createRouter, createWebHistory } from 'vue-router'
import generatedRoutes from 'virtual:generated-pages'

declare module 'vue-router' {
	// 在这里定义你的 meta 类型
	// eslint-disable-next-line no-unused-vars
	interface RouteMeta {
		title?: string
		layout?: string
	}
}

export const router = createRouter({
	history: createWebHistory(),
	routes: setupLayouts(generatedRoutes),
})

export const getRoutes = createGetRoutes(router)

export default router
