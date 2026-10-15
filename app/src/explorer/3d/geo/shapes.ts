/* Tubes and other shapes made straight from curves: vessels, nerves, airways, intestines, ribs,
   the stomach. A tube follows a smooth Catmull-Rom curve and its radius can change along it. */
import * as THREE from "three";
import type {V3} from "./sdf";

export const vec = (p: V3) => new THREE.Vector3(p[0], p[1], p[2]);
export const curve = (pts: V3[], tension = .5) => new THREE.CatmullRomCurve3(pts.map(vec), false, "catmullrom", tension);

export interface TubeOpts {
  /* radius at t (0..1 along the curve), and an optional flattening of the section */
  r: number | ((t: number) => number);
  seg?: number; radial?: number;
  /* round the ends with half spheres (default) or leave them open */
  caps?: boolean | [boolean, boolean];
  /* the section is an ellipse: width factor along the curve's normal and binormal */
  sx?: number; sy?: number;
  /* the side to point the section's normal to (keeps flat tubes facing one way) */
  up?: V3;
}

/* a tube with smooth round ends, its radius changing along the curve */
export function tube(c: THREE.Curve<THREE.Vector3> | V3[], o: TubeOpts): THREE.BufferGeometry {
  const C = Array.isArray(c) ? curve(c) : c;
  const seg = o.seg ?? 64, rad = o.radial ?? 16, R = typeof o.r === "number" ? () => o.r as number : o.r;
  const caps = o.caps === undefined ? [true, true] : typeof o.caps === "boolean" ? [o.caps, o.caps] : o.caps;
  const sx = o.sx ?? 1, sy = o.sy ?? 1;
  /* parallel transport frames: no sudden twists */
  const T: THREE.Vector3[] = [], N: THREE.Vector3[] = [], B: THREE.Vector3[] = [], P: THREE.Vector3[] = [];
  for (let i = 0; i <= seg; i++) { const t = i / seg; P.push(C.getPointAt(t)); T.push(C.getTangentAt(t).normalize()); }
  const up = o.up ? vec(o.up).normalize() : null;
  let n0 = new THREE.Vector3();
  if (up && Math.abs(up.dot(T[0])) < .95) n0.copy(up).sub(T[0].clone().multiplyScalar(up.dot(T[0]))).normalize();
  else {
    const a = Math.abs(T[0].x) < .9 ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 1, 0);
    n0.crossVectors(T[0], a).normalize();
  }
  N.push(n0); B.push(new THREE.Vector3().crossVectors(T[0], n0));
  for (let i = 1; i <= seg; i++) {
    const n = N[i - 1].clone(), ax = new THREE.Vector3().crossVectors(T[i - 1], T[i]);
    if (ax.length() > 1e-6) { ax.normalize(); n.applyAxisAngle(ax, Math.acos(Math.min(1, Math.max(-1, T[i - 1].dot(T[i]))))); }
    N.push(n); B.push(new THREE.Vector3().crossVectors(T[i], n));
  }
  /* the rings: optional cap rings beyond both ends */
  type Ring = {p: THREE.Vector3; n: THREE.Vector3; b: THREE.Vector3; t: THREE.Vector3; r: number; nt: number};
  const rings: Ring[] = [];
  const capN = 6;
  const r0 = R(0), r1 = R(1);
  if (caps[0]) for (let q = capN; q >= 1; q--) {
    const a = q / capN * Math.PI / 2;
    rings.push({p: P[0].clone().addScaledVector(T[0], -Math.sin(a) * r0), n: N[0], b: B[0], t: T[0], r: Math.max(1e-4, Math.cos(a) * r0), nt: -Math.sin(a)});
  }
  for (let i = 0; i <= seg; i++) rings.push({p: P[i], n: N[i], b: B[i], t: T[i], r: R(i / seg), nt: 0});
  if (caps[1]) for (let q = 1; q <= capN; q++) {
    const a = q / capN * Math.PI / 2;
    rings.push({p: P[seg].clone().addScaledVector(T[seg], Math.sin(a) * r1), n: N[seg], b: B[seg], t: T[seg], r: Math.max(1e-4, Math.cos(a) * r1), nt: Math.sin(a)});
  }
  const pos: number[] = [], nor: number[] = [], uv: number[] = [], idx: number[] = [];
  const v = new THREE.Vector3(), nn = new THREE.Vector3();
  rings.forEach((g, i) => {
    for (let j = 0; j <= rad; j++) {
      const a = j / rad * Math.PI * 2, ca = Math.cos(a), sa = Math.sin(a);
      v.copy(g.p).addScaledVector(g.n, ca * g.r * sx).addScaledVector(g.b, sa * g.r * sy);
      nn.set(0, 0, 0).addScaledVector(g.n, ca / sx).addScaledVector(g.b, sa / sy).normalize();
      const k = Math.sqrt(Math.max(0, 1 - g.nt * g.nt));
      nn.multiplyScalar(k).addScaledVector(g.t, g.nt).normalize();
      pos.push(v.x, v.y, v.z); nor.push(nn.x, nn.y, nn.z); uv.push(i / (rings.length - 1), j / rad);
    }
  });
  /* the normal of the body rings should follow radius changes: fix them up from the geometry */
  const W = rad + 1;
  for (let i = 0; i < rings.length - 1; i++) for (let j = 0; j < rad; j++) {
    const a = i * W + j, b = a + W, c = b + 1, d = a + 1;
    idx.push(a, d, b, b, d, c);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  /* radius changes tilt the surface: recompute normals for the body part, keep the seam smooth */
  if (typeof o.r !== "number") smoothNormals(g, W);
  g.computeBoundingSphere();
  return g;
}

/* normals from the faces, with the ring seam (first and last column) shared */
function smoothNormals(g: THREE.BufferGeometry, W: number) {
  g.computeVertexNormals();
  const n = g.attributes.normal as THREE.BufferAttribute, rows = n.count / W;
  for (let i = 0; i < rows; i++) {
    const a = i * W, b = a + W - 1;
    const x = n.getX(a) + n.getX(b), y = n.getY(a) + n.getY(b), z = n.getZ(a) + n.getZ(b), l = Math.hypot(x, y, z) || 1;
    n.setXYZ(a, x / l, y / l, z / l); n.setXYZ(b, x / l, y / l, z / l);
  }
}

/* points along a curve (for flows of particles) */
export const along = (c: THREE.Curve<THREE.Vector3>, n: number) => Array.from({length: n}, (_, i) => c.getPointAt(i / (n - 1)));

/* merge geometries that share a material into one */
export function merge(gs: THREE.BufferGeometry[]): THREE.BufferGeometry {
  const pos: number[] = [], nor: number[] = [], idx: number[] = [];
  let off = 0;
  for (const g of gs) {
    const p = g.attributes.position, n = g.attributes.normal;
    for (let i = 0; i < p.count; i++) { pos.push(p.getX(i), p.getY(i), p.getZ(i)); nor.push(n.getX(i), n.getY(i), n.getZ(i)); }
    if (g.index) for (let i = 0; i < g.index.count; i++) idx.push(g.index.getX(i) + off);
    else for (let i = 0; i < p.count; i++) idx.push(i + off);
    off += p.count;
    g.dispose();
  }
  const m = new THREE.BufferGeometry();
  m.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  m.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3));
  m.setIndex(off > 65535 ? new THREE.Uint32BufferAttribute(idx, 1) : new THREE.Uint16BufferAttribute(idx, 1));
  m.computeBoundingSphere();
  return m;
}

/* bend every vertex of a geometry with a function, then fix the normals */
export function deform(g: THREE.BufferGeometry, f: (p: THREE.Vector3) => void) {
  const pos = g.attributes.position, p = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) { p.fromBufferAttribute(pos, i); f(p); pos.setXYZ(i, p.x, p.y, p.z); }
  g.computeVertexNormals();
  return g;
}

/* a small deterministic random generator */
export function rng(seed: number) {
  let s = seed >>> 0 || 1;
  return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
}

/* split one mesh into parts (sharing its vertices) by what each triangle's centre belongs to */
export function splitBy(g: THREE.BufferGeometry, part: (x: number, y: number, z: number) => string): Record<string, THREE.BufferGeometry> {
  const pos = g.attributes.position, idx = g.index!, lists: Record<string, number[]> = {};
  for (let i = 0; i < idx.count; i += 3) {
    const a = idx.getX(i), b = idx.getX(i + 1), c = idx.getX(i + 2);
    const k = part((pos.getX(a) + pos.getX(b) + pos.getX(c)) / 3, (pos.getY(a) + pos.getY(b) + pos.getY(c)) / 3, (pos.getZ(a) + pos.getZ(b) + pos.getZ(c)) / 3);
    (lists[k] ??= []).push(a, b, c);
  }
  const out: Record<string, THREE.BufferGeometry> = {};
  for (const k in lists) {
    const n = new THREE.BufferGeometry();
    for (const name in g.attributes) n.setAttribute(name, g.attributes[name]);
    n.setIndex(pos.count > 65535 ? new THREE.Uint32BufferAttribute(lists[k], 1) : new THREE.Uint16BufferAttribute(lists[k], 1));
    n.computeBoundingSphere();
    out[k] = n;
  }
  return out;
}
