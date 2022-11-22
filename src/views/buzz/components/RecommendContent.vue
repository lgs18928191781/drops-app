<template>
  <div class="recommend">
    <div class="recommend-section">
      <div class="title flex">
        {{ $t('Buzz.Referral Community') }}
      </div>

      <div class="cont">
        <CardVue class="follow-item">
          <div class="follow-item-warp card flex ">
            <Image src="" />
            <div class="flex1">
              <div class="name flex flex-align-center">
                Doodles
                <Icon name="down" />
              </div>

              <div class="people flex flex-align-center"><Icon name="" /> 628</div>
            </div>
          </div>
        </CardVue>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import CardVue from '@/components/Card/Card.vue'

const i18n = useI18n()
const communityTabs = [{ name: i18n.t('Buzz.Recommend.Referral Community') }]
</script>

<style lang="scss" scoped src="./RecommendContent.scss"></style>
