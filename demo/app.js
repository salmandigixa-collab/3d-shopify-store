import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const viewer = document.querySelector('#shoe-viewer');
const loading = document.querySelector('#canvas-loading');
let renderer, scene, camera, controls, shoeRoot, accentMaterial;
let isInteracting = false;
let currentAccentColor = '#c8ff00';
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

  const upper = material('#e8e6df', .72);
  const upperLight = material('#faf9f4', .62);
  const upperShade = material('#c9c9c0', .78);
  const soleMat = material('#f8f7f1', .58);
  const outsoleMat = material('#b8bbb0', .88);
  const dark = material('#242820', .48);
  const eyeletMat = material('#6b7064', .36, .25);
  accentMaterial = material(currentAccentColor, .42, .02);
  const accent = accentMaterial;

  // A real sneaker silhouette: toe at left, heel at right, sole below.
  // Build the upper as a smooth loft through cross-sections rather than a flat extruded shape.
  const sections = [
    [-1.72, -.39, -.15, .31],
    [-1.57, -.43, .01, .39],
    [-1.34, -.43, .16, .43],
    [-1.02, -.43, .26, .45],
    [-.68, -.43, .34, .43],
    [-.32, -.43, .39, .39],
    [.05, -.43, .38, .37],
    [.38, -.43, .34, .39],
    [.68, -.43, .29, .42],
    [.94, -.43, .18, .43],
    [1.18, -.43, .04, .40],
    [1.36, -.41, -.04, .33],
    [1.43, -.39, -.10, .23]
  ];
  const ringCount = 24;
  const vertices = [];
  const indices = [];
  const uvs = [];
  sections.forEach((section, i) => {
    const [x, bottom, top, halfWidth] = section;
    const centerY = (bottom + top) / 2;
    const halfHeight = Math.max(.035, (top - bottom) / 2);
    for (let j = 0; j <= ringCount; j++) {
      const angle = (j / ringCount) * Math.PI * 2;
      // Flatten the bottom slightly like a shoe last, with a rounded toe and heel.
      const cs = Math.cos(angle);
      const sn = Math.sin(angle);
      const y = centerY + halfHeight * cs;
      const z = halfWidth * sn;
      vertices.push(x, y, z);
      uvs.push(i / (sections.length - 1), j / ringCount);
    }
  });
  for (let i = 0; i < sections.length - 1; i++) {
    for (let j = 0; j < ringCount; j++) {
      const a = i * (ringCount + 1) + j;
      const b = a + ringCount + 1;
      indices.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
  const upperGeo = new THREE.BufferGeometry();
  upperGeo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  upperGeo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  upperGeo.setIndex(indices);
  upperGeo.computeVertexNormals();
  const upperMesh = new THREE.Mesh(upperGeo, upper);
  upperMesh.castShadow = true;
  upperMesh.receiveShadow = true;
  shoeRoot.add(upperMesh);

  // Layered rubber midsole and outsole follow the curved side profile.
  const soleShape = new THREE.Shape();
  soleShape.moveTo(-1.76, -.43);
  soleShape.quadraticCurveTo(-1.82, -.49, -1.70, -.55);
  soleShape.lineTo(-1.45, -.61);
  soleShape.quadraticCurveTo(-.85, -.66, -.12, -.64);
  soleShape.lineTo(.73, -.62);
  soleShape.quadraticCurveTo(1.16, -.60, 1.40, -.51);
  soleShape.quadraticCurveTo(1.52, -.47, 1.48, -.40);
  soleShape.lineTo(1.28, -.38);
  soleShape.quadraticCurveTo(.55, -.45, -.24, -.45);
  soleShape.lineTo(-1.42, -.43);
  soleShape.closePath();
  const soleGeo = new THREE.ExtrudeGeometry(soleShape, {
    depth: .88, bevelEnabled: true, bevelSegments: 4,
    steps: 1, bevelSize: .035, bevelThickness: .035, curveSegments: 18
  });
  soleGeo.translate(0, 0, -.44);
  const midsole = new THREE.Mesh(soleGeo, soleMat);
  midsole.castShadow = true;
  midsole.receiveShadow = true;
  shoeRoot.add(midsole);

  const outsoleShape = new THREE.Shape();
  outsoleShape.moveTo(-1.69, -.56);
  outsoleShape.quadraticCurveTo(-1.5, -.62, -.9, -.65);
  outsoleShape.lineTo(.55, -.65);
  outsoleShape.quadraticCurveTo(1.22, -.63, 1.43, -.53);
  outsoleShape.lineTo(1.40, -.59);
  outsoleShape.quadraticCurveTo(.55, -.71, -.65, -.69);
  outsoleShape.quadraticCurveTo(-1.38, -.67, -1.69, -.61);
  outsoleShape.closePath();
  const outsoleGeo = new THREE.ExtrudeGeometry(outsoleShape, {
    depth: .90, bevelEnabled: true, bevelSegments: 2,
    steps: 1, bevelSize: .018, bevelThickness: .018, curveSegments: 14
  });
  outsoleGeo.translate(0, 0, -.45);
  const outsole = new THREE.Mesh(outsoleGeo, outsoleMat);
  outsole.castShadow = true;
  shoeRoot.add(outsole);

  // Toe bumper and subtle toe-cap stitching.
  const toeCap = new THREE.Mesh(
    new THREE.SphereGeometry(1, 28, 18),
    upperLight
  );
  toeCap.scale.set(.40, .105, .345);
  toeCap.position.set(-1.30, -.205, 0);
  toeCap.castShadow = true;
  shoeRoot.add(toeCap);

  // Padded heel collar with a dark opening, shaped like a real shoe opening.
  const collar = new THREE.Mesh(
    new THREE.TorusGeometry(.235, .052, 10, 36),
    upperShade
  );
  collar.rotation.x = Math.PI / 2;
  collar.scale.set(1.22, .82, 1);
  collar.position.set(.78, .205, 0);
  collar.castShadow = true;
  shoeRoot.add(collar);
  const opening = new THREE.Mesh(
    new THREE.CylinderGeometry(.19, .22, .035, 32, 1, false),
    dark
  );
  opening.scale.set(1.25, 1, .84);
  opening.position.set(.78, .20, 0);
  opening.castShadow = true;
  shoeRoot.add(opening);

  // Tongue and a row of crossing laces on top of the instep.
  const tongue = addMesh(
    shoeRoot, new THREE.BoxGeometry(.68, .075, .36), upperShade,
    [.10, .355, 0], [0, 0, -.12]
  );
  tongue.castShadow = true;
  const tongueTop = addMesh(
    shoeRoot, new THREE.BoxGeometry(.48, .035, .27), upperLight,
    [.12, .397, 0], [0, 0, -.12]
  );
  tongueTop.castShadow = true;
  for (let i = 0; i < 5; i++) {
    const x = -.32 + i * .145;
    const y = .335 - i * .014;
    // Lace eyelets on both sides of the throat.
    for (const side of [-1, 1]) {
      const eyelet = new THREE.Mesh(new THREE.TorusGeometry(.032, .009, 6, 12), eyeletMat);
      eyelet.position.set(x, y + .025, side * (.17 - i * .004));
      eyelet.rotation.x = Math.PI / 2;
      eyelet.castShadow = true;
      shoeRoot.add(eyelet);
    }
    const lace = addMesh(
      shoeRoot, new THREE.BoxGeometry(.235, .024, .035), upperLight,
      [x + .045, y + .058, 0], [0, 0, i % 2 ? .16 : -.16]
    );
    lace.castShadow = true;
  }

  // Side overlays and a recognisable curved STRIDES performance stripe.
  for (const side of [-1, 1]) {
    const z = side * .392;
    const overlayCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.05, -.17, z * .92),
      new THREE.Vector3(-.76, .015, z),
      new THREE.Vector3(-.30, .075, z * 1.02),
      new THREE.Vector3(.18, -.015, z * 1.04),
      new THREE.Vector3(.50, -.16, z * .95)
    ]);
    const overlay = new THREE.Mesh(
      new THREE.TubeGeometry(overlayCurve, 36, .032, 8, false), upperLight
    );
    overlay.castShadow = true;
    shoeRoot.add(overlay);

    const stripeCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-.91, -.12, z * 1.04),
      new THREE.Vector3(-.55, -.005, z * 1.10),
      new THREE.Vector3(-.18, -.04, z * 1.11),
      new THREE.Vector3(.16, -.14, z * 1.06)
    ]);
    const stripe = new THREE.Mesh(
      new THREE.TubeGeometry(stripeCurve, 28, .025, 8, false), accent
    );
    stripe.castShadow = true;
    shoeRoot.add(stripe);
  }

  // Heel pull tab, tiny branding plate and textured outsole grooves.
  addMesh(shoeRoot, new THREE.BoxGeometry(.10, .25, .075), accent, [1.18, .17, 0], [0, 0, -.12]);
  addMesh(shoeRoot, new THREE.BoxGeometry(.22, .045, .16), dark, [.77, .455, 0], [0, 0, -.12]);
  for (let i = 0; i < 9; i++) {
    const x = -1.42 + i * .31;
    addMesh(shoeRoot, new THREE.BoxGeometry(.105, .018, .72), dark, [x, -.672, 0]);
  }

  shoeRoot.rotation.set(.03, -.36, -.035);
  shoeRoot.scale.setScalar(1.04);
}
function initViewer() {
  try {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(34, viewer.clientWidth / viewer.clientHeight, .1, 100);
    camera.position.set(0,1.45,8.8);
    renderer = new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'high-performance'});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1,1.75));
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
    controls.minPolarAngle = Math.PI*.28;
    controls.maxPolarAngle = Math.PI*.49;
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
    reset?.addEventListener('click',()=>{controls.reset();shoeRoot.rotation.set(.04,-.28,-.03);});
    const animate = () => {
      frame=requestAnimationFrame(animate);
      controls.update();
      if(!reducedMotion && shoeRoot){
        const t=performance.now()*.001;
        shoeRoot.position.y=Math.sin(t*1.25)*.075;
        if(!isInteracting) shoeRoot.rotation.y = -.28 + Math.sin(t*.28)*.12;
        shoeRoot.rotation.z = -.03 + Math.sin(t*.55)*.012;
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
  itemsEl.innerHTML=cart.map((item,index)=>'<div class="cart-item"><strong>'+item.name+'</strong><span>'+money(item.price)+' × '+item.qty+'</span><small>EU size: '+item.size+'</small><button type="button" data-remove="'+index+'">REMOVE ITEM ×</button></div>').join('');
}
function openCart(){body.classList.add('cart-open');drawer.setAttribute('aria-hidden','false');document.querySelector('#cart-close').focus();}
function closeCart(){body.classList.remove('cart-open');drawer.setAttribute('aria-hidden','true');document.querySelector('#cart-open').focus();}
document.querySelector('#cart-open').addEventListener('click',openCart);
document.querySelector('#cart-close').addEventListener('click',closeCart);
document.querySelector('#drawer-backdrop')?.addEventListener('click',closeCart);
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&body.classList.contains('cart-open'))closeCart();});
document.querySelectorAll('.add-button').forEach(button=>button.addEventListener('click',()=>{
  const name=button.dataset.product;const price=Number(button.dataset.price);
  if(button.id==='quick-view-add'&&!button.dataset.size){showToast('Choose a size before adding to your bag');return;}
  const size=button.dataset.size||'Not selected';
  const existing=cart.find(item=>item.name===name&&item.size===size);
  if(existing)existing.qty++;else cart.push({name,price,qty:1,size});
  renderCart();showToast(name+' added to your bag');button.innerHTML='ADDED ✓';setTimeout(()=>button.innerHTML='ADD TO BAG <span>+</span>',1200);
}));
itemsEl.addEventListener('click',event=>{
  const button=event.target.closest('[data-remove]');if(!button)return;
  cart.splice(Number(button.dataset.remove),1);renderCart();
});
function applyProductFilters(){
  const active=document.querySelector('.filter.active')?.dataset.filter||'all';
  const query=(document.querySelector('#product-search')?.value||'').trim().toLowerCase();
  const cards=[...document.querySelectorAll('.product-card')];
  cards.forEach(card=>{
    const categoryMatch=active==='all'||card.dataset.category===active;
    const searchMatch=!query||(card.dataset.name||'').toLowerCase().includes(query)||card.textContent.toLowerCase().includes(query);
    card.hidden=!(categoryMatch&&searchMatch);
  });
  const sort=document.querySelector('#product-sort')?.value||'featured';
  const grid=document.querySelector('#product-grid');
  const visible=cards.filter(card=>!card.hidden);
  visible.sort((a,b)=>{
    const priceA=Number(a.dataset.price||a.querySelector('[data-price]')?.dataset.price||0);
    const priceB=Number(b.dataset.price||b.querySelector('[data-price]')?.dataset.price||0);
    if(sort==='price-low')return priceA-priceB;
    if(sort==='price-high')return priceB-priceA;
    if(sort==='name')return (a.dataset.name||'').localeCompare(b.dataset.name||'');
    return cards.indexOf(a)-cards.indexOf(b);
  });
  visible.forEach(card=>grid.appendChild(card));
  const counter=document.querySelector('#results-count');
  if(counter)counter.textContent=visible.length+' '+(visible.length===1?'style':'styles');
}
document.querySelector('#product-sort')?.addEventListener('change',applyProductFilters);
document.querySelectorAll('.filter').forEach(button=>button.addEventListener('click',()=>{
  document.querySelectorAll('.filter').forEach(item=>item.classList.toggle('active',item===button));
  applyProductFilters();
}));
document.querySelector('#product-search')?.addEventListener('input',applyProductFilters);
document.querySelectorAll('.wish-button').forEach(button=>button.addEventListener('click',event=>{event.preventDefault();button.classList.toggle('saved');button.textContent=button.classList.contains('saved')?'♥':'♡';showToast(button.classList.contains('saved')?'Saved to your favourites':'Removed from favourites');}));
document.querySelectorAll('.hero-color').forEach(button=>button.addEventListener('click',()=>{
  document.querySelectorAll('.hero-color').forEach(item=>item.classList.toggle('selected',item===button));
  currentAccentColor=button.dataset.shoeColor;
  if(accentMaterial) accentMaterial.color.set(currentAccentColor);
  showToast('3D accent colour updated');
}));
document.querySelectorAll('.swatches').forEach(group=>group.querySelectorAll('.swatch').forEach(swatch=>swatch.addEventListener('click',()=>{
  group.querySelectorAll('.swatch').forEach(s=>s.classList.toggle('selected',s===swatch));
  const img=group.closest('.product-card')?.querySelector('.product-visual img');
  const filters={red:'none',white:'grayscale(1) brightness(1.16)',black:'grayscale(1) brightness(.55)',blue:'hue-rotate(145deg) saturate(.85)',lime:'hue-rotate(45deg) saturate(1.2)',coral:'hue-rotate(325deg) saturate(1.15)',olive:'hue-rotate(35deg) saturate(.7)',cream:'sepia(.18) saturate(.75)'};
  if(img)img.style.filter=filters[swatch.title.toLowerCase()]||'none';
  showToast('Colour preview: '+swatch.title+' · Demo only');
})));
const quickModal=document.querySelector('#quick-view-modal');
const quickBackdrop=document.querySelector('#quick-view-backdrop');
const quickAdd=document.querySelector('#quick-view-add');
const quickTitle=document.querySelector('#quick-view-title');
const quickDescription=document.querySelector('#quick-view-description');
const quickPrice=document.querySelector('#quick-view-price');
const sizeNote=document.querySelector('#quick-view-size-note');
let selectedSize='';
function closeQuickView(){document.body.classList.remove('quick-view-open');quickModal.setAttribute('aria-hidden','true');}
function openQuickView(card){
  const name=card.dataset.name||'STRIDES Sneaker';
  const price=Number(card.dataset.price||card.querySelector('[data-price]')?.dataset.price||0);
  quickTitle.textContent=name;
  quickDescription.textContent=card.querySelector('.product-meta p')?.textContent||'Built for everyday movement and comfort.';
  quickPrice.textContent=money(price);
  quickAdd.dataset.product=name;quickAdd.dataset.price=String(price);quickAdd.dataset.size='';
  quickAdd.innerHTML='SELECT SIZE TO ADD <span>+</span>';
  selectedSize='';
  document.querySelectorAll('#quick-view-sizes [data-size]').forEach(btn=>btn.classList.remove('selected'));
  sizeNote.textContent='Choose your size to continue.';
  document.body.classList.add('quick-view-open');quickModal.setAttribute('aria-hidden','false');
  document.querySelector('#quick-view-close').focus();
}
document.querySelectorAll('.quick-view-button').forEach(button=>button.addEventListener('click',()=>openQuickView(button.closest('.product-card'))));
document.querySelector('#quick-view-close')?.addEventListener('click',closeQuickView);
quickBackdrop?.addEventListener('click',closeQuickView);
document.querySelectorAll('#quick-view-sizes [data-size]').forEach(button=>button.addEventListener('click',()=>{
  selectedSize=button.dataset.size;
  document.querySelectorAll('#quick-view-sizes [data-size]').forEach(item=>item.classList.toggle('selected',item===button));
  quickAdd.dataset.size=selectedSize;quickAdd.innerHTML='ADD SIZE '+selectedSize+' TO BAG <span>+</span>';
  sizeNote.textContent='EU '+selectedSize+' selected · demo availability';
}));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&document.body.classList.contains('quick-view-open'))closeQuickView();});
document.querySelectorAll('.product-visual img, .campaign-visual img').forEach(img=>img.addEventListener('error',()=>{
  img.closest('.product-visual')?.classList.add('image-failed');
  img.alt='STRIDES product image unavailable; try another connection.';
}));
document.querySelector('#demo-checkout').addEventListener('click',()=>showToast('Demo only — connect Shopify checkout before accepting orders.'));
document.querySelector('#newsletter-form').addEventListener('submit',event=>{
  event.preventDefault();document.querySelector('#newsletter-message').textContent='Thanks for your interest! Connect an email platform to collect subscriptions.';event.target.reset();
});
document.querySelector('#year').textContent=new Date().getFullYear();
window.addEventListener('pagehide',()=>cancelAnimationFrame(frame));
