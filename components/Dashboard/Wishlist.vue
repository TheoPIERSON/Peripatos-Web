<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">Ma Liste d'envie</h1>

    <div v-if="pending" class="text-center">
      <p>Chargement des livres...</p>
    </div>

    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      <p>Erreur lors du chargement des livres: {{ error.message }}</p>
    </div>

    <div v-else-if="wishlistBooks && wishlistBooks.length === 0" class="text-center text-gray-500">
      <p>Aucun livre trouvé dans votre liste d'envie.</p>
    </div>

    <div v-else class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-10">
      <div
        v-for="book in wishlistBooks"
        :key="book.id"
        class="relative group cursor-pointer transform hover:scale-105 transition-transform duration-300 w-full max-w-sm mx-auto"
      >
        <!-- Conteneur de la couverture -->
        <div
          class="relative w-full aspect-[3/4] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
        >
          <!-- Image de fond -->
          <img :src="getBookCoverImage(book)" :alt="`Couverture de ${book.title}`" class="w-full h-full object-cover" />

          <!-- Overlay gradient pour améliorer la lisibilité du texte -->
          <div class="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>

          <!-- Contenu texte sur l'image -->
          <div class="absolute inset-0 flex flex-col justify-between p-2 sm:p-4 text-white">
            <!-- Titre et auteur en haut -->
            <div class="text-center">
              <h2
                class="text-sm sm:text-lg lg:text-2xl font-bold leading-tight mt-6 sm:mt-22 mb-2 sm:mb-6 drop-shadow-lg line-clamp-3"
              >
                {{ book.title }}
              </h2>
              <p class="text-xs sm:text-sm font-medium opacity-90 drop-shadow-md line-clamp-2">
                {{ book.author }}
              </p>
            </div>

            <!-- Rating en bas (si disponible) -->
            <div v-if="book.rating" class="flex justify-center items-center">
              <div class="px-1 sm:px-3 py-1">
                <div class="flex items-center space-x-1">
                  <span class="text-sm sm:text-xl mb-2 sm:mb-10 font-medium">{{ book.rating }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Informations supplémentaires au survol (masquées sur mobile pour économiser l'espace) -->
        <div class="hidden sm:block mt-2 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div class="flex flex-col items-center space-y-1">
            <button
              @click="toggleFavorite(book)"
              class="p-2 hover:text-red-500 transition-colors"
              :class="{ 'text-red-500': book.favorite, 'text-gray-400': !book.favorite }"
            >
              <i class="fas fa-heart"></i>
            </button>
            <div class="text-xs text-gray-500">
              <p v-if="book.genre">Genre: {{ book.genre }}</p>
              <p>Ajouté le: {{ formatDate(book.added_at) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
// ✨ 1. On importe les bons composables
import { useUserBooks } from "~/composables/useUserBooks";
import { useSupabaseUser } from "#imports";

// Le type pour nos livres, cohérent avec les autres pages
type DisplayBook = {
  id: string; // ID du livre
  userBookId: string;
  title: string | null;
  author: string | null;
  genre: string | null;
  favorite: boolean | null;
  rating: number | null;
  added_at: string | null;
};

// ✨ 2. On récupère l'utilisateur et on initialise le composable
const user = useSupabaseUser();
// On récupère notre nouvelle fonction fetchWishlistBooks et celle pour les favoris
const { fetchWishlistBooks, toggleFavorite: toggleFavoriteInDb } = useUserBooks();

// Les refs pour l'état de l'interface
const wishlistBooks = ref<DisplayBook[]>([]);
const pending = ref(true);
const error = ref<Error | null>(null);

// ✨ 3. Au montage, on charge UNIQUEMENT les livres de la liste d'envie
onMounted(async () => {
  if (!user.value) {
    pending.value = false;
    return;
  }

  try {
    // Appel direct à la fonction optimisée
    const wishlistFromDb = await fetchWishlistBooks(user.value.id);

    // On transforme les données pour le template
    wishlistBooks.value = wishlistFromDb
      .map((userBook) => {
        if (!userBook.books) return null;
        return {
          id: userBook.books.id,
          userBookId: userBook.id,
          title: userBook.books.title,
          author: userBook.books.author,
          genre: userBook.books.genre,
          favorite: userBook.favorite,
          rating: userBook.note,
          added_at: userBook.added_at,
        };
      })
      .filter((book): book is DisplayBook => book !== null);
  } catch (e) {
    console.error("Erreur attrapée dans le composant:", e);
    error.value = e as Error;
  } finally {
    pending.value = false;
  }
});

// ✨ 4. Fonction pour gérer le favori (identique à celle de "Mes Livres")
const toggleFavorite = async (book: DisplayBook) => {
  if (!user.value) {
    alert("Veuillez vous connecter pour gérer vos favoris.");
    return;
  }

  // Mise à jour optimiste
  const originalFavoriteStatus = book.favorite;
  book.favorite = !book.favorite;

  try {
    await toggleFavoriteInDb(user.value.id, book.id);
  } catch (err) {
    console.error("Erreur lors de la mise à jour du favori:", err);
    book.favorite = originalFavoriteStatus; // On annule en cas d'erreur
    alert("Une erreur est survenue.");
  }
};

// ----- Fonctions utilitaires (INCHANGÉES) -----

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

const getBookCoverImage = (book: DisplayBook) => {
  if (!book.genre) return defaultCoverImage;
  const normalizedGenre = book.genre.toLowerCase().trim() as Genre;
  return genreToImageMap[normalizedGenre] || defaultCoverImage;
};

const formatDate = (dateString: string | null): string => {
  if (!dateString) return "Date inconnue";
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" });
};

// Meta données pour SEO
useHead({
  title: "Ma Liste d'envie - Bibliothèque",
  meta: [{ name: "description", content: "Consultez ma liste d'envie de livres" }],
});
</script>

<style scoped>
/* Utilitaire pour limiter le nombre de lignes de texte */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
