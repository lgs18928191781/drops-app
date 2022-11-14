<template>
  <div class="avatar" @click="toUser" :class="{ disabled }">
    <Image :src="metaId" />
  </div>
</template>
<script lang="ts" setup>
import { useRouter } from 'vue-router'
const props = defineProps<{
  type: string
  metaId: string
  disabled?: boolean
}>()

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
