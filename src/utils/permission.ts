import { router } from '@/router'
import {
  checkUserToken,
  isAuthorized,
  isGetedKycInfo,
  isSetedisTestUser,
  setIsTestUser,
  setKycInfo,
  user,
  userLogout,
} from '@/stores/user'
import { ElMessageBox } from 'element-plus'

import {
  isApp,
  isIosApp,
  isSetedSystemConfig,
  marketDefalutClassify,
  setSystemConfig,
  setWallet,
  showWallet,
} from '@/stores/root'
import { openLoading } from './util'

let loading: any
router.beforeEach(async (to, from, next) => {
  loading = openLoading()
  if (to.path === '/genesis' && !to.params.genesis) {
    // 兼容旧路由，过渡一段时间后可删除
    next({
      name: 'genesis',
      params: {
        genesis: to.query.genesis,
        codehash: to.query.codehash,
      },
    })
  } else if (to.path === '/nft' && !to.params.genesis) {
    // 兼容旧路由，过渡一段时间后可删除
    next({
      name: 'nft',
      params: {
        genesis: to.query.genesis,
        codehash: to.query.codehash,
        tokenIndex: to.query.tokenIndex,
      },
    })
  } else if (to.name === 'market') {
    // market 跳转到对应分类页
    next({
      name: 'marketClassify',
      params: {
        classify: marketDefalutClassify.value,
      },
    })
  } else if (to.name === 'marketClassify' && to.params.classify === 'search' && !to.query.keyword) {
    const searchs: string[] = JSON.parse(localStorage.getItem('marketSearch')!)
    next({
      name: 'marketClassify',
      params: {
        classify: marketDefalutClassify.value,
      },
      query: {
        keyword: searchs[0],
      },
    })
  } else {
    // 设置页面标题
    document.title = `${to.meta.title ? to.meta.title + ' - ' : ''}` + import.meta.env.VITE_AppName

    // 获取系统配置信息
    if (!isSetedSystemConfig.value) {
      await setSystemConfig()
    }

    // if (isIosApp) {
    //   if (from.name === 'sale' && to.name === 'genesis') {
    //     to.meta.keepAlive = false
    //   } else {
    //     to.meta.keepAlive = true
    //   }
    // }

    if (to.name === 'register' && isAuthorized.value) {
      // 用户已登陆时，先退出登录
      userLogout('/register')
    }

    if (!showWallet.value) {
      setWallet()
    }

    if (showWallet.value) {
      // App 未获取用户信息，先去获取用户信息
      if (!isAuthorized.value && isApp) {
        await showWallet.value.appSetUserInfo()
      }
    }

    if (isAuthorized.value) {
      // 用户已登录但未初始化sdk 里面钱包， 则去 初始化 sdk 里面的钱包
      if (!showWallet.value!.isInitSdked) {
        await showWallet.value!.initWallet()
      }

      // 没有拿用户实名信息时， 先要去拿用户实名信息
      if (!isGetedKycInfo.value) {
        await setKycInfo()
      }

      //  设置是否是否测试用户
      if (!isSetedisTestUser.value) {
        await setIsTestUser()
      }

      // 修复有问题的账号
      // if (user.value!.metaId === 'null') {
      //   // @ts-ignore
      //   const wallet = toRaw(store.state.wallet)
      //   // @ts-ignore
      //   const result = await wallet!.initMetaIdNode({
      //     ...user.value,
      //     name: user.value?.phone
      //       ? user.value.phone
      //       : user.value?.email
      //       ? user.value.email
      //       : '新用户',
      //     appToken: user.value!.token!,
      //   })

      //   ElMessageBox.alert('账号修复成功，请重新登陆', '温馨提示', { showClose: false }).then(() => {
      //     userLogout()
      //   })
      // }

      // 检查用户的token
      if (!isApp) {
        await checkUserToken(to.fullPath)
      }
    }

    // 检查跳转 路由是否有权限
    const isAuth = to.meta?.isAuth ? to.meta?.isAuth : false
    if (isAuth) {
      if (isIosApp && user.value?.flag) {
        next()
      } else {
        if (isAuthorized.value) {
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
  }
})

router.beforeResolve(() => {
  if (loading) loading.close()
})

// router.afterEach((to, from, failure) => {
//   console.log(window.history)
//   debugger
// })
