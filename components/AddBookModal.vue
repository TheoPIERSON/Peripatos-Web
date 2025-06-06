<template>
  <div v-if="isOpen" class="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold">Ajouter un livre</h2>
        <button @click="closeModal" class="text-gray-500 hover:text-gray-700">
          <Icon name="fluent-color:dismiss-24" size="24" />
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
              <option value="litterature">Littérature</option>
              <option value="histoire">Histoire</option>
              <option value="developpement personnel">Développement personnel</option>
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

<script setup>
import { ref } from "vue";

const emit = defineEmits(["close", "submit"]);

const props = defineProps({
  isOpen: {
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
