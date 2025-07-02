<template>
  <div class="pt-0 md:ml-10 pb-16 md:pb-0 md:pl-34"><DashboardBooksList /></div>
</template>

<script lang="ts" setup>
definePageMeta({
  middleware: "auth",
  layout: "dashboard",
});
</script>

<style></style>
