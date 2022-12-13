<template>
  <ElDrawer
    :model-value="modelValue"
    :show-close="false"
    :with-header="false"
    :size="'360px'"
    :append-to-body="true"
    :lock-scroll="true"
    :close-on-click-modal="false"
    custom-class="none-padding"
  >
    <header class="flex flex-align-center">
      <div class="title flex1">
        {{ $t('Setting.title') }}
      </div>
      <a
        class="close flex flex-align-center flex-pack-center"
        @click="emit('update:modelValue', false)"
      >
        <Icon name="x_mark" />
      </a>
    </header>

    <div class="list">
      <div
        class="item flex flex-align-center"
        @click="isShowEditProfile = true"
        v-if="userStore.isAuthorized"
      >
        <span class="icon-warp flex flex-align-center flex-pack-center">
          <UserAvatar :meta-id="userStore.user!.metaId" :image="userStore.user!.avatarImage" />
        </span>
        <span class="flex1 name">{{ $t('Setting.Edit Profile') }}</span>
        <Icon class="right" name="down" />
      </div>
      <div
        class="item flex flex-align-center"
        v-for="item in list"
        :key="item.icon"
        @click="item.fun()"
      >
        <span class="icon-warp flex flex-align-center flex-pack-center">
          <Icon :name="item.icon" />
        </span>
        <span class="flex1 name">{{ item.name }}</span>
        <span class="value">{{ item.value() }}</span>
        <Icon class="right" name="down" />
      </div>
    </div>

    <!-- EditProfile -->
    <EditProfileVue v-model="isShowEditProfile" v-if="userStore.isAuthorized" />
    <!-- UplinkSettingVue -->
    <UplinkSettingVue v-model="isShowUploadLinkSet" />
    <!-- Language -->
    <LanguageVue v-model="isShowLangSet" />
    <!-- Theme -->
    <ThemeVue v-model="isShowThemeSet" />
  </ElDrawer>
  <!-- <div
    class="fixed inset-0 h-screen w-screen z-[60] bg-dark-100 flex justify-center items-center select-none"
  >
    <div
      class="h-full w-full relative bg-dark-100 px-5 py-2.5 lg:w-96 lg:bg-white lg:h-4/5 lg:rounded-lg lg:shadow-lg"
    >
      <div class="h-8 flex items-center justify-end">
        <Icon
          name="x_circle"
          class="w-6 h-6 text-dark-400 cursor-pointer"
          @click="$emit('closeModal')"
        />
      </div>

      <div class="text-dark-300 text-xs font-bold pb-2 px-2 uppercase">
        {{ $t('Talk.Settings.settings') }}
      </div>

      <div class="flex flex-col space-y-4 px-2">
        <div class="py-1.5">
          <div class="text-dark-800 text-base font-medium mb-3 capitalize">
            {{ $t('Talk.Settings.language') }}
          </div>

          <div class="mt-1 flex flex-col gap-y-3">
            <div
              class="main-border p-2.5  text-dark-800 flex items-center justify-between cursor-pointer transition-all duration-150"
              :class="[
                currentLanguage === language.code
                  ? 'bg-primary text-dark-800'
                  : 'faded bg-white text-dark-400',
              ]"
              @click="switchLanguage(language.code)"
              v-for="language in languages"
            >
              <div class="">
                <Icon
                  :name="currentLanguage === language.code ? 'radio_circle_fill' : 'radio_circle'"
                  class="w-6 h-6"
                />
              </div>
              <div class="flex items-center">
                <div class="text-base font-medium capitalize">
                  {{ $t('Talk.Settings.' + language.code) }}
                </div>
                <img :src="language.flag" alt="" class="ml-2 h-4 w-6" />
              </div>
            </div>
          </div>
        </div>

        <div class="py-1.5">
          <div class="text-dark-800 text-base font-medium mb-3 capitalize">
            {{ $t('Talk.Settings.theme') }}
          </div>
          <div class="mt-1 flex flex-col gap-y-3">
            <div
              class="bg-primary main-border p-2.5 text-dark-800 flex items-center justify-between cursor-pointer transition-all duration-150"
            >
              <div class="">
                <Icon name="radio_circle_fill" class="w-6 h-6 text-dark-800" />
              </div>
              <div class="flex items-center">
                <div class="text-base font-medium capitalize">{{ $t('Talk.Settings.light') }}</div>
              </div>
            </div>

            <div
              class="bg-white main-border faded p-2.5 text-dark-400 flex items-center justify-between cursor-pointer"
            >
              <div class="">
                <Icon name="radio_circle" class="w-6 h-6 text-dark-400" />
              </div>
              <div class="flex items-center">
                <div class="text-base font-medium capitalize">{{ $t('Talk.Settings.dark') }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div> -->
</template>
<script lang="ts" setup>
import FlagEn from '@/assets/images/flag_en.png?url'
import FlagCn from '@/assets/images/flag_cn.png?url'
import { useI18n } from 'vue-i18n'
import { computed, reactive, ref } from 'vue'
import { useUserStore } from '@/stores/user'
import EditProfileVue from './EditProfile.vue'
import UplinkSettingVue from './UplinkSetting.vue'
import LanguageVue from './Language.vue'
import ThemeVue from './Theme.vue'

interface Props {
  modelValue: boolean
}
const props = withDefaults(defineProps<Props>(), {})

const emit = defineEmits(['update:modelValue'])
const i18n = useI18n()
const userStore = useUserStore()
const isShowEditProfile = ref(false)
const isShowLangSet = ref(false)
const isShowThemeSet = ref(false)
const isShowUploadLinkSet = ref(false)

const switchLanguage = (lang: string) => {
  i18n.locale.value = lang
  currentLanguage.value = lang
  localStorage.setItem('lang', lang)
}

const list = computed(() => {
  const result = [
    {
      name: i18n.t('Setting.Language'),
      icon: 'i18n',
      value: () => {
        return i18n.locale.value.toUpperCase()
      },
      fun: function() {
        isShowLangSet.value = true
      },
    },
    {
      name: i18n.t('Setting.Theme'),
      icon: 'theme',
      value: () => {
        return localStorage.theme === 'dark' ? 'Dark' : 'Light'
      },
      fun: function() {
        isShowThemeSet.value = true
      },
    },
  ]
  if (userStore.isAuthorized) {
    result.unshift({
      name: i18n.t('Setting.Uplink settings'),
      icon: 'link',
      value: () => {
        return ''
      },
      fun: function() {
        isShowUploadLinkSet.value = true
      },
    })
  }

  return result
})

const currentLanguage = ref(i18n.locale.value)
</script>
<style lang="scss" scoped src="./SettingsModal.scss"></style>
