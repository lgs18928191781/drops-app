
import { useConnectionStore } from '@/stores/connection'
import  {type CreateOptions,IBtcEntity} from '@metaid/metaid'
import { BufferEncoding} from '@/data/constants'
import { AttachmentItem } from '@/@types/hd-wallet'
import { useI18n } from 'vue-i18n'
import {useFollowStore} from '@/stores/follow'
import {useFeebStore} from '@/stores/feeb'
import {FollowInfo} from '@/api/follow'
export type EntityOptions={
    noBroadcast:'yes' | 'no'
    feeRate?:number
}

function isEmpty(attachments:AttachmentItem[] | string[]){
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
       
        const buzzEntity =await connectStore.last.use('buzz')
        
      
        // const finalBody:any = body.content
        const finalBody: any = {
            content: body.content,
            contentType: 'text/plain',
          }
        if(isEmpty(body.attachments)){
            const imageRes= await fileEntity(body.attachments)
            debugger
            finalBody.attachments=imageRes.revealTxIds.map(rid=>{
                return `metafile://${rid}i0`
            })
        }

        debugger
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
        console.log("imageRes",imageRes)
        debugger
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

   async function followEntity(params:{body:{followMetaId:string}}) {
    const connectStore = useConnectionStore()
    try {
        const followRes=await connectStore.last.inscribe(
            [
                {
                operation: 'create',
                  path: '/follow',
                  body: params.body.followMetaId,
                  contentType: 'text/plain;utf-8',
                  flag: import.meta.env.VITE_BTC_METAID_FLAG,
                }
            ],
            'no',
            feebStore.last.currentFeeb.feeRate,
            {
                address:import.meta.env.VITE_BTC_SERVICE_ADDRESS,
                satoshis:import.meta.env.VITE_BTC_SERVICE_FEEB,
            }
    
        )
        if(isEmpty(followRes.revealTxIds)){
            
            const followStore=useFollowStore()
           
             await followStore.add({
                followedMetaId:params.body.followMetaId,
                txId:followRes.revealTxIds[0]
            })
           

        }
       
    } catch (error) {
        throw new Error(error as any)
    }
   
   }

   async function unFollowEntity(followMetaid:string){
    const connectStore = useConnectionStore()
    try {
        const {data:{followPinId}}= await FollowInfo({
            metaId:followMetaid,
            followerMetaId:connectStore.last.metaid
        })
        const unFollowRes=await connectStore.last.inscribe([
            {
                operation: 'revoke',
                path: `@${followPinId}`,
                contentType: 'text/plain;utf-8',
                flag: import.meta.env.VITE_BTC_METAID_FLAG,
            }
        ],
        'no',
        feebStore.last.currentFeeb.feeRate,
        {
            address:import.meta.env.VITE_BTC_SERVICE_ADDRESS,
            satoshis:import.meta.env.VITE_BTC_SERVICE_FEEB,
        }
        
    )
    if(isEmpty(unFollowRes.revealTxIds)){
        const followStore=useFollowStore()
        await followStore.revoke(followMetaid)
    }
     
    } catch (error) {
        throw new Error(error as any)
    }
   }

   async function payCommentEntity(params:{body:{
    content:string //评论内容
    commentTo:string //要评论的buzz pinid
    replyTo:string //对某条评论进行回复的pinid,一级评论则留空  
    pay:string  //暂时留空    
    payTo:string //暂时留空
   }}) {

    try {
        const connectStore = useConnectionStore()
    const commentRes=await connectStore.last.inscribe([
        {
            operation: 'create',
              path: '/protocols/paycomment',
              body: JSON.stringify(params.body),
              contentType: 'text/plain;utf-8',
              flag: import.meta.env.VITE_BTC_METAID_FLAG,
            }
    ],
    'no',
    feebStore.last.currentFeeb.feeRate,
    {
        address:import.meta.env.VITE_BTC_SERVICE_ADDRESS,
        satoshis:import.meta.env.VITE_BTC_SERVICE_FEEB,
    })
    
    if(isEmpty(commentRes.revealTxIds)){
        return commentRes.revealTxIds[0]
    }
    } catch (error) {
        throw new Error(error as any)
    }
    
   }

   async function simpleRepostEntity(params:{body:{
    rePostComment:string //带评论转发，不带评论可空
    rePostTx:string //要转发的buzz pinid
    rePostProtocol:string //转发的协议类型，例如：simplebuzz  
   }}) {

    try {
        const connectStore = useConnectionStore()
    const repostRes=await connectStore.last.inscribe([
        {
            operation: 'create',
              path: '/protocols/simplerepost',
              body: JSON.stringify(params.body),
              contentType: 'text/plain;utf-8',
              flag: import.meta.env.VITE_BTC_METAID_FLAG,
            }
    ],
    'no',
    feebStore.last.currentFeeb.feeRate,
    {
        address:import.meta.env.VITE_BTC_SERVICE_ADDRESS,
        satoshis:import.meta.env.VITE_BTC_SERVICE_FEEB,
    })
    console.log("repostRes.revealTxIds",repostRes.revealTxIds)
        
    if(isEmpty(repostRes.revealTxIds)){

        return repostRes.revealTxIds[0]
    }
    } catch (error) {
        throw new Error(error as any)
    }
    
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
    followEntity,
    unFollowEntity,
    payCommentEntity,
    simpleRepostEntity
   }
}
