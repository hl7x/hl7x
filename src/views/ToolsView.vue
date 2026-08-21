<script setup>
import { RouterLink } from 'vue-router'
import CommandBlock from '@/components/CommandBlock.vue'
import { tools, statusMeta } from '@/data/tools.js'
</script>

<template>
  <section class="section">
    <div class="container">
      <div class="page-head">
        <span class="eyebrow">The toolkit</span>
        <h1>Tools</h1>
        <p class="muted">
          Small, single-purpose command-line tools for working with HL7.
          Two today — with more on the way.
        </p>
      </div>

      <div class="list">
        <article v-for="tool in tools" :key="tool.name" class="card row">
          <div class="row__main">
            <div class="row__head">
              <RouterLink :to="tool.to" class="row__name mono">{{ tool.name }}</RouterLink>
              <span class="status" :data-tone="statusMeta[tool.status].tone">
                {{ statusMeta[tool.status].label }}
              </span>
            </div>
            <p class="row__tag">{{ tool.tagline }}</p>
            <p class="row__desc muted">{{ tool.description }}</p>
            <div class="row__tags">
              <span v-for="t in tool.tags" :key="t" class="chip mono">{{ t }}</span>
            </div>
          </div>
          <div class="row__side">
            <CommandBlock :command="tool.install" />
            <RouterLink :to="tool.to" class="row__more">
              Learn more
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
            </RouterLink>
          </div>
        </article>
      </div>

      <div class="more card">
        <div>
          <h2>Have an idea for a tool?</h2>
          <p class="muted">
            The toolkit grows from real pain points. Propose one in our
            discussions or open a draft.
          </p>
        </div>
        <a class="btn btn-primary" href="https://github.com/hl7x/discussions" target="_blank" rel="noopener">Open a discussion</a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.page-head {
  max-width: 60ch;
  margin-bottom: 44px;
}
.page-head h1 {
  margin-top: 12px;
  font-size: clamp(2rem, 4vw, 2.8rem);
}
.page-head p {
  margin-top: 14px;
  font-size: 1.08rem;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.row {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 32px;
  padding: 28px;
}
.row:hover {
  border-color: var(--accent-border);
}
.row__head {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}
.row__name {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--accent);
}
.row__lang {
  font-size: 0.8rem;
  margin-left: auto;
}
.row__tag {
  margin-top: 12px;
  font-weight: 600;
}
.row__desc {
  margin-top: 6px;
  font-size: 0.94rem;
}
.row__tags {
  margin-top: 16px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.chip {
  font-size: 0.74rem;
  padding: 3px 9px;
  border-radius: 6px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  color: var(--text-muted);
}
.row__side {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 14px;
}
.row__more {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  align-self: flex-start;
}

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

.more {
  margin-top: 36px;
  padding: 32px 36px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  background: var(--surface);
}
.more h2 {
  font-size: 1.3rem;
}
.more p {
  margin-top: 8px;
  max-width: 48ch;
}

@media (max-width: 820px) {
  .row {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  .row__lang {
    margin-left: 0;
  }
  .more {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
