<template>
  <ElDialog
    :model-value="modelValue"
    class="sm none-padding"
    :close-on-click-modal="!loading"
    :title="$t('NFT.Transfer')"
    @close="emit('update:modelValue', false)"
    :show-close="!loading"
  >
    <div class="nft-buy">
      <NFTMsgVue :nft="nft" />

      <div class="cont-warp">
        <template v-if="transferUser.val">
          <div class="tranfer-user flex flex-align-center">
            <UserAvatar
              :meta-id="transferUser.val!.metaId"
              :image="transferUser.val!.avatarImage"
              :name="transferUser.val!.name"
              :meta-name="transferUser.val!.metaName"
              :disabled="true"
            />
            <div class="flex1">
              <template v-if="transferUser.val!.metaId === ''">
                Address:
                <div>{{ transferUser.val!.address }}</div>
              </template>
              <template v-else>
                <div class="name">
                  <UserName
                    :name="transferUser.val!.name"
                    :meta-name="transferUser.val!.metaName"
                  />
                </div>
                <div class="metaid">
                  MetaID:{{ transferUser.val!.metaId.slice(0,6)}}
                  ...
                  {{ transferUser.val!.metaId.slice(-6) }}
                </div>
              </template>
            </div>
          </div>

          <div class="operate flex flex-align-center flex-pack-center" @click="transfer">
            <a class="main-border flex1" @click="cancelTransfer" :class="{ faded: loading }">
              {{ $t('Cancel') }}</a
            >
            <a class="main-border primary flex1" @click="confirmTransfer" v-loading="loading">
              {{ $t('NFT.Confirm Transfer') }}</a
            >
          </div>
        </template>

        <template v-else>
          <ElForm :label-position="'top'">
            <ElFormItem :label="$t('NFT.Transfer Account')">
              <ElInput
                type="text"
                v-model="form.target"
                placeholder="MetaID/Address/Paymail/MetaName"
              />
            </ElFormItem>
          </ElForm>
          <div class="operate  flex flex-align-center flex-pack-center" @click="transfer">
            <a
              class="main-border primary flex1"
              v-loading="loading"
              :element-loading-svg="LoadingTEXT"
              :element-loading-text="$t('Loading')"
              >{{ $t('NFT.Transfer') }}</a
            >
          </div>
        </template>
      </div>
    </div>
  </ElDialog>
</template>

<script setup lang="ts">
import { NodeName, PayPlatform, SdkPayType } from '@/enum'
import { useRootStore } from '@/stores/root'
import { useUserStore } from '@/stores/user'
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import NFTMsgVue from '../NFTMsg/NFTMsg.vue'
import { PayPlatformItem, payPlatformList } from '@/config'
import { GetMetaIdByAddress, GetMetaNameInfo, GetUserAllInfo } from '@/api/aggregation'
import { LoadingTEXT } from '@/utils/LoadingSVGText'
import { email } from '@/utils/reg'
import { mvc } from 'mvc-scrypt/dist'
import { getAccountUserInfo } from '@/utils/util'

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
  if (form.target === '' || loading.value) return

  if (props.nft.nftChain === 'mvc' || props.nft.nftChain === 'bsv') {
    loading.value = true
    const res = await getAccountUserInfo(form.target).catch(error => {
      ElMessage.error(error.message)
      loading.value = false
    })
    if (res) {
      transferUser.val = res
      loading.value = false
      form.target = ''
    }
  } else {
    return ElMessage.info(i18n.t('NFT.Not Support Current Chain NFT Transfer'))
  }
}

async function confirmTransfer() {
  if (loading.value) return
  loading.value = true
  const res = await userStore.showWallet
    .createBrfcChildNode(
      {
        nodeName: NodeName.NftTransfer,
        data: JSON.stringify({
          receiverAddress: transferUser.val!.address,
          codehash: props.nft.nftCodehash,
          genesis: props.nft.nftGenesis,
          tokenIndex: props.nft.nftTokenIndex,
        }),
      },
      {
        payType: SdkPayType.ME, //props.nft.nftChain === 'bsv' ? SdkPayType.BSV : SdkPayType.ME,
      }
    )
    .catch(error => {
      ElMessage.error(error.message)
      loading.value = false
    })
  if (res) {
    emit('success', {
      ...props.nft,
      nftOwnerUserInfo: {
        address: transferUser.val!.address,
        avatarTxId: transferUser.val!.avatarTxId,
        avatarType: transferUser.val!.coverType,
        avatarImage: transferUser.val!.avatarImage,
        coverPublicKey: '',
        coverType: transferUser.val!.coverType,
        coverUrl: '',
        metaIdTimestamp: '',
        name: transferUser.val!.name,
        nameType: '',
        metaName: transferUser.val!.metaName,
        nftNamePublicKey: '',
        publicKey: '',
      },
      nftOwnerAddress: transferUser.val!.address,
      nftOwnerAvatarTxId: transferUser.val!.avatarTxId,
      nftOwnerAvatarType: transferUser.val!.coverType,
      nftOwnerAvatarImage: transferUser.val!.avatarImage,
      nftOwnerMetaId: transferUser.val!.metaId,
      nftOwnerName: transferUser.val!.name,
    })
    ElMessage.success(i18n.t('NFT.Transfer Success'))
    emit('update:modelValue', false)
    loading.value = false
  } else {
    loading.value = false
  }
  // const res = await userStore.showWallet
  //   .transferNFT({
  //     receiverAddress: transferUser.val!.address,
  //     codehash: props.nft.nftCodehash,
  //     genesis: props.nft.nftGenesis,
  //     tokenIndex: props.nft.nftTokenIndex,
  //   })
  //   .catch(error => {
  //     ElMessage.error(error.message)
  //     loading.value = false
  //   })
  // if (res && res.txid) {
  //   emit('success')
  //   ElMessage.success(i18n.t('NFT.Transfer Success'))
  //   emit('update:modelValue', false)
  //   loading.value = false
  // }
}

function cancelTransfer() {
  if (loading.value) return
  transferUser.val = null
}
</script>

<style lang="scss" scoped src="./NFTTransfer.scss"></style>
