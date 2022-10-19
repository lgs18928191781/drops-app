<template>
  <el-button text @click="outerVisible = true">open the outer Dialog</el-button>

  <el-dialog v-model="outerVisible" title="外层弹窗">
    <template #default>
      <component :is="outsideComponentName"></component>
      <el-dialog v-model="innerVisible" width="600px" title="内层弹窗" append-to-body>
        <template #default>
          <component :is="insideComponentName"></component>
        </template>
      </el-dialog>
    </template>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="outerVisible = false">Cancel</el-button>
        <el-button type="primary" @click="innerVisible = true">open the inner Dialog</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { CompomentArray, moduleName } from './module/index'

const outerVisible = ref(false)
const innerVisible = ref(false)
const outsideComponentName = ref(null)
const insideComponentName = ref(null)
const props = defineProps<{
  dialogName: IDialog
}>()

CompomentArray.forEach(item => {
  if (props.dialogName.outsideName == item) {
    outsideComponentName.value = moduleName[item]
  }
})
</script>

<style lang="scss" scoped></style>
