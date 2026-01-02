import { Hono } from 'hono';
import { getAppContext } from '../context.js';
import type { Expense, Category } from '../../types/index.js';

export interface ExpenseWithCategory extends Expense {
  category: Category;
}

export interface PaginatedExpenses {
  items: ExpenseWithCategory[];
  hasNextPage: boolean;
}

const app = new Hono();

app.get('/', async (c) => {
  const { repos } = getAppContext(c);

  try {
    const budgetId = c.req.query('budget_id');
    const limitParam = c.req.query('limit');
    const offsetParam = c.req.query('offset');

    const limit = limitParam ? parseInt(limitParam, 10) : 20;
    const offset = offsetParam ? parseInt(offsetParam, 10) : 0;

    // Over-fetch by 1 to detect if there's a next page
    const expenses = await repos.expenses.listExpenses({
      budget_id: budgetId,
      limit: limit + 1,
      offset,
    });

    const hasNextPage = expenses.length > limit;
    const pageExpenses = hasNextPage ? expenses.slice(0, limit) : expenses;

    const categories = await repos.categories.listCategories();
    const categoryMap = new Map(categories.map((cat) => [cat.id, cat]));

    const items: ExpenseWithCategory[] = pageExpenses.map((expense) => ({
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

    return c.json({ items, hasNextPage } as PaginatedExpenses);
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
