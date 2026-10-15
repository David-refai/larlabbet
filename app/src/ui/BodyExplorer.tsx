/* "Utforska kroppen": a full screen where the pupil looks inside a body, layer by layer,
   taps an organ, isolates it and opens the heart, lungs or brain into their parts.
   The screen keeps the state and the side panels. The stage is the real 3D explorer
   (explorer/3d/Explorer3D.tsx, React Three Fiber, loaded only when this screen opens), or, when
   WebGL is missing or switched off (window.NO3D = true or ?no3d) or the build has no 3D (the
   artifact), the painted pictures (explorer/imageRenderer.ts), with the drawn 2.5D SVG body
   (explorer/svgRenderer.ts) as the fallback when a picture does not load. The texts and organs come from explorer/bodyData.ts. */
import {Component, Suspense, lazy, useEffect, useLayoutEffect, useRef, useState, type ReactNode} from "react";
import {showReact} from "./mount";
import {T, map, trOn} from "../legacy/core.js";
import {LAYERS, ORGANS, DETAILS, STAGES, EX3D, organById, tabsOf, partsOn, type LayerId, type OrganId, type DetailId, type T3, type StageId} from "../explorer/bodyData";
import {createBodyRenderer2D} from "../explorer/imageRenderer";
import {reducedMotion, type BodyRenderer} from "../explorer/renderer";
import {want3D, no3D} from "../explorer/webgl";

/* the 3D explorer is its own lazily loaded module: nothing of it runs before this screen opens */
/* the claude.ai artifact build leaves the 3D explorer out (VITE_WITH3D=0, see build.sh) */
const WITH3D = import.meta.env.VITE_WITH3D !== "0";
const Explorer3D = WITH3D ? lazy(() => import("../explorer/3d/Explorer3D")) : null;

/* if the 3D stage fails (no WebGL context, a crash), the 2D one takes over */
class Fallback extends Component<{onFail: () => void; children: ReactNode}, {failed: boolean}> {
  state = {failed: false};
  static getDerivedStateFromError() { return {failed: true}; }
  componentDidCatch(e: unknown) { console.warn("3D explorer failed, using the 2D one", e); this.props.onFail(); }
  render() { return this.state.failed ? null : this.props.children; }
}

/* Swedish only on screen; the organ and part texts carry their translations */
const X = {
  title: "Utforska kroppen", layers: "Lager", show: (s: string) => `Visa eller dölj ${s.toLowerCase()}`,
  bodyT: "Det här är du!", bodyS: "Kroppen är full av delar som jobbar hela tiden. Titta inuti och se vad som finns under huden.",
  look: "Titta inuti →", pickT: "Tryck på ett organ", pickS: "Tryck på ett organ i kroppen eller välj ett här.",
  noOrgans: "Slå på Organ för att kunna trycka på organen.", allBack: "Visa alla organ igen",
  iso: "Isolera", unIso: "Hela kroppen", inBody: "Visa i kroppen", wholeBody: "Hela kroppen", backTo: (o: string) => `← Tillbaka till ${o.toLowerCase()}`, hide: "Dölj", more: "Mer", detail: "Se delarna →", close: "Stäng",
  toBody: "← Till kroppen", tapPart: "Tryck på en etikett för att läsa om den delen.", play: "▶ Spela", pause: "⏸ Pausa",
  still: "Rörelserna är avstängda (minska rörelse). Prickarna visar vägen.", parts: "Delar", stages: "Steg",
};

/* the Swedish text and, when the translation setting is on, the translation under it */
function Tr({t}: {t: T3}) {
  const l = trOn() as "" | "en" | "ar";
  return <>{t.sv}{l && <span className="trl" dir="auto">{t[l]}</span>}</>;
}

/* what the pupil is looking at, kept while the app is open so that changing the translation
   setting (which redraws the screen) does not send them back to the start */
type View = {layers: Set<LayerId>; sel: OrganId | null; iso: boolean; hidden: Set<OrganId>; det: DetailId | null; tab: string; part: string | null; flow: boolean; more: boolean};
const START = (): View => ({layers: new Set(["skin"]), sel: null, iso: false, hidden: new Set(), det: null, tab: "oversikt", part: null, flow: true, more: false});
let memo: View = START();

function Explorer({keep}: {keep: boolean}) {
  const host = useRef<HTMLDivElement>(null), root = useRef<HTMLDivElement>(null), R = useRef<BodyRenderer | null>(null);
  const [v0] = useState<View>(() => keep ? memo : START());
  const [layers, setLayers] = useState(v0.layers);
  const [sel, setSel] = useState(v0.sel);
  const [iso, setIso] = useState(v0.iso);
  const [hidden, setHidden] = useState(v0.hidden);
  const [det, setDet] = useState(v0.det);
  const [tab, setTab] = useState(v0.tab);
  const [part, setPart] = useState(v0.part);
  const [flow, setFlow] = useState(v0.flow);
  const [more, setMore] = useState(v0.more);
  memo = {layers, sel, iso, hidden, det, tab, part, flow, more};
  const still = reducedMotion();
  const [use3d, setUse3d] = useState(() => WITH3D && want3D());
  const [compact, setCompact] = useState(false);

  /* one screen, no page scroll: the explorer takes the height left under the header */
  useLayoutEffect(() => {
    document.body.classList.add("inles");
    const fit = () => {
      const r = root.current; if (!r) return;
      let h = Math.floor(innerHeight - r.getBoundingClientRect().top - 10);
      r.style.height = Math.max(380, h) + "px";
      /* whatever still sticks out below (page margins and paddings) comes off too */
      const over = document.documentElement.scrollHeight - innerHeight;
      if (over > 0) { h -= over; r.style.height = Math.max(380, h) + "px"; }
    };
    fit(); addEventListener("resize", fit);
    return () => removeEventListener("resize", fit);
  }, []);
  const onPick = (p: {kind: "organ"; id: OrganId} | {kind: "part"; id: string}) => {
    if (p.kind === "organ") { setSel(p.id); setMore(false); setPart(null); }
    else setPart(x => x === p.id ? null : p.id);
  };
  useEffect(() => {
    if (use3d) return;
    const r = createBodyRenderer2D(); R.current = r; r.mount(host.current!);
    r.onPick(onPick);
    /* the renderer gets the current view (it may take over from a failed 3D stage) */
    r.setLayers(layers); r.select(sel); r.hide(hidden); r.isolate(iso && sel ? sel : null); r.detail(det, tab); r.setFlow(flow);
    return () => { r.destroy(); R.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [use3d]);
  /* a narrow, tall stage (a phone) numbers the labels instead of writing them out */
  useEffect(() => {
    const h = host.current; if (!use3d || !h) return;
    const f = () => setCompact(h.clientWidth < 560);
    f();
    const ro = new ResizeObserver(f); ro.observe(h);
    return () => ro.disconnect();
  }, [use3d]);
  useEffect(() => { R.current?.setLayers(layers); }, [layers]);
  useEffect(() => { R.current?.select(sel); }, [sel]);
  useEffect(() => { R.current?.hide(hidden); }, [hidden]);
  useEffect(() => { R.current?.isolate(iso && sel ? sel : null); }, [iso, sel]);
  useEffect(() => { R.current?.detail(det, tab); }, [det, tab]);
  useEffect(() => { R.current?.selectPart(part); }, [part, det, tab]);
  useEffect(() => { R.current?.setFlow(flow); }, [flow, det, tab]);

  const organ = sel ? organById(sel)! : null, D = det ? DETAILS[det] : null;
  const skin = layers.has("skin");
  const stage: StageId = D ? "detail" : sel && !skin ? "organ" : skin ? "body" : "inside";

  const goBody = () => { setDet(null); setIso(false); setSel(null); setLayers(new Set(["skin"])); };
  const goInside = () => {
    setDet(null); setIso(false); setSel(null);
    setLayers(l => { const n = new Set(l); n.delete("skin"); if (n.size === 0) n.add("organs"); return n; });
  };
  const toggle = (id: LayerId) => setLayers(l => {
    const n = new Set(l);
    if (n.has(id)) n.delete(id); else n.add(id);
    /* in 3D an inner layer switched on under the warm skin would not show: go inside (the skin turns see-through) */
    if (use3d && id !== "skin" && n.has(id) && n.has("skin")) n.delete("skin");
    if (id === "skin" && n.has("skin")) { setSel(null); setIso(false); }
    if (id === "skin" && !n.has("skin") && n.size === 0) n.add("organs");
    if (id === "organs" && !n.has("organs")) { setSel(null); setIso(false); }
    return n;
  });
  const openDetail = (id: DetailId) => { setIso(true); setDet(id); setTab(tabsOf(DETAILS[id], use3d)[0].id); setPart(null); setFlow(true); };
  /* back from an organ or a detail to the whole body (the layers stay as they are) */
  const wholeBody = () => { setDet(null); setPart(null); setIso(false); setSel(null); };
  const stageGo = (s: StageId) => {
    if (s === "body") goBody();
    else if (s === "inside") goInside();
    else if (s === "organ" && sel) { setDet(null); setIso(true); }
    else if (s === "detail" && organ?.detail) openDetail(organ.detail);
  };
  const canStage = (s: StageId) => s === "body" || s === "inside" || (s === "organ" && !!sel) || (s === "detail" && !!organ?.detail);
  const pItem = D && part ? D.parts.find(p => p.id === part) : null;
  const shown = D ? partsOn(D, tab, use3d) : [];
  const note = use3d && <p className="x3note" id="x3note"><Tr t={EX3D.simplified} /></p>;
  /* inside the body the layers (a muscle suit, brain folds, the skeleton) are simplified too */
  const innerOn = [...layers].some(l => l !== "skin");

  return <div className="xpl" ref={root} data-stage={stage}>
    <div className="xhead">
      <button className="btn ghost" id="back" onClick={map}>{T("back")}</button>
      <h2>🔬 {X.title}</h2>
      <nav className="xsteps" aria-label={X.stages}>{STAGES.map((s, i) =>
        <button key={s.id} data-s={s.id} aria-current={stage === s.id ? "step" : undefined} disabled={!canStage(s.id)} onClick={() => stageGo(s.id)}>
          <span className="xn">{i + 1}</span>{s.name}</button>)}</nav>
    </div>

    {D ? <div className="xside" role="tablist" aria-label={X.parts}>{tabsOf(D, use3d).map(t =>
      <button key={t.id} role="tab" className="xchip" data-tab={t.id} aria-selected={t.id === tab} onClick={() => { setTab(t.id); setPart(null); }}>{t.name.sv}</button>)}</div>
      : <div className="xside" role="group" aria-label={X.layers}>{LAYERS.map(l =>
        <button key={l.id} className="xchip" data-layer={l.id} aria-pressed={layers.has(l.id)} aria-label={X.show(l.name.sv)} onClick={() => toggle(l.id)}>
          <span className="xi" aria-hidden="true">{l.icon}</span>{l.name.sv}</button>)}</div>}

    <div className={"xstage" + (use3d ? " x3d" : "") + (use3d && D ? " indetail" : "") + (use3d && compact ? " compact" : "")} ref={host}>
      {use3d && Explorer3D && <Fallback onFail={() => { no3D(); setUse3d(false); }}>
        <Suspense fallback={<div className="x3load"><span className="x3spin" aria-hidden="true" />{EX3D.loading.sv}</div>}>
          <Explorer3D layers={layers} sel={sel} iso={iso} hidden={hidden} det={det} tab={tab} part={part} flow={flow} still={still}
            labels={shown.map(p => ({id: p.id, name: p.name.sv}))} compact={compact} tr={trOn() as "" | "en" | "ar"} onPick={onPick} />
        </Suspense>
      </Fallback>}
    </div>

    <section className="xinfo" id="xinfo" aria-live="polite">
      {D ? <>
        <span className="label">{D.title.sv}</span>
        {pItem ? <><h3 id="xname">{pItem.name.sv}{trOn() && <span className="trl" dir="auto">{pItem.name[trOn() as "en" | "ar"]}</span>}</h3><p id="xtext"><Tr t={pItem.info} /></p></>
          : <><p className="muted">{X.tapPart}</p>
            <div className="xorgs" id="xparts">{shown.map((p, i) =>
              <button key={p.id} className="xchip sm" data-part={p.id} onClick={() => setPart(p.id)}><b className="xno">{i + 1}</b>{p.name.sv}</button>)}</div></>}
        {tab === D.flowTab && <div className="xlegend" id="xlegend">{D.legend.map(g =>
          <span key={g.color}><i style={{background: g.color}} /><span><Tr t={g.name} /></span></span>)}</div>}
        {tab === D.flowTab && (still ? <p className="muted xnote">{X.still}</p>
          : <button className="btn ghost" id="xplay" aria-pressed={flow} onClick={() => setFlow(f => !f)}>{flow ? X.pause : X.play}</button>)}
        {note}
        <div className="row xbtns"><button className="btn ghost" id="xback" onClick={() => { setDet(null); setPart(null); }}>{use3d && organ ? X.backTo(organ.name.sv) : X.toBody}</button>
          {use3d && <button className="btn ghost" id="xwhole" onClick={wholeBody}>{X.wholeBody}</button>}</div>
      </> : stage === "body" ? <>
        <h3>{X.bodyT}</h3><p>{X.bodyS}</p>
        <div className="row"><button className="btn" id="xlook" onClick={goInside}>{X.look}</button></div>
      </> : organ ? <>
        <span className="label">{LAYERS.find(l => l.id === organ.layer)!.name.sv}</span>
        <h3 id="xname">{organ.name.sv}{trOn() && <span className="trl" dir="auto">{organ.name[trOn() as "en" | "ar"]}</span>}</h3>
        <p id="xtext"><Tr t={organ.info} /></p>
        {more && !organ.detail && <p className="xmore"><Tr t={organ.more} /></p>}
        {note}
        <div className="row xbtns">
          <button className="btn" id="xiso" aria-pressed={iso} onClick={() => setIso(v => !v)}>{iso ? (use3d ? X.inBody : X.unIso) : X.iso}</button>
          <button className="btn ghost" id="xhide" onClick={() => { setHidden(h => new Set(h).add(organ.id)); setSel(null); setIso(false); }}>{X.hide}</button>
          <button className="btn ghost" id="xmorebtn" aria-expanded={organ.detail ? undefined : more}
            onClick={() => organ.detail ? openDetail(organ.detail) : setMore(m => !m)}>{organ.detail ? X.more + " →" : X.more}</button>
          {use3d && iso && <button className="btn ghost" id="xwhole" onClick={wholeBody}>{EX3D.back.sv}</button>}
        </div>
      </> : <>
        <h3>{X.pickT}</h3>
        {layers.has("organs") ? <><p className="muted">{X.pickS}</p>
          <div className="xorgs">{ORGANS.filter(o => !hidden.has(o.id)).map(o =>
            <button key={o.id} className="xchip sm" data-organ={o.id} onClick={() => { setSel(o.id); setMore(false); }}>{o.name.sv}</button>)}</div></>
          : <p className="muted">{X.noOrgans}</p>}
        {hidden.size > 0 && <button className="btn ghost" id="xshowall" onClick={() => setHidden(new Set())}>{X.allBack}</button>}
        {innerOn && note}
      </>}
    </section>
  </div>;
}

/* keep: show the view the pupil had (the screen is only being redrawn) */
export const showExplorer = (keep = false) => showReact(<Explorer keep={keep} />);
