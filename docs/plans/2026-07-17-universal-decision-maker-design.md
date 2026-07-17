# The Universal Decision Maker — rebuild design doc

Date: 2026-07-17
Source: https://sam-i-am.com/play/5k/decisions/ (a 5k-contest-era web toy, ~2000)

## Intent

Rebuild the original bug-race yes/no decision toy as a well-designed, responsive
(mobile/tablet/desktop) page in plain HTML/CSS/JS. Retain the original's simplicity
and its entire feature set — nothing more:

- Start a race between a YES bug and a NO bug along a 25-step track
- Each bug advances one step at a random 100–1000ms interval (jerky by design)
- First bug past the finish line is the answer
- A "stop" escape hatch that aborts with ".. and now we will never know"

Out of scope: question input fields, history, sharing, sound, frameworks, build steps.

## Audience & context

Anyone with a trivial daily decision and ten seconds to spare — phone in hand as
often as desktop. The job: delegate a coin-flip with more theatre than a coin.
It should feel like a loved late-90s web toy given a proper poster treatment.

## Brand words

silly · ceremonial · homespun

## Design plan

### Palette (OKLCH, single committed theme — bright day-lawn)

- `--lawn`   oklch(0.70 0.19 134) — field green, honouring the original #66CC33
- `--lawn-deep` oklch(0.55 0.15 136) — track shadow / stripes
- `--chalk`  oklch(0.97 0.015 120) — chalk lines, light text
- `--ink`    oklch(0.24 0.03 140) — green-tinted near-black text/outlines
- `--gold`   oklch(0.80 0.15 85)  — YES bug shell
- `--plum`   oklch(0.45 0.16 25)  — NO bug shell

Gold vs plum: distinguishable by lightness (colour-blind safe), avoids the
green/red traffic-light cliché, and neither fights the green field.

### Type

- Display / labels / verdict: **Silkscreen** (Google Fonts) — the pixel face drawn
  by Jason Kottke in 1999, period-authentic to 5k-contest sites. Used with restraint.
- Body: **Verdana stack** (`Verdana, Geneva, sans-serif`) — deliberate homage to the
  original's `font-family: verdana`. There are ~30 words of body copy total.

### Layout

Single poster column, max-width ~40rem, generous vertical rhythm. Track lanes run
full column width and scale fluidly; bug + track sizes derive from one `--bug-w` unit.

```
+--------------------------------+
|  THE UNIVERSAL DECISION MAKER  |   Silkscreen, chalk on lawn
|  tagline (verdana, 2 lines)    |
|                                |
|  YES  ●··················|🏁   |   lane: chalk dashes + finish
|  NO   ●··················|🏁   |
|                                |
|        [ START THE RACE ]      |   ink button, chalk text
|          stop the race         |   quiet link, racing only
|                                |
|  (verdict stamps over track)   |   YES / NO rubber stamp
|  tiny footer homage            |
+--------------------------------+
```

### Signature element

The chalk-lined grass racetrack: two hand-pixelled bug sprites (inline SVG,
`shape-rendering: crispEdges`) advancing in discrete, randomly-timed hops —
the jerkiness is retained from the original, not smoothed — ending in a
rubber-stamped verdict that thumps in over the track.

### States

1. **Idle** — bugs at the start line, "Start the race" button.
2. **Racing** — button hidden, quiet "stop the race" link appears, bugs hop.
3. **Verdict** — YES/NO stamp thumps in (slight rotation), winner wiggles,
   button reads "Race again".
4. **Aborted** — ".. and now we will never know" in the stamp position,
   bugs return to the line, button reads "Start the race".

### Motion

- Bug hops: discrete position changes (no transition) — the charm is the step.
  A tiny 1-frame squash on each hop via CSS animation.
- Verdict stamp: scale 1.6→1 with ease-out-quint, ~250ms, slight rotation.
- `prefers-reduced-motion`: stamp appears without scale, no wiggle/squash;
  the race itself still runs (it *is* the content) but purely positional.

### Accessibility floor

- Real `<button>`s, visible `:focus-visible` rings (chalk on lawn)
- Verdict announced via `aria-live="assertive"`; race progress not announced per-hop
- Contrast: ink-on-lawn and chalk-on-ink pass AA for their sizes
- Touch targets ≥ 44px; page usable from 320px width up

### Anti-slop check (reviewed against generic defaults)

No cream+serif+terracotta, no dark+acid-accent, no broadsheet hairlines. No cards,
no gradients, no gradient text, no side-stripe borders. The look derives from the
subject's own world: lawn, chalk, sports-day bugs, rubber stamp. One committed
bright theme instead of a timid light/dark pair.

## Files

- `index.html` — structure + inline SVG sprites
- `style.css` — tokens, layout, states, motion
- `script.js` — the race (~80 lines, no dependencies)
