<template>
  <div class="container mx-auto px-4 py-8">
    <!-- Modal d'édition avec gestion des événements -->
    <EditBookModal
      v-if="selectedBook"
      :is-open="isEditModalOpen"
      :book="selectedBook"
      @close="closeEditModal"
      @book-updated="handleBookUpdated"
      @book-deleted="handleBookDeleted"
    />

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
        @click="openEditModal(book)"
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
                @click.stop="toggleFavorite(book)"
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

    <!-- Toast de notification -->
    <div
      v-if="showToast"
      class="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-300 z-50"
      :class="{ 'opacity-100 translate-y-0': showToast, 'opacity-0 translate-y-2': !showToast }"
    >
      {{ toastMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
import { getRatingStars } from "~/utils/ratingUtils";
import { useUserBooks } from "~/composables/useUserBooks";
import { useSupabaseUser } from "#imports";
import { genreToImageMap, defaultCoverImage, type Genre } from "~/utils/genreToImageMap";
import EditBookModal from "~/components/EditBookModal.vue";

// Le type pour nos livres après traitement
type DisplayBook = {
  id: string;
  userBookId: string;
  title: string | null;
  author: string | null;
  genre: string | null;
  favorite: boolean | null;
  rating: number | null;
  added_at: string | null;
  review: string | null;
};

const user = useSupabaseUser();
const { fetchUserBooksWithDetails, toggleFavorite: toggleFavoriteInDb } = useUserBooks();

// États pour la modale d'édition
const isEditModalOpen = ref(false);
const selectedBook = ref<DisplayBook | null>(null);

// États pour les notifications
const showToast = ref(false);
const toastMessage = ref("");

// Refs pour l'état de l'interface
const books = ref<DisplayBook[]>([]);
const pending = ref(true);
const error = ref<Error | null>(null);

// Fonction pour afficher une notification
const showNotification = (message: string) => {
  toastMessage.value = message;
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
  }, 3000);
};

// Fonction pour ouvrir la modale d'édition
const openEditModal = (book: DisplayBook) => {
  selectedBook.value = book;
  isEditModalOpen.value = true;
};

// Fonction pour fermer la modale d'édition
const closeEditModal = () => {
  isEditModalOpen.value = false;
  selectedBook.value = null;
};

// Gestionnaire pour la mise à jour d'un livre
const handleBookUpdated = (updatedBook: DisplayBook) => {
  // Mise à jour optimiste - on met à jour directement dans la liste
  const index = books.value.findIndex((book) => book.id === updatedBook.id);
  if (index !== -1) {
    books.value[index] = { ...books.value[index], ...updatedBook };
  }
  showNotification("Livre mis à jour avec succès !");
};

// Gestionnaire pour la suppression d'un livre
const handleBookDeleted = (deletedBookId: string) => {
  // Suppression optimiste - on retire le livre de la liste
  books.value = books.value.filter((book) => book.id !== deletedBookId);
  showNotification("Livre retiré de votre collection !");
};

// Fonction pour recharger les données (optionnelle, en cas d'erreur)
const refreshBooks = async () => {
  if (!user.value) return;

  pending.value = true;
  try {
    const userBooksWithDetails = await fetchUserBooksWithDetails(user.value.id);
    books.value = userBooksWithDetails
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
          review: userBook.review,
        };
      })
      .filter((book): book is DisplayBook => book !== null);
  } catch (e) {
    error.value = e as Error;
  } finally {
    pending.value = false;
  }
};

// Chargement initial des livres
onMounted(async () => {
  if (!user.value) {
    pending.value = false;
    console.log("Aucun utilisateur connecté.");
    return;
  }

  try {
    const userBooksWithDetails = await fetchUserBooksWithDetails(user.value.id);
    books.value = userBooksWithDetails
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
          review: userBook.review,
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

// Fonction pour basculer le favori
const toggleFavorite = async (book: DisplayBook) => {
  if (!user.value) {
    alert("Veuillez vous connecter pour gérer vos favoris.");
    return;
  }

  const originalFavoriteStatus = book.favorite;
  book.favorite = !book.favorite;

  try {
    await toggleFavoriteInDb(user.value.id, book.id);
    showNotification(book.favorite ? "Ajouté aux favoris !" : "Retiré des favoris !");
  } catch (err) {
    console.error("Erreur lors de la mise à jour du favori:", err);
    book.favorite = originalFavoriteStatus;
    showNotification("Erreur lors de la mise à jour du favori");
  }
};

// Fonctions utilitaires (INCHANGÉES)
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
