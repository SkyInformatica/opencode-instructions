#!/usr/bin/env python3
"""Build the two Google Chat cards (members, models) from a usage snapshot.

Input JSON (written by the agent after calling the opencode_console tools):

{
  "workspace": "Sky Informatica",
  "range": "7d",
  "members": [{"email": "a@b.c", "tokens": 123, "cost_usd": 1.23}, ...],
  "models":  [{"provider": "opencode", "model": "x", "cost_usd": 1.23,
               "requests": 10, "members": 3}, ...]
}

Output: a cardsV2 payload ready to POST to a Google Chat incoming webhook.

    python3 build_cards.py usage-raw.json --out gchat-cards.json
    python3 build_cards.py usage-raw.json --top 15
    python3 build_cards.py usage-raw.json --members-only   # or --models-only
"""

import argparse
import json
import sys

# Google Chat allows at most 2 columns per `columns` widget and 100 widgets per section.
MAX_COLUMNS = 2
MAX_WIDGETS = 100

# Console range codes -> card label. An unknown value is shown as given.
RANGE_LABELS = {
    "24h": "\u00faltimas 24 horas",
    "7d": "\u00faltimos 7 dias",
    "30d": "\u00faltimos 30 dias",
    "all": "todo o per\u00edodo",
}


def range_label(raw):
    return RANGE_LABELS.get(raw, raw)


def br(number, digits=2):
    """1234.5 -> '1.234,5'"""
    return f"{number:,.{digits}f}".replace(",", "@").replace(".", ",").replace("@", ".")


def count(number):
    return f"{number:,}".replace(",", ".")


def row(left, right):
    """Two columns: the left one shrinks to its content, the right one gets the rest."""
    return {
        "columns": {
            "columnItems": [
                {
                    "horizontalSizeStyle": "FILL_MINIMUM_SPACE",
                    "verticalAlignment": "CENTER",
                    "widgets": [{"textParagraph": {"text": left}}],
                },
                {
                    "horizontalSizeStyle": "FILL_AVAILABLE_SPACE",
                    "verticalAlignment": "CENTER",
                    "widgets": [{"textParagraph": {"text": right}}],
                },
            ]
        }
    }


def card(card_id, title, subtitle, section_header, head_left, head_right, rows):
    return {
        "cardId": card_id,
        "card": {
            "header": {"title": title, "subtitle": subtitle},
            "sections": [
                {
                    "header": section_header,
                    "widgets": [
                        row(f"<b>{head_left}</b>", f"<b>{head_right}</b>"),
                        {"divider": {}},
                        *rows,
                    ],
                }
            ],
        },
    }


def members_card(snapshot, top):
    members = sorted(snapshot["members"], key=lambda m: -m["tokens"])
    total = sum(m["tokens"] for m in members)
    total_usd = sum(m["cost_usd"] for m in members)
    active = sum(1 for m in members if m["tokens"] > 0)
    rows = []
    for i, m in enumerate(members[:top], 1):
        pct = 100 * m["tokens"] / total if total else 0
        usd = "US$ 0" if m["cost_usd"] == 0 else f"US$ {br(m['cost_usd'])}"
        rows.append(
            row(
                f"<b>{i}. {m['email'].split('@')[0]}</b>",
                f"{br(m['tokens'] / 1e6, 1)} M \u00b7 {br(pct, 1)}% \u00b7 {usd}",
            )
        )
    subtitle = (
        f"{snapshot['workspace']} \u00b7 {br(total / 1e9)} B tokens \u00b7 "
        f"US$ {br(total_usd)} \u00b7 {active} de {len(members)} membros ativos"
    )
    return card(
        "ranking-membros",
        f"Ranking de membros \u2014 {snapshot['range']}",
        subtitle,
        f"Top {min(top, len(members))} por milh\u00e3o de tokens",
        "Membro",
        "M tokens \u00b7 % do total \u00b7 US$",
        rows,
    )


def models_card(snapshot, top):
    models = sorted(snapshot["models"], key=lambda m: -m["cost_usd"])
    total_usd = sum(m["cost_usd"] for m in models)
    total_req = sum(m["requests"] for m in models)
    free = sum(1 for m in models if m["cost_usd"] == 0)
    rows = []
    for i, m in enumerate(models[:top], 1):
        pct = 100 * m["cost_usd"] / total_usd if total_usd else 0
        if m["cost_usd"] == 0:
            value = (
                f"US$ 0 \u00b7 0% \u00b7 {count(m['requests'])} \u00b7 {m['members']}"
                " \u00b7 <font color=\"#9aa0a6\">free</font>"
            )
        else:
            value = (
                f"US$ {br(m['cost_usd'])} \u00b7 {br(pct, 1)}% \u00b7 "
                f"{count(m['requests'])} \u00b7 {m['members']}"
            )
        rows.append(row(f"<b>{i}. {m['model']}</b>", value))
    subtitle = (
        f"provider {snapshot['models'][0]['provider'] if snapshot['models'] else '?'} \u00b7 "
        f"US$ {br(total_usd)} \u00b7 {count(total_req)} requests \u00b7 "
        f"{len(models)} modelos, {free} free"
    )
    return card(
        "ranking-modelos",
        f"Ranking de modelos \u2014 {snapshot['range']}",
        subtitle,
        f"Top {min(top, len(models))} por custo \u2014 o Console n\u00e3o exp\u00f5e tokens por modelo",
        "Modelo",
        "US$ \u00b7 % do custo \u00b7 requests \u00b7 membros",
        rows,
    )


def validate(payload):
    for entry in payload["cardsV2"]:
        for section in entry["card"]["sections"]:
            assert len(section["widgets"]) <= MAX_WIDGETS, "section widget limit"
            for widget in section["widgets"]:
                if "columns" in widget:
                    n = len(widget["columns"]["columnItems"])
                    assert n <= MAX_COLUMNS, f"{n} columns, Chat allows {MAX_COLUMNS}"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("snapshot")
    ap.add_argument("--out", default="gchat-cards.json")
    ap.add_argument("--top", type=int, default=10)
    ap.add_argument("--members-only", action="store_true")
    ap.add_argument("--models-only", action="store_true")
    args = ap.parse_args()

    with open(args.snapshot) as fh:
        snapshot = json.load(fh)
    snapshot.setdefault("workspace", "workspace")
    snapshot.setdefault("range", "7d")
    snapshot["range"] = range_label(snapshot["range"])

    cards = []
    if not args.models_only and snapshot.get("members"):
        cards.append(members_card(snapshot, args.top))
    if not args.members_only and snapshot.get("models"):
        cards.append(models_card(snapshot, args.top))
    if not cards:
        sys.exit("snapshot has neither members nor models")

    payload = {"cardsV2": cards}
    validate(payload)
    with open(args.out, "w") as fh:
        json.dump(payload, fh, ensure_ascii=False, indent=2)
    print(f"{args.out}: {len(cards)} card(s), widgets={[len(c['card']['sections'][0]['widgets']) for c in cards]}")


if __name__ == "__main__":
    main()
