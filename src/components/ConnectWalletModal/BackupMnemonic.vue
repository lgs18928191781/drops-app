<template>
  <ElDialog :model-value="modelValue" class="none-header none-bg-color">
    <div class="backup-mnemonic flex">
      <div class="backup-mnemonic-item flex1 left flex flex-v">
        <div class="flex1">
          <div class="title">{{ $t('Login.BackupMnemonic.title') }}</div>
          <div class="drsc">{{ $t('Login.BackupMnemonic.intro') }}</div>
          <div class="main-border disabled flex flex-align-center check">
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
            <span v-html="$t('Login.BackupMnemonic.jumpOver')"></span>
          </div>
          <a class="main-border primary" :class="{ faded: !isBackUp }" @click="confirm">
            <Icon name="right" />
          </a>
        </div>
      </div>
      <div class="backup-mnemonic-item flex1 right">
        <div class="title">{{ $t('Login.BackupMnemonic.copyMnemonic') }}</div>
        <div class="msg">
          <div class="path">{{ $t('Login.BackupMnemonic.path') }}: m/44'/236'/0'</div>
          <div class="path">{{ $t('Login.BackupMnemonic.mnemonic') }}: {{ mnemonic }}</div>
        </div>
        <div class="operate main-border primary" @click="isBackUp = true">
          {{ $t('Login.BackupMnemonic.copyedMnemonic') }}
        </div>
      </div>
    </div>
  </ElDialog>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { decryptMnemonic } from '@/utils/wallet/hd-wallet'
import { decode, encode } from 'js-base64'
import { ref, watch } from 'vue'

interface Props {
  modelValue: boolean
}
const props = withDefaults(defineProps<Props>(), {})

const emit = defineEmits(['update:modelValue'])
const userStore = useUserStore()
const mnemonic = ref('')
const isBackUp = ref(false)

watch(
  () => props.modelValue,
  () => {
    mnemonic.value = decryptMnemonic(
      userStore.user!.enCryptedMnemonic,
      decode(localStorage.getItem(encode('password'))!)
    )
  }
)

function confirm() {
  if (!isBackUp.value) return
  emit('update:modelValue', false)
}
</script>

<style lang="scss" scoped src="./BackupMnemonic.scss"></style>
