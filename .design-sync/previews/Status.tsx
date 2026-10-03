import { Panel, Status } from '@local/slate-ui';

// Card setup, not part of the examples: the page body becomes the kit's app
// root (.slate-ui = tokens, Inter, dark canvas) and SlateUI.init runs once.
// In an app, do this once on your root: <main className="slate-ui" ref={root}>
// + useSlateUI(root).
document.body.classList.add('slate-ui');
(window as any).SlateUI.init(document);

export const Tones = () => (
  <div className="sl-row">
    {/* Text carries the meaning; tone only colors the dot and label. */}
    <Status>Ready</Status>
    <Status tone="success">Connected</Status>
    <Status tone="warning">Processing</Status>
    <Status tone="error">Needs attention</Status>
  </div>
);

export const InPanelHeader = () => (
  <Panel aria-labelledby="status-sync-title" style={{ maxWidth: 420 }}>
    <div className="sl-panel-head">
      <h3 id="status-sync-title">Sync</h3>
      <Status tone="success" role="status">Connected</Status>
    </div>
    <p className="sl-muted" style={{ margin: 0 }}>Last synced 2 minutes ago.</p>
  </Panel>
);
