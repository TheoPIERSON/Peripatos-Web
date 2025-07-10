// composables/useProfile.ts
import { ref, computed, watch } from "vue";
import { useAuth } from "~/composables/useAuth";

export interface UserProfile {
  id: string;
  username: string | null;
  subscription_type: "premium" | "pro" | "freemium" | null;
  created_at: string | null;
  books_created_count: number | null;
  monthly_limit: number | null;
}

export const useProfile = () => {
  const { user, getProfile } = useAuth();
  const profile = ref<UserProfile | null>(null);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Calculer la limite mensuelle en fonction du type d'abonnement
  const getMonthlyLimit = (subscriptionType: string): number => {
    const limits = {
      premium: 30,
      pro: 100,
      freemium: 10,
    };
    return limits[subscriptionType as keyof typeof limits] || 10;
  };

  // Valider le type d'abonnement
  const validateSubscriptionType = (type: string | null): "premium" | "pro" | "freemium" => {
    const validTypes = ["premium", "pro", "freemium"] as const;
    return validTypes.includes(type as any) ? (type as any) : "freemium";
  };

  // Récupérer le profil
  const fetchProfile = async (userId: string) => {
    if (!userId) return;

    isLoading.value = true;
    error.value = null;

    try {
      const { data, error: fetchError } = await getProfile(userId);

      if (fetchError) {
        error.value = "Erreur lors de la récupération du profil";
        console.error("Erreur lors de la récupération du profil:", fetchError);
        return;
      }

      // Traitement des données du profil
      const subscriptionType = validateSubscriptionType(data?.subscription_type ?? null);
      const monthlyLimit = getMonthlyLimit(subscriptionType);

      profile.value = {
        id: data?.id || "",
        username: data?.username || null,
        subscription_type: subscriptionType,
        created_at: data?.created_at || null,
        books_created_count: data?.books_created_count || 0,
        monthly_limit: monthlyLimit,
      };
    } catch (err) {
      error.value = "Erreur lors de la récupération du profil";
      console.error("Erreur:", err);
    } finally {
      isLoading.value = false;
    }
  };

  // Watcher pour récupérer le profil quand l'utilisateur change
  watch(
    user,
    async (newUser) => {
      if (newUser?.id) {
        await fetchProfile(newUser.id);
      } else {
        profile.value = null;
      }
    },
    { immediate: true }
  );

  // Computed pour des informations dérivées
  const subscriptionLabel = computed(() => {
    if (!profile.value?.subscription_type) return "Freemium";

    const labels = {
      premium: "Membre premium",
      pro: "Membre pro",
      freemium: "Membre freemium",
    };

    return labels[profile.value.subscription_type];
  });

  const subscriptionColor = computed(() => {
    if (!profile.value?.subscription_type) return "text-gray-600";

    const colors = {
      premium: "text-green-600",
      pro: "text-blue-600",
      freemium: "text-gray-600",
    };

    return colors[profile.value.subscription_type];
  });

  const borderColor = computed(() => {
    if (!profile.value?.subscription_type) return "border-yellow-500";

    const colors = {
      premium: "border-green-500",
      pro: "border-blue-500",
      freemium: "border-yellow-500",
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
  };
};
