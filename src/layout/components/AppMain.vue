<template>
  <div class="app-main">
    <h2>欢迎来到后台管理系统</h2>
    <p>这是首页内容区域</p>
    <router-view />
  </div>
</template>

<script setup>

</script>

<style scoped>
.app-main {
  padding: 20px;
}

h2 {
  color: #333;
}

p {
  color: #666;
  margin-top: 10px;
}
</style>
 