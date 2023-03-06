<template>
  <ElDrawer
    :model-value="modelValue"
    :show-close="false"
    :with-header="false"
    :size="'360px'"
    :append-to-body="true"
    :lock-scroll="true"
    :close-on-click-modal="false"
    custom-class="none-padding"
  >
    <DrawerRightHeaderVue
      :title="$t('Setting.Link Account')"
      @back="emit('update:modelValue', false)"
    />

    <div class="content">
      <div class="section" v-for="(section, index) in sections" :key="index">
        <div class="title" v-if="section.title && section.title()">{{ section.title() }}</div>
        <div class="section-list">
          <div
            class="section-item flex flex-align-center"
            v-for="(item, itemIndex) in section.list"
            :key="itemIndex"
            @click="item.fun()"
          >
            <div class="flex1">
              <div
                class="icon-warp flex flex-align-center flex-pack-center"
                v-if="item.icon"
                :class="item.icon"
              >
                <Icon :name="item.icon" />
              </div>
              <img class="cover" :src="item.img" v-if="item.img" />
            </div>
            <div class="value" :class="{ faded: !item.value() }">
              {{ item.value() ? item.value() : $t('LinkAccount.None') }}
            </div>
            <Icon name="copy" class="copy" v-if="item.isCopy" />
            <Icon name="down" class="right" v-else />
          </div>
        </div>
      </div>
    </div>

    <!-- ChangePhone -->
    <ChangePhone v-model="isShowChangePhone" :phone="userStore.user?.phone" />
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
import { copy } from '@/utils/util'
import MetaMask from '@/assets/images/login_logo_matamask.png'
import logo_metaid from '@/assets/icons/logo_metaid.svg?url'
import ChangePhone from './ChangePhone.vue'

interface Props {
  modelValue: boolean
}
const props = withDefaults(defineProps<Props>(), {})
const emit = defineEmits(['update:modelValue'])
const userStore = useUserStore()
const rootStore = useRootStore()
const i18n = useI18n()
const isShowChangePhone = ref(false)

const sections = [
  {
    list: [
      {
        icon: 'logo_metaid',
        value: () => {
          return userStore.user!.metaId.slice(0, 6) + '...' + userStore.user!.metaId.slice(-3)
        },
        fun: () => {
          copy(userStore.user!.metaId)
        },
        isCopy: true,
      },
      {
        icon: 'phone',
        name: () => {
          return i18n.t('LinkAccount.Phone')
        },
        value: () => {
          return userStore.user!.phone.slice(0, 3)
            ? userStore.user!.phone.slice(0, 3) + '****' + userStore.user!.phone.slice(-4)
            : ''
        },
        fun: () => {
          isShowChangePhone.value = true
        },
      },
      {
        icon: 'email',
        name: () => {
          return i18n.t('LinkAccount.Email')
        },
        value: () => {
          return userStore.user!.email
            ? userStore.user!.email.slice(0, 3) + '****@' + userStore.user!.email.split('@')[1]
            : ''
        },
        fun: () => {
          copy(userStore.user!.metaId)
        },
      },
    ],
  },
  {
    title: () => i18n.t('LinkAccount.Wallets'),
    list: [
      {
        icon: '',
        img: MetaMask,
        name: () => {
          return 'MetaMask'
        },
        value: () => {
          return userStore.user!.evmAddress
            ? userStore.user!.evmAddress.slice(0, 6) + '...' + userStore.user!.evmAddress.slice(-3)
            : ''
        },
        fun: () => {
          copy(userStore.user!.metaId)
        },
      },
    ],
  },
]
const payTypes = [
  {
    name: 'ME',
    value: SdkPayType.ME,
  },
  {
    name: 'SPACE',
    value: SdkPayType.SPACE,
  },
]

function onConfirmChange(value: boolean) {
  userStore.changeSdkPayConfirm('visible', value, userStore.sdkPayment)
}

function setMeValue() {
  if (userStore.sdkPayConfirm[userStore.sdkPayment]!.visible) return
  ElMessageBox.prompt('', i18n.t('UplinkSetting.Alert value setting'), {
    confirmButtonText: i18n.t('Confirm'),
    cancelButtonText: i18n.t('Cancel'),
    inputPattern: /^[1-9][0-9]*$/,
    inputErrorMessage: i18n.t('Invalid Value'),
    confirmButtonClass: 'main-border primary',
    cancelButtonClass: 'main-border',
  }).then(({ value }) => {
    const _value = parseInt(value)
    if (_value) {
      userStore.changeSdkPayConfirm('value', _value, userStore.sdkPayment)
    }
  })
}
</script>

<style lang="scss" scoped src="./LinkAccount.scss"></style>
