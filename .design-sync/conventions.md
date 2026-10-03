## Slate UI conventions (read first)

Slate is a dark, borderless desktop-workspace kit: CSS classes (`sl-*`), tokens (`--sl-*`) and data attributes, plus a thin React adapter. The React components are `window.SlateUIReact.{Button, Input, Field, Panel, HoverList, MenuRow, Status, Icon}` and the hook `useSlateUI`. Every other pattern is native markup with `className`; there is no React wrapper for it, so don't invent one.

### Root setup (required)
Wrap the app once in `className="slate-ui"`. Without it, text loses Inter, ink color and the `#181818` canvas. Call `useSlateUI(ref)` once on that root. Without it, `<Icon>` SVGs stay empty and tooltips, menus, dialogs, tabs, the hover pill and switch dragging don't run. Never nest a second `.slate-ui` or init overlapping roots.

```jsx
const { Button, Field, Input, Panel, Status, useSlateUI } = window.SlateUIReact;
function App() {
  const root = React.useRef(null);
  useSlateUI(root);
  return (
    <main ref={root} className="slate-ui" style={{ minHeight: '100vh', padding: 'var(--sl-space-6)' }}>
      <Panel style={{ maxWidth: 440 }}>
        <div className="sl-panel-head"><h3>Preferences</h3><Status tone="success">Saved</Status></div>
        <div className="sl-stack">
          <Field label="Workspace name" hint="Shown in the sidebar."><Input defaultValue="Personal" /></Field>
          <label className="sl-row"><input type="checkbox" role="switch" className="sl-switch" defaultChecked />Notifications</label>
        </div>
        <hr className="sl-divider" />
        <div className="sl-row" style={{ justifyContent: 'flex-end' }}>
          <Button>Cancel</Button><Button variant="primary">Save changes</Button>
        </div>
      </Panel>
    </main>
  );
}
```

### Styling idiom
Style with `sl-*` classes and `var(--sl-*)` tokens only. Never use raw hex values or a second palette.

| Family | Names |
|---|---|
| Surfaces | `--sl-canvas` `--sl-overlay` `--sl-surface` (panel) `--sl-raised` (menu) `--sl-hover` |
| Text | `--sl-ink` `--sl-muted` `--sl-faint` `--sl-ghost` `--sl-on-accent`; classes `sl-muted`, `sl-hint` |
| Accent / status | `--sl-accent` `--sl-accent-hover` `--sl-accent-soft` `--sl-green` `--sl-amber` `--sl-red` |
| Lines | `--sl-line` `--sl-line-strong` (inputs, dividers only) |
| Radius / type / space | `--sl-radius-{sm,md,lg,xl}` = 10/12/16/20; `--sl-text-{xs,sm,md,lg,xl}` = 11/13/14/16/20; `--sl-space-{1,2,3,4,6,8,10}` = 4..40 |
| Layout | `sl-row` (wrapping flex row, 8px gap), `sl-stack` (column, 16px), `sl-divider` (hr), `sl-panel-head` |

Native-markup patterns:
- Switch: `<input type="checkbox" role="switch" className="sl-switch">`
- Checkbox: `className="sl-check"`
- Notice: `sl-notice` with `success`/`error`
- Progress: `<progress className="sl-progress">`
- Slider: `<input type="range" className="sl-range">`
- Accordion: `sl-accordion` around `details`/`summary`
- Skeleton: `sl-skeleton` (+`short`/`avatar`)
- Tabs: `sl-tabs` + `data-sl-tabs` + `role="tablist"`, with `sl-tab` (`role="tab"`, `aria-controls`) and `sl-tabpanel`
- Menu / select: trigger `data-sl-menu="id"` + `aria-controls` / `aria-expanded` / `aria-haspopup`, inside `sl-popover-host`, opening a `hidden` `sl-menu` of `MenuRow`s inside `HoverList`. Selection fires a bubbling `slate:select` event with `detail.value` from `data-sl-value`.
- Dialog: `<dialog className="sl-dialog">` opened by `data-sl-dialog="id"`, closed by `data-sl-dialog-close`; actions go in `sl-dialog-actions`, with Cancel first.
- Workspace shell: `sl-shell` > `sl-sidebar` (`sl-sidebar-head`, `sl-brand`, `sl-nav` with `data-sl-hover` holding `sl-nav-row` with `data-sl-row` and `sl-nav-label`, `sl-sidebar-foot`) + `sl-main` > `sl-topbar` + `sl-workspace` > `sl-main-scroll` (`data-sl-scroll-fade`). Collapse button: `sl-btn icon sl-collapse` with `data-sl-collapse`.
- Toasts: `window.SlateUI.toast(message, { tone, root })`. `window.SlateUI` also has `closeDialog` and `copyToClipboard`.

### Rules
- No gradients, uppercase, emojis, or outlines on panels, menus and dialogs.
- No native `title` tooltips: use Button `tooltip` or `data-sl-tooltip`.
- Icon-only buttons need `aria-label`.
- Icons are only the 20 `Icon` names (Material Symbols Rounded). No other icon sets.
- Group with one Panel and internal dividers; don't nest cards.
- Never fake success states.

### Where the truth lives
- `styles.css` imports `_ds_bundle.css`, which is the kit's own `slate.css` (its Inter `@font-face` rules live in `fonts/fonts.css`); read it for exact metrics.
- `guidelines/README.md` has the full class/attribute table and event APIs.
- `guidelines/DESIGN.md` has the visual and interaction contract.
- `components/general/<Name>/<Name>.prompt.md` has props and examples.
