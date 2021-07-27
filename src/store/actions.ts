import { ActionTree, ActionContext } from 'vuex'

import { State, UserInfo } from './state'
import { Mutations, Mutation } from './mutations'
import { GetToken } from '@/api'
import Sdk from '@/utils/sdk'

export enum Action {
  initApp = 'initApp',
  initSdk = 'initSdk',
  getUserInfo = 'getUserInfo',
  refreshToken = 'refreshToken',
}

type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload?: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>
} & Omit<ActionContext<State, State>, 'commit'>

export interface Actions {
  [Action.initApp]({ state, commit, dispatch }: AugmentedActionContext): void
  [Action.initSdk]({ state, commit, dispatch }: AugmentedActionContext): void
  [Action.getUserInfo]({ state, commit, dispatch }: AugmentedActionContext): void
  [Action.refreshToken]({ state, commit, dispatch }: AugmentedActionContext): void
}

export const actions: ActionTree<State, State> & Actions = {
  [Action.initApp]({ state, commit, dispatch }) {
    console.log('app inited!')
  },
  [Action.initSdk]({ state, commit, dispatch }) {
    state.sdkInitIng = true
    state.userInfoLoading = true
    state.sdk = new Sdk({
      baseUri: import.meta.env.VITE_AuthUrl,
      oauthSettings: {
        clientId: import.meta.env.VITE_AppId,
        redirectUri: import.meta.env.VITE_Hosts + import.meta.env.VITE_RedirectPath,
        clientSecret: import.meta.env.VITE_AppSecret,
      },
      onLoaded: () => {
        state.sdkInitIng = false
        dispatch(Action.getUserInfo)
      },
      onError: () => {
        state.sdkInitIng = false
        state.userInfoLoading = false
        state.sdk = null
      }
    })
  },
  async [Action.getUserInfo]({ state, commit, dispatch }) {
    state.sdk?.getUserInfo({
      accessToken: state.token ? state.token?.access_token : '',
      callback: (res: { data: UserInfo }) => {
        commit(Mutation.SETUSERINFO, res.data)
      }
    })
  },
  [Action.refreshToken]({ state, commit, dispatch }) {
    return new Promise<void>(async (resolve, reject) => {
      const res = await GetToken({
        grant_type: 'refresh_token',
        client_id: import.meta.env.VITE_AppId,
        client_secret: import.meta.env.VITE_AppSecret,
        refresh_token: state.token?.refresh_token,
      })
      if (res) {
        commit(Mutation.SETTOKEN, res)
        resolve()
      } else {
        new Error('refresh_token fail')
        reject('refresh_token fail')
      }
    })
  },
}