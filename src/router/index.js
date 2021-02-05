import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
import { Toast } from 'vant'
Vue.use(VueRouter)

// 解决跳转同一个

const routes = [
  { path: '/login', component: () => import('@/views/Login') },
  {
    path: '/',
    component: () => import('@/layouts'),
    children: [
      { path: '', component: () => import('@/views/Home') },
      { path: '/qa', component: () => import('@/views/Main/qa') },
      { path: '/movie', component: () => import('@/views/Main/movie') },
      { path: '/user', component: () => import('@/views/User/user') },
      { path: '/user/editInfo', component: () => import('@/views/User/editUserInfo') }
    ]
  },
  { path: '*', component: () => import('@/pages/404') }
]

const router = new VueRouter({
  routes
})

// 设置请求的时候出现的前置导航定向报错的问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}
// 注册前置导航,前置导航用于对于网页请求的预处理
// to: 去哪儿去
// from: 从哪儿来
// next: 放行
// 定义白名单
const whiteList = ['/login', '/404', '', '/', '/movie', '/qa']
router.beforeEach((to, from, next) => {
  const token = store.state?.token
  // 在白名单内或者有token直接放行
  if (whiteList.includes(to.path)) {
  // console.log(token)
    return next()
  }
  if (token) {
    if (!store.state?.userInfo) {
      store.dispath('getUserInfo')
      return next()
    }
    return next()
  }
  Toast.fail('请登录')
  // 定义登录之后回到先前页面
  next({
    path: '/login',
    query: {
      back: to.path
    }
  })
})

export default router
