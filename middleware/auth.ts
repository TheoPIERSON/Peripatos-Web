// middleware/auth.ts
export default defineNuxtRouteMiddleware((to) => {
  const { $user } = useNuxtApp();

  // Vérifier si l'utilisateur est connecté
  if (!$user) {
    return navigateTo("/login");
  }

  // Si l'utilisateur est connecté, continuer
  return;
});
