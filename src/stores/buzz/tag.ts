import { GetPostTags } from '@/api/aggregation'
import { defineStore } from 'pinia'

export interface PostTag {
  id: number
  tag: string
  icon: string
  color: string
  cover: string
  info: {
    [key: string]: string
  }
  subTag: {
    tag: string
    [key: string]: string
  }[]
  tagName: {
    [key: string]: string
  }
}

interface PostTagState {
  list: PostTag[]
}

export const usePostTagStore = defineStore('postTag', {
  state: () =>
    <PostTagState>{
      list: [],
    },
  actions: {
    getPostTags() {
      return new Promise<void>(async (resolve, reject) => {
        const res = await GetPostTags().catch(error => {
          ElMessage.error(error.message)
          resolve()
        })
        if (res?.code === 0) {
          this.list.push(...res.data.results)
          resolve()
        }
      })
    },
  },
})
