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
    <DrawerRightHeaderVue :title="$t('Setting.Theme')" @back="emit('update:modelValue', false)" />

    <div class="content">
      <div class="list">
        <div
          class="item flex flex-align-center"
          v-for="item in themes"
          :key="item.value"
          @click="setTheme(item.value)"
        >
          <component class="w-6 h-6 mr-3" :is="item.icon" />
          <div class="name flex1">{{ item.name }}</div>
          <span
            class="check-warp flex flex-align-center flex-pack-center"
            v-if="theme === item.value"
          >
            <Icon name="check" />
          </span>
        </div>
      </div>
    </div>
  </ElDrawer>
</template>

<script setup lang="ts">
import DrawerRightHeaderVue from '@/components/DrawerRightHeader/DrawerRightHeader.vue'
import LightIcon from '@/assets/svg/light.svg?component'
import DarkIcon from '@/assets/svg/dark.svg?component'
import SystemIcon from '@/assets/svg/follow_system.svg?component'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'
interface Props {
  modelValue: boolean
}
const props = withDefaults(defineProps<Props>(), {})
const emit = defineEmits(['update:modelValue'])
const i18n = useI18n()
const theme = ref(localStorage.theme || 'system')

const themes = [
  {
    icon: LightIcon,
    name: i18n.t('Theme.Light color'),
    value: 'light',
  },
  {
    icon: DarkIcon,
    name: i18n.t('Theme.Dark color'),
    value: 'dark',
  },
  {
    icon: SystemIcon,
    name: i18n.t('Theme.Follow system'),
    value: 'system',
  },
]

function setTheme(value: string) {
  theme.value = value
  switch (value) {
    case 'light':
      document.documentElement.classList.remove('dark')
      break
    case 'dark':
      document.documentElement.classList.add('dark')
      break
    case 'system':
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      break
  }

  if (value === 'system') {
    localStorage.removeItem('theme')
  } else {
    localStorage.theme = value
  }
}
</script>

<style lang="scss" scoped src="./Theme.scss"></style>
