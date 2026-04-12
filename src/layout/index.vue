<template>
  <div class="common-layout">
    <el-container style="height: 100vh;">
      <el-aside width="200px" class="layout-aside">
        <Sidebar />
      </el-aside>
      <el-container>
        <el-header height="60px" class="layout-header">
          <Navbar />
        </el-header>
        <el-main class="layout-main">
          <AppMain />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue'
import AppMain from './components/AppMain.vue'
import Sidebar from './components/Sidebar/index.vue'
</script>

<style scoped>
.common-layout {
  width: 100%;
  height: 100vh;
}

.layout-aside {
  background-color: var(--bg-color) !important;
  color: var(--text-color) !important;
  border-right: 1px solid var(--border-color);
}

.layout-header {
  background-color: var(--navbar-bg) !important;
  color: var(--navbar-text) !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.layout-main {
  background-color: var(--bg-color) !important;
  color: var(--text-color) !important;
  padding: 0;
}
</style>
 
