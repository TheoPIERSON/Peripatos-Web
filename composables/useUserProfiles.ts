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
      const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();

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

  // Vérifier si l'utilisateur peut créer un nouveau livre
  const canCreateBook = async (
    userId: string
  ): Promise<{ canCreate: boolean; booksCount: number; isPremium: boolean }> => {
    try {
      const profile = await getUserProfile(userId);

      if (!profile) {
        throw new Error("Profil utilisateur introuvable");
      }

      const booksCount = profile.books_created_count || 0;
      const isPremium = profile.is_premium || false;

      // Les utilisateurs premium peuvent créer autant de livres qu'ils veulent
      if (isPremium) {
        return { canCreate: true, booksCount, isPremium };
      }

      // Les utilisateurs freemium sont limités à 10 livres
      const canCreate = booksCount < 10;
      return { canCreate, booksCount, isPremium };
    } catch (error) {
      console.error("Erreur lors de la vérification des limites:", error);
      throw error;
    }
  };

  // Incrémenter le compteur de livres créés
  const incrementBooksCreated = async (userId: string): Promise<void> => {
    try {
      // Méthode 1: Utiliser rpc() pour une fonction PostgreSQL personnalisée
      const { error } = await supabase.rpc("increment_books_created", {
        user_id: userId,
      });

      if (error) {
        console.error("Erreur lors de l'incrémentation du compteur:", error);
        throw error;
      }
    } catch (error) {
      console.error("Erreur lors de l'incrémentation du compteur:", error);
      throw error;
    }
  };

  // Alternative: Incrémenter le compteur de livres créés (méthode manuelle)
  const incrementBooksCreatedManual = async (userId: string): Promise<void> => {
    try {
      // Récupérer le profil actuel
      const profile = await getUserProfile(userId);

      if (!profile) {
        throw new Error("Profil utilisateur introuvable");
      }

      // Incrémenter et mettre à jour
      const newCount = (profile.books_created_count || 0) + 1;

      const { error } = await supabase
        .from("profiles")
        .update({
          books_created_count: newCount,
        })
        .eq("id", userId);

      if (error) {
        console.error("Erreur lors de l'incrémentation du compteur:", error);
        throw error;
      }
    } catch (error) {
      console.error("Erreur lors de l'incrémentation du compteur:", error);
      throw error;
    }
  };

  return {
    getUserProfile,
    canCreateBook,
    incrementBooksCreated,
    incrementBooksCreatedManual, // Alternative si vous ne voulez pas utiliser rpc
  };
};
