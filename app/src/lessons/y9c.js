import {A,DIVS,HELPX,HINTSX,L,LESSONS,MUL,R,dfmt,dots,f1,fmt,lang,pick,plines,polyPts,qt,rint,t3,wbMount} from "../legacy/core.js";
/* =====================================================================
   YEAR 9 (y9c): volume of cone, pyramid and sphere; surface area of
   cuboid and cylinder; area and volume scale; Pythagoras in real life.
   Everything sits in one block so the helper names never clash.
   ===================================================================== */
{
const LRI=s=>"⁦"+s+"⁩";                 /* keeps a formula left-to-right inside Arabic text */
const T=(sv,en,ar)=>L(t3(sv,en,ar));
const fin=a=>Object.assign(a,{fin:true});
const fitS=(s,maxw,size)=>Math.min(size,maxw/(String(s).length*.46));
const UN={cm:["cm","cm","سم"],cm2:["cm²","cm²","سم²"],cm3:["cm³","cm³","سم³"],m:["m","m","م"],m2:["m²","m²","م²"],m3:["m³","m³","م³"],
 dm:["dm","dm","دسم"],dm2:["dm²","dm²","دسم²"],dm3:["dm³","dm³","دسم³"],g:["g","g","غ"],kg:["kg","kg","كغ"],l:["liter","litres","لتر"]};
const U=k=>UN[k][lang==="sv"?0:lang==="en"?1:2];
const wu=(s,k)=>lang==="ar"?LRI(s)+" "+U(k):s+" "+U(k);   /* "number/formula unit" in the right order for every language */
const rnd=(x,d=0)=>Math.round(x*10**d)/10**d;
const nf=(x,d=1)=>{const r=rnd(x,d);if(Number.isInteger(r))return fmt(r);return Math.abs(Math.round(r*10)-r*10)<1e-9?dfmt(r,1):dfmt(r,2)};
const ng=n=>n<0?"−"+(-n):String(n);
const safe=(v,d=0)=>{const s=v*10**d,f=s-Math.floor(s);return Math.abs(f-.5)>.12};
/* rounding gives the same answer with π and with 3,14, and nobody is near a .5 border */
const okPi=(f,d=0)=>{const a=f(Math.PI),b=f(3.14);return rnd(a,d)===rnd(b,d)&&safe(a,d)&&safe(b,d)};
const MK2=()=>[MUL(),DIVS()];
/* Board text clean-up, run on every action list of this file:
   - Arabic text is drawn right-to-left, where SVG "start" and "end" swap sides. Flip them so a
     label anchored "end" still ends at x (sits to the left of x) in every language.
   - Caveat draws ² and ³ wider than their advance, and ≈ comes from a fallback font, so the
     following/preceding space vanishes. Use no-break spaces there. */
const AR=/[؀-ۿ]/;
const fixS=s=>s.replace(/([²³]) /g,"$1  ").replace(/ ≈/g,"  ≈");
const fixA=arr=>{(arr||[]).forEach(a=>{if(!a||a.t!=="text")return;a.s=fixS(a.s);
 if(!a.fx&&AR.test(a.s)&&(a.anchor==="start"||a.anchor==="end")){a.anchor=a.anchor==="start"?"end":"start";a.fx=1}});return arr};
const fixSteps=st=>{st.forEach(s=>{const d=s.draw;s.draw=()=>fixA(d())});return st};
const fixHelp=o=>{Object.values(o).forEach(fixSteps);Object.assign(HELPX,o)};
const fixGen=les=>{const g0=les.gen;les.gen=function(lv){const g=g0.call(this,lv);fixA(g.q);fixA(g.sol);return g};return les};

/* ---------- drawing helpers for solids ---------- */
const P2=pts=>pts.map((p,i)=>(i?"L":"M")+f1(p[0])+","+f1(p[1])).join("");
const eArc=(cx,cy,rx,ry,t0,t1,n=36)=>Array.from({length:n+1},(_,i)=>{const t=t0+(t1-t0)*i/n;return[cx+rx*Math.cos(t),cy+ry*Math.sin(t)]});
const dashP=pts=>{let d="";for(let i=0;i+1<pts.length;i+=2)d+=P2([pts[i],pts[i+1]]);return d};
const ellD=(cx,cy,rx,ry)=>P2(eArc(cx,cy,rx,ry,0,2*Math.PI,72))+"Z";
const ra=(x,y,sx,sy,s=16,c="k")=>A.p(`M${f1(x+sx*s)},${f1(y)}L${f1(x+sx*s)},${f1(y+sy*s)}L${f1(x)},${f1(y+sy*s)}`,c,2.5);
const dimV=(x,y1,y2,c="k")=>A.p(R.line(x,y1,x,y2,.2)+`M${x-8},${y1}h16M${x-8},${y2}h16`,c,2.5);
const dimH=(y,x1,x2,c="k")=>A.p(R.line(x1,y,x2,y,.2)+`M${x1},${y-8}v16M${x2},${y-8}v16`,c,2.5);
function cyl(cx,yt,rx,ry,h,c="k"){const yb=yt+h;
 return[A.p(ellD(cx,yt,rx,ry)+R.line(cx-rx,yt,cx-rx,yb,.3)+R.line(cx+rx,yt,cx+rx,yb,.3)+P2(eArc(cx,yb,rx,ry,0,Math.PI)),c,4.5),A.p(dashP(eArc(cx,yb,rx,ry,Math.PI,2*Math.PI,24)),c,2.5)]}
const cylFront=(cx,yt,rx,ry,h)=>P2([...eArc(cx,yt,rx,ry,Math.PI,0,24),...eArc(cx,yt+h,rx,ry,0,Math.PI,24)])+"Z";
function coneUp(cx,yb,rx,ry,h,c="k"){const ay=yb-h;
 return[A.p(R.line(cx,ay,cx-rx,yb,.3)+R.line(cx,ay,cx+rx,yb,.3)+P2(eArc(cx,yb,rx,ry,0,Math.PI)),c,4.5),A.p(dashP(eArc(cx,yb,rx,ry,Math.PI,2*Math.PI,24)),c,2.5)]}
const coneDn=(cx,yt,rx,ry,h,c="k")=>A.p(ellD(cx,yt,rx,ry)+R.line(cx-rx,yt,cx,yt+h,.3)+R.line(cx+rx,yt,cx,yt+h,.3),c,4.5);
function pyr(cx,yb,w,dep,h,c="k"){const dx=dep*.5,dy=dep*.35,FL=[cx-w/2,yb],FR=[cx+w/2,yb],BR=[cx+w/2+dx,yb-dy],BL=[cx-w/2+dx,yb-dy],C=[cx+dx/2,yb-dy/2],Tp=[C[0],C[1]-h];
 return{o:[A.p(R.line(...FL,...FR,.3)+R.line(...FR,...BR,.3)+R.line(...Tp,...FL,.3)+R.line(...Tp,...FR,.3)+R.line(...Tp,...BR,.3),c,4.5),A.p(R.dashed(...FL,...BL,9)+R.dashed(...BL,...BR,9)+R.dashed(...Tp,...BL,9),c,2.5)],
  FL,FR,BR,BL,C,T:Tp,base:P2([FL,FR,BR,BL])+"Z",front:P2([FL,FR,Tp])+"Z",side:P2([FR,BR,Tp])+"Z"}}
function cub(x,y,w,h,dep,c="k",open=false){const dx=dep*.55,dy=dep*.4;
 return{o:[A.p(R.rect(x,y,w,h,.3)+plines([[x,y],[x+dx,y-dy],[x+w+dx,y-dy],[x+w,y]],false)+plines([[x+w+dx,y-dy],[x+w+dx,y+h-dy],[x+w,y+h]],false),c,4.5),
   A.p(R.dashed(x+dx,y-dy,x+dx,y+h-dy,9)+R.dashed(x+dx,y+h-dy,x+w+dx,y+h-dy,9)+R.dashed(x+dx,y+h-dy,x,y+h,9),c,2.5)],dx,dy,
  top:P2([[x,y],[x+dx,y-dy],[x+w+dx,y-dy],[x+w,y]])+"Z",front:`M${f1(x)},${f1(y)}h${f1(w)}v${f1(h)}h${f1(-w)}Z`,
  side:P2([[x+w,y],[x+w+dx,y-dy],[x+w+dx,y+h-dy],[x+w,y+h]])+"Z",bottom:P2([[x,y+h],[x+dx,y+h-dy],[x+w+dx,y+h-dy],[x+w,y+h]])+"Z"}}
function sph(cx,cy,r,c="k"){return[A.p(R.circ(cx,cy,r)+P2(eArc(cx,cy,r,r*.28,0,Math.PI,36)),c,4.5),A.p(dashP(eArc(cx,cy,r,r*.28,Math.PI,2*Math.PI,30)),c,2.5)]}
const ICO=b=>`<svg viewBox="0 0 320 180"><rect width="320" height="180" fill="#fff"/>${b}</svg>`;
const CV=`font-family="Caveat,cursive" font-weight="700" text-anchor="middle" direction="ltr"`;
/* a short question on top and a smaller second line */
const head2=(a,b)=>[A.tx(a,400,50,fitS(a,740,36)),...(b?[A.tx(b,400,94,fitS(b,740,28),"b")]:[])];

/* =====================================================================
   1. cone9: volume of cone, pyramid and sphere
   ===================================================================== */
const NAMES={cone:t3("kon","cone","مخروط"),cyl:t3("cylinder","cylinder","أسطوانة"),pyr:t3("pyramid","pyramid","هرم"),sph:t3("klot","sphere","كرة")};
const CONE9={steps:[
 {say:t3("En kon och en cylinder har samma radie och samma höjd. Det går åt exakt tre koner fulla med vatten för att fylla cylindern.",
   "A cone and a cylinder have the same radius and the same height. It takes exactly three cones full of water to fill the cylinder.",
   "لمخروطٍ وأسطوانةٍ نصفُ القطر نفسه والارتفاع نفسه. نحتاج إلى ثلاثة مخاريط مملوءة بالماء تمامًا لنملأ الأسطوانة."),
  draw:()=>{const o=[A.wipe(),...coneUp(130,390,80,22,240,"k"),...cyl(350,150,80,22,240,"b")];
   [0,1,2].forEach(k=>{const y2=390-80*k,y1=y2-80;o.push(A.hatch(`M270,${y1}H430V${y2}H270Z`,"b"));if(k<2)o.push(A.p(R.dashed(270,y1,430,y1,10),"b",2.5));o.push(qt(k+1,452,y2-30,30,"b"))});
   o.push(A.arrow(150,120,300,104,"r",-34),A.tx(T("3 koner = 1 cylinder","3 cones = 1 cylinder","3 مخاريط = أسطوانة واحدة"),240,462,34));return o}},
 {say:t3("Cylinderns volym är bottenytan gånger höjden: π · r² · h. Konen rymmer en tredjedel av det, så V = π · r² · h / 3.",
   "The cylinder's volume is the base area times the height: π × r² × h. The cone holds a third of that, so V = π × r² × h ÷ 3.",
   `حجم الأسطوانة هو مساحة القاعدة مضروبة في الارتفاع: ${LRI("π × r² × h")}. والمخروط يتسع لثلث ذلك، إذن ${LRI("V = π × r² × h ÷ 3")}.`),
  draw:()=>{const [M,D]=MK2();return[A.p(R.line(130,390,210,390,.2),"r",4),qt("r",170,380,30,"r"),A.p(R.dashed(130,150,130,390,9),"r",3),ra(130,390,1,-1,14,"r"),qt("h",112,300,30,"r"),
   A.tx(L(NAMES.cyl),630,130,34,"b"),A.tx(`V = π ${M} r² ${M} h`,630,185,40,"b"),A.tx(L(NAMES.cone),630,280,34,"g"),A.hl(478,300,304,62),A.tx(`V = π ${M} r² ${M} h ${D} 3`,630,346,40,"g")]}},
 {say:t3("En våffelstrut har radien 3 cm och höjden 10 cm. V = π · 3² · 10 / 3 = 30π, alltså ungefär 94 cm³ glass.",
   "A waffle cone has a radius of 3 cm and a height of 10 cm. V = π × 3² × 10 ÷ 3 = 30π, so about 94 cm³ of ice cream.",
   `قمع آيس كريم نصف قطره 3 سم وارتفاعه 10 سم. ${LRI("V = π × 3² × 10 ÷ 3 = 30π")}، أي نحو 94 سم³ من الآيس كريم.`),
  draw:()=>{const [M,D]=MK2();return[A.wipe(),A.hatch("M110,150L290,150L200,420Z","o"),coneDn(200,150,90,24,270,"o"),
   A.p(R.line(200,150,290,150,.2),"r",4),A.tx(wu("3","cm"),245,112,30,"r"),dimV(80,150,420),A.tx(wu("10","cm"),70,295,30,"k","end"),
   A.tx(`V = π ${M} r² ${M} h ${D} 3`,580,130,36,"b"),A.tx(`V = π ${M} 3² ${M} 10 ${D} 3`,580,210,36),A.tx("V = 30π",580,290,38),A.hl(445,325,270,62),A.tx(wu("V ≈ 94","cm3"),580,370,42,"g")]}},
 {say:t3("En pyramid är en tredjedel av ett rätblock med samma botten och höjd: V = B · h / 3. Glaspyramiden vid Louvren har en kvadratisk botten med sidan 35 m och är 21 m hög, så den rymmer ungefär 8 575 m³.",
   "A pyramid is a third of a cuboid with the same base and height: V = B × h ÷ 3. The Louvre's glass pyramid has a 35 m by 35 m base and is 21 m high, so it holds about 8,575 m³.",
   `الهرم ثلث متوازي مستطيلات له القاعدة نفسها والارتفاع نفسه: ${LRI("V = B × h ÷ 3")}. قاعدة الهرم الزجاجي في متحف اللوفر مربع ضلعه 35 م، وارتفاعه 21 م، فحجمه نحو 8575 م³.`),
  draw:()=>{const [M,D]=MK2(),p=pyr(230,410,230,150,250);
   const top=[p.FL,p.FR,p.BR,p.BL].map(([x,y])=>[x,y-250]);
   return[A.wipe(),A.tx(T("Louvren, Paris","The Louvre, Paris","متحف اللوفر، باريس"),250,58,32,"b"),
    A.p(R.dashed(...p.FL,...top[0],9)+R.dashed(...p.FR,...top[1],9)+R.dashed(...p.BR,...top[2],9)+R.dashed(...p.BL,...top[3],9)+top.map((q,i)=>R.dashed(...q,...top[(i+1)%4],9)).join(""),"#9aa8c4",2.5),
    A.hatch(p.front,"b"),A.hatch(p.side,"b"),...p.o,A.p(R.dashed(...p.T,...p.C,9),"r",3),dimV(p.FL[0]-22,p.FL[1]-250,p.FL[1],"r"),Object.assign(qt(wu("21","m"),p.FL[0]-34,p.FL[1]-115,28,"r"),{anchor:"end"}),
    qt(wu("35","m"),230,448,28),qt(wu("35","m"),p.FR[0]+58,p.FR[1]-14,28),
    A.tx(`V = B ${M} h ${D} 3`,620,120,38,"b"),A.tx(wu(`B = 35 ${M} 35 = ${fmt(1225)}`,"m2"),620,200,fitS(`B = 35 · 35 = 1 225 m²`,320,34)),A.tx(`V = ${fmt(1225)} ${M} 21 ${D} 3`,620,280,34),
    A.hl(480,318,280,62),A.tx(wu(`V = ${fmt(8575)}`,"m3"),620,364,42,"g")]}},
 {say:t3("Ett klot har volymen V = 4 · π · r³ / 3. En fotboll har radien ungefär 11 cm, så den rymmer cirka 5 575 cm³ luft. Det är nästan 5,6 liter!",
   "A sphere has the volume V = 4 × π × r³ ÷ 3. A football has a radius of about 11 cm, so it holds about 5,575 cm³ of air. That is almost 5.6 litres!",
   `حجم الكرة ${LRI("V = 4 × π × r³ ÷ 3")}. نصف قطر كرة القدم نحو 11 سم، فهي تتسع لنحو 5575 سم³ من الهواء، أي ما يقارب 5.6 لتر!`),
  draw:()=>{const [M,D]=MK2(),pent=polyPts(175,205,26,5);return[A.wipe(),A.hatch(P2(pent)+"Z","k"),A.p(plines(pent),"k",3.5),
   A.p(pent.map(([x,y])=>R.line(x,y,175+(x-175)*2.1,205+(y-205)*2.1,.2)).join(""),"k",3),...sph(220,270,150),
   A.p(R.line(220,270,370,270,.2),"r",4),A.p(dots([[220,270]]),"r",10),A.tx(wu("11","cm"),300,222,30,"r"),
   A.tx(`V = 4 ${M} π ${M} r³ ${D} 3`,610,130,38,"b"),A.tx(`V = 4 ${M} π ${M} 11³ ${D} 3`,610,210,38),A.hl(470,250,280,62),A.tx(wu(`V ≈ ${fmt(5575)}`,"cm3"),610,296,40,"g"),
   A.tx(`≈ ${dfmt(5.6,1)} ${U("l")}`,610,380,38,"b")]}},
 {say:t3("Kon och pyramid är spetsiga kroppar: de är en tredjedel av cylindern eller rätblocket. Därför delar vi med 3. Klotet har en egen formel.",
   "Cones and pyramids are pointed solids: each is a third of the cylinder or cuboid. That is why we divide by 3. The sphere has its own formula.",
   "المخروط والهرم مجسّمان مدبّبان، كلٌّ منهما ثلث الأسطوانة أو متوازي المستطيلات، لذلك نقسم على 3. أما الكرة فلها قانونها الخاص."),
  draw:()=>{const [M,D]=MK2(),p=pyr(380,270,140,90,170,"b");return[A.wipe(),...coneUp(140,270,70,18,170,"o"),...p.o,...sph(660,190,85,"g"),
   A.tx(L(NAMES.cone),140,340,38,"o"),A.tx(L(NAMES.pyr),400,340,38,"b"),A.tx(L(NAMES.sph),660,340,38,"g"),
   A.tx(`π ${M} r² ${M} h`,170,405,32,"o","end"),A.tx(`${D} 3`,178,405,36,"r","start"),A.tx(`B ${M} h`,410,405,32,"b","end"),A.tx(`${D} 3`,418,405,36,"r","start"),A.tx(`4 ${M} π ${M} r³ ${D} 3`,660,405,32,"g"),
   A.hl(70,430,400,50),A.tx(T("spetsig kropp: dela med 3","pointed solid: divide by 3","مجسّم مدبّب: نقسم على 3"),270,466,30,"r")]}}
]};
const SPH=[[t3("en pingisboll","a table tennis ball","كرة طاولة"),[4]],[t3("en tennisboll","a tennis ball","كرة تنس"),[6,7]],[t3("en apelsin","an orange","برتقالة"),[7,8,9]],
 [t3("en julgranskula","a Christmas bauble","كرة زينة"),[5,6,8,10]],[t3("en snöboll","a snowball","كرة ثلج"),[8,9,10,11]],[t3("en glasskula","a scoop of ice cream","كرة آيس كريم"),[5,6,7]]];
LESSONS.push(fixGen({id:"cone9",subject:"math",grades:"9",kind:"wb",
 title:t3("Volym av kon, pyramid och klot","Volume of cones, pyramids and spheres","حجم المخروط والهرم والكرة"),
 icon:ICO(`<path d="M70 40L30 140M70 40L110 140" stroke="#e07b00" stroke-width="4" fill="none"/><ellipse cx="70" cy="140" rx="40" ry="10" fill="#e07b00" fill-opacity=".15" stroke="#e07b00" stroke-width="4"/>
  <path d="M160 40L125 140H195L160 40L213 125" stroke="#2257c9" stroke-width="4" fill="none" stroke-linejoin="round"/><path d="M195 140L213 125" stroke="#2257c9" stroke-width="4"/>
  <circle cx="262" cy="98" r="42" fill="#1e9e5a" fill-opacity=".12" stroke="#1e9e5a" stroke-width="4"/><path d="M220 98A42 12 0 0 0 304 98" stroke="#1e9e5a" stroke-width="3" fill="none"/>
  <text x="160" y="172" ${CV} font-size="26" fill="#1d2433">V = B · h / 3</text>`),
 steps:fixSteps(CONE9.steps),mount:wbMount(CONE9),
 gen(level){const [M,D]=MK2();
  /* level 0: a pyramid tent, word problem in m³ */
  if(level===0&&Math.random()<.3){let a,h;do{a=rint(2,6);h=rint(2,5)}while((a*a*h)%3);
   const w=100+30*a,dep=60+20*a,H=150+30*h,p=pyr(240,420,w,dep,H),B=a*a,V=B*h/3,dx=p.FL[0]-22;
   return{kind:"num",ans:V,show:wu(fmt(V),"m3"),hc:4,
    q:[A.wipe(),...head2(T(`Ett tält är en pyramid med kvadratisk botten och höjden ${h} m.`,`A tent is a pyramid with a square base and a height of ${h} m.`,`خيمة على شكل هرم قاعدته مربعة وارتفاعه ${wu(h,"m")}.`),
      L(pick([t3("Hur många m³ luft finns i tältet?","How many m³ of air are in the tent?","كم مترًا مكعبًا من الهواء في الخيمة؟"),t3("Beräkna tältets volym.","Work out the volume of the tent.","احسب حجم الخيمة.")]))),
     A.hatch(p.base,"o"),A.hatch(p.front,"b"),...p.o,A.p(R.dashed(...p.T,...p.C,9),"r",3),
     qt(wu(a,"m"),240,458,28),Object.assign(qt(wu(a,"m"),p.FR[0]+dep*.25+14,p.FR[1]-dep*.17+6,28),{anchor:"start"}),
     A.p(R.dashed(dx-8,p.T[1],p.T[0],p.T[1],9),"#9aa8c4",2),dimV(dx,p.T[1],p.C[1],"r"),Object.assign(qt(wu(h,"m"),dx-12,(p.T[1]+p.C[1])/2+10,28,"r"),{anchor:"end"})],
    sol:[A.tx(`V = B ${M} h ${D} 3`,620,170,36,"b"),A.tx(wu(`B = ${a} ${M} ${a} = ${B}`,"m2"),620,245,34,"o"),A.tx(`V = ${B} ${M} ${h} ${D} 3`,620,320,34),
     fin(A.hl(480,358,280,62)),fin(A.tx(wu(`V = ${fmt(V)}`,"m3"),620,404,40,"g"))]}}
  /* level 1: a cone and a cylinder with the same radius and height */
  if(level===1&&Math.random()<.3){const C=rint(4,30)*3*(Math.random()<.5?10:1),Vc=C/3,yb=400,cx1=200,cx2=420;
   return{kind:"num",ans:Vc,show:wu(fmt(Vc),"cm3"),hc:2,
    q:[A.wipe(),...head2(T(`En cylinder rymmer ${fmt(C)} cm³. En kon har samma radie och höjd.`,`A cylinder holds ${fmt(C)} cm³. A cone has the same radius and height.`,`تتسع أسطوانة لـ ${wu(fmt(C),"cm3")}، ولمخروط نصف القطر نفسه والارتفاع نفسه.`),
      L(pick([t3("Hur mycket rymmer konen?","How much does the cone hold?","كم يتسع المخروط؟"),t3("Beräkna konens volym.","Work out the volume of the cone.","احسب حجم المخروط.")]))),
     A.hatch(cylFront(cx1,170,80,22,230),"b"),...cyl(cx1,170,80,22,230,"b"),A.tx(wu(fmt(C),"cm3"),cx1,yb+60,32,"b"),
     ...coneUp(cx2,yb,80,22,230,"o"),A.tx("?",cx2,yb-70,48,"r")],
    sol:[A.p(R.dashed(cx1-80,170+230/3,cx1+80,170+230/3,9)+R.dashed(cx1-80,170+460/3,cx1+80,170+460/3,9),"b",2.5),A.tx(T("3 koner = 1 cylinder","3 cones = 1 cylinder","3 مخاريط = أسطوانة واحدة"),650,180,30,"g"),
     fin(A.tx(`${fmt(C)} ${D} 3 = ${fmt(Vc)}`,650,260,38)),fin(A.hl(520,288,260,62)),fin(A.tx(wu(`V = ${fmt(Vc)}`,"cm3"),650,334,40,"g"))]}}
  /* level 2: air in a football, in litres */
  if(level===2&&Math.random()<.3){let r;do{r=pick([10,10.5,11,11.5,12,13])}while(!okPi(p=>4*p*r**3/3000,1));
   const V=rnd(4*Math.PI*r**3/3000,1),cm=4*Math.PI*r**3/3,rs=nf(r);
   return{kind:"num",dec:true,ans:V,show:`${dfmt(V,1)} ${U("l")}`,hc:3,
    q:[A.wipe(),...head2(T(`En boll har radien ${rs} cm.`,`A ball has a radius of ${rs} cm.`,`نصف قطر كرة ${wu(rs,"cm")}.`),T("Hur många liter luft rymmer den? Svara med en decimal.","How many litres of air does it hold? Give one decimal.","كم لترًا من الهواء تتسع؟ أجب بمنزلة عشرية واحدة.")),
     A.hatch(`M90,290a130,130 0 1,0 260,0a130,130 0 1,0 -260,0`,"o"),...sph(220,290,130,"k"),A.p(R.line(220,290,350,290,.2),"r",4),A.p(dots([[220,290]]),"r",10),A.tx(wu(`r = ${rs}`,"cm"),285,250,30,"r")],
    sol:[A.tx(`V = 4 ${M} π ${M} ${rs}³ ${D} 3`,615,160,fitS(`V = 4 · π · ${rs}³ / 3`,300,34)),A.tx(wu(`V ≈ ${fmt(Math.round(cm))}`,"cm3"),615,240,34),A.tx(`1 ${U("l")} = ${fmt(1000)} cm³`,615,320,30,"b"),
     fin(A.hl(480,358,270,62)),fin(A.tx(`V ≈ ${dfmt(V,1)} ${U("l")}`,615,404,40,"g"))]}}
  if(level===0){let l,b,h;do{l=rint(3,12);b=rint(3,12);h=rint(4,15)}while((l*b*h)%3||l*b*h/3>600);
   const w=100+11*l,dep=60+8*b,H=150+9*h,p=pyr(240,420,w,dep,H),B=l*b,V=B*h/3,dx=p.FL[0]-22;
   return{kind:"num",ans:V,show:wu(fmt(V),"cm3"),hc:4,
    q:[A.wipe(),...head2(L(pick([t3("Beräkna pyramidens volym.","Work out the volume of the pyramid.","احسب حجم الهرم."),t3("Bestäm pyramidens volym.","Find the volume of the pyramid.","أوجد حجم الهرم.")]))),A.hatch(p.base,"o"),...p.o,A.p(R.dashed(...p.T,...p.C,9),"r",3),
     qt(wu(l,"cm"),240,458,28),Object.assign(qt(wu(b,"cm"),p.FR[0]+dep*.25+14,p.FR[1]-dep*.17+6,28),{anchor:"start"}),
     A.p(R.dashed(dx-8,p.T[1],p.T[0],p.T[1],9),"#9aa8c4",2),dimV(dx,p.T[1],p.C[1],"r"),Object.assign(qt(wu(h,"cm"),dx-12,(p.T[1]+p.C[1])/2+10,28,"r"),{anchor:"end"})],
    sol:[A.tx(`V = B ${M} h ${D} 3`,620,170,36,"b"),A.tx(wu(`B = ${l} ${M} ${b} = ${B}`,"cm2"),620,245,fitS(`B = ${l} · ${b} = ${B} cm²`,300,34),"o"),A.tx(`V = ${B} ${M} ${h} ${D} 3`,620,320,34),
     fin(A.hl(480,358,280,62)),fin(A.tx(wu(`V = ${fmt(V)}`,"cm3"),620,404,40,"g"))]}}
  if(level===1){let r,h;do{r=rint(2,9);h=rint(3,20)}while((r*r*h)%3||!okPi(p=>p*r*r*h/3));
   const k=r*r*h/3,V=rnd(Math.PI*k),rx=64+7*r,ry=rx*.27,H=130+8*h,yb=410,cx=270,dx=cx-rx-26;
   return{kind:"num",ans:V,show:wu(fmt(V),"cm3"),hc:2,
    q:[A.wipe(),...head2(L(pick([t3("Beräkna konens volym.","Work out the volume of the cone.","احسب حجم المخروط."),t3("Hur stor volym har konen?","What is the volume of the cone?","ما حجم المخروط؟")])),T("Avrunda till hela cm³.","Round to the nearest whole cm³.","قرّب الناتج إلى أقرب عدد صحيح.")),
     A.hatch(P2([[cx,yb-H],...eArc(cx,yb,rx,ry,Math.PI,0,24)])+"Z","o"),...coneUp(cx,yb,rx,ry,H),A.p(R.line(cx,yb,cx+rx,yb,.2),"r",4),A.p(R.dashed(cx,yb-H,cx,yb,9),"r",3),ra(cx,yb,1,-1,14,"r"),
     A.p(R.dashed(dx-8,yb-H,cx,yb-H,9),"#9aa8c4",2),dimV(dx,yb-H,yb,"r"),Object.assign(qt(wu(h,"cm"),dx-12,yb-H/2+10,28,"r"),{anchor:"end"}),qt("h",cx+16,yb-H*.42,28,"r"),
     A.tx(wu(`r = ${r}`,"cm"),cx+rx/2,yb+ry+32,28,"r")],
    sol:[A.tx(`V = π ${M} r² ${M} h ${D} 3`,615,170,34,"b"),A.tx(`V = π ${M} ${r}² ${M} ${h} ${D} 3`,615,245,34),fin(A.tx(`V = ${k}π`,615,320,36)),
     fin(A.hl(480,358,270,62)),fin(A.tx(wu(`V ≈ ${fmt(V)}`,"cm3"),615,404,40,"g"))]}}
  let ctx,d,tries=0;
  do{if(Math.random()<.55&&tries<40){const c=pick(SPH);ctx=c[0];d=pick(c[1])}else{ctx=null;d=rint(4,14)}tries++}while(!okPi(p=>4*p*(d/2)**3/3));
  const r=d/2,V=rnd(4*Math.PI*r**3/3),rs=nf(r);
  const q1=ctx?T(`${L(ctx).replace(/^./,c=>c.toUpperCase())} har diametern ${d} cm.`,`${L(ctx).replace(/^./,c=>c.toUpperCase())} has a diameter of ${d} cm.`,`قطر ${L(ctx)} ${d} سم.`)
   :T(`Klotet har diametern ${d} cm.`,`The sphere has a diameter of ${d} cm.`,`قطر الكرة ${d} سم.`);
  return{kind:"num",ans:V,show:wu(fmt(V),"cm3"),hc:3,
   q:[A.wipe(),...head2(q1,T("Beräkna volymen. Avrunda till hela cm³.","Work out the volume. Round to the nearest whole cm³.","احسب الحجم، وقرّب الناتج إلى أقرب عدد صحيح.")),
    A.hatch(`M90,290a130,130 0 1,0 260,0a130,130 0 1,0 -260,0`,"o"),...sph(220,290,130,"k"),A.p(R.line(90,290,350,290,.2),"r",4),A.tx(wu(`d = ${d}`,"cm"),220,465,32,"r")],
   sol:[A.tx(wu(`r = ${d} ${D} 2 = ${rs}`,"cm"),615,160,34,"b"),A.tx(`V = 4 ${M} π ${M} r³ ${D} 3`,615,240,34,"b"),A.tx(`V = 4 ${M} π ${M} ${rs}³ ${D} 3`,615,320,fitS(`V = 4 · π · ${rs}³ / 3`,300,34)),
    fin(A.hl(480,358,270,62)),fin(A.tx(wu(`V ≈ ${fmt(V)}`,"cm3"),615,404,40,"g"))]}}
}));
fixHelp({cone9:[
 {say:t3("Tänk på glasstrutar och ett glas som är lika brett och lika högt. Du måste hälla i tre fulla strutar innan glaset är fullt. Därför delar vi med 3.",
   "Think of ice-cream cones and a glass that is just as wide and just as tall. You have to pour in three full cones before the glass is full. That is why we divide by 3.",
   "فكّر في أقماع آيس كريم وكوبٍ له العرض نفسه والارتفاع نفسه. عليك أن تصبّ ثلاثة أقماع مملوءة حتى يمتلئ الكوب، لذلك نقسم على 3."),
  draw:()=>{const o=[];[0,1,2].forEach(i=>{const cx=90+i*130;o.push(A.hatch(`M${cx-45},130L${cx+45},130L${cx},300Z`,"o"),coneDn(cx,130,45,12,170,"o"),A.tx(`${i+1}`,cx,350,36,"o"))});
   o.push(A.arrow(420,215,500,215,"b",-20),...cyl(620,130,45*1.5,16,170,"b"),A.hatch(`M552,130H688V300H552Z`,"b"),A.p(R.dashed(552,187,688,187,8)+R.dashed(552,243,688,243,8),"b",2.5),
    A.hl(250,402,300,62),A.tx(T("3 strutar = 1 glas","3 cones = 1 glass","3 أقماع = كوب واحد"),400,448,40,"g"));return o}}]});
Object.assign(HINTSX,{cone9:[
 {say:t3("Börja med bottenytan B = längd · bredd. Volymen är B · h / 3.","Start with the base area B = length × width. The volume is B × h ÷ 3.",`ابدأ بمساحة القاعدة: الطول × العرض. ثم الحجم ${LRI("B × h ÷ 3")}.`),cut:g=>g.sol.slice(0,2)},
 {say:t3("Sätt in radien och höjden i V = π · r² · h / 3. Har konen samma radie och höjd som en cylinder rymmer den en tredjedel.","Put the radius and the height into V = π × r² × h ÷ 3. If the cone has the same radius and height as a cylinder, it holds a third.",`عوّض نصف القطر والارتفاع في ${LRI("V = π × r² × h ÷ 3")}. إذا كان للمخروط نصف قطر الأسطوانة وارتفاعها نفسهما فإنه يتسع لثلثها.`),cut:g=>g.sol.slice(0,2)},
 {say:t3("Radien är halva diametern. Använd sedan V = 4 · π · r³ / 3. 1 liter = 1 000 cm³, så dela med 1 000 för att få liter.","The radius is half the diameter. Then use V = 4 × π × r³ ÷ 3. 1 litre = 1,000 cm³, so divide by 1,000 to get litres.",`نصف القطر يساوي نصف طول القطر. ثم استخدم ${LRI("V = 4 × π × r³ ÷ 3")}. اللتر = 1000 سم³، فاقسم على 1000 لتحصل على اللترات.`),cut:g=>g.sol.slice(0,2)}]});

/* =====================================================================
   2. surf9: surface area of cuboid and cylinder
   ===================================================================== */
/* net of a cuboid: l along x, b and h; returns faces with colours */
function boxNet(x0,y0,l,b,h){const F=[[x0,y0+b,b,h,"r"],[x0+b,y0+b,l,h,"b"],[x0+b+l,y0+b,b,h,"r"],[x0+2*b+l,y0+b,l,h,"b"],[x0+b,y0,l,b,"o"],[x0+b,y0+b+h,l,b,"o"]];
 return F.map(([x,y,w,hh,c])=>({x,y,w,h:hh,c,d:`M${f1(x)},${f1(y)}h${f1(w)}v${f1(hh)}h${f1(-w)}Z`}))}
const netAct=F=>[...F.map(f=>A.hatch(f.d,f.c)),A.p(F.map(f=>R.rect(f.x,f.y,f.w,f.h,.2)).join(""),"k",3.5)];
const SURF9={steps:[
 {say:t3("Begränsningsarean är den sammanlagda arean av alla ytor runt en kropp. Om vi klipper upp en kartong och lägger den platt ser vi sex rektanglar.",
   "The surface area is the total area of all the faces around a solid. If we cut open a box and lay it flat, we see six rectangles.",
   "المساحة الكلية هي مجموع مساحات كل الأوجه التي تحيط بالمجسّم. إذا قصصنا علبة وفردناها نرى ستة مستطيلات."),
  draw:()=>{const c=cub(60,220,190,110,120),F=boxNet(410,150,108,72,43);
   return[A.wipe(),A.tx(T("Begränsningsarea = alla ytor","Surface area = all the faces","المساحة الكلية = كل الأوجه"),400,62,38),
    A.hatch(c.top,"o"),A.hatch(c.front,"b"),A.hatch(c.side,"r"),...c.o,A.arrow(300,170,400,170,"k",-26),...netAct(F),
    A.tx(T("6 rektanglar i 3 par","6 rectangles in 3 pairs","6 مستطيلات في 3 أزواج"),590,420,36,"g")]}},
 {say:t3("Skokartongen är 30 cm lång, 20 cm bred och 12 cm hög. Ytorna kommer i par: botten och lock, fram och bak, två gavlar. Tillsammans blir det 2 400 cm².",
   "The shoebox is 30 cm long, 20 cm wide and 12 cm high. The faces come in pairs: bottom and lid, front and back, two ends. Together that makes 2,400 cm².",
   "علبة الحذاء طولها 30 سم وعرضها 20 سم وارتفاعها 12 سم. الأوجه تأتي أزواجًا: القاع والغطاء، والأمام والخلف، والجانبان. المجموع 2400 سم²."),
  draw:()=>{const M=MUL(),c=cub(110,210,230,110,150);return[A.wipe(),A.hatch(c.top,"o"),A.hatch(c.front,"b"),A.hatch(c.side,"r"),...c.o,
   qt(wu("30","cm"),225,360,28),Object.assign(qt(wu("12","cm"),98,272,28),{anchor:"end"}),Object.assign(qt(wu("20","cm"),110+c.dx/2-12,210-c.dy/2-6,28),{anchor:"end"}),
   A.tx(`2 ${M} 30 ${M} 20 = ${fmt(1200)}`,610,140,36,"o"),A.tx(`2 ${M} 30 ${M} 12 = 720`,610,215,36,"b"),A.tx(`2 ${M} 20 ${M} 12 = 480`,610,290,36,"r"),
   A.hl(470,328,280,62),A.tx(wu(`A = ${fmt(2400)}`,"cm2"),610,374,42,"g")]}},
 {say:t3("En burk är en cylinder. Tar vi av etiketten och vecklar ut den blir den en rektangel. Bredden är burkens omkrets, π · d. Botten och lock är två cirklar.",
   "A can is a cylinder. If we peel off the label and unroll it, it becomes a rectangle. Its width is the can's circumference, π × d. The bottom and lid are two circles.",
   `العلبة أسطوانة. إذا نزعنا الملصق وفردناه صار مستطيلًا عرضه محيط العلبة ${LRI("π × d")}. والقاع والغطاء دائرتان.`),
  draw:()=>{const M=MUL();return[A.wipe(),A.hatch(cylFront(150,150,75,20,220),"b"),A.hatch(ellD(150,150,75,20),"o"),...cyl(150,150,75,20,220),A.p(R.line(75,370,225,370,.2),"r",3.5),qt("d",150,414,30,"r"),
   A.arrow(250,260,320,260,"k",-18),A.hatch("M360,200H720V340H360Z","b"),A.p(R.rect(360,200,360,140,.3),"k",4),
   A.hatch(ellD(430,132,50,50),"o"),A.p(R.circ(430,132,50),"k",4),A.hatch(ellD(650,394,50,50),"o"),A.p(R.circ(650,394,50),"k",4),
   dimH(188,360,720,"r"),A.tx(`π ${M} d`,620,174,30,"r"),dimV(740,200,340),qt("h",762,280,30)]}},
 {say:t3("Burken har radien 4 cm och höjden 11 cm. Mantelytan är π · 8 · 11 ≈ 276,5 cm² och de två cirklarna är 2 · π · 4² ≈ 100,5 cm². Totalt ungefär 377 cm².",
   "The can has a radius of 4 cm and a height of 11 cm. The curved surface is π × 8 × 11 ≈ 276.5 cm² and the two circles are 2 × π × 4² ≈ 100.5 cm². In total about 377 cm².",
   `نصف قطر العلبة 4 سم وارتفاعها 11 سم. المساحة الجانبية ${LRI("π × 8 × 11 ≈ 276.5")} سم²، ومساحة الدائرتين ${LRI("2 × π × 4² ≈ 100.5")} سم². المجموع نحو 377 سم².`),
  draw:()=>{const M=MUL();return[A.wipe(),A.hatch(cylFront(160,140,90,24,240),"b"),A.hatch(ellD(160,140,90,24),"o"),...cyl(160,140,90,24,240),A.p(R.line(160,140,250,140,.2),"r",4),A.tx(wu("4","cm"),205,104,28,"r"),
   dimV(276,140,380),A.tx(wu("11","cm"),290,268,28,"k","start"),
   A.tx(T("mantelyta","curved surface","المساحة الجانبية"),590,118,28,"b"),A.tx(wu(`π ${M} 8 ${M} 11 ≈ ${dfmt(276.5,1)}`,"cm2"),590,165,34,"b"),
   A.tx(T("botten + lock","bottom + lid","القاع + الغطاء"),590,228,28,"o"),A.tx(wu(`2 ${M} π ${M} 4² ≈ ${dfmt(100.5,1)}`,"cm2"),590,275,34,"o"),
   A.hl(460,322,260,62),A.tx(wu("A ≈ 377","cm2"),590,368,42,"g")]}},
 {say:t3("Ett akvarium har inget lock. Då räknar vi bara de fem ytor som finns: botten, fram och bak och två gavlar. Det behövs 90 dm² glas.",
   "A fish tank has no lid. So we only count the five faces that are there: the bottom, the front and back, and two ends. It needs 90 dm² of glass.",
   "حوض السمك بلا غطاء، لذلك نحسب الأوجه الخمسة الموجودة فقط: القاع، والأمام والخلف، والجانبين. نحتاج إلى 90 دسم² من الزجاج."),
  draw:()=>{const M=MUL(),c=cub(80,190,270,180,130);return[A.wipe(),A.hatch(c.bottom,"o"),A.hatch(`M80,240h270v130h-270Z`,"b"),A.hatch(P2([[350,240],[350+c.dx,240-c.dy],[350+c.dx,370-c.dy],[350,370]])+"Z","r"),...c.o,
   A.p(R.line(80,240,350,240,.2)+R.line(350,240,350+c.dx,240-c.dy,.2),"b",2.5),A.tx(T("inget lock!","no lid!","بلا غطاء!"),230,120,32,"r"),
   qt(wu("6","dm"),215,410,28),Object.assign(qt(wu("4","dm"),68,290,28),{anchor:"end"}),Object.assign(qt(wu("3","dm"),350+c.dx/2+16,370-c.dy/2+20,28),{anchor:"start"}),
   A.tx(`6 ${M} 3 = 18`,620,130,36,"o"),A.tx(`2 ${M} 6 ${M} 4 = 48`,620,205,36,"b"),A.tx(`2 ${M} 3 ${M} 4 = 24`,620,280,36,"r"),
   A.hl(480,318,280,62),A.tx(wu("A = 90","dm2"),620,364,42,"g")]}},
 {say:t3("Begränsningsarea är en area, så den mäts i cm² eller m². Rätblock: lägg ihop tre par rektanglar. Cylinder: mantelytan plus två cirklar.",
   "Surface area is an area, so it is measured in cm² or m². Cuboid: add up three pairs of rectangles. Cylinder: the curved surface plus two circles.",
   "المساحة الكلية مساحةٌ، لذلك تُقاس بالسنتيمتر المربع أو المتر المربع. متوازي المستطيلات: نجمع ثلاثة أزواج من المستطيلات. الأسطوانة: المساحة الجانبية زائد دائرتين."),
  draw:()=>{const M=MUL(),c=cub(90,150,170,100,110);return[A.wipe(),A.hatch(c.top,"o"),A.hatch(c.front,"b"),A.hatch(c.side,"r"),...c.o,qt("l",175,284,30),qt("h",74,208,30),qt("b",90+c.dx/2-12,150-c.dy/2-4,30),
   A.hatch(cylFront(590,110,70,19,150),"b"),A.hatch(ellD(590,110,70,19),"o"),...cyl(590,110,70,19,150),A.p(R.line(590,110,660,110,.2),"r",3.5),qt("r",625,80,28,"r"),qt("h",680,200,30),
   A.tx(L(t3("rätblock","cuboid","متوازي المستطيلات")),200,330,34),A.tx(`A = 2lb + 2lh + 2bh`,200,390,34,"g"),
   A.tx(L(NAMES.cyl),590,330,34),A.tx(`A = 2 ${M} π ${M} r² + π ${M} d ${M} h`,590,390,30,"g"),
   A.hl(220,420,360,58),A.tx(T("area mäts i cm² eller m²","area is measured in cm² or m²","المساحة تُقاس بـ سم² أو م²"),400,462,32,"b")]}}
]};
LESSONS.push(fixGen({id:"surf9",subject:"math",grades:"9",kind:"wb",
 title:t3("Begränsningsarea av rätblock och cylinder","Surface area of cuboids and cylinders","المساحة الكلية لمتوازي المستطيلات والأسطوانة"),
 icon:ICO(`<g stroke="#1d2433" stroke-width="2.5"><rect x="62" y="20" width="60" height="40" fill="#e07b00" fill-opacity=".25"/><rect x="30" y="60" width="32" height="26" fill="#d63b2f" fill-opacity=".25"/><rect x="62" y="60" width="60" height="26" fill="#2257c9" fill-opacity=".25"/>
  <rect x="122" y="60" width="32" height="26" fill="#d63b2f" fill-opacity=".25"/><rect x="154" y="60" width="60" height="26" fill="#2257c9" fill-opacity=".25"/><rect x="62" y="86" width="60" height="40" fill="#e07b00" fill-opacity=".25"/></g>
  <ellipse cx="265" cy="50" rx="32" ry="9" fill="#e07b00" fill-opacity=".25" stroke="#1d2433" stroke-width="3"/><path d="M233 50V130A32 9 0 0 0 297 130V50" fill="#2257c9" fill-opacity=".15" stroke="#1d2433" stroke-width="3"/>
  <text x="160" y="168" ${CV} font-size="26" fill="#1e9e5a">A = 2 400 cm²</text>`),
 steps:fixSteps(SURF9.steps),mount:wbMount(SURF9),
 gen(level){const M=MUL();
  /* a cuboid sized to its numbers, front face left of x=440 */
  const box=(l,b,h)=>{const w=120+14*l,H=80+16*h,dep=70+8*b,x=120,c0=cub(0,0,w,H,dep),y=285-H/2+c0.dy/2;return Object.assign(cub(x,y,w,H,dep),{x,y,w,H})};
  if(level===0){let l,b,h;do{l=rint(3,12);b=rint(2,10);h=rint(2,10)}while(l===b||b===h||l===h);
   const c=box(l,b,h),A1=2*l*b,A2=2*l*h,A3=2*b*h,tot=A1+A2+A3;
   return{kind:"num",ans:tot,show:wu(fmt(tot),"cm2"),hc:2,
    q:[A.wipe(),...head2(...(Math.random()<.3?[T("Du ska slå in en present som är formad som ett rätblock.","You are wrapping a present shaped like a cuboid.","ستغلّف هدية على شكل متوازي مستطيلات."),T("Hur mycket papper behövs minst?","What is the least paper you need?","ما أقل مساحة من الورق تحتاجها؟")]:[L(pick([t3("Beräkna rätblockets begränsningsarea.","Work out the surface area of the cuboid.","احسب المساحة الكلية لمتوازي المستطيلات."),t3("Bestäm rätblockets begränsningsarea.","Find the surface area of the cuboid.","أوجد المساحة الكلية لمتوازي المستطيلات.")]))])),...c.o,
     qt(wu(l,"cm"),c.x+c.w/2,c.y+c.H+38,28),Object.assign(qt(wu(h,"cm"),c.x-12,c.y+c.H/2+10,28),{anchor:"end"}),Object.assign(qt(wu(b,"cm"),c.x+c.dx/2-10,c.y-c.dy/2-6,28),{anchor:"end"})],
    sol:[A.hatch(c.top,"o"),A.hatch(c.front,"b"),A.hatch(c.side,"r"),A.tx(`2 ${M} ${l} ${M} ${b} = ${A1}`,630,160,34,"o"),A.tx(`2 ${M} ${l} ${M} ${h} = ${A2}`,630,235,34,"b"),A.tx(`2 ${M} ${b} ${M} ${h} = ${A3}`,630,310,34,"r"),
     fin(A.hl(490,350,280,62)),fin(A.tx(wu(`A = ${fmt(tot)}`,"cm2"),630,396,40,"g"))]}}
  const cylQ=(r,h,open)=>{const rx=56+8*r,ry=rx*.26,H=100+11*h,cx=280,yt=310-H/2,dx=cx-rx-22;
   const man=2*Math.PI*r*h,end=(open?1:2)*Math.PI*r*r,tot=rnd(man+end);
   const q=[...cyl(cx,yt,rx,ry,H),A.p(R.line(cx,yt,cx+rx,yt,.2),"r",4),A.tx(wu(`r = ${r}`,"cm"),cx+rx/2,yt-ry-12,28,"r"),dimV(dx,yt,yt+H),A.tx(wu(`h = ${h}`,"cm"),dx-12,yt+H/2+10,26,"k","end")];
   const sol=[A.hatch(cylFront(cx,yt,rx,ry,H),"b"),A.tx(T("mantelyta","curved surface","المساحة الجانبية"),640,128,26,"b"),A.tx(wu(`π ${M} ${2*r} ${M} ${h} ≈ ${nf(man)}`,"cm2"),640,170,fitS(`π · ${2*r} · ${h} ≈ ${nf(man)} cm²`,300,32),"b"),
    A.tx(open?T("botten","bottom","القاع"):T("botten + lock","bottom + lid","القاع + الغطاء"),640,232,26,"o"),
    A.tx(wu(open?`π ${M} ${r}² ≈ ${nf(end)}`:`2 ${M} π ${M} ${r}² ≈ ${nf(end)}`,"cm2"),640,274,fitS(`2 · π · ${r}² ≈ ${nf(end)} cm²`,300,32),"o"),
    fin(A.hl(505,330,270,62)),fin(A.tx(wu(`A ≈ ${fmt(tot)}`,"cm2"),640,376,40,"g"))];
   return{tot,q,sol,top:A.hatch(ellD(cx,yt,rx,ry),"o"),bot:A.hatch(ellD(cx,yt+H,rx,ry),"o")}};
  /* level 1: only the curved surface, the label on a can */
  if(level===1&&Math.random()<.3){let r,h;do{r=rint(3,6);h=rint(8,15)}while(!okPi(p=>2*p*r*h));
   const C=cylQ(r,h,false),man=rnd(2*Math.PI*r*h);
   return{kind:"num",ans:man,show:wu(fmt(man),"cm2"),hc:2,
    q:[A.wipe(),...head2(T("Etiketten täcker hela burkens sida, men inte botten och lock.","The label covers the whole side of the can, but not the bottom or lid.","يغطّي الملصق جانب العلبة كله، لكن ليس القاع ولا الغطاء."),
      T("Hur stor är etikettens area? Avrunda till hela cm².","What is the area of the label? Round to whole cm².","ما مساحة الملصق؟ قرّب إلى أقرب عدد صحيح.")),...C.q],
    sol:[C.sol[0],C.sol[1],C.sol[2],fin(A.hl(505,330,270,62)),fin(A.tx(wu(`A ≈ ${fmt(man)}`,"cm2"),640,376,40,"g"))]}}
  if(level===1){let r,h;do{r=rint(2,8);h=rint(3,15)}while(!okPi(p=>2*p*r*h+2*p*r*r));
   const C=cylQ(r,h,false);C.sol.splice(1,0,C.top);
   return{kind:"num",ans:C.tot,show:wu(fmt(C.tot),"cm2"),hc:4,
    q:[A.wipe(),...head2(L(pick([t3("Beräkna cylinderns begränsningsarea.","Work out the surface area of the cylinder.","احسب المساحة الكلية للأسطوانة."),t3("Hur stor är cylinderns begränsningsarea?","What is the surface area of the cylinder?","ما المساحة الكلية للأسطوانة؟")])),T("Avrunda till hela cm².","Round to the nearest whole cm².","قرّب الناتج إلى أقرب عدد صحيح.")),...C.q],sol:C.sol}}
  if(Math.random()<.5){let l,b,h;do{l=rint(4,10);b=rint(2,5);h=rint(3,6)}while(b===h);
   const c=box(l,b,h),A0=l*b,A1=2*l*h,A2=2*b*h,tot=A0+A1+A2;
   return{kind:"num",ans:tot,show:wu(fmt(tot),"dm2"),hc:4,
    q:[A.wipe(),...head2(T("Akvariet har inget lock. Hur mycket glas behövs?","The fish tank has no lid. How much glass is needed?","حوض السمك بلا غطاء. كم يلزمه من الزجاج؟"),T("Svara i dm².","Answer in dm².","أجب بـ دسم².")),
     ...c.o,A.p(R.line(c.x,c.y+c.H*.3,c.x+c.w,c.y+c.H*.3,.2)+R.line(c.x+c.w,c.y+c.H*.3,c.x+c.w+c.dx,c.y+c.H*.3-c.dy,.2),"b",2.5),
     qt(wu(l,"dm"),c.x+c.w/2,c.y+c.H+38,28),Object.assign(qt(wu(h,"dm"),c.x-12,c.y+c.H/2+10,28),{anchor:"end"}),Object.assign(qt(wu(b,"dm"),c.x+c.dx/2-10,c.y-c.dy/2-6,28),{anchor:"end"})],
    sol:[A.hatch(c.bottom,"o"),A.hatch(c.front,"b"),A.hatch(c.side,"r"),A.tx(`${l} ${M} ${b} = ${A0}`,630,160,34,"o"),A.tx(`2 ${M} ${l} ${M} ${h} = ${A1}`,630,235,34,"b"),A.tx(`2 ${M} ${b} ${M} ${h} = ${A2}`,630,310,34,"r"),
     fin(A.hl(490,350,280,62)),fin(A.tx(wu(`A = ${tot}`,"dm2"),630,396,40,"g"))]}}
  let r,h;do{r=rint(3,6);h=rint(6,14)}while(!okPi(p=>2*p*r*h+p*r*r));
  const C=cylQ(r,h,true);C.sol.splice(1,0,C.bot);
  return{kind:"num",ans:C.tot,show:wu(fmt(C.tot),"cm2"),hc:4,
   q:[A.wipe(),...head2(T("Pennburken har inget lock. Hur stor är dess begränsningsarea?","The pencil pot has no lid. What is its surface area?","علبة الأقلام بلا غطاء. ما مساحتها الكلية؟"),T("Avrunda till hela cm².","Round to the nearest whole cm².","قرّب الناتج إلى أقرب عدد صحيح.")),...C.q],sol:C.sol}}
}));
fixHelp({surf9:[
 {say:t3("Begränsningsarea är som presentpapper: hur mycket papper behövs för att täcka hela paketet? Vik upp kartongen, så blir den sex rektanglar. Lägg ihop deras areor.",
   "Surface area is like wrapping paper: how much paper do you need to cover the whole present? Unfold the box and it becomes six rectangles. Add up their areas.",
   "المساحة الكلية مثل ورق تغليف الهدايا: كم ورقةً نحتاج لنغطي الهدية كلها؟ افرد العلبة فتصبح ستة مستطيلات، ثم اجمع مساحاتها."),
  draw:()=>{const c=cub(60,200,180,120,110),F=boxNet(400,110,120,70,60);
   return[A.hatch(c.front,"r"),A.hatch(c.top,"r"),A.hatch(c.side,"r"),...c.o,A.p(R.line(150,200,150,320,.2)+R.line(150,200,150+c.dx,200-c.dy,.2),"o",6),
    A.arrow(290,190,380,190,"k",-26),...netAct(F),...F.map((f,i)=>A.tx(i+1,f.x+f.w/2,f.y+f.h/2+12,34)),
    A.hl(400,412,380,58),A.tx(T("A = summan av 6 ytor","A = the sum of 6 faces","A = مجموع 6 أوجه"),590,454,34,"g")]}}]});
Object.assign(HINTSX,{surf9:[
 {say:t3("Ytorna kommer i tre par. Räkna ut en yta i varje par och ta gånger 2.","The faces come in three pairs. Work out one face in each pair and multiply by 2.","الأوجه ثلاثة أزواج. احسب مساحة وجه واحد من كل زوج واضربها في 2."),cut:g=>g.sol.slice(0,4)},
 {say:t3("Mantelytan är en rektangel: π · d gånger höjden. Lägg till två cirklar, π · r² var. En etikett är bara mantelytan, utan cirklarna.","The curved surface is a rectangle: π × d times the height. Add two circles, π × r² each. A label is only the curved surface, without the circles.",`المساحة الجانبية مستطيل: ${LRI("π × d")} مضروبًا في الارتفاع. أضف دائرتين، مساحة كل منهما ${LRI("π × r²")}. الملصق هو المساحة الجانبية فقط، بلا الدائرتين.`),cut:g=>g.sol.slice(0,4)},
 {say:t3("Utan lock finns bara en botten. Räkna bara de ytor som finns och lägg ihop.","With no lid there is only a bottom. Count only the faces that are there, then add them up.","بلا غطاء يوجد قاع فقط. احسب الأوجه الموجودة فقط ثم اجمعها."),cut:g=>g.sol.slice(0,g.hc)}]});

/* =====================================================================
   3. scale9: area scale and volume scale
   ===================================================================== */
/* a cube drawn as an n×n×n block of small cubes */
function cubeN(x,y,s,n,c="k"){const dep=s,dx=dep*.55,dy=dep*.4,o=cub(x,y,s,s,dep,c);let g="";
 for(let i=1;i<n;i++){const t=i/n;g+=R.line(x+s*t,y,x+s*t,y+s,.2)+R.line(x,y+s*t,x+s,y+s*t,.2)+R.line(x+s*t,y,x+s*t+dx,y-dy,.2)+R.line(x+dx*t,y-dy*t,x+s+dx*t,y-dy*t,.2)+R.line(x+s+dx*t,y-dy*t,x+s+dx*t,y+s-dy*t,.2)+R.line(x+s,y+s*t,x+s+dx,y+s*t-dy,.2)}
 return Object.assign(o,{grid:A.p(g,c,2.5)})}
const egg=(cx,by,h)=>{const w=h*.38;let d="";for(let i=0;i<=60;i++){const t=i/60*2*Math.PI,y=-Math.cos(t),x=Math.sin(t)*(1-.18*y);d+=(i?"L":"M")+f1(cx+x*w)+","+f1(by-h/2-y*h/2)}return d+"Z"};
const pizza=(cx,cy,r)=>[A.hatch(`M${cx-r},${cy}a${r},${r} 0 1,0 ${2*r},0a${r},${r} 0 1,0 ${-2*r},0`,"o"),A.p(R.circ(cx,cy,r)+R.circ(cx,cy,r*.86),"o",4),
 A.p(dots([[.3,.2],[-.4,.3],[.1,-.5],[-.2,-.1],[.45,-.3],[-.5,-.35],[0,.55]].map(([a,b])=>[cx+a*r,cy+b*r])),"r",Math.max(10,r*.16))];
const SCALE9={steps:[
 {say:t3("Vi förstorar en kub så att varje kant blir dubbelt så lång. Längdskalan är 2.",
   "We enlarge a cube so that every edge becomes twice as long. The length scale is 2.",
   "نكبّر مكعبًا بحيث يصبح طول كل حرفٍ ضعفَ ما كان. مقياس الطول 2."),
  draw:()=>{const a=cubeN(50,300,70,1),b=cubeN(200,230,140,2);return[A.wipe(),...a.o,...b.o,b.grid,qt(wu("1","cm"),85,410,28),qt(wu("2","cm"),270,410,28),
   A.arrow(150,250,206,214,"b",-20),A.tx(T("längdskala = 2","length scale = 2","مقياس الطول = 2"),620,130,36,"b")]}},
 {say:t3("Varje sida blir 2 · 2 = 4 gånger så stor. Areaskalan är 2² = 4.",
   "Each face becomes 2 × 2 = 4 times as big. The area scale is 2² = 4.",
   `تصبح مساحة كل وجهٍ ${LRI("2 × 2 = 4")} أضعاف ما كانت. مقياس المساحة ${LRI("2² = 4")}.`),
  draw:()=>[A.hatch("M50,300h70v70h-70Z","o"),A.hatch("M200,230h140v140h-140Z","o"),...[[235,290],[305,290],[235,360],[305,360]].map(([x,y],i)=>qt(i+1,x,y-8,28,"o")),
   A.tx(T("areaskala = 2² = 4","area scale = 2² = 4","مقياس المساحة = 2² = 4"),620,230,36,"o")]},
 {say:t3("Volymen blir 2 · 2 · 2 = 8 gånger så stor. Det får plats 8 små kuber i den stora. Volymskalan är 2³ = 8.",
   "The volume becomes 2 × 2 × 2 = 8 times as big. Eight small cubes fit inside the big one. The volume scale is 2³ = 8.",
   `يصبح الحجم ${LRI("2 × 2 × 2 = 8")} أضعاف ما كان، فالمكعب الكبير يتسع لثمانية مكعبات صغيرة. مقياس الحجم ${LRI("2³ = 8")}.`),
  draw:()=>{const b=cub(200,230,140,140,140);return[A.hatch(b.top,"r"),A.hatch(b.side,"r"),A.tx(T("volymskala = 2³ = 8","volume scale = 2³ = 8","مقياس الحجم = 2³ = 8"),620,330,36,"r"),
   A.hl(480,370,280,60),A.tx(T("8 små kuber","8 small cubes","8 مكعبات صغيرة"),620,412,34,"g")]}},
 {say:t3("Det gäller alla likformiga figurer. Med längdskalan k blir areaskalan k² och volymskalan k³. Baklänges tar vi roten ur.",
   "This works for all similar shapes. With the length scale k, the area scale is k² and the volume scale is k³. To go backwards, we take the root.",
   "هذا يصحّ لكل الأشكال المتشابهة: إذا كان مقياس الطول k فمقياس المساحة k² ومقياس الحجم k³. وللرجوع نأخذ الجذر."),
  draw:()=>{const X=[150,400,650],C=["b","o","r"],H=L(t3(["längdskala","areaskala","volymskala"],["length scale","area scale","volume scale"],["مقياس الطول","مقياس المساحة","مقياس الحجم"]));
   const rows=[["2","4","8"],["3","9","27"],["10","100",fmt(1000)]],o=[A.wipe()];
   X.forEach((x,i)=>o.push(A.band(x-110,40,220,330,C[i]),A.tx(H[i],x,82,32,C[i]),A.tx(["k","k²","k³"][i],x,126,36,C[i])));o.push(A.p(R.line(50,144,750,144,.4),"k",3));
   rows.forEach((r,j)=>r.forEach((v,i)=>o.push(A.tx(v,X[i],205+j*65,42))));
   o.push(A.hl(150,400,500,62),A.tx(lang==="ar"?`مقياس المساحة 25 ← ${LRI("k = √25 = 5")}`:T("areaskala 25 → k = √25 = 5","area scale 25 → k = √25 = 5",""),400,444,36,"g"));return o}},
 {say:t3("En pizza med diametern 30 cm mot en med 15 cm. Längdskalan är 2, så den stora har 2² = 4 gånger så mycket pizza!",
   "A pizza with a 30 cm diameter against one with 15 cm. The length scale is 2, so the big one has 2² = 4 times as much pizza!",
   `بيتزا قطرها 30 سم مقابل بيتزا قطرها 15 سم. مقياس الطول 2، إذن في الكبيرة ${LRI("2² = 4")} أضعاف كمية البيتزا!`),
  draw:()=>{const D=DIVS();return[A.wipe(),...pizza(110,300,60),...pizza(330,280,120),A.p(R.dashed(50,300,170,300,9),"k",2.5),A.p(R.dashed(210,280,450,280,9),"k",2.5),
   qt(wu("15","cm"),110,395,28),qt(wu("30","cm"),330,440,28),
   A.tx(`k = 30 ${D} 15 = 2`,625,150,36,"b"),A.tx(T("areaskala = 2² = 4","area scale = 2² = 4","مقياس المساحة = 2² = 4"),625,230,34,"o"),
   A.hl(485,290,280,62),A.tx(T("4 gånger så mycket!","4 times as much!","4 أضعاف!"),625,334,38,"g")]}},
 {say:t3("Ett chokladägg är 6 cm högt och väger 40 g. Ett likformigt ägg som är 12 cm högt väger 2³ = 8 gånger så mycket: 320 g.",
   "A chocolate egg is 6 cm tall and weighs 40 g. A similar egg that is 12 cm tall weighs 2³ = 8 times as much: 320 g.",
   `بيضة شوكولاتة ارتفاعها 6 سم ووزنها 40 غ. بيضةٌ مشابهة لها ارتفاعها 12 سم تزن ${LRI("2³ = 8")} أضعاف ذلك: 320 غ.`),
  draw:()=>{const [M,D]=MK2();return[A.wipe(),A.hatch(egg(140,400,130),"o"),A.p(egg(140,400,130),"o",4.5),A.hatch(egg(330,400,260),"o"),A.p(egg(330,400,260),"o",4.5),
   dimV(76,270,400),Object.assign(qt(wu("6","cm"),64,345,28),{anchor:"end"}),dimV(446,140,400),Object.assign(qt(wu("12","cm"),460,275,28),{anchor:"start"}),
   A.tx(wu("40","g"),140,450,30,"b"),A.tx("?",330,300,60,"r"),
   A.tx(`k = 12 ${D} 6 = 2`,665,140,34,"b"),A.tx(T("volymskala = 2³ = 8","volume scale = 2³ = 8","مقياس الحجم = 2³ = 8"),665,220,32,"r"),
   A.hl(550,262,230,62),A.tx(wu(`8 ${M} 40 = 320`,"g"),665,306,38,"g")]}}
]};
const tri=(x,by,base,c="k")=>{const pts=[[x,by],[x+base,by],[x+base*.32,by-base*.72]];return{pts,d:P2(pts)+"Z",o:A.p(plines(pts),c,4.5)}};
LESSONS.push(fixGen({id:"scale9",subject:"math",grades:"9",kind:"wb",
 title:t3("Areaskala och volymskala","Area scale and volume scale","مقياس المساحة ومقياس الحجم"),
 icon:ICO(`<g fill="none" stroke="#1d2433" stroke-width="3" stroke-linejoin="round"><path d="M40 120h36v36h-36zM40 120l18-13h36l-18 13M94 107v36l-18 13" /><path d="M140 80h80v80h-80zM140 80l40-28h80l-40 28M260 52v80l-40 28" stroke="#2257c9"/>
  <path d="M180 80v80M140 120h80M160 66h80M240 66v80M220 120l40-28" stroke="#2257c9" stroke-width="1.8"/></g><text x="80" y="60" ${CV} font-size="30" fill="#e07b00">k²</text><text x="290" y="170" ${CV} font-size="30" fill="#d63b2f">k³</text>`),
 steps:fixSteps(SCALE9.steps),mount:wbMount(SCALE9),
 gen(level){const [M,D]=MK2();
  /* the drawn triangles have area 0,36 · base², so the given areas match the picture */
  /* level 0: how many times as much pizza? (area scale) */
  if(level===0&&Math.random()<.3){const [d,k]=pick([[10,2],[12,2],[15,2],[16,2],[10,3],[12,3]]),D2=d*k,rs=40,rb=40*k;
   return{kind:"num",ans:k*k,show:`${k*k}`,hc:2,
    q:[A.wipe(),...head2(T(`En liten pizza har diametern ${d} cm och en stor ${D2} cm.`,`A small pizza is ${d} cm across and a big one is ${D2} cm.`,`قطر بيتزا صغيرة ${wu(d,"cm")} وقطر بيتزا كبيرة ${wu(D2,"cm")}.`),
      L(pick([t3("Hur många gånger så mycket pizza är den stora?","How many times as much pizza is the big one?","كم ضعفًا من البيتزا في الكبيرة؟"),t3("Bestäm areaskalan.","Find the area scale.","أوجد مقياس المساحة.")]))),
     ...pizza(60+rs,300,rs),...pizza(Math.min(560,150+2*rs+rb),300,Math.min(rb,150)),A.p(R.dashed(60,300,60+2*rs,300,9),"k",2.5),qt(wu(d,"cm"),60+rs,300+rs+36,26),qt(wu(D2,"cm"),Math.min(560,150+2*rs+rb),300+Math.min(rb,150)+36,28)],
    sol:[A.tx(`k = ${D2} ${D} ${d} = ${k}`,650,150,34,"b"),fin(A.tx(T(`areaskala = ${k}² = ${k*k}`,`area scale = ${k}² = ${k*k}`,`مقياس المساحة = ${LRI(`${k}² = ${k*k}`)}`),650,220,30,"o")),
     fin(A.hl(530,250,240,62)),fin(A.tx(T(`${k*k} gånger`,`${k*k} times`,`${k*k} أضعاف`),650,294,38,"g"))]}}
  if(level===0){const k=rint(2,4),a=rint(4,10),Asm=Math.round(.36*a*a),big=a*k,ans=Asm*k*k,sb=280/k;
   const s=tri(40,400,sb),B=tri(70+sb,400,280);
   return{kind:"num",ans,show:wu(fmt(ans),"cm2"),hc:2,
    q:[A.wipe(),...head2(T("Trianglarna är likformiga.","The triangles are similar.","المثلثان متشابهان."),L(pick([t3("Vilken area har den stora triangeln?","What is the area of the big triangle?","ما مساحة المثلث الكبير؟"),t3("Beräkna den stora triangelns area.","Work out the area of the big triangle.","احسب مساحة المثلث الكبير.")]))),
     A.hatch(s.d,"b"),s.o,B.o,qt(wu(a,"cm"),40+sb/2,434,26),qt(wu(big,"cm"),210+sb,434,28),A.tx(wu(`A = ${Asm}`,"cm2"),Math.max(80,40+sb/2),474,28,"b"),A.tx("A = ?",70+sb+280*.42,340,36,"r")],
    sol:[A.tx(`k = ${big} ${D} ${a} = ${k}`,630,170,36,"b"),A.tx(T(`areaskala = ${k}² = ${k*k}`,`area scale = ${k}² = ${k*k}`,`مقياس المساحة = ${k}² = ${k*k}`),630,250,32,"o"),
     fin(A.hl(490,290,280,62)),fin(A.tx(wu(`${k*k} ${M} ${Asm} = ${fmt(ans)}`,"cm2"),630,336,fitS(`${k*k} · ${Asm} = ${ans} cm²`,270,38),"g"))]}}
  if(level===1){const k=rint(2,3),ctx=pick(["egg","box"]);
   /* a solid chocolate egg weighs roughly 0,3 · height³ grams */
   if(ctx==="egg"){const [hs,m]=pick([[3,10],[4,20],[4,25],[5,35],[5,40],[6,60],[6,70]]),ans=m*k**3,hS=Math.min(270/k,100),hB=hS*k;
    return{kind:"num",ans,show:wu(fmt(ans),"g"),hc:2,
     q:[A.wipe(),...head2(T("Chokladäggen är likformiga.","The chocolate eggs are similar.","بيضتا الشوكولاتة متشابهتان."),L(pick([t3("Hur mycket väger det stora ägget?","How much does the big egg weigh?","كم تزن البيضة الكبيرة؟"),t3("Beräkna det stora äggets vikt.","Work out the weight of the big egg.","احسب وزن البيضة الكبيرة.")]))),
      A.hatch(egg(130,420,hS),"o"),A.p(egg(130,420,hS),"o",4.5),A.hatch(egg(305,420,hB),"o"),A.p(egg(305,420,hB),"o",4.5),
      dimV(130-hS*.38-18,420-hS,420),Object.assign(qt(wu(hs,"cm"),130-hS*.38-28,420-hS/2+10,26),{anchor:"end"}),dimV(305+hB*.38+22,420-hB,420),Object.assign(qt(wu(hs*k,"cm"),305+hB*.38+36,420-hB/2+10,28),{anchor:"start"}),
      A.tx(wu(m,"g"),130,420-hS-20,28,"b"),A.tx("?",305,420-hB/2+16,48,"r")],
     sol:[A.tx(`k = ${hs*k} ${D} ${hs} = ${k}`,650,170,36,"b"),A.tx(T(`volymskala = ${k}³ = ${k**3}`,`volume scale = ${k}³ = ${k**3}`,`مقياس الحجم = ${k}³ = ${k**3}`),650,250,30,"r"),
      fin(A.hl(520,290,260,62)),fin(A.tx(wu(`${k**3} ${M} ${m} = ${fmt(ans)}`,"g"),650,336,fitS(`${k**3} · ${m} = ${ans} g`,250,38),"g"))]}}
   /* the drawn box is w × 0,8w × 0,6w, so a box w cm wide holds about 0,48 · w³ cm³ */
   const hs=pick([15,16,18,20,22,24,25]),v=Math.round(.48*hs**3/1000),ans=v*k**3,s=cub(50,410-160/k,200/k,160/k,120/k),bx=50+266/k+50,bb=cub(bx,250,200,160,120);
   return{kind:"num",ans,show:wu(ans,"l"),hc:2,
    q:[A.wipe(),...head2(T("Lådorna är likformiga.","The boxes are similar.","الصندوقان متشابهان."),T("Hur många liter rymmer den stora lådan?","How many litres does the big box hold?","كم لترًا يتسع الصندوق الكبير؟")),
     A.hatch(s.front,"b"),...s.o,...bb.o,qt(wu(hs,"cm"),50+100/k,440,26),qt(wu(hs*k,"cm"),bx+100,442,28),A.tx(wu(v,"l"),50+133/k,410-160/k-48/k-18,28,"b"),A.tx("?",bx+100,346,48,"r")],
    sol:[A.tx(`k = ${hs*k} ${D} ${hs} = ${k}`,640,170,36,"b"),A.tx(T(`volymskala = ${k}³ = ${k**3}`,`volume scale = ${k}³ = ${k**3}`,`مقياس الحجم = ${k}³ = ${k**3}`),640,250,30,"r"),
     fin(A.hl(510,290,260,62)),fin(A.tx(wu(`${k**3} ${M} ${v} = ${ans}`,"l"),640,336,fitS(`${k**3} · ${v} = ${ans} liter`,250,38),"g"))]}}
  if(Math.random()<.5){const k=rint(2,5),a=rint(3,9),A1=Math.round(.36*a*a),A2=A1*k*k,ans=a*k,sb=280/k;
   const s=tri(40,400,sb),B=tri(70+sb,400,280);
   return{kind:"num",ans,show:wu(ans,"cm"),hc:2,
    q:[A.wipe(),...head2(T("Trianglarna är likformiga.","The triangles are similar.","المثلثان متشابهان."),T("Hur lång är basen på den stora triangeln?","How long is the base of the big triangle?","ما طول قاعدة المثلث الكبير؟")),
     A.hatch(s.d,"b"),A.hatch(B.d,"b"),s.o,B.o,qt(wu(a,"cm"),40+sb/2,434,26),A.tx("?",210+sb,440,40,"r"),A.tx(wu(`A = ${A1}`,"cm2"),Math.max(80,40+sb/2),474,28,"b"),A.tx(wu(`A = ${A2}`,"cm2"),70+sb+280*.42,340,30,"b")],
    sol:[A.tx(T("areaskala","area scale","مقياس المساحة"),630,150,30,"o"),A.tx(`${A2} ${D} ${A1} = ${k*k}`,630,198,36,"o"),
     A.tx(`k = √${k*k} = ${k}`,630,262,36,"b"),fin(A.hl(490,290,280,62)),fin(A.tx(wu(`${a} ${M} ${k} = ${ans}`,"cm"),630,336,38,"g"))]}}
  /* the drawn parcel is 1,13h × h × 0,67h, about 0,76 · h³: 15 cm → 3 l, 20 cm → 6 l, 25 cm → 12 l */
  const k=rint(2,4),[hs,V1]=pick([[15,3],[20,6],[25,12]]),V2=V1*k**3,ans=hs*k,s=cub(90,400-150/k,170/k,150/k,100/k),bx=90+225/k+50,bb=cub(bx,250,170,150,100);
  return{kind:"num",ans,show:wu(ans,"cm"),hc:2,
   q:[A.wipe(),...head2(T("Paketen är likformiga.","The parcels are similar.","الطردان متشابهان."),T("Hur högt är det stora paketet?","How tall is the big parcel?","ما ارتفاع الطرد الكبير؟")),
    A.hatch(s.front,"b"),A.hatch(bb.front,"b"),...s.o,...bb.o,Object.assign(qt(wu(hs,"cm"),78,400-75/k+10,26),{anchor:"end"}),A.tx("?",bx-12,340,40,"r","end"),
    A.tx(wu(`V = ${V1}`,"l"),Math.max(120,90+85/k),446,26,"b"),A.tx(wu(`V = ${fmt(V2)}`,"l"),bx+85,446,28,"b")],
   sol:[A.tx(T("volymskala","volume scale","مقياس الحجم"),640,150,30,"r"),A.tx(`${fmt(V2)} ${D} ${V1} = ${k**3}`,640,198,36,"r"),
    A.tx(`k = ∛${k**3} = ${k}`,640,262,36,"b"),fin(A.hl(505,290,270,62)),fin(A.tx(wu(`${hs} ${M} ${k} = ${ans}`,"cm"),640,336,38,"g"))]}}
}));
fixHelp({scale9:[
 {say:t3("Bygg med sockerbitar. En kub som är 2 bitar lång har 2 · 2 = 4 bitar på varje sida och 2 · 2 · 2 = 8 bitar totalt.",
   "Build with sugar cubes. A cube that is 2 cubes long has 2 × 2 = 4 cubes on each face and 2 × 2 × 2 = 8 cubes in total.",
   `ابنِ بمكعبات السكر. المكعب الذي طوله قطعتان فيه ${LRI("2 × 2 = 4")} قطع على كل وجه، و${LRI("2 × 2 × 2 = 8")} قطع في المجموع.`),
  draw:()=>{const M=MUL(),a=cubeN(60,250,70,1),sq=cubeN(270,180,140,2),b=cubeN(540,180,140,2);
   return[...a.o,A.p(R.rect(260,180,140,140,.3)+R.line(330,180,330,320,.2)+R.line(260,250,400,250,.2),"k",4),A.hatch("M260,180h140v140h-140Z","o"),...b.o,b.grid,A.hatch(b.top,"r"),A.hatch(b.side,"r"),A.hatch(b.front,"r"),
    A.tx("1",95,380,40,"b"),A.tx(`2 ${M} 2 = 4`,330,380,40,"o"),A.tx(`2 ${M} 2 ${M} 2 = 8`,640,380,40,"r"),
    A.tx(T("längd","length","الطول"),95,440,30,"b"),A.tx(T("yta","face","الوجه"),330,440,30,"o"),A.tx(T("volym","volume","الحجم"),640,440,30,"r")]}}]});
Object.assign(HINTSX,{scale9:[
 {say:t3("Räkna först ut längdskalan k. Arean blir k² gånger så stor.","First work out the length scale k. The area becomes k² times as big.","احسب أولًا مقياس الطول k، ثم اضرب المساحة في k²."),cut:g=>g.sol.slice(0,1)},
 {say:t3("Räkna först ut längdskalan k. Volymen och vikten blir k³ gånger så stora.","First work out the length scale k. The volume and the weight become k³ times as big.","احسب أولًا مقياس الطول k، ثم اضرب الحجم أو الوزن في k³."),cut:g=>g.sol.slice(0,1)},
 {say:t3("Dela den stora arean eller volymen med den lilla. Längdskalan är roten ur kvoten.","Divide the big area or volume by the small one. The length scale is the root of that.","اقسم المساحة أو الحجم الأكبر على الأصغر. مقياس الطول هو جذر الناتج."),cut:g=>g.sol.slice(0,2)}]});

/* =====================================================================
   4. pythapp9: Pythagoras in real life
   ===================================================================== */
const ladder=(fx,fy,tx,ty,c="o")=>{const dx=tx-fx,dy=ty-fy,l=Math.hypot(dx,dy),nx=-dy/l*10,ny=dx/l*10;let d=R.line(fx+nx,fy+ny,tx+nx,ty+ny,.2)+R.line(fx-nx,fy-ny,tx-nx,ty-ny,.2);
 for(let i=1;i<10;i++){const t=i/10;d+=R.line(fx+dx*t+nx,fy+dy*t+ny,fx+dx*t-nx,fy+dy*t-ny,.1)}return A.p(d,c,4)};
const wall=(x,y1,y2,gx1)=>[A.p(R.line(x,y1,x,y2,.2)+R.line(gx1,y2,x+40,y2,.2),"k",5),A.hatch(`M${x},${y1}h30v${y2-y1}h-30Z`,"k")];
const PYTH9={steps:[
 {say:t3("Storleken på en tv mäts längs diagonalen. Diagonalen delar skärmen i två rätvinkliga trianglar, så vi kan använda Pythagoras sats.",
   "The size of a TV is measured along the diagonal. The diagonal splits the screen into two right-angled triangles, so we can use Pythagoras' theorem.",
   "يُقاس مقاس شاشة التلفاز على طول قطرها. القطر يقسم الشاشة إلى مثلثين قائمي الزاوية، لذلك نستطيع أن نستخدم نظرية فيثاغورس."),
  draw:()=>[A.wipe(),A.p(R.rect(110,120,320,240,.3),"k",6),A.p(R.line(270,360,270,392,.2)+R.line(220,394,320,394,.2),"k",5),A.hatch("M110,360L430,360L430,120Z","b"),
   A.p(R.line(110,360,430,120,.3),"r",5),ra(430,360,-1,-1,18),qt(wu("80","cm"),270,105,28),Object.assign(qt(wu("60","cm"),98,250,28),{anchor:"end"}),qt("c",250,236,34,"r"),
   A.tx("a² + b² = c²",620,140,42,"b")]},
 {say:t3("Tv:n är 80 cm bred och 60 cm hög. c² = 80² + 60² = 10 000, så c = 100 cm. Det är ungefär 39 tum.",
   "The TV is 80 cm wide and 60 cm high. c² = 80² + 60² = 10,000, so c = 100 cm. That is about 39 inches.",
   `عرض التلفاز 80 سم وارتفاعه 60 سم. ${LRI("c² = 80² + 60² = 10000")}، إذن ${LRI("c = 100")} سم، أي نحو 39 بوصة.`),
  draw:()=>[A.tx("c² = 80² + 60²",620,215,38),A.tx(`c² = ${fmt(6400)} + ${fmt(3600)}`,620,285,36),A.tx(`c = √${fmt(10000)}`,620,355,38),
   A.hl(490,390,260,62),A.tx(wu("c = 100","cm"),620,436,42,"g"),A.tx(T("≈ 39 tum","≈ 39 inches","≈ 39 بوصة"),270,450,32,"b")]},
 {say:t3("En fotbollsplan är 105 m lång och 68 m bred. Runt hörnet är det 173 m, men snett över planen bara cirka 125 m.",
   "A football pitch is 105 m long and 68 m wide. Round the corner it is 173 m, but straight across the pitch only about 125 m.",
   "طول ملعب كرة القدم 105 م وعرضه 68 م. المسافة حول الزاوية 173 م، أما قطريًّا عبر الملعب فنحو 125 م فقط."),
  draw:()=>{const x=70,y=150,w=315,h=204;return[A.wipe(),A.hatch(`M${x},${y}h${w}v${h}h${-w}Z`,"g"),A.p(R.rect(x,y,w,h,.3)+R.line(x+w/2,y,x+w/2,y+h,.2)+R.circ(x+w/2,y+h/2,28)+R.rect(x,y+h/2-50,48,100,.2)+R.rect(x+w-48,y+h/2-50,48,100,.2),"g",3.5),
   A.p(R.line(x,y+h,x+w,y+h,.2)+R.line(x+w,y+h,x+w,y,.2),"o",6),A.p(R.arrow(x,y+h,x+w,y,0),"r",5),
   qt(wu("105","m"),x+w/2,y+h+36,28),Object.assign(qt(wu("68","m"),x+w+14,y+h/2+10,28),{anchor:"start"}),
   A.tx(wu("105 + 68 = 173","m"),625,140,fitS("105 + 68 = 173 m",300,34),"o"),A.tx("c² = 105² + 68²",625,215,34,"r"),A.tx(`c = √${fmt(15649)}`,625,285,34),
   A.hl(495,320,260,62),A.tx(wu("c ≈ 125","m"),625,366,40,"g")]}},
 {say:t3("En 5 m lång stege står 1,4 m från väggen. Nu söker vi en katet: h² = 5² − 1,4² = 23,04, så stegen når 4,8 m upp.",
   "A 5 m ladder stands 1.4 m from the wall. Now we are looking for a leg: h² = 5² − 1.4² = 23.04, so the ladder reaches 4.8 m up.",
   `سلّمٌ طوله 5 م، وأسفله يبعد 1.4 م عن الحائط. نبحث الآن عن ضلعٍ قائم: ${LRI("h² = 5² − 1.4² = 23.04")}، إذن يصل السلّم إلى ارتفاع 4.8 م.`),
  draw:()=>{const wx=380,gy=420,fx=wx-95,ty=gy-326,d=dfmt;return[A.wipe(),...wall(wx,60,gy,120),ladder(fx,gy,wx,ty),ra(wx,gy,-1,-1,16),
   Object.assign(qt(wu("5","m"),fx+(wx-fx)/2-28,gy-163,30,"o"),{anchor:"end"}),qt(wu(d(1.4,1),"m"),fx+47,gy+36,28),dimV(wx+48,ty,gy,"r"),Object.assign(qt("h",wx+62,gy-153,32,"r"),{anchor:"start"}),
   A.tx(`h² + ${d(1.4,1)}² = 5²`,620,130,36,"b"),A.tx(`h² = 25 − ${d(1.96,2)}`,620,200,36),A.tx(`h² = ${d(23.04,2)}`,620,270,36),A.tx(`h = √${d(23.04,2)}`,620,340,36),
   A.hl(500,374,240,62),A.tx(wu(`h = ${d(4.8,1)}`,"m"),620,420,42,"g")]}},
 {say:t3("Avståndet mellan A = (1, 2) och B = (7, 10)? Rita en rätvinklig triangel: 6 steg åt höger och 8 steg upp. AB = √(6² + 8²) = 10.",
   "What is the distance between A = (1, 2) and B = (7, 10)? Draw a right-angled triangle: 6 steps right and 8 steps up. AB = √(6² + 8²) = 10.",
   `ما المسافة بين ${LRI("A = (1, 2)")} و${LRI("B = (7, 10)")}؟ نرسم مثلثًا قائم الزاوية: 6 خطوات إلى اليمين و8 خطوات إلى الأعلى. ${LRI("AB = √(6² + 8²) = 10")}.`),
  draw:()=>{const u=33,ox=100,oy=440,X=x=>ox+x*u,Y=y=>oy-y*u,o=[A.wipe()];let g="";
   for(let i=1;i<=8;i++)g+=`M${X(i)},${Y(0)}V${Y(10.6)}`;for(let j=1;j<=10;j++)g+=`M${X(0)},${Y(j)}H${X(8.6)}`;
   o.push(A.p(g,"#c9d2e3",1.5),A.p(R.arrow(X(0),Y(0),X(8.9),Y(0))+R.arrow(X(0),Y(0),X(0),Y(11)),"k",3.5));
   [2,4,6,8].forEach(i=>o.push(qt(i,X(i),Y(0)+30,24)));[2,4,6,8,10].forEach(j=>o.push(qt(j,X(0)-22,Y(j)+8,24)));
   o.push(A.p(R.dashed(X(1),Y(2),X(7),Y(2),9),"o",4),A.p(R.dashed(X(7),Y(2),X(7),Y(10),9),"b",4),A.p(R.line(X(1),Y(2),X(7),Y(10),.2),"r",5),ra(X(7),Y(2),-1,-1,14),
    A.p(dots([[X(1),Y(2)],[X(7),Y(10)]]),"r",16),qt("A",X(1)-20,Y(2)+6,30,"r"),qt("B",X(7)-24,Y(10)+4,30,"r"),qt("6",X(4),Y(2)+30,28,"o"),qt("8",X(7)+20,Y(6)+8,28,"b"),
    A.tx(`Δx = 7 − 1 = 6`,620,140,34,"o"),A.tx(`Δy = 10 − 2 = 8`,620,210,34,"b"),A.tx(`AB² = 6² + 8² = 100`,620,285,32),A.hl(490,322,260,62),A.tx(`AB = √100 = 10`,620,368,36,"g"));return o}},
 {say:t3("Snickarknepet: mät 30 cm och 40 cm från hörnet. Är avståndet mellan märkena 50 cm är hörnet rätt, eftersom 30² + 40² = 50².",
   "The builder's trick: measure 30 cm and 40 cm from the corner. If the distance between the marks is 50 cm, the corner is square, because 30² + 40² = 50².",
   `حيلة النجّارين: قِس 30 سم و40 سم من الزاوية. إذا كانت المسافة بين العلامتين 50 سم فالزاوية قائمة، لأن ${LRI("30² + 40² = 50²")}.`),
  draw:()=>{const cx=110,cy=410;return[A.wipe(),A.hatch(`M${cx-30},${cy}h400v30h-400Z`,"o"),A.hatch(`M${cx-30},${cy}v-330h30v330Z`,"o"),A.p(R.rect(cx-30,cy,400,30,.3)+R.rect(cx-30,cy-330,30,330,.3),"o",4),
   A.p(dots([[cx,cy-210],[cx+280,cy]]),"r",14),A.p(R.line(cx,cy-210,cx+280,cy,.2),"r",4.5),ra(cx,cy,1,-1,18),
   Object.assign(qt(wu("30","cm"),cx+14,cy-100,28,"b"),{anchor:"start"}),qt(wu("40","cm"),cx+140,cy-14,28,"b"),qt(wu("50","cm"),cx+165,cy-128,30,"r"),
   A.tx(`30² + 40²`,620,140,38),A.tx(`= 900 + ${fmt(1600)}`,620,210,36),A.tx(`= ${fmt(2500)} = 50²`,620,280,36),
   A.hl(490,322,260,62),A.tx(T("rät vinkel ✓","right angle ✓","زاوية قائمة ✓"),620,366,38,"g")]}}
]};
const RCTX=[{k:"tv",t:t3("Tv-skärmen","The TV screen","شاشة التلفاز"),u:"cm",w:[70,140],h:[40,80]},{k:"pitch",t:t3("Planen","The pitch","الملعب"),u:"m",w:[60,110],h:[40,75]},
 {k:"tab",t:t3("Surfplattan","The tablet","الجهاز اللوحي"),u:"cm",w:[16,28],h:[11,20]},{k:"door",t:t3("Dörren","The door","الباب"),u:"cm",w:[70,100],h:[195,215]}];
LESSONS.push(fixGen({id:"pythapp9",subject:"math",grades:"9",kind:"wb",
 title:t3("Pythagoras sats i vardagen","Pythagoras in real life","نظرية فيثاغورس في الحياة اليومية"),
 icon:ICO(`<rect x="40" y="38" width="130" height="96" fill="#2257c9" fill-opacity=".1" stroke="#1d2433" stroke-width="5" rx="3"/><path d="M40 134L170 38" stroke="#d63b2f" stroke-width="5"/><path d="M95 136v14M75 152h40" stroke="#1d2433" stroke-width="4"/>
  <path d="M270 30V150M230 150H290" stroke="#1d2433" stroke-width="4"/><path d="M226 148L264 40M240 152L278 44" stroke="#e07b00" stroke-width="3.5"/><text x="230" y="30" ${CV} font-size="26" fill="#1d2433">a² + b² = c²</text>`),
 steps:fixSteps(PYTH9.steps),mount:wbMount(PYTH9),
 gen(level){const M=MUL();
  /* level 0: walk straight across the pitch, how many metres shorter? */
  if(level===0&&Math.random()<.3){let w,h,c,dd;do{w=rint(60,110);h=rint(40,75);c=Math.hypot(w,h);dd=w+h-c}while(!safe(dd)||!safe(c)||w-h<10);
   const ans=rnd(w+h)-rnd(c),sc=Math.min(320/w,250/h),W=w*sc,H=h*sc,x=110+(320-W)/2,y=170+(250-H)/2;
   return{kind:"num",ans,show:wu(fmt(ans),"m"),hc:2,
    q:[A.wipe(),...head2(T("Du går snett över planen i stället för längs kanterna.","You walk diagonally across the pitch instead of along the edges.","تمشي قطريًا عبر الملعب بدلًا من المشي على حافتيه."),
      L(pick([t3("Hur många meter kortare blir vägen? Avrunda till hela m.","How many metres shorter is the walk? Round to whole m.","بكم مترًا يقصر الطريق؟ قرّب إلى أقرب عدد صحيح."),t3("Beräkna hur mycket kortare vägen blir. Svara i hela meter.","Work out how much shorter the walk is. Answer in whole metres.","احسب بكم يقصر الطريق. أجب بالأمتار الكاملة.")]))),
     A.hatch(`M${x},${y}h${W}v${H}h${-W}Z`,"g"),A.p(R.rect(x,y,W,H,.3)+R.line(x+W/2,y,x+W/2,y+H,.2)+R.circ(x+W/2,y+H/2,Math.min(W,H)*.14),"g",3.5),
     A.p(R.line(x,y+H,x+W,y+H,.2)+R.line(x+W,y+H,x+W,y,.2),"o",6),A.p(R.arrow(x,y+H,x+W,y,0),"r",5),
     qt(wu(w,"m"),x+W/2,y+H+36,28),Object.assign(qt(wu(h,"m"),x+W+14,y+H/2+10,28),{anchor:"start"})],
    sol:[A.tx(wu(`${w} + ${h} = ${w+h}`,"m"),630,150,34,"o"),A.tx(`c² = ${w}² + ${h}²`,630,215,34,"r"),A.tx(wu(`c = √${fmt(w*w+h*h)} ≈ ${fmt(rnd(c))}`,"m"),630,280,fitS(`c = √${w*w+h*h} ≈ ${rnd(c)} m`,300,32)),
     fin(A.hl(500,318,260,62)),fin(A.tx(wu(`${w+h} − ${fmt(rnd(c))} = ${fmt(ans)}`,"m"),630,364,fitS(`${w+h} − ${rnd(c)} = ${ans} m`,250,38),"g"))]}}
  /* level 2: the carpenter's check, is the corner a right angle? */
  if(level===2&&Math.random()<.3){const [a0,b0,c0]=pick([[3,4,5],[6,8,10],[5,12,13],[8,15,17]]),k=c0>12?5:10,a=a0*k,b=b0*k,yes=Math.random()<.5,c=yes?c0*k:c0*k+pick([-3,-2,-1,1,2,3]),ok=a*a+b*b===c*c;
   const O=[t3("Ja, hörnet är rätt (90°)","Yes, the corner is right (90°)","نعم، الزاوية قائمة (90°)"),t3("Nej, hörnet är inte 90°","No, the corner is not 90°","لا، الزاوية ليست 90°")],ans=ok?0:1,cx=110,cy=420,sx=Math.min(300/b,300/a),pa=a*sx,pb=b*sx;
   return{kind:"choice",opts:O,ans,show:L(O[ans]),hc:2,
    q:[A.wipe(),...head2(T(`En snickare mäter ${a} cm och ${b} cm från hörnet. Mellan märkena är det ${c} cm.`,`A carpenter measures ${a} cm and ${b} cm from the corner. The marks are ${c} cm apart.`,`يقيس نجّار ${wu(a,"cm")} و${wu(b,"cm")} من الركن، والمسافة بين العلامتين ${wu(c,"cm")}.`),
      L(pick([t3("Är hörnet rätvinkligt?","Is the corner a right angle?","هل الزاوية قائمة؟"),t3("Avgör om vinkeln är rät.","Decide if the angle is a right angle.","حدّد هل الزاوية قائمة.")]))),
     A.hatch(`M${cx-30},${cy}h${pb+60}v30h${-pb-60}Z`,"o"),A.hatch(`M${cx-30},${cy}v${-pa-40}h30v${pa+40}Z`,"o"),A.p(R.rect(cx-30,cy,pb+60,30,.3)+R.rect(cx-30,cy-pa-40,30,pa+40,.3),"o",4),
     A.p(dots([[cx,cy-pa],[cx+pb,cy]]),"r",14),A.p(R.line(cx,cy-pa,cx+pb,cy,.2),"r",4.5),A.tx("?",cx+22,cy-16,30,"r","start"),
     Object.assign(qt(wu(a,"cm"),cx+14,cy-pa/2,28,"b"),{anchor:"start"}),qt(wu(b,"cm"),cx+pb/2,cy-14,28,"b"),qt(wu(c,"cm"),cx+pb/2+30,cy-pa/2-24,30,"r")],
    sol:[A.tx(`${a}² + ${b}² = ${fmt(a*a+b*b)}`,620,170,34),A.tx(`${c}² = ${fmt(c*c)}`,620,240,34,"r"),
     fin(A.tx(ok?`${fmt(a*a+b*b)} = ${fmt(c*c)}`:`${fmt(a*a+b*b)} ≠ ${fmt(c*c)}`,620,310,36,ok?"g":"r")),fin(A.hl(470,340,300,62)),fin(A.tx(L(O[ans]),620,384,fitS(L(O[ans]),290,30),"g"))]}}
  if(level===0){let C,w,h,c;do{C=pick(RCTX);w=rint(...C.w);h=rint(...C.h);c=Math.hypot(w,h)}while(!safe(c)||Math.abs(w-h)<4);
   const ans=rnd(c),sc=Math.min(320/w,250/h),W=w*sc,H=h*sc,x=110+(320-W)/2,y=150+(250-H)/2,un=C.u,o=[A.wipe(),
    ...head2(T(`${L(C.t)}: hur lång är diagonalen?`,`${L(C.t)}: how long is the diagonal?`,`${L(C.t)}: ما طول القطر؟`),T(`Avrunda till hela ${un}.`,`Round to the nearest whole ${un}.`,"قرّب الناتج إلى أقرب عدد صحيح."))];
   if(C.k==="pitch")o.push(A.hatch(`M${x},${y}h${W}v${H}h${-W}Z`,"g"),A.p(R.line(x+W/2,y,x+W/2,y+H,.2)+R.circ(x+W/2,y+H/2,Math.min(W,H)*.14),"g",3));
   if(C.k==="tv")o.push(A.p(R.line(x+W/2,y+H,x+W/2,y+H+22,.2)+R.line(x+W/2-40,y+H+24,x+W/2+40,y+H+24,.2),"k",4));
   if(C.k==="door")o.push(A.p(R.circ(x+W*.82,y+H*.52,7),"k",3.5),A.hatch(`M${x},${y}h${W}v${H}h${-W}Z`,"o"));
   if(C.k==="tab")o.push(A.p(R.circ(x+W-14,y+H/2,6),"k",3));
   o.push(A.p(R.rect(x,y,W,H,.3),"k",5),A.p(R.dashed(x,y+H,x+W,y,10),"r",4),ra(x+W,y+H,-1,-1,16),qt(wu(w,un),x+W/2,y-14,28),Object.assign(qt(wu(h,un),x-12,y+H/2+10,28),{anchor:"end"}),qt("?",x+W/2-H/Math.hypot(W,H)*26,y+H/2-W/Math.hypot(W,H)*26+14,40,"r"));
   return{kind:"num",ans,show:wu(fmt(ans),un),hc:2,q:o,
    sol:[A.p(R.line(x,y+H,x+W,y,.3),"r",5),A.tx(`c² = ${w}² + ${h}²`,630,170,36,"b"),A.tx(`c² = ${fmt(w*w)} + ${fmt(h*h)}`,630,245,fitS(`c² = ${w*w} + ${h*h}`,300,34)),A.tx(`c = √${fmt(w*w+h*h)}`,630,320,34),
     fin(A.hl(500,358,260,62)),fin(A.tx(wu(`c ${Math.abs(Math.hypot(w,h)-ans)<1e-9?"=":"≈"} ${fmt(ans)}`,un),630,404,40,"g"))]}}
  if(level===1){let Lg,a,h;do{Lg=pick([3,3.5,4,4.5,5,5.5,6]);a=rint(10,24)/10;h=Math.sqrt(Lg*Lg-a*a)}while(!safe(h,1)||a>Lg*.45);
   const ans=rnd(h,1),sc=290/Lg,wx=360,gy=440,fx=wx-a*sc,ty=gy-h*sc,d=dfmt,ls=nf(Lg),as=nf(a);
   return{kind:"num",dec:true,ans,show:wu(nf(ans),"m"),hc:2,
    q:[A.wipe(),...head2(L(pick([t3("Hur högt upp på väggen når stegen?","How high up the wall does the ladder reach?","إلى أي ارتفاع على الحائط يصل السلّم؟"),t3("Beräkna hur högt stegen når.","Work out how high the ladder reaches.","احسب الارتفاع الذي يصل إليه السلّم.")])),T("Avrunda till en decimal.","Round to one decimal place.","قرّب الناتج إلى منزلة عشرية واحدة.")),
     ...wall(wx,ty-20,gy,fx-80),ladder(fx,gy,wx,ty),ra(wx,gy,-1,-1,16),Object.assign(qt(wu(ls,"m"),fx+(wx-fx)/2-26,gy-h*sc/2,30,"o"),{anchor:"end"}),
     qt(wu(as,"m"),fx+(wx-fx)/2,gy+36,28),dimV(wx+48,ty,gy,"r"),Object.assign(qt("h = ?",wx+62,gy-h*sc/2+10,32,"r"),{anchor:"start"})],
    sol:[A.tx(`h² + ${as}² = ${ls}²`,650,150,34,"b"),A.tx(`h² = ${nf(Lg*Lg,2)} − ${nf(a*a,2)}`,650,215,34),A.tx(`h² = ${nf(Lg*Lg-a*a,2)}`,650,280,34),A.tx(`h = √${nf(Lg*Lg-a*a,2)}`,650,345,34),
     fin(A.hl(530,380,240,62)),fin(A.tx(wu(`h ${Math.abs(h-ans)<1e-9?"=":"≈"} ${nf(ans)}`,"m"),650,426,40,"g"))]}}
  let x1,y1,x2,y2,d;do{x1=rint(-5,5);x2=rint(-5,5);y1=rint(-4,4);y2=rint(-4,4);d=Math.hypot(x2-x1,y2-y1)}while(Math.abs(x2-x1)<2||Math.abs(y2-y1)<2||!x1||!x2||!y1||!y2||!safe(d,1));
  const sq=n=>n<0?`(${ng(n)})²`:`${n}²`,ans=rnd(d,1),u=32,ox=255,oy=300,X=x=>ox+x*u,Y=y=>oy-y*u,dx=x2-x1,dy=y2-y1,S=dx*dx+dy*dy,o=[A.wipe(),
   ...head2(L(pick([t3("Hur långt är det mellan A och B?","How far is it from A to B?","ما المسافة بين A وB؟"),t3("Beräkna avståndet mellan A och B.","Work out the distance between A and B.","احسب المسافة بين A وB.")])),T("Avrunda till en decimal.","Round to one decimal place.","قرّب الناتج إلى منزلة عشرية واحدة."))];
  let g="";for(let i=-5;i<=5;i++)if(i)g+=`M${X(i)},${Y(-4.5)}V${Y(4.5)}`;for(let j=-4;j<=4;j++)if(j)g+=`M${X(-5.5)},${Y(j)}H${X(5.5)}`;
  o.push(A.p(g,"#c9d2e3",1.5),A.p(R.arrow(X(-5.6),Y(0),X(5.8),Y(0))+R.arrow(X(0),Y(-4.6),X(0),Y(4.9)),"k",3.5),qt("x",X(5.8),Y(0)+30,26),qt("y",X(0)+20,Y(4.9),26));
  [-4,-2,2,4].forEach(i=>o.push(qt(ng(i),X(i),Y(0)+26,22)));[-4,-2,2,4].forEach(j=>o.push(Object.assign(qt(ng(j),X(0)-8,Y(j)+8,22),{anchor:"end"})));
  /* letter beside the point, away from the other point and clear of the axis numbers */
  const tick=[...[-4,-2,2,4].map(i=>[X(i),Y(0)+18]),...[-4,-2,2,4].map(j=>[X(0)-20,Y(j)])];
  const lab=(px,py,qx,qy,n)=>{const hx=px>qx?1:-1,vy=py>qy?-1:1;
   for(const [a,b] of [[hx,vy],[hx,-vy],[-hx,vy],[-hx,-vy]]){const lx=X(px)+a*18,cy=Y(py)+b*20;if(tick.every(([tx,ty])=>Math.abs(tx-lx)>26||Math.abs(ty-cy)>26))return qt(n,lx,cy+10,30,"r")}
   return qt(n,X(px)+hx*18,Y(py)+vy*20+10,30,"r")};
  o.push(A.p(dots([[X(x1),Y(y1)],[X(x2),Y(y2)]]),"r",16),lab(x1,y1,x2,y2,"A"),lab(x2,y2,x1,y1,"B"),A.tx(`A = (${ng(x1)}, ${ng(y1)})`,640,150,34,"r"),A.tx(`B = (${ng(x2)}, ${ng(y2)})`,640,200,34,"r"));
  const cxp=x2,cyp=y1;
  return{kind:"num",dec:true,ans,show:nf(ans),hc:4,q:o,
   sol:[A.p(R.dashed(X(x1),Y(y1),X(cxp),Y(cyp),9),"o",4),A.p(R.dashed(X(cxp),Y(cyp),X(x2),Y(y2),9),"b",4),A.tx(`Δx = ${ng(x2)} − ${x1<0?`(${ng(x1)})`:x1} = ${ng(dx)}`,640,265,fitS(`Δx = ${x2} − (${x1}) = ${dx}`,290,32),"o"),
    A.tx(`Δy = ${ng(y2)} − ${y1<0?`(${ng(y1)})`:y1} = ${ng(dy)}`,640,320,fitS(`Δy = ${y2} − (${y1}) = ${dy}`,290,32),"b"),A.p(R.line(X(x1),Y(y1),X(x2),Y(y2),.2),"r",4.5),
    A.tx(`AB² = ${sq(dx)} + ${sq(dy)} = ${S}`,640,375,fitS(`AB² = ${sq(dx)} + ${sq(dy)} = ${S}`,290,32)),fin(A.hl(510,402,260,62)),fin(A.tx(`AB = √${S} ${Number.isInteger(Math.sqrt(S))?"=":"≈"} ${nf(ans)}`,640,448,fitS(`AB = √${S} ≈ ${ans}`,250,38),"g"))]}}
}));
fixHelp({pythapp9:[
 {say:t3("Rita kvadrater på trianglens sidor. Rutorna i de två små kvadraterna är lika många som i den stora: 9 + 16 = 25.",
   "Draw squares on the sides of the triangle. The two small squares have as many little squares as the big one: 9 + 16 = 25.",
   "ارسم مربعات على أضلاع المثلث. عدد المربعات الصغيرة في المربعين الصغيرين يساوي عددها في المربع الكبير: 9 + 16 = 25."),
  draw:()=>{const u=34,Cx=300,Cy=300,P=[Cx,Cy],Bp=[Cx+4*u,Cy],Ap=[Cx,Cy-3*u],v=[Bp[0]-Ap[0],Bp[1]-Ap[1]];
   const N=[v[1],-v[0]],Q=[Ap,Bp,[Bp[0]+N[0],Bp[1]+N[1]],[Ap[0]+N[0],Ap[1]+N[1]]];
   let gl="";for(let i=1;i<4;i++)gl+=R.line(Cx-3*u,Cy-i*u,Cx,Cy-i*u,.1)+R.line(Cx-i*u,Cy-3*u,Cx-i*u,Cy,.1);
   let gb="";for(let i=1;i<4;i++)gb+=R.line(Cx+i*u,Cy,Cx+i*u,Cy+4*u,.1)+R.line(Cx,Cy+i*u,Cx+4*u,Cy+i*u,.1);
   let gh="";for(let i=1;i<5;i++){const t=i/5;gh+=R.line(Ap[0]+v[0]*t,Ap[1]+v[1]*t,Ap[0]+v[0]*t+N[0],Ap[1]+v[1]*t+N[1],.1)+R.line(Ap[0]+N[0]*t,Ap[1]+N[1]*t,Bp[0]+N[0]*t,Bp[1]+N[1]*t,.1)}
   return[A.hatch(`M${Cx-3*u},${Cy-3*u}h${3*u}v${3*u}h${-3*u}Z`,"b"),A.p(R.rect(Cx-3*u,Cy-3*u,3*u,3*u,.2),"b",3.5),A.p(gl,"b",1.5),
    A.hatch(`M${Cx},${Cy}h${4*u}v${4*u}h${-4*u}Z`,"o"),A.p(R.rect(Cx,Cy,4*u,4*u,.2),"o",3.5),A.p(gb,"o",1.5),
    A.hatch(P2(Q)+"Z","g"),A.p(plines(Q),"g",3.5),A.p(gh,"g",1.5),A.p(plines([P,Bp,Ap]),"k",5),ra(Cx,Cy,1,-1,14),
    A.tx("9",Cx-1.5*u,Cy-1.5*u+18,54,"b"),A.tx("16",Cx+2*u,Cy+2*u+18,54,"o"),A.tx("25",(Q[0][0]+Q[2][0])/2,(Q[0][1]+Q[2][1])/2+18,54,"g"),
    A.tx("9 + 16 = 25",670,330,42),A.hl(560,370,230,62),A.tx("3² + 4² = 5²",675,414,40,"g")]}}]});
Object.assign(HINTSX,{pythapp9:[
 {say:t3("Diagonalen är hypotenusan. Använd c² = a² + b². Snett över: jämför diagonalen med de två kanterna tillsammans.","The diagonal is the hypotenuse. Use c² = a² + b². Across: compare the diagonal with the two edges together.",`القطر هو الوتر. استخدم ${LRI("c² = a² + b²")}. عبر الملعب: قارن القطر بالحافتين معًا.`),cut:g=>g.sol.slice(0,2)},
 {say:t3("Stegen är hypotenusan. Ta stegens längd i kvadrat minus avståndet i kvadrat.","The ladder is the hypotenuse. Take the ladder's length squared minus the distance squared.","السلّم هو الوتر. اطرح مربع المسافة من مربع طول السلّم."),cut:g=>g.sol.slice(0,1)},
 {say:t3("Rita en rätvinklig triangel mellan punkterna. Räkna stegen i x-led och i y-led. Är hörnet rätt? Jämför a² + b² med c².","Draw a right-angled triangle between the points. Count the steps along x and along y. Is the corner right? Compare a² + b² with c².","ارسم مثلثًا قائم الزاوية بين النقطتين، ثم عُدّ الخطوات أفقيًا وعموديًا. هل الزاوية قائمة؟ قارن a² + b² مع c²."),cut:g=>g.sol.slice(0,2)}]});
}
