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
                :disabled="isLoading || !!selectedExistingBook"
                required
              />

              <!-- Suggestions pour le titre -->
              <div
                v-if="showSuggestions && suggestions.length > 0 && !hasSelectedBook"
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
                :disabled="isLoading || !!selectedExistingBook"
                required
              />
            </div>

            <div class="mt-4">
              <label class="block text-sm font-medium mb-1" for="genre">Genre</label>
              <select
                v-model="bookData.genre"
                id="genre"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                :disabled="isLoading"
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
            :disabled="isLoading || bookAlreadyInLibrary"
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
import { ref, watch, computed, nextTick } from "vue";
// Type for setTimeout return value in web environment
import { useUserProfiles } from "~/composables/useUserProfiles";
import type { Database } from "~/types/database.types";

// Types from useBooks
interface UseBooksReturn {
  addBook: (
    book: Database["public"]["Tables"]["books"]["Insert"]
  ) => Promise<Database["public"]["Tables"]["books"]["Row"]>;
  searchBooks: (query: string) => Promise<Database["public"]["Tables"]["books"]["Row"][]>;
  checkUserHasBook: (userId: string, bookId: string) => Promise<boolean>;
  findExactMatch: (title: string, author: string) => Promise<Database["public"]["Tables"]["books"]["Row"] | null>;
}

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
const { addBook, searchBooks, checkUserHasBook, findExactMatch } = useBooks() as UseBooksReturn;
const { addUserBook } = useUserBooks();
const user = useSupabaseUser();

// État
const isLoading = ref(false);
const error = ref("");
const suggestions = ref<Book[]>([]);
const showSuggestions = ref(false);

interface Book {
  id: string;
  title: string | null;
  author: string | null;
  genre: string | null;
  created_at: string | null;
  created_by: string | null;
}

const selectedExistingBook = ref<Book | null>(null);
const userHasBook = ref<Record<string, boolean>>({});

// Computed pour vérifier si un livre est sélectionné
const hasSelectedBook = computed(() => selectedExistingBook.value !== null);

// Données du livre (table books)
const bookData = ref({
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
  return selectedExistingBook.value ? userHasBook.value[selectedExistingBook.value.id] : false;
});

// Fonction debounce pour éviter trop d'appels API
const debounce = <T extends (...args: any[]) => any>(func: T, wait: number): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
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

    // Store user value in a local variable to ensure it's not null
    const currentUser = user.value;
    if (!currentUser) return;

    // Vérifier pour chaque livre si l'utilisateur l'a déjà
    const hasBookChecks = await Promise.all(
      results.map(async (book) => {
        const hasIt = await checkUserHasBook(currentUser.id, book.id);
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

const selectExistingBook = (book: Book) => {
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

  isLoading.value = true;
  error.value = "";

  try {
    let bookToAdd;

    if (selectedExistingBook.value) {
      // Utiliser le livre existant
      bookToAdd = selectedExistingBook.value;
    } else {
      // Créer un nouveau livre
      bookToAdd = await addBook({
        title: bookData.value.title.trim(),
        author: bookData.value.author.trim(),
        genre: bookData.value.genre || null,
        created_by: user.value.id,
        created_at: new Date().toISOString(),
      });
    }

    // Créer l'entrée user_books
    await addUserBook({
      user_id: user.value.id,
      book_id: bookToAdd.id,
      favorite: userBookData.value.favorite,
      note: userBookData.value.note,
      review: userBookData.value.review.trim() || null,
      added_at: new Date().toISOString(),
    });

    // Émettre l'événement de succès
    emit("book-added", bookToAdd);

    // Fermer la modale
    emit("close");
  } catch (err) {
    console.error("Erreur lors de l'ajout du livre:", err);
    error.value = err instanceof Error ? err.message : "Erreur lors de l'ajout du livre";
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
