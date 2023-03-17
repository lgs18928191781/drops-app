import { defineStore } from 'pinia'

interface ImagePreviewState {
  visibale: boolean
  images: string[]
  index: number
}

export const useImagePreview = defineStore('imagePreview', {
  state: () =>
    <ImagePreviewState>{
      visibale: false,
      images: [],
      index: 0,
    },
  getters: {},
  actions: {},
})
