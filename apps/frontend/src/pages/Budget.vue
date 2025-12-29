<template>
  <div class="budget-page">
    <BudgetHeader :payday="1" />
    <BudgetCard :income="5600" :spent="1905" :days-remaining="4" />
    <div class="expense-row">
      <ExpenseSummaryCard
        label="Variable"
        :amount="334"
        icon="pi pi-inbox"
        icon-color="#ff6b6b"
        icon-bg="rgba(255, 107, 107, 0.15)"
      />
      <ExpenseSummaryCard
        label="Fixed"
        :amount="1571"
        icon="pi pi-home"
        icon-color="#7c6bff"
        icon-bg="rgba(124, 107, 255, 0.15)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import BudgetHeader from '@/components/BudgetHeader.vue';
import BudgetCard from '@/components/BudgetCard.vue';
import ExpenseSummaryCard from '@/components/ExpenseSummaryCard.vue';
</script>

<style scoped>
.budget-page {
  padding-bottom: 5rem;
}

.expense-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-top: 0.75rem;
}
</style>
