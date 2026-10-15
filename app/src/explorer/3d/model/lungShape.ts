/* The lungs and airways (body space, shared by the body and the lungs' detail view).
   The right lung (body's right, -x) has three lobes, the left two and a notch for the heart.
   The windpipe starts at the throat (larynx) and splits into the two main bronchi. */
import {ellipsoid, sphere, union, subtract, intersect, half, offset, smax, type Prim, type V3} from "../geo/sdf";
import {bodyShape} from "./body";

/* a thin cut that makes a fissure between two lobes */
const fissure = (p: Prim, n: V3, d: number, w = .02, keep?: (x: number, y: number, z: number) => boolean): Prim => {
  const l = Math.hypot(...n), a = n[0] / l, b = n[1] / l, c = n[2] / l, e = d / l;
  return {lo: p.lo, hi: p.hi, f: (x, y, z) => {
    const v = p.f(x, y, z);
    if (keep && !keep(x, y, z)) return v;
    return smax(v, w - Math.abs(a * x + b * y + c * z - e), .025);
  }};
};

export function lungShape(s: number): Prim {
  const body = union([
    ellipsoid([s * .46, 6.5, 0], [.4, .78, .44]),
    [ellipsoid([s * .37, 7.08, -.02], [.24, .3, .25]), .25],
    [ellipsoid([s * .53, 6.12, -.03], [.3, .42, .41]), .3],
    [ellipsoid([s * .37, 6.1, -.12], [.26, .34, .26]), .3],
  ]);
  /* the dome of the diaphragm underneath, the middle of the chest (heart, windpipe) on the inside */
  let L = subtract(body, sphere([s * .38, 4.92 + (s < 0 ? .05 : -.02), .02], .98), .06);
  L = subtract(L, ellipsoid([0, 6.45, .02], [.17, 1.0, .5]), .08);
  if (s > 0) L = subtract(L, ellipsoid([.17, 6.1, .12], [.36, .36, .42]), .1);    /* the notch for the heart, deep enough to see from the front */
  else L = subtract(L, ellipsoid([-.06, 6.12, .22], [.16, .3, .3]), .08);
  /* oblique fissure in both, plus the horizontal one in the right lung (three lobes) */
  L = fissure(L, [0, 1, .95], 6.55);
  if (s < 0) L = fissure(L, [0, 1, 0], 6.58, .02, (_x, y, z) => y + .95 * z > 6.55 + .03);
  /* the lungs fill the chest but stay inside the ribs */
  return intersect(intersect(L, half([-s, 0, 0], -.035), .02), offset(bodyShape(), -.09), .06);
}

/* the windpipe: from the throat down to where it splits (the carina) */
export const TRACHEA: V3[] = [[0, 7.94, .1], [0, 7.6, .1], [0, 7.25, .08], [0, 6.92, .04]];
/* the main bronchi: the right one shorter, wider and steeper (that is why things breathed in by
   mistake usually go to the right lung), the left one longer and flatter, under the aortic arch */
export const BRONCHI: V3[][] = [
  [[0, 6.92, .04], [-.11, 6.78, .02], [-.21, 6.63, 0], [-.3, 6.52, -.02]],
  [[0, 6.92, .04], [.18, 6.84, .02], [.34, 6.72, 0], [.47, 6.57, -.02]],
];
export const BRONCHUS_R = [.047, .038];
export const LARYNX: V3 = [0, 7.9, .12];
/* the throat (pharynx): from where the windpipe and the food pipe start, up and forwards to the
   back of the mouth, where it opens */
export const PHARYNX: V3[] = [[0, 7.95, .05], [0, 7.99, .13], [0, 8.01, .27], [0, 8.02, .42]];

/* a branching tree of airways (for the detail view): from each main bronchus into its lung */
export interface Branch {pts: V3[]; r: number; depth: number}
export function bronchialTree(rnd: () => number, inLung: (s: number, p: V3) => boolean): Branch[] {
  const out: Branch[] = [];
  const norm = (v: V3): V3 => { const n = Math.hypot(...v) || 1; return [v[0] / n, v[1] / n, v[2] / n]; };
  const grow = (s: number, from: V3, dir: V3, len: number, r: number, depth: number) => {
    if (depth > 6 || r < .006) return;
    let d = norm(dir), to: V3 | null = null;
    /* a branch that would leave the lung bends back towards its middle (and gets shorter) */
    for (let tries = 0; tries < 4 && !to; tries++) {
      const c: V3 = [from[0] + d[0] * len, from[1] + d[1] * len, from[2] + d[2] * len];
      if (depth === 1 || inLung(s, c)) { to = c; break; }
      const m: V3 = [s * .47, 6.5, -.02];
      d = norm([d[0] + (m[0] - from[0]) * 1.4 + (rnd() - .5) * .3, d[1] + (m[1] - from[1]) * 1.4 + (rnd() - .5) * .3, d[2] + (m[2] - from[2]) * 1.4 + (rnd() - .5) * .3]);
      len *= .82;
    }
    if (!to) return;
    const mid: V3 = [(from[0] + to[0]) / 2 + (rnd() - .5) * .02, (from[1] + to[1]) / 2 + (rnd() - .5) * .02, (from[2] + to[2]) / 2 + (rnd() - .5) * .02];
    out.push({pts: [from, mid, to], r, depth});
    /* two children, turned away from each other round a random axis */
    const spread = .42 + rnd() * .22, ax = rnd() * Math.PI * 2;
    const px: V3 = Math.abs(d[1]) < .9 ? norm([d[2], 0, -d[0]]) : [1, 0, 0];
    const c: V3 = [d[1] * px[2] - d[2] * px[1], d[2] * px[0] - d[0] * px[2], d[0] * px[1] - d[1] * px[0]];
    const w: V3 = [px[0] * Math.cos(ax) + c[0] * Math.sin(ax), px[1] * Math.cos(ax) + c[1] * Math.sin(ax), px[2] * Math.cos(ax) + c[2] * Math.sin(ax)];
    for (const k of [-1, 1]) {
      const a = spread * (k > 0 ? 1 : .8);
      const nd: V3 = [d[0] * Math.cos(a) + k * w[0] * Math.sin(a), d[1] * Math.cos(a) + k * w[1] * Math.sin(a), d[2] * Math.cos(a) + k * w[2] * Math.sin(a)];
      grow(s, to, nd, len * (.74 + rnd() * .1), r * .76, depth + 1);
    }
  };
  for (const s of [-1, 1]) {
    const b = BRONCHI[s < 0 ? 0 : 1], end = b[b.length - 1];
    /* the lobes' airways: up, to the middle (the right lung's middle lobe), down and down-back */
    const dirs: V3[] = s < 0 ? [[-.3, .95, -.05], [-.8, -.15, .45], [-.4, -.9, -.1], [-.25, -.75, -.6]]
      : [[.35, .92, -.05], [.7, -.3, .4], [.45, -.85, -.15], [.25, -.75, -.6]];
    for (const d of dirs) grow(s, end, d, .24, .026, 1);
  }
  return out;
}
