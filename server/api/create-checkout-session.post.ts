import { stripe } from "~/server/utils/stripe";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: "price_xxx", // Ton ID de prix Stripe
        quantity: 1,
      },
    ],
    success_url: "https://peripatos.app/success",
    cancel_url: "https://peripatos.app/cancel",
  });

  return { url: session.url };
});
