import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { env } from '../config/env.js';
import { authMiddleware } from './middleware/auth.js';
import analyticsRoutes from './routes/analytics.js';
import authRoutes from './routes/auth.js';
import budgetsRoutes from './routes/budgets.js';
import categoriesRoutes from './routes/categories.js';
import dashboardRoutes from './routes/dashboard.js';
import expensesRoutes from './routes/expenses.js';

const app = new Hono();

app.use('*', logger());
const defaultCorsOrigins = ['http://localhost:5173', 'http://localhost:4173'];
const configuredCorsOrigins = env.corsOrigins.length > 0 ? env.corsOrigins : defaultCorsOrigins;

app.use('*', cors({
  origin: (origin) => {
    if (!origin) return null;
    if (configuredCorsOrigins.includes(origin)) return origin;
    if (env.allowVercelPreview && origin.endsWith('.vercel.app')) return origin;
    return null;
  },
  credentials: false,
}));

app.get('/health', (c) => c.json({ status: 'ok' }));

const api = new Hono();
api.use('*', authMiddleware);
api.route('/auth', authRoutes);
api.route('/categories', categoriesRoutes);
api.route('/budgets', budgetsRoutes);
api.route('/expenses', expensesRoutes);
api.route('/dashboard', dashboardRoutes);
api.route('/analytics', analyticsRoutes);

app.route('/api', api);

export default app;
