<template>
  <ElDialog
    :model-value="layout.isShowPublishBuzz"
    class="sm none-header none-padding"
    :close-on-click-modal="false"
    :destroy-on-close="true"
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
          @click="layout.$patch({ isShowPublishBuzz: false })"
        >
          <Icon name="x_mark" />
        </a>
      </div>
      <div class="text">
        <textarea v-model="content" autofocus />

        <div class="respost-buzz" v-if="respostBuzz.val">
          <QuoteVue :buzz="respostBuzz.val" />
        </div>
      </div>
      <div class="attachment-warp" v-if="attachments.length > 0">
        <div class="title" v-if="typeof attachments[0] !== 'string'">
          {{ $t('Buzz.publish.addImage') }}({{ attachments.length }}/9)
        </div>
        <AttachmentVue :attachments="attachments" :is-edit="true" @remove="onRemoveAttachment" />
      </div>

      <div class="footer flex flex-align-center">
        <div class="operate flex flex-align-center flex1">
          <template v-for="(item, index) in publishOperates" :key="index">
            <template v-if="item.icon === 'buzzn_emoji'">
              <ElPopover placement="bottom-start" width="300px" trigger="click">
                <StickerVue
                  @input="params => (content = content + params.value)"
                  :isHideNFT="attachments.length > 0"
                />
                <template #reference>
                  <a @click="item.fun()">
                    <Icon :name="item.icon" />
                  </a>
                </template>
              </ElPopover>
            </template>
            <template v-else>
              <a @click="item.fun()" :class="{ disabled: item.disabled() }">
                <Icon :name="item.icon" />
                <input
                  v-if="
                    (item.icon === 'buzz_img' || item.icon === 'music') && attachments.length < 9
                  "
                  type="file"
                  :accept="item.icon === 'buzz_img' ? 'images/*' : 'audio/*'"
                  multiple
                  @change="onChooseImage"
                  ref="inputFileRef"
                />
              </a>
            </template>
          </template>
        </div>
        <a
          class="main-border primary submit-btn"
          :class="{ faded: content === '' && attachments.length <= 0 }"
          @click="submit"
          >{{ respostBuzz.val ? $t('Buzz.publish.respost') : $t('Buzz.publish.post') }}</a
        >
      </div>
    </div>
  </ElDialog>

  <!-- Topic -->
  <ElDialog v-model="isShowTopic" class="sm none-header none-padding" @open="getHotTopics">
    <div class="topic">
      <div class="header flex flex-align-center">
        <div class="flex1">
          <a class="back flex flex-align-center flex-pack-center" @click="back"
            ><Icon name="down"
          /></a>
        </div>
        <div>
          <a
            class="confirm main-border primary"
            :class="{ faded: topic === '' }"
            @click="confirmTopic"
            >{{ $t('Confirm') }}</a
          >
        </div>
        <div class="title">{{ $t('Buzz.topic.topics') }}</div>
      </div>

      <div class="input">
        <div class="title">{{ $t('Buzz.topic.inputTitle') }}</div>
        <div class="cont">
          <input type="text" v-model="topic" :placeholder="$t('Buzz.topic.inputPlaceholder')" />
        </div>
      </div>

      <div class="hot-topic">
        <div class="title">{{ $t('Buzz.topic.hotTopics') }}</div>
        <div class="topic-list">
          <a class="topic-item" v-for="item in topics" :key="item.tag" @click="topic = item.tag">{{
            item.tag
          }}</a>
        </div>
      </div>
    </div>
  </ElDialog>

  <!-- nft -->
  <NFTModalVue v-model="isShowNFTList" @change="chooseNFT" />
</template>

<script setup lang="ts">
import { AttachmentItem } from '@/@types/hd-wallet'
import { NodeName } from '@/enum'
import { useLayoutStore } from '@/stores/layout'
import { useUserStore } from '@/stores/user'
import { FileToAttachmentItem, getAttachmentsMark } from '@/utils/util'
import { computed, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import AttachmentVue from './Attachment.vue'
import StickerVue from '@/components/Sticker/Sticker.vue'
import { useRouter } from 'vue-router'
import { Mitt, MittEvent } from '@/utils/mitt'
import { getOneBuzz } from '@/api/buzz'
import QuoteVue from './Quote.vue'
import { GetHotTopics } from '@/api/aggregation'
import NFTModalVue from '@/components/NFTModal/NFTModal.vue'

const attachments: (AttachmentItem | string)[] = reactive([])
const respostBuzz: { val: null | BuzzItem } = reactive({ val: null })
const content = ref('')

const layout = useLayoutStore()
const userStore = useUserStore()
const i18n = useI18n()
const router = useRouter()

const loading = ref(false)
const inputFileRef = ref()
const publishOperates = [
  {
    icon: 'buzzn_emoji',
    fun: () => {},
    disabled: () => {
      return false
    },
  },
  {
    icon: 'buzz_img',
    fun: () => {},
    disabled: () => {
      return (
        attachments.length >= 9 || (attachments.length > 0 && typeof attachments[0] === 'string')
      )
    },
  },
  {
    icon: 'music',
    fun: () => {},
    disabled: () => {
      return attachments.length > 0
    },
  },
  {
    icon: 'buzz_nft',
    fun: () => {
      isShowNFTList.value = true
    },
    disabled: () => {
      return attachments.length > 0
    },
  },
  {
    icon: 'buzz_hashtag',
    fun: () => {
      isShowTopic.value = true
    },
    disabled: () => {
      return false
    },
  },
]

const attachmentType = computed(() => {
  if (attachments && attachments.length) {
    if (typeof attachments[0] === 'string') {
    } else {
      if (attachments[0].fileType.indexOf('image/')) {
        return 'image'
      } else if (attachments[0].fileType.indexOf('auios/')) {
        return 'auido'
      } else if (attachments[0].fileType.indexOf('video/')) {
        return 'video'
      } else {
        return 'other'
      }
    }
  } else {
    return ''
  }
})
const isShowTopic = ref(false)
const topics: GetHotTopicsResItem[] = reactive([])
const topic = ref('')
const isShowNFTList = ref(false)

watch(
  () => layout.publishBuzzOption.repostTxId,
  () => {
    if (layout.publishBuzzOption.repostTxId) {
      getOneBuzz({ txId: layout.publishBuzzOption.repostTxId }).then(res => {
        if (res.code === 0) {
          respostBuzz.val = res.data.results.items[0]
        }
      })
    } else {
      respostBuzz.val = null
    }
  }
)

watch(
  () => layout.publishBuzzOption.topic,
  () => {
    if (layout.publishBuzzOption.topic) {
      content.value += `  #${layout.publishBuzzOption.topic}  `
    }
  }
)

async function onChooseImage(e: any) {
  loading.value = true
  const files: File[] = [...e.target.files]
  inputFileRef.value[0].value = ''
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

function getHotTopics() {
  return new Promise<void>(async (resolve, reject) => {
    const res = await GetHotTopics({
      page: 1,
      pageSize: 10,
    }).catch(error => {
      ElMessage.error((error as any).message)
      resolve()
    })
    if (res?.code === 0) {
      topics.length = 0
      topics.push(...res.data.results.items)
    }
    resolve()
  })
}

function back() {
  isShowTopic.value = false
  // layout.$patch({ isShowPublishBuzz: true })
}

function confirmTopic() {
  if (!topic.value) return
  content.value += `  #${topic.value}  `
  topic.value = ''
  isShowTopic.value = false
}

function chooseNFT(nft: BaseNFT) {
  const sufix = <{ [key: string]: string }>{
    mvc: 'metacontract',
    goerli: 'goerli',
  }
  attachments.push(`${sufix[nft.chain]}://${nft.codehash}/${nft.genesis}/${nft.tokenIndex}`)
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
        quoteTx: respostBuzz.val ? respostBuzz.val.txId : '',
        attachments: getAttachmentsMark(attachments),
        mention: [],
      }),
      attachments: attachments.length && typeof attachments[0] === 'string' ? [] : attachments,
    })
    .catch(error => {
      ElMessage.error(error.message)
      loading.value = false
    })

  if (res) {
    Mitt.emit(MittEvent.AddBuzz, { txId: res.currentNode!.txId })
    content.value = ''
    attachments.length = 0
    loading.value = false
    layout.$patch({ isShowPublishBuzz: false })
    ElMessage.success(i18n.t('Buzz.publish.success'))
    router.replace({
      name: 'buzzDetail',
      params: {
        txId: res.currentNode!.txId,
      },
    })
  }
}
</script>

<style lang="scss" scoped src="./Publish.scss"></style>
