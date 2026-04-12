<template>
  <div class="chart-container">
    <h3 class="chart-title">大区营销分布</h3>
    <div ref="chartRef" class="chart"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const chartRef = ref(null);
let chartInstance = null;

// 生成更自然的大区营销数据
const generateNaturalData = () => {
  const regions = ['华东区', '华北区', '华南区', '西南区', '东北区'];
  // 生成更自然的占比数据，确保总和为100%
  let values = [];
  let total = 0;
  
  // 生成前四个区域的随机占比
  for (let i = 0; i < regions.length - 1; i++) {
    // 每个区域的占比在5%到35%之间
    const value = Math.floor(Math.random() * 30) + 5;
    values.push(value);
    total += value;
  }
  
  // 最后一个区域的占比为100%减去前四个区域的总和
  values.push(100 - total);
  
  // 确保所有值都为正数
  if (values[values.length - 1] < 0) {
    // 如果最后一个值为负数，重新生成数据
    return generateNaturalData();
  }
  
  return { regions, values };
};

// 初始化图表
const initChart = () => {
  if (!window.echarts) return;
  
  chartInstance = window.echarts.init(chartRef.value);
  const { regions, values } = generateNaturalData();
  
  // 生成柔和的颜色数组
  const colors = ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#909399'];
  
  chartInstance.setOption({
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}%'
    },
    legend: {
      orient: 'horizontal',
      bottom: '0',
      textStyle: {
        fontSize: 12
      }
    },
    color: colors,
    series: [{
      name: '营销占比',
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 4,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: false
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '14',
          fontWeight: 'bold'
        },
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.2)'
        }
      },
      labelLine: {
        show: false
      },
      data: regions.map((region, index) => ({
        value: values[index],
        name: region
      }))
    }]
  });
};

// 响应式调整图表大小
const handleResize = () => {
  chartInstance?.resize();
};

// 生命周期钩子
onMounted(() => {
  // 确保ECharts加载完成
  if (window.echarts) {
    initChart();
  } else {
    // 动态加载ECharts
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js';
    script.onload = initChart;
    document.head.appendChild(script);
  }
  
  // 添加窗口 resize 事件监听
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  // 销毁图表实例
  chartInstance?.dispose();
  
  // 移除事件监听
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