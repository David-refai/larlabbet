/* The child: one smooth body (head, neck, torso, arms with hands and fingers, legs and feet) made
   from a blend of simple shapes, plus hair, blue shorts and a friendly face. The same body mesh is
   used twice: with warm skin (mode A) and as the see-through teal shell (modes B to D).
   Body space: the child is about 10.2 tall, feet at y = 0, facing +z (the camera at the start).
   The body's RIGHT side is at -x, so in a front view it is on the viewer's LEFT. */
import * as THREE from "three";
import {cone, ellipsoid, sphere, union, intersect, half, offset, mesh, surfaceAlong, type Prim, type V3} from "../geo/sdf";
import {tube} from "../geo/shapes";
import {once} from "../geo/cache";
import {COLORS, skin as skinMat, organ, xray} from "../materials";

const S = [-1, 1] as const;
type P = Prim | [Prim, number];

/* the parts of the body shape, reused by the shorts */
function torsoParts(): P[] {
  return [
    ellipsoid([0, 6.5, -.01], [.97, .86, .66]),
    [ellipsoid([0, 6.98, -.04], [1.04, .46, .58]), .45],
    [ellipsoid([0, 5.42, .05], [.9, .92, .66]), .5],
    [ellipsoid([0, 4.62, -.03], [.95, .6, .6]), .45],
    ...S.map(s => [sphere([s * .36, 4.42, -.27], .42), .3] as P),
    ...S.map(s => [ellipsoid([s * 1.0, 7.1, -.05], [.42, .33, .37]), .32] as P),
  ];
}
function legParts(s: number): P[] {
  return [
    [cone([s * .47, 4.55, -.01], [s * .5, 2.62, .03], .47, .3), .24],
    [sphere([s * .5, 2.56, .06], .29), .1],
    [cone([s * .5, 2.56, 0], [s * .52, .56, -.05], .29, .18), .1],
    [ellipsoid([s * .51, 1.92, -.1], [.27, .56, .26]), .16],
    [sphere([s * .52, .48, -.06], .19), .1],
    [intersect(union([ellipsoid([s * .54, .22, .16], [.23, .21, .5]), [sphere([s * .47, .14, .58], .11), .08]]), half([0, -1, 0], 0), .05), .12],
  ];
}
function armParts(s: number, withHand = true): P[] {
  const arm: P[] = [
    [cone([s * 1.1, 7.02, -.05], [s * 1.4, 5.8, -.03], .33, .26), .18],
    [cone([s * 1.4, 5.8, -.03], [s * 1.62, 4.62, .08], .25, .16), .08],
  ];
  return withHand ? [...arm, [handShape(s), .08]] : arm;
}

/* a relaxed hand, palm towards the thigh: a soft palm, four slightly curled fingers that fan a
   little, and the thumb in front */
export function handShape(s: number): Prim {
  return once("sdf:hand" + s, () => {
    const fingers: P[] = [0, 1, 2, 3].map(i => {
      const z = .235 - i * .098, L = [.29, .32, .3, .24][i], dz = [.03, .008, -.012, -.035][i];
      const b: V3 = [s * 1.715, 4.13 + [.012, 0, .006, .03][i], z];
      const m: V3 = [b[0] + s * .004, b[1] - L * .52, z + dz * .5];
      const t: V3 = [m[0] - s * .045, m[1] - L * .46, z + dz];
      return [union([cone(b, m, .05, .045), [cone(m, t, .045, .04), .02]]), .035] as P;
    });
    return union([
      cone([s * 1.6, 4.8, .072], [s * 1.685, 4.42, .1], .135, .122),
      [ellipsoid([s * 1.705, 4.28, .11], [.092, .2, .175], [0, 0, s * .1]), .08],
      [ellipsoid([s * 1.66, 4.3, .2], [.07, .12, .075]), .06],
      ...fingers,
      [union([cone([s * 1.655, 4.35, .22], [s * 1.625, 4.21, .33], .062, .052), [cone([s * 1.625, 4.21, .33], [s * 1.6, 4.1, .36], .052, .044), .02]]), .045],
    ]);
  });
}
function headParts(): P[] {
  return [
    ellipsoid([0, 8.98, -.04], [1.1, 1.12, 1.06]),
    [ellipsoid([0, 8.42, .12], [.86, .68, .84]), .35],
    [ellipsoid([0, 8.07, .4], [.36, .22, .3]), .25],
    [ellipsoid([0, 8.55, 1.0], [.13, .12, .11]), .08],
    ...S.map(s => [ellipsoid([s * 1.08, 8.72, -.1], [.12, .27, .19], [0, s * -.3, 0]), .07] as P),
  ];
}

/* The body is meshed in two pieces from the same shape: the hands (below the wrist) on a fine grid,
   because the fingers are too thin for the body's grid, and the rest on the normal grid. The two
   pieces overlap by a thin band at the wrist so no crack shows. */
const WRIST_Y = 4.55;
function bodyNoHands(): Prim {
  /* near the cut the coarse piece shrinks a little, so its ragged edge hides under the fine hand */
  const tucked = offset(bodyShape(), (x, y) => Math.abs(x) > 1.4 ? -.03 * Math.max(0, Math.min(1, (WRIST_Y - y) / .025)) : 0);
  return once("sdf:body-nohands", () => intersect(tucked,
    union([half([0, -1, 0], -(WRIST_Y - .025)), intersect(half([1, 0, 0], 1.4), half([-1, 0, 0], 1.4))])));
}
function handPiece(s: number): Prim {
  /* its top edge shrinks a little so that it tucks under the body piece */
  const tucked = offset(bodyShape(), (_x, y) => -.03 * Math.max(0, Math.min(1, (y - WRIST_Y - .05) / .03)));
  return intersect(tucked, intersect(half([0, 1, 0], WRIST_Y + .08), half([-s, 0, 0], -1.4)));
}

export function bodyShape(): Prim {
  return once("sdf:body", () => union([
    union(headParts()),
    [cone([0, 7.25, -.06], [0, 8.2, -.08], .37, .34), .26],
    [union(torsoParts()), .3],
    ...S.flatMap(s => armParts(s)),
    ...S.flatMap(s => legParts(s)),
  ]));
}

/* the body without the head (the muscle layer covers this) */
export function headlessShape(): Prim {
  return once("sdf:headless", () => union([
    cone([0, 7.25, -.06], [0, 8.2, -.08], .37, .34),
    [union(torsoParts()), .3],
    ...S.flatMap(s => armParts(s)),
    ...S.flatMap(s => legParts(s)),
  ]));
}

/* the trunk alone (no arms or legs): ribs, collar bones and shoulder blades follow its surface */
export function torsoShape(): Prim {
  return once("sdf:torso", () => union([union(torsoParts()), [cone([0, 7.25, -.06], [0, 8.2, -.08], .37, .34), .26]]));
}

const lerp3 = (a: THREE.Color, b: THREE.Color, t: number) => a.clone().lerp(b, Math.max(0, Math.min(1, t)));

/* the meshed body; vertex colours give rosy cheeks, knees and elbows */
export function bodyGeometry() {
  return once("geo:body", () => {
    const base = new THREE.Color(COLORS.skin), rosy = new THREE.Color("#ea8f76");
    const near = (x: number, y: number, z: number, c: V3, r: number) => Math.max(0, 1 - Math.hypot(x - c[0], y - c[1], z - c[2]) / r);
    return mesh(bodyNoHands(), {h: .045, lo: [-2.05, -.06, -1.25], hi: [2.05, 10.3, 1.35], color: (x, y, z) => {
      const w = Math.max(near(Math.abs(x), y, z, [.62, 8.38, .72], .32) * .55, near(Math.abs(x), y, z, [.5, 2.6, .3], .3) * .25,
        near(Math.abs(x), y, z, [1.42, 5.8, -.2], .25) * .2, near(x, y, z, [0, 8.55, 1.08], .15) * .35);
      const c = lerp3(base, rosy, w);
      return [c.r, c.g, c.b];
    }});
  });
}

/* each hand on a fine grid (see bodyNoHands) */
export function handGeometry(s: number) {
  return once("geo:hand" + s, () => mesh(handPiece(s), {h: .014,
    lo: [s > 0 ? 1.38 : -2.05, 3.6, -.3], hi: [s > 0 ? 2.05 : -1.38, WRIST_Y + .11, .6]}));
}

function bandGeometry(s: number) {
  return once("geo:band" + s, () => {
    const slab = intersect(half([0, 1, 0], WRIST_Y + .09), half([0, -1, 0], -(WRIST_Y - .04)));
    const arm = intersect(bodyShape(), half([-s, 0, 0], -1.4));
    return mesh(intersect(offset(arm, .02), slab, .025), {h: .012,
      lo: [s > 0 ? 1.38 : -2.05, WRIST_Y - .1, -.3], hi: [s > 0 ? 2.05 : -1.38, WRIST_Y + .14, .5]});
  });
}

function hairShape(): Prim {
  const cap = ellipsoid([0, 9.1, -.1], [1.18, 1.15, 1.14]);
  /* keep the hair above a line that runs from the forehead down to the back of the neck */
  const line = intersect(cap, half([0, -1, .62], -8.86), .08);
  const tufts: P[] = [[-.58, .02], [-.22, .1], [.16, .06], [.52, -.04]].map(([x, r], i) =>
    [ellipsoid([x, 9.56 - Math.abs(x) * .18, .86 - Math.abs(x) * .32], [.32, .16, .22], [.55, x * .35, (i - 1.5) * -.25 + r]), .12] as P);
  return union([line, ...tufts,
    [ellipsoid([.08, 10.18, .02], [.2, .16, .14], [0, 0, -.6]), .12],
    /* soft little tufts at the nape, so the hair does not end in a hard line */
    ...[-.42, -.14, .14, .42].map((x, i) => [ellipsoid([x, 8.42 + (i % 2) * .06, -.93 + Math.abs(x) * .12], [.2, .16, .12], [-.5, 0, x * .5]), .1] as P),
    ...S.map(s => [ellipsoid([s * 1.02, 9.2, -.05], [.2, .32, .45]), .14] as P)]);
}

function shortsShape(): Prim {
  const lower = union([
    ...torsoParts().slice(2, 6),
    ...S.flatMap(s => legParts(s).slice(0, 1)),
  ]);
  const grown = offset(lower, (_x, y) => .04 + .045 * Math.max(0, Math.min(1, (4.3 - y) / .55)));
  return intersect(intersect(grown, half([0, 1, 0], 4.98), .04), half([0, -1, 0], -3.72), .05);
}

export interface BodyParts {skin: THREE.Group; shell: THREE.Group}

export function buildBody(): BodyParts {
  const geo = bodyGeometry();
  const skinM = skinMat(); skinM.color.set("#ffffff"); skinM.vertexColors = true;
  const skinG = new THREE.Group(); skinG.name = "skin";
  const body = new THREE.Mesh(geo, skinM); body.name = "body"; skinG.add(body);
  const handM = skinMat();
  for (const s of S) { const h = new THREE.Mesh(handGeometry(s), handM); h.name = "hand"; skinG.add(h); }
  /* a soft wristband on each wrist: it covers the join between the hand and the arm */
  const bandM = organ(COLORS.shortsBand, {roughness: .75, clearcoat: .05, sheen: .8, sheenColor: new THREE.Color("#a9c2ff")});
  for (const s of S) { const b = new THREE.Mesh(bandGeometry(s), bandM); b.name = "wristband"; skinG.add(b); }

  const hair = new THREE.Mesh(once("geo:hair", () => mesh(hairShape(), {h: .04})),
    organ(COLORS.hair, {roughness: .5, clearcoat: .25, clearcoatRoughness: .5, sheen: .9, sheenColor: new THREE.Color("#a3714d"), sheenRoughness: .35}));
  hair.name = "hair"; skinG.add(hair);
  const shorts = new THREE.Mesh(once("geo:shorts", () => mesh(shortsShape(), {h: .03})),
    organ(COLORS.shorts, {roughness: .7, clearcoat: .05, sheen: .8, sheenColor: new THREE.Color("#8fb0ff")}));
  shorts.name = "shorts"; skinG.add(shorts);
  skinG.add(face());

  const shell = new THREE.Group(); shell.name = "shell";
  const sm = new THREE.Mesh(geo, xray()); sm.renderOrder = 10; shell.add(sm);
  for (const s of S) { const h = new THREE.Mesh(handGeometry(s), sm.material); h.renderOrder = 10; shell.add(h); }
  return {skin: skinG, shell};
}

/* eyes, brows, smile and cheeks, placed on the face surface */
function face() {
  const g = new THREE.Group(); g.name = "face";
  const head = union(headParts());
  const white = organ("#ffffff", {roughness: .2, clearcoat: 1, sheen: 0});
  const iris = organ("#5b3b25", {roughness: .25, clearcoat: 1, sheen: 0});
  const pupil = organ("#16100c", {roughness: .2, clearcoat: 1, sheen: 0});
  const shine = new THREE.MeshBasicMaterial({color: "#ffffff", transparent: true});
  const brown = organ(COLORS.hair, {roughness: .6, clearcoat: 0});
  const lip = organ("#a8473f", {roughness: .45, clearcoat: .3});
  const blush = new THREE.MeshBasicMaterial({color: "#ff8f8f", transparent: true, opacity: .28, depthWrite: false});
  blush.userData.noDepth = true;
  const sph = (r: number, m: THREE.Material, p: V3, sc: V3, ry = 0) => {
    const o = new THREE.Mesh(new THREE.SphereGeometry(r, 32, 24), m);
    o.position.set(...p); o.scale.set(...sc); o.rotation.y = ry; g.add(o); return o;
  };
  for (const s of S) {
    const ex = s * .37, ey = 8.8;
    const sp = surfaceAlong(head, [ex, ey, 0], [s * .28, 0, 1]);
    const ry = s * .3;
    sph(.2, white, [sp[0] - s * .02, ey, sp[2] - .07], [1, 1.12, .62], ry);
    sph(.135, iris, [sp[0] + s * .005, ey - .02, sp[2] + .02], [1, 1.1, .45], ry);
    sph(.075, pupil, [sp[0] + s * .008, ey - .02, sp[2] + .045], [1, 1.1, .4], ry);
    sph(.038, shine, [sp[0] + .05, ey + .055, sp[2] + .07], [1, 1, .5]);
    sph(.018, shine, [sp[0] - .035, ey - .07, sp[2] + .065], [1, 1, .5]);
    const bp = [-.19, 0, .19].map(d => surfaceAlong(head, [ex + s * d, ey + .27 + (d === 0 ? .035 : -.012 * (1 + s * d * 5)), 0], [s * .25, 0, 1]));
    const brow = new THREE.Mesh(tube(bp.map(p => [p[0] + s * .006, p[1], p[2] + .03] as V3), {r: t => .042 * (1 - .4 * Math.abs(t - .45)), seg: 16, radial: 10}), brown);
    g.add(brow);
    const cp = surfaceAlong(head, [s * .66, 8.4, 0], [s * .45, 0, 1]);
    sph(.18, blush, [cp[0], cp[1], cp[2] + .01], [1, .62, .25], s * .55);
  }
  const mp = [-.2, -.1, 0, .1, .2].map(x => surfaceAlong(head, [x, 8.27 - (.2 * .2 - x * x) * 2.2, 0], [x * .8, 0, 1]));
  g.add(new THREE.Mesh(tube(mp.map(p => [p[0] * 1.02, p[1], p[2] + .008] as V3), {r: t => .03 * (.5 + .5 * Math.sin(Math.PI * t)), seg: 24, radial: 10}), lip));
  return g;
}

/* where the main joints and landmarks are (used by the skeleton, muscles, vessels and nerves) */
export const LM = {
  shoulder: (s: number): V3 => [s * 1.1, 7.02, -.05], elbow: (s: number): V3 => [s * 1.4, 5.8, -.03], wrist: (s: number): V3 => [s * 1.62, 4.62, .08],
  hip: (s: number): V3 => [s * .44, 4.42, .02], knee: (s: number): V3 => [s * .5, 2.58, .03], ankle: (s: number): V3 => [s * .52, .5, -.06],
};
