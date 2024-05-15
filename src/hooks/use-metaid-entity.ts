
import { useConnectionStore } from '@/stores/connection'
import  {type CreateOptions} from '@metaid/metaid'
import {type BufferEncoding} from '@/data/constants'
import { AttachmentItem } from '@/@types/hd-wallet'
export type EntityOptions={
    options:CreateOptions[]
    noBroadcast:'yes' | 'no'
    feeRate?:number
}





export function useMetaIDEntity(){

    async function buzzEntity() {
        
    }




   async function fileEntity(images:AttachmentItem[]):Promise<{
    commitTxId: string;
    revealTxIds: string[];
    commitCost: string;
    revealCost: string;
    status?: string;
   }> {
        const fileOptions=[]
        for(const image of images){
            fileOptions.push({
                body:Buffer.from(image.data, "hex").toString("base64"),
                encoding: 'base64' as BufferEncoding ,
                contentType:image.fileType,
                toEncodeing:fileSchema.encoding
            })
        }
        const connectStore = useConnectionStore()
        const fileEntity=await connectStore.last.use('file')
        const imageRes=await fileEntity.create({
            options: fileOptions,
		    noBroadcast: "no",
        })

        return imageRes

   }

   return{
    createEntity
   }


}