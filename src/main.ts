// import 'amfe-flexible/index.js' // 自适应插件
import { createApp } from 'vue'
import App from './App.vue'
import 'normalize.css/normalize.css'
import 'element-plus/packages/theme-chalk/src/base.scss'
import './index.scss'
import { router, routerHistory } from '@/router'
import { ElLoading } from 'element-plus'
import { createI18n } from 'vue-i18n'
import messages from '@intlify/vite-plugin-vue-i18n/messages'

// languages
const i18n = createI18n({
    locale: 'zh', // set locale
    legacy: false,
    globalInjection: true,
    messages
})


createApp(App).use(router).use(ElLoading).use(i18n).mount('#app')
