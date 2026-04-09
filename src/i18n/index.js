import { createI18n } from 'vue-i18n'
import zhCN from './locales/zh-CN.js'
import enUS from './locales/en-US.js'

// 从localStorage获取语言设置，默认为中文
const lang = localStorage.getItem('language') || 'zh-CN'

const i18n = createI18n({
  legacy: false, // 使用Composition API
  locale: lang,
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS
  }
})

export default i18n
export { zhCN, enUS }