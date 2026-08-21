<script setup>
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
    body: 'Fire HL7 messages at an interface engine (default 127.0.0.1:9700) to exercise your channels end to end.'
  },
  {
    title: 'Scenario sub-commands',
    body: 'Admit, discharge, pre-admit, and referral flows built in — as single events or full admit-then-discharge sequences.'
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
          CSV, send HL7 messages that simulate real admit, discharge, and
          referral scenarios, and read raw HL7 into a structure you can actually
          follow.
        </p>

        <div class="ph__install">
          <CommandBlock command="sudo ./installer.sh" />
        </div>

        <div class="ph__links">
          <a href="https://github.com/hl7x/placebo" target="_blank" rel="noopener">Source</a>
          <span aria-hidden="true">·</span>
          <a href="#install">How to install</a>
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
        <CommandBlock command="placebo --file hl7" />
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
        <CommandBlock command="placebo --read sugarpill message.hl7" />
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

    <!-- Supported segments -->
    <section class="container section">
      <h2 class="h-rule center-rule">Supported segments</h2>
      <p class="seg-intro muted center">
        placebo understands the segments you actually see in ADT and referral
        traffic:
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
          <CommandBlock command="placebo --file csv 4" />
        </div>
        <div class="recipe">
          <p class="recipe__label muted"># Admit a patient (ADT^A01)</p>
          <CommandBlock command="placebo --send hl7 post-admit" />
        </div>
        <div class="recipe">
          <p class="recipe__label muted"># Admit then discharge (ADT^A01 + ADT^A03)</p>
          <CommandBlock command="placebo --send hl7 post-discharge" />
        </div>
        <div class="recipe">
          <p class="recipe__label muted"># Patient referral (REF^I12)</p>
          <CommandBlock command="placebo --send hl7 referral" />
        </div>
      </div>
    </section>

    <!-- Install -->
    <section id="install" class="container section">
      <h2 class="h-rule center-rule">Install</h2>
      <div class="install-grid">
        <div class="install-opt">
          <h3>1 · Clone the repo</h3>
          <CommandBlock command="git clone https://github.com/hl7x/placebo" />
        </div>
        <div class="install-opt">
          <h3>2 · Run the installer</h3>
          <CommandBlock command="cd placebo && sudo ./install.sh" />
        </div>
      </div>
      <p class="install-note muted center">
        The installer needs elevated permissions, so run it with
        <code>sudo</code>. That's it — no package managers, no runtimes.
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
.install-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 28px 32px;
  max-width: 920px;
  margin-inline: auto;
}
.install-opt h3 {
  font-size: 0.95rem;
  margin-bottom: 10px;
}
.install-note {
  max-width: 52ch;
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
}
@media (max-width: 560px) {
  .feat-grid,
  .recipes,
  .install-grid {
    grid-template-columns: 1fr;
  }
}
</style>
