<template>
  <div class="nft-list-wrap ">
    <div class="nft-home-module">
        <div class="title ">
           
          🔥{{ $t('NFT.Hot Series') }}
        </div>
        <div class="cont">
          <span class="swiper-button-next hot-next flex flex-align-center flex-pack-center">
            <Icon name="down" color="#fff"  />
          </span>
          <span class="swiper-button-prev hot-prev flex flex-align-center flex-pack-center">
            <Icon name="down" color="#fff" />
          </span>
          <Swiper
            :autoHeight="false"
            :modules="[Pagination, Navigation, A11y]"
            :pagination="{ clickable: true }"
            :navigation="{
              nextEl: '.hot-next',
              prevEl: '.hot-prev',
            }"
            :autoplay="true"
            :loop="false"
            :slidesPerView="3"
            :spaceBetween="24"
            class="hot-collection"
          >
            <SwiperSlide
              v-for="(item, index) in hotList"
              :key="index"
              class="hot-collection-item cursor-pointer"
              @click="toCollection(item.collection_pinid)"
            >
              <div class="cover"></div>
              <Image class="collection-cover object-cover" :src="item.cover_pinid" />
              <!-- <div class="image">
                <img class="collection-cover" :src="banner" />
              </div> -->
              <div class="mt-7">
                <div class="name ">{{item.name}}</div>
              <div class="collection-info flex flex-row items-center mt-5">
                <div class="mr-3 ">
                  <UserAvatar
                  :address="item.collection_creator?.address"
                  customClass="w-[39px] h-[39px] rounded-full"
              :meta-id="item.collection_creator?.metaid"
              :image="item.collection_creator?.avatarId"
              :name="''"
              :meta-name="''"
            />
                  <!-- <Image class="w-[39px] h-[39px] rounded-full" :src="item.collection_creator?.avatarId" /> -->
                  <!-- <img class=" " :src="banner" alt=""> -->
                </div>
                <div class="flex flex-col ">
                  <span class="text-lg">{{  item.collection_creator?.name}}</span>
                  <span class="text-xs opacity-50 ">MetaID: {{ item.collection_creator?.metaid.slice(0,6) }}</span>
                </div>
              </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
     

    </div>
    <div class="notable-collections">
      <div class="title text-3xl">
        
        💫{{ $t('NFT.notable') }}
         </div>
         <div class="notable-item-wrap ">
          <div class="notable-item " v-for="item in notableList" @click="toCollection(item.collection_pinid)">
            <Image class="collection-cover  notable-cover " :src="item.cover_pinid" />
            <div class="mt-7">
                <div class="name ">{{ item.name }}</div>
              <div class="collection-info flex flex-row items-center mt-5">
                <div class="mr-3 ">
                  <UserAvatar
                  :address="item.collection_creator?.address"
                  customClass="w-[39px] h-[39px] rounded-full"
              :meta-id="item.collection_creator?.metaid"
              :image="item.collection_creator?.avatarId"
              :name="''"
              :meta-name="''"
            />
                </div>
                <div class="flex flex-col ">
                  <span class="text-lg">{{ item.collection_creator?.name }}</span>
                  <span class="text-xs opacity-50 ">MetaID: {{ item.collection_creator?.metaid.slice(0,6) }}</span>
                </div>
              </div>
              </div>
          </div>
         </div>


    </div>
  </div>
</template>
<script setup lang='ts'>
import { onMounted,reactive,ref,nextTick } from 'vue'
import { Pagination, Autoplay, Grid, Navigation, A11y } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/pagination'
import banner from '@/assets/images/login_img.png'
import {  getHotCollection,getNotableCollection} from "@/api/mrc721-api";
import {useMetaIDEntity} from '@/hooks/use-metaid-entity'
import { router } from '@/router'

const hotList:NftsCollection[]=reactive([])
const notableList:NftsCollection[]=reactive([])
const {getUserAllInfo}=useMetaIDEntity()

async function getDataList(isCover:boolean=false){
  const res= await Promise.all([getHotCollection({rank:6}),getNotableCollection({rank:16})])
  if(res.length && isCover){
    if(res[0].code == 200 ){
        if(res[0].data.length){
          for(let item of res[0].data){
            const creatorInfo=await getUserAllInfo(item.address)
            hotList.push({
              ...item,
              collection_creator:creatorInfo
            })
          }
        }
        console.log("hotList",hotList)
        

    }

    if(res[1].code == 200 ){
        if(res[1].data.length){
          for(let item of res[1].data){
            
            const creatorInfo=await getUserAllInfo(item.address)
            notableList.push({
              ...item,
              collection_creator:creatorInfo
            })
          }
        }


    }


  }



}

function toCollection(collectionPinId:string){
  router.push({
    name: 'nftCollectionDetail',
    params: { topicType:collectionPinId },
  })
}


getDataList(true)

onMounted(()=>{

})
// onMounted( ()=>{
//     nextTick(()=>{
     
//     })
// })

</script>
<style lang='scss' scoped src="./NFTlist.scss">

</style>