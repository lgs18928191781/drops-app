import { SDK } from 'sdk'
export interface State {
  debug: boolean
  version: string
  token: null | Token
  userInfo: null | UserInfo
  userInfoLoading: boolean
  sdk: null | SDK
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
  token,
  userInfo: null,
  userInfoLoading: false,
  sdk: null,
  // 分页参数
  pagination: {
    page: 1,
    pageSize: 12,
    loading: false,
    nothing: false,
  },
}
