<script setup>
import { ref } from 'vue'

const props = defineProps({
  code: { type: String, required: true },
  label: { type: String, default: '' }
})

const copied = ref(false)
let resetTimer = null

async function copy() {
  try {
    await navigator.clipboard.writeText(props.code)
  } catch {
    const el = document.createElement('textarea')
    el.value = props.code
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
  <figure class="block">
    <figcaption v-if="label" class="block__bar">
      <span class="block__dots" aria-hidden="true">
        <i></i><i></i><i></i>
      </span>
      <span class="block__label mono">{{ label }}</span>
      <button class="block__copy" type="button" @click="copy">
        {{ copied ? 'Copied' : 'Copy' }}
      </button>
    </figcaption>
    <pre><code>{{ code }}</code></pre>
  </figure>
</template>

<style scoped>
.block {
  background: var(--code-bg);
  border: 1px solid var(--border-strong);
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.block__bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 9px 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.025);
}

.block__dots {
  display: inline-flex;
  gap: 6px;
}
.block__dots i {
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.14);
}

.block__label {
  font-size: 0.78rem;
  color: #94a3b8;
}

.block__copy {
  margin-left: auto;
  background: transparent;
  border: 0;
  color: #94a3b8;
  font-family: var(--font-sans);
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.15s var(--ease);
}
.block__copy:hover {
  color: var(--teal-200);
}

pre {
  margin: 0;
  padding: 18px;
  overflow-x: auto;
  font-size: 0.875rem;
  line-height: 1.7;
  color: var(--code-text);
}
pre code {
  display: block;
  white-space: pre;
}
</style>
