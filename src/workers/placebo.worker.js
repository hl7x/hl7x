/**
 * Runs the real placebo CLI, compiled to wasip1 WebAssembly, off the main
 * thread.
 *
 * Two things shape the design:
 *
 *   1. Go's wasip1 runtime calls proc_exit when main returns, which burns the
 *      instance. So the module is compiled once and a fresh instance is made
 *      per command — compilation is the expensive half and it happens once.
 *   2. The virtual /tmp is kept alive between runs, so `placebo file hl7`
 *      followed by `placebo read sugarpill /tmp/...` works the way it does on
 *      a real machine.
 */
import {
  WASI,
  File,
  Directory,
  OpenFile,
  PreopenDirectory,
  ConsoleStdout
} from '@bjorn3/browser_wasi_shim'

let wasmModule = null

// Survives across runs — this is the playground's /tmp.
const tmp = new Map()

function decode(chunks) {
  let length = 0
  for (const c of chunks) length += c.byteLength

  const joined = new Uint8Array(length)
  let offset = 0
  for (const c of chunks) {
    joined.set(c, offset)
    offset += c.byteLength
  }

  return new TextDecoder().decode(joined)
}

async function compile(url) {
  try {
    wasmModule = await WebAssembly.compileStreaming(fetch(url))
  } catch {
    // Falls back when the response is not served as application/wasm.
    const res = await fetch(url)
    if (!res.ok) throw new Error(`could not load placebo (HTTP ${res.status})`)
    wasmModule = await WebAssembly.compile(await res.arrayBuffer())
  }
}

async function run(argv) {
  const out = []
  const err = []

  const fds = [
    // placebo only reads stdin for the interactive send prompts, which the
    // playground does not reach. An empty file is enough to satisfy it.
    new OpenFile(new File([])),
    // Raw rather than line-buffered so a final line without a trailing
    // newline is not swallowed.
    new ConsoleStdout((buf) => out.push(new Uint8Array(buf))),
    new ConsoleStdout((buf) => err.push(new Uint8Array(buf))),
    new PreopenDirectory('/tmp', tmp)
  ]

  const wasi = new WASI(['placebo', ...argv], [], fds, { debug: false })
  const instance = await WebAssembly.instantiate(wasmModule, {
    wasi_snapshot_preview1: wasi.wasiImport
  })

  const exitCode = wasi.start(instance)

  return { stdout: decode(out), stderr: decode(err), exitCode, files: listFiles() }
}

function listFiles() {
  const files = []

  for (const [name, inode] of tmp.entries()) {
    if (inode instanceof Directory) continue
    files.push({ name, path: `/tmp/${name}`, size: inode.data.byteLength })
  }

  return files.sort((a, b) => a.name.localeCompare(b.name))
}

function readFile(name) {
  const inode = tmp.get(name)
  if (!inode || inode instanceof Directory) return null

  // Copied out of the worker's heap so it survives the structured clone.
  return new Uint8Array(inode.data)
}

self.onmessage = async (event) => {
  const { type, id } = event.data

  try {
    if (type === 'init') {
      await compile(event.data.url)
      self.postMessage({ type: 'ready', id })
      return
    }

    if (type === 'run') {
      if (!wasmModule) throw new Error('placebo is not loaded yet')
      self.postMessage({ type: 'result', id, ...(await run(event.data.argv)) })
      return
    }

    if (type === 'read') {
      const bytes = readFile(event.data.name)
      if (!bytes) throw new Error(`no such file: ${event.data.name}`)
      self.postMessage({ type: 'file', id, name: event.data.name, bytes }, [bytes.buffer])
      return
    }

    if (type === 'reset') {
      tmp.clear()
      self.postMessage({ type: 'result', id, stdout: '', stderr: '', exitCode: 0, files: [] })
      return
    }
  } catch (e) {
    self.postMessage({ type: 'error', id, message: e?.message ?? String(e) })
  }
}
