import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
// H5防侧滑退出应用
import '@/utils/app-back-button.js'

// 导入样式
import '@/assets/styles/base.css'
import '@/assets/styles/components.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

app.mount('#app')
