import VueRouter from 'vue-router'


import login from './components/login.vue'
import Home from './components/Home.vue'
import Welcome from './components/Welcome.vue'
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
        children:[{path:'/welcome',component:Welcome}]
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

export default router