<template>
  <div class="attachment-box">
    <!-- 图片 -->
    <div class="image-list" v-if="images && images.length">
      <template v-for="(img, index) in images" :key="index">
        <div
          :class="[images.length === 1 ? 'single' : '', 'item']"
          @click.stop.prevent="handlePreviewImage(index, images)"
        >
          <img :src="img" />
        </div>
      </template>
    </div>
    <!-- 视频 -->
    <div class="video-list" v-if="videos && videos.length">
      <template v-for="(video, index) in videos" :key="index">
        <video :src="video" controls preload="auto"></video>
      </template>
    </div>
    <!-- 音乐 -->
    <div class="audio-list" v-if="audios && audios.length">
      <template v-for="(audio, index) in audios" :key="index">
        <audio :src="audio" controls preload="auto"></audio>
      </template>
    </div>
    <!-- NFT -->
    <div class="image-list" v-if="nfts && nfts.length">
      <template v-for="(nft, index) in nfts" :key="index">
        <div :class="['item', 'nft']" @click.stop.prevent="toNFT">
          <i>NFT</i>
          <img :src="nft" />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { metafile } from '@/utils/filters'
import { ImagePreview } from 'vant'
import { router } from '@/router'

interface Props {
  attachments: string[] | null
}
const props = withDefaults(defineProps<Props>(), {
  attachments: () => [],
})
const images = computed(() => {
  if (!props.attachments || !props.attachments.length) {
    return []
  }
  return props.attachments
    .filter(v => {
      if (v.indexOf('metafile://') > -1) {
        const mch = String(v).match(/\.[\w\d]{3}$/gi)
        if (!mch || !mch.length) {
          return true
        }
        const suffix = mch[0].toLowerCase()
        return ['.jpg', '.png', '.jpeg'].includes(suffix)
      }
      return false
    })
    .map((v, i, arr) => {
      return arr.length === 1 ? metafile(v, 680) : metafile(v, 240)
    })
})
const videos = computed(() => {
  if (!props.attachments || !props.attachments.length) {
    return []
  }
  return props.attachments
    .filter(v => {
      if (v.indexOf('metafile://') > -1) {
        const mch = String(v).match(/\.[\w\d]{3}$/gi)
        if (!mch || !mch.length) {
          return false
        }
        const suffix = mch[0].toLowerCase()
        return ['.mp4'].includes(suffix)
      }
      return false
    })
    .map(v => metafile(v, -1))
})
const audios = computed(() => {
  if (!props.attachments || !props.attachments.length) {
    return []
  }
  return props.attachments
    .filter(v => {
      if (v.indexOf('metafile://') > -1) {
        const mch = String(v).match(/\.[\w\d]{3}$/gi)
        if (!mch || !mch.length) {
          return false
        }
        const suffix = mch[0].toLowerCase()
        return ['.mp3'].includes(suffix)
      }
      return false
    })
    .map(v => metafile(v, -1))
})
const nfts = computed(() => {
  if (!props.attachments || !props.attachments.length) {
    return []
  }
  return props.attachments
    .filter(v => {
      return v.indexOf('sensible://') > -1
    })
    .map(v => {
      return metafile(v.replace('sensible://', 'sensible/'), 680)
    })
})

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
</script>
<style scoped lang="scss">
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
