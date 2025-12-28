import type { AnalyticsDaily, AnalyticsMonthly, AnalyticsWeekly } from '../types/index.js';
import { BaseRepository } from './baseRepository.js';

export interface AnalyticsFilters {
  budget_id?: string;
  start_date?: string;
  end_date?: string;
}

export class AnalyticsRepository extends BaseRepository {
  async getDailyTotals(filters: AnalyticsFilters = {}): Promise<AnalyticsDaily[]> {
    let query = this.client.from('analytics_daily').select('*').order('day', { ascending: true });

    if (filters.budget_id) {
      query = query.eq('budget_id', filters.budget_id);
    }
    if (filters.start_date) {
      query = query.gte('day', filters.start_date);
    }
    if (filters.end_date) {
      query = query.lte('day', filters.end_date);
    }

    const { data, error } = await query;
    this.handleError(error);
    return (data ?? []) as AnalyticsDaily[];
  }

  async getWeeklyTotals(filters: AnalyticsFilters = {}): Promise<AnalyticsWeekly[]> {
    let query = this.client.from('analytics_weekly').select('*').order('week_start', { ascending: true });

    if (filters.budget_id) {
      query = query.eq('budget_id', filters.budget_id);
    }
    if (filters.start_date) {
      query = query.gte('week_start', filters.start_date);
    }
    if (filters.end_date) {
      query = query.lte('week_start', filters.end_date);
    }

    const { data, error } = await query;
    this.handleError(error);
    return (data ?? []) as AnalyticsWeekly[];
  }

  async getMonthlyTotals(filters: AnalyticsFilters = {}): Promise<AnalyticsMonthly[]> {
    let query = this.client.from('analytics_monthly').select('*').order('month_start', { ascending: true });

    if (filters.budget_id) {
      query = query.eq('budget_id', filters.budget_id);
    }
    if (filters.start_date) {
      query = query.gte('month_start', filters.start_date);
    }
    if (filters.end_date) {
      query = query.lte('month_start', filters.end_date);
    }

    const { data, error } = await query;
    this.handleError(error);
    return (data ?? []) as AnalyticsMonthly[];
  }
}
