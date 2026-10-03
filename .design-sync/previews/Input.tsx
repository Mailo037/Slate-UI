import { Button, Icon, Input } from '@local/slate-ui';

// Card setup, not part of the examples: the page body becomes the kit's app
// root (.slate-ui = tokens, Inter, dark canvas) and SlateUI.init runs once.
// In an app, do this once on your root: <main className="slate-ui" ref={root}>
// + useSlateUI(root).
document.body.classList.add('slate-ui');
(window as any).SlateUI.init(document);

// A bare Input needs aria-label; inside Field the label names it.
export const Placeholder = () => (
  <Input placeholder="Workspace name" aria-label="Workspace name" />
);

export const WithValue = () => (
  <Input defaultValue="Personal workspace" aria-label="Workspace name" />
);

export const SearchWithAction = () => (
  <div className="sl-row" style={{ flexWrap: 'nowrap' }}>
    <Input type="search" placeholder="Search transcripts" aria-label="Search transcripts" />
    <Button variant="primary"><Icon name="search" />Search</Button>
  </div>
);

export const Disabled = () => (
  <Input defaultValue="Unavailable" aria-label="Sync folder" disabled />
);
