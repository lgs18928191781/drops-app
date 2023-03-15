<template>
  <ConfirmModal
    :model-value="modelValue"
    :isHideCancelBtn="true"
    :confirm-btn-text="$t('LinkAccount.Next')"
    :confirm-btn-class="confirmBtnClass"
    :operate-warp-margin-top="12"
    @confirm="confirm"
    @update:model-value="val => emit('update:modelValue', val)"
  >
    <template #title>
      <div class="title text-center flex1" :style="{ fontSize: '24px' }">
        {{ $t('LinkAccount.Enter Password') }}
      </div>
    </template>
    <template #content>
      <div class="tips text-center">{{ $t('LinkAccount.Please enter your password') }}</div>
      <div class="input">
        <ElInput type="password" :placeholder="$t('LinkAccount.Password')" v-model="pwd" />
      </div>
    </template>
  </ConfirmModal>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { hdWalletFromAccount } from '@/utils/wallet/hd-wallet'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import ConfirmModal from '../ConfirmModal/ConfirmModal.vue'

interface Props {
  modelValue: boolean
}
const emit = defineEmits(['update:modelValue', 'success'])
const props = withDefaults(defineProps<Props>(), {})

const pwd = ref('')
const userStore = useUserStore()
const i18n = useI18n()

async function confirm() {
  if (!pwd.value) {
    return
  }
  // 生成的钱包地址 = 当前钱包地址 为密码正确
  const res = await hdWalletFromAccount(
    {
      ...userStore.user!,
      password: pwd.value,
    },
    import.meta.env.VITE_NET_WORK,
    userStore.user!.path
  )
  if (res.rootAddress === userStore.showWallet!.wallet!.rootAddress) {
    pwd.value = ''
    emit('update:modelValue', false)
    emit('success')
  } else {
    return ElMessage.error(i18n.t('LinkAccount.PasswordError'))
  }
}

const confirmBtnClass = computed(() => {
  if (pwd.value) {
    return 'primary'
  } else {
    return 'faded'
  }
})
</script>

<style lang="scss" scoped src="./CheckEnterPwdModal.scss"></style>
