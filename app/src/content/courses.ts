/* The course registry: the subjects, and for each school year the chapters of a subject in teaching order.
   Lessons stay in LESSONS (found by id); a chapter only lists lesson ids. Tests (prov) are made here from the
   chapters: one per chapter, one for the whole subject in a year, and one a parent puts together.
   A year with no chapters written here gets one chapter holding that year's lessons, so every year still works. */
import {LESSONS, COURSES, S, isDone, t3, save} from "../legacy/core.js";

export type Subject = {id: string; name: string; icon: string; no?: boolean; soon?: boolean; of: (l: Lesson) => boolean};
export type Lesson = {id: string; subject?: string; year?: number; ord?: number; title: unknown; icon: string; grades: string;
  steps: unknown[]; gen?: unknown; exam?: {ids: string[]; n: number}; kind?: string};
export type Chapter = {id: string; subject: string; year: number; title: string; lessons: string[]; exam?: string;
  /* what the chapter covers, shown while it has no lessons yet */
  about?: string;
  /* "Lär mer": harder lessons after the base ones; not needed to open the chapter test */
  more?: string[]};
export type Exam = {id: string; kind: "chapter" | "subject" | "own"; subject: string; year: number; title: string; ids: string[]; n: number;
  /* the lessons that must be done first */
  needs: string[]};

/* NO lessons written before the split say subject "science"; the chapters below say which of the three they belong to */
export const SUBJ: Subject[] = [
  {id: "math", name: "Matte", icon: "🔢", of: l => l.subject === "math"},
  {id: "swedish", name: "Svenska", icon: "📖", of: l => l.subject === "swedish"},
  {id: "bio", name: "Biologi", icon: "🌱", no: true, of: () => false},
  {id: "fys", name: "Fysik", icon: "🧲", no: true, of: () => false},
  {id: "kemi", name: "Kemi", icon: "⚗️", no: true, of: () => false},
  {id: "english", name: "Engelska", icon: "💬", soon: true, of: l => l.subject === "english"},
];
export const subj = (id: string) => SUBJ.find(s => s.id === id) || SUBJ[0];

const ch = (subject: string, year: number, id: string, title: string, lessons: string[], more: Partial<Chapter> = {}): Chapter =>
  ({id, subject, year, title, lessons, ...more});

/* ---------- Årskurs 4 ---------- */
const CHAPTERS: Chapter[] = [
  ch("math", 4, "m4-tal", "Tal och positionssystem", ["pv4", "round"]),
  ch("math", 4, "m4-rakna", "Räkna: plus, minus, gånger och delat", ["placevalue", "sub", "mul", "div"]),
  ch("math", 4, "m4-brak", "Bråk och decimaltal", ["fractions", "dec"]),
  ch("math", 4, "m4-mat", "Mätning och tid", ["len", "time", "area"]),
  ch("math", 4, "m4-geo", "Geometri", ["shapes", "triangle"]),
  ch("math", 4, "m4-stat", "Statistik och mönster", ["stats", "alg"]),

  ch("swedish", 4, "sv4-ord", "Ord som ändrar form", ["sv4a", "sv4b", "sv4c", "sv4d"]),
  ch("swedish", 4, "sv4-men", "Frågor, adjektiv och meningar", ["sv4e", "sv4f", "sv4g", "sv4h"]),
  ch("swedish", 4, "sv4-sma", "Små ord, tid och oregelbundna verb", ["sv4i", "sv4j", "sv4k", "sv4l"]),

  ch("bio", 4, "bio4-kropp", "Människokroppen", ["no4a", "no4b", "no4c", "no4d", "no4e", "no4f", "no4g"], {exam: "prov4kropp"}),
  ch("bio", 4, "bio4-natur", "Djur, växter och ekosystem", ["bio4h", "bio4i", "bio4j", "bio4k", "bio4l", "bio4m"]),

  ch("fys", 4, "fys4-kraft", "Krafter och rörelse", ["friction"],
    {about: "Tyngdkraft, friktion, magneter och hur saker sätts i rörelse."}),
  ch("fys", 4, "fys4-ljus", "Ljus och ljud", [],
    {about: "Hur ljus sprids och speglas, skuggor, och hur ljud uppstår och hörs."}),
  ch("fys", 4, "fys4-rymd", "Jorden och rymden", ["daynight"],
    {about: "Dag och natt, årstider, månens faser och vårt solsystem."}),

  ch("kemi", 4, "kemi4-amnen", "Ämnen, vatten och luft", ["matter"],
    {about: "Fast, flytande och gas, vattnets kretslopp, luft och blandningar."}),

  /* ---------- Årskurs 7: Fysik, in the order of the school book (Titano Fysik, åk 7-9: first four chapters) ---------- */
  ch("fys", 7, "fys7-materia", "Materia", ["f7m1", "f7m2", "f7m3", "f7m4", "f7m5"],
    {more: ["f7m6", "f7m7", "f7m8"], about: "Naturvetenskapligt arbetssätt, atomer och molekyler, densitet, elektrisk laddning och att ingenting försvinner."}),
  ch("fys", 7, "fys7-varme", "Värme och klimat", ["f7v1", "f7v2", "f7v3", "f7v4", "f7v5"],
    {more: ["f7v6", "f7v7", "f7v8"], about: "Temperatur och värme, vattnets egenskaper, hur värme sprids, klimat och växthuseffekten."}),
  ch("fys", 7, "fys7-kraft", "Kraft och rörelse", ["f7k1", "f7k2", "f7k3", "f7k4", "f7k5", "f7k6", "f7k7", "f7k8"],
    {more: ["f7k9", "f7k10", "f7k11", "f7k12"], about: "Tyngdkraft, fart, pendeln, krafter, friktion, tyngdpunkt och enkla maskiner."}),
  ch("fys", 7, "fys7-tryck", "Tryck", ["f7t1", "f7t2", "f7t3", "f7t4", "f7t5", "f7t6"],
    {more: ["f7t7", "f7t8"], about: "Tryck mot en yta, lufttryck, vattentryck, lyftkraft och Arkimedes princip."}),
];

const byId = (id: string): Lesson | undefined => LESSONS.find((l: Lesson) => l.id === id);
const sortOrd = (a: Lesson, b: Lesson) => (a.ord || 99) - (b.ord || 99);

/* the chapters of a subject in a year: written above, else one chapter with the year's lessons */
export function chapters(subject: string, year: number): Chapter[] {
  const own = CHAPTERS.filter(c => c.subject === subject && c.year === year);
  if (own.length) return own;
  const s = subj(subject), list = subject === "math" ? (COURSES[year] || []) as string[]
    : LESSONS.filter((l: Lesson) => s.of(l) && l.year === year && !l.exam).sort(sortOrd).map((l: Lesson) => l.id);
  return list.length ? [ch(subject, year, `${subject}${year}-all`, `Årskurs ${year}`, list)] : [];
}
/* the years a subject has anything for (chapters to come count, so the plan shows) */
export function yearsOf(subject: string): number[] {
  const ys = new Set<number>(CHAPTERS.filter(c => c.subject === subject).map(c => c.year));
  if (subject === "math") Object.keys(COURSES).map(Number).forEach(y => ys.add(y));
  else LESSONS.forEach((l: Lesson) => { if (subj(subject).of(l) && l.year) ys.add(l.year); });
  return [...ys].sort((a, b) => a - b);
}
export const lessonsOf = (c: Chapter): Lesson[] => c.lessons.map(byId).filter(Boolean) as Lesson[];
export const moreOf = (c: Chapter): Lesson[] => (c.more || []).map(byId).filter(Boolean) as Lesson[];
export const chapterOf = (lessonId: string) => CHAPTERS.find(c => c.lessons.includes(lessonId) || (c.more || []).includes(lessonId));

/* the year shown for a subject: the one picked, else the child's own, else the nearest below it, else the first */
const picked: Record<string, number> = {};
export function yearFor(subject: string): number | null {
  const ys = yearsOf(subject), p = picked[subject + ":" + S.id];
  if (p && ys.includes(p)) return p;
  if (ys.includes(S.grade)) return S.grade;
  return ys.filter(y => y <= (S.grade || 4)).pop() || ys[0] || null;
}
export const pickYear = (subject: string, y: number) => { picked[subject + ":" + S.id] = y; };

/* ---------- tests ---------- */
const practisable = (ids: string[]) => ids.filter(id => { const l = byId(id); return !!l && !!l.gen; });
const nFor = (k: number) => Math.max(8, Math.min(20, 4 * k));
export function examsOf(subject: string, year: number): Exam[] {
  const cs = chapters(subject, year), out: Exam[] = [];
  for (const c of cs) {
    const ids = practisable([...c.lessons, ...(c.more || [])]);
    if (c.exam) { const X = byId(c.exam); if (X && X.exam) out.push({id: c.exam, kind: "chapter", subject, year, title: c.title, ids: X.exam.ids, n: X.exam.n, needs: c.lessons}); }
    else if (ids.length >= 2) out.push({id: "prov-" + c.id, kind: "chapter", subject, year, title: c.title, ids, n: nFor(ids.length), needs: c.lessons});
  }
  const all = practisable(cs.flatMap(c => [...c.lessons, ...(c.more || [])]));
  if (out.length >= 2) out.push({id: `prov-${subject}${year}`, kind: "subject", subject, year, title: `${subj(subject).name}, hela årskurs ${year}`,
    ids: all, n: 20, needs: cs.flatMap(c => c.lessons)});
  return out;
}
/* the test a parent put together (S.ownExam); open at once */
export function ownExam(): Exam | null {
  const o = S.ownExam as {ids: string[]; n: number} | undefined;
  if (!o || !o.ids || !practisable(o.ids).length) return null;
  return {id: "prov-eget", kind: "own", subject: "", year: S.grade, title: "Eget prov", ids: practisable(o.ids), n: o.n || 10, needs: []};
}
export const examLeft = (e: Exam) => e.needs.filter(id => byId(id) && !isDone(id)).length;
export const examOpen = (e: Exam) => e.kind === "own" || examLeft(e) === 0 || !!(S.unlock && S.unlock[e.id]) || !!(S.exams && S.exams[e.id]);
export function setUnlock(id: string, on: boolean) { S.unlock = Object.assign({}, S.unlock); if (on) S.unlock[id] = 1; else delete S.unlock[id]; save(); }

/* the exam screen in the engine finds a test in LESSONS; made ones are (re)written there before they open */
export function register(e: Exam) {
  const subjOf = (byId(e.ids[0]) || {subject: e.subject}).subject;
  const entry = {id: e.id, kind: "exam", subject: subjOf, year: e.year, grades: String(e.year), title: t3(e.title, e.title, e.title),
    icon: "", steps: [], exam: {ids: e.ids, n: e.n}};
  const k = LESSONS.findIndex((l: Lesson) => l.id === e.id);
  if (k < 0) LESSONS.push(entry);
  else if (e.id.startsWith("prov-")) LESSONS[k] = entry;
}

/* ---------- Snabbmatte: one lesson per topic, all years; a topic without a lesson yet shows as coming ---------- */
export type QTopic = {id: string; lesson?: string; name: string; icon: string; about: string};
export const QUICK: QTopic[] = [
  {id: "brak", lesson: "qbrak", name: "Bråk", icon: "🍕", about: "Förlänga och förkorta, plus, minus, gånger, delat och blandad form."},
  {id: "dec", lesson: "qdec", name: "Decimaltal", icon: "🔟", about: "Tiondelar och hundradelar, de fyra räknesätten och avrundning."},
  {id: "proc", lesson: "qproc", name: "Procent", icon: "💯", about: "Procent, bråk och decimaltal, procent av, hur många procent, ökning och minskning."},
  {id: "prop", lesson: "qprop", name: "Förhållande och proportion", icon: "⚖️", about: "Förhållande, dela i förhållande, korsmultiplikation och skala."},
  {id: "rot", lesson: "qrot", name: "Potenser och roten ur", icon: "√", about: "Kvadrater, kvadratrötter, potenser och tiopotenser."},
  {id: "geo", lesson: "qgeo", name: "Geometri", icon: "📐", about: "Omkrets, area av rektangel, triangel och cirkel, radie och diameter, volym och liter."},
  {id: "koord", lesson: "qkoord", name: "Koordinatsystem", icon: "📍", about: "Axlar, punkter, fyra kvadranter och avstånd."},
];
export const quickLesson = (t: QTopic): Lesson | undefined => t.lesson ? byId(t.lesson) : undefined;

/* ---------- Engelsk grammatik: one lesson per topic, units in order like a grammar book; sec groups them on the page ---------- */
export type GTopic = QTopic & {sec: string; lv: string};
export const GRAM: GTopic[] = [
  {sec: "Verb och tid", id: "gpres", lesson: "egpres", name: "Present", icon: "⏱️", lv: "A1–A2", about: "Am/is/are, present simple, present continuous och skillnaden mellan dem."},
  {sec: "Verb och tid", id: "gpast", lesson: "egpast", name: "Past", icon: "⏮️", lv: "A1–B1", about: "Was/were, past simple, oregelbundna verb, past continuous och used to."},
  {sec: "Verb och tid", id: "gperf", lesson: "egperf", name: "Perfect", icon: "🔗", lv: "A2–B2", about: "Present perfect, for och since, perfect eller past, perfect continuous och past perfect."},
  {sec: "Verb och tid", id: "gfut", lesson: "egfut", name: "Future", icon: "⏭️", lv: "A2–B2", about: "Going to, will, present för planer, future continuous och future perfect."},
  {sec: "Modala verb och if", id: "gmod", lesson: "egmod", name: "Modal verbs", icon: "🗝️", lv: "A1–B2", about: "Can, could, must, have to, should, may, might och modal + have done."},
  {sec: "Modala verb och if", id: "gif", lesson: "egif", name: "If and wish", icon: "🔀", lv: "A2–B2", about: "Zero, first, second och third conditional, unless och wish."},
  {sec: "Passiv, indirekt tal och frågor", id: "gpass", lesson: "egpass", name: "Passive", icon: "🔄", lv: "B1–B2", about: "Passiv i olika tider, by + den som gör det, have something done."},
  {sec: "Passiv, indirekt tal och frågor", id: "grep", lesson: "egrep", name: "Reported speech", icon: "💬", lv: "B1–B2", about: "Said och told, tiden flyttas bakåt, frågor och uppmaningar."},
  {sec: "Passiv, indirekt tal och frågor", id: "gq", lesson: "egq", name: "Questions", icon: "❓", lv: "A1–B2", about: "Ja/nej-frågor, frågeord, subjektsfrågor, question tags och indirekta frågor."},
  {sec: "Verbmönster", id: "gverb", lesson: "egverb", name: "-ing and to", icon: "➰", lv: "A2–B2", about: "Verb + -ing, verb + to, verb + person + to och preposition + -ing."},
  {sec: "Substantiv, artiklar och pronomen", id: "gnoun", lesson: "egnoun", name: "Nouns and articles", icon: "📦", lv: "A1–B1", about: "Plural, räknebara och oräknebara, a/an, the eller ingen artikel, some/any, much/many."},
  {sec: "Substantiv, artiklar och pronomen", id: "gpron", lesson: "egpron", name: "Pronouns", icon: "👥", lv: "A1–B1", about: "I/me/my/mine, genitiv -'s, myself, this/that och somebody/anything."},
  {sec: "Adjektiv, adverb och prepositioner", id: "gadj", lesson: "egadj", name: "Adjectives and adverbs", icon: "🎨", lv: "A1–B2", about: "Komparation, as ... as, adverb, too och enough, -ed och -ing."},
  {sec: "Adjektiv, adverb och prepositioner", id: "gprep", lesson: "egprep", name: "Prepositions", icon: "📍", lv: "A1–B1", about: "In/on/at för tid och plats, rörelse, for/since/during och adjektiv + preposition."},
  {sec: "Meningar", id: "grel", lesson: "egrel", name: "Relative clauses and linking words", icon: "🧩", lv: "A2–B2", about: "Who, which, that, whose, where och bindeord som because, although och unless."},
  {sec: "Meningar", id: "gword", lesson: "egword", name: "Word order", icon: "🔢", lv: "A1–B1", about: "Ordföljd, adverb som always, there is/are, still/yet/already och imperativ."},
];
