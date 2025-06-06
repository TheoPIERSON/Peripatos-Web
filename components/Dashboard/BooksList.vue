<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">Mes Livres</h1>

    <div v-if="pending" class="text-center">
      <p>Chargement des livres...</p>
    </div>

    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      <p>Erreur lors du chargement des livres: {{ error.message }}</p>
    </div>

    <div v-else-if="books && books.length === 0" class="text-center text-gray-500">
      <p>Aucun livre trouvé.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
      <div
        v-for="book in books"
        :key="book.id"
        class="relative group cursor-pointer transform hover:scale-105 transition-transform duration-300"
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
            <div class="text-center">
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
          <div class="text-xs text-gray-500 space-y-1">
            <p v-if="book.year">Année: {{ book.year }}</p>
            <p v-if="book.genre">Genre: {{ book.genre }}</p>
            <p>Ajouté le: {{ formatDate(book.created_at) }}</p>
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
const books = computed(() => allBooks.value?.filter(book => book.started !== 'Liste d\'envie'));

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

  // Recherche de l'image correspondante
  return genreToImageMap[normalizedGenre] || defaultCoverImage;
};

// Fonction utilitaire pour formater les dates
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("fr-FR");
};

// Meta données pour SEO
useHead({
  title: "Mes Livres - Bibliothèque",
  meta: [{ name: "description", content: "Consultez ma collection de livres" }],
});
</script>
