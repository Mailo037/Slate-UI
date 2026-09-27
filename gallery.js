/* The gallery exercises the published CSS and JavaScript; it has no duplicate primitives. */
const disposeSlate = SlateUI.init(document);
const shell = document.getElementById('gallery-shell');
if (innerWidth <= 750) { shell.classList.add('sl-collapsed'); const button = shell.querySelector('[data-sl-collapse]'); button.setAttribute('aria-expanded','false'); button.setAttribute('aria-label','Expand sidebar'); button.dataset.slTooltip='Expand sidebar'; }
function toast(text) { SlateUI.toast(text); }
async function copy(text, trigger, preserveLabel=false) {
  try { await SlateUI.copyToClipboard(text,{trigger,root:document,preserveLabel}); }
  catch { SlateUI.toast('Clipboard unavailable. Select the text or code and copy it manually.',{tone:'error'}); }
}
const tokenGroups={
  'surface-swatches':[['Canvas','--sl-canvas'],['Inset','--sl-overlay'],['Panel','--sl-surface'],['Raised','--sl-raised'],['Hover','--sl-hover']],
  'accent-swatches':[['Accent','--sl-accent'],['Primary text','--sl-ink'],['Muted text','--sl-muted'],['Success','--sl-green'],['Attention','--sl-amber']]
};
const computed=getComputedStyle(document.body);
for (const [id,tokens] of Object.entries(tokenGroups)) for (const [name,token] of tokens) {
  const value=computed.getPropertyValue(token).trim(), button=document.createElement('button');button.className='swatch';button.setAttribute('aria-label',`Copy ${name} token`);
  const sample=document.createElement('div');sample.className='swatch-color';sample.style.setProperty('--sample',value);
  const title=document.createElement('strong');title.textContent=name;const caption=document.createElement('span');caption.textContent=value;
  button.append(sample,title,caption);button.addEventListener('click',()=>copy(`var(${token})`,button,true));document.getElementById(id).append(button);
}
document.addEventListener('click',event=>{
  const button=event.target.closest('button');if(!button)return;
  if(button.hasAttribute('data-replay-arrival'))document.querySelectorAll('#arrival-demo [data-sl-text]').forEach(element=>SlateUI.popInText(element));
  if(button.dataset.demoAction)toast(button.dataset.demoAction);
  if(button.hasAttribute('data-copy-agent'))copy(document.getElementById('agent-brief').textContent,button);
  if(button.hasAttribute('data-copy-install'))copy(document.getElementById('install-code').textContent,button);
  if(button.hasAttribute('data-copy-button'))copy('<button class="sl-btn primary">Save changes</button>',button);
  if(button.hasAttribute('data-copy-overlay'))copy(document.querySelector('.mini-transcript').textContent,button);
  if(button.hasAttribute('data-preview-page')) {
    button.closest('nav').querySelectorAll('button').forEach(row=>row.removeAttribute('aria-current'));button.setAttribute('aria-current','page');document.getElementById('preview-page').textContent=button.dataset.previewPage;
    const page=button.dataset.previewPage;document.getElementById('preview-title').textContent=page==='Dictation'?'Ready when you are.':page==='Playback'?'Your playback workspace.':'Your local services.';document.getElementById('preview-description').textContent=page==='Dictation'?'Capture a thought and review your words.':page==='Playback'?'Open a video and keep controls within reach.':'Manage connections in a separate contextual workspace.';
  }
  if(button.hasAttribute('data-demo-record')) { const active=button.getAttribute('aria-pressed')==='true';button.setAttribute('aria-pressed',String(!active));button.querySelector('span').textContent=active?'Start dictation':'Stop dictation';const icon=button.querySelector('svg');if(icon)SlateUI.setIcon(icon,active?'mic':'stop');toast(active?'Demo stopped. No audio was recorded.':'Recording state preview. No microphone is used.'); }
  if(button.hasAttribute('data-demo-play')){const active=button.getAttribute('aria-pressed')==='true';button.setAttribute('aria-pressed',String(!active));button.setAttribute('aria-label',active?'Play preview':'Pause preview');button.dataset.slTooltip=active?'Play':'Pause';SlateUI.setIcon(button.querySelector('svg'),active?'play':'pause');toast(active?'Playback preview paused.':'Playback preview started. No video is loaded.');}
});
document.querySelector('[data-sl-menu="speed-menu"]').addEventListener('slate:select',event=>document.getElementById('speed-value').textContent=`${event.detail.value}× speed`);
window.addEventListener('pagehide',disposeSlate,{once:true});

// Long examples stay compact at every route and viewport without altering copied text.
const longBlocks=new Map();let longBlockFrame=0;
function updateLongBlocks(){
  longBlockFrame=0;
  for(const [block,state] of longBlocks)if(!block.isConnected){longBlockResize.unobserve(block);longBlocks.delete(block);}
  document.querySelectorAll('pre, [data-sl-truncate]').forEach(block=>{
    if(block.closest('.catalogue-preview'))return;
    let state=longBlocks.get(block);
    if(!state){
      const wrapper=document.createElement('div');wrapper.className='long-block';
      const button=document.createElement('button');button.type='button';button.className='sl-btn ghost small long-block-toggle';button.textContent='Show more';button.setAttribute('aria-expanded','false');
      if(!block.id)block.id=`long-block-${longBlocks.size}-${Date.now()}`;button.setAttribute('aria-controls',block.id);
      block.before(wrapper);wrapper.append(block,button);state={wrapper,button,expanded:false};longBlocks.set(block,state);longBlockResize.observe(block);
      button.addEventListener('click',()=>{state.expanded=!state.expanded;wrapper.classList.toggle('long-block-expanded',state.expanded);button.textContent=state.expanded?'Show less':'Show more';button.setAttribute('aria-expanded',String(state.expanded));if(!state.expanded)button.scrollIntoView({block:'nearest'});});
    }
    if(!block.getBoundingClientRect().width)return;
    const long=block.scrollHeight>194;
    if(state.wrapper.classList.contains('long-block-truncated')!==long)state.wrapper.classList.toggle('long-block-truncated',long);
    if(state.button.hidden===long)state.button.hidden=!long;
  });
}
function scheduleLongBlocks(){if(!longBlockFrame)longBlockFrame=requestAnimationFrame(updateLongBlocks);}
const longBlockResize=new ResizeObserver(scheduleLongBlocks);
const longBlockObserver=new MutationObserver(scheduleLongBlocks);longBlockObserver.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['hidden']});
window.addEventListener('resize',scheduleLongBlocks);scheduleLongBlocks();
window.addEventListener('pagehide',()=>{longBlockObserver.disconnect();longBlockResize.disconnect();cancelAnimationFrame(longBlockFrame);window.removeEventListener('resize',scheduleLongBlocks);},{once:true});
