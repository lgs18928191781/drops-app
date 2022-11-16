import { defineStore } from 'pinia'

export const useLayoutStore = defineStore('layout', {
  state: () => {
    return {
      showLeftNav: false,
      isShowPublishBuzz: false,
    }
  },
})
