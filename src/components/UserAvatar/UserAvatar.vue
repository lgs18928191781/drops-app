<template>
  <Image
    class="avatar"
    :src="image"
    :type="type"
    :default-image="DefaultAvatar"
    :custom-class="customClass"
    @click="openUserCard"
  />
</template>
<script lang="ts" setup>
import { computed, render } from 'vue'
import { useRouter } from 'vue-router'
import DefaultAvatar from '@/assets/images/default_user.png'
import UserCard from '../UserCard/UserCard.vue'
import { v1 } from 'uuid'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const userCardWarpId = `user-card-warp-${v1()}`
const i18n = useI18n()

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
}
</script>
