<template>
  <BaseModal
    v-model="layout[ShowControl.isShowCreateConsensualChannelModal]"
    v-model:show-second-control="layout[ShowControl.isShowChooseTokenModal]"
  >
    <template v-slot:title>
      {{ $t('Talk.Community.create_consensual_channel') }}
    </template>

    <template v-slot:body>
      <div class="flex flex-col h-full">
        <p class="text-base text-dark-400 leading-relaxed text-center">
          {{ $t('Talk.Community.create_consensual_channel_tip') }}
        </p>

        <div class="mt-7.5 w-full">
          <h4 class="text-lg text-dark-800 capitalize font-medium">
            {{ $t('Talk.Community.channel_name') }}
          </h4>

          <div class="mt-2">
            <input
              type="text"
              class="outline-0 main-border faded-switch !bg-white still w-full p-4 text-base leading-[24PX] text-dark-800 caret-dark-800 font-bold placeholder:font-normal"
              :placeholder="$t('Talk.Community.channel_name') + '...'"
              v-model="form.name"
              autocomplete="nope"
            />
          </div>
        </div>

        <div class="mt-6 w-full">
          <h4 class="text-lg text-dark-800 capitalize font-medium">
            {{ $t('Talk.Community.consent_type') }}
          </h4>

          <TabGroup as="div" class="mt-2" :selectedIndex="selectedTab" @change="changeTab">
            <TabList class="w-full text-sm flex text-dark-800 font-medium gap-x-3 lg:text-base">
              <Tab v-for="tab in consentTabs" as="template" v-slot="{ selected }">
                <button
                  class="w-full main-border py-3 outline-0 flex items-center justify-center lg:py-4"
                  :class="{ 'faded !bg-white': !selected }"
                >
                  <span v-if="selected" class="mr-1 flex items-center">
                    <Icon
                      name="check_bold"
                      class="w-3 h-3 inline bg-primary rounded-md p-1 box-content"
                    />
                  </span>
                  <span>
                    {{ tab.name }}
                  </span>
                </button>
              </Tab>
            </TabList>

            <TabPanels class="mt-6 w-full">
              <TabPanel v-for="tab in consentTabs">
                <h4 class="text-lg text-dark-800 capitalize font-medium">{{ tab.panelTitle }}</h4>
              </TabPanel>
            </TabPanels>

            <div class="mt-2 relative flex items-center group">
              <!-- NFT -->
              <template v-if="selectedTab === 0">
                <button
                  class="outline-0 main-border w-full px-4 py-3 text-base flex justify-between items-center"
                  @click="layout.isShowChooseTokenModal = !layout.isShowChooseTokenModal"
                >
                  <div class="flex items-center gap-x-1">
                    <Icon
                      name="nft_symbol"
                      class="w-8 h-8 text-dark-300  box-content group-hover:text-dark-800"
                      :class="{ '!text-dark-800': form.password.length > 0 }"
                    />

                    <span class="text-sm text-dark-400">
                      {{ consentTabs[selectedTab].buttonText }}
                    </span>
                  </div>

                  <Icon
                    name="chevron_right"
                    class="w-6 h-6 text-dark-800 lg:text-dark-300 lg:group-hover:text-dark-800 -mr-2 transition-all duration-200"
                  />
                </button>
              </template>

              <!-- FT -->
              <template v-if="selectedTab === 1">
                <button
                  class="outline-0 main-border w-full px-4 py-3 text-base flex justify-between items-center"
                  @click="layout.isShowChooseTokenModal = !layout.isShowChooseTokenModal"
                >
                  <div class="flex items-center gap-x-1">
                    <Icon
                      name="nft_symbol"
                      class="w-8 h-8 text-dark-300  box-content group-hover:text-dark-800"
                      :class="{ '!text-dark-800': form.password.length > 0 }"
                    />

                    <span class="text-sm text-dark-400">
                      {{ consentTabs[selectedTab].buttonText }}
                    </span>
                  </div>

                  <Icon
                    name="chevron_right"
                    class="w-6 h-6 text-dark-800 lg:text-dark-300 lg:group-hover:text-dark-800 -mr-2 transition-all duration-200"
                  />
                </button>
              </template>

              <template v-if="selectedTab === 2">
                <Icon
                  name="lock"
                  class="w-5 h-5 text-dark-800 lg:text-dark-300 absolute left-4 box-content lg:group-hover:text-dark-800  transition-all duration-200"
                  :class="{ '!text-dark-800': form.password.length > 0 }"
                />
                <input
                  :type="isShowingPassword ? 'text' : 'password'"
                  autocomplete="new-password"
                  minlength="6"
                  class="outline-0 main-border faded-switch !bg-white still w-full p-4 text-base px-12 leading-[24PX]"
                  :placeholder="$t('Talk.Community.password') + '...'"
                  v-model="form.password"
                />

                <button
                  class="absolute right-4"
                  v-show="form.password.length > 0"
                  @click="isShowingPassword = !isShowingPassword"
                >
                  <Icon
                    :name="isShowingPassword ? 'eye_slash' : 'eye'"
                    class="w-5 h-5 text-dark-800 lg:text-dark-300 box-content lg:group-hover:text-dark-800 transition-all duration-200"
                    :class="{ '!text-dark-800': form.password.length > 0 }"
                  />
                </button>
              </template>
            </div>
          </TabGroup>
        </div>

        <div class="grow flex items-end justify-end lg:mt-8">
          <button
            class="w-14 h-14 main-border primary flex items-center justify-center text-dark-800"
            :class="{ 'faded still text-dark-300': !form.isFinished }"
            :disabled="!form.isFinished"
            @click="tryCreateChannel"
          >
            <Icon name="arrow_right" class="w-6 h-6" />
          </button>
        </div>
      </div>
    </template>

    <template v-slot:secondTitle>
      <div class="text-left">{{ consentTabs[selectedTab].secondTitle }}</div>
    </template>

    <template v-slot:secondBody>
      <p class="text-sm text-dark-400 pb-4.5 border-b border-solid border-dark-200">
        {{ consentTabs[selectedTab].secondTip }}
      </p>

      <div class="h-full" v-if="selectedTab === 0">
        <div class="" v-if="nfts.length > 0"></div>
        <div class="w-full h-full flex items-center justify-center flex-col gap-y-8" v-else>
          <img :src="Cat" class="w-36 h-36" alt="" />
          <div class="text-dark-400 text-base font-medium">
            {{ $t('Talk.Community.no_nft_available') }}
          </div>
        </div>
      </div>

      <div class="h-full" v-if="selectedTab === 1">
        <div class="" v-if="fts.length > 0"></div>
        <div class="w-full h-full flex items-center justify-center flex-col gap-y-8" v-else>
          <img :src="Cat" class="w-36 h-36" alt="" />
          <div class="text-dark-400 text-base font-medium">
            {{ $t('Talk.Community.no_ft_available') }}
          </div>
        </div>
      </div>
    </template>
  </BaseModal>
</template>

<script lang="ts" setup>
import { GroupChannelType, ShowControl } from '@/enum'
import BaseModal from './BaseModal.vue'
import { TabList, Tab, TabGroup, TabPanel, TabPanels } from '@headlessui/vue'
import { useChannelFormStore } from '@/stores/forms'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { createChannel } from '@/utils/talk'
import { useTalkStore } from '@/stores/talk'
import { useUserStore } from '@/stores/user'
import { useLayoutStore } from '@/stores/layout'
import Cat from '@/assets/images/cat.svg?url'

const isShowingPassword = ref(false)
const layout = useLayoutStore()

const selectedTab = ref(0)
function changeTab(index: number) {
  if (index !== selectedTab.value) {
    layout.isShowChooseTokenModal = false
  }
  selectedTab.value = index

  switch (index) {
    case 0:
      form.type = GroupChannelType.NFT
      break
    case 1:
      form.type = GroupChannelType.FT
      break
    case 2:
      form.type = GroupChannelType.Password
      break
  }
}

const i18n = useI18n()
const consentTabs = ref([
  {
    name: 'NFT',
    panelTitle: i18n.t('Talk.Community.choose_nft'),
    secondTitle: i18n.t('Talk.Community.choose_nft'),
    secondTip: i18n.t('Talk.Community.choose_nft_tip'),
    buttonText: i18n.t('Talk.Community.choose_nft_as_consent'),
  },
  {
    name: 'FT',
    panelTitle: i18n.t('Talk.Community.choose_ft'),
    secondTitle: i18n.t('Talk.Community.choose_ft'),
    secondTip: i18n.t('Talk.Community.choose_ft_tip'),
    buttonText: i18n.t('Talk.Community.choose_ft_as_consent'),
  },
  {
    name: i18n.t('Talk.Community.password'),
    panelTitle: i18n.t('Talk.Community.set_password'),
  },
])

const nfts = ref([])
const fts = ref([])

const form = useChannelFormStore()
changeTab(selectedTab.value)
const talkStore = useTalkStore()
const userStore = useUserStore()

const tryCreateChannel = async () => {
  if (!form.isFinished) return

  const { channelId } = await createChannel(
    form,
    talkStore.activeCommunityId,
    userStore.showWallet,
    userStore.user!.metaId
  )
}
</script>
