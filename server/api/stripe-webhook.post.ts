import { stripe } from "~/server/utils/stripe";
import { buffer } from "micro";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "~/types/database.types";
import type Stripe from "stripe";

const supabase = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY! // doit avoir les droits d'écriture
);

// Stripe exige le body brut
export const config = {
  api: {
    bodyParser: false,
  },
};

export default defineEventHandler(async (event) => {
  const sig = event.headers.get("stripe-signature");
  const rawBody = await readRawBody(event);

  if (!sig || !rawBody) {
    console.error("❌ Signature ou body manquant");
    return { statusCode: 400, body: "Invalid request" };
  }

  let stripeEvent: Stripe.Event;

  try {
    stripeEvent = stripe.webhooks.constructEvent(rawBody as string, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("❌ Webhook signature verification failed", err);
    return { statusCode: 400, body: `Webhook Error: ${err}` };
  }

  // 🎉 Paiement validé avec succès
  if (stripeEvent.type === "checkout.session.completed") {
    const session = stripeEvent.data.object as Stripe.Checkout.Session;

    const userId = session.metadata?.user_id;
    const newSubscriptionType = session.metadata?.subscription_type || "premium";

    if (userId) {
      const { error } = await supabase
        .from("profiles")
        .update({ subscription_type: newSubscriptionType })
        .eq("id", userId);

      if (error) {
        console.error("❌ Failed to update subscription type:", error);
      } else {
        console.log(`✅ User ${userId} upgraded to ${newSubscriptionType}`);
      }
    } else {
      console.warn("⚠️ user_id absent dans les metadata Stripe");
    }
  }

  return { received: true };
});
