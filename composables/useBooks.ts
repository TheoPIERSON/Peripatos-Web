// composables/useBooks.ts
import { useSupabaseClient } from "#imports";
import type { Book } from "~/types/book";
import type { Database } from "~/types/database.types"; // 👈 1. IMPORTEZ les types générés

export const useBooks = () => {
  const supabase = useSupabaseClient<Database>();

  // Récupérer tous les livres
  const fetchBooks = async (): Promise<Book[]> => {
    try {
      const { data, error } = await supabase.from("books").select("*").order("created_at", { ascending: false });

      if (error) throw error;
      return data as Book[];
    } catch (error) {
      console.error("Erreur lors de la récupération des livres:", error);
      throw error;
    }
  };

  // Récupérer un livre par ID
  const fetchBookById = async (id: string): Promise<Book | null> => {
    try {
      const { data, error } = await supabase.from("books").select("*").eq("id", id).single();

      if (error) throw error;
      return data as Book;
    } catch (error) {
      console.error("Erreur lors de la récupération du livre:", error);
      throw error;
    }
  };

  // Ajouter un nouveau livre
  const addBook = async (book: Book) => {
    try {
      const { data, error } = await supabase.from("books").insert(book).select().single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Erreur lors de l'ajout du livre:", error);
      throw error;
    }
  };

  // Mettre à jour le statut favori d'un livre
  const updateBookFavorite = async (id: string, favorite: boolean): Promise<Book | null> => {
    try {
      const { data, error } = await supabase.from("books").update({ favorite }).eq("id", id).select().single();

      if (error) throw error;
      return data as Book;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du favori:", error);
      throw error;
    }
  };

  return {
    fetchBooks,
    fetchBookById,
    addBook,
    updateBookFavorite,
  };
};
