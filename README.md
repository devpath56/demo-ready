# demo-ready

A Claude Code skill that makes a repo demo-presentation ready in two gates:

- **A · repo available** — architecture model drawn from the code (Structurizr DSL, rendered by
  [Drawing Office](https://github.com/devpath56/drawing-office)), a drift check that fails CI when
  code and model disagree, and a GitHub Pages site.
- **B · visual artifacts ready, tested, approved** — an HTML deck in the organizer's colours with a
  synced presenter window, D2 workflow diagrams read from the code, and news/docs screenshots
  captured only after their quotes are found verbatim on the live page.

## Install

```bash
git clone https://github.com/devpath56/demo-ready ~/.claude/skills/demo-ready
```

Update with `git -C ~/.claude/skills/demo-ready pull`.

## Invoke

In any repo, in Claude Code: `/demo-ready`, or say "make this repo demo ready" / "prep the demo" /
"make slides for the demo". Paste the demo script and the organizer's URL with it.

## Needs

| Tool | For | Install |
|---|---|---|
| Node ≥ 18 | every script | — |
| `d2` | diagrams | `brew install d2` |
| Playwright + Chromium | screenshots, palette, deck tests | `npm i -D playwright && npx playwright install chromium` |
| Drawing Office beside the repo, `structurizr-cli`, Graphviz | Gate A | `git clone https://github.com/devpath56/drawing-office ../drawing-office && brew install structurizr-cli graphviz` |
| `gh`, signed in | repo, Pages, CI | `brew install gh && gh auth login` |

Each script prints `UNEVALUABLE` with the install line when a tool is missing, instead of failing.

## What is inside

`SKILL.md` the workflow · `REFERENCE.md` every pitfall and the rule it produced · `scripts/` palette,
capture, d2-fit, test-deck · `templates/` deck, D2 theme, drift check, CI workflow.
