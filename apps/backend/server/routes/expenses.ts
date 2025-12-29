import { Hono } from 'hono';
import { getAppContext } from '../context.js';

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

    return c.json(expenses);
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
