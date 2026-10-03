import { Button, Icon } from '@local/slate-ui';

// Card setup, not part of the examples: the page body becomes the kit's app
// root (.slate-ui = tokens, Inter, dark canvas) and SlateUI.init runs once to
// fill every data-sl-icon SVG. In an app, do this once on your root:
// <main className="slate-ui" ref={root}> + useSlateUI(root).
document.body.classList.add('slate-ui');
(window as any).SlateUI.init(document);

export const AllIcons = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', gap: 'var(--sl-space-4)' }}>
    {(['play', 'pause', 'stop', 'mic', 'grid', 'layers', 'palette', 'pointer', 'panel', 'copy',
      'settings', 'book', 'download', 'check', 'close', 'minus', 'square', 'chevron', 'code', 'search'] as const).map((name) => (
      <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--sl-space-2)' }}>
        <Icon name={name} />
        <span className="sl-hint">{name}</span>
      </div>
    ))}
  </div>
);

export const IconButtons = () => (
  <div className="sl-row">
    {/* The owning control carries the name; Icon is always aria-hidden. */}
    <Button variant="icon" aria-label="Play" tooltip="Play"><Icon name="play" /></Button>
    <Button variant="icon" aria-label="Copy" tooltip="Copy"><Icon name="copy" /></Button>
    <Button variant="icon" aria-label="Search" tooltip="Search"><Icon name="search" /></Button>
    <Button variant="icon" aria-label="Preferences" tooltip="Preferences"><Icon name="settings" /></Button>
  </div>
);

export const PlaybackStates = () => (
  <div className="sl-row">
    {/* After a real state change, swap name (e.g. playing ? 'pause' : 'play'); it crossfades. */}
    <Button variant="primary" aria-pressed={false}><Icon name="play" />Play</Button>
    <Button aria-pressed={true}><Icon name="pause" />Pause</Button>
    <Button variant="danger"><Icon name="stop" />Stop</Button>
  </div>
);
