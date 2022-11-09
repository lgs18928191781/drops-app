<template>
  <ElDialog :model-value="modelValue" :show-close="false" class="none-bg-color none-header">
    <div class="set-base-user-info flex">
      <div class="flex1 set-base-user-info-item set-warp">
        <div class="title">{{ $t('Login.setBaseInfo.title') }}</div>
        <div class="info">
          <div class="info-item flex flex-align-center">
            <div class="key">{{ $t('Login.setBaseInfo.setNFTAvatar') }}</div>
            <div class="cont flex1 flex flex-align-center flex-pack-end">
              <div class="flex flex-align-center">
                <UserAvatar
                  :metaId="userStore.user ? userStore.user?.metaId : ''"
                  :type="userStore.user ? userStore.user?.avatarType : ''"
                  :disabled="true"
                />
                <Icon name="down" />
              </div>
            </div>
          </div>

          <div class="info-item flex flex-align-center">
            <div class="key">{{ $t('Login.setBaseInfo.setUserName') }}</div>
            <div class="cont flex1 flex flex-align-center flex-pack-end">
              <ElInput
                v-model="username"
                type="text"
                :placeholder="$t('Login.setBaseInfo.setUserNamePlac')"
              />
            </div>
          </div>
        </div>
        <div class="operate">
          <a class="main-border" :class="{ faded: username === '' }">
            <Icon name="right" />
          </a>
        </div>
      </div>
      <div class="flex1 set-base-user-info-item">
        <div class="choose-nft flex flex-v">
          <div class="title">{{ $t('Login.setBaseInfo.chooseNFTTitle') }}</div>
          <div
            class="nft-list flex1"
            v-infinite-scroll="getMore"
            :infinite-scroll-immediate="false"
            v-loading="isNFTLoading"
          >
            <template v-if="!isNFTLoading">
              <template v-if="list.length > 0">
                <div class="nft-item" v-for="item in Array.from({ length: 9 })">
                  <Image src="8f17045a176c91c2cd386b465527c0fa3f042f66db22ccadb8a9652390a01bc9" />
                </div>
              </template>
              <template v-else>
                <IsNullVue />
              </template>
            </template>
          </div>
        </div>
      </div>
    </div>
  </ElDialog>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { ref } from 'vue'
import IsNullVue from '@/components/IsNull/IsNull.vue'
import { GetNFTs } from '@/api/metaid-base'

interface Props {
  modelValue: boolean
}
const props = withDefaults(defineProps<Props>(), {})

const isNFTLoading = ref(true)

const userStore = useUserStore()
const username = ref('')
const list = []

function getMore() {}

if (userStore.isAuthorized) {
  GetNFTs({ address: userStore.user!.address })
} else {
  isNFTLoading.value = false
}
</script>

<style lang="scss" scoped src="./SetBaseInfo.scss"></style>
