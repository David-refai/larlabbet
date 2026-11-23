import {A,LESSONS,R,rint,t3} from "../../legacy/core.js";
/* =====================================================================
   SNABBMATTE · GEOMETRI: perimeter, area of rectangles and squares,
   triangles / parallelograms / trapezoids, the circle (radius, diameter,
   circumference, area) and volume (box, cube, litres, cylinder), cheat sheet.
   Every board: the shape on the left, the working in a column on the right.
   ===================================================================== */
import {qMount,P,rowC,rowW} from "./q-0kit.js";
{
const S=(sv,en,ar)=>t3(sv,en,ar);
const ds=x=>String(+(+x).toFixed(4)).replace(".",",");          /* 2.5 -> "2,5" */
const PI=3.14,pi=x=>+(PI*x).toFixed(4);
const LT=(t,x,y,s,c="k",anc)=>Object.assign(A.tx(t,x,y,s,c,anc),{dur:200});
const hintT=(sv,en,ar)=>({say:S(sv,en,ar),draw:[]});
const CX=225,CY=275,CX2=255;                                             /* centre of the shape area (left) */

/* the working column on the right: rows of text ("6 · 4 = 24 cm²"), [text, colour, size] */
const col=(rows,y=120,gap=66,s=34,cx=600)=>rows.flatMap((r,i)=>{const [t,c,ss]=typeof r==="string"?[r,"k",s]:[r[0],r[1]||"k",r[2]||s];
  const it=P(t);let z=ss;while(rowW(it,z)>330&&z>16)z-=2;const out=rowC(it,cx,y+i*gap,z,c).acts;
  return c==="g"?[A.hl(cx-rowW(it,z)/2-12,y+i*gap-z*.98,rowW(it,z)+24,z*1.98),...out]:out});
const ask=(lines,unit)=>col([...lines.map(l=>[l,"b",32]),...(unit?[[`Svara i ${unit}`,"o",26]]:[])],130,62);

/* scale a w × h shape (in cm) into the box on the left */
const scale=(w,h,mw=300,mh=250)=>Math.min(mw/w,mh/h,70);
const poly=(pts,c="k",w=4.5)=>A.p(pts.map((p,i)=>{const q=pts[(i+1)%pts.length];return R.line(p[0],p[1],q[0],q[1],.15)}).join(""),c,w);
const fillP=(pts,c)=>A.hatch("M"+pts.map(p=>p.join(",")).join("L")+"Z",c);
const corner=(x,y,dx=1,dy=-1,c="k")=>A.p(`M${x+dx*16},${y}L${x+dx*16},${y+dy*16}L${x},${y+dy*16}`,c,2.5);   /* right-angle mark */
const dash=(x1,y1,x2,y2,c="o")=>A.p(R.dashed(x1,y1,x2,y2),c,3.5);

/* ---------- shapes ---------- */
function rectF(w,h,o={}){const k=scale(w,h),W=w*k,H=h*k,x=CX-W/2,y=CY-H/2,pts=[[x,y],[x+W,y],[x+W,y+H],[x,y+H]],c=o.c||"b";
  return[...(o.fill?[fillP(pts,c)]:[]),poly(pts,c),...(o.grid?gridIn(x,y,W,H,w,h):[]),
    ...(o.lw!==false?[LT(o.lw||`${ds(w)} cm`,CX,y+H+36,26,o.cw||"r")]:[]),...(o.lh!==false?[LT(o.lh||`${ds(h)} cm`,x-14,CY+9,26,o.ch||"v","end")]:[])]}
function gridIn(x,y,W,H,w,h){let g="";for(let i=1;i<w;i++)g+=R.line(x+W*i/w,y,x+W*i/w,y+H,.05);for(let j=1;j<h;j++)g+=R.line(x,y+H*j/h,x+W,y+H*j/h,.05);return[A.p(g,"#9fb4d6",1.8)]}
/* triangle: base b, height h; the top is ax of the way along the base (0 = right triangle) */
function triF(b,h,o={}){const ax=o.ax??.35,k=scale(b,h,250),W=b*k,H=h*k,x=CX2-W/2,y=CY-H/2,top=[x+W*ax,y],pts=[[x,y+H],[x+W,y+H],top],c=o.c||"g";
  return[...(o.fill?[fillP(pts,c)]:[]),poly(pts,c),...(ax?[dash(top[0],y,top[0],y+H)]:[]),corner(top[0],y+H,ax>.5?-1:1,-1),
    LT(o.lb||`${ds(b)} cm`,CX2,y+H+36,26,"r"),LT(ax?`h = ${o.lh||ds(h)+" cm"}`:o.lh||`${ds(h)} cm`,x-14,CY+9,26,ax?"o":"v","end")]}
function parF(b,h,o={}){const k=scale(b*1.3,h,250),W=b*k,H=h*k,s=W*.3,x=CX2-(W+s)/2,y=CY-H/2,pts=[[x+s,y],[x+W+s,y],[x+W,y+H],[x,y+H]],c=o.c||"v";
  return[...(o.fill?[fillP(pts,c)]:[]),poly(pts,c),dash(x+s,y,x+s,y+H),corner(x+s,y+H,1,-1),LT(`${ds(b)} cm`,x+W/2,y+H+36,26,"r"),LT(`h = ${ds(h)} cm`,x-6,CY+9,26,"o","end")]}
function trapF(a,b,h,o={}){const k=scale(b,h,250),W=b*k,H=h*k,A2=a*k,x=CX2-W/2,y=CY-H/2,x2=CX2-A2/2,pts=[[x2,y],[x2+A2,y],[x+W,y+H],[x,y+H]],c=o.c||"o";
  return[...(o.fill?[fillP(pts,c)]:[]),poly(pts,c),dash(x2,y,x2,y+H),corner(x2,y+H,1,-1),LT(`${ds(a)} cm`,CX2,y-16,26,"b"),LT(`${ds(b)} cm`,CX2,y+H+36,26,"r"),LT(`h = ${ds(h)} cm`,x-6,CY+9,26,"o","end")]}
/* circle: show "r" (a radius) or "d" (a diameter) with its length */
function circF(mode,val,o={}){const r=140,c=o.c||"b",out=[...(o.fill?[A.hatch(R.circ(CX,CY,r),c)]:[]),A.p(R.circ(CX,CY,r),c,4.5),A.p(R.circ(CX,CY,5),"k",5)];
  if(mode==="r")out.push(A.p(R.line(CX,CY,CX+r,CY,.1),"r",4.5),LT(`r = ${val}`,CX,CY+r+42,30,"r"));
  else if(mode==="d")out.push(A.p(R.line(CX-r,CY,CX+r,CY,.1),"v",4.5),LT(`d = ${val}`,CX,CY+r+42,30,"v"));
  else if(mode==="rd")out.push(A.p(R.line(CX-r,CY,CX+r,CY,.1),"v",4.5),A.p(R.line(CX,CY,CX,CY-r,.1),"r",4.5),LT("d",CX-r/2,CY+34,30,"v"),LT("r",CX+14,CY-r/2,30,"r","start"));
  return out}
/* a box (rätblock) in 2.5D: length l (front, wide), width b (depth), height h */
function boxF(l,b,h,o={}){const k=Math.min(240/(l+b*.5),220/(h+b*.5),55),W=l*k,H=h*k,D=b*k*.5,x=CX-(W+D)/2,y=CY-(H-D)/2,c=o.c||"b";
  const F=[[x,y],[x+W,y],[x+W,y+H],[x,y+H]],T=[[x,y],[x+D,y-D],[x+W+D,y-D],[x+W,y]],Sd=[[x+W,y],[x+W+D,y-D],[x+W+D,y+H-D],[x+W,y+H]];
  return[...(o.fill?[fillP(F,c),fillP(T,c),fillP(Sd,c)]:[]),poly(F,c),poly(T,c),poly(Sd,c),dash(x+D,y-D,x+D,y+H-D,"k"),dash(x+D,y+H-D,x,y+H,"k"),dash(x+D,y+H-D,x+W+D,y+H-D,"k"),
    LT(`${ds(l)} ${o.u||"cm"}`,x+W/2,y+H+36,26,"r"),LT(`${ds(h)} ${o.u||"cm"}`,x-14,y+H/2+9,26,"v","end"),LT(`${ds(b)} ${o.u||"cm"}`,x+W+D/2+16,y+H-D/2+16,26,"g","start")]}
function cylF(r,h,o={}){const R0=100,H=Math.max(70,Math.min(220,h/r*R0)),ry=28,x=CX,y=CY-H/2,c=o.c||"v";
  return[...(o.fill?[A.hatch(`M${x-R0},${y}L${x-R0},${y+H}A${R0},${ry} 0 0 0 ${x+R0},${y+H}L${x+R0},${y}Z`,c)]:[]),A.p(R.loop(x,y,R0,ry),c,4.5),A.p(R.line(x-R0,y,x-R0,y+H,.1)+R.line(x+R0,y,x+R0,y+H,.1),c,4.5),
    A.p(`M${x-R0},${y+H}A${R0},${ry} 0 0 0 ${x+R0},${y+H}`,c,4.5),dash(x-R0,y+H,x+R0,y+H,"k"),A.p(R.line(x,y,x+R0,y,.1),"r",4),A.p(R.circ(x,y,4),"k",4),
    LT(`r = ${ds(r)} cm`,x+R0/2,y-ry-12,26,"r"),LT(`h = ${ds(h)} cm`,x+R0+14,CY+9,26,"o","start")]}
/* L-shape: W × H with the top-right corner (W − a) × (H − b2) cut away; a = top length, b2 = right height */
function lF(W,Hh,a,b2,o={}){const k=scale(W,Hh),w=W*k,h=Hh*k,x=CX-w/2,y=CY-h/2,ax=x+a*k,cy=y+(Hh-b2)*k,c=o.c||"b";
  const pts=[[x,y],[ax,y],[ax,cy],[x+w,cy],[x+w,y+h],[x,y+h]];
  return[...(o.fill?[fillP(pts,c)]:[]),poly(pts,c),...(o.split?[dash(ax,cy,ax,y+h,"k")]:[]),LT(`${W} cm`,CX,y+h+36,26,"r"),LT(`${Hh} cm`,x-14,CY+9,26,"v","end"),
    LT(`${a} cm`,(x+ax)/2,y-14,26,"r"),LT(`${b2} cm`,x+w+14,(cy+y+h)/2+9,26,"v","start"),
    ...(o.split?[LT("A",(x+ax)/2,CY+12,30,"g"),LT("B",(ax+x+w)/2,(cy+y+h)/2+10,30,"g")]:[])]}

const B=(...a)=>[A.wipe(),...a.flat()];
const num=(ans,q,sol,hint,dec)=>({kind:"num",ans,dec:dec||!Number.isInteger(ans)||undefined,show:ds(ans),q,sol,hint});

/* ======================= drills ======================= */
const H_OM=hintT("Omkretsen är vägen runt hela figuren. Lägg ihop alla sidor.","The perimeter is the way round the whole shape. Add all the sides.","المحيط هو الطريق حول الشكل كله: اجمع كل الأضلاع.");
function gPer(n){
  if(n===0){const w=rint(3,9),h=rint(2,6),p=2*(w+h);return num(p,B(rectF(w,h),ask(["Rektangeln:","Vilken omkrets?"],"cm")),
    B(rectF(w,h),col([`${w} + ${h} + ${w} + ${h}`,`= 2 · (${w} + ${h})`,[`= ${p} cm`,"g"]],140,80)),H_OM)}
  if(n===1){const s=rint(3,9),p=4*s;return num(p,B(rectF(s,s,{lh:false}),ask(["En kvadrat har","sidan "+s+" cm.","Vilken omkrets?"],"cm")),
    B(rectF(s,s,{lh:false}),col(["4 lika sidor",`4 · ${s}`,[`= ${p} cm`,"g"]],140,80)),hintT("En kvadrat har fyra lika långa sidor.","A square has four sides of the same length.","للمربع أربعة أضلاع متساوية.")) }
  if(n===2){const a=rint(3,8),b=rint(3,8),c=rint(Math.abs(a-b)+2,a+b-1),p=a+b+c;
    const tri=()=>{const pts=[[90,400],[370,400],[160,160]];return[poly(pts,"g"),LT(`${a} cm`,230,440,26,"r"),LT(`${b} cm`,280,270,26,"b","start"),LT(`${c} cm`,110,280,26,"v","end")]};
    return num(p,B(tri(),ask(["Triangelns sidor.","Vilken omkrets?"],"cm")),B(tri(),col([`${a} + ${b} + ${c}`,[`= ${p} cm`,"g"]],170,90)),H_OM)}
  if(n===3){const s=rint(3,12),p=4*s;return num(s,B(rectF(s,s,{lw:"?",lh:false,cw:"o"}),ask(["Kvadratens omkrets","är "+p+" cm.","Hur lång är en sida?"],"cm")),
    B(rectF(s,s,{lw:`${s} cm`,lh:false,cw:"g"}),col(["4 lika sidor",`${p} / 4`,[`= ${s} cm`,"g"]],140,80)),hintT("Omkretsen är fyra sidor. Dela med 4.","The perimeter is four sides. Divide by 4.","المحيط أربعة أضلاع، فاقسم على 4."))}
  const w=rint(4,10),h=rint(2,w-1),p=2*(w+h);
  return num(h,B(rectF(w,h,{lh:"?",ch:"o"}),ask(["Omkretsen är "+p+" cm.","Hur lång är","den andra sidan?"],"cm")),
    B(rectF(w,h,{lh:`${h} cm`,ch:"g"}),col([`${p} / 2 = ${w+h}`,`${w+h} − ${w}`,[`= ${h} cm`,"g"]],140,80)),
    hintT("Halva omkretsen är en lång och en kort sida. Ta bort den sida du vet.","Half the perimeter is one long and one short side. Take away the side you know.","نصف المحيط ضلع طويل وضلع قصير، فاطرح الضلع المعروف."))}

const H_AR=hintT("Arean är hur många rutor som får plats inuti. Rektangel: längd gånger bredd.","The area is how many squares fit inside. Rectangle: length times width.","المساحة هي عدد المربعات التي تتسع داخل الشكل. المستطيل: الطول × العرض.");
function gArea(n){
  if(n===0){const w=rint(3,8),h=rint(2,5),a=w*h;return num(a,B(rectF(w,h,{fill:1,grid:1}),ask(["Hur stor är arean?"],"cm²")),
    B(rectF(w,h,{fill:1,grid:1}),col([`${w} · ${h}`,[`= ${a} cm²`,"g"]],170,90)),H_AR)}
  if(n===1){const s=rint(3,12),a=s*s;return num(a,B(rectF(s,s,{fill:1,lh:false}),ask(["En kvadrat har","sidan "+s+" cm.","Vilken area?"],"cm²")),
    B(rectF(s,s,{fill:1,lh:false}),col([`${s} · ${s} = ${s}^2`,[`= ${a} cm²`,"g"]],170,90)),hintT("Kvadrat: sidan gånger sidan.","Square: side times side.","المربع: الضلع × الضلع."))}
  if(n===2){const w=rint(4,12),h=rint(2,9),a=w*h;return num(h,B(rectF(w,h,{fill:1,lh:"?",ch:"o"}),ask(["Arean är "+a+" cm².","Hur bred är","rektangeln?"],"cm")),
    B(rectF(w,h,{fill:1,lh:`${h} cm`,ch:"g"}),col([`${a} / ${w}`,[`= ${h} cm`,"g"]],170,90)),hintT("Area delat med längden ger bredden.","Area divided by the length gives the width.","المساحة ÷ الطول = العرض."))}
  if(n===3){const W=rint(6,9),Hh=rint(5,7),a=rint(2,W-3),b2=rint(2,Hh-2),A1=a*Hh,A2=(W-a)*b2;
    return num(A1+A2,B(lF(W,Hh,a,b2,{fill:1}),ask(["Hur stor är","hela arean?"],"cm²")),
      B(lF(W,Hh,a,b2,{fill:1,split:1}),col([`A: ${a} · ${Hh} = ${A1}`,`B: ${W-a} · ${b2} = ${A2}`,[`${A1} + ${A2} = ${A1+A2} cm²`,"g"]],130,80,30)),
      hintT("Dela figuren i två rektanglar. Räkna båda och lägg ihop.","Split the shape into two rectangles. Work out both and add them.","قسّم الشكل إلى مستطيلين، واحسب كلًّا منهما ثم اجمعهما."))}
  const s=rint(4,12),a=s*s;return num(s,B(rectF(s,s,{fill:1,lw:"?",lh:false,cw:"o"}),ask(["Kvadratens area","är "+a+" cm².","Hur lång är sidan?"],"cm")),
    B(rectF(s,s,{fill:1,lw:`${s} cm`,lh:false,cw:"g"}),col([`? · ? = ${a}`,`√{${a}} = ${s}`,[`sidan = ${s} cm`,"g"]],140,80)),
    hintT("Vilket tal gånger sig självt blir arean? Ta roten ur.","Which number times itself makes the area? Take the square root.","أي عدد مضروب في نفسه يعطي المساحة؟ خذ الجذر التربيعي."))}

const H_TRI=hintT("Triangel: basen gånger höjden, delat med 2. Höjden står vinkelrätt mot basen.","Triangle: base times height, divided by 2. The height is at a right angle to the base.","المثلث: القاعدة × الارتفاع ÷ 2، والارتفاع عمودي على القاعدة.");
function gTri(n){
  if(n===0){let b,h;do{b=rint(3,10);h=rint(2,8)}while(b*h%2);const a=b*h/2;
    return num(a,B(triF(b,h,{fill:1}),ask(["Triangelns area?"],"cm²")),B(triF(b,h,{fill:1}),col([`${b} · ${h} / 2`,`= ${b*h} / 2`,[`= ${a} cm²`,"g"]],140,80)),H_TRI)}
  if(n===1){const b=rint(3,9),h=rint(2,7),a=b*h;return num(a,B(parF(b,h,{fill:1}),ask(["Parallellogrammens","area?"],"cm²")),
    B(parF(b,h,{fill:1}),col([`basen · höjden`,`${b} · ${h}`,[`= ${a} cm²`,"g"]],140,80)),
    hintT("Parallellogram: basen gånger höjden, som en rektangel. Använd höjden, inte den sneda sidan.","Parallelogram: base times height, like a rectangle. Use the height, not the slanted side.","متوازي الأضلاع: القاعدة × الارتفاع مثل المستطيل. استخدم الارتفاع لا الضلع المائل."))}
  if(n===2){let b,h;do{b=rint(3,10);h=rint(3,9)}while(b*h%2);const a=b*h/2;
    return num(a,B(triF(b,h,{ax:0,fill:1}),ask(["En rätvinklig triangel.","Vilken area?"],"cm²")),B(triF(b,h,{ax:0,fill:1}),col(["halva rektangeln",`${b} · ${h} / 2`,[`= ${a} cm²`,"g"]],140,80)),H_TRI)}
  if(n===3){let a,b,h;do{a=rint(2,6);b=rint(a+2,11);h=rint(2,7)}while((a+b)*h%2);const ar=(a+b)*h/2;
    return num(ar,B(trapF(a,b,h,{fill:1}),ask(["Parallelltrapetsens","area?"],"cm²")),
      B(trapF(a,b,h,{fill:1}),col([`(${a} + ${b}) · ${h} / 2`,`= ${a+b} · ${h} / 2`,[`= ${ar} cm²`,"g"]],140,80,30)),
      hintT("Lägg ihop de två parallella sidorna, gånger höjden, delat med 2.","Add the two parallel sides, times the height, divided by 2.","اجمع الضلعين المتوازيين، واضرب في الارتفاع، ثم اقسم على 2."))}
  const b=rint(3,10),h=rint(2,9),a=b*h/2;
  return num(h,B(triF(b,h,{fill:1,lh:"?"}),ask(["Arean är "+ds(a)+" cm².","Hur hög är","triangeln?"],"cm")),
    B(triF(b,h,{fill:1,lh:`${h} cm`}),col([`${ds(a)} · 2 = ${b*h}`,`${b*h} / ${b}`,[`= ${h} cm`,"g"]],140,80)),
    hintT("Gör tvärtom: gånger 2, sedan delat med basen.","Work backwards: times 2, then divided by the base.","اعمل بالعكس: اضرب في 2 ثم اقسم على القاعدة."))}

const H_C=hintT("Omkrets: pi gånger diametern. Area: pi gånger radien gånger radien. Pi är ungefär 3,14.","Circumference: pi times the diameter. Area: pi times the radius times the radius. Pi is about 3.14.","المحيط: π × القطر. المساحة: π × نصف القطر × نصف القطر. وπ تساوي تقريبًا 3,14.");
function gCirc(n){
  if(n===0){if(rint(0,1)){const r=rint(2,15);return num(2*r,B(circF("r",`${r} cm`),ask(["Radien är "+r+" cm.","Hur lång är","diametern?"],"cm")),
      B(circF("rd"),col(["d = 2 · r",`2 · ${r}`,[`= ${2*r} cm`,"g"]],140,80)),hintT("Diametern är två radier.","The diameter is two radii.","القطر يساوي نصفي قطر."))}
    const d=2*rint(2,15);return num(d/2,B(circF("d",`${d} cm`),ask(["Diametern är "+d+" cm.","Hur lång är","radien?"],"cm")),
      B(circF("rd"),col(["r = d / 2",`${d} / 2`,[`= ${d/2} cm`,"g"]],140,80)),hintT("Radien är halva diametern.","The radius is half the diameter.","نصف القطر نصف القطر الكامل."))}
  if(n===1){const d=rint(2,10),c=pi(d);return num(c,B(circF("d",`${d} cm`),ask(["Vilken omkrets","har cirkeln?","(π ≈ 3,14)"],"cm")),
    B(circF("d",`${d} cm`),col(["O = π · d",`3,14 · ${d}`,[`≈ ${ds(c)} cm`,"g"]],140,80)),H_C,true)}
  if(n===2){const r=rint(2,10),c=pi(2*r);return num(c,B(circF("r",`${r} cm`),ask(["Vilken omkrets","har cirkeln?","(π ≈ 3,14)"],"cm")),
    B(circF("r",`${r} cm`),col([`d = 2 · ${r} = ${2*r}`,`3,14 · ${2*r}`,[`≈ ${ds(c)} cm`,"g"]],140,80)),H_C,true)}
  if(n===3){const r=rint(2,10),a=pi(r*r);return num(a,B(circF("r",`${r} cm`,{fill:1}),ask(["Vilken area","har cirkeln?","(π ≈ 3,14)"],"cm²")),
    B(circF("r",`${r} cm`,{fill:1}),col(["A = π · r^2",`3,14 · ${r}^2 = 3,14 · ${r*r}`,[`≈ ${ds(a)} cm²`,"g"]],140,80,30)),H_C,true)}
  const d=2*rint(2,10),r=d/2,a=pi(r*r);return num(a,B(circF("d",`${d} cm`,{fill:1}),ask(["Vilken area","har cirkeln?","(π ≈ 3,14)"],"cm²")),
    B(circF("d",`${d} cm`,{fill:1}),col([`r = ${d} / 2 = ${r}`,`3,14 · ${r}^2 = 3,14 · ${r*r}`,[`≈ ${ds(a)} cm²`,"g"]],140,80,30)),
    hintT("Akta dig: arean behöver radien. Dela diametern med 2 först.","Careful: the area needs the radius. Divide the diameter by 2 first.","انتبه: المساحة تحتاج نصف القطر، فاقسم القطر على 2 أولًا."),true)}

const H_V=hintT("Volym: längd gånger bredd gånger höjd. Svaret får kubikenheter, till exempel cm³.","Volume: length times width times height. The answer is in cubic units, for example cm³.","الحجم: الطول × العرض × الارتفاع، والوحدة مكعبة مثل cm³.");
function gVol(n){
  if(n===0){const l=rint(3,8),b=rint(2,5),h=rint(2,6),v=l*b*h;return num(v,B(boxF(l,b,h,{fill:1}),ask(["Rätblockets volym?"],"cm³")),
    B(boxF(l,b,h,{fill:1}),col([`${l} · ${b} · ${h}`,[`= ${v} cm³`,"g"]],170,90)),H_V)}
  if(n===1){const s=rint(2,10),v=s**3;return num(v,B(boxF(s,s,s,{fill:1,c:"g"}),ask(["En kub har","sidan "+s+" cm.","Vilken volym?"],"cm³")),
    B(boxF(s,s,s,{fill:1,c:"g"}),col([`${s} · ${s} · ${s} = ${s}^3`,[`= ${v} cm³`,"g"]],170,90)),hintT("Kub: sidan gånger sidan gånger sidan.","Cube: side times side times side.","المكعب: الضلع × الضلع × الضلع."))}
  if(n===2){const l=rint(4,8),b=rint(2,4),h=rint(3,5),v=l*b*h;return num(v,B(boxF(l,b,h,{fill:1,u:"dm"}),ask(["Ett akvarium.","Hur många liter","rymmer det?"],"liter")),
    B(boxF(l,b,h,{fill:1,u:"dm"}),col([`${l} · ${b} · ${h} = ${v} dm³`,"1 dm³ = 1 liter",[`= ${v} liter`,"g"]],140,80,30)),
    hintT("Räkna volymen i dm³. En kubikdecimeter är en liter.","Work out the volume in dm³. One cubic decimetre is one litre.","احسب الحجم بـ dm³، والديسيمتر المكعب لتر واحد."))}
  if(n===3){const l=rint(3,8),b=rint(2,5),h=rint(2,6),v=l*b*h;return num(h,B(boxF(l,b,h,{fill:1}),ask(["Volymen är "+v+" cm³.","Hur hög är lådan?"],"cm")),
    B(boxF(l,b,h,{fill:1}),col([`bottnen: ${l} · ${b} = ${l*b}`,`${v} / ${l*b}`,[`= ${h} cm`,"g"]],140,80,30)),
    hintT("Räkna bottenytan först. Volymen delat med bottenytan ger höjden.","Work out the base area first. The volume divided by the base area gives the height.","احسب مساحة القاعدة أولًا، ثم اقسم الحجم عليها لتحصل على الارتفاع."))}
  const r=rint(1,5),h=rint(2,10),v=pi(r*r*h);
  return num(v,B(cylF(r,h,{fill:1}),ask(["Cylinderns volym?","(π ≈ 3,14)"],"cm³")),
    B(cylF(r,h,{fill:1}),col([`botten: 3,14 · ${r}^2 = ${ds(pi(r*r))}`,`${ds(pi(r*r))} · ${h}`,[`≈ ${ds(v)} cm³`,"g"]],140,80,28)),
    hintT("Cylinder: bottenytan (en cirkel) gånger höjden.","Cylinder: the base area (a circle) times the height.","الأسطوانة: مساحة القاعدة (دائرة) × الارتفاع."),true)}

/* ======================= the boards ======================= */
const steps=[],parts=[];const part=(icon,name,list)=>{parts.push({icon,name,at:steps.length});steps.push(...list)};
const st=(sv,en,ar,draw)=>({say:S(sv,en,ar),draw});

part("📏",S("Omkrets","Perimeter","المحيط"),[
 st("Omkretsen är hur långt det är runt en figur, som ett staket runt en trädgård. Lägg ihop alla sidor. Svaret är en längd, till exempel cm eller m.",
   "The perimeter is how far it is around a shape, like a fence round a garden. Add all the sides. The answer is a length, for example cm or m.",
   "المحيط هو طول الطريق حول الشكل، مثل سياج حول حديقة. اجمع كل الأضلاع، والجواب طول مثل cm أو m.",
   ()=>B(rectF(6,4),A.arrow(CX-105,CY-110,CX+90,CY-110,"o"),col([["Omkrets","b",42],"= vägen runt","lägg ihop alla sidor",["6 + 4 + 6 + 4 = 20 cm","g"]],120,80,32))),
 st("Exempel 1: en rektangel är 7 cm lång och 3 cm bred. Två långa och två korta sidor: 2 gånger 7 plus 3, alltså 20 cm.",
   "Example 1: a rectangle is 7 cm long and 3 cm wide. Two long and two short sides: 2 times 7 plus 3, so 20 cm.",
   "مثال 1: مستطيل طوله 7 cm وعرضه 3 cm. ضلعان طويلان وضلعان قصيران: 2 × (7 + 3) = 20 cm.",
   ()=>B(rectF(7,3),col(["7 + 3 + 7 + 3","= 2 · (7 + 3)",["= 20 cm","g"]],150,80))),
 st("Exempel 2: en kvadrat med sidan 5 cm har fyra lika sidor. 4 gånger 5 är 20 cm.",
   "Example 2: a square with side 5 cm has four equal sides. 4 times 5 is 20 cm.",
   "مثال 2: مربع ضلعه 5 cm له أربعة أضلاع متساوية: 4 × 5 = 20 cm.",
   ()=>B(rectF(5,5,{lh:false,c:"g"}),col(["kvadrat: 4 lika sidor","4 · 5",["= 20 cm","g"]],150,80))),
 st("Exempel 3: vet du omkretsen kan du räkna baklänges. Omkretsen är 26 cm och ena sidan 8 cm. Halva omkretsen är 13. 13 minus 8 är 5 cm.",
   "Example 3: if you know the perimeter, you can work backwards. The perimeter is 26 cm and one side is 8 cm. Half the perimeter is 13. 13 minus 8 is 5 cm.",
   "مثال 3: إذا عرفت المحيط يمكنك الحساب بالعكس. المحيط 26 cm وأحد الأضلاع 8 cm. نصف المحيط 13، و13 − 8 = 5 cm.",
   ()=>B(rectF(8,5,{lh:"?",ch:"o"}),col(["omkrets 26 cm","26 / 2 = 13","13 − 8",["= 5 cm","g"]],130,76))),
 {drill:{gen:gPer,n:5,intro:S("Din tur! Räkna omkretsen.","Your turn! Work out the perimeter.","دورك! احسب المحيط.")}},
]);
part("⬛",S("Area: rektangel och kvadrat","Area: rectangle and square","المساحة: المستطيل والمربع"),[
 st("Arean är hur stor ytan är inuti figuren: hur många rutor på en centimeter gånger en centimeter som får plats. En sådan ruta är en kvadratcentimeter, cm². Rektangel: längden gånger bredden.",
   "The area is how big the surface inside the shape is: how many squares of one centimetre by one centimetre fit. One such square is a square centimetre, cm². Rectangle: length times width.",
   "المساحة هي حجم السطح داخل الشكل: كم مربعًا طوله 1 cm وعرضه 1 cm يتسع داخله. هذا المربع يسمى سنتيمترًا مربعًا cm². المستطيل: الطول × العرض.",
   ()=>B(rectF(5,3,{fill:1,grid:1}),col([["Area","b",42],"= rutorna inuti","längd · bredd",["5 · 3 = 15 cm²","g"]],120,80,32))),
 st("Exempel 1: ett golv är 6 meter långt och 4 meter brett. Arean är 6 gånger 4, alltså 24 kvadratmeter.",
   "Example 1: a floor is 6 metres long and 4 metres wide. The area is 6 times 4, so 24 square metres.",
   "مثال 1: أرضية طولها 6 m وعرضها 4 m. المساحة 6 × 4 = 24 m².",
   ()=>B(rectF(6,4,{fill:1,lw:"6 m",lh:"4 m"}),col(["6 · 4",["= 24 m²","g"],["m · m = m²","o",26]],150,90))),
 st("Exempel 2: en kvadrat med sidan 7 cm. Sidan gånger sidan: 7 gånger 7 är 49 kvadratcentimeter.",
   "Example 2: a square with side 7 cm. Side times side: 7 times 7 is 49 square centimetres.",
   "مثال 2: مربع ضلعه 7 cm: الضلع × الضلع = 7 × 7 = 49 cm².",
   ()=>B(rectF(7,7,{fill:1,lh:false,c:"g"}),col(["7 · 7 = 7^2",["= 49 cm²","g"]],170,90))),
 st("Exempel 3: en L-formad figur. Dela den i två rektanglar, A och B. Räkna båda och lägg ihop.",
   "Example 3: an L-shaped figure. Split it into two rectangles, A and B. Work out both and add them.",
   "مثال 3: شكل على هيئة حرف L. قسّمه إلى مستطيلين A وB، واحسب كلًّا منهما ثم اجمعهما.",
   ()=>B(lF(8,6,3,3,{fill:1,split:1}),col(["A: 3 · 6 = 18","B: 5 · 3 = 15",["18 + 15 = 33 cm²","g"]],140,80,30))),
 {drill:{gen:gArea,n:5,intro:S("Din tur! Räkna arean.","Your turn! Work out the area.","دورك! احسب المساحة.")}},
]);
part("🔺",S("Triangel och fyrhörningar","Triangles and quadrilaterals","المثلث والأشكال الرباعية"),[
 st("En triangel är halva rektangeln. Därför är arean basen gånger höjden, delat med 2. Höjden är den streckade linjen, vinkelrätt mot basen.",
   "A triangle is half of a rectangle. So the area is base times height, divided by 2. The height is the dashed line, at a right angle to the base.",
   "المثلث نصف مستطيل، لذلك مساحته القاعدة × الارتفاع ÷ 2. والارتفاع هو الخط المتقطع العمودي على القاعدة.",
   ()=>{const k=scale(6,4,250),W=6*k,H=4*k,x=CX2-W/2,y=CY-H/2;return B(A.p(R.rect(x,y,W,H,.15),"#9aa6b8",3),triF(6,4,{fill:1}),col([["Triangel","g",42],"= halva rektangeln",["b · h / 2","g"]],130,80,32))}),
 st("Exempel 1: basen är 8 cm och höjden 5 cm. 8 gånger 5 är 40, delat med 2 blir 20 kvadratcentimeter.",
   "Example 1: the base is 8 cm and the height 5 cm. 8 times 5 is 40, divided by 2 is 20 square centimetres.",
   "مثال 1: القاعدة 8 cm والارتفاع 5 cm: 8 × 5 = 40، ثم ÷ 2 = 20 cm².",
   ()=>B(triF(8,5,{fill:1}),col(["8 · 5 / 2","= 40 / 2",["= 20 cm²","g"]],150,80))),
 st("Exempel 2: en parallellogram är en sned rektangel. Klipp av triangeln på ena sidan och flytta den, så blir det en rektangel. Arean är basen gånger höjden: 6 gånger 4 är 24.",
   "Example 2: a parallelogram is a slanted rectangle. Cut off the triangle on one side and move it, and it becomes a rectangle. The area is base times height: 6 times 4 is 24.",
   "مثال 2: متوازي الأضلاع مستطيل مائل. اقطع المثلث من أحد جانبيه وانقله فيصبح مستطيلًا. المساحة القاعدة × الارتفاع: 6 × 4 = 24.",
   ()=>B(parF(6,4,{fill:1}),col(["b · h","6 · 4",["= 24 cm²","g"]],150,80))),
 st("Exempel 3: en parallelltrapets har två parallella sidor, 4 och 8 cm. Lägg ihop dem, gånger höjden 5, delat med 2. Det blir 30 kvadratcentimeter.",
   "Example 3: a trapezoid has two parallel sides, 4 and 8 cm. Add them, times the height 5, divided by 2. That makes 30 square centimetres.",
   "مثال 3: شبه المنحرف له ضلعان متوازيان 4 و8 cm. اجمعهما واضرب في الارتفاع 5 ثم اقسم على 2: النتيجة 30 cm².",
   ()=>B(trapF(4,8,5,{fill:1}),col(["(a + b) · h / 2","(4 + 8) · 5 / 2","= 60 / 2",["= 30 cm²","g"]],120,76,30))),
 {drill:{gen:gTri,n:5,intro:S("Din tur! Trianglar och fyrhörningar.","Your turn! Triangles and quadrilaterals.","دورك! المثلثات والأشكال الرباعية.")}},
]);
part("⭕",S("Cirkeln","The circle","الدائرة"),[
 st("Radien går från mitten till kanten. Diametern går tvärs över, genom mitten, och är två radier. Talet pi, ungefär 3,14, visar hur många gånger diametern får plats runt cirkeln.",
   "The radius goes from the centre to the edge. The diameter goes right across, through the centre, and is two radii. The number pi, about 3.14, shows how many times the diameter fits round the circle.",
   "نصف القطر يمتد من المركز إلى الحافة، والقطر يعبر الدائرة مرورًا بالمركز ويساوي نصفي قطر. والعدد π، أي 3,14 تقريبًا، يبيّن كم مرة يتسع القطر حول الدائرة.",
   ()=>B(circF("rd"),col([["r = radie","r"],["d = diameter = 2 · r","v"],["π ≈ 3,14","b",40]],140,80,30))),
 st("Omkretsen är pi gånger diametern. En cirkel med diametern 10 cm har omkretsen 3,14 gånger 10, alltså cirka 31,4 cm.",
   "The circumference is pi times the diameter. A circle with diameter 10 cm has circumference 3.14 times 10, so about 31.4 cm.",
   "المحيط = π × القطر. دائرة قطرها 10 cm محيطها 3,14 × 10، أي 31,4 cm تقريبًا.",
   ()=>B(circF("d","10 cm"),col([["O = π · d","b",40],"3,14 · 10",["≈ 31,4 cm","g"]],140,90))),
 st("Arean är pi gånger radien gånger radien. Med radien 5 cm: 5 gånger 5 är 25, och 3,14 gånger 25 är 78,5 kvadratcentimeter.",
   "The area is pi times the radius times the radius. With radius 5 cm: 5 times 5 is 25, and 3.14 times 25 is 78.5 square centimetres.",
   "المساحة = π × نصف القطر × نصف القطر. إذا كان نصف القطر 5 cm: 5 × 5 = 25، و3,14 × 25 = 78,5 cm².",
   ()=>B(circF("r","5 cm",{fill:1}),col([["A = π · r^2","b",40],"3,14 · 5^2 = 3,14 · 25",["≈ 78,5 cm²","g"]],140,90,30))),
 st("Exempel: diametern är 8 cm och vi vill ha arean. Arean behöver radien, så dela först: 8 delat med 2 är 4. Sedan 3,14 gånger 16 är 50,24 kvadratcentimeter.",
   "Example: the diameter is 8 cm and we want the area. The area needs the radius, so divide first: 8 divided by 2 is 4. Then 3.14 times 16 is 50.24 square centimetres.",
   "مثال: القطر 8 cm ونريد المساحة. المساحة تحتاج نصف القطر، فنقسم أولًا: 8 ÷ 2 = 4، ثم 3,14 × 16 = 50,24 cm².",
   ()=>B(circF("d","8 cm",{fill:1}),col(["r = 8 / 2 = 4","3,14 · 4^2 = 3,14 · 16",["≈ 50,24 cm²","g"]],140,90,30))),
 {drill:{gen:gCirc,n:5,intro:S("Din tur! Radie, diameter, omkrets och area. Använd π ≈ 3,14.","Your turn! Radius, diameter, circumference and area. Use π ≈ 3.14.","دورك! نصف القطر والقطر والمحيط والمساحة. استخدم π ≈ 3,14.")}},
]);
part("📦",S("Volym","Volume","الحجم"),[
 st("Volymen är hur mycket som får plats inuti en kropp: hur många kuber på en centimeter i varje riktning. Rätblock: längden gånger bredden gånger höjden. Svaret blir i kubikcentimeter, cm³.",
   "The volume is how much fits inside a solid: how many cubes of one centimetre each way. Box: length times width times height. The answer is in cubic centimetres, cm³.",
   "الحجم هو مقدار ما يتسع داخل المجسم: كم مكعبًا طوله 1 cm في كل اتجاه. متوازي المستطيلات: الطول × العرض × الارتفاع، والوحدة سنتيمتر مكعب cm³.",
   ()=>B(boxF(5,3,4,{fill:1}),col([["Volym","b",42],"l · b · h",["5 · 3 · 4 = 60 cm³","g"]],130,80,32))),
 st("Exempel 1: en kub med sidan 3 cm. 3 gånger 3 gånger 3 är 27 kubikcentimeter.",
   "Example 1: a cube with side 3 cm. 3 times 3 times 3 is 27 cubic centimetres.",
   "مثال 1: مكعب ضلعه 3 cm: 3 × 3 × 3 = 27 cm³.",
   ()=>B(boxF(3,3,3,{fill:1,c:"g"}),col(["3 · 3 · 3 = 3^3",["= 27 cm³","g"]],170,90))),
 st("Exempel 2: liter. En kubikdecimeter är precis en liter. Ett akvarium som är 6 dm långt, 3 dm brett och 4 dm högt rymmer 72 kubikdecimeter, alltså 72 liter.",
   "Example 2: litres. One cubic decimetre is exactly one litre. A fish tank 6 dm long, 3 dm wide and 4 dm high holds 72 cubic decimetres, so 72 litres.",
   "مثال 2: اللتر. الديسيمتر المكعب يساوي لترًا واحدًا تمامًا. حوض سمك طوله 6 dm وعرضه 3 dm وارتفاعه 4 dm يتسع لـ 72 dm³، أي 72 لترًا.",
   ()=>B(boxF(6,3,4,{fill:1,u:"dm"}),col(["6 · 3 · 4 = 72 dm³","1 dm³ = 1 liter",["= 72 liter","g"]],140,80,30))),
 st("Exempel 3: en cylinder. Volymen är bottenytan gånger höjden. Botten är en cirkel med radien 2: 3,14 gånger 4 är 12,56. Gånger höjden 5 blir 62,8 kubikcentimeter.",
   "Example 3: a cylinder. The volume is the base area times the height. The base is a circle with radius 2: 3.14 times 4 is 12.56. Times the height 5 makes 62.8 cubic centimetres.",
   "مثال 3: أسطوانة. الحجم = مساحة القاعدة × الارتفاع. القاعدة دائرة نصف قطرها 2: 3,14 × 4 = 12,56، وضرب الارتفاع 5 يعطي 62,8 cm³.",
   ()=>B(cylF(2,5,{fill:1}),col(["botten: 3,14 · 2^2 = 12,56","12,56 · 5",["≈ 62,8 cm³","g"]],140,90,28))),
 {drill:{gen:gVol,n:5,intro:S("Din tur! Räkna volymen.","Your turn! Work out the volume.","دورك! احسب الحجم.")}},
]);
const card=(x,y,c,head,l1,l2)=>{const a=P(l1),b=P(l2);let s1=32,s2=24;while(rowW(a,s1)>330&&s1>16)s1-=2;while(rowW(b,s2)>330&&s2>14)s2-=2;
  return[A.band(x,y,360,222,c),A.tx(head,x+180,y+42,28,c),...rowC(a,x+180,y+110,s1,"k").acts,...rowC(b,x+180,y+178,s2,"k").acts]};
part("📋",S("Kom ihåg","Remember","تذكّر"),[
 st("Alla formler på en tavla. Omkrets är en längd, area får kvadrat-enheter och volym kubik-enheter.",
   "All the formulas on one board. Perimeter is a length, area gets square units and volume cubic units.",
   "كل الصيغ على لوحة واحدة: المحيط طول، والمساحة بوحدات مربعة، والحجم بوحدات مكعبة.",
   ()=>[A.wipe(),...card(30,16,"r","Omkrets (cm)","rektangel: 2 · (l + b)","cirkel: π · d"),...card(410,16,"b","Area (cm²)","rektangel: l · b","triangel: b · h / 2"),
     ...card(30,262,"v","Cirkel","d = 2 · r","A = π · r^2"),...card(410,262,"g","Volym (cm³)","rätblock: l · b · h","cylinder: π · r^2 · h")]),
 st("Enheter: en meter är 100 centimeter. Men en kvadratmeter är 100 gånger 100, alltså 10 000 kvadratcentimeter. Och en kubikdecimeter är en liter.",
   "Units: one metre is 100 centimetres. But one square metre is 100 times 100, so 10,000 square centimetres. And one cubic decimetre is one litre.",
   "الوحدات: المتر 100 سنتيمتر، لكن المتر المربع 100 × 100 أي 10 000 سنتيمتر مربع. والديسيمتر المكعب لتر واحد.",
   ()=>[A.wipe(),...card(30,16,"r","Längd","1 m = 100 cm","1 cm = 10 mm"),...card(410,16,"b","Area","1 m² = 10 000 cm²","1 dm² = 100 cm²"),
     ...card(30,262,"g","Volym","1 dm³ = 1 liter","1 m³ = 1000 liter"),...card(410,262,"o","π","π ≈ 3,14","runt cirkeln: π · d")]),
]);

LESSONS.push({id:"qgeo",subject:"quick",grades:"5–9",kind:"wb",
 title:t3("Geometri: omkrets, area och volym","Geometry: perimeter, area and volume","الهندسة: المحيط والمساحة والحجم"),icon:"",
 steps,parts,mount:qMount({steps})});
}
