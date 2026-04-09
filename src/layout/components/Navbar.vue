<template>
  <div class="navbar">
    <div class="navbar-left">
      <span class="logo">后台管理系统</span>
    </div>
    <div class="navbar-right">
      <div class="controls">
        <div class="language-switch" @click="switchLanguage">
          <el-icon><Flag /></el-icon>
          <span>{{ languageText }}</span>
        </div>
        <div class="theme-switch" @click="switchTheme">
          <el-icon><SwitchButton /></el-icon>
        </div>
      </div>
      <el-dropdown>
        <span class="user">
          <el-icon><i class="el-icon-user"></i></el-icon>
          <span>{{ userName }}</span>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="navigateToProfile">个人中心</el-dropdown-item>
            <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
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
import { Flag, SwitchButton } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()
const globalStore = useGlobalStore()
const { t } = useI18n()
const userName = ref('')

const languageText = computed(() => {
  return globalStore.language === 'zh-CN' ? t('common.english') : t('common.chinese')
})

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
  padding: 0 20px;
}

.logo {
  font-size: 18px;
  font-weight: bold;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.controls {
  display: flex;
  align-items: center;
  gap: 15px;
}

.language-switch, .theme-switch {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  color: white;
  transition: color 0.3s ease;
}

.language-switch:hover, .theme-switch:hover {
  color: #e6f7ff;
}

.user {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
}
</style>
 