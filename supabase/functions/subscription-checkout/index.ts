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

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  try {
    const body = await req.json();
    const { planSlug, billingCycle, successUrl, cancelUrl, companyId } = body;

    if (!planSlug || !billingCycle) {
      return new Response(
        JSON.stringify({ error: "planSlug and billingCycle are required" }),
        { status: 400, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
      );
    }

    const { data: plan, error: planError } = await supabase
      .from("plans")
      .select("*")
      .eq("slug", planSlug)
      .eq("is_active", true)
      .maybeSingle();

    if (planError || !plan) {
      return new Response(
        JSON.stringify({ error: "Plan not found or inactive" }),
        { status: 404, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
      );
    }

    const priceField = billingCycle === "annual" ? "stripe_price_id_annual" : "stripe_price_id_monthly";
    let stripePriceId = plan[priceField];

    if (!stripePriceId) {
      const unitAmount = billingCycle === "annual"
        ? Math.round(Number(plan.price_annual) * 100)
        : Math.round(Number(plan.price_monthly) * 100);

      const recurring = billingCycle === "annual"
        ? { interval: "year" as const, interval_count: 1 }
        : { interval: "month" as const, interval_count: 1 };

      const price = await stripe.prices.create({
        unit_amount: unitAmount,
        currency: "gbp",
        recurring,
        product_data: {
          name: `Synqoro ${plan.name}`,
          description: plan.description || `${plan.name} plan — ${billingCycle === "annual" ? "Annual" : "Monthly"} billing`,
        },
      });

      stripePriceId = price.id;

      await supabase.from("plans").update({
        [priceField]: stripePriceId,
      }).eq("id", plan.id);
    }

    const sessionParams: any = {
      mode: "subscription",
      line_items: [{ price: stripePriceId, quantity: 1 }],
      success_url: successUrl || "https://synqoro.com/dashboard?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: cancelUrl || "https://synqoro.com/#pricing",
      subscription_data: {
        trial_period_days: 14,
        metadata: {
          plan_slug: planSlug,
          billing_cycle: billingCycle,
          company_id: companyId || "",
        },
      },
      metadata: {
        plan_slug: planSlug,
        billing_cycle: billingCycle,
        company_id: companyId || "",
      },
      allow_promotion_codes: true,
    };

    if (req.headers.get("authorization")) {
      const token = req.headers.get("authorization")!.replace("Bearer ", "");
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
      if (!authError && user) {
        sessionParams.customer_email = user.email;
      }
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return new Response(
      JSON.stringify({ url: session.url, sessionId: session.id }),
      { headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  }
});
