<template>
  <div class="budget-page">
    <BudgetHeader :payday="1" />
  </div>
</template>

<script setup lang="ts">
import BudgetHeader from '@/components/BudgetHeader.vue';
</script>

<style scoped>
.budget-page {
  padding-bottom: 5rem;
}
</style>
