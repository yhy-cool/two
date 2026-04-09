<template>
  <div class="sidebar">
    <el-menu
      :default-active="activeIndex"
      class="el-menu-vertical-demo"
      background-color="#303133"
      text-color="#fff"
      active-text-color="#409EFF"
      router
    >
      <el-menu-item index="/">
        <el-icon><i class="el-icon-s-home"></i></el-icon>
        <span>首页</span>
      </el-menu-item>
      <el-sub-menu index="/users">
        <template #title>
          <el-icon><i class="el-icon-user"></i></el-icon>
          <span>用户管理</span>
        </template>
        <el-menu-item index="/users/list">
          <span>用户列表</span>
        </el-menu-item>
        <el-menu-item index="/users/roles">
          <span>角色列表</span>
        </el-menu-item>
        <el-menu-item index="/users/permissions">
          <span>权限列表</span>
        </el-menu-item>
      </el-sub-menu>
      <el-menu-item index="/dashboard">
        <el-icon><i class="el-icon-data-analysis"></i></el-icon>
        <span>数据可视化</span>
      </el-menu-item>
      <el-menu-item index="/profile">
        <el-icon><i class="el-icon-user"></i></el-icon>
        <span>我的</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const activeIndex = computed(() => route.path)
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
 