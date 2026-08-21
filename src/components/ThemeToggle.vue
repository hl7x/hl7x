<script setup>
import { ref, onMounted } from 'vue'

const theme = ref('light')

function apply(next) {
  theme.value = next
  document.documentElement.setAttribute('data-theme', next)
  try {
    localStorage.setItem('hl7x-theme', next)
  } catch {
    /* storage unavailable — ignore */
  }
}

function toggle() {
  apply(theme.value === 'dark' ? 'light' : 'dark')
}

onMounted(() => {
  let stored = null
  try {
    stored = localStorage.getItem('hl7x-theme')
  } catch {
    /* ignore */
  }
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  apply(stored ?? (prefersDark ? 'dark' : 'light'))
})
</script>

<template>
  <button
    class="toggle"
    type="button"
    :aria-label="`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`"
    @click="toggle"
  >
    <svg v-if="theme === 'dark'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
    <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  </button>
</template>

<style scoped>
.toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  color: var(--text-soft);
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 9px;
  cursor: pointer;
  transition: all 0.15s var(--ease);
}
.toggle:hover {
  color: var(--accent);
  border-color: var(--accent-border);
  background: var(--accent-soft);
}
</style>
