import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-deployment-id, x-tenant-id, x-idempotency-key, x-signature, x-timestamp",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  return new Response(
    JSON.stringify({
      error: "SYNC_INGESTION_DISABLED",
      message:
        "Authenticated synchronisation is temporarily unavailable. No events are being ingested while secure per-deployment authentication is being built. Queued local events are retained and will sync once ingestion is restored.",
    }),
    {
      status: 503,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    }
  );
});
