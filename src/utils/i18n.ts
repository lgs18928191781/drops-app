

import { createI18n } from 'vue-i18n'
import enLocale from 'element-plus/lib/locale/lang/en'
import zhLocale from 'element-plus/lib/locale/lang/zh-cn'
import messages from '@intlify/vite-plugin-vue-i18n/messages'

const lang = localStorage.getItem('lang') || 'zh'
// languages
for (let i in messages){
    if (i === 'en') {
        messages[i].el = enLocale.el
    } else {
        messages[i].el = zhLocale.el
    }
}
const i18n = createI18n({
    locale: lang, // set locale
    fallbackLocale: enLocale.name,
    legacy: false,  
    globalInjection: true,
    messages: messages
})

export default i18n