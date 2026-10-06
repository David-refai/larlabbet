{
/* =====================================================================
   YEAR 6 (y6a): prime6 · order6 · negcalc6 · decmd6
   Everything sits inside one block so helper names cannot clash with
   other lesson files.
   ===================================================================== */
const LU=()=>lang==="sv"?"liter":"L";   /* a lone "l" looks like "/" in the marker font */
const ng=n=>n<0?"−"+(-n):String(n);                       /* real minus sign */
const LRI=s=>"⁦"+s+"⁩";                          /* keeps formulas left-to-right inside Arabic speech */
const mark=(a,m)=>Object.assign(a,{m});
const upTo=m=>g=>{const k=g.sol.findIndex(a=>a.m===m);return k<0?[]:g.sol.slice(0,k)};
const qx=(s,x,y,size,c="k",anc)=>Object.assign(A.tx(s,x,y,size,c,anc),{dur:170});
const ICO=b=>`<svg viewBox="0 0 320 180"><rect width="320" height="180" fill="#fff"/>${b}</svg>`;
const CV=`font-family="Caveat,cursive" font-weight="700" text-anchor="middle" direction="ltr"`;
const MX=x=>lang==="ar"?800-x:x;                           /* mirror a row layout for Arabic */
const okM=(x,y,c="g")=>A.p(`M${x-13},${y-1}L${x-4},${y+10}L${x+14},${y-14}`,c,5.5);
const noM=(x,y,c="r")=>A.p(R.line(x-11,y-11,x+11,y+11,.2)+R.line(x+11,y-11,x-11,y+11,.2),c,5);
const ellP=(cx,cy,rx,ry)=>{let d="";for(let i=0;i<=40;i++){const t=i/40*Math.PI*2,k=1+jit(i,cx+cy)*.03;d+=(i?"L":"M")+f1(cx+Math.cos(t)*rx*k)+","+f1(cy+Math.sin(t)*ry*k)}return d};
const kidP=(cx,base,h)=>{const hr=h*.13,top=base-h;return R.circ(cx,top+hr,hr)+R.line(cx,top+2*hr,cx,base-h*.42,.2)+R.line(cx,base-h*.42,cx-h*.14,base,.2)+R.line(cx,base-h*.42,cx+h*.14,base,.2)+R.line(cx-h*.2,top+h*.42,cx+h*.2,top+h*.42,.2)};
const DAR=n=>n===1?"درجة واحدة":n===2?"درجتين":n<=10?`${n} درجات`:`${n} درجة`;

/* --- formulas drawn token by token, so underlines sit exactly under a part --- */
const TCH={"·":.27,",":.2,".":.2,"(":.3,")":.3,"/":.4," ":.22,"?":.4};
const tw=(t,s)=>[...String(t)].reduce((w,ch)=>w+(TCH[ch]??.47),0)*s;
const rowAt=(T,x,s)=>{let cx=x;const xs=[],ws=[];T.forEach((t,i)=>{if(i)cx+=(T[i-1]==="("||t===")")?.05*s:.24*s;const w=tw(t,s);xs.push(cx+w/2);ws.push(w);cx+=w});return{xs,ws,r:cx}};
const rowW=(T,s)=>rowAt(T,0,s).r;
const drawRow=(T,P,y,s,c)=>T.map((t,i)=>A.tx(t,P.xs[i],y,s,typeof c==="function"?c(i,t):c));
const rowC=(T,cx,y,s,c="k")=>{const P=rowAt(T,cx-rowW(T,s)/2,s);return Object.assign(drawRow(T,P,y,s,c),{P})};
/* lines of a worked solution: line 0 centred at cx, later lines start with "=" and are aligned under line 0.
   returns {first, rest:[[actions of line 1], ...]}; the last line is green on a highlighter */
function aligned(lines,cx,y0,s,gap,unit){const L0=cx-rowW(lines[0],s)/2,ew=tw("=",s),eqX=L0-.24*s-ew/2,rest=[];
 lines.slice(1).forEach((T,i)=>{const last=i===lines.length-2,y=y0+(i+1)*gap,S=last&&unit?[...T,unit]:T,P=rowAt(S,L0,s);
  rest.push([...(last?[A.hl(eqX-ew/2-14,y-s*.8,P.r-eqX+ew/2+28,s*1.05)]:[]),A.tx("=",eqX,y,s,last?"g":"k"),...drawRow(S,P,y,s,last?"g":"k")])});
 return{first:drawRow(lines[0],rowAt(lines[0],L0,s),y0,s,"k"),rest,L0}}
/* a word label and a formula on one line; the formula stays left-to-right in Arabic */
const wordW=(t,s)=>String(t).length*s*(/[؀-ۿ]/.test(t)?.36:.36);
function lab2(lab,f,y,s,c1,c2=c1){const wl=wordW(lab,s),wf=tw(f,s),mid=400+(lang==="ar"?wf-wl:wl-wf)/2;
 return lang==="ar"?[A.tx(lab,mid+9,y,s,c1,"end"),A.tx(f,mid-9,y,s,c2,"end")]:[A.tx(lab,mid-9,y,s,c1,"end"),A.tx(f,mid+9,y,s,c2,"start")]}

/* ---------------------------------------------------------------
   1. prime6: divisibility, divisors, primes, factor trees
   --------------------------------------------------------------- */
const isP=n=>{if(n<2)return false;for(let i=2;i*i<=n;i++)if(n%i===0)return false;return true};
const pfac=n=>{const o=[];for(let p=2;n>1;)if(n%p===0){o.push(p);n/=p}else p++;return o};
const dsum=n=>String(n).split("").reduce((a,b)=>a+ +b,0);
const near=n=>{for(let a=Math.floor(Math.sqrt(n));a>1;a--)if(n%a===0)return[a,n/a];return null};
const mkTree=(v,sp)=>{const s=sp||near(v);return s?{v,k:[mkTree(s[0]),mkTree(s[1])]}:{v,k:[]}};
const tDepth=t=>t.k.length?1+Math.max(...t.k.map(tDepth)):0;
const nLeaf=t=>t.k.length?nLeaf(t.k[0])+nLeaf(t.k[1]):1;
/* factor tree with its root at cx; returns root, one group of actions per split, and the circles round the primes */
function treeAct(n,cx,y0,dy,spread,size,first){const t=mkTree(n,first),leaves=[];
 const walk=(u,d)=>{u.d=d;if(!u.k.length)leaves.push(u);u.k.forEach(c=>walk(c,d+1))};walk(t,0);
 leaves.forEach((u,i)=>u.x=i*spread);const setx=u=>{if(u.k.length){u.k.forEach(setx);u.x=(u.k[0].x+u.k[1].x)/2}};setx(t);
 const sh=cx-t.x,all=[];const mv=u=>{u.x+=sh;all.push(u);u.k.forEach(mv)};mv(t);
 const Y=d=>y0+d*dy,root=A.tx(n,t.x,Y(0),size*1.15),splits=[],q=[t];
 while(q.length){const u=q.shift();if(!u.k.length)continue;const a=[];
  u.k.forEach(c=>{const dx=c.x-u.x;a.push(A.p(R.line(u.x+dx*.16,Y(u.d)+size*.22,c.x-dx*.06,Y(c.d)-size*.82,.3),"k",3.5),A.tx(c.v,c.x,Y(c.d),size,isP(c.v)?"g":"k"))});
  splits.push(a);q.push(...u.k)}
 const circles=leaves.map(u=>A.loop(u.x,Y(u.d)-size*.3,String(u.v).length*size*.25+size*.26,size*.52,"g"));
 return{root,splits,circles,leaves,minX:Math.min(...leaves.map(u=>u.x)),maxX:Math.max(...leaves.map(u=>u.x))}}
const PSTR=f=>f.slice().sort((a,b)=>a-b).join(` ${MUL()} `);
/* numbers for factor-tree problems: 3-5 prime factors, small primes, a tree at most 3 levels deep */
const TREEN=[];for(let n=24;n<=200;n++){const f=pfac(n),t=mkTree(n);if(f.length>=3&&f.length<=5&&Math.max(...f)<=11&&tDepth(t)<=3)TREEN.push(n)}
/* numbers with 3-5 divisor pairs, for counting divisors */
const pairsOf=n=>{const o=[];for(let a=1;a*a<=n;a++)if(n%a===0)o.push([a,n/a]);return o};
const DIVN=[];for(let n=12;n<=100;n++){const p=pairsOf(n).length;if(p>=3&&p<=5&&!isP(n))DIVN.push(n)}
const COMPO=[21,27,33,39,49,51,57,63,69,77,81,87,91,93];
const PRIMES2=[11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97];
const lastLoop=(n,x,y,s,c)=>{const w=tw(String(n),s);return A.loop(x+w/2-.235*s,y-s*.32,s*.3,s*.5,c)};
const PR={steps:[
 {say:t3("12 elever ställer upp i lika långa rader: 1 rad med 12, 2 rader med 6 eller 3 rader med 4. Talen 1, 2, 3, 4, 6 och 12 är delare till 12.",
   "12 pupils line up in equal rows: 1 row of 12, 2 rows of 6 or 3 rows of 4. The numbers 1, 2, 3, 4, 6 and 12 are the divisors of 12.",
   "يصطفّ 12 تلميذًا في صفوف متساوية: صف واحد من 12، أو صفّان من 6، أو 3 صفوف من 4. الأعداد 1 و2 و3 و4 و6 و12 هي قواسم العدد 12."),
  draw:()=>{const M=MUL();return[A.wipe(),A.p(dots(dotGrid(110,95,12,1,44)),"o",22),qx(`1 ${M} 12`,700,107,36,"o"),
   A.p(dots(dotGrid(110,190,6,2,44)),"b",22),qx(`2 ${M} 6`,220,320,36,"b"),
   A.p(dots(dotGrid(470,170,4,3,44)),"g",22),qx(`3 ${M} 4`,536,320,36,"g"),
   A.tx(L(t3("Delare till 12:","Divisors of 12:","قواسم العدد 12:")),400,392,34),A.hl(210,414,380,62),A.tx("1, 2, 3, 4, 6, 12",400,460,46,"g")]}},
 {say:t3("7 elever kan bara stå i 1 rad med 7. I 2 rader blir en över. 7 har bara två delare, 1 och 7, och kallas därför ett primtal.",
   "7 pupils can only stand in 1 row of 7. In 2 rows one is left over. 7 has only two divisors, 1 and 7, so it is called a prime number.",
   "لا يستطيع 7 تلاميذ الاصطفاف إلا في صف واحد من 7، وفي صفّين يبقى واحد. للعدد 7 قاسمان فقط هما 1 و7، لذلك يُسمّى عددًا أوليًا."),
  draw:()=>[A.wipe(),A.p(dots(dotGrid(140,100,7,1,44)),"o",22),qx(`1 ${MUL()} 7`,590,112,36,"o"),
   A.p(dots(dotGrid(140,195,3,2,44)),"b",22),A.p(dots([[272,195]]),"r",22),A.loop(272,195,26,26,"r"),
   qx(L(t3("2 rader? 1 blir över","2 rows? 1 left over","صفّان؟ يبقى 1")),590,225,32,"r"),
   A.tx(L(t3("Primtal: bara två delare, 1 och talet självt","Prime number: only two divisors, 1 and itself","العدد الأولي: له قاسمان فقط، 1 والعدد نفسه")),400,330,32,"b"),
   A.tx(L(t3("1 är inte ett primtal","1 is not a prime number","العدد 1 ليس عددًا أوليًا")),400,380,28,"o"),
   A.hl(130,410,540,64),A.tx("2, 3, 5, 7, 11, 13, 17, 19, 23, 29 ...",400,456,40,"g")]},
 {say:t3("För 2, 5 och 10 räcker det att titta på sista siffran. Jämn siffra: delbart med 2. Slutar på 0 eller 5: delbart med 5. Slutar på 0: delbart med 10.",
   "For 2, 5 and 10 you only need the last digit. An even digit: divisible by 2. Ends in 0 or 5: divisible by 5. Ends in 0: divisible by 10.",
   "للقسمة على 2 و5 و10 يكفي أن تنظر إلى الرقم الأخير. إذا كان زوجيًا فالعدد يقبل القسمة على 2، وإذا كان 0 أو 5 فيقبل القسمة على 5، وإذا كان 0 فيقبل القسمة على 10."),
  draw:()=>{const C=[[150,2,"b","0 2 4 6 8",348,351],[400,5,"o","0   5",735,732],[650,10,"r","0",490,495]],o=[A.wipe(),A.tx(L(t3("Titta på sista siffran!","Look at the last digit!","انظر إلى الرقم الأخير!")),400,56,38)];
   C.forEach(([x,d,c,dg,n1,n2])=>{o.push(A.band(x-112,86,224,394,c),A.tx(L(t3(`delbart med ${d}`,`divisible by ${d}`,`يقبل القسمة على ${d}`)),x,130,28,c),
     qx(L(t3("sista siffran","last digit","الرقم الأخير")),x,180,24),A.tx(dg,x,234,44,c));
    [[n1,335,true],[n2,430,false]].forEach(([n,y,good])=>o.push(A.tx(n,x-16,y,56),lastLoop(n,x-16,y,56,c),good?okM(x+66,y-20):noM(x+66,y-20)))});return o}},
 {say:t3("Delbart med 3? Lägg ihop siffrorna. 2 + 3 + 4 = 9 och 9 är delbart med 3, så 234 / 3 = 78 går jämnt ut. För 451 blir summan 10, så det går inte.",
   "Divisible by 3? Add up the digits. 2 + 3 + 4 = 9 and 9 is divisible by 3, so 234 ÷ 3 = 78 exactly. For 451 the sum is 10, so it doesn't work.",
   `هل يقبل القسمة على 3؟ اجمع أرقامه. ${LRI("2 + 3 + 4 = 9")}، و9 يقبل القسمة على 3، إذن ${LRI("234 ÷ 3 = 78")} دون باقٍ. أما 451 فمجموع أرقامه 10، فلا يقبل القسمة على 3.`),
  draw:()=>{const o=[A.wipe(),A.tx(L(t3("Delbart med 3? Lägg ihop siffrorna!","Divisible by 3? Add up the digits!","هل يقبل القسمة على 3؟ اجمع أرقامه!")),400,56,36,"b")];
   [[220,234,true],[580,451,false]].forEach(([x,n,good])=>{const sum=dsum(n);
    o.push(A.tx(n,x,168,88),A.arrow(x,192,x,226,"k"),A.tx(String(n).split("").join(" + ")+` = ${sum}`,x,278,42,"b"),
     A.tx(L(good?t3(`${sum} är delbart med 3`,`${sum} is divisible by 3`,`${sum} يقبل القسمة على 3`):t3(`${sum} är inte delbart med 3`,`${sum} is not divisible by 3`,`${sum} لا يقبل القسمة على 3`)),x,342,30,good?"g":"r"),
     good?okM(x+100,140):noM(x+100,140))});
   o.push(A.hl(240,402,320,68),A.tx(`234 ${DIVS()} 3 = 78`,400,452,52,"g"));return o}},
 {say:t3("Ett tal som inte är primtal kan delas upp i primtal med ett faktorträd. 60 = 6 · 10, 6 = 2 · 3 och 10 = 2 · 5. Alltså är 60 = 2 · 2 · 3 · 5.",
   "A number that is not prime can be split into primes with a factor tree. 60 = 6 × 10, 6 = 2 × 3 and 10 = 2 × 5. So 60 = 2 × 2 × 3 × 5.",
   `العدد غير الأولي يمكن تحليله إلى أعداد أولية بشجرة العوامل. ${LRI("60 = 6 × 10")}، و${LRI("6 = 2 × 3")}، و${LRI("10 = 2 × 5")}. إذن ${LRI("60 = 2 × 2 × 3 × 5")}.`),
  draw:()=>{const T=treeAct(60,400,82,100,140,50,[6,10]);return[A.wipe(),T.root,...T.splits.flat(),...T.circles,
   A.tx(L(t3("primtalsfaktorisering","prime factorisation","التحليل إلى عوامل أولية")),400,370,30,"b"),A.hl(220,402,360,68),A.tx(`60 = ${PSTR([2,2,3,5])}`,400,452,52,"g")]}},
 {say:t3("Spelar det någon roll hur man börjar? Nej! 60 = 2 · 30 och 60 = 4 · 15 ger samma primtal till slut: 2, 2, 3 och 5.",
   "Does it matter how you start? No! 60 = 2 × 30 and 60 = 4 × 15 end with the same primes: 2, 2, 3 and 5.",
   `هل يهمّ كيف نبدأ؟ لا! ${LRI("60 = 2 × 30")} و${LRI("60 = 4 × 15")} ينتهيان بالأعداد الأولية نفسها: 2 و2 و3 و5.`),
  draw:()=>{const T1=treeAct(60,185,72,80,76,42,[2,30]),T2=treeAct(60,600,72,80,85,42,[4,15]),o=[A.wipe()];
   [T1,T2].forEach((T,i)=>o.push(T.root,...T.splits.flat(),...T.circles,A.tx(PSTR([2,2,3,5]),i?600:200,388,38,"g")));
   o.push(A.p(R.line(400,60,400,410,.3),"#9aa8c4",2),A.hl(240,416,320,64),A.tx(L(t3("Samma primtal!","The same primes!","الأعداد الأولية نفسها!")),400,462,44,"g"));return o}}
]};
LESSONS.push({id:"prime6",subject:"math",grades:"6",kind:"wb",
 title:t3("Delbarhet och primtal","Divisibility and primes","قابلية القسمة والأعداد الأولية"),
 icon:ICO(`<text x="160" y="40" ${CV} font-size="34" fill="#1d2433">60</text><path d="M146 48L106 78M174 48L214 78M92 104L70 128M108 104L130 128M208 104L186 128M224 104L246 128" stroke="#1d2433" stroke-width="3" stroke-linecap="round" fill="none"/><text x="100" y="100" ${CV} font-size="30" fill="#1d2433">6</text><text x="220" y="100" ${CV} font-size="30" fill="#1d2433">10</text>${[[62,2],[138,3],[182,2],[258,5]].map(([x,t])=>`<circle cx="${x}" cy="146" r="17" fill="#1e9e5a" fill-opacity=".1" stroke="#1e9e5a" stroke-width="3"/><text x="${x}" y="156" ${CV} font-size="28" fill="#1e9e5a">${t}</text>`).join("")}`),
 steps:PR.steps,mount:wbMount(PR),
 gen(level){const M=MUL(),D=DIVS();
  if(level===0){const d=pick([2,3,3,5,10,3]);let opts;
   do{const good=d===3?rint(34,333)*3:d===2?rint(6,494)*2:d===5?rint(3,199)*5:rint(2,99)*10,bad=[];
    while(bad.length<2){let b=d===3?rint(100,999):rint(12,999);if(d===10&&!bad.length&&Math.random()<.6)b=rint(2,99)*10+5;if(b%d&&b!==good&&!bad.includes(b))bad.push(b)}
    opts=shuffle([good,...bad])}while(d===3&&opts.some(n=>n<100));
   const ans=opts.findIndex(n=>n%d===0),X=[170,400,630],n=opts[ans];
   const q=[A.wipe(),A.tx(L(t3(`Vilket tal är delbart med ${d}?`,`Which number is divisible by ${d}?`,`أي عدد يقبل القسمة على ${d}؟`)),400,90,44),...opts.map((v,i)=>A.tx(v,X[i],250,84))];
   const sol=[];let hc;
   if(d===3){const w=opts.findIndex(v=>v%3);[w,...opts.keys()].filter((i,k,a)=>a.indexOf(i)===k).forEach(i=>{const v=opts[i];sol.push(A.tx(String(v).split("").join(" + ")+` = ${dsum(v)}`,X[i],340,32,"b"))});hc=1;
    opts.forEach((v,i)=>sol.push(v%3?noM(X[i],392):okM(X[i],392)))}
   else{opts.forEach((v,i)=>sol.push(lastLoop(v,X[i],250,84,"o")));hc=3;opts.forEach((v,i)=>sol.push(v%d?noM(X[i],340):okM(X[i],340)))}
   sol.push(A.loop(X[ans],222,tw(String(n),84)/2+26,58,"g"),A.hl(210,412,380,66),A.tx(`${n} ${D} ${d} = ${n/d}`,400,462,50,"g"));
   return{kind:"choice",opts:opts.map(String),ans,show:String(n),hc,q,sol}}
  if(level===1&&Math.random()<.5){const p=pick(PRIMES2),C=shuffle(COMPO).slice(0,3),opts=shuffle([p,...C]),ans=opts.indexOf(p),X=[130,310,490,670];
   const q=[A.wipe(),A.tx(L(t3("Vilket tal är ett primtal?","Which number is a prime number?","أيّ هذه الأعداد عدد أولي؟")),400,90,44),...opts.map((v,i)=>A.tx(v,X[i],250,80))];
   const sol=[];opts.forEach((v,i)=>{if(v!==p){const a=pfac(v)[0];sol.push(A.tx(`${a} ${M} ${v/a}`,X[i],340,34,"r"),noM(X[i],392))}});
   sol.push(A.loop(X[ans],222,46,58,"g"),A.tx(`1 ${M} ${p}`,X[ans],340,34,"g"),okM(X[ans],392),
    A.hl(220,418,360,62),A.tx(L(t3(`${p} är ett primtal`,`${p} is a prime number`,`${p} عدد أولي`)),400,462,40,"g"));
   return{kind:"choice",opts:opts.map(String),ans,show:String(p),hc:1,q,sol}}
  if(level===1){const n=pick(DIVN),P=pairsOf(n),Dv=[...new Set(P.flat())].sort((a,b)=>a-b),m=Dv.length,np=P.length;
   const title=L(t3(`Hur många delare har ${n}?`,`How many divisors does ${n} have?`,`كم قاسمًا للعدد ${n}؟`));
   const q=[A.wipe(),A.tx(title,400,80,44),A.tx(n,400,290,140,"b")];
   const sol=[A.wipe(),A.tx(title,400,52,36)];P.forEach(([a,b],i)=>sol.push(A.tx(`${a} ${M} ${b}`,400+(i-(np-1)/2)*145,130,34,MCOLS[i])));
   const sp=Math.min(78,620/(m-1)),XD=i=>400+(i-(m-1)/2)*sp,Y=360;
   sol.push(...Dv.map((v,i)=>A.tx(v,XD(i),Y,34)));
   P.forEach(([a,b],i)=>{const ia=Dv.indexOf(a),ib=Dv.indexOf(b);if(a===b)sol.push(A.loop(XD(ia),Y-12,24,30,MCOLS[i]));
    else{const h=60+(np-1-i)*36,x1=XD(ia),x2=XD(ib);sol.push(A.p(`M${f1(x1)},${Y-34}Q${f1((x1+x2)/2)},${f1(Y-34-h)} ${f1(x2)},${Y-34}`,MCOLS[i],3.5))}});
   sol.push(A.hl(250,412,300,64),A.tx(L(t3(`${m} delare`,`${m} divisors`,m<=10?`${m} قواسم`:`${m} قاسمًا`)),400,460,48,"g"));
   return{kind:"num",ans:m,show:String(m),hc:4,q,sol}}
  const n=pick(TREEN),f=pfac(n),right=PSTR(f);let opts;
  do{const i=rint(0,f.length-2),d1=[...f.slice(0,i),f[i]*f[i+1],...f.slice(i+2)],j=rint(0,f.length-1),d2=f.map((p,k)=>k===j?pick([2,3,5,7].filter(x=>x!==p)):p),
    d3=Math.random()<.5?f.slice(1):[2,...f];opts=[right,PSTR(d1),PSTR(d2),PSTR(d3)]}while(new Set(opts).size<4);
  const order=shuffle([0,1,2,3]),O=order.map(k=>opts[k]),ans=order.indexOf(0),t=mkTree(n),nl=nLeaf(t),sp=Math.min(130,560/(nl-1));
  const T=treeAct(n,400,130,85,sp,44),title=L(t3(`Vilken är primtalsfaktoriseringen av ${n}?`,`What is the prime factorisation of ${n}?`,`ما تحليل العدد ${n} إلى عوامل أولية؟`));
  const sol=[...T.splits.flat(),...T.circles,A.hl(400-tw(`${n} = ${right}`,48)/2-24,414,tw(`${n} = ${right}`,48)+48,64),A.tx(`${n} = ${right}`,400,462,48,"g")];
  return{kind:"choice",opts:O,ans,show:right,hc:4,q:[A.wipe(),A.tx(title,400,52,34),T.root],sol}}
});
const MCOLS=["r","b","o","g","r"];

/* ---------------------------------------------------------------
   2. order6: order of operations and brackets
   --------------------------------------------------------------- */
const OPF={"+":(a,b)=>a+b,"-":(a,b)=>a-b,"*":(a,b)=>a*b,"/":(a,b)=>a/b};
const sym=t=>t==="*"?MUL():t==="/"?DIVS():t==="-"?"−":typeof t==="number"?(t<0?"−"+fmt(-t):fmt(t)):t;
/* one step by the rules: innermost brackets first, then · and / from the left, then + and − from the left */
function oStep(T){let lo=0,hi=T.length;const c=T.indexOf(")");if(c>=0){let o=c;while(T[o]!=="(")o--;lo=o+1;hi=c}
 let k=-1;for(let i=lo;i<hi;i++)if(T[i]==="*"||T[i]==="/"){k=i;break}
 if(k<0)for(let i=lo;i<hi;i++)if(T[i]==="+"||T[i]==="-"){k=i;break}
 const a=T[k-1],b=T[k+1],v=OPF[T[k]](a,b);let U=[...T.slice(0,k-1),v,...T.slice(k+2)];
 for(let i=0;i+2<U.length;i++)if(U[i]==="("&&U[i+2]===")"){U.splice(i,3,U[i+1]);i=-1}
 return{U,k,a,b,op:T[k],v}}
const oAll=T=>{const st=[];while(T.length>1){const r=oStep(T);st.push(r);T=r.U}return st};
/* worked board: expression on line 0, each step underlines the part being worked out and writes the next line */
function oWork(T0,cx,y0,s,gap,unit,cols=["r","b","o","r"]){const st=oAll(T0),lines=[T0.map(sym),...st.map(r=>r.U.map(sym))],W=aligned(lines,cx,y0,s,gap,unit);
 let T=T0;const und=st.map((r,i)=>{const S=lines[i],P=rowAt(S,W.L0,s),a=r.k-1,b=r.k+1,inP=T[a-1]==="("&&T[b+1]===")",i1=inP?a-1:a,i2=inP?b+1:b;T=r.U;
  return A.p(R.line(P.xs[i1]-P.ws[i1]/2-3,y0+i*gap+s*.2,P.xs[i2]+P.ws[i2]/2+3,y0+i*gap+s*.2,.4),cols[i%cols.length],4.5)});
 return{first:W.first,steps:W.rest.map((l,i)=>[und[i],...l]),st}}
const parseT=(f,R0)=>{const v={};for(const ch of f)if(/[a-e]/.test(ch)&&v[ch]==null)v[ch]=rint(...R0[ch]);return[...f].map(ch=>/[a-e]/.test(ch)?v[ch]:ch)};
const validT=T=>{try{const st=oAll(T);return st.every(r=>Number.isInteger(r.v)&&r.v>=0&&r.v<=300&&(r.op==="*"||r.op==="/"?r.a>=2&&r.b>=2&&r.a*(r.op==="*"?r.b:1)<=200:true))&&st[st.length-1].v<=250}catch(e){return false}};
const OFORM=[
 [["a+b*c",{a:[2,40],b:[2,9],c:[2,9]}],["a*b+c",{a:[2,9],b:[2,9],c:[2,40]}],["a-b*c",{a:[20,80],b:[2,9],c:[2,9]}],["a*b-c",{a:[2,9],b:[3,9],c:[2,30]}],
  ["a+b/c",{a:[2,40],b:[4,81],c:[2,9]}],["a-b/c",{a:[10,60],b:[4,81],c:[2,9]}],["a/b+c",{a:[4,81],b:[2,9],c:[2,40]}]],
 [["(a+b)*c",{a:[2,20],b:[2,20],c:[2,9]}],["a*(b+c)",{a:[2,9],b:[2,15],c:[2,15]}],["(a-b)*c",{a:[8,30],b:[2,20],c:[2,9]}],["a*(b-c)",{a:[2,9],b:[8,30],c:[2,20]}],
  ["(a+b)/c",{a:[2,50],b:[2,50],c:[2,9]}],["a*b+c*d",{a:[2,9],b:[2,9],c:[2,9],d:[2,9]}],["a*b-c*d",{a:[2,9],b:[2,9],c:[2,9],d:[2,9]}],["a-b+c*d",{a:[10,50],b:[2,20],c:[2,9],d:[2,9]}]],
 [["a+b*(c-d)",{a:[2,30],b:[2,9],c:[5,20],d:[2,15]}],["(a+b)*c-d",{a:[2,12],b:[2,12],c:[2,9],d:[2,40]}],["a-(b+c)*d",{a:[30,99],b:[2,9],c:[2,9],d:[2,6]}],
  ["(a-b)/c+d*e",{a:[10,60],b:[2,30],c:[2,9],d:[2,9],e:[2,9]}],["a*b-(c+d)/e",{a:[2,9],b:[2,9],c:[2,40],d:[2,40],e:[2,9]}],["(a+b)*(c-d)",{a:[2,9],b:[2,9],c:[5,15],d:[2,12]}],
  ["a-b/c*d",{a:[20,90],b:[4,60],c:[2,9],d:[2,9]}],["a*(b+c)-d*e",{a:[2,6],b:[2,9],c:[2,9],d:[2,9],e:[2,9]}]]];
const OD=[t3("Max","Max","ماكس"),t3("Elin","Elin","إلين")];
const ORD={steps:[
 {say:t3("Elin och Max räknar 2 + 3 · 4. Elin räknar från vänster och får 20. Max räknar gånger först och får 14. Max har rätt: multiplikation går före addition.",
   "Elin and Max work out 2 + 3 × 4. Elin goes from the left and gets 20. Max multiplies first and gets 14. Max is right: multiplication comes before addition.",
   `تحسب إلين وماكس ${LRI("2 + 3 × 4")}. تحسب إلين من اليسار فتحصل على 20، ويضرب ماكس أولًا فيحصل على 14. ماكس على حق: الضرب قبل الجمع.`),
  draw:()=>{const M=MUL(),E=rowC(["2","+","3",M,"4"],400,92,66),P=E.P,u=(i,j,y,c)=>A.p(R.line(P.xs[i]-P.ws[i]/2-3,y,P.xs[j]+P.ws[j]/2+3,y,.3),c,4.5);
   return[A.wipe(),...E,A.p(kidP(200,255,118),"o",4),A.tx(L(OD[1]),200,296,32,"o"),u(0,2,110,"r"),A.tx(`5 ${M} 4 = 20`,200,360,46,"r"),noM(200,412),
    A.p(kidP(600,255,118),"b",4),A.tx(L(OD[0]),600,296,32,"b"),u(2,4,124,"g"),A.tx("2 + 12 = 14",600,360,46,"g"),okM(600,412),
    A.hl(230,428,340,58),A.tx(L(t3("Gånger före plus!","Multiply before you add!","الضرب قبل الجمع!")),400,468,40,"b")]}},
 {say:t3("Prioriteringsreglerna: först parenteser, sedan multiplikation och division, sist addition och subtraktion. På samma nivå räknar du från vänster till höger.",
   "The order of operations: brackets first, then multiplication and division, and addition and subtraction last. On the same level you work from left to right.",
   "ترتيب العمليات: الأقواس أولًا، ثم الضرب والقسمة، ثم الجمع والطرح أخيرًا. وفي المستوى نفسه نحسب من اليسار إلى اليمين."),
  draw:()=>{const rows=[["( )",t3("Parenteser","Brackets","الأقواس"),"r"],[`${MUL()}   ${DIVS()}`,t3("Multiplikation och division","Multiplication and division","الضرب والقسمة"),"b"],["+   −",t3("Addition och subtraktion","Addition and subtraction","الجمع والطرح"),"g"]],o=[A.wipe()];
   rows.forEach(([s,l,c],i)=>{const y=110+i*112;o.push(A.band(110,y-62,580,90,c),A.p(R.circ(MX(165),y-16,28),c,4),A.tx(i+1,MX(165),y,40,c),A.tx(s,MX(262),y+2,54,c),A.tx(L(l),MX(490),y-2,31,c));
    if(i<2)o.push(A.arrow(MX(165),y+18,MX(165),y+64,c))});
   o.push(A.tx(L(t3("Samma nivå: från vänster till höger","Same level: from left to right","المستوى نفسه: من اليسار إلى اليمين")),400,460,32,"o"));return o}},
 {say:t3("Popcorn för 45 kr och 3 biobiljetter för 95 kr styck: 45 + 3 · 95. Först gånger: 3 · 95 = 285. Sedan plus: 45 + 285 = 330 kr.",
   "Popcorn for 45 kr and 3 cinema tickets at 95 kr each: 45 + 3 × 95. Multiply first: 3 × 95 = 285. Then add: 45 + 285 = 330 kr.",
   `فشار بـ 45 كرونة و3 تذاكر سينما سعر الواحدة 95 كرونة: ${LRI("45 + 3 × 95")}. نضرب أولًا: ${LRI("3 × 95 = 285")}، ثم نجمع: ${LRI("45 + 285 = 330")} كرونة.`),
  draw:()=>{const W=oWork([45,"+",3,"*",95],400,272,54,82,"kr");
   return[A.wipe(),A.p("M100,80L180,80L168,190L112,190Z"+R.line(126,80,130,190,.2)+R.line(154,80,150,190,.2)+[110,128,146,164].map((x,i)=>R.circ(x+6,72-(i%2)*8,14)).join(""),"o",3.5),qx("45 kr",140,232,30,"o"),
    ...[320,465,610].flatMap(x=>[A.p(R.rect(x-60,92,120,66,.3)+R.dashed(x-34,98,x-34,152,7),"b",3.5),qx("95 kr",x+12,135,28,"b")]),
    ...W.first,...W.steps.flat()]}},
 {say:t3("Fyra kompisar köper var sin hamburgare för 65 kr och en dricka för 20 kr: 4 · (65 + 20). Parentesen först: 65 + 20 = 85. Sedan 4 · 85 = 340 kr.",
   "Four friends each buy a burger for 65 kr and a drink for 20 kr: 4 × (65 + 20). Brackets first: 65 + 20 = 85. Then 4 × 85 = 340 kr.",
   `يشتري أربعة أصدقاء كلٌّ منهم برغر بـ 65 كرونة ومشروبًا بـ 20 كرونة: ${LRI("4 × (65 + 20)")}. الأقواس أولًا: ${LRI("65 + 20 = 85")}، ثم ${LRI("4 × 85 = 340")} كرونة.`),
  draw:()=>{const W=oWork([4,"*","(",65,"+",20,")"],400,268,54,82,"kr"),X=[138,313,488,663];
   return[A.wipe(),...X.flatMap(x=>{const bx=x-30,cx2=x+36;return[A.p(`M${bx-30},98Q${bx},58 ${bx+30},98Z`+R.line(bx-32,108,bx+32,108,.2)+`M${bx-30},118Q${bx},132 ${bx+30},118Z`,"o",3.5),
     A.p(`M${cx2-16},76L${cx2+16},76L${cx2+12},132L${cx2-12},132Z`+R.line(cx2+4,76,cx2+12,58,.1),"b",3.5),qx("65",bx,170,26,"o"),qx("20",cx2,170,26,"b"),A.loop(x+2,118,72,70,"r")]}),
    ...W.first,...W.steps.flat()]}},
 {say:t3("Bara plus och minus, eller bara gånger och delat? Då räknar du från vänster till höger: 20 − 8 + 2 = 14 och 24 / 4 · 2 = 12.",
   "Only plus and minus, or only times and divide? Then you work from left to right: 20 − 8 + 2 = 14 and 24 ÷ 4 × 2 = 12.",
   `إذا كان في التعبير جمع وطرح فقط، أو ضرب وقسمة فقط، فاحسب من اليسار إلى اليمين: ${LRI("20 − 8 + 2 = 14")} و${LRI("24 ÷ 4 × 2 = 12")}.`),
  draw:()=>{const W1=oWork([20,"-",8,"+",2],215,200,52,86),W2=oWork([24,"/",4,"*",2],595,200,52,86);
   return[A.wipe(),A.tx(L(t3("Samma nivå: från vänster till höger","Same level: from left to right","المستوى نفسه: من اليسار إلى اليمين")),400,58,36,"o"),A.arrow(200,96,600,96,"o"),
    A.p(R.line(400,140,400,420,.3),"#9aa8c4",2),...W1.first,...W1.steps.flat(),...W2.first,...W2.steps.flat()]}},
 {say:t3("Allt på en gång: 30 − (4 + 2) · 3. Först parentesen: 6. Sedan gånger: 6 · 3 = 18. Sist minus: 30 − 18 = 12.",
   "All at once: 30 − (4 + 2) × 3. Brackets first: 6. Then multiply: 6 × 3 = 18. Subtract last: 30 − 18 = 12.",
   `كل شيء معًا: ${LRI("30 − (4 + 2) × 3")}. الأقواس أولًا: 6. ثم الضرب: ${LRI("6 × 3 = 18")}. وأخيرًا الطرح: ${LRI("30 − 18 = 12")}.`),
  draw:()=>{const W=oWork([30,"-","(",4,"+",2,")","*",3],400,110,60,104,null,["r","b","g"]);
   return[A.wipe(),...W.first,...W.steps.flatMap((s,i)=>[...s,A.p(R.circ(700,110+(i+1)*104-20,24),["r","b","g"][i],3.5),qx(i+1,700,110+(i+1)*104-8,32,["r","b","g"][i])])]}}
]};
LESSONS.push({id:"order6",subject:"math",grades:"6",kind:"wb",
 title:t3("Prioriteringsregler","Order of operations","ترتيب العمليات الحسابية"),
 icon:ICO(`<text x="62" y="86" ${CV} font-size="54" fill="#1d2433">2 +</text><text x="166" y="86" ${CV} font-size="54" fill="#1d2433">3·4</text><path d="M134 98H198" stroke="#d63b2f" stroke-width="4" stroke-linecap="round"/><text x="250" y="86" ${CV} font-size="54" fill="#e07b00">( )</text><text x="160" y="152" ${CV} font-size="46" fill="#1e9e5a">= 2 + 12 = 14</text>`),
 steps:ORD.steps,mount:wbMount(ORD),
 gen(level){let T;do{const [f,R0]=pick(OFORM[level]);T=parseT(f,R0)}while(!validT(T));
  const st=oAll(T),n=st.length,gap=n<=2?100:n===3?90:78,s=n<=2?64:58,W=oWork(T,400,Math.round(285-n*gap/2),s,gap),ans=st[n-1].v;
  return{kind:"num",ans,show:fmt(ans),hc:1,q:[A.wipe(),A.tx(L(t3("Räkna ut","Work it out","احسب")),400,58,38,"b"),...W.first],sol:W.steps.flat()}}
});

/* ---------------------------------------------------------------
   3. negcalc6: adding and subtracting negative numbers
   --------------------------------------------------------------- */
const numL=(lo,hi,x1,x2,y,lab=1,size=24,mult=1)=>{const X=v=>x1+(v-lo)*(x2-x1)/(hi-lo);let d=R.line(x1-18,y,x2+18,y,.4);
 for(let v=lo;v<=hi;v++){const big=v%lab===0;d+=`M${f1(X(v))},${y-(v===0?16:big?11:6)}v${v===0?32:big?22:12}`}
 const o=[A.p(d,"k",3.5)];for(let v=Math.ceil(lo/lab)*lab;v<=hi;v+=lab)o.push(qx(ng(v*mult),X(v),y+40,size,v<0?"b":v>0?"r":"k"));return{o,X}};
/* a jump above the line from a to b */
const hop=(X,a,b,y,c,lab)=>{const x1=X(a),x2=X(b),h=Math.min(64,Math.max(30,Math.abs(x2-x1)*.32));return[A.arrow(x1,y-12,x2,y-12,c,(x2>x1?-1:1)*h),qx(lab,(x1+x2)/2,y-12-h/2-14,26,c)]};
/* number-line solution of a + b (b may be negative): one jump, or two jumps split at zero */
function nlSol(a,b,y){const r=a+b;let lo=Math.min(a,r,0)-1,hi=Math.max(a,r,0)+1;while(hi-lo<12){if((hi-lo)%2)lo--;else hi++}
 const N=numL(lo,hi,80,720,y),c=b>0?"g":"b",seg=a*r<0?[[a,0],[0,r]]:[[a,r]],o=[...N.o,A.p(dots([[N.X(a),y]]),"o",18)],k=o.length;
 seg.forEach(([p,q])=>o.push(...hop(N.X,p,q,y,c,`${q>p?"+":"−"}${Math.abs(q-p)}`)));o.push(A.p(dots([[N.X(r),y]]),"g",18));return{o,k}}
/* counters: red +1, blue −1 */
const chip=(x,y,pos)=>A.p(R.circ(x,y,22)+R.line(x-10,y,x+10,y,.1)+(pos?R.line(x,y-10,x,y+10,.1):""),pos?"r":"b",4);
const debt=(x,y)=>[A.p(R.rect(x-55,y-30,110,60,.3),"b",3.5),qx(lang==="ar"?"−10":"−10 kr",x,y+10,28,"b")];
const coin=(x,y)=>[A.p(R.circ(x,y,26),"r",3.5),qx("10",x,y+8,24,"r")];
const NEGC={steps:[
 {say:t3("På tallinjen betyder plus steg åt höger och minus steg åt vänster. −4 + 6: sex steg åt höger, till 2. 3 − 8: åtta steg åt vänster, till −5.",
   "On the number line, plus means steps to the right and minus means steps to the left. −4 + 6: six steps right, to 2. 3 − 8: eight steps left, to −5.",
   `على خط الأعداد، الجمع خطوات إلى اليمين والطرح خطوات إلى اليسار. ${LRI("−4 + 6")}: ست خطوات إلى اليمين حتى 2. ${LRI("3 − 8")}: ثماني خطوات إلى اليسار حتى ${LRI("−5")}.`),
  draw:()=>{const A1=numL(-8,8,90,710,196),A2=numL(-8,8,90,710,416);
   return[A.wipe(),...rowC(["−4","+","6","=","2"],400,70,50,(i)=>i===4?"g":"k"),...A1.o,A.p(dots([[A1.X(-4),196]]),"o",18),...hop(A1.X,-4,2,196,"g","+6"),A.p(dots([[A1.X(2),196]]),"g",18),
    ...rowC(["3","−","8","=","−5"],400,300,50,(i)=>i===4?"g":"k"),...A2.o,A.p(dots([[A2.X(3),416]]),"o",18),...hop(A2.X,3,0,416,"b","−3"),...hop(A2.X,0,-5,416,"b","−5"),A.p(dots([[A2.X(-5),416]]),"g",18)]}},
 {say:t3("I ett spel har du −20 poäng och förlorar 30 poäng till. Du är redan under noll och går 30 steg till åt vänster: −20 − 30 = −50.",
   "In a game you have −20 points and lose 30 more. You are already below zero and go 30 more steps to the left: −20 − 30 = −50.",
   `في لعبة معك ${LRI("−20")} نقطة، ثم تخسر 30 نقطة أخرى. أنت تحت الصفر أصلًا، فتتحرك 30 خطوة أخرى إلى اليسار: ${LRI("−20 − 30 = −50")}.`),
  draw:()=>{const N=numL(-6,1,120,680,320,1,24,10),scr=(x,v)=>[A.p(R.rect(x-100,50,200,120,.3),"k",4),A.p(R.rect(x-86,62,172,96,.2),"#9aa8c4",2),qx(L(t3("POÄNG","POINTS","النقاط")),x,94,26,"o"),A.tx(ng(v),x,146,50,"b")];
   return[A.wipe(),...scr(MX(200),-20),A.arrow(MX(315),110,MX(485),110,"r"),qx("−30",400,96,32,"r"),...scr(MX(600),-50),
    ...N.o,A.p(dots([[N.X(-2),320]]),"o",18),...hop(N.X,-2,-5,320,"b","−30"),A.p(dots([[N.X(-5),320]]),"g",18),
    A.hl(240,414,320,62),A.tx("−20 − 30 = −50",400,460,48,"g")]}},
 {say:t3("Röda brickor är +1 och blå är −1. En röd och en blå blir tillsammans 0. 5 + (−3): tre par blir noll och 2 röda blir kvar. Alltså 5 + (−3) = 5 − 3 = 2.",
   "Red counters are +1 and blue ones are −1. One red and one blue together make 0. 5 + (−3): three pairs make zero and 2 red are left. So 5 + (−3) = 5 − 3 = 2.",
   `القطع الحمراء ${LRI("+1")} والزرقاء ${LRI("−1")}. قطعة حمراء وقطعة زرقاء معًا تساويان 0. في ${LRI("5 + (−3)")} تصبح ثلاثة أزواج صفرًا ويبقى قطعتان حمراوان. إذن ${LRI("5 + (−3) = 5 − 3 = 2")}.`),
  draw:()=>{const X=i=>MX(140+i*76);return[A.wipe(),...rowC(["5","+","(","−3",")"],400,62,54),
   ...[0,1,2,3,4].map(i=>chip(X(i),165,true)),...[0,1,2].map(i=>chip(X(i),255,false)),
   chip(MX(640),165,true),qx("= +1",MX(705),175,30,"r"),chip(MX(640),255,false),qx("= −1",MX(705),265,30,"b"),
   ...[0,1,2].flatMap(i=>[A.loop(X(i),210,31,78,"k"),qx("0",X(i),330,30)]),A.loop((X(3)+X(4))/2,165,68,36,"g"),qx("2",(X(3)+X(4))/2,245,34,"g"),
   A.hl(160,412,480,62),A.tx("5 + (−3) = 5 − 3 = 2",400,458,46,"g")]}},
 {say:t3("2 − (−4): vi ska ta bort 4 blå brickor, men det finns inga. Vi lägger till 4 nollpar, det ändrar inte värdet. Tar vi sedan bort 4 blå blir 6 röda kvar.",
   "2 − (−4): we need to take away 4 blue counters, but there aren't any. We add 4 zero pairs, which doesn't change the value. Taking away 4 blue then leaves 6 red.",
   `${LRI("2 − (−4)")}: علينا أن نزيل 4 قطع زرقاء، لكن لا توجد قطع زرقاء. نضيف 4 أزواج صفرية، وهذا لا يغيّر القيمة. ثم نزيل 4 قطع زرقاء فتبقى 6 قطع حمراء.`),
  draw:()=>{const X=i=>MX(130+i*68);return[A.wipe(),...rowC(["2","−","(","−4",")"],400,62,54),chip(X(0),165,true),chip(X(1),165,true),
   A.p(R.dashed(X(1.5),120,X(1.5),300,9),"o",3),...[2,3,4,5].flatMap(i=>[chip(X(i),165,true),chip(X(i),255,false)]),
   qx(L(t3("+ 4 nollpar","+ 4 zero pairs","أضف 4 أزواج صفرية")),X(3.5),330,30,"o"),
   A.p([2,3,4,5].map(i=>R.line(X(i)-26,281,X(i)+26,229,.2)).join(""),"r",5),qx(L(t3("ta bort 4 blå","take away 4 blue","أزل 4 زرقاء")),MX(650),262,28,"r"),
   A.loop(X(2.5),165,232,40,"g"),qx(L(t3("6 röda kvar","6 red left","تبقى 6 حمراء")),MX(650),172,28,"g"),
   A.hl(190,412,420,62),A.tx("2 − (−4) = 2 + 4 = 6",400,458,46,"g")]}},
 {say:t3("Du är skyldig din bror 30 kr, alltså −30. Han stryker 20 kr av skulden: −30 − (−20) = −30 + 20 = −10. Nu är du bara skyldig 10 kr.",
   "You owe your brother 30 kr, that is −30. He cancels 20 kr of the debt: −30 − (−20) = −30 + 20 = −10. Now you only owe 10 kr.",
   `عليك لأخيك دَين قدره 30 كرونة، أي ${LRI("−30")}. يُلغي أخوك 20 كرونة من الدَّين: ${LRI("−30 − (−20) = −30 + 20 = −10")}. صار عليك 10 كرونات فقط.`),
  draw:()=>{const X=[MX(170),MX(310),MX(450)],W=oWork,lines=[["−30","−","(","−20",")"],["−30","+","20"],["−10"]],A2=aligned(lines,400,280,52,82);
   return[A.wipe(),A.tx(L(t3("Skuld: 30 kr","Debt: 30 kr","الدَّين: 30 كرونة")),MX(310),60,34,"b"),...X.flatMap(x=>debt(x,130)),
    A.p([0,1].map(i=>R.line(X[i]-60,165,X[i]+60,95,.2)+R.line(X[i]-60,95,X[i]+60,165,.2)).join(""),"r",4.5),
    qx(L(t3("20 kr struket","20 kr cancelled","أُلغيت 20 كرونة")),(X[0]+X[1])/2,200,28,"r"),qx(L(t3("kvar","left","يبقى")),X[2],200,28,"g"),
    ...A2.first,...A2.rest.flat()]}},
 {say:t3("Kom ihåg: plus ett negativt tal är samma sak som minus. Minus ett negativt tal är samma sak som plus. 7 + (−3) = 4 och 7 − (−3) = 10.",
   "Remember: adding a negative number is the same as subtracting. Subtracting a negative number is the same as adding. 7 + (−3) = 4 and 7 − (−3) = 10.",
   `تذكّر: إضافة عدد سالب مثل الطرح، وطرح عدد سالب مثل الجمع. ${LRI("7 + (−3) = 4")} و${LRI("7 − (−3) = 10")}.`),
  draw:()=>{const r1=rowC(["+","(","−3",")","=","−","3"],400,150,60,(i)=>i<4?"k":"b"),r2=rowC(["−","(","−3",")","=","+","3"],400,300,60,(i)=>i<4?"k":"r"),
   box=(R1,y,c)=>A.loop((R1.P.xs[0]+R1.P.xs[3])/2,y-20,(R1.P.xs[3]-R1.P.xs[0])/2+30,46,c);
   return[A.wipe(),A.tx(L(t3("Två tecken bredvid varandra","Two signs side by side","إشارتان متجاورتان")),400,62,38,"o"),
    ...r1,box(r1,150,"b"),A.tx("7 + (−3) = 7 − 3 = 4",400,222,36,"b"),...r2,box(r2,300,"r"),A.tx("7 − (−3) = 7 + 3 = 10",400,372,36,"r"),
    A.hl(220,412,360,62),A.tx(L(t3("Minus minus blir plus!","Minus minus makes plus!","طرح السالب جمع!")),400,458,42,"g")]}}
]};
const TEMPC=[[t3("på morgonen","in the morning","في الصباح"),t3("på eftermiddagen","in the afternoon","بعد الظهر")],[t3("klockan 6","at 6 o'clock","في الساعة 6"),t3("klockan 18","at 6 pm","في الساعة 18")]];
LESSONS.push({id:"negcalc6",subject:"math",grades:"6",kind:"wb",
 title:t3("Räkna med negativa tal","Calculating with negative numbers","الحساب بالأعداد السالبة"),
 icon:ICO(`<path d="M24 120H296" stroke="#1d2433" stroke-width="3.5" stroke-linecap="round"/>${[-5,-4,-3,-2,-1,0,1,2,3,4,5].map(v=>`<path d="M${160+v*24} ${v?112:106}V${v?128:134}" stroke="#1d2433" stroke-width="3"/>`).join("")}<text x="64" y="156" ${CV} font-size="24" fill="#2257c9">−4</text><text x="160" y="156" ${CV} font-size="24" fill="#1d2433">0</text><text x="232" y="156" ${CV} font-size="24" fill="#d63b2f">3</text><path d="M64 108Q148 40 232 108M232 108l-14 -2M232 108l-4 -13" stroke="#1e9e5a" stroke-width="3.5" fill="none" stroke-linecap="round"/><circle cx="64" cy="120" r="7" fill="#e07b00"/><text x="160" y="46" ${CV} font-size="36" fill="#1d2433">−4 + 7 = 3</text>`),
 steps:NEGC.steps,mount:wbMount(NEGC),
 gen(level){
  if(level===0){let a,b,op,r;do{a=rint(-9,9);b=rint(2,12);op=Math.random()<.5?"+":"−";r=op==="+"?a+b:a-b}while(!a||!r||Math.abs(r)>12||(a>0&&r>0)||Math.max(a,r,0)-Math.min(a,r,0)>14);
   const S=nlSol(a,op==="+"?b:-b,330),T=[ng(a),op,String(b)];
   return{kind:"num",ans:r,show:ng(r),signed:true,hk:S.k,q:[A.wipe(),A.tx(L(t3("Räkna ut","Work it out","احسب")),400,58,38,"b"),...rowC([...T,"=","?"],400,170,72)],
    sol:[...S.o,A.hl(400-tw(`${T.join(" ")} = ${ng(r)}`,50)/2-20,416,tw(`${T.join(" ")} = ${ng(r)}`,50)+40,62),...rowC([...T,"=",ng(r)],400,462,50,"g")]}}
  if(level===1){let a,b,op,r;do{a=rint(-9,9);b=rint(2,9);op=Math.random()<.5?"+":"−";r=op==="+"?a-b:a+b}while(!a||!r||Math.abs(r)>12||Math.max(a,r,0)-Math.min(a,r,0)>14);
   const T=[ng(a),op,"(",ng(-b),")"],T2=[ng(a),op==="+"?"−":"+",String(b)],S=nlSol(a,op==="+"?-b:b,355);
   const RW=rowC([...T,"=",...T2],400,236,44,"b");
   return{kind:"num",ans:r,show:ng(r),signed:true,hk:RW.length,q:[A.wipe(),A.tx(L(t3("Räkna ut","Work it out","احسب")),400,58,38,"b"),...rowC([...T,"=","?"],400,150,66)],
    sol:[...RW,...S.o,A.hl(400-tw(`${T.join(" ")} = ${ng(r)}`,50)/2-20,418,tw(`${T.join(" ")} = ${ng(r)}`,50)+40,62),...rowC([...T,"=",ng(r)],400,464,50,"g")]}}
  if(Math.random()<.4){let a,b,c,r;do{a=rint(-12,6);b=rint(2,12);c=rint(3,14);r=a+b-c}while(!a||!r||Math.abs(r)>20||a+b===0||(a>0&&r>0)||Math.max(a,a+b,0)-Math.min(a,r,0)>26);
   const ct=pick(TEMPC),dg=v=>ng(v)+" °C";
   const q=[A.wipe(),...lab2(L(t3(`Temperatur ${ct[0].sv}:`,`Temperature ${ct[0].en}:`,`درجة الحرارة ${ct[0].ar}:`)),dg(a),72,36,"k","o"),
    A.tx(L(t3(`Det blir ${b} grader varmare, sedan ${c} grader kallare.`,`It gets ${b} degrees warmer, then ${c} degrees colder.`,`ترتفع ${DAR(b)}، ثم تنخفض ${DAR(c)}.`)),400,130,32),
    A.tx(L(t3(`Vilken temperatur blir det ${ct[1].sv}?`,`What is the temperature ${ct[1].en}?`,`كم تصبح درجة الحرارة ${ct[1].ar}؟`)),400,188,36,"b")];
   const W=aligned([[ng(a),"+",String(b),"−",String(c)],[ng(a+b),"−",String(c)],[ng(r)]],300,280,52,88,"°C");
   /* thermometer: a vertical scale with the two changes */
   const lo=Math.min(a,r,0)-2,hi=Math.max(a+b,0)+2,TX=590,yT=236,yB=470,Y=v=>yB-(v-lo)*(yB-yT)/(hi-lo);let d=R.line(TX,yT-8,TX,yB+8,.3);
   for(let v=lo;v<=hi;v++)d+=`M${TX-(v%5?5:v?11:15)},${f1(Y(v))}h${v%5?10:v?22:30}`;
   const th=[A.p(d,"k",3)];for(let v=Math.ceil(lo/5)*5;v<=hi;v+=5)th.push(qx(ng(v),TX-46,Y(v)+8,22,v<0?"b":v>0?"r":"k"));
   th.push(A.p(dots([[TX,Y(a)]]),"o",16),A.arrow(TX+24,Y(a),TX+24,Y(a+b),"r",-22),qx("+"+b,TX+66,(Y(a)+Y(a+b))/2+8,26,"r"),
    A.arrow(TX+104,Y(a+b),TX+104,Y(r),"b",-22),qx("−"+c,TX+146,(Y(a+b)+Y(r))/2+8,26,"b"),A.p(dots([[TX,Y(r)]]),"g",16));
   return{kind:"num",ans:r,show:dg(r),signed:true,hk:W.first.length,q,sol:[...W.first,...th,...W.rest.flat()]}}
  let a,v1,v2,o1,o2,r;
  do{a=rint(-12,12);v1=rint(-12,12);v2=rint(-12,12);o1=pick(["+","−"]);o2=pick(["+","−"]);r=a+(o1==="+"?v1:-v1)+(o2==="+"?v2:-v2)}
  while(!a||!v1||!v2||(v1>0&&v2>0)||!r||Math.abs(r)>25);
  const term=v=>v<0?["(",ng(v),")"]:[String(v)],simp=(o,v)=>{const s=(o==="+")===(v>0);return[s?"+":"−",String(Math.abs(v))]};
  const T0=[ng(a),o1,...term(v1),o2,...term(v2)],T1=[ng(a),...simp(o1,v1),...simp(o2,v2)],m=a+(o1==="+"?v1:-v1);
  const W=aligned([T0,T1,[ng(m),...simp(o2,v2)],[ng(r)]],400,150,56,92);
  return{kind:"num",ans:r,show:ng(r),signed:true,hk:W.rest[0].length,q:[A.wipe(),A.tx(L(t3("Räkna ut","Work it out","احسب")),400,58,38,"b"),...W.first],sol:W.rest.flat()}}
});

/* ---------------------------------------------------------------
   4. decmd6: multiplying and dividing decimals
   --------------------------------------------------------------- */
/* v counts units of 10^-d; written in the current language with d decimals */
const dnum=(v,d)=>{const s=v<0?"−":"";v=Math.abs(v);const ip=Math.floor(v/10**d),fp=v%10**d;return s+fmt(ip)+(d?SEP()+String(fp).padStart(d,"0"):"")};
const tnum=(v,d)=>{while(d>0&&v%10===0){v/=10;d--}return dnum(v,d)};
const PX=i=>110+i*90,PCOL=["o","g","b","r","b","g"];
const pvHd=()=>[fmt(1000),"100","10","1",dfmt(.1),dfmt(.01,2)];
function pvChart(y0,h){const o=[];for(let i=0;i<6;i++)o.push(A.band(PX(i)-40,y0,80,h,PCOL[i]),qx(pvHd()[i],PX(i),y0+34,26,PCOL[i]));
 o.push(A.p(R.line(PX(0)-44,y0+48,PX(5)+44,y0+48,.4),"k",3),A.p(R.dashed(425,y0+54,425,y0+h-6,10),"r",2.5));return o}
/* a value in hundredths placed in the chart; zeros in columns not in `keep` are drawn orange (new place holders) */
function pvRow(v,y,s,c="k",keep){const P=[100000,10000,1000,100,10,1],d=P.map(p=>Math.floor(v/p)%10);let a=d.findIndex(x=>x>0);if(a<0||a>3)a=3;let e=5;while(e>3&&d[e]===0)e--;
 const o=[],cols=[];for(let i=a;i<=e;i++){cols.push(i);o.push(A.tx(d[i],PX(i),y,s,keep&&d[i]===0&&!keep.includes(i)?"o":c))}if(e>3)o.push(A.tx(SEP(),425,y,s,c));return{o,cols}}
/* rows v0 → v1 → … with digit arrows for the first move and labelled curved arrows on the right */
function pvMoves(vals,y0,gap,s,labs){const o=[];let prev=null;vals.forEach((v,i)=>{const y=y0+i*gap,k=i?Math.round(Math.log10(v/vals[i-1])):0,keep=prev?prev.cols.map(c=>c-k):null,R1=pvRow(v,y,s,i?"k":"b",keep);
  if(i){o.push(A.arrow(640,y-gap-14,640,y-30,"b",-26),qx(labs[i-1],710,y-gap/2+2,32,"b"));if(i===1)prev.cols.forEach(c=>o.push(A.arrow(PX(c),y-gap+12,PX(c-k),y-s*.78,"#9aa8c4")))}
  o.push(...R1.o);prev=R1});return o}
/* kort division of v (d decimals) by n; returns the set-up, the steps and where the quotient sits */
function kdiv(v,d,n,cx,QY,DY,s){const ip=String(Math.floor(v/10**d)),fp=d?String(v%10**d).padStart(d,"0"):"",ch=[...ip,...(d?[SEP(),...fp]:[])],CW=s*1.05,CM=s*.42;
 const ws=ch.map(c=>/\d/.test(c)?CW:CM),W=ws.reduce((a,b)=>a+b,0),x0=cx-W/2+s*.4;let x=x0;const xs=ch.map((c,i)=>{const m=x+ws[i]/2;x+=ws[i];return m});
 const BY=QY+s*.28,bx=x0-s*.1,set=[A.tx(n,bx-s*.55,DY,s,"b"),A.p(R.line(bx,BY,bx,DY+s*.3,.3)+R.line(bx,BY,x+s*.2,BY,.4),"k",4.5),...ch.map((c,i)=>A.tx(c,xs[i],DY,s))];
 const lastInt=ip.length-1,steps=[];let rem=0,started=false,first=null,last=null;
 ch.forEach((c,i)=>{if(!/\d/.test(c))return;const di=i>lastInt?i-1:i,cur=rem*10+ +c;
  if(!started&&cur<n&&di<lastInt){rem=cur;return}started=true;const qd=Math.floor(cur/n),r=cur%n,a=[A.tx(qd,xs[i],QY,s,"g")];if(first==null)first=xs[i];last=xs[i];
  if(di===lastInt&&d)a.push(A.tx(SEP(),xs[i+1],QY,s,"g"));
  let j=i+1;if(ch[j]&&!/\d/.test(ch[j]))j++;if(r&&ch[j])a.push(A.tx(r,xs[j]-CW*.42,DY-s*.5,Math.max(24,s*.46),"r"));
  steps.push({a,cur,qd,r});rem=r});
 return{set,steps,first,last}}
const DCTX={
 money:[[n=>t3(`${n} burkar läsk`,`${n} cans of soda`,`عدد علب المشروب الغازي ${n}`),p=>t3(`${p} kr styck`,`${p} kr each`,`سعر العلبة ${p} كرونة`)],
  [n=>t3(`${n} glassar`,`${n} ice creams`,`عدد البوظات ${n}`),p=>t3(`${p} kr styck`,`${p} kr each`,`سعر الواحدة ${p} كرونة`)],
  [n=>t3(`${n} bussbiljetter`,`${n} bus tickets`,`عدد تذاكر الحافلة ${n}`),p=>t3(`${p} kr styck`,`${p} kr each`,`سعر التذكرة ${p} كرونة`)]],
 other:[[n=>t3(`${n} flaskor saft`,`${n} bottles of juice`,`عدد زجاجات العصير ${n}`),p=>t3(`${p} liter i varje`,`${p} litres in each`,`في كل زجاجة ${p} لتر`),"l",t3("Hur många liter blir det?","How many litres is that?","كم لترًا في المجموع؟")],
  [n=>t3(`${n} brädor`,`${n} planks`,`عدد الألواح ${n}`),p=>t3(`${p} m långa`,`${p} m long each`,`طول كل لوح ${p} م`),"m",t3("Hur många meter blir det?","How many metres is that?","كم مترًا في المجموع؟")]]};
const DEC={steps:[
 {say:t3("Gånger 10 gör varje siffra tio gånger större, så den flyttar ett steg åt vänster: 3,45 · 10 = 34,5. Gånger 100 är två steg och gånger 1000 tre steg: 3 450.",
   "Times 10 makes every digit ten times bigger, so it moves one place to the left: 3.45 × 10 = 34.5. Times 100 is two places and times 1000 three places: 3,450.",
   `الضرب في 10 يجعل كل رقم أكبر بعشر مرات، فينتقل منزلة واحدة إلى اليسار: ${LRI("3.45 × 10 = 34.5")}. والضرب في 100 منزلتان، وفي 1000 ثلاث منازل: 3450.`),
  draw:()=>{const M=MUL();return[A.wipe(),...pvChart(40,370),...pvMoves([345,3450,34500,345000],150,76,54,[`${M} 10`,`${M} 10`,`${M} 10`]),
   A.hl(400-tw(`${dnum(345,2)} ${M} ${fmt(1000)} = ${fmt(3450)}`,46)/2-20,426,tw(`${dnum(345,2)} ${M} ${fmt(1000)} = ${fmt(3450)}`,46)+40,60),A.tx(`${dnum(345,2)} ${M} ${fmt(1000)} = ${fmt(3450)}`,400,468,46,"g")]}},
 {say:t3("Delat med 10 flyttar siffrorna ett steg åt höger. 10 glassar kostar 72 kr, så en kostar 72 / 10 = 7,20 kr. Delat med 100 blir två steg: 0,72.",
   "Divided by 10, the digits move one place to the right. 10 ice creams cost 72 kr, so one costs 72 ÷ 10 = 7.20 kr. Divided by 100 is two places: 0.72.",
   `عند القسمة على 10 تنتقل الأرقام منزلة واحدة إلى اليمين. 10 بوظات ثمنها 72 كرونة، إذن ثمن البوظة الواحدة ${LRI("72 ÷ 10 = 7.20")} كرونة. والقسمة على 100 منزلتان: 0.72.`),
  draw:()=>{const D=DIVS();return[A.wipe(),...pvChart(40,310),...pvMoves([7200,720,72],150,76,54,[`${D} 10`,`${D} 10`]),
   A.tx(L(t3("10 glassar kostar 72 kr","10 ice creams cost 72 kr","10 بوظات بـ 72 كرونة")),400,398,32,"b"),
   A.hl(210,422,380,60),A.tx(`72 kr ${D} 10 = ${dnum(720,2)} kr`,400,464,44,"g")]}},
 {say:t3("Tre burkar läsk för 8,95 kr styck. Överslag: 3 · 9 = 27 kr. Räkna utan komma: 3 · 895 = 2 685. 8,95 har två decimaler, så svaret får också två: 26,85 kr.",
   "Three cans of soda at 8.95 kr each. Estimate: 3 × 9 = 27 kr. Work without the decimal point: 3 × 895 = 2,685. 8.95 has two decimal places, so the answer gets two too: 26.85 kr.",
   `ثلاث علب عصير سعر الواحدة 8.95 كرونة. التقدير: ${LRI("3 × 9 = 27")} كرونة. نحسب دون فاصلة: ${LRI("3 × 895 = 2685")}. في 8.95 منزلتان عشريتان، إذن في الناتج منزلتان أيضًا: 26.85 كرونة.`),
  draw:()=>{const M=MUL();return[A.wipe(),...[0,1,2].flatMap(i=>{const x=MX(120+i*95);return[A.p(R.rect(x-30,62,60,100,.3)+ellP(x,62,30,9)+R.line(x-30,140,x+30,140,.2),"r",3.5),qx("8,95".replace(",",SEP()),x,116,24,"r")]}),
   A.p(`M${MX(440)},84L${MX(640)},84L${MX(690)},112L${MX(640)},140L${MX(440)},140Z`,"o",4),A.tx(`${dnum(895,2)} kr`,MX(540),126,44,"o"),A.tx(`${M} 3`,MX(540),196,40,"o"),
   ...lab2(L(t3("Överslag:","Estimate:","التقدير:")),`3 ${M} 9 = 27`,262,36,"o"),...lab2(L(t3("Utan komma:","Without the point:","دون فاصلة:")),`3 ${M} 895 = ${fmt(2685)}`,326,36,"b"),
   A.tx(L(t3("8,95 har två decimaler, så även svaret","8.95 has two decimal places, so the answer does too","في 8.95 منزلتان عشريتان، وكذلك في الناتج")),400,382,28,"r"),
   A.hl(220,418,360,62),A.tx(`3 ${M} ${dnum(895,2)} = ${dnum(2685,2)} kr`,400,462,46,"g")]}},
 {say:t3("Äpplen kostar 24 kr per kilo och du köper 1,5 kg. 1 kg kostar 24 kr och 0,5 kg är hälften, 12 kr. Tillsammans blir det 24 + 12 = 36 kr.",
   "Apples cost 24 kr per kilo and you buy 1.5 kg. 1 kg costs 24 kr and 0.5 kg is half of that, 12 kr. Together that is 24 + 12 = 36 kr.",
   `التفاح بـ 24 كرونة للكيلوغرام، وتشتري 1.5 كغ. الكيلوغرام بـ 24 كرونة، و0.5 كغ نصفه أي 12 كرونة. المجموع ${LRI("24 + 12 = 36")} كرونة.`),
  draw:()=>{const M=MUL(),x0=120,y=150;return[A.wipe(),A.tx(L(t3("Äpplen: 24 kr per kg. Du köper 1,5 kg.","Apples: 24 kr per kg. You buy 1.5 kg.","التفاح: 24 كرونة للكيلوغرام. تشتري 1.5 كغ.")),400,62,36),
   A.p(R.rect(x0,y,400,64,.3),"k",4),A.band(x0,y,400,64,"b"),A.p(R.rect(x0+400,y,200,64,.3),"k",4),A.band(x0+400,y,200,64,"o"),
   qx("1 kg",x0+200,y-14,30,"b"),qx(`${dfmt(.5)} kg`,x0+500,y-14,30,"o"),A.tx("24 kr",x0+200,y+44,36,"b"),A.tx("12 kr",x0+500,y+44,36,"o"),
   A.p(`M${x0},${y+84}q0,14 14,14h272q14,0 14,14q0,-14 14,-14h272q14,0 14,-14`,"k",3),qx(`${dfmt(1.5)} kg`,x0+300,y+144,30),
   A.tx(`24 ${M} 1 = 24`,x0+200,350,36,"b"),A.tx(`24 ${M} ${dfmt(.5)} = 12`,x0+500,350,36,"o"),qx(L(t3("hälften","half","النصف")),x0+500,392,28,"o"),
   A.hl(220,420,360,60),A.tx(`24 ${M} ${dfmt(1.5)} = 36 kr`,400,462,46,"g")]}},
 {say:t3("Fyra kompisar delar lika på notan 86,40 kr. Dela siffra för siffra som vanligt och sätt kommat i svaret rakt ovanför kommat. Var och en betalar 21,60 kr.",
   "Four friends split a bill of 86.40 kr equally. Divide digit by digit as usual and put the decimal point in the answer straight above the decimal point. Each person pays 21.60 kr.",
   "يتقاسم أربعة أصدقاء فاتورة قيمتها 86.40 كرونة بالتساوي. نقسم رقمًا رقمًا كالمعتاد، ونضع الفاصلة في الناتج فوق الفاصلة تمامًا. يدفع كل واحد 21.60 كرونة."),
  draw:()=>{const K=kdiv(864,1,4,250,200,300,66),D=DIVS(),notes=[`8 ${D} 4 = 2`,`6 ${D} 4 = 1`,`24 ${D} 4 = 6`];
   return[A.wipe(),A.tx(L(t3("Fyra kompisar delar på 86,40 kr","Four friends share 86.40 kr","أربعة أصدقاء يتقاسمون 86.40 كرونة")),400,58,36,"b"),...K.set,...K.steps.flatMap(s=>s.a),
    A.loop((K.first+K.last)/2,178,(K.last-K.first)/2+48,46,"g"),...notes.map((s,i)=>A.tx(s,600,160+i*62,32,i===1?"r":"k")),
    qx(L(t3("rest 2","remainder 2","الباقي 2")),600,246,24,"r"),
    A.tx(L(t3("Kommat rakt ovanför kommat!","Point straight above the point!","الفاصلة فوق الفاصلة تمامًا!")),400,384,30,"r"),
    A.hl(170,422,460,60),A.tx(`${dnum(8640,2)} kr ${D} 4 = ${dnum(2160,2)} kr`,400,464,44,"g")]}}
]};
LESSONS.push({id:"decmd6",subject:"math",grades:"6",kind:"wb",
 title:t3("Multiplikation och division med decimaltal","Multiplying and dividing decimals","ضرب الأعداد العشرية وقسمتها"),
 icon:ICO(`<text x="160" y="62" ${CV} font-size="46" fill="#1d2433">3,45 · 10</text><path d="M160 76V108M160 108l-10 -12M160 108l10 -12" stroke="#2257c9" stroke-width="3.5" stroke-linecap="round" fill="none"/><text x="160" y="160" ${CV} font-size="54" fill="#1e9e5a">34,5</text><path d="M206 40l-20 16" stroke="#fff" stroke-width="0"/>`),
 steps:DEC.steps,mount:wbMount(DEC),
 gen(level){const M=MUL(),D=DIVS();
  if(level===0){let v,r,k,mul;do{let sig;do{sig=rint(11,999)}while(sig%10===0);v=sig*10**rint(0,3);k=rint(1,3);mul=Math.random()<.5;r=mul?v*10**k:v/10**k}
    while(!Number.isInteger(r)||r>=1000000||v>=1000000||r<1||(v%100===0&&r%100===0));
   const f=`${tnum(v,2)} ${mul?M:D} ${fmt(10**k)}`,ex=`${f} = ${tnum(r,2)}`;
   const q=[A.wipe(),A.tx(`${f} = ?`,400,56,50),...pvChart(84,300)];
   const keep=pvRow(v,200,56).cols.map(c=>c-(mul?k:-k)),R1=pvRow(r,310,56,"k",keep),S0=pvRow(v,200,56,"b");
   const sol=[...S0.o,A.arrow(640,186,640,280,"b",-26),qx(`${mul?M:D} ${fmt(10**k)}`,712,240,30,"b"),mark(A.tx(L(mul?t3(`${k} steg åt vänster`,`${k} ${k>1?"places":"place"} left`,k===1?"منزلة واحدة يسارًا":k===2?"منزلتان يسارًا":"3 منازل يسارًا"):t3(`${k} steg åt höger`,`${k} ${k>1?"places":"place"} right`,k===1?"منزلة واحدة يمينًا":k===2?"منزلتان يمينًا":"3 منازل يمينًا")),712,150,26,"r"),"h"),
    ...S0.cols.filter(c=>c+(mul?-k:k)<=5).map(c=>A.arrow(PX(c),214,PX(c+(mul?-k:k)),266,"#9aa8c4")),...R1.o,A.hl(400-tw(ex,48)/2-20,418,tw(ex,48)+40,62),A.tx(ex,400,462,48,"g")];
   return{kind:"num",dec:true,ans:r/100,show:tnum(r,2),q,sol}}
  if(level===1){const money=Math.random()<.6;let n,p,d,ctx,unit,ask;
   if(money){n=rint(2,9);p=rint(2,29)*100+pick([50,90,95,25,75,45,20]);d=2;ctx=pick(DCTX.money);unit="kr";ask=t3("Vad kostar det tillsammans?","How much is that altogether?","كم الثمن الإجمالي؟")}
   else{n=rint(3,9);do{p=rint(3,45)}while(p%10===0);d=1;const c=pick(DCTX.other);ctx=c;unit=c[2]==="l"?LU():c[2];ask=c[3]}
   const P=dnum(p,d),tot=p*n,est=money?Math.round(p/100):Math.max(1,Math.round(p/10)),exact=money?dnum(tot,2):tnum(tot,1);
   const q=[A.wipe(),A.tx(`${L(ctx[0](n))}${lang==="ar"?"،":","} ${L(ctx[1](P))}.`,400,64,36),A.tx(L(ask),400,118,34,"b"),A.tx(`${n} ${M} ${P} = ?`,400,206,62)];
   const sol=[...lab2(L(t3("Överslag:","Estimate:","التقدير:")),`${n} ${M} ${est} = ${n*est}`,282,34,"o"),...lab2(L(t3("Utan komma:","Without the point:","دون فاصلة:")),`${n} ${M} ${p} = ${fmt(tot)}`,340,34,"b"),
    A.tx(L(d===2?t3(`${P} har två decimaler, så även svaret`,`${P} has two decimal places, so the answer does too`,`في ${P} منزلتان عشريتان، وكذلك في الناتج`):t3(`${P} har en decimal, så även svaret`,`${P} has one decimal place, so the answer does too`,`في ${P} منزلة عشرية واحدة، وكذلك في الناتج`)),400,392,28,"r"),
    A.hl(400-tw(`${n} ${M} ${P} = ${exact} ${unit}`,48)/2-20,420,tw(`${n} ${M} ${P} = ${exact} ${unit}`,48)+40,62),A.tx(`${n} ${M} ${P} = ${exact} ${unit}`,400,464,48,"g")];
   return{kind:"num",dec:true,ans:tot/10**d,show:`${exact} ${unit}`,hc:2,q,sol}}
  const kind=pick(["money","money","plank","juice"]);let n,qv,d;
  do{n=rint(2,6);d=kind==="money"?2:1;qv=kind==="money"?rint(25,499)*10+pick([0,0,5]):rint(12,250)}while(qv%10===0&&d===1||(d===1&&qv*n%10===0)||qv*n>=(d===2?100000:10000)||String(qv*n).length>(d===2?5:4));
  const T=qv*n,TS=dnum(T,d),QS=dnum(qv,d),unit=kind==="money"?"kr":kind==="plank"?"m":LU();
  const ctx=kind==="money"?[t3(`${n} kompisar delar lika på notan ${TS} kr.`,`${n} friends split a bill of ${TS} kr equally.`,`عدد الأصدقاء ${n}، ويتقاسمون فاتورة قيمتها ${TS} كرونة بالتساوي.`),t3("Hur mycket betalar var och en?","How much does each person pay?","كم يدفع كل واحد؟")]
   :kind==="plank"?[t3(`En ${TS} m lång bräda sågas i ${n} lika långa bitar.`,`A ${TS} m plank is sawn into ${n} equal pieces.`,`لوح طوله ${TS} م يُقطع إلى قطع متساوية عددها ${n}.`),t3("Hur lång blir varje bit?","How long is each piece?","ما طول كل قطعة؟")]
   :[t3(`${TS} liter saft hälls lika i ${n} kannor.`,`${TS} litres of juice are poured equally into ${n} jugs.`,`يُوزَّع ${TS} لتر من العصير بالتساوي على أباريق عددها ${n}.`),t3("Hur mycket blir det i varje kanna?","How much goes into each jug?","كم لترًا في كل إبريق؟")];
  const K=kdiv(T,d,n,400,270,350,62),ex=`${TS} ${D} ${n} = ${QS} ${unit}`;
  const q=[A.wipe(),A.tx(L(ctx[0]),400,64,34),A.tx(L(ctx[1]),400,118,34,"b"),A.tx(`${TS} ${D} ${n} = ?`,400,192,54)];
  return{kind:"num",dec:true,ans:qv/10**d,show:`${QS} ${unit}`,hc:K.set.length,q,
   sol:[...K.set,...K.steps.flatMap(s=>s.a),A.loop((K.first+K.last)/2,248,(K.last-K.first)/2+46,44,"g"),A.hl(400-tw(ex,46)/2-20,420,tw(ex,46)+40,62),A.tx(ex,400,464,46,"g")]}}
});

/* ---------------------------------------------------------------
   simpler explanations (HELP) and hints per level (HINTS)
   --------------------------------------------------------------- */
Object.assign(HELPX,{
 prime6:[{say:t3("Tänk på en äggkartong. 12 ägg kan ligga 2 · 6 eller 3 · 4. Men 7 ägg får bara plats på en enda rad, därför är 7 ett primtal.",
   "Think of an egg box. 12 eggs can lie 2 × 6 or 3 × 4. But 7 eggs only fit in one single row, which is why 7 is a prime number.",
   `فكّر في علبة بيض. يمكن ترتيب 12 بيضة ${LRI("2 × 6")} أو ${LRI("3 × 4")}. أما 7 بيضات فلا تُرتَّب إلا في صف واحد، لذلك 7 عدد أولي.`),
  draw:()=>{const eggs=(x0,y0,r,c,g)=>{let d="";for(let i=0;i<r;i++)for(let j=0;j<c;j++)d+=ellP(x0+j*g,y0+i*g,15,19);return d};
   return[A.p(R.rect(60,50,300,150,.3),"k",4),A.p(eggs(90,100,2,6,48),"o",3.5),qx(`2 ${MUL()} 6`,210,240,36,"b"),
    A.p(R.rect(470,50,230,150,.3),"k",4),A.p(eggs(513,77,3,4,48),"o",3.5),qx(`3 ${MUL()} 4`,585,240,36,"b"),
    A.p(R.rect(110,280,580,70,.3),"k",4),A.p(eggs(150,315,1,7,83),"o",3.5),qx(L(t3("7 ägg: bara en rad","7 eggs: only one row","7 بيضات: صف واحد فقط")),400,392,32,"r"),
    A.hl(240,414,320,62),A.tx(L(t3("7 är ett primtal","7 is a prime number","7 عدد أولي")),400,458,42,"g")]}}],
 order6:[{say:t3("Två glassar för 15 kr styck och en dricka för 10 kr: 10 + 2 · 15. Först räknar du vad glassarna kostar, 2 · 15 = 30. Sedan lägger du till drickan: 40 kr.",
   "Two ice creams at 15 kr each and a drink for 10 kr: 10 + 2 × 15. First work out what the ice creams cost, 2 × 15 = 30. Then add the drink: 40 kr.",
   `بوظتان سعر الواحدة 15 كرونة ومشروب بـ 10 كرونات: ${LRI("10 + 2 × 15")}. احسب أولًا ثمن البوظتين: ${LRI("2 × 15 = 30")}، ثم أضف المشروب: 40 كرونة.`),
  draw:()=>{const W=oWork([10,"+",2,"*",15],400,292,54,80,"kr"),cone=x=>A.p(`M${x-24},86L${x+24},86L${x},166Z`+R.circ(x,66,26),"o",3.5);
   return[cone(MX(170)),cone(MX(270)),qx("15 kr",MX(220),206,30,"o"),A.p(R.rect(MX(500)-28,56,56,110,.3)+ellP(MX(500),56,28,9),"b",3.5),qx("10 kr",MX(500),206,30,"b"),
    A.tx(L(t3("glassarna först","ice creams first","البوظة أولًا")),MX(660),120,30,"r"),...W.first,...W.steps.flat()]}}],
 negcalc6:[{say:t3("Du är skyldig 30 kr och får 50 kr. 30 kr går till att betala skulden, och 20 kr blir kvar: −30 + 50 = 20.",
   "You owe 30 kr and get 50 kr. 30 kr goes to paying off the debt, and 20 kr is left: −30 + 50 = 20.",
   `عليك دَين قدره 30 كرونة، وتحصل على 50 كرونة. تدفع 30 كرونة لتسديد الدَّين، ويبقى 20 كرونة: ${LRI("−30 + 50 = 20")}.`),
  draw:()=>{const X=i=>MX(300+i*80);return[qx(L(t3("du får 50 kr","you get 50 kr","تحصل على 50 كرونة")),MX(140),118,28,"r"),qx(L(t3("skuld 30 kr","debt 30 kr","دَين 30 كرونة")),MX(140),258,28,"b"),
   ...[0,1,2,3,4].flatMap(i=>coin(X(i),110)),...[0,1,2].flatMap(i=>[A.p(R.rect(X(i)-28,230,56,40,.3),"b",3.5),qx("−10",X(i),259,24,"b")]),
   ...[0,1,2].flatMap(i=>[A.loop(X(i),185,34,112,"k"),qx("0",X(i),334,28)]),A.loop((X(3)+X(4))/2,110,74,40,"g"),qx(L(t3("20 kr kvar","20 kr left","يبقى 20 كرونة")),(X(3)+X(4))/2,196,28,"g"),
   A.hl(240,404,320,64),A.tx("−30 + 50 = 20",400,450,50,"g")]}}],
 decmd6:[{say:t3("Tio mynt på 50 öre är 5 kronor. 0,50 · 10 = 5,00: femman flyttar ett steg åt vänster, från tiondelar till ental.",
   "Ten 50-öre coins make 5 kronor. 0.50 × 10 = 5.00: the 5 moves one place to the left, from tenths to ones.",
   `عشر قطع نقدية من فئة 50 أوره تساوي 5 كرونات. ${LRI("0.50 × 10 = 5.00")}: ينتقل الرقم 5 منزلة واحدة إلى اليسار، من الأعشار إلى الآحاد.`),
  draw:()=>{const C=[];for(let r=0;r<2;r++)for(let c=0;c<5;c++)C.push([MX(90+c*66),110+r*78]);
   return[A.p(C.map(([x,y])=>R.circ(x,y,30)).join(""),"o",3.5),...C.map(([x,y])=>qx(dfmt(.5,2),x,y+8,22,"o")),A.arrow(MX(430),150,MX(530),150,"k"),
    A.p(R.circ(MX(640),150,64),"g",4.5),A.tx("5 kr",MX(640),164,44,"g"),A.tx(L(t3("Siffrorna flyttar ett steg åt vänster","The digits move one place to the left","تنتقل الأرقام منزلة واحدة إلى اليسار")),400,330,32,"b"),
    A.hl(220,394,360,64),A.tx(`${dfmt(.5,2)} ${MUL()} 10 = ${dfmt(5,2)} kr`,400,440,48,"g")]}},
  {say:t3("3 · 2,50 kr: räkna kronor och ören var för sig. 3 · 2 = 6 kr och 3 · 0,50 = 1,50 kr. Tillsammans 7,50 kr.",
   "3 × 2.50 kr: count kronor and öre separately. 3 × 2 = 6 kr and 3 × 0.50 = 1.50 kr. Together 7.50 kr.",
   `${LRI("3 × 2.50")} كرونة: احسب الكرونات والأوره كلًّا على حدة. ${LRI("3 × 2 = 6")} كرونات و${LRI("3 × 0.50 = 1.50")} كرونة. المجموع 7.50 كرونة.`),
  draw:()=>{const M=MUL();return[...[180,400,620].flatMap(x=>[A.p(R.circ(x-34,110,34),"b",3.5),qx("2 kr",x-34,118,24,"b"),A.p(R.circ(x+38,116,28),"o",3.5),qx(dfmt(.5,2),x+38,124,22,"o"),A.loop(x,113,92,56,"k")]),
   A.tx(`3 ${M} 2 = 6 kr`,400,240,40,"b"),A.tx(`3 ${M} ${dfmt(.5,2)} = ${dfmt(1.5,2)} kr`,400,304,40,"o"),A.tx(`6 + ${dfmt(1.5,2)} = ${dfmt(7.5,2)} kr`,400,366,40),
   A.hl(220,404,360,64),A.tx(`3 ${M} ${dfmt(2.5,2)} = ${dfmt(7.5,2)} kr`,400,450,48,"g")]}}]
});
Object.assign(HINTSX,{
 prime6:[{say:t3("Titta på sista siffran. För 3: lägg ihop siffrorna och se om summan är delbar med 3.","Look at the last digit. For 3: add up the digits and see if the sum is divisible by 3.","انظر إلى الرقم الأخير. وللقسمة على 3: اجمع الأرقام وانظر هل يقبل المجموع القسمة على 3."),cut:g=>g.sol.slice(0,g.hc)},
  {say:t3("Leta efter två tal som multiplicerade ger talet. Testa 1, 2, 3, 4 … Delarna kommer i par.","Look for two numbers that multiply to give the number. Try 1, 2, 3, 4 … Divisors come in pairs.","ابحث عن عددين حاصل ضربهما هو العدد. جرّب 1، 2، 3، 4 … القواسم تأتي أزواجًا."),cut:g=>g.sol.slice(0,Math.min(g.hc,g.sol.length-1))},
  {say:t3("Dela upp talet i två faktorer. Fortsätt dela tills alla grenar slutar med ett primtal.","Split the number into two factors. Keep splitting until every branch ends in a prime.","حلّل العدد إلى عاملين، واستمر حتى ينتهي كل فرع بعدد أولي."),cut:g=>g.sol.slice(0,g.hc)}],
 order6:[{say:t3("Gånger och delat räknar du före plus och minus.","Do times and divide before plus and minus.","احسب الضرب والقسمة قبل الجمع والطرح."),cut:g=>g.sol.slice(0,g.hc)},
  {say:t3("Börja med det som står inom parentes.","Start with what is inside the brackets.","ابدأ بما بين القوسين."),cut:g=>g.sol.slice(0,g.hc)},
  {say:t3("Parenteser först, sedan gånger och delat, sist plus och minus. Ett steg i taget!","Brackets first, then times and divide, plus and minus last. One step at a time!","الأقواس أولًا، ثم الضرب والقسمة، ثم الجمع والطرح. خطوة خطوة!"),cut:g=>g.sol.slice(0,g.hc)}],
 negcalc6:[{say:t3("Börja på första talet. Plus: gå åt höger. Minus: gå åt vänster.","Start at the first number. Plus: go right. Minus: go left.","ابدأ من العدد الأول. الجمع: تحرّك إلى اليمين. الطرح: تحرّك إلى اليسار."),cut:g=>g.sol.slice(0,g.hk)},
  {say:t3("Två tecken bredvid varandra: + (−) blir −, och − (−) blir +.","Two signs side by side: + (−) becomes −, and − (−) becomes +.",`إشارتان متجاورتان: ${LRI("+ (−)")} تصبح ${LRI("−")}، و${LRI("− (−)")} تصبح ${LRI("+")}.`),cut:g=>g.sol.slice(0,g.hk)},
  {say:t3("Skriv först om dubbla tecken. Räkna sedan från vänster till höger.","First rewrite the double signs. Then work from left to right.","أعد كتابة الإشارات المزدوجة أولًا، ثم احسب من اليسار إلى اليمين."),cut:g=>g.sol.slice(0,g.hk)}],
 decmd6:[{say:t3("Gånger 10, 100 eller 1000: siffrorna flyttar 1, 2 eller 3 steg åt vänster. Delat med: lika många steg åt höger.","Times 10, 100 or 1000: the digits move 1, 2 or 3 places left. Divided by: the same number of places right.","عند الضرب في 10 أو 100 أو 1000 تنتقل الأرقام 1 أو 2 أو 3 منازل إلى اليسار، وعند القسمة تنتقل العدد نفسه من المنازل إلى اليمين."),cut:upTo("h")},
  {say:t3("Gör ett överslag. Räkna sedan utan komma och sätt tillbaka lika många decimaler.","Make an estimate. Then work without the decimal point and put back the same number of decimal places.","قدّر الناتج أولًا، ثم احسب دون فاصلة، وأعد العدد نفسه من المنازل العشرية."),cut:g=>g.sol.slice(0,g.hc)},
  {say:t3("Dela siffra för siffra från vänster. Kommat i svaret hamnar rakt ovanför kommat.","Divide digit by digit from the left. The point in the answer goes straight above the point.","اقسم رقمًا رقمًا من اليسار، وضع الفاصلة في الناتج فوق الفاصلة تمامًا."),cut:g=>g.sol.slice(0,g.hc)}]
});
}
