<template>
  <div class="app-main">
    <router-view v-slot="{ Component }">
      <transition name="fade-transform" mode="out-in">
        <keep-alive :include="cachedViews">
          <component :is="Component" />
        </keep-alive>
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const cachedViews = ref([])

// 缓存需要的页面
const addCachedView = (view) => {
  if (cachedViews.value.includes(view)) return
  cachedViews.value.push(view)
}

// 监听路由变化，添加缓存
watch(
  () => route.name,
  (newName) => {
    if (newName) {
      addCachedView(newName)
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.app-main {
<<<<<<< HEAD
  padding: 20px;
  background-color: var(--bg-color) !important;
  min-height: calc(100vh - 60px);
  color: var(--text-color) !important;
=======
  padding: 24px;
  min-height: calc(100vh - 60px);
  background-color: #f5f7fa;
  transition: all 0.3s ease;
}

/* 过渡动画 */
.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.3s ease;
}

.fade-transform-enter-from,
.fade-transform-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* 深色主题适配 */
:deep(.dark) .app-main {
  background-color: #1a1a1a;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .app-main {
    padding: 16px;
  }
>>>>>>> 1b530287610d5542af690559257e22cf06392cd0
}
</style>
 