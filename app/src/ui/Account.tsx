/* Accounts on the public site (Supabase): the start choice, child login (family code + name + PIN),
   parent login/sign-up, and the parent's family page. The data calls live in legacy/core.js. */
import {useEffect, useRef, useState, type FormEvent} from "react";
import {Owl} from "./Owl";
import {showReact} from "./mount";
import {
  T, AT, S, PROF, ACC, AKEY, lang, aget, aset, rpc, sb, parTok, parKeep, accUse, accParOut, fresh, kidList,
  saveLocal, save, hud, map, parents, route, toast, startScreen, kidLogin, parLogin, parentHome,
} from "../legacy/core.js";

type Err = {net?: boolean; status?: number; message?: string};
const Back = ({to, title}: {to: () => void; title: string}) =>
  <div className="lhead"><button className="btn ghost" id="bk" style={{padding: "5px 16px"}} onClick={to}>{AT("back")}</button><h2>{title}</h2></div>;

function Start() {
  return <div className="stack acc">
    <section className="hello"><Owl /><div className="stack" style={{gap: 10}}><h1>{AT("accHello")}</h1><p className="muted">{AT("accIntro")}</p></div></section>
    <div className="choices">
      <button className="choice" id="ak" onClick={kidLogin}><span>🎒</span>{AT("imKid")}</button>
      <button className="choice" id="ap" onClick={() => parLogin(false)}><span>👪</span>{AT("imPar")}</button>
    </div>
    <p style={{textAlign: "center"}}><button className="linkb" id="al" onClick={() => { aset(AKEY.local, 1); route(); }}>{AT("tryLocal")}</button></p>
  </div>;
}

function KidLogin() {
  const fam0: string = aget(AKEY.fam) || "";
  const [err, setErr] = useState("");
  const code = useRef<HTMLInputElement>(null), name = useRef<HTMLInputElement>(null), pin = useRef<HTMLInputElement>(null);
  useEffect(() => { const t = setTimeout(() => (fam0 ? name : code).current?.focus(), 30); return () => clearTimeout(t); }, []);
  async function submit(e: FormEvent) {
    e.preventDefault(); setErr("");
    const c = code.current!.value.trim().toUpperCase(), n = name.current!.value.trim(), pn = pin.current!.value.trim();
    if (!c || !n || !pn) { setErr(AT("needAll")); return; }
    if (!/^\d{4}$/.test(pn)) { setErr(AT("needPin")); return; }
    try {
      const j = await rpc("kid_login", {p_code: c, p_name: n, p_pin: pn});
      if (!j || j.error) { setErr(AT(({unknown: "eUnknown", pin: "ePin", locked: "eLocked"} as Record<string, string>)[j && j.error] || "eUnknown")); return; }
      aset(AKEY.fam, c); ACC.kid = {token: j.token, id: j.id, name: j.name}; aset(AKEY.kid, ACC.kid); accUse(j); save(); hud(); map();
    } catch { setErr(AT("eNet")); }
  }
  return <div className="stack acc"><Back to={startScreen} title={"🎒 " + AT("imKid")} />
    <form className="panel stack" id="kf" autoComplete="on" onSubmit={submit}>
      <label htmlFor="kc">{AT("famCode")}</label><input type="text" id="kc" ref={code} maxLength={8} placeholder={AT("famPh")} autoCapitalize="characters" defaultValue={fam0} />
      <label htmlFor="kn">{AT("yourName")}</label><input type="text" id="kn" ref={name} maxLength={30} autoComplete="given-name" />
      <label htmlFor="kp">{AT("pin")}</label><input type="password" id="kp" ref={pin} inputMode="numeric" maxLength={4} autoComplete="current-password" />
      <p className="err" id="ke">{err}</p><div className="row"><button className="btn" type="submit">{AT("login")}</button></div>
    </form></div>;
}

function ParLogin({signup}: {signup: boolean}) {
  const [err, setErr] = useState(""), [ok, setOk] = useState("");
  const email = useRef<HTMLInputElement>(null), pw = useRef<HTMLInputElement>(null);
  async function forgot() {
    const em = email.current!.value.trim(); if (!em) { setErr(AT("needAll")); return; }
    try { await sb("/auth/v1/recover", {body: {email: em}}); setOk(AT("resetSent")); } catch (x) { const e = x as Err; setErr(e.net ? AT("eNet") : e.message || ""); }
  }
  async function submit(e: FormEvent) {
    e.preventDefault(); setErr(""); setOk("");
    const em = email.current!.value.trim(), p = pw.current!.value;
    if (!em || p.length < 8) { setErr(AT("needAll")); return; }
    try {
      if (signup) { const j = await sb("/auth/v1/signup", {body: {email: em, password: p}}); if (j && j.access_token) { parKeep(j); parentHome(); } else setOk(AT("confirmMail")); }
      else { const j = await sb("/auth/v1/token?grant_type=password", {body: {email: em, password: p}}); parKeep(j); parentHome(); }
    } catch (x) { const e = x as Err; setErr(e.net ? AT("eNet") : signup ? e.message || "" : AT("eLoginPar")); }
  }
  return <div className="stack acc"><Back to={startScreen} title={"👪 " + AT("imPar")} />
    <div className="seg" role="group" style={{alignSelf: "flex-start"}}>
      <button id="t1" aria-pressed={!signup} onClick={() => parLogin(false)}>{AT("login")}</button>
      <button id="t2" aria-pressed={signup} onClick={() => parLogin(true)}>{AT("signup")}</button></div>
    <form className="panel stack" id="pf" onSubmit={submit}>
      <label htmlFor="pe">{AT("email")}</label><input type="email" id="pe" ref={email} autoComplete="email" defaultValue={(aget(AKEY.par) || {}).email || ""} />
      <label htmlFor="pw">{AT("password")}</label><input type="password" id="pw" ref={pw} autoComplete={signup ? "new-password" : "current-password"} minLength={8} />
      <p className="err" id="pr">{err}</p><p className="ok" id="po">{ok}</p>
      <div className="row"><button className="btn" type="submit">{signup ? AT("signup") : AT("login")}</button>
        {!signup && <button className="linkb" type="button" id="fg" onClick={forgot}>{AT("forgot")}</button>}</div>
    </form></div>;
}

type Row = {id: string; name: string; grade?: number; state?: {xp?: number; lessons?: Record<string, {stars?: number; known?: boolean}>}};
type LocalKid = {id: string; name: string; grade: number; xp: number};

function KidRow({r}: {r: Row}) {
  const [sure, setSure] = useState(false);
  const done = Object.values((r.state || {}).lessons || {}).filter(x => x.stars || x.known).length;
  async function newPin() {
    const pn = prompt(AT("pin")); if (pn == null) return;
    if (!/^\d{4}$/.test(pn.trim())) { toast(AT("needPin")); return; }
    try { await rpc("set_kid_pin", {p_kid: r.id, p_pin: pn.trim()}, await parTok()); toast(AT("pinSet")); } catch (x) { const e = x as Err; toast(e.net ? AT("eNet") : e.message); }
  }
  async function del() {
    if (!sure) { setSure(true); return; }
    try { await sb("/rest/v1/kids?id=eq." + r.id, {method: "DELETE", auth: await parTok()}); delete PROF.kids["db-" + r.id]; saveLocal(); parentHome(); }
    catch (x) { const e = x as Err; toast(e.net ? AT("eNet") : e.message); }
  }
  return <div className="krow" data-k={r.id}><b>👤 {r.name}</b>
    <span className="muted">{T("gradeChip")(r.grade || "?")} · ★ {(r.state || {}).xp || 0} · {AT("lessonsDone")(done)}</span><span className="sp" />
    <button className="btn" data-a="study" onClick={() => { ACC.view = r.id; accUse(r); hud(); map(); }}>{AT("studyHere")}</button>
    <button className="btn ghost" data-a="rep" onClick={() => { ACC.view = r.id; accUse(r); hud(); parents(); }}>{AT("report")}</button>
    <button className="btn ghost" data-a="pin" onClick={newPin}>{AT("newPin")}</button>
    <button className={"btn ghost" + (sure ? " bad" : "")} data-a="del" onClick={del}>{sure ? `🗑 ${AT("delSure")} ${r.name}` : "🗑"}</button>
  </div>;
}

function AddKid({move}: {move: LocalKid | null}) {
  const [grade, setGrade] = useState<number | null>(move ? move.grade : null), [err, setErr] = useState("");
  const name = useRef<HTMLInputElement>(null), pin = useRef<HTMLInputElement>(null);
  useEffect(() => { if (move) { name.current!.value = move.name; setGrade(move.grade); pin.current!.focus(); } }, [move]);
  async function submit(e: FormEvent) {
    e.preventDefault(); setErr("");
    const n = name.current!.value.trim(), pn = pin.current!.value.trim();
    if (n.length < 2 || !grade) { setErr(AT("needAll")); return; }
    if (!/^\d{4}$/.test(pn)) { setErr(AT("needPin")); return; }
    /* moving a child from this browser keeps their progress */
    const st = move && move.name.toLowerCase() === n.toLowerCase()
      ? Object.assign(JSON.parse(JSON.stringify(PROF.kids[move.id])), {name: n, grade}) : Object.assign(fresh(), {name: n, grade, lang});
    delete st.id;
    try {
      await rpc("add_kid", {p_name: n, p_pin: pn, p_grade: grade, p_state: st}, await parTok());
      if (move) { delete PROF.kids[move.id]; if (PROF.cur === move.id) PROF.cur = null; saveLocal(); }
      toast(AT("added")); parentHome();
    } catch (x) { const e = x as Err; setErr(e.net ? AT("eNet") : e.message || ""); }
  }
  return <form className="panel stack" id="af" onSubmit={submit}><h3>{AT("addKid")}</h3>
    <label htmlFor="an2">{AT("kidName")}</label><input type="text" id="an2" ref={name} maxLength={30} />
    <span className="label">{AT("kidGrade")}</span>
    <div className="grades" id="ag">{[4, 5, 6, 7, 8, 9].map(g => <button key={g} type="button" data-g={g} aria-pressed={grade === g} onClick={() => setGrade(g)}>{g}</button>)}</div>
    <label htmlFor="ap2">{AT("pin")}</label><input type="password" id="ap2" ref={pin} inputMode="numeric" maxLength={4} autoComplete="new-password" />
    <p className="err" id="ae">{err}</p><div className="row"><button className="btn" type="submit">{AT("add")}</button></div>
  </form>;
}

function ParentHome() {
  const [data, setData] = useState<{fam: {code: string}; kids: Row[]} | null>(null), [failed, setFailed] = useState(false);
  const [move, setMove] = useState<LocalKid | null>(null);
  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const t = await parTok();
        const fam = await rpc("my_family", {}, t), kids = await sb("/rest/v1/kids?select=id,name,grade,state,upd&order=name", {method: "GET", auth: t});
        if (live) setData({fam, kids});
      } catch (x) { const e = x as Err; if (e.status === 401 || e.status === 400) { accParOut(); return; } if (live) setFailed(true); }
    })();
    return () => { live = false; };
  }, []);
  if (failed) return <div className="stack acc"><p className="err">{AT("eNet")}</p><button className="btn" id="rt" onClick={parentHome}>↻</button></div>;
  if (!data) return <div className="stack acc"><p className="muted">…</p></div>;
  const {fam, kids} = data;
  const local: LocalKid[] = kidList().filter((k: LocalKid) => !String(k.id).startsWith("db-") && !kids.some(r => r.name.toLowerCase() === k.name.toLowerCase()));
  return <div className="stack acc">
    <section className="panel stack" style={{gap: 8}}><h2>👪 {AT("famT")}</h2><p className="muted">{AT("famShow")}</p>
      <div><span className="muted">{AT("famCode")}:</span> <span className="code">{fam.code}</span></div></section>
    <section className="panel stack" style={{gap: 4}}><h3>{AT("kidsT")}</h3>
      {kids.length ? kids.map(r => <KidRow key={r.id} r={r} />) : <p className="muted">{AT("noKids")}</p>}</section>
    {local.length > 0 && <section className="panel stack" style={{gap: 4}}><h3>{AT("moveT")}</h3><p className="muted">{AT("moveS")}</p>
      {local.map(k => <div className="krow" key={k.id}><b>👤 {k.name}</b><span className="muted">{T("gradeChip")(k.grade)} · ★ {k.xp}</span><span className="sp" />
        <button className="btn ghost" data-mv={k.id} onClick={() => setMove({...k})}>{AT("moveBtn")}</button></div>)}</section>}
    <AddKid move={move} />
    <p className="muted">{ACC.par.email} · <button className="linkb" id="lo" onClick={accParOut}>{AT("logout")}</button></p>
  </div>;
}

export const showStart = () => showReact(<Start />);
export const showKidLogin = () => showReact(<KidLogin />);
export const showParLogin = (signup: boolean) => showReact(<ParLogin key={String(signup)} signup={signup} />);
export const showParentHome = () => showReact(<ParentHome />);
