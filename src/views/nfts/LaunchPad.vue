<template>
  <div class="launch-pad-wrap">
    <div class="top">
      <img :src="BG" alt="" />
    </div>
    <div class="p-4">
      <el-select v-model="chain" placeholder="Select" style="width:100%;font-size: 16px">
        <template #prefix>
          <span>
            <img class="w-6 h-6" :src="chain == NftsLaunchPadChain.btc ? btc : mvc" alt="" />
          </span>
        </template>

        <el-option
          class="flex items-center"
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
  </div>
</template>

<script setup lang="ts">
import BG from '@/assets/nft/launchpad-bg.png'
import { ref } from 'vue'
import { NftsLaunchPadChain } from '@/data/constants'
import btc from '@/assets/nft/btc.png'
import mvc from '@/assets/nft/mvc.png'
const chain = ref<string>(NftsLaunchPadChain.btc)
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
</script>

<style scoped src="./LaunchPad.scss"></style>
