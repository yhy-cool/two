<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { validatePassword } from './rules.js'
import { User, Lock } from '@element-plus/icons-vue'
import { login } from '../../api/index.js'
import { ElMessage } from 'element-plus'
const router = useRouter()
const loginForm = ref({
  username: '',
  password: ''
})
const loginRules = ref({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, trigger: 'blur', validator: validatePassword() },
  ]
})
const formRef = ref(null)

const handleLogin = async () => {
  // 触发表单验证
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    // 验证通过，发送登录请求
    const res = await login(loginForm.value)
    // 保存token到localStorage
    localStorage.setItem('token', res.token)
    ElMessage.success('登录成功')
    // 跳转到首页
    router.push('/')
  } catch (error) {
    // 验证失败或登录失败
    let errorMessage = '登录失败，请稍后重试'
    
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
</script>

<template>
  <div class="login">
    <el-form ref="formRef" :model="loginForm" :rules="loginRules">
        <h3 style="text-align: center;">用户登录</h3>
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" placeholder="请输入用户名" :prefix-icon="User"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="loginForm.password" placeholder="请输入密码" show-password :prefix-icon="Lock"></el-input>
      </el-form-item>
        <el-button type="primary" style="width: 100%;" @click="handleLogin">登录</el-button>
    </el-form>
  </div>
</template>

<style scoped>
.login {
  width: 300px;
  margin: 0 auto;
  background-color: #f5f5f5;
  padding: 20px;
  padding-top: 100px;
}
</style>
