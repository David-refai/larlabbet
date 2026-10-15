/* What a detail model (the heart cut open, the lungs with their airways, the brain) gives the scene. */
import type * as THREE from "three";
import type {V3} from "../geo/sdf";

export interface DetailView {
  /* the point to look at (model space), the radius to fit on screen, and an optional angle */
  target: V3; radius: number; az?: number; polar?: number;
}
export interface DetailModel {
  group: THREE.Group;
  /* label points, one per part id (children of the group, so they move with it) */
  anchors: Record<string, THREE.Object3D>;
  /* what glows when a part is picked */
  glowTargets(part: string): THREE.Object3D[];
  setTab(tab: string): void;
  view(tab: string): DetailView;
  /* moves things; returns true while something moves */
  tick(time: number, dt: number, play: boolean, still: boolean): boolean;
  /* a few particle positions, for the tests */
  sample(): number[];
  /* breathing in or out (shown on the stage), when the model breathes */
  phase?(): "in" | "out" | null;
  /* meshes that can be tapped (userData.part) */
  pickables: THREE.Object3D[];
}
