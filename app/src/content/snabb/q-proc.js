import {A,LESSONS,R,pick,rint,t3} from "../../legacy/core.js";
/* =====================================================================
   SNABBMATTE · PROCENT: percent as hundredths, percent of, what percent,
   increase and decrease (change factor), the whole from a part, cheat sheet.
   A bar model (0 % ... 100 %) shows every kind of question.
   ===================================================================== */
import {LRI,F,X,work,lines,rules,qMount,qBoard,fitT} from "./q-0kit.js";
{
const S=(sv,en,ar)=>t3(sv,en,ar);
const ds=x=>String(+(+x).toFixed(6)).replace(".",",");
const P=x=>`${ds(x)} %`;
const LT2=(t,x,y,s,c="k",anc)=>Object.assign(A.tx(t,x,y,s,c,anc),{dur:220});
const hintT=(sv,en,ar,draw=[])=>({say:S(sv,en,ar),draw});
const hintLine=t=>[A.tx(t,400,445,fitT(t,700,30),"o")];

/* the bar model: 0..100 % above, 0..whole below; the part hatched; `ask` puts an orange "?" where the unknown is */
function barM(pct,part,whole,ask,y=70,c="b"){const x0=90,W0=620,sc=W0/Math.max(100,pct),w=100*sc,h=64,xp=x0+pct*sc,o=[A.p(R.rect(x0,y,w,h,.4),"k",4)];
  if(pct>100)o.push(A.p(R.rect(x0+w,y,(pct-100)*sc,h,.3),c,4));
  if(pct>0)o.push(A.hatch(`M${x0},${y}h${pct*sc}v${h}h${-pct*sc}Z`,c),A.p(R.line(xp,y-12,xp,y+h+12,.2),c,4));
  const lab=(t,x,yy,col,sz=28)=>Object.assign(A.tx(t,x,yy,sz,col),{dur:160});
  /* labels at the marker move aside when they would sit on top of the 0 or 100 labels */
  const xl=pct===100?xp:pct<100?Math.max(x0+75,Math.min(xp,x0+w-80)):Math.max(xp,x0+w+80);
  o.push(lab("0 %",x0,y-16,"#7d8aa5",22),lab(ask==="pct"?"? %":P(pct),xl,y-16,ask==="pct"?"o":c),...(pct===100?[]:[lab("100 %",x0+w,y-16,"k",22)]));
  o.push(lab("0",x0,y+h+34,"#7d8aa5",22),...(pct===100?[]:[lab(ask==="part"?"?":typeof part==="string"?part:ds(part),xl,y+h+34,ask==="part"?"o":c)]),lab(ask==="whole"?"?":ds(whole),x0+w,y+h+34,ask==="whole"?"o":"k"));
  return o}
const board=(bar,w)=>[A.wipe(),...bar,...(w.L?lines(w.L,w.notes||[],{s:44,y0:290,gap:104}):work(w.prob,w.rows,w.notes,{s:46,y0:w.rows.length>2?250:270,gap:w.rows.length>2?84:96}))];

/* worked lines for each kind of question */
const ofW=(p,n)=>({prob:[X(`${P(p)} av ${ds(n)}`)],rows:[[X(`${ds(p/100)} · ${ds(n)}`)],[X(ds(p*n/100))]],notes:[`${P(p)} = ${ds(p/100)}`,""]});
const shareW=(a,n)=>({prob:[X(`${ds(a)} av ${ds(n)}`)],rows:[[F(a,n)],[X(ds(a/n))],[X(P(+(a/n*100).toFixed(4)))]],notes:["delen / det hela","",""]});
const chgW=(n,p,up)=>{const f=+(1+(up?p:-p)/100).toFixed(4);return{L:[`100 % ${up?"+":"−"} ${P(p)} = ${P(100+(up?p:-p))} = ${ds(f)}`,`${ds(f)} · ${ds(n)} = ${ds(+(f*n).toFixed(4))}`],
  notes:["förändringsfaktorn",up?"det nya":"det som är kvar"],f}};
const wholeW=(p,a)=>({L:[`${ds(a)} / ${ds(p)} = ${ds(+(a/p).toFixed(4))}`,`${ds(+(a/p).toFixed(4))} · 100 = ${ds(a*100/p)}`],notes:["1 % är","100 % är"]});
const numQ=(title,line,ans,sol,hint,unit="")=>({kind:"num",dec:true,ans,show:ds(ans)+unit,q:[A.wipe(),A.tx(title,400,72,fitT(title,740,36),"b"),A.tx(line,400,250,fitT(line,720,70))],sol,hint});

/* ======================= drills ======================= */
function gBas(n){
  if(n===0){const v=rint(11,99);return numQ("Skriv i procent:",`${ds(v/100)} = ? %`,v,[A.wipe(),...work([X(ds(v/100))],[[X(`${v} hundradelar`)],[X(P(v))]],["","procent = hundradelar"],{s:54})],
    hintT("Procent betyder hundradelar. Hur många hundradelar är det?","Percent means hundredths. How many hundredths is it?","النسبة المئوية تعني أجزاء من مئة. كم جزءًا من مئة هذا؟")," %")}
  if(n===1||n===3){const v=n===1?rint(1,9)*10:rint(1,9);return numQ("Skriv som decimaltal:",`${P(v)} = ?`,v/100,[A.wipe(),...work([X(P(v))],[[F(v,100)],[X(ds(v/100))]],["",""],{s:56})],
    hintT(`${v} % är ${v} hundradelar, alltså ${v}/100.`,`${v}% is ${v} hundredths, so ${v}/100.`,`${LRI(v+" %")} تعني ${v} من مئة أي ${LRI(v+"/100")}.`))}
  const [p,q]=n===2?pick([[1,2],[1,4],[3,4],[1,5],[2,5],[3,10],[7,20]]):pick([[1,8],[3,8],[1,40],[5,8],[3,40]]),v=p/q*100,f=100/q;
  return numQ("Skriv i procent:",`${p}/${q} = ? %`,v,[A.wipe(),...work([F(p,q)],Number.isInteger(f)?[[F(`${p}·${f}`,`${q}·${f}`)],[F(p*f,100)],[X(P(v))]]:[[X(`${p} / ${q} = ${ds(p/q)}`)],[X(P(v))]],
    Number.isInteger(f)?[`förläng till hundradelar`,"",""]:["räkna ut bråket",""],{s:46})],
    hintT("Gör nämnaren till 100, eller räkna täljaren delat med nämnaren och gånger 100.","Make the denominator 100, or work out numerator ÷ denominator and multiply by 100.","اجعل المقام 100، أو اقسم البسط على المقام واضرب في 100.")," %")}
function gOf(n){const p=[pick([10,10,50]),pick([50,25]),pick([20,30,40,60]),pick([5,15]),pick([12,35,8,65])][n],
  n0=[rint(2,40)*10,rint(2,30)*4,rint(2,20)*10,rint(2,30)*20,rint(2,9)*100][n],r=p*n0/100,w=ofW(p,n0);
  return numQ("Räkna ut:",`${P(p)} av ${n0}`,r,board(barM(p,r,n0,null),w),
    p===10?hintT("10 % är en tiondel: dela med 10.","10% is one tenth: divide by 10.","‏10 % هي العُشر: اقسم على 10."):p===50||p===25?hintT(`${p} % är ${p===50?"hälften":"en fjärdedel"}.`,`${p}% is ${p===50?"a half":"a quarter"}.`,`${LRI(p+" %")} تساوي ${p===50?"النصف":"الربع"}.`)
    :hintT(`Skriv ${p} % som decimaltal, ${ds(p/100)}, och multiplicera. Eller räkna 10 % först.`,`Write ${p}% as a decimal, ${ds(p/100).replace(",",".")}, and multiply. Or find 10% first.`,`اكتب ${LRI(p+" %")} عددًا عشريًا ${LRI(ds(p/100))} واضرب، أو احسب ‏10 % أولًا.`,hintLine(`10 % av ${n0} = ${ds(n0/10)}`)))}
function gShare(n){const [a,t]=[[rint(1,9)*10,100],[rint(1,4)*5,20],[pick([6,12,18,24,36]),48],[pick([3,6,9,12,15]),60],[pick([1,3,5,7]),8]][n],v=+(a/t*100).toFixed(4);
  return numQ("Hur många procent?",`${a} av ${t} = ? %`,v,board(barM(v,a,t,"pct"),shareW(a,t)),
    hintT("Delen delat med det hela ger andelen. Gör om till procent.","The part divided by the whole gives the share. Turn it into percent.","الجزء مقسومًا على الكل يعطي النسبة، ثم حوّلها إلى نسبة مئوية.",hintLine(`${a} / ${t} = ?`))," %")}
function gChg(n){
  if(n===2){const p=rint(2,40),up=Math.random()<.5,f=+(1+(up?p:-p)/100).toFixed(2);return numQ("Vilken förändringsfaktor?",`${up?"öka":"minska"} med ${P(p)}`,f,
    [A.wipe(),...lines([`100 % ${up?"+":"−"} ${P(p)} = ${P(100+(up?p:-p))}`,`${P(100+(up?p:-p))} = ${ds(f)}`],[up?"det nya är":"kvar är","som decimaltal"],{s:50})],
    hintT("Det nya är 100 % plus eller minus förändringen. Skriv det som decimaltal.","The new amount is 100% plus or minus the change. Write it as a decimal.","الجديد يساوي ‏100 % زائد التغيّر أو ناقصه. اكتبه عددًا عشريًا."))}
  if(n===4){const a=rint(2,8)*50,p=pick([10,20,25,40,50]),b=a*(1+p/100);return numQ("Hur många procent har priset ökat?",`${a} kr → ${b} kr`,p,
    [A.wipe(),...barM(100+p,b,a,"pct",70,"g"),...lines([`${b} − ${a} = ${b-a}`,`${b-a} / ${a} = ${ds((b-a)/a)} = ${P(p)}`],["ökningen","jämför med det gamla priset"],{s:44,y0:290,gap:104})],
    hintT("Räkna först hur mycket priset ökade. Dela sedan med det gamla priset.","First work out how much the price rose. Then divide by the old price.","احسب أولًا مقدار الزيادة، ثم اقسمه على السعر القديم.")," %")}
  const up=n===0,p=up?pick([10,20,25,50]):pick([10,20,30,40,25]),a=up?rint(2,9)*100:rint(2,12)*50,w=chgW(a,p,up);
  return numQ(up?"Öka med procent:":"Rea! Vad blir det nya priset?",up?`${a} ökar med ${P(p)}`:`${a} kr, ${P(p)} rabatt`,+(w.f*a).toFixed(4),board(barM(up?100+p:100-p,+(w.f*a).toFixed(2),a,null,70,up?"g":"r"),w),
    hintT(up?`Det nya är ${100+p} % av det gamla.`:`Efter rean är det ${100-p} % kvar.`,up?`The new amount is ${100+p}% of the old.`:`After the sale ${100-p}% is left.`,up?`الجديد يساوي ${LRI((100+p)+" %")} من القديم.`:`بعد التخفيض يبقى ${LRI((100-p)+" %")}.`),n===1?" kr":"")}
function gWhole(n){const p=[10,50,25,20,30][n],w0=[rint(3,30)*10,rint(10,60)*2,rint(4,30)*4,rint(5,30)*5,rint(2,20)*10][n],a=w0*p/100;
  return numQ("Hur mycket är det hela (100 %)?",`${P(p)} är ${a}`,w0,board(barM(p,a,w0,"whole"),wholeW(p,a)),
    hintT(`Om ${p} % är ${a}, hur mycket är då 1 %? Gånger 100 ger det hela.`,`If ${p}% is ${a}, how much is 1%? Times 100 gives the whole.`,`إذا كانت ${LRI(p+" %")} تساوي ${a}، فكم تساوي ‏1 %؟ اضرب في 100 لتحصل على الكل.`,hintLine(`1 % = ${a} / ${p}`)))}

/* ======================= the boards ======================= */
const steps=[],parts=[];const part=(icon,name,list)=>{parts.push({icon,name,at:steps.length});steps.push(...list)};
const ex=(bar,w,say)=>({say,draw:()=>board(bar,w)});
function grid(x,y,c,k,col){const o=[];let h="";for(let i=1;i<10;i++)h+=`M${x+i*c},${y}v${10*c}M${x},${y+i*c}h${10*c}`;o.push(A.p(R.rect(x,y,10*c,10*c,.3),"k",3.5),A.p(h,"#9aa8c4",1.4));
  const C=Math.floor(k/10),r=k%10;if(C)o.push(A.hatch(`M${x},${y}h${C*c}v${10*c}h${-C*c}Z`,col));if(r)o.push(A.hatch(`M${x+C*c},${y}h${c}v${r*c}h${-c}Z`,col));return o}

part("💯",S("Grunder","Basics","الأساسيات"),[
 {say:S("Procent betyder hundradelar. 25 % är 25 av 100 rutor. Det är samma sak som 0,25 och 25/100 = 1/4.",
   "Percent means hundredths. 25% is 25 of 100 squares. That is the same as 0.25 and 25/100 = 1/4.",
   "النسبة المئوية تعني أجزاء من مئة. ‏25 % هي 25 مربعًا من 100، وهذا يساوي 0,25 و25/100 = 1/4."),
  draw:()=>[A.wipe(),...grid(70,60,36,25,"b"),LT2("25 %",620,120,70,"b"),LT2("= 0,25",620,220,50),LT2("= 25/100",620,300,44),LT2("= 1/4",620,380,50,"g")]},
 {say:S("Lär dig de vanligaste utantill: 50 % är hälften, 25 % en fjärdedel, 10 % en tiondel och 1 % en hundradel.",
   "Learn the most common ones by heart: 50% is a half, 25% a quarter, 10% a tenth and 1% a hundredth.",
   "احفظ الأكثر شيوعًا: ‏50 % النصف، و25 % الربع، و10 % العُشر، و1 % جزء من مئة."),
  draw:()=>{const o=[A.wipe(),LT2("procent",160,60,30,"b"),LT2("bråk",400,60,30,"r"),LT2("decimaltal",640,60,30,"g")];
   [["100 %","1","1"],["50 %","1/2","0,5"],["25 %","1/4","0,25"],["10 %","1/10","0,1"],["1 %","1/100","0,01"]].forEach(([a,b,c],i)=>{const y=125+i*76;
    o.push(A.tx(a,160,y,40,"b"),A.tx(b,400,y,40,"r"),A.tx(c,640,y,40,"g"),A.p(R.line(60,y+22,740,y+22,.3),"#c9d2e3",2))});return o}},
 {say:S("Så byter du form: procent till decimaltal, dela med 100 (kommat två steg åt vänster). Decimaltal till procent, gånger 100. Bråk till procent: gör nämnaren till 100.",
   "How to switch: percent to decimal, divide by 100 (comma two places left). Decimal to percent, times 100. Fraction to percent: make the denominator 100.",
   "طريقة التحويل: من نسبة مئوية إلى عدد عشري نقسم على 100 (الفاصلة منزلتين إلى اليسار)، ومن عدد عشري إلى نسبة مئوية نضرب في 100. ومن كسر إلى نسبة مئوية نجعل المقام 100."),
  draw:()=>[A.wipe(),A.tx("35 %",180,120,64,"b"),A.tx("0,35",620,120,64,"g"),A.arrow(260,90,540,90,"g",-30),LT2("/ 100",400,58,28,"g"),A.arrow(540,150,260,150,"b",-30),LT2("· 100",400,200,28,"b"),
   ...work([F(3,5)],[[F("3·20","5·20")],[F(60,100)],[X("60 %")]],["","",""],{s:40,y0:280,gap:70})]},
 {drill:{gen:gBas,n:5,intro:S("Din tur! Byt mellan procent, bråk och decimaltal.","Your turn! Switch between percent, fractions and decimals.","دورك! حوّل بين النسب المئوية والكسور والأعداد العشرية.")}},
]);
part("🔢",S("Procent av","Percent of","النسبة من عدد"),[
 {say:S("Procent av ett tal: skriv procenten som decimaltal och multiplicera. 20 % av 80 = 0,20 · 80 = 16. I bilden är hela stapeln 80, och 20 % av den är 16.",
   "Percent of a number: write the percent as a decimal and multiply. 20% of 80 = 0.20 × 80 = 16. In the picture the whole bar is 80, and 20% of it is 16.",
   "النسبة من عدد: اكتب النسبة عددًا عشريًا واضرب. ‏20 % من 80 = 0,20 × 80 = 16. في الصورة الشريط كله 80، و20 % منه 16."),draw:()=>board(barM(20,16,80,null),ofW(20,80))},
 {say:S("Huvudräkning: börja med 10 %, det är en tiondel. 10 % av 240 är 24. Då är 5 % hälften, 12, och 15 % är 24 + 12 = 36.",
   "Mental maths: start with 10%, which is one tenth. 10% of 240 is 24. Then 5% is half of that, 12, and 15% is 24 + 12 = 36.",
   "الحساب الذهني: ابدأ بـ 10 % وهي العُشر. ‏10 % من 240 تساوي 24، و5 % نصفها أي 12، و15 % تساوي ‏24 + 12 = 36."),
  draw:()=>[A.wipe(),...barM(15,36,240,null),A.tx("10 % av 240 = 24",400,250,44,"b"),A.tx("5 % av 240 = 12",400,320,44,"r"),A.hl(230,350,340,70),A.tx("15 % = 24 + 12 = 36",400,402,44,"g")]},
 ex(barM(10,35,350,null),ofW(10,350),S("Exempel 1: 10 % av 350. En tiondel av 350 är 35.","Example 1: 10% of 350. One tenth of 350 is 35.","مثال 1: ‏10 % من 350. عُشر 350 هو 35.")),
 ex(barM(25,16,64,null),ofW(25,64),S("Exempel 2: 25 % av 64. 25 % är en fjärdedel: 64 / 4 = 16.","Example 2: 25% of 64. 25% is a quarter: 64 ÷ 4 = 16.","مثال 2: ‏25 % من 64. ‏25 % هي الربع: ‏64 ÷ 4 = 16.")),
 ex(barM(30,27,90,null),ofW(30,90),S("Exempel 3: 30 % av 90. 0,3 · 90 = 27. Eller: 10 % är 9, gånger 3 är 27.","Example 3: 30% of 90. 0.3 × 90 = 27. Or: 10% is 9, times 3 is 27.","مثال 3: ‏30 % من 90. ‏0,3 × 90 = 27. أو: ‏10 % تساوي 9، وفي 3 تساوي 27.")),
 ex(barM(12,42,350,null),ofW(12,350),S("Exempel 4: 12 % av 350. 0,12 · 350 = 42.","Example 4: 12% of 350. 0.12 × 350 = 42.","مثال 4: ‏12 % من 350. ‏0,12 × 350 = 42.")),
 {drill:{gen:gOf,n:5,intro:S("Din tur! Räkna procent av.","Your turn! Work out percent of.","دورك! احسب النسبة من العدد.")}},
]);
part("❓",S("Hur många procent?","What percent?","كم بالمئة؟"),[
 {say:S("Hur många procent är 12 av 48? Dela delen med det hela: 12 / 48 = 0,25. Det är 25 %. Kom ihåg: delen genom det hela.",
   "What percent is 12 of 48? Divide the part by the whole: 12 ÷ 48 = 0.25. That is 25%. Remember: the part over the whole.",
   "كم بالمئة تمثّل 12 من 48؟ اقسم الجزء على الكل: ‏12 ÷ 48 = 0,25 أي 25 %. تذكّر: الجزء على الكل."),draw:()=>board(barM(25,12,48,"pct"),shareW(12,48))},
 ex(barM(40,8,20,"pct"),shareW(8,20),S("Exempel 1: 8 av 20 elever cyklar. 8 / 20 = 0,4 = 40 %.","Example 1: 8 of 20 pupils cycle. 8 ÷ 20 = 0.4 = 40%.","مثال 1: ‏8 من 20 تلميذًا يركبون الدراجة. ‏8 ÷ 20 = 0,4 = 40 %.")),
 ex(barM(15,9,60,"pct"),shareW(9,60),S("Exempel 2: 9 av 60. 9 / 60 = 0,15 = 15 %.","Example 2: 9 of 60. 9 ÷ 60 = 0.15 = 15%.","مثال 2: ‏9 من 60. ‏9 ÷ 60 = 0,15 = 15 %.")),
 ex(barM(87.5,7,8,"pct"),shareW(7,8),S("Exempel 3: 7 av 8 rätt på provet. 7 / 8 = 0,875 = 87,5 %.","Example 3: 7 of 8 right on the test. 7 ÷ 8 = 0.875 = 87.5%.","مثال 3: ‏7 إجابات صحيحة من 8 في الاختبار. ‏7 ÷ 8 = 0,875 = 87,5 %.")),
 ex(barM(60,3,5,"pct"),shareW(3,5),S("Exempel 4: 3 av 5. 3 / 5 = 0,6 = 60 %.","Example 4: 3 of 5. 3 ÷ 5 = 0.6 = 60%.","مثال 4: ‏3 من 5. ‏3 ÷ 5 = 0,6 = 60 %.")),
 {drill:{gen:gShare,n:5,intro:S("Din tur! Hur många procent?","Your turn! What percent?","دورك! كم بالمئة؟")}},
]);
part("📈",S("Ökning och minskning","Increase and decrease","الزيادة والنقصان"),[
 {say:S("Ökar något med 20 % blir det 120 % av det gamla. 120 % = 1,2, det kallas förändringsfaktorn. Minskar något med 30 % är 70 % kvar, faktorn är 0,7.",
   "If something increases by 20%, it becomes 120% of the old. 120% = 1.2, which is called the change factor. If something decreases by 30%, 70% is left; the factor is 0.7.",
   "إذا زاد شيء بنسبة 20 % يصبح ‏120 % من القديم، و120 % = 1,2 وتسمّى عامل التغيّر. وإذا نقص بنسبة 30 % يبقى ‏70 %، والعامل 0,7."),
  draw:()=>[A.wipe(),...barM(120,"nytt",100,null,60,"g").filter(x=>!(x.t==="text"&&/^(0|100)$/.test(x.s))),LT2("+20 %",658,102,24,"g"),LT2("120 % = 1,2",400,215,44,"g"),
   ...barM(70,"",100,null,270,"r").filter(x=>!(x.t==="text"&&/^(0|100|)$/.test(x.s))),A.p(R.line(540,284,694,324,.2)+R.line(694,284,540,324,.2),"r",4),LT2("−30 %",617,362,26,"r"),
   LT2("70 % = 0,7",330,392,40,"r"),LT2("nytt = förändringsfaktor · gammalt",400,450,34,"b")]},
 ex(barM(125,500,400,null,70,"g"),chgW(400,25,true),S("Exempel 1: en cykel kostar 400 kr och blir 25 % dyrare. Faktor 1,25. 1,25 · 400 = 500 kr.","Example 1: a bike costs 400 kr and gets 25% more expensive. Factor 1.25. 1.25 × 400 = 500 kr.","مثال 1: دراجة سعرها 400 كرونة وارتفع سعرها 25 %. العامل 1,25. ‏1,25 × 400 = 500 كرونة.")),
 ex(barM(70,560,800,null,70,"r"),chgW(800,30,false),S("Exempel 2: en jacka för 800 kr säljs med 30 % rabatt. 70 % är kvar: 0,7 · 800 = 560 kr.","Example 2: a jacket for 800 kr is sold at 30% off. 70% is left: 0.7 × 800 = 560 kr.","مثال 2: سترة بـ 800 كرونة بتخفيض 30 %. يبقى ‏70 %: ‏0,7 × 800 = 560 كرونة.")),
 ex(barM(90,450,500,null,70,"r"),chgW(500,10,false),S("Exempel 3: 500 minskar med 10 %. 0,9 · 500 = 450.","Example 3: 500 decreases by 10%. 0.9 × 500 = 450.","مثال 3: ‏500 تنقص بنسبة 10 %. ‏0,9 × 500 = 450.")),
 {say:S("Exempel 4: priset går från 200 kr till 250 kr. Hur många procent? Ökningen är 50 kr. Jämför med det gamla priset: 50 / 200 = 0,25 = 25 %.",
   "Example 4: the price goes from 200 kr to 250 kr. What percent? The increase is 50 kr. Compare with the old price: 50 ÷ 200 = 0.25 = 25%.",
   "مثال 4: ارتفع السعر من 200 إلى 250 كرونة. كم بالمئة؟ الزيادة 50 كرونة. نقارنها بالسعر القديم: ‏50 ÷ 200 = 0,25 = 25 %."),
  draw:()=>[A.wipe(),...barM(125,250,200,"pct",70,"g"),...lines(["250 − 200 = 50","50 / 200 = 0,25 = 25 %"],["ökningen","jämför med det gamla priset"],{s:44,y0:290,gap:104})]},
 {drill:{gen:gChg,n:5,intro:S("Din tur! Öka, minska och förändringsfaktor.","Your turn! Increase, decrease and the change factor.","دورك! الزيادة والنقصان وعامل التغيّر.")}},
]);
part("🔙",S("Det hela","The whole","الكل"),[
 {say:S("Ibland vet du delen men inte det hela. 30 % är 45 elever. Hur många är alla? Hitta 1 % först: 45 / 30 = 1,5. Gånger 100: 150 elever.",
   "Sometimes you know the part but not the whole. 30% is 45 pupils. How many are there in all? Find 1% first: 45 ÷ 30 = 1.5. Times 100: 150 pupils.",
   "أحيانًا تعرف الجزء ولا تعرف الكل. ‏30 % تساوي 45 تلميذًا، فكم عددهم كلهم؟ احسب ‏1 % أولًا: ‏45 ÷ 30 = 1,5، وفي 100: 150 تلميذًا."),draw:()=>board(barM(30,45,150,"whole"),wholeW(30,45))},
 ex(barM(10,7,70,"whole"),wholeW(10,7),S("Exempel 1: 10 % är 7. Då är 100 % tio gånger så mycket: 70.","Example 1: 10% is 7. Then 100% is ten times as much: 70.","مثال 1: ‏10 % تساوي 7، إذن ‏100 % عشرة أضعاف: 70.")),
 ex(barM(25,12,48,"whole"),wholeW(25,12),S("Exempel 2: 25 % är 12. 1 % är 0,48, och 100 % är 48. Eller: fyra fjärdedelar, 4 · 12 = 48.","Example 2: 25% is 12. 1% is 0.48, and 100% is 48. Or: four quarters, 4 × 12 = 48.","مثال 2: ‏25 % تساوي 12. ‏1 % تساوي 0,48 و100 % تساوي 48. أو: أربعة أرباع ‏4 × 12 = 48.")),
 ex(barM(20,15,75,"whole"),wholeW(20,15),S("Exempel 3: 20 % är 15. 15 / 20 = 0,75 och gånger 100 blir 75.","Example 3: 20% is 15. 15 ÷ 20 = 0.75 and times 100 is 75.","مثال 3: ‏20 % تساوي 15. ‏15 ÷ 20 = 0,75 وفي 100 تساوي 75.")),
 ex(barM(40,36,90,"whole"),wholeW(40,36),S("Exempel 4: 40 % är 36. 1 % är 0,9, och 100 % är 90.","Example 4: 40% is 36. 1% is 0.9, and 100% is 90.","مثال 4: ‏40 % تساوي 36. ‏1 % تساوي 0,9 و100 % تساوي 90.")),
 {drill:{gen:gWhole,n:5,intro:S("Din tur! Hitta det hela.","Your turn! Find the whole.","دورك! أوجد الكل.")}},
]);
const card=(x,y,c,head,line,rule)=>[A.band(x,y,240,222,c),A.tx(head,x+120,y+40,28,c),A.tx(line,x+120,y+125,fitT(line,220,34),"k"),A.tx(rule,x+120,y+200,fitT(rule,220,22),"k")];
part("📋",S("Kom ihåg","Remember","تذكّر"),[
 {say:S("Allt om procent på en tavla. Det viktigaste: procent är hundradelar, och andelen är delen delat med det hela.",
   "Everything about percent on one board. The key ideas: percent is hundredths, and the share is the part divided by the whole.",
   "كل شيء عن النسبة المئوية على لوحة واحدة. الأهم: النسبة المئوية أجزاء من مئة، والنسبة هي الجزء مقسومًا على الكل."),
  draw:()=>[A.wipe(),...card(20,16,"b","Procent","25 % = 0,25 = 1/4","procent = hundradelar"),...card(280,16,"g","Procent av","20 % av 80 = 16","0,2 · 80"),
   ...card(540,16,"o","Hur många %?","12 av 48 = 25 %","delen / det hela"),...card(20,262,"g","Ökning","+20 % → · 1,2","120 % = 1,2"),
   ...card(280,262,"r","Minskning","−30 % → · 0,7","70 % kvar"),...card(540,262,"p","Det hela","30 % = 45 → 150","hitta 1 % först")]},
]);

LESSONS.push({id:"qproc",subject:"quick",grades:"5–9",kind:"wb",
 title:t3("Procent: allt på ett ställe","Percent: everything in one place","النسبة المئوية: كل شيء في مكان واحد"),icon:"",
 steps,parts,mount:qMount({steps})});
}
