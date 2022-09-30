import { createApp } from 'vue'
import App from './App.vue'
import 'normalize.css/normalize.css'
import 'element-plus/theme-chalk/src/loading.scss'
import 'element-plus/theme-chalk/el-message.css'
import 'element-plus/theme-chalk/el-message-box.css'
import 'element-plus/theme-chalk/el-overlay.css'
import './index.scss'
import { router } from '@/router'
import * as filters from '@/utils/filters'
import i18n from '@/utils/i18n'
import { ElLoading } from 'element-plus'
import UserAvatar from '@/components/UserAvatar/UserAvatar.vue'
import './utils/permission' // 路由控制

const app = createApp(App)

// 挂载全局过滤器
app.config.globalProperties.$filters = {
  ...filters,
}

// 全局组件
app.component('UserAvatar', UserAvatar)

app
  .use(router)
  .use(ElLoading)
  .use(i18n)
  .mount('#app')
