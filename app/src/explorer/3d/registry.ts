/* THE PARTS REGISTRY of the 3D body explorer. Every 3D part has one entry: its id, the layer it
   belongs to, where it sits in the body (its anchor: the centre and size of its box, in body space,
   the child about 10.2 tall with the feet at y = 0 and facing +z) and, optionally, a GLB model.

   To replace a procedural model with a real one, put the file next to the app (for example
   models/heart.glb next to index.html) and set glb: "models/heart.glb" below. The model is fetched
   and parsed with three's GLTFLoader (plain glTF/GLB: no Draco or meshopt decoders are included),
   scaled to fit inside the anchor's box and centred on it; its own materials
   are kept (they get the same pick-glow and fading as the procedural ones). If the file is missing
   or fails to load, the procedural model is used, silently. For a try-out without rebuilding, set
   window.EX3D_GLB = {heart: "models/heart.glb"} before opening the explorer.
   Detail models (heart-cutaway, lungs-detail, brain-detail) may name nodes after the detail part
   ids in bodyData.ts (hf, vk, aorta, luftstrupe ...): labels are shown only for the nodes found. */
import type {LayerId, OrganId} from "../bodyData";
import type {V3} from "./geo/sdf";

export type PartId = "skin" | "skeleton" | "muscles" | "brain" | "lungs" | "heart" | "liver" | "stomach" | "esophagus"
  | "intestines" | "kidneys" | "bladder" | "vessels" | "nerves" | "heart-cutaway" | "lungs-detail" | "brain-detail";

export interface PartDef {
  id: PartId;
  layer: LayerId | "detail";
  /* tapping this part picks that organ */
  organ?: OrganId;
  anchor: {position: V3; size: V3};
  glb?: string;
}

export const PARTS: PartDef[] = [
  {id: "skin", layer: "skin", anchor: {position: [0, 5.1, .03], size: [4.1, 10.3, 2.45]}},
  {id: "skeleton", layer: "skeleton", anchor: {position: [0, 5.05, -.02], size: [3.8, 10.0, 1.9]}},
  {id: "muscles", layer: "muscles", anchor: {position: [0, 4.9, 0], size: [3.7, 9.4, 1.6]}},
  {id: "brain", layer: "organs", organ: "brain", anchor: {position: [0, 9.12, -.12], size: [1.66, 1.42, 2.0]}},
  {id: "lungs", layer: "organs", organ: "lungs", anchor: {position: [0, 6.62, -.01], size: [1.78, 2.05, 1.02]}},
  {id: "heart", layer: "organs", organ: "heart", anchor: {position: [.08, 6.5, .19], size: [.98, 1.37, .82]}},
  {id: "liver", layer: "organs", organ: "liver", anchor: {position: [-.25, 5.59, .1], size: [1.56, .86, 1.1]}},
  {id: "stomach", layer: "organs", organ: "stomach", anchor: {position: [.4, 5.47, .14], size: [.95, 1.01, .66]}},
  {id: "esophagus", layer: "organs", anchor: {position: [.05, 6.85, -.06], size: [.3, 2.2, .25]}},
  {id: "intestines", layer: "organs", organ: "intestines", anchor: {position: [0, 4.68, .12], size: [1.81, 1.46, .78]}},
  {id: "kidneys", layer: "organs", organ: "kidneys", anchor: {position: [0, 5.0, -.28], size: [1.48, 1.46, .4]}},
  {id: "bladder", layer: "organs", organ: "bladder", anchor: {position: [0, 4.22, .16], size: [.47, .4, .4]}},
  {id: "vessels", layer: "vessels", anchor: {position: [0, 4.9, 0], size: [3.6, 9.6, 1.4]}},
  {id: "nerves", layer: "nerves", anchor: {position: [0, 4.95, -.1], size: [3.6, 9.4, 1.2]}},
  /* the detail models open up where their organ is (the body fades away around them) */
  {id: "heart-cutaway", layer: "detail", organ: "heart", anchor: {position: [.08, 6.5, .19], size: [3.2, 3.8, 2.6]}},
  {id: "lungs-detail", layer: "detail", organ: "lungs", anchor: {position: [0, 6.62, 0], size: [4.4, 4.6, 2.4]}},
  {id: "brain-detail", layer: "detail", organ: "brain", anchor: {position: [0, 9.12, -.12], size: [3.4, 3.6, 3.8]}},
];

export const partById = (id: PartId) => PARTS.find(p => p.id === id)!;
export const DETAIL_PART = {heart: "heart-cutaway", lungs: "lungs-detail", brain: "brain-detail"} as const;

/* the GLB for a part: window.EX3D_GLB wins over the registry (for trying a model out) */
export function glbFor(id: PartId): string | undefined {
  const w = (typeof window !== "undefined" ? window : {}) as {EX3D_GLB?: Partial<Record<PartId, string>>};
  return w.EX3D_GLB?.[id] ?? partById(id).glb;
}
