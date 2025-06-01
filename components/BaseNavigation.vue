<template>
  <nav class="bg-white shadow-lg">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Logo -->
        <div class="flex items-center">
          <span class="text-2xl text-primary px-2 py-1 rounded font-title">Peripatos</span>
        </div>

        <!-- Navigation -->
        <div class="hidden sm:flex sm:items-center sm:space-x-8">
          <a href="#" class="hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
            Accueil
          </a>
          <a href="#" class="hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
            Services
          </a>
          <a href="#" class="hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
            À propos
          </a>
          <a href="#" class="hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
            Contact
          </a>
        </div>

        <!-- Actions -->
        <div class="flex items-center">
          <NuxtLink
            to="/login"
            class="bg-accent text-black px-4 py-2 rounded-md text-sm font-semibold hover:bg-yellow-dark transition-colors focus:outline-none focus:ring-2 focus:ring-yellow focus:ring-offset-2"
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
