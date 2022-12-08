<template>
  <ModalVue
    :model-value="modelValue"
    :show-second-control="isShowSecondModal"
    @update:model-value="val => emit('update:modelValue', val)"
  >
    <template #title>
      {{ $t('Setting.Edit Profile') }}
    </template>
    <template #body>
      <div class="intro">
        {{ $t('EditProfile.intro') }}
      </div>
      <div class="avatar">
        <div class="avatar-warp" @click="toChoose">
          <UserAvatar :meta-id="currentAvatarTx" :type="'metafile'" :disabled="true" />
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
            <a class="main-border" @click="confirm">
              <Icon name="check" />
            </a>
          </div>
        </ElFormItem>
      </ElForm>
    </template>

    <!-- secondBody -->
    <template #secondBody>
      <NFTAvatarListVue
        :active-tx="currentAvatar.val.txId"
        @change="item => (currentAvatar.val = item)"
      />
    </template>
  </ModalVue>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { reactive, ref } from 'vue'
import ModalVue from '@/components/Modal/Modal.vue'
import MetaName from '@/assets/svg/tag_nft.svg'
import NFTAvatarListVue from '@/components/NFTAvatarList/NFTAvatarList.vue'
import { NodeName } from '@/enum'
import { createBrfcChildNodeParams } from '@/@types/sdk'

interface Props {
  modelValue: boolean
}
const props = withDefaults(defineProps<Props>(), {})
const emit = defineEmits(['update:modelValue'])

const userStore = useUserStore()
const isShowSecondModal = ref(true)

// @ts-ignore
const currentAvatar: { val: NFTAvatarItem } = reactive({
  val: {
    txId: userStore.user!.avatarTxId,
  },
})

const form = reactive({
  name: userStore.user!.name,
  metaName: '',
})

const rule = {
  name: [{ require: true }],
}

async function confirm() {
  if (
    form.name === '' ||
    (form.name === userStore.user!.name && currentAvatar.val.txId === userStore.user?.avatarTxId)
  )
    return

  const paramsList: createBrfcChildNodeParams[] = []
  if (currentAvatar.val!.avatarTxId !== userStore.user?.avatarTxId) {
    paramsList.push({
      nodeName: NodeName.NFTAvatar,
      data: JSON.stringify({
        type: `nft`,
        codehash: currentAvatar.val!.codehash,
        genesis: currentAvatar.val!.genesis,
        tokenIndex: currentAvatar.val!.tokenIndex,
        updateTime: new Date().getTime(),
        memo: '',
        image: '',
        chain: '',
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
    // @ts-ignore
    userStore.updateUserInfo({
      ...userStore.user,
      name: form.name,
      avatarTxId: currentAvatar.val.txId,
    })
  }
}
</script>

<style lang="scss" scoped src="./EditProfile.scss"></style>
