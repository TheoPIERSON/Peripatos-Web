<template>
  <nav
    class="fixed z-50 bg-white shadow-lg w-full bottom-0 left-0 h-16 flex justify-around items-center md:top-0 md:left-0 md:bottom-0 md:w-44 md:h-full md:flex-col md:justify-start md:py-4"
  >
    <div class="flex flex-col items-center justify-between py-3 mb-4 md:justify-center border-b border-gray-200">
      <div class="text-center grid place-items-center">
        <span class="text-2xl font-bold text-primary">Peripatos</span>
        <img
          src="/images/aristote.png"
          alt="Avatar"
          class="h-16 w-16 rounded-full object-cover cursor-pointer relative border-3 border-green-500 mt-4"
        />
      </div>
    </div>
    <NuxtLink
      to="/"
      class="flex flex-col items-center text-gray-700 hover:text-primary transition-colors mb-0 md:mb-6 mt-6"
    >
      <Icon name="fluent-color:add-circle-16" style="color: black" size="32" />
      <span class="text-xs">Ajouter un livre</span>
    </NuxtLink>

    <NuxtLink
      to="/dashboard/profile"
      class="flex flex-col items-center text-gray-700 hover:text-primary transition-colors mb-0 md:mb-6 mt-6"
    >
      <Icon name="fluent-color:library-24" style="color: black" size="32" />
      <span class="text-xs">Bibliothèque</span>
    </NuxtLink>

    <NuxtLink
      to="/dashboard/profile"
      class="flex flex-col items-center text-gray-700 hover:text-primary transition-colors mb-0 md:mb-6 mt-6"
    >
      <Icon name="fluent-color:book-16" style="color: black" size="32" />

      <span class="text-xs">Liste d'envie</span>
    </NuxtLink>
    <NuxtLink
      to="/dashboard/profile"
      class="flex flex-col items-center text-gray-700 hover:text-primary transition-colors mb-0 md:mb-6 mt-6"
    >
      <Icon name="fluent-color:heart-28" style="color: black" size="32" />

      <span class="text-xs">Favoris</span>
    </NuxtLink>

    <NuxtLink
      to="/dashboard/settings"
      class="flex flex-col items-center text-gray-700 hover:text-primary transition-colors mt-auto pt-4 border-t border-gray-200"
    >
      <Icon name="fluent-color:settings-32" style="color: black" size="32" />
      <span class="text-xs">Paramètres</span>
    </NuxtLink>
  </nav>
</template>
