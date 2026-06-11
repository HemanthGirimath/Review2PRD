import { createApp } from 'vue'
import './style.css'
import router from './router'
import { defineComponent, h } from 'vue'
import { RouterView } from 'vue-router'

const Root = defineComponent({
    name: 'Root',
    render: () => h(RouterView),
})

const app = createApp(Root)

app.use(router)
app.mount('#app')
