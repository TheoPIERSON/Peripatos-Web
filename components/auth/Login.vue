<template>
  <div class="flex items-center justify-center bg-background">
    <div class="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
      <div>
        <h2 class="text-2xl font-bold text-primary">Se connecter à votre compte</h2>
      </div>
      <div v-if="error" class="rounded-md bg-red-50 p-4 mb-4">
        <div class="flex">
          <div class="ml-3">
            <p class="text-sm text-red-700">{{ error }}</p>
          </div>
        </div>
      </div>
      <form class="space-y-6" @submit.prevent="handleLogin">
        <div>
          <label for="email" class="block text-sm font-medium text-primary mb-1">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            class="appearance-none w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
            placeholder="Votre email"
          />
        </div>
        <div>
          <label for="password" class="block text-sm font-medium text-primary mb-1">Mot de passe</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            class="appearance-none w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
            placeholder="Votre mot de passe"
          />
        </div>

        <div class="text-right mb-4">
          <NuxtLink to="/register" class="text-sm text-accent hover:text-accent-dark font-medium"
            >Mot de passe oublié ?</NuxtLink
          >
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="w-full flex justify-center py-3 px-4 border border-transparent text-base font-medium rounded-md text-primary bg-accent hover:bg-accent-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span v-if="loading" class="flex items-center">
              <svg
                class="animate-spin -ml-1 mr-3 h-5 w-5 text-primary"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Connexion...
            </span>
            <span v-else>Se connecter</span>
          </button>
        </div>
      </form>

      <div class="text-center">
        <NuxtLink to="/register" class="text-sm text-accent hover:text-accent-dark font-medium">
          Pas encore de compte ? S'inscrire
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { signIn } = useAuth();
const router = useRouter();

const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");

const handleLogin = async () => {
  loading.value = true;
  error.value = "";

  try {
    const { error: authError } = await signIn(email.value, password.value);

    if (authError) {
      error.value = authError.message || "Une erreur est survenue lors de la connexion";
    } else {
      console.log("Connexion réussie");
      await router.push("/library");
    }
  } catch (err: any) {
    console.error("Erreur de connexion:", err);
    error.value = err.message || "Une erreur est survenue lors de la connexion";
  } finally {
    loading.value = false;
  }
};
</script>
