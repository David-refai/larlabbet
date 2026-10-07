import {A,DIVS,HELPX,HINTSX,L,LESSONS,MUL,R,dfmt,dots,f1,fmt,lang,pick,plines,qt,rint,shuffle,t3,wbMount} from "../legacy/core.js";
/* =====================================================================
   YEAR 7 (y7d): proportionality, charts, two dice and the sample space,
   programming with variables, conditions and loops
   ===================================================================== */
{
const LRI=s=>"⁦"+s+"⁩";                    /* keeps formulas in order inside Arabic speech */
const ICO=b=>`<svg viewBox="0 0 320 180"><rect width="320" height="180" fill="#fff"/>${b}</svg>`;
const CV=`font-family="Caveat,cursive" font-weight="700" text-anchor="middle" direction="ltr"`;
const qe=(s,x,y,size=26,c="k",a="middle")=>Object.assign(A.tx(s,x,y,size,c,a),{dur:Math.min(700,Math.max(170,String(s).length*45))});
const nf=x=>{x=Math.round(x*100)/100;return Number.isInteger(x)?fmt(x):dfmt(x,Math.abs(Math.round(x*10)-x*10)<1e-6?1:2)};
const pc=p=>lang==="sv"?`${p} %`:`${p}%`;
const GC="#cbd5e6";
/* text on a yellow highlighter strip */
const hlT=(s,x,y,size,c="g")=>{const w=String(s).length*size*.42+36;return[A.hl(x-w/2,y-size*.9,w,size*1.22),A.tx(s,x,y,size,c)]};
const wrap=(s,n)=>{const o=[];let cur="";for(const w of s.split(" ")){if(cur&&(cur+" "+w).length>n){o.push(cur);cur=w}else cur=cur?cur+" "+w:w}if(cur)o.push(cur);return o};
const txLines=(arr,x,y,gap,size,c="k")=>arr.map((s,i)=>A.tx(s,x,y+i*(gap+(lang==="ar"?6:0)),size,c));

/* coordinate axes with a pale grid */
function axes(x0,y0,ux,uy,xmax,ymax,xs,ys,xl,yl){const X=v=>x0+v*ux,Y=v=>y0-v*uy;let g="";
 for(let v=xs;v<=xmax+1e-9;v+=xs)g+=R.line(X(v),y0,X(v),Y(ymax),.15);
 for(let v=ys;v<=ymax+1e-9;v+=ys)g+=R.line(x0,Y(v),X(xmax),Y(v),.15);
 const o=[A.p(g,GC,2),A.p(R.arrow(x0,y0,X(xmax)+32,y0)+R.arrow(x0,y0,x0,Y(ymax)-32),"k",3.5),qe("0",x0-14,y0+28,24)];
 for(let v=xs;v<=xmax+1e-9;v+=xs)o.push(qe(nf(v),X(v),y0+32,24));
 for(let v=ys;v<=ymax+1e-9;v+=ys)o.push(qe(nf(v),x0-12,Y(v)+8,24,"k","end"));
 if(xl)o.push(qe(xl,X(xmax)+44,y0-14,32,"o"));if(yl)o.push(qe(yl,x0,Y(ymax)-46,32,"b"));
 return{o,X,Y}}

/* ---------------------------------------------------------------
   1. prop7: proportionality
   --------------------------------------------------------------- */
const PT={x0:85,lw:190,cw:110};
const pcx=j=>PT.x0+PT.lw+PT.cw*j+PT.cw/2;
/* table with a label column; rows: {lab, vals, c, vs} */
function ptab(y0,rh,rows,vs=36){const n=rows[0].vals.length,W=PT.lw+n*PT.cw,H=rows.length*rh,x0=PT.x0;let d=R.rect(x0,y0,W,H,.3);
 for(let r=1;r<rows.length;r++)d+=R.line(x0,y0+r*rh,x0+W,y0+r*rh,.2);
 for(let j=0;j<n;j++)d+=R.line(x0+PT.lw+j*PT.cw,y0,x0+PT.lw+j*PT.cw,y0+H,.2);
 const o=[];rows.forEach((r,i)=>o.push(A.band(x0+4,y0+i*rh+4,PT.lw-8,rh-8,r.c)));o.push(A.p(d,"k",3.5));
 rows.forEach((r,i)=>{const yy=y0+i*rh+rh*.66;o.push(qe(L(r.lab),x0+PT.lw/2,yy-2,r.ls||28,r.c));
  r.vals.forEach((v,j)=>{if(v!==""&&v!=null)o.push(qe(v,pcx(j),yy,r.vs||vs,v==="?"?"r":"k"))})});
 return o}
const TXL=t3("tid x (h)","time x (h)","الزمن x (ساعة)"),TYL=t3("lön y (kr)","pay y (kr)","الأجر y (كرونة)");
const PROP={steps:[
 {say:t3("Ali har sommarjobb och tjänar 120 kr i timmen. Jobbar han dubbelt så länge får han dubbelt så mycket. Lönen är proportionell mot tiden.",
   "Ali has a summer job and earns 120 kr an hour. If he works twice as long, he gets twice as much. The pay is proportional to the time.",
   "لدى علي عمل صيفي يكسب منه 120 كرونة في الساعة. إذا عمل ضعف الوقت حصل على ضعف الأجر. الأجر يتناسب طرديًا مع الزمن."),
  draw:()=>{const M=MUL();return[A.wipe(),A.tx(L(t3("Sommarjobb: 120 kr per timme","Summer job: 120 kr an hour","عمل صيفي: 120 كرونة في الساعة")),400,62,40,"b"),
   ...ptab(150,70,[{lab:TXL,vals:["1","2","3","4"],c:"o"},{lab:TYL,vals:["120","240","360","480"],c:"b"}],38),
   A.arrow(pcx(0)+8,140,pcx(1)-8,140,"g",-22),qe(`${M} 2`,(pcx(0)+pcx(1))/2,112,30,"g"),
   A.arrow(pcx(1)+8,140,pcx(3)-8,140,"g",-30),qe(`${M} 2`,(pcx(1)+pcx(3))/2,108,30,"g"),
   A.arrow(pcx(0)+8,300,pcx(1)-8,300,"g",22),qe(`${M} 2`,(pcx(0)+pcx(1))/2,350,30,"g"),
   A.arrow(pcx(1)+8,300,pcx(3)-8,300,"g",30),qe(`${M} 2`,(pcx(1)+pcx(3))/2,356,30,"g"),
   A.tx(L(t3("Dubbelt så lång tid ger dubbelt så hög lön.","Twice the time gives twice the pay.","ضعف الوقت يعطي ضعف الأجر.")),400,435,34,"g")]}},
 {say:t3("Dela lönen med tiden i varje kolumn. Det blir 120 varje gång. Kvoten är konstant och kallas proportionalitetskonstanten k.",
   "Divide the pay by the time in each column. It is 120 every time. The ratio is constant and is called the constant of proportionality, k.",
   "نقسم الأجر على الزمن في كل عمود، فنحصل على 120 في كل مرة. هذا الناتج ثابت ويسمّى ثابت التناسب k."),
  draw:()=>{const D=DIVS(),xs=[1,2,3,4];return[A.wipe(),A.tx(L(t3("Dela y med x","Divide y by x","نقسم y على x")),400,58,40,"b"),
   ...ptab(90,62,[{lab:TXL,vals:xs.map(String),c:"o"},{lab:TYL,vals:xs.map(x=>String(120*x)),c:"b"},{lab:`y ${D} x`,vals:xs.map(x=>`${120*x} ${D} ${x}`),c:"g",vs:28,ls:32}],36),
   ...xs.map((x,j)=>qe("= 120",pcx(j),326,32,"g")),...hlT("k = 120",400,412,56),
   qe(L(t3("proportionalitetskonstanten","the constant of proportionality","ثابت التناسب")),400,470,30,"b")]}},
 {say:t3("Vi ritar tabellen som punkter i ett koordinatsystem. Punkterna hamnar på en rät linje som går genom origo. Så ser proportionalitet alltid ut.",
   "We plot the table as points in a coordinate system. The points lie on a straight line through the origin. That is what proportionality always looks like.",
   "نرسم الجدول نقاطًا في نظام إحداثيات. تقع النقاط على خط مستقيم يمر بنقطة الأصل. هكذا يبدو التناسب الطردي دائمًا."),
  draw:()=>{const G=axes(90,430,80,.5,5,600,1,120,"x (h)","y (kr)");return[A.wipe(),...G.o,
   A.p(R.line(G.X(0),G.Y(0),G.X(5),G.Y(600),.3),"b",4.5),A.p(dots([1,2,3,4].map(x=>[G.X(x),G.Y(120*x)])),"r",16),A.p(dots([[G.X(0),G.Y(0)]]),"g",20),
   A.tx(L(t3("en rät linje","a straight line","خط مستقيم")),660,160,36,"b"),A.tx(L(t3("genom origo","through the origin","يمر بنقطة الأصل")),660,212,36,"g")]}},
 {say:t3("Formeln är y = 120 · x. Konstanten k = 120 visar hur mycket y ökar när x ökar med 1. Ju större k, desto brantare linje.",
   "The formula is y = 120 × x. The constant k = 120 shows how much y increases when x increases by 1. The bigger k is, the steeper the line.",
   `الصيغة هي ${LRI("y = 120 × x")}. الثابت ${LRI("k = 120")} يبيّن مقدار زيادة y عندما تزيد x بمقدار 1. كلما كبر k صار المستقيم أشد انحدارًا.`),
  draw:()=>{const X=v=>90+v*80,Y=v=>430-v*.5;return[A.p(R.dashed(X(2),Y(240),X(3),Y(240),9),"o",4),A.arrow(X(3),Y(240),X(3),Y(360)+4,"g"),
   qe("+1",X(2.5),Y(240)+32,28,"o"),qe("+120",X(3)+46,Y(300)+10,28,"g"),
   A.tx(`y = 120 ${MUL()} x`,660,320,44),...hlT("k = 120",660,400,46)]}},
 {say:t3("Två mobilabonnemang. A kostar 20 kr per GB, och linjen går genom origo: proportionellt. B har en fast avgift på 60 kr, så linjen börjar på 60. B är inte proportionellt.",
   "Two phone plans. A costs 20 kr per GB, and its line goes through the origin: proportional. B has a fixed fee of 60 kr, so its line starts at 60. B is not proportional.",
   "باقتان للهاتف المحمول. الباقة A تكلّف 20 كرونة لكل GB، وخطها يمر بنقطة الأصل، فهي تناسب طردي. أما الباقة B فلها رسم ثابت قدره 60 كرونة، فيبدأ خطها عند 60، وهي ليست تناسبًا طرديًا."),
  draw:()=>{const G=axes(80,430,45,1.5,8,200,1,40,"x (GB)","y (kr)"),M=MUL();return[A.wipe(),...G.o,
   A.p(R.line(G.X(0),G.Y(0),G.X(8),G.Y(160),.3),"g",5),A.p(R.line(G.X(0),G.Y(60),G.X(8),G.Y(140),.3),"r",5),
   A.p(dots([[G.X(0),G.Y(0)]]),"g",20),A.p(dots([[G.X(0),G.Y(60)]]),"r",20),qe("A",G.X(8)+22,G.Y(160)+2,32,"g"),qe("B",G.X(8)+22,G.Y(140)+22,32,"r"),
   A.tx(L(t3("A: 20 kr/GB","A: 20 kr/GB","الباقة A: \u200f20 كرونة لكل GB")),640,120,lang==="ar"?28:32,"g"),A.tx(`y = 20 ${M} x`,640,166,34,"g"),A.tx(L(t3("proportionellt","proportional","تناسب طردي")),640,210,30,"g"),
   A.tx(L(t3("B: 60 kr + 10 kr/GB","B: 60 kr + 10 kr/GB","الباقة B: \u200f60 + 10 لكل GB")),640,290,lang==="ar"?28:30,"r"),A.tx(`y = 10 ${M} x + 60`,640,336,34,"r"),A.tx(L(t3("inte proportionellt","not proportional","ليست تناسبًا طرديًا")),640,380,30,"r")]}},
 {say:t3("Med formeln kan vi räkna åt båda hållen. 7,5 timmar ger 120 · 7,5 = 900 kr. För att tjäna 1 500 kr behöver Ali jobba 1 500 / 120 = 12,5 timmar.",
   "With the formula we can work in both directions. 7.5 hours gives 120 × 7.5 = 900 kr. To earn 1,500 kr, Ali needs to work 1,500 ÷ 120 = 12.5 hours.",
   "بالصيغة نستطيع الحساب في الاتجاهين. 7.5 ساعة تعطي 120 × 7.5 = 900 كرونة. ولكي يكسب علي 1500 كرونة يحتاج إلى العمل 1500 ÷ 120 = 12.5 ساعة."),
  draw:()=>{const M=MUL(),D=DIVS();return[A.wipe(),A.tx(`y = 120 ${M} x`,400,72,54,"b"),A.loop(400,54,150,40,"b"),
   A.p(R.dashed(400,135,400,370),"k",2.5),
   A.tx(L(t3(`Lön för ${dfmt(7.5)} h?`,`Pay for ${dfmt(7.5)} h?`,`الأجر مقابل ${dfmt(7.5)} ساعة؟`)),210,165,32,"o"),A.tx(`y = 120 ${M} ${dfmt(7.5)}`,210,248,40),...hlT("y = 900 kr",210,332,44),
   A.tx(L(t3(`Tid för ${fmt(1500)} kr?`,`Time for ${fmt(1500)} kr?`,`الوقت اللازم لكسب ${fmt(1500)} كرونة؟`)),590,165,32,"o"),A.tx(`x = ${fmt(1500)} ${D} 120`,590,248,40),...hlT(`x = ${dfmt(12.5)} h`,590,332,44),
   A.tx(L(t3("Gånger k åt ena hållet, delat med k åt andra.","Multiply by k one way, divide by k the other way.","نضرب في k في اتجاه، ونقسم على k في الاتجاه الآخر.")),400,440,30,"b")]}}
]};
const PCTX=[
 {k:[15,20,25,30,35],xs:[1,2,3,4,5,6,8],t:t3("Äpplen på torget","Apples at the market","التفاح في السوق"),xl:t3("vikt x (kg)","weight x (kg)","الوزن x (كغ)"),yl:t3("pris y (kr)","price y (kr)","السعر y (كرونة)")},
 {k:[2,3,4],xs:[5,10,15,20,25,30,40],t:t3("Hyra en elsparkcykel","Renting an e-scooter","استئجار سكوتر كهربائي"),xl:t3("tid x (min)","time x (min)","الزمن x (دقيقة)"),yl:t3("pris y (kr)","price y (kr)","السعر y (كرونة)")},
 {k:[90,100,110,120,130],xs:[1,2,3,4,5,6,8],t:t3("Sommarjobb","Summer job","عمل صيفي"),xl:TXL,yl:TYL},
 {k:[2,3],xs:[1,2,3,4,5,6,8,10],t:t3("Streama video i HD","Streaming HD video","مشاهدة فيديو عالي الدقة"),xl:t3("tid x (h)","time x (h)","الزمن x (ساعة)"),yl:t3("data y (GB)","data y (GB)","البيانات y (GB)")},
 {k:[60,70,80,90],xs:[1,2,3,4,5,6],t:t3("Bilresa med jämn fart","Car trip at a steady speed","رحلة بالسيارة بسرعة ثابتة"),xl:t3("tid x (h)","time x (h)","الزمن x (ساعة)"),yl:t3("sträcka y (km)","distance y (km)","المسافة y (كم)")}];
/* graph levels: [k, y step]; the point is read where k·x lands on a grid line */
const PK=[[.5,1],[1.5,2],[2,2],[2.5,5],[3,5],[4,5],[5,10],[6,10],[8,10],[12,20],[15,20],[25,50]];
const P2=[
 {k:[17.5,18.5,19,19.5,20.5],a:[2,4,6,8,10],c:[5,12,15,25,30,40],u:t3(["liter","kr"],["litres","kr"],["لتر","كرونة"]),un:t3("kr","kr","كرونة"),
  q:(a,b,c)=>t3([`${a} liter bensin kostar ${b} kr.`,`Vad kostar ${c} liter?`],[`${a} litres of petrol cost ${b} kr.`,`How much do ${c} litres cost?`],[`ثمن ${a} لتر من البنزين ${b} كرونة.`,`كم ثمن ${c} لتر؟`])},
 {k:[95,105,115,125,135],a:[2,3,4,5,6],c:[7,8,9,10,12,15],u:t3(["timmar","kr"],["hours","kr"],["ساعة","كرونة"]),un:t3("kr","kr","كرونة"),
  q:(a,b,c)=>t3([`För ${a} timmars jobb får Mira ${b} kr.`,`Hur mycket får hon för ${c} timmar?`],[`Mira earns ${b} kr for ${a} hours of work.`,`How much does she earn for ${c} hours?`],[`تحصل ميرا على ${b} كرونة مقابل عمل ${a} ساعة.`,`كم تحصل مقابل عمل ${c} ساعة؟`])},
 {k:[2.5,3,3.5,4],a:[4,6,8,10,12],c:[15,20,25,30,45],u:t3(["minuter","kr"],["minutes","kr"],["دقيقة","كرونة"]),un:t3("kr","kr","كرونة"),
  q:(a,b,c)=>t3([`En tur på ${a} minuter med elsparkcykel kostar ${b} kr.`,`Vad kostar ${c} minuter?`],[`A ${a}-minute e-scooter ride costs ${b} kr.`,`How much do ${c} minutes cost?`],[`رحلة مدتها ${a} دقيقة على سكوتر كهربائي تكلّف ${b} كرونة.`,`كم تكلّف رحلة مدتها ${c} دقيقة؟`])},
 {k:[1.5,2,2.5],a:[4,6,8],c:[3,5,10,12,15,20],u:t3(["personer","dl"],["people","dl"],["شخص","ديسيلتر"]),un:t3("dl","dl","ديسيلتر"),
  q:(a,b,c)=>t3([`Pannkakor till ${a} personer behöver ${b} dl mjölk.`,`Hur mycket mjölk behövs till ${c} personer?`],[`Pancakes for ${a} people need ${b} dl of milk.`,`How much milk is needed for ${c} people?`],[`فطائر لعدد ${a} من الأشخاص تحتاج إلى ${b} ديسيلتر من الحليب.`,`كم ديسيلتر من الحليب نحتاج لعدد ${c} من الأشخاص؟`])}];
LESSONS.push({id:"prop7",subject:"math",grades:"7",kind:"wb",
 title:t3("Proportionalitet","Proportionality","التناسب الطردي"),
 icon:ICO(`<path d="M50 150H292M50 150V18" stroke="#1d2433" stroke-width="3.5" fill="none"/><path d="M50 150L270 35" stroke="#2257c9" stroke-width="5" stroke-linecap="round"/>${[[94,127],[138,104],[182,81],[226,58]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="7" fill="#d63b2f"/>`).join("")}<circle cx="50" cy="150" r="7" fill="#1e9e5a"/><text x="225" y="140" ${CV} font-size="42" fill="#1e9e5a">y = kx</text>`),
 steps:PROP.steps,mount:wbMount(PROP),
 gen(level){const M=MUL(),D=DIVS();
  if(level===0){const c=pick(PCTX),k=pick(c.k),xs=shuffle(c.xs).slice(0,4).sort((a,b)=>a-b),m=rint(1,3),ys=xs.map(x=>k*x),ans=ys[m];
   const q=[A.wipe(),A.tx(L(c.t),400,52,38,"b"),
    A.tx(L(t3("Tabellen visar en proportionalitet.","The table shows a proportional relationship.","يمثّل الجدول تناسبًا طرديًا.")),400,100,30),
    A.tx(L(t3("Vilket tal ska stå i stället för frågetecknet?","Which number should replace the question mark?","ما العدد الذي يوضع مكان علامة الاستفهام؟")),400,140,30),
    ...ptab(170,70,[{lab:c.xl,vals:xs.map(fmt),c:"o"},{lab:c.yl,vals:ys.map((y,j)=>j===m?"?":fmt(y)),c:"b",vs:34}],34)];
   const sol=[A.tx(`k = ${fmt(ys[0])} ${D} ${fmt(xs[0])} = ${fmt(k)}`,400,368,40,"b"),A.loop(pcx(m),275,48,30,"g"),
    ...hlT(`? = ${fmt(k)} ${M} ${fmt(xs[m])} = ${fmt(ans)}`,400,450,44)];
   return{kind:"num",ans,show:fmt(ans),hc:1,q,sol}}
  /* is y proportional to x? divide y by x in every column */
  if(level===1&&Math.random()<.35){const c=pick(PCTX),k=pick(c.k),xs=shuffle(c.xs).slice(0,4).sort((a,b)=>a-b),pr=Math.random()<.5,m=pr?0:pick([10,20,30,50]),ys=xs.map(x=>k*x+m),YN=t3(["Ja","Nej"],["Yes","No"],["نعم","لا"]);
   const q=[A.wipe(),A.tx(L(c.t),400,52,38,"b"),A.tx(L(t3("Är y proportionell mot x?","Is y proportional to x?","هل y متناسب طرديًا مع x؟")),400,104,32),
    ...ptab(150,64,[{lab:c.xl,vals:xs.map(fmt),c:"o"},{lab:c.yl,vals:ys.map(fmt),c:"b"},{lab:`y ${D} x`,vals:["","","",""],c:"g",ls:30}],32)];
   const sol=[A.tx(L(t3("Dela y med x i varje kolumn.","Divide y by x in every column.","اقسم y على x في كل عمود.")),400,380,28,"b"),...ys.map((y,j)=>qe(nf(y/xs[j]),pcx(j),150+2*64+64*.66,30,"g")),
    ...hlT(L(pr?t3(`Samma kvot: k = ${nf(k)}. Ja!`,`The same ratio: k = ${nf(k)}. Yes!`,`النسبة نفسها: k = ${nf(k)}. نعم!`):t3("Olika kvoter. Nej!","Different ratios. No!","نِسَب مختلفة. لا!")),400,440,36,pr?"g":"r")];
   return{kind:"choice",opts:[0,1].map(i=>t3(YN.sv[i],YN.en[i],YN.ar[i])),ans:pr?0:1,show:t3(YN.sv[pr?0:1],YN.en[pr?0:1],YN.ar[pr?0:1]),hc:1,q,sol,nt:"prop7-check"}}
  if(level===1){const [k,ys]=pick(PK),ymax=Math.ceil(k*8/ys-1e-9)*ys,cand=[2,3,4,5,6,7].filter(x=>Math.abs(k*x/ys-Math.round(k*x/ys))<1e-9&&k*x<ymax),xp=pick(cand),yp=k*xp;
   const G=axes(120,430,50,300/ymax,8,ymax,1,ys,"x","y");
   const q=[A.wipe(),A.tx(L(t3("Linjen visar y = k · x. Vad är k?","The line shows y = k × x. What is k?",`يمثّل المستقيم ${LRI(" y = k × x ")}. ما قيمة k؟`)),400,48,34),...G.o,
    A.p(R.line(G.X(0),G.Y(0),G.X(8),G.Y(8*k),.3),"b",4.5),A.p(dots([[G.X(xp),G.Y(yp)]]),"r",18)];
   const sol=[A.p(R.dashed(G.X(xp),G.Y(yp),G.X(xp),G.Y(0),9),"o",3.5),A.p(R.dashed(G.X(xp),G.Y(yp),G.X(0),G.Y(yp),9),"b",3.5),
    A.tx(`x = ${xp}`,680,170,40,"o"),A.tx(`y = ${nf(yp)}`,680,230,40,"b"),
    A.tx(`k = ${nf(yp)} ${D} ${xp}`,680,320,40),...hlT(`k = ${nf(k)}`,680,400,46)];
   return{kind:"num",ans:k,dec:true,show:nf(k),hc:4,q,sol}}
  /* NP: the unit price (jämförpris) in kr/kg or kr/l */
  if(Math.random()<.35){const it=pick([[t3("kaffe","coffee","البن"),"g","kg"],[t3("ost","cheese","الجبن"),"g","kg"],[t3("lösgodis","pick-and-mix sweets","الحلوى السائبة"),"g","kg"],[t3("juice","juice","العصير"),"ml","l"]]);let g,kp,pr;
   do{g=pick([250,400,500,750,1500,2000]);kp=pick([40,48,60,80,96,120,150,200]);pr=kp*g/1000}while(Math.abs(pr*100-Math.round(pr*100))>1e-9);
   const U=it[2],gs=`${fmt(g)} ${it[1]}`,kgS=nf(g/1000),nm=L(it[0]);
   const q=[A.wipe(),A.tx(L(t3("Jämförpris","Unit price","سعر الوحدة")),400,60,40,"b"),A.tx(L(t3(`${gs} ${nm} kostar ${nf(pr)} kr.`,`${gs} of ${nm} costs ${nf(pr)} kr.`,`ثمن ${gs} من ${nm} هو ${nf(pr)} كرونة.`)),400,140,36),
    A.tx(L(t3(`Vad är jämförpriset i kr/${U}?`,`What is the unit price in kr/${U}?`,`ما سعر الوحدة بالكرونة لكل ${U}؟`)),400,200,34,"b"),A.p(R.rect(300,240,200,110,.3),"o",4),A.tx(gs,400,290,36,"o"),A.tx(`${nf(pr)} kr`,400,334,32)];
   const sol=[A.tx(`${gs} = ${kgS} ${U}`,400,388,34,"b"),A.tx(`${nf(pr)} ${D} ${kgS} = ${nf(kp)}`,400,428,32),...hlT(`${nf(kp)} kr/${U}`,400,478,36)];
   return{kind:"num",ans:kp,dec:true,show:`${nf(kp)} kr/${U}`,hc:1,q,sol,nt:"prop7-unitprice"}}
  const c=pick(P2);let k,a,cc;do{k=pick(c.k);a=pick(c.a);cc=pick(c.c)}while(cc===a||Math.abs(k*a-Math.round(k*a))>1e-9);
  const b=k*a,ans=k*cc,U=L(c.u),Q=L(c.q(a,nf(b),cc));
  const cx1=320,cx2=480,X1=240,X2=560,T=150,rh=56;
  let grid=R.rect(X1,T,X2-X1,rh*4,.3)+R.line(400,T,400,T+rh*4,.2);for(let r=1;r<4;r++)grid+=R.line(X1,T+r*rh,X2,T+r*rh,.2);
  const ry=r=>T+r*rh+rh*.7;
  const q=[A.wipe(),...txLines(Q,400,52,44,32),A.band(X1+4,T+4,X2-X1-8,rh-8,"b"),A.p(grid,"k",3.5),qe(U[0],cx1,ry(0)-2,26,"b"),qe(U[1],cx2,ry(0)-2,26,"b"),
   qe(a,cx1,ry(1),36),qe(nf(b),cx2,ry(1),36),qe(cc,cx1,ry(3),36),qe("?",cx2,ry(3),36,"r")];
  const sol=[A.arrow(X1-6,T+rh*1.5,X1-6,T+rh*2.5,"r",34),qe(`${D} ${a}`,X1-70,T+rh*2+10,30,"r"),A.arrow(X2+6,T+rh*1.5,X2+6,T+rh*2.5,"r",-34),qe(`${D} ${a}`,X2+70,T+rh*2+10,30,"r"),
   qe("1",cx1,ry(2),36,"r"),qe(nf(k),cx2,ry(2),36,"r"),
   A.arrow(X1-6,T+rh*2.5,X1-6,T+rh*3.5,"g",34),qe(`${M} ${cc}`,X1-70,T+rh*3+10,30,"g"),A.arrow(X2+6,T+rh*2.5,X2+6,T+rh*3.5,"g",-34),qe(`${M} ${cc}`,X2+70,T+rh*3+10,30,"g"),
   ...hlT(`? = ${nf(k)} ${M} ${cc} = ${nf(ans)}`,400,460,42)];
  return{kind:"num",ans,dec:true,show:`${nf(ans)} ${L(c.un)}`,hc:6,q,sol}}
});

/* ---------------------------------------------------------------
   2. stat7: bar, line and pie charts
   --------------------------------------------------------------- */
const SC=["b","g","o","r"];
function bars(x0,y0,w,h,vals,ymin,ymax,ys,names,cols,bw=70,ns=26){const n=vals.length,st=w/n,X=i=>x0+st*(i+.5),Y=v=>y0-(v-ymin)/(ymax-ymin)*h;let g="";
 for(let v=ymin+ys;v<=ymax+1e-9;v+=ys)g+=R.line(x0,Y(v),x0+w,Y(v),.15);
 const o=[A.p(g,GC,2),A.p(R.line(x0,y0,x0+w,y0,.3)+R.line(x0,y0,x0,Y(ymax)-14,.3),"k",3.5)];
 for(let v=ymin;v<=ymax+1e-9;v+=ys)o.push(qe(nf(v),x0-12,Y(v)+8,24,"k","end"));
 vals.forEach((v,i)=>{const c=cols[i%cols.length],p=`M${f1(X(i)-bw/2)},${y0}V${f1(Y(v))}H${f1(X(i)+bw/2)}V${y0}`;o.push(A.p(p,c,4),A.hatch(p+"Z",c));if(names)o.push(qe(names[i],X(i),y0+32,ns))});
 return{o,X,Y}}
function lineCh(x0,y0,w,h,vals,ymax,ys,labs,c="b",gs=ys){const n=vals.length,st=w/n,X=i=>x0+st*(i+.5),Y=v=>y0-v/ymax*h;let g="";
 for(let v=gs;v<=ymax+1e-9;v+=gs)g+=R.line(x0,Y(v),x0+w,Y(v),.15);
 for(let i=0;i<n;i++)g+=R.line(X(i),y0,X(i),Y(ymax),.15);
 const o=[A.p(g,GC,2),A.p(R.line(x0,y0,x0+w,y0,.3)+R.line(x0,y0,x0,Y(ymax)-14,.3),"k",3.5)];
 for(let v=0;v<=ymax+1e-9;v+=ys)o.push(qe(nf(v),x0-12,Y(v)+8,24,"k","end"));
 labs.forEach((s,i)=>o.push(qe(s,X(i),y0+32,24)));
 const P=vals.map((v,i)=>[X(i),Y(v)]);o.push(A.p(plines(P,false),c,4.5),A.p(dots(P),"r",14));return{o,X,Y,P}}
/* sector from angle a1 to a2, degrees clockwise from the top */
const arcP=(cx,cy,r,a1,a2)=>{const P=a=>[f1(cx+r*Math.sin(a*Math.PI/180)),f1(cy-r*Math.cos(a*Math.PI/180))],[x1,y1]=P(a1),[x2,y2]=P(a2);
 return `M${cx},${cy}L${x1},${y1}A${r},${r} 0 ${a2-a1>180?1:0} 1 ${x2},${y2}Z`};
function pie(cx,cy,r,pcts,cols){let a=0,d=R.circ(cx,cy,r);const o=[],A0=[];
 pcts.forEach((p,i)=>{const b=a+p*3.6;o.push(A.hatch(arcP(cx,cy,r,a,b),cols[i%cols.length]));A0.push([a,b]);a=b});
 A0.forEach(([a])=>{const t=a*Math.PI/180;d+=R.line(cx,cy,cx+r*Math.sin(t),cy-r*Math.cos(t),.3)});
 o.unshift(A.p(d,"k",4));
 const lab=(i,f)=>{if(f==null)f=A0[i][1]-A0[i][0]<=54?.72:.62;const m=(A0[i][0]+A0[i][1])/2*Math.PI/180;return[cx+r*f*Math.sin(m),cy-r*f*Math.cos(m)+10]};
 return{o,lab,ang:A0}}
const TRV=t3(["gå","cykel","buss","bil"],["walk","bike","bus","car"],["مشيًا","دراجة","حافلة","سيارة"]);
const DATA=t3(["video","musik","sociala medier","övrigt"],["video","music","social media","other"],["فيديو","موسيقى","التواصل الاجتماعي","أخرى"]);
const CHN=t3(["stapeldiagram","linjediagram","cirkeldiagram"],["bar chart","line chart","pie chart"],["مخطط بالأعمدة","مخطط خطي","مخطط دائري"]);
const CHU=t3(["jämför grupper","förändring över tid","delar av en helhet"],["compare groups","change over time","parts of a whole"],["مقارنة المجموعات","التغيّر مع الزمن","أجزاء من الكل"]);
const mBar=(cx,cy)=>{const o=[A.p(R.line(cx-70,cy+60,cx+70,cy+60,.2)+R.line(cx-70,cy+60,cx-70,cy-66,.2),"k",3)];
 [[-38,70],[0,112],[38,50]].forEach(([dx,h],i)=>{const p=`M${cx+dx-15},${cy+60}V${cy+60-h}H${cx+dx+15}V${cy+60}`;o.push(A.p(p,SC[i],3.5),A.hatch(p+"Z",SC[i]))});return o};
const mLine=(cx,cy)=>{const P=[[-55,35],[-27,8],[0,18],[27,-30],[55,-48]].map(([a,b])=>[cx+a,cy+b]);
 return[A.p(R.line(cx-70,cy+60,cx+70,cy+60,.2)+R.line(cx-70,cy+60,cx-70,cy-66,.2),"k",3),A.p(plines(P,false),"b",4),A.p(dots(P),"r",11)]};
const mPie=(cx,cy)=>pie(cx,cy,66,[50,30,20],SC).o;
const MINI=[mBar,mLine,mPie];
const STAT={steps:[
 {say:t3("Ett stapeldiagram jämför olika grupper. 120 elever i årskurs 7 svarade på hur de tar sig till skolan. Högst stapel har cykel: 40 elever.",
   "A bar chart compares different groups. 120 students in Year 7 answered how they get to school. The tallest bar is bike: 40 students.",
   "المخطط بالأعمدة يقارن بين مجموعات مختلفة. أجاب 120 طالبًا في الصف السابع عن طريقة ذهابهم إلى المدرسة. أعلى عمود هو الدراجة: 40 طالبًا."),
  draw:()=>{const B=bars(170,420,560,290,[35,40,30,15],0,50,10,L(TRV),SC,84,28);return[A.wipe(),A.tx(L(t3("Hur tar du dig till skolan?","How do you get to school?","كيف تذهب إلى المدرسة؟")),400,58,40,"b"),...B.o,
   A.loop(B.X(1),B.Y(40)-24,40,22,"g"),qe("40",B.X(1),B.Y(40)-14,30,"g")]}},
 {say:t3("Ett linjediagram visar hur något förändras över tid. Temperaturen stiger till 25 grader klockan 14 och sjunker sedan.",
   "A line chart shows how something changes over time. The temperature rises to 25 degrees at 2 pm and then falls.",
   "المخطط الخطي يبيّن كيف يتغيّر شيء ما مع الزمن. ترتفع درجة الحرارة إلى 25 درجة عند الساعة 14 ثم تنخفض."),
  draw:()=>{const h=[6,8,10,12,14,16,18,20],Lc=lineCh(120,420,640,280,[12,15,19,23,25,24,20,16],30,5,h.map(x=>lang==="sv"?`kl ${x}`:`${x}:00`));
   return[A.wipe(),A.tx(L(t3("Temperatur en sommardag (°C)","Temperature on a summer day (°C)","درجة الحرارة في يوم صيفي (°C)")),400,58,38,"b"),...Lc.o,
    A.loop(Lc.X(4),Lc.Y(25),22,22,"g"),qe("25 °C",Lc.X(4)-30,Lc.Y(25)-18,30,"g","end")]}},
 {say:t3("Ett cirkeldiagram visar hur en helhet delas upp. Hela cirkeln är Noras 20 GB mobildata, alltså 100 %. Hälften, 50 %, går till video.",
   "A pie chart shows how a whole is split up. The whole circle is Nora's 20 GB of mobile data, which is 100%. Half of it, 50%, goes to video.",
   "المخطط الدائري يبيّن كيف ينقسم الكل إلى أجزاء. الدائرة كلها هي بيانات نورا البالغة 20 GB، أي 100%. نصفها، 50%، يذهب إلى الفيديو."),
  draw:()=>{const P=[50,25,15,10],pi=pie(230,285,165,P,SC),N=L(DATA);return[A.wipe(),A.tx(L(t3("Noras mobildata: 20 GB","Nora's mobile data: 20 GB","بيانات نورا للهاتف: 20 GB")),400,58,40,"b"),...pi.o,
   ...P.map((p,i)=>qe(pc(p),...pi.lab(i),28)),
   ...N.flatMap((s,i)=>[A.p(dots([[490,150+i*56]]),SC[i],24),A.tx(`${s}: ${pc(P[i])}`,515,160+i*56,30,SC[i],"lead")])]}},
 {say:t3("Musik är 25 %, en fjärdedel av cirkeln. Det är en rät vinkel, 90°. 25 % av 20 GB är 0,25 · 20 = 5 GB.",
   "Music is 25%, a quarter of the circle. That is a right angle, 90°. 25% of 20 GB is 0.25 × 20 = 5 GB.",
   "الموسيقى 25%، أي ربع الدائرة، وهذه زاوية قائمة 90°. و25% من 20 GB تساوي 0.25 × 20 = 5 GB."),
  draw:()=>[A.p(arcP(230,285,165,180,270),"g",6),A.p(`M230,${285+28}h-28v-28`,"g",3.5),
   A.tx(`${pc(25)} = 1/4 = 90°`,630,398,34,"g"),...hlT(`${dfmt(.25,2)} ${MUL()} 20 = 5 GB`,630,458,38)]},
 {say:t3("Välj diagram efter vad du vill visa. Stapeldiagram jämför grupper, linjediagram visar förändring över tid och cirkeldiagram visar delar av en helhet.",
   "Choose the chart by what you want to show. A bar chart compares groups, a line chart shows change over time and a pie chart shows parts of a whole.",
   "اختر المخطط حسب ما تريد أن تعرضه. المخطط بالأعمدة يقارن المجموعات، والمخطط الخطي يبيّن التغيّر مع الزمن، والمخطط الدائري يبيّن أجزاء الكل."),
  draw:()=>{const N=L(CHN),U=L(CHU),X=[150,400,650];return[A.wipe(),A.tx(L(t3("Vilket diagram ska jag välja?","Which chart should I choose?","أي مخطط أختار؟")),400,58,40,"b"),
   ...X.flatMap((x,i)=>[...MINI[i](x,190),A.tx(N[i],x,316,32,SC[i]),A.tx(U[i],x,360,28)]),
   A.tx(L(t3("Fråga dig: vad vill jag visa?","Ask yourself: what do I want to show?","اسأل نفسك: ماذا أريد أن أعرض؟")),400,446,32,"o")]}},
 {say:t3("Se upp med axeln! Till vänster börjar den på 50, så lördag ser ut att ha tre gånger så många. Från 0 syns sanningen: 52 och 56 är nästan lika.",
   "Watch out for the axis! On the left it starts at 50, so Saturday looks three times as big. Starting from 0 shows the truth: 52 and 56 are almost the same.",
   "انتبه إلى المحور! في المخطط الأيسر يبدأ من 50، فيبدو السبت ثلاثة أضعاف الجمعة. وعندما يبدأ من 0 تظهر الحقيقة: 52 و56 متقاربان جدًا."),
  draw:()=>{const D=L(t3(["fre","lör"],["Fri","Sat"],["الجمعة","السبت"])),a=bars(130,400,230,250,[52,56],50,57,1,D,["b","o"],70,26),b=bars(510,400,230,250,[52,56],0,60,10,D,["b","o"],70,26);
   return[A.wipe(),A.tx(L(t3("Sålda biljetter","Tickets sold","التذاكر المبيعة")),400,52,38,"b"),...a.o,...b.o,
    qe("52",a.X(0),a.Y(52)-12,26),qe("56",a.X(1),a.Y(56)-12,26),qe("52",b.X(0),b.Y(52)-12,26),qe("56",b.X(1),b.Y(56)-12,26),
    A.tx(L(t3("axeln börjar på 50","the axis starts at 50","المحور يبدأ من 50")),245,478,28,"r"),A.tx(L(t3("axeln börjar på 0","the axis starts at 0","المحور يبدأ من 0")),625,478,28,"g")]}}
]};
const MON=t3(["jan","feb","mar","apr","maj","jun","jul"],["Jan","Feb","Mar","Apr","May","Jun","Jul"],["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو"]);
const MONF=t3(["januari","februari","mars","april","maj","juni","juli"],["January","February","March","April","May","June","July"],["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو"]);
const LCX=[
 {t:t3("Temperatur under en dag (°C)","Temperature during a day (°C)","درجة الحرارة خلال يوم (°C)"),time:true,ymax:28,ys:4,lo:2,hi:28,st:2},
 {t:t3("Besökare på gymmet","Visitors at the gym","زوار النادي الرياضي"),time:true,ymax:80,ys:10,lo:5,hi:80,st:5},
 {t:t3("Sparade pengar (kr)","Money saved (kr)","المال المدّخر (كرونة)"),time:false,ymax:800,ys:100,lo:50,hi:800,st:50},
 {t:t3("Följare på ett konto","Followers on an account","متابعو حساب"),time:false,ymax:400,ys:50,lo:25,hi:400,st:25}];
const SIT=[
 [0,t3("Antal mål för fem olika spelare","The number of goals for five different players","عدد الأهداف لخمسة لاعبين مختلفين")],
 [0,t3("Hur många elever som valde varje sport","How many students chose each sport","عدد الطلاب الذين اختاروا كل رياضة")],
 [0,t3("Antal guldmedaljer för fyra länder","The number of gold medals for four countries","عدد الميداليات الذهبية لأربع دول")],
 [1,t3("Din längd varje år från 7 till 13 år","Your height every year from age 7 to 13","طولك في كل سنة من عمر 7 إلى 13")],
 [1,t3("Temperaturen varje timme under en dag","The temperature every hour during a day","درجة الحرارة كل ساعة خلال يوم")],
 [1,t3("Antal följare på ett konto, månad för månad","The number of followers on an account, month by month","عدد متابعي حساب، شهرًا بعد شهر")],
 [2,t3("Hur stor del av veckopengen som går till mat, spel och sparande","What share of your pocket money goes to food, games and savings","حصة الطعام والألعاب والادخار من مصروفك الأسبوعي")],
 [2,t3("Hur ett dygn delas upp i sömn, skola och fritid","How a day is split into sleep, school and free time","كيف يتوزّع اليوم بين النوم والمدرسة ووقت الفراغ")],
 [2,t3("Hur stor andel av rösterna varje lag fick","What share of the votes each team got","نسبة الأصوات التي حصل عليها كل فريق")]];
function pcts(n){let p;do{const cuts=shuffle([...Array(17)].map((_,i)=>10+i*5)).slice(0,n-1).sort((a,b)=>a-b);p=[...cuts,100].map((c,i,a)=>c-(i?a[i-1]:0))}while(p.some(x=>x<10));return p}
const PCX=[
 {N:[120,160,200,240,300],names:TRV,t:N=>t3(`Så tar sig ${N} elever till skolan`,`How ${N} students get to school`,`كيف يذهب ${N} من الطلاب إلى المدرسة`),
  q:t3(["Hur många går?","Hur många cyklar?","Hur många åker buss?","Hur många åker bil?"],["How many walk?","How many cycle?","How many take the bus?","How many go by car?"],["كم طالبًا يذهب مشيًا؟","كم طالبًا يذهب بالدراجة؟","كم طالبًا يذهب بالحافلة؟","كم طالبًا يذهب بالسيارة؟"])},
 {N:[400,500,600,800,1000],names:t3(["mat","spel","kläder","sparande"],["food","games","clothes","savings"],["الطعام","الألعاب","الملابس","الادخار"]),t:N=>t3(`Leos månadspeng: ${fmt(N)} kr`,`Leo's monthly allowance: ${fmt(N)} kr`,`مصروف ليو الشهري: ${fmt(N)} كرونة`),
  q:t3(["Hur många kronor går till mat?","Hur många kronor går till spel?","Hur många kronor går till kläder?","Hur många kronor går till sparande?"],["How many kronor go to food?","How many kronor go to games?","How many kronor go to clothes?","How many kronor go to savings?"],["كم كرونة تذهب إلى الطعام؟","كم كرونة تذهب إلى الألعاب؟","كم كرونة تذهب إلى الملابس؟","كم كرونة تذهب إلى الادخار؟"])}];
LESSONS.push({id:"stat7",subject:"math",grades:"7",kind:"wb",
 title:t3("Stapel-, linje- och cirkeldiagram","Bar, line and pie charts","المخططات بالأعمدة والخطية والدائرية"),
 icon:ICO(`<path d="M28 152H152M28 152V28" stroke="#1d2433" stroke-width="3" fill="none"/>${[[42,62,"#2257c9"],[78,100,"#1e9e5a"],[114,44,"#e07b00"]].map(([x,h,c])=>`<rect x="${x}" y="${152-h}" width="26" height="${h}" fill="${c}" fill-opacity=".3" stroke="${c}" stroke-width="3"/>`).join("")}<circle cx="236" cy="92" r="60" fill="#2257c9" fill-opacity=".25" stroke="#1d2433" stroke-width="3"/><path d="M236 92V32A60 60 0 0 1 296 92Z" fill="#1e9e5a" fill-opacity=".45" stroke="#1d2433" stroke-width="3"/><path d="M236 92H296A60 60 0 0 1 206 144Z" fill="#e07b00" fill-opacity=".4" stroke="#1d2433" stroke-width="3"/>`),
 steps:STAT.steps,mount:wbMount(STAT),
 gen(level){const M=MUL();
  /* read a bar chart: how many more? */
  if(level===0&&Math.random()<.35){const N=L(TRV);let v,i,j;do{v=[0,0,0,0].map(()=>rint(1,10)*5);i=rint(0,3);j=rint(0,3)}while(i===j||v[i]<=v[j]);
   const B=bars(150,420,560,270,v,0,50,10,N,SC,84,28),d=v[i]-v[j];
   const q=[A.wipe(),A.tx(L(t3("Stapeldiagrammet visar hur elever tar sig till skolan.","The bar chart shows how students get to school.","يبيّن المخطط بالأعمدة كيف يذهب الطلاب إلى المدرسة.")),400,50,30,"b"),A.tx(L(t3(`Hur många fler svarade ”${N[i]}” än ”${N[j]}”?`,`How many more answered “${N[i]}” than “${N[j]}”?`,`كم طالبًا يختار «${N[i]}» أكثر من «${N[j]}»؟`)),400,98,32),...B.o];
   const sol=[A.p(R.dashed(150,B.Y(v[i]),B.X(i),B.Y(v[i]),9),"o",3.5),A.p(R.dashed(150,B.Y(v[j]),B.X(j),B.Y(v[j]),9),"o",3.5),qe(v[i],B.X(i),B.Y(v[i])-12,28,"b"),qe(v[j],B.X(j),B.Y(v[j])-12,28,"b"),...hlT(`${v[i]} − ${v[j]} = ${d}`,560,140,34)];
   return{kind:"num",ans:d,show:String(d),hc:2,q,sol,nt:"stat7-bar"}}
  if(level===0){const c=pick(LCX),n=7;let v,i,j;
   do{v=[rint(c.lo/c.st,c.hi/c.st)*c.st];while(v.length<n){const x=v[v.length-1]+rint(-3,3)*c.st;if(x>=c.lo&&x<=c.hi)v.push(x)}i=rint(0,n-3);j=rint(i+2,n-1)}while(v[i]===v[j]||new Set(v).size<4);
   const labs=c.time?[8,10,12,14,16,18,20].map(h=>lang==="sv"?`kl ${h}`:`${h}:00`):L(MON),hr=[8,10,12,14,16,18,20],MF=L(MONF);
   const qs=c.time?t3(`Hur stor är skillnaden mellan kl ${hr[i]} och kl ${hr[j]}?`,`What is the difference between ${hr[i]}:00 and ${hr[j]}:00?`,`ما الفرق بين الساعة ${hr[i]} والساعة ${hr[j]}؟`)
    :t3(`Hur stor är skillnaden mellan ${MONF.sv[i]} och ${MONF.sv[j]}?`,`What is the difference between ${MONF.en[i]} and ${MONF.en[j]}?`,`ما الفرق بين ${MONF.ar[i]} و${MONF.ar[j]}؟`);
   const Lc=lineCh(110,420,500,260,v,c.ymax,c.ys,labs,"b",c.st),hi=Math.max(v[i],v[j]),lo=Math.min(v[i],v[j]),d=hi-lo;
   const q=[A.wipe(),A.tx(L(c.t),400,50,36,"b"),A.tx(L(qs),400,100,30),...Lc.o,A.loop(Lc.X(i),Lc.Y(v[i]),18,18,"o"),A.loop(Lc.X(j),Lc.Y(v[j]),18,18,"o")];
   const sol=[A.p(R.dashed(110,Lc.Y(v[i]),Lc.X(i),Lc.Y(v[i]),9),"o",3.5),A.p(R.dashed(110,Lc.Y(v[j]),Lc.X(j),Lc.Y(v[j]),9),"o",3.5),
    qe(labs[i],665,200,26),qe(nf(v[i]),750,202,32,"b"),qe(labs[j],665,250,26),qe(nf(v[j]),750,252,32,"b"),
    A.tx(`${nf(hi)} − ${nf(lo)}`,705,320,36),...hlT(`= ${nf(d)}`,705,390,44)];
   return{kind:"num",ans:d,show:nf(d),hc:2,q,sol}}
  if(level===1){const c=pick(PCX),N=pick(c.N),n=rint(3,4),P=pcts(n),k=rint(0,n-1),ans=P[k]*N/100,names=L(c.names).slice(0,n);
   const pi=pie(220,290,150,P,SC);
   const q=[A.wipe(),A.tx(L(c.t(N)),400,50,36,"b"),A.tx(L(c.q)[k],400,100,32),...pi.o,...P.map((p,i)=>qe(pc(p),...pi.lab(i),26)),
    ...names.flatMap((s,i)=>[A.p(dots([[455,175+i*52]]),SC[i],24),A.tx(`${s}: ${pc(P[i])}`,478,185+i*52,30,SC[i],"lead")])];
   const sol=[A.p(arcP(220,290,150,pi.ang[k][0],pi.ang[k][1]),"g",6),A.tx(`${pc(P[k])} ${L(t3("av","of","من"))} ${fmt(N)}`,615,398,34),
    ...hlT(`${nf(P[k]/100)} ${M} ${fmt(N)} = ${fmt(ans)}`,615,458,38)];
   return{kind:"num",ans,show:fmt(ans),hc:2,q,sol}}
  /* a pie chart sector in degrees: 100 % = 360° */
  if(Math.random()<.3){const n=rint(3,4),P=pcts(n),k=rint(0,n-1),names=L(DATA).slice(0,n),deg=P[k]*3.6,pi=pie(220,300,150,P,SC);
   const q=[A.wipe(),A.tx(L(t3("Cirkeldiagrammet visar Noras mobildata.","The pie chart shows Nora's mobile data.","يبيّن المخطط الدائري بيانات نورا للهاتف.")),400,50,32,"b"),A.tx(L(t3(`Hur många grader är sektorn för ${names[k]}?`,`How many degrees is the sector for ${names[k]}?`,`كم درجة قياس قطاع «${names[k]}»؟`)),400,98,30),...pi.o,...P.map((p,i)=>qe(pc(p),...pi.lab(i),26)),
    ...names.flatMap((t,i)=>[A.p(dots([[455,185+i*52]]),SC[i],24),A.tx(`${t}: ${pc(P[i])}`,478,195+i*52,30,SC[i],"lead")])];
   const sol=[A.tx(`${pc(100)} = 360°`,615,398,32,"b"),A.p(arcP(220,300,150,pi.ang[k][0],pi.ang[k][1]),"g",6),...hlT(`${nf(P[k]/100)} ${M} 360° = ${nf(deg)}°`,615,458,36)];
   return{kind:"num",ans:deg,dec:true,show:`${nf(deg)}°`,hc:1,q,sol,nt:"stat7-degrees"}}
  const [ans0,s]=pick(SIT),ord=shuffle([0,1,2]),N=L(CHN),U=L(CHU),X=[160,400,640],ans=ord.indexOf(ans0);
  const q=[A.wipe(),A.tx(L(t3("Vilket diagram passar bäst?","Which chart fits best?","أي مخطط هو الأنسب؟")),400,52,36),...txLines(wrap(L(s),52),400,104,40,32,"b"),
   ...ord.flatMap((t,i)=>[...MINI[t](X[i],262),A.tx(N[t],X[i],388,30,SC[t])])];
  const sol=[A.loop(X[ans],310,112,112,"g"),A.tx(U[ans0],400,468,34,"g")];
  return{kind:"choice",opts:ord.map(t=>t3(CHN.sv[t],CHN.en[t],CHN.ar[t])),ans,show:t3(CHN.sv[ans0],CHN.en[ans0],CHN.ar[ans0]),hc:0,q,sol}}
});

/* ---------------------------------------------------------------
   3. prob7: two dice and the sample space
   --------------------------------------------------------------- */
const PIPS={1:[[0,0]],2:[[-1,-1],[1,1]],3:[[-1,-1],[0,0],[1,1]],4:[[-1,-1],[1,-1],[-1,1],[1,1]],5:[[-1,-1],[1,-1],[0,0],[-1,1],[1,1]],6:[[-1,-1],[1,-1],[-1,0],[1,0],[-1,1],[1,1]]};
const die=(cx,cy,s,n,c="k")=>[A.p(R.rect(cx-s/2,cy-s/2,s,s,.3),c,3.5),A.p(dots(PIPS[n].map(([a,b])=>[cx+a*s*.27,cy+b*s*.27])),c,s*.17)];
/* several small dice drawn as one outline path and one pip path */
const dice=(list,s,c)=>[A.p(list.map(([x,y])=>R.rect(x-s/2,y-s/2,s,s,.3)).join(""),c,3),A.p(dots(list.flatMap(([x,y,n])=>PIPS[n].map(([a,b])=>[x+a*s*.27,y+b*s*.27]))),c,s*.17)];
const DG={x:60,y:70,s:52},CX=j=>DG.x+DG.s*(j+1.5),CY=i=>DG.y+DG.s*(i+1.5),RC=620;
function dgrid(sums){const s=DG.s,x=DG.x,y=DG.y;let d=R.rect(x,y,7*s,7*s,.3);for(let k=1;k<7;k++)d+=R.line(x+k*s,y,x+k*s,y+7*s,.15)+R.line(x,y+k*s,x+7*s,y+k*s,.15);
 const o=[A.band(x+s+2,y+2,6*s-4,s-4,"b"),A.band(x+2,y+s+2,s-4,6*s-4,"r"),A.p(d,"k",3),qe("+",x+s/2,y+s/2+12,34),
  ...dice([0,1,2,3,4,5].map(k=>[CX(k),y+s/2,k+1]),34,"b"),...dice([0,1,2,3,4,5].map(k=>[x+s/2,CY(k),k+1]),34,"r")];
 if(sums)for(let i=0;i<6;i++)for(let j=0;j<6;j++)o.push(Object.assign(qt(i+j+2,CX(j),CY(i)+10,28),{dur:110}));
 return o}
const cellP=(i,j)=>{const s=DG.s-8,x=CX(j)-s/2,y=CY(i)-s/2;return `M${f1(x)},${f1(y)}h${s}v${s}h${-s}Z`};
const hatchCells=(f,c="g")=>{const o=[];for(let i=0;i<6;i++)for(let j=0;j<6;j++)if(f(i+1,j+1))o.push(A.hatch(cellP(i,j),c));return o};
const countCells=f=>{let n=0;for(let r=1;r<=6;r++)for(let b=1;b<=6;b++)if(f(r,b))n++;return n};
const UTF=n=>L(t3(`${n} utfall av 36`,`${n} outcomes out of 36`,`${n} من 36 ناتجًا`));
/* "P =" followed by a fraction, kept left-to-right in every language */
const pFrac=(lab,n,d,x,y,c="g",size=44)=>[A.tx(lab,x-18,y+size*.32,size*.9,c,"end"),...A.frac(n,d,x+32,y,size,c)];
const PROB={steps:[
 {say:t3("I många brädspel slår man två tärningar och lägger ihop. Vilken summa är vanligast? Många tror att alla summor är lika vanliga.",
   "In many board games you roll two dice and add them up. Which sum is most common? Many people think all sums are equally common.",
   "في ألعاب لوحية كثيرة نرمي حجرَي نرد ونجمع العددين. أي مجموع هو الأكثر تكرارًا؟ يظن كثيرون أن كل المجاميع متساوية في التكرار."),
  draw:()=>[A.wipe(),...die(210,170,110,3,"r"),A.tx("+",318,194,64),...die(426,170,110,4,"b"),A.tx("= 7",575,196,72),
   A.tx(L(t3("Vilken summa är vanligast?","Which sum is most common?","أي مجموع هو الأكثر تكرارًا؟")),400,320,40,"b"),
   ...[2,3,4,5,6,7,8,9,10,11,12].map(s=>qt(s,400+(s-7)*62,412,38)),A.p(R.line(80,432,720,432,.3),"k",3)]},
 {say:t3("Vi gör en tabell: röd tärning i raderna och blå i kolumnerna. Varje ruta är ett utfall. Det finns 6 · 6 = 36 utfall, och alla är lika troliga.",
   "We make a table: the red die in the rows and the blue die in the columns. Each square is one outcome. There are 6 × 6 = 36 outcomes, all equally likely.",
   "نصنع جدولًا: حجر النرد الأحمر في الصفوف والأزرق في الأعمدة. كل مربع ناتج واحد. هناك 6 × 6 = 36 ناتجًا، ولكل منها الفرصة نفسها."),
  draw:()=>[A.wipe(),...dgrid(false),...die(492,122,36,5,"r"),A.tx(L(t3("röd tärning","red die","حجر النرد الأحمر")),525,132,30,"r","lead"),
   ...die(492,180,36,5,"b"),A.tx(L(t3("blå tärning","blue die","حجر النرد الأزرق")),525,190,30,"b","lead"),
   A.hatch(cellP(2,3),"o"),A.loop(CX(3),CY(2),30,30,"o"),A.tx(L(t3("röd 3 och blå 4","red 3 and blue 4","أحمر 3 وأزرق 4")),RC,262,30,"o"),
   A.tx(`6 ${MUL()} 6 = 36`,RC,350,48),A.tx(L(t3("lika troliga utfall","equally likely outcomes","ناتجًا متساوي الفرص")),RC,400,30)]},
 {say:t3("Vi skriver summan i varje ruta. Summan 7 finns på en hel diagonal: 6 rutor av 36. Sannolikheten är 6/36 = 1/6.",
   "We write the sum in every square. The sum 7 fills a whole diagonal: 6 squares out of 36. The probability is 6/36 = 1/6.",
   "نكتب المجموع في كل مربع. المجموع 7 يملأ قطرًا كاملًا: 6 مربعات من 36. الاحتمال 6/36 = 1/6."),
  draw:()=>[A.wipe(),...dgrid(true),...hatchCells((r,b)=>r+b===7),A.tx(L(t3("summan 7","the sum 7","المجموع 7")),RC,120,36,"g"),A.tx(UTF(6),RC,168,30,"g"),
   ...pFrac("P(7) =",6,36,560,250),A.tx("=",665,264,44,"g"),...A.frac(1,6,715,250,44,"g")]},
 {say:t3("Summan 2 får du bara på ett sätt: två ettor. Sannolikheten är 1/36. Summan 7 är alltså sex gånger så vanlig.",
   "You can only get the sum 2 in one way: two ones. The probability is 1/36. So the sum 7 is six times as common.",
   "المجموع 2 لا يأتي إلا بطريقة واحدة: واحد وواحد. احتماله 1/36. إذن المجموع 7 أكثر تكرارًا بست مرات."),
  draw:()=>[A.hatch(cellP(0,0),"r"),A.loop(CX(0),CY(0),30,30,"r"),A.tx(L(t3("summan 2","the sum 2","المجموع 2")),RC,348,32,"r"),
   ...pFrac("P(2) =",1,36,580,398,"r",40),A.tx(L(t3("7 är 6 gånger så vanlig","7 is 6 times as common","المجموع 7 أكثر بست مرات")),RC,478,28,"b")]},
 {say:t3("Minst en sexa: hela sista raden och hela sista kolumnen. Rutan med två sexor ligger i båda, men räknas bara en gång. 6 + 6 − 1 = 11, så sannolikheten är 11/36.",
   "At least one six: the whole last row and the whole last column. The square with two sixes is in both, but it only counts once. 6 + 6 − 1 = 11, so the probability is 11/36.",
   "ستة واحدة على الأقل: الصف الأخير كله والعمود الأخير كله. المربع الذي فيه ستتان موجود في الاثنين، لكنه يُحسب مرة واحدة. 6 + 6 − 1 = 11، إذن الاحتمال 11/36."),
  draw:()=>[A.wipe(),...dgrid(false),...hatchCells((r,b)=>r===6,"o"),...hatchCells((r,b)=>b===6&&r<6,"b"),A.loop(CX(5),CY(5),30,30,"r"),
   A.tx(L(t3("minst en sexa","at least one six","ستة واحدة على الأقل")),RC,120,36,"o"),A.tx("6 + 6 − 1 = 11",RC,200,42),
   A.tx(L(t3("två sexor räknas en gång","two sixes count once","الستتان تُحسبان مرة واحدة")),RC,250,28,"r"),...pFrac("P =",11,36,600,350,"g",48)]},
 {say:t3("Slår du 360 gånger blir summan 7 ungefär 1/6 av gångerna, alltså cirka 60 gånger. Mitten är vanligast och kanterna ovanligast.",
   "If you roll 360 times, the sum 7 comes up about 1/6 of the time, so roughly 60 times. The middle is most common and the edges are least common.",
   "إذا رميت 360 مرة فسيظهر المجموع 7 في نحو 1/6 من المرات، أي قرابة 60 مرة. الوسط هو الأكثر تكرارًا والأطراف هي الأقل."),
  draw:()=>{const v=[1,2,3,4,5,6,5,4,3,2,1].map(x=>x*10),B=bars(100,410,650,260,v,0,60,10,[2,3,4,5,6,7,8,9,10,11,12].map(String),["b","b","b","b","b","g","b","b","b","b","b"],38,26);
   return[A.wipe(),A.tx(L(t3("360 kast med två tärningar (väntat antal)","360 rolls of two dice (expected count)","360 رمية لحجرَي نرد (العدد المتوقع)")),400,52,34,"b"),...B.o,
    qe("≈ 60",B.X(5),B.Y(60)-14,28,"g"),A.tx(`360 ${MUL()} 1/6 = 60`,640,118,34,"g"),A.tx(L(t3("summa","sum","المجموع")),425,484,26)]}}
]};
const EV=[
 {f:(r,b)=>r===b,t:t3("båda tärningarna visar samma tal","both dice show the same number","يُظهر الحجران العدد نفسه")},
 {f:(r,b)=>r+b<=4,t:t3("summan blir högst 4","the sum is at most 4","يكون المجموع 4 على الأكثر")},
 {f:(r,b)=>r+b>=10,t:t3("summan blir minst 10","the sum is at least 10","يكون المجموع 10 على الأقل")},
 {f:(r,b)=>r===5||b===5,t:t3("minst en tärning visar 5","at least one die shows 5","يُظهر حجر واحد على الأقل العدد 5")},
 {f:(r,b)=>r!==6&&b!==6,t:t3("ingen tärning visar 6","neither die shows 6","لا يُظهر أيٌّ من الحجرين العدد 6")},
 {f:(r,b)=>r%2===1&&b%2===1,t:t3("båda visar udda tal","both show odd numbers","يُظهر الحجران عددين فرديين")},
 {f:(r,b)=>r*b===12,t:t3("produkten blir 12","the product is 12","يكون حاصل الضرب 12")},
 {f:(r,b)=>r>b,t:t3("den röda visar mer än den blå","the red die shows more than the blue","يُظهر الأحمر عددًا أكبر من الأزرق")},
 {f:(r,b)=>(r+b)%2===0,t:t3("summan blir jämn","the sum is even","يكون المجموع زوجيًا")},
 {f:(r,b)=>Math.abs(r-b)===2,t:t3("skillnaden blir 2","the difference is 2","يكون الفرق بينهما 2")},
 {f:(r,b)=>r===1||b===1,t:t3("minst en tärning visar 1","at least one die shows 1","يُظهر حجر واحد على الأقل العدد 1")},
 {f:(r,b)=>r+b===9,t:t3("summan blir 9","the sum is 9","يكون المجموع 9")}];
const CEV=[
 {f:(h,d)=>h===0&&d===6,t:t3("krona och en sexa","heads and a six","صورة والعدد 6")},
 {f:(h,d)=>h===1&&d%2===0,t:t3("klave och ett jämnt tal","tails and an even number","كتابة وعدد زوجي")},
 {f:(h,d)=>h===0&&d>4,t:t3("krona och ett tal större än 4","heads and a number greater than 4","صورة وعدد أكبر من 4")},
 {f:(h,d)=>h===0||d===6,t:t3("krona eller en sexa (eller båda)","heads or a six (or both)","صورة أو العدد 6 (أو كليهما)")},
 {f:(h,d)=>h===1&&d<=2,t:t3("klave och högst 2","tails and at most 2","كتابة وعدد لا يزيد على 2")},
 {f:(h,d)=>d<=3,t:t3("högst 3 på tärningen","at most 3 on the die","عدد لا يزيد على 3 في حجر النرد")}];
const COIN=t3(["krona","klave"],["heads","tails"],["صورة","كتابة"]);
LESSONS.push({id:"prob7",subject:"math",grades:"7",kind:"wb",
 title:t3("Sannolikhet med två tärningar","Probability with two dice","الاحتمال مع حجرَي نرد"),
 icon:ICO(`<rect x="28" y="38" width="72" height="72" rx="10" fill="#d63b2f" fill-opacity=".1" stroke="#d63b2f" stroke-width="3.5"/>${[[46,56],[64,74],[82,92]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="6.5" fill="#d63b2f"/>`).join("")}<rect x="96" y="80" width="72" height="72" rx="10" fill="#2257c9" fill-opacity=".1" stroke="#2257c9" stroke-width="3.5"/>${[[114,98],[150,98],[114,134],[150,134]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="6.5" fill="#2257c9"/>`).join("")}${[0,1,2,3,4,5].map(i=>[0,1,2,3,4,5].map(j=>`<rect x="${190+j*19}" y="${30+i*19}" width="19" height="19" fill="${i+j===5?"#1e9e5a":"#fff"}" fill-opacity="${i+j===5?.45:1}" stroke="#1d2433" stroke-width="1.5"/>`).join("")).join("")}<text x="247" y="168" ${CV} font-size="30" fill="#1e9e5a">6/36</text>`),
 steps:PROB.steps,mount:wbMount(PROB),
 gen(level){const M=MUL();
  const FR=()=>L(pick([t3("Svara med ett bråk.","Answer with a fraction.","أجب بكسر."),t3("Svara i bråkform.","Answer as a fraction.","أجب على صورة كسر.")]));
  if(level===0){let s;do{s=rint(2,12)}while(s===7);const f=(r,b)=>r+b===s,c=countCells(f);
   const Q=t3(wrap(`Hur stor är sannolikheten att summan blir ${s}?`,22),wrap(`What is the probability that the sum is ${s}?`,22),wrap(`ما احتمال أن يكون المجموع ${s}؟`,20));
   const q=[A.wipe(),...dgrid(true),A.tx(L(t3("Två tärningar","Two dice","حجرا نرد")),RC,110,36,"b"),...txLines(L(Q),RC,165,42,30),A.tx(FR(),RC,300,28,"o")];
   const H=hatchCells(f);return{kind:"frac",ans:[c,36],show:`${c}/36`,hc:c>=3?1:0,q,sol:[...H,A.tx(UTF(c),RC,370,30,"g"),...pFrac("P =",c,36,600,430,"g",40)]}}
  if(level===1){const e=pick(EV),c=countCells(e.f);
   const Q=t3(wrap(`Hur stor är sannolikheten att ${e.t.sv}?`,22),wrap(`What is the probability that ${e.t.en}?`,22),wrap(`ما احتمال أن ${e.t.ar}؟`,20));
   const q=[A.wipe(),...dgrid(false),A.tx(L(t3("Två tärningar","Two dice","حجرا نرد")),RC,110,36,"b"),...txLines(L(Q),RC,165,40,30),A.tx(FR(),RC,330,28,"o")];
   const H=hatchCells(e.f);return{kind:"frac",ans:[c,36],show:`${c}/36`,hc:c>=3?1:0,q,sol:[...H,A.tx(UTF(c),RC,386,30,"g"),...pFrac("P =",c,36,600,440,"g",40)]}}
  /* the probability in percent, rounded to a whole number */
  if(Math.random()<.25){let s;do{s=rint(2,12)}while(s===7);const f=(r,b)=>r+b===s,c=countCells(f),ans=Math.round(c*100/36);
   const Q=t3(wrap(`Hur stor är sannolikheten att summan blir ${s}?`,22),wrap(`What is the probability that the sum is ${s}?`,22),wrap(`ما احتمال أن يكون المجموع ${s}؟`,20));
   const q=[A.wipe(),...dgrid(true),A.tx(L(t3("Två tärningar","Two dice","حجرا نرد")),RC,110,36,"b"),...txLines(L(Q),RC,165,42,30),A.tx(L(t3("Svara i procent.","Answer in percent.","أجب بالنسبة المئوية.")),RC,300,28,"o"),A.tx(L(t3("Avrunda till heltal.","Round to a whole number.","قرّب إلى عدد صحيح.")),RC,336,28,"o")];
   const H=hatchCells(f);return{kind:"num",ans,show:pc(ans),hc:H.length,q,sol:[...H,...pFrac("P =",c,36,580,400,"g",34),...hlT(`≈ ${nf(Math.round(c*1000/36)/1000)} ≈ ${pc(ans)}`,RC,470,30)],nt:"prob7-percent"}}
  if(Math.random()<.5){let s;do{s=rint(2,12)}while(s===7);const N=pick([72,108,144,180,216,360]),f=(r,b)=>r+b===s,c=countCells(f),ans=N*c/36;
   const Q=t3(wrap(`Du slår två tärningar ${N} gånger. Ungefär hur många gånger blir summan ${s}?`,22),wrap(`You roll two dice ${N} times. About how many times is the sum ${s}?`,22),wrap(`ترمي حجرَي نرد ${N} مرة. كم مرة تقريبًا يكون المجموع ${s}؟`,20));
   const q=[A.wipe(),...dgrid(true),...txLines(L(Q),RC,110,40,30,"b")];
   const H=hatchCells(f),PF=pFrac("P =",c,36,580,320,"k",38);return{kind:"num",ans,show:String(ans),hc:H.length+PF.length,q,
    sol:[...H,...PF,...hlT(`${N} ${M} ${c}/36 = ${ans}`,RC,430,36)]}}
  const e=pick(CEV);let c=0;for(let h=0;h<2;h++)for(let d=1;d<=6;d++)if(e.f(h,d))c++;
  const x0=90,hw=150,cs=80,y0=200,rh=70,Xc=j=>x0+hw+cs*(j+.5),Yr=r=>y0+rh*(r+1.5),W=hw+6*cs;
  let gr=R.rect(x0,y0,W,rh*3,.3);for(let j=0;j<6;j++)gr+=R.line(x0+hw+cs*j,y0,x0+hw+cs*j,y0+rh*3,.15);for(let r=1;r<3;r++)gr+=R.line(x0,y0+rh*r,x0+W,y0+rh*r,.15);
  const Q=t3(["Du kastar ett mynt och slår en tärning.",...wrap(`Hur stor är sannolikheten att få ${e.t.sv}?`,52)],["You toss a coin and roll a die.",...wrap(`What is the probability of getting ${e.t.en}?`,52)],["ترمي قطعة نقود وحجر نرد.",...wrap(`ما احتمال أن تحصل على ${e.t.ar}؟`,46)]);
  const q=[A.wipe(),...txLines(L(Q),400,52,42,32),A.band(x0+hw+2,y0+2,6*cs-4,rh-4,"b"),A.band(x0+2,y0+rh+2,hw-4,2*rh-4,"o"),A.p(gr,"k",3),
   ...dice([0,1,2,3,4,5].map(j=>[Xc(j),y0+rh/2,j+1]),40,"b"),...L(COIN).map((s,r)=>qe(s,x0+hw/2,Yr(r)+10,30,"o"))];
  const H=[];for(let h=0;h<2;h++)for(let d=1;d<=6;d++)if(e.f(h,d)){const x=Xc(d-1),y=Yr(h);H.push(A.hatch(`M${x-34},${y-29}h68v58h-68Z`,"g"))}
  return{kind:"frac",ans:[c,12],show:`${c}/12`,hc:c>=3?1:0,q:[...q,A.tx(L(t3("Svara med ett bråk.","Answer with a fraction.","أجب بكسر.")),400,462,28,"o")],
   sol:[...H,...pFrac("P =",c,12,650,440,"g",40)]}}
});

/* ---------------------------------------------------------------
   4. prog7: variables, conditions and loops
   --------------------------------------------------------------- */
const VN={sv:{p:"poang",l:"liv",a:"alder",pr:"pris",s:"saldo",w:"vecka",ws:"veckor",b:"bonus",m:"pengar"},en:{p:"score",l:"lives",a:"age",pr:"price",s:"money",w:"week",ws:"weeks",b:"bonus",m:"money"}};
const V=k=>(lang==="sv"?VN.sv:VN.en)[k];
const TF=()=>L(t3(["sant","falskt"],["true","false"],["صحيح","خطأ"]));
const CP={x:40,w:390,y:118,lh:46};
const cy=i=>CP.y+i*CP.lh;
function code(ls,n=ls.length){const o=[A.band(CP.x-8,CP.y-40,CP.w,n*CP.lh+22,"b")];
 ls.forEach((l,i)=>{const [ind,s]=Array.isArray(l)?l:[0,l];o.push(qe(i+1,CP.x+14,cy(i),22,"#8a94a6"),Object.assign(A.tx(s,CP.x+46+ind*34,cy(i),30,"k","start"),{dur:Math.min(1300,Math.max(350,s.length*50))}))});return o}
const lineHL=i=>A.hl(CP.x+36,cy(i)-30,CP.w-60,40);
const strike=(i,ind,len)=>A.p(R.line(CP.x+40+ind*34,cy(i)-10,CP.x+52+ind*34+len*14,cy(i)-10,.2),"r",3.5);
function trace(x,y,heads,ws,rows,rh=42,size=28){const W=ws.reduce((a,b)=>a+b,0),H=(rows.length+1)*rh,cx=ws.map((w,i)=>x+ws.slice(0,i).reduce((a,b)=>a+b,0)+w/2);
 let d=R.rect(x,y,W,H,.3)+R.line(x,y+rh,x+W,y+rh,.2),xx=x;ws.slice(0,-1).forEach(w=>{xx+=w;d+=R.line(xx,y,xx,y+H,.15)});
 const head=[A.band(x+3,y+3,W-6,rh-6,"b"),A.p(d,"k",3),...heads.map((h,i)=>qe(h,cx[i],y+rh*.68,24,"b"))];
 const body=rows.map((r,k)=>r.map((v,i)=>{if(v==null||v==="")return null;const [s,c,sz]=Array.isArray(v)?v:[v,"k"];return qe(s,cx[i],y+rh*(k+1)+rh*.7,sz||(/[\u0600-\u06FF]/.test(s)?Math.min(size,22):size),c)}).filter(Boolean));
 return{head,body}}
const OUTL=t3("Utskrift:","Output:","المُخرَج:");
const out=(v,x,y,size=40)=>hlT(`${L(OUTL)} ${v}`,x,y,size);
const PROG={steps:[
 {say:t3("En variabel är som en låda med ett namn. Raden poang = 0 lägger talet 0 i lådan som heter poang. I kod betyder = ”får värdet”.",
   "A variable is like a box with a name. The line score = 0 puts the number 0 in the box called score. In code, = means “gets the value”.",
   `المتغيّر مثل صندوق له اسم. السطر ${LRI("score = 0")} يضع العدد 0 في الصندوق المسمّى score. في البرمجة تعني = «يأخذ القيمة».`),
  draw:()=>{const P=V("p");return[A.wipe(),...code([`${P} = 0`],2),A.p(R.rect(540,185,200,100,.3),"b",4),A.tx(P,640,168,34,"b"),A.tx("0",590,258,56),
   A.arrow(230,110,528,215,"b",-30),A.tx(L(t3("= betyder ”får värdet”","= means “gets the value”","= تعني «يأخذ القيمة»")),400,430,36,"o")]}},
 {say:t3("Nästa rad: poang = poang + 10. Datorn tar det som finns i lådan, 0, lägger till 10 och lägger tillbaka resultatet. Nu är poang 10.",
   "Next line: score = score + 10. The computer takes what is in the box, 0, adds 10 and puts the result back. Now score is 10.",
   `السطر التالي: ${LRI("score = score + 10")}. يأخذ الحاسوب ما في الصندوق، أي 0، ويضيف إليه 10 ثم يعيد الناتج إلى الصندوق. الآن قيمة score هي 10.`),
  draw:()=>{const P=V("p");return[qe(2,CP.x+14,cy(1),22,"#8a94a6"),Object.assign(A.tx(`${P} = ${P} + 10`,CP.x+46,cy(1),30,"k","start"),{dur:900}),
   A.p(R.line(568,268,612,214,.2),"r",4.5),A.tx("10",688,258,56,"g"),A.arrow(330,168,528,262,"g",28),A.tx("0 + 10 = 10",640,345,42,"g")]}},
 {say:t3("Vi spårar ett program rad för rad i en tabell. Datorn kör raderna uppifrån och ned. Stjärnan * betyder gånger. Till sist skrivs 2 + 100 = 102 ut.",
   "We trace a program line by line in a table. The computer runs the lines from top to bottom. The star * means times. At the end it prints 2 + 100 = 102.",
   "نتتبّع البرنامج سطرًا سطرًا في جدول. ينفّذ الحاسوب الأسطر من الأعلى إلى الأسفل. النجمة * تعني الضرب. وفي النهاية يطبع 2 + 100 = 102."),
  draw:()=>{const Lv=V("l"),P=V("p"),T=trace(462,72,[L(t3("rad","line","السطر")),Lv,P],[80,110,120],[["1","3",""],["2","3","50"],["3",["2","b"],"50"],["4","2",["100","b"]]],46,30);
   return[A.wipe(),...code([`${Lv} = 3`,`${P} = 50`,`${Lv} = ${Lv} - 1`,`${P} = ${P} * 2`,`print(${Lv} + ${P})`]),...T.head,...T.body.flat(),
    A.tx("2 + 100 = 102",617,365,36,"b"),...out("102",400,452,44)]}},
 {say:t3("Ett villkor låter programmet välja väg. Biobiljetten kostar 90 kr om du är under 16, annars 130 kr. 14 < 16 är sant, så raden under if körs och else hoppas över.",
   "A condition lets the program choose a path. A cinema ticket costs 90 kr if you are under 16, otherwise 130 kr. 14 < 16 is true, so the line under if runs and else is skipped.",
   `الشرط يجعل البرنامج يختار طريقًا. ثمن تذكرة السينما 90 كرونة إذا كان العمر أقل من 16، وإلا فثمنها 130 كرونة. ${LRI("14 < 16")} صحيح، لذلك يُنفَّذ السطر الذي تحت if ويُتجاوَز else.`),
  draw:()=>{const a=V("a"),p=V("pr"),S=TF();
   return[A.wipe(),...code([`${a} = 14`,`if ${a} < 16:`,[1,`${p} = 90`],"else:",[1,`${p} = 130`],`print(${p})`]),
    A.p("M610,95L720,150L610,205L500,150Z","b",3.5),qe(`${a} < 16 ?`,610,160,28,"b"),
    A.p(R.rect(462,262,136,54,.3)+R.rect(642,262,136,54,.3)+R.rect(530,380,160,54,.3),"k",3.5),
    qe(`${p} = 90`,530,298,26),qe(`${p} = 130`,710,298,26),qe(`print(${p})`,610,416,26),
    A.arrow(500,152,524,256,"g",26),A.arrow(720,152,696,256,"r",-26),qe(S[0],466,130,26,"g"),qe(S[1],756,130,26,"r"),
    A.arrow(540,320,590,374,"k"),A.arrow(700,320,630,374,"k"),
    lineHL(2),strike(4,1,`${p} = 130`.length),A.p(R.line(652,272,768,308,.2)+R.line(652,308,768,272,.2),"r",3),...out("90",235,456,40)]}},
 {say:t3("En loop upprepar kod. range(4) ger vecka värdena 0, 1, 2 och 3, så den indragna raden körs 4 gånger. Du sparar 50 kr varje vecka: 150, 200, 250, 300.",
   "A loop repeats code. range(4) gives week the values 0, 1, 2 and 3, so the indented line runs 4 times. You save 50 kr every week: 150, 200, 250, 300.",
   `الحلقة تكرّر الأوامر. ${LRI("range(4)")} يعطي week القيم 0 و1 و2 و3، فيُنفَّذ السطر المُزاح 4 مرات. تدّخر 50 كرونة كل أسبوع: 150، 200، 250، 300.`),
  draw:()=>{const s=V("s"),w=V("w"),T=trace(500,76,[w,s],[120,150],[[L(t3("start","start","البداية")),"100"],["0","150"],["1","200"],["2","250"],["3",["300","g"]]],46,30);
   return[A.wipe(),...code([`${s} = 100`,`for ${w} in range(4):`,[1,`${s} = ${s} + 50`],`print(${s})`]),A.arrow(410,cy(2)-12,410,cy(1)-14,"o",-26),
    A.tx("range(4): 0, 1, 2, 3",235,336,30,"o"),...T.head,...T.body.flat(),...out("300",235,438,40)]}},
 {say:t3("En while-loop upprepar så länge villkoret är sant. Hörlurarna kostar 400 kr och du sparar 80 kr i veckan. När saldo är 420 är villkoret falskt och loopen slutar. Svaret blir 4 veckor.",
   "A while loop repeats as long as the condition is true. The headphones cost 400 kr and you save 80 kr a week. When money is 420 the condition is false and the loop stops. The answer is 4 weeks.",
   `حلقة while تتكرّر ما دام الشرط صحيحًا. ثمن السماعات 400 كرونة وتدّخر 80 كرونة كل أسبوع. عندما تصبح ${LRI("money = 420")} يصير الشرط خطأً وتتوقف الحلقة. الجواب 4 أسابيع.`),
  draw:()=>{const s=V("s"),w=V("ws"),S=TF(),T=trace(458,62,[`${s} < 400`,s,w],[136,88,88],[["","100","0"],[[S[0],"g"],"180","1"],[[S[0],"g"],"260","2"],[[S[0],"g"],"340","3"],[[S[0],"g"],"420",["4","g"]],[[S[1],"r"],"",""]],44,28);
   return[A.wipe(),...code([`${s} = 100`,`${w} = 0`,`while ${s} < 400:`,[1,`${s} = ${s} + 80`],[1,`${w} = ${w} + 1`],`print(${w})`]),...T.head,...T.body.flat(),...out("4",235,456,40)]}}
]};
LESSONS.push({id:"prog7",subject:"math",grades:"7",kind:"wb",
 title:t3("Programmering: variabler, villkor och loopar","Programming: variables, conditions and loops","البرمجة: المتغيّرات والشروط والحلقات"),
 icon:ICO(`<rect x="26" y="22" width="268" height="136" rx="12" fill="#2257c9" fill-opacity=".08" stroke="#2257c9" stroke-width="3"/>${[["x = 0",0,58],["for i in range(3):",0,94],["x = x + 5",1,130]].map(([s,ind,y])=>`<text x="${48+ind*30}" y="${y}" font-family="Caveat,cursive" font-weight="700" font-size="30" fill="#1d2433" direction="ltr">${s}</text>`).join("")}<path d="M262 124Q292 104 262 84" stroke="#e07b00" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M262 84L276 82M262 84L270 96" stroke="#e07b00" stroke-width="4" stroke-linecap="round"/>`),
 steps:PROG.steps,mount:wbMount(PROG),
 gen(level){const S=TF(),TQT=pick([t3("Vad skriver programmet ut?","What does the program print?","ماذا يطبع البرنامج؟"),t3("Vad blir utskriften?","What is the output?","ما المُخرَج؟"),t3("Vilket tal skrivs ut?","Which number is printed?","أي عدد يُطبع؟")]),TQ=()=>A.tx(L(TQT),400,48,34);
  /* how many times does the loop run? range stops before the last number */
  if(level===1&&Math.random()<.3){const two=Math.random()<.6,a=two?rint(1,5):0,b=a+rint(3,7),n=b-a,K=rint(2,9),rg=two?`range(${a}, ${b})`:`range(${b})`,ls=["s = 0",`for i in ${rg}:`,[1,`s = s + ${K}`],"print(s)"];
   const iv=Array.from({length:n},(_,i)=>a+i).join(", ");
   return{kind:"num",ans:n,show:String(n),hc:1,q:[A.wipe(),A.tx(L(t3("Hur många gånger körs loopen?","How many times does the loop run?","كم مرة تُنفَّذ الحلقة؟")),400,48,34),...code(ls)],
    sol:[A.tx(L(t3("range slutar före sista talet","range stops before the last number","range يتوقف قبل العدد الأخير")),615,150,26,"o"),A.tx(`i = ${iv}`,615,230,Math.min(32,560/iv.length),"b"),lineHL(2),...out(n*K,615,330,32),...hlT(L(t3(`${n} gånger`,`${n} times`,`${n} مرات`)),615,430,40)],nt:"prog7-count"}}
  if(level===0){const [a,b]=pick([["a","b"],["x","y"],["m","n"]]);let L3,L4,rows,ans,expr,ls;
   for(;;){const va=rint(2,9),k1=rint(2,6),o1=pick(["+","*"]),vb=o1==="+"?va+k1:va*k1,t=rint(0,3);let va2=va,vb2=vb;
    if(t===0){va2=vb-va;L3=`${a} = ${b} - ${a}`}else if(t===1){va2=va+vb;L3=`${a} = ${a} + ${b}`}else if(t===2){vb2=vb*2;L3=`${b} = ${b} * 2`}else{const k=rint(1,Math.max(1,vb-1));vb2=vb-k;L3=`${b} = ${b} - ${k}`}
    const p=rint(0,3);if(p===0){ans=va2+vb2;L4=`print(${a} + ${b})`;expr=`${va2} + ${vb2} = ${ans}`}else if(p===1){ans=vb2-va2;L4=`print(${b} - ${a})`;expr=`${vb2} - ${va2} = ${ans}`}else if(p===2){ans=va2;L4=`print(${a})`;expr=null}else{ans=vb2;L4=`print(${b})`;expr=null}
    rows=[["1",va,""],["2",va,[vb,"b"]],["3",t<2?[va2,"b"]:va2,t<2?vb2:[vb2,"b"]]];
    if(ans>0&&ans<=200&&va2>0&&vb2>0){ls=[`${a} = ${va}`,`${b} = ${a} ${o1} ${k1}`,L3,L4];break}}
   const T=trace(470,90,[L(t3("rad","line","السطر")),a,b],[80,110,110],rows.map(r=>r.map(v=>Array.isArray(v)?[String(v[0]),v[1]]:String(v))),46,30);
   const sol=[...T.head,...T.body[0],...T.body[1],...T.body[2],...(expr?[A.tx(expr,620,350,36,"b")]:[]),...out(ans,620,432,40)];
   return{kind:"num",ans,show:String(ans),hc:T.head.length+T.body[0].length+T.body[1].length,q:[A.wipe(),TQ(),...code(ls)],sol}}
  if(level===1){const P=V("p"),B=V("b");let v1,K,G,cmp,ok,b1,b2;
   do{v1=rint(10,60);K=rint(3,15);const v2=v1+K;cmp=pick([">=",">","<"]);G=v2+rint(-6,6);ok=cmp===">="?v2>=G:cmp===">"?v2>G:v2<G;b1=pick([10,20,50]);b2=pick([0,5])}while(G<=0);
   const v2=v1+K,bon=ok?b1:b2,ans=v2+bon,ls=[`${P} = ${v1}`,`${P} = ${P} + ${K}`,`if ${P} ${cmp} ${G}:`,[1,`${B} = ${b1}`],"else:",[1,`${B} = ${b2}`],`print(${P} + ${B})`];
   const run=ok?3:5,skip=ok?5:3;
   const sol=[A.tx(`${P} = ${v1} + ${K} = ${v2}`,615,130,32,"b"),A.tx(`${v2} ${cmp} ${G}`,615,210,40),A.tx(S[ok?0:1],615,258,34,ok?"g":"r"),
    lineHL(run),strike(skip,1,`${B} = ${ok?b2:b1}`.length),A.tx(`${v2} + ${bon} = ${ans}`,615,340,36,"b"),...out(ans,615,430,40)];
   return{kind:"num",ans,show:String(ans),hc:1,q:[A.wipe(),TQ(),...code(ls)],sol}}
  const t=rint(0,3);let ls,heads,ws,rows,ans,x=500;
  if(t<3){const N=t===2?rint(3,5):rint(3,5),S0=t===0?pick([0,5,10,20,50]):t===1?rint(0,10):rint(1,5),K=rint(3,12);let s=S0;rows=[[L(t3("start","start","البداية")),String(S0)]];
   for(let i=0;i<N;i++){s=t===0?s+K:t===1?s+i:s*2;rows.push([String(i),String(s)])}ans=s;rows[rows.length-1][1]=[String(s),"g"];
   ls=[`s = ${S0}`,`for i in range(${N}):`,[1,t===0?`s = s + ${K}`:t===1?"s = s + i":"s = s * 2"],"print(s)"];heads=["i","s"];ws=[120,150]}
  else{const m=V("m"),w=V("ws");let S0,K,n,Mx;
   for(;;){S0=pick([0,50,100,150]);K=pick([30,40,50,60,70,80]);n=rint(3,5);const lo=S0+K*(n-1),hi=S0+K*n,c=[];for(let v=Math.floor(lo/50)*50+50;v<=hi;v+=50)c.push(v);if(c.length){Mx=pick(c);break}}
   let s=S0,k=0;rows=[["",String(S0),"0"]];while(s<Mx){s+=K;k++;rows.push([[S[0],"g"],String(s),String(k)])}rows[rows.length-1][2]=[String(k),"g"];rows.push([[S[1],"r"],"",""]);ans=k;
   ls=[`${m} = ${S0}`,`${w} = 0`,`while ${m} < ${Mx}:`,[1,`${m} = ${m} + ${K}`],[1,`${w} = ${w} + 1`],`print(${w})`];heads=[`${m} < ${Mx}`,m,w];ws=[136,88,88];x=458}
  const T=trace(x,72,heads,ws,rows,42,28);
  return{kind:"num",ans,show:String(ans),hc:T.head.length+T.body[0].length+T.body[1].length,q:[A.wipe(),TQ(),...code(ls)],sol:[...T.head,...T.body.flat(),...out(ans,615,462,38)]}}
});

/* ---------------- simpler explanations and hints ---------------- */
const slice=(x,y,c="o")=>A.p(`M${x},${y}L${x-30},${y+84}Q${x},${y+98} ${x+30},${y+84}Z`,c,4);
const kid=(cx,base,h,c)=>{const hr=h*.13,top=base-h;return A.p(R.circ(cx,top+hr,hr)+R.line(cx,top+2*hr,cx,base-h*.42,.2)+R.line(cx,base-h*.42,cx-h*.14,base,.2)+R.line(cx,base-h*.42,cx+h*.14,base,.2)+R.line(cx-h*.2,top+h*.42,cx+h*.2,top+h*.42,.2),c,4)};
Object.assign(HELPX,{
 prop7:[{say:t3("Tänk på pizzabitar som kostar 25 kr styck. 1 bit kostar 25 kr, 2 bitar 50 kr och 3 bitar 75 kr. Dubbelt så många bitar kostar dubbelt så mycket.",
   "Think of pizza slices that cost 25 kr each. 1 slice costs 25 kr, 2 slices 50 kr and 3 slices 75 kr. Twice as many slices cost twice as much.",
   "فكّر في قطع بيتزا ثمن الواحدة 25 كرونة. قطعة واحدة بـ25 كرونة، وقطعتان بـ50 كرونة، و3 قطع بـ75 كرونة. ضعف عدد القطع يكلّف ضعف الثمن."),
  draw:()=>{const G=[[150,[150]],[400,[370,430]],[650,[590,650,710]]],o=[];
   G.forEach(([cx,xs],i)=>{xs.forEach(x=>{o.push(slice(x,90),A.p(dots([[x-4,140],[x+8,160],[x-8,168]]),"r",10))});o.push(A.tx(`${(i+1)*25} kr`,cx,250,44,"g"),qe(L(t3(`${i+1} ${i?"bitar":"bit"}`,`${i+1} ${i?"slices":"slice"}`,i?`${i+1} قطع`:"قطعة واحدة")),cx,300,30))});
   o.push(...hlT(L(t3(`pris = 25 ${MUL()} antal bitar`,`price = 25 ${MUL()} number of slices`,`الثمن = 25 × عدد القطع`)),400,410,40));return o}},
  {say:t3("Om pizzerian tar 40 kr för utkörning är det inte längre proportionellt. 1 bit kostar då 65 kr, men 2 bitar kostar 90 kr, inte dubbelt så mycket.",
   "If the pizzeria charges 40 kr for delivery, it is no longer proportional. Then 1 slice costs 65 kr, but 2 slices cost 90 kr, not twice as much.",
   "إذا أخذ المطعم 40 كرونة مقابل التوصيل، لم يعد الأمر تناسبًا طرديًا. عندها تكلّف القطعة الواحدة 65 كرونة، لكن القطعتين تكلّفان 90 كرونة، وليس ضعف الثمن."),
  draw:()=>[A.tx(L(t3("utkörning: 40 kr","delivery: 40 kr","التوصيل: 40 كرونة")),400,70,40,"o"),slice(220,110),slice(520,110),slice(580,110),
   A.tx("40 + 25 = 65 kr",220,270,36),A.tx("40 + 50 = 90 kr",550,270,36),A.tx(`90 ≠ 2 ${MUL()} 65`,400,370,48,"r"),
   A.tx(L(t3("inte proportionellt","not proportional","ليس تناسبًا طرديًا")),400,440,36,"r")]}],
 stat7:[{say:t3("Staplar är som torn bredvid varandra: bra för att jämföra. En linje är som en vandringsled upp och ner över tid. En cirkel är som en pizza: alla bitar blir tillsammans en hel.",
   "Bars are like towers side by side: good for comparing. A line is like a hiking trail going up and down over time. A circle is like a pizza: all the slices together make one whole.",
   "الأعمدة مثل أبراج متجاورة: مناسبة للمقارنة. والخط مثل درب جبلي يصعد وينزل مع الزمن. والدائرة مثل البيتزا: كل القطع معًا تكوّن شيئًا كاملًا."),
  draw:()=>{const o=[];[[90,3,"b"],[140,5,"g"],[190,2,"o"]].forEach(([x,n,c])=>o.push(A.p([...Array(n)].map((_,k)=>R.rect(x-22,330-(k+1)*44,44,44,.2)).join(""),c,4)));
   o.push(A.p(R.line(50,330,230,330,.3),"k",4));
   const T=[[290,320],[330,260],[370,280],[420,180],[460,220],[510,140]];o.push(A.p(plines(T,false),"k",4.5),kid(330,256,52,"b"),A.p(R.line(270,330,530,330,.3),"k",4));
   o.push(A.p(R.circ(660,240,95),"o",5),A.p([0,1,2,3,4,5].map(i=>{const a=i*Math.PI/3;return R.line(660,240,660+95*Math.cos(a),240+95*Math.sin(a),.3)}).join(""),"o",3.5),
    A.p(dots([[630,205],[690,215],[640,275],[700,270],[665,180]]),"r",14));
   L(CHU).forEach((s,i)=>o.push(A.tx(s,[140,400,660][i],410,30,SC[i])));return o}}],
 prob7:[{say:t3("Tänk på en biosalong med 6 rader och 6 platser i varje rad. Den röda tärningen väljer raden och den blå väljer platsen. Det finns 36 platser, alltså 36 utfall.",
   "Think of a cinema with 6 rows and 6 seats in each row. The red die picks the row and the blue die picks the seat. There are 36 seats, so 36 outcomes.",
   "فكّر في قاعة سينما فيها 6 صفوف، وفي كل صف 6 مقاعد. حجر النرد الأحمر يختار الصف، والأزرق يختار المقعد. هناك 36 مقعدًا، أي 36 ناتجًا."),
  draw:()=>{const X=j=>200+j*58,Y=i=>110+i*52,o=[A.p(R.rect(170,42,350,32,.3),"k",3),qe(L(t3("filmduk","screen","الشاشة")),345,67,26)];
   o.push(A.p([0,1,2,3,4,5].flatMap(i=>[0,1,2,3,4,5].map(j=>R.rect(X(j),Y(i),44,38,.2))).join(""),"b",3));
   [0,1,2,3,4,5].forEach(k=>{o.push(qt(k+1,150,Y(k)+28,26,"r"),qt(k+1,X(k)+22,Y(6)+18,26,"b"))});
   o.push(A.hatch(`M${X(3)},${Y(2)}h44v38h-44Z`,"g"),A.loop(X(3)+22,Y(2)+19,32,28,"g"),A.tx(L(t3("rad 3, plats 4","row 3, seat 4","الصف 3، المقعد 4")),660,190,32,"g"),A.tx(`6 ${MUL()} 6 = 36`,660,300,44));return o}},
  {say:t3("Summan 7 kan bli på sex sätt: 1 + 6, 2 + 5, 3 + 4, 4 + 3, 5 + 2 och 6 + 1. Summan 2 bara på ett sätt: 1 + 1. Därför är 7 mycket vanligare.",
   "The sum 7 can happen in six ways: 1 + 6, 2 + 5, 3 + 4, 4 + 3, 5 + 2 and 6 + 1. The sum 2 only in one way: 1 + 1. That is why 7 is much more common.",
   "المجموع 7 يأتي بست طرق: 1 + 6 و2 + 5 و3 + 4 و4 + 3 و5 + 2 و6 + 1. أما المجموع 2 فبطريقة واحدة فقط: 1 + 1. لذلك المجموع 7 أكثر تكرارًا بكثير."),
  draw:()=>[A.tx(L(t3("summan 7","the sum 7","المجموع 7")),250,70,40,"g"),...[1,2,3,4,5,6].flatMap(r=>[qt(r,215,92+r*55,36,"r"),qt("+",250,92+r*55,36),qt(7-r,285,92+r*55,36,"b")]),
   A.tx(L(t3("6 sätt","6 ways","6 طرق")),250,470,36,"g"),A.p(R.line(420,60,420,460,.2),"k",2),
   A.tx(L(t3("summan 2","the sum 2","المجموع 2")),600,70,40,"r"),qt(1,565,147,36,"r"),qt("+",600,147,36),qt(1,635,147,36,"b"),A.tx(L(t3("1 sätt","1 way","طريقة واحدة")),600,470,36,"r")]}],
 prog7:[{say:t3("Ett program är som ett recept: datorn gör ett steg i taget, uppifrån och ned. En variabel är som poängtavlan i ett spel: den visar ett tal som kan ändras.",
   "A program is like a recipe: the computer does one step at a time, from top to bottom. A variable is like the scoreboard in a game: it shows a number that can change.",
   "البرنامج مثل وصفة طبخ: ينفّذ الحاسوب خطوة واحدة في كل مرة، من الأعلى إلى الأسفل. والمتغيّر مثل لوحة النقاط في لعبة: تعرض عددًا يمكن أن يتغيّر."),
  draw:()=>[A.p(R.rect(250,90,300,170,.3),"k",5),A.tx(L(t3("POÄNG","SCORE","النقاط")),400,140,40,"b"),A.tx("0",320,225,60),A.p(R.line(300,232,340,185,.2),"r",4.5),
   A.tx("10",410,225,60),A.p(R.line(388,232,432,185,.2),"r",4.5),A.tx("20",495,225,60,"g"),
   A.tx(L(t3("+10 poäng","+10 points","+10 نقاط")),220,340,34,"o"),A.tx(L(t3("+10 poäng","+10 points","+10 نقاط")),580,340,34,"o"),
   A.tx(L(t3("Samma låda, nytt värde.","Same box, new value.","الصندوق نفسه، والقيمة جديدة.")),400,440,38,"g")]},
  {say:t3("Ett villkor är som: om det regnar tar du paraply, annars keps. En loop är som: gör 3 armhävningar, samma sak flera gånger.",
   "A condition is like: if it rains, take an umbrella, otherwise a cap. A loop is like: do 3 push-ups, the same thing several times.",
   "الشرط مثل: إذا أمطرت فخذ مظلة، وإلا فخذ قبعة. والحلقة مثل: قم بـ3 تمارين ضغط، أي الشيء نفسه عدة مرات."),
  draw:()=>[A.p("M110,150Q100,105 145,105Q160,70 200,85Q235,70 250,110Q285,115 270,150Z","b",4),A.p(R.line(140,170,130,200,.2)+R.line(185,170,175,200,.2)+R.line(230,170,220,200,.2),"b",3.5),
   A.tx(L(t3("om regn: paraply","if rain: umbrella","إذا أمطرت: مظلة")),190,280,32,"b"),A.tx(L(t3("annars: keps","else: cap","وإلا: قبعة")),190,330,32,"o"),
   A.p(R.line(400,70,400,420,.2),"k",2),
   A.p("M548,190A62,62 0 1 1 600,222","o",5),A.p("M600,222l-16,-10M600,222l-14,12","o",5),A.tx("3 ×",600,176,48,"o"),
   A.p(R.circ(530,330,30)+R.circ(600,330,30)+R.circ(670,330,30),"b",4),qt("1",530,342,32,"b"),qt("2",600,342,32,"b"),qt("3",670,342,32,"b"),
   A.tx(L(t3("samma sak 3 gånger","the same thing 3 times","الشيء نفسه 3 مرات")),600,430,32,"g")]}]
});
Object.assign(HINTSX,{
 prop7:[{say:t3("Räkna ut k: dela y med x i en kolumn där båda talen finns. Multiplicera sedan k med x under frågetecknet.","Find k: divide y by x in a column where both numbers are given. Then multiply k by the x under the question mark.","احسب k: اقسم y على x في عمود فيه العددان. ثم اضرب k في قيمة x التي تحت علامة الاستفهام."),cut:g=>g.sol.slice(0,g.hc)},
  {say:t3("Läs av punktens x och y. Dela sedan y med x.","Read the x and y of the point. Then divide y by x.","اقرأ إحداثيي النقطة x وy، ثم اقسم y على x."),cut:g=>g.sol.slice(0,g.hc)},
  {say:t3("Räkna först ut hur mycket 1 enhet motsvarar. Multiplicera sedan med det nya antalet.","First work out how much 1 unit is worth. Then multiply by the new amount.","احسب أولًا ما تقابله الوحدة الواحدة، ثم اضرب في العدد الجديد."),cut:g=>g.sol.slice(0,g.hc)}],
 stat7:[{say:t3("Gå vågrätt från varje punkt till y-axeln och läs av värdet. Subtrahera sedan.","Go across from each point to the y-axis and read the value. Then subtract.","اتجه أفقيًا من كل نقطة إلى محور y واقرأ القيمة، ثم اطرح."),cut:g=>g.sol.slice(0,g.hc)},
  {say:t3("Skriv procenten i decimalform och multiplicera med totalen.","Write the percentage as a decimal and multiply by the total.","اكتب النسبة المئوية عددًا عشريًا واضربه في المجموع الكلي."),cut:g=>g.sol.slice(0,g.hc)},
  {say:t3("Fråga dig: jämför jag grupper, visar jag förändring över tid eller delar av en helhet?","Ask yourself: am I comparing groups, showing change over time or showing parts of a whole?","اسأل نفسك: هل أقارن مجموعات، أم أعرض تغيّرًا مع الزمن، أم أجزاء من كل؟"),cut:g=>g.sol.slice(0,g.hc)}],
 prob7:[{say:t3("Leta upp alla rutor med rätt summa och räkna dem. Det finns 36 rutor totalt.","Find all the squares with the right sum and count them. There are 36 squares in total.","ابحث عن كل المربعات التي فيها المجموع المطلوب وعُدّها. في الجدول 36 مربعًا."),cut:g=>g.sol.slice(0,g.hc)},
  {say:t3("Markera rutorna där händelsen inträffar och räkna dem. Skriv antalet gynnsamma utfall delat med 36.","Mark the squares where the event happens and count them. Write the favourable outcomes over 36.","حدّد المربعات التي يقع فيها الحدث وعُدّها، ثم اكتب عدد النواتج المواتية على 36."),cut:g=>g.sol.slice(0,g.hc)},
  {say:t3("Räkna de gynnsamma rutorna och dela med alla rutor. Gäller det många kast multiplicerar du sannolikheten med antalet kast.","Count the favourable squares and divide by all the squares. For many rolls, multiply the probability by the number of rolls.","عُدّ المربعات المواتية واقسم على عدد المربعات كلها. وإذا كان السؤال عن رميات كثيرة فاضرب الاحتمال في عدد الرميات."),cut:g=>g.sol.slice(0,g.hc)}],
 prog7:[{say:t3("Gå rad för rad och skriv upp värdet på varje variabel efter varje rad.","Go line by line and write down the value of each variable after every line.","تتبّع البرنامج سطرًا سطرًا، واكتب قيمة كل متغيّر بعد كل سطر."),cut:g=>g.sol.slice(0,g.hc)},
  {say:t3("Räkna först ut variabelns värde. Är villkoret sant körs raden under if, annars raden under else.","First work out the value of the variable. If the condition is true, the line under if runs, otherwise the line under else.","احسب أولًا قيمة المتغيّر. إذا كان الشرط صحيحًا نُفّذ السطر الذي تحت if، وإلا نُفّذ السطر الذي تحت else."),cut:g=>g.sol.slice(0,g.hc)},
  {say:t3("Gör en tabell med en rad för varje varv i loopen. Kom ihåg att range börjar på 0.","Make a table with one row for each lap of the loop. Remember that range starts at 0.","اصنع جدولًا فيه سطر لكل دورة من الحلقة. وتذكّر أن range يبدأ من 0."),cut:g=>g.sol.slice(0,g.hc)}]
});
}
