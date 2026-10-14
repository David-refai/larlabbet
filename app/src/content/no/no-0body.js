import {A,R,f1,pick,shuffle} from "../../legacy/core.js";
/* ======================================================================
   NO (science), Year 4: the human body. Shared drawings for the body lessons,
   hand-drawn on the whiteboard like the maths lessons.
   A figure is drawn in its own box (x −100..100, y 0..440) and placed with
   tf(d, x, y, k): x, y = top centre on the board, k = scale.
   ====================================================================== */
/* move and scale a path written with absolute commands (M L Q C Z) */
const tf=(d,ox,oy,k=1)=>{let i=0;return d.replace(/-?\d+(\.\d+)?/g,n=>{const v=+n;return f1(i++%2===0?ox+v*k:oy+v*k)})};
const NOB={ox:400,oy:30,k:1};
const bp=(d,c="k",w=4)=>A.p(tf(d,NOB.ox,NOB.oy,NOB.k),c,w*Math.max(.7,Math.min(1.2,NOB.k)));
const bh=(d,c)=>A.hatch(tf(d,NOB.ox,NOB.oy,NOB.k),c);
const bx=x=>NOB.ox+x*NOB.k,by=y=>NOB.oy+y*NOB.k;
/* place the figure: everything drawn with bp/bh/bx/by until the next call uses this box */
const at=(ox,oy,k=1)=>{NOB.ox=ox;NOB.oy=oy;NOB.k=k};
const ellP=(cx,cy,rx,ry)=>{let d="";for(let i=0;i<=40;i++){const t=i/40*Math.PI*2;d+=(i?"L":"M")+f1(cx+Math.cos(t)*rx)+" "+f1(cy+Math.sin(t)*ry)}return d+"Z"};
/* the outline: head, neck, arms, body and legs */
const OUT="M14 76 L16 94 Q22 102 62 106 Q84 112 88 136 L98 284 Q102 304 90 308 Q80 310 80 290 L70 160 L62 168 L58 230 Q62 262 58 286 L46 420 Q50 438 30 438 L16 438 L12 300 Q0 290 -12 300 L-16 438 L-30 438 Q-50 438 -46 420 L-58 286 Q-62 262 -58 230 L-62 168 L-70 160 L-80 290 Q-80 310 -90 308 Q-102 304 -98 284 L-88 136 Q-84 112 -62 106 Q-22 102 -16 94 L-14 76";
const HEAD=ellP(0,42,30,36);
const body=(c="k")=>[bp(OUT,c,3.5),bp(HEAD,c,3.5)];
/* organs */
const ORG={
 brain:{d:"M-24 34 Q-26 12 -4 10 Q2 6 10 10 Q28 12 26 32 Q28 44 14 46 Q0 50 -12 46 Q-28 46 -24 34 Z M-12 18 Q-6 26 -14 32 M4 16 Q12 22 6 30 Q12 36 20 32 M-4 36 Q2 42 10 40",c:"o",lab:[0,28]},
 lungR:{d:"M-12 118 Q-14 112 -24 114 Q-48 124 -50 170 Q-50 196 -36 198 Q-20 198 -14 186 Z",c:"b",lab:[-32,160]},
 lungL:{d:"M12 118 Q14 112 24 114 Q48 124 50 170 Q50 196 36 198 Q22 198 20 188 Q30 178 26 166 Q16 150 12 150 Z",c:"b",lab:[34,170]},
 heart:{d:"M10 182 Q-14 166 -6 150 Q0 140 10 150 Q20 136 28 148 Q34 166 10 182 Z",c:"r",lab:[11,162]},
 windpipe:{d:"M0 80 L0 118 M0 118 L-12 126 M0 118 L12 126",c:"b",lab:[0,100]},
 liver:{d:"M-48 202 Q-50 192 -30 192 L18 194 Q22 198 12 208 Q-10 222 -40 220 Q-50 216 -48 202 Z",c:"o",lab:[-20,206]},
 stomach:{d:"M14 196 Q18 192 26 194 Q48 200 44 222 Q40 240 18 236 Q8 232 6 224 Q20 226 24 218 Q26 206 14 204 Z",c:"r",lab:[30,216]},
 gullet:{d:"M0 68 L2 120 Q4 170 14 196",c:"r",lab:[0,96]},
 small:{d:"M-22 242 Q-26 236 -18 234 L18 234 Q26 236 22 242 Q16 248 -16 248 Q-26 252 -18 258 L18 258 Q26 262 18 266 L-16 266 Q-24 270 -16 274 L14 274",c:"o",lab:[0,256]},
 large:{d:"M14 280 Q36 282 38 272 L40 232 Q40 226 34 226 L-34 226 Q-40 226 -40 232 L-40 274 Q-40 284 -28 286",c:"g",lab:[0,236]},
 kidneys:{d:"M-34 228 Q-46 232 -42 246 Q-38 256 -28 252 Q-24 246 -30 240 Q-24 232 -34 228 Z M34 228 Q46 232 42 246 Q38 256 28 252 Q24 246 30 240 Q24 232 34 228 Z",c:"v"},
 spine:{d:"M0 80 L0 282",c:"k"},
};
const organ=(k,fill)=>{const o=ORG[k];return fill?[bh(o.d,o.c),bp(o.d,o.c,3)]:[bp(o.d,o.c,3)]};
/* a label with a pointer line from the organ to the side of the board */
const label=(k,text,side,ty,c)=>{const o=ORG[k],x0=bx(o.lab[0]),y0=by(o.lab[1]),tx=side<0?bx(-118):bx(118),col=c||o.c;
  return[A.p(R.line(x0,y0,tx,ty,.3),col,2.5),A.p(R.circ(x0,y0,4),col,3),A.tx(text,tx+side*8,ty+8,30,col,side<0?"end":"start")]};
/* the skeleton */
const BONE={
 skull:HEAD,
 jaw:"M-22 62 Q0 82 22 62",
 spine:"M0 82 L0 286",
 ribs:"M-4 120 Q-44 118 -46 150 M4 120 Q44 118 46 150 M-4 136 Q-44 136 -44 168 M4 136 Q44 136 44 168 M-4 152 Q-42 154 -40 184 M4 152 Q42 154 40 184 M-4 168 Q-36 172 -34 196 M4 168 Q36 172 34 196",
 collar:"M-6 104 L-62 110 M6 104 L62 110",
 pelvis:"M-8 262 Q-44 252 -50 278 Q-46 300 -20 302 Q-6 296 0 286 Q6 296 20 302 Q46 300 50 278 Q44 252 8 262",
 armR:"M-68 114 L-80 200 M-80 206 L-90 290 M-74 206 L-82 290",
 armL:"M68 114 L80 200 M80 206 L90 290 M74 206 L82 290",
 legR:"M-30 300 L-34 364 M-34 372 L-36 432 M-28 372 L-28 432",
 legL:"M30 300 L34 364 M34 372 L36 432 M28 372 L28 432",
};
const JOINT={shoulder:[[-68,112],[68,112]],elbow:[[-80,203],[80,203]],hip:[[-28,296],[28,296]],knee:[[-32,368],[32,368]]};
const skeleton=(c="k")=>Object.values(BONE).map(d=>bp(d,c,3.5));
const joints=(k,c="r")=>JOINT[k].map(([x,y])=>A.p(R.circ(bx(x),by(y),8*NOB.k),c,3.5));
/* a heart with four rooms; blood comes in at the top and leaves at the sides */
const heartBig=(cx,cy,s=1)=>{const P=(x,y)=>f1(cx+x*s)+","+f1(cy+y*s);
  return[A.p(`M${P(0,110)}Q${P(-150,10)} ${P(-90,-60)}Q${P(-40,-100)} ${P(0,-50)}Q${P(40,-100)} ${P(90,-60)}Q${P(150,10)} ${P(0,110)}Z`,"r",5),
   A.p(`M${P(0,-50)}L${P(0,106)}M${P(-104,-4)}Q${P(-50,8)} ${P(0,-4)}Q${P(50,8)} ${P(104,-4)}`,"r",3.5)]};
/* a small person icon (for "you") and a simple eye, ear, nose, tongue and hand for the senses */
const SENSE={
 eye:(x,y,s=1)=>[A.p(`M${x-40*s},${y}Q${x},${y-30*s} ${x+40*s},${y}Q${x},${y+30*s} ${x-40*s},${y}Z`,"k",3.5),A.p(R.circ(x,y,13*s),"b",3.5),A.hatch(R.circ(x,y,6*s),"k")],
 ear:(x,y,s=1)=>[A.p(`M${x-14*s},${y-36*s}Q${x+30*s},${y-50*s} ${x+26*s},${y-6*s}Q${x+22*s},${y+20*s} ${x+6*s},${y+30*s}Q${x-6*s},${y+44*s} ${x-14*s},${y+30*s}M${x-2*s},${y-18*s}Q${x+14*s},${y-22*s} ${x+12*s},${y-4*s}Q${x+8*s},${y+8*s} ${x},${y+10*s}`,"o",3.5)],
 nose:(x,y,s=1)=>[A.p(`M${x},${y-38*s}L${x-16*s},${y+16*s}Q${x-26*s},${y+30*s} ${x-10*s},${y+30*s}Q${x},${y+22*s} ${x+10*s},${y+30*s}Q${x+26*s},${y+30*s} ${x+16*s},${y+16*s}L${x+6*s},${y-20*s}`,"g",3.5)],
 tongue:(x,y,s=1)=>[A.p(`M${x-34*s},${y-14*s}Q${x},${y-26*s} ${x+34*s},${y-14*s}Q${x+40*s},${y+30*s} ${x},${y+34*s}Q${x-40*s},${y+30*s} ${x-34*s},${y-14*s}ZM${x},${y-16*s}L${x},${y+16*s}`,"r",3.5)],
 hand:(x,y,s=1)=>[A.p(`M${x-24*s},${y+40*s}L${x-26*s},${y}L${x-30*s},${y-30*s}Q${x-24*s},${y-38*s} ${x-18*s},${y-28*s}L${x-14*s},${y-6*s}L${x-12*s},${y-44*s}Q${x-6*s},${y-52*s} ${x},${y-44*s}L${x+2*s},${y-8*s}L${x+6*s},${y-46*s}Q${x+12*s},${y-52*s} ${x+16*s},${y-44*s}L${x+16*s},${y-6*s}L${x+22*s},${y-36*s}Q${x+28*s},${y-40*s} ${x+32*s},${y-32*s}L${x+28*s},${y+4*s}L${x+40*s},${y-8*s}Q${x+48*s},${y-4*s} ${x+44*s},${y+4*s}L${x+22*s},${y+40*s}Z`,"v",3.5)],
};
/* a title at the top and a note line at the bottom of the board */
const ttl=(s,c="b")=>A.tx(s,400,62,44,c);
const note=(s,y=468,c="k",z=30)=>A.tx(s,400,y,z,c);
/* a bullet list on one side: lines of text with a coloured dot */
const blist=(items,x,y,gap=50,z=30)=>items.flatMap(([s,c],i)=>[A.p(R.circ(x,y+i*gap-9,6),c||"k",4),A.tx(s,x+20,y+i*gap,z,c||"k","start")]);
/* exam and practice questions written on the board: a heading and up to three lines */
const qBoard=(lines,pic)=>{const o=[A.wipe()];const ls=Array.isArray(lines)?lines:[lines];
  /* with a picture the question sits on the right half, the picture on the left */
  ls.forEach((s,i)=>o.push(pic?A.tx(s,590,110+i*46,Math.min(32,620/Math.max(12,s.length)),i?"k":"b"):A.tx(s,400,150+i*56,Math.min(40,1500/Math.max(20,s.length)),i?"k":"b")));if(pic)o.push(...pic);return o};
const solNote=(s,pic)=>pic?[A.hl(420,300,340,62),A.tx(s,590,344,Math.min(38,640/Math.max(10,s.length)),"g")]:[note(s,470,"g",34)];
/* a multiple-choice question from a bank entry {q, a (right), w (wrong ones), pic?, sol?} */
const mcq=(e,ex)=>{const opts=shuffle([e.a,...e.w.slice(0,3)]);const qs=e.q;
  return{kind:"choice",opts,ans:opts.indexOf(e.a),show:e.a,qs,q:qBoard(e.lines||[qs],e.pic&&e.pic()),sol:e.sol?e.sol():solNote(e.a,!!e.pic),nt:e.nt}};
/* a write-the-word question (Swedish spelling, one letter off is accepted by the checker) */
const wq=(e)=>({kind:"text",ans:e.a,show:[].concat(e.a)[0],qs:e.q,q:qBoard(e.lines||[e.q],e.pic&&e.pic()),sol:e.sol?e.sol():solNote([].concat(e.a)[0],!!e.pic),nt:e.nt});
/* an arrow pointing at one organ on the body: "What is this organ called?" */
const pointAt=(k)=>{const o=ORG[k];at(230,40,.95);const x0=bx(o.lab[0]),y0=by(o.lab[1]),tx=bx(150);
  return[...body(),...Object.keys(ORG).filter(n=>n!=="spine"&&n!=="kidneys").flatMap(n=>[bp(ORG[n].d,n===k?ORG[n].c:"#b8c2d4",n===k?3.5:2.2)]),A.p(R.arrow(tx,y0-50,x0+8,y0-2,-20),"r",4.5),A.tx("?",tx+12,y0-58,52,"r")]};

/* practice and test questions from a bank: {lv, q, a, w?: wrong options (makes it multiple choice), lines?, pic?, sol?}.
   A level gets mostly its own questions and sometimes easier ones. */
const bankGen=bank=>(level=0)=>{const ok=bank.filter(e=>(e.lv||0)<=level),top=ok.filter(e=>(e.lv||0)===level);
  const e=pick(top.length&&Math.random()<.7?top:ok);return e.w?mcq(e):wq(e)};
/* a simple cell: wobbly outline, nucleus, a few dots */
const cell=(x,y,r,c="g")=>[A.p(R.loop(x,y,r,r*.82),c,3.5),A.hatch(R.circ(x+r*.1,y,r*.3),"v"),A.p(R.circ(x+r*.1,y,r*.3),"v",3),A.p(`M${f1(x-r*.5)},${f1(y-r*.3)}l.1,0M${f1(x-r*.4)},${f1(y+r*.4)}l.1,0M${f1(x+r*.55)},${f1(y+r*.35)}l.1,0`,c,5)];

/* ======================================================================
   Nature drawings (Biologi Åk 4: djur, växter och ekosystem).
   Each picture is a list of parts [path, colour, width, hatch?] in its own box,
   x −100..100 and y upwards from 0 (the ground, or the middle for fish and insects).
   art(name, x, y, s, flip) places it: (x, y) = the anchor on the board, s = scale, flip = −1 faces left.
   ====================================================================== */
const tfx=(d,ox,oy,k,fl=1)=>{let i=0;return d.replace(/-?\d+(\.\d+)?/g,n=>{const v=+n;return f1(i++%2===0?ox+v*k*fl:oy+v*k)})};
const BRN="#8a5a2b";
const dotsP=pts=>pts.map(([x,y])=>`M${x} ${y} L${x+.1} ${y}`).join("");
const NAT={
 sun:[[ellP(0,0,34,34),"o",4,"o"],[[0,1,2,3,4,5,6,7].map(i=>{const a=i*Math.PI/4;return`M${f1(Math.cos(a)*46)} ${f1(Math.sin(a)*46)} L${f1(Math.cos(a)*64)} ${f1(Math.sin(a)*64)}`}).join(""),"o",4]],
 cloud:[["M-50 10 Q-64 -8 -40 -14 Q-36 -36 -10 -30 Q4 -50 26 -32 Q52 -36 50 -12 Q68 -2 50 10 Z","#7d8ca6",3.5]],
 gran:[["M0 -170 L-14 -138 L-5 -140 L-28 -104 L-13 -106 L-42 -68 L-21 -70 L-58 -24 L58 -24 L21 -70 L42 -68 L13 -106 L28 -104 L5 -140 L14 -138 Z","g",3.5,"g"],["M-7 -24 L-8 0 M7 -24 L8 0 M-12 0 L12 0",BRN,4]],
 tall:[["M-6 0 Q-4 -60 -3 -122 M6 0 Q4 -60 3 -122 M-3 -100 L-26 -122 M3 -110 L28 -128","o",4],["M-62 -128 Q-68 -148 -44 -152 Q-40 -174 -12 -170 Q6 -188 30 -172 Q56 -174 60 -152 Q76 -138 56 -126 Q30 -118 0 -124 Q-30 -116 -62 -128 Z","g",3.5,"g"]],
 bjork:[["M-7 0 L-5 -104 M7 0 L5 -104 M-12 0 L12 0","#9aa3b2",3.5],["M-6 -18 L0 -16 M1 -40 L6 -42 M-5 -62 L-1 -60 M1 -84 L5 -86","k",4],["M-50 -98 Q-62 -128 -38 -148 Q-26 -176 4 -172 Q34 -178 46 -150 Q66 -128 52 -102 Q40 -82 10 -88 Q-20 -80 -50 -98 Z","#3fae5e",3.5,"g"],[dotsP([[-30,-120],[-12,-142],[16,-150],[30,-118],[0,-110],[-20,-100],[34,-140]]),"g",6]],
 blabar:[["M0 0 L0 -44 M0 -18 L-26 -42 M0 -26 L24 -52 M0 -40 L-10 -60","g",3],[ellP(-30,-48,10,5)+ellP(28,-58,10,5)+ellP(-14,-64,9,5)+ellP(10,-40,9,5),"g",2.5,"g"],[ellP(-18,-30,6,6)+ellP(14,-30,6,6)+ellP(4,-52,6,6)+ellP(-26,-20,6,6),"b",3,"b"]],
 svamp:[["M-36 -40 Q-32 -78 0 -80 Q32 -78 36 -40 Q0 -34 -36 -40 Z","o",3.5,"o"],["M-11 -38 Q-14 -18 -12 0 L12 0 Q14 -18 11 -38",BRN,3.5]],
 grass:[["M-30 0 Q-34 -24 -40 -34 M-22 0 Q-22 -26 -16 -40 M-10 0 Q-12 -20 -20 -28 M0 0 Q2 -30 -4 -44 M10 0 Q8 -22 16 -36 M20 0 Q24 -24 34 -32 M28 0 Q30 -16 26 -26","g",3.5]],
 stone:[["M-46 0 Q-50 -26 -24 -36 Q4 -46 30 -32 Q50 -20 46 0 Z","k",3.5,"k"]],
 drop:[["M0 -60 Q-24 -26 -22 -14 Q-20 6 0 6 Q20 6 22 -14 Q24 -26 0 -60 Z","b",3.5,"b"]],
 fox:[["M-46 -40 Q-40 -60 0 -58 Q34 -58 46 -48 Q54 -32 40 -26 Q0 -20 -36 -26 Q-52 -30 -46 -40 Z","o",3.5,"o"],
  ["M40 -50 L48 -82 L60 -62 L70 -84 L74 -60 Q90 -54 102 -46 Q88 -38 70 -38 Q52 -36 40 -50 Z","o",3.5,"o"],
  ["M-44 -44 Q-84 -52 -104 -24 Q-110 -8 -94 -8 Q-70 -12 -42 -30","o",3.5,"o"],["M-104 -24 Q-110 -8 -94 -8","k",4],
  ["M-34 -26 L-36 0 M-22 -24 L-20 0 M24 -26 L22 0 M36 -30 L40 0","k",4],[dotsP([[72,-54],[101,-46]]),"k",7]],
 hare:[["M-40 -10 Q-52 -50 -10 -58 Q22 -62 32 -40 Q42 -12 22 0 L-30 0 Q-44 0 -40 -10 Z",BRN,3.5],[ellP(36,-62,20,15),BRN,3.5],
  ["M30 -74 Q18 -120 30 -124 Q42 -120 40 -76 M42 -74 Q48 -118 58 -116 Q64 -110 50 -72",BRN,3.5],[ellP(-46,-26,8,8),BRN,3],["M22 -24 L30 0 L42 0 M-24 -4 L4 -2",BRN,3.5],[dotsP([[44,-66],[56,-58]]),"k",6]],
 moose:[["M-72 -66 Q-78 -104 -36 -106 Q4 -108 24 -126 Q48 -128 56 -106 Q74 -98 72 -78 Q70 -60 50 -60 L-56 -60 Q-74 -58 -72 -66 Z","#5a3d22",3.5,"k"],
  ["M50 -114 Q64 -128 84 -124 L120 -104 Q134 -94 128 -82 Q118 -72 104 -80 L88 -86 Q74 -78 62 -80 Z","#5a3d22",3.5,"k"],["M84 -86 Q88 -66 80 -60","#5a3d22",3.5],
  ["M-56 -62 L-58 0 M-40 -60 L-38 0 M40 -62 L38 0 M56 -64 L60 0","#5a3d22",4.5],
  ["M78 -124 Q66 -134 58 -150 L50 -164 L62 -156 L62 -170 L70 -156 L76 -168 L80 -150 Q84 -138 84 -124 Z M88 -124 Q100 -138 110 -150 L114 -168 L120 -152 L128 -164 L128 -148 L140 -154 L132 -138 Q118 -128 94 -120 Z",BRN,3.5,"o"],
  ["M74 -122 L62 -132 L80 -126","#5a3d22",3],[dotsP([[100,-104]]),"k",6]],
 squirrel:[["M-10 -12 Q-52 -10 -52 -52 Q-52 -92 -20 -98 Q4 -100 4 -82 Q2 -70 -14 -72 Q-28 -72 -26 -56 Q-24 -36 -6 -30","#b5541c",3.5,"o"],
  ["M-10 -10 Q-20 -40 0 -54 Q16 -60 22 -46 Q30 -20 16 0 L-6 0 Q-12 -2 -10 -10 Z","#b5541c",3.5,"o"],["M8 -54 Q2 -76 20 -78 Q36 -76 34 -62 Q42 -56 34 -52 Q22 -48 8 -54 Z","#b5541c",3.5,"o"],
  ["M16 -76 L14 -90 L22 -78 M24 -78 L28 -90 L30 -76 M14 -40 L28 -34","#b5541c",3],[dotsP([[26,-66]]),"k",6]],
 woodpecker:[["M0 0 Q-16 -20 -10 -50 Q-4 -70 12 -70 Q26 -68 24 -50 Q22 -20 8 4 L6 22 L-4 22 Z","k",3.5,"k"],["M2 -70 Q8 -86 22 -76 Q14 -68 2 -70 Z","r",3,"r"],["M24 -66 L46 -62 L24 -58","k",3.5],
  ["M-4 -46 Q6 -28 0 -8 M10 -30 L22 -26 M10 -18 L22 -14","k",3],[dotsP([[-4,-36],[2,-24],[-2,-14]]),"#ffffff",4],[dotsP([[16,-66]]),"#ffffff",5],["M-2 4 Q4 14 6 22","r",3]],
 perch:[["M-74 0 Q-30 -46 34 -36 Q66 -26 84 0 Q66 26 34 32 Q-30 40 -74 0 Z","g",3.5,"g"],["M-72 0 L-106 -26 Q-96 0 -106 26 Z","g",3.5],
  ["M-34 -34 L-28 -58 L-18 -40 L-10 -62 L-2 -42 L6 -58 L14 -38","g",3.5],["M-44 -22 L-48 22 M-18 -32 L-22 32 M8 -34 L4 34 M32 -32 L30 28","k",4],["M48 -24 Q40 0 48 22","g",3],
  ["M-4 34 L-12 54 L12 36 M-50 22 L-58 38 L-38 28","r",3.5],[ellP(62,-8,6,6),"k",3],[dotsP([[62,-8]]),"k",5]],
 pike:[["M-100 0 Q-60 -22 40 -18 Q92 -14 122 -4 L132 0 L122 4 Q92 14 40 18 Q-60 22 -100 0 Z","#2f6b45",3.5,"g"],["M-98 0 L-128 -22 Q-118 0 -128 22 Z","#2f6b45",3.5],
  ["M-70 -12 L-58 -32 L-44 -16 M-70 12 L-58 32 L-44 16","#2f6b45",3.5],[ellP(-40,-6,6,3)+ellP(-10,4,6,3)+ellP(20,-6,6,3)+ellP(-60,6,5,3),"#c9a227",3],[ellP(92,-6,5,5),"k",3],["M100 3 L130 1","k",3]],
 lily:[["M-70 0 Q-70 -12 -30 -14 Q0 -14 0 -4 L-28 0 L0 4 Q0 14 -30 14 Q-70 14 -70 0 Z","g",3,"g"],
  ["M8 -2 Q2 -30 20 -38 Q38 -30 32 -2 M0 0 Q-14 -18 6 -26 M40 0 Q54 -18 34 -26 M2 0 L38 0","p",3.5],[dotsP([[20,-12]]),"o",8],["M-34 14 Q-28 60 -36 110","g",3]],
 frog:[["M-44 -6 Q-50 -40 -20 -52 Q10 -60 34 -48 Q50 -40 46 -20 Q40 0 10 0 L-30 0 Q-44 0 -44 -6 Z","g",3.5,"g"],[ellP(18,-56,10,10)+ellP(38,-50,9,9),"g",3.5],[dotsP([[20,-56],[40,-50]]),"k",6],
  ["M28 -28 Q42 -30 48 -36","k",3],["M-36 -10 Q-56 -30 -30 -36 Q-8 -32 -16 -10 L-30 0 L-52 2 M24 -6 L30 0 L42 0","g",3.5]],
 spawn:[[[[-24,-8],[-6,-14],[12,-8],[30,-14],[-16,8],[2,4],[20,8],[-32,10],[8,22],[-8,24],[26,24]].map(([x,y])=>ellP(x,y,9,9)).join(""),"#5a7fb8",2.5],[dotsP([[-24,-8],[-6,-14],[12,-8],[30,-14],[-16,8],[2,4],[20,8],[-32,10],[8,22],[-8,24],[26,24]]),"k",6]],
 tadpole:[[ellP(10,0,16,12),"k",3.5,"k"],["M-4 -4 Q-24 -16 -44 -2 Q-24 4 -4 6","k",3],[dotsP([[18,-3]]),"#ffffff",4]],
 tadlegs:[[ellP(10,0,18,13),"g",3.5,"g"],["M-6 -4 Q-20 -10 -32 -2 Q-20 2 -6 6 M-2 10 L-10 24 L-2 26 M14 12 L18 24 L26 24","g",3],[dotsP([[20,-3]]),"k",5]],
 butterfly:[["M0 -10 Q-30 -54 -56 -38 Q-64 -10 -30 0 Q-14 2 0 -2 Z M0 -10 Q30 -54 56 -38 Q64 -10 30 0 Q14 2 0 -2 Z","o",3.5,"o"],
  ["M0 2 Q-30 6 -42 22 Q-40 44 -16 36 Q-4 28 0 8 Z M0 2 Q30 6 42 22 Q40 44 16 36 Q4 28 0 8 Z","o",3.5,"o"],["M0 -24 L0 28","k",5],["M0 -24 Q-6 -40 -14 -46 M0 -24 Q6 -40 14 -46","k",2.5],[dotsP([[-34,-30],[34,-30],[-22,-14],[22,-14]]),"k",6]],
 larva:[[[-48,-36,-24,-12,0,12,24].map((x,i)=>ellP(x,-10-(i%2)*4,9,10)).join(""),"g",3,"g"],[ellP(40,-14,12,12),"g",3.5,"g"],[dotsP([[44,-16]]),"k",5],["M-52 0 L48 0","#7d8ca6",2]],
 pupa:[["M0 -50 L0 -42 Q-14 -28 -12 -6 Q-8 16 0 22 Q8 16 12 -6 Q14 -28 0 -42 M-10 -20 Q0 -16 10 -20 M-11 -6 Q0 -2 11 -6 M-8 8 Q0 12 8 8",BRN,3.5,"o"],["M-30 -50 L30 -50",BRN,4]],
 eggs:[[ellP(-12,-6,6,8)+ellP(4,-6,6,8)+ellP(-4,-20,6,8),"#5a7fb8",3,"b"]],
 leaf:[["M-60 0 Q-20 -40 60 -6 Q10 34 -60 0 Z","g",3.5,"g"],["M-60 0 Q0 -6 56 -6","g",2.5]],
 worm:[["M-50 0 Q-38 -16 -24 -4 Q-10 10 4 -4 Q18 -18 32 -6 Q42 2 50 -4","p",9],["M-30 -10 L-26 -2 M-4 2 L0 -6 M22 -12 L24 -4","#ffffff",2]],
 seed:[["M-14 0 Q-14 -14 0 -12 Q16 -10 14 2 Q12 14 -2 12 Q-14 10 -14 0 Z",BRN,3,"o"]],
 sprout:[["M0 0 Q-2 -20 0 -36","g",3.5],["M0 -30 Q-24 -46 -30 -30 Q-14 -22 0 -30 Z M0 -34 Q22 -52 30 -36 Q14 -26 0 -34 Z","g",3,"g"],["M0 0 L-6 14 M0 0 L6 16 M0 0 L0 18",BRN,2.5]],
 bacteria:[[ellP(-18,0,12,6)+ellP(6,-14,6,6)+ellP(18,6,10,5)+ellP(-2,14,5,5),"v",3,"v"]],
 bottle:[["M-12 0 L-12 -42 Q-12 -52 -5 -58 L-5 -68 L5 -68 L5 -58 Q12 -52 12 -42 L12 0 Z M-12 -30 L12 -30 M-12 -16 L12 -16","b",3],["M-6 -72 L6 -72","b",4]],
 bag:[["M-24 0 Q-32 -26 -26 -50 L-16 -50 Q-18 -70 -6 -52 L6 -52 Q18 -70 16 -50 L26 -50 Q32 -26 24 0 Z M-14 -34 L-6 -22 M8 -30 L14 -16","#7d8ca6",3]],
 stump:[["M-26 0 L-22 -34 M26 0 L22 -34",BRN,4],[ellP(0,-34,22,8),BRN,3.5,"o"],["M-36 0 Q-30 -4 -26 0 M26 0 Q32 -4 38 0",BRN,3]],
 bee:[[ellP(0,0,16,11),"o",3,"o"],["M-6 -10 L-6 10 M4 -10 L4 10","k",3],[ellP(-4,-18,8,10)+ellP(8,-16,7,9),"#5a7fb8",2.5],[dotsP([[12,-2]]),"k",5]],
 bear:[["M-70 -40 Q-72 -88 -20 -92 Q30 -96 54 -76 Q66 -60 60 -40 Q56 -24 40 -24 L-56 -24 Q-74 -26 -70 -40 Z",BRN,3.5,"o"],
  ["M50 -78 Q60 -98 82 -94 Q96 -90 98 -78 L112 -72 Q114 -62 102 -62 Q90 -60 76 -62 Q60 -62 52 -70",BRN,3.5,"o"],[ellP(66,-94,7,7),BRN,3.5],
  ["M-58 -26 L-60 0 L-46 0 L-42 -26 M-30 -24 L-30 0 L-16 0 L-14 -24 M24 -26 L22 0 L36 0 L38 -26 M46 -30 L50 0 L62 0 L58 -36",BRN,4],[dotsP([[86,-82],[112,-70]]),"k",6]],
};
/* draw a picture from NAT: hatches first, then the lines on top */
const art=(k,x,y,s=1,fl=1)=>{const P=NAT[k],w=Math.max(.7,Math.min(1.25,s));
  return[...P.filter(q=>q[3]).map(q=>A.hatch(tfx(q[0],x,y,s,fl),q[3])),...P.map(q=>A.p(tfx(q[0],x,y,s,fl),q[1],q[2]*w))]};
/* a plant with root, stem, two leaves and a flower; (x, y) = where the stem meets the ground */
const PLANT={root:"M0 0 L0 34 M0 10 L-24 34 M0 16 L22 40 M0 26 L-10 50 M-14 24 L-28 26 M12 30 L26 30",stem:"M0 0 Q6 -60 0 -126",
  leafL:"M2 -46 Q-36 -74 -66 -50 Q-34 -26 2 -46 Z",leafR:"M3 -82 Q42 -108 70 -86 Q40 -62 3 -82 Z",
  flower:[0,1,2,3,4,5].map(i=>{const a=i*Math.PI/3;return ellP(Math.cos(a)*26,-150+Math.sin(a)*26,15,15)}).join(""),mid:ellP(0,-150,13,13)};
const plant=(x,y,s=1,fc="p",parts="root stem leaves flower")=>{const T=d=>tfx(d,x,y,s),w=Math.max(.7,Math.min(1.25,s)),o=[];
  if(parts.includes("root"))o.push(A.p(T(PLANT.root),BRN,3.5*w));
  if(parts.includes("stem"))o.push(A.p(T(PLANT.stem),"g",4.5*w));
  if(parts.includes("leaves"))o.push(A.hatch(T(PLANT.leafL+PLANT.leafR),"g"),A.p(T(PLANT.leafL+PLANT.leafR),"g",3.5*w));
  if(parts.includes("flower"))o.push(A.hatch(T(PLANT.flower),fc),A.p(T(PLANT.flower),fc,3.5*w),A.hatch(T(PLANT.mid),"o"),A.p(T(PLANT.mid),"o",3.5*w));
  return o};
/* the ground: a line with a bit of soil under it */
const soil=(x1,x2,y,c=BRN)=>[A.p(R.line(x1,y,x2,y,.5),c,4)];
/* a name under or beside a picture */
const ntag=(s,x,y,c="k",z=28,an="middle")=>A.tx(s,x,y,z,c,an);
/* a cycle: pictures placed round a ring with arrows between, and dots that keep going round */
const ringPts=(cx,cy,rx,ry,n,a0=-90)=>[...Array(n)].map((_,i)=>{const a=(a0+360*i/n)*Math.PI/180;return[cx+Math.cos(a)*rx,cy+Math.sin(a)*ry]});
const ringArrows=(cx,cy,rx,ry,n,c="k",gap=26,a0=-90)=>[...Array(n)].map((_,i)=>{const a=(a0+360*(i+.5)/n)*Math.PI/180,da=gap/Math.max(rx,ry);
  const p=t=>[cx+Math.cos(t)*rx,cy+Math.sin(t)*ry],[x1,y1]=p(a-da),[x2,y2]=p(a+da);return A.arrow(x1,y1,x2,y2,c,-gap*.18)});
const ringFlow=(cx,cy,rx,ry,c="o",n=10,dur=8)=>A.flow(`M${cx} ${cy-ry} Q${cx+rx*1.33} ${cy-ry} ${cx+rx} ${cy} Q${cx+rx} ${cy+ry*1.33} ${cx} ${cy+ry} Q${cx-rx*1.33} ${cy+ry} ${cx-rx} ${cy} Q${cx-rx} ${cy-ry*1.33} ${cx} ${cy-ry}`,c,n,dur,5);

export {tf,NOB,bp,bh,bx,by,at,ellP,OUT,HEAD,body,ORG,organ,label,BONE,JOINT,skeleton,joints,heartBig,SENSE,ttl,note,blist,qBoard,solNote,mcq,wq,pointAt,bankGen,cell,tfx,BRN,dotsP,NAT,art,PLANT,plant,soil,ntag,ringPts,ringArrows,ringFlow};
