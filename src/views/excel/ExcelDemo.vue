<template>
  <div class="excel-demo">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>Excel导入导出演示</span>
        </div>
      </template>
      
      <div class="import-section">
        <h3>导入Excel</h3>
        <el-upload
          class="upload-demo"
          action=""
          :auto-upload="false"
          :on-change="handleFileChange"
          :show-file-list="false"
          accept=".xlsx,.xls"
        >
          <el-button type="primary">选择Excel文件</el-button>
        </el-upload>
        <el-button type="success" @click="importExcelData" :disabled="!file">导入数据</el-button>
      </div>
      
      <div class="export-section">
        <h3>导出Excel</h3>
        <el-button type="primary" @click="exportExcelData">导出数据</el-button>
      </div>
      
      <div class="data-section">
        <h3>数据预览</h3>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="name" label="姓名" width="180" />
          <el-table-column prop="age" label="年龄" width="180" />
          <el-table-column prop="email" label="邮箱" />
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { importExcel, exportExcel } from '@/utils/excel'

const file = ref(null)
const tableData = ref([
  { name: '张三', age: 18, email: 'zhangsan@example.com' },
  { name: '李四', age: 22, email: 'lisi@example.com' },
  { name: '王五', age: 30, email: 'wangwu@example.com' }
])

const handleFileChange = (fileObj) => {
  file.value = fileObj.raw
}

const importExcelData = async () => {
  if (!file.value) {
    return
  }
  
  try {
    const data = await importExcel(file.value)
    tableData.value = data
    file.value = null
    ElMessage.success('导入成功')
  } catch (error) {
    ElMessage.error('导入失败：' + error.message)
  }
}

const exportExcelData = () => {
  const headers = [
    { key: 'name', title: '姓名' },
    { key: 'age', title: '年龄' },
    { key: 'email', title: '邮箱' }
  ]
  exportExcel(tableData.value, '用户数据.xlsx', headers)
  ElMessage.success('导出成功')
}
</script>

<style scoped>
.excel-demo {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.import-section,
.export-section,
.data-section {
  margin-bottom: 30px;
}

.upload-demo {
  margin-right: 10px;
}

.data-section {
  margin-top: 40px;
}
</style>