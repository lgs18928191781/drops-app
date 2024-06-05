<template>
  <div class="metaname-index">
    <div class="module1 flex flex-align-center flex-pack-center module">
      <div class="metaname-container">
        <div class="title" v-html="$t('MetaName.IndexTitle1')"></div>
        <div class="drsc">{{ $t('MetaName.IndexDrsc1') }}</div>
        <div class="tag">
          <a href="https://www.metaid.io/" target="_blank">
            <PlainBtn class="tag-warp">
              <Icon name="meta" />
            </PlainBtn>
          </a>
        </div>
        <PlainBtn class="search">
          <SearchWarp
            @submit="
              val =>
                $router.push({
                  name: 'metaNameSearchIndex',
                  query: {
                    metaName: val,
                  },
                })
            "
          />
        </PlainBtn>
        <div class="validateText" v-if="MetaNameNotIllgel">{{ $t('inputMetaNameIllgel') }}</div>
      </div>
    </div>

    <div class="module2 flex flex-align-center flex-pack-center module">
      <div class="metaname-container">
        <div class="bg"></div>
        <div class="content">
          <div class="title">{{ $t('MetaName.IndexTitle2') }}</div>
          <div class="drsc">{{ $t('MetaName.IndexDrsc2') }}</div>
          <div class="drsc2">{{ $t('MetaName.IndexIntro2') }}</div>
          <!-- <div class="wallets flex flex-align-center flex-pack-center">
            <div
              class="wallet flex flex-align-center"
              v-for="(item, index) in wallets"
              :key="index"
            >
              <img :src="item.icon" class="logo" />
              {{ item.name }}
            </div>
          </div> -->
          <img class="cover" src="@/assets/metaname/module2.png" />
        </div>
      </div>
    </div>

    <div class="module4 flex flex-align-center flex-pack-center module">
      <div class="metaname-container">
        <div class="bg"></div>
        <div class="content">
          <div class="title">{{ $t('MetaName.IndexTitle4') }}</div>
          <div class="drsc">{{ $t('MetaName.IndexDrsc4') }}</div>
          <div class="drsc2">{{ $t('MetaName.IndexIntro4') }}</div>
          <!-- <div class="hover flex flex-align-center flex-pack-center">
            <a
              href="https://metaid-1.gitbook.io/metaname/zhu-ce-he-shi-yong-metaname/guan-li-metaname"
              target="_blank"
              class="flex flex-align-center"
              >{{ $t('MetaName.IndexHover4') }} <Icon name="down"
            /></a>
          </div> -->
          <img class="cover" src="@/assets/metaname/module4.png" />
        </div>
      </div>
    </div>

    <div class="module3 flex flex-align-center flex-pack-center module">
      <div class="metaname-container">
        <img class="bg" src="@/assets/metaname/emb.png" />

        <div class="title">{{ $t('MetaName.IndexTitle3') }}</div>
        <div class="drsc">{{ $t('MetaName.IndexDrsc3') }}</div>
        <!-- <div class="hover flex flex-align-center flex-pack-center">
          <a href="https://www.show3.io/home" target="_blank" class="flex flex-align-center"
            >{{ $t('MetaName.IndexHover3') }} <Icon name="down"
          /></a>
        </div> -->
        <div class="imgs flex flex-align-center">
          <img class="flex1" src="@/assets/metaname/module3_1.png" />
          <img class="flex1" src="@/assets/metaname/module3_2.png" />
        </div>
      </div>
    </div>

    <div class="module7 flex flex-align-center flex-pack-center module">
      <div class="metaname-container">
        <img class="bg" src="@/assets/metaname/emb.png" />
        <div class="title">{{ $t('MetaName.IndexTitle7') }}</div>
        <div class="drsc">
          {{ $t('MetaName.IndexDrsc7') }} <a>{{ $t('MetaName.IndexDrsc7_2') }}</a>
        </div>
        <!-- <div class="hover flex flex-align-center flex-pack-center">
          <a href="https://www.show3.io/home" target="_blank" class="flex flex-align-center"
            >{{ $t('MetaName.IndexHover3') }} <Icon name="down"
          /></a>
        </div> -->
        <div class="imgs flex flex-align-center">
          <img class="flex1" src="@/assets/metaname/module7.png" />
        </div>
      </div>
    </div>

    <div class="module5 flex flex-align-center flex-pack-center module">
      <img src="@/assets/metaname/plane.png" class="plane" />
      <div class="metaname-container">
        <img class="bg" src="@/assets/metaname/emb2.png" />
        <div class="title">{{ $t('MetaName.IndexTitle5') }}</div>
        <div class="drsc">{{ $t('MetaName.IndexDrsc5') }}</div>
        <div class="hover flex flex-align-center flex-pack-center">
          <a
            href="https://metaid-1.gitbook.io/metaname/kai-fa-zhe/metaname-jie-ru-zhi-nan"
            target="_blank"
            class="flex flex-align-center"
            >{{ $t('MetaName.IndexHover5') }} <Icon name="down"
          /></a>
        </div>
        <div class="apps flex flex-align-center flex-pack-center">
          <a
            :href="item.link"
            target="_blank"
            class="app"
            v-for="(item, index) in apps"
            :key="index"
          >
            <img :src="item.icon" class="logo" />
            <div class="name">{{ item.name }}</div>
          </a>
        </div>
      </div>
    </div>

    <div class="module6 flex flex-align-center flex-pack-center module">
      <img class="bg" src="@/assets/metaname/emb_earth.png" />
      <div class="metaname-container">
        <div class="title">{{ $t('MetaName.IndexTitle6') }}</div>
        <div class="drsc">{{ $t('MetaName.IndexDrsc6') }}</div>
        <div class="operate flex flex-align-center flex-pack-center">
          <a class="btn primary" @click="toMine">{{ $t('MetaName.IndexBtn6') }}</a>
        </div>
      </div>
    </div>

    <footer>
      <div class="metaname-container flex flex-align-center">
        <div class="flex1">
          <Logo />
        </div>
        <div class="apps flex flex-align-center">
          <a
            class="flex flex-align-center flex-pack-center"
            :href="item.link"
            target="_blank"
            v-for="(item, index) in contactIcon"
            :key="index"
          >
            <Icon :name="item.icon" />
          </a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import SearchWarp from './components/SearchWarp/SearchWarp.vue'
import ShowMoney from '@/assets/images/iocn_showmoney.png'
import WebBot from '@/assets/images/icon_webot.png'
import Metalet from '@/assets/images/icon_matelet.png'
import Show from '@/assets/images/logo_show.png'
import Buzzbit from '@/assets/images/logo_buzzbit.png'
import ShowBuzz from '@/assets/images/logo_showbuzz.png'
import PlainBtn from './components/PlainBtn/PlainBtn.vue'
import Logo from './components/Logo/Logo.vue'
import { checkUserLogin } from '@/utils/util'
import { useRouter } from 'vue-router'
import { EnvMode } from '@/enum'
import { useI18n } from 'vue-i18n'
import MetaSo from '@/assets/images/logo_metaso.png'

const router = useRouter()
const i18n = useI18n()

const wallets = [
  {
    icon: ShowMoney,
    name: 'ShowMoney',
  },
  {
    icon: WebBot,
    name: 'Webot',
  },
  {
    icon: Metalet,
    name: 'Metalet',
  },
]

const apps = [
  {
    icon: Show,
    name: 'Show3',
    link: 'https://v2.show3.io',
  },
  {
    icon: MetaSo,
    name: 'MetaSo',
    link: 'https://www.metaso.network/',
  },
  {
    icon: ShowMoney,
    name: 'VisionMoney',
    link: 'https://www.visionmoney.space/',
  },
  {
    icon: ShowBuzz,
    name: 'ShowBuzz',
    link: 'https://www.showbuzz.app/',
  },
  {
    icon: Metalet,
    name: 'Metalet',
    link:
      'https://chrome.google.com/webstore/detail/metalet-mvc-wallet/lbjapbcmmceacocpimbpbidpgmlmoaao?hl=zh-CN',
  },
  {
    icon: Buzzbit,
    name: 'Buzzbit',
    link: 'https://buzzbit.vercel.app',
  },
  {
    icon: WebBot,
    name: 'VisionBox',
    link: 'https://www.visionbox.space/',
  },
]

const contactIcon = [
  {
    icon: 'show_fill',
    link: 'https://www.show3.io/talk/channels/Show3.meta/index',
  },
  {
    icon: 'twitter',
    link: 'https://twitter.com/matanamedao',
  },
  {
    icon: 'email',
    link: 'mailto:metanamedao@outlook.com',
  },
  {
    icon: 'dito',
    link: 'https://discord.gg/K2DMepgjhk',
  },
]

async function toMine() {
  await checkUserLogin()
  router.push({
    name: 'metaNameMine',
  })
}
</script>

<style lang="scss" scoped src="./Index.scss"></style>
