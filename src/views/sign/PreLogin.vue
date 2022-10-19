<template>
  <div class="user-form login-form container">
    <el-form>
      <el-form-item v-if="signBaseInfo.userType === 'phone'" prop="phone">
        <el-input v-model="signBaseInfo.phone" type="number" max-lenght="15" placeholder="手机号码">
          <!-- <template #prepend><vue-country-intl v-model="tempUserInfo.areaCode"></vue-country-intl></template> -->
          <template #prepend>
            <el-select v-model="signBaseInfo.areaCode" filterable value-key="dialCode">
              <template #prefix>
                <div v-if="selectedCountry" class="selected">
                  <!-- {{ selectedCountry.name}} -->
                  {{ selectedCountry.dialCode }}
                </div>
              </template>
              <el-option v-for="country in countriesData" :key="country.iso2"
                :label="'(' + country.dialCode + ')' + country.name" :value="country.dialCode" />
            </el-select>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item v-if="signBaseInfo.userType === 'email'" prop="email">
        <el-input v-model="signBaseInfo.email" type="text" placeholder="邮箱地址"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="btn-submit" size="large" type="primary" :loading="loading" :disabled="
          (signBaseInfo.userType === 'email' && signBaseInfo.email === '') ||
            (signBaseInfo.userType === 'phone' && signBaseInfo.phone === '')
        " @click="checkUser">下一步</el-button>
      </el-form-item>
      <div class="form-tip">未注册用户验证后将自动进入注册并登录</div>
      <div class="types">
        <a v-if="signBaseInfo.userType !== 'phone'" @click="changeUserType(SignUserType.Phone)">
          手机登录
          <Icon icon="bi:chevron-right" width="16" />
        </a>
        <a v-if="signBaseInfo.userType !== 'email'" @click="changeUserType(SignUserType.Email)">
          邮箱登录
          <Icon icon="bi:chevron-right" width="16" />
        </a>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Icon } from '@iconify/vue'
import { userCheck, loginGetCode } from '@/api/index'
import { countriesData } from '@/utils/country-data'
import { SignUserType } from '@/enum'
import { useRootStore } from '@/stores/root'
import { storeToRefs } from 'pinia'

const rootStore = useRootStore()
const { signBaseInfo } = storeToRefs(rootStore)
const route = useRoute()
const router = useRouter()
const loading = ref(false)

const changeUserType = (type: SignUserType) => {
  signBaseInfo.value.userType = type
  signBaseInfo.value.phone = ''
  signBaseInfo.value.email = ''
}

const selectedCountry = computed(() => {
  const country = countriesData.find(country => country.dialCode === signBaseInfo.value.areaCode)
  return country
})

const checkUser = async () => {
  if (signBaseInfo.value.userType === 'phone') {
    if (
      !signBaseInfo.value.phone!.match(
        /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
      )
    ) {
      return ElMessage.error('手机号码格式不正确')
    }
  } else {
    if (!signBaseInfo.value.email!.match(/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/)) {
      return ElMessage.error('邮箱格式不正确')
    }
  }

  loading.value = true

  const res = await userCheck({
    ...signBaseInfo.value,
    phone:
      signBaseInfo.value.areaCode !== '86'
        ? '' + signBaseInfo.value.areaCode + signBaseInfo.value.phone
        : signBaseInfo.value.phone,
  })
  if (res.code === 0) {
    if (signBaseInfo.value.userType === 'email' && import.meta.env.MODE === 'prod') {
      loading.value = false
      return ElMessage.error('暂不支持邮箱注册')
    } else {
      router.replace({ name: 'register' })
    }
  } else if (res.code === -1) {
    return ElMessage.error('此账号已注销')
  } else {
    if (route.query.isInvite) {
      // 邀新活动
      loading.value = false
      return ElMessage.error('此活动只支持新用户参加，请更换账号再试')
    } else {
      const getCode = await loginGetCode({
        ...signBaseInfo.value,
        platform: 1,
        phone:
          signBaseInfo.value.areaCode !== '86'
            ? '+' + signBaseInfo.value.areaCode + signBaseInfo.value.phone
            : signBaseInfo.value.phone,
      })
      if (getCode.code === 0) {
        rootStore.startSendCodeCountdown()
        ElMessage.success('验证码已发送，五分钟内有效。')
        router.replace({ name: 'login' })
      } else {
        loading.value = false
        ElMessage.error(getCode.msg)
      }
    }
  }
}

if (route.query.redirect) {
  rootStore.$patch({
    redirectUri: route.query.redirect as string,
  })
}
</script>
<style lang="scss" scoped src="./PreLogin.scss">

</style>
