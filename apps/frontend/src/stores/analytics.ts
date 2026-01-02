import { api } from '@/lib/api';
import type { AnalyticsPeriod, AnalyticsSummary } from '@/types';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAnalyticsStore = defineStore('analytics', () => {
  const summary = ref<AnalyticsSummary | null>(null);
  const selectedPeriod = ref<AnalyticsPeriod>('daily');
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchSummary(period: AnalyticsPeriod = selectedPeriod.value) {
    loading.value = true;
    error.value = null;

    try {
      summary.value = await api.get<AnalyticsSummary>(`/api/analytics/summary?period=${period}`);
      selectedPeriod.value = period;
    } catch (e) {
      error.value = (e as Error).message;
      summary.value = null;
    } finally {
      loading.value = false;
    }
  }

  function setPeriod(period: AnalyticsPeriod) {
    selectedPeriod.value = period;
    fetchSummary(period);
  }

  return {
    summary,
    selectedPeriod,
    loading,
    error,
    fetchSummary,
    setPeriod,
  };
});
