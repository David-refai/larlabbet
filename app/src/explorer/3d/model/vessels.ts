/* Blood vessels and nerves of the whole body (body space, see body.ts).
   Vessels: red arteries carry blood out from the heart, blue veins bring it back. They start where
   the heart's own big vessels end (organs.ts), so the two layers join up: the aorta curves down
   in front of the spine and splits for the legs; the arch's three branches feed the neck, the head
   and the arms; the veins run beside them into the two venae cavae.
   Nerves: the spinal cord runs down inside the spine's canal and goes on up into the brainstem;
   nerves leave it between the vertebrae for the ribs, the arms and the legs.
   Simplified: only the main vessels and nerves are drawn. */
import * as THREE from "three";
import type {V3} from "../geo/sdf";
import {tube, merge} from "../geo/shapes";
import {once} from "../geo/cache";
import {COLORS, organ} from "../materials";
import {VESSELS, exterior} from "./heartShape";
import {mesh} from "../geo/sdf";
import {HEART_AT} from "./organs";
import {canalPoints, spineFrames, cordPath} from "./skeleton";

const S = [-1, 1] as const;

/* a point of the heart model in body space */
export function heartToBody(p: V3): V3 {
  const c = Math.cos(HEART_AT.rotY), s = Math.sin(HEART_AT.rotY), k = HEART_AT.scale;
  return [(p[0] * c + p[2] * s) * k + HEART_AT.pos.x, p[1] * k + HEART_AT.pos.y, (-p[0] * s + p[2] * c) * k + HEART_AT.pos.z];
}
const end = (id: string, i = -1): V3 => { const v = VESSELS.find(x => x.id === id)!; return heartToBody(v.pts.at(i)!); };

/* a vessel or nerve: a tube that thins from r0 to r1 */
const vt = (pts: V3[], r0: number, r1 = r0, radial = 10) =>
  tube(pts, {r: t => r0 + (r1 - r0) * t, seg: Math.max(12, Math.round(pts.length * 9)), radial});

/* the vessels are drawn a little thicker than life so they read at a glance */
const vv = (pts: V3[], r0: number, r1 = r0, radial = 10) => vt(pts, r0 * 1.25, r1 * 1.25, radial);

function arteries(): THREE.BufferGeometry[] {
  const g: THREE.BufferGeometry[] = [];
  /* the aorta goes on from the end of the heart's arch, down in front of the spine */
  const a0 = end("aorta", 5);
  g.push(vv([a0, [.2, 6.3, -.1], [.1, 6.0, -.22], [.09, 5.5, -.2], [.06, 5.0, -.15], [.03, 4.76, -.12]], .06, .045, 14));
  for (const s of S) {
    /* the leg: iliac, thigh, behind the knee, the shin, the foot */
    g.push(vv([[.03, 4.76, -.12], [s * .2, 4.58, -.08], [s * .34, 4.35, .04], [s * .4, 4.1, .14], [s * .43, 3.4, .06], [s * .48, 2.85, -.06], [s * .5, 2.55, -.13], [s * .51, 2.2, -.1], [s * .5, 1.5, -.1], [s * .47, .75, -.12], [s * .48, .45, -.08], [s * .5, .15, .12], [s * .5, .12, .45]], .035, .012));
    g.push(vv([[s * .5, 2.3, -.1], [s * .56, 2.15, 0], [s * .58, 1.5, .06], [s * .55, .7, .1], [s * .53, .35, .3], [s * .5, .26, .52]], .016, .009));
    /* the three branches of the arch: to the right (arm and neck), the left neck, the left arm */
    const arm = (from: V3, xs: number) => g.push(vv([from, [xs * .55, 7.12, .08], [xs * .9, 7.0, .02], [xs * 1.12, 6.75, .02], [xs * 1.26, 6.3, .05], [xs * 1.36, 5.85, .08],
      [xs * 1.47, 5.4, .12], [xs * 1.57, 4.88, .16], [xs * 1.64, 4.5, .2], [xs * 1.69, 4.3, .12], [xs * 1.71, 4.28, .02]], .026, .011));
    const neck = (from: V3, xs: number) => {
      g.push(vv([from, [xs * .14, 7.45, .1], [xs * .2, 7.85, .08], [xs * .24, 8.15, .04], [xs * .3, 8.45, -.02]], .028, .02));
      /* outside the skull: to the face and up the temple */
      g.push(vv([[xs * .24, 8.12, .05], [xs * .45, 8.25, .35], [xs * .55, 8.4, .62]], .014, .009));
      g.push(vv([[xs * .27, 8.3, .0], [xs * .7, 8.55, -.05], [xs * .98, 8.75, -.02], [xs * 1.0, 9.2, -.05]], .014, .009));
    };
    /* the ulnar artery and the arch in the palm */
    g.push(vv([[s * 1.38, 5.82, .08], [s * 1.46, 5.3, .02], [s * 1.56, 4.85, -.02], [s * 1.66, 4.45, .0], [s * 1.7, 4.25, .08], [s * 1.71, 4.26, .2]], .016, .01));
    if (s < 0) {
      const b = end("bct");
      g.push(vv([b, [-.1, 7.08, .17], [-.18, 7.12, .13]], .033, .03));
      arm([-.18, 7.12, .13], -1);
      neck([-.18, 7.12, .13], -1);
    } else {
      neck(end("lcca"), 1);
      arm(end("lsa"), 1);
    }
  }
  return g;
}

function veins(): THREE.BufferGeometry[] {
  const g: THREE.BufferGeometry[] = [];
  /* the lower vena cava: from the heart down beside the aorta (through the back of the liver) */
  const i0 = end("ivc", 0);
  g.push(vv([i0, [-.1, 5.55, -.08], [-.1, 5.1, -.14], [-.08, 4.8, -.12], [-.03, 4.68, -.08]], .058, .048, 14));
  /* the upper vena cava's two branches go on into the neck and the arms */
  const r0 = end("brv", 0), l0 = end("blv", 0);
  for (const s of S) {
    /* both brachiocephalic veins start where the neck vein and the arm vein meet (the left one
       crosses over in the heart model, in front of the arch's branches) */
    const start = s < 0 ? r0 : l0;
    const vx = (x: number) => s * Math.abs(x);
    /* the neck vein (jugular), outside the artery */
    g.push(vv([start, [vx(.24), 7.4, .14], [vx(.3), 7.85, .14], [vx(.34), 8.15, .1], [vx(.4), 8.45, .05]], .032, .022));
    /* the arm: under the collar bone, down the arm, into the back of the hand */
    g.push(vv([start, [vx(.5), 7.05, .14], [vx(.9), 6.93, .1], [vx(1.12), 6.72, .1], [vx(1.25), 6.3, .13], [vx(1.33), 5.85, .16],
      [vx(1.44), 5.4, .19], [vx(1.55), 4.88, .22], [vx(1.62), 4.55, .24], [vx(1.62), 4.35, .24]], .028, .012));
    g.push(vv([[vx(1.25), 6.4, -.02], [vx(1.34), 5.85, -.08], [vx(1.46), 5.35, -.1], [vx(1.57), 4.85, -.08], [vx(1.65), 4.5, -.06]], .018, .011));
    /* the leg: beside the artery, a little further in */
    g.push(vv([[-.03, 4.68, -.08], [vx(.16), 4.55, -.02], [vx(.29), 4.33, .08], [vx(.34), 4.1, .17], [vx(.37), 3.4, .1], [vx(.43), 2.85, -.02], [vx(.45), 2.55, -.1],
      [vx(.44), 2.2, -.16], [vx(.44), 1.5, -.16], [vx(.43), .8, -.1], [vx(.44), .45, -.02], [vx(.48), .26, .2], [vx(.48), .22, .45]], .04, .013));
    /* the long vein up the inside of the leg (just under the skin) */
    g.push(vv([[vx(.31), 4.2, .2], [vx(.3), 3.4, .12], [vx(.34), 2.6, -.05], [vx(.38), 1.6, -.02], [vx(.4), .7, .1], [vx(.42), .35, .32]], .016, .01));
  }
  return g;
}

export function buildVessels() {
  const g = new THREE.Group(); g.name = "vessels";
  const art = new THREE.Mesh(once("geo:arteries", () => merge(arteries())), organ(COLORS.artery, {roughness: .3, clearcoat: .7}));
  const vein = new THREE.Mesh(once("geo:veins", () => merge(veins())), organ(COLORS.vein, {roughness: .3, clearcoat: .7}));
  art.name = "arteries"; vein.name = "veins";
  g.add(art, vein);
  /* the heart's own big vessels and a faint outline of the heart, shown when the vessels are on but
     the organs are not (so the circuit is closed); the explorer fades this group on its own */
  const hv = new THREE.Group(); hv.name = "great-vessels"; hv.userData.ownFade = true;
  const hm = new THREE.Group();
  hm.position.copy(HEART_AT.pos); hm.scale.setScalar(HEART_AT.scale); hm.rotation.y = HEART_AT.rotY;
  const ghost = organ(COLORS.heart, {roughness: .4, clearcoat: .3, transparent: true, opacity: .32, depthWrite: false});
  ghost.userData.noDepth = true;
  hm.add(new THREE.Mesh(once("geo:heart:ext:b", () => mesh(exterior(), {h: .04})), ghost));
  const ha = organ(COLORS.artery, {roughness: .3, clearcoat: .7}), hvm = organ(COLORS.vein, {roughness: .3, clearcoat: .7});
  for (const v0 of VESSELS) {
    const v = v0.id === "aorta" ? {...v0, pts: v0.pts.slice(0, 6)} : v0;
    hm.add(new THREE.Mesh(once("geo:gv:" + v.id, () => tube(v.pts, {r: v.r, seg: 48, radial: 16})), v.kind === "artery" ? ha : hvm));
  }
  hv.add(hm); g.add(hv);
  return g;
}

/* ---------------- nerves ---------------- */
function nerveTubes(): THREE.BufferGeometry[] {
  const g: THREE.BufferGeometry[] = [];
  const cord = cordPath(), c = canalPoints(), F = spineFrames();
  g.push(tube(cord, {r: t => t < .03 ? .062 - t * .5 : t > .9 ? .046 * (1 - (t - .9) / .1 * .6) : .046 - .008 * t, seg: 140, radial: 14, caps: [false, true]}));
  /* the thin nerves below the end of the cord */
  for (const dx of [-.02, 0, .02]) g.push(vt(([c[20], c[21], c[22], c[23], [dx, 4.55, -.33]] as V3[]).map((p, i) => i ? [p[0] + dx, p[1], p[2]] as V3 : p), .012, .008, 6));
  for (const s of S) {
    /* a nerve under every rib (thin), leaving between the vertebrae */
    for (let i = 0; i < 11; i++) {
      const f = F[7 + i], p = c[7 + i], y = f.p.y - .07;
      const pts: V3[] = [[p[0] + s * .03, y, p[2]], [s * .2, y - .02, -.4]];
      for (let k = 1; k <= 6; k++) {
        const th = .25 + k * .38, rx = [.4, .56, .68, .76, .81, .84, .85, .84, .81, .77, .7][i] - .03;
        pts.push([s * (.05 + rx * Math.sin(th)), y - .04 - (1 - Math.cos(th)) * .12, -.04 - rx * .66 * Math.cos(th)]);
      }
      g.push(vt(pts, .011, .006, 6));
    }
    /* the arm's nerves: from the neck (the plexus) through the armpit, then the three long nerves */
    const plex = [3, 4, 5, 6].map(i => c[i]);
    const arm: V3 = [s * .98, 6.85, -.02];
    for (const p of plex) g.push(vt([[p[0] + s * .04, p[1], p[2]], [s * .45, (p[1] + 6.95) / 2, -.1], [s * .8, 6.95, -.06], arm], .016, .018, 8));
    /* median (front, down the middle), ulnar (inside, behind the elbow), radial (outside, behind) */
    g.push(vt([arm, [s * 1.18, 6.6, .02], [s * 1.28, 6.2, .06], [s * 1.36, 5.82, .04], [s * 1.47, 5.35, .08], [s * 1.58, 4.85, .1], [s * 1.67, 4.45, .14], [s * 1.73, 4.22, .2]], .02, .01, 8));
    g.push(vt([arm, [s * 1.14, 6.6, -.06], [s * 1.24, 6.2, -.1], [s * 1.31, 5.85, -.1], [s * 1.44, 5.38, -.06], [s * 1.57, 4.86, -.04], [s * 1.68, 4.45, -.02], [s * 1.73, 4.22, .0]], .017, .009, 8));
    g.push(vt([arm, [s * 1.2, 6.6, -.1], [s * 1.36, 6.25, -.14], [s * 1.46, 5.85, -.06], [s * 1.52, 5.38, .04], [s * 1.6, 4.86, .1], [s * 1.64, 4.52, .16]], .017, .009, 8));
    /* the leg's nerves from the lower back: the femoral (front of the thigh) and the big sciatic
       nerve (back of the thigh), which splits at the knee for the calf and the shin */
    const l0 = c[20], l1 = c[22];
    g.push(vt([[l0[0] + s * .04, l0[1], l0[2]], [s * .22, 4.75, -.15], [s * .33, 4.45, .05], [s * .4, 4.18, .2], [s * .45, 3.6, .2], [s * .48, 3.0, .18]], .018, .01, 8));
    g.push(vt([[l1[0] + s * .04, l1[1], l1[2]], [s * .2, 4.5, -.36], [s * .33, 4.25, -.33], [s * .46, 3.9, -.22], [s * .5, 3.3, -.18], [s * .5, 2.75, -.16]], .03, .026, 10));
    g.push(vt([[s * .5, 2.75, -.16], [s * .5, 2.45, -.16], [s * .5, 1.8, -.15], [s * .48, 1.1, -.12], [s * .46, .6, -.13], [s * .5, .2, .1], [s * .5, .14, .45]], .022, .01, 8));
    g.push(vt([[s * .5, 2.75, -.16], [s * .6, 2.5, -.12], [s * .66, 2.3, -.02], [s * .62, 1.6, .06], [s * .58, .8, .1], [s * .55, .38, .32], [s * .52, .3, .5]], .018, .009, 8));
  }
  return g;
}

export function buildNerves() {
  const g = new THREE.Group(); g.name = "nerves";
  const m = new THREE.Mesh(once("geo:nerves", () => merge(nerveTubes())), organ(COLORS.nerve, {roughness: .35, clearcoat: .6, sheen: .3, sheenColor: new THREE.Color("#fff3b0")}));
  m.name = "nerves";
  g.add(m);
  return g;
}
