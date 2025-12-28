import type { Budget, PaySchedule } from '../types/index.js';
import type { CreateBudgetInput, UpdateBudgetInput } from '../repositories/budgetsRepository.js';
import { BudgetsRepository } from '../repositories/budgetsRepository.js';

const PAY_MULTIPLIERS: Record<PaySchedule, number> = {
  weekly: 4,
  biweekly: 2,
  monthly: 1
};

export class BudgetService {
  private readonly budgetsRepo: BudgetsRepository;

  constructor(budgetsRepo: BudgetsRepository) {
    this.budgetsRepo = budgetsRepo;
  }

  listBudgets(): Promise<Budget[]> {
    return this.budgetsRepo.listBudgets();
  }

  getBudget(id: string): Promise<Budget | null> {
    return this.budgetsRepo.getBudget(id);
  }

  createBudget(payload: CreateBudgetInput): Promise<Budget> {
    return this.budgetsRepo.createBudget(payload);
  }

  updateBudget(id: string, payload: UpdateBudgetInput): Promise<Budget> {
    return this.budgetsRepo.updateBudget(id, payload);
  }

  deleteBudget(id: string): Promise<void> {
    return this.budgetsRepo.deleteBudget(id);
  }

  calculateMonthlyIncome(paySchedule: PaySchedule, incomePerPay: number): number {
    return incomePerPay * PAY_MULTIPLIERS[paySchedule];
  }
}
