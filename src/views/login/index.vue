<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useGlobalStore } from '../../store'
import { validatePassword } from './rules.js'
import { User, Lock, Flag, SwitchButton } from '@element-plus/icons-vue'
import { login } from '../../api/index.js'
import { ElMessage } from 'element-plus'

const router = useRouter()
const { t } = useI18n()
const globalStore = useGlobalStore()

const loginForm = ref({
  username: '',
  password: ''
})

const loginRules = ref({
  username: [
    { required: true, message: t('login.usernameRequired'), trigger: 'blur' }
  ],
  password: [
    { required: true, trigger: 'blur', validator: validatePassword() },
  ]
})

const formRef = ref(null)

// 计算属性，用于获取当前语言显示文本
const languageText = computed(() => {
  return globalStore.language === 'zh-CN' ? t('common.english') : t('common.chinese')
})

// 计算属性，用于获取当前主题图标
const themeIcon = computed(() => {
  return globalStore.theme === 'light' ? Moon : Sun
})

const handleLogin = async () => {
  // 触发表单验证
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    // 验证通过，发送登录请求
    const res = await login(loginForm.value)
    // 保存token到localStorage
    localStorage.setItem('token', res.token)
    ElMessage.success(t('login.loginSuccess'))
    // 跳转到首页
    router.push('/')
  } catch (error) {
    // 验证失败或登录失败
    let errorMessage = t('login.loginFailed')
    
    if (error.message) {
      errorMessage = error.message
    } else if (error.response && error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message
    }
    
    ElMessage({
      message: errorMessage,
      type: 'error',
      duration: 5000 // 增加错误提示的持续时间
    })
  }
}

const switchLanguage = () => {
  globalStore.switchLanguage()
  // 重新初始化验证规则，确保错误信息也能国际化
  loginRules.value = {
    username: [
      { required: true, message: t('login.usernameRequired'), trigger: 'blur' }
    ],
    password: [
      { required: true, trigger: 'blur', validator: validatePassword() },
    ]
  }
}

const switchTheme = () => {
  globalStore.switchTheme()
}
</script>

<template>
  <div class="login">
    <div class="top-controls">
      <div class="language-switch" @click="switchLanguage">
        <el-icon><Flag /></el-icon>
        <span>{{ languageText }}</span>
      </div>
      <div class="theme-switch" @click="switchTheme">
        <el-icon><SwitchButton /></el-icon>
      </div>
    </div>
    <el-form ref="formRef" :model="loginForm" :rules="loginRules">
        <h3 style="text-align: center;">{{ t('login.title') }}</h3>
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" :placeholder="t('login.username')" :prefix-icon="User"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="loginForm.password" :placeholder="t('login.password')" show-password :prefix-icon="Lock"></el-input>
      </el-form-item>
        <el-button type="primary" style="width: 100%;" @click="handleLogin">{{ t('login.loginBtn') }}</el-button>
    </el-form>
  </div>
</template>

<style scoped>
.login {
  width: 300px;
  margin: 0 auto;
  background-color: var(--card-bg);
  padding: 20px;
  padding-top: 100px;
  position: relative;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.top-controls {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  gap: 15px;
}

.language-switch, .theme-switch {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  color: var(--text-color);
  transition: color 0.3s ease;
}

.language-switch:hover, .theme-switch:hover {
  color: #409EFF;
}

h3 {
  color: var(--text-color);
  transition: color 0.3s ease;
}
</style>
