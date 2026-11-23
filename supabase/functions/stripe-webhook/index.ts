
import Stripe from "npm:stripe@17.7.0";
import { createClient } from "npm:@supabase/supabase-js@2";

const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
const supabaseUrl = Deno.env.get("SUPABASE_URL");
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!stripeKey || !webhookSecret || !supabaseUrl || !serviceRoleKey) {
  throw new Error("Missing server configuration");
}

const stripe = new Stripe(stripeKey);
const db = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

async function userIdForCustomer(customerId: string): Promise<string | null> {
  const { data, error } = await db
    .from("memberships")
    .select("user_id")
    .eq("stripe_customer_id", customerId)
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data?.user_id ?? null;
}

async function updateSubscription(
  subscription: Stripe.Subscription
): Promise<void> {
  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer.id;

  const userId = await userIdForCustomer(customerId);

  if (!userId) {
    throw new Error(
      `No existing user mapping for Stripe customer ${customerId}`
    );
  }

  const { error } = await db
    .from("memberships")
    .update({
      status: subscription.status,
      stripe_subscription_id: subscription.id,
    })
    .eq("user_id", userId)
    .eq("stripe_customer_id", customerId);

  if (error) throw error;
}

Deno.serve(async (request) => {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return new Response("Missing Stripe signature", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const rawBody = await request.text();

    event = await stripe.webhooks.constructEventAsync(
      rawBody,
      signature,
      webhookSecret
    );
  } catch (error) {
    console.error("Stripe signature verification failed", error);
    return new Response("Invalid Stripe signature", { status: 400 });
  }

  try {
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        await updateSubscription(event.data.object as Stripe.Subscription);
        break;

      default:
        console.info("Ignored Stripe event", event.type);
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error("Webhook processing failed", error);
    return new Response("Webhook processing failed", { status: 500 });
  }
});
