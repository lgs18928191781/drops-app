import { router } from '@/router'
import { useUserStore } from '@/stores/user'
import { ElMessageBox } from 'element-plus'

import { isApp, isIosApp, useRootStore } from '@/stores/root'
import { openLoading } from './util'
import { SDK } from './sdk'
import { Network } from './wallet/hd-wallet'
import { usePostTagStore } from '@/stores/buzz/tag'

let loading: any
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  const rootStore = useRootStore()

  // talk之间的页面跳转不处理
  const isTalkRoutes = (route: any) => route.name === 'talkChannel' || route.name === 'talkAtMe'
  if (isTalkRoutes(to) && isTalkRoutes(from)) return next()

  loading = openLoading()
  // 设置页面标题
  document.title = `${to.meta.title ? to.meta.title + ' - ' : ''}` + import.meta.env.VITE_AppName

  if (to.name === 'register' && userStore.isAuthorized) {
    // 用户已登陆时，先退出登录
    await userStore.logout(to)
    next()
  }

  // 获取换算费率
  if (!rootStore.isGetedExchangeRate) {
    rootStore.getExchangeRate()
  }

  if (!rootStore.isCertedMetaIds.length) {
    rootStore.setSystemConfig()
  }

  if (userStore.showWallet) {
    // App 未获取用户信息，先去获取用户信息
    if (!userStore.isAuthorized && isApp) {
      await userStore.showWallet.appSetUserInfo()
    }
  }

  if (!userStore.showWallet) {
    userStore.$patch({ wallet: new SDK(Network.testnet) })
  }

  if (userStore.isAuthorized) {
    // 用户已登录但未初始化sdk 里面钱包， 则去 初始化 sdk 里面的钱包
    if (!userStore.showWallet.isInitSdked) {
      await userStore.showWallet.initWallet()
    }

    // 没有拿用户实名信息时， 先要去拿用户实名信息
    if (!userStore.isGetedKycInfo) {
      // todo: 暂时注释掉
      // await userStore.setKycInfo()
    }

    //  设置是否是否测试用户
    if (!userStore.isSetedisTestUser) {
      // todo:暂时注释掉
      // await userStore.setIsTestUser()
    }

    // 检查用户的token
    if (!isApp) {
      await userStore.checkUserToken(to.fullPath)
    }
  }

  //  buzz 页面先获取一次 postTag 信息
  if (to.path.indexOf('/buzz') !== -1) {
    const postTagStroe = usePostTagStore()
    if (postTagStroe.list.length <= 0) {
      await postTagStroe.getPostTags()
    }
  }

  // 检查跳转 路由是否有权限
  const isAuth = to.meta?.isAuth ? to.meta?.isAuth : false
  if (isAuth) {
    if (isIosApp && userStore.user!.flag) {
      next()
    } else {
      if (userStore.isAuthorized) {
        next()
      } else {
        if (loading) loading.close()
        if (from.meta.isAuth || from.fullPath === '/') {
          next('/')
        }
        rootStore.$patch({
          isShowLogin: true,
        })
      }
    }
  } else {
    next()
  }
})

router.beforeResolve(() => {
  if (loading) loading.close()
})

// router.afterEach((to, from, failure) => {
//   console.log(window.history)
//   debugger
// })
