// Host integration reference. Requires React, lucide-react and @tauri-apps/api.
// Main window config: decorations: false. Do not apply this to web-only views.
// Capability (main window only): core:window:allow-minimize,
// core:window:allow-toggle-maximize, core:window:allow-is-maximized,
// core:window:allow-start-dragging, core:window:allow-close.
import { useEffect, useState } from 'react';
import { isTauri } from '@tauri-apps/api/core';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { Minus, Square, Copy, X } from 'lucide-react';

export function WindowBar() {
  const [maximized, setMaximized] = useState(false);
  const [error, setError] = useState('');
  const native = isTauri();
  useEffect(() => {
    if (!native) return;
    let mounted = true;
    let stop: (() => void) | undefined;
    const update = async () => {
      try { const next = await getCurrentWindow().isMaximized(); if (mounted) setMaximized(next); }
      catch (cause) { if (mounted) setError(String(cause)); }
    };
    void update();
    getCurrentWindow().onResized(update).then(unlisten => { if (mounted) stop = unlisten; else unlisten(); }).catch(cause => { if (mounted) setError(String(cause)); });
    return () => { mounted = false; stop?.(); };
  }, [native]);
  async function run(action: 'minimize'|'maximize'|'close'|'drag') {
    setError('');
    try {
      const win = getCurrentWindow();
      if (action === 'minimize') await win.minimize();
      else if (action === 'close') await win.close();
      else if (action === 'drag') await win.startDragging();
      else { await win.toggleMaximize(); setMaximized(await win.isMaximized()); }
    } catch (cause) { setError(`Could not ${action} window: ${String(cause)}`); }
  }
  if (!native) return null;
  return <><header className="sl-windowbar">
    <div style={{flex:1,alignSelf:'stretch',display:'flex',alignItems:'center',paddingLeft:16,userSelect:'none'}} onMouseDown={event => { if (event.button === 0) void run(event.detail === 2 ? 'maximize' : 'drag'); }}>Workspace</div>
    <div className="sl-window-actions">
      <button className="sl-window-control" aria-label="Minimize window" data-sl-tooltip="Minimize" onClick={() => void run('minimize')}><Minus size={15}/></button>
      <button className="sl-window-control" aria-label={maximized?'Restore window':'Maximize window'} data-sl-tooltip={maximized?'Restore':'Maximize'} onClick={() => void run('maximize')}>{maximized?<Copy size={13}/>:<Square size={13}/>}</button>
      <button className="sl-window-control close" aria-label="Close window" data-sl-tooltip="Close" onClick={() => void run('close')}><X size={17}/></button>
    </div>
  </header>{error && <div className="sl-notice error" role="alert">{error}</div>}</>;
}
