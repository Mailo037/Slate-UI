import { Button, Icon } from '@local/slate-ui';

// Card setup, not part of the examples: the page body becomes the kit's app
// root (.slate-ui = tokens, Inter, dark canvas) and SlateUI.init runs once for
// icons, tooltips and press feedback. In an app, do this once on your root:
// <main className="slate-ui" ref={root}> + useSlateUI(root).
document.body.classList.add('slate-ui');
(window as any).SlateUI.init(document);

export const Variants = () => (
  <div className="sl-row">
    <Button variant="primary">Save changes</Button>
    <Button>Cancel</Button>
    <Button variant="ghost">Skip for now</Button>
    <Button variant="danger">Delete workspace</Button>
  </div>
);

export const Sizes = () => (
  <div className="sl-row">
    <Button size="small">Small</Button>
    <Button>Default</Button>
    <Button size="large" variant="primary">Large</Button>
  </div>
);

export const WithIcons = () => (
  <div className="sl-row">
    <Button variant="primary"><Icon name="mic" />Dictate</Button>
    <Button><Icon name="download" />Export</Button>
    {/* Icon-only: aria-label is the accessible name; tooltip is visual only. */}
    <Button variant="icon" aria-label="Copy link" tooltip="Copy link"><Icon name="copy" /></Button>
    <Button variant="icon" aria-label="Preferences" tooltip="Preferences"><Icon name="settings" /></Button>
  </div>
);

export const Disabled = () => (
  <div className="sl-row">
    <Button variant="primary" disabled>Save changes</Button>
    <Button disabled>Unavailable</Button>
  </div>
);
