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
import { useCommunityFormStore } from '@/stores/forms'
import { useUserStore } from '@/stores/user'
import { createCommunity, joinCommunity } from '@/utils/talk'
import { ref } from 'vue'
import CreateCommunityModalContentP1 from './CreateCommunityModalContentP1.vue'
import CreateCommunityModalContentP2 from './CreateCommunityModalContentP2.vue'

const step = ref(1)
const form = useCommunityFormStore()

const userStore = useUserStore()

const tryCreateCommunity = async () => {
  if (!form.isFinished) return

  const { communityId } = await createCommunity(form, userStore, userStore.showWallet)
  await joinCommunity(communityId, userStore.showWallet)
}
</script>
