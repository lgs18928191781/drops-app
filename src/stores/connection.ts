import { defineStore } from 'pinia'
import { useLocalStorage, type RemovableRef } from '@vueuse/core'
import { ElMessage } from 'element-plus'
import * as metaletAdapter from '@/utils/metalet'
import { Network, useNetworkStore } from './network'
import type { Psbt } from 'bitcoinjs-lib'
import {  btcConnect,MetaletWalletForBtc,IBtcConnector } from '@metaid/metaid'

type BaseUserInfo={
      address:string
      avatar:string
      avatarId:string
      bio:string
      bioId:string
      isInit:boolean
      metaid:string
      name:string
      nameId:string
      number:number
      rootTxId:string
      soulbondToken:string
      unconfirmed:string
}

export type WalletConnectionBaseType={ 
    _isConnected:boolean,
    metaid:string,
    pubkey:string
    wallet:MetaletWalletForBtc['internal']
    address:string
    user:BaseUserInfo,
    network?:Network
  }

export type PickBtcConnector=Pick<IBtcConnector,'createMetaid' | 'getMetaid' | 'getUser' | 'hasMetaid' | 'hasUser' | 'disconnect' | 'inscribe' | 'isConnected' | 'load' | 'updateUserInfo' | 'use'>

export type WalletConnection=WalletConnectionBaseType & PickBtcConnector

  function getWalletProvider() {
    return window.metaidwallet
  }

  function getWalletAdapter(){
    return metaletAdapter
  }


  export const useConnectionStore = defineStore('connection', {
    state: () => {
      return {
        last: useLocalStorage('last-connection', {
          wallet: {},
          _isConnected: false,
          address: '',
          pubkey: '',
          metaid:'',
          user:{},
          network: 'testnet'
        } as WalletConnection) as RemovableRef<WalletConnection>  ,
      }
    },
  
    getters: {
      has: (state) => !!state.last,
      connected: (state) =>
        state.last._isConnected && !!state.last.address,
      getAddress: (state) => {
        return state.last.address
      },
      isTaproot: (state) =>
        state.last.address.startsWith('bc1p') ||
        state.last.address.startsWith('tb1p'),
      // getPubKey: (state) => state.last.pubKey,
      provider: (state) => {
        if (!state.last) return null
        return getWalletProvider()
      },
      adapter: (state) => {
        if (!state.last) throw new Error('No connection')
  
        const adapter: {
          initPsbt: () => Psbt
          getMvcBalance: () => Promise<any>
          getMvcAddress: () => Promise<string>
  
          finishPsbt: (psbt: string) => string
          getAddress: () => Promise<string>
  
          signMvcMessage: (message: any) => Promise<any>
          getMvcPublickey: () => Promise<string>
          getPubKey: () => Promise<string>
          connect: () => Promise<{
            address: string
            
          }>
          metaletConnect?: () => Promise<{
            address: string
            
          }>
          disconnect: () => Promise<void>
          getBalance: () => Promise<number>
          inscribe: (tick: string) => Promise<string | undefined>
          signPsbt: (psbt: string, options?: any) => Promise<string>
          signPsbts: (psbts: string[], options?: any) => Promise<string[]>
          pushPsbt: (psbt: string) => Promise<string>
          signMessage: (message: string) => Promise<string>
          getNetwork: () => Promise<Network>
          switchNetwork: (
            network: 'livenet' | 'testnet' | 'regtest',
          ) => Promise<'livenet' | 'testnet' | 'regtest'>
        } = getWalletAdapter()
  
        return adapter
      },
      
    },
  
    actions: {
      async connect() {
        let connection = this.last
          ? (JSON.parse(JSON.stringify(this.last)) )
          : {
            _isConnected: false,
              address: '',
              pubkey:'',
              wallet:{},
              network:''
            }
        const networkStore = useNetworkStore()
        let _wallet:MetaletWalletForBtc['internal']=await MetaletWalletForBtc.create()
        let connectRes = await btcConnect({
          wallet:_wallet,
          network:networkStore.network
        })
            
        try {
          if (connectRes) {
            // check if network suits app's current environment;
            // if not, call switchNetwork
            
            const appNetwork = networkStore.network
            const metaNetwork = await getWalletAdapter().getNetwork()
            if (metaNetwork !== appNetwork) {
              
              await getWalletAdapter().switchNetwork(appNetwork)

              // re-connect to get new address
              connectRes = await getWalletAdapter().connect()
            }
            const pubkey=await getWalletAdapter().getPubKey()
            connection=connectRes
            connection.pubkey=pubkey
            this.last = connection
            return this.last
          }
        } catch (e: any) {
          ElMessage.error(e.message)
          connection._isConnected = false
          this.last = connection
        }
  
        return this.last
      },
  
      async disconnect() {
        if (!this.last) return
        this.last= {
          wallet: {},
          _isConnected: false,
          address: '',
          pubkey: '',
          metaid:'',
          user:{},
          network: 'testnet'
        }
        // this.last._isConnected = false
        // this.last.address = ''
        // this.last.wallet = {}
        // this.last.pubkey=''
        // this.last.network=''
        // this.last.metaid=''

      },
    },
  })