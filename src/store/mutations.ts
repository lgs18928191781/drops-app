import { GetToken } from '@/api'
import { MutationTree } from 'vuex'
import { State, Token, UserInfo } from './state'

export enum Mutation {
  INCREMENT = 'INCREMENT',
  SETTOKEN = 'SETTOKEN',
  SETUSERINFO = 'SETUSERINFO',
  SETUSERINFOLOADING = 'SETUSERINFOLOADING',
  LOGOUT = 'LOGOUT',
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
    state.metaidjs = null
  },
}
