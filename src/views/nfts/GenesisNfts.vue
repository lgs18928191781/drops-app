<template>
  <div class="genesis-wrap">
    <header class="flex items-center border-b pb-3 border-[#EDEFF2]">
      <div class="w-5/12">
        <span
          @click="back"
          class="inline-flex rounded-full bg-[#EDEFF2] p-1.5 cursor-pointer hover:scale-105"
        >
          <el-icon><ArrowLeftBold /></el-icon
        ></span>
      </div>
      <div class="w-7/12 text-base font-medium ">
        {{ $t('Nfts.launch_create') }}
      </div>
    </header>
    <div class="form-wrap py-7">
      <el-form :model="form">
        <el-form-item class="flex items-center  " label-width="50%">
          <template #label>
            <span class="flex-1 text-base font-medium"> {{ $t('Nfts.launch_form_title1') }}</span>
          </template>
          <template #default>
            <div class="flex relative justify-end">
              <el-upload
                :multiple="false"
                action="#"
                class="avatar-uploader  w-24 h-24 flex items-center justify-center  border-2 border-[#BFC2CC] rounded-xl"
                :show-file-list="false"
                :before-upload="beforeAvatarUpload"
              >
                <img v-if="form.cover" :src="form.cover" class="avatar rounded-lg" />
                <el-icon v-else class="avatar-uploader-icon " color="#BFC2CC" :size="35"
                  ><Plus
                /></el-icon>
                <div
                  v-if="form.cover"
                  @click="remove"
                  class="absolute flex items-center justify-center bottom-0.5 py-0.5 bg-[rgba(0,0,0,0.4)] w-24 rounded-b-lg hover:bg-[rgba(0,0,0,0.3)]"
                >
                  <span class="text-[#FFFFFF]">{{ $t('Nfts.lauch_delete') }}</span>
                </div>
              </el-upload>
            </div>
          </template>
        </el-form-item>

        <el-form-item class="flex flex-col " label-width="auto">
          <template #label>
            <span class="flex text-base font-medium">{{ $t('Nfts.launch_title2') }}</span>
          </template>
          <template #default>
            <el-input v-model="form.name" :placeholder="$t('Nfts.launch_placeholder1')" />
          </template>
        </el-form-item>

        <el-form-item class="flex flex-col " label-width="auto">
          <template #label>
            <span class="flex text-base font-medium">{{ $t('Nfts.launch_title3') }}</span>
          </template>
          <template #default>
            <el-input
              :rows="10"
              v-model="form.desc"
              type="textarea"
              :placeholder="$t('Nfts.launch_placeholder2')"
            />
          </template>
        </el-form-item>

        <el-form-item class="flex flex-col " label-width="auto">
          <template #label>
            <span class="flex text-base font-medium">{{ $t('Nfts.launch_title4') }}</span>
          </template>
          <template #default>
            <el-input
              v-model="form.totalSupply"
              :formatter="(value:string) => `${value}`.replace(/\D+$/g, '')"
              :parser="(value:string) => value.replace(/\D+$/g, '')"
              :placeholder="$t('Nfts.launch_placeholder3')"
            />
          </template>
        </el-form-item>

        <el-form-item>
          <div
            class="mt-20 text-base font-medium py-4 flex items-center cursor-pointer justify-center main-border primary"
            @click="onSubmit"
          >
            {{ $t('Nfts.launch_next') }}
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeftBold,Delete,Plus } from '@element-plus/icons-vue'
import { reactive,ref } from 'vue'
import type { UploadProps  } from 'element-plus'
import { ElMessage } from 'element-plus'
import { compressImage, FileToAttachmentItem } from '@/utils/util'
import { useRouter,useRoute } from 'vue-router'

const fileType=[
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp'
]
const router=useRouter()
const route=useRoute()

const form = reactive({
  name: '',
  cover: '',
  coverHex:'',
  desc: '',
  totalSupply:"0"
})
const onSubmit = () => {
  //router.push({name:''})
  router.push({name:'nftsCollection'})
}

function back(){

    router.push({name:'launchpad'})
}

function remove(e:any){
    e.stopPropagation();
    if(form.cover){
        form.cover =''
    form.coverHex=''
    }else return
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = async(rawFile) => {
  if (!fileType.includes(rawFile.type) ) {
    ElMessage.error('Avatar picture must be JPG/PNG/GIF/WEBP format!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 1) {
    ElMessage.error('Avatar picture size can not exceed 1MB!')
    return false
  }

    const compressed = await compressImage(rawFile)
    const result = await FileToAttachmentItem(compressed)

    form.cover = result.url
    form.coverHex=result.data

  return true
}
</script>

<style scoped src="./GenesisNfts.scss"></style>
