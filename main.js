
// #ifndef VUE3
import Vue from 'vue'
import App from './App'
import _ from 'lodash'
import store from '@/store/store.js'
// 引入moment时间库
import moment from 'moment'
Vue.prototype.$moment = moment
import './utils/request.js'


Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App,
	store
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif