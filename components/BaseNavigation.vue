<template>
  <nav class="bg-white shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo -->
        <div class="flex items-center justify-center">
          <NuxtLink to="/" class="text-2xl text-primary px-2 rounded font-title">Peripatos</NuxtLink>
        </div>

        <!-- Navigation -->
        <div class="hidden sm:flex sm:items-center sm:space-x-8">
          <NuxtLink to="/" class="hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
            Accueil
          </NuxtLink>
          <NuxtLink to="/" class="hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
            Services
          </NuxtLink>
          <NuxtLink to="/" class="hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
            À propos
          </NuxtLink>
          <NuxtLink to="/" class="hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
            Contact
          </NuxtLink>
        </div>

        <!-- Actions -->
        <div class="flex items-center">
          <NuxtLink
            to="/register"
            class="bg-accent text-black px-4 py-2 mx-4 rounded-md text-sm font-semibold hover:bg-yellow-dark transition-colors focus:outline-none focus:ring-2 focus:ring-yellow focus:ring-offset-2"
          >
            S'inscrire
          </NuxtLink>

          <NuxtLink
            to="/login"
            class="bg-accent text-black px-4 py-2 mx-4 rounded-md text-sm font-semibold hover:bg-yellow-dark transition-colors focus:outline-none focus:ring-2 focus:ring-yellow focus:ring-offset-2"
          >
            Se connecter
          </NuxtLink>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
// Script setup pour TypeScript
</script>

<style scoped>
/* Styles spécifiques si nécessaire */
</style>
