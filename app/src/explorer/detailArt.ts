/* 2.5D detail pictures of the body explorer: the heart opened up, the lungs with their airways
   and the brain from the side. Each is drawn in a 640 × 560 box; labels come from bodyData.ts.
   Parts carry data-part="<part id>" so the renderer can make them glow. Flow dots move along
   paths with SMIL <animateMotion>; with reduced motion they are drawn still (the renderer places them).
   Gradient ids start with "x-d". */
import type {DetailId} from "./bodyData";
import {LINE} from "./bodyArt";

type Flow = {id: string; d: string; color: "red" | "blue" | "air" | "spark"; n: number; dur: number; back?: boolean};
/* invisible paths plus the dots that run along them */
function flows(fs: Flow[], still: boolean): string {
  let o = "";
  for (const fl of fs) {
    o += `<path id="${fl.id}" d="${fl.d}" fill="none" stroke="none"/>`;
    for (let k = 0; k < fl.n; k++) {
      const t = k / fl.n, r = fl.color === "spark" ? 8 : fl.color === "air" ? 7 : 8;
      const fill = `url(#x-d${fl.color})`;
      o += still
        ? `<circle class="xdot" r="${r}" fill="${fill}" stroke="#fff" stroke-width="1.5" data-path="${fl.id}" data-t="${t.toFixed(3)}"/>`
        : `<circle class="xdot" r="${r}" fill="${fill}" stroke="#fff" stroke-width="1.5"><animateMotion dur="${fl.dur}s" begin="-${(t * fl.dur).toFixed(2)}s" repeatCount="indefinite"`
          + (fl.back ? ` keyPoints="0;1;0" keyTimes="0;.5;1" calcMode="linear"` : "") + `><mpath href="#${fl.id}"/></animateMotion></circle>`;
    }
  }
  return `<g class="xflow">${o}</g>`;
}

const DDEFS = `<defs>
 <radialGradient id="x-dred" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#ff9a9a"/><stop offset="1" stop-color="#d21f36"/></radialGradient>
 <radialGradient id="x-dblue" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#a9c2ff"/><stop offset="1" stop-color="#2a55c8"/></radialGradient>
 <radialGradient id="x-dair" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#5cc6e8"/></radialGradient>
 <radialGradient id="x-dspark" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fffbd1"/><stop offset="1" stop-color="#f2b705"/></radialGradient>
 <radialGradient id="x-dmus" cx=".38" cy=".28" r=".9"><stop offset="0" stop-color="#ff9a92"/><stop offset=".55" stop-color="#e5525b"/><stop offset="1" stop-color="#b52638"/></radialGradient>
 <radialGradient id="x-dcut" cx=".45" cy=".4" r=".8"><stop offset="0" stop-color="#ffb4b0"/><stop offset="1" stop-color="#ee7f84"/></radialGradient>
 <radialGradient id="x-dcavb" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#e3ebff"/><stop offset="1" stop-color="#9db5f2"/></radialGradient>
 <radialGradient id="x-dcavr" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#ffe6e6"/><stop offset="1" stop-color="#f4a2a8"/></radialGradient>
 <linearGradient id="x-dvalve" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fffbe8"/><stop offset="1" stop-color="#f3dc95"/></linearGradient>
 <radialGradient id="x-dlung" cx=".4" cy=".3" r=".9"><stop offset="0" stop-color="#ffe0e6"/><stop offset=".6" stop-color="#f7b2c1"/><stop offset="1" stop-color="#e48aa1"/></radialGradient>
 <radialGradient id="x-dalv" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fff0f3"/><stop offset="1" stop-color="#f0a0b4"/></radialGradient>
 <linearGradient id="x-dtrach" x1="0" x2="1"><stop offset="0" stop-color="#cfdcee"/><stop offset=".4" stop-color="#f6f9fd"/><stop offset="1" stop-color="#b6c6de"/></linearGradient>
 <radialGradient id="x-dbrain" cx=".38" cy=".3" r=".9"><stop offset="0" stop-color="#ffe7f2"/><stop offset=".6" stop-color="#f4bdd7"/><stop offset="1" stop-color="#dc90b9"/></radialGradient>
 <radialGradient id="x-dcereb" cx=".4" cy=".3" r=".9"><stop offset="0" stop-color="#ffe0d0"/><stop offset="1" stop-color="#e79a86"/></radialGradient>
 <linearGradient id="x-dstem" x1="0" x2="1"><stop offset="0" stop-color="#e9a48f"/><stop offset=".4" stop-color="#ffd6c4"/><stop offset="1" stop-color="#d98c78"/></linearGradient>
 <radialGradient id="x-dfront" cx=".4" cy=".3" r=".9"><stop offset="0" stop-color="#e3f0ff"/><stop offset="1" stop-color="#9cc1f0"/></radialGradient>
 <radialGradient id="x-dback" cx=".4" cy=".3" r=".9"><stop offset="0" stop-color="#efe6ff"/><stop offset="1" stop-color="#b9a0ec"/></radialGradient>
 <filter id="x-dglow" x="-50%" y="-50%" width="200%" height="200%"><feMorphology in="SourceAlpha" operator="dilate" radius="4" result="d"/>
  <feGaussianBlur in="d" stdDeviation="6" result="b"/><feFlood flood-color="#ffcf3a"/><feComposite in2="b" operator="in" result="g"/>
  <feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
 <filter id="x-dshadow" x="-10%" y="-10%" width="120%" height="130%"><feDropShadow dx="0" dy="6" stdDeviation="7" flood-color="${LINE}" flood-opacity=".2"/></filter>
 <marker id="x-darr" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10Z" fill="context-stroke"/></marker>
</defs>`;

/* a tube with an edge and a highlight */
const tube = (d: string, w: number, fill: string, edge: string, hi: string, part = "") =>
  `<g${part ? ` data-part="${part}"` : ""}><path d="${d}" stroke="${edge}" stroke-width="${w + 4}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`
  + `<path d="${d}" stroke="${fill}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`
  + `<path d="${d}" stroke="${hi}" stroke-width="${Math.max(2, w / 4)}" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity=".7" transform="translate(-${(w / 6).toFixed(1)} 0)"/></g>`;

/* ======================= the heart, opened up (front view: its left side is on the viewer's right) ======================= */
const RED = "#d93a48", REDE = "#9c1f30", REDH = "#ff9aa0", BLU = "#4a73dc", BLUE = "#2a4aa6", BLUH = "#b4c8ff";
function heart(tab: string, still: boolean): string {
  const dim = (on: boolean) => on ? "" : ` opacity=".35"`;
  const chambers = tab === "kammare", valves = tab === "klaffar", flow = tab === "flode";
  const valve = (id: string, d: string) => `<g data-part="${id}" class="xvalve${valves ? " big" : ""}"${dim(chambers)}><path d="${d}" fill="url(#x-dvalve)" stroke="#c9a54a" stroke-width="2" stroke-linejoin="round"/></g>`;
  const cav = (id: string, d: string, fill: string) => `<path data-part="${id}" d="${d}" fill="${fill}" stroke="${fill.includes("cavb") ? "#6f8fe0" : "#e0737c"}" stroke-width="2"${valves ? ` opacity=".75"` : ""}/>`;
  return `<ellipse cx="330" cy="528" rx="170" ry="16" fill="${LINE}" opacity=".1"/>
   ${tube("M310 172 C290 160 220 160 150 168", 30, BLU, BLUE, BLUH)}
   ${tube("M540 222 C500 224 470 232 444 242 M540 272 C504 270 474 264 446 258", 18, RED, REDE, REDH)}
   ${tube("M232 30 L232 220", 40, BLU, BLUE, BLUH, "halvener")}
   ${tube("M228 330 L228 540", 40, BLU, BLUE, BLUH, "halvener")}
   ${tube("M346 230 L346 130 C346 66 436 54 446 112 L450 220", 44, RED, REDE, REDH, "aorta")}
   ${tube("M362 86 L354 24 M392 72 L394 14 M420 78 L436 22", 13, RED, REDE, REDH, "aorta")}
   <g class="xbeat"><g filter="url(#x-dshadow)">
   <path d="M214 196 C176 214 168 268 186 318 C200 372 240 428 300 470 C330 492 372 506 398 496 C440 480 462 420 466 360 C470 310 462 262 446 232 C432 206 404 196 380 202 C340 190 260 186 214 196Z" fill="url(#x-dmus)" stroke="#8f1a2c" stroke-width="2.5"/></g>
   <path d="M222 206 C196 228 190 290 206 330 C224 382 262 428 312 458 C338 474 370 484 392 478 C428 466 446 420 450 362 C454 316 448 270 434 244 C420 222 400 212 380 214 C344 204 268 198 222 206Z" fill="url(#x-dcut)" opacity=".95"/>
   <path d="M196 236 C184 270 188 310 204 344" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round" opacity=".45"/>
   ${cav("hf", "M216 212 C198 236 198 288 216 312 C232 326 262 320 272 300 C282 276 278 232 258 214 C246 206 228 204 216 212Z", "url(#x-dcavb)")}
   ${cav("hk", "M240 338 C256 384 290 426 330 452 C342 444 344 418 340 388 C336 358 324 330 300 320 C276 314 250 320 240 338Z", "url(#x-dcavb)")}
   <path data-part="hk" d="M290 322 C296 290 298 260 300 228 L314 228 C316 260 318 296 322 330Z" fill="url(#x-dcavb)" stroke="#6f8fe0" stroke-width="2"${valves ? ` opacity=".75"` : ""}/>
   ${cav("vf", "M352 222 C340 236 344 270 366 282 C392 292 428 288 440 268 C448 250 440 226 420 218 C400 212 368 212 352 222Z", "url(#x-dcavr)")}
   ${cav("vk", "M364 308 C352 342 354 398 372 444 C380 462 394 468 402 460 C422 438 430 390 428 346 C426 318 414 302 394 300 C380 300 370 302 364 308Z", "url(#x-dcavr)")}
   <path data-part="vk" d="M364 318 C356 290 350 262 340 240 L356 236 C364 260 372 284 380 304Z" fill="url(#x-dcavr)" stroke="#e0737c" stroke-width="2"${valves ? ` opacity=".75"` : ""}/>
   ${valve("k-tri", "M244 316 L256 342 L264 318Z M266 318 L276 340 L286 314Z")}
   ${valve("k-mitral", "M376 290 L386 314 L394 292Z M398 292 L406 312 L416 288Z")}
   ${valve("k-pulm", "M290 232 Q298 244 306 232 Q314 244 322 232 L322 226 L290 226Z")}
   ${valve("k-aorta", "M334 240 Q342 252 350 240 Q356 252 362 238 L360 232 L334 236Z")}
   <path d="M330 330 C340 380 352 430 374 470" stroke="#c94c58" stroke-width="2" fill="none" opacity=".5"/>
   </g>
   ${tube("M303 204 L304 176 C306 152 332 146 362 148 L486 156", 32, BLU, BLUE, BLUH, "lungartar")}
   ${flow ? `<g class="xarrows" stroke-width="3" fill="none">
      <path d="M232 60 L232 96" stroke="#fff" marker-end="url(#x-darr)"/><path d="M228 520 L228 486" stroke="#fff" marker-end="url(#x-darr)"/>
      <path d="M430 156 L470 157" stroke="#fff" marker-end="url(#x-darr)"/><path d="M200 165 L164 167" stroke="#fff" marker-end="url(#x-darr)"/>
      <path d="M530 223 L500 226" stroke="#fff" marker-end="url(#x-darr)"/><path d="M446 150 L449 190" stroke="#fff" marker-end="url(#x-darr)"/></g>` : ""}
   ${flow ? flows([
    {id: "x-fb1", d: "M232 30 L232 200 C232 240 238 276 252 304 C262 336 280 384 312 424 C334 410 324 350 312 300 L304 230 L304 176 C306 152 332 146 362 148 L486 156", color: "blue", n: 9, dur: 6},
    {id: "x-fb2", d: "M228 540 L228 320 C234 296 244 296 252 306 C266 340 282 386 304 414 C326 400 318 340 308 290 L304 230 L304 176 C290 160 220 160 150 168", color: "blue", n: 9, dur: 6},
    {id: "x-fr1", d: "M540 222 C500 224 470 232 440 246 C410 256 396 272 394 300 C390 340 386 400 396 444 C384 420 370 360 360 300 C352 272 348 250 346 230 L346 130 C346 66 436 54 446 112 L450 220", color: "red", n: 9, dur: 6},
    {id: "x-fr2", d: "M540 272 C504 270 474 264 440 260 C414 262 400 276 396 300 C392 344 390 396 402 440 C388 414 374 356 362 300 C354 272 348 250 346 230 L346 130 C346 100 354 60 356 24", color: "red", n: 8, dur: 6},
   ], still) : ""}`;
}

/* ======================= the lungs and their airways ======================= */
type Br = [number, number, number, number, number];
/* the main branches: x1 y1 x2 y2 width */
const MAIN: Br[] = [
  [320, 200, 262, 248, 22], [262, 248, 222, 200, 13], [222, 200, 224, 180, 9], [262, 248, 214, 300, 13], [214, 300, 190, 330, 9],
  [262, 248, 252, 332, 15], [252, 332, 242, 400, 11], [242, 400, 236, 430, 8],
  [320, 200, 388, 254, 20], [388, 254, 418, 202, 12], [418, 202, 418, 182, 9], [388, 254, 436, 300, 12], [436, 300, 454, 330, 8],
  [388, 254, 402, 334, 14], [402, 334, 410, 400, 10], [410, 400, 414, 430, 8],
];
const TIPS = MAIN.filter(([, , x2, y2]) => !MAIN.some(([a, b]) => a === x2 && b === y2));
function twigs(): string {
  let o = "", al = "";
  const grow = (x: number, y: number, a: number, len: number, w: number, d: number) => {
    const x2 = x + Math.cos(a) * len, y2 = y + Math.sin(a) * len;
    o += `<path d="M${x.toFixed(1)} ${y.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)}" stroke-width="${w.toFixed(1)}"/>`;
    if (d > 0) { grow(x2, y2, a - .5, len * .72, w * .7, d - 1); grow(x2, y2, a + .5, len * .72, w * .7, d - 1); }
    else al += `<circle cx="${x2.toFixed(1)}" cy="${y2.toFixed(1)}" r="3.2"/>`;
  };
  for (const [x1, y1, x2, y2, w] of TIPS) { const a = Math.atan2(y2 - y1, x2 - x1); grow(x2, y2, a - .45, 19, w * .7, 2); grow(x2, y2, a + .45, 19, w * .7, 2); }
  return `<g stroke="#a9bad3" fill="none" stroke-linecap="round" transform="translate(1.2 1.2)" opacity=".7">${o}</g><g stroke="#f7faff" fill="none" stroke-linecap="round">${o}</g>`
    + `<g fill="url(#x-dalv)" stroke="#d27d95" stroke-width="1">${al}</g>`;
}
const TWIGS = twigs();
function lungs(tab: string, still: boolean): string {
  const airways = tab === "vagar", sacs = tab === "blasor", air = tab === "luft";
  const main = MAIN.map(([a, b, c, d, w]) => `<path d="M${a} ${b} L${c} ${d}" stroke-width="${w}"/>`).join("");
  const route = (tip: Br) => { const path: Br[] = [tip]; let cur = tip;
    for (;;) { const p = MAIN.find(m => m[2] === cur[0] && m[3] === cur[1]); if (!p) break; path.unshift(p); cur = p; }
    return "M320 6 L320 200 " + path.map(m => `L${m[2]} ${m[3]}`).join(" "); };
  const X = 556, Y = 432;
  const alv = [[0, 0], [-22, -10], [20, -12], [-30, 14], [0, 22], [28, 14], [-12, -30], [14, -32], [-38, -12], [38, -10]]
    .map(([x, y]) => `<circle cx="${X + x}" cy="${Y + y}" r="17" fill="url(#x-dalv)" stroke="#c96d87" stroke-width="2"/><circle cx="${X - 5 + x}" cy="${Y - 6 + y}" r="5" fill="#fff" opacity=".7"/>`).join("");
  return `<ellipse cx="320" cy="528" rx="200" ry="14" fill="${LINE}" opacity=".1"/>
   <g filter="url(#x-dshadow)"${airways ? ` opacity=".45"` : ""}>
    <path data-part="hlunga" d="M292 128 C250 112 196 150 172 220 C150 290 138 380 144 440 C150 482 192 492 240 480 C272 472 292 462 298 440 C302 380 300 300 298 220Z" fill="url(#x-dlung)" stroke="#c25f79" stroke-width="2.5"/>
    <path data-part="vlunga" d="M348 128 C390 112 446 150 468 220 C490 290 500 380 494 440 C488 482 446 494 404 482 C384 476 372 466 370 448 C390 430 396 400 384 380 C366 360 352 330 350 300 L346 220Z" fill="url(#x-dlung)" stroke="#c25f79" stroke-width="2.5"/>
    <path d="M150 330 C200 316 250 296 296 268 M160 420 C210 380 260 340 296 318 M490 330 C450 316 410 290 352 250" stroke="#cf7590" stroke-width="2" fill="none" opacity=".7"/>
    <path d="M196 170 C176 210 162 270 160 330 M444 170 C464 210 476 270 478 330" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" opacity=".5"/>
   </g>
   <g data-part="smaror">${TWIGS}</g>
   <g data-part="luftror"><g stroke="#93a8c6" fill="none" stroke-linecap="round" transform="translate(0 0)">${MAIN.map(([a, b, c, d, w]) => `<path d="M${a} ${b} L${c} ${d}" stroke-width="${w + 4}"/>`).join("")}</g>
    <g stroke="url(#x-dtrach)" fill="none" stroke-linecap="round">${main.replace(/stroke-width/g, "stroke=\"#eef3fa\" stroke-width")}</g></g>
   <g data-part="luftstrupe">
    <path d="M300 20 L300 196 Q320 212 340 196 L340 20Z" fill="url(#x-dtrach)" stroke="#93a8c6" stroke-width="2.5"/>
    ${Array.from({length: 15}, (_, i) => `<path d="M301 ${30 + i * 11.5} Q320 ${37 + i * 11.5} 339 ${30 + i * 11.5}" stroke="#a9bcd6" stroke-width="4" fill="none" stroke-linecap="round"/>`).join("")}
    <path d="M292 8 Q320 0 348 8 L344 26 Q320 20 296 26Z" fill="#dfe8f4" stroke="#93a8c6" stroke-width="2"/>
   </g>
   <g data-part="lungblasor">
    <path d="M414 430 L${X - 74} ${Y - 26} M414 430 L${X - 70} ${Y + 34}" stroke="#93a8c6" stroke-width="2" stroke-dasharray="5 5"/>
    <circle cx="414" cy="430" r="10" fill="none" stroke="#2a4aa6" stroke-width="2.5"/>
    <circle cx="${X}" cy="${Y}" r="78" fill="#fff" stroke="#93a8c6" stroke-width="3" filter="url(#x-dshadow)"/>
    <clipPath id="x-dzoom"><circle cx="${X}" cy="${Y}" r="75"/></clipPath>
    <g clip-path="url(#x-dzoom)">
     <rect x="${X - 80}" y="${Y - 80}" width="160" height="160" fill="#fff7f9"/>
     <path d="M${X} ${Y - 80} L${X} ${Y - 22}" stroke="#93a8c6" stroke-width="20" stroke-linecap="round"/><path d="M${X} ${Y - 80} L${X} ${Y - 22}" stroke="#eef3fa" stroke-width="15" stroke-linecap="round"/>
     <path d="M${X - 80} ${Y + 36} C${X - 50} ${Y + 18} ${X - 30} ${Y + 52} ${X} ${Y + 36} C${X + 30} ${Y + 20} ${X + 50} ${Y + 52} ${X + 80} ${Y + 36}" stroke="#d93a48" stroke-width="6" fill="none"/>
     <path d="M${X - 80} ${Y - 30} C${X - 56} ${Y - 14} ${X - 44} ${Y - 46} ${X - 22} ${Y - 30}" stroke="#4a73dc" stroke-width="6" fill="none"/>
     <path d="M${X + 22} ${Y - 30} C${X + 44} ${Y - 46} ${X + 56} ${Y - 14} ${X + 80} ${Y - 30}" stroke="#d93a48" stroke-width="6" fill="none"/>
     ${alv}
    </g>
    <circle cx="${X}" cy="${Y}" r="76.5" fill="none" stroke="#93a8c6" stroke-width="3"/>
   </g>
   ${sacs || air ? `<g class="xgas">
     <path data-part="syre" d="M${X - 52} ${Y - 40} C${X - 66} ${Y - 20} ${X - 66} ${Y} ${X - 54} ${Y + 18}" stroke="#1f86c9" stroke-width="4" fill="none" marker-end="url(#x-darr)"/>
     <path data-part="koldioxid" d="M${X + 54} ${Y + 22} C${X + 66} ${Y + 4} ${X + 66} ${Y - 16} ${X + 52} ${Y - 36}" stroke="#6b7689" stroke-width="4" fill="none" marker-end="url(#x-darr)"/></g>` : ""}
   ${air ? flows(TIPS.map((t, i) => ({id: "x-fa" + i, d: route(t), color: "air" as const, n: 4, dur: 5, back: true})), still) : ""}`;
}

/* ======================= the brain from the side (the face to the viewer's left) ======================= */
const SULCI = ["M190 150 C210 170 206 196 226 214", "M240 110 C246 140 262 152 258 182", "M300 92 C292 120 306 140 300 170 C296 196 312 214 306 236",
  "M352 92 C346 120 360 146 354 176", "M410 110 C400 136 414 156 404 186", "M462 152 C448 168 460 190 448 210", "M180 236 C206 240 222 256 244 252",
  "M408 236 C426 250 446 246 470 262", "M330 200 C352 214 372 206 392 222", "M250 300 C276 296 300 310 324 300", "M220 196 C238 206 256 198 272 214"];
function brain(tab: string, still: boolean): string {
  const parts = tab === "delar", sig = tab === "signal";
  return `<ellipse cx="330" cy="534" rx="190" ry="14" fill="${LINE}" opacity=".1"/>
   <g data-part="ryggmarg">${tube("M366 470 L370 556", 22, "#ffd6c4", "#c9806d", "#fff")}</g>
   <g data-part="hjarnstam"><path d="M334 320 C330 360 340 410 352 450 C356 474 382 476 384 452 C388 410 390 360 384 316Z" fill="url(#x-dstem)" stroke="#b56e5c" stroke-width="2.2"/>
    <path d="M340 372 C352 386 374 386 386 370" stroke="#c9806d" stroke-width="2" fill="none"/><path d="M346 336 C346 372 352 410 360 444" stroke="#fff" stroke-width="4" fill="none" opacity=".5" stroke-linecap="round"/></g>
   <g data-part="lillhjarna"${parts ? "" : ""}><path d="M388 332 C394 302 440 290 478 300 C512 310 526 342 512 370 C498 396 452 404 418 394 C394 386 384 360 388 332Z" fill="url(#x-dcereb)" stroke="#b56e5c" stroke-width="2.2"/>
    ${[0, 1, 2, 3, 4, 5].map(i => `<path d="M${396 + i * 2} ${316 + i * 13} C${430} ${308 + i * 13} ${470} ${312 + i * 13} ${512 - Math.abs(i - 2.5) * 4} ${326 + i * 12}" stroke="#c97b68" stroke-width="1.8" fill="none"/>`).join("")}
    <path d="M410 312 C440 300 476 302 498 314" stroke="#fff" stroke-width="4" fill="none" opacity=".55" stroke-linecap="round"/></g>
   <g data-part="storhjarna" filter="url(#x-dshadow)">
    <path d="M150 262 C126 180 190 92 296 84 C404 76 504 122 522 222 C532 284 504 330 452 334 C428 336 404 324 384 326 C350 330 330 350 290 352 C246 354 212 340 196 318 C176 300 158 290 150 262Z" fill="url(#x-dbrain)" stroke="#a75a85" stroke-width="2.5"/>
    ${parts ? `<path data-part="pannlob" d="M150 262 C126 180 190 92 296 84 C286 130 300 190 276 236 C250 270 210 300 196 318 C176 300 158 290 150 262Z" fill="url(#x-dfront)" opacity=".85"/>
      <path data-part="syncentrum" d="M522 222 C532 284 504 330 452 334 C440 300 440 250 470 196 C490 190 510 196 522 222Z" fill="url(#x-dback)" opacity=".9"/>` : ""}
    <path d="M200 312 C240 300 290 300 330 280 C360 266 380 250 400 254" stroke="#a75a85" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <path d="M330 86 C324 130 338 170 330 214 C326 240 334 262 330 284" stroke="#a75a85" stroke-width="3" fill="none" stroke-linecap="round"/>
    <g stroke="#c77fa8" stroke-width="2.4" fill="none" stroke-linecap="round">${SULCI.map(d => `<path d="${d}"/>`).join("")}</g>
    <path d="M176 200 C190 140 236 106 290 98" stroke="#fff" stroke-width="8" fill="none" stroke-linecap="round" opacity=".5"/>
   </g>
   ${sig ? flows([
    {id: "x-fs1", d: "M210 170 C260 220 320 280 352 330 C362 380 366 440 368 556", color: "spark", n: 4, dur: 3},
    {id: "x-fs2", d: "M330 110 C340 180 350 260 358 330 C364 390 366 440 368 556", color: "spark", n: 4, dur: 3},
    {id: "x-fs3", d: "M480 200 C430 240 390 290 364 330 C366 390 368 450 370 556", color: "spark", n: 4, dur: 3},
   ], still) : ""}`;
}

export const DETAIL_ART: Record<DetailId, (tab: string, still: boolean) => string> = {heart, lungs, brain};
export const DETAIL_DEFS = DDEFS;
