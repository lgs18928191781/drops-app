<template>
  <TransitionRoot :show="layout.isShowRedPacketResultModal" :unmount="true">
    <Dialog @close="closeModal" class="relative z-50">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/30"></div>
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div
          class="flex h-full overflow-y-hidden lg:h-auto lg:min-h-full items-center justify-center"
        >
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-75"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-75"
          >
            <DialogPanel
              class="flex w-full h-full lg:max-w-screen-sm lg:items-stretch justify-center lg:w-auto relative lg:static lg:h-auto text-dark-800"
            >
              <div class="flex flex-col items-center justify-center">
                <div class="w-[95vw] lg:w-108 h-15 flex items-end">
                  <img :src="GiftRibbonImg" al="" />
                </div>

                <div
                  class="bg-white rounded-3xl w-[90vw] lg:w-114 flex flex-col dark:shadow-lg dark:shadow-blue-100/30 items-center p-7.5"
                >
                  <div class="flex justify-end self-stretch">
                    <button @click="closeModal" class="outline-none">
                      <Icon
                        name="x"
                        class="w-6 h-6 box-content text-dark-400 bg-dark-200 rounded-full p-1.5"
                      />
                    </button>
                  </div>
                  <UserAvatar
                    :meta-id="redPacketResult?.metaId"
                    :image="redPacketResult?.avatarImage"
                    class="w-15 h-15 rounded-2xl mt-4.5"
                    :disabled="true"
                  />
                  <div class="mt-4 text-sm text-dark-300 capitalize font-bold">
                    {{ $t('Talk.Modals.red_packet') }}
                  </div>
                  <div class="text-lg truncate w-full px-6 lg:px-12 text-center text-amber-400">
                    {{ note }}
                  </div>

                  <div class="mt-7.5 flex items-end space-x-1">
                    <div class="text-4xl font-bold tracking-tight">
                      {{ nicerAmountWithUnit(myDraw?.amount).amount }}
                    </div>
                    <div class="text-base">
                      {{ nicerAmountWithUnit(myDraw?.amount).unit }}
                    </div>
                  </div>
                  <!-- <div class="mt-2 text-sm text-dark-300 font-bold font-sans">
                    ≈ 723.00 CNY
                  </div> -->

                  <div
                    class="mt-7.5 mb-1.5 flex items-center justify-between self-stretch text-sm text-dark-300"
                  >
                    <div class="">Draws</div>
                    <div class="">{{ `Opened ${draws.length} / ${redPacketResult.count}` }}</div>
                  </div>

                  <div
                    class="h-[218PX] self-stretch flex flex-col items-stretch overflow-y-auto divide-y divide-solid divide-gray-100"
                  >
                    <div class="flex items-center justify-between py-3" v-for="draw in sortedDraws">
                      <div class="flex space-x-3 items-center">
                        <UserAvatar
                          :meta-id="draw.metaId"
                          :image="draw.avatarImage"
                          class="w-12 h-12"
                        />
                        <div class="flex flex-col space-y-0.5 items-start">
                          <span class="text-sm text-dark-800 font-medium">{{ draw.name }}</span>
                          <span class="text-xs text-dark-250">
                            {{ formatTimestamp(draw.timestamp, i18n) }}
                          </span>
                        </div>
                      </div>

                      <div class="flex flex-col space-y-1 items-end">
                        <div class="text-sm text-dark-800 font-medium">
                          {{
                            nicerAmountWithUnit(draw.amount).amount +
                              ' ' +
                              nicerAmountWithUnit(draw.amount).unit
                          }}
                        </div>
                        <!-- <div class="text-xs text-dark-250 font-sans">≈ 723.00 CNY</div> -->
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script lang="ts" setup>
import { Dialog, DialogPanel, TransitionRoot, TransitionChild } from '@headlessui/vue'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { useLayoutStore } from '@/stores/layout'
import { useModalsStore } from '@/stores/modals'
import GiftRibbonImg from '@/assets/images/gift_ribbon.svg?url'
import { formatTimestamp } from '@/utils/talk'

const layout = useLayoutStore()
const modals = useModalsStore()
const i18n = useI18n()

const closeModal = () => {
  modals.redPacketResult = null
  layout.isShowRedPacketResultModal = false
}

const redPacketResult = modals.redPacketResult
const note = computed(() => {
  return redPacketResult?.content || i18n.t('Talk.Channel.default_red_envelope_message')
})
const draws = computed(() => {
  return (redPacketResult?.payList || []).filter((item: any) => item.used === 'true')
})
const myDraw = computed(() => {
  console.log(draws.value)
  return draws.value.find((item: any) => item.metaid === redPacketResult?.metaId)
})
const sortedDraws = computed(() => {
  return draws.value.sort((a: any, b: any) => b.timestamp - a.timestamp)
})
const nicerAmountWithUnit = (amount: string) => {
  if (!amount) {
    return {
      amount: '0',
      unit: '',
    }
  }

  const amountNumber = Number(amount)
  if (amountNumber >= 100_000_000) {
    return {
      amount: `${(amountNumber / 100_000_000).toFixed(2)}`,
      unit: 'Space',
    }
  }

  return {
    amount,
    unit: 'Sats',
  }
}
</script>
