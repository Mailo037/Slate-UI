# design-sync notes: Slate UI

## How this repo syncs
- **Shape: package.** No Storybook. The kit is vanilla `slate.css` + `slate.js` plus a thin React adapter (`react.mjs` / `react.d.ts`). That adapter's 8 exports are the synced components.
- **No build step, but types are only under `exports["./react"]`.** The converter reads top-level `module`/`types`, so `node .design-sync/stage-package.mjs` (`cfg.buildCmd`) mirrors the package's `files` into `.ds-sync/slate-ui/` and adds `module`/`types` pointing at the `./react` subpath. `cfg.entry` points at the staged `react.mjs`. The repo's own `package.json` is not touched. Re-run the stage script before every converter/driver run.
- **Converter deps live in `.ds-sync/node_modules`:** `esbuild ts-morph @types/react@18 react@18.3.1 react-dom@18.3.1 playwright@1.56.1`. There is no repo lockfile; React 18.3.1 is the floor of the kit's `react >=18` peer range. Pass `--node-modules .ds-sync/node_modules`. Staging under `.ds-sync/` matters: ts-morph walks up from the package dir to find `@types/react`.
- **Playwright 1.56.1** matches the Chromium build preinstalled in the claude.ai/code container (`/opt/pw-browsers/chromium-1194`). On another machine, pick the playwright whose `browsers.json` pins the cached Chromium.
- **`globalName` is `SlateUIReact`, not `SlateUI`.** `slate.js` assigns `window.SlateUI` (the vanilla API: init, toast, closeDialog, copyToClipboard, setIcon...) as a side effect. An IIFE global with that name would overwrite it. Both globals exist in designs.
- **`cfg.dtsPropsFor` for 7 components.** The converter drops every prop inherited from `@types/react`. That removed `Icon.name` entirely (React's `SVGAttributes` also declares `name`) and every native prop the wrappers exist to forward (`disabled`, `onClick`, `value`, `onChange`, `aria-label`...). The bodies are hand-written from `react.d.ts` plus the native attributes the kit's docs require. `Field` extracts correctly and has no override.
- **Fonts:** Inter 400/500/600 ship from `fonts/` via `fonts/fonts.css`. The converter drops the three `@font-face` blocks inside `_ds_bundle.css` (relative URLs) as `dead @font-face`. That's expected, since `styles.css` imports `fonts/fonts.css` first.
- **Guidelines:** `DESIGN.md` and `README.md` ship as `guidelines/` (`cfg.guidelinesGlob`). README carries the full class/data-attribute table that the CSS-only patterns depend on.

## Previews (`.design-sync/previews/*.tsx`)
- All 8 components are authored (31 cells), ported from the gallery's `catalogue.js` / `index.html` compositions.
- **Root setup is module-level, above the first export.** It runs `document.body.classList.add('slate-ui')` and `window.SlateUI.init(document)`. Exports are plain component JSX. The converter copies raw text from each `export const X =` up to the next export into `.prompt.md` examples. So never use a local wrapper component or helper const between exports: an earlier `<SlateRoot>` helper leaked into every example as a component the bundle doesn't export.
- The body-level `.slate-ui` makes the whole card dark (canvas `#181818`), which matches the dark-only kit.
- Static captures can't show the travelling hover pill or tooltips (pointer-driven).
- **Render menus/selects in their real initial state (`hidden` menu, `aria-expanded={false}`).** `slate.js` tracks the open menu only when its trigger runs `open()`. A listbox rendered visible from the start never registers as open: option clicks, Escape and arrow keys do nothing. The SelectOptions cell therefore shows the closed trigger; clicking it opens the real listbox (checked in Chromium: select, `slate:select`, Escape).

## Known render warns
- None. The final validate reports 8/8 clean.

## CSS-only patterns (no React wrapper)
Switch, checkbox, menu/select triggers, tooltip, dialog, tabs, accordion, skeleton, toast, notice, progress, slider, workspace shell and window chrome are native markup with `sl-*` classes and data attributes. They reach designs through `styles.css` + `useSlateUI` and are documented in `.design-sync/conventions.md` (the README header). They have no component cards. Adding React wrappers upstream in `react.mjs`/`react.d.ts` would make them syncable components.

## Re-sync risks
- **`dtsPropsFor` duplicates `react.d.ts`.** If the adapter gains a variant, prop or icon alias (the `Icon` name union is copied verbatim), update the matching `dtsPropsFor` body. Otherwise the agent's contract silently lags the code.
- **`stage-package.mjs` depends on `package.json` `files` and `exports["./react"]`** having `import` + `types`. A rename there fails loudly; a new required file not listed in `files` would be missing from the staged copy.
- **`conventions.md` enumerates classes, tokens and data attributes.** Re-validate against `ds-bundle/_ds_bundle.css` and `_ds_bundle.js` on every sync. The kit's README/DESIGN can rename things.
- **`guidelines/README.md` is the repo README verbatim.** It includes Windows paths and publishing notes that aren't relevant to designs. Harmless, but it changes whenever the README does.
- Vendored React is 18.3.1 (UMD). Moving the converter to React 19 switches `_vendor/react.js` to an esbuild bundle; re-verify all cards if you do.
- Previews call `window.SlateUI.init(document)`. If `slate.js` stops assigning the global, every card loses icons and interactions; the render check would show blank icons.

## Re-sync commands
```sh
S=<design-sync skill dir>
mkdir -p .ds-sync && cp -r "$S"/package-build.mjs "$S"/package-validate.mjs "$S"/package-capture.mjs "$S"/resync.mjs "$S"/lib "$S"/storybook .ds-sync/
[ -d .ds-sync/node_modules ] || (cd .ds-sync && npm i esbuild ts-morph @types/react@18 react@18.3.1 react-dom@18.3.1 playwright@1.56.1)
node .design-sync/stage-package.mjs
node .ds-sync/resync.mjs --config .design-sync/config.json --node-modules .ds-sync/node_modules --out ./ds-bundle [--remote .design-sync/.cache/remote-sync.json]
```
