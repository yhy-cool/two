<template>
  <div class="common-layout" :class="{ 'dark': isDark }">
    <el-container class="layout-container">
      <el-aside width="220px" class="layout-aside">
        <Sidebar />
      </el-aside>
      <el-container class="layout-main">
        <el-header height="60px" class="layout-header">
          <Navbar />
        </el-header>
        <el-main class="layout-content">
          <AppMain />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useGlobalStore } from '../store'
import Navbar from './components/Navbar.vue'
import AppMain from './components/AppMain.vue'
import Sidebar from './components/Sidebar/index.vue'

const globalStore = useGlobalStore()
const isDark = computed(() => globalStore.theme === 'dark')
</script>

<style scoped>
.common-layout {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.layout-container {
  height: 100vh;
}

.layout-aside {
  background-color: #303133;
  color: white;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.layout-main {
  flex: 1;
  overflow: hidden;
}

.layout-header {
  background-color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.layout-content {
  flex: 1;
  overflow-y: auto;
  background-color: #f5f7fa;
}

/* 深色主题适配 */
:deep(.dark) .layout-aside {
  background-color: #1f2124;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.3);
}

:deep(.dark) .layout-header {
  background-color: #1f2124;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

:deep(.dark) .layout-content {
  background-color: #1a1a1a;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .layout-aside {
    width: 64px !important;
  }
}
</style>
 
