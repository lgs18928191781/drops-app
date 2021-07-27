<template>
  <div class="create">
    <div class="create-header flex flex-align-center">
      <img class="icon" src="@/assets/images/bannet_icon_ins.svg" @click="$router.back()" />
      <div class="title flex1 flex flex-align-center">
        <span class="flex1">{{ $t('salenft') }}</span>
        <router-link :to="{ name: 'saleLegend'}">{{ $t('saledrsc') }}<i class="el-icon-arrow-right" /></router-link>
      </div>
    </div>
    
    <div class="cont-warp">
      <div class="nft-sale-set">
        <div class="msg flex">
          <!-- <img class="cover" :src="nft.val.coverUrl" :alt="nft.val.nftName" /> -->
          <el-image class="cover"
            :src="nft.val.coverUrl"
            :alt="nft.val.nftName"
            fit="cover"
            :preview-src-list="[nft.val.coverUrl]">
          </el-image>
          <div class="cont flex1 flex flex-v">
            <div class="flex1">
              <div class="name">{{ nft.val.nftName }}</div>
              <div class="msg-item flex flex-align-center">
                <span class="key">{{ $t('creater') }}：</span>
                <div class="value  flex1 flex flex-align-center">
                  <div class="author flex flex-align-center">
                    <img class="" :src="$filters.avatar(nft.val.foundryMetaId)" :alt="nft.val.foundryName" />
                    <span class="username">{{ nft.val.foundryName }}</span>
                  </div>
                </div>
              </div>
              <div class="msg-item flex flex-align-center">
                <span class="key">{{ $t('createtime') }}：</span>
                <div class="value flex1">{{ $filters.dateTimeFormat(nft.val.forgeTime) }}</div>
              </div>
            </div>
            <CertTemp />
          </div>
        </div>
        <div class="form">
          <div class="form-item">
            <!-- <div class="title">时间</div> -->
            <div class="cont flex flex-align-center">
              <!-- <input
                v-model="$filters.dateTimeFormat(saleTime)"
                :placeholder="$t('timeplac')"
                type="datetime"
                class="flex1"
              />
               -->
              <ElDatePicker
                class="el-datetime flex1"
                v-model="saleTime"
                :editable="false"
                :clearable="false"
                type="datetime"
                :placeholder="$t('timeplac')"
              >
              </ElDatePicker>
              <img class="icon" src="@/assets/images/list_icon_calendar.svg" />
            </div>
          </div>
          <div class="form-item">
            <!-- <div class="title">价格</div> -->
            <div class="cont flex flex-align-center">
              <input
                v-model="saleAmount"
                min="0"
                :placeholder="$t('priceplac')"
                type="number"
                class="flex1"
              />
              <div class="type">
                <ElDropdown trigger="click">
                  <span class="flex flex-align-center"> BSV <span class="arrow"></span> </span>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item>BSV</el-dropdown-item>
                      <el-dropdown-item>狮子头</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </ElDropdown>
              </div>
            </div>
          </div>
          <div class="to-histiry">
            <a>{{ $t('seehistoryprice') }}</a>
          </div>
        </div>
        <div class="btn btn-block" @click="confirmSale">{{ $t('confirmsale') }}</div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { GetNftDetail, NftApiCode, SaleNft } from '@/api'
import { reactive, ref } from '@vue/reactivity'
import { useRoute, useRouter } from 'vue-router'
import { ElDropdown, ElDropdownItem, ElDropdownMenu, ElMessage, ElDatePicker } from 'element-plus'
import { useI18n } from 'vue-i18n'

const i18n = useI18n()
const route = useRoute()
const router = useRouter()
const nft: { val: NftItemDetail } = reactive({
  val: {
    foundryName: 'string',
    foundryMetaId: 'string',
    foundryHead: 'string',
    amount: 0,
    remainingTime: 0,
    nftName: 'string',
    classify: 'string',
    describe: 'string',
    forgeTime: 0,
    contractAddress: 'string',
    tokenId: 'string',
    ownerName: 'string',
    ownerMetaId: 'string',
    ownerHead: 'string',
    type: 'string',
    revenue: 'string',
    coverUrl: 'string',
  },
})

const saleTime = ref('')
const saleAmount = ref('')

function getDetail () {
  return new Promise<void>(async (resolve) => {
    if (typeof route.params.tokenId === 'string') {
      const res = await GetNftDetail({
        tokenId: route.params.tokenId,
      })
      if (res.code === NftApiCode.success) {
        nft.val = res.data
      }
    }
    resolve()
  })
}


if (route.params.tokenId) {
  getDetail()
}

async function confirmSale() {
  const res = await SaleNft({
    sellValidTime: new Date(saleTime.value).getTime(),
    amount: saleAmount.value,
    tokenId: nft.val.tokenId,
  })
  if (res.code === NftApiCode.success) {
    ElMessage.success(i18n.t('saleSuccess'))
    router.back()
  }
}
</script>
<style lang="scss" scoped src="./Sale.scss"></style>
