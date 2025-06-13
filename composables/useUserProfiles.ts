// composables/useUserProfiles.ts
import { useSupabaseClient } from "#imports";
import type { Database } from "~/types/database.types";

export const useUserProfiles = () => {
  const supabase = useSupabaseClient<Database>();

  // Type pour une meilleure lisibilité
  type Profile = Database["public"]["Tables"]["profiles"]["Row"];

  // Récupérer le profil d'un utilisateur
  const getUserProfile = async (userId: string): Promise<Profile | null> => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Erreur Supabase lors de la récupération du profil:", error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Erreur lors de la récupération du profil:", error);
      throw error;
    }
  };

  return { getUserProfile };
};
