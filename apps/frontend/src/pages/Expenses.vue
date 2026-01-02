<template>
  <div class="expenses-page">
    <header class="page-header">
      <h1 class="page-title u-headline">Expenses</h1>
      <p class="page-subtitle">track every dollar</p>
    </header>

    <nav class="filter-pills">
      <button
        :class="['filter-pill', { active: expensesStore.currentFilter === 'all' }]"
        @click="expensesStore.setFilter('all')"
      >
        All
      </button>
      <button
        :class="['filter-pill', { active: expensesStore.currentFilter === 'fixed' }]"
        @click="expensesStore.setFilter('fixed')"
      >
        Fixed
      </button>
      <button
        :class="['filter-pill', { active: expensesStore.currentFilter === 'variable' }]"
        @click="expensesStore.setFilter('variable')"
      >
        Variable
      </button>
      <button
        v-for="category in categoriesStore.items"
        :key="category.id"
        :class="['filter-pill', { active: expensesStore.currentFilter === category.id }]"
        @click="expensesStore.setFilter(category.id)"
      >
        {{ category.name }}
      </button>
    </nav>

    <template v-if="expensesStore.loading">
      <div class="loading">Loading...</div>
    </template>
    <template v-else-if="expensesStore.error">
      <div class="error">{{ expensesStore.error }}</div>
    </template>
    <template v-else>
      <ul v-if="expensesStore.filteredExpenses.length" class="expense-list">
        <li v-for="expense in expensesStore.filteredExpenses" :key="expense.id" class="expense-item">
          <div class="icon-wrap" :style="getCategoryStyle(expense.category)">
            <i :class="expense.category.icon" />
          </div>
          <div class="details">
            <span class="name u-body">{{ expense.description }}</span>
            <span class="meta u-body">
              {{ expense.category.name }} · {{ formatDate(expense.expense_date) }}
            </span>
          </div>
          <span class="amount u-amount">- ${{ formatAmount(expense.amount) }}</span>
          <button class="delete-btn" @click="handleDelete(expense.id)">
            <i class="pi pi-trash" />
          </button>
        </li>
      </ul>
      <p v-else class="empty u-body">No expenses found</p>

      <nav v-if="expensesStore.items.length" class="pagination">
        <button
          class="pagination-btn"
          :disabled="expensesStore.currentPage === 0"
          @click="expensesStore.prevPage"
        >
          <i class="pi pi-chevron-left" />
          Prev
        </button>
        <span class="pagination-page">Page {{ expensesStore.currentPage + 1 }}</span>
        <button
          class="pagination-btn"
          :disabled="!expensesStore.hasNextPage"
          @click="expensesStore.nextPage"
        >
          Next
          <i class="pi pi-chevron-right" />
        </button>
      </nav>
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useExpensesStore } from '@/stores/expenses';
import { useCategoriesStore } from '@/stores/categories';
import { useBudgetStore } from '@/stores/budget';
import type { Category } from '@/types';

const expensesStore = useExpensesStore();
const categoriesStore = useCategoriesStore();
const budgetStore = useBudgetStore();

onMounted(async () => {
  await Promise.all([
    categoriesStore.fetch(),
    budgetStore.fetchSummary(),
  ]);

  if (budgetStore.summary?.budget?.id) {
    await expensesStore.fetch(budgetStore.summary.budget.id);
  }
});

function getCategoryStyle(category: Category) {
  const hex = category.color.replace('#', '');
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return {
    backgroundColor: `rgba(${r}, ${g}, ${b}, 0.15)`,
    color: category.color,
  };
}

function formatAmount(amount: number): string {
  return Number(amount).toFixed(2);
}

function formatDate(dateStr: string): string {
  const localDate = new Date(`${dateStr}T00:00:00`);
  return localDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

async function handleDelete(id: string) {
  if (confirm('Delete this expense?')) {
    await expensesStore.remove(id);
    await budgetStore.fetchSummary();
  }
}
</script>

<style scoped>
.expenses-page {
  padding-bottom: 5rem;
}

.page-header {
  padding-block: 1.5rem 1rem;
}

.page-title {
  margin: 0;
  font-size: 1.75rem;
  color: var(--color-text);
  font-weight: 700;
}

.page-subtitle {
  margin: 0.25rem 0 0;
  color: var(--color-text-muted);
  font-size: 1rem;
}

.filter-pills {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
  scrollbar-width: none;
}

.filter-pills::-webkit-scrollbar {
  display: none;
}

.filter-pill {
  flex-shrink: 0;
  padding: 0.5rem 1rem;
  background: var(--color-card);
  border: none;
  border-radius: 999px;
  color: var(--color-text-muted);
  font-family: var(--font-body);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-pill:hover {
  color: var(--color-text);
}

.filter-pill.active {
  background: var(--color-accent);
  color: #000;
}

.loading,
.error,
.empty {
  text-align: center;
  padding: 2rem;
  color: var(--color-text-muted);
}

.error {
  color: #f87171;
}

.expense-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.expense-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: var(--color-card);
  border-radius: 1rem;
  padding: 1rem;
}

.icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 0.875rem;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  min-width: 0;
}

.name {
  color: var(--color-text);
  font-size: 1rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.meta {
  color: var(--color-text-muted);
  font-size: 0.8125rem;
}

.amount {
  color: #f87171;
  font-size: 1rem;
  font-weight: 500;
  flex-shrink: 0;
}

.delete-btn {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.75rem;
  background: transparent;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.delete-btn:hover {
  background: rgba(248, 113, 113, 0.15);
  color: #f87171;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
  padding: 1rem 0;
}

.pagination-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  background: var(--color-card);
  border: none;
  border-radius: 0.75rem;
  color: var(--color-text);
  font-family: var(--font-body);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.pagination-btn:hover:not(:disabled) {
  background: var(--color-accent);
  color: #000;
}

.pagination-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.pagination-page {
  color: var(--color-text-muted);
  font-size: 0.875rem;
  min-width: 4rem;
  text-align: center;
}
</style>
