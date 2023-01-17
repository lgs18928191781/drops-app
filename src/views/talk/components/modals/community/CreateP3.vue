<template>
  <ChooseMetaName @change="selectMetaName" :name="form.metaName?.name" />
</template>

<script lang="ts" setup>
import { useCommunityFormStore } from '@/stores/forms'
import { useLayoutStore } from '@/stores/layout'
import ChooseMetaName from '@/components/ChooseMetaName/ChooseMetaName.vue'

const layout = useLayoutStore()
const form = useCommunityFormStore()

const selectMetaName = (metaName: MetaNameItem) => {
  form.metaName = metaName
  layout.isShowChooseMetaNameModal = false
}
</script>
