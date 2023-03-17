<template>
  <div class="h-full flex flex-v">
    <header>
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
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const i18n = useI18n()
const route = useRoute()

const nav = [
  {
    name: () => i18n.t('DAO.Proposal'),
    routeName: 'talkDAOProposal',
  },
  {
    name: () => i18n.t('DAO.Entrust'),
    routeName: 'talkDAOEntrust',
  },
  {
    name: () => i18n.t('DAO.About'),
    routeName: 'talkDAOAbout',
  },
]
</script>

<style lang="scss" scoped src="./Layout.scss"></style>
