const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=__dirname;
for(const file of ['slate.js','gallery.js','catalogue.js'])new vm.Script(fs.readFileSync(path.join(root,file),'utf8'),{filename:file});
for(const file of ['index.html','templates/workspace.html','templates/overlay.html']){
 const html=fs.readFileSync(path.join(root,file),'utf8');
 assert(!/\btitle=/.test(html),`${file}: native title tooltip`);
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(match=>match[1]);assert.equal(new Set(ids).size,ids.length,`${file}: duplicate IDs`);
 for(const match of html.matchAll(/\b(?:src|href)="([^"#][^"]*)"/g)){const link=match[1];if(/^[a-z]+:/i.test(link))continue;const resolved=path.resolve(path.dirname(path.join(root,file)),link.split('#')[0]);if(link==='Slate-UI.zip'&&!fs.existsSync(resolved))continue;assert(fs.existsSync(resolved),`${file}: broken link ${link}`);}
 for(const match of html.matchAll(/\bdata-sl-(?:menu|dialog)="([^"]+)"/g))assert(ids.includes(match[1]),`${file}: missing target ${match[1]}`);
 assert(html.includes('slate.css')&&html.includes('slate.js'),`${file}: kit assets missing`);
}
const css=fs.readFileSync(path.join(root,'slate.css'),'utf8');
for(const [token,value] of Object.entries({'canvas':'#181818','overlay':'#242424','surface':'#292929','raised':'#2d2d2d','hover':'#343434','accent':'#2563eb','accent-hover':'#1d4ed8'}))assert(css.includes(`--sl-${token}:${value}`),`Shared token drift: ${token}`);
const decorativeCss=css.replace(/linear-gradient\(to (?:bottom|top),var\(--sl-scroll-fade-color\),transparent\)/g,'');
assert(!/text-transform\s*:\s*uppercase|(?:linear|radial)-gradient/.test(decorativeCss),'Unexpected uppercase or decorative gradient');
assert(css.includes('prefers-reduced-motion'),'Missing reduced motion');
for(const weight of [400,500,600])assert(fs.existsSync(path.join(root,`fonts/inter-${weight}.woff2`)),'Missing local font');
const pkg=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'));
assert(fs.existsSync(path.join(root,pkg.exports['./react'].import)),'Missing React adapter');
assert(fs.existsSync(path.join(root,pkg.exports['./react'].types)),'Missing React types');
assert.equal(require('./slate.js').version,pkg.version,'Version mismatch');
const iconSource=JSON.parse(fs.readFileSync(path.join(root,'icons/SOURCE.json'),'utf8'));
const iconCode=fs.readFileSync(path.join(root,'slate.js'),'utf8');
const bundledIcons=JSON.parse(iconCode.match(/const materialIcons = (\{[\s\S]*?\});\s*const materialViewBoxes/)[1]);
assert(fs.existsSync(path.join(root,'LICENSE-Material-Symbols.txt')),'Missing Material Symbols license');
for(const [alias,source] of Object.entries(iconSource.aliases)){
 const svg=fs.readFileSync(path.join(root,'icons',source.file),'utf8');
 const geometry=svg.match(/<svg[^>]*>([\s\S]*)<\/svg>/)[1].trim();
 assert.equal(bundledIcons[alias],geometry,`Material Symbols geometry drift: ${alias}`);
}
for(const file of ['index.html','catalogue.js','templates/workspace.html','templates/overlay.html']){
 const markup=fs.readFileSync(path.join(root,file),'utf8');
 for(const match of markup.matchAll(/data-sl-icon="([a-z-]+)"/g))assert(bundledIcons[match[1]],`${file}: unknown icon ${match[1]}`);
 assert(!/<use\s|<symbol\s/.test(markup),`${file}: obsolete sprite geometry`);
}
const catalogueCode=fs.readFileSync(path.join(root,'catalogue.js'),'utf8');
const componentIds=[...catalogueCode.matchAll(/^add\('([^']+)'/gm)].map(match=>match[1]);
assert.equal(componentIds.length,26,'Unexpected catalogue component count');
const purposes=vm.runInNewContext('('+catalogueCode.match(/const purposes=(\{[\s\S]*?\});/)[1]+')');
for(const id of componentIds)assert(typeof purposes[id]==='string' && purposes[id].length>10,`Missing concrete component purpose: ${id}`);
assert.equal(new Set(componentIds).size,componentIds.length,'Duplicate catalogue route');
const fadeEdges=vm.runInNewContext('('+iconCode.match(/function scrollFadeEdges\([\s\S]*?\n  \}/)[0]+')');
for(const [top,total,height,expected] of [[0,800,400,{top:false,bottom:true}],[200,800,400,{top:true,bottom:true}],[400,800,400,{top:true,bottom:false}],[0,400,400,{top:false,bottom:false}],[1,801,400,{top:false,bottom:true}],[400.5,801,400,{top:true,bottom:false}]])assert.equal(JSON.stringify(fadeEdges(top,total,height)),JSON.stringify(expected),'Scroll fade edge state mismatch');
// A browser-shaped empty root verifies init completes and installs delegated handlers.
// Syntax checks alone cannot catch temporal-dead-zone failures in lifecycle setup.
const registered=new Map(),frames=new Map();let frameId=0;
function fakeNode(){const node={nodeType:1,children:[],childNodes:[],classList:{add(){},remove(){},contains(){return false;}},append(child){this.children.push(child);},remove(){},querySelectorAll(){return [];},contains(){return false;},matches(){return false;},setAttribute(){},removeAttribute(){},getAttribute(){return null;}};node.addEventListener=(type,handler)=>{let events=registered.get(node);if(!events){events=new Map();registered.set(node,events);}let handlers=events.get(type);if(!handlers){handlers=new Set();events.set(type,handlers);}handlers.add(handler);};node.removeEventListener=(type,handler)=>registered.get(node)?.get(type)?.delete(handler);return node;}
const fakeBody=fakeNode(),fakeDocument=fakeNode(),fakeView=fakeNode();
fakeDocument.body=fakeBody;fakeDocument.querySelector=()=>fakeBody;fakeDocument.createElement=()=>fakeNode();fakeDocument.defaultView=fakeView;
fakeView.Element=class {};fakeView.MutationObserver=class {observe(){}disconnect(){}};fakeView.ResizeObserver=class {observe(){}unobserve(){}disconnect(){}};fakeView.matchMedia=()=>({matches:false});fakeView.clearTimeout=()=>{};fakeView.requestAnimationFrame=callback=>{frames.set(++frameId,callback);return frameId;};fakeView.cancelAnimationFrame=id=>frames.delete(id);
const kit=require('./slate.js');const smokeDispose=kit.init(fakeDocument);
assert.equal(typeof smokeDispose,'function','init did not return lifecycle disposer');
assert.equal(kit.init(fakeDocument),smokeDispose,'Repeated init duplicates lifecycle');
assert.equal(registered.get(fakeDocument).get('click').size,3,'Delegated click and drag guard handlers missing');
assert.equal(registered.get(fakeDocument).get('keydown').size,1,'Delegated keyboard handler missing');
smokeDispose();assert.equal(frames.size,0,'Pending init animation frame not disposed');
for(const events of registered.values())for(const handlers of events.values())assert.equal(handlers.size,0,'Lifecycle listener leaked');
// Exercise actual toast deduplication/timers independently of SVG rendering.
const toastTimers=new Map();let toastTimerId=0;const toastView=fakeNode();
toastView.ResizeObserver=fakeView.ResizeObserver;toastView.innerHeight=800;toastView.requestAnimationFrame=fakeView.requestAnimationFrame;toastView.cancelAnimationFrame=fakeView.cancelAnimationFrame;toastView.setTimeout=callback=>{toastTimers.set(++toastTimerId,callback);return toastTimerId;};toastView.clearTimeout=id=>toastTimers.delete(id);
function toastNode(){const node=fakeNode();node.offsetHeight=48;node.dataset={};node.querySelector=()=>({});node.append=child=>{node.children.push(child);child.parentElement=node;};node.remove=()=>{if(node.parentElement)node.parentElement.children=node.parentElement.children.filter(child=>child!==node);};node.matches=selector=>selector===':hover'&&!!node._hover;node.contains=target=>node===target||node.children.some(child=>child.contains?.(target));return node;}
const toastRoot=toastNode();toastRoot.body=toastNode();toastRoot.defaultView=toastView;toastRoot.createElement=toastNode;toastRoot.activeElement={isConnected:true,focus(){}};
const toastImplementation=iconCode.slice(iconCode.indexOf('  function toast(message'),iconCode.indexOf('  function positionTabIndicator'));
const toastContext=vm.createContext({toastHosts:new WeakMap(),setIcon(){},global:{document:toastRoot}});vm.runInContext(toastImplementation,toastContext);
const copied=toastContext.toast('Copied to clipboard.',{root:toastRoot});const duplicate=toastContext.toast('Copied to clipboard.',{root:toastRoot});
assert.equal(copied.element,duplicate.element,'Equivalent notification duplicated');assert.equal(toastTimers.size,1,'Repeated notification did not refresh one timer');
const toastHost=toastRoot.body.children[0];assert.equal(toastHost.children.length,1,'Duplicate message stacked');
copied.element._hover=true;for(const handler of registered.get(copied.element).get('pointerenter'))handler();assert.equal(toastTimers.size,0,'Hover did not pause notification timer');
toastContext.toast('Copied to clipboard.',{root:toastRoot});assert.equal(toastHost.children.length,1,'Paused notification duplicated');assert.equal(toastTimers.size,0,'Repeated hovered message resumed its timer');
toastContext.toast('Connection unavailable.',{root:toastRoot,tone:'error'});toastContext.toast('Connection unavailable.',{root:toastRoot,tone:'error'});assert.equal(toastHost.children.length,3,'Errors silently deduplicated');
toastContext.toast('Item moved.',{root:toastRoot,action:{label:'Undo',onClick(){}}});toastContext.toast('Item moved.',{root:toastRoot,action:{label:'Undo',onClick(){}}});assert.equal(toastHost.children.length,5,'Actionable messages silently deduplicated');
toastContext.dismissToasts(toastRoot);assert.equal(toastRoot.body.children.length,0,'Toast host leaked');assert.equal(toastTimers.size,0,'Toast timers leaked');assert.equal(frames.size,0,'Toast layout frame leaked');
console.log('Slate UI checks passed: syntax, links, IDs, interaction targets, shared tokens, fonts, package exports and original Material Symbols Rounded geometry.');

