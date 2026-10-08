/* "Lilla labbet": the page for Year 1. Trace dotted letters and digits, draw freely,
   pop balloons with the right letter, and count animals. Few words: big pictures and buttons. */
import {useEffect, useMemo, useRef, useState} from "react";
import {showReact} from "./mount";
import {S, save, lang, REDUCED, welcome} from "../legacy/core.js";
import {SETS, type SetId} from "../little/glyphs";

const TX: Record<string, Record<string, string>> = {
  sv: {title: "Lilla labbet", hi: "Hej", trace: "Spåra", draw: "Rita", balloons: "Ballonger", count: "Räkna djur", find: "Hitta", clear: "Sudda", again: "Igen", next: "Nästa", stars: "stjärnor", howMany: "Hur många?"},
  en: {title: "Little lab", hi: "Hi", trace: "Trace", draw: "Draw", balloons: "Balloons", count: "Count animals", find: "Find", clear: "Clear", again: "Again", next: "Next", stars: "stars", howMany: "How many?"},
  ar: {title: "المختبر الصغير", hi: "مرحبًا", trace: "تتبّع", draw: "ارسم", balloons: "بالونات", count: "عُدّ الحيوانات", find: "ابحث عن", clear: "امسح", again: "مرة أخرى", next: "التالي", stars: "نجوم", howMany: "كم عددها؟"},
};
const tx = (k: string) => (TX[lang] || TX.sv)[k];

type Little = {stars: number; t: Record<string, number>};
const LS = (): Little => { if (!S.little) S.little = {stars: 0, t: {}}; return S.little; };
function addStar(key?: string) { const l = LS(); l.stars++; if (key) l.t[key] = (l.t[key] || 0) + 1; save(); }

/* small cheerful tones (no voice); follows the app's sound switch */
let ac: AudioContext | null = null;
function tone(notes: number[], len = 0.12) {
  if (S.sound === false) return;
  try {
    ac = ac || new AudioContext();
    notes.forEach((f, i) => {
      const o = ac!.createOscillator(), g = ac!.createGain(), t = ac!.currentTime + i * len;
      o.type = "triangle"; o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.18, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + len * 1.6);
      o.connect(g).connect(ac!.destination); o.start(t); o.stop(t + len * 1.7);
    });
  } catch { /* no audio */ }
}
const ding = () => tone([660, 880]), yay = () => tone([523, 659, 784, 1047], 0.13), pop = () => tone([900, 500], 0.06), oops = () => tone([300, 240], 0.1);

const ANIMALS = ["🐶", "🐱", "🐰", "🐸", "🐥", "🐢", "🦊", "🐼", "🐷", "🐮", "🐵", "🦁", "🐨", "🐙", "🦋", "🐞"];
const COLORS = ["#ef4444", "#f97316", "#facc15", "#22c55e", "#06b6d4", "#3b82f6", "#a855f7", "#ec4899"];
const rnd = (n: number) => Math.floor(Math.random() * n);
const pickOne = <X,>(a: readonly X[]) => a[rnd(a.length)];

type Mode = {m: "home"} | {m: "trace"; set: SetId} | {m: "draw"} | {m: "balloons"} | {m: "count"};

function Party({animal, onNext, onAgain}: {animal: string; onNext?: () => void; onAgain?: () => void}) {
  const balls = useMemo(() => Array.from({length: 14}, (_, i) => ({i, x: rnd(92), d: 2.2 + Math.random() * 2, c: pickOne(COLORS), w: Math.random() * .8})), []);
  return <div className="lparty" role="status">
    {balls.map(b => <span key={b.i} className="lball" style={{left: b.x + "%", background: b.c, animationDuration: b.d + "s", animationDelay: b.w + "s"}} />)}
    <div className="lwin"><span className="lstar">⭐</span><span className="ljump">{animal}</span>
      <div className="row" style={{justifyContent: "center"}}>
        {onAgain && <button className="lbtn ghost" onClick={onAgain} aria-label={tx("again")}>↻</button>}
        {onNext && <button className="lbtn" id="lnext" onClick={onNext} aria-label={tx("next")}>➜</button>}
      </div></div>
  </div>;
}

/* ---------- tracing ---------- */
type Smp = {x: number; y: number}[];
const R = 13; // how close a finger must pass to a point of the dotted line (box units)

function sample(d: string): {pts: Smp; len: number} {
  const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
  p.setAttribute("d", d);
  const len = p.getTotalLength(), n = Math.max(1, Math.round(len / 3)), pts: Smp = [];
  for (let i = 0; i <= n; i++) { const q = p.getPointAtLength(len * i / n); pts.push({x: q.x, y: q.y}); }
  return {pts, len};
}

function Trace({set, home}: {set: SetId; home: () => void}) {
  const {chars, glyphs} = SETS[set];
  const [idx, setIdx] = useState(() => Math.max(0, chars.findIndex(c => !LS().t[set + c])));
  const ch = chars[idx], strokes = (glyphs as Record<string, string[]>)[ch];
  const smp = useMemo(() => strokes.map(sample), [ch]);
  const [cur, setCur] = useState(0), [ink, setInk] = useState<Smp[]>([]), [won, setWon] = useState(false), [far, setFar] = useState(false);
  const reach = useRef(-1), live = useRef<Smp | null>(null), svg = useRef<SVGSVGElement>(null), [bug, setBug] = useState<{x: number; y: number} | null>(null);
  const [, force] = useState(0);
  const animal = useMemo(() => pickOne(ANIMALS), [ch]);

  useEffect(() => { setCur(0); setInk([]); setWon(false); reach.current = -1; }, [ch]);
  /* a ladybug walks along the stroke to show where to start and which way to go */
  useEffect(() => {
    if (won || cur >= smp.length) { setBug(null); return; }
    const pts = smp[cur].pts; if (REDUCED || pts.length < 2) { setBug(pts[0]); return; }
    let raf = 0; const t0 = performance.now(), dur = Math.max(900, smp[cur].len * 14);
    const step = (t: number) => {
      const k = ((t - t0) % (dur + 900)) / dur;
      setBug(reach.current >= 0 ? null : pts[Math.min(pts.length - 1, Math.floor(Math.min(1, k) * (pts.length - 1)))]);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step); return () => cancelAnimationFrame(raf);
  }, [cur, smp, won]);

  const toBox = (e: React.PointerEvent) => {
    const m = svg.current!.getScreenCTM()!.inverse(), p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m);
    return {x: p.x, y: p.y};
  };
  /* follow the finger: a point of the line counts only when the line before it is done, so start and direction matter */
  function feed(p: {x: number; y: number}) {
    if (cur >= smp.length) return;
    const pts = smp[cur].pts; let moved = true;
    while (moved) {
      moved = false;
      for (let i = reach.current + 1; i < Math.min(pts.length, reach.current + 7); i++)
        if (Math.hypot(pts[i].x - p.x, pts[i].y - p.y) < R) { reach.current = i; moved = true; }
    }
    if (reach.current >= pts.length - 2) {
      reach.current = -1; const nx = cur + 1; setCur(nx); live.current = null; setInk([]);
      if (nx >= smp.length) { setWon(true); yay(); addStar(set + ch); } else ding();
    }
  }
  function down(e: React.PointerEvent) {
    if (won) return; (e.target as Element).setPointerCapture?.(e.pointerId);
    const p = toBox(e); live.current = [p]; setInk(k => [...k, live.current!]);
    const s0 = smp[cur]?.pts[0]; setFar(!!s0 && reach.current < 0 && Math.hypot(s0.x - p.x, s0.y - p.y) > R * 1.6);
    feed(p);
  }
  function move(e: React.PointerEvent) {
    if (!live.current) return; const p = toBox(e); live.current.push(p); force(n => n + 1); feed(p);
  }
  const up = () => { live.current = null; };
  const go = (d: number) => setIdx(i => (i + d + chars.length) % chars.length);
  const arrow = (pts: Smp) => {
    if (pts.length < 4) return null;
    const a = pts[0], b = pts[3], ang = Math.atan2(b.y - a.y, b.x - a.x), ox = a.x + Math.cos(ang) * 16, oy = a.y + Math.sin(ang) * 16;
    const w = (s: number) => `${ox + Math.cos(ang + s) * -8},${oy + Math.sin(ang + s) * -8}`;
    return <polyline points={`${w(0.6)} ${ox},${oy} ${w(-0.6)}`} className="larrow" />;
  };
  const doneCol = "#6366f1";

  return <div className="lstage">
    <div className="ltop">
      <button className="lbtn ghost" onClick={home} aria-label="home">🏠</button>
      <button className="lbtn ghost" onClick={() => go(-1)} aria-label="prev">◀</button>
      <span className="lbig">{ch}</span>
      <button className="lbtn ghost" onClick={() => go(1)} aria-label={tx("next")}>▶</button>
      <button className="lbtn ghost" onClick={() => { setCur(0); setInk([]); reach.current = -1; }} aria-label={tx("again")}>↻</button>
    </div>
    <svg ref={svg} className="lpaper" id="lpaper" viewBox="-10 -38 120 205" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
      <line x1="-10" x2="110" y1="10" y2="10" className="lrule" /><line x1="-10" x2="110" y1="55" y2="55" className="lrule dash" />
      <line x1="-10" x2="110" y1="120" y2="120" className="lrule base" />
      {smp.map((s, i) => i < cur
        ? <path key={i} d={strokes[i]} className="ldone" stroke={doneCol} />
        : <path key={i} d={strokes[i]} className={"ldot" + (i === cur ? " now" : "")} />)}
      {ink.map((k, i) => <polyline key={i} points={k.map(p => p.x + "," + p.y).join(" ")} className="link" />)}
      {!won && cur < smp.length && <g>
        {arrow(smp[cur].pts)}
        <circle cx={smp[cur].pts[0].x} cy={smp[cur].pts[0].y} r="7" className={"lstart" + (far ? " far" : "")} />
        <text x={smp[cur].pts[0].x} y={smp[cur].pts[0].y + 3.5} className="lnum">{cur + 1}</text>
        {bug && <text x={bug.x} y={bug.y + 5} className="lbug">🐞</text>}
      </g>}
    </svg>
    <div className="lstrip">{chars.map((c, i) =>
      <button key={c} className={"lchip" + (i === idx ? " on" : "") + (LS().t[set + c] ? " ok" : "")} onClick={() => setIdx(i)}>{c}</button>)}</div>
    {won && <Party animal={animal} onAgain={() => { setCur(0); setInk([]); setWon(false); }} onNext={() => go(1)} />}
  </div>;
}

/* ---------- free drawing ---------- */
function Draw({home}: {home: () => void}) {
  const cv = useRef<HTMLCanvasElement>(null), [col, setCol] = useState(COLORS[5]), [size, setSize] = useState(10), [stamp, setStamp] = useState<string | null>(null);
  const last = useRef<{x: number; y: number} | null>(null);
  useEffect(() => {
    const c = cv.current!, r = c.getBoundingClientRect(), dpr = window.devicePixelRatio || 1;
    c.width = r.width * dpr; c.height = r.height * dpr;
    const g = c.getContext("2d")!; g.scale(dpr, dpr); g.fillStyle = "#fff"; g.fillRect(0, 0, r.width, r.height);
  }, []);
  const at = (e: React.PointerEvent) => { const r = cv.current!.getBoundingClientRect(); return {x: e.clientX - r.left, y: e.clientY - r.top}; };
  function down(e: React.PointerEvent) {
    const p = at(e), g = cv.current!.getContext("2d")!;
    if (stamp) { g.font = `${size * 5}px serif`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(stamp, p.x, p.y); pop(); return; }
    cv.current!.setPointerCapture(e.pointerId); last.current = p; line(p, p);
  }
  function line(a: {x: number; y: number}, b: {x: number; y: number}) {
    const g = cv.current!.getContext("2d")!;
    g.strokeStyle = col; g.lineWidth = size; g.lineCap = "round"; g.lineJoin = "round";
    g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke();
  }
  const move = (e: React.PointerEvent) => { if (!last.current) return; const p = at(e); line(last.current, p); last.current = p; };
  const clear = () => { const c = cv.current!, g = c.getContext("2d")!; g.fillStyle = "#fff"; g.fillRect(0, 0, c.width, c.height); };
  return <div className="lstage">
    <div className="ltop"><button className="lbtn ghost" onClick={home} aria-label="home">🏠</button>
      <div className="lpal">{[...COLORS, "#111827", "#ffffff"].map(c =>
        <button key={c} className={"lcol" + (c === col && !stamp ? " on" : "")} style={{background: c}} aria-label={c === "#ffffff" ? "eraser" : c}
          onClick={() => { setCol(c); setStamp(null); }}>{c === "#ffffff" ? "🧽" : ""}</button>)}</div>
    </div>
    <div className="ltop">
      {[5, 10, 20].map(s => <button key={s} className={"lbtn ghost" + (s === size ? " on" : "")} onClick={() => setSize(s)} aria-label={"size " + s}>
        <i className="lsz" style={{width: s + 4, height: s + 4}} /></button>)}
      {ANIMALS.slice(0, 6).map(a => <button key={a} className={"lbtn ghost" + (stamp === a ? " on" : "")} onClick={() => setStamp(stamp === a ? null : a)}>{a}</button>)}
      <button className="lbtn ghost" onClick={clear} aria-label={tx("clear")}>🗑</button>
    </div>
    <canvas ref={cv} className="lcanvas" id="lcanvas" onPointerDown={down} onPointerMove={move} onPointerUp={() => last.current = null} onPointerCancel={() => last.current = null} />
  </div>;
}

/* ---------- balloons: pop the ones that show the target ---------- */
type Ball = {id: number; x: number; ch: string; c: string; d: number; popped?: boolean; shake?: boolean};
const GOAL = 5;
function Balloons({home}: {home: () => void}) {
  const pool = useRef<string>(""), [target, setTarget] = useState(""), [balls, setBalls] = useState<Ball[]>([]), [got, setGot] = useState(0), [won, setWon] = useState(false);
  const idn = useRef(0), animal = useMemo(() => pickOne(ANIMALS), [won]);
  function round() {
    const kinds = ["ABC", "abc", "123"] as const, k = pickOne(kinds); pool.current = k;
    setTarget(pickOne(SETS[k].chars)); setGot(0); setWon(false); setBalls([]);
  }
  useEffect(round, []);
  useEffect(() => {
    if (won || !target) return;
    const chars = SETS[pool.current as SetId].chars;
    const t = setInterval(() => {
      const ch = Math.random() < 0.4 ? target : pickOne(chars.filter(c => c !== target));
      const b: Ball = {id: ++idn.current, x: 4 + rnd(80), ch, c: pickOne(COLORS), d: 6 + Math.random() * 3};
      setBalls(bs => [...bs.filter(x => !x.popped).slice(-10), b]);
    }, 900);
    return () => clearInterval(t);
  }, [target, won]);
  function tap(b: Ball) {
    if (b.popped) return;
    if (b.ch === target) {
      pop(); setBalls(bs => bs.map(x => x.id === b.id ? {...x, popped: true} : x));
      const n = got + 1; setGot(n); if (n >= GOAL) { setWon(true); yay(); addStar("pop" + target); }
    } else { oops(); setBalls(bs => bs.map(x => x.id === b.id ? {...x, shake: true} : x)); setTimeout(() => setBalls(bs => bs.map(x => x.id === b.id ? {...x, shake: false} : x)), 500); }
  }
  return <div className="lstage">
    <div className="ltop"><button className="lbtn ghost" onClick={home} aria-label="home">🏠</button>
      <span className="ltarget">🎯 <b id="ltarget">{target}</b></span>
      <span className="lgot">{Array.from({length: GOAL}, (_, i) => <i key={i} className={i < got ? "on" : ""}>🎈</i>)}</span></div>
    <div className="lsky" id="lsky">{balls.map(b =>
      <button key={b.id} className={"lballoon" + (b.popped ? " popped" : "") + (b.shake ? " shake" : "")} data-ch={b.ch}
        style={{left: b.x + "%", animationDuration: b.d + "s", ["--bc" as string]: b.c}}
        onPointerDown={() => tap(b)} onAnimationEnd={e => { if (e.animationName === "lrise") setBalls(bs => bs.filter(x => x.id !== b.id)); }}>
        <span>{b.ch}</span></button>)}</div>
    {won && <Party animal={animal} onNext={round} />}
  </div>;
}

/* ---------- count the animals ---------- */
function Count({home}: {home: () => void}) {
  const [max, setMax] = useState(5), [q, setQ] = useState(() => mk(5)), [marks, setMarks] = useState<number[]>([]), [bad, setBad] = useState<number | null>(null), [won, setWon] = useState(false);
  const streak = useRef(0);
  function mk(m: number) {
    const n = 1 + rnd(m), opts = new Set([n]);
    while (opts.size < 3) { const o = 1 + rnd(Math.max(m, 4) + 1); if (o > 0) opts.add(o); }
    return {n, a: pickOne(ANIMALS), opts: [...opts].sort((x, y) => x - y)};
  }
  const next = () => { setQ(mk(max)); setMarks([]); setWon(false); setBad(null); };
  function answer(o: number) {
    if (o === q.n) {
      yay(); setWon(true); addStar("count"); streak.current++;
      if (streak.current >= 3 && max < 10) { setMax(max + 1); streak.current = 0; }
    } else { oops(); setBad(o); streak.current = 0; setTimeout(() => setBad(null), 600); }
  }
  /* tapping an animal puts the next number on it, so counting is one tap per animal */
  const mark = (i: number) => { if (!marks.includes(i)) { setMarks([...marks, i]); tone([500 + marks.length * 60], 0.08); } };
  return <div className="lstage">
    <div className="ltop"><button className="lbtn ghost" onClick={home} aria-label="home">🏠</button><span className="ltarget">{tx("howMany")}</span></div>
    <div className={"lfarm" + (won ? " dance" : "")} id="lfarm">{Array.from({length: q.n}, (_, i) =>
      <button key={i} className="lanimal" style={{animationDelay: i * 0.12 + "s"}} onClick={() => mark(i)}>
        {q.a}{marks.includes(i) && <b className="lmark">{marks.indexOf(i) + 1}</b>}</button>)}</div>
    <div className="lopts">{q.opts.map(o =>
      <button key={o} className={"lnumbtn" + (bad === o ? " shake" : "")} data-n={o} onClick={() => !won && answer(o)}>{o}</button>)}</div>
    {won && <Party animal={q.a} onNext={next} />}
  </div>;
}

/* ---------- home ---------- */
function Little() {
  const [mode, setMode] = useState<Mode>({m: "home"});
  const home = () => setMode({m: "home"});
  if (mode.m === "trace") return <Trace set={mode.set} home={home} />;
  if (mode.m === "draw") return <Draw home={home} />;
  if (mode.m === "balloons") return <Balloons home={home} />;
  if (mode.m === "count") return <Count home={home} />;
  const tiles: {id: string; big: string; label: string; go: () => void; c: string}[] = [
    {id: "tABC", big: "ABC", label: tx("trace"), go: () => setMode({m: "trace", set: "ABC"}), c: "#fde68a"},
    {id: "tabc", big: "abc", label: tx("trace"), go: () => setMode({m: "trace", set: "abc"}), c: "#bbf7d0"},
    {id: "t123", big: "123", label: tx("trace"), go: () => setMode({m: "trace", set: "123"}), c: "#bfdbfe"},
    {id: "tdraw", big: "🎨", label: tx("draw"), go: () => setMode({m: "draw"}), c: "#fbcfe8"},
    {id: "tpop", big: "🎈", label: tx("balloons"), go: () => setMode({m: "balloons"}), c: "#fecaca"},
    {id: "tcount", big: "🐾", label: tx("count"), go: () => setMode({m: "count"}), c: "#ddd6fe"},
  ];
  return <div className="lhome">
    <div className="lhead"><h1>{tx("hi")} {S.name}! <span className="lwave">👋</span></h1>
      <span className="lstars" id="lstars">⭐ {LS().stars}</span>
      <button className="lbtn ghost" onClick={welcome} aria-label="profile">✎</button></div>
    <div className="ltiles">{tiles.map(t =>
      <button key={t.id} id={t.id} className="ltile" style={{background: t.c}} onClick={t.go}>
        <span className="lbigt">{t.big}</span><span>{t.label}</span></button>)}</div>
  </div>;
}

export const showLittle = () => showReact(<Little />);
