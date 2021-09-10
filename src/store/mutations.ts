import { MutationTree } from 'vuex'
import { State } from './state'
import { SDK } from 'sdk'
import { SdkType } from 'sdk/src/emums'

export enum Mutation {
  INCREMENT = 'INCREMENT',
  SETTOKEN = 'SETTOKEN',
  SETUSERINFO = 'SETUSERINFO',
  SETUSERINFOLOADING = 'SETUSERINFOLOADING',
  LOGOUT = 'LOGOUT',
  SETSDK = 'SETSDK',
}

export type Mutations<S = State> = {
  [Mutation.INCREMENT](state: S, payload: number): void
  [Mutation.SETTOKEN](state: S, payload: Token): void
  [Mutation.SETUSERINFO](state: S, payload: UserInfo): void
  [Mutation.SETUSERINFOLOADING](state: S, payload: boolean): void
  [Mutation.LOGOUT](state: S): void
}

export const mutations: MutationTree<State> & Mutations = {
  [Mutation.INCREMENT](state: State, payload: number = 1) {
    state.count += payload
  },
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
    state.token = null
    state.userInfo = null
    state.sdk = null
  },
  [Mutation.SETSDK](state: State) {
    state.sdk = new SDK({
      type: SdkType.Metaidjs,
      metaIdTag: import.meta.env.VITE_MetaIdTag,
      showmoneyApi: import.meta.env.VITE_WalletApi,
      getAccessToken: () => {
        return state.token?.access_token
      },
      callBackFail: () => {
        return new Promise((resolve) => {
          resolve()
        })
      },
      appOptions: {
        clientId: import.meta.env.VITE_AppId,
        clientSecret: import.meta.env.VITE_AppSecret,
      },
      metaidjsOptions: {
        baseUri: import.meta.env.VITE_AuthUrl,
        baseApiUrl: '',
        redirectUrl: '',
        oauthSettings: {
          clientId: import.meta.env.VITE_AppId,
          clientSecret: import.meta.env.VITE_AppSecret,
          redirectUri: import.meta.env.VITE_Hosts + import.meta.env.VITE_RedirectPath,
        },
      },
      dotwalletOptions: {},
    })
  },
}
