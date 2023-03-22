<template>
  <div
    class="absolute bg-white dark:bg-gray-700 right-0 -top-[5PX] -translate-x-4 px-1.5 py-0.5 rounded-xl shadow hidden lg:group-hover:flex hover:shadow-md transition-all duration-200 z-10"
    v-if="actions.length > 0"
  >
    <button v-for="action in actions" :key="action.name" class="p-1.5" @click="action.action">
      <Icon
        :name="action.icon"
        class="w-5 h-5 text-dark-800 dark:text-gray-100 hover:text-primary dark:hover:text-primary transition-all duration-200"
      />
    </button>
  </div>
</template>

<script lang="ts" setup>
import { Translate } from '@/api/core'
import { EnvMode } from '@/enum'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const i18n = useI18n()

const props = defineProps(['message', 'parsed', 'translateStatus', 'translatedContent'])
const emit = defineEmits(['update:translateStatus', 'update:translatedContent', 'quote', 'toBuzz'])

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
      name: 'Talk.MessageMenu.translate',
      icon: 'translate',
      action: async () => {
        // 翻译该消息内容
        if (props.translateStatus === 'hidden') {
          if (props.translatedContent === '') {
            emit('update:translateStatus', 'processing')
            // 如果未请求过翻译，请求翻译
            const content = props.parsed
            const params = {
              query: content,
              to: i18n.locale.value,
            }
            const translateRes = await Translate(params)

            if (translateRes.code === 0) {
              emit('update:translatedContent', translateRes.result.transResult)
            }
            emit('update:translateStatus', 'showing')
          } else {
            emit('update:translateStatus', 'showing')
          }
        } else if (props.translateStatus === 'showing') {
          emit('update:translateStatus', 'hidden')
        }
      },
    })

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

  // publish buzz
  if (import.meta.env.MODE !== EnvMode.Mainnet) {
    actions.push({
      name: 'Talk.MessageMenu.toBuzz',
      icon: 'share_arrow',
      action: () => {
        // 复制该消息内容到剪贴板
        emit('toBuzz', props.message)
      },
    })

    // 回復
    const quoteProtocols = ['SimpleFileGroupChat', 'simpleGroupChat']
    if (quoteProtocols.includes(props.message.protocol)) {
      actions.push({
        name: 'Talk.MessageMenu.quote',
        icon: 'quote',
        action: () => {
          emit('quote', props.message)
        },
      })
    }
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

  return actions
})
</script>
