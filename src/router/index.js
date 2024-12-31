import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import { useUserStore } from '@/stores/index'
//创建路由实例
//1 .createWebHashHistoryhash模式
//2 .createWebHistoryhistory模式
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/login', component: () => import('@/views/login/loginPage.vue') }, //登录页
    {
      path: '/',
      component: () => import('@/views/layout/layoutContainer.vue'),
      redirect: '/article/manage', //重定向到
      children: [
        {
          path: '/article/manage',
          component: () => import('@/views/article/ArticleManage.vue'),
        },
        {
          path: '/article/channel',
          component: () => import('@/views/article/ArticleChannel.vue'),
        },
        {
          path: '/user/profile',
          component: () => import('@/views/user/UserProfile.vue'),
        },
        {
          path: '/user/avatar',
          component: () => import('@/views/user/UserAvatar.vue'),
        },
        {
          path: '/user/password',
          component: () => import('@/views/user/UserPassword.vue'),
        },
      ],
    },
  ],
})

//登录访问拦截 =>vue3默认是直接放行
//根据返回值决定，是放行还是拦截
//返回值
//1 undefined/true 直接放行
//2 false 拦回from的地址页面
//3 具体路径或路径对象，拦截到对应的地址
//  '/login' {name:'login}
router.beforeEach((to) => {
  //如果没有token，且访问的是非登录页，拦截到登录，其他情况正常放行
  const userStore = useUserStore()
  //如果token不存在
  if (!userStore.token && to.path !== '/login') return '/login'

  //其他情况正常放行
  return true
})

export default router
