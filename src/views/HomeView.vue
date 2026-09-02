<script setup>
import { RouterLink } from 'vue-router'
import { tools, statusMeta } from '@/data/tools.js'

const principles = [
  {
    title: 'HL7-native',
    body: 'Built for HL7 and the realities of clinical interfaces — by people who actually work with them, not a generic toolkit bolted onto healthcare.'
  },
  {
    title: 'Synthetic by default',
    body: 'Generators produce fake patient data only. Safe to run anywhere, in any environment — never real PHI.'
  },
  {
    title: 'Command-line first',
    body: 'Scriptable tools that fit the terminals and pipelines you already use. No accounts, no telemetry, nothing phoned home.'
  },
  {
    title: 'Open & community-run',
    body: 'Developed in the open by volunteers. Read the source, file an issue, ship a patch.'
  }
]
</script>

<template>
  <div class="home">
    <!-- Hero -->
    <section class="hero">
      <div class="container hero__inner">
        <span class="badge">Open source · Built by the community</span>
        <h1 class="hero__title">
          Developer tools for
          <span class="hero__accent">healthcare integration</span>
        </h1>
        <p class="hero__sub">
          HL7X builds focused, command-line tools for the engineers who work with
          HL7 — generating, sending, and reading clinical messages. Free,
          scriptable, and built in the open.
        </p>

        <div class="hero__cta">
          <RouterLink to="/placebo" class="btn btn-primary">
            Explore placebo
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </RouterLink>
          <RouterLink to="/tools" class="btn btn-ghost">Browse all tools</RouterLink>
        </div>
      </div>
    </section>

    <!-- Principles -->
    <section class="section">
      <div class="container">
        <div class="sec-head">
          <span class="eyebrow">Why HL7X</span>
          <h2>Tooling that respects the domain</h2>
          <p class="muted">
            Healthcare interfaces are unforgiving. Our tools are small, sharp, and
            designed for people who already know the difference between an ADT and
            an ORU.
          </p>
        </div>

        <div class="grid-4">
          <div v-for="p in principles" :key="p.title" class="principle">
            <h3>{{ p.title }}</h3>
            <p class="muted">{{ p.body }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Tools -->
    <section class="section section--alt">
      <div class="container">
        <div class="sec-head">
          <span class="eyebrow">The toolkit</span>
          <h2>One tool per problem</h2>
          <p class="muted">
            Small, focused command-line tools for working with HL7. Pick the one
            you need today.
          </p>
        </div>

        <div class="grid-tools">
          <RouterLink
            v-for="tool in tools"
            :key="tool.name"
            :to="tool.to"
            class="card tool"
          >
            <div class="tool__top">
              <span class="tool__name mono">{{ tool.name }}</span>
              <span class="status" :data-tone="statusMeta[tool.status].tone">
                {{ statusMeta[tool.status].label }}
              </span>
            </div>
            <p class="tool__tag">{{ tool.tagline }}</p>
            <p class="tool__desc muted">{{ tool.description }}</p>
            <div class="tool__foot">
              <span class="mono muted">{{ tool.tags[0] }}</span>
              <span class="tool__arrow" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
              </span>
            </div>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Contribute CTA -->
    <section class="section">
      <div class="container">
        <div class="cta card">
          <div class="cta__text">
            <span class="eyebrow">Built by the community</span>
            <h2>Healthcare tooling shouldn't be locked behind a vendor.</h2>
            <p class="muted">
              HL7X is a volunteer effort. If you've ever fought an interface engine
              at 2&nbsp;a.m., you can make the next engineer's night easier.
            </p>
          </div>
          <div class="cta__actions">
            <RouterLink to="/contribute" class="btn btn-primary">Start contributing</RouterLink>
            <a class="btn btn-ghost" href="https://github.com/hl7x" target="_blank" rel="noopener">View on GitHub</a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Hero */
.hero {
  position: relative;
  padding-block: 96px 64px;
  overflow: hidden;
}
.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    60% 70% at 50% -10%,
    var(--accent-soft) 0%,
    transparent 70%
  );
  pointer-events: none;
}
.hero__inner {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.hero__title {
  margin-top: 22px;
  font-size: clamp(2.4rem, 5.4vw, 3.9rem);
  font-weight: 800;
  letter-spacing: -0.035em;
  max-width: 16ch;
}
.hero__accent {
  color: var(--accent);
  position: relative;
  white-space: nowrap;
}
.hero__sub {
  margin-top: 22px;
  max-width: 56ch;
  font-size: 1.12rem;
  color: var(--text-soft);
}
.hero__cta {
  margin-top: 32px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

/* Section headings */
.sec-head {
  max-width: 56ch;
  margin-bottom: 44px;
}
.sec-head h2 {
  margin-top: 14px;
  font-size: clamp(1.7rem, 3.4vw, 2.3rem);
}
.sec-head p {
  margin-top: 14px;
  font-size: 1.05rem;
}

.section--alt {
  background: var(--surface);
  border-block: 1px solid var(--border);
}

/* Principles */
.grid-4 {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 28px;
}
.principle h3 {
  font-size: 1.05rem;
  margin-bottom: 10px;
  padding-top: 16px;
  border-top: 2px solid var(--accent);
  display: inline-block;
}
.principle p {
  font-size: 0.94rem;
}

/* Tool grid */
.grid-tools {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
.tool {
  display: flex;
  flex-direction: column;
  padding: 24px;
  color: var(--text);
}
.tool:hover {
  border-color: var(--accent-border);
  box-shadow: var(--shadow);
  transform: translateY(-3px);
}
.tool:hover .tool__arrow {
  color: var(--accent);
  transform: translateX(3px);
}
.tool__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.tool__name {
  font-size: 1.12rem;
  font-weight: 600;
  color: var(--accent);
}
.tool__tag {
  margin-top: 12px;
  font-weight: 600;
  font-size: 0.96rem;
}
.tool__desc {
  margin-top: 8px;
  font-size: 0.9rem;
  flex: 1;
}
.tool__foot {
  margin-top: 20px;
  padding-top: 14px;
  border-top: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.82rem;
}
.tool__arrow {
  color: var(--text-muted);
  transition: transform 0.18s var(--ease), color 0.18s var(--ease);
}

/* Status pill */
.status {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 500;
  padding: 3px 9px;
  border-radius: 999px;
  border: 1px solid;
}
.status[data-tone='good'] {
  color: var(--teal-700);
  background: var(--teal-50);
  border-color: var(--teal-200);
}
.status[data-tone='warn'] {
  color: #b45309;
  background: #fffbeb;
  border-color: #fde68a;
}
.status[data-tone='muted'] {
  color: var(--slate-500);
  background: var(--slate-50);
  border-color: var(--slate-200);
}
:root[data-theme='dark'] .status[data-tone='good'] {
  color: var(--teal-300);
  background: rgba(45, 212, 191, 0.08);
  border-color: var(--accent-border);
}
:root[data-theme='dark'] .status[data-tone='warn'] {
  color: #fbbf24;
  background: rgba(251, 191, 36, 0.08);
  border-color: rgba(251, 191, 36, 0.25);
}
:root[data-theme='dark'] .status[data-tone='muted'] {
  color: var(--slate-400);
  background: rgba(148, 163, 184, 0.08);
  border-color: var(--border-strong);
}

/* CTA */
.cta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 36px;
  padding: 44px 48px;
  background: linear-gradient(
    135deg,
    var(--surface) 0%,
    var(--accent-soft) 100%
  );
}
.cta__text {
  max-width: 52ch;
}
.cta__text h2 {
  margin-top: 12px;
  font-size: clamp(1.4rem, 2.6vw, 1.85rem);
}
.cta__text p {
  margin-top: 12px;
}
.cta__actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex-shrink: 0;
}

@media (max-width: 920px) {
  .grid-4 {
    grid-template-columns: repeat(2, 1fr);
  }
  .grid-tools {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 760px) {
  .cta {
    flex-direction: column;
    align-items: flex-start;
    padding: 32px;
  }
  .cta__actions {
    flex-direction: row;
    width: 100%;
  }
  .cta__actions .btn {
    flex: 1;
  }
}
@media (max-width: 520px) {
  .grid-4 {
    grid-template-columns: 1fr;
  }
  .cta__actions {
    flex-direction: column;
  }
}
</style>
