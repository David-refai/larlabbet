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
  about?: string};
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
export const chapterOf = (lessonId: string) => CHAPTERS.find(c => c.lessons.includes(lessonId));

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
    const ids = practisable(c.lessons);
    if (c.exam) { const X = byId(c.exam); if (X && X.exam) out.push({id: c.exam, kind: "chapter", subject, year, title: c.title, ids: X.exam.ids, n: X.exam.n, needs: c.lessons}); }
    else if (ids.length >= 2) out.push({id: "prov-" + c.id, kind: "chapter", subject, year, title: c.title, ids, n: nFor(ids.length), needs: c.lessons});
  }
  const all = practisable(cs.flatMap(c => c.lessons));
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
