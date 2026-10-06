/* ===== y8b.js ===== */
/* =====================================================================
   YEAR 8 (y8b): pct8 change factor and percentage points, interest8 interest,
   loans and saving, paren8 expanding and factorising, eq8 equations with
   brackets and fractions
   ===================================================================== */
{
/* ---------- shared helpers ---------- */
const LRI=s=>"⁦"+s+"⁩";                 /* keeps a formula left-to-right inside Arabic speech */
const T3=(a,b,c)=>L(t3(a,b,c));
const pc=n=>lang==="sv"?`${n} %`:`${n}%`;
const isAr=s=>/[؀-ۿ]/.test(s);
/* text width of the board's Caveat font, measured per character (fraction of the font size) */
const CW={" ":.24,",":.24,".":.24,":":.24,"·":.23,"(":.37,")":.37,"/":.37,"%":.64,"x":.34,"≈":.59,"²":.36,"³":.36,"✓":.55,"!":.22,"?":.4,"−":.49,"+":.49,"=":.49,"×":.49,"÷":.49,"→":.6,"<":.49,">":.49,"≠":.49};
const tw=(s,z)=>{let w=0;for(const ch of String(s))w+=CW[ch]??(/\d/.test(ch)?.49:/[\u064B-\u0652\u0670]/.test(ch)?0:isAr(ch)?.32:/[A-ZÅÄÖ]/.test(ch)?.5:.38);return w*z};
const rp=(x,y,w,h)=>`M${f1(x)},${f1(y)}h${f1(w)}v${f1(h)}h${f1(-w)}Z`;
const ell=(cx,cy,rx,ry)=>{let d="";for(let i=0;i<=72;i++){const t=i/72*Math.PI*2,k=1+jit(i,cx)*.012;d+=(i?"L":"M")+f1(cx+Math.cos(t)*rx*k)+","+f1(cy+Math.sin(t)*ry*k)}return d};
const fast=(a,len)=>Object.assign(a,{dur:Math.max(220,(len||a.s.length)*95)});
/* texts in reading order, centred on cx; Arabic reads right to left, so the order is mirrored */
const seq=(items,cx,y,z)=>{const g=z*.32,ws=items.map(it=>tw(it[0],z)),tot=ws.reduce((a,b)=>a+b,0)+g*(items.length-1),rtl=lang==="ar";let x=rtl?cx+tot/2:cx-tot/2;
 return items.map((it,i)=>{const c=rtl?x-ws[i]/2:x+ws[i]/2;x+=rtl?-(ws[i]+g):ws[i]+g;return A.tx(it[0],c,y,z,it[1]||"k")})};
/* maths tokens side by side (always left to right), centred on cx; .xs are the centres */
const toks=(list,cx,y,z)=>{const ws=list.map(t=>tw(t[0],z)),tot=ws.reduce((a,b)=>a+b,0);let x=cx-tot/2;const xs=[];
 const o=list.map((t,i)=>{const c=x+ws[i]/2;xs.push(c);x+=ws[i];return fast(A.tx(t[0].trim(),c,y,z,t[1]||"k"),t[0].trim().length+1)});o.xs=xs;o.ws=ws;return o};
/* an equation row lined up on its "=" sign at X */
const eqn=(l,r,y,z=50,c="k",X=400)=>[A.tx(l,X-z*.4,y,z,c,"end"),A.tx("=",X,y,z,c),A.tx(r,X+z*.4,y,z,c,"start")];
/* the operation done to both sides, written to the right after a bar */
const ann=(s,y,x=640,z=38)=>[A.p(R.line(x-16,y-z*.95,x-16,y+z*.2,.2),"r",3),A.tx(s,x,y,z,"r","lead")];
/* a row of fractions and texts, centred on cx; y is the fraction line */
const fW=(n,d,z)=>Math.max(String(n).length,String(d).length)*z*.42+z*.3;
const frow=(items,cx,y,z)=>{const g=z*.25,ws=items.map(it=>it[0]==="f"?fW(it[1],it[2],z):tw(it[1],z)),tot=ws.reduce((a,b)=>a+b,0)+g*(items.length-1);let x=cx-tot/2;const out=[];
 items.forEach((it,i)=>{const c=x+ws[i]/2;x+=ws[i]+g;if(it[0]==="f")out.push(...A.frac(it[1],it[2],c,y,z,it[3]||"k"));else out.push(A.tx(it[1],c,y+z*.36,z,it[2]||"k"))});return out};
const T1=(k,v)=>k===1?v:`${k}${v}`;                 /* 1x is written x */
const sgn=n=>n<0?"−":"+";
const ng=n=>n<0?"−"+(-n):String(n);
const ICO=b=>`<svg viewBox="0 0 320 180"><rect width="320" height="180" fill="#fff"/>${b}</svg>`;
const CV=`font-family="Caveat,cursive" font-weight="700" text-anchor="middle" direction="ltr"`;

/* ---------- small pictures ---------- */
const headset=(cx,cy)=>`M${cx-46},${cy+18}C${cx-52},${cy-64} ${cx+52},${cy-64} ${cx+46},${cy+18}`+R.rect(cx-60,cy+6,26,46,.3)+R.rect(cx+34,cy+6,26,46,.3);
const tagP=(x,y,w,h)=>`M${x},${y}h${w-h/2}l${h/2},${h/2}l${-h/2},${h/2}h${-(w-h/2)}Z`+R.circ(x+w-h/2+h*.14,y+h/2,7);
const phone=(x,y,w,h)=>R.rect(x,y,w,h,.3)+R.line(x+w*.36,y+16,x+w*.64,y+16,.2)+R.circ(x+w/2,y+h-18,7);
const piggy=(cx,cy,s=1)=>ell(cx,cy,100*s,72*s)+ell(cx+104*s,cy-6*s,15*s,22*s)+`M${f1(cx+99*s)},${f1(cy-12*s)}l.1,0M${f1(cx+109*s)},${f1(cy-2*s)}l.1,0`
 +`M${f1(cx+34*s)},${f1(cy-62*s)}L${f1(cx+52*s)},${f1(cy-96*s)}L${f1(cx+68*s)},${f1(cy-56*s)}`+`M${f1(cx+66*s)},${f1(cy-26*s)}l.1,0`
 +[-60,-25,25,58].map(d=>R.line(cx+d*s,cy+62*s,cx+d*s,cy+92*s,.2)).join("")+`M${f1(cx-98*s)},${f1(cy-10*s)}q${f1(-26*s)},${f1(-6*s)} ${f1(-18*s)},${f1(-28*s)}`
 +R.line(cx-28*s,cy-60*s,cx+12*s,cy-60*s,.2);
const bank=(cx,cy,s=1)=>`M${f1(cx-92*s)},${f1(cy-46*s)}L${f1(cx)},${f1(cy-100*s)}L${f1(cx+92*s)},${f1(cy-46*s)}Z`+R.rect(cx-86*s,cy-46*s,172*s,14*s,.2)
 +[-60,-20,20,60].map(d=>R.line(cx+(d-9)*s,cy-30*s,cx+(d-9)*s,cy+52*s,.2)+R.line(cx+(d+9)*s,cy-30*s,cx+(d+9)*s,cy+52*s,.2)).join("")+R.rect(cx-100*s,cy+52*s,200*s,14*s,.2);
const card=(cx,cy,s=1)=>R.rect(cx-82*s,cy-52*s,164*s,104*s,.3)+R.line(cx-82*s,cy-22*s,cx+82*s,cy-22*s,.2)+R.rect(cx-62*s,cy+2*s,30*s,22*s,.2)+R.line(cx+10*s,cy+30*s,cx+62*s,cy+30*s,.2);
const person=(cx,cy,s=1)=>R.circ(cx,cy-38*s,17*s)+R.line(cx,cy-21*s,cx,cy+22*s,.2)+R.line(cx,cy+22*s,cx-16*s,cy+56*s,.2)+R.line(cx,cy+22*s,cx+16*s,cy+56*s,.2)+R.line(cx-24*s,cy-4*s,cx+24*s,cy-4*s,.2);
const moped=(x,y)=>R.circ(x,y,36)+R.circ(x+210,y,36)+`M${x-46},${y-24}Q${x-44},${y-78} ${x+10},${y-80}L${x+92},${y-80}Q${x+102},${y-40} ${x+72},${y-14}L${x+170},${y-14}`
 +R.rect(x-30,y-100,108,18,.3)+R.line(x+170,y-14,x+196,y-128,.3)+R.line(x+196,y-128,x+210,y-2,.3)+R.line(x+178,y-132,x+228,y-128,.3)+R.circ(x+206,y-108,9);
const ticket=(cx,cy,w=150,h=70)=>R.rect(cx-w/2,cy-h/2,w,h,.3)+R.dashed(cx+w/2-26,cy-h/2+4,cx+w/2-26,cy+h/2-4,8);
const popcorn=(cx,cy)=>`M${cx-30},${cy-30}L${cx+30},${cy-30}L${cx+21},${cy+34}L${cx-21},${cy+34}Z`+R.circ(cx-18,cy-38,11)+R.circ(cx,cy-44,12)+R.circ(cx+18,cy-38,11);

/* =====================================================================
   1. pct8: change factor, sales and increases, percentage points
   ===================================================================== */
const IT8=[{n:t3("hörlurarna","the headphones","سماعات الرأس"),lo:400,hi:2000},{n:t3("tv-spelet","the video game","لعبة الفيديو"),lo:300,hi:800},
 {n:t3("jackan","the jacket","السترة"),lo:600,hi:2400},{n:t3("cykeln","the bike","الدراجة"),lo:2000,hi:8000},{n:t3("gymkortet","the gym card","اشتراك النادي الرياضي"),lo:300,hi:700},
 {n:t3("mobilen","the phone","الهاتف"),lo:2000,hi:9000},{n:t3("konsertbiljetten","the concert ticket","تذكرة الحفلة"),lo:400,hi:1200}];
const CX8=[{n:t3("Räntan på sparkontot","The interest rate on the savings account","سعر الفائدة على حساب التوفير"),as:[2,4,5],dm:3},
 {n:t3("Andelen elever som cyklar till skolan","The share of students who cycle to school","نسبة الطلاب الذين يذهبون إلى المدرسة بالدراجة"),as:[10,20,25,40,50],dm:30},
 {n:t3("Andelen elever som spelar e-sport","The share of students who play esports","نسبة الطلاب الذين يلعبون الرياضات الإلكترونية"),as:[10,20,25,40,50],dm:30},
 {n:t3("Stödet för ett parti","The support for a political party","نسبة التأييد لحزب سياسي"),as:[4,5,10,20,25],dm:10}];
const PCT8={steps:[
 {say:t3("Ett gaming-headset kostar 800 kr. Priset höjs med 15 %. Det nya priset är 100 % + 15 % = 115 % av det gamla priset.",
   "A gaming headset costs 800 kr. The price goes up by 15%. The new price is 100% + 15% = 115% of the old price.",
   `سعر سماعة ألعاب 800 كرونة. يرتفع السعر بنسبة 15%. السعر الجديد هو ${LRI("100% + 15% = 115%")} من السعر القديم.`),
  draw:()=>{const W=440,x0=400-W*1.15/2;return[A.wipe(),A.p(headset(130,84),"k",4.5),A.tx("800 kr",320,112,56),A.tx(`+${pc(15)}`,560,112,56,"r"),
   A.p(R.rect(x0,200,W,70,.3),"k",4),A.hatch(rp(x0,200,W,70),"b"),A.p(R.rect(x0+W,200,W*.15,70,.3),"k",4),A.hatch(rp(x0+W,200,W*.15,70),"r"),
   qt(pc(100),x0+W/2,186,32,"b"),qt(`+${pc(15)}`,x0+W*1.075,186,28,"r"),
   A.p(R.line(x0,296,x0+W*1.15,296,.3)+R.line(x0,284,x0,308,.2)+R.line(x0+W*1.15,284,x0+W*1.15,308,.2),"k",3),A.tx(pc(115),400,342,42)]}},
 {say:t3("115 % skrivet som decimaltal är 1,15. Det kallas förändringsfaktorn. Det nya priset är 800 · 1,15 = 920 kr.",
   "115% written as a decimal is 1.15. This is called the change factor. The new price is 800 × 1.15 = 920 kr.",
   `115% بصورة عدد عشري هي 1.15، ويسمى هذا معامل التغيّر. السعر الجديد ${LRI("800 × 1.15 = 920")} كرونة.`),
  draw:()=>[A.tx(`${pc(115)} = ${dfmt(1.15,2)}`,280,400,44,"b"),A.tx(T3("förändringsfaktor","change factor","معامل التغيّر"),570,400,34,"b"),
   A.hl(200,418,400,64),A.tx(`800 ${MUL()} ${dfmt(1.15,2)} = 920 kr`,400,466,48,"g")]},
 {say:t3("Sneakers för 1 200 kr säljs på rea med 30 %. Då är 70 % av priset kvar. Förändringsfaktorn är 0,70, och det nya priset blir 1 200 · 0,70 = 840 kr.",
   "Sneakers that cost 1,200 kr are 30% off. Then 70% of the price is left. The change factor is 0.70, and the new price is 1,200 × 0.70 = 840 kr.",
   `حذاء رياضي سعره 1200 كرونة عليه تخفيض 30%. يبقى 70% من السعر، فمعامل التغيّر 0.70، والسعر الجديد ${LRI("1200 × 0.70 = 840")} كرونة.`),
  draw:()=>{const x0=120,W=560;return[A.wipe(),A.p(tagP(70,34,270,96),"k",4.5),A.tx(`${fmt(1200)} kr`,192,98,50),
   A.p(R.circ(580,82,60),"r",4.5),A.tx(T3("REA","SALE","تخفيض"),580,72,30,"r"),A.tx(`−${pc(30)}`,580,110,36,"r"),
   A.p(R.rect(x0,200,W,66,.3)+R.line(x0+W*.7,200,x0+W*.7,266,.3),"k",4),A.hatch(rp(x0,200,W*.7,66),"g"),A.hatch(rp(x0+W*.7,200,W*.3,66),"r"),
   A.p(R.line(x0+W*.7+12,210,x0+W-12,256,.3)+R.line(x0+W*.7+12,256,x0+W-12,210,.3),"r",4),
   qt(pc(70),x0+W*.35,188,32,"g"),qt(`−${pc(30)}`,x0+W*.85,188,32,"r"),
   A.tx(T3("kvar","left","المتبقي"),x0+W*.35,306,32,"g"),A.tx(T3("rabatt","discount","الخصم"),x0+W*.85,306,32,"r"),
   A.tx(`${pc(100)} − ${pc(30)} = ${pc(70)} = ${dfmt(.7,2)}`,400,370,42,"b"),A.hl(190,398,420,68),A.tx(`${fmt(1200)} ${MUL()} ${dfmt(.7,2)} = 840 kr`,400,448,48,"g")]}},
 {say:t3("En ökning ger en faktor större än 1, en minskning en faktor mindre än 1. Se upp: plus 5 % blir 1,05, inte 1,5!",
   "An increase gives a factor greater than 1, a decrease gives a factor less than 1. Watch out: plus 5% is 1.05, not 1.5!",
   "الزيادة تعطي معاملًا أكبر من 1، والنقصان يعطي معاملًا أصغر من 1. انتبه: زيادة 5% تعني 1.05 وليس 1.5!"),
  draw:()=>{const col=(cx,c,head,cmp,rows)=>[A.band(cx-170,26,340,446,c),A.tx(head,cx,78,40,c),A.tx(cmp,cx,124,34,c),
    ...rows.flatMap(([a,f],i)=>{const y=210+i*100;return[A.tx(a,cx-42,y,40,c,"end"),A.arrow(cx-28,y-13,cx+22,y-13,c),A.tx(f,cx+36,y,44,"k","start")]})];
   return[A.wipe(),...col(215,"b",T3("Ökning","Increase","زيادة"),T3("faktor > 1","factor > 1","المعامل > 1"),[[`+${pc(20)}`,dfmt(1.2,2)],[`+${pc(5)}`,dfmt(1.05,2)],[`+${pc(100)}`,dfmt(2,2)]]),
    ...col(585,"r",T3("Minskning","Decrease","نقصان"),T3("faktor < 1","factor < 1","المعامل < 1"),[[`−${pc(10)}`,dfmt(.9,2)],[`−${pc(25)}`,dfmt(.75,2)],[`−${pc(50)}`,dfmt(.5,2)]]),
    A.loop(288,296,50,30,"o"),A.tx(`${T3("inte","not","وليس")} ${dfmt(1.5,1)}!`,290,350,28,"o")]}},
 {say:t3("Mobilabonnemanget höjs från 250 kr till 300 kr i månaden. Nytt delat med gammalt: 300 / 250 = 1,20. Faktorn 1,20 betyder en ökning med 20 %.",
   "The phone plan goes up from 250 kr to 300 kr a month. New divided by old: 300 ÷ 250 = 1.20. The factor 1.20 means an increase of 20%.",
   `يرتفع اشتراك الهاتف من 250 إلى 300 كرونة شهريًا. نقسم الجديد على القديم: ${LRI("300 ÷ 250 = 1.20")}. المعامل 1.20 يعني زيادة بنسبة 20%.`),
  draw:()=>[A.wipe(),A.p(phone(90,110,120,230),"k",4.5),A.tx("250 kr",150,236,36),A.arrow(222,226,288,226,"r"),A.p(phone(300,110,120,230),"k",4.5),A.tx("300 kr",360,236,36,"r"),
   A.tx(T3("före","before","قبل"),150,390,34),A.tx(T3("efter","after","بعد"),360,390,34,"r"),
   A.tx(T3("nytt / gammalt","new ÷ old","الجديد ÷ القديم"),620,110,34,"b"),A.tx(`300 ${DIVS()} 250 = ${dfmt(1.2,2)}`,620,190,44),A.tx(`${dfmt(1.2,2)} = ${pc(120)}`,620,262,44),
   A.hl(500,300,240,70),A.tx(`+${pc(20)}`,620,352,54,"g"),A.tx(T3("ökning","increase","زيادة"),620,412,34,"g")]},
 {say:t3("Andelen elever som streamar musik varje dag ökar från 40 % till 50 %. Det är 10 procentenheter mer. Men räknat i procent är ökningen 10 / 40 = 0,25, alltså 25 %.",
   "The share of students who stream music every day goes up from 40% to 50%. That is 10 percentage points more. But in percent the increase is 10 ÷ 40 = 0.25, which is 25%.",
   `ترتفع نسبة الطلاب الذين يستمعون إلى الموسيقى يوميًا من 40% إلى 50%. هذه زيادة بمقدار 10 نقاط مئوية. لكن الزيادة بالنسبة المئوية هي ${LRI("10 ÷ 40 = 0.25")}، أي 25%.`),
  draw:()=>{const x0=200,W=480,bar=(y,p)=>[A.p(R.bar(x0,y,W,52,10),"k",3),A.hatch(rp(x0,y,W*.4,52),"b"),...(p>40?[A.hatch(rp(x0+W*.4,y,W*(p-40)/100,52),"r")]:[]),qt(pc(p),x0+W+46,y+38,32,p>40?"r":"b")];
   return[A.wipe(),A.tx(T3("Streamar musik varje dag","Stream music every day","يستمعون إلى الموسيقى يوميًا"),400,52,36,"b"),
    A.tx("2025",130,122,32),...bar(84,40),A.tx("2026",130,202,32),...bar(164,50),
    ...seq([[`${pc(50)} − ${pc(40)} = 10`,"b"],[T3("procentenheter","percentage points","نقاط مئوية"),"b"]],400,296,40),
    ...seq([[`10 ${DIVS()} 40 = ${dfmt(.25,2)} = ${pc(25)}`,"o"],[T3("ökning","increase","زيادة"),"o"]],400,364,40),
    A.hl(140,404,520,62),A.tx(T3("procentenheter ≠ procent","percentage points ≠ percent","النقاط المئوية ≠ النسبة المئوية"),400,450,40,"g")]}}
]};
LESSONS.push({id:"pct8",subject:"math",grades:"8",kind:"wb",
 title:t3("Förändringsfaktor och procentenheter","Change factor and percentage points","معامل التغيّر والنقاط المئوية"),
 icon:ICO(`<rect x="34" y="70" width="190" height="46" fill="#2257c9" fill-opacity=".25" stroke="#1d2433" stroke-width="3"/><rect x="224" y="70" width="48" height="46" fill="#d63b2f" fill-opacity=".3" stroke="#1d2433" stroke-width="3"/>
  <text x="129" y="56" ${CV} font-size="30" fill="#2257c9">100%</text><text x="248" y="56" ${CV} font-size="30" fill="#d63b2f">+25%</text><path d="M34 132H272M34 124V140M272 124V140" stroke="#1d2433" stroke-width="2.5"/><text x="153" y="168" ${CV} font-size="34" fill="#1e9e5a">× 1.25</text>`),
 steps:PCT8.steps,mount:wbMount(PCT8),
 gen(level){const M=MUL(),D=DIVS();
  if(level===0){const up=Math.random()<.5,p=up?pick([5,8,10,12,15,20,25,30,40,50,60,75]):pick([5,10,15,20,25,30,40,45,60,75,80]),f=(100+(up?p:-p))/100,y=180,W0=480,x0d=160;
   const head=up?T3(`Priset höjs med ${pc(p)}.`,`The price goes up by ${pc(p)}.`,`يرتفع السعر بنسبة ${pc(p)}.`):T3(`Priset sänks med ${pc(p)}.`,`The price goes down by ${pc(p)}.`,`ينخفض السعر بنسبة ${pc(p)}.`);
   let bar,lab;
   if(up){const W=380,x0=400-W*(1+p/100)/2;bar=[A.p(R.rect(x0,y,W,64,.3),"k",4),A.hatch(rp(x0,y,W,64),"b"),A.p(R.rect(x0+W,y,W*p/100,64,.3),"k",4),A.hatch(rp(x0+W,y,W*p/100,64),"r")];
    lab=[qt(pc(100),x0+W/2,y-14,30,"b"),qt(`+${pc(p)}`,x0+W*(1+p/200),y-14,28,"r")]}
   else{const W=W0,x0=x0d,k=1-p/100;bar=[A.p(R.rect(x0,y,W,64,.3)+R.line(x0+W*k,y,x0+W*k,y+64,.3),"k",4),A.hatch(rp(x0,y,W*k,64),"g"),A.hatch(rp(x0+W*k,y,W*p/100,64),"r")];
    lab=[A.p(R.line(x0,y+82,x0+W,y+82,.3)+R.line(x0,y+72,x0,y+92,.2)+R.line(x0+W,y+72,x0+W,y+92,.2),"k",3),qt(pc(100),400,y+120,28),qt(`−${pc(p)}`,x0+W*(1-p/200),y-14,28,"r")]}
   const sol=[...lab,...(up?[]:[qt(pc(100-p),x0d+W0*(1-p/100)/2,y-14,30,"g")]),A.tx(up?`${pc(100)} + ${pc(p)} = ${pc(100+p)}`:`${pc(100)} − ${pc(p)} = ${pc(100-p)}`,400,358,44),A.hl(240,386,320,70),A.tx(`${pc(100+(up?p:-p))} = ${dfmt(f,2)}`,400,438,52,"g")];
   return{kind:"num",dec:true,ans:f,show:dfmt(f,2),hk:lab.length,q:[A.wipe(),A.tx(head,400,68,42),A.tx(T3("Vilken är förändringsfaktorn?","What is the change factor?","ما معامل التغيّر؟"),400,130,38,"b"),...bar],sol}}
  if(level===1){const it=pick(IT8),up=Math.random()<.5,p=up?pick([5,10,15,20,25,30,40]):pick([10,15,20,25,30,35,40,50,60]),P=Math.max(it.lo,Math.round(rint(it.lo,it.hi)/20)*20),f=(100+(up?p:-p))/100,ans=Math.round(P*f);
   const head=up?L(t3(`Priset på ${it.n.sv} höjs med ${pc(p)}.`,`The price of ${it.n.en} goes up by ${pc(p)}.`,`يرتفع سعر ${it.n.ar} بنسبة ${pc(p)}.`))
    :L(t3(`Priset på ${it.n.sv} sänks med ${pc(p)}.`,`The price of ${it.n.en} goes down by ${pc(p)}.`,`ينخفض سعر ${it.n.ar} بنسبة ${pc(p)}.`));
   const q=[A.wipe(),A.tx(head,400,62,38),A.p(tagP(100,116,290,100),"k",4.5),A.tx(`${fmt(P)} kr`,226,184,54),A.p(R.circ(590,166,66),"r",4.5),
    ...(up?[A.tx(`+${pc(p)}`,590,182,44,"r")]:[A.tx(T3("REA","SALE","تخفيض"),590,152,30,"r"),A.tx(`−${pc(p)}`,590,196,40,"r")]),
    A.tx(T3("Vad blir det nya priset?","What is the new price?","ما السعر الجديد؟"),400,296,40,"b")];
   const sol=[A.tx(`${pc(100)} ${up?"+":"−"} ${pc(p)} = ${pc(100+(up?p:-p))} = ${dfmt(f,2)}`,400,364,40,"b"),A.hl(170,394,460,70),A.tx(`${fmt(P)} ${M} ${dfmt(f,2)} = ${fmt(ans)} kr`,400,446,50,"g")];
   return{kind:"num",ans,show:`${fmt(ans)} kr`,hk:1,q,sol}}
  if(Math.random()<.5){const old=rint(10,100)*20,up=Math.random()<.4,p=up?pick([5,10,15,20,25,30,40,50]):pick([5,10,15,20,25,30,35,40,50,60]),nw=old*(100+(up?p:-p))/100,P2=100+(up?p:-p);
   const q=[A.wipe(),A.tx(L(t3(`Hur många procent ${up?"höjdes":"sänktes"} priset?`,`By what percent did the price go ${up?"up":"down"}?`,`بكم في المئة ${up?"ارتفع":"انخفض"} السعر؟`)),400,62,40,"b"),
    A.p(tagP(80,120,260,96),"k",4.5),A.tx(`${fmt(old)} kr`,196,184,50),A.arrow(352,168,438,168,up?"r":"g"),A.p(tagP(450,120,260,96),"k",4.5),A.tx(`${fmt(nw)} kr`,566,184,50,up?"r":"g"),
    A.tx(T3("före","before","قبل"),196,262,32),A.tx(T3("nu","now","الآن"),566,262,32,up?"r":"g")];
   const sol=[A.tx(T3("nytt / gammalt","new ÷ old","الجديد ÷ القديم"),400,320,32,"b"),A.tx(`${fmt(nw)} ${D} ${fmt(old)} = ${dfmt(P2/100,2)} = ${pc(P2)}`,400,376,42),
    A.hl(220,404,360,68),A.tx(up?`${pc(P2)} − ${pc(100)} = ${pc(p)}`:`${pc(100)} − ${pc(P2)} = ${pc(p)}`,400,454,48,"g")];
   return{kind:"num",ans:p,show:pc(p),hk:1,q,sol}}
  const C=pick(CX8),up=Math.random()<.6,ppt=n=>t3(n===1?"procentenhet":"procentenheter",n===1?"percentage point":"percentage points",n===1?"نقطة مئوية واحدة":n===2?"نقطتان مئويتان":n<=10?"نقاط مئوية":"نقطة مئوية");let a,d,b;do{a=pick(C.as);d=rint(1,C.dm);b=up?a+d:a-d}while((d*100)%a||b<1||b>95||d*100/a>300);const e=d*100/a;
  const q=[A.wipe(),A.tx(L(C.n),400,62,36,"b"),A.tx(`${pc(a)} → ${pc(b)}`,400,170,74),
   A.tx(L(t3(`Hur många procentenheter ${up?"ökade":"minskade"} den?`,`By how many percentage points did it ${up?"go up":"go down"}?`,`بكم نقطة مئوية ${up?"ازدادت":"انخفضت"}؟`)),400,252,34),
   A.tx(T3("Och hur många procent?","And by how many percent?","وبكم في المئة؟"),400,300,34)];
  const sol=[A.hl(120,330,560,140),...seq([[up?`${pc(b)} − ${pc(a)} = ${d}`:`${pc(a)} − ${pc(b)} = ${d}`,"g"],[L(ppt(d)),"g"]],400,380,40),
   ...seq([[`${d} ${D} ${a} = ${dfmt(e/100,2)} = ${pc(e)}`,"g"],[up?T3("ökning","increase","زيادة"):T3("minskning","decrease","نقصان"),"g"]],400,446,40)];
  return{kind:"pair",ans:[d,e],sep:"",labels:[t3("procentenheter","percentage points","نقاط مئوية"),t3("procent","percent","بالمئة")],
   show:L(t3(`${d} ${ppt(d).sv} och ${pc(e)}`,`${d} ${ppt(d).en} and ${pc(e)}`,d===1?`نقطة مئوية واحدة و${pc(e)}`:d===2?`نقطتان مئويتان و${pc(e)}`:`${d} ${ppt(d).ar} و${pc(e)}`)),hk:0,q,sol}}
});

/* =====================================================================
   2. interest8: interest, loans and saving, compound interest
   ===================================================================== */
const money=x=>Number.isInteger(x)?fmt(x):(()=>{const [i,f]=(+x).toFixed(2).split(".");return fmt(+i)+(lang==="sv"?",":".")+f})();
const fac=x=>{let s=String(+x.toFixed(6));return lang==="sv"?s.replace(".",","):s};
const yr=n=>T3(`år ${n}`,`year ${n}`,`السنة ${n}`);
const INT8={steps:[
 {say:t3("Emma sätter in 5 000 kr på ett sparkonto med 3 % ränta per år. Efter ett år får hon 3 % av 5 000 kr, alltså 150 kr i ränta.",
   "Emma puts 5,000 kr into a savings account with 3% interest per year. After one year she gets 3% of 5,000 kr, which is 150 kr in interest.",
   `تضع إيما 5000 كرونة في حساب توفير بفائدة 3% سنويًا. بعد سنة تحصل على 3% من 5000 كرونة، أي ${LRI("0.03 × 5000 = 150")} كرونة فائدة.`),
  draw:()=>[A.wipe(),A.p(piggy(180,260),"k",4.5),A.p(R.circ(170,110,28),"o",4.5),A.tx("kr",170,121,28,"o"),A.arrow(170,146,170,186,"o"),
   A.tx(`${fmt(5000)} kr`,560,100,56),...seq([[pc(3),"b"],[T3("ränta per år","interest per year","فائدة سنويًا"),"b"]],560,170,36),
   A.tx(`${dfmt(.03,2)} ${MUL()} ${fmt(5000)} = 150 kr`,560,262,42),A.tx(T3("ränta efter ett år","interest after one year","الفائدة بعد سنة"),560,310,30,"o"),
   A.hl(360,350,400,70),A.tx(`${fmt(5000)} + 150 = ${fmt(5150)} kr`,560,400,42,"g")]},
 {say:t3("Året efter får Emma ränta på 5 150 kr, inte bara på 5 000 kr. Det kallas ränta på ränta. Varje år multiplicerar vi med förändringsfaktorn 1,03.",
   "The year after, Emma gets interest on 5,150 kr, not just on 5,000 kr. This is called compound interest. Every year we multiply by the change factor 1.03.",
   "في السنة التالية تحصل إيما على فائدة على 5150 كرونة، لا على 5000 فقط. هذا يسمى الفائدة المركّبة. في كل سنة نضرب في معامل التغيّر 1.03."),
  draw:()=>{const V=[5000,5150,5304.5,5463.635],X=[140,313,487,660],B=420,H=v=>v/5463.635*230,o=[A.wipe(),A.tx(T3("Ränta på ränta","Compound interest","الفائدة المركّبة"),400,56,42,"b")];
   V.forEach((v,i)=>{const h=H(v),hb=H(5000);o.push(A.p(R.rect(X[i]-40,B-h,80,h,.3),"k",3.5),A.hatch(rp(X[i]-40,B-hb,80,hb),"b"));if(i)o.push(A.hatch(rp(X[i]-40,B-h,80,h-hb),"r"));
    o.push(qt(money(Math.round(v*100)/100),X[i],B-h-14,28,i?"r":"k"),qt(i?yr(i):T3("start","start","البداية"),X[i],B+38,28))});
   for(let i=0;i<3;i++)o.push(A.arrow(X[i]+46,316,X[i+1]-46,316,"b",-12),qt(`${MUL()} ${dfmt(1.03,2)}`,(X[i]+X[i+1])/2,292,26,"b"));
   return o}},
 {say:t3("Snabbare: multiplicera med 1,03 tre gånger, alltså med 1,03³. Efter tre år har Emma ungefär 5 464 kr. Räntan blev 464 kr, mer än 3 · 150 = 450 kr.",
   "Faster: multiply by 1.03 three times, which is 1.03³. After three years Emma has about 5,464 kr. The interest was 464 kr, more than 3 × 150 = 450 kr.",
   `أسرع: نضرب في 1.03 ثلاث مرات، أي في ${LRI("1.03³")}. بعد ثلاث سنوات يكون مع إيما نحو 5464 كرونة. الفائدة 464 كرونة، أكثر من ${LRI("3 × 150 = 450")}.`),
  draw:()=>{const M=MUL(),f=dfmt(1.03,2);return[A.wipe(),A.tx(`${fmt(5000)} ${M} ${f} ${M} ${f} ${M} ${f}`,400,100,46),A.tx(`= ${fmt(5000)} ${M} ${f}³`,400,180,46),A.tx(`≈ ${money(5463.64)} kr`,400,258,46),
   A.hl(240,288,320,70),A.tx(`≈ ${fmt(5464)} kr`,400,340,54,"g"),...seq([[T3("ränta:","interest:","الفائدة:"),"o"],[`${fmt(5464)} − ${fmt(5000)} = 464 kr`,"o"]],400,430,36)]}},
 {say:t3("Ett lån kostar pengar. Ali lånar 20 000 kr till en moped. Räntan är 6 % per år, så första året betalar han 0,06 · 20 000 = 1 200 kr i ränta.",
   "A loan costs money. Ali borrows 20,000 kr for a moped. The interest is 6% per year, so in the first year he pays 0.06 × 20,000 = 1,200 kr in interest.",
   `القرض له تكلفة. يقترض علي 20000 كرونة لشراء دراجة نارية صغيرة. الفائدة 6% سنويًا، فيدفع في السنة الأولى ${LRI("0.06 × 20000 = 1200")} كرونة فائدة.`),
  draw:()=>[A.wipe(),A.p(moped(90,330),"k",4.5),A.tx(T3("Lån","Loan","القرض"),580,80,40,"b"),A.tx(`${fmt(20000)} kr`,580,150,56),
   ...seq([[pc(6),"r"],[T3("ränta per år","interest per year","فائدة سنويًا"),"r"]],580,214,36),A.tx(`${dfmt(.06,2)} ${MUL()} ${fmt(20000)} = ${fmt(1200)} kr`,580,300,38),
   A.hl(420,336,320,70),...seq([[`${fmt(1200)} kr`,"g"],[T3("per år","per year","سنويًا"),"g"]],580,386,44),
   A.tx(T3("Det betalar Ali till banken.","Ali pays this to the bank.","يدفعها علي للبنك."),580,450,30,"o")]},
 {say:t3("Mobilen kostar 9 990 kr om du betalar direkt. På avbetalning betalar du 449 kr i månaden i 24 månader: 24 · 449 = 10 776 kr. Det är 786 kr dyrare!",
   "The phone costs 9,990 kr if you pay at once. On instalments you pay 449 kr a month for 24 months: 24 × 449 = 10,776 kr. That is 786 kr more!",
   `سعر الهاتف 9990 كرونة إذا دفعت فورًا. بالتقسيط تدفع 449 كرونة شهريًا لمدة 24 شهرًا: ${LRI("24 × 449 = 10776")} كرونة. أي أغلى بـ 786 كرونة!`),
  draw:()=>[A.wipe(),A.p(phone(70,110,130,250),"k",4.5),A.tx(`${fmt(9990)} kr`,135,246,30),
   ...seq([[T3("direkt:","pay now:","فورًا:"),"b"],[`${fmt(9990)} kr`,"b"]],490,130,40),
   ...seq([[T3("avbetalning:","instalments:","بالتقسيط:"),"r"],[`24 ${MUL()} 449 = ${fmt(10776)} kr`,"r"]],490,215,40),
   A.hl(300,268,380,70),A.tx(`${fmt(10776)} − ${fmt(9990)} = 786 kr`,490,318,46,"g"),A.tx(T3("dyrare med avbetalning","more expensive on instalments","أغلى بالتقسيط"),490,382,34,"g")]}
]};
LESSONS.push({id:"interest8",subject:"math",grades:"8",kind:"wb",
 title:t3("Ränta, lån och sparande","Interest, loans and saving","الفائدة والقروض والادخار"),
 icon:ICO([0,1,2,3].map(i=>[...Array(3+i)].map((_,k)=>`<ellipse cx="${60+i*62}" cy="${150-k*14}" rx="24" ry="7" fill="${i===3?"#e07b00":"#fff"}" fill-opacity="${i===3?.25:1}" stroke="#1d2433" stroke-width="2.5"/>`).join("")).join("")
  +`<path d="M50 70Q150 50 240 30" stroke="#1e9e5a" stroke-width="4" fill="none"/><path d="M240 30l-16 2M240 30l-10 12" stroke="#1e9e5a" stroke-width="4"/><text x="275" y="80" ${CV} font-size="56" fill="#d63b2f">%</text>`),
 steps:INT8.steps,mount:wbMount(INT8),
 gen(level){const M=MUL();
  const top=(save,K,r,extra)=>[A.wipe(),A.p(save==="loan"?bank(140,150,.85):save==="debt"?card(140,140,.95):piggy(140,160,.75),"k",4.5),
   A.tx(save==="loan"?T3("Lån","Loan","القرض"):save==="debt"?T3("Skuld på kortet","Card debt","دين البطاقة"):save==="fund"?T3("Fond","Fund","صندوق استثمار"):T3("Sparkonto","Savings account","حساب توفير"),520,62,36,"b"),
   A.tx(`${fmt(K)} kr`,520,130,58),...seq([[pc(r),"r"],[save==="debt"?T3("mer per år","more per year","زيادة سنويًا"):save==="fund"?T3("ökning per år","growth per year","نمو سنويًا"):T3("ränta per år","interest per year","فائدة سنويًا"),"r"]],520,192,36),...(extra||[])];
  if(level===0){const loan=Math.random()<.45,K=rint(4,100)*500,r=loan?pick([3,4,5,6,8,10,12]):pick([1,2,3,4,5]),ans=K*r/100;
   const q=[...top(loan?"loan":"save",K,r),A.tx(loan?T3("Hur mycket ränta betalar du första året?","How much interest do you pay in the first year?","كم تدفع فائدة في السنة الأولى؟")
    :T3("Hur mycket ränta får du efter ett år?","How much interest do you get after one year?","كم تحصل على فائدة بعد سنة؟"),400,296,36)];
   const sol=[A.tx(`${pc(r)} = ${dfmt(r/100,2)}`,400,362,40,"b"),A.hl(190,394,420,68),A.tx(`${dfmt(r/100,2)} ${M} ${fmt(K)} = ${fmt(ans)} kr`,400,444,48,"g")];
   return{kind:"num",ans,show:`${fmt(ans)} kr`,hk:1,q,sol}}
  if(level===1){let K,r;do{r=pick([2,3,4,5,6]);K=rint(10,300)*100}while((K*(100+r)*(100+r))%10000);const f=(100+r)/100,v1=K*(100+r)/100,v2=K*(100+r)*(100+r)/10000;
   const q=[...top("save",K,r),A.tx(T3("Hur mycket finns på kontot efter 2 år?","How much is in the account after 2 years?","كم يصبح في الحساب بعد سنتين؟"),400,296,36)];
   const l2=`${fmt(v1)} ${M} ${dfmt(f,2)} = ${fmt(v2)} kr`,hw=tw(`${yr(2)}:`,44)+tw(l2,44)+14+40;
   const sol=[...seq([[`${yr(1)}:`,"b"],[`${fmt(K)} ${M} ${dfmt(f,2)} = ${fmt(v1)} kr`,"k"]],400,362,38),A.hl(400-hw/2,394,hw,68),...seq([[`${yr(2)}:`,"b"],[l2,"g"]],400,444,44)];
   return{kind:"num",ans:v2,show:`${fmt(v2)} kr`,hk:2,q,sol}}
  const r=pick([5,10,20]),K=r===5?pick([8000,16000,24000,32000,40000]):r===10?rint(1,20)*1000:rint(1,10)*1000,kind=r===5?"save":r===10?"fund":"debt",askInt=Math.random()<.5;
  const v=[K];for(let i=0;i<3;i++)v.push(v[i]*(100+r)/100);const f=dfmt((100+r)/100,2),ans=askInt?v[3]-K:v[3];
  const Q=kind==="debt"?(askInt?T3("Hur mycket har skulden ökat efter 3 år?","How much has the debt grown after 3 years?","كم زاد الدين بعد 3 سنوات؟"):T3("Hur stor är skulden efter 3 år?","How big is the debt after 3 years?","كم يصبح الدين بعد 3 سنوات؟"))
   :askInt?T3("Hur mycket har pengarna ökat efter 3 år?","How much has the money grown after 3 years?","كم زاد المال بعد 3 سنوات؟"):T3("Hur mycket finns det efter 3 år?","How much is there after 3 years?","كم يصبح المبلغ بعد 3 سنوات؟");
  const q=[...top(kind,K,r),A.tx(Q,400,262,36)];
  const sol=[1,2,3].flatMap(i=>seq([[`${yr(i)}:`,"b"],[`${fmt(v[i-1])} ${M} ${f} = ${fmt(v[i])} kr`,!askInt&&i===3?"g":"k"]],400,314+(i-1)*44,32));
  sol.push(A.hl(150,422,500,62),askInt?A.tx(`${fmt(v[3])} − ${fmt(K)} = ${fmt(ans)} kr`,400,468,44,"g"):A.tx(`${fmt(K)} ${M} ${f}³ = ${fmt(ans)} kr`,400,468,44,"g"));
  return{kind:"num",ans,show:`${fmt(ans)} kr`,hk:2,q,sol}}
});

/* =====================================================================
   3. paren8: expanding brackets and factorising (common factor)
   ===================================================================== */
const arcs=(E,y,z,from,to)=>to.map((j,k)=>A.arrow(E.xs[from],y-z*.78,E.xs[j],y-z*.78,k?"r":"b",-(20+k*16)));
/* "= [ ]x + [ ]": answer template under the question; returns actions and the box centres */
const tmpl=(V,sg,y)=>{const z=52,bw=64,parts=[["=",tw("=",z)],["#",bw],[`${V} ${sg}`,tw(`${V} ${sg}`,z)],["#",bw]],g=14,tot=parts.reduce((a,p)=>a+p[1],0)+g*3;let x=400-tot/2;const o=[],bx=[];
 parts.forEach(([s,w])=>{const c=x+w/2;x+=w+g;if(s==="#"){o.push(A.p(R.rect(c-bw/2,y-48,bw,60,.3),"k",3));bx.push(c)}else o.push(A.tx(s,c,y,z))});o.bx=bx;return o};
const pairUI=(V,sg)=>lang==="ar"?{sep:"،",labels:[t3("","",`معامل ${V}`),t3("","",`العدد بعد ${sg}`)]}:{sep:`${V} ${sg}`};
const PAR8={steps:[
 {say:t3("Tre kompisar går på bio. Var och en köper en biljett för x kr och popcorn för 40 kr. Hela notan blir 3(x + 40) kr.",
   "Three friends go to the cinema. Each one buys a ticket for x kr and popcorn for 40 kr. The whole bill is 3(x + 40) kr.",
   `ثلاثة أصدقاء يذهبون إلى السينما. يشتري كل واحد تذكرة بـ x كرونة وفشارًا بـ 40 كرونة. الحساب كله ${LRI("3(x + 40)")} كرونة.`),
  draw:()=>{const X=[190,330,470];return[A.wipe(),A.p(X.map(x=>R.circ(x,40,16)).join(""),"k",3.5),A.p(X.map(x=>ticket(x,112,110,58)).join(""),"b",4),...X.map(x=>qt("x",x-10,124,36,"b")),
   ...X.map(x=>qt("+",x,178,34)),A.p(X.map(x=>popcorn(x,252)).join(""),"o",4),...X.map(x=>qt("40",x,264,26,"o")),A.tx("3(x + 40)",376,388,60,"k","end")]}},
 {say:t3("Vi kan också räkna alla biljetter för sig och allt popcorn för sig: 3x + 3 · 40 = 3x + 120. Båda sätten ger samma nota.",
   "We can also count all the tickets on their own and all the popcorn on its own: 3x + 3 × 40 = 3x + 120. Both ways give the same bill.",
   `يمكننا أيضًا أن نحسب التذاكر وحدها والفشار وحده: ${LRI("3x + 3 × 40 = 3x + 120")}. الطريقتان تعطيان الحساب نفسه.`),
  draw:()=>[A.loop(330,114,196,40,"b"),A.tx("3x",650,128,50,"b"),A.loop(330,246,196,56,"o"),A.tx(`3 ${MUL()} 40 = 120`,650,262,40,"o"),
   A.hl(150,340,520,70),A.tx("=",400,388,60),A.tx("3x + 120",428,388,60,"g","start")]},
 {say:t3("Multiplicera in: talet framför parentesen ska gångas med varje term inuti. 5(2a − 3) = 5 · 2a − 5 · 3 = 10a − 15.",
   "Expand: the number in front of the brackets multiplies every term inside. 5(2a − 3) = 5 × 2a − 5 × 3 = 10a − 15.",
   `فكّ القوس: العدد الذي أمام القوس يُضرب في كل حدّ داخله. ${LRI("5(2a − 3) = 5 × 2a − 5 × 3 = 10a − 15")}.`),
  draw:()=>{const E=toks([["5"],["("],["2a","b"],[" − "],["3","r"],[")"]],400,190,76);return[A.wipe(),A.tx(T3("Multiplicera in","Expand the brackets","فكّ القوس"),400,52,38,"b"),...E,...arcs(E,190,76,0,[2,4]),
   A.tx(`= 5 ${MUL()} 2a − 5 ${MUL()} 3`,400,290,50),A.hl(250,326,300,68),A.tx("= 10a − 15",400,376,56,"g")]}},
 {say:t3("Se upp med minus framför parentesen! −2 gånger −6 blir +12, eftersom minus gånger minus blir plus. Alltså −2(x − 6) = −2x + 12.",
   "Watch out for a minus in front of the brackets! −2 times −6 is +12, because minus times minus is plus. So −2(x − 6) = −2x + 12.",
   `انتبه إلى السالب أمام القوس! ${LRI("−2 × (−6) = +12")}، لأن السالب في السالب يعطي موجبًا. إذن ${LRI("−2(x − 6) = −2x + 12")}.`),
  draw:()=>{const E=toks([["−2"],["("],["x","b"],[" − "],["6","r"],[")"]],400,170,76);return[A.wipe(),...E,...arcs(E,170,76,0,[2,4]),
   A.tx(`(−2) ${MUL()} x = −2x`,360,262,44,"b"),A.tx(`(−2) ${MUL()} (−6) = +12`,360,334,44,"r"),A.tx(`− ${MUL()} − = +`,660,334,36,"o"),
   A.hl(200,374,400,70),A.tx("−2(x − 6) = −2x + 12",400,424,52,"g")]}},
 {say:t3("Att bryta ut är att gå baklänges. 3 går jämnt upp i både 6x och 15: 6x = 3 · 2x och 15 = 3 · 5. Alltså 6x + 15 = 3(2x + 5).",
   "Factorising means going backwards. 3 divides both 6x and 15: 6x = 3 × 2x and 15 = 3 × 5. So 6x + 15 = 3(2x + 5).",
   `إخراج العامل المشترك هو السير بالعكس. العدد 3 يقسم 6x و15 معًا: ${LRI("6x = 3 × 2x")} و${LRI("15 = 3 × 5")}. إذن ${LRI("6x + 15 = 3(2x + 5)")}.`),
  draw:()=>[A.wipe(),A.tx("6x + 15",400,70,56),A.band(210,146,250,116,"b"),A.band(460,146,130,116,"o"),A.p(R.rect(210,146,380,116,.3)+R.line(460,146,460,262,.3),"k",4),
   A.tx("6x",335,220,50,"b"),A.tx("15",525,220,50,"o"),A.tx("3",178,220,50,"r"),A.tx("2x",335,132,38,"r"),A.tx("5",525,132,38,"r"),
   A.tx(`6x = 3 ${MUL()} 2x`,260,318,38),A.tx(`15 = 3 ${MUL()} 5`,560,318,38),A.hl(170,356,460,70),A.tx("6x + 15 = 3(2x + 5)",400,406,54,"g")]},
 {say:t3("Bryt ut den största gemensamma faktorn. I 12a + 18 går både 2, 3 och 6 jämnt upp, men 6 är störst: 12a + 18 = 6(2a + 3). Kontrollera genom att multiplicera in!",
   "Take out the greatest common factor. In 12a + 18, 2, 3 and 6 all divide both terms, but 6 is the biggest: 12a + 18 = 6(2a + 3). Check by expanding!",
   `أخرج العامل المشترك الأكبر. في ${LRI("12a + 18")} تقسم الأعداد 2 و3 و6 الحدّين، لكن 6 هو الأكبر: ${LRI("12a + 18 = 6(2a + 3)")}. تحقّق بفكّ القوس!`),
  draw:()=>{const S=seq([[T3("delar båda:","divides both:","يقسم الحدّين:"),"b"],["  2  "],["  3  "],["  6  ","g"]],400,150,40);return[A.wipe(),A.tx("12a + 18",400,70,56),...S,A.loop(S[3].x,136,22,26,"g"),
   A.tx("2(6a + 9)",270,238,46),A.tx(T3("kan brytas ut mer","can be factorised more","يمكن إخراج عامل آخر"),560,238,30,"o"),
   A.hl(190,276,420,68),A.tx("12a + 18 = 6(2a + 3)",400,326,52,"g"),
   ...seq([[T3("Kontroll:","Check:","تحقّق:"),"b"],[`6 ${MUL()} 2a + 6 ${MUL()} 3 = 12a + 18 ✓`,"b"]],400,420,36)]}}
]};
LESSONS.push({id:"paren8",subject:"math",grades:"8",kind:"wb",
 title:t3("Parenteser: multiplicera in och bryt ut","Brackets: expanding and factorising","الأقواس: الفكّ وإخراج العامل المشترك"),
 icon:ICO(`<text x="160" y="92" ${CV} font-size="58" fill="#1d2433">3(x + 4)</text><path d="M86 48Q110 14 132 46" stroke="#d63b2f" stroke-width="3.5" fill="none"/><path d="M86 48Q150 0 210 46" stroke="#2257c9" stroke-width="3.5" fill="none"/>
  <text x="160" y="158" ${CV} font-size="48" fill="#1e9e5a">= 3x + 12</text>`),
 steps:PAR8.steps,mount:wbMount(PAR8),
 gen(level){const M=MUL();
  if(level===0){const V=pick(["x","x","y","a"]),a=rint(2,9),b=rint(1,6),c=rint(1,12),sg=Math.random()<.4?"−":"+",p=a*b,qv=a*c;
   const E=toks([[String(a)],["("],[T1(b,V),"b"],[` ${sg} `],[String(c),"r"],[")"]],400,190,76),Tp=tmpl(V,sg,300);
   const sol=[...arcs(E,190,76,0,[2,4]),A.tx(`= ${a} ${M} ${T1(b,V)} ${sg} ${a} ${M} ${c}`,400,386,46),A.hl(240,416,320,66),A.tx(`= ${T1(p,V)} ${sg} ${qv}`,400,464,52,"g"),
    A.tx(p,Tp.bx[0],300,46,"g"),A.tx(qv,Tp.bx[1],300,46,"g")];
   return{kind:"pair",ans:[p,qv],...pairUI(V,sg),show:lang==="ar"?LRI(`${T1(p,V)} ${sg} ${qv}`):`${T1(p,V)} ${sg} ${qv}`,hk:2,
    q:[A.wipe(),A.tx(T3("Multiplicera in","Expand the brackets","فكّ القوس"),400,62,40,"b"),...E,...Tp],sol}}
  if(level===1){let a,b,c,d,s1,s2,so,p,qv;do{a=rint(2,7);c=rint(2,6);b=rint(1,9);d=rint(1,9);s1=Math.random()<.5?1:-1;s2=Math.random()<.5?1:-1;so=Math.random()<.65?-1:1;
    p=a+so*c;qv=a*s1*b+so*c*s2*d}while(p<2||!qv||Math.abs(qv)>60||c===a);
   const sg=qv<0?"−":"+",ex=`${a}(x ${sgn(s1)} ${b}) ${sgn(so)} ${c}(x ${sgn(s2)} ${d})`;
   const terms=[[a,"x"],[a*s1*b,""],[so*c,"x"],[so*c*s2*d,""]];
   const E=toks(terms.flatMap(([k,v],i)=>{const t=v?T1(Math.abs(k),v):String(Math.abs(k)),c2=v?"b":"o";return i===0?[["= "],[t,c2]]:[[` ${sgn(k)} `],[t,c2]]}),400,376,46);
   const Tp=tmpl("x",sg,290);
   const sol=[...E,A.hl(240,408,320,66),A.tx(`= ${T1(p,"x")} ${sg} ${Math.abs(qv)}`,400,456,52,"g"),A.tx(p,Tp.bx[0],290,46,"g"),A.tx(Math.abs(qv),Tp.bx[1],290,46,"g")];
   return{kind:"pair",ans:[p,Math.abs(qv)],...pairUI("x",sg),show:lang==="ar"?LRI(`${T1(p,"x")} ${sg} ${Math.abs(qv)}`):`${T1(p,"x")} ${sg} ${Math.abs(qv)}`,hk:E.length,
    q:[A.wipe(),A.tx(T3("Förenkla","Simplify","بسّط"),400,62,40,"b"),A.tx(ex,400,182,60),...Tp],sol}}
  const sq=Math.random()<.35,sg=Math.random()<.3?"−":"+";let g,m,n;
  const gcd=(x,y)=>y?gcd(y,x%y):x;
  do{g=sq?pick([2,3,4,5,6]):pick([2,3,4,5,6,8,9,10]);m=rint(1,sq?4:5);n=rint(1,9)}while(gcd(m,n)>1||g*m>60||g*n>90||(m===1&&n===1));
  const v=sq?"x":pick(["x","a","y"]),G=sq?`${g}x`:String(g),t1=sq?T1(g*m,"x²"):T1(g*m,v),t2=sq?T1(g*n,"x"):String(g*n),inner=(a,b)=>sq?`${T1(a,"x")} ${sg} ${b}`:`${T1(a,v)} ${sg} ${b}`;
  const right=`${G}(${inner(m,n)})`;let cand=[];
  const dv=[];for(let k=2;k<g;k++)if(g%k===0)dv.push(k);
  if(sq){cand=[`${g}(${T1(m,"x²")} ${sg} ${T1(n,"x")})`,`x(${T1(g*m,"x")} ${sg} ${g*n})`,`${g}x(${inner(m,g*n)})`,`${g}x(${T1(m,"x²")} ${sg} ${n})`]}
  else{if(dv.length){const k=pick(dv);cand.push(`${k}(${inner(m*g/k,n*g/k)})`)}cand.push(`${g}(${inner(m,g*n)})`,`${g}(${inner(g*m,n)})`,`${g}${v}(${m} ${sg} ${n})`,`${g*m}(${v} ${sg} ${n})`)}
  cand=shuffle([...new Set(cand)].filter(s=>s!==right)).slice(0,3);
  const all=shuffle([right,...cand]),ans=all.indexOf(right);
  const E=toks([[t1],[` ${sg} `],[t2]],400,190,84);
  const sol=[A.loop(E.xs[0],190-28,E.ws[0]/2+6,40,"o"),A.loop(E.xs[2],190-28,E.ws[2]/2+6,40,"o"),
   ...seq([[T3("största gemensamma faktor:","greatest common factor:","العامل المشترك الأكبر:"),"b"],[G,"b"]],400,282,36),
   A.tx(`${t1} ${sg} ${t2} = ${G} ${M} ${sq?T1(m,"x"):T1(m,v)} ${sg} ${G} ${M} ${n}`,400,352,40),A.hl(220,386,360,68),A.tx(`= ${right}`,400,436,54,"g")];
  return{kind:"choice",opts:all.map(s=>t3(s,s,LRI(s))),ans,show:lang==="ar"?LRI(right):right,hk:2,
   q:[A.wipe(),A.tx(T3("Faktorisera så långt det går","Factorise fully","حلّل إلى عوامل بأكبر قدر ممكن"),400,66,40,"b"),...E],sol}}
});

/* =====================================================================
   4. eq8: equations with brackets and fractions
   ===================================================================== */
const pizza=(cx,cy,r)=>R.circ(cx,cy,r)+R.line(cx-r,cy,cx+r,cy,.4)+R.line(cx,cy-r,cx,cy+r,.4);
const EQ8={steps:[
 {say:t3("Tre kompisar köper var sin konsertbiljett för x kr och betalar dessutom 40 kr var i avgift. Totalt blir det 1 020 kr: 3(x + 40) = 1 020.",
   "Three friends each buy a concert ticket for x kr and also pay a 40 kr fee each. In total it comes to 1,020 kr: 3(x + 40) = 1,020.",
   `ثلاثة أصدقاء يشتري كل منهم تذكرة حفلة بـ x كرونة ويدفع أيضًا 40 كرونة رسومًا. المجموع 1020 كرونة: ${LRI("3(x + 40) = 1020")}.`),
  draw:()=>{const X=[210,400,590];return[A.wipe(),A.p(X.map(x=>ticket(x,92,160,76)).join(""),"b",4),...X.map(x=>qt("x + 40",x-12,104,34,"b")),
   A.tx(L(t3(`totalt ${fmt(1020)} kr`,`total ${fmt(1020)} kr`,`المجموع ${fmt(1020)} كرونة`)),400,180,34,"o"),...eqn("3(x + 40)",fmt(1020),262,52)]}},
 {say:t3("Dela båda sidor med 3: x + 40 = 340. Ta sedan bort 40 på båda sidor: x = 300. En biljett kostar 300 kr.",
   "Divide both sides by 3: x + 40 = 340. Then take away 40 on both sides: x = 300. One ticket costs 300 kr.",
   `نقسم الطرفين على 3: ${LRI("x + 40 = 340")}. ثم نطرح 40 من الطرفين: ${LRI("x = 300")}. سعر التذكرة 300 كرونة.`),
  draw:()=>[...ann(`${DIVS()} 3`,262),...eqn("x + 40","340",342,52),...ann("− 40",342),...eqn("x","300",422,52,"g"),A.loop(408,404,96,38,"g")]},
 {say:t3("Ibland multiplicerar vi in först. 2(x − 3) = x + 5 blir 2x − 6 = x + 5. Samla x på ena sidan och talen på den andra: x = 11.",
   "Sometimes we expand first. 2(x − 3) = x + 5 becomes 2x − 6 = x + 5. Collect the x terms on one side and the numbers on the other: x = 11.",
   `أحيانًا نفكّ القوس أولًا. ${LRI("2(x − 3) = x + 5")} تصبح ${LRI("2x − 6 = x + 5")}. نجمع x في طرف والأعداد في الطرف الآخر: ${LRI("x = 11")}.`),
  draw:()=>[A.wipe(),...eqn("2(x − 3)","x + 5",80,50),...ann(T3("multiplicera in","expand","فكّ القوس"),80,600,28),...eqn("2x − 6","x + 5",160,50),...ann("− x",160,600),
   ...eqn("x − 6","5",240,50),...ann("+ 6",240,600),...eqn("x","11",320,52,"g"),A.loop(406,302,90,38,"g"),
   ...seq([[T3("Kontroll:","Check:","تحقّق:"),"b"],["2(11 − 3) = 16,","b"],["11 + 5 = 16 ✓","b"]],400,420,36)]},
 {say:t3("Fyra kompisar delar lika på pizzanotan. Var och en betalar 85 kr. Hela notan x delat med 4 är 85: x/4 = 85. Gånga båda sidor med 4: x = 340.",
   "Four friends split the pizza bill equally. Each one pays 85 kr. The whole bill x divided by 4 is 85: x/4 = 85. Multiply both sides by 4: x = 340.",
   `أربعة أصدقاء يتقاسمون حساب البيتزا بالتساوي، ويدفع كل واحد 85 كرونة. الحساب كله x مقسومًا على 4 يساوي 85: ${LRI("x/4 = 85")}. نضرب الطرفين في 4: ${LRI("x = 340")}.`),
  draw:()=>{const c=[[-1,-1],[1,-1],[-1,1],[1,1]];return[A.wipe(),A.p(pizza(190,250,135),"o",4.5),A.p(dots([[148,226],[234,228],[150,282],[232,280]]),"r",14),...c.map(([a,b])=>qt("85 kr",190+a*68,250+b*62+10,30)),
   A.tx(T3("hela notan = x","whole bill = x","الحساب كله = x"),190,450,32,"b"),
   ...frow([["f","x","4"],["t","= 85"]],545,140,58),...ann(`${MUL()} 4`,160,665),...eqn("x",`85 ${MUL()} 4`,270,50,"k",530),...eqn("x","340",360,54,"g",530),A.loop(540,342,96,40,"g")]}},
 {say:t3("Två bråk: Lisa lägger hälften av sin månadspeng på kläder och en tredjedel på gaming, totalt 250 kr. Då gäller x/2 + x/3 = 250.",
   "Two fractions: Lisa spends half of her monthly allowance on clothes and a third on gaming, 250 kr in total. Then x/2 + x/3 = 250.",
   `كسران: تنفق ليزا نصف مصروفها الشهري على الملابس وثلثه على الألعاب، والمجموع 250 كرونة. إذن ${LRI("x/2 + x/3 = 250")}.`),
  draw:()=>{const x0=100,W=600,u=W/6,y=64;return[A.wipe(),A.p(R.bar(x0,y,W,58,6),"k",3.5),A.hatch(rp(x0,y,3*u,58),"b"),A.hatch(rp(x0+3*u,y,2*u,58),"o"),
   qt(T3("kläder","clothes","الملابس"),x0+1.5*u,y+92,30,"b"),qt(T3("gaming","gaming","الألعاب"),x0+4*u,y+92,30,"o"),
   A.p(R.line(x0,y-16,x0+5*u,y-16,.3)+R.line(x0,y-24,x0,y-8,.2)+R.line(x0+5*u,y-24,x0+5*u,y-8,.2),"g",3),qt("250 kr",x0+2.5*u,y-26,28,"g"),
   A.p(R.line(x0,y+112,x0+W,y+112,.3)+R.line(x0,y+104,x0,y+120,.2)+R.line(x0+W,y+104,x0+W,y+120,.2),"k",3),qt(T3("månadspeng x","allowance x","المصروف x"),400,y+148,30),
   ...frow([["f","x","2"],["t","+"],["f","x","3"],["t","= 250"]],380,268,50)]}},
 {say:t3("Gånga alla termer med 6, minsta gemensamma nämnaren. 6 · x/2 = 3x och 6 · x/3 = 2x. Då blir 5x = 1 500, så x = 300 kr.",
   "Multiply every term by 6, the lowest common denominator. 6 × x/2 = 3x and 6 × x/3 = 2x. Then 5x = 1,500, so x = 300 kr.",
   `نضرب كل الحدود في 6، وهو المقام المشترك الأصغر. ${LRI("6 × x/2 = 3x")} و${LRI("6 × x/3 = 2x")}. فيصبح ${LRI("5x = 1500")}، إذن ${LRI("x = 300")} كرونة.`),
  draw:()=>[...ann(`${MUL()} 6`,280,610),...eqn("3x + 2x",fmt(1500),346,46,"k",380),...eqn("5x",fmt(1500),408,46,"k",380),...ann(`${DIVS()} 5`,408,610),
   ...eqn("x","300",474,50,"g",380),A.loop(392,457,90,34,"g")]}
]};
LESSONS.push({id:"eq8",subject:"math",grades:"8",kind:"wb",
 title:t3("Ekvationer med parenteser och bråk","Equations with brackets and fractions","معادلات فيها أقواس وكسور"),
 icon:ICO(`<text x="160" y="70" ${CV} font-size="48" fill="#1d2433">2(x − 3) = 8</text><text x="96" y="122" ${CV} font-size="40" fill="#2257c9">x</text><path d="M80 132H112" stroke="#2257c9" stroke-width="3"/><text x="96" y="166" ${CV} font-size="40" fill="#2257c9">4</text>
  <text x="152" y="146" ${CV} font-size="40" fill="#2257c9">= 5</text><text x="250" y="146" ${CV} font-size="42" fill="#1e9e5a">x = 20</text>`),
 steps:EQ8.steps,mount:wbMount(EQ8),
 gen(level){const M=MUL(),D=DIVS(),head=A.tx(T3("Lös ekvationen","Solve the equation","حلّ المعادلة"),400,58,38,"b"),
  chk=(f,y)=>seq([[T3("Kontroll:","Check:","تحقّق:"),"b"],[f,"b"]],400,y,36);
  if(level===0){const a=rint(2,8),minus=Math.random()<.4,b=rint(1,15),x=minus?rint(b+1,b+20):rint(1,20),s=minus?"−":"+",inner=minus?x-b:x+b,c=a*inner;
   const sol=[...ann(`${D} ${a}`,170),...eqn(`x ${s} ${b}`,inner,255,54),...ann(`${minus?"+":"−"} ${b}`,255),...eqn("x",x,340,56,"g"),A.loop(410,321,96,40,"g"),
    ...chk(`${a}(${x} ${s} ${b}) = ${a} ${M} ${inner} = ${fmt(c)} ✓`,440)];
   return{kind:"num",ans:x,show:String(x),hk:2,q:[A.wipe(),head,...eqn(`${a}(x ${s} ${b})`,fmt(c),170,60)],sol}}
  if(level===1){
   if(Math.random()<.5){let a,c,b,x,s,d;do{a=rint(2,7);c=rint(1,a-1);b=rint(1,9);x=rint(1,12);s=Math.random()<.5?1:-1;d=a*(x+s*b)-c*x}while(d<1||d>99||x+s*b<=0);
    const k=a-c,R0=d-s*a*b,cx=T1(c,"x"),lhs=`${a}(x ${sgn(s)} ${b})`,y=[150,226,302,378,454];
    const sol=[...eqn(`${a}x ${sgn(s)} ${a*b}`,`${cx} + ${d}`,y[1],46),...ann(`− ${cx}`,y[1]),...eqn(`${T1(k,"x")} ${sgn(s)} ${a*b}`,d,y[2],46),...ann(`${s>0?"−":"+"} ${a*b}`,y[2])];
    if(k>1)sol.push(...eqn(`${k}x`,R0,y[3],46),...ann(`${D} ${k}`,y[3]),...eqn("x",x,y[4],50,"g"),A.loop(408,y[4]-17,90,34,"g"));
    else sol.push(...eqn("x",x,y[3],50,"g"),A.loop(408,y[3]-17,90,34,"g"));
    return{kind:"num",ans:x,show:String(x),hk:3,q:[A.wipe(),head,...eqn(lhs,`${cx} + ${d}`,y[0],52)],sol}}
   const a=rint(2,9),b=rint(1,20),k=rint(1,12),x=a*k,frm=Math.random()<.5;
   if(frm){const c=k+b;
    const sol=[...ann(`− ${b}`,186),...frow([["f","x",a],["t",`= ${c-b}`]],400,270,54),...ann(`${M} ${a}`,286),...eqn("x",`${c-b} ${M} ${a}`,382,48),...eqn("x",x,456,52,"g"),A.loop(410,438,90,36,"g")];
    return{kind:"num",ans:x,show:String(x),hk:2,q:[A.wipe(),head,...frow([["f","x",a],["t",`+ ${b} = ${c}`]],400,170,60)],sol}}
   const k2=rint(Math.ceil((b+1)/a),Math.max(12,Math.ceil((b+1)/a)+4)),x2=a*k2-b;
   const sol=[...ann(`${M} ${a}`,186),...eqn(`x + ${b}`,`${k2} ${M} ${a}`,282,50),...ann(`− ${b}`,282),...eqn("x",`${a*k2} − ${b}`,362,50),...eqn("x",x2,442,54,"g"),A.loop(410,424,96,38,"g")];
   return{kind:"num",ans:x2,show:String(x2),hk:2,q:[A.wipe(),head,...frow([["f",`x + ${b}`,a],["t",`= ${k2}`]],400,170,60)],sol}}
  const pr=pick([[2,3],[3,4],[2,5],[4,5],[3,5],[4,6],[2,6],[3,6],[2,4]]),minus=Math.random()<.35,[a,b]=pr,gcd=(u,v)=>v?gcd(v,u%v):u,m=a*b/gcd(a,b),pa=m/a,pb=m/b,kk=minus?pa-pb:pa+pb,t=rint(1,minus?8:5),x=m*t,c=minus?x/a-x/b:x/a+x/b,s=minus?"−":"+";
  const sol=[...ann(`${M} ${m}`,186),...eqn(`${T1(pa,"x")} ${s} ${T1(pb,"x")}`,fmt(m*c),280,48),...(kk>1?[...eqn(`${kk}x`,fmt(m*c),360,48),...ann(`${D} ${kk}`,360),...eqn("x",x,446,54,"g"),A.loop(410,428,96,38,"g")]
   :[...eqn("x",fmt(m*c),370,54,"g"),A.loop(410,352,96,38,"g")])];
  return{kind:"num",ans:x,show:String(x),hk:2,q:[A.wipe(),head,...frow([["f","x",a],["t",s],["f","x",b],["t",`= ${c}`]],400,170,58)],sol}}
});

/* =================== HELP and HINTS =================== */
Object.assign(HELPX,{
 pct8:[{say:t3("Tänk på 100 kr. Höjs priset med 20 % blir det 120 kr, alltså 1,20 gånger så mycket. Sänks det med 20 % blir det 80 kr, alltså 0,80 gånger så mycket.",
   "Think of 100 kr. If the price goes up by 20%, it becomes 120 kr, which is 1.20 times as much. If it goes down by 20%, it becomes 80 kr, which is 0.80 times as much.",
   "فكّر في 100 كرونة. إذا ارتفع السعر 20% يصبح 120 كرونة، أي 1.20 ضعفًا. وإذا انخفض 20% يصبح 80 كرونة، أي 0.80 منه."),
  draw:()=>{const note=(x,y,c)=>R.rect(x,y,180,86,.3)+R.circ(x+90,y+43,24);return[A.p(note(80,206,"k"),"k",4.5),A.tx("100 kr",170,322,40),
   A.p(note(540,46,"g"),"g",4.5),A.tx("120 kr",630,162,40,"g"),A.p(note(540,346,"r"),"r",4.5),A.tx("80 kr",630,462,40,"r"),
   A.arrow(280,226,520,104,"g",-20),A.arrow(280,290,520,400,"r",20),qt(`+${pc(20)}`,360,128,32,"g"),qt(`${MUL()} ${dfmt(1.2,2)}`,450,200,34,"g"),
   qt(`−${pc(20)}`,360,412,32,"r"),qt(`${MUL()} ${dfmt(.8,2)}`,460,320,34,"r")]}}],
 interest8:[{say:t3("Ränta är som hyra för pengar. Sparar du på banken betalar banken hyra till dig. Lånar du av banken betalar du hyra till banken.",
   "Interest is like rent for money. If you save in the bank, the bank pays rent to you. If you borrow from the bank, you pay rent to the bank.",
   "الفائدة مثل أجرة للمال. إذا ادّخرت في البنك يدفع لك البنك الأجرة. وإذا اقترضت من البنك تدفع أنت الأجرة للبنك."),
  draw:()=>{const row=(y,save)=>[A.tx(save?T3("Du sparar","You save","أنت تدّخر"):T3("Du lånar","You borrow","أنت تقترض"),400,y-72,36,"b"),A.p(person(130,y),"k",4),A.p(bank(660,y+8,.62),"k",4),
    save?A.arrow(200,y-22,570,y-22,"k"):A.arrow(570,y-22,200,y-22,"k"),qt(`${fmt(1000)} kr`,385,y-34,30),
    save?A.arrow(570,y+26,200,y+26,"g"):A.arrow(200,y+26,570,y+26,"r"),qt(`+ ${T3("ränta","interest","فائدة")}`,385,y+62,30,save?"g":"r")];
   return[...row(140,true),...row(380,false)]}}],
 paren8:[{say:t3("Fyra kompisar beställer var sin burgare och läsk. Det blir 4 burgare och 4 läsk. Parentesen säger: allt inuti finns 4 gånger.",
   "Four friends each order a burger and a drink. That makes 4 burgers and 4 drinks. The brackets say: everything inside appears 4 times.",
   "أربعة أصدقاء يطلب كل منهم برغر ومشروبًا. يصبح المجموع 4 برغر و4 مشروبات. القوس يعني أن كل ما بداخله يتكرر 4 مرات."),
  draw:()=>{const X=[130,300,470,640],burger=(x,y)=>`M${x-34},${y}Q${x},${y-46} ${x+34},${y}Z`+R.line(x-36,y+10,x+36,y+10,.3)+`M${x-34},${y+20}h68q0,16 -16,16h-36q-16,0 -16,-16Z`,
    cup=(x,y)=>`M${x-18},${y-30}L${x+18},${y-30}L${x+13},${y+36}L${x-13},${y+36}Z`+R.line(x+4,y-30,x+14,y-58,.2);
   return[A.p(X.map(x=>burger(x-34,150)).join(""),"o",4),A.p(X.map(x=>cup(x+42,150)).join(""),"b",4),A.p(X.map(x=>R.line(x-82,196,x+76,196,.3)).join(""),"k",4),
    A.tx(`4(${T3("b","b","b")} + ${T3("l","d","d")})`,400,300,58),A.tx(`= 4${T3("b","b","b")} + 4${T3("l","d","d")}`,400,380,58,"g"),
    A.tx(T3("b = burgare, l = läsk","b = burger, d = drink","b = برغر، d = مشروب"),400,452,32,"b")]}}],
 eq8:[{say:t3("Tänk baklänges! Ta x, lägg till 40 och gånga med 3, så får du 1 020. Gå tillbaka: dela med 3 och dra bort 40. Då är x = 300.",
   "Think backwards! Take x, add 40 and multiply by 3, and you get 1,020. Go back: divide by 3 and take away 40. Then x = 300.",
   `فكّر بالعكس! خذ x، أضف 40 ثم اضرب في 3 فتحصل على 1020. ارجع: اقسم على 3 ثم اطرح 40، فيكون ${LRI("x = 300")}.`),
  draw:()=>{const X=[110,400,690],box=(x,y,s,c)=>[A.p(R.rect(x-70,y-42,140,64,.3),c,4),A.tx(s,x,y+4,40,c)];
   return[A.tx(T3("framåt","forwards","إلى الأمام"),400,60,34,"b"),...box(X[0],140,"x","k"),...box(X[1],140,"x + 40","k"),...box(X[2],140,fmt(1020),"k"),
    A.arrow(186,128,320,128,"b"),qt("+ 40",253,104,30,"b"),A.arrow(476,128,610,128,"b"),qt(`${MUL()} 3`,543,104,30,"b"),
    A.tx(T3("baklänges","backwards","بالعكس"),400,280,34,"r"),...box(X[2],360,fmt(1020),"k"),...box(X[1],360,"340","k"),...box(X[0],360,"300","g"),
    A.arrow(610,348,476,348,"r"),qt(`${DIVS()} 3`,543,324,30,"r"),A.arrow(320,348,186,348,"r"),qt("− 40",253,324,30,"r"),A.tx("x = 300",110,456,40,"g")]}}]
});
Object.assign(HINTSX,{
 pct8:[{say:t3("Utgå från 100 %. Lägg till ökningen eller dra bort minskningen. Skriv sedan procenten som decimaltal.","Start from 100%. Add the increase or take away the decrease. Then write the percent as a decimal.","ابدأ من 100%. أضف الزيادة أو اطرح النقصان، ثم اكتب النسبة المئوية عددًا عشريًا."),cut:g=>g.sol.slice(0,g.hk)},
  {say:t3("Gör om förändringen till en förändringsfaktor. Multiplicera sedan det gamla priset med faktorn.","Turn the change into a change factor. Then multiply the old price by the factor.","حوّل التغيّر إلى معامل تغيّر، ثم اضرب السعر القديم في المعامل."),cut:g=>g.sol.slice(0,g.hk)},
  {say:t3("Procentenheter är skillnaden mellan procentsatserna. Procent räknar du med förändringen delat med det gamla värdet.","Percentage points are the difference between the two percentages. For percent, divide the change by the old value.","النقاط المئوية هي الفرق بين النسبتين. أما النسبة المئوية فتحسبها بقسمة التغيّر على القيمة القديمة."),cut:g=>g.sol.slice(0,g.hk)}],
 interest8:[{say:t3("Skriv räntan som decimaltal, till exempel 4 % = 0,04. Multiplicera sedan med beloppet.","Write the interest rate as a decimal, for example 4% = 0.04. Then multiply by the amount.","اكتب سعر الفائدة عددًا عشريًا، مثلًا 4% = 0.04، ثم اضربه في المبلغ."),cut:g=>g.sol.slice(0,g.hk)},
  {say:t3("Varje år multiplicerar du med förändringsfaktorn. Räkna år 1 först och sedan år 2 på det nya beloppet.","Every year you multiply by the change factor. Work out year 1 first, then year 2 on the new amount.","في كل سنة تضرب في معامل التغيّر. احسب السنة الأولى أولًا، ثم السنة الثانية على المبلغ الجديد."),cut:g=>g.sol.slice(0,g.hk)},
  {say:t3("Multiplicera med faktorn en gång för varje år. Frågas det efter ökningen, dra bort startbeloppet på slutet.","Multiply by the factor once for every year. If the question asks for the growth, subtract the starting amount at the end.","اضرب في المعامل مرة لكل سنة. وإذا كان السؤال عن الزيادة فاطرح المبلغ الأولي في النهاية."),cut:g=>g.sol.slice(0,g.hk)}],
 paren8:[{say:t3("Talet framför parentesen ska multipliceras med båda termerna inuti.","The number in front of the brackets multiplies both terms inside.","العدد الذي أمام القوس يُضرب في الحدّين اللذين داخله."),cut:g=>g.sol.slice(0,g.hk)},
  {say:t3("Multiplicera in i båda parenteserna, och se upp med minus framför en parentes. Samla sedan x-termer för sig och tal för sig.","Expand both brackets, and watch out for a minus in front of a bracket. Then collect the x terms and the numbers separately.","فكّ القوسين وانتبه إلى السالب أمام القوس، ثم اجمع حدود x معًا والأعداد معًا."),cut:g=>g.sol.slice(0,g.hk)},
  {say:t3("Vilket är det största tal, kanske med x, som går jämnt upp i båda termerna? Kontrollera ditt svar genom att multiplicera in.","What is the biggest number, maybe with x, that divides both terms? Check your answer by expanding.","ما أكبر عدد، ربما مع x، يقسم الحدّين معًا؟ تحقّق من جوابك بفكّ القوس."),cut:g=>g.sol.slice(0,g.hk)}],
 eq8:[{say:t3("Dela båda sidor med talet framför parentesen. Lös sedan den enkla ekvationen som blir kvar.","Divide both sides by the number in front of the brackets. Then solve the simple equation that is left.","اقسم الطرفين على العدد الذي أمام القوس، ثم حلّ المعادلة البسيطة التي تبقى."),cut:g=>g.sol.slice(0,g.hk)},
  {say:t3("Multiplicera in parentesen, eller bli av med bråket genom att gånga båda sidor med nämnaren. Gör alltid samma sak på båda sidor.","Expand the brackets, or get rid of the fraction by multiplying both sides by the denominator. Always do the same to both sides.","فكّ القوس، أو تخلّص من الكسر بضرب الطرفين في المقام. افعل دائمًا الشيء نفسه في الطرفين."),cut:g=>g.sol.slice(0,g.hk)},
  {say:t3("Gånga alla termer med minsta gemensamma nämnaren, så försvinner bråken.","Multiply every term by the lowest common denominator, and the fractions disappear.","اضرب كل الحدود في المقام المشترك الأصغر فتختفي الكسور."),cut:g=>g.sol.slice(0,g.hk)}]
});
}
