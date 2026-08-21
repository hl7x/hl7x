<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="nf">
    <div class="container nf__inner">
      <p class="nf__code mono">404</p>
      <h1>Message not found</h1>
      <p class="muted">
        That route didn't parse. The segment you're looking for may have moved
        or never existed.
      </p>
      <div class="nf__cta">
        <RouterLink to="/" class="btn btn-primary">Back to home</RouterLink>
        <RouterLink to="/tools" class="btn btn-ghost">Browse tools</RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.nf {
  min-height: calc(100vh - var(--header-h) - 200px);
  display: grid;
  place-items: center;
  padding-block: 80px;
}
.nf__inner {
  text-align: center;
  max-width: 46ch;
}
.nf__code {
  font-size: 4rem;
  font-weight: 600;
  color: var(--accent);
  letter-spacing: -0.04em;
}
.nf h1 {
  margin-top: 8px;
  font-size: 1.8rem;
}
.nf p {
  margin-top: 14px;
  font-size: 1.05rem;
}
.nf__cta {
  margin-top: 28px;
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}
</style>
