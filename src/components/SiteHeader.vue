<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { RouterLink } from 'vue-router'
import BrandMark from './BrandMark.vue'
import ThemeToggle from './ThemeToggle.vue'

const menuOpen = ref(false)
const scrolled = ref(false)

const nav = [
  { to: '/placebo', label: 'placebo' },
  { to: '/tools', label: 'Tools' },
  { to: '/docs', label: 'Docs' },
  { to: '/contribute', label: 'Contribute' }
]

function onScroll() {
  scrolled.value = window.scrollY > 8
}

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <header class="hdr" :class="{ 'hdr--scrolled': scrolled }">
    <div class="container hdr__inner">
      <RouterLink to="/" class="hdr__brand" @click="menuOpen = false">
        <BrandMark :size="28" />
        <span class="hdr__name">HL7X</span>
      </RouterLink>

      <nav class="hdr__nav" :class="{ 'is-open': menuOpen }" aria-label="Primary">
        <RouterLink
          v-for="item in nav"
          :key="item.to"
          :to="item.to"
          class="hdr__link"
          @click="menuOpen = false"
        >
          {{ item.label }}
        </RouterLink>
        <a
          class="hdr__link hdr__link--ext"
          href="https://github.com/hl7x"
          target="_blank"
          rel="noopener"
          @click="menuOpen = false"
        >
          GitHub
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M9 7h8v8"/></svg>
        </a>
      </nav>

      <div class="hdr__actions">
        <ThemeToggle />
        <button
          class="hdr__burger"
          type="button"
          :aria-expanded="menuOpen"
          aria-label="Toggle menu"
          @click="menuOpen = !menuOpen"
        >
          <span :class="{ open: menuOpen }"></span>
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.hdr {
  position: sticky;
  top: 0;
  z-index: 50;
  height: var(--header-h);
  display: flex;
  align-items: center;
  background: color-mix(in srgb, var(--bg) 82%, transparent);
  backdrop-filter: saturate(180%) blur(12px);
  -webkit-backdrop-filter: saturate(180%) blur(12px);
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s var(--ease), background 0.2s var(--ease);
}
.hdr--scrolled {
  border-bottom-color: var(--border);
}

.hdr__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  width: 100%;
}

.hdr__brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--text);
  font-weight: 800;
}
.hdr__brand:hover {
  color: var(--text);
}
.hdr__name {
  font-size: 1.15rem;
  letter-spacing: -0.03em;
}

.hdr__nav {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-left: auto;
}

.hdr__link {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: var(--text-soft);
  font-size: 0.92rem;
  font-weight: 500;
  padding: 7px 12px;
  border-radius: 8px;
  transition: color 0.15s var(--ease), background 0.15s var(--ease);
}
.hdr__link:hover {
  color: var(--text);
  background: var(--surface-2);
}
.hdr__link.router-link-active {
  color: var(--accent);
}
.hdr__link--ext svg {
  opacity: 0.6;
}

.hdr__actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.hdr__burger {
  display: none;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 9px;
  cursor: pointer;
}
.hdr__burger span,
.hdr__burger span::before,
.hdr__burger span::after {
  content: '';
  display: block;
  width: 18px;
  height: 2px;
  background: var(--text);
  border-radius: 2px;
  transition: transform 0.2s var(--ease), opacity 0.2s var(--ease);
}
.hdr__burger span::before {
  transform: translateY(-6px);
}
.hdr__burger span::after {
  transform: translateY(4px);
}
.hdr__burger span.open {
  background: transparent;
}
.hdr__burger span.open::before {
  transform: rotate(45deg);
}
.hdr__burger span.open::after {
  transform: rotate(-45deg) translateY(-1.5px) translateX(1px);
}

@media (max-width: 760px) {
  .hdr__burger {
    display: inline-flex;
  }
  .hdr__nav {
    position: absolute;
    top: var(--header-h);
    left: 0;
    right: 0;
    flex-direction: column;
    align-items: stretch;
    gap: 2px;
    padding: 12px 18px 18px;
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    box-shadow: var(--shadow);
    transform: translateY(-8px);
    opacity: 0;
    pointer-events: none;
    transition: transform 0.2s var(--ease), opacity 0.2s var(--ease);
  }
  .hdr__nav.is-open {
    transform: translateY(0);
    opacity: 1;
    pointer-events: auto;
  }
  .hdr__link {
    padding: 11px 12px;
    font-size: 1rem;
  }
}
</style>
