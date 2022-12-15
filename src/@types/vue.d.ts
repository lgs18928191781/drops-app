import { ComponentCustomProperties } from 'vue'
declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    $filters: {
      dateTimeFormat: (timestamp: Date | string | number, format?: string) => string
      metafile: (metafile: string, width = 235) => string
      bsv: (stas: string | number) => number
      buzzTextContent: (content: string) => string
    }
  }
}
