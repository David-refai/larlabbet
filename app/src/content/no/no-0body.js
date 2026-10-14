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

export {tf,NOB,bp,bh,bx,by,at,ellP,OUT,HEAD,body,ORG,organ,label,BONE,JOINT,skeleton,joints,heartBig,SENSE,ttl,note,blist,qBoard,solNote,mcq,wq,pointAt,bankGen,cell};
