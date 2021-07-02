<script setup lang="ts">
import { useRouter, useRoute, onBeforeRouteUpdate } from 'vue-router'
import metaidjs from 'metaidjs'
import { useStore, Mutation, Action } from '@/store/index'

onBeforeRouteUpdate((to, from, next) => {
    debugger
})
const route = useRoute()
const router = useRouter()
const store = useStore()
const code = route.query.code
const env = import.meta.env
const host = env.VITE_Hosts || ''
const redirectPath = env.VITE_RedirectPath || '/'
import { GetToken } from '@/api'
if  (code) {
    GetToken({
        code,
        grant_type: 'authorization_code',
        redirect_uri: `${host}${redirectPath}`,
        scope: 'app',
        client_id: env.VITE_AppId,
        client_secret: env.VITE_AppSecret,
    }).then((res) => {
        if (res && res.access_token){
            store.commit(Mutation.SETTOKEN, { ...res, expires_time: new Date().getTime() + res.expires_in - (60 * 1000)})
            store.dispatch(Action.initSdk)
            router.replace('/')
        }
    })
} else {
    router.replace('/')
}
</script>