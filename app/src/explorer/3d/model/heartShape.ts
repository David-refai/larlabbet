/* The heart's shape, shared by the small heart in the body and the big cut-open heart.
   Heart space: the ventricles are about 1.6 across, x to the body's LEFT (the apex), y up,
   z to the front. Seen from the front the RIGHT heart (blue blood) is on the viewer's left.
   The walls are built around the four chambers, so the cut-open model is hollow where the
   chambers are; the left ventricle's wall is the thickest. The right and the left cavities never
   touch: a solid wall (the septum) always lies between them (tests/heart-check.js checks this). */
import * as THREE from "three";
import {cone, ellipsoid, union, subtract, offset, type Prim, type V3} from "../geo/sdf";
import {curve} from "../geo/shapes";

/* the cut of the Kammare view: everything in front of this plane (z > CUT) is taken away */
export const CUT = -.08;

/* the chambers' centres (for the checks and the labels) */
export const CH_AT = {ra: [-.68, .36, -.08] as V3, rv: [-.34, -.36, .07] as V3, la: [.44, .58, -.16] as V3, lv: [.4, -.42, -.12] as V3};
/* the four chambers: the right ventricle in front and to the right, the left ventricle behind it
   towards the apex, the left atrium the furthest back */
export const CH = {
  ra: ellipsoid(CH_AT.ra, [.27, .33, .29]),
  la: ellipsoid(CH_AT.la, [.3, .21, .26]),
  rv: ellipsoid(CH_AT.rv, [.29, .5, .27], [0, 0, .42]),
  lv: ellipsoid(CH_AT.lv, [.23, .56, .25], [0, 0, .5]),
};
/* the openings between them (where the valves sit) and out to the big arteries */
export const VALVE = {
  tri: {at: [-.53, .05, -.02] as V3, dir: [.42, -.6, .07] as V3, r: .15},
  mit: {at: [.4, .3, -.14] as V3, dir: [-.03, -1, .08] as V3, r: .14},
  pulm: {at: [.06, .56, .26] as V3, dir: [.3, .9, .04] as V3, r: .11},
  aort: {at: [-.1, .5, -.06] as V3, dir: [-.32, .94, .02] as V3, r: .11},
};
/* the passages: right atrium to right ventricle, left atrium to left ventricle, and the two
   outflows (the right ventricle's in front, up to the pulmonary trunk; the left ventricle's
   behind it, up and to the right to the aorta, beside the left atrium, never through it) */
export const CHANNEL = {
  tri: cone([-.64, .24, -.06], [-.44, -.1, .02], .15, .14),
  mit: cone([.42, .52, -.16], [.38, .02, -.12], .14, .13),
  pulm: cone([-.24, -.04, .18], [.06, .56, .26], .11, .11),
  aort: cone([.2, -.14, -.1], [-.1, .5, -.06], .11, .11),
};
export const rightCavities = (): Prim => union([CH.ra, CH.rv, CHANNEL.tri, CHANNEL.pulm], .04);
export const leftCavities = (): Prim => union([CH.la, CH.lv, CHANNEL.mit, CHANNEL.aort], .04);
/* no blend between the two sides, so the wall between them keeps its full thickness */
export const cavities = (): Prim => union([rightCavities(), leftCavities()], 0);

/* the outside: walls round the chambers (left ventricle thicker), the ear-like auricles, the two
   outflows (they stop below the valves, so the vessels leave the wall cleanly) */
export function exterior(): Prim {
  return union([
    union([offset(CH.lv, .2), [offset(CH.rv, .09), .16],
      [ellipsoid([.06, -.34, -.02], [.58, .6, .38], [0, 0, .5]), .14]]),
    [union([offset(CH.ra, .08), [offset(CH.la, .08), .12]]), .07],
    [ellipsoid([-.46, .68, .22], [.22, .13, .16], [.3, .2, -.4]), .07],
    [ellipsoid([.7, .56, .1], [.2, .11, .15], [.2, -.3, .5]), .07],
    [cone([-.24, -.04, .18], [-.01, .4, .25], .19, .145), .1],
    [cone([.2, -.14, -.1], [-.05, .36, -.065], .19, .145), .1],
  ]);
}
/* the solid wall: outside minus the chambers */
export const solid = (): Prim => subtract(exterior(), cavities(), .02);

/* where the septum is on the cut face: between the two ventricles, as far from both as it gets */
export function septumAnchor(): V3 {
  const R = rightCavities(), L = leftCavities(), S = solid();
  let best: V3 = [0, -.3, CUT], score = -Infinity;
  for (let y = -.5; y <= -.1; y += .02) for (let x = -.3; x <= .4; x += .005) {
    const r = R.f(x, y, CUT - .01), l = L.f(x, y, CUT - .01);
    if (S.f(x, y, CUT - .01) >= 0 || r <= 0 || l <= 0) continue;
    /* the middle of the wall, near the middle height of the ventricles */
    const v = Math.min(r, l) - Math.abs(r - l) - .1 * Math.abs(y + .3);
    if (v > score) { score = v; best = [x, y, CUT]; }
  }
  return best;
}

export type VesselKind = "artery" | "vein";
export interface Vessel {id: string; kind: VesselKind; pts: V3[]; r: number; part: string; open?: [boolean, boolean]}

/* the big vessels of the heart: aorta with exactly three branches from its arch, the pulmonary
   trunk and its two arteries, both venae cavae and four pulmonary veins. The vessels start a
   little inside the wall, so they come out of it cleanly. */
export const VESSELS: Vessel[] = [
  {id: "aorta", kind: "artery", part: "aorta", r: .19, open: [false, true],
    pts: [[-.05, .3, -.07], [-.16, 1.0, -.03], [-.1, 1.42, -.03], [.16, 1.62, -.18], [.42, 1.5, -.42], [.5, 1.0, -.6], [.48, .1, -.68], [.44, -1.15, -.66]]},
  {id: "bct", kind: "artery", part: "aorta", r: .1, open: [false, true], pts: [[-.08, 1.5, -.06], [-.18, 1.9, -.06], [-.22, 2.28, -.06]]},
  {id: "lcca", kind: "artery", part: "aorta", r: .08, open: [false, true], pts: [[.12, 1.62, -.15], [.15, 1.98, -.16], [.16, 2.32, -.16]]},
  {id: "lsa", kind: "artery", part: "aorta", r: .085, open: [false, true], pts: [[.32, 1.58, -.3], [.44, 1.93, -.35], [.53, 2.26, -.38]]},
  {id: "pt", kind: "vein", part: "lungartar", r: .19, open: [false, false], pts: [[-.03, .34, .24], [.12, .9, .28], [.24, 1.18, .06], [.28, 1.24, -.12]]},
  {id: "lpa", kind: "vein", part: "lungartar", r: .135, open: [false, true], pts: [[.28, 1.24, -.12], [.62, 1.22, -.24], [.98, 1.12, -.3]]},
  {id: "rpa", kind: "vein", part: "lungartar", r: .135, open: [false, true], pts: [[.28, 1.24, -.12], [.02, 1.2, -.44], [-.45, 1.16, -.46], [-.98, 1.1, -.42]]},
  {id: "svc", kind: "vein", part: "halvener", r: .15, open: [true, false], pts: [[-.7, 1.95, -.12], [-.7, 1.3, -.11], [-.68, .66, -.09]]},
  {id: "brv", kind: "vein", part: "halvener", r: .1, open: [true, false], pts: [[-.92, 2.3, -.1], [-.82, 2.05, -.11], [-.7, 1.88, -.12]]},
  /* the left brachiocephalic vein comes from the body's left, across in front of the arch's branches */
  {id: "blv", kind: "vein", part: "halvener", r: .1, open: [true, false], pts: [[.62, 2.2, -.02], [.3, 2.08, .16], [-.1, 2.0, .2], [-.48, 1.96, .08], [-.69, 1.88, -.1]]},
  {id: "ivc", kind: "vein", part: "halvener", r: .16, open: [true, false], pts: [[-.62, -1.2, -.5], [-.66, -.6, -.46], [-.68, -.02, -.3]]},
  {id: "rspv", kind: "artery", part: "lungvener", r: .085, open: [true, false], pts: [[-1.0, .74, -.5], [-.4, .7, -.5], [.22, .62, -.32]]},
  {id: "ripv", kind: "artery", part: "lungvener", r: .085, open: [true, false], pts: [[-1.0, .44, -.5], [-.4, .46, -.5], [.22, .52, -.32]]},
  {id: "lspv", kind: "artery", part: "lungvener", r: .085, open: [true, false], pts: [[1.08, .74, -.4], [.9, .68, -.34], [.68, .62, -.28]]},
  {id: "lipv", kind: "artery", part: "lungvener", r: .085, open: [true, false], pts: [[1.08, .44, -.4], [.9, .46, -.34], [.68, .5, -.28]]},
];

/* the paths the blood takes (heart space): blue from the body through the right heart to the
   lungs, red from the lungs through the left heart out to the body */
export function flowPaths(): {kind: VesselKind; c: THREE.CatmullRomCurve3; w: number}[] {
  const C = (p: V3[]) => curve(p, .5);
  /* right heart: right atrium, through the tricuspid valve, round the right ventricle, up its outflow */
  const rightHeart: V3[] = [[-.56, .1, -.02], [-.4, -.2, .04], [-.32, -.55, .08], [-.18, -.4, .14], [-.12, -.05, .2], [-.02, .3, .24], [.06, .6, .27], [.14, .92, .28], [.24, 1.16, .06]];
  /* left heart: left atrium, through the mitral valve, down to the apex and back up the outflow */
  const leftHeart: V3[] = [[.42, .44, -.18], [.4, .1, -.14], [.42, -.4, -.12], [.5, -.75, -.12], [.32, -.42, -.12], [.16, -.06, -.1], [.02, .26, -.08], [-.1, .5, -.06], [-.16, 1.0, -.03]];
  return [
    {kind: "vein", w: 1, c: C([[-.7, 1.95, -.12], [-.7, 1.0, -.1], [-.68, .4, -.08], ...rightHeart, [.5, 1.22, -.2], [.98, 1.12, -.3]])},
    {kind: "vein", w: 1, c: C([[-.62, -1.2, -.5], [-.67, -.45, -.44], [-.68, .1, -.2], ...rightHeart, [.1, 1.2, -.4], [-.45, 1.16, -.46], [-.98, 1.1, -.42]])},
    {kind: "artery", w: 1, c: C([[-1.0, .74, -.5], [-.4, .7, -.5], [.2, .62, -.3], ...leftHeart, [-.1, 1.42, -.03], [.16, 1.62, -.18], [.42, 1.5, -.42], [.5, 1.0, -.6], [.48, .1, -.68], [.44, -1.15, -.66]])},
    {kind: "artery", w: 1, c: C([[1.08, .44, -.4], [.7, .5, -.28], ...leftHeart, [-.12, 1.4, -.05], [-.18, 1.9, -.06], [-.22, 2.28, -.06]])},
    {kind: "artery", w: 1, c: C([[1.08, .74, -.4], [.7, .62, -.28], ...leftHeart, [-.06, 1.5, -.08], [.14, 1.66, -.16], [.16, 2.32, -.16]])},
  ];
}
