<template>
  <div class="cert flex flex-pack-end flex-align-center">
    <ElPopover placement="bottom" trigger="hover" :width="'auto'">
      <template #reference>
        <a class="flex flex-align-center flex-pack-end">
          <img v-if="props.metaId && isCert" class="icon-cert" :src="CertIcon" />
          <img v-else class="icon-cert" :src="UnCertIcon" />
          <span v-if="!isOnlyIcon">{{
            (props.metaId && isCert) || certed ? $t('isCert') : $t('unCert')
          }}</span>
          <i v-if="!isOnlyIcon" class="el-icon-arrow-right icon-right"></i>
        </a>
      </template>
      <div class="certed-user-info">
        <template v-if="isCert">
          <div class="certed-user-item flex flex-align-center">
            <span class="label">{{ $t('realName') }}:</span
            ><span class="value flex1">{{
              userInfo.val?.realName ? userInfo.val?.realName : $t('noMsg')
            }}</span>
          </div>
          <div class="certed-user-item flex flex-align-center">
            <span class="label">{{ $t('idNumber') }}:</span
            ><span class="value flex1">{{
              userInfo.val?.idNumber ? userInfo.val?.idNumber : $t('noMsg')
            }}</span>
          </div>
          <div class="certed-user-item flex flex-align-center">
            <span class="label">{{ $t('certBody') }}:</span
            ><span class="value flex1">{{
              userInfo.val?.userCertificationType === 1
                ? $t('personCert')
                : userInfo.val?.organizationName
                ? userInfo.val?.organizationName
                : $t('noMsg')
            }}</span>
          </div>
        </template>
        <template v-else>
          <div class="no-cert">{{ $t('userNotCerted') }}</div>
        </template>
      </div>
    </ElPopover>
  </div>
</template>
<script lang="ts" setup>
import { ref, computed } from '@vue/runtime-core'


import { useRootStore } from '@/stores/root'
import { GetCertUserInfo } from '@/api'
import CertIcon from '@/assets/images/icon_cer.svg?url'
import UnCertIcon from '@/assets/images/icon_uncer.svg?url'
const rootStore = useRootStore()
const userInfo: { val: CertUserInfo | null } = { val: null }
const isGetUserInfoed = ref(false)

const props = defineProps<{
  metaId?: string
  certed?: boolean
  isOnlyIcon?: boolean
}>()

const isCert = computed(() => {
  const result = props.metaId && rootStore.isCertedMetaIds.find(item => item === props.metaId)
  if (result && !isGetUserInfoed.value) {
    isGetUserInfoed.value = true
    getCertUserInfo()
  }
  return result
})

async function getCertUserInfo() {
  try {
    const res = await GetCertUserInfo(props.metaId)
    if (res.code === 0) {
      userInfo.val = res.data
    }
  } catch (error) {}
}
</script>
<style lang="scss" scoped src="./Cert.scss"></style>
