<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import CommandBlock from '@/components/CommandBlock.vue'

const sections = [
  { id: 'getting-started', label: 'Getting started' },
  { id: 'install', label: 'Installing tools' },
  { id: 'concepts', label: 'Core concepts' },
  { id: 'guides', label: 'Guides' },
  { id: 'reference', label: 'Reference' },
  { id: 'support', label: 'Getting help' }
]

const guides = [
  {
    title: 'Seeding an interface engine',
    body: 'Send admit and discharge traffic at a test channel with placebo send hl7.',
    href: 'https://github.com/hl7x/placebo'
  },
  {
    title: 'Fake patients as CSV',
    body: 'Generate spreadsheets of test patients with placebo file csv for bulk loads.',
    href: 'https://github.com/hl7x/placebo'
  },
  {
    title: 'Reading raw HL7',
    body: 'Turn dense pipe-and-caret messages into readable JSON with placebo read sugarpill.',
    href: 'https://github.com/hl7x/placebo'
  },
  {
    title: 'Simulating scenarios',
    body: 'Run admit, discharge, pre-admit, and referral flows as single events or full sequences.',
    href: 'https://github.com/hl7x/placebo'
  }
]

const active = ref(sections[0].id)
let observer = null

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) active.value = entry.target.id
      }
    },
    { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
  )
  sections.forEach((s) => {
    const el = document.getElementById(s.id)
    if (el) observer.observe(el)
  })
})
onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <div class="container docs">
    <!-- Sidebar -->
    <aside class="docs__nav">
      <div class="docs__nav-inner">
        <span class="eyebrow">Documentation</span>
        <nav aria-label="Documentation sections">
          <a
            v-for="s in sections"
            :key="s.id"
            :href="`#${s.id}`"
            class="docs__navlink"
            :class="{ active: active === s.id }"
          >
            {{ s.label }}
          </a>
        </nav>
        <div class="docs__nav-help card">
          <p class="muted">Looking for a tool's full reference?</p>
          <a href="https://github.com/hl7x" target="_blank" rel="noopener">
            Browse the repos →
          </a>
        </div>
      </div>
    </aside>

    <!-- Content -->
    <article class="docs__body prose">
      <header class="docs__lead">
        <h1>Documentation</h1>
        <p class="muted">
          Everything you need to install, run, and build on the HL7X toolkit.
          Each tool also ships a full reference in its repository.
        </p>
      </header>

      <section id="getting-started">
        <h2>Getting started</h2>
        <p>
          HL7X tools are standalone command-line programs. There's no SDK to
          learn and no account to create — install a tool, run it, and work with
          the files or messages it produces.
        </p>
        <p>
          Install <code>placebo</code> from source (see
          <a href="#install">Installing tools</a>), then generate your first HL7
          file for a fake patient:
        </p>
        <CommandBlock command="placebo file hl7" />
      </section>

      <section id="install">
        <h2>Installing tools</h2>
        <p>
          Tools install from source with a provided installer script. Clone the
          repository, then run the installer with elevated permissions:
        </p>
        <CommandBlock command="git clone https://github.com/hl7x/placebo" />
        <CommandBlock command="cd placebo && sudo ./installer.sh" />
        <p>
          <code class="ic">sudo</code> is required because the installer places
          the binary on your <code class="ic">PATH</code>. No package managers
          or runtimes are needed.
        </p>
      </section>

      <section id="concepts">
        <h2>Core concepts</h2>
        <p>A few ideas hold across the toolkit:</p>
        <ul class="docs__list">
          <li>
            <strong>Synthetic by default.</strong> Generators never emit real
            PHI. Output is safe to share, commit, and run anywhere.
          </li>
          <li>
            <strong>Command-line first.</strong> Tools run in the terminal and
            write to files or a socket, so they fit the workflows you have.
          </li>
          <li>
            <strong>Scenario-driven.</strong> HL7 sending models real events —
            admits, discharges, pre-admits, and referrals — not just lone messages.
          </li>
          <li>
            <strong>Standards-aware.</strong> Messages follow HL7 v2 structure
            across the common segments, not an approximation.
          </li>
        </ul>
      </section>

      <section id="guides">
        <h2>Guides</h2>
        <p>Task-focused walkthroughs to get productive quickly:</p>
        <div class="docs__cards">
          <a
            v-for="g in guides"
            :key="g.title"
            class="card docs__guide"
            :href="g.href"
            target="_blank"
            rel="noopener"
          >
            <h3>{{ g.title }}</h3>
            <p class="muted">{{ g.body }}</p>
            <span class="docs__guide-link">Read guide →</span>
          </a>
        </div>
      </section>

      <section id="reference">
        <h2>Reference</h2>
        <p>
          Each tool documents its full command surface in its repository's
          README and <code class="ic">--help</code> output:
        </p>
        <ul class="docs__list">
          <li><a href="https://github.com/hl7x/placebo" target="_blank" rel="noopener">placebo reference</a> — file, send, and read commands and their sub-commands</li>
          <li><strong>sugarpill</strong> — currently part of placebo via <code class="ic">placebo read sugarpill</code>; standalone docs land as it matures</li>
        </ul>
      </section>

      <section id="support">
        <h2>Getting help</h2>
        <p>
          Stuck, or found a bug? The community is the support channel — and
          questions often turn into the next feature.
        </p>
        <ul class="docs__list">
          <li>Ask in <a href="https://github.com/hl7x/discussions" target="_blank" rel="noopener">GitHub Discussions</a></li>
          <li>File issues on the relevant tool's repository</li>
          <li>Read <RouterLink to="/contribute">Contribute</RouterLink> to get involved</li>
        </ul>
      </section>
    </article>
  </div>
</template>

<style scoped>
.docs {
  display: grid;
  grid-template-columns: 232px 1fr;
  gap: 56px;
  padding-block: 56px 80px;
  align-items: start;
}

/* Sidebar */
.docs__nav-inner {
  position: sticky;
  top: calc(var(--header-h) + 24px);
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.docs__nav nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-top: 4px;
}
.docs__navlink {
  font-size: 0.92rem;
  color: var(--text-soft);
  padding: 7px 12px;
  border-radius: 7px;
  border-left: 2px solid transparent;
}
.docs__navlink:hover {
  color: var(--text);
  background: var(--surface-2);
}
.docs__navlink.active {
  color: var(--accent);
  border-left-color: var(--accent);
  background: var(--accent-soft);
  font-weight: 600;
}
.docs__nav-help {
  padding: 16px;
  font-size: 0.88rem;
  margin-top: 8px;
}
.docs__nav-help p {
  margin-bottom: 6px;
}

/* Body */
.docs__lead h1 {
  font-size: clamp(2rem, 4vw, 2.6rem);
}
.docs__lead p {
  margin-top: 12px;
  font-size: 1.08rem;
}
.docs__body section {
  padding-top: 44px;
  margin-top: 12px;
  scroll-margin-top: calc(var(--header-h) + 24px);
}
.docs__body h2 {
  font-size: 1.55rem;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 18px;
}
.docs__body p {
  margin-bottom: 14px;
  color: var(--text-soft);
}
.docs__body :deep(.cmd) {
  margin-block: 16px;
}

.ic {
  background: var(--surface-2);
  border: 1px solid var(--border);
  padding: 1px 6px;
  border-radius: 5px;
  font-size: 0.84em;
  color: var(--text);
}

.docs__list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 14px;
}
.docs__list li {
  position: relative;
  padding-left: 20px;
  color: var(--text-soft);
}
.docs__list li::before {
  content: '';
  position: absolute;
  left: 2px;
  top: 11px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
}

.docs__cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-top: 8px;
}
.docs__guide {
  padding: 20px;
  color: var(--text);
}
.docs__guide:hover {
  border-color: var(--accent-border);
  box-shadow: var(--shadow-sm);
  transform: translateY(-2px);
}
.docs__guide h3 {
  font-size: 1rem;
  margin-bottom: 8px;
}
.docs__guide p {
  font-size: 0.9rem;
  margin-bottom: 12px;
}
.docs__guide-link {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--accent);
}

@media (max-width: 880px) {
  .docs {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  .docs__nav-inner {
    position: static;
  }
  .docs__nav nav {
    flex-direction: row;
    flex-wrap: wrap;
  }
  .docs__nav-help {
    display: none;
  }
  .docs__cards {
    grid-template-columns: 1fr;
  }
}
</style>
