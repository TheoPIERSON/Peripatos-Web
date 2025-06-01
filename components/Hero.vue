<template>
  <div class="relative min-h-screen bg-background">
    <div>
      <img src="/images/aristote.png" alt="Aristote" class="w-1/4 h-auto object-contain mx-auto" />
    </div>
    <div class="flex flex-col items-center justify-center h-full px-4 sm:px-6 lg:px-8">
      <h1 class="text-8xl text-primary mb-4">Peripatos</h1>
      <p class="text-xl text-center mb-8">Vos lectures. Vos Listes. Votre bibliothèque numérique</p>
      <NuxtLink
        to="/login"
        class="bg-accent text-black px-6 py-3 rounded-lg text-xl hover:bg-yellow-dark transition-colors focus:outline-none focus:ring-2 focus:ring-yellow focus:ring-offset-2"
      >
        Accéder à votre espace
      </NuxtLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
// Script setup pour TypeScript
</script>

<style scoped>
/* Styles spécifiques si nécessaire */
</style>
