-- Explicit service-role-only policy for the private delivery ledger.
-- The table remains inaccessible to anon/authenticated and has RLS enabled.
drop policy if exists life_task_reminder_deliveries_service_role_all on public.life_task_reminder_deliveries; create policy life_task_reminder_deliveries_service_role_all on public.life_task_reminder_deliveries for all to service_role using (true) with check (true);
