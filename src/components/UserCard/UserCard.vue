<template>
  <div class="user-card">
    <div class="header flex flex-align-center">
      <div class="flex1">
        <div class="name">{{ name }}</div>
        <div class="metaid">MetaID:{{ metaId ? metaId.slice(0, 6) : '--' }}</div>
      </div>
      <div class="operate">
        <a class="main-border primary" @click="toUser">{{ $t('User.Home') }}</a>
        <a
          class="main-border primary"
          v-if="userStore.user?.metaId !== metaId"
          @click="toMessage"
          >{{ $t('User.Chat') }}</a
        >
      </div>
    </div>

    <UserPersonaVue />
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { checkUserLogin } from '@/utils/util'
import { useRouter } from 'vue-router'
import UserPersonaVue from '../UserPersona/UserPersona.vue'

const props = defineProps<{
  metaId: string
  name: string
}>()

const router = useRouter()
const userStore = useUserStore()

function toUser(e: Event) {
  router.push({
    name: 'user',
    params: {
      metaId: props.metaId,
    },
  })
}

async function toMessage() {
  await checkUserLogin()
  router.push({
    name: 'talkAtMe',
    params: {
      channelId: props.metaId,
    },
  })
}
</script>

<style lang="scss" scoped src="./UserCard.scss"></style>
