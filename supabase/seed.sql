-- Default categories (system-wide, user_id = null)
-- Budgets must be created per-user via API after login due to RLS
-- Example curl after login:
-- curl -X POST http://localhost:3001/api/budgets \
--   -H "Authorization: Bearer YOUR_TOKEN" \
--   -H "Content-Type: application/json" \
--   -d '{"name":"January 2025","period_start":"2024-12-29","period_end":"2025-01-15","pay_schedule":"biweekly","income_per_pay":3000}'

-- Update system categories in place (preserves FK references)
UPDATE public.categories SET name = 'Comida y Restaurantes', color = '#ef4444', icon = 'pi pi-shopping-cart', sort_order = 1 WHERE user_id IS NULL AND slug = 'food-dining';
UPDATE public.categories SET name = 'Transporte', color = '#06b6d4', icon = 'pi pi-car', sort_order = 2 WHERE user_id IS NULL AND slug = 'transport';
UPDATE public.categories SET name = 'Compras', color = '#8b5cf6', icon = 'pi pi-shopping-bag', sort_order = 3 WHERE user_id IS NULL AND slug = 'shopping';
UPDATE public.categories SET name = 'Servicios', color = '#f59e0b', icon = 'pi pi-bolt', sort_order = 4 WHERE user_id IS NULL AND slug = 'bills-utilities';
UPDATE public.categories SET name = 'Vivienda', color = '#10b981', icon = 'pi pi-home', sort_order = 5 WHERE user_id IS NULL AND slug = 'housing';
UPDATE public.categories SET name = 'Salud', color = '#ec4899', icon = 'pi pi-heart', sort_order = 6 WHERE user_id IS NULL AND slug = 'health';
UPDATE public.categories SET name = 'Entretenimiento', color = '#64748b', icon = 'pi pi-play-circle', sort_order = 7 WHERE user_id IS NULL AND slug = 'entertainment';
UPDATE public.categories SET name = 'Café y Bebidas', color = '#f97316', icon = 'pi pi-dollar', sort_order = 8 WHERE user_id IS NULL AND slug = 'coffee-drinks';
UPDATE public.categories SET name = 'Otros', color = '#6b7280', icon = 'pi pi-tag', sort_order = 9 WHERE user_id IS NULL AND slug = 'other';
