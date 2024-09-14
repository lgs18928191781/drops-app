import { defineStore } from 'pinia'
import { useUserStore } from './user'
import { DB } from '@/utils/db'
import { Mitt, MittEvent } from '@/utils/mitt'
import Decimal from 'decimal.js-light'
import {getMyCollectionList,getCollectionMintAmout} from '@/api/mrc721-api'
import { useConnectionStore } from './connection'

import {NftsLaunchPadChainSymbol} from '@/data/constants'
export const useGenesisStore = defineStore('genesis', {
  state: () =>
    <
      {
        list: Mrc721CollectionItem[]
        currentMetaId?: string
      }
    >{
      list: [],
    },
  getters: {
    getList: state => {
      return state.list
    },
  },
  actions: {
    add: function(genesis: Mrc721CollectionItem) {
      this.list.unshift(genesis)
      DB.genesis.add(genesis)
    },
    updateItem: function(genesis: Mrc721CollectionItem) {
      
      DB.genesis.update(genesis.name, genesis)
    },
    updateCurrentTotalSupply: function(params: { name: string; count: number }) {
      
      const index = this.list.findIndex(item => item.name === params.name)
      if (index !== -1) {
        this.list[index].currentSupply = new Decimal(this.list[index].currentSupply!)
          .add(params.count).sub(this.list[index].minted!)
          .toNumber()

        //  更新本地数据
        DB.genesis.update(params.name, this.list[index])
      }
    },
    sync:async function () {
      
      try {
        const userStore = useUserStore()
        const result= await getMyCollectionList({
          metaid:userStore.user!.metaId
        })
        if(result.code == 200 && result.data.result.length ){
         
          // if(this.list.length !== result.data.result.length ){
            
          // }
          //let genesislist:Mrc721CollectionItem[]=[]
        
          this.list.length=0
          for(let item of result.data.result){
            
            const mintRes= await getCollectionMintAmout({
              collectionPinid:item.collection_pinid
            })
            
            if(mintRes.code !== 200){
              
              break
            }
            const {data:{mintAmout,currentSupply}}=mintRes
            
            const collectionItem={
              totalSupply:item.total_supply,
              name:item.name,
              desc:item.nft_desc,
              cover:item.cover_pinid,
              website:item.website,
              royaltyRate:item.royalty_rate,
              metaData:item.meta_data,
              chain:item.chain == 'btc' ? NftsLaunchPadChainSymbol.btc : NftsLaunchPadChainSymbol.mvc,
              collectionPinId:item.collection_pinid,
              autoMarket:Boolean(item.auto_market),
              metaId:item.metaid,
              initialPrice:item.init_price,
              priceGrowth:item.price_growth,
              coverPinid:item.cover_pinid.replace('metafile://','') ,
              address:item.address,
              minted:mintAmout,
              currentSupply:currentSupply
            }
            this.add(collectionItem)
            // const index= this.list.findIndex((ele)=>{
            //   return ele.name == item.name
            // })
            // if(index > 0){
            
            // }else{
            //   this.updateItem(collectionItem)
            // }
            

          }

       
       
          
        }
      } catch (error) {
        
      }
      
      
     
      
      
    },
    initGenesis: async function() {
      const userStore = useUserStore()

      if (userStore.isAuthorized) {
        const genesisLlist = await DB.genesis
          .where('metaId')
          .equals(userStore.user!.metaId)
          .toArray()
        this.list = genesisLlist
      } else {
        this.list = []
      }
    },
  },
})
