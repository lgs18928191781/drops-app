import { defineStore } from 'pinia'
import { useUserStore } from './user'
import { DB } from '@/utils/db'
import { useConnectionStore } from './connection'
import { MyFollow, FollowMe } from '@/api/follow'
export type MyFollow = {
  followingList: string[]
  followedList?: string[]
  blackList?: string[]
  friendList?: []
}

export interface FollowItem {
  userMetaId: string
  followedMetaId: string
  txId: string
}

export const useFollowStore = defineStore('myFollow', {
  state: () => {
    return {
      followingList: [],
      followMeList: [],
      friendList: [],
    } as { followingList: FollowItem[]; followMeList: string[]; friendList: string[] }
  },
  getters: {},
  actions: {
    add: function(params: { followedMetaId: string; txId: string }) {
      const connectionStore = useConnectionStore()
      this.followingList.unshift({
        userMetaId: connectionStore.last.metaid,
        followedMetaId: params.followedMetaId,
        txId: params.txId,
      })
      DB.follow.add({
        userMetaId: connectionStore.last.metaid,
        followedMetaId: params.followedMetaId,
        txId: params.txId,
      })
    },

    get: async function() {
      // try {
      //   const queryList: FollowItem[] = []
      //   const connectionStore = useConnectionStore()
      //   const query = DB.follow.where('userMetaId').equals(connectionStore.last.metaid)
      //   const localList = await query.toArray()
      //   const {
      //     data: { list },
      //   } = await MyFollow()

      //   if (list.length) {
      //     list.forEach((item: string) => {
      //       queryList.push({
      //         userMetaId: connectionStore.last.metaid,
      //         followedMetaId: item,
      //         txId: '',
      //       })
      //     })
      //   }

      //   if (localList.length && queryList.length) {
      //     this.followingList.length = 0
      //     const newArr = Array.from(new Set([...localList, ...queryList]))
      //     for (let i = 0; i < newArr.length; i++) {
      //       if (newArr[i].followedMetaId !== newArr[i + 1].followedMetaId) {
      //         this.followingList.push(newArr[i])
      //       } else if (newArr[i].followedMetaId == newArr[i + 1].followedMetaId) {
      //         this.followingList.push(newArr[i + 1])
      //       }
      //     }
      //   } else if (localList.length && !queryList.length) {
      //     this.followingList = localList
      //   } else if (!localList.length && queryList.length) {
      //     this.followingList = queryList
      //   } else {
      //     this.followingList = []
      //   }

      //   //关注我的
      //   const followMe = await FollowMe()
      //   if (followMe.data.list.length) {
      //     this.followMeList = followMe.data.list
      //     if (this.followMeList.length && this.followingList.length) {
      //       for (let item of this.followingList) {
      //         for (let user of this.followMeList) {
      //           if (item.followedMetaId == user) {
      //             this.friendList.push(user)
      //           }
      //         }
      //       }
      //     }
      //   }
      // } catch (error) {}
    },

    revoke: function(unFollowMetaid: string) {
      this.followingList.map((item, i) => {
        if (item.followedMetaId == unFollowMetaid) {
          this.followingList.splice(i, 1)
          if (this.friendList.length) {
            this.friendList = this.friendList.filter(item => {
              return item !== unFollowMetaid
            })
          }
        }
      })

      DB.follow.delete(unFollowMetaid)
    },

    initFollowList: async function() {
      const connectionStore = useConnectionStore()
      const userStore = useUserStore()
      if (userStore.isAuthorized) {
        const followLlist = await DB.follow
          .where('userMetaId')
          .equals(connectionStore.last.metaid)
          .toArray()
        this.followingList = followLlist
      } else {
        this.followingList = []
      }
    },
  },
})
