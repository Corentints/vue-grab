import { createApp } from 'vue'
import { createVueGrab } from 'vue-grab'
import App from './App.vue'

const app = createApp(App)
app.use(createVueGrab())
app.mount('#app')
