<template>
  <BaseModal v-model="layout[ShowControl.isShowCreateGeneralChannelModal]">
    <template #title>
      Add General Channel
    </template>

    <template #body>
      <div class="flex flex-col divide-y-2 divide-dark-100 dark:divide-gray-700 text-sm">
        <GeneralChannelItem
          v-for="channel in availableChannels"
          :key="channel.name"
          :channel="channel"
        />
      </div>
    </template>
  </BaseModal>
</template>

<script lang="ts" setup>
import { useLayoutStore } from '@/stores/layout'
import { ShowControl } from '@/enum'
import BaseModal from './BaseModal.vue'
import GeneralChannelItem from './GeneralChannelItem.vue'
import { ref } from 'vue'

const layout = useLayoutStore()

const availableChannels = ref([
  {
    name: 'Dao',
    nameKey: 'Talk.General.dao',
    lvl: 1,
    descriptionKey: 'Talk.General.dao_description',
  },
  {
    name: 'Market',
    nameKey: 'Talk.General.market',
    lvl: 30,
    descriptionKey: 'Talk.General.market_description',
  },
])
</script>
