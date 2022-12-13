<template>
  <!-- text -->
  <div class="content-item" @click.stop="toMetaNode">
    <CardVue class="meta-node-card" color="#5BA1FF">
      <ElSkeleton :loading="isSkeleton" animated>
        <template #default>
          <div class="meta-node flex">
            <Image :src="metanote.val!.headImg" v-if="metanote.val!.headImg" />
            <div class="cont">
              <div class="title">{{ metanote.val?.title }}</div>
              <div class="content">{{ metanote.val?.content.replace(/(^\s*)|(\s*$)/g, '') }}</div>
            </div>
            <Icon name="down" class="right" />
          </div>
        </template>
      </ElSkeleton>
    </CardVue>
  </div>
</template>

<script setup lang="ts">
import { GetMetaNote } from '@/api/aggregation'
import { useUserStore } from '@/stores/user'
import { reactive, ref } from 'vue'
import CardVue from '@/components/Card/Card.vue'

interface Props {
  buzz: BuzzItem
}
const props = withDefaults(defineProps<Props>(), {})

const userStore = useUserStore()

const metanote: { val: null | MetaNoteItem } = reactive({ val: null })
const isSkeleton = ref(true)

function getMetaNote() {
  return new Promise<void>(async resolve => {
    const res = await GetMetaNote({
      txId: props.buzz.txId,
      metaId: userStore.user?.metaId,
    }).catch(error => {
      ElMessage.error(error.message)
    })
    if (res?.code === 0) {
      metanote.val = res.data
      resolve()
    }
  })
}

function toMetaNode() {
  window.open(`${import.meta.env.VITE_METANOTE}/detail/${props.buzz.txId}`, '_blank')
}

getMetaNote().then(() => {
  isSkeleton.value = false
})
</script>

<style lang="scss" scoped src="./BuzzItemContentMetaNote.scss"></style>
