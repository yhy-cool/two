<template>
  <div class="sidebar">
    <el-menu
      :default-active="activeIndex"
      class="el-menu-vertical-demo"
      :background-color="menuBgColor"
      :text-color="menuTextColor"
      :active-text-color="menuActiveTextColor"
      router
      :collapse-transition="false"
    >
      <el-menu-item index="/">
        <el-icon><i class="el-icon-s-home"></i></el-icon>
        <span>{{ t('sidebar.home') }}</span>
      </el-menu-item>
      <el-sub-menu index="/users">
        <template #title>
          <el-icon><i class="el-icon-user"></i></el-icon>
          <span>{{ t('sidebar.userManagement') }}</span>
        </template>
        <el-menu-item index="/users/list">
          <span>{{ t('sidebar.userList') }}</span>
        </el-menu-item>
        <el-menu-item index="/users/roles">
          <span>{{ t('sidebar.roleList') }}</span>
        </el-menu-item>
        <el-menu-item index="/users/permissions">
          <span>{{ t('sidebar.permissionList') }}</span>
        </el-menu-item>
      </el-sub-menu>
      <el-sub-menu index="/article">
        <template #title>
          <el-icon><i class="el-icon-document"></i></el-icon>
          <span>文章</span>
        </template>
        <el-menu-item index="/article/list">
          <span>文章列表</span>
        </el-menu-item>
        <el-menu-item index="/article/create">
          <span>创建文章</span>
        </el-menu-item>
      </el-sub-menu>
      <el-menu-item index="/dashboard">
        <el-icon><i class="el-icon-data-analysis"></i></el-icon>
        <span>{{ t('sidebar.dashboard') }}</span>
      </el-menu-item>
      <el-menu-item index="/profile">
        <el-icon><i class="el-icon-user"></i></el-icon>
        <span>{{ t('sidebar.profile') }}</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useGlobalStore } from '@/store'
import SvgIcon from '@/components/SvgIcon/index.vue'

const route = useRoute()
const { t } = useI18n()
const store = useGlobalStore()

const activeIndex = computed(() => route.path)

// 菜单颜色
const menuBgColor = computed(() => {
  return store.theme === 'light' ? '#f5f7fa' : '#1f2329'
})

const menuTextColor = computed(() => {
  return store.theme === 'light' ? '#303133' : '#e5e6eb'
})

const menuActiveTextColor = computed(() => {
  return store.theme === 'light' ? '#409EFF' : '#409EFF'
})
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

/* 主题相关样式 */
:deep(.el-menu) {
  border-right: 1px solid var(--border-color);
}

:deep(.el-sub-menu__title:hover),
:deep(.el-menu-item:hover) {
  background-color: var(--hover-color) !important;
}

:deep(.el-menu-item.is-active) {
  background-color: var(--active-color) !important;
}
</style>
 