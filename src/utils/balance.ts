import { GetBalance } from '@/api/aggregation'
import { useUserStore } from '@/stores/user'
import { Decimal } from 'decimal.js-light'

export function eth(params?: { isPolygon?: boolean }) {
  return new Promise<number>(async resolve => {
    const userStore = useUserStore()
    if (userStore.user!.evmAddress) {
      const res = await GetBalance(userStore.user!.evmAddress! || userStore.user?.ethAddress,)
      resolve(res)
    } else {
      resolve(0)
    }
  })
}

export function polygon() {
  return eth({ isPolygon: true })
}
