<template>
  <ModelVue
    :model-value="modelValue"
    v-model:show-second-control="isShowMnemonic"
    :is-hide-close="true"
    :mobileSize="95"
    :width="'456px'"
  >
    <template #body>
      <div class="backup-mnemonic flex">
        <div class="backup-mnemonic-item flex1 left flex flex-v">
          <div class="flex1">
            <div class="title">{{ $t('Login.BackupMnemonic.title') }}</div>
            <div class="drsc">{{ $t('Login.BackupMnemonic.intro') }}</div>
            <div
              class="main-border flex flex-align-center check"
              @click="isShowMnemonic = !isShowMnemonic"
            >
              <span
                class="check-warp flex flex-align-center flex-pack-center"
                :class="{ active: isBackUp }"
              >
                <Icon v-if="isBackUp" name="check" />
              </span>
              <div class="text flex1">{{ $t('Login.BackupMnemonic.name') }}</div>
              <Icon name="down" />
            </div>
          </div>
          <div class="operate flex flex-align-center">
            <div class="flex1">
              <span v-html="$t('Login.BackupMnemonic.jumpOver')" @click="skip"></span>
            </div>
            <a class="main-border primary" :class="{ faded: !isBackUp }" @click="confirm">
              <Icon name="right" />
            </a>
          </div>
        </div>
      </div>
    </template>
    <template #secondBody>
      <div class="backup-mnemonic flex">
        <div class="backup-mnemonic-item flex1 right">
          <div class="title">{{ $t('Login.BackupMnemonic.copyMnemonic') }}</div>
          <div class="msg">
            <div class="path">
              {{ $t('Login.BackupMnemonic.path') }}: m/44'/{{ walletPath }}'/0'
            </div>
            <div class="path">{{ $t('Login.BackupMnemonic.mnemonic') }}: {{ mnemonic }}</div>
          </div>
          <div class="operate main-border primary" @click="finish">
            {{ $t('Login.BackupMnemonic.copyedMnemonic') }}
          </div>
        </div>
      </div>
    </template>
  </ModelVue>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { decryptMnemonic } from '@/utils/wallet/hd-wallet'
import { decode, encode } from 'js-base64'
import { ref, watch } from 'vue'
import ModelVue from '@/components/Modal/Modal.vue'

interface Props {
  modelValue: boolean
}
const props = withDefaults(defineProps<Props>(), {})

const emit = defineEmits(['update:modelValue', 'finish'])
const userStore = useUserStore()

const mnemonic = ref('')
const isBackUp = ref(false)
const isShowMnemonic = ref(false)
const walletPath = import.meta.env.VITE_WALLET_PATH

watch(
  () => props.modelValue,
  () => {
    if (!userStore.metaletLogin) {
      mnemonic.value = decryptMnemonic(
        userStore.user!.enCryptedMnemonic,
        decode(localStorage.getItem(encode('password'))!)
      )
    }
  }
)

function skip() {
  emit('finish')
  emit('update:modelValue', false)
  if (userStore.user!.name == `${import.meta.env.VITE_DefaultName}`) {
    window.location.reload()
  }
  if (userStore.metaletLogin) {
    window.location.reload()
  }
}

function confirm() {
  if (!isBackUp.value) return
  emit('finish')
  emit('update:modelValue', false)
  if (userStore.user!.name == `${import.meta.env.VITE_DefaultName}`) {
    window.location.reload()
  }
}

function finish() {
  isBackUp.value = true
  isShowMnemonic.value = false
}
</script>

<style lang="scss" scoped src="./BackupMnemonic.scss"></style>
