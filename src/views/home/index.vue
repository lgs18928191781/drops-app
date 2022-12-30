<template>
  <div class="home-page-wrap">
    <div class="header">
      <div class="container flex flex-align-center">
        <div class="flex1">
          <div class="logo-wrap">
            <LogoVue />
          </div>
        </div>
        <div class="option-groud">
          <div class="menu-groud">
            <a v-for="(item, index) in linkGroud" :key="index">{{ item.name() }}</a>
          </div>

          <div class="dropDown-wrap">
            <el-dropdown trigger="click">
              <span class="el-dropdown-link">
                {{ currentSelectedLink() }}
                <el-icon class="el-icon--right">
                  <arrow-down />
                </el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item :command="link" v-for="(item, index) in linkGroud" :key="index">
                    <div class="nav-item">{{ item.name() }}</div>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>

          <div class="lang-wrap">
            <el-dropdown trigger="click">
              <span class="el-dropdown-link">
                {{ $i18n.locale.toUpperCase() }}
                <el-icon class="el-icon--right">
                  <arrow-down />
                </el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="SetLang('en')"
                    ><div class="lang-item">EN</div></el-dropdown-item
                  >
                  <el-dropdown-item @click="SetLang('zh')"
                    ><div class="lang-item">ZH</div></el-dropdown-item
                  >
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
          <div @click="toShow3" class="wallet-btn main-border primary connect-wallet">
            {{ i18n.t('connectWallet') }}
          </div>
        </div>
      </div>
    </div>
    <div class="main-body-wrap">
      <div class="page-one">
        <div class="container">
          <div class="top">
            <img :src="Grounp1" alt="" />
            <div class="content">
              <span class="title">{{ i18n.t('group1') }}</span>
              <span class="desc">{{ i18n.t('group1-desc') }}</span>
            </div>
          </div>
          <div class="foot-warp">
            <div class="foot">
              <div class="title">
                {{ i18n.t('group1-foot-title') }}
              </div>
              <div class="download-group">
                <div class="item main-border primary" v-for="item in downloadGroup">
                  <img :src="item.icon" alt="" />
                  <div class="right">
                    <span class="sm">{{ item.topText }}</span>
                    <span class="big">{{ item.footText }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="page-two">
        <div class="container">
          <div class="title">{{ i18n.t('page-two-title') }}</div>
          <div class="drsc">{{ i18n.t('Home.page-two-title-drsc') }}</div>
          <div class="content">
            <div class="left">
              <div class="item" v-for="item in records">
                <span>{{ item.amount }}</span>
                <span>{{ item.type() }}</span>
              </div>
            </div>
            <div class="right">
              <img :src="Group2" alt="" />
            </div>
          </div>
        </div>
      </div>
      <div class="page-three">
        <div class="container">
          <el-carousel :autoplay="false" arrow="always">
            <el-carousel-item v-for="(item, index) in swipers" :label="item.title()" :key="index">
              <img class="swiper-img" :src="item.icon" alt="" />
              <div class="swiper-right">
                <span>{{ item.title() }}</span>
                <span>{{ item.content() }}</span>
              </div>
            </el-carousel-item>
          </el-carousel>
        </div>
      </div>
      <div class="page-four">
        <img class="bg" src="@/assets/show/text.png" />
        <img class="bg1" src="@/assets/show/text1.png" />
        <div class="container">
          <el-carousel :autoplay="false" arrow="always">
            <el-carousel-item v-for="(item, index) in swipersTwo" :key="index">
              <div class="content">
                <span>{{ item.title() }}</span>
                <span>{{ item.desc() }}</span>
              </div>
              <img class="swiper-img" :src="item.icon" alt="" />
            </el-carousel-item>
          </el-carousel>
        </div>
      </div>
      <div class="page-five">
        <div class="container">
          <div class="top">
            <span>{{ i18n.t('metaso-title') }}</span>
            <span>{{ i18n.t('metaso-content') }}</span>
          </div>
          <div class="foot flex flex-align-start">
            <img :src="MetaSo" alt="" class="flex1" />
            <div class="right flex1">
              <span>{{ i18n.t('metaso-desc') }}</span>
              <div class="operate">
                <div class="main-border primary metaso-btn">
                  <span>{{ i18n.t('learnMetaSo') }}</span>
                  <!-- <el-icon><TopRight /></el-icon> -->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="container flex flex-align-center">
        <div class="left flex1">
          <LogoVue />
        </div>
        <div class="right">
          <a
            :href="item.link"
            target="_blank"
            class="item"
            v-for="(item, index) in contactIcon"
            :key="index"
          >
            <img :src="item.icon" alt="" />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import logo from '@/assets/images/logo.png'
import { useI18n } from 'vue-i18n'
import { ref, reactive } from 'vue'
import { ArrowDown, TopRight } from '@element-plus/icons-vue'
import Grounp1 from '@/assets/show/group.png'
import APPLE from '@/assets/show/apple.png'
import googlePlay from '@/assets/show/icon_googleplay.png'
import APK from '@/assets/show/APK.png'
import Group2 from '@/assets/show/group2.png'
import Swiper1 from '@/assets/show/swiper1.png'
import Swiper2 from '@/assets/show/swiper2.png'
import Swiper3 from '@/assets/show/swiper3.png'
import Swiper4 from '@/assets/show/swiper4.png'
import Swiper2_1 from '@/assets/show/swiper-2-1.png'
import Swiper2_2 from '@/assets/show/swiper-2-2.png'
import Swiper2_3 from '@/assets/show/swiper-2-3.png'
import MetaSo from '@/assets/show/metaso.png'
import footIcon1 from '@/assets/show/show.png'
import footIcon2 from '@/assets/show/foot-icon2.png'
import footIcon3 from '@/assets/show/foot-icon3.png'
import footIcon4 from '@/assets/show/foot-icon4.png'
import { useRouter } from 'vue-router'
import LogoVue from './Logo.vue'
import { useRootStore } from '@/stores/root'
import { SetLang } from '@/utils/util'

const i18n = useI18n()
const router = useRouter()
const rootStore = useRootStore()
const linkGroud = reactive([
  { name: () => i18n.t('Home.Learn') },
  { name: () => i18n.t('Home.White Paper') },
  { name: () => i18n.t('Home.MetaSo') },
])
const currentSelectedLink = () => i18n.t('Home.Menu')
const swipers = reactive([
  {
    icon: Swiper1,
    title: () => i18n.t('Home.Personalized NFT'),
    content: () => i18n.t('Home.Personalized NFT Drsc'),
  },
  {
    icon: Swiper2,
    title: () => i18n.t('Home.Avatar NFTs'),
    content: () => i18n.t('Home.Avatar NFTs Drsc'),
  },
  {
    icon: Swiper3,
    title: () => i18n.t('Home.Equipment NFTs'),
    content: () => i18n.t('Home.Equipment NFTs Drsc'),
  },
  {
    icon: Swiper4,
    title: () => i18n.t('Home.Utility NFTs'),
    content: () => i18n.t('Home.Utility NFTs Drsc'),
  },
])
const swipersTwo = reactive([
  {
    icon: Swiper2_1,
    title: () => i18n.t('Home.Web3 Social Timeline'),
    desc: () => i18n.t('Home.Web3 Social Timeline Drsc'),
  },
  {
    icon: Swiper2_2,
    title: () => i18n.t('Home.Web3 Clubs DAOs'),
    desc: () => i18n.t('Home.Web3 Clubs DAOs Drsc'),
  },
  {
    icon: Swiper2_3,
    title: () => i18n.t('Home.All Chains One Platform'),
    desc: () => i18n.t('Home.All Chains One Platform Drsc'),
  },
])
const contactIcon = reactive([
  {
    icon: footIcon1,
    link:
      'https://www.show3.io/talk/channels/74462f14a033849bf6067de63ad3d6c54edfa48ec1f2759e8ed8c6165b3f58b2/bc8c85d916cbe1582ae6ff5ded9220ac18301122a7167e45024f6483a59adaeb',
  },
  {
    icon: footIcon2,
    link: 'https://twitter.com/show3official',
  },
  {
    icon: footIcon3,
    link: 'https://t.me/showappoffcial',
  },
  {
    icon: footIcon4,
    link: 'mailto:marketing@show.sv',
  },
])
const records = reactive([
  {
    type: () => i18n.t('Home.Users'),
    amount: 126785,
  },
  {
    type: () => i18n.t('Home.Interactive'),
    amount: 24578,
  },
  {
    type: () => i18n.t('Home.Minted NFT'),
    amount: 34567,
  },
  {
    type: () => i18n.t('Home.Total Volume'),
    amount: 34892.68,
  },
])
const downloadGroup = reactive([
  {
    icon: APPLE,
    topText: 'Download on the',
    footText: 'App Store',
  },
  {
    icon: googlePlay,
    topText: 'GET IT ON',
    footText: 'Google Play',
  },
  {
    icon: APK,
    topText: 'Download on the',
    footText: 'Android APK',
  },
])

function toShow3() {
  router.push({ name: 'buzz' })
}
</script>

<style lang="scss" scoped src="./index.scss">
.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
</style>
