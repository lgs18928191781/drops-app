<template>
  <ModalVue
    :model-value="modelValue"
    :show-second-control="isShowSecondModal"
    @update:model-value="val => emit('update:modelValue', val)"
    @update:show-second-control="val => (isShowSecondModal = val)"
    :loading="loading"
  >
    <template #title>
      {{ $t('Setting.Edit Profile') }}
    </template>
    <template #body>
      <div class="intro">
        {{ $t('EditProfile.intro') }}
      </div>
      <div class="avatar">
        <div class="avatar-warp" @click="isShowSecondModal = true">
          <UserAvatar
            :meta-id="userStore.user!.metaId"
            :image="currentAvatar.val.avatarImage"
            :type="'metafile'"
            :disabled="true"
          />
          <a class="edit flex flex-align-center flex-pack-center">
            <Icon name="edit" />
          </a>
        </div>
      </div>

      <ElForm :model="form" :rules="rule" label-width="0">
        <!-- <ElFormItem prop="metaName" label="">
          <div class="form-item">
            <div class="label flex flex-align-center active">MetaName <MetaName /></div>
            <ElInput type="text" v-model="form.metaName" />
            <div class="drsc">
              {{ $t('EditProfile.MetaName.drsc') }}
            </div>
          </div>
        </ElFormItem> -->
        <ElFormItem prop="name">
          <div class="form-item">
            <div class="label">{{ $t('EditProfile.User Name') }}</div>
            <ElInput type="text" v-model="form.name" />
          </div>
        </ElFormItem>

        <ElFormItem prop="name">
          <div class="operate flex flex-pack-end">
            <a class="main-border primary" @click="confirm">
              <Icon name="check" />
            </a>
          </div>
        </ElFormItem>
      </ElForm>
    </template>

    <!-- secondBody -->
    <template #secondBody>
      <NFTAvatarListVue
        :active-tx="currentAvatar.val.avatarImage"
        @change="item => (currentAvatar.val = item)"
      />
    </template>
  </ModalVue>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { reactive, ref, watch } from 'vue'
import ModalVue from '@/components/Modal/Modal.vue'
import MetaName from '@/assets/svg/tag_nft.svg'
import NFTAvatarListVue from '@/components/NFTAvatarList/NFTAvatarList.vue'
import { NodeName } from '@/enum'
import { createBrfcChildNodeParams } from '@/@types/sdk'
import { useI18n } from 'vue-i18n'

interface Props {
  modelValue: boolean
}
const props = withDefaults(defineProps<Props>(), {})
const emit = defineEmits(['update:modelValue'])
const i18n = useI18n()

const userStore = useUserStore()
const isShowSecondModal = ref(false)
const loading = ref(false)

// @ts-ignore
const currentAvatar: { val: NFTAvatarItem } = reactive({
  val: {
    avatarImage: userStore.user?.avatarImage,
  },
})

watch(
  () => userStore.isAuthorized,
  () => {
    if (userStore.isAuthorized) {
      currentAvatar.val.avatarImage = userStore.user!.avatarImage
    }
  }
)

const form = reactive({
  name: userStore.user!.name,
  metaName: '',
})

const rule = {
  name: [
    {
      required: true,
      message: () => i18n.t('Enter User Name'),
      trigger: 'blur',
    },
  ],
}

async function confirm() {
  if (
    form.name === '' ||
    (form.name === userStore.user!.name &&
      currentAvatar.val.avatarImage === userStore.user?.avatarImage)
  )
    return
  loading.value = true
  try {
    const paramsList: createBrfcChildNodeParams[] = []
    if (currentAvatar.val!.avatarImage !== userStore.user?.avatarImage) {
      paramsList.push({
        nodeName: NodeName.NFTAvatar,
        data: JSON.stringify({
          type: `nft`,
          codehash: currentAvatar.val!.codehash,
          genesis: currentAvatar.val!.genesis,
          tokenIndex: currentAvatar.val!.tokenIndex,
          updateTime: new Date().getTime(),
          memo: currentAvatar.val.desc,
          image: currentAvatar.val.avatarImage,
          chain: currentAvatar.val.avatarImage.split('://')[0],
        }),
      })
    }

    if (form.name !== userStore.user!.name) {
      paramsList.push({
        nodeName: NodeName.Name,
        data: form.name,
      })
    }

    const res = await userStore.showWallet.batchCreateBrfcChildNode(paramsList)
    if (res) {
      emit('update:modelValue', false)

      // @ts-ignore
      userStore.updateUserInfo({
        ...userStore.user,
        name: form.name,
        avatarImage: currentAvatar.val.avatarImage,
      })
      ElMessage.success(i18n.t('Setting.Edit Profile') + ' ' + i18n.t('Success'))
      loading.value = false
    }
  } catch (error) {
    ElMessage.error((error as any).message)
    loading.value = false
  }
}
</script>

<style lang="scss" scoped src="./EditProfile.scss"></style>
