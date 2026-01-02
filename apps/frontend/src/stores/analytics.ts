import { api } from '@/lib/api';
import type { AnalyticsPeriod, AnalyticsSummary } from '@/types';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

const CACHE_TTL = 5 * 60 * 1000;
const CACHE_KEY = 'analytics_cache';

export const useAnalyticsStore = defineStore('analytics', () => {
  const summariesCache = ref(new Map<AnalyticsPeriod, { summary: AnalyticsSummary; fetchedAt: number }>());
  const selectedPeriod = ref<AnalyticsPeriod>('daily');
  const loading = ref(false);
  const error = ref<string | null>(null);

  const summary = computed<AnalyticsSummary | null>(() => {
    const cached = summariesCache.value.get(selectedPeriod.value);
    return cached?.summary ?? null;
  });

  function loadCacheFromStorage(): void {
    try {
      const stored = localStorage.getItem(CACHE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as [AnalyticsPeriod, { summary: AnalyticsSummary; fetchedAt: number }][];
        const now = Date.now();
        parsed.forEach(([period, data]) => {
          if (now - data.fetchedAt < CACHE_TTL) {
            summariesCache.value.set(period, data);
          }
        });
      }
    } catch {
      localStorage.removeItem(CACHE_KEY);
    }
  }

  function saveCacheToStorage(): void {
    try {
      const entries = Array.from(summariesCache.value.entries());
      localStorage.setItem(CACHE_KEY, JSON.stringify(entries));
    } catch {
      localStorage.removeItem(CACHE_KEY);
    }
  }

  async function fetchSummary(period: AnalyticsPeriod = selectedPeriod.value, forceRefresh = false): Promise<void> {
    const cached = summariesCache.value.get(period);
    const now = Date.now();

    if (cached && !forceRefresh && now - cached.fetchedAt < CACHE_TTL) {
      selectedPeriod.value = period;
      return;
    }

    loading.value = true;
    error.value = null;

    try {
      const summary = await api.get<AnalyticsSummary>(`/api/analytics/summary?period=${period}`);
      summariesCache.value.set(period, { summary, fetchedAt: now });
      saveCacheToStorage();
      selectedPeriod.value = period;
    } catch (e) {
      error.value = (e as Error).message;
    } finally {
      loading.value = false;
    }
  }

  function setPeriod(period: AnalyticsPeriod) {
    selectedPeriod.value = period;
    fetchSummary(period);
  }

  function clearCache(): void {
    summariesCache.value.clear();
    localStorage.removeItem(CACHE_KEY);
  }

  loadCacheFromStorage();

  return {
    summary,
    selectedPeriod,
    loading,
    error,
    fetchSummary,
    setPeriod,
    clearCache,
  };
});
