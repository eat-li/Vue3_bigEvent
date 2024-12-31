import { createApp } from 'vue'
//导入sass
import '@/assets/main.scss'
import App from './App.vue'
import router from './router'
import pinia from './stores'
const app = createApp(App)

app.use(pinia)
app.use(router)
app.mount('#app')
