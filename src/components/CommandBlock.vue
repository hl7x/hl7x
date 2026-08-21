<script setup>
import { ref } from 'vue'

const props = defineProps({
  command: { type: String, required: true },
  prompt: { type: String, default: '$' }
})

const copied = ref(false)
let resetTimer = null

async function copy() {
  try {
    await navigator.clipboard.writeText(props.command)
  } catch {
    // Fallback for non-secure contexts
    const el = document.createElement('textarea')
    el.value = props.command
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
  }
  copied.value = true
  clearTimeout(resetTimer)
  resetTimer = setTimeout(() => (copied.value = false), 1800)
}
</script>

<template>
  <div class="cmd">
    <code class="cmd__text">
      <span class="cmd__prompt" aria-hidden="true">{{ prompt }}</span>
      <span class="cmd__value">{{ command }}</span>
    </code>
    <button
      class="cmd__copy"
      type="button"
      :aria-label="copied ? 'Copied' : 'Copy command to clipboard'"
      @click="copy"
    >
      <svg
        v-if="!copied"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <rect x="9" y="9" width="13" height="13" rx="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </svg>
      <svg
        v-else
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
      <span>{{ copied ? 'Copied' : 'Copy' }}</span>
    </button>
  </div>
</template>

<style scoped>
.cmd {
  display: flex;
  align-items: stretch;
  gap: 8px;
  background: var(--code-bg);
  border: 1px solid var(--border-strong);
  border-radius: var(--radius);
  padding: 6px 6px 6px 18px;
  box-shadow: var(--shadow);
  overflow: hidden;
}

.cmd__text {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
  font-size: 0.95rem;
  color: var(--code-text);
  overflow-x: auto;
  scrollbar-width: none;
  padding-block: 10px;
}
.cmd__text::-webkit-scrollbar {
  display: none;
}

.cmd__prompt {
  color: var(--teal-400);
  user-select: none;
  font-weight: 600;
}

.cmd__value {
  white-space: nowrap;
}

.cmd__copy {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.06);
  color: #cbd5e1;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 7px;
  padding: 0 14px;
  font-family: var(--font-sans);
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s var(--ease);
}
.cmd__copy:hover {
  background: rgba(94, 234, 212, 0.14);
  color: var(--teal-200);
  border-color: rgba(94, 234, 212, 0.4);
}
.cmd__copy svg {
  flex-shrink: 0;
}

@media (max-width: 560px) {
  .cmd {
    padding-left: 14px;
  }
  .cmd__copy span {
    display: none;
  }
  .cmd__copy {
    padding: 0 11px;
  }
}
</style>
