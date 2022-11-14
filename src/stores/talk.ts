import { defineStore } from 'pinia'

export const useTalkStore = defineStore('talk', {
  state: () => {
    return {
      pastMessages: [] as Message[],
      newMessages: [] as Message[],

      error: {} as TalkError,
    }
  },
})
