<template>
  <CommunityVue />
  <FollowVue />
  <GuideVue />
  <HomeBuzzListVue />
</template>

<script setup lang="ts">
import HomeBuzzListVue from './components/HomeBuzzList.vue'
import CommunityVue from './components/recommend/Community.vue'
import FollowVue from './components/recommend/Follow.vue'
import GuideVue from './components/recommend/Guide.vue'
</script>

<style lang="scss" scoped src="./Recomment.scss"></style>
