<template>
  <ChooseMetaName @change="selectMetaName" :selected="form.metaName" :use-case="'community'" />
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
