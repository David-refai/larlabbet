/* The skeleton: a friendly skull with a jaw and teeth, the spine (7 + 12 + 5 vertebrae, the sacrum
   and tailbone), 12 pairs of ribs with their cartilage, the breastbone, collar bones, shoulder
   blades, the pelvis, and the bones of the arms, hands, legs and feet. Everything sits inside the
   body of body.ts; the ribs, breastbone and shoulder blades follow the trunk's surface.
   The spinal canal of every vertebra lines up with the spinal cord of the nerve layer. */
import * as THREE from "three";
import {ellipsoid, sphere, cone, union, subtract, intersect, half, offset, mesh, surfaceAlong, type Prim, type V3} from "../geo/sdf";
import {tube, curve, merge} from "../geo/shapes";
import {once} from "../geo/cache";
import {COLORS, organ, bone as boneMat} from "../materials";
import {torsoShape, LM} from "./body";
import {BRAIN_AT, STEM} from "./brainShape";

const S = [-1, 1] as const;
const add = (a: V3, b: V3, k = 1): V3 => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k];

/* a long bone: a tube that is thicker at both ends (the knobbly joints) */
function longBone(pts: V3[], r: number, k0 = .65, k1 = .65, seg = 28, radial = 12) {
  return tube(pts, {r: t => r * (1 + k0 * Math.exp(-Math.pow(t / .1, 2)) + k1 * Math.exp(-Math.pow((1 - t) / .1, 2))), seg, radial});
}
const ball = (c: V3, r: number, sc: V3 = [1, 1, 1]) => {
  const g = new THREE.SphereGeometry(r, 18, 12); g.scale(...sc); g.translate(...c); return g;
};

/* pull a point inside a shape (with a margin) along the shape's gradient */
export function pushIn(sh: Prim, p: V3, m: number): V3 {
  let [x, y, z] = p;
  const e = .004;
  for (let i = 0; i < 10; i++) {
    const d = sh.f(x, y, z) + m;
    if (d <= 0) break;
    const gx = sh.f(x + e, y, z) - sh.f(x - e, y, z), gy = sh.f(x, y + e, z) - sh.f(x, y - e, z), gz = sh.f(x, y, z + e) - sh.f(x, y, z - e);
    const gl = Math.hypot(gx, gy, gz) || 1;
    x -= gx / gl * d * 1.05; y -= gy / gl * d * 1.05; z -= gz / gl * d * 1.05;
  }
  return [x, y, z];
}

/* ---------------- the spine ---------------- */
/* the line through the vertebral bodies, from the top of the neck to the sacrum */
export const SPINE: V3[] = [[0, 8.12, -.13], [0, 7.75, -.18], [0, 7.3, -.24], [0, 6.8, -.32], [0, 6.25, -.35], [0, 5.7, -.33], [0, 5.2, -.27], [0, 4.82, -.27]];
export interface VFrame {p: THREE.Vector3; up: THREE.Vector3; front: THREE.Vector3; side: THREE.Vector3; scale: number; region: "c" | "t" | "l"}
/* the canal (where the spinal cord runs) is this far behind the vertebral body's centre, times the scale */
export const CANAL = .125;

export function spineFrames(): VFrame[] {
  return once("spine:frames", () => {
    const c = curve(SPINE, .5);
    const sc = Array.from({length: 24}, (_, i) => i < 7 ? .74 + .015 * i : i < 19 ? .8 + (i - 7) * .02 : 1.04 + (i - 19) * .03);
    const tot = sc.reduce((a, b) => a + b, 0);
    const out: VFrame[] = [];
    let acc = 0;
    sc.forEach((s, i) => {
      const u = (acc + s / 2) / tot; acc += s;
      const p = c.getPointAt(u), up = c.getTangentAt(u).negate().normalize();
      const front = new THREE.Vector3(0, 0, 1).addScaledVector(up, -up.z).normalize();
      out.push({p, up, front, side: new THREE.Vector3().crossVectors(up, front), scale: s, region: i < 7 ? "c" : i < 19 ? "t" : "l"});
    });
    return out;
  });
}
/* where the canal is at each vertebra (for the spinal cord) */
export const canalPoints = (): V3[] => spineFrames().map(f => f.p.clone().addScaledVector(f.front, -CANAL * f.scale).toArray() as V3);

/* the spinal cord: from the bottom of the brainstem through the canal of every vertebra; it ends
   at the top of the lower back and a bundle of thin nerves goes on down */
export function cordPath(): V3[] {
  const k = BRAIN_AT.scale, b = BRAIN_AT.pos, st = STEM[STEM.length - 1];
  const top: V3 = [b.x + st[0] * k, b.y + st[1] * k, b.z + st[2] * k];
  const c = canalPoints();
  return [top, ...c.slice(0, 21)];
}

/* one vertebra, in its own frame (y along the spine, z to the front) */
function vertebraShape(): Prim {
  const slab = intersect(half([0, 1, 0], .05), half([0, -1, 0], .05), .02);
  const bodyV = intersect(ellipsoid([0, 0, 0], [.105, .09, .085]), slab, .02);
  return union([
    bodyV,
    ...S.map(s => [cone([s * .055, 0, -.05], [s * .08, 0, -.13], .024, .022), .03] as [Prim, number]),
    ...S.map(s => [cone([s * .08, 0, -.13], [0, -.005, -.205], .022, .022), .02] as [Prim, number]),
    [cone([0, -.01, -.2], [0, -.05, -.27], .026, .017), .025],
    ...S.map(s => [cone([s * .075, 0, -.12], [s * .175, .012, -.15], .024, .017), .02] as [Prim, number]),
  ]);
}

function spineGeometry() {
  return once("geo:spine", () => {
    const tmpl = mesh(vertebraShape(), {h: .0085});
    const disc = new THREE.CylinderGeometry(.088, .088, .05, 20, 1);
    const gs: THREE.BufferGeometry[] = [], ds: THREE.BufferGeometry[] = [];
    const frames = spineFrames();
    frames.forEach((f, i) => {
      const m = new THREE.Matrix4().makeBasis(f.side, f.up, f.front).scale(new THREE.Vector3(f.scale, f.scale, f.scale)).setPosition(f.p);
      /* the top one (the atlas) is a ring: no body */
      const g = tmpl.clone().applyMatrix4(m); gs.push(g);
      if (i < frames.length - 1) {
        const n = frames[i + 1], mid = f.p.clone().lerp(n.p, .5), up = n.p.clone().sub(f.p).normalize();
        const front = new THREE.Vector3(0, 0, 1).addScaledVector(up, -up.z).normalize();
        const s = (f.scale + n.scale) / 2;
        ds.push(disc.clone().applyMatrix4(new THREE.Matrix4().makeBasis(new THREE.Vector3().crossVectors(up, front), up, front).scale(new THREE.Vector3(s, s * (n.p.distanceTo(f.p) / .155 / s), s)).setPosition(mid)));
      }
    });
    tmpl.dispose(); disc.dispose();
    return {bones: merge(gs), discs: merge(ds)};
  });
}

/* the sacrum and the tailbone, the hip bones */
function pelvisShape(): Prim {
  const wing = (s: number): Prim => subtract(
    ellipsoid([s * .47, 4.7, -.26], [.29, .24, .055], [.12, -s * .75, s * .12]),
    sphere([s * .38, 4.8, -.02], .2), .05);
  const ring = (s: number): Prim => union([
    sphere([s * .4, 4.41, -.01], .1),
    [cone([s * .47, 4.6, -.24], [s * .41, 4.43, -.03], .08, .08), .06],
    [cone([s * .4, 4.4, .02], [s * .22, 4.15, .24], .055, .05), .04],
    [cone([s * .22, 4.15, .24], [s * .05, 4.07, .3], .05, .055), .04],
    [cone([s * .38, 4.36, -.06], [s * .3, 4.12, -.06], .06, .06), .04],
    [cone([s * .3, 4.12, -.06], [s * .1, 4.04, .22], .055, .045), .04],
    [cone([s * .3, 4.66, -.36], [s * .17, 4.55, -.38], .07, .07), .06],
  ]);
  return union([
    ...S.map(s => [wing(s), .05] as [Prim, number]),
    ...S.map(s => [ring(s), .06] as [Prim, number]),
    [ellipsoid([0, 4.52, -.37], [.2, .24, .075], [-.35, 0, 0]), .06],
    [cone([0, 4.34, -.42], [0, 4.16, -.36], .05, .025), .03],
  ]);
}

/* ---------------- the ribcage ---------------- */
interface RibPath {bone: V3[]; cart?: V3[]}
function ribPaths(s: number): RibPath[] {
  const T = torsoShape(), Toff = offset(T, -.065), frames = spineFrames();
  const RX = [.42, .58, .7, .78, .83, .86, .87, .86, .83, .79, .72, .64];
  const out: RibPath[] = [];
  for (let i = 0; i < 12; i++) {
    /* thoracic vertebra i (frames 7..18): the rib starts at its side */
    const f = frames[7 + i];
    const yb = f.p.y + .02, zb = f.p.z - .02;
    const yf = yb - .26 - .02 * i;
    const rx = RX[i], rz = rx * .7;
    const tMax = i < 7 ? Math.PI * (.74 + .01 * i) : i < 10 ? Math.PI * (.7 - .02 * (i - 7)) : Math.PI * (.48 - .08 * (i - 10));
    const pt = (th: number): V3 => {
      const y = yb + (yf - yb) * (1 - Math.cos(th)) / 2 + .1 * Math.sin(th) * (i < 2 ? .4 : 1);
      /* on an ellipse, but never further out than just under the skin */
      const c: V3 = [0, y, -.04], e: V3 = [s * (.05 + rx * Math.sin(th)), y, -.04 - rz * Math.cos(th)];
      const q = surfaceAlong(Toff, c, [e[0], 0, e[2] + .04], 2.5);
      return Math.hypot(e[0], e[2] + .04) < Math.hypot(q[0], q[2] + .04) ? e : q;
    };
    const bone: V3[] = [];
    bone.push([s * .1, yb, zb - .02]);
    for (let k = 1; k <= 9; k++) bone.push(pt(.25 + (tMax - .25) * k / 9));
    const r: RibPath = {bone};
    /* the cartilage to the breastbone (ribs 1-7) or up to the rib above (8-10) */
    if (i < 10) {
      const e = bone[bone.length - 1];
      const sy = i < 7 ? 7.12 - i * .17 : 5.98 - (i - 7) * .02;
      const end = pushIn(T, [s * (i < 7 ? .1 : .16 + (i - 7) * .1), Math.max(sy, e[1] - (i < 7 ? 0 : .02)) , .7], .1);
      const mid = pushIn(T, [(e[0] + end[0]) / 2, (e[1] + end[1]) / 2 + (i < 7 ? .02 : .06), .7], .1);
      r.cart = [e, mid, end];
    }
    out.push(r);
  }
  return out;
}

/* the breastbone: a flat plate down the middle of the chest */
function sternumShape(): Prim {
  const T = torsoShape();
  const plate: Prim = {f: (x, y, z) => Math.abs(T.f(x, y, z) + .09) - .02, lo: [-.2, 5.8, 0], hi: [.2, 7.3, .8]};
  /* wider at the top (the manubrium), a slim body, the small xiphoid tip */
  const width = (y: number) => y > 6.98 ? .1 + (y - 6.98) * .25 : y > 6.86 ? .06 + (y - 6.86) * .33 : y > 6.12 ? .062 + (6.86 - y) * .02 : Math.max(.01, .075 - (6.12 - y) * .3);
  const region: Prim = {f: (x, y, z) => Math.max(Math.abs(x) - width(y), 5.92 - y, y - 7.18, -z), lo: [-.2, 5.8, 0], hi: [.2, 7.3, .8]};
  return intersect(plate, region, .035);
}

/* distance to a flat triangle in space (for plates such as the shoulder blades) */
function triangle(a: V3, b: V3, c: V3, th: number): Prim {
  const sub = (p: V3, q: V3): V3 => [p[0] - q[0], p[1] - q[1], p[2] - q[2]];
  const dot = (p: V3, q: V3) => p[0] * q[0] + p[1] * q[1] + p[2] * q[2];
  const crs = (p: V3, q: V3): V3 => [p[1] * q[2] - p[2] * q[1], p[2] * q[0] - p[0] * q[2], p[0] * q[1] - p[1] * q[0]];
  const ba = sub(b, a), cb = sub(c, b), ac = sub(a, c), n = crs(ba, ac);
  const seg = (p: V3, o: V3, e: V3) => { const t = Math.max(0, Math.min(1, dot(sub(p, o), e) / dot(e, e))); const d = sub(sub(p, o), [e[0] * t, e[1] * t, e[2] * t]); return dot(d, d); };
  const lo: V3 = [0, 1, 2].map(i => Math.min(a[i], b[i], c[i]) - th) as V3, hi: V3 = [0, 1, 2].map(i => Math.max(a[i], b[i], c[i]) + th) as V3;
  return {lo, hi, f: (x, y, z) => {
    const p: V3 = [x, y, z], pa = sub(p, a), pb = sub(p, b), pc = sub(p, c);
    const out = Math.sign(dot(crs(ba, n), pa)) + Math.sign(dot(crs(cb, n), pb)) + Math.sign(dot(crs(ac, n), pc)) < 2;
    const d2 = out ? Math.min(seg(p, a, ba), seg(p, b, cb), seg(p, c, ac)) : dot(n, pa) * dot(n, pa) / dot(n, n);
    return Math.sqrt(d2) - th;
  }};
}

/* a shoulder blade: a rounded triangle lying on the upper back, its ridge (the spine of the
   scapula) running out to the acromion over the shoulder joint */
function scapulaShape(s: number): Prim {
  const T = torsoShape();
  const on = (x: number, y: number): V3 => { const q = surfaceAlong(offset(T, -.085), [x * .6, y, -.1], [x * .4, 0, -1], 2); return q; };
  const A = on(s * .3, 7.12), B = on(s * .8, 7.16), C = on(s * .4, 6.32);
  /* the shallow cup of the shoulder joint (the glenoid) at the outer corner, facing the arm bone */
  const G = HUMERUS_HEAD(s), cup: V3 = [G[0] - s * .14, G[1] - .02, G[2] - .03];
  const r1 = on(s * .3, 6.98), r2 = on(s * .78, 7.12);
  return union([
    triangle(A, B, C, .02),
    [union([cone(A, B, .03, .03), cone(B, C, .03, .022), cone(C, A, .022, .03)]), .03],
    [cone([r1[0], r1[1], r1[2] - .02], [r2[0], r2[1] + .02, r2[2] - .03], .022, .035), .03],
    [cone([r2[0], r2[1] + .02, r2[2] - .03], [s * .98, 7.2, -.16], .035, .045), .03],
    [cone(B, cup, .035, .05), .04],
    [subtract(ellipsoid(cup, [.045, .09, .075]), sphere(G, .115), .01), .03],
  ]);
}

/* the ball of the upper arm bone: right under the acromion and the end of the collar bone */
const HUMERUS_HEAD = (s: number): V3 => [s * 1.04, 7.1, -.07];

/* ---------------- the skull ---------------- */
function skullShape(): Prim {
  const cranium = ellipsoid([0, 9.21, -.09], [.99, .86, .97]);
  const faceP = union([
    ellipsoid([0, 8.6, .3], [.7, .46, .56]),
    [ellipsoid([0, 8.32, .36], [.5, .26, .48]), .12],
    ...S.map(s => [ellipsoid([s * .55, 8.48, .48], [.17, .12, .2]), .08] as [Prim, number]),
  ]);
  let sk = union([cranium, [faceP, .2]]);
  /* eye sockets and the nose opening */
  for (const s of S) sk = subtract(sk, ellipsoid([s * .33, 8.74, .9], [.2, .19, .22]), .07);
  sk = subtract(sk, ellipsoid([0, 8.47, .9], [.07, .1, .16], [0, 0, 0]), .03);
  return sk;
}
/* the lower jaw (mandible): a solid bone. Its body runs round under the lower teeth (they sit in
   its upper edge), with a rounded chin in front; at the back it turns up at the angle of the jaw
   into the ramus, which ends at the jaw joint just in front of the ear */
function jawShape(): Prim {
  /* the arch of the lower teeth (see teeth()), from the chin back to the angle */
  const arch = (s: number): V3[] => [[0, 0, .7], [s * .21, 0, .6], [s * .42, 0, .34], [s * .55, 0, .04]];
  const parts: (Prim | [Prim, number])[] = [];
  for (const s of S) {
    const a = arch(s);
    for (let i = 0; i < a.length - 1; i++) {
      /* the upper edge (holding the teeth) and the lower edge, blended into one tall, thin bar */
      parts.push([cone([a[i][0], 8.12, a[i][2]], [a[i + 1][0], 8.1, a[i + 1][2]], .05, .05), .05]);
      parts.push([cone([a[i][0], 7.99, a[i][2] - .01], [a[i + 1][0], 8.0, a[i + 1][2]], .055, .05), .06]);
    }
    /* the ramus, up to the jaw joint (the condyle) in front of the ear, and the joint's knob */
    parts.push([cone([s * .55, 8.04, .04], [s * .61, 8.48, -.1], .07, .05), .06]);
    parts.push([ellipsoid([s * .62, 8.52, -.11], [.06, .045, .07]), .03]);
  }
  /* the chin */
  parts.push([ellipsoid([0, 8.01, .7], [.14, .085, .065]), .08]);
  return union(parts);
}
function jawGeometry() { return mesh(jawShape(), {h: .016}); }
/* two friendly rows of teeth */
function teeth() {
  const gs: THREE.BufferGeometry[] = [];
  for (const [y, r] of [[8.3, .38], [8.18, .34]] as [number, number][]) for (let i = -4; i <= 4; i++) {
    const a = i * .17;
    const g = new THREE.CapsuleGeometry(.038, .05, 4, 10);
    g.scale(1, 1, .7);
    g.rotateY(a);
    g.translate(r * Math.sin(a), y, .52 + r * (Math.cos(a) - 1) * 1.6 + .2);
    gs.push(g);
  }
  return merge(gs);
}

/* ---------------- arms and legs ---------------- */
function armBones(s: number): THREE.BufferGeometry[] {
  const el = LM.elbow(s), wr = LM.wrist(s);
  const gs = [
    ball(HUMERUS_HEAD(s), .11),
    longBone([[s * 1.08, 7.0, -.06], [s * 1.26, 6.4, -.04], [el[0] - s * .01, el[1] + .07, el[2]]], .052, 1.1, .8),
    /* radius (thumb side, in front) and ulna (behind) */
    longBone([[el[0], el[1] - .05, el[2] + .05], [s * 1.52, 5.2, .06], [wr[0] + s * .01, wr[1] + .02, wr[2] + .06]], .033, .6, 1.0),
    longBone([[el[0] + s * .01, el[1] + .02, el[2] - .06], [s * 1.51, 5.2, -.02], [wr[0] - s * .005, wr[1] + .03, wr[2] - .05]], .032, 1.0, .5),
  ];
  /* wrist bones, the palm (metacarpals) and the finger bones */
  for (let k = 0; k < 6; k++) gs.push(ball([s * (1.63 + (k % 2) * .02), 4.52 - Math.floor(k / 2) * .05, .02 + (k % 3) * .06], .036, [.8, 1, 1]));
  for (let f = 0; f < 4; f++) {
    const z = .27 - f * .118, L = [.34, .37, .35, .28][f], x0 = s * 1.725, y0 = 4.12;
    gs.push(longBone([[s * 1.655, 4.42, .04 + f * .04 - .06 * (f > 1 ? 1 : 0)], [x0 - s * .01, y0 + .14, z * .8], [x0, y0 + .02, z]], .018, .7, .9, 12, 8));
    const a: V3 = [x0, y0, z], b: V3 = [x0 + s * .025, y0 - L * .55, z + .015], c: V3 = [x0 - s * .01, y0 - L, z + .035];
    const m1 = add(a, [b[0] - a[0], b[1] - a[1], b[2] - a[2]], .55), m2 = add(b, [c[0] - b[0], c[1] - b[1], c[2] - b[2]], .5);
    gs.push(longBone([add(a, [0, -.03, 0]), add(m1, [0, .015, 0])], .018, .5, .6, 8, 8));
    gs.push(longBone([add(m1, [0, -.015, 0]), add(m2, [0, .015, 0])], .016, .5, .6, 8, 8));
    gs.push(longBone([add(m2, [0, -.015, 0]), add(c, [0, .03, 0])], .015, .5, .3, 8, 8));
  }
  gs.push(longBone([[s * 1.645, 4.47, .1], [s * 1.62, 4.38, .26], [s * 1.6, 4.25, .36]], .02, .7, .8, 12, 8));
  gs.push(longBone([[s * 1.6, 4.24, .37], [s * 1.59, 4.1, .41]], .017, .5, .4, 8, 8));
  return gs;
}

function legBones(s: number): THREE.BufferGeometry[] {
  const kn = LM.knee(s), an = LM.ankle(s);
  const gs = [
    /* thigh bone: the ball in the hip socket, the neck, the long shaft */
    ball([s * .42, 4.41, .0], .085),
    longBone([[s * .43, 4.41, 0], [s * .52, 4.34, -.01], [s * .6, 4.3, -.02]], .05, .3, .6, 12, 10),
    longBone([[s * .58, 4.32, -.01], [s * .55, 3.5, .02], [kn[0], kn[1] + .1, kn[2]]], .068, .55, 1.0),
    ball([s * .5, 2.6, .24], .075, [1, 1.15, .6]),
    /* shin bone and the thin fibula beside it */
    longBone([[kn[0], kn[1] - .03, kn[2]], [s * .51, 1.6, -.01], [an[0] - s * .02, an[1] + .06, an[2]]], .058, 1.0, .65),
    longBone([[s * .63, 2.42, -.06], [s * .64, 1.5, -.08], [s * .65, .52, -.1]], .026, .9, .9),
  ];
  /* ankle and heel, the instep, five long foot bones and the toes */
  gs.push(ball([s * .53, .34, -.08], .1, [.9, .7, 1.1]), ball([s * .53, .17, -.2], .095, [.85, .9, 1.25]), ball([s * .53, .23, .04], .09, [1.15, .65, .9]));
  for (let t = 0; t < 5; t++) {
    const x = s * (.42 + t * .055), z0 = .1, z1 = .48 - t * .045 - (t === 0 ? -.02 : 0), r = t === 0 ? .03 : .022;
    gs.push(longBone([[x + s * .02, .2, z0], [x, .12, z1]], r, .5, .7, 10, 8));
    gs.push(longBone([[x, .1, z1 + .03], [x - s * .005, .07, z1 + (t === 0 ? .12 : .09)]], r * .85, .4, .5, 8, 8));
  }
  return gs;
}

/* ---------------- all together ---------------- */
export function buildSkeleton() {
  const g = new THREE.Group(); g.name = "skeleton";
  const bm = boneMat();
  const cart = organ("#dde9ee", {roughness: .4, clearcoat: .5, sheen: .2});
  const sp = spineGeometry();
  const add3 = (geo: THREE.BufferGeometry, m: THREE.Material, name: string) => { const x = new THREE.Mesh(geo, m); x.name = name; g.add(x); return x; };
  add3(sp.bones, bm, "spine");
  add3(sp.discs, cart, "discs");
  add3(once("geo:pelvis", () => mesh(pelvisShape(), {h: .018})), bm, "pelvis");
  /* ribs: the bony part and the cartilage */
  const ribs = once("geo:ribs", () => {
    const b: THREE.BufferGeometry[] = [], c: THREE.BufferGeometry[] = [];
    for (const s of S) for (const r of ribPaths(s)) {
      b.push(tube(r.bone, {r: t => .026 * (1 + .25 * Math.sin(Math.PI * t)), seg: 40, radial: 10, sx: 1, sy: 1}));
      if (r.cart) c.push(tube(r.cart, {r: .02, seg: 14, radial: 8}));
    }
    return {b: merge(b), c: merge(c)};
  });
  add3(ribs.b, bm, "ribs");
  add3(ribs.c, cart, "costal-cartilage");
  add3(once("geo:sternum", () => mesh(sternumShape(), {h: .014})), bm, "sternum");
  add3(once("geo:scapulae", () => merge(S.map(s => mesh(scapulaShape(s), {h: .016})))), bm, "scapulae");
  /* collar bones: an S from the top of the breastbone out to the shoulder */
  add3(once("geo:clavicles", () => {
    const T = torsoShape();
    return merge(S.map(s => longBone([[s * .12, 7.2, .4], [s * .38, 7.28, .36], [s * .64, 7.3, .2], [s * .86, 7.3, .02], [s * 1.0, 7.26, -.1]]
      .map(p => pushIn(T, p as V3, .07)), .034, .5, .5, 30, 10)));
  }), bm, "clavicles");
  /* the skull: cranium and face, the jaw, the teeth; it goes see-through when the organs are shown */
  const skull = new THREE.Group(); skull.name = "skull"; skull.userData.ownFade = true;
  const sm = boneMat();
  skull.add(new THREE.Mesh(once("geo:skull", () => mesh(skullShape(), {h: .022})), sm));
  skull.add(new THREE.Mesh(once("geo:jaw", jawGeometry), sm));
  skull.add(new THREE.Mesh(once("geo:teeth", teeth), organ("#fffaf0", {roughness: .25, clearcoat: .9})));
  g.add(skull);
  add3(once("geo:limbs", () => merge(S.flatMap(s => [...armBones(s), ...legBones(s)]))), bm, "limbs");
  return g;
}

export const BONE_COLOR = COLORS.bone;
