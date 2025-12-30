create or replace view public.analytics_daily
with (security_invoker = true) as
select
  e.user_id,
  e.budget_id,
  date_trunc('day', e.expense_date)::date as day,
  sum(e.amount) as total_amount,
  sum(case when e.is_fixed then e.amount else 0 end) as fixed_amount,
  sum(case when not e.is_fixed then e.amount else 0 end) as variable_amount,
  count(*) as expense_count
from public.expenses e
where e.user_id = auth.uid()
group by e.user_id, e.budget_id, date_trunc('day', e.expense_date);

create or replace view public.analytics_weekly
with (security_invoker = true) as
select
  e.user_id,
  e.budget_id,
  date_trunc('week', e.expense_date)::date as week_start,
  sum(e.amount) as total_amount,
  sum(case when e.is_fixed then e.amount else 0 end) as fixed_amount,
  sum(case when not e.is_fixed then e.amount else 0 end) as variable_amount,
  count(*) as expense_count
from public.expenses e
where e.user_id = auth.uid()
group by e.user_id, e.budget_id, date_trunc('week', e.expense_date);

create or replace view public.analytics_monthly
with (security_invoker = true) as
select
  e.user_id,
  e.budget_id,
  date_trunc('month', e.expense_date)::date as month_start,
  sum(e.amount) as total_amount,
  sum(case when e.is_fixed then e.amount else 0 end) as fixed_amount,
  sum(case when not e.is_fixed then e.amount else 0 end) as variable_amount,
  count(*) as expense_count
from public.expenses e
where e.user_id = auth.uid()
group by e.user_id, e.budget_id, date_trunc('month', e.expense_date);

revoke all on public.analytics_daily from anon;
revoke all on public.analytics_daily from public;
grant select on public.analytics_daily to authenticated;

revoke all on public.analytics_weekly from anon;
revoke all on public.analytics_weekly from public;
grant select on public.analytics_weekly to authenticated;

revoke all on public.analytics_monthly from anon;
revoke all on public.analytics_monthly from public;
grant select on public.analytics_monthly to authenticated;
