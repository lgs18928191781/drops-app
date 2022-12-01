<template>
  <div
    class="bg-white shadow-lg w-16 h-16 fixed bottom-6 right-6 z-50 rounded-full hidden lg:block cursor-pointer"
    v-show="jobs.hasJobs"
  >
    <div class="w-full h-full flex items-center justify-center">
      <Icon name="cloud_up" class="w-8 h-8 text-dark-400 animate-bounce-subtle" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useJobsStore } from '@/stores/jobs'
import { watch } from 'vue'

const jobs = useJobsStore()

watch(
  () => jobs.hasJobs,
  () => {
    // start processing
    console.log('starting')
    const processJob = async () => {
      while (jobs.hasJobs) {
        console.log('another step')
        await jobs.runOnce()
      }
    }

    processJob()
  }
)
</script>
