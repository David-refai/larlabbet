/* Mode D, the brain (brain space, see brainShape.ts, shown larger where the brain sits). Two tabs:
     Delar     the cerebrum with two areas tinted (the front part we think and plan with, the back
               part that handles sight), the cerebellum, the brainstem and the spinal cord
     Signaler  a see-through brain; nerve signals (glowing dots) run from the brain down the
               brainstem and the spinal cord and out along nerves
   The areas are drawn as simple coloured regions: in a real brain they have no sharp borders. */
import * as THREE from "three";
import type {V3} from "../geo/sdf";
import {tube, curve, splitBy} from "../geo/shapes";
import {once} from "../geo/cache";
import {COLORS, organ} from "../materials";
import {hemisphere, cerebellum, brainstem, isFrontal, isOccipital, STEM} from "./brainShape";
import {BRAIN_AT} from "./organs";
import {partById} from "../registry";
import type {DetailModel, DetailView} from "./detail";

const S = [-1, 1] as const;
/* how much bigger than in the body */
const DS = 1.45;
const sstep = (a: number, b: number, x: number) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

/* the spinal cord below the brainstem (brain space) */
const CORD: V3[] = [STEM[STEM.length - 1], [0, -1.4, -.2], [0, -1.8, -.26], [0, -2.15, -.3]];

function tinted(s: number) {
  return once("geo:hemi:" + s + ":detail", () => {
    const g = hemisphere(s, 84, 1.1);
    const pos = g.attributes.position, col: number[] = [];
    const pink = new THREE.Color(COLORS.brain), front = new THREE.Color("#b993ea"), back = new THREE.Color("#7fb6f2");
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
      const wf = sstep(-.04, .04, z - (.04 + .42 * (.62 - y))), wo = sstep(-.04, .04, -.6 + .12 * y - z);
      const c = pink.clone().lerp(front, wf).lerp(back, wo);
      col.push(c.r, c.g, c.b);
    }
    g.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
    return g;
  });
}

export function buildBrainDetail(): DetailModel {
  const anchor = partById("brain-detail").anchor.position;
  const group = new THREE.Group(); group.name = "brain-detail";
  const inner = new THREE.Group();
  inner.position.set(BRAIN_AT.pos.x - anchor[0], BRAIN_AT.pos.y - anchor[1], BRAIN_AT.pos.z - anchor[2]);
  inner.scale.setScalar(BRAIN_AT.scale * DS);
  group.add(inner);
  const anchors: Record<string, THREE.Object3D> = {};
  const glowMap: Record<string, THREE.Object3D[]> = {};
  const pickables: THREE.Object3D[] = [];
  const tag = (o: THREE.Object3D, part: string, glowAs: string[] = [part]) => {
    o.userData.part = part; pickables.push(o);
    for (const g of glowAs) (glowMap[g] ??= []).push(o);
    return o;
  };
  const A = (id: string, p: V3) => { const o = new THREE.Object3D(); o.name = "anchor:" + id; o.position.set(...p); inner.add(o); anchors[id] = o; return o; };

  /* the cerebrum: each half split into the front area, the back area and the rest */
  const mats: THREE.MeshPhysicalMaterial[] = [];
  const mk = (color: string, o: THREE.MeshPhysicalMaterialParameters = {}) => { const m = organ(color, {roughness: .42, clearcoat: .5, sheen: .25, sheenColor: new THREE.Color("#ffe0e6"), ...o}); mats.push(m); return m; };
  for (const s of S) {
    const parts = splitBy(tinted(s), (x, y, z) => isFrontal(x, y, z) ? "f" : isOccipital(x, y, z) ? "o" : "r");
    for (const k in parts) {
      const m = new THREE.Mesh(parts[k], mk("#ffffff", {vertexColors: true}));
      if (k === "f") tag(m, "pannlob", ["pannlob", "storhjarna"]);
      else if (k === "o") tag(m, "syncentrum", ["syncentrum", "storhjarna"]);
      else tag(m, "storhjarna");
      inner.add(m);
    }
  }
  inner.add(tag(new THREE.Mesh(once("geo:cereb:detail", () => cerebellum(96, 1.2)), mk(COLORS.cerebellum)), "lillhjarna"));
  inner.add(tag(new THREE.Mesh(once("geo:stem", brainstem), mk(COLORS.stem)), "hjarnstam"));
  inner.add(tag(new THREE.Mesh(tube(CORD, {r: t => .075 - .02 * t, seg: 40, radial: 20, caps: [false, true]}), mk(COLORS.cord)), "ryggmarg"));

  /* nerve fibres and signals: from the top of the brain, inwards, down the brainstem and cord, out */
  const fibreM = organ(COLORS.nerve, {roughness: .35, clearcoat: .6, emissive: new THREE.Color("#7a5a00"), emissiveIntensity: .4});
  const routes: THREE.CatmullRomCurve3[] = [];
  const starts: [number, number, number][] = [[-.5, .5, .2], [-.3, .62, -.1], [.32, .6, .05], [.55, .42, -.2], [-.6, .3, -.35], [.2, .55, .35]];
  starts.forEach(([x, y, z], i) => {
    const out = i % 2 ? 1 : -1, lvl = -1.45 - (i % 3) * .2;
    routes.push(curve([[x, y, z], [x * .55, y * .45, z * .6], [x * .2, .02, -.05], [0, -.35, -.1], [0, -.8, -.14], [0, lvl + .05, -.22], [out * .2, lvl - .06, -.2], [out * .55, lvl - .18, -.12]], .5));
  });
  const fibres = new THREE.Group();
  for (const c of routes) fibres.add(new THREE.Mesh(tube(c, {r: .012, seg: 90, radial: 6}), fibreM));
  tag(fibres, "signaler");
  inner.add(fibres);
  const NP = 3 * routes.length;
  const core = new THREE.InstancedMesh(new THREE.SphereGeometry(.032, 12, 8), new THREE.MeshBasicMaterial({color: "#fff6b8"}), NP);
  const halo = new THREE.InstancedMesh(new THREE.SphereGeometry(.075, 12, 8), new THREE.MeshBasicMaterial({color: "#ffc531", transparent: true, opacity: .38, depthWrite: false, blending: THREE.AdditiveBlending}), NP);
  core.raycast = () => {}; halo.raycast = () => {};
  const pulses = new THREE.Group(); pulses.add(core, halo); inner.add(pulses);

  /* label points */
  A("storhjarna", [.62, .5, -.15]);
  A("pannlob", [.5, .3, .62]);
  A("syncentrum", [.42, .12, -.78]);
  A("lillhjarna", [.4, -.5, -.6]);
  A("hjarnstam", [.12, -.55, -.1]);
  A("ryggmarg", [.06, -1.7, -.24]);
  A("signaler", routes[3].getPointAt(.2).toArray() as V3);

  const m4 = new THREE.Matrix4(), v = new THREE.Vector3();
  let tab = "delar", time = 0;
  const sample: number[] = [];
  const place = () => {
    sample.length = 0;
    let n = 0;
    routes.forEach((c, i) => {
      for (let k = 0; k < 3; k++) {
        const u = ((k / 3 + i * .17 + time * .22) % 1 + 1) % 1;
        c.getPointAt(u, v);
        m4.makeTranslation(v.x, v.y, v.z); core.setMatrixAt(n, m4); halo.setMatrixAt(n, m4); n++;
        if (sample.length < 9) sample.push(v.x, v.y, v.z);
      }
    });
    core.instanceMatrix.needsUpdate = halo.instanceMatrix.needsUpdate = true;
    core.computeBoundingSphere(); halo.computeBoundingSphere();
  };
  place();

  const setTab = (t: string) => {
    tab = t;
    const see = t === "signal";
    for (const m of mats) {
      if (m.transparent !== see) { m.transparent = see; m.needsUpdate = true; }
      m.opacity = see ? .4 : 1; m.depthWrite = !see;
    }
    fibres.visible = pulses.visible = see;
  };
  setTab("delar");

  return {
    group, anchors, pickables,
    glowTargets: (part: string) => glowMap[part] ?? [],
    setTab,
    view(t: string): DetailView {
      const k = BRAIN_AT.scale * DS, o = inner.position;
      const c = (p: V3): V3 => [p[0] * k + o.x, p[1] * k + o.y, p[2] * k + o.z];
      if (t === "signal") return {target: c([0, -.55, -.1]), radius: 1.75 * k, az: 1.15, polar: 1.42};
      return {target: c([0, -.4, -.1]), radius: 1.55 * k, az: Math.PI / 2, polar: 1.45};
    },
    tick(_t, dt, play, still) {
      if (tab !== "signal" || still || !play) { if (still && time !== 0) { time = 0; place(); } return false; }
      time += Math.min(dt, .1);
      place();
      return true;
    },
    sample: () => sample.slice(),
  };
}
