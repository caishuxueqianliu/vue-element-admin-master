import VueRouter from 'vue-router'
import Router from 'vue-router'
//const Login = () => import(/* webpackChunkName: "login_home_welcome" */ './components/Login.vue')

 const login=()=>import ('./pages/login.vue') 
const Home =()=>import( './pages/Home.vue')
const Welcome =()=>import( './pages/Welcome.vue')
const User =()=>import( './pages/User.vue')
const Roles =()=>import( './pages/Roles.vue')
const Rights =()=>import( './pages/Rights.vue')
const Cate =()=>import( './pages/goods/Cate.vue')
const Goods =()=>import( './pages/goods/Goods.vue')
const Params =()=>import( './pages/goods/Params.vue')
const Add =()=>import( './pages/goods/Add.vue')
const Order =()=>import( './pages/Order.vue')
const Reports =()=>import( './pages/Reports.vue')

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
                   {path:'/params',component:Params},
                   {path:'/goods/add',component:Add},
                   {path:'/orders',component:Order},
                   {path:'/reports',component:Reports}]
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

 
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => {return err})
}
export default router  
        