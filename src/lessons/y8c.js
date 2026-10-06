/* ===== y8c.js ===== */
/* =====================================================================
   YEAR 8 (y8c): Pythagoras' theorem, volume of prisms and cylinders,
   similarity and scale factor, angle sum of polygons.
   Everything sits in one block so the helper names never clash.
   ===================================================================== */
{
const T=(sv,en,ar)=>L(t3(sv,en,ar));
const rad=a=>a*Math.PI/180;
const fin=a=>Object.assign(a,{fin:true});
const noFin=g=>g.sol.filter(a=>!a.fin);
const fitS=(s,maxw,size)=>Math.min(size,maxw/(String(s).length*.47));
const ftx=(s,x,y,size,c="k",maxw=320)=>A.tx(s,x,y,fitS(s,maxw,size),c);
/* number with as few decimals as needed (max d) */
const nf=(x,d=2)=>{const p=10**d,r=Math.round(x*p)/p;if(Math.abs(r-Math.round(r))<1e-9)return fmt(Math.round(r));let k=1;while(k<d&&Math.abs(Math.round(r*10**k)-r*10**k)>1e-9)k++;return dfmt(r,k)};
const ISO=s=>"⁦"+s+"⁩";                  /* keeps maths left-to-right inside Arabic speech */
const UN={cm:t3("cm","cm","سم"),m:t3("m","m","م"),cm2:t3("cm²","cm²","سم²"),m2:t3("m²","m²","م²"),cm3:t3("cm³","cm³","سم³"),m3:t3("m³","m³","م³")};
const U=k=>L(UN[k]);
const lab=(v,k)=>`${v} ${U(k)}`;                   /* side label: number + unit in the board language */
const eqU=(s,k)=>lang==="ar"?s:`${s} ${U(k)}`;      /* equation line: the unit only where the line stays left-to-right */
const ICO=b=>`<svg viewBox="0 0 320 180"><rect width="320" height="180" fill="#fff"/>${b}</svg>`;
const CV=`font-family="Caveat,cursive" font-weight="700" text-anchor="middle"`;
const GRY="#9aa8c4";
const nrm=(x,y)=>{const l=Math.hypot(x,y)||1;return[x/l,y/l]};
const pth=pts=>"M"+pts.map(p=>f1(p[0])+","+f1(p[1])).join("L")+"Z";
const seg=(p,q,k=.3)=>R.line(p[0],p[1],q[0],q[1],k);
/* label beside segment PQ, on the side away from point O */
const sideLab=(P,Q,O,s,size=30,c="k",off=10)=>{const mx=(P[0]+Q[0])/2,my=(P[1]+Q[1])/2;let [nx,ny]=nrm(-(Q[1]-P[1]),Q[0]-P[0]);
 if(nx*(O[0]-mx)+ny*(O[1]-my)>0){nx=-nx;ny=-ny}const w=String(s).length*size*.23+off,h=size*.42+off,d=Math.abs(nx)*w+Math.abs(ny)*h;
 return A.tx(s,mx+nx*d,my+ny*d+size*.34,size,c)};
/* right-angle mark at C between the directions to P and Q */
const raM=(C,P,Q,c="r",s=20)=>{const u=nrm(P[0]-C[0],P[1]-C[1]),v=nrm(Q[0]-C[0],Q[1]-C[1]);
 return A.p(`M${f1(C[0]+u[0]*s)},${f1(C[1]+u[1]*s)}L${f1(C[0]+(u[0]+v[0])*s)},${f1(C[1]+(u[1]+v[1])*s)}L${f1(C[0]+v[0]*s)},${f1(C[1]+v[1]*s)}`,c,3)};
/* angle arc at V between the directions to P and Q (always the inside, < 180°) */
const angArc=(V,P,Q,r=34)=>{const u=nrm(P[0]-V[0],P[1]-V[1]),v=nrm(Q[0]-V[0],Q[1]-V[1]),cr=u[0]*v[1]-u[1]*v[0];
 return`M${f1(V[0]+u[0]*r)},${f1(V[1]+u[1]*r)}A${r},${r} 0 0 ${cr>0?1:0} ${f1(V[0]+v[0]*r)},${f1(V[1]+v[1]*r)}`};
const angAt=(V,P,Q)=>{const u=nrm(P[0]-V[0],P[1]-V[1]),v=nrm(Q[0]-V[0],Q[1]-V[1]);return Math.acos(Math.max(-1,Math.min(1,u[0]*v[0]+u[1]*v[1])))*180/Math.PI};
const angPos=(V,P,Q,size=30,base=24)=>{const u=nrm(P[0]-V[0],P[1]-V[1]),v=nrm(Q[0]-V[0],Q[1]-V[1]),b=nrm(u[0]+v[0],u[1]+v[1]),a=angAt(V,P,Q),
 d=Math.max(58,Math.min(120,base/Math.sin(rad(a/2))+size*.9));return[V[0]+b[0]*d,V[1]+b[1]*d]};
const angLab=(V,P,Q,s,size=30,c="k",base=24)=>{const [x,y]=angPos(V,P,Q,size,base);return A.tx(s,x,y+size*.34,size,c)};
const ellP=(cx,cy,rx,ry,a0=0,a1=360,n=60)=>{let d="";for(let i=0;i<=n;i++){const t=rad(a0+(a1-a0)*i/n);d+=(i?"L":"M")+f1(cx+rx*Math.cos(t))+","+f1(cy+ry*Math.sin(t))}return d};
const check=(x,y,s=1,c="g")=>A.p(`M${f1(x)},${f1(y)}l${f1(12*s)},${f1(14*s)}l${f1(24*s)},${f1(-32*s)}`,c,6);

/* =====================================================================
   1. pyth8: Pythagoras' theorem
   ===================================================================== */
/* square on side PQ, built outwards (away from O), with an n×n grid */
function sqOn(P,Q,O,n,c){const vx=Q[0]-P[0],vy=Q[1]-P[1],mx=(P[0]+Q[0])/2,my=(P[1]+Q[1])/2;let N=[-vy,vx];if(N[0]*(O[0]-mx)+N[1]*(O[1]-my)>0)N=[vy,-vx];
 const P2=[Q[0]+N[0],Q[1]+N[1]],P3=[P[0]+N[0],P[1]+N[1]];let g="";
 for(let i=1;i<n;i++){const t=i/n;g+=`M${f1(P[0]+vx*t)},${f1(P[1]+vy*t)}L${f1(P3[0]+vx*t)},${f1(P3[1]+vy*t)}M${f1(P[0]+N[0]*t)},${f1(P[1]+N[1]*t)}L${f1(Q[0]+N[0]*t)},${f1(Q[1]+N[1]*t)}`}
 const pts=[P,Q,P2,P3];return{ctr:[(P[0]+P2[0])/2,(P[1]+P2[1])/2],draw:[A.hatch(pth(pts),c),A.p(g,GRY,1.5),A.p(plines(pts),c,4)]}}
const PC=[170,330],PB=[170,234],PA=[298,330];          /* 3-4-5 triangle with u = 32 */
const pSq=()=>[sqOn(PC,PB,PA,3,"b"),sqOn(PC,PA,PB,4,"g"),sqOn(PB,PA,PC,5,"o")];
/* ladder against a wall */
function ladder(F,Tp,c="o"){const [ux,uy]=nrm(Tp[0]-F[0],Tp[1]-F[1]),nx=-uy*9,ny=ux*9,len=Math.hypot(Tp[0]-F[0],Tp[1]-F[1]);let r="";
 for(let t=26;t<len-10;t+=30)r+=seg([F[0]+ux*t+nx,F[1]+uy*t+ny],[F[0]+ux*t-nx,F[1]+uy*t-ny],.1);
 return A.p(seg([F[0]+nx,F[1]+ny],[Tp[0]+nx,Tp[1]+ny])+seg([F[0]-nx,F[1]-ny],[Tp[0]-nx,Tp[1]-ny])+r,c,3.5)}
function wall(x,y1,y2,gx1){let b="";for(let y=y2-28,k=0;y>y1;y-=28,k++)b+=`M${x},${y}h28`+(k%2?`M${x+14},${y}v28`:`M${x+7},${y}v28M${x+21},${y}v28`);
 return[A.p(b,GRY,1.6),A.p(seg([x,y1],[x,y2])+seg([x+28,y1],[x+28,y2])+seg([gx1,y2],[x+60,y2]),"k",4)]}
const PYTH={steps:[
 {say:t3("I en rätvinklig triangel kallas de två sidorna vid den räta vinkeln för kateter. Den längsta sidan, mitt emot den räta vinkeln, kallas hypotenusa.",
   "In a right-angled triangle, the two sides next to the right angle are called the legs. The longest side, opposite the right angle, is called the hypotenuse.",
   "في المثلث القائم الزاوية يُسمّى الضلعان المحيطان بالزاوية القائمة ضلعَي القائمة، ويُسمّى الضلع الأطول المقابل للزاوية القائمة الوتر."),
  draw:()=>{const C=[140,410],B=[140,200],Ah=[420,410];return[A.wipe(),A.tx(T("Rätvinklig triangel","Right-angled triangle","مثلث قائم الزاوية"),400,70,44),
   A.p(seg(C,B)+seg(C,Ah),"b",6),A.p(seg(B,Ah),"r",6),raM(C,B,Ah,"k",26),A.tx("a",106,318,48,"b"),A.tx("b",280,458,48,"b"),A.tx("c",306,288,52,"r"),
   A.tx(T("kateter","legs","ضلعا القائمة"),630,200,46,"b"),A.tx("a, b",630,256,42,"b"),A.tx(T("hypotenusa","hypotenuse","الوتر"),630,350,46,"r"),A.tx("c",630,404,42,"r")]}},
 {say:t3("Rita en kvadrat på varje sida. Kvadraterna på kateterna har 9 och 16 rutor. Tillsammans blir det 25 rutor, precis lika många som i kvadraten på hypotenusan!",
   "Draw a square on each side. The squares on the legs have 9 and 16 small squares. Together that makes 25, exactly as many as in the square on the hypotenuse!",
   "نرسم مربعًا على كل ضلع. في المربعين المرسومين على ضلعي القائمة 9 و16 مربعًا صغيرًا، ومجموعهما 25، أي العدد نفسه الموجود في المربع المرسوم على الوتر!"),
  draw:()=>{const S=pSq();return[A.wipe(),A.p(plines([PC,PB,PA]),"k",5),raM(PC,PB,PA,"r",16),...S.flatMap(s=>s.draw),...S.map((s,i)=>A.tx([9,16,25][i],s.ctr[0],s.ctr[1]+8,44,["b","g","o"][i])),
   A.tx("3² = 9",615,140,42,"b"),A.tx("4² = 16",615,205,42,"g"),A.tx("5² = 25",615,270,42,"o"),A.tx("9 + 16 = 25",615,350,46)]}},
 {say:t3("Så är det i alla rätvinkliga trianglar, och det kallas Pythagoras sats: a² + b² = c². Kateternas kvadrater är tillsammans lika stora som hypotenusans kvadrat.",
   "This is true in every right-angled triangle, and it is called Pythagoras' theorem: a² + b² = c². The squares on the legs together are as big as the square on the hypotenuse.",
   `هذا صحيح في كل مثلث قائم الزاوية، ويُسمّى مبرهنة فيثاغورس: ${ISO("a² + b² = c²")}. مجموع مربعَي ضلعي القائمة يساوي مربع الوتر.`),
  draw:()=>{const S=pSq();return[...S.map((s,i)=>A.tx(["a²","b²","c²"][i],s.ctr[0],s.ctr[1]+40,28,["b","g","o"][i])),A.hl(450,388,330,74),A.tx("a² + b² = c²",615,442,54,"g")]}},
 {say:t3("Du går snett över en gräsplan som är 40 m lång och 30 m bred. Diagonalen är hypotenusan: c² = 40² + 30² = 2 500, så c = √2 500 = 50 m i stället för 70 m runt kanten.",
   "You cut across a field that is 40 m long and 30 m wide. The diagonal is the hypotenuse: c² = 40² + 30² = 2,500, so c = √2,500 = 50 m instead of 70 m around the edge.",
   `تعبر ملعبًا عشبيًا طوله 40 م وعرضه 30 م قطريًا. القطر هو الوتر: ${ISO("c² = 40² + 30² = 2500")}، إذن ${ISO("c = √2500 = 50")} م بدلًا من 70 م حول الحافة.`),
  draw:()=>[A.wipe(),A.hatch("M80,150H400V390H80Z","g"),A.p(R.rect(80,150,320,240,.4),"g",4),A.p(R.dashed(84,398,396,398,12)+R.dashed(408,386,408,154,12),"o",5),
   A.p(seg([80,390],[400,150],.4),"r",6),A.p(dots([[80,390]]),"k",16),A.tx(lab(40,"m"),240,440,34),A.tx(lab(30,"m"),452,280,34),A.tx("c",222,250,46,"r"),
   A.tx(`40 + 30 = ${lab(70,"m")}`,240,486,28,"o"),
   ftx("c² = 40² + 30²",620,140,40),ftx(`c² = ${fmt(1600)} + 900`,620,205,40),ftx(`c² = ${fmt(2500)}`,620,270,40),ftx(`c = √${fmt(2500)}`,620,335,40),A.hl(470,368,300,66),A.tx(eqU("c = 50","m"),620,416,48,"g")]},
 {say:t3("En stege som är 2,5 m står 0,7 m från väggen. Nu söker vi en katet, så vi tar hypotenusans kvadrat minus den andra katetens: h² = 6,25 − 0,49 = 5,76 och h = 2,4 m.",
   "A ladder that is 2.5 m long stands 0.7 m from the wall. Now we want a leg, so we take the square of the hypotenuse minus the square of the other leg: h² = 6.25 − 0.49 = 5.76 and h = 2.4 m.",
   `سلّم طوله 2.5 م يبعد أسفله 0.7 م عن الجدار. نبحث الآن عن ضلع قائمة، فنطرح مربع ضلع القائمة الآخر من مربع الوتر: ${ISO("h² = 6.25 − 0.49 = 5.76")}، إذن ${ISO("h = 2.4")} م.`),
  draw:()=>{const W=330,G=420,F=[W-84,G],Tp=[W,G-288];return[A.wipe(),...wall(W,90,G,60),ladder(F,Tp),raM([W,G],[W,G-50],F,"r",20),
   A.p(R.dashed(W+44,G,W+44,Tp[1],10),"r",3.5),A.tx("h",W+74,(G+Tp[1])/2+12,44,"r"),A.tx(lab(dfmt(2.5),"m"),208,262,34,"o"),A.tx(lab(dfmt(0.7),"m"),W-42,G+44,30),
   ftx(`${dfmt(0.7)}² + h² = ${dfmt(2.5)}²`,620,140,40),ftx(`h² = ${dfmt(2.5)}² − ${dfmt(0.7)}²`,620,205,40),ftx(`h² = ${dfmt(6.25,2)} − ${dfmt(0.49,2)}`,620,270,40),ftx(`h = √${dfmt(5.76,2)}`,620,335,40),
   A.hl(470,368,300,66),A.tx(eqU(`h = ${dfmt(2.4)}`,"m"),620,416,48,"g")]}},
 {say:t3("Satsen fungerar också baklänges. Om 50² + 120² = 130², som här, är hörnet exakt 90°. Så kollar snickare att ett hörn blir rätt.",
   "The theorem also works backwards. If 50² + 120² = 130², as here, the corner is exactly 90°. That is how carpenters check that a corner is square.",
   `تعمل المبرهنة بالعكس أيضًا: إذا كان ${ISO("50² + 120² = 130²")} كما هنا، فالزاوية 90° تمامًا. هكذا يتأكد النجّارون من أن الزاوية قائمة.`),
  draw:()=>{const C=[150,380],P1=[150,250],P2=[462,380];return[A.wipe(),A.hatch("M120,200H150V410H120Z","o"),A.hatch("M150,380H480V410H150Z","o"),A.p(R.rect(120,200,30,210,.3)+R.rect(150,380,330,30,.3),"o",3.5),
   A.p(`M${P1[0]-12},${P1[1]}h24M${P2[0]},${P2[1]-12}v24`,"k",4),A.p(R.dashed(P1[0],P1[1],P2[0],P2[1],10),"r",4),raM(C,P1,P2,"r",22),
   A.tx(lab(50,"cm"),76,326,30),A.tx(lab(120,"cm"),306,450,30),A.tx(lab(130,"cm"),330,290,32,"r"),
   ftx("50² + 120²",640,140,40),ftx(`= ${fmt(2500)} + ${fmt(14400)}`,640,200,38),ftx(`= ${fmt(16900)}`,640,260,38),ftx(`130² = ${fmt(16900)}`,640,330,40,"r"),
   A.hl(500,366,280,66),check(540,404),A.tx("90°",650,416,50,"g")]}}
]};
const TRIP=[[3,4,5],[6,8,10],[5,12,13],[8,15,17],[9,12,15],[12,16,20],[15,20,25],[20,21,29],[10,24,26],[12,9,15],[4,3,5],[8,6,10],[16,12,20]];
/* right triangle in the left half: a = vertical leg, b = horizontal leg */
function rtFit(a,b,mir){const s=Math.min(300/b,240/a),w=b*s,h=a*s,cx=mir?250:268,Cy=285+h/2;
 const C=mir?[cx+w/2,Cy]:[cx-w/2,Cy],B=[C[0],Cy-h],Ah=mir?[cx-w/2,Cy]:[cx+w/2,Cy];return{C,B,A:Ah}}
const rtDraw=(t,la,lb,lc,ca="k",cb="k",cc="k")=>{const z=s=>s.length<2?46:34;return[A.p(plines([t.C,t.B,t.A]),"k",5),raM(t.C,t.B,t.A,"r",20),sideLab(t.C,t.B,t.A,la,z(la),ca),sideLab(t.C,t.A,t.B,lb,z(lb),cb),sideLab(t.B,t.A,t.C,lc,z(lc),cc)]};
const PX=620,PY=[135,197,259,321],ansBox=(s,c="g")=>[fin(A.hl(462,350,316,66)),fin(A.tx(s,PX,398,fitS(s,300,46),c))];
function pyLeg(){/* ladder: find the height on the wall */
 let Lg,f,h;do{Lg=rint(30,60)/10;f=rint(8,18)/10;h=Math.sqrt(Lg*Lg-f*f)}while(Math.abs(h*10%1-.5)<.04);
 const ans=Math.round(h*10)/10,s=Math.min(290/h,220/f),W=360,G=430,Fx=W-f*s,F=[Fx,G],Tp=[W,G-h*s];
 const q=[A.wipe(),A.tx(T("Hur högt når stegen? Svara med en decimal.","How high up the wall does the ladder reach? Give one decimal.","إلى أي ارتفاع يصل السلّم؟ أجب بمنزلة عشرية واحدة."),400,52,32),
  ...wall(W,G-h*s-30,G,Math.max(40,Fx-60)),ladder(F,Tp),raM([W,G],[W,G-40],F,"r",18),A.p(R.dashed(W+44,G,W+44,Tp[1],10),"r",3.5),A.tx("h",W+72,(G+Tp[1])/2+12,42,"r"),
  sideLab(F,Tp,[W,G],lab(dfmt(Lg),"m"),32,"o",14),A.tx(lab(dfmt(f),"m"),(Fx+W)/2,G+40,30)];
 const sol=[ftx(`${dfmt(f)}² + h² = ${dfmt(Lg)}²`,PX,PY[0],38),ftx(`h² = ${nf(Lg*Lg)} − ${nf(f*f)}`,PX,PY[1],38),fin(ftx(`h² = ${nf(Lg*Lg-f*f)}`,PX,PY[2],38)),fin(ftx(`h = √${nf(Lg*Lg-f*f)}`,PX,PY[3],38)),...ansBox(eqU(`h ≈ ${dfmt(ans)}`,"m"))];
 return{kind:"num",dec:true,ans,show:lab(dfmt(ans),"m"),q,sol}}
LESSONS.push({id:"pyth8",subject:"math",grades:"8",kind:"wb",
 title:t3("Pythagoras sats","Pythagoras' theorem","مبرهنة فيثاغورس"),
 icon:ICO(`<rect x="74" y="74" width="36" height="36" fill="#2257c9" fill-opacity=".15" stroke="#2257c9" stroke-width="3"/><rect x="110" y="110" width="48" height="48" fill="#1e9e5a" fill-opacity=".15" stroke="#1e9e5a" stroke-width="3"/><path d="M110 74L158 110L194 62L146 26Z" fill="#e07b00" fill-opacity=".15" stroke="#e07b00" stroke-width="3" stroke-linejoin="round"/><path d="M110 74V110H158Z" fill="none" stroke="#1d2433" stroke-width="4" stroke-linejoin="round"/><text x="250" y="150" ${CV} font-size="30" fill="#1d2433">a²+b²=c²</text>`),
 steps:PYTH.steps,mount:wbMount(PYTH),
 gen(level){
  if(level===0){const [a,b,c]=pick(TRIP),t=rtFit(a,b,Math.random()<.5);
   return{kind:"num",ans:c,show:lab(c,"cm"),q:[A.wipe(),A.tx(T("Hur lång är hypotenusan c?","How long is the hypotenuse c?","ما طول الوتر c؟"),400,58,38),...rtDraw(t,lab(a,"cm"),lab(b,"cm"),"c","k","k","r")],
    sol:[ftx(`${a}² + ${b}² = c²`,PX,PY[0],40),ftx(`${fmt(a*a)} + ${fmt(b*b)} = c²`,PX,PY[1],40),fin(ftx(`c² = ${fmt(c*c)}`,PX,PY[2],40)),fin(ftx(`c = √${fmt(c*c)}`,PX,PY[3],40)),...ansBox(eqU(`c = ${c}`,"cm"))]}}
  if(level===1){const [a,b,c]=pick(TRIP),t=rtFit(a,b,Math.random()<.5),vert=Math.random()<.5,k=vert?b:a,x=vert?a:b;
   return{kind:"num",ans:x,show:lab(x,"cm"),q:[A.wipe(),A.tx(T("Hur lång är kateten x?","How long is the leg x?","ما طول ضلع القائمة x؟"),400,58,38),...rtDraw(t,vert?"x":lab(a,"cm"),vert?lab(b,"cm"):"x",lab(c,"cm"),vert?"r":"k",vert?"k":"r","k")],
    sol:[ftx(`x² + ${k}² = ${c}²`,PX,PY[0],40),ftx(`x² = ${fmt(c*c)} − ${fmt(k*k)}`,PX,PY[1],40),fin(ftx(`x² = ${fmt(x*x)}`,PX,PY[2],40)),fin(ftx(`x = √${fmt(x*x)}`,PX,PY[3],40)),...ansBox(eqU(`x = ${x}`,"cm"))]}}
  const kind=rint(0,2);
  if(kind===2)return pyLeg();
  let a,b,c;do{if(kind===0){b=rint(40,90);a=rint(Math.round(b*.45),Math.round(b*.7))}else{b=rint(15,40)/10;a=rint(4,14)/10}c=Math.sqrt(a*a+b*b)}while(Math.abs(c*10%1-.5)<.04||Math.abs(c*10%1)<.02||Math.abs(c*10%1)>.98);
  const ans=Math.round(c*10)/10,u=kind?"m":"cm",q=[A.wipe()],F=v=>kind?dfmt(v):String(v);
  if(kind===0){const s=Math.min(300/b,220/a),w=b*s,h=a*s,x0=265-w/2,y0=250-h/2;
   q.push(A.tx(T("Hur lång är skärmens diagonal? Svara med en decimal.","How long is the screen's diagonal? Give one decimal.","ما طول قطر الشاشة؟ أجب بمنزلة عشرية واحدة."),400,52,32),
    A.p(R.rect(x0-10,y0-10,w+20,h+20,.3),"k",5),A.p(`M${f1(265-16)},${f1(y0+h+10)}l-8,40M${f1(265+16)},${f1(y0+h+10)}l8,40M${f1(265-60)},${f1(y0+h+50)}h120`,"k",4),
    A.p(seg([x0,y0+h],[x0+w,y0]),"r",4.5),sideLab([x0-10,y0-10],[x0+w+10,y0-10],[265,250],lab(b,"cm"),32),sideLab([x0-10,y0-10],[x0-10,y0+h+10],[265,250],lab(a,"cm"),32),
    sideLab([x0,y0+h],[x0+w,y0],[x0+w,y0+h],"?",42,"r",4))}
  else{const s=Math.min(330/b,230/a),w=b*s,h=a*s,x0=250-w/2,yb=300+h/2;
   q.push(A.tx(T("Hur lång är rampens lutande yta? Svara med en decimal.","How long is the ramp's sloping surface? Give one decimal.","ما طول السطح المائل للمنحدر؟ أجب بمنزلة عشرية واحدة."),400,52,32),
    A.hatch(pth([[x0,yb],[x0+w,yb],[x0+w,yb-h]]),"o"),A.p(plines([[x0,yb],[x0+w,yb],[x0+w,yb-h]]),"k",4.5),raM([x0+w,yb],[x0,yb],[x0+w,yb-h],"r",18),
    sideLab([x0,yb],[x0+w,yb],[x0+w,yb-h],lab(dfmt(b),"m"),32),sideLab([x0+w,yb],[x0+w,yb-h],[x0,yb],lab(dfmt(a),"m"),32),sideLab([x0,yb],[x0+w,yb-h],[x0+w,yb],"?",44,"r",6))}
  const sum=a*a+b*b;
  return{kind:"num",dec:true,ans,show:lab(dfmt(ans),u),q,sol:[ftx(`c² = ${F(b)}² + ${F(a)}²`,PX,PY[0],38),ftx(`c² = ${nf(b*b)} + ${nf(a*a)}`,PX,PY[1],38),fin(ftx(`c² = ${nf(sum)}`,PX,PY[2],38)),fin(ftx(`c = √${nf(sum)}`,PX,PY[3],38)),...ansBox(eqU(`c ≈ ${dfmt(ans)}`,u))]}}
});
Object.assign(HELPX,{pyth8:[
 {say:t3("Tänk dig en genväg över en gräsmatta. Runt hörnet går du 3 + 4 = 7 steg, men rakt snett över behöver du bara 5 steg.",
   "Imagine a shortcut across a lawn. Around the corner you walk 3 + 4 = 7 steps, but straight across you only need 5 steps.",
   "تخيّل طريقًا مختصرًا عبر مرجة عشب. حول الزاوية تمشي 3 + 4 = 7 خطوات، أما قطريًا فتحتاج إلى 5 خطوات فقط."),
  draw:()=>{const x0=90,y0=380,u=70,steps=[];for(let i=0;i<4;i++)steps.push([x0+u*(i+.5),y0+22]);for(let j=0;j<3;j++)steps.push([x0+4*u+22,y0-u*(j+.5)]);
   const dg=[];for(let i=0;i<5;i++){const t=(i+.5)/5;dg.push([x0+4*u*t-10,y0-3*u*t-10])}
   return[A.hatch(`M${x0},${y0}H${x0+4*u}V${y0-3*u}H${x0}Z`,"g"),A.p(R.rect(x0,y0-3*u,4*u,3*u,.3),"g",3),A.p(dots(steps),"o",18),A.p(dots(dg),"b",18),A.p(seg([x0,y0],[x0+4*u,y0-3*u]),"b",3),
    A.tx(T("4 steg","4 steps","4 خطوات"),x0+2*u,y0+70,32,"o"),A.tx(T("3 steg","3 steps","3 خطوات"),x0+4*u+82,y0-1.5*u+10,32,"o"),A.tx(T("5 steg","5 steps","5 خطوات"),x0+1.4*u,y0-2.2*u,34,"b"),
    A.tx("3 + 4 = 7",620,200,46,"o"),A.tx(T("runt hörnet","around the corner","حول الزاوية"),620,250,30,"o"),A.hl(490,300,260,64),A.tx(T("snett: 5","across: 5","قطريًا: 5"),620,346,46,"b")]}},
 {say:t3("Varför blir det just 5? Jo, 3 · 3 + 4 · 4 = 9 + 16 = 25, och 5 · 5 = 25. Det tal som gånger sig självt blir 25 är 5.",
   "Why exactly 5? Because 3 × 3 + 4 × 4 = 9 + 16 = 25, and 5 × 5 = 25. The number that times itself makes 25 is 5.",
   "لماذا 5 بالضبط؟ لأن 3 × 3 + 4 × 4 = 9 + 16 = 25، و5 × 5 = 25. العدد الذي إذا ضُرب في نفسه أعطى 25 هو 5."),
  draw:()=>{const M=MUL();return[A.tx(`3 ${M} 3 + 4 ${M} 4`,400,120,52),A.tx("= 9 + 16 = 25",400,200,52),A.tx(`5 ${M} 5 = 25`,400,300,52,"b"),A.hl(260,340,280,74),A.tx("√25 = 5",400,396,56,"g")]}}]});
Object.assign(HINTSX,{pyth8:[
 {say:t3("Använd a² + b² = c². Kvadrera kateterna, lägg ihop och dra roten ur.","Use a² + b² = c². Square the legs, add them and take the square root.","استخدم a² + b² = c²: ربّع ضلعي القائمة، واجمع، ثم خذ الجذر التربيعي."),cut:noFin},
 {say:t3("Du söker en katet. Ta hypotenusan i kvadrat minus den andra kateten i kvadrat, och dra roten ur.","You want a leg. Take the hypotenuse squared minus the other leg squared, then take the square root.","تبحث عن ضلع قائمة: اطرح مربع ضلع القائمة الآخر من مربع الوتر، ثم خذ الجذر التربيعي."),cut:noFin},
 {say:t3("Hitta den räta vinkeln. Är det hypotenusan eller en katet du söker? Avrunda först på slutet.","Find the right angle. Are you looking for the hypotenuse or a leg? Round only at the very end.","حدّد الزاوية القائمة: هل تبحث عن الوتر أم عن ضلع قائمة؟ لا تقرّب إلا في النهاية."),cut:noFin}]});

/* =====================================================================
   2. vol8: volume of prisms and cylinders
   ===================================================================== */
/* oblique projection: x to the right, y backwards, z up */
const OB=(ox,oy,s,dk=.5,an=35)=>(x,y,z)=>[ox+x*s+y*s*dk*Math.cos(rad(an)),oy-z*s-y*s*dk*Math.sin(rad(an))];
function boxD(V,w,d,h,c="k",grid=false){
 const vis=[[[0,0,0],[w,0,0]],[[w,0,0],[w,0,h]],[[w,0,h],[0,0,h]],[[0,0,h],[0,0,0]],[[0,0,h],[0,d,h]],[[w,0,h],[w,d,h]],[[0,d,h],[w,d,h]],[[w,0,0],[w,d,0]],[[w,d,0],[w,d,h]]];
 const hid=[[[0,d,0],[w,d,0]],[[0,d,0],[0,0,0]],[[0,d,0],[0,d,h]]];let g="";
 if(grid){for(let i=1;i<w;i++)g+=seg(V(i,0,0),V(i,0,h),.1)+seg(V(i,0,h),V(i,d,h),.1);for(let k=1;k<h;k++)g+=seg(V(0,0,k),V(w,0,k),.1)+seg(V(w,0,k),V(w,d,k),.1);for(let j=1;j<d;j++)g+=seg(V(0,j,h),V(w,j,h),.1)+seg(V(w,j,0),V(w,j,h),.1)}
 return[...(g?[A.p(g,GRY,1.6)]:[]),A.p(hid.map(([p,q])=>R.dashed(...V(...p),...V(...q),9)).join(""),GRY,2.5),A.p(vis.map(([p,q])=>seg(V(...p),V(...q))).join(""),c,4)]}
/* triangular prism lying down: front triangle (0,0,0) (b,0,0) (ax,0,ht), length Lg backwards */
function triPrism(V,b,ht,ax,Lg,c="k"){const P=[[0,0,0],[b,0,0],[ax,0,ht]],Q=P.map(([x,,z])=>[x,Lg,z]),leftVis=ht*Math.cos(rad(35))<ax*Math.sin(rad(35));
 const vis=[[P[0],P[1]],[P[1],P[2]],[P[2],P[0]],[P[1],Q[1]],[P[2],Q[2]],[Q[1],Q[2]]],hid=[[Q[0],Q[1]]];
 (leftVis?vis:hid).push([P[0],Q[0]],[Q[0],Q[2]]);
 return{front:P.map(p=>V(...p)),draw:[A.p(hid.map(([p,q])=>R.dashed(...V(...p),...V(...q),9)).join(""),GRY,2.5),A.p(vis.map(([p,q])=>seg(V(...p),V(...q))).join(""),c,4)]}}
/* standing cylinder */
function cylD(cx,yt,rx,ry,H,c="k"){return[A.p(ellP(cx,yt+H,rx,ry,180,360,30).replace(/L/g," L"),GRY,2.5),A.p(ellP(cx,yt,rx,ry)+`M${cx-rx},${yt}V${yt+H}M${cx+rx},${yt}V${yt+H}`+ellP(cx,yt+H,rx,ry,0,180,40),c,4)]}
/* upright prism with a regular n-gon as base */
function uprPrism(cx,yb,rx,ry,H,n,rot){const base=[...Array(n)].map((_,i)=>{const a=rad(rot+360*i/n);return[cx+rx*Math.cos(a),yb+ry*Math.sin(a)]}),top=base.map(([x,y])=>[x,y-H]);
 let vis="",hid="";const fv=base.map(()=>false);
 base.forEach((p,i)=>{const q=base[(i+1)%n];if(q[0]<p[0]-.5){vis+=seg(p,q);fv[i]=fv[(i+1)%n]=true}else hid+=R.dashed(p[0],p[1],q[0],q[1],9)});
 base.forEach((p,i)=>{if(fv[i])vis+=seg(p,top[i]);else hid+=R.dashed(p[0],p[1],top[i][0],top[i][1],9)});
 return{top,draw:[A.hatch(pth(top),"b"),A.p(hid,GRY,2.5),A.p(vis+plines(top),"k",4)]}}
const VB0=OB(100,340,64),VB=OB(110,440,56);
const boxLabs=(V,w,d,h,lw,ld,lh,sz=30)=>{const b=V(w/2,0,0),l=V(0,0,h/2);return[A.tx(lw,b[0],b[1]+40,sz),sideLab(V(w,0,0),V(w,d,0),V(w/2,d/2,h),ld,sz,"k",6),A.tx(lh,l[0]-48,l[1]+10,sz)]};
const VOL={steps:[
 {say:t3("Ett prisma har två likadana basytor och raka sidor mellan dem. Lådans basyta är 4 · 3 = 12 cm², så ett lager rymmer 12 kuber på 1 cm³.",
   "A prism has two identical bases with straight sides between them. The box's base is 4 × 3 = 12 cm², so one layer holds 12 cubes of 1 cm³.",
   "للمنشور قاعدتان متطابقتان وأوجه جانبية مستقيمة بينهما. مساحة قاعدة الصندوق 4 × 3 = 12 سم²، فتتّسع الطبقة الواحدة لـ 12 مكعبًا حجم كل منها 1 سم³."),
  draw:()=>{const M=MUL();return[A.wipe(),A.hatch(pth([VB0(0,0,1),VB0(4,0,1),VB0(4,3,1),VB0(0,3,1)]),"b"),...boxD(VB0,4,3,1,"b",true),...boxLabs(VB0,4,3,1,lab(4,"cm"),lab(3,"cm"),lab(1,"cm")),
   A.tx(T("basyta","base","القاعدة"),620,150,40,"b"),A.tx(eqU(`B = 4 ${M} 3 = 12`,"cm2"),620,215,42,"b"),A.tx(T("1 lager = 12 kuber","1 layer = 12 cubes","طبقة واحدة = 12 مكعبًا"),620,310,36),A.tx(lab(12,"cm3"),620,365,40)]}},
 {say:t3("Lådan är 5 cm hög, alltså 5 lager: 12 · 5 = 60 cm³. Så räknar vi volymen av alla prismor: V = B · h, basytans area gånger höjden.",
   "The box is 5 cm high, so 5 layers: 12 × 5 = 60 cm³. This is how we find the volume of every prism: V = B × h, the area of the base times the height.",
   "ارتفاع الصندوق 5 سم، أي 5 طبقات: 12 × 5 = 60 سم³. هكذا نحسب حجم كل منشور: V = B × h، أي مساحة القاعدة ضرب الارتفاع."),
  draw:()=>{const M=MUL();return[A.wipe(),A.hatch(pth([VB(0,0,0),VB(4,0,0),VB(4,3,0),VB(4,3,1),VB(4,0,1),VB(0,0,1)]),"b"),...boxD(VB,4,3,5,"k",true),...boxLabs(VB,4,3,5,lab(4,"cm"),lab(3,"cm"),lab(5,"cm")),
   A.tx(T("5 lager","5 layers","5 طبقات"),620,150,40),A.tx(eqU(`V = 12 ${M} 5 = 60`,"cm3"),620,215,42),A.hl(480,262,280,74),A.tx(`V = B ${M} h`,620,316,56,"g"),
   A.tx(T("basarea · höjd","base area × height","مساحة القاعدة × الارتفاع"),620,380,32,"g")]}},
 {say:t3("Chokladkakan är ett prisma med en triangel som basyta: B = 4 · 3 / 2 = 6 cm². Kakan är 20 cm lång, så V = 6 · 20 = 120 cm³.",
   "The chocolate bar is a prism with a triangle as its base: B = 4 × 3 ÷ 2 = 6 cm². The bar is 20 cm long, so V = 6 × 20 = 120 cm³.",
   `لوح الشوكولاتة منشور قاعدته مثلث: ${ISO("B = 4 × 3 ÷ 2 = 6")} سم². طول اللوح 20 سم، إذن ${ISO("V = 6 × 20 = 120")} سم³.`),
  draw:()=>{const M=MUL(),D=DIVS(),V=OB(100,400,30),p=triPrism(V,4,3,2,20),[f0,f1_,f2]=p.front;return[A.wipe(),A.hatch(pth(p.front),"o"),...p.draw,A.p(R.dashed(f2[0],f2[1],f2[0],f0[1],8),"r",3),
   A.tx(lab(4,"cm"),(f0[0]+f1_[0])/2,f0[1]+40,30),A.p(seg([f0[0]-26,f2[1]],[f0[0]-26,f0[1]],.1)+`M${f0[0]-34},${f2[1]}h16M${f0[0]-34},${f0[1]}h16`,"r",2.5),A.tx(lab(3,"cm"),f0[0]-60,(f0[1]+f2[1])/2+10,28,"r"),
   sideLab(V(4,0,0),V(4,20,0),V(2,10,3),lab(20,"cm"),30),
   A.tx(`B = 4 ${M} 3 ${D} 2`,640,120,40,"o"),A.tx(eqU("B = 6","cm2"),640,180,40,"o"),A.tx(`V = B ${M} h`,640,255,40),A.tx(`V = 6 ${M} 20`,640,315,40),A.hl(500,345,280,66),A.tx(eqU("V = 120","cm3"),640,393,46,"g")]}},
 {say:t3("En burk är en cylinder. Basytan är en cirkel med arean π · r². Med r = 3 cm och h = 12 cm blir V = π · 3² · 12 ≈ 339 cm³.",
   "A can is a cylinder. Its base is a circle with area π × r². With r = 3 cm and h = 12 cm, V = π × 3² × 12 ≈ 339 cm³.",
   `العلبة أسطوانة، وقاعدتها دائرة مساحتها ${ISO("π × r²")}. إذا كان ${ISO("r = 3")} سم و${ISO("h = 12")} سم فإن ${ISO("V = π × 3² × 12 ≈ 339")} سم³.`),
  draw:()=>{const M=MUL(),cx=210,yt=110,rx=72,ry=22,H=288;return[A.wipe(),A.hatch(ellP(cx,yt,rx,ry)+"Z","b"),...cylD(cx,yt,rx,ry,H),A.p(`M${cx-rx},${yt+70}Q${cx},${yt+70+ry*2} ${cx+rx},${yt+70}M${cx-rx},${yt+200}Q${cx},${yt+200+ry*2} ${cx+rx},${yt+200}`,GRY,2.5),
   A.p(seg([cx,yt],[cx+rx,yt],.1),"r",3.5),A.p(dots([[cx,yt]]),"r",10),A.tx(`r = ${lab(3,"cm")}`,cx,yt-ry-16,32,"r"),
   A.p(seg([cx+rx+30,yt],[cx+rx+30,yt+H],.1)+`M${cx+rx+22},${yt}h16M${cx+rx+22},${yt+H}h16`,"k",2.5),A.tx(lab(12,"cm"),cx+rx+76,yt+H/2+10,30),
   A.tx(`B = π ${M} r²`,620,140,42,"b"),A.tx(`V = B ${M} h`,620,215,42),ftx(`V = π ${M} 3² ${M} 12`,620,290,42,"k",300),A.hl(480,328,280,66),A.tx(eqU("V ≈ 339","cm3"),620,376,46,"g")]}},
 {say:t3("En kub med sidan 10 cm är 1 dm³ och rymmer exakt 1 liter. Alltså är 1 cm³ = 1 ml, och burken rymmer 339 ml, ungefär 3,4 dl.",
   "A cube with sides of 10 cm is 1 dm³ and holds exactly 1 litre. So 1 cm³ = 1 ml, and the can holds 339 ml, about 3.4 dl.",
   "مكعب طول ضلعه 10 سم حجمه 1 دسم³ ويتّسع للتر واحد تمامًا. إذن 1 سم³ = 1 مل، والعلبة تتّسع لـ 339 مل، أي نحو 3.4 دل."),
  draw:()=>{const V=OB(90,400,24);return[A.wipe(),A.hatch(pth([V(0,0,0),V(10,0,0),V(10,0,10),V(0,0,10)]),"b"),...boxD(V,10,10,10,"b"),A.tx(lab(10,"cm"),210,440,30),A.tx(lab(10,"cm"),400,398,28),A.tx(lab(10,"cm"),40,286,28),
   A.tx(T("1 liter","1 litre","1 لتر"),210,290,40,"b"),
   A.tx(T("1 dm³ = 1 liter","1 dm³ = 1 litre","1 دسم³ = 1 لتر"),630,140,40,"b"),A.tx(T("1 cm³ = 1 ml","1 cm³ = 1 ml","1 سم³ = 1 مل"),630,210,40,"b"),
   A.tx(T("339 cm³ = 339 ml","339 cm³ = 339 ml","339 سم³ = 339 مل"),630,300,40),A.hl(500,338,260,66),A.tx(T(`≈ ${dfmt(3.4)} dl`,`≈ ${dfmt(3.4)} dl`,`≈ ${dfmt(3.4)} دل`),630,386,46,"g")]}}
]};
LESSONS.push({id:"vol8",subject:"math",grades:"8",kind:"wb",
 title:t3("Volym av prisma och cylinder","Volume of prisms and cylinders","حجم المنشور والأسطوانة"),
 icon:ICO(`<path d="M40 140L110 140L75 80Z" fill="#e07b00" fill-opacity=".2" stroke="#1d2433" stroke-width="3.5" stroke-linejoin="round"/><path d="M110 140L160 105L125 45L75 80M125 45" fill="none" stroke="#1d2433" stroke-width="3.5" stroke-linejoin="round"/><ellipse cx="235" cy="45" rx="45" ry="14" fill="#2257c9" fill-opacity=".2" stroke="#1d2433" stroke-width="3.5"/><path d="M190 45V140A45 14 0 0 0 280 140V45" fill="none" stroke="#1d2433" stroke-width="3.5"/><text x="160" y="172" ${CV} font-size="26" fill="#1e9e5a">V = B · h</text>`),
 steps:VOL.steps,mount:wbMount(VOL),
 gen(level){const M=MUL(),D=DIVS(),ask=A.tx(T("Vad är volymen?","What is the volume?","ما الحجم؟"),640,70,40);
  if(level===0){const n=pick([3,4,5,6]),B=rint(6,40),h=rint(3,15),H=Math.min(230,80+h*12),yb=400,cx=220,p=uprPrism(cx,yb,130,40,H,n,n===4?30:n===3?90:n===5?90:0),ty=Math.min(...p.top.map(q=>q[1])),bx=cx+165;
   const bl=A.tx(`B = ${lab(B,"cm2")}`,cx,ty-18,34,"b");
   return{kind:"num",ans:B*h,show:lab(B*h,"cm3"),q:[A.wipe(),ask,...p.draw,bl,A.p(seg([bx,yb],[bx,yb-H],.1)+`M${bx-8},${yb}h16M${bx-8},${yb-H}h16`,"k",2.5),A.tx(lab(h,"cm"),bx+44,yb-H/2+10,30)],
    sol:[A.tx(`V = B ${M} h`,645,200,42),A.tx(`V = ${B} ${M} ${h}`,645,270,42),fin(A.hl(520,312,250,66)),fin(ftx(eqU(`V = ${B*h}`,"cm3"),645,360,46,"g",230))]}}
  if(level===1){let b,ht,Lg;do{b=rint(3,8);ht=rint(2,6);Lg=rint(8,25)}while(b*ht%2||b>2.6*ht+2);
   const ax=b/2,s=Math.min(170/b,140/ht,330/(b+Lg*.5*.82),250/(ht+Lg*.5*.57)),V=OB(100,290+(ht+Lg*.5*.57)*s/2,s),p=triPrism(V,b,ht,ax,Lg),[f0,f1_,f2]=p.front,Bv=b*ht/2;
   const q=[A.wipe(),ask,A.hatch(pth(p.front),"o"),...p.draw,A.p(R.dashed(f2[0],f2[1],f2[0],f0[1],8),"r",3),A.tx(lab(b,"cm"),(f0[0]+f1_[0])/2,f0[1]+40,32),
    A.p(seg([f0[0]-22,f2[1]],[f0[0]-22,f0[1]],.1)+`M${f0[0]-30},${f2[1]}h16M${f0[0]-30},${f0[1]}h16`,"r",2.5),A.tx(lab(ht,"cm"),f0[0]-56,(f0[1]+f2[1])/2+10,28,"r"),sideLab(V(b,0,0),V(b,Lg,0),V(ax,Lg/2,ht),lab(Lg,"cm"),30)];
   return{kind:"num",ans:Bv*Lg,show:lab(Bv*Lg,"cm3"),q,sol:[ftx(`B = ${b} ${M} ${ht} ${D} 2`,640,150,40,"o",270),ftx(eqU(`B = ${Bv}`,"cm2"),640,210,40,"o",270),ftx(`V = ${Bv} ${M} ${Lg}`,640,280,40,"k",270),fin(A.hl(500,312,280,66)),fin(ftx(eqU(`V = ${fmt(Bv*Lg)}`,"cm3"),640,360,44,"g",270))]}}
  let r,h,useD,v1,v2;do{r=rint(2,8);h=rint(4,20);useD=Math.random()<.4;v1=Math.round(Math.PI*r*r*h);v2=Math.round(3.14*r*r*h)}while(v1!==v2);
  const s=Math.min(300/(h+2*r*.3),250/(2*r),38),rx=r*s,ry=Math.max(12,rx*.3),H=h*s,cx=230,yt=265-H/2;
  const q=[A.wipe(),A.tx(T("Vad är volymen? Avrunda till hela cm³.","What is the volume? Round to a whole cm³.","ما الحجم؟ قرّب إلى أقرب سم³."),400,52,34),A.hatch(ellP(cx,yt,rx,ry)+"Z","b"),...cylD(cx,yt,rx,ry,H),
   A.p(dots([[cx,yt]]),"r",10),A.p(useD?seg([cx-rx,yt],[cx+rx,yt],.1):seg([cx,yt],[cx+rx,yt],.1),"r",3.5),A.tx(useD?`d = ${lab(2*r,"cm")}`:`r = ${lab(r,"cm")}`,cx,yt-ry-16,32,"r"),
   A.p(seg([cx+rx+28,yt],[cx+rx+28,yt+H],.1)+`M${cx+rx+20},${yt}h16M${cx+rx+20},${yt+H}h16`,"k",2.5),A.tx(lab(h,"cm"),cx+rx+74,yt+H/2+10,30)];
  const sol=[...(useD?[ftx(`r = ${2*r} ${D} 2 = ${r}`,620,140,38,"r",280)]:[]),ftx(`V = π ${M} r² ${M} h`,620,205,40,"k",290),ftx(`V = π ${M} ${r}² ${M} ${h}`,620,270,40,"k",290),fin(A.hl(480,312,280,66)),fin(ftx(eqU(`V ≈ ${fmt(v1)}`,"cm3"),620,360,44,"g",270))];
  return{kind:"num",ans:v1,show:lab(fmt(v1),"cm3"),q,sol}}
});
Object.assign(HELPX,{vol8:[
 {say:t3("Tänk på en trave pannkakor. Alla pannkakor är lika stora, så volymen är en pannkakas yta gånger hur hög traven är.",
   "Think of a stack of pancakes. All the pancakes are the same size, so the volume is the area of one pancake times the height of the stack.",
   "فكّر في كومة من الفطائر. كل الفطائر بالحجم نفسه، لذلك الحجم هو مساحة فطيرة واحدة ضرب ارتفاع الكومة."),
  draw:()=>{const o=[],cx=230;for(let i=0;i<7;i++){const y=380-i*34;o.push(A.p(ellP(cx,y,120,30,0,180,30)+`M${cx-120},${y}v-14M${cx+120},${y}v-14`,"o",4))}
   o.push(A.hatch(ellP(cx,380-6*34-14,120,30)+"Z","o"),A.p(ellP(cx,380-6*34-14,120,30),"o",4),A.p(seg([cx+150,410],[cx+150,380-6*34-14],.1)+`M${cx+142},410h16M${cx+142},${380-6*34-14}h16`,"r",3),
    A.tx(T("höjd","height","الارتفاع"),cx+150,450,30,"r"),A.tx(T("yta","area","المساحة"),cx,112,34,"o"),
    A.tx(T("yta · höjd","area × height","المساحة × الارتفاع"),620,220,40),A.hl(490,262,260,70),A.tx(`V = B ${MUL()} h`,620,312,48,"g"));return o}}]});
Object.assign(HINTSX,{vol8:[
 {say:t3("Volymen är basytans area gånger höjden: V = B · h.","The volume is the area of the base times the height: V = B × h.","الحجم هو مساحة القاعدة ضرب الارتفاع: V = B × h."),cut:noFin},
 {say:t3("Basytan är triangeln: basen · höjden / 2. Multiplicera sedan med prismats längd.","The base is the triangle: base × height ÷ 2. Then multiply by the length of the prism.","القاعدة هي المثلث: القاعدة × الارتفاع ÷ 2، ثم اضرب في طول المنشور."),cut:noFin},
 {say:t3("Basytan är en cirkel med arean π · r². Kom ihåg att radien är halva diametern.","The base is a circle with area π × r². Remember that the radius is half the diameter.","القاعدة دائرة مساحتها π × r². تذكّر أن نصف القطر هو نصف القطر الكامل."),cut:noFin}]});

/* =====================================================================
   3. sim8: similarity and scale factor
   ===================================================================== */
/* triangle with base c, left side b, right side a; returns unit points with y up */
const triU=(c,b,a)=>{const x=(b*b-a*a+c*c)/(2*c);return[[0,0],[c,0],[x,Math.sqrt(Math.max(0,b*b-x*x))]]};
const place=(U3,s,cx,yb)=>{const w=Math.max(...U3.map(p=>p[0]))-Math.min(...U3.map(p=>p[0])),x0=cx-w*s/2-Math.min(...U3.map(p=>p[0]))*s;return U3.map(([x,y])=>[x0+x*s,yb-y*s])};
const ARC3=["b","g","o"];
function simTri(P,labs,cols,arcR){const O=[(P[0][0]+P[1][0]+P[2][0])/3,(P[0][1]+P[1][1]+P[2][1])/3],o=[A.p(plines(P),"k",4.5)];
 P.forEach((v,i)=>o.push(A.p(angArc(v,P[(i+1)%3],P[(i+2)%3],arcR),ARC3[i],3.5)));
 [[0,1],[0,2],[1,2]].forEach(([i,j],k)=>{if(labs[k]!=null)o.push(sideLab(P[i],P[j],O,labs[k],labs[k]==="x"?48:32,cols[k]||"k",8))});return o}
const txE=(s,x,y,size,c="k")=>A.tx(s,x,y,size,c,/[\u0600-\u06FF]/.test(s)?"start":"end");   /* text that ends at x, in either direction */
/* a little photo: frame with mountains and a sun */
function photo(x,y,w,h,c="k"){const m=`M${f1(x)},${f1(y+h*.82)}L${f1(x+w*.32)},${f1(y+h*.42)}L${f1(x+w*.52)},${f1(y+h*.66)}L${f1(x+w*.7)},${f1(y+h*.48)}L${f1(x+w)},${f1(y+h*.84)}`;
 return[A.p(R.rect(x,y,w,h,.3),c,4),A.p(m,"g",3.5),A.p(R.circ(x+w*.76,y+h*.24,Math.min(w,h)*.1),"o",3)]}
function person(x,yb,hgt,c="k"){const hr=hgt*.09,hy=yb-hgt+hr;return A.p(R.circ(x,hy,hr)+seg([x,hy+hr],[x,yb-hgt*.45],.1)+seg([x,yb-hgt*.45],[x-hgt*.12,yb],.1)+seg([x,yb-hgt*.45],[x+hgt*.12,yb],.1)+seg([x-hgt*.17,yb-hgt*.7],[x+hgt*.17,yb-hgt*.7],.1),c,3.5)}
function tree(x,yb,hgt){const r=hgt*.26;return[A.p(`M${f1(x-hgt*.04)},${yb}V${f1(yb-hgt+2*r)}M${f1(x+hgt*.04)},${yb}V${f1(yb-hgt+2*r)}`,"o",4),A.p(R.circ(x,yb-hgt+r,r),"g",4),A.hatch(R.circ(x,yb-hgt+r,r),"g")]}
function pole(x,yb,hgt){return[A.p(seg([x,yb],[x,yb-hgt],.1),"k",4.5),A.p(`M${x},${f1(yb-hgt)}l${f1(hgt*.3)},${f1(hgt*.07)}l${f1(-hgt*.3)},${f1(hgt*.07)}`,"b",3.5),A.hatch(`M${x},${f1(yb-hgt)}l${f1(hgt*.3)},${f1(hgt*.07)}l${f1(-hgt*.3)},${f1(hgt*.07)}Z`,"b")]}
const sun=(x,y)=>A.p(R.circ(x,y,20)+[0,45,90,135,180,225,270,315].map(a=>seg([x+28*Math.cos(rad(a)),y+28*Math.sin(rad(a))],[x+40*Math.cos(rad(a)),y+40*Math.sin(rad(a))],.1)).join(""),"o",3.5);
/* shadow board: person p (m) with shadow s, object H with shadow S; xs = what is unknown */
function shadowBoard(p,s,H,S,labP,labS,labH,labSS,obj){const G=430,sc=Math.min(260/H,500/(s+S)),xP=150,xO=xP+s*sc+100,o=[],hx=xO-(obj?0:H*sc*.26)-22,X=v=>v==="x",cH=X(labH)?"r":"k",cS=X(labSS)?"r":"k";
 o.push(sun(46,66),A.p(seg([40,G],[Math.max(xO+S*sc+40,560),G],.2),"k",4));
 o.push(person(xP,G,p*sc),A.p(seg([xP,G],[xP+s*sc,G],.1),GRY,8),A.p(R.dashed(xP,G-p*sc,xP+s*sc,G,9),"o",3));
 o.push(...(obj?pole(xO,G,H*sc):tree(xO,G,H*sc)),A.p(seg([xO,G],[xO+S*sc,G],.1),X(labSS)?"r":GRY,8),A.p(R.dashed(xO,G-H*sc,xO+S*sc,G,10),"o",3));
 o.push(A.p(seg([xP-24,G],[xP-24,G-p*sc],.1)+`M${xP-32},${f1(G-p*sc)}h16`,"k",2.5),txE(labP,xP-34,G-p*sc/2+10,28),A.tx(labS,xP+s*sc/2,G+40,28));
 o.push(A.p(seg([hx,G],[hx,G-H*sc],.1)+`M${f1(hx-8)},${f1(G-H*sc)}h16`,cH,2.5),txE(labH,hx-10,G-H*sc/2+12,X(labH)?48:28,cH),A.tx(labSS,xO+S*sc/2,G+(X(labSS)?46:40),X(labSS)?48:28,cS));
 return o}
const SIM={steps:[
 {say:t3("Två figurer är likformiga om de har samma form men olika storlek. Vinklarna är lika stora, och alla sidor är förstorade lika många gånger.",
   "Two shapes are similar if they have the same shape but different sizes. The angles are equal, and every side is enlarged the same number of times.",
   "يكون الشكلان متشابهين إذا كان لهما الشكل نفسه بحجمين مختلفين: الزوايا متساوية، وكل الأضلاع مكبَّرة بالعدد نفسه من المرات."),
  draw:()=>{const U3=triU(6,4,5),a=place(U3,28,175,320),b=place(U3,56,550,320);return[A.wipe(),A.tx(T("Likformiga trianglar","Similar triangles","مثلثان متشابهان"),400,62,42),
   ...simTri(a,[6,4,5],[],26),...simTri(b,[12,8,10],[],34)]}},
 {say:t3("Dividera sidor som hör ihop: 12 / 6 = 2, 8 / 4 = 2 och 10 / 5 = 2. Kvoten är alltid 2, och den kallas skalfaktor.",
   "Divide sides that match: 12 ÷ 6 = 2, 8 ÷ 4 = 2 and 10 ÷ 5 = 2. The ratio is always 2, and it is called the scale factor.",
   "نقسم الأضلاع المتناظرة: 12 ÷ 6 = 2، و8 ÷ 4 = 2، و10 ÷ 5 = 2. النسبة دائمًا 2، وتُسمّى معامل التشابه."),
  draw:()=>{const D=DIVS();return[A.tx(`12 ${D} 6 = 2`,160,404,38,"b"),A.tx(`8 ${D} 4 = 2`,400,404,38,"g"),A.tx(`10 ${D} 5 = 2`,640,404,38,"o"),A.hl(240,420,320,64),A.tx(T("skalfaktor k = 2","scale factor k = 2","معامل التشابه k = 2"),400,466,fitS(T("skalfaktor k = 2","scale factor k = 2","معامل التشابه k = 2"),300,44),"g")]}},
 {say:t3("Fotot är 10 cm brett och 15 cm högt. Affischen ska vara 30 cm bred, så skalfaktorn är 30 / 10 = 3 och höjden blir 15 · 3 = 45 cm.",
   "The photo is 10 cm wide and 15 cm high. The poster will be 30 cm wide, so the scale factor is 30 ÷ 10 = 3 and the height becomes 15 × 3 = 45 cm.",
   "عرض الصورة 10 سم وارتفاعها 15 سم. سيكون عرض الملصق 30 سم، إذن معامل التشابه 30 ÷ 10 = 3، والارتفاع 15 × 3 = 45 سم."),
  draw:()=>{const M=MUL(),D=DIVS();return[A.wipe(),...photo(70,222,70,105),A.tx(lab(10,"cm"),105,206,28),txE(lab(15,"cm"),60,284,28),...photo(250,100,210,315,"b"),A.tx(lab(30,"cm"),355,86,32,"b"),A.tx("x",494,270,52,"r"),
   A.arrow(152,262,236,262,"k",-14),
   A.tx(`k = 30 ${D} 10 = 3`,660,170,40),A.tx(`x = 15 ${M} 3`,660,250,40),A.hl(530,290,260,66),A.tx(eqU("x = 45","cm"),660,338,46,"g")]}},
 {say:t3("Om vi bara drar ut bredden blir bilden utdragen. Bredden blir 3 gånger större men höjden är densamma, så bilderna är inte likformiga.",
   "If we only stretch the width, the picture gets distorted. The width becomes 3 times bigger but the height stays the same, so the pictures are not similar.",
   "إذا مددنا العرض فقط تتشوّه الصورة: يصبح العرض أكبر 3 مرات ويبقى الارتفاع كما هو، لذلك ليست الصورتان متشابهتين."),
  draw:()=>{const D=DIVS();return[A.wipe(),...photo(70,160,70,105),A.tx(lab(10,"cm"),105,144,28),txE(lab(15,"cm"),60,222,28),...photo(220,160,210,105,"r"),A.tx(lab(30,"cm"),325,144,30,"r"),A.tx(lab(15,"cm"),436,222,28,"r","start"),
   A.p(seg([228,150],[422,275])+seg([422,150],[228,275]),"r",5),
   A.tx(`30 ${D} 10 = 3`,650,170,40),A.tx(`15 ${D} 15 = 1`,650,240,40),A.tx("3 ≠ 1",650,315,46,"r"),
   A.tx(T("inte likformiga","not similar","غير متشابهتين"),400,410,48,"r")]}},
 {say:t3("Solens strålar är parallella, så personen och trädet bildar likformiga trianglar med sina skuggor. Trädets skugga är 12 / 2,4 = 5 gånger längre, så trädet är 1,8 · 5 = 9 m högt.",
   "The sun's rays are parallel, so the person and the tree make similar triangles with their shadows. The tree's shadow is 12 ÷ 2.4 = 5 times longer, so the tree is 1.8 × 5 = 9 m tall.",
   "أشعة الشمس متوازية، لذلك يكوّن الشخص والشجرة مع ظلّيهما مثلثين متشابهين. ظل الشجرة أطول بـ 12 ÷ 2.4 = 5 مرات، إذن ارتفاع الشجرة 1.8 × 5 = 9 م."),
  draw:()=>{const M=MUL(),D=DIVS();return[A.wipe(),...shadowBoard(1.8,2.4,9,12,lab(dfmt(1.8),"m"),lab(dfmt(2.4),"m"),"x",lab(12,"m"),0),
   A.tx(`k = 12 ${D} ${dfmt(2.4)} = 5`,600,90,38),A.tx(eqU(`x = ${dfmt(1.8)} ${M} 5 = 9`,"m"),600,152,40,"g")]}}
]};
const TRS=[[6,4,5],[7,5,6],[8,5,6],[7,4,6],[8,6,7],[6,5,5],[9,6,7],[8,4,7],[10,6,8],[9,5,7]];
function simPair(base,left,right,labS,labB,colS,colB,k){const U3=triU(base,left,right),hU=U3[2][1],s1=Math.min(165/base,130/hU),s2=Math.min(s1*Math.min(k,2.2),350/base,240/hU);
 return[...simTri(place(U3,s1,175,330),labS,colS,26),...simTri(place(U3,s2,555,330),labB,colB,32)]}
LESSONS.push({id:"sim8",subject:"math",grades:"8",kind:"wb",
 title:t3("Likformighet och skalfaktor","Similarity and scale factor","التشابه ومعامل التشابه"),
 icon:ICO(`<path d="M40 140H110L82 98Z" fill="#2257c9" fill-opacity=".12" stroke="#1d2433" stroke-width="3.5" stroke-linejoin="round"/><path d="M140 150H280L224 66Z" fill="#2257c9" fill-opacity=".12" stroke="#1d2433" stroke-width="3.5" stroke-linejoin="round"/><path d="M58 140A18 18 0 0 0 55 130M176 150A36 36 0 0 0 170 130" fill="none" stroke="#e07b00" stroke-width="3"/><text x="160" y="40" ${CV} font-size="30" fill="#1e9e5a">k = 2</text>`),
 steps:SIM.steps,mount:wbMount(SIM),
 gen(level){const M=MUL(),D=DIVS();
  if(level<2&&(level===0||Math.random()<.5)){const t=pick(TRS),k=level===0?pick([2,3,4]):pick([1.5,2.5,3.5]),big=t.map(v=>v*k),j=rint(0,2),i=pick([0,1,2].filter(x=>x!==j)),rev=level===0&&Math.random()<.3;
   const SD=[[0,1],[0,2],[1,2]],/* simTri label order: base, left, right */ idx=[0,1,2];
   const labS=idx.map(m=>rev?(m===j?"x":m===i?nf(t[m]):null):(nf(t[m]))),labB=idx.map(m=>rev?nf(big[m]):(m===j?"x":m===i?nf(big[m]):null));
   const colS=idx.map(m=>m===j&&rev?"r":m===i?"b":"k"),colB=idx.map(m=>m===j&&!rev?"r":m===i?"b":"k");
   const ans=rev?t[j]:big[j],dec=!Number.isInteger(ans);
   const q=[A.wipe(),A.tx(T("Trianglarna är likformiga. Hur lång är x?","The triangles are similar. How long is x?","المثلثان متشابهان. ما طول x؟"),400,56,36),...simPair(t[0],t[1],t[2],labS,labB,colS,colB,k)];
   const sol=[A.tx(`k = ${nf(big[i])} ${D} ${nf(t[i])} = ${nf(k)}`,400,410,38,"b"),fin(A.hl(230,424,340,62)),fin(A.tx(rev?`x = ${nf(big[j])} ${D} ${nf(k)} = ${nf(ans)}`:`x = ${nf(t[j])} ${M} ${nf(k)} = ${nf(ans)}`,400,466,40,"g"))];
   return{kind:"num",dec,ans,show:nf(ans),q,sol}}
  if(level===1){const [w,h]=pick([[10,15],[9,13],[10,12],[13,18],[6,9],[8,12],[12,16],[10,14]]),k=pick([1.5,2.5,3,3.5,4,2.5]),W=w*k,ans=h*k;
   const pw=66,ph=pw*h/w,bw=Math.min(pw*Math.min(k,3.2),310*w/h),bh=bw*h/w;
   const q=[A.wipe(),A.tx(T("Fotot förstoras till en likformig affisch. Hur hög blir den?","The photo is enlarged to a similar poster. How tall will it be?","تُكبَّر الصورة إلى ملصق مشابه لها. ما ارتفاعه؟"),400,56,32),
    ...photo(80,280-ph/2,pw,ph),A.tx(lab(w,"cm"),80+pw/2,280-ph/2-14,28),txE(lab(h,"cm"),70,290,28),A.arrow(160,280,236,280,"k",-14),
    ...photo(255,275-bh/2,bw,bh,"b"),A.tx(lab(nf(W),"cm"),255+bw/2,275-bh/2-14,32,"b"),A.tx("x",255+bw+34,288,52,"r")];
   const sol=[ftx(`k = ${nf(W)} ${D} ${w} = ${nf(k)}`,660,200,38,"b",250),ftx(`x = ${h} ${M} ${nf(k)}`,660,270,40,"k",250),fin(A.hl(535,310,250,66)),fin(ftx(eqU(`x = ${nf(ans)}`,"cm"),660,358,44,"g",240))];
   return{kind:"num",dec:!Number.isInteger(ans),ans,show:lab(nf(ans),"cm"),q,sol}}
  let p,s,k,H,S;do{p=rint(15,19)/10;s=pick([1.2,1.4,1.5,1.6,1.8,2,2.4]);k=pick([2.5,3,4,5]);H=p*k;S=s*k}while(S>12||Math.abs(S*100-Math.round(S*100))>1e-6);
  H=Math.round(H*100)/100;S=Math.round(S*100)/100;const obj=rint(0,1),askShadow=Math.random()<.3,ans=askShadow?S:H;
  const q=[A.wipe(),A.tx(askShadow?T(`Hur lång är ${obj?"flaggstångens":"trädets"} skugga?`,`How long is the ${obj?"flagpole's":"tree's"} shadow?`,`ما طول ظل ${obj?"سارية العلم":"الشجرة"}؟`):T(`Hur hög är ${obj?"flaggstången":"trädet"}?`,`How tall is the ${obj?"flagpole":"tree"}?`,`ما ارتفاع ${obj?"سارية العلم":"الشجرة"}؟`),430,40,34),
   ...shadowBoard(p,s,H,S,lab(nf(p),"m"),lab(nf(s),"m"),askShadow?lab(nf(H),"m"):"x",askShadow?"x":lab(nf(S),"m"),obj)];
  const sol=askShadow?[A.tx(`k = ${nf(H)} ${D} ${nf(p)} = ${nf(k)}`,600,96,34,"b"),fin(A.tx(eqU(`x = ${nf(s)} ${M} ${nf(k)} = ${nf(S)}`,"m"),600,150,36,"g"))]
   :[A.tx(`k = ${nf(S)} ${D} ${nf(s)} = ${nf(k)}`,600,96,34,"b"),fin(A.tx(eqU(`x = ${nf(p)} ${M} ${nf(k)} = ${nf(H)}`,"m"),600,150,36,"g"))];
  return{kind:"num",dec:true,ans,show:lab(nf(ans),"m"),q,sol}}
});
Object.assign(HELPX,{sim8:[
 {say:t3("När du zoomar in en bild på mobilen blir allt lika många gånger större. Bilden ser likadan ut, bara större. Det är likformighet.",
   "When you zoom in on a picture on your phone, everything gets bigger by the same number of times. The picture looks the same, just bigger. That is similarity.",
   "عندما تكبّر صورة على هاتفك يكبر كل شيء بالعدد نفسه من المرات، فتبدو الصورة كما هي لكنها أكبر. هذا هو التشابه."),
  draw:()=>{const house=(x,y,s,c)=>[A.p(plines([[x,y],[x+60*s,y],[x+60*s,y-40*s],[x+30*s,y-64*s],[x,y-40*s]])+R.rect(x+24*s,y-24*s,12*s,24*s,.1),c,3.5)];
   return[A.p(R.rect(70,130,150,270,.3)+R.rect(84,160,122,200,.2),"k",4),A.p(R.circ(145,380,9),"k",3),...house(115,290,1,"b"),A.tx(T("zooma in","zoom in","تكبير"),145,445,30),
    A.arrow(240,270,340,270,"g",-14),A.tx(`${MUL()} 4`,290,240,46,"g"),...house(380,370,4,"b"),A.tx(T("allt lika mycket större","everything equally bigger","كل شيء أكبر بالقدر نفسه"),520,440,32,"g")]}}]});
Object.assign(HINTSX,{sim8:[
 {say:t3("Ta två sidor som hör ihop och dividera. Det ger skalfaktorn.","Take two sides that match and divide. That gives the scale factor.","خذ ضلعين متناظرين واقسم أحدهما على الآخر، فتحصل على معامل التشابه."),cut:noFin},
 {say:t3("Räkna ut skalfaktorn med de sidor du känner till. Multiplicera sedan.","Work out the scale factor from the sides you know. Then multiply.","احسب معامل التشابه من الأضلاع المعلومة، ثم اضرب."),cut:noFin},
 {say:t3("Personen och föremålet bildar likformiga trianglar med sina skuggor. Hur många gånger större är den stora triangeln?","The person and the object make similar triangles with their shadows. How many times bigger is the big triangle?","يكوّن الشخص والجسم مع ظلّيهما مثلثين متشابهين. كم مرة يكبر المثلث الكبير؟"),cut:noFin}]});

/* =====================================================================
   4. poly8: angle sum of polygons
   ===================================================================== */
const polyAngs=P=>P.map((v,i)=>angAt(v,P[(i+P.length-1)%P.length],P[(i+1)%P.length]));
/* fan of triangles from corner 0 */
function fan(P,cols=["b","g","o","r"]){const o=[];for(let i=1;i<P.length-1;i++)o.push(A.hatch(pth([P[0],P[i],P[i+1]]),cols[(i-1)%cols.length]));
 for(let i=2;i<P.length-1;i++)o.push(A.p(R.dashed(P[0][0],P[0][1],P[i][0],P[i][1],10),"k",3));return o}
const arcs=(P,c="r",r=26)=>A.p(P.map((v,i)=>angArc(v,P[(i+P.length-1)%P.length],P[(i+1)%P.length],r)).join(""),c,3);
const regPts=(cx,cy,r,n,rot)=>polyPts(cx,cy,r,n,rot??(-90+(n%2?0:180/n)));
const nGon=n=>T(`${n}-hörning`,`${n}-sided polygon`,n<=10?`مضلع له ${n} رؤوس`:`مضلع له ${n} رأسًا`);
const POLY={steps:[
 {say:t3("Vinklarna i en triangel är alltid 180° tillsammans. Men hur stor är vinkelsumman i en fyrhörning eller en femhörning?",
   "The angles of a triangle always add up to 180°. But what is the angle sum of a quadrilateral or a pentagon?",
   "مجموع زوايا المثلث دائمًا 180°. ولكن كم مجموع زوايا الشكل الرباعي أو الخماسي؟"),
  draw:()=>{const P=[[90,400],[430,400],[291,160]];return[A.wipe(),A.hatch(pth(P),"b"),A.p(plines(P),"k",4.5),A.p(angArc(P[0],P[2],P[1],40),"o",4),A.p(angArc(P[1],P[0],P[2],40),"g",4),A.p(angArc(P[2],P[1],P[0],40),"r",4),
   angLab(P[0],P[2],P[1],"50°",32,"o",30),angLab(P[1],P[0],P[2],"60°",32,"g",30),angLab(P[2],P[1],P[0],"70°",32,"r",30),A.tx("50° + 60° + 70°",630,190,40),A.hl(510,230,240,66),A.tx("= 180°",630,278,46,"g"),A.tx("?",630,400,70,"r")]}},
 {say:t3("En diagonal delar fyrhörningen i två trianglar. Varje triangel har 180°, så vinkelsumman i en fyrhörning är 2 · 180° = 360°.",
   "A diagonal splits the quadrilateral into two triangles. Each triangle has 180°, so the angle sum of a quadrilateral is 2 × 180° = 360°.",
   "يقسم القطر الشكل الرباعي إلى مثلثين، في كل منهما 180°، لذلك مجموع زوايا الشكل الرباعي 2 × 180° = 360°."),
  draw:()=>{const P=[[100,380],[180,140],[410,170],[440,400]];return[A.wipe(),...fan(P),A.p(plines(P),"k",4.5),arcs(P),A.tx("180°",230,242,34,"b"),A.tx("180°",317,330,34,"g"),
   A.tx(T("2 trianglar","2 triangles","مثلثان"),630,220,40),A.hl(490,266,280,66),A.tx(`2 ${MUL()} 180° = 360°`,630,314,fitS(`2 · 180° = 360°`,260,44),"g")]}},
 {say:t3("Dra diagonaler från ett hörn. En femhörning delas i 3 trianglar, alltså 540°. En sexhörning delas i 4 trianglar, alltså 720°.",
   "Draw diagonals from one corner. A pentagon splits into 3 triangles, so 540°. A hexagon splits into 4 triangles, so 720°.",
   "نرسم الأقطار من رأس واحد: ينقسم الخماسي إلى 3 مثلثات، أي 540°، وينقسم السداسي إلى 4 مثلثات، أي 720°."),
  draw:()=>{const M=MUL(),P5=polyPts(200,250,140,5),P6=polyPts(590,250,140,6,-90);return[A.wipe(),...fan(P5),A.p(plines(P5),"k",4.5),...fan(P6),A.p(plines(P6),"k",4.5),
   A.tx(`3 ${M} 180° = 540°`,200,450,38,"g"),A.tx(`4 ${M} 180° = 720°`,590,450,38,"g")]}},
 {say:t3("Antalet trianglar är alltid två färre än antalet hörn. En månghörning med n hörn har därför vinkelsumman (n − 2) · 180°.",
   "The number of triangles is always two fewer than the number of corners. So a polygon with n corners has the angle sum (n − 2) × 180°.",
   `عدد المثلثات دائمًا أقل من عدد الرؤوس باثنين، لذلك مجموع زوايا مضلع له n رأسًا هو ${ISO("(n − 2) × 180°")}.`),
  draw:()=>{const M=MUL(),X=[330,425,520,615,710],rows=[T("hörn","corners","الرؤوس"),T("trianglar","triangles","المثلثات"),T("vinkelsumma","angle sum","مجموع الزوايا")],o=[A.wipe()];
   rows.forEach((s,r)=>o.push(A.tx(s,150,110+r*80,fitS(s,220,34),["b","o","g"][r])));
   [3,4,5,6].forEach((n,i)=>o.push(qt(n,X[i],110,34,"b"),qt(n-2,X[i],190,34,"o"),qt(`${(n-2)*180}°`,X[i],270,30,"g")));
   o.push(qt("n",X[4],110,34,"b"),qt("n − 2",X[4],190,32,"o"),qt("?",X[4],270,34,"g"),A.p(seg([60,135],[760,135])+seg([60,215],[760,215])+seg([255,70],[255,295]),GRY,2));
   o.push(A.tx(T("Vinkelsumma","Angle sum","مجموع الزوايا"),400,355,34),A.hl(230,374,340,76),A.tx(`(n − 2) ${M} 180°`,400,432,56,"g"));return o}},
 {say:t3("I en regelbunden månghörning är alla vinklar lika stora. En fotboll har femhörningar med vinklarna 540° / 5 = 108° och sexhörningar med 720° / 6 = 120°.",
   "In a regular polygon all the angles are equal. A football has pentagons with angles of 540° ÷ 5 = 108° and hexagons with 720° ÷ 6 = 120°.",
   "في المضلع المنتظم تكون كل الزوايا متساوية. على كرة القدم خماسيات زاويتها 540° ÷ 5 = 108° وسداسيات زاويتها 720° ÷ 6 = 120°."),
  draw:()=>{const D=DIVS(),P5=polyPts(200,230,130,5),P6=polyPts(590,230,130,6,-90),o=[A.wipe(),A.p(plines(P5),"k",4.5),arcs(P5,"r",24),A.p(plines(P6),"k",4.5),arcs(P6,"r",24)];
   P5.forEach((v,i)=>o.push(angLab(v,P5[(i+4)%5],P5[(i+1)%5],"108°",26,"r",18)));P6.forEach((v,i)=>o.push(angLab(v,P6[(i+5)%6],P6[(i+1)%6],"120°",26,"r",18)));
   o.push(A.tx(`540° ${D} 5 = 108°`,200,430,38,"g"),A.tx(`720° ${D} 6 = 120°`,590,430,38,"g"));return o}},
 {say:t3("En stoppskylt är en regelbunden åttahörning. Vinkelsumman är (8 − 2) · 180° = 1 080°, så varje vinkel är 1 080° / 8 = 135°.",
   "A stop sign is a regular octagon. The angle sum is (8 − 2) × 180° = 1,080°, so each angle is 1,080° ÷ 8 = 135°.",
   `لافتة التوقف مضلع ثماني منتظم. مجموع زواياه ${ISO("(8 − 2) × 180° = 1080°")}، إذن كل زاوية ${ISO("1080° ÷ 8 = 135°")}.`),
  draw:()=>{const M=MUL(),D=DIVS(),P=polyPts(220,260,170,8,-90+22.5);return[A.wipe(),A.hatch(pth(P),"r"),A.p(plines(P),"r",6),A.tx("STOP",220,290,84,"r"),A.p(angArc(P[3],P[2],P[4],30),"k",3.5),angLab(P[3],P[2],P[4],"135°",30,"k",14),
   ftx(`(8 − 2) ${M} 180°`,620,170,42,"k",300),ftx(`= ${fmt(1080)}°`,620,235,42,"k",300),ftx(`${fmt(1080)}° ${D} 8`,620,320,42,"k",300),A.hl(490,360,260,66),A.tx("= 135°",620,408,48,"g")]}}
]};
/* random convex polygon with interior angles kept between lo and hi */
function rndPoly(n,cx,cy,r){for(let t=0;t<400;t++){const st=rint(0,359),P=[...Array(n)].map((_,i)=>{const a=rad(st+360*i/n+(Math.random()-.5)*180/n*.9),rr=r*(.82+Math.random()*.22);return[cx+rr*Math.cos(a),cy+rr*Math.sin(a)*.86]});
 const an=polyAngs(P);let area=0;P.forEach((p,i)=>{const q=P[(i+1)%n];area+=p[0]*q[1]-q[0]*p[1]});
 const minSide=Math.min(...P.map((p,i)=>Math.hypot(P[(i+1)%n][0]-p[0],P[(i+1)%n][1]-p[1])));
 if(Math.abs(an.reduce((s,x)=>s+x,0)-(n-2)*180)<.5&&Math.min(...an)>55&&Math.max(...an)<165&&minSide>r*.55)return area<0?P.slice().reverse():P}
 return regPts(cx,cy,r,n)}
LESSONS.push({id:"poly8",subject:"math",grades:"8",kind:"wb",
 title:t3("Vinkelsumman i en månghörning","Angle sum of polygons","مجموع زوايا المضلع"),
 icon:ICO(`<path d="M160 22L248 86L214 160H106L72 86Z" fill="#2257c9" fill-opacity=".1" stroke="#1d2433" stroke-width="4" stroke-linejoin="round"/><path d="M160 22L214 160M160 22L106 160" stroke="#1d2433" stroke-width="2.5" stroke-dasharray="7 6"/><path d="M106 160L136 86L160 22" fill="#1e9e5a" fill-opacity=".15"/><text x="275" y="150" ${CV} font-size="30" fill="#d63b2f">540°</text>`),
 steps:POLY.steps,mount:wbMount(POLY),
 gen(level){const M=MUL(),D=DIVS();
  if(level===0){const n=rint(5,11),P=rndPoly(n,290,280,165),S=(n-2)*180;
   return{kind:"num",ans:S,show:`${fmt(S)}°`,q:[A.wipe(),A.tx(T("Hur stor är vinkelsumman?","What is the angle sum?","ما مجموع الزوايا؟"),400,52,40),A.p(plines(P),"k",4.5),arcs(P,"r",22)],
    sol:[A.p(dots(P),"b",14),...P.map(([x,y],i)=>qt(i+1,290+(x-290)*1.17,280+(y-280)*1.17+10,30,"b")),A.tx(`n = ${n}`,650,180,44,"b"),ftx(`(${n} − 2) ${M} 180°`,650,250,40,"k",260),fin(A.hl(520,292,260,66)),fin(A.tx(`= ${fmt(S)}°`,650,340,46,"g"))]}}
  if(level===1){const n=rint(4,6);let P,an,kn,x,j;
   for(let t=0;t<3000;t++){P=rndPoly(n,280,275,175);an=polyAngs(P);j=rint(0,n-1);kn=an.map(a=>Math.round(a/5)*5);x=(n-2)*180-kn.reduce((s,v,i)=>i===j?s:s+v,0);
    const lp=P.map((v,i)=>angPos(v,P[(i+n-1)%n],P[(i+1)%n],i===j?48:28,16));if(lp.some((a,i)=>lp.some((b,m)=>m>i&&Math.abs(a[0]-b[0])<70&&Math.abs(a[1]-b[1])<38)))continue;
    if(Math.abs(x-an[j])<7&&x>55&&x<170)break}
   const S=(n-2)*180,known=kn.filter((_,i)=>i!==j),q=[A.wipe(),A.tx(T("Hur stor är vinkeln x?","How big is the angle x?","ما قياس الزاوية x؟"),600,70,34),A.p(plines(P),"k",4.5)];
   P.forEach((v,i)=>{const a=P[(i+n-1)%n],b=P[(i+1)%n];q.push(A.p(angArc(v,a,b,24),i===j?"r":"b",3),angLab(v,a,b,i===j?"x":`${kn[i]}°`,i===j?48:28,i===j?"r":"b",16))});
   const tot=`= ${fmt(known.reduce((s,v)=>s+v,0))}°`,h2=Math.ceil(known.length/2),sumL=known.length>3?[known.slice(0,h2).join(" + "),`+ ${known.slice(h2).join(" + ")} ${tot}`]:[`${known.join(" + ")} ${tot}`];
   const yD=sumL.length>1?304:262;
   return{kind:"num",ans:x,show:`${x}°`,q,sol:[ftx(`(${n} − 2) ${M} 180° = ${fmt(S)}°`,640,150,36,"k",280),...sumL.map((l,i)=>ftx(l,640,204+i*48,34,"b",280)),ftx(`x = ${fmt(S)}° − ${fmt(S-x)}°`,640,yD,38,"k",280),fin(A.hl(510,yD+28,260,66)),fin(A.tx(`x = ${x}°`,640,yD+76,46,"g"))]}}
  if(Math.random()<.5){const n=pick([5,6,8,9,10,12]),P=regPts(250,280,170,n),S=(n-2)*180,x=S/n,ttl=T(`Regelbunden ${n}-hörning`,`Regular ${n}-sided polygon`,n<=10?`مضلع منتظم له ${n} رؤوس`:`مضلع منتظم له ${n} رأسًا`),q=[A.wipe(),A.tx(ttl,610,80,fitS(ttl,330,38),"b"),
    A.tx(T("Hur stor är vinkeln x?","How big is the angle x?","ما قياس الزاوية x؟"),610,136,34),A.p(plines(P),"k",4.5),arcs(P,"b",20)];
   const k=Math.floor(n/2);q.push(A.p(angArc(P[k],P[k-1],P[k+1],20),"r",4),angLab(P[k],P[k-1],P[k+1],"x",48,"r",14));
   return{kind:"num",ans:x,show:`${x}°`,q,sol:[ftx(`(${n} − 2) ${M} 180°`,610,220,40,"k",320),fin(ftx(`= ${fmt(S)}°`,610,276,40,"k",320)),fin(ftx(`x = ${fmt(S)}° ${D} ${n}`,610,340,40,"k",320)),fin(A.hl(490,368,240,66)),fin(A.tx(`x = ${x}°`,610,416,46,"g"))]}}
  const n=rint(7,20),S=(n-2)*180;
  return{kind:"num",ans:n,show:String(n),q:[A.wipe(),A.tx(T(`En månghörning har vinkelsumman ${fmt(S)}°.`,`A polygon has an angle sum of ${fmt(S)}°.`,`مجموع زوايا مضلع ${fmt(S)}°.`),400,70,38),A.tx(T("Hur många hörn har den?","How many corners does it have?","كم رأسًا له؟"),400,124,38),
    A.tx(`(n − 2) ${M} 180° = ${fmt(S)}°`,400,206,48,"b"),A.tx("n = ?",400,262,42,"r")],
   sol:[A.tx(`n − 2 = ${fmt(S)}° ${D} 180°`,400,332,40),fin(A.tx(`n − 2 = ${n-2}`,400,390,40)),fin(A.hl(270,412,260,64)),fin(A.tx(`n = ${n-2} + 2 = ${n}`,400,458,42,"g"))]}}
});
Object.assign(HELPX,{poly8:[
 {say:t3("Husets gavel är en femhörning. Skär från toppen ner till de nedre hörnen, så får du 3 trianglar. Varje triangel har 180°, så det blir 3 · 180° = 540°.",
   "The front of the house is a pentagon. Cut from the top down to the bottom corners and you get 3 triangles. Each triangle has 180°, so that makes 3 × 180° = 540°.",
   "واجهة البيت شكل خماسي. نقطع من القمة إلى الزاويتين السفليتين فنحصل على 3 مثلثات، في كل منها 180°، أي 3 × 180° = 540°."),
  draw:()=>{const P=[[230,90],[380,210],[380,410],[80,410],[80,210]];return[...fan(P,["o","b","g"]),A.p(plines(P),"k",5),A.p(R.rect(205,350,50,60,.2),"k",3),
   A.tx("180°",128,262,32,"g"),A.tx("180°",230,318,32,"b"),A.tx("180°",332,262,32,"o"),A.tx(T("3 trianglar","3 triangles","3 مثلثات"),610,200,40),A.hl(470,246,280,66),A.tx(`3 ${MUL()} 180° = 540°`,610,294,fitS("3 · 180° = 540°",260,42),"g")]}}]});
Object.assign(HINTSX,{poly8:[
 {say:t3("Räkna hörnen. Vinkelsumman är (n − 2) · 180°.","Count the corners. The angle sum is (n − 2) × 180°.","عُدّ الرؤوس. مجموع الزوايا (n − 2) × 180°."),cut:noFin},
 {say:t3("Räkna först ut vinkelsumman. Dra sedan bort vinklarna du vet.","First work out the angle sum. Then subtract the angles you know.","احسب أولًا مجموع الزوايا، ثم اطرح الزوايا المعلومة."),cut:noFin},
 {say:t3("Börja med formeln (n − 2) · 180°.","Start with the formula (n − 2) × 180°.","ابدأ بالقاعدة (n − 2) × 180°."),cut:noFin}]});
}
