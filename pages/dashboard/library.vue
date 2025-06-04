<template>
  <div class="pt-0 pb-16 md:pb-0 md:pl-64">hello</div>
</template>

<script lang="ts" setup>
definePageMeta({
  middleware: "auth",
  layout: "dashboard",
});

const { user, signOut } = useAuth();
const router = useRouter();

const handleLogout = async () => {
  await signOut();
  await router.push("/login");
};
</script>

<style></style>
