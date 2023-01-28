<template>
  <BaseModal v-model="layout[ShowControl.isShowCommunityCardModal]">
    <template #title>
      {{ $t('Talk.Modals.card') }}
    </template>

    <template #body>
      <div class="h-full w-full flex flex-col items-stretch justify-between text-dark-800">
        <div class="relative w-94 aspect-[3/4]" ref="cardContainer">
          <div
            class="w-full h-full card-border rounded-lg z-20 relative bg-white flex flex-col items-center justify-between p-7.5"
          >
            <!-- 背景 -->
            <div class="absolute inset-0 w-full h-full flex items-start justify-center z-0">
              <img
                :src="CardBgImg"
                class="w-full aspect-[1.3] object-cover mt-[10%] saturate-[10] blur-2xl"
              />
            </div>

            <!-- 星环 -->
            <div class="absolute top-4 right-7.5">
              <img :src="StarRingImg" class="w-[130PX] h-[130PX]" />
            </div>

            <!-- 主要信息 -->
            <div class="flex flex-col items-center">
              <!-- 标题 -->
              <div class="gap-x-2 flex items-end bg-yellow-300">
                <img :src="ShowIconImg" class="w-[26PX] !h-5 object-contain bg-green-300" />
                <h3 class="text-lg font-bold lg:tracking-wide shrink-0 bg-blue-300 leading-none">
                  {{ $t('Talk.Modals.nftize_title') }}
                </h3>
              </div>

              <!-- 头像 -->
              <div class="mt-10">
                <Image
                  :src="inviting.community?.icon"
                  custom-class="w-22.5 h-22.5 rounded-[45%] border-2 border-dark-800"
                />
              </div>

              <!-- 社区名 -->
              <div class="mt-4 relative">
                <h3 class="text-2xl font-bold">
                  {{ inviting.community?.name }}
                </h3>
              </div>

              <!-- MetaName -->
              <div class=" relative mt-1">
                <div class="flex items-center justify-start space-x-1 shrink overflow-x-hidden">
                  <span class="text-sm meta-name truncate">
                    {{ talk.activeCommunitySymbolInfo.name }}
                  </span>

                  <MetaNameTag :type="talk.activeCommunitySymbolInfo.suffix" />
                </div>
              </div>
            </div>

            <!--  二维码 -->
            <div class="flex flex-col items-center gap-y-1">
              <div class="w-22.5 h-22.5">
                <canvas
                  ref="qrcodeDrawer"
                  class="w-full h-full border-2 border-dark-800 rounded-sm"
                ></canvas>
              </div>

              <p class="text-sm">{{ $t('Talk.Modals.scan_to_join') }}</p>
            </div>
          </div>

          <!-- 层高 -->
          <div
            class="absolute w-full h-full inset-0 z-10 card-border translate-x-2 translate-y-1.5 bg-primary rounded-xl"
          ></div>
        </div>

        <div class="mt-6">
          <button class="main-border primary w-full py-3 text-base font-bold" @click="saveCard">
            {{ $t('Talk.Modals.save') }}
          </button>
        </div>

        <!-- 卡片画布 -->
        <canvas ref="cardDrawer" class=""></canvas>
      </div>
    </template>
  </BaseModal>
</template>

<script lang="ts" setup>
import { computed, ref, watchEffect } from 'vue'
import QRCode from 'qrcode'
import html2canvas from 'html2canvas'

import { useLayoutStore } from '@/stores/layout'
import { useTalkStore } from '@/stores/talk'
import { ShowControl } from '@/enum'

import BaseModal from '../BaseModal.vue'
import MetaNameTag from '@/components/MetaName/Tag.vue'
import StarRingImg from '@/assets/icons/star_ring.svg?url'
import CardBgImg from '@/assets/images/card_blur_bg.png?url'
import ShowIconImg from '@/assets/images/logo_show_2.png?url'

const layout = useLayoutStore()
const talk = useTalkStore()
const inviting = computed(() => talk.invitingChannel)
const inviteLink = computed(() => talk.inviteLink)

// 绘制二维码
const qrcodeDrawer = ref<HTMLCanvasElement | null>(null)
watchEffect(() => {
  if (qrcodeDrawer.value && inviteLink.value) {
    QRCode.toCanvas(qrcodeDrawer.value, inviteLink.value, {
      width: 90,
      margin: 1,
    })
  }
})

// 将整个卡片保存为图片
const cardDrawer = ref<HTMLCanvasElement | null>(null)
const cardContainer = ref<HTMLDivElement | null>(null)
const saveCard = () => {
  const card = cardContainer.value as HTMLDivElement
  const cardRect = card.getBoundingClientRect()

  // 设置画布大小
  const canvas = cardDrawer.value as HTMLCanvasElement
  canvas.width = cardRect.width
  canvas.height = cardRect.height
  canvas.style.width = `${cardRect.width}px`
  canvas.style.height = `${cardRect.height}px`
  // text align
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  ctx.textBaseline = 'bottom'

  // 绘制卡片

  // 生成图片，下载
  html2canvas(card, {
    canvas,
    scale: 1,
    useCORS: true,
    allowTaint: true,
    backgroundColor: null,
  }).then(canvas => {
    const a = document.createElement('a')
    a.href = canvas.toDataURL('image/png')
    a.download = 'show3.png'
    // a.click()
  })
}
</script>

<style lang="css" scoped>
.card-border {
  @apply border-2 border-dark-800;
}

.card-gradient {
  background: conic-gradient(
    from 180deg at 50% 50%,
    rgba(255, 229, 126, 0.54) 0deg,
    #ffbc75 0deg,
    rgba(251, 157, 147, 0.7) 111deg,
    rgba(246, 251, 147, 0.69) 247deg,
    rgba(255, 229, 126, 0.54) 360deg,
    #ffbc75 360deg
  );
}

.move {
  @apply transition duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5;
}
</style>
