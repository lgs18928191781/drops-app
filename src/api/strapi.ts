/*
 * @Author: your name
 * @Date: 2022-07-19 17:09:30
 * @LastEditTime: 2022-07-19 19:17:52
 * @LastEditors: XTZJ-2020JWVBKJ
 * @Description: In User Settings Edit
 * @FilePath: \nos.art\src\api\strapi.ts
 */
import HttpRequest from 'request-sdk'

// @ts-ignore
const Strapi = new HttpRequest(import.meta.env.VITE_AdminBaseApi).request

// 查询我的盲盒分类
export const GetBlindboxClassify = (params: {
  [key: string]: number | string
}): Promise<GetBlindboxClassifyItem[]> => {
  return Strapi.get('/blind-boxes', { params })
}

export const GetProdTestMetaIds = (params: {
  [key: string]: any
}): Promise<GetProdTestMetaIdsItem[]> => {
  return Strapi.get('/ruoxi-dev-meta-ids', { params })
}

export const GetBalanceUser = (params: {
  [key: string]: any
}): Promise<GetProdTestMetaIdsItem[]> => {
  return Strapi.get('/ruoxi-balance-pay-users', { params })
}

export const GetBanners = (): Promise<Banners[]> => {
  return Strapi.get('/ruoxi-banners?_sort=index')
}

export const GetCollects = (params: {
  _sort: string
  _limit: number
  _start: number
}): Promise<HomeCollect[]> => {
  return Strapi.get('/ruoxi-v-2-home-collects', { params })
}

export const GetClassifyCollects = (params: { [key: string]: any }): Promise<Collect[]> => {
  return Strapi.get('/ruoxi-collects', { params })
}

export const GetClassifyCollectCount = (params: { [key: string]: any }): Promise<number> => {
  return Strapi.get('/ruoxi-collects/count', { params })
}

export const GetClassifies = (params: {
  [key: string]: string | number
}): Promise<MarketClassify[]> => {
  return Strapi.get('/ruoxi-classifies', { params })
}

export const GetActivitys = (params: {
  _sort: string
  _limit: number
  _start: number
}): Promise<HomeActivityItem[]> => {
  return Strapi.get('/ruoxi-v-2-home-activities', { params })
}

export const GetActivityCount = (): Promise<number> => {
  return Strapi.get('/ruoxi-v-2-home-activities/count')
}

export const GetCollectCount = (): Promise<number> => {
  return Strapi.get('/ruoxi-v-2-home-collects/count')
}

export const GetHomeRecomment = (params: {
  _sort: string
  _limit: number
  _start: number
}): Promise<GetHomeRecommentData[]> => {
  return Strapi.get('/ruoxi-home-recomments', { params })
}

export const GetAnnounces = (params: {
  _sort: string
  _limit: number
  _start: number
}): Promise<AnnounceItem[]> => {
  return Strapi.get('/ruoxi-announces', { params })
}

export const GetTemporaryUser = (params?: {
  [key: string]: string
}): Promise<{ metaId: string }[]> => {
  return Strapi.get('/temporary-meta-ids', { params })
}

export const GetMetaEggTask = (params?: { [key: string]: any }): Promise<MetaEggTaskItem[]> => {
  return Strapi.get('/meta-egg-tasks', { params })
}
