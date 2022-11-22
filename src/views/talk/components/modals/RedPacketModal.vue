<template>
  <TransitionRoot :show="layoutStore.isShowRedPacketModal">
    <Dialog @close="layoutStore.isShowRedPacketModal = false" class="relative z-50">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-transparent lg:bg-black/30" aria-hidden="true"></div>
      </TransitionChild>

      <div class="fixed inset-0 flex items-center justify-center">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0 scale-95"
          enter-to="opacity-100 scale-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100 scale-100"
          leave-to="opacity-0 scale-95"
        >
          <DialogPanel class="flex w-full h-full items-center justify-center">
            <div
              class="w-full h-full rounded bg-white lg:min-w-[456PX] lg:w-auto lg:h-auto lg:rounded-3xl relative lg:shadow-lg p-8"
            >
              <button
                class="absolute top-[32PX] right-[32PX] h-6 w-6 flex items-center justify-center outline-0"
              >
                <Icon
                  name="x_circle"
                  class="w-6 h-6 text-dark-400 cursor-pointer"
                  @click="layoutStore.isShowRedPacketModal = false"
                />
              </button>

              <DialogTitle as="h3" class="text-2xl text-center font-bold capitalize">
                {{ $t('Talk.Input.giveaway') }}
              </DialogTitle>

              <div class="mt-7.5">
                <TabGroup>
                  <TabList
                    class="w-full bg-dark-100 rounded-xl text-base flex text-dark-800 font-medium"
                  >
                    <Tab
                      class="w-full py-3 capitalize border-2 outline-0 rounded-xl transition-[background-color] duration-150"
                      :class="[
                        activeTab === 'redPacket'
                          ? 'border-dark-800 bg-primary'
                          : 'border-transparent',
                      ]"
                      @click="activeTab = 'redPacket'"
                    >
                      {{ $t('Talk.Input.for_everyone') }}
                    </Tab>
                    <Tab
                      class="w-full py-3 capitalize border-2 outline-0 rounded-xl transition-[background-color] duration-150"
                      :class="[
                        activeTab === 'nft' ? 'border-dark-800 bg-primary' : 'border-transparent',
                      ]"
                      @click="activeTab = 'nft'"
                      >{{ $t('Talk.Input.nft_limited') }}</Tab
                    >
                  </TabList>

                  <TabPanels>
                    <!-- 红包 -->
                    <TabPanel class="">
                      <div class="my-7.5 flex flex-col space-y-5 text-base">
                        <div class="grid grid-cols-4 gap-2 items-center">
                          <div class="capitalize font-medium">{{ $t('Talk.Input.quantity') }}</div>
                          <div class="col-span-3">
                            <input
                              type="number"
                              :placeholder="$t('Talk.Input.enter_quantity')"
                              class="main-border w-full p-4 outline-0 faded-switch still"
                            />
                          </div>
                        </div>
                        <div class="grid grid-cols-4 gap-2 items-center">
                          <div class="capitalize font-medium">{{ $t('Talk.Input.total') }}</div>
                          <div class="col-span-3 relative flex items-center">
                            <input
                              type="text"
                              placeholder="0"
                              class="main-border w-full p-4 outline-0 faded-switch still"
                            />
                            <div class="absolute right-0 z-10">
                              <Menu as="div" class="relative inline-block">
                                <div class="">
                                  <MenuButton
                                    class="text-base text-dark-800 flex items-center font-medium px-3 py-1 outline-0"
                                    @click="isShowSelectTokenModal = !isShowSelectTokenModal"
                                  >
                                    <span>Space</span>
                                    <Icon name="chevron_right" class="w-5 h-5 text-dark-480" />
                                  </MenuButton>
                                </div>

                                <transition
                                  enter-active-class="transition duration-100 ease-out"
                                  enter-from-class="transform scale-95 opacity-50 translate-y-[-10%]"
                                  enter-to-class="transform scale-100 opacity-100"
                                  leave-active-class="transition duration-75 ease-in"
                                  leave-from-class="transform scale-100 opacity-100"
                                  leave-to-class="transform scale-95 opacity-50 translate-y-[-10%]"
                                >
                                  <MenuItems
                                    class="absolute p-2 bg-white right-0 translate-y-[20PX] rounded-xl shadow-lg z-50 main-border still"
                                  >
                                    <MenuItem v-slot="{ active }">
                                      <button class="p-2">Space</button>
                                    </MenuItem>
                                    <MenuItem v-slot="{ active }">
                                      <button class="p-2">MC</button>
                                    </MenuItem>
                                    <MenuItem v-slot="{ active }">
                                      <button class="p-2">ShowCoin</button>
                                    </MenuItem>
                                  </MenuItems>
                                </transition>
                              </Menu>
                            </div>
                          </div>
                        </div>
                        <div class="grid grid-cols-4 gap-2 items-center">
                          <div class="capitalize font-medium">{{ $t('Talk.Input.blessings') }}</div>
                          <div class="col-span-3">
                            <input
                              type="text"
                              :placeholder="$t('Talk.Input.best_wishes')"
                              class="main-border w-full p-4 outline-0 faded-switch still"
                            />
                          </div>
                        </div>
                      </div>

                      <div
                        class="my-7.5 flex justify-center items-baseline text-dark-800 space-x-1"
                      >
                        <div class="text-4xl font-bold">{{ amountInTwoDecimals }}</div>
                        <div class="text-base">Space</div>
                      </div>

                      <div class="w-full">
                        <button
                          class="main-border uppercase font-medium text-base w-full py-4 bg-primary"
                        >
                          {{ $t('Talk.Input.send') }}
                        </button>
                      </div>

                      <div class="w-full mt-4 text-xs text-dark-300 text-center">
                        {{ $t('Talk.Input.red_packet_refund_tip') }}
                      </div>
                    </TabPanel>

                    <!-- NFT -->
                    <TabPanel class="">
                      <div class="my-7.5 flex flex-col space-y-5 text-base">
                        <div class="grid grid-cols-4 gap-2 items-center">
                          <div class="capitalize font-medium">{{ $t('Talk.Input.quantity') }}</div>
                          <div class="col-span-3">
                            <input
                              type="number"
                              :placeholder="$t('Talk.Input.enter_quantity')"
                              class="main-border w-full p-4 outline-0 faded-switch still"
                            />
                          </div>
                        </div>
                        <div class="grid grid-cols-4 gap-2 items-center">
                          <div class="capitalize font-medium">{{ $t('Talk.Input.total') }}</div>
                          <div class="col-span-3">
                            <input
                              type="text"
                              placeholder="0"
                              class="main-border w-full p-4 outline-0 faded-switch still"
                            />
                          </div>
                        </div>
                        <div class="grid grid-cols-4 gap-2 items-center">
                          <div class="capitalize font-medium">{{ $t('Talk.Input.blessings') }}</div>
                          <div class="col-span-3">
                            <input
                              type="text"
                              :placeholder="$t('Talk.Input.best_wishes')"
                              class="main-border w-full p-4 outline-0 faded-switch still"
                            />
                          </div>
                        </div>
                      </div>

                      <div
                        class="my-7.5 flex justify-center items-baseline text-dark-800 space-x-1"
                      >
                        <div class="text-4xl font-bold">{{ amountInTwoDecimals }}</div>
                        <div class="text-base">Space</div>
                      </div>

                      <div class="w-full">
                        <button
                          class="main-border uppercase font-medium tracking-wider text-base w-full py-4 bg-primary"
                        >
                          {{ $t('Talk.Input.send') }}
                        </button>
                      </div>

                      <div class="w-full mt-4 text-xs text-dark-300 text-center">
                        {{ $t('Talk.Input.red_packet_refund_tip') }}
                      </div>
                    </TabPanel>
                  </TabPanels>
                </TabGroup>
              </div>
            </div>
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script lang="ts" setup>
import { useLayoutStore } from '@/stores/layout'
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionRoot,
  TransitionChild,
  TabGroup,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Menu,
  MenuButton,
  MenuItems,
  MenuItem,
} from '@headlessui/vue'
import { computed, ref } from 'vue'

const layoutStore = useLayoutStore()

const amount = ref(10)
const isShowSelectTokenModal = ref(true)

const amountInTwoDecimals = computed(() => {
  return amount.value.toFixed(2)
})

const activeTab = ref('redPacket')
</script>
