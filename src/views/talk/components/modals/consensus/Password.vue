<template>
  <BaseModal
    v-model="layout[ShowControl.isShowPasswordModal]"
    :strict-close="true"
    :extra-close-event="goBack"
    :full-screen="true"
  >
    <template v-slot:title>
      {{ $t('Talk.Modals.enter_password') }}
    </template>

    <template v-slot:body>
      <div class="mb-10 text-center text-base italic text-link -mt-7" v-if="talk.activeChannel">
        {{ '# ' + talk.activeChannel.name }}
      </div>
      <div class="flex space-x-4 items-center">
        <form autocomplete="off" class="w-full">
          <div class="flex relative items-center grow">
            <input
              :type="isShowingPassword ? 'text' : 'password'"
              autocomplete="off"
              class="outline-0 main-border faded-switch !bg-white still w-full pl-4 pr-12 py-3 text-base"
              :placeholder="$t('Talk.Modals.enter_password_placeholder')"
              v-model="passwordForm.password"
            />

            <button
              class="absolute right-4"
              v-show="passwordForm.password.length > 0"
              @click="isShowingPassword = !isShowingPassword"
            >
              <Icon
                :name="isShowingPassword ? 'eye_slash' : 'eye'"
                class="w-5 h-5 text-dark-800 lg:text-dark-300 box-content lg:group-hover:text-dark-800 transition-all duration-200"
                :class="{ '!text-dark-800': passwordForm.password.length > 0 }"
              />
            </button>
          </div>
        </form>

        <button
          class="main-border px-6 py-3 text-base text-dark-800 bg-primary font-bold shrink-0"
          :class="{ 'faded still text-dark-300': !passwordForm.isFinished }"
          :disabled="!passwordForm.isFinished"
          @click="tryVerifyPassword"
        >
          {{ $t('Talk.Modals.enter_password_confirm') }}
        </button>
      </div>

      <div
        class="mt-1 text-red-600 font-medium text-sm transition-all duration-300 ease-out"
        :class="{ 'opacity-0': !isPasswordWrong }"
      >
        {{ $t('Talk.Modals.wrong_password_tip') }}
      </div>
    </template>
  </BaseModal>
</template>

<script lang="ts" setup>
import { ShowControl } from '@/enum'
import BaseModal from '../BaseModal.vue'
import { usePasswordFormStore } from '@/stores/forms'
import { useTalkStore } from '@/stores/talk'
import { MD5Hash } from '@/utils/crypto'
import { verifyPassword } from '@/utils/talk'
import { useLayoutStore } from '@/stores/layout'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const passwordForm = usePasswordFormStore()
const talk = useTalkStore()
const layout = useLayoutStore()
const isShowingPassword = ref(false)
const isPasswordWrong = ref(false)
const router = useRouter()

const goBack = () => {
  // 去 the-void
  const theVoid = `/talk/channels/${talk.activeCommunityId}/the-void`
  router.push(theVoid)
}

const tryVerifyPassword = () => {
  const channelKey = talk.activeChannel.roomStatus
  const creatorMetaId = talk.activeChannel.createUserMetaId
  if (!channelKey || !creatorMetaId) return true

  const md5Password = MD5Hash(passwordForm.password).substring(0, 16)

  if (verifyPassword(channelKey, md5Password, creatorMetaId)) {
    // 将本频道密码存入本地
    const _passwordLookup = localStorage.getItem(`channelPasswords-${talk.selfMetaId}`)
    const passwordLookup = _passwordLookup ? JSON.parse(_passwordLookup) : {}
    passwordLookup[talk.activeChannelId] = md5Password
    localStorage.setItem(`channelPasswords-${talk.selfMetaId}`, JSON.stringify(passwordLookup))

    passwordForm.password = ''

    talk.hasActiveChannelConsent = true
    layout.isShowPasswordModal = false
  } else {
    isPasswordWrong.value = true
    setTimeout(() => {
      isPasswordWrong.value = false
    }, 3000)
    passwordForm.password = ''
  }
}
</script>
