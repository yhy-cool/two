<template>
  <div class="app-main">
    <router-view />
  </div>
</template>

<script setup>

</script>

<style scoped>
.app-main {
  padding: 20px;
  background-color: var(--bg-color) !important;
  min-height: calc(100vh - 60px);
  color: var(--text-color) !important;
}
</style>
 