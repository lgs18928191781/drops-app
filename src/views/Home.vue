<template>
<<<<<<< HEAD
  <div>
    12132132
  </div>
</template>
=======
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
>>>>>>> dev2

<script setup lang="ts">

</script>

<style lang="scss" scoped>
</style>
