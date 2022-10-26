import { constants } from 'crypto'

const moduleCompoment: any = import.meta.globEager('./*.vue')

export const CompomentArray = []
export const moduleName: any = {}
Object.keys(moduleCompoment).forEach((file: string) => {
  moduleName[file.replace(/(\.\/|\.vue)/g, '')] = moduleCompoment[file].default

  // modules[file.replace()]
  // CompomentArray.push(modules)
})

for (let file in moduleName) {
  CompomentArray.push(file)
}
