<template>
  <ElDialog
    :model-value="modelValue"
    class="sm none-padding"
    :close-on-click-modal="false"
    :title="$t('NFT.Order Information')"
  >
    <div class="nft-buy">
      <NFTMsgVue :nft="nft" />

      <div class="nft-msg-list">
        <div class="nft-msg-item flex flex-align-center">
          <div class="key flex1">{{ $t('NFT.Creater') }}：</div>
          <div class="value flex flex-align-center">
            <UserAvatar :meta-id="nft.nftIssueMetaId" :image="nft.nftIssueAvatarImage" />{{
              nft.nftIssuer
            }}
          </div>
        </div>

        <div class="nft-msg-item flex flex-align-center">
          <div class="key flex1">{{ $t('NFT.Create Time') }}：</div>
          <div class="value flex flex-align-center">
            {{ $filters.dateTimeFormat(nft.nftTimestamp) }}
          </div>
        </div>

        <div class="nft-msg-item flex flex-align-center" v-if="!isHideDetail">
          <div class="key flex1">{{ $t('NFT.NFT Details') }}：</div>
          <div class="value flex flex-align-center">
            <Icon name="down" />
          </div>
        </div>

        <div class="nft-msg-item flex flex-align-center">
          <div class="key flex1">{{ $t('NFT.Payment Method') }}：</div>
          <div class="value flex flex-align-center">
            <!-- <ElDropdown trigger="click" @visible-change="value => (isShowPayTypes = value)">
              <a class="flex flex-align-center pay-item" :class="{ active: isShowPayTypes }">
                <div class="icon-warp flex flex-align-center flex-pack-center">
                  <img
                    :src="payPlatformList.find(item => item.platform === currentPayPlatform)?.icon"
                  />
                </div>
                <div class="name">
                  {{ payPlatformList.find(item => item.platform === currentPayPlatform)?.name() }}
                </div>
                <Icon name="down" class="down" />
              </a>
              <template #dropdown>
                <ElDropdownMenu>
                  <ElDropdownItem
                    v-for="(item, index) in payPlatformList"
                    :key="index"
                    @click="choosePayPlatform(item)"
                    :disabled="item.disabled()"
                  >
                    <a
                      class="flex flex-align-center pay-item"
                      :class="{ active: currentPayPlatform === item.platform }"
                    >
                      <div class="flex1 flex flex-align-center">
                        <div class="icon-warp flex flex-align-center flex-pack-center">
                          <img :src="item.icon" />
                        </div>
                        <span class="name">{{ item.name() }}</span>
                      </div>
                      <div class="check-warp flex flex-align-center flex-pack-center">
                        <Icon name="check" v-if="currentPayPlatform === item.platform" />
                      </div>
                    </a>
                  </ElDropdownItem>
                </ElDropdownMenu>
              </template>
            </ElDropdown> -->
          </div>
        </div>
      </div>

      <a class="operate main-border primary flex flex-align-center flex-pack-center">
        {{ $t('NFT.Buy Now') }}
      </a>
    </div>
  </ElDialog>
</template>

<script setup lang="ts">
import { PayPlatform } from '@/enum'
import { useRootStore } from '@/stores/root'
import { useUserStore } from '@/stores/user'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import NFTMsgVue from '../NFTMsg/NFTMsg.vue'
import { PayPlatformItem, payPlatformList } from '@/config'

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

const currentPayPlatform = ref(
  userStore.isAuthorized && userStore.user?.evmAddress ? PayPlatform.ETH : PayPlatform.UnionPay
)

function choosePayPlatform(item: PayPlatformItem) {
  if (item.disabled()) return
  currentPayPlatform.value = item.platform
}
</script>

<style lang="scss" scoped src="./NFTBuy.scss"></style>
