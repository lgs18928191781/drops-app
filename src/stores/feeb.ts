import { defineStore } from 'pinia'
import { useLocalStorage, type RemovableRef } from '@vueuse/core'
import { ElMessage } from 'element-plus'
import {type FeebPlan,getFeebPlans} from '@/api/btc-fee'
 export const useFeebStore = defineStore('feeb', {
    state: () => {
      return {
        last: useLocalStorage('last-feeb', {
            currentFeeb:{
                title: 'Fast',
                feeRate: 0,
            }
        } as {currentFeeb:FeebPlan} ),
      }
    },
  
    getters: {
    
      
      
    },
  
    actions: {
        async set(feeType:'Eco' | 'Slow' | 'Avg' | 'Fast' | 'Custom',customFeeb?:number){
            
           if(feeType == 'Custom'){
            this.last.currentFeeb={
                feeRate:customFeeb!,
                title:'Custom'
            }
           }else{
            const feeList=await getFeebPlans()
            const selectFeeb=feeList.filter((item)=>{
                return item.title == feeType
               })
               this.last.currentFeeb=selectFeeb[0]
           }
           

        },
        
        async get(){
            return await getFeebPlans()
        }
  

     
    },
  })