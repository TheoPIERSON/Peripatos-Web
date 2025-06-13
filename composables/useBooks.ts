// composables/useBooks.ts
import { useSupabaseClient } from "#imports";
import type { Database } from "~/types/database.types";

export const useBooks = () => {
  const supabase = useSupabaseClient<Database>();

  // Types pour une meilleure lisibilité
  type Book = Database["public"]["Tables"]["books"]["Row"];
  type BookInsert = Database["public"]["Tables"]["books"]["Insert"];
  type BookUpdate = Database["public"]["Tables"]["books"]["Update"];

  // NOUVELLE FONCTION - Rechercher des livres existants
  const searchBooks = async (query: string): Promise<Book[]> => {
    if (!query || query.trim().length < 2) {
      return [];
    }

    try {
      const searchTerm = query.trim();

      const { data, error } = await supabase
        .from("books")
        .select("*")
        .or(`title.ilike.%${searchTerm}%,author.ilike.%${searchTerm}%`)
        .order("created_at", { ascending: false })
        .limit(10); // Limiter à 10 résultats pour la performance

      if (error) {
        console.error("Erreur Supabase lors de la recherche de livres:", error);
        throw new Error(`Impossible de rechercher les livres: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error("Erreur lors de la recherche de livres:", error);
      throw error;
    }
  };

  // NOUVELLE FONCTION - Rechercher des livres par titre et auteur exact
  const findExactMatch = async (title: string, author: string): Promise<Book | null> => {
    if (!title?.trim() || !author?.trim()) {
      return null;
    }

    try {
      const { data, error } = await supabase
        .from("books")
        .select("*")
        .ilike("title", title.trim())
        .ilike("author", author.trim())
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return null; // Aucun livre correspondant trouvé
        }
        console.error("Erreur Supabase lors de la recherche exacte:", error);
        throw new Error(`Erreur lors de la recherche: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error("Erreur lors de la recherche exacte:", error);
      throw error;
    }
  };

  // NOUVELLE FONCTION - Vérifier si un utilisateur a déjà ce livre dans sa bibliothèque
  const checkUserHasBook = async (userId: string, bookId: string): Promise<boolean> => {
    if (!userId || !bookId) {
      return false;
    }

    try {
      const { data, error } = await supabase
        .from("user_books")
        .select("id")
        .eq("user_id", userId)
        .eq("book_id", bookId)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return false; // L'utilisateur n'a pas ce livre
        }
        console.error("Erreur lors de la vérification:", error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error("Erreur lors de la vérification de possession du livre:", error);
      return false;
    }
  };

  // Récupérer tous les livres
  const fetchBooks = async (): Promise<Book[]> => {
    try {
      const { data, error } = await supabase.from("books").select("*").order("created_at", { ascending: false });

      if (error) {
        console.error("Erreur Supabase lors de la récupération des livres:", error);
        throw new Error(`Impossible de récupérer les livres: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error("Erreur lors de la récupération des livres:", error);
      throw error;
    }
  };

  // Récupérer les livres d'un utilisateur
  const fetchUserBooks = async (userId: string): Promise<Book[]> => {
    if (!userId) {
      throw new Error("ID utilisateur requis");
    }

    try {
      const { data, error } = await supabase
        .from("books")
        .select("*")
        .eq("created_by", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erreur Supabase lors de la récupération des livres utilisateur:", error);
        throw new Error(`Impossible de récupérer les livres de l'utilisateur: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error("Erreur lors de la récupération des livres de l'utilisateur:", error);
      throw error;
    }
  };

  // Vérifier si un livre appartient à un utilisateur
  const isBookAssociated = async (bookId: string, userId: string): Promise<boolean> => {
    if (!bookId || !userId) {
      return false;
    }

    try {
      const { data, error } = await supabase
        .from("books")
        .select("id")
        .eq("id", bookId)
        .eq("created_by", userId)
        .single();

      if (error) {
        // Si l'erreur est "No rows returned", ce n'est pas une vraie erreur
        if (error.code === "PGRST116") {
          return false;
        }
        console.error("Erreur Supabase lors de la vérification de l'association:", error);
        throw new Error(`Erreur lors de la vérification: ${error.message}`);
      }

      return !!data;
    } catch (error) {
      console.error("Erreur lors de la vérification de l'association:", error);
      return false;
    }
  };

  // Associer un livre à un utilisateur
  const associateBook = async (bookId: string, userId: string): Promise<Book | null> => {
    if (!bookId || !userId) {
      throw new Error("ID du livre et ID utilisateur requis");
    }

    try {
      const { data, error } = await supabase
        .from("books")
        .update({ created_by: userId })
        .eq("id", bookId)
        .select()
        .single();

      if (error) {
        console.error("Erreur Supabase lors de l'association du livre:", error);
        throw new Error(`Impossible d'associer le livre: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error("Erreur lors de l'association du livre:", error);
      throw error;
    }
  };

  // Désassocier un livre d'un utilisateur
  const disassociateBook = async (bookId: string): Promise<Book | null> => {
    if (!bookId) {
      throw new Error("ID du livre requis");
    }

    try {
      const { data, error } = await supabase
        .from("books")
        .update({ created_by: null })
        .eq("id", bookId)
        .select()
        .single();

      if (error) {
        console.error("Erreur Supabase lors de la désassociation du livre:", error);
        throw new Error(`Impossible de désassocier le livre: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error("Erreur lors de la désassociation du livre:", error);
      throw error;
    }
  };

  // Récupérer un livre par ID
  const fetchBookById = async (id: string): Promise<Book | null> => {
    if (!id) {
      throw new Error("ID du livre requis");
    }

    try {
      const { data, error } = await supabase.from("books").select("*").eq("id", id).single();

      if (error) {
        if (error.code === "PGRST116") {
          return null; // Livre non trouvé
        }
        console.error("Erreur Supabase lors de la récupération du livre:", error);
        throw new Error(`Impossible de récupérer le livre: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error("Erreur lors de la récupération du livre:", error);
      throw error;
    }
  };

  // Ajouter un nouveau livre - CORRIGÉ avec le bon type
  const addBook = async (bookData: BookInsert): Promise<Book> => {
    try {
      const { data, error } = await supabase.from("books").insert(bookData).select().single();

      if (error) {
        console.error("Erreur Supabase lors de l'ajout du livre:", error);
        throw new Error(`Impossible d'ajouter le livre: ${error.message}`);
      }

      if (!data) {
        throw new Error("Aucune donnée retournée après l'ajout du livre");
      }

      return data;
    } catch (error) {
      console.error("Erreur lors de l'ajout du livre:", error);
      throw error;
    }
  };

  // Mettre à jour un livre
  const updateBook = async (id: string, updates: BookUpdate): Promise<Book | null> => {
    if (!id) {
      throw new Error("ID du livre requis");
    }

    try {
      const { data, error } = await supabase.from("books").update(updates).eq("id", id).select().single();

      if (error) {
        console.error("Erreur Supabase lors de la mise à jour du livre:", error);
        throw new Error(`Impossible de mettre à jour le livre: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du livre:", error);
      throw error;
    }
  };

  // Supprimer un livre
  const deleteBook = async (id: string): Promise<void> => {
    if (!id) {
      throw new Error("ID du livre requis");
    }

    try {
      const { error } = await supabase.from("books").delete().eq("id", id);

      if (error) {
        console.error("Erreur Supabase lors de la suppression du livre:", error);
        throw new Error(`Impossible de supprimer le livre: ${error.message}`);
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du livre:", error);
      throw error;
    }
  };

  // Mettre à jour les préférences d'un livre pour un utilisateur
  const updateUserBookPreferences = async (
    userId: string,
    bookId: string,
    updates: {
      favorite?: boolean;
      note?: number;
      review?: string;
      added_at?: string;
    }
  ): Promise<void> => {
    if (!userId || !bookId) {
      throw new Error("ID utilisateur et ID livre requis");
    }

    try {
      const { error } = await supabase.from("user_books").update(updates).eq("user_id", userId).eq("book_id", bookId);

      if (error) {
        console.error("Erreur lors de la mise à jour des préférences:", error);
        throw new Error(`Impossible de mettre à jour les préférences: ${error.message}`);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour des préférences:", error);
      throw error;
    }
  };

  return {
    // Types exportés pour utilisation dans les composants
    types: {
      Book: {} as Book,
      BookInsert: {} as BookInsert,
      BookUpdate: {} as BookUpdate,
    },
    // Fonctions existantes
    fetchBooks,
    fetchBookById,
    addBook,
    updateBook,
    deleteBook,
    fetchUserBooks,
    isBookAssociated,
    associateBook,
    disassociateBook,
    // NOUVELLES FONCTIONS
    searchBooks,
    findExactMatch,
    checkUserHasBook,
    updateUserBookPreferences,
  } as const;
};
