import {type EntityCreateOptions} from '@/data/constants'
import { useConnectionStore } from '@/stores/connection'

export type EntityOptions={
    options:CreateOptions[]
    noBroadcast:'yes' | 'no'
    feeRate?:number
}

export function useMetaIDEntity(){

   async function createEntity(actionName:string,entityOptions:EntityOptions){
        const connectStore = useConnectionStore()
        const _entity=await connectStore.last.use(actionName)
        return await _entity.create({...entityOptions})
   }

   return{
    createEntity
   }


}