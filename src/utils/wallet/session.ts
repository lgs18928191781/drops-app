import { useUserStore } from '@/stores/user'
import { mvc } from 'meta-contract'
import i18n from '../i18n'

export class Session {
  addressSessionKey = 'AddressPath'
  addressPaths: { address: string; path: number }[] = window.sessionStorage.getItem(
    this.addressSessionKey
  )
    ? JSON.parse(window.sessionStorage.getItem(this.addressSessionKey)!)
    : []
  constructor() {}

  getAddressPath(address: string) {
    const userStore = useUserStore()
    let item = this.addressPaths.find(item => item.address === address)
    if (item) {
      return item
    } else {
      for (let i = 0; i <= 150; i++) {
        const _address = userStore
          .showWallet!.wallet!.wallet.deriveChild(`m/0/${i}`)
          .privateKey.toAddress()
          .toString()
        if (_address === address) {
          item = {
            address: address,
            path: i,
          }
          this.addressPaths.push(item)
          window.sessionStorage.setItem(this.addressSessionKey, JSON.stringify(this.addressPaths))
          break
        }
      }
      if (item) {
        return item
      } else {
        // @ts-ignore
        throw new Error(i18n.global.t('PathMoreThan150'))
      }
    }
  }
}
