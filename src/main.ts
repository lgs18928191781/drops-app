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
import * as filters from '@/utils/filters'
import messages from '@intlify/vite-plugin-vue-i18n/messages'

import enLocale from 'element-plus/lib/locale/lang/en'
import zhLocale from 'element-plus/lib/locale/lang/zh-cn'
import ElementLocale from 'element-plus/lib/locale'


// languages
for (let i in messages){
    if (i === 'en') {
        messages[i].el = enLocale.el
    } else {
        messages[i].el = zhLocale.el
    }
}
console.log(messages)
const i18n = createI18n({
    locale: 'zh', // set locale
    fallbackLocale: enLocale.name,
    legacy: false,  
    globalInjection: true,
    messages: messages
})
// ElementLocale.i18n(i18n.global.t)

const app = createApp(App)

// 挂载全局过滤器
app.config.globalProperties.$filters = {
    ...filters
}
app.use(router) 
// .use(ElDatePicker)
.use(ElLoading)
.use(i18n)
.mount('#app')
