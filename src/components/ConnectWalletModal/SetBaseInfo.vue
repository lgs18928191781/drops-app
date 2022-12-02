<template>
  <ModalVue
    :model-value="modelValue"
    v-model:showSecondControl="isShowAvatasList"
    :is-hide-close="true"
    :mobileSize="95"
    :width="'456px'"
  >
    <template #body>
      <div class="set-base-user-info flex" v-loading="loading">
        <div class="flex1 set-base-user-info-item set-warp">
          <div class="title">{{ $t('Login.setBaseInfo.title') }}</div>
          <div class="info">
            <div class="info-item flex flex-align-center">
              <div class="key">{{ $t('Login.setBaseInfo.setNFTAvatar') }}</div>
              <div class="cont flex1 flex flex-align-center flex-pack-end">
                <div class="flex flex-align-center avatar-warp" @click="openAvatarList">
                  <UserAvatar
                    :metaId="currentUserAvatarKey"
                    :type="userStore.user ? userStore.user?.avatarType : ''"
                    class="main-border"
                  />
                  <Icon name="down" />
                </div>
              </div>
            </div>

            <div class="info-item flex flex-align-center">
              <div class="key">{{ $t('Login.setBaseInfo.setUserName') }}</div>
              <div class="cont flex1 flex flex-align-center flex-pack-end">
                <ElForm :model="form" :rules="rules" ref="FormRef">
                  <ElFormItem prop="name">
                    <ElInput
                      v-model="form.name"
                      type="text"
                      :placeholder="$t('Login.setBaseInfo.setUserNamePlac')"
                    />
                  </ElFormItem>
                </ElForm>
              </div>
            </div>
          </div>
          <div class="operate">
            <a class="main-border" :class="{ faded: form.name === '' }" @click="submitForm">
              <Icon name="right" />
            </a>
          </div>
        </div>
      </div>
    </template>

    <template #secondBody>
      <div class="set-base-user-info flex" v-loading="loading">
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
                  <div class="nft-item" v-for="item in list" @click="chooseItem(item)">
                    <Image :src="item.image" />
                    <div
                      class="checked"
                      v-if="
                        currentNFT.token_address === item.token_address &&
                          currentNFT.token_id === item.token_id
                      "
                    >
                      <div class="checked-icon-warp flex flex-align-center flex-pack-center">
                        <Icon name="check" />
                      </div>
                    </div>
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
    </template>
  </ModalVue>

  <!-- <ElDialog
    :model-value="modelValue"
    :show-close="false"
    class="none-bg-color none-header"
    :close-on-click-modal="false"
  >
    
  </ElDialog> -->
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { computed, reactive, ref, watch } from 'vue'
import IsNullVue from '@/components/IsNull/IsNull.vue'
import { GetNFTs } from '@/api/metaid-base'
import ModalVue from '../Modal/Modal.vue'

interface Props {
  modelValue: boolean
  loading: boolean
}
const pagintion = reactive({
  limit: 12,
  cursor: '',
  chain: import.meta.env.VITE_ETH_CHAIN,
})
const props = withDefaults(defineProps<Props>(), {})
const emit = defineEmits(['success'])
const userStore = useUserStore()
const isNFTLoading = ref(true)
const FormRef = ref()
const form = reactive({
  name: '',
  avatarTx: '',
})
const rules = {
  name: [
    {
      required: true,
      message: '',
      trigger: 'blur',
    },
  ],
}
const isShowAvatasList = ref(false)

const list: {
  image: string
  description: string
  attributes: string
  token_id: string
  token_address: string
}[] = reactive([])

const currentNFT = reactive({
  token_address: '',
  token_id: '',
})

const currentUserAvatarKey = computed(() => {
  if (currentNFT.token_address) {
    return list.find(
      item =>
        item.token_address === currentNFT.token_address && item.token_id === currentNFT.token_id
    )!.image
  } else {
    if (userStore.isAuthorized) {
      return userStore.user!.metaId
    } else {
      return ''
    }
  }
})

function getMore() {
  if (!pagintion.cursor) return
  isNFTLoading.value = true
  getNfts().then(() => {
    isNFTLoading.value = false
  })
}

function getNfts(isCover = false) {
  return new Promise<void>(async (resolve, reject) => {
    const res = await GetNFTs({
      address: userStore.user!.ethAddress!,
      chain: pagintion.chain,
      limit: pagintion.limit,
      cursor: pagintion.cursor,
    })
    if (res) {
      if (isCover) list.length = 0
      pagintion.cursor = res.cursor
      res.result.forEach(item => {
        const metadata = JSON.parse(item.metadata)
        list.push({
          ...metadata,
          token_address: item.token_address,
          token_id: item.token_id,
        })
      })
      resolve()
    }
  })
}

function submitForm() {
  FormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      emit('success', {
        name: form.name,
        nft: list.find(
          item =>
            item.token_address === currentNFT.token_address && item.token_id === currentNFT.token_id
        ),
      })
    }
  })
}

function chooseItem(item: {
  image: string
  description: string
  attributes: string
  token_id: string
  token_address: string
}) {
  if (item.token_address === currentNFT.token_address && item.token_id === currentNFT.token_id) {
    currentNFT.token_address = ''
    currentNFT.token_id = ''
  } else {
    currentNFT.token_address = item.token_address
    currentNFT.token_id = item.token_id
  }
}

function openAvatarList() {
  isShowAvatasList.value = !isShowAvatasList.value
  if (isShowAvatasList.value && list.length === 0 && userStore.isAuthorized) {
    isNFTLoading.value = true
    getNfts(true).then(() => {
      isNFTLoading.value = false
    })
  } else {
    isNFTLoading.value = false
  }
}

defineExpose({
  FormRef,
})
</script>

<style lang="scss" scoped src="./SetBaseInfo.scss"></style>
