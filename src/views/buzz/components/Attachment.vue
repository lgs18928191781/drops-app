<template>
  <div class="attachment-box">
    <div class="attachement-list">
      <div
        class="attachment-item"
        v-for="(item, index) in attachments"
        :key="typeof item === 'string' ? item : item.sha256"
        :class="[
          getAttachmentType(item),
          attachments?.length === 1 && getAttachmentType(item) === 'image' && !isEdit
            ? 'single-image'
            : '',
        ]"
        @click.stop="preview(index)"
      >
        <template v-if="getAttachmentType(item) === 'image'">
          <Image :src="typeof item === 'string' ? item : item.url" />
          <!-- remove -->
          <a
            class="remove flex flex-align-center flex-pack-center"
            @click="emit('remove', index)"
            v-if="isEdit"
          >
            <Icon name="x_mark" />
          </a>
        </template>
      </div>
    </div>
    <!-- 图片 -->
    <!-- <div class="image-list" v-if="images && images.length">
      <template v-for="(img, index) in images" :key="index">
        <div
          :class="[images.length === 1 ? 'single' : '', 'item']"
          @click.stop.prevent="handlePreviewImage(index, images)"
        >
          <img :src="img" />
        </div>
      </template>
    </div> -->
    <!-- 视频 -->
    <!-- <div class="video-list" v-if="videos && videos.length">
      <template v-for="(video, index) in videos" :key="index">
        <video :src="video" controls preload="auto"></video>
      </template>
    </div> -->
    <!-- 音乐 -->
    <!-- <div class="audio-list" v-if="audios && audios.length">
      <template v-for="(audio, index) in audios" :key="index">
        <audio :src="audio" controls preload="auto"></audio>
      </template>
    </div> -->
    <!-- NFT -->
    <!-- <div class="image-list" v-if="nfts && nfts.length">
      <template v-for="(nft, index) in nfts" :key="index">
        <div :class="['item', 'nft']" @click.stop.prevent="toNFT">
          <i>NFT</i>
          <img :src="nft" />
        </div>
      </template>
    </div> -->
  </div>

  <!-- ImagePreviewVue -->
  <ImagePreviewVue v-model="isShowPreview" :images="previewImages" :index="previewIndex" />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { metafile } from '@/utils/filters'
import { ImagePreview } from 'vant'
import { router } from '@/router'
import { AttachmentItem } from '@/@types/hd-wallet'
import ImagePreviewVue from '@/components/ImagePreview/ImagePreview.vue'

interface Props {
  attachments: string[] | AttachmentItem[]
  isEdit?: boolean
}
const props = withDefaults(defineProps<Props>(), {})
const isShowPreview = ref(false)
const previewIndex = ref(0)

const emit = defineEmits(['remove'])

const previewImages = computed(() => {
  let result: string[] = []
  for (let item of props.attachments) {
    if (typeof item === 'string') {
      result.push(item)
    } else {
      result.push(item.url)
    }
  }
  return result
})

// const images = computed(() => {
//   if (!props.attachments || !props.attachments.length) {
//     return []
//   }
//   return props.attachments
//     .filter(v => {
//       if (v.indexOf('metafile://') > -1) {
//         const mch = String(v).match(/\.[\w\d]{3}$/gi)
//         if (!mch || !mch.length) {
//           return true
//         }
//         const suffix = mch[0].toLowerCase()
//         return ['.jpg', '.png', '.jpeg'].includes(suffix)
//       }
//       return false
//     })
//     .map((v, i, arr) => {
//       return arr.length === 1 ? metafile(v, 680) : metafile(v, 240)
//     })
// })
// const videos = computed(() => {
//   if (!props.attachments || !props.attachments.length) {
//     return []
//   }
//   return props.attachments
//     .filter(v => {
//       if (v.indexOf('metafile://') > -1) {
//         const mch = String(v).match(/\.[\w\d]{3}$/gi)
//         if (!mch || !mch.length) {
//           return false
//         }
//         const suffix = mch[0].toLowerCase()
//         return ['.mp4'].includes(suffix)
//       }
//       return false
//     })
//     .map(v => metafile(v, -1))
// })
// const audios = computed(() => {
//   if (!props.attachments || !props.attachments.length) {
//     return []
//   }
//   return props.attachments
//     .filter(v => {
//       if (v.indexOf('metafile://') > -1) {
//         const mch = String(v).match(/\.[\w\d]{3}$/gi)
//         if (!mch || !mch.length) {
//           return false
//         }
//         const suffix = mch[0].toLowerCase()
//         return ['.mp3'].includes(suffix)
//       }
//       return false
//     })
//     .map(v => metafile(v, -1))
// })
// const nfts = computed(() => {
//   if (!props.attachments || !props.attachments.length) {
//     return []
//   }
//   return props.attachments
//     .filter(v => {
//       return v.indexOf('sensible://') > -1
//     })
//     .map(v => {
//       return metafile(v.replace('sensible://', 'sensible/'), 680)
//     })
// })

function handlePreviewImage(index: number, images: string[]) {
  ImagePreview({
    images: images.map(v => {
      if (v.indexOf('/resize,m_lfit,w_') > -1) {
        return v.split('/resize,m_lfit,w_')[0]
      }
      return v
    }),
    startPosition: index,
    closeable: true,
  })
}

function toNFT() {
  const string = props.attachments![0].replace('sensible://', '')
  const stringArray = string.split('/')
  router.push({
    name: 'nft',
    params: {
      genesis: stringArray[1],
      codehash: stringArray[0],
      tokenIndex: stringArray[2],
    },
  })
}

function getAttachmentType(attachment: string | AttachmentItem) {
  if (typeof attachment === 'string') {
    return 'image'
  } else {
    return 'image'
  }
  // let isImage = false
  // for (let i = 0; i < imageType.length; i++) {
  //   if (attachment.indexOf(imageType[i]) !== -1) {
  //     isImage = true
  //     break
  //   }
  // }
  // if (isImage) return 'image'
}

function preview(index: number) {
  previewIndex.value = index
  isShowPreview.value = true
}
</script>
<style scoped lang="scss">
.attachement-list {
  .attachment-item {
    border-radius: 8px;
    overflow: hidden;
    position: relative;

    &.image {
      width: calc((100% - 24px) / 3);
      display: inline-block;
      vertical-align: middle;
      height: 0;
      padding-bottom: calc((100% - 24px) / 3);
      margin-right: 12px;
      position: relative;

      &:nth-child(3n) {
        margin-right: 0;
      }

      :deep(.image) {
        position: absolute;
        height: 100%;
        width: 100%;
        object-fit: cover;
      }
    }

    &.single-image {
      display: inline-block;
      width: auto;
      max-width: 100%;
      max-height: 300px;
      margin-right: 0;
      height: auto;
      padding-bottom: 0;

      :deep(.image) {
        position: static;
        border-radius: 8px;
        height: auto;
        object-fit: none;
        .el-skeleton {
          width: 300px;
          height: 150px;
          position: relative;
          .el-skeleton__image {
          }
        }
      }
    }

    .remove {
      position: absolute;
      right: 0;
      top: 0;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: rgb(48, 49, 51, 0.3);
      z-index: 2;
      margin-top: 6px;
      margin-right: 6px;
      cursor: pointer;

      .icon {
        width: 16px;
        height: 16px;
        :deep(use) {
          fill: #fff;
        }
      }
    }
  }
}

.image-list {
  display: flex;
  flex-wrap: wrap;
  .item {
    width: calc(33.33% - 7px);
    margin: 0 9px 9px 0;
    position: relative;
    height: 0;
    padding-bottom: calc(33.33% - 7px);
    flex-grow: 0;
    flex-shrink: 0;

    &.nft {
      width: 50%;
      padding-bottom: 50%;
    }

    img {
      position: absolute;
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 8px;
      top: 0;
      left: 0;
    }

    i {
      position: absolute;
      top: 8px;
      right: 8px;
      background: linear-gradient(270deg, #2af598, #009efd);
      z-index: 2;
      padding: 4px 6px;
      border-radius: 12px;
      font-size: 10px;
      line-height: 1;
      font-weight: 500;
      letter-spacing: 1px;
    }

    &:last-child,
    &:nth-child(3n) {
      margin-right: 0;
    }
  }

  .single {
    width: 100%;
    height: 257px;
    margin: 0;
    padding: 0;
  }
}
.video-list {
  video {
    display: block;
    width: 100%;
    height: 257px;
    margin: 0;
    padding: 0;
    object-fit: contain;
    background: #000;
    border-radius: 8px;
  }
}

.audio-list {
  audio {
    display: block;
    width: 100%;
    height: 100px;
    margin: 0;
    padding: 0;
  }
}
</style>
