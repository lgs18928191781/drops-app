<template>
  <div class="create-success">
    <ElSkeleton :loading="isShowSkeleton" animated>
      <template #template>
        <ElSkeletonItem class="title" variant="h1" />
      </template>
      <template #default>
        <div class="title" v-if="route.query.type === 'created'">{{ $t('createdSuccessTitle') }}</div>
        <div class="title" v-else-if="route.query.type === 'buyed'">{{ $t('buySuccessTitle') }}</div>
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
          <template v-if="route.query.type === 'created'">
            <a class="btn flex1 btn-block" @click="offSale" v-if="nft.val.putAway">{{
              $t('offsale')
            }}</a>
            <a class="btn flex1 btn-block" @click="toSale" v-else>{{ $t('salenft') }}</a>
          </template>
          
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
import { checkSdkStatus } from '@/utils/util'
import NFTDetail from '@/utils/nftDetail'
import { useStore } from '@/store'

const route = useRoute()
const router = useRouter()
const i18n = useI18n()
const store = useStore()

// @ts-ignore
const nft: { val: NftItemDetail } = reactive({
  val: {},
})

const isShowSkeleton = ref(true)

function getDetail() {
  return new Promise<void>(async (resolve) => {
    // 防止铸造完立刻跳转拿不到数据回来，检查上完链再获取数据
    if (route.query.txId && typeof route.query.txId === 'string') {
      await store.state.sdk?.checkTxIdStatus(route.query.txId)
    }
    const _nft = await NFTDetail(
      typeof route.params.genesisId === 'string' ? route.params.genesisId : '',
      typeof route.params.codehash === 'string' ? route.params.codehash : '',
      typeof route.params.tokenIndex === 'string' ? route.params.tokenIndex : '',
    ).catch(() => isShowSkeleton.value = false)
    if (_nft && typeof _nft !== 'boolean') {
      nft.val = _nft
      isShowSkeleton.value = false
    }
    resolve()
  })
}



function toDetail() {
  router.replace({ name: 'detail', params: { 
    genesisId: nft.val.genesis,
    codehash: nft.val.codeHash,
    tokenIndex: nft.val.tokenIndex
  } })
}

function toSale() {
  router.replace({ name: 'sale', params: { 
    genesisId: nft.val.genesis,
    codehash: nft.val.codeHash,
    tokenIndex: nft.val.tokenIndex
  } })
}

async function offSale() {
  await checkSdkStatus()
  const loading = ElLoading.service({
      lock: true,
      text: 'Loading',
      spinner: 'el-icon-loading',
      background: 'rgba(0, 0, 0, 0.7)',
      customClass: 'full-loading',
  })
  ElMessageBox.confirm(
    `${i18n.t('offsaleConfirm')} ${nft.val.nftName} ?`,
    i18n.t('niceWarning'),
    {
      confirmButtonText: i18n.t('confirm'),
      cancelButtonText: i18n.t('cancel'),
      closeOnClickModal: false
    }
  ).then(async () => {
    NftOffSale(nft.val, loading)
      .then(() => {
        nft.val.putAway = false
        loading.close()
      })
      .catch(() => {
        loading.close()
      })
  })
  .catch(() => loading.close())
}

if (route.params.genesisId && route.params.codehash && route.params.tokenIndex) {
  getDetail()
}
</script>
<style lang="scss" scope src="./NftSuccess.scss"></style>
