# Dev-Mode Gate

A reusable two-stage smokescreen curtain. Stage 1 reads as a genuine **'in development'** page (animated construction stripe border, pleasant copy, a discreet unlock button). Stage 2 - triggered by the unlock button - surfaces an on-screen numeric keypad. Correct code dissolves the curtain; the real app is fully built underneath the whole time.

### Live demo

[Open the demo](https://mawizorek.github.io/ClickUp_apps/shared/devmode-gate/demo.html) - hit Unlock, code is `1234`.

## Use it

Add the gate element as the FIRST thing in `<body>`, then load the script:

```html
<div data-devmode-gate data-key="1234"></div>
<script src="/ClickUp_apps/shared/devmode-gate/devmode-gate.js"></script>
```

## Config (data-* attributes)

| Attribute | Default | Meaning |
|-----------|---------|---------|
| `data-key` | `1234` | the unlock code. Defined per page, not baked into the component. |
| `data-length` | key length | expected digit count |
| `data-dev-title` | `In development` | landing headline |
| `data-dev-message` | friendly line | landing body copy |
| `data-unlock-label` | `Unlock` | unlock button text |
| `data-title` | `Enter code` | keypad-view headline |
| `data-remember` | off | `"true"` keeps it unlocked for the browser tab session |

## What it is (and is NOT)

- **IS:** a UI curtain. An 'in development' smokescreen that hides an experimental/full build from a casual viewer until the unlock button + code are entered. Numeric keypad works identically on mobile and desktop; hardware number keys also work once the keypad is showing.
- **IS NOT:** security. The app markup lives in the DOM and is readable via view-source. This repo is PUBLIC via GitHub Pages. Never put anything sensitive behind this gate - it protects nothing material, by design and by Michael's explicit call.

## Roadmap

- Optional `data-key-sha256` so the plaintext code is not readable in page source (still not real security, just not eyeball-obvious).
- Config surface so the key is dictated from a metadata file rather than a data attribute (ties into the tool-metadata project).
