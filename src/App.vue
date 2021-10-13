<template>
  <Header />
  <div class="main">
    <transition name="fade">
      <router-view />
    </transition>
  </div>
  <Footer />
</template>

<script setup lang="ts">
import Header from './components/Header/Header.vue'
import Footer from './components/Footer/Footer.vue'
</script>
<style>
html body{
  padding: 0;
  margin: 0;
}
#app{

}
.main {
  /* padding-top: 60px;
  padding-bottom: 100px; */
  flex: 1;
}
</style>
