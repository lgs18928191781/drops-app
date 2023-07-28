<template>
  <ContentModalVue
    :model-value="modelValue"
    @update:model-value="val => emit('update:modelValue', val)"
    @updateShowMnemonic="updateShowMnemonicDialog"
    :title="title"
    :i18n="i18n"
    :z-index="99999"
    :extrafooter="true"
    :showMnemonic="showMnemonic"
  >
    <template #content>
      <div v-if="showMnemonic" class="content-wrap">
        <ul>
          <li>{{ $t('wallet_backup_tips4') }}</li>
          <li>{{ $t('wallet_backup_tips5') }}</li>
        </ul>
        <div class="word-wrap">
          <span v-for="item in decodeMnemonic">{{ item }}</span>
        </div>
        <div class="path-wrap">Path: m/44'/{{ path }}'/0'</div>
      </div>
      <div class="content-wrap" v-else>
        <ul>
          <li>{{ $t('wallet_backup_tips1') }}</li>
          <li>{{ $t('wallet_backup_tips2') }}</li>
          <li>{{ $t('wallet_backup_tips3') }}</li>
        </ul>
        <div class="img-wrap">
          <img :src="NoCamera" alt="" />
        </div>
      </div>
    </template>
    <template #footer> </template>
  </ContentModalVue>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import ContentModalVue from '../ContentModal/ContentModal.vue'
import NoCamera from '@/assets/images/not_allow_camara.svg?url'
import { useUserStore } from '@/stores/user'
import { useRootStore } from '@/stores/root'
import { decryptMnemonic } from '@/utils/wallet/hd-wallet'
import { encode, decode } from 'js-base64'
interface Props {
  modelValue: boolean
  i18n?: any
}
const props = withDefaults(defineProps<Props>(), {})
const userStore = useUserStore()
const rootStore = useRootStore()
const path = computed(() => {
  return userStore.user.path
})

const $i18n = props.i18n ? props.i18n : useI18n()
const $t = $i18n.t
const showMnemonic = ref(false)
const title = computed(() => {
  if (showMnemonic.value) {
    return $t('wallet.backupMnemonic')
  } else {
    return $t('wallet.generateMnemonic')
  }
})
const decodeMnemonic = computed(() => {
  const localPassword = decode(localStorage.getItem(encode('password')))
  if (rootStore.isImportMnemonicLogin) {
    return localPassword.split(' ')
  } else {
    return decryptMnemonic(userStore.user.enCryptedMnemonic, localPassword).split(' ')
  }
})

const emit = defineEmits(['update:modelValue'])
function updateShowMnemonicDialog(value) {
  showMnemonic.value = value
}
</script>

<style lang="scss">
.content-wrap {
  ul {
    display: flex;
    flex-direction: column;
    li {
      margin-bottom: 10px;
      font-size: 20px;
      font-weight: 600;
      opacity: 0.8;
    }
  }
  .img-wrap {
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      width: 100px;
      height: 100px;
    }
  }
  .word-wrap {
    margin-top: 20px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-row-gap: 15px;
    grid-column-gap: 15px;
    span {
      padding: 8px;
      text-align: center;
      border: 1px solid var(--border-color);
      border-radius: 12px;
      font-size: 16px;
      font-weight: 500;
    }
  }
  .path-wrap {
    margin-top: 15px;
    font-size: 18px;
    font-weight: 700;
    opacity: 0.9;
  }
}
</style>
