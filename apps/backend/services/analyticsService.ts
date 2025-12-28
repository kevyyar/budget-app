import type { AnalyticsDaily, AnalyticsMonthly, AnalyticsWeekly } from '../types/index.js';
import type { AnalyticsFilters } from '../repositories/analyticsRepository.js';
import { AnalyticsRepository } from '../repositories/analyticsRepository.js';

export class AnalyticsService {
  private readonly analyticsRepo: AnalyticsRepository;

  constructor(analyticsRepo: AnalyticsRepository) {
    this.analyticsRepo = analyticsRepo;
  }

  getDailyTotals(filters?: AnalyticsFilters): Promise<AnalyticsDaily[]> {
    return this.analyticsRepo.getDailyTotals(filters);
  }

  getWeeklyTotals(filters?: AnalyticsFilters): Promise<AnalyticsWeekly[]> {
    return this.analyticsRepo.getWeeklyTotals(filters);
  }

  getMonthlyTotals(filters?: AnalyticsFilters): Promise<AnalyticsMonthly[]> {
    return this.analyticsRepo.getMonthlyTotals(filters);
  }
}
