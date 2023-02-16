import { MetaNameAllPrice } from '@/api/wxcore'
import { Decimal } from 'decimal.js-light'
import { defineStore } from 'pinia'
import { useUserStore } from './user'

interface MetaNameState {
  MetaNameFeePerYear: {
    third: number
    four: number
    five: number
  }
}
export const useMetaNameStore = defineStore('metaname', {
  state: () =>
    <MetaNameState>{
      MetaNameFeePerYear: {
        third: 0,
        four: 0,
        five: 0,
      },
    },
  getters: {},
  actions: {
    getMetaNameAllPrice: function() {
      return new Promise<void>(async resolve => {
        const userStore = useUserStore()
        const res = await MetaNameAllPrice(userStore.user?.metaId).catch(error => {
          ElMessage.error(error.message)
        })
        if (res) {
          // @ts-ignore
          this.MetaNameFeePerYear.third = new Decimal(
            res.Prices.find(item => item.meta_name_len === 3)!.usd
          )
            .div(100)
            .toNumber()
          // @ts-ignore
          this.MetaNameFeePerYear.four = new Decimal(
            res.Prices.find(item => item.meta_name_len === 4)!.usd
          )
            .div(100)
            .toNumber()
          // @ts-ignore
          this.MetaNameFeePerYear.five = new Decimal(
            res.Prices.find(item => item.meta_name_len === 5)!.usd
          )
            .div(100)
            .toNumber()
          resolve()
        }
      })
    },
  },
})
