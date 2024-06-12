
import { useConnectionStore,ConnectChain } from '@/stores/connection'
import  {type CreateOptions,IBtcEntity,MvcTransaction,loadMvc,loadBtc } from '@metaid/metaid'
import { BufferEncoding,followSchema} from '@/data/constants'
import { AttachmentItem } from '@/@types/hd-wallet'
import { useI18n } from 'vue-i18n'
import {useFollowStore} from '@/stores/follow'
import {useFeebStore} from '@/stores/feeb'
import {FollowInfo} from '@/api/follow'
import { useNetworkStore } from '@/stores/network'
import {computed} from 'vue'
export type EntityOptions={
    noBroadcast:'yes' | 'no'
    feeRate?:number
}

export interface InscribeResultForYesBroadcast {
    commitTxId: string
    revealTxIds: string[]
    commitCost: string
    revealCost: string
    status?: string
  }

function isEmpty(attachments:AttachmentItem[] | string[]){
    return Array.isArray(attachments) && attachments.length 
}




export function useMetaIDEntity(){
    const i18n = useI18n()
    const feebStore=useFeebStore()
    const connectStore=useConnectionStore()

    const currentChain=computed(()=>{
        return connectStore.currentChain
    })


    async function buzzEntity(body:{content:string,attachments:AttachmentItem[] | []}) {
        const connectStore = useConnectionStore()
        const networkStore=useNetworkStore()
        const buzzEntity =await connectStore.last.use('buzz')
        const finalBody: any = {
            content: body.content,
            contentType: 'text/plain',
          }
       
          debugger
          
            debugger
            if(currentChain.value ==ConnectChain.btc ){
                debugger
                if(isEmpty(body.attachments)){
                    const imageRes= await BtcFileEntity(body.attachments)
                    finalBody.attachments=imageRes.revealTxIds.map(rid=>{
                        return `metafile://${rid}i0`
                    })
                }
               
               const createRes =(await buzzEntity).create({
                dataArray: [{ body: JSON.stringify(finalBody),contentType: 'text/plain', flag: import.meta.env.VITE_BTC_METAID_FLAG}],
                options:{
                noBroadcast:'no',
                feeRate: feebStore.last.currentFeeb.feeRate,
                service: {
                    address: import.meta.env.VITE_BTC_SERVICE_ADDRESS,
                    satoshis: import.meta.env.VITE_BTC_SERVICE_FEEB,
                }
                }
                })
                return createRes
            }else{
                debugger
                if(isEmpty(body.attachments)){
                    const attachMetafileUri= await MvcFileEntity(body.attachments)
                    finalBody.attachments=attachMetafileUri
                }
                
                debugger
                const { txid } = await buzzEntity.create({
                    data: { body: JSON.stringify(body), contentType: 'application/json;utf-8', flag: import.meta.env.VITE_BTC_METAID_FLAG },
                    options: {
                    network: networkStore.network ,
                      signMessage: 'create buzz',
                      serialAction: 'finish',
                    },
                  })
                  debugger
                  return {
                    txid
                  }
            }
        
    }








   async function BtcFileEntity(images:AttachmentItem[]):Promise<InscribeResultForYesBroadcast> {
    const connectStore = useConnectionStore()
        const fileOptions=[]
        for(const image of images){  
            fileOptions.push({
                body:Buffer.from(image.data, "hex").toString("base64"),
                encoding: BufferEncoding.base64,
                contentType:`${image.fileType};binary`,
                flag:import.meta.env.VITE_BTC_METAID_FLAG,
            })
        }
        const fileEntity=await connectStore.last.use('file')
        const imageRes=await fileEntity.create({
            dataArray:fileOptions,
            options:{
                noBroadcast: 'no',
                feeRate: feebStore.last.currentFeeb.feeRate,
                service: {
                    address:import.meta.env.VITE_BTC_SERVICE_ADDRESS,
                    satoshis: import.meta.env.VITE_BTC_SERVICE_FEEB,
                  },
            }
           
        })
        return imageRes
   }

   async function MvcFileEntity(images:AttachmentItem[]):Promise<string[]> {
    const connectStore = useConnectionStore()
    const networkStore=useNetworkStore()
    debugger
    let fileTransactions: MvcTransaction[] = []
 
    const fileEntity=await connectStore.last.use('file')
     const attachMetafileUri = []
        for(const image of images){  
            const {transactions: txs }=await fileEntity.create({
            data:{
            body: Buffer.from(image.data, 'hex').toString('base64'),
            contentType: `${image.fileType};binary`,
            encoding: BufferEncoding.base64,
            flag:import.meta.env.VITE_BTC_METAID_FLAG,
            },
            options:{
            dataType: image.fileType,
            signMessage: 'upload image file',
            serialAction: 'combo',
            transactions: fileTransactions,
            network:networkStore.network
            }
            })
            attachMetafileUri.push('metafile://' + txs[txs.length - 1].txComposer.getTxId() + 'i0')
            fileTransactions = txs
            }
       
            
        return attachMetafileUri
   
        }
   async function likeEntity(body:{likeTo:string}):Promise<InscribeResultForYesBroadcast & {txid:string}> {
    const connectStore = useConnectionStore()
    const networkStore=useNetworkStore()
    let likeRes
    const likeEntity =await connectStore.last.use('like')
   
    if(connectStore.currentChain == ConnectChain.btc){
        const finalBody={
            likeTo:body.likeTo,
            isLike:'1'
        }
         likeRes = await likeEntity.create({
            dataArray: [{ body: JSON.stringify(finalBody),flag:import.meta.env.VITE_BTC_METAID_FLAG }],
            options:{
                noBroadcast:'no',
                feeRate: feebStore.last.currentFeeb.feeRate,
                service: {
                    address:import.meta.env.VITE_BTC_SERVICE_ADDRESS,
                    satoshis:import.meta.env.VITE_BTC_SERVICE_FEEB,
                }
            }
            
        })
    }else{
        likeRes = await likeEntity.create({
           
            data:{
                body:body.likeTo,
                contentType: 'text/plain;utf-8'
            },
            options:{
                noBroadcast:'no',
                network:networkStore.network
            }
            
        })
        
    }
  

    return likeRes
   }

   async function followEntity(params:{body:{followMetaId:string}}) {
    const connectStore = useConnectionStore()
    const networkStore=useNetworkStore()
    try {
        let followEntity
        if(currentChain.value == ConnectChain.btc){
            followEntity=await loadBtc(followSchema,{
                connector:connectStore.last
            })
            const followRes=await followEntity.create({
                data:{
                    body:params.body.followMetaId,
                    contentType: 'text/plain;utf-8',
                },
                options:{
                    noBroadcast:'no',
                    network:networkStore.network
                }
            })
            if(isEmpty(followRes.revealTxIds)){
            
                const followStore=useFollowStore()
               
                 await followStore.add({
                    followedMetaId:params.body.followMetaId,
                    txId:followRes.revealTxIds[0]
                })
               
    
            }
        }else{
            debugger
            followEntity=await loadMvc(followSchema,{
                connector:connectStore.last
            })
        }

        

        debugger
      
        debugger
        // const followRes=await connectStore.last.inscribe(
        //     [
        //         {
        //         operation: 'create',
        //           path: '/follow',
        //           body: params.body.followMetaId,
        //           contentType: 'text/plain;utf-8',
        //           flag: import.meta.env.VITE_BTC_METAID_FLAG,
        //         }
        //     ],
        //     'no',
        //     feebStore.last.currentFeeb.feeRate,
        //     {
        //         address:import.meta.env.VITE_BTC_SERVICE_ADDRESS,
        //         satoshis:import.meta.env.VITE_BTC_SERVICE_FEEB,
        //     }
    
        // )
        if(currentChain.value ==ConnectChain.mvc){
            if(followRes?.txid){
            
                const followStore=useFollowStore()
               
                 await followStore.add({
                    followedMetaId:params.body.followMetaId,
                    txId:followRes.txid
                })
               
    
        }else{
           
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
    content:string //带评论转发，不带评论可空
    quoteTx:string//要转发的buzz pinid
    attachments?:AttachmentItem[] | [] //评论带附件转发
    //rePostProtocol:string //转发的协议类型，例如：simplebuzz  
   }}) {
    try {
        const connectStore = useConnectionStore()

        const finalBody: any = {
            content: params.body.content,
            contentType: 'text/plain',
          }
        if(isEmpty(params.body.attachments!)){
            const imageRes= await BtcFileEntity(params.body.attachments!)
            
            finalBody.attachments=imageRes.revealTxIds.map(rid=>{
                return `metafile://${rid}i0`
            })
        }

        const repostRes=await connectStore.last.inscribe([
        {
            operation: 'create',
              path: '/protocols/simplebuzz',
              body: JSON.stringify(finalBody),
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
    MvcFileEntity,
    BtcFileEntity,
    buzzEntity,
    likeEntity,
    getAllBuzz,
    followEntity,
    unFollowEntity,
    payCommentEntity,
    simpleRepostEntity
   }
}
