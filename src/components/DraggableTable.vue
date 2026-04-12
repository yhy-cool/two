<template>
  <div class="draggable-table-container">
    <!-- Element Plus 表格 -->
    <el-table
      v-if="tableLibrary === 'element-plus'"
      :data="tableData"
      style="width: 100%"
      row-key="id"
    >
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="username" label="用户名" width="120" />
      <el-table-column prop="name" label="姓名" width="120" />
      <el-table-column prop="email" label="邮箱" />
      <el-table-column prop="role" label="角色" width="100" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="scope">
          <el-tag :type="scope.row.status === 'active' ? 'success' : 'danger'">
            {{ scope.row.status === 'active' ? '活跃' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createdAt" label="创建时间" width="180" />
      <el-table-column label="操作" width="120">
        <template #default="scope">
          <el-button size="small" type="primary">编辑</el-button>
          <el-button size="small" type="danger">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column label="拖拽" width="60" fixed="right">
        <template #default="scope">
          <span class="drag-handle" :data-index="scope.$index">☰</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- Ant Design Vue 表格 -->
    <a-table
      v-else-if="tableLibrary === 'ant-design'"
      :data-source="tableData"
      :columns="antColumns"
      row-key="id"
      style="width: 100%"
    >
      <template #status="{ text }">
        <a-tag :color="text === 'active' ? 'green' : 'red'">
          {{ text === 'active' ? '活跃' : '禁用' }}
        </a-tag>
      </template>
      <template #action="{ record }">
        <div>
          <a-button type="primary" size="small">编辑</a-button>
          <a-button type="danger" size="small" style="margin-left: 8px">删除</a-button>
        </div>
      </template>
      <template #drag="{ record, index }">
        <span class="drag-handle" :data-index="index">☰</span>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'

// 定义表格数据类型
interface TableData {
  id: number
  username: string
  name: string
  email: string
  role: string
  status: 'active' | 'inactive'
  createdAt: string
}

// 定义组件属性
interface Props {
  tableLibrary?: 'element-plus' | 'ant-design'
  data?: TableData[]
}

// 定义组件事件
interface Emits {
  (e: 'update:data', data: TableData[]): void
  (e: 'sortChange', data: TableData[]): void
}

const props = withDefaults(defineProps<Props>(), {
  tableLibrary: 'element-plus',
  data: () => []
})

const emit = defineEmits<Emits>()

// 表格数据
const tableData = ref<TableData[]>(props.data.length > 0 ? props.data : generateMockData())

// 生成模拟数据
function generateMockData(): TableData[] {
  const data: TableData[] = []
  for (let i = 1; i <= 10; i++) {
    data.push({
      id: i,
      username: `user${i}`,
      name: `用户${i}`,
      email: `user${i}@example.com`,
      role: i % 2 === 0 ? '管理员' : '普通用户',
      status: i % 3 === 0 ? 'inactive' : 'active',
      createdAt: new Date(Date.now() - i * 86400000).toISOString().split('T')[0]
    })
  }
  return data
}

// Ant Design Vue 列定义
const antColumns = computed(() => [
  { title: 'ID', dataIndex: 'id', width: 80 },
  { title: '用户名', dataIndex: 'username', width: 120 },
  { title: '姓名', dataIndex: 'name', width: 120 },
  { title: '邮箱', dataIndex: 'email' },
  { title: '角色', dataIndex: 'role', width: 100 },
  { 
    title: '状态', 
    dataIndex: 'status', 
    width: 100,
    scopedSlots: {
      customRender: 'status'
    }
  },
  { title: '创建时间', dataIndex: 'createdAt', width: 180 },
  { 
    title: '操作', 
    width: 120,
    scopedSlots: {
      customRender: 'action'
    }
  },
  { 
    title: '拖拽', 
    width: 60,
    fixed: 'right',
    scopedSlots: { 
      customRender: 'drag' 
    }
  }
])

// 初始化拖拽功能
onMounted(() => {
  // 直接引入 SortableJS
  if (typeof window.Sortable === 'undefined') {
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js'
    script.onload = initDrag
    script.onerror = () => {
      console.error('SortableJS加载失败')
    }
    document.body.appendChild(script)
  } else {
    initDrag()
  }
})

// 监听数据变化
watch(() => props.data, (newData) => {
  if (newData && newData.length > 0) {
    tableData.value = newData
  }
}, { deep: true })

// 初始化拖拽
function initDrag() {
  console.log('开始初始化拖拽功能')
  // 等待DOM渲染完成
  setTimeout(() => {
    let tableBody = null
    
    if (props.tableLibrary === 'element-plus') {
      tableBody = document.querySelector('.el-table__body tbody')
      console.log('Element Plus 表格体元素:', tableBody)
    } else if (props.tableLibrary === 'ant-design') {
      tableBody = document.querySelector('.ant-table-tbody')
      console.log('Ant Design Vue 表格体元素:', tableBody)
    }
    
    if (tableBody) {
      // 确保SortableJS已加载
      if (typeof window.Sortable !== 'undefined') {
        console.log('SortableJS已加载，开始初始化')
        try {
          new window.Sortable(tableBody, {
            handle: '.drag-handle',
            animation: 150,
            ghostClass: 'sortable-ghost',
            chosenClass: 'sortable-chosen',
            dragClass: 'sortable-drag',
            onStart: function(evt) {
              console.log('开始拖拽:', evt)
            },
            onEnd: function(evt) {
              console.log('结束拖拽:', evt)
              // 更新数据顺序
              const movedItem = tableData.value.splice(evt.oldIndex, 1)[0]
              tableData.value.splice(evt.newIndex, 0, movedItem)
              
              // 触发事件
              emit('update:data', tableData.value)
              emit('sortChange', tableData.value)
              console.log('数据已更新:', tableData.value)
            }
          })
          console.log('拖拽功能初始化成功')
        } catch (error) {
          console.error('初始化SortableJS失败:', error)
        }
      } else {
        console.error('SortableJS未加载')
      }
    } else {
      console.error('未找到表格体元素')
    }
  }, 300) // 增加延迟时间，确保DOM完全渲染
}

// 暴露方法
defineExpose({
  getSortedData: () => tableData.value
})
</script>

<style scoped>
.draggable-table-container {
  width: 100%;
  overflow-x: auto;
}

.drag-handle {
  cursor: grab;
  user-select: none;
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.3s ease;
  color: #909399;
  font-size: 16px;
}

.drag-handle:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.drag-handle:active {
  cursor: grabbing;
  background-color: rgba(0, 0, 0, 0.2);
}

/* SortableJS 样式 */
:deep(.sortable-ghost) {
  opacity: 0.5;
  background: #f0f0f0;
}

:deep(.sortable-chosen) {
  background: #333 !important;
  color: white !important;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

:deep(.sortable-drag) {
  opacity: 0.8;
  background: #333 !important;
  color: white !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
</style>