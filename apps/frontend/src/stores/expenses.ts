import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Expense } from '@/types';
import { api } from '@/lib/api';

export interface CreateExpenseInput {
  budget_id: string;
  category_id: string;
  amount: number;
  description?: string;
  expense_date?: string;
  is_fixed?: boolean;
}

export const useExpensesStore = defineStore('expenses', () => {
  const items = ref<Expense[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetch(budgetId?: string) {
    loading.value = true;
    error.value = null;

    try {
      const query = budgetId ? `?budget_id=${budgetId}` : '';
      items.value = await api.get<Expense[]>(`/api/expenses${query}`);
    } catch (e) {
      error.value = (e as Error).message;
    } finally {
      loading.value = false;
    }
  }

  async function create(input: CreateExpenseInput): Promise<Expense> {
    const expense = await api.post<Expense>('/api/expenses', input);
    items.value.unshift(expense);
    return expense;
  }

  async function remove(id: string) {
    await api.delete(`/api/expenses/${id}`);
    items.value = items.value.filter((e) => e.id !== id);
  }

  return {
    items,
    loading,
    error,
    fetch,
    create,
    remove,
  };
});
