import { defineStore } from 'pinia'
import { useUserStore } from './user'
import { tryCreateNode } from '@/utils/talk'

export const useJobsStore = defineStore('jobs', {
  state: () => {
    return {
      jobsQueue: [] as Generator<any>[],
      done: [] as Generator<any>[],
      failed: [] as Generator<any>[],
      processing: null as Generator<any> | null,
      nodes: [] as any,
    }
  },

  getters: {
    hasJobs(state) {
      return state.jobsQueue.length > 0 || !!state.processing
    },
  },

  actions: {
    push(job: Generator<any>) {
      this.jobsQueue.push(job)
    },

    async resend(timestamp: any) {
      const userStore = useUserStore()
      const resendingNode = this.nodes.find((node: any) => node.timestamp === timestamp)
      if (resendingNode) {
        const sdk = userStore.showWallet

        tryCreateNode(resendingNode.node, sdk)

        // 移除重发节点
        this.nodes = this.nodes.filter((node: any) => node.timestamp !== timestamp)
      }
    },

    async runOnce() {
      if (this.hasJobs) {
        if (!this.processing) {
          this.processing = this.jobsQueue.shift()!
        }

        let res = this.processing.next()
        console.log(res)

        if (res.done) {
          this.done.push(this.processing)
          this.processing = null
        }
      }
    },
  },
})
