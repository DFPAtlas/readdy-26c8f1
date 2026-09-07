const CHECKOUT_FUNCTION_URL = "https://zh7zd81sajvo445b8q0j.helloreaddy.com/functions/v1/subscription-checkout";

export async function createCheckoutSession(params: {
  planSlug: string;
  billingCycle: "monthly" | "annual";
  successUrl: string;
  cancelUrl: string;
  companyId?: string;
  token?: string;
}) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (params.token) {
    headers["Authorization"] = `Bearer ${params.token}`;
  }

  const res = await fetch(CHECKOUT_FUNCTION_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({
      planSlug: params.planSlug,
      billingCycle: params.billingCycle,
      successUrl: params.successUrl,
      cancelUrl: params.cancelUrl,
      companyId: params.companyId || "",
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Failed to create checkout session");
  }
  return data as { url: string; sessionId: string };
}

export function getCheckoutUrls(planSlug: string, billingCycle: "monthly" | "annual") {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return {
    successUrl: `${origin}/dashboard?checkout=success&plan=${planSlug}`,
    cancelUrl: `${origin}/?checkout=cancelled#pricing`,
  };
}