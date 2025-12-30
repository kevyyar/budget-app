import { Hono } from 'hono';
import { getAppContext } from '../context.js';
import type { Expense, Category } from '../../types/index.js';

export interface ExpenseWithCategory extends Expense {
  category: Category;
}

const app = new Hono();

app.get('/', async (c) => {
  const { repos } = getAppContext(c);

  try {
    const budgetId = c.req.query('budget_id');
    const limit = c.req.query('limit');

    let expenses = await repos.expenses.listExpenses(
      budgetId ? { budget_id: budgetId } : {}
    );

    if (limit) {
      expenses = expenses.slice(0, parseInt(limit, 10));
    }

    const categories = await repos.categories.listCategories();
    const categoryMap = new Map(categories.map((cat) => [cat.id, cat]));

    const expensesWithCategory: ExpenseWithCategory[] = expenses.map((expense) => ({
      ...expense,
      category: categoryMap.get(expense.category_id) ?? {
        id: expense.category_id,
        user_id: null,
        slug: 'other',
        name: 'Other',
        color: '#6b7280',
        icon: 'pi pi-tag',
        sort_order: 99,
        created_at: '',
        updated_at: '',
      },
    }));

    return c.json(expensesWithCategory);
  } catch (error) {
    return c.json({ error: (error as Error).message }, 500);
  }
});

app.post('/', async (c) => {
  const { repos, user } = getAppContext(c);

  try {
    const body = await c.req.json();
    const expense = await repos.expenses.createExpense({
      ...body,
      user_id: user.id,
    });
    return c.json(expense, 201);
  } catch (error) {
    return c.json({ error: (error as Error).message }, 500);
  }
});

app.delete('/:id', async (c) => {
  const { repos } = getAppContext(c);
  const id = c.req.param('id');

  try {
    await repos.expenses.deleteExpense(id);
    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: (error as Error).message }, 500);
  }
});

export default app;
