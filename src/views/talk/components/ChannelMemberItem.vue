<template>
  <div class="flex items-center my-2.5 lg:my-4">
    <!-- <UserAvatar
      :type="member.avatarType"
      :metaId="member.avatarTxId || 'undefined'"
      class="w-9 h-9 shrink-0"
    /> -->
    <div class="ml-2 flex flex-col">
      <div class="text-sm text-dark-800 truncate w-36">
        {{ member.name }}
      </div>
      <div class="text-xxs text-dark-300" v-if="member.metaId">
        MetaID: {{ member.metaId.substring(0, 6) }}
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps(['member'])

const randomNameColor = computed(() => {
  const colors = [
    'text-blue-500',
    'text-green-500',
    'text-yellow-500',
    'text-red-500',
    'text-indigo-500',
    'text-amber-500',
  ]
  // 将用户名转换为数字
  const name = props.member.name
  const nameCode = name.split('').reduce((acc: number, cur: any) => acc + cur.charCodeAt(0), 0)

  return colors[nameCode % colors.length]
})
</script>
<style lang=""></style>
