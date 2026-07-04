# Dev-Mode Gate

A reusable smokescreen curtain. Drops an opaque overlay with an on-screen numeric keypad over any page; the real app is fully built underneath and is revealed when the correct code is entered.

### Live demo

[Open the demo](https://mawizorek.github.io/ClickUp_apps/shared/devmode-gate/demo.html) - code is `1234`.

## Use it

Add the gate element as the FIRST thing in `<body>`, then load the script:

```html
<div data-devmode-gate data-key="1234" data-title="Dev mode"></div>
<script src="/ClickUp_apps/shared/devmode-gate/devmode-gate.js"></script>
```

## Config (data-* attributes)

| Attribute | Default | Meaning |
|-----------|---------|---------|
| `data-key` | `1234` | the unlock code. Defined per page, not baked into the component. |
| `data-length` | key length | expected digit count |
| `data-title` | `Enter code` | headline on the curtain |
| `data-remember` | off | `"true"` keeps it unlocked for the browser tab session |

## What it is (and is NOT)

- **IS:** a UI curtain. A smokescreen landing that hides an experimental/full build from a casual viewer until a code is entered. Numeric keypad works identically on mobile and desktop; hardware number keys also work.
- **IS NOT:** security. The app markup lives in the DOM and is readable via view-source. This repo is PUBLIC via GitHub Pages. Never put anything sensitive behind this gate - it protects nothing material, by design and by Michael's explicit call.

## Roadmap

- Optional `data-key-sha256` so the plaintext code is not readable in page source (still not real security, just not eyeball-obvious).
- Config surface so the key is dictated from a metadata file rather than a data attribute (ties into the tool-metadata project).
