<template>
  <ElDialog
    :model-value="modelValue"
    :title="$t('MetaName.Renew') + ': ' + metaname"
    class="metaname"
  >
    <div class="renew">
      <div class="year section">
        <div class="label">{{ $t('MetaName.Renewal time') }}</div>
        <div class="count flex flex-align-center flex-pack-center">
          <a
            class="flex flex-align-center flex-pack-center"
            @click="year > 1 ? (year = year - 1) : ''"
            >-</a
          >
          <span class="value">{{ year }} {{ $t('MetaName.Year') }}</span>
          <a class="flex flex-align-center flex-pack-center" @click="year = year + 1">+</a>
        </div>
      </div>

      <div class="fee section flex flex-align-center">
        <div class="flex1">
          <span class="label">{{ $t('MetaName.Renewal time') }}</span>
        </div>
        <span class="value"><span class="amount">$5</span></span>
      </div>

      <div class="fee section flex flex-align-center">
        <div class="flex1">
          <span class="label">{{ $t('MetaName.Expiration time after renewal') }}</span>
        </div>
        <span class="value flex flex-align-center"
          >约2025.1.3 12:32 (UTC) <Icon name="question_circle"
        /></span>
      </div>

      <div class="btn primary">
        {{ $t('MetaName.Next Step') }}
      </div>
    </div>
  </ElDialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  modelValue: boolean
  metaname: string
}
const props = withDefaults(defineProps<Props>(), {})

const year = ref(1)
</script>

<style lang="scss" scoped src="./RenewModal.scss"></style>
