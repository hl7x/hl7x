<script setup>
import CommandBlock from '@/components/CommandBlock.vue'

const ways = [
  {
    icon: 'code',
    title: 'Write code',
    body: 'Pick up a “good first issue,” fix a bug, or build a feature. Every repo has a CONTRIBUTING guide and a fast local setup.'
  },
  {
    icon: 'bug',
    title: 'Report issues',
    body: 'A clear bug report with a reproduction is worth a lot. So is telling us where the docs let you down.'
  },
  {
    icon: 'docs',
    title: 'Improve docs',
    body: 'Examples, guides, and clarifications help every engineer who comes after you. No code required.'
  },
  {
    icon: 'idea',
    title: 'Shape direction',
    body: 'Propose a tool, weigh in on a design, or share how you work with HL7 in the real world.'
  }
]

const steps = [
  { n: '01', text: 'Fork the repo and clone it locally.' },
  { n: '02', text: 'Create a branch and make your change.' },
  { n: '03', text: 'Run the test suite — green before you push.' },
  { n: '04', text: 'Open a pull request describing the why.' }
]

const values = [
  'Be kind. Assume good intent — most of us are doing this after hours.',
  'Small, focused PRs over sweeping rewrites.',
  'Tests and docs are part of the change, not an afterthought.',
  'Patient safety first: synthetic data only, never real PHI in examples.'
]
</script>

<template>
  <section class="section">
    <div class="container">
      <!-- Lead -->
      <header class="lead">
        <span class="eyebrow">Contribute</span>
        <h1>Help build the tools you wish existed.</h1>
        <p class="muted">
          HL7X is built by integration engineers, for integration engineers.
          Whether you write Go, wrangle HL7 for a living, or just have strong
          opinions about good docs — there's a place for you here.
        </p>
        <div class="lead__cta">
          <a class="btn btn-primary" href="https://github.com/hl7x" target="_blank" rel="noopener">Browse the repos</a>
          <a class="btn btn-ghost" href="https://github.com/hl7x/discussions" target="_blank" rel="noopener">Join a discussion</a>
        </div>
      </header>

      <!-- Ways to help -->
      <div class="ways">
        <div v-for="w in ways" :key="w.title" class="card way">
          <div class="way__icon" aria-hidden="true">
            <svg v-if="w.icon === 'code'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/></svg>
            <svg v-else-if="w.icon === 'bug'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="6" width="8" height="14" rx="4"/><path d="M19 7l-3 2M5 7l3 2M2 13h4M18 13h4M19 19l-3-2M5 19l3-2M12 2v2"/></svg>
            <svg v-else-if="w.icon === 'docs'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 13h6M9 17h6"/></svg>
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.2 1 2h6c0-.8.4-1.5 1-2A7 7 0 0 0 12 2z"/></svg>
          </div>
          <h3>{{ w.title }}</h3>
          <p class="muted">{{ w.body }}</p>
        </div>
      </div>

      <!-- Quick start -->
      <div class="quickstart">
        <div class="quickstart__intro">
          <span class="eyebrow">Your first PR</span>
          <h2>From clone to pull request</h2>
          <p class="muted">
            The loop is the same for every tool. Here it is for
            <code>placebo</code>:
          </p>
          <CommandBlock command="git clone https://github.com/hl7x/placebo" />
          <CommandBlock command="cd placebo && make test" />
        </div>
        <ol class="steps">
          <li v-for="s in steps" :key="s.n" class="step">
            <span class="step__n mono">{{ s.n }}</span>
            <span>{{ s.text }}</span>
          </li>
        </ol>
      </div>

      <!-- Values -->
      <div class="values card">
        <div class="values__head">
          <span class="eyebrow">How we work</span>
          <h2>A few ground rules</h2>
        </div>
        <ul class="values__list">
          <li v-for="(v, i) in values" :key="i">
            <span class="values__check" aria-hidden="true">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
            </span>
            {{ v }}
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
.lead {
  max-width: 60ch;
  margin-bottom: 52px;
}
.lead h1 {
  margin-top: 12px;
  font-size: clamp(2rem, 4.4vw, 2.9rem);
}
.lead p {
  margin-top: 16px;
  font-size: 1.1rem;
}
.lead__cta {
  margin-top: 28px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.ways {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
}
.way {
  padding: 24px;
}
.way__icon {
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  background: var(--accent-soft);
  color: var(--accent);
  border: 1px solid var(--accent-border);
  margin-bottom: 16px;
}
.way__icon svg {
  width: 20px;
  height: 20px;
}
.way h3 {
  font-size: 1.05rem;
  margin-bottom: 8px;
}
.way p {
  font-size: 0.9rem;
}

.quickstart {
  margin-top: 64px;
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 48px;
  align-items: center;
}
.quickstart__intro h2 {
  margin-top: 12px;
  font-size: clamp(1.6rem, 3vw, 2.1rem);
}
.quickstart__intro p {
  margin-top: 12px;
  margin-bottom: 18px;
}
.quickstart__intro :deep(.cmd) {
  margin-bottom: 12px;
}
.quickstart__intro code {
  background: var(--surface-2);
  border: 1px solid var(--border);
  padding: 1px 6px;
  border-radius: 5px;
  font-size: 0.85em;
}

.steps {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.step {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 18px 4px;
  border-top: 1px solid var(--border);
  color: var(--text-soft);
  font-size: 1.02rem;
}
.step:last-child {
  border-bottom: 1px solid var(--border);
}
.step__n {
  color: var(--accent);
  font-weight: 600;
  font-size: 0.95rem;
}

.values {
  margin-top: 64px;
  padding: 44px 48px;
  display: grid;
  grid-template-columns: 0.8fr 1.2fr;
  gap: 40px;
  background: linear-gradient(135deg, var(--surface) 0%, var(--accent-soft) 130%);
}
.values__head h2 {
  margin-top: 12px;
  font-size: 1.6rem;
}
.values__list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.values__list li {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  color: var(--text-soft);
}
.values__check {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: grid;
  place-items: center;
  border-radius: 7px;
  background: var(--accent);
  color: #fff;
}
:root[data-theme='dark'] .values__check {
  color: var(--slate-950);
}

@media (max-width: 920px) {
  .ways {
    grid-template-columns: repeat(2, 1fr);
  }
  .quickstart,
  .values {
    grid-template-columns: 1fr;
    gap: 28px;
  }
}
@media (max-width: 540px) {
  .ways {
    grid-template-columns: 1fr;
  }
  .values {
    padding: 32px;
  }
}
</style>
