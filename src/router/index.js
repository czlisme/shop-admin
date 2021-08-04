import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/User.vue'
import Rights from '../components/right/Right.vue'
import Roles from '../components/right/Role.vue'
import Goodlist from '../components/good/Goodlist.vue'
import Goodsorts from '../components/good/Goodsort.vue'
import Sortparams from '../components/good/Sortparam.vue'
import Addgood from '../components/good/Addgood.vue'
import Orders from '../components/order/Order.vue'
import Data from '../components/dataTotal/Data.vue'
Vue.use(VueRouter)
const routes = [{
  path: '/',
  redirect: '/login'
}, {
  path: '/login',
  component:Login
},
{
  path:'/home',
  component:Home,
  redirect:'/welcome',
  children:[
    {
      path:'/welcome',
      component:Welcome
    },
    {
      path:'/users',
      component: Users
    },
    {
      path:'/roles',
      component:Roles
    },
    {
      path:'/rights',
      component: Rights
    },
    {
      path:'/goods',
      component: Goodlist,
    },
    {
      path:'/categories',
      component: Goodsorts
    },
    {
      path:'/params',
      component: Sortparams
    },
    {
      path:'/orders',
      component: Orders
    },
    {
      path:'/reports',
      component: Data
    },
    {
      path:'/goods/add',
      component:Addgood
    }
  ]
}]
const router = new VueRouter({
  routes
})
// 挂载路由守卫
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数 表示放行
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})
export default router
