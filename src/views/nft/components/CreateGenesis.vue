<template>
  <ElDialog
    :model-value="modelValue"
    :title="$t('NFT.Create Genesis')"
    class="sm"
    :close-on-click-modal="false"
    @close="emit('update:modelValue', false)"
  >
    <ElForm :model="form" :label-position="'top'">
      <ElFormItem prop="name" :label="$t('NFT.Genesis Name')">
        <ElInput type="text" v-model="form.name" :placeholder="$t('NFT.Enter genesis name')" />
      </ElFormItem>
      <ElFormItem prop="name" :label="$t('NFT.Genesis Count')">
        <ElInput
          type="number"
          v-model="form.count"
          :placeholder="$t('NFT.Enter genesis nft count')"
        />
      </ElFormItem>

      <ElFormItem>
        <a class="main-border primary flex1 flex flex-align-center flex-pack-center">
          {{ $t('Confirm') }}
        </a>
      </ElFormItem>
    </ElForm>
  </ElDialog>
</template>

<script setup lang="ts">
import { NodeName } from '@/enum'
import { useUserStore } from '@/stores/user'
import { reactive } from 'vue'

interface Props {
  modelValue: boolean
}
const props = withDefaults(defineProps<Props>(), {})
const emit = defineEmits(['update:modelValue'])

const userStore = useUserStore()
const form = reactive({
  name: '',
  count: 1,
})

async function genesis() {
  const res = await userStore.showWallet.createBrfcChildNode({
    nodeName: NodeName.NftGenesis,
    data: JSON.stringify({
      type: 'metacontract',
      totalSupply: form.count,
      seriesName: form.name,
    }),
  })
  if (res) {
  }
}
</script>

<style lang="scss" scoped src="./CreateGenesis.scss"></style>
