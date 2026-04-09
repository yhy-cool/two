<template>
  <div class="permission-list">
    <el-card v-if="canManagePermissions">
      <template #header>
        <div class="card-header">
          <span>{{ t('permission.permissionManagement') }}</span>
        </div>
      </template>
      
      <div class="permission-content">
        <el-select v-model="selectedRole" :placeholder="t('permission.selectRole')" style="width: 200px; margin-bottom: 20px">
          <el-option v-for="role in roles" :key="role.id" :label="role.name" :value="role.name" />
        </el-select>
        
        <el-tree
          v-if="selectedRole"
          ref="permissionTreeRef"
          :data="permissionTree"
          show-checkbox
          node-key="id"
          default-expand-all
          :default-checked-keys="getCheckedPermissions(selectedRole)"
          @check-change="handlePermissionChange"
        />
        
        <div class="action-buttons" v-if="selectedRole">
          <el-button type="primary" @click="handleSavePermissions">{{ t('permission.savePermissions') }}</el-button>
        </div>
      </div>
    </el-card>
    <el-empty v-else description="{{ t('permission.noPermission') }}" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage } from 'element-plus'

const { t } = useI18n()

// 模拟角色数据
const roles = ref([
  { id: 1, name: 'admin' },
  { id: 2, name: 'manager' },
  { id: 3, name: 'employee' }
])

// 模拟权限树数据
const permissionTree = ref([
  {
    id: 1,
    label: '用户管理',
    children: [
      { id: 11, label: '查看用户' },
      { id: 12, label: '添加用户' },
      { id: 13, label: '编辑用户' },
      { id: 14, label: '删除用户' }
    ]
  },
  {
    id: 2,
    label: '角色管理',
    children: [
      { id: 21, label: '查看角色' },
      { id: 22, label: '添加角色' },
      { id: 23, label: '编辑角色' },
      { id: 24, label: '删除角色' }
    ]
  },
  {
    id: 3,
    label: '权限管理',
    children: [
      { id: 31, label: '查看权限' },
      { id: 32, label: '分配权限' }
    ]
  },
  {
    id: 4,
    label: '系统设置',
    children: [
      { id: 41, label: '基本设置' },
      { id: 42, label: '安全设置' }
    ]
  }
])

// 模拟角色权限数据
const rolePermissions = ref({
  admin: [1, 11, 12, 13, 14, 2, 21, 22, 23, 24, 3, 31, 32, 4, 41, 42],
  manager: [1, 11, 12, 13, 2, 21, 3, 31],
  employee: [1, 11, 3, 31]
})

// 状态管理
const selectedRole = ref('')
const permissionTreeRef = ref(null)

// 获取当前用户信息
const getCurrentUser = () => {
  const userInfoStr = localStorage.getItem('userInfo')
  return userInfoStr ? JSON.parse(userInfoStr) : null
}

// 权限控制
const canManagePermissions = ref(() => {
  const currentUser = getCurrentUser()
  return currentUser && currentUser.role === 'admin'
})

// 生命周期
onMounted(() => {
  // 默认选择第一个角色
  if (roles.value.length > 0) {
    selectedRole.value = roles.value[0].name
  }
})

// 监听角色变化，更新权限树
watch(selectedRole, (newRole) => {
  if (newRole && permissionTreeRef.value) {
    // 延迟执行，确保树已经渲染
    setTimeout(() => {
      permissionTreeRef.value.setCheckedKeys(getCheckedPermissions(newRole))
    }, 0)
  }
})

// 获取角色的权限
const getCheckedPermissions = (role) => {
  return rolePermissions.value[role] || []
}

// 处理权限变化
const handlePermissionChange = (data, checked, indeterminate) => {
  // 这里可以添加更多的逻辑来处理权限的父子关系
}

// 保存权限
const handleSavePermissions = () => {
  if (!selectedRole.value || !permissionTreeRef.value) return
  
  // 获取所有选中的节点
  const checkedKeys = permissionTreeRef.value.getCheckedKeys()
  
  // 更新角色权限
  rolePermissions.value[selectedRole.value] = checkedKeys
  
  ElMessage.success(t('permission.permissionSaved'))
}
</script>

<style scoped>
.permission-list {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.permission-content {
  margin-top: 20px;
}

.el-tree {
  margin-top: 20px;
}
</style>