/* The lesson map: subject tabs, the placement offer, daily review / notebook / badges,
   the year's course with progress, and one card per lesson. */
import {Owl} from "./Owl";
import {Html} from "./Html";
import {showReact} from "./mount";
import {YearSeg} from "./YearSeg";
import {SUBJ, subj, chapters, lessonsOf, yearsOf, yearFor, pickYear, examsOf, ownExam, examOpen, examLeft, register} from "../content/courses";
import type {Chapter, Exam} from "../content/courses";
import {
  T, L, S, BADGES, tabNow, setTab, save, toast,
  years, yearNow, course4, allCourse, nextLesson, isDone, placeOf, revDue, today, streakNow, memState,
  lesson, drill, badges, parents, map, explorer, ACC,
} from "../legacy/core.js";

type Lesson = {id: string; ord?: number; year?: number; subject?: string; title: unknown; icon: string; grades: string; steps: unknown[]; gen?: unknown; exam?: {n: number; ids: string[]}};

function Card({l, n, here}: {l: Lesson; n: number; here: boolean}) {
  const p = S.lessons[l.id] || {}, st: number = p.stars || 0, kn = !st && p.known, mem = memState(l.id);
  return <button className={"card" + (here ? " here" : "")} data-l={l.id} onClick={() => lesson(l.id)}>
    <div className="art">
      <span className={"ord" + (st ? " ok" : kn ? " kn" : "")}>{st || kn ? "✓" : n}</span>
      {here && <span className="ribbon">{T("startHere")}</span>}
      <Html html={l.icon} />
    </div>
    <div className="meta">
      <h3>{L(l.title)}</h3>
      <span className="muted" style={{fontSize: ".88rem"}}>{T("forGrades")(l.grades)} · {l.exam ? "📝 " + T("examQs")(l.exam.n) : T("scenes")(l.steps.length)}</span>
      {l.exam && S.exams && S.exams[l.id] && <span className="muted" style={{fontSize: ".88rem"}}>{T("examBest")(S.exams[l.id].best, S.exams[l.id].tries)}</span>}
      {kn ? <span className="kntag">✓ {T("known")}</span>
        : <span className="stars">{[0, 1, 2].map(i => <span key={i} className={i < st ? "" : "off"}>★</span>)}</span>}
      {mem && <span className={"mem " + mem}>{T("mem")[mem]}</span>}
    </div>
  </button>;
}

/* Swedish only on screen (the translation setting does not reach these short labels) */
const LM = {lessons: "Lektioner", prov: "Prov", chapter: (k: number) => `Kapitel ${k}`, of: (a: number, b: number) => `${a} av ${b} klara`,
  soon: "Kommer snart", provNote: "Proven ger inga ledtrådar. Du ser svaren när provet är klart.",
  kinds: {chapter: "Kapitelprov", subject: "Ämnesprov", own: "Eget prov"} as Record<string, string>, qs: (n: number) => `${n} frågor`,
  left: (n: number) => n === 1 ? "1 lektion kvar" : `${n} lektioner kvar`, ready: "Redo att göras", best: (b: number, t: number) => `Bäst ${b} % · ${t} ${t === 1 ? "gång" : "gånger"}`,
  locked: "Gör klart lektionerna i kapitlet först. En förälder kan låsa upp provet på föräldrasidan.", ownBy: "Ett prov som en förälder har satt ihop",
  explore: "Utforska kroppen", exploreS: "Titta inuti kroppen: muskler, skelett, organ, blodkärl och nerver. Öppna hjärtat, lungorna och hjärnan.",
  noProv: "Inga prov för den här årskursen ännu.", noYear: (s: string) => `${s} finns inte för din årskurs ännu.`};

/* lessons or tests; kept while the app is open */
let mode: "les" | "prov" = "les";

function ExamCard({e}: {e: Exam}) {
  const open = examOpen(e), left = examLeft(e), r = S.exams && S.exams[e.id];
  return <button className={"card excard" + (open ? "" : " locked")} data-e={e.id}
    onClick={() => { if (!open) { toast(LM.locked); return; } register(e); lesson(e.id); }}>
    <div className="exart"><span>{open ? "📝" : "🔒"}</span></div>
    <div className="meta"><span className="label">{LM.kinds[e.kind]}</span><h3>{e.title}</h3>
      <span className="muted" style={{fontSize: ".88rem"}}>{LM.qs(e.n)}{e.kind === "own" ? " · " + LM.ownBy : ""}</span>
      {r ? <span className="exbest">{LM.best(r.best, r.tries)}</span> : <span className="muted" style={{fontSize: ".88rem", fontWeight: 700}}>{open ? LM.ready : LM.left(left)}</span>}
    </div></button>;
}

function YearPick({ys, y, on}: {ys: number[]; y: number; on: (y: number) => void}) {
  if (ys.length < 2) return null;
  return <div className="seg yseg" id="years" role="group">{ys.map(v =>
    <button key={v} data-y={v} aria-pressed={v === y} onClick={() => on(v)}>{T("gradeChip")(v)}</button>)}</div>;
}

function ProvView() {
  const ys = [...new Set(SUBJ.flatMap(s => yearsOf(s.id)))].sort((a, b) => a - b);
  const Y = yearFor("prov") && ys.includes(yearFor("prov") as number) ? yearFor("prov") as number : ys.filter(y => y <= (S.grade || 4)).pop() || ys[0];
  const own = ownExam(), groups = SUBJ.map(s => ({s, ex: examsOf(s.id, Y)})).filter(g => g.ex.length);
  return <>
    <div className="course"><div className="stack" style={{gap: 6}}><h2>📝 {LM.prov} · {T("gradeChip")(Y)}</h2><p className="muted">{LM.provNote}</p>
      <YearPick ys={ys} y={Y} on={v => { pickYear("prov", v); map(); }} /></div></div>
    {own && <div className="cards"><ExamCard e={own} /></div>}
    {groups.length ? groups.map(g => <section key={g.s.id} className="chap stack" data-s={g.s.id}>
      <h2 className="chead">{g.s.icon} {g.s.name}</h2>
      <div className="cards">{g.ex.map(e => <ExamCard key={e.id} e={e} />)}</div></section>)
      : <div className="empty">{LM.noProv}</div>}
  </>;
}

function LessonMap() {
  if (!SUBJ.some(s => s.id === tabNow)) setTab(tabNow === "science" ? "bio" : "math");
  const sub = subj(tabNow), math = tabNow === "math";
  const ys = math ? years() as number[] : yearsOf(tabNow), Y: number | null = math ? yearNow() : yearFor(tabNow);
  const chs: Chapter[] = Y ? chapters(tabNow, Y) : [];
  const all = chs.flatMap(lessonsOf), done = all.filter(l => isDone(l.id)).length;
  const nx: Lesson | null = !all.length ? null : math ? nextLesson() : all.find(l => !isDone(l.id)) || null;
  const anyDone = course4().some((l: Lesson) => { const p = S.lessons[l.id]; return p && (p.stars || p.known || p.seen); });
  const nMist = Object.keys(S.mist).length, canDaily = allCourse().some((l: Lesson) => l.gen && isDone(l.id));
  const dailyToday = S.daily.last === today(), nB = Object.keys(S.badges).length, due = revDue().length, streak = streakNow();
  const pct = all.length ? Math.round(100 * done / all.length) : 0, MY: number = yearNow();
  let num = 0;
  return <div className="stack">
    <h1>{T("greet")(S.name)}</h1>
    <div className="seg modeseg" id="mode" role="group">
      <button data-m="les" aria-pressed={mode === "les"} onClick={() => { mode = "les"; map(); }}>📚 {LM.lessons}</button>
      <button data-m="prov" aria-pressed={mode === "prov"} onClick={() => { mode = "prov"; map(); }}>📝 {LM.prov}</button></div>

    {mode === "prov" ? <ProvView /> : <>
    <div className="tabs" role="tablist">{SUBJ.map(s =>
      <button key={s.id} className={"tab" + (s.no ? " notab" : "")} role="tab" data-t={s.id} aria-selected={s.id === tabNow} onClick={() => { setTab(s.id); map(); }}>
        {s.name}{s.soon && <span className="soon">{T("soon")}</span>}</button>)}</div>

    {math && !placeOf(MY) && !anyDone && <section className="hero"><Owl /><div className="stack" style={{gap: 8}}>
      <h2>{T("placeHero")}</h2><p>{T("placeText")}</p>
      <div className="row">
        <button className="btn" id="pgo" onClick={() => drill("place")}>🧭 {T("placeGo")}</button>
        <button className="btn ghost" id="pskip" onClick={() => { S.places = Object.assign({}, S.places, {[MY]: {skipped: true}}); save(); map(); }}>{T("placeSkip")}</button>
      </div></div></section>}

    {math && <div className="tools3">
      <button className={"tool" + (canDaily ? "" : " dim")} id="tdaily" onClick={() => canDaily ? drill("daily") : toast(T("dailyNeed"))}>
        <span className="ti">☀️</span><span><b>{T("dailyT")}</b>
          <span className="muted">{due ? T("dueN")(due) : dailyToday ? T("dailyDone") : canDaily ? T("dailyS") : T("dailyNeed")}</span>
          {streak ? <span className="streak">{T("streakN")(streak)}</span> : null}</span></button>
      <button className={"tool" + (nMist ? "" : " dim")} id="tnotes" onClick={() => nMist ? drill("notes") : toast(T("notesS")(0))}>
        <span className="ti">📒</span><span><b>{T("notesT")}{nMist ? <> <span className="cnt">{nMist}</span></> : null}</b>
          <span className="muted">{T("notesS")(nMist)}</span></span></button>
      <button className="tool" id="tbadges" onClick={badges}>
        <span className="ti">🏅</span><span><b>{T("badgesT")}</b><span className="muted">{T("badgesS")(nB, BADGES.length)}</span>
          <span className="bmini">{BADGES.filter((b: {id: string}) => S.badges[b.id]).map((b: {icon: string}) => b.icon).join("")}</span></span></button>
    </div>}

    {tabNow === "bio" && <div className="tools3 xtools">
      <button className="tool xtool" id="texplore" onClick={() => explorer()}>
        <span className="ti" aria-hidden="true">🔬</span><span><b>{LM.explore}</b><span className="muted">{LM.exploreS}</span></span></button></div>}

    {!math && S.grade && Y !== S.grade && <div className="empty" id="subsoon">🚧 {sub.soon || !Y ? LM.noYear(sub.name) : T("subSoon")(sub.name, S.grade)}</div>}

    {Y && chs.length > 0 && <div className="course">
      <div className="stack" style={{gap: 6}}>
        <h2>{sub.icon} {sub.name} · {T("gradeChip")(Y)}</h2>
        <p className="muted">{T("courseNote")}</p>
        {math ? <YearSeg again={map} /> : <YearPick ys={ys} y={Y} on={v => { pickYear(tabNow, v); map(); }} />}</div>
      {all.length > 0 && <div className="cprog"><span>{T("courseDone")(done, all.length)}</span><i><b style={{width: pct + "%"}} /></i></div>}
    </div>}

    {chs.map((c, k) => { const ls = lessonsOf(c), cd = ls.filter(l => isDone(l.id)).length;
      return <section key={c.id} className="chap stack" data-c={c.id}>
        <div className="chead"><span className="label">{LM.chapter(k + 1)}</span><h2>{c.title}</h2>
          {ls.length > 0 && <span className="muted">{LM.of(cd, ls.length)}</span>}</div>
        {ls.length ? <div className="cards">{ls.map(l => <Card key={l.id} l={l} n={++num} here={!!nx && nx.id === l.id} />)}</div>
          : <div className="empty csoon">🚧 <b>{LM.soon}</b>{c.about && <span>{c.about}</span>}</div>}
      </section>; })}
    {Y && !chs.length && <div className="empty">{T("empty")}</div>}

    {math && <div className="row" style={{justifyContent: "center"}}>
      {!ACC.kid && <button className="btn ghost" id="tpar" onClick={parents}>👪 {T("parentsT")}</button>}
      {(placeOf(MY) || anyDone) && <button className="btn ghost" id="tplace" onClick={() => drill("place")}>🧭 {T("placeRedo")}</button>}
    </div>}
    </>}
  </div>;
}

export const showMap = () => showReact(<LessonMap />);
