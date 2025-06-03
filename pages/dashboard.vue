<template>
  <div class="min-h-screen bg-gray-100">
    <nav class="bg-white shadow">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-semibold">Dashboard</h1>
          </div>
          <div class="flex items-center">
            <span class="text-gray-700 mr-4">{{ user?.email }}</span>
            <button
              @click="logout"
              class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </nav>

    <main class="py-10">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="bg-white overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h2 class="text-lg font-medium text-gray-900 mb-4">Bienvenue sur votre dashboard !</h2>
            <p class="text-gray-600">Vous êtes maintenant connecté avec succès.</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
// Protéger cette page avec le middleware d'authentification
definePageMeta({
  middleware: "auth",
});

const { $supabase, $user } = useNuxtApp();
const user = $user;

const logout = async () => {
  try {
    await $supabase.auth.signOut();
    await navigateTo("/login");
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error);
  }
};
</script>
