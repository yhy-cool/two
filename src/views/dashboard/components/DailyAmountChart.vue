<template>
  <div class="chart-container">
    <h3 class="chart-title">月金额分析</h3>
    <div ref="chartRef" class="chart"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const chartRef = ref(null);
let chartInstance = null;

// 生成月金额数据（12个月，总和约等于月累计收益）
const generateMonthlyData = () => {
  const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
  
  // 生成自然的月金额数据，有淡旺季波动
  const monthlyAmounts = [];
  let previousAmount = 45000;
  
  months.forEach((month, index) => {
    // 淡旺季因素：1-3月和7-9月相对较低，4-6月和10-12月相对较高
    let seasonalFactor = 1;
    if (index >= 0 && index <= 2) seasonalFactor = 0.7; // 第一季度淡季
    else if (index >= 3 && index <= 5) seasonalFactor = 1.2; // 第二季度旺季
    else if (index >= 6 && index <= 8) seasonalFactor = 0.8; // 第三季度淡季
    else seasonalFactor = 1.3; // 第四季度旺季
    
    // 每月波动
    const change = (Math.random() - 0.3) * 0.4;
    const newAmount = Math.round(previousAmount * (1 + change) * seasonalFactor);
    monthlyAmounts.push(Math.max(newAmount, 20000));
    previousAmount = monthlyAmounts[monthlyAmounts.length - 1];
  });
  
  // 调整最后一个月的值，使其总和接近目标值
  const targetTotal = 520000;
  const currentTotal = monthlyAmounts.reduce((sum, val) => sum + val, 0);
  const lastMonthAdjusted = monthlyAmounts[11] + (targetTotal - currentTotal);
  monthlyAmounts[11] = Math.max(lastMonthAdjusted, 20000);
  
  return { months, monthlyAmounts };
};

// 初始化图表
const initChart = () => {
  if (!window.echarts) return;
  
  chartInstance = window.echarts.init(chartRef.value);
  const { months, monthlyAmounts } = generateMonthlyData();
  
  chartInstance.setOption({
    tooltip: {
      trigger: 'axis',
      formatter: '{b}: ¥{c}'
    },
    xAxis: {
      type: 'category',
      data: months,
      axisLine: {
        lineStyle: {
          color: '#e0e0e0'
        }
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        lineStyle: {
          color: '#e0e0e0'
        }
      },
      splitLine: {
        lineStyle: {
          color: '#f0f0f0'
        }
      }
    },
    series: [{
      data: monthlyAmounts,
      type: 'line',
      smooth: true,
      lineStyle: {
        color: '#409EFF',
        width: 2
      },
      itemStyle: {
        color: '#409EFF'
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0, color: 'rgba(64, 158, 255, 0.1)'
          }, {
            offset: 1, color: 'rgba(64, 158, 255, 0.05)'
          }]
        }
      }
    }]
  });
};

// 响应式调整图表大小
const handleResize = () => {
  chartInstance?.resize();
};

// 生命周期钩子
onMounted(() => {
  if (window.echarts) {
    initChart();
  } else {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js';
    script.onload = initChart;
    document.head.appendChild(script);
  }
  
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  chartInstance?.dispose();
  window.removeEventListener('resize', handleResize);
});
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

.chart {
  width: 100%;
  height: 300px;
}
</style>