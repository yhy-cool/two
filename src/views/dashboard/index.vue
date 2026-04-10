<template>
  <div class="dashboard">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>数据可视化</span>
        </div>
      </template>
      
      <div class="dashboard-content">
        <!-- 第一行：月累计收益 + 月金额分析 -->
        <div class="two-columns">
          <div class="left-column">
            <CumulativeProfitChart />
          </div>
          <div class="right-column">
            <DailyAmountChart />
          </div>
        </div>
        
        <!-- 第二行：日金额分析（占满整行） -->
        <div class="full-width-section">
          <DailyAmountBarChart />
        </div>
        
        <!-- 第三行：大区营销图示（饼图，占满整行） -->
        <div class="full-width-section">
          <RegionMarketingChart />
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import DailyAmountChart from './components/DailyAmountChart.vue';
import CumulativeProfitChart from './components/CumulativeProfitChart.vue';
import RegionMarketingChart from './components/RegionMarketingChart.vue';
import DailyAmountBarChart from './components/DailyAmountBarChart.vue';
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.full-width-section {
  width: 100%;
}

.two-columns {
  display: flex;
  gap: 20px;
}

.left-column,
.right-column {
  flex: 1;
}

@media (max-width: 768px) {
  .two-columns {
    flex-direction: column;
  }
}
</style>