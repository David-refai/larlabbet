/* 2.5D cartoon art of the body explorer (the SVG renderer's pictures), in the style of
   content/no/no-0art.js: soft radial and linear gradients, a light from the upper left, soft shadows.
   The body stands in a 400 × 800 box, centred on x = 200; mirrored halves use MIR.
   Every gradient id starts with "x-". */
import type {OrganId} from "./bodyData";

export const LINE = "#2a3550";
type P3 = [number, number, number];
const f = (n: number) => Math.round(n * 10) / 10;
/* mirror a group to the other half of the body */
export const MIR = `transform="matrix(-1 0 0 1 400 0)"`;

/* a smooth tapered limb around a centre line of [x, y, width] points, with round ends */
export function limb(pts: P3[]): string {
  const n = pts.length, L: number[][] = [], R: number[][] = [], dir: number[][] = [];
  for (let i = 0; i < n; i++) {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)];
    let dx = b[0] - a[0], dy = b[1] - a[1]; const d = Math.hypot(dx, dy) || 1; dx /= d; dy /= d; dir.push([dx, dy]);
    const w = pts[i][2] / 2;
    L.push([pts[i][0] - dy * w, pts[i][1] + dx * w]); R.push([pts[i][0] + dy * w, pts[i][1] - dx * w]);
  }
  const curve = (q: number[][]) => {
    let s = "";
    for (let i = 0; i < q.length - 1; i++) {
      const p0 = q[Math.max(0, i - 1)], p1 = q[i], p2 = q[i + 1], p3 = q[Math.min(q.length - 1, i + 2)];
      s += `C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`;
    }
    return s;
  };
  const cap = (a: number[], b: number[], d: number[], w: number) =>
    `C${f(a[0] + d[0] * w * .55)} ${f(a[1] + d[1] * w * .55)} ${f(b[0] + d[0] * w * .55)} ${f(b[1] + d[1] * w * .55)} ${f(b[0])} ${f(b[1])}`;
  const Rr = [...R].reverse(), e = dir[n - 1], s0 = dir[0];
  return `M${f(L[0][0])} ${f(L[0][1])}` + curve(L) + cap(L[n - 1], R[n - 1], e, pts[n - 1][2]) + curve(Rr) + cap(R[0], L[0], [-s0[0], -s0[1]], pts[0][2]) + "Z";
}

/* ---- the outline of the body: shared by the skin and the see-through "glass" body ---- */
const LEG: P3[] = [[170, 446, 68], [168, 530, 60], [166, 612, 44], [165, 676, 42], [164, 744, 31]];
const ARM: P3[] = [[134, 208, 46], [119, 268, 39], [107, 332, 33], [100, 390, 30], [96, 440, 24]];
const TORSO = "M200 176 C176 176 150 182 136 192 C121 202 117 222 123 242 C133 264 142 282 144 310 C146 340 148 362 146 384 C144 410 136 430 138 452 C140 478 170 494 200 495"
  + " C230 494 260 478 262 452 C264 430 256 410 254 384 C252 362 254 340 256 310 C258 282 267 264 277 242 C283 222 279 202 264 192 C250 182 224 176 200 176Z";
const HAND = `<ellipse cx="94" cy="464" rx="17" ry="21"/><ellipse cx="109" cy="455" rx="7" ry="11" transform="rotate(-25 109 455)"/>`;
const FOOT = `<path d="M132 762 C132 748 148 740 164 742 C180 744 190 754 188 768 C186 780 170 784 152 783 C138 782 132 774 132 762Z"/>`;
/* the outline shapes, filled by the caller */
const SIL = (attr: string) => `<g ${attr}><path d="${limb(LEG)}"/><path d="${limb(ARM)}"/>${HAND}${FOOT}</g>`
  + `<g ${attr} ${MIR}><path d="${limb(LEG)}"/><path d="${limb(ARM)}"/>${HAND}${FOOT}</g>`
  + `<path ${attr} d="${TORSO}"/><rect ${attr} x="181" y="140" width="38" height="50" rx="12"/>`
  + `<ellipse ${attr} cx="200" cy="96" rx="58" ry="62"/><circle ${attr} cx="144" cy="104" r="13"/><circle ${attr} cx="256" cy="104" r="13"/>`;

export const DEFS = `
 <radialGradient id="x-skin" cx=".38" cy=".3" r=".9"><stop offset="0" stop-color="#ffe3cf"/><stop offset="1" stop-color="#eaa982"/></radialGradient>
 <linearGradient id="x-skinL" x1="0" x2="1"><stop offset="0" stop-color="#f3bf9c"/><stop offset=".35" stop-color="#ffe2cc"/><stop offset="1" stop-color="#df9c76"/></linearGradient>
 <radialGradient id="x-torso" cx=".4" cy=".28" r=".85"><stop offset="0" stop-color="#ffe6d4"/><stop offset=".7" stop-color="#f6c4a2"/><stop offset="1" stop-color="#e3a07b"/></radialGradient>
 <linearGradient id="x-hair" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5a3b28"/><stop offset="1" stop-color="#2e1c12"/></linearGradient>
 <linearGradient id="x-shorts" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4f73c4"/><stop offset="1" stop-color="#24386a"/></linearGradient>
 <radialGradient id="x-shoe" cx=".35" cy=".3" r=".9"><stop offset="0" stop-color="#ff8a6e"/><stop offset="1" stop-color="#c63b26"/></radialGradient>
 <linearGradient id="x-glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f4f9ff"/><stop offset="1" stop-color="#d9e8f8"/></linearGradient>
 <radialGradient id="x-mus" cx=".35" cy=".3" r=".9"><stop offset="0" stop-color="#ffb3a6"/><stop offset=".6" stop-color="#f2867a"/><stop offset="1" stop-color="#d4605a"/></radialGradient>
 <linearGradient id="x-musL" x1="0" x2="1"><stop offset="0" stop-color="#e57a70"/><stop offset=".35" stop-color="#ffb0a3"/><stop offset="1" stop-color="#cf5b55"/></linearGradient>
 <radialGradient id="x-lung" cx=".4" cy=".3" r=".9"><stop offset="0" stop-color="#ffd0d8"/><stop offset=".6" stop-color="#f6a3b4"/><stop offset="1" stop-color="#df7d95"/></radialGradient>
 <radialGradient id="x-heart" cx=".38" cy=".3" r=".85"><stop offset="0" stop-color="#ff8a86"/><stop offset=".6" stop-color="#e8414f"/><stop offset="1" stop-color="#b9233a"/></radialGradient>
 <radialGradient id="x-brain" cx=".4" cy=".3" r=".9"><stop offset="0" stop-color="#fde0ee"/><stop offset=".6" stop-color="#f2b3d0"/><stop offset="1" stop-color="#d887b2"/></radialGradient>
 <radialGradient id="x-liver" cx=".35" cy=".3" r=".9"><stop offset="0" stop-color="#ec9a7f"/><stop offset=".6" stop-color="#c9604c"/><stop offset="1" stop-color="#9e3f35"/></radialGradient>
 <radialGradient id="x-stom" cx=".4" cy=".3" r=".9"><stop offset="0" stop-color="#ffd6b8"/><stop offset=".6" stop-color="#f6a77d"/><stop offset="1" stop-color="#df845b"/></radialGradient>
 <radialGradient id="x-kid" cx=".35" cy=".3" r=".9"><stop offset="0" stop-color="#e88a9a"/><stop offset="1" stop-color="#9c3552"/></radialGradient>
 <radialGradient id="x-blad" cx=".38" cy=".3" r=".9"><stop offset="0" stop-color="#f7dcf0"/><stop offset="1" stop-color="#c98bb5"/></radialGradient>
 <radialGradient id="x-small" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#ffe1d3"/><stop offset="1" stop-color="#f3a98f"/></radialGradient>
 <linearGradient id="x-bone" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fffaf0"/><stop offset=".6" stop-color="#f1e3c4"/><stop offset="1" stop-color="#d9c398"/></linearGradient>
 <filter id="x-glow" x="-50%" y="-50%" width="200%" height="200%"><feMorphology in="SourceAlpha" operator="dilate" radius="3" result="d"/>
  <feGaussianBlur in="d" stdDeviation="5" result="b"/><feFlood flood-color="#ffcf3a"/><feComposite in2="b" operator="in" result="g"/>
  <feMerge><feMergeNode in="g"/><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
 <filter id="x-soft" x="-10%" y="-10%" width="120%" height="120%"><feDropShadow dx="0" dy="2" stdDeviation="2.5" flood-color="${LINE}" flood-opacity=".22"/></filter>`;

const ED = `stroke="${LINE}" stroke-opacity=".3" stroke-width="2"`;

/* the floor shadow */
export const SHADOW = `<ellipse cx="200" cy="784" rx="118" ry="12" fill="${LINE}" opacity=".12"/>`;

/* the see-through body under the inner layers: outline strokes first, then fills, so only the outer edge shows */
export const GLASS = SIL(`fill="none" stroke="#8fb3dc" stroke-width="5"`) + SIL(`fill="url(#x-glass)"`)
  + `<path d="M200 300 C200 340 200 380 200 420" stroke="#c9dcf2" stroke-width="2" fill="none"/>`;

/* ---------------- skin: the child as we see them ---------------- */
const limbSkin = `<path d="${limb(LEG)}" fill="url(#x-skinL)" ${ED}/><path d="${limb(ARM)}" fill="url(#x-skinL)" ${ED}/>
  <g fill="url(#x-skin)" ${ED}>${HAND}</g><g fill="url(#x-shoe)" ${ED}>${FOOT}</g>
  <path d="M142 778 C150 784 172 784 182 774" stroke="#fff" stroke-opacity=".7" stroke-width="3" fill="none"/>
  <path d="M110 300 C106 330 102 370 100 410" stroke="#fff" stroke-opacity=".35" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M156 560 C154 600 154 650 156 700" stroke="#fff" stroke-opacity=".35" stroke-width="6" fill="none" stroke-linecap="round"/>
  <path d="M152 610 Q166 618 180 610" stroke="#c98563" stroke-width="2" fill="none" opacity=".6"/>`;
const FACE = `<g transform="translate(200 14.4) scale(1.2)">
  <path d="M-50 66 C-56 14 -22 2 2 2 C32 2 58 20 50 68 C44 44 22 32 -2 36 C-22 38 -40 48 -50 66Z" fill="url(#x-hair)"/>
  <path d="M-24 14 Q-6 6 14 10" stroke="#8a6248" stroke-width="4" fill="none" stroke-linecap="round" opacity=".7"/>
  <ellipse cx="-17" cy="74" rx="5.5" ry="7.5" fill="${LINE}"/><ellipse cx="17" cy="74" rx="5.5" ry="7.5" fill="${LINE}"/>
  <circle cx="-15" cy="71" r="2" fill="#fff"/><circle cx="19" cy="71" r="2" fill="#fff"/>
  <circle cx="-30" cy="90" r="8" fill="#ff8f8f" opacity=".35"/><circle cx="30" cy="90" r="8" fill="#ff8f8f" opacity=".35"/>
  <path d="M-14 96 Q0 108 14 96" stroke="#9c4a3a" stroke-width="3.5" fill="none" stroke-linecap="round"/></g>`;
export const SKIN = `<g>${limbSkin}</g><g ${MIR}>${limbSkin}</g>
 <path d="${TORSO}" fill="url(#x-torso)" ${ED}/>
 <path d="M150 230 C146 270 150 330 150 380" stroke="#fff" stroke-opacity=".35" stroke-width="8" fill="none" stroke-linecap="round"/>
 <path d="M166 205 Q182 214 196 208 M234 205 Q218 214 204 208" stroke="#d99a77" stroke-width="2" fill="none" opacity=".7"/>
 <path d="M196 380 Q200 386 204 380" stroke="#c98563" stroke-width="2.5" fill="none" stroke-linecap="round"/>
 <path d="M144 404 C170 414 230 414 256 404 L266 470 C268 488 268 504 268 514 C246 522 220 522 204 512 L200 494 L196 512 C180 522 154 522 132 514 C132 504 132 488 134 470Z" fill="url(#x-shorts)" ${ED}/>
 <path d="M146 412 C170 422 230 422 254 412" stroke="#7a98dd" stroke-width="4" fill="none"/>
 <path d="M160 430 C156 460 152 486 150 506" stroke="#fff" stroke-opacity=".22" stroke-width="7" fill="none" stroke-linecap="round"/>
 <rect x="181" y="140" width="38" height="50" rx="12" fill="url(#x-skinL)"/>
 <path d="M184 160 Q200 172 216 160" stroke="#d08f6b" stroke-width="5" fill="none" opacity=".5"/>
 <circle cx="144" cy="104" r="13" fill="#eaa982"/><circle cx="256" cy="104" r="13" fill="#eaa982"/>
 <ellipse cx="200" cy="96" rx="58" ry="62" fill="url(#x-skin)" ${ED}/>${FACE}`;

/* ---------------- muscles ---------------- */
const MS = `fill="url(#x-mus)" stroke="#b9453f" stroke-opacity=".45" stroke-width="1.6"`;
const ML = `fill="url(#x-musL)" stroke="#b9453f" stroke-opacity=".45" stroke-width="1.6"`;
const ST = `stroke="#ffe0d9" stroke-opacity=".55" stroke-width="1.4" fill="none"`;
const musHalf = `
 <path d="M186 150 C186 170 178 184 152 192 C170 196 186 198 197 200 C196 182 194 164 192 148Z" ${MS}/>
 <path d="M152 191 C128 190 113 206 112 232 C113 250 118 262 124 270 C131 250 140 234 154 222 C160 212 160 200 152 191Z" ${MS}/>
 <path d="M126 210 Q120 236 122 258 M136 204 Q128 230 130 248" ${ST}/>
 <path d="M198 202 C178 198 156 200 147 214 C138 232 142 254 157 263 C175 270 190 264 198 255Z" ${MS}/>
 <path d="M190 212 Q166 214 152 230 M194 230 Q170 232 154 248 M194 246 Q176 250 162 258" ${ST}/>
 <path d="M146 268 C143 300 147 342 149 376 C158 384 168 384 172 376 C168 340 166 300 160 270Z" ${MS}/>
 <path d="M150 290 L164 284 M150 312 L166 306 M151 334 L167 328 M152 356 L168 350" ${ST}/>
 ${[[272, 30], [306, 30], [340, 28]].map(([y, h]) => `<rect x="175" y="${y}" width="22" height="${h}" rx="9" ${MS}/>`).join("")}
 <path d="M175 372 L197 372 L197 408 C190 410 182 404 176 396Z" ${MS}/>
 <path d="${limb([[128, 236, 34], [118, 284, 32], [110, 326, 23]])}" ${ML}/>
 <path d="M120 250 Q114 284 112 316" ${ST}/>
 <path d="${limb([[106, 342, 29], [101, 390, 25], [97, 434, 15]])}" ${ML}/>
 <path d="M104 356 Q100 390 99 424" ${ST}/>
 <path d="${limb([[172, 448, 62], [169, 520, 55], [166, 592, 36]])}" ${ML}/>
 <path d="M168 462 L170 586 M156 470 Q152 520 158 580 M184 470 Q188 520 178 584" ${ST}/>
 <path d="M146 444 C160 470 176 520 186 590" stroke="#c75a52" stroke-opacity=".55" stroke-width="5" fill="none"/>
 <path d="${limb([[165, 626, 35], [164, 680, 32], [163, 738, 17]])}" ${ML}/>
 <path d="M160 640 Q158 680 162 726" ${ST}/>
 <ellipse cx="166" cy="608" rx="11" ry="12" fill="#f3d9c0" stroke="#c9a47e" stroke-width="1.5"/>`;
export const MUSCLES = `<g>${musHalf}</g><g ${MIR}>${musHalf}</g><path d="M198 272 L198 410 M202 272 L202 410" stroke="#e9b8a8" stroke-width="2"/>`;

/* ---------------- skeleton: the back part (under the organs) and the front part (ribs, over them) ---------------- */
const BO = "#c2a46f", BC = "#f8edd4";
/* a bone along a line: dark edge, bone colour, a highlight */
const bone = (d: string, w: number) => `<path d="${d}" stroke="${BO}" stroke-width="${w + 3}" fill="none" stroke-linecap="round"/>`
  + `<path d="${d}" stroke="${BC}" stroke-width="${w}" fill="none" stroke-linecap="round"/>`
  + `<path d="${d}" stroke="#fffdf6" stroke-width="${Math.max(1.5, w / 4)}" fill="none" stroke-linecap="round" transform="translate(-${w / 6} -${w / 8})" opacity=".9"/>`;
const knob = (x: number, y: number, r: number) => `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#x-bone)" stroke="${BO}" stroke-width="1.6"/>`;
const skelLimbs = `
 ${bone("M131 216 L109 326", 11)}${knob(132, 212, 10)}${knob(108, 330, 8)}
 ${bone("M110 340 L101 436", 5)}${bone("M103 339 L94 434", 5)}
 <path d="M88 446 L104 446 L106 460 L88 462Z" fill="url(#x-bone)" stroke="${BO}" stroke-width="1.5"/>
 ${bone("M90 464 L86 478", 3)}${bone("M95 466 L93 482", 3)}${bone("M100 465 L100 481", 3)}${bone("M104 460 L112 470", 3)}
 ${bone("M167 462 L166 596", 14)}${knob(176, 452, 11)}${knob(166, 600, 10)}
 <circle cx="166" cy="611" r="8.5" fill="url(#x-bone)" stroke="${BO}" stroke-width="1.6"/>
 ${bone("M167 624 L165 736", 11)}${bone("M152 628 L154 732", 5)}
 <path d="M146 748 C146 740 160 738 172 742 C180 748 180 764 172 770 C160 774 146 770 146 760Z" fill="url(#x-bone)" stroke="${BO}" stroke-width="1.5"/>
 <path d="M150 772 L148 780 M157 773 L156 782 M164 772 L164 781 M171 769 L173 778" stroke="${BO}" stroke-width="3" stroke-linecap="round"/>
 <path d="M198 432 C182 424 160 414 149 424 C138 438 141 462 155 474 C167 484 183 482 191 470 C195 462 197 456 198 452Z" fill="url(#x-bone)" stroke="${BO}" stroke-width="2"/>
 <ellipse cx="172" cy="464" rx="8" ry="6" fill="#dcc396"/>`;
export const SKEL_BACK = `<g>${skelLimbs}</g><g ${MIR}>${skelLimbs}</g>
 <path d="M200 38 C236 38 254 62 254 92 C254 112 249 122 241 128 L236 146 Q220 158 200 158 Q180 158 164 146 L159 128 C151 122 146 112 146 92 C146 62 164 38 200 38Z" fill="url(#x-bone)" stroke="${BO}" stroke-width="2.2"/>
 <path d="M166 60 C176 46 190 42 204 42" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity=".8"/>
 <ellipse cx="180" cy="104" rx="13" ry="12" fill="#d8c193"/><ellipse cx="220" cy="104" rx="13" ry="12" fill="#d8c193"/>
 <path d="M200 116 L194 128 Q200 131 206 128Z" fill="#d8c193"/>
 <rect x="184" y="137" width="32" height="10" rx="4" fill="#fffaf0" stroke="${BO}" stroke-width="1.4"/>
 <path d="M192 137 V147 M200 137 V147 M208 137 V147" stroke="${BO}" stroke-width="1.2"/>
 ${Array.from({length: 22}, (_, i) => { const y = 162 + i * 12.6, w = i > 15 ? 22 : i > 10 ? 18 : 15;
    return `<rect x="${200 - w / 2}" y="${f(y)}" width="${w}" height="10" rx="4" fill="url(#x-bone)" stroke="${BO}" stroke-width="1.3"/>`; }).join("")}
 <path d="M190 432 L210 432 L206 470 Q200 478 194 470Z" fill="url(#x-bone)" stroke="${BO}" stroke-width="1.6"/>`;
const ribHalf = Array.from({length: 7}, (_, i) => {
  const y = 206 + i * 15.5, ex = 145 + i * .6, ey = y + 30 + i * 3;
  return bone(`M197 ${y} C178 ${y - 6} 152 ${y - 2} ${ex} ${ey - 14} C${ex - 3} ${ey - 6} ${ex - 2} ${ey} ${ex + 1} ${ey + 4}`, 5.5);
}).join("") + bone("M196 194 C178 190 156 193 134 201", 7);
export const SKEL_FRONT = `<g>${ribHalf}</g><g ${MIR}>${ribHalf}</g>
 <path d="M194 196 L206 196 L207 288 Q200 300 193 288Z" fill="url(#x-bone)" stroke="${BO}" stroke-width="1.6"/>`;

/* ---------------- blood vessels ---------------- */
const tube = (d: string, c: string, hi: string, w: number) => `<path d="${d}" stroke="${c}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`
  + `<path d="${d}" stroke="${hi}" stroke-width="${Math.max(1, w / 3)}" fill="none" stroke-linecap="round" opacity=".75" transform="translate(-.8 -.8)"/>`;
const AR = "#e2434b", ARH = "#ff9aa0", VE = "#3f6fd8", VEH = "#9fbaff";
const vesHalf = tube("M202 222 C180 212 152 208 132 214 L119 268 L108 330 L101 390 L97 440 M101 390 L106 438", AR, ARH, 3.6)
  + tube("M188 214 C170 206 146 204 125 210 L112 266 L101 330 L94 390 L90 440", VE, VEH, 3.4)
  + tube("M205 430 C190 444 174 452 171 472 L168 540 L166 612 L165 680 L164 744 M166 612 L156 680 L155 740", AR, ARH, 4)
  + tube("M194 430 C186 446 179 456 177 474 L174 540 L172 612 L171 680 L170 744", VE, VEH, 3.8);
export const VESSELS = `<g>${vesHalf}</g><g ${MIR}>${vesHalf}</g>
 <path class="xvh" transform="translate(211 286) scale(.62)" d="M-27 -16 C-36 -2 -30 20 -12 32 C0 40 18 44 28 40 C36 32 36 10 28 -6 C22 -18 8 -24 -6 -24 C-16 -24 -23 -21 -27 -16Z" fill="#e8414f" stroke="#9c1f30" stroke-width="2.5"/>
 ${tube("M205 430 L205 252 C205 236 218 226 212 220 C204 214 196 222 196 234", AR, ARH, 5.5)}
 ${tube("M202 222 L190 160 Q186 140 184 116 M210 222 L212 160 Q214 140 216 116", AR, ARH, 3.4)}
 ${tube("M193 430 L193 280 M193 262 L192 200", VE, VEH, 5.5)}
 ${tube("M192 214 L180 160 Q176 140 174 118 M200 214 L222 160 Q226 140 228 118", VE, VEH, 3.2)}
 ${tube("M205 380 L176 390 M205 376 L226 382", AR, ARH, 2.6)}`;

/* ---------------- nerves ---------------- */
const NV = "#f2bd1d", NH = "#fff1a8";
const nerve = (d: string, w: number) => `<path d="${d}" stroke="#b98a0a" stroke-width="${w + 2}" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity=".5"/>`
  + `<path d="${d}" stroke="${NV}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`
  + `<path d="${d}" stroke="${NH}" stroke-width="${Math.max(.8, w / 3)}" fill="none" stroke-linecap="round" opacity=".8"/>`;
const nerHalf = nerve("M200 204 C180 208 150 212 129 224 L115 280 L105 340 L99 400 L95 448 M105 340 L112 400 L104 446 M99 448 L88 474 M95 448 L95 480 M99 448 L104 478", 2.6)
  + nerve("M200 236 C184 236 164 240 150 252 M200 262 C184 262 166 266 150 278 M200 288 C184 288 166 292 150 304 M200 314 C184 314 168 318 152 330", 1.4)
  + nerve("M200 442 C188 452 176 460 172 478 L169 560 L167 616 L158 680 L156 748 M167 616 L168 690 L166 748 M172 478 L160 520 M169 560 L178 600", 2.8);
export const NERVES = `<g>${nerHalf}</g><g ${MIR}>${nerHalf}</g>
 <g class="xnb"><path d="M200 44 C176 40 156 52 154 74 C152 92 164 104 182 106 C190 107 196 104 200 102 C204 104 210 107 218 106 C236 104 248 92 246 74 C244 52 224 40 200 44Z" fill="#fff6cf" stroke="#e0a915" stroke-width="2.5"/>
 <path d="M200 46 L200 102 M168 66 Q178 62 182 74 M232 66 Q222 62 218 74 M174 92 Q184 86 190 94 M226 92 Q216 86 210 94" stroke="#e0a915" stroke-width="2" fill="none" stroke-linecap="round"/></g>
 ${nerve("M200 140 L200 444", 5)}
 ${nerve("M186 112 C180 120 174 130 168 136 M214 112 C220 120 226 130 232 136 M190 108 L186 92 M210 108 L214 92", 1.6)}
 ${Array.from({length: 10}, (_, i) => `<circle cx="200" cy="${200 + i * 26}" r="3.6" fill="#ffd84a" stroke="#b98a0a" stroke-width="1"/>`).join("")}`;

/* ---------------- organs (each one a tappable group) ---------------- */
const OE = (c: string) => `stroke="${c}" stroke-width="1.8"`;
export const ORGAN_ART: Record<OrganId, string> = {
  kidneys: [["", "M0 -19 C12 -20 15 -8 9 -2 C6 2 8 6 10 10 C13 18 5 23 -4 20 C-15 16 -15 -18 0 -19Z", 170, 392], [MIR, "M0 -19 C12 -20 15 -8 9 -2 C6 2 8 6 10 10 C13 18 5 23 -4 20 C-15 16 -15 -18 0 -19Z", 170, 386]]
    .map(([m, d, x, y]) => `<g ${m}><path transform="translate(${x} ${y})" d="${d}" fill="url(#x-kid)" ${OE("#7d2742")}/>
      <ellipse cx="${(x as number) - 4}" cy="${(y as number) - 8}" rx="4" ry="7" fill="#fff" opacity=".35"/></g>`).join(""),
  intestines: `<path d="M160 468 C152 456 150 438 152 420 C154 404 166 398 180 400 L220 400 C236 398 248 404 250 420 C252 440 250 458 240 468 C230 478 216 478 208 474" stroke="#b9634a" stroke-width="21" fill="none" stroke-linecap="round"/>
    <path d="M160 468 C152 456 150 438 152 420 C154 404 166 398 180 400 L220 400 C236 398 248 404 250 420 C252 440 250 458 240 468 C230 478 216 478 208 474" stroke="#eaa07e" stroke-width="18" fill="none" stroke-linecap="round"/>
    <path d="M160 468 C152 456 150 438 152 420 C154 404 166 398 180 400 L220 400 C236 398 248 404 250 420 C252 440 250 458 240 468 C230 478 216 478 208 474" stroke="#c9775a" stroke-width="18" fill="none" stroke-dasharray="1.6 8" opacity=".6"/>
    <path d="M155 452 C152 436 154 418 162 410 M180 404 L222 404" stroke="#ffd7c2" stroke-width="4" fill="none" stroke-linecap="round" opacity=".7"/>
    <rect x="166" y="411" width="70" height="56" rx="20" fill="url(#x-small)"/>
    <path d="M176 420 C190 414 214 414 226 420 C234 426 230 434 220 434 L182 434 C170 436 170 448 182 448 L220 448 C232 450 232 460 220 460 L184 460" stroke="#cf7e66" stroke-width="10.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M176 420 C190 414 214 414 226 420 C234 426 230 434 220 434 L182 434 C170 436 170 448 182 448 L220 448 C232 450 232 460 220 460 L184 460" stroke="#ffc6b1" stroke-width="7.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M180 418 C192 414 210 414 222 418 M184 446 L216 446" stroke="#fff" stroke-width="2" fill="none" opacity=".6" stroke-linecap="round"/>`,
  bladder: `<path d="M200 462 C214 462 218 472 217 480 C216 490 208 492 200 492 C192 492 184 490 183 480 C182 472 186 462 200 462Z" fill="url(#x-blad)" ${OE("#9b5a86")}/>
    <ellipse cx="194" cy="470" rx="5" ry="3.5" fill="#fff" opacity=".5"/>`,
  stomach: `<path d="M200 300 C204 318 210 330 216 342" stroke="#d98a66" stroke-width="7" fill="none" stroke-linecap="round"/>
    <path d="M214 342 C224 333 247 333 259 346 C269 360 267 381 255 394 C242 405 222 407 208 401 C201 397 203 388 212 386 C226 386 238 380 240 368 C242 358 232 352 222 354 C215 354 211 348 214 342Z" fill="url(#x-stom)" ${OE("#b8603e")}/>
    <path d="M230 344 C246 342 258 352 260 364" stroke="#fff" stroke-width="3.5" fill="none" stroke-linecap="round" opacity=".55"/>
    <path d="M222 396 C236 396 250 388 256 376" stroke="#d47a52" stroke-width="1.6" fill="none" opacity=".7"/>`,
  liver: `<path d="M140 344 C150 331 190 329 230 335 C238 339 237 350 228 357 C207 373 181 389 152 395 C140 395 135 381 135 367 C135 357 136 350 140 344Z" fill="url(#x-liver)" ${OE("#7d2f27")}/>
    <path d="M186 333 C184 350 182 368 176 388" stroke="#8e3a30" stroke-width="1.6" fill="none" opacity=".6"/>
    <ellipse cx="194" cy="378" rx="6" ry="8" fill="#9ccc65" stroke="#5b8c2a" stroke-width="1.4"/>
    <path d="M146 348 C160 338 186 336 212 338" stroke="#ffd0c0" stroke-width="3.5" fill="none" stroke-linecap="round" opacity=".55"/>`,
  lungs: `<path d="M194 152 L194 216 L206 216 L206 152Z" fill="#e3ecf7" stroke="#93a8c6" stroke-width="1.6"/>
    ${Array.from({length: 7}, (_, i) => `<path d="M194 ${158 + i * 8.5} Q200 ${161 + i * 8.5} 206 ${158 + i * 8.5}" stroke="#a9bcd6" stroke-width="2.2" fill="none"/>`).join("")}
    <path d="M200 214 L184 234 M200 214 L216 234" stroke="#93a8c6" stroke-width="10" stroke-linecap="round"/>
    <path d="M200 214 L184 234 M200 214 L216 234" stroke="#e3ecf7" stroke-width="7" stroke-linecap="round"/>
    <path d="M192 214 C186 196 172 190 162 200 C146 216 136 250 136 290 C136 318 138 336 146 342 C162 340 180 334 194 328 C196 300 194 260 192 236Z" fill="url(#x-lung)" ${OE("#c25f79")}/>
    <path d="M208 214 C214 196 228 190 238 200 C254 216 264 250 264 290 C264 318 262 336 254 342 C244 344 236 340 230 334 C236 320 236 302 226 292 C218 284 212 270 210 250Z" fill="url(#x-lung)" ${OE("#c25f79")}/>
    <path d="M140 286 C156 280 176 272 192 262 M148 336 C162 312 176 292 192 282 M260 300 C246 292 232 276 214 244" stroke="#c76c86" stroke-width="1.6" fill="none" opacity=".65"/>
    <path d="M156 214 C146 232 142 256 142 280 M244 214 C254 232 258 256 258 280" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".55"/>`,
  heart: `<g transform="translate(212 292) scale(.8)">
    <path d="M-20 -16 L-20 -44" stroke="#3f6fd8" stroke-width="9" stroke-linecap="round"/><path d="M-21 -16 L-21 -42" stroke="#9fbaff" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M2 -18 C0 -44 26 -50 30 -28 L30 -10" stroke="#c62a3e" stroke-width="10" fill="none" stroke-linecap="round"/>
    <path d="M1 -22 C0 -42 22 -46 27 -30" stroke="#ff8a8f" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M10 -40 L8 -52 M18 -42 L18 -54" stroke="#c62a3e" stroke-width="4" stroke-linecap="round"/>
    <path d="M-27 -16 C-36 -2 -30 20 -12 32 C0 40 18 44 28 40 C36 32 36 10 28 -6 C22 -18 8 -24 -6 -24 C-16 -24 -23 -21 -27 -16Z" fill="url(#x-heart)" stroke="#8f1a2c" stroke-width="1.8"/>
    <path d="M-4 -12 C-8 4 -2 22 16 36" stroke="#a8243a" stroke-width="2" fill="none" opacity=".7"/>
    <path d="M-6 -18 C-2 -30 12 -28 16 -20" stroke="#3f6fd8" stroke-width="8" fill="none" stroke-linecap="round"/>
    <path d="M-20 -8 C-24 2 -22 12 -16 20" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".55"/></g>`,
  brain: `<path d="M200 44 C176 40 156 52 154 74 C152 92 164 104 182 106 C190 107 196 104 200 102 C204 104 210 107 218 106 C236 104 248 92 246 74 C244 52 224 40 200 44Z" fill="url(#x-brain)" stroke="#a75a85" stroke-width="1.8"/>
    <path d="M200 46 L200 102" stroke="#a75a85" stroke-width="1.6"/>
    <path d="M164 62 Q172 58 176 66 Q180 74 172 78 M170 90 Q180 84 188 92 M182 52 Q192 56 188 66 Q184 76 192 82 M226 52 Q216 56 220 66 Q224 76 216 82 M236 62 Q228 58 224 66 Q220 74 228 78 M230 90 Q220 84 212 92"
      stroke="#c579a3" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M166 58 C172 50 182 46 192 46" stroke="#fff" stroke-width="3.5" fill="none" stroke-linecap="round" opacity=".6"/>`,
};
/* the tubes from the kidneys to the bladder (not part of one organ, so they do not glow) */
export const URETERS = `<path d="M178 394 C190 420 196 450 198 470 M222 388 C210 420 204 450 202 470" stroke="#e6c46a" stroke-width="2.5" fill="none"/>`;
/* drawing order: back to front */
export const ORGAN_ORDER: OrganId[] = ["intestines", "kidneys", "bladder", "stomach", "liver", "lungs", "heart", "brain"];
