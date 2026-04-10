import { createRouter, createWebHistory } from 'vue-router'

import Login from '../views/login/index.vue'
import Layout from '../layout/index.vue'
import UserList from '../views/users/UserList.vue'
import RoleList from '../views/users/RoleList.vue'
import PermissionList from '../views/users/PermissionList.vue'
import Dashboard from '../views/dashboard/index.vue'
import Profile from '../views/profile/index.vue'
import ExcelDemo from '../views/excel/ExcelDemo.vue'

const publicRoutes = [
  {
    path: '/',
    component: Layout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: '/users/list'
      },
      {
        path: 'users/list',
        name: 'userList',
        component: UserList,
        meta: { requiresAuth: true }
      },
      {
        path: 'users/roles',
        name: 'roleList',
        component: RoleList,
        meta: { requiresAuth: true }
      },
      {
        path: 'users/permissions',
        name: 'permissionList',
        component: PermissionList,
        meta: { requiresAuth: true }
      },
      {
        path: 'dashboard',
        name: 'dashboard',
        component: Dashboard,
        meta: { requiresAuth: true }
      },
      {
        path: 'profile',
        name: 'profile',
        component: Profile,
        meta: { requiresAuth: true }
      },
      {
        path: 'excel',
        name: 'excelDemo',
        component: ExcelDemo,
        meta: { requiresAuth: true }
      }
    ]
  },
  {
    path: '/login',
    component: Login
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes: publicRoutes
})

// 路由守卫
router.beforeEach((to, from) => {
  // 检查路由是否需要鉴权
  if (to.meta.requiresAuth) {
    // 检查是否存在token
    const token = localStorage.getItem('token')
    if (token) {
      // 存在token，继续访问
      return true
    } else {
      // 不存在token，跳转到登录页面
      return '/login'
    }
  } else {
    // 不需要鉴权的路由，直接访问
    return true
  }
})

export default router

