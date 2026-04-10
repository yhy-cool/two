<template>
  <div class="drag-list-container">
    <h1>拖拽排序列表</h1>
    <el-card class="drag-list-card">
      <div class="drag-list" ref="dragList">
        <div 
          v-for="(item, index) in items" 
          :key="item.id"
          class="drag-item"
        >
          <span class="drag-handle">☰</span>
          <span class="item-content">{{ item.name }}</span>
        </div>
      </div>
      <div v-if="showSuccess" class="success-message">
        <el-alert
          title="修改成功"
          type="success"
          :closable="false"
          show-icon
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// 生成1到50的数据
const items = ref([])
for (let i = 1; i <= 50; i++) {
  items.value.push({ id: i, name: `项目${i}`, sort: i })
}

const dragList = ref(null)
const showSuccess = ref(false)

onMounted(() => {
  // 确保SortableJS加载
  if (typeof window.Sortable === 'undefined') {
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js'
    script.onload = () => {
      console.log('SortableJS加载成功')
      initDrag()
    }
    script.onerror = () => {
      console.error('SortableJS加载失败')
    }
    document.body.appendChild(script)
  } else {
    console.log('SortableJS已存在')
    initDrag()
  }
})

function initDrag() {
  if (dragList.value) {
    console.log('初始化拖拽功能')
    new window.Sortable(dragList.value, {
      handle: '.drag-handle',
      animation: 150,
      ghostClass: 'sortable-ghost',
      chosenClass: 'sortable-chosen',
      dragClass: 'sortable-drag',
      swapThreshold: 1,
      onStart: function(evt) {
        console.log('开始拖拽', evt)
      },
      onEnd: function(evt) {
        console.log('结束拖拽', evt)
        // 更新排序
        const movedItem = items.value.splice(evt.oldIndex, 1)[0]
        items.value.splice(evt.newIndex, 0, movedItem)
        
        // 更新sort字段
        items.value.forEach((item, index) => {
          item.sort = index + 1
        })
        
        // 显示成功消息
        showSuccess.value = true
        setTimeout(() => {
          showSuccess.value = false
        }, 2000)
      }
    })
  } else {
    console.error('dragList元素不存在')
  }
}
</script>

<style scoped>
.drag-list-container {
  padding: 20px;
}

.drag-list-card {
  margin-top: 20px;
}

.drag-list {
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  padding: 10px;
  min-height: 200px;
}

.drag-item {
  display: flex;
  align-items: center;
  padding: 12px;
  margin-bottom: 8px;
  background-color: #f5f7fa;
  border-radius: 4px;
  cursor: move;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.drag-item:hover {
  background-color: #ecf5ff;
  border-color: #c6e2ff;
}

.drag-handle {
  margin-right: 12px;
  font-size: 16px;
  color: #909399;
  cursor: grab;
  user-select: none;
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.drag-handle:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.drag-handle:active {
  cursor: grabbing;
  background-color: rgba(0, 0, 0, 0.2);
}

.item-content {
  flex: 1;
}

.success-message {
  margin-top: 20px;
}

/* SortableJS 样式 */
:deep(.sortable-ghost) {
  opacity: 0.5;
  background: #f0f0f0;
}

:deep(.sortable-chosen) {
  background: #333;
  color: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

:deep(.sortable-drag) {
  opacity: 0.8;
  background: #333;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
</style>