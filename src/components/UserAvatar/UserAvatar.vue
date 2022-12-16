<template>
  <div class="avatar" @click="toUser($event)" :class="{ disabled }">
    <Image :src="image" :type="type" />
  </div>
</template>
<script lang="ts" setup>
import { useRouter } from 'vue-router'

interface Props {
  metaId: string
  image: string
  type?: 'metaId' | 'metafile'
  disabled?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  type: 'metaId',
})

const router = useRouter()
function toUser(e: Event) {
  if (props.disabled) return
  router.push({
    name: 'user',
    params: {
      metaId: props.metaId,
    },
  })
  e.stopPropagation()
}
</script>
<style lang="scss" scoped src="./UserAvatar.scss"></style>
