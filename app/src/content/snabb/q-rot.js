import {A,LESSONS,R,pick,rint,t3} from "../../legacy/core.js";
/* =====================================================================
   SNABBMATTE · POTENSER OCH ROTEN UR: squares, square roots, powers with
   the rules for multiplying and dividing, powers of ten and standard form,
   cheat sheet.
   ===================================================================== */
import {lines,qMount,fitT,P,rowC,rowAt,rowW} from "./q-0kit.js";
{
const S=(sv,en,ar)=>t3(sv,en,ar);
const ds=x=>String(+(+x).toFixed(8)).replace(".",",").replace("-","−");
const big=n=>Math.abs(n)>=10000?(n<0?"−":"")+Math.abs(n).toLocaleString("sv-SE").replace(/\s/g," "):ds(n);
const LT2=(t,x,y,s,c="k",anc)=>Object.assign(A.tx(t,x,y,s,c,anc),{dur:220});
const hintT=(sv,en,ar,draw=[])=>({say:S(sv,en,ar),draw});
/* a row of text with exponents and roots, centred and shrunk to fit max px */
const rowFit=(str,cx,y,s,c,max=720)=>{const it=P(str);while(rowW(it,s)>max&&s>16)s-=2;return rowC(it,cx,y,s,c).acts};
const qB=(title,line,sz=80)=>[A.wipe(),A.tx(title,400,72,fitT(title,740,36),"b"),...rowFit(line,400,250,sz)];
const numQ=(title,line,ans,sol,hint,o={})=>({kind:"num",dec:true,ans,show:o.show||big(ans),signed:!!o.signed,q:o.q||qB(title,line),sol:[A.wipe(),...sol],hint});
/* "2⁴ · 2⁵ = 2^?" : the asked exponent drawn small and raised, in orange */
const askExp=(title,left)=>[A.wipe(),A.tx(title,400,72,fitT(title,740,36),"b"),...rowFit(left+"^?",400,250,80)];

/* an n×n grid of unit squares (side cell), shaded */
function grid(x,y,n,cell,c="b"){let d=R.rect(x,y,n*cell,n*cell,.4);for(let i=1;i<n;i++)d+=R.line(x+i*cell,y,x+i*cell,y+n*cell,.2)+R.line(x,y+i*cell,x+n*cell,y+i*cell,.2);
  return[A.hatch(`M${x},${y}h${n*cell}v${n*cell}h${-n*cell}Z`,c),A.p(d,"k",3)]}
/* a short number line from a to b (whole numbers) with one point marked */
function nl(a,b,v,lab,y=300){const x1=140,x2=660,X=t=>x1+(x2-x1)*(t-a)/(b-a);let d=R.line(x1,y,x2,y,.3);const o=[];
  for(let t=a;t<=b;t++){d+=R.line(X(t),y-14,X(t),y+14,.1);o.push(A.tx(t,X(t),y+50,32))}
  return[A.p(d,"k",3.5),...o,A.p(R.circ(X(v),y,9),"r",6),...rowFit(lab,X(v),y-44,32,"r")]}

/* ======================= drills ======================= */
function gSq(n){
  if(n===3){const k=rint(2,9),v=k*k/100;return numQ("Räkna ut:",`0,${k}^2`,v,lines([`0,${k}^2 = 0,${k} · 0,${k}`,`= ${ds(v)}`],["","två decimaler"],{s:56}),
    hintT(`Räkna ${k} · ${k} först. Svaret ska ha två decimaler.`,`Work out ${k} × ${k} first. The answer has two decimals.`,`احسب ${k} × ${k} أولًا، والناتج فيه منزلتان عشريتان.`))}
  if(n===4){const k=rint(2,9);return numQ("Räkna ut:",`(−${k})^2`,k*k,lines([`(−${k})^2 = (−${k}) · (−${k})`,`= ${k*k}`],["","minus gånger minus blir plus"],{s:56}),
    hintT("Minus gånger minus blir plus.","Minus times minus is plus.","السالب في السالب موجب."))}
  const k=n===0?rint(2,9):n===1?rint(11,15):rint(2,9)*10;
  return numQ("Räkna ut:",`${k}^2`,k*k,lines([`${k}^2 = ${k} · ${k}`,`= ${big(k*k)}`],["",""],{s:60}),
    hintT(`${k} i kvadrat betyder ${k} gånger ${k}.`,`${k} squared means ${k} times ${k}.`,`مربع ${k} يعني ${k} × ${k}.`))}
function gRoot(n){
  if(n===4){const N=pick([20,30,40,50,60,70,80,90,110,130]),lo=Math.floor(Math.sqrt(N)),right=`${lo} och ${lo+1}`,O=[`${lo-1} och ${lo}`,right,`${lo+1} och ${lo+2}`];
    return{kind:"choice",opts:O,ans:1,show:right,q:[A.wipe(),A.tx(`Mellan vilka heltal ligger √${N}?`,400,80,40,"b"),...rowFit(`√{${N}}`,400,270,110)],
      sol:[A.wipe(),...lines([`${lo}^2 = ${lo*lo}   och   ${lo+1}^2 = ${(lo+1)*(lo+1)}`,`${lo*lo} < ${N} < ${(lo+1)*(lo+1)}`,`√{${N}} ligger mellan ${lo} och ${lo+1}`],["","",""],{s:42})],
      hint:hintT("Vilka kvadrattal ligger närmast, under och över?","Which square numbers are closest, below and above?","ما أقرب عددين مربعين، أصغر منه وأكبر منه؟")}}
  if(n===3){const k=rint(2,9),N=k*k/100;return numQ("Räkna ut:",`√{${ds(N)}}`,k/10,lines([`0,${k} · 0,${k} = ${ds(N)}`,`√{${ds(N)}} = ${ds(k/10)}`],["",""],{s:56}),
    hintT(`Vilket decimaltal gånger sig självt blir ${ds(N)}? Tänk på ${k*k}.`,`Which decimal times itself is ${ds(N)}? Think of ${k*k}.`,`أي عدد عشري مضروب في نفسه يعطي ${ds(N)}؟ فكّر في ${k*k}.`))}
  const k=n===0?rint(2,9):n===1?rint(11,15):rint(2,9)*10,N=k*k;
  return numQ("Räkna ut:",`√{${big(N)}}`,k,lines([`${k} · ${k} = ${big(N)}`,`√{${big(N)}} = ${k}`],["vilket tal gånger sig självt?",""],{s:58}),
    hintT(`Vilket tal gånger sig självt blir ${big(N)}?`,`Which number times itself is ${big(N)}?`,`أي عدد مضروب في نفسه يعطي ${big(N)}؟`))}
function gPow(n){
  if(n<2){const [a,e]=n===0?[2,rint(3,6)]:pick([[3,3],[3,4],[4,3],[5,3]]),v=a**e;
    return numQ("Räkna ut:",`${a}^${e}`,v,lines([`${a}^${e} = ${Array(e).fill(a).join(" · ")}`,`= ${v}`],["",""],{s:56}),
      hintT(`Exponenten ${e} säger hur många gånger ${a} multipliceras med sig själv.`,`The exponent ${e} says how many times ${a} is multiplied by itself.`,`الأس ${e} يعني ضرب ${a} في نفسه ${e} مرات.`))}
  if(n===2){const a=pick([2,3,5,7,10]),m=rint(2,6),k=rint(2,6);return numQ("Vilken exponent ska stå vid frågetecknet?","",m+k,
      lines([`${a}^${m} · ${a}^${k} = ${a}^${m+k}`],["addera exponenterna: "+`${m} + ${k} = ${m+k}`],{s:60}),
      hintT("Samma bas, gånger: addera exponenterna.","Same base, multiplying: add the exponents.","أساس واحد مع الضرب: نجمع الأسس."),{show:String(m+k),q:askExp("Vilken exponent ska stå vid frågetecknet?",`${a}^${m} · ${a}^${k} = ${a}`)})}
  if(n===3){const a=pick([2,3,5,7,10]),m=rint(6,9),k=rint(2,5);return numQ("Vilken exponent ska stå vid frågetecknet?","",m-k,
      lines([`${a}^${m} / ${a}^${k} = ${a}^${m-k}`],["subtrahera exponenterna: "+`${m} − ${k} = ${m-k}`],{s:60}),
      hintT("Samma bas, division: subtrahera exponenterna.","Same base, dividing: subtract the exponents.","أساس واحد مع القسمة: نطرح الأسس."),{show:String(m-k),q:askExp("Vilken exponent ska stå vid frågetecknet?",`${a}^${m} / ${a}^${k} = ${a}`)})}
  const a=pick([2,3]),e=3,v=(-a)**e;return numQ("Räkna ut:",`(−${a})^${e}`,v,lines([`(−${a}) · (−${a}) · (−${a})`,`= ${a*a} · (−${a})`,`= ${ds(v)}`],["","minus · minus = plus","plus · minus = minus"],{s:52}),
    hintT("Ta två faktorer i taget. Minus gånger minus blir plus.","Take two factors at a time. Minus times minus is plus.","خذ عاملين في كل مرة. السالب في السالب موجب."),{signed:true})}
function gTen(n){
  if(n===0){const k=rint(2,6);return numQ("Räkna ut:",`10^${k}`,10**k,lines([`10^${k} = 1 följt av ${k} nollor`,`= ${big(10**k)}`],["",""],{s:52}),
    hintT("Exponenten säger hur många nollor det blir.","The exponent says how many zeros there are.","الأس يخبرك بعدد الأصفار."))}
  if(n===1){const m=rint(11,99)/10,k=rint(2,4),v=Math.round(m*10**k);return numQ("Skriv som ett vanligt tal:",`${ds(m)} · 10^${k}`,v,
      lines([`${ds(m)} · 10^${k}`,`= ${big(v)}`],["",`flytta kommat ${k} steg åt höger`],{s:56}),
      hintT(`Gånger 10^${k}: flytta kommat ${k} steg åt höger.`,`Times 10^${k}: move the comma ${k} places right.`,`الضرب في 10^${k}: انقل الفاصلة ${k} منازل إلى اليمين.`))}
  if(n===2){const m=rint(11,99)/10,k=rint(3,6),N=Math.round(m*10**k);return numQ("Skriv i grundpotensform. Vilken exponent?","",k,
      lines([`${big(N)} = ${ds(m)} · 10^${k}`],[`kommat flyttas ${k} steg åt vänster`],{s:56}),
      hintT(`Flytta kommat tills talet ligger mellan 1 och 10. Räkna stegen.`,`Move the comma until the number is between 1 and 10. Count the steps.`,`انقل الفاصلة حتى يصبح العدد بين 1 و10، وعُدّ الخطوات.`),{show:String(k),q:askExp("Skriv i grundpotensform. Vilken exponent?",`${big(N)} = ${ds(m)} · 10`)})}
  if(n===3){const d=rint(1,9),k=rint(2,4),N=d/10**k;return numQ("Skriv i grundpotensform. Vilken exponent?","",-k,
      lines([`${ds(N)} = ${d} · 10^−${k}`],[`kommat flyttas ${k} steg åt höger, exponenten blir negativ`],{s:56}),
      hintT("Ett litet tal (under 1) får en negativ exponent. Räkna stegen kommat flyttas.","A small number (below 1) gets a negative exponent. Count how far the comma moves.","العدد الصغير (أقل من 1) أسّه سالب. عُدّ خطوات انتقال الفاصلة."),{show:String(-k).replace("-","−"),signed:true,q:askExp("Skriv i grundpotensform. Vilken exponent?",`${ds(N)} = ${d} · 10`)})}
  const m=rint(11,99)/10,k=rint(2,3),v=m/10**k;return numQ("Skriv som ett vanligt tal:",`${ds(m)} · 10^−${k}`,+v.toFixed(8),
    lines([`${ds(m)} · 10^−${k}`,`= ${ds(v)}`],["",`flytta kommat ${k} steg åt vänster`],{s:56}),
    hintT(`Negativ exponent: flytta kommat ${k} steg åt vänster.`,`Negative exponent: move the comma ${k} places left.`,`أس سالب: انقل الفاصلة ${k} منازل إلى اليسار.`))}

/* ======================= the boards ======================= */
const steps=[],parts=[];const part=(icon,name,list)=>{parts.push({icon,name,at:steps.length});steps.push(...list)};
const ex=(sv,en,ar,rows,notes,o={s:56})=>({say:S(sv,en,ar),draw:()=>[A.wipe(),...lines(rows,notes,o)]});

part("⬛",S("Kvadrater","Squares","المربعات"),[
 {say:S("4² läses fyra i kvadrat, eller fyra upphöjt till två. Det betyder 4 · 4. Rita en kvadrat med sidan 4. Den har 16 rutor, alltså är 4² = 16.",
   "4² is read four squared. It means 4 × 4. Draw a square with side 4. It has 16 small squares, so 4² = 16.",
   "4² تُقرأ أربعة تربيع، وتعني 4 × 4. ارسم مربعًا ضلعه 4: فيه 16 مربعًا صغيرًا، إذن 4² = 16."),
  draw:()=>[A.wipe(),...grid(90,90,4,64),LT2("4",218,72,32,"r"),LT2("4",62,226,32,"r"),...rowFit("4^2",560,120,110,"b"),LT2("= 4 · 4",560,250,54),A.hl(450,290,220,80),A.tx("= 16",560,350,60,"g"),LT2("fyra i kvadrat",560,440,28,"o")]},
 {say:S("Lär dig kvadrattalen utantill. De kommer tillbaka när du räknar roten ur.","Learn the square numbers by heart. They come back when you take square roots.","احفظ الأعداد المربعة، فستحتاجها عند حساب الجذر."),
  draw:()=>{const o=[A.wipe(),A.tx("Kvadrattal",400,62,40,"b")];for(let k=1;k<=15;k++){const i=k-1,c=i%3,r=Math.floor(i/3),x=150+c*250,y=130+r*76;
    o.push(...rowFit(`${k}^2 = ${k*k}`,x,y-12,34,k>10?"o":"k"))}return o}},
 ex("Exempel 1: 7² är 7 · 7 = 49.","Example 1: 7² is 7 × 7 = 49.","مثال 1: ‏7² = 7 × 7 = 49.",[`7^2 = 7 · 7`,"= 49"],["",""]),
 ex("Exempel 2: 30² är 30 · 30. Räkna 3 · 3 = 9 och lägg till två nollor: 900.","Example 2: 30² is 30 × 30. Work out 3 × 3 = 9 and add two zeros: 900.","مثال 2: ‏30² = 30 × 30. احسب 3 × 3 = 9 وأضف صفرين: 900.",[`30^2 = 30 · 30`,"= 900"],["","3 · 3 = 9, två nollor"]),
 ex("Exempel 3: 0,3² är 0,3 · 0,3. 3 · 3 = 9, och svaret får två decimaler: 0,09.","Example 3: 0.3² is 0.3 × 0.3. 3 × 3 = 9, and the answer gets two decimals: 0.09.","مثال 3: ‏0,3² = 0,3 × 0,3. ‏3 × 3 = 9، والناتج له منزلتان عشريتان: 0,09.",[`0,3^2 = 0,3 · 0,3`,"= 0,09"],["","en decimal + en decimal = två"]),
 ex("Exempel 4: (−5)² är (−5) · (−5) = 25. Minus gånger minus blir plus. En kvadrat är aldrig negativ.","Example 4: (−5)² is (−5) × (−5) = 25. Minus times minus is plus. A square is never negative.","مثال 4: ‏(−5)² = (−5) × (−5) = 25. السالب في السالب موجب، فالمربع لا يكون سالبًا.",[`(−5)^2 = (−5) · (−5)`,"= 25"],["","minus gånger minus blir plus"]),
 {drill:{gen:gSq,n:5,intro:S("Din tur! Räkna kvadrater.","Your turn! Work out squares.","دورك! احسب المربعات.")}},
]);
part("√",S("Roten ur","Square roots","الجذر التربيعي"),[
 {say:S("Roten ur går baklänges. En kvadrat har arean 25. Hur lång är sidan? 5, för 5 · 5 = 25. Vi skriver √25 = 5.",
   "The square root goes backwards. A square has area 25. How long is the side? 5, because 5 × 5 = 25. We write √25 = 5.",
   "الجذر التربيعي هو العملية العكسية. مربع مساحته 25، فكم طول ضلعه؟ 5، لأن 5 × 5 = 25. نكتب √25 = 5."),
  draw:()=>[A.wipe(),...grid(90,100,5,52,"g"),LT2("arean = 25",220,90,28,"g"),LT2("?",220,400,40,"o"),...rowFit("√{25} = 5",570,150,72,"b"),LT2("eftersom",570,260,30),A.hl(470,290,200,74),A.tx("5 · 5 = 25",570,345,48,"g")]},
 {say:S("Kvadrat och roten ur tar ut varandra. 6 i kvadrat är 36. Roten ur 36 är 6.","Squaring and square root undo each other. 6 squared is 36. The square root of 36 is 6.","التربيع والجذر يلغي كل منهما الآخر: 6 تربيع = 36، وجذر 36 = 6."),
  draw:()=>[A.wipe(),A.tx("6",200,250,110),A.tx("36",600,250,110),A.arrow(260,200,540,200,"b",-50),LT2("i kvadrat  ( ² )",400,110,30,"b"),A.arrow(540,290,260,290,"g",-50),LT2("roten ur  ( √ )",400,410,30,"g")]},
 ex("Exempel 1: √49 = 7, för 7 · 7 = 49.","Example 1: √49 = 7, because 7 × 7 = 49.","مثال 1: ‏√49 = 7 لأن 7 × 7 = 49.",["7 · 7 = 49","√{49} = 7"],["vilket tal gånger sig självt?",""]),
 ex("Exempel 2: √900 = 30, för 30 · 30 = 900.","Example 2: √900 = 30, because 30 × 30 = 900.","مثال 2: ‏√900 = 30 لأن 30 × 30 = 900.",["30 · 30 = 900","√{900} = 30"],["",""]),
 ex("Exempel 3: √0,25 = 0,5, för 0,5 · 0,5 = 0,25.","Example 3: √0.25 = 0.5, because 0.5 × 0.5 = 0.25.","مثال 3: ‏√0,25 = 0,5 لأن 0,5 × 0,5 = 0,25.",["0,5 · 0,5 = 0,25","√{0,25} = 0,5"],["",""]),
 {say:S("Exempel 4: √50 är inget heltal. 7² = 49 och 8² = 64, så √50 ligger mellan 7 och 8, nära 7. Ungefär 7,1.","Example 4: √50 is not a whole number. 7² = 49 and 8² = 64, so √50 is between 7 and 8, close to 7. About 7.1.","مثال 4: ‏√50 ليس عددًا صحيحًا. ‏7² = 49 و8² = 64، إذن √50 بين 7 و8 وقريب من 7، تقريبًا 7,1."),
  draw:()=>[A.wipe(),...rowFit("7^2 = 49",200,100,44),A.tx("50",400,116,44,"r"),...rowFit("8^2 = 64",600,100,44),LT2("49 < 50 < 64",400,190,36,"o"),...nl(6,9,Math.sqrt(50),"√{50} ≈ 7,1",330)]},
 {drill:{gen:gRoot,n:5,intro:S("Din tur! Räkna roten ur.","Your turn! Work out square roots.","دورك! احسب الجذور.")}},
]);
part("🔺",S("Potenser","Powers","القوى"),[
 {say:S("En potens är en kort skrivning för upprepad multiplikation. I 2⁵ är 2 basen och 5 exponenten. 2⁵ = 2 · 2 · 2 · 2 · 2 = 32.",
   "A power is a short way to write repeated multiplication. In 2⁵, 2 is the base and 5 is the exponent. 2⁵ = 2 × 2 × 2 × 2 × 2 = 32.",
   "القوة طريقة مختصرة لكتابة ضرب متكرر. في 2⁵ العدد 2 هو الأساس و5 هو الأس. ‏2⁵ = 2 × 2 × 2 × 2 × 2 = 32."),
  draw:()=>[A.wipe(),A.tx("2",330,220,150,"b"),A.tx("5",405,130,80,"r"),A.arrow(250,250,305,215,"b",-20),LT2("bas",215,285,32,"b"),A.arrow(520,96,440,108,"r",20),LT2("exponent",610,100,32,"r"),
   LT2("= 2 · 2 · 2 · 2 · 2",400,340,44),A.hl(300,375,200,74),A.tx("= 32",400,432,56,"g")]},
 {say:S("Två regler när basen är samma. Gånger: addera exponenterna. Delat med: subtrahera dem. Och allt upphöjt till noll är 1.","Two rules when the base is the same. Multiplying: add the exponents. Dividing: subtract them. And anything to the power zero is 1.","قاعدتان عندما يكون الأساس نفسه: في الضرب نجمع الأسس، وفي القسمة نطرحها. وأي عدد أسه صفر يساوي 1."),
  draw:()=>[A.wipe(),A.band(40,30,720,440,"v"),A.tx("Samma bas",400,86,40,"v"),...[["a^3 · a^2 = (a · a · a) · (a · a) = a^5","gånger: 3 + 2 = 5"],["a^5 / a^2 = a^3","delat med: 5 − 2 = 3"],["a^0 = 1","till exempel 7^0 = 1"]]
   .flatMap(([r,n],i)=>[...rowAt(P(r),80,170+i*110,40,"k").acts,...rowFit(n,240,170+i*110+56,26,"o",300).map(x=>x)])]},
 ex("Exempel 1: 3⁴ = 3 · 3 · 3 · 3 = 81.","Example 1: 3⁴ = 3 × 3 × 3 × 3 = 81.","مثال 1: ‏3⁴ = 3 × 3 × 3 × 3 = 81.",[`3^4 = 3 · 3 · 3 · 3`,"= 81"],["","9 · 9 = 81"]),
 ex("Exempel 2: 2³ · 2⁴ = 2⁷, för 3 + 4 = 7. Och 2⁷ = 128.","Example 2: 2³ × 2⁴ = 2⁷, because 3 + 4 = 7. And 2⁷ = 128.","مثال 2: ‏2³ × 2⁴ = 2⁷ لأن 3 + 4 = 7، و2⁷ = 128.",[`2^3 · 2^4 = 2^7`,"= 128"],["addera: 3 + 4 = 7",""]),
 ex("Exempel 3: 5⁶ / 5⁴ = 5², för 6 − 4 = 2. Och 5² = 25.","Example 3: 5⁶ ÷ 5⁴ = 5², because 6 − 4 = 2. And 5² = 25.","مثال 3: ‏5⁶ ÷ 5⁴ = 5² لأن 6 − 4 = 2، و5² = 25.",[`5^6 / 5^4 = 5^2`,"= 25"],["subtrahera: 6 − 4 = 2",""]),
 ex("Exempel 4: (−2)³ = (−2) · (−2) · (−2) = −8. Udda exponent och negativ bas ger ett negativt svar.","Example 4: (−2)³ = (−2) × (−2) × (−2) = −8. An odd exponent with a negative base gives a negative answer.","مثال 4: ‏(−2)³ = (−2) × (−2) × (−2) = −8. أس فردي مع أساس سالب يعطي ناتجًا سالبًا.",[`(−2)^3 = (−2) · (−2) · (−2)`,"= 4 · (−2)","= −8"],["","",""],{s:50}),
 {drill:{gen:gPow,n:5,intro:S("Din tur! Räkna med potenser.","Your turn! Work with powers.","دورك! احسب بالقوى.")}},
]);
part("🔟",S("Tiopotenser","Powers of ten","قوى العشرة"),[
 {say:S("Tiopotenser. Exponenten säger hur många steg kommat flyttas. 10³ = 1000. 10⁰ = 1. Negativ exponent ger små tal: 10⁻² = 0,01.",
   "Powers of ten. The exponent says how many places the comma moves. 10³ = 1000. 10⁰ = 1. A negative exponent gives small numbers: 10⁻² = 0.01.",
   "قوى العشرة: الأس يخبرك بعدد منازل انتقال الفاصلة. ‏10³ = 1000، و10⁰ = 1. والأس السالب يعطي أعدادًا صغيرة: 10⁻² = 0,01."),
  draw:()=>{const o=[A.wipe()],R_=[[3,"1 000"],[2,"100"],[1,"10"],[0,"1"],[-1,"0,1"],[-2,"0,01"],[-3,"0,001"]];
   R_.forEach(([e,v],i)=>{const y=60+i*62,c=e<0?"r":e===0?"g":"b";{const it=P(`10^${String(e).replace("-","−")}`);o.push(...rowAt(it,300-rowW(it,44),y-2,44,c).acts)}o.push(Object.assign(A.tx("=",340,y+14,40),{dur:60}),Object.assign(A.tx(v,380,y+14,44,c,"start"),{dur:110}))});
   o.push(LT2("stora tal",640,140,28,"b"),LT2("små tal",640,380,28,"r"));return o}},
 {say:S("Grundpotensform: ett tal mellan 1 och 10 gånger en tiopotens. 3 400 000: flytta kommat 6 steg åt vänster, så blir det 3,4 · 10⁶.",
   "Standard form: a number between 1 and 10 times a power of ten. 3,400,000: move the comma 6 places left, and it becomes 3.4 × 10⁶.",
   "الصيغة العلمية: عدد بين 1 و10 مضروب في قوة للعشرة. ‏3400000: ننقل الفاصلة 6 منازل إلى اليسار فيصبح 3,4 × 10⁶."),
  draw:()=>[A.wipe(),...lines(["3 400 000","= 3,4 · 1 000 000","= 3,4 · 10^6"],["","3,4 ligger mellan 1 och 10","1 000 000 har sex nollor"],{s:54})]},
 ex("Exempel 1: 52 000 = 5,2 · 10⁴. Kommat flyttas 4 steg.","Example 1: 52,000 = 5.2 × 10⁴. The comma moves 4 places.","مثال 1: ‏52000 = 5,2 × 10⁴، تنتقل الفاصلة 4 منازل.",["52 000",`= 5,2 · 10^4`],["","kommat 4 steg åt vänster"]),
 ex("Exempel 2: 0,007 = 7 · 10⁻³. Ett litet tal får negativ exponent.","Example 2: 0.007 = 7 × 10⁻³. A small number gets a negative exponent.","مثال 2: ‏0,007 = 7 × 10⁻³، العدد الصغير أسّه سالب.",["0,007",`= 7 · 10^−3`],["","kommat 3 steg åt höger"]),
 ex("Exempel 3: 6,1 · 10⁵ = 610 000. Flytta kommat 5 steg åt höger.","Example 3: 6.1 × 10⁵ = 610,000. Move the comma 5 places right.","مثال 3: ‏6,1 × 10⁵ = 610000، ننقل الفاصلة 5 منازل إلى اليمين.",[`6,1 · 10^5`,"= 610 000"],["","kommat 5 steg åt höger"]),
 ex("Exempel 4: 2,5 · 10⁻² = 0,025. Flytta kommat 2 steg åt vänster.","Example 4: 2.5 × 10⁻² = 0.025. Move the comma 2 places left.","مثال 4: ‏2,5 × 10⁻² = 0,025، ننقل الفاصلة منزلتين إلى اليسار.",[`2,5 · 10^−2`,"= 0,025"],["","kommat 2 steg åt vänster"]),
 {drill:{gen:gTen,n:5,intro:S("Din tur! Räkna med tiopotenser.","Your turn! Work with powers of ten.","دورك! احسب بقوى العشرة.")}},
]);
const card=(x,y,c,head,line,rule)=>[A.band(x,y,360,222,c),A.tx(head,x+180,y+40,28,c),...rowFit(line,x+180,y+112,36,"k",330),A.tx(rule,x+180,y+195,fitT(rule,330,24),"k")];
part("📋",S("Kom ihåg","Remember","تذكّر"),[
 {say:S("Allt om potenser och roten ur på en tavla.","Everything about powers and roots on one board.","كل شيء عن القوى والجذور على لوحة واحدة."),
  draw:()=>[A.wipe(),...card(30,16,"b","Kvadrat",`7^2 = 7 · 7 = 49`,"(−5)² = 25, aldrig negativ"),...card(410,16,"g","Roten ur","√49 = 7","vilket tal gånger sig självt?"),
   ...card(30,262,"v","Potenser",`a^3 · a^2 = a^5`,"gånger: addera, delat: subtrahera"),...card(410,262,"o","Tiopotenser",`52 000 = 5,2 · 10^4`,"exponenten = steg för kommat")]},
]);

LESSONS.push({id:"qrot",subject:"quick",grades:"7–9",kind:"wb",
 title:t3("Potenser och roten ur: allt på ett ställe","Powers and roots: everything in one place","القوى والجذور: كل شيء في مكان واحد"),icon:"",
 steps,parts,mount:qMount({steps})});
}
