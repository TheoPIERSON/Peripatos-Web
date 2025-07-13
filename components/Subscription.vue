<template>
  <div class="pt-0 pb-16 md:pb-0 md:pl-34">
    <div class="max-w-4xl mx-auto px-4 py-8">
      <div class="bg-white rounded-lg shadow-md p-8">
        <h1 class="text-2xl font-bold text-gray-800 mb-8">Abonnement</h1>

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
          <!-- Abonnement actuel -->
          <div class="border-b border-gray-200 pb-8">
            <h2 class="text-lg font-medium text-gray-700 mb-6">Votre abonnement actuel</h2>
            <div class="flex items-center justify-between bg-gray-50 p-6 rounded-lg">
              <div class="flex items-center space-x-4">
                <div
                  class="w-4 h-4 rounded-full"
                  :class="{
                    'bg-green-500': profile?.subscription_type === 'premium',
                    'bg-blue-500': profile?.subscription_type === 'pro',
                    'bg-yellow-500': profile?.subscription_type === 'freemium',
                  }"
                ></div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-800">{{ subscriptionLabel }}</h3>
                  <p class="text-sm text-gray-600">
                    {{ profile?.books_created_count || 0 }}/{{ profile?.monthly_limit || 0 }} livres ce mois-ci
                  </p>
                </div>
              </div>
              <div class="text-right">
                <div class="text-2xl font-bold text-gray-800">
                  {{ getCurrentPrice() }}
                </div>
                <div class="text-sm text-gray-600">par mois</div>
              </div>
            </div>
          </div>

          <!-- Plans d'abonnement -->
          <div>
            <h2 class="text-lg font-medium text-gray-700 mb-6">Choisissez votre plan</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <!-- Plan Freemium -->
              <div
                class="border-2 rounded-lg p-6 relative"
                :class="{
                  'border-yellow-500 bg-yellow-50': profile?.subscription_type === 'freemium',
                  'border-gray-200 hover:border-gray-300': profile?.subscription_type !== 'freemium',
                }"
              >
                <div
                  v-if="profile?.subscription_type === 'freemium'"
                  class="absolute -top-3 left-1/2 transform -translate-x-1/2"
                >
                  <span class="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">Actuel</span>
                </div>

                <div class="text-center">
                  <h3 class="text-xl font-semibold text-gray-800 mb-2">Freemium</h3>
                  <div class="text-3xl font-bold text-gray-800 mb-1">0€</div>
                  <div class="text-sm text-gray-600 mb-6">par mois</div>

                  <ul class="text-left space-y-3 mb-6">
                    <li class="flex items-center text-sm text-gray-600">
                      <svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fill-rule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                      10 livres par mois
                    </li>
                    <li class="flex items-center text-sm text-gray-600">
                      <svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fill-rule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                      Gestion de base
                    </li>
                    <li class="flex items-center text-sm text-gray-600">
                      <svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fill-rule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                      Support communautaire
                    </li>
                  </ul>

                  <button
                    v-if="profile?.subscription_type !== 'freemium'"
                    @click="changePlan('freemium')"
                    class="w-full py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Rétrograder
                  </button>
                  <div v-else class="w-full py-2 px-4 bg-gray-100 rounded-lg text-gray-500 text-center">
                    Plan actuel
                  </div>
                </div>
              </div>

              <!-- Plan Pro -->
              <div
                class="border-2 rounded-lg p-6 relative"
                :class="{
                  'border-blue-500 bg-blue-50': profile?.subscription_type === 'pro',
                  'border-gray-200 hover:border-blue-300': profile?.subscription_type !== 'pro',
                }"
              >
                <div
                  v-if="profile?.subscription_type === 'pro'"
                  class="absolute -top-3 left-1/2 transform -translate-x-1/2"
                >
                  <span class="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">Actuel</span>
                </div>

                <div
                  v-if="profile?.subscription_type === 'freemium'"
                  class="absolute -top-3 left-1/2 transform -translate-x-1/2"
                >
                  <span
                    class="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium"
                    >Recommandé</span
                  >
                </div>

                <div class="text-center">
                  <h3 class="text-xl font-semibold text-gray-800 mb-2">Premium</h3>
                  <div class="text-3xl font-bold text-gray-800 mb-1">1.99€</div>
                  <div class="text-sm text-gray-600 mb-6">par mois</div>

                  <ul class="text-left space-y-3 mb-6">
                    <li class="flex items-center text-sm text-gray-600">
                      <svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fill-rule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                      80 livres par mois
                    </li>
                    <li class="flex items-center text-sm text-gray-600">
                      <svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fill-rule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                      Statistiques avancées
                    </li>
                    <li class="flex items-center text-sm text-gray-600">
                      <svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fill-rule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                      Support prioritaire
                    </li>
                  </ul>

                  <button
                    v-if="profile?.subscription_type !== 'pro'"
                    @click="changePlan('pro')"
                    class="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                    :class="{
                      'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600':
                        profile?.subscription_type === 'freemium',
                    }"
                  >
                    {{ profile?.subscription_type === "freemium" ? "Passer au Pro" : "Changer pour Pro" }}
                  </button>
                  <div v-else class="w-full py-2 px-4 bg-gray-100 rounded-lg text-gray-500 text-center">
                    Plan actuel
                  </div>
                </div>
              </div>

              <!-- Plan Premium -->
              <div
                class="border-2 rounded-lg p-6 relative"
                :class="{
                  'border-green-500 bg-green-50': profile?.subscription_type === 'premium',
                  'border-gray-200 hover:border-green-300': profile?.subscription_type !== 'premium',
                }"
              >
                <div
                  v-if="profile?.subscription_type === 'premium'"
                  class="absolute -top-3 left-1/2 transform -translate-x-1/2"
                >
                  <span class="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">Actuel</span>
                </div>

                <div
                  v-if="profile?.subscription_type === 'pro'"
                  class="absolute -top-3 left-1/2 transform -translate-x-1/2"
                >
                  <span
                    class="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-sm font-medium"
                    >Upgrade</span
                  >
                </div>

                <div class="text-center">
                  <h3 class="text-xl font-semibold text-gray-800 mb-2">Pro</h3>
                  <div class="text-3xl font-bold text-gray-800 mb-1">8.99€</div>
                  <div class="text-sm text-gray-600 mb-6">par mois</div>

                  <ul class="text-left space-y-3 mb-6">
                    <li class="flex items-center text-sm text-gray-600">
                      <svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fill-rule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                      200 livres par mois
                    </li>

                    <li class="flex items-center text-sm text-gray-600">
                      <svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fill-rule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                      Recommandations personnalisées
                    </li>
                    <li class="flex items-center text-sm text-gray-600">
                      <svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fill-rule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                      Support 24/7
                    </li>
                    <li class="flex items-center text-sm text-gray-600">
                      <svg class="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fill-rule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clip-rule="evenodd"
                        ></path>
                      </svg>
                      Accès aux fonctionnalités beta
                    </li>
                  </ul>

                  <button
                    v-if="profile?.subscription_type !== 'premium'"
                    @click="changePlan('premium')"
                    class="w-full py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
                    :class="{
                      'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600':
                        profile?.subscription_type === 'pro',
                    }"
                  >
                    {{ profile?.subscription_type === "freemium" ? "Passer au Premium" : "Upgrade Premium" }}
                  </button>
                  <div v-else class="w-full py-2 px-4 bg-gray-100 rounded-lg text-gray-500 text-center">
                    Plan actuel
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Avantages de l'upgrade -->
          <div
            v-if="profile?.subscription_type !== 'premium'"
            class="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg"
          >
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Pourquoi passer au {{ getRecommendedPlan() }} ?</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="flex items-start space-x-3">
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h4 class="font-medium text-gray-800">Plus de capacité</h4>
                  <p class="text-sm text-gray-600">Ajoutez plus de livres chaque mois</p>
                </div>
              </div>
              <div class="flex items-start space-x-3">
                <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    ></path>
                  </svg>
                </div>
                <div>
                  <h4 class="font-medium text-gray-800">Fonctionnalités avancées</h4>
                  <p class="text-sm text-gray-600">Accès aux outils d'analyse et statistiques</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useProfile } from "~/composables/useProfile";

definePageMeta({
  middleware: "auth",
  layout: "dashboard",
});

const { profile, isLoading, error, subscriptionLabel, refreshProfile } = useProfile();

const getCurrentPrice = () => {
  if (!profile.value?.subscription_type) return "0€";

  const prices = {
    freemium: "0€",
    pro: "9€",
    premium: "19€",
  };

  return prices[profile.value.subscription_type];
};

const getRecommendedPlan = () => {
  if (!profile.value?.subscription_type) return "Pro";

  const recommendations = {
    freemium: "Pro",
    pro: "Premium",
    premium: "Premium",
  };

  return recommendations[profile.value.subscription_type];
};

const changePlan = async (newPlan: "freemium" | "pro" | "premium") => {
  console.log(`Changement vers le plan ${newPlan}`);
};
</script>

<style scoped>
/* Styles spécifiques si nécessaire */
</style>
