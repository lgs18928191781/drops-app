<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { useStore, Mutation, Action } from '@/store/index'
const route = useRoute()
const router = useRouter()
const store = useStore()
const code = route.query.code
const state = route.query.state
import { SdkType } from 'sdk/src/emums'
let appType = SdkType.Metaidjs
if (state && state === 'jssdk') appType = SdkType.Dotwallet
store.state.sdk?.changeSdkType(appType)
debugger
if (code && typeof code === 'string') {
  store.state.sdk?.getToken({ code })?.then((res: Token) => {
    if (res && res.access_token) {
      store.commit(Mutation.SETTOKEN, res)
      store.dispatch(Action.initSdk)
      router.replace('/')
    }
  })
  /* GetToken({
    code,
    grant_type: 'authorization_code',
    redirect_uri: `${host}${redirectPath}`,
    scope: 'app',
    client_id: env.VITE_AppId,
    client_secret: env.VITE_AppSecret,
  }).then((res) => {
    if (res && res.access_token) {
      store.commit(Mutation.SETTOKEN, {
        ...res,
        expires_time: new Date().getTime() + res.expires_in - 60 * 1000,
      })
      store.dispatch(Action.initSdk)
      router.replace('/')
    }
  }) */
} else {
  router.replace('/')
}
</script>
