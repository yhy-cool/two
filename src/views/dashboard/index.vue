<template>
  <div class="dashboard">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>数据可视化</span>
        </div>
      </template>
      
      <div class="dashboard-content">
        <p>数据可视化页面开发中...</p>
        <p>这里将展示各种数据图表和统计信息</p>
      </div>
    </el-card>
  </div>
</template>

<script setup>

</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dashboard-content {
  padding: 40px;
  text-align: center;
  color: #666;
}

.dashboard-content p {
  margin-bottom: 15px;
  font-size: 16px;
}
</style>