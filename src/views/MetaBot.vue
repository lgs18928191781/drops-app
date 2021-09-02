<template>
    <div class="inner-page-header">
        <div class="inner-page-header-left flex1">
            <div class="title"><img src="@/assets/images/bannet_icon_ins.svg" />MetaBot</div>
            <div class="drsc">由各个方块组建的头像NFT…（一段稍微介绍头像的文案）</div>
        </div>
        <div class="search-warp flex flex-align-center">
          <input
            class="flex1"
            v-model="keyword"
            :placeholder="$t('search')"
            @keyup.enter="search"
            type="text"
          />
          <img src="@/assets/images/icon_search.svg" @click="search" />
        </div>
    </div>

    <!-- MetaBot list -->
    <div class="meta-bot-list">
        
    </div>
</template>
<script lang="ts" setup>
import { ref } from "@vue/reactivity";


const keyword = ref('')

function search() {

}
</script>
<style lang="scss" scoped src="./MetaBot.scss"></style>