<template>
  <div
    class="fixed inset-0 z-[60] bg-transparent w-screen h-screen flex items-center justify-center lg:bg-black/50"
  >
    <div
      class="w-full h-full bg-white lg:w-114 lg:h-auto lg:h-[600PX] lg:rounded-3xl relative lg:shadow-lg p-8"
    >
      <CreateCommunityModalContentP1 v-if="step === 1" @forward="step = 2" />
      <CreateCommunityModalContentP2
        v-else-if="step === 2"
        @back="step = 1"
        @try-create-community="tryCreateCommunity"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getCommunities } from '@/api/talk'
import { useCommunityFormStore } from '@/stores/forms'
import { useJobsStore } from '@/stores/jobs'
import { useLayoutStore } from '@/stores/layout'
import { useTalkStore } from '@/stores/talk'
import { useUserStore } from '@/stores/user'
import { createCommunity, joinCommunity } from '@/utils/talk'
import { sleep } from '@/utils/util'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import CreateCommunityModalContentP1 from './CreateCommunityModalContentP1.vue'
import CreateCommunityModalContentP2 from './CreateCommunityModalContentP2.vue'

const step = ref(1)
const form = useCommunityFormStore()
const jobs = useJobsStore()
const layout = useLayoutStore()

const userStore = useUserStore()
const router = useRouter()
const talk = useTalkStore()

const fetchCommunities = async () => {
  const selfMetaId = userStore.user?.metaId
  if (!selfMetaId) return
  const communities = await getCommunities({ metaId: selfMetaId })
  talk.$patch(state => {
    state.communities = [...communities, talk.atMeCommunity]
  })
}

const tryCreateCommunity = async () => {
  if (!form.isFinished) return

  // function* createCommunityJob() {
  //   const { communityId } = yield createCommunity(form, userStore, userStore.showWallet)
  //   console.log({ communityId })
  //   return router.push(`/talk/channels/${communityId}/the-void`)
  // }

  // const job = createCommunityJob()
  // jobs.push(job)
  layout.isShowCreateCommunityModal = false
  layout.isShowLoading = true
  const { communityId } = await createCommunity(form, userStore, userStore.showWallet)
  await sleep(2000)
  await fetchCommunities()
  layout.isShowLoading = false

  router.push(`/talk/channels/${communityId}/the-void`)

  return
  // await joinCommunity(communityId, userStore.showWallet)
}
</script>
