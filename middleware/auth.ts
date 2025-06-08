// middleware/auth.ts
export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser();

  // Définir uniquement les routes spécifiques qui nécessitent une authentification
  const protectedRoutes = ["/dashboard/favorites", "/dashboard/library", "/dashboard/settings", "/dashboard/wishlist"];

  const isProtectedRoute = protectedRoutes.includes(to.path);

  // Rediriger vers login seulement si la route est protégée et l'utilisateur n'est pas connecté
  if (isProtectedRoute && !user.value) {
    return navigateTo("/login");
  }
});
