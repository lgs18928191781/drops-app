<template>
  <ModalVue
    :model-value="modelValue"
    v-model:showSecondControl="isShowAvatasList"
    :is-hide-close="true"
    :mobileSize="95"
    :width="'456px'"
  >
    <template #body>
      <div
        class="set-base-user-info flex"
        v-loading="loading"
        :element-loading-svg="LoadingTEXT"
        :element-loading-text="$t('Loading')"
      >
        <a class="close flex flex-align-center flex-pack-center" @click="closeSetInfoModal">
          <Icon name="x_mark" />
        </a>

        <div class="flex1 set-base-user-info-item set-warp">
          <div class="title">
            {{ $t('Login.setBaseInfo.title') }}
          </div>
          <div class="info">
            <div class="info-item flex flex-align-center">
              <!-- <div class="key">{{ $t('Login.setBaseInfo.setNFTAvatar') }}</div> -->
              <div class="key">{{ $t('Login.setBaseInfo.setAvatar') }}</div>
              <div class="cont flex1 flex flex-align-center flex-pack-end">
                <!-- <div class="flex flex-align-center avatar-warp" @click="openAvatarList"> -->
                <div class="flex flex-align-center avatar-warp">
                  <!-- <UserAvatar
                    :metaId="userStore.user?.metaId"
                    :disabled="true"
                    :image="currentAvatar.val.avatarImage"
                    :name="userStore.user?.name"
                    class="main-border"
                    :meta-name="userStore.user?.metaName"
                  /> -->
                  <div class="show-img">
                    <img :src="imgPic" />
                  </div>

                  <input type="file" @change="onChooseImage" class="img-upload" ref="inputRef" />
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

            <div class="info-item flex flex-align-center">
              <div class="key">{{ $t('Login.setBaseInfo.setBio') }}</div>
              <div class="cont flex1 flex flex-align-center flex-pack-end">
                <ElForm :model="form" :rules="rules" ref="FormRef">
                  <ElFormItem>
                    <ElInput
                      v-model="form.bio"
                      type="text"
                      :placeholder="$t('Login.setBaseInfo.setBioPlac')"
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
      <div
        class="set-base-user-info flex"
        v-loading="loading"
        :element-loading-svg="LoadingTEXT"
        :element-loading-text="$t('Loading')"
      >
        <div class="flex1 set-base-user-info-item">
          <div class="choose-nft flex flex-v">
            <div class="title">{{ $t('Login.setBaseInfo.chooseNFTTitle') }}</div>
            <NFTAvatarListVue
              :activeTx="currentAvatar.val.avatarImage"
              @change="item => (currentAvatar.val = item)"
            />
          </div>
        </div>
      </div>
    </template>
    <template #secondTitle>
      {{ $t('Login.setBaseInfo.Choose NFT Profile Picture') }}
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
import { reactive, ref, watch } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { UploadProps } from 'element-plus'
import ModalVue from '../Modal/Modal.vue'
import NFTAvatarListVue from '@/components/NFTAvatarList/NFTAvatarList.vue'
import { LoadingTEXT } from '@/utils/LoadingSVGText'
import { compressImage, throttle, FileToAttachmentItem, getAttachmentsMark } from '@/utils/util'
import DefaultAvatar from '@/assets/images/default_user.svg?url'
import { useI18n } from 'vue-i18n'
import { useConnectionStore, ConnectChain, } from '@/stores/connection'
interface Props {
  modelValue: boolean
  loading: boolean
}
const imgAttachments = reactive([])
const i18n = useI18n()
const props = withDefaults(defineProps<Props>(), {})
const emit = defineEmits(['success'])
const userStore = useUserStore()
const imageUrl = ref('')
const inputRef = ref()
const fileBase64 = ref(null)
const imgPic = ref(DefaultAvatar)
const imghex = ref('')
const connectionStore=useConnectionStore()
const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
  console.log(response)
  console.log(uploadFile)
  imageUrl.value = URL.createObjectURL(uploadFile.raw!)
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = rawFile => {
  console.log(rawFile)
  if (rawFile.type !== 'image/png') {
    ElMessage.error('Avatar picture must be JPG format!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('Avatar picture size can not exceed 2MB!')
    return false
  }
  return true
}
// @ts-ignore
const currentAvatar: { val: NFTAvatarItem } = reactive({
  val: {
    avatarImage: userStore.user?.avatarImage,
  },
})
console.log('currentAvatar', currentAvatar.val)

watch(
  () => userStore.isAuthorized,
  () => {
    if (userStore.isAuthorized && !userStore.metaletLogin) {
      currentAvatar.val.avatarImage = userStore.user!.avatarImage
    }
  }
)

const FormRef = ref()
const form = reactive({
  name: '',
  avatarTx: '',
  bio: '',
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

function submitForm() {
  console.log('zxczxc', currentAvatar.val)

  FormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      emit('success', {
        name: form.name,
        nft: imghex.value,
        bio: form.bio,
      })
    }
  })
}
function closeSetInfoModal(){
  emit('closeSetInfoModal')
}
function openAvatarList() {
  isShowAvatasList.value = !isShowAvatasList.value
}
// function handleImgUpload(event:any) {
//   console.log(event)
//   const file = event.target.files[0];
//   convertToBase64(file);
// }
// function convertToBase64(file:any){
//   const reader = new FileReader();
//   reader.readAsDataURL(file);
//   reader.onload = () => {
//     fileBase64.value = reader.result;
//     imgPic.value = fileBase64.value
//   };
//   reader.onerror = (error) => {
//     console.error('Error: ', error);
//   };
// }

async function onChooseImage(e: any) {
  if(e.target.files > 1){
    return ElMessage.error(`${i18n.t('avatar.notsupport.multi')}`)
  }
  const files: File[] = [...e.target.files]
     // 压缩图片
     const compressed = await compressImage(files[0])
      const result = await FileToAttachmentItem(compressed)


    // console.log(imgAttachments[0].data)
      imgPic.value = result.url
      imghex.value =connectionStore.currentChain == ConnectChain.btc ?  Buffer.from(result.data, 'hex').toString('base64') : Buffer.from(result.data, 'hex').toString('binary')

  // imgAttachments.length = 0
  // for (let i = 0; i < files.length; i++) {
  //   console.log('files', files)
  //   if (imgAttachments.length < 9) {

  //   } else {
  //     break
  //   }
  // }
}

defineExpose({
  FormRef,
})
</script>

<style lang="scss" scoped src="./SetBaseInfo.scss"></style>
