import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import{Message} from 'element-ui'
Vue.use(ElementUI)
Vue.prototype.$message=Message

import './assets/css/global.css'
import Vuex from 'vuex'
Vue.use(Vuex)



import axios from 'axios'

axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'
//请求拦截器
axios.interceptors.request.use(config=>{

config.headers.Authorization = window.sessionStorage.getItem('token')
return config
})

Vue.prototype.$http=axios

import VueRouter from 'vue-router'
import router from './router.js'
Vue.use(VueRouter)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
router,
  	
}).$mount('#app')
