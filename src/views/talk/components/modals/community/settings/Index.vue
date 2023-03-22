<template>
  <FullScreenModal v-model:show-control="layout[ShowControl.isShowCommunitySettingsModal]">
    <template #title>
      <div class="flex items-center">
        <button class="lg:hidden mr-3" type="button" @click="isShowingTabs = !isShowingTabs">
          <Icon
            name="bars"
            :class="[isShowingTabs && 'dark:bg-black', 'w-6 h-6 p-1 box-content rounded']"
          />
        </button>
        <span>{{ $t('Talk.Modals.community_settings') }}</span>
      </div>
    </template>

    <template #body>
      <TabGroup
        as="div"
        class="flex h-full lg:divide-x divide-solid divide-dark-100 dark:divide-gray-900"
        @change="changeTab"
        vertical
      >
        <TabList
          :class="[
            isShowingTabs ? 'block' : 'hidden',
            'w-full lg:block lg:w-48 py-7.5 px-4 shrink-0',
          ]"
          v-slot="{ selectedIndex }"
        >
          <Tab
            v-for="(tabName, idx) in (Object.keys(tabs) as TabName[])"
            :class="[
              idx === selectedIndex && 'bg-primary dark:bg-gray-700',
              'text-left text-lg p-3 rounded-md cursor-pointer outline-0 w-full',
            ]"
            :key="tabName"
          >
            {{ $t(tabs[tabName].titleKey) }}
          </Tab>
        </TabList>

        <!-- 内容 -->
        <TabPanels class="grow">
          <TabPanel
            :class="[
              isShowingTabs ? 'hidden' : 'block',
              'p-7.5 w-full lg:block lg:grow overflow-y-auto',
            ]"
          >
            <TabOverview />
          </TabPanel>
          <TabPanel
            :class="[
              isShowingTabs ? 'hidden' : 'block',
              'p-7.5 w-full lg:block lg:grow overflow-y-auto',
            ]"
          >
            <TabChannels />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </template>
  </FullScreenModal>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'

import { ShowControl } from '@/enum'
import { useLayoutStore } from '@/stores/layout'

import FullScreenModal from '../../FullScreenModal.vue'
import TabOverview from './TabOverview.vue'
import TabChannels from './TabChannels.vue'

const layout = useLayoutStore()

/**
 * tabs切换
 */
const isShowingTabs = ref(false)

const tabs = ref({
  Overview: {
    titleKey: 'Talk.Modals.community_settings_overview',
  },
  // Channels: {
  //   titleKey: 'Talk.Modals.community_settings_channels',
  // },
})
type TabName = keyof typeof tabs.value

function changeTab() {
  isShowingTabs.value = false
}
/**
 * tabs切换 end
 */
</script>
