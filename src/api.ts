import HttpRequest from '@/utils/request'
import qs from 'qs'

const env = import.meta.env
const baseURL = env.VITE_WalletApi && typeof env.VITE_WalletApi === 'string' ? env.VITE_WalletApi : '' 
const apiHttp = new HttpRequest(baseURL).request

export const GetToken = (params: object) => {
    return apiHttp.post('/showmoney/oauth2/oauth/token', params, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
        },
        transformRequest: [
          function(data: object) {
            return qs.stringify(data);
          }
        ]
    })
}