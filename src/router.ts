import { createRouter, createWebHistory, RouterView } from 'vue-router'
import Home from '@/views/Home.vue'
import Login from '@/views/Login.vue'
import { useStore, Action, Mutation } from '@/store/index'
import { ElMessage } from 'element-plus'
import i18n from '@/utils/i18n'
import { SdkType } from 'sdk/src/emums'
import { debug } from 'console'
const store = useStore()
console.log('import.meta.env.PROD', import.meta.env.PROD)
export const routerHistory = createWebHistory()
export const router = createRouter({
  history: routerHistory,
  strict: true,
  routes: [
    { path: '/', component: Home },
    { path: '/login', name: 'login', component: Login },
  ],
  async scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      // TODO: check if parent in common that works with alias
      if (to.matched.every((record, i) => from.matched[i] !== record)) return { left: 0, top: 0 }
    }
    // leave scroll as it is by not returning anything
    // https://github.com/Microsoft/TypeScript/issues/18319
    return false
  },
})

// const delay = (t: number) => new Promise(resolve => setTimeout(resolve, t))

// remove trailing slashes
// router.beforeEach((to, from, next) => {
//   if (/.\/$/.test(to.path)) {
//     to.meta.redirectCode = 301
//     next(to.path.replace(/\/$/, ''))
//   } else next()
//   // next()
// })

// router.beforeEach(async (to, from, next) => {
//   // console.log(`Guard from ${from.fullPath} to ${to.fullPath}`)
//   if (to.params.id === 'no-name') return next(false)

//   const time = Number(to.query.delay)
//   if (time > 0) {
//     console.log('⏳ waiting ' + time + 'ms')
//     to.meta.waitedFor = time
//     await delay(time)
//   }
//   next()
// })

router.beforeEach(async (to, from, next) => {
  if (!store.state.sdk) {
    store.commit(Mutation.SETSDK, undefined)
  }

  // app
  const isApp = store.state.isApp
  if (isApp) {
    // 设置app环境
    if (store.state.sdk?.type !== SdkType.App) store.state.sdk?.changeSdkType(SdkType.App)
    //  没有用户信息， 也没有正在加载用户信息, 则去获取用户信息
    if (!store.state.userInfo && !store.state.userInfoLoading) {
      store.dispatch(Action.getUserInfo)
    }
  } else {
    // web
    const token = store.state.token
    if (token) {
      // 检查环境变量
      if (store.state.sdk?.type === SdkType.Null) {
        const appType = window.localStorage.getItem('appType')
        if (appType && appType !== '') store.state.sdk?.changeSdkType(parseInt(appType))
      }

      // 检查token 过期先刷新token, 没过期直接用
      const now = new Date().getTime()
      if (token.expires_time && now >= token.expires_time) {
        await store.dispatch(Action.refreshToken)
      }
      // 有token 没有初始化sdk 就去初始化sdk
      if (!store.state.sdk?.isSdkFinish && !store.state.sdkInitIng) {
        store.dispatch(Action.initSdk)
      }
    } else {
      // 没有token
      const isAuth = to.meta && to.meta.isAuth ? to.meta.isAuth : false
      if (isAuth) {
        // 需要权限的提示先登陆且不给予跳转
        ElMessage.error(i18n.global.t('toLoginTip'))
        return
      }
    }
  }
  next()
})

// router.afterEach((to, from) => {
//   if (to.name === from.name && to.name === 'repeat') {
//     const toDepth = to.path.split('/').length
//     const fromDepth = from.path.split('/').length
//     to.meta.transition = toDepth < fromDepth ? 'slide-right' : 'slide-left'
//   }
// })

// router.afterEach((to, from) => {
//   // console.log(
//   //   `After guard: from ${from.fullPath} to ${
//   //     to.fullPath
//   //   } | location = ${location.href.replace(location.origin, '')}`
//   // )
// })

export function go(delta: number) {
  return new Promise((resolve, reject) => {
    function popStateListener() {
      clearTimeout(timeout)
    }
    window.addEventListener('popstate', popStateListener)

    function clearHooks() {
      removeAfterEach()
      removeOnError()
      window.removeEventListener('popstate', popStateListener)
    }

    // if the popstate event is not called, consider this a failure
    const timeout = setTimeout(() => {
      clearHooks()
      reject(new Error('Failed to use router.go()'))
      // using 0 leads to false positives
    }, 1)

    // setImmediate

    const removeAfterEach = router.afterEach((_to, _from, failure) => {
      clearHooks()
      resolve(failure)
    })
    const removeOnError = router.onError(err => {
      clearHooks()
      reject(err)
    })

    router.go(delta)
  })
}

// @ts-expect-error
window._go = go

router.beforeEach((to, from, next) => {
  // console.log('second guard')
  if (to.query.to) next(to.query.to as string)
  else next()
})

const dirLog = {
  '': '？',
  back: '⏪',
  forward: '⏩',
}
routerHistory.listen((to, from, info) => {
  console.log(`${dirLog[info.direction]} as a ${info.type}`)
})
