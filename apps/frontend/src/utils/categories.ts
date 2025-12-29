export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  bg: string;
}

export const CATEGORIES: Record<string, Category> = {
  'food-dining': {
    id: 'food-dining',
    name: 'Food & Dining',
    icon: 'pi pi-shopping-cart',
    color: '#ef4444',
    bg: 'rgba(239, 68, 68, 0.15)',
  },
  'transport': {
    id: 'transport',
    name: 'Transport',
    icon: 'pi pi-car',
    color: '#06b6d4',
    bg: 'rgba(6, 182, 212, 0.15)',
  },
  'shopping': {
    id: 'shopping',
    name: 'Shopping',
    icon: 'pi pi-shopping-bag',
    color: '#8b5cf6',
    bg: 'rgba(139, 92, 246, 0.15)',
  },
  'bills-utilities': {
    id: 'bills-utilities',
    name: 'Bills & Utilities',
    icon: 'pi pi-bolt',
    color: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.15)',
  },
  'housing': {
    id: 'housing',
    name: 'Housing',
    icon: 'pi pi-home',
    color: '#10b981',
    bg: 'rgba(16, 185, 129, 0.15)',
  },
  'health': {
    id: 'health',
    name: 'Health',
    icon: 'pi pi-heart',
    color: '#ec4899',
    bg: 'rgba(236, 72, 153, 0.15)',
  },
  'entertainment': {
    id: 'entertainment',
    name: 'Entertainment',
    icon: 'pi pi-play-circle',
    color: '#64748b',
    bg: 'rgba(100, 116, 139, 0.15)',
  },
  'coffee-drinks': {
    id: 'coffee-drinks',
    name: 'Coffee & Drinks',
    icon: 'pi pi-dollar',
    color: '#f97316',
    bg: 'rgba(249, 115, 22, 0.15)',
  },
};

export const DEFAULT_CATEGORY: Category = {
  id: 'other',
  name: 'Other',
  icon: 'pi pi-tag',
  color: '#6b7280',
  bg: 'rgba(107, 114, 128, 0.15)',
};

/** Get category by ID or name (case-insensitive, handles spaces) */
export function getCategory(key: string): Category {
  const normalized = key.toLowerCase().replace(/\s+&\s+/g, '-').replace(/\s+/g, '-');
  return CATEGORIES[normalized] ?? DEFAULT_CATEGORY;
}

/** Get all categories as array */
export function getCategoryList(): Category[] {
  return Object.values(CATEGORIES);
}

/** Get style object for inline binding */
export function getCategoryStyle(key: string): { backgroundColor: string; color: string } {
  const cat = getCategory(key);
  return { backgroundColor: cat.bg, color: cat.color };
}

/** Get icon class for category */
export function getCategoryIcon(key: string): string {
  return getCategory(key).icon;
}
