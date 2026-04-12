<template>
  <div class="sidebar">
    <el-menu
      :default-active="activeIndex"
      class="el-menu-vertical-demo"
      background-color="#303133"
      text-color="#fff"
      active-text-color="#409EFF"
      router
      :collapse-transition="false"
    >
      <el-menu-item index="/">
        <el-icon><svg-icon name="dashboard" /></el-icon>
        <span>首页</span>
      </el-menu-item>
      <el-sub-menu index="/users">
        <template #title>
          <el-icon><svg-icon name="personnel" /></el-icon>
          <span>用户管理</span>
        </template>
        <el-menu-item index="/users/list">
          <el-icon><svg-icon name="personnel-info" /></el-icon>
          <span>用户列表</span>
        </el-menu-item>
        <el-menu-item index="/users/roles">
          <el-icon><svg-icon name="role" /></el-icon>
          <span>角色列表</span>
        </el-menu-item>
        <el-menu-item index="/users/permissions">
          <el-icon><svg-icon name="permission" /></el-icon>
          <span>权限列表</span>
        </el-menu-item>
      </el-sub-menu>
      <el-menu-item index="/dashboard">
        <el-icon><svg-icon name="table" /></el-icon>
        <span>数据可视化</span>
      </el-menu-item>
      <el-menu-item index="/profile">
        <el-icon><svg-icon name="user" /></el-icon>
        <span>个人中心</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import SvgIcon from '@/components/SvgIcon/index.vue'

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
  border-right: none;
}

.el-menu-item {
  height: 56px;
  line-height: 56px;
  margin: 0 10px;
  border-radius: 8px;
  margin-bottom: 8px;
}

.el-sub-menu .el-menu-item {
  height: 48px;
  line-height: 48px;
  margin: 0 10px;
  border-radius: 6px;
  margin-bottom: 4px;
}

.el-sub-menu__title {
  height: 56px;
  line-height: 56px;
  margin: 0 10px;
  border-radius: 8px;
  margin-bottom: 8px;
}

.el-menu-item.is-active {
  background-color: rgba(64, 158, 255, 0.2) !important;
}

.el-sub-menu__title.is-active {
  background-color: rgba(64, 158, 255, 0.2) !important;
}
</style>
 