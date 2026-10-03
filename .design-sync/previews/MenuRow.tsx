import { Button, HoverList, Icon, MenuRow } from '@local/slate-ui';

// Card setup, not part of the examples: the page body becomes the kit's app
// root (.slate-ui = tokens, Inter, dark canvas) and SlateUI.init runs once for
// icons, menus and the hover pill. In an app, do this once on your root:
// <main className="slate-ui" ref={root}> + useSlateUI(root).
document.body.classList.add('slate-ui');
(window as any).SlateUI.init(document);

export const ActionMenu = () => (
  <div className="sl-menu" role="menu" aria-label="Transcript actions" style={{ width: 260 }}>
    <HoverList>
      <MenuRow role="menuitem"><Icon name="play" />Play<kbd>Space</kbd></MenuRow>
      <MenuRow role="menuitem"><Icon name="copy" />Copy transcript<kbd>Ctrl+C</kbd></MenuRow>
      <MenuRow role="menuitem"><Icon name="download" />Export</MenuRow>
    </HoverList>
  </div>
);

export const WithDescription = () => (
  <div className="sl-menu" role="menu" aria-label="Workspace" style={{ width: 260 }}>
    <HoverList>
      <MenuRow role="menuitem">
        <Icon name="settings" />
        <span className="sl-copy"><strong>Preferences</strong><small>Recording and playback</small></span>
      </MenuRow>
      <MenuRow role="menuitem">
        <Icon name="book" />
        <span className="sl-copy"><strong>Library</strong><small>Saved transcripts</small></span>
      </MenuRow>
    </HoverList>
  </div>
);

export const SelectOptions = () => (
  <div style={{ minHeight: 180 }}>
    {/* Custom select in its real initial state: the menu stays hidden until the trigger opens it.
        Picking an option updates data-sl-selected and fires slate:select with data-sl-value. */}
    <div className="sl-popover-host">
      <Button data-sl-menu="workspace-options" aria-controls="workspace-options" aria-haspopup="listbox" aria-expanded={false}>
        <span data-sl-selected>Personal</span><Icon name="chevron" />
      </Button>
      <div className="sl-menu" id="workspace-options" role="listbox" aria-label="Workspaces" hidden>
        <HoverList>
          <MenuRow role="option" aria-selected={true} data-sl-value="personal">Personal</MenuRow>
          <MenuRow role="option" aria-selected={false} data-sl-value="shared">Shared</MenuRow>
          <MenuRow role="option" aria-selected={false} data-sl-value="archived">Archived</MenuRow>
        </HoverList>
      </div>
    </div>
  </div>
);

export const DisabledRow = () => (
  <div className="sl-menu" role="menu" aria-label="File" style={{ width: 240 }}>
    <HoverList>
      <MenuRow role="menuitem"><Icon name="copy" />Duplicate</MenuRow>
      <MenuRow role="menuitem" disabled><Icon name="download" />Export (no transcript yet)</MenuRow>
    </HoverList>
  </div>
);
