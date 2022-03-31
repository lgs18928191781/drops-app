import { router } from '@/router'
import { Action, Mutation, store } from '@/store'
import { ElMessage } from 'element-plus'
import { SdkType } from 'sdk/src/emums'
import i18n from './i18n'

router.beforeEach(async (to, from, next) => {
  if (!store.state.sdk) {
    store.commit(Mutation.SETSDK, undefined)
  }

  // app
  const isApp = store.state.sdk?.isApp
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
      if (!store.state.sdk?.isSdkFinish && !store.state.sdk?.initIng) {
        store.dispatch(Action.initSdk)
      }
    } else {
      // 没有token
      const isAuth = to.meta && to.meta.isAuth ? to.meta.isAuth : false
      if (isAuth) {
        // 需要权限的提示先登陆且不给予跳转
        ElMessage.error(i18n.global.t('toLoginTip'))
        next('/')
      }
    }
  }
  next()
})
