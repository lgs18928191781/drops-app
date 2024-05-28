<template>
  <div class="modal-container">
    <a class="close flex flex-align-center flex-pack-center" @click="closeSetInfoModal">
      <Icon name="x_mark" />
    </a>
    <div class="header-content">
      {{ $t('Login.setBaseInfo.title') }}
    </div>
    <div class="form-info">
      <div class="avatar">
        <div class="key">{{ $t('Login.setBaseInfo.setAvatar') }}</div>
        <div>
          <div class="show-img">
            <img :src="imgPic" />
          </div>
          <input type="file" @change="onChooseImage" class="img-upload" ref="inputRef" />
        </div>
      </div>
      <div class="name">
        <div class="key">{{ $t('Login.setBaseInfo.setUserName') }}</div>
        <ElForm :model="form" :rules="rules" ref="FormRef">
          <ElFormItem prop="name">
            <el-input v-model="form.name" :placeholder="$t('Login.setBaseInfo.setUserNamePlac')" />
          </ElFormItem>
        </ElForm>
      </div>
      <div class="bio">
        <div class="key">{{ $t('Login.setBaseInfo.setBio') }}</div>
        <ElForm :model="form" :rules="rules" ref="FormRef">
          <ElFormItem>
            <el-input
              v-model="form.bio"
              type="textarea"
              :placeholder="$t('Login.setBaseInfo.setBioPlac')"
            />
          </ElFormItem>
        </ElForm>
      </div>
    </div>

    <div class="operate">
      <a class="main-border" :class="{ faded: form.name === '' }" @click="submitForm">
        <Icon name="right" />
      </a>
    </div>
    <!-- <div class="sub-btn" @click="submitForm">btn</div> -->
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import DefaultAvatar from '@/assets/images/default_user.png'
import { compressImage, FileToAttachmentItem } from '@/utils/util'
const form = reactive({
  name: '',
  avatarTx: '',
  bio: '',
})
const emit = defineEmits(['success', 'closeSetInfoModal'])
const imgPic = ref(DefaultAvatar)
const imghex = ref('')
const FormRef = ref()
function submitForm() {
  if (form.name === '') return
  emit('success', {
    name: form.name,
    nft: imghex.value,
    bio: form.bio,
    avatarId: imgPic.value,
  })
}
const rules = {
  name: [
    {
      required: true,
      message: '',
      trigger: 'blur',
    },
  ],
}
async function onChooseImage(e: any) {
  if (e.target.files > 1) {
    return ElMessage.error(`${i18n.t('avatar.notsupport.multi')}`)
  }
  const files: File[] = [...e.target.files]
  // 压缩图片
  const compressed = await compressImage(files[0])
  const result = await FileToAttachmentItem(compressed)

  // console.log(imgAttachments[0].data)
  console.log(result)
  imgPic.value = result.url
  imghex.value = Buffer.from(result.data, 'hex').toString('base64')
  console.log(imghex.value)
}
function closeSetInfoModal() {
  emit('closeSetInfoModal')
}

defineExpose({
  FormRef,
})
</script>

<style lang="scss" scoped src="./SetUserInfo.scss"></style>
