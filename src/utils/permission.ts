import { router } from '@/router'
import { useUserStore } from '@/stores/user'
import { ElMessageBox } from 'element-plus'

import { isApp, isIosApp, useRootStore } from '@/stores/root'
import { openLoading } from './util'
import { SDK } from './sdk'
import { Network } from './wallet/hd-wallet'

let loading: any
router.beforeEach(async (to, from, next) => {
  const userStroe = useUserStore()
  const rootStore = useRootStore()
  loading = openLoading()
  // 设置页面标题
  document.title = `${to.meta.title ? to.meta.title + ' - ' : ''}` + import.meta.env.VITE_AppName

  if (to.name === 'register' && userStroe.isAuthorized) {
    // 用户已登陆时，先退出登录
    await userStroe.logout()
    next()
  }

  // 获取换算费率
  if (!rootStore.isGetedExchangeRate) {
    rootStore.getExchangeRate()
  }

  if (!rootStore.isCertedMetaIds.length) {
    rootStore.setSystemConfig()
  }
  if (userStroe.showWallet) {
    // App 未获取用户信息，先去获取用户信息
    if (!userStroe.isAuthorized && isApp) {
      await userStroe.showWallet.appSetUserInfo()
    }
  }

  if (!userStroe.showWallet) {
    userStroe.$patch({ wallet: new SDK(Network.testnet) })
  }

  if (userStroe.isAuthorized) {
    // 用户已登录但未初始化sdk 里面钱包， 则去 初始化 sdk 里面的钱包
    if (!userStroe.showWallet.isInitSdked) {
      await userStroe.showWallet.initWallet()
    }

    // 没有拿用户实名信息时， 先要去拿用户实名信息
    if (!userStroe.isGetedKycInfo) {
      // 暂时注释掉
      // await userStroe.setKycInfo()
    }

    //  设置是否是否测试用户
    if (!userStroe.isSetedisTestUser) {
      await userStroe.setIsTestUser()
    }

    // 检查用户的token
    if (!isApp) {
      await userStroe.checkUserToken(to.fullPath)
    }
  }

  // 检查跳转 路由是否有权限
  const isAuth = to.meta?.isAuth ? to.meta?.isAuth : false
  if (isAuth) {
    if (isIosApp && userStroe.user!.flag) {
      next()
    } else {
      if (userStroe.isAuthorized) {
        next()
      } else {
        if (loading) loading.close()
        const result = await ElMessageBox.confirm('请先登录再操作', '温馨提示', {
          confirmButtonText: '注册/登录',
          cancelButtonText: '取消',
          type: 'warning',
        }).catch(() => {
          if (loading) loading.close()
        })
        if (result === 'confirm') {
          next({ name: 'preLogin' })
        }
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
