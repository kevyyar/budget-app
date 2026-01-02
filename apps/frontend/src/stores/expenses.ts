import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Expense, ExpenseWithCategory, Category } from '@/types';
import { api } from '@/lib/api';
import { useAnalyticsStore } from './analytics';

export interface CreateExpenseInput {
  budget_id: string;
  category_id: string;
  amount: number;
  description?: string;
  expense_date?: string;
  is_fixed?: boolean;
}

export type ExpenseFilter = 'all' | 'fixed' | 'variable' | Category['id'];

const PAGE_SIZE = 6;

export const useExpensesStore = defineStore('expenses', () => {
  const items = ref<ExpenseWithCategory[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const currentFilter = ref<ExpenseFilter>('all');
  const currentPage = ref(0);
  const hasNextPage = ref(false);
  const currentBudgetId = ref<string | undefined>();

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

  interface PaginatedResponse {
    items: ExpenseWithCategory[];
    hasNextPage: boolean;
  }

  async function fetch(budgetId?: string, page = 0) {
    loading.value = true;
    error.value = null;
    currentBudgetId.value = budgetId;
    currentPage.value = page;

    try {
      const params = new URLSearchParams();
      if (budgetId) params.set('budget_id', budgetId);
      params.set('limit', PAGE_SIZE.toString());
      params.set('offset', (page * PAGE_SIZE).toString());

      const response = await api.get<PaginatedResponse>(`/api/expenses?${params}`);
      items.value = response.items;
      hasNextPage.value = response.hasNextPage;
    } catch (e) {
      error.value = (e as Error).message;
    } finally {
      loading.value = false;
    }
  }

  async function nextPage() {
    if (hasNextPage.value) {
      await fetch(currentBudgetId.value, currentPage.value + 1);
    }
  }

  async function prevPage() {
    if (currentPage.value > 0) {
      await fetch(currentBudgetId.value, currentPage.value - 1);
    }
  }

  async function create(input: CreateExpenseInput): Promise<Expense> {
    const expense = await api.post<Expense>('/api/expenses', input);
    await fetch(input.budget_id);
    const analyticsStore = useAnalyticsStore();
    analyticsStore.clearCache();
    return expense;
  }

  async function remove(id: string) {
    await api.delete(`/api/expenses/${id}`);
    items.value = items.value.filter((e) => e.id !== id);
    const analyticsStore = useAnalyticsStore();
    analyticsStore.clearCache();
  }

  function setFilter(filter: ExpenseFilter) {
    currentFilter.value = filter;
  }

  return {
    items,
    loading,
    error,
    currentFilter,
    currentPage,
    hasNextPage,
    filteredExpenses,
    fetch,
    create,
    remove,
    setFilter,
    nextPage,
    prevPage,
  };
});
