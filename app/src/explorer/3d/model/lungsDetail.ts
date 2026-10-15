/* Mode D, the lungs (body space, moved so the detail anchor is the origin). Three tabs:
     Luftvägar   see-through lungs (right: three lobes, left: two and the notch for the heart) with
                 the airways inside: the windpipe with its rings, the two bronchi and their branches
     Lungblåsor  a close-up of a bunch of air sacs at the end of a small airway, wrapped in tiny
                 blood vessels (blue blood in, red blood out); oxygen goes into the blood, carbon
                 dioxide comes out
     Luftflöde   the lungs breathe; air flows down the airways and back out
   The airways are pale and ringed, never red or blue. */
import * as THREE from "three";
import {mesh, type V3} from "../geo/sdf";
import {tube, curve, merge, rng} from "../geo/shapes";
import {once} from "../geo/cache";
import {COLORS, organ} from "../materials";
import {lungShape, bronchialTree, BRONCHI, TRACHEA, type Branch} from "./lungShape";
import {airways} from "./organs";
import {partById} from "../registry";
import type {DetailModel, DetailView} from "./detail";

const S = [-1, 1] as const;
/* the close-up sits to the side of the left lung, joined to it by a thin line */
const SAC: V3 = [1.62, -.42, .35];
const SAC_FROM: V3 = [.62, -.25, .12];

export function buildLungsDetail(): DetailModel {
  const anchor = partById("lungs-detail").anchor.position;
  const group = new THREE.Group(); group.name = "lungs-detail";
  const body = new THREE.Group(); body.position.set(-anchor[0], -anchor[1], -anchor[2]); group.add(body);
  /* the breathing part scales round the middle of the lungs */
  const breath = new THREE.Group(); group.add(breath);
  const inner = new THREE.Group(); inner.position.copy(body.position); breath.add(inner);
  const anchors: Record<string, THREE.Object3D> = {};
  const glowMap: Record<string, THREE.Object3D[]> = {};
  const pickables: THREE.Object3D[] = [];
  const tag = (o: THREE.Object3D, part: string) => { o.traverse(n => { n.userData.part = part; }); pickables.push(o); (glowMap[part] ??= []).push(o); return o; };
  const A = (id: string, p: V3, parent: THREE.Object3D = body) => { const o = new THREE.Object3D(); o.name = "anchor:" + id; o.position.set(...p); parent.add(o); anchors[id] = o; return o; };

  /* the lungs, see-through */
  const lungMats: THREE.MeshPhysicalMaterial[] = [];
  const lungs = new THREE.Group();
  for (const s of S) {
    const m = organ(COLORS.lung, {roughness: .4, clearcoat: .5, sheen: .3, sheenColor: new THREE.Color("#ffe1e6"), transparent: true, opacity: .3, depthWrite: false});
    lungMats.push(m);
    const lm = new THREE.Mesh(once("geo:lung:" + s, () => mesh(lungShape(s), {h: .026})), m);
    lm.renderOrder = 2;
    lungs.add(tag(lm, s < 0 ? "hlunga" : "vlunga"));
  }
  inner.add(lungs);

  /* the airways: windpipe, bronchi, and the tree of smaller airways */
  const aw = organ(COLORS.airway, {roughness: .45, clearcoat: .35, sheen: .3});
  const big = airways(aw);
  for (const o of [...big.children]) tag(o, o.name === "bronchus" ? "luftror" : "luftstrupe");
  inner.add(big);
  const tree = once("lungs:tree", () => {
    const L = S.map(s => lungShape(s));
    return bronchialTree(rng(7), (s, p) => L[s < 0 ? 0 : 1].f(p[0], p[1], p[2]) < -.03);
  });
  const treeGeo = once("geo:lungs:tree", () => merge(tree.map(b => tube(b.pts, {r: t => b.r * (1 - .25 * t), seg: 8, radial: b.depth > 3 ? 6 : 10, caps: [false, true]}))));
  const small = tag(new THREE.Mesh(treeGeo, organ(COLORS.airway, {roughness: .45, clearcoat: .35, sheen: .3})), "smaror");
  inner.add(small);

  /* labels on the airways and lungs */
  A("luftstrupe", [TRACHEA[1][0] + .02, TRACHEA[1][1], TRACHEA[1][2] + .06], inner);
  A("luftror", BRONCHI[1][1], inner);
  const deep = tree.filter(b => b.depth === 3 && b.pts[2][0] < -.3).sort((a, b) => a.pts[2][1] - b.pts[2][1])[0] ?? tree[tree.length - 1];
  A("smaror", deep.pts[2], inner);
  A("hlunga", [-.86, 6.3, .2], inner);
  A("vlunga", [.84, 6.4, .2], inner);

  /* ---------- the close-up of the air sacs ---------- */
  const sac = new THREE.Group(); sac.position.set(SAC[0] + anchor[0], SAC[1] + anchor[1], SAC[2] + anchor[2]); body.add(sac);
  const R = rng(11);
  /* the small airway that ends in the bunch */
  const duct: V3[] = [[-.62, .5, -.1], [-.36, .3, -.04], [-.16, .12, 0], [0, 0, 0]];
  sac.add(tag(new THREE.Mesh(tube(duct, {r: t => .07 - .02 * t, seg: 30, radial: 16}), aw), "smaror"));
  const sacs: {c: THREE.Vector3; r: number}[] = [];
  const dirs: V3[] = [[0, 0, 0], [.2, -.05, .12], [-.04, -.2, .12], [.16, -.22, -.06], [.04, .1, .2], [.26, .12, -.04], [-.1, -.1, -.18], [.1, -.4, .05],
    [.32, -.18, .16], [-.18, -.3, -.02], [.18, .04, -.22], [.36, -.02, .02], [.0, -.18, .3], [.22, -.42, -.16], [-.06, .08, -.06]];
  const sacM = organ("#f7a8b6", {roughness: .32, clearcoat: .7, sheen: .5, sheenColor: new THREE.Color("#ffe3ea"), transparent: true, opacity: .62, depthWrite: false});
  const sacGroup = new THREE.Group();
  for (const d of dirs) {
    const c = new THREE.Vector3(d[0] * 1.25 + .12, d[1] * 1.25 - .1, d[2] * 1.25);
    const r = .11 + R() * .04;
    sacs.push({c, r});
    const m = new THREE.Mesh(new THREE.SphereGeometry(r, 28, 20), sacM);
    m.position.copy(c); sacGroup.add(m);
  }
  sac.add(tag(sacGroup, "lungblasor"));
  /* tiny blood vessels over the sacs: blue where the blood comes in, red where it leaves */
  const capCols: THREE.BufferGeometry[] = [];
  const blue = new THREE.Color(COLORS.vein), red = new THREE.Color(COLORS.artery);
  const capPaths: THREE.CatmullRomCurve3[] = [];
  sacs.forEach((s, i) => {
    for (let k = 0; k < 3; k++) {
      const a = R() * Math.PI * 2, tilt = (R() - .5) * 1.6, rr = s.r + .012;
      const pts: V3[] = [];
      for (let j = 0; j <= 8; j++) {
        const t = -1.2 + j * .3, v = new THREE.Vector3(Math.cos(t) * Math.cos(a), Math.sin(t), Math.cos(t) * Math.sin(a));
        v.applyAxisAngle(new THREE.Vector3(1, 0, 0), tilt).multiplyScalar(rr).add(s.c);
        pts.push([v.x, v.y, v.z]);
      }
      const c = curve(pts);
      if (i < 6 && k === 0) capPaths.push(c);
      const g = tube(c, {r: .0085, seg: 36, radial: 6});
      /* blue on the side where the blood comes in, red where it leaves */
      const pos = g.attributes.position, col: number[] = [];
      for (let q = 0; q < pos.count; q++) { const t = Math.max(0, Math.min(1, (pos.getX(q) + pos.getY(q) * .5 + .2) / .9)); const cc = blue.clone().lerp(red, t * t * (3 - 2 * t)); col.push(cc.r, cc.g, cc.b); }
      g.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
      g.deleteAttribute("uv");
      capCols.push(g);
    }
  });
  /* merge keeps position and normal only: carry the colours along by hand */
  const capGeo = (() => {
    const pos: number[] = [], nor: number[] = [], col: number[] = [], idx: number[] = [];
    let off = 0;
    for (const g of capCols) {
      const p = g.attributes.position, n = g.attributes.normal, c = g.attributes.color;
      for (let i = 0; i < p.count; i++) { pos.push(p.getX(i), p.getY(i), p.getZ(i)); nor.push(n.getX(i), n.getY(i), n.getZ(i)); col.push(c.getX(i), c.getY(i), c.getZ(i)); }
      for (let i = 0; i < g.index!.count; i++) idx.push(g.index!.getX(i) + off);
      off += p.count; g.dispose();
    }
    const m = new THREE.BufferGeometry();
    m.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); m.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3));
    m.setAttribute("color", new THREE.Float32BufferAttribute(col, 3)); m.setIndex(idx);
    return m;
  })();
  const caps = new THREE.Group();
  caps.add(new THREE.Mesh(capGeo, organ("#ffffff", {vertexColors: true, roughness: .3, clearcoat: .6})));
  /* the small vessel bringing blue blood in, the one taking red blood away */
  caps.add(new THREE.Mesh(tube([[-.62, -.7, .2], [-.3, -.62, .22], [-.08, -.5, .2], [.08, -.36, .16]], {r: t => .032 - .012 * t, seg: 30, radial: 10}), organ(COLORS.vein, {roughness: .3, clearcoat: .6})));
  caps.add(new THREE.Mesh(tube([[.36, .2, -.12], [.55, .36, -.16], [.8, .5, -.2], [1.0, .56, -.2]], {r: t => .02 + .012 * t, seg: 30, radial: 10}), organ(COLORS.artery, {roughness: .3, clearcoat: .6})));
  /* thin vessels: they do not hide the labels of the gases behind them */
  caps.traverse(o => { o.userData.noOcclude = true; });
  sac.add(tag(caps, "kapillarer"));
  /* the thin line from the lung to the close-up, and a soft ring round it */
  const from = new THREE.Vector3(...SAC_FROM).add(new THREE.Vector3(...anchor)), to = sac.position.clone().add(new THREE.Vector3(-.5, .3, -.05));
  const zoom = new THREE.Group();
  const line = new THREE.Mesh(tube([from.toArray() as V3, to.toArray() as V3], {r: .008, seg: 4, radial: 6}), new THREE.MeshBasicMaterial({color: "#9fe7ff", transparent: true, opacity: .7}));
  const dot = new THREE.Mesh(new THREE.SphereGeometry(.05, 16, 12), new THREE.MeshBasicMaterial({color: "#9fe7ff"}));
  dot.position.copy(from);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(.78, .01, 8, 80), new THREE.MeshBasicMaterial({color: "#9fe7ff", transparent: true, opacity: .55}));
  ring.position.copy(sac.position).add(new THREE.Vector3(.08, -.12, 0));
  for (const o of [line, dot, ring]) o.raycast = () => {};
  zoom.add(line, dot, ring); body.add(zoom);

  /* oxygen (blue) from the air into the blood, carbon dioxide (grey) from the blood into the air */
  const NG = 18, gas = new THREE.SphereGeometry(.036, 14, 10);
  const o2 = new THREE.InstancedMesh(gas, new THREE.MeshStandardMaterial({color: "#55d4ff", emissive: "#25a9e0", emissiveIntensity: .9, roughness: .3}), NG);
  const co2 = new THREE.InstancedMesh(gas, new THREE.MeshStandardMaterial({color: "#9aa3b5", emissive: "#59627a", emissiveIntensity: .5, roughness: .4}), NG);
  o2.raycast = () => {}; co2.raycast = () => {};
  sac.add(o2, co2);
  const gasPath = (i: number, inward: boolean) => {
    /* down the duct, into a sac, through its wall into a blood vessel (oxygen); the reverse (carbon dioxide) */
    const s = sacs[(i * 5 + (inward ? 0 : 3)) % sacs.length], cap = capPaths[i % capPaths.length];
    const wall = cap.getPointAt(.5);
    const pts = [new THREE.Vector3(...duct[0]), new THREE.Vector3(...duct[2]), s.c.clone(), s.c.clone().lerp(wall, .6), wall, cap.getPointAt(inward ? .9 : .1)];
    if (!inward) pts.reverse();
    return new THREE.CatmullRomCurve3(pts);
  };
  const gasPaths = {o2: Array.from({length: NG}, (_, i) => gasPath(i, true)), co2: Array.from({length: NG}, (_, i) => gasPath(i, false))};
  /* the oxygen label on a path in front, away from the small airway (which would hide it) */
  const o2At = gasPaths.o2.map(c => c.getPointAt(.62)).sort((a, b) => (b.z + .25 * b.x) - (a.z + .25 * a.x))[0];
  A("syre", o2At.toArray() as V3, sac);
  A("koldioxid", gasPaths.co2[1].getPointAt(.55).toArray() as V3, sac);
  A("lungblasor", sacs[4].c.clone().add(new THREE.Vector3(0, sacs[4].r * .8, sacs[4].r * .5)).toArray() as V3, sac);
  A("kapillarer", capPaths[2].getPointAt(.3).toArray() as V3, sac);

  /* ---------- air flowing in and out ---------- */
  const leaves = tree.filter(b => b.depth >= 4);
  const route = (b: Branch): THREE.CatmullRomCurve3 => {
    /* from the throat down to this branch: walk back up the tree */
    const chain: V3[] = [b.pts[2], b.pts[0]];
    let cur = b;
    for (let guard = 0; guard < 8; guard++) {
      const parent = tree.find(p => Math.hypot(p.pts[2][0] - cur.pts[0][0], p.pts[2][1] - cur.pts[0][1], p.pts[2][2] - cur.pts[0][2]) < 1e-6);
      if (!parent) break;
      chain.push(parent.pts[0]); cur = parent;
    }
    const s = cur.pts[0][0] < 0 ? 0 : 1;
    return curve([...TRACHEA, ...BRONCHI[s].slice(1), ...chain.reverse().slice(1)], .5);
  };
  const NA = 64, R2 = rng(5);
  const airPaths = Array.from({length: NA}, (_, i) => ({c: route(leaves[Math.floor((i + R2() * .9) * leaves.length / NA)] ?? tree[0]), off: R2() * .5}));
  const air = new THREE.InstancedMesh(new THREE.SphereGeometry(.032, 10, 8), new THREE.MeshStandardMaterial({color: "#7fd8f2", emissive: "#3fb2d8", emissiveIntensity: .8, roughness: .3, transparent: true, opacity: .95}), NA);
  air.raycast = () => {};
  inner.add(air);

  const mtx = new THREE.Matrix4(), v = new THREE.Vector3();
  let tab = "vagar", time = 0, inhale = true, still = false;
  const sample: number[] = [];
  const place = () => {
    sample.length = 0;
    if (tab === "blasor") {
      for (const [im, ps] of [[o2, gasPaths.o2], [co2, gasPaths.co2]] as const) ps.forEach((c, i) => {
        const u = (i / NG + time * .09) % 1;
        c.getPointAt(u, v); mtx.makeTranslation(v.x, v.y, v.z); im.setMatrixAt(i, mtx);
        if (sample.length < 9) sample.push(v.x, v.y, v.z);
      });
      o2.instanceMatrix.needsUpdate = co2.instanceMatrix.needsUpdate = true;
      o2.computeBoundingSphere(); co2.computeBoundingSphere();
    }
    if (tab === "luft") {
      /* breathing: four seconds in and out; each puff of air rides the breath down and back up */
      const b = still ? 0 : .5 - .5 * Math.cos(time * Math.PI * 2 / 4.2);
      inhale = Math.sin(time * Math.PI * 2 / 4.2) >= 0;
      breath.scale.setScalar(1 + .045 * b);
      airPaths.forEach((p, i) => {
        /* standing still: the puffs are spread along the way */
        const u = still ? .06 + .9 * ((i * 7) % NA) / NA : Math.max(0, Math.min(1, b * 1.35 - p.off + (i % 3) * .04));
        p.c.getPointAt(u, v);
        const k = u <= 0 || u >= 1 ? .6 : 1;
        mtx.makeScale(k, k, k).setPosition(v); air.setMatrixAt(i, mtx);
        if (sample.length < 9) sample.push(v.x, v.y, v.z);
      });
      air.instanceMatrix.needsUpdate = true; air.computeBoundingSphere();
    } else breath.scale.setScalar(1);
  };

  const setTab = (t: string) => {
    tab = t;
    const close = t === "blasor";
    for (const m of lungMats) m.opacity = close ? .14 : t === "luft" ? .26 : .3;
    big.visible = small.visible = true;
    sac.visible = zoom.visible = close;
    air.visible = t === "luft";
    for (const id in anchors) anchors[id].visible = true;
    place();
  };
  /* the parts each tab's labels may point at */
  const SHOWN: Record<string, string[]> = {vagar: ["luftstrupe", "luftror", "smaror", "hlunga", "vlunga"], blasor: ["lungblasor", "syre", "koldioxid", "kapillarer"], luft: ["luftstrupe", "luftror"]};
  setTab("vagar");

  return {
    group, anchors, pickables,
    glowTargets: (part: string) => SHOWN[tab]?.includes(part) ? (part === "smaror" && tab === "blasor" ? [] : glowMap[part] ?? []) : [],
    setTab,
    view(t: string): DetailView {
      if (t === "blasor") return {target: [SAC[0] + .02, SAC[1] - .06, SAC[2]], radius: .72, az: .25, polar: 1.4};
      return {target: [0, -.1, 0], radius: 1.32, az: 0, polar: 1.5};
    },
    tick(_t, dt, play, st) {
      if (st !== still) { still = st; time = 0; place(); }
      if (still || !play) return false;
      if (tab !== "blasor" && tab !== "luft") return false;
      time += Math.min(dt, .1);
      place();
      return true;
    },
    sample: () => sample.slice(),
    phase: () => tab === "luft" ? (inhale ? "in" : "out") : null,
  };
}
