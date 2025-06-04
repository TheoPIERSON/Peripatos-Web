<template>
  <div class="auth-container">
    <h1>Inscription</h1>
    <form @submit.prevent="handleRegister">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Mot de passe" required />
      <button type="submit" :disabled="loading">
        {{ loading ? "Inscription..." : "S'inscrire" }}
      </button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="success" class="success">{{ success }}</p>
    <NuxtLink to="/login">Déjà un compte ? Se connecter</NuxtLink>
  </div>
</template>

<script setup>
const { signUp } = useAuth();

const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");
const success = ref("");

const handleRegister = async () => {
  loading.value = true;
  error.value = "";
  success.value = "";

  const { error: authError } = await signUp(email.value, password.value);

  if (authError) {
    error.value = authError.message;
  } else {
    success.value = "Inscription réussie ! Vérifiez votre email.";
  }

  loading.value = false;
};
</script>
