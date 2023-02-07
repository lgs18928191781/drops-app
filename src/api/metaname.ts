import HttpRequest from '@/utils/request'

const metanameApi = new HttpRequest(`${import.meta.env.VITE_BASEAPI}/metaname-indexer`, {
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
