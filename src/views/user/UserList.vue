<template>
  <div class="user-list">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>用户管理</span>
          <div class="header-actions">
            <el-button type="primary" @click="handleAddUser">
              <el-icon><Plus /></el-icon>
              添加用户
            </el-button>
            <el-button type="warning" @click="handleBatchDelete" :disabled="selectedUserIds.length === 0">
              <el-icon><Delete /></el-icon>
              批量删除
            </el-button>
            <el-button type="info" @click="handleExportExcel">
              <el-icon><Download /></el-icon>
              导出Excel
            </el-button>
          </div>
        </div>
      </template>
      
      <div class="search-bar">
        <el-input
          v-model="searchQuery"
          placeholder="搜索用户名或邮箱"
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
        :data="filteredUsers"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 'active' ? 'success' : 'danger'">
              {{ scope.row.status === 'active' ? '启用' : '冻结' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button size="small" @click="handleEditUser(scope.row)">
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
            <el-button size="small" type="danger" @click="handleDeleteUser(scope.row.id)">
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
            <el-button
              size="small"
              :type="scope.row.status === 'active' ? 'warning' : 'success'"
              @click="handleToggleStatus(scope.row.id, scope.row.status === 'active' ? 'inactive' : 'active')"
            >
              {{ scope.row.status === 'active' ? '冻结' : '启用' }}
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
      :title="isEdit ? '编辑用户' : '添加用户'"
      width="500px"
    >
      <el-form
        ref="userFormRef"
        :model="userForm"
        :rules="userRules"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" placeholder="请输入邮箱" type="email" />
        </el-form-item>
        <el-form-item label="密码" prop="password" v-if="!isEdit">
          <el-input v-model="userForm.password" placeholder="请输入密码" type="password" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="userForm.status">
            <el-radio label="active">启用</el-radio>
            <el-radio label="inactive">冻结</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSaveUser">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Delete, Download, Search, Edit } from '@element-plus/icons-vue'

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
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在3-20之间', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
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
        ElMessage.success('用户编辑成功')
      }
    } else {
      // 添加用户
      const newUser = {
        ...userForm.value,
        id: users.value.length + 1,
        createdAt: new Date().toISOString().split('T')[0]
      }
      users.value.push(newUser)
      ElMessage.success('用户添加成功')
    }
    
    dialogVisible.value = false
  } catch (error) {
    // 验证失败
    console.error('表单验证失败:', error)
  }
}

// 删除用户
const handleDeleteUser = (id) => {
  ElMessageBox.confirm('确定要删除该用户吗？', '删除确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    users.value = users.value.filter(user => user.id !== id)
    ElMessage.success('用户删除成功')
  }).catch(() => {
    // 取消删除
  })
}

// 批量删除
const handleBatchDelete = () => {
  if (selectedUserIds.value.length === 0) return
  
  ElMessageBox.confirm(`确定要删除选中的${selectedUserIds.value.length}个用户吗？`, '批量删除确认', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    users.value = users.value.filter(user => !selectedUserIds.value.includes(user.id))
    selectedUserIds.value = []
    ElMessage.success('批量删除成功')
  }).catch(() => {
    // 取消删除
  })
}

// 切换用户状态
const handleToggleStatus = (id, newStatus) => {
  const user = users.value.find(u => u.id === id)
  if (user) {
    user.status = newStatus
    ElMessage.success(`用户已${newStatus === 'active' ? '启用' : '冻结'}`)
  }
}

// 导出Excel
const handleExportExcel = () => {
  // 这里只添加按钮，不实现具体功能
  ElMessage.info('Excel导出功能开发中')
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