import { createApp } from 'vue'
import './style.css'
import router from './router'
import posthog from 'posthog-js'
// App.vue is now mounted via the /app route — root mounts RouterView
import { createRouter as _, createWebHistory as __ } from 'vue-router' // type-only, imported in router/index

import { defineComponent, h } from 'vue'
import { RouterView } from 'vue-router'

const Root = defineComponent({
    name: 'Root',
    render: () => h(RouterView),
})

const app = createApp(Root)

// Initialize PostHog
if (import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN) {
    posthog.init(import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN, {
        api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
        person_profiles: 'always',
    })
}

app.use(router)

// PostHog Router tracking
router.afterEach((to) => {
    posthog.capture('$pageview', {
        $current_url: window.location.origin + to.fullPath
    })
})

app.mount('#app')


