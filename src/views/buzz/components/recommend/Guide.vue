<template>
  <!-- 使用教程 -->
  <div class="recommend-section">
    <div class="title flex">
      {{ $t('Buzz.RecommendContent.Introduction to Guiding') }}
    </div>

    <div class="cont">
      <div class="guide-list">
        <div
          class="guide-item flex flex-align-center"
          v-for="(item, index) in guides"
          :key="index"
          @click="item.fun()"
        >
          <span class="icon-warp">
            <img :src="item.icon" />
          </span>
          <div class="name flex1">{{ item.name() }}</div>
          <Icon name="down" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import AppSVG from '@/assets/svg/guides_icon_app.svg?url'
import LearnSVG from '@/assets/svg/guides_icon_learn.svg?url'
import Question from '@/assets/svg/question.svg?url'
import Learn from '@/assets/svg/lern.svg?url'
import { useRouter } from 'vue-router'
// import FAQ_Zh from '/public/pdf/Show3_FAQ_ZH.pdf'
// import FAQ_En from '/public/pdf/Show3_FAQ_EN.pdf'
// import How_To_Use_Zh from '/public/pdf/How_to_Use_Zh.pdf'
// import How_To_Use_En from '/public/pdf/How_to_Use_En.pdf'
const i18n = useI18n()
const router = useRouter()
const guides = [
  {
    icon: LearnSVG,
    name: () => i18n.t('Buzz.RecommendContent.Learn the show function'),
    fun: () => {
      window.open('https://show3.gitbook.io/show3.0/v/english/', '_blank')
    },
  },
  {
    icon: AppSVG,
    name: () => i18n.t('Buzz.RecommendContent.Download showApp'),
    fun: () => {
      router.push({
        name: 'home',
      })
    },
  },
  {
    icon: Learn,
    name: () => i18n.t('Buzz.New User Onboarding How to Use Show3'),
    fun: () => {
      window.open(
        i18n.locale.value === 'zh'
          ? `/public/pdf/How_to_Use_Zh.pdf`
          : `/public/pdf/How_to_Use_En.pdf`,
        '_blank'
      )

      // window.open(
      //   i18n.locale.value === 'zh'
      //     ? 'https://www.show3.io/新手攻略：如何玩转Show3.pdf'
      //     : 'https://www.show3.io/New_User_Onboarding_How_to_Use_Show3.pdf',
      //   '_blank'
      // )
    },
  },
  {
    icon: Question,
    name: () => i18n.t('Buzz.Show3 Faq'),
    fun: () => {
      window.open(
        i18n.locale.value == 'zh' ? `/public/pdf/Show3_FAQ_ZH.pdf` : `/public/pdf/Show3_FAQ_EN.pdf`,
        '_blank'
      )
      // window.open(
      //   i18n.locale.value === 'zh'
      //     ? 'https://www.show3.io/Show3常见问题.pdf'
      //     : 'https://www.show3.io/Show3_FAQ.pdf',
      //   '_blank'
      // )
    },
  },
]
</script>

<style lang="scss" scoped src="./Guide.scss"></style>
