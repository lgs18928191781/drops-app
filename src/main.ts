import { createApp } from 'vue'
import App from './App.vue'
import 'normalize.css/normalize.css'
import 'element-plus/lib/components/loading/style/index'
import 'element-plus/lib/components/message/style/index'
import 'element-plus/lib/components/message-box/style/index'
import 'element-plus/lib/components/overlay/style/index'
import 'element-plus/lib/components/drawer/style/index'
import 'element-plus/lib/components/switch/style/index'
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
import * as Sentry from '@sentry/vue'
import { BrowserTracing } from '@sentry/tracing'
import 'virtual:vite-plugin-sentry/sentry-config'

const app = createApp(App)
const head = createHead()

const dist = window.VITE_PLUGIN_SENTRY_CONFIG.dist
const release = window.VITE_PLUGIN_SENTRY_CONFIG.release
Sentry.init({
  app,
  dsn: 'https://93303d5ab3984aacac0e6e6382aaf3dd@sentry.show3.space/2',
  integrations: [
    new BrowserTracing({
      routingInstrumentation: Sentry.vueRouterInstrumentation(router),
      tracePropagationTargets: ['*'],
    }),
  ],
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
  dist,
  release,
})

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
