import axios from 'axios'
import Dexie, { Table } from 'dexie'
import { reject } from 'lodash'
import { metafile as tranformMetafile } from './filters'
export interface MetafileSchems {
  txId?: string
  data?: Blob
  thumbnail?: Blob
  normal?: Blob
}
export class DBClass extends Dexie {
  metafiles!: Table<MetafileSchems>
  constructor() {
    super('nos.art')
    this.version(2).stores({
      metafiles: 'txId, data, thumbnail, normal', // Primary key and indexed props
    })
  }

  getMetaFileTxId(metafile: string) {
    const _txId = metafile.replace('metafile://', '')
    const _txIdArray = _txId.split('.')
    const txId = _txIdArray[0]
    return txId
  }

  getMetaFileData(metafile: string, width = 235) {
    return new Promise<{
      txId: string
      data: Blob
    }>(async resolve => {
      try {
        const txId = this.getMetaFileTxId(metafile)
        const fileUrl =
          width !== -1
            ? tranformMetafile(metafile, width)
            : `${import.meta.env.VITE_SHOWMANURL}/metafile/${txId}`
        const result = await axios.get(fileUrl, { responseType: 'blob' })
        if (result.status === 200) {
          resolve({
            txId,
            data: result.data,
          })
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  addMetaFileData(metafile: string, width: number) {
    return new Promise<string>(async resolve => {
      const result = await this.getMetaFileData(metafile, width).catch(() => {
        resolve('')
      })
      if (result) {
        const params: MetafileSchems = {
          txId: result.txId,
        }
        if (width === 235) {
          params.thumbnail = result.data
        } else if (width === -1) {
          params.data = result.data
        } else if (width === 750) {
          params.normal = result.data
        }
        this.metafiles.add(params)
        resolve(URL.createObjectURL(result.data))
      }
    })
  }

  getMetaFile(metafileTxId: string, width = 235) {
    return new Promise<string>(async resolve => {
      if (!metafileTxId) {
        resolve('')
      } else if (
        metafileTxId.indexOf('https://') !== -1 ||
        metafileTxId.indexOf('http://') !== -1
      ) {
        resolve(metafileTxId)
      } else {
        const txId = this.getMetaFileTxId(metafileTxId)
        const file = await this.metafiles.get(txId)
        if (file) {
          // 存在数据库

          // 原图
          if (width === -1) {
            // 存在原图
            if (file.data) {
              resolve(URL.createObjectURL(file.data))
            } else {
              // 不存在原图， 则存原图且先去获取图片
              const res = await this.updateMetaFileData(txId, width)
              if (res) {
                resolve(res)
              } else {
                resolve(tranformMetafile(metafileTxId, width))
              }
            }
          } else if (width === 235) {
            // 缩略图
            if (file.thumbnail) {
              // 存在缩略图
              resolve(URL.createObjectURL(file.thumbnail))
            } else {
              // 不存在略索取， 则存缩略图且获取图片
              const res = await this.updateMetaFileData(txId, width)
              if (res) {
                resolve(res)
              } else {
                resolve(tranformMetafile(metafileTxId, width))
              }
            }
          } else {
            // 存在正常图
            if (file.normal) {
              resolve(URL.createObjectURL(file.normal))
            } else {
              // 不存在正常图， 则存正常图且先去获取图片
              const res = await this.updateMetaFileData(txId, width)
              if (res) {
                resolve(res)
              } else {
                resolve(tranformMetafile(metafileTxId, width))
              }
            }
          }
        } else {
          // 不存在数据库
          const res = await this.addMetaFileData(txId, width)
          resolve(res)
        }
      }
    })
  }

  updateMetaFileData(metafile: string, width = 235) {
    return new Promise<string>(async resolve => {
      const result = await this.getMetaFileData(metafile, width)
      const params: MetafileSchems = {
        txId: result.txId,
      }
      if (width === 235) {
        params.thumbnail = result.data
      } else if (width === -1) {
        params.data = result.data
      } else if (width === 750) {
        params.normal = result.data
      }
      this.metafiles.update(result.txId, params)
      resolve(URL.createObjectURL(result.data))
    })
  }
}

export const DB = new DBClass()
