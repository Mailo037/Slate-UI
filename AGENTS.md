# Slate UI — agent entry point

This repository is a reusable design system extracted from three local apps: CWBridge, Player and Riplet. It is not a dictation backend, a video engine or a service bridge.

Read in this order:

1. `DESIGN.md` — visual contract and interaction requirements.
2. `README.md` — integration, file map and commands.
3. `slate.css` — the single source of truth for tokens and components.
4. `slate.js` — portable interactions and lifecycle.
5. `templates/workspace.html` or `templates/overlay.html` — starting layouts.

## Apply this system to another app

- Copy `slate.css`, `slate.js` and `fonts/` together, or install this folder as a local package.
- Put `slate-ui` on the application root and use existing `sl-*` components.
- Initialise `SlateUI.init(document)` once in plain HTML; call its returned disposer on unmount in a SPA. Scope init to an app root when there are multiple independent roots.
- Use the templates as layout references, replacing demo content with the target app's real data and actions.
- For React, `react.mjs` provides Button, Input, Field, Panel, HoverList, MenuRow and Status, plus the `useSlateUI` lifecycle hook. Import the stylesheet separately.
- Copy the shared tokens before adding app styles. Use `var(--sl-...)`; do not invent duplicate palette definitions.
- Keep the gallery functional. It must demonstrate the actual exported components and interaction code, not a second implementation.
- Keep UI, aria labels and comments in English. Use the kit's Material Symbols Rounded SVG icons (`data-sl-icon`) with their original rounded geometry: filled for navigation and primary actions, unfilled when window or directional geometry needs clarity. No Phosphor, Lucide or angular icon substitutions, extra strokes or emojis. Animate actual icon state changes with the existing interruptible scale crossfade; preserve reduced motion.
- Preserve contextual pages instead of flattening multiple tasks into a single screen.
- Native window controls in the gallery are explicitly demos. In a real desktop app, wire actions to that host's window API and grant only the necessary permissions.

## Constraints

No decorative gradients. Functional neutral scroll-edge fades are allowed only while content remains beyond that edge, preserving focus and scrollbars. No uppercase styling. No outlines on panels, menus or dialogs. No native title tooltips or select popups. Keep visible keyboard focus and reduced-motion support. Do not suppress real error states or replace backend work with pretend successful actions.

The original source apps are read-only references. Do not modify them while maintaining this kit unless the user separately requests a migration.

## Verification

Run `npm run check`. Use `npm run serve` to inspect `http://127.0.0.1:4180`.

For interaction changes, check first appearance, neighbouring-row movement, gaps, leaving the list, scroll, keyboard focus, Escape, dialog focus restoration and a 390px viewport. A syntax check is not a browser interaction test or a native desktop test.

## Publishing

The user may point another agent at this folder or at a GitHub URL containing these files. Do not claim that a remote repository exists until it has been created and verified. No publishing is required to use the local kit.
