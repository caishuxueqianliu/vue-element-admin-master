import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n
Vue.use(ElementUI)

import Vuex from 'vuex'
Vue.use(Vuex)

import Vueresource from 'vue-resource'
Vue.use(Vueresource)

import VueRouter from 'vue-router'
import router from './router.js'
Vue.use(VueRouter)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
router,
  	
}).$mount('#app')
