import { SDK } from 'sdk'
export interface State {
  debug: boolean
  version: string
  isInitialized: boolean
  count: number
  token: null | Token
  userInfo: null | UserInfo
  userInfoLoading: boolean
  sdk: null | SDK
  sdkInitIng: boolean
  isApp: boolean
  pagination: Pagination
}

// @ts-ignore
const appMetaIdJs: null | MetaIdJs = window?.appMetaIdJsV2
  ? window?.appMetaIdJsV2
  : window?.appMetaIdJs
  ? window?.appMetaIdJs
  : null
if (appMetaIdJs) {
}

const versionString = import.meta.env.MODE === 'development' ? _APP_VERSION + '-dev' : _APP_VERSION
const tokenString = localStorage.getItem('token')
const token = tokenString ? JSON.parse(tokenString) : null

export const state: State = {
  debug: import.meta.env.MODE === 'development',
  version: versionString,
  isInitialized: false,
  count: 0,
  token,
  userInfo: null,
  userInfoLoading: false,
  sdkInitIng: false,
  // @ts-ignore
  isApp: window?.appMetaIdJsV2 || window?.appMetaIdJs ? true : false,
  // @ts-ignore
  sdk: window.appMetaIdJsV2 || window?.appMetaIdJs ? new Sdk() : null,
  // 分页参数
  pagination: {
    page: 1,
    pageSize: 12,
    loading: false,
    nothing: false,
  },
}
