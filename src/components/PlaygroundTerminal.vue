<script setup>
import { ref, nextTick, watch } from 'vue'

const props = defineProps({
  lines: { type: Array, required: true },
  busy: { type: Boolean, default: false },
  ready: { type: Boolean, default: false }
})

const emit = defineEmits(['submit'])

const input = ref('')
const inputEl = ref(null)
const scrollEl = ref(null)

// Shell-style history: the index walks backwards from the end, and -1 means
// "not browsing, show whatever is typed".
const history = ref([])
const historyIndex = ref(-1)
const draft = ref('')

function submit() {
  const line = input.value.trim()
  if (!line || props.busy || !props.ready) return

  if (history.value[history.value.length - 1] !== line) {
    history.value.push(line)
  }

  historyIndex.value = -1
  input.value = ''
  emit('submit', line)
}

function recall(direction) {
  if (history.value.length === 0) return

  if (historyIndex.value === -1) {
    if (direction > 0) return
    draft.value = input.value
    historyIndex.value = history.value.length - 1
  } else {
    const next = historyIndex.value + direction

    if (next >= history.value.length) {
      historyIndex.value = -1
      input.value = draft.value
      return
    }

    historyIndex.value = Math.max(0, next)
  }

  input.value = history.value[historyIndex.value]
}

function focus() {
  inputEl.value?.focus()
}

watch(
  () => props.lines.length,
  async () => {
    await nextTick()
    if (scrollEl.value) scrollEl.value.scrollTop = scrollEl.value.scrollHeight
  }
)

defineExpose({ focus })
</script>

<template>
  <div class="term" @click="focus">
    <div class="term__bar">
      <span class="term__dots" aria-hidden="true"><i></i><i></i><i></i></span>
      <span class="term__title mono">placebo — playground</span>
      <span v-if="busy" class="term__status mono">running…</span>
    </div>

    <div ref="scrollEl" class="term__scroll" role="log" aria-live="polite">
      <div v-for="(line, i) in lines" :key="i" class="term__line" :class="`term__line--${line.kind}`">
        <span v-if="line.kind === 'command'" class="term__prompt" aria-hidden="true">$</span><span>{{ line.text }}</span>
      </div>

      <div v-if="ready" class="term__entry">
        <span class="term__prompt" aria-hidden="true">$</span>
        <input
          ref="inputEl"
          v-model="input"
          class="term__input"
          type="text"
          :disabled="busy"
          spellcheck="false"
          autocapitalize="off"
          autocomplete="off"
          autocorrect="off"
          aria-label="placebo command"
          placeholder="try: placebo file hl7"
          @keydown.enter.prevent="submit"
          @keydown.up.prevent="recall(-1)"
          @keydown.down.prevent="recall(1)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.term {
  background: var(--code-bg);
  border: 1px solid var(--border-strong);
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  cursor: text;
}

.term__bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 9px 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.025);
}

.term__dots {
  display: inline-flex;
  gap: 6px;
}
.term__dots i {
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.14);
}

.term__title {
  font-size: 0.78rem;
  color: #94a3b8;
}

.term__status {
  margin-left: auto;
  font-size: 0.78rem;
  color: var(--teal-300);
}

.term__scroll {
  height: clamp(320px, 52vh, 560px);
  overflow-y: auto;
  padding: 16px 18px;
  font-family: var(--font-mono);
  font-size: 0.85rem;
  line-height: 1.65;
  color: var(--code-text);
}

.term__line {
  white-space: pre-wrap;
  word-break: break-word;
}

.term__line--command {
  color: #fff;
  font-weight: 600;
}
.term__line--err {
  color: #fca5a5;
}
.term__line--note {
  color: var(--teal-300);
}
.term__line--system {
  color: #94a3b8;
}

.term__prompt {
  color: var(--teal-400);
  margin-right: 8px;
  user-select: none;
}

.term__entry {
  display: flex;
  align-items: center;
}

.term__input {
  flex: 1;
  min-width: 0;
  background: transparent;
  border: 0;
  outline: none;
  padding: 0;
  color: #fff;
  font-family: var(--font-mono);
  font-size: 0.85rem;
  line-height: 1.65;
  caret-color: var(--teal-400);
}
.term__input::placeholder {
  color: #475569;
}

@media (max-width: 640px) {
  .term__scroll {
    font-size: 0.8rem;
    padding: 14px;
  }
}
</style>
