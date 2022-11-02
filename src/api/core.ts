import { useUserStore } from '@/stores/user'
import HttpRequest from 'request-sdk'
import { ApiResultTypes, BaseUserInfoParams } from '.'

// @ts-ignore
const Core = new HttpRequest(`${import.meta.env.VITE_BASEAPI}/showpaycore`, {
  header: () => {
    const userStore = useUserStore()
    if (userStore.isAuthorized) {
      return {
        accessKey: userStore.user!.token,
        userName:
          userStore.user!.userType === 'email' ? userStore.user!.email! : userStore.user!.phone!,
        timestamp: () => new Date().getTime(),
      }
    } else {
      return {}
    }
  },
  responseHandel: response => {
    return new Promise((resolve, reject) => {
      if (response?.data && typeof response.data?.code === 'number') {
        if (response.data.code === 0) {
          resolve(response.data)
        } else {
          reject({
            code: response.data.code,
            message: response.data.msg,
          })
        }
      } else {
        resolve(response.data)
      }
    })
  },
}).request

export const UpdateUserInfo = (): Promise<apiResponse> => {
  const userStore = useUserStore()
  const params = {
    userType: userStore.user!.userType,
    phone: userStore.user!.phone ? userStore.user!.phone : undefined,
    email: userStore.user!.email ? userStore.user!.email : undefined,
  }
  return Core.post('/api/v1/user/setuserinfo', params)
}

// 获取注册验证码
export const RegisterGetCode = async (params: BaseUserInfoParams): Promise<ApiResultTypes> => {
  return Core.post('/api/v1/user/register/verification', params)
}
