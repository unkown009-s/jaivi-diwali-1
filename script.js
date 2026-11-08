import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { gsap } from 'https://cdn.jsdelivr.net/npm/gsap@3.12.5/index.js';

const host=document.getElementById('world');
const scene=new THREE.Scene();
scene.background=new THREE.Color(0x18213b);
scene.fog=new THREE.FogExp2(0x18213b,0.009);
const camera=new THREE.PerspectiveCamera(52,innerWidth/innerHeight,.1,180);
camera.position.set(0,5,18);
const renderer=new THREE.WebGLRenderer({antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.setSize(innerWidth,innerHeight);
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.65;
host.appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xffe5c2,0x51405a,2.0));
const moon=new THREE.DirectionalLight(0xffd8a0,2.1);moon.position.set(-8,14,8);scene.add(moon);
const warm=new THREE.PointLight(0xffb35c,85,55);warm.position.set(0,5,1);scene.add(warm);

const mat=(color,roughness=.75,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
const gold=mat(0xd9a34f,.32,.55),cream=mat(0xe8cba0),wall=mat(0xb96e4d),dark=mat(0x39263c),roof=mat(0x70405a),floorMat=mat(0x55404a),pink=mat(0xd86c91),teal=mat(0x347d78),white=mat(0xf5dfbd);
function addMesh(geo,material,x,y,z,cast=true){const m=new THREE.Mesh(geo,material);m.position.set(x,y,z);m.castShadow=cast;m.receiveShadow=true;scene.add(m);return m}
function box(w,h,d,material,x,y,z){return addMesh(new THREE.BoxGeometry(w,h,d),material,x,y,z)}
function sphere(r,material,x,y,z){return addMesh(new THREE.SphereGeometry(r,20,14),material,x,y,z)}
function cylinder(rt,rb,h,material,x,y,z,seg=24){return addMesh(new THREE.CylinderGeometry(rt,rb,h,seg),material,x,y,z)}
function pointLight(color,intensity,distance,x,y,z){const l=new THREE.PointLight(color,intensity,distance);l.position.set(x,y,z);scene.add(l);return l}

// Ground and distant skyline
box(100,.5,100,floorMat,0,-.35,-28);
for(let i=0;i<18;i++){let x=(i-9)*5;let h=3+Math.random()*7;box(3,h,2,mat(i%2?0x201b32:0x2d1c32),x,h/2-0.1,-42-Math.random()*7,false)}
// Festive house facade
box(15,8,1.2,wall,0,4,-9);
const roofGeo=new THREE.ConeGeometry(9,3,4);const r=addMesh(roofGeo,roof,0,9.3,-9);r.rotation.y=Math.PI/4;r.scale.set(1,.55,.28);
box(4.2,5.8,.25,dark,0,2.85,-8.25);
box(3.5,5.1,.18,mat(0x6e382f),0,2.55,-8.05);
const door = box(1.7,3.4,.22,mat(0x9d5c3b),0,1.7,-7.9);
door.geometry.translate(-.85,0,0); door.position.x=.85; // hinge on the left edge
const doorKnob=sphere(.09,gold,1.48,1.7,-7.72);
for(let side of [-1,1]){
  box(3.2,2.5,.25,mat(0x302039),side*5.1,4.6,-8.2);
  box(2.85,2.15,.1,mat(0x17243a),side*5.1,4.6,-8.05);
  for(let j=0;j<3;j++)box(.08,2.1,.12,gold,side*5.1+(j-1)*.85,4.6,-7.96);
  box(3.15,.1,.14,gold,side*5.1,4.6,-7.92);
}
box(16,.25,1.8,gold,0,8.05,-8.1);
// Toran / hanging lanterns
for(let i=0;i<13;i++){let x=-6+i;let y=7.6-Math.sin(i/12*Math.PI)*.8;sphere(.12,mat(0x54a17b),x,y,-7.35);if(i%2===0){cylinder(.13,.17,.25,gold,x,y-.38,-7.3);pointLight(0xffb75e,2,4,x,y-.5,-7.2)}}
for(let x of [-6,-3,3,6]){cylinder(.25,.3,.42,gold,x,6.2,-7.1);sphere(.19,mat(0xffb75e),x,5.9,-7.1);pointLight(0xffa84c,3,5,x,5.8,-6.8)}

// A clear open courtyard — no rangoli overlay. Warm lanterns guide the camera toward the friends.
// Diyas around rangoli and path
const flames=[];
function diya(x,z,s=1){const g=new THREE.Group();g.position.set(x,0,z);g.scale.setScalar(s);scene.add(g);
 const bowl=new THREE.Mesh(new THREE.SphereGeometry(.32,20,12,0,Math.PI*2,0,Math.PI/2),gold);bowl.rotation.x=Math.PI; bowl.position.y=.12;bowl.scale.set(1,.5,1);g.add(bowl);
 const f=new THREE.Mesh(new THREE.SphereGeometry(.12,12,12),new THREE.MeshBasicMaterial({color:0xffb52e}));f.position.y=.29;f.scale.set(.55,1.5,.55);g.add(f);flames.push(f);
 const l=new THREE.PointLight(0xff9b32,2.2,4);l.position.set(0,.4,0);g.add(l);
}
for(let i=0;i<10;i++){let a=i*Math.PI/5;diya(Math.cos(a)*3.25, -1.6+Math.sin(a)*3.25,.8)}
for(let i=0;i<7;i++)diya(-5+i*1.65,2.2,.65);

// A real street-side rangoli, with JAIVI written into its centre (not a rangoli overlay on another rangoli).
const rangoliGroup = new THREE.Group(); rangoliGroup.position.set(0,.025,-13.2); scene.add(rangoliGroup);
function rangoliRing(radius, tube, color){const m=new THREE.Mesh(new THREE.TorusGeometry(radius,tube,8,96),new THREE.MeshStandardMaterial({color,emissive:color,emissiveIntensity:.18,roughness:.55}));m.rotation.x=-Math.PI/2;m.position.y=.02;rangoliGroup.add(m);return m;}
rangoliRing(1.65,.045,0xffb84d);rangoliRing(1.42,.035,0xff6b9a);rangoliRing(1.18,.025,0x65d7c1);
for(let i=0;i<16;i++){const a=i*Math.PI/8;const petal=new THREE.Mesh(new THREE.SphereGeometry(.19,12,8),new THREE.MeshStandardMaterial({color:i%2?0xffcb55:0xff79a8,emissive:i%2?0x7a3500:0x5b0925,emissiveIntensity:.25}));petal.position.set(Math.cos(a)*1.48,.06,Math.sin(a)*1.48);petal.scale.set(.65,.18,1.25);petal.rotation.y=-a;rangoliGroup.add(petal);}
for(let i=0;i<28;i++){const a=i*Math.PI*2/28;const dot=new THREE.Mesh(new THREE.SphereGeometry(.045,8,6),new THREE.MeshBasicMaterial({color:i%2?0xffedaa:0xffffff}));dot.position.set(Math.cos(a)*1.85,.05,Math.sin(a)*1.85);rangoliGroup.add(dot);}
function makeGroundText(text){const c=document.createElement('canvas');c.width=1024;c.height=256;const ctx=c.getContext('2d');ctx.clearRect(0,0,1024,256);ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='bold 150px Georgia';ctx.shadowColor='#ffb84d';ctx.shadowBlur=24;ctx.fillStyle='#fff0ad';ctx.fillText(text,512,128);const texture=new THREE.CanvasTexture(c);const mesh=new THREE.Mesh(new THREE.PlaneGeometry(2.25,.56),new THREE.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false,side:THREE.DoubleSide}));mesh.rotation.x=-Math.PI/2;mesh.position.set(0,.075,0);rangoliGroup.add(mesh);return mesh;}
makeGroundText('JAIVI');


// Decorative 3D street elements
for(let side of [-1,1]){
  for(let i=0;i<4;i++){
    let x=side*(8+i*3.8),z=-2-i*8;
    box(3,4+Math.random()*2,3,mat(i%2?0x765064:0x94624d),x,2,z);
    const roof2=addMesh(new THREE.ConeGeometry(2.3,1.3,4),roof,x,4.8,z);roof2.rotation.y=Math.PI/4;
    box(1,.1,.1,gold,x,2.8,z+1.55);
    for(let k=-1;k<=1;k++)box(.12,1.5,.12,gold,x+k*.65,2.2,z+1.58);
  }
}
// Street lamps
for(let side of [-1,1])for(let i=0;i<4;i++){let x=side*(7.3),z=3-i*8; cylinder(.09,.14,4,dark,x,2,z);box(.8,.12,.5,gold,x,4,z);sphere(.22,mat(0xffc36b),x,3.75,z);pointLight(0xffa74e,3,8,x,3.7,z)}

// Simple stylized 3D friends silhouettes as festive figures in street
function person(x,z,cloth){
 const g=new THREE.Group();g.position.set(x,0,z);scene.add(g);
 const body=new THREE.Mesh(new THREE.CylinderGeometry(.28,.42,1.25,16),mat(cloth));body.position.y=1.05;g.add(body);
 const head=new THREE.Mesh(new THREE.SphereGeometry(.27,16,12),mat(0xb97852));head.position.y=1.88;g.add(head);
 const hair=new THREE.Mesh(new THREE.SphereGeometry(.28,16,10,0,Math.PI*2,0,Math.PI/2),dark);hair.position.y=2.02;g.add(hair);
 for(let s of [-1,1]){let arm=new THREE.Mesh(new THREE.CylinderGeometry(.08,.1,.8,10),mat(cloth));arm.position.set(s*.38,1.15,0);arm.rotation.z=s*.22;g.add(arm)}
}
person(-5,-19,0x9d527f);person(4,-22,0x347f79);person(1,-17,0xc17a3e);

// Two friends sitting side-by-side, seen from behind, watching the fireworks.
const sittingPair = new THREE.Group();
scene.add(sittingPair);
function seatedFriend(x, shirtColor, scarfColor, hairColor) {
  const g = new THREE.Group();
  g.position.set(x, 0, -18.5);
  sittingPair.add(g);
  const shirtMat = mat(shirtColor, .82);
  const scarfMat = mat(scarfColor, .75);
  const skinMat = mat(0xc98762, .9);
  const hairMat = mat(hairColor, .95);
  // folded legs, torso, head and hair; simplified friendly 3D characters
  const leg1 = new THREE.Mesh(new THREE.CapsuleGeometry(.23,.9,5,10), scarfMat);
  leg1.rotation.z = Math.PI/2.5; leg1.rotation.y = -.35; leg1.position.set(-.28,.28,.18); g.add(leg1);
  const leg2 = new THREE.Mesh(new THREE.CapsuleGeometry(.23,.9,5,10), scarfMat);
  leg2.rotation.z = -Math.PI/2.5; leg2.rotation.y = .35; leg2.position.set(.28,.28,.18); g.add(leg2);
  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(.34,.65,6,12), shirtMat);
  torso.position.set(0,1.02,0); torso.rotation.x = -.12; g.add(torso);
  const head = new THREE.Mesh(new THREE.SphereGeometry(.29,20,16), skinMat);
  head.position.set(0,1.92,-.02); g.add(head);
  const hair = new THREE.Mesh(new THREE.SphereGeometry(.305,20,14,0,Math.PI*2,0,Math.PI/1.8), hairMat);
  hair.position.set(0,2.02,.025); hair.rotation.x = -.12; g.add(hair);
  // arms resting naturally beside the body
  for (const side of [-1,1]) {
    const arm = new THREE.Mesh(new THREE.CapsuleGeometry(.105,.55,4,8), shirtMat);
    arm.position.set(side*.39,1.02,.13); arm.rotation.z=side*.22; arm.rotation.x=-.25; g.add(arm);
  }
  return g;
}
seatedFriend(-.72, 0x3b8f91, 0xd5a35d, 0x241a24);
seatedFriend(.72, 0xc65d82, 0x8e6bb5, 0x211822);
// A woven picnic mat beneath them, oriented toward the night sky.
const matBase = new THREE.Mesh(new THREE.BoxGeometry(4.2,.12,2.6), mat(0x8e3f57,.95));
matBase.position.set(0,.02,-18.4); scene.add(matBase);
for(let i=0;i<9;i++){
  const stripe = new THREE.Mesh(new THREE.BoxGeometry(.045,.015,2.45), gold);
  stripe.position.set(-1.8+i*.45,.09,-18.4); scene.add(stripe);
}
// Small snack bowl beside the friends to make the moment feel lived-in.
const snackBowl = new THREE.Mesh(new THREE.CylinderGeometry(.28,.2,.16,24), gold);
snackBowl.position.set(2.35,.16,-18.6); scene.add(snackBowl);
for(let i=0;i<7;i++){
  const sweet = new THREE.Mesh(new THREE.SphereGeometry(.075,10,8), mat(i%2?0xe7b45c:0xc96c52));
  sweet.position.set(2.15+(i%3)*.16,.27,-18.7+Math.floor(i/3)*.13); scene.add(sweet);
}

// Firework particle system on LEFT side of final view
const fireworkGroup=new THREE.Group();scene.add(fireworkGroup);
const bursts=[];
function makeBurst(x,y,z,color){
 const count=210;const positions=new Float32Array(count*3);const velocities=[];
 for(let i=0;i<count;i++){
   const u=Math.random()*2-1, a=Math.random()*Math.PI*2, q=Math.sqrt(1-u*u);
   const speed=2.2+Math.random()*3.4;
   positions[i*3]=x;positions[i*3+1]=y;positions[i*3+2]=z;
   velocities.push(new THREE.Vector3(q*Math.cos(a)*speed,u*speed,q*Math.sin(a)*speed));
 }
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(positions,3));
 const points=new THREE.Points(geo,new THREE.PointsMaterial({color,size:.12,transparent:true,opacity:1,blending:THREE.AdditiveBlending,depthWrite:false}));
 fireworkGroup.add(points);bursts.push({points,velocities,age:0});
}
let fireworkTimer=0;
let userCanLaunch=false;
function fireworks(dt){
 fireworkTimer+=dt;
 if(fireworkTimer>1.05){fireworkTimer=0;const colors=[0xffc45e,0xff6f9c,0x7fe3d0,0xb99aff];makeBurst(-6.8+Math.random()*1.8,8+Math.random()*3,-29,colors[Math.floor(Math.random()*colors.length)])}
 for(let b of [...bursts]){
  b.age+=dt;const arr=b.points.geometry.attributes.position.array;
  for(let i=0;i<b.velocities.length;i++){let v=b.velocities[i];arr[i*3]+=v.x*dt;arr[i*3+1]+=v.y*dt-1.5*dt*dt;arr[i*3+2]+=v.z*dt;v.y-=3.2*dt}
  b.points.geometry.attributes.position.needsUpdate=true;b.points.material.opacity=Math.max(0,1-b.age/2.2);
  if(b.age>2.3){fireworkGroup.remove(b.points);b.points.geometry.dispose();b.points.material.dispose();bursts.splice(bursts.indexOf(b),1)}
 }
}


// Floating sky lanterns: gentle movement gives the world life between camera cuts.
const floatingLanterns=[];
for(let i=0;i<9;i++){
  const g=new THREE.Group();
  const x=-13+i*3.2, z=-25-Math.random()*12, y=5+Math.random()*6;
  g.position.set(x,y,z);scene.add(g);
  const shell=new THREE.Mesh(new THREE.SphereGeometry(.42,16,12),mat([0xe9a34e,0xe56d8d,0x63b9a7][i%3],.5));
  shell.scale.set(.8,1.15,.8);g.add(shell);
  const base=new THREE.Mesh(new THREE.CylinderGeometry(.18,.22,.08,16),gold);base.position.y=-.43;g.add(base);
  const glow=new THREE.PointLight(0xffb45e,2.5,6);glow.position.y=-.2;g.add(glow);
  floatingLanterns.push({group:g,baseY:y,phase:Math.random()*6});
}

// Glowing floating dust
const dustGeo=new THREE.BufferGeometry(), dustCount=600, dustPos=new Float32Array(dustCount*3);
for(let i=0;i<dustCount;i++){dustPos[i*3]=(Math.random()-.5)*55;dustPos[i*3+1]=Math.random()*17;dustPos[i*3+2]=(Math.random()-.5)*65-8}
dustGeo.setAttribute('position',new THREE.BufferAttribute(dustPos,3));
const dust=new THREE.Points(dustGeo,new THREE.PointsMaterial({color:0xffd69a,size:.045,transparent:true,opacity:.65}));scene.add(dust);

// Name plaque for ending
const plaque=box(7,.15,.12,gold,1.2,3.5,-27.9);plaque.visible=false;
function makeTextSprite(text){
 const c=document.createElement('canvas');c.width=1024;c.height=256;const ctx=c.getContext('2d');
 ctx.clearRect(0,0,1024,256);ctx.font='600 112px Georgia';ctx.textAlign='center';ctx.textBaseline='middle';
 ctx.shadowColor='#ffbd60';ctx.shadowBlur=28;ctx.fillStyle='#ffe2a8';ctx.fillText(text,512,128);
 const tex=new THREE.CanvasTexture(c);const m=new THREE.MeshBasicMaterial({map:tex,transparent:true,depthWrite:false});
 const mesh=new THREE.Mesh(new THREE.PlaneGeometry(8,2),m);return mesh;
}
const nameSprite=makeTextSprite('JAIVI PATEL');nameSprite.position.set(1.2,4.5,-27.8);nameSprite.visible=false;scene.add(nameSprite);


// After the camera reaches the final scene, clicking the sky launches a celebratory burst.
// This is only a visual animation inside the website.
addEventListener('pointerdown',(event)=>{
  if(!userCanLaunch || !started) return;
  const rect=renderer.domElement.getBoundingClientRect();
  const nx=(event.clientX-rect.left)/rect.width;
  const ny=(event.clientY-rect.top)/rect.height;
  const x=-10 + nx*8.5;
  const y=5.5 + (1-ny)*7;
  const palette=[0xffc45e,0xff6f9c,0x7fe3d0,0xb99aff,0xffffff];
  makeBurst(x,y,-28,palette[Math.floor(Math.random()*palette.length)]);
  const msg=document.getElementById('wishHint');
  if(msg){msg.textContent='A little wish sent into the sky ✨';msg.classList.add('visible');}
});

// The story plays like a short cinematic: greeting, knock, door opening, street reveal,
// Jaivi's rangoli, then the two friends watching fireworks and the final message.
const captions=[
 ['A LITTLE DIWALI MAGIC','Happy Diwali, Jaivi ✨'],
 ['KNOCK, KNOCK…','Someone is here for you'],
 ['COME ON, LET’S GO','Look at all these lights!'],
 ['A SURPRISE ON THE STREET','Someone made this just for you'],
 ['OUR LITTLE DIWALI MOMENT','Let’s sit here and watch the sky'],
 ['UNTIL WE MEET AGAIN','Miss you, Jaivi ❤️']
];
let timeline=null,started=false;
function caption(i){document.getElementById('capSmall').textContent=captions[i][0];document.getElementById('capBig').textContent=captions[i][1];document.getElementById('caption').classList.add('show');}
function sceneLabel(n){document.getElementById('progress').textContent=`SCENE 0${n} / 06`;}
function startJourney(){
 if(started)return;started=true;
 document.getElementById('welcome').classList.add('hide');
 document.getElementById('skip').classList.add('show');document.getElementById('progress').classList.add('show');
 camera.position.set(0,5.2,18);camera.lookAt(0,3,-8);
 const tl=gsap.timeline();timeline=tl;
 tl.call(()=>{sceneLabel(1);caption(0)})
 // Glide down the festive street toward the house.
 .to(camera.position,{z:8,y:4.4,duration:3.2,ease:'power2.inOut',onUpdate:()=>camera.lookAt(0,2.5,-8)})
 // Little knock: door wiggles, then swings open toward the street.
 .call(()=>{sceneLabel(2);caption(1);gsap.to(door.rotation,{y:-.08,duration:.12,yoyo:true,repeat:5,ease:'sine.inOut'});gsap.to(doorKnob.position,{y:1.74,duration:.12,yoyo:true,repeat:5,ease:'sine.inOut'});})
 .to(camera.position,{z:2.5,y:3.2,duration:2.1,ease:'power2.inOut',onUpdate:()=>camera.lookAt(0,2,-8)})
 .to(door.rotation,{y:-1.35,duration:1.3,ease:'power2.inOut'},'-=0.3')
 // Step outside and reveal the bright street with a sweeping camera move.
 .call(()=>{sceneLabel(3);caption(2)})
 .to(camera.position,{x:-2.8,y:5.2,z:-8.5,duration:3.2,ease:'power2.inOut',onUpdate:()=>camera.lookAt(0,2,-22)})
 .to(camera.position,{x:2.8,y:5.4,z:-10.5,duration:2.4,ease:'sine.inOut',onUpdate:()=>camera.lookAt(0,2,-22)})
 // Pause on the rangoli and push in to make the name the reveal.
 .call(()=>{sceneLabel(4);caption(3)})
 .to(camera.position,{x:0,y:3.2,z:-9.8,duration:1.8,ease:'power2.inOut',onUpdate:()=>camera.lookAt(0,.1,-13.2)})
 .to(camera.position,{x:0,y:2.4,z:-11.1,duration:1.2,ease:'sine.inOut',onUpdate:()=>camera.lookAt(0,.05,-13.2)})
 .to({}, {duration:1.8})
 // Move on to the two friends, settle beside them, and frame the fireworks on the left.
 .call(()=>{sceneLabel(5);caption(4)})
 .to(camera.position,{x:0,y:4.6,z:-11.8,duration:3.0,ease:'power2.inOut',onUpdate:()=>camera.lookAt(0,2,-20.5)})
 .to(camera.position,{x:0,y:4.7,z:-12.8,duration:1.8,ease:'sine.inOut',onUpdate:()=>camera.lookAt(-5.8,8.2,-29)})
 .call(()=>{sceneLabel(6);caption(5);userCanLaunch=true;document.getElementById('wishHint')?.classList.add('visible');document.getElementById('finalMessage')?.classList.add('show');})
 .to({}, {duration:8});
}
document.getElementById('enter').addEventListener('click',startJourney);
document.getElementById('skip').addEventListener('click',()=>{
 if(!started){startJourney();return}
 if(timeline)timeline.progress(1);
 nameSprite.visible=true;plaque.visible=true;
 camera.position.set(0,4.7,-12.8);camera.lookAt(-5.8,8.2,-29);sceneLabel(6);caption(5);userCanLaunch=true;document.getElementById('wishHint')?.classList.add('visible');document.getElementById('finalMessage')?.classList.add('show');
});
const clock=new THREE.Clock();
function animate(){
 requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.04);
 fireworks(dt);
 flames.forEach((f,i)=>{const t=performance.now()*.003+i;f.scale.y=1.2+Math.sin(t)*.25;f.scale.x=.5+Math.sin(t*1.7)*.08});
 dust.rotation.y+=dt*.008; rangoliGroup.rotation.y=Math.sin(performance.now()*.00035)*.012;
 floatingLanterns.forEach((l,i)=>{l.group.position.y=l.baseY+Math.sin(performance.now()*.0007+l.phase)*.28;l.group.rotation.z=Math.sin(performance.now()*.00045+l.phase)*.06;});
 renderer.render(scene,camera);
}
animate();
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});
