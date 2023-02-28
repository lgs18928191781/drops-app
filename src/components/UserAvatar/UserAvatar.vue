<template>
  <Image
    class="avatar"
    :src="image"
    :type="type"
    :default-image="DefaultAvatar"
    :custom-class="customClass"
    @click="toUserPage"
    ref="AvatarRef"
  />
</template>
<script lang="ts" setup>
import { computed, render, h, ref, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import DefaultAvatar from '@/assets/images/default_user.png'
import UserCard from '../UserCard/UserCard.vue'
import { v1 } from 'uuid'
import i18n from '@/utils/i18n'
import { createPopper, VariationPlacement } from '@popperjs/core'

const router = useRouter()
const userCardWarpId = `user-card-warp-${v1()}`
const AvatarRef = ref()

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

const toUserPage = () => {
  if (props.disabled) return
  if (props.metaId) {
    router.push(`/user/${props.metaId}`)
  }
}

function openUserCard() {
  const div = document.createElement('div')
  div.id = userCardWarpId
  div.className = 'user-card-warp'
  document.body.append(div)
  render(
    // @ts-ignore
    h(UserCard, {
      i18n: i18n,
      modelValue: true,
      metaId: props.metaId,
      name: props.name,
    }),
    document.getElementById(userCardWarpId)!
  )
  nextTick(() => {
    createPopper(AvatarRef.value.imgRef, document.getElementById(userCardWarpId)!, {
      placement: 'right-start',
    })
  })
}
</script>
