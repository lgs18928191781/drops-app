import MetaIdJs from "metaidjs"
export interface State {
  debug: boolean
  version: string
  isInitialized: boolean
  count: number
  token: null | Token
  userInfo: null | UserInfo
  userInfoLoading: boolean
  metaidjs: null | MetaIdJs
  metaidjsInitIng: boolean
}

export interface Token {
  access_token: string
  token_type: string
  refresh_token: string
  expires_in: number
  expires_time: number
}
export interface UserInfo {
  showId: string
  metaId: string
  xpub: string
  address: string
  pubKey: string
  infoTxId: string
  protocolTxId: string
  name: string
  nameEncrypt: string
  phone: string
  phoneEncrypt: string
  email: string
  emailEncrypt: string
  headUrl: string
  headUrlEncrypt: string
  avatarTxId: string
  timestamp: number
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
  metaidjs: null,
  metaidjsInitIng: false
}
