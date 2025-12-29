-- Default categories (system-wide, user_id = null)
-- Budgets must be created per-user via API after login due to RLS
-- Example curl after login:
-- curl -X POST http://localhost:3001/api/budgets \
--   -H "Authorization: Bearer YOUR_TOKEN" \
--   -H "Content-Type: application/json" \
--   -d '{"name":"January 2025","period_start":"2024-12-29","period_end":"2025-01-15","pay_schedule":"biweekly","income_per_pay":3000}'

insert into public.categories (user_id, slug, name, color, icon, sort_order) values
  (null, 'food-dining', 'Food & Dining', '#ef4444', 'pi pi-shopping-cart', 1),
  (null, 'transport', 'Transport', '#06b6d4', 'pi pi-car', 2),
  (null, 'shopping', 'Shopping', '#8b5cf6', 'pi pi-shopping-bag', 3),
  (null, 'bills-utilities', 'Bills & Utilities', '#f59e0b', 'pi pi-bolt', 4),
  (null, 'housing', 'Housing', '#10b981', 'pi pi-home', 5),
  (null, 'health', 'Health', '#ec4899', 'pi pi-heart', 6),
  (null, 'entertainment', 'Entertainment', '#64748b', 'pi pi-play-circle', 7),
  (null, 'coffee-drinks', 'Coffee & Drinks', '#f97316', 'pi pi-dollar', 8),
  (null, 'other', 'Other', '#6b7280', 'pi pi-tag', 9)
on conflict (user_id, slug) do update set
  name = excluded.name,
  color = excluded.color,
  icon = excluded.icon,
  sort_order = excluded.sort_order;
