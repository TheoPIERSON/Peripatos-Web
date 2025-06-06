<template>
  <nav
    class="fixed z-50 bg-white shadow-lg w-full bottom-0 left-0 h-16 flex justify-around items-center md:top-0 md:left-0 md:bottom-0 md:w-44 md:h-full md:flex-col md:justify-start md:py-4"
  >
    <div class="flex flex-col items-center justify-between py-3 mb-4 md:justify-center border-b border-gray-200">
      <div class="text-center grid place-items-center">
        <span class="text-2xl font-bold text-primary">Peripatos</span>
        <img
          src="/images/aristote.png"
          alt="Avatar"
          class="h-16 w-16 rounded-full object-cover cursor-pointer relative border-3 border-green-500 mt-4"
        />
      </div>
    </div>
    <button
      @click="openModal"
      class="flex flex-col items-center text-gray-700 hover:text-primary transition-colors mb-0 md:mb-6 mt-6"
    >
      <Icon name="fluent-color:add-circle-16" style="color: black" size="32" />
      <span class="text-xs">Ajouter un livre</span>
    </button>

    <NuxtLink
      to="/dashboard/profile"
      class="flex flex-col items-center text-gray-700 hover:text-primary transition-colors mb-0 md:mb-6 mt-6"
    >
      <Icon name="fluent-color:library-24" style="color: black" size="32" />
      <span class="text-xs">Bibliothèque</span>
    </NuxtLink>

    <NuxtLink
      to="/dashboard/profile"
      class="flex flex-col items-center text-gray-700 hover:text-primary transition-colors mb-0 md:mb-6 mt-6"
    >
      <Icon name="fluent-color:book-16" style="color: black" size="32" />

      <span class="text-xs">Liste d'envie</span>
    </NuxtLink>
    <NuxtLink
      to="/dashboard/profile"
      class="flex flex-col items-center text-gray-700 hover:text-primary transition-colors mb-0 md:mb-6 mt-6"
    >
      <Icon name="fluent-color:heart-28" style="color: black" size="32" />

      <span class="text-xs">Favoris</span>
    </NuxtLink>

    <NuxtLink
      to="/dashboard/settings"
      class="flex flex-col items-center text-gray-700 hover:text-primary transition-colors mt-auto pt-4 border-t border-gray-200"
    >
      <Icon name="fluent-color:settings-32" style="color: black" size="32" />
      <span class="text-xs">Paramètres</span>
    </NuxtLink>
  </nav>

  <AddBookModal :is-open="isModalOpen" @close="closeModal" @submit="handleAddBook" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import AddBookModal from "./AddBookModal.vue";
import { useBooks } from "~/composables/useBooks";

const { addBook } = useBooks();
const isModalOpen = ref(false);

const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const handleAddBook = async (bookData: {
  title: string;
  author: string | null;
  genre: string;
  started: string;
  rating: string | null;
  critic: string | null;
}) => {
  if (!bookData.title) {
    console.error("Le titre est requis");
    return;
  }

  try {
    await addBook(bookData);
    console.log("Livre ajouté avec succès");
    closeModal();
  } catch (error) {
    console.error("Erreur lors de l'ajout du livre:", error);
  }
};
</script>
