<template>
  <div class="common-layout">
    <el-container style="height: 100vh;">
      <el-aside width="200px" style="background-color: #303133; color: white;">
        <Sidebar />
      </el-aside>
      <el-container>
        <el-header height="60px" style="background-color: #409EFF; color: white;">
          <Navbar />
        </el-header>
        <el-main style="background-color: #f0f2f5;">
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
</style>
 
