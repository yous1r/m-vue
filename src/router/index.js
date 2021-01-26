import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  { path: '/login', component: () => import('@/views/Login') },
  {
    path: '/',
    component: () => import('@/layouts'),
    children: [
      { path: '/', component: () => import('@/views/Main') },
      { path: '/qa', component: () => import('@/views/Main/qa') },
      { path: '/movie', component: () => import('@/views/Main/movie') },
      { path: '/user', component: () => import('@/views/Main/user') }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
