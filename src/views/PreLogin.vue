<template>
  <div class="user-form login-form container">
    <el-form>
      <el-form-item v-if="tempUserInfo.userType === 'phone'" prop="phone">
        <el-input v-model="tempUserInfo.phone" type="number" max-lenght="15" placeholder="手机号码">
          <!-- <template #prepend><vue-country-intl v-model="tempUserInfo.areaCode"></vue-country-intl></template> -->
          <template #prepend>
            <el-select v-model="tempUserInfo.areaCode" filterable value-key="dialCode">
              <template #prefix>
                <div v-if="selectedCountry" class="selected">
                  <!-- {{ selectedCountry.name}} -->
                  {{ selectedCountry.dialCode }}
                </div>
              </template>
              <el-option
                v-for="country in countriesData"
                :key="country.iso2"
                :label="'(' + country.dialCode + ')' + country.name"
                :value="country.dialCode"
              />
            </el-select>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item v-if="tempUserInfo.userType === 'email'" prop="email">
        <el-input v-model="tempUserInfo.email" type="text" placeholder="邮箱地址"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          class="btn-submit"
          size="large"
          type="primary"
          :loading="loading"
          :disabled="
            (tempUserInfo.userType === 'email' && tempUserInfo.email === '') ||
              (tempUserInfo.userType === 'phone' && tempUserInfo.phone === '')
          "
          @click="checkUser"
          >下一步</el-button
        >
      </el-form-item>
      <div class="form-tip">未注册用户验证后将自动进入注册并登录</div>
      <div class="types">
        <a v-if="tempUserInfo.userType !== 'phone'" @click="changeUserType('phone')">
          手机登录
          <Icon icon="bi:chevron-right" width="16" />
        </a>
        <a v-if="tempUserInfo.userType !== 'email'" @click="changeUserType('email')">
          邮箱登录
          <Icon icon="bi:chevron-right" width="16" />
        </a>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Icon } from '@iconify/vue'
import { setSendCodeTimer, sendCodeTimer, setRedirectUri } from '@/stores/root'
import { emptyUserInfo, updateUser, UserType } from '@/stores/user'
import { userCheck, loginGetCode } from '@/api/index'
import { countriesData } from '@/utils/country-data'

const route = useRoute()
const router = useRouter()
const tempUserInfo = reactive(emptyUserInfo)
const loading = ref(false)

const changeUserType = (type: UserType) => {
  tempUserInfo.userType = type
  tempUserInfo.phone = ''
  tempUserInfo.email = ''
}

const selectedCountry = computed(() => {
  const country = countriesData.find(country => country.dialCode === tempUserInfo.areaCode)
  return country
})

const checkUser = async () => {
  if (tempUserInfo.userType === 'phone') {
    if (
      !tempUserInfo.phone!.match(
        /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
      )
    ) {
      return ElMessage.error('手机号码格式不正确')
    }
  } else {
    if (!tempUserInfo.email!.match(/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/)) {
      return ElMessage.error('邮箱格式不正确')
    }
  }

  loading.value = true

  const res = await userCheck({
    ...tempUserInfo,
    phone:
      tempUserInfo.areaCode !== '86'
        ? '' + tempUserInfo.areaCode + tempUserInfo.phone
        : tempUserInfo.phone,
  })
  updateUser(tempUserInfo)
  if (res.code === 0) {
    if (tempUserInfo.userType === 'email' && import.meta.env.MODE === 'prod') {
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
      if (sendCodeTimer.value > 0) {
        setTimeout(() => {
          loading.value = false
        }, sendCodeTimer.value * 1000)
        return ElMessage.error(`请勿频繁操作，${sendCodeTimer.value}s 后再试`)
      }
      const getCode = await loginGetCode({
        ...tempUserInfo,
        platform: 1,
        phone:
          tempUserInfo.areaCode !== '86'
            ? '+' + tempUserInfo.areaCode + tempUserInfo.phone
            : tempUserInfo.phone,
      })
      if (getCode.code === 0) {
        setSendCodeTimer(60)
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
  setRedirectUri(route.query.redirect as string)
}
</script>
<style lang="scss" scoped src="./PreLogin.scss"></style>
