import { defineStore } from 'pinia'
import { updateLanguage } from '../i18n'

export const useGlobalStore = defineStore('global', {
  state: () => ({
    // 语言状态，默认从localStorage获取，否则使用中文
    language: localStorage.getItem('language') || 'zh-CN',
    // 主题状态，默认从localStorage获取，否则使用白色主题
    theme: localStorage.getItem('theme') || 'light'
  }),
  actions: {
    // 切换语言
    switchLanguage() {
      this.language = this.language === 'zh-CN' ? 'en-US' : 'zh-CN'
      localStorage.setItem('language', this.language)
      // 更新i18n语言
      updateLanguage(this.language)
    },
    // 切换主题
    switchTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light'
      localStorage.setItem('theme', this.theme)
      // 应用主题到文档
      document.documentElement.setAttribute('data-theme', this.theme)
    },
    // 初始化主题
    initTheme() {
      document.documentElement.setAttribute('data-theme', this.theme)
    },
    // 初始化语言
    initLanguage() {
      updateLanguage(this.language)
    }
  }
})