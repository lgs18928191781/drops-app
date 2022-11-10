import { defineStore } from 'pinia'

type Message = {
  protocol: string
  contentType: string
  content: string
  avatarType: string
  avatarTxId: string
  nickName: string
  timestamp: number
  txId: string
}

export const useTalkStore = defineStore('talk', {
  state: () => {
    return {
      pastMessages: [] as Message[],
      newMessages: [] as Message[],
    }
  },
})
