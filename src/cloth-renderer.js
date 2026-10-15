import {ClothPhysics} from './cloth-physics.js';
const vertex=`
attribute vec3 aPosition;attribute vec3 aNormal;attribute vec2 aUV;
uniform vec2 uScale;uniform vec2 uCenter;
varying vec2 vUV;varying vec3 vNormal;varying vec3 vPosition;
void main(){float w=1.0-aPosition.z/4.8;gl_Position=vec4(aPosition.xy*uScale+uCenter*w,-aPosition.z*.1,w);vUV=aUV;vNormal=aNormal;vPosition=aPosition;}`;
const fragment=`
precision mediump float;
uniform sampler2D uTexture;uniform vec4 uCrop;uniform vec2 uFit;
varying vec2 vUV;varying vec3 vNormal;varying vec3 vPosition;
void main(){
 vec2 uv=(vUV-.5)*uFit+.5;
 vec3 tex=vec3(1.);if(uv.x>=0.&&uv.x<=1.&&uv.y>=0.&&uv.y<=1.)tex=texture2D(uTexture,uCrop.xy+uv*uCrop.zw).rgb;
 vec3 n=normalize(vNormal);if(!gl_FrontFacing)n=-n;
 vec3 eye=normalize(vec3(0.,0.,4.8)-vPosition);vec3 light=normalize(vec3(-.65,.85,1.8));
 float diffuse=max(dot(n,light),0.);float gloss=pow(max(dot(n,normalize(light+eye)),0.),42.)*.18;
 vec3 reflection=reflect(-eye,n);float strip=pow(max(0.,1.-abs(reflection.y+reflection.x*.42-.32)),32.);
 strip*=smoothstep(-.85,-.25,reflection.x)*(1.-smoothstep(.8,1.,reflection.x));
 float rim=pow(1.-abs(dot(n,eye)),3.)*.06;
 gl_FragColor=vec4(tex*(.76+.27*diffuse)+vec3(gloss+strip*.18+rim),1.);
}`;
export class ClothPoster {
 constructor(canvas,hit,fallbackImage,anchor=canvas,{mobile=false}={}){
  this.mobile=mobile;
  this.anchor=anchor;
  this.fallbackImage=fallbackImage;this.abort=new AbortController();
  this.listen=(el,type,fn)=>el.addEventListener(type,fn,{signal:this.abort.signal});
  this.canvas=canvas;this.hit=hit;this.model=new ClothPhysics(mobile?16:32,mobile?22:44);this.active=false;this.ready=false;
  this.paused=false;this.token=0;this.images=new Map();this.reduced=matchMedia('(prefers-reduced-motion: reduce)');
  // Mobile browsers can pause animation frames during native scrolling.
  // Keep the last rendered sheet available to the compositor during that pause.
  const gl=this.gl=canvas.getContext('webgl',{alpha:true,antialias:true,premultipliedAlpha:false,preserveDrawingBuffer:mobile,powerPreference:'low-power'});
  if(!gl)throw Error('WebGL unavailable');
  const shader=(type,code)=>{const s=gl.createShader(type);gl.shaderSource(s,code);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;};
  const program=this.program=gl.createProgram();gl.attachShader(program,shader(gl.VERTEX_SHADER,vertex));gl.attachShader(program,shader(gl.FRAGMENT_SHADER,fragment));gl.linkProgram(program);
  if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));gl.useProgram(program);
  const attribute=(name,data,size,dynamic)=>{const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,data,dynamic?gl.DYNAMIC_DRAW:gl.STATIC_DRAW);const loc=gl.getAttribLocation(program,name);gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,size,gl.FLOAT,false,0,0);return buffer;};
  this.positions=attribute('aPosition',this.model.position,3,true);this.normals=attribute('aNormal',this.model.normals,3,true);attribute('aUV',this.model.uv,2,false);
  const indices=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,indices);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,this.model.indices,gl.STATIC_DRAW);
  this.uniforms=Object.fromEntries(['uScale','uCenter','uCrop','uFit'].map(n=>[n,gl.getUniformLocation(program,n)]));
  this.texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,this.texture);
  for(const key of [gl.TEXTURE_WRAP_S,gl.TEXTURE_WRAP_T])gl.texParameteri(gl.TEXTURE_2D,key,gl.CLAMP_TO_EDGE);
  for(const key of [gl.TEXTURE_MIN_FILTER,gl.TEXTURE_MAG_FILTER])gl.texParameteri(gl.TEXTURE_2D,key,gl.LINEAR);
  gl.enable(gl.DEPTH_TEST);gl.clearColor(0,0,0,0);
  this.resizeObserver=new ResizeObserver(()=>{this.resize();this.request();});this.resizeObserver.observe(canvas);this.resizeObserver.observe(anchor);this.resize();this.bind();
  this.listen(this.reduced,'change',()=>this.request());
  this.listen(document,'visibilitychange',()=>{if(document.hidden){this.release();cancelAnimationFrame(this.frame);this.frame=0;this.lastTime=null;}else this.request();});
  this.listen(canvas,'webglcontextlost',e=>{e.preventDefault();this.failed=true;this.ready=false;cancelAnimationFrame(this.frame);this.fallback();});
 }
 async setSource(source,id){
  if(this.sourceId===id)return;this.sourceId=id;const token=++this.token;this.source=source;
  this.fallbackImage.src=source.src;
  if(this.failed){this.fallback();return;}
  if(!this.images.has(source.src))this.images.set(source.src,new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=reject;im.src=source.src;}));
  try{
   const image=await this.images.get(source.src);if(token!==this.token)return;
   this.release();this.model=new ClothPhysics(this.model.cols,this.model.rows,source.aspect);
   this.gl.bindTexture(this.gl.TEXTURE_2D,this.texture);this.gl.texImage2D(this.gl.TEXTURE_2D,0,this.gl.RGBA,this.gl.RGBA,this.gl.UNSIGNED_BYTE,image);
   this.crop=source.crop||[0,0,1,1];this.fit=[1,1];
   if(source.contain){const ratio=image.width/image.height/source.aspect;this.fit=ratio>1?[1,ratio]:[1/ratio,1];}
   this.ready=true;this.canvas.hidden=false;this.hit.hidden=!this.active;this.fallbackImage.hidden=true;
   this.canvas.dataset.ready='true';this.canvas.dataset.project=id;this.resize();this.request();
   if(!this.reduced.matches)this.canvas.animate([{opacity:.2},{opacity:1}],{duration:300,easing:'ease-out'});
  }catch{if(token===this.token)this.fallback();}
 }
 resize(){
  const b=this.canvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio,this.mobile?1.25:1.75);this.width=b.width;this.height=b.height;
  if(!b.width||!b.height)return;
  const width=Math.round(b.width*dpr),height=Math.round(b.height*dpr);
  // Assigning even the same canvas size clears its drawing buffer.
  if(this.canvas.width!==width)this.canvas.width=width;
  if(this.canvas.height!==height)this.canvas.height=height;
  this.updateAnchor();
  this.gl.viewport(0,0,this.canvas.width,this.canvas.height);
  if(this.ready&&!this.failed)this.draw();
 }
 updateAnchor(){
  const b=this.anchor.getBoundingClientRect();
  if(!b.width||!b.height)return;
  this.unit=Math.min(b.width*.72/(2.68*this.model.aspect),b.height*.72/2.68,225);
  const canvasBounds=this.canvas.getBoundingClientRect();
  this.centerX=b.left-canvasBounds.left+b.width/2;this.centerY=b.top-canvasBounds.top+b.height*.48;
 }
 request(){if(!this.failed&&!this.frame&&this.active&&this.ready&&!document.hidden)this.frame=requestAnimationFrame(t=>this.tick(t));}
 tick(time){
  this.frame=0;if(!this.active||!this.ready||document.hidden)return;
  const elapsed=Math.min((time-(this.lastTime||time))/1000,.04);this.lastTime=time;this.accumulator=(this.accumulator||0)+elapsed;
  const moving=(!this.reduced.matches&&!this.paused)||this.model.grab||this.interactionUntil>time;
  if(moving){while(this.accumulator>=1/60){this.model.step(!this.reduced.matches&&!this.paused);this.accumulator-=1/60;}}else this.accumulator=0;
  this.draw();if(moving)this.request();
 }
 projectPoint(i){const p=this.model.position,f=4.8/(4.8-p[i*3+2]);return[this.centerX+p[i*3]*this.unit*f,this.centerY-p[i*3+1]*this.unit*f];}
 updateHitArea(){
  const {cols,rows}=this.model,s=cols+1,boundary=[];
  for(let x=0;x<=cols;x+=2)boundary.push(x);
  for(let y=2;y<=rows;y+=2)boundary.push(y*s+cols);
  for(let x=cols-2;x>=0;x-=2)boundary.push(rows*s+x);
  for(let y=rows-2;y>0;y-=2)boundary.push(y*s);
  this.hit.style.clipPath=`polygon(${boundary.map(i=>this.projectPoint(i).map(n=>`${n.toFixed(1)}px`).join(' ')).join(',')})`;
 }
 draw(){
  const gl=this.gl;gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.useProgram(this.program);
  gl.uniform2f(this.uniforms.uScale,2*this.unit/this.width,2*this.unit/this.height);
  gl.uniform2f(this.uniforms.uCenter,2*this.centerX/this.width-1,1-2*this.centerY/this.height);
  gl.uniform4fv(this.uniforms.uCrop,this.crop||[0,0,1,1]);gl.uniform2fv(this.uniforms.uFit,this.fit||[1,1]);
  gl.bindBuffer(gl.ARRAY_BUFFER,this.positions);gl.bufferSubData(gl.ARRAY_BUFFER,0,this.model.position);
  gl.bindBuffer(gl.ARRAY_BUFFER,this.normals);gl.bufferSubData(gl.ARRAY_BUFFER,0,this.model.normals);
  gl.drawElements(gl.TRIANGLES,this.model.indices.length,gl.UNSIGNED_SHORT,0);this.updateHitArea();
 }
 setActive(value){this.active=value;this.hit.hidden=!value||this.failed;if(!value){cancelAnimationFrame(this.frame);this.frame=0;this.lastTime=null;this.release();}else this.request();}
 setPaused(value){this.paused=value;this.request();}
 reset(){this.release();this.model.reset();this.interactionUntil=performance.now()+1000;this.request();}
 pick(x,y){let found=-1,distance=Infinity;for(let i=0;i<this.model.count;i++){const [px,py]=this.projectPoint(i),d=(x-px)**2+(y-py)**2;if(d<distance){distance=d;found=i;}}return distance<Math.max(22,this.unit*.18)**2?found:-1;}
 release(){this.model.endGrab();this.hit.classList.remove('grabbing');this.pointer=null;this.onDrag?.(false);}
 bind(){
  this.listen(this.hit,'pointerdown',e=>{
   if(!this.active||!this.ready||e.button!==0||this.pointer!=null)return;
   const bounds=this.canvas.getBoundingClientRect();
   const index=this.pick(e.clientX-bounds.left,e.clientY-bounds.top);if(index<0)return;
   e.preventDefault();this.canvas.classList.add('pointer-focus');this.canvas.focus({preventScroll:true});
   this.hit.setPointerCapture(e.pointerId);this.pointer=e.pointerId;this.model.startGrab(index);
   this.down={x:e.clientX,y:e.clientY,center:[...this.model.grab.center]};this.hit.classList.add('grabbing');this.onDrag?.(true);
   this.canvas.dataset.interactions=String(Number(this.canvas.dataset.interactions||0)+1);this.interactionUntil=performance.now()+4500;this.request();
  });
  this.listen(this.hit,'pointermove',e=>{
   if(this.pointer!==e.pointerId||!this.model.grab)return;
   const d=this.down,f=4.8/(4.8-d.center[2]);
   this.model.moveGrab(d.center[0]+(e.clientX-d.x)/(this.unit*f),d.center[1]-(e.clientY-d.y)/(this.unit*f),d.center[2]+.2);
   this.interactionUntil=performance.now()+4500;this.request();
  });
  const finish=e=>{if(e.pointerId!==this.pointer)return;this.release();this.interactionUntil=performance.now()+4500;this.request();};
  for(const event of ['pointerup','pointercancel','lostpointercapture'])this.listen(this.hit,event,finish);
  this.listen(this.canvas,'keydown',e=>{
   this.canvas.classList.remove('pointer-focus');if(![' ','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','r','R','Escape'].includes(e.key))return;e.preventDefault();
   if(e.key.toLowerCase()==='r'||e.key==='Escape')this.reset();
   else{this.model.poke(Math.floor(this.model.count/2),e.key==='ArrowDown'?-.25:.25);if(e.key.startsWith('Arrow')){const axis=['ArrowLeft','ArrowRight'].includes(e.key)?0:1,dir=['ArrowLeft','ArrowDown'].includes(e.key)?-1:1;for(let i=0;i<this.model.count;i++)this.model.previous[i*3+axis]-=dir*.015;}}
   this.interactionUntil=performance.now()+4000;this.request();
  });
 }
 dispose(){this.setActive(false);this.token++;this.abort.abort();this.resizeObserver.disconnect();this.images.clear();this.gl.getExtension('WEBGL_lose_context')?.loseContext();}
 fallback(){this.canvas.hidden=true;this.hit.hidden=true;this.fallbackImage.hidden=false;}
}
