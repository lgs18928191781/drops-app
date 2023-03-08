<template>
  <div class="pwa main-border primary" v-if="isShow">
    <div class="header flex flex-align-center">
      <div class="flex1">
        <div class="title">{{ $t('PWA.title') }}</div>
      </div>
      <a class="close main-border flex flex-align-center flex-pack-center">
        <Icon name="x_mark" @click="close" />
      </a>
    </div>
    <div class="content flex">
      <span class="logo main-border disabled flex flex-align-center flex-pack-center">
        <Icon name="show" />
      </span>
      <div class="flex1">
        <div class="tips">{{ $t('PWA.tips') }}</div>
      </div>
    </div>

    <div class="operate flex flex-pack-end">
      <a class="main-border" @click="close">{{ $t('Cancel') }}</a>
      <a class="main-border" @click="install">{{ $t('PWA.Install') }}</a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
const promptEvent: { val: Event | null } = reactive({ val: null })
const isShow = ref(true)

const i18n = useI18n()
onMounted(() => {
  window.addEventListener(
    'beforeinstallprompt',
    function(event) {
      // 监听到可安装事件，进行触发提醒用户
      event.preventDefault()
      promptEvent.val = event
      isShow.value = true
    },
    { once: true }
  )

  window.addEventListener(
    'appinstalled',
    () => {
      i18n.t('PWA.InstallSuccess')
    },
    { once: true }
  )
})

function install() {
  // @ts-ignore
  promptEvent.val.userChoice
    .then(
      function() {
        promptEvent.val = null
      },
      (error: any) => {
        ElMessage.error(error.message)
      }
    )
    .catch((error: any) => {
      ElMessage.error(error.message)
    })
  // @ts-ignore
  promptEvent.val?.prompt()
  isShow.value = false
}

function close() {
  isShow.value = false
  promptEvent.val = null
}
</script>

<style lang="scss" scoped src="./PWA.scss"></style>
