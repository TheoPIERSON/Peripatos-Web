<template>
  <div class="pt-0 pb-16 md:pb-0 md:pl-34">
    <Settings />
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  middleware: "auth",
  layout: "dashboard",
});

import Settings from "~/components/Dashboard/Settings.vue";
</script>

<style></style>
