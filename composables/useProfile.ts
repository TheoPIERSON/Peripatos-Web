// composables/useProfile.ts
import { ref, computed, watch, readonly } from "vue"; // Assurez-vous que 'readonly' est importé
import { useAuth } from "~/composables/useAuth"; // Votre composable useAuth
import { useSupabaseClient } from "#imports"; // Importer useSupabaseClient pour les opérations DB directes

// Définir une interface pour le profil utilisateur avec des types plus précis
export interface UserProfile {
  id: string;
  username: string | null;
  subscription_type: "premium" | "pro" | "freemium"; // S'assurer que c'est toujours un des trois
  created_at: string | null;
  books_created_count: number; // Toujours un nombre, par défaut 0
  monthly_limit: number; // Toujours un nombre
}

export const useProfile = () => {
  const { user, getProfile } = useAuth(); // `getProfile` de useAuth est pour la récupération initiale
  const supabase = useSupabaseClient(); // Instance Supabase pour les mises à jour DB

  const profile = ref<UserProfile | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Mappage des limites mensuelles par type d'abonnement
  const getMonthlyLimit = (subscriptionType: "premium" | "pro" | "freemium"): number => {
    const limits = {
      premium: 200, // Ajusté pour correspondre à la carte 'Pro' de la proposition
      pro: 80, // Ajusté pour correspondre à la carte 'Premium' de la proposition
      freemium: 10,
    };
    return limits[subscriptionType];
  };

  // Valider le type d'abonnement et garantir un fallback
  const validateSubscriptionType = (type: string | null): "premium" | "pro" | "freemium" => {
    const validTypes = ["premium", "pro", "freemium"] as const;
    if (type && validTypes.includes(type as any)) {
      return type as "premium" | "pro" | "freemium";
    }
    return "freemium"; // Par défaut si le type est invalide ou null
  };

  // Récupérer le profil
  const fetchProfile = async (userId: string) => {
    if (!userId) {
      profile.value = null; // Réinitialise le profil si pas d'ID
      isLoading.value = false;
      return;
    }

    isLoading.value = true;
    error.value = null;

    try {
      // Utilisez directement supabase pour fetch le profil pour avoir le contrôle total
      const { data, error: fetchError } = await supabase.from("profiles").select("*").eq("id", userId).single();

      if (fetchError) {
        error.value = "Erreur lors de la récupération du profil";
        console.error("Erreur lors de la récupération du profil:", fetchError);
        // Important: ne pas assigner de données partielles si erreur
        profile.value = null;
        return;
      }

      // Traitement des données du profil pour garantir des valeurs par défaut et types corrects
      const subscriptionType = validateSubscriptionType(data?.subscription_type ?? null);
      const booksCreatedCount = data?.books_created_count ?? 0;
      const monthlyLimit = getMonthlyLimit(subscriptionType); // Calcule la limite basée sur le type validé

      profile.value = {
        id: data?.id || userId, // Assurer que l'ID est toujours présent
        username: data?.username || null,
        subscription_type: subscriptionType,
        created_at: data?.created_at || null,
        books_created_count: booksCreatedCount,
        monthly_limit: monthlyLimit,
      };
    } catch (err) {
      error.value = "Erreur inattendue lors de la récupération du profil.";
      console.error("Erreur inattendue:", err);
      profile.value = null;
    } finally {
      isLoading.value = false;
    }
  };

  // --- NOUVELLE FONCTION : Mettre à jour le type d'abonnement ---
  const updateSubscriptionType = async (newType: "premium" | "pro" | "freemium"): Promise<UserProfile | null> => {
    if (!user.value?.id) {
      throw new Error("Utilisateur non connecté. Impossible de mettre à jour l'abonnement.");
    }
    if (isLoading.value) {
      throw new Error("Une opération est déjà en cours. Veuillez patienter.");
    }

    isLoading.value = true;
    error.value = null;

    try {
      // Valider le nouveau type pour s'assurer qu'il est correct
      const validatedNewType = validateSubscriptionType(newType);
      // Recalculer la limite mensuelle pour le nouveau type
      const newMonthlyLimit = getMonthlyLimit(validatedNewType);

      const { data, error: updateError } = await supabase
        .from("profiles")
        .update({
          subscription_type: validatedNewType,
          // Vous pouvez également réinitialiser books_created_count ici si c'est le début d'un nouveau mois
          // ou si le passage à un nouveau plan doit réinitialiser le compteur
          // books_created_count: 0, // Exemple: réinitialiser le compteur à 0 lors du changement de plan
        })
        .eq("id", user.value.id)
        .select() // Demander les données mises à jour
        .single();

      if (updateError) {
        console.error("Erreur Supabase lors de la mise à jour de l'abonnement:", updateError);
        throw updateError;
      }

      // Mettre à jour le profil localement avec les nouvelles données
      if (data) {
        profile.value = {
          id: data.id,
          username: data.username,
          subscription_type: validateSubscriptionType(data.subscription_type), // Re-valider pour s'assurer
          created_at: data.created_at,
          books_created_count: data.books_created_count ?? 0,
          monthly_limit: getMonthlyLimit(validateSubscriptionType(data.subscription_type)), // Recalculer avec le type confirmé
        };
      }

      return profile.value; // Retourne le profil mis à jour
    } catch (err) {
      const errorMessage = (err as Error).message || "Échec de la mise à jour de l'abonnement.";
      error.value = errorMessage;
      console.error("Erreur lors de la mise à jour de l'abonnement:", err);
      throw err; // Propage l'erreur pour la gestion côté composant
    } finally {
      isLoading.value = false;
    }
  };
  // --- FIN NOUVELLE FONCTION ---

  // Watcher pour récupérer le profil quand l'utilisateur change
  watch(
    user,
    async (newUser) => {
      if (newUser?.id) {
        await fetchProfile(newUser.id);
      } else {
        profile.value = null; // Réinitialise le profil si l'utilisateur se déconnecte
        isLoading.value = false;
      }
    },
    { immediate: true } // Lance la récupération dès que le composable est monté
  );

  // Computed pour des informations dérivées (pas de changement ici, c'est parfait)
  const subscriptionLabel = computed(() => {
    if (!profile.value?.subscription_type) return "Freemium";
    const labels = {
      premium: "Membre Pro", // Ajusté pour correspondre au nouveau nom
      pro: "Membre Premium", // Ajusté pour correspondre au nouveau nom
      freemium: "Membre Freemium",
    };
    return labels[profile.value.subscription_type];
  });

  const subscriptionColor = computed(() => {
    if (!profile.value?.subscription_type) return "text-gray-600";
    const colors = {
      premium: "text-emerald-500", // Couleurs ajustées pour le nouveau design
      pro: "text-sky-500",
      freemium: "text-amber-500",
    };
    return colors[profile.value.subscription_type];
  });

  const borderColor = computed(() => {
    if (!profile.value?.subscription_type) return "border-amber-500";
    const colors = {
      premium: "border-emerald-500",
      pro: "border-sky-500",
      freemium: "border-amber-500",
    };
    return colors[profile.value.subscription_type];
  });

  // Méthode pour rafraîchir le profil
  const refreshProfile = async () => {
    if (user.value?.id) {
      await fetchProfile(user.value.id);
    }
  };

  return {
    profile: readonly(profile),
    isLoading: readonly(isLoading),
    error: readonly(error),
    subscriptionLabel,
    subscriptionColor,
    borderColor,
    refreshProfile,
    updateSubscriptionType, // <-- EXPOSEZ LA NOUVELLE FONCTION ICI
  };
};
