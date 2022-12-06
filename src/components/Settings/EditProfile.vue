<template>
  <ModalVue :model-value="true" :show-second-control="isShowSecondModal">
    <template #title>
      {{ $t('Setting.Edit Profile') }}
    </template>
    <template #body>
      <div class="intro">
        {{ $t('EditProfile.intro') }}
      </div>
      <div class="avatar">
        <div class="avatar-warp" @click="toChoose">
          <UserAvatar :meta-id="userStore.user!.metaId" :disabled="true" />
          <a class="edit flex flex-align-center flex-pack-center">
            <Icon name="edit" />
          </a>
        </div>
      </div>

      <ElForm :model="form" :rules="rule" label-width="0">
        <ElFormItem prop="metaName" label="">
          <div class="form-item">
            <div class="label flex flex-align-center active">MetaName <MetaName /></div>
            <ElInput type="text" v-model="form.metaName" />
            <div class="drsc">
              {{ $t('EditProfile.MetaName.drsc') }}
            </div>
          </div>
        </ElFormItem>
        <ElFormItem prop="name">
          <div class="form-item">
            <div class="label">{{ $t('EditProfile.User Name') }}</div>
            <ElInput type="text" v-model="form.name" />
          </div>
        </ElFormItem>

        <ElFormItem prop="name">
          <div class="operate flex flex-pack-end">
            <a class="main-border">
              <Icon name="check" />
            </a>
          </div>
        </ElFormItem>
      </ElForm>
    </template>

    <!-- secondBody -->
    <template #secondBody>
      <NFTAvatarListVue />
    </template>
  </ModalVue>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { reactive, ref } from 'vue'
import ModalVue from '@/components/Modal/Modal.vue'
import MetaName from '@/assets/svg/tag_nft.svg'
import NFTAvatarListVue from '@/components/NFTAvatarList/NFTAvatarList.vue'

const userStore = useUserStore()
const isShowSecondModal = ref(true)
const isShowNFTList = ref(false)

const form = reactive({
  name: userStore.user!.name,
  metaName: '',
})

const rule = {
  name: [{ require: true }],
}
</script>

<style lang="scss" scoped src="./EditProfile.scss"></style>
