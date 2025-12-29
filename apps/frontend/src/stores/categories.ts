import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Category } from '@/types';
import { api } from '@/lib/api';

export const useCategoriesStore = defineStore('categories', () => {
  const items = ref<Category[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const categoryMap = computed(() => new Map(items.value.map((c) => [c.id, c])));

  function getById(id: string): Category | undefined {
    return categoryMap.value.get(id);
  }

  function getStyle(id: string): { backgroundColor: string; color: string } {
    const cat = getById(id);
    if (!cat) {
      return { backgroundColor: 'rgba(107, 114, 128, 0.15)', color: '#6b7280' };
    }
    const alpha = 0.15;
    const hex = cat.color.replace('#', '');
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return {
      backgroundColor: `rgba(${r}, ${g}, ${b}, ${alpha})`,
      color: cat.color,
    };
  }

  async function fetch() {
    loading.value = true;
    error.value = null;

    try {
      items.value = await api.get<Category[]>('/api/categories');
    } catch (e) {
      error.value = (e as Error).message;
    } finally {
      loading.value = false;
    }
  }

  return {
    items,
    loading,
    error,
    categoryMap,
    getById,
    getStyle,
    fetch,
  };
});
