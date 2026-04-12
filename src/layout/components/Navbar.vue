<template>
  <div class="navbar">
    <div class="navbar-left">
      <div class="logo">
        <el-icon class="logo-icon"><i class="el-icon-s-home"></i></el-icon>
        <span class="logo-text">{{ t('navbar.title') }}</span>
      </div>
    </div>
    <div class="navbar-right">
      <div class="controls">
        <el-tooltip :content="t('common.language')" placement="bottom">
          <div class="control-item language-switch" @click="switchLanguage">
            <el-icon><i class="el-icon-s-finance"></i></el-icon>
            <span>{{ languageText }}</span>
          </div>
        </el-tooltip>
        <el-tooltip :content="t('common.theme')" placement="bottom">
          <div class="control-item theme-switch" @click="switchTheme">
            <el-icon><i class="el-icon-moon"></i></el-icon>
            <span>{{ themeText }}</span>
          </div>
        </el-tooltip>
      </div>
      <el-dropdown trigger="click">
        <div class="user">
          <el-avatar :size="36" :src="userAvatar" />
          <span class="user-name">{{ userName || '管理员' }}</span>
          <el-icon class="dropdown-icon"><ArrowDown /></el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="navigateToProfile">{{ t('navbar.profile') }}</el-dropdown-item>
            <el-dropdown-item @click="handleLogout">{{ t('navbar.logout') }}</el-dropdown-item>
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

const themeText = computed(() => {
  return globalStore.theme === 'light' ? t('common.dark') : t('common.light')
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
  padding: 0 24px;
  background-color: var(--navbar-bg);
  color: var(--navbar-text);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
  font-weight: 600;
  color: var(--navbar-text);
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
  gap: 6px;
  color: var(--navbar-text);
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.control-item:hover {
  background-color: var(--hover-color);
  color: var(--primary-color);
}

.user {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.3s ease;
  color: var(--navbar-text);
}

.user:hover {
  background-color: var(--hover-color);
}

.user-name {
  font-size: 14px;
  color: var(--navbar-text);
  font-weight: 500;
}

.dropdown-icon {
  font-size: 12px;
  color: var(--navbar-text);
  transition: transform 0.3s ease;
}

.user:hover .dropdown-icon {
  transform: rotate(180deg);
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
}
</style>
 