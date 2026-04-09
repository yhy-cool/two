<template>
  <div class="sidebar">
    <el-menu
      :default-active="activeIndex"
      class="el-menu-vertical-demo"
      background-color="#303133"
      text-color="#fff"
      active-text-color="#409EFF"
    >
      <el-menu-item index="1">
        <el-icon><i class="el-icon-s-home"></i></el-icon>
        <span>首页</span>
      </el-menu-item>
      <el-menu-item index="2">
        <el-icon><i class="el-icon-document"></i></el-icon>
        <span>文档</span>
      </el-menu-item>
      <el-menu-item index="3">
        <el-icon><i class="el-icon-setting"></i></el-icon>
        <span>设置</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const activeIndex = ref('1')
</script>

<style scoped>
.sidebar {
  width: 100%;
  height: 100%;
  padding-top: 20px;
}

.el-menu-vertical-demo {
  width: 100%;
}
</style>
 