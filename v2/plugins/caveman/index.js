// caveman — opencode V2 plugin
//
// Provides dynamic caveman mode tracking for opencode:
// - Writes the mode flag on each session start (via the `event` subscription)
// - Parses user prompts for /caveman commands and natural-language toggles
// - Injects per-turn reinforcement into the system context
//
// Bun ESM module; loads the existing security-hardened helpers from
// caveman-config.cjs via createRequire so the symlink-safe flag-write code
// lives in one place. Same trick loads caveman-parse.cjs (#602) so the mode-
// change parsing is a single shared source with caveman-mode-tracker.js.
//
// Layout once installed:
//   ~/.config/opencode/plugins/caveman/
//   ├── package.json
//   ├── plugin.js              ← this file
//   ├── caveman-config.cjs     ← copied sibling of src/hooks/caveman-config.js
//   └── caveman-parse.cjs      ← copied sibling of src/hooks/caveman-parse.js
//
// The always-on caveman ruleset is provided separately via
// ~/.config/opencode/AGENTS.md (Tier-3 base). This plugin handles dynamic
// state only: flag writes, slash-command parsing, natural-language
// activation, and per-turn reinforcement.
//
// V1 → V2 hook mapping (opencode 2.x plugin API):
//   - V1 `event` (event.type === 'session.created')  → ctx.event.subscribe()
//   - V1 `chat.message`                              → ctx.session.hook("prompt")
//   - V1 `experimental.chat.system.transform`        → ctx.session.hook("context")
//     (system is now an array of content blocks { type: 'text', text } instead
//     of a string[]; the context hook runs immediately before every agent model
//     request and edits event.system in place.)
//
// The V2 default export is a plain object with a stable `id` and `setup(ctx)`;
// no import of @opencode/plugin is required for local plugins.

import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
import { existsSync, unlinkSync, readFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));

// Loaded by evaluating the file as CommonJS by hand, NOT via the module
// loader: opencode runs plugins inside a compiled runtime where
// require() of on-disk files can be rejected ("require() async module is
// unsupported") and await import() of a CJS file yields an empty namespace —
// both silently break the plugin (#418 follow-up). createRequire() still
// resolves node BUILT-INS fine, which is all caveman-config needs (fs/path/os).
function loadConfig() {
  const installed = join(here, 'caveman-config.cjs');
  const dev = join(here, '..', '..', 'hooks', 'caveman-config.js');
  const target = existsSync(installed) ? installed : dev;
  const code = readFileSync(target, 'utf8').replace(/^#![^\n]*\n/, '');
  const mod = { exports: {} };
  // Base require on the loaded file, not plugin.js — caveman-parse.js does a
  // relative require('./caveman-config') that must resolve against src/hooks/
  // in the dev layout and against pluginDir when installed.
  new Function('module', 'exports', 'require', '__dirname', '__filename', code)(
    mod, mod.exports, createRequire(pathToFileURL(target).href), dirname(target), target
  );
  return mod.exports;
}
const config = loadConfig();

const { getDefaultMode, safeWriteFlag, readFlag } = config;

// Load the shared mode-change parser (#602) the same way loadConfig() loads
// caveman-config.cjs — see the doc comment above loadConfig() for why this
// can't go through require()/import() in a compiled runtime.
function loadParse() {
  const installed = join(here, 'caveman-parse.cjs');
  const dev = join(here, '..', '..', 'hooks', 'caveman-parse.js');
  const target = existsSync(installed) ? installed : dev;
  const code = readFileSync(target, 'utf8').replace(/^#![^\n]*\n/, '');
  const mod = { exports: {} };
  new Function('module', 'exports', 'require', '__dirname', '__filename', code)(
    mod, mod.exports, createRequire(pathToFileURL(target).href), dirname(target), target
  );
  return mod.exports;
}
const { parseModeChange, INDEPENDENT_MODES } = loadParse();

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

const flagPath = path.join(opencodeConfigDir(), '.caveman-active');

function removeFlag() {
  try {
    unlinkSync(flagPath);
  } catch (error) {
    if (process.env.CAVEMAN_DEBUG === '1' && error.code !== 'ENOENT') {
      console.error(`caveman: failed to remove flag ${flagPath}: ${error.message}`);
    }
  }
}

function reinforcementLine(mode) {
  return 'CAVEMAN MODE ACTIVE (' + mode + ') — session ruleset applies.';
}

function applyModeChange(change) {
  if (!change) return;
  if (change.action === 'clear') {
    removeFlag();
    return;
  }
  if (change.action === 'set' && change.mode) {
    safeWriteFlag(flagPath, change.mode);
  }
}

// Session-start logic — extracted so the `event` subscription (opencode 2.x)
// drives one shared implementation. Re-fires on every `session.created` event,
// so a new session in a long-lived plugin process re-asserts the flag.
function handleSessionCreated() {
  const mode = getDefaultMode();
  if (mode === 'off') {
    removeFlag();
    return;
  }
  safeWriteFlag(flagPath, mode);
}

export default {
  id: 'caveman',
  async setup(ctx) {
    // Assert the flag at plugin load as well: in one-shot `opencode run` the
    // first session.created publishes before plugin event dispatch is wired,
    // so the event subscription alone misses it. The setup-time write covers
    // that race; the event subscription re-asserts on every later session.
    handleSessionCreated();

    const controller = new AbortController();

    // opencode 2.x dispatches session/lifecycle events through the public
    // event stream. Re-assert the flag on every new session, not just once
    // when the plugin module loads.
    void (async () => {
      try {
        for await (const event of ctx.event.subscribe({ signal: controller.signal })) {
          if (event.type === 'session.created') handleSessionCreated();
        }
      } catch (error) {
        // Aborting the subscription rejects with AbortError on cleanup; real
        // stream failures should surface in the log but never crash the loop.
        if (process.env.CAVEMAN_DEBUG === '1' && !(error instanceof Error && error.name === 'AbortError')) {
          console.error(`caveman: event subscription failed: ${error.message}`);
        }
      }
    })();

    // Intercept incoming user prompts to detect /caveman commands and
    // natural-language mode toggles. The V2 "prompt" hook runs once at
    // admission with event.prompt.text; state changes happen via the flag file.
    // expandedTpl: opencode replaces a typed slash command with its command
    // file's prose before this hook sees it. unwrapQuotes: the non-interactive
    // `run` path delivers the message wrapped in literal quote characters.
    await ctx.session.hook('prompt', (event) => {
      const text = event.prompt?.text;
      if (!text) return;
      const change = parseModeChange(text, { getDefaultMode, expandedTpl: true, unwrapQuotes: true });
      if (change) applyModeChange(change);
    });

    // Inject the reinforcement line into the system context when caveman is
    // active. The V2 "context" hook runs immediately before each agent model
    // request; event.system is an array of content blocks, so append a
    // { type: 'text', text } block instead of a bare string.
    // Idempotent: opencode rebuilds event.system per request, but if it ever
    // reuses the array across turns an unguarded append grows the system
    // context without bound — silently eating the context window. Rewrite any
    // block we already left instead of stacking another, so a mode switch
    // updates in place rather than accumulating.
    await ctx.session.hook('context', (event) => {
      const active = readFlag(flagPath);
      if (!active || INDEPENDENT_MODES.has(active)) return;
      const line = reinforcementLine(active);
      const sys = event.system;
      if (!Array.isArray(sys)) return;

      const stale = /CAVEMAN MODE ACTIVE \([a-z-]+\) — session ruleset applies\./g;
      let found = false;
      for (let i = 0; i < sys.length; i++) {
        const block = sys[i];
        const text = typeof block === 'string' ? block : block?.text;
        if (typeof text === 'string' && stale.test(text)) {
          stale.lastIndex = 0;
          if (typeof block === 'string') {
            sys[i] = text.replace(stale, line);
          } else {
            block.text = text.replace(stale, line);
          }
          found = true;
        }
        stale.lastIndex = 0;
      }
      if (found) return;

      if (sys.length > 0) {
        const last = sys[sys.length - 1];
        if (typeof last === 'string') {
          sys[sys.length - 1] = last + '\n\n' + line;
        } else if (last && last.type === 'text' && typeof last.text === 'string') {
          last.text += '\n\n' + line;
        } else {
          sys.push({ type: 'text', text: line });
        }
      } else {
        sys.push({ type: 'text', text: line });
      }
    });

    // Cleanup: stop the event subscription when the plugin unloads. Hook and
    // transform registrations are disposed automatically by the runtime.
    return () => controller.abort();
  },
};