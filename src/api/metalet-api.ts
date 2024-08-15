// import HttpRequest from '@/utils/request'

// const MetaletV3Request = new HttpRequest(`${import.meta.env.VITE_METALET_API}//wallet-api/v3`, {
//   header: {
//     SiteConfigMetanetId: import.meta.env.VITE_SiteConfigMetanetId,
//   },
//   responseHandel: response => {
//     return new Promise((resolve, reject) => {
//       if (response?.data && typeof response.data?.code === 'number') {
//         if (response.data.code === 0 || response.data.code === 601) {
//           resolve(response.data)
//         } else {
//           reject({
//             code: response.data.code,
//             message: response.data.data,
//           })
//         }
//       } else {
//         resolve(response.data)
//       }
//     })
//   },
// }).request

// const GetUtxoFromMetalet = () => {
//   return MetaletV3Request.get('')
// }
