<script setup lang="ts">
import MarkdownIt from 'markdown-it'

const emit = defineEmits<{
  (e: 'clear'): void
}>()

const navigations = ref<string[]>(['about', 'contact', 'projects', 'tools'])
const commandHints = ref<string[]>([
  ...navigations.value,
  'nav',
  'ping',
  'clear'
])

const lines = ref<number>(0)
const linesRefs = ref<any[]>([])
const linesResponses = ref<
  { isNav?: boolean; line: number; response: string | null }[]
>([])

const addNewLine = () => {
  lines.value++
  setTimeout(() => {
    linesRefs.value[lines.value].focus()
  }, 50)
}

const md = new MarkdownIt()
const print = (str: string): Promise<void> => {
  return new Promise((resolve) => {
    linesResponses.value.push({
      line: lines.value + 1,
      response: md.render(str)
    })
    lines.value++
    resolve()
  })
}

const navRefs = ref<any[]>([])
const navFocused = ref<number>()
const navSelected = async () => {
  await print('# ' + navigations.value[navFocused.value])
  navFocused.value = undefined
  addNewLine()
}

onMounted(() => linesRefs.value[lines.value].focus())
</script>

<template>
  <ul
          class="flex flex-col space-y-1"
        >
          <li
            v-for="(nav, navIndex) in navigations"
            :ref="(el) => (navRefs[navIndex] = el)"
            :key="navIndex"
            :tabindex="navIndex"
            :class="{
              'border-b': i === lines && navFocused === navIndex
            }"
            class="focus:outline-none"
            @keyup.enter.prevent="navSelected"
            @keyup="
              (e) => {
                if (e.keyCode === 38 && navFocused > 0) {
                  navFocused--
                } else if (
                  e.keyCode === 40 &&
                  navFocused < navigations.length - 1
                ) {
                  navFocused++
                }
              }
            "
          >
            &gt; {{ nav }}
          </li>
        </ul>
</template>
