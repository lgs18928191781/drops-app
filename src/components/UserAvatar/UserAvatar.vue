<template>
  <div class="avatar" @click="toUser">
    <show-avatar
      :metaid="metaId"
      :src="$filters.avatar(metaId)"
      :type="type"
      :disabled="disabled"
    />
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
const props = defineProps<{
  type: string
  metaId: string
  disabled?: boolean
  // isClickStop?: string // 是否阻止冒泡事件 默认 true
}>()

const hasmask = computed(() => {
  if (props.type && props.type === 'nft-metabot') return true
  else return false
})

const isClickStop = 'stop'
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
