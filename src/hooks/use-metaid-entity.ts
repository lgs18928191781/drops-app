
import { useConnectionStore } from '@/stores/connection'
import  {type CreateOptions} from '@metaid/metaid'
import { BufferEncoding,fileSchema} from '@/data/constants'
import { AttachmentItem } from '@/@types/hd-wallet'


export type EntityOptions={
    noBroadcast:'yes' | 'no'
    feeRate?:number
}

function isEmpty(attachments:AttachmentItem[]){
    return Array.isArray(attachments) && attachments.length
}




export function useMetaIDEntity(){

    const connectStore = useConnectionStore()

    

    async function buzzEntity(body:{content:string,attachments:AttachmentItem[] | []}) {
        const buzzEntity =connectStore.last.use('buzz')
        const finalBody:any = body.content
        
        if(!isEmpty(body.attachments)){
            const imageRes= await fileEntity(body.attachments)
            finalBody.attachments=imageRes.revealTxIds.map(rid=>{
                return `metafile://${rid}i0`
            })
        }

        const createRes =(await buzzEntity).create({
            options: [{ body: JSON.stringify(finalBody) }],
		    noBroadcast:'no',
        })
        return createRes
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
                encoding: BufferEncoding.base64,
                contentType:image.fileType,
                toEncodeing:fileSchema.encoding
            })
        }
        
        const fileEntity=await connectStore.last.use('file')
        const imageRes=await fileEntity.create({
            options: fileOptions,
		    noBroadcast: 'no',
        })

        return imageRes

   }

   return{
    fileEntity,
    buzzEntity
   }


}