<template>
  <section class="py-16 sm:py-24 bg-white text-gray-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h2 class="text-5xl font-extrabold text-primary mb-4">Choisissez la formule qui vous correspond</h2>
        <p class="text-xl text-gray-600">
          Que vous soyez un lecteur occasionnel ou un passionné, Peripatos s'adapte à vos besoins.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-12 items-start justify-center">
        <div class="bg-background rounded-xl shadow-xl border border-gray-200 p-8 flex flex-col h-full">
          <h3 class="text-3xl font-bold text-primary mb-4 text-center">Formule Gratuite</h3>
          <p class="text-lg text-gray-600 text-center mb-6">Idéal pour démarrer votre bibliothèque numérique.</p>

          <div class="text-center mb-8">
            <span class="text-5xl font-extrabold text-gray-900">0</span>
            <span class="text-2xl font-medium text-gray-600">€/mois</span>
          </div>

          <ul class="list-none space-y-4 mb-8 flex-grow">
            <li class="flex items-center text-lg text-gray-700">
              <svg
                class="h-6 w-6 text-green-500 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Gestion de votre bibliothèque (Ajout/Suppression)
            </li>
            <li class="flex items-center text-lg text-gray-700">
              <svg
                class="h-6 w-6 text-green-500 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Mettre en favoris et noter vos lectures
            </li>
            <li class="flex items-center text-lg text-gray-700">
              <svg
                class="h-6 w-6 text-green-500 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Ajouter avis et descriptions
            </li>
            <li class="flex items-center text-lg text-gray-700">
              <svg
                class="h-6 w-6 text-yellow-500 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                ></path>
              </svg>
              Accès aux livres déjà présents dans notre catalogue
            </li>
            <li class="flex items-center text-lg text-gray-700">
              <svg
                class="h-6 w-6 text-yellow-500 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                ></path>
              </svg>
              Légères publicités discrètes
            </li>
          </ul>

          <NuxtLink
            to="/register"
            class="mt-auto block text-center bg-gray-200 text-gray-800 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          >
            Commencer Gratuitement
          </NuxtLink>
        </div>

        <div
          class="bg-accent rounded-xl shadow-xl border border-accent-dark p-8 flex flex-col h-full transform scale-105 relative z-10"
        >
          <div
            class="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-sm font-bold px-4 py-1 rounded-full shadow-md"
          >
            Recommandé
          </div>
          <h3 class="text-3xl font-bold text-black mb-4 text-center">Formule Premium</h3>
          <p class="text-lg text-gray-800 text-center mb-6">
            Débloquez tout le potentiel de votre expérience de lecture.
          </p>

          <div class="text-center mb-8">
            <span class="text-5xl font-extrabold text-black">1.99</span>
            <span class="text-2xl font-medium text-gray-800">€/mois</span>
          </div>

          <ul class="list-none space-y-4 mb-8 flex-grow">
            <li class="flex items-center text-lg text-gray-800 font-semibold">
              <svg
                class="h-6 w-6 text-primary mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Toutes les fonctionnalités de la formule Gratuite
            </li>
            <li class="flex items-center text-lg text-gray-800 font-semibold">
              <svg
                class="h-6 w-6 text-primary mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              **Ajoutez de nouveaux livres à la base de données**
            </li>
            <li class="flex items-center text-lg text-gray-800 font-semibold">
              <svg
                class="h-6 w-6 text-primary mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Expérience sans aucune publicité
            </li>
            <li class="flex items-center text-lg text-gray-800 font-semibold">
              <svg
                class="h-6 w-6 text-primary mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              Contribution à l'amélioration de Peripatos
            </li>
          </ul>

          <NuxtLink
            to="/premium-subscribe"
            class="mt-auto block text-center bg-primary text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Passer au Premium
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup></script>

<style scoped>
/* Pas de styles spécifiques nécessaires si Tailwind suffit */
</style>
