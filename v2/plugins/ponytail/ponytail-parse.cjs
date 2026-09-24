#!/usr/bin/env node
// ponytail — shared mode-change parser (Sky port)
//
// Single source of truth for interpreting a user prompt as a ponytail mode
// change. Modeled on the caveman parser (caveman-parse.cjs) so both plugins in
// the Sky distribution behave the same way: same quote-blanking, same
// expanded-template recovery, same natural-language deactivation rules.
//
// parseModeChange(prompt, { getDefaultMode, unwrapQuotes })
//   → { set: mode }   — caller should persist `mode` (off/lite/full/ultra/review)
//   → { clear: true } — caller should deactivate (persist 'off')
//   → null            — prompt does not change state
//
// Options:
//   getDefaultMode — () => resolved default mode string (from ponytail-config).
//   unwrapQuotes   — strip a single layer of matching quote characters wrapping
//                    the whole prompt (opencode's non-interactive `run` path
//                    delivers messages this way).
//
// V2 expansion note: opencode replaces a typed "/ponytail <level>" with the
// command file's prose before the prompt hook runs, so the literal slash
// command never reaches this parser. The vendored ponytail.md template starts
// with the fixed first line "Switch to ponytail mode: $ARGUMENTS" — the level
// is recovered from that first line (like caveman's "Activate caveman mode:").

let ponytailConfig;
try {
  ponytailConfig = require('./hooks/ponytail-config.cjs');
} catch (e) {
  ponytailConfig = require('../hooks/ponytail-config.cjs');
}
const { getDefaultMode: configDefaultMode, normalizePersistedMode } = ponytailConfig;

// Natural-language triggers run over the whole prompt, so any pasted text that
// merely QUOTES them fired them. Blank quoted spans before matching — same
// policy as the caveman parser. Only " and ` count as delimiters; apostrophes
// are far too common in ordinary English to pair on.
const QUOTED_SPAN_REGEX = /(["`])(?:(?!\1).)*\1/g;

// A mode argument with punctuation glued to it ("/ponytail ultra; still
// verbose") would otherwise match no mode. Modes are [a-z-] only, so stripping
// every trailing character outside that class is safe. Trailing punctuation
// only; a leading quote or bracket is stripped too so '/ponytail "off"' works.
function normalizeModeArg(arg) {
  return (arg || '').replace(/^[^a-z0-9]+/, '').replace(/[^a-z0-9-]+$/, '');
}

// Resolve a /ponytail argument to a verdict. An argument that resolves to
// nothing returns null (no state change): the user asked for something
// ponytail can't do; never silently switch to the default.
function resolveModeArg(rawArg, getDefaultMode) {
  const arg = normalizeModeArg(rawArg);
  if (!arg) {
    // A genuinely ABSENT argument means "bare /ponytail → activate at the
    // default". An argument that was present but normalized away is punctuation
    // (/ponytail ? — plausibly someone asking for help) — no state change.
    if (rawArg) return null;
    const mode = getDefaultMode();
    return mode === 'off' ? { clear: true } : { set: mode };
  }
  const mode = normalizePersistedMode(arg);
  return mode ? { set: mode } : null;
}

function parseModeChange(promptRaw, options) {
  options = options || {};
  const getDefaultMode = options.getDefaultMode || configDefaultMode;

  let prompt = (promptRaw || '').trim();
  if (options.unwrapQuotes) {
    const wrapped = /^(["'`])([\s\S]*)\1$/.exec(prompt);
    if (wrapped) prompt = wrapped[2].trim();
  }
  // Capture the first line before whitespace collapse: the expanded ponytail.md
  // template puts $ARGUMENTS at the end of the fixed first line, and collapsing
  // would merge an EMPTY argument into the boilerplate below it.
  const firstLine = prompt.toLowerCase().split(/\r?\n/, 1)[0];
  // Collapse whitespace so phrase triggers still match multiline prompts.
  prompt = prompt.toLowerCase().replace(/\s+/g, ' ');
  if (!prompt) return null;

  // A prompt that starts with a slash is a foreign command invocation; its own
  // text must not toggle our mode.
  const naturalLanguage = !prompt.startsWith('/');
  const nlPrompt = naturalLanguage ? prompt.replace(QUOTED_SPAN_REGEX, ' ') : '';

  // opencode expands a typed "/ponytail <level>" into the command file's prose
  // before the prompt hook fires. Recover the level from the template's fixed
  // first line instead of the literal slash command (which never reaches us).
  // Checked BEFORE the natural-language rules: the expanded template for
  // "/ponytail off" (first line "Switch to ponytail mode: off") must resolve to
  // a mode write, and a template-shaped line with an unrecognized level must be
  // a no-op — never a side effect of the NL phrases below.
  const tpl = /^switch to ponytail mode:[ \t]*(\S*)/.exec(firstLine);
  if (tpl) return resolveModeArg(tpl[1], getDefaultMode);

  // Deactivation intent — covers the documented exits: "stop ponytail",
  // "normal mode", "/ponytail off". "normal mode" counts as a bare command
  // (prompt-initial, optionally led by a switch-back verb chain) or with
  // ponytail context — never mid-sentence for e.g. vim's normal mode. Quotes
  // blank "stop ponytail" / "normal mode" when they appear inside our own
  // command files' prose, so running /ponytail-help can't deactivate the mode.
  // Rule 2 requires a word-boundary before "ponytail": the help card's own
  // "or /ponytail off" instruction must not fire it.
  const wantsOff = naturalLanguage && (
    /\b(stop|disable|deactivate|turn\s+off|exit|quit)\s+(the\s+)?ponytail\b/.test(nlPrompt) ||
    /(^|[\s])ponytail(\s+mode)?[\s:]+(off|stop|disabled?)\b/.test(nlPrompt) ||
    /^(please\s+)?(go\s+)?(back\s+to\s+|switch\s+(back\s+)?to\s+|return\s+to\s+|to\s+)?normal\s+mode\b/.test(nlPrompt) ||
    (/\bnormal\s+mode\b/.test(nlPrompt) && /\bponytail\b/.test(nlPrompt))
  );
  if (wantsOff) return { clear: true };

  return null;
}

module.exports = {
  normalizeModeArg,
  parseModeChange,
  resolveModeArg,
};