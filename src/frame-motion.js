// Frame assembly renderer supplied with the author’s interactive cover.
export function createFrameMotion() {
  const clamp = v => Math.max(0, Math.min(1, v));
  function ease(p, type) { p = clamp(p); return type === 'linear' ? p : type === 'out' ? 1 - (1-p)**3 : p*p*(3-2*p); }
  function cycle(t, settings, duration) {
    const total=settings.assemble+settings.disperse+2*settings.hold;
    let s=((t%duration+duration)%duration)/duration*total;
    if(s<settings.hold)return 0;
    s-=settings.hold;
    if(s<settings.assemble)return s/settings.assemble;
    s-=settings.assemble;
    if(s<settings.hold)return 1;
    return clamp(1-(s-settings.hold)/settings.disperse);
  }
  function controller(settings) {
    let start=0, target=0, from=0, duration=1;
    const value=now=>from+(target-from)*clamp((now-start)/duration);
    return {value, target:()=>target, active:now=>now<start+duration,
      set(next,now){next=next?1:0;if(next===target)return;from=value(now);target=next;start=now;duration=Math.max(1,(next?settings.assemble:settings.disperse)*1000*Math.abs(target-from));},
      reset(){start=0;from=target=0;duration=1;}};
  }
  function idleOffset(tile,w,h,t,s) {
    const amount=(s.amount||0)*.24;
    const phase=t/(s.duration||4)*Math.PI*2*Math.max(1,Math.round((s.speed||10)/10));
    if(!amount)return [0,0];
    if(s.motion==='wave')return [Math.sin(phase+tile.y/80)*amount,Math.cos(phase+tile.x/120)*amount*.3];
    if(s.motion==='glitch')return [Math.sin(phase*3+Math.floor(tile.y/24)*17)>.75?amount*(tile.seed-.5)*6:0,0];
    if(s.motion==='breathe')return [(tile.x-w/2)*Math.sin(phase)*amount/800,(tile.y-h/2)*Math.sin(phase)*amount/800];
    return [Math.sin(phase+tile.seed*6.28)*amount,Math.cos(phase+tile.seed*12)*amount*.6];
  }
  function drawHUD(target,w,h,data,settings,t) {
    const b=data?.bounds;if(!b||!data.points?.length)return;
    const pad=Math.max(15,w*.035),font=Math.max(9,Math.round(w/75));
  target.save();target.strokeStyle=settings.color;target.fillStyle=settings.color;target.font=`${font}px monospace`;target.textBaseline='top';target.lineWidth=Math.max(1,w/900);
  const points=data.points;target.globalAlpha=.38;target.beginPath();points.forEach((p,i)=>{const [dx,dy]=idleOffset(p,w,h,t,settings);if(i)target.lineTo(p.x+dx,p.y+dy);else target.moveTo(p.x+dx,p.y+dy)});target.stroke();
  points.forEach((p,i)=>{const [dx,dy]=idleOffset(p,w,h,t,settings),x=p.x+dx,y=p.y+dy;target.globalAlpha=.8;target.strokeRect(x-4,y-4,8,8);target.beginPath();target.moveTo(x-12,y);target.lineTo(x+12,y);target.moveTo(x,y-12);target.lineTo(x,y+12);target.stroke();if(i%3===0)target.fillText(`${String(i).padStart(2,'0')} / ${Math.round(x)},${Math.round(y)}`,x+15,y+8)});
  target.globalAlpha=.9;if(settings.showTitle)target.fillText('PIXEL / MOTION   [VISUAL STUDY]',pad,pad);target.fillText(`FRAME ${String(Math.floor(t*30)).padStart(4,'0')}   /   LOOP ${settings.duration}s`,pad,h-pad-font);target.fillText(`${w} × ${h}    NODES ${points.length}`,pad,h-pad-font*2.4);
  const lx=Math.max(pad,Math.min(w-pad-170,b.x+b.w*.55)),ly=Math.max(pad+font*2,b.y-24);target.fillRect(lx,ly,170,font+10);target.fillStyle=settings.background==='dark'?'#161a17':'#eeeee5';target.fillText('SUBJECT / GRAPHIC 001',lx+5,ly+5);target.restore();
  }
  const plans=new WeakMap();
  function assemblyPlan(list,w,h,density) {
    const key=`${w}/${h}/${density}`,cached=plans.get(list);
    if(cached?.key===key)return cached.items;
    const items=list.filter(tile=>tile.seed<=density).map(tile=>({tile,target:null}));
    // Partition the entire image among the existing frames; nearby frames receive nearby areas.
    function split(group,x,y,width,height){
      if(!group.length)return;
      if(group.length===1){group[0].target={x,y,w:width,h:height};return;}
      const axis=width>=height?'x':'y';
      group.sort((a,b)=>a.tile[axis]-b.tile[axis]||a.tile.seed-b.tile.seed);
      const n=Math.floor(group.length/2),size=axis==='x'?width:height;
      const cut=Math.max(0,Math.min(size,Math.round(size*n/group.length)));
      if(axis==='x'){split(group.slice(0,n),x,y,cut,height);split(group.slice(n),x+cut,y,width-cut,height);}
      else{split(group.slice(0,n),x,y,width,cut);split(group.slice(n),x,y+cut,width,height-cut);}
    }
    split([...items],0,0,w,h);
    plans.set(list,{key,items});return items;
  }
  function draw(ctx,original,fragments,background,list,p,s,t=0) {
    const w=original.width,h=original.height;p=clamp(p);
    ctx.clearRect(0,0,w,h);
    if(p>=1){ctx.drawImage(original,0,0,w,h);if(s.hud)drawHUD(ctx,w,h,s.hudData,s,t);return;}
    // Only the backdrop fades. Image pieces remain opaque and physically join their assigned areas.
    ctx.save();ctx.globalAlpha=1-ease(p,'smooth');ctx.drawImage(background,0,0,w,h);
    ctx.strokeStyle=s.color;ctx.lineWidth=Math.max(1,w/700);
    const plan=assemblyPlan(list,w,h,s.density);
    const pieces=plan.length?plan:p>0?[{tile:{x:w/2,y:h/2,s:0,seed:0},target:{x:0,y:0,w,h}}]:[];
    for(const {tile,target} of pieces){
      const order=s.order==='left'?tile.x/w:s.order==='radial'?Math.min(1,Math.hypot(tile.x/w-.5,tile.y/h-.5)*1.414):tile.seed;
      const q=ease(clamp((p-order*s.stagger)/(1-s.stagger)),s.easing),broken=1-q;
      const sx=Math.max(0,tile.x-tile.s/2),sy=Math.max(0,tile.y-tile.s/2);
      const sw=Math.min(tile.s,w-sx),sh=Math.min(tile.s,h-sy);
      const [dx,dy]=idleOffset(tile,w,h,t,s);
      // Extra spread and size changes shape the transition, never the starting layout.
      const arc=Math.sin(Math.PI*q),size=1-arc*s.gap*.25;
      const dw=(tile.s*broken+target.w*q)*size,dh=(tile.s*broken+target.h*q)*size;
      const x=(tile.x-tile.s/2+dx)*broken+target.x*q+Math.sin(tile.seed*31)*s.spread*w*.04*arc;
      const y=(tile.y-tile.s/2+dy)*broken+target.y*q+Math.cos(tile.seed*47)*s.spread*h*.04*arc;
      const cropX=sx*broken+target.x*q,cropY=sy*broken+target.y*q;
      const cropW=sw*broken+target.w*q,cropH=sh*broken+target.h*q;
      ctx.globalAlpha=1;
      if(cropW>0&&cropH>0&&dw>0&&dh>0)ctx.drawImage(original,cropX,cropY,cropW,cropH,x,y,dw,dh);
      if(s.outline){ctx.globalAlpha*=broken;ctx.strokeRect(x,y,dw,dh);}
    }
    ctx.restore();
    if(s.hud)drawHUD(ctx,w,h,s.hudData,s,t);
  }
  return {clamp,ease,cycle,controller,idleOffset,drawHUD,assemblyPlan,draw};
}
