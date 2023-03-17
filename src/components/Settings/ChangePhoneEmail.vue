<template>
  <ConfirmModal
    :model-value="modelValue"
    @update:model-value="val => emit('update:modelValue', val)"
    @confirm="emit('confirm')"
    @cancel="isShowCheckPwd = true"
    :cancel-btn-text="
      type === 'phone' ? $t('LinkAccount.Change Mobile') : $t('LinkAccount.Change Email')
    "
  >
    <template #title>
      <div class="title text-center flex1" :style="{ fontSize: '24px' }">
        {{ type === 'phone' ? $t('LinkAccount.Phone') : $t('LinkAccount.Email') }}
      </div>
    </template>

    <template #content>
      <div class="tips text-center">
        {{
          type === 'phone' ? $t('LinkAccount.PhoneChangeTips') : $t('LinkAccount.EmailChangeTips')
        }}
      </div>
      <div class="value text-center">
        {{ valueShowText }}
      </div>
    </template>
  </ConfirmModal>

  <CheckEnterPwdModal v-model="isShowCheckPwd" @success="isShowInputPhone = true" />

  <ConfirmModal
    v-model="isShowInputPhone"
    @confirm="submit"
    :is-hide-cancel-btn="true"
    :confirm-btn-text="$t('LinkAccount.Change the Link')"
    :operate-warp-margin-top="15"
  >
    <template #title>
      <div class="title text-center flex1" :style="{ fontSize: '24px' }">
        {{
          type === 'phone'
            ? $t('LinkAccount.Change Mobile Link')
            : $t('LinkAccount.Change Emial Link')
        }}
      </div>
    </template>

    <template #content>
      <ElForm :model="form" :rules="rules" ref="FormRef">
        <!--  手机 -->
        <ElFormItem prop="phone" v-if="type === 'phone'">
          <ElInput
            v-model="form.phone"
            type="number"
            :placeholder="$t('Enter Phone Number')"
            :disabled="loading"
          >
            <template #prefix>
              <Vue3CountryIntl
                v-model="form.area"
                schema="popover"
                v-model:visible="isShowCountry"
                :listZIndex="99"
                @onChange="(res: any) => (form.countryCode = res.iso2)"
                style="width: 100%;"
              >
                <div
                  class="country-select flex flex-align-center"
                  @click="loading ? '' : (isShowCountry = true)"
                >
                  <span :class="'iti-flag ' + form.countryCode"> </span>
                  <span>+{{ form.area }}</span>
                </div>
              </Vue3CountryIntl>
            </template>
          </ElInput>
        </ElFormItem>

        <!-- 邮箱 -->
        <ElFormItem prop="email" v-if="type === 'email'">
          <ElInput
            v-model="form.email"
            type="text"
            :placeholder="$t('Enter Email Address')"
            :disabled="loading"
          />
        </ElFormItem>

        <!-- 验证码 -->
        <ElFormItem prop="code">
          <ElInput
            v-model="form.code"
            type="number"
            :placeholder="$t('Enter Auth Code')"
            @input="form.code = form.code.slice(0, 6)"
            :disabled="loading"
          >
            <template #suffix>
              <a
                class="send-code-btn"
                @click="sendCode"
                v-loading="isSendCodeLoading"
                :element-loading-svg="LoadingTEXT"
                >{{ sendCodeTimer === 0 ? $t('Send Code') : sendCodeTimer + 's' }}</a
              >
            </template>
          </ElInput>
        </ElFormItem>
      </ElForm>
    </template>
  </ConfirmModal>
</template>

<script setup lang="ts">
import ConfirmModal from '../ConfirmModal/ConfirmModal.vue'
import CheckEnterPwdModal from '../CheckEnterPwdModal/CheckEnterPwdModal.vue'
import { computed, reactive, ref } from 'vue'
import { BindPhoneOrEmail, LoginGetCode, RegisterGetCode } from '@/api/core'
import { useI18n } from 'vue-i18n'
import { LoadingTEXT } from '@/utils/LoadingSVGText'
import { email } from '@/utils/reg'
// @ts-ignore
import Vue3CountryIntl from 'vue3-country-intl'
import 'vue3-country-intl/lib/vue3-country-intl.css'
import 'vue3-country-intl/lib/vue3-country-flag.css'
import 'vue3-country-intl/lib/flags-9980096a.png'
import { FormInstance } from 'element-plus'
import { useUserStore } from '@/stores/user'
import { IsEncrypt, NodeName } from '@/enum'

interface Props {
  modelValue: boolean
  value?: string
  type?: 'phone' | 'email'
}
const props = withDefaults(defineProps<Props>(), {
  type: 'phone',
})

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel'])
const isShowCheckPwd = ref(false)
const isShowInputPhone = ref(false)
const loading = ref(false)
const sendCodeTimer = ref(0)
const isSendCodeLoading = ref(false)
const i18n = useI18n()
const FormRef = ref<FormInstance>()
const userStore = useUserStore()
const isShowCountry = ref(false)

const form = reactive({
  phone: '',
  email: '',
  area: '1',
  countryCode: 'us',
  code: '',
})

async function sendCode() {
  if (sendCodeTimer.value > 0) return
  isSendCodeLoading.value = true
  try {
    const params = {
      userType: props.type || 'phone',
      phone: (form.area !== '86' ? '+' : '') + phoneFullNumber.value,
      email: form.email,
      platform: 0, // 1是若喜 0是showmoney
    }
    const res = await RegisterGetCode(params)
    if (res.code === 0) {
      sendCodeTimer.value = 60
      isSendCodeLoading.value = false
      const interval = setInterval(() => {
        if (sendCodeTimer.value > 0) {
          sendCodeTimer.value = sendCodeTimer.value - 1
        } else {
          clearInterval(interval)
        }
      }, 1000)
      return ElMessage.success(i18n.t('Auth Code Send Success'))
    }
  } catch (error) {
    isSendCodeLoading.value = false
    ElMessage.error((error as any).message)
  }
}

const rules = reactive({
  phone: [
    {
      required: true,
      message: () => i18n.t('Enter Mobile Number'),
      trigger: 'blur',
    },
  ],
  email: [
    {
      required: true,
      message: () => i18n.t('Enter Email Address'),
      trigger: 'blur',
    },
    {
      pattern: email,
      message: () => i18n.t('Email Address Error'),
      trigger: 'blur',
    },
  ],
  code: [
    {
      required: true,
      message: () => i18n.t('Enter Auth Code'),
      trigger: 'blur',
    },
  ],
})

const phoneFullNumber = computed(() => {
  return form.area !== '86' ? form.area + form.phone : form.phone
})

const valueShowText = computed(() => {
  if (props.value) {
    if (props.type === 'email') {
      return props.value.split('@')[0].slice(0, 3) + '****@' + props.value.split('@')[1]
    } else if (props.type === 'phone') {
      return props.value.slice(0, 3) + '****' + props.value.slice(-4)
    }
  } else {
    return '--'
  }
})

function submit() {
  FormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      loading.value = true
      const res = await BindPhoneOrEmail({
        userType: props.type,
        email: form.email,
        phone: phoneFullNumber.value,
        code: form.code,
      })
      return
      const response = await userStore.showWallet.createBrfcChildNode({
        nodeName: props.type === 'phone' ? NodeName.Phone : NodeName.Email,
        data: props.type === 'phone' ? phoneFullNumber.value : form.email,
        encrypt: IsEncrypt.Yes,
      })
    }
  })
}
</script>

<style lang="scss" scoped src="./ChangePhoneEmail.scss"></style>
