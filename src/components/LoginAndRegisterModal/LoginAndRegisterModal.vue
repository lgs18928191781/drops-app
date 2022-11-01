<template>
  <ElDialog :title="$t('Login')" :model-value="true">
    <div class="tabs">
      <a
        v-for="item in tabs"
        :key="item.key"
        :class="{ active: item.key === form.userType }"
        @click="form.userType = item.key"
        >{{ item.name() }}</a
      >
    </div>
    <ElForm :model="form" :rules="rules" ref="FormRef">
      <!--  手机 -->
      <ElFormItem prop="phone" v-if="form.userType === SignUserType.Phone">
        <ElInput v-model="form.phone" type="number" :placeholder="$t('Enter Phone Number')">
          <template #prefix>
            <Vue3CountryIntl
              v-model="form.area"
              schema="popover"
              v-model:visible="isShowCountry"
              :listZIndex="99"
              @onChange="res => (form.countryCode = res.iso2)"
              style="width: 100%;"
            >
              <div class="country-select flex flex-align-center" @click="isShowCountry = true">
                <span :class="'iti-flag ' + form.countryCode"> </span> <span>+{{ form.area }}</span>
              </div>
            </Vue3CountryIntl>
          </template>
        </ElInput>
      </ElFormItem>

      <!-- 邮箱 -->
      <ElFormItem prop="email" v-else>
        <ElInput v-model="form.email" type="text" :placeholder="$t('Enter Email Address')" />
      </ElFormItem>

      <!-- 密码 -->
      <ElFormItem prop="password">
        <ElInput
          v-model="form.password"
          type="password"
          show-password
          :placeholder="$t('Enter Your Password')"
        />
      </ElFormItem>

      <!-- 验证码 -->
      <ElFormItem prop="code">
        <ElInput
          v-model="form.code"
          type="number"
          :placeholder="$t('Enter Auth Code')"
          @input="form.code = form.code.slice(0, 6)"
        >
          <template #suffix>
            <ElButton size="sm" disabled class="none-box-shadow">{{ $t('Send Code') }}</ElButton>
          </template>
        </ElInput>
      </ElFormItem>
    </ElForm>

    <div class="operate">
      <div class="operate-top flex flex-align-center">
        <div class="flex1">
          {{ $t('Not Account') }} <a>{{ $t('Register') }}</a>
        </div>
        <span class="forget">{{ $t('Forget Password') }}</span>
      </div>
      <div class="operate-btn flex flex-v">
        <ElButton type="primary" size="large">{{ $t('Login') }}</ElButton>
      </div>
    </div>
  </ElDialog>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
// @ts-ignore
import Vue3CountryIntl from 'vue3-country-intl'
import 'vue3-country-intl/lib/vue3-country-intl.css'
import 'vue3-country-intl/lib/vue3-country-flag.css'
import 'vue3-country-intl/lib/flags-9980096a.png'
import { SignUserType } from '@/enum'

const i18n = useI18n()
const tabs = [
  {
    name: () => {
      return i18n.t('phone')
    },
    key: 'phone',
  },
  {
    name: () => {
      return i18n.t('Email')
    },
    key: 'email',
  },
]

const FormRef = ref()
const form = reactive({
  userType: 'phone',
  password: '',
  area: '86',
  countryCode: 'cn',
  phone: '',
  email: '',
  name: '',
  code: '',
  imageCode: '',
})

const rules = reactive({
  phone: [
    {
      required: () => form.userType === 'phone',
      message: () => i18n.t('Enter Mobile Number'),
      trigger: 'blur',
    },
  ],
  email: [
    {
      required: () => form.userType === 'email',
      message: () => i18n.t('Enter Email Address'),
      trigger: 'blur',
    },
    {
      pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
      message: () => i18n.t('Email Address Error'),
      trigger: 'blur',
    },
  ],
  name: [
    {
      required: true,
      message: () => i18n.t('Enter User Name'),
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
  imageCode: [
    {
      required: true,
      message: () => i18n.t('Enter Pic Code'),
      trigger: 'blur',
    },
  ],
})

const isShowCountry = ref(false)
</script>

<style lang="scss" scoped src="./LoginAndRegisterModal.scss"></style>
<style>
.vue-country-intl-popover {
  z-index: 9999;
}
</style>
