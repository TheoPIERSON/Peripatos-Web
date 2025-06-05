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

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div
        v-for="book in books"
        :key="book.id"
        class="relative group cursor-pointer transform hover:scale-105 transition-transform duration-300"
      >
        <!-- Conteneur de la couverture -->
        <div class="relative w-full h-full rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
          <!-- Image de fond -->
          <img :src="getBookCoverImage(book)" :alt="`Couverture de ${book.title}`" class="w-full h-full object-cover" />

          <!-- Overlay gradient pour améliorer la lisibilité du texte -->
          <div class="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>

          <!-- Contenu texte sur l'image -->
          <div class="absolute inset-0 flex flex-col justify-between p-4 text-white">
            <!-- Titre et auteur en haut -->
            <div class="text-center">
              <h2 class="text-lg font-bold leading-tight mb-2 drop-shadow-lg">
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
                  <span class="text-xs ml-1 font-medium">{{ book.rating }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Informations supplémentaires au survol (optionnel) -->
        <div class="mt-2 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div class="text-xs text-gray-500 space-y-1">
            <p v-if="book.year">Année: {{ book.year }}</p>
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
const { data: books, pending, error, refresh } = await useLazyAsyncData("books", fetchBooks);

// Liste des images de couverture disponibles
const coverImages = [
  "/images/cover/blue_light.png",
  "/images/cover/green_nature.png",
  "/images/cover/red_classic.png",
  "/images/cover/purple_mystery.png",
  "/images/cover/orange_adventure.png",
  "/images/cover/pink_romance.png",
];

// Fonction pour obtenir l'image de couverture d'un livre
const getBookCoverImage = (book) => {
  // Si le livre a une image spécifique, l'utiliser
  if (book.cover_image) {
    return `/images/cover/${book.cover_image}`;
  }

  // Sinon, choisir une image basée sur l'ID du livre pour la cohérence
  const imageIndex = book.id % coverImages.length;
  return `/images/cover/blue_light.png`;
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
