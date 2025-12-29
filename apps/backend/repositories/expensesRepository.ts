import type { Expense } from '../types/index.js';
import { BaseRepository } from './baseRepository.js';

export interface CreateExpenseInput {
  budget_id: string;
  category_id: string;
  user_id: string;
  amount: number;
  description?: string;
  expense_date?: string;
  is_fixed?: boolean;
}

export interface UpdateExpenseInput {
  budget_id?: string;
  category_id?: string;
  amount?: number;
  description?: string;
  expense_date?: string;
  is_fixed?: boolean;
}

export interface ExpenseFilters {
  budget_id?: string;
  category_id?: string;
  start_date?: string;
  end_date?: string;
  is_fixed?: boolean;
}

export class ExpensesRepository extends BaseRepository {
  async listExpenses(filters: ExpenseFilters = {}): Promise<Expense[]> {
    let query = this.client.from('expenses').select('*').order('expense_date', { ascending: false });

    if (filters.budget_id) {
      query = query.eq('budget_id', filters.budget_id);
    }
    if (filters.category_id) {
      query = query.eq('category_id', filters.category_id);
    }
    if (filters.start_date) {
      query = query.gte('expense_date', filters.start_date);
    }
    if (filters.end_date) {
      query = query.lte('expense_date', filters.end_date);
    }
    if (filters.is_fixed !== undefined) {
      query = query.eq('is_fixed', filters.is_fixed);
    }

    const { data, error } = await query;
    this.handleError(error);
    return (data ?? []) as Expense[];
  }

  async createExpense(payload: CreateExpenseInput): Promise<Expense> {
    const { data, error } = await this.client
      .from('expenses')
      .insert(payload)
      .select('*')
      .single();

    this.handleError(error);
    return data as Expense;
  }

  async updateExpense(id: string, payload: UpdateExpenseInput): Promise<Expense> {
    const { data, error } = await this.client
      .from('expenses')
      .update(payload)
      .eq('id', id)
      .select('*')
      .single();

    this.handleError(error);
    return data as Expense;
  }

  async deleteExpense(id: string): Promise<void> {
    const { error } = await this.client
      .from('expenses')
      .delete()
      .eq('id', id);

    this.handleError(error);
  }
}
