<template>
  <div class="pt-0 pb-16 md:pb-0 md:pl-34">
    <div class="max-w-4xl mx-auto px-4 py-8">
      <div class="bg-white rounded-lg shadow-md p-8">
        <h1 class="text-2xl font-bold text-gray-800 mb-8">Paramètres</h1>

        <!-- Loader pendant le chargement du profil -->
        <div v-if="isLoading" class="flex justify-center items-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>

        <!-- Erreur si problème de chargement -->
        <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p class="text-red-600 text-sm">{{ error }}</p>
          <button @click="refreshProfile" class="mt-2 text-sm text-red-700 hover:text-red-800 underline">
            Réessayer
          </button>
        </div>

        <!-- Contenu principal -->
        <div v-else class="space-y-8">
          <!-- Compte -->
          <div class="border-b border-gray-200 pb-8">
            <h2 class="text-lg font-medium text-gray-700 mb-6">Compte</h2>
            <div class="space-y-6">
              <div class="flex items-center justify-between">
                <span class="text-gray-600">Nom d'utilisateur</span>
                <span class="font-medium text-gray-800">{{ profile?.username || "Non défini" }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-600">Email</span>
                <span class="font-medium text-gray-800">{{ user?.email || "Non défini" }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-600">Abonnement</span>
                <span
                  class="font-medium px-3 py-1.5 rounded-full text-sm"
                  :class="{
                    'bg-green-100 text-green-800': profile?.subscription_type === 'premium',
                    'bg-blue-100 text-blue-800': profile?.subscription_type === 'pro',
                    'bg-gray-100 text-gray-800': profile?.subscription_type === 'freemium',
                  }"
                >
                  {{ subscriptionLabel }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-600">Limite mensuelle</span>
                <span class="font-medium text-gray-800">
                  {{ profile?.books_created_count || 0 }}/{{ profile?.monthly_limit || 0 }} livres
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-600">Total des livres ajoutés</span>
                <span class="font-medium text-gray-800">{{ profile?.books_created_count || 0 }} livres</span>
              </div>
            </div>
          </div>

          <!-- Sécurité -->
          <div class="border-b border-gray-200 pb-8">
            <h2 class="text-lg font-medium text-gray-700 mb-6">Sécurité</h2>
            <div class="space-y-6">
              <div class="flex items-center justify-between">
                <span class="text-gray-600">Mot de passe</span>
                <button
                  class="text-sm text-primary hover:text-primary-dark font-medium"
                  @click="openChangePasswordModal"
                >
                  Modifier
                </button>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-600">Déconnexion</span>
                <button class="text-sm text-red-500 hover:text-red-600 font-medium" @click="handleLogout">
                  Se déconnecter
                </button>
              </div>
            </div>
          </div>

          <!-- Préférences -->
          <div>
            <h2 class="text-lg font-medium text-gray-700 mb-6">Préférences</h2>
            <div class="space-y-6">
              <div class="flex items-center justify-between">
                <span class="text-gray-600">Mode sombre</span>
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" v-model="darkMode" class="sr-only peer" />
                  <div
                    class="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-primary-dark peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"
                  ></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useAuth } from "~/composables/useAuth";
import { useProfile } from "~/composables/useProfile";

definePageMeta({
  middleware: "auth",
  layout: "dashboard",
});

const { user, signOut } = useAuth();
const { profile, isLoading, error, subscriptionLabel, refreshProfile } = useProfile();

const darkMode = ref(false);

const handleLogout = async () => {
  try {
    await signOut();
    await navigateTo("/", { replace: true });
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error);
  }
};

const openChangePasswordModal = () => {
  console.log("Changement de mot de passe à implémenter");
};
</script>

<style>
/* Styles spécifiques si nécessaire */
</style>
