import { defineStore } from 'pinia'
import { useUserStore } from './user'
import { DB } from '@/utils/db'
import { useConnectionStore } from './connection'

export type MyFollow = {
  followingList: string[]
  followedList: string[]
  blackList: string[]
  friendList: []
}

export const useFollowStore = defineStore('myFollow', {
  state: () => {
    return {
      list: {
        followingList: [],
        followedList: [],
        blackList: [],
        friendList: [],
      },
    } as { list: MyFollow }
  },
  getters: {},
  actions: {
    add: function(followMetaid: string) {
      this.list.followingList.unshift(followMetaid)
      DB.follow.add(followMetaid)
    },
    revoke: function(unFollowMetaid: string) {
      this.list.followingList.map((item, i) => {
        if (item == unFollowMetaid) {
          this.list.followingList.splice(i, 1)
        }
      })
      DB.follow.add(unFollowMetaid)
    },
    // update:async function(){
    //     DB.follow.update()
    // },

    initFollowList: async function() {
      const connectionStore = useConnectionStore()
      const userStore = useUserStore()
      if (userStore.isAuthorized) {
        const followLlist = await DB.follow
          .where('metaId')
          .equals(connectionStore.last.metaid)
          .toArray()
        this.list = followLlist
      } else {
        this.list = {
          followingList: [],
          followedList: [],
          blackList: [],
          friendList: [],
        }
      }
    },
  },
})
