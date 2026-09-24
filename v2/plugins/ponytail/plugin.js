// ponytail — opencode V2 plugin (Sky port of @dietrichgebert/ponytail v4.7.3)
//
// Injects the ponytail minimal-code ruleset into every chat's system prompt at
// the active intensity, persists /ponytail mode switches, and registers the
// slash commands so they work when installed from this directory. Reuses the
// upstream shared instruction builder (hooks/) and a mode-change parser
// (ponytail-parse.cjs) modeled on the caveman port.
//
// Layout once installed:
//   ~/.config/opencode/plugins/ponytail/
//   ├── package.json
//   ├── plugin.js                    ← this file (index.js is a byte-identical copy)
//   ├── ponytail-parse.cjs           ← mode-change parser (testable standalone)
//   ├── hooks/
//   │   ├── ponytail-config.cjs      ← upstream, vendored (CJS)
//   │   └── ponytail-instructions.cjs← upstream, vendored (CJS)
//   ├── skills/ponytail/SKILL.md     ← upstream ruleset (read by the instructions builder)
//   └── command/*.md                 ← slash-command templates (registered in setup)
//
// V1 → V2 hook mapping (opencode 2.x plugin API):
//   - V1 `config` hook (command registration)     → ctx.command.transform()
//   - V1 `experimental.chat.system.transform`     → ctx.session.hook("context")
//     (system is now an array of content blocks { type: 'text', text } instead
//     of a string[]; the context hook runs immediately before every agent model
//     request and edits event.system in place.)
//   - V1 `command.execute.before` (/ponytail <level>) → ctx.session.hook("prompt")
//     (V2 expands a typed /ponytail <level> into the command file's prose
//     before the prompt hook runs, so the parser recovers the level from the
//     template's fixed first line — same mechanism as the caveman port.)
//
// Mode state lives in the same flag file upstream uses:
//   ~/.config/opencode/.ponytail-active
//
// The V2 default export is a plain object with a stable `id` and `setup(ctx)`;
// no import of @opencode/plugin is required for local plugins.

import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { basename, dirname, join } from 'node:path';
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));

// Loaded by evaluating the file as CommonJS by hand, NOT via the module
// loader: opencode runs plugins inside a compiled runtime where require() of
// on-disk files can be rejected and await import() of a CJS file yields an
// empty namespace — both silently break the plugin. createRequire() still
// resolves node BUILT-INS and relative paths fine, which is all these helpers
// need (fs/path/os). Same trick as the caveman port.
function loadCjs(rel) {
  const target = join(here, rel);
  const code = readFileSync(target, 'utf8').replace(/^#![^\n]*\n/, '');
  const mod = { exports: {} };
  new Function('module', 'exports', 'require', '__dirname', '__filename', code)(
    mod, mod.exports, createRequire(pathToFileURL(target).href), dirname(target), target
  );
  return mod.exports;
}

const { getPonytailInstructions } = loadCjs('hooks/ponytail-instructions.cjs');
const { getDefaultMode, normalizePersistedMode } = loadCjs('hooks/ponytail-config.cjs');
const { parseModeChange } = loadCjs('ponytail-parse.cjs');

// opencode resolves its config dir from $XDG_CONFIG_HOME, else ~/.config/opencode
// on every platform — including Windows, where it uses %USERPROFILE%\.config\opencode
// (NOT %APPDATA%). os.homedir() is %USERPROFILE% on win32, so the default branch
// is already correct cross-platform.
function opencodeConfigDir() {
  if (process.env.XDG_CONFIG_HOME) {
    return path.join(process.env.XDG_CONFIG_HOME, 'opencode');
  }
  return path.join(os.homedir(), '.config', 'opencode');
}

const statePath = path.join(opencodeConfigDir(), '.ponytail-active');

function readMode() {
  try {
    return normalizePersistedMode(readFileSync(statePath, 'utf8').trim()) || getDefaultMode();
  } catch (error) {
    return getDefaultMode();
  }
}

function writeMode(mode) {
  mkdirSync(dirname(statePath), { recursive: true });
  writeFileSync(statePath, mode);
}

// Parse a slash-command markdown file (frontmatter description + body template)
// — mirrors upstream's parseCommandFile.
function parseCommandFile(filePath) {
  try {
    const content = readFileSync(filePath, 'utf8');
    const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) return null;
    const description = match[1].match(/description:\s*(.+)/)?.[1]?.trim();
    return { description, template: match[2].trim() };
  } catch (error) {
    return null;
  }
}

export default {
  id: 'ponytail',
  async setup(ctx) {
    // Register /ponytail, /ponytail-review, /ponytail-audit, /ponytail-debt and
    // /ponytail-help from the vendored command/ dir (mirrors the V1 config hook,
    // which read the same files out of the npm package).
    //
    // NOTE: the external-plugin command draft in the installed runtime exposes
    // only `add(info)` — NOT `update/remove/list` (verified empirically against
    // the dev source, whose Draft has update/remove; the promise bridge hands
    // the plugin an add-only draft). Register each command with `add`.
    await ctx.command.transform((draft) => {
      let files = [];
      try {
        files = readdirSync(join(here, 'command')).filter((f) => f.endsWith('.md'));
      } catch (error) {
        // command dir missing — graceful no-op, commands just won't register
        return;
      }
      for (const file of files) {
        try {
          const name = basename(file, '.md');
          const parsed = parseCommandFile(join(here, 'command', file));
          if (parsed) {
            draft.add({
              name,
              description: parsed.description,
              template: parsed.template,
            });
          }
        } catch (error) {
          // one bad command file must not take down the plugin
        }
      }
    });

    // Persist `/ponytail <level>` switches (the prompt hook sees the expanded
    // template — "Switch to ponytail mode: ultra" — and recovers the level),
    // plus the documented natural-language deactivation: "stop ponytail" or
    // "normal mode".
    await ctx.session.hook('prompt', (event) => {
      const text = event.prompt?.text;
      if (!text) return;
      const change = parseModeChange(text, { getDefaultMode });
      if (!change) return;
      if (change.clear) {
        writeMode('off');
      } else if (change.set) {
        writeMode(change.set);
      }
    });

    // Inject the ruleset into the system context when ponytail is active. The
    // V2 "context" hook runs immediately before each agent model request;
    // event.system is an array of content blocks, so append a
    // { type: 'text', text } block instead of a bare string.
    // Idempotent: opencode rebuilds event.system per request, but if it ever
    // reuses the array across turns an unguarded append grows the system
    // context without bound. Rewrite any block we already left (detected by
    // its "PONYTAIL MODE ACTIVE — level:" prefix) instead of stacking another,
    // so a mode switch updates in place rather than accumulating.
    await ctx.session.hook('context', (event) => {
      const mode = readMode();
      if (mode === 'off') return;
      const text = getPonytailInstructions(mode);
      const sys = event.system;
      if (!Array.isArray(sys)) return;

      const marker = /^PONYTAIL MODE ACTIVE — level: [a-z-]+/;
      let found = false;
      for (let i = 0; i < sys.length; i++) {
        const block = sys[i];
        const blockText = typeof block === 'string' ? block : block?.text;
        if (typeof blockText === 'string' && marker.test(blockText)) {
          if (typeof block === 'string') {
            sys[i] = text;
          } else {
            block.text = text;
          }
          found = true;
        }
      }
      if (found) return;

      sys.push({ type: 'text', text });
    });
  },
};