<script setup>
import { onMounted, watch } from 'vue'
import { useGlobalStore } from './store'
import { useI18n } from 'vue-i18n'

const globalStore = useGlobalStore()
const { locale } = useI18n()

// 初始化主题
onMounted(() => {
  globalStore.initTheme()
  // 同步Pinia中的语言到i18n
  locale.value = globalStore.language
})

// 监听语言变化
watch(() => globalStore.language, (newLang) => {
  locale.value = newLang
})

// 监听主题变化
watch(() => globalStore.theme, (newTheme) => {
  // 应用主题到文档
  document.documentElement.setAttribute('data-theme', newTheme)
})
</script>

<template>
  <router-view></router-view>
</template>

<style>
/* 全局主题样式 */
:root {
  --bg-color: #f5f5f5;
  --text-color: #303133;
  --card-bg: #ffffff;
  --border-color: #dcdfe6;
}

[data-theme="dark"] {
  --bg-color: #1a1a1a;
  --text-color: #e4e7ed;
  --card-bg: #2c2c2c;
  --border-color: #4e4e4e;
}

body {
  background-color: var(--bg-color);
  color: var(--text-color);
  transition: all 0.3s ease;
}
</style>
