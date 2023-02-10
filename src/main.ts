import { createApp } from 'vue'
import App from './App.vue'
import 'normalize.css/normalize.css'
import 'element-plus/theme-chalk/src/loading.scss'
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-message-box.css'
import 'element-plus/theme-chalk/el-overlay.css'
import 'element-plus/theme-chalk/el-drawer.css'
import 'element-plus/theme-chalk/el-switch.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import './index.scss'

import { router } from '@/router'
import * as filters from '@/utils/filters'
import i18n from '@/utils/i18n'
import { ElLoading } from 'element-plus'
import UserAvatar from '@/components/UserAvatar/UserAvatar.vue'
import './utils/permission' // 路由控制
import 'virtual:svg-icons-register'
import Image from '@/components/Image/Image.vue'
import UserName from '@/components/UserName/UserName.vue'
import Icon from '@/components/Icon/Icon.vue'
import GlobalDialog from '@/components/GlobalDialog/index.vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query' // TanStack Query
import { createHead } from '@vueuse/head'

const app = createApp(App)
const head = createHead()

// 挂载全局过滤器
// @ts-ignore
app.config.globalProperties.$filters = {
  ...filters,
}
const pinia = createPinia()

// 全局组件
app.component('UserAvatar', UserAvatar)
app.component('Image', Image)
app.component('UserName', UserName)
app.component('Icon', Icon)
// app.component('Dialog', GlobalDialog)

app
  .use(pinia)
  .use(router)
  .use(ElLoading)
  .use(i18n)
  .use(VueQueryPlugin)
  .use(head)
  .mount('#app')
