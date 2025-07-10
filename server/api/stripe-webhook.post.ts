import { stripe } from "~/server/utils/stripe";
import { buffer } from "micro";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "~/types/database.types";
import type Stripe from "stripe";

const supabase = createClient<Database>(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY! // Nécessite une clé avec droits d'écriture
);

export const config = {
  api: {
    bodyParser: false, // Stripe exige le body brut
  },
};

export default defineEventHandler(async (event) => {
  const sig = event.headers.get("stripe-signature")!;
  const rawBody = await readRawBody(event);

  let stripeEvent;

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

    if (userId) {
      // 🟢 Met à jour l'utilisateur en "premium"
      const { error } = await supabase.from("profiles").update({ subscription_type: "premium" }).eq("id", userId);

      if (error) {
        console.error("❌ Failed to update subscription type:", error);
      } else {
        console.log(`✅ User ${userId} upgraded to premium`);
      }
    }
  }

  return { received: true };
});
