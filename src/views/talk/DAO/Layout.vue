<template>
  <div class="h-full flex flex-v">
    <header v-if="talk.activeCommunity?.dao">
      <nav>
        <RouterLink :to="{ name: item.routeName }" v-for="(item, index) in nav" :key="index">
          {{ item.name() }}
        </RouterLink>
      </nav>
    </header>

    <div class="content flex1">
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLayoutStore } from '@/stores/layout'
import { useTalkStore } from '@/stores/talk'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { ShowControl } from '@/enum'
import { ref } from 'vue'

const i18n = useI18n()
const route = useRoute()
const router = useRouter()
const talk = useTalkStore()
const layout = useLayoutStore()

talk.activeChannelId = 'DAO'
const isShwoCreateDAOModal = ref(false)
const nav = [
  {
    name: () => i18n.t('DAO.Proposal'),
    routeName: 'talkDAOProposal',
  },
  // {
  //   name: () => i18n.t('DAO.Entrust'),
  //   routeName: 'talkDAOEntrust',
  // },
  {
    name: () => i18n.t('DAO.About'),
    routeName: 'talkDAOAbout',
  },
  {
    name: () => i18n.t('DAO.Leaderboard'),
    routeName: 'talkDAOLeaderboard',
  },
]

// if (route.name === 'talkDAO' && talk.activeCommunity) {
//   router.replace({ name: 'talkDAOProposal' })
// }
</script>

<style lang="scss" scoped src="./Layout.scss"></style>
