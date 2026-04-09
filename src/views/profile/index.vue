<template>
  <div class="profile">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>{{ t('profile.title') }}</span>
        </div>
      </template>
      
      <el-form
        ref="profileFormRef"
        :model="userInfo"
        :rules="profileRules"
        label-width="100px"
      >
        <el-form-item :label="t('profile.username')" prop="username">
          <el-input v-model="userInfo.username" disabled />
        </el-form-item>
        <el-form-item :label="t('profile.name')" prop="name">
          <el-input v-model="userInfo.name" :placeholder="t('profile.enterName')" />
        </el-form-item>
        <el-form-item :label="t('profile.email')" prop="email">
          <el-input v-model="userInfo.email" :placeholder="t('profile.enterEmail')" type="email" />
        </el-form-item>
        <el-form-item :label="t('profile.role')" prop="role">
          <el-input v-model="userInfo.role" disabled />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSave">{{ t('profile.save') }}</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'

const { t } = useI18n()

const userInfo = ref({
  id: '',
  username: '',
  name: '',
  email: '',
  role: ''
})

const profileFormRef = ref(null)

const profileRules = ref({
  name: [
    { required: true, message: t('profile.nameRequired'), trigger: 'blur' }
  ],
  email: [
    { required: true, message: t('profile.emailRequired'), trigger: 'blur' },
    { type: 'email', message: t('profile.emailInvalid'), trigger: 'blur' }
  ]
})

const handleSave = async () => {
  if (!profileFormRef.value) return
  
  try {
    await profileFormRef.value.validate()
    // 保存修改到localStorage
    localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
    ElMessage.success(t('profile.saveSuccess'))
  } catch (error) {
    // 验证失败
    console.error('表单验证失败:', error)
  }
}

// 初始化用户信息
onMounted(() => {
  const userInfoStr = localStorage.getItem('userInfo')
  if (userInfoStr) {
    userInfo.value = JSON.parse(userInfoStr)
  }
})
</script>

<style scoped>
.profile {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.el-form {
  margin-top: 20px;
}

.el-form-item {
  margin-bottom: 20px;
}
</style>