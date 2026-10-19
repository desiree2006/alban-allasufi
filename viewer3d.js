import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const S = 0.04, H = 3.2, FH = 3.4, T = 0.12;
const px = x => (x - 250) * S, pz = y => (y - 265) * S;

/* DATI: stanze [nome,x1,y1,x2,y2,scale?] e aperture [x,y,larghezza,tipo] (pixel delle piante) */
const floors = [
{ dy: 0,
  rooms: [
    ['Cucina',95,35,300,100], ['Sala da pranzo',95,100,300,185], ['Sala colloqui',300,35,405,185],
    ['Soggiorno',95,185,250,465], ['',250,185,300,465], ['Scale',300,215,360,310,1],
    ['',300,185,405,215], ['',360,215,405,310],
    ['Bagno 1',300,310,405,380], ['Magazzino',300,380,405,465]],
  doors: [
    [195,100,160],[300,95,28],[300,170,28],[172,185,100],[275,185,40],[250,240,70],[300,262,56],
    [300,350,28],[330,380,28],[300,420,28],
    [95,150,45],[95,365,45],[150,35,40,'w'],[335,35,40,'w'],[405,345,36,'w'],[170,465,40,'w'],[320,465,40,'w']],
  items(h) { const {B,bed,chair,table,sofa,counter,plant,tread,sink,wc} = h;
    counter(105,38,290,58); B(225,40,260,56,.04,0x222222,.9);
    counter(120,78,250,92);
    plant(132,104,1); plant(247,104,1);
    table(140,125,250,160);
    for (let i = 0; i < 5; i++) { chair(150 + i*22,118,'n'); chair(150 + i*22,167,'s'); }
    table(335,55,365,150);
    for (let i = 0; i < 6; i++) { chair(325,63 + i*16,'w'); chair(375,63 + i*16,'e'); }
    chair(350,45,'n'); chair(350,165,'s');
    B(95,198,150,214,.3,0x5b3a29); [105,118,131,144].forEach(x => plant(x,206));
    table(190,235,215,260,.4,0x444444);
    sofa(165,225,185,275,'w'); sofa(190,205,240,222,'n'); sofa(225,232,245,252,'e'); sofa(225,262,245,282,'e'); sofa(190,270,215,288,'s');
    B(150,315,250,328,.9,0x6b4a32);
    bed(127,368,212,450,'w',0x9a9a9a);
    tread(228,372,252,452); tread(262,372,286,452);
    counter(335,318,385,332); sink(345,320,358,330); wc(325,350,340,365); B(370,350,400,378,.05,0xdddddd);
    B(385,315,402,335,.85,0xf0f0f0);
  }},
{ dy: -25,
  rooms: [
    ['Camera doppia 3',100,65,180,225], ['Camera singola 2',180,65,250,170], ['',180,170,250,225],
    ['Camera doppia 4',250,65,405,160], ['Bagno 2',300,160,405,225], ['',250,160,300,380],
    ['Scale',300,240,360,330,1], ['Camera doppia 1',100,340,195,495], ['Camera singola 1',195,380,270,495],
    ['',195,340,250,380], ['Bagno 3',300,340,400,380], ['Camera doppia 2',270,380,400,495]],
  doors: [
    [180,200,28],[215,170,28],[250,195,40],[280,160,28],[300,200,28],[300,285,56],
    [195,360,28],[225,380,28],[250,360,40],[300,355,28],[285,380,28],
    [140,65,60,'w'],[215,65,50,'w'],[405,110,40,'d'],[405,195,20,'w'],[150,495,50,'w'],[235,495,40,'w'],
    [405,440,40,'d'],[335,495,40,'w'],[100,420,50,'w'],[400,358,16,'w']],
  items(h) { const {B,bed,plant,ward,sink,wc,terrace} = h;
    ward(103,67,178,82); bed(105,100,170,128,'w'); bed(105,138,170,166,'w'); bed(105,176,170,204,'w');
    ward(185,67,248,79); bed(188,100,232,160,'n');
    ward(253,70,265,155); bed(300,75,372,128,'e');
    sink(330,165,360,178); wc(375,195,390,210); B(305,195,330,222,.05,0xdddddd);
    ward(105,345,190,360); bed(105,395,170,425,'w'); bed(105,435,170,465,'w');
    ward(198,385,210,475); bed(222,395,260,470,'n');
    ward(385,385,398,445); bed(282,425,345,485,'w');
    sink(305,345,335,358); wc(345,360,358,372);
    terrace(35,15,270,65); terrace(30,330,100,500); terrace(30,500,270,545); terrace(405,60,445,175); terrace(405,380,445,495);
    [[50,28],[75,28],[255,28],[50,345],[75,345],[50,520],[75,520],[255,520],[420,140],[425,455],[55,420]].forEach(p => plant(p[0],p[1]));
  }}
];

/* SCENA */
const $ = id => document.getElementById(id);
const stage = $('v3d-stage');
const canvas = $('v3d-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0eee8);
const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 300);
scene.add(new THREE.HemisphereLight(0xffffff, 0x99a0aa, 1.3));
const sun = new THREE.DirectionalLight(0xfff3e0, 1.6);
sun.position.set(12, 24, 10); sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
Object.assign(sun.shadow.camera, { left: -16, right: 16, top: 16, bottom: -16, near: 1, far: 70 });
scene.add(sun);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true; controls.maxPolarAngle = Math.PI / 2.02;

const ground = new THREE.Mesh(new THREE.PlaneGeometry(120, 120), new THREE.MeshStandardMaterial({ color: 0xe8e5de, roughness: 1 }));
ground.rotation.x = -Math.PI / 2; ground.position.y = -0.12; ground.receiveShadow = true; scene.add(ground);

const U = new THREE.BoxGeometry(1, 1, 1).translate(0, .5, 0);
const SG = new THREE.SphereGeometry(1, 14, 10);
const mats = new Map();
const mm = c => { if (!mats.has(c)) mats.set(c, new THREE.MeshStandardMaterial({ color: c, roughness: .85 })); return mats.get(c); };
const wallMat = mm(0xfafafa);
const glassMat = new THREE.MeshStandardMaterial({ color: 0x9ec9e8, transparent: true, opacity: .35, roughness: .1 });
const mesh = (g, x, y, z, sx, sy, sz, mat, cast = true) => {
  const m = new THREE.Mesh(U, mat); m.position.set(x, y, z); m.scale.set(sx, sy, sz);
  m.castShadow = cast; m.receiveShadow = true; g.add(m); return m;
};

function label(text) {
  const c = document.createElement('canvas'); c.width = 256; c.height = 64;
  const g = c.getContext('2d'); g.font = 'bold 26px Arial, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.lineWidth = 6; g.strokeStyle = '#fff'; g.strokeText(text, 128, 32); g.fillStyle = '#222'; g.fillText(text, 128, 32);
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), depthTest: false }));
  sp.scale.set(3.2, .8, 1); sp.renderOrder = 10; return sp;
}
const flatCol = n => /Bagno/.test(n) ? 0xcfe9ee : /singola/.test(n) ? 0xe3f0dc : /Camera/.test(n) ? 0xf6e0e0 : /Scale/.test(n) ? 0xc9c9c9 : /Cucina|Sala|Soggiorno/.test(n) ? 0xf3e6c8 : 0xdddddd;
const realCol = n => /Bagno/.test(n) ? 0xdfe7ea : /Cucina/.test(n) ? 0xe6dccb : /Scale/.test(n) ? 0xcfcfcf : /Camera|Sala|Soggiorno/.test(n) ? 0xb98d5f : 0xd6cfc2;

/* COSTRUZIONE DEI PIANI */
const groups = floors.map(F => {
  const g = new THREE.Group();
  g.walls = new THREE.Group(); g.furn = new THREE.Group(); g.ceil = new THREE.Group(); g.labels = new THREE.Group(); g.slabs = [];
  g.add(g.walls, g.furn, g.ceil, g.labels);
  const dy = F.dy;

  const piece = (horiz, L, a, b, y0, y1, mat) => {
    if (b - a <= 0 || y1 <= y0) return;
    const len = (b - a) * S, mid = (a + b) / 2;
    const [x, z, sx, sz] = horiz ? [px(mid), pz(L + dy), len, T] : [px(L), pz(mid + dy), T, len];
    mesh(g.walls, x, y0, z, sx, y1 - y0, sz, mat, mat !== glassMat);
  };
  const seg = (ax, ay, bx, by) => {
    const horiz = ay === by, L = horiz ? ay : ax, lo = horiz ? Math.min(ax, bx) : Math.min(ay, by), hi = horiz ? Math.max(ax, bx) : Math.max(ay, by);
    const ops = F.doors.filter(o => horiz ? Math.abs(o[1] - L) < 2 && o[0] > lo && o[0] < hi : Math.abs(o[0] - L) < 2 && o[1] > lo && o[1] < hi)
      .sort((p, q) => (horiz ? p[0] - q[0] : p[1] - q[1]));
    let cur = lo;
    ops.forEach(o => {
      const c = horiz ? o[0] : o[1], s = Math.max(lo, c - o[2] / 2), e = Math.min(hi, c + o[2] / 2);
      piece(horiz, L, cur, s, 0, H, wallMat);
      piece(horiz, L, s, e, 2.1, H, wallMat);
      if (o[3] === 'w') { piece(horiz, L, s, e, 0, .9, wallMat); piece(horiz, L, s, e, .9, 2.1, glassMat); }
      cur = e;
    });
    piece(horiz, L, cur, hi, 0, H, wallMat);
  };

  F.rooms.forEach(([name, x1, y1, x2, y2, stairs]) => {
    seg(x1, y1, x2, y1); seg(x1, y2, x2, y2); seg(x1, y1, x1, y2); seg(x2, y1, x2, y2);
    const w = (x2 - x1) * S, d = (y2 - y1) * S, cx = px((x1 + x2) / 2), cz = pz((y1 + y2) / 2 + dy);
    const slab = mesh(g, cx, -.1, cz, w, .1, d, new THREE.MeshStandardMaterial({ roughness: .9 }), false);
    slab.userData = { f: flatCol(name), r: realCol(name) }; g.slabs.push(slab);
    mesh(g.ceil, cx, H, cz, w, .1, d, mm(0xe4e0d8));
    if (stairs) for (let k = 0; k < 14; k++) {
      const hh = (k + 1) * H / 14;
      mesh(g.furn, cx, 0, cz - d / 2 + (k + .5) * d / 14, w - .3, hh, d / 14, mm(0xb4b4b4));
    }
    if (name) { const l = label(name); l.position.set(cx, 1.6, cz); g.labels.add(l); }
  });

  /* arredi (coordinate in pixel) */
  const B = (x1, y1, x2, y2, hgt, col, y0 = 0) => mesh(g.furn, px((x1 + x2) / 2), y0, pz((y1 + y2) / 2 + dy), (x2 - x1) * S, hgt, (y2 - y1) * S, mm(col));
  const sd = (x1, y1, x2, y2, s, t) => ({ n: [x1, y1, x2, y1 + t], s: [x1, y2 - t, x2, y2], w: [x1, y1, x1 + t, y2], e: [x2 - t, y1, x2, y2] })[s];
  const ball = (cx, cy, y, r, col) => { const m = new THREE.Mesh(SG, mm(col)); m.position.set(px(cx), y, pz(cy + dy)); m.scale.setScalar(r); m.castShadow = true; g.furn.add(m); };
  F.items({
    B,
    bed(x1, y1, x2, y2, hd, col = 0xf2f2f2) { B(x1, y1, x2, y2, .35, 0x8b6b4a); B(x1 + 1, y1 + 1, x2 - 1, y2 - 1, .55, col); B(...sd(x1 + 2, y1 + 2, x2 - 2, y2 - 2, hd, 6), .18, 0xdde6f0, .55); },
    chair(cx, cy, d) { B(cx - 3, cy - 3, cx + 3, cy + 3, .42, 0x5a4636); B(cx - 5, cy - 5, cx + 5, cy + 5, .08, 0x7a5a3a, .42); const k = { n: [-5, -6, 5, -4], s: [-5, 4, 5, 6], w: [-6, -5, -4, 5], e: [4, -5, 6, 5] }[d]; B(cx + k[0], cy + k[1], cx + k[2], cy + k[3], .45, 0x7a5a3a, .5); },
    table(x1, y1, x2, y2, hh = .75, col = 0x8a6a48) { B(x1, y1, x2, y2, .05, col, hh - .05); [[x1, y1], [x2 - 2, y1], [x1, y2 - 2], [x2 - 2, y2 - 2]].forEach(p => B(p[0], p[1], p[0] + 2, p[1] + 2, hh - .05, 0x4a3a2a)); },
    sofa(x1, y1, x2, y2, back) { B(x1, y1, x2, y2, .42, 0x6d7f8f); B(...sd(x1, y1, x2, y2, back, 4), .9, 0x5b6c7b); },
    ward(x1, y1, x2, y2) { B(x1, y1, x2, y2, 2.3, 0xcdb79a); },
    counter(x1, y1, x2, y2) { B(x1, y1, x2, y2, .88, 0xe9e9e9); B(x1, y1, x2, y2, .04, 0x555555, .88); },
    sink(x1, y1, x2, y2) { B(x1, y1, x2, y2, .85, 0xf4f4f4); B(x1 + 3, y1 + 2, x2 - 3, y2 - 2, .03, 0xb9d3e0, .86); },
    wc(x1, y1, x2, y2) { B(x1, y1, x2, y2, .4, 0xffffff); B(x1, y1 - 3, x2, y1 + 2, .85, 0xffffff); },
    tread(x1, y1, x2, y2) { B(x1, y1, x2, y2, .2, 0x2b2b2b); B(x1 + 2, y1 + 8, x2 - 2, y2 - 1, .06, 0x555555, .2); B(x1 + 3, y1, x2 - 3, y1 + 3, 1.15, 0x333333); },
    plant(cx, cy, big) { B(cx - 3, cy - 3, cx + 3, cy + 3, .3, 0xa0522d); const r = big ? .45 : .3; ball(cx, cy, .3 + r * .8, r, 0x3f8f3f);
      [[2, 1, 0xe63946], [-2, 2, 0xf4d35e], [1, -2, 0xff8fab]].forEach(o => ball(cx + o[0] * 1.5, cy + o[1] * 1.5, .3 + r * 1.5, .09, o[2])); },
    terrace(x1, y1, x2, y2) { B(x1, y1, x2, y2, .1, 0xb9b3a8, -.1); const c = 0xcfd4d8;
      B(x1, y1, x2, y1 + 1.5, 1, c); B(x1, y2 - 1.5, x2, y2, 1, c); B(x1, y1, x1 + 1.5, y2, 1, c); B(x2 - 1.5, y1, x2, y2, 1, c); }
  });
  scene.add(g);
  return g;
});

/* INTERFACCIA */
let mode = 'plan', vis = 'both', roofOn = true;

function layout() {
  groups[0].position.y = 0;
  groups[1].position.y = FH + +$('v3d-gap').value;
}
function apply() {
  const plan = mode === 'plan';
  groups.forEach((g, i) => {
    g.visible = vis === 'both' || vis === String(i);
    g.walls.scale.y = plan ? +$('v3d-wh').value / H : 1;
    g.labels.visible = plan;
    g.ceil.visible = !plan && roofOn;
    g.slabs.forEach(s => s.material.color.setHex(plan ? s.userData.f : s.userData.r));
  });
  ground.material.color.setHex(plan ? 0xe8e5de : 0x7fa05a);
  scene.background.setHex(plan ? 0xf0eee8 : 0xbcd8ee);
  $('v3d-whL').style.display = plan ? '' : 'none';
  $('v3d-roof').style.display = plan ? 'none' : '';
  layout();
}
function view() {
  const k = camera.aspect < 1 ? 1.5 : 1;   // su schermi stretti la camera si allontana
  controls.target.set(0, mode === 'plan' ? 2 : 3, 0);
  if (mode === 'plan') camera.position.set(0, 17 * k, 15 * k); else camera.position.set(15 * k, 10 * k, 17 * k);
}

$('v3d-modes').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  $('v3d-modes').querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b));
  mode = b.dataset.m;
  $('v3d-gap').value = mode === 'plan' ? 5 : 0;
  view(); apply();
});
$('v3d-floors').addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  $('v3d-floors').querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b));
  vis = b.dataset.v; apply();
});
$('v3d-gap').addEventListener('input', layout);
$('v3d-wh').addEventListener('input', apply);
$('v3d-roof').addEventListener('click', () => { roofOn = !roofOn; $('v3d-roof').classList.toggle('on', roofOn); apply(); });

/* il canvas segue le dimensioni del riquadro */
function resize() {
  const w = stage.clientWidth, h = stage.clientHeight;
  if (!w || !h) return;
  renderer.setSize(w, h, false);
  camera.aspect = w / h; camera.updateProjectionMatrix();
}
new ResizeObserver(resize).observe(stage);
resize();

renderer.setAnimationLoop(() => { controls.update(); renderer.render(scene, camera); });

view(); apply();
