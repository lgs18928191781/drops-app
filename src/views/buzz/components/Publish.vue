<template>
  <PublishBaseTemplateVue
    :model-value="modelValue"
    v-model:text="content"
    :loading="loading"
    :placeholder="$t('Buzz.publish.placeholder')"
    @update:model-value="val => emit('update:modelValue', val)"
    @close="emit('update:repostTxId', '')"
  >
    <template #repostBuzz>
      <div class="respost-buzz" v-if="respostBuzz.val">
        <QuoteVue :buzz="respostBuzz.val" />
      </div>
    </template>

    <template #other>
      <div class="attachment-warp" v-if="attachments.length > 0">
        <div
          class="title"
          v-if="
            typeof attachments[0] !== 'string' && attachments[0].fileType.indexOf('image') !== -1
          "
        >
          {{ $t('Buzz.publish.addImage') }}({{ attachments.length }}/9)
        </div>
        <AttachmentVue
          :attachments="attachments"
          :is-edit="true"
          @remove="onRemoveAttachment"
          @play="onPlay"
          :play-file="playFile"
        />
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
                  v-if="!item.disabled() && (item.icon === 'buzz_img' || item.icon === 'music')"
                  type="file"
                  :accept="item.icon === 'buzz_img' ? 'image/*' : 'audio/*'"
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
                >{{ $t('Done') }}</a
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
              <a
                class="topic-item"
                v-for="item in topics"
                :key="item.tag"
                @click="topic = item.tag"
                >{{ item.tag }}</a
              >
            </div>
          </div>
        </div>
      </ElDialog>

      <!-- nft -->
      <NFTModalVue v-model="isShowNFTList" @change="chooseNFT" />
    </template>
  </PublishBaseTemplateVue>
</template>

<script setup lang="ts">
import { AttachmentItem } from '@/@types/hd-wallet'
import { IsEncrypt, JobStatus, NodeName } from '@/enum'
import { useLayoutStore } from '@/stores/layout'
import { useUserStore } from '@/stores/user'
import { FileToAttachmentItem, getAttachmentsMark } from '@/utils/util'
import { computed, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import AttachmentVue from './Attachment.vue'
import StickerVue from '@/components/Sticker/Sticker.vue'
import { useRouter } from 'vue-router'
import { Mitt, MittEvent } from '@/utils/mitt'
import QuoteVue from './Quote.vue'
import { GetBuzz, GetHotTopics } from '@/api/aggregation'
import NFTModalVue from '@/components/NFTModal/NFTModal.vue'
import PublishBaseTemplateVue from '@/components/PublishBaseTemplate/PublishBaseTemplate.vue'
import { useJobsStore } from '@/stores/jobs'
import { metafile } from '@/utils/filters'

interface Props {
  modelValue: boolean
  topic?: string
  repostTxId?: string
}
const props = withDefaults(defineProps<Props>(), {})

const attachments: (AttachmentItem | string)[] = reactive([])
const respostBuzz: { val: null | BuzzItem } = reactive({ val: null })
const content = ref('')
const emit = defineEmits(['update:modelValue', 'update:repostTxId', 'success'])

const layout = useLayoutStore()
const userStore = useUserStore()
const jobsStore = useJobsStore()
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
        attachments.length >= 9 ||
        (attachments.length > 0 && typeof attachments[0] === 'string') ||
        (attachments.length > 0 &&
          typeof attachments[0] !== 'string' &&
          attachments[0].fileType.indexOf('image') === -1)
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
      if (attachments.length <= 0) {
        isShowNFTList.value = true
      }
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
const playFile = ref('')
let audio: HTMLAudioElement | null
const isShowTopic = ref(false)
const topics: GetHotTopicsResItem[] = reactive([])
const topic = ref('')
const isShowNFTList = ref(false)

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
  attachments.push(
    `${nft.chain === 'mvc' ? 'metacontract:/' : 'evm/' + nft.chain}/${nft.codehash}${
      nft.codehash ? '/' : ''
    }${nft.genesis}/${nft.tokenIndex}`
  )
}

async function submit() {
  if (content.value === '' && attachments.length <= 0) {
    return ElMessage.error(i18n.t('Buzz.publish.empty'))
  }
  loading.value = true
  const payAmount = parseInt(import.meta.env.VITE_PAY_AMOUNT)
  const contentType = 'text/plain'
  const res = await userStore.showWallet
    .createBrfcChildNode(
      {
        nodeName: NodeName.SimpleMicroblog,
        data: JSON.stringify({
          content: content.value,
          contentType: contentType,
          quoteTx: respostBuzz.val ? respostBuzz.val.txId : '',
          attachments: getAttachmentsMark(attachments),
          mention: [],
        }),
        attachments: attachments.length && typeof attachments[0] === 'string' ? [] : attachments,
        payTo: respostBuzz.val
          ? [{ amount: payAmount, address: respostBuzz.val?.zeroAddress }]
          : [],
      },
      {
        useQueue: true,
      }
    )
    .catch(error => {
      ElMessage.error(error.message)
      loading.value = false
    })

  if (res) {
    const watchJobStatus = watch(
      () => jobsStore.waitingNotify.find(job => job.id === res.subscribeId)?.status,
      status => {
        if (status === JobStatus.Success) {
          watchJobStatus()
          GetBuzz({
            txId: res.currentNode!.txId,
            metaId: userStore.user!.metaId,
          }).then(respones => {
            if (respones.data.results.items.length) {
              Mitt.emit(MittEvent.UpdateBuzz, respones.data.results.items[0])
            }
          })
        } else if (status === JobStatus.Failed) {
          watchJobStatus()
          Mitt.emit(MittEvent.RemoveBuzz, { txId: res.currentNode!.txId })
        }
      }
    )
    Mitt.emit(MittEvent.AddBuzz, {
      applauseCount: 0,
      attachments: [...attachments],
      avatarTxId: userStore.user!.avatarTxId,
      avatarType: userStore.user!.avatarType,
      avatarImage: userStore.user!.avatarImage,
      blockHeight: -1,
      comment: [],
      commentCount: 0,
      confirmState: 0,
      content: content.value,
      contentType: contentType,
      data: '',
      displayType: 'SimpleMicroblog',
      donate: [],
      encrypt: IsEncrypt.No,
      history: [],
      isEdit: false,
      isFull: false,
      isNew: true,
      isSelling: false,
      isMyFollow: true,
      isValid: false,
      like: [],
      likeCount: 0,
      metaAccessCodeHash: '',
      metaAccessContentAmount: '',
      metaAccessContentEncryptContent: '',
      metaAccessContentOwnerAvatarTxId: '',
      metaAccessContentOwnerAvatarType: '',
      metaAccessContentOwnerMetaId: '',
      metaAccessContentOwnerName: '',
      metaAccessContentRevenueAmount: 0,
      metaAccessGenesisId: '',
      metaAccessHasPay: '',
      metaAccessMetanetId: '',
      metaAccessPayTx: '',
      metaAccessPutAway: false,
      metaAccessSellTx: '',
      metaAccessServiceConfigMetanetId: '',
      metaAccessServiceConfigTxId: '',
      metaAccessServiceFee: '',
      metaAccessServiceMetaId: '',
      metaAccessServiceName: '',
      metaAccessServiceUrl: '',
      metaAccessTokenIndex: '',
      metaAccessTxId: '',
      metaId: '',
      metanetId: '',
      protocol: 'SimpleMicroblog',
      publicKey: '',
      quoteItem: null,
      rePost: [],
      rePostCount: 0,
      serverCode: '',
      serverPublicKey: '',
      timestamp: new Date().getTime(),
      totalValue: 0,
      txId: res.currentNode!.txId,
      userName: userStore!.user!.name,
      zeroAddress: userStore!.user!.address,
      postTag: 'buzz',
      postTagId: '',
    })
    content.value = ''
    attachments.length = 0
    loading.value = false
    emit('update:modelValue', false)
    ElMessage.success(i18n.t('Buzz.publish.success'))
    emit('success')
  } else {
    // 取消
    loading.value = false
  }
}

function onPlay(params: { file: string; type: 'audio' | 'video' }) {
  if (playFile.value === params.file) playFile.value = ''
  else playFile.value = params.file
  if (params.type === 'audio' && playFile.value) {
    if (!audio) {
      audio = new Audio()
    }
    audio.src = metafile(params.file)
    audio.play()
    audio.addEventListener('ended', () => {
      audio!.src = ''
      playFile.value = ''
    })
  } else {
    if (audio) {
      audio.pause()
      audio.src = ''
    }
  }
}

watch(
  () => props.repostTxId,
  repostTxId => {
    if (repostTxId) {
      GetBuzz({ txId: repostTxId, metaId: userStore.user?.metaId }).then(res => {
        if (res.code === 0) {
          respostBuzz.val = res.data.results.items[0]
        }
      })
    } else {
      respostBuzz.val = null
    }
  },
  {
    immediate: true,
  }
)

watch(
  () => props.topic,
  topic => {
    if (topic) {
      content.value += `  #${topic}  `
    }
  },
  {
    immediate: true,
  }
)
</script>

<style lang="scss" scoped src="./Publish.scss"></style>
