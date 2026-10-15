/* Mode D: the detail model of the heart, the lungs or the brain, opened where the organ sits.
   It grows out of the organ, runs its tab (cutaway, valves, flows), glows the picked part and
   keeps the labels (HTML buttons on top of the canvas) tied to their 3D points with leader lines.
   A label is hidden while its point is turned away from the camera or hidden behind the model,
   so it never points at the wrong structure when the model is turned round. */
import {useEffect, useMemo, useRef} from "react";
import * as THREE from "three";
import {useFrame, useThree, type ThreeEvent} from "@react-three/fiber";
import {EX3D, type DetailId} from "../../bodyData";
import {DETAIL_PART, glbFor, partById, type PartId} from "../registry";
import type {DetailModel} from "../model/detail";
import {glow} from "../materials";
import {fitToAnchor, useGlb, type Source} from "./Slot";

const ease = (t: number) => 1 - Math.pow(1 - t, 3);

export function DetailStage({id, model, tab, part, flow, still, labels, compact, onPick, onSource}: {
  id: DetailId; model: DetailModel; tab: string; part: string | null; flow: boolean; still: boolean;
  labels: {id: string; name: string}[]; compact: boolean;
  onPick: (id: string) => void; onSource: (id: PartId, s: Source) => void;
}) {
  const pid = DETAIL_PART[id], anchor = partById(pid).anchor, want = glbFor(pid), g = useGlb(want);
  const {invalidate, camera, gl} = useThree();
  const grp = useRef<THREE.Group>(null);
  const pop = useRef(still ? 1 : 0);
  /* a GLB detail model: scaled into the anchor's box; nodes named after part ids become label points */
  const glb = useMemo(() => {
    if (!g || g === "loading") return null;
    const obj = fitToAnchor(g, pid, false), anchors: Record<string, THREE.Object3D> = {};
    obj.traverse(n => { if (n.name) anchors[n.name] = n; });
    return {obj, anchors};
  }, [g, pid]);

  /* which labels are hidden behind the model (worked out again when the view changes, a few times a second at most) */
  const occ = useRef({stamp: -1, at: 0, hidden: new Set<string>(), last: new THREE.Matrix4(), timer: 0});
  const rc = useMemo(() => new THREE.Raycaster(), []);
  useEffect(() => () => window.clearTimeout(occ.current.timer), []);

  useEffect(() => { onSource(pid, g === "loading" ? "loading" : glb ? "glb" : "procedural"); }, [pid, g, glb, onSource]);
  useEffect(() => { model.setTab(tab); occ.current.stamp = -1; invalidate(); }, [model, tab, invalidate]);
  useEffect(() => { occ.current.stamp = -1; invalidate(); }, [part, flow, labels, compact, invalidate]);

  /* the label layer is the sibling of the canvas */
  const layer = useRef<HTMLElement | null>(null);
  const v = new THREE.Vector3(), w = new THREE.Vector3(), n = new THREE.Vector3(), q = new THREE.Quaternion();
  useFrame((st, dt) => {
    const gr = grp.current; if (!gr) return;
    let busy = false;
    if (pop.current < 1) { pop.current = Math.min(1, pop.current + dt / .7); busy = true; }
    gr.scale.setScalar(.3 + .7 * ease(pop.current));
    model.group.visible = !glb;
    if (!glb && model.tick(st.clock.elapsedTime, dt, flow, still)) busy = true;
    /* glow on the picked part */
    const k = part ? (still ? .6 : .45 + .25 * Math.sin(st.clock.elapsedTime * 4.2)) : 0;
    for (const l of labels) for (const o of glb ? [glb.anchors[l.id]].filter(Boolean) : model.glowTargets(l.id)) glow(o, l.id === part ? k : 0);
    if (part && !still) busy = true;
    /* labels */
    layer.current ??= gl.domElement.closest(".x3")?.querySelector(".x3labels") as HTMLElement | null;
    const el = layer.current;
    const anchorOf = (lid: string) => glb ? glb.anchors[lid] : model.anchors[lid];
    /* hidden behind the model? (raycast from the camera to each label point) */
    /* the controls moved the camera this frame, but its matrices are only brought up to date when the
       frame is drawn: do it now, so the labels sit on this frame's picture and not the last one's */
    camera.updateMatrixWorld();
    const O = occ.current, now = performance.now();
    const moved = !O.last.equals(camera.matrixWorld) || O.stamp < 0;
    if (moved && pop.current >= 1) {
      if (now - O.at > 140) {
        O.at = now; O.stamp = 1; O.last.copy(camera.matrixWorld); O.hidden.clear();
        gr.updateWorldMatrix(true, true);
        const meshes: THREE.Object3D[] = [];
        (glb ? glb.obj : model.group).traverseVisible(o => { if (blocks(o)) meshes.push(o); });
        for (const l of labels) candidates(anchorOf(l.id)).forEach((a, i) => {
          a.getWorldPosition(w);
          const dist = w.distanceTo(camera.position);
          rc.set(camera.position, w.clone().sub(camera.position).normalize()); rc.near = 0; rc.far = dist - .02;
          /* a part's own geometry does not hide its label (a valve's leaflets meet at its label point) */
          if (rc.intersectObjects(meshes, false).some(h => partOf(h.object, !!glb) !== l.id)) O.hidden.add(l.id + "#" + i);
        });
      } else if (!O.timer) O.timer = window.setTimeout(() => { O.timer = 0; invalidate(); }, 160);
    }
    if (el) place(el, gl.domElement, compact, labels.map(l => {
      /* the first of the label's points (its main one, then the ones on the far side) that is
         turned towards the camera and not hidden behind the model */
      const cs = candidates(anchorOf(l.id));
      for (let i = 0; i < cs.length; i++) {
        const a = cs[i];
        a.getWorldPosition(v);
        /* turned away from the camera, or seen almost edge-on? */
        let away = false;
        const f = a.userData.facing as [number, number, number] | undefined;
        if (f) { a.parent!.getWorldQuaternion(q); n.set(f[0], f[1], f[2]).applyQuaternion(q); away = n.normalize().dot(w.copy(camera.position).sub(v).normalize()) < .2; }
        v.project(camera);
        if (v.z > 1 || away || occ.current.hidden.has(l.id + "#" + i)) continue;
        return {id: l.id, x: (v.x + 1) / 2, y: (1 - v.y) / 2, hide: false};
      }
      return {id: l.id, x: 0, y: 0, hide: true};
    }), part);
    /* "Andas in" / "Andas ut" while the lungs breathe */
    const ph = glb ? null : model.phase?.() ?? null;
    const pe = layer.current?.parentElement?.querySelector(".x3phase") as HTMLElement | null;
    if (pe) { const txt = ph === "in" ? EX3D.breatheIn.sv : ph === "out" ? EX3D.breatheOut.sv : ""; if (pe.textContent !== txt) pe.textContent = txt; pe.hidden = !txt; }
    if (busy) invalidate();
  });
  useEffect(() => () => {
    const el = layer.current; if (!el) return;
    const svg = el.querySelector("svg"); if (svg) svg.innerHTML = "";
  }, []);

  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (e.delta > 8) return;
    for (const h of e.intersections) {
      for (let o: THREE.Object3D | null = h.object; o; o = o.parent) {
        const pt = (o.userData?.part as string | undefined) ?? (glb && labels.some(l => l.id === o!.name) ? o.name : undefined);
        if (pt && labels.some(l => l.id === pt)) { onPick(pt); return; }
      }
    }
  };
  return <group ref={grp} position={anchor.position} onClick={onClick}
    onPointerMove={e => { gl.domElement.style.cursor = e.intersections.some(h => labels.some(l => l.id === h.object.userData?.part)) ? "pointer" : ""; }}>
    <primitive object={model.group} />
    {glb && <primitive object={glb.obj} />}
  </group>;
}

/* a label's points: its main one and the extra ones (userData.alts, e.g. on the back of the model) */
function candidates(a: THREE.Object3D | undefined): THREE.Object3D[] {
  if (!a || !a.visible) return [];
  return [a, ...((a.userData.alts as THREE.Object3D[] | undefined) ?? []).filter(x => x.visible)];
}

/* does this mesh hide what is behind it? (see-through parts, flowing dots and lines do not) */
function blocks(o: THREE.Object3D) {
  const m = o as THREE.Mesh;
  if (!m.isMesh || (m as unknown as THREE.InstancedMesh).isInstancedMesh || m.userData.noOcclude) return false;
  const mats = Array.isArray(m.material) ? m.material : [m.material];
  return mats.some(x => x.visible && x.opacity > .7 && !(x as THREE.MeshBasicMaterial).isMeshBasicMaterial);
}

/* the labelled part a mesh belongs to */
function partOf(o: THREE.Object3D, byName: boolean): string | undefined {
  for (let p: THREE.Object3D | null = o; p; p = p.parent) { const v = p.userData?.part as string | undefined ?? (byName && p.name ? p.name : undefined); if (v) return v; }
  return undefined;
}

/* lay the labels out: in two columns with leader lines on wide screens, numbered dots on narrow ones */
function place(el: HTMLElement, canvas: HTMLCanvasElement, compact: boolean, pts: {id: string; x: number; y: number; hide: boolean}[], part: string | null) {
  const W = canvas.clientWidth, H = canvas.clientHeight;
  const btn = (id: string) => el.querySelector(`.xlab[data-part="${id}"]`) as HTMLElement | null;
  const svg = el.querySelector("svg")!;
  let d = "", dots = "";
  const P = pts.map(p => ({...p, x: p.x * W, y: p.y * H}));
  if (compact) {
    /* numbered dots: pushed apart so none covers another, kept clear of the edges and of the reset
       button, with a short line back to the point when one had to move */
    const cr = canvas.getBoundingClientRect(), rb = el.parentElement?.querySelector(".x3reset")?.getBoundingClientRect();
    const keepOut = rb ? {l: rb.left - cr.left - 4, t: rb.top - cr.top - 4, r: rb.right - cr.left + 4, b: rb.bottom - cr.top + 4} : null;
    const R = 16, MIN = 33;
    const S = P.filter(p => !p.hide).map(p => ({...p, cx: p.x, cy: p.y}));
    for (let it = 0; it < 40; it++) {
      let moved = false;
      for (let i = 0; i < S.length; i++) for (let j = i + 1; j < S.length; j++) {
        const a = S[i], b = S[j], dx = b.cx - a.cx, dy = b.cy - a.cy, dd = Math.hypot(dx, dy);
        if (dd >= MIN) continue;
        const ux = dd > .01 ? dx / dd : (j % 2 ? 1 : -1), uy = dd > .01 ? dy / dd : 0, push = (MIN - dd) / 2 + .5;
        a.cx -= ux * push; a.cy -= uy * push; b.cx += ux * push; b.cy += uy * push; moved = true;
      }
      for (const s of S) {
        s.cx = Math.max(R + 2, Math.min(W - R - 2, s.cx)); s.cy = Math.max(R + 2, Math.min(H - R - 2, s.cy));
        if (keepOut && s.cx > keepOut.l - R && s.cx < keepOut.r + R && s.cy > keepOut.t - R && s.cy < keepOut.b + R) {
          /* out of the button's way: up or to the left, whichever is shorter */
          const up = s.cy - (keepOut.t - R), left = s.cx - (keepOut.l - R);
          if (up < left) s.cy = keepOut.t - R; else s.cx = keepOut.l - R;
          moved = true;
        }
      }
      if (!moved) break;
    }
    for (const s of S) {
      const b = btn(s.id); if (!b) continue;
      b.style.visibility = "visible";
      b.style.transform = `translate(${(s.cx - 15).toFixed(1)}px,${(s.cy - 15).toFixed(1)}px)`;
      if (Math.hypot(s.cx - s.x, s.cy - s.y) > 6) {
        d += `M${s.x.toFixed(1)} ${s.y.toFixed(1)}L${s.cx.toFixed(1)} ${s.cy.toFixed(1)}`;
        dots += `<circle cx="${s.x.toFixed(1)}" cy="${s.y.toFixed(1)}" r="3.5"${s.id === part ? ' class="on"' : ""}/>`;
      }
    }
  } else {
    const shown = P.filter(p => !p.hide);
    const cx = shown.length ? shown.reduce((a, p) => a + p.x, 0) / shown.length : W / 2;
    for (const side of ["l", "r"] as const) {
      const S = shown.filter(p => side === "l" ? p.x < cx : p.x >= cx).sort((a, b) => a.y - b.y);
      const hs = S.map(p => btn(p.id)?.offsetHeight ?? 30), gap = 8, m = 10;
      const ys = S.map(p => p.y);
      for (let i = 0; i < ys.length; i++) { ys[i] = Math.max(ys[i], m + hs[i] / 2); if (i) ys[i] = Math.max(ys[i], ys[i - 1] + (hs[i - 1] + hs[i]) / 2 + gap); }
      const over = ys.length ? ys[ys.length - 1] + hs[hs.length - 1] / 2 - (H - m - (side === "r" ? 46 : 0)) : 0;
      if (over > 0) for (let i = ys.length - 1; i >= 0; i--) {
        ys[i] -= over;
        if (i < ys.length - 1) ys[i] = Math.min(ys[i], ys[i + 1] - (hs[i] + hs[i + 1]) / 2 - gap);
      }
      S.forEach((p, i) => {
        const b = btn(p.id); if (!b) return;
        const w = b.offsetWidth, h = hs[i], y = ys[i];
        const x = side === "l" ? Math.max(m, Math.min(p.x - w - 44, W * .27 - w)) : Math.min(W - w - m, Math.max(p.x + 44, W * .73));
        b.style.visibility = "visible";
        b.style.transform = `translate(${x.toFixed(1)}px,${(y - h / 2).toFixed(1)}px)`;
        const ex = side === "l" ? x + w : x;
        d += `M${p.x.toFixed(1)} ${p.y.toFixed(1)}L${ex.toFixed(1)} ${y.toFixed(1)}`;
        dots += `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="5"${p.id === part ? ' class="on"' : ""}/>`;
      });
    }
  }
  for (const p of P) if (p.hide) { const b = btn(p.id); if (b) b.style.visibility = "hidden"; }
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  const html = (d ? `<path d="${d}"/>` : "") + dots;
  if (svg.innerHTML !== html) svg.innerHTML = html;
}
