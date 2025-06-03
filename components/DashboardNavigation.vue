<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-white shadow-lg">
    <div class="flex justify-around items-center h-16">
      <NuxtLink
        to="/dashboard"
        class="flex flex-col items-center text-gray-700 hover:text-primary transition-colors"
      >
        <svg
          class="h-5 w-5 mb-1"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
        <span class="text-xs">Accueil</span>
      </NuxtLink>

      <NuxtLink
        to="/dashboard/profile"
        class="flex flex-col items-center text-gray-700 hover:text-primary transition-colors"
      >
        <svg
          class="h-5 w-5 mb-1"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
        <span class="text-xs">Profil</span>
      </NuxtLink>

      <NuxtLink
        to="/dashboard/settings"
        class="flex flex-col items-center text-gray-700 hover:text-primary transition-colors"
      >
        <svg
          class="h-5 w-5 mb-1"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        <span class="text-xs">Paramètres</span>
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useNuxtApp } from "#app";

const { $supabase } = useNuxtApp();

const logout = async () => {
  try {
    await $supabase.auth.signOut();
    await navigateTo("/login");
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error);
  }
};
</script>
