<template>
  <a class="nft-item">
    <div class="cover">
      <img alt="" />
    </div>
    <div class="name">Saint Sophia</div>
    <div class="price">
      <div class="label">价格</div>
      <div class="aount">0.5 BSV</div>
    </div>
    <div class="author flex flex-align-center">
      <img class="" alt="" />
      <span class="username">HamzaKirbas</span>
    </div>
  </a>
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

<style lang="scss" scoped src="./Nft-item.scss"></style>
