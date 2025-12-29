import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { env } from '../config/env.js';
import { authMiddleware } from './middleware/auth.js';
import authRoutes from './routes/auth.js';
import categoriesRoutes from './routes/categories.js';
import budgetsRoutes from './routes/budgets.js';
import expensesRoutes from './routes/expenses.js';
import dashboardRoutes from './routes/dashboard.js';

const app = new Hono();

app.use('*', logger());
app.use('*', cors({
  origin: ['http://localhost:5173', 'http://localhost:4173'],
  credentials: true,
}));

app.get('/health', (c) => c.json({ status: 'ok' }));

const api = new Hono();
api.use('*', authMiddleware);
api.route('/auth', authRoutes);
api.route('/categories', categoriesRoutes);
api.route('/budgets', budgetsRoutes);
api.route('/expenses', expensesRoutes);
api.route('/dashboard', dashboardRoutes);

app.route('/api', api);

serve({ fetch: app.fetch, port: env.port }, (info) => {
  console.log(`Server running on http://localhost:${info.port}`);
});

export default app;
