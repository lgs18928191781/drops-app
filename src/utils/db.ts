import axios from 'axios'
import Dexie, { Table } from 'dexie'
import { reject } from 'lodash'
import { metafile, metafile as tranformMetafile } from './filters'
import {type MyFollow} from '@/stores/follow'
export interface MetafileSchems {
  txId?: string
  data?: Blob
  thumbnail?: Blob
  normal?: Blob
  latestTime?: number
}

export class DBClass extends Dexie {
  metafiles!: Table<MetafileSchems>
  genesis!: Table<Mrc20CollectionItem>
  follow!:Table<{
    userMetaId:string, //关注者
    followedMetaId:string //被关注者
    txId:string
  }>
  constructor() {
    super('show3')
    this.version(3).stores({
      metafiles: 'txId', // Primary key and indexed props
      genesis: 'collectionPinId, metaId', // Primary key and indexed props
      follow:'followedMetaId,userMetaId' //Primary key and indexed props
    })
    this.maintenanceData()
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
            : `${import.meta.env.VITE_AppImgApi}/content/${txId}`
            
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

  getMetaFile(metafileTxId: string, width = 235, type: 'metafile' | 'metaId' = 'metafile') {
    return new Promise<string>(async resolve => {
        
      if (!metafileTxId) {
        resolve('')
      } else if (
        metafileTxId.indexOf('https://') !== -1 ||
        metafileTxId.indexOf('http://') !== -1
      ) {
        // http 地址直接返回
        resolve(metafileTxId)
      } else if (type === 'metaId') {
        // metaId 不存本地数据库
        resolve(metafile(metafileTxId, width, type))
      } else {
        // 普通txId
        const txId = this.getMetaFileTxId(metafileTxId)
        const file = await this.metafiles.get(txId)
        if (file) {
          this.metafiles.update(txId, { latestTime: new Date().getTime() })
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

  //  维护数据， 删除太久没用的数据
  maintenanceData() {
    setTimeout(async () => {
      const expireTime = 1000 * 60 * 60 * 24 * 30 // 一个月
      const now = new Date().getTime()
      const list = await this.metafiles
        // @ts-ignore
        .filter(item => item.latestTime && now - item.latestTime >= expireTime)
        .delete()
    }, 4000)
  }
}

export const DB = new DBClass()
