import {A,DIVS,HELPX,HINTSX,L,LESSONS,MUL,R,dfmt,dots,f1,fmt,gridRect,lang,pick,rint,shuffle,t3,wbMount} from "../legacy/core.js";
{
/* =====================================================================
   YEAR 9 (y9a): squaring rules, quadratic equations, formulas,
   simultaneous equations
   ===================================================================== */
const LRI=s=>"⁦"+s+"⁩";                       /* keeps formulas left-to-right inside Arabic speech */
const ng=n=>n<0?"−"+(-n):String(n);                      /* real minus sign */
const pm=n=>n<0?`− ${-n}`:`+ ${n}`;                      /* "+ 3" or "− 3" */
const par=n=>n<0?`(${ng(n)})`:String(n);                 /* brackets round a negative number */
const lin=(k,m,v="x")=>{let s=k===0?"":k===1?v:k===-1?"−"+v:ng(k)+v;if(m!==0)s=s?`${s} ${pm(m)}`:ng(m);return s||"0"};
const txe=(s,x,y,size,c="k",anc)=>Object.assign(A.tx(s,x,y,size,c,anc),{dur:170});
/* rough width of handwritten maths text, used to place pieces next to each other */
const W=(s,size)=>[...String(s)].reduce((a,ch)=>a+(ch===" "?.26:"()".includes(ch)?.3:/[0-9]/.test(ch)?.48:"+−=·×÷±/≠".includes(ch)?.52:"²₁₂".includes(ch)?.3:.46),0)*size;
const ansBox=(s,y,size=46,X=400,c="g")=>{const w=W(s,size)+50;return[A.hl(X-w/2,y-size*.92,w,size*1.24),A.tx(s,X,y,size,c)]};
const eqR=(l,r,y,size=46,c="k",X=400)=>[A.tx(l,X-12,y,size,c,"end"),A.tx(`= ${r}`,X,y,size,c,"start")];
const note=(op,y,x=630,size=36)=>[A.p(R.line(x-16,y-34,x-16,y+6,.2),"r",3.5),A.tx(op,x,y,size,"r","start")];
/* pieces of maths written side by side; returns the centre of every piece */
const row=(toks,cx,y,size,gap=.14)=>{const ws=toks.map(t=>W(t.s??t,size)),tot=ws.reduce((a,b)=>a+b,0)+gap*size*(toks.length-1);let x=cx-tot/2;const o=[],pos=[];
 toks.forEach((t,i)=>{o.push(A.tx(t.s??t,x+ws[i]/2,y,size,t.c||"k"));pos.push(x+ws[i]/2);x+=ws[i]+gap*size});return{o,pos,w:tot}};
/* "pre √ins" with a drawn root sign and bar */
const rad=(pre,ins,cx,y,size,c="k")=>{const w1=W(pre,size),w2=W(ins,size),sw=size*.5,tot=w1+sw+w2+size*.2;const x=cx-tot/2,xs=x+w1+size*.04,top=y-size*.8,xe=xs+sw+w2+size*.14;
 return[A.tx(pre,xs-size*.04,y,size,c,"end"),A.p(`M${f1(xs)},${f1(y-size*.3)}L${f1(xs+sw*.25)},${f1(y-size*.38)}L${f1(xs+sw*.55)},${f1(y+size*.06)}L${f1(xs+sw*.9)},${f1(top)}H${f1(xe)}`,c,3.5),A.tx(ins,xs+sw+size*.06,y,size,c,"start")]};
const brace=(x,y1,y2,c="k")=>{const m=(y1+y2)/2;return A.p(`M${x+14},${y1}Q${x},${y1} ${x},${y1+14}V${m-12}Q${x},${m} ${x-12},${m}Q${x},${m} ${x},${m+12}V${y2-14}Q${x},${y2} ${x+14},${y2}`,c,3.5)};
const ICO=b=>`<svg viewBox="0 0 320 180"><rect width="320" height="180" fill="#fff"/>${b}</svg>`;
const CV=`font-family="Caveat,cursive" font-weight="700" text-anchor="middle" direction="ltr"`;
const SOLVE=t3("Lös ekvationen","Solve the equation","حلّ المعادلة");
const X12=[t3("x₁","x₁","x₁"),t3("x₂","x₂","x₂")];

/* ---------------------------------------------------------------
   1. quad9: squaring rules and the difference of two squares
   --------------------------------------------------------------- */
const sqArea=(X0,Y0,P,Q,a,b,ca="b",cb="o")=>[A.p(R.rect(X0,Y0,P+Q,P+Q,.4)+R.line(X0+P,Y0,X0+P,Y0+P+Q,.3)+R.line(X0,Y0+P,X0+P+Q,Y0+P,.3),"k",4.5),
 txe(a,X0+P/2,Y0-16,42,ca),txe(b,X0+P+Q/2,Y0-16,40,cb),txe(a,X0-28,Y0+P/2+12,42,ca),txe(b,X0-28,Y0+P+Q/2+12,40,cb)];
const sqFill=(X0,Y0,P,Q,t,s1=48,s2=36)=>[[X0,Y0,P,P,"b"],[X0+P,Y0,Q,P,"o"],[X0,Y0+P,P,Q,"o"],[X0+P,Y0+P,Q,Q,"g"]]
 .flatMap(([x,y,w,h,c],i)=>[A.hatch(`M${x},${y}h${w}v${h}h${-w}Z`,c),A.tx(t[i],x+w/2,y+h/2+(i?s2:s1)*.33,i?s2:s1,c)]);
/* (a op b)(c op d) with arcs from every term to every term */
function foil(toks,ia,ib,ja,jb,y,size){const r=row(toks,400,y,size,.12),P=r.pos,t=y-size*.78,u=y+12;
 return[...r.o,A.arrow(P[ia],t,P[ja],t,"b",-34),A.arrow(P[ia]-4,t-4,P[jb],t,"o",-62),A.arrow(P[ib],u,P[ja],u,"o",34),A.arrow(P[ib]+4,u+4,P[jb],u,"g",62)]}
const QUAD={steps:[
 {say:t3("En kvadratisk gräsmatta har sidan x meter. Vi gör den 3 meter längre åt båda hållen. Den nya arean är (x + 3)².",
   "A square lawn has sides of x metres. We make it 3 metres longer in both directions. The new area is (x + 3)².",
   `مرجة مربعة طول ضلعها x متر. نزيد طولها 3 أمتار في الاتجاهين، فتصبح مساحتها الجديدة ${LRI("(x + 3)²")}.`),
  draw:()=>[A.wipe(),...sqArea(110,105,200,90,"x","3"),A.tx(L(t3("Ny area","New area","المساحة الجديدة")),610,160,36,"b"),A.tx("(x + 3)²",610,245,66)]},
 {say:t3("Arean består av fyra delar: den gamla kvadraten x², två rektanglar på 3x och ett hörn på 3 · 3 = 9. Tillsammans blir det x² + 6x + 9.",
   "The area is made of four parts: the old square x², two rectangles of 3x and a corner of 3 × 3 = 9. Together that makes x² + 6x + 9.",
   `تتكوّن المساحة من أربعة أجزاء: المربع القديم ${LRI("x²")}، ومستطيلان مساحة كلٍّ منهما ${LRI("3x")}، وركن مساحته ${LRI("3 × 3 = 9")}. والمجموع ${LRI("x² + 6x + 9")}.`),
  draw:()=>[...sqFill(110,105,200,90,["x²","3x","3x","9"]),A.tx("x² + 3x + 3x + 9",610,330,40),...ansBox("= x² + 6x + 9",415,46,610)]},
 {say:t3("Det gäller alltid: (a + b)² = a² + 2ab + b². Glöm inte mittentermen! (x + 3)² är inte x² + 9. Testa med x = 2: 25 är inte 13.",
   "It always works: (a + b)² = a² + 2ab + b². Don't forget the middle term! (x + 3)² is not x² + 9. Test with x = 2: 25 is not 13.",
   `القاعدة صحيحة دائمًا: ${LRI("(a + b)² = a² + 2ab + b²")}. لا تنسَ الحدّ الأوسط! ${LRI("(x + 3)²")} لا يساوي ${LRI("x² + 9")}. جرّب ${LRI("x = 2")}: الناتج 25 وليس 13.`),
  draw:()=>[A.wipe(),A.tx(L(t3("Första kvadreringsregeln","The first squaring rule","قاعدة مربع المجموع")),400,56,38,"b"),A.tx("(a + b)² = a² + 2ab + b²",400,140,54),
   ...eqR("(x + 3)²",`x² + 2 ${MUL()} 3 ${MUL()} x + 3²`,230,40,"k",310),A.tx("= x² + 6x + 9",310,295,40,"g","start"),
   A.tx("(x + 3)² ≠ x² + 9",400,385,46,"r"),A.tx("(2 + 3)² = 25",235,455,34,"o"),A.tx("≠",400,455,40,"r"),A.tx("2² + 3² = 13",565,455,34,"o")]},
 {say:t3("Andra regeln: (x − 4)² = (x − 4)(x − 4). Multiplicera varje term med varje term. Minus gånger minus blir plus, så vi får x² − 8x + 16.",
   "The second rule: (x − 4)² = (x − 4)(x − 4). Multiply every term by every term. Minus times minus is plus, so we get x² − 8x + 16.",
   `القاعدة الثانية: ${LRI("(x − 4)² = (x − 4)(x − 4)")}. نضرب كل حدّ في كل حدّ. السالب في السالب يعطي موجبًا، فنحصل على ${LRI("x² − 8x + 16")}.`),
  draw:()=>{const r=row([{s:"x²",c:"b"},{s:"− 4x",c:"o"},{s:"− 4x",c:"o"},{s:"+ 16",c:"g"}],400,295,48,.75);
   return[A.wipe(),A.tx(L(t3("Andra kvadreringsregeln","The second squaring rule","قاعدة مربع الفرق")),400,52,36,"b"),
    ...foil(["(x − 4)²","=","(","x","−","4",")","(","x","−","4",")"],3,5,8,10,175,50),...r.o,A.loop((r.pos[1]+r.pos[2])/2,280,(r.pos[2]-r.pos[1])/2+62,38,"o"),
    ...ansBox("(x − 4)² = x² − 8x + 16",392,44),A.tx("(a − b)² = a² − 2ab + b²",400,466,34,"b")]}},
 {say:t3("Konjugatregeln: (x + 5)(x − 5). Mittentermerna −5x och +5x tar ut varandra. Kvar blir x² − 25.",
   "The difference of two squares: (x + 5)(x − 5). The middle terms −5x and +5x cancel out. What is left is x² − 25.",
   `قاعدة الفرق بين مربعين: ${LRI("(x + 5)(x − 5)")}. الحدّان الأوسطان ${LRI("−5x")} و${LRI("+5x")} يلغي أحدهما الآخر، فيبقى ${LRI("x² − 25")}.`),
  draw:()=>{const r=row([{s:"x²",c:"b"},{s:"− 5x",c:"o"},{s:"+ 5x",c:"o"},{s:"− 25",c:"g"}],400,295,48,.5),m=(r.pos[1]+r.pos[2])/2;
   return[A.wipe(),A.tx(L(t3("Konjugatregeln","The difference of two squares","قاعدة الفرق بين مربعين")),400,52,36,"b"),
    ...foil(["(","x","+","5",")","(","x","−","5",")"],1,3,6,8,175,50),...r.o,A.p(R.line(r.pos[1]-48,282,r.pos[2]+48,282,.3),"r",4.5),A.tx("= 0",m,340,32,"r"),
    ...ansBox("(x + 5)(x − 5) = x² − 25",412,44),A.tx("(a + b)(a − b) = a² − b²",400,476,34,"b")]}},
 {say:t3("Reglerna hjälper dig att räkna i huvudet. 21 · 19 = (20 + 1)(20 − 1) = 400 − 1 = 399. Och 31² = 900 + 60 + 1 = 961.",
   "The rules help with mental maths. 21 × 19 = (20 + 1)(20 − 1) = 400 − 1 = 399. And 31² = 900 + 60 + 1 = 961.",
   `تساعدك القواعد على الحساب الذهني: ${LRI("21 × 19 = (20 + 1)(20 − 1) = 400 − 1 = 399")}. وكذلك ${LRI("31² = 900 + 60 + 1 = 961")}.`),
  draw:()=>[A.wipe(),A.tx(L(t3("Räkna smart i huvudet","Clever mental maths","احسب بذكاء في ذهنك")),400,56,38,"b"),A.p(R.dashed(400,96,400,470),"#9aa8c4",3),
   A.tx(`21 ${MUL()} 19`,205,140,50),A.tx("= (20 + 1)(20 − 1)",205,212,36),A.tx("= 20² − 1²",205,280,36),A.tx("= 400 − 1",205,348,36),...ansBox("= 399",440,48,205),
   A.tx("31²",595,140,50),A.tx("= (30 + 1)²",595,212,36),A.tx(`= 30² + 2 ${MUL()} 30 + 1²`,595,280,34),A.tx("= 900 + 60 + 1",595,348,36),...ansBox("= 961",440,48,595)]}
]};
LESSONS.push({id:"quad9",subject:"math",grades:"9",kind:"wb",
 title:t3("Kvadreringsreglerna och konjugatregeln","Squaring rules and the difference of two squares","قاعدتا التربيع والفرق بين مربعين"),
 icon:ICO(`<rect x="40" y="28" width="86" height="86" fill="#2257c9" fill-opacity=".12"/><rect x="126" y="28" width="36" height="86" fill="#e07b00" fill-opacity=".15"/><rect x="40" y="114" width="86" height="36" fill="#e07b00" fill-opacity=".15"/><rect x="126" y="114" width="36" height="36" fill="#1e9e5a" fill-opacity=".18"/><path d="M40 28H162V150H40ZM126 28V150M40 114H162" stroke="#1d2433" stroke-width="3" fill="none"/><text x="83" y="82" ${CV} font-size="32" fill="#2257c9">x²</text><text x="144" y="78" ${CV} font-size="20" fill="#e07b00">3x</text><text x="83" y="140" ${CV} font-size="20" fill="#e07b00">3x</text><text x="144" y="140" ${CV} font-size="20" fill="#1e9e5a">9</text><text x="245" y="78" ${CV} font-size="36" fill="#1d2433">(x + 3)²</text><text x="245" y="126" ${CV} font-size="26" fill="#1e9e5a">x² + 6x + 9</text>`),
 steps:QUAD.steps,mount:wbMount(QUAD),
 gen(level){const M=MUL();
  /* level 1, word problem: a square lawn made b metres longer in both directions, (x + b)² without brackets */
  if(level===1&&Math.random()<.3){const b=rint(2,6),P=150,Q=b*20,X0=110,Y0=180;
   return{kind:"pair",ans:[2*b,b*b],...(lang==="ar"?{sep:"،",labels:[t3("","","معامل x"),t3("","","العدد الثابت")]}:{sep:"x +"}),show:lang==="ar"?LRI(`x² + ${2*b}x + ${b*b}`):`x² + ${2*b}x + ${b*b}`,hc:2,
    q:[A.wipe(),A.tx(L(t3(`En kvadratisk gräsmatta har sidan x m. Den görs ${b} m längre åt båda hållen.`,`A square lawn has side x m. It is made ${b} m longer in both directions.`,`مرجة عشب مربعة طول ضلعها x م. نزيد طولها ${b} م في الاتجاهين.`)),400,50,28),
     A.tx(L(t3("Skriv den nya arean utan parentes: x² + □x + □","Write the new area without brackets: x² + □x + □","اكتب المساحة الجديدة دون أقواس: x² + □x + □")),400,96,30,"b"),
     ...sqArea(X0,Y0,P,Q,"x",String(b),"b","o"),A.tx(`(x + ${b})²`,600,260,56)],
    sol:[...sqFill(X0,Y0,P,Q,["x²",`${b}x`,`${b}x`,String(b*b)],44,30),A.tx(`= x² + ${b}x + ${b}x + ${b*b}`,600,340,36),...ansBox(`= x² + ${2*b}x + ${b*b}`,430,42,600)]}}
  if(level===0){const b=rint(2,12),mid=Math.random()<.6,ans=mid?2*b:b*b;
   const eq=mid?`(x + ${b})² = x² + □x + ${b*b}`:`(x + ${b})² = x² + ${2*b}x + □`;
   return{kind:"num",ans,show:String(ans),hc:1,
    q:[A.wipe(),A.tx(L(pick([t3("Vilket tal ska stå i rutan?","Which number goes in the box?","ما العدد الذي يوضع في المربع؟"),t3("Utveckla med kvadreringsregeln. Vilket tal fattas?","Expand with the squaring rule. Which number is missing?","افكّ باستخدام قاعدة التربيع. ما العدد الناقص؟")])),400,64,38),A.tx(eq,400,180,54)],
    sol:[A.tx("(a + b)² = a² + 2ab + b²",400,266,36,"b"),A.tx(`(x + ${b})² = x² + 2 ${M} ${b} ${M} x + ${b}²`,400,345,40),...ansBox(`(x + ${b})² = x² + ${2*b}x + ${b*b}`,440,44)]}}
  if(level===1){const b=rint(2,9),t=rint(0,2),B=b*b,b2=2*b;
   const E=[`(x − ${b})²`,`(x + ${b})(x − ${b})`,`(x + ${b})²`][t];
   const right=[`x² − ${b2}x + ${B}`,`x² − ${B}`,`x² + ${b2}x + ${B}`][t];
   const wrong=[[`x² − ${B}`,`x² + ${B}`,`x² − ${b}x + ${B}`],[`x² + ${B}`,`x² − ${b2}x + ${B}`,`x² − ${b2}x − ${B}`],[`x² + ${B}`,`x² + ${b}x + ${B}`,`x² + ${b2}x`]][t];
   const rule=["(a − b)² = a² − 2ab + b²","(a + b)(a − b) = a² − b²","(a + b)² = a² + 2ab + b²"][t];
   const prod=[`x² − ${b}x − ${b}x + ${B}`,`x² − ${b}x + ${b}x − ${B}`,`x² + ${b}x + ${b}x + ${B}`][t];
   const opts=shuffle([right,...wrong]),ans=opts.indexOf(right);
   return{kind:"choice",opts,ans,show:right,hc:1,
    q:[A.wipe(),A.tx(L(pick([t3("Vilket uttryck är lika med","Which expression is equal to","أيّ مقدار يساوي"),t3("Förenkla. Vilket uttryck är rätt?","Simplify. Which expression is right?","بسّط. أيّ مقدار صحيح؟"),t3("Utveckla med kvadreringsregeln eller konjugatregeln","Expand with the squaring rule or the difference of squares","افكّ باستخدام قاعدة التربيع أو الفرق بين مربعين")])),400,64,t?38:34),A.tx(E,400,190,72)],
    sol:[A.tx(rule,400,280,36,"b"),A.tx(`${E} = ${prod}`,400,358,40),...ansBox(`${E} = ${right}`,445,44)]}}
  const t=rint(0,2);
  if(t===0){const m=rint(2,9)*10,d=rint(1,4),ans=m*m-d*d;
   return{kind:"num",ans,show:fmt(ans),hc:1,q:[A.wipe(),A.tx(L(pick([t3("Räkna i huvudet","Work it out in your head","احسب في ذهنك"),t3("Beräkna utan räknare","Calculate without a calculator","احسب دون آلة حاسبة")])),400,64,38),A.tx(`${m+d} ${M} ${m-d}`,400,190,72)],
    sol:[A.tx(`= (${m} + ${d})(${m} − ${d})`,400,280,42),A.tx(`= ${m}² − ${d}² = ${fmt(m*m)} − ${d*d}`,400,358,42),...ansBox(`= ${fmt(ans)}`,445,48)]}}
  if(t===1){const m=rint(2,9)*10,d=pick([-2,-1,1,2]),n=m+d,ans=n*n;
   return{kind:"num",ans,show:fmt(ans),hc:1,q:[A.wipe(),A.tx(L(pick([t3("Räkna i huvudet","Work it out in your head","احسب في ذهنك"),t3("Beräkna utan räknare","Calculate without a calculator","احسب دون آلة حاسبة")])),400,64,38),A.tx(`${n}²`,400,190,72)],
    sol:[A.tx(`= (${m} ${pm(d)})²`,400,280,42),A.tx(`= ${fmt(m*m)} ${pm(2*m*d)} + ${d*d}`,400,358,42),...ansBox(`= ${fmt(ans)}`,445,48)]}}
  const a=rint(2,5),b=rint(1,7),ans=2*a*b;
  return{kind:"num",ans,show:String(ans),hc:1,
   q:[A.wipe(),A.tx(L(pick([t3("Vilket tal ska stå i rutan?","Which number goes in the box?","ما العدد الذي يوضع في المربع؟"),t3("Utveckla med kvadreringsregeln. Vilket tal fattas?","Expand with the squaring rule. Which number is missing?","افكّ باستخدام قاعدة التربيع. ما العدد الناقص؟")])),400,64,38),A.tx(`(${a}x + ${b})² = ${a*a}x² + □x + ${b*b}`,400,180,52)],
   sol:[A.tx("(a + b)² = a² + 2ab + b²",400,266,36,"b"),A.tx(`2 ${M} ${a}x ${M} ${b} = ${ans}x`,400,345,42),...ansBox(`(${a}x + ${b})² = ${a*a}x² + ${ans}x + ${b*b}`,440,44)]}}
});

/* ---------------------------------------------------------------
   2. qeq9: quadratic equations
   --------------------------------------------------------------- */
const qfac=r=>r===0?"x":r>0?`(x − ${r})`:`(x + ${-r})`;
/* (f1)(f2) = 0 with the two factors centred round x = 400, so the branches below are symmetric */
const facRow=(f1,f2,y,size)=>{const t=[{s:f1,c:"b"},{s:f2,c:"r"},"= 0"],r0=row(t,400,y,size,.1);return row(t,400+400-(r0.pos[0]+r0.pos[1])/2,y,size,.1)};
const qzero=r=>r===0?"x = 0":r>0?`x − ${r} = 0`:`x + ${-r} = 0`;
const QEQ={steps:[
 {say:t3("Ett kvadratiskt dansgolv har arean 49 m². Sidan x gånger sidan x blir 49, alltså x² = 49. Sidan är 7 m, eftersom 7 · 7 = 49.",
   "A square dance floor has an area of 49 m². Side x times side x makes 49, so x² = 49. The side is 7 m, because 7 × 7 = 49.",
   `حلبة رقص مربعة مساحتها 49 م². الضلع x في الضلع x يساوي 49، أي ${LRI("x² = 49")}. طول الضلع 7 م، لأن ${LRI("7 × 7 = 49")}.`),
  draw:()=>[A.wipe(),A.p(R.rect(100,110,260,260,.4),"k",4.5),A.hatch("M100,110h260v260h-260Z","b"),A.tx(L(t3("49 m²","49 m²","49 م²")),230,255,52,"b"),
   txe("x",230,416,46,"o"),txe("x",70,254,46,"o"),A.tx(`x ${MUL()} x = 49`,590,150,46),A.tx("x² = 49",590,230,54),A.tx(`7 ${MUL()} 7 = 49`,590,310,40,"b"),...ansBox("x = 7",410,52,590)]},
 {say:t3("Men x² = 49 har två lösningar, för även (−7) · (−7) = 49. Vi skriver x = ±7. En sida kan inte vara negativ, så golvets sida är 7 m.",
   "But x² = 49 has two solutions, because (−7) × (−7) = 49 too. We write x = ±7. A side can't be negative, so the floor's side is 7 m.",
   `لكن للمعادلة ${LRI("x² = 49")} حلّان، لأن ${LRI("(−7) × (−7) = 49")} أيضًا. نكتب ${LRI("x = ±7")}. ولا يمكن أن يكون طول الضلع سالبًا، لذلك ضلع الحلبة 7 م.`),
  draw:()=>[A.wipe(),A.tx("x² = 49",400,82,56),A.arrow(360,104,250,172,"k"),A.arrow(440,104,550,172,"k"),A.tx("x = 7",240,232,50,"b"),A.tx("x = −7",560,232,50,"r"),
   A.tx(`7 ${MUL()} 7 = 49`,240,300,36,"b"),A.tx(`(−7) ${MUL()} (−7) = 49`,560,300,36,"r"),...ansBox("x = ±√49 = ±7",395,50),
   A.tx(L(t3("Dansgolvet: sidan är 7 m","The dance floor: the side is 7 m","حلبة الرقص: طول الضلع 7 م")),400,465,30,"o")]},
 {say:t3("(x − 3)(x + 5) = 0. Om en produkt är 0 måste någon faktor vara 0. Antingen är x − 3 = 0, då är x = 3. Eller så är x + 5 = 0, då är x = −5. Det kallas nollproduktmetoden.",
   "(x − 3)(x + 5) = 0. If a product is 0, one of the factors must be 0. Either x − 3 = 0, so x = 3. Or x + 5 = 0, so x = −5. This is called the zero product rule.",
   `${LRI("(x − 3)(x + 5) = 0")}. إذا كان حاصل الضرب صفرًا فلا بدّ أن يكون أحد العوامل صفرًا. إمّا ${LRI("x − 3 = 0")} فيكون ${LRI("x = 3")}، وإمّا ${LRI("x + 5 = 0")} فيكون ${LRI("x = −5")}. وتسمّى هذه خاصية الضرب الصفري.`),
  draw:()=>{const r=facRow("(x − 3)","(x + 5)",160,58);
   return[A.wipe(),A.tx(L(t3("Om en produkt är 0, är någon faktor 0","If a product is 0, one of the factors is 0","إذا كان حاصل الضرب صفرًا فأحد العوامل صفر")),400,60,32,"b"),...r.o,
    A.arrow(r.pos[0],184,250,242,"b"),A.arrow(r.pos[1],184,550,242,"r"),A.tx("x − 3 = 0",240,295,46,"b"),A.tx("x + 5 = 0",560,295,46,"r"),
    ...ansBox("x₁ = 3",405,48,240),...ansBox("x₂ = −5",405,48,560)]}},
 {say:t3("En boll sparkas upp i luften. Efter t sekunder är höjden h = 6t − t² meter. Bollen är på marken när h = 0. Bryt ut t: t(6 − t) = 0. Alltså t = 0 när den sparkas och t = 6 när den landar.",
   "A ball is kicked up into the air. After t seconds its height is h = 6t − t² metres. The ball is on the ground when h = 0. Factor out t: t(6 − t) = 0. So t = 0 when it is kicked and t = 6 when it lands.",
   `تُركَل كرة إلى الأعلى. بعد t ثانية يكون ارتفاعها ${LRI("h = 6t − t²")} مترًا. تكون الكرة على الأرض عندما ${LRI("h = 0")}. نُخرج t عاملًا مشتركًا: ${LRI("t(6 − t) = 0")}. إذن ${LRI("t = 0")} لحظة الركل، و${LRI("t = 6")} لحظة الهبوط.`),
  draw:()=>{const X=t=>80+t*50,Y=h=>410-h*28;let d="";for(let i=0;i<=30;i++){const t=i/5;d+=(i?"L":"M")+f1(X(t))+","+f1(Y(6*t-t*t))}
   return[A.wipe(),A.p(R.arrow(X(0),Y(0),X(6)+46,Y(0))+R.arrow(X(0),Y(0),X(0),Y(9)-30),"k",3.5),...[0,1,2,3,4,5,6].map(t=>txe(t,X(t),Y(0)+32,24)),
    txe("t",X(6)+46,Y(0)+32,30,"k"),txe("h",X(0)-26,Y(9)-24,30,"k"),A.p(d,"b",4.5),A.p(R.circ(X(1.2),Y(6*1.2-1.44)-16,14),"o",4),A.hatch(`M${X(1.2)-14},${Y(5.76)-16}a14,14 0 1,0 28,0a14,14 0 1,0 -28,0`,"o"),
    A.tx("h = 6t − t²",600,110,46),A.tx(L(t3("På marken: h = 0","On the ground: h = 0","على الأرض: h = 0")),600,170,30,"b"),A.tx("6t − t² = 0",600,240,44),A.tx("t(6 − t) = 0",600,315,44),
    A.p(dots([[X(0),Y(0)],[X(6),Y(0)]]),"g",20),...ansBox("t = 0",405,44,505),...ansBox("t = 6",405,44,695)]}},
 {say:t3("x² + 6x = 16. Dela 6x i två delar på 3x. Hörnet 3 · 3 = 9 fattas, så lägg till 9 på båda sidor: (x + 3)² = 25. Då är x + 3 = ±5, alltså x = 2 eller x = −8.",
   "x² + 6x = 16. Split 6x into two parts of 3x. The corner 3 × 3 = 9 is missing, so add 9 to both sides: (x + 3)² = 25. Then x + 3 = ±5, so x = 2 or x = −8.",
   `${LRI("x² + 6x = 16")}. نقسم ${LRI("6x")} إلى جزأين كلٌّ منهما ${LRI("3x")}. ينقص الركنُ ${LRI("3 × 3 = 9")}، فنضيف 9 إلى الطرفين: ${LRI("(x + 3)² = 25")}. إذن ${LRI("x + 3 = ±5")}، أي ${LRI("x = 2")} أو ${LRI("x = −8")}.`),
  draw:()=>{const X0=100,Y0=130,P=180,Q=70;return[A.wipe(),
   A.p(`M${X0},${Y0}H${X0+P+Q}V${Y0+P}H${X0+P}V${Y0+P+Q}H${X0}Z`+R.line(X0+P,Y0,X0+P,Y0+P,.3)+R.line(X0,Y0+P,X0+P,Y0+P,.3),"k",4.5),
   A.hatch(`M${X0},${Y0}h${P}v${P}h${-P}Z`,"b"),A.hatch(`M${X0+P},${Y0}h${Q}v${P}h${-Q}Z`,"o"),A.hatch(`M${X0},${Y0+P}h${P}v${Q}h${-P}Z`,"o"),
   A.tx("x²",X0+P/2,Y0+P/2+16,48,"b"),A.tx("3x",X0+P+Q/2,Y0+P/2+11,32,"o"),A.tx("3x",X0+P/2,Y0+P+Q/2+11,32,"o"),
   txe("x",X0+P/2,Y0-16,42,"b"),txe("3",X0+P+Q/2,Y0-16,38,"o"),txe("x",X0-28,Y0+P/2+12,42,"b"),txe("3",X0-28,Y0+P+Q/2+12,38,"o"),
   A.tx("x² + 6x = 16",590,120,42),
   A.p(R.dashed(X0+P,Y0+P+Q,X0+P+Q,Y0+P+Q)+R.dashed(X0+P+Q,Y0+P,X0+P+Q,Y0+P+Q),"g",4),A.hatch(`M${X0+P},${Y0+P}h${Q}v${Q}h${-Q}Z`,"g"),A.tx("9",X0+P+Q/2,Y0+P+Q/2+12,36,"g"),
   A.tx("x² + 6x + 9 = 16 + 9",590,195,40),A.tx("(x + 3)² = 25",590,270,44),A.tx("x + 3 = ±5",590,345,44),
   ...ansBox("x₁ = 2",440,44,500),...ansBox("x₂ = −8",440,44,685)]}},
 {say:t3("pq-formeln gör kvadratkompletteringen åt dig. I x² + 6x − 16 = 0 är p = 6 och q = −16. Formeln ger x = −3 ± 5, alltså x = 2 eller x = −8.",
   "The pq formula completes the square for you. In x² + 6x − 16 = 0, p = 6 and q = −16. The formula gives x = −3 ± 5, so x = 2 or x = −8.",
   `صيغة pq تُكمل المربع نيابةً عنك. في ${LRI("x² + 6x − 16 = 0")} يكون ${LRI("p = 6")} و${LRI("q = −16")}. تعطي الصيغة ${LRI("x = −3 ± 5")}، أي ${LRI("x = 2")} أو ${LRI("x = −8")}.`),
  draw:()=>[A.wipe(),A.tx(L(t3("pq-formeln","The pq formula","صيغة pq")),400,52,36,"b"),A.tx("x² + px + q = 0",400,118,42,"b"),...rad("x = −p/2 ± ","(p/2)² − q",400,196,46,"b"),
   A.tx("x² + 6x − 16 = 0",255,282,40),A.tx("p = 6",515,282,36,"o"),A.tx("q = −16",660,282,36,"o"),
   ...rad("x = −3 ± ","3² + 16",330,362,44),A.tx("= −3 ± 5",510,362,44,"k","start"),
   ...ansBox("x₁ = 2",448,46,300),...ansBox("x₂ = −8",448,46,500)]}
]};
LESSONS.push({id:"qeq9",subject:"math",grades:"9",kind:"wb",
 title:t3("Andragradsekvationer","Quadratic equations","المعادلات التربيعية"),
 icon:ICO(`<path d="M25 100H195" stroke="#1d2433" stroke-width="3"/><path d="M40 25Q110 235 180 25" stroke="#2257c9" stroke-width="4" fill="none"/><circle cx="72.5" cy="100" r="7" fill="#1e9e5a"/><circle cx="147.5" cy="100" r="7" fill="#1e9e5a"/><text x="250" y="72" ${CV} font-size="34" fill="#1d2433">x² = 49</text><text x="250" y="128" ${CV} font-size="34" fill="#1e9e5a">x = ±7</text>`),
 steps:QEQ.steps,mount:wbMount(QEQ),
 gen(level){const D=DIVS(),SV=pick([SOLVE,SOLVE,t3("Lös ekvationen. Ange båda lösningarna.","Solve the equation. Give both solutions.","حلّ المعادلة. اكتب الحلّين كليهما."),t3("Bestäm x","Find x","أوجد x")]);
  /* level 0, word problem: a square dance floor, only the positive root is a length */
  if(level===0&&Math.random()<.25){const r=rint(4,15),a=r*r;
   return{kind:"num",ans:r,show:`${r} m`,hc:3,q:[A.wipe(),A.tx(L(t3(`Ett kvadratiskt dansgolv har arean ${a} m².`,`A square dance floor has an area of ${a} m².`,`أرضية رقص مربعة مساحتها ${a} م².`)),400,70,38),
     A.tx(L(t3("Hur lång är sidan? Ställ upp en ekvation.","How long is a side? Set up an equation.","كم طول الضلع؟ كوّن معادلة.")),400,124,34,"b"),A.hatch("M300,170h200v200h-200Z","o"),A.p(R.rect(300,170,200,200,.3),"k",4),A.tx(`${a} m²`,400,282,40),A.tx("x",400,410,40,"r"),A.tx("x",270,282,40,"r")],
    sol:[...eqR("x²",a,200,44,"k",660),...eqR("x",`±${r}`,270,44,"k",660),A.tx(L(t3("bara + är en längd","only + is a length","الموجب فقط طول")),660,330,26,"r"),...ansBox(`x = ${r} m`,420,44,660)]}}
  /* level 1, word problem: a kicked ball, h = bt − t², break out t */
  if(level===1&&Math.random()<.3){const b=rint(3,8);
   return{kind:"num",ans:b,show:L(t3(`${b} s`,`${b} s`,`${b} ث`)),hc:3,q:[A.wipe(),A.tx(L(t3("En boll sparkas rakt upp. Efter t sekunder är höjden","A ball is kicked straight up. After t seconds its height is","تُركل كرة إلى الأعلى. بعد t ثانية يكون ارتفاعها")),400,60,30),
     A.tx(`h = ${b}t − t²`,400,140,56,"b"),A.tx(L(t3("meter. Efter hur många sekunder landar bollen?","metres. After how many seconds does the ball land?","مترًا. بعد كم ثانية تهبط الكرة؟")),400,206,30)],
    sol:[...eqR(`${b}t − t²`,"0",280,42),...eqR(`t(${b} − t)`,"0",340,42),A.tx(L(t3(`t = 0 (sparken) eller t = ${b}`,`t = 0 (the kick) or t = ${b}`,`t = 0 (الركلة) أو t = ${b}`)),400,398,34,"b"),...ansBox(L(t3(`landar efter ${b} s`,`lands after ${b} s`,`تهبط بعد ${b} ث`)),462,40)]}}
  if(level===0){const r=rint(2,12),a=r*r,t=rint(0,2),q=[A.wipe(),A.tx(L(SV),400,62,38)],sol=[];
   if(t===0){q.push(...eqR("x²",a,180,60));sol.push(...eqR(`x ${MUL()} x`,a,270,50),...eqR("x",`±√${a}`,350,50))}
   else if(t===1){const c=rint(1,40);q.push(...eqR(`x² + ${c}`,a+c,180,58));sol.push(...note(`− ${c}`,180,590),...eqR("x²",a,270,50),...eqR("x",`±√${a}`,350,50))}
   else{const k=rint(2,5),rr=rint(2,9),aa=rr*rr;
    q.push(...eqR(`${k}x²`,k*aa,180,58));sol.push(...note(`${D} ${k}`,180,590),...eqR("x²",aa,270,50));const hc=sol.length;sol.push(...eqR("x",`±√${aa}`,350,50));sol.push(...ansBox(`x = ±${rr}`,445,50));
    return{kind:"pair",ans:[rr,-rr],labels:X12,sep:"",signed:true,check:(u,v)=>(u===rr&&v===-rr)||(u===-rr&&v===rr),show:`x = ±${rr}`,hc,q,sol}}
   const hc=sol.length-2;sol.push(...ansBox(`x = ±${r}`,445,50));
   return{kind:"pair",ans:[r,-r],labels:X12,sep:"",signed:true,check:(u,v)=>(u===r&&v===-r)||(u===-r&&v===r),show:`x = ±${r}`,hc,q,sol}}
  if(level===1){let r1,r2;
   if(Math.random()<.25){r1=0;do{r2=rint(-9,9)}while(!r2)}else{do{r1=rint(-9,9);r2=rint(-9,9)}while(!r1||!r2||r1===r2)}
   const rw=facRow(qfac(r1),qfac(r2),170,60),zf=r1===0;
   const E1=A.tx(qzero(r1),240,300,46,"b"),E2=A.tx(qzero(r2),560,300,46,"r");
   return{kind:"pair",ans:[r1,r2],labels:X12,sep:"",signed:true,check:(u,v)=>(u===r1&&v===r2)||(u===r2&&v===r1),show:`x = ${ng(r1)}, x = ${ng(r2)}`,hc:3,
    q:[A.wipe(),A.tx(L(SV),400,62,38),...rw.o],
    sol:[A.arrow(rw.pos[0],196,250,252,"b"),A.arrow(rw.pos[1],196,550,252,"r"),...(zf?[E2,E1]:[E1,E2]),...ansBox(`x₁ = ${ng(r1)}`,410,48,240),...ansBox(`x₂ = ${ng(r2)}`,410,48,560)]}}
  let r1,r2;do{r1=rint(-9,9);r2=rint(-9,9)}while(r1===r2||!r1||!r2||(r1+r2)%2||r1+r2===0);
  const p=-(r1+r2),q=r1*r2,m=(r1+r2)/2,d=Math.abs(r1-r2)/2,hi=Math.max(r1,r2),lo=Math.min(r1,r2);
  const eq=`x² ${p<0?"− "+(-p):"+ "+p}x ${pm(q)} = 0`;
  const sol=[A.tx(`p = ${ng(p)}`,300,245,40,"o"),A.tx(`q = ${ng(q)}`,500,245,40,"o"),...rad(`x = ${ng(m)} ± `,`${par(p/2)}² ${pm(-q)}`,400,325,44)];
  const hc=sol.length;sol.push(A.tx(`x = ${ng(m)} ± ${d}`,400,395,44),...ansBox(`x₁ = ${ng(hi)}`,462,44,280),...ansBox(`x₂ = ${ng(lo)}`,462,44,520));
  return{kind:"pair",ans:[hi,lo],labels:X12,sep:"",signed:true,check:(u,v)=>(u===r1&&v===r2)||(u===r2&&v===r1),show:`x = ${ng(hi)}, x = ${ng(lo)}`,hc,
   q:[A.wipe(),A.tx(L(pick([t3("Lös ekvationen med pq-formeln","Solve with the pq formula","حلّ المعادلة باستخدام صيغة pq"),t3("Lös andragradsekvationen med pq-formeln","Solve the quadratic equation with the pq formula","حلّ المعادلة التربيعية باستخدام صيغة pq")])),400,62,38),A.tx(eq,400,160,56)],sol}}
});

/* ---------------------------------------------------------------
   3. formula9: formulas, substitute and rearrange
   --------------------------------------------------------------- */
const HEART="M200,335C120,280 78,228 104,180C126,140 182,146 200,186C218,146 274,140 296,180C322,228 280,280 200,335Z";
const D18=()=>dfmt(1.8,1);
const FORM={steps:[
 {say:t3("En formel är ett färdigt recept. Maxpulsen kan uppskattas med P = 220 − a, där a är åldern. För en 15-åring blir P = 220 − 15 = 205 slag per minut.",
   "A formula is a ready-made recipe. Maximum heart rate can be estimated with P = 220 − a, where a is your age. For a 15-year-old, P = 220 − 15 = 205 beats per minute.",
   `الصيغة وصفة جاهزة. يمكن تقدير أقصى معدل للنبض بالصيغة ${LRI("P = 220 − a")}، حيث a هو العمر. لمن عمره 15 سنة: ${LRI("P = 220 − 15 = 205")} نبضة في الدقيقة.`),
  draw:()=>[A.wipe(),A.p(HEART,"r",4.5),A.hatch(HEART,"r"),A.p("M60,252H138L152,212L170,300L186,226L196,252H340","k",4),
   A.tx(L(t3("Maxpuls","Maximum heart rate","أقصى معدل للنبض")),560,110,36,"b"),A.tx("P = 220 − a",560,195,56),A.tx(L(t3("a = ålder i år","a = age in years","a = العمر بالسنوات")),560,250,28,"o"),
   A.tx("a = 15",560,330,44,"o"),...ansBox("P = 220 − 15 = 205",425,44,560)]},
 {say:t3("I USA visar väderappen grader Fahrenheit. Formeln är F = 1,8C + 32. Sätt in C = 25: F = 1,8 · 25 + 32 = 45 + 32 = 77 °F.",
   "In the USA the weather app shows degrees Fahrenheit. The formula is F = 1.8C + 32. Put in C = 25: F = 1.8 × 25 + 32 = 45 + 32 = 77 °F.",
   `في الولايات المتحدة يعرض تطبيق الطقس درجات فهرنهايت. الصيغة هي ${LRI("F = 1.8C + 32")}. نعوّض ${LRI("C = 25")}: ${LRI("F = 1.8 × 25 + 32 = 45 + 32 = 77 °F")}.`),
  draw:()=>{const Y=c=>330-c*5.4;return[A.wipe(),A.p(R.line(150,100,150,358,.2)+R.line(190,100,190,358,.2)+"M150,100Q170,78 190,100"+R.circ(170,388,32),"k",4.5),
   A.hatch(`M156,${Y(25)}H184V372H156Z`,"r"),A.hatch("M140,388a30,30 0 1,0 60,0a30,30 0 1,0 -60,0","r"),
   A.p([0,10,20,30,40].map(c=>`M190,${f1(Y(c))}h14`).join(""),"k",3),...[0,10,20,30,40].map(c=>txe(c,234,Y(c)+8,24)),txe("°C",170,70,28,"b"),
   A.tx(L(t3("Väderappen i USA visar °F","The weather app in the USA shows °F",`تطبيق الطقس الأمريكي يعرض ${LRI("°F")}`)),530,100,30,"b"),
   A.tx(`F = ${D18()}C + 32`,530,180,54),A.tx("C = 25",530,250,42,"o"),A.tx(`F = ${D18()} ${MUL()} 25 + 32`,530,328,42),A.tx("F = 45 + 32",530,394,42),...ansBox("F = 77",462,46,530)]}},
 {say:t3("En resa är 150 km och bussen kör i 60 km/h. Hur lång tid tar det? Lös ut t ur s = v · t genom att dela båda sidor med v: t = s / v = 150 / 60 = 2,5 timmar.",
   "A trip is 150 km and the bus drives at 60 km/h. How long does it take? Solve s = v × t for t by dividing both sides by v: t = s ÷ v = 150 ÷ 60 = 2.5 hours.",
   `طول الرحلة 150 كم وسرعة الحافلة 60 كم/س. كم تستغرق الرحلة؟ نجعل t موضوع القانون في ${LRI("s = v × t")} بقسمة الطرفين على v: ${LRI("t = s ÷ v = 150 ÷ 60 = 2.5")} ساعة.`),
  draw:()=>[A.wipe(),A.p(R.line(80,135,720,135,.3),"k",4),
   A.p(R.rect(86,78,96,40,.3)+R.line(100,88,124,88,.1)+R.line(132,88,156,88,.1),"b",4),A.p(R.circ(108,124,10)+R.circ(160,124,10),"k",4),
   A.p("M712,135V62L752,74L712,86","r",4),A.tx(L(t3("s = 150 km","s = 150 km",`${LRI("s = 150")} كم`)),420,100,34,"o"),A.tx(L(t3("v = 60 km/h","v = 60 km/h",`${LRI("v = 60")} كم/س`)),420,192,30,"b"),
   A.tx(`s = v ${MUL()} t`,400,262,52),...note(`${DIVS()} v`,262,580),A.tx("t =",392,352,52,"g","end"),...A.frac("s","v",440,340,52,"g"),
   ...ansBox(`t = 150 ${DIVS()} 60 = ${dfmt(2.5,1)}`,458,44)]},
 {say:t3("Vatten kokar vid 212 °F. Hur mycket är det i Celsius? Lös ut C: först minus 32 på båda sidor, sedan delat med 1,8. C = (212 − 32) / 1,8 = 100 °C.",
   "Water boils at 212 °F. What is that in Celsius? Solve for C: first subtract 32 on both sides, then divide by 1.8. C = (212 − 32) ÷ 1.8 = 100 °C.",
   `يغلي الماء عند 212 درجة فهرنهايت. كم يساوي ذلك بالدرجات المئوية؟ نجعل C موضوع القانون: نطرح أولًا 32 من الطرفين، ثم نقسم على 1.8: ${LRI("C = (212 − 32) ÷ 1.8 = 100 °C")}.`),
  draw:()=>[A.wipe(),A.tx(L(t3("Lös ut C","Solve for C","اجعل C موضوع القانون")),400,56,36,"b"),
   ...eqR("F",`${D18()}C + 32`,135,48),...note("− 32",135,640),...eqR("F − 32",`${D18()}C`,215,48),...note(`${DIVS()} ${D18()}`,215,640),
   A.tx("C =",388,312,50,"g","end"),...A.frac("F − 32",D18(),480,300,48,"g"),
   A.tx(L(t3("Vatten kokar vid 212 °F","Water boils at 212 °F",`يغلي الماء عند ${LRI("212 °F")}`)),400,398,30,"o"),...ansBox(`C = (212 − 32) ${DIVS()} ${D18()} = 100`,462,42)]},
 {say:t3("Ett triangelformat segel har arean 6 m² och basen 4 m. Hur högt är det? Lös ut h: gånger 2 på båda sidor, sedan delat med b. h = 2 · 6 / 4 = 3 m.",
   "A triangular sail has an area of 6 m² and a base of 4 m. How tall is it? Solve for h: multiply both sides by 2, then divide by b. h = 2 × 6 ÷ 4 = 3 m.",
   `شراع مثلث الشكل مساحته 6 م² وطول قاعدته 4 م. ما ارتفاعه؟ نجعل h موضوع القانون: نضرب الطرفين في 2، ثم نقسم على b: ${LRI("h = 2 × 6 ÷ 4 = 3")} م.`),
  draw:()=>{const T="M70,400L370,400L250,130Z";return[A.wipe(),A.p(T,"k",4.5),A.hatch(T,"g"),A.p(R.dashed(250,134,250,400),"b",3.5),A.p("M250,382h18v18","b",3),
   txe("h",276,282,38,"b"),A.tx("b = 4",220,448,36,"o"),A.tx("A = 6",178,370,32,"g"),
   ...eqR("A",`b ${MUL()} h ${DIVS()} 2`,130,46,"k",590),...eqR("2A",`b ${MUL()} h`,210,46,"k",590),A.tx("h =",578,312,48,"g","end"),...A.frac("2A","b",630,300,48,"g"),
   ...ansBox(`h = 2 ${MUL()} 6 ${DIVS()} 4 = 3`,430,44,590)]}}
]};
/* level-0 and level-1 templates: build the question board, the sol and the answer */
const fQ=(head,ctx,formula,given)=>{const G=[].concat(given);return[A.wipe(),A.tx(head,400,60,36),...(ctx?[A.tx(ctx,400,110,28,"b")]:[]),A.tx(formula,400,200,58),
 ...G.map((g,i)=>A.tx(g,400+(i-(G.length-1)/2)*200,280,40,"o"))]};
const WORK=v=>pick([t3(`Beräkna ${v}`,`Work out ${v}`,`احسب ${v}`),t3(`Beräkna ${v}`,`Work out ${v}`,`احسب ${v}`),t3(`Bestäm ${v}`,`Find ${v}`,`أوجد ${v}`),t3(`Sätt in värdena och beräkna ${v}`,`Substitute the values and work out ${v}`,`عوّض القيم واحسب ${v}`)]);
LESSONS.push({id:"formula9",subject:"math",grades:"9",kind:"wb",
 title:t3("Formler: sätta in och lösa ut","Formulas: substitute and rearrange","الصيغ: التعويض وتغيير موضوع القانون"),
 icon:ICO(`<text x="160" y="62" ${CV} font-size="44" fill="#1d2433">s = v · t</text><path d="M160 76V100M150 90L160 102L170 90" stroke="#d63b2f" stroke-width="3.5" fill="none" stroke-linecap="round"/><text x="140" y="152" ${CV} font-size="40" fill="#1e9e5a">t =</text><text x="196" y="132" ${CV} font-size="36" fill="#1e9e5a">s</text><path d="M180 141H212" stroke="#1e9e5a" stroke-width="3.5"/><text x="196" y="170" ${CV} font-size="36" fill="#1e9e5a">v</text>`),
 steps:FORM.steps,mount:wbMount(FORM),
 gen(level){const M=MUL(),D=DIVS(),f18=D18();
  if(level===0){const t=rint(0,4);
   if(t===0){const a=rint(13,60),P=220-a;return{kind:"num",ans:P,show:String(P),hc:1,
     q:fQ(L(WORK("P")),L(t3("Maxpuls","Maximum heart rate","أقصى معدل للنبض")),"P = 220 − a",`a = ${a}`),sol:[A.tx(`P = 220 − ${a}`,400,360,44),...ansBox(`P = ${P}`,445,48)]}}
   if(t===1){const C=pick([-20,-15,-10,-5,5,10,15,20,25,30,35,40]),m=Math.round(1.8*C),F=m+32;return{kind:"num",ans:F,show:ng(F),signed:true,hc:1,
     q:fQ(L(WORK("F")),L(t3("Från °C till °F","From °C to °F",`من ${LRI("°C")} إلى ${LRI("°F")}`)),`F = ${f18}C + 32`,`C = ${ng(C)}`),
     sol:[A.tx(`F = ${f18} ${M} ${par(C)} + 32`,400,345,42),A.tx(`F = ${ng(m)} + 32`,400,405,42),...ansBox(`F = ${ng(F)}`,465,46)]}}
   if(t===2){const f=pick([150,200,250,300]),p=pick([35,40,45,60,75]),n=rint(2,12),K=f+p*n;return{kind:"num",ans:K,show:String(K),hc:1,
     q:fQ(L(WORK("K")),L(t3("Fest: lokalhyra + pris per gäst","Party: room hire + price per guest","حفلة: إيجار القاعة + السعر لكل ضيف")),`K = ${f} + ${p}n`,`n = ${n}`),
     sol:[A.tx(`K = ${f} + ${p} ${M} ${n}`,400,345,42),A.tx(`K = ${f} + ${p*n}`,400,405,42),...ansBox(`K = ${K}`,465,46)]}}
   if(t===3){let b,h;do{b=rint(3,14);h=rint(2,12)}while((b*h)%2);const A0=b*h/2;return{kind:"num",ans:A0,show:String(A0),hc:1,
     q:fQ(L(WORK("A")),L(t3("Triangelns area","Area of a triangle","مساحة المثلث")),`A = b ${M} h ${D} 2`,[`b = ${b}`,`h = ${h}`]),
     sol:[A.tx(`A = ${b} ${M} ${h} ${D} 2`,400,360,44),...ansBox(`A = ${A0}`,445,48)]}}
   const v=pick([40,50,60,70,80,90,100,110,120]),tt=pick([.5,1.5,2,2.5,3,4]),s=v*tt,tS=tt%1?dfmt(tt,1):String(tt);
   return{kind:"num",ans:s,show:String(s),hc:1,
    q:fQ(L(WORK("s")),L(t3("Sträcka = fart · tid","Distance = speed × time","المسافة = السرعة × الزمن")),`s = v ${M} t`,[`v = ${v}`,`t = ${tS}`]),
    sol:[A.tx(`s = ${v} ${M} ${tS}`,400,360,44),...ansBox(`s = ${s}`,445,48)]}}
  if(level===1){const t=rint(0,3);
   if(t===0){const v=pick([40,50,60,70,80,90,100,120]),tt=pick([.5,1.5,2,2.5,3,4]),s=v*tt,tS=tt%1?dfmt(tt,1):String(tt);
    return{kind:"num",ans:tt,dec:true,show:tS,hc:1,q:fQ(L(WORK("t")),L(t3("Sträcka = fart · tid","Distance = speed × time","المسافة = السرعة × الزمن")),`s = v ${M} t`,[`s = ${s}`,`v = ${v}`]),
     sol:[A.tx(`t = s ${D} v`,400,360,46),...ansBox(`t = ${s} ${D} ${v} = ${tS}`,445,46)]}}
   if(t===1){let Rr,I,U;do{Rr=pick([2,3,4,5,6,10,12,20]);I=pick([.5,1,1.5,2,3,4,5,6]);U=Rr*I}while(U%1||U>60);const IS=I%1?dfmt(I,1):String(I);
    return{kind:"num",ans:I,dec:true,show:IS,hc:1,q:fQ(L(WORK("I")),L(t3("Ohms lag","Ohm's law","قانون أوم")),`U = R ${M} I`,[`U = ${U}`,`R = ${Rr}`]),
     sol:[A.tx(`I = U ${D} R`,400,360,46),...ansBox(`I = ${U} ${D} ${Rr} = ${IS}`,445,46)]}}
   if(t===2){const P=rint(155,205),a=220-P;
    return{kind:"num",ans:a,show:String(a),hc:1,q:fQ(L(WORK("a")),L(t3("Maxpuls","Maximum heart rate","أقصى معدل للنبض")),"P = 220 − a",`P = ${P}`),
     sol:[A.tx("a = 220 − P",400,360,46),...ansBox(`a = 220 − ${P} = ${a}`,445,46)]}}
   const b=rint(4,15),h=rint(3,12),A0=b*h;
   return{kind:"num",ans:h,show:String(h),hc:1,q:fQ(L(WORK("h")),L(t3("Rektangelns area","Area of a rectangle","مساحة المستطيل")),`A = b ${M} h`,[`A = ${A0}`,`b = ${b}`]),
    sol:[A.tx(`h = A ${D} b`,400,360,46),...ansBox(`h = ${A0} ${D} ${b} = ${h}`,445,46)]}}
  if(Math.random()<.5){const t=rint(0,2);
   if(t===0){const f=pick([150,200,250,300]),p=pick([35,40,45,60,75]),n=rint(2,12),K=f+p*n;
    return{kind:"num",ans:n,show:String(n),hc:1,q:fQ(L(WORK("n")),L(t3("Fest: lokalhyra + pris per gäst","Party: room hire + price per guest","حفلة: إيجار القاعة + السعر لكل ضيف")),`K = ${f} + ${p}n`,`K = ${K}`),
     sol:[A.tx(`n = (K − ${f}) ${D} ${p}`,400,345,42),A.tx(`n = (${K} − ${f}) ${D} ${p} = ${K-f} ${D} ${p}`,400,405,42),...ansBox(`n = ${n}`,465,46)]}}
   if(t===1){const C=pick([-20,-15,-10,-5,5,10,15,20,25,30,35,40]),F=Math.round(1.8*C)+32;
    return{kind:"num",ans:C,show:ng(C),signed:true,hc:1,q:fQ(L(WORK("C")),L(t3("Från °F till °C","From °F to °C",`من ${LRI("°F")} إلى ${LRI("°C")}`)),`F = ${f18}C + 32`,`F = ${ng(F)}`),
     sol:[A.tx(`C = (F − 32) ${D} ${f18}`,400,345,42),A.tx(`C = (${ng(F)} − 32) ${D} ${f18} = ${ng(F-32)} ${D} ${f18}`,400,405,42),...ansBox(`C = ${ng(C)}`,465,46)]}}
   let b,h;do{b=rint(3,12);h=rint(2,12)}while((b*h)%2);const A0=b*h/2;
   return{kind:"num",ans:h,show:String(h),hc:1,q:fQ(L(WORK("h")),L(t3("Triangelns area","Area of a triangle","مساحة المثلث")),`A = b ${M} h ${D} 2`,[`A = ${A0}`,`b = ${b}`]),
    sol:[A.tx(`h = 2A ${D} b`,400,345,42),A.tx(`h = 2 ${M} ${A0} ${D} ${b} = ${2*A0} ${D} ${b}`,400,405,42),...ansBox(`h = ${h}`,465,46)]}}
  const T=[
   {f:"y = kx + m",v:"x",step:"y − m = kx",right:`x = (y − m) ${D} k`,wrong:[`x = y ${D} k − m`,`x = (y + m) ${D} k`,`x = k(y − m)`]},
   {f:`A = b ${M} h ${D} 2`,v:"h",step:`2A = b ${M} h`,right:`h = 2A ${D} b`,wrong:[`h = A ${D} (2b)`,`h = 2b ${D} A`,`h = A ${M} b ${D} 2`]},
   {f:`F = ${f18}C + 32`,v:"C",step:`F − 32 = ${f18}C`,right:`C = (F − 32) ${D} ${f18}`,wrong:[`C = F ${D} ${f18} − 32`,`C = (F + 32) ${D} ${f18}`,`C = ${f18}(F − 32)`]},
   {f:"P = 2(a + b)",v:"a",step:`P ${D} 2 = a + b`,right:`a = P ${D} 2 − b`,wrong:[`a = P ${D} 2 + b`,`a = (P − b) ${D} 2`,`a = 2P − b`]},
   {f:`V = l ${M} b ${M} h`,v:"h",step:`V ${D} (l ${M} b) = h`,right:`h = V ${D} (l ${M} b)`,wrong:[`h = V − l ${M} b`,`h = V ${M} l ${D} b`,`h = l ${M} b ${D} V`]}];
  const c=pick(T),opts=shuffle([c.right,...c.wrong]),ans=opts.indexOf(c.right);
  return{kind:"choice",opts,ans,show:c.right,hc:1,
   q:[A.wipe(),A.tx(L(pick([t3(`Lös ut ${c.v} ur formeln`,`Solve the formula for ${c.v}`,`اجعل ${c.v} موضوع القانون`),t3(`Skriv om formeln så att ${c.v} står ensamt`,`Rewrite the formula with ${c.v} on its own`,`أعد كتابة الصيغة بحيث يكون ${c.v} وحده`)])),400,62,38),A.tx(c.f,400,190,64)],
   sol:[A.tx(c.step,400,290,46),...ansBox(c.right,400,48)]}}
});

/* ---------------------------------------------------------------
   4. sys9: simultaneous equations
   --------------------------------------------------------------- */
/* coordinate grid: X,Y map values to the board; xs/ys are the grid lines, xl/yl the labelled values */
const plot=(X,Y,xs,ys,xl,yl)=>{const x0=xs[0],x1=xs[xs.length-1],y0=ys[0],y1=ys[ys.length-1];let g="";
 xs.forEach(v=>g+=`M${f1(X(v))},${f1(Y(y0))}V${f1(Y(y1))}`);ys.forEach(v=>g+=`M${f1(X(x0))},${f1(Y(v))}H${f1(X(x1))}`);
 return[A.p(g,"#c8d0de",1.5),A.p(R.arrow(X(x0),Y(y0),X(x1)+24,Y(y0))+R.arrow(X(x0),Y(y0),X(x0),Y(y1)-24),"k",3.5),
  ...xl.map(v=>txe(v,X(v),Y(y0)+30,22)),...yl.map(v=>txe(v,X(x0)-10,Y(v)+8,22,"k","end"))]};
const seg=(X,Y,xa,ya,xb,yb,c)=>A.p(R.line(X(xa),Y(ya),X(xb),Y(yb),.3),c,4.5);
const sys=(e1,e2,c1="k",c2="k",y1=125,y2=185,size=46)=>{const w=Math.max(W(e1,size),W(e2,size)),x=400-w/2;return[brace(x-18,y1-44,y2+14),A.tx(e1,x,y1,size,c1,"start"),A.tx(e2,x,y2,size,c2,"start")]};
const R8=[0,1,2,3,4,5,6,7,8];
const SYS={steps:[
 {say:t3("Två klättergym. A kostar 150 kr i avgift plus 30 kr per besök. B kostar 60 kr per besök. Vid x besök kostar A y = 30x + 150 kr och B y = 60x kr.",
   "Two climbing gyms. A costs a 150 kr fee plus 30 kr per visit. B costs 60 kr per visit. For x visits, A costs y = 30x + 150 kr and B costs y = 60x kr.",
   `صالتان للتسلّق. في الصالة A رسوم قدرها 150 كرونة إضافةً إلى 30 كرونة لكل زيارة. وفي الصالة B تدفع 60 كرونة لكل زيارة. عند x زيارة تكون التكلفة ${LRI("y = 30x + 150")} كرونة في A و${LRI("y = 60x")} كرونة في B.`),
  draw:()=>[A.wipe(),A.p(R.rect(60,70,320,200,.4),"b",4),A.p(R.rect(420,70,320,200,.4),"o",4),
   A.tx(L(t3("Klättergym A","Climbing gym A","صالة التسلّق A")),220,122,38,"b"),A.tx(L(t3("avgift 150 kr","fee 150 kr","رسوم 150 كرونة")),220,182,30),A.tx(L(t3("+ 30 kr per besök","+ 30 kr per visit","+ 30 كرونة لكل زيارة")),220,236,30),
   A.tx(L(t3("Klättergym B","Climbing gym B","صالة التسلّق B")),580,122,38,"o"),A.tx(L(t3("ingen avgift","no fee","بلا رسوم")),580,182,30),A.tx(L(t3("60 kr per besök","60 kr per visit","60 كرونة لكل زيارة")),580,236,30),
   A.tx("y = 30x + 150",220,340,46,"b"),A.tx("y = 60x",580,340,46,"o"),
   A.tx(L(t3("x = antal besök","x = number of visits","x = عدد الزيارات")),400,412,30),A.tx(L(t3("y = kostnad i kr","y = cost in kr","y = التكلفة بالكرونات")),400,458,30)]},
 {say:t3("Vi ritar båda linjerna. De skär varandra i punkten (5, 300). Efter 5 besök kostar båda gymmen 300 kr. Punkten är lösningen till ekvationssystemet.",
   "We draw both lines. They cross at the point (5, 300). After 5 visits both gyms cost 300 kr. The point is the solution of the simultaneous equations.",
   `نرسم المستقيمين، فيتقاطعان في النقطة ${LRI("(5, 300)")}. بعد 5 زيارات تكلّف الصالتان 300 كرونة. هذه النقطة هي حلّ نظام المعادلتين.`),
  draw:()=>{const X=v=>110+v*66,Y=v=>420-v*.6;return[A.wipe(),A.tx(L(t3("Var möts linjerna?","Where do the lines meet?","أين يلتقي المستقيمان؟")),400,52,34,"b"),
   ...plot(X,Y,R8,[0,60,120,180,240,300,360,420,480],R8,[120,240,360,480]),txe(L(t3("besök","visits","الزيارات")),X(8)+70,Y(0)+8,24),txe(L(t3("kr","kr","كرونة")),X(0),Y(480)-34,24),
   seg(X,Y,0,150,8,390,"b"),seg(X,Y,0,0,8,480,"o"),txe("A",X(8)+24,Y(390)+12,32,"b"),txe("B",X(8)+24,Y(480)+12,32,"o"),
   A.p(R.dashed(X(5),Y(300),X(5),Y(0))+R.dashed(X(5),Y(300),X(0),Y(300)),"g",3),A.p(dots([[X(5),Y(300)]]),"g",16),A.loop(X(5),Y(300),26,24,"g"),
   ...ansBox("(5, 300)",Y(150),38,X(6.6))]}},
 {say:t3("Båda ekvationerna säger vad y är. Då måste 60x = 30x + 150. Ta bort 30x på båda sidor: 30x = 150, så x = 5. Sätt in: y = 60 · 5 = 300.",
   "Both equations say what y is. So 60x = 30x + 150. Take 30x away from both sides: 30x = 150, so x = 5. Put it in: y = 60 × 5 = 300.",
   `كلتا المعادلتين تعطي قيمة y، إذن ${LRI("60x = 30x + 150")}. نطرح ${LRI("30x")} من الطرفين: ${LRI("30x = 150")}، إذن ${LRI("x = 5")}. نعوّض: ${LRI("y = 60 × 5 = 300")}.`),
  draw:()=>[A.wipe(),A.tx(L(t3("Substitutionsmetoden","The substitution method","طريقة التعويض")),400,46,32,"b"),...sys("y = 30x + 150","y = 60x","b","o",118,174,42),
   A.tx("60x",388,262,44,"o","end"),A.tx("= 30x + 150",400,262,44,"b","start"),...note("− 30x",262,650),...eqR("30x","150",332,44),...note(`${DIVS()} 30`,332,650),
   A.hl(250,360,430,128),...eqR("x","5",402,44,"g"),...eqR("y",`60 ${MUL()} 5 = 300`,466,44,"g")]},
 {say:t3("Nu y = 2x + 1 och x + y = 7. Byt ut y i den andra ekvationen mot 2x + 1. Då blir 3x + 1 = 7, så x = 2. Sedan är y = 2 · 2 + 1 = 5.",
   "Now y = 2x + 1 and x + y = 7. Replace y in the second equation with 2x + 1. Then 3x + 1 = 7, so x = 2. Then y = 2 × 2 + 1 = 5.",
   `الآن ${LRI("y = 2x + 1")} و${LRI("x + y = 7")}. نعوّض عن y في المعادلة الثانية بـ ${LRI("2x + 1")}، فتصبح ${LRI("3x + 1 = 7")}، إذن ${LRI("x = 2")}. ثم ${LRI("y = 2 × 2 + 1 = 5")}.`),
  draw:()=>{const r=row(["x +",{s:"(2x + 1)",c:"b"},"= 7"],400,262,44,.2);return[A.wipe(),A.tx(L(t3("Byt ut y","Replace y","عوّض عن y")),400,46,32,"b"),...sys("y = 2x + 1","x + y = 7","b","k",118,174,42),
   A.arrow(470,104,r.pos[1]+70,226,"b",-46),...r.o,...eqR("3x + 1","7",332,44),...note("− 1",332,620),...eqR("3x","6",398,44),...note(`${DIVS()} 3`,398,620),
   ...ansBox("x = 2",466,44,240),...ansBox(`y = 2 ${MUL()} 2 + 1 = 5`,466,44,545)]}},
 {say:t3("Kontrollera grafiskt. Skriv x + y = 7 som y = 7 − x och rita båda linjerna. De skär varandra i (2, 5), samma svar som vi räknade fram.",
   "Check it with a graph. Write x + y = 7 as y = 7 − x and draw both lines. They cross at (2, 5), the same answer that we calculated.",
   `لنتحقّق بالرسم البياني: نكتب ${LRI("x + y = 7")} على الصورة ${LRI("y = 7 − x")} ونرسم المستقيمين. يتقاطعان في ${LRI("(2, 5)")}، وهو الجواب نفسه الذي حسبناه.`),
  draw:()=>{const X=v=>90+v*48,Y=v=>440-v*40;return[A.wipe(),...plot(X,Y,[0,1,2,3,4,5,6,7],R8,[0,1,2,3,4,5,6,7],[1,2,3,4,5,6,7,8]),txe("x",X(7)+28,Y(0)+30,28),txe("y",X(0)-26,Y(8)-22,28),
   seg(X,Y,0,1,3.5,8,"b"),seg(X,Y,0,7,7,0,"o"),A.p(dots([[X(2),Y(5)]]),"g",16),A.loop(X(2),Y(5),24,22,"g"),
   A.tx("y = 2x + 1",615,130,40,"b"),A.tx("x + y = 7",615,195,40,"o"),A.arrow(615,212,615,238,"o"),A.tx("y = 7 − x",615,280,40,"o"),...ansBox("(2, 5)",370,50,615),
   A.tx(L(t3("Kontroll: 2 + 5 = 7","Check: 2 + 5 = 7",`تحقّق: ${LRI("2 + 5 = 7")}`)),615,450,32,"b")]}},
 {say:t3("Ibland finns ingen lösning. y = x + 3 och y = x − 1 har samma lutning, så linjerna är parallella och möts aldrig.",
   "Sometimes there is no solution. y = x + 3 and y = x − 1 have the same slope, so the lines are parallel and never meet.",
   `أحيانًا لا يوجد حلّ. للمستقيمين ${LRI("y = x + 3")} و${LRI("y = x − 1")} الميلُ نفسه، فهما متوازيان ولا يلتقيان أبدًا.`),
  draw:()=>{const X=v=>90+v*48,Y=v=>440-v*40;return[A.wipe(),...plot(X,Y,[0,1,2,3,4,5,6,7],R8,[0,1,2,3,4,5,6,7],[1,2,3,4,5,6,7,8]),txe("x",X(7)+28,Y(0)+30,28),txe("y",X(0)-26,Y(8)-22,28),
   seg(X,Y,0,3,5,8,"b"),seg(X,Y,1,0,7,6,"o"),A.p(`M${X(1)},${Y(4)}H${X(2)}V${Y(5)}M${X(4)},${Y(3)}H${X(5)}V${Y(4)}`,"r",3.5),
   A.tx("y = x + 3",615,130,40,"b"),A.tx("y = x − 1",615,195,40,"o"),A.tx(L(t3("samma lutning","the same slope","الميل نفسه")),615,275,32,"r"),
   A.tx(L(t3("parallella linjer","parallel lines","مستقيمان متوازيان")),615,335,32),...ansBox(L(t3("ingen lösning","no solution","لا يوجد حلّ")),430,44,615)]}}
]};
LESSONS.push({id:"sys9",subject:"math",grades:"9",kind:"wb",
 title:t3("Ekvationssystem","Simultaneous equations","أنظمة المعادلات"),
 icon:ICO(`<path d="${[30,50,70,90,110,130,150,170].map(x=>`M${x} 20V160`).join("")}${[20,40,60,80,100,120,140,160].map(y=>`M30 ${y}H170`).join("")}" stroke="#d3d9e3" stroke-width="1.5"/><path d="M30 160H172M30 160V18" stroke="#1d2433" stroke-width="3"/><path d="M30 150L170 30" stroke="#2257c9" stroke-width="4.5"/><path d="M30 40L170 140" stroke="#e07b00" stroke-width="4.5"/><circle cx="100" cy="90" r="9" fill="#1e9e5a"/><text x="250" y="66" ${CV} font-size="28" fill="#2257c9">y = 2x + 1</text><text x="250" y="106" ${CV} font-size="28" fill="#e07b00">x + y = 7</text><text x="250" y="150" ${CV} font-size="32" fill="#1e9e5a">(2, 5)</text>`),
 steps:SYS.steps,mount:wbMount(SYS),
 gen(level){const M=MUL();
  /* level 1, word problem: two climbing gyms, when do they cost the same? */
  if(level===1&&Math.random()<.3){const p=pick([20,25,30,40]),d=pick([10,15,20,25,30]),q=p+d,x0=rint(3,12),f=d*x0;
   return{kind:"num",ans:x0,show:String(x0),hc:2,q:[A.wipe(),A.tx(L(t3(`Gym A: ${f} kr i avgift plus ${p} kr per besök.`,`Gym A: a ${f} kr fee plus ${p} kr per visit.`,`النادي A: رسم ${f} كرونة و${p} كرونة لكل زيارة.`)),400,60,34,"b"),
     A.tx(L(t3(`Gym B: ${q} kr per besök.`,`Gym B: ${q} kr per visit.`,`النادي B: ${q} كرونة لكل زيارة.`)),400,110,34,"o"),
     A.tx(L(t3("Efter hur många besök kostar gymmen lika mycket?","After how many visits do the gyms cost the same?","بعد كم زيارة تتساوى تكلفة الناديين؟")),400,170,32),...sys(`y = ${p}x + ${f}`,`y = ${q}x`,"b","o",250,310,40)],
    sol:[A.tx(`${q}x = ${p}x + ${f}`,400,380,40),A.tx(`${d}x = ${f}`,400,430,40),...ansBox(`x = ${x0}`,480,40)]}}
  if(level===0){const X=v=>80+v*44,Y=v=>452-v*42;let a,b,k1,k2,m1,m2,s1,s2;
   const clip=(k,m)=>{if(k===0)return[0,8];const xa=-m/k,xb=(8-m)/k;return[Math.max(0,Math.min(xa,xb)),Math.min(8,Math.max(xa,xb))]};
   const len=(k,c)=>(c[1]-c[0])*Math.hypot(1,k);
   do{a=rint(2,6);b=rint(2,6);k1=pick([-3,-2,-1,0,1,2,3]);do{k2=pick([-3,-2,-1,1,2,3])}while(k2===k1);m1=b-k1*a;m2=b-k2*a;s1=clip(k1,m1);s2=clip(k2,m2)}
   while(len(k1,s1)<5||len(k2,s2)<5||m1===m2);
   const e1=`y = ${lin(k1,m1)}`,e2=`y = ${lin(k2,m2)}`;
   return{kind:"pair",ans:[a,b],labels:["x","y"],sep:",",show:`(${a}, ${b})`,hc:0,
    q:[A.wipe(),A.tx(L(pick([t3("Var skär linjerna varandra?","Where do the lines cross?","أين يتقاطع المستقيمان؟"),t3("Lös ekvationssystemet grafiskt","Solve the system graphically","حلّ نظام المعادلتين بيانيًا"),t3("Bestäm linjernas skärningspunkt","Find where the lines intersect","أوجد نقطة تقاطع المستقيمين")])),400,50,34),...plot(X,Y,R8,R8,R8,R8.slice(1)),txe("x",X(8)+26,Y(0)+30,28),txe("y",X(0)-26,Y(8)-22,28),
     seg(X,Y,s1[0],k1*s1[0]+m1,s1[1],k1*s1[1]+m1,"b"),seg(X,Y,s2[0],k2*s2[0]+m2,s2[1],k2*s2[1]+m2,"o"),
     A.tx(e1,615,170,42,"b"),A.tx(e2,615,240,42,"o"),A.tx("(x, y) = (?, ?)",615,330,38)],
    sol:[A.loop(X(a),Y(b),24,22,"g"),A.p(R.dashed(X(a),Y(b),X(a),Y(0))+R.dashed(X(a),Y(b),X(0),Y(b)),"g",3),A.p(dots([[X(a),Y(b)]]),"g",14),...ansBox(`(x, y) = (${a}, ${b})`,420,40,615)]}}
  if(level===1){let a,b,c,d,x0,y0;
   do{x0=rint(-5,5);a=rint(-5,5);c=rint(-5,5);b=rint(-9,9);y0=a*x0+b;d=y0-c*x0}while(!a||!c||!b||Math.abs(a-c)<2||b===d||Math.abs(d)>20||Math.abs(y0)>30);
   return{kind:"pair",ans:[x0,y0],labels:["x","y"],sep:"",signed:true,show:`(x, y) = (${ng(x0)}, ${ng(y0)})`,hc:1,
    q:[A.wipe(),A.tx(L(t3("Lös ekvationssystemet","Solve the simultaneous equations","حلّ نظام المعادلتين")),400,56,36),...sys(`y = ${lin(a,b)}`,`y = ${lin(c,d)}`,"b","o")],
    sol:[A.tx(`${lin(a,b)} = ${lin(c,d)}`,400,268,44),A.tx(`${lin(a-c,0)} = ${ng(d-b)}`,400,336,44),...ansBox(`x = ${ng(x0)}`,430,42,200),...ansBox(`y = ${a===1?ng(x0):a===-1?"−"+par(x0):ng(a)+" "+M+" "+par(x0)} ${pm(b)} = ${ng(y0)}`,430,42,530)]}}
  let a,b,p,q,x0,y0,r;
  do{a=pick([-3,-2,-1,1,2,3]);b=rint(-6,6);p=rint(1,4);q=rint(1,3);x0=rint(-4,5);y0=a*x0+b;r=p*x0+q*y0}while(!b||Math.abs(p+q*a)<2||Math.abs(r)>40);
  const e2=`${lin(p,0)} + ${q===1?"":q}y = ${ng(r)}`;
  return{kind:"pair",ans:[x0,y0],labels:["x","y"],sep:"",signed:true,show:`(x, y) = (${ng(x0)}, ${ng(y0)})`,hc:1,
   q:[A.wipe(),A.tx(L(pick([t3("Lös ekvationssystemet","Solve the simultaneous equations","حلّ نظام المعادلتين"),t3("Lös ekvationssystemet med substitutionsmetoden","Solve the system by substitution","حلّ نظام المعادلتين بطريقة التعويض")])),400,56,36),...sys(`y = ${lin(a,b)}`,e2,"b","k")],
   sol:[A.tx(`${lin(p,0)} + ${q===1?"":q}(${lin(a,b)}) = ${ng(r)}`,400,262,42,"b"),A.tx(`${lin(p+q*a,q*b)} = ${ng(r)}`,400,322,42),A.tx(`${lin(p+q*a,0)} = ${ng(r-q*b)}`,400,382,42),
    ...ansBox(`x = ${ng(x0)}`,455,42,200),...ansBox(`y = ${a===1?ng(x0):a===-1?"−"+par(x0):ng(a)+" "+M+" "+par(x0)} ${pm(b)} = ${ng(y0)}`,455,42,530)]}}
});

/* ---------------- simpler explanations and hints ---------------- */
const burger=(cx,cy)=>[A.p(`M${cx-36},${cy-4}Q${cx},${cy-52} ${cx+36},${cy-4}Z`+R.rect(cx-34,cy+14,68,14,.2),"o",4),A.p(R.line(cx-38,cy+5,cx+38,cy+5,.2),"r",7)];
const soda=(cx,cy,c="b")=>A.p(`M${cx-20},${cy-28}L${cx+20},${cy-28}L${cx+14},${cy+28}L${cx-14},${cy+28}Z`+R.line(cx+6,cy-28,cx+16,cy-50,.1),c,4);
Object.assign(HELPX,{
 quad9:[{say:t3("Tänk dig ett golv med 13 · 13 plattor. Dela 13 i 10 + 3. Då blir golvet fyra delar: 100 + 30 + 30 + 9 = 169 plattor.",
   "Imagine a floor with 13 × 13 tiles. Split 13 into 10 + 3. Then the floor has four parts: 100 + 30 + 30 + 9 = 169 tiles.",
   `تخيّل أرضية فيها ${LRI("13 × 13")} بلاطة. نقسم 13 إلى ${LRI("10 + 3")}، فتصبح الأرضية أربعة أجزاء: ${LRI("100 + 30 + 30 + 9 = 169")} بلاطة.`),
  draw:()=>{const x0=110,y0=110,u=24;return[...gridRect(x0,y0,13,13,u),...sqFill(x0,y0,240,72,["100","30","30","9"],40,30),
   A.p(R.line(x0+240,y0,x0+240,y0+312,.2)+R.line(x0,y0+240,x0+312,y0+240,.2),"k",5),txe("10",x0+120,y0-14,32,"b"),txe("3",x0+276,y0-14,32,"o"),txe("10",x0-28,y0+130,32,"b"),txe("3",x0-26,y0+286,32,"o"),
   A.tx(`13 ${MUL()} 13`,612,170,50),A.tx("= 100 + 30 + 30 + 9",612,260,36),...ansBox("= 169",360,52,612)]}},
  {say:t3("Varför försvinner mitten i konjugatregeln? Gå 5 steg framåt och sedan 5 steg bakåt, så står du där du började. På samma sätt är +5x − 5x = 0.",
   "Why does the middle vanish in the difference of two squares? Take 5 steps forward and then 5 steps back, and you are where you started. In the same way, +5x − 5x = 0.",
   `لماذا يختفي الحدّ الأوسط في قاعدة الفرق بين مربعين؟ تقدّم 5 خطوات ثم ارجع 5 خطوات، فتعود إلى حيث بدأت. وبالطريقة نفسها ${LRI("+5x − 5x = 0")}.`),
  draw:()=>{const r=row([{s:"x²",c:"k"},{s:"+ 5x",c:"g"},{s:"− 5x",c:"r"},{s:"− 25",c:"k"}],400,110,50,.8),X=v=>120+v*56;
   return[...r.o,A.loop((r.pos[1]+r.pos[2])/2,94,(r.pos[2]-r.pos[1])/2+64,40,"o"),
    A.p(R.line(X(0)-20,320,X(10)+20,320,.3)+[0,1,2,3,4,5,6,7,8,9,10].map(i=>`M${X(i)},310v20`).join(""),"k",3.5),A.p(dots([[X(2),320]]),"b",18),
    A.arrow(X(2),300,X(7),300,"g",-60),A.tx("+ 5",X(4.5),250,36,"g"),A.arrow(X(7),340,X(2)+6,340,"r",-60),A.tx("− 5",X(4.5),408,36,"r"),...ansBox("+ 5x − 5x = 0",470,40,400)]}}],
 qeq9:[{say:t3("Både 4 och −4 blir 16 i kvadrat: 4 · 4 = 16 och (−4) · (−4) = 16. Därför har x² = 16 två lösningar: x = ±4.",
   "Both 4 and −4 give 16 when squared: 4 × 4 = 16 and (−4) × (−4) = 16. That is why x² = 16 has two solutions: x = ±4.",
   `العددان 4 و−4 مربّع كلٍّ منهما 16: ${LRI("4 × 4 = 16")} و${LRI("(−4) × (−4) = 16")}. لذلك للمعادلة ${LRI("x² = 16")} حلّان: ${LRI("x = ±4")}.`),
  draw:()=>{const X=v=>400+v*50;return[A.p(R.line(X(-6)-10,330,X(6)+10,330,.3)+[-6,-5,-4,-3,-2,-1,0,1,2,3,4,5,6].map(v=>`M${X(v)},${v?320:314}v${v?20:32}`).join(""),"k",3.5),
   ...[-6,-5,-4,-3,-2,-1,0,1,2,3,4,5,6].map(v=>txe(ng(v),X(v),372,24,Math.abs(v)===4?(v<0?"r":"b"):"k")),A.p(dots([[X(-4),330],[X(4),330]]),"g",18),
   A.arrow(X(-4),306,368,160,"r",-30),A.arrow(X(4),306,432,160,"b",30),A.tx("16",400,140,56,"g"),A.tx("(−4)²",X(-4)-6,214,36,"r"),A.tx("4²",X(4)+6,214,36,"b"),...ansBox("x = ±4",450,50)]}},
  {say:t3("Om du multiplicerar två tal och får 0, då måste ett av dem vara 0. 0 · 7 = 0 och 5 · 0 = 0, men 3 · 4 blir aldrig 0.",
   "If you multiply two numbers and get 0, one of them must be 0. 0 × 7 = 0 and 5 × 0 = 0, but 3 × 4 is never 0.",
   `إذا ضربت عددين وكان الناتج صفرًا فلا بدّ أن يكون أحدهما صفرًا: ${LRI("0 × 7 = 0")} و${LRI("5 × 0 = 0")}، أمّا ${LRI("3 × 4")} فلا يساوي صفرًا أبدًا.`),
  draw:()=>{const M=MUL(),r1=row(["0",M,"7","=","0"],400,130,56,.3),r2=row(["5",M,"0","=","0"],400,230,56,.3),r3=row(["3",M,"4","=","12"],400,330,56,.3);
   return[...r1.o.map(a=>({...a,c:"g"})),A.loop(r1.pos[0],112,30,38,"g"),...r2.o.map(a=>({...a,c:"g"})),A.loop(r2.pos[2],212,30,38,"g"),
   ...r3.o.map(a=>({...a,c:"r"})),A.tx("≠ 0",r3.pos[4]+80,330,44,"r"),
   ...ansBox(L(t3("Produkten är 0 bara om en faktor är 0","The product is 0 only if a factor is 0","يكون الناتج صفرًا فقط إذا كان أحد العاملين صفرًا")),440,32)]}}],
 formula9:[{say:t3("En formel är som en maskin. Stoppa in antalet biobiljetter, n = 3, så räknar den ut priset: K = 120 · 3 = 360 kr.",
   "A formula is like a machine. Put in the number of cinema tickets, n = 3, and it works out the price: K = 120 × 3 = 360 kr.",
   `الصيغة مثل آلة: تُدخل عدد تذاكر السينما ${LRI("n = 3")} فتحسب لك السعر: ${LRI("K = 120 × 3 = 360")} كرونة.`),
  draw:()=>[A.tx(L(t3("Biobiljetter","Cinema tickets","تذاكر السينما")),400,110,34,"o"),A.p(R.rect(280,160,240,130,.4),"b",4.5),A.hatch("M280,160h240v130h-240Z","b"),A.tx(`K = 120 ${MUL()} n`,400,238,40),
   A.arrow(100,225,268,225,"k"),A.tx("n = 3",180,200,38,"o"),A.arrow(532,225,700,225,"g"),A.tx("K = 360",618,200,38,"g"),...ansBox(`K = 120 ${MUL()} 3 = 360`,410,44)]},
  {say:t3("Att lösa ut är att köra maskinen baklänges. Du betalade 480 kr. Gör det omvända: n = 480 / 120 = 4 biljetter.",
   "Solving for a letter is running the machine backwards. You paid 480 kr. Do the opposite: n = 480 ÷ 120 = 4 tickets.",
   `تغيير موضوع القانون يعني تشغيل الآلة بالعكس. دفعت 480 كرونة. نعمل العملية العكسية: ${LRI("n = 480 ÷ 120 = 4")} تذاكر.`),
  draw:()=>[A.tx(L(t3("Biobiljetter","Cinema tickets","تذاكر السينما")),400,110,34,"o"),A.p(R.rect(280,160,240,130,.4),"b",4.5),A.hatch("M280,160h240v130h-240Z","b"),A.tx(`K = 120 ${MUL()} n`,400,238,40),
   A.arrow(700,225,532,225,"r"),A.tx("K = 480",618,200,38,"o"),A.arrow(268,225,100,225,"g"),A.tx("n = ?",180,200,38,"g"),...ansBox(`n = 480 ${DIVS()} 120 = 4`,410,44)]}],
 sys9:[{say:t3("Ali har 100 kr och sparar 20 kr i veckan. Mira har 0 kr och sparar 40 kr i veckan. Efter 5 veckor har båda 200 kr. Där är lösningen.",
   "Ali has 100 kr and saves 20 kr a week. Mira has 0 kr and saves 40 kr a week. After 5 weeks they both have 200 kr. That is the solution.",
   "مع علي 100 كرونة ويدّخر 20 كرونة كل أسبوع. ومع ميرا 0 كرونة وتدّخر 40 كرونة كل أسبوع. بعد 5 أسابيع يكون مع كلٍّ منهما 200 كرونة، وهذا هو الحل."),
  draw:()=>{const C=i=>235+i*92,N=L(t3(["Ali","Mira"],["Ali","Mira"],["علي","ميرا"]));return[A.p(R.line(50,160,770,160,.3)+R.line(180,90,180,330,.3),"k",3.5),
   txe(L(t3("vecka","week","الأسبوع")),115,135,28,"k"),...[0,1,2,3,4,5].map(i=>txe(i,C(i),135,30,"k")),
   A.tx(N[0],115,222,32,"b"),...[100,120,140,160,180,200].map((v,i)=>txe(v,C(i),222,30,"b")),
   A.tx(N[1],115,302,32,"o"),...[0,40,80,120,160,200].map((v,i)=>txe(v,C(i),302,30,"o")),
   A.loop(C(5),220,44,118,"g"),...ansBox(L(t3("vecka 5: båda har 200 kr","week 5: both have 200 kr","الأسبوع 5: مع كلٍّ منهما 200 كرونة")),430,40)]}},
  {say:t3("En hamburgare kostar lika mycket som två läsk. Hamburgare plus läsk kostar 90 kr. Byt ut hamburgaren mot två läsk: tre läsk kostar 90 kr, så en läsk kostar 30 kr.",
   "A burger costs the same as two sodas. A burger plus a soda costs 90 kr. Replace the burger with two sodas: three sodas cost 90 kr, so one soda costs 30 kr.",
   "سعر الهامبرغر يساوي سعر علبتَي مشروب غازي. الهامبرغر مع علبة مشروب يكلّفان 90 كرونة. نعوّض عن الهامبرغر بعلبتين: ثلاث علب تكلّف 90 كرونة، إذن العلبة الواحدة تكلّف 30 كرونة."),
  draw:()=>{const kr=L(t3("90 kr","90 kr","90 كرونة"));return[...burger(200,110),A.tx("=",290,124,52),soda(370,108),soda(440,108),
   ...burger(200,250),A.tx("+",280,264,52),soda(350,248),A.tx("=",420,264,52),A.tx(kr,530,264,44),A.p(R.line(160,214,240,290,.2)+R.line(240,214,160,290,.2),"r",4.5),
   A.arrow(200,296,220,332,"g"),soda(190,370,"g"),soda(250,370,"g"),soda(320,370,"b"),A.tx("=",400,384,52),A.tx(kr,510,384,44),
   ...ansBox(L(t3("1 läsk = 30 kr","1 soda = 30 kr","علبة واحدة = 30 كرونة")),466,40,400)]}}]
});
Object.assign(HINTSX,{
 quad9:[{say:t3("Använd regeln: första termen i kvadrat, plus dubbla produkten, plus andra termen i kvadrat.","Use the rule: the first term squared, plus twice the product, plus the second term squared.","استخدم القاعدة: مربع الحدّ الأول، زائد ضعف حاصل الضرب، زائد مربع الحدّ الثاني."),cut:g=>g.sol.slice(0,g.hc)},
  {say:t3("Vilken regel passar? Tänk på tecknen och på mittentermen. Rita gärna arean som fyra delar.","Which rule fits? Think about the signs and the middle term. You can draw the area as four parts.","أيّ قاعدة تناسب؟ انتبه إلى الإشارات وإلى الحدّ الأوسط. يمكنك رسم المساحة أربعة أجزاء."),cut:g=>g.sol.slice(0,g.hc)},
  {say:t3("Leta efter en av reglerna. Ett tal som 41 kan du skriva som 40 + 1.","Look for one of the rules. A number like 41 can be written as 40 + 1.","ابحث عن قاعدة مناسبة. يمكنك أن تكتب عددًا مثل 41 على الصورة 40 + 1."),cut:g=>g.sol.slice(0,g.hc)}],
 qeq9:[{say:t3("Få x² ensamt först. Dra sedan roten ur, och glöm inte den negativa lösningen! En längd kan inte vara negativ.","Get x² on its own first. Then take the square root, and don't forget the negative solution! A length cannot be negative.","اجعل x² وحده أولًا، ثم خذ الجذر التربيعي، ولا تنسَ الحلّ السالب! الطول لا يكون سالبًا."),cut:g=>g.sol.slice(0,g.hc)},
  {say:t3("Produkten är 0. Sätt varje faktor lika med 0 och lös dem var för sig. Bryt ut t eller x först om det behövs.","The product is 0. Set each factor equal to 0 and solve them one at a time. Factor out t or x first if needed.","حاصل الضرب صفر. اجعل كل عامل يساوي صفرًا وحلّ كلّ معادلة وحدها. أخرج t أو x عاملًا مشتركًا أولًا إن لزم."),cut:g=>g.sol.slice(0,g.hc)},
  {say:t3("Läs av p och q. Sätt in i x = −p/2 ± √((p/2)² − q).","Read off p and q. Put them into x = −p/2 ± √((p/2)² − q).","حدّد p وq، ثم عوّض في الصيغة."),cut:g=>g.sol.slice(0,g.hc)}],
 formula9:[{say:t3("Byt ut bokstäverna mot talen. Räkna gånger och delat före plus och minus.","Replace the letters with the numbers. Do times and divide before plus and minus.","ضع الأعداد مكان الحروف. اضرب واقسم قبل الجمع والطرح."),cut:g=>g.sol.slice(0,g.hc)},
  {say:t3("Få bokstaven du söker ensam. Gör det motsatta räknesättet på båda sidor.","Get the letter you want on its own. Do the opposite operation on both sides.","اجعل الحرف المطلوب وحده، بإجراء العملية العكسية على الطرفين."),cut:g=>g.sol.slice(0,g.hc)},
  {say:t3("Ta först bort det som läggs till eller dras bort. Dela eller multiplicera sedan.","First remove what is added or subtracted. Then divide or multiply.","أزل أولًا ما يُضاف أو يُطرح، ثم اقسم أو اضرب."),cut:g=>g.sol.slice(0,g.hc)}],
 sys9:[{say:t3("Hitta punkten där linjerna korsar varandra. Läs av x först, sedan y.","Find the point where the lines cross. Read off x first, then y.","جد النقطة التي يتقاطع فيها المستقيمان. اقرأ x أولًا ثم y."),cut:g=>g.sol.slice(0,g.hc)},
  {say:t3("Båda uttrycken är lika med y. Sätt dem lika med varandra och lös ut x. Kostar lika mycket: sätt kostnaderna lika.","Both expressions are equal to y. Set them equal to each other and solve for x. Costs the same: set the costs equal.","كلا المقدارين يساوي y. اجعلهما متساويين ثم أوجد x. التكلفة نفسها: اجعل التكلفتين متساويتين."),cut:g=>g.sol.slice(0,g.hc)},
  {say:t3("Byt ut y i den andra ekvationen mot uttrycket från den första.","Replace y in the second equation with the expression from the first one.","عوّض عن y في المعادلة الثانية بالمقدار من المعادلة الأولى."),cut:g=>g.sol.slice(0,g.hc)}]
});
}
