import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import TreeTable from 'vue-table-with-tree-grid'
//import './plugins/element.js'
// import Timeline from './plugins/timeline/index.js'
// import TimelineItem from './plugins/timeline-item/index.js'
// import './plugins/timeline/timeline.css';
// import './plugins/timeline-item/timeline-item.css';
// Vue.use(Timeline)
// Vue.use(TimelineItem)
import{Message,Steps} from 'element-ui'
import{Tooltip} from 'element-ui'
Vue.use(ElementUI)
Vue.use(Tooltip)
Vue.use(Steps)

Vue.prototype.$message=Message


// import TreeTable from 'vue-table-with-tree-grid'
// Vue.use(TreeTable)
import TreeTable from 'vue-table-with-tree-grid'
Vue.component('tree-table', TreeTable)

import './assets/css/global.css'
import Vuex from 'vuex'
Vue.use(Vuex)

Vue.filter('dateFormat', function(originVal){
        const dt=new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`

})

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// require styles 导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 将富文本编辑器，注册为全局可用的组件
Vue.use(VueQuillEditor)


import axios from 'axios'

//axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'
 axios.defaults.baseURL='https://renoblog.xyz/api/private/v1/'

// 导入 NProgress 包对应的JS和CSS
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
// 简单配置
NProgress.inc(0.2)
NProgress.configure({ easing: 'ease', speed: 500, showSpinner: false })
// 在 request 拦截器中，展示进度条 NProgress.start()
axios.interceptors.request.use(config => {
  // console.log(config)
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 在最后必须 return config
  return config
})
// 在 response 拦截器中，隐藏进度条 NProgress.done()
axios.interceptors.response.use(config => {
  NProgress.done()
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
