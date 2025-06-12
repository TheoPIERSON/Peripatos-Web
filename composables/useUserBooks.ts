// composables/useUserBooks.ts
import { useSupabaseClient } from "#imports";
import type { Database } from "~/types/database.types";

export const useUserBooks = () => {
  const supabase = useSupabaseClient<Database>();

  // Types pour une meilleure lisibilité
  type UserBook = Database["public"]["Tables"]["user_books"]["Row"];
  type UserBookInsert = Database["public"]["Tables"]["user_books"]["Insert"];
  type UserBookUpdate = Database["public"]["Tables"]["user_books"]["Update"];

  // Ajouter une relation utilisateur-livre
  const addUserBook = async (userBookData: UserBookInsert): Promise<UserBook> => {
    try {
      const { data, error } = await supabase.from("user_books").insert(userBookData).select().single();

      if (error) {
        console.error("Erreur Supabase lors de l'ajout de user_book:", error);
        throw new Error(`Impossible d'ajouter la relation utilisateur-livre: ${error.message}`);
      }

      if (!data) {
        throw new Error("Aucune donnée retournée après l'ajout de la relation");
      }

      return data;
    } catch (error) {
      console.error("Erreur lors de l'ajout de user_book:", error);
      throw error;
    }
  };

  // Récupérer les livres d'un utilisateur avec leurs détails
  const fetchUserBooksWithDetails = async (userId: string) => {
    if (!userId) {
      throw new Error("ID utilisateur requis");
    }

    try {
      const { data, error } = await supabase
        .from("user_books")
        .select(
          `
          *,
          books (
            id,
            title,
            author,
            genre,
            created_at
          )
        `
        )
        .eq("user_id", userId)
        .order("added_at", { ascending: false });

      if (error) {
        console.error("Erreur Supabase lors de la récupération des livres utilisateur:", error);
        throw new Error(`Impossible de récupérer les livres de l'utilisateur: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error("Erreur lors de la récupération des livres utilisateur:", error);
      throw error;
    }
  };

  // Récupérer une relation utilisateur-livre spécifique
  const fetchUserBook = async (userId: string, bookId: string): Promise<UserBook | null> => {
    if (!userId || !bookId) {
      return null;
    }

    try {
      const { data, error } = await supabase
        .from("user_books")
        .select("*")
        .eq("user_id", userId)
        .eq("book_id", bookId)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return null; // Relation non trouvée
        }
        console.error("Erreur Supabase lors de la récupération de user_book:", error);
        throw new Error(`Erreur lors de la récupération: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error("Erreur lors de la récupération de user_book:", error);
      throw error;
    }
  };

  // Mettre à jour une relation utilisateur-livre
  const updateUserBook = async (id: string, updates: UserBookUpdate): Promise<UserBook | null> => {
    if (!id) {
      throw new Error("ID de la relation requis");
    }

    try {
      const { data, error } = await supabase.from("user_books").update(updates).eq("id", id).select().single();

      if (error) {
        console.error("Erreur Supabase lors de la mise à jour de user_book:", error);
        throw new Error(`Impossible de mettre à jour la relation: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error("Erreur lors de la mise à jour de user_book:", error);
      throw error;
    }
  };

  // Supprimer une relation utilisateur-livre
  const deleteUserBook = async (id: string): Promise<void> => {
    if (!id) {
      throw new Error("ID de la relation requis");
    }

    try {
      const { error } = await supabase.from("user_books").delete().eq("id", id);

      if (error) {
        console.error("Erreur Supabase lors de la suppression de user_book:", error);
        throw new Error(`Impossible de supprimer la relation: ${error.message}`);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de user_book:", error);
      throw error;
    }
  };

  // Basculer le statut favori d'un livre pour un utilisateur
  const toggleFavorite = async (userId: string, bookId: string): Promise<UserBook> => {
    if (!userId || !bookId) {
      throw new Error("ID utilisateur et ID livre requis");
    }

    try {
      // Vérifier si la relation existe déjà
      const existingUserBook = await fetchUserBook(userId, bookId);

      if (existingUserBook) {
        // Mettre à jour le statut favori
        const updated = await updateUserBook(existingUserBook.id, {
          favorite: !existingUserBook.favorite,
        });
        return updated!;
      } else {
        // Créer une nouvelle relation avec favori = true
        return await addUserBook({
          user_id: userId,
          book_id: bookId,
          favorite: true,
          added_at: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error("Erreur lors du basculement du favori:", error);
      throw error;
    }
  };

  // Récupérer les livres favoris d'un utilisateur
  const fetchFavoriteBooks = async (userId: string) => {
    if (!userId) {
      throw new Error("ID utilisateur requis");
    }

    try {
      const { data, error } = await supabase
        .from("user_books")
        .select(
          `
          *,
          books (
            id,
            title,
            author,
            genre,
            created_at
          )
        `
        )
        .eq("user_id", userId)
        .eq("favorite", true)
        .order("added_at", { ascending: false });

      if (error) {
        console.error("Erreur Supabase lors de la récupération des favoris:", error);
        throw new Error(`Impossible de récupérer les favoris: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error("Erreur lors de la récupération des favoris:", error);
      throw error;
    }
  };
  // Récupérer les livres de la liste d'envie d'un utilisateur (note = 0)
  const fetchWishlistBooks = async (userId: string) => {
    if (!userId) {
      throw new Error("ID utilisateur requis");
    }

    try {
      const { data, error } = await supabase
        .from("user_books")
        .select(
          `
          *,
          books (
            id,
            title,
            author,
            genre,
            created_at
          )
        `
        )
        .eq("user_id", userId)
        .eq("note", 0); // <-- La condition clé pour la liste d'envie

      if (error) {
        console.error("Erreur Supabase lors de la récupération de la wishlist:", error);
        throw new Error(`Impossible de récupérer la liste d'envie: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error("Erreur lors de la récupération de la wishlist:", error);
      throw error;
    }
  };

  return {
    // Types exportés
    types: {
      UserBook: {} as UserBook,
      UserBookInsert: {} as UserBookInsert,
      UserBookUpdate: {} as UserBookUpdate,
    },
    // Fonctions
    addUserBook,
    fetchUserBooksWithDetails,
    fetchUserBook,
    updateUserBook,
    deleteUserBook,
    toggleFavorite,
    fetchFavoriteBooks,
    fetchWishlistBooks,
  } as const;
};
