// composables/useBooks.ts
export const useBooks = () => {
  const supabase = useSupabaseClient();

  // Récupérer tous les livres
  const fetchBooks = async () => {
    try {
      const { data, error } = await supabase.from("books").select("*").order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Erreur lors de la récupération des livres:", error);
      throw error;
    }
  };

  // Récupérer un livre par ID
  const fetchBookById = async (id: number) => {
    try {
      const { data, error } = await supabase.from("books").select("*").eq("id", id).single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Erreur lors de la récupération du livre:", error);
      throw error;
    }
  };

  // Ajouter un nouveau livre
  const addBook = async (book: any) => {
    try {
      const { data, error } = await supabase.from("books").insert(book).select().single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Erreur lors de l'ajout du livre:", error);
      throw error;
    }
  };

  return {
    fetchBooks,
    fetchBookById,
    addBook,
  };
};
