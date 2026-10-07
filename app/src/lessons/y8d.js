import {A,DIVS,HELPX,HINTSX,L,LESSONS,MUL,R,dots,f1,fmt,lang,pick,rint,shuffle,t3,wbMount} from "../legacy/core.js";
/* ===== y8d.js ===== */
/* =====================================================================
   YEAR 8 (y8d): linear functions y = kx + m, arithmetic sequences,
   spread and box plots, tree diagrams. Everything sits in one block so
   the helper names never clash with the other lesson files.
   ===================================================================== */
{
const ISO8=s=>"⁦"+s+"⁩";                 /* keeps maths left-to-right inside Arabic text */
const mn=n=>n<0?"−"+(-n):String(n);                /* real minus sign */
const decs=x=>{x=Math.abs(x);let k=0;while(k<4&&Math.abs(x*10**k-Math.round(x*10**k))>1e-9)k++;return k};
const dnl=(x,l)=>{x=Math.round(x*1e6)/1e6;const a=Math.abs(x),s=a.toFixed(decs(a));return(x<0?"−":"")+(l==="sv"?s.replace(".",","):s)};
const dn=x=>dnl(x,lang);
const t3n=f=>t3(f("sv"),f("en"),ISO8(f("ar")));    /* a maths string in each language's notation */
const tq=(s,x,y,size,c="k",anc)=>Object.assign(A.tx(s,x,y,size,c,anc),{dur:170});
const pc=n=>lang==="en"?`${n}%`:`${n} %`;
const wrapT=(s,max)=>{const o=[];let cur="";String(s).replace(/(\d) (?=\d{3}\b)/g,"$1 ").split(" ").forEach(w=>{if(cur&&(cur+" "+w).length>max){o.push(cur);cur=w}else cur=cur?cur+" "+w:w});if(cur)o.push(cur);return o};
/* balanced wrap: same number of lines as wrapT, but with lines of about equal length (no lonely last word) */
const wrapB=(s,max)=>{const n=wrapT(s,max).length;if(n<2)return[String(s)];let m=Math.ceil(String(s).length/n);while(wrapT(s,m).length>n)m++;return wrapT(s,m)};
const paraT=(s,y,size,max,gap,c="k")=>wrapB(s,max).map((l,i)=>A.tx(l,400,y+i*gap,size,c));
const hlC=(cx,y,w,h=62)=>A.hl(cx-w/2,y-h*.72,w,h);  /* highlighter centred under a text with baseline y */
const twd=(s,size)=>String(s).length*size*.46;
const ICO8=b=>`<svg viewBox="0 0 320 180"><rect width="320" height="180" fill="#fff"/>${b}</svg>`;
const CV8=`font-family="Caveat,cursive" font-weight="700" text-anchor="middle" direction="ltr"`;

/* =====================================================================
   1. lin8: linear functions y = kx + m
   ===================================================================== */
/* coordinate grid. o: {xa,xb,ya,yb,xs,ys,box:[x,y,w,h],sq,xt,yt} */
function cgrid(o){const xs=o.xs||1,ys=o.ys||1,[bx,by,bw,bh]=o.box,nx=(o.xb-o.xa)/xs,ny=(o.yb-o.ya)/ys,um=o.umax||52;
 let ux=bw/nx,uy=bh/ny;if(o.sq!==false)ux=uy=Math.min(ux,uy,um);
 const W=nx*ux,H=ny*uy,L0=bx+(bw-W)/2,T0=by+(bh-H)/2,X=x=>L0+(x-o.xa)/xs*ux,Y=y=>T0+(o.yb-y)/ys*uy,out=[];
 let g="";for(let i=0;i<=nx;i++)g+=`M${f1(L0+i*ux)},${f1(T0)}v${f1(H)}`;for(let j=0;j<=ny;j++)g+=`M${f1(L0)},${f1(T0+j*uy)}h${f1(W)}`;
 out.push(A.p(g,"#c9d3e6",1.6));
 const ax=X(Math.max(o.xa,Math.min(0,o.xb))),ay=Y(Math.max(o.ya,Math.min(0,o.yb)));
 out.push(A.p(R.arrow(L0,ay,L0+W+26,ay),"k",3.5),A.p(R.arrow(ax,T0+H,ax,T0-26),"k",3.5));
 const ev=Math.min(ux,uy)<30?2:1;
 for(let i=0;i<=nx;i++){const v=o.xa+i*xs;if(v===0||Math.round(v/xs)%ev)continue;out.push(tq(mn(v),X(v),ay+27,22))}
 for(let j=0;j<=ny;j++){const v=o.ya+j*ys;if(v===0||Math.round(v/ys)%ev)continue;out.push(tq(mn(v),ax-9,Y(v)+8,22,"k","end"))}
 out.push(tq("0",ax-9,ay+25,22,"k","end"),A.tx(o.xt?L(o.xt):"x",L0+W+36,ay+9,o.xt?24:32,"k","start"),A.tx(o.yt?L(o.yt):"y",ax+16,T0-8,o.yt?24:32,"k",o.yt&&lang==="ar"?"end":"start"));
 return{X,Y,ux,uy,L0,T0,W,H,ax,ay,o:out}}
/* the straight line y = kx + m, clipped to the grid */
function kline(G,k,m,o,c="r"){let lo=o.xa,hi=o.xb;if(k){const p=(o.ya-m)/k,q=(o.yb-m)/k;lo=Math.max(lo,Math.min(p,q));hi=Math.min(hi,Math.max(p,q))}
 return A.p(R.line(G.X(lo),G.Y(k*lo+m),G.X(hi),G.Y(k*hi+m),.3),c,5)}
/* step triangle: dx to the right (orange), then k*dx up or down (blue). arr = arrows, labs = numbers */
const onAx=(G,b)=>b>G.ay-4&&b-20<G.ay+31;   /* a label with baseline b would touch the x-axis or its numbers */
function stepT(G,x0,k,m,dx){const y0=k*x0+m,dy=k*dx,P=[G.X(x0),G.Y(y0)],Q=[G.X(x0+dx),G.Y(y0)],S=[G.X(x0+dx),G.Y(y0+dy)],up=dy>0;
 let ob=up?Q[1]+30:Q[1]-12;if(onAx(G,ob))ob=up?Q[1]-12:Q[1]+30;const vb=(Q[1]+S[1])/2+9;
 return{arr:[A.p(R.arrow(...P,...Q),"o",5),A.p(R.arrow(...Q,...S),"b",5)],bad:onAx(G,ob)||onAx(G,vb),
  labs:[tq("+"+dx,(P[0]+Q[0])/2,ob,26,"o"),tq((up?"+":"−")+dn(Math.abs(dy)),Q[0]+11,vb,26,"b","start")]}}
/* green ring around the point where the line meets the y-axis and its number */
const mLoop=(G,m)=>A.loop(G.ax-16,G.Y(m)-1,36,19,"g");
const eqS=(k,m,l)=>{const ks=k===1?"":k===-1?"−":dnl(k,l);let s=`y = ${ks}x`;if(m)s+=m>0?` + ${dnl(m,l)}`:` − ${dnl(-m,l)}`;return s};
const PH={xa:0,xb:6,ya:0,yb:100,ys:10,box:[70,98,390,352],sq:false,xt:t3("GB","GB","GB"),yt:t3("kr","kr","كرونة")};
const G3={xa:-1,xb:5,ya:-1,yb:9,box:[40,62,420,406]},G4={xa:-1,xb:5,ya:-2,yb:8,box:[40,62,420,406]};
const PC=640;   /* centre of the right-hand panel */
function miniG(cx,k){const ox=cx-50,oy=372,d=k>0?-.6:k<0?.6:0,yl=x=>300+d*(x-ox);
 return[A.p(R.arrow(cx-92,oy,cx+92,oy)+R.arrow(ox,388,ox,206),"k",3),A.p(R.line(cx-82,yl(cx-82),cx+82,yl(cx+82),.3),"r",5),A.p(dots([[ox,300]]),"g",14)]}
const LIN={steps:[
 {say:t3("Ett mobilabonnemang kostar 40 kr i månaden plus 10 kr per GB. Vi prickar in kostnaden y för x GB i ett koordinatsystem.",
   "A phone plan costs 40 kr a month plus 10 kr per GB. We plot the cost y for x GB in a coordinate system.",
   "تكلّف باقة الهاتف 40 كرونة في الشهر، إضافةً إلى 10 كرونات لكل غيغابايت. نعيّن التكلفة y مقابل x غيغابايت في نظام إحداثيات."),
  draw:()=>{const G=cgrid(PH),o=[A.wipe(),...G.o];
   o.push(A.tx("x (GB)",590,128,26,"o"),A.tx(L(t3("y (kr)","y (kr)","y (كرونة)")),700,128,26,"b"),A.p(R.line(535,144,755,144,.3)+R.line(645,98,645,350,.3),"k",3));
   [0,1,2,3,4].forEach(i=>o.push(tq(i,590,184+i*40,30,"o"),tq(40+10*i,700,184+i*40,30,"b")));
   [0,1,2,3].forEach(i=>o.push(tq("+10",768,206+i*40,22,"o")));
   o.push(A.p(dots([0,1,2,3,4,5].map(x=>[G.X(x),G.Y(40+10*x)])),"b",15));return o}},
 {say:t3("Punkterna ligger på en rät linje. Kostnaden är y = 10x + 40. Det är en linjär funktion.",
   "The points lie on a straight line. The cost is y = 10x + 40. That is a linear function.",
   `تقع النقاط على خط مستقيم. التكلفة هي ${ISO8("y = 10x + 40")}، وهذه دالة خطية.`),
  draw:()=>{const G=cgrid(PH);return[kline(G,10,40,PH),A.tx("y = 10x + 40",650,404,44)]}},
 {say:t3("m = 40 är där linjen skär y-axeln: den fasta avgiften. k = 10 är lutningen: ett steg åt höger ger 10 kr uppåt.",
   "m = 40 is where the line crosses the y-axis: the fixed fee. k = 10 is the slope: one step to the right gives 10 kr up.",
   `${ISO8("m = 40")} هو المكان الذي يقطع فيه الخط محور y، أي الرسم الثابت. و${ISO8("k = 10")} هو الميل: كل خطوة إلى اليمين تعني 10 كرونات إلى الأعلى.`),
  draw:()=>{const G=cgrid(PH),T=stepT(G,2,10,40,1);return[mLoop(G,40),...T.arr,...T.labs,A.tx("k = 10",585,466,36,"b"),A.tx("m = 40",715,466,36,"g")]}},
 {say:t3("Läs av linjen. Den skär y-axeln i 1, så m = 1. Ett steg åt höger ger 2 steg upp, så k = 2. Alltså y = 2x + 1.",
   "Read the line. It crosses the y-axis at 1, so m = 1. One step right gives 2 steps up, so k = 2. So y = 2x + 1.",
   `نقرأ الخط: يقطع محور y عند 1، إذن ${ISO8("m = 1")}. خطوة واحدة إلى اليمين تعطي خطوتين إلى الأعلى، إذن ${ISO8("k = 2")}. فالمعادلة ${ISO8("y = 2x + 1")}.`),
  draw:()=>{const G=cgrid(G3),T=stepT(G,1,2,1,1);return[A.wipe(),...G.o,kline(G,2,1,G3),A.tx(L(t3("Läs av k och m","Read off k and m","اقرأ k وm")),PC,110,34),
   mLoop(G,1),A.tx("m = 1",PC,200,42,"g"),...T.arr,...T.labs,A.tx("k = 2",PC,272,42,"b"),hlC(PC,382,250),A.tx("y = 2x + 1",PC,382,46)]}},
 {say:t3("Den här linjen lutar nedåt. Ett steg åt höger ger 2 steg ned, så k = −2. Linjen skär y-axeln i 6: y = −2x + 6.",
   "This line slopes downwards. One step right gives 2 steps down, so k = −2. It crosses the y-axis at 6: y = −2x + 6.",
   `هذا الخط ينحدر إلى الأسفل. خطوة واحدة إلى اليمين تعطي خطوتين إلى الأسفل، إذن ${ISO8("k = −2")}. ويقطع محور y عند 6، فالمعادلة ${ISO8("y = −2x + 6")}.`),
  draw:()=>{const G=cgrid(G4),T=stepT(G,1,-2,6,1);return[A.wipe(),...G.o,kline(G,-2,6,G4),A.tx(L(t3("Linjen lutar nedåt","The line slopes down","الخط ينحدر")),PC,110,34,"r"),
   ...T.arr,...T.labs,A.tx("k = −2",PC,200,42,"b"),mLoop(G,6),A.tx("m = 6",PC,272,42,"g"),hlC(PC,382,260),A.tx("y = −2x + 6",PC,382,46)]}},
 {say:t3("I y = kx + m är k lutningen och m visar var linjen skär y-axeln. Är k positivt går linjen uppåt, är k negativt går den nedåt.",
   "In y = kx + m, k is the slope and m shows where the line crosses the y-axis. If k is positive the line goes up; if k is negative it goes down.",
   `في ${ISO8("y = kx + m")}: k هو الميل، وm يبيّن أين يقطع الخط محور y. إذا كان k موجبًا صعد الخط، وإذا كان سالبًا نزل.`),
  draw:()=>{const C=[160,400,640],cap=[["k > 0",t3("uppåt","up","صاعد")],["k = 0",t3("vågrät","flat","أفقي")],["k < 0",t3("nedåt","down","هابط")]];
   return[A.wipe(),A.tx("y = kx + m",400,74,56),A.tx(L(t3("k = lutningen","k = the slope","k = الميل")),220,140,30,"b"),
    A.tx(L(t3("m = där linjen skär y-axeln","m = where it crosses the y-axis","m = نقطة التقاطع مع محور y")),540,140,30,"g"),
    ...C.flatMap((cx,i)=>[...miniG(cx,[1,0,-1][i]),A.tx(cap[i][0],cx,430,32,"b"),tq(L(cap[i][1]),cx,470,26)])]}}
]};
/* grid that fits the line and the step triangle */
const lfit=(k,m,x0,dx)=>{const v=[m,k*x0+m,k*(x0+dx)+m],lo=Math.min(...v),hi=Math.max(...v),ya=Math.min(-1,Math.floor(lo)-2),yb=Math.max(Math.ceil(hi)+2,ya+8,2);
 return{xa:-1,xb:5,ya,yb,box:[40,48,420,428]}};
/* question text in the right-hand panel */
const paraC=(s,cx,y,size,max,gap,c="k")=>wrapB(s,max).map((l,i)=>A.tx(l,cx,y+i*gap,size,c));
LESSONS.push({id:"lin8",subject:"math",grades:"8",kind:"wb",
 title:t3("Linjära funktioner: y = kx + m","Linear functions: y = kx + m","الدوال الخطية: y = kx + m"),
 icon:ICO8(`<path d="${[60,85,110,135,160,185,210,235,260,285].map(x=>`M${x} 15V160`).join("")}${[20,45,70,95,120,145].map(y=>`M45 ${y}H290`).join("")}" stroke="#dfe5f0" stroke-width="1.5"/><path d="M40 140H292M85 165V12" stroke="#1d2433" stroke-width="3.5" fill="none"/><path d="M62 142L228 17" stroke="#d63b2f" stroke-width="5" stroke-linecap="round"/><path d="M125 95H165" stroke="#e07b00" stroke-width="4.5"/><path d="M165 95V65" stroke="#2257c9" stroke-width="4.5"/><circle cx="85" cy="125" r="7" fill="#1e9e5a"/><text ${CV8} x="236" y="122" font-size="32" fill="#1d2433">y = kx + m</text>`),
 steps:LIN.steps,mount:wbMount(LIN),
 gen(level){let k,m;
  /* level 0: the value of the function for a given x */
  if(level===0&&Math.random()<.25){const k=rint(2,5),m=rint(-5,9),x=rint(2,10),y=k*x+m,M=MUL(),eq=eqS(k,m,lang);
   return{kind:"num",ans:y,show:String(y),hc:1,q:[A.wipe(),A.tx(L(t3("En linjär funktion har formeln","A linear function has the formula","دالة خطية صيغتها")),400,80,36),A.tx(eq,400,180,64,"b"),
     A.tx(L(pick([t3(`Beräkna y när x = ${x}.`,`Calculate y when x = ${x}.`,`احسب y عندما x = ${x}.`),t3(`Vilket värde har y när x = ${x}?`,`What is the value of y when x = ${x}?`,`ما قيمة y عندما x = ${x}؟`)])),400,270,36)],
    sol:[A.tx(`y = ${k} ${M} ${x}${m?(m>0?" + "+m:" − "+(-m)):""}`,400,350,44),hlC(400,440,240,64),A.tx(`y = ${y}`,400,440,50,"g")]}}
  /* level 1, word problem: a phone plan as y = kx + m (fixed fee m, k kr per GB) */
  if(level===1&&Math.random()<.3){const m=pick([39,49,59,79,99,129]),k=pick([5,8,10,12,15,20]),x=rint(2,15),asK=Math.random()<.5;
   const q=[A.wipe(),A.tx(L(t3(`Ett mobilabonnemang kostar ${m} kr i månaden`,`A phone plan costs ${m} kr a month`,`يكلّف اشتراك هاتف ${m} كرونة في الشهر`)),400,70,36),
    A.tx(L(t3(`plus ${k} kr per GB surf.`,`plus ${k} kr per GB of data.`,`إضافةً إلى ${k} كرونة لكل GB.`)),400,120,36),
    A.tx(L(asK?t3("Skriv kostnaden y för x GB som y = kx + m.","Write the cost y for x GB as y = kx + m.","اكتب التكلفة y لعدد x من GB على الصورة y = kx + m."):t3(`Vad kostar en månad med ${x} GB?`,`What does a month with ${x} GB cost?`,`كم تكلّف شهرًا فيه ${x} GB؟`)),400,200,34,"b")];
   if(asK){const s=`k = ${k}, m = ${m}`;
    return{kind:"pair",ans:[k,m],sep:",",labels:["k","m"],show:t3(s,s,ISO8(s)),hc:2,q,sol:[A.tx(L(t3(`fast avgift: m = ${m}`,`fixed fee: m = ${m}`,`الرسم الثابت: m = ${m}`)),400,290,38,"g"),A.tx(L(t3(`per GB: k = ${k}`,`per GB: k = ${k}`,`لكل GB: k = ${k}`)),400,350,38,"b"),hlC(400,440,300,64),A.tx(eqS(k,m,lang),400,440,48,"g")]}}
   const y=k*x+m,M=MUL();
   return{kind:"num",ans:y,show:`${y} kr`,hc:1,q,sol:[A.tx(eqS(k,m,lang),400,290,42),A.tx(`y = ${k} ${M} ${x} + ${m}`,400,360,42),hlC(400,440,260,64),A.tx(`y = ${y} kr`,400,440,48,"g")]}}
  if(level===0){k=rint(1,3);m=rint(0,k===3?3:4)}
  else if(level===1){k=-rint(1,3);m=rint(2,7)}
  else{k=pick([.5,-.5,1.5,-1.5,2,-2,3,-3,1,-1]);m=k>0?pick([-3,-2,-1,1,2,3]):rint(1,4)}
  const dx=Number.isInteger(k)?1:2;let x0,o,G,T;
  for(const c of dx===2?[2,0]:[1,2,0,3]){x0=c;o=lfit(k,m,x0,dx);G=cgrid(o);T=stepT(G,x0,k,m,dx);if(!T.bad)break}
  const D=DIVS();
  const kTxt=dx===1?`k = ${mn(k)}`:`k = ${mn(k*dx)} ${D} ${dx} = ${dn(k)}`;
  const q=[A.wipe(),...paraC(L(level<2?pick([t3("Läs av k och m för den räta linjen.","Read off k and m for the straight line.","اقرأ قيمتَي k وm للخط المستقيم."),t3("Bestäm k och m för den räta linjen.","Find k and m for the straight line.","أوجد k وm للخط المستقيم.")]):pick([t3("Vilken ekvation har linjen?","Which equation does the line have?","ما معادلة هذا الخط؟"),t3("Bestäm linjens ekvation.","Find the equation of the line.","أوجد معادلة الخط.")])),PC,70,32,20,42),
   ...G.o,kline(G,k,m,o),A.tx("y = kx + m",PC,172,40)];
  const sol=[mLoop(G,m),T.arr[0],T.arr[1],A.tx(`m = ${mn(m)}`,PC,246,40,"g"),...T.labs,A.tx(kTxt,PC,312,dx===1?40:32,"b"),hlC(PC,410,270),A.tx(eqS(k,m,lang),PC,410,42,"g")];
  if(level<2){const s=`k = ${mn(k)}, m = ${mn(m)}`;
   return{kind:"pair",ans:[k,m],sep:",",labels:["k","m"],signed:level>0,show:t3(s,s,ISO8(s)),hc:2,q,sol}}
  const pool=[[-k,m],[k,-m],[k,m+k],[m,k]];if(dx===2)pool.push([k*dx,m]);if(Math.abs(k)===2||Math.abs(k)===.5)pool.push([1/k,m]);
  const key=([a,b])=>eqS(a,b,"en"),seen=new Set([key([k,m])]),wrong=[];
  shuffle(pool).forEach(p=>{if(p[0]!==0&&!seen.has(key(p))&&wrong.length<3){seen.add(key(p));wrong.push(p)}});
  const all=shuffle([[k,m],...wrong]),ans=all.findIndex(p=>p[0]===k&&p[1]===m),opts=all.map(([a,b])=>t3n(l=>eqS(a,b,l)));
  return{kind:"choice",opts,ans,show:opts[ans],hc:2,q,sol}}
});

/* =====================================================================
   2. seq8: arithmetic sequences, the formula for term n
   ===================================================================== */
const SUBD={"0":"₀","1":"₁","2":"₂","3":"₃","4":"₄","5":"₅","6":"₆","7":"₇","8":"₈","9":"₉",n:"ₙ"};
const aS=s=>"a"+[...String(s)].map(c=>SUBD[c]||c).join("");          /* aₙ, a₁₀₀ in speech */
/* "aₙ = rhs" centred at cx, with a real subscript */
const aeqC=(sub,rhs,cx,y,s,c="k")=>{const sw=String(sub).length*s*.3,w1=s*.5+sw,w2=twd(`= ${rhs}`,s),x0=cx-(w1+s*.2+w2)/2;
 return[A.tx("a",x0+s*.5,y,s,c,"end"),A.tx(sub,x0+s*.52,y+s*.22,s*.6,c,"start"),A.tx(`= ${rhs}`,x0+w1+s*.2,y,s,c,"start")]};
const fS=(d,c)=>`${d===1?"":d===-1?"−":mn(d)}n${c>0?" + "+c:c<0?" − "+(-c):""}`;
const fSn=(d,c,N)=>`${mn(d)} ${MUL()} ${N}${c>0?" + "+c:c<0?" − "+(-c):""}`;
/* matchstick squares in a row; x,y = top-left corner */
function sticks(x,y,n,s=40){let d="";const h=[];for(let i=0;i<n;i++){d+=R.line(x+i*s+5,y,x+(i+1)*s-5,y,.2)+R.line(x+i*s+5,y+s,x+(i+1)*s-5,y+s,.2);h.push([x+i*s+5,y],[x+i*s+5,y+s])}
 for(let i=0;i<=n;i++){d+=R.line(x+i*s,y+5,x+i*s,y+s-5,.2);h.push([x+i*s,y+5])}return[A.p(d,"#b07a2a",6),A.p(dots(h),"r",10)]}
const SQX=[110,210,350,530],SQC=[130,250,410,610];
const TX=i=>260+i*120;
/* table: n, d·n and aₙ = d·n + c, with arrows. Returns parts so a hint can stop early. */
function seqTab(d,c,y0=105){const nr=y0,dr=y0+100,ar=y0+200,T=[1,2,3,4].map(n=>d*n+c),head=[],diff=[],dnr=[],plus=[];
 head.push(A.p(R.line(196,y0-45,196,ar+22,.3)+R.line(80,nr+22,700,nr+22,.3),"k",3),A.tx("n",125,nr,36,"o"),A.tx("a",120,ar,36,"b","end"),A.tx("n",121,ar+8,22,"b","start"));
 [1,2,3,4].forEach((n,i)=>head.push(tq(n,TX(i),nr,36,"o"),tq(mn(T[i]),TX(i),ar,38,"b")));head.push(tq("…",TX(4)-20,ar,38,"b"));
 [0,1,2].forEach(i=>diff.push(A.arrow(TX(i)+22,ar+18,TX(i+1)-22,ar+18,"o",24),tq((d>0?"+":"−")+Math.abs(d),(TX(i)+TX(i+1))/2,ar+64,28,"o")));
 dnr.push(A.tx(fS(d,0),125,dr,34),...[1,2,3,4].map((n,i)=>tq(mn(d*n),TX(i),dr,36)));
 [0,1,2,3].forEach(i=>plus.push(A.arrow(TX(i),dr+14,TX(i),ar-40,"g"),tq((c<0?"−":"+")+Math.abs(c),TX(i)+12,dr+50,24,"g","start")));
 return{head,diff,dnr,plus,T}}
const SEQ={steps:[
 {say:t3("Ett mönster av tändstickor. Figur 1 har 4 stickor, figur 2 har 7, figur 3 har 10 och figur 4 har 13.",
   "A pattern of matchsticks. Figure 1 has 4 sticks, figure 2 has 7, figure 3 has 10 and figure 4 has 13.",
   "نمط من أعواد الثقاب: في الشكل 1 أربعة أعواد، وفي الشكل 2 سبعة، وفي الشكل 3 عشرة، وفي الشكل 4 ثلاثة عشر."),
  draw:()=>{const o=[A.wipe()];[1,2,3,4].forEach((n,i)=>o.push(...sticks(SQX[i],110,n),A.tx(L(t3(`figur ${n}`,`figure ${n}`,`الشكل ${n}`)),SQC[i],212,28),tq(3*n+1,SQC[i],270,44,"b")));return o}},
 {say:t3("Varje ny figur får 3 stickor till. Talföljden 4, 7, 10, 13, … ökar med 3 hela tiden.",
   "Each new figure gets 3 more sticks. The sequence 4, 7, 10, 13, … goes up by 3 every time.",
   "كل شكل جديد يزيد 3 أعواد. المتتالية 4، 7، 10، 13، … تزداد بمقدار 3 في كل مرة."),
  draw:()=>[...[0,1,2].flatMap(i=>[A.arrow(SQC[i]+24,290,SQC[i+1]-24,290,"o",28),tq("+3",(SQC[i]+SQC[i+1])/2,346,32,"o")]),
   A.tx(L(t3("Talföljden ökar med 3 varje gång","The sequence goes up by 3 each time","تزداد المتتالية بمقدار 3 في كل مرة")),400,430,34,"b")]},
 {say:t3("aₙ betyder tal nummer n. Talen ökar med 3, så formeln börjar med 3n. Varje tal är 1 mer än 3n, så aₙ = 3n + 1.",
   "aₙ means term number n. The terms go up by 3, so the formula starts with 3n. Each term is 1 more than 3n, so aₙ = 3n + 1.",
   `يعني ${ISO8("aₙ")} الحدَّ رقم n. تزداد الحدود بمقدار 3، فتبدأ الصيغة بـ ${ISO8("3n")}. وكل حد أكبر من ${ISO8("3n")} بواحد، إذن ${ISO8("aₙ = 3n + 1")}.`),
  draw:()=>{const t=seqTab(3,1);return[A.wipe(),...t.head,...t.diff,...t.dnr,...t.plus,hlC(400,446,300,66),...aeqC("n","3n + 1",400,446,50,"g")]}},
 {say:t3("Med formeln slipper vi rita. Figur 100 har 3 · 100 + 1 = 301 stickor.",
   "With the formula we don't need to draw. Figure 100 has 3 × 100 + 1 = 301 sticks.",
   `بالصيغة لا نحتاج إلى الرسم. عدد الأعواد في الشكل 100 هو ${ISO8("3 × 100 + 1 = 301")}.`),
  draw:()=>[A.wipe(),...aeqC("n","3n + 1",400,78,48),...sticks(250,140,3),A.p(dots([[400,160],[425,160],[450,160]]),"k",9),...sticks(470,140,2),
   A.p(`M250,205v10H550v-10`,"o",3.5),A.tx(L(t3("100 rutor","100 squares","100 مربع")),400,250,28,"o"),
   ...aeqC("100",`3 ${MUL()} 100 + 1`,400,330,46),hlC(400,425,300,66),...aeqC("100","301",400,425,50,"g")]},
 {say:t3("Moa har 150 kr och sparar 50 kr i veckan. Efter n veckor har hon 50n + 150 kr. Mobilen kostar 2 150 kr: 50n + 150 = 2 150 ger n = 40.",
   "Moa has 150 kr and saves 50 kr a week. After n weeks she has 50n + 150 kr. The phone costs 2,150 kr: 50n + 150 = 2,150 gives n = 40.",
   `مع مُوا 150 كرونة، وتدّخر 50 كرونة كل أسبوع. بعد n من الأسابيع يصبح معها ${ISO8("50n + 150")} كرونة. سعر الهاتف 2150 كرونة: من ${ISO8("50n + 150 = 2150")} نجد ${ISO8("n = 40")}.`),
  draw:()=>{const o=[A.wipe(),A.tx(L(t3("Moa sparar till en ny mobil","Moa is saving for a new phone","تدّخر مُوا لشراء هاتف جديد")),400,52,36),
    A.tx(L(t3("vecka","week","الأسبوع")),120,108,26,"o"),A.tx("kr",120,170,30,"b")];
   [0,1,2,3].forEach(i=>o.push(tq(i+1,TX(i),108,32,"o"),tq(200+50*i,TX(i),170,36,"b")));o.push(tq("…",TX(4)-20,170,36,"b"));
   [0,1,2].forEach(i=>o.push(A.arrow(TX(i)+26,186,TX(i+1)-26,186,"o",18),tq("+50",(TX(i)+TX(i+1))/2,226,24,"o")));
   o.push(...aeqC("n","50n + 150",360,290,42),A.tx("50n + 150",344,352,38,"k","end"),A.tx(`= ${fmt(2150)}`,358,352,38,"k","start"),
    A.tx("50n",344,406,38,"k","end"),A.tx(`= ${fmt(2000)}`,358,406,38,"k","start"),hlC(370,462,170,58),A.tx("n",344,462,40,"g","end"),A.tx("= 40",358,462,40,"g","start"),
    A.p(R.rect(640,290,76,130,.3)+R.rect(652,306,52,92,.2)+R.circ(678,410,5),"k",4),A.tx(`${fmt(2150)} kr`,678,466,30,"r"));return o}},
 {say:t3("En talföljd kan också minska. 20, 17, 14, 11 minskar med 3, så formeln börjar med −3n. Varje tal är 23 mer, så aₙ = −3n + 23.",
   "A sequence can also go down. 20, 17, 14, 11 goes down by 3, so the formula starts with −3n. Each term is 23 more, so aₙ = −3n + 23.",
   `يمكن أن تتناقص المتتالية أيضًا. المتتالية 20، 17، 14، 11 تنقص بمقدار 3، فتبدأ الصيغة بـ ${ISO8("−3n")}. وكل حد أكبر بمقدار 23، إذن ${ISO8("aₙ = −3n + 23")}.`),
  draw:()=>{const t=seqTab(-3,23);return[A.wipe(),...t.head,...t.diff,...t.dnr,...t.plus,hlC(400,446,320,66),...aeqC("n","−3n + 23",400,446,50,"g")]}}
]};
LESSONS.push({id:"seq8",subject:"math",grades:"8",kind:"wb",
 title:t3("Talföljder och formler","Sequences and formulas","المتتاليات والصيغ"),
 icon:ICO8(`${[[30,1],[88,2],[176,3]].map(([x,n])=>{let d="";for(let i=0;i<n;i++)d+=`M${x+i*28+3} 52H${x+i*28+25}M${x+i*28+3} 80H${x+i*28+25}`;for(let i=0;i<=n;i++)d+=`M${x+i*28} 55V77`;return`<path d="${d}" stroke="#b07a2a" stroke-width="4.5" stroke-linecap="round"/>`}).join("")}${[[44,"4"],[116,"7"],[218,"10"]].map(([x,t])=>`<text ${CV8} x="${x}" y="128" font-size="34" fill="#2257c9">${t}</text>`).join("")}<path d="M60 140Q80 156 100 140M135 140Q170 156 205 140" stroke="#e07b00" stroke-width="3" fill="none"/><text ${CV8} x="80" y="172" font-size="22" fill="#e07b00">+3</text><text ${CV8} x="170" y="172" font-size="22" fill="#e07b00">+3</text><text ${CV8} x="282" y="128" font-size="28" fill="#1d2433">3n+1</text>`),
 steps:SEQ.steps,mount:wbMount(SEQ),
 gen(level){const M=MUL();
  /* level 0: the next term (the sequence grows or shrinks by the same number each time) */
  if(level===0&&Math.random()<.25){const d=pick([2,3,4,5,6,7,-2,-3,-4,-5]),a1=d>0?rint(1,15):rint(30,60),T=[0,1,2,3,4].map(i=>a1+i*d),CX=i=>160+i*120;
   const q=[A.wipe(),A.tx(L(pick([t3("Vilket är nästa tal i talföljden?","What is the next term in the sequence?","ما الحد التالي في المتتالية؟"),t3("Talföljden fortsätter på samma sätt. Bestäm nästa tal.","The sequence carries on the same way. Find the next term.","تستمر المتتالية بالطريقة نفسها. أوجد الحد التالي.")])),400,70,34),
    A.p(T.map((v,i)=>R.rect(CX(i)-48,150,96,64,.3)).join(""),"b",3.5),...T.slice(0,4).map((v,i)=>tq(mn(v),CX(i),196,38,"b")),tq("?",CX(4),196,42,"r")];
   const diff=[0,1,2,3].flatMap(i=>[A.arrow(CX(i)+30,224,CX(i+1)-30,224,"o",18),tq((d>0?"+":"−")+Math.abs(d),(CX(i)+CX(i+1))/2,268,26,"o")]);
   return{kind:"num",ans:T[4],show:String(T[4]),signed:T[4]<0,hc:diff.length-2,q,sol:[...diff,hlC(400,400,280,64),A.tx(`${mn(T[3])} ${d>0?"+":"−"} ${Math.abs(d)} = ${mn(T[4])}`,400,400,46,"g")]}}
  /* level 2, word problem: saving the same amount every week, a·n + start = goal */
  if(level===2&&Math.random()<.3){const S=rint(2,6)*50,w=pick([25,50,75,100]),n=rint(8,40),T=S+w*n;
   const q=[A.wipe(),A.tx(L(t3(`Moa har ${S} kr och sparar ${w} kr i veckan.`,`Moa has ${S} kr and saves ${w} kr a week.`,`لدى مُوا ${S} كرونة وتدّخر ${w} كرونة كل أسبوع.`)),400,70,36),
    A.tx(L(t3(`Efter hur många veckor har hon ${fmt(T)} kr?`,`After how many weeks does she have ${fmt(T)} kr?`,`بعد كم أسبوعًا يصبح لديها ${T} كرونة؟`)),400,124,36,"b"),
    A.tx(L(t3("Ställ upp en ekvation och lös den.","Set up an equation and solve it.","كوّن معادلة وحلّها.")),400,178,30)];
   const sol=[A.tx(`${w}n + ${S} = ${fmt(T)}`,400,270,44),A.tx(`${w}n = ${fmt(T-S)}`,400,340,44),hlC(400,420,240,64),A.tx(`n = ${n}`,400,420,50,"g"),
    A.tx(L(t3(`${n} veckor`,`${n} weeks`,`${n} أسبوعًا`)),400,476,30,"g")];
   return{kind:"num",ans:n,show:L(t3(`${n} veckor`,`${n} weeks`,`${n} أسبوعًا`)),hc:1,q,sol}}
  if(level===0){const d=rint(2,9),c=rint(-9,12),N=pick([10,12,15,20,25,30,40,50,100]),ans=d*N+c;
   const q=[A.wipe(),A.tx(L(t3("En talföljd har formeln","A sequence has the formula","صيغة الحد العام لمتتالية هي")),400,86,36),...aeqC("n",fS(d,c),400,176,58),
    A.tx(L(pick([t3(`Vilket är tal nummer ${N} i talföljden?`,`What is term number ${N} in the sequence?`,`ما الحد رقم ${N} في المتتالية؟`),t3(`Bestäm tal nummer ${N} i talföljden.`,`Find term number ${N} in the sequence.`,`أوجد الحد رقم ${N} في المتتالية.`)])),400,262,34)];
   return{kind:"num",ans,show:String(ans),hc:3,q,sol:[...aeqC(N,fSn(d,c,N),400,350,44),hlC(400,440,280,64),...aeqC(N,ans,400,440,50,"g")]}}
  if(level===1){const d=rint(2,9),c=rint(Math.max(-5,1-d),9),t=seqTab(d,c);
   const pool=[[d,d+c],[d+1,c-1],[d,-c],[c,d],[d-1,c+1],[d,c+1]],key=([a,b])=>fS(a,b),seen=new Set([key([d,c])]),wrong=[];
   shuffle(pool).forEach(p=>{if(p[0]>0&&!seen.has(key(p))&&wrong.length<3){seen.add(key(p));wrong.push(p)}});
   const all=shuffle([[d,c],...wrong]),ans=all.findIndex(p=>p[0]===d&&p[1]===c),opts=all.map(([a,b])=>{const s=`aₙ = ${fS(a,b)}`;return t3(s,s,ISO8(s))});
   const sol=[...t.diff,...t.dnr,...t.plus,hlC(400,446,320,66),...aeqC("n",fS(d,c),400,446,50,"g")];
   return{kind:"choice",opts,ans,show:opts[ans],hc:t.diff.length,q:[A.wipe(),A.tx(L(pick([t3("Vilken formel passar talföljden?","Which formula fits the sequence?","أي صيغة تناسب هذه المتتالية؟"),t3("Vilken formel beskriver det n:te talet?","Which formula describes term n?","أي صيغة تصف الحد النوني؟")])),400,44,32),...t.head],sol}}
  let d,a1,N;if(Math.random()<.6){d=rint(2,9);a1=rint(-5,20);N=rint(12,40)}else{d=-rint(2,7);a1=rint(40,90);N=rint(10,30)}
  const c=a1-d,X=d*N+c,T=[1,2,3,4].map(n=>d*n+c),CX=i=>220+i*120;
  const q=[A.wipe(),...paraT(L(t3(`Talföljden fortsätter på samma sätt. Vilket nummer i talföljden är talet ${mn(X)}?`,`The sequence carries on in the same way. Which term number is ${mn(X)}?`,`تستمر المتتالية بالطريقة نفسها. ما رتبة العدد ${mn(X)} فيها؟`)),46,32,46,40),
   A.p(T.map((v,i)=>R.rect(CX(i)-48,128,96,64,.3)).join(""),"b",3.5),...T.map((v,i)=>tq(mn(v),CX(i),174,38,"b")),tq("…",CX(4)-10,174,38,"b")];
  const diff=[0,1,2].flatMap(i=>[A.arrow(CX(i)+30,200,CX(i+1)-30,200,"o",18),tq((d>0?"+":"−")+Math.abs(d),(CX(i)+CX(i+1))/2,242,26,"o")]);
  const form=aeqC("n",fS(d,c),400,300,42);
  const sol=[...diff,...form,A.tx(fS(d,c),384,360,38,"k","end"),A.tx(`= ${mn(X)}`,398,360,38,"k","start"),
   A.tx(`${mn(d)}n`,384,412,38,"k","end"),A.tx(`= ${mn(X-c)}`,398,412,38,"k","start"),hlC(400,466,200,58),A.tx("n",384,466,40,"g","end"),A.tx(`= ${N}`,398,466,40,"g","start")];
  return{kind:"num",ans:N,show:String(N),hc:diff.length+form.length,q,sol}}
});

/* =====================================================================
   3. spread8: range, quartiles and box plots
   ===================================================================== */
const MEDI=t3("median","median","الوسيط"),QL=t3("nedre kvartil","lower quartile","الربيع الأدنى"),QU=t3("övre kvartil","upper quartile","الربيع الأعلى"),
 MINV=t3("minsta","smallest","أصغر قيمة"),MAXV=t3("största","largest","أكبر قيمة"),IQR=t3("kvartilavstånd","interquartile range","المدى الربيعي"),RNG=t3("variationsbredd","range","المدى");
const cardR=(vals,X,y,c="k",w=56,s=32)=>[A.p(vals.map((v,i)=>R.rect(X(i)-w/2,y-w/2,w,w,.3)).join(""),c,3),...vals.map((v,i)=>tq(mn(v),X(i),y+s*.36,s,c))];
const brk=(x1,x2,y,c="k",dn1=true)=>A.p(`M${f1(x1)},${y+(dn1?-10:10)}V${y}H${f1(x2)}V${y+(dn1?-10:10)}`,c,3.5);
function boxP(v,X,yc,h=70,c="b"){const[a,q1,md,q3,b]=v,t=yc-h/2,bt=yc+h/2;
 return[A.p(R.line(X(a),yc,X(q1),yc,.2)+R.line(X(q3),yc,X(b),yc,.2)+R.line(X(a),yc-16,X(a),yc+16,.2)+R.line(X(b),yc-16,X(b),yc+16,.2),"k",4),
  A.p(R.rect(X(q1),t,X(q3)-X(q1),h,.3),c,4.5),A.hatch(`M${f1(X(q1))},${t}H${f1(X(q3))}V${bt}H${f1(X(q1))}Z`,c),A.p(R.line(X(md),t,X(md),bt,.2),"g",6)]}
function axisV(lo,hi,step,labEvery,X,y){let d=R.line(X(lo)-12,y,X(hi)+12,y,.3);const o=[];
 for(let v=lo;v<=hi+1e-9;v+=step){const big=Math.round((v-lo)/step)%labEvery===0;d+=`M${f1(X(v))},${y-(big?10:6)}v${big?20:12}`;if(big)o.push(tq(v,X(v),y+32,22))}return[A.p(d,"k",3.5),...o]}
const SCR=[14,6,20,9,4,18,12,25,7,15,10],SCS=SCR.slice().sort((a,b)=>a-b),X11=i=>70+i*66,XB=v=>110+v*23;
const PTS={sara:[10,11,12,13,14],omar:[4,8,12,16,20]},XP=v=>160+v*23.3;
const dotRow=(vals,y,c)=>[A.p(R.line(XP(0)-14,y,XP(24)+14,y,.3)+[0,2,4,6,8,10,12,14,16,18,20,22,24].map(v=>`M${f1(XP(v))},${y-(v%4?5:9)}v${v%4?10:18}`).join(""),"k",3.5),
 ...[0,4,8,12,16,20,24].map(v=>tq(v,XP(v),y+32,22)),A.p(dots(vals.map(v=>[XP(v),y-20])),c,20)];
/* quartile positions for an odd number of sorted values (the median is left out of the halves) */
const quart=s=>{const n=s.length,h=(n-1)/2,lo=(h-1)/2,hiI=h+1+(h-1)/2;return{mi:h,q1i:lo,q3i:hiI,md:s[h],q1:s[lo],q3:s[hiI]}};
const SPR={steps:[
 {say:t3("Sara och Omar spelar basket. Båda gör i snitt 12 poäng per match, men Omars poäng är mycket mer utspridda.",
   "Sara and Omar play basketball. Both score 12 points per match on average, but Omar's points are much more spread out.",
   "تلعب سارة وعمر كرة السلة. يسجّل كلٌّ منهما 12 نقطة في المباراة في المتوسط، لكن نقاط عمر أكثر تشتتًا بكثير."),
  draw:()=>[A.wipe(),A.tx(L(t3("Poäng per match","Points per match","النقاط في كل مباراة")),400,52,38),A.tx(L(t3("medelvärde 12 för båda","mean 12 for both","الوسط الحسابي 12 لكليهما")),400,96,28,"g"),
   A.tx(L(t3("Sara","Sara","سارة")),75,218,32,"o"),...dotRow(PTS.sara,212,"o"),A.tx(L(t3("Omar","Omar","عمر")),75,392,32,"b"),...dotRow(PTS.omar,386,"b")]},
 {say:t3("Variationsbredden är största värdet minus minsta värdet. Sara: 14 − 10 = 4. Omar: 20 − 4 = 16.",
   "The range is the largest value minus the smallest value. Sara: 14 − 10 = 4. Omar: 20 − 4 = 16.",
   `المدى هو أكبر قيمة ناقص أصغر قيمة. سارة: ${ISO8("14 − 10 = 4")}. عمر: ${ISO8("20 − 4 = 16")}.`),
  draw:()=>[A.p(R.line(XP(10),160,XP(14),160,.2)+`M${f1(XP(10))},150v20M${f1(XP(14))},150v20`,"o",4),tq("14 − 10 = 4",XP(12),142,30,"o"),
   A.p(R.line(XP(4),334,XP(20),334,.2)+`M${f1(XP(4))},324v20M${f1(XP(20))},324v20`,"b",4),tq("20 − 4 = 16",XP(12),316,30,"b"),
   A.tx(L(t3("variationsbredd = största − minsta","range = largest − smallest","المدى = أكبر قيمة − أصغر قيمة")),400,474,32,"g")]},
 {say:t3("Elva elever har räknat sin skärmtid i timmar per vecka. Vi sorterar värdena. Medianen är värdet i mitten: 12.",
   "Eleven students counted their screen time in hours per week. We sort the values. The median is the value in the middle: 12.",
   "حسب أحد عشر طالبًا وقت الشاشة بالساعات في الأسبوع. نرتّب القيم، والوسيط هو القيمة التي في المنتصف: 12."),
  draw:()=>[A.wipe(),A.tx(L(t3("Skärmtid (timmar per vecka)","Screen time (hours per week)","وقت الشاشة (ساعات في الأسبوع)")),400,50,34),
   ...SCR.map((v,i)=>tq(v,X11(i),114,32)),A.arrow(400,132,400,176,"k"),A.tx(L(t3("sortera","sort","رتّب")),416,162,26,"b","start"),
   ...cardR(SCS,X11,215,"k"),A.loop(X11(5),215,40,40,"g"),A.tx(L(MEDI),X11(5),318,28,"g"),tq("12",X11(5),360,36,"g")]},
 {say:t3("Medianen delar värdena i två halvor. Mitten av den nedre halvan är nedre kvartilen, 7. Mitten av den övre halvan är övre kvartilen, 18.",
   "The median splits the values into two halves. The middle of the lower half is the lower quartile, 7. The middle of the upper half is the upper quartile, 18.",
   "يقسم الوسيطُ القيمَ إلى نصفين. منتصف النصف الأدنى هو الربيع الأدنى: 7، ومنتصف النصف الأعلى هو الربيع الأعلى: 18."),
  draw:()=>[brk(X11(0)-28,X11(4)+28,262,"o",true),brk(X11(6)-28,X11(10)+28,262,"b",true),A.loop(X11(2),215,36,36,"o"),A.loop(X11(8),215,36,36,"b"),
   A.tx(L(QL),X11(2),318,28,"o"),tq("7",X11(2),360,36,"o"),A.tx(L(QU),X11(8),318,28,"b"),tq("18",X11(8),360,36,"b"),
   A.tx(L(t3("Nu är värdena delade i fyra lika stora delar.","Now the values are split into four equal parts.","الآن انقسمت القيم إلى أربعة أجزاء متساوية.")),400,446,30)]},
 {say:t3("Ett lådagram visar fem värden: minsta, nedre kvartil, median, övre kvartil och största. Lådan går från 7 till 18.",
   "A box plot shows five values: the smallest, the lower quartile, the median, the upper quartile and the largest. The box goes from 7 to 18.",
   "يعرض المخطط الصندوقي خمس قيم: أصغر قيمة، والربيع الأدنى، والوسيط، والربيع الأعلى، وأكبر قيمة. يمتد الصندوق من 7 إلى 18."),
  draw:()=>{const V=[4,7,12,18,25],C=["k","o","g","b","k"],N=[MINV,QL,MEDI,QU,MAXV],Y=[232,190,232,190,232];
   return[A.wipe(),A.tx(L(t3("Lådagram över skärmtiden","Box plot of the screen time","المخطط الصندوقي لوقت الشاشة")),400,56,36),...axisV(0,26,1,2,XB,410),
    ...V.map((v,i)=>A.p(R.dashed(XB(v),Y[i]+10,XB(v),404,9),"#8a96b0",2.5)),...boxP(V,XB,310),
    ...V.map((v,i)=>tq(`${L(N[i])} ${v}`,XB(v),Y[i],26,C[i]))]}},
 {say:t3("Varje del rymmer ungefär en fjärdedel av värdena, 25 %. Lådan är den mittersta hälften. Kvartilavståndet är 18 − 7 = 11.",
   "Each part holds about a quarter of the values, 25%. The box is the middle half. The interquartile range is 18 − 7 = 11.",
   `يحوي كل جزء ربع القيم تقريبًا، أي 25 %. الصندوق هو النصف الأوسط. المدى الربيعي ${ISO8("18 − 7 = 11")}.`),
  draw:()=>{const V=[4,7,12,18,25];return[A.wipe(),A.tx(L(t3("Lådan = den mittersta hälften","The box = the middle half","الصندوق = النصف الأوسط")),400,56,36),
   ...axisV(0,26,1,2,XB,410),...boxP(V,XB,310),brk(XB(4),XB(25),150,"k",false),tq(`${L(RNG)} = 25 − 4 = 21`,XB(14.5),132,28),
   brk(XB(7),XB(18),240,"b",false),tq(`${L(IQR)} = 18 − 7 = 11`,XB(12.5),222,28,"b"),
   ...[5.5,9.5,15,21.5].map(v=>tq(pc(25),XB(v),385,24,"o"))]}}
]};
const RCX=[
 {t:t3("Poäng i basketmatcher","Points in basketball games","النقاط في مباريات كرة السلة"),g:()=>{const n=rint(6,8),s=new Set();while(s.size<n)s.add(rint(4,35));return[...s]}},
 {t:t3("Temperatur i Kiruna en vecka i januari (°C)","Temperature in Kiruna one week in January (°C)","درجة الحرارة في كيرونا أسبوعًا في يناير (°C)"),g:()=>{const s=new Set();while(s.size<7)s.add(rint(-24,3));return[...s]}},
 {t:t3("Pris på hörlurar i olika butiker (kr)","Price of headphones in different shops (kr)","سعر سماعات الرأس في متاجر مختلفة (كرونة)"),g:()=>{const s=new Set();while(s.size<6)s.add(50*rint(4,13)-1);return[...s]}}
];
const QCX=[
 {t:t3("Antal sms på en dag","Text messages in one day","عدد الرسائل النصية في يوم واحد"),lo:3,hi:60},
 {t:t3("Minuter träning per dag","Minutes of exercise per day","دقائق التمرين في اليوم"),lo:10,hi:95},
 {t:t3("Poäng på ett prov","Points on a test","النقاط في اختبار"),lo:5,hi:48},
 {t:t3("Timmar gaming per vecka","Hours of gaming per week","ساعات الألعاب الإلكترونية في الأسبوع"),lo:1,hi:30}
];
const BCX=[
 {t:t3("Poäng på ett prov","Points on a test","النقاط في اختبار"),step:5},
 {t:t3("Lästa sidor på en vecka","Pages read in a week","الصفحات المقروءة في أسبوع"),step:10},
 {t:t3("Minuter med mobilen per dag","Minutes on the phone per day","دقائق استخدام الهاتف في اليوم"),step:25}
];
LESSONS.push({id:"spread8",subject:"math",grades:"8",kind:"wb",
 title:t3("Spridning och lådagram","Spread and box plots","التشتت والمخطط الصندوقي"),
 icon:ICO8(`<path d="M30 140H290${[40,80,120,160,200,240,280].map(x=>`M${x} 132V148`).join("")}" stroke="#1d2433" stroke-width="3" fill="none"/><path d="M55 85H115M215 85H270M55 70V100M270 70V100" stroke="#1d2433" stroke-width="4" fill="none"/><rect x="115" y="55" width="100" height="60" fill="#2257c9" fill-opacity=".12" stroke="#2257c9" stroke-width="4"/><path d="M155 55V115" stroke="#1e9e5a" stroke-width="5"/><text ${CV8} x="115" y="40" font-size="24" fill="#e07b00">Q1</text><text ${CV8} x="215" y="40" font-size="24" fill="#2257c9">Q3</text>`),
 steps:SPR.steps,mount:wbMount(SPR),
 gen(level){
  if(level===0){const ctx=pick(RCX),v=shuffle(ctx.g()),n=v.length,X=i=>400+(i-(n-1)/2)*88,mx=Math.max(...v),mi=Math.min(...v),r=mx-mi,ix=v.indexOf(mx),ii=v.indexOf(mi);
   const sol=[A.loop(X(ix),190,42,42,"r"),A.loop(X(ii),190,42,42,"b"),tq(L(MAXV),X(ix),262,24,"r"),tq(L(MINV),X(ii),262,24,"b"),
    A.tx(L(t3("variationsbredd = största − minsta","range = largest − smallest","المدى = أكبر قيمة − أصغر قيمة")),400,336,30),
    hlC(400,420,330,64),A.tx(`${mn(mx)} − ${mi<0?`(${mn(mi)})`:mi} = ${r}`,400,420,44,"g")];
   return{kind:"num",ans:r,show:String(r),hc:4,q:[A.wipe(),A.tx(L(pick([t3("Vad är variationsbredden?","What is the range?","ما المدى؟"),t3("Bestäm variationsbredden.","Find the range.","أوجد المدى."),t3("Beräkna variationsbredden.","Calculate the range.","احسب المدى.")])),400,50,36),A.tx(L(ctx.t),400,98,28,"b"),...cardR(v,X,190,"k",72,30)],sol}}
  if(level===1){const ctx=pick(QCX),n=pick([7,11]),set=new Set();while(set.size<n)set.add(rint(ctx.lo,ctx.hi));
   const v=shuffle([...set]),s=v.slice().sort((a,b)=>a-b),Q=quart(s),gap=n===7?92:66,X=i=>400+(i-(n-1)/2)*gap,w=n===7?66:56,typ=rint(0,3),bst=Math.random()<.4;
   const qq=bst?[t3("Bestäm den nedre kvartilen.","Find the lower quartile.","أوجد الربيع الأدنى."),t3("Bestäm den övre kvartilen.","Find the upper quartile.","أوجد الربيع الأعلى."),t3("Beräkna kvartilavståndet.","Calculate the interquartile range.","احسب المدى الربيعي."),t3("Bestäm medianen.","Find the median.","أوجد الوسيط.")][typ]
    :[t3("Vad är den nedre kvartilen?","What is the lower quartile?","ما الربيع الأدنى؟"),t3("Vad är den övre kvartilen?","What is the upper quartile?","ما الربيع الأعلى؟"),t3("Vad är kvartilavståndet?","What is the interquartile range?","ما المدى الربيعي؟"),t3("Vad är medianen?","What is the median?","ما الوسيط؟")][typ];
   const ans=typ===0?Q.q1:typ===1?Q.q3:typ===3?Q.md:Q.q3-Q.q1;
   const sol=[A.arrow(400,196,400,236,"k"),A.tx(L(t3("sortera","sort","رتّب")),416,224,24,"b","start"),...cardR(s,X,275,"k",w,30),A.loop(X(Q.mi),275,w*.7,w*.7,"g"),
    brk(X(0)-w/2,X(Q.mi-1)+w/2,322,"o",true),brk(X(Q.mi+1)-w/2,X(n-1)+w/2,322,"b",true),
    A.loop(X(Q.q1i),275,w*.66,w*.66,"o"),A.loop(X(Q.q3i),275,w*.66,w*.66,"b"),tq(L(QL),X(Q.q1i),362,24,"o"),tq(L(MEDI),X(Q.mi),362,24,"g"),tq(L(QU),X(Q.q3i),362,24,"b"),
    hlC(400,440,typ===2?440:300,62),A.tx(typ===0?`${L(QL)} = ${Q.q1}`:typ===1?`${L(QU)} = ${Q.q3}`:typ===3?`${L(MEDI)} = ${Q.md}`:`${L(IQR)} = ${Q.q3} − ${Q.q1} = ${ans}`,400,440,typ===2?34:38,"g")];
   return{kind:"num",ans,show:String(ans),hc:3+n,q:[A.wipe(),A.tx(L(qq),400,48,34),A.tx(L(ctx.t),400,92,28,"b"),...cardR(v,X,155,"k",w,30)],sol}}
  const ctx=pick(BCX),st=ctx.step,idx=[];let pool=[...Array(13).keys()];
  while(true){const c=shuffle(pool).slice(0,5).sort((a,b)=>a-b);if(c[4]-c[0]>=6){idx.push(...c);break}}
  const V=idx.map(i=>i*st),hi=12*st,X=v=>100+v/hi*600,typ=rint(0,7);let ans,qs,mk,cut;
  if(typ===0){ans=V[3]-V[1];mk=[1,3];qs=t3("Vad är kvartilavståndet?","What is the interquartile range?","ما المدى الربيعي؟")}
  else if(typ===1){ans=V[4]-V[0];mk=[0,4];qs=t3("Vad är variationsbredden?","What is the range?","ما المدى؟")}
  else if(typ===7){ans=V[2];mk=[2];qs=pick([t3("Vad är medianen?","What is the median?","ما الوسيط؟"),t3("Läs av medianen i lådagrammet.","Read off the median in the box plot.","اقرأ الوسيط من المخطط الصندوقي.")])}
  else{const P=[[3,">",25],[2,">",50],[1,">",75],[1,"<",25],[2,"<",50],[3,"<",75],[-1,"",50]][rint(0,6)];ans=P[2];
   if(P[0]<0){mk=[1,3];cut=[1,3];qs=t3(`Ungefär hur många procent av värdena ligger mellan ${V[1]} och ${V[3]}?`,`About what percentage of the values lie between ${V[1]} and ${V[3]}?`,`تقريبًا، ما النسبة المئوية للقيم الواقعة بين ${V[1]} و${V[3]}؟`)}
   else{const v=V[P[0]];mk=[P[0]];cut=P[1]===">"?[P[0],4]:[0,P[0]];
    qs=P[1]===">"?t3(`Ungefär hur många procent av värdena är större än ${v}?`,`About what percentage of the values are greater than ${v}?`,`تقريبًا، ما النسبة المئوية للقيم الأكبر من ${v}؟`)
     :t3(`Ungefär hur många procent av värdena är mindre än ${v}?`,`About what percentage of the values are less than ${v}?`,`تقريبًا، ما النسبة المئوية للقيم الأصغر من ${v}؟`)}}
  const q=[A.wipe(),...paraT(L(qs),46,28,56,36),A.tx(L(ctx.t),400,wrapT(L(qs),56).length>1?122:92,26,"b"),...axisV(0,hi,st,1,X,400),...boxP(V,X,300)];
  const drops=mk.map(i=>A.p(R.dashed(X(V[i]),300-(i===2?36:i%4?36:16),X(V[i]),394,9),"o",3.5));
  let sol;
  if(typ===7){sol=[...drops,A.loop(X(V[2]),422,22,20,"o"),hlC(400,200,260,60),A.tx(`${L(MEDI)} = ${ans}`,400,200,36,"g")]}
  else if(typ<2){sol=[...drops,...mk.map(i=>A.loop(X(V[i]),422,22,20,"o")),hlC(400,200,440,60),A.tx(`${L(typ?RNG:IQR)} = ${V[mk[1]]} − ${V[mk[0]]} = ${ans}`,400,200,32,"g")]}
  else{const mids=[0,1,2,3].map(i=>(V[i]+V[i+1])/2),ly=[];
   sol=[...drops,A.hatch(`M${f1(X(V[cut[0]]))},258H${f1(X(V[cut[1]]))}V342H${f1(X(V[cut[0]]))}Z`,"o"),...mids.map((m,i)=>{ly[i]=i&&X(m)-X(mids[i-1])<62&&ly[i-1]===240?214:240;return tq(pc(25),X(m),ly[i],24,"k")}),hlC(400,182,170,56),A.tx(`≈ ${pc(ans)}`,400,182,40,"g")]}
  return{kind:"num",ans,show:typ<2||typ===7?String(ans):t3(`${ans} %`,`${ans}%`,`${ans} %`),hc:drops.length,q,sol}}
});

/* =====================================================================
   4. tree8: probability in several steps, tree diagrams
   ===================================================================== */
/* layout: X = label centres [root, level 1, level 2]; Y0 root; Y1 level 1; Y2 leaves */
const TL={X:[60,250,450],Y0:290,Y1:[185,395],Y2:[130,240,340,450]},TP={X:[50,215,400],Y0:333,Y1:[248,418],Y2:[194,288,378,466]};
const brP=(L0,i,j)=>j==null?[L0.X[0]+8,L0.Y0,L0.X[1]-44,L0.Y1[i]]:[L0.X[1]+44,L0.Y1[i],L0.X[2]-46,L0.Y2[2*i+j]];
/* a branch with its probability: p is a number or [n,d] */
function branch(L0,i,j,p,c="k"){const[x1,y1,x2,y2]=brP(L0,i,j),mx=(x1+x2)/2,my=(y1+y2)/2,up=y2<y1,o=[A.p(R.line(x1,y1,x2,y2,.3),c,3.5)];
 if(Array.isArray(p))o.push(...A.frac(p[0],p[1],mx-20,up?my-28:my+24,24,"b"));else o.push(tq(dn(p),mx-6,up?my-10:my+30,28,"b","end"));return o}
const nodeT=(L0,i,j,s,c)=>tq(s,j==null?L0.X[1]:L0.X[2],(j==null?L0.Y1[i]:L0.Y2[2*i+j])+9,26,c);
const pathHL=(L0,i,j)=>A.p(R.line(...brP(L0,i),.3)+R.line(...brP(L0,i,j),.3),"g",8);
/* whole tree: p for level 1, q for level 2, labels s/f */
function treeAll(L0,p,q,lab,head){const cp=x=>Array.isArray(x)?[x[1]-x[0],x[1]]:Math.round((1-x)*100)/100,o=[A.p(dots([[L0.X[0],L0.Y0]]),"k",14)];
 if(head)o.push(tq(head[0],L0.X[1],L0.Y2[0]-48,24,"k"),tq(head[1],L0.X[2],L0.Y2[0]-48,24,"k"));
 [p,cp(p)].forEach((pp,i)=>o.push(...branch(L0,i,null,pp),nodeT(L0,i,null,lab[i],i?"r":"g")));
 [0,1].forEach(i=>[q,cp(q)].forEach((qq,j)=>o.push(...branch(L0,i,j,qq),nodeT(L0,i,j,lab[j],j?"r":"g"))));return o}
const LABP=t3(["Mål","Miss"],["Goal","Miss"],["هدف","لا هدف"]);
const TRE={steps:[
 {say:t3("Ali sätter en straff med sannolikheten 0,8. Han missar alltså med sannolikheten 0,2. Vi ritar ett träddiagram.",
   "Ali scores a penalty with probability 0.8. So he misses with probability 0.2. We draw a tree diagram.",
   "يسجّل علي ركلة الجزاء باحتمال 0.8، أي إنه يضيّعها باحتمال 0.2. نرسم مخططًا شجريًا."),
  draw:()=>{const lab=L(LABP);return[A.wipe(),tq(L(t3("straff 1","penalty 1","الركلة 1")),TL.X[1],78,28),A.p(dots([[TL.X[0],TL.Y0]]),"k",14),
   ...branch(TL,0,null,.8),nodeT(TL,0,null,lab[0],"g"),...branch(TL,1,null,.2),nodeT(TL,1,null,lab[1],"r")]}},
 {say:t3("Han skjuter en straff till, så varje gren delar sig igen. Grenarna från samma punkt blir alltid 1 tillsammans.",
   "He takes another penalty, so each branch splits again. The branches from the same point always add up to 1.",
   "يسدّد ركلة ثانية، فيتفرّع كل فرع من جديد. مجموع الفروع الخارجة من النقطة نفسها يساوي 1 دائمًا."),
  draw:()=>{const lab=L(LABP),o=[tq(L(t3("straff 2","penalty 2","الركلة 2")),TL.X[2],78,28)];
   [0,1].forEach(i=>[.8,.2].forEach((p,j)=>o.push(...branch(TL,i,j,p),nodeT(TL,i,j,lab[j],j?"r":"g"))));
   o.push(tq(`${dn(.8)} + ${dn(.2)} = 1`,150,478,28,"b"));return o}},
 {say:t3("Sannolikheten för två mål: multiplicera längs grenarna. 0,8 · 0,8 = 0,64.",
   "The probability of two goals: multiply along the branches. 0.8 × 0.8 = 0.64.",
   `احتمال تسجيل هدفين: نضرب على طول الفروع. ${ISO8("0.8 × 0.8 = 0.64")}.`),
  draw:()=>[pathHL(TL,0,0),hlC(645,TL.Y2[0]+12,220,52),tq(`${dn(.8)} ${MUL()} ${dn(.8)} = ${dn(.64)}`,645,TL.Y2[0]+12,30,"g")]},
 {say:t3("Så får vi alla fyra utfallen. Tillsammans blir de 0,64 + 0,16 + 0,16 + 0,04 = 1.",
   "That gives all four outcomes. Together they make 0.64 + 0.16 + 0.16 + 0.04 = 1.",
   `هكذا نحصل على النواتج الأربعة كلها، ومجموعها ${ISO8("0.64 + 0.16 + 0.16 + 0.04 = 1")}.`),
  draw:()=>[[.8,.2],[.2,.8],[.2,.2]].map(([a,b],k)=>tq(`${dn(a)} ${MUL()} ${dn(b)} = ${dn(a*b)}`,645,TL.Y2[k+1]+12,30))},
 {say:t3("Exakt ett mål kan hända på två sätt: mål–miss eller miss–mål. Då adderar vi: 0,16 + 0,16 = 0,32.",
   "Exactly one goal can happen in two ways: goal–miss or miss–goal. So we add: 0.16 + 0.16 = 0.32.",
   `هدف واحد بالضبط يمكن أن يحدث بطريقتين: هدف ثم ضياع، أو ضياع ثم هدف. لذلك نجمع: ${ISO8("0.16 + 0.16 = 0.32")}.`),
  draw:()=>{const lab=L(LABP),R4=[[0,0],[0,1],[1,0],[1,1]],P=[.64,.16,.16,.04],Y=k=>140+k*82,o=[A.wipe(),A.tx(L(t3("Alla utfall","All outcomes","كل النواتج")),230,62,36)];
   R4.forEach(([a,b],k)=>o.push(tq(lab[a],110,Y(k),30,a?"r":"g"),tq(lab[b],220,Y(k),30,b?"r":"g"),tq(dn(P[k]),360,Y(k),34)));
   o.push(A.loop(360,Y(1)-12,48,30,"o"),A.loop(360,Y(2)-12,48,30,"o"),A.tx(L(t3("Exakt ett mål","Exactly one goal","هدف واحد بالضبط")),620,140,32,"o"),
    tq(`${dn(.16)} + ${dn(.16)}`,620,210,36),hlC(620,274,190,58),tq(`= ${dn(.32)}`,620,274,40,"g"));return o}},
 {say:t3("Minst ett mål är allt utom miss–miss. Det är enklast att räkna 1 − 0,04 = 0,96.",
   "At least one goal is everything except miss–miss. The easiest way is 1 − 0.04 = 0.96.",
   `هدف واحد على الأقل يعني كل النواتج ما عدا ضياع–ضياع. الأسهل أن نحسب ${ISO8("1 − 0.04 = 0.96")}.`),
  draw:()=>[A.p(R.line(60,140+3*82-10,410,140+3*82-10,.3),"r",4),A.p("M440,100H456V312H440","b",4),A.tx(L(t3("Minst ett mål","At least one goal","هدف واحد على الأقل")),620,360,32,"b"),
   hlC(620,432,260,58),tq(`1 − ${dn(.04)} = ${dn(.96)}`,620,432,38,"g")]}
]};
/* contexts: one event twice (levels 0 and 1) */
const TC1=[
 {i:p=>t3(`Elin vinner en match i ett onlinespel med sannolikheten ${p.sv}. Hon spelar två matcher.`,`Elin wins a match in an online game with probability ${p.en}. She plays two matches.`,`تفوز إيلين بمباراة في لعبة إلكترونية باحتمال ${p.ar}. وتلعب مباراتين.`),
  h:t3(["match 1","match 2"],["match 1","match 2"],["المباراة 1","المباراة 2"]),lab:t3(["Vinst","Förlust"],["Win","Loss"],["فوز","خسارة"]),
  q:[t3("att hon vinner båda?","that she wins both?","أن تفوز في المباراتين كلتيهما؟"),t3("att hon förlorar båda?","that she loses both?","أن تخسر المباراتين كلتيهما؟"),t3("att hon vinner exakt en?","that she wins exactly one?","أن تفوز في مباراة واحدة فقط؟")]},
 {i:p=>t3(`Ali sätter en straff med sannolikheten ${p.sv}. Han skjuter två straffar.`,`Ali scores a penalty with probability ${p.en}. He takes two penalties.`,`يسجّل علي ركلة الجزاء باحتمال ${p.ar}. ويسدّد ركلتين.`),
  h:t3(["straff 1","straff 2"],["penalty 1","penalty 2"],["الركلة 1","الركلة 2"]),lab:LABP,
  q:[t3("att han gör mål på båda?","that he scores both?","أن يسجّل الركلتين كلتيهما؟"),t3("att han missar båda?","that he misses both?","أن يضيّع الركلتين كلتيهما؟"),t3("att han gör mål på exakt en?","that he scores exactly one?","أن يسجّل ركلة واحدة فقط؟")]},
 {i:p=>t3(`Noor sätter ett straffkast med sannolikheten ${p.sv}. Hon kastar två gånger.`,`Noor makes a free throw with probability ${p.en}. She shoots twice.`,`تسجّل نور الرمية الحرة باحتمال ${p.ar}. وترمي مرتين.`),
  h:t3(["kast 1","kast 2"],["shot 1","shot 2"],["الرمية 1","الرمية 2"]),lab:t3(["Träff","Miss"],["Hit","Miss"],["إصابة","إخفاق"]),
  q:[t3("att hon träffar båda?","that she makes both?","أن تصيب في الرميتين كلتيهما؟"),t3("att hon missar båda?","that she misses both?","أن تخفق في الرميتين كلتيهما؟"),t3("att hon träffar exakt en gång?","that she makes exactly one?","أن تصيب مرة واحدة فقط؟")]},
 {i:p=>t3(`Bussen kommer i tid med sannolikheten ${p.sv}. Du åker buss två dagar.`,`The bus is on time with probability ${p.en}. You take the bus on two days.`,`تصل الحافلة في موعدها باحتمال ${p.ar}. وتركب الحافلة يومين.`),
  h:t3(["dag 1","dag 2"],["day 1","day 2"],["اليوم 1","اليوم 2"]),lab:t3(["I tid","Sen"],["On time","Late"],["في الموعد","متأخرة"]),
  q:[t3("att bussen är i tid båda dagarna?","that the bus is on time on both days?","أن تصل الحافلة في موعدها في اليومين كليهما؟"),t3("att bussen är sen båda dagarna?","that the bus is late on both days?","أن تتأخر الحافلة في اليومين كليهما؟"),t3("att bussen är i tid exakt en dag?","that the bus is on time on exactly one day?","أن تصل الحافلة في موعدها في يوم واحد فقط؟")]}
];
/* contexts: two different events (level 2) */
const TC2=[
 {i:(p,q)=>t3(`Ali sätter en straff med sannolikheten ${p.sv} och Sara med ${q.sv}. Båda skjuter en straff.`,`Ali scores a penalty with probability ${p.en} and Sara with ${q.en}. They take one penalty each.`,`يسجّل علي ركلة الجزاء باحتمال ${p.ar}، وتسجّلها سارة باحتمال ${q.ar}. يسدّد كلٌّ منهما ركلة واحدة.`),
  h:t3(["Ali","Sara"],["Ali","Sara"],["علي","سارة"]),lab:LABP,
  q:[t3("att exakt en av dem gör mål?","that exactly one of them scores?","أن يسجّل واحد منهما فقط؟"),t3("att minst en av dem gör mål?","that at least one of them scores?","أن يسجّل واحد منهما على الأقل؟")]},
 {i:(p,q)=>t3(`Bussen kommer i tid med sannolikheten ${p.sv} och tåget med ${q.sv}.`,`The bus is on time with probability ${p.en} and the train with probability ${q.en}.`,`تصل الحافلة في موعدها باحتمال ${p.ar}، ويصل القطار في موعده باحتمال ${q.ar}.`),
  h:t3(["buss","tåg"],["bus","train"],["الحافلة","القطار"]),lab:t3(["I tid","Sen"],["On time","Late"],["في الموعد","تأخير"]),
  q:[t3("att exakt ett av dem är i tid?","that exactly one of them is on time?","أن تصل وسيلة واحدة فقط في موعدها؟"),t3("att minst ett av dem är i tid?","that at least one of them is on time?","أن تصل وسيلة واحدة على الأقل في موعدها؟")]}
];
const PRQ=t3("Hur stor är sannolikheten","What is the probability","ما احتمال");
const r4=x=>Math.round(x*10000)/10000;
const pT=x=>({sv:dnl(x,"sv"),en:dnl(x,"en"),ar:dnl(x,"ar")});
const head2=(intro,qq)=>{const s=Math.random()<.35?`${L(intro)} ${L(t3("Beräkna sannolikheten","Calculate the probability","احسب احتمال"))} ${L(qq).replace(/[?؟]$/,".")}`:`${L(intro)} ${L(PRQ)} ${L(qq)}`;return paraT(s,36,26,60,32)};
LESSONS.push({id:"tree8",subject:"math",grades:"8",kind:"wb",
 title:t3("Träddiagram","Tree diagrams","المخططات الشجرية"),
 icon:ICO8(`<path d="M40 90L125 48M40 90L125 132M150 48L225 26M150 48L225 70M150 132L225 110M150 132L225 154" stroke="#1d2433" stroke-width="3.5" stroke-linecap="round"/><path d="M40 90L125 48M150 48L225 26" stroke="#1e9e5a" stroke-width="6" stroke-linecap="round" opacity=".7"/><circle cx="40" cy="90" r="6" fill="#1d2433"/>${[[138,54],[138,138]].map(([x,y])=>`<circle cx="${x}" cy="${y-6}" r="9" fill="none" stroke="#e07b00" stroke-width="3"/>`).join("")}${[26,70,110,154].map((y,i)=>`<circle cx="236" cy="${y}" r="7" fill="${i%2?"#d63b2f":"#1e9e5a"}"/>`).join("")}<text ${CV8} x="68" y="58" font-size="22" fill="#2257c9">0,8</text><text ${CV8} x="68" y="138" font-size="22" fill="#2257c9">0,2</text><text ${CV8} x="285" y="34" font-size="22" fill="#1e9e5a">0,64</text>`),
 steps:TRE.steps,mount:wbMount(TRE),
 gen(level){const M=MUL(),L0=TP,PX=550;
  /* level 0: the complement, the branches from one point add up to 1 */
  if(level===0&&Math.random()<.25){const p=pick([.1,.2,.3,.4,.6,.7,.75,.8,.85,.9,.95]),ans=r4(1-p),lab=L(LABP),[x1,y1,x2,y2]=brP(L0,1);
   const q=[A.wipe(),...paraT(L(t3(`Ali sätter en straff med sannolikheten ${dn(p)}. Hur stor är sannolikheten att han missar?`,`Ali scores a penalty with probability ${dn(p)}. What is the probability that he misses?`,`يسجّل علي ركلة الجزاء باحتمال ${dn(p)}. ما احتمال أن يُخطئ؟`)),36,28,56,34),
    A.p(dots([[L0.X[0],L0.Y0]]),"k",14),...branch(L0,0,null,p),nodeT(L0,0,null,lab[0],"g"),A.p(R.line(x1,y1,x2,y2,.3),"k",3.5),tq("?",(x1+x2)/2-14,(y1+y2)/2+34,34,"r"),nodeT(L0,1,null,lab[1],"r")];
   return{kind:"num",dec:true,ans,show:t3n(l=>dnl(ans,l)),hc:1,q,sol:[A.tx(L(t3("Grenarna från samma punkt blir 1 tillsammans.","The branches from one point add up to 1.","مجموع الفروع من النقطة نفسها يساوي 1.")),560,250,26,"b"),hlC(560,340,260,60),A.tx(`1 − ${dn(p)} = ${dn(ans)}`,560,340,40,"g")]}}
  if(level===0){const ctx=pick(TC1),fr=pick([[1,2],[1,3],[2,3],[1,4],[3,4],[1,5],[2,5],[3,5],[4,5]]),t=rint(0,1),lab=L(ctx.lab);
   const p=fr,pq=t?[fr[1]-fr[0],fr[1]]:fr,N=pq[0]*pq[0],D=pq[1]*pq[1],ps={sv:`${p[0]}/${p[1]}`,en:`${p[0]}/${p[1]}`,ar:`${p[0]}/${p[1]}`};
   const q=[A.wipe(),...head2(ctx.i(ps),ctx.q[t]),...treeAll(L0,p,p,lab,L(ctx.h))],y=t?L0.Y2[3]-8:L0.Y2[0]+2;
   const sol=[pathHL(L0,t,t),hlC(600,y+12,250,66),...A.frac(pq[0],pq[1],508,y,26,"g"),tq(M,544,y+10,30,"g"),...A.frac(pq[0],pq[1],580,y,26,"g"),tq("=",620,y+10,30,"g"),...A.frac(N,D,668,y,26,"g")];
   return{kind:"frac",ans:[N,D],show:`${N}/${D}`,hc:1,q,sol}}
  if(level===1){const ctx=pick(TC1),p=pick([.1,.2,.3,.4,.6,.7,.8,.9]),t=rint(0,2),lab=L(ctx.lab),pf=r4(1-p);
   const q=[A.wipe(),...head2(ctx.i(pT(p)),ctx.q[t]),...treeAll(L0,p,p,lab,L(ctx.h))];
   if(t<2){const a=t?pf:p,ans=r4(a*a),y=L0.Y2[3*t]+12;
    return{kind:"num",dec:true,ans,show:t3n(l=>dnl(ans,l)),hc:1,q,sol:[pathHL(L0,t,t),hlC(PX+15,y,250,52),tq(`${dn(a)} ${M} ${dn(a)} = ${dn(ans)}`,PX+15,y,28,"g")]}}
   const e=r4(p*pf),ans=r4(2*e);
   return{kind:"num",dec:true,ans,show:t3n(l=>dnl(ans,l)),hc:2,q,sol:[pathHL(L0,0,1),pathHL(L0,1,0),tq(`${dn(p)} ${M} ${dn(pf)} = ${dn(e)}`,PX,L0.Y2[1]+12,26),tq(`${dn(pf)} ${M} ${dn(p)} = ${dn(e)}`,PX,L0.Y2[2]+12,26),
    hlC(PX+40,L0.Y2[3]+4,310,52),tq(`${dn(e)} + ${dn(e)} = ${dn(ans)}`,PX+40,L0.Y2[3]+4,30,"g")]}}
  const ctx=pick(TC2),lab=L(ctx.lab);let p,qv;do{p=rint(1,9)/10;qv=rint(1,9)/10}while(p===qv);const t=rint(0,1),pf=r4(1-p),qf=r4(1-qv);
  const q=[A.wipe(),...head2(ctx.i(pT(p),pT(qv)),ctx.q[t]),...treeAll(L0,p,qv,lab,L(ctx.h))];
  if(t===0){const e1=r4(p*qf),e2=r4(pf*qv),ans=r4(e1+e2);
   return{kind:"num",dec:true,ans,show:t3n(l=>dnl(ans,l)),hc:2,q,sol:[pathHL(L0,0,1),pathHL(L0,1,0),tq(`${dn(p)} ${M} ${dn(qf)} = ${dn(e1)}`,PX,L0.Y2[1]+12,26),tq(`${dn(pf)} ${M} ${dn(qv)} = ${dn(e2)}`,PX,L0.Y2[2]+12,26),
    hlC(PX+40,L0.Y2[3]+4,310,52),tq(`${dn(e1)} + ${dn(e2)} = ${dn(ans)}`,PX+40,L0.Y2[3]+4,30,"g")]}}
  const e=r4(pf*qf),ans=r4(1-e);
  return{kind:"num",dec:true,ans,show:t3n(l=>dnl(ans,l)),hc:1,q,sol:[pathHL(L0,1,1),tq(`${dn(pf)} ${M} ${dn(qf)} = ${dn(e)}`,PX+40,L0.Y2[2]+12,28),
   hlC(PX+40,L0.Y2[3]+4,310,52),tq(`1 − ${dn(e)} = ${dn(ans)}`,PX+40,L0.Y2[3]+4,30,"g")]}}
});

/* =====================================================================
   simpler explanations (HELP) and hints (HINTS)
   ===================================================================== */
const kid8=(cx,base,h,c)=>{const r=h*.12,top=base-h;return A.p(R.circ(cx,top+r,r)+R.line(cx,top+2*r,cx,base-h*.42,.2)+R.line(cx,base-h*.42,cx-h*.13,base,.2)+R.line(cx,base-h*.42,cx+h*.13,base,.2)+R.line(cx-h*.11,top+h*.4,cx+h*.11,top+h*.4,.2),c,4)};
Object.assign(HELPX,{
 lin8:[{say:t3("Tänk på en trappa. Du börjar på höjden m vid y-axeln. Varje steg åt höger går du k steg uppåt. Här är m = 1 och k = 2.",
   "Think of a staircase. You start at height m on the y-axis. For every step to the right you go k steps up. Here m = 1 and k = 2.",
   `فكّر في درج: تبدأ عند الارتفاع m على محور y، ومع كل خطوة إلى اليمين تصعد k خطوات. هنا ${ISO8("m = 1")} و${ISO8("k = 2")}.`),
  draw:()=>{const o={xa:0,xb:4,ya:0,yb:9,box:[40,60,420,400]},G=cgrid(o);let d=`M${f1(G.X(0))},${f1(G.Y(1))}`;for(let i=0;i<4;i++)d+=`H${f1(G.X(i+1))}V${f1(G.Y(2*i+3))}`;
   return[...G.o,A.p(d,"b",6),A.p(R.dashed(G.X(0),G.Y(1),G.X(4),G.Y(9),12),"r",4),A.p(dots([[G.X(0),G.Y(1)]]),"g",18),
    ...[0,1,2,3].map(i=>tq("+2",G.X(i+1)+12,G.Y(2*i+2)+9,24,"b","start")),
    A.tx(L(t3("start: m = 1","start: m = 1","البداية: m = 1")),PC,170,38,"g"),A.tx(L(t3("trappsteg: k = 2","each step: k = 2","كل درجة: k = 2")),PC,250,38,"b"),hlC(PC,360,250),A.tx("y = 2x + 1",PC,360,46)]}}],
 seq8:[{say:t3("En spellista har 5 låtar. Varje vecka lägger du till 3 nya. Efter n veckor finns 3n + 5 låtar.",
   "A playlist has 5 songs. Every week you add 3 new ones. After n weeks there are 3n + 5 songs.",
   `في قائمة تشغيل 5 أغانٍ، وتضيف إليها 3 أغانٍ جديدة كل أسبوع. بعد n من الأسابيع يصبح فيها ${ISO8("3n + 5")} أغنية.`),
  draw:()=>{const o=[A.tx(L(t3("start","start","البداية")),198,96,26,"k"),A.tx(L(t3("nya låtar","new songs","أغانٍ جديدة")),380,96,26,"b")];
   [1,2,3].forEach(n=>{const y=60+n*95;o.push(A.tx(L(t3(`vecka ${n}`,`week ${n}`,`الأسبوع ${n}`)),76,y+10,26,"o"),A.p(dots([0,1,2,3,4].map(k=>[154+k*22,y])),"#8a96b0",18));
    for(let g=0;g<n;g++)o.push(A.p(dots([0,1,2].map(k=>[290+g*80+k*22,y])),"b",18));
    o.push(tq(`5 + 3 ${MUL()} ${n} = ${5+3*n}`,690,y+10,30,"k"))});
   o.push(hlC(400,450,280,62),...aeqC("n","3n + 5",400,450,46,"g"));return o}}],
 spread8:[{say:t3("Ställ elva kompisar i längdordning. Tre personer delar raden i fyra lika stora grupper: nedre kvartilen, medianen och övre kvartilen.",
   "Line up eleven friends by height. Three people split the line into four equal groups: the lower quartile, the median and the upper quartile.",
   "رتّب أحد عشر صديقًا حسب الطول. ثلاثة منهم يقسمون الصف إلى أربع مجموعات متساوية: الربيع الأدنى، والوسيط، والربيع الأعلى."),
  draw:()=>{const X=i=>70+i*66,o=[A.p(R.line(30,400,770,400,.3),"k",4)],C={2:"o",5:"g",8:"b"};
   for(let i=0;i<11;i++)o.push(kid8(X(i),396,150+i*13,C[i]||"k"));
   o.push(A.loop(X(2),300,36,120,"o"),A.loop(X(5),280,36,140,"g"),A.loop(X(8),262,36,158,"b"),
    tq(L(QL),X(2),440,24,"o"),tq(L(MEDI),X(5),440,24,"g"),tq(L(QU),X(8),440,24,"b"),
    ...[[0,1],[3,4],[6,7],[9,10]].map(([a,b])=>tq("2",(X(a)+X(b))/2,476,24,"k")));return o}}],
 tree8:[{say:t3("Singla slant två gånger. Krona har chansen 1/2 varje gång. Två krona är hälften av hälften: 1/2 · 1/2 = 1/4.",
   "Toss a coin twice. Heads has a chance of 1/2 each time. Two heads is half of a half: 1/2 × 1/2 = 1/4.",
   `ارمِ قطعة نقود مرتين. فرصة الصورة 1/2 في كل مرة. صورتان هي نصف النصف: ${ISO8("1/2 × 1/2 = 1/4")}.`),
  draw:()=>{const lab=L(t3(["krona","klave"],["heads","tails"],["صورة","كتابة"])),o=treeAll(TL,[1,2],[1,2],lab);
   return[...o,pathHL(TL,0,0),...A.frac(1,2,580,TL.Y2[0],28,"g"),tq(MUL(),620,TL.Y2[0]+10,30,"g"),...A.frac(1,2,660,TL.Y2[0],28,"g"),tq("=",700,TL.Y2[0]+10,30,"g"),...A.frac(1,4,740,TL.Y2[0],28,"g"),
    A.p(R.circ(640,330,46)+R.circ(640,330,36),"o",4),tq("1 kr",640,342,30,"o")]}}]
});
Object.assign(HINTSX,{
 lin8:[{say:t3("m är där linjen skär y-axeln. Gå sedan ett steg åt höger: hur många steg går linjen upp? Det är k. Har du en formel: byt ut x mot talet.","m is where the line crosses the y-axis. Then go one step right: how many steps does the line go up? That is k. If you have a formula: replace x with the number.","m هو المكان الذي يقطع فيه الخط محور y. ثم تحرّك خطوة واحدة إلى اليمين: كم خطوة يصعد الخط؟ هذا هو k. إذا كانت لديك صيغة: ضع العدد مكان x."),cut:g=>g.sol.slice(0,g.hc)},
  {say:t3("Linjen lutar nedåt, så k är negativt. Räkna hur många steg den går ned för ett steg åt höger. Abonnemang: den fasta avgiften är m och priset per GB är k.","The line slopes down, so k is negative. Count how many steps it goes down for one step right. Phone plan: the fixed fee is m and the price per GB is k.","الخط ينحدر، إذن k سالب. عُدّ كم خطوة ينزل مقابل خطوة واحدة إلى اليمين. في الاشتراك: الرسم الثابت هو m وسعر كل GB هو k."),cut:g=>g.sol.slice(0,g.hc)},
  {say:t3("Läs av m vid y-axeln. Räkna sedan steg i sidled och i höjdled: k = höjd delat med sidled.","Read m at the y-axis. Then count the steps across and up or down: k = rise divided by run.","اقرأ m عند محور y، ثم عُدّ الخطوات أفقيًا ورأسيًا: k = التغيّر الرأسي ÷ التغيّر الأفقي."),cut:g=>g.sol.slice(0,g.hc)}],
 seq8:[{say:t3("Byt ut n mot talets nummer. Räkna gånger först, sedan plus eller minus. Nästa tal: lägg till samma steg en gång till.","Replace n with the term number. Multiply first, then add or subtract. Next term: add the same step once more.","ضع رقم الحد مكان n. اضرب أولًا، ثم اجمع أو اطرح. الحد التالي: أضف الخطوة نفسها مرة أخرى."),cut:g=>g.sol.slice(0,g.hc)},
  {say:t3("Hur mycket ökar talen varje gång? Det talet står framför n. Jämför sedan med talföljden.","How much do the terms go up each time? That number goes in front of n. Then compare with the sequence.","بكم تزداد الحدود في كل مرة؟ هذا العدد يُكتب أمام n. ثم قارن بالمتتالية."),cut:g=>g.sol.slice(0,g.hc)},
  {say:t3("Ta fram formeln för aₙ först. Sätt den sedan lika med talet och lös ekvationen.","Find the formula for aₙ first. Then set it equal to the number and solve the equation.","أوجد صيغة الحد العام أولًا، ثم اجعلها تساوي العدد وحلّ المعادلة."),cut:g=>g.sol.slice(0,g.hc)}],
 spread8:[{say:t3("Leta upp det största och det minsta värdet. Ta största minus minsta.","Find the largest and the smallest value. Take largest minus smallest.","ابحث عن أكبر قيمة وأصغر قيمة، ثم اطرح الصغرى من الكبرى."),cut:g=>g.sol.slice(0,g.hc)},
  {say:t3("Sortera värdena och hitta medianen. Kvartilerna är mitten av den nedre och den övre halvan.","Sort the values and find the median. The quartiles are the middle of the lower and the upper half.","رتّب القيم وأوجد الوسيط. الربيعان هما منتصف النصف الأدنى ومنتصف النصف الأعلى."),cut:g=>g.sol.slice(0,g.hc)},
  {say:t3("Läs av värdena på skalan. Varje del av lådagrammet rymmer ungefär 25 % av värdena.","Read the values off the scale. Each part of the box plot holds about 25% of the values.","اقرأ القيم من التدريج. كل جزء من المخطط الصندوقي يحوي نحو 25 % من القيم."),cut:g=>g.sol.slice(0,g.hc)}],
 tree8:[{say:t3("Följ grenarna till rätt utfall och multiplicera sannolikheterna längs vägen. Grenarna från samma punkt blir 1 tillsammans.","Follow the branches to the right outcome and multiply the probabilities along the way. The branches from one point add up to 1.","اتبع الفروع حتى الناتج المطلوب، واضرب الاحتمالات على طول الطريق. مجموع الفروع من النقطة نفسها يساوي 1."),cut:g=>g.sol.slice(0,g.hc)},
  {say:t3("Multiplicera längs varje väg som ger rätt utfall. Finns det flera vägar, addera dem.","Multiply along each path that gives the outcome. If there are several paths, add them.","اضرب على طول كل مسار يعطي الناتج المطلوب. وإذا وُجد أكثر من مسار فاجمعها."),cut:g=>g.sol.slice(0,g.hc)},
  {say:t3("Exakt ett: addera två vägar. Minst ett: räkna 1 minus sannolikheten att inget händer.","Exactly one: add two paths. At least one: work out 1 minus the probability that neither happens.","واحد فقط: اجمع مسارين. واحد على الأقل: احسب 1 ناقص احتمال ألا يحدث أي منهما."),cut:g=>g.sol.slice(0,g.hc)}]
});
}
