<template>
  <div class="pt-0 pb-16 md:pb-0 md:pl-34">
    <div class="max-w-4xl mx-auto px-4 py-8">
      <div class="bg-white rounded-lg shadow-md p-8">
        <h1 class="text-2xl font-bold text-gray-800 mb-8">Paramètres</h1>

        <div class="space-y-8">
          <!-- Compte -->
          <div class="border-b border-gray-200 pb-8">
            <h2 class="text-lg font-medium text-gray-700 mb-6">Compte</h2>
            <div class="space-y-6">
              <div class="flex items-center justify-between">
                <span class="text-gray-600">Nom d'utilisateur</span>
                <!--   <span class="font-medium text-gray-800">{{ user?.username }}</span>-->
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-600">Email</span>
                <span class="font-medium text-gray-800">{{ user?.email }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-gray-600">Abonnement</span>
                <!--  <span
                  class="font-medium px-3 py-1.5 rounded-full text-sm"
                  :class="{
                    'bg-green-100 text-green-800': user?.isPremium,
                    'bg-gray-100 text-gray-800': !user?.isPremium,
                  }"
                >
                  {{ user?.isPremium ? "Premium" : "Freemium" }}
                </span> -->
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
                  Déconnexion
                </button>
              </div>
            </div>
          </div>

          <!-- Préférences -->
          <div>
            <h2 class="text-lg font-medium text-gray-700 mb-6">Préférences</h2>
            <div class="space-y-6">
              <div class="flex items-center">
                <label class="text-gray-600 mr-4">Mode sombre</label>
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
definePageMeta({
  middleware: "auth",
  layout: "dashboard",
});

const { user, signOut } = useAuth();
const router = useRouter();

const darkMode = ref(false);

// Dans votre composant de déconnexion
const handleLogout = async () => {
  try {
    await signOut();

    // Rediriger vers la page d'accueil
    await navigateTo("/", { replace: true });
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error);
  }
};

const openChangePasswordModal = () => {
  // À implémenter : ouvrir le modal de changement de mot de passe
  console.log("Changement de mot de passe à implémenter");
};
</script>

<style>
/* Styles spécifiques si nécessaire */
</style>
