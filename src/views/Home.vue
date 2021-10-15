<template>
  <div class="home container">
    home
    <LoadMore :pagination="pagination" @getMore="getMore" />
    <IsNull />

    <div class="icon">
      svg-icon
      <FileUploadIcon />
    </div>

    <div class="test sendMetaTxData flex" style="margin-top: 60px;">
      <button @click="sendMetaTxData">sendMetaTxData</button>
      <textarea readonly class="flex1" style="height: 300px;">{{ sendMetaTxDataRes.val }}</textarea>
    </div>

    <ElTooltip placement="top">
      <template #content> multiple lines<br />second line </template>
      <a>Top center</a>
    </ElTooltip>
  </div>
</template>
<script setup lang="ts">
import {} from '@/api'
import { useStore } from '@/store'
import { reactive, ref } from 'vue'
import LoadMore from '@/components/LoadMore/LoadMore.vue'
import FileUploadIcon from '@/assets/images/file_upload.svg'
import { ElTooltip } from 'element-plus'
import IsNull from '../components/IsNull/IsNull.vue'
import { useI18n } from 'vue-i18n'
import { checkSdkStatus } from '@/utils/util'

const i18n = useI18n()
const store = useStore()
const pagination = reactive({
  ...store.state.pagination,
})
let sendMetaTxDataRes: { val: any } = reactive({ val: {} })

async function sendMetaTxData() {
  await checkSdkStatus()
  debugger
  sendMetaTxDataRes.val = await store.state.sdk?.sendMetaDataTx({
    brfcId: 'test',
    data: JSON.stringify({
      content: 'test',
    }),
    nodeName: 'Test',
    path: '/Protocols/Test',
  })
  debugger
}

//  加载更多
function getMore() {
  pagination.loading = true
  pagination.page++
}
</script>
<style lang="scss" scoped src="./Home.scss"></style>
