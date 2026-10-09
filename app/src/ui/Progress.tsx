/* Badges, and the page for parents and teachers (time, accuracy, what needs practice). */
import {showReact} from "./mount";
import {YearSeg} from "./YearSeg";
import {SETS} from "../little/glyphs";
import {
  T, L, S, LESSONS, BADGES, CLOUD, lang, setPicked, map, parents, useKid, kidList,
  course4, isDone, daysAgo, revDue, memState, yearNow, streakNow,
} from "../legacy/core.js";

type Badge = {id: string; icon: string; name: unknown; how: unknown};
type Lesson = {id: string; ord?: number; title: unknown};

const Back = ({title}: {title: string}) =>
  <div className="lhead"><button className="btn ghost" id="back" style={{padding: "5px 16px"}} onClick={map}>{T("back")}</button><h2 style={{flex: 1}}>{title}</h2></div>;

const Stars = ({n}: {n: number}) => <>{[0, 1, 2].map(j => <span key={j} className={j < n ? "" : "off"}>★</span>)}</>;

function Badges() {
  return <div className="stack"><Back title={T("badgesT")} />
    <div className="bgrid">{BADGES.map((b: Badge) => {
      const got = S.badges[b.id];
      return <div key={b.id} className={"badge" + (got ? "" : " off")}><div className="bico">{b.icon}</div>
        <b>{L(b.name)}</b><span className="muted">{L(b.how)}</span>{!got && <span className="label">{T("locked")}</span>}</div>;
    })}</div></div>;
}

function Chart({mins, recs, days}: {mins: number[]; recs: {q: number}[]; days: string[]}) {
  const W = 560, H = 200, bw = 44, gap = (W - 40 - 7 * bw) / 6, y0 = H - 28, maxM = Math.max(10, ...mins), sc = (v: number) => v / maxM * (H - 60);
  const wd = (k: string) => { const [y, m, d] = k.split("-").map(Number);
    return new Intl.DateTimeFormat(lang === "ar" ? "ar" : lang === "sv" ? "sv-SE" : "en-GB", {weekday: "short"}).format(new Date(y, m - 1, d)); };
  return <svg className="pchart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={T("pChart")}>
    <path d={`M10,${y0}H${W - 10}`} stroke="var(--line)" strokeWidth="1.5" />
    {mins.map((m, j) => {
      const x = 20 + (lang === "ar" ? 6 - j : j) * (bw + gap), h = Math.max(m ? 4 : 0, sc(m));
      return <g key={j}><title>{`${wd(days[j])}: ${m} ${T("min")}, ${recs[j].q} ${T("pQs")}`}</title>
        <rect x={x - 6} y="10" width={bw + 12} height={y0 - 10} fill="transparent" />
        {h > 0 && <path d={`M${x},${y0}V${y0 - h + 4}q0,-4 4,-4h${bw - 8}q4,0 4,4V${y0}Z`} fill="var(--teal)" />}
        {m > 0 && <text x={x + bw / 2} y={y0 - h - 8} textAnchor="middle" className="cv">{m}</text>}
        <text x={x + bw / 2} y={H - 6} textAnchor="middle" className="cx">{wd(days[j])}</text></g>;
    })}</svg>;
}

/* Year 1 (Lilla labbet): what the child has traced and played, and the time spent */
const LT1 = {stars: "Stjärnor", big: "Bokstäver", nums: "Siffror", games: "Spel", words: "Ordspelet", pop: "Ballonger", count: "Räkna djur",
  times: "gånger", next: "Nästa att öva", allDone: "Alla är spårade. Bra jobbat!", tapHint: "Grön = spårad. Siffran visar hur många gånger."};
function LittleReport({mins, recs, days}: {mins: number[]; recs: {q: number}[]; days: string[]}) {
  const t: Record<string, number> = (S.little && S.little.t) || {};
  const sets = [["ABC", LT1.big], ["123", LT1.nums]] as const;
  /* a letter counts whether it was traced in the letter lesson (capital key) or as a small letter */
  const n = (k: string) => (t[k] || 0) + (k.startsWith("ABC") ? t["abc" + k.slice(3).toLowerCase()] || 0 : 0), sum = (pre: string) => Object.keys(t).filter(k => k.startsWith(pre)).reduce((a, k) => a + t[k], 0);
  const left = sets.flatMap(([id]) => SETS[id].chars.filter(ch => !n(id + ch)));
  return <>
    <div className="tiles">
      <div className="tile"><span className="label">{LT1.stars}</span><b>⭐ {(S.little && S.little.stars) || 0}</b></div>
      {sets.map(([id, name]) => <div className="tile" key={id}><span className="label">{name}</span><b>{SETS[id].chars.filter(ch => n(id + ch)).length} / {SETS[id].chars.length}</b></div>)}
      <div className="tile"><span className="label">{T("pTime")}</span><b>{mins.reduce((a, b) => a + b, 0)} {T("min")}</b></div>
    </div>
    <section className="panel stack" style={{gap: 8}}><h3>{T("pChart")}</h3><Chart mins={mins} recs={recs} days={days} /></section>
    {sets.map(([id, name]) => <section className="panel stack" style={{gap: 8}} key={id}><h3>{name}</h3>
      <div className="p1grid">{SETS[id].chars.map(ch => <span key={ch} className={"p1c" + (n(id + ch) ? " ok" : "")}>{ch}{n(id + ch) > 0 && <small>{n(id + ch)}</small>}</span>)}</div></section>)}
    <p className="muted" style={{fontSize: ".9rem"}}>{LT1.tapHint}</p>
    <section className="panel stack" style={{gap: 8}}><h3>{LT1.next}</h3>
      <p style={{fontSize: "1.3rem", letterSpacing: 4}}>{left.length ? left.slice(0, 8).join(" ") : LT1.allDone}</p></section>
    <section className="panel stack" style={{gap: 8}}><h3>{LT1.games}</h3><ul className="plist">
      <li><b>{LT1.words}</b> <span className="muted">· {n("words")} {LT1.times}</span></li>
      <li><b>{LT1.pop}</b> <span className="muted">· {sum("pop")} {LT1.times}</span></li>
      <li><b>{LT1.count}</b> <span className="muted">· {n("count")} {LT1.times}</span></li></ul></section>
  </>;
}

function Parents() {
  const c: Lesson[] = course4(), done = c.filter(l => isDone(l.id)).length;
  const days: string[] = [...Array(7)].map((_, j) => daysAgo(6 - j));
  const recs = days.map(k => S.days[k] || {sec: 0, q: 0, ok: 0});
  const mins = recs.map(r => Math.round(r.sec / 60)), q7 = recs.reduce((a, r) => a + r.q, 0), ok7 = recs.reduce((a, r) => a + r.ok, 0);
  const due: Lesson[] = revDue();
  const needs = [
    ...due.filter(l => c.includes(l)).map(l => ({id: l.id, why: memState(l.id) === "fading" ? T("pFading") : T("pReview")})),
    ...Object.keys(S.mist).filter(id => !due.some(l => l.id === id)).map(id => ({id, why: T("pMistakes")})),
    ...c.filter(l => (S.lessons[l.id] || {}).stars === 1 && !S.mist[l.id]).map(l => ({id: l.id, why: T("pLow")})),
  ];
  const status = (l: Lesson) => { const p = S.lessons[l.id] || {}; return p.stars ? "done" : p.known ? "known" : p.seen ? "started" : "none"; };
  const kids = kidList();
  return <div className="stack">
    <Back title={T("parentsT")} />
    {kids.length > 1 && <div className="seg yseg" id="pkids" role="group">{kids.map((k: {id: string; name: string}) =>
      <button key={k.id} data-k={k.id} aria-pressed={k.id === S.id} onClick={() => { setPicked(true); useKid(k.id); parents(); }}>👤 {k.name}</button>)}</div>}
    <div className="course"><div><h2>{S.name || "…"}</h2><p className="muted">{T("gradeChip")(S.grade)}{S.grade !== 1 && <> · {T("courseY")(yearNow())}</>}</p>{S.grade !== 1 && <YearSeg again={parents} />}</div>
      <p className="muted" style={{maxWidth: 360, fontSize: ".9rem"}}>{CLOUD.on ? "☁️ " + T("savedCloud") : T("savedLocal")}</p></div>
    {S.grade === 1 ? <LittleReport mins={mins} recs={recs} days={days} /> : <>
    <div className="tiles">
      <div className="tile"><span className="label">{T("pDone")}</span><b>{done} / {c.length}</b><span className="muted">🧠 {c.filter(l => (S.lessons[l.id] || {}).mastered).length} {T("pSits")}</span></div>
      <div className="tile"><span className="label">{T("pTime")}</span><b>{mins.reduce((a, b) => a + b, 0)} {T("min")}</b></div>
      <div className="tile"><span className="label">{T("pRight")}</span><b>{q7 ? Math.round(100 * ok7 / q7) + " %" : "–"}</b><span className="muted">{ok7} / {q7} {T("pQs")}</span></div>
      <div className="tile"><span className="label">{T("pStreak")}</span><b>🔥 {streakNow()}</b><span className="muted">{T("pHints")}: {S.tot.hints}</span></div>
    </div>
    <section className="panel stack" style={{gap: 8}}><h3>{T("pChart")}</h3><Chart mins={mins} recs={recs} days={days} /></section>
    <section className="panel stack" style={{gap: 8}}><h3>{T("pNeeds")}</h3>
      {needs.length ? <ul className="plist">{needs.map((n, i) => { const l: Lesson | undefined = LESSONS.find((x: Lesson) => x.id === n.id);
        return l ? <li key={i}><b>{l.ord || ""}. {L(l.title)}</b> <span className="muted">· {n.why}</span></li> : null; })}</ul>
        : <p className="muted">{T("pNeedsNone")}</p>}</section>
    <section className="panel stack" style={{gap: 8}}><h3>{T("pAll")}</h3><div className="ptable"><table>
      <thead><tr><th>#</th><th></th><th>{T("pStars")}</th><th>{T("pLvl")}</th></tr></thead>
      <tbody>{c.map(l => { const p = S.lessons[l.id] || {}, s = status(l), mem = memState(l.id);
        return <tr key={l.id}><td>{l.ord}</td><td>{L(l.title)}<br /><span className={"st " + s}>{T("pStatus")[s]}</span>
          {mem && <> <span className={"mem " + mem}>{T("mem")[mem]}</span></>}</td>
          <td className="stars"><Stars n={p.stars || 0} /></td><td>{p.level != null && s !== "none" ? T("pLevel")[p.level] : "–"}</td></tr>; })}</tbody>
    </table></div></section>
    <section className="panel stack" style={{gap: 8}}><h3>{T("badgesT")} · {T("badgesS")(Object.keys(S.badges).length, BADGES.length)}</h3>
      <p style={{fontSize: "1.8rem", letterSpacing: 6}}>{BADGES.some((b: Badge) => S.badges[b.id])
        ? BADGES.filter((b: Badge) => S.badges[b.id]).map((b: Badge) => <span key={b.id} title={L(b.name)}>{b.icon}</span>) : "–"}</p></section>
    </>}
  </div>;
}

export const showBadges = () => showReact(<Badges />);
export const showParents = () => showReact(<Parents />);
