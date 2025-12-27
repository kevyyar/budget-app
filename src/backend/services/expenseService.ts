import type { Expense } from '../types/index.js';
import type { CreateExpenseInput, ExpenseFilters, UpdateExpenseInput } from '../repositories/expensesRepository.js';
import { ExpensesRepository } from '../repositories/expensesRepository.js';

export class ExpenseService {
  private readonly expensesRepo: ExpensesRepository;

  constructor(expensesRepo: ExpensesRepository) {
    this.expensesRepo = expensesRepo;
  }

  listExpenses(filters?: ExpenseFilters): Promise<Expense[]> {
    return this.expensesRepo.listExpenses(filters);
  }

  createExpense(payload: CreateExpenseInput): Promise<Expense> {
    return this.expensesRepo.createExpense(payload);
  }

  updateExpense(id: string, payload: UpdateExpenseInput): Promise<Expense> {
    return this.expensesRepo.updateExpense(id, payload);
  }

  deleteExpense(id: string): Promise<void> {
    return this.expensesRepo.deleteExpense(id);
  }
}
