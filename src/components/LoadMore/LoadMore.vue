<template>
    <div class="pagination">
        <div class="nothing" v-if="pagination.nothing">{{$t('nomore')}}</div>
        <div class="more-warp" v-else @click="getMore">
            <div class="tips">{{ $t('clickmore') }}</div>
            <div class="icon"><img src="@/assets/svg/home_icon_ins.svg" /></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmit } from "vue";

const emit = defineEmit(["getMore"]) // 定义事件
const props = defineProps<{
  pagination: Pagination
}>()

function getMore() {
    emit('getMore')
}
</script>
<style lang="scss" scoped src="./LoadMore.scss"></style>