import { createMedia } from './media.js?v=22';
import { createComparison } from './comparison.js?v=6';
const el = (tag, className, text) => { const node=document.createElement(tag);node.className=className;if(text)node.textContent=text;return node; };
// Timers only run while a block is visible. Manual choices persist until Auto is resumed.
function clock(element, root, tick, delay) {
 const abort=new AbortController(), reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let visible=false, timer=0, manual=false;
 const stop=()=>{clearTimeout(timer);timer=0;};
 const schedule=()=>{stop();if(visible&&!document.hidden&&!manual&&!reduced.matches&&!document.documentElement.hasAttribute('data-viewer-open')) timer=setTimeout(()=>{tick();schedule();},delay());};
 const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;schedule();},{root,threshold:0.1});observer.observe(element);
 document.addEventListener('visibilitychange',schedule,{signal:abort.signal});
 document.addEventListener('portfolio-viewer-change',schedule,{signal:abort.signal});
 reduced.addEventListener('change',schedule,{signal:abort.signal});
 return {manual(){manual=true;stop();},auto(){manual=false;schedule();},dispose(){stop();observer.disconnect();abort.abort();}};
}
export function createCycle(items,label,root,interval=3000) {
 const element=el('section','case-cycle'), stage=el('div','case-cycle-stage'), controls=el('div','case-controls');
 let index=0, ready=false;const figures=items.map(createMedia);
 stage.style.aspectRatio=`${items[0].width}/${items[0].height}`;
 Promise.all(figures.map(figure=>{const image=figure.querySelector('img');image.loading='eager';return image.decode().catch(()=>{});})).then(()=>{ready=true;});
 figures.forEach((figure,i)=>{figure.hidden=i!==0;stage.append(figure);});
 const paint=()=>{figures.forEach((figure,i)=>figure.hidden=i!==index);buttons.forEach((button,i)=>button.setAttribute('aria-pressed',String(i===index)));};
 const buttons=items.map((item,i)=>{const button=el('button','',String(i+1).padStart(2,'0'));button.type='button';button.setAttribute('aria-label',`${label}: вариант ${i+1}`);button.addEventListener('click',()=>{timer.manual();index=i;paint();auto.setAttribute('aria-pressed','false');});return button;});
 const next=el('button','case-cycle-next');next.type='button';next.setAttribute('aria-label',`${label}: следующий вариант`);next.addEventListener('click',()=>{timer.manual();index=(index+1)%items.length;paint();auto.setAttribute('aria-pressed','false');});stage.append(next);figures.forEach(figure=>figure.querySelector('img')?.setAttribute('tabindex','-1'));
 const auto=el('button','','Авто');auto.type='button';auto.setAttribute('aria-pressed','true');auto.addEventListener('click',()=>{timer.auto();auto.setAttribute('aria-pressed','true');});
 controls.append(el('span','case-controls-label',label),...buttons,auto);element.append(controls,stage);
 const timer=clock(element,root,()=>{if(ready){index=(index+1)%items.length;paint();}},()=>interval);paint();
 return {element,dispose:timer.dispose};
}
export function createCaseComparison(block,root) {
 const [before,after]=block.media;
 const comparison=createComparison({before:before.src,after:after.src,width:after.width,height:after.height,label:block.label,initial:96,afterFirst:true,hintOutside:true},root);
 comparison.element.classList.add('case-comparison');if(block.half)comparison.element.classList.add('case-half');
 return comparison;
}
export function createSolarHero(items,root) {
 const [photo,machine,menu]=items, element=el('section','solar-inspection');
 const frame=el('div','solar-inspection-frame');frame.style.aspectRatio=`${photo.width}/${photo.height}`;
 const image=el('img','solar-base');image.src=photo.src;image.alt=photo.alt;image.width=photo.width;image.height=photo.height;frame.append(image);
 const overlay=el('div','solar-detections');overlay.setAttribute('aria-hidden','true');
 // Boxes are registered to the supplied photograph, in percent of its native dimensions.
 const targets=[{x:19.2,y:37.6,w:15,h:7.3,name:'01 / Игровой автомат'}, {x:60,y:58,w:27.5,h:31.5,name:'02 / Лимонадная станция'}, {x:61.8,y:50.4,w:4.8,h:8.5,name:'03 / Меню'}];
 for(const [i,t] of targets.entries()){
  const sharp=el('img','solar-sharp');sharp.src=photo.src;sharp.alt='';sharp.style.clipPath=`inset(${t.y}% ${100-t.x-t.w}% ${100-t.y-t.h}% ${t.x}%)`;
  const box=el('div',`solar-target solar-target-${i}`);box.style.cssText=`left:${t.x}%;top:${t.y}%;width:${t.w}%;height:${t.h}%`;
  box.append(el('span','solar-target-label',t.name));overlay.append(sharp,box);
 }
 frame.append(overlay);
 const details=el('div','solar-object-index');
 for(const [i,item] of [machine,menu].entries()) {const card=el('figure','solar-object');const img=el('img','');img.src=item.src;img.alt=item.alt;card.append(el('figcaption','',`${i===0?'01':'03'} / ${item.alt}`),img);details.append(card);}
 frame.append(details);
 const controls=el('div','case-controls'), toggle=el('button','','Выделить объекты'), auto=el('button','','Авто');toggle.type=auto.type='button';
 let active=false;const paint=()=>{element.classList.toggle('is-inspecting',active);toggle.setAttribute('aria-pressed',String(active));toggle.textContent=active?'Скрыть выделение':'Выделить объекты';details.setAttribute('aria-hidden',String(!active));};
 controls.append(el('span','case-controls-label','Solar Staff / Объекты стенда'),toggle,auto);element.append(controls,frame);
 const timer=clock(element,root,()=>{active=!active;paint();},()=>active?5000:2000);
 auto.setAttribute('aria-pressed','true');toggle.addEventListener('click',()=>{timer.manual();auto.setAttribute('aria-pressed','false');active=!active;paint();});auto.addEventListener('click',()=>{active=false;paint();timer.auto();auto.setAttribute('aria-pressed','true');});paint();
 return {element,dispose:timer.dispose};
}
export function createClubPattern(root) {
 const element=el('section','mcc-pattern');element.setAttribute('aria-label','Графический паттерн Media Case Club');
 for(let i=0;i<3;i++) { const column=el('div',`mcc-pattern-column column-${i}`), track=el('div','mcc-pattern-track');for(let n=0;n<2;n++){const group=el('div','mcc-pattern-group');for(let j=0;j<3;j++){const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 100 100');svg.setAttribute('aria-hidden','true');svg.innerHTML='<path fill="currentColor" d="M88 18 A49 49 0 1 0 88 82 L48 50 Z"/><path fill="none" stroke="currentColor" stroke-width="4" d="M98 31L65 50L98 69Z"/>';group.append(svg);}track.append(group);}column.append(track);element.append(column);}
 const observer=new IntersectionObserver(entries=>element.classList.toggle('is-visible',entries[0].isIntersecting),{root});observer.observe(element);
 return {element,dispose(){observer.disconnect();}};
}
export function createClubBadge(items,root) {
 const element=el('section','mcc-badge-row'), left=el('div','mcc-announcement'), cleanups=[];
 const before=items[0], variants=items.slice(1,5);
 const comparison=createCaseComparison({media:[before,variants[0]],label:'Media Case Club возвращается'},root);left.append(comparison.element);cleanups.push(comparison.dispose);
 const thumbs=el('div','mcc-announcement-variants');variants.slice(1).forEach(item=>thumbs.append(createMedia(item)));left.append(thumbs,createMedia(items[5]));
 element.append(left);
 return {element,dispose(){cleanups.forEach(fn=>fn());}};
}

export function createQrComparison(block,root) {
 const element=el('section','case-qr-row');const comparison=createCaseComparison({...block,media:block.media.slice(0,2)},root);element.append(comparison.element,createMedia(block.media[2]));return {element,dispose:comparison.dispose};
}
