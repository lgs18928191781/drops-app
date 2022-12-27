import Request from 'request-sdk'
import i18n from './i18n'

export default class HttpRequest {
  request
  constructor(
    baseUrl: string,
    params?: {
      header?: { [key: string]: any } // 自定义 header
      errorHandel?: (error: any) => Promise<any> // 自定义 错误处理
      responseHandel?: (response: any) => Promise<any> // 自定义 错误处理
      timeout?: number
      timeoutErrorMessage?: string
    }
  ) {
    this.request = new Request(baseUrl, {
      // @ts-ignore
      timeoutErrorMessage: i18n.global.t('Request Timeout'),
      ...params,
    }).request
  }
}
