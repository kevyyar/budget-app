<template>
  <section class="recent-expenses">
    <header class="section-header">
      <h2 class="title u-headline">Gastos Recientes</h2>
      <router-link to="/expenses" class="see-all u-body">
        Ver todos <i class="pi pi-chevron-right" />
      </router-link>
    </header>

    <ul v-if="expenses.length" class="expense-list">
      <li v-for="expense in expenses" :key="expense.id" class="expense-item">
        <div class="icon-wrap" :style="getCategoryStyle(expense.category)">
          <i :class="expense.category.icon" />
        </div>
        <div class="details">
          <span class="name u-body">{{ expense.description }}</span>
          <span class="category u-body">{{ expense.category.name }}</span>
        </div>
        <span class="amount u-amount">- ${{ formatAmount(expense.amount) }}</span>
      </li>
    </ul>
    <p v-else class="empty u-body">Sin gastos aún</p>
  </section>
</template>

<script setup lang="ts">
import type { ExpenseWithCategory } from '@/types';

defineProps<{
  expenses: ExpenseWithCategory[];
}>();

function getCategoryStyle(category: { color: string }) {
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

.empty {
  text-align: center;
  color: var(--color-text-muted);
  padding: 2rem;
}
</style>
