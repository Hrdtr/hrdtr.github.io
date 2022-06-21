<script setup lang="ts">
definePageMeta({ layout: 'terminal' })

const session = ref<number>(0)
</script>

<template>
  <TerminalSession :key="session" @clear="session++" />
</template>
