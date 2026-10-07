/* Svenska units as typed data. A unit file (app/src/lessons/sv8a.ts …) imports from here only:
     import {defineUnit, word, t3, A, qt, boxes, pic, kid, …} from "../svenska/unit";
   Stories, words and reading questions are plain data; grammar scenes and the grammar
   exercise generator stay small functions. defineUnit() checks the data and registers the unit. */
import * as core from "../legacy/core.js";
import * as sv from "../lessons/sv-0engine.js";

export type T3 = {sv: string; en: string; ar: string};
/** one drawing command on the whiteboard (A.tx, A.p, A.arrow, A.hl …) */
export type Draw = {t: string; [k: string]: unknown};
export type Scene = {draw: () => (Draw | Draw[])[]; say: T3};

/** a practice problem as the engine poses it */
export type Problem =
  | {kind: "choice"; opts: string[]; ans: number; show: string; q: Draw[]; sol: Draw[]; hint?: {say: T3; draw: Draw[]}}
  | {kind: "text"; ans: string[]; show: string; q: Draw[]; sol: Draw[]; hint?: {say: T3; draw: Draw[]}};

export type WordIn = {
  /** the word as shown, with en/ett for nouns: "vittne (ett)" */
  sv: string;
  /** regex source for the forms used in stories, matched as a whole word: "vittne(t|n|na)?" */
  m: string;
  /** simple meaning in Swedish, English, Arabic */
  d: T3;
  /** an example sentence */
  ex: string;
  tr: {en: string; ar: string};
  syn?: string[]; opp?: string[]; wrong?: string[];
  /** a gap sentence: [before, the word as it fits, after] */
  gap?: [string, string, string];
  /** the form other questions may offer as a wrong option in a gap */
  gapForm?: string;
  /** the word's forms: "ett vittne – vittnen" */
  form?: string;
};
export type ReadQ = {q: string; o: [string, string, string]; why: string};
export type StoryPart = {text: string[]; pic: string; say: T3};

export type Unit = {
  id: string; year: number; ord: number;
  title: T3; storyTitle: string;
  /** 320×180 SVG for the lesson card */
  icon: string;
  /** keys of this unit's 8 new words (defined with word()) */
  words: string[];
  /** keys of grammar terms (also defined with word()) */
  terms?: string[];
  story: StoryPart[];
  wordsSay: T3;
  grammar: Scene[];
  read: ReadQ[];
  gram?: (lv: number, write?: boolean) => Problem | null;
  help: Scene[];
};

const E = core as Record<string, any>, V = sv as Record<string, any>;
export const t3 = E.t3 as (sv: string, en: string, ar: string) => T3;
export const L = E.L as (o: T3 | string) => string;
export const A = E.A as {
  p(d: string, c?: string, w?: number): Draw; tx(s: string | number, x: number, y: number, size?: number, c?: string, anchor?: string): Draw;
  arrow(x1: number, y1: number, x2: number, y2: number, c?: string, bend?: number): Draw; loop(cx: number, cy: number, rx: number, ry: number, c?: string): Draw;
  hl(x: number, y: number, w: number, h: number): Draw; band(x: number, y: number, w: number, h: number, c: string): Draw; wipe(): Draw;
};
export const R = E.R as Record<string, (...a: number[]) => string>;
export const qt = E.qt as (s: string, x: number, y: number, size?: number, c?: string) => Draw;
export const pick = E.pick as <T>(a: T[]) => T;
export const shuffle = E.shuffle as <T>(a: T[]) => T[];
export const rint = E.rint as (a: number, b: number) => number;
export const svLines = V.svLines as (s: string, y: number, size?: number, c?: string, max?: number) => Draw[];
const H = V.SVH as Record<string, any>;
/** sentence parts in coloured boxes: [[text, colour, label], …] centred on the board */
export const boxes = H.boxes as (parts: [string, string | null, string?][], y: number, size?: number) => Draw[];
export const pic = H.pic as (body: string, bg?: string) => string;
export const kid = H.kid as (x: number, y: number, shirt: string, hair: string, s?: number) => string;
export const sent = H.sent as (a: (string | null | undefined)[]) => string;
export const cap = H.cap as (s: string) => string;

/** a word that comes back in later stories (a TERM marked sw) */
export function word(key: string, w: WordIn) {
  if (E.TERMS[key]) throw new Error(`word key "${key}" is already used`);
  H.W(key, {...w, m: H.rx(w.m)});
}

/* checks that catch the usual slips before a pupil does */
function check(u: Unit) {
  const bad: string[] = [], txt = u.story.flatMap(p => p.text).join(" ");
  if (u.words.length !== 8) bad.push(`${u.words.length} new words, not 8`);
  for (const k of [...u.words, ...(u.terms || [])]) {
    const w = E.TERMS[k];
    if (!w) { bad.push(`word "${k}" is not defined`); continue; }
    if (u.words.includes(k) && !new RegExp(w.m.source, "i").test(txt)) bad.push(`"${w.sv}" does not occur in the story`);
  }
  if (!u.story[0].text.some(t => u.words.some(k => new RegExp(E.TERMS[k].m.source, "i").test(t)))) bad.push("no new word in story part 1");
  u.read.forEach((r, i) => { if (new Set(r.o).size !== 3) bad.push(`read question ${i + 1} repeats an option`); });
  if (bad.length) throw new Error(`Svenska unit ${u.id}: ${bad.join("; ")}`);
}

export function defineUnit(u: Unit) {
  check(u);
  E.LESSONS.push(V.svUnit({...u, pic: H.pic("")}));
}
