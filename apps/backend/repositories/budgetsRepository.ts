import type { Budget, PaySchedule } from '../types/index.js';
import { BaseRepository } from './baseRepository.js';

export interface CreateBudgetInput {
  user_id: string;
  name: string;
  period_start: string;
  period_end: string;
  pay_schedule: PaySchedule;
  income_per_pay: number;
}

export interface UpdateBudgetInput {
  name?: string;
  period_start?: string;
  period_end?: string;
  pay_schedule?: PaySchedule;
  income_per_pay?: number;
}

export class BudgetsRepository extends BaseRepository {
  async listBudgets(): Promise<Budget[]> {
    const { data, error } = await this.client
      .from('budgets')
      .select('*')
      .order('created_at', { ascending: false });

    this.handleError(error);
    return (data ?? []) as Budget[];
  }

  async getBudget(id: string): Promise<Budget | null> {
    const { data, error } = await this.client
      .from('budgets')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') {
      this.handleError(error);
    }

    return data ?? null;
  }

  async createBudget(payload: CreateBudgetInput): Promise<Budget> {
    const { data, error } = await this.client
      .from('budgets')
      .insert(payload)
      .select('*')
      .single();

    this.handleError(error);
    return data as Budget;
  }

  async updateBudget(id: string, payload: UpdateBudgetInput): Promise<Budget> {
    const { data, error } = await this.client
      .from('budgets')
      .update(payload)
      .eq('id', id)
      .select('*')
      .single();

    this.handleError(error);
    return data as Budget;
  }

  async deleteBudget(id: string): Promise<void> {
    const { error } = await this.client
      .from('budgets')
      .delete()
      .eq('id', id);

    this.handleError(error);
  }
}
