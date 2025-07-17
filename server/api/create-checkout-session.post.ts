import { stripe } from "~/server/utils/stripe";

// Define subscription plan types
const SUBSCRIPTION_PLANS = {
  premium: "price_1RjHW7D8iENUB5LaN3GSiy8B",
  pro: "price_1RjHW7D8iENUB5LaN3GSiy8B", // Replace with actual pro plan ID
} as const;

type SubscriptionPlan = keyof typeof SUBSCRIPTION_PLANS;
import { serverSupabaseUser } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);
  if (!user) {
    throw createError({ statusCode: 401, statusMessage: "Non autorisé" });
  }

  const body = await readBody(event);
  const { subscription_plan } = body;

  const priceMap = {
    premium: "price_1RjHW7D8iENUB5LaN3GSiy8B",
    pro: "price_1RjHXXX...BPRO", // remplace avec le vrai ID Stripe de Pro
  };

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: SUBSCRIPTION_PLANS[subscription_plan as SubscriptionPlan],
        quantity: 1,
      },
    ],
    metadata: {
      user_id: user.id,
      subscription_type: subscription_plan as SubscriptionPlan,
    },
    success_url: "https://peripatos.app/dashboard?success=true",
    cancel_url: "https://peripatos.app/subscription?cancel=true",
  });

  return { url: session.url };
});
