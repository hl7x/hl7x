// Central catalog of HL7X tools. Add new tools here and they appear
// on the home page and /tools automatically.

export const tools = [
  {
    name: 'placebo',
    to: '/placebo',
    tagline: 'Fake patient data & HL7 messages for testing',
    description:
      'Generate fake patient data, send HL7 messages that simulate real admit, discharge, and referral scenarios, and read raw HL7 into a structure you can actually follow.',
    install: 'git clone https://github.com/hl7x/placebo && cd placebo && sudo ./installer.sh',
    status: 'stable',
    tags: ['HL7', 'CLI', 'testing']
  },
  {
    name: 'sugarpill',
    to: '/placebo',
    tagline: 'HL7 → JSON, made readable',
    description:
      "Turn raw HL7 into clean, readable JSON — no more counting pipes and carets. Today it ships inside placebo as the read command; it's growing into a standalone CLI.",
    install: 'placebo read sugarpill message.hl7',
    status: 'experimental',
    tags: ['HL7', 'JSON', 'CLI']
  }
]

export const statusMeta = {
  stable: { label: 'Stable', tone: 'good' },
  beta: { label: 'Beta', tone: 'warn' },
  experimental: { label: 'Early stage', tone: 'muted' }
}
