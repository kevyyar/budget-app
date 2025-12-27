create extension if not exists "pgcrypto";

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  pay_schedule text not null check (pay_schedule in ('weekly','biweekly','monthly')),
  income_per_pay numeric(12,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  period_start date not null,
  period_end date not null,
  pay_schedule text not null check (pay_schedule in ('weekly','biweekly','monthly')),
  income_per_pay numeric(12,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (period_end >= period_start),
  unique (id, user_id),
  unique (user_id, period_start, period_end)
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid null references auth.users(id) on delete cascade,
  slug text not null,
  name text not null,
  color text not null,
  icon text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, slug)
);

create table public.expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  budget_id uuid not null,
  category_id uuid not null references public.categories(id) on delete restrict,
  amount numeric(12,2) not null check (amount > 0),
  description text not null default 'Expense',
  expense_date date not null default current_date,
  is_fixed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint expenses_budget_user_fk
    foreign key (budget_id, user_id)
    references public.budgets (id, user_id)
    on delete cascade
);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger budgets_updated_at
before update on public.budgets
for each row execute function public.set_updated_at();

create trigger categories_updated_at
before update on public.categories
for each row execute function public.set_updated_at();

create trigger expenses_updated_at
before update on public.expenses
for each row execute function public.set_updated_at();

create index expenses_user_date_idx on public.expenses (user_id, expense_date);
create index expenses_user_category_idx on public.expenses (user_id, category_id);
create index expenses_user_budget_idx on public.expenses (user_id, budget_id);
create index budgets_user_period_idx on public.budgets (user_id, period_start, period_end);
create index categories_user_slug_idx on public.categories (user_id, slug);

alter table public.profiles enable row level security;
alter table public.budgets enable row level security;
alter table public.categories enable row level security;
alter table public.expenses enable row level security;

create policy "profiles_select_own"
on public.profiles for select
using (auth.uid() = id);

create policy "profiles_insert_own"
on public.profiles for insert
with check (auth.uid() = id);

create policy "profiles_update_own"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "budgets_select_own"
on public.budgets for select
using (auth.uid() = user_id);

create policy "budgets_insert_own"
on public.budgets for insert
with check (auth.uid() = user_id);

create policy "budgets_update_own"
on public.budgets for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "budgets_delete_own"
on public.budgets for delete
using (auth.uid() = user_id);

create policy "categories_select_global_or_own"
on public.categories for select
using (user_id is null or user_id = auth.uid());

create policy "categories_insert_own"
on public.categories for insert
with check (user_id = auth.uid());

create policy "categories_update_own"
on public.categories for update
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "categories_delete_own"
on public.categories for delete
using (user_id = auth.uid());

create policy "expenses_select_own"
on public.expenses for select
using (auth.uid() = user_id);

create policy "expenses_insert_own"
on public.expenses for insert
with check (auth.uid() = user_id);

create policy "expenses_update_own"
on public.expenses for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "expenses_delete_own"
on public.expenses for delete
using (auth.uid() = user_id);
