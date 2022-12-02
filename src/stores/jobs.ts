import { defineStore } from 'pinia'

export const useJobsStore = defineStore('jobs', {
  state: () => {
    return {
      jobsQueue: [] as Generator<any>[],
      done: [] as Generator<any>[],
      failed: [] as Generator<any>[],
      processing: null as Generator<any> | null,
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
