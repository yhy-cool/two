<template>
  <div class="navbar">
    <div class="navbar-left">
      <span class="logo">后台管理系统</span>
    </div>
    <div class="navbar-right">
      <el-dropdown>
        <span class="user">
          <el-icon><i class="el-icon-user"></i></el-icon>
          <span>用户名</span>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>个人中心</el-dropdown-item>
            <el-dropdown-item>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>

</script>

<style scoped>
.navbar {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.logo {
  font-size: 18px;
  font-weight: bold;
}

.user {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
 