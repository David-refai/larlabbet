/* The 2.5D SVG renderer of "Utforska kroppen" (implements BodyRenderer from renderer.ts).
   Two stacked SVGs: the whole body in layers, and the detail picture of one organ.
   Layers fade with CSS opacity transitions, isolating an organ animates the viewBox, flows use SMIL.
   With prefers-reduced-motion nothing moves: views jump and flow dots stand still. */
import {DEFS, GLASS, SHADOW, SKIN, MUSCLES, SKEL_BACK, SKEL_FRONT, VESSELS, NERVES, ORGAN_ART, ORGAN_ORDER, URETERS} from "./bodyArt";
import {DETAIL_ART, DETAIL_DEFS} from "./detailArt";
import {ORGANS, DETAILS, organById, type Box, type LayerId, type OrganId, type DetailId} from "./bodyData";
import {reducedMotion, type BodyRenderer, type Pick} from "./renderer";

const NS = "http://www.w3.org/2000/svg";
/* the whole body with room for labels on both sides */
export const HOME: Box = [-100, 14, 600, 786];
const MARKER = `font-family="Caveat,'Segoe Print','Comic Sans MS',cursive" font-weight="700"`;

const esc = (s: string) => s.replace(/[&<>"]/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"})[c] as string);
const ease = (t: number) => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export function createSvgRenderer(): BodyRenderer {
  let host: HTMLElement | null = null, body: SVGSVGElement, det: SVGSVGElement, labels: SVGGElement;
  let pick: (p: Pick) => void = () => {};
  let layers = new Set<LayerId>(["skin"]), sel: OrganId | null = null, iso: OrganId | null = null, hidden = new Set<OrganId>();
  let cur: DetailId | null = null, tab = "", part: string | null = null, flowOn = true;
  let vb: Box = [...HOME] as Box, raf = 0, ro: ResizeObserver | null = null;

  const el = (tag: string, attrs: Record<string, string>, html = "") => {
    const e = document.createElementNS(NS, tag) as SVGElement;
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (html) e.innerHTML = html;
    return e;
  };
  const group = (layer: string, html: string, extra: Record<string, string> = {}) =>
    el("g", {class: "xl", "data-layer": layer, ...extra}, html);

  function setVB(b: Box) { vb = b; body.setAttribute("viewBox", b.map(n => Math.round(n * 10) / 10).join(" ")); }
  function animateVB(to: Box) {
    cancelAnimationFrame(raf);
    if (reducedMotion()) { setVB(to); return; }
    const from = [...vb] as Box, t0 = performance.now(), dur = 750;
    const step = (now: number) => {
      const k = ease(Math.min(1, (now - t0) / dur));
      setVB(from.map((v, i) => v + (to[i] - v) * k) as Box);
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
  }

  /* the opacity of every layer and organ from the current state */
  function apply() {
    const on = (l: LayerId) => layers.has(l), inner = on("skeleton") || on("organs");
    const fade = iso ? .08 : 1;
    const op: Record<string, number> = {
      ghost: on("skin") ? 0 : 1,
      skin: on("skin") ? 1 : 0,
      muscles: on("muscles") ? (inner ? .5 : 1) * fade : 0,
      skeleton: on("skeleton") ? fade : 0,
      "skeleton-front": on("skeleton") ? (on("organs") ? .8 : 1) * fade : 0,
      organs: on("organs") || iso ? 1 : 0,
      vessels: on("vessels") ? fade : 0,
      nerves: on("nerves") ? fade : 0,
    };
    body.querySelectorAll<SVGGElement>(".xl").forEach(g => {
      const k = g.dataset.part === "front" ? "skeleton-front" : g.dataset.layer as string, o = op[k] ?? 1;
      g.style.opacity = String(o); g.dataset.on = o > 0 ? "1" : "0";
    });
    /* organs can be tapped once the skin is out of the way */
    const tappable = !on("skin") && (on("organs") || !!iso);
    body.querySelectorAll<SVGGElement>(".xorg").forEach(g => {
      const id = g.dataset.id as OrganId, gone = hidden.has(id) && id !== iso;
      g.style.opacity = gone ? "0" : iso && id !== iso ? ".08" : "1";
      g.classList.toggle("sel", id === sel);
      g.style.pointerEvents = tappable && !gone && (!iso || id === iso) ? "auto" : "none";
      g.setAttribute("tabindex", tappable && !gone ? "0" : "-1");
      g.setAttribute("aria-pressed", String(id === sel));
    });
    /* the small heart of the vessel layer and the brain of the nerve layer give way to the real organs */
    body.querySelectorAll<SVGElement>(".xure").forEach(e => { e.style.opacity = iso ? ".08" : "1"; });
    body.querySelectorAll<SVGElement>(".xvh,.xnb").forEach(e => { e.style.display = on("organs") ? "none" : ""; });
    body.classList.toggle("iso", !!iso);
    drawLabel();
  }

  /* the selected organ's name beside the body, with a pointer line (not while zoomed in) */
  function drawLabel() {
    labels.innerHTML = "";
    if (!sel || iso || layers.has("skin")) return;
    const o = organById(sel)!, [ax, ay] = o.anchor, left = ax < 200, tx = left ? -4 : 404, ty = ay;
    labels.innerHTML = `<path d="M${ax} ${ay} L${left ? tx + 8 : tx - 8} ${ty}" stroke="#13213f" stroke-width="2" stroke-dasharray="1 5" stroke-linecap="round"/>
      <circle cx="${ax}" cy="${ay}" r="5" fill="#ffcf3a" stroke="#13213f" stroke-width="2"/>
      <text x="${tx}" y="${ty + 9}" font-size="30" ${MARKER} fill="#13213f" text-anchor="${left ? "end" : "start"}" paint-order="stroke" stroke="#fff" stroke-width="6">${esc(o.name.sv)}</text>`;
  }

  /* ---- the detail picture ---- */
  /* a narrow, tall stage (a phone): the picture is cropped to the organ and parts get numbered dots */
  let compact = false;
  const isCompact = () => !!host && host.clientWidth < 560 && host.clientWidth < host.clientHeight * 1.05;
  function drawDetail() {
    if (!cur) { det.innerHTML = ""; return; }
    const D = DETAILS[cur], still = reducedMotion();
    compact = isCompact();
    det.setAttribute("viewBox", (compact ? D.compact : D.view).join(" "));
    det.setAttribute("aria-label", D.title.sv);
    det.classList.toggle("compact", compact); host?.classList.toggle("compact", compact);
    let lab = "";
    D.parts.filter(p => p.tabs.includes(tab) && (p.anchor[0] || p.anchor[1])).forEach((p, i) => {
      const [ax, ay] = p.anchor;
      if (compact) {
        lab += `<g class="xlab xnum" data-part="${p.id}" role="button" tabindex="0" aria-label="${esc(p.name.sv)}">
          <circle cx="${ax}" cy="${ay}" r="19" fill="#fff" stroke="#13213f" stroke-width="3"/>
          <text x="${ax}" y="${ay + 8}" font-size="23" font-family="Figtree,sans-serif" font-weight="800" fill="#13213f" text-anchor="middle">${i + 1}</text></g>`;
        return;
      }
      const w = Math.max(70, p.name.sv.length * 12.5 + 26), h = 38;
      const minX = D.view[0] + 4, maxX = D.view[0] + D.view[2] - 4;
      const cx = Math.min(maxX - w / 2, Math.max(minX + w / 2, p.label[0])), cy = p.label[1];
      const ex = Math.abs(cx - ax) < w / 2 ? cx : cx < ax ? cx + w / 2 : cx - w / 2, ey = Math.abs(cx - ax) < w / 2 ? (cy < ay ? cy + h / 2 : cy - h / 2) : cy;
      lab += `<g class="xlab" data-part="${p.id}" role="button" tabindex="0" aria-label="${esc(p.name.sv)}">
        <path d="M${ax} ${ay} L${ex} ${ey}" stroke="#13213f" stroke-width="2.2" stroke-linecap="round"/>
        <circle cx="${ax}" cy="${ay}" r="6" fill="#ffcf3a" stroke="#13213f" stroke-width="2.2"/>
        <rect x="${cx - w / 2}" y="${cy - h / 2}" width="${w}" height="${h}" rx="19" fill="#fff" stroke="#13213f" stroke-width="2.2"/>
        <text x="${cx}" y="${cy + 9}" font-size="27" ${MARKER} fill="#13213f" text-anchor="middle">${esc(p.name.sv)}</text></g>`;
    });
    det.innerHTML = DETAIL_DEFS + `<g class="xdart" data-detail="${cur}" data-tab="${tab}">${DETAIL_ART[cur](tab, still)}</g><g class="xlabs">${lab}</g>`;
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
  function markPart() {
    det.querySelectorAll<SVGElement>("[data-part]").forEach(e => e.classList.toggle("on", !!part && e.dataset.part === part));
  }
  function setFlowState() {
    if (!det) return;
    try { flowOn ? det.unpauseAnimations() : det.pauseAnimations(); } catch { /* old browsers */ }
    det.classList.toggle("paused", !flowOn);
  }

  const R: BodyRenderer = {
    mount(h) {
      host = h; h.innerHTML = "";
      body = el("svg", {class: "xsvg xbody", viewBox: HOME.join(" "), role: "group", "aria-label": "En kropp att utforska", preserveAspectRatio: "xMidYMid meet"}) as SVGSVGElement;
      body.appendChild(el("defs", {}, DEFS));
      body.appendChild(group("ghost", SHADOW + GLASS));
      body.appendChild(group("skeleton", SKEL_BACK, {"data-part": "back"}));
      const og = group("organs", `<g class="xure">${URETERS}</g>`);
      for (const id of ORGAN_ORDER) {
        const o = organById(id)!;
        og.appendChild(el("g", {class: "xorg", "data-id": id, role: "button", "aria-label": o.name.sv, tabindex: "-1"}, ORGAN_ART[id]));
      }
      body.appendChild(og);
      body.appendChild(group("skeleton", SKEL_FRONT, {"data-part": "front"}));
      body.appendChild(group("muscles", MUSCLES));
      body.appendChild(group("vessels", VESSELS));
      body.appendChild(group("nerves", NERVES));
      body.appendChild(group("skin", SHADOW + SKIN));
      labels = el("g", {class: "xlabel", "pointer-events": "none"}) as SVGGElement;
      body.appendChild(labels);
      det = el("svg", {class: "xsvg xdet", role: "group", preserveAspectRatio: "xMidYMid meet"}) as SVGSVGElement;
      h.appendChild(body); h.appendChild(det);
      /* switch between the wide and the compact detail when the stage changes shape */
      if (window.ResizeObserver) { ro = new ResizeObserver(() => { if (cur && isCompact() !== compact) drawDetail(); }); ro.observe(h); }
      const hit = (e: Event) => {
        const t = e.target as Element, o = t.closest<SVGGElement>(".xorg"), p = t.closest<SVGElement>("[data-part]");
        if (o && body.contains(o)) pick({kind: "organ", id: o.dataset.id as OrganId});
        else if (p && det.contains(p) && p.dataset.part && !p.closest(".xflow")) pick({kind: "part", id: p.dataset.part});
      };
      h.addEventListener("click", hit);
      h.addEventListener("keydown", e => { if ((e.key === "Enter" || e.key === " ") && (e.target as Element).closest("[role=button]")) { e.preventDefault(); hit(e); } });
      setVB(HOME); apply();
    },
    setLayers(on) { layers = new Set(on); apply(); },
    select(id) { sel = id; apply(); },
    hide(ids) { hidden = new Set(ids); apply(); },
    isolate(id) {
      iso = id; apply();
      if (!id) { animateVB(HOME); return; }
      const [x, y, w, h] = organById(id)!.box, pad = Math.max(w, h) * .75;
      animateVB([x - pad, y - pad, w + 2 * pad, h + 2 * pad]);
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
    destroy() { cancelAnimationFrame(raf); ro?.disconnect(); if (host) host.innerHTML = ""; host = null; },
  };
  return R;
}

/* every organ id, so a test or a 3D renderer can check it draws them all */
export const ORGAN_IDS = ORGANS.map(o => o.id);
