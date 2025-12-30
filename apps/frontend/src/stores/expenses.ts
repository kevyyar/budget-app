import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Expense, ExpenseWithCategory, Category } from '@/types';
import { api } from '@/lib/api';

export interface CreateExpenseInput {
  budget_id: string;
  category_id: string;
  amount: number;
  description?: string;
  expense_date?: string;
  is_fixed?: boolean;
}

export type ExpenseFilter = 'all' | 'fixed' | 'variable' | Category['id'];

export const useExpensesStore = defineStore('expenses', () => {
  const items = ref<ExpenseWithCategory[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const currentFilter = ref<ExpenseFilter>('all');

  const filteredExpenses = computed(() => {
    if (currentFilter.value === 'all') {
      return items.value;
    }
    if (currentFilter.value === 'fixed') {
      return items.value.filter((e) => e.is_fixed);
    }
    if (currentFilter.value === 'variable') {
      return items.value.filter((e) => !e.is_fixed);
    }
    return items.value.filter((e) => e.category_id === currentFilter.value);
  });

  async function fetch(budgetId?: string) {
    loading.value = true;
    error.value = null;

    try {
      const query = budgetId ? `?budget_id=${budgetId}` : '';
      items.value = await api.get<ExpenseWithCategory[]>(`/api/expenses${query}`);
    } catch (e) {
      error.value = (e as Error).message;
    } finally {
      loading.value = false;
    }
  }

  async function create(input: CreateExpenseInput): Promise<Expense> {
    const expense = await api.post<Expense>('/api/expenses', input);
    await fetch(input.budget_id);
    return expense;
  }

  async function remove(id: string) {
    await api.delete(`/api/expenses/${id}`);
    items.value = items.value.filter((e) => e.id !== id);
  }

  function setFilter(filter: ExpenseFilter) {
    currentFilter.value = filter;
  }

  return {
    items,
    loading,
    error,
    currentFilter,
    filteredExpenses,
    fetch,
    create,
    remove,
    setFilter,
  };
});
