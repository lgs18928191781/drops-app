<template>
  <footer>
    <a class="logo flex flex-align-center">
        <img src="@/assets/images/logo_shownft.svg" />
        Show<span>NFT</span>
    </a>
    <div class="cro">如有任何具体的想法或要求，请与我们联系。</div>
    <div class="bottom flex">
      <div class="email flex1">邮箱：metaid@metaid.io</div>
      <div class="copyright">ShowNFT © 2021</div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue'

import { useStore, Mutation } from '@/store/index'

const store = useStore()
const appVersion = store.state.version // not reactive!
const count = computed(() => store.state.count)
const props = defineProps<{
  // msg: string
}>()

function increment() {
  store.commit(Mutation.INCREMENT, 1)
}
</script>

<style lang="scss" scoped src="./Footer.scss"></style>
