<template>
  <div
    class="absolute bg-white dark:bg-gray-700 right-0 -top-[5PX] -translate-x-4 px-1.5 py-0.5 rounded-xl shadow hidden group-hover:flex hover:shadow-md transition-all duration-200"
    v-if="actions.length > 0"
  >
    <button v-for="action in actions" class="p-1.5" @click="action.action">
      <Icon
        :name="action.icon"
        class="w-5 h-5 text-dark-800 dark:text-gray-100 hover:text-primary dark:hover:text-primary transition-all duration-200"
      />
    </button>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps(['message', 'parsed'])

const isText = computed(() => ['ShowMsg', 'simpleGroupChat'].includes(props.message.protocol))

const actions = computed(() => {
  const actions = []

  // actions.push({
  //   name: 'Talk.MessageMenu.love',
  //   icon: 'heart',
  //   action: () => {
  //     console.log('edit')
  //   },
  // })
  // actions.push({
  //   name: 'Talk.MessageMenu.share',
  //   icon: 'share_arrow',
  //   action: () => {
  //     console.log('edit')
  //   },
  // })
  if (isText.value) {
    actions.push({
      name: 'Talk.MessageMenu.copy',
      icon: 'copy',
      action: () => {
        // 复制该消息内容到剪贴板
        const content = props.parsed
        navigator.clipboard.writeText(content)
      },
    })
  }

  if (props.message.txId) {
    actions.push({
      name: 'Talk.MessageMenu.tx',
      icon: 'tx',
      action: () => {
        // 跳转到该消息对应的交易
        window.open(`https://mvcscan.com/tx/${props.message.txId}`, '_blank')
      },
    })
  }

  // actions.push({
  //   name: 'Talk.MessageMenu.quote',
  //   icon: 'quote',
  //   action: () => {
  //     console.log('edit')
  //   },
  // })

  return actions
})
</script>
