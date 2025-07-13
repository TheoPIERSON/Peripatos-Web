<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-16">
        <h1 class="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
          Choisissez l'abonnement qui vous convient
        </h1>
        <p class="mt-5 text-xl text-gray-600 max-w-3xl mx-auto">
          Débloquez tout le potentiel de votre bibliothèque. Gérez, partagez et découvrez sans limites.
        </p>
      </div>

      <div v-if="isLoading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-4 border-primary"></div>
      </div>
      <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-12">
        <strong class="font-bold">Erreur !</strong>
        <span class="block sm:inline ml-2">{{ error }}</span>
        <button @click="refreshProfile" class="mt-2 text-sm text-red-800 hover:text-red-900 underline block">
          Réessayer le chargement
        </button>
      </div>

      <div v-else>
        <div
          class="bg-white p-6 rounded-lg shadow-lg mb-12 border border-gray-200 flex items-center justify-between flex-wrap gap-4"
        >
          <div class="flex items-center space-x-4">
            <div
              class="w-5 h-5 rounded-full"
              :class="{
                'bg-emerald-500': profile?.subscription_type === 'premium',
                'bg-sky-500': profile?.subscription_type === 'pro',
                'bg-amber-500': profile?.subscription_type === 'freemium',
              }"
            ></div>
            <div>
              <p class="text-sm font-medium text-gray-500">Votre abonnement actuel :</p>
              <h3 class="text-xl font-bold text-gray-900">{{ subscriptionLabel }}</h3>
            </div>
          </div>
          <div class="text-right">
            <p class="text-xl font-bold text-gray-800">
              {{ getCurrentPrice() }}<span class="text-base font-normal text-gray-600">/mois</span>
            </p>
            <p class="text-sm text-gray-600">
              {{ profile?.books_created_count || 0 }} livres sur {{ monthlyLimitForCurrentPlan }} créés
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
          <div
            class="bg-white rounded-xl shadow-lg p-8 flex flex-col transition-all duration-300 transform hover:scale-105 relative"
            :class="{
              'border-4 border-amber-500 shadow-xl': profile?.subscription_type === 'freemium',
              'border border-gray-200': profile?.subscription_type !== 'freemium',
            }"
          >
            <div
              v-if="profile?.subscription_type === 'freemium'"
              class="absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-amber-500 text-white text-sm font-semibold rounded-full shadow"
            >
              Votre Plan Actuel
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4 text-center">Gratuit</h3>
            <div class="text-center mb-6">
              <span class="text-5xl font-extrabold text-gray-900">0€</span>
              <span class="text-xl font-medium text-gray-600">/mois</span>
            </div>
            <ul class="space-y-4 flex-grow mb-8">
              <li class="flex items-center text-gray-700">
                <NuxtIcon name="check-circle" class="w-6 h-6 text-green-500 mr-2 flex-shrink-0" filled />
                10 nouveaux livres à ajouter dans l'application
              </li>
              <li class="flex items-center text-gray-700">
                <NuxtIcon name="check-circle" class="w-6 h-6 text-green-500 mr-2 flex-shrink-0" filled />
                Ajout illimité de livres existants
              </li>
              <li class="flex items-center text-gray-700">
                <NuxtIcon name="check-circle" class="w-6 h-6 text-green-500 mr-2 flex-shrink-0" filled />
                Gestion de votre bibliothèque personnelle
              </li>
              <li class="flex items-center text-gray-700">
                <NuxtIcon name="check-circle" class="w-6 h-6 text-green-500 mr-2 flex-shrink-0" filled />
                Support communautaire
              </li>
              <li class="flex items-center text-gray-400 opacity-70">
                <NuxtIcon name="x-circle" class="w-6 h-6 text-gray-400 mr-2 flex-shrink-0" filled />
                Statistiques avancées
              </li>
              <li class="flex items-center text-gray-400 opacity-70">
                <NuxtIcon name="x-circle" class="w-6 h-6 text-gray-400 mr-2 flex-shrink-0" filled />
                Recommandations personnalisées
              </li>
            </ul>
            <button
              v-if="profile?.subscription_type !== 'freemium'"
              @click="changePlan('freemium')"
              :disabled="isProcessing"
              class="mt-auto w-full py-3 px-6 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isProcessing">Chargement...</span>
              <span v-else>Rétrograder</span>
            </button>
            <div v-else class="mt-auto w-full py-3 px-6 bg-gray-100 rounded-lg text-gray-500 text-center font-semibold">
              Votre Plan Actuel
            </div>
          </div>

          <div
            class="bg-white rounded-xl shadow-lg p-8 flex flex-col transition-all duration-300 transform hover:scale-105 relative"
            :class="{
              'border-4 border-sky-500 shadow-xl': profile?.subscription_type === 'pro',
              'border border-gray-200': profile?.subscription_type !== 'pro',
            }"
          >
            <div
              v-if="profile?.subscription_type === 'pro'"
              class="absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-sky-500 text-white text-sm font-semibold rounded-full shadow"
            >
              Votre Plan Actuel
            </div>
            <div
              v-else-if="profile?.subscription_type === 'freemium'"
              class="absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-sky-500 to-indigo-500 text-white text-sm font-semibold rounded-full shadow"
            >
              Populaire !
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4 text-center">Premium</h3>
            <div class="text-center mb-6">
              <span class="text-5xl font-extrabold text-gray-900">1.99€</span>
              <span class="text-xl font-medium text-gray-600">/mois</span>
            </div>
            <ul class="space-y-4 flex-grow mb-8">
              <li class="flex items-center text-gray-700">
                <NuxtIcon name="check-circle" class="w-6 h-6 text-green-500 mr-2 flex-shrink-0" filled />
                80 nouveaux livres par mois
              </li>
              <li class="flex items-center text-gray-700">
                <NuxtIcon name="check-circle" class="w-6 h-6 text-green-500 mr-2 flex-shrink-0" filled />
                Ajout illimité de livres existants
              </li>
              <li class="flex items-center text-gray-700">
                <NuxtIcon name="check-circle" class="w-6 h-6 text-green-500 mr-2 flex-shrink-0" filled />
                Statistiques avancées
              </li>
              <li class="flex items-center text-gray-700">
                <NuxtIcon name="check-circle" class="w-6 h-6 text-green-500 mr-2 flex-shrink-0" filled />
                Support prioritaire
              </li>
              <li class="flex items-center text-gray-400 opacity-70">
                <NuxtIcon name="x-circle" class="w-6 h-6 text-gray-400 mr-2 flex-shrink-0" filled />
                Recommandations personnalisées
              </li>
              <li class="flex items-center text-gray-400 opacity-70">
                <NuxtIcon name="x-circle" class="w-6 h-6 text-gray-400 mr-2 flex-shrink-0" filled />
                Accès aux fonctionnalités Beta
              </li>
            </ul>
            <button
              v-if="profile?.subscription_type !== 'pro'"
              @click="changePlan('pro')"
              :disabled="isProcessing"
              class="mt-auto w-full py-3 px-6 bg-sky-500 text-white rounded-lg font-semibold hover:bg-sky-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isProcessing">Chargement...</span>
              <span v-else>Passer à Premium</span>
            </button>
            <div v-else class="mt-auto w-full py-3 px-6 bg-gray-100 rounded-lg text-gray-500 text-center font-semibold">
              Votre Plan Actuel
            </div>
          </div>

          <div
            class="bg-white rounded-xl shadow-lg p-8 flex flex-col transition-all duration-300 transform hover:scale-105 relative"
            :class="{
              'border-4 border-emerald-500 shadow-xl': profile?.subscription_type === 'premium',
              'border border-gray-200': profile?.subscription_type !== 'premium',
            }"
          >
            <div
              v-if="profile?.subscription_type === 'premium'"
              class="absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-emerald-500 text-white text-sm font-semibold rounded-full shadow"
            >
              Votre Plan Actuel
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-4 text-center">Pro</h3>
            <div class="text-center mb-6">
              <span class="text-5xl font-extrabold text-gray-900">8.99€</span>
              <span class="text-xl font-medium text-gray-600">/mois</span>
            </div>
            <ul class="space-y-4 flex-grow mb-8">
              <li class="flex items-center text-gray-700">
                <NuxtIcon name="check-circle" class="w-6 h-6 text-green-500 mr-2 flex-shrink-0" filled />
                200 nouveaux livres par mois
              </li>
              <li class="flex items-center text-gray-700">
                <NuxtIcon name="check-circle" class="w-6 h-6 text-green-500 mr-2 flex-shrink-0" filled />
                Ajout illimité de livres existants
              </li>
              <li class="flex items-center text-gray-700">
                <NuxtIcon name="check-circle" class="w-6 h-6 text-green-500 mr-2 flex-shrink-0" filled />
                Statistiques avancées complètes
              </li>
              <li class="flex items-center text-gray-700">
                <NuxtIcon name="check-circle" class="w-6 h-6 text-green-500 mr-2 flex-shrink-0" filled />
                Recommandations personnalisées
              </li>
              <li class="flex items-center text-gray-700">
                <NuxtIcon name="check-circle" class="w-6 h-6 text-green-500 mr-2 flex-shrink-0" filled />
                Support 24/7
              </li>
              <li class="flex items-center text-gray-700">
                <NuxtIcon name="check-circle" class="w-6 h-6 text-green-500 mr-2 flex-shrink-0" filled />
                Accès aux fonctionnalités Beta
              </li>
            </ul>
            <button
              v-if="profile?.subscription_type !== 'premium'"
              @click="changePlan('premium')"
              :disabled="isProcessing"
              class="mt-auto w-full py-3 px-6 bg-emerald-500 text-white rounded-lg font-semibold hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isProcessing">Chargement...</span>
              <span v-else>Passer à Pro</span>
            </button>
            <div v-else class="mt-auto w-full py-3 px-6 bg-gray-100 rounded-lg text-gray-500 text-center font-semibold">
              Votre Plan Actuel
            </div>
          </div>
        </div>

        <div v-if="profile?.subscription_type !== 'premium'" class="mt-20">
          <h2 class="text-3xl font-bold text-gray-900 text-center mb-10">Pourquoi passer à un plan supérieur ?</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div class="bg-white rounded-lg shadow-md p-6 text-center">
              <NuxtIcon name="book-open-solid" class="w-16 h-16 mx-auto text-sky-500 mb-4" filled />
              <h3 class="text-xl font-semibold text-gray-800 mb-2">Plus de livres, plus de découvertes</h3>
              <p class="text-gray-600">
                Ajoutez significativement plus de nouveaux titres chaque mois et enrichissez votre collection
                personnelle.
              </p>
            </div>
            <div class="bg-white rounded-lg shadow-md p-6 text-center">
              <NuxtIcon name="chart-bar" class="w-16 h-16 mx-auto text-emerald-500 mb-4" filled />
              <h3 class="text-xl font-semibold text-gray-800 mb-2">Statistiques approfondies</h3>
              <p class="text-gray-600">
                Obtenez des analyses détaillées sur vos habitudes de lecture, genres favoris et progrès.
              </p>
            </div>
            <div class="bg-white rounded-lg shadow-md p-6 text-center">
              <NuxtIcon name="face-smile" class="w-16 h-16 mx-auto text-indigo-500 mb-4" filled />
              <h3 class="text-xl font-semibold text-gray-800 mb-2">Support prioritaire</h3>
              <p class="text-gray-600">
                Bénéficiez d'une assistance rapide et personnalisée pour toutes vos questions.
              </p>
            </div>
          </div>
        </div>

        <div class="mt-20">
          <h2 class="text-3xl font-bold text-gray-900 text-center mb-10">Questions Fréquentes</h2>
          <div class="space-y-6 max-w-3xl mx-auto">
            <details class="bg-white p-6 rounded-lg shadow-md cursor-pointer group">
              <summary class="flex justify-between items-center font-semibold text-lg text-gray-800">
                Les livres ajoutés restent-ils si je rétrograde mon abonnement ?
                <span class="ml-2 group-open:rotate-180 transition-transform duration-200">
                  <NuxtIcon name="chevron-down" class="w-5 h-5 text-gray-500" filled />
                </span>
              </summary>
              <p class="mt-4 text-gray-600">
                Oui, tous les livres que vous avez ajoutés à votre bibliothèque (qu'ils soient nouveaux ou existants)
                restent dans votre compte, même si vous changez ou rétrogradez votre abonnement. La limite ne concerne
                que l'ajout de *nouveaux* livres à la base de données globale par mois.
              </p>
            </details>
            <details class="bg-white p-6 rounded-lg shadow-md cursor-pointer group">
              <summary class="flex justify-between items-center font-semibold text-lg text-gray-800">
                Puis-je annuler mon abonnement à tout moment ?
                <span class="ml-2 group-open:rotate-180 transition-transform duration-200">
                  <NuxtIcon name="chevron-down" class="w-5 h-5 text-gray-500" filled />
                </span>
              </summary>
              <p class="mt-4 text-gray-600">
                Oui, vous pouvez gérer et annuler votre abonnement à tout moment depuis votre tableau de bord, sans
                engagement. Votre abonnement restera actif jusqu'à la fin de la période de facturation en cours.
              </p>
            </details>
            <details class="bg-white p-6 rounded-lg shadow-md cursor-pointer group">
              <summary class="flex justify-between items-center font-semibold text-lg text-gray-800">
                Comment fonctionne l'ajout de "nouveaux livres" vs "livres existants" ?
                <span class="ml-2 group-open:rotate-180 transition-transform duration-200">
                  <NuxtIcon name="chevron-down" class="w-5 h-5 text-gray-500" filled />
                </span>
              </summary>
              <p class="mt-4 text-gray-600">
                La limite mensuelle s'applique uniquement à l'ajout de livres qui n'existent pas encore dans notre base
                de données principale. Si un livre est déjà répertorié, vous pouvez l'ajouter à votre bibliothèque
                personnelle de manière illimitée, quel que soit votre plan.
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import { useProfile } from "~/composables/useProfile";

definePageMeta({
  middleware: "auth",
  layout: "dashboard",
});

const { profile, isLoading, error, subscriptionLabel, refreshProfile, updateSubscriptionType } = useProfile();

const isProcessing = ref(false);

const monthlyLimits = {
  freemium: 10,
  pro: 80,
  premium: 200,
};

const monthlyLimitForCurrentPlan = computed(() => {
  if (!profile.value?.subscription_type) return 0;
  return monthlyLimits[profile.value.subscription_type as keyof typeof monthlyLimits] || 0;
});

const getCurrentPrice = () => {
  if (!profile.value?.subscription_type) return "0€";

  const prices = {
    freemium: "0€",
    pro: "1.99€",
    premium: "8.99€",
  };

  return prices[profile.value.subscription_type as keyof typeof prices];
};

const changePlan = async (newPlan: "freemium" | "pro" | "premium") => {
  if (isProcessing.value) return;

  isProcessing.value = true;
  try {
    await updateSubscriptionType(newPlan);
    await refreshProfile();
    console.log(`Votre abonnement a été mis à jour vers le plan ${newPlan} !`);
  } catch (err) {
    console.error("Erreur lors du changement de plan:", err);
  } finally {
    isProcessing.value = false;
  }
};
</script>

<style scoped>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
