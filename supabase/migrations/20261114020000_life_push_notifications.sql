-- REMO LIFE: secure Web Push subscriptions and idempotent reminder delivery.
-- Additive only: preserves existing tasks and reminder rows.

create extension if not exists pg_cron;
create extension if not exists pg_net;

create table if not exists public.life_push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint life_push_subscriptions_endpoint_length check (char_length(endpoint) between 1 and 4096),
  constraint life_push_subscriptions_p256dh_length check (char_length(p256dh) between 1 and 256),
  constraint life_push_subscriptions_auth_length check (char_length(auth) between 1 and 256)
);

create index if not exists life_push_subscriptions_user_idx
  on public.life_push_subscriptions(user_id);

alter table public.life_push_subscriptions enable row level security;

drop policy if exists life_push_subscriptions_select_own on public.life_push_subscriptions;
create policy life_push_subscriptions_select_own on public.life_push_subscriptions
  for select to authenticated using (user_id = (select auth.uid()));

drop policy if exists life_push_subscriptions_insert_own on public.life_push_subscriptions;
create policy life_push_subscriptions_insert_own on public.life_push_subscriptions
  for insert to authenticated with check (user_id = (select auth.uid()));

drop policy if exists life_push_subscriptions_update_own on public.life_push_subscriptions;
create policy life_push_subscriptions_update_own on public.life_push_subscriptions
  for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

drop policy if exists life_push_subscriptions_delete_own on public.life_push_subscriptions;
create policy life_push_subscriptions_delete_own on public.life_push_subscriptions
  for delete to authenticated using (user_id = (select auth.uid()));

create table if not exists public.life_task_reminder_deliveries (
  id uuid primary key default gen_random_uuid(),
  reminder_id uuid not null references public.life_task_reminders(id) on delete cascade,
  subscription_id uuid not null references public.life_push_subscriptions(id) on delete cascade,
  delivered_at timestamptz,
  created_at timestamptz not null default now(),
  constraint life_task_reminder_deliveries_once unique (reminder_id, subscription_id)
);

create index if not exists life_task_reminder_deliveries_pending_idx
  on public.life_task_reminder_deliveries(created_at) where delivered_at is null;

alter table public.life_task_reminder_deliveries enable row level security;
revoke all on public.life_task_reminder_deliveries from anon, authenticated;

create or replace function public.life_get_vapid_keys()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  result jsonb;
begin
  if (select auth.jwt() ->> 'role') is distinct from 'service_role' then
    raise exception 'service role required';
  end if;
  select decrypted_secret::jsonb into result
  from vault.decrypted_secrets
  where name = 'life_push_vapid_keys';
  if result is null then raise exception 'VAPID keys are not configured'; end if;
  return result;
end;
$$;

revoke all on function public.life_get_vapid_keys() from public, anon, authenticated;
grant execute on function public.life_get_vapid_keys() to service_role;

create or replace function public.life_verify_cron_secret(p_token text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (select auth.jwt() ->> 'role') is distinct from 'service_role' then
    raise exception 'service role required';
  end if;
  return exists (
    select 1 from vault.decrypted_secrets
    where name = 'life_push_cron_secret'
      and decrypted_secret = p_token
  );
end;
$$;

revoke all on function public.life_verify_cron_secret(text) from public, anon, authenticated;
grant execute on function public.life_verify_cron_secret(text) to service_role;

-- Run the dispatcher once per minute. The shared secret stays in Vault.
select cron.schedule(
  'remo-life-push-dispatch',
  '* * * * *',
  $job$
    select net.http_post(
      url := 'https://znpzffgdqxtdceqofika.supabase.co/functions/v1/life-push-dispatch',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || (
          select decrypted_secret from vault.decrypted_secrets
          where name = 'life_push_cron_secret'
        )
      ),
      body := '{}'::jsonb,
      timeout_milliseconds := 10000
    );
  $job$
);
