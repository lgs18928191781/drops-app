import { mintNftItem,submitMintOrder} from '@/api/mrc721-api'
import { useBtcJsStore } from '@/stores/btcjs'
import { useI18n } from 'vue-i18n'
import { useNetworkStore } from '@/stores/network'
import {exclusiveChange} from '@/hooks/use-buildtx-entity'
import Decimal from 'decimal.js-light'
import { NftsLaunchPadChain, NftsLaunchPadChainSymbol,SIGHASH_ALL,SIGHASH_ALL_ANYONECANPAY } from '@/data/constants'
import {usePayModalEntity} from '@/hooks/use-pay-modal-entity'
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
          throw new Error(`${i18n.t('Nfts.psbt_empty')}`)
         }
          const psbt =bitcoinjs.Psbt.fromHex(psbtHex,{ network: networkStore.typedNetwork })
       
          const estiomateResult= await exclusiveChange({
            psbt: psbt,
            maxUtxosCount:3,
            sighashType:SIGHASH_ALL_ANYONECANPAY,
            feeb:feeb ?? feeStore.last.currentFeeb.feeRate,
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
          throw new Error(error as any)
        }
      }


    async function mintItem(params:{
        creatorMetaId:string
        name:string
        commitAddress:string
        receiverAddress:string
        feeb:number
      }){
        const feeStore = useFeebStore()
        const connectionStore = useConnectionStore()
        try {
      
        const getOrderPsbtRes= await mintNftItem(params)
        if(getOrderPsbtRes.code == 200){
        const psbtHex=getOrderPsbtRes.data.psbtHex
         const estiomateResult=await estimatePsbtFee(psbtHex,feeStore.last.currentFeeb.feeRate,true)
         if(estiomateResult){
          const {psbt,feeb}=await estimatePsbtFee(psbtHex,feeStore.last.currentFeeb.feeRate)
          const toSignInputs=await formatToSignInputs(psbt)
          const rawTx= await connectionStore.adapter.signPsbt(psbt.toHex(),{
            toSignInputs:toSignInputs,
            autoFinalized:false
          })
          console.log("signRes",rawTx)
          if(rawTx?.status == 'canceled'){
            throw new Error(`${i18n.t('Nfts.lanuch_sign_tx_fail')}`)
          }else{
            const submitRes= await submitMintOrder({
            creatorMetaId:params.creatorMetaId,
            name:params.name,
            commitAddress:params.commitAddress,
            psbtHex:rawTx,
            feeb:params.feeb
          })
          if(submitRes.code == 200){
            
            ElMessage.success(`${i18n.t('NFTS.NFTs mint_success')}`)
            return submitRes
          }else{
            throw new Error(submitRes?.msg)
          }
          }
         
        }
        
        } }catch (error) {
          
          
         return ElMessage.error(error as any)
        }
    
      }


      async function formatToSignInputs(psbt:Psbt){
        const connectionStore = useConnectionStore()
        try {
          const pubkey=await connectionStore.provider?.btc.getPublicKey()
          
        const toSignInputs=[]
        if(psbt.inputCount == 1){
          throw new Error('No input to Sign')
        }
        if(psbt.inputCount > 0){
            for(let i=1;i<psbt.inputCount;i++){
              toSignInputs.push({
                index:i,
            address:connectionStore.last.user.address,
            publickey:pubkey,
            sighashTypes:[129],
            disableTweakSigner:false
              })
            }
          }
          console.log("toSignInputs",toSignInputs)
          return toSignInputs
        } catch (error) {
          throw new Error(error as any)
        }
      }


    return {
        mintItem
    }


}