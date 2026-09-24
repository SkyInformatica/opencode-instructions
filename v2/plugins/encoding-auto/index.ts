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
import chardet from "chardet"
import iconv from "iconv-lite"
import { existsSync, readFileSync, statSync, writeFileSync } from "node:fs"
import { Plugin } from "@opencode/plugin"

// NOTE: iso-8859-1/-15 and windows-1252 intentionally excluded (Sky adjustment).
const UTF8_ENCODINGS = ["utf-8", "ascii", "utf-16le", "utf-16be"]

const BINARY_EXTS = [
  ".png", ".jpg", ".jpeg", ".gif", ".bmp", ".ico", ".webp", ".pdf",
  ".zip", ".rar", ".7z", ".gz", ".tar", ".exe", ".dll", ".so", ".dylib",
  ".class", ".jar", ".war", ".bin", ".dat", ".db", ".sqlite",
  ".mp3", ".mp4", ".avi", ".mov", ".mkv", ".wav", ".flac", ".ogg",
]

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

export function getEncodingForFile(filePath: string): string {
  if (!existsSync(filePath)) return "utf-8"
  try {
    return detectEncoding(readFileSync(filePath))
  } catch {
    return "utf-8"
  }
}

// Files temporarily converted to UTF-8 before edit/write, mapped back to their
// original encoding after the tool runs.
const convertedFiles = new Map<string, string>()

export default Plugin.define({
  id: "encoding-auto",
  setup(ctx) {
    ctx.tool.hook("execute.before", (event) => {
      const input = event.input as Record<string, unknown>

      // Force UTF-8 console on Windows so bash output is not mojibake.
      if (event.tool === "bash" || event.tool === "shell") {
        const cmd = typeof input.command === "string" ? input.command : ""
        const prefix =
          "[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; [Console]::InputEncoding = [System.Text.Encoding]::UTF8; "
        if (cmd && !cmd.startsWith(prefix)) input.command = prefix + cmd
      }

      // Convert non-UTF-8 files to UTF-8 on disk before edit/write runs.
      if (event.tool === "edit" || event.tool === "write" || event.tool === "patch") {
        const filePath = typeof input.filePath === "string" ? input.filePath : undefined
        if (filePath && isTextFile(filePath)) {
          const encoding = getEncodingForFile(filePath)
          if (!isUtf8Like(encoding)) {
            convertedFiles.set(filePath, encoding)
            const buffer = readFileSync(filePath)
            writeFileSync(filePath, iconv.decode(buffer, encoding), "utf-8")
          }
        }
      }
    })

    ctx.tool.hook("execute.after", (event) => {
      if (event.status !== "completed") return
      const input = event.input as Record<string, unknown>

      // Re-format read output detecting the original encoding.
      if (event.tool === "read") {
        const filePath = typeof input.filePath === "string" ? input.filePath : undefined
        if (!filePath || !isTextFile(filePath)) return
        try {
          const { formatted } = readFileWithEncoding(
            filePath,
            typeof input.offset === "number" ? input.offset : undefined,
            typeof input.limit === "number" ? input.limit : undefined,
          )
          event.result = { ...event.result, content: [{ type: "text", text: formatted }] }
        } catch (err) {
          console.error(`[encoding-auto] failed to read with encoding detection: ${(err as Error).message}`)
        }
      }

      // Convert the file back to its original encoding after edit/write.
      if (event.tool === "edit" || event.tool === "write" || event.tool === "patch") {
        const filePath = typeof input.filePath === "string" ? input.filePath : undefined
        if (!filePath) return
        const encoding = convertedFiles.get(filePath)
        if (encoding) {
          try {
            const utf8Text = readFileSync(filePath, "utf-8")
            writeFileSync(filePath, iconv.encode(utf8Text, encoding))
            convertedFiles.delete(filePath)
          } catch (err) {
            console.error(`[encoding-auto] failed to convert back to ${encoding}: ${(err as Error).message}`)
          }
        }
      }
    })

    console.log("[encoding-auto] loaded (V2)")
  },
})