<template>
  <div class="collection" id="collection" v-if="collection.val">
    <!-- cover -->
    <ElSkeletonItem :variant="'image'" class="cover" />
    <Image class="cover" :src="''" />

    <div class="collection-content">
      <!-- collection-avatar -->
      <div class="collection-avatar">
        <img :src="''" />
      </div>

      <!-- collection-msg -->
      <div class="collection-msg flex">
        <div class="flex3">
          <div class="name flex flex-align-center">
            {{ collection.val!.name }} <Icon name="certed" />
          </div>
          <div class="creator flex flex-align-center">
            {{ $t('NFT.Creater') }}:
            <RouterLink :to="{ name: 'user', params: {metaId: collection.val!.creatorMetaId}}"
              ><UserName :name="collection.val!.name" :meta-name="collection.val!.creatorMetaName"
            /></RouterLink>
            <Icon name="center_star" />
          </div>
          <div class="drsc">
            <template v-if="collection.val!.intro.length > 100">
              <span class="text"> {{ collection.val!.intro.slice(0, 100) }}...</span
              ><a @click="isShowContent = true">{{ $t('NFT.Discover More') }}</a>
            </template>
            <template v-else>{{ collection.val!.intro }}</template>
          </div>
        </div>
        <div class="flex1">
          <div class="statiscs-list">
            <div class="statiscs-item" v-for="(item, index) in statiscs" :key="index">
              <div class="flex flex-align-center flex-pack-end">
                <div class="statiscs-item-warp">
                  <div class="value">{{ item.value() }}</div>
                  <div class="label">{{ item.name() }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- tab -->
      <div class="tab flex flex-align-center">
        <a
          v-for="(item, index) in tabs"
          :key="index"
          :class="{ active: item.value === tabActive }"
          @click="tabActive = item.value"
          >{{ item.name() }}</a
        >
      </div>

      <!-- CollectionWorks -->
      <template v-if="tabActive === NFTCollectTab.CollectionWorks">
        <!-- screen -->
        <ElAffix :offset="scrrentWarpOffsetTop">
          <div class="screen flex flex-align-center" id="screen">
            <div class="flex1">
              <a
                class="main-border flex flex-align-center"
                @click="isShowFilterWarp = !isShowFilterWarp"
              >
                <Icon name="filter" />
                <template v-if="isShowFilterWarp">{{ $t('NFT.Filter') }}</template>
              </a>
            </div>
            <ElSelect v-model="sortIndex" @change="refreshDatas">
              <ElOption
                v-for="(item, index) in sorts"
                :key="index"
                :label="item.name()"
                :value="index"
              />
            </ElSelect>
            <div class="display flex flex-align-center">
              <a
                @click="changeCell(item.value)"
                v-for="item in cells"
                :key="item.value"
                :class="{ active: item.value === cell.val.value }"
              >
                <Icon :name="item.icon" />
              </a>
            </div>
          </div>
        </ElAffix>

        <div class="collection-nft-content flex">
          <template v-if="isShowFilterWarp">
            <ElAffix :offset="filterWarpOffsetTop">
              <CollectionFilterWarp
                v-model:sell-type="sellType"
                v-model:price-range="priceRange"
                @change="refreshDatas"
              />
            </ElAffix>
          </template>

          <ElRow
            :gutter="22"
            class="nft-list flex1"
            v-infinite-scroll="getMore"
            :infinite-scroll-immediate="false"
            :infinite-scroll-distance="100"
          >
            <ElCol
              :xs="cell.val.xs"
              :sm="cell.val.sm"
              :md="cell.val.md"
              :lg="cell.val.lg"
              :xl="cell.val.xl"
              v-for="item in nfts"
              :key="item.nftGenesis + item.nftCodehash + item.nftTokenIndex"
            >
              <NFTItemVue :nft="item" @buy="buyNFT" />
            </ElCol>
          </ElRow>
        </div>

        <LoadMore :pagination="pagination" />
      </template>
      <!-- PriceTrend -->
      <template v-else></template>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped src="./CollectionSkeleton.scss"></style>
