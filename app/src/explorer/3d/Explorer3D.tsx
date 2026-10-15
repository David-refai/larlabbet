/* "Utforska kroppen" in real 3D (React Three Fiber). Loaded on demand (React.lazy) by
   ui/BodyExplorer.tsx, which keeps the state and the side panels; this draws the stage:
     A Kroppen  the child with warm skin, turn all the way round, zoom, reset
     B Inuti    the skin turns into a see-through teal shell; layers fade in and out
     C Organ    tap an organ: it glows and shows its name; Isolera glides it to the centre
     D Detaljer the heart cut open, the lungs' airways and air sacs, the brain, with labels
   Parts come from the registry (registry.ts): a GLB model if one is configured, else procedural.
   The body is built a part at a time behind a loader (the page stays responsive), the other layers
   when the browser is idle. It draws only when something changes or moves, stops while the page is
   hidden, frees the GPU when it closes, and honours reduced motion (no flows or pulses, camera
   jumps). Mouse, touch, trackpad and keyboard (arrows turn, + and - zoom) all work. */
import {useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState} from "react";
import * as THREE from "three";
import {Canvas, useFrame, useThree, type ThreeEvent} from "@react-three/fiber";
import {ContactShadows} from "@react-three/drei";
import {RoomEnvironment} from "three/examples/jsm/environments/RoomEnvironment.js";
import {ORGANS, EX3D, organById, type DetailId, type LayerId, type OrganId} from "../bodyData";
import type {Pick} from "../renderer";
import {PARTS, DETAIL_PART, partById, type PartId} from "./registry";
import {buildScene, ensureBuilt, isBuilt, organOf, FIRST, LATER, type BodyPartId, type BodyScene} from "./scene/build";
import {Slot, fitToAnchor, clearGlbCache, type Source} from "./scene/Slot";
import {CameraRig, type CamState, type CamView} from "./scene/CameraRig";
import {DetailStage} from "./scene/DetailStage";
import {makeDetail} from "./model/details";
import type {DetailModel} from "./model/detail";
import {disposeTree, fade, glow, xray} from "./materials";
import "./explorer3d.css";

export interface Explorer3DProps {
  layers: Set<LayerId>; sel: OrganId | null; iso: boolean; hidden: Set<OrganId>;
  det: DetailId | null; tab: string; part: string | null; flow: boolean; still: boolean;
  /* the detail parts labelled on this tab */
  labels: {id: string; name: string}[];
  compact: boolean;
  /* the translation shown under the Swedish (the organ's name tag) */
  tr?: "" | "en" | "ar";
  onPick: (p: Pick) => void;
}

/* the live state, read by the frame loop and by the test hook */
interface Live {
  props: Explorer3DProps;
  cam: CamState;
  fades: Map<string, {cur: number; to: number}>;
  sources: Partial<Record<PartId, Source>>;
  frames: number;
  detail: DetailModel | null;
  ready: boolean;
  invalidate?: () => void;
}

const FOV = 30, T = Math.tan(FOV / 2 * Math.PI / 180);
const HOME = new THREE.Vector3(0, 5.1, 0);

/* how far back the camera must be to fit a box of half-height hh and half-width hw */
const fitDist = (hh: number, hw: number, aspect: number) => Math.max(hh / T, hw / (T * aspect));

/* what each part should fade to in the current mode */
function targets(p: Explorer3DProps): Record<string, number> {
  const on = (l: LayerId) => p.layers.has(l), detail = !!p.det, iso = p.iso && p.sel ? p.sel : null, body = !detail && !iso;
  const t: Record<string, number> = {
    skin: on("skin") && !detail ? 1 : 0,
    shell: detail || on("skin") ? 0 : iso ? .16 : 1,
    muscles: body && on("muscles") ? (on("organs") || on("skeleton") ? .32 : 1) : 0,
    skeleton: body && on("skeleton") ? 1 : 0,
    /* the skull would hide the brain: it turns see-through while the organs are shown */
    skull: body && on("skeleton") ? (on("organs") && !p.hidden.has("brain") ? .28 : 1) : 0,
    vessels: body && on("vessels") ? 1 : 0,
    /* the heart's big vessels close the circuit when the vessels show without the heart */
    greatVessels: body && on("vessels") && (!on("organs") || p.hidden.has("heart")) ? 1 : 0,
    nerves: body && on("nerves") ? 1 : 0,
    esophagus: detail ? 0 : iso ? (iso === "stomach" ? 1 : 0) : on("organs") && !p.hidden.has("stomach") ? 1 : 0,
    floor: on("skin") && !detail ? 1 : 0,
  };
  for (const o of ORGANS) t[o.id] = detail ? 0 : iso ? (o.id === iso ? 1 : 0) : on("organs") && !p.hidden.has(o.id) ? 1 : 0;
  return t;
}

/* the keys that turn and zoom the camera */
const KEYS: Record<string, [number, number, number]> = {
  ArrowLeft: [-Math.PI / 12, 0, 1], ArrowRight: [Math.PI / 12, 0, 1], ArrowUp: [0, -.17, 1], ArrowDown: [0, .17, 1],
  "+": [0, 0, .85], "=": [0, 0, .85], "-": [0, 0, 1 / .85], "_": [0, 0, 1 / .85],
};

export default function Explorer3D(props: Explorer3DProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const [resetKey, setReset] = useState(0);
  const [hint, setHint] = useState(true);
  const [ready, setReady] = useState(false);
  const live = useRef<Live>({props, cam: {azimuth: 0, polar: 0, distance: 0, tweening: false, dragged: false}, fades: new Map(), sources: {}, frames: 0, detail: null, ready: false});
  live.current.props = props;
  const dark = !props.layers.has("skin") || !!props.det;

  /* the test hook */
  useEffect(() => {
    const w = window as unknown as {__ex3d?: unknown; __ex3dGone?: unknown};
    w.__ex3d = makeHook(live.current, wrap);
    delete w.__ex3dGone;
    return () => { delete w.__ex3d; w.__ex3dGone = {at: Date.now(), frames: live.current.frames}; clearGlbCache(); };
  }, []);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.target !== wrap.current || e.altKey || e.ctrlKey || e.metaKey) return;
    const k = KEYS[e.key]; if (!k) return;
    e.preventDefault(); setHint(false);
    live.current.cam.nudge?.(k[0], k[1], k[2]);
  };

  return <div className={"x3" + (dark ? " dark" : "") + (props.compact ? " compact" : "")} ref={wrap} tabIndex={0} role="application"
    aria-label={EX3D.canvas.sv + " " + EX3D.keys.sv} onKeyDown={onKey}
    data-mode={props.det ? "detail" : props.iso && props.sel ? "organ" : dark ? "inside" : "body"}>
    <div className="x3bg light" /><div className="x3bg darkbg" />
    <Canvas className="x3canvas" frameloop="demand" dpr={[1, 2]} flat={false}
      camera={{fov: FOV, near: .05, far: 300, position: [0, 5.1, 22]}}
      gl={{antialias: true, alpha: true, powerPreference: "high-performance", preserveDrawingBuffer: false}}
      onCreated={({gl}) => { gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = 1.05; gl.outputColorSpace = THREE.SRGBColorSpace; gl.localClippingEnabled = true; gl.setClearColor(0x000000, 0); }}
      aria-hidden="true" tabIndex={-1}
      onPointerDown={() => setHint(false)}>
      <Scene {...props} resetKey={resetKey} live={live.current} onReady={() => setReady(true)} />
    </Canvas>
    <svg className="x3tagline" aria-hidden="true"><path /><circle r="4" /></svg>
    <div className="x3tag" id="x3tag" hidden />
    <Labels labels={props.det ? props.labels : []} part={props.part} compact={props.compact} live={live.current} onPick={id => props.onPick({kind: "part", id})} />
    <div className="x3phase" id="x3phase" aria-hidden="true" hidden />
    <button type="button" className={"x3reset" + (props.compact ? " icon" : "")} id="x3reset" onClick={() => setReset(k => k + 1)}
      aria-label={EX3D.reset.sv} title={EX3D.reset.sv}>
      <span aria-hidden="true">⟲</span> <span className="x3rt">{EX3D.reset.sv}</span></button>
    {hint && ready && <div className="x3hint" aria-hidden="true"><b>360°</b> {EX3D.hint.sv}</div>}
    {!ready && <div className="x3load" id="x3load"><span className="x3spin" aria-hidden="true" />{EX3D.loading.sv}</div>}
  </div>;
}

/* ---------------- the scene ---------------- */
function Scene(p: Explorer3DProps & {resetKey: number; live: Live; onReady: () => void}) {
  const {gl, scene, size, invalidate, setFrameloop, camera, get} = useThree();
  /* only empty groups here: the models are built a part at a time below */
  const S = useMemo(buildScene, []);
  const live = p.live;
  const D = useMemo(() => p.det ? makeDetail(p.det) : null, [p.det]);
  live.detail = D;
  useEffect(() => () => { if (D) disposeTree(D.group); }, [D]);
  /* the test hook reads the camera and the scene */
  useEffect(() => {
    const w = window as unknown as {__ex3dThree?: unknown};
    w.__ex3dThree = {camera, scene, gl, get controls() { return get().controls; }, invalidate};
    live.invalidate = invalidate;
    return () => { delete w.__ex3dThree; live.invalidate = undefined; };
  }, [camera, scene, gl, get, invalidate, live]);

  /* reflections: a soft studio, made here (no files to load) */
  useEffect(() => {
    const pm = new THREE.PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const env = pm.fromScene(room, .04).texture;
    scene.environment = env; scene.environmentIntensity = .38;
    pm.dispose(); room.traverse(o => { const m = o as THREE.Mesh; m.geometry?.dispose(); (m.material as THREE.Material)?.dispose?.(); });
    invalidate();
    return () => { scene.environment = null; env.dispose(); };
  }, [gl, scene, invalidate]);

  /* free everything when the explorer closes; stop drawing while the page is hidden */
  useEffect(() => () => { disposeTree(S.root, true); for (const k in S.procedural) disposeTree(S.procedural[k as BodyPartId], true); }, [S]);
  useEffect(() => {
    const vis = () => { setFrameloop(document.hidden ? "never" : "demand"); if (!document.hidden) invalidate(); };
    document.addEventListener("visibilitychange", vis);
    return () => document.removeEventListener("visibilitychange", vis);
  }, [setFrameloop, invalidate]);

  /* fading: every part eases towards its target */
  const fades = live.fades;
  const t = targets(p);
  /* a layer switched on that was not built yet is built now (the first parts are built below) */
  if (live.ready) for (const k in t) if (t[k] > 0) ensureBuilt(S.procedural[k as BodyPartId]);
  for (const k in t) {
    const f = fades.get(k);
    if (!f) fades.set(k, {cur: t[k], to: t[k]});
    else f.to = t[k];
  }
  const objOf = useCallback((k: string): THREE.Object3D | null => k === "shell" ? S.shell : k === "floor" ? null
    : k === "skull" ? S.slots.skeleton.getObjectByName("skull") ?? null
    : k === "greatVessels" ? S.slots.vessels.getObjectByName("great-vessels") ?? null : S.slots[k as BodyPartId] ?? null, [S]);
  const refade = useCallback((k: string) => {
    for (const key of k === "skin" ? ["skin", "shell"] : k === "skeleton" ? ["skeleton", "skull"] : k === "vessels" ? ["vessels", "greatVessels"] : [k]) {
      const f = fades.get(key), o = objOf(key); if (f && o) fade(o, f.cur);
    }
  }, [fades, objOf]);
  useLayoutEffect(() => {
    for (const [k, f] of fades) { if (p.still) f.cur = f.to; const o = objOf(k); if (o) fade(o, f.cur); }
    invalidate();
  });

  /* build the body and the organs one at a time (the loader spins in between), then the other
     layers when the browser is idle, so switching them on later does not freeze the screen */
  const onReady = p.onReady;
  useEffect(() => {
    let alive = true, timer = 0, idle = 0;
    const w = window as Window & {requestIdleCallback?: typeof requestIdleCallback; cancelIdleCallback?: typeof cancelIdleCallback};
    const ric = (f: () => void) => w.requestIdleCallback ? w.requestIdleCallback(f, {timeout: 6000}) : window.setTimeout(f, 400);
    const unric = (h: number) => w.cancelIdleCallback ? w.cancelIdleCallback(h) : window.clearTimeout(h);
    const todo = FIRST.filter(k => !isBuilt(S.procedural[k]));
    const later = () => {
      const k = LATER.find(x => !isBuilt(S.procedural[x]));
      if (!alive || !k) return;
      idle = ric(() => { if (!alive) return; if (ensureBuilt(S.procedural[k])) { refade(k); invalidate(); } later(); });
    };
    const next = () => {
      if (!alive) return;
      const k = todo.shift();
      if (k) { ensureBuilt(S.procedural[k]); refade(k); invalidate(); timer = window.setTimeout(next, 0); return; }
      live.ready = true; onReady(); invalidate();
      later();
    };
    /* first let the loader show */
    timer = window.setTimeout(next, 60);
    return () => { alive = false; window.clearTimeout(timer); unric(idle); };
  }, [S, live, refade, invalidate, onReady]);

  const tagBox = useRef<{id: string; box: THREE.Box3} | null>(null);
  /* GLB parts report here; a GLB skin also becomes the see-through shell */
  const onSource = useCallback((id: PartId, s: Source) => { live.sources[id] = s; }, [live]);
  const onLoad = useCallback((id: PartId, o: THREE.Object3D) => {
    const f = fades.get(id); if (f) fade(S.slots[id as BodyPartId], f.cur);
    if (id === "skin") {
      S.shell.clear();
      const c = o.clone(true), m = xray();
      c.traverse(n => { const x = n as THREE.Mesh; if (x.isMesh) { x.material = m; x.renderOrder = 10; } });
      S.shell.add(c); fade(S.shell, fades.get("shell")?.cur ?? 0);
    }
    tagBox.current = null;
    invalidate();
  }, [S, fades, invalidate]);

  /* the name tag of the picked organ (a DOM label tied to the organ's mesh) */
  const tag = p.sel && !p.det && !p.layers.has("skin") ? organById(p.sel)! : null;
  const tagEl = useRef<{tag: HTMLElement; svg: SVGSVGElement} | null>(null);
  useLayoutEffect(() => {
    const x3 = gl.domElement.closest(".x3");
    const el = x3?.querySelector("#x3tag") as HTMLElement | null, svg = x3?.querySelector(".x3tagline") as SVGSVGElement | null;
    tagEl.current = el && svg ? {tag: el, svg} : null;
    if (!el) return;
    if (!tag) { el.hidden = true; svg!.style.visibility = "hidden"; return; }
    const tr = p.tr ? tag.name[p.tr] : "";
    el.innerHTML = "";
    el.append(tag.name.sv);
    if (tr) { const s = document.createElement("span"); s.className = "trl"; s.dir = "auto"; s.textContent = tr; el.append(s); }
    el.hidden = false; el.style.visibility = "hidden";
    invalidate();
  }, [tag, p.tr, gl, invalidate]);

  /* the selected organ glows; the frame loop also eases the fades and keeps the name tag in place */
  useFrame((st, dt) => {
    live.frames++;
    let busy = false;
    /* time based, so a slow device still finishes a fade in about a second */
    const k = 1 - Math.exp(-Math.min(dt, .25) / .24);
    for (const [key, f] of fades) {
      if (f.cur === f.to) continue;
      f.cur = Math.abs(f.to - f.cur) < .004 ? f.to : f.cur + (f.to - f.cur) * k;
      const o = objOf(key); if (o) fade(o, f.cur);
      busy = true;
    }
    const sel = !p.det ? p.sel : null;
    for (const o of ORGANS) {
      const g = S.slots[o.id];
      /* a soft pulsing rim; gentler once the organ is isolated, so its own colours show */
      const iso = p.iso && p.sel === o.id;
      const base = iso ? .3 : .42, amp = iso ? .1 : .22;
      glow(g, o.id === sel ? (p.still ? base + .1 : base + amp * Math.sin(st.clock.elapsedTime * 4.2)) : 0);
    }
    if (sel && !p.still) busy = true;
    /* (the camera's matrices are brought up to date first: the controls moved it this frame) */
    if (tag && tagEl.current) { camera.updateMatrixWorld(); placeTag(tagEl.current, tag.id, S, fades, camera, gl.domElement, tagBox); }
    if (busy) invalidate();
  });

  /* tapping an organ (not while the skin is on); a drag is not a tap */
  const tappable = (id: OrganId) => !p.layers.has("skin") && !p.det && (fades.get(id)?.to ?? 0) > .5;
  const firstOrgan = (e: ThreeEvent<PointerEvent | MouseEvent>) => {
    for (const h of e.intersections) {
      const id = organOf(h.object);
      if (id && tappable(id)) return id;
    }
    return null;
  };
  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (e.delta > 8) return;
    const id = firstOrgan(e);
    if (id) p.onPick({kind: "organ", id});
  };
  const onMove = (e: ThreeEvent<PointerEvent>) => { gl.domElement.style.cursor = firstOrgan(e) ? "pointer" : ""; };

  /* the camera for this mode */
  const aspect = size.width / Math.max(1, size.height);
  const isoId = p.iso && p.sel ? p.sel : null;
  const view: CamView = useMemo(() => {
    if (p.det && D) {
      const v = D.view(p.tab), c = partById(DETAIL_PART[p.det]).anchor.position;
      return {target: new THREE.Vector3(v.target[0] + c[0], v.target[1] + c[1], v.target[2] + c[2]), dist: fitDist(v.radius, v.radius, aspect) + v.radius * .4, az: v.az ?? null, polar: v.polar ?? null};
    }
    if (isoId) {
      const a = partById(isoId).anchor, r = Math.max(...a.size) / 2;
      return {target: new THREE.Vector3(...a.position), dist: fitDist(r * 1.25, r * 1.25, aspect) + r * .5, az: null, polar: null};
    }
    return {target: HOME.clone(), dist: fitDist(5.45, 2.25, aspect), az: null, polar: null};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p.det, p.tab, isoId, aspect, D]);
  const viewKey = p.det ? `d:${p.det}:${p.tab}` : isoId ? `o:${isoId}` : "home";

  return <>
    <hemisphereLight args={["#eef4ff", "#b89c8a", .38]} />
    {/* the whole body is never looked at from under the floor; a single organ or a detail can be */}
    <CameraRig view={view} viewKey={viewKey} resetKey={p.resetKey} still={p.still} out={live.cam} maxPolar={p.det || isoId ? 2.75 : 1.95} />
    <primitive object={S.root} onClick={onClick} onPointerMove={onMove} onPointerOut={() => { gl.domElement.style.cursor = ""; }}>
      {PARTS.filter(d => d.layer !== "detail").map(d =>
        <Slot key={d.id} id={d.id} slot={S.slots[d.id as BodyPartId]} procedural={S.procedural[d.id as BodyPartId]} onSource={onSource} onLoad={onLoad} />)}
    </primitive>
    <ContactShadows position={[0, .002, 0]} scale={7} far={4} blur={2.6} resolution={512} frames={1} color="#24345a"
      opacity={(fades.get("floor")?.to ?? 0) * .55} />
    <Platform on={!p.layers.has("skin") && !p.det && !isoId} still={p.still} />
    {p.det && D && <DetailStage key={p.det} id={p.det} model={D} tab={p.tab} part={p.part} flow={p.flow} still={p.still} labels={p.labels} compact={p.compact}
      onPick={id => p.onPick({kind: "part", id})} onSource={onSource} />}
  </>;
}

/* the name tag: on the top of the organ's own mesh, with a short leader line to it. When that spot
   is covered on screen by another organ that is nearer, the tag goes to a side that is free. */
const tv = new THREE.Vector3(), tw = new THREE.Vector3(), tb = new THREE.Box3();
function placeTag(el: {tag: HTMLElement; svg: SVGSVGElement}, id: OrganId, S: BodyScene, fades: Map<string, {cur: number; to: number}>,
  camera: THREE.Camera, canvas: HTMLCanvasElement, cache: React.MutableRefObject<{id: string; box: THREE.Box3} | null>) {
  const W = canvas.clientWidth, H = canvas.clientHeight;
  const slot = S.slots[id];
  if (!cache.current || cache.current.id !== id || cache.current.box.isEmpty()) {
    cache.current = {id, box: new THREE.Box3().setFromObject(slot)};
  }
  const box = cache.current.box;
  if (box.isEmpty()) { el.tag.style.visibility = "hidden"; el.svg.style.visibility = "hidden"; return; }
  const scr = (p: THREE.Vector3) => { tv.copy(p).project(camera); return {x: (tv.x + 1) / 2 * W, y: (1 - tv.y) / 2 * H, z: tv.z}; };
  /* the screen boxes of the other organs on show, with how far away they are */
  const others: {l: number; t: number; r: number; b: number; d: number}[] = [];
  for (const o of ORGANS) {
    if (o.id === id || (fades.get(o.id)?.to ?? 0) < .5) continue;
    const ob = tb.setFromObject(S.slots[o.id]); if (ob.isEmpty()) continue;
    let l = Infinity, t = Infinity, r = -Infinity, b = -Infinity;
    for (let i = 0; i < 8; i++) {
      tw.set(i & 1 ? ob.max.x : ob.min.x, i & 2 ? ob.max.y : ob.min.y, i & 4 ? ob.max.z : ob.min.z);
      const q = scr(tw); l = Math.min(l, q.x); r = Math.max(r, q.x); t = Math.min(t, q.y); b = Math.max(b, q.y);
    }
    /* shrink a little: a box is bigger than its organ */
    const sx = (r - l) * .12, sy = (b - t) * .12;
    others.push({l: l + sx, t: t + sy, r: r - sx, b: b - sy, d: ob.getCenter(tw).distanceTo(camera.position)});
  }
  const c = box.getCenter(new THREE.Vector3());
  const cands: [THREE.Vector3, "top" | "left" | "right" | "bottom"][] = [
    [new THREE.Vector3(c.x, box.max.y, c.z), "top"], [new THREE.Vector3(box.min.x, c.y, c.z), "left"],
    [new THREE.Vector3(box.max.x, c.y, c.z), "right"], [new THREE.Vector3(c.x, box.min.y, c.z), "bottom"]];
  /* "left" and "right" in the body turn into screen sides by projection */
  let pick = cands[0], q = scr(pick[0]);
  for (const cd of cands) {
    const s = scr(cd[0]), d = cd[0].distanceTo(camera.position);
    if (s.z > 1 || s.x < 0 || s.x > W || s.y < 0 || s.y > H) continue;
    if (!others.some(o => s.x > o.l && s.x < o.r && s.y > o.t && s.y < o.b && o.d < d)) { pick = cd; q = s; break; }
  }
  if (q.z > 1) { el.tag.style.visibility = "hidden"; el.svg.style.visibility = "hidden"; return; }
  const tw_ = el.tag.offsetWidth, th = el.tag.offsetHeight, gap = 26;
  let side = pick[1];
  if (side === "left" || side === "right") side = q.x < scr(c).x ? "left" : "right";
  let x = q.x - tw_ / 2, y = q.y - gap - th;
  if (side === "left") { x = q.x - gap - tw_; y = q.y - th / 2; }
  else if (side === "right") { x = q.x + gap; y = q.y - th / 2; }
  else if (side === "bottom") { y = q.y + gap; }
  x = Math.max(6, Math.min(W - tw_ - 6, x)); y = Math.max(6, Math.min(H - th - 6, y));
  /* the leader line from the tag's nearest edge to the organ */
  const ex = Math.max(x, Math.min(x + tw_, q.x)), ey = Math.max(y, Math.min(y + th, q.y));
  el.tag.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px)`;
  el.tag.style.visibility = "visible";
  el.svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  el.svg.querySelector("path")!.setAttribute("d", `M${ex.toFixed(1)} ${ey.toFixed(1)}L${q.x.toFixed(1)} ${q.y.toFixed(1)}`);
  const ci = el.svg.querySelector("circle")!; ci.setAttribute("cx", q.x.toFixed(1)); ci.setAttribute("cy", q.y.toFixed(1));
  el.svg.style.visibility = "visible";
}

/* a soft glowing ring under the feet in the dark modes */
function Platform({on, still}: {on: boolean; still: boolean}) {
  const m = useMemo(() => {
    const c = document.createElement("canvas"); c.width = c.height = 256;
    const g = c.getContext("2d")!, r = g.createRadialGradient(128, 128, 0, 128, 128, 128);
    r.addColorStop(0, "rgba(90,230,220,.55)"); r.addColorStop(.45, "rgba(60,190,200,.22)"); r.addColorStop(.72, "rgba(60,190,200,.06)");
    r.addColorStop(.86, "rgba(120,240,235,.32)"); r.addColorStop(.92, "rgba(60,190,200,0)"); r.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = r; g.fillRect(0, 0, 256, 256);
    const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
    return new THREE.MeshBasicMaterial({map: tex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0});
  }, []);
  const k = useRef(0);
  const {invalidate} = useThree();
  useEffect(() => () => { m.map?.dispose(); m.dispose(); }, [m]);
  useFrame((_, dt) => {
    const to = on ? 1 : 0;
    if (k.current === to) return;
    k.current = still ? to : Math.abs(to - k.current) < .01 ? to : k.current + (to - k.current) * (1 - Math.exp(-dt / .25));
    m.opacity = k.current; invalidate();
  });
  return <mesh rotation-x={-Math.PI / 2} position={[0, .01, 0]} material={m} renderOrder={-1} raycast={() => null}><planeGeometry args={[5.2, 5.2]} /></mesh>;
}

/* ---------------- labels of the detail parts: buttons on top of the canvas ---------------- */
function Labels({labels, part, compact, live, onPick}: {labels: {id: string; name: string}[]; part: string | null; compact: boolean; live: Live; onPick: (id: string) => void}) {
  /* new labels start hidden until they are placed: ask for a frame right away */
  const ids = labels.map(l => l.id).join();
  useLayoutEffect(() => { live.invalidate?.(); }, [ids, compact, part, live]);
  return <div className="x3labels" aria-live="off">
    <svg className="x3lines" aria-hidden="true" />
    {labels.map((l, i) => <button key={l.id} type="button" className={"xlab" + (compact ? " xnum" : "") + (l.id === part ? " on" : "")} data-part={l.id}
      aria-label={l.name} onClick={e => { e.stopPropagation(); onPick(l.id); }} style={{visibility: "hidden"}}>
      {compact ? <span>{i + 1}</span> : l.name}</button>)}
  </div>;
}

/* ---------------- the test hook: window.__ex3d ---------------- */
function makeHook(live: Live, wrap: React.RefObject<HTMLDivElement | null>) {
  return {
    get state() {
      const p = live.props, cam = st3()?.camera, layers: Record<string, {to: number; opacity: number}> = {};
      for (const [k, f] of live.fades) layers[k] = {to: f.to, opacity: +f.cur.toFixed(3)};
      return {
        ready: live.ready, frames: live.frames, still: p.still,
        mode: p.det ? "detail" : p.iso && p.sel ? "organ" : p.layers.has("skin") ? "body" : "inside",
        layers, selected: p.sel, isolated: p.iso && p.sel ? p.sel : null, detail: p.det, tab: p.tab, part: p.part, flow: p.flow,
        camera: {azimuth: live.cam.azimuth, polar: live.cam.polar, distance: live.cam.distance, tweening: live.cam.tweening,
          position: cam ? cam.position.toArray() : null},
        partSources: Object.fromEntries(PARTS.map(d => [d.id, live.sources[d.id] ?? "procedural"])),
        labels: wrap.current ? wrap.current.querySelectorAll(".x3labels .xlab").length : 0,
      };
    },
    particles: () => live.detail ? live.detail.sample() : [],
    /* where to tap an organ or a detail part (page pixels), on a spot where it is in front */
    point(id: string) { return pointOf(live, id); },
    /* a detail label's 3D point, in the detail model's own space (for the anatomy checks) */
    anchor(id: string) { const a = live.detail?.anchors[id]; return a ? a.position.toArray() : null; },
  };
}

function pointOf(live: Live, id: string): {x: number; y: number} | null {
  const s = st3();
  if (!s) return null;
  const {camera, scene, rect} = s;
  const isPart = !!live.detail?.anchors[id];
  let target: THREE.Object3D | null = null;
  scene.traverse(o => { if (!target && ((isPart && o.userData.part === id && (o as THREE.Mesh).isMesh) || (!isPart && o.name === "slot:" + id))) target = o; });
  if (!target) return null;
  const pts: THREE.Vector3[] = [];
  (target as THREE.Object3D).traverse(o => {
    const m = o as THREE.Mesh;
    if (!m.isMesh || !m.visible) return;
    const pos = m.geometry.attributes.position, step = Math.max(1, Math.floor(pos.count / 60));
    for (let i = 0; i < pos.count; i += step) pts.push(new THREE.Vector3().fromBufferAttribute(pos, i).applyMatrix4(m.matrixWorld));
  });
  const c = new THREE.Box3().setFromPoints(pts).getCenter(new THREE.Vector3());
  pts.sort((a, b) => a.distanceTo(c) - b.distanceTo(c));
  pts.unshift(c);
  const rc = new THREE.Raycaster();
  for (const q of pts) {
    const v = q.clone().project(camera);
    if (Math.abs(v.x) > .98 || Math.abs(v.y) > .98) continue;
    rc.setFromCamera(new THREE.Vector2(v.x, v.y), camera);
    const hits = rc.intersectObjects(scene.children, true).filter(h => h.object.visible && isVisibleUp(h.object) && (isPart ? !!h.object.userData.part : !!organOf(h.object)));
    const first = hits[0];
    if (first && (isPart ? first.object.userData.part === id : organOf(first.object) === id))
      return {x: rect.left + (v.x + 1) / 2 * rect.width, y: rect.top + (1 - v.y) / 2 * rect.height};
  }
  return null;
}
const isVisibleUp = (o: THREE.Object3D | null) => { for (let n = o; n; n = n.parent) if (!n.visible) return false; return true; };
function st3() {
  const w = window as unknown as {__ex3dThree?: {camera: THREE.Camera; scene: THREE.Scene; gl: THREE.WebGLRenderer}};
  const t = w.__ex3dThree; if (!t) return null;
  return {camera: t.camera, scene: t.scene, rect: t.gl.domElement.getBoundingClientRect()};
}

export {fitToAnchor};
