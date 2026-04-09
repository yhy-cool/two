import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'normalize.css'
import './style.css'
import i18n from './i18n'

const pinia = createPinia()
createApp(App).use(router).use(ElementPlus).use(i18n).use(pinia).mount('#app')
