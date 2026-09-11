<script setup>
import { ref, shallowRef, onMounted, onBeforeUnmount, computed } from 'vue'
import { RouterLink } from 'vue-router'
import PlaygroundTerminal from '@/components/PlaygroundTerminal.vue'

// The wasm build is stamped with the placebo release it came from, and the
// filename carries the version so it can be cached immutably.
const PLACEBO_VERSION = '0.1.0'
const WASM_URL = `${import.meta.env.BASE_URL}wasm/placebo-${PLACEBO_VERSION}.wasm`

const lines = ref([])
const files = ref([])
const ready = ref(false)
const busy = ref(false)
const loadError = ref('')
const terminal = ref(null)

const worker = shallowRef(null)
const pending = new Map()
let nextId = 0

function print(text, kind = 'out') {
  for (const line of String(text).replace(/\n$/, '').split('\n')) {
    lines.value.push({ kind, text: line })
  }
}

function call(message, transfer = []) {
  const id = nextId++

  return new Promise((resolve, reject) => {
    pending.set(id, { resolve, reject })
    worker.value.postMessage({ ...message, id }, transfer)
  })
}

onMounted(async () => {
  print(`placebo ${PLACEBO_VERSION} — WebAssembly build`, 'system')
  print('loading… (~1.9 MB, cached after the first visit)', 'system')

  worker.value = new Worker(new URL('../workers/placebo.worker.js', import.meta.url), {
    type: 'module'
  })

  worker.value.onmessage = (event) => {
    const { type, id, message } = event.data
    const slot = pending.get(id)
    if (!slot) return

    pending.delete(id)
    if (type === 'error') slot.reject(new Error(message))
    else slot.resolve(event.data)
  }

  worker.value.onerror = () => {
    loadError.value = 'The playground worker failed to start.'
  }

  try {
    await call({ type: 'init', url: WASM_URL })
    ready.value = true

    lines.value = []
    print(`placebo ${PLACEBO_VERSION} ready — the real CLI, compiled to WebAssembly.`, 'system')
    print('Everything runs in this tab. No data leaves your browser.', 'system')
    print('Type a command, or pick one below. Files land in a virtual /tmp.', 'system')
    print('')

    terminal.value?.focus()
  } catch (e) {
    loadError.value = e?.message ?? 'placebo could not be loaded.'
    print(loadError.value, 'err')
  }
})

onBeforeUnmount(() => worker.value?.terminate())

const examples = [
  { label: 'placebo file hl7', hint: 'Generate an HL7 message' },
  { label: 'placebo file csv 5', hint: 'Five fake patients as CSV' },
  { label: 'placebo read sugarpill /tmp/<file>', hint: 'HL7 → readable JSON' },
  { label: 'placebo help', hint: 'Full command reference' },
  { label: 'placebo version', hint: 'Build info' }
]

// send and listen are the two commands that have to touch a socket. They are
// caught here rather than in the wasm so the explanation is useful instead of
// a connection-refused error.
const networkNote = {
  send: [
    'send is where the playground stops.',
    '',
    'placebo builds the message first and only then opens an MLLP connection to',
    '127.0.0.1:9700 — and a browser tab has no raw TCP. Everything upstream of',
    'the socket is exactly what you would get locally; the wire is the part a',
    'browser cannot do.',
    '',
    'Install placebo to send it at Mirth, Rhapsody, Cloverleaf, Iguana, or Epic',
    'Bridges:  brew install hl7x/tap/placebo'
  ],
  listen: [
    'listen needs to bind a TCP port and wait for messages, which a browser tab',
    'cannot do at all.',
    '',
    'On a real machine, listen receives an MLLP-framed message and replies with',
    'an MSA|AA ack:  brew install hl7x/tap/placebo'
  ]
}

function wantsHelp(args) {
  return args.some((a) => a === 'help' || a === '-h' || a === '--help')
}

async function onSubmit(line) {
  print(line, 'command')
  busy.value = true

  try {
    await execute(line)
  } catch (e) {
    print(e?.message ?? String(e), 'err')
  } finally {
    busy.value = false
    print('')
    terminal.value?.focus()
  }
}

async function execute(line) {
  const parts = line.split(/\s+/).filter(Boolean)

  // Typing the binary name is optional, the way it would not be in a shell.
  if (parts[0] === 'placebo') parts.shift()
  if (parts.length === 0) return

  const [command, ...args] = parts

  // Playground conveniences — not placebo commands.
  if (command === 'clear') {
    lines.value = []
    return
  }

  if (command === 'ls') {
    if (files.value.length === 0) {
      print('/tmp is empty — run "placebo file hl7" to put something in it.', 'system')
      return
    }
    for (const f of files.value) print(`${f.path}  (${f.size} bytes)`)
    return
  }

  if (command === 'cat') {
    if (!args[0]) {
      print('cat needs a file:  cat /tmp/<name>', 'err')
      return
    }
    const { bytes } = await call({ type: 'read', name: args[0].replace(/^\/tmp\//, '') })
    print(new TextDecoder().decode(bytes))
    return
  }

  if (command === 'reset') {
    await call({ type: 'reset' })
    files.value = []
    print('/tmp cleared.', 'system')
    return
  }

  if ((command === 'send' || command === 'listen') && !wantsHelp(args)) {
    for (const l of networkNote[command]) print(l, 'note')
    return
  }

  const { stdout, stderr, exitCode, files: list } = await call({
    type: 'run',
    argv: [command, ...args]
  })

  files.value = list

  if (stdout) print(stdout)
  if (stderr) print(stderr, 'err')
  if (!stdout && !stderr && exitCode !== 0) print(`exited with code ${exitCode}`, 'err')
}

function runExample(text) {
  if (!ready.value || busy.value) return
  if (text.includes('<file>')) {
    const first = files.value[0]
    if (!first) {
      print('Generate a file first — try "placebo file hl7".', 'system')
      return
    }
    text = text.replace('/tmp/<file>', first.path)
  }
  onSubmit(text)
}

async function download(file) {
  const { bytes } = await call({ type: 'read', name: file.name })
  const url = URL.createObjectURL(new Blob([bytes], { type: 'text/plain' }))

  const a = document.createElement('a')
  a.href = url
  a.download = file.name
  document.body.appendChild(a)
  a.click()
  a.remove()

  URL.revokeObjectURL(url)
}

const hasFiles = computed(() => files.value.length > 0)
</script>

<template>
  <article class="pg">
    <header class="container pg__head">
      <RouterLink to="/placebo" class="pg__back">← placebo</RouterLink>
      <p class="eyebrow">Playground</p>
      <h1 class="pg__title">Run placebo in your browser</h1>
      <p class="pg__sub muted">
        This is the actual <code>placebo</code> CLI — the same Go binary you get from
        Homebrew, compiled to WebAssembly and running in this tab. Nothing is sent to a
        server, and every patient it generates is synthetic.
      </p>
    </header>

    <section class="container pg__main">
      <div class="pg__term">
        <p v-if="loadError" class="pg__error">{{ loadError }}</p>

        <PlaygroundTerminal
          ref="terminal"
          :lines="lines"
          :busy="busy"
          :ready="ready"
          @submit="onSubmit"
        />

        <div class="pg__chips">
          <button
            v-for="ex in examples"
            :key="ex.label"
            class="pg__chip mono"
            type="button"
            :disabled="!ready || busy"
            :title="ex.hint"
            @click="runExample(ex.label)"
          >
            {{ ex.label }}
          </button>
        </div>
      </div>

      <aside class="pg__side">
        <div class="card pg__panel">
          <h2 class="pg__panel-title">Virtual /tmp</h2>
          <p v-if="!hasFiles" class="muted pg__panel-empty">
            Files placebo writes show up here. Try <code>placebo file csv 5</code>.
          </p>
          <ul v-else class="pg__files">
            <li v-for="f in files" :key="f.name">
              <button class="pg__file" type="button" @click="download(f)">
                <span class="mono pg__file-name">{{ f.name }}</span>
                <span class="muted pg__file-size">{{ f.size }} B ↓</span>
              </button>
            </li>
          </ul>
        </div>

        <div class="card pg__panel">
          <h2 class="pg__panel-title">What works here</h2>
          <ul class="pg__list">
            <li><code>file</code> — csv and hl7 generation</li>
            <li><code>read sugarpill</code> — HL7 to JSON</li>
            <li><code>help</code>, <code>version</code></li>
          </ul>
          <p class="muted pg__panel-note">
            <code>send</code> and <code>listen</code> need raw TCP, which no browser tab
            has. Those are the reason to
            <RouterLink to="/placebo#install">install the CLI</RouterLink>.
          </p>
          <p class="muted pg__panel-note">
            Playground extras: <code>ls</code>, <code>cat</code>, <code>clear</code>,
            <code>reset</code>.
          </p>
        </div>
      </aside>
    </section>
  </article>
</template>

<style scoped>
.pg__head {
  padding-block: 56px 32px;
}

.pg__back {
  display: inline-block;
  margin-bottom: 20px;
  font-size: 0.9rem;
  color: var(--text-muted);
  text-decoration: none;
}
.pg__back:hover {
  color: var(--accent);
}

.pg__title {
  font-size: clamp(2rem, 5vw, 2.75rem);
  line-height: 1.1;
  letter-spacing: -0.02em;
  margin: 10px 0 14px;
}

.pg__sub {
  max-width: var(--maxw-prose);
  font-size: 1.05rem;
  line-height: 1.65;
}

.pg__main {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 280px;
  gap: 28px;
  align-items: start;
  padding-bottom: 72px;
}

.pg__error {
  margin: 0 0 12px;
  padding: 10px 14px;
  border-radius: var(--radius);
  border: 1px solid var(--border-strong);
  background: var(--surface-2);
  font-size: 0.9rem;
}

.pg__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
}

.pg__chip {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 6px 13px;
  font-size: 0.78rem;
  color: var(--text-soft);
  cursor: pointer;
  transition: all 0.15s var(--ease);
}
.pg__chip:hover:not(:disabled) {
  border-color: var(--accent);
  color: var(--accent);
  background: var(--accent-soft);
}
.pg__chip:disabled {
  opacity: 0.5;
  cursor: default;
}

.pg__side {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.pg__panel {
  padding: 18px;
}

.pg__panel-title {
  font-size: 0.95rem;
  margin: 0 0 10px;
}

.pg__panel-empty,
.pg__panel-note {
  font-size: 0.85rem;
  line-height: 1.6;
  margin: 10px 0 0;
}
.pg__panel-empty {
  margin-top: 0;
}

.pg__files {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.pg__file {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 8px 10px;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  background: var(--surface-2);
  cursor: pointer;
  text-align: left;
  transition: all 0.15s var(--ease);
}
.pg__file:hover {
  border-color: var(--accent);
  background: var(--accent-soft);
}

.pg__file-name {
  font-size: 0.76rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pg__file-size {
  font-size: 0.72rem;
  white-space: nowrap;
}

.pg__list {
  margin: 0;
  padding-left: 18px;
  font-size: 0.85rem;
  line-height: 1.7;
  color: var(--text-soft);
}

@media (max-width: 900px) {
  .pg__main {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
