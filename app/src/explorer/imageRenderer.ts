/* The painted-picture renderer of "Utforska kroppen" (implements BodyRenderer from renderer.ts),
   used whenever the 3D explorer is off. It shows David's pictures (app/public/body/, served next to
   the page as body/<name>.webp) and keeps every name and text as code over them (bodyData.ts).
   - the body: one SVG with the full-body pictures stacked as layers (900 × 900, same framing),
     crossfading with CSS opacity; the skin picture has a black background, cut away by SKIN_MASK
   - an organ: a glow around its area on organs-front.webp (tap areas from imageMap.ts) and its name
   - isolate: the viewBox zooms to the organ, then the organ's own picture shows large with its text
   - detail: the heart, lungs or brain picture with tappable labels (numbered dots on a phone) and
     a flow of dots (blood, air, signals) that stands still under prefers-reduced-motion
   If a picture does not load, createBodyRenderer2D() hands over to the drawn SVG renderer. */
import "./imageRenderer.css";
import {DETAILS, organById, type Box, type LayerId, type OrganId, type DetailId} from "./bodyData";
import {reducedMotion, type BodyRenderer, type Pick} from "./renderer";
import {createSvgRenderer} from "./svgRenderer";
import {SKIN_MASK} from "./skinMask";
import {PIC, BODY_SIZE, BODY_HOME, BODY_MID, LAYER_PIC, GLASS_PIC, ORGAN_SPOTS, SPOT_ORDER, spotPath, spotBox, detailPic, FLOW_GRAD, type DetailPic} from "./imageMap";

const NS = "http://www.w3.org/2000/svg";
const INK = "#13213f";
const esc = (s: string) => s.replace(/[&<>"]/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"})[c] as string);
const ease = (t: number) => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
/* the width of a label in the marker font (Caveat is narrow) */
const textW = (s: string, size: number) => s.length * size * .46 + size * .9;

/* the inner pictures of the body, bottom to top (the skin lies over them, the ghost under them) */
const INNER: LayerId[] = ["muscles", "skeleton", "organs", "vessels", "nerves"];

const DEFS = `
<filter id="x-glow" x="-40%" y="-40%" width="180%" height="180%" color-interpolation-filters="sRGB">
  <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  -3 -3 -3 0 8.86" result="k0"/>
  <feComposite in="k0" in2="SourceGraphic" operator="in" result="key"/>
  <feMorphology in="key" operator="dilate" radius="3" result="fat"/>
  <feFlood flood-color="#ffcf3a"/><feComposite in2="fat" operator="in"/><feGaussianBlur stdDeviation="5" result="halo"/>
  <feComponentTransfer in="key" result="lit"><feFuncR type="linear" slope="1.08"/><feFuncG type="linear" slope="1.08"/><feFuncB type="linear" slope="1.08"/></feComponentTransfer>
  <feMerge><feMergeNode in="halo"/><feMergeNode in="halo"/><feMergeNode in="lit"/></feMerge>
</filter>
<linearGradient id="x-neckg" gradientUnits="userSpaceOnUse" x1="0" y1="282" x2="0" y2="330"><stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#fff"/></linearGradient>
<mask id="x-neck" maskUnits="userSpaceOnUse" x="0" y="0" width="${BODY_SIZE}" height="${BODY_SIZE}"><rect width="${BODY_SIZE}" height="${BODY_SIZE}" fill="url(#x-neckg)"/></mask>
<filter id="x-soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3"/></filter>
<mask id="x-skinmask" maskUnits="userSpaceOnUse" x="0" y="0" width="${BODY_SIZE}" height="${BODY_SIZE}"><image href="${SKIN_MASK}" width="${BODY_SIZE}" height="${BODY_SIZE}"/></mask>`;

const DET_DEFS = `<defs>
<filter id="x-dglow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="0" stdDeviation="5" flood-color="#ffcf3a" flood-opacity=".9"/></filter>
<radialGradient id="x-dback"><stop offset="0" stop-color="#e6f2ff"/><stop offset=".65" stop-color="#eef6ff" stop-opacity=".7"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
<radialGradient id="x-dred" cx=".35" cy=".35"><stop offset="0" stop-color="#ff8a8a"/><stop offset=".6" stop-color="#d21f36"/><stop offset="1" stop-color="#8e0e22"/></radialGradient>
<radialGradient id="x-dblue" cx=".35" cy=".35"><stop offset="0" stop-color="#9ab8ff"/><stop offset=".6" stop-color="#2a55c8"/><stop offset="1" stop-color="#16307a"/></radialGradient>
<radialGradient id="x-dair" cx=".35" cy=".35"><stop offset="0" stop-color="#ffffff"/><stop offset=".55" stop-color="#9ee3f7"/><stop offset="1" stop-color="#2a9cc4"/></radialGradient>
<radialGradient id="x-dsig" cx=".35" cy=".35"><stop offset="0" stop-color="#fff6c2"/><stop offset=".55" stop-color="#f2b705"/><stop offset="1" stop-color="#b07d00"/></radialGradient>
<marker id="x-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse"><path d="M1 1L9 5L1 9Z" fill="context-stroke"/></marker>
</defs>`;
const FLOW_STROKE: Record<string, string> = {red: "#e0505f", blue: "#4f78dc", air: "#5cc6e8", signal: "#f2b705"};

export function createImageRenderer(onFail: () => void = () => {}): BodyRenderer {
  let host: HTMLElement | null = null, body: SVGSVGElement, skull: SVGImageElement, det: SVGSVGElement, labels: SVGGElement, hideMask: SVGGElement, showMask: SVGGElement;
  let card: HTMLDivElement, cardImg: HTMLImageElement, cardName: HTMLElement, cardText: HTMLElement, vig: HTMLDivElement;
  let pick: (p: Pick) => void = () => {};
  let layers = new Set<LayerId>(["skin"]), sel: OrganId | null = null, iso: OrganId | null = null, hidden = new Set<OrganId>();
  let cur: DetailId | null = null, tab = "", part: string | null = null, flowOn = true;
  let vb: Box = [...BODY_HOME] as Box, raf = 0, ro: ResizeObserver | null = null, alive = false;

  const fail = () => { if (alive) { alive = false; onFail(); } };
  const svg = (cls: string, attrs: Record<string, string> = {}) => {
    const e = document.createElementNS(NS, "svg") as SVGSVGElement;
    e.setAttribute("class", cls);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  };
  const img = (name: string, extra = "") => `<image href="${PIC(name)}" x="0" y="0" width="${BODY_SIZE}" height="${BODY_SIZE}" preserveAspectRatio="none" ${extra}/>`;

  function setVB(b: Box) { vb = b; body.setAttribute("viewBox", b.map(n => Math.round(n * 10) / 10).join(" ")); }
  function animateVB(to: Box, done?: () => void) {
    cancelAnimationFrame(raf);
    if (reducedMotion()) { setVB(to); done?.(); return; }
    const from = [...vb] as Box, t0 = performance.now(), dur = 750;
    const step = (now: number) => {
      const k = ease(Math.min(1, (now - t0) / dur));
      setVB(from.map((v, i) => v + (to[i] - v) * k) as Box);
      if (k < 1) raf = requestAnimationFrame(step); else done?.();
    };
    raf = requestAnimationFrame(step);
  }

  /* the opacity of every layer and organ from the current state */
  function apply() {
    const on = (l: LayerId) => layers.has(l), skin = on("skin");
    const inner = INNER.filter(on);
    const op: Record<string, number> = {
      /* the glass body: only when nothing else shows (every inner picture has its own body) */
      ghost: !skin && !inner.length ? 1 : 0,
      /* with an inner layer switched on under the skin, the skin turns see-through */
      skin: skin ? (inner.length ? .35 : 1) : 0,
      organs: on("organs") || iso ? 1 : 0,
      skeleton: on("skeleton") ? (on("organs") ? .7 : 1) : 0,
      muscles: on("muscles") ? (on("organs") || on("skeleton") ? .45 : 1) : 0,
      vessels: on("vessels") ? (on("organs") ? .8 : 1) : 0,
      nerves: on("nerves") ? (on("organs") ? .8 : 1) : 0,
    };
    /* the skull would cover the face of the other pictures: with another inner layer it fades out at the neck */
    if (on("skeleton") && inner.length > 1) skull.setAttribute("mask", "url(#x-neck)"); else skull.removeAttribute("mask");
    body.querySelectorAll<SVGGElement>(".xl").forEach(g => {
      const o = op[g.dataset.layer as string] ?? 1;
      g.style.opacity = String(o); g.dataset.on = o > 0 ? "1" : "0";
    });
    /* hidden organs are cut out of organs-front, and the glass body shows through the hole */
    const holes = [...hidden].filter(id => id !== iso).map(id => `<path d="${spotPath(ORGAN_SPOTS[id])}"/>`).join("");
    hideMask.innerHTML = holes; showMask.innerHTML = holes;
    const tappable = !skin && (on("organs") || !!iso);
    body.querySelectorAll<SVGGElement>(".xorg").forEach(g => {
      const id = g.dataset.id as OrganId, gone = hidden.has(id) && id !== iso;
      g.style.opacity = gone ? "0" : iso && id !== iso ? ".08" : "1";
      g.classList.toggle("sel", id === sel && !skin);
      g.style.pointerEvents = tappable && !gone && !iso ? "auto" : "none";
      g.setAttribute("tabindex", tappable && !gone && !iso ? "0" : "-1");
      g.setAttribute("aria-pressed", String(id === sel));
    });
    body.classList.toggle("iso", !!iso);
    drawLabel();
  }

  /* the selected organ's name beside it, with a pointer line (not while zoomed in) */
  function drawLabel() {
    labels.innerHTML = "";
    if (!sel || iso || layers.has("skin")) return;
    const o = organById(sel)!, [ax, ay] = ORGAN_SPOTS[sel].at, left = ax < BODY_MID, fs = 34;
    const w = textW(o.name.sv, fs), h = fs * 1.35, edge = left ? 356 : 548, x = left ? edge - w : edge;
    labels.innerHTML = `<path d="M${ax} ${ay}L${edge} ${ay}" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="${ax}" cy="${ay}" r="6" fill="#ffcf3a" stroke="${INK}" stroke-width="2.5"/>
      <rect x="${x}" y="${ay - h / 2}" width="${w}" height="${h}" rx="${h / 2}" fill="#fff" stroke="${INK}" stroke-width="2.5"/>
      <text x="${x + w / 2}" y="${ay + fs * .33}" font-size="${fs}" fill="${INK}" text-anchor="middle">${esc(o.name.sv)}</text>`;
  }

  /* ---- the isolated organ ---- */
  function showCard(on: boolean) {
    host?.classList.toggle("isocard", on);
  }
  function fillCard(id: OrganId) {
    const o = organById(id)!;
    cardImg.src = PIC("organ-" + id); cardImg.alt = o.name.sv;
    cardName.textContent = o.name.sv; cardText.textContent = o.info.sv;
  }

  /* ---- the detail picture ---- */
  let compact = false;
  const isCompact = () => !!host && host.clientWidth < 560;
  function drawDetail() {
    if (!cur) { det.innerHTML = ""; host?.classList.remove("compact"); return; }
    const D = DETAILS[cur], P = detailPic(cur, tab), still = reducedMotion();
    const [W, H] = P.size, k = Math.max(W, H) / 560;
    compact = isCompact();
    host?.classList.toggle("compact", compact);
    const shown = D.parts.filter(p => p.tabs.includes(tab) && P.parts[p.id]);
    let lab = "", hits = "", view: Box;
    const fs = 27 * k, lh = fs * 1.45;
    if (compact) {
      view = [-16 * k, -16 * k, W + 32 * k, H + 32 * k];
      shown.forEach((p, i) => {
        const [ax, ay] = P.parts[p.id].at, r = 21 * k;
        lab += `<g class="xlab xnum" data-part="${p.id}" role="button" tabindex="0" aria-label="${esc(p.name.sv)}">
          <circle cx="${ax}" cy="${ay}" r="${r}" fill="#fff" stroke="${INK}" stroke-width="${3 * k}"/>
          <text x="${ax}" y="${ay + r * .38}" font-size="${r * 1.1}" font-family="Figtree,sans-serif" font-weight="800" fill="${INK}" text-anchor="middle" style="font-family:Figtree,sans-serif">${i + 1}</text></g>`;
      });
    } else {
      /* two columns of labels beside the picture, each at the height of its point, never on top of each other */
      const cols: Record<"l" | "r", {p: typeof shown[number]; y: number; w: number}[]> = {l: [], r: []};
      for (const p of shown) cols[P.parts[p.id].side || (P.parts[p.id].at[0] < W / 2 ? "l" : "r")].push({p, y: P.parts[p.id].at[1], w: textW(p.name.sv, fs)});
      const gap = lh + 12 * k;
      for (const c of Object.values(cols)) {
        c.sort((a, b) => a.y - b.y);
        c.forEach((e, i) => { e.y = Math.max(e.y, lh / 2, i ? c[i - 1].y + gap : -1e9); });
        for (let i = c.length - 1; i >= 0; i--) c[i].y = Math.min(c[i].y, i === c.length - 1 ? H - lh / 2 : c[i + 1].y - gap);
      }
      const side = Math.max(0, ...cols.l.map(e => e.w), ...cols.r.map(e => e.w)) + 34 * k;
      view = [-side - 10 * k, -20 * k, W + 2 * side + 20 * k, H + 40 * k];
      const order = new Map(shown.map((p, i) => [p.id, i]));
      for (const [s, c] of Object.entries(cols)) for (const e of c) {
        const [ax, ay] = P.parts[e.p.id].at, left = s === "l";
        const x = left ? -24 * k - e.w : W + 24 * k, ex = left ? -24 * k : W + 24 * k;
        lab += `<g class="xlab" data-part="${e.p.id}" data-i="${order.get(e.p.id)}" role="button" tabindex="0" aria-label="${esc(e.p.name.sv)}">
          <path d="M${ax} ${ay}L${ex} ${e.y}" stroke="${INK}" stroke-width="${2.4 * k}" stroke-linecap="round"/>
          <circle class="xa" cx="${ax}" cy="${ay}" r="${6.5 * k}" fill="#ffcf3a" stroke="${INK}" stroke-width="${2.4 * k}"/>
          <rect x="${x}" y="${e.y - lh / 2}" width="${e.w}" height="${lh}" rx="${lh / 2}" fill="#fff" stroke="${INK}" stroke-width="${2.4 * k}"/>
          <text x="${x + e.w / 2}" y="${e.y + fs * .33}" font-size="${fs}" fill="${INK}" text-anchor="middle">${esc(e.p.name.sv)}</text></g>`;
      }
    }
    for (const p of shown) {
      const {at: [x, y], r} = P.parts[p.id];
      hits += `<path class="xhit" data-part="${p.id}" d="M${x - r} ${y}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z"/>`;
    }
    const isFlow = tab === D.flowTab && !!P.flows;
    const picCls = isFlow && cur === "heart" ? "xbeat" : isFlow && cur === "lungs" ? "xbreathe" : "";
    det.setAttribute("viewBox", view.map(n => Math.round(n * 10) / 10).join(" "));
    det.setAttribute("aria-label", D.title.sv);
    det.classList.toggle("compact", compact);
    det.innerHTML = DET_DEFS + `<ellipse cx="${W / 2}" cy="${H / 2}" rx="${W * .62}" ry="${H * .58}" fill="url(#x-dback)"/>
      <g class="xdart${picCls ? " " + picCls : ""}" data-detail="${cur}" data-tab="${tab}"><image class="xdpic" href="${PIC(P.pic)}" width="${W}" height="${H}"/></g>
      ${isFlow ? flowDots(P, still, k) : ""}<g class="xhits">${hits}</g><g class="xlabs">${lab}</g>`;
    det.querySelector("image")?.addEventListener("error", fail);
    /* still dots sit at their place on the path */
    det.querySelectorAll<SVGCircleElement>("circle[data-path]").forEach(c => {
      const p = det.querySelector<SVGPathElement>("#" + c.dataset.path);
      if (!p) return;
      const pt = p.getPointAtLength(p.getTotalLength() * Number(c.dataset.t || 0));
      c.setAttribute("cx", pt.x.toFixed(1)); c.setAttribute("cy", pt.y.toFixed(1));
    });
    setFlowState();
    markPart();
  }
  /* the dots of the flow: blood around the heart, air in and out of the lungs, signals in the brain */
  function flowDots(P: DetailPic, still: boolean, k: number) {
    let s = `<g class="xflow" aria-hidden="true">`;
    P.flows!.forEach((f, i) => {
      const id = `xf${i}`, col = FLOW_STROKE[f.color], r = (f.color === "air" ? 8 : 9) * k;
      s += `<path id="${id}" class="xflowpath" d="${f.d}" stroke="${col}" marker-end="url(#x-arrow)"/>`;
      for (let j = 0; j < f.dots; j++) {
        const fill = `url(#${FLOW_GRAD[f.color]})`;
        /* air goes in and out together like a breath; blood and signals run round */
        const g = .1, span = 1 - (f.dots - 1) * g * .6;
        const t = f.back ? j * g * .6 + span * .5 : j / f.dots;
        if (still) { s += `<circle class="xdot" r="${r}" fill="${fill}" stroke="#fff" stroke-width="${2 * k}" data-path="${id}" data-t="${t.toFixed(3)}"/>`; continue; }
        const motion = f.back
          ? `dur="${f.dur}s" repeatCount="indefinite" keyPoints="${(j * g * .6).toFixed(3)};${(j * g * .6 + span).toFixed(3)};${(j * g * .6).toFixed(3)}" keyTimes="0;.5;1" calcMode="spline" keySplines=".45 0 .55 1;.45 0 .55 1"`
          : `dur="${f.dur}s" begin="${(-t * f.dur).toFixed(2)}s" repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" calcMode="linear"`;
        s += `<circle class="xdot" r="${r}" fill="${fill}" stroke="#fff" stroke-width="${2 * k}"><animateMotion ${motion}><mpath href="#${id}"/></animateMotion></circle>`;
      }
    });
    return s + "</g>";
  }
  function markPart() {
    det?.querySelectorAll<SVGElement>("[data-part]").forEach(e => e.classList.toggle("on", !!part && e.dataset.part === part));
  }
  function setFlowState() {
    if (!det) return;
    try { flowOn ? det.unpauseAnimations() : det.pauseAnimations(); } catch { /* old browsers */ }
    det.classList.toggle("paused", !flowOn);
  }

  const R: BodyRenderer = {
    mount(h) {
      host = h; alive = true; h.innerHTML = ""; h.classList.add("ximg");
      body = svg("xsvg xbody ximgbody", {viewBox: BODY_HOME.join(" "), role: "group", "aria-label": "En kropp att utforska", preserveAspectRatio: "xMidYMid meet"});
      let organs = "";
      for (const id of SPOT_ORDER) organs += `<clipPath id="xc-${id}"><path d="${spotPath(ORGAN_SPOTS[id])}"/></clipPath>`;
      const layer = (id: string, inner: string) => `<g class="xl" data-layer="${id}">${inner}</g>`;
      let spots = "";
      for (const id of SPOT_ORDER) {
        const o = organById(id)!;
        spots += `<g class="xorg" data-id="${id}" role="button" aria-label="${esc(o.name.sv)}" tabindex="-1">
          ${img(LAYER_PIC.organs, `class="xkey" clip-path="url(#xc-${id})"`)}<path class="xhit" d="${spotPath(ORGAN_SPOTS[id])}"/></g>`;
      }
      body.innerHTML = `<defs>${DEFS}${organs}
        <mask id="x-hide" maskUnits="userSpaceOnUse" x="0" y="0" width="${BODY_SIZE}" height="${BODY_SIZE}"><rect width="${BODY_SIZE}" height="${BODY_SIZE}" fill="#fff"/><g class="xmh" fill="#000" filter="url(#x-soft)"></g></mask>
        <mask id="x-show" maskUnits="userSpaceOnUse" x="0" y="0" width="${BODY_SIZE}" height="${BODY_SIZE}"><rect width="${BODY_SIZE}" height="${BODY_SIZE}" fill="#000"/><g class="xms" fill="#fff" filter="url(#x-soft)"></g></mask></defs>
        <rect x="-5000" y="-5000" width="11000" height="11000" fill="#fff"/>
        ${layer("ghost", img(GLASS_PIC))}
        ${INNER.map(l => layer(l, l === "organs" ? img(LAYER_PIC.organs, `mask="url(#x-hide)"`) + img(GLASS_PIC, `mask="url(#x-show)"`) : img(LAYER_PIC[l]))).join("")}
        ${layer("skin", img(LAYER_PIC.skin, `mask="url(#x-skinmask)"`))}
        <g class="xorgs">${spots}</g><g class="xlabel" pointer-events="none"></g>`;
      labels = body.querySelector(".xlabel")!; skull = body.querySelector(".xl[data-layer=skeleton] image")!; hideMask = body.querySelector(".xmh")!; showMask = body.querySelector(".xms")!;
      det = svg("xsvg xdet", {role: "group", preserveAspectRatio: "xMidYMid meet"});
      card = document.createElement("div"); card.className = "xiso";
      card.innerHTML = `<img alt="" draggable="false"><div class="xcap"><b class="xisoname"></b><span class="xisotext"></span></div>`;
      cardImg = card.querySelector("img")!; cardName = card.querySelector(".xisoname")!; cardText = card.querySelector(".xisotext")!;
      cardImg.addEventListener("error", () => { if (cardImg.getAttribute("src")) fail(); });
      vig = document.createElement("div"); vig.className = "xvig";
      h.append(body, card, det, vig);
      /* every body picture must load, or the drawn body takes over */
      for (const name of [GLASS_PIC, ...Object.values(LAYER_PIC)]) {
        const probe = new Image(); probe.onerror = fail; probe.src = PIC(name);
      }
      if (window.ResizeObserver) { ro = new ResizeObserver(() => { if (cur && isCompact() !== compact) drawDetail(); }); ro.observe(h); }
      const hit = (e: Event) => {
        const t = e.target as Element, o = t.closest<SVGGElement>(".xorg"), p = t.closest<SVGElement>("[data-part]");
        if (o && body.contains(o)) pick({kind: "organ", id: o.dataset.id as OrganId});
        else if (p && det.contains(p) && p.dataset.part && !p.closest(".xflow")) pick({kind: "part", id: p.dataset.part});
      };
      h.addEventListener("click", hit);
      h.addEventListener("keydown", e => { if ((e.key === "Enter" || e.key === " ") && (e.target as Element).closest("[role=button]")) { e.preventDefault(); hit(e); } });
      setVB(BODY_HOME); apply();
    },
    setLayers(on) { layers = new Set(on); apply(); },
    select(id) { sel = id; apply(); },
    hide(ids) { hidden = new Set(ids); apply(); },
    isolate(id) {
      const was = iso;
      iso = id; apply();
      if (!id) { showCard(false); animateVB(BODY_HOME); return; }
      fillCard(id);
      /* zoom in on the organ first, then its own picture comes forward */
      const [x, y, w, h] = spotBox(ORGAN_SPOTS[id]), pad = Math.max(w, h) * .7;
      if (was && host?.classList.contains("isocard")) { setVB([x - pad, y - pad, w + 2 * pad, h + 2 * pad]); return; }
      showCard(false);
      animateVB([x - pad, y - pad, w + 2 * pad, h + 2 * pad], () => { if (iso === id) showCard(true); });
    },
    detail(id, t) {
      const was = cur;
      cur = id; tab = t || (id ? DETAILS[id].tabs[0].id : ""); part = null;
      host?.classList.toggle("indetail", !!id);
      if (id && was !== id && !reducedMotion()) { det.classList.remove("pop"); void det.getBoundingClientRect(); det.classList.add("pop"); }
      drawDetail();
    },
    selectPart(id) { part = id; markPart(); },
    setFlow(play) { flowOn = play; setFlowState(); },
    onPick(cb) { pick = cb; },
    destroy() {
      alive = false; cancelAnimationFrame(raf); ro?.disconnect();
      if (host) { host.innerHTML = ""; host.classList.remove("ximg", "isocard", "compact", "indetail"); }
      host = null;
    },
  };
  return R;
}

/* The renderer of the 2D stage: the painted pictures, and the drawn SVG body if a picture fails.
   It remembers the view so that the SVG renderer can take over where the pictures were. */
export function createBodyRenderer2D(): BodyRenderer {
  let host: HTMLElement | null = null, pick: (p: Pick) => void = () => {};
  const st = {layers: new Set<LayerId>(["skin"]), sel: null as OrganId | null, hidden: new Set<OrganId>(), iso: null as OrganId | null,
    det: null as DetailId | null, tab: "", part: null as string | null, flow: true};
  let fellBack = false;
  const failover = () => {
    if (fellBack || !host) return;
    fellBack = true;
    console.warn("A body picture did not load: using the drawn body");
    r.destroy();
    r = createSvgRenderer(); r.mount(host); r.onPick(p => pick(p));
    r.setLayers(st.layers); r.hide(st.hidden); r.select(st.sel); r.isolate(st.iso); r.detail(st.det, st.tab); r.selectPart(st.part); r.setFlow(st.flow);
  };
  let r: BodyRenderer = createImageRenderer(failover);
  r.onPick(p => pick(p));
  return {
    mount(h) { host = h; r.mount(h); },
    setLayers(on) { st.layers = new Set(on); r.setLayers(on); },
    select(id) { st.sel = id; r.select(id); },
    hide(ids) { st.hidden = new Set(ids); r.hide(ids); },
    isolate(id) { st.iso = id; r.isolate(id); },
    detail(id, t) { st.det = id; st.tab = t || ""; st.part = null; r.detail(id, t); },
    selectPart(id) { st.part = id; r.selectPart(id); },
    setFlow(play) { st.flow = play; r.setFlow(play); },
    onPick(cb) { pick = cb; },
    destroy() { r.destroy(); host = null; },
  };
}
