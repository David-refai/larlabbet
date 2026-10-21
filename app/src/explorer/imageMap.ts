/* "Utforska kroppen", painted pictures: WHERE things are in David's pictures (app/public/body/).
   The full-body layers are 900 × 900 with the same framing (x to the viewer's right, so the body's
   LEFT side is on the viewer's RIGHT). The organ shapes are the tap areas on organs-front.webp; the
   detail pictures have their own pixel units. Every name and text stays in bodyData.ts: labels are
   drawn by code over the pictures, never baked into them. Measured by eye on the pictures. */
import type {DetailId, LayerId, OrganId} from "./bodyData";

export const PIC = (name: string) => `body/${name}.webp`;
export const BODY_SIZE = 900;
/* the whole body on the stage, with a little air around it */
export const BODY_HOME: [number, number, number, number] = [150, 24, 600, 852];
/* the middle of the body: the viewer's left of it is the body's right side */
export const BODY_MID = 452;

/* the picture of each layer (the skin also has a transparent glass body for "inside") */
export const LAYER_PIC: Record<LayerId, string> = {
  skin: "body-front", muscles: "muscles-front", skeleton: "skeleton-front",
  organs: "organs-front", vessels: "vessels-front", nerves: "nerves-front",
};
export const GLASS_PIC = "body-glass";

type Ell = [number, number, number, number];
type Poly = [number, number][];
export interface OrganSpot {
  /* the tap area: ellipses and/or a polygon, in body picture units */
  ell?: Ell[];
  poly?: Poly;
  /* where the name label points */
  at: [number, number];
}
export const ORGAN_SPOTS: Record<OrganId, OrganSpot> = {
  brain: {ell: [[452, 140, 76, 56]], at: [452, 132]},
  lungs: {ell: [[405, 417, 27, 61], [497, 417, 27, 61]], at: [400, 410]},
  heart: {ell: [[457, 422, 27, 38]], at: [462, 425]},
  liver: {poly: [[383, 455], [487, 455], [485, 474], [456, 492], [420, 505], [392, 503], [382, 487]], at: [418, 476]},
  stomach: {poly: [[466, 469], [489, 467], [498, 490], [493, 521], [471, 540], [440, 545], [417, 539], [411, 522], [426, 513], [452, 513], [467, 499]], at: [474, 512]},
  kidneys: {ell: [[398, 499, 15, 24], [504, 499, 14, 24]], at: [505, 500]},
  intestines: {ell: [[450, 588, 68, 57]], at: [440, 590]},
  bladder: {ell: [[450, 651, 19, 17]], at: [450, 652]},
};
/* drawing order of the tap areas: the ones in front come last */
export const SPOT_ORDER: OrganId[] = ["brain", "lungs", "intestines", "liver", "kidneys", "stomach", "heart", "bladder"];

/* the outline of a spot as an SVG path */
export function spotPath(s: OrganSpot): string {
  let d = "";
  for (const [cx, cy, rx, ry] of s.ell || [])
    d += `M${cx - rx} ${cy}a${rx} ${ry} 0 1 0 ${2 * rx} 0a${rx} ${ry} 0 1 0 ${-2 * rx} 0Z`;
  if (s.poly) d += "M" + s.poly.map(p => p.join(" ")).join("L") + "Z";
  return d;
}
export function spotBox(s: OrganSpot): [number, number, number, number] {
  const xs: number[] = [], ys: number[] = [];
  for (const [cx, cy, rx, ry] of s.ell || []) { xs.push(cx - rx, cx + rx); ys.push(cy - ry, cy + ry); }
  for (const [x, y] of s.poly || []) { xs.push(x); ys.push(y); }
  const x0 = Math.min(...xs), y0 = Math.min(...ys);
  return [x0, y0, Math.max(...xs) - x0, Math.max(...ys) - y0];
}

/* ---- the detail views ---- */
export interface PicPart {
  /* the point on the picture, and the radius of its tap area (picture pixels) */
  at: [number, number];
  r: number;
  /* the column of its label, when not the nearer one */
  side?: "l" | "r";
}
export interface DetailPic {
  pic: string;
  size: [number, number];
  parts: Record<string, PicPart>;
  /* the flow paths (picture pixels) and how the dots run along them */
  flows?: {d: string; color: "red" | "blue" | "air" | "signal"; dots: number; dur: number; back?: boolean}[];
}
/* a detail view can show another picture on one of its tabs */
export interface DetailPics {main: DetailPic; tabs?: Record<string, DetailPic>}

const HEART: DetailPic = {
  pic: "heart-inside", size: [406, 570],
  parts: {
    hf: {at: [96, 255], r: 46}, hk: {at: [160, 405], r: 58}, vf: {at: [304, 244], r: 44}, vk: {at: [288, 420], r: 60},
    aorta: {at: [172, 110], r: 34}, lungartar: {at: [345, 156], r: 30}, halvener: {at: [114, 72], r: 30},
    klaffar: {at: [108, 352], r: 22}, "k-tri": {at: [108, 352], r: 22}, "k-pulm": {at: [184, 297], r: 22},
    "k-aorta": {at: [248, 302], r: 22}, "k-mitral": {at: [311, 315], r: 22},
    "f-blue": {at: [96, 255], r: 46}, "f-red": {at: [304, 244], r: 44},
  },
  flows: [
    {d: "M114 20L113 150L98 240L104 330L140 410L196 476L214 420L196 340L186 296L226 250L300 196L398 152", color: "blue", dots: 13, dur: 6},
    {d: "M400 214L330 236L304 268L312 320L300 410L282 478L254 420L248 360L247 300L220 220L196 150L216 96L262 72L314 82", color: "red", dots: 13, dur: 6},
  ],
};
const LUNGS: DetailPic = {
  pic: "lungs-tree", size: [586, 589],
  parts: {
    luftstrupe: {at: [291, 100], r: 34}, luftror: {at: [256, 252], r: 28}, smaror: {at: [130, 420], r: 40},
    lungblasor: {at: [548, 468], r: 30}, hlunga: {at: [80, 260], r: 52}, vlunga: {at: [512, 205], r: 52},
    syre: {at: [100, 478], r: 30}, koldioxid: {at: [484, 488], r: 30},
  },
  flows: [
    {d: "M291 6L291 232L250 266L200 330L150 420L104 482", color: "air", dots: 6, dur: 5, back: true},
    {d: "M291 6L291 232L250 266L188 300L118 292", color: "air", dots: 5, dur: 5, back: true},
    {d: "M291 6L291 232L332 266L392 334L442 432L484 500", color: "air", dots: 6, dur: 5, back: true},
    {d: "M291 6L291 232L332 266L420 302L494 290", color: "air", dots: 5, dur: 5, back: true},
  ],
};
const ALVEOLI: DetailPic = {
  pic: "alveoli", size: [494, 460],
  parts: {lungblasor: {at: [380, 112], r: 90}, syre: {at: [300, 150], r: 26, side: "l"}, koldioxid: {at: [462, 160], r: 26}},
};
const BRAIN: DetailPic = {
  pic: "brain-parts", size: [559, 510],
  parts: {
    storhjarna: {at: [300, 120], r: 60}, lillhjarna: {at: [404, 386], r: 44}, hjarnstam: {at: [296, 404], r: 28},
    ryggmarg: {at: [344, 482], r: 24}, pannlob: {at: [112, 165], r: 56}, syncentrum: {at: [518, 245], r: 40},
    signaler: {at: [236, 150], r: 46},
  },
  flows: [
    {d: "M160 130C230 180 280 260 296 330L304 420L346 508", color: "signal", dots: 5, dur: 3},
    {d: "M346 508L304 420L300 330C320 250 380 180 440 150", color: "signal", dots: 5, dur: 3},
  ],
};

/* the other organs: their own pictures (organ-*.webp) with the parts marked */
const LIVER: DetailPic = {
  pic: "organ-liver", size: [512, 369],
  parts: {hlob: {at: [120, 150], r: 70}, vlob: {at: [410, 130], r: 55}, gallblasa: {at: [178, 315], r: 34}, rensar: {at: [250, 230], r: 40, side: "r"}},
};
const STOMACH: DetailPic = {
  pic: "organ-stomach", size: [540, 580],
  parts: {
    matstrupe: {at: [265, 60], r: 32}, ovremagmun: {at: [300, 170], r: 28, side: "r"}, magvagg: {at: [480, 300], r: 40},
    magsaft: {at: [330, 400], r: 50, side: "r"}, nedremagmun: {at: [118, 440], r: 30}, tolvfinger: {at: [30, 450], r: 24},
  },
};
const INTESTINES: DetailPic = {
  pic: "organ-intestines", size: [531, 618],
  parts: {
    tunntarm: {at: [270, 260], r: 70, side: "r"}, tarmludd: {at: [380, 320], r: 34}, tjocktarm: {at: [250, 95], r: 50, side: "l"},
    blindtarm: {at: [112, 470], r: 26}, andtarm: {at: [262, 560], r: 40},
  },
};
const KIDNEYS: DetailPic = {
  pic: "organ-kidneys", size: [560, 502],
  parts: {
    hnjure: {at: [90, 190], r: 70}, vnjure: {at: [470, 200], r: 70}, njurartar: {at: [345, 165], r: 22, side: "r"},
    njurven: {at: [345, 205], r: 22, side: "r"}, urinledare: {at: [225, 400], r: 24},
  },
};
const BLADDER: DetailPic = {
  pic: "organ-bladder", size: [610, 606],
  parts: {"b-urinledare": {at: [80, 110], r: 30}, blasvagg: {at: [440, 340], r: 70}, slutmuskel: {at: [320, 512], r: 26, side: "l"}, urinror: {at: [322, 575], r: 24, side: "r"}},
};
export const DETAIL_PICS: Record<DetailId, DetailPics> = {
  heart: {main: HEART},
  lungs: {main: LUNGS, tabs: {blasor: ALVEOLI}},
  brain: {main: BRAIN},
  liver: {main: LIVER}, stomach: {main: STOMACH}, intestines: {main: INTESTINES}, kidneys: {main: KIDNEYS}, bladder: {main: BLADDER},
};
export const detailPic = (id: DetailId, tab: string): DetailPic => DETAIL_PICS[id].tabs?.[tab] || DETAIL_PICS[id].main;

/* the colours of the flow dots */
export const FLOW_GRAD: Record<string, string> = {red: "x-dred", blue: "x-dblue", air: "x-dair", signal: "x-dsig"};

/* ---- the bones and muscles on the skeleton and muscle pictures (bodyData.ts BITS) ----
   tap areas in body picture units, both sides of the body where there are two */
export const BIT_SPOTS: Record<string, OrganSpot> = {
  skalle: {ell: [[450, 190, 112, 110]], at: [450, 150]},
  ryggrad: {ell: [[450, 470, 14, 70], [450, 322, 14, 22]], at: [450, 470]},
  revben: {ell: [[392, 425, 46, 58], [508, 425, 46, 58]], at: [380, 420]},
  brostben: {ell: [[450, 405, 13, 46]], at: [450, 395]},
  overarm: {ell: [[338, 405, 24, 50], [562, 405, 24, 50]], at: [338, 400]},
  underarm: {ell: [[282, 478, 22, 38], [618, 478, 22, 38]], at: [282, 478]},
  hand: {ell: [[225, 548, 34, 36], [675, 548, 34, 36]], at: [228, 548]},
  backen: {ell: [[450, 560, 78, 42]], at: [450, 560]},
  larben: {ell: [[393, 630, 22, 48], [507, 630, 22, 48]], at: [393, 630]},
  knaskal: {ell: [[392, 690, 18, 15], [508, 690, 18, 15]], at: [392, 690]},
  underben: {ell: [[393, 750, 18, 42], [507, 750, 18, 42]], at: [393, 755]},
  fot: {ell: [[385, 822, 40, 22], [515, 822, 40, 22]], at: [385, 822]},
  halsmuskel: {ell: [[450, 305, 34, 18]], at: [450, 305]},
  axelmuskel: {ell: [[343, 350, 28, 30], [557, 350, 28, 30]], at: [343, 350]},
  brostmuskel: {ell: [[400, 365, 42, 30], [500, 365, 42, 30]], at: [400, 365]},
  biceps: {ell: [[318, 405, 20, 34], [582, 405, 20, 34]], at: [318, 405]},
  underarmsmuskel: {ell: [[262, 480, 26, 40], [638, 480, 26, 40]], at: [262, 480]},
  magmuskler: {ell: [[450, 455, 48, 62]], at: [450, 455]},
  larmuskel: {ell: [[388, 610, 36, 62], [512, 610, 36, 62]], at: [388, 610]},
  vadmuskel: {ell: [[385, 745, 30, 48], [515, 745, 30, 48]], at: [385, 745]},
};
