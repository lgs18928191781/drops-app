<template>
  <div class="home container">
    <!-- home
    <LoadMore :pagination="pagination" @getMore="getMore" />
    <IsNull />

    <div class="icon">
      svg-icon
      <FileUploadIcon />
    </div>

    <div class="test sendMetaTxData flex" style="margin-top: 60px;">
      <button @click="sendMetaTxData">sendMetaTxData</button>
      <textarea readonly class="flex1" style="height: 300px;">{{ sendMetaTxDataRes.val }}</textarea>
    </div> -->

    <div>
      <el-form ref="formRef" :model="form" label-width="140px">
        <el-form-item label="idNumber">
          <el-input v-model="form.idNumber"></el-input>
        </el-form-item>
        <el-form-item label="information">
          <el-input v-model="form.information" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="informationEn">
          <el-input v-model="form.informationEn" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="informationJp">
          <el-input v-model="form.informationJp" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="metaId">
          <el-input v-model="form.metaId"></el-input>
        </el-form-item>
        <el-form-item label="metaIdName">
          <el-input v-model="form.metaIdName"></el-input>
        </el-form-item>
        <el-form-item label="organizationName">
          <el-input v-model="form.organizationName"></el-input>
        </el-form-item>
        <el-form-item label="organizationNameEn">
          <el-input v-model="form.organizationNameEn"></el-input>
        </el-form-item>
        <el-form-item label="organizationNameJp">
          <el-input v-model="form.organizationNameJp"></el-input>
        </el-form-item>
        <el-form-item label="realName">
          <el-input v-model="form.realName"></el-input>
        </el-form-item>
        <el-form-item label="userProfile">
          <el-input v-model="form.userProfile" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="userProfileEn">
          <el-input v-model="form.userProfileEn" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="userProfileJp">
          <el-input v-model="form.userProfileJp" type="textarea"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">Confirm</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script setup lang="ts">
import {} from '@/api'
import { useStore } from '@/store'
import { reactive, ref } from 'vue'
import LoadMore from '@/components/LoadMore/LoadMore.vue'
import FileUploadIcon from '@/assets/images/file_upload.svg'
import IsNull from '../components/IsNull/IsNull.vue'
import { useI18n } from 'vue-i18n'
import { checkSdkStatus } from '@/utils/util'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const i18n = useI18n()
const store = useStore()
const pagination = reactive({
  ...store.state.pagination,
})

const form = reactive({
  idNumber: '',
  information: '',
  informationEn: '',
  informationJp: '',
  metaId: '',
  metaIdName: '',
  organizationName: '',
  organizationNameEn: '',
  organizationNameJp: '',
  realName: '',
  userProfile: '',
  userProfileEn: '',
  userProfileJp: '',
})
let sendMetaTxDataRes: { val: any } = reactive({ val: {} })

async function sendMetaTxData() {
  await checkSdkStatus()
  sendMetaTxDataRes.val = await store.state.sdk?.sendMetaDataTx({
    brfcId: 'test',
    data: JSON.stringify({
      content: 'test',
    }),
    nodeName: 'Test',
    path: '/Protocols/Test',
  })
}

//  加载更多
function getMore() {
  pagination.loading = true
  pagination.page++
}

function onSubmit() {
  axios
    .post(
      'https://api.showmoney.app/broad/v1/nos/certification/setNosCertificationUserInfo',
      { ...form },
      {
        headers: {
          AuthorizationToken:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJTaG93T3BlcmF0aW9uIiwibWV0YUlkIjoiIiwiY29yZVRva2VuIjoiIiwidXNlckFjY291bnQiOiJTaG93T3BlcmF0aW9uIiwiaGFzaFBhc3MiOiIkMmEkMTAkLnZjZGZIVFB2aGI1RGp3ME00NXNOZWNQLkprTWNWWUpvbFg4aFE5RGxUbFJVaVRCTGNxV2kiLCJub25jZSI6IlhWbEJ6Z2JhaUNNUkFqV3cifQ.wqzgS8xvDLsJv2mHOA0D34Ojq6HafxuRijfgmwyhdy0',
        },
      }
    )
    .then(() => {
      ElMessage.success('success')
      for (let i in form) {
        //@ts-ignore
        form[i] = ''
      }
    })
}
</script>
<style lang="scss" scoped src="./Home.scss"></style>
