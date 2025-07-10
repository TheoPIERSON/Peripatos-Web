<template>
  <nav
    class="fixed z-50 bg-white shadow-lg w-full bottom-0 left-0 h-16 flex justify-around items-center md:top-0 md:left-0 md:bottom-0 md:w-44 md:h-full md:flex-col md:justify-start md:py-4"
  >
    <div
      class="hidden sm:flex flex-col items-center justify-between py-3 mb-4 md:justify-center border-b border-gray-200"
    >
      <div class="text-center grid place-items-center">
        <NuxtLink to="/" class="text-2xl font-bold text-primary">Peripatos</NuxtLink>
        <div class="flex flex-col items-center">
          <img
            src="/images/aristote.png"
            alt="Avatar"
            class="h-16 w-16 rounded-full object-cover cursor-pointer relative border-3 mt-4"
            :class="{
              'border-green-500': profile?.subscription_type === 'premium',
              'border-blue-500': profile?.subscription_type === 'pro',
              'border-yellow-500': profile?.subscription_type === 'freemium',
            }"
          />
          <div class="mt-2">
            <span class="text-sm font-medium">{{ profile?.username }}</span>
            <div class="mt-1">
              <span class="text-xs text-gray-600">
                {{ profile?.books_created_count }}/{{ profile?.monthly_limit }} ce mois-ci
              </span>
            </div>
            <div class="mt-1">
              <span class="text-xs text-gray-600"> {{ profile?.books_created_count }} livres ajoutés </span>
            </div>
            <div v-if="profile?.subscription_type" class="mt-1">
              <span
                class="text-xs"
                :class="{
                  'text-green-600': profile?.subscription_type === 'premium',
                  'text-blue-600': profile?.subscription_type === 'pro',
                  'text-gray-600': profile?.subscription_type === 'freemium',
                }"
              >
                {{
                  profile?.subscription_type === "premium"
                    ? "Membre premium"
                    : profile?.subscription_type === "pro"
                    ? "Membre pro"
                    : "Membre freemium"
                }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <button
      @click="openModal"
      class="flex flex-col items-center text-gray-700 hover:text-primary transition-colors mb-6 mt-6"
    >
      <Icon name="fluent-color:add-circle-16" style="color: black" size="32" />
      <span class="text-xs">Ajouter un livre</span>
    </button>

    <NuxtLink
      to="/dashboard/library"
      class="flex flex-col items-center text-gray-700 hover:text-primary transition-colors mb-6 mt-6"
    >
      <Icon name="fluent-color:library-24" style="color: black" size="32" />
      <span class="text-xs">Mes livres</span>
    </NuxtLink>

    <NuxtLink
      to="/dashboard/wishlist"
      class="flex flex-col items-center text-gray-700 hover:text-primary transition-colors mb-6 mt-6"
    >
      <Icon name="fluent-color:book-16" style="color: black" size="32" />
      <span class="text-xs">Liste d'envie</span>
    </NuxtLink>
    <NuxtLink
      to="/dashboard/favorites"
      class="flex flex-col items-center text-gray-700 hover:text-primary transition-colors mb-6 mt-6"
    >
      <Icon name="fluent-color:heart-24" style="color: black" size="32" />
      <span class="text-xs">Favoris</span>
    </NuxtLink>
    <NuxtLink
      to="/dashboard/settings"
      class="flex flex-col items-center text-gray-700 hover:text-primary transition-colors mb-6 mt-6"
    >
      <Icon name="fluent-color:settings-24" style="color: black" size="32" />
      <span class="text-xs">Paramètres</span>
    </NuxtLink>
  </nav>

  <AddBookModal :is-open="isModalOpen" :is-visible="isModalVisible" @close="closeModal" @submit="handleAddBook" />
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch } from "vue";
import { useAuth } from "~/composables/useAuth";
import { useBooks } from "~/composables/useBooks";
import AddBookModal from "./AddBookModal.vue";

const { addBook } = useBooks();
const { user, getProfile } = useAuth();

interface UserProfile {
  id: string;
  username: string | null;
  subscription_type: "premium" | "pro" | "freemium" | null;
  created_at: string | null;
  books_created_count: number | null;
  monthly_limit: number | null;
}

const profile = ref<UserProfile | null>(null);

// Récupérer le profil quand l'utilisateur est connecté
watch(
  user,
  async (newUser) => {
    if (newUser) {
      const { data, error } = await getProfile(newUser.id);
      if (error) {
        console.error("Erreur lors de la récupération du profil:", error);
        return;
      }

      // Par défaut, on considère que le type d'abonnement est 'freemium'
      const subscriptionType = data?.subscription_type || "freemium";

      // Assurer que le type d'abonnement est valide
      const validSubscriptionTypes = ["premium", "pro", "freemium"] as const;
      const validType = validSubscriptionTypes.includes(subscriptionType as (typeof validSubscriptionTypes)[number])
        ? subscriptionType
        : "freemium";

      // Calculer la limite mensuelle en fonction du type d'abonnement
      const monthlyLimit =
        {
          premium: 30,
          pro: 100,
          freemium: 10,
        }[validType] || 10;

      profile.value = {
        id: data?.id || "",
        username: data?.username || null,
        subscription_type: validType as "premium" | "pro" | "freemium",
        created_at: data?.created_at || null,
        books_created_count: data?.books_created_count || 0,
        monthly_limit: monthlyLimit,
      } as UserProfile;
    } else {
      profile.value = null;
    }
  },
  { immediate: true }
);

const isModalOpen = ref(false);
const isModalVisible = ref(false);

const openModal = async () => {
  isModalOpen.value = true;
  await nextTick();
  // Petit délai pour permettre au DOM de se mettre à jour
  setTimeout(() => {
    isModalVisible.value = true;
  }, 10);
};

const closeModal = () => {
  isModalVisible.value = false;
  // Attendre la fin de l'animation avant de détruire le composant
  setTimeout(() => {
    isModalOpen.value = false;
  }, 300);
};

const handleAddBook = async (bookData: {
  id: string;
  title: string;
  author: string | null;
  genre: string;
  started: string;
  rating: string | null;
  critic: string | null;
  created_at: string;
  favorite: boolean;
}) => {
  if (!bookData.title) {
    console.error("Le titre est requis");
    return;
  }

  try {
    await addBook(bookData);
    console.log("Livre ajouté avec succès");
    closeModal();
    // Émettre un événement global pour recharger la liste des livres
    window.dispatchEvent(new CustomEvent("bookAdded"));
  } catch (error) {
    console.error("Erreur lors de l'ajout du livre:", error);
  }
};
</script>
