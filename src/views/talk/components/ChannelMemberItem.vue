<template>
  <div class="flex items-center my-2.5">
    <UserAvatar :type="props.member.avatarType" :metaId="props.member.avatarTxId || 'undefined'"
      class="w-8 h-8 shrink-0" />
    <div class="ml-2 text-sm font-medium" :class="randomNameColor">
      {{ props.member.name }}
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue';

const props = defineProps(['member'])


const randomNameColor = computed(() => {
  const colors = ['text-blue-500', 'text-green-500', 'text-yellow-500', 'text-red-500', 'text-indigo-500', 'text-amber-500']
  // 将用户名转换为数字
  const name = props.member.name
  const nameCode = name.split('').reduce((acc: number, cur: any) => acc + cur.charCodeAt(0), 0)

  return colors[nameCode % colors.length]
})
</script>
<style lang="">
  
</style>