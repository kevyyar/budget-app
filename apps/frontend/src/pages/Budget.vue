<template>
  <div class="budget-page">
    <BudgetHeader :payday="1" />
    <BudgetCard :income="5600" :spent="1905" :days-remaining="4" />
  </div>
</template>

<script setup lang="ts">
import BudgetHeader from '@/components/BudgetHeader.vue';
import BudgetCard from '@/components/BudgetCard.vue';
</script>

<style scoped>
.budget-page {
  padding-bottom: 5rem;
}
</style>
