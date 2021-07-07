<template>
  <router-link :to="{ name: 'detail' }" class="nft-item">
    <div class="cover">
      <img alt="" />
    </div>
    <div class="cont">
      <div class="name">Saint Sophia</div>
      <div class="price" v-if="!isSelf">
        <div class="label">{{ $t('price') }}</div>
        <div class="aount">0.5 BSV</div>
      </div>
      <div class="author flex flex-align-center">
        <img class="" alt="" />
        <span class="username">HamzaKirbas</span>
      </div>
      <div class="operate" v-if="props.isSelf">
        <a class="btn btn-min btn-plain">上架出售</a>
      </div>
    </div>
    <div class="recommend-card flex flex-v" v-if="props.isRecommendCard">
      <div class="icon">
        <img src="@/assets/images/card_icon_fire.svg" />
      </div>
      <div class="title">{{ $t('recommentprod') }}</div>
      <div class="drsc flex1">
        {{ $t('recommenttext') }}
      </div>
      <div class="more">
        <a>{{ $t('getmore') }}<img src="@/assets/images/card_icon_ins.svg" /></a>
      </div>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue'
import { useStore, Mutation } from '@/store/index'

const store = useStore()
const appVersion = store.state.version // not reactive!
const count = computed(() => store.state.count)
const props = defineProps<{
  isRecommendCard?: boolean,
  isSelf?: boolean
}>()

function increment() {
  store.commit(Mutation.INCREMENT, 1)
}
</script>

<style lang="scss" scoped src="./Nft-item.scss"></style>
