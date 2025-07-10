import { loadStripe } from "@stripe/stripe-js";

interface CheckoutResponse {
  url: string;
}

export const useCheckout = async () => {
  const res = await $fetch<CheckoutResponse>("/api/create-checkout-session", {
    method: "POST",
    body: {}, // Ajoute des infos si besoin
  });

  const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
  if (stripe) {
    window.location.href = res.url;
  }
};
