import { createApp } from 'vue'
import App from './App.vue'
import 'normalize.css/normalize.css'
import 'element-plus/theme-chalk/src/loading.scss'
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-message-box.css'
import 'element-plus/theme-chalk/el-overlay.css'
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
import Icon from '@/components/Icon/Icon.vue'
import GlobalDialog from '@/components/GlobalDialog/index.vue'
const app = createApp(App)

// 挂载全局过滤器
app.config.globalProperties.$filters = {
  ...filters,
}

// 全局组件
app.component('UserAvatar', UserAvatar)
app.component('Image', Image)
app.component('Icon', Icon)
app.component('Dialog', GlobalDialog)

app
  .use(router)
  .use(ElLoading)
  .use(i18n)
  .mount('#app')
