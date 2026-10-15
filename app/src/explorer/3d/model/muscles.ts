/* The muscle layer: one smooth "muscle suit" just under the skin. The neck rounds off into the base
   of the skull (the neck muscles hold the head), and the head only gets its two big chewing muscles
   on each side (temples and cheeks): the face itself is left out so it never looks frightening. Shallow grooves split it into the big muscle groups a
   child can name: chest, belly (six-pack), shoulders, upper arms, thighs, calves, the back and the
   bottom. Tendons (wrists, hands, knees, ankles, feet) are a pale cream colour.
   Simplified: real muscles are separate bundles in several layers. */
import * as THREE from "three";
import {cone, ellipsoid, union, subtract, intersect, half, offset, mesh, surfaceAlong, type Prim, type V3} from "../geo/sdf";
import {makeNoise} from "../geo/noise";
import {once} from "../geo/cache";
import {COLORS, organ} from "../materials";
import {headlessShape, bodyShape} from "./body";

const S = [-1, 1] as const;
type Side = "front" | "back" | "out";

/* the outside of the muscle layer: just inside the skin. The neck ends in a soft, rounded top that
   goes up into the back of the head; the chewing muscles are thin patches under the skin of the head */
const envelope = () => once("sdf:muscle-env", () => {
  const skin = offset(bodyShape(), -.035);
  /* the neck rises higher at the back (up to the base of the skull) than under the jaw, rounded off */
  const neck = intersect(offset(headlessShape(), -.035), half([0, 1, .6], 8.0), .22);
  /* temporalis (a fan over each temple) and masseter (from the cheekbone down to the jaw's angle):
     the part of an ellipsoid that lies just inside the skin, a thin lens that tapers to its edges */
  const lens = (c: V3, r: V3, rot?: V3) => intersect(skin, ellipsoid(c, r, rot));
  const chew = S.flatMap(s => [lens([s * 1.29, 9.08, .02], [.33, .5, .55]), lens([s * 1.03, 8.26, .36], [.28, .3, .2], [0, 0, s * .25])]);
  return union([neck, ...chew]);
});

function onSurface(base: Prim, side: Side, x: number, y: number, z0 = 0): V3 {
  if (side === "out") return surfaceAlong(base, [x * .85, y, z0], [Math.sign(x), 0, 0], 2);
  return surfaceAlong(base, [x, y, z0], [0, 0, side === "front" ? 1 : -1], 2);
}
const inward = (p: V3, side: Side, d: number): V3 => side === "front" ? [p[0], p[1], p[2] - d] : side === "back" ? [p[0], p[1], p[2] + d] : [p[0] - Math.sign(p[0]) * d, p[1], p[2]];

/* soft grooves between the muscle groups: points (x, y) found on the surface from the front,
   the back or the outside */
interface Groove {side: Side; pts: [number, number][]; r?: number; z0?: number}
function grooves(): Groove[] {
  const g: Groove[] = [
    {side: "front", pts: [[0, 6.95], [0, 6.65], [0, 6.3]], r: .04},
    {side: "front", pts: [[0, 6.25], [0, 5.5], [0, 4.7]], r: .05},
    ...[5.84, 5.42].map(y => ({side: "front" as Side, pts: [[-.29, y + .02], [0, y - .015], [.29, y + .02]] as [number, number][], r: .036})),
    {side: "back", pts: [[0, 7.3], [0, 6.5], [0, 5.0], [0, 4.62]], r: .055},
    {side: "back", pts: [[0, 4.55], [0, 4.25], [0, 4.0]], r: .05},
  ];
  for (const s of S) g.push(
    /* chest muscle's lower edge, the belly's side lines, the groin */
    {side: "front", pts: [[s * .04, 6.28], [s * .3, 6.18], [s * .58, 6.28], [s * .8, 6.58], [s * .92, 6.9]]},
    {side: "front", pts: [[s * .36, 6.22], [s * .35, 5.5], [s * .27, 4.78]], r: .036},
    {side: "front", pts: [[s * .8, 4.8], [s * .5, 4.42], [s * .16, 4.16]]},
    /* neck muscles from behind the ear to the breastbone */
    {side: "front", pts: [[s * .36, 8.0], [s * .22, 7.62], [s * .12, 7.28]], r: .032, z0: -.1},
    /* shoulder cap (deltoid) front and back, upper arm and forearm */
    {side: "front", pts: [[s * .9, 6.95], [s * 1.1, 6.6], [s * 1.28, 6.15]]},
    {side: "back", pts: [[s * .92, 6.95], [s * 1.12, 6.6], [s * 1.29, 6.15]]},
    {side: "out", pts: [[s * 1.32, 6.32], [s * 1.38, 5.98]], r: .034, z0: -.03},
    {side: "out", pts: [[s * 1.47, 5.6], [s * 1.56, 5.0]], r: .03, z0: -.03},
    {side: "front", pts: [[s * 1.3, 6.08], [s * 1.36, 5.82]], r: .032},
    /* the thigh's front muscles, the shin; the back of the thigh and the calf */
    {side: "front", pts: [[s * .26, 4.15], [s * .38, 3.5], [s * .47, 2.86]]},
    {side: "front", pts: [[s * .7, 4.2], [s * .68, 3.5], [s * .61, 2.85]]},
    {side: "front", pts: [[s * .32, 3.15], [s * .4, 2.92], [s * .5, 2.82], [s * .6, 2.88]], r: .03},
    {side: "front", pts: [[s * .6, 2.25], [s * .61, 1.5], [s * .58, .85]], r: .032},
    {side: "back", pts: [[s * .48, 3.95], [s * .5, 3.4], [s * .5, 2.9]]},
    {side: "back", pts: [[s * .5, 2.32], [s * .51, 1.9], [s * .52, 1.45]], r: .034},
    {side: "back", pts: [[s * .36, 1.6], [s * .5, 1.38], [s * .64, 1.6]], r: .03},
    /* the big back muscles: the trapezius' lower edge, the wide back muscle, the top of the bottom */
    {side: "back", pts: [[0, 5.95], [s * .35, 6.4], [s * .62, 6.85], [s * .8, 7.05]], r: .055},
    {side: "back", pts: [[s * .42, 6.32], [s * .72, 6.0], [s * .84, 5.55]], r: .036},
    {side: "back", pts: [[s * .1, 4.9], [s * .46, 4.88], [s * .8, 4.6]]},
  );
  return g;
}

export function muscleShape(): Prim {
  return once("sdf:muscles", () => {
    const env = envelope();
    /* a little fuller on the six-pack */
    const bulge: Prim[] = [];
    for (const s of S) {
      for (const y of [6.05, 5.63, 5.2, 4.82]) bulge.push(ellipsoid(inward(onSurface(env, "front", s * .155, y), "front", .016), [.11, .14, .028]));
    }
    const cuts: Prim[] = [];
    for (const g of grooves()) {
      const r = g.r ?? .045;
      /* the tube sits a little outside the surface, so the groove is wide and shallow */
      const pts = g.pts.map(([x, y]) => onSurface(env, g.side, x, y, g.z0 ?? 0)).map(p => inward(p, g.side, -r * .55));
      for (let i = 1; i < pts.length; i++) cuts.push(cone(pts[i - 1], pts[i], r, r));
    }
    return subtract(union([env, ...bulge.map(b => [b, .05] as [Prim, number])]), union(cuts), .035);
  });
}

/* pale tendons at the joints, a little darker in the grooves, fine variation everywhere */
function colorAt(base: Prim) {
  const red = new THREE.Color(COLORS.muscle), deep = new THREE.Color("#7e1f24"), ten = new THREE.Color(COLORS.tendon);
  const N = makeNoise(17), c = new THREE.Color();
  const near = (x: number, y: number, z: number, p: V3, r: number) => Math.max(0, 1 - Math.hypot(x - p[0], y - p[1], z - p[2]) / r);
  return (x: number, y: number, z: number): [number, number, number] => {
    const ax = Math.abs(x);
    let t = 0;
    if (ax > 1.45) t = Math.max(t, Math.min(1, (4.82 - y) / .2));             /* wrist and hand */
    if (y < .85) t = Math.max(t, Math.min(1, (.85 - y) / .25));               /* ankle and foot */
    t = Math.max(t, Math.min(.1, near(ax, y, z, [.5, 2.5, .32], .26) * .3)); /* knee cap tendon (a faint hint, not a white ball) */
    if (z < 0) t = Math.max(t, Math.min(1, (1.25 - y) / .3) * (y > .4 ? 1 : 0) * near(ax, 0, z, [.52, 0, -.3], .2) * 1.5); /* heel tendon */
    t = Math.max(t, z > 0 && y > 4.8 && y < 6.3 ? .35 * Math.max(0, 1 - ax / .035) : 0);  /* the line down the belly */
    t = Math.min(1, t);
    /* deeper red inside the grooves (the shape is a little further in there) */
    const d = -base.f(x, y, z);
    c.copy(red).lerp(deep, Math.min(1, Math.max(0, (d - .006) * 22)) * .75 + .08 * N(x * 9, y * 9, z * 9));
    c.lerp(ten, t);
    return [c.r, c.g, c.b];
  };
}

export function buildMuscles() {
  const g = new THREE.Group(); g.name = "muscles";
  const geo = once("geo:muscles", () => {
    const sh = muscleShape();
    return mesh(sh, {h: .04, refine: 1, color: colorAt(envelope())});
  });
  const m = organ("#ffffff", {vertexColors: true, roughness: .5, clearcoat: .25, clearcoatRoughness: .55, sheen: .25, sheenColor: new THREE.Color("#ff8a7a"), sheenRoughness: .4});
  const mm = new THREE.Mesh(geo, m); mm.name = "muscle-suit";
  g.add(mm);
  return g;
}
