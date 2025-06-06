<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">Mes Livres Favoris</h1>

    <div v-if="pending" class="text-center">
      <p>Chargement des livres favoris...</p>
    </div>

    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      <p>Erreur lors du chargement des livres favoris: {{ error }}</p>
    </div>

    <div v-else-if="favoriteBooks && favoriteBooks.length === 0" class="text-center text-gray-500">
      <p>Aucun livre favori trouvé.</p>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
      <div
        v-for="book in favoriteBooks"
        :key="book.id"
        class="relative group cursor-pointer transform hover:scale-105 transition-transform duration-300 sm:max-w-sm"
      >
        <div class="relative w-auto h-auto rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
          <img :src="getBookCoverImage(book)" :alt="`Couverture de ${book.title}`" class="w-full h-full object-cover" />
          <div class="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>
          <div class="absolute inset-0 flex flex-col justify-between p-4 text-white">
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
            <div v-if="book.rating" class="flex justify-center items-center">
              <div class="px-3 py-1">
                <div class="flex items-center space-x-1">
                  <span class="text-xl mb-10 font-medium">{{ book.rating }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
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
import { useBooks } from "~/composables/useBooks";
import type { Book } from "~/types/book";

const { fetchBooks, updateBookFavorite } = useBooks();

const favoriteBooks = ref<Book[]>([]);
const pending = ref(true);
const error = ref<Error | null>(null);

onMounted(async () => {
  try {
    const books = await fetchBooks();
    favoriteBooks.value = books.filter((book) => book.favorite);
  } catch (e) {
    console.error("Erreur attrapée dans le composant:", e);
    error.value = e as Error;
  } finally {
    pending.value = false;
  }
});

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

const getBookCoverImage = (book: Book) => {
  if (!book.genre) {
    return defaultCoverImage;
  }
  const normalizedGenre = book.genre.toLowerCase().trim() as Genre;
  return genreToImageMap[normalizedGenre] || defaultCoverImage;
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" });
};

const toggleFavorite = async (book: Book) => {
  try {
    book.favorite = !book.favorite;
    await updateBookFavorite(book.id, book.favorite);
    if (!book.favorite) {
      favoriteBooks.value = favoriteBooks.value.filter((b) => b.id !== book.id);
    }
  } catch (e) {
    console.error("Erreur lors de la mise à jour du favori:", e);
    book.favorite = !book.favorite; // Annuler le changement local
  }
};
</script>

<style></style>
