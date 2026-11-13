import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.119.0";
import webpush from "npm:web-push@3.6.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://remo-universe.vercel.app",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const token = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
    if (!token) return json({ error: "Unauthorized" }, 401);

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceKey) throw new Error("Supabase server credentials are missing");

    const admin = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: authorized, error: authError } = await admin.rpc("life_verify_cron_secret", { p_token: token });
    if (authError || authorized !== true) return json({ error: "Unauthorized" }, 401);

    const { data: vapid, error: vapidError } = await admin.rpc("life_get_vapid_keys");
    if (vapidError || !vapid?.publicKey || !vapid?.privateKey) {
      throw new Error("Push signing keys are not configured");
    }
    webpush.setVapidDetails("https://remo-universe.vercel.app/", vapid.publicKey, vapid.privateKey);

    const now = new Date().toISOString();
    const { data: due, error: dueError } = await admin
      .from("life_task_reminders")
      .select("id,user_id,remind_at,life_tasks!inner(title,completed_at)")
      .lte("remind_at", now)
      .is("life_tasks.completed_at", null)
      .order("remind_at", { ascending: true })
      .limit(250);
    if (dueError) throw dueError;

    let sent = 0;
    let skipped = 0;
    let expired = 0;

    for (const reminder of due ?? []) {
      const { data: subscriptions, error: subscriptionsError } = await admin
        .from("life_push_subscriptions")
        .select("id,endpoint,p256dh,auth")
        .eq("user_id", reminder.user_id);
      if (subscriptionsError) throw subscriptionsError;
      const taskRelation = reminder.life_tasks as unknown as { title: string } | { title: string }[];
      const task = Array.isArray(taskRelation) ? taskRelation[0] : taskRelation;
      const title = task?.title || "REMO LIFE";
      const payload = JSON.stringify({
        title: "REMO LIFE",
        body: `حان موعد تذكيرك: ${title}`,
        url: "/#/life",
        tag: `remo-life-${reminder.id}`,
      });

      for (const subscription of subscriptions ?? []) {
        const { data: claim, error: claimError } = await admin
          .from("life_task_reminder_deliveries")
          .insert({ reminder_id: reminder.id, subscription_id: subscription.id })
          .select("id")
          .maybeSingle();

        if (claimError?.code === "23505") { skipped++; continue; }
        if (claimError) throw claimError;
        if (!claim) { skipped++; continue; }

        try {
          await webpush.sendNotification(
            { endpoint: subscription.endpoint, keys: { p256dh: subscription.p256dh, auth: subscription.auth } },
            payload,
            { TTL: 60 * 60 * 24, urgency: "high" },
          );
          const { error: deliveredError } = await admin
            .from("life_task_reminder_deliveries")
            .update({ delivered_at: new Date().toISOString() })
            .eq("id", claim.id);
          if (deliveredError) throw deliveredError;
          sent++;
        } catch (error) {
          const statusCode = Number((error as { statusCode?: number })?.statusCode ?? 0);
          await admin.from("life_task_reminder_deliveries").delete().eq("id", claim.id);
          if (statusCode === 404 || statusCode === 410) {
            await admin.from("life_push_subscriptions").delete().eq("id", subscription.id);
            expired++;
          } else {
            console.error("Push delivery failed", { reminderId: reminder.id, statusCode, message: String(error) });
          }
        }
      }
    }

    return json({ ok: true, due: due?.length ?? 0, sent, skipped, expired, checkedAt: now }, 200);
  } catch (error) {
    console.error("life-push-dispatch failed", error);
    return json({ error: "Push dispatch failed" }, 500);
  }
});

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json", "Cache-Control": "no-store" },
  });
}
