import { defineStore } from 'pinia'
import { useLocalStorage, type RemovableRef } from '@vueuse/core'
import { ElMessage } from 'element-plus'
import * as metaletAdapter from '@/utils/metalet'
import { Network, useNetworkStore } from './network'
import type { Psbt } from 'bitcoinjs-lib'
import {  btcConnect,MetaletWalletForBtc,IBtcConnector } from '@metaid/metaid'
import { object } from 'yup'

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

export type PickBtcConnector=Pick<IBtcConnector & 'metaid','createMetaid' | 'getMetaid' | 'getUser' | 'hasMetaid' | 'hasUser' | 'disconnect' | 'inscribe' | 'isConnected' | 'load' | 'updateUserInfo' | 'use'>

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
        last:{
          wallet: {},
          _isConnected: false,
          address: '',
          pubkey: '',
          metaid:'',
          user:{
           
          },
          network: 'testnet'
        } as WalletConnection,
        userInfo: useLocalStorage('last-connection', {
         address:'',
         pubkey:''
        } )   ,
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
          ? this.last 
          : {
            _isConnected: false,
              address: '',
              pubkey:'',
              wallet:{},
              user:{},
              metaid:'',
              network:''
            }
        const networkStore = useNetworkStore()
          
        let _wallet:MetaletWalletForBtc['internal'] =await MetaletWalletForBtc.create()
       
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
            console.log("connectRes",connectRes)
         
            const pubkey=await getWalletAdapter().getPubKey()
            
            connection=Object.assign(connectRes,{
              metaid:connectRes.user.metaid,
              pubkey:pubkey,
              _isConnected:true
            })
            
            
            this.last = connection
            this.userInfo.address=connectRes.user.address
            this.userInfo.pubkey=pubkey
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

      async sync(){
      
      if(!this.last._isConnected) return

      const _wallet= await MetaletWalletForBtc.restore({
        address:this.userInfo.address,
        pub:this.userInfo.pubkey
       })
        let connectRes = await btcConnect({
          wallet:_wallet,
          network:this.last.network!
        })
        const networkStore = useNetworkStore()
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
            console.log("connectRes",connectRes)
         
            const pubkey=await getWalletAdapter().getPubKey()
            
            this.last=Object.assign(connectRes,{
              metaid:connectRes.user.metaid,
              pubkey:pubkey,
              _isConnected:true
            })
            
          }
        } catch (e: any) {
          ElMessage.error(e.message)
          if(!this.last._isConnected){
            this.last= {
              wallet: {},
              _isConnected: false,
              address: '',
              pubkey: '',
              metaid:'',
              user:{},
              network: 'testnet'
            }
          }
          
        }
      }
    },
  })