<template>
  <div class="chart-container">
    <h3 class="chart-title">月累计收益</h3>
    <div class="profit-cards">
      <div class="profit-card">
        <div class="card-label">本月收益</div>
        <div class="card-value">¥{{ monthlyProfit.toLocaleString() }}</div>
      </div>
      <div class="profit-card highlighted">
        <div class="card-label">累计收益</div>
        <div class="card-value">¥{{ cumulativeProfit.toLocaleString() }}</div>
      </div>
      <div class="profit-card">
        <div class="card-label">月增长率</div>
        <div class="card-value growth">+{{ growthRate }}%</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// 生成月累计收益数据
const generateProfitData = () => {
  // 月收益数据
  const monthlyProfit = Math.round(85000 + Math.random() * 30000);
  
  // 累计收益
  const cumulativeProfit = Math.round(520000 + Math.random() * 100000);
  
  // 月增长率
  const growthRate = (Math.random() * 15 + 5).toFixed(1);
  
  return { monthlyProfit, cumulativeProfit, growthRate };
};

const { monthlyProfit, cumulativeProfit, growthRate } = generateProfitData();
</script>

<style scoped>
.chart-container {
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
}

.chart-title {
  margin-bottom: 20px;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 10px;
}

.profit-cards {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.profit-card {
  padding: 15px;
  background-color: #f9fafb;
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-left: 3px solid #e0e0e0;
  transition: all 0.3s ease;
}

.profit-card.highlighted {
  background-color: #f0f7ff;
  border-left-color: #409EFF;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.15);
}

.profit-card.highlighted .card-value {
  color: #409EFF;
  font-size: 20px;
}

.card-label {
  font-size: 14px;
  color: #666;
}

.card-value {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.card-value.growth {
  color: #67C23A;
}
</style>