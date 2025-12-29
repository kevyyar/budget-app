import type { Context } from 'hono';
import type { User } from '@supabase/supabase-js';
import { SupabaseClientFactory } from '../db/supabaseClient.js';
import { ProfilesRepository } from '../repositories/profilesRepository.js';
import { BudgetsRepository } from '../repositories/budgetsRepository.js';
import { CategoriesRepository } from '../repositories/categoriesRepository.js';
import { ExpensesRepository } from '../repositories/expensesRepository.js';
import { AnalyticsRepository } from '../repositories/analyticsRepository.js';

export interface AppContext {
  user: User;
  accessToken: string;
  repos: {
    profiles: ProfilesRepository;
    budgets: BudgetsRepository;
    categories: CategoriesRepository;
    expenses: ExpensesRepository;
    analytics: AnalyticsRepository;
  };
}

export function createRequestContext(accessToken: string, user: User): AppContext {
  const factory = new SupabaseClientFactory();
  const client = factory.createUserClient(accessToken);

  return {
    user,
    accessToken,
    repos: {
      profiles: new ProfilesRepository(client),
      budgets: new BudgetsRepository(client),
      categories: new CategoriesRepository(client),
      expenses: new ExpensesRepository(client),
      analytics: new AnalyticsRepository(client),
    },
  };
}

export function getAppContext(c: Context): AppContext {
  const ctx = c.get('appContext') as AppContext | undefined;
  if (!ctx) {
    throw new Error('App context not initialized');
  }
  return ctx;
}
