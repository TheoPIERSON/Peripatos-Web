// middleware/auth.ts
export default defineNuxtRouteMiddleware((to) => {
  const { $user } = useNuxtApp();

  // Si l'utilisateur n'est pas connecté, rediriger vers login
  if (!$user.value) {
    return navigateTo("/login");
  }
});
