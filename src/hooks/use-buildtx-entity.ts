import bitcoin,{ PsbtTxOutput, type Psbt, TxOutput,networks, } from 'bitcoinjs-lib'
import { useFeebStore } from '@/stores/feeb'
import { useConnectionStore } from '@/stores/connection'
import { isTaprootInput } from 'bitcoinjs-lib/src/psbt/bip371'
import {raise} from '@/utils/util'
import { Output } from 'bitcoinjs-lib/src/transaction'
import { useNetworkStore } from '@/stores/network'
import { useBtcJsStore } from '@/stores/btcjs'
import {toXOnly} from '@/hooks/btc-help'
import Decimal from 'decimal.js-light'
import {getRawTx,getPinfromPinid,getFakerUtxo,getPinfromPinidList,broadcastBTCTx} from '@/api/mrc721-api'
import {SIGHASH_ALL_ANYONECANPAY,DUST_UTXO_VALUE,MS_BRC20_UTXO_VALUE,SIGHASH_SINGLE_ANYONECANPAY,DUMMY_UTXO_INPUT_LEGACY,DUMMY_UTXO_VALUE,DUMMY_UTXO_OUTPUT_VALUE} from '@/data/constants'
import i18n from '@/utils/i18n'
import { ElMessage, ElMessageBox} from 'element-plus'
import { resolve } from 'path'
type PsbtInput = (typeof Psbt.prototype.data.inputs)[0]
type PsbtInputExtended = PsbtInput & {
  hash: string
  index: number
}

type AddressType = 'p2pkh' | 'p2wpkh' | 'p2tr' | 'p2sh' | 'unknown'

type AddressInfo = {
  type: AddressType
  network: networks.Network
}

const TX_EMPTY_SIZE = 4 + 1 + 1 + 4
const TX_INPUT_BASE = 32 + 4 + 1 + 4 // 41
const TX_INPUT_PUBKEYHASH = 107
const TX_INPUT_SEGWIT = 27
const TX_INPUT_TAPROOT = 17 // round up 16.5 bytes
const TX_OUTPUT_BASE = 8 + 1
const TX_OUTPUT_PUBKEYHASH = 25
const TX_OUTPUT_SCRIPTHASH = 23
const TX_OUTPUT_SEGWIT = 22
const TX_OUTPUT_SEGWIT_SCRIPTHASH = 34
const DefaultTxVersion = 2
const safeFee=1221
function inputBytes(input: PsbtInput) {
  // todo: script length
  if (isTaprootInput(input)) {
    return TX_INPUT_BASE + TX_INPUT_TAPROOT
  }

  if (input.witnessUtxo) return TX_INPUT_BASE + TX_INPUT_SEGWIT

  return TX_INPUT_BASE + TX_INPUT_PUBKEYHASH

}

function outputBytes(output: PsbtTxOutput) {
  // if output is op-return, use it's buffer size

  return (
    TX_OUTPUT_BASE +
    (output.script
      ? output.script.length
      : output.address?.startsWith('bc1') || output.address?.startsWith('tb1')
        ? output.address?.length === 42 // TODO: looks like something wrong here
          ? TX_OUTPUT_SEGWIT
          : TX_OUTPUT_SEGWIT_SCRIPTHASH
        : output.address?.startsWith('3') || output.address?.startsWith('2')
          ? TX_OUTPUT_SCRIPTHASH
          : TX_OUTPUT_PUBKEYHASH)
  )
}

export async function calcTotalInputValue(psbt: Psbt): Promise<number> {
  const btcjs = useBtcJsStore().get!

  const inputs = psbt.data.inputs
  
  let totalInputValue = 0
  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i]
    
    if (input.witnessUtxo) {
      totalInputValue += input.witnessUtxo.value
    } else if (input.nonWitnessUtxo) {
      const tx = btcjs.Transaction.fromBuffer(input.nonWitnessUtxo)
      const outputIndex = psbt.txInputs[i].index
      
      const output = tx.outs[outputIndex]
      
      totalInputValue += output.value
    } else {
      throw new Error('Input has no utxo')
    }
  }

  return totalInputValue
}

function sumOrNaN(txOutputs: TxOutput[] | Output[]) {
  
  return txOutputs.reduce(function (a: number, x: any) {
    return a + uintOrNaN(x.value)
    
  }, 0)
}

function uintOrNaN(v: any) {
  if (typeof v !== 'number') return NaN
  if (!isFinite(v)) return NaN
  if (Math.floor(v) !== v) return NaN
  if (v < 0) return NaN
  return v
}

export function safeOutputValue(value: number | Decimal, isMs = false): number {
  const threshold = isMs ? MS_BRC20_UTXO_VALUE : DUST_UTXO_VALUE

  // if value is less than 1k sats, throw an error
  if (typeof value === 'number') {
    if (value < threshold) {
      throw new Error(
        `The amount you are trying is too small. Maybe try a larger amount.`,
      )
    }
  } else {
    if (value.lessThan(threshold)) {
      throw new Error(
        `The amount you are trying is too small. Maybe try a larger amount.`,
      )
    }
  }

  // make sure value is a whole number
  if (typeof value === 'number') {
    return Math.round(value)
  }

  return value.round().toNumber()
}

export function calcFee(
  psbt: Psbt,
  feeRate: number,
  extraSize: number = 31, // 31 is the size of the segwit change output
  // extraInputValue?: number
) {
  const inputs = psbt.data.inputs
  const outputs = psbt.txOutputs

  let bytes = transactionBytes(inputs, outputs)
  
  if (extraSize) {
    bytes += extraSize
  }
  console.log({ bytes })

  let fee = Math.ceil(bytes * feeRate)
 

  return fee
}

function transactionBytes(inputs: PsbtInput[], outputs: PsbtTxOutput[]) {
  const inputsSize = inputs.reduce(function (a, x) {
    return a + inputBytes(x)
  }, 0)
  const outputsSize = outputs.reduce(function (a, x, index) {
    return a + outputBytes(x)
  }, 0)

  

  console.log({
    inputsSize,
    outputsSize,
    TX_EMPTY_SIZE,
  })
  return TX_EMPTY_SIZE + inputsSize + outputsSize
}


export async function deviceDummy(){
  const bitcoinjs = useBtcJsStore().get!
  const networkStore=useNetworkStore()
  const connectionStore=useConnectionStore()
  const feeStore=useFeebStore()
  
  try {
    const psbt=new bitcoinjs.Psbt({ network: networkStore.typedNetwork })
    for(let i=0;i< 10;i++){
      psbt.addOutput({
        address:connectionStore.last.user.address,
        value:DUMMY_UTXO_INPUT_LEGACY
      })
    }
    const res= await exclusiveChange({
      psbt:psbt,
      maxUtxosCount:5,
      sighashType:SIGHASH_ALL_ANYONECANPAY,
      feeb:feeStore.getCurrentFeeb,
    })

    const rawTx= await connectionStore.adapter.signPsbt(res!.psbt.toHex())
    const newPsbt=bitcoinjs.Psbt.fromHex(rawTx,{ network: networkStore.typedNetwork })
    const hex= newPsbt.extractTransaction().toHex()
 
    const broadcastRes= await broadcastBTCTx(hex,networkStore.network)
    if(broadcastRes.code == 200){
      return broadcastRes.data
    }else{
      return ElMessage.error(broadcastRes.msg)
    }
 
  } catch (error) {
    ElMessage.error((error as any).message)
  }
}

export async function checkDummyAmount(){
  return new Promise(async(resolve,reject)=>{

    const paymentUtxos = await window.metaidwallet.btc.getUtxos({
      useUnconfirmed:true
    }).catch(err=>{
      throw new Error(`Get dummy utxos error`)  
    })
    const filtered = paymentUtxos.filter((utxo) => {
      return !utxo.inscriptions && utxo.satoshis == DUMMY_UTXO_INPUT_LEGACY
    })

    if(filtered.length){
      resolve(true)
      return
    }else{
     const res=await ElMessageBox.confirm(`${i18n.global.t('dummy.not_enough')}`, `${i18n.global.t('dummy.warning')}`, {
        customClass: 'primary',
        customStyle:'background:#fff',
        closeOnClickModal: false,
        confirmButtonText: `${i18n.global.t('dummy.confirm')}`,
        cancelButtonText: i18n.global.t('Cancel'),
      }).catch(()=>{
        resolve(false)
        return
      })
      if(res){
        await deviceDummy()
        resolve(true)
      }else{
        resolve(false)
      }
    }



    
  })
}

export async function getDummyUtxoforLegacy(inputAmount:number = 1,otherSighashType:number,needBuild:boolean=false,sighashType:number = SIGHASH_ALL_ANYONECANPAY){
  let paymentUtxos = await window.metaidwallet.btc.getUtxos({
    useUnconfirmed:true
  }).then((result) => {
      
    // first, filter out all the utxos that are currently listing
    const filtered = result.filter((utxo) => {
      return !utxo.inscriptions && utxo.satoshis == DUMMY_UTXO_INPUT_LEGACY
    })
    
    if (filtered.length === 0) {
      return []
    }

    // choose the largest utxos, but not more than maxUtxosCount
    const utxos = filtered
      .sort((a, b) => {
        return b.satoshis - a.satoshis
      })
      .slice(0, inputAmount)

    return utxos
  })

  if(needBuild){
    const btcjs = useBtcJsStore().get!
    const networkStore=useNetworkStore()
    const connectionStore = useConnectionStore()
    const psbt=new btcjs.Psbt({ network: networkStore.typedNetwork })
    for (let i = 0; i < paymentUtxos!.length; i++) {
      const paymentUtxo = paymentUtxos![i]
      // const paymentWitnessUtxo = {
      //   value: paymentUtxo.satoshis,
      //   script: paymentPrevOutputScript,
      // }
      const toUseSighashType =
        i > 0 && otherSighashType ? otherSighashType : sighashType
      const paymentInput = {
        hash: paymentUtxo.txId,
        index: paymentUtxo.outputIndex,
         //witnessUtxo: paymentWitnessUtxo,
        sighashType: toUseSighashType,
      }
      await fillInputUtxo(paymentInput, connectionStore.last.user.address, paymentUtxo.satoshis)
      fillInternalKey(paymentInput)
      psbt.addInput(paymentInput)}
      return psbt

  }else{
    return paymentUtxos
  }
}


export async function exclusiveChange({
  psbt,
  extraSize,
  useSize,
  extraInputValue,
  maxUtxosCount = 1,
  sighashType = SIGHASH_ALL_ANYONECANPAY,
  otherSighashType,
  estimate = false,
  partialPay = false,
  cutFrom = 1,
  feeb,

}: {
  psbt: Psbt
  extraSize?: number
  useSize?: number
  extraInputValue?: number
  maxUtxosCount?: number
  sighashType?: number
  otherSighashType?: number
  estimate?: boolean
  partialPay?: boolean
  cutFrom?: number
  feeb?: number
  
}){
  
  const connectionStore=useConnectionStore()
  
  feeb = feeb ?? useFeebStore().getCurrentFeeb ??  raise('Choose a fee rate first.')
  const address =connectionStore.getAddress ?? raise('Please connect to your wallet first.')
  
  if (useSize && maxUtxosCount > 1) {
    raise('useSize and maxUtxosCount cannot be set at the same time.')
  }
  
  //connectionStore.provider?.btc.getUtxos
  const paymentUtxos = await window.metaidwallet.btc.getUtxos({
    useUnconfirmed:true
  }).then((result) => {
      
    // first, filter out all the utxos that are currently listing
    const filtered = result.filter((utxo) => {
      return !utxo.inscriptions 
    })
    
    if (filtered.length === 0) {
      return []
    }

    // choose the largest utxos, but not more than maxUtxosCount
    const utxos = filtered
      .sort((a, b) => {
        return b.satoshis - a.satoshis
      })
      .slice(0, maxUtxosCount)

    return utxos
  }).catch((e)=>{
    
    raise(
      'You have no usable BTC UTXO. Please deposit more BTC into your address to receive additional UTXO. utxo',
    )
  })

  if (!paymentUtxos!.length) {
    raise(
      'You have no usable BTC UTXO. Please deposit more BTC into your address to receive additional UTXO. utxo',
    )
  }

  // const networkStore = useNetworkStore()
  // const btcjs = useBtcJsStore().get!
  // const paymentPrevOutputScript = btcjs.address.toOutputScript(
  //   address,
  //   networkStore.typedNetwork,
  // )
  console.log({ paymentUtxos })
  console.log("paymentUtxos",paymentUtxos)
  
  for (let i = 0; i < paymentUtxos!.length; i++) {
    const paymentUtxo = paymentUtxos![i]
    // const paymentWitnessUtxo = {
    //   value: paymentUtxo.satoshis,
    //   script: paymentPrevOutputScript,
    // }
    const toUseSighashType =
      i > 0 && otherSighashType ? otherSighashType : sighashType
    const paymentInput = {
      hash: paymentUtxo.txId,
      index: paymentUtxo.outputIndex,
       //witnessUtxo: paymentWitnessUtxo,
      sighashType: toUseSighashType,
    }
    await fillInputUtxo(paymentInput, address, paymentUtxo.satoshis)
   
    fillInternalKey(paymentInput)
    
 
    psbt.addInput(paymentInput)
    
    // Add change output
    console.log("useSize",useSize)
    
    let fee = useSize
      ? Math.round(useSize * feeb)
      : calcFee(psbt, feeb, extraSize)
    let totalInput, totalOutput
    if (partialPay) {
      
      // we only pay for the fee and some extra value, not the whole transaction
      totalOutput = 0
      // totalInput = the inputs we add in now
      //
      totalInput =await calcTotalInputValue(psbt)
    } else {
      // we pay for the whole transaction
      totalOutput = sumOrNaN(psbt.txOutputs)
      
      totalInput =await calcTotalInputValue(psbt)
      
    
    }

    if(fee < safeFee){
     
       throw new Error(`tx feeb must be more than ${safeFee},but only ${fee},please select a higher rate to continue the transaction`)
    }

    const changeValue = totalInput - totalOutput - fee + (extraInputValue || 0)
    
    if (changeValue < 0) {
      // if we run out of utxos, throw an error
      if (paymentUtxo === paymentUtxos![paymentUtxos!.length - 1]) {
        raise(
          'Insufficient balance. Please ensure that the address has a sufficient balance and try again.',
        )
      }

      // otherwise, continue
      continue
    }

    // we have enough satoshis to pay here, let's change now
    if (changeValue >= DUST_UTXO_VALUE) {
      
      psbt.addOutput({
        address:address,
        value: safeOutputValue(changeValue),
      })
    } else {
      
      fee += safeOutputValue(changeValue)
    }
    console.log({ psbt })
    
    return {
      psbt,
      fee,
      paymentValue: paymentUtxo.satoshis,
      feeb,
      changeValue,
    }
  }
  



}
export function fillInternalKeyForOtherAccount<T extends PsbtInput | PsbtInputExtended>(
  input: T,
  address:string,
  pubkey:string
): T {
  //const connectionStore=useConnectionStore()
  // check if the input is mine, and address is Taproot
  // if so, fill in the internal key
  //const address =address

  const isP2TR = address.startsWith('bc1p') || address.startsWith('tb1p')
  const lostInternalPubkey = !input.tapInternalKey

  if (isP2TR && lostInternalPubkey) {
    const tapInternalKey = toXOnly(
      Buffer.from(pubkey, 'hex'),
    )
    const { output } = useBtcJsStore().get!.payments.p2tr({
      internalPubkey: tapInternalKey,
    })
    if (input.witnessUtxo?.script.toString('hex') == output!.toString('hex')) {
      input.tapInternalKey = tapInternalKey
    }
  }

  return input
}


export function fillInternalKey<T extends PsbtInput | PsbtInputExtended>(
  input: T,
): T {
  const connectionStore=useConnectionStore()
  // check if the input is mine, and address is Taproot
  // if so, fill in the internal key
  const address =
  connectionStore.getAddress ??
    raise('Please connect to a wallet first.')

  const isP2TR = address.startsWith('bc1p') || address.startsWith('tb1p')
  const lostInternalPubkey = !input.tapInternalKey

  if (isP2TR && lostInternalPubkey) {
    const tapInternalKey = toXOnly(
      Buffer.from(connectionStore.userInfo.pubkey, 'hex'),
    )
    const { output } = useBtcJsStore().get!.payments.p2tr({
      internalPubkey: tapInternalKey,
    })
    if (input.witnessUtxo?.script.toString('hex') == output!.toString('hex')) {
      input.tapInternalKey = tapInternalKey
    }
  }

  return input
}


export async function fillInputUtxo<T extends PsbtInputExtended>(
  input: T,
  address: string,
  satoshis: number,
  fillNonWitnessUtxo:boolean=true,
  paramPreTxRaw?: string,
 
): Promise<T> {
  const btcjs = useBtcJsStore().get! || raise('btcjs not initialized')
  const network = useNetworkStore().typedNetwork
  const pubKey =await useConnectionStore().adapter.getPubKey()

  const addressType = determineAddressInfo(address).type
  
  if (
    addressType === 'p2tr' ||
    addressType === 'p2wpkh' ||
    addressType === 'p2sh' || !fillNonWitnessUtxo
  ) {
    const outputScript = btcjs.address.toOutputScript(address, network)
    const witnessUtxo = {
      script: outputScript,
      value: satoshis,
    }

    input.witnessUtxo = witnessUtxo

    // if it's p2sh(p2wpkh), we need to add redeemScript
    if (addressType === 'p2sh') {
      const payments = btcjs.payments
      const { redeem } = payments.p2sh({
        redeem: payments.p2wpkh({
          pubkey: Buffer.from(pubKey, 'hex'),
          network,
        }),
        network,
      })
      if (!redeem) throw new Error('redeemScript')
      input.redeemScript = redeem.output
    }

    return input
  }
  
  // p2pkh, fetch nonWitnessUtxo
  if(fillNonWitnessUtxo){
    const preTxRaw =
    paramPreTxRaw || (await getRawTx(input.hash, useNetworkStore().network))
  const preTx = btcjs.Transaction.fromHex(preTxRaw?.data ? preTxRaw.data : preTxRaw)
  const nonWitnessUtxo = preTx.toBuffer()
  
  input.nonWitnessUtxo = nonWitnessUtxo
  return input
  }else{
    return input
  }
 
}

export function determineAddressInfo(address: string): AddressInfo {
  const { bitcoin, testnet } = networks

  if (address.startsWith('bc1q')) {
    return {
      type: 'p2wpkh',
      network: bitcoin,
    }
  }
  if (address.startsWith('tb1q')) {
    return {
      type: 'p2wpkh',
      network: testnet,
    }
  }

  if (address.startsWith('bc1p')) {
    return {
      type: 'p2tr',
      network: bitcoin,
    }
  }

  if (address.startsWith('tb1p')) {
    return {
      type: 'p2tr',
      network: testnet,
    }
  }

  if (address.startsWith('1')) {
    return {
      type: 'p2pkh',
      network: bitcoin,
    }
  }
  if (address.startsWith('3') || address.startsWith('2')) {
    return {
      type: 'p2sh',
      network: bitcoin,
    }
  }
  if (address.startsWith('m') || address.startsWith('n')) {
    return {
      type: 'p2pkh',
      network: testnet,
    }
  }

  return {
    type: 'unknown',
    network: bitcoin,
  }
}

export function extractTxAndOutputIndex(output:string){
  if(!output){
    return ElMessage.error(`Invalid output`)
  }else{
   const result= output.split(':')
   return result
  }
}
 

export async function buildFillUtxoPsbt(pinid:string,salePrice:number,extraFee:{
  royaltyRateFee:number
  platformFee:number
}) {
  try {
    const bitcoinJs = useBtcJsStore().get!
    const network=useNetworkStore()
    const connectionStore=useConnectionStore()
    const psbt=new bitcoinJs.Psbt({ network: network.typedNetwork })
     psbt.setVersion(DefaultTxVersion)
    const address=connectionStore.userInfo.address
    
    
    let fakerInput1={
      hash:'aa4f6752bb40bd7699fdc6ae9a78dcb41a990c55b20070462c7771825d72fcec',
      index:1,
    }
    let fakerInput2={
      hash:'aa4f6752bb40bd7699fdc6ae9a78dcb41a990c55b20070462c7771825d72fcec',
      index:2,
    }

    let fakerInput3={
      hash:'aa4f6752bb40bd7699fdc6ae9a78dcb41a990c55b20070462c7771825d72fcec',
      index:3,
    }
    const utxoAddress=import.meta.env.VITE_UTXO_MANAGER_ADDRESS
    const utxoPubkey=import.meta.env.VITE_UTXO_MANAGER_PUBKEY
    await fillInputUtxo(fakerInput1, utxoAddress,DUMMY_UTXO_VALUE,false )
    await fillInputUtxo(fakerInput2, utxoAddress,DUMMY_UTXO_VALUE,false )
    fillInternalKeyForOtherAccount(fakerInput1,utxoAddress,utxoPubkey)
    fillInternalKeyForOtherAccount(fakerInput2,utxoAddress,utxoPubkey)
    psbt.addInput(fakerInput1)
    psbt.addInput(fakerInput2)
    psbt.addOutput({
    address:address,
    value: DUMMY_UTXO_OUTPUT_VALUE,
    })
    psbt.addOutput({
    address:address,
    value: DUST_UTXO_VALUE,
    })
    const pinInfo=await getPinfromPinidList({
      pinList:[pinid]
    })
    const nftUtxo= extractTxAndOutputIndex(pinInfo[pinid].output)
    console.log("pinInfo",pinInfo)
    const paymentInput={
      hash:nftUtxo[0],
      index:+nftUtxo[1],
      sighashType:SIGHASH_SINGLE_ANYONECANPAY
    }
    await fillInputUtxo(paymentInput,address,DUST_UTXO_VALUE)
    await fillInputUtxo(fakerInput3, utxoAddress,DUMMY_UTXO_OUTPUT_VALUE,false )
    fillInternalKey(paymentInput)
    fillInternalKeyForOtherAccount(fakerInput3,utxoAddress,utxoPubkey)
    psbt.addInput(paymentInput)
    psbt.addInput(fakerInput3)
    psbt.addOutput({
      address:address,
      value:salePrice
    })
    psbt.addOutput({
    address:address,
    value: DUMMY_UTXO_VALUE,
    })
    psbt.addOutput({
    address:address,
    value: DUMMY_UTXO_VALUE,
    })

    
   if(extraFee.platformFee){
    psbt.addOutput({
      address:import.meta.env.VITE_MRC721_PLATFORM_ADDRESS,
      value:extraFee.platformFee
    })
   }
   if(extraFee.royaltyRateFee){
    psbt.addOutput({
      address:pinInfo[pinid].creator,
      value:extraFee.royaltyRateFee
    })
   }
   console.log("psbt",psbt.data.inputs)
   
    return psbt
  } catch (err) {
    return ElMessage.error(`${(err as any).toString()}`)
  }
} 





