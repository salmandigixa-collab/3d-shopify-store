import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const viewer = document.querySelector('#shoe-viewer');
const loading = document.querySelector('#canvas-loading');
let renderer, scene, camera, controls, shoeRoot, accentMaterial;
let isInteracting = false;
let frame = 0;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function material(color, roughness = 0.65, metalness = 0) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness });
}
function addMesh(parent, geometry, mat, position, rotation = [0,0,0]) {
  const mesh = new THREE.Mesh(geometry, mat);
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}
function makeSole(parent, x, y, z, length, height, width, color, bevel = 0.08) {
  const shape = new THREE.Shape();
  shape.moveTo(-length*.49, 0);
  shape.quadraticCurveTo(-length*.54, height*.55, -length*.38, height*.72);
  shape.lineTo(length*.24, height);
  shape.quadraticCurveTo(length*.48, height*.92, length*.5, height*.55);
  shape.lineTo(length*.48, height*.2);
  shape.quadraticCurveTo(length*.4, 0, length*.2, 0);
  shape.lineTo(-length*.49, 0);
  const geo = new THREE.ExtrudeGeometry(shape, {depth:width, bevelEnabled:true, bevelSegments:3, steps:1, bevelSize:bevel, bevelThickness:bevel, curveSegments:14});
  geo.translate(0,0,-width/2);
  return addMesh(parent,geo,material(color,.72),[x,y,z],[0,0,0]);
}
function createSneaker() {
  shoeRoot = new THREE.Group();
  scene.add(shoeRoot);
  const upper = material('#eeeae0',.56);
  const upperShade = material('#d4d1c8',.65);
  const soleMat = material('#f9f8f2',.48);
  const rubber = material('#b9bcad',.83);
  accentMaterial = material('#c8ff00',.36,.05);
  const accent = accentMaterial;
  const dark = material('#22241e',.5);
  const glassy = material('#ffffff',.35);
  // Length axis is X: toe points left, heel right.
  makeSole(shoeRoot,0,-.67,0,3.5,.31,.95,'#e8e8df',.07);
  makeSole(shoeRoot,0,-.78,0,3.35,.12,.9,'#aeb1a4',.035);
  // Layered, sculpted upper silhouette.
  const bodyShape = new THREE.Shape();
  bodyShape.moveTo(-1.66,-.38);
  bodyShape.quadraticCurveTo(-1.79,-.1,-1.51,.12);
  bodyShape.lineTo(-.9,.3);
  bodyShape.quadraticCurveTo(-.62,.44,-.33,.48);
  bodyShape.lineTo(.55,.45);
  bodyShape.quadraticCurveTo(.9,.4,1.05,.17);
  bodyShape.lineTo(1.42,-.1);
  bodyShape.quadraticCurveTo(1.54,-.23,1.48,-.4);
  bodyShape.lineTo(-1.66,-.38);
  const upperGeo = new THREE.ExtrudeGeometry(bodyShape,{depth:.76,bevelEnabled:true,bevelSegments:5,steps:1,bevelSize:.1,bevelThickness:.1,curveSegments:20});
  upperGeo.translate(0,0,-.38);
  addMesh(shoeRoot,upperGeo,upper,[0,-.27,0]);
  // Heel collar and tongue.
  addMesh(shoeRoot,new THREE.BoxGeometry(.64,.15,.61),upperShade,[.73,.08,0],[0,0,-.24]);
  addMesh(shoeRoot,new THREE.BoxGeometry(.49,.15,.48),upper,[.04,.2,0],[0,0,-.43]);
  addMesh(shoeRoot,new THREE.BoxGeometry(.42,.1,.43),dark,[.16,.285,0],[0,0,-.43]);
  // Side overlays make the silhouette read as a technical runner.
  const panelShape = new THREE.Shape();
  panelShape.moveTo(-.95,-.18); panelShape.quadraticCurveTo(-.52,.17,-.12,.18);
  panelShape.lineTo(.34,.06); panelShape.quadraticCurveTo(.06,-.1,-.18,-.17);
  panelShape.lineTo(-.95,-.18);
  const panelGeo = new THREE.ExtrudeGeometry(panelShape,{depth:.025,bevelEnabled:true,bevelSize:.015,bevelThickness:.01,bevelSegments:2});
  addMesh(shoeRoot,panelGeo,glassy,[-.03,-.27,.397],[0,0,0]);
  const sideStripe = new THREE.Shape();
  sideStripe.moveTo(-.7,-.03); sideStripe.lineTo(-.13,.11); sideStripe.lineTo(.25,.04); sideStripe.lineTo(-.15,-.01); sideStripe.lineTo(-.7,-.03);
  addMesh(shoeRoot,new THREE.ExtrudeGeometry(sideStripe,{depth:.035,bevelEnabled:true,bevelSize:.01,bevelThickness:.01,bevelSegments:2}),accent,[0,-.28,.435]);
  // A matching panel on the far side.
  addMesh(shoeRoot,panelGeo,upperShade,[-.03,-.27,-.42],[0,0,0]);
  addMesh(shoeRoot,new THREE.ExtrudeGeometry(sideStripe,{depth:.03,bevelEnabled:true,bevelSize:.01,bevelThickness:.01,bevelSegments:2}),accent,[0,-.28,-.46]);
  // Lace bed and eyelets.
  for(let i=0;i<5;i++){
    const lx=-.32+i*.13;
    const lace=addMesh(shoeRoot,new THREE.BoxGeometry(.36,.035,.055),glassy,[lx,.24,0],[0,0,.16]);
    lace.rotation.y=(i%2===0?.18:-.18);
    for(const side of [-1,1]){
      addMesh(shoeRoot,new THREE.SphereGeometry(.035,12,8),dark,[lx-.12,.21,side*.235]);
    }
  }
  for(let i=0;i<4;i++){
    addMesh(shoeRoot,new THREE.BoxGeometry(.27,.027,.06),glassy,[-.35+i*.14,.31,0],[0,0,.12]);
  }
  // Heel counter, toe bumper, outsole tread bars.
  addMesh(shoeRoot,new THREE.BoxGeometry(.27,.3,.8),upperShade,[1.2,-.28,0],[0,0,-.18]);
  addMesh(shoeRoot,new THREE.BoxGeometry(.16,.17,.83),rubber,[-1.43,-.45,0],[0,0,-.12]);
  for(let i=0;i<9;i++){
    const x=-1.35+i*.32;
    addMesh(shoeRoot,new THREE.BoxGeometry(.12,.025,.7),rubber,[x,-.82,0],[0,0,0]);
  }
  // Tiny heel mark.
  addMesh(shoeRoot,new THREE.BoxGeometry(.035,.19,.025),accent,[1.31,-.17,.418],[0,0,-.1]);
  shoeRoot.rotation.set(.1, -.4, -.1);
  shoeRoot.scale.setScalar(1);
}
function initViewer() {
  try {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(34, viewer.clientWidth / viewer.clientHeight, .1, 100);
    camera.position.set(0,2.2,7.8);
    renderer = new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1,2));
    renderer.setSize(viewer.clientWidth,viewer.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    viewer.appendChild(renderer.domElement);
    controls = new OrbitControls(camera,renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = .06;
    controls.enablePan = false;
    controls.minDistance = 5;
    controls.maxDistance = 10;
    controls.minPolarAngle = Math.PI*.22;
    controls.maxPolarAngle = Math.PI*.72;
    controls.target.set(0,-.16,0);
    scene.add(new THREE.HemisphereLight('#fffdf4','#7e8273',2.1));
    const key = new THREE.DirectionalLight('#ffffff',3.2);
    key.position.set(-3,6,5); key.castShadow=true; key.shadow.mapSize.set(1024,1024); scene.add(key);
    const rim = new THREE.DirectionalLight('#d8ff3e',1.6); rim.position.set(3,2,-4); scene.add(rim);
    const fill = new THREE.DirectionalLight('#ffffff',1.2); fill.position.set(0,-1,4); scene.add(fill);
    const floor = new THREE.Mesh(new THREE.CircleGeometry(3.2,64),new THREE.ShadowMaterial({opacity:.13}));
    floor.rotation.x=-Math.PI/2; floor.position.y=-.9; floor.receiveShadow=true; scene.add(floor);
    createSneaker();
    loading?.remove();
    const resize = () => {
      if (!renderer || !camera) return;
      const w=viewer.clientWidth,h=viewer.clientHeight;
      camera.aspect=w/Math.max(h,1);camera.updateProjectionMatrix();renderer.setSize(w,h);
    };
    new ResizeObserver(resize).observe(viewer);
    const reset = document.querySelector('#reset-view');
    reset?.addEventListener('click',()=>{controls.reset();shoeRoot.rotation.set(.1,-.4,-.1);});
    const animate = () => {
      frame=requestAnimationFrame(animate);
      controls.update();
      if(!reducedMotion && shoeRoot){
        const t=performance.now()*.001;
        shoeRoot.position.y=Math.sin(t*1.25)*.075;
        if(!isInteracting) shoeRoot.rotation.y += .0018;
        shoeRoot.rotation.z = -.1 + Math.sin(t*.55)*.025;
      }
      renderer.render(scene,camera);
    };
    renderer.domElement.addEventListener('pointerdown',()=>{isInteracting=true;});
    window.addEventListener('pointerup',()=>{isInteracting=false;});
    animate();
  } catch(error) {
    console.error('3D viewer could not start:',error);
    if(loading) loading.textContent='3D VIEWER UNAVAILABLE — PLEASE TRY A WEBGL-COMPATIBLE BROWSER';
  }
}
initViewer();

// Scroll reveals and mobile navigation.
const revealNodes=document.querySelectorAll('.reveal');
if('IntersectionObserver' in window && !reducedMotion){
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}
  }),{threshold:.12});
  revealNodes.forEach(node=>observer.observe(node));
}else revealNodes.forEach(node=>node.classList.add('is-visible'));
const menuToggle=document.querySelector('#menu-toggle');
const nav=document.querySelector('#main-nav');
menuToggle?.addEventListener('click',()=>{
  const open=nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded',String(open));
});
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menuToggle?.setAttribute('aria-expanded','false');}));

// Demo shopping bag. This is local page state, not a real payment/cart integration.
const cart=[];
const drawer=document.querySelector('#cart-drawer');
const body=document.body;
const countEl=document.querySelector('#cart-count');
const drawerCount=document.querySelector('#drawer-count');
const itemsEl=document.querySelector('#cart-items');
const subtotalEl=document.querySelector('#cart-subtotal');
const toast=document.querySelector('#toast');
let toastTimer;
function money(value){return 'PKR '+new Intl.NumberFormat('en-PK',{maximumFractionDigits:0}).format(value);}
function showToast(message){
  toast.textContent=message;toast.classList.add('show');clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>toast.classList.remove('show'),2400);
}
function renderCart(){
  const totalQty=cart.reduce((sum,item)=>sum+item.qty,0);
  const subtotal=cart.reduce((sum,item)=>sum+item.price*item.qty,0);
  countEl.textContent=totalQty;drawerCount.textContent='('+totalQty+')';subtotalEl.textContent=money(subtotal);
  if(!cart.length){itemsEl.innerHTML='<p class="empty-cart">Your next favourite pair is waiting.</p>';return;}
  itemsEl.innerHTML=cart.map((item,index)=>'<div class="cart-item"><strong>'+item.name+'</strong><span>'+money(item.price)+' × '+item.qty+'</span><button type="button" data-remove="'+index+'">REMOVE ITEM ×</button></div>').join('');
}
function openCart(){body.classList.add('cart-open');drawer.setAttribute('aria-hidden','false');document.querySelector('#cart-close').focus();}
function closeCart(){body.classList.remove('cart-open');drawer.setAttribute('aria-hidden','true');document.querySelector('#cart-open').focus();}
document.querySelector('#cart-open').addEventListener('click',openCart);
document.querySelector('#cart-close').addEventListener('click',closeCart);
document.querySelector('#drawer-backdrop')?.addEventListener('click',closeCart);
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&body.classList.contains('cart-open'))closeCart();});
document.querySelectorAll('.add-button').forEach(button=>button.addEventListener('click',()=>{
  const name=button.dataset.product;const price=Number(button.dataset.price);
  const existing=cart.find(item=>item.name===name);
  if(existing)existing.qty++;else cart.push({name,price,qty:1});
  renderCart();showToast(name+' added to your bag');button.innerHTML='ADDED ✓';setTimeout(()=>button.innerHTML='ADD TO BAG <span>+</span>',1200);
}));
itemsEl.addEventListener('click',event=>{
  const button=event.target.closest('[data-remove]');if(!button)return;
  cart.splice(Number(button.dataset.remove),1);renderCart();
});
function applyProductFilters(){
  const active=document.querySelector('.filter.active')?.dataset.filter||'all';
  const query=(document.querySelector('#product-search')?.value||'').trim().toLowerCase();
  document.querySelectorAll('.product-card').forEach(card=>{
    const categoryMatch=active==='all'||card.dataset.category===active;
    const searchMatch=!query||(card.dataset.name||'').toLowerCase().includes(query)||card.textContent.toLowerCase().includes(query);
    card.hidden=!(categoryMatch&&searchMatch);
  });
}
document.querySelectorAll('.filter').forEach(button=>button.addEventListener('click',()=>{
  document.querySelectorAll('.filter').forEach(item=>item.classList.toggle('active',item===button));
  applyProductFilters();
}));
document.querySelector('#product-search')?.addEventListener('input',applyProductFilters);
document.querySelectorAll('.wish-button').forEach(button=>button.addEventListener('click',event=>{event.preventDefault();button.classList.toggle('saved');button.textContent=button.classList.contains('saved')?'♥':'♡';showToast(button.classList.contains('saved')?'Saved to your favourites':'Removed from favourites');}));
document.querySelectorAll('.hero-color').forEach(button=>button.addEventListener('click',()=>{
  document.querySelectorAll('.hero-color').forEach(item=>item.classList.toggle('selected',item===button));
  if(accentMaterial) accentMaterial.color.set(button.dataset.shoeColor);
  showToast('3D accent colour updated');
}));
document.querySelectorAll('.swatches').forEach(group=>group.querySelectorAll('.swatch').forEach(swatch=>swatch.addEventListener('click',()=>{
  group.querySelectorAll('.swatch').forEach(s=>s.classList.toggle('selected',s===swatch));
  showToast('Colour selected: '+swatch.title+' · Demo preview only');
})));
document.querySelector('#demo-checkout').addEventListener('click',()=>showToast('Demo only — connect Shopify checkout before accepting orders.'));
document.querySelector('#newsletter-form').addEventListener('submit',event=>{
  event.preventDefault();document.querySelector('#newsletter-message').textContent='Thanks for your interest! Connect an email platform to collect subscriptions.';event.target.reset();
});
document.querySelector('#year').textContent=new Date().getFullYear();
window.addEventListener('pagehide',()=>cancelAnimationFrame(frame));
