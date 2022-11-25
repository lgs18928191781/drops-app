<template>
  <div class="image-preview" v-if="modelValue" @click.stop="() => {}">
    <a class="close-btn flex flex-align-center flex-pack-center" @click="close"
      ><Icon name="x_mark"
    /></a>
    <div id="images" style="display: none;">
      <img :src="$filters.metafile(item, -1)" v-for="item in images" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Viewer from 'viewerjs'
import 'viewerjs/dist/viewer.min.css'
import { nextTick, onMounted, ref, watch } from 'vue'
// import CloseIcon from '@/assets/images/tab_icon_close.svg'
import { DB } from '@/utils/db'
import { isApp } from '@/stores/root'
import { checkAppHasMethod, downloadFile, urlToBase64 } from '@/utils/util'

interface Props {
  modelValue: boolean
  images: string[]
  index: number
}
let viewer: Viewer

const props = withDefaults(defineProps<Props>(), {})
const emit = defineEmits(['update:modelValue'])

watch(
  () => props.modelValue,
  async () => {
    if (props.modelValue) {
      nextTick(() => {
        viewer = new Viewer(document.getElementById('images')!, {
          button: false,
          navbar: true,
          title: false,
          inline: true,
          movable: false,
          initialViewIndex: props.index,
          toolbar: {
            oneToOne: true,
            prev: true,
            next: true,
            rotateLeft: true,
            rotateRight: true,
            reset: true,
            zoomIn: true,
            zoomOut: true,
            download: async function() {
              // @ts-ignore
              let url: string = viewer.image.src
              if (isApp) {
                url = await urlToBase64(url)
              }
              // @ts-ignore
              downloadFile(url, viewer.image.alt)
            },
          },
        })
        viewer.view()
      })
    }
  }
)

function close() {
  emit('update:modelValue', !props.modelValue)
}
</script>

<style lang="scss" scoped src="./ImagePreview.scss"></style>
