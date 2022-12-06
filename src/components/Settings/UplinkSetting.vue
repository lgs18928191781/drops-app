<template>
  <ElDrawer
    :model-value="true"
    :show-close="false"
    :with-header="false"
    :size="'360px'"
    :append-to-body="true"
    :lock-scroll="true"
    custom-class="none-padding"
  >
    <DrawerRightHeaderVue :title="$t('Setting.Uplink settings')" />

    <div class="content">
      <img class="cover" src="@/assets/images/uplink_img.png" />

      <div class="list">
        <div class="item ">
          <div class="cont flex flex-align-center">
            <div class="lable flex1">{{ $t('UplinkSetting.Uplink Payment Confirmation') }}</div>
            <el-switch
              :model-value="userStore.sdkPayConfirm[SdkPayType.ME]!.visible"
              @change="onConfirmChange"
            />
          </div>
          <div class="intro">
            {{ $t('UplinkSetting.ConfirmationIntro') }}
          </div>
        </div>

        <div class="item">
          <div class="cont flex flex-align-center" @click="setMeValue">
            <div class="lable flex1">{{ $t('UplinkSetting.Alert value setting') }}</div>
            <span class="value">{{ userStore.sdkPayConfirm[SdkPayType.ME]!.value }} ME</span>
            <Icon name="down" class="right" />
          </div>
          <div class="intro">
            {{ $t('UplinkSetting.AlertValueIntro') }}
          </div>
        </div>
      </div>
    </div>
  </ElDrawer>
</template>

<script setup lang="ts">
import DrawerRightHeaderVue from '@/components/DrawerRightHeader/DrawerRightHeader.vue'
import { useRootStore } from '@/stores/root'
import { useUserStore } from '@/stores/user'
import { ElSwitch } from 'element-plus'
import { ref } from 'vue'
import { SdkPayType } from '@/enum'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'

const userStore = useUserStore()
const rootStore = useRootStore()
const i18n = useI18n()

function onConfirmChange(value: boolean) {
  userStore.changeSdkPayConfirm('visible', value, SdkPayType.ME)
}

function setMeValue() {
  ElMessageBox.prompt('', i18n.t('UplinkSetting.Alert value setting'), {
    confirmButtonText: i18n.t('Confirm'),
    cancelButtonText: i18n.t('Cancel'),
    inputPattern: /^[1-9][0-9]*$/,
    inputErrorMessage: i18n.t('Invalid Value'),
  }).then(({ value }) => {
    const _value = parseInt(value)
    if (_value) {
      userStore.changeSdkPayConfirm('value', _value, SdkPayType.ME)
    }
  })
}
</script>

<style lang="scss" scoped src="./UplinkSetting.scss"></style>
