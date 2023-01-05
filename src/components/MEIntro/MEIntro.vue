<template>
  <!-- ME Intro -->
  <ContentModalVue
    :model-value="modelValue"
    @update:model-value="val => emit('update:modelValue', val)"
    :title="$t('ME.What is MetaEnergy')"
    :i18n="i18n"
    :z-index="99999"
  >
    <template #content>
      <div class="me-intro">
        {{ $t('ME.intro1') }}

        <h2>{{ $t('ME.How MetaEnergy is Generated') }}</h2>
        {{ $t('ME.intro2') }}

        <h2>{{ $t('ME.How to get ME') }}</h2>
        {{ $t('ME.intro3') }}

        <ul>
          <li>{{ $t('ME.intro4') }}</li>
          <li>{{ $t('ME.intro5') }}</li>
          <li>{{ $t('ME.intro6') }}</li>
          <li>{{ $t('ME.intro7') }}</li>
        </ul>

        <h2>{{ $t('ME.How ME burns') }}</h2>
        {{ $t('ME.intro8') }}

        <ul>
          <li>{{ $t('ME.intro9') }}</li>
          <li>{{ $t('ME.intro10') }}</li>
          <li>{{ $t('ME.intro11') }}</li>
          <li v-if="$i18n.locale === 'zh'">{{ $t('ME.intro12') }}</li>
          <li v-if="$i18n.locale === 'zh'">{{ $t('ME.intro13') }}</li>
        </ul>
      </div>
    </template>
  </ContentModalVue>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import ContentModalVue from '../ContentModal/ContentModal.vue'

interface Props {
  modelValue: boolean
  i18n?: any
}

const props = withDefaults(defineProps<Props>(), {})

const $i18n = props.i18n ? props.i18n : useI18n()
const $t = $i18n.t

const emit = defineEmits(['update:modelValue'])
</script>

<style lang="scss" scoped src="./MEIntro.scss"></style>
