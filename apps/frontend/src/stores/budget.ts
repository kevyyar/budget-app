import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import type { DashboardSummary } from '@/types';
import { api } from '@/lib/api';
import { useAnalyticsStore } from './analytics';

export const useBudgetStore = defineStore('budget', () => {
  const summary = ref<DashboardSummary | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchSummary() {
    loading.value = true;
    error.value = null;

    try {
      summary.value = await api.get<DashboardSummary>('/api/dashboard/summary');
    } catch (e) {
      const message = (e as Error).message;
      if (message === 'No active budget found') {
        summary.value = null;
        error.value = null;
      } else {
        error.value = message;
        summary.value = null;
      }
    } finally {
      loading.value = false;
    }
  }

  watch(
    () => summary.value?.budget?.id,
    (newId, oldId) => {
      if (newId !== oldId) {
        const analyticsStore = useAnalyticsStore();
        analyticsStore.clearCache();
      }
    }
  );

  return {
    summary,
    loading,
    error,
    fetchSummary,
  };
});
