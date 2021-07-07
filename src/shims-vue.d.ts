import { ComponentCustomProperties } from 'vue'
declare module '*.vue' {
  import { Component } from 'vue'
  const _default: Component
  export default _default
}

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $filters: {
      avatar: (showId: string) => string
    }
  }
}

declare const _APP_VERSION: string

