import { defineStore } from 'pinia'
import { useLocalStorage, type RemovableRef } from '@vueuse/core'
import { ElMessage } from 'element-plus'
import * as metaletAdapter from '@/utils/metalet'
import { Network, useNetworkStore } from './network'
//import type { Psbt } from 'bitcoinjs-lib'
import {  btcConnect,mvcConnect,MetaletWalletForBtc,IBtcConnector,MetaletWalletForMvc } from '@metaid/metaid'


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

export const isUnsupportedAddress = (address: string) => {
  const networkStore=useNetworkStore()
  const isLegacyOrScript =
    address.startsWith('1') ||
    address.startsWith('3') ||
    address.startsWith('m') ||
    address.startsWith('n')
  // 

  const isIncompatibleNetwork =
  networkStore.network === 'testnet' ? address.startsWith('bc') : address.startsWith('tb')

  return isLegacyOrScript || isIncompatibleNetwork
}


export type WalletConnectionBaseType={ 
    _isConnected:boolean,
    metaid:string,
    // pubkey:string
    wallet:MetaletWalletForBtc['internal']
    // address:string
    user:BaseUserInfo,
   
    network?:Network,
  
  }

export type PickBtcConnector=Pick<IBtcConnector & 'metaid','createMetaid' | 'getMetaid' | 'getUser' | 'hasMetaid' | 'hasUser' | 'disconnect' | 'inscribe' | 'isConnected' | 'load' | 'updateUserInfo' | 'use'>

export type WalletConnection=WalletConnectionBaseType & PickBtcConnector 
export enum ConnectChain{
  mvc='mvc',
  btc='btc'
}

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
          metaid:'',
          user:{
          
          },
          
          network: 'testnet'
        } as WalletConnection,
        userInfo: useLocalStorage('last-connection', {
         address:'',
         pubkey:'',
         metaid:'',
        }
      ),
      currentChain: useLocalStorage('last-chain','btc')
      }
    },
  
    getters: {
    
      has: (state) => !!state.last,
      connected: (state) =>
        state.last._isConnected && !!state.userInfo.address,
      getAddress: (state) => {
        return state.userInfo.address
      },
      isTaproot: (state) =>
        state.userInfo.address.startsWith('bc1p') ||
        state.userInfo.address.startsWith('tb1p'),
      // getPubKey: (state) => state.last.pubKey,
      provider: (state) => {
        if (!state.last) return null
        return getWalletProvider()
      },
      adapter: (state) => {
        if (!state.last) throw new Error('No connection')
  
        const adapter: {
          initPsbt: () => any//Psbt
          getMvcBalance: () => Promise<any>
          getMvcAddress: () => Promise<string>
  
          finishPsbt: (psbt: string) => string
          getAddress: () => Promise<string>
  
          signMvcMessage: (message: any) => Promise<any>
          getMvcPublickey: () => Promise<string>
          getPubKey: () => Promise<string>
          connect: (network: Network) => Promise<{
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
      async connect(chain=ConnectChain.btc) {
        let connection = this.last
          ? this.last 
          : {
            _isConnected: false,
              metaid:'',
              wallet:{},
              user:{},
              network:''
              
            }
        const networkStore = useNetworkStore()
        
        let connectRes
        let pubkey
       
        if(chain == ConnectChain.btc ){
         const _wallet:MetaletWalletForBtc['internal'] =await MetaletWalletForBtc.create()
       
          connectRes = await btcConnect({
            wallet:_wallet,
            network:networkStore.network
          })
        }else{
          const _wallet =await MetaletWalletForMvc.create()
          connectRes = await mvcConnect(_wallet)
        }
      
       
        try {
          if (connectRes) {
            // check if network suits app's current environment;
            // if not, call switchNetwork
            
            const appNetwork = networkStore.network
            const metaNetwork = await getWalletAdapter().getNetwork()
            if (metaNetwork !== appNetwork) {
              
              await getWalletAdapter().switchNetwork(appNetwork)

              // re-connect to get new address
              connectRes = await getWalletAdapter().connect(appNetwork)
            }
            console.log("connectRes",connectRes)
         
            pubkey=chain == ConnectChain.btc ?  await getWalletAdapter().getPubKey() : await getWalletAdapter().getMvcPublickey()
            
            
            this.last = connectRes
            this.userInfo.metaid=connectRes.metaid
            this.userInfo.address=connectRes.address
            this.userInfo.pubkey=pubkey
            this.currentChain=chain
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
          metaid:'',
          user:{},
          network: 'livenet'
        }
       this.userInfo={
        address:'',
        pubkey:'',
        metaid:'',
       }
        // this.last._isConnected = false
        // this.last.address = ''
        // this.last.wallet = {}
        // this.last.pubkey=''
        // this.last.network=''
        // this.last.metaid=''

      },

      updateUser(newInfo:Partial<BaseUserInfo>){
        this.last.user={...this.last.user,...newInfo}
      },
      changeChain(chain:ConnectChain){
        this.currentChain = chain 
      },

      async sync(){
        
      
      //if(!this.last._isConnected) return
      // const providerAddress= await window.metaidwallet.btc.getAddress()
      // if(isUnsupportedAddress(providerAddress)){
       
      //   ElMessage.error( 'Please use a native SegWit or Taproot or Legacy address (Starts with tb1 or n )',)
      // }

    if(!this.userInfo.address) return
        
        let connectRes
        let xpub

        if(this.currentChain == ConnectChain.btc){
         const _wallet = await MetaletWalletForBtc.restore({
            address:this.userInfo.address,
            pub:this.userInfo.pubkey
           })
          
    
           connectRes= await btcConnect({
              wallet:_wallet,
              network:this.last.network!
            })
        }else{
           xpub=await getWalletAdapter().getXPublicKey()
          const _wallet = await MetaletWalletForMvc.restore({
            address:this.userInfo.address,
            xpub:xpub
           })
          
    
           connectRes= await mvcConnect(_wallet)
        }
    
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
              connectRes = await getWalletAdapter().connect(appNetwork)
            }
            console.log("connectRes",connectRes)
            
            const pubkey=await getWalletAdapter().getPubKey()
            
            this.last=connectRes
            this.userInfo.metaid=connectRes.metaid
            this.userInfo.pubkey=pubkey
            this.userInfo.address=connectRes.address
            
          }
        } catch (e: any) {
         return ElMessage.error(e.message)
        }
      }
    },
  })