/**
 * Toon Stickman — browser/Three.js adaptation of the procedural character style
 * from boidbit/insta-shorts (studio/characters.py + studio/actions.py).
 * Source inspiration: big round head, bean torso, black ink limbs, 2-bone gait,
 * expressions and tuft accessory. This is a clean JS port, not Python at runtime.
 * Character remains a 2.5D animated billboard, NOT a skeletal 3D model.
 */
export function createToonStickman(THREE, options = {}) {
  const W = 640, H = 1040, PI = Math.PI, TAU = PI * 2;
  const paper = document.createElement('canvas');
  paper.width = W; paper.height = H;
  const g = paper.getContext('2d');
  const texture = new THREE.CanvasTexture(paper);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = 4;
  const material = new THREE.MeshBasicMaterial({map:texture, transparent:true, alphaTest:0.055,
    depthWrite:false, side:THREE.DoubleSide, toneMapped:false});
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2.72,4.4),material);
  mesh.renderOrder = 24;
  const root = new THREE.Group();
  root.position.y = 1.90;
  root.add(mesh);
  const INK='#101010', SKIN='#eee7d0', WHITE='#fcfcfa', MOUTH='#701e28';
  const palette={pink:'#de768c',blue:'#5c8ece',green:'#60a85c',yellow:'#eec440',orange:'#e88c3c',purple:'#9668be',red:'#d04640',teal:'#40a8a0'};
  const shirt = palette[options.color]||palette.blue;
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const smooth=(v)=>{v=clamp(v,0,1);return v*v*(3-2*v)};
  const fract=(v)=>v-Math.floor(v);
  const d2r=(a)=>a*PI/180;
  const vec=(angle,length)=>[length*Math.sin(d2r(angle)),length*Math.cos(d2r(angle))];
  function stroke(points,width=10,color=INK) {
    if(points.length<2)return;
    g.lineJoin='round'; g.lineCap='round';g.lineWidth=width;g.strokeStyle=color;
    g.beginPath();g.moveTo(...points[0]);for(let i=1;i<points.length;i++)g.lineTo(...points[i]);g.stroke();
  }
  function ellipse(x,y,rx,ry,fill,edge=INK,width=8){
    g.beginPath();g.ellipse(x,y,rx,ry,0,0,TAU);
    if(fill){g.fillStyle=fill;g.fill();}
    if(edge){g.strokeStyle=edge;g.lineWidth=width;g.stroke();}
  }
  function joint(p,angle,length){const v=vec(angle,length);return [p[0]+v[0],p[1]+v[1]];}
  function leg(hip,foot,side){
    // Analytic 2-bone inverse kinematics. Feet are locked to the ground during stance.
    const L=168, dx=foot[0]-hip[0], dy=foot[1]-hip[1];
    const dist=Math.max(1,Math.min(2*L-.001,Math.hypot(dx,dy)));
    const mx=(hip[0]+foot[0])*.5,my=(hip[1]+foot[1])*.5;
    const bend=Math.sqrt(Math.max(0,L*L-dist*dist*.25));
    const knee=[mx+(dy/dist)*bend*side, my-(dx/dist)*bend*side];
    stroke([hip,knee,foot],12);
    ellipse(foot[0]+side*14,foot[1]-5,34,15,INK,null);
  }
  function body(){
    g.beginPath();
    for(let i=0;i<=52;i++){
      const a=TAU*i/52, rx=75*(1+.14*Math.sin(a));
      const x=rx*Math.cos(a),y=-161+179*Math.sin(a);
      if(i===0)g.moveTo(x,y);else g.lineTo(x,y);
    }
    g.closePath();g.fillStyle=shirt;g.fill();g.strokeStyle=INK;g.lineWidth=8;g.stroke();
  }
  function arm(side,ang1,ang2){
    const shoulder=[side*52,-275], elbow=joint(shoulder,ang1,125), hand=joint(elbow,ang2,125);
    stroke([shoulder,elbow,hand],11);ellipse(hand[0],hand[1],15,15,INK,null);
  }
  function head(expression,tilt,blink,mouthOpen,lookX){
    g.save();g.translate(0,-414);g.rotate(d2r(tilt));
    ellipse(0,0,100,100,SKIN,INK,9);
    let eye='dot',mouth='smile';
    if(expression==='talk'){eye='dot';mouth=mouthOpen>.23?'talk':'smile';}
    if(expression==='laugh'){eye='happy';mouth='laugh';}
    if(expression==='shock'){eye='wide';mouth='open';}
    if(expression==='grin'){eye='dot';mouth='grin';}
    if(expression==='think'){eye='half';mouth='flat';}
    if(expression==='angry'){eye='dot';mouth='frown';}
    if(blink && eye!=='happy')eye='closed';
    const dx=clamp(lookX,-1,1)*7;
    for(const side of [-1,1]){
      const x=side*34+dx;
      if(eye==='dot')ellipse(x,-4,10,10,INK,null);
      else if(eye==='wide'){ellipse(x,-5,21,23,WHITE,INK,5);ellipse(x+dx,-5,8,8,INK,null);}
      else if(eye==='closed')stroke([[x-17,-4],[x+17,-3]],7);
      else if(eye==='happy'){
        g.beginPath();g.ellipse(x,6,20,15,0,d2r(197),d2r(343));g.strokeStyle=INK;g.lineWidth=7;g.stroke();
      } else if(eye==='half'){
        ellipse(x,-4,20,17,WHITE,INK,5);ellipse(x+dx,1,8,8,INK,null);
        stroke([[x-21,-6],[x+21,-6]],6);
      }
    }
    if(mouth==='smile'){
      g.beginPath();g.ellipse(0,18,34,28,0,d2r(28),d2r(152));g.strokeStyle=INK;g.lineWidth=7;g.lineCap='round';g.stroke();
    } else if(mouth==='flat')stroke([[-24,54],[24,54]],7);
    else if(mouth==='frown'){
      g.beginPath();g.ellipse(0,84,29,23,0,d2r(208),d2r(332));g.strokeStyle=INK;g.lineWidth=7;g.stroke();
    } else if(mouth==='grin'){
      ellipse(0,52,41,20,WHITE,INK,6);stroke([[-35,52],[35,52]],3);
    } else {
      let rx=mouth==='laugh'?40:mouth==='open'?28:20+14*mouthOpen;
      let ry=mouth==='laugh'?34:mouth==='open'?29:7+29*mouthOpen;
      ellipse(0,58,rx,ry,MOUTH,INK,6);
      ellipse(0,59+ry*.4,rx*.55,Math.max(3,ry*.28),'#e26e78',null);
    }
    // Original studio supports a tuft accessory. Preserve that distinct silhouette.
    for(const [x,tip] of [[-13,-27],[0,0],[13,27]]){
      g.beginPath();g.moveTo(x,-96);g.quadraticCurveTo(x*.6,-116,tip,-137);
      g.lineWidth=6;g.strokeStyle=INK;g.stroke();
    }
    g.restore();
  }
  function footCycle(cycle,side,blend,stepPixels=96){
    // 62% stance / 38% swing: distance drives gait instead of frame time.
    const q=fract(cycle+(side>0?.5:0));
    let stride, lift;
    if(q<.62){stride=1-2*q/.62;lift=0;}
    else {const u=smooth((q-.62)/.38);stride=-1+2*u;lift=Math.sin(PI*u)*40;}
    return {x:side*35+stride*stepPixels*blend,y:315-lift*blend,contact:q<.62};
  }
  function update({time=0,phase=0,velocity=0,action='idle',local=0,hop=0,turn=0}={}){
    const v=smooth(velocity/.45);
    const moving=(action==='walk'||action==='run') && velocity>.001;
    const stride=phase/TAU;
    const bend=clamp(turn,-1,1);
    const stepPixels=action==='run'?104:96;
    const l=moving?footCycle(stride,-1,v,stepPixels):{x:-41,y:315,contact:true};
    const r=moving?footCycle(stride,1,v,stepPixels):{x:41,y:315,contact:true};
    const sway=(moving?Math.sin(phase)*2.5*v:Math.sin(time*1.3)*.7)+bend*2.9*v;
    const hipY=-(moving?Math.abs(Math.sin(phase))*5*v:Math.sin(time*1.6)*1.4);
    const armWave=Math.sin(phase)*(action==='run'?33:25)*v;
    let la1=-14-armWave,la2=-8-armWave*.5,ra1=14+armWave,ra2=8+armWave*.5;
    let expr='smile',tilt=Math.cos(time*1.7)*1.5-bend*3.0*v,lookX=bend*.55;
    if(action==='talk'){expr='talk';ra1=40+20*Math.sin(time*7);ra2=65+23*Math.sin(time*8.5);}
    if(action==='wave'){ra1=132;ra2=170+24*Math.sin(time*15);}
    if(action==='look'){expr='think';lookX=Math.sin(time*3.5);tilt=3;}
    if(action==='dance'){expr='grin';la1=-115+25*Math.sin(time*9);la2=-165;ra1=115-25*Math.sin(time*9);ra2=165;}
    if(action==='jump'){expr='shock';la1=-130;la2=-160;ra1=130;ra2=160;}
    const mouthOpen=action==='talk'?Math.abs(Math.sin(time*11)):.0;
    const blink=fract(time/3.6)<.035;
    g.clearRect(0,0,W,H);
    g.save();g.translate(W/2+sway,H-70-315);
    // Legs are drawn outside the moving torso transform; stance heels stay on y=315.
    leg([-36,hipY],[l.x,l.y],-1);leg([36,hipY],[r.x,r.y],1);
    g.save();g.translate(0,hipY);g.rotate(d2r((moving?Math.sin(phase)*1.3*v:Math.sin(time*.9)*.35)+bend*2.4*v));
    body();arm(-1,la1,la2);arm(1,ra1,ra2);head(expr,tilt,blink,mouthOpen,lookX);
    g.restore();g.restore();
    texture.needsUpdate=true;
    root.position.y=1.90+hop;
  }
  update();
  return {root,mesh,texture,update,dispose(){texture.dispose();material.dispose();mesh.geometry.dispose();}};
}