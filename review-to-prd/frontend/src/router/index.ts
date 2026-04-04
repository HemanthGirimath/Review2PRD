import { createRouter, createWebHistory } from 'vue-router'
import { getUser } from '../lib/supabase'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'landing',
            component: () => import('../pages/LandingPage.vue'),
            beforeEnter: async () => {
                const user = await getUser()
                if (user) return { name: 'app' }
            },
        },
        {
            path: '/demo',
            name: 'demo',
            component: () => import('../pages/DemoPage.vue'),
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('../pages/LoginPage.vue'),
            beforeEnter: async () => {
                // Already logged in → go straight to app
                const user = await getUser()
                if (user) return { name: 'app' }
            },
        },
        {
            path: '/app',
            name: 'app',
            component: () => import('../App.vue'),
            beforeEnter: async () => {
                const user = await getUser()
                if (!user) return { name: 'login' }
            },
        },
    ],
})

export default router
