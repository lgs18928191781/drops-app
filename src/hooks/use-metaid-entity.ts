
import { useConnectionStore,ConnectChain } from '@/stores/connection'
import  {type CreateOptions,IBtcEntity,MvcTransaction,loadMvc,loadBtc } from '@metaid/metaid'
import { BufferEncoding,followSchema,payCommentSchema,simpleRepostSchema,mintNftItemSchema,mintNftItemDescSchema,mintNftDescSchema,customizeSchema,type CustomSchemaParams} from '@/data/constants'
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

export type NftItem={
    nftName:string
    content:string //metafile://[PINID]
    intro:string 
}

export type NftCollection={
    name:string
    totalSupply:number
    royaltyRate:number
    desc:string
    cover:string
    website:string
    metadata:Object
}

export type NftItemDesc={
    pinid:string
    name:string
    desc:string
    cover:string
    metadata:Object

}

export interface InscribeResultForYesBroadcast {
    commitTxId: string
    revealTxIds: string[]
    commitCost: string
    revealCost: string
    status?: string
  }

  export interface InscribeResultForNoBroadcast {
    commitTxHex: string;
    revealTxsHex: string[];
    commitCost: string;
    revealCost: string;
    status?: string;
}

export type InscribeResultForIfBroadcasting<T>=T extends `yes` ? InscribeResultForNoBroadcast : InscribeResultForYesBroadcast

export type noBroadcast='yes' | 'no'

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
       
            if(currentChain.value ==ConnectChain.btc ){
                
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
                let transactions=[]
                if(isEmpty(body.attachments)){
                    const {attachMetafileUri,fileTransactions}= await MvcFileEntity(body.attachments)
                    finalBody.attachments=attachMetafileUri
                    transactions=fileTransactions
                    
                }
                const { txid } = await buzzEntity.create({
                    data: { body: JSON.stringify(finalBody) },
                    options: {
                    network: networkStore.network ,
                      signMessage: 'create buzz',
                      serialAction: 'finish',
                      transactions:transactions
                    },
                  })
                  
                  return {
                    txid
                  }
            }
        
    }


   async function BtcFileEntity(images:AttachmentItem[],noBroadcast:noBroadcast='no'):Promise<InscribeResultForIfBroadcasting<noBroadcast>> {
    const connectStore = useConnectionStore()
        const fileOptions=[]
        debugger
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
                noBroadcast: noBroadcast,
                feeRate: feebStore.last.currentFeeb.feeRate,
                service: {
                    address:import.meta.env.VITE_BTC_SERVICE_ADDRESS,
                    satoshis: import.meta.env.VITE_BTC_SERVICE_FEEB,
                  },
            }
           
        })
        return imageRes
   }

   async function MvcFileEntity(images:AttachmentItem[]):Promise<{
    fileTransactions:any[]
    attachMetafileUri:string[]
   }> {
    const connectStore = useConnectionStore()
    const networkStore=useNetworkStore()
    
    let fileTransactions: MvcTransaction[] = []

   
    
    const fileEntity=await connectStore.last.use('file')
     const attachMetafileUri = []
        for(const image of images){  
            const {transactions: txs }=await fileEntity.create({
            data:{
            body: Buffer.from(image.data, 'hex'),
            contentType: `${image.fileType};binary`,
            encoding: BufferEncoding.base64,
            flag:import.meta.env.VITE_BTC_METAID_FLAG,
            },
            options:{
            //dataType: image.fileType,
            signMessage: 'upload image file',
            serialAction:'combo', //'combo',
            transactions: fileTransactions,
            network:networkStore.network
            }
            })
            
            attachMetafileUri.push('metafile://' + txs[txs.length - 1].txComposer.getTxId() + 'i0')
            fileTransactions = txs
            }
       
            
        return {
            fileTransactions,
            attachMetafileUri
        }
   
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
        if(currentChain.value == ConnectChain.mvc){
            followEntity=await loadMvc(followSchema,{
                connector:connectStore.last
            })
            const followRes=await followEntity.create({
                data:{
                    body:params.body.followMetaId,
                    contentType: 'text/plain;utf-8',
                },
                options:{
                    noBroadcast:'no',
                    network:networkStore.network,
                    signMessage: 'follow user'
                }
            })
            if(followRes?.txid){
                const followStore=useFollowStore()
                 await followStore.add({
                    followedMetaId:params.body.followMetaId,
                    txId:followRes.txid
                })
        }
          
        }else{
            followEntity=await loadBtc(followSchema,{
                connector:connectStore.last
            })

            const followRes=await followEntity.create({
                dataArray:[
                   {
                    body:params.body.followMetaId,
                    flag:import.meta.env.VITE_BTC_METAID_FLAG
                   }
                ],
                options:{
                    noBroadcast:'no',
                    feeRate: feebStore.last.currentFeeb.feeRate,
                    service: {
                        address:import.meta.env.VITE_BTC_SERVICE_ADDRESS,
                        satoshis:import.meta.env.VITE_BTC_SERVICE_FEEB,
                    }
                }
            })
        if(isEmpty(followRes.revealTxIds)){
            const followStore=useFollowStore()
             await followStore.add({
                followedMetaId:params.body.followMetaId,
                txId:followRes.revealTxIds[0]
            })
        }
        }



   
   
   }catch (error) {
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

    const connectStore = useConnectionStore()
    const networkStore=useNetworkStore()
    try {
        let payCommentEntity
        if(currentChain.value == ConnectChain.mvc){
            payCommentEntity=await loadMvc(payCommentSchema,{
                connector:connectStore.last
            })
            const payCommentRes=await payCommentEntity.create({
                data:{
                    body:JSON.stringify(params.body),
                    contentType: 'text/plain;utf-8',
                },
                options:{
                    noBroadcast:'no',
                    network:networkStore.network,
                    signMessage: 'comment buzz'
                }
            })
            if(payCommentRes?.txid){
                return {
                    txid:payCommentRes.txid
                }
            }
        }else{
            
            payCommentEntity=await loadBtc(payCommentSchema,{
                connector:connectStore.last
            })
            const payCommentRes=await payCommentEntity.create({
                dataArray:[
                   {
                    body:JSON.stringify(params.body),
                    flag:import.meta.env.VITE_BTC_METAID_FLAG
                   }
                ],
                options:{
                    noBroadcast:'no',
                    feeRate: feebStore.last.currentFeeb.feeRate,
                    service: {
                        address:import.meta.env.VITE_BTC_SERVICE_ADDRESS,
                        satoshis:import.meta.env.VITE_BTC_SERVICE_FEEB,
                    }
                }
            })
        if(isEmpty(payCommentRes.revealTxIds)){
            return payCommentRes
        }
        }
   }catch (error) {
    throw new Error(error as any)
    
   }
}

   async function simpleRepostEntity(params:{body:{
    content:string //带评论转发，不带评论可空
    quotePin:string//要转发的buzz pinid
    attachments:AttachmentItem[] | [] //评论带附件转发
    //rePostProtocol:string //转发的协议类型，例如：simplebuzz  
   }}) {
    const connectStore = useConnectionStore()
    const networkStore = useNetworkStore()
    const finalBody: any = {
        content: params.body.content,
        quotePin:params.body.quotePin,
        contentType: 'text/plain',
      }
      let transactions=[]
    try {
        let repostEntity
        if(currentChain.value == ConnectChain.mvc){
            repostEntity=await loadMvc(simpleRepostSchema,{
                connector:connectStore.last
            })

            if(isEmpty(params.body.attachments)){
             
                const {attachMetafileUri,fileTransactions}= await MvcFileEntity(params.body.attachments)
                    
                finalBody.attachments=attachMetafileUri
                transactions=fileTransactions
            }

            const repostRes=await repostEntity.create({
                data:{
                    body:JSON.stringify(finalBody),
                    contentType: 'text/plain;utf-8',
                },
                options:{
                    noBroadcast:'no',
                    network:networkStore.network,
                    signMessage: 'repost buzz',
                    transactions:transactions
                }
            })
            
            if(repostRes?.txid){
                return {
                    txid:repostRes.txid
                }
            }
        }else{
            if(isEmpty(params.body.attachments)){
                const imageRes= await BtcFileEntity(params.body.attachments)
                
                finalBody.attachments=imageRes.revealTxIds.map(rid=>{
                    return `metafile://${rid}i0`
                })
            }
            repostEntity=await loadBtc(simpleRepostSchema,{
                connector:connectStore.last
            })
            const repostRes=await repostEntity.create({
                dataArray:[
                   {
                    body:JSON.stringify(finalBody),
                    flag:import.meta.env.VITE_BTC_METAID_FLAG
                   }
                ],
                options:{
                    noBroadcast:'no',
                    feeRate: feebStore.last.currentFeeb.feeRate,
                    service: {
                        address:import.meta.env.VITE_BTC_SERVICE_ADDRESS,
                        satoshis:import.meta.env.VITE_BTC_SERVICE_FEEB,
                    }
                }
            })
        if(isEmpty(repostRes.revealTxIds)){
            return repostRes
        }

        }
   }catch (error) {
    throw new Error(error as any)

   }
    
   }



   async function mintNftEntity(params:{body:NftCollection,attachments:AttachmentItem[] | [],noBroadcast:boolean}) {
    const connectStore = useConnectionStore()
    const networkStore=useNetworkStore()
    
    try {
       
        let nftCollecitonDescEntity
      
        const finalBody: NftCollection = {
            ...params.body
          }
   
                    if(isEmpty(params.attachments)){
                        const imageRes= await BtcFileEntity(params.attachments,'no')//params.noBroadcast ? 'no' : 'yes'
                        finalBody.cover=`metafile://${imageRes.revealTxIds[0]}i0`  
                    }
                    nftCollecitonDescEntity=await loadBtc(mintNftDescSchema(finalBody.name),{
                        connector:connectStore.last
                    })
                    const createCollectionDescRes=await nftCollecitonDescEntity.create({
                        dataArray:[
                           {
                            body:JSON.stringify(finalBody),
                            flag:import.meta.env.VITE_BTC_METAID_FLAG
                           }
                        ],
                        options:{
                            noBroadcast:'no',//params.noBroadcast ? 'no' : 'yes',
                            feeRate: feebStore.last.currentFeeb.feeRate,
                            service: {
                                address:import.meta.env.VITE_BTC_SERVICE_ADDRESS,
                                satoshis:import.meta.env.VITE_BTC_SERVICE_FEEB,
                            }
                        }
                    })
                     if(isEmpty(createCollectionDescRes.revealTxIds)){
                        return createCollectionDescRes
                    }

   }catch (error) {
    throw new Error(error as any)
}
   }


   


   async function mintNftItemEntity(params:{collectionName:string,body:NftItemDesc[],attachments:AttachmentItem[] | [],noBroadcast:boolean}) {
    const connectStore = useConnectionStore()
    const {body,attachments,collectionName}=params
    const finalBody: NftItemDesc[] = [...params.body]
    try {


        const nftItemEntity=await loadBtc(mintNftItemSchema(collectionName),{
            connector:connectStore.last
        })

        const nftItemDescEntity=await loadBtc(mintNftItemDescSchema(collectionName),{
            connector:connectStore.last
        })
        const imageRes= await BtcFileEntity(attachments,'no')//params.noBroadcast ? 'no' : 'yes'
    
        for(let i=0;i<body.length;i++){
       
           
            finalBody[i].cover=`metafile://${imageRes.revealTxIds[i]}i0`  
            const createItemRes=await nftItemEntity.create({
                dataArray:[
                   {
                    body:`${imageRes.revealTxIds[i]}i0`,
                    flag:import.meta.env.VITE_BTC_METAID_FLAG
                   }
                ],
                options:{
                    noBroadcast:'no',//params.noBroadcast ? 'no' : 'yes',
                    feeRate: feebStore.last.currentFeeb.feeRate,
                    service: {
                        address:import.meta.env.VITE_BTC_SERVICE_ADDRESS,
                        satoshis:import.meta.env.VITE_BTC_SERVICE_FEEB,
                    }
                }
            })
           
            if(isEmpty(createItemRes.revealTxIds)){
                finalBody[i].pinid=`${createItemRes.revealTxIds[0]}i0`
            }

        }

        const createItemDescRes=await nftItemDescEntity.create({
            dataArray:[
               {
                body:JSON.stringify({
                    items:finalBody
                }),
                flag:import.meta.env.VITE_BTC_METAID_FLAG
               }
            ],
            options:{
                noBroadcast:'no',//params.noBroadcast ? 'no' : 'yes',
                feeRate: feebStore.last.currentFeeb.feeRate,
                service: {
                    address:import.meta.env.VITE_BTC_SERVICE_ADDRESS,
                    satoshis:import.meta.env.VITE_BTC_SERVICE_FEEB,
                }
            }
        })
       
        if(isEmpty(createItemDescRes.revealTxIds)){
           return createItemDescRes
        }


    } catch (error) {
        console.log(error)
        debugger
    }
   }

  


   async function customizeEntity(params:CustomSchemaParams) {
    const connectStore = useConnectionStore()
    const networkStore = useNetworkStore()
    const finalBody: any = {
        ...params.body,
        contentType: 'text/plain',
      }
    try {
        let repostEntity
        if(currentChain.value == ConnectChain.mvc){
            repostEntity=await loadMvc(customizeSchema(params),{
                connector:connectStore.last
            })

            // if(isEmpty(params.body.attachments)){
            //     const attachMetafileUri= await MvcFileEntity(params.body.attachments)
                    
            //     finalBody.attachments=attachMetafileUri
             

            // }

            const repostRes=await repostEntity.create({
                data:{
                    body:JSON.stringify(finalBody),
                    contentType: 'text/plain;utf-8',
                },
                options:{
                    noBroadcast:'no',
                    network:networkStore.network,
                    signMessage: 'repost buzz'
                }
            })
            
            if(repostRes?.txid){
                return {
                    txid:repostRes.txid
                }
            }
        }else{
            if(isEmpty(params.body.attachments)){
                const imageRes= await BtcFileEntity(params.body.attachments)
                finalBody.attachments=imageRes.revealTxIds.map(rid=>{
                    return `metafile://${rid}i0`
                })
            }
            repostEntity=await loadBtc(simpleRepostSchema,{
                connector:connectStore.last
            })
            const repostRes=await repostEntity.create({
                dataArray:[
                   {
                    body:JSON.stringify(finalBody),
                    flag:import.meta.env.VITE_BTC_METAID_FLAG
                   }
                ],
                options:{
                    noBroadcast:'no',
                    feeRate: feebStore.last.currentFeeb.feeRate,
                    service: {
                        address:import.meta.env.VITE_BTC_SERVICE_ADDRESS,
                        satoshis:import.meta.env.VITE_BTC_SERVICE_FEEB,
                    }
                }
            })
        if(isEmpty(repostRes.revealTxIds)){
            return repostRes
        }

        }
   }catch (error) {
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
    simpleRepostEntity,
    mintNftEntity,
    mintNftItemEntity
   }

}