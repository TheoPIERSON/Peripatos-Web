import { stripe } from "~/server/utils/stripe";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: "price_1RjHW7D8iENUB5LaN3GSiy8B", // ton prix
        quantity: 1,
      },
    ],
    metadata: {
      user_id: body.user_id, // Assure-toi d’envoyer le user_id depuis le frontend
    },
    success_url: "https://peripatos.app/success",
    cancel_url: "https://peripatos.app/cancel",
  });

  return { url: session.url };
});
