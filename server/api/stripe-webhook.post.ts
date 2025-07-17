import { stripe } from "~/server/utils/stripe";
import { buffer } from "micro";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "~/types/database.types";
import type Stripe from "stripe";

// Initialise Supabase client avec une clé ayant les droits d'écriture
const supabase = createClient<Database>(process.env.SUPABASE_URL!, process.env.SUPABASE_KEY!);

// Stripe exige le body brut (important pour la vérification de signature)
export const config = {
  api: {
    bodyParser: false,
  },
};

export default defineEventHandler(async (event) => {
  const sig = event.headers.get("stripe-signature")!;
  const rawBody = await readRawBody(event);

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
    const newPlan = session.metadata?.subscription_type;

    if (!userId || !newPlan) {
      console.error("❌ Données manquantes dans les metadata Stripe.");
      return { statusCode: 400, body: "Missing user_id or subscription_type" };
    }

    // 🔄 Met à jour l'abonnement utilisateur dans Supabase
    const { error } = await supabase.from("profiles").update({ subscription_type: newPlan }).eq("id", userId);

    if (error) {
      console.error("❌ Failed to update subscription type:", error);
    } else {
      console.log(`✅ User ${userId} upgraded to ${newPlan}`);
    }
  }

  return { received: true };
});
