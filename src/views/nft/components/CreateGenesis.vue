<template>
  <ElDialog
    :model-value="modelValue"
    :title="$t('NFT.Create Genesis')"
    class="sm"
    :close-on-click-modal="false"
    @close="emit('update:modelValue', false)"
    :show-close="!loading"
  >
    <ElForm :model="form" :label-position="'top'" v-loading="loading" :rules="rule" ref="FormRef">
      <ElFormItem prop="name" :label="$t('NFT.Genesis Name')">
        <ElInput type="text" v-model="form.name" :placeholder="$t('NFT.Enter genesis name')" />
      </ElFormItem>
      <ElFormItem prop="count" :label="$t('NFT.Genesis Count')">
        <ElInput
          type="number"
          v-model="form.count"
          :placeholder="$t('NFT.Enter genesis nft count')"
        />
      </ElFormItem>

      <ElFormItem>
        <a
          class="main-border primary flex1 flex flex-align-center flex-pack-center"
          @click="genesis"
        >
          {{ $t('Confirm') }}
        </a>
      </ElFormItem>
    </ElForm>
  </ElDialog>
</template>

<script setup lang="ts">
import { NodeName } from '@/enum'
import { useUserStore } from '@/stores/user'
import { useGenesisStore } from '@/stores/genesis'
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { FormRules } from 'element-plus'

interface Props {
  modelValue: boolean
}
const props = withDefaults(defineProps<Props>(), {})
const emit = defineEmits(['update:modelValue'])

const userStore = useUserStore()
const genesisStore = useGenesisStore()
const i18n = useI18n()
const loading = ref(false)
const FormRef = ref()

const form = reactive({
  name: '',
  count: 1,
})
const rule: FormRules = {
  name: [{ required: true, message: i18n.t('NFT.Enter genesis name'), trigger: 'blur' }],
  count: [
    { required: true, message: i18n.t('NFT.Enter genesis nft count'), trigger: 'blur' },
    // {
    //   type: 'number',
    //   min: 1,
    //   message: i18n.t('NFT.Genesis nft count must more than1'),
    //   trigger: 'blur',
    // },
  ],
}
async function genesis() {
  loading.value = true
  const res = await userStore.showWallet
    .createBrfcChildNode({
      nodeName: NodeName.NftGenesis,
      data: JSON.stringify({
        type: 'metacontract',
        totalSupply: form.count,
        seriesName: form.name,
      }),
    })
    .catch(error => {
      ElMessage.error(error.message)
      loading.value = false
    })
  if (res) {
    genesisStore.add({
      codehash: res.nft!.genesis!.codehash,
      count: 0,
      currentTotalSupply: 0,
      genesis: res.nft!.genesis!.genesis,
      genesisTimestamp: new Date().getTime(),
      minted: '',
      pendingCount: 0,
      seriesName: form.name,
      totalSupply: form.count,
      sensibleId: res.nft!.genesis!.sensibleId,
      metaId: userStore.user!.metaId,
    })
    FormRef.value.resetFields()
    loading.value = false
    ElMessage.success(i18n.t('NFT.Create genesis success'))
    emit('update:modelValue', false)
  } else if (res === null) {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped src="./CreateGenesis.scss"></style>
