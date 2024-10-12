import { mintNftItem,submitMintOrder,submitSaleOrder,submitBuyOrder,finalySignAndBuyNft,getRedeemOrder,submitRedeemOrder,getPinfromPinid,getPinfromPinidList,cancelBuyNft,cancelOrder,broadcastBTCTx} from '@/api/mrc721-api'
import { useBtcJsStore } from '@/stores/btcjs'
import { useI18n } from 'vue-i18n'
import { useNetworkStore } from '@/stores/network'
import {exclusiveChange,buildFillUtxoPsbt,extractTxAndOutputIndex,fillInputUtxo,fillInternalKey,getDummyUtxoforLegacy,checkDummyAmount} from '@/hooks/use-buildtx-entity'
import Decimal from 'decimal.js-light'
import { NftsLaunchPadChain, NftsLaunchPadChainSymbol,SIGHASH_ALL,SIGHASH_ALL_ANYONECANPAY,SIGHASH_SINGLE_ANYONECANPAY,SIGHASH_DEFAULT,REDEEM_SERVICE_FEE,DUMMY_UTXO_INPUT_LEGACY ,PIN_UTXO_VALUE} from '@/data/constants'
import {usePayModalEntity,type feeInfoType} from '@/hooks/use-pay-modal-entity'
import { CollectionMintChain,SdkPayType } from '@/enum'
import { useFeebStore } from '@/stores/feeb'
import {  type Psbt } from 'bitcoinjs-lib'
import { useConnectionStore } from '@/stores/connection'
import {ElMessage } from 'element-plus'


export function useNFTEntity(){
    const i18n = useI18n()
    const payModalEntity=usePayModalEntity()


    async function estimatePsbtFee(psbtHex:string,feeb:number,checkOnly:boolean=false){
        const bitcoinjs = useBtcJsStore().get!
        const networkStore=useNetworkStore()
        const feeStore = useFeebStore()

        try {
         if(!psbtHex){
         return ElMessage.error((`${i18n.t('Nfts.psbt_empty')}`))
         }
          const psbt =bitcoinjs.Psbt.fromHex(psbtHex,{ network: networkStore.typedNetwork })
         
          const estiomateResult= await exclusiveChange({
            psbt: psbt,
            maxUtxosCount:3,
            sighashType:SIGHASH_ALL_ANYONECANPAY,
            feeb:feeb ?? feeStore.getCurrentFeeb,
         })
      
       
         if(checkOnly){
          const {paymentValue,fee,changeValue}=estiomateResult
          const mintPrice=new Decimal(paymentValue!).sub(changeValue).sub(fee).sub(import.meta.env.VITE_MINT_NFT_SERVICE_FEE).toNumber()
          const feeInfo={
            basic:mintPrice,
            service:import.meta.env.VITE_MINT_NFT_SERVICE_FEE,
            miner:estiomateResult!.fee,
            feeb:estiomateResult!.feeb,
            total:new Decimal(estiomateResult!.fee).add(mintPrice).add(import.meta.env.VITE_MINT_NFT_SERVICE_FEE).toNumber()
          }
          const result= await payModalEntity.awaitPayConfrim(SdkPayType.BTC,feeInfo.total,feeInfo,'mint')
        
          return result
         }
         
         return estiomateResult
        } catch (error) {
          ElMessage.error((error as any).message)
          return false
        }
      }

    async function estimateBuyFee(orderInfo:{
      nftItem?:NftOrderType
      psbtHex:string,
      feeDetail:feeDetailType
    },checkOnly:boolean=false){
      const bitcoinjs = useBtcJsStore().get!
      const networkStore=useNetworkStore()
      const feeStore = useFeebStore()
      
      try {
       if(!orderInfo.psbtHex){
        return ElMessage.error((`${i18n.t('Nfts.psbt_buy_empty')}`))
       }
        const psbt =bitcoinjs.Psbt.fromHex(orderInfo.psbtHex,{ network: networkStore.typedNetwork })
        
        const estiomateResult= await exclusiveChange({
          psbt: psbt,
          maxUtxosCount:20,
          sighashType:SIGHASH_ALL_ANYONECANPAY,
          feeb:feeStore.getCurrentFeeb,
       })
    
     
       if(checkOnly){
        
        const salePrice=orderInfo.feeDetail.salePrice
        const feeInfo:feeInfoType={
          basic:salePrice,
          royaltyRate:orderInfo.feeDetail.royaltyRate,
          platformRate:orderInfo.feeDetail.platformRate,
          royalty:orderInfo.feeDetail.royalFee,
          service:orderInfo.feeDetail.platformFee,
          miner:estiomateResult!.fee,
          feeb:estiomateResult!.feeb,
          extraInfo:orderInfo.nftItem,
          total:new Decimal(estiomateResult!.fee).add(salePrice).add(orderInfo.feeDetail.platformFee).add(orderInfo.feeDetail.royalFee).toNumber()
        }
       
        const result= await payModalEntity.awaitPayConfrim(SdkPayType.BTC,feeInfo.total,feeInfo,'buy')
        
        return result
       }
       
       return estiomateResult
      } catch (error) {
        ElMessage.error((error as any).message)
        return false
      }
    }

    async function estimateRedeemFee(psbtHex:string,feeb:number,checkOnly:boolean=false){
      const bitcoinjs = useBtcJsStore().get!
      const networkStore=useNetworkStore()
      const feeStore = useFeebStore()

      try {
       if(!psbtHex){
        return ElMessage.error(`${i18n.t('Nfts.redeem_psbt_empty')}`)
       }
        const psbt =bitcoinjs.Psbt.fromHex(psbtHex,{ network: networkStore.typedNetwork })
      
        const estiomateResult= await exclusiveChange({
          psbt: psbt,
          maxUtxosCount:1,
          sighashType:SIGHASH_ALL_ANYONECANPAY,
          feeb:feeb ?? feeStore.getCurrentFeeb,
       })
       
     
       if(checkOnly){
        //const {paymentValue,fee,changeValue}=estiomateResult
        const basic=0
        const feeInfo={
          basic:basic,
          service:REDEEM_SERVICE_FEE,
          miner:estiomateResult!.fee,
          feeb:estiomateResult!.feeb,
          total:new Decimal(estiomateResult!.fee).add(REDEEM_SERVICE_FEE).toNumber()
        }
        const result= await payModalEntity.awaitPayConfrim(SdkPayType.BTC,feeInfo.total,feeInfo,'basic')
    
        return result
       }
       
       return estiomateResult
      } catch (error) {
        ElMessage.error((error as any).message)
        return false
      }
    }

    async function estimateTransferFee(psbt:Psbt,checkOnly:boolean=false){
      const feeStore = useFeebStore()
      try {
       if(!psbt){
        return ElMessage.error(`Psbt not available`)
       }
        const estiomateResult= await exclusiveChange({
          psbt: psbt,
          maxUtxosCount:5,
          sighashType:SIGHASH_ALL_ANYONECANPAY,
          feeb:feeStore.getCurrentFeeb,
       })
       
     
       if(checkOnly){
        
        const basic=0
        const feeInfo={
          basic:basic,
          service:0,
          miner:estiomateResult!.fee,
          feeb:estiomateResult!.feeb,
          total:new Decimal(estiomateResult!.fee).toNumber()
        }
        const result= await payModalEntity.awaitPayConfrim(SdkPayType.BTC,feeInfo.total,feeInfo,'basic')
    
        return result
       }
       
       return estiomateResult
      } catch (error) {
        ElMessage.error((error as any).message)
        return false
      }
    }



    async function mintItem(params:{
        commitAddress:string
        receiverAddress:string
        feeb:number
        collectionPinid:string
       
      }){
        const feeStore = useFeebStore()
        // const bitcoinjs=useBtcJsStore().get!
        // const networkStore=useNetworkStore()
        const connectionStore = useConnectionStore()
        try {
          

          //const dummyPsbt:Psbt =await getDummyUtxoforLegacy(1,SIGHASH_ALL_ANYONECANPAY,true)
          //const psbt=new bitcoinjs.Psbt({ network: networkStore.typedNetwork })
          //第一个output
          // psbt.addOutput({
          //   value:DUMMY_UTXO_INPUT_LEGACY,
          //   address:connectionStore.last.user.address
          // })   
        // if(dummyPsbt){
        //   params.dummyPsbtHex=dummyPsbt.toHex()
        // }else{
        //   return ElMessage.error(`${i18n.t('dummy.build_error')}`)
        // }
        
          
        const getOrderPsbtRes= await mintNftItem(params)
        
        if(getOrderPsbtRes.code == 200){
        const psbtHex=getOrderPsbtRes.data.psbtHex
        
         const estiomateResult=await estimatePsbtFee(psbtHex,feeStore.getCurrentFeeb,true)
         console.log("feeStore.getCurrentFeeb",feeStore.getCurrentFeeb,)
         
         if(estiomateResult){
          const {psbt,feeb}=await estimatePsbtFee(psbtHex,feeStore.getCurrentFeeb)
          console.log('feee',feeb,feeStore.getCurrentFeeb)
          
          const toSignInputs=await formatToSignInputs(psbt)
          
          const rawTx= await connectionStore.adapter.signPsbt(psbt.toHex(),{
            toSignInputs:toSignInputs,
            autoFinalized:false
          })
          console.log("signRes",rawTx)
          if(rawTx?.status == 'canceled'){
           // await cancelOrder(getOrderPsbtRes.data.orderId)
            return ElMessage.error(`${i18n.t('Nfts.lanuch_sign_tx_fail')}`)
            
          }else{
            const submitRes= await submitMintOrder({
            collectionPinId:params.collectionPinid,
            commitAddress:params.commitAddress,
            psbtHex:rawTx,
            feeb:feeb
          })
          
          if(submitRes.code == 200){
            
            ElMessage.success(`${i18n.t('NFTS.NFTs mint_success')}`)
            return submitRes
          }else{
            
           return ElMessage.error(submitRes.msg)
          }
          }
         
        }else{
          //await cancelOrder(getOrderPsbtRes.data.orderId)
        }
        
        }else{
          return ElMessage.error(getOrderPsbtRes.msg)
        } 
      
      }catch (error) {
          
          
         return ElMessage.error((error as any).toString())
        }
    
      }





      async function formatToSignInputs(psbt:Psbt){
        const connectionStore = useConnectionStore()
        try {
          const pubkey=await connectionStore.provider?.btc.getPublicKey()
          
        const toSignInputs=[]
        if(psbt.inputCount == 1){
          return ElMessage.error('No input to Sign')
        }
        if(psbt.inputCount > 0){
            for(let i=0;i<psbt.inputCount;i++){
              if(i !== 0){
                
                toSignInputs.push({
                  index:i,
              address:connectionStore.last.user.address,
              publickey:pubkey,
              sighashTypes:[SIGHASH_ALL_ANYONECANPAY],
              disableTweakSigner:false
                })
              }
           
            }
          }
          console.log("toSignInputs",toSignInputs)
          return toSignInputs
        } catch (error) {
          throw new Error(error as any)
        }
      }

      async function formatToSignTargetInput(signIndex:number[],sighashType:number){
        const connectionStore = useConnectionStore()
        try {
          const pubkey=await connectionStore.provider?.btc.getPublicKey()
          
        const toSignInputs=[]
       for(let item of signIndex){
        toSignInputs.push({
          index:item,
      address:connectionStore.last.user.address,
      publickey:pubkey,
      sighashTypes:[sighashType],
      disableTweakSigner:false
        })
       }
  
          
          return toSignInputs
        } catch (error) {
          
          throw new Error(error as any)
        }
      }

    

      async function saleNft(params:{
        collectionPinid:string,
        nftPinid:string,
        salePrice:number,
        extraFee:{
        royaltyRateFee: number;
        platformFee: number;
        }
      }) {
        try {
          console.log("collectionPinid",params)
          
          const salePsbt= await buildFillUtxoPsbt(params.nftPinid,params.salePrice,params.extraFee)
        
       const psbtHex=salePsbt!.data.toHex()
       console.log("salePsbt",salePsbt)
       
       const connectionStore = useConnectionStore()
       const toSignInputs=await formatToSignTargetInput([2],SIGHASH_SINGLE_ANYONECANPAY)
       
       const rawTx= await connectionStore.adapter.signPsbt(psbtHex,{
        toSignInputs:toSignInputs,
        autoFinalized:false
      })
      
      console.log("signRes",rawTx)
      
      if(rawTx?.status == 'canceled'){
        throw new Error(`${i18n.t('Nfts.lanuch_sign_tx_fail')}`)
       
      }else{
        
        const submitRes= await submitSaleOrder({
        collectionPinid:params.collectionPinid,
        nftPinid:params.nftPinid,
        psbtHex:rawTx,
        salePrice:params.salePrice,
        salerAddress:connectionStore.getAddress,
        salerMetaid:connectionStore.last.metaid
        
      })
      
      if(submitRes.code == 200){
        
        //ElMessage.success(`${i18n.t('NFTS.NFTs onsale_success')}`)
        return submitRes
      }else{
        return ElMessage.error(submitRes?.msg)
      }
        } 
        
       
      }catch (error) {
          
          throw new Error(error as any)
      }
      }

      async function buyNft(parmas:{
        nftItem:NftOrderType
        psbtHex:string
        buyerAddress:string
        nftPinid:string
        extraFee:feeDetailType
        chain?:NftsLaunchPadChainSymbol
      }){
      
        try {
          if(!parmas.chain){
            parmas.chain=NftsLaunchPadChainSymbol.btc
          }

          
          const orderRes= await submitBuyOrder({
            psbtHex:parmas.psbtHex,
            buyerAddress:parmas.buyerAddress,
            chain:parmas.chain
          })
          
          if(orderRes.code == 200){
            const sevicePsbtHex=orderRes.data.psbtHex
            // const bitcoinjs = useBtcJsStore().get!
            // const networkStore=useNetworkStore()
            // const feeStore = useFeebStore()
            // const psbt=bitcoinjs.Psbt.fromHex(revealPsbtHex,{network: networkStore.typedNetwork})
           const estimateResult=  await estimateBuyFee({
              nftItem:parmas.nftItem,
              psbtHex:sevicePsbtHex,
              feeDetail:parmas.extraFee
            },true)
            
            if(estimateResult){
              const revealPsbt= await estimateBuyFee({
                
                psbtHex:sevicePsbtHex,
                feeDetail:parmas.extraFee
              })
              
              const targetIndex:number[]=[]
              revealPsbt!.psbt!.data.inputs.forEach((item:any,index:number)=>{
                if(index > 3){
                  targetIndex.push(index)
                }
              })
              
              const toSignInputs=await formatToSignTargetInput(targetIndex,SIGHASH_ALL_ANYONECANPAY)
              
              const connectionStore=useConnectionStore()
              const rawTx= await connectionStore.adapter.signPsbt(revealPsbt!.psbt.data.toHex(),{
                toSignInputs:toSignInputs,
                autoFinalized:false
              })
              console.log("signRes",rawTx)
                
              if(rawTx?.status == 'canceled'){
                
                await cancelBuyNft({
                  psbtHex:sevicePsbtHex
                })

               //ElMessage.error(`${i18n.t('Nfts.lanuch_sign_tx_fail')}`)
               throw new Error(`${i18n.t('Nfts.lanuch_sign_tx_fail')}`)
              }else{
                
                const revealBuyRes= await finalySignAndBuyNft({
                  revealPsbtHex:rawTx,
                  originalPsbtHex:parmas.psbtHex,
                  buyerAddress:parmas.buyerAddress,
                  nftPinid:parmas.nftPinid
                })
                
                if(revealBuyRes.code == 200){
                  
                  return revealBuyRes.data
                }else{
                   ElMessage.error(revealBuyRes.msg)
                   throw new Error(revealBuyRes.msg)
                }

            
              }
            
            }else{
              
              await cancelBuyNft({
                psbtHex:sevicePsbtHex
              })
              //ElMessage.error(`cancel transaction`)
             throw new Error(`${i18n.t('cancel')}`)
            }

          }else{
           
             //ElMessage.error(orderRes.msg)
             throw new Error(orderRes.msg)
          }
        } catch (error) {
          
         
          //ElMessage.error((error as any).message)
          throw new Error((error as any).message)
        }

      }


      async function redeemNft(params:{
        nftPinid:string,
        collectionPinid:string,
        psbtHex:string,
        mintPrice:number
       }){
        try {
          const connectionStore=useConnectionStore()
        const address=connectionStore.last.user.address
        const feebStore=useFeebStore()
        const bitcoinJs=useBtcJsStore().get!
        const networkStore=useNetworkStore()
        const psbt=new bitcoinJs.Psbt({ network: networkStore.typedNetwork })
        //const psbt:Psbt =await getDummyUtxoforLegacy(1,SIGHASH_ALL_ANYONECANPAY,true)
        
        //第一个output
        // psbt.addOutput({
        //   value:DUMMY_UTXO_INPUT_LEGACY,
        //   address:connectionStore.last.user.address
        // })  


        const pinInfo=await getPinfromPinidList({
          pinList:[params.nftPinid]
        })    //await getPinfromPinid(params.nftPinid)
        const nftUtxo= extractTxAndOutputIndex(pinInfo[params.nftPinid].output)
        
        console.log("pinInfo",pinInfo)
        const paymentInput={
          hash:nftUtxo[0],
          index:+nftUtxo[1],
          sighashType:SIGHASH_ALL_ANYONECANPAY
        }
        // 
        await fillInputUtxo(paymentInput,address,546)
        fillInternalKey(paymentInput)
        psbt.addInput(paymentInput)
        console.log("params.mintPrice",params.mintPrice)
        
        psbt.addOutput({
          address:address,
          value:params.mintPrice
        })
        const feeb=feebStore.getCurrentFeeb
        const redeemOrderRes= await getRedeemOrder({
          nftPinid:params.nftPinid,
          address:connectionStore.last.user.address,
          collectionPinid:params.collectionPinid,
          psbtHex:psbt.data.toHex(),
          feeb:feeb
        })
  
        if(redeemOrderRes.code == 200){
          
          const redeemPsbtHex=redeemOrderRes.data.psbtHex
          
          const estimatedRes=await estimateRedeemFee(redeemPsbtHex,feeb,true)
          
          if(estimatedRes){
            
            const {psbt:estimatePsbt}=await estimateRedeemFee(redeemPsbtHex,feeb)
            const toSignInputs=await formatToSignTargetInput([0,2],SIGHASH_ALL_ANYONECANPAY)
            const rawTx= await connectionStore.adapter.signPsbt(estimatePsbt.toHex(),{
              toSignInputs:toSignInputs,
              autoFinalized:false
            })
           
            console.log("signRes",rawTx)
            if(rawTx?.status == 'canceled'){
              return ElMessage.error(`${i18n.t('Nfts.lanuch_sign_tx_fail')}`)
            }else{
              const submitRes= await submitRedeemOrder({
                psbtHex:rawTx,
                nftPinid:params.nftPinid
              })
              if(submitRes.code == 200){
                return submitRes.data
              }else{
                return ElMessage.error(submitRes.msg)
              }
          }
  
  
        }else{
         return ElMessage.error(redeemOrderRes.msg)
        }
  
  
  
       }
        } catch (error) {
          ElMessage.error((error as any))
        }

      }

      async function transferNft(params:{
        nftPinid:string,
        receiverAddress:string
      }){
       
        const feebStore=useFeebStore()
        const connectionStore=useConnectionStore()
        const networkStore=useNetworkStore()
        const bitcoinjs=useBtcJsStore().get!
        const {nftPinid,receiverAddress}=params
        if(!nftPinid || !receiverAddress){
          return ElMessage.error(`lost required parameters`)
        } 
        try {
         
          const psbt=new bitcoinjs.Psbt({ network: networkStore.typedNetwork })
         

          const pinInfo=await getPinfromPinidList({
            pinList:[params.nftPinid]
          })
          const nftUtxo= extractTxAndOutputIndex(pinInfo[nftPinid].output)
          
          console.log("pinInfo",pinInfo)
          const paymentInput={
            hash:nftUtxo[0],
            index:Number(nftUtxo[1]),
            sighashType:SIGHASH_ALL_ANYONECANPAY
          }
          // 
          
          await fillInputUtxo(paymentInput,connectionStore.last.user.address,PIN_UTXO_VALUE)
          fillInternalKey(paymentInput)
          psbt.addInput(paymentInput)
          psbt.addOutput({
            address:receiverAddress,
            value:PIN_UTXO_VALUE
          }) 

         //const estimateRes= await estimateTransferFee(psbt,true)
         const {psbt:estimatePsbt}=await estimateTransferFee(psbt)
          const rawTx= await connectionStore.adapter.signPsbt(estimatePsbt.toHex())
         
          console.log("signRes",rawTx)
          if(rawTx?.status == 'canceled'){
            return ElMessage.error(`${i18n.t('Nfts.lanuch_sign_tx_fail')}`)
          }else{
            
            const signPsbt=bitcoinjs.Psbt.fromHex(rawTx,{ network: networkStore.typedNetwork })
            const signHex= signPsbt.extractTransaction().toHex()
             const broadcastRes= await broadcastBTCTx(signHex,networkStore.network)
             
            if(broadcastRes.code == 200){
              if( broadcastRes.data){
                return ElMessage.success(`${i18n.t('Nfts.transfer_success')}`)
              }
              
            }else{
            return ElMessage.error(broadcastRes.msg)
            }
          }

          
        } catch (error) {
          throw new Error((error as any).message)
        }
      }
  
  

     


    return {
        mintItem,
        saleNft,
        buyNft,
        redeemNft,
        transferNft
    }


}