/* Mode D, the heart (heart space, see heartShape.ts; seen from the front the right heart with its
   blue blood is on the viewer's left). Four tabs:
     Översikt   the whole heart with its big vessels (aorta with three branches, pulmonary trunk,
                both venae cavae, four pulmonary veins) and the small vessels on its surface
     Kammare    cut open from the front (a real cut through the wall): the four chambers with blue
                and red linings, the thick wall of the left ventricle, the septum
     Klaffar    a see-through heart with the four valves: tricuspid (3 leaflets), mitral (2),
                pulmonary and aortic (3 pockets each); they open and close with the beat
     Blodflöde  blue and red blood flowing along its paths, through the chambers and valves
   A gentle beat runs while flows are on (never under reduced motion). */
import * as THREE from "three";
import {half, intersect, mesh, surfaceAlong, type V3} from "../geo/sdf";
import {splitBy, curve} from "../geo/shapes";
import {once} from "../geo/cache";
import {COLORS, organ, withGlow} from "../materials";
import {CH, CH_AT, CHANNEL, VALVE, CUT, VESSELS, exterior, cavities, rightCavities, leftCavities, solid, flowPaths, septumAnchor} from "./heartShape";
import {heartModel} from "./organs";
import type {DetailModel, DetailView} from "./detail";

type Room = "ra" | "rv" | "la" | "lv";
const ROOMS: Room[] = ["ra", "rv", "la", "lv"];
const LABEL: Record<Room, string> = {ra: "hf", rv: "hk", la: "vf", lv: "vk"};
const right = (r: Room) => r === "ra" || r === "rv";

/* the chamber (or the passage, counted with its chamber) a point is nearest to */
const CH_ROOM: [Room, {f: (x: number, y: number, z: number) => number}][] = [
  ["ra", CH.ra], ["rv", CH.rv], ["la", CH.la], ["lv", CH.lv], ["ra", CHANNEL.tri], ["la", CHANNEL.mit], ["rv", CHANNEL.pulm], ["lv", CHANNEL.aort]];
function roomOf(x: number, y: number, z: number, passages = false): Room {
  let best: Room = "ra", d = Infinity;
  for (const [r, p] of passages ? CH_ROOM : CH_ROOM.slice(0, 4)) { const v = p.f(x, y, z); if (v < d) { d = v; best = r; } }
  return best;
}
/* the wall between the right and the left heart (the septum): solid wall close to both sides */
const sides = () => once("sdf:heart:sides", () => ({R: rightCavities(), L: leftCavities()}));
function isSeptum(x: number, y: number, z: number) {
  const {R, L} = sides(), r = R.f(x, y, z), l = L.f(x, y, z);
  return r > .005 && l > .005 && r < .16 && l < .16 && y < .2;
}
const sstep = (a: number, b: number, x: number) => { const k = Math.max(0, Math.min(1, (x - a) / (b - a))); return k * k * (3 - 2 * k); };

/* the heart cut open: wall colour outside, a lighter cut face, blue and red chamber linings.
   The colours blend over the distance to the cavities (no hard per-vertex switch, so no stair
   steps), and the wall between the two sides keeps the cut-face colour: the septum shows. */
function cutGeometry() {
  return once("geo:heart:cut", () => {
    const {R, L} = sides();
    const wall = new THREE.Color(COLORS.heart), face = new THREE.Color("#ee8a7f"), blue = new THREE.Color("#6286e0"), red = new THREE.Color("#d8384a");
    const c = new THREE.Color(), lin = new THREE.Color();
    return mesh(intersect(solid(), half([0, 0, 1], CUT), .012), {h: .016, color: (x, y, z) => {
      const r = R.f(x, y, z), l = L.f(x, y, z);
      /* the cut face, blending into the outer wall at its rim */
      c.copy(wall).lerp(face, 1 - sstep(.003, .022, Math.abs(z - CUT)));
      /* the lining of the nearest cavity: blue on the right, red on the left */
      lin.copy(blue).lerp(red, sstep(-.025, .025, r - l));
      c.lerp(lin, 1 - sstep(.01, .032, Math.min(r, l)));
      return [c.r, c.g, c.b];
    }});
  });
}
/* a point on the back wall of a chamber, straight behind p on the cut (for its label) */
function backWall(p: V3): V3 {
  const cav = cavities();
  let z = CUT;
  while (z > -1.2 && cav.f(p[0], p[1], z) < 0) z -= .005;
  return [p[0], p[1], z + .012];
}

/* one valve: n leaflets in a ring; open = 0 (closed, meeting in the middle) .. 1 (pushed open) */
interface Valve {group: THREE.Group; set(open: number): void}
function valve(at: V3, dir: V3, r: number, n: number, chords: boolean): Valve {
  const g = new THREE.Group();
  const d = new THREE.Vector3(...dir).normalize();
  const e1 = new THREE.Vector3(1, 0, 0).addScaledVector(d, -d.x).normalize(), e2 = new THREE.Vector3().crossVectors(d, e1);
  const c = new THREE.Vector3(...at);
  const U = 12, Vn = 9;
  const leafM = organ("#f6e7d4", {roughness: .4, clearcoat: .6, side: THREE.DoubleSide, sheen: .3});
  const leaves: THREE.BufferGeometry[] = [];
  for (let j = 0; j < n; j++) {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array((U + 1) * (Vn + 1) * 3), 3));
    const idx: number[] = [];
    for (let v = 0; v < Vn; v++) for (let u = 0; u < U; u++) { const a = v * (U + 1) + u; idx.push(a, a + 1, a + U + 1, a + 1, a + U + 2, a + U + 1); }
    geo.setIndex(idx);
    leaves.push(geo);
    g.add(new THREE.Mesh(geo, leafM));
  }
  /* the ring the leaflets hang from */
  const ring = new THREE.Mesh(new THREE.TorusGeometry(r, .024, 10, 40), organ("#f0d2b4", {roughness: .45, clearcoat: .4}));
  ring.position.copy(c); ring.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), d); g.add(ring);
  /* the heart strings (chordae) from the leaflets down to two small muscles */
  const chordGeo = new THREE.BufferGeometry();
  chordGeo.setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array(n * 3 * 2 * 3), 3));
  if (chords) {
    g.add(new THREE.LineSegments(chordGeo, new THREE.LineBasicMaterial({color: "#fff6ea", transparent: true, opacity: .9})));
    for (const k of [-1, 1]) {
      const pm = new THREE.Mesh(new THREE.SphereGeometry(.04, 14, 10), organ("#d23a3c", {roughness: .4}));
      pm.position.copy(c).addScaledVector(d, r * 2.6).addScaledVector(e1, k * r * .55); pm.scale.set(1, 1.6, 1); pm.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d);
      g.add(pm);
    }
  }
  const p = new THREE.Vector3();
  const point = (j: number, u: number, v: number, open: number) => {
    const span = Math.PI * 2 / n, gap = .09;
    const phi = j * span + gap + u * (span - 2 * gap) + .3;
    const rad = e1.clone().multiplyScalar(Math.cos(phi)).addScaledVector(e2, Math.sin(phi));
    const rho = r * ((1 - v * .97) * (1 - open) + (1 - v * .3) * open);
    const ax = (-r * .25 * Math.sin(Math.PI * u) * v * (1 - .5 * v)) * (1 - open) + r * 1.15 * v * open;
    return p.copy(c).addScaledVector(rad, rho).addScaledVector(d, ax);
  };
  const set = (open: number) => {
    leaves.forEach((geo, j) => {
      const a = geo.attributes.position as THREE.BufferAttribute;
      for (let v = 0; v <= Vn; v++) for (let u = 0; u <= U; u++) { const q = point(j, u / U, v / Vn, open); a.setXYZ(v * (U + 1) + u, q.x, q.y, q.z); }
      a.needsUpdate = true; geo.computeVertexNormals(); geo.computeBoundingSphere();
    });
    if (chords) {
      const a = chordGeo.attributes.position as THREE.BufferAttribute;
      let i = 0;
      for (let j = 0; j < n; j++) for (const u of [.3, .5, .7]) {
        const q = point(j, u, .85, open), k = Math.cos(j * Math.PI * 2 / n + .3 + u) > 0 ? 1 : -1;
        const m = c.clone().addScaledVector(d, r * 2.45).addScaledVector(e1, k * r * .55);
        a.setXYZ(i++, q.x, q.y, q.z); a.setXYZ(i++, m.x, m.y, m.z);
      }
      a.needsUpdate = true; chordGeo.computeBoundingSphere();
    }
  };
  set(0);
  return {group: g, set};
}

export function buildHeartDetail(): DetailModel {
  const group = new THREE.Group(); group.name = "heart-detail";
  const beat = new THREE.Group(); group.add(beat);
  const anchors: Record<string, THREE.Object3D> = {};
  const glowMap: Record<string, Record<string, THREE.Object3D[]>> = {oversikt: {}, kammare: {}, klaffar: {}, flode: {}};
  const pickables: THREE.Object3D[] = [];
  const tag = (o: THREE.Object3D, part: string) => { o.userData.part = part; pickables.push(o); return o; };

  /* the outside, split into the four chambers so each can glow; the vessels; the small surface vessels */
  const hm = heartModel({vesselEnds: "open", detail: true});
  const wallMesh = hm.group.getObjectByName("heart-wall") as THREE.Mesh;
  hm.group.remove(wallMesh);
  const outer = new THREE.Group(); outer.name = "outside";
  const regions = splitBy(wallMesh.geometry, roomOf);
  const outerMeshes: THREE.Mesh[] = [];
  for (const r of ROOMS) if (regions[r]) {
    const m = new THREE.Mesh(regions[r], organ(COLORS.heart, {roughness: .34, clearcoat: .6, clearcoatRoughness: .25, sheen: .4, sheenColor: new THREE.Color("#ffb3a8")}));
    tag(m, LABEL[r]); outer.add(m); outerMeshes.push(m);
    (glowMap.oversikt[LABEL[r]] ??= []).push(m);
  }
  const vessels: THREE.Mesh[] = [], coronary: THREE.Mesh[] = [];
  for (const o of [...hm.group.children]) {
    const m = o as THREE.Mesh;
    if (m.name === "coronary") coronary.push(m); else if (m.userData.part) { vessels.push(m); tag(m, m.userData.part); (glowMap.oversikt[m.userData.part] ??= []).push(m); }
    beat.add(m);
  }
  beat.add(outer);
  /* the vessel materials are shared per kind: make each its own, so tabs can clip or fade them */
  for (const m of [...vessels, ...coronary]) m.material = withGlow((m.material as THREE.Material).clone());

  /* the cut-open heart (Kammare): chambers and the septum can glow */
  const cutG = new THREE.Group(); cutG.name = "cut";
  const cutParts = splitBy(cutGeometry(), (x, y, z) => isSeptum(x, y, z) ? "septum" : roomOf(x, y, z));
  for (const k in cutParts) {
    const m = new THREE.Mesh(cutParts[k], organ("#ffffff", {vertexColors: true, roughness: .42, clearcoat: .45, sheen: .2}));
    const part = k === "septum" ? "skiljevagg" : LABEL[k as Room];
    tag(m, part); cutG.add(m); (glowMap.kammare[part] ??= []).push(m);
  }
  beat.add(cutG);

  /* the chambers as coloured see-through rooms (Klaffar, Blodflöde) */
  const rooms = new THREE.Group(); rooms.name = "rooms";
  for (const r of ROOMS) {
    const m = new THREE.Mesh(once("geo:heart:room:" + r, () => mesh(CH[r], {h: .03})),
      organ(right(r) ? "#5b80e2" : "#e04450", {roughness: .3, clearcoat: .5, transparent: true, opacity: .34, depthWrite: false}));
    rooms.add(m);
    (glowMap.flode[right(r) ? "f-blue" : "f-red"] ??= []).push(m);
  }
  beat.add(rooms);

  /* the four valves */
  const valves = new THREE.Group(); valves.name = "valves";
  const V = {
    tri: valve(VALVE.tri.at, VALVE.tri.dir, VALVE.tri.r, 3, true), mit: valve(VALVE.mit.at, VALVE.mit.dir, VALVE.mit.r, 2, true),
    pulm: valve(VALVE.pulm.at, VALVE.pulm.dir, VALVE.pulm.r * .92, 3, false), aort: valve(VALVE.aort.at, VALVE.aort.dir, VALVE.aort.r * .92, 3, false),
  };
  const vpart = {tri: "k-tri", mit: "k-mitral", pulm: "k-pulm", aort: "k-aorta"} as const;
  for (const k of Object.keys(V) as (keyof typeof V)[]) {
    V[k].group.traverse(o => { if ((o as THREE.Mesh).isMesh) o.userData.part = vpart[k]; });
    pickables.push(V[k].group); valves.add(V[k].group); glowMap.klaffar[vpart[k]] = [V[k].group];
  }
  beat.add(valves);

  /* blood: blue and red drops along the paths */
  const paths = flowPaths();
  const PER = 24, drop = new THREE.SphereGeometry(.034, 12, 8);
  const blueI = new THREE.InstancedMesh(drop, new THREE.MeshStandardMaterial({color: "#3f74ff", emissive: "#1f4fd8", emissiveIntensity: .7, roughness: .3}), PER * 2);
  const redI = new THREE.InstancedMesh(drop, new THREE.MeshStandardMaterial({color: "#ff3346", emissive: "#d01828", emissiveIntensity: .7, roughness: .3}), PER * 3);
  blueI.raycast = () => {}; redI.raycast = () => {};
  const flows = paths.map((p, i) => ({...p, len: p.c.getLength(), seed: i * .137}));
  const drops = new THREE.Group(); drops.name = "blood"; drops.add(blueI, redI); beat.add(drops);
  let flowT = 0;
  const mtx = new THREE.Matrix4(), tmp = new THREE.Vector3();
  const sampleAt: number[] = [];
  const placeDrops = () => {
    let bi = 0, ri = 0;
    sampleAt.length = 0;
    flows.forEach(f => {
      const im = f.kind === "vein" ? blueI : redI;
      for (let k = 0; k < PER; k++) {
        const u = ((k / PER + flowT * .32 / f.len + f.seed) % 1 + 1) % 1;
        f.c.getPointAt(u, tmp);
        const sc = .8 + .35 * Math.sin(Math.PI * Math.min(1, u * 8)) * Math.sin(Math.PI * Math.min(1, (1 - u) * 8));
        mtx.makeScale(sc, sc, sc).setPosition(tmp);
        im.setMatrixAt(f.kind === "vein" ? bi++ : ri++, mtx);
        if (sampleAt.length < 9) sampleAt.push(tmp.x, tmp.y, tmp.z);
      }
    });
    blueI.instanceMatrix.needsUpdate = true; redI.instanceMatrix.needsUpdate = true;
    blueI.computeBoundingSphere(); redI.computeBoundingSphere();
  };
  placeDrops();

  /* label points */
  const ext = exterior();
  const A = (id: string) => (anchors[id] ??= Object.assign(new THREE.Object3D(), {name: "anchor:" + id}));
  for (const id of ["hf", "hk", "vf", "vk", "aorta", "lungartar", "halvener", "lungvener", "skiljevagg", "k-tri", "k-pulm", "k-mitral", "k-aorta", "f-blue", "f-red"]) beat.add(A(id));
  const FACING: Record<string, V3> = {};
  const onFront = (id: string, x: number, y: number, dx = 0): V3 => { FACING[id] = [dx, 0, 1]; return surfaceAlong(ext, [x, y, -.1], [dx, 0, 1], 3); };
  /* a point on a vessel's wall, on the side facing dir */
  const onVessel = (id: string, vid: string, t: number, dir: V3): V3 => {
    const v = VESSELS.find(x => x.id === vid)!, p = curve(v.pts, .5).getPointAt(t), d = new THREE.Vector3(...dir).normalize();
    FACING[id] = [d.x, d.y, d.z];
    return [p.x + d.x * (v.r + .004), p.y + d.y * (v.r + .004), p.z + d.z * (v.r + .004)];
  };
  const at = (p: V3): V3 => [p[0], p[1], CUT];
  const AT: Record<string, Record<string, V3>> = {
    oversikt: {hf: onFront("hf", -.72, .3, -.4), hk: onFront("hk", -.26, -.4), vf: onFront("vf", .7, .56, .3), vk: onFront("vk", .52, -.6, .3),
      aorta: onVessel("aorta", "aorta", .36, [0, .5, 1]), lungartar: onVessel("lungartar", "lpa", .6, [0, .2, 1]),
      halvener: onVessel("halvener", "svc", .35, [0, 0, 1]), lungvener: onVessel("lungvener", "lspv", .15, [.2, .3, 1])},
    /* the chambers' labels sit on their back walls, the septum's on the cut wall between the ventricles */
    kammare: {hf: backWall(at(CH_AT.ra)), hk: backWall([-.3, -.36, CUT]), vf: backWall([.42, .58, CUT]), vk: backWall([.44, -.5, CUT]), skiljevagg: septumAnchor()},
    klaffar: {"k-tri": VALVE.tri.at, "k-pulm": VALVE.pulm.at, "k-mitral": VALVE.mit.at, "k-aorta": VALVE.aort.at},
    flode: {"f-blue": [-.66, .32, -.08], "f-red": [.4, -.42, -.12]},
  };
  /* the overview's second label points, on the back: used when the heart is turned round */
  const BACK: Record<string, [V3, V3]> = {};
  const onBack = (id: string, x: number, y: number, dx = 0) => { BACK[id] = [surfaceAlong(ext, [x, y, -.1], [dx, 0, -1], 3), [dx, 0, -1]]; };
  const onVesselBack = (id: string, vid: string, t: number, dir: V3) => {
    const keep = FACING[id], p = onVessel(id, vid, t, dir); BACK[id] = [p, FACING[id]]; FACING[id] = keep;
  };
  onBack("hf", -.74, .3, -.5); onBack("vf", .46, .6, .2); onBack("vk", .5, -.5, .4);
  onVesselBack("aorta", "aorta", .62, [.2, 0, -1]); onVesselBack("halvener", "ivc", .5, [-.3, 0, -1]);
  onVesselBack("lungvener", "rspv", .45, [0, .3, -1]); onVesselBack("lungartar", "rpa", .55, [0, .4, -1]);
  for (const id in BACK) {
    const b = Object.assign(new THREE.Object3D(), {name: "anchor:" + id + ":back"});
    b.position.set(...BACK[id][0]); b.userData.facing = BACK[id][1];
    beat.add(b); anchors[id].userData.alts = [b];
  }
  /* which way each label point faces (for hiding the ones turned away from the camera) */
  const FACE_CUT: V3 = [0, 0, 1];

  /* one clipping plane for the vessels in the cut view, in world space (updated every frame) */
  const local = new THREE.Plane(new THREE.Vector3(0, 0, -1), CUT), plane = new THREE.Plane();
  const ghost = (m: THREE.Mesh, on: boolean, op = .2) => {
    const mat = m.material as THREE.MeshPhysicalMaterial;
    if (mat.transparent !== on) { mat.transparent = on; mat.needsUpdate = true; }
    mat.opacity = on ? op : 1; mat.depthWrite = !on;
  };
  const clip = (m: THREE.Mesh, on: boolean) => {
    const mat = m.material as THREE.Material;
    mat.clippingPlanes = on ? [plane] : null; mat.needsUpdate = true;
  };
  const FRONT = new Set(["pt", "lpa", "rpa", "blv"]);
  let tab = "oversikt";
  const setTab = (t: string) => {
    tab = t;
    const seeThrough = t === "klaffar" || t === "flode";
    outer.visible = t !== "kammare";
    for (const m of outerMeshes) ghost(m, seeThrough, t === "flode" ? .16 : .2);
    /* in the cut view the vessels are cut too; the ones that lie in front of the cut (the pulmonary
       trunk, its arteries, the left brachiocephalic vein) would only float there: they are left out */
    for (const m of vessels) { ghost(m, seeThrough, t === "klaffar" ? .12 : .3); clip(m, t === "kammare"); m.visible = !(t === "kammare" && FRONT.has(m.name)); }
    for (const m of coronary) { m.visible = !seeThrough; clip(m, t === "kammare"); }
    cutG.visible = t === "kammare";
    rooms.visible = seeThrough;
    valves.visible = seeThrough;
    drops.visible = t === "flode";
    for (const id in anchors) {
      const p = AT[t]?.[id]; anchors[id].visible = !!p; if (p) anchors[id].position.set(...p);
      anchors[id].userData.facing = t === "kammare" ? FACE_CUT : t === "oversikt" ? FACING[id] : undefined;
      for (const b of (anchors[id].userData.alts as THREE.Object3D[] | undefined) ?? []) b.visible = t === "oversikt";
    }
  };
  setTab("oversikt");

  let phase = .6;
  const sstep = (a: number, b: number, x: number) => { const k = Math.max(0, Math.min(1, (x - a) / (b - a))); return k * k * (3 - 2 * k); };
  const setValves = (ph: number) => {
    /* the ventricles squeeze (systole): the inlet valves shut, the outlet valves open */
    const sys = sstep(.05, .14, ph) * (1 - sstep(.42, .52, ph));
    V.tri.set(1 - sys); V.mit.set(1 - sys); V.pulm.set(sys); V.aort.set(sys);
  };
  setValves(phase);

  return {
    group, anchors, pickables,
    glowTargets: (part: string) => glowMap[tab]?.[part] ?? [],
    setTab,
    view(t: string): DetailView {
      if (t === "kammare") return {target: [-.1, .02, -.05], radius: 1.18, az: 0, polar: 1.52};
      if (t === "klaffar") return {target: [-.08, .24, -.02], radius: 1.05, az: -.2, polar: 1.0};
      return {target: [0, .52, -.18], radius: 1.78, az: 0, polar: 1.45};
    },
    tick(_time, dt, play, still) {
      group.updateWorldMatrix(true, false);
      plane.copy(local).applyMatrix4(group.matrixWorld);
      if (still || !play) {
        beat.scale.setScalar(1);
        if (still) { setValves(.6); if (flowT !== 0) { flowT = 0; placeDrops(); } }
        return false;
      }
      phase = (phase + Math.min(dt, .1) * 1.1) % 1;
      /* a soft squeeze, strongest in the ventricles' beat */
      const sq = Math.exp(-Math.pow((phase - .22) / .11, 2));
      beat.scale.setScalar(1 - .022 * sq);
      setValves(phase);
      if (tab === "flode") { flowT += Math.min(dt, .1) * (.7 + .9 * sq); placeDrops(); }
      return true;
    },
    sample: () => sampleAt.slice(),
  };
}
