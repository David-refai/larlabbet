/* ===== y9b.js ===== */
/* =====================================================================
   YEAR 9 (y9b): the straight line through two points, non-linear functions,
   exponential growth and decay, percent in several steps.
   Everything sits inside one block, so the local helpers never clash.
   ===================================================================== */
{
const LRI=s=>"⁦"+s+"⁩";                       /* keeps formulas left-to-right inside Arabic speech */
const ng=n=>n<0?"−"+(-n):String(n);                      /* real minus sign */
const nf=n=>n<0?"−"+fmt(-n):fmt(n);
const pc=n=>lang==="sv"?`${n} %`:`${n}%`;
const kr=n=>`${fmt(n)} kr`;
const fx=(a,d=2)=>dfmt(a,d);                              /* change factor, e.g. 1,20 */
const tl=(s,x,y,size=26,c="k",anc="middle")=>Object.assign(A.tx(s,x,y,size,c,anc),{dur:170});
const mark=(a,m)=>Object.assign(a,{m});
const CV=`font-family="Caveat,cursive" font-weight="700" text-anchor="middle"`;
const ICO=b=>`<svg viewBox="0 0 320 180"><rect width="320" height="180" fill="#fff"/>${b}</svg>`;
const dot=(x,y,c="r",s=16)=>A.p(dots([[x,y]]),c,s);
const bx=(x,y,w,h,c="k",wd=3.5)=>A.p(R.rect(x,y,w,h,.3),c,wd);

/* ---------- a coordinate plot: o={l,r,t,b,x0,x1,y0,y1,gx,gy,xs,ys,xl,yl,fs} ---------- */
function plot(o){
 const X=x=>o.l+(x-o.x0)/(o.x1-o.x0)*(o.r-o.l),Y=y=>o.b-(y-o.y0)/(o.y1-o.y0)*(o.b-o.t);
 const ax=o.y0<=0&&o.y1>=0?Y(0):o.b,ay=o.x0<=0&&o.x1>=0?X(0):o.l,fs=o.fs||22,eps=1e-9;
 let g="";const gx=o.gx||o.xs,gy=o.gy||o.ys;
 for(let x=Math.ceil(o.x0/gx)*gx;x<=o.x1+eps;x+=gx)g+=`M${f1(X(x))},${o.t}V${o.b}`;
 for(let y=Math.ceil(o.y0/gy)*gy;y<=o.y1+eps;y+=gy)g+=`M${o.l},${f1(Y(y))}H${o.r}`;
 const out=o.nogrid?[]:[A.p(g,"#c6d0e2",1.4)];
 let tk="";const lab=[];
 if(!o.nolab)for(let x=Math.ceil(o.x0/o.xs)*o.xs;x<=o.x1+eps;x+=o.xs){const v=Math.round(x*1e6)/1e6;if(v===0)continue;tk+=`M${f1(X(v))},${f1(ax-6)}v12`;lab.push(tl(nf(v),X(v),ax+28,fs))}
 if(!o.nolab)for(let y=Math.ceil(o.y0/o.ys)*o.ys;y<=o.y1+eps;y+=o.ys){const v=Math.round(y*1e6)/1e6;if(v===0)continue;tk+=`M${f1(ay-6)},${f1(Y(v))}h12`;lab.push(tl(nf(v),ay-12,Y(v)+8,fs,"k","end"))}
 out.push(A.p(R.arrow(o.l-(ay>o.l?14:0),ax,o.r+26,ax)+R.arrow(ay,o.b+(ax<o.b?14:0),ay,o.t-26)+tk,"k",3.2),...lab);
 if(o.x0<=0&&o.y0<=0&&!o.nolab)out.push(tl("0",ay-10,ax+26,fs,"k","end"));
 out.push(tl(o.xl||"x",o.r+30,ax+30,28,"k"),tl(o.yl||"y",ay+16,o.t-16,28,"k","start"));
 return{o:out,X,Y,ax,ay,c:o};
}
/* the part of y = kx + m that lies inside the plot */
function seg(P,k,m){const c=P.c,pts=[];
 for(const x of [c.x0,c.x1]){const y=k*x+m;if(y>=c.y0-1e-9&&y<=c.y1+1e-9)pts.push([x,y])}
 if(k)for(const y of [c.y0,c.y1]){const x=(y-m)/k;if(x>=c.x0-1e-9&&x<=c.x1+1e-9)pts.push([x,y])}
 pts.sort((a,b)=>a[0]-b[0]);const a=pts[0],b=pts[pts.length-1];return R.line(P.X(a[0]),P.Y(a[1]),P.X(b[0]),P.Y(b[1]),.3)}
/* a smooth curve y = f(x) for x in [a,b], cut where it leaves the plot */
function curve(P,f,a,b,n=140){const c=P.c;let d="",on=false;
 for(let i=0;i<=n;i++){const x=a+(b-a)*i/n,y=f(x);if(y>=c.y0-1e-9&&y<=c.y1+1e-9&&isFinite(y)){d+=(on?"L":"M")+f1(P.X(x))+","+f1(P.Y(y));on=true}else on=false}return d}
/* y = kx + m as text */
const lin=(k,m)=>`y = ${k===1?"":k===-1?"−":ng(k)}x${m>0?` + ${m}`:m<0?` − ${-m}`:""}`;
/* "k =" followed by fractions and texts in one centred row: items ["t",s,c] | ["f",n,d,c] */
function frow(items,cx,y,s){const g=s*.28,w=it=>it[0]==="f"?Math.max(String(it[1]).length,String(it[2]).length)*s*.42+s*.3:String(it[1]).length*s*.44;
 const ws=items.map(w),tot=ws.reduce((a,b)=>a+b,0)+g*(items.length-1);let x=cx-tot/2;const o=[],pos=[];
 items.forEach((it,i)=>{const c=x+ws[i]/2;pos.push(c);o.push(...(it[0]==="f"?A.frac(it[1],it[2],c,y,s,it[3]||"k"):[A.tx(it[1],c,y+s*.36,s,it[2]||"k")]));x+=ws[i]+g});o.w=tot;o.pos=pos;return o}

/* =====================================================================
   1. line9: the equation of a straight line through two points
   ===================================================================== */
const LBOX={l:90,r:410,t:100,b:440,x0:0,x1:8,y0:0,y1:16,gx:1,gy:1,xs:1,ys:2};
const RX=600;
const ptL=(P,x,y,lab,c="r",dx=-16,dy=-14,anc="end")=>[dot(P.X(x),P.Y(y),c,17),tl(lab,P.X(x)+dx,P.Y(y)+dy,26,c,anc)];
/* step triangle from (x1,y1) to (x2,y2): run along, then rise */
function stepTri(P,x1,y1,x2,y2,dxl,dyl){const X1=P.X(x1),Y1=P.Y(y1),X2=P.X(x2),Y2=P.Y(y2),up=y2>y1;
 return[A.p(R.dashed(X1,Y1,X2,Y1,10),"o",4),A.p(R.dashed(X2,Y1,X2,Y2,10),"r",4),
  tl(dxl,(X1+X2)/2,up?Y1+30:Y1-12,26,"o"),tl(dyl,X2+12,(Y1+Y2)/2+9,26,"r","start")]}
const LN={steps:[
 {say:t3("Genom två punkter går exakt en rät linje. Linjen genom A = (2, 7) och B = (6, 15) har en ekvation av formen y = kx + m.",
   "Exactly one straight line goes through two points. The line through A = (2, 7) and B = (6, 15) has an equation of the form y = kx + m.",
   `يمرّ بنقطتين خطّ مستقيم واحد فقط. الخط المارّ بالنقطتين A = (2, 7) وB = (6, 15) معادلته على الصورة ${LRI("y = kx + m")}.`),
  draw:()=>{const P=plot(LBOX);return[A.wipe(),...P.o,A.p(seg(P,2,3),"b",4.5),...ptL(P,2,7,"A"),...ptL(P,6,15,"B"),
   A.tx("y = kx + m",RX,100,58),A.tx(L(t3("k = lutningen","k = the slope","k = الميل")),RX,160,32,"o"),A.tx(L(t3("m = där linjen skär y-axeln","m = where it crosses the y-axis","m = نقطة تقاطعه مع محور y")),RX,204,28,"g"),
   tl("A = (2, 7)",RX,258,34,"r"),tl("B = (6, 15)",RX,302,34,"r")]}},
 {say:t3("Lutningen k: från A till B går vi 4 steg åt höger och 8 steg uppåt. k = 8 / 4 = 2. Linjen stiger 2 för varje steg åt höger.",
   "The slope k: from A to B we go 4 steps right and 8 steps up. k = 8 ÷ 4 = 2. The line rises 2 for every step to the right.",
   "الميل k: من A إلى B نتحرك 4 خطوات إلى اليمين و8 خطوات إلى الأعلى. k = 8 ÷ 4 = 2. يرتفع الخط 2 مع كل خطوة إلى اليمين."),
  draw:()=>{const P=plot(LBOX);return[...stepTri(P,2,7,6,15,"Δx = 4","Δy = 8"),
   ...frow([["t","k ="],["f","Δy","Δx","o"],["t","="],["f","15 − 7","6 − 2"]],RX,362,36),
   ...(r=>[...r,A.loop(r.pos[3]+2,446,21,28,"g")])(frow([["t","="],["f",8,4],["t","="],["t","2","g"]],RX+12,446,36))]}},
 {say:t3("Nu vet vi att y = 2x + m. Punkten A ligger på linjen, så vi sätter in x = 2 och y = 7. Då får vi m = 3.",
   "Now we know y = 2x + m. Point A lies on the line, so we put in x = 2 and y = 7. That gives m = 3.",
   `نعرف الآن أن ${LRI("y = 2x + m")}. النقطة A تقع على الخط، فنعوّض ${LRI("x = 2")} و${LRI("y = 7")}، فنحصل على ${LRI("m = 3")}.`),
  draw:()=>{const P=plot(LBOX);return[A.wipe(),...P.o,A.p(seg(P,2,3),"b",4.5),...ptL(P,2,7,"A"),...ptL(P,6,15,"B"),
   A.tx("y = 2x + m",RX,95,48,"b"),tl("A = (2, 7)",RX,148,32,"r"),A.tx(`7 = 2 ${MUL()} 2 + m`,RX,205,40),A.tx("7 = 4 + m",RX,258,40),A.tx("m = 3",RX,312,44,"g"),
   dot(P.X(0),P.Y(3),"g",20),A.loop(P.X(0),P.Y(3),24,22,"g"),tl("(0, 3)",P.X(0)+16,P.Y(3)+34,26,"g","start")]}},
 {say:t3("Linjens ekvation är y = 2x + 3. Kontrollera med B: 2 · 6 + 3 = 15. Det stämmer!",
   "The equation of the line is y = 2x + 3. Check with B: 2 × 6 + 3 = 15. It works!",
   `معادلة الخط هي ${LRI("y = 2x + 3")}. نتحقق بالنقطة B: ${LRI(`2 × 6 + 3 = 15`)}. صحيح!`),
  draw:()=>[A.hl(RX-150,340,300,68),A.tx("y = 2x + 3",RX,392,52,"g"),A.tx(`B: 2 ${MUL()} 6 + 3 = 15 ✓`,RX,458,34,"b")]},
 {say:t3("Mobilen har 80 % batteri efter 2 timmar och 50 % efter 5 timmar. Linjen lutar nedåt, så k blir negativt: k = −30 / 3 = −10.",
   "The phone has 80% battery after 2 hours and 50% after 5 hours. The line slopes down, so k is negative: k = −30 ÷ 3 = −10.",
   "بطارية الهاتف 80% بعد ساعتين و50% بعد 5 ساعات. الخط ينحدر إلى الأسفل، لذلك k سالب: k = −30 ÷ 3 = −10."),
  draw:()=>{const P=plot({l:90,r:410,t:100,b:440,x0:0,x1:10,y0:0,y1:100,gx:1,gy:10,xs:2,ys:20,xl:"h",yl:"%"});
   return[A.wipe(),...P.o,A.p(seg(P,-10,100),"b",4.5),dot(P.X(2),P.Y(80),"r",17),dot(P.X(5),P.Y(50),"r",17),
    A.tx(L(t3("Mobilens batteri","The phone battery","بطارية الهاتف")),RX,80,38,"b"),
    tl(L(t3("efter 2 h: 80 %","after 2 h: 80%","بعد ساعتين: 80%")),RX,135,30,"r"),tl(L(t3("efter 5 h: 50 %","after 5 h: 50%","بعد 5 ساعات: 50%")),RX,180,30,"r"),
    ...stepTri(P,2,80,5,50,"Δx = 3","Δy = −30"),
    ...frow([["t","k ="],["f","−30","3"],["t","="],["t","−10","g"]],RX,250,40)]}},
 {say:t3("Sätt in punkten (2, 80): 80 = −10 · 2 + m, så m = 100. Ekvationen y = −10x + 100 betyder: fulladdad från början och 10 % mindre varje timme.",
   "Put in the point (2, 80): 80 = −10 × 2 + m, so m = 100. The equation y = −10x + 100 means: fully charged at the start and 10% less every hour.",
   `نعوّض النقطة (2, 80): ${LRI("80 = −10 × 2 + m")}، إذن ${LRI("m = 100")}. المعادلة ${LRI("y = −10x + 100")} تعني: البطارية مشحونة بالكامل في البداية وتنقص 10% كل ساعة.`),
  draw:()=>{const P=plot({l:90,r:410,t:100,b:440,x0:0,x1:10,y0:0,y1:100,gx:1,gy:10,xs:2,ys:20,xl:"h",yl:"%"});
   return[A.tx(`80 = −10 ${MUL()} 2 + m`,RX,325,38),A.tx("m = 100",RX,375,40,"g"),
    A.hl(RX-170,398,340,66),A.tx("y = −10x + 100",RX,448,48,"g")]}}
]};
/* contexts for level 2: y = kx + m from two values in a table */
const LCTX=[
 {t:t3("Taxi: pris för en resa","Taxi: price of a trip","سيارة أجرة: سعر الرحلة"),xh:t3("km","km","كم"),yh:t3("kr","kr","كرونة"),
  mk:()=>{const k=rint(11,18),m=pick([35,40,45,50,55,60]),x1=rint(2,6),x2=x1+rint(2,8);return{k,m,x1,x2}}},
 {t:t3("Gym: kostnad för x besök","Gym: cost of x visits","النادي الرياضي: تكلفة x زيارة"),xh:t3("besök","visits","زيارات"),yh:t3("kr","kr","كرونة"),
  mk:()=>{const k=pick([20,25,30,35,40]),m=pick([100,150,200,250]),x1=rint(2,5),x2=x1+rint(3,10);return{k,m,x1,x2}}},
 {t:t3("Ett ljus brinner ner","A candle burns down","شمعة تحترق"),xh:t3("timmar","hours","ساعات"),yh:t3("cm","cm","سم"),
  mk:()=>{const k=-pick([2,3]),m=rint(24,32),x1=rint(1,3),x2=x1+rint(2,4);return{k,m,x1,x2}}},
 {t:null,xh:"x",yh:"y",
  mk:()=>{let k,m,x1,x2;do{k=pick([-4,-3,-2,-1,1,2,3,4,5]);m=rint(-9,9);x1=rint(-4,3);x2=x1+rint(1,4)}while(m===0);return{k,m,x1,x2}}}
];
LESSONS.push({id:"line9",subject:"math",grades:"9",kind:"wb",
 title:t3("Räta linjens ekvation","The equation of a straight line","معادلة الخط المستقيم"),
 icon:ICO(`${[1,2,3,4,5,6,7].map(i=>`<path d="M${40+i*30} 20V160M40 ${20+i*20}H280" stroke="#d6deed" stroke-width="1.2"/>`).join("")}<path d="M40 160H290M40 160V12" stroke="#1d2433" stroke-width="3.5" fill="none"/><path d="M40 140L250 20" stroke="#2257c9" stroke-width="5"/><path d="M100 106H190" stroke="#e07b00" stroke-width="4" stroke-dasharray="9 7"/><path d="M190 106V54" stroke="#d63b2f" stroke-width="4" stroke-dasharray="9 7"/><circle cx="100" cy="106" r="7" fill="#d63b2f"/><circle cx="190" cy="54" r="7" fill="#d63b2f"/><text direction="ltr" x="230" y="128" ${CV} font-size="34" fill="#1d2433">y = kx + m</text>`),
 steps:LN.steps,mount:wbMount(LN),
 gen(level){const M=MUL();
  if(level===0){let k,x1,x2,y1,y2;do{k=pick([-3,-2,-1,1,2,3]);x1=rint(1,5);x2=x1+rint(2,4);y1=rint(2,15);y2=y1+k*(x2-x1)}while(x2>7||y2<2||y2>15||Math.abs(y2-y1)<3);
   const P=plot(LBOX),m=y1-k*x1,up=k>0;
   const q=[A.wipe(),...P.o,A.p(seg(P,k,m),"b",4.5),...ptL(P,x1,y1,"A",...(up?["r",-14,-14,"end"]:["r",-14,30,"end"])),...ptL(P,x2,y2,"B",...(up?["r",-14,-14,"end"]:["r",-14,30,"end"])),
    A.tx(L(pick([t3("Bestäm lutningen k","Find the slope k","أوجد الميل k"),t3("Beräkna linjens lutning k","Calculate the slope k of the line","احسب ميل المستقيم k"),t3("Bestäm k-värdet","Find the k-value","أوجد قيمة k")])),RX,95,36),tl(`A = (${x1}, ${y1})`,RX,170,34),tl(`B = (${x2}, ${y2})`,RX,220,34)];
   const sol=[...stepTri(P,x1,y1,x2,y2,`Δx = ${x2-x1}`,`Δy = ${ng(y2-y1)}`)],hc=sol.length;
   sol.push(...frow([["t","k ="],["f","Δy","Δx","o"],["t","="],["f",ng(y2-y1),x2-x1],["t","="],["t",ng(k),"g"]],RX,320,40),A.hl(RX-120,380,240,64),A.tx(`k = ${ng(k)}`,RX,430,48,"g"));
   return{kind:"num",ans:k,signed:true,show:ng(k),hc,q,sol}}
  /* level 1: does the point lie on the line? */
  if(level===1&&Math.random()<.3){let k,m,a,b;do{k=pick([-3,-2,-1,2,3,4,5]);m=rint(-8,9);a=rint(-4,6)}while(m===0||a===0);
   const v=k*a+m,yes=Math.random()<.5;b=yes?v:v+pick([-2,-1,1,2]);
   const O=[t3("Ja, punkten ligger på linjen","Yes, the point is on the line","نعم، النقطة تقع على المستقيم"),t3("Nej, punkten ligger inte på linjen","No, the point is not on the line","لا، النقطة لا تقع على المستقيم")],ans=b===v?0:1,xa=a<0?`(${ng(a)})`:a;
   const q=[A.wipe(),A.tx(L(pick([t3("Ligger punkten på linjen?","Is the point on the line?","هل تقع النقطة على المستقيم؟"),t3("Avgör om punkten ligger på linjen.","Decide if the point is on the line.","حدّد هل تقع النقطة على المستقيم.")])),400,70,38),
    A.tx(lin(k,m),400,160,48,"b"),A.tx(`P = (${ng(a)}, ${ng(b)})`,400,240,44,"o")];
   const sol=[A.tx(L(t3(`Sätt in x = ${ng(a)}:`,`Put in x = ${ng(a)}:`,`عوّض x = ${LRI(ng(a))}:`)),400,305,32)],hc=1;
   sol.push(A.tx(`y = ${ng(k)} ${M} ${xa} ${m<0?"−":"+"} ${Math.abs(m)} = ${ng(v)}`,400,360,40),A.hl(150,385,500,64),A.tx(b===v?`${ng(v)} = ${ng(b)}  ✓`:`${ng(v)} ≠ ${ng(b)}`,400,435,46,b===v?"g":"r"));
   return{kind:"choice",opts:O,ans,show:L(O[ans]),hc,q,sol}}
  if(level===1){let k,m,a,b;do{k=pick([-3,-2,-1,1,2,3,4]);m=rint(1,13);a=rint(1,6);b=k*a+m}while(b<1||b>15||Math.abs(b-m)<2||(k>0&&a<3));
   const P=plot(LBOX);
   const q=[A.wipe(),...P.o,A.p(seg(P,k,m),"b",4.5),...ptL(P,a,b,`P (${a}, ${b})`,...(k>0?["r",-14,-14,"end"]:["r",14,-14,"start"])),A.p(R.circ(P.X(0),P.Y(m),12),"o",4),tl("(0, m)",P.X(0)+18,P.Y(m)+(k>0?34:-16),26,"o","start"),
    A.tx(L(pick([t3("Bestäm m","Find m","أوجد m"),t3("Bestäm m-värdet","Find the m-value","أوجد قيمة m"),t3("Var skär linjen y-axeln?","Find the y-intercept m","أوجد المقطع الصادي m")])),RX,95,34),A.tx(`k = ${ng(k)}`,RX,165,40,"o"),A.tx(`y = ${k===1?"":k===-1?"−":ng(k)}x + m`,RX,225,40,"b")];
   const sol=[A.tx(`${b} = ${ng(k)} ${M} ${a} + m`,RX,295,38)],hc=1;
   sol.push(A.tx(`${b} = ${ng(k*a)} + m`,RX,350,38),A.hl(RX-110,375,220,64),A.tx(`m = ${m}`,RX,425,48,"g"),dot(P.X(0),P.Y(m),"g",20),A.loop(P.X(0),P.Y(m),24,22,"g"));
   return{kind:"num",ans:m,signed:true,show:String(m),hc,q,sol}}
  const C=pick(LCTX),{k,m,x1,x2}=C.mk(),y1=k*x1+m,y2=k*x2+m,cx=215,X1=330;
  const q=[A.wipe(),A.tx(L(pick([t3("Bestäm k och m","Find k and m","أوجد k وm"),t3("Bestäm linjens ekvation y = kx + m","Find the equation y = kx + m",`أوجد معادلة المستقيم ${LRI("y = kx + m")}`)])),400,58,36)],hx=C.t?`x (${L(C.xh)})`:"x",hy=C.t?`y (${L(C.yh)})`:"y",T0=160;
  if(C.t)q.push(A.tx(L(C.t),cx,125,30,"b"));
  q.push(A.p(R.rect(cx-180,T0,360,160,.3)+R.line(cx-180,T0+80,cx+180,T0+80,.3)+R.line(cx-20,T0,cx-20,T0+160,.3)+R.line(cx+80,T0,cx+80,T0+160,.3),"k",3.5),
   tl(hx,cx-100,T0+50,28,"o"),tl(hy,cx-100,T0+130,28,"b"),tl(x1,cx+30,T0+52,34),tl(x2,cx+130,T0+52,34),tl(nf(y1),cx+30,T0+132,34),tl(nf(y2),cx+130,T0+132,34),
   A.tx("y = kx + m",cx,410,48,"b"));
  const sol=[...frow([["t","k ="],["f",`${nf(y2)} − ${y1<0?`(${nf(y1)})`:nf(y1)}`,`${x2} − ${x1<0?`(${ng(x1)})`:x1}`],["t","="],["f",nf(y2-y1),x2-x1],["t","="],["t",ng(k),"o"]],590,150,34)],hc=1+A.frac(1,1,0,0,10).length;
  sol.push(A.tx(`${nf(y1)} = ${ng(k)} ${M} ${x1<0?`(${ng(x1)})`:x1} + m`,590,250,34),A.tx(`m = ${nf(y1)} − ${k*x1<0?`(${nf(k*x1)})`:nf(k*x1)} = ${nf(m)}`,590,310,34,"b"),
   A.hl(380,400,400,66),A.tx(lin(k,m),580,450,48,"g"));
  return{kind:"pair",ans:[k,m],labels:["k","m"],sep:"",signed:true,show:lin(k,m),hc,q,sol}}
});

/* =====================================================================
   2. nonlin9: non-linear functions, y = x² and y = k/x
   ===================================================================== */
/* a table with a header column: rows=[[head,c,[cells]],...], cx centre, top y, header width hw, cell width cw, row height rh */
function tbl(rows,cx,top,hw,cw,rh,fs=30){const n=rows[0][2].length,W=hw+n*cw,x0=cx-W/2,H=rows.length*rh;let d=R.rect(x0,top,W,H,.3);
 for(let r=1;r<rows.length;r++)d+=R.line(x0,top+r*rh,x0+W,top+r*rh,.3);for(let c=0;c<n;c++)d+=R.line(x0+hw+c*cw,top,x0+hw+c*cw,top+H,.3);
 const o=[A.p(d,"k",3.5)],cxs=[...Array(n)].map((_,c)=>x0+hw+(c+.5)*cw),cy=r=>top+(r+.5)*rh+fs*.36;
 rows.forEach(([h,c,cells],r)=>{o.push(tl(h,x0+hw/2,cy(r),Math.min(fs,28),c));cells.forEach((v,j)=>{if(v!==null&&v!=="")o.push(tl(v,cxs[j],cy(r),fs))})});
 return{o,cx:cxs,cy,x0,W}}
const sq=n=>n<0?`(${ng(n)})²`:`${n}²`;
const PBOX={l:340,r:720,t:92,b:440,x0:-3,x1:3,y0:0,y1:9,gx:1,gy:1,xs:1,ys:1};
const NL={steps:[
 {say:t3("Funktionen y = x² betyder att x multipliceras med sig själv. Vi gör en värdetabell och prickar in punkterna. Obs: (−3)² = 9, för minus gånger minus blir plus.",
   "The function y = x² means x multiplied by itself. We make a table of values and plot the points. Note: (−3)² = 9, because minus times minus is plus.",
   `الدالة ${LRI("y = x²")} تعني ضرب x في نفسه. نصنع جدول قيم ونعيّن النقاط. انتبه: ${LRI("(−3)² = 9")}، لأن سالبًا في سالب يعطي موجبًا.`),
  draw:()=>{const P=plot(PBOX),xs=[-3,-2,-1,0,1,2,3],o=[A.wipe()];
   const top=72,rh=50,cl=[70,170,270];o.push(A.p(R.rect(70,top,200,rh*8,.3)+R.line(170,top,170,top+rh*8,.3)+[1,2,3,4,5,6,7].map(r=>R.line(70,top+r*rh,270,top+r*rh,.3)).join(""),"k",3.5),
    tl("x",120,top+34,30,"o"),tl("y = x²",220,top+34,28,"b"));
   xs.forEach((x,i)=>o.push(tl(ng(x),120,top+(i+1)*rh+34,30),tl(x*x,220,top+(i+1)*rh+34,30,"b")));
   o.push(...P.o,A.p(dots(xs.map(x=>[P.X(x),P.Y(x*x)])),"r",17));return o}},
 {say:t3("Punkterna ligger inte på en rät linje. De bildar en böjd kurva som kallas parabel. Den är symmetrisk: x = −2 och x = 2 ger samma y.",
   "The points do not lie on a straight line. They form a curve called a parabola. It is symmetric: x = −2 and x = 2 give the same y.",
   `النقاط لا تقع على خط مستقيم، بل تشكّل منحنى يسمّى القطع المكافئ. وهو متماثل: ${LRI("x = −2")} و${LRI("x = 2")} تعطيان قيمة y نفسها.`),
  draw:()=>{const P=plot(PBOX);return[A.p(curve(P,x=>x*x,-3,3),"b",4.5),A.p(R.dashed(P.X(-2),P.Y(4),P.X(2),P.Y(4),10),"o",4),
   A.tx(L(t3("parabel","parabola","قطع مكافئ")),P.X(-1.35),P.Y(7.2),34,"b")]}},
 {say:t3("Arean av en kvadrat med sidan x är y = x². Om sidan blir dubbelt så lång blir arean fyra gånger så stor.",
   "The area of a square with side x is y = x². If the side becomes twice as long, the area becomes four times as big.",
   `مساحة مربع طول ضلعه x هي ${LRI("y = x²")}. إذا تضاعف طول الضلع، تصبح المساحة أربعة أضعاف.`),
  draw:()=>{const B=400,u=46,o=[A.wipe(),A.tx(L(t3("Kvadratens area: y = x²","Area of a square: y = x²","مساحة المربع: y = x²")),400,62,40)];
   [[1,80,"g"],[2,170,"b"],[4,330,"r"]].forEach(([n,x,c])=>{o.push(...gridRect(x,B-n*u,n,n,u,c),tl(`x = ${n}`,x+n*u/2,B+38,28,c),A.tx(n*n,x+n*u/2,B-n*u/2+16,n===1?30:48,c))});
   o.push(A.arrow(216,190,422,190,"o",-30),tl(`${MUL()} 2`,319,150,28,"o"),A.tx(L(t3("sidan · 2","side × 2","الضلع × 2")),660,230,36,"o"),A.tx(L(t3("arean · 4","area × 4","المساحة × 4")),660,300,40,"r"),A.tx("4 + 4 + 4 + 4 = 16",660,370,30,"r"));return o}},
 {say:t3("24 pizzabitar delas lika. Ju fler personer, desto färre bitar var: dubbelt så många personer ger hälften så många bitar. x · y är alltid 24.",
   "24 slices of pizza are shared equally. The more people, the fewer slices each: twice as many people get half as many slices. x × y is always 24.",
   `تُقسَّم 24 قطعة بيتزا بالتساوي. كلما زاد عدد الأشخاص قلّ نصيب كل واحد: ضعف عدد الأشخاص يعني نصف عدد القطع. وحاصل ${LRI("x × y")} يساوي 24 دائمًا.`),
  draw:()=>{const X=[1,2,3,4,6,8,12],T=tbl([[L(t3("personer x","people x","الأشخاص x")),"o",X],[L(t3("bitar var y","slices y","القطع y")),"b",X.map(x=>24/x)]],400,140,170,80,64,32);
   return[A.wipe(),A.tx(L(t3("24 pizzabitar delas lika","24 pizza slices shared equally","24 قطعة بيتزا تُقسَّم بالتساوي")),400,62,40),...T.o,
    A.arrow(T.cx[0]+10,132,T.cx[1]-10,132,"o",-22),tl(`${MUL()} 2`,(T.cx[0]+T.cx[1])/2,104,26,"o"),A.arrow(T.cx[0]+10,278,T.cx[1]-10,278,"b",22),tl(`${DIVS()} 2`,(T.cx[0]+T.cx[1])/2,318,26,"b"),
    A.tx(`1 ${MUL()} 24 = 2 ${MUL()} 12 = 3 ${MUL()} 8 = 4 ${MUL()} 6 = 24`,400,368,38),
    A.hl(290,398,220,94),...frow([["t","y ="],["f",24,"x","g"]],400,442,44)]}},
 {say:t3("Grafen till y = 24 / x är en hyperbel. Kurvan kommer närmare och närmare axlarna men når dem aldrig. Det kallas omvänd proportionalitet.",
   "The graph of y = 24 ÷ x is a hyperbola. The curve gets closer and closer to the axes but never reaches them. This is called inverse proportion.",
   `منحنى الدالة ${LRI("y = 24/x")} قطع زائد. يقترب المنحنى من المحورين أكثر فأكثر لكنه لا يصل إليهما أبدًا. وهذا يسمّى التناسب العكسي.`),
  draw:()=>{const P=plot({l:90,r:470,t:90,b:440,x0:0,x1:12,y0:0,y1:24,gx:1,gy:2,xs:2,ys:4}),X=[1,2,3,4,6,8,12];
   return[A.wipe(),...P.o,A.p(dots(X.map(x=>[P.X(x),P.Y(24/x)])),"r",16),A.p(curve(P,x=>24/x,1,12),"b",4.5),
    ...frow([["t","y ="],["f",24,"x","b"]],640,110,44),A.tx(L(t3("hyperbel","hyperbola","قطع زائد")),640,220,40,"b"),
    A.tx(`x ${MUL()} y = 24`,640,290,40,"o"),A.tx(L(t3("omvänt proportionell","inversely proportional","تناسب عكسي")),640,370,32,"g"),A.tx(L(t3("når aldrig axlarna","never reaches the axes","لا يلمس المحورين")),640,420,28,"r")]}},
 {say:t3("Tre sorters samband: en rät linje ökar lika mycket varje steg, en parabel kommer från x², och en hyperbel har x · y konstant.",
   "Three kinds of relationship: a straight line goes up by the same amount each step, a parabola comes from x², and a hyperbola has x × y constant.",
   `ثلاثة أنواع من العلاقات: الخط المستقيم يزيد بالمقدار نفسه في كل خطوة، والقطع المكافئ يأتي من x²، والقطع الزائد يكون فيه ${LRI("x × y")} ثابتًا.`),
  draw:()=>{const C=[140,400,660],o=[A.wipe()],F=[[x=>2*x,"y = 2x",-2.5,2.5,-5,5,t3("rät linje","straight line","خط مستقيم"),t3("+2 varje steg","+2 each step","يزيد 2 في كل خطوة"),"o"],
    [x=>x*x,"y = x²",-3,3,0,9,t3("parabel","parabola","قطع مكافئ"),t3("x gånger x","x times x","x في x"),"b"],[x=>12/x,"y = 12/x",0,12,0,12,t3("hyperbel","hyperbola","قطع زائد"),t3("x · y = 12","x × y = 12","x × y = 12"),"r"]];
   F.forEach(([f,nm,a,b,c,d,n1,n2,col],i)=>{const P=plot({l:C[i]-95,r:C[i]+95,t:130,b:300,x0:a,x1:b,y0:c,y1:d,xs:100,ys:100,nolab:true,nogrid:true});
    o.push(A.tx(nm,C[i],80,40,col),...P.o.filter(z=>z.t==="path"),A.p(curve(P,f,i===2?1:a,b),col,4.5),A.tx(L(n1),C[i],370,34,col),tl(L(n2),C[i],420,28))});return o}}
]};
const NCTX=[
 {mk:()=>{let x1,x2,K;do{x1=rint(3,6);x2=rint(2,8);K=lcmN(lcmN(x1,x2),100)*rint(1,9)}while(x1===x2||K<2000||K>9000);return{x1,x2,K}},
  q:(x1,y1,x2)=>t3(`${x1} kompisar hyr en stuga och betalar ${kr(y1)} var.`,`${x1} friends rent a cabin and pay ${kr(y1)} each.`,`يستأجر ${x1} أصدقاء كوخًا، ويدفع كل واحد منهم ${fmt(y1)} كرونة.`),
  a:x2=>t3(`Hur mycket betalar var och en om de är ${x2}?`,`How much does each pay if there are ${x2} of them?`,`كم يدفع كل واحد إذا كانوا ${x2}؟`),
  hx:t3("personer","people","الأشخاص"),hy:t3("kr var","kr each","كرونة للفرد"),u:"kr"},
 {mk:()=>{const S=[40,50,60,80,90,100,120];let x1,x2,K;do{x1=pick(S);x2=pick(S);K=lcmN(x1,x2)*rint(1,4)}while(x1===x2||K/Math.min(x1,x2)>8||K/Math.max(x1,x2)<3);return{x1,x2,K}},
  q:(x1,y1,x2)=>t3(`Med ${x1} km/h tar resan ${y1} timmar.`,`At ${x1} km/h the trip takes ${y1} hours.`,`بسرعة ${x1} km/h تستغرق الرحلة ${y1} ساعات.`),
  a:x2=>t3(`Hur många timmar tar den med ${x2} km/h?`,`How many hours does it take at ${x2} km/h?`,`كم ساعة تستغرق بسرعة ${x2} km/h؟`),
  hx:t3("km/h","km/h","km/h"),hy:t3("timmar","hours","ساعات"),u:"h"},
 {mk:()=>{let x1,x2,K;do{x1=rint(2,6);x2=rint(2,8);K=lcmN(x1,x2)*rint(1,8)}while(x1===x2||K<12||K>72);return{x1,x2,K}},
  q:(x1,y1,x2)=>t3(`${x1} personer bygger ett trädäck på ${y1} dagar.`,`${x1} people build a deck in ${y1} days.`,`${x1===2?"يبني شخصان":`يبني ${x1} أشخاص`} شرفة خشبية في ${y1===2?"يومين":`${y1} ${y1<=10?"أيام":"يومًا"}`}.`),
  a:x2=>t3(`Hur många dagar tar det för ${x2} personer?`,`How many days does it take ${x2} people?`,`كم يومًا يحتاج ${x2===2?"شخصان":`${x2} أشخاص`}؟`),
  hx:t3("personer","people","الأشخاص"),hy:t3("dagar","days","الأيام"),u:""}
];
const gcdN=(a,b)=>b?gcdN(b,a%b):a,lcmN=(a,b)=>a*b/gcdN(a,b);
LESSONS.push({id:"nonlin9",subject:"math",grades:"9",kind:"wb",
 title:t3("Icke-linjära funktioner","Non-linear functions","الدوال غير الخطية"),
 icon:ICO(`<path d="M20 160H150M85 165V20" stroke="#1d2433" stroke-width="3"/><path d="M30 25Q85 290 140 25" stroke="#2257c9" stroke-width="5" fill="none"/><path d="M175 160H305M180 165V20" stroke="#1d2433" stroke-width="3"/><path d="M196 24Q206 140 300 148" stroke="#d63b2f" stroke-width="5" fill="none"/><text direction="ltr" x="120" y="60" ${CV} font-size="30" fill="#2257c9">x²</text><text direction="ltr" x="262" y="80" ${CV} font-size="30" fill="#d63b2f">k/x</text>`),
 steps:NL.steps,mount:wbMount(NL),
 gen(level){const M=MUL(),D=DIVS();
  /* level 0: a square patio, the side is made n times longer */
  if(level===0&&Math.random()<.3){const n=pick([2,2,3,3,4]),a=n===4?pick([1,2]):rint(2,4),A1=a*a,A2=(n*a)**2,u=52/Math.max(1,a*n/4.2)/1.3,w1=a*u,w2=a*n*u,y0=430;
   const q=[A.wipe(),A.tx(L(t3(`En kvadratisk uteplats har sidan ${a} m.`,`A square patio has side ${a} m.`,`فناء مربع طول ضلعه ${LRI(a+" m")}.`)),400,50,30),
    A.tx(L(pick([t3(`Sidan görs ${n} gånger så lång. Beräkna den nya arean.`,`The side is made ${n} times as long. Work out the new area.`,`يُجعل الضلع أطول ${n} مرات. احسب المساحة الجديدة.`),t3(`Sidan blir ${n} gånger så lång. Hur stor blir arean?`,`The side becomes ${n} times as long. How big is the area?`,`يصبح الضلع أطول ${n} مرات. كم تصبح المساحة؟`)])),400,94,28,"b"),
    A.hatch(`M120,${y0}h${f1(w1)}v${f1(-w1)}h${f1(-w1)}Z`,"b"),A.p(R.rect(120,y0-w1,w1,w1,.3),"b",4),tl(`${a} m`,120+w1/2,y0+34,28,"b"),
    A.hatch(`M${f1(700-w2)},${y0}h${f1(w2)}v${f1(-w2)}h${f1(-w2)}Z`,"o"),A.p(R.rect(700-w2,y0-w2,w2,w2,.3),"o",4),tl(`${n*a} m`,700-w2/2,y0+34,28,"o"),tl("?",700-w2/2,y0-w2/2+14,44,"r"),
    A.arrow(140+w1,y0-w1/2,680-w2,y0-w2/2,"k"),tl(`${L(t3("sidan","side","الضلع"))} ${LRI(M+" "+n)}`,(140+w1+680-w2)/2,y0-(w1+w2)/4+40,28,"o")];
   const sol=[tl(`${a} ${M} ${a} = ${A1} m²`,120+w1/2,y0-w1-24,30,"b")],hc=1;
   sol.push(A.tx(`${n*a} ${M} ${n*a} = ${A2} m²`,400,170,40),A.hl(260,190,280,60),A.tx(`${A2} m²`,400,236,44,"g"),A.tx(L(t3(`arean ${M} ${n*n}`,`area ${M} ${n*n}`,`المساحة ${LRI(M+" "+n*n)}`)),400,290,30,"g"));
   return{kind:"num",ans:A2,show:`${A2} m²`,hc,q,sol}}
  if(level===0){const a=pick([1,2,3,4,5]),c=pick([-6,-5,-4,-3,-2,2,3,4,5,6]),y=a*c*c,fs=a===1?"y = x²":`y = ${a}x²`;
   const top=Math.ceil(y*1.15/10)*10,P=plot({l:470,r:750,t:100,b:420,x0:-7,x1:7,y0:0,y1:top,xs:100,ys:1e9,nolab:true,nogrid:true}),X=P.X(c),Yp=P.Y(y);
   const q=[A.wipe(),A.tx(L(pick([t3(`Beräkna y när x = ${ng(c)}`,`Work out y when x = ${ng(c)}`,`احسب y عندما x = ${ng(c)}`),t3(`Bestäm y för x = ${ng(c)}`,`Find y for x = ${ng(c)}`,`أوجد y عند x = ${ng(c)}`)])),400,62,38),A.tx(fs,230,180,64,"b"),A.tx(`x = ${ng(c)}`,230,260,48,"o"),
    ...P.o,A.p(curve(P,x=>a*x*x,-7,7),"b",4),A.p(R.dashed(X,P.ax,X,Yp,10),"o",3.5),tl(ng(c),X,P.ax+32,28,"o"),dot(X,Yp,"r",17),tl("?",X+(c<0?-18:18),Yp+6,36,"r",c<0?"end":"start")];
   const sol=[A.tx(a===1?`y = ${sq(c)}`:`y = ${a} ${M} ${sq(c)}`,230,340,44)],hc=1;
   if(a>1)sol.push(A.tx(`y = ${a} ${M} ${c*c}`,230,395,40));sol.push(A.loop(X,Yp,22,22,"g"),A.hl(110,410,240,64),A.tx(`y = ${y}`,230,460,50,"g"));
   return{kind:"num",ans:y,show:String(y),hc,q,sol}}
  if(level===1){const C=pick(NCTX),{x1,x2,K}=C.mk(),y1=K/x1,y2=K/x2;
   const T=tbl([[L(C.hx),"o",[x1,x2]],[L(C.hy),"b",[fmt(y1),"?"]]],230,160,170,110,80,34);
   const q=[A.wipe(),A.tx(L(C.q(x1,y1,x2)),400,62,32),A.tx(L(C.a(x2)),400,110,32,"b"),...T.o];
   const sol=[A.tx(L(t3("omvänt proportionellt:","inversely proportional:","تناسب عكسي:")),230,385,28,"g"),A.tx(`x ${M} y = ${L(t3("konstant","constant","ثابت"))}`,230,430,30,"g"),A.tx(`${fmt(x1)} ${M} ${fmt(y1)} = ${fmt(K)}`,600,200,40)],hc=3;
   sol.push(A.tx(`y = ${fmt(K)} ${D} ${x2} = ${fmt(y2)}`,600,280,40),A.hl(470,315,260,66),A.tx(`${fmt(y2)}${C.u?" "+C.u:""}`,600,366,50,"g"));
   return{kind:"num",ans:y2,show:`${fmt(y2)}${C.u?" "+C.u:""}`,hc,q,sol}}
  const type=rint(0,3),v=type===0?rint(2,9):type===1?rint(2,5):type===2?pick([12,24,36,48]):rint(2,9);
  const F=[{s:`y = ${v}x`,f:x=>v*x},{s:`y = ${v}x²`,f:x=>v*x*x},{s:`y = ${v}/x`,f:x=>v/x},{s:`y = x + ${v-1}`,f:x=>x+v-1}];
  const xs=[1,2,3,4],ys=xs.map(F[type].f),ord=shuffle([0,1,2,3]),ans=ord.indexOf(type);
  const T=tbl([["x","o",xs],["y","b",ys]],400,120,110,120,70,34);
  const vv=n=>Number.isInteger(n)?String(n):dfmt(n,1);
  const q=[A.wipe(),A.tx(L(pick([t3("Vilken formel passar tabellen?","Which formula fits the table?","أي صيغة تناسب الجدول؟"),t3("Vilken funktion beskriver värdetabellen?","Which function describes the table of values?","أي دالة تصف جدول القيم؟")])),400,62,34),...T.o];
  const sol=[A.hl(T.cx[1]-55,124,110,136)],hc=1;
  ord.forEach((k,i)=>{const ok=k===type,cx=i%2?590:210,cy=i<2?345:425,val=F[k].f(2);
   sol.push(tl(`${F[k].s}: ${F[k].s.replace(/^y = /,"").replace(/(\d)x/,`$1 ${M} x`).replace(/x/,"2")} = ${vv(val)} ${ok?"✓":"✗"}`,cx,cy,32,ok?"g":"r"));if(ok)sol.push(A.loop(cx,cy-10,170,34,"g"))});
  return{kind:"choice",opts:ord.map(k=>F[k].s),ans,show:F[type].s,hc,q,sol}}
});

/* =====================================================================
   3. exp9: exponential growth and decay
   ===================================================================== */
/* a centred row of texts and powers: items "s" | ["t",s,c] | ["p",base,exp,c] */
const cw=(t,s)=>[...String(t)].reduce((a,ch)=>a+s*(/[,.:]/.test(ch)?.16:/[\s·]/.test(ch)?.22:/[0-9]/.test(ch)?.4:.44),0);
function erow(items,cx,y,s,c0="k"){const it=items.map(v=>typeof v==="string"?["t",v.trim()]:v),w=v=>v[0]==="p"?cw(v[1],s)+cw(v[2],s*.62)+4:cw(v[1],s);
 const ws=it.map(w),g=s*.22,tot=ws.reduce((a,b)=>a+b,0)+g*(it.length-1);let x=cx-tot/2;const o=[];
 it.forEach((v,i)=>{const c=v[v[0]==="p"?3:2]||c0;if(v[0]==="p"){const bw=cw(v[1],s);o.push(A.tx(v[1],x,y,s,c,"start"),A.tx(v[2],x+bw+4,y-s*.42,s*.62,c,"start"))}
  else{const nx=it[i+1]&&it[i+1][0]==="p",pv=it[i-1]&&it[i-1][0]==="p";o.push(nx?A.tx(v[1],x+ws[i],y,s,c,"end"):pv?A.tx(v[1],x,y,s,c,"start"):A.tx(v[1],x+ws[i]/2,y,s,c))}x+=ws[i]+g});o.w=tot;return o}
/* vertical bars: vals, centres X(i), base, scale; labels under */
function bars(vals,X,base,sc,w,c,labs,top=true){const o=[];vals.forEach((v,i)=>{const h=v*sc;o.push(A.p(R.rect(X(i)-w/2,base-h,w,h,.2),c,3.5),A.hatch(`M${f1(X(i)-w/2)},${base}h${w}v${f1(-h)}h${-w}Z`,c));
  if(top)o.push(tl(fmt(v),X(i),base-h-12,28,c));if(labs)o.push(tl(labs[i],X(i),base+34,26))});o.push(A.p(R.line(X(0)-w,base,X(vals.length-1)+w,base,.3),"k",3.5));return o}
const DAY=i=>L(t3(`dag ${i}`,`day ${i}`,`اليوم ${i}`)),YR=i=>L(t3(`år ${i}`,`year ${i}`,`السنة ${i}`));
const EX={steps:[
 {say:t3("Ett klipp får 500 visningar första dagen. Sedan fördubblas antalet varje dag: 1 000, 2 000, 4 000, 8 000. Ökningen blir större och större.",
   "A clip gets 500 views on the first day. Then the number doubles every day: 1,000, 2,000, 4,000, 8,000. The increase gets bigger and bigger.",
   "يحصل مقطع على 500 مشاهدة في اليوم الأول، ثم يتضاعف العدد كل يوم: 1000 ثم 2000 ثم 4000 ثم 8000. والزيادة تكبر أكثر فأكثر."),
  draw:()=>{const V=[500,1000,2000,4000,8000],X=i=>150+i*125;return[A.wipe(),A.tx(L(t3("Visningar per dag","Views per day","المشاهدات في كل يوم")),400,58,40,"b"),
   ...bars(V,X,410,.032,70,"b",V.map((_,i)=>DAY(i))),...[0,1,2,3].flatMap(i=>[A.arrow(X(i)+12,118,X(i+1)-12,118,"o",-14),tl(`${MUL()} 2`,X(i)+62,100,26,"o")])]}},
 {say:t3("Jämför med en linjär ökning på 1 500 per dag. Den linjära ökar lika mycket varje dag. Den exponentiella multipliceras med samma faktor och går till slut om.",
   "Compare with a linear increase of 1,500 per day. The linear one grows by the same amount every day. The exponential one is multiplied by the same factor and overtakes in the end.",
   "قارن ذلك بزيادة خطية مقدارها 1500 في اليوم. الخطية تزيد بالمقدار نفسه كل يوم، أما الأسية فتُضرب في العامل نفسه، وفي النهاية تتجاوز الخطية."),
  draw:()=>{const P=plot({l:110,r:450,t:90,b:430,x0:0,x1:4,y0:0,y1:8000,gx:1,gy:1000,xs:1,ys:2000,fs:22}),d=[0,1,2,3,4];
   return[A.wipe(),...P.o,A.p(seg(P,1500,500),"o",4.5),A.p(dots(d.map(x=>[P.X(x),P.Y(500+1500*x)])),"o",15),A.p(curve(P,x=>500*2**x,0,4),"b",4.5),A.p(dots(d.map(x=>[P.X(x),P.Y(500*2**x)])),"b",15),
    A.tx(L(t3("linjär","linear","خطية")),630,120,40,"o"),A.tx(L(t3("+ 1 500 varje dag","+ 1,500 every day","يزيد 1500 كل يوم")),630,170,32,"o"),
    A.tx(L(t3("exponentiell","exponential","أسية")),630,270,40,"b"),A.tx(L(t3(`${MUL()} 2 varje dag`,"× 2 every day","يُضرب في 2 كل يوم")),630,320,32,"b"),
    A.tx(L(t3("samma faktor varje steg","the same factor each step","العامل نفسه في كل خطوة")),630,420,28,"g")]}},
 {say:t3("Exponentiell förändring skrivs y = C · aˣ. C är startvärdet, a är förändringsfaktorn och x är antalet steg. Efter 10 dagar: 500 · 2¹⁰ = 512 000 visningar!",
   "Exponential change is written y = C × aˣ. C is the starting value, a is the change factor and x is the number of steps. After 10 days: 500 × 2¹⁰ = 512,000 views!",
   `يُكتب التغيّر الأسي على الصورة ${LRI("y = C × aˣ")}. حيث C قيمة البداية، وa معامل التغيّر، وx عدد الخطوات. بعد 10 أيام: ${LRI("500 × 2¹⁰ = 512000")} مشاهدة!`),
  draw:()=>{const M=MUL();return[A.wipe(),A.tx("y =",300,140,76,"k","end"),A.tx("C",345,140,76,"o"),A.tx(M,392,140,76),A.tx("a",440,140,76,"b"),A.tx("x",478,96,46,"r"),
   A.arrow(340,160,250,230,"o",-20),A.tx(L(t3("startvärde","starting value","قيمة البداية")),210,265,32,"o"),
   A.arrow(440,162,450,232,"b",14),A.tx(L(t3("förändringsfaktor","change factor","معامل التغيّر")),460,270,32,"b"),
   A.arrow(490,82,600,100,"r",-20),A.tx(L(t3("antal steg","number of steps","عدد الخطوات")),660,140,32,"r"),
   ...erow(["y = 500 "+M+" ",["p","2","x"]],400,350,48),A.hl(170,388,460,70),...erow([`500 ${M} `,["p","2","10"],` = ${fmt(512000)}`],400,440,46,"g")]}},
 {say:t3("En ny mobil kostar 8 000 kr och tappar 20 % i värde varje år. Det som finns kvar är 80 %, så förändringsfaktorn är 0,80.",
   "A new phone costs 8,000 kr and loses 20% of its value every year. What is left is 80%, so the change factor is 0.80.",
   "يكلّف هاتف جديد 8000 كرونة ويفقد 20% من قيمته كل سنة. يبقى منه 80%، إذن معامل التغيّر 0.80."),
  draw:()=>{const V=[8000,6400,5120,4096],X=i=>175+i*150;return[A.wipe(),A.tx(L(t3("Mobilens värde (kr)","The phone's value (kr)","قيمة الهاتف (كرونة)")),400,58,40,"b"),
   ...bars(V,X,370,.026,80,"r",V.map((_,i)=>YR(i))),...[0,1,2].flatMap(i=>[A.arrow(X(i)+14,118,X(i+1)-14,118,"o",-14),tl(`${MUL()} ${fx(.8)}`,X(i)+75,100,26,"o")]),
   A.hl(150,428,500,60),A.tx(`100 % − 20 % = 80 % = ${fx(.8)}`.replace(/ %/g,lang==="sv"?" %":"%"),400,470,40,"g")]}},
 {say:t3("Halveringstid är tiden det tar för en mängd att halveras. Koffein har en halveringstid på ungefär 5 timmar: 160 mg blir 80, 40 och sedan 20 mg.",
   "Half-life is the time it takes for an amount to halve. Caffeine has a half-life of about 5 hours: 160 mg becomes 80, then 40, then 20 mg.",
   "عمر النصف هو الزمن الذي تحتاجه كمية حتى تصبح نصفها. عمر النصف للكافيين نحو 5 ساعات: 160 mg تصبح 80 ثم 40 ثم 20 mg."),
  draw:()=>{const P=plot({l:100,r:470,t:90,b:430,x0:0,x1:20,y0:0,y1:160,gx:2.5,gy:20,xs:5,ys:40,xl:"h",yl:"mg"}),pts=[0,5,10,15,20];
   return[A.wipe(),...P.o,A.p(curve(P,x=>160*.5**(x/5),0,20),"b",4.5),...pts.slice(1,4).map(x=>A.p(R.dashed(P.X(x),P.Y(160*.5**(x/5)),P.X(x),P.ax,9),"o",3)),A.p(dots(pts.map(x=>[P.X(x),P.Y(160*.5**(x/5))])),"r",15),
    A.tx(L(t3("Koffein i kroppen","Caffeine in the body","الكافيين في الجسم")),640,90,34,"b"),A.tx(L(t3("halveringstid 5 h","half-life 5 h","عمر النصف 5 ساعات")),640,145,32,"r"),
    ...[0,1,2,3].map(i=>tl(`${i*5} h: ${160/2**i} mg`,640,210+i*50,32,i===3?"g":"k")),A.tx(L(t3(`${MUL()} 0,5 var 5:e timme`,"× 0.5 every 5 hours","يُضرب في 0.5 كل 5 ساعات")),640,430,30,"o")]}},
 {say:t3("Är förändringsfaktorn större än 1 växer det. Är den mellan 0 och 1 minskar det. +3 % ger 1,03 och −20 % ger 0,80.",
   "If the change factor is greater than 1, it grows. If it is between 0 and 1, it shrinks. +3% gives 1.03 and −20% gives 0.80.",
   "إذا كان معامل التغيّر أكبر من 1 فالكمية تنمو، وإذا كان بين 0 و1 فهي تتناقص. ‎+3%‎ تعطي 1.03، و‎−20%‎ تعطي 0.80."),
  draw:()=>{const o=[A.wipe()],C=[220,580];[[x=>2**x,"b",t3("tillväxt","growth","نمو"),"a > 1",[["+3 %",1.03],["+25 %",1.25],[L(t3("fördubbling","doubling","تضاعف")),2]]],
   [x=>2**-x,"r",t3("minskning","decay","تناقص"),"0 < a < 1",[["−20 %",.8],["−3 %",.97],[L(t3("halvering","halving","تنصيف")),.5]]]].forEach(([f,c,nm,cond,ex],i)=>{
   const P=plot({l:C[i]-110,r:C[i]+110,t:110,b:230,x0:0,x1:3,y0:0,y1:8,xs:100,ys:100,nolab:true,nogrid:true});
   o.push(A.tx(L(nm),C[i],70,40,c),...P.o.filter(z=>z.t==="path"),A.p(curve(P,i?x=>8*f(x):x=>f(x),0,3),c,4.5),A.tx(cond,C[i],300,38,c),
    ...ex.map(([a,b],j)=>tl(`${lang==="sv"?a:a.replace(" %","%")}  →  ${b===2||b===.5?(b===2?"2":fx(.5,1)):fx(b)}`,C[i],355+j*45,30)))});return o}}
]};
const ECTX0=[
 {mk:()=>{const N=pick([100,200,300,500]),T=pick([20,30]),n=rint(2,5);return{N,T,n,ans:N*2**n,up:true}},
  q:(N,T,n)=>t3(`En bakteriekultur har ${fmt(N)} bakterier. De fördubblas var ${T}:e minut.`,`A culture has ${fmt(N)} bacteria. They double every ${T} minutes.`,`في مزرعة بكتيرية ${fmt(N)} خلية، ويتضاعف عددها كل ${T} دقيقة.`),
  a:(T,n)=>t3(`Hur många finns efter ${T*n} minuter?`,`How many are there after ${T*n} minutes?`,`كم خلية تصبح بعد ${T*n} دقيقة؟`),u:"",tu:"min"},
 {mk:()=>{const k=pick([5,10,15,20,25]),T=pick([4,5,6]),n=rint(2,4);return{N:k*2**n,T,n,ans:k,up:false}},
  q:(N,T,n)=>t3(`Ett läkemedel har halveringstiden ${T} timmar. Du tar ${N} mg.`,`A medicine has a half-life of ${T} hours. You take ${N} mg.`,`عمر النصف لدواء ${T} ساعات. تتناول ${N} mg منه.`),
  a:(T,n)=>t3(`Hur många mg finns kvar efter ${T*n} timmar?`,`How many mg are left after ${T*n} hours?`,`كم mg يبقى بعد ${T*n} ${T*n<=10?"ساعات":"ساعة"}؟`),u:"mg",tu:"h"}
];
const ECTX2=[
 {t:(C,p,n)=>t3(`En stad har ${fmt(C)} invånare och växer med ${pc(p)} per år.`,`A town has ${fmt(C)} inhabitants and grows by ${p}% per year.`,`في مدينة ${fmt(C)} نسمة، ويزداد عدد سكانها بنسبة ${p}% كل سنة.`),
  a:n=>t3(`Hur många invånare finns efter ${n} år?`,`How many inhabitants are there after ${n} years?`,`كم يصبح عدد السكان بعد ${n===2?"سنتين":n+" سنوات"}؟`),s:1,P:[10,20],C:n=>rint(4,40)*1000,u:""},
 {t:(C,p,n)=>t3(`En bil köps för ${kr(C)} och tappar ${pc(p)} i värde per år.`,`A car is bought for ${kr(C)} and loses ${p}% of its value per year.`,`اشتُريت سيارة بـ ${fmt(C)} كرونة، وتفقد ${p}% من قيمتها كل سنة.`),
  a:n=>t3(`Vad är bilen värd efter ${n} år?`,`What is the car worth after ${n} years?`,`كم تصبح قيمتها بعد ${n===2?"سنتين":n+" سنوات"}؟`),s:-1,P:[10,20],C:n=>rint(10,30)*10000,u:"kr"},
 {t:(C,p,n)=>t3(`Ett konto har ${fmt(C)} följare. Antalet ökar med ${pc(p)} per månad.`,`An account has ${fmt(C)} followers. The number grows by ${p}% per month.`,`لحساب ${fmt(C)} متابع، ويزداد العدد بنسبة ${p}% كل شهر.`),
  a:n=>t3(`Hur många följare finns efter ${n} månader?`,`How many followers are there after ${n} months?`,`كم يصبح عدد المتابعين بعد ${n===2?"شهرين":n+" أشهر"}؟`),s:1,P:[50],C:n=>pick([800,1600,2400,4000]),u:""}
];
LESSONS.push({id:"exp9",subject:"math",grades:"9",kind:"wb",
 title:t3("Exponentiell tillväxt och minskning","Exponential growth and decay","النمو والتناقص الأسّي"),
 icon:ICO(`<path d="M30 155H290" stroke="#1d2433" stroke-width="3"/>${[6,12,24,48,96].map((h,i)=>`<rect x="${42+i*36}" y="${155-h}" width="26" height="${h}" fill="#2257c9" fill-opacity=".2" stroke="#2257c9" stroke-width="2.5"/>`).join("")}<path d="M220 40Q245 125 290 140" stroke="#d63b2f" stroke-width="5" fill="none"/><text direction="ltr" x="110" y="48" ${CV} font-size="34" fill="#e07b00">· 2</text>`),
 steps:EX.steps,mount:wbMount(EX),
 gen(level){const M=MUL(),D=DIVS();
  if(level===0){const C=pick(ECTX0),{N,T,n,ans,up}=C.mk(),vals=[...Array(n+1)].map((_,i)=>up?N*2**i:N/2**i);
   const q=[A.wipe(),A.tx(L(C.q(N,T,n)),400,64,30),A.tx(L(C.a(T,n)),400,112,32,"b"),...(up?[]:[])];
   const X=i=>400+(i-n/2)*Math.min(150,660/n),hmax=170,sc=hmax/Math.max(...vals),base=375;
   q.push(A.p(R.line(60,base,740,base,.3),"k",3.5),A.p(R.rect(X(0)-28,base-vals[0]*sc,56,vals[0]*sc,.2),up?"b":"r",3.5),tl(`${fmt(N)}${C.u?" "+C.u:""}`,X(0),base-vals[0]*sc-12,28,up?"b":"r"),...vals.map((_,i)=>tl(`${T*i} ${C.tu}`,X(i),base+32,26,i===n?"r":"k")));
   const sol=[A.tx(`${T*n} ${D} ${T} = ${n}`,250,168,34,"o"),A.tx(L(up?t3(`${n} fördubblingar`,`${n} doublings`,`عدد مرات التضاعف = ${n}`):t3(`${n} halveringar`,`${n} halvings`,`عدد مرات التنصيف = ${n}`)),560,168,32,"o")],hc=2;
   vals.slice(1).forEach((v,j)=>{const i=j+1,h=v*sc;sol.push(A.p(R.rect(X(i)-28,base-h,56,h,.2),up?"b":"r",3.5),tl(fmt(v),X(i),base-h-12,28,i===n?"g":up?"b":"r"))});
   sol.push(A.hl(190,425,420,62),...erow([`${fmt(N)} ${M} `,["p",up?"2":fx(.5,1),n],` = ${fmt(ans)}`],400,470,42,"g"));
   return{kind:"num",ans,show:`${fmt(ans)}${C.u?" "+C.u:""}`,hc,q,sol}}
  /* level 1: linear or exponential? */
  if(level===1&&Math.random()<.3){const S=pick([160,200,400,800]),ex=Math.random()<.5,a=pick([1.5,2]),d=S*pick([.5,1]),vals=[0,1,2,3].map(i=>ex?S*a**i:S+d*i);
   const O=[t3("Linjär: lika mycket mer varje år","Linear: the same amount more each year","خطي: الزيادة نفسها كل سنة"),t3("Exponentiell: samma faktor varje år","Exponential: the same factor each year","أسّي: المعامل نفسه كل سنة")],ans=ex?1:0;
   const X=i=>160+i*160,q=[A.wipe(),A.tx(L(t3("En samling växer så här, år för år.","A collection grows like this, year by year.","تنمو مجموعة هكذا سنةً بعد سنة.")),400,60,32),
    A.tx(L(pick([t3("Är ökningen linjär eller exponentiell?","Is the growth linear or exponential?","هل الزيادة خطية أم أسّية؟"),t3("Avgör om ökningen är linjär eller exponentiell.","Decide if the growth is linear or exponential.","حدّد هل الزيادة خطية أم أسّية.")])),400,106,30,"b"),
    ...vals.map((v,i)=>tl(L(t3(`år ${i}`,`year ${i}`,`السنة ${i}`)),X(i),190,26,"k")),...vals.map((v,i)=>tl(fmt(v),X(i),250,40,"b"))];
   const sol=[],hc=2;for(let i=0;i<3;i++){const m=(X(i)+X(i+1))/2;sol.push(A.arrow(X(i)+30,290,X(i+1)-30,290,"o",-30),tl(`+${fmt(vals[i+1]-vals[i])}`,m,330,28,"o"),tl(`${(vals[i+1]/vals[i]*100)%1?"≈ ":""}${M} ${fx(vals[i+1]/vals[i],vals[i+1]/vals[i]*100%10?2:1)}`,m,380,28,"r"))}
   sol.push(A.hl(100,410,600,62),A.tx(L(O[ans]),400,452,32,"g"));
   return{kind:"choice",opts:O,ans,show:L(O[ans]),hc,q,sol}}
  if(level===1){const up=Math.random()<.5,p=pick([2,3,4,5,6,8,12,15,25,30,35,40]),a=(100+(up?p:-p))/100,toF=Math.random()<.55;
   const W=380,o=[A.wipe()];
   if(toF)o.push(A.tx(L(up?t3(`Ett pris ökar med ${pc(p)}.`,`A price increases by ${p}%.`,`يزداد سعر بنسبة ${p}%.`):t3(`Ett värde minskar med ${pc(p)}.`,`A value decreases by ${p}%.`,`تنقص قيمة بنسبة ${p}%.`)),400,62,38),
     A.tx(L(pick([t3("Vad är förändringsfaktorn?","What is the change factor?","ما معامل التغيّر؟"),t3("Bestäm förändringsfaktorn.","Find the change factor.","أوجد معامل التغيّر."),t3("Ange förändringsfaktorn i decimalform.","Give the change factor as a decimal.","اكتب معامل التغيّر بصيغة عشرية.")])),400,112,34,"b"));
   else o.push(A.tx(L(t3(`Förändringsfaktorn är ${fx(a)}.`,`The change factor is ${fx(a)}.`,`معامل التغيّر ${fx(a)}`)),400,62,38),
     A.tx(L(up?t3("Med hur många procent ökar värdet?","By what percent does the value increase?","بأي نسبة مئوية تزداد القيمة؟"):t3("Med hur många procent minskar värdet?","By what percent does the value decrease?","بأي نسبة مئوية تنقص القيمة؟")),400,112,36,"b"));
   o.push(bx(150,160,W,56,"k"),A.hatch(`M150,160h${W}v56h-${W}Z`,"b"),tl(pc(100),150+W+16,198,30,"b","start"),tl(L(t3("före","before","قبل")),100,198,28),
    bx(150,250,W*a,56,"k"),A.hatch(`M150,250h${f1(W*a)}v56h-${f1(W*a)}Z`,up?"g":"r"),tl(toF?"?":"",150+Math.max(W*a,W)+16,288,30,"r","start"),tl(L(t3("efter","after","بعد")),100,288,28));
   const tot=100+(up?p:-p),sol=[A.p(R.dashed(150+W,150,150+W,320,9),"k",2.5),tl(`= ${fx(1)}`,150+W+(lang==="sv"?92:78),198,30,"b","start")],hc=2;
   if(toF){sol.push(A.tx(`${pc(100)} ${up?"+":"−"} ${pc(p)} = ${pc(tot)}`,400,380,40),A.hl(260,410,280,64),A.tx(`${pc(tot)} = ${fx(a)}`,400,458,46,"g"));
    return{kind:"num",dec:true,ans:a,show:fx(a),hc,q:o,sol}}
   sol.push(A.tx(`${fx(a)} = ${pc(tot)}`,400,380,40),A.hl(220,410,360,64),A.tx(up?`${pc(tot)} − ${pc(100)} = ${pc(p)}`:`${pc(100)} − ${pc(tot)} = ${pc(p)}`,400,458,44,"g"));
   return{kind:"num",ans:p,show:pc(p),hc,q:o,sol}}
  const C=pick(ECTX2),p=pick(C.P),n=C.P[0]===50?rint(2,3):rint(2,3),Cv=C.C(n),f=100+C.s*p,ans=Cv*f**n/100**n;
  const q=[A.wipe(),A.tx(L(C.t(Cv,p,n)),400,70,30),A.tx(L(C.a(n)),400,122,32,"b"),...erow([`y = C ${M} `,["p","a","x"]],400,230,46)];
  const sol=[A.tx(`a = ${pc(100)} ${C.s>0?"+":"−"} ${pc(p)} = ${pc(f)} = ${fx(f/100)}`,400,300,36,"o")],hc=1;
  sol.push(...erow([`${fmt(Cv)} ${M} `,["p",fx(f/100),n]],400,360,42),A.hl(200,392,400,66),A.tx(`= ${fmt(ans)}${C.u?" "+C.u:""}`,400,442,46,"g"));
  return{kind:"num",ans,show:`${fmt(ans)}${C.u?" "+C.u:""}`,hc,q,sol}}
});

/* =====================================================================
   4. pct9: percent in several steps, chains of change factors, working backwards
   ===================================================================== */
const sgp=p=>(p>0?"+":"−")+pc(Math.abs(p));
/* a chain of boxes joined by arrows: vals (texts), tops (labels over the arrows), y = box centre */
function chain(vals,tops,y,cols){const n=vals.length,X=n===2?[230,570]:[130,400,670],w=n===2?190:170,o=[],ar=[];
 vals.forEach((v,i)=>{o.push(bx(X[i]-w/2,y-40,w,80,cols&&cols[i]||"k",4));if(v!=null&&v!=="")o.push(A.tx(v,X[i],y+14,v==="?"?44:36,cols&&cols[i]||"k"))});
 for(let i=0;i<n-1;i++){const a=X[i]+w/2+8,b=X[i+1]-w/2-8;o.push(A.arrow(a,y-6,b,y-6,"o",-16),tl(tops[i],(a+b)/2,y-44,30,"r"))}
 return{o,X,w,mid:i=>(X[i]+X[i+1])/2}}
const PCT={steps:[
 {say:t3("En jacka kostar 1 000 kr. Priset höjs med 20 % och sänks sedan med 20 %. Är vi tillbaka på 1 000 kr? Nej, den kostar 960 kr!",
   "A jacket costs 1,000 kr. The price goes up by 20% and then down by 20%. Are we back at 1,000 kr? No, it costs 960 kr!",
   "سعر سترة 1000 كرونة. يرتفع السعر 20% ثم ينخفض 20%. هل نعود إلى 1000 كرونة؟ لا، يصبح سعرها 960 كرونة!"),
  draw:()=>{const V=[1000,1200,960],X=[170,400,630],B=400,s=.22,c=["b","o","r"],o=[A.wipe(),A.tx(L(t3("Tillbaka på 1 000 kr?","Back at 1,000 kr?","هل نعود إلى 1000 كرونة؟")),400,58,40)];
   V.forEach((v,i)=>o.push(bx(X[i]-55,B-v*s,110,v*s,c[i],4),A.hatch(`M${X[i]-55},${B}h110v${f1(-v*s)}h-110Z`,c[i]),tl(kr(v),X[i],B-v*s-14,32,c[i])));
   o.push(A.p(R.line(80,B,720,B,.3),"k",3.5),A.p(R.dashed(100,B-1000*s,720,B-1000*s,10),"b",3),
    tl(L(t3("från början","at the start","في البداية")),X[0],B+36,28),tl(sgp(20),X[1],B+36,30,"o"),tl(L(t3(`sedan ${sgp(-20)}`,`then ${sgp(-20)}`,`ثم ${LRI(sgp(-20))}`)),X[2],B+36,30,"r"),
    tl(`+${kr(200)}`,(X[0]+X[1])/2,300,28,"o"),tl(`−${kr(240)}`,(X[1]+X[2])/2,300,28,"r"));return o}},
 {say:t3("Andra gången räknas 20 % på 1 200 kr, inte på 1 000 kr. Med förändringsfaktorer: 1,20 · 0,80 = 0,96. Priset är 96 %, alltså 4 % lägre än från början.",
   "The second time, 20% is taken of 1,200 kr, not of 1,000 kr. With change factors: 1.20 × 0.80 = 0.96. The price is 96%, so 4% lower than at the start.",
   "في المرة الثانية تُحسب 20% من 1200 كرونة لا من 1000. وبمعاملات التغيّر: 1.20 × 0.80 = 0.96. السعر صار 96%، أي أقل بـ 4% مما كان في البداية."),
  draw:()=>{const M=MUL(),C=chain([kr(1000),kr(1200),kr(960)],[sgp(20),sgp(-20)],170,["b","o","r"]);
   return[A.wipe(),...C.o,tl(`${M} ${fx(1.2)}`,C.mid(0),200,30,"o"),tl(`${M} ${fx(.8)}`,C.mid(1),200,30,"r"),
    A.tx(`${kr(1000)} ${M} ${fx(1.2)} ${M} ${fx(.8)} = ${kr(960)}`,400,320,40),A.tx(`${fx(1.2)} ${M} ${fx(.8)} = ${fx(.96)} = ${pc(96)}`,400,385,40,"b"),
    A.hl(200,410,400,64),A.tx(L(t3(`${pc(4)} lägre`,`${pc(4)} lower`,`أقل بـ ${LRI(pc(4))}`)),400,458,46,"g")]}},
 {say:t3("Rea 30 % på skorna och sedan 10 % extra i kassan. Det blir inte 40 %! Faktorerna 0,70 · 0,90 = 0,63, så du betalar 63 %. Rabatten är 37 %.",
   "30% off the trainers, then another 10% off at the till. That is not 40%! The factors 0.70 × 0.90 = 0.63, so you pay 63%. The discount is 37%.",
   "تخفيض 30% على الحذاء الرياضي، ثم 10% إضافية عند الدفع. هذا ليس 40%! المعاملان 0.70 × 0.90 = 0.63، فتدفع 63%، والتخفيض الكلي 37%."),
  draw:()=>{const M=MUL(),C=chain([kr(1200),kr(840),kr(756)],[sgp(-30),sgp(-10)],170,["b","k","g"]);
   return[A.wipe(),...C.o,tl(`${M} ${fx(.7)}`,C.mid(0),200,30,"o"),tl(`${M} ${fx(.9)}`,C.mid(1),200,30,"o"),
    A.tx(`${fx(.7)} ${M} ${fx(.9)} = ${fx(.63)} = ${pc(63)}`,400,330,42,"b"),A.tx(L(t3(`rabatt: ${pc(100)} − ${pc(63)} = ${pc(37)}`,`discount: ${pc(100)} − ${pc(63)} = ${pc(37)}`,`التخفيض: ${LRI(`${pc(100)} − ${pc(63)} = ${pc(37)}`)}`)),400,395,38),
    A.hl(250,415,300,62),A.tx(`${pc(37)} ≠ ${pc(40)}`,400,462,46,"g")]}},
 {say:t3("Ett spel kostar 500 kr inklusive 25 % moms. Priset utan moms är 100 % och momsen är 25 %, totalt 125 %. 125 % är 500 kr, så 100 % är 500 / 1,25 = 400 kr.",
   "A game costs 500 kr including 25% VAT. The price without VAT is 100% and the VAT is 25%, 125% in total. 125% is 500 kr, so 100% is 500 ÷ 1.25 = 400 kr.",
   "تكلّف لعبة 500 كرونة شاملةً ضريبة القيمة المضافة 25%. السعر بدون الضريبة 100% والضريبة 25%، والمجموع 125%. إذن 125% تساوي 500 كرونة، و100% تساوي 500 ÷ 1.25 = 400 كرونة."),
  draw:()=>{const x0=100,u=120,y=175,h=70,o=[A.wipe(),A.tx(L(t3("Pris utan moms?","Price without VAT?","السعر بدون الضريبة؟")),400,58,40)];
   o.push(A.p(R.line(x0,y-34,x0,y-50,.2)+R.line(x0,y-50,x0+5*u,y-50,.3)+R.line(x0+5*u,y-50,x0+5*u,y-34,.2),"k",3),tl(`${kr(500)} = ${pc(125)}`,400,y-62,32));
   for(let i=0;i<5;i++)o.push(bx(x0+i*u,y,u,h,"k",3.5),A.hatch(`M${x0+i*u},${y}h${u}v${h}h-${u}Z`,i<4?"b":"r"),tl(pc(25),x0+i*u+u/2,y+h/2+10,28,i<4?"b":"r"));
   o.push(tl(L(t3(`utan moms ${pc(100)}`,`without VAT ${pc(100)}`,`بدون الضريبة ${LRI(pc(100))}`)),x0+2*u,y+h+40,30,"b"),tl(L(t3("moms","VAT","الضريبة")),x0+4.5*u,y+h+40,30,"r"),
    A.tx(`${pc(25)} = ${kr(500)} ${DIVS()} 5 = ${kr(100)}`,400,350,38),A.hl(160,380,480,66),A.tx(`${kr(500)} ${DIVS()} ${fx(1.25)} = ${kr(400)}`,400,430,48,"g"));return o}},
 {say:t3("Vanligt fel: 500 − 25 % av 500 = 375 kr. Fel, för momsen är 25 % av 400, inte av 500! Räkna baklänges: dela med förändringsfaktorn.",
   "A common mistake: 500 − 25% of 500 = 375 kr. Wrong, because the VAT is 25% of 400, not of 500! Work backwards: divide by the change factor.",
   "خطأ شائع: 500 − 25% من 500 = 375 كرونة. هذا خطأ، لأن الضريبة 25% من 400 لا من 500! احسب بالعكس: اقسم على معامل التغيّر."),
  draw:()=>{const D=DIVS(),C=chain(["?",kr(500)],[L(t3(`moms ${sgp(25)}`,`VAT ${sgp(25)}`,`الضريبة ${LRI(sgp(25))}`))],140,["k","b"]);
   return[A.wipe(),...C.o,tl(`${MUL()} ${fx(1.25)}`,400,170,30,"o"),A.arrow(C.X[1]-30,192,C.X[0]+30,192,"g",-40),tl(`${D} ${fx(1.25)}`,400,262,32,"g"),
    A.tx(`${kr(500)} ${D} ${fx(1.25)} = ${kr(400)}`,400,330,44,"g"),
    A.tx(L(t3(`fel: 500 − ${pc(25)} = ${kr(375)}`,`wrong: 500 − ${pc(25)} = ${kr(375)}`,`خطأ: ${LRI(`500 − ${pc(25)} = ${kr(375)}`)}`)),400,420,38,"r"),
    A.p(R.line(240,404,560,404,.3),"r",4),tl(L(t3(`${pc(25)} av 400 = ${kr(100)}`,`${pc(25)} of 400 = ${kr(100)}`,`${LRI(pc(25))} من ${LRI(`400 = ${kr(100)}`)}`)),400,468,30,"b")]}},
 {say:t3("Kom ihåg: nytt värde = gammalt värde · förändringsfaktor. Baklänges delar vi: gammalt värde = nytt värde / förändringsfaktor. Flera steg: multiplicera faktorerna.",
   "Remember: new value = old value × change factor. Backwards we divide: old value = new value ÷ change factor. Several steps: multiply the factors.",
   "تذكّر: القيمة الجديدة = القيمة القديمة × معامل التغيّر. وبالعكس نقسم: القيمة القديمة = القيمة الجديدة ÷ معامل التغيّر. وفي عدة مراحل نضرب المعاملات."),
  draw:()=>{const M=MUL(),D=DIVS(),C=chain([L(t3("gammalt","old","القديم")),L(t3("nytt","new","الجديد"))],[`${M} ${L(t3("faktor","factor","المعامل"))}`],150,["b","g"]);
   return[A.wipe(),...C.o,A.arrow(C.X[1]-30,202,C.X[0]+30,202,"r",-40),tl(`${D} ${L(t3("faktor","factor","المعامل"))}`,400,282,32,"r"),
    A.tx(L(t3("flera steg:","several steps:","عدة مراحل:")),400,350,34,"b"),A.hl(150,372,500,66),A.tx(`${fx(1.1)} ${M} ${fx(.8)} ${M} ${fx(1.25)} = ${fx(1.1)}`,400,420,44,"g")]}}
]};
const ITM=[t3("jackan","the jacket","السترة"),t3("hörlurarna","the headphones","السماعات"),t3("cykeln","the bike","الدراجة"),t3("spelkonsolen","the games console","جهاز الألعاب"),t3("skorna","the trainers","الحذاء الرياضي")];
LESSONS.push({id:"pct9",subject:"math",grades:"9",kind:"wb",
 title:t3("Procent i flera steg","Percent in several steps","النسبة المئوية على عدة مراحل"),
 icon:ICO(`${[[30,"#2257c9","1000"],[125,"#e07b00","1200"],[220,"#d63b2f","960"]].map(([x,c,t],i)=>`<rect x="${x}" y="${[70,46,78][i]}" width="70" height="${[90,114,82][i]}" fill="${c}" fill-opacity=".18" stroke="${c}" stroke-width="3"/><text direction="ltr" x="${x+35}" y="${[60,36,68][i]}" ${CV} font-size="26" fill="${c}">${t}</text>`).join("")}<path d="M20 160H300" stroke="#1d2433" stroke-width="3"/>`),
 steps:PCT.steps,mount:wbMount(PCT),
 gen(level){const M=MUL(),D=DIVS();
  /* level 1: two discounts, how big is the total discount? */
  if(level===1&&Math.random()<.3){let p1,p2;do{p1=pick([10,20,25,30,40,50]);p2=pick([10,20,25,50])}while((100-p1)*(100-p2)%100);
   const t=(100-p1)*(100-p2)/100,r=100-t,a1=(100-p1)/100,a2=(100-p2)/100;
   const C=chain([pc(100),"","?"],[sgp(-p1),sgp(-p2)],230,["b","k","k"]);
   const q=[A.wipe(),A.tx(L(t3(`Rea ${pc(p1)} på skorna och sedan ${pc(p2)} extra i kassan.`,`Shoes are ${p1}% off, then another ${p2}% off at the till.`,`تخفيض ${p1}% على الحذاء ثم ${p2}% إضافية عند الصندوق.`)),400,58,30),
    A.tx(L(pick([t3("Hur många procent är rabatten totalt?","What is the total discount in percent?","كم النسبة المئوية للتخفيض الكلي؟"),t3("Beräkna den totala rabatten i procent.","Work out the total discount in percent.","احسب التخفيض الكلي بالنسبة المئوية.")])),400,104,32,"b"),...C.o];
   const sol=[tl(`${M} ${fx(a1)}`,C.mid(0),260,30,"o"),tl(`${M} ${fx(a2)}`,C.mid(1),260,30,"o"),A.tx(pc(100-p1),C.X[1],244,34)],hc=2;
   sol.push(A.tx(`${fx(a1)} ${M} ${fx(a2)} = ${fx(t/100,t%10?2:2)} = ${pc(t)}`,400,370,38),A.hl(230,400,340,64),A.tx(`${pc(100)} − ${pc(t)} = ${pc(r)}`,400,448,44,"g"));
   return{kind:"num",ans:r,show:pc(r),hc,q,sol}}
  if(level===0||level===1){let P,p1,p2,v1,v2;const S=level===0?[10,20,25,30,40,50]:[10,15,20,25,30,40,50];
   do{P=level===0?rint(2,20)*100:100;p1=pick(S)*pick([1,-1]);p2=pick(S)*pick([1,-1]);v1=P*(100+p1)/100;v2=v1*(100+p2)/100}while(!Number.isInteger(v1)||!Number.isInteger(v2)||(p1>0&&p2>0&&level===0));
   const it=pick(ITM),l0=level===0;
   const C=chain([l0?kr(P):pc(100),"",l0?"?":"?"],[sgp(p1),sgp(p2)],210,["b","k","k"]);
   const q=[A.wipe(),A.tx(L(l0?pick([t3(`Vad kostar ${it.sv} efter båda ändringarna?`,`What does ${it.en} cost after both changes?`,`كم يصبح سعر ${it.ar} بعد التغييرين؟`),t3(`Beräkna priset på ${it.sv} efter båda ändringarna.`,`Work out the price of ${it.en} after both changes.`,`احسب سعر ${it.ar} بعد التغييرين.`)]):t3("Hur många procent av det första priset är det nya priset?","The new price is what percent of the first price?","النسبة المئوية للسعر الجديد من السعر الأول؟")),400,62,l0?36:34),
    ...(l0?[]:[A.tx(L(t3("Priset ändras två gånger.","The price changes twice.","يتغيّر السعر مرتين.")),400,110,32,"b")]),...C.o];
   const a1=(100+p1)/100,a2=(100+p2)/100,sol=[tl(`${M} ${fx(a1)}`,C.mid(0),240,30,"o"),tl(`${M} ${fx(a2)}`,C.mid(1),240,30,"o")],hc=2;
   if(l0){sol.push(A.tx(kr(v1),C.X[1],224,36),A.tx(`${fmt(P)} ${M} ${fx(a1)} ${M} ${fx(a2)} = ${fmt(v2)}`,400,365,40),A.hl(270,400,260,64),A.tx(kr(v2),400,448,48,"g"));
    return{kind:"num",ans:v2,show:kr(v2),hc,q,sol}}
   const t=v2;sol.push(A.tx(pc(v1),C.X[1],224,34),A.tx(`${fx(a1)} ${M} ${fx(a2)} = ${fx(t/100,t%1?3:2)}`,400,365,42),A.hl(270,400,260,64),A.tx(pc(t),400,448,48,"g"));
   return{kind:"num",ans:t,show:pc(t),hc,q,sol}}
  const kind=pick(["vat","vat","sale","rise"]);let P0,p;
  if(kind==="vat"){p=pick([25,25,12,6]);do{P0=rint(4,80)*10}while(P0*(100+p)%100)}
  else if(kind==="sale"){p=pick([10,20,25,30,40,50]);do{P0=rint(10,120)*10}while(P0*(100-p)%100)}
  else{p=pick([5,10,15,20,25]);do{P0=rint(10,150)*10}while(P0*(100+p)%100)}
  const s=kind==="sale"?-1:1,P1=P0*(100+s*p)/100,a=(100+s*p)/100,it=pick(ITM);
  const lab=kind==="vat"?L(t3(`moms ${sgp(p)}`,`VAT ${sgp(p)}`,`الضريبة ${LRI(sgp(p))}`)):kind==="sale"?L(t3(`rea ${sgp(-p)}`,`sale ${sgp(-p)}`,`تخفيض ${LRI(sgp(-p))}`)):sgp(p);
  const Q=kind==="vat"?pick([t3("Vad är priset utan moms?","What is the price without VAT?","ما السعر بدون الضريبة؟"),t3("Beräkna priset utan moms.","Work out the price without VAT.","احسب السعر بدون الضريبة.")]):kind==="sale"?t3("Vad var det ordinarie priset?","What was the normal price?","ما السعر الأصلي قبل التخفيض؟"):t3("Vad var priset före höjningen?","What was the price before the rise?","كم كان السعر قبل الزيادة؟");
  const U=kind==="vat"?[t3("utan moms","without VAT","بدون الضريبة"),t3("med moms","with VAT","مع الضريبة")]:kind==="sale"?[t3("ordinarie pris","normal price","السعر الأصلي"),t3("reapris","sale price","سعر التخفيض")]:[t3("före","before","قبل"),t3("efter","after","بعد")];
  const C=chain(["?",kr(P1)],[lab],200,["k","b"]);
  const q=[A.wipe(),A.tx(L(Q),400,66,38),...C.o,tl(L(U[0]),C.X[0],138,28),tl(L(U[1]),C.X[1],138,28,"b")];
  const sol=[tl(`${M} ${fx(a)}`,400,230,30,"o"),A.arrow(C.X[1]-30,252,C.X[0]+30,252,"g",-40),tl(`${D} ${fx(a)}`,400,330,32,"g")],hc=3;
  sol.push(A.tx(`${fmt(P1)} ${D} ${fx(a)} = ${fmt(P0)}`,400,395,42),A.hl(270,412,260,64),A.tx(kr(P0),400,460,48,"g"));
  return{kind:"num",ans:P0,show:kr(P0),hc,q,sol}}
});

Object.assign(HELPX,{
 exp9:[{say:t3("Du berättar en hemlighet för 2 kompisar. Var och en berättar för 2 nya, och så vidare. 1, 2, 4, 8, 16: antalet fördubblas i varje steg.",
   "You tell a secret to 2 friends. Each of them tells 2 new people, and so on. 1, 2, 4, 8, 16: the number doubles at every step.",
   "تخبر صديقين بسرّ، ثم يخبر كل واحد منهما شخصين جديدين، وهكذا. 1 ثم 2 ثم 4 ثم 8 ثم 16: يتضاعف العدد في كل خطوة."),
  draw:()=>{const o=[],Y=i=>70+i*80,X=(i,j)=>400+(j-(2**i-1)/2)*(i<4?680/2**i:44);let ln="";
   for(let i=1;i<5;i++)for(let j=0;j<2**i;j++)ln+=R.line(X(i-1,j>>1),Y(i-1)+10,X(i,j),Y(i)-10,.2);
   o.push(A.p(ln,"#9aa8c4",2.5));for(let i=0;i<5;i++){o.push(A.p(dots([...Array(2**i)].map((_,j)=>[X(i,j),Y(i)])),i===4?"g":"b",i===4?20:22),tl(2**i,40,Y(i)+9,30,"o"))}
   o.push(A.hl(190,412,420,62),A.tx(`1 → 2 → 4 → 8 → 16`,400,456,44,"g"));return o}}],
 pct9:[{say:t3("100 kr blir 150 kr när priset höjs med 50 %. Sänks det sedan med 50 % blir det 75 kr, för 50 % av 150 kr är 75 kr. Procenten räknas på olika belopp!",
   "100 kr becomes 150 kr when the price goes up by 50%. If it then goes down by 50% it becomes 75 kr, because 50% of 150 kr is 75 kr. The percent is taken of different amounts!",
   "تصبح 100 كرونة 150 كرونة إذا ارتفع السعر 50%. وإذا انخفض بعدها 50% يصبح 75 كرونة، لأن 50% من 150 تساوي 75. النسبة تُحسب من مبالغ مختلفة!"),
  draw:()=>{const V=[100,150,75],X=[170,400,630],B=370,s=1.6,c=["b","o","r"],o=[];
   V.forEach((v,i)=>o.push(bx(X[i]-60,B-v*s,120,v*s,c[i],4),A.hatch(`M${X[i]-60},${B}h120v${f1(-v*s)}h-120Z`,c[i]),tl(kr(v),X[i],B-v*s-14,34,c[i])));
   o.push(A.p(R.line(80,B,720,B,.3),"k",3.5),tl(sgp(50),(X[0]+X[1])/2,200,32,"o"),tl(sgp(-50),(X[1]+X[2])/2,200,32,"r"),
    A.tx(L(t3(`${pc(50)} av 150 = 75`,`${pc(50)} of 150 = 75`,`${LRI(pc(50))} من ${LRI("150 = 75")}`)),400,430,40,"g"));return o}}],
 nonlin9:[{say:t3("Du lägger en kvadratisk uteplats med plattor. Sidan 2 plattor kräver 4 plattor, sidan 3 kräver 9 och sidan 4 kräver 16. Antalet är sidan gånger sidan: x².",
   "You lay a square patio with tiles. Side 2 tiles needs 4 tiles, side 3 needs 9 and side 4 needs 16. The number is side times side: x².",
   "تبني فناءً مربعًا من البلاط. ضلع من بلاطتين يحتاج 4 بلاطات، وضلع من 3 يحتاج 9، وضلع من 4 يحتاج 16. العدد هو الضلع في الضلع: x²."),
  draw:()=>{const u=44,B=360,o=[];[[2,90,"g"],[3,260,"b"],[4,480,"r"]].forEach(([n,x,c])=>{o.push(...gridRect(x,B-n*u,n,n,u,c),A.hatch(`M${x},${B}h${n*u}v${-n*u}h${-n*u}Z`,c),tl(`${n} ${MUL()} ${n} = ${n*n}`,x+n*u/2,B+50,32,c))});
   o.push(A.hl(250,410,300,66),A.tx("y = x²",400,460,50,"g"));return o}},
  {say:t3("En pizza har 8 bitar. Äter du ensam får du 8 bitar. Är ni 2 får ni 4 var, och är ni 4 får ni bara 2 var. Fler personer, färre bitar.",
   "A pizza has 8 slices. If you eat alone you get 8 slices. With 2 people you get 4 each, and with 4 people only 2 each. More people, fewer slices.",
   "في البيتزا 8 قطع. إذا أكلت وحدك تأخذ 8 قطع، وإذا كنتما اثنين يأخذ كل واحد 4، وإذا كنتم أربعة يأخذ كل واحد قطعتين فقط. أشخاص أكثر، قطع أقل."),
  draw:()=>{const o=[],C=[150,400,650],sh=(cx,k)=>Array.from({length:k},(_,i)=>R.wedge(cx,200,105,8,i)).join("");
   [[1,8],[2,4],[4,2]].forEach(([p,s],i)=>o.push(pieLines(C[i],200,105,8),A.hatch(sh(C[i],s),"o"),
    tl(L(p===1?t3("1 person","1 person","شخص واحد"):t3(`${p} personer`,`${p} people`,p===2?"شخصان":`${p} أشخاص`)),C[i],360,30,"b"),tl(L(t3(`${s} bitar var`,`${s} slices each`,s===2?"قطعتان لكل واحد":`${s} قطع لكل واحد`)),C[i],405,30,"o")));
   o.push(A.tx(`x ${MUL()} y = 8`,400,470,44,"g"));return o}}],
 line9:[{say:t3("Taxin kostar 40 kr när du sätter dig och sedan 10 kr för varje km. 40 är startvärdet m och 10 är lutningen k: y = 10x + 40.",
   "The taxi costs 40 kr when you get in and then 10 kr for every km. 40 is the starting value m and 10 is the slope k: y = 10x + 40.",
   `تكلّف سيارة الأجرة 40 كرونة عند الركوب، ثم 10 كرونات لكل كيلومتر. العدد 40 هو قيمة البداية m، والعدد 10 هو الميل k: ${LRI("y = 10x + 40")}.`),
  draw:()=>{const X=i=>130+i*135,o=[];
   o.push(A.p(R.rect(70,72,140,46,.3)+R.line(100,72,118,46,.2)+R.line(118,46,170,46,.2)+R.line(170,46,186,72,.2)+R.circ(105,124,13)+R.circ(176,124,13),"o",4),tl("TAXI",140,104,24,"o"));
   o.push(A.p(R.line(80,300,720,300,.3),"k",4));
   [0,1,2,3,4].forEach(i=>{o.push(A.p(R.line(X(i),290,X(i),310,.2),"k",3.5),tl(`${i} km`,X(i),342,26),A.tx(`${40+10*i} kr`,X(i),255,34,i?"b":"g"))});
   [0,1,2,3].forEach(i=>o.push(A.arrow(X(i)+20,212,X(i+1)-20,212,"o",-18),tl("+10",(X(i)+X(i+1))/2,180,26,"o")));
   o.push(A.tx(L(t3("start: m = 40","start: m = 40","البداية: m = 40")),X(0)+40,410,30,"g"),A.tx(L(t3("per km: k = 10","per km: k = 10","لكل كم: k = 10")),X(3)-20,410,30,"o"),
    A.hl(250,428,300,62),A.tx("y = 10x + 40",400,474,46,"g"));return o}}]
});
Object.assign(HINTSX,{
 exp9:[{say:t3("Räkna först hur många fördubblingar eller halveringar det blir: dela hela tiden med tiden för ett steg.","First count how many doublings or halvings there are: divide the whole time by the time for one step.","احسب أولًا عدد مرات التضاعف أو التنصيف: اقسم الزمن كله على زمن الخطوة الواحدة."),cut:g=>g.sol.slice(0,g.hc)},
  {say:t3("Faktorn 1 betyder 100 %. Över 1 är en ökning och under 1 är en minskning. Linjär: samma tillskott varje steg. Exponentiell: samma faktor varje steg.","A factor of 1 means 100%. Above 1 is an increase and below 1 is a decrease. Linear: the same amount added each step. Exponential: the same factor each step.","المعامل 1 يعني 100%. ما فوق 1 زيادة، وما دون 1 نقصان. خطي: الزيادة نفسها في كل خطوة. أسّي: المعامل نفسه في كل خطوة."),cut:g=>g.sol.slice(0,g.hc)},
  {say:t3("Skriv förändringsfaktorn som decimaltal. Multiplicera startvärdet med faktorn en gång för varje år eller månad.","Write the change factor as a decimal. Multiply the starting value by the factor once for every year or month.","اكتب معامل التغيّر عددًا عشريًا، ثم اضرب قيمة البداية في المعامل مرة عن كل سنة أو شهر."),cut:g=>g.sol.slice(0,g.hc)}],
 pct9:[{say:t3("Gör om varje procentändring till en förändringsfaktor. Multiplicera priset med faktorerna i tur och ordning.","Turn each percent change into a change factor. Multiply the price by the factors one after the other.","حوّل كل تغيّر بالنسبة المئوية إلى معامل تغيّر، ثم اضرب السعر في المعاملات بالترتيب."),cut:g=>g.sol.slice(0,g.hc)},
  {say:t3("Multiplicera de två förändringsfaktorerna. Skriv produkten i procent. Rabatten totalt är 100 % minus det du betalar.","Multiply the two change factors. Write the product as a percent. The total discount is 100% minus what you pay.","اضرب معاملي التغيّر، ثم اكتب الناتج نسبةً مئوية. التخفيض الكلي هو 100% ناقص ما تدفعه."),cut:g=>g.sol.slice(0,g.hc)},
  {say:t3("Räkna baklänges: dela det nya priset med förändringsfaktorn. Dra inte bara av procenten!","Work backwards: divide the new price by the change factor. Don't just subtract the percent!","احسب بالعكس: اقسم السعر الجديد على معامل التغيّر، ولا تطرح النسبة فقط!"),cut:g=>g.sol.slice(0,g.hc)}],
 nonlin9:[{say:t3("Sätt in x i formeln. Räkna kvadraten först: (−3)² = (−3) · (−3) = 9. Blir sidan n gånger så lång blir arean n · n gånger så stor.","Put x into the formula. Work out the square first: (−3)² = (−3) × (−3) = 9. If the side becomes n times as long, the area becomes n × n times as big.","عوّض x في الصيغة، واحسب المربع أولًا: (−3)² = (−3) × (−3) = 9. إذا أصبح الضلع أطول n مرات تصبح المساحة أكبر n × n مرة."),cut:g=>g.sol.slice(0,g.hc)},
  {say:t3("När den ena storheten ökar minskar den andra, och x · y är lika stort hela tiden. Räkna ut produkten först.","When one quantity grows the other shrinks, and x × y stays the same. Work out the product first.","عندما يزيد أحد المقدارين ينقص الآخر، ويبقى x × y ثابتًا. احسب حاصل الضرب أولًا."),cut:g=>g.sol.slice(0,g.hc)},
  {say:t3("Alla formlerna ger samma y när x = 1. Testa dem med x = 2 i stället.","All the formulas give the same y when x = 1. Test them with x = 2 instead.","كل الصيغ تعطي قيمة y نفسها عندما x = 1. جرّبها عندما x = 2."),cut:g=>g.sol.slice(0,g.hc)}],
 line9:[{say:t3("Gå från A till B: hur många steg åt höger och hur många upp eller ner? k = Δy / Δx.","Go from A to B: how many steps right, and how many up or down? k = Δy ÷ Δx.","انتقل من A إلى B: كم خطوة إلى اليمين، وكم خطوة إلى الأعلى أو الأسفل؟ k = Δy ÷ Δx."),cut:g=>g.sol.slice(0,g.hc)},
  {say:t3("Punkten ligger på linjen. Sätt in dess x och y i y = kx + m och lös ut m. Ligger punkten på linjen? Sätt in x och se om du får samma y.","The point lies on the line. Put its x and y into y = kx + m and solve for m. Is the point on the line? Put in x and see if you get the same y.","النقطة تقع على الخط. عوّض قيمتي x وy في y = kx + m ثم أوجد m. هل النقطة على المستقيم؟ عوّض x وانظر هل تحصل على y نفسها."),cut:g=>g.sol.slice(0,g.hc)},
  {say:t3("Räkna först ut k = Δy / Δx. Sätt sedan in en av punkterna för att få m.","First work out k = Δy ÷ Δx. Then put in one of the points to get m.","احسب أولًا k = Δy ÷ Δx، ثم عوّض إحدى النقطتين لتحصل على m."),cut:g=>g.sol.slice(0,g.hc)}]
});
}
