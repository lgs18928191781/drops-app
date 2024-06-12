import { defineStore } from 'pinia'
import { useLocalStorage, type RemovableRef } from '@vueuse/core'
import { ElMessage } from 'element-plus'
import {type FeebPlan,getFeebPlans} from '@/api/btc-fee'
import { useConnectionStore, ConnectChain } from '@/stores/connection'
 export const useFeebStore = defineStore('feeb', {
    state: () => {
      return {
        last: useLocalStorage('last-feeb', {
            currentFeeb:{
                title: 'Fast',
                feeRate: 0,
            },
            feeRateList:[
                {
                    title: 'Eco',
                    fullTitle: 'Economy',
                    feeRate: 1,
                    
                  },
                  {
                    title: 'Slow',
                    feeRate: 1,
                  },
                  {
                    title: 'Avg',
                    feeRate:1,
                  },
                  {
                    title: 'Fast',
                    feeRate:1,
                  },
            ]
        } as {currentFeeb:FeebPlan,feeRateList:FeebPlan[]} ),
      }
    },
  
    getters: {

      get: (state) => !!state.last,
      
      
    },
  
    actions: {
        async set(feeType:'Eco' | 'Slow' | 'Avg' | 'Fast' | 'Custom',customFeeb?:number){
            const connectionStore=useConnectionStore()
           if(feeType == 'Custom'){
            this.last.currentFeeb={
                feeRate:customFeeb!,
                title:'Custom'
            }
           }else if(connectionStore.userInfo.currentChain && connectionStore.userInfo.currentChain == ConnectChain.mvc){
            this.last.currentFeeb={
              title: 'Fast',
              feeRate: 1,
            }

           }else{
            this.last.currentFeeb={
              title: 'Fast',
              feeRate: 1,
            }
            return
            const feeList=await getFeebPlans()
            
            this.last.feeRateList=feeList
            const selectFeeb=feeList.filter((item)=>{
                return item.title == feeType
               })
               this.last.currentFeeb=selectFeeb[0]
           }
           

        },
        
        async update(){
          const connectionStore=useConnectionStore()
          if(connectionStore.userInfo.currentChain && connectionStore.userInfo.currentChain == ConnectChain.mvc){
            return
          }else{
            const feeList= await getFeebPlans()
            this.last.feeRateList=feeList
            const selectFeeb=feeList.filter((item)=>{
              return item.title == this.last.currentFeeb.title
             })
             this.last.currentFeeb=selectFeeb[0]
          }
           
        }
  

     
    },
  })