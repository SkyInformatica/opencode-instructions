// encoding-auto — OpenCode V2 plugin.
//
// Auto-detects file encoding (ANSI legacy: windows-1252, iso-8859-1, etc.) and
// fixes read/edit/write so the built-in tools do not corrupt accents.
//
// V2 port of https://github.com/vexakuro67/opencode-plugin-encoding-auto
// with the Sky adjustments baked in: iso-8859-1/-15 and windows-1252 are NOT
// treated as UTF-8-like (treating them so made edit/write corrupt accents).
//
// Deps (chardet, iconv-lite) must be installed via a package.json visible from
// the plugin file, e.g. ~/.config/opencode/package.json.
//
// Local deviation (Sky/Notar, 2026-09-25): the bash/shell prefix below only
// applies when SHELL indicates PowerShell. Without the guard, every bash
// command on this machine would receive a PowerShell prefix and fail.
import chardet from "chardet"
import iconv from "iconv-lite"
import { appendFileSync, existsSync, readFileSync, statSync, writeFileSync } from "node:fs"
import { isAbsolute, join, resolve } from "node:path"
import { Plugin } from "@opencode/plugin"

// OpenCode does not capture a plugin's console output, so mirror errors to a file
// the user can tail (encoding-auto.log, next to this plugin). console.error is
// kept too for CLI runs where stderr is visible. Only errors are logged — normal
// conversions/restores are silent.
const LOG_FILE = join(import.meta.dirname ?? process.cwd(), "encoding-auto.log")
function logError(msg: string): void {
  try {
    appendFileSync(LOG_FILE, `${new Date().toISOString()} ERROR ${msg}\n`)
  } catch {
    /* logging must never break the tool */
  }
  console.error(`[encoding-auto] ${msg}`)
}

// NOTE: iso-8859-1/-15 and windows-1252 intentionally excluded (Sky adjustment).
const UTF8_ENCODINGS = ["utf-8", "ascii", "utf-16le", "utf-16be"]

const BINARY_EXTS = [
  ".png", ".jpg", ".jpeg", ".gif", ".bmp", ".ico", ".webp", ".pdf",
  ".zip", ".rar", ".7z", ".gz", ".tar", ".exe", ".dll", ".so", ".dylib",
  ".class", ".jar", ".war", ".bin", ".dat", ".db", ".sqlite",
  ".mp3", ".mp4", ".avi", ".mov", ".mkv", ".wav", ".flac", ".ogg",
]

// Tool names may arrive namespaced (e.g. "default.edit" instead of "edit").
// Normalize to the short lowercase name before matching, otherwise hooks
// silently never fire.
function shortToolName(tool: unknown): string {
  if (typeof tool !== "string") return ""
  const lower = tool.toLowerCase()
  const idx = lower.lastIndexOf(".")
  return idx >= 0 ? lower.slice(idx + 1) : lower
}

export function isTextFile(filePath: string): boolean {
  try {
    const stat = statSync(filePath)
    if (!stat.isFile()) return false
    if (stat.size === 0 || stat.size > 50 * 1024 * 1024) return false
  } catch {
    return false
  }
  const ext = filePath.substring(filePath.lastIndexOf(".")).toLowerCase()
  if (BINARY_EXTS.includes(ext)) return false
  return true
}

export function detectEncoding(buffer: Buffer): string {
  if (buffer.length >= 3 && buffer[0] === 0xef && buffer[1] === 0xbb && buffer[2] === 0xbf)
    return "utf-8"
  if (buffer.length >= 2 && buffer[0] === 0xff && buffer[1] === 0xfe)
    return "utf-16le"
  if (buffer.length >= 2 && buffer[0] === 0xfe && buffer[1] === 0xff)
    return "utf-16be"
  if (buffer.length === 0)
    return "utf-8"
  const detected = chardet.detect(buffer)
  if (!detected) return "utf-8"
  const enc = detected.toLowerCase().replace(/_/g, "-")
  if (enc === "ascii") return "utf-8"
  return enc
}

export function isUtf8Like(encoding: string): boolean {
  return !encoding || UTF8_ENCODINGS.includes(encoding.toLowerCase())
}

export function readFileWithEncoding(
  filePath: string,
  offset?: number,
  limit?: number,
): { formatted: string; encoding: string } {
  const buffer = readFileSync(filePath)
  const encoding = detectEncoding(buffer)
  const text = isUtf8Like(encoding) ? buffer.toString("utf-8") : iconv.decode(buffer, encoding)
  const allLines = text.split(/\r?\n/)
  const start = Math.max(0, (offset || 1) - 1)
  const maxLines = limit || 2000
  const end = Math.min(allLines.length, start + maxLines)
  const selectedLines = allLines.slice(start, end)
  let formatted = selectedLines
    .map((line, i) => {
      const lineNum = start + i + 1
      if (line.length > 2000) line = line.substring(0, 2000)
      return `${lineNum}: ${line}`
    })
    .join("\n")
  if (end < allLines.length) {
    formatted += `\n(Showing lines ${start + 1}-${end} of ${allLines.length}. Use offset=${end + 1} to continue reading.)`
  } else if (start > 0) {
    formatted = `(Showing lines ${start + 1}-${end} of ${allLines.length}.)\n` + formatted
  }
  return { formatted, encoding: isUtf8Like(encoding) ? "utf-8" : encoding }
}

function hookFilePath(input: Record<string, unknown>): string | undefined {
  const p = input["filePath"] ?? input["path"]
  return typeof p === "string" ? p : undefined
}

// NOTE: the patch tool is named "apply_patch" (not "patch") and carries no
// filePath — target paths are embedded in patchText markers, relative to the
// project root (docs: "Tools" > "apply_patch").
const WRITE_TOOLS = ["edit", "write", "apply_patch", "patch"]

export function isWriteTool(tool: unknown): boolean {
  return WRITE_TOOLS.includes(shortToolName(tool))
}

export function extractPatchPaths(patchText: string): string[] {
  const paths: string[] = []
  for (const line of patchText.split("\n")) {
    const m = /^\*\*\*\s+(?:Update File|Add File|Delete File|Move to)\s*:\s*(.+?)\s*$/.exec(line)
    if (!m) continue
    const p = m[1].trim().replace(/^["']|["']$/g, "")
    if (p && !paths.includes(p)) paths.push(p)
  }
  return paths
}

export function toAbsolutePath(p: string): string {
  if (isAbsolute(p)) return p
  return resolve(process.cwd(), p)
}

function collectWritePaths(input: Record<string, unknown>): string[] {
  const paths: string[] = []
  const single = hookFilePath(input)
  if (single) paths.push(single)
  const patchText = input["patchText"]
  if (typeof patchText === "string") {
    for (const p of extractPatchPaths(patchText)) paths.push(p)
  }
  return paths
}

export function getEncodingForFile(filePath: string): string {
  if (!existsSync(filePath)) return "utf-8"
  try {
    return detectEncoding(readFileSync(filePath))
  } catch {
    return "utf-8"
  }
}

// Files temporarily converted to UTF-8 before edit/write runs, mapped back to their
// original encoding after the tool runs. Keyed by normalized absolute path so
// the same file listed twice (e.g. relative marker vs absolute path) restores once.
//
// `pending` is a per-file reference count. Parallel write tools on the same file
// interleave their before/after hooks: without the count, a second before-hook
// sees the already-converted UTF-8 file, skips recording, and a first after-hook
// restores to ANSI while the second tool is still pending — the second tool then
// reads ANSI as UTF-8 and accents die. Convert on 0->1, restore on 1->0.
const convertedFiles = new Map<string, { encoding: string; absPath: string; badChars: number; pending: number }>()

function countReplacementChars(buffer: Buffer): number {
  // Counts U+FFFD (EF BF BD) — its growth after a tool run means accents died.
  let n = 0
  for (let i = 0; i + 2 < buffer.length; i++) {
    if (buffer[i] === 0xef && buffer[i + 1] === 0xbf && buffer[i + 2] === 0xbd) n++
  }
  return n
}

function mapKey(absPath: string): string {
  const p = absPath.replace(/\\/g, "/")
  return process.platform === "win32" ? p.toLowerCase() : p
}

function convertToUtf8(absPath: string): void {
  const key = mapKey(absPath)
  const existing = convertedFiles.get(key)
  if (existing) {
    existing.pending++
    return
  }
  if (!isTextFile(absPath)) return
  const encoding = getEncodingForFile(absPath)
  if (isUtf8Like(encoding)) return
  const buffer = readFileSync(absPath)
  writeFileSync(absPath, iconv.decode(buffer, encoding), "utf-8")
  convertedFiles.set(key, { encoding, absPath, badChars: countReplacementChars(buffer), pending: 1 })
}

function restoreEncoding(absPath: string): void {
  const key = mapKey(absPath)
  const entry = convertedFiles.get(key)
  if (!entry) return
  entry.pending--
  if (entry.pending > 0) return
  convertedFiles.delete(key)
  try {
    // The tool may have deleted the file (*** Delete File:) — then just forget it.
    if (!existsSync(entry.absPath)) return
    const utf8Text = readFileSync(entry.absPath, "utf-8")
    writeFileSync(entry.absPath, iconv.encode(utf8Text, entry.encoding))
    const after = countReplacementChars(readFileSync(entry.absPath))
    if (after > entry.badChars) {
      logError(`ALERTA ${entry.absPath}: ${after - entry.badChars} acento(s) viraram ? - revise o diff antes de commitar`)
    }
  } catch (err) {
    logError(`failed to convert back to ${entry.encoding}: ${(err as Error).message}`)
  }
}

export default Plugin.define({
  id: "encoding-auto",
  setup(ctx) {
    ctx.tool.hook("execute.before", (event) => {
      const input = event.input as Record<string, unknown>

      // Force UTF-8 console on Windows so shell output is not mojibake.
      // Guarded: only when the shell is PowerShell (see header note).
      const toolName = shortToolName(event.tool)
      if (toolName === "bash" || toolName === "shell") {
        const shell = typeof process.env["SHELL"] === "string" ? process.env["SHELL"] : ""
        if (/powershell|pwsh/i.test(shell)) {
          const cmd = typeof input.command === "string" ? input.command : ""
          const prefix =
            "[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; [Console]::InputEncoding = [System.Text.Encoding]::UTF8; "
          if (cmd && !cmd.startsWith(prefix)) input.command = prefix + cmd
        }
      }

      // Convert non-UTF-8 files to UTF-8 on disk before edit/write runs.
      if (isWriteTool(event.tool)) {
        for (const p of collectWritePaths(input)) {
          try {
            convertToUtf8(toAbsolutePath(p))
          } catch (err) {
            logError(`failed to convert to UTF-8: ${(err as Error).message}`)
          }
        }
      }
    })

    ctx.tool.hook("execute.after", (event) => {
      const input = event.input as Record<string, unknown>

      // Re-format read output detecting the original encoding.
      if (event.status === "completed" && shortToolName(event.tool) === "read") {
        const filePath = hookFilePath(input)
        if (!filePath || !isTextFile(filePath)) return
        try {
          const { formatted } = readFileWithEncoding(
            filePath,
            typeof input.offset === "number" ? input.offset : undefined,
            typeof input.limit === "number" ? input.limit : undefined,
          )
          event.result = { ...event.result, content: [{ type: "text", text: formatted }] }
        } catch (err) {
          logError(`failed to read with encoding detection: ${(err as Error).message}`)
        }
      }

      // Convert files back to their original encoding after edit/write.
      // Runs on error too: otherwise a failed tool would leave the file as
      // UTF-8 on disk (the before-hook already converted it).
      if (isWriteTool(event.tool)) {
        for (const p of collectWritePaths(input)) {
          restoreEncoding(toAbsolutePath(p))
        }
      }
    })
  },
})
