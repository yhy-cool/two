<template>
  <div class="draggable-table-demo">
    <h1>可拖拽表格演示</h1>
    
    <el-card class="demo-card">
      <template #header>
        <div class="card-header">
          <span>Element Plus 表格</span>
        </div>
      </template>
      <DraggableTable
        table-library="element-plus"
        v-model:data="elementTableData"
        @sortChange="handleSortChange"
        ref="elementTableRef"
      />
    </el-card>
    
    <el-card class="demo-card" style="margin-top: 20px;">
      <template #header>
        <div class="card-header">
          <span>Ant Design Vue 表格</span>
        </div>
      </template>
      <DraggableTable
        table-library="ant-design"
        v-model:data="antTableData"
        @sortChange="handleAntSortChange"
        ref="antTableRef"
      />
    </el-card>
    
    <el-card class="demo-card" style="margin-top: 20px;">
      <template #header>
        <div class="card-header">
          <span>排序结果</span>
        </div>
      </template>
      <div class="sort-result">
        <h3>Element Plus 表格排序顺序：</h3>
        <p>{{ elementTableData.map(item => item.id).join(', ') }}</p>
        
        <h3 style="margin-top: 20px;">Ant Design Vue 表格排序顺序：</h3>
        <p>{{ antTableData.map(item => item.id).join(', ') }}</p>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DraggableTable from '../components/DraggableTable.vue'

// Element Plus 表格数据
const elementTableData = ref([
  { id: 1, username: 'user1', name: '用户1', email: 'user1@example.com', role: '普通用户', status: 'active', createdAt: '2024-01-01' },
  { id: 2, username: 'user2', name: '用户2', email: 'user2@example.com', role: '管理员', status: 'active', createdAt: '2024-01-02' },
  { id: 3, username: 'user3', name: '用户3', email: 'user3@example.com', role: '普通用户', status: 'inactive', createdAt: '2024-01-03' },
  { id: 4, username: 'user4', name: '用户4', email: 'user4@example.com', role: '管理员', status: 'active', createdAt: '2024-01-04' },
  { id: 5, username: 'user5', name: '用户5', email: 'user5@example.com', role: '普通用户', status: 'active', createdAt: '2024-01-05' }
])

// Ant Design Vue 表格数据
const antTableData = ref([
  { id: 1, username: 'user1', name: '用户1', email: 'user1@example.com', role: '普通用户', status: 'active', createdAt: '2024-01-01' },
  { id: 2, username: 'user2', name: '用户2', email: 'user2@example.com', role: '管理员', status: 'active', createdAt: '2024-01-02' },
  { id: 3, username: 'user3', name: '用户3', email: 'user3@example.com', role: '普通用户', status: 'inactive', createdAt: '2024-01-03' },
  { id: 4, username: 'user4', name: '用户4', email: 'user4@example.com', role: '管理员', status: 'active', createdAt: '2024-01-04' },
  { id: 5, username: 'user5', name: '用户5', email: 'user5@example.com', role: '普通用户', status: 'active', createdAt: '2024-01-05' }
])

// 表格引用
const elementTableRef = ref()
const antTableRef = ref()

// 处理排序变化
function handleSortChange(data) {
  console.log('Element Plus 表格排序变化:', data)
}

function handleAntSortChange(data) {
  console.log('Ant Design Vue 表格排序变化:', data)
}
</script>

<style scoped>
.draggable-table-demo {
  padding: 20px;
}

.demo-card {
  margin-top: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sort-result {
  padding: 10px;
}
</style>