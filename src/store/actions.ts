import { ActionTree, ActionContext } from 'vuex'

import { State } from './state'
import { Mutations, Mutation } from './mutations'
import { GetToken } from '@/api'
import { store } from '.'

export enum Action {
  getUserInfo = 'getUserInfo',
  refreshToken = 'refreshToken',
  checkToken = 'checkToken',
  initSdk = 'initSdk',
  LogOut = 'LogOut',
}

type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload?: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>
} & Omit<ActionContext<State, State>, 'commit'>

export interface Actions {
  [Action.getUserInfo]({ state, commit, dispatch }: AugmentedActionContext): void
  [Action.refreshToken]({ state, commit, dispatch }: AugmentedActionContext): void
  [Action.checkToken]({ state, commit, dispatch }: AugmentedActionContext): void
  [Action.initSdk]({ state, commit, dispatch }: AugmentedActionContext): void
  [Action.LogOut]({ state, commit, dispatch }: AugmentedActionContext): void
}

export const actions: ActionTree<State, State> & Actions = {
  async [Action.getUserInfo]({ state, commit, dispatch }) {
    state.userInfoLoading = true
    const res = await state.sdk?.getUserInfo()
    if (res && res.code === 200) {
      commit(Mutation.SETUSERINFO, res.data)
      if (state.isApp && res.appAccessToken) {
        commit(Mutation.SETTOKEN, {
          access_token: res.appAccessToken,
        })
      }
    } else {
      state.sdkInitIng = false
      state.userInfoLoading = false
      dispatch(Action.LogOut)
    }
    // state.sdk?.getUserInfo({
    //   accessToken: state.token ? state.token?.access_token : '',
    //   callback: (res: { data: UserInfo }) => {
    //     commit(Mutation.SETUSERINFO, res.data)
    //   }
    // })
  },
  [Action.refreshToken]({ state, commit, dispatch }) {
    return new Promise<void>(async (resolve, reject) => {
      if (state.token) {
        const res = await state.sdk
          ?.refreshToken({ refreshToken: state.token!.refresh_token! })
          .catch(() => {
            dispatch(Action.LogOut)
          })
        if (res) {
          commit(Mutation.SETTOKEN, res)
          resolve()
        } else {
          dispatch(Action.LogOut)
          new Error('refresh_token fail')
          reject('refresh_token fail')
        }
      } else {
        dispatch(Action.LogOut)
        new Error('refresh_token fail')
        reject('refresh_token fail')
      }
    })
  },
  [Action.checkToken]({ state, commit, dispatch }) {
    return new Promise<string | null>(async resolve => {
      if (state.token) {
        const now = new Date().getTime()
        if (now < state.token.expires_time!) {
          const res = await refreshToken(state.token?.refresh_token!).catch(() => {
            commit(Mutation.SETTOKEN, undefined)
            resolve(null)
          })
          if (res) {
            commit(Mutation.SETTOKEN, res)
            resolve(res.access_token)
          } else {
            new Error('refresh_token fail')
            resolve(null)
          }
        } else {
          resolve(state.token.access_token)
        }
      } else {
        resolve(null)
      }
    })
  },
  [Action.initSdk]({ state, commit, dispatch }) {
    return new Promise<void>(async resolve => {
      state.sdkInitIng = true
      state.userInfoLoading = true
      state.sdk
        ?.initSdk()
        .then(() => {
          state.sdkInitIng = false
          dispatch(Action.getUserInfo)
          resolve()
        })
        .catch(() => {
          state.sdkInitIng = false
          dispatch(Action.LogOut)
          resolve()
        })
    })
  },
  [Action.LogOut]({ state, commit, dispatch }) {
    return new Promise<void>(async resolve => {
      commit(Mutation.LOGOUT)
      commit(Mutation.SETSDK)
      resolve()
    })
  },
}

function refreshToken(refresh_token: string) {
  return new Promise<Token>(async (resolve, reject) => {
    const res = await GetToken({
      grant_type: 'refresh_token',
      client_id: import.meta.env.VITE_AppId,
      client_secret: import.meta.env.VITE_AppSecret,
      refresh_token: refresh_token,
    }).catch(() => {
      store.dispatch(Action.LogOut)
    })
    if (res) {
      resolve(res)
    } else {
      new Error('refresh_token fail')
      reject('refresh_token fail')
    }
  })
}
