<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Footer from './components/Footer.vue';

const route = useRoute();
const showFooter = computed(() => !route.meta.public);
</script>

<template>
  <main class="app-content u-container">
    <router-view />
  </main>
  <Footer v-if="showFooter" class="app-footer" />
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
