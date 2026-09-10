<script>
// Deliberately a plain script block, not `script setup`: everything in a setup
// block is re-run per instance, and this flag has to outlive the component so
// the reveal plays once per page load rather than on every visit to the route.
let hasPlayed = false
</script>

<script setup>
import { onMounted, ref } from 'vue'

// Size comes from the --mark custom property (default below), so a consumer
// can scale it in a media query. The SVG draws wider than that while the
// message strip is still extended; the wrapper only reserves the space the
// resolved tile occupies.

const reduced =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const playing = ref(!hasPlayed && !reduced)

onMounted(() => {
  hasPlayed = true
})
</script>

<template>
  <div class="anim" :class="{ 'is-resolved': !playing }">
    <svg
      class="anim__svg"
      viewBox="0 0 380 320"
      role="img"
      aria-labelledby="brand-anim-title"
      focusable="false"
    >
      <title id="brand-anim-title">HL7X</title>
      <desc>
        The HL7 encoding characters type out, the field separators and component
        separator light up, and the strip contracts into the HL7X mark.
      </desc>

      <rect class="tile" x="94" y="91" width="192" height="192" rx="45" />
      <rect class="panel" x="113" y="110" width="154" height="154" rx="36" />

      <g class="st dim" style="--x: 183px; animation-delay: 0.47s">
        <text class="ch" x="0" y="18" text-anchor="middle">~</text>
      </g>
      <g class="st dim" style="--x: 220px; animation-delay: 0.58s">
        <text class="ch" x="0" y="18" text-anchor="middle">&#92;</text>
      </g>
      <g class="st dim" style="--x: 257px; animation-delay: 0.69s">
        <text class="ch" x="0" y="18" text-anchor="middle">&amp;</text>
      </g>

      <rect class="st p0" x="-5.25" y="-42" width="10.5" height="84" rx="5.25" />
      <rect class="st p5" x="-5.25" y="-42" width="10.5" height="84" rx="5.25" />

      <g class="caret">
        <rect class="st ha" x="-18" y="-5.25" width="36" height="10.5" rx="5.25" />
        <rect class="st hb" x="-18" y="-5.25" width="36" height="10.5" rx="5.25" />
      </g>
    </svg>
  </div>
</template>

<style scoped>
/* --------------------------------------------------------------------------
   HL7X animated mark.

   The HL7 v2 encoding characters (|^~\&) type out, the two field separators
   and the component separator light up, the rest dissolve, and the pipes
   rotate across each other into the X while the caret rises above them.

   Timing is 4.2s, plays once, freezes on the mark. The character delays below
   are absolute, so the duration is not a knob — changing it desyncs them.
   -------------------------------------------------------------------------- */

.anim {
  --mark: 112px;

  /* Light theme: the same solid accent tile the header mark uses. */
  --mark-tile: var(--accent);
  --mark-panel: var(--teal-600);
  --mark-edge: rgba(240, 253, 250, 0.3);
  --mark-ink: var(--teal-50);
  --mark-mint: var(--teal-200);

  position: relative;
  width: var(--mark);
  height: var(--mark);
  margin-inline: auto;
}

:root[data-theme='dark'] .anim {
  --mark-tile: #0b120f;
  --mark-panel: #101c17;
  --mark-edge: rgba(45, 212, 191, 0.22);
  --mark-ink: #ffffff;
  --mark-mint: var(--teal-300);
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) .anim {
    --mark-tile: #0b120f;
    --mark-panel: #101c17;
    --mark-edge: rgba(45, 212, 191, 0.22);
    --mark-ink: #ffffff;
    --mark-mint: var(--teal-300);
  }
}

/* The artwork needs room to run wide, so the SVG overflows the reserved box
   and is nudged up to sit the finished tile dead centre in it. */
.anim__svg {
  position: absolute;
  top: 50%;
  left: 50%;
  /* Opt out of the global svg { max-width: 100% } reset — this one is meant
     to run wider than the box it reserves. */
  max-width: none;
  width: calc(var(--mark) * 380 / 192);
  height: calc(var(--mark) * 320 / 192);
  transform: translate(-50%, -50%) translateY(calc(var(--mark) * -27 / 192));
}

.tile {
  fill: var(--mark-tile);
}
.panel {
  fill: var(--mark-panel);
  stroke: var(--mark-edge);
  stroke-width: 1;
}

.st {
  transform-box: view-box;
  transform-origin: 0 0;
}
.tile {
  transform-box: view-box;
  transform-origin: 190px 187px;
}
.ch {
  font-family: var(--font-mono);
  font-size: 52px;
  font-weight: 500;
  fill: var(--mark-ink);
}

.tile {
  animation: tile 4.2s cubic-bezier(0.7, 0, 0.2, 1) 1 both;
}
.panel {
  animation: panel 4.2s cubic-bezier(0.7, 0, 0.2, 1) 1 both;
}
.dim {
  animation: dim 4.2s cubic-bezier(0.7, 0, 0.2, 1) 1 both;
}
.p0 {
  animation: p0 4.2s cubic-bezier(0.7, 0, 0.2, 1) 1 both;
}
.p5 {
  animation: p5 4.2s cubic-bezier(0.7, 0, 0.2, 1) 1 both;
}
.caret {
  animation: hop 4.2s cubic-bezier(0.7, 0, 0.2, 1) 1 both;
}
.ha {
  animation: ha 4.2s cubic-bezier(0.7, 0, 0.2, 1) 1 both;
}
.hb {
  animation: hb 4.2s cubic-bezier(0.7, 0, 0.2, 1) 1 both;
}

/* Left field separator: types in, lights up, becomes the "\" arm of the X. */
@keyframes p0 {
  0%,
  5.95% {
    opacity: 0;
    fill: var(--mark-ink);
    transform: translate(90px, 187px) rotate(0deg) scale(0.55);
  }
  10.29%,
  27.43% {
    opacity: 0.5;
    fill: var(--mark-ink);
    transform: translate(90px, 187px) rotate(0deg) scale(1);
  }
  35.71% {
    opacity: 1;
    fill: var(--mark-mint);
    transform: translate(90px, 187px) rotate(0deg) scale(1.12);
  }
  40%,
  60.76% {
    opacity: 1;
    fill: var(--mark-mint);
    transform: translate(90px, 187px) rotate(0deg) scale(1);
  }
  79.24% {
    opacity: 1;
    fill: var(--mark-mint);
    transform: translate(190px, 206px) rotate(49deg) scale(1.38);
  }
  84.57%,
  100% {
    opacity: 1;
    fill: var(--mark-mint);
    transform: translate(190px, 206px) rotate(45deg) scale(1.3);
  }
}

/* Right field separator: same beats, becomes the "/" arm. */
@keyframes p5 {
  0%,
  19.05% {
    opacity: 0;
    fill: var(--mark-ink);
    transform: translate(290px, 187px) rotate(0deg) scale(0.55);
  }
  23.33%,
  27.43% {
    opacity: 0.5;
    fill: var(--mark-ink);
    transform: translate(290px, 187px) rotate(0deg) scale(1);
  }
  35.71% {
    opacity: 1;
    fill: var(--mark-mint);
    transform: translate(290px, 187px) rotate(0deg) scale(1.12);
  }
  40%,
  60.76% {
    opacity: 1;
    fill: var(--mark-mint);
    transform: translate(290px, 187px) rotate(0deg) scale(1);
  }
  79.24% {
    opacity: 1;
    fill: var(--mark-mint);
    transform: translate(190px, 206px) rotate(-49deg) scale(1.38);
  }
  84.57%,
  100% {
    opacity: 1;
    fill: var(--mark-mint);
    transform: translate(190px, 206px) rotate(-45deg) scale(1.3);
  }
}

/* Caret arms. Position and colour live apart: the arms carry their own
   transforms, the wrapping group carries opacity and fill, so they never
   overlap translucently or drift out of colour sync. */
@keyframes ha {
  0%,
  8.57% {
    transform: translate(126.78px, 186.18px) rotate(-41.82deg) scale(0.55);
  }
  12.86%,
  27.43% {
    transform: translate(122.5px, 185.5px) rotate(-41.82deg) scale(1);
  }
  35.71% {
    transform: translate(121.36px, 185.32px) rotate(-41.82deg) scale(1.12);
  }
  40%,
  60.76% {
    transform: translate(122.5px, 185.5px) rotate(-41.82deg) scale(1);
  }
  79.24% {
    transform: translate(176.89px, 135.93px) rotate(-41.82deg) scale(1.38);
  }
  84.57%,
  100% {
    transform: translate(177.65px, 142.05px) rotate(-41.82deg) scale(1.3);
  }
}
@keyframes hb {
  0%,
  8.57% {
    transform: translate(137.23px, 186.18px) rotate(41.82deg) scale(0.55);
  }
  12.86%,
  27.43% {
    transform: translate(141.5px, 185.5px) rotate(41.82deg) scale(1);
  }
  35.71% {
    transform: translate(142.64px, 185.32px) rotate(41.82deg) scale(1.12);
  }
  40%,
  60.76% {
    transform: translate(141.5px, 185.5px) rotate(41.82deg) scale(1);
  }
  79.24% {
    transform: translate(203.11px, 135.93px) rotate(41.82deg) scale(1.38);
  }
  84.57%,
  100% {
    transform: translate(202.35px, 142.05px) rotate(41.82deg) scale(1.3);
  }
}
@keyframes hop {
  0%,
  8.57% {
    opacity: 0;
    fill: var(--mark-ink);
  }
  12.86%,
  27.43% {
    opacity: 0.5;
    fill: var(--mark-ink);
  }
  35.71%,
  100% {
    opacity: 1;
    fill: var(--mark-mint);
  }
}

/* The ~ \ & characters: type in, never light up, drop away. */
@keyframes dim {
  0% {
    opacity: 0;
    transform: translate(var(--x), 187px) scale(0.6);
  }
  4.29%,
  34.48% {
    opacity: 0.5;
    transform: translate(var(--x), 187px) scale(1);
  }
  46.48%,
  100% {
    opacity: 0;
    transform: translate(var(--x), 209px) scale(0.85);
  }
}

/* The wide message strip contracts into the square icon tile. */
@keyframes tile {
  0% {
    opacity: 0;
    transform: scale(1.302, 0.604);
  }
  5.9%,
  64.29% {
    opacity: 1;
    transform: scale(1.302, 0.604);
  }
  86.86%,
  100% {
    opacity: 1;
    transform: scale(1, 1);
  }
}
@keyframes panel {
  0%,
  80.95% {
    opacity: 0;
  }
  97.62%,
  100% {
    opacity: 1;
  }
}

/* Already seen this page load, or the visitor asked for less motion:
   render the finished mark with no animation at all. */
.anim.is-resolved .tile,
.anim.is-resolved .panel,
.anim.is-resolved .dim,
.anim.is-resolved .p0,
.anim.is-resolved .p5,
.anim.is-resolved .caret,
.anim.is-resolved .ha,
.anim.is-resolved .hb {
  animation: none;
}
.anim.is-resolved .dim {
  opacity: 0;
}
.anim.is-resolved .p0 {
  opacity: 1;
  fill: var(--mark-mint);
  transform: translate(190px, 206px) rotate(45deg) scale(1.3);
}
.anim.is-resolved .p5 {
  opacity: 1;
  fill: var(--mark-mint);
  transform: translate(190px, 206px) rotate(-45deg) scale(1.3);
}
.anim.is-resolved .caret {
  opacity: 1;
  fill: var(--mark-mint);
}
.anim.is-resolved .ha {
  transform: translate(177.65px, 142.05px) rotate(-41.82deg) scale(1.3);
}
.anim.is-resolved .hb {
  transform: translate(202.35px, 142.05px) rotate(41.82deg) scale(1.3);
}
</style>
