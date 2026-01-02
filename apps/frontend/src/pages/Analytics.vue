<template>
  <div class="analytics-page u-container">
    <header class="page-header">
      <h1 class="title u-headline">Analytics</h1>
      <p class="subtitle u-body">Understand your spending</p>
    </header>

    <div class="period-selector">
      <button
        v-for="period in periods"
        :key="period.value"
        :class="['period-btn', { active: selectedPeriod === period.value }]"
        @click="selectPeriod(period.value)"
      >
        {{ period.label }}
      </button>
    </div>

    <Card class="spending-card">
      <template #content>
        <div class="card-content">
          <template v-if="analyticsStore.loading">
            <span class="card-label u-body">Loading...</span>
            <div class="amount-display">
              <ProgressSpinner class="loading-spinner" />
            </div>
          </template>
          <template v-else-if="analyticsStore.error">
            <Message severity="error" :closable="false" class="error-message">
              {{ analyticsStore.error }}
            </Message>
            <div class="amount-display">
              <span class="currency u-amount">$</span>
              <span class="amount u-amount">0.00</span>
            </div>
          </template>
          <template v-else>
            <span class="card-label u-body">{{ spendingLabel }}</span>
            <div class="amount-display">
              <span class="currency u-amount">$</span>
              <span class="amount u-amount">{{ formattedAmount }}</span>
            </div>
          </template>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { useAnalyticsStore } from '@/stores/analytics';
import type { AnalyticsPeriod } from '@/types';
import Card from 'primevue/card';
import Message from 'primevue/message';
import ProgressSpinner from 'primevue/progressspinner';
import { computed, onMounted, ref, watch } from 'vue';

interface Period {
  value: AnalyticsPeriod;
  label: string;
}

const periods: Period[] = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

const analyticsStore = useAnalyticsStore();
const selectedPeriod = ref<AnalyticsPeriod>('daily');

onMounted(() => {
  analyticsStore.fetchSummary();
});

function selectPeriod(period: AnalyticsPeriod) {
  selectedPeriod.value = period;
  analyticsStore.setPeriod(period);
}

// Sync with store
watch(
  () => analyticsStore.selectedPeriod,
  (newPeriod) => {
    selectedPeriod.value = newPeriod;
  }
);

const spendingLabel = computed(() => {
  switch (analyticsStore.selectedPeriod) {
    case 'daily':
      return 'Today Spending';
    case 'weekly':
      return 'This Week Spending';
    case 'monthly':
      return 'This Month Spending';
    default:
      return 'Spending';
  }
});

const formattedAmount = computed(() => {
  const amount = analyticsStore.summary?.total_amount ?? 0;
  return amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
});
</script>

<style scoped>
.analytics-page {
  padding-top: 2rem;
  padding-bottom: 2rem;
}

.page-header {
  margin-bottom: 1.5rem;
}

.title {
  color: var(--color-text);
  font-size: 2rem;
  margin: 0 0 0.25rem 0;
}

.subtitle {
  color: var(--color-text-muted);
  font-size: 1rem;
  margin: 0;
}

/* Period selector */
.period-selector {
  margin-bottom: 1.5rem;
  width: 100%;
  display: flex;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 2rem;
  padding: 0.25rem;
  border: none;
  gap: 0;
}

.period-btn {
  flex: 1;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 1.75rem;
  background: transparent;
  color: var(--color-text-muted);
  font-family: var(--font-body);
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  outline: none;
}

.period-btn:hover {
  color: var(--color-text);
}

.period-btn.active {
  background: var(--color-accent);
  color: var(--color-text-secondary);
}

/* PrimeVue Card customization */
.spending-card {
  width: 100%;
}

:deep(.spending-card .p-card) {
  background: var(--color-card);
  border-radius: 1.25rem;
  border: none;
  box-shadow: none;
}

:deep(.spending-card .p-card-body) {
  padding: 1.5rem;
}

:deep(.spending-card .p-card-content) {
  padding: 0;
}

.card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.card-label {
  color: var(--color-text-muted);
  font-size: 0.9375rem;
}

.amount-display {
  display: flex;
  align-items: baseline;
  gap: 0.125rem;
}

.currency {
  color: var(--color-accent);
  font-size: 1.75rem;
  font-weight: 500;
}

.amount {
  color: var(--color-accent);
  font-size: 2.5rem;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.loading-spinner {
  width: 3rem;
  height: 3rem;
}

:deep(.loading-spinner .p-progress-spinner-circle) {
  stroke: var(--color-accent);
}

.error-message {
  margin-bottom: 0.5rem;
}

:deep(.error-message .p-message) {
  background: rgba(255, 107, 107, 0.1);
  border: none;
  border-radius: 0.75rem;
}

:deep(.error-message .p-message-text) {
  color: #ff6b6b;
}
</style>

