// O visualizador 3D: câmera, rotação com o mouse, clique nas partes e animação da planificação.
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { PI, fmt, clamp01, ease } from './formato';
import { BUILDERS, palette } from './construtores';
import { SOLIDS } from './solidos';

const V3 = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const reduceMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export class Viewer {
  constructor(host, { pickable = true, onPick = () => {}, interactive = true } = {}) {
    this.host = host; this.pickable = pickable; this.onPick = onPick; this.interactive = interactive;
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    host.appendChild(this.renderer.domElement);
    this.labelLayer = document.createElement('div'); this.labelLayer.className = 'label-layer'; host.appendChild(this.labelLayer);
    this.tag = document.createElement('div'); this.tag.className = 'pick-tag'; this.tag.setAttribute('aria-hidden', 'true'); host.appendChild(this.tag); this.tagPoint = null;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(36, 1, 0.05, 500);
    this.camera.position.set(5, 4, 7);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    Object.assign(this.controls, { enableDamping: true, dampingFactor: .08, enablePan: false, autoRotateSpeed: 1.4, minDistance: 1.5, maxDistance: 60 });
    this.scene.add(new THREE.AmbientLight(0xffffff, .78 * PI));
    const d1 = new THREE.DirectionalLight(0xffffff, .55 * PI); d1.position.set(4, 9, 6); this.scene.add(d1);
    const d2 = new THREE.DirectionalLight(0xffffff, .22 * PI); d2.position.set(-6, 3, -4); this.scene.add(d2);
    this.t = 0; this.solid = null; this.selected = null; this.tweens = {}; this.labelEls = [];
    this.raycaster = new THREE.Raycaster();
    this.netTarget = 0; this.dead = false;
    this.ro = new ResizeObserver(() => this.resize()); this.ro.observe(host);
    const el = this.renderer.domElement;
    el.addEventListener('pointerdown', e => { this.down = [e.clientX, e.clientY]; });
    el.addEventListener('pointerup', e => {
      if (!this.down) return;
      const moved = Math.hypot(e.clientX - this.down[0], e.clientY - this.down[1]); this.down = null;
      if (moved < 6 && this.pickable) this.pick(e);
    });
    this.resize(); this.loop();
  }
  resize() {
    const w = this.host.clientWidth, h = this.host.clientHeight;
    if (!w || !h) return false;
    this.renderer.setSize(w, h, false); this.camera.aspect = w / h; this.camera.updateProjectionMatrix();
    return true;
  }
  // key: 'cubo', 'prisma'... | keepT: mantém o sólido aberto ou fechado como estava
  setSolid(key, params, keepT = false) {
    this.clear();
    this.key = key; this.params = params;
    if (!keepT) { this.t = 0; this.netTarget = 0; delete this.tweens.t; }
    if (SOLIDS[key].noNet) { this.t = 0; this.netTarget = 0; }
    this.solid = BUILDERS[key](palette(), params);
    this.scene.add(this.solid.root);
    this.solid.update(this.t); this.solid.root.updateMatrixWorld(true);
    this.labelEls = this.solid.kit.labels.map(L => {
      const el = document.createElement('div'); el.className = 'area-label';
      el.innerHTML = `<span>${L.title}</span><strong>${fmt(L.value)} cm²</strong>`;
      this.labelLayer.appendChild(el); return { el, L };
    });
    this.selected = null; this.tagPoint = null;
  }
  clear() {
    if (!this.solid) return;
    this.scene.remove(this.solid.root);
    this.solid.root.traverse(o => { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose(); });
    this.solid = null; this.labelLayer.innerHTML = ''; this.labelEls = [];
  }
  box(t) {
    const s = this.solid, keep = this.t;
    s.update(t); s.root.updateMatrixWorld(true);
    const box = new THREE.Box3();
    s.kit.netMeshes.forEach(m => { m.geometry.computeBoundingBox(); box.union(m.geometry.boundingBox.clone().applyMatrix4(m.matrixWorld)); });
    s.update(keep); s.root.updateMatrixWorld(true);
    return box;
  }
  view(t, dir) {
    const box = this.box(t), c = box.getCenter(V3()), rad = box.getSize(V3()).length() / 2;
    const vf = this.camera.fov * PI / 180, hf = 2 * Math.atan(Math.tan(vf / 2) * this.camera.aspect);
    const dist = rad / Math.sin(Math.min(vf, hf) / 2) * 1.04;
    return { pos: c.clone().add(dir.clone().normalize().multiplyScalar(dist)), target: c };
  }
  viewFor(which) {
    const s = this.solid; const flat = which === 'flat' && s.flatDir;
    return this.view(flat ? 1 : 0, flat ? s.flatDir : s.closedDir);
  }
  // vista da câmera para o estado final (aberto ou fechado)
  currentView() { return this.viewFor(this.netTarget === 1 ? 'flat' : 'closed'); }
  destroy() {
    this.dead = true; cancelAnimationFrame(this.raf); this.ro.disconnect();
    this.controls.dispose(); this.clear(); this.renderer.dispose();
    this.renderer.domElement.remove(); this.labelLayer.remove(); this.tag.remove();
  }
  jumpTo(v) { this.camera.position.copy(v.pos); this.controls.target.copy(v.target); this.controls.update(); }
  flyTo(v, ms) {
    const p0 = this.camera.position.clone(), t0 = this.controls.target.clone();
    this.tween('cam', ms, k => { this.camera.position.lerpVectors(p0, v.pos, k); this.controls.target.lerpVectors(t0, v.target, k); });
  }
  setT(t) { this.t = t; if (this.solid) this.solid.update(t); }
  animateT(to, ms, done) { const from = this.t; this.tween('t', ms, k => this.setT(from + (to - from) * k), done); }
  tween(name, ms, fn, done) {
    if (reduceMotion() || ms <= 0) { delete this.tweens[name]; fn(1); if (done) done(); return; }
    this.tweens[name] = { start: performance.now(), ms, fn, done };
  }
  toggle(done) {
    if (!this.solid || !this.solid.flatDir) return null;
    const to = this.netTarget === 1 ? 0 : 1;
    this.netTarget = to;
    this.tagPoint = null;
    this.flyTo(this.viewFor(to ? 'flat' : 'closed'), 1500);
    this.animateT(to, 1700, () => done && done(to === 1));
    return to;
  }
  pick(e) {
    if (!this.solid) return;
    const r = this.renderer.domElement.getBoundingClientRect();
    const ndc = new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    this.raycaster.setFromCamera(ndc, this.camera);
    const shown = o => { for (let x = o; x; x = x.parent) if (!x.visible) return false; return true; };
    const hits = this.raycaster.intersectObject(this.solid.root, true).filter(h => h.object.userData.part && shown(h.object));
    if (!hits.length) { this.select(null); return; }
    const face = hits.find(h => h.object.userData.part.priority === 1);
    const D = face ? face.distance : Infinity, eps = this.solid.kit.lr * 10;
    const small = hits.filter(h => { const p = h.object.userData.part; return p.priority > 1 && (p.internal || h.distance <= D + eps); })
      .sort((a, b) => (b.object.userData.part.priority - a.object.userData.part.priority) || (a.distance - b.distance));
    const best = small[0] || face || hits[0];
    this.tagPoint = best.point.clone();
    this.select(best.object.userData.part);
  }
  select(part) {
    if (this.selected) this.selected.vis.forEach(m => m.material.color.setHex(m.userData.baseColor));
    this.selected = part;
    if (!part) this.tagPoint = null; else this.tag.textContent = part.info.nome;
    if (part) { const c = new THREE.Color(palette().sel); part.vis.forEach(m => m.material.color.copy(c)); }
    this.onPick(part);
  }
  loop() {
    if (this.dead) return;
    this.raf = requestAnimationFrame(() => this.loop());
    if (!this.host.clientWidth) return;
    const now = performance.now();
    for (const name of Object.keys(this.tweens)) {
      const tw = this.tweens[name]; const k = clamp01((now - tw.start) / tw.ms);
      tw.fn(ease(k));
      if (k >= 1) { delete this.tweens[name]; if (tw.done) tw.done(); }
    }
    this.controls.enabled = this.interactive && !this.tweens.cam;
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
    const show = this.t > .985, w = this.host.clientWidth, h = this.host.clientHeight;
    if (this.tagPoint) {
      const q = this.tagPoint.clone().project(this.camera);
      this.tag.style.opacity = 1;
      this.tag.style.transform = `translate(${(q.x * .5 + .5) * w}px, ${(-q.y * .5 + .5) * h}px) translate(-50%, calc(-100% - 12px))`;
    } else this.tag.style.opacity = 0;
    for (const { el, L } of this.labelEls) {
      if (!show) { el.style.opacity = 0; continue; }
      const p = L.local.clone(); L.obj.localToWorld(p); p.project(this.camera);
      el.style.opacity = 1;
      el.style.transform = `translate(${(p.x * .5 + .5) * w}px, ${(-p.y * .5 + .5) * h}px) translate(-50%, -50%)`;
    }
  }
}

