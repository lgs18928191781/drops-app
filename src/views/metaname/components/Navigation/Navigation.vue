<template>
  <!-- navigation -->
  <div class="navigation">
    <div class="naviagion-warp" @click="$router.back()">
      <div class="flex flex-align-center">
        <span class="back flex flex-align-center flex-pack-center">
          <Icon name="down" />
        </span>
        <div class="text">
          <template v-for="(item, index) in list" :key="index">
            <template v-if="index !== list.length - 1"> {{ item }} - </template>
            <template v-else>
              <span>{{ item }}</span>
            </template>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  list: string[]
}
const props = withDefaults(defineProps<Props>(), {})
</script>

<style lang="scss" scoped src="./Navigation.scss"></style>
