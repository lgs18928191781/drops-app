import { WalletPath } from '@/enum'
import { getLocalAccount } from '@/utils/util'
import { HdWallet, hdWalletFromAccount } from '@/utils/wallet/hd-wallet'
import { defineStore } from 'pinia'

interface BsvState {
  wallet?: HdWallet
}
export const useBsvStore = defineStore('bsv', {
  state: () =>
    <BsvState>{
      wallet: undefined,
    },
  getters: {},
  actions: {
    initWallet: function() {
      return new Promise<void>(async (resolve, reject) => {
        if (this.wallet) {
          resolve()
        } else {
          try {
            const account = getLocalAccount()
            const walletObj = await hdWalletFromAccount(
              {
                ...account.userInfo,
                password: account.password,
              },
              import.meta.env.VITE_NET_WORK,
              WalletPath.BSV
            )
            this.wallet = new HdWallet(walletObj.wallet, {
              metaSvApi: import.meta.env.VITE_BSV_META_SV_API,
            })
            resolve()
          } catch (error) {
            reject(error)
          }
        }
      })
    },
  },
})
