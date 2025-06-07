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
              <p v-if="book.year">Année: {{ book.year }}</p>
              <p v-if="book.genre">Genre: {{ book.genre }}</p>
              <p>Ajouté le: {{ formatDate(book.created_at) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { fetchBooks } = useBooks();

// Utilisation d'useLazyAsyncData pour un chargement optimisé
const { data: allBooks, pending, error, refresh } = await useLazyAsyncData("books", fetchBooks);
const wishlistBooks = computed(() => allBooks.value?.filter((book) => book.started === "Liste d'envie"));

// Correspondance entre les genres et les images de couverture
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

// Image par défaut si aucun genre ne correspond
const defaultCoverImage = "/images/cover/sand.png";

// Fonction pour obtenir l'image de couverture d'un livre
const getBookCoverImage = (book) => {
  if (!book.genre) {
    return defaultCoverImage;
  }

  // Normalisation du genre (minuscules, espaces supprimés)
  const normalizedGenre = book.genre.toLowerCase().trim();
  return genreToImageMap[normalizedGenre] || defaultCoverImage;
};

// Fonction utilitaire pour formater les dates
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" });
};

// Fonction pour basculer le statut favori d'un livre
const toggleFavorite = async (book) => {
  try {
    const updatedBook = await useFavoriteBook(book.id, !book.favorite);
    if (updatedBook.value) {
      // Mettre à jour le livre dans la liste
      const index = wishlistBooks.value.findIndex((b) => b.id === book.id);
      if (index !== -1) {
        wishlistBooks.value[index] = updatedBook.value;
      }
    }
  } catch (error) {
    console.error("Erreur lors de la mise à jour du favori:", error);
  }
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
