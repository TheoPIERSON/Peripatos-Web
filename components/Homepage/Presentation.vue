<template>
  <section class="py-16 sm:py-24 bg-white text-gray-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h2 class="text-5xl font-extrabold text-primary mb-4">Organisez vos lectures, visualisez votre parcours</h2>
        <p class="text-xl text-gray-600">
          Peripatos est l'outil qu'il vous faut pour donner vie à votre bibliothèque numérique.
        </p>
      </div>

      <div class="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h3 class="text-3xl font-bold text-primary mb-4">Fatigué de perdre le fil de vos lectures ?</h3>
          <p class="text-lg text-gray-700 mb-6">
            Vous utilisez des carnets, des applications génériques ou de simples notes pour suivre vos lectures, mais
            rien ne vous permet de <span class="font-bold">visualiser clairement</span> votre progression et de
            <span class="font-bold">gérer efficacement</span>
            votre collection ? Il manque une solution pensée pour les amoureux des livres.
          </p>
          <p class="text-lg text-gray-700 mb-6">
            Avec Peripatos, cette frustration disparaît. Nous avons conçu une interface
            <span class="font-bold">intuitive et visuelle</span>, où chaque livre trouve sa place et chaque lecture est
            mise en valeur.
          </p>
        </div>
        <div class="relative flex justify-center items-center">
          <img
            src="/images/mockup-peripatos-library.png"
            alt="Visualisation de la bibliothèque Peripatos"
            class="rounded-lg shadow-xl max-w-full h-auto"
          />
          <div class="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-70 rounded-lg"></div>
        </div>
      </div>

      <div class="mt-20 text-center">
        <h3 class="text-4xl font-bold text-primary mb-6">Vos lectures, enfin organisées.</h3>
        <p class="text-xl text-gray-600 mb-10">
          Peripatos simplifie votre quotidien de lecteur avec des fonctionnalités pensées pour vous :
        </p>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-background p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div class="text-accent mb-4">
              <svg
                class="w-12 h-12 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                ></path>
              </svg>
            </div>
            <h4 class="text-2xl font-semibold text-primary mb-3">Gestion Simplifiée</h4>
            <p class="text-gray-700">
              Ajoutez, modifiez et organisez vos livres en un clin d'œil. Notre interface est pensée pour la rapidité et
              la facilité d'utilisation.
            </p>
          </div>

          <div class="bg-background p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div class="text-accent mb-4">
              <svg
                class="w-12 h-12 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                ></path>
              </svg>
            </div>
            <h4 class="text-2xl font-semibold text-primary mb-3">Visualisation Intuitive</h4>
            <p class="text-gray-700">
              Visualisez votre bibliothèque de manière attrayante. Fini les listes ennuyeuses, donnez vie à votre
              collection !
            </p>
          </div>

          <div class="bg-background p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <div class="text-accent mb-4">
              <svg
                class="w-12 h-12 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.324 1.118l1.519 4.674c.3.921-.755 1.688-1.539 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.539-1.118l1.519-4.674a1 1 0 00-.324-1.118L2.285 9.105c-.783-.57-.381-1.81.588-1.81h4.914a1 1 0 00.95-.69l1.519-4.674z"
                ></path>
              </svg>
            </div>
            <h4 class="text-2xl font-semibold text-primary mb-3">Vos Favoris & Avis</h4>
            <p class="text-gray-700">
              Notez vos lectures, mettez en avant vos coups de cœur et construisez une trace de vos expériences
              littéraires.
            </p>
          </div>
        </div>
      </div>

      <div class="mt-20 text-center">
        <h3 class="text-4xl font-bold text-primary mb-6">Prêt à transformer votre expérience de lecture ?</h3>
        <p class="text-xl text-gray-600 mb-8">
          Rejoignez la communauté Peripatos et commencez à organiser votre univers littéraire dès aujourd'hui.
        </p>
        <NuxtLink
          to="/login"
          class="bg-accent text-black px-8 py-4 rounded-lg text-xl font-semibold hover:bg-yellow-dark transition-colors focus:outline-none focus:ring-2 focus:ring-yellow focus:ring-offset-2"
        >
          Découvrir Peripatos
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
// Pas de logique spécifique au script pour ce composant de présentation
</script>

<style scoped>
/*
  Vous pouvez ajouter des styles spécifiques ici si Tailwind ne suffit pas,
  mais pour un design basé sur Tailwind, cela devrait être minimal.
*/
</style>
