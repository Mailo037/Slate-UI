import { Button, Field, Input, Panel, Status } from '@local/slate-ui';

// Card setup, not part of the examples: the page body becomes the kit's app
// root (.slate-ui = tokens, Inter, dark canvas) and SlateUI.init runs once for
// the animated checkbox and switch dragging. In an app, do this once on your
// root: <main className="slate-ui" ref={root}> + useSlateUI(root).
document.body.classList.add('slate-ui');
(window as any).SlateUI.init(document);

export const Default = () => (
  <Panel aria-labelledby="panel-workspace-title">
    <div className="sl-panel-head">
      <h3 id="panel-workspace-title">Workspace</h3>
      <span className="sl-hint">Local</span>
    </div>
    <p className="sl-muted" style={{ margin: 0 }}>Group related content without additional outlines.</p>
  </Panel>
);

export const Settings = () => (
  <Panel aria-labelledby="panel-preferences-title" style={{ maxWidth: 440 }}>
    <div className="sl-panel-head">
      <h3 id="panel-preferences-title">Preferences</h3>
      <Status tone="success">Saved</Status>
    </div>
    {/* One panel, divided internally - never nest another card. */}
    <div className="sl-stack">
      <Field label="Workspace name" hint="Shown in the sidebar.">
        <Input defaultValue="Personal workspace" />
      </Field>
      <label className="sl-row"><input type="checkbox" role="switch" className="sl-switch" defaultChecked />Notifications</label>
      <label className="sl-row"><input type="checkbox" className="sl-check" />Include archived items</label>
    </div>
    <hr className="sl-divider" />
    <div className="sl-row" style={{ justifyContent: 'flex-end' }}>
      <Button>Cancel</Button>
      <Button variant="primary">Save changes</Button>
    </div>
  </Panel>
);
