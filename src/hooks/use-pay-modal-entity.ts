import { useUserStore } from '@/stores/user'
import { SdkPayType } from '@/enum'
import { h, render } from 'vue'
import i18n from '@/utils/i18n'
import { router } from '@/router'
import { useLayoutStore } from '@/stores/layout'
import GlobalPayConfirmModalVue from '@/components/PayModal/globalPayConfrim.vue'

export function usePayModalEntity() {
  function awaitPayConfrim(payType: SdkPayType, useAmount: number, balance: number) {
    return new Promise<boolean>((resolve, reject) => {
      const userStore = useUserStore()
      if (
        true
        // userStore.sdkPayConfirm[payType].visible ||
        // (!userStore.sdkPayConfirm[payType].visible &&
        //   userStore.sdkPayConfirm[payType].value < useAmount)
      ) {
        // 需要弹出确认框操作
        const divId = `global-pay-conirm-${new Date().getTime()}`
        const div = document.createElement('div')
        div.id = divId
        document.body.append(div)
        render(
          // @ts-ignore
          h(GlobalPayConfirmModalVue, {
            i18n: i18n.global,
            useAmount,
            balance,
            router,
            payType,

            onConfirm: () => {
              setTimeout(() => {
                document.getElementById(divId)?.remove()
              }, 500)
              resolve(true)
            },
            onCancel: () => {
              setTimeout(() => {
                document.getElementById(divId)?.remove()
              }, 500)
              resolve(false)
            },
          }),
          document.getElementById(divId)!
        )
      } else {
        // 不需要弹出 确认框操作
        resolve(true)
      }
    })
  }

  return {
    awaitPayConfrim,
  }
}
