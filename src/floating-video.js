import { createMedia } from './media.js?v=22';
import { registerSoundVideo } from './site-sound.js?v=3';
import { mobileLayout } from './responsive.js';

// Share playback, visibility and positioning across floating project videos.
export function createFloatingVideo({ source, label, stage, element, target, anchor, scale = .37, overhang = .85, offset = .55, lift = 0 }) {
  if (mobileLayout.matches) {
    const figure = createMedia({ type:'video',src:source,width:1,height:1,autoplay:true,alt:label });
    anchor.append(figure);
    return () => { figure.querySelector('video')?.pause(); figure.remove(); };
  }
  const layer = document.createElement('div'); layer.className = 'registration-video-layer'; layer.hidden = true;
  const video = document.createElement('video');
  video.playsInline = true; video.preload = 'none'; video.muted = true;
  video.setAttribute('aria-label', label);
  layer.append(video);
  document.body.append(layer);
  const sound = registerSoundVideo(video, source);
  const abort = new AbortController();
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let raf=0, visible=false, disposed=false;
  function position() {
    raf=0;
    if(disposed)return;
    const mobile=mobileLayout.matches;
    const bounds=(mobile ? anchor : target).getBoundingClientRect();
    const size=mobile ? bounds.width : Math.min(300,bounds.width*scale);
    const left=mobile ? bounds.left : bounds.left-size*overhang;
    const baseTop=mobile ? bounds.top : bounds.top+bounds.height*offset-size*lift;
    const parallax=mobile || reduced.matches ? 0 : Math.max(-18, Math.min(18, (innerHeight / 2 - baseTop - size / 2) * .06));
    const top=baseTop+parallax;
    layer.style.width=`${size}px`; layer.style.height=`${size}px`;
    layer.style.transform=`translate3d(${left}px,${top}px,0)`;
    const height=Math.max(0,Math.min(innerHeight,top+size)-Math.max(0,top));
    const width=Math.max(0,Math.min(innerWidth,left+size)-Math.max(0,left));
    const nextVisible=size>0 && width*height/(size*size)>=.5;
    layer.hidden=height===0 || width===0 || document.documentElement.hasAttribute('data-viewer-open');
    if (!video.src && top < innerHeight * 3 && top + size > -innerHeight * 2) { video.preload = 'auto'; video.src = source; }
    if (nextVisible !== visible) { visible = nextVisible; sound.setVisible(visible); }
  }
  function schedule() { if(!raf)raf=requestAnimationFrame(position); }
  for(const source of [stage,window])source.addEventListener('scroll',schedule,{passive:true,signal:abort.signal});
  window.addEventListener('resize',schedule,{passive:true,signal:abort.signal});
  document.addEventListener('visibilitychange',schedule,{signal:abort.signal});
  document.addEventListener('portfolio-viewer-change',schedule,{signal:abort.signal});
  reduced.addEventListener('change',schedule,{signal:abort.signal});
  const observer=new ResizeObserver(schedule); observer.observe(element);
  schedule();
  return () => { disposed=true; abort.abort(); observer.disconnect(); cancelAnimationFrame(raf); video.pause(); video.removeAttribute('src'); video.load(); layer.remove(); sound.dispose(); };
}
