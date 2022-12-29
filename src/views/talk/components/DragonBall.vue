<template>
  <div
    class="bg-white dark:bg-gray-700 shadow-lg dark:shadow-blue-100/30  fixed bottom-24 lg:bottom-6 right-6 z-50 cursor-pointer warp"
    :class="[jobs.hasFailed && 'shadow-red-400/30']"
    v-show="jobs.hasUnresolved"
  >
    <div class="w-full h-full flex items-center justify-center">
      <div class="flex flex-v">
        <Icon
          name="x_circle"
          custom-class="w-8 h-8 text-red-400"
          :use-color-class="true"
          v-if="jobs.hasFailed"
        />

        <Icon
          name="check_badge"
          custom-class="w-8 h-8 text-green-400"
          :use-color-class="true"
          v-else-if="jobs.justGotSuccess"
        />

        <Icon
          name="cloud_up"
          custom-class="w-8 h-8 text-dark-400 dark:text-gray-200 animate-bounce-subtle"
          :use-color-class="true"
          v-else-if="jobs.hasJobs || jobs.hasWaiting"
        />

        <div class="title">{{ $t('Data is on-chain') }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useJobsStore } from '@/stores/jobs'
import { watch } from 'vue'

const jobs = useJobsStore()

// watch(
//   () => jobs.hasJobs,
//   () => {
//     // start processing
//     console.log('starting')
//     const processJob = async () => {
//       while (jobs.hasJobs) {
//         console.log('another step')
//         await jobs.runOnce()
//       }
//     }

//     processJob()
//   }
// )
</script>

<style scoped>
.warp {
  padding: 10px;
  border-radius: 8px;
}
.title {
  margin-top: 10px;
  text-align: center;
  font-size: 12px;
  opacity: 0.5;
}

.icon {
  margin: 0 auto;
}
</style>
