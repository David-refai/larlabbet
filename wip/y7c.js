/* ===== y7c.js ===== */
/* =====================================================================
   YEAR 7 (y7c): angles and parallel lines, the circle with π,
   units of area and volume, composite shapes
   ===================================================================== */
{
const T=(sv,en,ar)=>L(t3(sv,en,ar));
const rad=a=>a*Math.PI/180;
const P=(cx,cy,r,a)=>[cx+r*Math.cos(rad(a)),cy-r*Math.sin(rad(a))];
const fin=a=>Object.assign(a,{fin:true});
const noFin=g=>g.sol.filter(a=>!a.fin);
const fitS=(s,maxw,size)=>Math.min(size,maxw/(String(s).length*.47));
const r2=x=>Math.round(x*100)/100;
/* number with thousands separator and at most two decimals, in the language's notation */
const nf=x=>{x=r2(x);const neg=x<0;x=Math.abs(x);let i=Math.floor(x+1e-9),f=Math.round((x-i)*100);if(f>=100){i++;f=0}
 let s=fmt(i);if(f){let d=String(f).padStart(2,"0");if(d[1]==="0")d=d[0];s+=SEP()+d}return(neg?"−":"")+s};
const PI=()=>nf(3.14);
const arc=(cx,cy,r,a1,a2)=>{const [x1,y1]=P(cx,cy,r,a1),[x2,y2]=P(cx,cy,r,a2);return`M${f1(x1)},${f1(y1)}A${r},${r} 0 ${a2-a1>180?1:0} 0 ${f1(x2)},${f1(y2)}`};
const sector=(cx,cy,r,a1,a2)=>{const [x1,y1]=P(cx,cy,r,a1),[x2,y2]=P(cx,cy,r,a2);return`M${f1(cx)},${f1(cy)}L${f1(x1)},${f1(y1)}A${r},${r} 0 ${a2-a1>180?1:0} 0 ${f1(x2)},${f1(y2)}Z`};
const wrapL=(s,max)=>{const o=[];let cur="";s.split(" ").forEach(w=>{if(cur&&(cur+" "+w).length>max){o.push(cur);cur=w}else cur=cur?cur+" "+w:w});if(cur)o.push(cur);return o};
const para=(s,x,y,size,max,gap,c="k")=>wrapL(s.replace(/(\d) (?=(cm|dm|m|l|cm³|dm³|m²|cm²|dm²|سم|م|لتر)(\b|[\s.,؟?]|$))/g,"$1 "),max).map((l,i)=>A.tx(l,x,y+i*gap,size,c));
const ICO=b=>`<svg viewBox="0 0 320 180"><rect width="320" height="180" fill="#fff"/>${b}</svg>`;
const CV=`font-family="Caveat,cursive" font-weight="700" text-anchor="middle"`;
const res=(s,x,y,w,size=44)=>[fin(A.hl(x-w/2,y-size*1.05,w,size*1.42)),fin(A.tx(s,x,y,fitS(s,w-16,size),"g"))];

/* ---------------------------------------------------------------- 1. ang7: angles and parallel lines */
const aRnd=(lo,hi,gap)=>{let a;do{a=rint(lo,hi)}while(Math.abs(a-90)<gap);return a};
const amark=(cx,cy,a1,a2,c,r=36)=>{if(Math.abs(a2-a1-90)<.5){const s=r*.62,p1=P(cx,cy,s,a1),p2=P(cx,cy,s*Math.SQRT2,(a1+a2)/2),p3=P(cx,cy,s,a2);
  return A.p(`M${f1(p1[0])},${f1(p1[1])}L${f1(p2[0])},${f1(p2[1])}L${f1(p3[0])},${f1(p3[1])}`,c,3.5)}return A.p(arc(cx,cy,r,a1,a2),c,3.5)};
const alab=(cx,cy,a1,a2,s,c,size=34,mx=120)=>{const h=Math.min(80,(a2-a1)/2),dl=Math.max(Math.min(62,mx),Math.min(mx,size*.95/Math.sin(rad(h))+24)),[x,y]=P(cx,cy,dl,(a1+a2)/2);return A.tx(s,x,y+size*.35,size,c)};
const ang=(cx,cy,sec,c,lab,r,size=34,mx)=>[amark(cx,cy,sec[0],sec[1],c,r||(sec[1]-sec[0]>100?30:38)),alab(cx,cy,sec[0],sec[1],lab,c,size,mx)];
/* two straight lines crossing at (cx,cy); sector i runs counter-clockwise from direction d[i] */
function xing(cx,cy,len,rot,a){const d=[rot,rot+a,rot+180,rot+180+a],v=i=>i%2?180-a:a;
 return{v,s:i=>[d[i],d[i]+v(i)],o:[A.p(R.line(...P(cx,cy,len,d[2]),...P(cx,cy,len,d[0]),.4),"k",4.5),A.p(R.line(...P(cx,cy,len,d[3]),...P(cx,cy,len,d[1]),.4),"k",4.5)]}}
/* two parallel lines cut by a transversal at angle t; U = upper crossing, D = lower crossing */
function par(t,yU=165,yD=345,xc=265,x0=50,x1=480,ext=80){const dx=(yD-yU)/Math.tan(rad(t)),U=[xc+dx/2,yU],D=[xc-dx/2,yD],cx=t<90?x0+30:x1-56;
 const chev=y=>`M${cx},${y-10}l12,10l-12,10M${cx+14},${y-10}l12,10l-12,10`;
 return{U,D,v:i=>i%2?180-t:t,s:i=>{const d=[0,t,180,180+t][i];return[d,d+(i%2?180-t:t)]},
  o:[A.p(R.line(x0,yU,x1,yU,.4)+R.line(x0,yD,x1,yD,.4),"k",4.5),A.p(chev(yU)+chev(yD),"k",3),A.p(R.line(...P(D[0],D[1],ext,t+180),...P(U[0],U[1],ext,t),.4),"k",4.5)]}}
/* triangle with base angles al (left) and be (right), fitted in a box */
function triFit(al,be,x0,x1,yb,yt){const ta=Math.tan(rad(al)),tb=Math.tan(rad(be));let xc,yc;
 if(al===90){xc=0;yc=tb}else if(be===90){xc=1;yc=ta}else{yc=ta*tb/(ta+tb);xc=yc/ta}
 const mn=Math.min(0,xc),mx=Math.max(1,xc),s=Math.min((x1-x0)/(mx-mn),(yb-yt)/yc),ox=x0+((x1-x0)-(mx-mn)*s)/2-mn*s;
 return[[ox,yb],[ox+s,yb],[ox+xc*s,yb-yc*s]]}
const corner=(V,i)=>{const p=V[i],sh=Math.min(...[1,2].map(k=>Math.hypot(V[(i+k)%3][0]-p[0],V[(i+k)%3][1]-p[1]))),dir=q=>Math.atan2(-(q[1]-p[1]),q[0]-p[0])*180/Math.PI;let a1=dir(V[(i+1)%3]),a2=dir(V[(i+2)%3]),d=((a2-a1)%360+360)%360;if(d>180){a1=a2;d=360-d}return{p,s:a1,e:a1+d,sh}};
const cmark=(V,i,c,lab,size=34,r)=>{const k=corner(V,i);return ang(k.p[0],k.p[1],[k.s,k.e],c,lab,r,size,Math.min(120,k.sh*.42))};
const tick=(p,q,t=.5)=>{const mx=p[0]+(q[0]-p[0])*t,my=p[1]+(q[1]-p[1])*t,l=Math.hypot(q[0]-p[0],q[1]-p[1]),ux=(q[0]-p[0])/l,uy=(q[1]-p[1])/l;return`M${f1(mx-uy*11)},${f1(my+ux*11)}L${f1(mx+uy*11)},${f1(my-ux*11)}`};
const NM={side:t3("sidovinklar","adjacent angles","زاويتان متجاورتان"),vert:t3("vertikalvinklar","vertical angles","زاويتان متقابلتان بالرأس"),
 corr:t3("likbelägna vinklar","corresponding angles","زاويتان متناظرتان"),alt:t3("alternatvinklar","alternate angles","زاويتان متبادلتان"),eq:t3("är lika stora","are equal","متساويتان")};
const AX=xing(270,268,200,0,50),PR=par(60),TV=triFit(60,50,90,470,400,150),EV=triFit(70,65,70,330,390,120);
const ANG7={steps:[
 {say:t3("Två raka vägar korsar varandra. Två vinklar bredvid varandra på samma linje kallas sidovinklar, och tillsammans är de alltid 180°.",
   "Two straight roads cross each other. Two angles next to each other on the same line are called adjacent angles, and together they always make 180°.",
   "طريقان مستقيمان يتقاطعان. الزاويتان المتجاورتان على المستقيم نفسه مجموعهما دائمًا 180°."),
  draw:()=>[A.wipe(),...AX.o,...ang(270,268,AX.s(0),"o","50°"),...ang(270,268,AX.s(1),"b","130°"),
   A.tx(L(NM.side),640,100,40),A.hl(494,130,292,60),A.tx("50° + 130° = 180°",640,174,36)]},
 {say:t3("Vinklarna mitt emot varandra kallas vertikalvinklar. De är alltid lika stora, för båda är 180° − 130° = 50°.",
   "The angles opposite each other are called vertical angles. They are always equal, because both are 180° − 130° = 50°.",
   "الزاويتان المتقابلتان بالرأس متساويتان دائمًا، لأن كل واحدة منهما تساوي 180° − 130° = 50°."),
  draw:()=>[...ang(270,268,AX.s(2),"o","50°"),...ang(270,268,AX.s(3),"b","130°"),
   A.tx(L(NM.vert),640,320,38),A.tx(L(NM.eq),640,372,32,"g"),A.tx("180° − 130° = 50°",640,440,34)]},
 {say:t3("Rälsen på ett tågspår är parallella linjer. När en väg korsar båda bildas likbelägna vinklar, alltså vinklar på samma plats i varje korsning. De är lika stora.",
   "The rails of a railway track are parallel lines. When a road crosses both, it makes corresponding angles: angles in the same position at each crossing. They are equal.",
   "قضبان سكة القطار مستقيمان متوازيان. عندما يقطعهما طريق تتكوّن زوايا متناظرة، أي زوايا في الموقع نفسه عند كل تقاطع، وهي متساوية."),
  draw:()=>[A.wipe(),...PR.o,...ang(...PR.U,PR.s(0),"o","60°"),...ang(...PR.D,PR.s(0),"o","60°"),
   A.tx(T("parallella linjer","parallel lines","مستقيمان متوازيان"),640,100,30),A.tx(L(NM.corr),640,215,34,"o"),A.tx(T("samma plats","same position","الموقع نفسه"),640,265,30),A.hl(530,300,220,62),A.tx("60° = 60°",640,344,40,"g")]},
 {say:t3("Vinklar på var sin sida om den sneda linjen, mellan de parallella linjerna, kallas alternatvinklar. De bildar ett Z och är också lika stora.",
   "Angles on opposite sides of the slanted line, between the parallel lines, are called alternate angles. They form a Z and are also equal.",
   "الزاويتان على جانبين مختلفين من القاطع وبين المستقيمين المتوازيين تسمّيان زاويتين متبادلتين. إنهما تشكّلان حرف Z وهما متساويتان أيضًا."),
  draw:()=>[A.wipe(),...PR.o,A.p(`M${f1(PR.U[0]-140)},165L${f1(PR.U[0])},165L${f1(PR.D[0])},345L${f1(PR.D[0]+140)},345`,"g",7),...ang(...PR.U,PR.s(2),"o","60°"),...ang(...PR.D,PR.s(0),"o","60°"),
   A.tx(L(NM.alt),640,200,36,"g"),A.tx(T("Z-form","Z shape","شكل Z"),640,252,30),A.hl(530,300,220,62),A.tx("60° = 60°",640,344,40,"g")]},
 {say:t3("Varför är vinkelsumman i en triangel 180°? Dra en linje genom toppen, parallell med basen. Alternatvinklarna flyttar upp bottenvinklarna, och de tre vinklarna bildar en rak linje.",
   "Why do the angles of a triangle add up to 180°? Draw a line through the top, parallel to the base. Alternate angles move the bottom angles up, and the three angles make a straight line.",
   "لماذا مجموع زوايا المثلث 180°؟ ارسم مستقيمًا يمرّ بالرأس موازيًا للقاعدة. الزوايا المتبادلة تنقل زاويتي القاعدة إلى الأعلى، فتشكّل الزوايا الثلاث خطًا مستقيمًا."),
  draw:()=>{const C=TV[2];return[A.wipe(),A.p(plines(TV),"k",4.5),...cmark(TV,0,"o","60°"),...cmark(TV,1,"b","50°"),...cmark(TV,2,"g","70°"),
   A.p(R.dashed(60,C[1],500,C[1]),"r",3.5),...ang(C[0],C[1],[180,240],"o","60°",34,30),...ang(C[0],C[1],[310,360],"b","50°",34,30),
   A.tx(T("parallell med basen","parallel to the base","موازٍ للقاعدة"),640,140,28,"r"),A.tx("60° + 70° + 50°",640,250,36),A.hl(530,290,220,62),A.tx("= 180°",640,335,44,"g")]}},
 {say:t3("Nu kombinerar vi. Först sidovinkeln: 180° − 115° = 65°. Sedan vinkelsumman: x = 180° − 70° − 65° = 45°.",
   "Now we combine. First the adjacent angle: 180° − 115° = 65°. Then the angle sum: x = 180° − 70° − 65° = 45°.",
   "الآن نجمع بين القاعدتين. أولًا الزاوية المجاورة: 180° − 115° = 65°. ثم مجموع زوايا المثلث: x = 180° − 70° − 65° = 45°."),
  draw:()=>{const B=EV[1];return[A.wipe(),A.p(plines(EV),"k",4.5),A.p(R.line(B[0],B[1],B[0]+110,B[1],.3),"k",4.5),...cmark(EV,0,"b","70°"),...ang(B[0],B[1],[0,115],"b","115°"),...cmark(EV,2,"r","x",40),
   ...cmark(EV,1,"o","65°"),A.tx("180° − 115° = 65°",620,170,32,"o"),A.tx("x = 180° − 70° − 65°",620,250,30),A.hl(510,290,220,62),A.tx("x = 45°",620,335,44,"g")]}}
]};
LESSONS.push({id:"ang7",subject:"math",grades:"7",kind:"wb",
 title:t3("Vinklar och parallella linjer","Angles and parallel lines","الزوايا والمستقيمات المتوازية"),
 icon:ICO(`<path d="M30 60H290M30 130H290" stroke="#1d2433" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M60 50l10 10l-10 10M60 120l10 10l-10 10" stroke="#1d2433" stroke-width="3" fill="none"/><path d="M110 165L210 25" stroke="#1d2433" stroke-width="5" stroke-linecap="round"/><path d="M215 60A30 30 0 0 0 202.4 35.6" stroke="#e07b00" stroke-width="5" fill="none"/><path d="M165 130A30 30 0 0 0 152.4 105.6" stroke="#e07b00" stroke-width="5" fill="none"/><path d="M155 60A30 30 0 0 0 167.6 84.4" stroke="#1e9e5a" stroke-width="5" fill="none"/><text x="262" y="112" ${CV} font-size="40" fill="#e07b00">=</text>`),
 steps:ANG7.steps,mount:wbMount(ANG7),
 gen(level){
  const ask=(y=100)=>A.tx(T("Hur stor är vinkeln x?","How big is angle x?","ما قياس الزاوية x؟"),630,y,34);
  if(level===0){const a=aRnd(35,145,12),rot=rint(-20,20),X=xing(265,265,200,rot,a),k=rint(0,3),j=(k+rint(1,3))%4,kv=X.v(k),x=X.v(j),opp=(j-k+4)%4===2;
   return{kind:"num",ans:x,show:`${x}°`,q:[A.wipe(),ask(),...X.o,...ang(265,265,X.s(k),"b",`${kv}°`),...ang(265,265,X.s(j),"r","x",null,40)],
    sol:opp?[A.tx(L(NM.vert),630,230,34,"b"),fin(A.tx(L(NM.eq),630,285,30)),...res(`x = ${x}°`,630,400,240)]
     :[A.tx(L(NM.side),630,215,34,"b"),A.tx(`x + ${kv}° = 180°`,630,275,34),fin(A.tx(`x = 180° − ${kv}°`,630,333,34)),...res(`x = ${x}°`,630,420,240)]}}
  if(level===1){const t=aRnd(45,135,12),F=par(t),c=rint(0,1),k=rint(0,3),j=rint(0,3),K=c?F.D:F.U,J=c?F.U:F.D,kv=F.v(k),x=F.v(j);
   const inner=(cr,i)=>cr?i<2:i>1;   /* cr=1: lower line, the inside is above it */
   const q=[A.wipe(),A.tx(T("Linjerna är parallella.","The lines are parallel.","المستقيمان متوازيان."),630,90,30),ask(140),...F.o,...ang(...K,F.s(k),"b",`${kv}°`),...ang(...J,F.s(j),"r","x",null,40)];
   let sol;
   if(j===k)sol=[A.tx(L(NM.corr),630,240,32,"b"),fin(A.tx(L(NM.eq),630,292,30)),...res(`x = ${x}°`,630,400,240)];
   else if(inner(c,k)&&inner(1-c,j)&&j===(k+2)%4)sol=[A.tx(L(NM.alt),630,240,32,"b"),fin(A.tx(L(NM.eq),630,292,30)),...res(`x = ${x}°`,630,400,240)];
   else{const vert=(j-k+4)%4===2;
    sol=[...ang(...J,F.s(k),"b",`${kv}°`,null,30),A.tx(L(NM.corr),630,220,30,"b"),fin(A.tx(L(vert?NM.vert:NM.side),630,272,30,"o")),...(vert?[]:[fin(A.tx(`x = 180° − ${kv}°`,630,330,32))]),...res(`x = ${x}°`,630,420,240)]}
   return{kind:"num",ans:x,show:`${x}°`,q,sol}}
  if(rint(0,1)){let al,be;do{al=rint(35,85);be=rint(35,85)}while(180-al-be<35||180-al-be>100||180-al-be===be);
   const e=180-be,x=180-al-be,V=triFit(al,be,70,330,390,120),B=V[1];
   return{kind:"num",ans:x,show:`${x}°`,q:[A.wipe(),ask(),A.p(plines(V),"k",4.5),A.p(R.line(B[0],B[1],B[0]+110,B[1],.3),"k",4.5),...cmark(V,0,"b",`${al}°`),...ang(B[0],B[1],[0,e],"b",`${e}°`),...cmark(V,2,"r","x",40)],
    sol:[...cmark(V,1,"o",`${be}°`,30),A.tx(`180° − ${e}° = ${be}°`,630,215,32,"o"),fin(A.tx(`x = 180° − ${al}° − ${be}°`,630,285,30)),...res(`x = ${x}°`,630,400,240)]}}
  const apex=rint(0,1);let v,b;if(apex){v=2*rint(20,50);b=(180-v)/2}else{b=rint(40,75);v=180-2*b}
  const V=triFit(b,b,90,430,390,130),x=apex?b:v,base=T("basvinklarna är lika stora","the base angles are equal","زاويتا القاعدة متساويتان");
  const q=[A.wipe(),A.tx(T("Triangeln är likbent.","The triangle is isosceles.","المثلث متساوي الساقين."),630,90,30),ask(140),A.p(plines(V),"k",4.5),A.p(tick(V[0],V[2],.38)+tick(V[1],V[2],.38),"k",3.5)];
  if(apex){q.push(...cmark(V,2,"b",`${v}°`),...cmark(V,0,"r","x",40),cmark(V,1,"r","")[0]);
   return{kind:"num",ans:x,show:`${x}°`,q,sol:[A.tx(base,630,215,fitS(base,330,30),"b"),A.tx(`2x = 180° − ${v}° = ${180-v}°`,630,275,30),fin(A.tx(`x = ${180-v}° ${DIVS()} 2`,630,333,32)),...res(`x = ${x}°`,630,420,240)]}}
  q.push(...cmark(V,0,"b",`${b}°`),cmark(V,1,"b","")[0],...cmark(V,2,"r","x",40));
  return{kind:"num",ans:x,show:`${x}°`,q,sol:[cmark(V,1,"b",`${b}°`)[1],A.tx(base,630,225,fitS(base,330,30),"b"),fin(A.tx(`x = 180° − ${b}° − ${b}°`,630,295,30)),...res(`x = ${x}°`,630,400,240)]}}
});
Object.assign(HELPX,{ang7:[
 {say:t3("Tänk på en sax. När du öppnar den bildas fyra vinklar. Vinkeln mellan bladen och vinkeln mellan handtagen är alltid lika stora.",
   "Think of a pair of scissors. When you open them, four angles appear. The angle between the blades and the angle between the handles are always equal.",
   "فكّر في مقص. عندما تفتحه تتكوّن أربع زوايا. الزاوية بين الشفرتين والزاوية بين المقبضين متساويتان دائمًا."),
  draw:()=>{const c=[400,240],e1=P(...c,250,20),e2=P(...c,250,-20),h1=P(...c,170,200),h2=P(...c,170,160),hl1=P(...c,215,200),hl2=P(...c,215,160);
   return[A.p(R.line(...h1,...e1,.3),"#5b6475",7),A.p(R.line(...h2,...e2,.3),"#5b6475",7),A.p(R.loop(hl1[0],hl1[1],44,26)+R.loop(hl2[0],hl2[1],44,26),"r",5),A.p(dots([c]),"k",14),
    ...ang(...c,[-20,20],"o","40°",60,32),...ang(...c,[160,200],"o","40°",60,32),A.tx(L(NM.vert),400,420,38,"b"),A.tx(L(NM.eq),400,465,32,"g")]}},
 {say:t3("En stege har parallella pinnar. Sidostången korsar varje pinne, och vinkeln blir lika stor vid alla pinnar. Det är likbelägna vinklar.",
   "A ladder has parallel rungs. The side rail crosses every rung, and the angle is the same at every rung. Those are corresponding angles.",
   "للسلّم درجات متوازية. القائم الجانبي يقطع كل درجة، والزاوية متساوية عند جميع الدرجات. هذه زوايا متناظرة."),
  draw:()=>{const t=65,k=1/Math.tan(rad(t)),xl=y=>200+(450-y)*k,ys=[400,330,260,190,120],o=[A.p(R.line(xl(460),460,xl(70),70,.3)+R.line(xl(460)+100,460,xl(70)+100,70,.3),"o",6)];
   o.push(A.p(ys.map(y=>R.line(xl(y),y,xl(y)+100,y,.2)).join(""),"k",4.5));ys.forEach(y=>o.push(amark(xl(y),y,0,t,"b",26)));
   o.push(alab(xl(260),260,0,t,"65°","b",30),A.tx(L(NM.corr),640,200,32,"b"),A.tx(T("samma vinkel vid","the same angle at","الزاوية نفسها عند"),640,280,30),A.tx(T("varje pinne","every rung","كل درجة"),640,320,30));return o}}]});
Object.assign(HINTSX,{ang7:[
 {say:t3("Ligger vinklarna bredvid varandra på en linje, eller mitt emot varandra?","Are the angles next to each other on a line, or opposite each other?","هل الزاويتان متجاورتان على مستقيم، أم متقابلتان بالرأس؟"),cut:noFin},
 {say:t3("Flytta den kända vinkeln till den andra korsningen. Där har den samma storlek.","Move the known angle to the other crossing. It has the same size there.","انقل الزاوية المعلومة إلى التقاطع الآخر، فلها القياس نفسه هناك."),cut:noFin},
 {say:t3("Räkna först ut den vinkel du kan direkt. Vinklarna i en triangel är 180° tillsammans.","First work out the angle you can find directly. The angles of a triangle add up to 180°.","احسب أولًا الزاوية التي تستطيع إيجادها مباشرة. مجموع زوايا المثلث 180°."),cut:noFin}]});

/* ---------------------------------------------------------------- 2. circ7: circumference and area with π */
const OL=()=>T("O","C","المحيط"),AL=()=>T("A","A","المساحة");
const fO=()=>`${OL()} = π ${MUL()} d`,fA=()=>`${AL()} = π ${MUL()} r²`;
const wheel=(cx,cy,r)=>{let s="";for(let i=0;i<12;i++){const [x,y]=P(cx,cy,r*.9,i*30);s+=R.line(cx,cy,x,y,.1)}return[A.p(s,"#9aa8c4",2),A.p(R.circ(cx,cy,r)+R.circ(cx,cy,r*.9),"k",4.5),A.p(R.circ(cx,cy,r*.1),"k",3)]};
const PDOTS=[[-.5,-.45],[.35,-.55],[.55,.2],[-.2,.5],[-.6,.15],[.1,-.1],[.3,.6]];
const pizza=(cx,cy,r,pd=PDOTS)=>[A.hatch(`M${cx-r},${cy}a${r},${r} 0 1,0 ${2*r},0a${r},${r} 0 1,0 ${-2*r},0`,"o"),A.p(R.circ(cx,cy,r),"o",5),A.p(dots(pd.map(([a,b])=>[cx+a*r,cy+b*r])),"r",r/5)];
const COBJ=[{n:t3("en tallrik","a plate","الطبق"),u:"cm",lo:20,hi:28,pic:"plate"},{n:t3("ett cykelhjul","a bike wheel","عجلة الدراجة"),u:"cm",lo:50,hi:70,pic:"wheel"},
 {n:t3("en trampolin","a trampoline","الترامبولين"),u:"m",lo:3,hi:5,pic:"tramp"},{n:t3("en väggklocka","a wall clock","ساعة الحائط"),u:"cm",lo:24,hi:40,pic:"clock"},
 {n:t3("en rondell","a roundabout","الدوّار"),u:"m",lo:16,hi:40,pic:"round"},{n:t3("en pizza","a pizza","البيتزا"),u:"cm",lo:24,hi:40,pic:"pizza"}];
const uAr=u=>u==="m"?"م":"سم";
const cap=s=>s[0].toUpperCase()+s.slice(1);
/* the round object, drawn plain enough that the measurements stay readable */
function cpic(o,cx,cy,r){const p=o.pic;
 if(p==="wheel")return wheel(cx,cy,r);
 if(p==="pizza")return pizza(cx,cy,r);
 if(p==="clock"){let t="";for(let i=0;i<12;i++){const [a,b]=P(cx,cy,r*.88,i*30),[c,d]=P(cx,cy,r*.76,i*30);t+=R.line(a,b,c,d,.1)}return[A.p(R.circ(cx,cy,r),"k",5),A.p(t,"k",3),A.p(`M${cx},${cy}L${cx+r*.32},${cy-r*.42}`,"k",4)]}
 if(p==="round")return[A.p(R.circ(cx,cy,r),"k",4.5),A.hatch(`M${cx-r*.4},${cy}a${r*.4},${r*.4} 0 1,0 ${r*.8},0a${r*.4},${r*.4} 0 1,0 ${-r*.8},0`,"g"),A.p(R.circ(cx,cy,r*.4),"g",3.5)];
 if(p==="tramp")return[A.p(R.circ(cx,cy,r),"b",5),A.p(R.circ(cx,cy,r*.84),"#9aa8c4",2.5)];
 return[A.p(R.circ(cx,cy,r),"k",4.5),A.p(R.circ(cx,cy,r*.72),"#9aa8c4",2.5)]}
const CX=215,CY=295,CR=130,LY=CY+CR+44;   /* LY: baseline of the measurement labels under the picture */
function cQ(o,giv,val,askS){const u=o.u,n=o.n;
 const ctx=giv==="d"?T(`${cap(n.sv)} har diametern ${nf(val)} ${u}.`,`${cap(n.en)} has a diameter of ${nf(val)} ${u}.`,`قطر ${n.ar} ${nf(val)} ${uAr(u)}.`)
  :giv==="r"?T(`${cap(n.sv)} har radien ${nf(val)} ${u}.`,`${cap(n.en)} has a radius of ${nf(val)} ${u}.`,`نصف قطر ${n.ar} ${nf(val)} ${uAr(u)}.`)
  :T(`Omkretsen på ${n.sv} är ${nf(val)} ${u}.`,`The circumference of ${n.en} is ${nf(val)} ${u}.`,`محيط ${n.ar} ${nf(val)} ${uAr(u)}.`);
 const o2=[A.wipe(),A.tx(ctx,400,58,fitS(ctx,760,32)),A.tx(askS,400,106,fitS(askS,760,30),"b"),...cpic(o,CX,CY,CR),A.p(dots([[CX,CY]]),"k",10)];
 if(giv==="d")o2.push(A.p(R.line(CX-CR,CY,CX+CR,CY,.3),"r",5),A.tx(`d = ${nf(val)} ${u}`,CX,LY,32,"r"));
 else if(giv==="r")o2.push(A.p(R.line(CX,CY,CX+CR,CY,.3),"r",5),A.tx(`r = ${nf(val)} ${u}`,CX,LY,32,"r"));
 else{const os=`${OL()} = ${nf(val)} ${u}`;o2.push(A.p(R.circ(CX,CY,CR),"r",7),A.p(R.dashed(CX-CR,CY,CX+CR,CY),"b",4),A.tx(os,CX-50,LY,fitS(os,230,30),"r"),A.tx("d = ?",CX+130,LY,30,"b"))}
 return o2}
const askO=()=>T("Hur lång är omkretsen? Räkna med π ≈ 3,14.","How long is the circumference? Use π ≈ 3.14.","ما طول المحيط؟ استخدم π ≈ 3.14."),
 askA=()=>T("Hur stor är arean? Räkna med π ≈ 3,14.","What is the area? Use π ≈ 3.14.","ما المساحة؟ استخدم π ≈ 3.14."),
 askD=()=>T("Hur lång är diametern? Räkna med π ≈ 3,14.","How long is the diameter? Use π ≈ 3.14.","ما طول القطر؟ استخدم π ≈ 3.14.");
const SX=590;   /* centre of the solution column */
const CIRC7={steps:[
 {say:t3("Omkretsen delat med diametern blir ungefär 3,14 för alla cirklar, från en burk till ett cykelhjul. Talet kallas π, pi.",
   "The circumference divided by the diameter is about 3.14 for every circle, from a can to a bike wheel. This number is called π, pi.",
   "المحيط مقسومًا على القطر يساوي تقريبًا 3.14 في كل دائرة، من العلبة إلى عجلة الدراجة. يُسمّى هذا العدد π (باي)."),
  draw:()=>{const rows=[[t3("burk","can","علبة"),8,25.1,28],[t3("skiva","record","أسطوانة"),30,94.2,40],[t3("cykelhjul","bike wheel","عجلة"),70,219.9,52]],o=[A.wipe()];
   o.push(A.tx("d",300,80,40,"b"),A.tx(OL(),445,80,fitS(OL(),120,40),"r"),A.tx(`${OL()} ${DIVS()} d`,620,80,fitS(`${OL()} ${DIVS()} d`,170,36)),A.p(R.line(40,100,720,100,.3),"k",3));
   rows.forEach(([nm,d,c,r],i)=>{const y=165+i*110;o.push(...(i===2?wheel(100,y,r):[A.p(R.circ(100,y,r),"k",4.5),A.p(R.circ(100,y,i?r*.25:r*.8),"#9aa8c4",2.5)]),qt(L(nm),178,y+40,26),
    A.tx(`${d} cm`,300,y+12,36,"b"),A.tx(`${nf(c)} cm`,445,y+12,36,"r"),A.tx(`≈ ${PI()}`,620,y+12,38,"g"))});
   o.push(A.loop(620,282,92,170,"g"),A.tx("π",750,300,80,"g"));return o}},
 {say:t3("Rulla ett hjul ett helt varv. Sträckan blir tre diametrar och lite till, alltså π · d. Därför är omkretsen O = π · d.",
   "Roll a wheel one full turn. The distance is three diameters and a little more, that is π × d. So the circumference is C = π × d.",
   "دحرج عجلة دورة كاملة. المسافة ثلاثة أقطار وقليل، أي π × d. لذلك المحيط = π × d."),
  draw:()=>{const x0=90,d=110,y=300,o=[A.wipe(),A.p(R.line(40,y,560,y,.3),"k",4),A.p(R.circ(x0,y-55,55)+R.circ(x0,y-55,48),"k",4.5),A.p(R.circ(x0,y-55,5),"k",3),A.p(R.line(x0,y-110,x0,y,.2),"r",4),A.tx("d",x0-22,y-62,32,"r"),
    A.p(R.circ(x0+3.14*d,y-55,55),"#9aa8c4",3),A.arrow(160,170,380,170,"b",-30),A.tx(T("ett varv","one turn","دورة واحدة"),270,128,30,"b")];
   const segs=[0,1,2].map(i=>R.line(x0+i*d,y+26,x0+(i+1)*d,y+26,.2)).join("");o.push(A.p(segs+[0,1,2,3].map(i=>`M${x0+i*d},${y+14}v24`).join(""),"r",4),A.p(R.line(x0+3*d,y+26,x0+3.14*d,y+26,.1)+`M${f1(x0+3.14*d)},${y+14}v24`,"g",4));
   [0,1,2].forEach(i=>o.push(A.tx("d",x0+(i+.5)*d,y+72,34,"r")));o.push(A.tx(T("lite till","a bit more","وقليل"),x0+3.07*d+10,y+112,30,"g"),A.arrow(x0+3.07*d+8,y+82,x0+3.07*d,y+40,"g"));
   o.push(A.tx(T("d = diameter","d = diameter","d = القطر"),670,150,30),A.tx("π ≈ "+PI(),670,230,40,"b"),A.hl(575,270,190,64),A.tx(fO(),670,316,fitS(fO(),180,44),"g"));return o}},
 {say:t3("Ett cykelhjul har diametern 70 cm. O ≈ 3,14 · 70 = 219,8 cm. Varje varv rullar cykeln alltså ungefär 2,2 meter.",
   "A bike wheel has a diameter of 70 cm. C ≈ 3.14 × 70 = 219.8 cm. So each turn the bike rolls about 2.2 metres.",
   "قطر عجلة دراجة 70 سم. المحيط ≈ 3.14 × 70 = 219.8 سم. إذن في كل دورة تقطع الدراجة نحو 2.2 متر."),
  draw:()=>[A.wipe(),...wheel(220,255,165),A.p(R.line(55,255,385,255,.3),"r",5),A.tx("d = 70 cm",220,468,36,"r"),
   A.tx(fO(),SX,150,fitS(fO(),300,40)),A.tx(`${OL()} ≈ ${PI()} ${MUL()} 70`,SX,225,fitS(`${OL()} ≈ 3,14 · 70`,300,38)),A.hl(SX-150,262,300,64),A.tx(`${OL()} ≈ ${nf(219.8)} cm`,SX,310,fitS(`${OL()} ≈ 219,8 cm`,280,42),"g"),A.tx(`≈ ${nf(2.2)} m`,SX,390,38,"b")]},
 {say:t3("Klipp cirkeln i smala tårtbitar och lägg dem omlott. Det blir nästan en rektangel med basen π · r och höjden r, så arean är A = π · r².",
   "Cut the circle into thin slices and lay them top to tail. You get almost a rectangle with base π × r and height r, so the area is A = π × r².",
   "قصّ الدائرة إلى قطع رفيعة ورتّبها متعاكسة. نحصل تقريبًا على مستطيل قاعدته π × r وارتفاعه r، فالمساحة = π × r²."),
  draw:()=>{const cx=140,cy=230,R0=92,n=16,o=[A.wipe()];for(let i=0;i<n;i++){const a1=i*360/n,a2=(i+1)*360/n;o.push(A.hatch(sector(cx,cy,R0,a1,a2),i<n/2?"o":"b"))}
   let sp="";for(let i=0;i<n;i++){const [x,y]=P(cx,cy,R0,i*360/n);sp+=R.line(cx,cy,x,y,.1)}o.push(A.p(R.circ(cx,cy,R0)+sp,"k",2.5),A.p(R.line(cx,cy,cx+R0,cy,.1),"r",4.5),A.tx("r",cx+R0/2,cy-10,30,"r"));
   const w=Math.PI*R0/8,x0=330,top=180,h=R0;let wd="";
   for(let i=0;i<8;i++){const ax=x0+w/2+i*w,bx=x0+(i+1)*w,hw=R0*Math.sin(rad(11.25)),ch=R0*Math.cos(rad(11.25));
    const up=`M${f1(ax)},${top+h}L${f1(ax-hw)},${f1(top+h-ch)}A${R0},${R0} 0 0 1 ${f1(ax+hw)},${f1(top+h-ch)}Z`,dn=`M${f1(bx)},${top}L${f1(bx-hw)},${f1(top+ch)}A${R0},${R0} 0 0 0 ${f1(bx+hw)},${f1(top+ch)}Z`;
    o.push(A.hatch(up,"o"));if(i<7)o.push(A.hatch(dn,"b"));wd+=up+(i<7?dn:"")}
   o.push(A.p(wd,"k",2),A.arrow(245,160,315,160,"k",-20),A.p(R.line(x0,top+h+22,x0+8*w,top+h+22,.2)+`M${x0},${top+h+12}v20M${f1(x0+8*w)},${top+h+12}v20`,"b",3),A.tx(`π ${MUL()} r`,x0+4*w,top+h+62,34,"b"),
    A.p(R.line(x0-18,top,x0-18,top+h,.2),"r",3),A.tx("r",x0-38,top+h/2+10,32,"r"),A.tx(T("r = radie","r = radius","r = نصف القطر"),140,370,28),
    A.hl(220,394,360,66),A.tx(`${AL()} = π ${MUL()} r ${MUL()} r = π ${MUL()} r²`,400,442,fitS(`${AL()} = π · r · r = π · r²`,350,40),"g"));return o}},
 {say:t3("En pizza har diametern 30 cm. Arean räknar vi med radien, r = 15 cm. A ≈ 3,14 · 15 · 15 = 706,5 cm².",
   "A pizza has a diameter of 30 cm. We find the area with the radius, r = 15 cm. A ≈ 3.14 × 15 × 15 = 706.5 cm².",
   "قطر بيتزا 30 سم. نحسب المساحة بنصف القطر، r = 15 سم. المساحة ≈ 3.14 × 15 × 15 = 706.5 سم²."),
  draw:()=>{const M=MUL();return[A.wipe(),...pizza(220,270,160,[[-.5,-.5],[.35,-.55],[-.1,-.42],[.62,-.2],[-.58,.35],[-.28,.72],[.48,.22]]),A.p(R.line(60,270,380,270,.3),"k",4.5),A.tx("d = 30 cm",140,254,32),A.p(R.line(220,270,220,430,.3),"r",5),A.tx("r = 15 cm",300,385,32,"r"),
   A.tx(`r = 30 ${DIVS()} 2 = 15 cm`,SX,120,32,"r"),A.tx(fA(),SX,190,fitS(fA(),300,38)),A.tx(`${AL()} ≈ ${PI()} ${M} 15 ${M} 15`,SX,260,fitS(`${AL()} ≈ 3,14 · 15 · 15`,300,36)),A.hl(SX-155,300,310,64),A.tx(`${AL()} ≈ ${nf(706.5)} cm²`,SX,346,fitS(`${AL()} ≈ 706,5 cm²`,290,42),"g")]}},
 {say:t3("Är en pizza på 40 cm dubbelt så stor som en på 20 cm? Nej! Radien blir dubbelt så lång, så arean blir 2 · 2 = 4 gånger så stor.",
   "Is a 40 cm pizza twice as big as a 20 cm one? No! The radius is twice as long, so the area is 2 × 2 = 4 times as big.",
   "هل بيتزا قطرها 40 سم ضعف بيتزا قطرها 20 سم؟ لا! نصف القطر يصبح الضعف، فتصبح المساحة 2 × 2 = 4 أضعاف."),
  draw:()=>{const M=MUL();return[A.wipe(),...pizza(110,220,60),...pizza(330,260,120),A.p(R.rect(110,160,60,60,.2),"b",3),A.hatch("M110,160h60v60h-60Z","b"),A.p(R.rect(330,140,120,120,.2)+R.line(390,140,390,260,.1)+R.line(330,200,450,200,.1),"b",3),A.hatch("M330,140h120v120h-120Z","b"),
   A.tx("20 cm",110,320,32),A.tx("40 cm",330,425,32),A.tx(`${PI()} ${M} 10 ${M} 10 = 314`,630,120,30),A.tx(`${PI()} ${M} 20 ${M} 20 = ${fmt(1256)}`,630,185,30),A.tx(`${fmt(1256)} ${DIVS()} 314 = 4`,630,260,34,"b"),
   A.hl(500,300,260,64),A.tx(T("4 gånger så stor!","4 times as big!","4 أضعاف!"),630,346,36,"g")]}}
]};
LESSONS.push({id:"circ7",subject:"math",grades:"7",kind:"wb",
 title:t3("Cirkelns omkrets och area","Circumference and area of a circle","محيط الدائرة ومساحتها"),
 icon:ICO(`<circle cx="105" cy="92" r="66" fill="#e07b00" fill-opacity=".12" stroke="#1d2433" stroke-width="5"/><path d="M105 92H171" stroke="#d63b2f" stroke-width="4"/><circle cx="105" cy="92" r="5" fill="#1d2433"/><text x="138" y="82" ${CV} font-size="28" fill="#d63b2f">r</text><text x="245" y="112" ${CV} font-size="84" fill="#2257c9">π</text><text x="245" y="160" ${CV} font-size="26" fill="#1e9e5a">≈ 3,14</text>`),
 steps:CIRC7.steps,mount:wbMount(CIRC7),
 gen(level){const M=MUL(),D=DIVS(),o=pick(COBJ),u=o.u;
  if(level===0){const byR=rint(0,1);let d=rint(o.lo,o.hi);if(byR&&d%2)d++;const r=d/2,ans=r2(3.14*d);
   const s=[...(byR?[A.tx(`d = 2 ${M} ${nf(r)} = ${nf(d)} ${u}`,SX,195,fitS(`d = 2 · ${r} = ${d} ${u}`,320,32),"b")]:[]),A.tx(fO(),SX,byR?260:230,fitS(fO(),320,34)),A.tx(`${OL()} ≈ ${PI()} ${M} ${nf(d)}`,SX,byR?325:300,fitS(`${OL()} ≈ 3,14 · ${d}`,320,34)),...res(`${OL()} ≈ ${nf(ans)} ${u}`,SX,415,330,40)];
   return{kind:"num",dec:true,ans,show:`${nf(ans)} ${u}`,q:cQ(o,byR?"r":"d",byR?r:d,askO()),sol:s}}
  if(level===1){const byD=rint(0,1);let d=rint(o.lo,o.hi);if(d%2)d++;const r=d/2,ans=r2(3.14*r*r);
   const s=[...(byD?[A.tx(`r = ${nf(d)} ${D} 2 = ${nf(r)} ${u}`,SX,195,fitS(`r = ${d} / 2 = ${r} ${u}`,320,32),"b")]:[]),A.tx(fA(),SX,byD?260:230,fitS(fA(),320,34)),A.tx(`${AL()} ≈ ${PI()} ${M} ${nf(r)} ${M} ${nf(r)}`,SX,byD?325:300,fitS(`${AL()} ≈ 3,14 · ${r} · ${r}`,320,34)),...res(`${AL()} ≈ ${nf(ans)} ${u}²`,SX,415,330,40)];
   return{kind:"num",dec:true,ans,show:`${nf(ans)} ${u}²`,q:cQ(o,byD?"d":"r",byD?d:r,askA()),sol:s}}
  const t=rint(0,2);
  if(t===0){const d=rint(o.lo,o.hi),O=r2(3.14*d);
   return{kind:"num",dec:true,ans:d,show:`${d} ${u}`,q:cQ(o,"O",O,askD()),
    sol:[A.tx(fO(),SX,215,fitS(fO(),320,34)),A.tx(`d = ${OL()} ${D} π`,SX,280,fitS(`d = ${OL()} / π`,320,34)),A.tx(`d ≈ ${nf(O)} ${D} ${PI()}`,SX,345,fitS(`d ≈ ${O} / 3,14`,320,34)),...res(`d ≈ ${nf(d)} ${u}`,SX,430,300,40)]}}
  if(t===1){const d=2*rint(3,8),r=d/2,full=r2(3.14*r*r),ans=r2(full/2),ctx=T(`En scen har formen av en halvcirkel med diametern ${d} m.`,`A stage is shaped like a half circle with a diameter of ${d} m.`,`مسرح على شكل نصف دائرة قطرها ${d} م.`);
   const cx=215,cy=400,R0=165,half=`M${cx-R0},${cy}A${R0},${R0} 0 0 1 ${cx+R0},${cy}Z`;
   return{kind:"num",dec:true,ans,show:`${nf(ans)} m²`,q:[A.wipe(),A.tx(ctx,400,58,fitS(ctx,760,32)),A.tx(askA(),400,106,fitS(askA(),760,30),"b"),A.hatch(half,"o"),A.p(half,"k",4.5),A.p(dots([[cx,cy]]),"k",10),A.tx(`d = ${d} m`,cx,cy+44,32,"r"),A.p(R.line(cx-R0,cy+10,cx+R0,cy+10,.2),"r",3)],
    sol:[A.p(R.line(cx,cy,...P(cx,cy,R0,60),.2),"b",4),A.tx("r",cx+52,cy-90,30,"b"),A.tx(`r = ${d} ${D} 2 = ${r} m`,SX,190,30,"b"),A.tx(T("hel cirkel:","whole circle:","الدائرة كاملة:"),SX,240,28),A.tx(`${PI()} ${M} ${r} ${M} ${r} = ${nf(full)}`,SX,290,fitS(`3,14 · ${r} · ${r} = ${full}`,320,32)),
     A.tx(T("halva:","half:","النصف:"),SX-100,345,28),A.tx(`${nf(full)} ${D} 2`,SX+30,345,32),...res(`${AL()} ≈ ${nf(ans)} m²`,SX,432,320,38)]}}
  let d=rint(o.lo,o.hi);if(d%2)d++;const O=r2(3.14*d),r=d/2,ans=r2(3.14*r*r);
  return{kind:"num",dec:true,ans,show:`${nf(ans)} ${u}²`,q:cQ(o,"O",O,askA()),
   sol:[A.tx(`d ≈ ${nf(O)} ${D} ${PI()} = ${nf(d)}`,SX,205,fitS(`d ≈ ${O} / 3,14 = ${d}`,320,30),"b"),A.tx(`r = ${nf(d)} ${D} 2 = ${nf(r)}`,SX,262,fitS(`r = ${d} / 2 = ${r}`,320,30),"b"),A.tx(`${AL()} ≈ ${PI()} ${M} ${nf(r)} ${M} ${nf(r)}`,SX,325,fitS(`${AL()} ≈ 3,14 · ${r} · ${r}`,320,32)),...res(`${AL()} ≈ ${nf(ans)} ${u}²`,SX,420,330,40)]}}
});
Object.assign(HELPX,{circ7:[
 {say:t3("Linda ett snöre runt en tallrik och sträck ut det. Snöret är lika långt som tre diametrar och lite till, ungefär 3,14 diametrar.",
   "Wrap a string round a plate and stretch it out. The string is as long as three diameters and a bit more, about 3.14 diameters.",
   "لُفّ خيطًا حول طبق ثم مدّه. طول الخيط ثلاثة أقطار وقليل، أي نحو 3.14 قطر."),
  draw:()=>{const cx=150,cy=190,r=80,x0=70,y=400,d=2*r,o=[A.p(R.circ(cx,cy,r)+R.circ(cx,cy,r*.72),"k",4.5),A.p(R.circ(cx,cy,r+6),"o",3.5),A.p(R.line(cx-r,cy,cx+r,cy,.2),"r",4),A.tx("d",cx,cy-14,30,"r"),A.arrow(240,240,300,330,"o",20)];
   o.push(A.p(R.line(x0,y,x0+3.14*d,y,.2),"o",5));for(let i=0;i<3;i++)o.push(A.p(`M${x0+i*d},${y-12}v24`,"k",3),A.tx("d",x0+(i+.5)*d,y-20,32,"r"));o.push(A.p(`M${x0+3*d},${y-12}v24M${f1(x0+3.14*d)},${y-12}v24`,"k",3));
   o.push(A.tx(T("snöret ≈ 3,14 · d","string ≈ 3.14 × d","الخيط ≈ 3.14 × d"),520,200,40,"g"),A.tx(T("snöret = omkretsen","string = circumference","الخيط = المحيط"),520,140,30,"o"));return o}},
 {say:t3("Lägg cirkeln i en kvadrat av fyra rutor r · r. Cirkeln täcker inte allt, bara ungefär 3,14 rutor. Därför är arean π · r · r.",
   "Put the circle in a square made of four r × r squares. The circle doesn't cover them all, only about 3.14 squares. That's why the area is π × r × r.",
   "ضع الدائرة داخل مربع مكوّن من أربعة مربعات r × r. الدائرة لا تغطيها كلها، بل نحو 3.14 مربع فقط. لذلك المساحة π × r × r."),
  draw:()=>{const cx=230,cy=250,r=150;return[A.p(R.rect(cx-r,cy-r,2*r,2*r,.3)+R.line(cx,cy-r,cx,cy+r,.2)+R.line(cx-r,cy,cx+r,cy,.2),"#9aa8c4",3),A.hatch(`M${cx-r},${cy}a${r},${r} 0 1,0 ${2*r},0a${r},${r} 0 1,0 ${-2*r},0`,"b"),A.p(R.circ(cx,cy,r),"b",4.5),
   A.tx("r",cx+r/2,cy-r-12,36,"r"),A.tx("r",cx+r+24,cy-r/2+12,36,"r"),A.tx(T("4 rutor r · r","4 squares r × r","4 مربعات r × r"),590,150,32),A.tx(T("cirkeln ≈ 3,14 rutor","circle ≈ 3.14 squares","الدائرة ≈ 3.14 مربع"),590,230,32,"b"),A.hl(470,280,240,64),A.tx(`${AL()} ≈ ${PI()} ${MUL()} r ${MUL()} r`,590,326,fitS(`${AL()} ≈ 3,14 · r · r`,230,36),"g")]}}]});
Object.assign(HINTSX,{circ7:[
 {say:t3("Omkretsen är π gånger diametern. Har du radien? Dubbla den först.","The circumference is π times the diameter. Do you have the radius? Double it first.","المحيط = π × القطر. إذا كان لديك نصف القطر فضاعفه أولًا."),cut:noFin},
 {say:t3("Arean är π · r · r. Använd radien, inte diametern.","The area is π × r × r. Use the radius, not the diameter.","المساحة = π × r × r. استخدم نصف القطر، لا القطر."),cut:noFin},
 {say:t3("Ta det i flera steg: ta först fram diametern eller radien, sedan räknar du vidare.","Take it in steps: find the diameter or the radius first, then carry on.","احسب على خطوات: أوجد القطر أو نصف القطر أولًا، ثم أكمل."),cut:noFin}]});

/* ---------------------------------------------------------------- 3. units7: units of area and volume */
/* a staircase of units; dn: steps drawn as "multiply" arrows (down), up: steps drawn as "divide" arrows (up) */
function stair(U,f,x0,y0,dx,dy,bw,bh,sz,dn=[],up=[]){const X=i=>x0+i*dx,Y=i=>y0+i*dy,o=[];
 U.forEach((u,i)=>o.push(A.p(R.rect(X(i),Y(i),bw,bh,.4),"b",3.5),A.tx(u,X(i)+bw/2,Y(i)+bh/2+sz*.36,fitS(u,bw-14,sz),"b")));
 dn.forEach(k=>{const x1=X(k)+bw+6,y1=Y(k)+bh/2,x2=X(k+1)+bw*.62,y2=Y(k+1)-8;o.push(A.arrow(x1,y1,x2,y2,"g",-18),A.tx(`${MUL()} ${fmt(f)}`,(x1+x2)/2+20,(y1+y2)/2-6,30,"g","start"))});
 up.forEach(k=>{const x1=X(k+1)-8,y1=Y(k+1)+bh/2,x2=X(k)+bw*.38,y2=Y(k)+bh+8;o.push(A.arrow(x1,y1,x2,y2,"r",-18),A.tx(`${DIVS()} ${fmt(f)}`,(x1+x2)/2-20,(y1+y2)/2+28,30,"r","end"))});
 return o}
const UA=["m²","dm²","cm²"],UV=()=>["m³",`dm³ = l`,`cm³ = ml`];
const box3=(x,y,w,h,dx,dy,c="k")=>A.p(R.rect(x,y,w,h,.3)+plines([[x,y],[x+dx,y-dy],[x+w+dx,y-dy],[x+w,y]],false)+R.line(x+w+dx,y-dy,x+w+dx,y+h-dy,.2)+R.line(x+w+dx,y+h-dy,x+w,y+h,.2),c,4);
const UNI7={steps:[
 {say:t3("En kvadrat med sidan 1 dm, alltså 10 cm, rymmer 10 · 10 = 100 små rutor på 1 cm². Därför är 1 dm² = 100 cm².",
   "A square with sides of 1 dm, that is 10 cm, holds 10 × 10 = 100 small squares of 1 cm². So 1 dm² = 100 cm².",
   "مربع طول ضلعه 1 dm، أي 10 cm، يتّسع لـ 10 × 10 = 100 مربع صغير مساحة كل منها 1 cm². لذلك 1 dm² = 100 cm²."),
  draw:()=>{const x0=130,y0=120,u=30;let g="";for(let i=1;i<10;i++)g+=`M${x0+i*u},${y0}v${10*u}M${x0},${y0+i*u}h${10*u}`;
   return[A.wipe(),A.p(g,"#9aa8c4",1.6),A.p(R.rect(x0,y0,300,300,.4),"k",4.5),A.hatch(`M${x0},${y0}h${u}v${u}h${-u}Z`,"o"),A.tx("1 dm = 10 cm",x0+150,y0-16,32),A.tx("10 cm",x0-44,y0+160,28),
    A.arrow(x0+70,y0+66,x0+22,y0+22,"o"),qt("1 cm²",x0+100,y0+92,26,"o"),A.tx(`1 dm² = 10 ${MUL()} 10 cm²`,620,200,32),A.hl(490,240,260,64),A.tx("1 dm² = 100 cm²",620,286,40,"g")]}},
 {say:t3("Längdenheter hoppar tio gånger per steg, men areaenheter hoppar 10 · 10 = 100 gånger. Ner i trappan multiplicerar vi med 100, upp dividerar vi.",
   "Length units jump ten times per step, but area units jump 10 × 10 = 100 times. Down the staircase we multiply by 100, going up we divide.",
   "وحدات الطول تقفز عشر مرات في كل درجة، أما وحدات المساحة فتقفز 10 × 10 = 100 مرة. نزولًا في الدرج نضرب في 100، وصعودًا نقسم."),
  draw:()=>[A.wipe(),...stair(UA,100,60,80,160,115,120,62,40,[0,1],[0,1]),A.tx("1 m = 10 dm",650,110,34),A.tx("1 m² = 100 dm²",650,185,34,"b"),A.tx("1 dm² = 100 cm²",650,250,34,"b"),A.hl(515,300,270,64),A.tx(`1 m² = ${fmt(10000)} cm²`,650,346,fitS(`1 m² = 10 000 cm²`,260,36),"g")]},
 {say:t3("En kub med sidan 1 dm rymmer 10 · 10 · 10 = 1 000 små kuber på 1 cm³. Alltså är 1 dm³ = 1 000 cm³.",
   "A cube with sides of 1 dm holds 10 × 10 × 10 = 1,000 small cubes of 1 cm³. So 1 dm³ = 1,000 cm³.",
   "مكعب طول ضلعه 1 dm يتّسع لـ 10 × 10 × 10 = 1000 مكعب صغير حجم كل منها 1 cm³. إذن 1 dm³ = 1000 cm³."),
  draw:()=>{const x=80,y=190,s=230,dx=92,dy=70,u=s/10;let g="";for(let i=1;i<10;i++){g+=`M${f1(x+i*u)},${y}v${s}M${x},${f1(y+i*u)}h${s}`;g+=`M${f1(x+i*u)},${y}l${dx},${-dy}`;g+=`M${f1(x+i*dx/10)},${f1(y-i*dy/10)}h${s}`;g+=`M${x+s},${f1(y+i*u)}l${dx},${-dy}`;g+=`M${f1(x+s+i*dx/10)},${f1(y-i*dy/10)}v${s}`}
   return[A.wipe(),A.p(g,"#9aa8c4",1.4),box3(x,y,s,s,dx,dy),A.hatch(`M${x},${y}h${u}v${u}h${-u}Z`,"o"),A.tx("10 cm",x+s/2,y+s+40,30),A.tx("10 cm",x-42,y+s/2+10,28),A.tx("10 cm",x+s+dx/2+46,y-dy/2+4,28),
    A.tx(`10 ${MUL()} 10 ${MUL()} 10 = ${fmt(1000)}`,610,120,32),A.hl(480,152,260,62),A.tx(`1 dm³ = ${fmt(1000)} cm³`,610,198,fitS(`1 dm³ = 1 000 cm³`,250,38),"g")]}},
 {say:t3("Och här är det smarta: 1 dm³ är exakt 1 liter, och 1 cm³ är 1 milliliter. En burk läsk på 330 ml är alltså 330 cm³.",
   "And here's the clever part: 1 dm³ is exactly 1 litre, and 1 cm³ is 1 millilitre. So a 330 ml can of soda is 330 cm³.",
   "وهنا الفكرة الذكية: 1 dm³ يساوي لترًا واحدًا بالضبط، و1 cm³ يساوي مليلترًا واحدًا. إذن علبة مشروب سعتها 330 ml حجمها 330 cm³."),
  draw:()=>[A.tx("1 dm³ = 1 l",610,300,40,"b"),A.tx("1 cm³ = 1 ml",610,370,40,"o"),A.p(R.rect(500,398,46,74,.2)+R.line(500,412,546,412,.1),"r",4),A.tx("330 ml = 330 cm³",566,448,fitS("330 ml = 330 cm³",225,32),"r","start")]},
 {say:t3("Volymenheter hoppar 10 · 10 · 10 = 1 000 gånger per steg. Så 1 m³ = 1 000 dm³ = 1 000 liter, ungefär fem badkar fulla med vatten.",
   "Volume units jump 10 × 10 × 10 = 1,000 times per step. So 1 m³ = 1,000 dm³ = 1,000 litres, about five bathtubs full of water.",
   "وحدات الحجم تقفز 10 × 10 × 10 = 1000 مرة في كل درجة. إذن 1 m³ = 1000 dm³ = 1000 لتر، أي نحو خمسة أحواض استحمام مملوءة بالماء."),
  draw:()=>[A.wipe(),...stair(UV(),1000,40,80,160,115,150,62,36,[0,1],[0,1]),A.tx(`1 m³ = ${fmt(1000)} dm³`,670,180,fitS("1 m³ = 1 000 dm³",220,32),"b"),A.hl(555,226,230,64),A.tx(`1 m³ = ${fmt(1000)} l`,670,272,fitS("1 m³ = 1 000 l",210,36),"g"),
   A.p(`M570,380h190v-50h-190Z`,"b",3.5),A.hatch("M576,348h178v30h-178Z","b"),A.p(R.line(585,380,585,396,.1)+R.line(745,380,745,396,.1),"b",3.5),A.tx(T("badkar ≈ 200 l","bathtub ≈ 200 l","حوض ≈ 200 l"),665,440,30)]},
 {say:t3("Ett akvarium är 50 cm långt, 30 cm djupt och 40 cm högt. Räkna i dm direkt: 5 · 3 · 4 = 60 dm³, alltså 60 liter vatten.",
   "An aquarium is 50 cm long, 30 cm deep and 40 cm high. Work in dm straight away: 5 × 3 × 4 = 60 dm³, so 60 litres of water.",
   "حوض أسماك طوله 50 cm وعمقه 30 cm وارتفاعه 40 cm. احسب بالـ dm مباشرة: 5 × 3 × 4 = 60 dm³، أي 60 لترًا من الماء."),
  draw:()=>{const x=110,y=200,w=250,h=200,dx=90,dy=66,M=MUL();return[A.wipe(),A.hatch(`M${x},${y+30}h${w}v${h-30}h${-w}Z`,"b"),box3(x,y,w,h,dx,dy),A.p(R.line(x,y+30,x+w,y+30,.2)+R.line(x+w,y+30,x+w+dx,y+30-dy,.1),"b",3),
   A.p(`M190,300q30,-26 60,0q-30,26 -60,0Zm60,0l18,-14v28Z`,"o",3.5),A.p(dots([[205,296]]),"k",6),A.tx("50 cm",x+w/2,y+h+40,30),A.tx("40 cm",x-46,y+h/2+10,28),A.tx("30 cm",x+w+dx/2+48,y+h-dy/2+6,28),
   A.tx(T("räkna i dm","work in dm","احسب بالـ dm"),630,110,30,"b"),A.tx(`5 ${M} 3 ${M} 4 = 60 dm³`,630,185,34),A.hl(510,226,240,64),A.tx("60 dm³ = 60 l",630,272,38,"g")]}}
]};
function uQ(qs,fam){return[A.wipe(),A.tx(qs,400,100,fitS(qs,740,58)),...(fam==="a"?stair(UA,100,60,150,150,105,120,58,38):stair(UV(),1000,40,150,150,105,150,58,34))]}
const UPOS={"m²":0,"dm²":1,"cm²":2,"m³":0,"dm³":1,"l":1,"cm³":2,"ml":2};
function convert(fam,from,to,v,qs){const f=fam==="a"?100:1000,i=UPOS[from],j=UPOS[to],down=j>i,ans=r2(down?v*f:v/f),M=MUL(),D=DIVS();
 const st=fam==="a"?stair(UA,100,60,150,150,105,120,58,38,down?[i]:[],down?[]:[j]):stair(UV(),1000,40,150,150,105,150,58,34,down?[i]:[],down?[]:[j]);
 const l1=down?`1 ${from} = ${fmt(f)} ${to}`:`${fmt(f)} ${from} = 1 ${to}`,l2=`${nf(v)} ${down?M:D} ${fmt(f)} = ${nf(ans)}`,l3=`${nf(v)} ${from} = ${nf(ans)} ${to}`;
 return{ans,sol:[...st.slice(6),A.tx(l1,650,240,fitS(l1,260,32),"b"),fin(A.tx(l2,650,315,fitS(l2,260,34))),...res(l3,650,410,280,38)]}}
LESSONS.push({id:"units7",subject:"math",grades:"7",kind:"wb",
 title:t3("Area- och volymenheter","Units of area and volume","وحدات المساحة والحجم"),
 icon:ICO(`<path d="M40 70H130V160H40ZM40 70L80 40H170L130 70M170 40V130L130 160" fill="none" stroke="#1d2433" stroke-width="4" stroke-linejoin="round"/><path d="M40 70H130V160H40Z" fill="#2257c9" fill-opacity=".12"/>${[1,2,3,4].map(i=>`<path d="M${40+i*18} 70V160M40 ${70+i*18}H130" stroke="#9aa8c4" stroke-width="1.5"/>`).join("")}<text x="240" y="85" ${CV} font-size="36" fill="#2257c9">1 dm³</text><text x="240" y="125" ${CV} font-size="36" fill="#1d2433">=</text><text x="240" y="165" ${CV} font-size="36" fill="#1e9e5a">1 l</text>`),
 steps:UNI7.steps,mount:wbMount(UNI7),
 gen(level){const M=MUL(),D=DIVS();
  if(level<2){const fam=level?"v":"a",U=level?pick([["m³","dm³"],["m³","l"],["dm³","cm³"],["dm³","ml"],["l","cm³"],["l","ml"]]):pick([["m²","dm²"],["dm²","cm²"]]),down=Math.random()<.55;
   const from=down?U[0]:U[1],to=down?U[1]:U[0],f=level?1000:100;let v;
   if(down)v=Math.random()<.5?rint(2,12):pick(level?[0.5,0.25,0.75,1.5,2.5,1.2,0.3,0.05,3.6]:[0.5,1.5,2.5,0.25,3.2,0.75,1.2,4.5]);
   else v=level?pick([rint(2,9)*1000,rint(1,19)*50,rint(11,49)*100]):pick([rint(2,40)*100,rint(1,9)*10,rint(11,99)*10]);
   const qs=`${nf(v)} ${from} = ? ${to}`,c=convert(fam,from,to,v,qs);
   return{kind:"num",dec:!Number.isInteger(c.ans),ans:c.ans,show:`${nf(c.ans)} ${to}`,q:uQ(qs,fam),sol:c.sol}}
  const t=rint(0,2);
  if(t===0){const Lc=pick([40,50,60,80,100]),W=pick([20,30,40,50]),H=pick([30,40,50,60]),V=Lc*W*H/1000;
   const ctx=T(`Ett akvarium är ${Lc} cm långt, ${W} cm djupt och ${H} cm högt. Hur många liter rymmer det?`,`An aquarium is ${Lc} cm long, ${W} cm deep and ${H} cm high. How many litres does it hold?`,`حوض أسماك طوله ${Lc} سم وعمقه ${W} سم وارتفاعه ${H} سم. كم لترًا يتّسع؟`);
   const k=Math.min(300/(Lc+W*.45),250/(H+W*.35)),w=Lc*k,h=H*k,dx=W*k*.45,dy=W*k*.35,x=60+(330-w-dx)/2,y=170+dy+(250-h-dy)/2;
   return{kind:"num",ans:V,show:`${V} l`,q:[A.wipe(),...para(ctx,400,52,30,46,40),A.hatch(`M${f1(x)},${f1(y+h*.15)}h${f1(w)}v${f1(h*.85)}h${f1(-w)}Z`,"b"),box3(x,y,w,h,dx,dy),A.tx(`${Lc} cm`,x+w/2,y+h+38,28),A.tx(`${H} cm`,x-40,y+h/2+10,26),A.tx(`${W} cm`,x+w+dx/2+42,y+h-dy/2+8,26)],
    sol:[A.tx("1 dm³ = 1 l",640,165,30,"b"),A.tx(`${Lc} cm = ${Lc/10} dm`,640,212,28),A.tx(`${W} cm = ${W/10} dm`,640,250,28),A.tx(`${H} cm = ${H/10} dm`,640,288,28),
     fin(A.tx(`${Lc/10} ${M} ${W/10} ${M} ${H/10} = ${V} dm³`,640,345,fitS(`${Lc/10} · ${W/10} · ${H/10} = ${V} dm³`,280,32))),...res(`= ${V} l`,640,430,200,42)]}}
  if(t===1){const s=pick([10,20,25,50]),Ar=rint(2,9),n=Ar*10000/(s*s);
   const ctx=T(`Ett golv på ${Ar} m² ska täckas med kvadratiska plattor med sidan ${s} cm. Hur många plattor behövs?`,`A floor of ${Ar} m² is to be covered with square tiles with ${s} cm sides. How many tiles are needed?`,`أرضية مساحتها ${Ar} م² ستُغطّى ببلاطات مربعة طول ضلعها ${s} سم. كم بلاطة نحتاج؟`);
   const x0=70,y0=170,W=330,H=230,tu=s*1.6;let g="";for(let i=0;i*tu<W*.55;i++)g+=`M${f1(x0+i*tu)},${y0+H}v${-H*.55}`;for(let j=0;j*tu<H*.55;j++)g+=`M${x0},${f1(y0+H-j*tu)}h${W*.55}`;
   return{kind:"num",ans:n,show:fmt(n),q:[A.wipe(),...para(ctx,400,52,30,46,40),A.p(R.rect(x0,y0,W,H,.3),"k",4.5),A.p(g,"#9aa8c4",2),A.hatch(`M${x0},${y0+H}h${f1(tu)}v${f1(-tu)}h${f1(-tu)}Z`,"o"),A.p(R.rect(x0,y0+H-tu,tu,tu,.1),"o",3.5),
     A.tx(`${Ar} m²`,x0+W*.72,y0+H*.36,40,"b"),qt(`${s} cm`,x0+tu/2,y0+H+30,26,"o")],
    sol:[A.tx(`1 m² = ${fmt(10000)} cm²`,640,165,fitS("1 m² = 10 000 cm²",270,30),"b"),A.tx(`${Ar} m² = ${fmt(Ar*10000)} cm²`,640,215,fitS(`${Ar} m² = ${Ar*10000} cm²`,270,30)),A.tx(`${s} ${M} ${s} = ${s*s} cm²`,640,268,30,"o"),
     fin(A.tx(`${fmt(Ar*10000)} ${D} ${s*s}`,640,330,32)),...res(`= ${fmt(n)}`,640,420,200,44)]}}
  const g=pick([200,250,300,500]),n=rint(3,8),V=g*n/1000;
  const ctx=T(`En kanna rymmer ${nf(V)} l saft. Hur många glas med ${g} cm³ i varje kan du fylla?`,`A jug holds ${nf(V)} l of juice. How many glasses of ${g} cm³ each can you fill?`,`إبريق فيه ${nf(V)} لتر من العصير. كم كوبًا سعة كل منه ${g} سم³ يمكنك أن تملأ؟`);
  const jx=90,jy=200;
  return{kind:"num",ans:n,show:`${n}`,q:[A.wipe(),...para(ctx,400,52,30,46,40),A.hatch(`M${jx},${jy+70}h120v170h-120Z`,"o"),A.p(R.rect(jx,jy,120,240,.3)+`M${jx},${jy}l-18,-16`+`M${jx+120},${jy+30}q56,0 56,60q0,60 -56,60`,"k",4.5),A.tx(`${nf(V)} l`,jx+60,jy+160,36),
    A.hatch(`M${300},${330}l8,110h44l8,-110Z`,"o"),A.p(`M296,300l12,140h44l12,-140`,"k",4),A.tx(`${g} cm³`,330,478,28,"b")],
   sol:[A.tx("1 l = 1 000 cm³".replace("1 000",fmt(1000)),640,190,30,"b"),A.tx(`${nf(V)} l = ${fmt(V*1000)} cm³`,640,250,fitS(`${V} l = ${V*1000} cm³`,270,32)),fin(A.tx(`${fmt(V*1000)} ${D} ${g}`,640,320,34)),...res(`= ${n}`,640,410,180,44)]}}
});
Object.assign(HELPX,{units7:[
 {say:t3("Ett golv på 1 m² kan täckas av 10 rader med 10 plattor på 1 dm². Det blir 100 plattor, så 1 m² = 100 dm².",
   "A floor of 1 m² can be covered by 10 rows of 10 tiles of 1 dm². That's 100 tiles, so 1 m² = 100 dm².",
   "يمكن تغطية أرضية مساحتها 1 m² بعشرة صفوف في كل منها 10 بلاطات مساحة كل منها 1 dm². هذه 100 بلاطة، إذن 1 m² = 100 dm²."),
  draw:()=>{const x0=90,y0=110,u=30;let g="";for(let i=1;i<10;i++)g+=`M${x0+i*u},${y0}v300M${x0},${y0+i*u}h300`;return[A.p(g,"#9aa8c4",2),A.p(R.rect(x0,y0,300,300,.4),"k",4.5),A.hatch(`M${x0},${y0}h300v${u}h-300Z`,"o"),A.hatch(`M${x0},${y0+u}h${u}v${u}h${-u}Z`,"g"),
   A.tx("1 m",x0+150,y0-16,32),A.tx("1 m",x0-40,y0+160,30),A.tx(T("10 plattor i en rad","10 tiles in a row","10 بلاطات في الصف"),600,150,30,"o"),A.tx(`10 ${MUL()} 10 = 100`,600,230,36),A.hl(470,270,260,64),A.tx("1 m² = 100 dm²",600,316,40,"g")]}},
 {say:t3("Fyll en låda på 1 dm³ med sockerbitar på 1 cm³. Ett lager är 10 · 10 = 100 bitar, och tio lager blir 1 000 bitar. Lådan rymmer 1 liter.",
   "Fill a 1 dm³ box with sugar cubes of 1 cm³. One layer is 10 × 10 = 100 cubes, and ten layers make 1,000 cubes. The box holds 1 litre.",
   "املأ صندوقًا حجمه 1 dm³ بمكعبات سكر حجم كل منها 1 cm³. الطبقة الواحدة 10 × 10 = 100 مكعب، وعشر طبقات تساوي 1000 مكعب. الصندوق يتّسع للتر واحد."),
  draw:()=>{const x=90,y=170,s=230,dx=92,dy=70,u=s/10,ly=y+s-u;let g="";for(let i=1;i<10;i++)g+=`M${f1(x+i*u)},${f1(ly)}v${f1(u)}M${f1(x+i*u)},${f1(ly)}l${dx},${-dy}`;
   return[A.hatch(`M${x},${f1(ly)}h${s}l${dx},${-dy}h${-s}Z`,"o"),A.hatch(`M${x},${f1(ly)}h${s}v${f1(u)}h${-s}Z`,"o"),A.p(g,"o",1.6),box3(x,y,s,s,dx,dy),A.p(R.line(x,ly,x+s,ly,.1),"o",3),
    A.tx(T("1 lager = 100 bitar","1 layer = 100 cubes","طبقة = 100 مكعب"),610,150,30,"o"),A.tx(T("10 lager = 1 000 bitar","10 layers = 1,000 cubes","10 طبقات = 1000 مكعب").replace("1 000",fmt(1000)),610,220,30),A.hl(490,262,240,64),A.tx(`${fmt(1000)} cm³ = 1 l`,610,308,fitS("1 000 cm³ = 1 l",225,36),"g")]}}]});
Object.assign(HINTSX,{units7:[
 {say:t3("För area är varje steg i trappan · 100. Ner till en mindre enhet: multiplicera. Upp: dividera.","For area each step on the staircase is × 100. Down to a smaller unit: multiply. Up: divide.","في المساحة كل درجة في الدرج × 100. نزولًا إلى وحدة أصغر نضرب، وصعودًا نقسم."),cut:noFin},
 {say:t3("För volym är varje steg · 1 000. Kom ihåg: 1 dm³ = 1 l och 1 cm³ = 1 ml.","For volume each step is × 1,000. Remember: 1 dm³ = 1 l and 1 cm³ = 1 ml.","في الحجم كل درجة × 1000. تذكّر: 1 dm³ = 1 l و 1 cm³ = 1 ml."),cut:noFin},
 {say:t3("Gör först om till samma enhet. Sedan räknar du.","First change everything to the same unit. Then calculate.","حوّل أولًا كل شيء إلى الوحدة نفسها، ثم احسب."),cut:noFin}]});

/* ---------------------------------------------------------------- 4. comp7: composite shapes */
function lpts(W,H,w1,h1,mir){return mir?[[W-w1,0],[W,0],[W,H],[0,H],[0,h1],[W-w1,h1]]:[[0,0],[w1,0],[w1,h1],[W,h1],[W,H],[0,H]]}
const LROLE=mir=>mir?{top:0,full:1,bottom:2,short:3,stepH:4,stepV:5}:{top:0,stepV:1,stepH:2,short:3,bottom:4,full:5};
/* label for edge k of a clockwise polygon, outside it (or inside with inw) */
function eLab(pp,k,s,c="k",size=30,inw=false){const p=pp[k],q=pp[(k+1)%pp.length],mx=(p[0]+q[0])/2,my=(p[1]+q[1])/2,l=Math.hypot(q[0]-p[0],q[1]-p[1]),nx=(q[1]-p[1])/l*(inw?-1:1),ny=-(q[0]-p[0])/l*(inw?-1:1);
 const w=String(s).length*size*.46;
 if(Math.abs(ny)>.5)return A.tx(s,mx,ny<0?my-14:my+size*.86+8,size,c);return A.tx(s,mx+nx*(w/2+14),my+size*.35,size,c)}
/* fixed L for the lesson: 8 × 6 m with a 3 × 2 m corner missing */
const LP=lpts(8,6,5,2,false).map(([x,y])=>[80+x*42,110+y*42]);
const COMP7={steps:[
 {say:t3("Golvet i ett rum har formen av ett L. Dela det i två rektanglar, räkna ut varje area och lägg ihop: 10 + 32 = 42 m².",
   "The floor of a room is L-shaped. Split it into two rectangles, work out each area and add them: 10 + 32 = 42 m².",
   "أرضية غرفة على شكل حرف L. قسّمها إلى مستطيلين، واحسب مساحة كل منهما، ثم اجمع: 10 + 32 = 42 m²."),
  draw:()=>{const M=MUL();return[A.wipe(),A.p(plines(LP),"k",4.5),eLab(LP,0,"5 m"),eLab(LP,1,"2 m"),eLab(LP,4,"8 m"),eLab(LP,5,"6 m"),
   A.p(R.dashed(80,194,290,194),"k",3),A.hatch("M80,110H290V194H80Z","o"),A.hatch("M80,194H416V362H80Z","b"),eLab(LP,3,"4 m","b"),
   A.tx("6 − 2 = 4",620,120,30,"b"),A.tx(`5 ${M} 2 = 10`,620,190,36,"o"),A.tx(`8 ${M} 4 = 32`,620,255,36,"b"),A.hl(490,292,260,64),A.tx("10 + 32 = 42 m²",620,338,38,"g")]}},
 {say:t3("Eller tvärtom: räkna hela rektangeln, 8 · 6 = 48 m², och ta bort hörnet som fattas, 3 · 2 = 6 m². Samma svar: 42 m².",
   "Or the other way round: work out the whole rectangle, 8 × 6 = 48 m², and take away the missing corner, 3 × 2 = 6 m². Same answer: 42 m².",
   "أو بالعكس: احسب المستطيل كله، 8 × 6 = 48 m²، واطرح الركن الناقص، 3 × 2 = 6 m². الجواب نفسه: 42 m²."),
  draw:()=>{const M=MUL();return[A.wipe(),A.hatch("M80,110H416V362H80Z","b"),A.hatch("M290,110H416V194H290Z","r"),A.p(plines(LP),"k",4.5),A.p(R.dashed(290,110,416,110)+R.dashed(416,110,416,194),"r",3.5),
   eLab(LP,0,"5 m"),A.tx("3 m",353,96,30,"r"),eLab(LP,4,"8 m"),eLab(LP,5,"6 m"),A.tx("2 m",452,162,30,"r"),
   A.tx("8 − 5 = 3",620,110,30,"r"),A.tx(`8 ${M} 6 = 48`,620,180,36,"b"),A.tx(`3 ${M} 2 = 6`,620,245,36,"r"),A.hl(490,282,260,64),A.tx("48 − 6 = 42 m²",620,328,38,"g")]}},
 {say:t3("Omkretsen är vägen runt kanten. Två sidor saknas: 8 − 5 = 3 m och 6 − 2 = 4 m. Omkretsen blir 5 + 2 + 3 + 4 + 8 + 6 = 28 m.",
   "The perimeter is the way round the edge. Two sides are missing: 8 − 5 = 3 m and 6 − 2 = 4 m. The perimeter is 5 + 2 + 3 + 4 + 8 + 6 = 28 m.",
   "المحيط هو الطريق حول الحافة. ينقصنا ضلعان: 8 − 5 = 3 m و 6 − 2 = 4 m. المحيط = 5 + 2 + 3 + 4 + 8 + 6 = 28 m."),
  draw:()=>[A.wipe(),A.p(plines(LP),"r",7),eLab(LP,0,"5 m"),eLab(LP,1,"2 m"),eLab(LP,2,"3 m","o",30,true),eLab(LP,3,"4 m","o"),eLab(LP,4,"8 m"),eLab(LP,5,"6 m"),
   A.tx("8 − 5 = 3",620,110,30,"o"),A.tx("6 − 2 = 4",620,160,30,"o"),A.tx("5 + 2 + 3 + 4 + 8 + 6",620,240,32),A.hl(520,276,200,64),A.tx("= 28 m",620,322,42,"g")]},
 {say:t3("Du ska måla en vägg som är 5 m bred och 2,5 m hög, men inte dörren. Väggen minus dörren: 12,5 − 2 = 10,5 m² ska målas.",
   "You're painting a wall that is 5 m wide and 2.5 m high, but not the door. The wall minus the door: 12.5 − 2 = 10.5 m² to paint.",
   "ستطلي جدارًا عرضه 5 m وارتفاعه 2.5 m، لكن ليس الباب. الجدار ناقص الباب: 12.5 − 2 = 10.5 m² للطلاء."),
  draw:()=>{const M=MUL();return[A.wipe(),A.hatch("M90,150h320v160h-320ZM282,182v128h64v-128Z","b"),A.p(R.rect(90,150,320,160,.4),"k",4.5),A.p(R.rect(282,182,64,128,.3)+R.circ(334,250,4),"r",4),
   A.tx("5 m",250,136,32),A.tx(`${dfmt(2.5)} m`,48,240,30),A.tx("1 m",314,344,28,"r"),A.tx("2 m",380,256,28,"r"),A.hatch("M100,392h90v28h-90Z","o"),A.p(R.rect(100,392,90,28,.2),"o",4),A.p(R.line(145,420,145,442,.1)+R.line(145,442,128,480,.1),"k",4.5),
   A.tx(`5 ${M} ${dfmt(2.5)} = ${dfmt(12.5)}`,620,150,34,"b"),A.tx(`1 ${M} 2 = 2`,620,220,34,"r"),A.hl(480,256,280,64),A.tx(`${dfmt(12.5)} − 2 = ${dfmt(10.5)} m²`,620,302,fitS("12,5 − 2 = 10,5 m²",270,36),"g")]}},
 {say:t3("En idrottsplan är en rektangel med en halvcirkel i varje ände. Två halvcirklar blir en hel cirkel med radien 30 m. Arean blir 6 000 + 2 826 = 8 826 m².",
   "A sports field is a rectangle with a half circle at each end. Two half circles make one whole circle with radius 30 m. The area is 6,000 + 2,826 = 8,826 m².",
   "ملعب رياضي مستطيل في كل طرف منه نصف دائرة. نصفا الدائرة يكوّنان دائرة كاملة نصف قطرها 30 m. المساحة = 6000 + 2826 = 8826 m²."),
  draw:()=>{const M=MUL();return[A.wipe(),A.hatch("M130,192H390V348H130Z","b"),A.hatch("M130,192A78,78 0 0 0 130,348Z","o"),A.hatch("M390,192A78,78 0 0 1 390,348Z","o"),
   A.p("M130,192H390A78,78 0 0 1 390,348H130A78,78 0 0 1 130,192Z","k",4.5),A.p(R.dashed(130,192,130,348)+R.dashed(390,192,390,348),"k",3),A.tx("100 m",260,176,32),A.tx("60 m",180,280,30),A.p(R.line(390,270,468,270,.1),"o",3.5),A.tx("30 m",430,256,28,"o"),
   A.tx(`100 ${M} 60 = ${fmt(6000)}`,630,110,32,"b"),A.tx(T("2 halvcirklar = 1 cirkel","2 half circles = 1 circle","نصفا دائرة = دائرة"),630,170,fitS("2 halvcirklar = 1 cirkel",280,28),"o"),A.tx(`${PI()} ${M} 30 ${M} 30 = ${fmt(2826)}`,630,232,fitS("3,14 · 30 · 30 = 2 826",280,30),"o"),
   A.tx(`${fmt(6000)} + ${fmt(2826)}`,630,300,32),A.hl(510,334,240,64),A.tx(`= ${fmt(8826)} m²`,630,380,40,"g")]}},
 {say:t3("Omkretsen är bara den yttre kanten: två raksträckor och en hel cirkel. 2 · 100 + 3,14 · 60 = 388,4 m, nästan ett varv på en 400-metersbana.",
   "The perimeter is only the outer edge: two straights and one whole circle. 2 × 100 + 3.14 × 60 = 388.4 m, almost one lap of a 400 m track.",
   "المحيط هو الحافة الخارجية فقط: ضلعان مستقيمان ودائرة كاملة. 2 × 100 + 3.14 × 60 = 388.4 m، أي قرابة دورة على مضمار 400 متر."),
  draw:()=>{const M=MUL();return[A.wipe(),A.p(R.dashed(130,192,130,348)+R.dashed(390,192,390,348),"#9aa8c4",3),A.p("M130,192H390A78,78 0 0 1 390,348H130A78,78 0 0 1 130,192Z","r",7),
   A.tx("100 m",260,176,32),A.tx("60 m",260,394,30,"o"),A.p(R.line(130,372,390,372,.1)+"M130,362v20M390,362v20","o",2.5),A.tx(T("räknas inte","not counted","لا يُحسب"),260,278,28,"#7b879f"),A.arrow(190,288,140,300,"#9aa8c4"),A.arrow(330,288,380,300,"#9aa8c4"),
   A.tx(`2 ${M} 100 = 200`,630,120,32,"b"),A.tx(`${PI()} ${M} 60 = ${nf(188.4)}`,630,190,32,"o"),A.tx(`200 + ${nf(188.4)}`,630,260,32),A.hl(510,294,240,64),A.tx(`= ${nf(388.4)} m`,630,340,40,"g"),A.tx(T("nästan 400 m!","almost 400 m!","قرابة 400 m!"),630,420,32,"b")]}}
]};
LESSONS.push({id:"comp7",subject:"math",grades:"7",kind:"wb",
 title:t3("Sammansatta figurer","Composite shapes","الأشكال المركّبة"),
 icon:ICO(`<path d="M40 40H150V80H230V150H40Z" fill="#2257c9" fill-opacity=".14"/><path d="M40 40H150V80H40Z" fill="#e07b00" fill-opacity=".2"/><path d="M40 40H150V80H230V150H40Z" fill="none" stroke="#1d2433" stroke-width="5" stroke-linejoin="round"/><path d="M40 80H150" stroke="#1d2433" stroke-width="3" stroke-dasharray="7 6"/><path d="M230 80A35 35 0 0 1 230 150" fill="#e07b00" fill-opacity=".2" stroke="#1d2433" stroke-width="5"/>`),
 steps:COMP7.steps,mount:wbMount(COMP7),
 gen(level){const M=MUL(),D=DIVS();
  if(level<2&&(level===0||rint(0,1))){let W,H,w1,h1;do{W=rint(6,12);H=rint(5,10);w1=rint(2,W-3);h1=rint(2,H-2)}while(H>W+1);
   const mir=rint(0,1)===1,R0=LROLE(mir),u=Math.min(40,320/W,280/H),x0=85+(320-W*u)/2,y0=110+(290-H*u)/2,pp=lpts(W,H,w1,h1,mir).map(([x,y])=>[x0+x*u,y0+y*u]);
   const q=[A.wipe(),A.tx(T("Golvet har formen av ett L.","The floor is L-shaped.","الأرضية على شكل حرف L."),625,100,28),A.tx(level?T("Hur lång är omkretsen?","How long is the perimeter?","ما طول المحيط؟"):T("Hur stor är arean?","What is the area?","ما المساحة؟"),625,150,34,"b"),A.p(plines(pp),"k",4.5)];
   const xL=mir?x0+(W-w1)*u:x0,xR=xL+w1*u,yS=y0+h1*u;
   if(level===0){q.push(eLab(pp,R0.top,`${w1} m`),eLab(pp,R0.stepV,`${h1} m`),eLab(pp,R0.short,`${H-h1} m`),eLab(pp,R0.bottom,`${W} m`));
    const a1=w1*h1,a2=W*(H-h1),tot=a1+a2;
    return{kind:"num",ans:tot,show:`${tot} m²`,q,sol:[A.p(R.dashed(xL,yS,xR,yS),"k",3),A.hatch(`M${f1(xL)},${f1(y0)}H${f1(xR)}V${f1(yS)}H${f1(xL)}Z`,"o"),A.hatch(`M${f1(x0)},${f1(yS)}H${f1(x0+W*u)}V${f1(y0+H*u)}H${f1(x0)}Z`,"b"),
     A.tx(`${w1} ${M} ${h1} = ${a1}`,625,225,34,"o"),A.tx(`${W} ${M} ${H-h1} = ${a2}`,625,290,34,"b"),...res(`${a1} + ${a2} = ${tot} m²`,625,385,290,38)]}}
   q.push(eLab(pp,R0.top,`${w1} m`),eLab(pp,R0.stepV,`${h1} m`),eLab(pp,R0.bottom,`${W} m`),eLab(pp,R0.full,`${H} m`));
   const sides=pp.map((p,k)=>{const n=pp[(k+1)%6];return Math.round((Math.abs(n[0]-p[0])+Math.abs(n[1]-p[1]))/u)}),tot=2*(W+H),sum=sides.join(" + ");
   return{kind:"num",ans:tot,show:`${tot} m`,q,sol:[A.p(plines(pp),"r",7),eLab(pp,R0.stepH,`${W-w1} m`,"o",30,true),eLab(pp,R0.short,`${H-h1} m`,"o"),A.tx(`${W} − ${w1} = ${W-w1}`,625,220,30,"o"),A.tx(`${H} − ${h1} = ${H-h1}`,625,265,30,"o"),
    A.tx(sum,625,325,fitS(sum,300,30)),...res(`= ${tot} m`,625,410,200,42)]}}
  if(level===1){let a,b,w,u;do{a=pick([30,40,50,60]);b=pick([20,30,40,50].filter(v=>v<a));w=pick([2,3,4,5]);u=Math.min(300/a,270/b)}while((b-2*w)*u<95);const c=a-2*w,d=b-2*w,x0=100+(300-a*u)/2,y0=140+(270-b*u)/2,ab=a*b,cd=c*d;
   const q=[A.wipe(),A.tx(T("En tavla har en ram runt sig.","A picture has a frame round it.","لوحة حولها إطار."),625,100,28),A.tx(T("Hur stor area har ramen?","What is the area of the frame?","ما مساحة الإطار؟"),625,150,32,"b"),
    A.hatch(`M${f1(x0)},${f1(y0)}h${f1(a*u)}v${f1(b*u)}h${f1(-a*u)}ZM${f1(x0+w*u)},${f1(y0+w*u)}v${f1(d*u)}h${f1(c*u)}v${f1(-d*u)}Z`,"o"),A.p(R.rect(x0,y0,a*u,b*u,.3)+R.rect(x0+w*u,y0+w*u,c*u,d*u,.2),"k",4),
    A.p(`M${f1(x0+(w+c*.42)*u)},${f1(y0+(w+d)*u-6)}l${f1(c*u*.18)},${f1(-d*u*.3)}l${f1(c*u*.12)},${f1(d*u*.14)}l${f1(c*u*.12)},${f1(-d*u*.2)}l${f1(c*u*.12)},${f1(d*u*.36)}`,"#9aa8c4",3),
    A.tx(`${a} cm`,x0+a*u/2,y0-14,30),A.tx(`${b} cm`,x0-12,y0+b*u/2+10,28,"k","end"),A.tx(`${c} cm`,x0+a*u/2,y0+w*u+32,28,"b"),A.tx(`${d} cm`,x0+w*u+10,y0+(w+d/2)*u+22,28,"b","start")];
   return{kind:"num",ans:ab-cd,show:`${ab-cd} cm²`,q,sol:[A.tx(T("hela − hålet","whole − hole","الكل − الفتحة"),625,215,30,"r"),A.tx(`${a} ${M} ${b} = ${fmt(ab)}`,625,270,32),A.tx(`${c} ${M} ${d} = ${fmt(cd)}`,625,325,32,"b"),...res(`${fmt(ab)} − ${fmt(cd)} = ${fmt(ab-cd)} cm²`,625,415,300,36)]}}
  const per=rint(0,1),win=rint(0,1);
  if(win){let w,h;do{w=2*rint(3,7);h=rint(6,16)}while(h<w*.8||h>w*1.6);const r=w/2,semi=r2(1.57*r*r),rect=w*h,arcL=r2(1.57*w);
   const u=Math.min(300/w,290/(h+r)),x0=60+(330-w*u)/2,yb=440,yt=yb-h*u,cx=x0+w*u/2;
   const askS=per?T("Hur lång är omkretsen? Räkna med π ≈ 3,14.","How long is the perimeter? Use π ≈ 3.14.","ما طول المحيط؟ استخدم π ≈ 3.14."):askA();
   const ctx=T("Ett fönster är en rektangel med en halvcirkel ovanpå.","A window is a rectangle with a half circle on top.","نافذة على شكل مستطيل فوقه نصف دائرة.");
   const shape=`M${f1(x0)},${f1(yb)}V${f1(yt)}A${f1(r*u)},${f1(r*u)} 0 0 1 ${f1(x0+w*u)},${f1(yt)}V${f1(yb)}Z`;
   const q=[A.wipe(),A.tx(ctx,400,52,fitS(ctx,760,30)),A.tx(askS,400,96,fitS(askS,760,28),"b"),A.p(shape,"k",4.5),A.p(R.line(x0,yt,x0+w*u,yt,.2),"#9aa8c4",2.5),A.p(R.line(cx,yt,cx,yb,.2),"#9aa8c4",2.5),A.tx(`${w} dm`,cx,yb+36,28),A.tx(`${h} dm`,x0-42,(yt+yb)/2+10,26)];
   if(!per){const tot=r2(rect+semi);
    return{kind:"num",dec:true,ans:tot,show:`${nf(tot)} dm²`,q,sol:[A.hatch(`M${f1(x0)},${f1(yt)}h${f1(w*u)}V${f1(yb)}H${f1(x0)}Z`,"b"),A.hatch(`M${f1(x0)},${f1(yt)}A${f1(r*u)},${f1(r*u)} 0 0 1 ${f1(x0+w*u)},${f1(yt)}Z`,"o"),
     A.tx(`r = ${w} ${D} 2 = ${r}`,625,175,30,"o"),A.tx(`${w} ${M} ${h} = ${rect}`,625,230,32,"b"),A.tx(`${PI()} ${M} ${r} ${M} ${r} ${D} 2 = ${nf(semi)}`,625,288,fitS(`3,14 · ${r} · ${r} / 2 = ${semi}`,320,32),"o"),
     fin(A.tx(`${rect} + ${nf(semi)}`,625,345,32)),...res(`= ${nf(tot)} dm²`,625,432,250,40)]}}
   const tot=r2(w+2*h+arcL);
   return{kind:"num",dec:true,ans:tot,show:`${nf(tot)} dm`,q,sol:[A.p(shape,"r",7),A.tx(T("bara yttre kanten","only the outer edge","الحافة الخارجية فقط"),625,175,28,"r"),A.tx(`${w} + ${h} + ${h} = ${w+2*h}`,625,230,32,"b"),A.tx(`${PI()} ${M} ${w} ${D} 2 = ${nf(arcL)}`,625,288,fitS(`3,14 · ${w} / 2 = ${arcL}`,320,32),"o"),
    fin(A.tx(`${w+2*h} + ${nf(arcL)}`,625,345,32)),...res(`= ${nf(tot)} dm`,625,432,250,40)]}}
  const Lf=rint(6,12)*10,d=pick([30,40,50,60,70].filter(v=>v<Lf)),r=d/2,circ=r2(3.14*r*r),rect=Lf*d,perim=r2(2*Lf+3.14*d);
  const u=Math.min(330/(Lf+d),260/d),cx=235,cy=300,hw=Lf*u/2,rr=r*u,xa=cx-hw,xb=cx+hw,ya=cy-rr,yb=cy+rr;
  const ctx=T("En idrottsplan är en rektangel med en halvcirkel i varje ände.","A sports field is a rectangle with a half circle at each end.","ملعب رياضي مستطيل في كل طرف منه نصف دائرة.");
  const askS=per?T("Hur lång är omkretsen? Räkna med π ≈ 3,14.","How long is the perimeter? Use π ≈ 3.14.","ما طول المحيط؟ استخدم π ≈ 3.14."):askA();
  const outl=`M${f1(xa)},${f1(ya)}H${f1(xb)}A${f1(rr)},${f1(rr)} 0 0 1 ${f1(xb)},${f1(yb)}H${f1(xa)}A${f1(rr)},${f1(rr)} 0 0 1 ${f1(xa)},${f1(ya)}Z`;
  const q=[A.wipe(),A.tx(ctx,400,52,fitS(ctx,760,30)),A.tx(askS,400,96,fitS(askS,760,28),"b"),A.p(outl,"k",4.5),A.p(R.dashed(xa,ya,xa,yb)+R.dashed(xb,ya,xb,yb),"#9aa8c4",3),A.tx(`${Lf} m`,cx,ya-14,30),A.tx(`${d} m`,xa+36,cy+10,26)];
  if(!per){const tot=r2(rect+circ);
   return{kind:"num",dec:true,ans:tot,show:`${nf(tot)} m²`,q,sol:[A.hatch(`M${f1(xa)},${f1(ya)}H${f1(xb)}V${f1(yb)}H${f1(xa)}Z`,"b"),A.hatch(`M${f1(xa)},${f1(ya)}A${f1(rr)},${f1(rr)} 0 0 0 ${f1(xa)},${f1(yb)}Z`,"o"),A.hatch(`M${f1(xb)},${f1(ya)}A${f1(rr)},${f1(rr)} 0 0 1 ${f1(xb)},${f1(yb)}Z`,"o"),
    A.tx(`${Lf} ${M} ${d} = ${fmt(rect)}`,625,170,32,"b"),A.tx(T("2 halvcirklar = 1 cirkel","2 half circles = 1 circle","نصفا دائرة = دائرة"),625,222,fitS("2 halvcirklar = 1 cirkel",300,26),"o"),A.tx(`${PI()} ${M} ${r} ${M} ${r} = ${nf(circ)}`,625,280,fitS(`3,14 · ${r} · ${r} = ${circ}`,320,32),"o"),
    fin(A.tx(`${fmt(rect)} + ${nf(circ)}`,625,340,32)),...res(`= ${nf(tot)} m²`,625,430,270,40)]}}
  return{kind:"num",dec:true,ans:perim,show:`${nf(perim)} m`,q,sol:[A.p(outl,"r",7),A.tx(T("2 halvcirklar = 1 cirkel","2 half circles = 1 circle","نصفا دائرة = دائرة"),625,170,fitS("2 halvcirklar = 1 cirkel",300,26),"o"),A.tx(`2 ${M} ${Lf} = ${2*Lf}`,625,228,32,"b"),A.tx(`${PI()} ${M} ${d} = ${nf(3.14*d)}`,625,286,32,"o"),
   fin(A.tx(`${2*Lf} + ${nf(3.14*d)}`,625,345,32)),...res(`= ${nf(perim)} m`,625,432,250,40)]}}
});
Object.assign(HELPX,{comp7:[
 {say:t3("Tänk på en chokladkaka där någon har ätit ett hörn. Hela kakan har 6 · 4 = 24 rutor, hörnet 2 · 2 = 4. Kvar blir 24 − 4 = 20 rutor.",
   "Think of a chocolate bar with a corner eaten. The whole bar has 6 × 4 = 24 squares, the corner 2 × 2 = 4. That leaves 24 − 4 = 20 squares.",
   "فكّر في لوح شوكولاتة أُكل ركن منه. اللوح كله 6 × 4 = 24 مربعًا، والركن 2 × 2 = 4. يبقى 24 − 4 = 20 مربعًا."),
  draw:()=>{const M=MUL(),x=80,y=130,u=50,pts=[[x,y],[x+4*u,y],[x+4*u,y+2*u],[x+6*u,y+2*u],[x+6*u,y+4*u],[x,y+4*u]];let g="";
   for(let i=1;i<6;i++)g+=`M${x+i*u},${i<4?y:y+2*u}V${y+4*u}`;for(let j=1;j<4;j++)g+=`M${x},${y+j*u}H${j<2?x+4*u:x+6*u}`;
   return[A.hatch(`M${x},${y}h${4*u}v${2*u}h${2*u}v${2*u}h${-6*u}Z`,"o"),A.p(g,"#b07a3a",2.5),A.p(plines(pts),"#8a5a2b",5),A.p(R.dashed(x+4*u,y,x+6*u,y)+R.dashed(x+6*u,y,x+6*u,y+2*u),"r",3.5),A.tx(T("uppätet","eaten","مأكول"),x+5*u,y+u+10,26,"r"),
    A.tx(`6 ${M} 4 = 24`,620,170,36),A.tx(`2 ${M} 2 = 4`,620,240,36,"r"),A.hl(510,280,220,64),A.tx("24 − 4 = 20",620,326,40,"g"),A.tx(T("rutor kvar","squares left","مربعات باقية"),620,390,30)]}},
 {say:t3("En myra går runt kanten på figuren. Omkretsen är bara myrans väg. Linjen inuti, där vi delade figuren, räknas inte.",
   "An ant walks round the edge of the shape. The perimeter is only the ant's path. The line inside, where we split the shape, does not count.",
   "نملة تمشي حول حافة الشكل. المحيط هو طريق النملة فقط. الخط الداخلي الذي قسمنا به الشكل لا يُحسب."),
  draw:()=>{const pp=[[100,120],[300,120],[300,220],[440,220],[440,380],[100,380]];return[A.p(plines(pp),"k",4.5),A.p(R.dashed(100,220,300,220),"#9aa8c4",3),
   A.arrow(190,90,290,90,"o"),A.arrow(320,130,320,200,"o"),A.arrow(310,200,430,200,"o"),A.arrow(460,230,460,370,"o"),A.arrow(430,400,110,400,"o"),A.arrow(80,370,80,130,"o"),
   A.p(R.loop(120,104,13,9)+R.loop(141,104,8,7)+R.loop(157,103,7,6),"k",3),A.p("M136,98l-8,-9M142,97v-11M147,98l8,-9M136,110l-8,9M142,111v10M147,110l8,9M161,98l7,-9","k",2.5),
   A.tx(T("omkrets = kanten","perimeter = the edge","المحيط = الحافة"),625,170,30,"o"),A.tx(T("linjen inuti","the line inside","الخط الداخلي"),625,260,30,"#7b879f"),A.tx(T("räknas inte","does not count","لا يُحسب"),625,305,30,"r")]}}]});
Object.assign(HINTSX,{comp7:[
 {say:t3("Dela figuren i två rektanglar. Räkna ut varje area och lägg ihop.","Split the shape into two rectangles. Work out each area and add them.","قسّم الشكل إلى مستطيلين. احسب مساحة كل منهما ثم اجمع."),cut:noFin},
 {say:t3("Omkrets: räkna först ut sidorna som saknas. Area med hål: hela figuren minus hålet.","Perimeter: first work out the missing sides. Area with a hole: the whole shape minus the hole.","المحيط: احسب أولًا الأضلاع الناقصة. المساحة مع فتحة: الشكل كله ناقص الفتحة."),cut:noFin},
 {say:t3("Dela upp figuren i en rektangel och halvcirklar. Två halvcirklar blir en hel cirkel.","Split the shape into a rectangle and half circles. Two half circles make one whole circle.","قسّم الشكل إلى مستطيل وأنصاف دوائر. نصفا دائرة يكوّنان دائرة كاملة."),cut:noFin}]});
}
