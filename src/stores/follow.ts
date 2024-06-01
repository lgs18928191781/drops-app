import { defineStore } from 'pinia'
import { useUserStore } from './user'
import { DB } from '@/utils/db'
import { useConnectionStore } from './connection'

export type MyFollow = {
  followingList: string[]
  followedList?: string[]
  blackList?: string[]
  friendList?: []
}

export interface FollowItem{
  userMetaId:string
  followedMetaId:string
  txId:string
}

export const useFollowStore = defineStore('myFollow', {
  state: () => {
    return {
      followingList:[]
    } as {followingList: FollowItem[]}
  },
  getters: {
   
  },
  actions: {
    add: function(params:{
      followedMetaId:string,
      txId:string
    }) {
      const connectionStore=useConnectionStore()
      this.followingList.unshift({
        userMetaId:connectionStore.last.metaid,
        followedMetaId:params.followedMetaId,
        txId:params.txId
      })
      DB.follow.add({
        userMetaId:connectionStore.last.metaid,
        followedMetaId:params.followedMetaId,
        txId:params.txId
      })
    },

    get:async function(){
      try {
        const connectionStore=useConnectionStore()
        const query= DB.follow.where('userMetaId').equals(connectionStore.last.metaid)
        this.followingList= await query.toArray()
      } catch (error) {
        
      }
      
    },

    revoke: function(unFollowMetaid: string) {
      this.followingList.map((item, i) => {
        if (item.followedMetaId == unFollowMetaid) {
          this.followingList.splice(i, 1)
        }
      })
     
      DB.follow.delete(unFollowMetaid)
    },
    // update:async function(){
    //     DB.follow.update()
    // },

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
        this.followingList=[]
      }
    },
  },
})
