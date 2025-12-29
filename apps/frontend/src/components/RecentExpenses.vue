<template>
  <section class="recent-expenses">
    <header class="section-header">
      <h2 class="title u-headline">Recent Expenses</h2>
      <router-link to="/expenses" class="see-all u-body">
        See all <i class="pi pi-chevron-right" />
      </router-link>
    </header>

    <ul class="expense-list">
      <li v-for="expense in expenses" :key="expense.id" class="expense-item">
        <div class="icon-wrap" :style="getCategoryStyle(expense.category)">
          <i :class="getCategoryIcon(expense.category)" />
        </div>
        <div class="details">
          <span class="name u-body">{{ expense.name }}</span>
          <span class="category u-body">{{ expense.category }}</span>
        </div>
        <span class="amount u-amount">- ${{ formatAmount(expense.amount) }}</span>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { getCategoryIcon, getCategoryStyle } from '@/utils/categories';

interface Expense {
  id: number;
  name: string;
  category: string;
  amount: number;
}

// Mock data - replace with actual data source later
const expenses: Expense[] = [
  { id: 1, name: 'Morning latte', category: 'Coffee & Drinks', amount: 12.50 },
  { id: 2, name: 'Grocery run', category: 'Food & Dining', amount: 45.00 },
  { id: 3, name: 'Lunch with friends', category: 'Food & Dining', amount: 28.50 },
  { id: 4, name: 'Gas', category: 'Transport', amount: 32.00 }
];

function formatAmount(amount: number): string {
  return amount.toFixed(2);
}
</script>

<style scoped>
.recent-expenses {
  margin-top: 1.5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.title {
  color: var(--color-text);
  font-size: 1.125rem;
  margin: 0;
}

.see-all {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: var(--color-accent);
  font-size: 0.875rem;
  text-decoration: none;
  transition: opacity 0.15s ease;
}

.see-all:hover {
  opacity: 0.8;
}

.see-all i {
  font-size: 0.75rem;
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

.category {
  color: var(--color-text-muted);
  font-size: 0.8125rem;
}

.amount {
  color: #f87171;
  font-size: 1rem;
  font-weight: 500;
  flex-shrink: 0;
}
</style>
