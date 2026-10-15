/* The organs inside the child, each a separate group of meshes with its own materials:
   brain, lungs (with the windpipe), heart (with its big vessels), liver (with the gallbladder),
   stomach, esophagus, intestines, kidneys (with the ureters) and bladder.
   Body space as in body.ts: the liver is on the body's right (-x, the viewer's left in a front
   view), the stomach and the heart's apex on the body's left (+x). */
import * as THREE from "three";
import {ellipsoid, sphere, cone, union, subtract, intersect, half, offset, mesh, surfaceAlong, type Prim, type V3} from "../geo/sdf";
import {bodyShape} from "./body";
import {tube, curve} from "../geo/shapes";
import {makeNoise} from "../geo/noise";
import {once} from "../geo/cache";
import {COLORS, organ} from "../materials";
import {hemisphere, cerebellum, brainstem, BRAIN_AT} from "./brainShape";
import {exterior, VESSELS} from "./heartShape";
import {lungShape, TRACHEA, BRONCHI, BRONCHUS_R, LARYNX, PHARYNX} from "./lungShape";
import {cordPath} from "./skeleton";

const S = [-1, 1] as const;
const M = (geo: THREE.BufferGeometry, mat: THREE.Material, name = "") => { const m = new THREE.Mesh(geo, mat); m.name = name; return m; };

/* where the brain and the heart sit in the body */
export {BRAIN_AT};
export const HEART_AT = {pos: new THREE.Vector3(.06, 6.25, .24), scale: .4, rotY: -.35};

export type OrganPartId = "brain" | "lungs" | "heart" | "liver" | "stomach" | "esophagus" | "intestines" | "kidneys" | "bladder";

/* the belly's organs are drawn a little larger than first modelled (closer to the reference
   proportions), each grown round a point that keeps it in its place */
const grow = (g: THREE.Group, k: number, pivot: V3) => {
  const w = group(g.name); w.position.set(...pivot); w.scale.setScalar(k);
  g.name += "-model"; g.position.set(-pivot[0], -pivot[1], -pivot[2]); w.add(g);
  return w;
};
/* one builder per organ (the explorer builds them one at a time) */
export const ORGAN_BUILDERS: Record<OrganPartId, () => THREE.Group> = {
  brain: () => brain(), lungs: () => lungs(), heart: () => heart(),
  liver: () => grow(liver(), 1.1, [-.25, 5.95, .1]), stomach: () => grow(stomach(), 1.1, [.4, 5.3, .14]), esophagus: () => esophagus(),
  intestines: () => grow(intestines(), 1.12, [0, 4.68, .12]), kidneys: () => grow(kidneys(), 1.12, [0, 5.0, -.28]), bladder: () => grow(bladder(), 1.12, [0, 4.22, .16]),
};

function group(name: string) { const g = new THREE.Group(); g.name = name; return g; }

function brain() {
  const g = group("brain");
  const m = organ(COLORS.brain, {roughness: .42, clearcoat: .5, sheen: .2, sheenColor: new THREE.Color("#ffd0d6")});
  const cm = organ(COLORS.cerebellum, {roughness: .45, clearcoat: .45});
  const st = organ(COLORS.stem, {roughness: .45, clearcoat: .4});
  const inner = group("brain-inner");
  for (const s of S) inner.add(M(once("geo:hemi:" + s + ":body", () => hemisphere(s, 56)), m, "cerebrum"));
  inner.add(M(once("geo:cereb:body", () => cerebellum(72)), cm, "cerebellum"));
  inner.add(M(once("geo:stem", brainstem), st, "brainstem"));
  inner.position.copy(BRAIN_AT.pos); inner.scale.setScalar(BRAIN_AT.scale);
  g.add(inner);
  /* the start of the spinal cord: on from the brainstem, back and down into the spine (its own
     pale yellow, so it does not read as part of the throat in front of it) */
  g.add(M(once("geo:cordstub", () => tube(cordPath().slice(0, 4), {r: t => .05 - .006 * t, seg: 30, radial: 14, caps: [false, true]})),
    organ(COLORS.cord, {roughness: .4, clearcoat: .5}), "spinal-cord"));
  return g;
}

function lungs() {
  const g = group("lungs");
  const lm = organ(COLORS.lung, {roughness: .46, clearcoat: .4, sheen: .2, sheenColor: new THREE.Color("#ffe1e6")});
  for (const s of S) g.add(M(once("geo:lung:" + s, () => mesh(lungShape(s), {h: .026})), lm, s < 0 ? "right-lung" : "left-lung"));
  g.add(airways(organ(COLORS.airway, {roughness: .5, clearcoat: .3})));
  return g;
}

/* the throat's own material: open at the mouth end, so both sides are drawn */
const throatMat = () => organ(COLORS.airway, {roughness: .5, clearcoat: .3, side: THREE.DoubleSide});

/* the windpipe with its cartilage rings and the two bronchi */
export function airways(m: THREE.Material) {
  const g = group("airways");
  g.add(M(once("geo:trachea", () => tube(TRACHEA, {r: t => .056 * (1 + .1 * Math.max(0, Math.cos(t * Math.PI * 2 * 13))), seg: 140, radial: 18, caps: [false, false]})), m, "trachea"));
  const lx = new THREE.Mesh(new THREE.SphereGeometry(.078, 24, 16), m); lx.position.set(...LARYNX); lx.scale.set(1.15, 1.05, .85); lx.name = "larynx"; g.add(lx);
  /* the throat (pharynx): one tube behind the mouth that both the windpipe (in front) and the food
     pipe (behind) start from; it turns forwards and opens, wide, into the back of the mouth. It ends
     well below the brain: the brainstem goes on as the spinal cord behind it, into the spine. */
  g.add(M(tube(PHARYNX, {r: t => .07 + .025 * Math.pow(t, 3), seg: 36, radial: 20, caps: [true, false]}), throatMat(), "throat"));
  BRONCHI.forEach((b, i) => g.add(M(tube(b, {r: t => BRONCHUS_R[i] * (1 - .28 * t), seg: 30, radial: 14, caps: [true, true]}), m, "bronchus")));
  return g;
}

/* small coronary vessels on the heart's surface, found by looking at it from the front */
function coronaries(ext: Prim): {pts: V3[]; kind: "a" | "v"}[] {
  const on = (x: number, y: number, dz = 1): V3 => { const p = surfaceAlong(ext, [x, y, 0], [0, 0, dz], 3); return [p[0], p[1], p[2] + .012 * dz]; };
  const path = (xy: [number, number][]) => xy.map(([x, y]) => on(x, y));
  return [
    {kind: "a", pts: path([[.02, .2], [.12, -.2], [.28, -.6], [.48, -.92]])},
    {kind: "v", pts: path([[.08, .22], [.2, -.18], [.36, -.56], [.56, -.88]])},
    {kind: "a", pts: path([[.14, -.25], [-.06, -.48], [-.16, -.72]])},
    {kind: "a", pts: path([[-.5, .06], [-.56, -.28], [-.44, -.62], [-.2, -.86]])},
  ];
}

/* the heart's outside with its vessels; scale and placement from the caller */
export function heartModel(opts: {vesselEnds: "open" | "round"; detail: boolean}) {
  const g = group("heart-model");
  const wall = organ(COLORS.heart, {roughness: .34, clearcoat: .6, clearcoatRoughness: .25, sheen: .4, sheenColor: new THREE.Color("#ffb3a8")});
  const art = organ(COLORS.artery, {roughness: .3, clearcoat: .7, side: opts.vesselEnds === "open" ? THREE.DoubleSide : THREE.FrontSide});
  const vein = organ(COLORS.vein, {roughness: .3, clearcoat: .7, side: opts.vesselEnds === "open" ? THREE.DoubleSide : THREE.FrontSide});
  const ext = exterior();
  const body = M(once("geo:heart:ext:" + (opts.detail ? "d" : "b"), () => mesh(ext, {h: opts.detail ? .022 : .04})), wall, "heart-wall");
  body.userData.part = "wall";
  g.add(body);
  const parts: Record<string, THREE.Mesh[]> = {};
  for (const v0 of VESSELS) {
    /* in the body the aorta goes on down the back in the vessel layer: end it behind the heart */
    const v = !opts.detail && v0.id === "aorta" ? {...v0, pts: v0.pts.slice(0, 6)} : v0;
    const ends = opts.vesselEnds === "open" ? (v.open ?? [false, false]).map(o => !o) as [boolean, boolean] : [true, true] as [boolean, boolean];
    const m = M(tube(v.pts, {r: v.r, seg: 48, radial: opts.detail ? 28 : 16, caps: ends}), v.kind === "artery" ? art : vein, v.id);
    m.userData.part = v.part;
    (parts[v.part] ??= []).push(m);
    g.add(m);
  }
  const ca = organ("#d2232e", {roughness: .35, clearcoat: .6}), cv = organ("#3559c8", {roughness: .35, clearcoat: .6});
  for (const c of coronaries(ext)) g.add(M(tube(c.pts, {r: t => (opts.detail ? .03 : .036) * (1 - .45 * t), seg: 30, radial: 8}), c.kind === "a" ? ca : cv, "coronary"));
  return {group: g, ext, vesselParts: parts};
}

function heart() {
  const g = group("heart");
  const h = heartModel({vesselEnds: "round", detail: false});
  h.group.position.copy(HEART_AT.pos); h.group.scale.setScalar(HEART_AT.scale); h.group.rotation.y = HEART_AT.rotY;
  g.add(h.group);
  return g;
}

function liver() {
  const g = group("liver");
  const lm = organ(COLORS.liver, {roughness: .36, clearcoat: .55, sheen: .3, sheenColor: new THREE.Color("#e7a090")});
  const shape = once("sdf:liver", () => {
    const L = union([
      ellipsoid([-.46, 5.62, .04], [.44, .36, .44]),
      [ellipsoid([-.06, 5.68, .12], [.4, .24, .33]), .28],
      [ellipsoid([.34, 5.72, .16], [.3, .12, .22], [0, 0, -.18]), .22],
    ]);
    /* a flat underside that rises towards the pointed left lobe */
    return intersect(intersect(L, half([.29, -1, .08], -5.46), .1), offset(bodyShape(), -.08), .06);
  });
  g.add(M(once("geo:liver", () => mesh(shape, {h: .026})), lm, "liver"));
  /* the ligament line between the right and left lobe */
  const lig = [5.9, 5.8, 5.68, 5.56].map((y, i) => { const p = surfaceAlong(shape, [-.04 + i * .015, y, 0], [0, .1, 1]); return [p[0], p[1], p[2] + .004] as V3; });
  g.add(M(tube(lig, {r: t => .013 * (1 - .5 * t), seg: 20, radial: 8}), organ("#c27a63", {roughness: .5}), "ligament"));
  const gb = new THREE.Mesh(tube([[-.4, 5.42, .3], [-.42, 5.3, .44], [-.44, 5.22, .5]], {r: t => .05 + .045 * Math.sin(Math.PI * Math.min(1, t * 1.1)), seg: 20, radial: 16}),
    organ(COLORS.gall, {roughness: .3, clearcoat: .7}));
  gb.name = "gallbladder"; g.add(gb);
  return g;
}

/* the stomach: a J-shaped bag, peach with a pink blush along the big curve */
export const STOMACH: V3[] = [[.5, 5.98, -.04], [.62, 5.7, .04], [.62, 5.4, .12], [.46, 5.2, .2], [.22, 5.18, .26], [.04, 5.27, .24], [-.08, 5.27, .17]];
function stomach() {
  const g = group("stomach");
  const geo = once("geo:stomach", () => {
    const c = curve(STOMACH, .5);
    const t0 = tube(c, {r: t => {
      const a = .19 + .07 * Math.sin(Math.PI * Math.min(1, t / .75));
      return t < .78 ? a : t < .86 ? a + (.075 - a) * (t - .78) / .08 : t < .9 ? .062 : .072;
    }, seg: 90, radial: 32, sx: 1, sy: .82, up: [0, 0, 1]});
    /* blush on the outer (greater) curve */
    const pos = t0.attributes.position, col: number[] = [];
    const a = new THREE.Color(COLORS.stomach), b = new THREE.Color("#ec8789");
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i);
      const k = Math.max(0, Math.min(1, (x - .35) * 2.2 + (5.45 - y) * 1.2 - .2));
      const c2 = a.clone().lerp(b, k * .6); col.push(c2.r, c2.g, c2.b);
    }
    t0.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
    return t0;
  });
  const m = organ("#ffffff", {roughness: .3, clearcoat: .7, clearcoatRoughness: .2, vertexColors: true, sheen: .3});
  g.add(M(geo, m, "stomach"));
  return g;
}

/* the food pipe: from the throat, behind the windpipe and the heart, through the diaphragm into the stomach */
export const ESOPHAGUS: V3[] = [[0, 7.99, .0], [0, 7.4, -.08], [.01, 6.8, -.2], [.05, 6.3, -.2], [.14, 6.05, -.12], [.26, 5.9, -.04], [.34, 5.82, -.01]];
function esophagus() {
  const g = group("esophagus");
  g.add(M(tube(ESOPHAGUS, {r: .043, seg: 80, radial: 14}), organ(COLORS.esophagus, {roughness: .35, clearcoat: .6}), "esophagus"));
  return g;
}

/* the large intestine framing the small intestine's coils */
export const COLON: V3[] = [[-.6, 4.44, .1], [-.68, 4.62, .1], [-.72, 4.84, .08], [-.63, 5.0, .16], [-.3, 4.94, .3], [.05, 4.88, .32], [.4, 4.94, .28],
  [.68, 5.04, .12], [.74, 4.82, .04], [.72, 4.56, .05], [.56, 4.33, .06], [.3, 4.3, -.02], [.1, 4.3, -.1], [.02, 4.18, -.17], [0, 4.04, -.21]];
function intestines() {
  const g = group("intestines");
  const large = organ(COLORS.large, {roughness: .32, clearcoat: .65, clearcoatRoughness: .2, sheen: .4});
  const small = organ(COLORS.small, {roughness: .3, clearcoat: .7, clearcoatRoughness: .2, sheen: .4, sheenColor: new THREE.Color("#ffd5da")});
  g.add(M(once("geo:colon", () => tube(curve(COLON, .5), {r: t => {
    const h = .5 - .5 * Math.cos(t * Math.PI * 2 * 26);
    const end = t > .86 ? 1 - (t - .86) / .14 * .35 : 1;
    return (.088 + .022 * h) * end * (t < .04 ? .9 + 2.5 * t : 1);
  }, seg: 520, radial: 22})), large, "colon"));
  g.add(M(tube([[-.6, 4.4, .08], [-.53, 4.27, .12], [-.49, 4.2, .1]], {r: .022, seg: 12, radial: 8}), large, "appendix"));
  g.add(M(once("geo:small", () => tube(smallPath(), {r: .046, seg: 1400, radial: 12})), small, "small-intestine"));
  return g;
}
/* the coiled small intestine: rows of loops in three layers, from the stomach's exit down */
function smallPath(): THREE.CatmullRomCurve3 {
  const N = makeNoise(3), pts: V3[] = [[-.08, 5.27, .17], [-.2, 5.14, .12], [-.2, 4.98, .06], [-.02, 4.9, .06]];
  const layers = [.06, .17, .28];
  let dir = 1;
  layers.forEach((z, li) => {
    const rows = [4.82, 4.7, 4.58, 4.46, 4.36];
    (li % 2 ? [...rows].reverse() : rows).forEach(y => {
      const xs = dir > 0 ? [-.46, -.3, -.15, 0, .15, .3, .46] : [.46, .3, .15, 0, -.15, -.3, -.46];
      xs.forEach((x, k) => {
        const w = (k % 2 ? 1 : -1) * .045;
        pts.push([x + N(x * 5, y * 5, z * 5) * .04, y + w + N(y * 7, x * 7, 1) * .02, z + (k % 2 ? .04 : -.03) + N(x * 3, z * 9, y) * .02]);
      });
      dir = -dir;
    });
  });
  pts.push([.1, 4.4, .25], [.0, 4.48, .1], [-.38, 4.45, .08], [-.56, 4.48, .1]);
  return curve(pts, .5);
}

function kidneys() {
  const g = group("kidneys");
  const km = organ(COLORS.kidney, {roughness: .32, clearcoat: .65, sheen: .3, sheenColor: new THREE.Color("#ff9da0")});
  const um = organ(COLORS.ureter, {roughness: .4, clearcoat: .4});
  const art = organ(COLORS.artery, {roughness: .3, clearcoat: .6}), vein = organ(COLORS.vein, {roughness: .3, clearcoat: .6});
  for (const s of S) {
    const c: V3 = [s * .47, s < 0 ? 5.17 : 5.29, -.34];
    const shape = once("sdf:kidney:" + s, () => subtract(ellipsoid(c, [.15, .25, .1], [0, 0, s * .22]), sphere([c[0] - s * .17, c[1] - .01, c[2] + .03], .1), .07));
    g.add(M(once("geo:kidney:" + s, () => mesh(shape, {h: .016})), km, "kidney"));
    const hx = c[0] - s * .1;
    g.add(M(tube([[hx, c[1] + .03, c[2] + .02], [hx - s * .12, c[1] + .05, c[2] + .05], [hx - s * .22, c[1] + .05, c[2] + .07]], {r: .02, seg: 12, radial: 10}), art, "renal-artery"));
    g.add(M(tube([[hx, c[1] - .02, c[2] + .05], [hx - s * .12, c[1] - .02, c[2] + .08], [hx - s * .2, c[1] - .01, c[2] + .1]], {r: .022, seg: 12, radial: 10}), vein, "renal-vein"));
    g.add(M(tube([[hx, c[1] - .07, c[2] + .02], [hx - s * .02, c[1] - .3, c[2] + .02], [s * .3, 4.7, -.24], [s * .24, 4.42, -.1], [s * .12, 4.22, .08]], {r: .02, seg: 50, radial: 10}), um, "ureter"));
  }
  return g;
}

function bladder() {
  const g = group("bladder");
  const shape = union([ellipsoid([0, 4.2, .2], [.18, .15, .16]), [cone([0, 4.09, .22], [0, 4.02, .23], .05, .024), .05]]);
  g.add(M(once("geo:bladder", () => mesh(shape, {h: .014})), organ(COLORS.bladder, {roughness: .3, clearcoat: .7, sheen: .4}), "bladder"));
  return g;
}
