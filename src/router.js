import VueRouter from 'vue-router'


import login from './components/login.vue'
var router = new VueRouter({
  routes: [
         {path:'/',redirect:'/login'},
     { path: '/login', component: login },
          
  ]

})
// export const constantRoutes = [
//   {
//     path: '/login',
//     component: () => import('@/components/login.vue'),
//     hidden: true
//   }]
// 把路由对象暴露出去
export default router