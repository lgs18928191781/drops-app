<template>
  <div class="pwa main-border primary still font-mono" v-if="isShow">
    <div class="header flex flex-align-center">
      <div class="flex1">
        <div class="title">{{ $t('PWA.title') }}</div>
      </div>
      <button class="close flex flex-align-center flex-pack-center">
        <Icon name="x_mark" @click="close" />
      </button>
    </div>
    <div class="content flex items-center gap-x-3">
      <span class="logo main-border still disabled flex flex-align-center flex-pack-center">
        <Icon name="show" />
      </span>
      <div class="flex1">
        <div class="tips">{{ $t('PWA.tips') }}</div>
      </div>
    </div>

    <template v-if="needsManualInstall">
      <div class="mt-4">
        <div class="text-sm">{{ $t('PWA.steps.title') }}</div>
        <div class="text-sm mt-1">
          <template v-if="isIOS">
            <div>{{ $t('PWA.steps.safari.step1') }}</div>
            <div class="flex items-center gap-x-1">
              {{ $t('PWA.steps.safari.step2') }}
              <Icon name="arrow_up_on_square" class="text-blue-600 w-5 h-5" />
              {{ $t('PWA.steps.safari.button') }}
            </div>
            <div>{{ $t('PWA.steps.safari.step3') }}</div>
            <div>{{ $t('PWA.steps.safari.step4') }}</div>
          </template>

          <template v-else>
            <div>{{ $t('PWA.steps.others.step1') }}</div>
            <div class="flex items-center gap-x-1">
              {{ $t('PWA.steps.others.click') }}
              <Icon name="arrow_up_on_square" class="text-blue-600 w-5 h-5" />
              {{ $t('PWA.steps.others.or') }}
              <Icon name="bars_3" class="text-blue-600 w-5 h-5" />
              {{ $t('PWA.steps.others.button') }}
            </div>
            <div>{{ $t('PWA.steps.others.step3') }}</div>
          </template>
        </div>
      </div>

      <div class="mt-4 flex gap-x-2 items-center">
        <button class="text-xs text-dark-400" @click="disablePrompt">
          {{ $t('PWA.DontAsk') }}
        </button>
      </div>

      <div class="operate flex flex-pack-end gap-x-3">
        <a class="main-border" @click="close">{{ $t('Cancel') }}</a>
        <a class="main-border" @click="finishInstall">{{ $t('PWA.Finished') }}</a>
      </div>
    </template>

    <template v-else>
      <div class="mt-4 flex gap-x-2 items-center">
        <button class="text-xs text-dark-400" @click="disablePrompt">
          {{ $t('PWA.DontAsk') }}
        </button>
      </div>

      <div class="operate flex flex-pack-end gap-x-3">
        <a class="main-border" @click="close">{{ $t('Cancel') }}</a>
        <a class="main-border" @click="install">{{ $t('PWA.Install') }}</a>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { isIOS, isWechat, isApp } from '@/stores/root'
import { onMounted, reactive, ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
const promptEvent: { val: Event | null } = reactive({ val: null })
const isShow = ref(false)

enum InstallStatus {
  Never = 'never',
  Done = 'done',
  Pending = 'pending',
}

const i18n = useI18n()
const hasPwaEvent = ref(false)
const needsManualInstall = computed(() => {
  // const supportPwa = 'onbeforeinstallprompt' in window

  return isIOS || !hasPwaEvent.value
})

onMounted(() => {
  // 以下环境直接禁用：微信、app
  if (isApp) {
    // 保存禁用状态
    const pwaInstall = localStorage.getItem('pwaInstall')
    if (pwaInstall) {
      const pwaInstallObj = JSON.parse(pwaInstall)
      pwaInstallObj.status = InstallStatus.Never
      localStorage.setItem('pwaInstall', JSON.stringify(pwaInstallObj))
    } else {
      localStorage.setItem('pwaInstall', JSON.stringify({ status: InstallStatus.Never }))
    }

    isShow.value = false

    return
  }

  //查询localStorage中状态，如果没有，则创建状态
  const pwaInstall = localStorage.getItem('pwaInstall')
  if (!pwaInstall) {
    const newInstall = {
      status: InstallStatus.Pending,
    }
    localStorage.setItem('pwaInstall', JSON.stringify(newInstall))
    isShow.value = true
  } else {
    // 有记录，判断状态
    const pwaInstallObj = JSON.parse(pwaInstall)
    //  如果状态不为pending，则不显示
    if (pwaInstallObj.status !== InstallStatus.Pending) {
      isShow.value = false
      return
    }

    // 如果状态为pending，则判断有没有上次时间戳；如果没有，则显示；如果有，则判断时间戳是否超过1周，如果超过，则显示
    const lastTime = pwaInstallObj.lastTime
    if (!lastTime) {
      isShow.value = true
      return
    }

    const now = Date.now()
    if (now - lastTime > 7 * 24 * 60 * 60 * 1000) {
      isShow.value = true
      return
    }
  }

  window.addEventListener(
    'beforeinstallprompt',
    function(event) {
      // 监听到可安装事件，进行触发提醒用户
      event.preventDefault()
      hasPwaEvent.value = true
      promptEvent.val = event
      // isShow.value = true
    },
    { once: true }
  )

  window.addEventListener(
    'appinstalled',
    () => {
      console.log('ok')
      i18n.t('PWA.InstallSuccess')
    },
    { once: true }
  )
})

function disablePrompt() {
  const pwaInstall = localStorage.getItem('pwaInstall')
  if (pwaInstall) {
    const pwaInstallObj = JSON.parse(pwaInstall)
    pwaInstallObj.status = InstallStatus.Never
    localStorage.setItem('pwaInstall', JSON.stringify(pwaInstallObj))
  } else {
    localStorage.setItem('pwaInstall', JSON.stringify({ status: InstallStatus.Never }))
  }
  isShow.value = false
}

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

  // 保存完成状态
  finishInstall()
}

function finishInstall() {
  // 保存完成状态
  const pwaInstall = localStorage.getItem('pwaInstall')
  if (pwaInstall) {
    const pwaInstallObj = JSON.parse(pwaInstall)
    pwaInstallObj.status = InstallStatus.Done
    localStorage.setItem('pwaInstall', JSON.stringify(pwaInstallObj))
  } else {
    localStorage.setItem('pwaInstall', JSON.stringify({ status: InstallStatus.Done }))
  }
  isShow.value = false
}

function close() {
  isShow.value = false
  promptEvent.val = null

  // 保存当前时间戳
  const pwaInstall = localStorage.getItem('pwaInstall')
  if (pwaInstall) {
    const pwaInstallObj = JSON.parse(pwaInstall)
    pwaInstallObj.lastTime = Date.now()
    localStorage.setItem('pwaInstall', JSON.stringify(pwaInstallObj))
  } else {
    localStorage.setItem(
      'pwaInstall',
      JSON.stringify({ status: InstallStatus.Pending, lastTime: Date.now() })
    )
  }
}
</script>

<style lang="scss" scoped src="./PWA.scss"></style>
