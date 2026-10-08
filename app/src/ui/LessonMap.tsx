/* The lesson map: subject tabs, the placement offer, daily review / notebook / badges,
   the year's course with progress, and one card per lesson. */
import {Owl} from "./Owl";
import {Html} from "./Html";
import {showReact} from "./mount";
import {YearSeg} from "./YearSeg";
import {
  T, L, S, LESSONS, SUBJECTS, BADGES, tabNow, setTab, save, toast,
  yearNow, courseOf, course4, allCourse, nextLesson, isDone, placeOf, revDue, today, streakNow, memState,
  lesson, drill, badges, parents, map,
} from "../legacy/core.js";

type Lesson = {id: string; ord?: number; year?: number; subject?: string; title: unknown; icon: string; grades: string; steps: unknown[]; gen?: unknown};

function Card({l, here}: {l: Lesson; here: boolean}) {
  const p = S.lessons[l.id] || {}, st: number = p.stars || 0, kn = !st && p.known, mem = memState(l.id);
  return <button className={"card" + (here ? " here" : "")} data-l={l.id} onClick={() => lesson(l.id)}>
    <div className="art">
      {l.ord ? <span className={"ord" + (st ? " ok" : kn ? " kn" : "")}>{st || kn ? "✓" : l.ord}</span> : null}
      {here && <span className="ribbon">{T("startHere")}</span>}
      <Html html={l.icon} />
    </div>
    <div className="meta">
      <h3>{L(l.title)}</h3>
      <span className="muted" style={{fontSize: ".88rem"}}>{T("forGrades")(l.grades)} · {T("scenes")(l.steps.length)}</span>
      {kn ? <span className="kntag">✓ {T("known")}</span>
        : <span className="stars">{[0, 1, 2].map(i => <span key={i} className={i < st ? "" : "off"}>★</span>)}</span>}
      {mem && <span className={"mem " + mem}>{T("mem")[mem]}</span>}
    </div>
  </button>;
}

/* year picked on a non-maths tab; kept while the app is open */
const subPick: Record<string, number> = {};

function LessonMap() {
  const math = tabNow === "math", Y: number = yearNow();
  const subAll: Lesson[] = LESSONS.filter((l: Lesson) => l.subject === tabNow);
  const subYs = [...new Set(subAll.map(l => l.year).filter(Boolean) as number[])].sort((a, b) => a - b);
  /* other subjects: the child's own year, else the nearest year below it, else the first year that has lessons */
  const own = subYs.includes(S.grade), pk = tabNow + ":" + S.name + ":" + S.grade, pickY = subPick[pk];
  const sY = pickY && subYs.includes(pickY) ? pickY : own ? S.grade : subYs.filter(y => y <= (S.grade || 4)).pop() || subYs[0];
  const list: Lesson[] = math ? courseOf(Y) : subAll.filter(l => !sY || l.year === sY).sort((a, b) => (a.ord || 99) - (b.ord || 99));
  const course = list.filter(l => l.ord), done = course.filter(l => isDone(l.id)).length;
  const nx: Lesson | null = !course.length ? null : math ? nextLesson() : course.find(l => !isDone(l.id)) || null;
  const anyDone = course4().some((l: Lesson) => { const p = S.lessons[l.id]; return p && (p.stars || p.known || p.seen); });
  const nMist = Object.keys(S.mist).length, canDaily = allCourse().some((l: Lesson) => l.gen && isDone(l.id));
  const dailyToday = S.daily.last === today(), nB = Object.keys(S.badges).length, due = revDue().length, streak = streakNow();
  const pct = course.length ? Math.round(100 * done / course.length) : 0;
  return <div className="stack">
    <h1>{T("greet")(S.name)}</h1>
    <div className="tabs" role="tablist">{SUBJECTS.map((s: {id: string; soon?: boolean}) =>
      <button key={s.id} className="tab" role="tab" data-t={s.id} aria-selected={s.id === tabNow} onClick={() => { setTab(s.id); map(); }}>
        {T("subj")[s.id]}{s.soon && <span className="soon">{T("soon")}</span>}</button>)}</div>

    {math && !placeOf(Y) && !anyDone && <section className="hero"><Owl /><div className="stack" style={{gap: 8}}>
      <h2>{T("placeHero")}</h2><p>{T("placeText")}</p>
      <div className="row">
        <button className="btn" id="pgo" onClick={() => drill("place")}>🧭 {T("placeGo")}</button>
        <button className="btn ghost" id="pskip" onClick={() => { S.places = Object.assign({}, S.places, {[Y]: {skipped: true}}); save(); map(); }}>{T("placeSkip")}</button>
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

    {!math && S.grade && !own && subYs.length > 0 && <div className="empty" id="subsoon">🚧 {T("subSoon")(T("subj")[tabNow], S.grade)}</div>}

    {course.length > 0 && <div className="course">
      <div className="stack" style={{gap: 6}}>
        <h2>{math ? T("courseY")(Y) : T("courseS")(T("subj")[tabNow], sY)}</h2>
        <p className="muted">{T("courseNote")}</p>{math ? <YearSeg again={map} /> : subYs.length > 1 &&
          <div className="seg yseg" id="syears" role="group">{subYs.map(y =>
            <button key={y} data-y={y} aria-pressed={y === sY} onClick={() => { subPick[pk] = y; map(); }}>{T("gradeChip")(y)}</button>)}</div>}</div>
      <div className="cprog"><span>{T("courseDone")(done, course.length)}</span><i><b style={{width: pct + "%"}} /></i></div>
    </div>}

    {list.length ? <div className="cards">{list.map(l => <Card key={l.id} l={l} here={!!nx && nx.id === l.id} />)}</div>
      : <div className="empty">{T("empty")}</div>}

    {math && <div className="row" style={{justifyContent: "center"}}>
      <button className="btn ghost" id="tpar" onClick={parents}>👪 {T("parentsT")}</button>
      {(placeOf(Y) || anyDone) && <button className="btn ghost" id="tplace" onClick={() => drill("place")}>🧭 {T("placeRedo")}</button>}
    </div>}
  </div>;
}

export const showMap = () => showReact(<LessonMap />);
