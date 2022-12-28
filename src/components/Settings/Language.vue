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
    <DrawerRightHeaderVue
      :title="$t('Setting.Language')"
      @back="emit('update:modelValue', false)"
    />

    <div class="content">
      <div class="list">
        <div
          class="item flex flex-align-center"
          v-for="item in langs"
          :key="item.value"
          @click="SetLang(item.value)"
        >
          <component class="icon-warp" :is="item.icon" />
          <div class="name flex1">{{ item.name }}</div>
          <span
            class="check-warp flex flex-align-center flex-pack-center"
            v-if="$i18n.locale === item.value"
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
import EnglishIcon from '@/assets/svg/icon_english.svg?component'
import ChineseIcon from '@/assets/svg/icon_chinese.svg?component'
import { useI18n } from 'vue-i18n'
import { useRootStore } from '@/stores/root'
import { SetLang } from '@/utils/util'

interface Props {
  modelValue: boolean
}
const props = withDefaults(defineProps<Props>(), {})
const emit = defineEmits(['update:modelValue'])
const i18n = useI18n()
const rootStore = useRootStore()

const langs = [
  { icon: EnglishIcon, name: 'English', value: 'en' },
  { icon: ChineseIcon, name: '中文（简体）', value: 'zh' },
]
</script>

<style lang="scss" scoped src="./Language.scss"></style>
