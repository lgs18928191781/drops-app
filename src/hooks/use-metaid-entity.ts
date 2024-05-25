
import { useConnectionStore } from '@/stores/connection'
import  {type CreateOptions,IBtcEntity} from '@metaid/metaid'
import { BufferEncoding,followSchema} from '@/data/constants'
import { AttachmentItem } from '@/@types/hd-wallet'
import { useI18n } from 'vue-i18n'

import {useFeebStore} from '@/stores/feeb'
export type EntityOptions={
    noBroadcast:'yes' | 'no'
    feeRate?:number
}

function isEmpty(attachments:AttachmentItem[]){
    return Array.isArray(attachments) && attachments.length
}




export function useMetaIDEntity(){
    const i18n = useI18n()
    const feebStore=useFeebStore()


    // if(!connectStore.connected){
    //     debugger
    //     //Metalet Wallet connection failed
    //     return ElMessage.error(`${i18n.t('Metalet.connect.fail')}`)
    // }


    async function buzzEntity(body:{content:string,attachments:AttachmentItem[] | []}) {
        const connectStore = useConnectionStore()
       
        const buzzEntity =connectStore.last.use('buzz')
        // const finalBody:any = body.content
        const finalBody: any = {
            content: body.content,
            contentType: 'text/plain',
          }
        if(isEmpty(body.attachments)){
            const imageRes= await fileEntity(body.attachments)
            finalBody.attachments=imageRes.revealTxIds.map(rid=>{
                return `metafile://${rid}i0`
            })
        }
        // return
        const createRes =(await buzzEntity).create({
            options: [{ body: JSON.stringify(finalBody),contentType: 'text/plain', flag: import.meta.env.VITE_BTC_METAID_FLAG}],
		    noBroadcast:'no',
            feeRate: feebStore.last.currentFeeb.feeRate,
            service: {
                address: import.meta.env.VITE_BTC_SERVICE_ADDRESS,
                satoshis: import.meta.env.VITE_BTC_SERVICE_FEEB,
            }
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
    const connectStore = useConnectionStore()
        const fileOptions=[]
        for(const image of images){  
            fileOptions.push({
                body:Buffer.from(image.data, "hex").toString("base64"),
                encoding: BufferEncoding.base64,
                contentType:image.fileType,
                // toEncodeing:fileSchema.encoding,
                flag:import.meta.env.VITE_BTC_METAID_FLAG,
            })
        }
        
        const fileEntity=await connectStore.last.use('file')
        const imageRes=await fileEntity.create({
            options: fileOptions,
		    noBroadcast: 'no',
            feeRate: feebStore.last.currentFeeb.feeRate,
            service: {
                address:import.meta.env.VITE_BTC_SERVICE_ADDRESS,
                satoshis: import.meta.env.VITE_BTC_SERVICE_FEEB,
              },
        })
        return imageRes

   }

   async function likeEntity(body:{likeTo:string}) {
    const connectStore = useConnectionStore()
    const likeEntity =await connectStore.last.use('like')
    const finalBody={
        likeTo:body.likeTo,
        isLike:'1'
    }
    const likeRes = await likeEntity.create({
        options: [{ body: JSON.stringify(finalBody),flag:import.meta.env.VITE_BTC_METAID_FLAG }],
        noBroadcast:'no',
        feeRate: feebStore.last.currentFeeb.feeRate,
        service: {
            address:import.meta.env.VITE_BTC_SERVICE_ADDRESS,
            satoshis:import.meta.env.VITE_BTC_SERVICE_FEEB,
        }
    })

    return likeRes
   }

   async function followEntity() {
    const connectStore = useConnectionStore()
    const iFollowEntity=new IBtcEntity('follow',followSchema)
    
    //const followEntity =await connectStore.last.use('follow')
    console.log("followEntity",iFollowEntity)
    debugger
   }


   async function getAllBuzz(body:{page:number,limit:number,network:string}){
        const connectStore = useConnectionStore()
        
        const buzzEntity =connectStore.last.use('buzz')
        const allBuzzRes = (await buzzEntity).list({page:body.page,limit:body.limit,network:body.network})
        return allBuzzRes
   }

   

   return{
    fileEntity,
    buzzEntity,
    likeEntity,
    getAllBuzz,
    followEntity
   }
}
