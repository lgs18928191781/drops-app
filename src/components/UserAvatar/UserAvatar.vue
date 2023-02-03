<template>
  <Popover class="relative cursor-pointer w-10 h-10 max-w-full max-h-full">
    <PopoverButton class="outline-none">
      <Image :src="image" :type="type" :default-image="DefaultAvatar" :custom-class="customClass" />
    </PopoverButton>

    <!-- <PopoverOverlay class="fixed inset-0 bg-black opacity-50 z-[100]" />

    <PopoverPanel class="w-auto h-auto">
      <div class="fixed top-0 left-0 z-[9000] w-auto h-auto" ref="userCard">
        <UserCardVue :meta-id="metaId" :name="name" v-model="isShowUserCard" />
      </div>
    </PopoverPanel> -->
  </Popover>
</template>
<script lang="ts" setup>
import { ref, computed, Ref } from 'vue'
import { Popover, PopoverButton, PopoverPanel, PopoverOverlay } from '@headlessui/vue'

import UserCardVue from '../UserCard/UserCard.vue'
import DefaultAvatar from '@/assets/images/default_user.png'

interface Props {
  name?: string
  metaId?: string
  image: string
  type?: 'metaId' | 'metafile'
  disabled?: boolean
  imageClass?: string
}
const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  type: 'metaId',
})

const customClass = computed(() => {
  return props.imageClass ? props.imageClass + ' avatar-rounded' : 'avatar-rounded'
})

/** 弹出框 */
const userCard = ref<HTMLElement>() as Ref<HTMLElement>

// const panelPosition = computed(() => {
//   // 计算弹出框的位置
//   // 先确认固定宽高
//   if (!userCard.value) return {}

//   const userCardWidth = userCard.value.offsetWidth
//   const userCardHeight = userCard.value.offsetHeight

//   console.log({ userCardWidth, userCardHeight, userCard: userCard.value })

//   // 然后计算X轴位置：默认向右偏移100%，如果超出屏幕则向左偏移对应的宽度，使其在屏幕内
//   // const x = window.innerWidth - userCard.value?.offsetLeft - width! < 0 ? -width! : 100
//   // console.log({ x })

//   return {
//     transform: 'translateX(100%)',
//   }
// })
/** 弹出框 end */

const isShowUserCard = ref(false)
</script>
