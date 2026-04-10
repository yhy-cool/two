<template>
  <div class="role-list">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>{{ t('role.roleManagement') }}</span>
          <div class="header-actions">
            <el-button type="primary" @click="handleAddRole" v-if="canManageRoles">
              <el-icon><Plus /></el-icon>
              {{ t('role.addRole') }}
            </el-button>
          </div>
        </div>
      </template>
      
      <el-table
        ref="tableRef"
        v-loading="loading"
        :data="roles"
        style="width: 100%"
      >
        <el-table-column prop="id" :label="t('role.id')" width="80" />
        <el-table-column prop="name" :label="t('role.name')" />
        <el-table-column prop="description" :label="t('role.description')" />
        <el-table-column prop="createdAt" :label="t('role.createdAt')" width="180" />
        <el-table-column :label="t('role.actions')" width="150">
          <template #default="scope">
            <el-button size="small" @click="handleEditRole(scope.row)" v-if="canManageRoles">
              <el-icon><Edit /></el-icon>
              {{ t('role.edit') }}
            </el-button>
            <el-button size="small" type="danger" @click="handleDeleteRole(scope.row.id)" v-if="canManageRoles && scope.row.name !== 'admin'">
              <el-icon><Delete /></el-icon>
              {{ t('role.delete') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    
    <!-- 添加/编辑角色对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? t('role.editRole') : t('role.addRole')"
      width="500px"
    >
      <el-form
        ref="roleFormRef"
        :model="roleForm"
        :rules="roleRules"
        label-width="100px"
      >
        <el-form-item :label="t('role.name')" prop="name">
          <el-input v-model="roleForm.name" :placeholder="t('role.enterName')" />
        </el-form-item>
        <el-form-item :label="t('role.description')" prop="description">
          <el-input v-model="roleForm.description" :placeholder="t('role.enterDescription')" type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">{{ t('role.cancel') }}</el-button>
          <el-button type="primary" @click="handleSaveRole">{{ t('role.save') }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'

const { t } = useI18n()

// 模拟角色数据
const generateMockRoles = () => {
  return [
    {
      id: 1,
      name: 'admin',
      description: '系统管理员，拥有所有权限',
      createdAt: new Date().toISOString().split('T')[0]
    },
    {
      id: 2,
      name: 'manager',
      description: '部门经理，拥有管理员工的权限',
      createdAt: new Date().toISOString().split('T')[0]
    },
    {
      id: 3,
      name: 'employee',
      description: '普通员工，只能管理自己的信息',
      createdAt: new Date().toISOString().split('T')[0]
    }
  ]
}

// 状态管理
const roles = ref(generateMockRoles())
const loading = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const tableRef = ref(null)
const roleForm = ref({
  id: '',
  name: '',
  description: ''
})
const roleFormRef = ref(null)

// 获取当前用户信息
const getCurrentUser = () => {
  const userInfoStr = localStorage.getItem('userInfo')
  return userInfoStr ? JSON.parse(userInfoStr) : null
}

// 权限控制
const canManageRoles = ref(() => {
  const currentUser = getCurrentUser()
  return currentUser && currentUser.role === 'admin'
})

// 表单验证规则
const roleRules = ref({
  name: [
    { required: true, message: t('role.nameRequired'), trigger: 'blur' }
  ],
  description: [
    { required: true, message: t('role.descriptionRequired'), trigger: 'blur' }
  ]
})

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
              const movedItem = roles.value.splice(evt.oldIndex, 1)[0]
              roles.value.splice(evt.newIndex, 0, movedItem)
              
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
  roles.value = generateMockRoles()
  // 按id从小到大排序
  roles.value.sort((a, b) => a.id - b.id)
  // 初始化行拖拽排序
  initRowDrag()
})

// 添加角色
const handleAddRole = () => {
  isEdit.value = false
  roleForm.value = {
    id: '',
    name: '',
    description: ''
  }
  dialogVisible.value = true
}

// 编辑角色
const handleEditRole = (role) => {
  isEdit.value = true
  roleForm.value = { ...role }
  dialogVisible.value = true
}

// 保存角色
const handleSaveRole = async () => {
  if (!roleFormRef.value) return
  
  try {
    await roleFormRef.value.validate()
    
    if (isEdit.value) {
      // 编辑角色
      const index = roles.value.findIndex(r => r.id === roleForm.value.id)
      if (index !== -1) {
        roles.value[index] = { ...roleForm.value }
        ElMessage.success(t('role.editSuccess'))
      }
    } else {
      // 添加角色
      const newRole = {
        ...roleForm.value,
        id: roles.value.length + 1,
        createdAt: new Date().toISOString().split('T')[0]
      }
      roles.value.push(newRole)
      ElMessage.success(t('role.addSuccess'))
    }
    
    dialogVisible.value = false
  } catch (error) {
    // 验证失败
    console.error('表单验证失败:', error)
  }
}

// 删除角色
const handleDeleteRole = (id) => {
  ElMessageBox.confirm(t('role.deleteConfirm'), t('role.deleteTitle'), {
    confirmButtonText: t('role.confirm'),
    cancelButtonText: t('role.cancel'),
    type: 'warning'
  }).then(() => {
    roles.value = roles.value.filter(role => role.id !== id)
    ElMessage.success(t('role.deleteSuccess'))
  }).catch(() => {
    // 取消删除
  })
}
</script>

<style scoped>
.role-list {
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

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* 拖拽样式 */
:deep(.sortable-ghost) {
  opacity: 0.6;
  background: #f0f9ff;
}

:deep(.sortable-chosen) {
  background: #e6f7ff;
}

:deep(.sortable-drag) {
  opacity: 0.8;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

:deep(.sortable-highlight) {
  background: #ffeaa7 !important;
  transition: background 0.2s;
}
</style>