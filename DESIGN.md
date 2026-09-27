# Slate UI

Version 0.1.0. A shared interface language for focused desktop and web workspaces.

## Origin and decisions

| Source | Adopted | Deliberate choice |
| --- | --- | --- |
| CWBridge | Dark palette, spacing, compact controls, travelling hover pill, sticky tooltip, fixed sidebar icon column | Use Inter rather than the source's Geist / Segoe UI. |
| Player | Portable button, field, menu and dialog metrics; focus rings; borderless floating surfaces; media controls | Keep the monochrome video scrim an app-specific functional exception. |
| Riplet | Rounded inset workspace, breadcrumb in the darker canvas, collapsible sidebar, overlay and custom window chrome | Keep window APIs outside the portable core. |

Reference sources were inspected at `C:\Users\kasto\Documents\catweb-ai\cwbridge`, `C:\Users\kasto\Documents\player` and `C:\Users\kasto\Documents\Riplet`. This kit is an extraction and consolidation, not an automatic migration of those apps. Changes to them do not automatically update Slate UI.

## Tokens

`slate.css` is authoritative. The gallery reads its swatch values from computed CSS, avoiding a duplicate token table in JavaScript.

| Role | Token | Value |
| --- | --- | --- |
| Canvas | `--sl-canvas` | `#181818` |
| Inset workspace | `--sl-overlay` | `#242424` |
| Panel / dialog | `--sl-surface` | `#292929` |
| Menu / tooltip | `--sl-raised` | `#2d2d2d` |
| Hover surface | `--sl-hover` | `#343434` |
| Primary text | `--sl-ink` | `#eeeeee` |
| Supporting text | `--sl-muted` | `#aaaaaa` |
| Hints | `--sl-faint` | `#999999` |
| Low-priority text | `--sl-ghost` | `#8a8a8a` |
| Accent | `--sl-accent` | `#2563eb` |
| Accent hover | `--sl-accent-hover` | `#1d4ed8` |
| Meaningful outlines | `--sl-line` / `--sl-line-strong` | `#363636` / `#555555` |
| Status | `--sl-green` / `--sl-amber` / `--sl-red` | `#10b981` / `#f5b95c` / `#f08080` |

Inter: 400, 500 and 600, served locally. Body and controls 13px; long text 14px; section heading 16px; title 20px; hints 11px. Gallery display headings may be larger, but they are presentation typography, not application control metrics. Code uses the system monospace family.

Radii: 10px rows, 12px controls, 16px panels, 20px large cards. A nested child follows `parent radius - parent padding` where practical. Spacing uses a 4px grid: 4, 8, 12, 16, 24, 32, 40.

## Components

- Buttons: 32px high, 12px padding, 8px gap, 14–16px icon. Small 28px; large 36px. Icon-only controls are square.
- Fields: label, control, hint; 8px vertical gaps. Input 34px high with a meaningful border. Focus adds the accent border and a 3px ring.
- Panels: no outline. Divide grouped content with internal lines rather than stacking additional cards.
- Menus: raised surface, 14px radius, 5px padding, at least 200px wide. Rows are at least 32px, with 10px radius and 12px icon gap. Never scroll horizontally.
- Dialogs: 16px radius, 24px padding, 440px maximum width, no outline. Shadow provides separation. Put Cancel before the primary action. Return focus on close.
- Status: compact neutral surface with a colored dot and human-readable text. Do not rely on color alone.
- Scrollbars: thin neutral thumb, transparent track, no light system stripe.
- Workspace: darker canvas owns the breadcrumb, sidebar head and chrome. Inset content starts below. Sidebar icons never recenter while the rail folds.
- Overlay: text, current status, meter and actions in one compact layout. Its host window must fit the content; verify the actual native dimensions.

## Interaction contract

The travelling hover pill moves for 190ms using `cubic-bezier(.22,.61,.36,1)`. First appearance snaps to the row and fades. Gaps inside one list keep the pill; leaving the list releases it. A switch to another list is a new appearance. Measure relative to the correct scroll container; account for borders and scroll offsets. Each list has one highlight below the row content. Observe resize and retarget after scroll. Keyboard follows focus and touch uses plain tap states.

Sticky tooltips use one shared layer, a 350ms initial delay and a 90ms leaving grace. Travel only between sibling controls; unrelated controls start with a fresh fade. Counter-transform the inner label while the outer box moves so the text stands at its destination. Clamp to viewport edges, flip if needed, and keep a margin of 8px. Sidebar row tooltips are shown only in a folded sidebar. Link the visible tooltip through `aria-describedby`. Escape, click, scroll and resize dismiss it.

Color transitions are 120ms. Press feedback settles by `translateY(1px) scale(.97)`. Reduced motion disables travel and keeps interactions usable.

Use Google's Material Symbols Rounded with original rounded geometry for navigation and actions. Filled variants are preferred for navigation and primary actions; unfilled variants keep window controls and directional geometry clear. Keep icons in a fixed box and do not add strokes or redraw their contours. All real state changes, including play/pause/stop, use an interruptible 220ms scale crossfade that preserves those rounded contours. Reduced motion skips the transition. Do not animate decorative icons continuously.

Dialogs and popovers enter over 220ms with opacity, an 8px lift and scale from .96; exit over 150ms. Dialog backdrops fade with the surface. Keep the modal focus trap until closing completes and restore the trigger afterward. Menus become inert immediately on exit. Reopening cancels a pending exit. Escape and dialog form submissions follow this contract. Reduced motion completes immediately.

## Boundaries

Never use decorative gradients, emojis, all-caps labels, invisible focus or native browser tooltips. A custom-styled HTML `dialog` uses the browser's modal focus trap and Escape behavior; it is not an unstyled native dialog. Functional neutral scroll-edge fades are permitted on opt-in scroll surfaces: show a top fade only after leaving the top and a bottom fade only while more content remains below. They must preserve scrollbar input, focus outlines and layout. A monochrome readability scrim beneath controls over arbitrary video frames remains an app-specific exception. Decorative gradients remain forbidden.

The kit supplies UI and lifecycle, not recording, playback, storage, server requests or native window access. Gallery previews label these limitations openly. Applications own validation, loading, error handling and integration testing.

## Review rules for additions

Keep the existing Slate palette, Inter, borderless surfaces and contextual pages. Adapted from [better-interface](https://www.ui-skills.com/skills/jakubkrehel/better-interface), [apple-design](https://www.ui-skills.com/skills/emilkowalski/apple-design), [interaction-design](https://www.ui-skills.com/skills/wshobson/interaction-design), and [Transitions.dev](https://transitions.dev/):

- Feedback starts immediately after input. Animate the actual state change, with one clear purpose and a cancellable lifecycle. Travel preserves spatial context; arrival explains newly available content.
- Keyboard and pointer reach the same actions. Preserve native semantics, visible focus, descriptive names, sufficient text contrast and labels independent of color. Never use tooltip text as the only accessible name.
- Each task has a contextual page. Components are individually discoverable, directly linkable, and document states and integration boundaries. Keep source examples consistent with the actual exported code.
- Loading, empty, disabled, successful and failed states must be deliberate. Skeletons represent pending real content; errors stay available with a useful recovery action. Timed notices pause while being read or focused.
- Respect reduced motion in every new effect. Avoid ambient/decorative movement, glass layers, gradients and additional dependencies unless an application requirement makes them necessary.
- Check first appearance, interrupted changes, neighboring movement, gaps, leaving, scroll, resizing, keyboard, Escape, focus restoration, and a 390px viewport. Syntax and package checks supplement browser checks.

Motion's layout/drag features remain an optional application-level choice when needed. Libraries.dev and Canvas UI effects do not become default Slate components. These are adapted principles, not copied effect implementations or installed skills.
