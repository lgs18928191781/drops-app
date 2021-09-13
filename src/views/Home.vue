<template>
  <div class="home container">
    home
    <LoadMore :pagination="pagination" @getMore="getMore" />
    <IsNull />
  </div>
</template>
<script setup lang="ts">
import {} from '@/api'
import { useStore } from '@/store'
import { reactive, ref } from 'vue'
import LoadMore from '@/components/LoadMore/LoadMore.vue'

import IsNull from '../components/IsNull/IsNull.vue'
import { useI18n } from 'vue-i18n'

const i18n = useI18n()
const store = useStore()
const pagination = reactive({
  ...store.state.pagination,
})

//  加载更多
function getMore() {
  pagination.loading = true
  pagination.page++
}
</script>
<style lang="scss" scoped src="./Home.scss"></style>
