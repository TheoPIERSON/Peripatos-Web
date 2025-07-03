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
        <h2 class="text-2xl font-bold">Modifier un livre</h2>
        <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
          <NuxtIcon name="fluent-color:dismiss-24" size="24" />
        </button>
      </div>

      <!-- Affichage des erreurs -->
      <div v-if="error" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
        {{ error }}
      </div>

      <!-- Confirmation de suppression -->
      <div v-if="showDeleteConfirm" class="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <p class="text-sm text-yellow-800 mb-3">Êtes-vous sûr de vouloir retirer ce livre de votre collection ?</p>
        <div class="flex space-x-2">
          <button
            @click="confirmDelete"
            :disabled="isDeleting"
            class="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:opacity-50"
          >
            {{ isDeleting ? "Suppression..." : "Confirmer" }}
          </button>
          <button @click="cancelDelete" class="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400">
            Annuler
          </button>
        </div>
      </div>

      <form @submit.prevent="updateBook">
        <div class="space-y-4">
          <!-- Informations du livre (table books) -->
          <div class="border-b pb-4 mb-4">
            <h3 class="text-lg font-semibold mb-3 text-gray-700">Informations du livre</h3>

            <div class="relative">
              <label class="block text-sm font-medium mb-1" for="title">Titre</label>
              <h2 class="text-xl font-semibold">{{ book.title }}</h2>
            </div>

            <div class="mt-4">
              <label class="block text-sm font-medium mb-1" for="author">Auteur</label>
              <h2 class="text-xl font-semibold">{{ book.author }}</h2>
            </div>

            <div class="mt-4 mb-4">
              <label class="block text-sm font-medium mb-1" for="genre">Genre</label>
              <h2 class="text-xl font-semibold">{{ book.genre }}</h2>
            </div>

            <!-- Suivi personnel (table user_books) -->
            <div>
              <h3 class="text-lg font-semibold mb-3 text-gray-700">Mon suivi</h3>

              <div>
                <label class="block text-sm font-medium mb-1" for="favorite">
                  <input v-model="userBookData.favorite" type="checkbox" id="favorite" class="mr-2" />
                  Marquer comme favori
                </label>
              </div>

              <div class="mt-4">
                <label class="block text-sm font-medium mb-1" for="note">Note (sur 5)</label>
                <select
                  v-model="userBookData.note"
                  id="note"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
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
                  :placeholder="book.review || 'Votre avis...'"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-6 flex justify-end space-x-4">
          <button
            @click="initiateDelete"
            type="button"
            class="px-4 py-2 border border-red-300 text-red-600 rounded-md hover:bg-red-50 disabled:opacity-50"
            :disabled="isDeleting"
          >
            {{ isDeleting ? "Suppression..." : "Retirer le livre" }}
          </button>
          <button
            type="submit"
            :disabled="isUpdating"
            class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-50 flex items-center"
          >
            {{ isUpdating ? "Mise à jour..." : "Valider" }}
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

const emit = defineEmits(["close", "book-updated", "book-deleted"]);

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  book: {
    type: Object,
    required: true,
  },
});

// Gestion de la visibilité
const isVisible = ref(false);

watch(
  () => props.isOpen,
  (newVal) => {
    // D'abord mettre isVisible à false pour déclencher l'animation de sortie
    if (!newVal) {
      isVisible.value = false;
      // Attendre la fin de l'animation (300ms) avant de mettre isOpen à false
      setTimeout(() => {
        document.body.style.overflow = "";
      }, 300);
    } else {
      // Pour l'entrée, on attend un petit délai pour que le DOM soit prêt
      setTimeout(() => {
        isVisible.value = true;
        document.body.style.overflow = "hidden";
      }, 10);
    }
  },
  { immediate: true }
);

// Composables
const { searchBooks, checkUserHasBook } = useBooks() as UseBooksReturn;
const { updateUserBook, deleteUserBook } = useUserBooks();
const user = useSupabaseUser();

// État
const error = ref("");
const isUpdating = ref(false);
const isDeleting = ref(false);
const showDeleteConfirm = ref(false);

interface Book {
  id: string;
  title: string | null;
  author: string | null;
  genre: string | null;
  created_at: string | null;
  created_by: string | null;
}

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

// Initialiser les données quand le livre change
watch(
  () => props.book,
  (newBook) => {
    if (newBook) {
      userBookData.value = {
        favorite: newBook.favorite || false,
        note: newBook.rating || 0,
        review: newBook.review || "",
      };
    }
  },
  { immediate: true }
);

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
  if (props.book) {
    userBookData.value = {
      favorite: props.book.favorite || false,
      note: props.book.rating || 0,
      review: props.book.review || "",
    };
  }
  error.value = "";
  showDeleteConfirm.value = false;
};

const closeModal = () => {
  emit("close");
};

// Fonction pour mettre à jour les données du livre
const updateBook = async () => {
  if (!user.value || !props.book) {
    error.value = "Utilisateur non connecté ou livre non sélectionné";
    return;
  }

  isUpdating.value = true;
  error.value = "";

  try {
    await updateUserBook(props.book.userBookId, {
      favorite: userBookData.value.favorite,
      note: userBookData.value.note,
      review: userBookData.value.review,
    });

    emit("book-updated", {
      ...props.book,
      favorite: userBookData.value.favorite,
      rating: userBookData.value.note,
      review: userBookData.value.review,
    });

    closeModal();
  } catch (err) {
    console.error("Erreur lors de la mise à jour:", err);
    error.value = "Erreur lors de la mise à jour du livre";
  } finally {
    isUpdating.value = false;
  }
};

// Fonctions pour la suppression
const initiateDelete = () => {
  showDeleteConfirm.value = true;
};

const cancelDelete = () => {
  showDeleteConfirm.value = false;
};

const confirmDelete = async () => {
  if (!user.value || !props.book) {
    error.value = "Utilisateur non connecté ou livre non sélectionné";
    return;
  }

  isDeleting.value = true;
  error.value = "";

  try {
    await deleteUserBook(props.book.userBookId);

    emit("book-deleted", props.book.id);
    closeModal();
  } catch (err) {
    console.error("Erreur lors de la suppression:", err);
    error.value = "Erreur lors de la suppression du livre";
    showDeleteConfirm.value = false;
  } finally {
    isDeleting.value = false;
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
