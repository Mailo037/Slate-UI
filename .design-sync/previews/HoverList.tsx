import { HoverList, Icon, MenuRow } from '@local/slate-ui';

// Card setup, not part of the examples: the page body becomes the kit's app
// root (.slate-ui = tokens, Inter, dark canvas) and SlateUI.init runs once to
// install the travelling hover pill HoverList opts into. In an app, do this
// once on your root: <main className="slate-ui" ref={root}> + useSlateUI(root).
document.body.classList.add('slate-ui');
(window as any).SlateUI.init(document);

export const Default = () => (
  <div className="sl-menu" style={{ width: 240 }}>
    <HoverList aria-label="Workspaces">
      <MenuRow>Personal</MenuRow>
      <MenuRow>Shared</MenuRow>
      {/* A gap inside one list keeps the pill; leaving the list releases it. */}
      <div style={{ height: 8 }} />
      <MenuRow>Archived</MenuRow>
      <MenuRow>Recent</MenuRow>
    </HoverList>
  </div>
);

export const WithIcons = () => (
  <div className="sl-menu" role="menu" aria-label="Library" style={{ width: 240 }}>
    <HoverList>
      <MenuRow role="menuitem"><Icon name="book" />Library</MenuRow>
      <MenuRow role="menuitem"><Icon name="layers" />Collections</MenuRow>
      <MenuRow role="menuitem"><Icon name="palette" />Themes</MenuRow>
      <MenuRow role="menuitem"><Icon name="settings" />Preferences<kbd>Ctrl+,</kbd></MenuRow>
    </HoverList>
  </div>
);
