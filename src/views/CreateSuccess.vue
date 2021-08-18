<template>
  <div class="create-success">
    <ElSkeleton :loading="isShowSkeleton" animated>
      <template #template>
        <ElSkeletonItem class="title" variant="h1" />
      </template>
      <template #default>
        <div class="title">{{ $t('createdSuccessTitle') }}</div>
      </template>
    </ElSkeleton>
    <!-- nft 信息 卡片 -->
    <NftMsgCard
      :skeleton="isShowSkeleton"
      :user-name="nft.val.foundryName"
      :cover-url="nft.val.coverUrl"
      :name="nft.val.nftName"
      :created-at="nft.val.forgeTime"
      :meta-id="nft.val.foundryMetaId"
    />

    <ElSkeleton :loading="isShowSkeleton" animated>
      <template #template>
        <div class="operates flex flex-align-center">
          <ElSkeletonItem class="btn btn-plain btn-block flex1" variant="button" />
          <ElSkeletonItem class="btn btn-plain btn-block flex1" variant="button" />
        </div>
      </template>
      <template #default>
        <div class="operates flex flex-align-center">
          <a class="btn btn-plain btn-block flex1" @click="toDetail">{{ $t('lookNftDetail') }}</a>
          <a class="btn flex1 btn-block" @click="offSale" v-if="nft.val.putAway">{{
            $t('offsale')
          }}</a>
          <a class="btn flex1 btn-block" @click="toSale" v-else>{{ $t('salenft') }}</a>
        </div>
      </template>
    </ElSkeleton>
  </div>
</template>

<script lang="ts" setup>
import { GetNftDetail, NftApiCode } from '@/api'
import NftMsgCard from '@/components/NftMsgCard/NftMsgCard.vue'
import { reactive, ref } from '@vue/reactivity'
import { useRoute, useRouter } from 'vue-router'
import { ElSkeleton, ElSkeletonItem, ElMessageBox, ElLoading } from 'element-plus'
import { useI18n } from 'vue-i18n'
import NftOffSale from '@/utils/offSale'

const route = useRoute()
const router = useRouter()
const i18n = useI18n()

// @ts-ignore
const nft: { val: NftItemDetail } = reactive({
  val: {},
})

const isShowSkeleton = ref(true)

function getDetail() {
  return new Promise<void>(async (resolve) => {
    if (typeof route.params.tokenId === 'string') {
      const res = await GetNftDetail({
        tokenId: route.params.tokenId,
      })
      if (res.code === NftApiCode.success) {
        nft.val = res.data
        isShowSkeleton.value = false
      }
    }
    resolve()
  })
}

function toDetail() {
  router.push({ name: 'detail', params: { tokenId: route.params.tokenId } })
}

function toSale() {
  router.push({ name: 'sale', params: { tokenId: route.params.tokenId } })
}

function offSale() {
  ElMessageBox.confirm(
    `${i18n.t('offsaleConfirm')} ${nft.val.nftName} ?`,
    i18n.t('niceWarning')
  ).then(async () => {
    const loading = ElLoading.service({
      lock: true,
      text: 'Loading',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)',
      customClass: 'full-loading',
    })
    NftOffSale(nft.val)
      .then(() => {
        nft.val.putAway = false
        loading.close()
      })
      .catch(() => {
        loading.close()
      })
  })
}

if (route.params.tokenId) {
  getDetail()
}
</script>
<style lang="scss" scope src="./CreateSuccess.scss"></style>
