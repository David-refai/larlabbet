/* Signed distance shapes and a surface-nets mesher. The child's body, hair, shorts, skull, muscles,
   lungs, liver, kidneys and the heart are each described as a smooth blend of simple shapes
   (spheres, ellipsoids, rounded cones) and turned into ONE smooth, watertight mesh here. That keeps
   the see-through skin free of seams and gives soft, toy-like surfaces.
   Distances are negative inside. Points are plain numbers so the inner loops stay fast. */
import * as THREE from "three";

export type V3 = [number, number, number];
export type SDF = (x: number, y: number, z: number) => number;

/* a shape with its bounding box, so far-away shapes are skipped cheaply */
export interface Prim {f: SDF; lo: V3; hi: V3}

/* polynomial smooth minimum: k is the width of the blend */
export function smin(a: number, b: number, k: number) {
  if (k <= 0) return a < b ? a : b;
  const h = Math.max(k - Math.abs(a - b), 0) / k;
  return Math.min(a, b) - h * h * k * .25;
}
export const smax = (a: number, b: number, k: number) => -smin(-a, -b, k);

const len3 = (x: number, y: number, z: number) => Math.sqrt(x * x + y * y + z * z);

export function sphere(c: V3, r: number): Prim {
  return {f: (x, y, z) => len3(x - c[0], y - c[1], z - c[2]) - r, lo: [c[0] - r, c[1] - r, c[2] - r], hi: [c[0] + r, c[1] + r, c[2] + r]};
}

/* an ellipsoid with radii r, turned by Euler angles rot (radians, XYZ order) */
export function ellipsoid(c: V3, r: V3, rot?: V3): Prim {
  let m: number[] | null = null;
  if (rot && (rot[0] || rot[1] || rot[2])) {
    const q = new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(rot[0], rot[1], rot[2])).invert().elements;
    m = [q[0], q[1], q[2], q[4], q[5], q[6], q[8], q[9], q[10]];
  }
  const [rx, ry, rz] = r, R = Math.max(rx, ry, rz);
  return {
    f: (x, y, z) => {
      let px = x - c[0], py = y - c[1], pz = z - c[2];
      if (m) { const a = m[0] * px + m[3] * py + m[6] * pz, b = m[1] * px + m[4] * py + m[7] * pz, d = m[2] * px + m[5] * py + m[8] * pz; px = a; py = b; pz = d; }
      const k0 = len3(px / rx, py / ry, pz / rz), k1 = len3(px / (rx * rx), py / (ry * ry), pz / (rz * rz));
      return k1 < 1e-9 ? -Math.min(rx, ry, rz) : k0 * (k0 - 1) / k1;
    },
    lo: [c[0] - R, c[1] - R, c[2] - R], hi: [c[0] + R, c[1] + R, c[2] + R],
  };
}

/* a rounded cone between a (radius ra) and b (radius rb): limbs, fingers, bones */
export function cone(a: V3, b: V3, ra: number, rb: number): Prim {
  const bax = b[0] - a[0], bay = b[1] - a[1], baz = b[2] - a[2];
  const l2 = bax * bax + bay * bay + baz * baz, rr = ra - rb, a2 = l2 - rr * rr, il2 = 1 / l2;
  const R = Math.max(ra, rb);
  return {
    f: (x, y, z) => {
      const pax = x - a[0], pay = y - a[1], paz = z - a[2];
      const yy = pax * bax + pay * bay + paz * baz, zz = yy - l2;
      const qx = pax * l2 - bax * yy, qy = pay * l2 - bay * yy, qz = paz * l2 - baz * yy;
      const x2 = qx * qx + qy * qy + qz * qz, y2 = yy * yy * l2, z2 = zz * zz * l2;
      const k = Math.sign(rr) * rr * rr * x2;
      if (Math.sign(zz) * a2 * z2 > k) return Math.sqrt(x2 + z2) * il2 - rb;
      if (Math.sign(yy) * a2 * y2 < k) return Math.sqrt(x2 + y2) * il2 - ra;
      return (Math.sqrt(x2 * a2 * il2) + yy * rr) * il2 - ra;
    },
    lo: [Math.min(a[0], b[0]) - R, Math.min(a[1], b[1]) - R, Math.min(a[2], b[2]) - R],
    hi: [Math.max(a[0], b[0]) + R, Math.max(a[1], b[1]) + R, Math.max(a[2], b[2]) + R],
  };
}

/* a chain of rounded cones through points with radii: a bendy tube for blending into a shape */
export function chain(pts: V3[], rs: number[], k = 0): Prim {
  const parts = pts.slice(1).map((p, i) => cone(pts[i], p, rs[i], rs[i + 1]));
  return union(parts, k);
}

/* smooth union of shapes; each shape may carry its own blend width */
export function union(ps: (Prim | [Prim, number])[], kDefault = 0): Prim {
  const list = ps.map(p => Array.isArray(p) ? {p: p[0], k: p[1]} : {p, k: kDefault});
  const lo: V3 = [Infinity, Infinity, Infinity], hi: V3 = [-Infinity, -Infinity, -Infinity];
  for (const {p} of list) for (let i = 0; i < 3; i++) { lo[i] = Math.min(lo[i], p.lo[i]); hi[i] = Math.max(hi[i], p.hi[i]); }
  const n = list.length, fs = list.map(l => l.p.f), ks = list.map(l => l.k);
  const los = list.map(l => l.p.lo), his = list.map(l => l.p.hi);
  return {
    f: (x, y, z) => {
      let d = Infinity;
      for (let i = 0; i < n; i++) {
        const lo = los[i], hi = his[i], k = ks[i];
        /* a lower bound of the distance to this shape: skip it when it cannot change the result */
        const dx = Math.max(lo[0] - x, 0, x - hi[0]), dy = Math.max(lo[1] - y, 0, y - hi[1]), dz = Math.max(lo[2] - z, 0, z - hi[2]);
        if ((dx || dy || dz) && len3(dx, dy, dz) > d + k) continue;
        const v = fs[i](x, y, z);
        d = i === 0 || d === Infinity ? v : smin(d, v, k);
      }
      return d;
    },
    lo, hi,
  };
}

/* a in shape, minus b (smooth) */
export const subtract = (a: Prim, b: Prim, k = 0): Prim => ({f: (x, y, z) => smax(a.f(x, y, z), -b.f(x, y, z), k), lo: a.lo, hi: a.hi});
export const intersect = (a: Prim, b: Prim, k = 0): Prim => ({f: (x, y, z) => smax(a.f(x, y, z), b.f(x, y, z), k), lo: a.lo, hi: a.hi});
/* grow (r > 0) or shrink a shape */
export const offset = (a: Prim, r: number | ((x: number, y: number, z: number) => number)): Prim => typeof r === "number"
  ? {f: (x, y, z) => a.f(x, y, z) - r, lo: a.lo.map(v => v - Math.max(r, 0)) as V3, hi: a.hi.map(v => v + Math.max(r, 0)) as V3}
  : {f: (x, y, z) => a.f(x, y, z) - r(x, y, z), lo: a.lo.map(v => v - .2) as V3, hi: a.hi.map(v => v + .2) as V3};
/* the half space n·p < d (n need not be unit length) */
export function half(n: V3, d: number): Prim {
  const l = len3(n[0], n[1], n[2]), a = n[0] / l, b = n[1] / l, c = n[2] / l, e = d / l;
  return {f: (x, y, z) => a * x + b * y + c * z - e, lo: [-1e3, -1e3, -1e3], hi: [1e3, 1e3, 1e3]};
}
export const mirrorX = (p: Prim): Prim => ({f: (x, y, z) => p.f(Math.abs(x), y, z), lo: [-Math.max(Math.abs(p.lo[0]), Math.abs(p.hi[0])), p.lo[1], p.lo[2]], hi: [Math.max(Math.abs(p.lo[0]), Math.abs(p.hi[0])), p.hi[1], p.hi[2]]});
export const both = (f: (s: number) => Prim): Prim[] => [f(-1), f(1)];

export interface MeshOpts {
  /* cell size */
  h: number;
  /* grid bounds; the shape's own box (plus a margin) by default */
  lo?: V3; hi?: V3;
  /* a colour for every vertex */
  color?: (x: number, y: number, z: number, nx: number, ny: number, nz: number) => [number, number, number];
  /* Newton steps that pull each vertex onto the surface */
  refine?: number;
}

/* Surface nets: one vertex per grid cell that the surface passes through, pulled onto the surface,
   normals from the distance gradient (so the shading is smooth). Only cells near the surface are
   evaluated: a coarse pass finds them first. */
export function mesh(shape: Prim, o: MeshOpts): THREE.BufferGeometry {
  const h = o.h, f = shape.f, pad = 2 * h;
  const lo = o.lo ?? [shape.lo[0] - pad, shape.lo[1] - pad, shape.lo[2] - pad] as V3;
  const hi = o.hi ?? [shape.hi[0] + pad, shape.hi[1] + pad, shape.hi[2] + pad] as V3;
  const C = 4;
  const nx = Math.ceil((hi[0] - lo[0]) / h / C) * C + 1, ny = Math.ceil((hi[1] - lo[1]) / h / C) * C + 1, nz = Math.ceil((hi[2] - lo[2]) / h / C) * C + 1;
  const sx = 1, sy = nx, sz = nx * ny;
  const val = new Float32Array(nx * ny * nz).fill(NaN);
  const at = (i: number, j: number, k: number) => {
    const ix = i + j * sy + k * sz;
    let v = val[ix];
    if (v !== v) { v = f(lo[0] + i * h, lo[1] + j * h, lo[2] + k * h); val[ix] = v; }
    return v;
  };
  /* coarse cells that may hold the surface */
  const cx = (nx - 1) / C, cy = (ny - 1) / C, cz = (nz - 1) / C, diag = C * h * Math.sqrt(3) * 1.35;
  const cells: number[] = [];
  for (let k = 0; k < cz; k++) for (let j = 0; j < cy; j++) for (let i = 0; i < cx; i++) {
    /* the centre value bounds the whole coarse cell */
    const d = f(lo[0] + (i + .5) * C * h, lo[1] + (j + .5) * C * h, lo[2] + (k + .5) * C * h);
    if (Math.abs(d) <= diag * .5 + h) cells.push(i, j, k);
  }
  const vid = new Int32Array((nx - 1) * (ny - 1) * nz).fill(-1);
  const cid = (i: number, j: number, k: number) => i + j * (nx - 1) + k * (nx - 1) * (ny - 1);
  const pos: number[] = [], nor: number[] = [], col: number[] = [];
  const e = h * .2;
  const grad = (x: number, y: number, z: number) => {
    /* tetrahedral gradient: four samples */
    const a = f(x + e, y - e, z - e), b = f(x - e, y - e, z + e), c = f(x - e, y + e, z - e), d = f(x + e, y + e, z + e);
    return [a - b - c + d, -a - b + c + d, -a + b - c + d];
  };
  const corner = [0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1];
  const edges = [0, 1, 2, 3, 4, 5, 6, 7, 0, 2, 1, 3, 4, 6, 5, 7, 0, 4, 1, 5, 2, 6, 3, 7];
  const cv = new Float64Array(8);
  const refine = o.refine ?? 2;
  const list: number[] = [];
  for (let c = 0; c < cells.length; c += 3) {
    const bi = cells[c] * C, bj = cells[c + 1] * C, bk = cells[c + 2] * C;
    for (let k = bk; k < bk + C; k++) for (let j = bj; j < bj + C; j++) for (let i = bi; i < bi + C; i++) {
      let neg = 0;
      for (let q = 0; q < 8; q++) { const v = at(i + corner[q * 3], j + corner[q * 3 + 1], k + corner[q * 3 + 2]); cv[q] = v; if (v < 0) neg++; }
      if (neg === 0 || neg === 8) continue;
      /* the mean of the points where the edges cross the surface */
      let px = 0, py = 0, pz = 0, n = 0;
      for (let q = 0; q < 24; q += 2) {
        const a = edges[q], b = edges[q + 1], va = cv[a], vb = cv[b];
        if ((va < 0) === (vb < 0)) continue;
        const t = va / (va - vb);
        px += corner[a * 3] + (corner[b * 3] - corner[a * 3]) * t;
        py += corner[a * 3 + 1] + (corner[b * 3 + 1] - corner[a * 3 + 1]) * t;
        pz += corner[a * 3 + 2] + (corner[b * 3 + 2] - corner[a * 3 + 2]) * t;
        n++;
      }
      let x = lo[0] + (i + px / n) * h, y = lo[1] + (j + py / n) * h, z = lo[2] + (k + pz / n) * h;
      const x0 = x, y0 = y, z0 = z;
      let g = grad(x, y, z);
      for (let r = 0; r < refine; r++) {
        /* Newton step along the gradient (g is 4e times the gradient) */
        const d = f(x, y, z), gl = (g[0] * g[0] + g[1] * g[1] + g[2] * g[2]) / (16 * e * e);
        if (gl < 1e-8) break;
        const s = d / gl / (4 * e);
        x -= s * g[0]; y -= s * g[1]; z -= s * g[2];
        /* never leave the neighbourhood of the cell */
        const dx = x - x0, dy = y - y0, dz = z - z0, m = len3(dx, dy, dz);
        if (m > h * .9) { x = x0 + dx / m * h * .9; y = y0 + dy / m * h * .9; z = z0 + dz / m * h * .9; }
        g = grad(x, y, z);
      }
      const gl = Math.sqrt(g[0] * g[0] + g[1] * g[1] + g[2] * g[2]) || 1;
      const nx_ = g[0] / gl, ny_ = g[1] / gl, nz_ = g[2] / gl;
      vid[cid(i, j, k)] = pos.length / 3;
      pos.push(x, y, z); nor.push(nx_, ny_, nz_);
      if (o.color) col.push(...o.color(x, y, z, nx_, ny_, nz_));
      list.push(i, j, k);
    }
  }
  /* faces: every grid edge with a sign change joins the four cells around it */
  const idx: number[] = [];
  const quad = (a: number, b: number, c: number, d: number, flip: boolean) => {
    if (a < 0 || b < 0 || c < 0 || d < 0) return;
    if (flip) { const t = b; b = d; d = t; }
    /* split along the shorter diagonal */
    const d1 = len3(pos[a * 3] - pos[c * 3], pos[a * 3 + 1] - pos[c * 3 + 1], pos[a * 3 + 2] - pos[c * 3 + 2]);
    const d2 = len3(pos[b * 3] - pos[d * 3], pos[b * 3 + 1] - pos[d * 3 + 1], pos[b * 3 + 2] - pos[d * 3 + 2]);
    if (d1 <= d2) idx.push(a, b, c, a, c, d); else idx.push(a, b, d, b, c, d);
  };
  for (let q = 0; q < list.length; q += 3) {
    const i = list[q], j = list[q + 1], k = list[q + 2];
    const v0 = at(i, j, k), inside = v0 < 0;
    if (j > 0 && k > 0 && (at(i + 1, j, k) < 0) !== inside)
      quad(vid[cid(i, j, k)], vid[cid(i, j - 1, k)], vid[cid(i, j - 1, k - 1)], vid[cid(i, j, k - 1)], !inside);
    if (i > 0 && k > 0 && (at(i, j + 1, k) < 0) !== inside)
      quad(vid[cid(i, j, k)], vid[cid(i, j, k - 1)], vid[cid(i - 1, j, k - 1)], vid[cid(i - 1, j, k)], !inside);
    if (i > 0 && j > 0 && (at(i, j, k + 1) < 0) !== inside)
      quad(vid[cid(i, j, k)], vid[cid(i - 1, j, k)], vid[cid(i - 1, j - 1, k)], vid[cid(i, j - 1, k)], !inside);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3));
  if (o.color) g.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
  g.setIndex(pos.length / 3 > 65535 ? new THREE.Uint32BufferAttribute(idx, 1) : new THREE.Uint16BufferAttribute(idx, 1));
  g.computeBoundingBox(); g.computeBoundingSphere();
  return g;
}

/* where the surface is, seen from p looking along dir from outside (p is usually inside the shape):
   for placing eyes, mouth and such on a face */
export function surfaceAlong(shape: Prim, p: V3, dir: V3, max = 3): V3 {
  const l = len3(dir[0], dir[1], dir[2]), d = [dir[0] / l, dir[1] / l, dir[2] / l];
  /* march in from outside, back towards p */
  let t = max;
  for (let i = 0; i < 300 && t > 0; i++) {
    const v = shape.f(p[0] + d[0] * t, p[1] + d[1] * t, p[2] + d[2] * t);
    if (v < 1e-4) break;
    t -= Math.max(v * .7, 1e-4);
  }
  return [p[0] + d[0] * t, p[1] + d[1] * t, p[2] + d[2] * t];
}
