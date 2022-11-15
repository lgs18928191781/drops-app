import { defineStore } from 'pinia'

export const useTalkStore = defineStore('talk', {
  state: () => {
    return {
      latestAtMe: 'ada39724595ffed214990695c5bae373f58ca82a69238a83dd606c56e84b222b',
      pastMessages: [] as Message[],
      newMessages: [] as Message[],

      error: {} as TalkError,
    }
  },
})
