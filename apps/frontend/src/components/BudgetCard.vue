<template>
  <article class="budget-card">
    <span class="label u-body">Remaining Budget</span>
    <div class="amount-row">
      <span class="currency u-amount">$</span>
      <span class="amount u-amount">{{ formattedRemaining }}</span>
    </div>
    <div class="progress-section">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: spentPercentage + '%' }" />
      </div>
      <div class="progress-labels">
        <span class="u-body">${{ spent.toLocaleString() }} spent</span>
        <span class="u-body">${{ income.toLocaleString() }} income</span>
      </div>
    </div>
    <div class="daily-budget">
      <span class="dollar-icon u-amount">$</span>
      <span class="daily-text u-body">Daily budget: <strong class="u-amount">${{ formattedDaily }}</strong></span>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(defineProps<{
  income: number;
  spent: number;
  daysRemaining?: number;
}>(), {
  daysRemaining: 4
});

const remaining = computed(() => props.income - props.spent);

const formattedRemaining = computed(() => {
  return remaining.value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
});

const spentPercentage = computed(() => {
  if (props.income === 0) return 0;
  return Math.min((props.spent / props.income) * 100, 100);
});

const dailyBudget = computed(() => {
  if (props.daysRemaining === 0) return remaining.value;
  return remaining.value / props.daysRemaining;
});

const formattedDaily = computed(() => {
  return dailyBudget.value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
});
</script>

<style scoped>
.budget-card {
  background: var(--color-card);
  border-radius: 1.25rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.label {
  color: var(--color-text-muted);
  font-size: 0.9375rem;
}

.amount-row {
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
}

.currency {
  color: var(--color-accent);
  font-size: 1.5rem;
  font-weight: 500;
}

.amount {
  color: var(--color-text);
  font-size: 3.5rem;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.progress-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.progress-bar {
  height: 0.5rem;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--color-accent);
  border-radius: 999px;
  transition: width 0.4s ease-out;
}

.progress-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.8125rem;
  color: var(--color-text-muted);
}

.daily-budget {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.75rem;
  padding: 1rem;
  margin-top: 0.25rem;
}

.dollar-icon {
  color: var(--color-accent);
  font-size: 1rem;
  font-weight: 600;
}

.daily-text {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9375rem;
}

.daily-text strong {
  color: var(--color-accent);
}
</style>
