<template>
  <div id="header-nav-content" class=" flex flex-align-center">
    <div @click="tohome" class="icon-warp cursor-pointer">
       <img :src="Logo" alt="">
    </div>
    <slot></slot>
  </div>
</template>
<script setup lang='ts'>
import { useRoute,useRouter } from 'vue-router'
import Logo from '@/assets/images/drop-logo.svg?url'
const router = useRouter()
function tohome(){
  router.push({
    name:'home'
  })
}


</script>
<style lang='scss' src="./HeaderNavWrap.scss" scoped>

</style>