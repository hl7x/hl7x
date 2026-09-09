<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import CommandBlock from '@/components/CommandBlock.vue'
import CodeBlock from '@/components/CodeBlock.vue'

const features = [
  {
    title: 'Fake patient data',
    body: 'Names, MRNs, encounter IDs, addresses, dates of birth, and appointment dates — all generated for you.'
  },
  {
    title: 'CSV generation',
    body: 'Write a CSV of fake patients to /tmp/ — a single row or a few hundred, ready for fixtures and test loads.'
  },
  {
    title: 'HL7 message sending',
    body: 'Messages go out MLLP-framed, so Mirth, Rhapsody, Cloverleaf, Iguana, and Epic Bridges accept them. listen receives them back and replies with an MSA|AA ack.'
  },
  {
    title: 'Scenario subcommands',
    body: 'Admit, transfer, discharge, register, and pre-admit built in — one subcommand per ADT event.'
  },
  {
    title: 'Readable HL7',
    body: 'The read command turns dense pipe-and-caret HL7 into structured JSON — handy if you are not used to reading raw HL7.'
  },
  {
    title: 'Synthetic only',
    body: 'placebo generates fake data exclusively. No real PHI ever touches your machine.'
  }
]

const commands = [
  {
    name: 'file',
    usage: 'placebo file csv [number of patients]',
    body: 'Create a file of fake patient data in /tmp/ — csv for a spreadsheet, hl7 for a message.'
  },
  {
    name: 'send',
    usage: 'placebo send hl7 [subcommand]',
    body: 'Send an HL7 message built from fake patient data. With no subcommand you get an ADT^A01 admit opened in your editor first.'
  },
  {
    name: 'listen',
    usage: 'placebo listen hl7',
    body: 'Receive and print HL7 messages arriving on the listening port.'
  },
  {
    name: 'read',
    usage: 'placebo read sugarpill <file>',
    body: 'Break an HL7 message down into a readable structure.'
  },
  {
    name: 'help',
    usage: 'placebo help send',
    body: 'Show help for a command, including every subcommand it accepts.'
  }
]

const scenarios = [
  { name: 'admit', event: 'ADT^A01', body: 'Admit a patient.' },
  { name: 'transfer', event: 'ADT^A02', body: 'Transfer a patient.' },
  { name: 'discharge', event: 'ADT^A03', body: 'Discharge a patient.' },
  { name: 'register', event: 'ADT^A04', body: 'Register a patient.' },
  { name: 'pre-admit', event: 'ADT^A05', body: 'Establish preadmit information.' }
]

const sendHelpers = [
  { name: 'file <path>', body: 'Edit an existing HL7 file and send it when you are done.' },
  { name: 'last', body: 'Reopen the last sent HL7 message in an interactive prompt.' },
  { name: 'sugarpill', body: 'Build a message through an easy-to-read interactive prompt.' }
]

const installTabs = [
  {
    id: 'brew',
    label: 'Homebrew',
    blurb: 'macOS and Linux. The tap keeps placebo up to date alongside the rest of your formulae.',
    steps: [{ command: 'brew install hl7x/tap/placebo' }],
    note: 'Upgrade later with brew upgrade placebo.'
  },
  {
    id: 'linux',
    label: 'Linux packages',
    blurb: 'Every release ships .deb, .rpm, and .apk packages. Download the one for your distribution and architecture, then install it.',
    steps: [
      { label: 'Debian, Ubuntu', command: 'sudo dpkg -i placebo_<version>_amd64.deb' },
      { label: 'Fedora, RHEL, openSUSE', command: 'sudo rpm -i placebo-<version>.x86_64.rpm' },
      { label: 'Alpine', command: 'sudo apk add --allow-untrusted placebo_<version>_x86_64.apk' }
    ]
  },
  {
    id: 'binary',
    label: 'Pre-built binary',
    blurb: 'Archives are named placebo_<version>_<os>_<arch>.tar.gz (.zip on Windows). Substitute linux/darwin/windows and amd64/arm64 as needed.',
    code: `VERSION=0.1.0
curl -sSL -o placebo.tar.gz \\
  https://github.com/hl7x/placebo/releases/download/v\${VERSION}/placebo_\${VERSION}_darwin_arm64.tar.gz
tar -xzf placebo.tar.gz
sudo mv placebo /usr/local/bin/`,
    steps: [{ label: 'Verify the download', command: 'sha256sum --check --ignore-missing checksums.txt' }],
    note: 'macOS binaries are unsigned. If Gatekeeper quarantines one, clear it with xattr -dr com.apple.quarantine /usr/local/bin/placebo — Homebrew does this for you.'
  },
  {
    id: 'go',
    label: 'Go',
    blurb: 'Already have a Go toolchain? Install straight from the module path.',
    steps: [{ command: 'go install github.com/hl7x/placebo/cmd/placebo@latest' }]
  },
  {
    id: 'source',
    label: 'From source',
    blurb: 'Clone the repository and run the installer script. It needs elevated permissions to put the binary on your PATH.',
    steps: [
      { command: 'git clone https://github.com/hl7x/placebo' },
      { command: 'cd placebo && sudo ./install.sh' }
    ]
  }
]

const activeTab = ref('brew')

const segments = [
  'MSH', 'EVN', 'PID', 'PD1', 'ROL', 'DB1', 'ARV', 'NK1', 'PV1',
  'PV2', 'GT1', 'IN1', 'AL1', 'DG1', 'ORC', 'OBR', 'NTE', 'OBX'
]

const exampleOutput = `MSH|^~\\&|PLACEBO|HL7X|EPIC|HOSP|20260602143021||ADT^A01|MSG00001|P|2.5.1
EVN|A01|20260602143021
PID|1||PT00482^^^HL7X^MR||DOE^JANE^Q||19870514|F|||
  742 EVERGREEN TER^^PORTLAND^OR^97206||(503)555-0142
PV1|1|I|3W^312^A^HL7X||||1234^SMITH^JOHN^A^^^MD|||MED`

const readInput = `MSH|^~\\&|SENDAPP|PLACEBO|RECVAPP|LAB|202405290800||ADT^A01|12345|P|2.3|`

const readOutput = `{
  "MSH": {
    "Encode": "^~\\\\&",
    "SendingApplication": "SENDAPP",
    "SendingFacility": "PLACEBO",
    "ReceivingApplication": "RECVAPP",
    "ReceivingFacility": "LAB",
    "DateTimeOfMessage": "202405290800",
    "MessageType": {
      "MessageCode": "ADT",
      "TriggerEvent": "A01"
    },
    "MessageControlID": "12345",
    "ProcessingID": "P",
    "VersionID": "2.3"
  }
}`
</script>

<template>
  <article class="placebo">
    <!-- Masthead -->
    <header class="ph">
      <div class="container ph__inner">
        <RouterLink to="/tools" class="ph__back">← All tools</RouterLink>
        <h1 class="ph__name">placebo</h1>
        <p class="ph__tag">
          Fake patient data and HL7 messages for testing.
        </p>
        <p class="ph__sub muted">
          A command-line tool for healthcare testing: generate fake patients as
          CSV, send HL7 messages that simulate real admit, transfer, and
          discharge scenarios, and read raw HL7 into a structure you can
          actually follow.
        </p>

        <div class="ph__install">
          <CommandBlock command="brew install hl7x/tap/placebo" />
          <p class="ph__install-alt muted">
            Also available as a Linux package, a release archive, or
            <code>go install</code> — <a href="#install">see all install options</a>.
          </p>
        </div>

        <div class="ph__links">
          <a href="https://github.com/hl7x/placebo" target="_blank" rel="noopener">Source</a>
          <span aria-hidden="true">·</span>
          <a href="https://github.com/hl7x/placebo/releases/latest" target="_blank" rel="noopener">Releases</a>
          <span aria-hidden="true">·</span>
          <RouterLink to="/docs">Docs</RouterLink>
        </div>
      </div>
    </header>

    <!-- Quick demo -->
    <section class="container demo">
      <div class="demo__col">
        <h2 class="h-rule">Try it</h2>
        <p class="muted">
          Generate an HL7 file for a fresh fake patient, written to
          <code>/tmp/</code>:
        </p>
        <CommandBlock command="placebo file hl7" />
        <p class="muted demo__note">
          Need a spreadsheet instead? <code>placebo file csv 4</code> writes a
          CSV of four fake patients.
        </p>
      </div>
      <div class="demo__col">
        <CodeBlock label="generated .hl7" :code="exampleOutput" />
      </div>
    </section>

    <!-- Read it back -->
    <section class="container demo demo--reverse">
      <div class="demo__col">
        <h2 class="h-rule">Read it back</h2>
        <p class="muted">
          Stop counting pipes and carets. Feed placebo an HL7 file and the
          <code>read sugarpill</code> command hands you structured JSON:
        </p>
        <CommandBlock command="placebo read sugarpill message.hl7" />
        <p class="muted demo__note">
          <strong>sugarpill</strong> is an early-stage tool that lives inside
          placebo today — and is growing into its own standalone CLI.
        </p>
      </div>
      <div class="demo__col">
        <CodeBlock label="message.hl7" :code="readInput" />
        <CodeBlock label="read sugarpill → json" :code="readOutput" />
      </div>
    </section>

    <!-- Features -->
    <section class="container section">
      <h2 class="h-rule center-rule">What you get</h2>
      <div class="feat-grid">
        <div v-for="f in features" :key="f.title" class="feat">
          <div class="feat__mark" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
          </div>
          <div>
            <h3>{{ f.title }}</h3>
            <p class="muted">{{ f.body }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Commands -->
    <section class="container section">
      <h2 class="h-rule center-rule">Commands</h2>
      <p class="cmd-intro muted center">
        placebo is driven by commands and subcommands, not flags:
        <code>placebo &lt;command&gt; [subcommand] [arguments] [options]</code>.
      </p>

      <div class="cmds">
        <div v-for="c in commands" :key="c.name" class="cmd-row">
          <div class="cmd-row__head">
            <span class="cmd-row__name mono">{{ c.name }}</span>
            <code class="cmd-row__usage mono">{{ c.usage }}</code>
          </div>
          <p class="muted">{{ c.body }}</p>
        </div>
      </div>

      <div class="sub-grid">
        <div>
          <h3 class="sub-head">Preset ADT scenarios</h3>
          <p class="muted sub-note">
            Each one is a subcommand of <code>placebo send hl7</code>.
          </p>
          <ul class="sub-list">
            <li v-for="s in scenarios" :key="s.name">
              <span class="sub-list__name mono">{{ s.name }}</span>
              <span class="sub-list__event mono">{{ s.event }}</span>
              <span class="muted">{{ s.body }}</span>
            </li>
          </ul>
        </div>
        <div>
          <h3 class="sub-head">Auxiliary send subcommands</h3>
          <p class="muted sub-note">
            Build or replay a message instead of generating one outright.
          </p>
          <ul class="sub-list">
            <li v-for="h in sendHelpers" :key="h.name">
              <span class="sub-list__name mono">{{ h.name }}</span>
              <span class="muted">{{ h.body }}</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="port">
        <h3 class="sub-head">Choosing a port</h3>
        <p class="muted">
          <code>send</code> and <code>listen</code> use port
          <code>9700</code> by default. Override it with the
          <code>--port</code> option, which may be given before the command or
          after the subcommand:
        </p>
        <CommandBlock command="placebo send hl7 --port 8500" />
        <CommandBlock command="placebo --port 8500 listen hl7" />
        <p class="muted">
          It can also be set permanently with the
          <code>PLACEBO_PORT</code> environment variable:
        </p>
        <CommandBlock command="export PLACEBO_PORT=8500" />
      </div>
    </section>

    <!-- Supported segments -->
    <section class="container section">
      <h2 class="h-rule center-rule">Supported segments</h2>
      <p class="seg-intro muted center">
        placebo understands the segments you actually see in ADT traffic:
      </p>
      <div class="segs">
        <span v-for="s in segments" :key="s" class="seg mono">{{ s }}</span>
      </div>
    </section>

    <!-- Common recipes -->
    <section class="container section">
      <h2 class="h-rule center-rule">Common recipes</h2>
      <div class="recipes">
        <div class="recipe">
          <p class="recipe__label muted"># Four fake patients as a CSV</p>
          <CommandBlock command="placebo file csv 4" />
        </div>
        <div class="recipe">
          <p class="recipe__label muted"># Admit a patient (ADT^A01)</p>
          <CommandBlock command="placebo send hl7 admit" />
        </div>
        <div class="recipe">
          <p class="recipe__label muted"># Discharge a patient (ADT^A03)</p>
          <CommandBlock command="placebo send hl7 discharge" />
        </div>
        <div class="recipe">
          <p class="recipe__label muted"># Edit an existing message, then send it</p>
          <CommandBlock command="placebo send hl7 file /tmp/import_hl7.txt" />
        </div>
        <div class="recipe">
          <p class="recipe__label muted"># Print what arrives on port 8500</p>
          <CommandBlock command="placebo listen hl7 --port 8500" />
        </div>
        <div class="recipe">
          <p class="recipe__label muted"># Full help for a command</p>
          <CommandBlock command="placebo help send" />
        </div>
      </div>
    </section>

    <!-- Install -->
    <section id="install" class="container section">
      <h2 class="h-rule center-rule">Install</h2>
      <p class="cmd-intro muted center">
        Tagged releases are built by GoReleaser and published for Linux, macOS,
        and Windows on both <code>amd64</code> and <code>arm64</code>. Pick
        whichever route fits your machine.
      </p>

      <div class="install">
        <div class="install__tabs" role="tablist" aria-label="Installation method">
          <button
            v-for="t in installTabs"
            :key="t.id"
            class="install__tab"
            type="button"
            role="tab"
            :aria-selected="activeTab === t.id"
            :class="{ 'is-active': activeTab === t.id }"
            @click="activeTab = t.id"
          >
            {{ t.label }}
          </button>
        </div>

        <div
          v-for="t in installTabs"
          v-show="activeTab === t.id"
          :key="t.id"
          class="install__panel"
          role="tabpanel"
        >
          <p class="muted install__blurb">{{ t.blurb }}</p>
          <CodeBlock v-if="t.code" label="terminal" :code="t.code" />
          <div v-for="(step, i) in t.steps" :key="i" class="install__step">
            <p v-if="step.label" class="recipe__label muted"># {{ step.label }}</p>
            <CommandBlock :command="step.command" />
          </div>
          <p v-if="t.note" class="muted install__note">{{ t.note }}</p>
        </div>
      </div>

      <div class="install__verify">
        <p class="recipe__label muted"># Confirm whichever route you took</p>
        <CommandBlock command="placebo version" />
      </div>

      <p class="install-note muted center">
        Packages and archives for every platform live on the
        <a href="https://github.com/hl7x/placebo/releases/latest" target="_blank" rel="noopener">releases page</a>,
        each with a <code>checksums.txt</code> to verify against.
      </p>
    </section>

    <!-- Footer note -->
    <section class="container ph-end">
      <div class="ph-end__inner">
        <p>
          <strong>placebo</strong> generates synthetic data only. It never
          touches real PHI — safe to run anywhere, in any environment.
        </p>
        <div class="ph-end__cta">
          <a class="btn btn-primary" href="https://github.com/hl7x/placebo" target="_blank" rel="noopener">Star on GitHub</a>
          <RouterLink to="/docs" class="btn btn-ghost">Read the docs</RouterLink>
        </div>
      </div>
    </section>
  </article>
</template>

<style scoped>
.placebo {
  padding-bottom: 24px;
}

/* Masthead */
.ph {
  padding-block: 72px 56px;
  position: relative;
}
.ph::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(50% 60% at 50% 0%, var(--accent-soft), transparent 70%);
  pointer-events: none;
}
.ph__inner {
  position: relative;
  max-width: 660px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.ph__back {
  font-family: var(--font-mono);
  font-size: 0.82rem;
  color: var(--text-muted);
  margin-bottom: 22px;
}
.ph__back:hover {
  color: var(--accent);
}
.ph__name {
  font-family: var(--font-mono);
  font-size: clamp(2.6rem, 7vw, 4rem);
  font-weight: 600;
  letter-spacing: -0.04em;
  color: var(--accent);
}
.ph__tag {
  margin-top: 14px;
  font-size: clamp(1.25rem, 3vw, 1.7rem);
  font-weight: 700;
  letter-spacing: -0.02em;
}
.ph__sub {
  margin-top: 16px;
  font-size: 1.06rem;
  max-width: 52ch;
}
.ph__install {
  margin-top: 32px;
  width: 100%;
  max-width: 480px;
}
.ph__install-alt {
  margin-top: 12px;
  font-size: 0.88rem;
}
.ph__install-alt code {
  font-family: var(--font-mono);
  font-size: 0.85em;
}
.ph__links {
  margin-top: 18px;
  display: flex;
  gap: 12px;
  align-items: center;
  font-size: 0.9rem;
  color: var(--text-muted);
}

/* Section rule headings */
.h-rule {
  font-size: 1.4rem;
  padding-bottom: 12px;
  margin-bottom: 24px;
  border-bottom: 1px solid var(--border);
}
.center-rule {
  text-align: center;
}

/* Demo */
.demo {
  display: grid;
  grid-template-columns: 1fr 1.15fr;
  gap: 40px;
  align-items: start;
  padding-block: 56px;
  border-top: 1px solid var(--border);
}
.demo__col > * + * {
  margin-top: 14px;
}
.demo__note {
  font-size: 0.9rem;
}
.demo__note code,
.demo__col p code {
  background: var(--surface-2);
  padding: 1px 6px;
  border-radius: 5px;
  font-size: 0.85em;
  border: 1px solid var(--border);
}
.demo--reverse {
  grid-template-columns: 1.15fr 1fr;
}
.demo--reverse .demo__col:first-child {
  order: 2;
}
.demo--reverse .demo__col:last-child {
  order: 1;
}

/* Supported segments */
.seg-intro {
  max-width: 52ch;
  margin: -8px auto 24px;
  font-size: 0.98rem;
}
.segs {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  max-width: 720px;
  margin-inline: auto;
}
.seg {
  font-size: 0.82rem;
  font-weight: 500;
  padding: 6px 12px;
  border-radius: 7px;
  color: var(--accent);
  background: var(--accent-soft);
  border: 1px solid var(--accent-border);
}

/* Commands */
.cmd-intro {
  max-width: 60ch;
  margin: -8px auto 26px;
  font-size: 0.98rem;
}
.cmd-intro code,
.port code,
.sub-note code {
  background: var(--surface-2);
  border: 1px solid var(--border);
  padding: 1px 6px;
  border-radius: 5px;
  font-size: 0.85em;
  color: var(--text);
}
.cmds {
  display: flex;
  flex-direction: column;
  max-width: 920px;
  margin-inline: auto;
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: var(--surface);
  overflow: hidden;
}
.cmd-row {
  padding: 16px 20px;
  border-bottom: 1px solid var(--border);
}
.cmd-row:last-child {
  border-bottom: none;
}
.cmd-row__head {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 6px;
}
.cmd-row__name {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--accent);
}
.cmd-row__usage {
  font-size: 0.8rem;
  color: var(--text-muted);
  background: var(--surface-2);
  border: 1px solid var(--border);
  padding: 2px 8px;
  border-radius: 6px;
}
.cmd-row p {
  font-size: 0.9rem;
}

.sub-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px;
  max-width: 920px;
  margin: 36px auto 0;
}
.sub-head {
  font-size: 1rem;
  margin-bottom: 6px;
}
.sub-note {
  font-size: 0.88rem;
  margin-bottom: 12px;
}
.sub-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.sub-list li {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 8px;
  font-size: 0.9rem;
}
.sub-list__name {
  font-size: 0.85rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 6px;
  color: var(--accent);
  background: var(--accent-soft);
  border: 1px solid var(--accent-border);
}
.sub-list__event {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.port {
  max-width: 920px;
  margin: 40px auto 0;
}
.port p {
  font-size: 0.92rem;
  margin-bottom: 12px;
}
.port :deep(.cmd) + p {
  margin-top: 16px;
}

/* Features */
.feat-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 26px 36px;
  max-width: 960px;
  margin-inline: auto;
}
.feat {
  display: flex;
  gap: 14px;
}
.feat__mark {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  background: var(--accent-soft);
  color: var(--accent);
  border: 1px solid var(--accent-border);
}
.feat h3 {
  font-size: 1rem;
  margin-bottom: 5px;
}
.feat p {
  font-size: 0.9rem;
}

/* Recipes */
.recipes {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 28px 32px;
  max-width: 920px;
  margin-inline: auto;
}
.recipe__label {
  font-family: var(--font-mono);
  font-size: 0.82rem;
  margin-bottom: 10px;
}

/* Install */
.install {
  max-width: 760px;
  margin-inline: auto;
}
.install__tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  margin-bottom: 26px;
}
.install__tab {
  font-family: var(--font-sans);
  font-size: 0.86rem;
  font-weight: 600;
  color: var(--text-muted);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 7px 16px;
  cursor: pointer;
  transition: all 0.15s var(--ease);
}
.install__tab:hover {
  color: var(--text);
  border-color: var(--border-strong);
}
.install__tab.is-active {
  color: var(--accent);
  background: var(--accent-soft);
  border-color: var(--accent-border);
}
.install__blurb {
  font-size: 0.95rem;
  margin-bottom: 18px;
}
.install__panel > * + * {
  margin-top: 16px;
}
.install__step + .install__step {
  margin-top: 14px;
}
.install__note {
  font-size: 0.88rem;
}
.install__verify {
  max-width: 760px;
  margin: 34px auto 0;
  padding-top: 26px;
  border-top: 1px solid var(--border);
}
.install-note {
  max-width: 60ch;
  margin: 22px auto 0;
  font-size: 0.95rem;
}
.install-note code {
  background: var(--surface-2);
  border: 1px solid var(--border);
  padding: 1px 6px;
  border-radius: 5px;
  font-size: 0.85em;
  color: var(--text);
}

/* End */
.ph-end {
  padding-top: 24px;
}
.ph-end__inner {
  max-width: 660px;
  margin-inline: auto;
  text-align: center;
  padding: 40px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border);
  background: var(--surface);
}
.ph-end__inner p {
  font-size: 1.02rem;
  color: var(--text-soft);
  max-width: 50ch;
  margin-inline: auto;
}
.ph-end__cta {
  margin-top: 24px;
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

@media (max-width: 820px) {
  .demo,
  .demo--reverse {
    grid-template-columns: 1fr;
    gap: 28px;
  }
  .demo--reverse .demo__col:first-child {
    order: 1;
  }
  .demo--reverse .demo__col:last-child {
    order: 2;
  }
  .feat-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .sub-grid {
    grid-template-columns: 1fr;
    gap: 28px;
  }
}
@media (max-width: 560px) {
  .feat-grid,
  .recipes {
    grid-template-columns: 1fr;
  }
}
</style>
