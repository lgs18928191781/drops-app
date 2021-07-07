// import 'amfe-flexible/index.js' // 自适应插件
// import './rem'
import { createApp } from 'vue'
import App from './App.vue'
import 'normalize.css/normalize.css'
import 'element-plus/packages/theme-chalk/src/base.scss'
import './index.scss'
import { router, routerHistory } from '@/router'
import { ElLoading, ElMessage } from 'element-plus'
import { createI18n } from 'vue-i18n'
import SvgIcon from '@/components/SvgIcon/SvgIcon.vue'
import * as filters from '@/utils/filters'
import messages from '@intlify/vite-plugin-vue-i18n/messages'

// languages
const i18n = createI18n({
    locale: 'zh', // set locale
    legacy: false,
    globalInjection: true,
    messages
})

const app = createApp(App)
// 挂载全局过滤器
app.config.globalProperties.$filters = {
    ...filters
}
app.component('SvgIcon', SvgIcon)
.use(router)
.use(ElLoading)
.use(i18n)
.mount('#app')
