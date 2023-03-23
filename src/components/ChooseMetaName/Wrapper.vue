<template>
  <BaseModal v-model="layout[ShowControl.isShowChooseMetaNameModal2]">
    <template #title>
      MetaName
    </template>

    <template #body>
      <ChooseMetaName @change="selectMetaName" :use-case="'community'" class="min-h-[360PX]" />
    </template>
  </BaseModal>
</template>

<script lang="ts" setup>
import ChooseMetaName from './ChooseMetaName.vue'
import BaseModal from '@/views/talk/components/modals/BaseModal.vue'
import { ShowControl } from '@/enum'
import { useLayoutStore } from '@/stores/layout'

const layout = useLayoutStore()

const emit = defineEmits(['choose'])

const selectMetaName = (metaName: MetaNameItem) => {
  emit('choose', metaName)
  layout.isShowChooseMetaNameModal2 = false
}
</script>
