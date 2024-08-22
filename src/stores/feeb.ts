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
                    feeRate: 3,
                    
                  },
                  {
                    title: 'Slow',
                    feeRate: 3,
                  },
                  {
                    title: 'Avg',
                    feeRate:3,
                  },
                  {
                    title: 'Fast',
                    feeRate:3,
                  },
            ]
        } as {currentFeeb:FeebPlan,feeRateList:FeebPlan[]} ),
      }
    },
  
    getters: {

      get: (state) => !!state.last,
      
      getCurrentFeeb:(state)=>{
        if(state.last.currentFeeb.feeRate <=1){
          return 3
        }else return state.last.currentFeeb.feeRate
      }
      
    },
  
    actions: {
        async set(feeType:'Eco' | 'Slow' | 'Avg' | 'Fast' | 'Custom',customFeeb?:number){
          
            const connectionStore=useConnectionStore()
           if(feeType == 'Custom'){
            this.last.currentFeeb={
                feeRate:customFeeb!,
                title:'Custom'
            }
           }else if(connectionStore.currentChain && connectionStore.currentChain == ConnectChain.mvc){
            this.last.currentFeeb={
              title: 'Fast',
              feeRate: 3,
            }

           }else if(connectionStore.currentChain == ConnectChain.btc){
            
            
            let feeList=await getFeebPlans()
            
            
            this.last.feeRateList=feeList
            const selectFeeb=feeList.filter((item)=>{
                return item.title == feeType
               })
               this.last.currentFeeb=selectFeeb[0]
           }else{
            this.last.currentFeeb={
              title: 'Fast',
              feeRate: 3,
            }
           }
           

        },
        
        async update(){
          const connectionStore=useConnectionStore()
          if(connectionStore.currentChain && connectionStore.currentChain == ConnectChain.mvc){
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