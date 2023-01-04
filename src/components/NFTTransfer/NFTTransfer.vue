<template>
  <ElDialog
    :model-value="modelValue"
    class="sm none-padding"
    :close-on-click-modal="!loading"
    :title="$t('NFT.Transfer')"
    @close="emit('update:modelValue', false)"
  >
    <div
      class="nft-buy"
      v-loading="loading"
      :element-loading-svg="LoadingTEXT"
      :element-loading-text="$t('Loading')"
    >
      <NFTMsgVue :nft="nft" />

      <div class="cont-warp">
        <template v-if="transferUser.val">
          <div class="tranfer-user flex flex-align-center">
            <UserAvatar
              :meta-id="transferUser.val!.metaId"
              :image="transferUser.val!.avatarImage"
              :name="transferUser.val!.name"
              :disabled="true"
            />
            <div class="flex1">
              <div class="name">{{ transferUser.val!.name }}</div>
              <div class="metaid">
                {{ transferUser.val!.metaId.slice(0,6)}}...{{ transferUser.val!.metaId.slice(-6)  }}
              </div>
            </div>
          </div>

          <div class="operate flex flex-align-center flex-pack-center" @click="transfer">
            <a class="main-border flex1" @click="transferUser.val = null"> {{ $t('Cancel') }}</a>
            <a class="main-border primary flex1" @click="confirmTransfer">
              {{ $t('NFT.Confirm Transfer') }}</a
            >
          </div>
        </template>

        <template v-else>
          <ElForm :label-position="'top'">
            <ElFormItem
              :label="
                nft.nftChain === 'mvc'
                  ? $t('NFT.Transfer MetaId')
                  : nft.nftChain + '&nbsp;' + $t('Address')
              "
            >
              <ElInput type="text" v-model="form.target" />
            </ElFormItem>
          </ElForm>
          <div class="operate  flex flex-align-center flex-pack-center" @click="transfer">
            <a class="main-border primary flex1">{{ $t('NFT.Transfer') }}</a>
          </div>
        </template>
      </div>
    </div>
  </ElDialog>
</template>

<script setup lang="ts">
import { PayPlatform } from '@/enum'
import { useRootStore } from '@/stores/root'
import { useUserStore } from '@/stores/user'
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import NFTMsgVue from '../NFTMsg/NFTMsg.vue'
import { PayPlatformItem, payPlatformList } from '@/config'
import { GetMetaIdByAddress, GetUserAllInfo } from '@/api/aggregation'
import { LoadingTEXT } from '@/utils/LoadingSVGText'

const props = defineProps<{
  modelValue: boolean
  nft: GenesisNFTItem
  isHideDetail?: boolean
}>()

const emit = defineEmits(['update:modelValue', 'success'])
const rootStore = useRootStore()
const userStore = useUserStore()
const i18n = useI18n()
const isShowPayTypes = ref(false)
const transferUser: { val: UserAllInfo | null } = reactive({
  val: null,
})
const form = reactive({
  target: '',
})

const loading = ref(false)

const currentPayPlatform = ref(
  userStore.isAuthorized && userStore.user?.evmAddress ? PayPlatform.ETH : PayPlatform.UnionPay
)

function choosePayPlatform(item: PayPlatformItem) {
  if (item.disabled()) return
  currentPayPlatform.value = item.platform
}

async function transfer() {
  if (form.target === '') return
  loading.value = true

  if (props.nft.nftChain === 'mvc') {
    let metaId: string
    if (form.target.length === 64) {
      // MetaId
      metaId = form.target
    } else {
      const res = await GetMetaIdByAddress(form.target)
      if (res.code === 0) {
        metaId = res.data
      }
    }

    const res = await GetUserAllInfo(metaId!).catch(error => {
      ElMessage.error(error.message)
      loading.value = false
    })
    if (res?.code === 0) {
      transferUser.val = res.data
      form.target = ''
      loading.value = false
    }
  } else {
  }
}

async function confirmTransfer() {
  loading.value = true
  const res = await userStore.showWallet
    .transferNFT({
      receiverAddress: transferUser.val!.address,
      codehash: props.nft.nftCodehash,
      genesis: props.nft.nftGenesis,
      tokenIndex: props.nft.nftTokenIndex,
    })
    .catch(error => {
      ElMessage.error(error.message)
      loading.value = false
    })
  if (res && res.txid) {
    emit('success')
    ElMessage.success(i18n.t('NFT.Transfer Success'))
    emit('update:modelValue', false)
    loading.value = false
  }
}
</script>

<style lang="scss" scoped src="./NFTTransfer.scss"></style>
