<script setup>
defineProps({
  size: { type: [Number, String], default: 32 }
})
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 32 32"
    role="img"
    aria-label="HL7X logo"
    class="mark"
  >
    <rect width="32" height="32" rx="7" class="mark__bg" />
    <g
      class="mark__glyph"
      fill="none"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <!-- caret (^) — HL7 component separator, floating accent -->
      <path d="M11.5 9.5 L16 5.5 L20.5 9.5" stroke-width="2.1" />
      <!-- two pipe (|) strokes crossing into an X -->
      <path d="M9.5 14 L22.5 26.5" stroke-width="2.6" />
      <path d="M22.5 14 L9.5 26.5" stroke-width="2.6" />
    </g>
  </svg>
</template>

<style scoped>
.mark__bg {
  fill: var(--accent);
}
.mark__glyph {
  stroke: var(--teal-200);
}
:root[data-theme='dark'] .mark__bg {
  fill: rgba(45, 212, 191, 0.14);
  stroke: var(--accent-border);
  stroke-width: 1;
}
:root[data-theme='dark'] .mark__glyph {
  stroke: var(--teal-300);
}
</style>
