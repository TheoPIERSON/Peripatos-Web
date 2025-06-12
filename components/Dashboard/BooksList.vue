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

    <div v-else class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-10">
      <div
        v-for="book in books"
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
            <div class="text-center relative">
              <button
                @click="toggleFavorite(book)"
                class="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 p-1 sm:p-2 hover:text-red-500 transition-colors"
                :class="{ 'text-red-500': book.favorite, 'text-gray-400': !book.favorite }"
              >
                <Icon
                  :name="book.favorite ? 'fluent-color:heart-28' : 'formkit:heart'"
                  :style="{ color: book.favorite ? 'red' : 'black' }"
                  size="24"
                />
              </button>
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
                  <span class="text-sm sm:text-xl mb-2 sm:mb-10 font-medium">{{ getRatingStars(book.rating) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Informations supplémentaires au survol (masquées sur mobile pour économiser l'espace) -->
        <div class="hidden sm:block mt-2 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div class="flex flex-col items-center space-y-1">
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
import { getRatingStars } from "~/utils/ratingUtils";
// ✨ 1. On importe le composable pour les livres de l'utilisateur et celui pour récupérer l'utilisateur Supabase
import { useUserBooks } from "~/composables/useUserBooks";
import { useSupabaseUser } from "#imports";

// Le type pour nos livres après traitement. On l'adapte pour qu'il contienne ce dont le template a besoin.
type DisplayBook = {
  id: string; // ID du livre
  userBookId: string; // ID de la relation (table user_books)
  title: string | null;
  author: string | null;
  genre: string | null;
  favorite: boolean | null;
  rating: number | null; // La note de l'utilisateur
  added_at: string | null; // La date où l'utilisateur a ajouté le livre
};

// ✨ 2. On récupère l'utilisateur connecté et on initialise le bon composable
const user = useSupabaseUser();
const { fetchUserBooksWithDetails, toggleFavorite: toggleFavoriteInDb } = useUserBooks();

// Refs pour l'état de l'interface
const books = ref<DisplayBook[]>([]);
const pending = ref(true);
const error = ref<Error | null>(null);

// ✨ 3. Au montage, on charge les livres de l'utilisateur connecté
onMounted(async () => {
  // On s'assure qu'un utilisateur est bien connecté
  if (!user.value) {
    pending.value = false;
    // Optionnel : vous pourriez rediriger vers la page de connexion ici
    // ou afficher un message indiquant qu'il faut se connecter.
    console.log("Aucun utilisateur connecté.");
    return;
  }

  try {
    // On appelle la fonction qui récupère les livres de l'utilisateur avec leurs détails
    const userBooksWithDetails = await fetchUserBooksWithDetails(user.value.id);

    // On transforme les données pour correspondre parfaitement au template
    books.value = userBooksWithDetails
      .map((userBook) => {
        // Si pour une raison étrange la relation existe mais que le livre a été supprimé
        if (!userBook.books) return null;

        return {
          id: userBook.books.id,
          userBookId: userBook.id, // Important pour les futures mises à jour
          title: userBook.books.title,
          author: userBook.books.author,
          genre: userBook.books.genre,
          favorite: userBook.favorite,
          rating: userBook.note, // On fait correspondre 'note' de la DB à 'rating' dans le template
          added_at: userBook.added_at, // On utilise la date d'ajout par l'utilisateur
        };
      })
      .filter((book): book is DisplayBook => book !== null); // On retire les éventuels résultats nuls
  } catch (e) {
    console.error("Erreur attrapée dans le composant:", e);
    error.value = e as Error;
  } finally {
    pending.value = false;
  }
});

// ✨ 4. La fonction pour basculer le favori utilise maintenant la logique du composable
const toggleFavorite = async (book: DisplayBook) => {
  if (!user.value) {
    alert("Veuillez vous connecter pour gérer vos favoris.");
    return;
  }

  // Mise à jour optimiste pour une UI réactive
  const originalFavoriteStatus = book.favorite;
  book.favorite = !book.favorite;

  try {
    // Appel à la fonction du composable qui gère toute la logique
    await toggleFavoriteInDb(user.value.id, book.id);
  } catch (err) {
    console.error("Erreur lors de la mise à jour du favori:", err);
    // En cas d'erreur, on annule le changement dans l'interface
    book.favorite = originalFavoriteStatus;
    alert("Une erreur est survenue. Impossible de mettre à jour le favori.");
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
  if (!book.genre) {
    return defaultCoverImage;
  }
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
  title: "Mes Livres - Bibliothèque Personnelle",
  meta: [{ name: "description", content: "Consultez votre collection de livres personnels." }],
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
