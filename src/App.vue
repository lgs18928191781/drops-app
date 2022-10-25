<template>
  <div class="main">
    <router-view v-slot="{ Component, route }">
      <Transition name="fade">
        <div class="transition-warp">
          <KeepAlive>
            <component :is="Component" :key="route.fullPath" v-if="route.meta && route.meta.keepAlive" />
          </KeepAlive>
          <component :is="Component" :key="route.fullPath"
            v-if="!route.meta || (route.meta && !route.meta.keepAlive)" />
        </div>
      </Transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">

</script>
<style lang="scss">

</style>
