<template>
  <div class="user-list">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>{{ t('user.userManagement') }}</span>
          <div class="header-actions">
            <el-button type="primary" @click="handleAddUser" v-if="canAddUser">
              <el-icon><Plus /></el-icon>
              {{ t('user.addUser') }}
            </el-button>
            <el-button type="warning" @click="handleBatchDelete" :disabled="selectedUserIds.length === 0" v-if="canDeleteUser">
              <el-icon><Delete /></el-icon>
              {{ t('user.batchDelete') }}
            </el-button>
            <el-upload
              class="upload-demo"
              action=""
              :auto-upload="false"
              :on-change="handleFileChange"
              :show-file-list="false"
              accept=".xlsx,.xls"
            >
              <el-button type="success">
                <el-icon><Upload /></el-icon>
                {{ t('user.importExcel') }}
              </el-button>
            </el-upload>
            <el-button type="info" @click="handleExportExcel">
              <el-icon><Download /></el-icon>
              {{ t('user.exportExcel') }}
            </el-button>
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
        ref="tableRef"
        v-loading="loading"
        :data="paginatedUsers"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column v-for="column in columns" :key="column.prop || column.type"
          :prop="column.prop"
          :label="column.label"
          :width="column.width"
        >
          <template v-if="column.prop === 'role'" #default="scope">
            <el-tag :type="getRoleType(scope.row.role)">
              {{ getRoleName(scope.row.role) }}
            </el-tag>
          </template>
          <template v-else-if="column.prop === 'status'" #default="scope">
            <el-tag :type="scope.row.status === 'active' ? 'success' : 'danger'">
              {{ scope.row.status === 'active' ? t('user.active') : t('user.inactive') }}
            </el-tag>
          </template>
          <template v-else-if="column.prop === 'actions'" #default="scope">
            <el-button size="small" @click="handleEditUser(scope.row)" v-if="canEditUser(scope.row)">
              <el-icon><Edit /></el-icon>
              {{ t('user.edit') }}
            </el-button>
            <el-button size="small" type="danger" @click="handleDeleteUser(scope.row.id)" v-if="canDeleteUser">
              <el-icon><Delete /></el-icon>
              {{ t('user.delete') }}
            </el-button>
            <el-button
              size="small"
              :type="scope.row.status === 'active' ? 'warning' : 'success'"
              @click="handleToggleStatus(scope.row.id, scope.row.status === 'active' ? 'inactive' : 'active')"
              v-if="canEditUser(scope.row)"
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
        <el-form-item :label="t('user.name')" prop="name">
          <el-input v-model="userForm.name" :placeholder="t('user.enterName')" />
        </el-form-item>
        <el-form-item :label="t('user.email')" prop="email">
          <el-input v-model="userForm.email" :placeholder="t('user.enterEmail')" type="email" />
        </el-form-item>
        <el-form-item :label="t('user.role')" prop="role" v-if="canAssignRole">
          <el-select v-model="userForm.role" :placeholder="t('user.selectRole')">
            <el-option label="管理员" value="admin" />
            <el-option label="经理" value="manager" />
            <el-option label="员工" value="employee" />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('user.password')" prop="password" v-if="!isEdit">
          <el-input v-model="userForm.password" :placeholder="t('user.enterPassword')" type="password" />
        </el-form-item>
        <el-form-item :label="t('user.status')" prop="status" v-if="canEditStatus">
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
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox, ElUpload } from 'element-plus'
import { Plus, Delete, Download, Search, Edit, Upload } from '@element-plus/icons-vue'
import { importExcel, exportExcel } from '@/utils/excel'

const { t } = useI18n()

// 模拟用户数据
const generateMockUsers = () => {
  const users = []
  const roles = ['admin', 'manager', 'employee']
  for (let i = 1; i <= 50; i++) {
    users.push({
      id: i,
      username: `user${i}`,
      name: i === 1 ? '管理员' : i <= 5 ? `经理${i-1}` : `员工${i-5}`,
      email: `user${i}@example.com`,
      role: i === 1 ? 'admin' : i <= 5 ? 'manager' : 'employee',
      status: i % 5 === 0 ? 'inactive' : 'active',
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    })
  }
  return users
}

// 表格列配置
const columns = ref([
  { prop: 'id', label: t('user.id'), width: '80' },
  { prop: 'username', label: t('user.username') },
  { prop: 'name', label: t('user.name') },
  { prop: 'email', label: t('user.email') },
  { prop: 'role', label: t('user.role'), width: '120' },
  { prop: 'status', label: t('user.status'), width: '100' },
  { prop: 'createdAt', label: t('user.createdAt'), width: '180' },
  { prop: 'actions', label: t('user.actions'), width: '250' }
])

// 状态管理
const users = ref(generateMockUsers())
const searchQuery = ref('')
const loading = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const selectedUserIds = ref([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const file = ref(null)
const tableRef = ref(null)
const userForm = ref({
  id: '',
  username: '',
  name: '',
  email: '',
  role: 'employee',
  password: '',
  status: 'active'
})
const userFormRef = ref(null)

// 获取当前用户信息
const getCurrentUser = () => {
  const userInfoStr = localStorage.getItem('userInfo')
  return userInfoStr ? JSON.parse(userInfoStr) : null
}

// 权限控制
const canAddUser = computed(() => {
  const currentUser = getCurrentUser()
  return currentUser && (currentUser.role === 'admin' || currentUser.role === 'manager')
})

const canDeleteUser = computed(() => {
  const currentUser = getCurrentUser()
  return currentUser && currentUser.role === 'admin'
})

const canEditUser = (user) => {
  const currentUser = getCurrentUser()
  if (!currentUser) return false
  
  // 管理员可以编辑所有人
  if (currentUser.role === 'admin') return true
  
  // 经理可以编辑自己和员工
  if (currentUser.role === 'manager') {
    return user.id === currentUser.id || user.role === 'employee' || user.role === 'user'
  }
  
  // 员工和普通用户只能编辑自己
  if (currentUser.role === 'employee' || currentUser.role === 'user') {
    return user.id === currentUser.id
  }
  
  return false
}

const canAssignRole = computed(() => {
  const currentUser = getCurrentUser()
  return currentUser && currentUser.role === 'admin'
})

const canEditStatus = computed(() => {
  const currentUser = getCurrentUser()
  return currentUser && (currentUser.role === 'admin' || currentUser.role === 'manager')
})

// 表单验证规则
const userRules = ref({
  username: [
    { required: true, message: t('user.usernameRequired'), trigger: 'blur' },
    { min: 3, max: 20, message: t('user.usernameLength'), trigger: 'blur' }
  ],
  name: [
    { required: true, message: t('user.nameRequired'), trigger: 'blur' }
  ],
  email: [
    { required: true, message: t('user.emailRequired'), trigger: 'blur' },
    { type: 'email', message: t('user.emailInvalid'), trigger: 'blur' }
  ],
  password: [
    { required: true, message: t('user.passwordRequired'), trigger: 'blur' },
    { min: 6, message: t('user.passwordLength'), trigger: 'blur' }
  ],
  role: [
    { required: true, message: t('user.roleRequired'), trigger: 'blur' }
  ]
})

// 过滤后的用户列表
const filteredUsers = computed(() => {
  let result = users.value
  if (searchQuery.value) {
    result = result.filter(user => 
      user.username.includes(searchQuery.value) || 
      user.name.includes(searchQuery.value) ||
      user.email.includes(searchQuery.value)
    )
  }
  // 按id从小到大排序
  return result.sort((a, b) => a.id - b.id)
})

// 分页后的用户列表
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredUsers.value.slice(start, end)
})

// 获取角色名称
const getRoleName = (role) => {
  const roleMap = {
    admin: '管理员',
    manager: '经理',
    employee: '员工'
  }
  return roleMap[role] || role
}

// 获取角色标签类型
const getRoleType = (role) => {
  const typeMap = {
    admin: 'danger',
    manager: 'warning',
    employee: 'success'
  }
  return typeMap[role] || 'info'
}

// 初始化行拖拽排序
const initRowDrag = () => {
  // 动态引入SortableJS
  if (typeof window.Sortable === 'undefined') {
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js'
    script.onload = () => {
      setupRowSortable()
    }
    script.onerror = () => {
      console.error('SortableJS加载失败')
    }
    document.body.appendChild(script)
  } else {
    setupRowSortable()
  }
}

// 设置行拖拽Sortable
const setupRowSortable = () => {
  setTimeout(() => {
    if (tableRef.value) {
      const tableBody = tableRef.value.$el.querySelector('.el-table__body-wrapper tbody')
      if (tableBody) {
        try {
          new window.Sortable(tableBody, {
            animation: 150,
            ghostClass: 'sortable-ghost',
            chosenClass: 'sortable-chosen',
            dragClass: 'sortable-drag',
            // 确保拖拽时显示正确的内容
            ghostText: function(evt) {
              return evt.item.textContent.trim()
            },
            onMove: function(evt) {
              // 移除之前的高亮
              const oldHighlight = tableBody.querySelector('.sortable-highlight')
              if (oldHighlight) {
                oldHighlight.classList.remove('sortable-highlight')
              }
              
              // 给目标位置添加高亮
              if (evt.related) {
                evt.related.classList.add('sortable-highlight')
              }
            },
            onEnd: function(evt) {
              // 移除所有高亮
              const highlights = tableBody.querySelectorAll('.sortable-highlight')
              highlights.forEach(el => el.classList.remove('sortable-highlight'))
              
              // 更新数据顺序
              const movedItem = users.value.splice(evt.oldIndex, 1)[0]
              users.value.splice(evt.newIndex, 0, movedItem)
              
              // 强制表格重新渲染
              tableRef.value.$forceUpdate()
              
              // 显示修改成功提示
              ElMessage.success('修改成功')
            }
          })
        } catch (error) {
          console.error('初始化行拖拽排序失败:', error)
        }
      }
    }
  }, 300)
}

// 生命周期
onMounted(() => {
  // 初始化数据
  users.value = generateMockUsers()
  // 初始化行拖拽排序
  initRowDrag()
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
    name: '',
    email: '',
    role: 'employee',
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

// 处理文件上传
const handleFileChange = (fileObj) => {
  file.value = fileObj.raw
  handleImportExcel()
}

// 导入Excel
const handleImportExcel = async () => {
  if (!file.value) {
    return
  }
  
  try {
    loading.value = true
    const data = await importExcel(file.value)
    
    if (data.length === 0) {
      ElMessage.warning(t('user.importNoData'))
      return
    }
    
    // 处理导入的数据
    const newUsers = data.map(item => ({
      id: users.value.length + 1 + data.indexOf(item),
      username: item.username || item.用户名 || '',
      name: item.name || item.姓名 || '',
      email: item.email || item.邮箱 || '',
      role: item.role || item.角色 || 'employee',
      status: item.status || item.状态 || 'active',
      createdAt: new Date().toISOString().split('T')[0]
    }))
    
    users.value = [...users.value, ...newUsers]
    ElMessage.success(t('user.importSuccess', { count: newUsers.length }))
  } catch (error) {
    ElMessage.error(t('user.importFailed') + ': ' + error.message)
  } finally {
    loading.value = false
    file.value = null
  }
}

// 导出Excel
const handleExportExcel = () => {
  try {
    const headers = [
      { key: 'id', title: 'ID' },
      { key: 'username', title: '用户名' },
      { key: 'name', title: '姓名' },
      { key: 'email', title: '邮箱' },
      { key: 'role', title: '角色' },
      { key: 'status', title: '状态' },
      { key: 'createdAt', title: '创建时间' }
    ]
    
    // 转换角色和状态为中文
    const exportData = users.value.map(user => ({
      ...user,
      role: getRoleName(user.role),
      status: user.status === 'active' ? t('user.active') : t('user.inactive')
    }))
    
    exportExcel(exportData, '用户数据.xlsx', headers)
    ElMessage.success(t('user.exportSuccess'))
  } catch (error) {
    ElMessage.error(t('user.exportFailed') + ': ' + error.message)
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

/* 行拖拽样式 */
:deep(.sortable-ghost) {
  opacity: 0.5;
  background: #f0f0f0;
}

:deep(.sortable-chosen) {
  background: #ecf5ff !important;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

:deep(.sortable-drag) {
  opacity: 0.8;
  background: #ecf5ff !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

:deep(.sortable-highlight) {
  background: #ffeaa7 !important;
  transition: background 0.2s;
}
</style>