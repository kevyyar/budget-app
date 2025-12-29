<script setup lang="ts">
import Footer from './components/Footer.vue';
</script>

<template>
  <main class="app-content u-container">
    <router-view />
  </main>
  <Footer class="app-footer" />
</template>

<style scoped>
.app-content {
  flex: 1;
  overflow-y: auto;
}

.app-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
}
</style>
