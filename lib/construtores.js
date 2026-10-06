// Monta a geometria 3D de cada sólido, montado e planificado.
import * as THREE from 'three';
import { PI, fmt, clamp01, POLY } from './formato';

const V3 = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const cssVar = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();

export function palette() {
  return { ink: cssVar('--ink') || '#2B1F4D', base: cssVar('--base-c') || '#D3C1F8', lat: cssVar('--face-c') || '#9D80EB',
           sel: cssVar('--sel') || '#F2668B', meas: cssVar('--meas') || '#109C86' };
}

/* ---------- peças de construção ---------- */
function polyGeo(pts) {
  const arr = [];
  for (let i = 1; i < pts.length - 1; i++) [pts[0], pts[i], pts[i + 1]].forEach(p => arr.push(p.x, p.y, p.z));
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(arr, 3));
  g.computeVertexNormals();
  return g;
}
function centroid(pts) { const c = V3(); pts.forEach(p => c.add(p)); return c.multiplyScalar(1 / pts.length); }
function cyl(a, b, r, mat) {
  const d = b.clone().sub(a); const len = d.length();
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, 10, 1), mat);
  m.position.copy(a).add(b).multiplyScalar(.5);
  m.quaternion.setFromUnitVectors(V3(0, 1, 0), d.normalize());
  return m;
}

function makeKit(pal, size) {
  const lr = Math.max(0.016, size * 0.0075);
  const hitMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false });
  const kit = { lr, hitMat, parts: [], netMeshes: [], labels: [], extras: new THREE.Group() };
  kit.faceMat = (color, op = .86) => new THREE.MeshStandardMaterial({
    color, side: THREE.DoubleSide, transparent: true, opacity: op, roughness: .9, metalness: 0,
    polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 });
  kit.outline = geo => new THREE.LineSegments(new THREE.EdgesGeometry(geo, 1), new THREE.LineBasicMaterial({ color: pal.ink }));
  kit.part = (hits, vis, info, priority = 1, internal = false) => {
    const p = { info, vis, priority, internal };
    vis.forEach(m => { m.userData.baseColor = m.material.color.getHex(); });
    hits.forEach(m => { m.userData.part = p; });
    kit.parts.push(p); return p;
  };
  kit.tube = (a, b, color, info, internal = false) => {
    const vis = cyl(a, b, lr, new THREE.MeshBasicMaterial({ color }));
    const hit = cyl(a, b, lr * 4.5, hitMat);
    kit.extras.add(vis, hit); kit.part([hit, vis], [vis], info, 2, internal); return vis;
  };
  kit.dot = (p, color, info, internal = false) => {
    const vis = new THREE.Mesh(new THREE.SphereGeometry(lr * 2.6, 16, 12), new THREE.MeshBasicMaterial({ color }));
    const hit = new THREE.Mesh(new THREE.SphereGeometry(lr * 7, 10, 8), hitMat);
    vis.position.copy(p); hit.position.copy(p);
    kit.extras.add(vis, hit); kit.part([hit, vis], [vis], info, 3, internal); return vis;
  };
  kit.label = (obj, local, title, value) => kit.labels.push({ obj, local, title, value });
  return kit;
}

/* ---------- poliedros (cubo, prisma, pirâmide) ---------- */
function buildPoly(pal, p, mode) {
  const isCube = mode === 'cubo', isPrism = mode !== 'piramide';
  const n = isCube ? 4 : p.n, l = isCube ? p.a : p.l, h = isCube ? p.a : p.h;
  const kit = makeKit(pal, Math.max(l * 2, h));
  const R = l / (2 * Math.sin(PI / n)), m = l / (2 * Math.tan(PI / n));
  const off = PI / 2 - PI / n;
  const base = [...Array(n)].map((_, i) => { const a = off + 2 * PI * i / n; return V3(R * Math.cos(a), 0, R * Math.sin(a)); });
  const Ab = n * l * m / 2, gp = Math.hypot(h, m), poly = POLY[n];
  const root = new THREE.Group(); const nodes = [];

  function addFace(parentInner, pts, hinge, fold, color, info) {
    const pivot = new THREE.Group(), inner = new THREE.Group();
    if (hinge) { pivot.position.copy(hinge[0]); inner.position.copy(hinge[0]).negate(); }
    pivot.add(inner); parentInner.add(pivot);
    const geo = polyGeo(pts);
    const mesh = new THREE.Mesh(geo, kit.faceMat(color));
    inner.add(mesh, kit.outline(geo));
    kit.netMeshes.push(mesh); kit.part([mesh], [mesh], info, 1);
    const c = centroid(pts);
    if (hinge) {
      const axis = hinge[1].clone().sub(hinge[0]).normalize();
      const mid = hinge[0].clone().add(hinge[1]).multiplyScalar(.5);
      const d = c.clone().sub(mid);
      if (axis.z * d.x - axis.x * d.z < 0) axis.negate();
      nodes.push({ pivot, axis, fold });
    }
    return { inner, c };
  }

  const cubeFace = { nome: 'Face', desc: `Um quadrado de lado ${fmt(l)} cm. O cubo tem 6 faces iguais, então qualquer uma delas pode servir de base.`, area: l * l };
  const baseNode = addFace(root, base, null, 0, pal.base, isCube ? cubeFace : {
    nome: isPrism ? 'Base inferior' : 'Base',
    desc: isPrism ? `Um ${poly} regular de lado ${fmt(l)} cm. As duas bases do prisma são iguais e paralelas.`
                  : `Um ${poly} regular de lado ${fmt(l)} cm. A pirâmide tem uma base só.`,
    area: Ab });
  kit.label(baseNode.inner, baseNode.c, isCube ? 'Face' : 'Base', Ab);

  let front = null;
  for (let i = 0; i < n; i++) {
    const a = base[i], b = base[(i + 1) % n];
    const mid = a.clone().add(b).multiplyScalar(.5), o = mid.clone().normalize();
    let pts, fold, info, area;
    if (isPrism) {
      pts = [a, b, b.clone().addScaledVector(o, h), a.clone().addScaledVector(o, h)];
      fold = PI / 2; area = l * h;
      info = isCube ? cubeFace : { nome: 'Face lateral', desc: `Um retângulo de ${fmt(l)} cm por ${fmt(h)} cm. O prisma tem ${n} faces laterais iguais.`, area };
    } else {
      pts = [a, b, mid.clone().addScaledVector(o, gp)];
      fold = PI - Math.atan2(h, m); area = l * gp / 2;
      info = { nome: 'Face lateral', desc: `Um triângulo isósceles de base ${fmt(l)} cm e altura ${fmt(gp)} cm (essa altura é o apótema da pirâmide). São ${n} faces laterais iguais.`, area };
    }
    const node = addFace(baseNode.inner, pts, [a, b], fold, isCube ? pal.lat : pal.lat, info);
    if (i === 0) {
      front = { node, o, a, b };
      kit.label(node.inner, node.c, isCube ? 'Face, cada' : isPrism ? 'Retângulo, cada' : 'Triângulo, cada', area);
    }
  }
  if (isPrism) {
    const { o, a, b } = front;
    const top = base.map(q => q.clone().addScaledVector(o, h + 2 * (m - q.dot(o))));
    const tn = addFace(front.node.inner, top, [a.clone().addScaledVector(o, h), b.clone().addScaledVector(o, h)], PI / 2, pal.base,
      isCube ? cubeFace : { nome: 'Base superior', desc: `Um ${poly} regular de lado ${fmt(l)} cm, igual à base de baixo e paralelo a ela.`, area: Ab });
    kit.label(tn.inner, tn.c, isCube ? 'Face' : 'Base', Ab);
  }

  // partes que só aparecem com o sólido montado
  const ink = pal.ink, meas = pal.meas;
  const eBase = isCube ? { nome: 'Aresta', desc: `Segmento onde duas faces se encontram. O cubo tem 12 arestas, todas medindo ${fmt(l)} cm.` }
    : isPrism ? { nome: 'Aresta da base', desc: `Lado do ${poly} da base: ${fmt(l)} cm. O prisma tem ${2 * n} arestas da base, ${n} em cada base.` }
    : { nome: 'Aresta da base', desc: `Lado do ${poly} da base: ${fmt(l)} cm. São ${n} arestas da base.` };
  base.forEach((q, i) => kit.tube(q, base[(i + 1) % n], ink, eBase));
  if (isPrism) {
    const top = base.map(q => V3(q.x, h, q.z));
    const eLat = isCube ? eBase : { nome: 'Aresta lateral', desc: `Liga as duas bases. No prisma reto ela mede o mesmo que a altura: ${fmt(h)} cm. São ${n} arestas laterais.` };
    const vInfo = isCube ? { nome: 'Vértice', desc: 'Ponto onde três arestas se encontram. O cubo tem 8 vértices.' }
                         : { nome: 'Vértice', desc: `Ponto onde três arestas se encontram. O prisma tem ${2 * n} vértices.` };
    top.forEach((q, i) => { kit.tube(q, top[(i + 1) % n], ink, eBase); kit.tube(base[i], q, ink, eLat); });
    [...base, ...top].forEach(q => kit.dot(q, ink, vInfo));
    if (isCube) kit.tube(base[0], top[2], meas, { nome: 'Diagonal do cubo', desc: `Liga dois vértices opostos passando por dentro do cubo. Mede a√3 = ${fmt(l * Math.sqrt(3))} cm.` }, true);
  } else {
    const apex = V3(0, h, 0);
    base.forEach(q => kit.tube(q, apex, ink, { nome: 'Aresta lateral', desc: `Liga um vértice da base ao vértice da pirâmide. Mede ${fmt(Math.hypot(h, R))} cm. São ${n} arestas laterais.` }));
    base.forEach(q => kit.dot(q, ink, { nome: 'Vértice da base', desc: `Ponto onde duas arestas da base e uma aresta lateral se encontram. São ${n}.` }));
    kit.dot(apex, ink, { nome: 'Vértice da pirâmide', desc: 'O ponto mais alto, onde todas as faces laterais se encontram. Fica bem acima do centro da base.' });
    kit.tube(V3(), apex, meas, { nome: 'Altura', desc: `Distância do vértice até a base: ${fmt(h)} cm. Na pirâmide reta, ela cai exatamente no centro da base.` }, true);
    kit.tube(V3(), V3(0, 0, m), meas, { nome: 'Apótema da base', desc: `Vai do centro da base até o meio de um lado: m = ${fmt(m)} cm.` }, true);
    kit.tube(V3(0, 0, m), apex, meas, { nome: 'Apótema da pirâmide', desc: `É a altura de uma face lateral, do meio da aresta da base até o vértice: g = √(h² + m²) = ${fmt(gp)} cm.` });
  }
  root.add(kit.extras);
  const update = t => { nodes.forEach(nd => nd.pivot.quaternion.setFromAxisAngle(nd.axis, nd.fold * (1 - t))); kit.extras.visible = t < 0.01; };
  return { root, update, kit, flatDir: V3(0, 1, 0.45), closedDir: V3(1.2, 0.95, 1.7) };
}

/* ---------- cilindro ---------- */
function buildCylinder(pal, p) {
  const r = p.r, h = p.h, N = 96;
  const kit = makeKit(pal, Math.max(2 * r, h));
  const root = new THREE.Group();
  const pos = new Float32Array((N + 1) * 6);
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const idx = []; for (let j = 0; j < N; j++) { const a = j, b = j + 1, c = N + 1 + j, d = N + 2 + j; idx.push(a, b, d, a, d, c); }
  geo.setIndex(idx);
  const lat = new THREE.Mesh(geo, kit.faceMat(pal.lat)); root.add(lat); kit.netMeshes.push(lat);
  kit.part([lat], [lat], { nome: 'Superfície lateral', desc: `A parte curva do cilindro. Aberta, ela vira um retângulo: a largura é o comprimento da circunferência da base (2πr = ${fmt(2 * PI * r)} cm) e a altura é ${fmt(h)} cm.`, area: 2 * PI * r * h });
  const opos = new Float32Array((2 * N + 2) * 6);
  const ogeo = new THREE.BufferGeometry(); ogeo.setAttribute('position', new THREE.BufferAttribute(opos, 3));
  root.add(new THREE.LineSegments(ogeo, new THREE.LineBasicMaterial({ color: pal.ink })));
  const P = (u, y, k) => k < 1e-5 ? [u, y, r] : [Math.sin(k * u) / k, y, r - 1 / k + Math.cos(k * u) / k];
  function setLat(k) {
    const bot = [], top = [];
    for (let j = 0; j <= N; j++) {
      const u = -PI * r + 2 * PI * r * j / N;
      const pb = P(u, 0, k), pt = P(u, h, k); bot.push(pb); top.push(pt);
      pos.set(pb, j * 3); pos.set(pt, (N + 1 + j) * 3);
    }
    geo.attributes.position.needsUpdate = true; geo.computeVertexNormals(); geo.computeBoundingSphere(); geo.computeBoundingBox();
    let q = 0; const push = (a, b) => { opos.set(a, q); opos.set(b, q + 3); q += 6; };
    for (let j = 0; j < N; j++) { push(bot[j], bot[j + 1]); push(top[j], top[j + 1]); }
    push(bot[0], top[0]); push(bot[N], top[N]);
    ogeo.attributes.position.needsUpdate = true; ogeo.computeBoundingSphere();
  }
  const baseInfo = { nome: 'Base', desc: `Um círculo de raio ${fmt(r)} cm. O cilindro tem duas bases iguais e paralelas.`, area: PI * r * r };
  const mkDisk = y => {
    const g = new THREE.CircleGeometry(r, 72); g.rotateX(-PI / 2);
    const piv = new THREE.Group(); piv.position.set(0, y, r);
    const mesh = new THREE.Mesh(g, kit.faceMat(pal.base)); mesh.position.set(0, 0, -r);
    const ol = kit.outline(g); ol.position.copy(mesh.position);
    piv.add(mesh, ol); root.add(piv); kit.netMeshes.push(mesh); kit.part([mesh], [mesh], baseInfo, 1);
    kit.label(mesh, V3(), 'Base', PI * r * r);
    return piv;
  };
  const pivB = mkDisk(0), pivT = mkDisk(h);
  kit.label(root, V3(0, h / 2, r), 'Retângulo', 2 * PI * r * h);
  const meas = pal.meas, ink = pal.ink;
  kit.tube(V3(), V3(0, h, 0), meas, { nome: 'Altura (eixo)', desc: `Liga os centros das duas bases: ${fmt(h)} cm. No cilindro reto, o eixo é perpendicular às bases.` }, true);
  kit.tube(V3(0, h + 0.002, 0), V3(-r * .7071, h + 0.002, -r * .7071), meas, { nome: 'Raio da base', desc: `Vai do centro até a borda da base: ${fmt(r)} cm.` }, true);
  const ga = PI / 4, gx = r * 1.004 * Math.sin(ga), gz = r * 1.004 * Math.cos(ga);
  kit.tube(V3(gx, 0, gz), V3(gx, h, gz), ink, { nome: 'Geratriz', desc: `Segmento da superfície lateral paralelo ao eixo. No cilindro reto, mede o mesmo que a altura: ${fmt(h)} cm.` });
  const cInfo = { nome: 'Centro da base', desc: 'O ponto do meio do círculo da base. O eixo do cilindro passa por ele.' };
  kit.dot(V3(), meas, cInfo, true); kit.dot(V3(0, h, 0), meas, cInfo, true);
  root.add(kit.extras);
  const update = t => {
    const d = clamp01(t / 0.35), s = clamp01((t - 0.35) / 0.65);
    pivB.rotation.x = -PI / 2 * d; pivT.rotation.x = PI / 2 * d;
    setLat((1 / r) * (1 - s)); kit.extras.visible = t < 0.01;
  };
  return { root, update, kit, flatDir: V3(0, 0.18, 1), closedDir: V3(1.2, 0.8, 1.7) };
}

/* ---------- cone ---------- */
function buildCone(pal, p) {
  const r = p.r, h = p.h, g = Math.hypot(r, h), N = 96;
  const kit = makeKit(pal, Math.max(2 * r, h));
  const root = new THREE.Group(), body = new THREE.Group(); root.add(body);
  const pos = new Float32Array((N + 1) * 6);
  const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const idx = []; for (let j = 0; j < N; j++) { const a = j, b = j + 1, c = N + 1 + j, d = N + 2 + j; idx.push(a, c, d, a, d, b); }
  geo.setIndex(idx);
  const lat = new THREE.Mesh(geo, kit.faceMat(pal.lat)); body.add(lat); kit.netMeshes.push(lat);
  kit.part([lat], [lat], { nome: 'Superfície lateral', desc: `A parte curva do cone. Aberta, ela vira um setor circular: o raio do setor é a geratriz (${fmt(g)} cm) e o arco mede 2πr = ${fmt(2 * PI * r)} cm.`, area: PI * r * g });
  const opos = new Float32Array((N + 2) * 6);
  const ogeo = new THREE.BufferGeometry(); ogeo.setAttribute('position', new THREE.BufferAttribute(opos, 3));
  body.add(new THREE.LineSegments(ogeo, new THREE.LineBasicMaterial({ color: pal.ink })));
  const apex = [0, h, 0];
  function setLat(rho) {
    const H = Math.sqrt(Math.max(g * g - rho * rho, 0)); const rim = [];
    for (let j = 0; j <= N; j++) {
      const a = -PI * r + 2 * PI * r * j / N, phi = a / rho;
      const q = [rho * Math.sin(phi), h - H, rho * Math.cos(phi)]; rim.push(q);
      pos.set(apex, j * 3); pos.set(q, (N + 1 + j) * 3);
    }
    geo.attributes.position.needsUpdate = true; geo.computeVertexNormals(); geo.computeBoundingSphere(); geo.computeBoundingBox();
    let q = 0; const push = (a, b) => { opos.set(a, q); opos.set(b, q + 3); q += 6; };
    for (let j = 0; j < N; j++) push(rim[j], rim[j + 1]);
    push(apex, rim[0]); push(apex, rim[N]);
    ogeo.attributes.position.needsUpdate = true; ogeo.computeBoundingSphere();
    return H;
  }
  const dg = new THREE.CircleGeometry(r, 72); dg.rotateX(-PI / 2);
  const piv = new THREE.Group(); body.add(piv);
  const disk = new THREE.Mesh(dg, kit.faceMat(pal.base)); disk.position.set(0, 0, -r);
  const dol = kit.outline(dg); dol.position.copy(disk.position); piv.add(disk, dol);
  kit.netMeshes.push(disk);
  kit.part([disk], [disk], { nome: 'Base', desc: `Um círculo de raio ${fmt(r)} cm. O cone tem uma base só.`, area: PI * r * r });
  kit.label(disk, V3(), 'Base', PI * r * r);
  kit.label(body, V3(0, h, 0.58 * g), 'Setor circular', PI * r * g);
  const meas = pal.meas, ink = pal.ink, A = V3(0, h, 0);
  kit.dot(A, ink, { nome: 'Vértice', desc: 'O ponto no topo do cone, onde todas as geratrizes se encontram.' });
  kit.tube(V3(), A, meas, { nome: 'Altura', desc: `Do vértice até o centro da base: ${fmt(h)} cm. Altura, raio e geratriz formam um triângulo retângulo.` }, true);
  kit.tube(V3(), V3(-r * .7071, 0, -r * .7071), meas, { nome: 'Raio da base', desc: `Vai do centro até a borda da base: ${fmt(r)} cm.` }, true);
  kit.tube(A, V3(r * 1.01 * Math.sin(PI / 4), 0, r * 1.01 * Math.cos(PI / 4)), ink, { nome: 'Geratriz', desc: `Liga o vértice a um ponto da borda da base. Pelo teorema de Pitágoras, g = √(r² + h²) = ${fmt(g)} cm.` });
  kit.dot(V3(), meas, { nome: 'Centro da base', desc: 'O ponto do meio da base. A altura do cone reto cai exatamente nele.' }, true);
  root.add(kit.extras);
  const update = t => {
    const d = clamp01(t / 0.3), s = clamp01((t - 0.3) / 0.7);
    const rho = r + (g - r) * s; const H = setLat(rho);
    piv.position.set(0, h - H, rho);
    piv.rotation.x = -PI / 2 * d - PI / 2 * s;
    body.position.y = -h * s; kit.extras.visible = t < 0.01;
  };
  return { root, update, kit, flatDir: V3(0, 1, 0.5), closedDir: V3(1.2, 0.8, 1.7) };
}

/* ---------- esfera ---------- */
function buildSphere(pal, p) {
  const r = p.r; const kit = makeKit(pal, 2 * r); const root = new THREE.Group();
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(r, 64, 40), kit.faceMat(pal.lat, .6));
  root.add(mesh); kit.netMeshes.push(mesh);
  kit.part([mesh], [mesh], { nome: 'Superfície esférica', desc: `Todos os pontos que estão a exatamente ${fmt(r)} cm do centro. Ela não pode ser planificada.`, area: 4 * PI * r * r });
  const tg = new THREE.TorusGeometry(r, kit.lr, 8, 160); tg.rotateX(PI / 2);
  const th = new THREE.TorusGeometry(r, kit.lr * 4.5, 6, 100); th.rotateX(PI / 2);
  const eq = new THREE.Mesh(tg, new THREE.MeshBasicMaterial({ color: pal.ink }));
  const eqHit = new THREE.Mesh(th, kit.hitMat);
  kit.extras.add(eq, eqHit);
  kit.part([eqHit, eq], [eq], { nome: 'Círculo máximo', desc: `O maior círculo que cabe na esfera, porque passa pelo centro. Ele divide a esfera em dois hemisférios e tem raio ${fmt(r)} cm.`, area: PI * r * r }, 2);
  kit.dot(V3(), pal.meas, { nome: 'Centro', desc: 'O ponto que fica à mesma distância de todos os pontos da superfície.' }, true);
  const dir = V3(.62, .5, .6).normalize().multiplyScalar(r);
  kit.tube(V3(), dir, pal.meas, { nome: 'Raio', desc: `Liga o centro a qualquer ponto da superfície: ${fmt(r)} cm.` }, true);
  root.add(kit.extras);
  return { root, update: () => {}, kit, flatDir: null, closedDir: V3(1.2, 0.7, 1.7) };
}


export const BUILDERS = {
  cubo: (pal, p) => buildPoly(pal, p, 'cubo'),
  prisma: (pal, p) => buildPoly(pal, p, 'prisma'),
  piramide: (pal, p) => buildPoly(pal, p, 'piramide'),
  cilindro: buildCylinder,
  cone: buildCone,
  esfera: buildSphere,
};
