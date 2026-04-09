<template>
  <div class="user-list">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>{{ t('user.userManagement') }}</span>
          <div class="header-actions">
            <el-button type="primary" @click="handleAddUser">
              <el-icon><Plus /></el-icon>
              {{ t('user.addUser') }}
            </el-button>
            <el-button type="warning" @click="handleBatchDelete" :disabled="selectedUserIds.length === 0">
              <el-icon><Delete /></el-icon>
              {{ t('user.batchDelete') }}
            </el-button>
            <el-button type="info" @click="handleExportExcel">
              <el-icon><Download /></el-icon>
              {{ t('user.exportExcel') }}
            </el-button>
            <el-upload
              class="upload-btn"
              :show-file-list="false"
              :auto-upload="false"
              :on-change="handleFileChange"
              accept=".xlsx,.xls"
            >
              <el-button type="success">
                <el-icon><Upload /></el-icon>
                {{ t('user.importExcel') }}
              </el-button>
            </el-upload>
          </div>
        </div>
      </template>
      
      <div class="search-bar">
        <el-input
          v-model="searchQuery"
          :placeholder="t('user.searchPlaceholder')"
          clearable
          style="width: 300px"
          @keyup.enter="handleSearch"
        >
          <template #append>
            <el-button @click="handleSearch">
              <el-icon><Search /></el-icon>
            </el-button>
          </template>
        </el-input>
      </div>
      
      <el-table
        v-loading="loading"
        :data="paginatedUsers"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" :label="t('user.id')" width="80" />
        <el-table-column prop="username" :label="t('user.username')" />
        <el-table-column prop="email" :label="t('user.email')" />
        <el-table-column prop="status" :label="t('user.status')" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'active' ? 'success' : 'danger'">
              {{ scope.row.status === 'active' ? t('user.active') : t('user.inactive') }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" :label="t('user.createdAt')" width="180" />
        <el-table-column :label="t('user.actions')" width="200">
          <template #default="scope">
            <el-button size="small" @click="handleEditUser(scope.row)">
              <el-icon><Edit /></el-icon>
              {{ t('user.edit') }}
            </el-button>
            <el-button size="small" type="danger" @click="handleDeleteUser(scope.row.id)">
              <el-icon><Delete /></el-icon>
              {{ t('user.delete') }}
            </el-button>
            <el-button
              size="small"
              :type="scope.row.status === 'active' ? 'warning' : 'success'"
              @click="handleToggleStatus(scope.row.id, scope.row.status === 'active' ? 'inactive' : 'active')"
            >
              {{ scope.row.status === 'active' ? t('user.freeze') : t('user.enable') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="filteredUsers.length"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    
    <!-- 添加/编辑用户对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? t('user.editUser') : t('user.addUser')"
      width="500px"
    >
      <el-form
        ref="userFormRef"
        :model="userForm"
        :rules="userRules"
        label-width="80px"
      >
        <el-form-item :label="t('user.username')" prop="username">
          <el-input v-model="userForm.username" :placeholder="t('user.enterUsername')" />
        </el-form-item>
        <el-form-item :label="t('user.email')" prop="email">
          <el-input v-model="userForm.email" :placeholder="t('user.enterEmail')" type="email" />
        </el-form-item>
        <el-form-item :label="t('user.password')" prop="password" v-if="!isEdit">
          <el-input v-model="userForm.password" :placeholder="t('user.enterPassword')" type="password" />
        </el-form-item>
        <el-form-item :label="t('user.status')" prop="status">
          <el-radio-group v-model="userForm.status">
            <el-radio label="active">{{ t('user.active') }}</el-radio>
            <el-radio label="inactive">{{ t('user.inactive') }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">{{ t('user.cancel') }}</el-button>
          <el-button type="primary" @click="handleSaveUser">{{ t('user.save') }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Delete, Download, Search, Edit, Upload } from '@element-plus/icons-vue'
import { importExcel, exportExcel } from '@/utils/excel'

const { t } = useI18n()

// 模拟用户数据
const generateMockUsers = () => {
  const users = []
  for (let i = 1; i <= 50; i++) {
    users.push({
      id: i,
      username: `user${i}`,
      email: `user${i}@example.com`,
      status: i % 5 === 0 ? 'inactive' : 'active',
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    })
  }
  return users
}

// 状态管理
const users = ref(generateMockUsers())
const searchQuery = ref('')
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const selectedUserIds = ref([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const userForm = ref({
  id: '',
  username: '',
  email: '',
  password: '',
  status: 'active'
})
const userFormRef = ref(null)

// 表单验证规则
const userRules = ref({
  username: [
    { required: true, message: t('user.usernameRequired'), trigger: 'blur' },
    { min: 3, max: 20, message: t('user.usernameLength'), trigger: 'blur' }
  ],
  email: [
    { required: true, message: t('user.emailRequired'), trigger: 'blur' },
    { type: 'email', message: t('user.emailInvalid'), trigger: 'blur' }
  ],
  password: [
    { required: true, message: t('user.passwordRequired'), trigger: 'blur' },
    { min: 6, message: t('user.passwordLength'), trigger: 'blur' }
  ]
})

// 过滤后的用户列表
const filteredUsers = computed(() => {
  if (!searchQuery.value) {
    return users.value
  }
  return users.value.filter(user => 
    user.username.includes(searchQuery.value) || 
    user.email.includes(searchQuery.value)
  )
})

// 分页后的用户列表
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredUsers.value.slice(start, end)
})

// 生命周期
onMounted(() => {
  // 初始化数据
  users.value = generateMockUsers()
})

// 搜索
const handleSearch = () => {
  currentPage.value = 1
}

// 选择变化
const handleSelectionChange = (selection) => {
  selectedUserIds.value = selection.map(item => item.id)
}

// 分页变化
const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
}

const handleCurrentChange = (current) => {
  currentPage.value = current
}

// 添加用户
const handleAddUser = () => {
  isEdit.value = false
  userForm.value = {
    id: '',
    username: '',
    email: '',
    password: '',
    status: 'active'
  }
  dialogVisible.value = true
}

// 编辑用户
const handleEditUser = (user) => {
  isEdit.value = true
  userForm.value = { ...user }
  dialogVisible.value = true
}

// 保存用户
const handleSaveUser = async () => {
  if (!userFormRef.value) return
  
  try {
    await userFormRef.value.validate()
    
    if (isEdit.value) {
      // 编辑用户
      const index = users.value.findIndex(u => u.id === userForm.value.id)
      if (index !== -1) {
        users.value[index] = { ...userForm.value }
        ElMessage.success(t('user.editSuccess'))
      }
    } else {
      // 添加用户
      const newUser = {
        ...userForm.value,
        id: users.value.length + 1,
        createdAt: new Date().toISOString().split('T')[0]
      }
      users.value.push(newUser)
      ElMessage.success(t('user.addSuccess'))
    }
    
    dialogVisible.value = false
  } catch (error) {
    // 验证失败
    console.error('表单验证失败:', error)
  }
}

// 删除用户
const handleDeleteUser = (id) => {
  ElMessageBox.confirm(t('user.deleteConfirm'), t('user.deleteTitle'), {
    confirmButtonText: t('user.confirm'),
    cancelButtonText: t('user.cancel'),
    type: 'warning'
  }).then(() => {
    users.value = users.value.filter(user => user.id !== id)
    ElMessage.success(t('user.deleteSuccess'))
  }).catch(() => {
    // 取消删除
  })
}

// 批量删除
const handleBatchDelete = () => {
  if (selectedUserIds.value.length === 0) return
  
  ElMessageBox.confirm(t('user.batchDeleteConfirm', { count: selectedUserIds.value.length }), t('user.deleteTitle'), {
    confirmButtonText: t('user.confirm'),
    cancelButtonText: t('user.cancel'),
    type: 'warning'
  }).then(() => {
    users.value = users.value.filter(user => !selectedUserIds.value.includes(user.id))
    selectedUserIds.value = []
    ElMessage.success(t('user.batchDeleteSuccess'))
  }).catch(() => {
    // 取消删除
  })
}

// 切换用户状态
const handleToggleStatus = (id, newStatus) => {
  const user = users.value.find(u => u.id === id)
  if (user) {
    user.status = newStatus
    ElMessage.success(t('user.statusChanged', { status: newStatus === 'active' ? t('user.active') : t('user.inactive') }))
  }
}

// 导出Excel
const handleExportExcel = () => {
  try {
    const headers = [
      { key: 'id', title: t('user.id') },
      { key: 'username', title: t('user.username') },
      { key: 'email', title: t('user.email') },
      { key: 'status', title: t('user.status') },
      { key: 'createdAt', title: t('user.createdAt') }
    ]
    
    // 转换状态为中文
    const exportData = users.value.map(user => ({
      ...user,
      status: user.status === 'active' ? t('user.active') : t('user.inactive')
    }))
    
    exportExcel(exportData, 'users.xlsx', headers)
    ElMessage.success(t('user.exportSuccess'))
  } catch (error) {
    console.error('导出失败:', error)
    ElMessage.error(t('user.exportFailed'))
  }
}

// 处理文件上传
const handleFileChange = async (file) => {
  try {
    const importedData = await importExcel(file.raw)
    
    // 处理导入的数据
    const newUsers = importedData.map(item => {
      // 转换状态为英文
      let status = item.status
      if (typeof status === 'string') {
        status = status.toLowerCase()
        if (status.includes('active') || status.includes('启用') || status.includes('激活')) {
          status = 'active'
        } else {
          status = 'inactive'
        }
      } else {
        status = 'active'
      }
      
      return {
        id: Math.max(...users.value.map(u => u.id), 0) + 1,
        username: item.username || item[t('user.username')] || '',
        email: item.email || item[t('user.email')] || '',
        status: status,
        createdAt: item.createdAt || item[t('user.createdAt')] || new Date().toISOString().split('T')[0]
      }
    }).filter(user => user.username && user.email)
    
    if (newUsers.length > 0) {
      users.value = [...users.value, ...newUsers]
      ElMessage.success(t('user.importSuccess', { count: newUsers.length }))
    } else {
      ElMessage.warning(t('user.importNoData'))
    }
  } catch (error) {
    console.error('导入失败:', error)
    ElMessage.error(t('user.importFailed'))
  }
}
</script>

<style scoped>
.user-list {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.search-bar {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>