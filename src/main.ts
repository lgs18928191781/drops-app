import { createApp } from 'vue'
import App from './App.vue'
import 'normalize.css/normalize.css'
import './index.scss'
import { router } from '@/router'
// import { ElLoading, ElMessage, ElDatePicker } from 'element-plus'
// import ElementPlus from 'element-plus'
import * as filters from '@/utils/filters'
import i18n from '@/utils/i18n'
import { ElLoading } from 'element-plus'
import { registerSW } from 'virtual:pwa-register'

// pwa auto update
const updateSW = registerSW({
  onOfflineReady() {},
})

const app = createApp(App)

// 挂载全局过滤器
app.config.globalProperties.$filters = {
  ...filters,
}

app
  .use(router)
  .use(ElLoading)
  // .use(ElementPlus, {
  //   i18n: i18n.global.t,
  // })
  .use(i18n)
  .mount('#app')
