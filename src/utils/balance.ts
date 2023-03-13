import { GetBalance } from '@/api/aggregation'
import { useUserStore } from '@/stores/user'
import { Decimal } from 'decimal.js-light'

export function eth(params?: { isPolygon?: boolean }) {
  return new Promise<number>(async resolve => {
    const userStore = useUserStore()
    if (userStore.user!.evmAddress) {
      const res = await GetBalance({
        chain: params?.isPolygon
          ? import.meta.env.VITE_POLYGON_CHAIN
          : import.meta.env.VITE_ETH_CHAIN,
        address: userStore.user!.evmAddress! || userStore.user?.ethAddress,
      })
      if (res?.code === 0) {
        resolve(res.data.balance)
      }
    } else {
      resolve(0)
    }
  })
}

export function polygon() {
  return eth({ isPolygon: true })
}
