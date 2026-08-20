# GenLayer Spinner — Bounty Submission

Official loading spinner system for the GenLayer Portal. Three concepts, one
shared token API (`--gl-a`, `--gl-b`, `--gl-duration`), delivered as
standalone SVG, framework-free CSS, and a React/Tailwind component — plus an
interactive playground to audit all of it before it ships.

**Live demo:** `index.html` in this repo (open directly, no build step) —
deployment URL placeholder: `https://<your-preview-host>/genlayer-spinner-bounty/`

---

## 1. Design rationale

GenLayer's core idea is **Optimistic Democracy**: independent validators,
each running their own process, converging on one accepted result. The
brief asked for a spinner that is "unmistakably GenLayer" — so instead of a
generic ring, each concept encodes that idea directly rather than just
wearing the brand colors.

### Concept A — "The Consensus Orbit"
Two rings rotate in **opposite directions at different speeds** (1×
outer, 1.4× inner, counter-rotating) and never actually touch — they hold
independent orbits around one shared center, where a pulsing core stands in
for the value being agreed on. This is the hero/splash mark: it has the
most moving parts and reads best at 48px+.

### Concept B — "Neural Orbit"
Three nodes (validators) sit on a **single unbroken loop** (the contract).
A gradient stream continuously travels the track — inference flowing
through consensus — while the nodes beautifully orbit the center. Rebuilt 
entirely on hardware-accelerated rotation for a flawless, buttery-smooth 
experience. It's built for cards and modals (32–64px) where there's room 
for the extra detail to register.

### Concept C — "Minimal Portal"
Reduced to **one circle, one arc, one animation.** Built on a 24px grid so
it stays pixel-crisp at 16px inside a button and doesn't need to justify
its existence past that — this is the workhorse for buttons, badges, and
inline states across the Portal.

All three share the same gradient direction (Amber → Ocean Blue, `#F59E0B`
→ `#0EA5E9`) and the same easing language, so a user who sees the Minimal
Portal spinner in a button and the Consensus Orbit on a splash screen reads
them as the same product.

---

## 2. Technical specs

| | Consensus Orbit | Neural Orbit | Minimal Portal |
|---|---|---|---|
| viewBox | 100×100 | 100×100 | 24×24 |
| DOM nodes | 5 (2 rings + core, + 2 static tracks) | 5 (path + 3 nodes, + 1 static track) | 1 |
| Animated properties | `transform`, `opacity` | `transform`, `opacity` | `transform` |
| Filters | 1 static `feGaussianBlur` (core glow) | 1 static `feGaussianBlur` (node glow) | none |
| Default cycle | 1.6s | 1.6s | 1.1s (0.6× base) |
| Recommended size range | 48px – hero | 32px – 96px | 16px – 24px |

**Why it holds 60fps:** EVERY animation across all three concepts drives `transform` and `opacity`
only (both compositor-only properties). Nothing animates
`width`, `filter` radius, `box-shadow`, or SVG `d` paths — the one blur filter per concept
is static (applied once, not animated), so it costs a single GPU layer, not
a per-frame recalculation. Total DOM footprint per spinner tops out at 5
nodes, so a page with a dozen spinners on screen (a busy transaction list,
say) stays incredibly cheap and lag-free.

**Why it's tiny:** each SVG is under 1.5KB uncompressed. The CSS file
(`css/genlayer-spinners.css`) is ~3KB and covers all three concepts, every
size, and reduced-motion handling. No JS is required to render or animate
any of them.

**Color & speed as CSS variables, not hardcoded values:** every spinner
reads `var(--gl-a)`, `var(--gl-b)`, and `var(--gl-duration)` with sane
fallbacks. That means a single `:root` override can retheme every spinner
on a page.

---

## 3. Accessibility

- Every SVG root carries `role="img"` and an `aria-label`; component
  wrappers use `role="status"` plus a visually-hidden label so screen
  readers announce the loading state without narrating decorative markup.
- `prefers-reduced-motion: reduce` is respected everywhere: rotation slows
  to a calm constant duration and scale-pulses are swapped for a fixed
  opacity rather than being removed outright — a stalled spinner reads as
  "finished," so motion is dialed down, not stopped.
- Gradient stops meet contrast against both the dark (`#090A0F`) and light
  (`#F8FAFC`) backgrounds specified in the brief; the High-Contrast theme in
  the playground strips the decorative glow/blur filters entirely and
  raises the idle-track opacity for users who need maximum legibility.

---

## 4. Integration guide

### Standalone SVG
Copy any file from `spinners/` directly into your markup or reference it
with `<img>`/`<object>`. Set `--gl-a`, `--gl-b`, `--gl-duration`, and
`--track` on an ancestor element (or `:root`) to theme it — the SVGs ship
with sensible fallback values so they render correctly even with zero
configuration.

### Pure CSS + HTML
Include `css/genlayer-spinners.css`, then use the markup blocks documented
in the file header, e.g.:
```html
<span class="gl-spinner gl-spinner--portal gl-spinner--sm" role="status" aria-label="Loading">
  <svg viewBox="0 0 24 24">
    <circle class="gl-portal-ring" cx="12" cy="12" r="9"/>
  </svg>
</span>
React / Tailwind / TypeScript
TypeScript
import { GenLayerSpinner } from "./react/GenLayerSpinner";

<GenLayerSpinner size="lg" variant="orbit"/>
<GenLayerSpinner size="md" variant="neural"/>
<GenLayerSpinner size="sm" variant="portal"/>

// status-colored example, e.g. a pending vs. failed transaction
<GenLayerSpinner colorFrom="#F59E0B" colorTo="#FBBF24" size="{16}" speed="{1}" variant="portal"/>
Add the shared @keyframes block (documented at the bottom of
GenLayerSpinner.tsx) to your global stylesheet once — the component
relies on it rather than injecting <style> tags per render, so it stays
cheap even with many instances on screen.

5. Project structure
Plaintext
genlayer-spinner-bounty/
├── index.html                    # interactive playground — theme switcher,
│                                 # size matrix, context sims, live speed/color
│                                 # controls, one-click code export
├── README.md                     # this file
├── spinners/
│   ├── consensus-orbit.svg       # Concept A — standalone, dark/light adaptive
│   ├── neural-orbit.svg          # Concept B — standalone, Pure GPU Rotation
│   └── minimal-portal.svg        # Concept C — standalone, 24px grid
├── css/
│   └── genlayer-spinners.css     # framework-free, all 3 concepts + a11y
└── react/
    └── GenLayerSpinner.tsx       # <GenLayerSpinner ... size speed variant/>
6. Browser support
Built entirely on standard SVG + CSS: transform, opacity,
stroke-dasharray/-dashoffset, and CSS custom properties are supported
everywhere GenLayer Portal targets. Fully optimized for 60fps hardware-accelerated
rendering across all modern browsers (Chrome, Safari, Firefox, Edge).
