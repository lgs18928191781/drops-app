<template>
  <TransitionRoot :show="layout.isShowRedPacketOpenModal" :unmount="true">
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
              class="flex w-full h-full lg:max-w-screen-sm lg:items-stretch justify-center lg:w-auto relative lg:static lg:h-auto"
            >
              <div class="flex flex-col items-center justify-center group">
                <div class="w-[95vw] lg:w-108 h-15 flex items-end">
                  <img :src="GiftRibbonImg" al="" />
                </div>
                <div
                  class="bg-white rounded-3xl w-[80vw] lg:w-114 h-105 flex flex-col dark:shadow-lg dark:shadow-blue-100/30"
                >
                  <div
                    class="lg:w-114 h-60 bg-gradient-to-tr from-[#CBFDE4] to-[#FCEDCE] rounded-t-3xl shadow-md flex flex-col items-center justify-start overflow-x-hidden group-hover:-skew-x-3 group-hover:shadow-xl duration-300 origin-top"
                  >
                    <UserAvatar
                      :meta-id="message.metaId"
                      :image="message.avatarImage"
                      class="w-15 h-15 rounded-2xl bg-amber-200 mt-7.5"
                      :disabled="true"
                    />
                    <div class="mt-3 text-sm text-dark-300 capitalize">
                      {{ $t('Talk.Modals.red_packet') }}
                    </div>
                    <div
                      class="text-2xl mt-3 truncate w-full px-6 lg:px-12 text-center dark:text-dark-800"
                    >
                      {{ note }}
                    </div>
                  </div>
                  <div class="w-full flex items-stretch justify-center grow relative">
                    <div
                      class="absolute top-0 w-28 h-28 rounded-full gift-button-gradient flex items-center justify-center text-dark-800 text-xl capitalize -translate-y-1/2 border-2 border-b-5 border-solid border-dark-300 shadow-xl box-content font-medium group-hover:-translate-y-[53%] group-hover:skew-x-1 origin-bottom duration-300 cursor-pointer hover:text-amber-500 hover:shadow-amber-300/40 hover:border-amber-300"
                      @click="tryOpenRedPacket"
                    >
                      {{ $t('Talk.Modals.receive') }}
                    </div>
                    <div class="w-15 bg-gradient-to-br from-[#F5FFE4] to-[#FCEDCE]"></div>
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
import { useLayoutStore } from '@/stores/layout'
import { Dialog, DialogPanel, TransitionRoot, TransitionChild } from '@headlessui/vue'
import GiftRibbonImg from '@/assets/images/gift_ribbon.svg?url'
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { openRedPacket } from '@/utils/talk'
import { useUserStore } from '@/stores/user'
import { getRedPacketRemains } from '@/api/talk'
import { useTalkStore } from '@/stores/talk'
import { useModalsStore } from '@/stores/modals'

const layout = useLayoutStore()
const modals = useModalsStore()

const message = modals.openRedPacket?.message
const i18n = useI18n()
const talk = useTalkStore()
const remains = ref([])
const canOpen = computed(() => remains.value.length > 0)

const note = computed(() => {
  return message?.data?.content || i18n.t('Talk.Channel.default_red_envelope_message')
})

const tryOpenRedPacket = async () => {
  const userStore = useUserStore()
  const iTake = remains.value[0]
  const redPacket = {
    subId: message?.data.subId,
    code: message?.data.code,
    type: 'mvc',
    createTime: message?.data.createTime,
    iTake,
    id: message?.txId,
  }
  await openRedPacket(redPacket, userStore.showWallet)
}

const closeModal = () => {
  modals.openRedPacket = null
  layout.isShowRedPacketOpenModal = false
}

onMounted(async () => {
  const channelId = talk.activeChannelId
  const redPacketId = message?.txId
  getRedPacketRemains({ channelId, redPacketId }).then(res => {
    remains.value = res
    console.log('remains', remains.value)
  })
})
</script>

<style lang="scss" scoped>
.gift-button-gradient {
  background: linear-gradient(
    221deg,
    #faedcf 9%,
    #eef6e3 36%,
    #eee8e2 70%,
    #cefde8 90%,
    #d2fae7 90%
  );
}
</style>
