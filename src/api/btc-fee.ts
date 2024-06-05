import HttpRequest from '@/utils/request'

// @ts-ignore
const feeb = new HttpRequest(`${import.meta.env.VITE_MEMPOOL_BASE_URL}/fees`, {
  header: {
    'Content-Type': 'application/json',
  },
  responseHandel: response => {
    return new Promise((resolve, reject) => {
      if (response?.data && typeof response.data?.code === 'number') {
        if (response.data.code === 0 || response.data.code === 601) {
          resolve(response.data)
        } else {
          reject({
            code: response.data.code,
            message: response.data.data,
          })
        }
      } else {
        resolve(response.data)
      }
    })
  },
}).request

// @ts-ignore
const rate = new HttpRequest(`${import.meta.env.VITE_HOST_URL}`, {
  header: {
    'Content-Type': 'application/json',
  },
  responseHandel: response => {
    return new Promise((resolve, reject) => {
      if (response?.data && typeof response.data?.code === 'number') {
        if (response.data.code === 0 || response.data.code === 601) {
          resolve(response.data)
        } else {
          reject({
            code: response.data.code,
            message: response.data.data,
          })
        }
      } else {
        resolve(response.data)
      }
    })
  },
}).request

export type FeebPlan = {
  feeRate: number
  title: 'Eco' | 'Slow' | 'Avg' | 'Fast' | 'Custom'
  fullTitle?: string
  icon?: string
}

export const getFeebPlans = async (): Promise<FeebPlan[]> => {
  const res: {
    economyFee: number
    fastestFee: number
    halfHourFee: number
    hourFee: number
    minimumFee: number
  } = await feeb.get(`/recommended`)
  if (!res) return []
  return [
    {
      title: 'Eco',
      fullTitle: 'Economy',
      feeRate: res.economyFee,
      icon: 'Snail',
    },
    {
      title: 'Slow',
      feeRate: res.hourFee,
      icon: 'Turtle',
    },
    {
      title: 'Avg',
      feeRate: res.halfHourFee,
      icon: 'Rabbit',
    },
    {
      title: 'Fast',
      feeRate: res.fastestFee,
      icon: 'Bird',
    },
  ]
}

export const getBtcRate = async (): Promise<{
  code: number
  message: string
  processingTime: number
  data: {
    usd: {
      btc: string
    }
  }
}> => {
  return await rate.get(`/rate-services`)
}
