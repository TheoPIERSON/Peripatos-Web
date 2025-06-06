<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">Mes Livres</h1>

    <div v-if="pending" class="text-center">
      <p>Chargement des livres...</p>
    </div>

    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      <p>Erreur lors du chargement des livres: {{ error }}</p>
    </div>

    <div v-else-if="books && books.length === 0" class="text-center text-gray-500">
      <p>Aucun livre trouvé.</p>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
      <div
        v-for="book in books"
        :key="book.id"
        class="relative group cursor-pointer transform hover:scale-105 transition-transform duration-300 sm:max-w-sm"
      >
        <!-- Conteneur de la couverture -->
        <div class="relative w-auto h-auto rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
          <!-- Image de fond -->
          <img :src="getBookCoverImage(book)" :alt="`Couverture de ${book.title}`" class="w-full h-full object-cover" />

          <!-- Overlay gradient pour améliorer la lisibilité du texte -->
          <div class="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>

          <!-- Contenu texte sur l'image -->
          <div class="absolute inset-0 flex flex-col justify-between p-4 text-white">
            <!-- Titre et auteur en haut -->
            <div class="text-center relative">
              <button
                @click="toggleFavorite(book)"
                class="absolute -top-4 -right-4 p-2 hover:text-red-500 transition-colors"
                :class="{ 'text-red-500': book.favorite, 'text-gray-400': !book.favorite }"
              >
                <Icon
                  :name="book.favorite ? 'fluent-color:heart-28' : 'formkit:heart'"
                  :style="{ color: book.favorite ? 'red' : 'black' }"
                  size="24"
                />
              </button>
              <h2 class="text-2xl font-bold leading-tight mt-22 mb-6 drop-shadow-lg">
                {{ book.title }}
              </h2>
              <p class="text-sm font-medium opacity-90 drop-shadow-md">
                {{ book.author }}
              </p>
            </div>

            <!-- Rating en bas (si disponible) -->
            <div v-if="book.rating" class="flex justify-center items-center">
              <div class="px-3 py-1">
                <div class="flex items-center space-x-1">
                  <span class="text-xl mb-10 font-medium">{{ book.rating }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Informations supplémentaires au survol (optionnel) -->
        <div class="mt-2 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div class="flex flex-col items-center space-y-1">
            <div class="text-xs text-gray-500">
              <p v-if="book.genre">Genre: {{ book.genre }}</p>
              <p>Ajouté le: {{ formatDate(book.created_at) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useBooks } from "~/composables/useBooks"; // ✨ 1. Importer notre composable
import type { Book } from "~/types/book";

// ✨ 2. Initialiser le composable une seule fois et déstructurer les méthodes nécessaires
const { fetchBooks, updateBookFavorite } = useBooks();

// Les refs pour gérer l'état de l'interface, le template est déjà prêt pour ça
const books = ref<Book[]>([]);
const pending = ref(true); // On commence en mode chargement
const error = ref<Error | null>(null);

// ✨ 3. Remplacer useFetch par un appel direct à notre composable au montage du composant
onMounted(async () => {
  try {
    // La fonction fetchBooks vient directement de notre composable
    books.value = await fetchBooks();
  } catch (e) {
    console.error("Erreur attrapée dans le composant:", e);
    error.value = e as Error;
  } finally {
    // Quoi qu'il arrive (succès ou erreur), le chargement est terminé
    pending.value = false;
  }
});

// Correspondance entre les genres et les images de couverture (INCHANGÉ)
const genreToImageMap = {
  philosophie: "/images/cover/blue_sky.png",
  "policier/thriller": "/images/cover/green_nature.png",
  classique: "/images/cover/red_classic.png",
  aventure: "/images/cover/orange_adventure.png",
  romance: "/images/cover/pink_romance.png",
  "science-fiction": "/images/cover/yellow.png",
  histoire: "/images/cover/red_classic.png",
  biographie: "/images/cover/green_nature.png",
  essai: "/images/cover/blue_light.png",
  roman: "/images/cover/red_classic.png",
  fantaisie: "/images/cover/orange_adventure.png",
  science: "/images/cover/orange_adventure.png",
  cuisine: "/images/cover/orange_adventure.png",
  "développement personnel": "/images/cover/green_.png",
};
const defaultCoverImage = "/images/cover/sand.png";
type Genre = keyof typeof genreToImageMap;

// Fonction pour obtenir l'image de couverture d'un livre (INCHANGÉ)
const getBookCoverImage = (book: Book) => {
  if (!book.genre) {
    return defaultCoverImage;
  }
  const normalizedGenre = book.genre.toLowerCase().trim() as Genre;
  return genreToImageMap[normalizedGenre] || defaultCoverImage;
};

// Fonction utilitaire pour formater les dates (INCHANGÉ)
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" });
};

// ✨ 4. Fonction pour basculer le statut favori, maintenant plus propre
const toggleFavorite = async (book: Book) => {
  try {
    // On met à jour l'état local pour une réactivité immédiate (optimistic update)
    book.favorite = !book.favorite;

    // On appelle la BDD en arrière-plan avec la méthode du composable
    await updateBookFavorite(book.id, book.favorite);

    // Note: L'approche "optimistic update" ci-dessus est très rapide pour l'utilisateur.
    // Si vous préférez attendre la confirmation de la base de données, vous pouvez utiliser votre ancienne méthode :
    /*
    const updatedBook = await updateBookFavorite(book.id, !book.favorite);
    if (updatedBook) {
      const index = books.value.findIndex((b) => b.id === book.id);
      if (index !== -1) {
        books.value[index] = updatedBook;
      }
    }
    */
  } catch (err) {
    console.error("Erreur lors de la mise à jour du favori:", err);
    // En cas d'erreur, on annule le changement dans l'interface
    book.favorite = !book.favorite;
    // Ici, vous pourriez afficher une notification d'erreur à l'utilisateur.
  }
};

// Meta données pour SEO (INCHANGÉ)
useHead({
  title: "Mes Livres - Bibliothèque",
  meta: [{ name: "description", content: "Consultez ma collection de livres" }],
});
</script>
