<script setup lang="ts">
useHead({
  meta: [
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1, maximum-scale=1'
    }
  ]
})

const dateTimeString = ref<string>(new Date().toLocaleString())
onMounted(() => {
  setInterval(() => {
    dateTimeString.value = new Date().toLocaleString()
  }, 1000)
})
</script>

<template>
  <div class="h-full flex flex-col w-full antialiased bg-gray-900">
    <div
      class="flex flex-row items-center h-7 bg-gray-800 border-b border-gray-700 text-center text-white"
    >
      <div
        class="ml-2 border-red-900 bg-red-500 shadow-inner rounded-full w-3 h-3"
      ></div>
      <div
        class="ml-2 border-yellow-900 bg-yellow-500 shadow-inner rounded-full w-3 h-3"
      ></div>
      <div
        class="ml-2 border-green-900 bg-green-500 shadow-inner rounded-full w-3 h-3"
      ></div>
      <div class="mx-auto pr-16">
        <p class="text-center text-sm">Hrdtr:~</p>
      </div>
    </div>
    <div
      id="terminal"
      class="p-2 flex-1 flex flex-col space-y-1 h-full text-green-200 font-mono cursor-text text-xs"
    >
      <ClientOnly>
        <p>{{ dateTimeString }}</p>
      </ClientOnly>
      <slot />
    </div>
  </div>
</template>

<style lang="postcss">
html,
body {
  @apply bg-gray-900 h-full;
}

div#__nuxt {
  @apply h-full;
}
</style>
