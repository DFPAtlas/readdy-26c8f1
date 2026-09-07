import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@13.11.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2023-10-16",
  httpClient: Stripe.createFetchHttpClient(),
});

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const endpointSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET") || "";

serve(async (req) => {
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return new Response("Missing stripe-signature header", { status: 400 });
  }

  try {
    const body = await req.text();
    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      endpointSecret
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const metadata = session.metadata || {};
      const planSlug = metadata.plan_slug;
      const billingCycle = metadata.billing_cycle || "monthly";
      const companyId = metadata.company_id;

      if (!planSlug) {
        return new Response("Missing plan_slug in metadata", { status: 400 });
      }

      const { data: plan } = await supabase
        .from("plans")
        .select("*")
        .eq("slug", planSlug)
        .maybeSingle();

      if (!plan) {
        console.error(`Plan not found: ${planSlug}`);
        return new Response("Plan not found", { status: 404 });
      }

      const pricePerMonth = billingCycle === "annual"
        ? Number(plan.price_annual)
        : Number(plan.price_monthly);

      const now = new Date();
      const periodEnd = new Date(now);
      periodEnd.setMonth(periodEnd.getMonth() + (billingCycle === "annual" ? 12 : 1));

      const subscriptionData = {
        plan: planSlug,
        status: "active",
        billing_cycle: billingCycle,
        price_per_month: pricePerMonth,
        max_users: plan.max_users,
        max_assets: plan.max_assets,
        features: plan.features,
        current_period_start: now.toISOString(),
        current_period_end: periodEnd.toISOString(),
        trial_ends_at: null,
      };

      if (companyId) {
        const { data: existingSub } = await supabase
          .from("subscriptions")
          .select("id")
          .eq("company_id", companyId)
          .maybeSingle();

        if (existingSub) {
          await supabase.from("subscriptions")
            .update(subscriptionData)
            .eq("id", existingSub.id);
        } else {
          await supabase.from("subscriptions")
            .insert({ ...subscriptionData, company_id: companyId });
        }

        await supabase.from("companies")
          .update({
            subscription_plan: planSlug,
            account_status: "active",
          })
          .eq("id", companyId);
      }

      await supabase.from("payment_events").insert({
        company_id: companyId || null,
        event_type: "checkout.session.completed",
        stripe_event_id: event.id,
        payload: {
          session_id: session.id,
          plan_slug: planSlug,
          billing_cycle: billingCycle,
          amount_total: session.amount_total,
          currency: session.currency,
          customer_email: session.customer_details?.email,
        },
      });
    }

    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object;
      const metadata = subscription.metadata || {};
      const companyId = metadata.company_id;

      if (companyId) {
        await supabase.from("subscriptions")
          .update({ status: "cancelled" })
          .eq("company_id", companyId);

        await supabase.from("companies")
          .update({ account_status: "suspended" })
          .eq("id", companyId);
      }

      await supabase.from("payment_events").insert({
        company_id: companyId || null,
        event_type: "customer.subscription.deleted",
        stripe_event_id: event.id,
        payload: { subscription_id: subscription.id },
      });
    }

    if (event.type === "customer.subscription.updated") {
      const subscription = event.data.object;
      const metadata = subscription.metadata || {};
      const companyId = metadata.company_id;

      if (companyId) {
        const statusMap: Record<string, string> = {
          active: "active",
          past_due: "past_due",
          unpaid: "suspended",
          canceled: "cancelled",
        };

        const mappedStatus = statusMap[subscription.status] || "active";

        await supabase.from("subscriptions")
          .update({
            status: mappedStatus,
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          })
          .eq("company_id", companyId);

        if (mappedStatus === "suspended" || mappedStatus === "cancelled") {
          await supabase.from("companies")
            .update({ account_status: mappedStatus })
            .eq("id", companyId);
        }
      }

      await supabase.from("payment_events").insert({
        company_id: companyId || null,
        event_type: "customer.subscription.updated",
        stripe_event_id: event.id,
        payload: {
          subscription_id: subscription.id,
          status: subscription.status,
          current_period_end: subscription.current_period_end,
        },
      });
    }

    if (event.type === "invoice.paid") {
      const invoice = event.data.object;
      const subscriptionMetadata = invoice.subscription_details?.metadata || {};
      const companyId = subscriptionMetadata.company_id;

      if (invoice.amount_paid > 0 && companyId) {
        await supabase.from("payments").insert({
          company_id: companyId,
          amount: invoice.amount_paid / 100,
          currency: invoice.currency,
          status: "paid",
          payment_method: "card",
          stripe_payment_intent_id: invoice.payment_intent || null,
          stripe_charge_id: invoice.charge || null,
          paid_at: new Date().toISOString(),
        });
      }

      await supabase.from("payment_events").insert({
        company_id: companyId || null,
        event_type: "invoice.paid",
        stripe_event_id: event.id,
        payload: {
          invoice_id: invoice.id,
          amount_paid: invoice.amount_paid,
          currency: invoice.currency,
        },
      });
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("Webhook error:", err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }
});
