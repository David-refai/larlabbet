/* One part of the registry on screen: its GLB if one is configured and loads, otherwise the
   procedural model. A missing, broken or unreadable file falls back silently: the file is fetched
   and parsed here (not through a suspending loader), so every failure ends in the error callback
   and nothing is thrown into the page. Plain glTF/GLB only (no Draco or meshopt decoders). */
import {useEffect, useMemo, useState} from "react";
import * as THREE from "three";
import {GLTFLoader} from "three-stdlib";
import {glbFor, partById, type PartId} from "../registry";
import {withGlow} from "../materials";

export type Source = "procedural" | "glb" | "loading";

/* the models fetched while the explorer is open (url -> the parsed scene, or null if it failed) */
const cache = new Map<string, Promise<THREE.Object3D | null>>();
function loadGlb(url: string): Promise<THREE.Object3D | null> {
  let p = cache.get(url);
  if (!p) {
    p = fetch(url)
      .then(r => r.ok ? r.arrayBuffer() : Promise.reject(new Error("HTTP " + r.status)))
      .then(buf => new Promise<THREE.Object3D | null>(ok => {
        const base = url.startsWith("data:") ? "" : url.slice(0, url.lastIndexOf("/") + 1);
        try { new GLTFLoader().parse(buf, base, g => ok(g.scene), e => { console.info("3D model not used:", url.slice(0, 80), e); ok(null); }); }
        catch (e) { console.info("3D model not used:", url.slice(0, 80), e); ok(null); }
      }))
      .catch(e => { console.info("3D model not loaded:", url.slice(0, 80), String(e)); return null; });
    cache.set(url, p);
  }
  return p;
}
/* forget the models (the explorer closed): their GPU memory is freed with the scene */
export function clearGlbCache() { cache.clear(); }

/* the GLB of a part: undefined (none configured), "loading", null (failed) or the model */
export function useGlb(url: string | undefined): THREE.Object3D | null | "loading" | undefined {
  const [st, setSt] = useState<{url?: string; v: THREE.Object3D | null | "loading" | undefined}>({url, v: url ? "loading" : undefined});
  useEffect(() => {
    if (!url) { setSt({url, v: undefined}); return; }
    let live = true;
    setSt({url, v: "loading"});
    loadGlb(url).then(o => { if (live) setSt({url, v: o}); });
    return () => { live = false; };
  }, [url]);
  return st.url === url ? st.v : url ? "loading" : undefined;
}

/* a copy of the model with its own materials (so glow and fading stay on this copy), scaled to fit
   the anchor's box and centred on it */
export function fitToAnchor(src: THREE.Object3D, id: PartId, at = true) {
  const o = src.clone(true);
  o.traverse(n => {
    const m = n as THREE.Mesh;
    if (!m.isMesh) return;
    const mats = (Array.isArray(m.material) ? m.material : [m.material]).map(x => withGlow(x.clone()));
    m.material = Array.isArray(m.material) ? mats : mats[0];
  });
  const {position, size} = partById(id).anchor;
  const box = new THREE.Box3().setFromObject(o), s = new THREE.Vector3(), c = new THREE.Vector3();
  box.getSize(s); box.getCenter(c);
  const k = Math.min(size[0] / (s.x || 1), size[1] / (s.y || 1), size[2] / (s.z || 1));
  const wrap = new THREE.Group();
  o.position.sub(c);
  wrap.add(o);
  wrap.scale.setScalar(k);
  if (at) wrap.position.set(position[0], position[1], position[2]);
  wrap.userData.glb = true;
  return wrap;
}

export function Slot({id, slot, procedural, onSource, onLoad}: {
  id: PartId; slot: THREE.Group; procedural: THREE.Object3D;
  onSource: (id: PartId, s: Source) => void; onLoad: (id: PartId, o: THREE.Object3D) => void;
}) {
  const want = glbFor(id), g = useGlb(want);
  const obj = useMemo(() => g && g !== "loading" ? fitToAnchor(g, id) : null, [g, id]);
  /* the source is reported from here only, once the outcome is known */
  useEffect(() => { onSource(id, g === "loading" ? "loading" : obj ? "glb" : "procedural"); }, [id, g, obj, onSource]);
  useEffect(() => { if (obj) onLoad(id, obj); }, [id, obj, onLoad]);
  return <primitive object={slot}>
    {obj ? <primitive object={obj} /> : <primitive object={procedural} />}
  </primitive>;
}
