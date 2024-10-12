<template>
  <ElDialog
    :model-value="modelValue"
    class="sm"
    :close-on-click-modal="false"
    :title="''"
    @close="saleSuccess"
    :show-close="true"
  >
  <div class="flex flex-col items-center justify-center">
    <div class="w-full flex flex-col items-center justify-center">
      <img class="w-[110px] h-[78px]" :src="ListSuccessIcon" alt="">
      <span class="text-2xl mt-[50px]">
       {{ $t('Nfts.list_success') }}
      </span>
    </div>
  
    <div @click="saleSuccess" class="main-border mt-[60px] cursor-pointer py-5 w-full primary flex items-center justify-center">
        {{ $t('Nfts.sale_success') }}
    </div>
  </div>
</ElDialog>
</template>
<script setup lang='ts'>
import ListSuccessIcon from "@/assets/images/list-success.png";
const props = defineProps<{
  modelValue: boolean
  //nft: NftOrderType
}>()
const emit = defineEmits(['update:modelValue','success'])

function saleSuccess(){
  emit('update:modelValue', false)
  emit("success")
}

</script>
<style lang='scss' scoped src="./SaleSuccess.scss">

</style>