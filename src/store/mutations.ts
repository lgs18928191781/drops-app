import { MutationTree } from 'vuex'
import { State } from './state'
import { SDK } from 'sdk'
import { SdkType } from 'sdk/src/emums'
import { env } from 'process'

export enum Mutation {
  SETTOKEN = 'SETTOKEN',
  SETUSERINFO = 'SETUSERINFO',
  SETUSERINFOLOADING = 'SETUSERINFOLOADING',
  LOGOUT = 'LOGOUT',
  SETSDK = 'SETSDK',
}

export type Mutations<S = State> = {
  [Mutation.SETTOKEN](state: S, payload: Token): void
  [Mutation.SETUSERINFO](state: S, payload: UserInfo): void
  [Mutation.SETUSERINFOLOADING](state: S, payload: boolean): void
  [Mutation.LOGOUT](state: S): void
  [Mutation.SETSDK](state: S): void
}

export const mutations: MutationTree<State> & Mutations = {
  [Mutation.SETTOKEN](state: State, payload: Token) {
    localStorage.setItem('token', JSON.stringify(payload))
    state.token = payload
  },
  [Mutation.SETUSERINFO](state: State, payload: UserInfo) {
    state.userInfo = payload
    state.userInfoLoading = false
  },
  [Mutation.SETUSERINFOLOADING](state: State, payload: boolean) {
    state.userInfoLoading = payload
  },
  [Mutation.LOGOUT](state: State) {
    localStorage.removeItem('token')
    localStorage.removeItem('appType')
    state.token = null
    state.userInfo = null
    state.sdk = null
  },
  [Mutation.SETSDK](state: State) {
    state.sdk = new SDK({
      metaIdTag: import.meta.env.VITE_MetaIdTag,
      showmoneyApi: import.meta.env.VITE_WalletApi,
      getAccessToken: () => {
        return state.token?.access_token
      },
      callBackFail: () => {
        return new Promise(resolve => {
          resolve()
        })
      },
      appOptions: {
        clientId: import.meta.env.VITE_AppId,
        clientSecret: import.meta.env.VITE_AppSecret,
      },
      metaidjsOptions: {
        baseUri: import.meta.env.VITE_AuthUrl,
        oauthSettings: {
          clientId: import.meta.env.VITE_AppId,
          clientSecret: import.meta.env.VITE_AppSecret,
          redirectUri: import.meta.env.VITE_Hosts + import.meta.env.VITE_RedirectPath,
        },
      },
      dotwalletOptions: {
        clientID: import.meta.env.VITE_DotWallet_AppId,
        clientSecret: import.meta.env.VITE_DotWallet_AppSecret,
        redirectUrl: import.meta.env.VITE_Hosts + import.meta.env.VITE_RedirectPath,
        env: import.meta.env.VITE_DotWallet_ENV,
      },
    })
  },
}
