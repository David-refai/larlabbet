/* "Lilla labbet": the page for Year 1. Trace dotted letters and digits, draw freely,
   pop balloons with the right letter, and count animals. Few words: big pictures and buttons. */
import {useEffect, useMemo, useRef, useState} from "react";
import {showReact} from "./mount";
import {S, save, lang, REDUCED, welcome} from "../legacy/core.js";
import {SETS, type SetId} from "../little/glyphs";
import {say, sayNum, sayText, LETTER_WORD, NUM_WORD, ALL_KEYS, keyOf, putClip, dropClip, clipKeys, hasDeviceVoice} from "../little/voice";

const TX: Record<string, Record<string, string>> = {
  sv: {title: "Lilla labbet", hi: "Hej", trace: "Spåra", letters: "Bokstäver", numbers: "Siffror", words: "Ord", draw: "Rita", balloons: "Ballonger", count: "Räkna djur", find: "Hitta", clear: "Sudda", again: "Igen", next: "Nästa", stars: "stjärnor", howMany: "Hur många?", rec: "Spela in rösten", recHelp: "Tryck på 🎙, säg ljudet tydligt och tryck igen. Barnet hör sedan din röst.", say: "Säg", voice: "Röst", vAuto: "Inspelad eller enhetens röst", vRec: "Bara inspelad", vOff: "Av", noMic: "Mikrofonen gick inte att öppna. Välj en ljudfil i stället.", noVoice: "Den här enheten har ingen svensk röst. Spela in din egen."},
  en: {title: "Little lab", hi: "Hi", trace: "Trace", letters: "Letters", numbers: "Numbers", words: "Words", draw: "Draw", balloons: "Balloons", count: "Count animals", find: "Find", clear: "Clear", again: "Again", next: "Next", stars: "stars", howMany: "How many?", rec: "Record the voice", recHelp: "Tap 🎙, say the sound clearly and tap again. Your child then hears your voice.", say: "Say", voice: "Voice", vAuto: "Recorded or device voice", vRec: "Recorded only", vOff: "Off", noMic: "Could not open the microphone. Pick a sound file instead.", noVoice: "This device has no Swedish voice. Record your own."},
  ar: {title: "المختبر الصغير", hi: "مرحبًا", trace: "تتبّع", letters: "الحروف", numbers: "الأرقام", words: "الكلمات", draw: "ارسم", balloons: "بالونات", count: "عُدّ الحيوانات", find: "ابحث عن", clear: "امسح", again: "مرة أخرى", next: "التالي", stars: "نجوم", howMany: "كم عددها؟", rec: "سجّل الصوت", recHelp: "اضغط 🎙 وانطق الصوت بوضوح ثم اضغط مرة أخرى. سيسمع الطفل صوتك.", say: "قل", voice: "الصوت", vAuto: "المسجَّل أو صوت الجهاز", vRec: "المسجَّل فقط", vOff: "مطفأ", noMic: "تعذّر فتح الميكروفون. اختر ملفًا صوتيًا بدلًا من ذلك.", noVoice: "لا يوجد صوت سويدي على هذا الجهاز. سجّل صوتك."},
};
const tx = (k: string) => (TX[lang] || TX.sv)[k];

type Little = {stars: number; t: Record<string, number>; voice?: string};
const LS = (): Little => { if (!S.little) S.little = {stars: 0, t: {}}; return S.little; };
const vo = () => ({mode: LS().voice || "auto", muted: S.sound === false});
const talk = (ch: string, withWord = false) => { say(ch, {...vo(), withWord}); };
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

type Mode = {m: "rec"} | {m: "lesson"; set: "ABC" | "123"} | {m: "words"} | {m: "home"} | {m: "trace"; set: SetId} | {m: "draw"} | {m: "balloons"} | {m: "count"};

function Party({animal, word, onNext, onAgain}: {animal: string; word?: string; onNext?: () => void; onAgain?: () => void}) {
  const balls = useMemo(() => Array.from({length: 14}, (_, i) => ({i, x: rnd(92), d: 2.2 + Math.random() * 2, c: pickOne(COLORS), w: Math.random() * .8})), []);
  return <div className="lparty" role="status">
    {balls.map(b => <span key={b.i} className="lball" style={{left: b.x + "%", background: b.c, animationDuration: b.d + "s", animationDelay: b.w + "s"}} />)}
    <div className="lwin"><span className="lstar">⭐</span><span className="ljump">{animal}</span>{word && <b className="lword">{word}</b>}
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

/* one tracing sheet. level 0: dotted line and a ladybug that shows the way; 1: dotted line only;
   2: a faint line and just the start dot, so the child writes it almost alone */
function TracePad({strokes, level, onDone}: {strokes: string[]; level: number; onDone: () => void}) {
  const smp = useMemo(() => strokes.map(sample), [strokes]);
  const [cur, setCur] = useState(0), [ink, setInk] = useState<Smp[]>([]), [far, setFar] = useState(false);
  const reach = useRef(-1), live = useRef<Smp | null>(null), svg = useRef<SVGSVGElement>(null), [bug, setBug] = useState<{x: number; y: number} | null>(null);
  const [, force] = useState(0);
  const done = cur >= smp.length;

  /* a ladybug walks along the stroke to show where to start and which way to go */
  useEffect(() => {
    if (done || level > 0) { setBug(null); return; }
    const pts = smp[cur].pts; if (REDUCED || pts.length < 2) { setBug(pts[0]); return; }
    let raf = 0; const t0 = performance.now(), dur = Math.max(900, smp[cur].len * 14);
    const step = (t: number) => {
      const k = ((t - t0) % (dur + 900)) / dur;
      setBug(reach.current >= 0 ? null : pts[Math.min(pts.length - 1, Math.floor(Math.min(1, k) * (pts.length - 1)))]);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step); return () => cancelAnimationFrame(raf);
  }, [cur, smp, done, level]);

  const toBox = (e: React.PointerEvent) => {
    const m = svg.current!.getScreenCTM()!.inverse(), p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m);
    return {x: p.x, y: p.y};
  };
  /* follow the finger: a point of the line counts only when the line before it is done, so start and direction matter */
  function feed(p: {x: number; y: number}) {
    if (done) return;
    const pts = smp[cur].pts; let moved = true;
    while (moved) {
      moved = false;
      for (let i = reach.current + 1; i < Math.min(pts.length, reach.current + 7); i++)
        if (Math.hypot(pts[i].x - p.x, pts[i].y - p.y) < R) { reach.current = i; moved = true; }
    }
    if (reach.current >= pts.length - 2) {
      reach.current = -1; const nx = cur + 1; setCur(nx); live.current = null; setInk([]);
      if (nx >= smp.length) { ding(); setTimeout(onDone, 650); } else tone([700], 0.07);
    }
  }
  function down(e: React.PointerEvent) {
    if (done) return; (e.target as Element).setPointerCapture?.(e.pointerId);
    const p = toBox(e); live.current = [p]; setInk(k => [...k, live.current!]);
    const s0 = smp[cur].pts[0]; setFar(reach.current < 0 && Math.hypot(s0.x - p.x, s0.y - p.y) > R * 1.6);
    feed(p);
  }
  function move(e: React.PointerEvent) {
    if (!live.current) return; const p = toBox(e); live.current.push(p); force(n => n + 1); feed(p);
  }
  const up = () => { live.current = null; };
  const arrow = (pts: Smp) => {
    if (pts.length < 4) return null;
    const a = pts[0], b = pts[3], ang = Math.atan2(b.y - a.y, b.x - a.x), ox = a.x + Math.cos(ang) * 16, oy = a.y + Math.sin(ang) * 16;
    const w = (s: number) => `${ox + Math.cos(ang + s) * -8},${oy + Math.sin(ang + s) * -8}`;
    return <polyline points={`${w(0.6)} ${ox},${oy} ${w(-0.6)}`} className="larrow" />;
  };
  return <svg ref={svg} className={"lpaper lv" + level} id="lpaper" viewBox="-10 -38 120 205" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
    <line x1="-10" x2="110" y1="10" y2="10" className="lrule" /><line x1="-10" x2="110" y1="55" y2="55" className="lrule dash" />
    <line x1="-10" x2="110" y1="120" y2="120" className="lrule base" />
    {smp.map((_, i) => i < cur
      ? <path key={i} d={strokes[i]} className="ldone" stroke={["#6366f1", "#ec4899", "#16a34a"][level]} />
      : <path key={i} d={strokes[i]} className={(level === 2 ? "lghost" : "ldot") + (i === cur ? " now" : "")} />)}
    {ink.map((k, i) => <polyline key={i} points={k.map(p => p.x + "," + p.y).join(" ")} className="link" />)}
    {!done && <g>
      {level < 2 && arrow(smp[cur].pts)}
      <circle cx={smp[cur].pts[0].x} cy={smp[cur].pts[0].y} r="7" className={"lstart" + (far ? " far" : "")} />
      <text x={smp[cur].pts[0].x} y={smp[cur].pts[0].y + 3.5} className="lnum">{cur + 1}</text>
      {bug && <text x={bug.x} y={bug.y + 5} className="lbug">🐞</text>}
    </g>}
  </svg>;
}

/* the word under a picture, with the letter it starts with in colour */
const Word = ({w, ch}: {w: string; ch: string}) =>
  <span className="lwordbig"><b>{w.slice(0, 1).toUpperCase() === ch ? w[0] : ""}</b>{w.slice(0, 1).toUpperCase() === ch ? w.slice(1) : w}</span>;

/* a letter (or a number) from start to end: meet it, trace the capital three times, the small letter three times,
   then meet its animal. Numbers: trace three times, then count that many animals. */
const REPS = 3;
function Lesson({set, home}: {set: "ABC" | "123"; home: () => void}) {
  const {chars, glyphs} = SETS[set], num = set === "123";
  const [idx, setIdx] = useState(() => Math.max(0, chars.findIndex(c => !LS().t[set + c])));
  const ch = chars[idx], K = keyOf(ch), lw = LETTER_WORD[K];
  const sheets = useMemo(() => {
    const up = (glyphs as Record<string, string[]>)[ch], lo = num ? null : SETS.abc.glyphs[ch.toLowerCase() as keyof typeof SETS.abc.glyphs] as string[];
    const out: {c: string; strokes: string[]; level: number}[] = [];
    for (let l = 0; l < REPS; l++) out.push({c: ch, strokes: up, level: l});
    if (lo) for (let l = 0; l < REPS; l++) out.push({c: ch.toLowerCase(), strokes: lo, level: l});
    return out;
  }, [ch]);
  const last = sheets.length + 1, [step, setStep] = useState(0), [shown, setShown] = useState(0);
  useEffect(() => { setStep(0); }, [ch]);
  useEffect(() => {
    if (step === 0) talk(ch, true);
    else if (step <= sheets.length) { if (sheets[step - 1].level === 0) talk(sheets[step - 1].c); }
    else if (step === last) {
      yay(); addStar(set + ch);
      if (!num) setTimeout(() => talk(ch, true), 600);
      else { /* count the animals out loud, one by one */
        setShown(0); const n = +ch, ts: number[] = [];
        for (let i = 1; i <= n; i++) ts.push(window.setTimeout(() => { setShown(i); sayNum(i, vo()); }, 500 + i * 900));
        if (!n) ts.push(window.setTimeout(() => sayNum(0, vo()), 500));
        return () => ts.forEach(clearTimeout);
      }
    }
  }, [step, ch]);
  const go = (d: number) => setIdx(i => (i + d + chars.length) % chars.length);
  const animal = num ? ANIMALS[+ch % ANIMALS.length] : lw?.[1] || "⭐";
  const sheet = step >= 1 && step <= sheets.length ? sheets[step - 1] : null;

  return <div className="lstage">
    <div className="ltop">
      <button className="lbtn ghost" onClick={home} aria-label="home">🏠</button>
      <button className="lbtn ghost" onClick={() => go(-1)} aria-label="prev">◀</button>
      <button className="lbig" id="lsay" onClick={() => talk(sheet ? sheet.c : ch, !sheet)} aria-label={tx("say")}>{sheet ? sheet.c : num ? ch : ch + ch.toLowerCase()} <small>🔊</small></button>
      <button className="lbtn ghost" onClick={() => go(1)} aria-label={tx("next")}>▶</button>
    </div>
    <div className="lsteps" id="lsteps">{Array.from({length: last + 1}, (_, i) => <i key={i} className={i < step ? "on" : i === step ? "now" : ""} />)}</div>
    {step === 0 && <div className="lintro" id="lintro">
      <div className="lpair"><span>{ch}</span>{!num && <span>{ch.toLowerCase()}</span>}</div>
      {num ? <div className="lcountrow">{Array.from({length: +ch}, (_, i) => <span key={i}>{animal}</span>)}{ch === "0" && <span className="muted">∅</span>}</div>
        : <button className="lanimalbig" onClick={() => talk(ch, true)}>{animal}<Word w={lw[0]} ch={ch} /></button>}
      <button className="lbtn" id="lstart" onClick={() => setStep(1)}>✏️ ➜</button>
    </div>}
    {sheet && <TracePad key={step} strokes={sheet.strokes} level={sheet.level} onDone={() => setStep(s => s + 1)} />}
    {step === last && (num
      ? <div className="lintro"><div className="lcountrow big">{Array.from({length: +ch}, (_, i) =>
          <span key={i} className={i < shown ? "in" : "out"}>{animal}{i < shown && <b className="lmark">{i + 1}</b>}</span>)}</div>
          <div className="lpair"><span>{ch}</span></div>
          <div className="row" style={{justifyContent: "center"}}><button className="lbtn ghost" onClick={() => setStep(0)}>↻</button><button className="lbtn" id="lnext" onClick={() => go(1)}>➜</button></div></div>
      : <Party animal={animal} word={lw ? ch + " som " + lw[0] : ""} onAgain={() => setStep(0)} onNext={() => go(1)} />)}
    <div className="lstrip">{chars.map((c, i) =>
      <button key={c} className={"lchip" + (i === idx ? " on" : "") + (LS().t[set + c] ? " ok" : "")} onClick={() => setIdx(i)}>{c}</button>)}</div>
  </div>;
}

/* free tracing of any letter, small letter or number (one sheet, then the next) */
function Trace({set, home}: {set: SetId; home: () => void}) {
  const {chars, glyphs} = SETS[set];
  const [idx, setIdx] = useState(0), [won, setWon] = useState(false), [n, setN] = useState(0);
  const ch = chars[idx], strokes = (glyphs as Record<string, string[]>)[ch];
  useEffect(() => { setWon(false); talk(ch); }, [ch]);
  const go = (d: number) => setIdx(i => (i + d + chars.length) % chars.length);
  return <div className="lstage">
    <div className="ltop">
      <button className="lbtn ghost" onClick={home} aria-label="home">🏠</button>
      <button className="lbtn ghost" onClick={() => go(-1)} aria-label="prev">◀</button>
      <button className="lbig" id="lsay" onClick={() => talk(ch, true)} aria-label={tx("say")}>{ch} <small>🔊</small></button>
      <button className="lbtn ghost" onClick={() => go(1)} aria-label={tx("next")}>▶</button>
    </div>
    <TracePad key={ch + n} strokes={strokes} level={0} onDone={() => { setWon(true); yay(); addStar(set + ch); }} />
    <div className="lstrip">{chars.map((c, i) =>
      <button key={c} className={"lchip" + (i === idx ? " on" : "") + (LS().t[set + c] ? " ok" : "")} onClick={() => setIdx(i)}>{c}</button>)}</div>
    {won && <Party animal={LETTER_WORD[keyOf(ch)]?.[1] || "⭐"} onAgain={() => { setWon(false); setN(x => x + 1); }} onNext={() => go(1)} />}
  </div>;
}

/* ---------- words: drag each animal's name to the animal ---------- */
function Words({home}: {home: () => void}) {
  const pool = useMemo(() => {
    const ks = Object.keys(LETTER_WORD).filter(k => /^[A-ZÅÄÖ]$/.test(k) && !["Q", "X", "Y", "W", "C"].includes(k));
    const known = ks.filter(k => LS().t["ABC" + k]);
    return known.length >= 4 ? known : ks.slice(0, Math.max(6, known.length));
  }, []);
  const [round, setRound] = useState(0), [placed, setPlaced] = useState<string[]>([]), [pick, setPick] = useState<string | null>(null), [won, setWon] = useState(false);
  const [drag, setDrag] = useState<{k: string; x: number; y: number} | null>(null), [bad, setBad] = useState<string | null>(null);
  const items = useMemo(() => { const a = [...pool].sort(() => Math.random() - .5).slice(0, 3); return {animals: a, words: [...a].sort(() => Math.random() - .5)}; }, [round]);
  function drop(word: string, on: string | null) {
    if (on === word) {
      const p = [...placed, word]; setPlaced(p); setPick(null); sayText("W:" + LETTER_WORD[word][0], LETTER_WORD[word][0], vo());
      if (p.length === items.animals.length) setTimeout(() => { setWon(true); yay(); addStar("words"); }, 700);
    } else if (on) { oops(); setBad(word); setTimeout(() => setBad(null), 500); }
  }
  function down(e: React.PointerEvent, k: string) {
    (e.target as Element).setPointerCapture?.(e.pointerId); setDrag({k, x: e.clientX, y: e.clientY});
  }
  const move = (e: React.PointerEvent) => { if (drag) setDrag({...drag, x: e.clientX, y: e.clientY}); };
  function up(e: React.PointerEvent) {
    if (!drag) return;
    const el = document.elementsFromPoint(e.clientX, e.clientY).find(x => (x as HTMLElement).dataset?.animal) as HTMLElement | undefined;
    const moved = Math.hypot(e.clientX - drag.x, e.clientY - drag.y) > 0;
    setDrag(null);
    if (el) drop(drag.k, el.dataset.animal!); else if (!moved || !el) setPick(pick === drag.k ? null : drag.k);
  }
  const next = () => { setRound(r => r + 1); setPlaced([]); setWon(false); setPick(null); };
  return <div className="lstage">
    <div className="ltop"><button className="lbtn ghost" onClick={home} aria-label="home">🏠</button><span className="ltarget">🐾 ➜ 🔤</span></div>
    <div className="lzoo" id="lzoo">{items.animals.map(k =>
      <button key={k} className={"lzooa" + (placed.includes(k) ? " ok" : "")} data-animal={k}
        onClick={() => pick ? drop(pick, k) : sayText("W:" + LETTER_WORD[k][0], LETTER_WORD[k][0], vo())}>
        <span className="lzooe" data-animal={k}>{LETTER_WORD[k][1]}</span>
        <span className="lslot" data-animal={k}>{placed.includes(k) ? LETTER_WORD[k][0] : ""}</span></button>)}</div>
    <div className="lwords" id="lwords">{items.words.filter(k => !placed.includes(k)).map(k =>
      <span key={k} className={"lwcard" + (pick === k ? " on" : "") + (bad === k ? " shake" : "") + (drag?.k === k ? " drag" : "")} data-w={k}
        style={drag?.k === k ? {position: "fixed", left: drag.x, top: drag.y, transform: "translate(-50%,-50%)", pointerEvents: "none"} : undefined}
        onPointerDown={e => down(e, k)} onPointerMove={move} onPointerUp={up}>{LETTER_WORD[k][0]}</span>)}</div>
    {won && <Party animal={LETTER_WORD[items.animals[0]][1]} onNext={next} />}
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
    const t = pickOne(SETS[k].chars); setTarget(t); setGot(0); setWon(false); setBalls([]); setTimeout(() => talk(t), 300);
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
      pop(); talk(target); setBalls(bs => bs.map(x => x.id === b.id ? {...x, popped: true} : x));
      const n = got + 1; setGot(n); if (n >= GOAL) { setWon(true); yay(); addStar("pop" + target); }
    } else { oops(); setBalls(bs => bs.map(x => x.id === b.id ? {...x, shake: true} : x)); setTimeout(() => setBalls(bs => bs.map(x => x.id === b.id ? {...x, shake: false} : x)), 500); }
  }
  return <div className="lstage">
    <div className="ltop"><button className="lbtn ghost" onClick={home} aria-label="home">🏠</button>
      <button className="ltarget" onClick={() => talk(target)} aria-label={tx("say")}>🎯 <b id="ltarget">{target}</b> 🔊</button>
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
      yay(); setWon(true); addStar("count"); setTimeout(() => sayNum(q.n, vo()), 500); streak.current++;
      if (streak.current >= 3 && max < 10) { setMax(max + 1); streak.current = 0; }
    } else { oops(); setBad(o); streak.current = 0; setTimeout(() => setBad(null), 600); }
  }
  /* tapping an animal puts the next number on it, so counting is one tap per animal */
  const mark = (i: number) => { if (!marks.includes(i)) { setMarks([...marks, i]); sayNum(marks.length + 1, vo()); } };
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
  if (mode.m === "lesson") return <Lesson set={mode.set} home={home} />;
  if (mode.m === "words") return <Words home={home} />;
  if (mode.m === "draw") return <Draw home={home} />;
  if (mode.m === "balloons") return <Balloons home={home} />;
  if (mode.m === "count") return <Count home={home} />;
  if (mode.m === "rec") return <Record home={home} />;
  const tiles: {id: string; big: string; label: string; go: () => void; c: string}[] = [
    {id: "tABC", big: "Aa", label: tx("letters"), go: () => setMode({m: "lesson", set: "ABC"}), c: "#fde68a"},
    {id: "t123", big: "123", label: tx("numbers"), go: () => setMode({m: "lesson", set: "123"}), c: "#bfdbfe"},
    {id: "twords", big: "🐻 ➜ björn", label: tx("words"), go: () => setMode({m: "words"}), c: "#bbf7d0"},
    {id: "tabc", big: "✏️", label: tx("trace"), go: () => setMode({m: "trace", set: "abc"}), c: "#fed7aa"},
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
    <div className="lparent">
      <button className="btn ghost" id="lrec" onClick={() => setMode({m: "rec"})}>🎙 {tx("rec")}</button>
    </div>
  </div>;
}

/* ---------- for the parent: record each letter and number in their own voice ---------- */
function Record({home}: {home: () => void}) {
  const [have, setHave] = useState<string[]>([]), [on, setOn] = useState<string | null>(null), [mode, setMode] = useState(LS().voice || "auto"), [err, setErr] = useState("");
  const rec = useRef<MediaRecorder | null>(null), file = useRef<HTMLInputElement>(null), fileKey = useRef("");
  useEffect(() => { clipKeys().then(setHave); }, []);
  const done = async (k: string, b: Blob) => { await putClip(k, b); setHave(await clipKeys()); say(k, {mode: "rec"}); };
  async function toggle(k: string) {
    if (on) { rec.current?.stop(); return; }
    try {
      const st = await navigator.mediaDevices.getUserMedia({audio: true}), r = new MediaRecorder(st), parts: Blob[] = [];
      r.ondataavailable = e => parts.push(e.data);
      r.onstop = () => { st.getTracks().forEach(t => t.stop()); setOn(null); done(k, new Blob(parts, {type: r.mimeType || "audio/webm"})); };
      rec.current = r; r.start(); setOn(k); setErr("");
    } catch { setErr(tx("noMic")); fileKey.current = k; file.current?.click(); }
  }
  const setV = (v: string) => { LS().voice = v; save(); setMode(v); };
  const phrase = (k: string) => /\d/.test(k) ? NUM_WORD[+k] : `${k} som ${LETTER_WORD[k][0]} ${LETTER_WORD[k][1]}`;
  return <div className="stack" style={{direction: "ltr"}}>
    <div className="ltop" style={{justifyContent: "flex-start"}}><button className="lbtn ghost" onClick={home} aria-label="home">🏠</button><h2 style={{margin: 0}}>🎙 {tx("rec")}</h2></div>
    <p className="muted">{tx("recHelp")}</p>
    {!hasDeviceVoice() && <p className="muted">ℹ️ {tx("noVoice")}</p>}
    <div className="seg" role="group" id="lvoice">{[["auto", tx("vAuto")], ["rec", tx("vRec")], ["off", tx("vOff")]].map(([v, l]) =>
      <button key={v} aria-pressed={mode === v} onClick={() => setV(v)}>{l}</button>)}</div>
    {err && <p className="err">{err}</p>}
    <input ref={file} type="file" accept="audio/*" capture="user" hidden onChange={e => { const f = e.target.files?.[0]; if (f) done(fileKey.current, f); e.target.value = ""; }} />
    <div className="lrecs">{ALL_KEYS.map(k =>
      <div key={k} className={"lrecrow" + (have.includes(k) ? " ok" : "")}>
        <b className="lreck">{k}</b><span className="lrecp">{phrase(k)}</span>
        <button className={"lbtn" + (on === k ? " recording" : " ghost")} disabled={!!on && on !== k} onClick={() => toggle(k)} aria-label="record">{on === k ? "⏹" : "🎙"}</button>
        <button className="lbtn ghost" onClick={() => say(k, {mode: have.includes(k) ? "rec" : "auto", withWord: true})} aria-label="play">▶</button>
        {have.includes(k) && <button className="lbtn ghost" onClick={async () => { await dropClip(k); setHave(await clipKeys()); }} aria-label="delete">🗑</button>}
      </div>)}</div>
  </div>;
}

export const showLittle = () => showReact(<Little />);
