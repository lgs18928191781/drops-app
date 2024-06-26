<template>
  <div class="launch-pad-wrap">
    <div class="top">
      <img :src="BG" alt="" />
    </div>
    <div class="p-4">
      <div class="font-medium">
        <div class="mb-2 text-base ">{{ $t('NFTs.lanuch_title1') }}</div>
        <el-select v-model="chain" placeholder="Select" style="width:100%">
          <template #prefix>
            <span>
              <img class="w-6 h-6" :src="chain == NftsLaunchPadChain.btc ? btc : mvc" alt="" />
            </span>
          </template>

          <el-option
            class="flex items-center my-2"
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
            <Icon :name="item.icon" custom-class="h-6 w-6 mr-2" />
            <span class="text-sm">{{ item.label }}</span>
          </el-option>
        </el-select>
      </div>

      <div class="mt-4 font-medium">
        <div class="mb-2 text-base ">{{ $t('NFTs.lanuch_title2') }}</div>
        <el-select v-model="useMakeMarket" placeholder="Select" style="width: 100%">
          <el-option
            v-for="item in optionMakeMarket"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled"
          />
        </el-select>
      </div>

      <div
        class="mt-20 text-base font-medium py-4 flex items-center cursor-pointer justify-center main-border primary"
        @click="next"
      >
        {{ $t('Nfts.launch_next') }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BG from '@/assets/nft/launchpad-bg.png'
import { ref, reactive, computed } from 'vue'
import { NftsLaunchPadChain, NftsLaunchPadChainSymbol } from '@/data/constants'
import btc from '@/assets/nft/btc.png'
import mvc from '@/assets/nft/mvc.png'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
const chain = ref<string>(NftsLaunchPadChain.btc)
const chainSymbol = computed(() => {
  return chain.value == NftsLaunchPadChain.btc
    ? NftsLaunchPadChainSymbol.btc
    : NftsLaunchPadChainSymbol.mvc
})
const useMakeMarket = ref(true)
const i18n = useI18n()
const router = useRouter()
const options = [
  {
    value: NftsLaunchPadChain.btc,
    label: NftsLaunchPadChain.btc,
    icon: 'logo_btc',
  },
  {
    value: NftsLaunchPadChain.mvc,
    label: NftsLaunchPadChain.mvc,
    icon: 'logo_mvc',
  },
]
const optionMakeMarket = reactive([
  {
    value: true,
    label: computed(() =>
      chain.value == NftsLaunchPadChain.btc
        ? i18n.t('Nfts.launch_noSupport')
        : i18n.t('Nfts.launch_yes')
    ),
    disabled: computed(() => chain.value == NftsLaunchPadChain.btc),
  },
  {
    value: false,
    label: computed(() => i18n.t('Nfts.launch_no')),
  },
])

function next() {
  router.push({
    name: 'genesisNfts',
    params: {
      chain: chainSymbol.value,
      type: chainSymbol.value == NftsLaunchPadChainSymbol.btc ? 0 : useMakeMarket.value ? 1 : 0,
    },
  })
}
</script>

<style scoped src="./LaunchPad.scss"></style>
