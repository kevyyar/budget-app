<template>
  <div class="budget-page">
    <template v-if="budgetStore.loading">
      <div class="loading">Cargando...</div>
    </template>
    <template v-else-if="budgetStore.error">
      <div class="error">{{ budgetStore.error }}</div>
    </template>
    <template v-else-if="budgetStore.summary">
      <BudgetHeader :period-end="budgetStore.summary.budget.period_end" />
      <BudgetCard
        :income="budgetStore.summary.income"
        :spent="budgetStore.summary.spent"
        :days-remaining="budgetStore.summary.daysRemaining"
      />
      <div class="expense-row">
        <ExpenseSummaryCard
          label="Variable"
          :amount="budgetStore.summary.variableAmount"
          icon="pi pi-inbox"
          icon-color="#ff6b6b"
          icon-bg="rgba(255, 107, 107, 0.15)"
        />
        <ExpenseSummaryCard
          label="Fijo"
          :amount="budgetStore.summary.fixedAmount"
          icon="pi pi-home"
          icon-color="#7c6bff"
          icon-bg="rgba(124, 107, 255, 0.15)"
        />
      </div>
      <RecentExpenses :expenses="budgetStore.summary.recentExpenses" />
    </template>
    <template v-else>
      <div class="no-budget">Sin presupuesto activo. Crea uno en Ajustes.</div>
    </template>
  </div>
</template>

<script setup lang="ts">
import BudgetCard from '@/components/BudgetCard.vue';
import BudgetHeader from '@/components/BudgetHeader.vue';
import ExpenseSummaryCard from '@/components/ExpenseSummaryCard.vue';
import RecentExpenses from '@/components/RecentExpenses.vue';
import { useBudgetStore } from '@/stores/budget';
import { onMounted } from 'vue';

const budgetStore = useBudgetStore();

onMounted(() => {
  budgetStore.fetchSummary();
});
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

.loading,
.error,
.no-budget {
  text-align: center;
  padding: 2rem;
  color: var(--color-text-muted);
}

.error {
  color: #f87171;
}
</style>
