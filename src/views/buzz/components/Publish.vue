<template>
  <ElDialog
    :model-value="layoutStore.isShowPublishBuzz"
    class="sm none-header none-padding"
    :close-on-click-modal="false"
  >
    <div class="publish" v-loading="loading">
      <div class="top flex flex-align-center">
        <div class="user flex flex-align-center flex1">
          <UserAvatar :meta-id="userStore.user!.metaId" />
          <div class="cont flex1">
            <div class="name">{{userStore.user!.name}}</div>
            <div class="metaid">MetaID: {{userStore.user!.metaId!.slice(0, 6)}}</div>
          </div>
        </div>
        <a
          class="close-btn flex flex-align-center flex-pack-center"
          @click="layoutStore.$patch({ isShowPublishBuzz: false })"
        >
          <Icon name="x_mark" />
        </a>
      </div>

      <div class="text">
        <textarea v-model="content" />
      </div>

      <div class="attachment-warp" v-if="attachments.length > 0">
        <div class="title">{{ $t('Buzz.publish.addImage') }}({{ attachments.length }}/9)</div>
        <AttachmentVue :attachments="attachments" :is-edit="true" @remove="onRemoveAttachment" />
      </div>

      <div class="footer flex flex-align-center">
        <div class="operate flex flex-align-center flex1">
          <a v-for="(item, index) in publishOperates" :key="index" @click="item.fun()">
            <Icon :name="item.icon" />
            <input
              v-if="item.icon === 'buzz_img'"
              type="file"
              accept="images/*"
              multiple
              @change="onChooseImage"
            />
          </a>
        </div>
        <a
          class="main-border primary submit-btn"
          :class="{ faded: content === '' && attachments.length <= 0 }"
          @click="submit"
          >{{ $t('Buzz.publish.post') }}</a
        >
      </div>
    </div>
  </ElDialog>
</template>

<script setup lang="ts">
import { AttachmentItem } from '@/@types/hd-wallet'
import { NodeName } from '@/enum'
import { useLayoutStore } from '@/stores/layout'
import { useUserStore } from '@/stores/user'
import { FileToAttachmentItem, getAttachmentsMark } from '@/utils/util'
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import AttachmentVue from './Attachment.vue'

const attachments: AttachmentItem[] = reactive([])

const content = ref('')

const layoutStore = useLayoutStore()
const userStore = useUserStore()
const i18n = useI18n()

const loading = ref(false)

const publishOperates = [
  {
    icon: 'buzzn_emoji',
    fun: () => {},
  },
  {
    icon: 'buzz_img',
    fun: () => {},
  },
  {
    icon: 'buzz_nft',
    fun: () => {},
  },
  {
    icon: 'buzz_hashtag',
    fun: () => {},
  },
]

async function onChooseImage(e: any) {
  loading.value = true
  const files: File[] = [...e.target.files]
  for (let i = 0; i < files.length; i++) {
    if (attachments.length < 9) {
      const result = await FileToAttachmentItem(files[i])
      if (result) attachments.push(result)
    } else {
      break
    }
  }
  loading.value = false
}

function onRemoveAttachment(index: number) {
  attachments.splice(index, 1)
}

async function submit() {
  if (content.value === '' && attachments.length <= 0) {
    return ElMessage.error(i18n.t('Buzz.publish.empty'))
  }
  loading.value = true
  const res = await userStore.showWallet
    .createBrfcChildNode({
      nodeName: NodeName.SimpleMicroblog,
      data: JSON.stringify({
        content: content.value,
        contentType: 'text/plain',
        quoteTx: '',
        attachments: getAttachmentsMark(attachments),
        mention: [],
      }),
      attachments,
    })
    .catch(error => {
      ElMessage.error(error.message)
      loading.value = false
    })
  if (res) {
    ElMessage.success(i18n.t('Buzz.publish.success'))
    loading.value = false
  }
}
</script>

<style lang="scss" scoped src="./Publish.scss"></style>
