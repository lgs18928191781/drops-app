import { ComponentCustomProperties } from 'vue'
declare module '@vue/runtime-core' {
    export interface ComponentCustomProperties {
      $filters: {
        avatar: (showId: string) => string
      }
    }
}