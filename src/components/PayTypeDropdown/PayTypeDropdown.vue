<template>
  <ElDropdown trigger="click" @visible-change="value => emit('update:modelValue', value)">
    <a class="flex flex-align-center pay-item" :class="{ active: modelValue }">
      <div class="icon-warp flex flex-align-center flex-pack-center">
        <img :src="payPlatformList.find(item => item.platform === currentPayPlatform)?.icon" />
      </div>
      <div class="name">
        {{ payPlatformList.find(item => item.platform === currentPayPlatform)?.name() }}
      </div>
      <Icon name="down" class="down" />
    </a>
    <template #dropdown>
      <ElDropdownMenu>
        <ElDropdownItem
          v-for="(item, index) in payPlatformList"
          :key="index"
          @click="choosePayPlatform(item)"
          :disabled="item.disabled()"
        >
          <a
            class="flex flex-align-center pay-item"
            :class="{ active: currentPayPlatform === item.platform }"
          >
            <div class="flex1 flex flex-align-center">
              <div class="icon-warp flex flex-align-center flex-pack-center">
                <img :src="item.icon" />
              </div>
              <span class="name">{{ item.name() }}</span>
            </div>
            <div class="check-warp flex flex-align-center flex-pack-center">
              <Icon name="check" v-if="currentPayPlatform === item.platform" />
            </div>
          </a>
        </ElDropdownItem>
      </ElDropdownMenu>
    </template>
  </ElDropdown>
</template>

<script setup lang="ts">
import { PayPlatformItem, payPlatformList } from '@/config'
import { PayPlatform } from '@/enum'

const props = defineProps<{
  modelValue: boolean
  currentPayPlatform: PayPlatform
}>()

const emit = defineEmits(['update:modelValue', 'update:currentPayPlatform', 'change'])

function choosePayPlatform(item: PayPlatformItem) {
  if (item.disabled()) return
  emit('update:currentPayPlatform', item.platform)
  emit('change')
}
</script>

<style lang="scss" scoped src="./PayTypeDropdown.scss"></style>
