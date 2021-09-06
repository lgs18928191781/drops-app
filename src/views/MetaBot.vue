<template>
    <div class="inner-page-header container flex flex-align-center">
        <div class="inner-page-header-left flex1">
            <div class="title flex flex-align-center"><img @click="router.back()" src="@/assets/images/bannet_icon_ins.svg" />MetaBot</div>
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

    <!-- banner -->
    <div class="banner container">
      <a><img src="" alt="" /></a>
    </div>

    <el-skeleton class="meta-bot-list container" :loading="isShowSkeleton" animated :count="pagination.pageSize">
      <template #template>
        <div class="meta-bot-item">
          <div class="cover">
            <el-skeleton-item variant="image" style="width: 100%; height: 100%; display: block; position: absolute; border-radius: 8px 8px 0 0;" />
          </div>
          <div class="cont">
            <div class="name"><el-skeleton-item variant="text" style="width: 30%;" /></div>
            <div class="user-list">
              <div class="user-item flex flex-align-center">
                <el-skeleton-item variant="text" style="width: 60%;" />
              </div>
              <div class="user-item flex flex-align-center">
                <el-skeleton-item variant="text" style="width: 60%;" />
              </div>
            </div>
            <el-skeleton-item class="btn btn-block btn-gray" variant="button " style="width: 100%; box-sizing: border-box; border: none;" />
          </div>
        </div>
      </template>
      <template #default>
        <!-- MetaBot list -->
        <div class="meta-bot-list container">
          <div class="meta-bot-item" v-for="metabot in metaBots">
            <div class="cover">
              <img src="" alt="" />
            </div>
            <div class="cont">
              <div class="name">ShowBot #888</div>
              <div class="user-list">
                <div class="user-item flex flex-align-center">
                  <img src="avatar" />
                  <span class="name">Show</span>
                  <span class="type">(铸造者)</span>
                </div>
                <div class="user-item flex flex-align-center">
                  <img src="avatar" />
                  <span class="name">Show</span>
                  <span class="type">(铸造者)</span>
                </div>
              </div>
              <div class="btn btn-block btn-gray">12.54 BSV</div>
            </div>
          </div>
        </div>
      </template>
    </el-skeleton>
    

    <div class="page-footer">
      <LoadMore
        :pagination="pagination"
        @getMore="getMore"
        v-if="metaBots.length > 0 && !isShowSkeleton"
      />
      <IsNull v-else />
    </div>

</template>
<script lang="ts" setup>
import { ref, reactive } from "@vue/reactivity";
import { useStore } from '@/store'
import LoadMore from '@/components/LoadMore/LoadMore.vue'
import IsNull from '../components/IsNull/IsNull.vue'
import { useRouter } from "vue-router";


const store = useStore()
const router = useRouter()
const isShowSkeleton = ref(true)
const keyword = ref('')
const metaBots = reactive([])
const pagination = reactive({
  ...store.state.pagination,
})

function search() {

}

function getMore () {

}

// isShowSkeleton.value = false
</script>
<style lang="scss" scoped src="./MetaBot.scss"></style>