import { PsbtTxOutput, type Psbt, TxOutput } from 'bitcoinjs-lib'
import { useFeebStore } from '@/stores/feeb'
import { useConnectionStore } from '@/stores/connection'
import { isTaprootInput } from 'bitcoinjs-lib/src/psbt/bip371'
import {raise} from '@/utils/util'
import { Output } from 'bitcoinjs-lib/src/transaction'
import { useNetworkStore } from '@/stores/network'
import { useBtcJsStore } from '@/stores/btcjs'
import {toXOnly} from '@/hooks/btc-help'
import Decimal from 'decimal.js-light'
import {SIGHASH_ALL_ANYONECANPAY,DUST_UTXO_VALUE,MS_BRC20_UTXO_VALUE} from '@/data/constants'
type PsbtInput = (typeof Psbt.prototype.data.inputs)[0]
type PsbtInputExtended = PsbtInput & {
  hash: string
  index: number
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
  debugger
  const paymentUtxos = await connectionStore.provider?.btc.getUtxos({
    useUnconfirmed:true
  }).then((result) => {
    debugger
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
  })

  if (!paymentUtxos!.length) {
    raise(
      'You have no usable BTC UTXO. Please deposit more BTC into your address to receive additional UTXO. utxo',
    )
  }

  const networkStore = useNetworkStore()
  const btcjs = useBtcJsStore().get!
  const paymentPrevOutputScript = btcjs.address.toOutputScript(
    address,
    networkStore.typedNetwork,
  )
  console.log({ paymentUtxos })
  for (let i = 0; i < paymentUtxos!.length; i++) {
    const paymentUtxo = paymentUtxos![i]
    const paymentWitnessUtxo = {
      value: paymentUtxo.satoshis,
      script: paymentPrevOutputScript,
    }
    const toUseSighashType =
      i > 0 && otherSighashType ? otherSighashType : sighashType
    const paymentInput = {
      hash: paymentUtxo.txId,
      index: paymentUtxo.outputIndex,
      witnessUtxo: paymentWitnessUtxo,
      sighashType: toUseSighashType,
    }
    fillInternalKey(paymentInput)

    psbt.addInput(paymentInput)
    debugger
    // Add change output
    let fee = useSize
      ? Math.round(useSize * feeb)
      : calcFee(psbt, feeb, extraSize)
    let totalInput, totalOutput
    if (partialPay) {
      debugger
      // we only pay for the fee and some extra value, not the whole transaction
      totalOutput = 0
      // totalInput = the inputs we add in now
      totalInput = sumOrNaN(
        psbt.data.inputs
          .slice(cutFrom) // exclude the first input, which is the ordinal input
          .map(
            (input) =>
              input.witnessUtxo ||
              input.nonWitnessUtxo ||
              raise(
                'Input invalid. Please try again or contact customer service for assistance.',
              ),
          ) as any,
      )
    } else {
      // we pay for the whole transaction
      totalOutput = sumOrNaN(psbt.txOutputs)
      totalInput = sumOrNaN(
        psbt.data.inputs.map(
          (input) =>
            input.witnessUtxo ||
            input.nonWitnessUtxo ||
            raise(
              'Input invalid. Please try again or contact customer service for assistance.',
            ),
        ) as any,
      )
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
        address,
        value: safeOutputValue(changeValue),
      })
    } else {
      fee += safeOutputValue(changeValue)
    }
    console.log({ psbt })
    debugger
    return {
      psbt,
      fee,
      paymentValue: paymentUtxo.satoshis,
      feeb,
      changeValue,
    }
  }


}


function fillInternalKey<T extends PsbtInput | PsbtInputExtended>(
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
      Buffer.from( connectionStore.userInfo.pubkey, 'hex'),
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
