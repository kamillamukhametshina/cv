// Position-based cloth: Verlet integration, structural/shear/bend constraints.
// The sheet has no fixed corners: a weak restoring field keeps it in the layout.
export class ClothPhysics {
  constructor(cols = 32, rows = 44, aspect = 1.85 / 2.68) {
    this.aspect = aspect; this.offset = [0, 0]; this.cols = cols; this.rows = rows; this.count = (cols + 1) * (rows + 1);
    this.position = new Float32Array(this.count * 3);
    this.previous = new Float32Array(this.count * 3);
    this.rest = new Float32Array(this.count * 3);
    this.normals = new Float32Array(this.count * 3);
    this.uv = new Float32Array(this.count * 2);
    this.links = []; this.time = 0; this.grab = null;
    for (let y = 0; y <= rows; y++) for (let x = 0; x <= cols; x++) {
      const i = y * (cols + 1) + x, u = x / cols, v = y / rows;
      const px = (u - .5) * (2.68 * aspect) + (v - .5) * .36;
      this.rest.set([px, (.5 - v) * 2.68 + px * .07, -.1 * px], i * 3);
      this.uv.set([u, v], i * 2);
    }
    const link = (a, b, stiffness) => {
      let d = 0; for (let k=0;k<3;k++) d += (this.rest[a*3+k]-this.rest[b*3+k])**2;
      this.links.push([a*3,b*3,Math.sqrt(d),stiffness]);
    };
    const indices = [];
    for(let y=0;y<=rows;y++) for(let x=0;x<=cols;x++) {
      const i=y*(cols+1)+x;
      if(x<cols) link(i,i+1,1);
      if(y<rows) link(i,i+cols+1,1);
      if(x<cols&&y<rows) { link(i,i+cols+2,.62); link(i+1,i+cols+1,.62); indices.push(i,i+cols+1,i+1,i+1,i+cols+1,i+cols+2); }
      if(x<cols-1) link(i,i+2,.22);
      if(y<rows-1) link(i,i+2*(cols+1),.22);
    }
    this.indices=new Uint16Array(indices); this.reset();
  }
  reset() {
    this.grab=null;this.time=0;this.offset=[0,0];
    this.position.set(this.rest);
    for(let i=0;i<this.count;i++) {
      const u=(i%(this.cols+1))/this.cols,v=Math.floor(i/(this.cols+1))/this.rows;
      this.position[i*3+2]+=.12*Math.sin(u*5+v*4)+.05*Math.cos(v*9-u*3);
    }
    this.previous.set(this.position);this.updateNormals();
  }
  poke(index=this.count>>1, strength=.22) {
    const p=this.position, cx=p[index*3],cy=p[index*3+1];
    for(let i=0;i<this.count;i++) {
      const d=(p[i*3]-cx)**2+(p[i*3+1]-cy)**2;
      const f=Math.exp(-d/.085);
      this.previous[i*3+2]-=strength*f;
      this.previous[i*3]+=.018*f;
    }
  }
  startGrab(index) {
    const p=this.position,center=Array.from(p.slice(index*3,index*3+3));
    const points=[];
    for(let i=0;i<this.count;i++) {
      const d=Math.hypot(p[i*3]-center[0],p[i*3+1]-center[1],p[i*3+2]-center[2]);
      if(d<.23) points.push({i:i*3,weight:Math.max(.06,1-d/.23),offset:[p[i*3]-center[0],p[i*3+1]-center[1],p[i*3+2]-center[2]]});
    }
    this.grab={startOffset:[...this.offset],center,target:[center[0],center[1],center[2]+.14],points};
    this.poke(index,.1);
  }
  moveGrab(x,y,z) {if(this.grab)this.grab.target=[x,y,Math.max(-1,Math.min(1.3,z))];}
  endGrab(){this.grab=null;}
  step(wind=true) {
    this.time+=1/60;
    const p=this.position,prev=this.previous,rest=this.rest,t=this.time;
    // Move the sheet's rest frame with a long drag; there is no inner XY fence.
    for(let axis=0;axis<2;axis++) {
      const target=this.grab ? this.grab.startOffset[axis]+(this.grab.target[axis]-this.grab.center[axis])*.86 : 0;
      const shift=(target-this.offset[axis])*(this.grab ? .16 : .018);
      this.offset[axis]+=shift;
      for(let i=0;i<this.count;i++){p[i*3+axis]+=shift;prev[i*3+axis]+=shift;}
    }
    for(let i=0;i<this.count;i++) {
      const k=i*3, v=Math.floor(i/(this.cols+1))/this.rows;
      const restore=.0025 + (1-v)*.0015;
      const windZ=wind ? .00045*Math.sin(t*1.15+rest[k+1]*2)+.0002*Math.sin(t*1.8+rest[k]*3+v*2) : 0;
      for(let axis=0;axis<3;axis++) {
        const j=k+axis,old=p[j],velocity=Math.max(-.13,Math.min(.13,(old-prev[j])*.965));
        p[j]=old+velocity+(rest[j]+(axis<2?this.offset[axis]:0)-old)*restore;
        if(axis===2)p[j]+=windZ;
        if(axis===0&&wind)p[j]+=.00025*Math.sin(t*.9+v*4);
        prev[j]=old;
      }
    }
    for(let iteration=0;iteration<7;iteration++) {
      for(const [a,b,length,stiffness] of this.links) {
        const dx=p[b]-p[a],dy=p[b+1]-p[a+1],dz=p[b+2]-p[a+2];
        const distance=Math.sqrt(dx*dx+dy*dy+dz*dz)||1e-6;
        const correction=(distance-length)/distance*.5*stiffness;
        p[a]+=dx*correction;p[a+1]+=dy*correction;p[a+2]+=dz*correction;
        p[b]-=dx*correction;p[b+1]-=dy*correction;p[b+2]-=dz*correction;
      }
      if(this.grab) for(const {i,weight,offset} of this.grab.points) {
        for(let k=0;k<3;k++)p[i+k]+=(this.grab.target[k]+offset[k]-p[i+k])*weight*.72;
      }
    }
    this.updateNormals();
  }
  updateNormals(){
    const p=this.position,n=this.normals,s=this.cols+1;
    for(let y=0;y<=this.rows;y++)for(let x=0;x<=this.cols;x++){
      const i=y*s+x,l=(y*s+Math.max(0,x-1))*3,r=(y*s+Math.min(this.cols,x+1))*3;
      const u=(Math.max(0,y-1)*s+x)*3,d=(Math.min(this.rows,y+1)*s+x)*3;
      const ax=p[r]-p[l],ay=p[r+1]-p[l+1],az=p[r+2]-p[l+2];
      const bx=p[u]-p[d],by=p[u+1]-p[d+1],bz=p[u+2]-p[d+2];
      const nx=ay*bz-az*by,ny=az*bx-ax*bz,nz=ax*by-ay*bx,mag=Math.hypot(nx,ny,nz)||1;
      n.set([nx/mag,ny/mag,nz/mag],i*3);
    }
  }
}
