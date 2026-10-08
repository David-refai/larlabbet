/* "Who are you?" and the name/grade screen: one profile per child. */
import {useState, useRef} from "react";
import {Owl} from "./Owl";
import {showReact} from "./mount";
import {
  T, S, PROF, kidList, useKid, dropKid, route, map, who, welcome, hud, save, toast,
  setPicked, setViewYear, backToCur,
} from "../legacy/core.js";

type Kid = {id: string; name: string; grade: number; xp: number};
const hue = (id: string) => [...id].reduce((a, c) => a + c.charCodeAt(0) * 7, 0) % 360;

function Who() {
  const ks: Kid[] = kidList();
  return <div className="stack">
    <section className="hello"><Owl /><div className="stack" style={{gap: 10}}><h1>{T("whoT")}</h1><p className="muted">{T("whoS")}</p></div></section>
    <div className="kids">
      {ks.map(k => <button key={k.id} className={"kid" + (k.id === S.id ? " on" : "")} data-k={k.id}
        onClick={() => { setPicked(true); useKid(k.id); map(); }}>
        <span className="kav" style={{background: `hsl(${hue(k.id)} 55% 45%)`}}>{[...k.name][0].toUpperCase()}</span>
        <b>{k.name}</b><span className="muted">{T("gradeChip")(k.grade)} · ★ {k.xp}</span>
      </button>)}
      <button className="kid add" id="knew" onClick={() => { setPicked(true); useKid(null); welcome(); }}>
        <span className="kav">+</span><b>{T("newKid")}</b>
      </button>
    </div>
  </div>;
}

function Welcome() {
  const [grade, setGrade] = useState<number | null>(S.grade || null);
  const [bad, setBad] = useState(false);
  const [sure, setSure] = useState(false);
  const nm = useRef<HTMLInputElement>(null);
  const others = kidList().some((k: Kid) => k.id !== S.id);
  const canDelete = PROF.kids[S.id] && !String(S.id).startsWith("db-");
  function go() {
    setViewYear(null);
    const n = nm.current!.value.trim();
    /* no lessons until the student has written a name (at least two letters) */
    if (n.length < 2) { setBad(true); nm.current!.focus(); toast(T("needName")); return; }
    S.name = n;
    if (!grade) { toast(T("pickGrade")); return; }
    S.grade = grade; setPicked(true); save(); hud(); map();
  }
  return <div className="stack">
    <section className="hello"><Owl /><div className="stack" style={{gap: 10}}><h1>{T("hello")}</h1><p className="muted">{T("intro")}</p></div></section>
    <section className="panel stack">
      <label className="label" htmlFor="nm">{T("name")}</label>
      <input type="text" id="nm" maxLength={30} placeholder={T("ph")} defaultValue={S.name} ref={nm}
        className={bad ? "bad" : undefined} onInput={() => setBad(false)} onKeyDown={e => { if (e.key === "Enter") go(); }} />
      <span className="label">{T("grade")}</span>
      <div className="grades" id="gr">{[1, 4, 5, 6, 7, 8, 9].map(g =>
        <button key={g} data-g={g} aria-pressed={grade === g} onClick={() => { setGrade(g); S.grade = g; }}>{g}</button>)}</div>
      <div className="row">
        <button className="btn" id="go" onClick={go}>{T("start")}</button>
        {others && <button className="btn ghost" id="wwho" onClick={() => { backToCur(); who(); }}>👥 {T("whoSwitch")}</button>}
        {/* deleting asks for a second tap that names the child */}
        {canDelete && <button className={"btn ghost" + (sure ? " bad" : "")} id="wdel" style={{marginInlineStart: "auto"}}
          onClick={() => { if (!sure) { setSure(true); return; } dropKid(S.id); useKid(null); route(); }}>
          🗑 {sure ? `${T("delSure")} ${S.name}` : T("delKid")}</button>}
      </div>
    </section>
  </div>;
}

export const showWho = () => showReact(<Who />);
export const showWelcome = () => showReact(<Welcome />);
