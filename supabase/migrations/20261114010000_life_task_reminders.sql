-- REMO LIFE: multiple independent reminders per task.
-- Safe additive migration: existing life_tasks rows and due_at values are untouched.

create table if not exists public.life_task_reminders (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.life_tasks(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  remind_at timestamptz not null,
  timezone text not null default 'UTC',
  created_at timestamptz not null default now(),
  constraint life_task_reminders_task_time_unique unique (task_id, remind_at),
  constraint life_task_reminders_timezone_length check (char_length(timezone) between 1 and 80)
);

create index if not exists life_task_reminders_user_time_idx
  on public.life_task_reminders (user_id, remind_at);

create index if not exists life_task_reminders_task_idx
  on public.life_task_reminders (task_id);

alter table public.life_task_reminders enable row level security;

drop policy if exists life_task_reminders_select_own on public.life_task_reminders;
create policy life_task_reminders_select_own
  on public.life_task_reminders for select to authenticated
  using (
    user_id = (select auth.uid())
    and exists (
      select 1 from public.life_tasks t
      where t.id = life_task_reminders.task_id
        and t.user_id = (select auth.uid())
    )
  );

drop policy if exists life_task_reminders_insert_own on public.life_task_reminders;
create policy life_task_reminders_insert_own
  on public.life_task_reminders for insert to authenticated
  with check (
    user_id = (select auth.uid())
    and exists (
      select 1 from public.life_tasks t
      where t.id = life_task_reminders.task_id
        and t.user_id = (select auth.uid())
    )
  );

drop policy if exists life_task_reminders_update_own on public.life_task_reminders;
create policy life_task_reminders_update_own
  on public.life_task_reminders for update to authenticated
  using (
    user_id = (select auth.uid())
    and exists (
      select 1 from public.life_tasks t
      where t.id = life_task_reminders.task_id
        and t.user_id = (select auth.uid())
    )
  )
  with check (
    user_id = (select auth.uid())
    and exists (
      select 1 from public.life_tasks t
      where t.id = life_task_reminders.task_id
        and t.user_id = (select auth.uid())
    )
  );

drop policy if exists life_task_reminders_delete_own on public.life_task_reminders;
create policy life_task_reminders_delete_own
  on public.life_task_reminders for delete to authenticated
  using (
    user_id = (select auth.uid())
    and exists (
      select 1 from public.life_tasks t
      where t.id = life_task_reminders.task_id
        and t.user_id = (select auth.uid())
    )
  );
