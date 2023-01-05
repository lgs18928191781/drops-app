<template>
  <BaseModal
    v-model="layout[ShowControl.isShowCreateConsensualChannelModal]"
    v-model:show-second-control="layout[ShowControl.isShowChooseTokenModal]"
    :extra-close-event="form.reset"
  >
    <template #title>
      {{
        form.publicKey
          ? $t('Talk.Community.edit_consensual_channel')
          : $t('Talk.Community.create_consensual_channel')
      }}
    </template>

    <template #body>
      <div class="flex flex-col h-full">
        <p class="text-base text-dark-400 dark:text-gray-200 leading-relaxed text-center">
          {{ $t('Talk.Community.create_consensual_channel_tip') }}
        </p>

        <div class="mt-7.5 w-full">
          <h4 class="text-lg capitalize font-medium">
            {{ $t('Talk.Community.channel_name') }}
          </h4>

          <div class="mt-2">
            <input
              type="text"
              class="outline-0 main-border faded-switch !bg-white dark:!bg-gray-700 still w-full p-4 text-base leading-[24PX] caret-dark-800 dark:caret-gray-100 font-bold placeholder:font-normal"
              :placeholder="$t('Talk.Community.channel_name') + '...'"
              v-model="form.name"
              autocomplete="nope"
            />
          </div>
        </div>

        <div class="mt-6 w-full">
          <h4 class="text-lg  capitalize font-medium">
            {{ $t('Talk.Community.consent_type') }}
          </h4>

          <TabGroup as="div" class="mt-2" :selectedIndex="selectedTab" @change="changeTab">
            <TabList class="w-full text-sm flex font-medium gap-x-3 lg:text-base">
              <Tab v-for="tab in consentTabs" :key="tab.id" as="template" v-slot="{ selected }">
                <button
                  class="w-full main-border py-3 outline-0 flex items-center justify-center lg:py-4 dark:!bg-gray-700 "
                  :class="{ 'faded !bg-white dark:!bg-gray-700 dark:!text-gray-400': !selected }"
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
              <TabPanel v-for="tab in consentTabs" :key="tab.id">
                <h4 class="text-lg  capitalize font-medium">{{ tab.name }}</h4>
              </TabPanel>
            </TabPanels>

            <div class="mt-2 relative flex items-center group">
              <!-- NFT -->
              <template v-if="selectedTab === 0">
                <button
                  class="outline-0 main-border w-full px-4 py-3 text-base flex justify-between items-center dark:!bg-gray-700"
                  :class="[!form.nft && 'faded !bg-white dark:!bg-gray-700']"
                  @click="layout.isShowChooseTokenModal = !layout.isShowChooseTokenModal"
                >
                  <div class="flex items-center gap-x-3">
                    <template v-if="form.nft">
                      <div class="w-8 h-8 rounded-full">
                        <Image :src="form.nft.nftIcon" customClass="w-8 h-8 box-content rounded" />
                      </div>

                      <span class="text-sm ">
                        {{ form.nft.nftSeriesName }}
                      </span>
                    </template>
                    <template v-else>
                      <Icon
                        name="nft_symbol"
                        class="w-8 h-8 text-dark-300 dark:text-gray-400 box-content group-hover:text-dark-800"
                      />

                      <span class="text-sm text-dark-400 dark:text-gray-200">
                        {{ consentTabs[selectedTab].buttonText }}
                      </span>
                    </template>
                  </div>

                  <Icon
                    name="chevron_right"
                    class="w-6 h-6  lg:text-dark-300 lg:dark:text-gray-400 lg:group-hover:text-dark-800 dark:lg:group-hover:text-gray-100 -mr-2 transition-all duration-200"
                  />
                </button>
              </template>

              <!-- FT -->
              <template v-if="selectedTab === 1">
                <button
                  class="outline-0 main-border w-full px-4 py-3 text-base flex justify-between items-center dark:!bg-gray-700"
                  @click="layout.isShowChooseTokenModal = !layout.isShowChooseTokenModal"
                >
                  <div class="flex items-center gap-x-3">
                    <template v-if="form.ft">
                      <div class="w-8 h-8 rounded-full">
                        <Image :src="form.ft.icon" customClass="w-8 h-8 box-content rounded" />
                      </div>

                      <span class="text-sm ">
                        {{ form.ft.name }}
                      </span>
                    </template>
                    <template v-else>
                      <Icon
                        name="ft_symbol"
                        class="w-8 h-8 text-dark-300 dark:text-gray-400 box-content group-hover:text-dark-800"
                      />

                      <span class="text-sm text-dark-400 dark:text-gray-200">
                        {{ consentTabs[selectedTab].buttonText }}
                      </span>
                    </template>
                  </div>

                  <Icon
                    name="chevron_right"
                    class="w-6 h-6  lg:text-dark-300 lg:dark:text-gray-400 lg:group-hover:text-dark-800 dark:lg:group-hover:text-gray-100 -mr-2 transition-all duration-200"
                  />
                </button>

                <div class="ml-4" v-if="form.ft">
                  <input
                    type="number"
                    class="outline-0 main-border faded-switch !bg-white dark:!bg-gray-700 still w-full p-4 text-base leading-[24PX]  caret-dark-800 font-bold placeholder:font-normal"
                    min="1"
                    :placeholder="$t('Talk.Modals.amount_needed')"
                    v-model="form.amount"
                    autocomplete="nope"
                  />
                </div>
              </template>

              <!-- Password -->
              <template v-if="selectedTab === 2">
                <Icon
                  name="lock"
                  class="w-5 h-5 lg:text-dark-300 lg:dark:text-gray-400 absolute left-4 box-content lg:group-hover:text-dark-800 dark:lg:group-hover:!text-gray-100 transition-all duration-200"
                  :class="{ '!text-dark-800 dark:!text-gray-100': form.password.length > 0 }"
                />
                <input
                  :type="isShowingPassword ? 'text' : 'password'"
                  autocomplete="new-password"
                  minlength="6"
                  class="outline-0 main-border faded-switch !bg-white dark:!bg-gray-700 still w-full p-4 text-base px-12 leading-[24PX]"
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
                    class="w-5 h-5  lg:text-dark-300 dark:lg:text-gray-400 box-content lg:group-hover:text-dark-800 dark:lg:group-hover:text-gray-100 transition-all duration-200"
                    :class="{ '!text-dark-800 dark:!text-gray-100': form.password.length > 0 }"
                  />
                </button>
              </template>
            </div>

            <div class="mt-6">
              <SwitchGroup>
                <div class="flex items-center gap-x-3">
                  <Switch
                    v-model="form.adminOnly"
                    :class="form.adminOnly ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-900'"
                    class="relative inline-flex h-6 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                  >
                    <span
                      aria-hidden="true"
                      :class="form.adminOnly ? 'translate-x-6' : 'translate-x-0'"
                      class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white dark:bg-gray-600 shadow-lg ring-0 transition duration-200 ease-in-out"
                    ></span>
                  </Switch>

                  <SwitchLabel class="text-dark-400 dark:text-gray-200 text-sm">
                    {{ $t('Talk.Modals.admin_only') }}
                  </SwitchLabel>
                </div>
              </SwitchGroup>
            </div>
          </TabGroup>
        </div>

        <div class="grow flex items-end justify-end lg:mt-8">
          <button
            class="w-14 h-14 main-border primary flex items-center justify-center dark"
            :class="{
              'faded still text-dark-300 dark:text-gray-400 dark:!bg-gray-700': !form.isFinished,
            }"
            :disabled="!form.isFinished"
            @click="tryCreateChannel"
          >
            <Icon name="arrow_right" class="w-6 h-6" />
          </button>
        </div>
      </div>
    </template>

    <template #secondTitle>
      <div class="flex items-center space-x-3">
        <Listbox v-model="selectedChain">
          <div class="relative mt-1">
            <ListboxButton
              class="relative w-full px-2 py-1 text-center focus:outline-none rounded-xl text-sm border border-solid border-dark-200 dark:border-gray-600 dark:text-gray-100 flex items-center space-x-1"
              v-slot="{ open }"
            >
              <div class="w-7.5 h-7.5 shrink-0 flex items-center justify-center">
                <img :src="selectedChain.icon" class="h-full" />
              </div>
              <span class="block truncate w-12 text-left">{{ selectedChain.name }}</span>
              <Icon
                name="chevron_right"
                :class="[
                  open && 'rotate-90',
                  'w-4 h-4 text-dark-400 dark:text-gray-200 transition duration-200',
                ]"
              />
            </ListboxButton>

            <transition
              enter-active-class="transition duration-100 ease-out"
              enter-from-class="transform scale-95 opacity-0 -translate-y-1/2"
              enter-to-class="transform scale-100 opacity-100"
              leave-active-class="transition duration-75 ease-out"
              leave-from-class="transform scale-100 opacity-100"
              leave-to-class="transform scale-95 opacity-0"
            >
              <ListboxOptions
                class="absolute mt-2 max-h-60 overflow-auto rounded-xl bg-white dark:bg-gray-700 py-2 text-base shadow-md focus:outline-none z-50 border border-solid border-dark-100 dark:border-gray-600 dark:shadow-blue-100/20"
              >
                <ListboxOption
                  v-slot="{ active, selected }"
                  v-for="chain in chains"
                  :key="chain.name"
                  :value="chain"
                  as="template"
                >
                  <li
                    :class="[
                      'relative select-none py-2 p-7.5 text-dark-800 dark:text-gray-100 cursor-pointer flex items-center justify-between min-w-fit group w-45',
                    ]"
                  >
                    <div class="flex items-center space-x-1">
                      <div class="w-7.5 h-7.5 shrink-0 flex items-center justify-center">
                        <img :src="chain.icon" class="h-full" />
                      </div>

                      <span class="shrink-0 group-hover:underline">
                        {{ chain.name }}
                      </span>
                    </div>

                    <Icon
                      name="check_bold"
                      v-if="selected"
                      class="w-3 h-3 inline bg-primary rounded-md p-1 box-content"
                    />
                  </li>
                </ListboxOption>
              </ListboxOptions>
            </transition>
          </div>
        </Listbox>

        <div class="text-left">{{ consentTabs[selectedTab].secondTitle }}</div>
      </div>
    </template>

    <template #secondBody>
      <p
        class="text-sm text-dark-400 dark:text-gray-200 pb-4.5 border-b border-solid border-dark-200 dark:border-gray-600"
      >
        {{ consentTabs[selectedTab].secondTip }}
      </p>

      <!-- NFT -->
      <div class="h-full" v-if="selectedTab === 0">
        <div
          v-if="fetching"
          class="w-full h-full flex items-center justify-center flex-col gap-y-4"
        >
          <img :src="DogWalking" class="w-48 h-48" alt="" />
          <div class="flex items-center space-x-2">
            <Icon name="loading" class="w-4 h-4 animate-spin text-dark-400 dark:!text-gray-200" />
            <div class="text-dark-400 dark:text-gray-200 text-base font-medium">
              {{ $t('Talk.Modals.loading') }}
            </div>
          </div>
        </div>
        <div class="flex flex-col mt-6" v-else-if="nftSeries.length > 0">
          <div
            v-for="nft in nftSeries"
            :key="nft.nftSeriesName"
            class="flex space-x-3 items-center cursor-pointer hover:bg-dark-100 dark:hover:bg-gray-900 rounded p-2 -mx-2"
            @click="selectNft(nft)"
          >
            <Image
              :src="nft.nftIcon"
              customClass="rounded-xl h-13.5 w-13.5 object-contain object-center"
            />
            <div class="text-base ">
              {{ nft.nftSeriesName }}
            </div>
          </div>
        </div>
        <div class="w-full h-full flex items-center justify-center flex-col gap-y-8" v-else>
          <img :src="Cat" class="w-36 h-36" alt="" />
          <div class="text-dark-400 dark:text-gray-200 text-base font-medium">
            {{ $t('Talk.Community.no_nft_available') }}
          </div>
        </div>
      </div>

      <!-- FT -->
      <div class="h-full" v-if="selectedTab === 1">
        <div
          v-if="fetching"
          class="w-full h-full flex items-center justify-center flex-col gap-y-4"
        >
          <img :src="DogWalking" class="w-48 h-48" alt="" />
          <div class="flex items-center space-x-2">
            <Icon name="loading" class="w-4 h-4 animate-spin text-dark-400 dark:!text-gray-200" />
            <div class="text-dark-400 dark:text-gray-200 text-base font-medium">
              {{ $t('Talk.Modals.loading') }}
            </div>
          </div>
        </div>
        <div class="flex flex-col mt-6" v-else-if="ftSeries.length > 0">
          <div
            v-for="ft in ftSeries"
            :key="ft.name"
            class="flex items-center justify-between cursor-pointer hover:bg-dark-100 dark:hover:bg-gray-900 rounded p-2 -mx-2"
            @click="selectFt(ft)"
          >
            <div class="flex items-center justify-start space-x-3">
              <Image
                :src="ft.icon"
                customClass="rounded-xl h-13.5 w-13.5 object-contain object-center"
              />
              <div class="text-base ">
                {{ ft.name }}
              </div>
            </div>

            <div class="text-sm text-dark-400 dark:text-gray-200 font-medium">
              {{ ft.balance.split('.')[0] }}
            </div>
          </div>
        </div>
        <div class="w-full h-full flex items-center justify-center flex-col gap-y-8" v-else>
          <img :src="Cat" class="w-36 h-36" alt="" />
          <div class="text-dark-400 dark:text-gray-200 text-base font-medium">
            {{ $t('Talk.Community.no_ft_available') }}
          </div>
        </div>
      </div>
    </template>
  </BaseModal>
</template>

<script lang="ts" setup>
import { ChannelPublicityType, GroupChannelType, ShowControl } from '@/enum'
import BaseModal from './BaseModal.vue'
import {
  TabList,
  Tab,
  TabGroup,
  TabPanel,
  TabPanels,
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
  Switch,
  SwitchLabel,
  SwitchGroup,
} from '@headlessui/vue'

import { useChannelFormStore } from '@/stores/forms'
import { onMounted, Ref, ref, toRaw, watchEffect, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { createChannel } from '@/utils/talk'
import { useTalkStore } from '@/stores/talk'
import { useUserStore } from '@/stores/user'
import { useLayoutStore } from '@/stores/layout'
import Cat from '@/assets/images/cat.svg?url'
import DogWalking from '@/assets/images/dog_walking.svg?url'
import { useRouter } from 'vue-router'
import { GetNFTs, GetFTs } from '@/api/aggregation'
import ETH from '@/assets/images/eth.png'
import MVC from '@/assets/images/iocn_mvc.png'
import { realRandomString, showLoading, sleep } from '@/utils/util'

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
const chains = ref([
  {
    id: 1,
    name: 'MVC',
    icon: MVC,
    value: 'mvc',
  },
])
const selectedChain = ref(chains.value[0])
const consentTabs = ref([
  {
    id: 1,
    name: 'NFT',
    panelTitle: i18n.t('Talk.Community.choose_nft'),
    secondTitle: i18n.t('Talk.Community.choose_nft_series'),
    secondTip: i18n.t('Talk.Community.choose_nft_tip'),
    buttonText: i18n.t('Talk.Community.choose_nft_as_consent'),
  },
  {
    id: 2,
    name: 'FT',
    panelTitle: i18n.t('Talk.Community.choose_ft'),
    secondTitle: i18n.t('Talk.Community.choose_ft'),
    secondTip: i18n.t('Talk.Community.choose_ft_tip'),
    buttonText: i18n.t('Talk.Community.choose_ft_as_consent'),
  },
  {
    id: 3,
    name: i18n.t('Talk.Community.password'),
    panelTitle: i18n.t('Talk.Community.set_password'),
  },
])

const nftSeries: Ref<any[]> = ref([])
const ftSeries: Ref<FungibleToken[]> = ref([])

const form = useChannelFormStore()
changeTab(selectedTab.value)
const talk = useTalkStore()
const userStore = useUserStore()

const tryCreateChannel = async () => {
  if (!form.isFinished) return

  layout.isShowCreateConsensualChannelModal = false
  layout.isShowLoading = true

  const subscribeId = form.uuid || realRandomString(32)
  const res = await createChannel(
    form,
    talk.activeCommunityId,
    userStore.showWallet,
    subscribeId,
    userStore.user!.metaId
  )

  // 添加占位频道
  if (res.status === 'success') {
    const newChannel: any = {
      id: 'placeholder_' + realRandomString(8),
      name: form.name,
      isPlaceHolder: true,
      roomType: ChannelPublicityType.Private,
      roomJoinType: form.type,
      uuid: res.subscribeId,
      roomPublicKey: form.publicKey,
    }
    // 将占位频道添加到频道列表最前面
    if (form.publicKey) {
      const index = talk.activeCommunityChannels.findIndex(
        item => item.roomPublicKey === form.publicKey
      )
      if (index !== -1) {
        talk.activeCommunityChannels[index] = newChannel
      }
    } else {
      talk.activeCommunityChannels.unshift(newChannel)
    }
  }

  layout.isShowLoading = false
}

const selectNft = (nft: any) => {
  form.nft = nft
  form.chain = selectedChain.value.value
  layout.isShowChooseTokenModal = false
}

const selectFt = (ft: any) => {
  form.ft = ft
  form.chain = selectedChain.value.value
  layout.isShowChooseTokenModal = false
}

const selfAddress = computed(() => {
  switch (selectedChain.value.value) {
    case 'mvc':
      return userStore.user!.address
    case 'eth':
      return userStore.user?.evmAddress as string
    case 'goerli':
      return userStore.user?.evmAddress as string
    case 'polygon':
      return userStore.user?.evmAddress as string
      break
    case 'mumbai':
      return userStore.user?.evmAddress as string
      break
    default:
      return userStore.user!.address
  }
})

const fetching = ref(false)
const fetchNftSeries = async () => {
  const {
    data: {
      results: { items: _nfts },
    },
  } = await GetNFTs({
    address: selfAddress.value,
    chain: selectedChain.value.value,
    page: 1,
    pageSize: 100,
  })
  nftSeries.value = _nfts
}
const fetchFtSeries = async () => {
  const {
    data: {
      results: { items: _fts },
    },
  } = await GetFTs({
    address: selfAddress.value,
    chain: selectedChain.value.value,
    page: 1,
    pageSize: 100,
  })
  ftSeries.value = _fts
}

watchEffect(async () => {
  await showLoading(fetchNftSeries, fetching)
  await showLoading(fetchFtSeries, fetching)
})

onMounted(() => {
  if (userStore.user?.evmAddress) {
    chains.value.push({
      id: 2,
      name: 'Goerli',
      icon: ETH,
      value: import.meta.env.VITE_ETH_CHAIN,
    })
  }
})
</script>
