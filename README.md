# HL7X website

The marketing and documentation site for **HL7X** — open source developer
tools for healthcare integration. Built with [Vue 3](https://vuejs.org/) and
[Vite](https://vite.dev/).

Live at [hl7x.com](https://hl7x.com).

## Stack

- **Vue 3** (`<script setup>` SFCs)
- **Vue Router 4** — client-side routing with lazy-loaded views
- **Vite 6** — dev server and build
- No CSS framework — a small hand-rolled design system in
  `src/styles/global.css` (CSS custom properties, light/dark themes)

## Develop

```bash
npm install
npm run dev          # start the dev server (http://localhost:5173)
npm run build        # production build → dist/
npm run preview      # preview the production build locally
```

Requires Node 20.19+ or 22.12+.

## Project structure

```
src/
├── main.js               # app entry — mounts App, installs router
├── App.vue               # shell: header, <RouterView>, footer
├── router/index.js       # routes + titles + scroll behavior
├── styles/global.css     # design system (tokens, themes, base, utilities)
├── data/tools.js         # tool catalog — single source of truth
├── components/
│   ├── SiteHeader.vue     ThemeToggle.vue    BrandMark.vue
│   ├── SiteFooter.vue     CommandBlock.vue   CodeBlock.vue
└── views/
    ├── HomeView.vue       # landing page
    ├── PlaceboView.vue    # /placebo — minimalist tool page (brew.sh-style)
    ├── PlaygroundView.vue # /playground — placebo running in-browser via WASM
    ├── ToolsView.vue      # /tools — catalog
    ├── DocsView.vue       # /docs — documentation board
    ├── ContributeView.vue # /contribute
    └── NotFoundView.vue   # 404
```

### Adding a tool

Add an entry to `src/data/tools.js`. It will appear on the home page and the
`/tools` catalog automatically. Give a tool its own dedicated page by adding a
view + route (see `PlaceboView.vue` for the pattern).

### The playground

`/playground` runs the real `placebo` CLI in the browser. The Go binary is
compiled to the `wasip1` WebAssembly target and driven by
[`@bjorn3/browser_wasi_shim`](https://github.com/bjorn3/browser_wasi_shim)
inside a Web Worker, so a long-running command never blocks the page.

- `src/workers/placebo.worker.js` — compiles the module once, then makes a
  fresh instance per command (Go calls `proc_exit`, which burns the instance).
  The virtual `/tmp` is kept alive between runs, so generating a file and then
  reading it back works the way it does on a real machine.
- `src/views/PlaygroundView.vue` — command handling, the `/tmp` file panel, and
  the playground-only builtins (`ls`, `cat`, `clear`, `reset`).
- `public/wasm/placebo-<version>.wasm` — the binary, served immutably via
  `public/_headers` since the version is in the filename.

`send` and `listen` need raw TCP and so cannot work in a browser; they are
intercepted with an explanation rather than left to fail. Everything else —
`file`, `read sugarpill`, `help`, `version` — runs unmodified.

Rebuild the binary after a placebo release:

```bash
./scripts/build-wasm.sh 0.2.0 ../placebo   # version, path to a placebo checkout
```

Then bump `PLACEBO_VERSION` in `src/views/PlaygroundView.vue` and delete the
old `.wasm`. The binary is committed to this repo today; moving it to a
goreleaser-published artifact that the build fetches would keep ~8 MB per
release out of git history.

### Theming

Colors, spacing, and typography live as CSS custom properties in
`src/styles/global.css`. Light is the default; dark is applied via
`data-theme="dark"` on `<html>` (toggled in the header, persisted to
`localStorage`, and honoring `prefers-color-scheme` on first visit).

## Deploy

The site is a static SPA — build and serve `dist/` from any static host.
Because routing is client-side, configure a catch-all rewrite to
`index.html`:

- **Netlify** — handled by `public/_redirects`
- **Vercel** — handled by `vercel.json`
- **Other** — point the host's SPA/fallback at `/index.html`

## License

Open source — confirm and add the project's license file (`LICENSE`) at the
repo root.

> HL7® is a registered trademark of Health Level Seven International. This
> project is community-run and not affiliated with or endorsed by HL7
> International.
