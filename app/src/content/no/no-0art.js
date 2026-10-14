/* ===== no-0art.js: 2.5D cartoon pictures for NO lessons (soft gradients, light, shadow) =====
   Each picture is SVG markup drawn around (0,0); place it with A.art(svg,x,y,scale).
   Gradient ids start with "a-" and are defined inside each picture, so a picture works on its own.
   Writing, arrows and labels stay in the whiteboard marker style on top. */
const ART_LINE="#2a3550";

/* a child standing, facing us: about 400 tall, feet at y≈390, centred on x=0.
   Useful points: hand (-93,282) / (93,282), chest (0,170), thigh (-34,318) / (34,318), head (0,70). */
const KID=`<defs>
 <radialGradient id="a-skin" cx=".38" cy=".3" r=".9"><stop offset="0" stop-color="#ffe0c9"/><stop offset="1" stop-color="#e9a77f"/></radialGradient>
 <linearGradient id="a-shirt" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3cc7b6"/><stop offset="1" stop-color="#17867a"/></linearGradient>
 <linearGradient id="a-shorts" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4766b3"/><stop offset="1" stop-color="#24386a"/></linearGradient>
 <linearGradient id="a-hair" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5a3b28"/><stop offset="1" stop-color="#2e1c12"/></linearGradient>
 <radialGradient id="a-shoe" cx=".35" cy=".3" r=".9"><stop offset="0" stop-color="#ff8a6e"/><stop offset="1" stop-color="#c63b26"/></radialGradient>
</defs>
<ellipse cx="0" cy="394" rx="86" ry="11" fill="${ART_LINE}" opacity=".13"/>
<g stroke-linecap="round" fill="none">
 <path d="M-34 290 L-36 372" stroke="#e9a77f" stroke-width="26"/><path d="M34 290 L36 372" stroke="#e9a77f" stroke-width="26"/>
 <path d="M-38 296 L-40 366" stroke="#ffe0c9" stroke-width="8" opacity=".6"/><path d="M30 296 L31 366" stroke="#ffe0c9" stroke-width="8" opacity=".6"/>
 <path d="M-56 140 L-84 198 L-94 268" stroke="#e9a77f" stroke-width="24" stroke-linejoin="round"/>
 <path d="M56 140 L84 198 L94 268" stroke="#e9a77f" stroke-width="24" stroke-linejoin="round"/>
 <path d="M-87 206 L-95 262" stroke="#ffe0c9" stroke-width="7" opacity=".6"/>
</g>
<circle cx="-94" cy="282" r="15" fill="url(#a-skin)" stroke="${ART_LINE}" stroke-opacity=".3" stroke-width="2"/>
<circle cx="94" cy="282" r="15" fill="url(#a-skin)" stroke="${ART_LINE}" stroke-opacity=".3" stroke-width="2"/>
<ellipse cx="-42" cy="384" rx="28" ry="13" fill="url(#a-shoe)" stroke="${ART_LINE}" stroke-opacity=".35" stroke-width="2"/>
<ellipse cx="42" cy="384" rx="28" ry="13" fill="url(#a-shoe)" stroke="${ART_LINE}" stroke-opacity=".35" stroke-width="2"/>
<path d="M-62 232 L-66 292 L-6 294 L0 262 L6 294 L66 292 L62 232 Q0 246 -62 232Z" fill="url(#a-shorts)" stroke="${ART_LINE}" stroke-opacity=".35" stroke-width="2"/>
<path d="M-56 140 L-82 192" stroke="url(#a-shirt)" stroke-width="32" stroke-linecap="round"/><path d="M56 140 L82 192" stroke="url(#a-shirt)" stroke-width="32" stroke-linecap="round"/>
<path d="M-50 126 Q-60 128 -62 144 L-62 238 Q0 250 62 238 L62 144 Q60 128 50 126 Q28 118 0 120 Q-28 118 -50 126Z" fill="url(#a-shirt)" stroke="${ART_LINE}" stroke-opacity=".35" stroke-width="2"/>
<path d="M-40 140 Q-46 190 -44 228" stroke="#fff" stroke-opacity=".25" stroke-width="8" fill="none" stroke-linecap="round"/>
<path d="M-16 122 Q0 136 16 122" stroke="#17867a" stroke-width="3" fill="none"/>
<rect x="-12" y="106" width="24" height="20" rx="8" fill="#e9a77f"/>
<circle cx="-46" cy="74" r="11" fill="#e9a77f"/><circle cx="46" cy="74" r="11" fill="#e9a77f"/>
<circle cx="0" cy="68" r="48" fill="url(#a-skin)" stroke="${ART_LINE}" stroke-opacity=".3" stroke-width="2"/>
<path d="M-50 66 C-56 14 -22 2 2 2 C32 2 58 20 50 68 C44 44 22 32 -2 36 C-22 38 -40 48 -50 66Z" fill="url(#a-hair)"/>
<path d="M-24 14 Q-6 6 14 10" stroke="#8a6248" stroke-width="4" fill="none" stroke-linecap="round" opacity=".7"/>
<ellipse cx="-17" cy="74" rx="5.5" ry="7.5" fill="${ART_LINE}"/><ellipse cx="17" cy="74" rx="5.5" ry="7.5" fill="${ART_LINE}"/>
<circle cx="-15" cy="71" r="2" fill="#fff"/><circle cx="19" cy="71" r="2" fill="#fff"/>
<circle cx="-30" cy="90" r="8" fill="#ff8f8f" opacity=".35"/><circle cx="30" cy="90" r="8" fill="#ff8f8f" opacity=".35"/>
<path d="M-14 96 Q0 108 14 96" stroke="#9c4a3a" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;

/* an animal cell close up, radius about 170 */
const CELL3D=`<defs>
 <radialGradient id="a-cyto" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#fff1ea"/><stop offset=".7" stop-color="#ffcdb8"/><stop offset="1" stop-color="#f29d82"/></radialGradient>
 <radialGradient id="a-nuc" cx=".38" cy=".32" r=".8"><stop offset="0" stop-color="#cdbbff"/><stop offset="1" stop-color="#5b3fc4"/></radialGradient>
 <linearGradient id="a-mito" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffc56b"/><stop offset="1" stop-color="#e2832a"/></linearGradient>
</defs>
<ellipse cx="0" cy="168" rx="150" ry="14" fill="${ART_LINE}" opacity=".1"/>
<path d="M-168 -10 C-170 -96 -96 -158 -4 -156 C92 -154 170 -100 168 -6 C166 86 98 152 2 154 C-98 156 -166 84 -168 -10Z" fill="url(#a-cyto)" stroke="#d26e52" stroke-width="5"/>
<path d="M-150 -20 C-146 -96 -84 -138 -8 -138" stroke="#fff" stroke-width="9" fill="none" stroke-linecap="round" opacity=".55"/>
<g fill="#e7957b" opacity=".55"><circle cx="-110" cy="40" r="4"/><circle cx="-80" cy="90" r="3"/><circle cx="60" cy="100" r="4"/><circle cx="120" cy="-30" r="3"/><circle cx="-40" cy="-110" r="3"/><circle cx="90" cy="-90" r="4"/><circle cx="20" cy="120" r="3"/></g>
<g transform="rotate(-25 -92 -40)"><rect x="-128" y="-58" width="72" height="36" rx="18" fill="url(#a-mito)" stroke="#b9661f" stroke-width="2.5"/><path d="M-120 -40 q8 -12 16 0 t16 0 t16 0 t16 0" stroke="#b9661f" stroke-width="2.5" fill="none"/></g>
<g transform="rotate(20 92 70)"><rect x="56" y="52" width="72" height="36" rx="18" fill="url(#a-mito)" stroke="#b9661f" stroke-width="2.5"/><path d="M64 70 q8 -12 16 0 t16 0 t16 0 t16 0" stroke="#b9661f" stroke-width="2.5" fill="none"/></g>
<circle cx="20" cy="-6" r="62" fill="url(#a-nuc)" stroke="#45309a" stroke-width="3"/>
<circle cx="34" cy="4" r="18" fill="#3c2690" opacity=".55"/>
<ellipse cx="0" cy="-30" rx="20" ry="11" fill="#fff" opacity=".45" transform="rotate(-30 0 -30)"/>`;

/* a thigh bone cut open: hard outer shell, spongy bone at the ends, marrow inside. About 600 long, lying across, centred.
   Points: shell (0,-36), spongy end (-262,0), marrow (0,0). */
const FEMUR3D=`<defs>
 <linearGradient id="a-bone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fffaf0"/><stop offset=".55" stop-color="#f1e3c4"/><stop offset="1" stop-color="#d6c094"/></linearGradient>
 <linearGradient id="a-marrow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffb07a"/><stop offset="1" stop-color="#d9603a"/></linearGradient>
 <pattern id="a-spongy" width="20" height="20" patternUnits="userSpaceOnUse"><rect width="20" height="20" fill="#f5e2bb"/><circle cx="5" cy="5" r="4" fill="#dca06a"/><circle cx="15" cy="13" r="3.4" fill="#dca06a"/><circle cx="15" cy="3" r="2" fill="#dca06a"/><circle cx="4" cy="15" r="2.2" fill="#dca06a"/></pattern>
</defs>
<ellipse cx="0" cy="104" rx="300" ry="14" fill="${ART_LINE}" opacity=".1"/>
<path d="M-240 -64 C-320 -110 -350 -20 -312 0 C-350 20 -320 110 -240 64 C-216 50 -196 42 -176 40 L176 40 C196 42 216 50 240 64 C320 110 350 20 312 0 C350 -20 320 -110 240 -64 C216 -50 196 -42 176 -40 L-176 -40 C-196 -42 -216 -50 -240 -64Z" fill="url(#a-bone)" stroke="#b69b62" stroke-width="4"/>
<path d="M-250 -48 C-306 -78 -326 -14 -296 0 C-326 14 -306 78 -250 48 C-230 36 -212 30 -190 26 L-190 -26 C-212 -30 -230 -36 -250 -48Z" fill="url(#a-spongy)" stroke="#c9a46a" stroke-width="2"/>
<path d="M250 -48 C306 -78 326 -14 296 0 C326 14 306 78 250 48 C230 36 212 30 190 26 L190 -26 C212 -30 230 -36 250 -48Z" fill="url(#a-spongy)" stroke="#c9a46a" stroke-width="2"/>
<rect x="-190" y="-22" width="380" height="44" rx="20" fill="url(#a-marrow)" stroke="#b44a26" stroke-width="2"/>
<path d="M-176 -4 C-120 -14 -70 8 -10 -2 C50 -12 110 8 176 -4" stroke="#c81d3a" stroke-width="3" fill="none"/>
<path d="M-176 8 C-110 14 -60 0 0 8 C60 16 120 2 176 10" stroke="#3f5fd1" stroke-width="3" fill="none"/>
<g fill="#c81d3a"><ellipse cx="-120" cy="-10" rx="6" ry="4"/><ellipse cx="-40" cy="2" rx="6" ry="4"/><ellipse cx="60" cy="-8" rx="6" ry="4"/><ellipse cx="130" cy="4" rx="6" ry="4"/></g>
<path d="M-230 -56 C-200 -44 -186 -40 -150 -38" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round" opacity=".75"/>`;


/* skin seen very close: a patch of cells packed together, about 400 across, centred */
const CELLPATCH=(()=>{let o=`<defs><radialGradient id="a-pc" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#ffe6da"/><stop offset="1" stop-color="#f3ad92"/></radialGradient></defs><circle r="200" fill="#e99b80"/>`;
 for(let r=-4;r<=4;r++)for(let c=-4;c<=4;c++){const x=c*48+(r%2?24:0),y=r*42;if(x*x+y*y>185*185)continue;
  o+=`<path d="M${x-24} ${y}l12 -21h24l12 21l-12 21h-24z" fill="url(#a-pc)" stroke="#c9654a" stroke-width="2.5"/><circle cx="${x+3}" cy="${y-2}" r="7" fill="#7c5bd6" opacity=".8"/>`}
 return o+`<circle r="200" fill="none" stroke="#c9654a" stroke-width="6"/>`})();
/* the bone standing up, for showing it through the leg */
const FEMURUP=`<g transform="rotate(90)" opacity=".9">${FEMUR3D}</g>`;


/* a 2.5D birch-like tree, about 400 tall, trunk foot at y≈390, centred on x=0. A leaf to zoom into sits at (70,120). */
const TREE3D=(()=>{let o=`<defs>
 <linearGradient id="a-trunk" x1="0" x2="1"><stop offset="0" stop-color="#a9744a"/><stop offset=".45" stop-color="#d9a679"/><stop offset="1" stop-color="#7a4e2c"/></linearGradient>
 <radialGradient id="a-crown" cx=".38" cy=".3" r=".85"><stop offset="0" stop-color="#9fe08a"/><stop offset=".6" stop-color="#4fae4a"/><stop offset="1" stop-color="#2b7a34"/></radialGradient>
 <linearGradient id="a-tleaf" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#b8f0a0"/><stop offset="1" stop-color="#3f9a3c"/></linearGradient>
</defs>
<ellipse cx="0" cy="394" rx="120" ry="13" fill="${ART_LINE}" opacity=".13"/>
<path d="M-22 392 Q-14 300 -16 220 L16 220 Q14 300 24 392Z" fill="url(#a-trunk)"/>
<path d="M-6 250 Q-50 210 -80 190M6 240 Q50 205 78 180" stroke="#8a5a34" stroke-width="10" fill="none" stroke-linecap="round"/>`;
 for(const [x,y,r] of [[-90,150,80],[80,140,84],[0,90,100],[-40,190,70],[50,200,70],[0,170,80]])o+=`<circle cx="${x}" cy="${y}" r="${r}" fill="url(#a-crown)"/>`;
 for(let k=0;k<46;k++){const a=k*2.399,r=22+((k*37)%120),x=Math.round(Math.cos(a)*r*1.15),y=Math.round(140+Math.sin(a)*r*.8);
  if(Math.abs(x-90)<34&&Math.abs(y-112)<24)continue;
  o+=`<path d="M${x} ${y} q9 -11 21 -8 q-3 13 -21 8z" fill="#3d9a3e" opacity=".55" transform="rotate(${(k*53)%360} ${x} ${y})"/>`}
 o+=`<path d="M70 120 q22 -26 50 -20 q-6 30 -50 20z" fill="#e4f7a0" stroke="#2b7a34" stroke-width="3"/><path d="M70 120 l40 -16" stroke="#2b7a34" stroke-width="1.8"/>`;
 return o})();

/* the surface of a leaf seen very close: box-shaped plant cells with green dots, radius 200 */
const LEAFPATCH=(()=>{let o=`<defs><radialGradient id="a-lp" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#e9fbe0"/><stop offset="1" stop-color="#a9de95"/></radialGradient></defs><circle r="200" fill="#5aa94f"/>`;
 for(let r=-5;r<=5;r++)for(let c=-4;c<=4;c++){const x=c*50+(r%2?25:0),y=r*36;if(x*x+y*y>180*180)continue;
  o+=`<rect x="${x-23}" y="${y-16}" width="46" height="32" rx="5" fill="url(#a-lp)" stroke="#2f7a2e" stroke-width="3"/>`;
  for(const [dx,dy] of [[-12,-6],[2,7],[13,-4],[-4,-8]])o+=`<ellipse cx="${x+dx}" cy="${y+dy}" rx="5" ry="3.4" fill="#2f9e3c"/>`}
 return o+`<circle r="200" fill="none" stroke="#2f7a2e" stroke-width="6"/>`})();

/* a plant cell, about 380 wide and 260 tall, centred on (0,0).
   Useful points: cell wall top (0,-130), nucleus (-110,-40), chloroplast (90,70), vacuole (40,-10). */
const PCELL3D=(()=>{let o=`<defs>
 <linearGradient id="a-wall" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9ad67f"/><stop offset="1" stop-color="#3f8f3a"/></linearGradient>
 <radialGradient id="a-cyto" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#f6fff0"/><stop offset="1" stop-color="#d4efc4"/></radialGradient>
 <radialGradient id="a-vac" cx=".4" cy=".35" r=".8"><stop offset="0" stop-color="#eaf7ff"/><stop offset="1" stop-color="#a9d6f2"/></radialGradient>
 <radialGradient id="a-nuc" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#c7b3ff"/><stop offset="1" stop-color="#6a49c9"/></radialGradient>
 <linearGradient id="a-chl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7fd96a"/><stop offset="1" stop-color="#1f7a2c"/></linearGradient>
</defs>
<ellipse cx="0" cy="150" rx="190" ry="14" fill="${ART_LINE}" opacity=".12"/>
<rect x="-195" y="-135" width="390" height="270" rx="34" fill="url(#a-wall)"/>
<rect x="-180" y="-120" width="360" height="240" rx="26" fill="url(#a-cyto)" stroke="#5fae4c" stroke-width="3"/>
<path d="M-40 -90 Q60 -110 120 -60 Q150 10 100 70 Q20 100 -40 60 Q-70 0 -40 -90Z" fill="url(#a-vac)" stroke="#6aaed6" stroke-width="3"/>
<circle cx="-110" cy="-40" r="38" fill="url(#a-nuc)"/><circle cx="-118" cy="-48" r="12" fill="#4a2fa0" opacity=".7"/>`;
 for(const [x,y,a] of [[90,70,10],[-120,60,-20],[-60,90,15],[140,-90,30],[-150,-95,-30],[150,20,80],[30,-100,0],[-20,100,-5]])
  o+=`<g transform="translate(${x} ${y}) rotate(${a})"><ellipse rx="24" ry="13" fill="url(#a-chl)"/><path d="M-14 -3h28M-14 4h28" stroke="#c9f3b4" stroke-width="2" opacity=".8"/></g>`;
 return o+`<path d="M-170 -110 Q-60 -128 60 -118" stroke="#fff" stroke-width="6" opacity=".5" fill="none" stroke-linecap="round"/>`})();

export {ART_LINE,KID,CELL3D,FEMUR3D,CELLPATCH,FEMURUP,TREE3D,LEAFPATCH,PCELL3D};
