import { Hono } from 'hono';
import { getAppContext } from '../context.js';

const app = new Hono();

// GET /analytics/daily - Get daily spending totals
app.get('/daily', async (c) => {
  const { repos } = getAppContext(c);

  try {
    const budgetId = c.req.query('budget_id');
    const startDate = c.req.query('start_date');
    const endDate = c.req.query('end_date');

    const data = await repos.analytics.getDailyTotals({
      budget_id: budgetId,
      start_date: startDate,
      end_date: endDate,
    });

    return c.json(data);
  } catch (error) {
    return c.json({ error: (error as Error).message }, 500);
  }
});

// GET /analytics/weekly - Get weekly spending totals
app.get('/weekly', async (c) => {
  const { repos } = getAppContext(c);

  try {
    const budgetId = c.req.query('budget_id');
    const startDate = c.req.query('start_date');
    const endDate = c.req.query('end_date');

    const data = await repos.analytics.getWeeklyTotals({
      budget_id: budgetId,
      start_date: startDate,
      end_date: endDate,
    });

    return c.json(data);
  } catch (error) {
    return c.json({ error: (error as Error).message }, 500);
  }
});

// GET /analytics/monthly - Get monthly spending totals
app.get('/monthly', async (c) => {
  const { repos } = getAppContext(c);

  try {
    const budgetId = c.req.query('budget_id');
    const startDate = c.req.query('start_date');
    const endDate = c.req.query('end_date');

    const data = await repos.analytics.getMonthlyTotals({
      budget_id: budgetId,
      start_date: startDate,
      end_date: endDate,
    });

    return c.json(data);
  } catch (error) {
    return c.json({ error: (error as Error).message }, 500);
  }
});

// GET /analytics/summary - Get spending summary for a period
app.get('/summary', async (c) => {
  const { repos } = getAppContext(c);

  try {
    const period = c.req.query('period') ?? 'daily';
    const budgetId = c.req.query('budget_id');
    const today = new Date();
    
    let startDate: string;
    let endDate: string = today.toISOString().split('T')[0];
    
    switch (period) {
      case 'daily':
        startDate = endDate;
        break;
      case 'weekly':
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        startDate = weekStart.toISOString().split('T')[0];
        break;
      case 'monthly':
        startDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-01`;
        break;
      default:
        startDate = endDate;
    }

    const dailyData = await repos.analytics.getDailyTotals({
      budget_id: budgetId,
      start_date: startDate,
      end_date: endDate,
    });

    const totalAmount = dailyData.reduce((sum, day) => sum + Number(day.total_amount), 0);
    const fixedAmount = dailyData.reduce((sum, day) => sum + Number(day.fixed_amount), 0);
    const variableAmount = dailyData.reduce((sum, day) => sum + Number(day.variable_amount), 0);
    const expenseCount = dailyData.reduce((sum, day) => sum + Number(day.expense_count), 0);

    return c.json({
      period,
      start_date: startDate,
      end_date: endDate,
      total_amount: totalAmount,
      fixed_amount: fixedAmount,
      variable_amount: variableAmount,
      expense_count: expenseCount,
    });
  } catch (error) {
    return c.json({ error: (error as Error).message }, 500);
  }
});

export default app;
