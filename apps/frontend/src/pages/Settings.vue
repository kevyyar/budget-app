<template>
  <div class="settings-page">
    <h1 class="u-headline">Settings</h1>

    <section class="section">
      <h2 class="section-title">Budget</h2>

      <div v-if="displayBudget" class="current-budget">
        <div class="budget-info">
          <span class="budget-status">{{ budgetStatusLabel }}</span>
          <span class="budget-name">{{ displayBudget.name }}</span>
          <span class="budget-dates">
            {{ formatDate(displayBudget.period_start) }} – {{ formatDate(displayBudget.period_end) }}
          </span>
        </div>
        <span class="budget-income">${{ displayBudget.income_per_pay.toLocaleString() }}</span>
      </div>

      <div v-if="budgets.length" class="budget-history">
        <h3 class="history-title">Budget History</h3>
        <ul class="history-list">
          <li v-for="budget in budgets" :key="budget.id" class="history-item">
            <div class="history-info">
              <span class="history-status">{{ getBudgetStatus(budget) }}</span>
              <span class="history-name">{{ budget.name }}</span>
              <span class="history-dates">
                {{ formatDate(budget.period_start) }} – {{ formatDate(budget.period_end) }}
              </span>
            </div>
            <span class="history-income">${{ budget.income_per_pay.toLocaleString() }}</span>
          </li>
        </ul>
      </div>

      <form @submit.prevent="handleCreateBudget" class="budget-form">
        <div class="form-row">
          <div class="field">
            <label for="name" class="label">Name</label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              class="input"
              placeholder="January 2025"
              required
            />
          </div>
          <div class="field">
            <label for="income" class="label">Income per pay</label>
            <input
              id="income"
              v-model.number="form.income_per_pay"
              type="number"
              class="input"
              placeholder="3000"
              min="0"
              step="0.01"
              required
            />
          </div>
        </div>

        <div class="form-row">
          <div class="field">
            <label for="start" class="label">Period start</label>
            <input
              id="start"
              v-model="form.period_start"
              type="date"
              class="input"
              required
            />
          </div>
          <div class="field">
            <label for="end" class="label">Period end</label>
            <input
              id="end"
              v-model="form.period_end"
              type="date"
              class="input"
              required
            />
          </div>
        </div>

        <div class="field">
          <label for="schedule" class="label">Pay schedule</label>
          <select id="schedule" v-model="form.pay_schedule" class="input" required>
            <option value="weekly">Weekly</option>
            <option value="biweekly">Biweekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        <p v-if="error" class="error">{{ error }}</p>
        <p v-if="success" class="success">{{ success }}</p>

        <button type="submit" class="submit-btn" :disabled="loading">
          {{ loading ? 'Creating...' : 'Create Budget' }}
        </button>
      </form>
    </section>

    <section class="section">
      <h2 class="section-title">Account</h2>
      <button @click="handleLogout" class="logout-btn">Sign Out</button>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { api } from '@/lib/api';
import type { Budget, PaySchedule } from '@/types';

const router = useRouter();
const auth = useAuthStore();

const currentBudget = ref<Budget | null>(null);
const displayBudget = ref<Budget | null>(null);
const budgetStatus = ref<'active' | 'upcoming' | 'recent'>('active');
const budgets = ref<Budget[]>([]);
const loading = ref(false);
const error = ref('');
const success = ref('');

const today = new Date().toISOString().split('T')[0] ?? '';
const twoWeeksLater =
  new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] ?? '';

const form = reactive({
  name: '',
  period_start: today,
  period_end: twoWeeksLater,
  pay_schedule: 'biweekly' as PaySchedule,
  income_per_pay: 0,
});

function formatDate(dateStr: string) {
  const [yearStr, monthStr, dayStr] = dateStr.split('-');
  if (!yearStr || !monthStr || !dayStr) return dateStr;
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);
  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) return dateStr;
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

function todayString(): string {
  return new Date().toISOString().split('T')[0] ?? '';
}

function getBudgetStatus(budget: Budget) {
  const today = todayString();
  if (budget.period_start <= today && budget.period_end >= today) return 'Active';
  if (today < budget.period_start) return 'Upcoming';
  return 'Past';
}

const budgetStatusLabel = computed(() => {
  if (budgetStatus.value === 'upcoming') return 'Upcoming budget';
  if (budgetStatus.value === 'recent') return 'Most recent budget';
  return 'Active budget';
});

async function fetchBudgets() {
  try {
    const fetchedBudgets = await api.get<Budget[]>('/api/budgets');
    budgets.value = fetchedBudgets;
    const today = todayString();
    const activeBudget = fetchedBudgets.find(
      (budget) => budget.period_start <= today && budget.period_end >= today
    );

    if (activeBudget) {
      currentBudget.value = activeBudget;
      displayBudget.value = activeBudget;
      budgetStatus.value = 'active';
      return;
    }

    const latestBudget = fetchedBudgets[0] ?? null;
    currentBudget.value = null;
    displayBudget.value = latestBudget;

    if (latestBudget) {
      budgetStatus.value = today < latestBudget.period_start ? 'upcoming' : 'recent';
    }
  } catch {
    currentBudget.value = null;
    displayBudget.value = null;
    budgets.value = [];
  }
}

async function handleCreateBudget() {
  error.value = '';
  success.value = '';
  loading.value = true;

  try {
    await api.post<Budget>('/api/budgets', form);
    success.value = 'Budget created!';
    await fetchBudgets();
    form.name = '';
    form.income_per_pay = 0;
  } catch (e) {
    error.value = (e as Error).message;
  } finally {
    loading.value = false;
  }
}

async function handleLogout() {
  await auth.logout();
  router.push('/login');
}

onMounted(() => {
  fetchBudgets();
});
</script>

<style scoped>
.settings-page {
  padding-bottom: 5rem;
}

.section {
  background: var(--color-card);
  border-radius: 1rem;
  padding: 1.25rem;
  margin-top: 1rem;
}

.section-title {
  color: var(--color-text);
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 1rem;
}

.current-budget {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: var(--color-background);
  border-radius: 0.75rem;
  margin-bottom: 1rem;
}

.budget-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.budget-name {
  color: var(--color-text);
  font-weight: 500;
}

.budget-status {
  color: var(--color-text-muted);
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.budget-dates {
  color: var(--color-text-muted);
  font-size: 0.75rem;
}

.budget-income {
  color: var(--color-accent);
  font-weight: 600;
}

.budget-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.budget-history {
  margin-bottom: 1rem;
}

.history-title {
  color: var(--color-text);
  font-size: 0.85rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: var(--color-background);
  border-radius: 0.75rem;
}

.history-info {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.history-status {
  color: var(--color-text-muted);
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.history-name {
  color: var(--color-text);
  font-weight: 500;
}

.history-dates {
  color: var(--color-text-muted);
  font-size: 0.75rem;
}

.history-income {
  color: var(--color-accent);
  font-weight: 600;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.label {
  color: var(--color-text-muted);
  font-size: 0.75rem;
}

.input {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  padding: 0.625rem 0.75rem;
  font-size: 0.875rem;
  color: var(--color-text);
  transition: border-color 0.15s ease;
}

.input:focus {
  outline: none;
  border-color: var(--color-accent);
}

.error {
  color: #f87171;
  font-size: 0.75rem;
  margin: 0;
}

.success {
  color: #34d399;
  font-size: 0.75rem;
  margin: 0;
}

.submit-btn {
  background: var(--color-accent);
  color: var(--color-background);
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.15s ease;
  margin-top: 0.25rem;
}

.submit-btn:hover:not(:disabled) {
  opacity: 0.9;
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.logout-btn {
  background: transparent;
  border: 1px solid #f87171;
  color: #f87171;
  border-radius: 0.5rem;
  padding: 0.625rem 1rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.15s ease;
}

.logout-btn:hover {
  background: #f87171;
  color: var(--color-background);
}
</style>
