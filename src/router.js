import VueRouter from 'vue-router'


import login from './components/login.vue'
import Home from './components/Home.vue'
import Welcome from './components/Welcome.vue'
import User from './components/User.vue'
import Roles from './components/Roles.vue'
import Rights from './components/Rights.vue'
import Cate from './components/goods/Cate.vue'
import Goods from './components/goods/Goods.vue'
import Params from './components/goods/Params.vue'
// var router = new VueRouter({
//   routes: [
//      {path:'/',redirect:'/login'},
//      { path: '/login', component: login },
//       { path: '/home', component: We}
          
//   ]

// })
const router = new VueRouter({
  routes: [
     {path:'/',redirect:'/login'},
     { path: '/login', component: login },
      {
       path: '/home', component: Home,
        redirect:'/welcome',
        children:[{path:'/welcome',component:Welcome},
                {path:'/users',component:User},
                {path:'/roles',component:Roles},
                {path:'/rights',component:Rights},
                 {path:'/goods',component:Goods},
                  {path:'/categories',component:Cate},
                   {path:'/params',component:Params}]
     }
          
  ]

})
//挂载路由导航卫士
router.beforeEach((to,from,next)=>{
//to 将要访问的路径
//from 从哪个路径跳转而来
//next  一个函数 ，表示放行
// next() 放行  / next（'/login'）强制跳转
if(to.path ==='/login') return next()

//获取token
const tokenStr=window.sessionStorage.getItem('token')

if(!tokenStr) return next('/login')
next()




})
import Router from 'vue-router'
 
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
export default router