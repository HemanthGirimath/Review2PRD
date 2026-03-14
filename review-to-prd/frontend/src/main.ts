import { createApp } from 'vue'
import './style.css'
import router from './router'
// App.vue is now mounted via the /app route — root mounts RouterView
import { createRouter as _, createWebHistory as __ } from 'vue-router' // type-only, imported in router/index

import { defineComponent, h } from 'vue'
import { RouterView } from 'vue-router'

const Root = defineComponent({
    name: 'Root',
    render: () => h(RouterView),
})

createApp(Root).use(router).mount('#app')
