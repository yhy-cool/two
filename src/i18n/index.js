import { createI18n } from 'vue-i18n'
import zhCN from './locales/zh-CN.js'
import enUS from './locales/en-US.js'

const i18n = createI18n({
  legacy: false, // 使用Composition API
  locale: localStorage.getItem('language') || 'zh-CN',
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS
  }
})

// 导出i18n实例和更新语言的方法
export default i18n
export { zhCN, enUS }
export const updateLanguage = (locale) => {
  i18n.global.locale.value = locale
}
