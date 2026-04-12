<template>
  <div class="chart-container">
    <h3 class="chart-title">日金额分析</h3>
    <div ref="chartRef" class="chart"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const chartRef = ref(null);
let chartInstance = null;

// 生成日金额数据
const generateDailyData = () => {
  const days = ['1日', '2日', '3日', '4日', '5日', '6日', '7日', '8日', '9日', '10日', 
                '11日', '12日', '13日', '14日', '15日', '16日', '17日', '18日', '19日', '20日',
                '21日', '22日', '23日', '24日', '25日', '26日', '27日', '28日', '29日', '30日'];
  
  // 生成自然的日金额数据
  const dailyAmounts = [];
  let previousAmount = 2800;
  
  days.forEach(() => {
    // 每天的波动范围在-25%到+30%之间
    const change = (Math.random() - 0.25) * 0.55;
    const newAmount = Math.round(previousAmount * (1 + change));
    dailyAmounts.push(Math.max(newAmount, 1000));
    previousAmount = newAmount;
  });
  
  // 调整最后一天的值，使总和接近月累计收益的日均分摊值（约17333/天）
  const targetDailyAvg = 17333;
  const currentTotal = dailyAmounts.reduce((sum, val) => sum + val, 0);
  const lastDayAdjusted = dailyAmounts[29] + (targetDailyAvg * 30 - currentTotal);
  dailyAmounts[29] = Math.max(lastDayAdjusted, 1000);
  
  return { days, dailyAmounts };
};

// 初始化图表
const initChart = () => {
  if (!window.echarts) return;
  
  chartInstance = window.echarts.init(chartRef.value);
  const { days, dailyAmounts } = generateDailyData();
  
  chartInstance.setOption({
    tooltip: {
      trigger: 'axis',
      formatter: '{b}: ¥{c}',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#409EFF',
      borderWidth: 1,
      textStyle: {
        color: '#333'
      }
    },
    xAxis: {
      type: 'category',
      data: days,
      axisLabel: {
        rotate: 45,
        interval: 4,
        color: '#666'
      },
      axisLine: {
        lineStyle: {
          color: '#e0e0e0'
        }
      },
      axisTick: {
        show: false
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#666'
      },
      axisLine: {
        lineStyle: {
          color: '#e0e0e0'
        }
      },
      splitLine: {
        lineStyle: {
          color: '#f0f0f0',
          type: 'dashed'
        }
      }
    },
    series: [{
      data: dailyAmounts,
      type: 'bar',
      itemStyle: {
        color: new window.echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#409EFF' },
          { offset: 1, color: '#66B1FF' }
        ]),
        // 去掉圆角
        borderRadius: 0,
        shadowBlur: 8,
        shadowColor: 'rgba(64, 158, 255, 0.3)',
        shadowOffsetY: 2
      },
      barWidth: '50%',
      emphasis: {
        itemStyle: {
          color: new window.echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#66B1FF' },
            { offset: 1, color: '#91CAFF' }
          ])
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