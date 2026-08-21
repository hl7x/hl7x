<script setup>
import { RouterLink } from 'vue-router'
import BrandMark from './BrandMark.vue'

const year = new Date().getFullYear()

const columns = [
  {
    title: 'Tools',
    links: [
      { to: '/placebo', label: 'placebo' },
      { to: '/tools', label: 'All tools' }
    ]
  },
  {
    title: 'Resources',
    links: [
      { to: '/docs', label: 'Documentation' },
      { to: '/contribute', label: 'Contribute' }
    ]
  }
]

const external = [
  { href: 'https://github.com/hl7x', label: 'GitHub' },
  { href: 'https://github.com/hl7x/discussions', label: 'Discussions' }
]
</script>

<template>
  <footer class="ftr">
    <div class="container ftr__inner">
      <div class="ftr__brand">
        <RouterLink to="/" class="ftr__logo">
          <BrandMark :size="26" />
          <span>HL7X</span>
        </RouterLink>
        <p class="ftr__tag muted">
          Open source developer tools for healthcare integration.
          Built in the open — free forever.
        </p>
      </div>

      <nav class="ftr__cols" aria-label="Footer">
        <div v-for="col in columns" :key="col.title" class="ftr__col">
          <h3 class="ftr__h">{{ col.title }}</h3>
          <RouterLink
            v-for="link in col.links"
            :key="link.to"
            :to="link.to"
            class="ftr__link"
          >
            {{ link.label }}
          </RouterLink>
        </div>
        <div class="ftr__col">
          <h3 class="ftr__h">Community</h3>
          <a
            v-for="link in external"
            :key="link.href"
            :href="link.href"
            class="ftr__link"
            target="_blank"
            rel="noopener"
          >
            {{ link.label }}
          </a>
        </div>
      </nav>
    </div>

    <div class="container ftr__bottom">
      <span class="muted">© {{ year }} HL7X · Open source</span>
      <span class="muted mono ftr__note">Not affiliated with HL7® International</span>
    </div>
  </footer>
</template>

<style scoped>
.ftr {
  border-top: 1px solid var(--border);
  background: var(--surface);
  margin-top: 64px;
}

.ftr__inner {
  display: grid;
  grid-template-columns: 1.3fr 2fr;
  gap: 48px;
  padding-block: 56px 36px;
}

.ftr__logo {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  font-weight: 800;
  font-size: 1.05rem;
  color: var(--text);
  letter-spacing: -0.03em;
}
.ftr__tag {
  margin-top: 14px;
  max-width: 36ch;
  font-size: 0.9rem;
}

.ftr__cols {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}
.ftr__col {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.ftr__h {
  font-size: 0.78rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--text-muted);
  margin-bottom: 2px;
}
.ftr__link {
  color: var(--text-soft);
  font-size: 0.92rem;
}
.ftr__link:hover {
  color: var(--accent);
}

.ftr__bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-block: 22px;
  border-top: 1px solid var(--border);
  font-size: 0.82rem;
}
.ftr__note {
  font-size: 0.76rem;
}

@media (max-width: 760px) {
  .ftr__inner {
    grid-template-columns: 1fr;
    gap: 36px;
  }
}
@media (max-width: 480px) {
  .ftr__cols {
    grid-template-columns: repeat(2, 1fr);
  }
  .ftr__bottom {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
}
</style>
