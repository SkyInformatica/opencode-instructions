---
name: OpenCode Usage Leaderboard
description: Build OpenCode Console usage leaderboards by member and model for any supported period (24h, 7d, 30d, all), with token share, requests, cost, average cost per request, and optional Google Chat cards.
---

# OpenCode Console usage leaderboard

Use this skill when the user asks for an OpenCode Console usage report or leaderboard by member or model, a Google Chat preview, or delivery to a Google Chat incoming webhook. Default period is the last seven days.

## Pick the period

`opencode_console.get_member_usage` and `get_usage` accept only `24h`, `7d`, `30d`, `all`. Map the request:

| Ask | Range | Meaning |
| --- | --- | --- |
| "semana", "semanal", "7 dias", "última semana", nothing said | `7d` | rolling last 7 days |
| "mês", "mensal", "30 dias" | `30d` | rolling last 30 days |
| "24h", "últimas 24 horas", "hoje" | `24h` | rolling last 24 hours |
| "tudo", "desde o início", "histórico" | `all` | everything the Console retains |

The Console has no calendar windows: "semana atual", "mês atual", "mês anterior", "outubro" and any explicit date range are **not** available. Say so in one line, then offer the nearest rolling window (`7d` or `30d`) and proceed with it. Do not fake a calendar period by subtracting two calls.

Always name the period in the report as rolling, with the range code: "últimos 7 dias (7d)".

## Collect usage

1. Call `opencode_console.get_context` first. Confirm the active workspace and role.
2. Call `opencode_console.list_members` and fetch every page.
3. Call `opencode_console.get_member_usage({user_id, range})` for each member with the chosen range. Use `execute` with `tools.opencode_console` when batching these calls.
4. Refresh the data immediately before publishing a report or sending cards.

## Calculate leaderboards

### Members

- Total tokens = `input_tokens + output_tokens + cache_read_tokens + cache_write_tokens`.
- Team token total = sum of member totals.
- Token share = member total / team token total × 100.
- Rank members by total tokens, descending. Show top 10, token volume in millions, share of team tokens, and `cost_usd`.
- State that cache-read and cache-write tokens are included.

### Models

- Group each member's `models` entries by both `provider` and `model`.
- Sum `requests` and `cost_usd` per group.
- Count distinct members whose returned model list contains that model.
- Average cost per request = aggregated model cost / aggregated model requests. Use zero when request count is zero.
- Rank by cost, descending — that is what the card script sorts by. Rank by requests only when the user asks for it.
- Show top 10 with model, cost, requests, users, and average cost per request.
- Do not infer or allocate tokens by model. The MCP returns token totals per member, not per model.
- Important: `models` contains up to 10 highest-cost models per member. Aggregated model rankings, costs, and user counts can omit other models or users. Label this coverage limitation; do not present the model user count as guaranteed complete.

## Build the cards

1. Write a snapshot to a temp path (never into a repo or the skill directory):

```json
{
  "workspace": "Sky Informatica",
  "range": "7d",
  "members": [{"email": "a@b.c", "tokens": 123456789, "cost_usd": 1.23}],
  "models":  [{"provider": "opencode", "model": "x", "cost_usd": 1.23, "requests": 10, "members": 3}]
}
```

- `members[].tokens` = `input_tokens + output_tokens + cache_read_tokens + cache_write_tokens`.
- `models[].members` = count of members whose returned `models` list contains that provider+model pair.
- Only `members` or only `models` is fine; the script builds whichever is present.

2. Build the payload with the script in this skill's `scripts/` directory:

```bash
python3 ~/.config/opencode/skills/opencode-usage-leaderboard/scripts/build_cards.py \
  "$TMP/usage-raw.json" --out "$TMP/gchat-cards.json"
```

- `range` in the snapshot is the Console code (`24h`, `7d`, `30d`, `all`); the script prints the label on the cards ("últimos 7 dias", "últimos 30 dias", ...). An unknown value passes through unchanged.
- `--top N` (default 10), `--members-only`, `--models-only`.
- Both cards go in one message (`cardsV2` with 2 entries). The script asserts the Chat limits: at most 2 `columnItems` per `columns` widget and 100 widgets per section. Chat has no table, `pre` or monospace widget, so each line is a 2-column row; only `<b>`, `<i>`, `<u>`, `<s>`, `<a>`, `<font color>`, `<br>` and the list tags render. There is no font-size, CSS or style field: the size comes from the Chat client.
- Each row sets `horizontalSizeStyle: FILL_MINIMUM_SPACE` on the left column (rank and name) and `FILL_AVAILABLE_SPACE` on the right one (values), so the name never squeezes the numbers. Keep the value string at about 30 characters; past that it wraps to a second line. Percentages use one decimal for this reason.
- To avoid wrapping altogether, use `decoratedText` with `wrapText: true` (its `text` truncates without it, and `topLabel` always truncates), or a `grid` widget when more than 2 columns are wanted.
- It prints the output path and the widget count. A failed assert means the payload would be rejected.

## Preview

- For a visual preview, render the same two cards with `openchamber_render` when available.
- Preview never sends anything.

## Send, only when a webhook URL is passed

- The URL arrives from the user at send time, or from `GOOGLE_CHAT_WEBHOOK_URL` in the environment. Treat it as a secret: never write it into a file, the skill, a report, a commit or a chat message, and never echo it.
- If no URL is passed, stop after build and preview. Do not send, and do not guess a URL.
- Confirm once with the user before posting, because the cards carry member names and usage.
- Refresh the usage data immediately before sending, then rebuild the payload.

```bash
curl -sS -o /dev/null -w '%{http_code}\n' -X POST \
  -H 'Content-Type: application/json' \
  --data-binary @"$TMP/gchat-cards.json" \
  "$GOOGLE_CHAT_WEBHOOK_URL"
```

- A 2xx status means delivered. Report the status and a one-line summary of what was posted; nothing else about the URL.
- Two separate messages only when the user asks: rebuild with `--members-only` and `--models-only` and POST each file.
- On failure, report the HTTP status and the redacted error. Do not retry in a loop; a 400 usually means the payload violates a Chat limit.

## Presentation

- Use the user's language and locale. Format token millions and percentages clearly; label cost as USD (`US$`).
- Distinguish measured data from unavailable data. Mention the rolling date range, workspace, and model-list limitation.
- Do not expose internal user IDs. Use member names or email prefixes only when no display name exists.
