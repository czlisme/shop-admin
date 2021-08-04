import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import Axios from 'axios'
import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
// 导入对应的 nprogress对应的js 和css
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
Vue.use(VueQuillEditor)
Vue.config.productionTip = false
Vue.prototype.$http = Axios
//请求拦截设置请求头
Axios.interceptors.request.use(async config => {
  NProgress.start()
  //读取token
  const token = await window.sessionStorage.getItem('token')
  //为authorization字段添加token
  config.headers.authorization = token
  return config
}, error => {
  console.log('请求拦截报错:', error)
  return Promise.reject(error)
})
Axios.interceptors.response.use(async config => {
  NProgress.done()
  return config
})
Axios.defaults.baseURL = 'api/api/private/v1'
// 注册全局时间过滤器
Vue.filter('dateFormat', function(originVal){
    const dt = new Date(originVal)
    const y = dt.getFullYear()
    const m = (dt.getMonth() + 1 + '').padStart(2, '0')
    console.log()
    const d = (dt.getDate() + '').padStart(2, '0')
    const hh = (dt.getHours() + '').padStart(2, '0')
    const mm = (dt.getMinutes() + '').padStart(2, '0')
    const ss = (dt.getSeconds() + '').padStart(2, '0')
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
const vm = new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
// new Vue({
//   router,
//   render: h => h(Sakura)
// }).$mount('#app')
export default vm
