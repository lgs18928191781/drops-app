<template>
  <div class="avatar" @click="toUser" :class="{ disabled }">
    <Image :src="metaId" :type="type" />
  </div>
</template>
<script lang="ts" setup>
import { useRouter } from 'vue-router'

interface Props {
  metaId: string
  disabled?: boolean
  type?: 'metaId' | 'metafile'
}
const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  type: 'metaId',
})

const router = useRouter()
function toUser() {
  if (props.disabled) return
  router.push({
    name: 'user',
    params: {
      metaId: props.metaId,
    },
  })
}
</script>
<style lang="scss" scoped src="./UserAvatar.scss"></style>
