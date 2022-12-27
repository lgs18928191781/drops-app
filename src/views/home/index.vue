<template>
  <div class="home-page-wrap">
    <div class="header">
      <div class="logo-wrap">
        <img :src="logo" alt="" />
      </div>
      <div class="option-groud">
        <div class="menu-groud">
          <a v-for="link in linkGroud">{{ link }}</a>
        </div>

        <div class="dropDown-wrap">
          <el-dropdown trigger="click" @command="handleCommand">
            <span class="el-dropdown-link">
              {{ currentSelectedLink }}
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item :command="link" v-for="link in linkGroud">{{
                  link
                }}</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>

        <div class="lang-wrap">
          <el-dropdown trigger="click" @command="toggleLang">
            <span class="el-dropdown-link">
              {{ currentLang }}
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="EN">EN</el-dropdown-item>
                <el-dropdown-item command="CN">CN</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <div @click="toShow3" class="wallet-btn main-border primary connect-wallet">
          {{ i18n.t('connectWallet') }}
        </div>
      </div>
    </div>
    <div class="main-body-wrap">
      <div class="page-one">
        <div class="top">
          <img :src="Grounp1" alt="" />
          <div class="content">
            <span class="title">{{ i18n.t('group1') }}</span>
            <span class="desc">{{ i18n.t('group1-desc') }}</span>
          </div>
          <div class="foot">
            <div class="title">
              {{ i18n.t('group1-foot-title') }}
            </div>
            <div class="download-group">
              <div class="item main-border primary" v-for="item in downloadGroup">
                <img :src="item.icon" alt="" />
                <div class="right">
                  <span>{{ item.topText }}</span>
                  <span>{{ item.footText }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="page-two">
        <div class="title">{{ i18n.t('page-two-title') }}</div>
        <div class="content">
          <div class="left">
            <div class="item" v-for="item in records">
              <span>{{ item.amount }}</span>
              <span>{{ item.type }}</span>
            </div>
          </div>
          <div class="right">
            <img :src="Group2" alt="" />
          </div>
        </div>
      </div>
      <div class="page-three">
        <el-carousel :autoplay="false" arrow="always">
          <el-carousel-item :label="item.title" v-for="item in swipers" :key="item">
            <img class="swiper-img" :src="item.icon" alt="" />
            <div class="swiper-right">
              <span>{{ item.title }}</span>
              <span>{{ item.content }}</span>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
      <div class="page-four">
        <el-carousel :autoplay="false" arrow="always">
          <el-carousel-item v-for="item in swipersTwo" :key="item">
            <div class="content">
              <span>{{ item.title }}</span>
              <span>{{ item.desc }}</span>
            </div>
            <img class="swiper-img" :src="item.icon" alt="" />
          </el-carousel-item>
        </el-carousel>
      </div>
      <div class="page-five">
        <div class="top">
          <span>{{ i18n.t('metaso-title') }}</span>
          <span>{{ i18n.t('metaso-content') }}</span>
        </div>
        <div class="foot">
          <img :src="MetaSo" alt="" />
          <div class="right">
            <span>{{ i18n.t('metaso-desc') }}</span>
            <div class="main-border primary metaso-btn">
              <span>{{ i18n.t('learnMetaSo') }}</span>
              <el-icon><TopRight /></el-icon>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="left">
        <img :src="logo" alt="" />
      </div>
      <div class="right">
        <div class="item" v-for="item in contactIcon">
          <img :src="item.icon" alt="" />
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
import footIcon1 from '@/assets/show/foot-icon1.png'
import footIcon2 from '@/assets/show/foot-icon2.png'
import footIcon3 from '@/assets/show/foot-icon3.png'
import footIcon4 from '@/assets/show/foot-icon4.png'
import { useRouter } from 'vue-router'
const i18n = useI18n()
const router = useRouter()
const linkGroud = reactive(['Learn', 'White Paper', 'MetaSo'])
const currentSelectedLink = ref('Learn')
const currentLang = ref('EN')
const swipers = reactive([
  {
    icon: Swiper1,

    title: 'Personality NFTs',
    content: `Personalized NFT expresses your personality and social status.Sometimes a personalized NFTs can give you special social features that other users don’t have.`,
  },
  {
    icon: Swiper2,
    title: 'Avatar NFTs',
    content: `Avatar NFT is your virtual image in the world of Web3.Cultivate, Play, and Earn with your avatars!`,
  },
  {
    icon: Swiper3,
    title: 'Equipment NFTs',
    content: `It contains 4 special kinds of NFT used to decorate your Avatar, including Background, Costumes, Pet and Treasure. They provide different Attribute Bonuses to your Avatar and makes it extraordinary.`,
  },
  {
    icon: Swiper4,
    title: 'Functional NFTs',
    content: `Unlock advanced features by holding Utility NFTs!More categories like Domain Name NFT and DAO Pass are coming!`,
  },
])
const swipersTwo = reactive([
  {
    icon: Swiper2_1,
    title: 'Web3 Social Timeline',
    desc: `See what’s happening on chain!`,
  },
  {
    icon: Swiper2_2,
    title: 'Web3 Clubs & DAOs',
    desc: `Discover & Join Your Favorite Web3 Communities`,
  },
  {
    icon: Swiper2_3,
    title: 'All Chains, One Platform',
    desc: `Support multiple blockchains at the same time.`,
  },
])
const contactIcon = reactive([
  {
    icon: footIcon1,
  },
  {
    icon: footIcon2,
  },
  {
    icon: footIcon3,
  },
  {
    icon: footIcon4,
  },
])
const records = reactive([
  {
    type: 'Users',
    amount: 126785,
  },
  {
    type: 'Interactive(Number of Transactions)',
    amount: 24578,
  },
  {
    type: 'Minted NFT',
    amount: 34567,
  },
  {
    type: 'Total Volume',
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

function handleCommand(command: string) {
  console.log('command', command)
  currentSelectedLink.value = command
}

function toggleLang(command: string) {
  currentLang.value = command
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
