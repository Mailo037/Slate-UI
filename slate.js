/* Slate UI: dependency-free interactions. Safe to initialise and dispose in SPA effects. */
(function (global) {
  'use strict';
  let nextId = 0;
  const installations = new WeakMap();
  const motionRuns = new WeakMap();
  const textRuns = new WeakMap();
  const surfaceRuns = new WeakMap();
  function surfaceMotion(element, opening, done = () => {}) {
    const view = element.ownerDocument.defaultView;
    const previous = surfaceRuns.get(element);
    const current = previous ? view.getComputedStyle(element) : null;
    const from = current ? {opacity:current.opacity,transform:current.transform} : opening ? {opacity:0,transform:'translateY(8px) scale(.96)'} : {opacity:1,transform:'none'};
    previous?.cancel();
    element.dataset.slPhase = opening ? 'opening' : 'closing';
    if (view.matchMedia('(prefers-reduced-motion: reduce)').matches) { delete element.dataset.slPhase; done(); return () => {}; }
    const animation = element.animate([from, opening ? {opacity:1,transform:'none'} : {opacity:0,transform:'translateY(4px) scale(.97)'}], {duration:opening ? 220 : 150,easing:'cubic-bezier(.22,1,.36,1)',fill:'both'});
    surfaceRuns.set(element, animation);
    animation.finished.then(() => {
      if (surfaceRuns.get(element) !== animation) return;
      surfaceRuns.delete(element); delete element.dataset.slPhase; done(); animation.cancel();
    }).catch(() => {});
    return () => { if (surfaceRuns.get(element) === animation) { surfaceRuns.delete(element); delete element.dataset.slPhase; } animation.cancel(); };
  }
  function closeDialog(dialog, returnValue = '') {
    if (!dialog?.open || dialog.dataset.slPhase === 'closing') return;
    surfaceMotion(dialog, false, () => { if (dialog.open) dialog.close(returnValue); });
  }
  const iconRuns = new WeakMap();
  /* Google Material Symbols Rounded: pinned original SVGs, Apache-2.0; see icons/SOURCE.json. */
  const materialIcons = {
  "play": "<path d=\"M320-273v-414q0-17 12-28.5t28-11.5q5 0 10.5 1.5T381-721l326 207q9 6 13.5 15t4.5 19q0 10-4.5 19T707-446L381-239q-5 3-10.5 4.5T360-233q-16 0-28-11.5T320-273Z\"/>",
  "pause": "<path d=\"M640-200q-33 0-56.5-23.5T560-280v-400q0-33 23.5-56.5T640-760q33 0 56.5 23.5T720-680v400q0 33-23.5 56.5T640-200Zm-320 0q-33 0-56.5-23.5T240-280v-400q0-33 23.5-56.5T320-760q33 0 56.5 23.5T400-680v400q0 33-23.5 56.5T320-200Z\"/>",
  "stop": "<path d=\"M240-320v-320q0-33 23.5-56.5T320-720h320q33 0 56.5 23.5T720-640v320q0 33-23.5 56.5T640-240H320q-33 0-56.5-23.5T240-320Z\"/>",
  "mic": "<path d=\"M480-400q-50 0-85-35t-35-85v-240q0-50 35-85t85-35q50 0 85 35t35 85v240q0 50-35 85t-85 35Zm-40 240v-83q-92-13-157.5-78T203-479q-2-17 9-29t28-12q17 0 28.5 11.5T284-480q14 70 69.5 115T480-320q72 0 127-45.5T676-480q4-17 15.5-28.5T720-520q17 0 28 12t9 29q-14 91-79 157t-158 79v83q0 17-11.5 28.5T480-120q-17 0-28.5-11.5T440-160Z\"/>",
  "grid": "<path d=\"M200-520q-33 0-56.5-23.5T120-600v-160q0-33 23.5-56.5T200-840h160q33 0 56.5 23.5T440-760v160q0 33-23.5 56.5T360-520H200Zm0 400q-33 0-56.5-23.5T120-200v-160q0-33 23.5-56.5T200-440h160q33 0 56.5 23.5T440-360v160q0 33-23.5 56.5T360-120H200Zm400-400q-33 0-56.5-23.5T520-600v-160q0-33 23.5-56.5T600-840h160q33 0 56.5 23.5T840-760v160q0 33-23.5 56.5T760-520H600Zm0 400q-33 0-56.5-23.5T520-200v-160q0-33 23.5-56.5T600-440h160q33 0 56.5 23.5T840-360v160q0 33-23.5 56.5T760-120H600Z\"/>",
  "layers": "<path d=\"M161-366q-16-12-15.5-31.5T162-429q11-8 24-8t24 8l270 209 270-209q11-8 24-8t24 8q16 12 16.5 31.5T799-366L529-156q-22 17-49 17t-49-17L161-366Zm270 8L201-537q-31-24-31-63t31-63l230-179q22-17 49-17t49 17l230 179q31 24 31 63t-31 63L529-358q-22 17-49 17t-49-17Z\"/>",
  "palette": "<path d=\"M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 32.5-156t88-127Q256-817 330-848.5T488-880q80 0 151 27.5t124.5 76q53.5 48.5 85 115T880-518q0 115-70 176.5T640-280h-74q-9 0-12.5 5t-3.5 11q0 12 15 34.5t15 51.5q0 50-27.5 74T480-80ZM260-440q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm120-160q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm200 0q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm120 160q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Z\"/>",
  "pointer": "<path d=\"M419-80q-28 0-52.5-12T325-126L124-381q-8-9-7-21.5t9-20.5q20-21 48-25t52 11l74 45v-328q0-17 11.5-28.5T340-760q17 0 29 11.5t12 28.5v200h299q50 0 85 35t35 85v160q0 66-47 113T640-80H419Zm60-520q-17 0-28.5-11.5T439-640q0-2 5-20 8-14 12-28.5t4-31.5q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 17 4 31.5t12 28.5q3 5 4 10t1 10q0 17-11 28.5T202-600q-11 0-20.5-6T167-621q-13-22-20-47t-7-52q0-83 58.5-141.5T340-920q83 0 141.5 58.5T540-720q0 27-7 52t-20 47q-5 9-14 15t-20 6Z\"/>",
  "panel": "<path d=\"M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm280-80h280v-560H480v560Z\"/>",
  "copy": "<path d=\"M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360ZM200-80q-33 0-56.5-23.5T120-160v-520q0-17 11.5-28.5T160-720q17 0 28.5 11.5T200-680v520h400q17 0 28.5 11.5T640-120q0 17-11.5 28.5T600-80H200Z\"/>",
  "settings": "<path d=\"M433-80q-27 0-46.5-18T363-142l-9-66q-13-5-24.5-12T307-235l-62 26q-25 11-50 2t-39-32l-47-82q-14-23-8-49t27-43l53-40q-1-7-1-13.5v-27q0-6.5 1-13.5l-53-40q-21-17-27-43t8-49l47-82q14-23 39-32t50 2l62 26q11-8 23-15t24-12l9-66q4-26 23.5-44t46.5-18h94q27 0 46.5 18t23.5 44l9 66q13 5 24.5 12t22.5 15l62-26q25-11 50-2t39 32l47 82q14 23 8 49t-27 43l-53 40q1 7 1 13.5v27q0 6.5-2 13.5l53 40q21 17 27 43t-8 49l-48 82q-14 23-39 32t-50-2l-60-26q-11 8-23 15t-24 12l-9 66q-4 26-23.5 44T527-80h-94Zm49-260q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Z\"/>",
  "book": "<path d=\"M520-278q44-21 88.5-31.5T700-320q36 0 70.5 6t69.5 18v-396q-33-14-68.5-21t-71.5-7q-47 0-93 12t-87 36v394Zm-40 97q-14 0-26.5-3.5T430-194q-39-23-82-34.5T260-240q-42 0-82.5 11T100-198q-21 11-40.5-1T40-234v-482q0-11 5.5-21T62-752q47-23 96.5-35.5T260-800q58 0 113.5 15T480-740q51-30 106.5-45T700-800q52 0 101.5 12.5T898-752q11 5 16.5 15t5.5 21v482q0 23-19.5 35t-40.5 1q-37-20-77.5-31T700-240q-45 0-88 11.5T530-194q-11 6-23.5 9.5T480-181Zm80-428q0-9 6.5-18.5T581-640q29-10 58-15t61-5q20 0 39.5 2.5T778-651q9 2 15.5 10t6.5 18q0 17-11 25t-28 4q-14-3-29.5-4.5T700-600q-26 0-51 5t-48 13q-18 7-29.5-1T560-609Zm0 220q0-9 6.5-18.5T581-420q29-10 58-15t61-5q20 0 39.5 2.5T778-431q9 2 15.5 10t6.5 18q0 17-11 25t-28 4q-14-3-29.5-4.5T700-380q-26 0-51 4.5T601-363q-18 7-29.5-.5T560-389Zm0-110q0-9 6.5-18.5T581-530q29-10 58-15t61-5q20 0 39.5 2.5T778-541q9 2 15.5 10t6.5 18q0 17-11 25t-28 4q-14-3-29.5-4.5T700-490q-26 0-51 5t-48 13q-18 7-29.5-1T560-499Z\"/>",
  "download": "<path d=\"M480-337q-8 0-15-2.5t-13-8.5L308-492q-12-12-11.5-28t11.5-28q12-12 28.5-12.5T365-549l75 75v-286q0-17 11.5-28.5T480-800q17 0 28.5 11.5T520-760v286l75-75q12-12 28.5-11.5T652-548q11 12 11.5 28T652-492L508-348q-6 6-13 8.5t-15 2.5ZM240-160q-33 0-56.5-23.5T160-240v-80q0-17 11.5-28.5T200-360q17 0 28.5 11.5T240-320v80h480v-80q0-17 11.5-28.5T760-360q17 0 28.5 11.5T800-320v80q0 33-23.5 56.5T720-160H240Z\"/>",
  "check": "<path d=\"m382-354 339-339q12-12 28-12t28 12q12 12 12 28.5T777-636L410-268q-12 12-28 12t-28-12L182-440q-12-12-11.5-28.5T183-497q12-12 28.5-12t28.5 12l142 143Z\"/>",
  "close": "<path d=\"M480-424 284-228q-11 11-28 11t-28-11q-11-11-11-28t11-28l196-196-196-196q-11-11-11-28t11-28q11-11 28-11t28 11l196 196 196-196q11-11 28-11t28 11q11 11 11 28t-11 28L536-480l196 196q11 11 11 28t-11 28q-11 11-28 11t-28-11L480-424Z\"/>",
  "minus": "<path d=\"M240-440q-17 0-28.5-11.5T200-480q0-17 11.5-28.5T240-520h480q17 0 28.5 11.5T760-480q0 17-11.5 28.5T720-440H240Z\"/>",
  "square": "<path d=\"M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0 0v-560 560Z\"/>",
  "chevron": "<path d=\"M480-362q-8 0-15-2.5t-13-8.5L268-557q-11-11-11-28t11-28q11-11 28-11t28 11l156 156 156-156q11-11 28-11t28 11q11 11 11 28t-11 28L508-373q-6 6-13 8.5t-15 2.5Z\"/>",
  "code": "<path d=\"m193-479 155 155q11 11 11 28t-11 28q-11 11-28 11t-28-11L108-452q-6-6-8.5-13T97-480q0-8 2.5-15t8.5-13l184-184q12-12 28.5-12t28.5 12q12 12 12 28.5T349-635L193-479Zm574-2L612-636q-11-11-11-28t11-28q11-11 28-11t28 11l184 184q6 6 8.5 13t2.5 15q0 8-2.5 15t-8.5 13L668-268q-12 12-28 11.5T612-269q-12-12-12-28.5t12-28.5l155-155Z\"/>",
  "search": "<path d=\"M380-320q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l224 224q11 11 11 28t-11 28q-11 11-28 11t-28-11L532-372q-30 24-69 38t-83 14Zm0-80q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z\"/>"
};
  const materialViewBoxes = {"play": "0 -960 960 960", "pause": "0 -960 960 960", "stop": "0 -960 960 960", "mic": "0 -960 960 960", "grid": "0 -960 960 960", "layers": "0 -960 960 960", "palette": "0 -960 960 960", "pointer": "0 -960 960 960", "panel": "0 -960 960 960", "copy": "0 -960 960 960", "settings": "0 -960 960 960", "book": "0 -960 960 960", "download": "0 -960 960 960", "check": "0 -960 960 960", "close": "0 -960 960 960", "minus": "0 -960 960 960", "square": "0 -960 960 960", "chevron": "0 -960 960 960", "code": "0 -960 960 960", "search": "0 -960 960 960"};
  function setIcon(svg, name, animate = true) {
    if (!materialIcons[name] || svg._slIcon===name) return;
    const doc=svg.ownerDocument, view=doc.defaultView, ns='http://www.w3.org/2000/svg';
    const previous=svg._slIcon;
    iconRuns.get(svg)?.();
    const old=[...svg.childNodes];
    svg.classList.add('sl-icon','material');svg.classList.remove('filled','radix');
    svg.setAttribute('viewBox',materialViewBoxes[name]);svg.setAttribute('aria-hidden','true');svg.setAttribute('focusable','false');svg._slIcon=name;
    if(svg.dataset.slIcon!==name)svg.dataset.slIcon=name;
    const group=doc.createElementNS(ns,'g');group.innerHTML=materialIcons[name];svg.replaceChildren(group);
    if(!animate || !previous || view.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // Preserve the original rounded contours without distorting the source glyphs.
    const ghost=doc.createElementNS(ns,'g');old.forEach(node=>ghost.append(node));svg.prepend(ghost);
    const out=ghost.animate([{opacity:1,transform:'scale(1)'},{opacity:0,transform:'scale(.85)'}],{duration:150,fill:'both'});
    const incoming=group.animate([{opacity:0,transform:'scale(.85)'},{opacity:1,transform:'scale(1)'}],{duration:220,easing:'cubic-bezier(.22,1,.36,1)'});
    const stop=()=>{out.cancel();incoming.cancel();ghost.remove();};iconRuns.set(svg,stop);
    incoming.finished.then(()=>{if(iconRuns.get(svg)===stop){stop();iconRuns.delete(svg);}}).catch(()=>{});
  }
  /* CWBridge's character pop: 8px, 2px blur, 500ms spring, capped stagger. */
  function popInText(element) {
    textRuns.get(element)?.();
    const doc = element.ownerDocument, view = doc.defaultView;
    if (view.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};
    const walker = doc.createTreeWalker(element, view.NodeFilter.SHOW_TEXT);
    const texts = [];
    while (walker.nextNode()) if (!walker.currentNode.parentElement.closest('svg,script,style,[aria-hidden=true]')) texts.push(walker.currentNode);
    const segment = text => view.Intl?.Segmenter ? [...new view.Intl.Segmenter(undefined, {granularity:'grapheme'}).segment(text)].map(item => item.segment) : [...text];
    const count = texts.reduce((total, node) => total + segment(node.data).length, 0);
    const step = Math.min(70, 140 / Math.max(1, count - 1));
    const groups = [], animations = []; let index = 0;
    texts.forEach(node => {
      const text = node.data, group = doc.createElement('span'); group.className = 'sl-character-group';
      segment(text).forEach(character => {
        const span = doc.createElement('span'); span.className = 'sl-character'; span.textContent = character; group.append(span);
      });
      node.replaceWith(group); groups.push({group, node, text});
      [...group.children].forEach(span => animations.push(span.animate([
        {transform:'translateY(8px)',opacity:0,filter:'blur(2px)'},
        {transform:'translateY(0)',opacity:1,filter:'blur(0)'}
      ], {duration:500,delay:index++ * step,easing:'cubic-bezier(.34,1.45,.64,1)',fill:'backwards'})));
    });
    const stop = () => {
      animations.forEach(animation => animation.cancel());
      groups.forEach(({group,node,text}) => { if (group.parentNode && group.textContent === text) group.replaceWith(node); });
      if (textRuns.get(element) === stop) textRuns.delete(element);
    };
    textRuns.set(element, stop);
    Promise.all(animations.map(animation => animation.finished.catch(() => {}))).then(() => { if (textRuns.get(element) === stop) stop(); });
    return stop;
  }
  /* CWBridge row arrival: 40ms steps, capped at 360ms; no layout movement. */
  function reveal(container) {
    motionRuns.get(container)?.();
    const view = container.ownerDocument.defaultView;
    if (view.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};
    const nodes = [...container.children].filter(node => !node.hidden && !node.matches('.sl-hover-pill,.sl-tooltip,script,style'));
    const animations = nodes.map((node, index) => node.animate([
      { opacity: 0, filter: 'blur(2px)' }, { opacity: 1, filter: 'blur(0)' }
    ], { duration: 430, delay: index * Math.min(40, 360 / Math.max(1, nodes.length - 1)), easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' }));
    const stop = () => { animations.forEach(animation => animation.cancel()); motionRuns.delete(container); };
    motionRuns.set(container, stop);
    Promise.all(animations.map(animation => animation.finished.catch(() => {}))).then(() => { if (motionRuns.get(container) === stop) motionRuns.delete(container); });
    return stop;
  }
  function scrollFadeEdges(scrollTop, scrollHeight, clientHeight) {
    const overflow=scrollHeight-clientHeight>1;
    return {top:overflow&&scrollTop>1,bottom:overflow&&scrollHeight-clientHeight-scrollTop>1};
  }
  function init(root = document) {
    if (installations.has(root)) return installations.get(root);
    const doc = root.ownerDocument || root;
    const view = doc.defaultView;
    const host = root === doc ? doc.querySelector('.slate-ui') || doc.body : root;
    const disposers = [];
    const on = (node, type, handler, options) => { node.addEventListener(type, handler, options); disposers.push(() => node.removeEventListener(type, handler, options)); };
    const closest = (node, selector) => node instanceof view.Element ? node.closest(selector) : null;
    const owns = node => !!node && (root === doc || root.contains(node));

    // Keep native form, label and keyboard behavior while drawing CWBridge's check path.
    const checkControls=new Map();
    function syncChecks(){
      root.querySelectorAll('input.sl-check[type="checkbox"]').forEach(input=>{
        if(input.parentElement?.classList.contains('sl-check-control'))return;
        const wrapper=doc.createElement('span');wrapper.className='sl-check-control';
        const svg=doc.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 10.1668 10.1668');svg.setAttribute('aria-hidden','true');svg.setAttribute('focusable','false');
        const path=doc.createElementNS('http://www.w3.org/2000/svg','path');path.setAttribute('d','M1 5.52L3.92 9.17L9.17 1');svg.append(path);
        input.before(wrapper);wrapper.append(input,svg);checkControls.set(input,wrapper);
      });
      for(const [input,wrapper] of checkControls)if(!host.contains(input)){if(wrapper.parentElement)wrapper.before(input);wrapper.remove();checkControls.delete(input);}
    }
    syncChecks();const checkObserver=new view.MutationObserver(syncChecks);checkObserver.observe(host,{subtree:true,childList:true});
    disposers.push(()=>{checkObserver.disconnect();checkControls.forEach((wrapper,input)=>{if(input.parentElement===wrapper)wrapper.before(input);wrapper.remove();});checkControls.clear();});

    let switchDrag=null;const switchTimers=new Map(),switchClicks=new WeakMap();
    function settleSwitch(button,velocity=0){
      view.clearTimeout(switchTimers.get(button));button.classList.add('sl-switch-moving');
      button.style.setProperty('--sl-switch-stretch',String(1+Math.min(.38,velocity?Math.abs(velocity)*.22:.16)));
      switchTimers.set(button,view.setTimeout(()=>{button.classList.remove('sl-switch-moving');button.style.removeProperty('--sl-switch-stretch');switchTimers.delete(button);},150));
    }
    function finishSwitch(event,cancel=false){
      const drag=switchDrag;if(!drag||event.pointerId!==drag.id)return;switchDrag=null;
      const button=drag.button;button.classList.remove('sl-switch-dragging');button.style.removeProperty('--sl-switch-x');button.style.removeProperty('--sl-switch-scale');button.style.removeProperty('--sl-switch-stretch');
      if(button.hasPointerCapture(drag.id))button.releasePointerCapture(drag.id);
      if(drag.moved){switchClicks.set(button,Date.now()+300);if(!cancel&&!button.disabled&&button.isConnected){const checked=drag.position>=.5;if(button.checked!==checked){button.checked=checked;button.dispatchEvent(new view.Event('input',{bubbles:true}));button.dispatchEvent(new view.Event('change',{bubbles:true}));}settleSwitch(button,event.timeStamp-drag.lastTime<90?drag.velocity:0);}void button.offsetWidth;button.style.removeProperty('background-color');}
    }
    on(root,'pointerdown',event=>{const button=closest(event.target,'.sl-switch');if(!button||button.disabled||event.button!==0||!event.isPrimary)return;switchDrag={button,id:event.pointerId,start:event.clientX,position:button.checked?1:0,initial:button.checked?1:0,moved:false,lastX:event.clientX,lastTime:event.timeStamp,velocity:0};button.setPointerCapture(event.pointerId);});
    on(root,'pointermove',event=>{const drag=switchDrag;if(!drag||event.pointerId!==drag.id)return;if(drag.button.disabled){finishSwitch(event,true);return;}const delta=event.clientX-drag.start;if(!drag.moved&&Math.abs(delta)<4)return;drag.moved=true;const elapsed=event.timeStamp-drag.lastTime;if(elapsed>0)drag.velocity=Math.max(-2,Math.min(2,(event.clientX-drag.lastX)/elapsed));drag.lastX=event.clientX;drag.lastTime=event.timeStamp;drag.position=Math.max(0,Math.min(1,drag.initial+delta/14));drag.button.classList.add('sl-switch-dragging');drag.button.style.setProperty('--sl-switch-x',`${drag.position*14}px`);drag.button.style.setProperty('--sl-switch-scale',String(.72+drag.position*.28));drag.button.style.setProperty('--sl-switch-stretch',view.matchMedia('(prefers-reduced-motion: reduce)').matches?'1':String(1+Math.min(.38,Math.abs(drag.velocity)*.22)));drag.button.style.backgroundColor=`color-mix(in srgb, var(--sl-line-strong) ${Math.round((1-drag.position)*100)}%, var(--sl-accent))`;});
    on(root,'pointerup',event=>finishSwitch(event));on(root,'pointercancel',event=>finishSwitch(event,true));on(root,'lostpointercapture',event=>finishSwitch(event,true));
    on(root,'click',event=>{const button=closest(event.target,'.sl-switch');if(button&&switchClicks.get(button)>Date.now()){event.preventDefault();event.stopImmediatePropagation();switchClicks.delete(button);}},true);
    on(root,'change',event=>{if(event.target.matches?.('.sl-switch'))settleSwitch(event.target);});
    disposers.push(()=>{if(switchDrag)finishSwitch({pointerId:switchDrag.id},true);switchTimers.forEach((timer,button)=>{view.clearTimeout(timer);button.classList.remove('sl-switch-moving');});switchTimers.clear();});

    let tabDrag=null;const tabClicks=new WeakMap();
    function finishTabDrag(event,cancel=false){
      const drag=tabDrag;if(!drag||event.pointerId!==drag.id)return;tabDrag=null;
      drag.list.classList.remove('sl-tabs-dragging');
      if(drag.capture.hasPointerCapture(drag.id))drag.capture.releasePointerCapture(drag.id);
      if(drag.moved){tabClicks.set(drag.list,Date.now()+300);if(!cancel&&drag.target?.isConnected&&!drag.target.disabled){activateTab(drag.target,true);drag.target.focus({preventScroll:true});}else positionTabIndicator(drag.list);view.requestAnimationFrame(()=>{if(drag.indicator.isConnected){drag.indicator.style.removeProperty('--sl-tab-scale-x');drag.indicator.style.removeProperty('--sl-tab-scale-y');}});}
    }
    on(root,'pointerdown',event=>{
      const tab=closest(event.target,'[data-sl-tabs] [role=tab], [data-sl-tabs] .sl-tab[aria-pressed]');if(!tab||tab.disabled||event.button!==0||!event.isPrimary)return;
      const list=tab.closest('[data-sl-tabs]');positionTabIndicator(list);const indicator=list.querySelector(':scope > .sl-tab-indicator'),bounds=indicator.getBoundingClientRect(),rect=list.getBoundingClientRect();
      tabDrag={list,indicator,capture:tab,id:event.pointerId,x:event.clientX,y:event.clientY,left:bounds.left-rect.left-list.clientLeft,top:bounds.top-rect.top-list.clientTop,width:bounds.width,height:bounds.height,moved:false,target:tab,lastAxis:list.getAttribute('aria-orientation')==='vertical'?event.clientY:event.clientX,lastTime:event.timeStamp,velocity:0};tab.setPointerCapture(event.pointerId);
    });
    on(root,'pointermove',event=>{
      const drag=tabDrag;if(!drag||drag.id!==event.pointerId)return;const dx=event.clientX-drag.x,dy=event.clientY-drag.y;if(!drag.moved&&Math.hypot(dx,dy)<4)return;
      drag.moved=true;drag.list.classList.add('sl-tabs-dragging');const vertical=drag.list.getAttribute('aria-orientation')==='vertical';const axis=vertical?event.clientY:event.clientX,elapsed=event.timeStamp-drag.lastTime;if(elapsed>0)drag.velocity=Math.max(-2,Math.min(2,(axis-drag.lastAxis)/elapsed));drag.lastAxis=axis;drag.lastTime=event.timeStamp;
      const stretch=view.matchMedia('(prefers-reduced-motion: reduce)').matches?0:Math.min(.28,Math.abs(drag.velocity)*.16);drag.indicator.style.setProperty('--sl-tab-scale-x',String(vertical?1-stretch*.55:1+stretch));drag.indicator.style.setProperty('--sl-tab-scale-y',String(vertical?1+stretch:1-stretch*.55));
      const x=vertical?drag.left:Math.max(4,Math.min(drag.list.clientWidth-drag.width-4,drag.left+dx));const y=vertical?Math.max(4,Math.min(drag.list.clientHeight-drag.height-4,drag.top+dy)):drag.top;
      drag.indicator.style.transform=`translate(${x}px,${y}px)`;
      const rect=drag.list.getBoundingClientRect(),centerX=rect.left+x+drag.width/2,centerY=rect.top+y+drag.height/2;
      let distance=Infinity;for(const tab of drag.list.querySelectorAll('[role=tab]:not(:disabled), .sl-tab[aria-pressed]:not(:disabled)')){const b=tab.getBoundingClientRect(),d=Math.hypot(centerX-b.left-b.width/2,centerY-b.top-b.height/2);if(d<distance){distance=d;drag.target=tab;}}
    });
    on(root,'pointerup',event=>finishTabDrag(event));on(root,'pointercancel',event=>finishTabDrag(event,true));on(root,'lostpointercapture',event=>finishTabDrag(event,true));
    on(root,'click',event=>{const list=closest(event.target,'[data-sl-tabs]');if(list&&tabClicks.get(list)>Date.now()){event.preventDefault();event.stopImmediatePropagation();tabClicks.delete(list);}},true);
    disposers.push(()=>{if(tabDrag)finishTabDrag({pointerId:tabDrag.id},true);root.querySelectorAll('.sl-tab-indicator').forEach(indicator=>tabMotions.get(indicator)?.cancel());});

    const surfaces = new Set(), icons = new Set();
    function syncIcons() {
      root.querySelectorAll('svg[data-sl-icon],svg.sl-icon use[href^="#i-"]').forEach(node => {
        const svg=node.tagName.toLowerCase()==='use' ? node.ownerSVGElement : node;
        const name=svg.dataset.slIcon || node.getAttribute('href')?.slice(3);
        if(name){setIcon(svg,name,icons.has(svg));icons.add(svg);}
      });
    }
    syncIcons();
    const iconObserver = new view.MutationObserver(syncIcons);
    iconObserver.observe(host,{subtree:true,childList:true,attributes:true,attributeFilter:['data-sl-icon']});
    disposers.push(()=>{iconObserver.disconnect();icons.forEach(svg=>iconRuns.get(svg)?.());});
    const dialogObserver = new view.MutationObserver(records=>records.forEach(({target})=>{
      if(target.matches('.sl-dialog') && target.open && target.dataset.slPhase!=='closing'){surfaces.add(target);surfaceMotion(target,true);}
    }));
    dialogObserver.observe(host,{subtree:true,attributes:true,attributeFilter:['open']});
    disposers.push(()=>{dialogObserver.disconnect();surfaces.forEach(element=>{surfaceRuns.get(element)?.cancel();surfaceRuns.delete(element);delete element.dataset.slPhase;if(element.matches('dialog')&&element.open)element.close();else if(element.matches('.sl-menu'))element.hidden=true;});});
    const revealGroups = [...root.querySelectorAll('[data-sl-reveal]')];
    if (root.matches?.('[data-sl-reveal]')) revealGroups.unshift(root);
    revealGroups.forEach(group => disposers.push(reveal(group)));
    const textStops = new Set();
    root.querySelectorAll('[data-sl-text]').forEach(element => textStops.add(popInText(element)));
    if (root.matches?.('[data-sl-text]')) textStops.add(popInText(root));
    const labelObserver = new view.MutationObserver(records => {
      if (view.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const changed = new Set();
      for (const record of records) {
        const before = record.type === 'characterData' ? record.oldValue : [...record.removedNodes].map(node => node.textContent).join('');
        const after = record.type === 'characterData' ? record.target.data : [...record.addedNodes].map(node => node.textContent).join('');
        if (before === after) continue;
        const node = record.target.nodeType === 1 ? record.target : record.target.parentElement;
        const button = node?.closest('.sl-btn');
        if (!owns(button)) continue;
        let label = node.closest('span');
        if (!label || !button.contains(label)) {
          const texts = [...button.childNodes].filter(child => child.nodeType === 3 && child.data.trim());
          if (texts.length !== 1) continue;
          label = doc.createElement('span'); texts[0].replaceWith(label); label.append(texts[0]);
        }
        changed.add(label);
      }
      changed.forEach(label => {
        const stop = popInText(label); textStops.add(stop);
        view.setTimeout(() => textStops.delete(stop), 650);
      });
    });
    labelObserver.observe(host, {subtree:true, childList:true, characterData:true, characterDataOldValue:true});
    disposers.push(() => { labelObserver.disconnect(); textStops.forEach(stop => stop()); });
    const tabResize = new view.ResizeObserver(entries=>entries.forEach(({target})=>positionTabIndicator(target)));
    const tabObserver = new view.MutationObserver(()=>root.querySelectorAll('[data-sl-tabs]').forEach(list=>{tabResize.observe(list);positionTabIndicator(list);}));
    tabObserver.observe(host,{subtree:true,childList:true});
    root.querySelectorAll('[data-sl-tabs]').forEach(list=>{tabResize.observe(list);positionTabIndicator(list);});
    disposers.push(()=>{tabObserver.disconnect();tabResize.disconnect();root.querySelectorAll('.sl-tab-indicator').forEach(node=>node.remove());});
    // Neutral edge overlays live outside the scroll content, leaving the scrollbar intact.
    const fadeSurfaces=new Map();let fadeFrame=0,fadeDisposed=false;
    function removeFade(surface){const layers=fadeSurfaces.get(surface);if(layers){layers.top.remove();layers.bottom.remove();fadeSurfaces.delete(surface);fadeResize.unobserve(surface);layers.children?.forEach(child=>fadeResize.unobserve(child));}}
    function updateFades(){
      fadeFrame=0;if(fadeDisposed)return;
      const surfaces=[...root.querySelectorAll('[data-sl-scroll-fade]')];if(root.matches?.('[data-sl-scroll-fade]'))surfaces.unshift(root);
      for(const surface of fadeSurfaces.keys())if(!surfaces.includes(surface))removeFade(surface);
      for(const surface of surfaces){
        if(surface.closest('.sl-menu,dialog,.catalogue-preview'))continue;
        let layers=fadeSurfaces.get(surface);
        if(!layers){layers={};for(const edge of ['top','bottom']){const layer=doc.createElement('div');layer.className=`sl-scroll-fade ${edge}`;layer.setAttribute('aria-hidden','true');doc.body.append(layer);layers[edge]=layer;}fadeSurfaces.set(surface,layers);fadeResize.observe(surface);layers.children=new Set();}
        const children=new Set(surface.children);for(const child of layers.children)if(!children.has(child))fadeResize.unobserve(child);for(const child of children)fadeResize.observe(child);layers.children=children;
        const rect=surface.getBoundingClientRect(),height=surface.clientHeight,width=surface.clientWidth;
        const edges=scrollFadeEdges(surface.scrollTop,surface.scrollHeight,height);
        const visible=width>0&&height>0&&rect.bottom>0&&rect.top<view.innerHeight;
        let background='';for(let parent=surface;parent&&!background;parent=parent.parentElement){const color=view.getComputedStyle(parent).backgroundColor;if(color!=='rgba(0, 0, 0, 0)'&&color!=='transparent')background=color;}
        const surfaceStyle=view.getComputedStyle(surface);
        const requested=parseFloat(surfaceStyle.getPropertyValue('--sl-scroll-fade-size'))||20;
        const size=Math.min(requested,height/3);const focused=doc.activeElement;const focus=surface.contains(focused)&&focused!==surface&&focused.matches?.('a[href],button,input,select,textarea,summary,[tabindex]:not([tabindex="-1"])')?focused.getBoundingClientRect():null;
        const top=rect.top+surface.clientTop,left=rect.left+surface.clientLeft;
        const roundedClips=[];
        let clip={left:0,top:0,right:view.innerWidth,bottom:view.innerHeight};for(let parent=surface.parentElement;parent;parent=parent.parentElement){const style=view.getComputedStyle(parent);if(/auto|scroll|hidden|clip/.test(style.overflow+style.overflowX+style.overflowY)){const bounds=parent.getBoundingClientRect();clip.left=Math.max(clip.left,bounds.left+parent.clientLeft);clip.top=Math.max(clip.top,bounds.top+parent.clientTop);clip.right=Math.min(clip.right,bounds.left+parent.clientLeft+parent.clientWidth);clip.bottom=Math.min(clip.bottom,bounds.top+parent.clientTop+parent.clientHeight);if(style.borderRadius&&style.borderRadius!=='0px')roundedClips.push({bounds,radius:style.borderRadius});}}
        for(const edge of ['top','bottom']){
          const layer=layers[edge];const atEdge=!edges[edge];
          // A focused control at an edge keeps its complete focus outline visible.
          const focusAtEdge=focus&&focus.bottom>Math.max(top,clip.top)&&focus.top<Math.min(top+height,clip.bottom)&&focus.right>Math.max(left,clip.left)&&focus.left<Math.min(left+width,clip.right)&&(edge==='top'?focus.top<top+size:focus.bottom>top+height-size);
          layer.hidden=!visible||atEdge||!!focusAtEdge;
          // Use the complete scroll viewport so its original corner curves clip each band.
          layer.style.clipPath=`inset(${Math.max(0,clip.top-top)}px ${Math.max(0,left+width-clip.right)}px ${Math.max(0,top+height-clip.bottom)}px ${Math.max(0,clip.left-left)}px)`;
          layer.style.borderRadius=surfaceStyle.borderRadius;
          layer.style.left=`${left}px`;layer.style.top=`${top}px`;layer.style.width=`${width}px`;layer.style.height=`${height}px`;layer.style.backgroundSize=`100% ${size}px`;layer.style.setProperty('--sl-scroll-fade-color',background||'var(--sl-overlay)');
          // Intersect every rounded ancestor in its own coordinates, including padding offsets.
          if(layer._slClips?.length!==roundedClips.length){
            layer.replaceChildren();layer._slClips=[];let container=layer;
            for(const rounded of roundedClips){const wrapper=doc.createElement('div');wrapper.className='sl-scroll-fade-clip';container.append(wrapper);layer._slClips.push(wrapper);container=wrapper;}
            const band=doc.createElement('div');band.className=`sl-scroll-fade-band ${edge}`;container.append(band);layer._slBand=band;
          }
          roundedClips.forEach(({bounds,radius},index)=>{layer._slClips[index].style.clipPath=`inset(${bounds.top-top}px ${left+width-bounds.right}px ${top+height-bounds.bottom}px ${bounds.left-left}px round ${radius})`;});
          layer._slBand.style.borderRadius=surfaceStyle.borderRadius;layer._slBand.style.backgroundSize=`100% ${size}px`;
        }
        surface.toggleAttribute('data-sl-fade-top',!layers.top.hidden);surface.toggleAttribute('data-sl-fade-bottom',!layers.bottom.hidden);
      }
    }
    function scheduleFades(){if(!fadeFrame&&!fadeDisposed)fadeFrame=view.requestAnimationFrame(updateFades);}
    const fadeResize=new view.ResizeObserver(scheduleFades);
    const fadeObserver=new view.MutationObserver(records=>{if(records.some(record=>!record.target.closest?.('.sl-scroll-fade')))scheduleFades();});fadeObserver.observe(host,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['hidden','class','data-sl-scroll-fade']});
    on(doc,'scroll',scheduleFades,true);on(view,'resize',scheduleFades);on(root,'focusin',scheduleFades);on(root,'focusout',scheduleFades);scheduleFades();
    disposers.push(()=>{fadeDisposed=true;view.cancelAnimationFrame(fadeFrame);fadeResize.disconnect();fadeObserver.disconnect();for(const surface of [...fadeSurfaces.keys()]){surface.removeAttribute('data-sl-fade-top');surface.removeAttribute('data-sl-fade-bottom');removeFade(surface);}});
    const pills = new Map();
    let activeList = null, activeRow = null, pointer = null;
    let tipControl = null, tipAnchor = null, showTimer = 0, hideTimer = 0;
    let openMenu = null, menuTrigger = null;
    const tip = doc.createElement('div');
    tip.className = 'sl-tooltip'; tip.id = `sl-tooltip-${++nextId}`; tip.setAttribute('role', 'tooltip');
    const label = doc.createElement('span'); label.className = 'sl-tooltip-label'; tip.append(label); host.append(tip);
    function hidePill() {
      activeList?.classList.remove('sl-hovering');
      pills.get(activeList)?.classList.remove('visible');
      activeList = null; activeRow = null;
    }
    function movePill(list, row) {
      let pill = pills.get(list);
      if (!pill) { pill = doc.createElement('span'); pill.className = 'sl-hover-pill'; pill.setAttribute('aria-hidden', 'true'); pills.set(list, pill); list.append(pill); resize.observe(list); }
      const first = activeList !== list || !activeRow;
      if (activeList && activeList !== list) hidePill();
      if (first) pill.classList.add('no-anim');
      const a = row.getBoundingClientRect(), b = list.getBoundingClientRect();
      pill.style.transform = `translate3d(${a.left - b.left + list.scrollLeft - list.clientLeft}px,${a.top - b.top + list.scrollTop - list.clientTop}px,0)`;
      pill.style.width = `${a.width}px`; pill.style.height = `${a.height}px`;
      if (first) { void pill.offsetWidth; pill.classList.remove('no-anim'); }
      pill.classList.add('visible'); list.classList.add('sl-hovering'); activeList = list; activeRow = row;
    }
    function trackPill(target) {
      const row = closest(target, '[data-sl-row]:not(:disabled)'), list = closest(row, '[data-sl-hover]');
      if (owns(list)) movePill(list, row);
      else if (!activeList?.contains(target)) hidePill();
    }
    function retarget() { if (pointer) trackPill(doc.elementFromPoint(pointer.x, pointer.y)); else if (activeRow?.isConnected) movePill(activeList, activeRow); else hidePill(); }
    const resize = new view.ResizeObserver(retarget);
    function unlinkTip() {
      if (!tipAnchor) return;
      const ids = (tipAnchor.getAttribute('aria-describedby') || '').split(' ').filter(id => id && id !== tip.id);
      if (ids.length) tipAnchor.setAttribute('aria-describedby', ids.join(' ')); else tipAnchor.removeAttribute('aria-describedby');
    }
    function dropTip() { unlinkTip(); tipAnchor = null; tip.classList.remove('visible'); }
    function hideTip() { view.clearTimeout(showTimer); view.clearTimeout(hideTimer); dropTip(); }
    const neighbour = (a, b) => a && b && a !== b && a.parentElement === b.parentElement;
    function showTip(control, travel) {
      const text = control.dataset.slTooltip;
      if (!text || !control.isConnected || (control.matches('.sl-nav-row') && !control.closest('.sl-collapsed'))) { hideTip(); return; }
      const previous = travel ? tip.getBoundingClientRect() : null;
      label.textContent = text;
      const a = control.getBoundingClientRect(), b = tip.getBoundingClientRect();
      const maxX = Math.max(8, view.innerWidth - b.width - 8), maxY = Math.max(8, view.innerHeight - b.height - 8);
      const side = control.closest('.sl-sidebar') || control.dataset.slTooltipSide === 'right';
      let x = side ? a.right + 12 : a.left + (a.width - b.width) / 2;
      let y = side ? a.top + (a.height - b.height) / 2 : a.bottom + 8;
      if (side && x > maxX) x = a.left - b.width - 12;
      if (!side && y > maxY) y = a.top - b.height - 8;
      x = Math.max(8, Math.min(Math.round(x), maxX)); y = Math.max(8, Math.min(Math.round(y), maxY));
      label.classList.add('no-anim'); label.style.transform = `translate3d(${previous ? x - previous.left : 0}px,${previous ? y - previous.top : 0}px,0)`; label.style.opacity = previous ? '0' : '1';
      void label.offsetWidth; label.classList.remove('no-anim'); label.style.transform = 'translate3d(0,0,0)'; label.style.opacity = '1';
      if (!travel) tip.classList.add('no-anim'); tip.style.transform = `translate3d(${x}px,${y}px,0)`;
      if (!travel) { void tip.offsetWidth; tip.classList.remove('no-anim'); }
      unlinkTip(); tipAnchor = control;
      const ids = new Set((control.getAttribute('aria-describedby') || '').split(' ').filter(Boolean)); ids.add(tip.id); control.setAttribute('aria-describedby', [...ids].join(' ')); tip.classList.add('visible');
    }
    function enterTip(control, immediate) {
      if (tipControl === control && !immediate) return;
      tipControl = control; view.clearTimeout(showTimer); view.clearTimeout(hideTimer);
      const travel = tip.classList.contains('visible') && neighbour(tipAnchor, control);
      if (travel || immediate) showTip(control, travel); else { dropTip(); showTimer = view.setTimeout(() => showTip(control, false), 350); }
    }
    function leaveTip(event) {
      const control = closest(event.target, '[data-sl-tooltip]');
      if (!control || control.contains(event.relatedTarget)) return;
      tipControl = null; view.clearTimeout(showTimer);
      if (neighbour(tipAnchor, closest(event.relatedTarget, '[data-sl-tooltip]'))) return;
      view.clearTimeout(hideTimer); hideTimer = view.setTimeout(dropTip, 90);
    }
    function closeMenu(focus = true) { if (!openMenu) return; const menu=openMenu;menu.inert=true;surfaceMotion(menu,false,()=>{menu.hidden=true;menu.inert=false;}); menuTrigger?.setAttribute('aria-expanded', 'false'); hidePill(); if (focus) menuTrigger?.focus(); openMenu = null; menuTrigger = null; }
    function open(trigger) {
      const menu = doc.getElementById(trigger.dataset.slMenu);
      if (!owns(menu)) return;
      if (openMenu === menu) { closeMenu(); return; }
      closeMenu(false); openMenu = menu; menuTrigger = trigger; menu.hidden = false; menu.inert=false; surfaces.add(menu); trigger.setAttribute('aria-expanded', 'true');
      const rect = menu.getBoundingClientRect();
      menu.style.left = rect.right > view.innerWidth - 8 ? 'auto' : ''; menu.style.right = rect.right > view.innerWidth - 8 ? '0' : '';
      menu.style.top = rect.bottom > view.innerHeight - 8 ? 'auto' : ''; menu.style.bottom = rect.bottom > view.innerHeight - 8 ? 'calc(100% + 8px)' : '';
      menu.style.transformOrigin=menu.style.bottom ? 'bottom left' : 'top left';surfaceMotion(menu,true);
      menu.querySelector('[role^="menuitem"]:not(:disabled),[role="option"]:not(:disabled)')?.focus();
    }
    on(root, 'pointerover', event => {
      if (event.pointerType === 'touch') return;
      pointer = { x: event.clientX, y: event.clientY }; trackPill(event.target);
      const control = closest(event.target, '[data-sl-tooltip]'); if (control && view.matchMedia('(hover:hover)').matches) enterTip(control, false);
    });
    on(root, 'pointermove', event => { if (event.pointerType !== 'touch') { pointer = { x: event.clientX, y: event.clientY }; trackPill(event.target); } });
    on(root, 'pointerout', event => { leaveTip(event); if (activeList && !activeList.contains(event.relatedTarget) && !closest(event.relatedTarget, '[data-sl-row]')) hidePill(); });
    on(root, 'focusin', event => {
      const control = closest(event.target, '[data-sl-tooltip]'); if (control?.matches(':focus-visible')) enterTip(control, true);
      const row = closest(event.target, '[data-sl-row]'), list = closest(row, '[data-sl-hover]'); if (list && row.matches(':focus-visible') && !list.matches(':hover')) { pointer = null; movePill(list, row); }
    });
    on(root, 'focusout', event => { leaveTip(event); if (activeList && !activeList.contains(event.relatedTarget) && !activeList.matches(':hover')) hidePill(); });
    on(doc, 'pointerdown', event => { hideTip(); if (openMenu && !openMenu.contains(event.target) && !menuTrigger?.contains(event.target)) closeMenu(false); }, true);
    on(root, 'click', event => {
      const iconToggle=closest(event.target,'[data-sl-icon-toggle]');
      if(iconToggle){const names=iconToggle.dataset.slIconToggle.trim().split(/\s+/);const svg=iconToggle.querySelector('svg[data-sl-icon]');if(svg&&names.length===2&&names.every(name=>materialIcons[name])){const active=svg.dataset.slIcon!==names[1];setIcon(svg,active?names[1]:names[0]);iconToggle.setAttribute('aria-pressed',String(active));iconToggle.setAttribute('aria-label',`${active?names[1]:names[0]} icon state`);}}
      const tab = closest(event.target, '[data-sl-tabs] [role=tab], [data-sl-tabs] .sl-tab[aria-pressed]'); if (tab) activateTab(tab);
      const toggle = closest(event.target, '[data-sl-collapse]');
      if (toggle) { const shell = toggle.closest('.sl-shell'); if (shell) { const collapsed = shell.classList.toggle('sl-collapsed'); toggle.setAttribute('aria-expanded', String(!collapsed)); toggle.setAttribute('aria-label', collapsed ? 'Expand sidebar' : 'Collapse sidebar'); toggle.dataset.slTooltip = collapsed ? 'Expand sidebar' : 'Collapse sidebar'; hideTip(); retarget(); } }
      const trigger = closest(event.target, '[data-sl-menu]'); if (trigger) open(trigger);
      const item = closest(event.target, '[data-sl-value]');
      if (item && openMenu?.contains(item)) { if (openMenu.getAttribute('role') === 'listbox') { openMenu.querySelectorAll('[role=option]').forEach(option => option.setAttribute('aria-selected', String(option === item))); const value = menuTrigger?.querySelector('[data-sl-selected]'); if (value) value.textContent = item.textContent.trim(); } const source = menuTrigger; closeMenu(); source?.dispatchEvent(new view.CustomEvent('slate:select', { bubbles: true, detail: { value: item.dataset.slValue } })); }
      const dialogTrigger = closest(event.target, '[data-sl-dialog]'); if (dialogTrigger) { const dialog = doc.getElementById(dialogTrigger.dataset.slDialog); if (owns(dialog) && !dialog.open) { dialog._slTrigger = dialogTrigger; dialog.showModal(); } }
      const close = closest(event.target, '[data-sl-dialog-close]'); if (close) closeDialog(close.closest('dialog'));
    });
    on(root,'cancel',event=>{if(event.target.matches?.('.sl-dialog')){event.preventDefault();closeDialog(event.target);}},true);
    on(root,'submit',event=>{if(event.target.closest?.('.sl-dialog') && (event.submitter?.getAttribute('formmethod') || event.target.getAttribute('method'))==='dialog'){event.preventDefault();closeDialog(event.target.closest('.sl-dialog'),event.submitter?.value || '');}},true);
    on(root, 'close', event => { if (event.target.matches?.('dialog')) { surfaceRuns.get(event.target)?.cancel();surfaceRuns.delete(event.target);delete event.target.dataset.slPhase;event.target._slTrigger?.focus(); hidePill(); hideTip(); } }, true);
    on(root, 'keydown', event => {
      const tab = closest(event.target, '[data-sl-tabs] [role=tab], [data-sl-tabs] .sl-tab[aria-pressed]');
      if (tab && ['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(event.key)) { const list=tab.closest('[data-sl-tabs]');const vertical=list.getAttribute('aria-orientation')==='vertical';if ((vertical && ['ArrowLeft','ArrowRight'].includes(event.key)) || (!vertical && ['ArrowUp','ArrowDown'].includes(event.key))) return; const tabs=[...list.querySelectorAll('[role=tab]:not(:disabled), .sl-tab[aria-pressed]:not(:disabled)')];const index=tabs.indexOf(tab);const next=tabs[event.key==='Home'?0:event.key==='End'?tabs.length-1:(index+(['ArrowRight','ArrowDown'].includes(event.key)?1:-1)+tabs.length)%tabs.length];event.preventDefault();activateTab(next);next?.focus(); }
      if (event.key === 'Escape') { hideTip(); closeMenu(); }
      const trigger = closest(event.target, '[data-sl-menu]');
      if (trigger && ['ArrowDown', 'ArrowUp'].includes(event.key)) { event.preventDefault(); open(trigger); return; }
      if (openMenu?.contains(event.target)) {
        const rows = [...openMenu.querySelectorAll('[role^=menuitem]:not(:disabled),[role=option]:not(:disabled)')];
        const index = rows.indexOf(doc.activeElement);
        if (['ArrowDown','ArrowUp','Home','End'].includes(event.key)) { event.preventDefault(); rows[event.key === 'Home' ? 0 : event.key === 'End' ? rows.length - 1 : (index + (event.key === 'ArrowDown' ? 1 : -1) + rows.length) % rows.length]?.focus(); }
        if (event.key === 'Tab') closeMenu(false);
      }
    });
    on(doc, 'scroll', () => { retarget(); hideTip(); if (openMenu && !openMenu.contains(doc.activeElement)) closeMenu(false); }, true);
    on(view, 'resize', () => { retarget(); hideTip(); closeMenu(false); });
    const observer = new view.MutationObserver(() => { if (tipAnchor && (!tipAnchor.isConnected || tipAnchor.dataset.slTooltip !== label.textContent)) hideTip(); if (activeRow && !activeRow.isConnected) hidePill(); });
    observer.observe(host, { subtree: true, childList: true, attributes: true, attributeFilter: ['data-sl-tooltip'] });
    const dispose = () => { clearButtonFeedback(root); dismissToasts(root,true); hideTip(); closeMenu(false); hidePill(); disposers.forEach(stop => stop()); resize.disconnect(); observer.disconnect(); pills.forEach(pill => pill.remove()); tip.remove(); installations.delete(root); };
    installations.set(root, dispose); return dispose;
  }

  const feedbackRuns = new WeakMap(), feedbackRoots = new WeakMap();
  function clearButtonFeedback(root) { feedbackRoots.get(root)?.forEach(run=>run.restore(false)); }
  function buttonFeedback(button, { root=button.ownerDocument, label='Copied', duration=1600, preserveLabel=false } = {}) {
    const doc=button.ownerDocument,view=doc.defaultView;let run=feedbackRuns.get(button);
    if (!run) {
      const originalLabel=button.getAttribute('aria-label'),originalWidth=button.style.width,measuredWidth=button.getBoundingClientRect().width;
      const icon=button.querySelector('svg[data-sl-icon]');const originalIcon=icon?.dataset.slIcon;
      const textNodes=[...button.childNodes].filter(node=>node.nodeType===3);
      let text=preserveLabel?null:button.querySelector(':scope > span:not(.sl-feedback-announcement)');let createdText=false;
      if(!text&&!preserveLabel&&textNodes.some(node=>node.textContent.trim())){text=doc.createElement('span');textNodes.forEach(node=>text.append(node));button.append(text);createdText=true;}
      const originalText=text?.textContent;const glyph=icon||doc.createElementNS('http://www.w3.org/2000/svg','svg');
      if(!icon){glyph.classList.add('sl-icon','sl-feedback-icon');glyph.setAttribute('aria-hidden','true');button.prepend(glyph);}
      const announcement=doc.createElement('span');announcement.className='sl-feedback-announcement';announcement.setAttribute('role','status');announcement.setAttribute('aria-live','polite');button.append(announcement);
      if(!preserveLabel)button.style.width=`${measuredWidth}px`;
      const runs=feedbackRoots.get(root)||new Set();feedbackRoots.set(root,runs);
      run={text,glyph,announcement,timer:0,restore(animate=true){view.clearTimeout(run.timer);if(text){textRuns.get(text)?.();text.textContent=originalText;if(animate)popInText(text);if(createdText){const node=doc.createTextNode(originalText);text.replaceWith(node);}}if(icon)setIcon(icon,originalIcon,animate);else glyph.remove();announcement.remove();button.style.width=originalWidth;button.classList.remove('sl-copy-feedback');if(originalLabel===null)button.removeAttribute('aria-label');else button.setAttribute('aria-label',originalLabel);runs.delete(run);feedbackRuns.delete(button);}};
      feedbackRuns.set(button,run);runs.add(run);
    }
    view.clearTimeout(run.timer);button.classList.add('sl-copy-feedback');button.setAttribute('aria-label',label);
    if(run.text){textRuns.get(run.text)?.();run.text.textContent=label;popInText(run.text);}setIcon(run.glyph,'check');run.announcement.textContent=label;
    run.timer=view.setTimeout(()=>run.restore(),duration);return ()=>run.restore(false);
  }
  async function copyToClipboard(text, {trigger, root=trigger?.ownerDocument || global.document, preserveLabel=false} = {}) {
    const doc=root.ownerDocument||root,view=doc.defaultView;
    if(view.navigator.clipboard&&view.isSecureContext)await view.navigator.clipboard.writeText(String(text));
    else {const previous=doc.activeElement,input=doc.createElement('textarea');input.value=String(text);input.style.cssText='position:fixed;opacity:0;pointer-events:none';doc.body.append(input);try{input.select();if(!doc.execCommand('copy'))throw new Error('Clipboard is unavailable');}finally{input.remove();previous?.focus({preventScroll:true});}}
    if(trigger)buttonFeedback(trigger,{root,preserveLabel});
  }
  const toastHosts = new WeakMap();
  function toast(message, options = {}) {
    const root = options.root || global.document;
    const doc = root.ownerDocument || root, view = doc.defaultView;
    if (typeof message !== 'string' || !message.trim()) throw new TypeError('Toast requires a message');
    const tone = ['success','warning','error'].includes(options.tone) ? options.tone : '';
    if (options.action && (typeof options.action.label !== 'string' || !options.action.label.trim() || typeof options.action.onClick !== 'function')) throw new TypeError('Toast action requires label and onClick');
    const duration = options.duration ?? (tone === 'error' || options.action ? 0 : 5000);
    if (!Number.isFinite(duration) || duration < 0) throw new TypeError('Toast duration must be a non-negative finite number');
    let host = toastHosts.get(root);
    const key = !options.action && (tone === '' || tone === 'success') ? `${tone}\u0000${message.trim()}` : null;
    const repeated = key && host && [...host.children].find(node=>!node._slClosing&&node._slToastKey===key);
    if (repeated) { repeated._slRefresh(duration,doc.activeElement); return repeated._slHandle; }
    if (!host) {
      host = doc.createElement('div'); host.className = 'sl-toasts'; host.setAttribute('aria-label', 'Notifications'); (root.body || root).append(host); toastHosts.set(root, host);
      let frame=0;
      const update=()=>{frame=0;const children=[...host.children];const total=children.reduce((height,node)=>height+node.offsetHeight,0)+Math.max(0,children.length-1)*8;const overflowing=total>view.innerHeight-40;if(host.classList.contains('sl-toast-overflow')!==overflowing)host.classList.toggle('sl-toast-overflow',overflowing);};
      const schedule=()=>{if(!frame)frame=view.requestAnimationFrame(update);};
      const resize=new view.ResizeObserver(schedule);resize.observe(host);view.addEventListener('resize',schedule);
      host._slLayout=()=>{[...host.children].forEach(node=>resize.observe(node));schedule();};
      host._slUnobserve=node=>resize.unobserve(node);
      host._slStop=()=>{view.cancelAnimationFrame(frame);resize.disconnect();view.removeEventListener('resize',schedule);};
    }
    const node = doc.createElement('div'); node.className = 'sl-toast'; if (tone) node.classList.add(tone);
    let previousFocus = doc.activeElement;
    const text = doc.createElement('span'); text.setAttribute('role', tone === 'error' ? 'alert' : 'status'); text.textContent = message; node.append(text);
    let timer, started, remaining = duration, closed = false;
    let exitAnimation=null,removed=false;
    function remove(){if(removed)return;removed=true;exitAnimation?.cancel();host._slUnobserve(node);node.remove();if(!host.children.length){host._slStop();host.remove();toastHosts.delete(root);}else host._slLayout();}
    function dismiss(immediate=false) {
      if(immediate===true){closed=true;view.clearTimeout(timer);remove();return;}
      if(closed)return;closed=true;node._slClosing=true;view.clearTimeout(timer);
      if(node.contains(doc.activeElement)&&previousFocus?.isConnected)previousFocus.focus();
      node.inert=true;
      if(!node.animate||view.matchMedia?.('(prefers-reduced-motion: reduce)').matches){remove();return;}
      const current=view.getComputedStyle(node);
      exitAnimation=node.animate([{opacity:current.opacity,transform:current.transform},{opacity:0,transform:'translateY(6px) scale(.97)'}],{duration:160,easing:'cubic-bezier(.4,0,1,1)',fill:'both'});
      exitAnimation.finished.then(remove).catch(()=>{});
    }
    if (options.action) { const action = doc.createElement('button'); action.className = 'sl-btn small'; action.textContent = options.action.label; action.addEventListener('click', () => { options.action.onClick(); dismiss(); }); node.append(action); }
    const close = doc.createElement('button'); close.className = 'sl-btn icon small'; close.setAttribute('aria-label','Dismiss notification'); close.innerHTML = '<svg class="sl-icon" data-sl-icon="close" aria-hidden="true"></svg>'; close.addEventListener('click',dismiss); node.append(close);
    function pause() { if (timer) { view.clearTimeout(timer); timer = null; remaining = Math.max(0, remaining - (Date.now() - started)); } }
    function resume() { if (!timer && remaining > 0 && !closed && !node.matches(':hover') && !node.contains(doc.activeElement)) { started = Date.now(); timer = view.setTimeout(dismiss, remaining); } }
    node.addEventListener('pointerenter',pause); node.addEventListener('pointerleave',resume); node.addEventListener('focusin',pause); node.addEventListener('focusout',()=>view.setTimeout(resume,0));
    node.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();dismiss();}});
    node._slRefresh=(nextDuration,focus)=>{view.clearTimeout(timer);timer=null;remaining=nextDuration;if(!node.contains(focus))previousFocus=focus;resume();};
    node._slToastKey=key;node._slDismiss=dismiss;node._slHandle={dismiss,element:node};
    host.append(node); setIcon(close.querySelector('svg'),'close',false); resume();host._slLayout();
    return node._slHandle;
  }
  function dismissToasts(root = global.document, immediate=false) { const host = toastHosts.get(root); if (host) [...host.children].forEach(node=>node._slDismiss(immediate)); }
  function positionTabIndicator(list) {
    if(list.classList.contains('sl-tabs-dragging'))return;
    const selected = list.querySelector('[role="tab"][aria-selected="true"], .sl-tab[aria-pressed="true"]'); if (!selected || !list.isConnected) return;
    let indicator = list.querySelector(':scope > .sl-tab-indicator');
    if (!indicator) { indicator=selected.ownerDocument.createElement('span'); indicator.className='sl-tab-indicator'; indicator.setAttribute('aria-hidden','true'); list.append(indicator); }
    const a=selected.getBoundingClientRect(), b=list.getBoundingClientRect();
    indicator.style.transform=`translate(${a.left-b.left-list.clientLeft+list.scrollLeft}px,${a.top-b.top-list.clientTop+list.scrollTop}px)`; indicator.style.width=`${a.width}px`;indicator.style.height=`${a.height}px`;
  }
  const tabMotions=new WeakMap();
  function activateTab(tab,fromDrag=false) {
    const list = tab.closest('[data-sl-tabs]'); if (!list || tab.disabled) return;
    const doc = tab.ownerDocument;
    list.querySelectorAll('[role="tab"], .sl-tab[aria-pressed]').forEach(item=>{const selected=item===tab;item.setAttribute(item.hasAttribute('aria-pressed')?'aria-pressed':'aria-selected',String(selected));item.tabIndex=selected?0:-1;const panel=doc.getElementById(item.getAttribute('aria-controls'));if(panel)panel.hidden=!selected;});
    positionTabIndicator(list);
    const indicator=list.querySelector(':scope > .sl-tab-indicator');tabMotions.get(indicator)?.cancel();
    if(indicator&&!fromDrag&&!doc.defaultView.matchMedia('(prefers-reduced-motion: reduce)').matches)tabMotions.set(indicator,indicator.animate([{scale:'1 1'},{scale:'1.06 .94',offset:.35},{scale:'1 1'}],{duration:220,easing:'cubic-bezier(.22,1,.36,1)'}));
    list.dispatchEvent(new doc.defaultView.CustomEvent('slate:tab',{bubbles:true,detail:{value:tab.dataset.slValue || tab.id}}));
  }
  const api = { init, reveal, popInText, setIcon, closeDialog, toast, dismissToasts, buttonFeedback, copyToClipboard, version: '0.1.0' };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (global) global.SlateUI = api;
})(typeof window !== 'undefined' ? window : null);
