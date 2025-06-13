<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 flex items-center justify-end z-50 transition-opacity duration-300"
    :class="{ '': isVisible, 'bg-opacity-0': !isVisible }"
    @click.self="closeModal"
  >
    <div
      class="bg-white rounded-l-lg shadow-xl w-full max-w-md p-6 transform transition-transform duration-300 ease-out h-full overflow-y-auto"
      :class="{ 'translate-x-0': isVisible, 'translate-x-full': !isVisible }"
    >
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold">Ajouter un livre</h2>
        <button @click="closeModal" class="text-gray-500 hover:text-gray-700" :disabled="isLoading">
          <NuxtIcon name="fluent-color:dismiss-24" size="24" />
        </button>
      </div>

      <!-- Affichage des erreurs -->
      <div v-if="error" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
        {{ error }}
      </div>

      <!-- Message d'information si livre déjà dans la bibliothèque -->
      <div v-if="bookAlreadyInLibrary" class="mb-4 p-3 bg-orange-100 border border-orange-400 text-orange-700 rounded">
        Ce livre est déjà dans votre bibliothèque !
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <!-- Informations du livre (table books) -->
          <div class="border-b pb-4 mb-4">
            <h3 class="text-lg font-semibold mb-3 text-gray-700">Informations du livre</h3>

            <div class="relative">
              <label class="block text-sm font-medium mb-1" for="title">Titre *</label>
              <input
                v-model="bookData.title"
                type="text"
                id="title"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                :disabled="!!(isLoading || selectedExistingBook)"
                required
              />

              <!-- Suggestions pour le titre -->
              <div
                v-if="showSuggestions && suggestions.length > 0 && !selectedExistingBook"
                class="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto"
              >
                <div
                  v-for="book in suggestions"
                  :key="book.id"
                  @click="selectExistingBook(book)"
                  class="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                >
                  <div class="font-medium text-sm">{{ book.title }}</div>
                  <div class="text-gray-600 text-xs">par {{ book.author }}</div>
                  <div v-if="book.genre" class="text-gray-500 text-xs">{{ book.genre }}</div>
                  <div v-if="userHasBook[book.id]" class="text-orange-600 text-xs font-medium">
                    ⚠️ Déjà dans votre bibliothèque
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-4">
              <label class="block text-sm font-medium mb-1" for="author">Auteur *</label>
              <input
                v-model="bookData.author"
                type="text"
                id="author"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                :disabled="!!(isLoading || selectedExistingBook)"
                required
              />
            </div>

            <div class="mt-4">
              <label class="block text-sm font-medium mb-1" for="genre">Genre</label>
              <select
                v-model="bookData.genre"
                id="genre"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                :disabled="isLoading || !!selectedExistingBook"
              >
                <option value="">Sélectionnez une catégorie</option>
                <option value="philosophie">Philosophie</option>
                <option value="classique">Classique</option>
                <option value="histoire">Histoire</option>
                <option value="developpement personnel">Développement personnel</option>
                <option value="policier/thriller">Policier/Thriller</option>
                <option value="aventure">Aventure</option>
                <option value="romance">Romance</option>
                <option value="science-fiction">Science-fiction</option>
                <option value="biographie">Biographie</option>
                <option value="essai">Essai</option>
                <option value="roman">Roman</option>
                <option value="fantaisie">Fantaisie</option>
                <option value="science">Science</option>
                <option value="cuisine">Cuisine</option>
                <option value="autre">Autre</option>
              </select>
            </div>

            <!-- Affichage du livre sélectionné -->
            <div v-if="selectedExistingBook" class="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <div class="flex justify-between items-start">
                <div>
                  <h4 class="font-medium text-blue-900">Livre existant sélectionné :</h4>
                  <p class="text-blue-800">{{ selectedExistingBook.title }}</p>
                  <p class="text-blue-700 text-sm">par {{ selectedExistingBook.author }}</p>
                </div>
                <button type="button" @click="deselectBook" class="text-blue-600 hover:text-blue-800 text-sm underline">
                  Modifier
                </button>
              </div>
            </div>
          </div>

          <!-- Suivi personnel (table user_books) -->
          <div>
            <h3 class="text-lg font-semibold mb-3 text-gray-700">Mon suivi</h3>

            <div>
              <label class="block text-sm font-medium mb-1" for="favorite">
                <input
                  v-model="userBookData.favorite"
                  type="checkbox"
                  id="favorite"
                  class="mr-2"
                  :disabled="isLoading"
                />
                Marquer comme favori
              </label>
            </div>

            <div class="mt-4">
              <label class="block text-sm font-medium mb-1" for="note">Note (sur 5)</label>
              <select
                v-model="userBookData.note"
                id="note"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                :disabled="isLoading"
              >
                <option :value="0">Liste d'envie</option>
                <option :value="1">⭐️</option>
                <option :value="2">⭐️⭐️</option>
                <option :value="3">⭐️⭐️⭐️</option>
                <option :value="4">⭐️⭐️⭐️⭐️</option>
                <option :value="5">⭐️⭐️⭐️⭐️⭐️</option>
              </select>
            </div>

            <div class="mt-4">
              <label class="block text-sm font-medium mb-1" for="review">Avis personnel</label>
              <textarea
                v-model="userBookData.review"
                id="review"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                :disabled="isLoading"
                placeholder="Votre avis sur ce livre..."
              ></textarea>
            </div>
          </div>
        </div>

        <div class="mt-6 flex justify-end space-x-4">
          <button
            @click="closeModal"
            type="button"
            class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            :disabled="isLoading"
          >
            Annuler
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-50 flex items-center"
            :disabled="!!(isLoading || bookAlreadyInLibrary)"
          >
            <span v-if="isLoading" class="mr-2">
              <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                  fill="none"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </span>
            {{
              isLoading ? "Ajout en cours..." : selectedExistingBook ? "Ajouter à ma bibliothèque" : "Créer et ajouter"
            }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
interface BookData {
  title: string;
  author: string;
  genre: string;
  id?: string;
}

interface User {
  id: string;
}

// Type for user's book collection
interface UserBookCollection {
  [key: string]: boolean;
}

// Type for selected existing book
interface SelectedBook {
  id: string;
  title: string | null;
  author: string | null;
  genre: string | null;
  created_at: string | null;
  created_by: string | null;
}

import { ref, watch, computed, nextTick } from "vue";
import { useUserProfiles } from "~/composables/useUserProfiles";

const emit = defineEmits(["close", "book-added"]);

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  isVisible: {
    type: Boolean,
    required: true,
  },
});

// Composables
const { addBook, searchBooks, checkUserHasBook, findExactMatch } = useBooks();
const { getUserProfile } = useUserProfiles();

// Fonction pour vérifier si l'utilisateur est premium
const isUserPremium = async (): Promise<boolean> => {
  if (!user.value) return false;

  try {
    const profile = await getUserProfile(user.value.id);
    return profile?.is_premium || false;
  } catch (error) {
    console.error("Erreur lors de la vérification du statut premium:", error);
    return false;
  }
};
const { updateUserBookPreferences } = useBooks();

import type { Database } from "~/types/database.types";

// State
const suggestions = ref<Database["public"]["Tables"]["books"]["Row"][]>([]);
const showSuggestions = ref(false);
const user = useSupabaseUser();

// État
const isLoading = ref(false);
const error = ref("");
const selectedExistingBook = ref<SelectedBook | null>(null);

// Fonction pour vérifier si un livre est sélectionné
const isBookSelected = computed(() => selectedExistingBook.value !== null);
const userHasBook = ref<UserBookCollection>({});

const bookData = ref<BookData>({
  title: "",
  author: "",
  genre: "",
});

// Données de suivi utilisateur (table user_books)
const userBookData = ref({
  favorite: false,
  note: 0 as number,
  review: "",
});

// Computed pour vérifier si le livre est déjà dans la bibliothèque
const bookAlreadyInLibrary = computed(() => {
  return selectedExistingBook.value && userHasBook.value[selectedExistingBook.value.id];
});

// Fonction debounce pour éviter trop d'appels API
const debounce = <T extends (...args: any[]) => any>(func: T, wait: number): T => {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  return ((...args: Parameters<T>): ReturnType<T> => {
    const later = () => {
      clearTimeout(timeout);
      return func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    return func(...args); // Return the initial call result immediately
  }) as T;
};

// Fonction de recherche debouncée
const debouncedSearch = debounce(async (query) => {
  if (!user.value || query.length < 2) {
    suggestions.value = [];
    showSuggestions.value = false;
    return;
  }

  try {
    const results = await searchBooks(query);
    suggestions.value = results;

    // Vérifier pour chaque livre si l'utilisateur l'a déjà
    if (!user.value) {
      console.error("User is not authenticated");
      return;
    }

    // Type assertion to help TypeScript understand user.value is not null
    const userId = user.value!.id;

    const hasBookChecks = await Promise.all(
      results.map(async (book) => {
        const hasIt = await checkUserHasBook(userId, book.id);
        return { bookId: book.id, hasIt };
      })
    );

    // Mettre à jour l'état userHasBook
    const newUserHasBook: Record<string, boolean> = {};
    hasBookChecks.forEach(({ bookId, hasIt }) => {
      newUserHasBook[bookId] = hasIt;
    });
    userHasBook.value = newUserHasBook;

    showSuggestions.value = results.length > 0;
  } catch (err) {
    console.error("Erreur lors de la recherche:", err);
  }
}, 300);

// Watch sur les changements de titre et auteur
watch([() => bookData.value.title, () => bookData.value.author], ([title, author]) => {
  if (!selectedExistingBook.value && (title || author)) {
    const query = `${title} ${author}`.trim();
    if (query.length >= 2) {
      debouncedSearch(query);
    }
  }
});

// Watch pour gérer le scroll du body
watch(
  () => props.isOpen,
  (newValue) => {
    if (newValue) {
      document.body.style.overflow = "hidden";
      resetForm();
    } else {
      document.body.style.overflow = "";
    }
  }
);

const resetForm = () => {
  bookData.value = {
    title: "",
    author: "",
    genre: "",
  };
  userBookData.value = {
    favorite: false,
    note: 0,
    review: "",
  };
  selectedExistingBook.value = null;
  suggestions.value = [];
  showSuggestions.value = false;
  userHasBook.value = {};
  error.value = "";
};

const selectExistingBook = (book: SelectedBook) => {
  selectedExistingBook.value = book;
  bookData.value = {
    title: book.title || "",
    author: book.author || "",
    genre: book.genre || "",
  };
  showSuggestions.value = false;
};

const deselectBook = () => {
  selectedExistingBook.value = null;
  bookData.value = {
    title: "",
    author: "",
    genre: "",
  };
  suggestions.value = [];
  showSuggestions.value = false;
  userHasBook.value = {};
};

const closeModal = () => {
  if (!isLoading.value) {
    emit("close");
  }
};

const handleSubmit = async () => {
  if (!user.value) {
    error.value = "Vous devez être connecté pour ajouter un livre";
    return;
  }

  if (!bookData.value.title.trim() || !bookData.value.author.trim()) {
    error.value = "Le titre et l'auteur sont requis";
    return;
  }

  // Vérifier si c'est un livre existant déjà dans la bibliothèque
  if (selectedExistingBook.value && userHasBook.value[selectedExistingBook.value.id]) {
    error.value = "Ce livre est déjà dans votre bibliothèque";
    return;
  }

  try {
    isLoading.value = true;
    error.value = "";

    // Vérifier si l'utilisateur est premium
    const isPremium = await isUserPremium();

    // Si l'utilisateur n'est pas premium, afficher un message et retourner
    if (!isPremium) {
      error.value = "Cette fonctionnalité est réservée aux utilisateurs premium.";
      isLoading.value = false;
      return;
    }

    // Vérifier si le livre existe déjà
    const existingBook = await findExactMatch(bookData.value.title, bookData.value.author);

    if (existingBook) {
      // Si le livre existe déjà, vérifier si l'utilisateur l'a déjà dans sa bibliothèque
      const hasBook = await checkUserHasBook(user.value.id, existingBook.id);

      if (hasBook) {
        error.value = "Ce livre est déjà dans votre bibliothèque !";
        isLoading.value = false;
        return;
      }

      // Ajouter le livre existant à la bibliothèque de l'utilisateur
      await updateUserBookPreferences(user.value.id, existingBook.id, {
        favorite: userBookData.value.favorite,
        note: userBookData.value.note,
        review: userBookData.value.review,
      });
    } else {
      // Créer le nouveau livre
      const newBook = await addBook({
        title: bookData.value.title,
        author: bookData.value.author,
        genre: bookData.value.genre,
      });

      // Ajouter le livre à la bibliothèque de l'utilisateur
      await updateUserBookPreferences(user.value.id, newBook.id, {
        favorite: userBookData.value.favorite,
        note: userBookData.value.note,
        review: userBookData.value.review,
      });
    }

    // Réinitialiser le formulaire et fermer le modal
    resetForm();
    emit("book-added");
    closeModal();
  } catch (error: unknown) {
    console.error("Erreur lors de l'ajout du livre:", error);
    const errorMessage = "Une erreur est survenue lors de l'ajout du livre. Veuillez réessayer.";
    error = errorMessage;
  } finally {
    isLoading.value = false;
  }
};

// Cleanup quand le composant est démonté
onUnmounted(() => {
  document.body.style.overflow = "";
});
</script>

<style scoped>
/* Styles pour l'animation de loading */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
