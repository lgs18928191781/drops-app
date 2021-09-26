import { Action, store } from '@/store'
import { ElMessage } from 'element-plus'
import i18n from '@/utils/i18n'

export function checkSdkStatus() {
  return new Promise<void>((resolve, reject) => {
    const token = store.state.token
    if (!token) {
      ElMessage.warning(i18n.global.t('toLoginTip'))
      reject()
    } else {
      if (store.state.sdkInitIng) {
        ElMessage.warning(i18n.global.t('loginingTip'))
        reject()
      } else {
        if (!store.state.sdk || !store.state.sdk.isSdkFinish) {
          ElMessage.warning(i18n.global.t('toLoginTip'))
          reject()
        }
      }
    }
    resolve()
  })
}

export function getMetaFileUrl(metafile: string) {
  if (typeof metafile !== 'string') return ''
  metafile = metafile.replace('metafile://', '')
  if (metafile === '') return ''
  return `${import.meta.env.VITE_ShowMan}/metafile/${metafile}`
}
