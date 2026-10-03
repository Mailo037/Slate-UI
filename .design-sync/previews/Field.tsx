import { Button, Field, Input } from '@local/slate-ui';

// Card setup, not part of the examples: the page body becomes the kit's app
// root (.slate-ui = tokens, Inter, dark canvas) and SlateUI.init runs once.
// In an app, do this once on your root: <main className="slate-ui" ref={root}>
// + useSlateUI(root).
document.body.classList.add('slate-ui');
(window as any).SlateUI.init(document);

export const Default = () => (
  <Field label="Workspace name" hint="Choose a name you recognize.">
    <Input defaultValue="Personal workspace" />
  </Field>
);

export const WithPlaceholder = () => (
  <Field label="Folder" hint="Recordings are saved here.">
    <Input placeholder="Documents/Recordings" />
  </Field>
);

export const Disabled = () => (
  <Field label="Sync folder" hint="Managed by your organization.">
    <Input defaultValue="Shared/Design" disabled />
  </Field>
);

export const Form = () => (
  <form className="sl-stack" style={{ maxWidth: 360 }} onSubmit={(event) => event.preventDefault()}>
    <Field label="Display name">
      <Input defaultValue="Alex Morgan" />
    </Field>
    <Field label="Email" hint="Used for sign-in and receipts.">
      <Input type="email" defaultValue="alex@example.com" />
    </Field>
    {/* Cancel before the primary action. */}
    <div className="sl-row" style={{ justifyContent: 'flex-end' }}>
      <Button>Cancel</Button>
      <Button variant="primary" type="submit">Save changes</Button>
    </div>
  </form>
);
