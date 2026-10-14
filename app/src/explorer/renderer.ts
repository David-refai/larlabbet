/* The renderer interface of "Utforska kroppen". The screen (ui/BodyExplorer.tsx) only talks to a
   renderer through this, so the 2.5D SVG one (svgRenderer.ts) can later be swapped for a 3D one
   (Three.js) that maps the same ids from bodyData.ts to meshes. */
import type {LayerId, OrganId, DetailId} from "./bodyData";

export type Pick = {kind: "organ"; id: OrganId} | {kind: "part"; id: string};

export interface BodyRenderer {
  /* draw into el (the renderer owns everything inside it) */
  mount(el: HTMLElement): void;
  /* which layers show; the rest fade away */
  setLayers(on: Set<LayerId>): void;
  /* glow one organ (null: none) */
  select(id: OrganId | null): void;
  /* organs the pupil has hidden with "Dölj" */
  hide(ids: Set<OrganId>): void;
  /* zoom to one organ while the rest of the body fades back (null: the whole body) */
  isolate(id: OrganId | null): void;
  /* open an organ's detail view on a tab (null: back to the body) */
  detail(id: DetailId | null, tab?: string): void;
  /* glow one labelled part in the detail view */
  selectPart(id: string | null): void;
  /* run or pause the flow animation (blood, air, signals) */
  setFlow(play: boolean): void;
  /* the pupil tapped an organ or a part */
  onPick(cb: (p: Pick) => void): void;
  destroy(): void;
}

export const reducedMotion = () => typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
