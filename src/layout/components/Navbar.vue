<template>
  <div class="navbar">
    <div class="navbar-left">
<<<<<<< HEAD
      <span class="logo">{{ t('navbar.title') }}</span>
=======
      <div class="logo">
        <el-icon class="logo-icon"><svg-icon name="dashboard" /></el-icon>
        <span class="logo-text">后台管理系统</span>
      </div>
>>>>>>> 1b530287610d5542af690559257e22cf06392cd0
    </div>
    <div class="navbar-right">
      <div class="controls">
        <el-tooltip content="切换语言" placement="bottom">
          <div class="control-item language-switch" @click="switchLanguage">
            <el-icon><svg-icon name="language" /></el-icon>
            <span>{{ languageText }}</span>
          </div>
        </el-tooltip>
        <el-tooltip content="切换主题" placement="bottom">
          <div class="control-item theme-switch" @click="switchTheme">
            <el-icon><svg-icon name="change-theme" /></el-icon>
          </div>
        </el-tooltip>
      </div>
      <el-dropdown trigger="click">
        <div class="user">
          <el-avatar :size="36" :src="userAvatar" />
          <span class="user-name">{{ userName || '管理员' }}</span>
          <el-icon class="dropdown-icon"><arrow-down /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
<<<<<<< HEAD
            <el-dropdown-item @click="navigateToProfile">{{ t('navbar.profile') }}</el-dropdown-item>
            <el-dropdown-item @click="handleLogout">{{ t('navbar.logout') }}</el-dropdown-item>
=======
            <el-dropdown-item @click="navigateToProfile">
              <el-icon><svg-icon name="user" /></el-icon>
              <span>个人中心</span>
            </el-dropdown-item>
            <el-dropdown-item divided @click="handleLogout">
              <el-icon><svg-icon name="exit-fullscreen" /></el-icon>
              <span>退出登录</span>
            </el-dropdown-item>
>>>>>>> 1b530287610d5542af690559257e22cf06392cd0
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useGlobalStore } from '../../store'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { ArrowDown } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import SvgIcon from '@/components/SvgIcon/index.vue'

const router = useRouter()
const globalStore = useGlobalStore()
const { t } = useI18n()
const userName = ref('')

const languageText = computed(() => {
  return globalStore.language === 'zh-CN' ? t('common.english') : t('common.chinese')
})

const userAvatar = ref('https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png')

const switchLanguage = () => {
  globalStore.switchLanguage()
}

const switchTheme = () => {
  globalStore.switchTheme()
}

const navigateToProfile = () => {
  router.push('/profile')
}

const handleLogout = () => {
  // 清除localStorage中的数据
  localStorage.removeItem('token')
  localStorage.removeItem('userInfo')
  // 跳转到登录页面
  router.push('/login')
  ElMessage.success('退出登录成功')
}

// 初始化用户信息
onMounted(() => {
  const userInfoStr = localStorage.getItem('userInfo')
  if (userInfoStr) {
    const userInfo = JSON.parse(userInfoStr)
    userName.value = userInfo.name
  }
})
</script>

<style scoped>
.navbar {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
<<<<<<< HEAD
  padding: 0 20px;
  background-color: var(--navbar-bg);
  color: var(--navbar-text);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
=======
  padding: 0 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
>>>>>>> 1b530287610d5542af690559257e22cf06392cd0
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: opacity 0.3s ease;
}

.logo:hover {
  opacity: 0.8;
}

.logo-icon {
  font-size: 24px;
  color: #409EFF;
}

.logo-text {
  font-size: 18px;
<<<<<<< HEAD
  font-weight: bold;
  color: var(--navbar-text);
=======
  font-weight: 600;
  color: #303133;
>>>>>>> 1b530287610d5542af690559257e22cf06392cd0
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 24px;
}

.controls {
  display: flex;
  align-items: center;
  gap: 16px;
}

.control-item {
  cursor: pointer;
  display: flex;
  align-items: center;
<<<<<<< HEAD
  gap: 5px;
  color: var(--navbar-text);
  transition: color 0.3s ease;
}

.language-switch:hover, .theme-switch:hover {
  color: var(--primary-color);
=======
  gap: 6px;
  color: #606266;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.control-item:hover {
  background-color: #f5f7fa;
  color: #409EFF;
>>>>>>> 1b530287610d5542af690559257e22cf06392cd0
}

.user {
  cursor: pointer;
  display: flex;
  align-items: center;
<<<<<<< HEAD
  gap: 8px;
  color: var(--navbar-text);
}

/* 下拉菜单样式 */
:deep(.el-dropdown-menu) {
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

:deep(.el-dropdown-item) {
  color: var(--text-color);
}

:deep(.el-dropdown-item:hover) {
  background-color: var(--hover-color);
=======
  gap: 12px;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.user:hover {
  background-color: #f5f7fa;
}

.user-name {
  font-size: 14px;
  color: #303133;
  font-weight: 500;
}

.dropdown-icon {
  font-size: 12px;
  color: #909399;
  transition: transform 0.3s ease;
}

.user:hover .dropdown-icon {
  transform: rotate(180deg);
}

/* 深色主题适配 */
:deep(.dark) .navbar {
  background-color: #1f2124;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

:deep(.dark) .logo-text {
  color: #e4e7ed;
}

:deep(.dark) .control-item {
  color: #c0c4cc;
}

:deep(.dark) .control-item:hover {
  background-color: #2c2e30;
  color: #409EFF;
}

:deep(.dark) .user {
  color: #e4e7ed;
}

:deep(.dark) .user:hover {
  background-color: #2c2e30;
}

:deep(.dark) .user-name {
  color: #e4e7ed;
}

:deep(.dark) .dropdown-icon {
  color: #909399;
>>>>>>> 1b530287610d5542af690559257e22cf06392cd0
}
</style>
 