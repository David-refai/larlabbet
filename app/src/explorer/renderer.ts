/* The renderer interface of the 2.5D SVG explorer of "Utforska kroppen" (svgRenderer.ts): the screen
   (ui/BodyExplorer.tsx) drives it through these calls. The 3D explorer (explorer/3d/Explorer3D.tsx)
   does not implement this interface: it is a React component that gets the same state as props
   (layers, selection, isolation, detail, tab, part, flow) and reports taps through the same Pick.
   Both use the ids of bodyData.ts. */
import type {LayerId, OrganId, DetailId} from "./bodyData";

export type Pick = {kind: "organ"; id: OrganId} | {kind: "part"; id: string} | {kind: "bit"; id: string};

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
  /* zoom to a tapped bone or muscle on the skeleton or muscle picture (null: the whole body); painted pictures only */
  focusBit?(id: string | null): void;
  /* the pupil tapped an organ, a part, or a bone or muscle */
  onPick(cb: (p: Pick) => void): void;
  destroy(): void;
}

export const reducedMotion = () => typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
