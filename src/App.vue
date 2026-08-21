<script setup>
import { RouterView } from 'vue-router'
import SiteHeader from './components/SiteHeader.vue'
import SiteFooter from './components/SiteFooter.vue'
</script>

<template>
  <a class="skip" href="#main">Skip to content</a>
  <SiteHeader />
  <main id="main">
    <RouterView v-slot="{ Component }">
      <Transition name="fade" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </main>
  <SiteFooter />
</template>

<style scoped>
.skip {
  position: absolute;
  left: 12px;
  top: -48px;
  z-index: 100;
  background: var(--accent);
  color: #fff;
  padding: 9px 16px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  transition: top 0.18s var(--ease);
}
.skip:focus {
  top: 12px;
  color: #fff;
}
main {
  min-height: calc(100vh - var(--header-h));
}
</style>
