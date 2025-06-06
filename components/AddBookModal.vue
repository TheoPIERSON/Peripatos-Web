<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 flex items-center justify-end z-50 transition-opacity duration-300"
    :class="{ 'bg-opacity-50': isVisible, 'bg-opacity-0': !isVisible }"
    @click.self="closeModal"
  >
    <div
      class="bg-white rounded-l-lg shadow-xl w-full max-w-md p-6 transform transition-transform duration-300 ease-out"
      :class="{ 'translate-x-0': isVisible, 'translate-x-full': !isVisible }"
    >
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold">Ajouter un livre</h2>
        <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
          <NuxtIcon name="fluent-color:dismiss-24" size="24" />
        </button>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1" for="title">Titre</label>
            <input
              v-model="formData.title"
              type="text"
              id="title"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1" for="author">Auteur</label>
            <input
              v-model="formData.author"
              type="text"
              id="author"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1" for="genre">Genre</label>
            <select
              v-model="formData.genre"
              id="genre"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Sélectionnez une catégorie</option>
              <option value="philosophie">Philosophie</option>
              <option value="classique">Classique</option>
              <option value="histoire">Histoire</option>
              <option value="developpement personnel">Développement personnel</option>
              <option value="policier/thriller">Policier/Thriller</option>
              <option value="aventure">Aventure</option>
              <option value="developpement personnel">Développement personnel</option>
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
          <div>
            <label class="block text-sm font-medium mb-1" for="started">Suivi</label>
            <select
              v-model="formData.started"
              id="started"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="liste d'envie">Liste d'envie</option>
              <option value="pas commencé">Pas commencé</option>
              <option value="en cours">En cours</option>
              <option value="finis">Finis</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1" for="rating">Note</label>
            <select
              v-model="formData.rating"
              id="rating"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="💩">💩</option>
              <option value="⭐️">⭐️</option>
              <option value="⭐️⭐️">⭐️⭐️</option>
              <option value="⭐️⭐️⭐️">⭐️⭐️⭐️</option>
              <option value="⭐️⭐️⭐️⭐️">⭐️⭐️⭐️⭐️</option>
              <option value="⭐️⭐️⭐️⭐️⭐️">⭐️⭐️⭐️⭐️⭐️</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1" for="critic">Avis</label>
            <textarea
              v-model="formData.critic"
              id="critic"
              rows="3"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            ></textarea>
          </div>
        </div>

        <div class="mt-6 flex justify-end space-x-4">
          <button
            @click="closeModal"
            type="button"
            class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Annuler
          </button>
          <button type="submit" class="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark">
            Ajouter
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const emit = defineEmits(["close", "submit"]);

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

const formData = ref({
  title: "",
  author: null,
  genre: "autre",
  started: "liste d'envie",
  rating: null,
  critic: null,
});

// Watch pour gérer le scroll du body
watch(
  () => props.isOpen,
  (newValue) => {
    if (newValue) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }
);

const closeModal = () => {
  emit("close");
};

const handleSubmit = () => {
  emit("submit", formData.value);
  formData.value = {
    title: "",
    author: null,
    genre: "autre",
    started: "liste d'envie",
    rating: null,
    critic: null,
  };
};
</script>

<style scoped>
/* Plus besoin de styles complexes, tout est géré par les classes Tailwind */
</style>
