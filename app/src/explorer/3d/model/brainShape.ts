/* The brain's shape, shared by the brain in the head and the big brain of the detail view:
   two hemispheres with folds (gyri) and grooves (sulci), the cerebellum with its fine parallel
   folds, and the brainstem that continues down into the spinal cord.
   Brain space: about 1.65 wide (x), 1.2 tall, 1.9 long (z, the front at +z). */
import * as THREE from "three";
import {mergeVertices} from "three/examples/jsm/utils/BufferGeometryUtils.js";
import {makeNoise} from "../geo/noise";
import {tube} from "../geo/shapes";
import type {V3} from "../geo/sdf";

/* where the brain sits in the body */
export const BRAIN_AT = {pos: new THREE.Vector3(0, 9.27, -.06), scale: 1.02};

const sstep = (a: number, b: number, x: number) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

/* one hemisphere (s = -1 the body's right, +1 the left); region(x,y,z) tells which lobe a point is in */
export function hemisphere(s: number, detail: number, depth = 1): THREE.BufferGeometry {
  /* an evenly divided sphere (no rings of points that would show up as stripes in the folds) */
  const ico = new THREE.IcosahedronGeometry(1, detail); ico.deleteAttribute("uv"); ico.deleteAttribute("normal");
  const g = mergeVertices(ico); ico.dispose();
  const N = makeNoise(s < 0 ? 11 : 23), M = makeNoise(5);
  const pos = g.attributes.position, p = new THREE.Vector3();
  const base: number[] = [];
  for (let i = 0; i < pos.count; i++) {
    p.fromBufferAttribute(pos, i);
    const u = p.clone();
    const lat = sstep(-.35, .15, s * u.x);
    let X = .74 * u.x * (.1 + .9 * lat), Y = u.y * (u.y > 0 ? .64 : .46), Z = .9 * u.z;
    /* narrower at the back, a little lower at the front */
    if (u.z < -.4) X *= 1 - .22 * (-u.z - .4);
    if (u.z > .55) Y *= 1 - .12 * (u.z - .55);
    /* the temporal lobe hangs lower at the side */
    const temp = sstep(.2, .7, s * u.x) * sstep(0, -.5, u.y) * sstep(-.55, -.1, u.z) * sstep(.75, .3, u.z);
    Y -= .16 * temp; X += s * .04 * temp;
    /* the two halves nearly touch: a thin groove (the longitudinal fissure) between them. The inner
       half of the sphere is pressed flat into the medial wall, so the gap stays narrow all the way up */
    const m = s * X;
    X = s * (m >= 0 ? .026 + m : .016 + .01 * (1 + Math.max(-1, m / .074)));
    pos.setXYZ(i, X, Y + .05, Z);
    base.push(X, Y + .05, Z);
  }
  g.computeVertexNormals();
  const nor = g.attributes.normal;
  const A = .04 * depth;
  for (let i = 0; i < pos.count; i++) {
    const x = base[i * 3], y = base[i * 3 + 1], z = base[i * 3 + 2];
    /* the medial wall is smooth (it faces the other hemisphere) */
    const outer = sstep(.03, .14, s * x);
    /* thick rounded folds with narrow, deep grooves between them */
    const f = 2.3, w = M(x * 1.1, y * 1.1, z * 1.1) * .5;
    const n = Math.abs(N(x * f + w, y * f * 1.15 + w, z * f - w));
    const groove = 1 - sstep(0, .15, n), crest = sstep(.08, .5, n);
    let d = (-A * 1.05 * groove + A * .5 * crest) * outer;
    /* the deep lateral (Sylvian) groove above the temporal lobe */
    const sy = Math.abs(y - (-.06 + .22 * z)) ;
    if (s * x > .3 && z > -.45 && z < .75) d -= .05 * depth * (1 - sstep(0, .045, sy)) * sstep(.3, .5, s * x);
    pos.setXYZ(i, x + nor.getX(i) * d, y + nor.getY(i) * d, z + nor.getZ(i) * d);
  }
  g.computeVertexNormals();
  return g;
}

/* which lobe a point of the cerebrum belongs to (for the detail view's tints) */
/* the front area ends at a line slanting down and forwards (roughly the central groove) */
export const isFrontal = (_x: number, y: number, z: number) => z > .04 + .42 * (.62 - y);
export const isOccipital = (_x: number, y: number, z: number) => z < -.6 + .12 * y;

export function cerebellum(seg: number, depth = 1): THREE.BufferGeometry {
  const g = new THREE.SphereGeometry(1, seg, Math.round(seg * .75));
  const pos = g.attributes.position, p = new THREE.Vector3();
  const N = makeNoise(7);
  for (let i = 0; i < pos.count; i++) {
    p.fromBufferAttribute(pos, i);
    let X = p.x * .6, Y = p.y * .27, Z = p.z * .36;
    /* two halves with a groove (the vermis) in the middle */
    Y -= .05 * (1 - Math.min(1, Math.abs(p.x) * 2.2)) * (p.y > 0 ? 1 : 0);
    const fol = .5 + .5 * Math.cos((p.y * 15 + p.z * 3 + N(p.x * 2, p.y * 2, p.z * 2) * .6) * Math.PI);
    const r = 1 - .045 * depth * fol;
    X *= r; Y *= r; Z *= r;
    pos.setXYZ(i, X, Y - .48, Z - .55);
  }
  g.computeVertexNormals();
  return g;
}

/* the brainstem, under and behind the cerebrum; the spinal cord goes on from its lower end */
export const STEM: V3[] = [[0, -.12, -.1], [0, -.4, -.12], [0, -.68, -.14], [0, -.94, -.17]];
export function brainstem(): THREE.BufferGeometry {
  return tube(STEM, {r: t => .155 - .095 * Math.pow(t, 1.4) + .03 * Math.exp(-Math.pow((t - .32) / .14, 2)), seg: 40, radial: 24, caps: [true, false]});
}
