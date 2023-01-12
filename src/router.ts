import { createRouter, createWebHistory, RouterView } from 'vue-router'
const NotFoundPage = () => import('@/views/404.vue')
import { ElMessage } from 'element-plus'
import i18n from '@/utils/i18n'
import { useUserStore } from './stores/user'
export const routerHistory = createWebHistory()
export const router = createRouter({
  history: routerHistory,
  strict: true,
  routes: [
    {
      path: '/',
      redirect: () => {
        const userStroe = useUserStore()
        if (userStroe.isAuthorized) {
          return { name: 'buzzIndex' }
        } else {
          return { name: 'home' }
        }
      },
      children: [],
    },

    // { path: '/', name: 'home', redirect: '/buzz' },
    { path: '/home', name: 'home', component: () => import('@/views/home/index.vue') },
    {
      path: '/buzz',
      name: 'buzz',
      component: () => import('@/views/buzz/Layout.vue'),
      // meta: { keepAlive: true },
      redirect: () => {
        const userStroe = useUserStore()
        if (userStroe.isAuthorized) {
          return { name: 'buzzIndex' }
        } else {
          return { name: 'buzzRecommend' }
        }
      },
      children: [
        {
          path: 'index',
          name: 'buzzIndex',
          component: () => import('@/views/buzz/Index.vue'),
          meta: { isAuth: true },
        },
        {
          path: 'recommend',
          name: 'buzzRecommend',
          component: () => import('@/views/buzz/Recomment.vue'),
          // meta: { keepAlive: true },
        },
        {
          path: 'tx/:txId',
          name: 'buzzDetail',
          component: () => import('@/views/buzz/Detail.vue'),
        },
        {
          path: 'tag/:tagId',
          name: 'buzzTag',
          component: () => import('@/views/buzz/Tag.vue'),
        },
        {
          path: 'topic/:topic',
          name: 'buzzTopic',
          component: () => import('@/views/buzz/Topic.vue'),
        },
      ],
    },
    {
      path: '/nft',
      name: 'nft',
      component: () => import('@/views/nft/Layout.vue'),
      redirect: {
        name: 'nftIndex',
      },
      children: [
        {
          path: 'index',
          name: 'nftIndex',
          component: () => import('@/views/nft/Index.vue'),
        },
        {
          path: 'issue',
          name: 'nftIssue',
          component: () => import('@/views/nft/Issue.vue'),
        },
        {
          path: 'genesis',
          name: 'nftGenesis',
          component: () => import('@/views/nft/Genesis.vue'),
        },
        {
          path: 'detail/:chain/:genesis/:codehash/:tokenIndex',
          name: 'nftDetail',
          component: () => import('@/views/nft/NftDetail.vue'),
        },
      ],
    },

    // ShowTalk
    {
      path: '/talk',
      name: 'talk',
      meta: { isAuth: true },
      redirect:
        '/talk/channels/123/88a92826842757cade6e84378df9db88526578c3bce7b8cb6348b7f1f9598d0a',
      // component: () => import('@/views/talk/Index.vue'),
    },
    {
      path: '/talk/channels/@me/the-void',
      name: 'talkAtMeDefault',
      component: () => import('@/views/talk/AtMeDefault.vue'),
      meta: { isAuth: true },
    },
    {
      path: '/talk/channels/@me/:channelId?',
      name: 'talkAtMe',
      component: () => import('@/views/talk/AtMe.vue'),
      meta: { isAuth: true },
    },

    {
      path: '/talk/channels/:communityId',
      component: () => import('@/views/talk/Channel.vue'),
      meta: { isAuth: true },
      children: [
        {
          path: ':channelId',
          name: 'talkChannel',
          component: () => import('@/views/talk/components/ChannelBody.vue'),
        },
      ],
    },
    // {
    //   path: '/nftDetail/:genesisId/:codehash/:tokenIndex',
    //   name: 'nftDetail',
    //   component: () => import('@/views/nft/NftDetail.vue'),
    // },

    // pay
    {
      path: '/pay',
      name: 'pay',
      component: () => RouterView,
      meta: { isHideHeader: true },
      children: [
        {
          path: 'result',
          name: 'payResult',
          component: () => import('@/views/pay/Result.vue'),
        },
      ],
    },
    // user
    {
      path: '/user/:metaId',
      name: 'user',
      component: () => import('@/views/user/User.vue'),
      redirect: {
        name: 'userBuzz',
      },
      children: [
        {
          path: 'buzz',
          name: 'userBuzz',
          component: () => import('@/views/user/Buzz.vue'),
        },
        {
          path: 'nft',
          name: 'userNFT',
          component: () => import('@/views/user/NFT.vue'),
        },
      ],
    },

    // MetaName
    {
      path: '/metaname',
      name: 'metaName',
      component: () => import('@/views/metaname/Layout.vue'),
      redirect: '/metaname/index',
      children: [
        {
          path: 'index',
          name: 'metaNameIndex',
          component: () => import('@/views/metaname/Index.vue'),
        },
        {
          path: 'mine',
          name: 'metaNameMine',
          meta: { isAuth: true },
          component: () => RouterView,
          redirect: { name: 'mineIndex' },
          children: [
            {
              path: 'index',
              name: 'mineIndex',
              component: () => import('@/views/metaname/mine/Mine.vue'),
            },
            {
              path: 'metaname/:metaName',
              name: 'mineMetaName',
              component: () => import('@/views/metaname/mine/MetaName.vue'),
            },
          ],
        },
        {
          path: 'market',
          name: 'metaNameMarket',
          component: () => import('@/views/metaname/Market.vue'),
        },
        {
          path: 'search',
          name: 'metaNameSearch',
          component: () => RouterView,
          redirect: '/metaname/search/index',
          children: [
            {
              path: 'index',
              name: 'metaNameSearchIndex',
              component: () => import('@/views/metaname/search/Search.vue'),
            },
            {
              path: 'register/:metaName/:orderId/:platform/:productType/:metaFile',
              name: 'metaNameSearchRegister',
              meta: { isAuth: true },
              component: () => import('@/views/metaname/search/Register.vue'),
            },
          ],
        },
      ],
    },

    // 404
    { path: '/404', name: '404', component: NotFoundPage },
    {
      path: '/:pathMatch(.*)',
      redirect: '/404',
    },
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
    return {
      top: 0,
    }
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
