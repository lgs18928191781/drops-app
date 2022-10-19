<template>
  <div class="collapse-contanier">
    <div class="applicateName">{{ $t('applicateName') }}</div>
    <div class="collapse-wrapper">
      <el-collapse accordion v-model="activeNames">
        <el-collapse-item :name="index + 1" v-for="(item, index) in collsapseItem">
          <template #title>
            <div class="item" v-if="item.child.length">
              <img :src="item.icon" alt="" />
              <span :class="item.isActive ? 'isActive' : ''">{{ item.title }}</span>
            </div>
            <div v-else class="item" @click.stop="toLink(item.hrefUrl)">
              <img :src="item.icon" alt="" />
              <span>{{ item.title }}</span>
            </div>
          </template>
          <template v-if="item.child.length">
            <div
              class="child-item"
              v-for="(ele, id) in item.child"
              @click.stop="toLink(ele.hrefUrl)"
            >
              <img :src="ele.icon" alt="" />
              <span>{{ ele.title }}</span>
            </div>
          </template>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { CaretBottom } from '@element-plus/icons-vue'
import buzz_icon from '@/assets/images/buzz_icon(1).svg?url'
import buzz_icon1 from '@/assets/images/buzz_icon(2).svg?url'
import writings_icon from '@/assets/images/writings_icon(1).svg?url'
import writings_icon1 from '@/assets/images/writings_icon(2).svg?url'
import moment_icon from '@/assets/images/moment_icon(1).svg?url'
import moment_icon1 from '@/assets/images/moment_icon(2).svg?url'
import talk_icon from '@/assets/images/talk_icon(1).svg?url'
import talk_icon1 from '@/assets/images/talk_icon(2).svg?url'
import NFT_icon from '@/assets/images/NFT_icon(1).svg?url'
import NFT_icon1 from '@/assets/images/NFT_icon(2).svg?url'
import metadisk from '@/assets/images/metadisk_icon(1).svg?url'
import metadisk1 from '@/assets/images/metadisk_icon(2).svg?url'
import BuzzBit from '@/assets/images/buzzbit.png'
import NOS from '@/assets/images/NOS.png'
import XSKY from '@/assets/images/xshy.png'
const activeNames = ref([0])

// const handleChange = (val: string[]) => {

//   val.forEach(item => {
//     console.log('aaa')
//     collsapseItem.forEach(val => {
//       if (+item == val.id) {
//         val.icon = val?.activeIcon
//         val.isActive = true
//       } else {
//         val.icon = val.defaultIcon
//         val.isActive = false
//       }
//     })
//   })
// }
const collsapseItem = reactive([
  {
    id: 1,
    title: 'Buzz',
    icon: buzz_icon,
    defaultIcon: buzz_icon,
    activeIcon: buzz_icon1,
    isActive: false,
    child: [
      {
        icon: BuzzBit,
        title: 'BuzzBit',
        hrefUrl: `${import.meta.env.VITE_BuzzBitUrl}`,
      },
    ],
    hrefUrl: '',
  },
  {
    id: 2,
    title: '文章',
    icon: writings_icon,
    defaultIcon: writings_icon,
    activeIcon: writings_icon1,
    isActive: false,
    child: [],
    hrefUrl: `${import.meta.env.VITE_MetaNoteUrl}`,
  },
  {
    id: 3,
    title: '媒体',
    icon: moment_icon,
    defaultIcon: moment_icon,
    activeIcon: moment_icon1,
    isActive: false,
    child: [],
    hrefUrl: `${import.meta.env.VITE_ShowMomentUrl}`,
  },
  {
    id: 4,
    title: '聊天',
    icon: talk_icon,
    defaultIcon: talk_icon,
    activeIcon: talk_icon1,
    isActive: false,
    child: [],
    hrefUrl: `${import.meta.env.VITE_ShowTalkUrl}`,
  },
  {
    id: 5,
    title: 'NFT',
    icon: NFT_icon,
    defaultIcon: NFT_icon,
    activeIcon: NFT_icon1,
    isActive: false,
    child: [
      {
        icon: NOS,
        title: 'NOS',
        hrefUrl: `${import.meta.env.VITE_NosUrl}`,
      },
      {
        icon: XSKY,
        title: 'NFTXSKY',
        hrefUrl: `${import.meta.env.VITE_NfTXSkyUrl}`,
      },
    ],
    hrefUrl: '',
  },
  {
    id: 6,
    title: '网盘',
    icon: metadisk,
    defaultIcon: metadisk,
    activeIcon: metadisk1,
    isActive: false,
    child: [],
    hrefUrl: `${import.meta.env.VITE_MetaDiskUrl}`,
  },
])

function toLink(url: any) {
  if (url) {
    window.open(`${url}`, 'blank')
  }
}

function stopBubbling(event: Event) {
  event.stopPropagation()
}
</script>

<style lang="scss" src="./collapse-item.scss"></style>
