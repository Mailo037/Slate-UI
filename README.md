# Slate UI

A portable dark UI kit and interactive design-system gallery, extracted from Riplet, Player and CWBridge.

## Surfaces and rounded icons

Tab groups (`data-sl-tabs`) support dragging their selection surface between enabled tabs. Release snaps to the nearest tab; cancellation keeps the current selection. Click and arrow-key selection use the same soft deformation, while reduced motion removes it. Dragging commits only on release, keeping the current panel available during the gesture.

Checkboxes use CWBridge's animated check: a 150ms fill transition and a 350ms rounded stroke draw, reversing over 150ms when cleared. `SlateUI.init` adds the decorative SVG while retaining the native input and its labels, form values and keyboard behavior. Initial checked states render complete; reduced motion skips the transitions. Disposal removes the generated decoration.

Switches retain native checkbox state and keyboard behavior. Their off thumb is smaller; pointer dragging follows the thumb and commits at the midpoint on release. A completed drag emits one input/change pair only when the value changes; pointer cancellation restores the original state. Reduced motion removes the stretch and animated travel. Initialise SlateUI to enable dragging; plain CSS switches still support click and keyboard toggling.

The switch thumb and draggable tab indicator stretch in the direction of travel according to recent pointer velocity, with capped deformation and a short return to their resting shape. Slow movement stays close to the normal geometry; reduced motion keeps both shapes steady.
The switch track color follows the thumb continuously during a drag and eases to its final blue or gray state on release; regular click and keyboard changes use the same color transition.

Icons use Google's [Material Symbols Rounded](https://github.com/google/material-design-icons), bundled as original static SVGs for offline use. Navigation and primary actions use the filled variant; window controls and directional geometry use the unfilled variant where it keeps meaning clearer. The exact source revision, fill variants and name mapping are in `icons/SOURCE.json`, with Apache 2.0 attribution in `LICENSE-Material-Symbols.txt`. The kit does not load an icon font or make runtime network requests. No Phosphor, Lucide or Radix geometry remains.

Dialog and menu triggers animate their surfaces in over 220ms and out over 150ms. Menus become inert during exit; dialogs retain the browser focus trap until exit completes, then restore trigger focus. Escape and `method="dialog"` submissions use the same exit. Call `SlateUI.closeDialog(dialog, returnValue)` for programmatic animated closing; direct native `dialog.close()` closes immediately. Native `showModal()` is observed for entrance. Reduced motion skips travel.

Use `<svg class="sl-icon" data-sl-icon="play" aria-hidden="true"></svg>` and initialise the kit. Supported icon aliases: play, pause, stop, mic, grid, layers, palette, pointer, panel, copy, settings, book, download, check, close, minus, square, chevron, code, search. Call `SlateUI.setIcon(svg, 'pause')` or change `data-sl-icon` after a real state change. All icon state changes use an interruptible scale crossfade over 220ms, preserving the original rounded contours. Keep an accessible label on the owning button. The gallery and templates use the same `data-sl-icon` API.

## CWBridge text motion

The React adapter exports `Icon`: `<Icon name={playing ? 'pause' : 'play'} />`. Keep `useSlateUI(rootRef)` on the app root so state changes animate and listeners are disposed on unmount.

Buttons use the original press feedback: `translateY(1px) scale(.97)`; compact icon buttons use `.92`. Real text changes inside `.sl-btn` arrive character by character. Rewriting identical text does not replay it.

Use `data-sl-text` on a text label or figure to play CWBridge's character animation on initialisation and reload. Call `SlateUI.popInText(element)` to replay after navigation. Every character moves up from 8px with 2px blur over 500ms, using `cubic-bezier(.34,1.45,.64,1)`. Steps are up to 70ms and the total stagger is capped at 140ms. Spaces, punctuation and graphemes are preserved; temporary character spans are removed after completion. Icons and nested markup stay intact. Reduced motion shows the original text immediately. The **Character arrival** gallery example demonstrates this animation.

The separate row effect remains available: add `data-sl-reveal` to a container to reveal its direct children when `SlateUI.init(root)` runs. Call `SlateUI.reveal(container)` after a route has rendered; the returned function cancels that run. Each row fades from a 2px blur over 430ms, staggered by 40ms with at most 360ms between the first and last row. Reduced motion skips this animation. Avoid nesting row and character effects on the same text.

## Open the gallery

Double-click `index.html`. CSS, scripts and Inter fonts are local; no network or build step is needed. For a local server with clipboard support:

```powershell
cd C:\Users\kasto\Documents\Slate-UI
npm run serve
```

Open `http://127.0.0.1:4180`. Run `npm run check` for syntax, package contents, relative-link and token checks. No npm install is required for these commands.

## Use in any web app

Copy `slate.css`, `slate.js` and `fonts/` together. Wrap your UI in `slate-ui`:

```html
<link rel="stylesheet" href="slate.css">
<script src="slate.js"></script>
<body class="slate-ui">
  <button class="sl-btn primary">Save changes</button>
  <button class="sl-btn icon" aria-label="Copy" data-sl-tooltip="Copy">…</button>
</body>
<script>const dispose = SlateUI.init(document);</script>
```

The CSS uses `sl-*` classes and `--sl-*` tokens to avoid app-name coupling. Token defaults are on `:root` and `.slate-ui`; override them in your scoped root only when a deliberate theme is requested. Do not accidentally inherit a second copy of these primitives from app CSS.

## Components and data attributes

| Pattern | Classes / attributes |
| --- | --- |
| Button | `sl-btn`, `primary`, `ghost`, `icon`, `small`, `large`, `danger` |
| Field | `sl-field` with `sl-input` and an optional `small` hint |
| Switch / checkbox | `sl-switch` / `sl-check` on native checkbox inputs |
| Panel | `sl-panel`, `sl-panel-head`, `sl-row`, `sl-stack` |
| Menu | `sl-menu`, `sl-menu-row`; a trigger with `data-sl-menu="target-id"` |
| Select | Trigger with `aria-haspopup="listbox"`; options with `role="option"`, `data-sl-value` and `aria-selected` |
| Hover pill | Positioned `data-sl-hover` container, `data-sl-row` descendants |
| Tooltip | `data-sl-tooltip="Label"` on the actual control, no `title` attribute |
| Dialog | `sl-dialog`; trigger `data-sl-dialog="id"`; close control `data-sl-dialog-close` |
| Status / notice | `sl-status` / `sl-notice`, optionally `success`, `warning`, `error` |
| Progress / slider | `sl-progress` on `progress`, `sl-range` on `input type="range"` |
| Workspace | `sl-shell`, `sl-sidebar`, `sl-topbar`, `sl-workspace`, `sl-main-scroll` |
| Collapse | `data-sl-collapse` inside the shell; `sl-collapsed` stores its current visual state |
| Tabs / segmented control | `sl-tabs`, `sl-tab`, `sl-tabpanel`, `data-sl-tabs`; see below |
| Accordion | `sl-accordion` around native `details` and `summary` |
| Skeleton | `sl-skeleton`, `short`, `avatar`; `sl-content-arrive` for replacement content |
| Toast | `SlateUI.toast(message, options)` and `SlateUI.dismissToasts(root)` |
| Window chrome | `sl-windowbar`, `sl-window-actions`, `sl-window-control` |

Menu selection dispatches a bubbling `slate:select` event on the trigger with `event.detail.value`. Connect that event to application state. Dialogs use `showModal()` and `close()` with native focus containment and custom visual styling. Menu triggers must expose `aria-controls`, `aria-expanded` and `aria-haspopup`; see the gallery's examples.

`SlateUI.init(root)` returns a disposer. Repeated init for the same root returns the same disposer; it never installs duplicate listeners. Dynamic descendants work because handlers are delegated. Dispose before removing an app root. Avoid initialising overlapping roots, which would handle the same controls twice.

## React

React is optional. To use the adapter, install the local folder in your target app:

```sh
npm install ../Slate-UI --install-links
```

```jsx
import { Button, Field, Input, Panel, useSlateUI } from '@local/slate-ui/react';
import '@local/slate-ui/styles.css';

export function Workspace() {
  useSlateUI(); // effect cleanup removes listeners and transient layers
  return <main className="slate-ui">
    <Panel>
      <Field label="Workspace name" hint="Choose a name you recognize.">
        <Input defaultValue="Personal workspace" />
      </Field>
      <Button variant="primary" onClick={save}>Save changes</Button>
    </Panel>
  </main>;
}
```

`save` is an application callback. For multiple roots, pass a stable ref to `useSlateUI(ref)` and attach it to the application container. The adapter does not bundle React; your app provides it. Import `slate.css` explicitly in the app entry point. Native dialogs, menus and shell markup remain available directly through the CSS and data attributes.

## Templates

- `templates/workspace.html`: collapse/expand sidebar, contextual content, custom select, sticky tooltips and a dialog. Responsive from 320px.
- `templates/overlay.html`: compact transcript/status/actions layout, with an honest demo toggle and custom tooltip.
- `examples/tauri-window.tsx`: host-specific window controls and the required capability configuration; not bundled into the portable kit.

The gallery's window-control buttons are demonstrations, not operating-system actions. Do not connect them to fake backend success in an actual app.

## For agents and GitHub

Point agents at `AGENTS.md` first. A ready-to-copy brief is in the gallery. This folder can be published as its own GitHub repository; nothing here depends on a `C:\Users\...` path at runtime.

```text
Use the Slate UI design system from <repository URL>.
Read AGENTS.md, DESIGN.md and README.md first.
Reuse slate.css, slate.js and the provided templates.
Preserve the shared tokens and interaction contract.
```

The source is published at [Mailo037/Slate-UI](https://github.com/Mailo037/Slate-UI). Browse the [interactive gallery](https://mailo037.github.io/Slate-UI/) or download `Slate-UI.zip` from the gallery. Run `npm run pack:kit` after changes to refresh the archive before publishing.

## File map

```text
AGENTS.md / DESIGN.md / README.md   Agent entry point, contract, integration
slate.css / slate.js               Portable source of truth
react.mjs / react.d.ts             Optional React components and lifecycle
index.html / gallery.css / gallery.js / catalogue.js  Routed interactive gallery
templates/                        Standalone application layouts
examples/                         Host-specific integration references
fonts/                            Local Inter files and upstream license
icons/                            Pinned Material Symbols Rounded SVG sources and alias mapping
check.cjs / serve.cjs / pack.cjs   Dependency-free maintenance tools
```

## Attribution

Design decisions originate in the local CWBridge, Player and Riplet apps. Material Symbols attribution is in `NOTICE.md` and `LICENSE-Material-Symbols.txt`. Inter's bundled font license is in `fonts/LICENSE-Inter.txt`. Confirm ownership and licensing of your source apps before publishing or relicensing this extraction; this folder intentionally does not assign a new license to their code or design.

## Contextual gallery and feedback

The gallery uses local hash routes: `#overview`, `#foundations`, `#components`, `#interactions`, `#templates`, `#integration`, and `#components/tabs` (or another component slug). The component catalogue shows an actual miniature of each component, its name and purpose. Search matches names, purposes and API keywords; tile/list controls preserve their preference locally when storage is available. Each component has a documentation page with its local package/version, Overview and Properties tabs, a large interactive test stage, and a Usage format switcher. Properties contains API notes, keyboard guidance and a factual anatomy table of the example markup. The top breadcrumb links back to Overview and Components. Browser Back/Forward and direct links work without a server. React examples are supplied only for exported adapter primitives.

### Tabs and segmented controls

Use `.sl-tabs[data-sl-tabs][role="tablist"]`, native `.sl-tab[role="tab"]` buttons, and labelled `.sl-tabpanel[role="tabpanel"]` regions. Every enabled tab needs an ID and `aria-controls` pointing at its panel. Exactly one tab starts with `aria-selected="true"` and `tabindex="0"`; others use `tabindex="-1"` and their panels start hidden. The selected surface travels using Slate's 190ms easing. Arrow keys, Home and End activate tabs; disabled tabs are skipped. Set `aria-orientation="vertical"` for Up/Down navigation. The bubbling `slate:tab` event exposes `detail.value` from `data-sl-value` (falling back to the tab ID). Selection is automatic, so panels should be immediately available.

### Accordion and loading

`.sl-accordion` wraps native `details`/`summary`; `open` controls initial state and multiple sections may remain open. Content arrives over 220ms while native disclosure semantics work without JavaScript. `.sl-skeleton` supports `.short` and `.avatar`; skeleton shapes are `aria-hidden`, with readable loading text and `aria-busy` on the real content region while its request runs. Use `.sl-content-arrive` on replacement content for the same short arrival. Reduced motion removes pulsing and arrival effects. Always replace loading with actual data or an actionable error; never invent success.

### Toast lifecycle

```js
const notification = SlateUI.toast('Copied to clipboard.', { root: appRoot });
notification.dismiss();
SlateUI.toast('Connection unavailable. Try again.', {
  root: appRoot, tone: 'error', duration: 0,
  action: { label: 'Retry', onClick: retryConnection }
});
SlateUI.dismissToasts(appRoot);
```

The default duration is 5000ms. Error and action toasts persist by default; `duration: 0` explicitly persists any toast. Hover and keyboard focus pause timed dismissal. Equivalent actionless neutral or success messages reuse the existing notification and refresh its timer within the same root. Warnings, errors and actionable notifications remain distinct. Small stacks have no scrollbar; if the complete stack exceeds the viewport, it becomes scrollable and retains every message. Every toast has an accessible dismiss action; Escape dismisses the focused toast and restores its previous focus when still connected. Routine messages use `role="status"`, errors use `role="alert"`. Use `tone: 'success' | 'warning' | 'error'`. `toast()` returns `{ dismiss, element }`; calling the disposer from `SlateUI.init(root)` clears that root's toasts. Always pass the same app root when working in independent roots.


### Scroll-edge fades

Add `data-sl-scroll-fade` to an actual scroll container and initialise its owning Slate root. A neutral 20px top/bottom fade indicates hidden content: top is absent at the absolute top, bottom is absent at the absolute bottom, and both are absent without overflow. Override `--sl-scroll-fade-size` on the container to change depth. The kit derives the surface color from its background/ancestors. Pointer-transparent overlays exclude the native scrollbar; focused controls near an edge keep their full focus outline visible. Scroll, resize, content and route changes update in a single animation frame without layout shifts or decorative motion. The root disposer removes overlays and observers. Menus, dialogs and catalogue miniatures are excluded. Use this on content viewports rather than the entire application root.


### Clipboard button feedback

`await SlateUI.copyToClipboard(text, { trigger: button, root: appRoot })` writes the real clipboard before showing animated **Copied** text and the shared check icon on that button. It restores the original label/icon after 1600ms; repeated completion refreshes that timer. No success toast is needed. Failures reject so the application can present an actionable error. `preserveLabel: true` retains token swatch labels while adding a check and accessible copied announcement. `SlateUI.buttonFeedback(button, options)` supplies the same UI feedback after another verified operation. Root disposal restores active feedback and cancels timers. Reduced motion keeps labels readable immediately.
