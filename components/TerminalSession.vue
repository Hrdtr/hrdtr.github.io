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
const showNav = (): Promise<void> => {
  return new Promise((resolve) => {
    linesResponses.value.push({
      isNav: true,
      line: lines.value + 1,
      response: null
    })
    linesRefs.value[lines.value].blur()
    lines.value++
    navFocused.value = 0
    setTimeout(() => {
      navRefs.value[0].focus()
      resolve()
    }, 50)
  })
}
const navSelected = async () => {
  await print('# ' + navigations.value[navFocused.value])
  navFocused.value = undefined
  addNewLine()
}

const cmd = async (e: Event) => {
  const val = (e.target as HTMLInputElement).value
  if (val) {
    if (val === 'nav') {
      await showNav()
    } else if (val === 'clear') {
      emit('clear')
    } else if (val === 'ping') {
      await print('# pong')
    } else {
      await print(`Command '${val.split(' ')[0]}' not found`)
    }
  }
  if ((val && val === 'clear') || (val && val === 'nav')) return null
  else addNewLine()
}

const containerClick = (e: any) => {
  const isResponse = Array.from(e.path).some(({ classList }) => {
    if (classList) return classList.contains('response')
    else return false
  })
  if (!isResponse) linesRefs.value[lines.value].focus()
}

onMounted(() => linesRefs.value[lines.value].focus())
</script>

<template>
  <div class="h-full flex flex-col space-y-1" @click="containerClick">
    <div
      v-for="(line, i) in Array.from(Array(lines + 1).keys())"
      :key="i"
      class="flex flex-row"
    >
      <template v-if="!linesResponses.find((i) => i.line === line)">
        <span class="mr-1">Hrdtr:~$</span>
        <input
          :ref="(el) => (linesRefs[i] = el)"
          :disabled="line !== linesRefs.length - 1"
          type="text"
          list="command-hints"
          @keyup.enter="cmd"
        />
        <datalist id="command-hints">
          <option v-for="(hint, hintIndex) in commandHints" :key="hintIndex">
            {{ hint }}
          </option>
        </datalist>
      </template>
      <template v-else>
        <ul
          v-if="linesResponses.find((i) => i.line === line).isNav"
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
        <div
          v-else
          :ref="(el) => (linesRefs[i] = el)"
          class="response"
          v-html="linesResponses.find((i) => i.line === line).response"
        ></div>
      </template>
    </div>
  </div>
</template>

<style scoped lang="postcss">
input,
textarea {
  @apply bg-transparent focus:outline-none w-full;
}
textarea {
  @apply resize-none leading-relaxed w-full;
}

.response {
  @apply w-full;
}

[list]::-webkit-calendar-picker-indicator {
  display: none !important;
}
</style>
