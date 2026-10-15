/* Puts the whole body together: one container group per part of the registry, holding the
   procedural model (or a GLB that replaces it). Every procedural model is built on demand: the
   scene starts as empty groups, and the explorer builds the skin and the organs one at a time
   (so the page can paint and the loader can spin in between), and the other layers the first
   time they are shown or when the browser is idle. */
import * as THREE from "three";
import {PARTS, type PartId} from "../registry";
import type {OrganId} from "../../bodyData";
import {buildBody} from "../model/body";
import {buildSkeleton} from "../model/skeleton";
import {buildMuscles} from "../model/muscles";
import {buildVessels, buildNerves} from "../model/vessels";
import {ORGAN_BUILDERS} from "../model/organs";

export type BodyPartId = Exclude<PartId, "heart-cutaway" | "lungs-detail" | "brain-detail">;

export interface BodyScene {
  root: THREE.Group;
  /* one group per part; its child is the procedural model or a GLB */
  slots: Record<BodyPartId, THREE.Group>;
  procedural: Record<BodyPartId, THREE.Object3D>;
  /* the see-through skin (a copy of whatever the skin is) */
  shell: THREE.Group;
}

/* the parts built before the explorer is ready: the body and every organ */
export const FIRST: BodyPartId[] = ["skin", "brain", "lungs", "heart", "liver", "stomach", "esophagus", "intestines", "kidneys", "bladder"];
/* the layers built later (when shown, or when the browser is idle) */
export const LATER: BodyPartId[] = ["skeleton", "vessels", "nerves", "muscles"];

export function buildScene(): BodyScene {
  const root = new THREE.Group(); root.name = "body";
  const shell = new THREE.Group(); shell.name = "shell";
  const procedural = {
    /* the skin and the see-through shell share one body mesh */
    skin: later("skin", () => { const b = buildBody(); for (const c of [...b.shell.children]) shell.add(c); return b.skin; }),
    skeleton: later("skeleton", buildSkeleton), muscles: later("muscles", buildMuscles),
    vessels: later("vessels", buildVessels), nerves: later("nerves", buildNerves),
    ...Object.fromEntries(Object.entries(ORGAN_BUILDERS).map(([k, f]) => [k, later(k, f)])),
  } as unknown as Record<BodyPartId, THREE.Object3D>;
  const slots = {} as Record<BodyPartId, THREE.Group>;
  for (const p of PARTS) {
    if (p.layer === "detail") continue;
    const id = p.id as BodyPartId;
    const g = new THREE.Group(); g.name = "slot:" + id; g.userData.part = id;
    if (p.organ) g.userData.organ = p.organ;
    slots[id] = g; root.add(g);
  }
  root.add(shell);
  return {root, slots, procedural, shell};
}

function later(name: string, make: () => THREE.Object3D) {
  const g = new THREE.Group(); g.name = name; g.userData.make = make; return g;
}
/* builds a part's procedural model the first time it is needed; true if it did */
export function ensureBuilt(o: THREE.Object3D | undefined): boolean {
  const mk = o?.userData.make as (() => THREE.Object3D) | undefined;
  if (!o || !mk) return false;
  delete o.userData.make;
  const built = mk();
  /* the children move into the slot's group: they keep the built group's own placement and scale */
  built.updateMatrix();
  for (const c of [...built.children]) { c.applyMatrix4(built.matrix); o.add(c); }
  return true;
}
export const isBuilt = (o: THREE.Object3D | undefined) => !!o && !o.userData.make;

/* the organ a tapped mesh belongs to */
export function organOf(o: THREE.Object3D | null): OrganId | null {
  for (let n = o; n; n = n.parent) if (n.userData?.organ) return n.userData.organ as OrganId;
  return null;
}
