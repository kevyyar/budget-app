create or replace view public.analytics_daily as
select
  e.user_id,
  e.budget_id,
  date_trunc('day', e.expense_date)::date as day,
  sum(e.amount) as total_amount,
  sum(case when e.is_fixed then e.amount else 0 end) as fixed_amount,
  sum(case when not e.is_fixed then e.amount else 0 end) as variable_amount,
  count(*) as expense_count
from public.expenses e
group by e.user_id, e.budget_id, date_trunc('day', e.expense_date);

create or replace view public.analytics_weekly as
select
  e.user_id,
  e.budget_id,
  date_trunc('week', e.expense_date)::date as week_start,
  sum(e.amount) as total_amount,
  sum(case when e.is_fixed then e.amount else 0 end) as fixed_amount,
  sum(case when not e.is_fixed then e.amount else 0 end) as variable_amount,
  count(*) as expense_count
from public.expenses e
group by e.user_id, e.budget_id, date_trunc('week', e.expense_date);

create or replace view public.analytics_monthly as
select
  e.user_id,
  e.budget_id,
  date_trunc('month', e.expense_date)::date as month_start,
  sum(e.amount) as total_amount,
  sum(case when e.is_fixed then e.amount else 0 end) as fixed_amount,
  sum(case when not e.is_fixed then e.amount else 0 end) as variable_amount,
  count(*) as expense_count
from public.expenses e
group by e.user_id, e.budget_id, date_trunc('month', e.expense_date);
