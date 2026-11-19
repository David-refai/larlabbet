import {A,LESSONS,R,pick,rint,t3} from "../../legacy/core.js";
/* =====================================================================
   SNABBMATTE · FÖRHÅLLANDE OCH PROPORTION: ratio and simplifying it,
   sharing in a ratio, proportions (cross-multiplying, the unit method),
   scale on maps and drawings, cheat sheet.
   ===================================================================== */
import {gcd,F,X,lines,qMount,fitT,rowC,rowAt} from "./q-0kit.js";
{
const S=(sv,en,ar)=>t3(sv,en,ar);
const ds=x=>String(+(+x).toFixed(6)).replace(".",",");
const LT2=(t,x,y,s,c="k",anc)=>Object.assign(A.tx(t,x,y,s,c,anc),{dur:220});
const hintT=(sv,en,ar,draw=[])=>({say:S(sv,en,ar),draw});
const hintLine=t=>[A.tx(t,400,445,fitT(t,700,30),"o")];
const RT="∶";   /* the ratio sign, so a ratio is never read as a time */
const rt=(a,b)=>`${a} ${RT} ${b}`;
const qB=(title,line,big=70)=>[A.wipe(),A.tx(title,400,72,fitT(title,740,34),"b"),A.tx(line,400,250,fitT(line,720,big))];
const numQ=(title,line,ans,sol,hint,unit="")=>({kind:"num",dec:true,ans,show:ds(ans)+unit,q:qB(title,line),sol,hint});
const pairQ=(title,line,a,b,sol,hint)=>({kind:"pair",ans:[a,b],sep:RT,show:rt(a,b),labels:null,q:qB(title,line),sol,hint});

/* dots in two colours: a things to b things */
const dotsRow=(a,b,y,cx=400,maxW=640,r=18)=>{const n=a+b,sp=Math.min(r*3,maxW/n),x0=cx-(n-1)*sp/2,o=[];
  for(let i=0;i<n;i++){const x=x0+i*sp,c=i<a?"r":"b";o.push(A.hatch(R.circ(x,y,r),c),A.p(R.circ(x,y,r),c,3))}return o};
/* a bar cut into a+b equal parts (the first a red, the rest blue) with the value of each part */
function shareBar(a,b,tot,y=80){const n=a+b,x0=110,w=580,h=64,o=[A.p(R.bar(x0,y,w,h,n),"k",3.5)],one=tot/n;
  o.push(A.hatch(`M${x0},${y}h${w*a/n}v${h}h${-w*a/n}Z`,"r"),A.hatch(`M${x0+w*a/n},${y}h${w*b/n}v${h}h${-w*b/n}Z`,"b"));
  if(n<=10)for(let i=0;i<n;i++)o.push(Object.assign(A.tx(ds(one),x0+w*(i+.5)/n,y+h/2+9,Math.min(26,w/n*.45),"k"),{dur:90}));
  o.push(LT2(`${a} ${a===1?"del":"delar"}`,x0+w*a/n/2,y-14,24,"r"),LT2(`${b} ${b===1?"del":"delar"}`,x0+w*(a+b/2)/n,y-14,24,"b"),LT2(`totalt ${ds(tot)}`,x0+w/2,y+h+36,26,"k"));return o}
const shareL=(a,b,tot)=>{const n=a+b,one=tot/n;return{L:[`${a} + ${b} = ${n} delar`,`1 del = ${ds(tot)} / ${n} = ${ds(one)}`,`${a} · ${ds(one)} = ${ds(a*one)}   och   ${b} · ${ds(one)} = ${ds(b*one)}`],notes:["hur många delar?","en del är",""]}};
const propL=(a,b,c,d,pos)=>{/* a/b = c/d with one unknown at pos 0..3 */const v=[a,b,c,d],t=v.map((x,i)=>i===pos?"x":String(x)),cross1=pos===0||pos===3?[0,3]:[1,2],other=pos===0||pos===3?[1,2]:[0,3];
  const known=other.map(i=>v[i]),k2=v[cross1.find(i=>i!==pos)],ans=known[0]*known[1]/k2;
  return{first:[F(t[0],t[1]),X("="),F(t[2],t[3])],L:[[F(t[0],t[1]),X("="),F(t[2],t[3])],`${k2} · x = ${known[0]} · ${known[1]}`,`${k2}x = ${known[0]*known[1]}`,`x = ${known[0]*known[1]} / ${k2} = ${ds(ans)}`],
    notes:["korsmultiplicera","","",""],ans}};

/* ======================= drills ======================= */
function gRatio(n){
  if(n<3){const [p,q]=[[2,3],[3,4],[2,5],[3,5],[4,5],[1,3],[5,6]][rint(0,6)],k=[2,5,6][n],a=p*k,b=q*k;
    return pairQ("Förenkla förhållandet:",rt(a,b),p,q,[A.wipe(),...lines([rt(a,b),rt(p,q)],[`dela båda med ${k}`,"enklaste form"],{s:60})],
      hintT(`Hitta ett tal som både ${a} och ${b} kan delas med.`,`Find a number that divides both ${a} and ${b}.`,`ابحث عن عدد يقسم ${a} و${b} معًا.`))}
  if(n===3){const s=rint(1,3),w=s*rint(3,5);const g=gcd(s,w);return{...pairQ("Saft och vatten. Skriv förhållandet saft : vatten i enklaste form.",`${s} dl saft, ${w} dl vatten`,s/g,w/g,
      [A.wipe(),...lines([rt(s,w),rt(s/g,w/g)],["saft : vatten",`dela båda med ${g}`],{s:60})],hintT("Saft först, sedan vatten. Förenkla.","Squash first, then water. Simplify.","العصير أولًا ثم الماء، ثم بسّط."))}}
  const b=rint(2,6),g=rint(2,7),t=b+g,k=gcd(g,t);return pairQ("Skriv förhållandet flickor : alla elever i enklaste form.",`${b} pojkar och ${g} flickor`,g/k,t/k,
    [A.wipe(),...lines([`alla: ${b} + ${g} = ${t}`,rt(g,t),...(k>1?[rt(g/k,t/k)]:[])],["","flickor : alla",...(k>1?[`dela med ${k}`]:[])],{s:54})],
    hintT("Räkna först hur många elever det är totalt.","First count how many pupils there are in total.","احسب أولًا عدد التلاميذ كلهم."))}
function gShare(n){const [a,b]=[[1,2],[2,3],[3,5],[1,4],[2,3]][n],one=n===4?rint(2,9)*10:rint(2,[10,12,8,15][n])*(n>1?2:1),tot=one*(a+b);
  if(n===4){const small=a*one,big=b*one;return numQ(`Förhållandet är ${rt(a,b)}. Den minsta delen är ${small}. Hur stor är den största?`,`${rt(a,b)}: ${small} och ?`,big,
    [A.wipe(),...shareBar(a,b,tot),...lines([`1 del = ${small} / ${a} = ${one}`,`${b} · ${one} = ${big}`],["",""],{s:44,y0:290,gap:104})],
    hintT(`${a} delar är ${small}. Hur mycket är 1 del?`,`${a} parts are ${small}. How much is 1 part?`,`${a} أجزاء تساوي ${small}، فكم يساوي جزء واحد؟`))}
  const askBig=n%2===1;return numQ(`Dela ${tot} kr i förhållandet ${rt(a,b)}. Hur mycket blir den ${askBig?"största":"minsta"} delen?`,`${tot} kr, ${rt(a,b)}`,askBig?b*one:a*one,
    [A.wipe(),...shareBar(a,b,tot),...lines(shareL(a,b,tot).L,shareL(a,b,tot).notes,{s:40,y0:250,gap:84})],
    hintT("Räkna ihop delarna. Dela summan med antalet delar, så vet du vad 1 del är.","Add up the parts. Divide the total by the number of parts to find 1 part.","اجمع الأجزاء، ثم اقسم المجموع على عدد الأجزاء لتعرف قيمة الجزء الواحد.",hintLine(`${a} + ${b} = ${a+b} delar`))," kr")}
function gProp(n){
  if(n===2||n===3){const [k1,p1,k2]=n===2?[3,rint(4,9)*3,rint(4,9)]:[4,rint(3,9)*2,10],price=p1/k1*k2,u=n===2?"kg":"pennor",unit=p1/k1;
    return numQ(`${k1} ${u} kostar ${p1} kr. Vad kostar ${k2} ${u}?`,`${k1} ${u} → ${p1} kr,  ${k2} ${u} → ?`,price,
      [A.wipe(),A.tx(`${k1} ${u} → ${p1} kr`,400,90,44),...lines([`1 ${n===2?"kg":"penna"}: ${p1} / ${k1} = ${ds(unit)} kr`,`${k2} ${u}: ${k2} · ${ds(unit)} = ${ds(price)} kr`],["räkna först vad 1 kostar",""],{s:44,y0:240,gap:110})],
      hintT("Räkna först vad en kostar. Sedan gånger det nya antalet.","First work out what one costs. Then multiply by the new number.","احسب أولًا ثمن الواحد، ثم اضرب في العدد الجديد.")," kr")}
  let a,b,c,d,pos;
  if(n===0){b=rint(2,6);d=b*2;a=rint(1,9);c=a*2;pos=0}else if(n===1){a=rint(2,6);c=a*2;b=rint(3,9);d=b*2;pos=1}else{a=pick([3,6,9]);b=12;c=a*5/3;d=20;pos=0}
  const w=propL(a,b,c,d,pos);return{kind:"num",dec:true,ans:w.ans,show:`x = ${ds(w.ans)}`,q:[A.wipe(),A.tx("Lös ut x:",400,72,36,"b"),...rowC(w.first,400,236,70).acts],
    sol:[A.wipe(),...lines(w.L,w.notes,{s:42})],hint:hintT("Korsmultiplicera: täljaren gånger den andra nämnaren, på båda sidor.","Cross-multiply: each numerator times the other denominator.","اضرب ضربًا تبادليًا: كل بسط في مقام الكسر الآخر.")}}
function gScale(n){
  if(n===0){const s=pick([10,50,100]),c=rint(2,9);return numQ(`Skala ${rt(1,s)}. En sträcka är ${c} cm på ritningen. Hur lång är den i verkligheten, i cm?`,`${rt(1,s)},  ${c} cm → ? cm`,c*s,
    [A.wipe(),...lines([`1 cm på ritningen = ${s} cm i verkligheten`,`${c} · ${s} = ${c*s} cm`],["",""],{s:40})],hintT(`Varje cm på ritningen är ${s} cm i verkligheten.`,`Every cm on the drawing is ${s} cm in reality.`,`كل سنتيمتر في الرسم يساوي ${s} سنتيمترًا في الواقع.`)," cm")}
  if(n===1){const c=rint(2,9);return numQ(`Skala ${rt(1,"1000")}. ${c} cm på ritningen. Hur många meter i verkligheten?`,`${rt(1,1000)},  ${c} cm → ? m`,c*10,
    [A.wipe(),...lines([`${c} · 1000 = ${c*1000} cm`,`${c*1000} cm = ${c*10} m`],["","100 cm = 1 m"],{s:46})],hintT("Räkna i cm först. 100 cm är 1 m.","Work in cm first. 100 cm is 1 m.","احسب بالسنتيمتر أولًا، و100 سنتيمتر تساوي مترًا.")," m")}
  if(n===2){const c=rint(2,9)*2;return numQ(`Kartan har skala ${rt(1,"50 000")}. ${c} cm på kartan. Hur många km i verkligheten?`,`${rt(1,"50 000")},  ${c} cm → ? km`,c/2,
    [A.wipe(),...lines([`${c} · 50 000 = ${(c*50000).toLocaleString("sv-SE")} cm`,`= ${(c*500).toLocaleString("sv-SE")} m`,`= ${ds(c/2)} km`],["","100 cm = 1 m","1000 m = 1 km"],{s:44})],
    hintT("1 cm på kartan är 50 000 cm = 500 m i verkligheten.","1 cm on the map is 50,000 cm = 500 m in reality.","سنتيمتر واحد على الخريطة يساوي 50000 سنتيمتر أي 500 متر في الواقع.")," km")}
  if(n===3){const m=rint(2,9)*2;return numQ(`Ett rum är ${m} m långt. Ritningen har skala ${rt(1,200)}. Hur många cm på ritningen?`,`${m} m,  ${rt(1,200)} → ? cm`,m/2,
    [A.wipe(),...lines([`${m} m = ${m*100} cm`,`${m*100} / 200 = ${ds(m/2)} cm`],["byt till cm","ritningen är 200 gånger mindre"],{s:46})],hintT("Gör om till cm och dela med 200.","Change to cm and divide by 200.","حوّل إلى سنتيمتر ثم اقسم على 200.")," cm")}
  const k=pick([5,10,20]),mm=rint(2,9);return numQ(`En myra ritas i skala ${rt(k,1)}. Den är ${mm} mm i verkligheten. Hur lång är bilden?`,`${rt(k,1)},  ${mm} mm → ? mm`,k*mm,
    [A.wipe(),...lines([`${rt(k,1)} betyder ${k} gånger större`,`${k} · ${mm} = ${k*mm} mm`],["förstoring",""],{s:44})],hintT(`Skala ${k}:1 är en förstoring: bilden är ${k} gånger större.`,`Scale ${k}:1 is an enlargement: the picture is ${k} times bigger.`,`المقياس ${k}:1 تكبير: الصورة أكبر ${k} مرات.`)," mm")}

/* ======================= the boards ======================= */
const steps=[],parts=[];const part=(icon,name,list)=>{parts.push({icon,name,at:steps.length});steps.push(...list)};

part("⚖️",S("Förhållande","Ratio","النسبة"),[
 {say:S("Ett förhållande jämför två mängder. Här finns 2 röda och 6 blå. Förhållandet röda till blå är 2 : 6. Det läses två till sex.",
   "A ratio compares two amounts. Here are 2 red and 6 blue. The ratio of red to blue is 2 : 6. It is read two to six.",
   "النسبة تقارن بين كميتين. هنا 2 حمراء و6 زرقاء. نسبة الأحمر إلى الأزرق 2 : 6، وتُقرأ اثنان إلى ستة."),
  draw:()=>[A.wipe(),...dotsRow(2,6,110),LT2("röda : blå",400,220,34),A.tx(rt(2,6),400,320,90,"k"),LT2("läses: två till sex",400,420,30,"o")]},
 {say:S("Förhållanden kan förenklas som bråk. Dela båda talen med samma tal. 2 : 6 blir 1 : 3. För varje röd finns tre blå.",
   "Ratios can be simplified like fractions. Divide both numbers by the same number. 2 : 6 becomes 1 : 3. For every red there are three blue.",
   "يمكن تبسيط النسب مثل الكسور: نقسم العددين على العدد نفسه. ‏2 : 6 تصبح 1 : 3، أي لكل حمراء ثلاث زرقاء."),
  draw:()=>{const o=[A.wipe()];for(let g=0;g<2;g++){const cx=230+g*340;o.push(...dotsRow(1,3,110,cx,240,16),A.loop(cx,110,140,50,"g"))}
   o.push(A.tx(rt(2,6),220,300,80),A.arrow(330,280,470,280,"r",-20),LT2("/ 2",400,240,30,"r"),A.tx(rt(1,3),580,300,80,"g"),LT2("för varje röd finns tre blå",400,420,32,"o"));return o}},
 {say:S("Exempel: saft blandas 1 : 4. Det betyder 1 del saft och 4 delar vatten. Tar du 2 dl saft behöver du 8 dl vatten, för 2 : 8 = 1 : 4.",
   "Example: squash is mixed 1 : 4. That means 1 part squash and 4 parts water. If you use 2 dl squash, you need 8 dl water, because 2 : 8 = 1 : 4.",
   "مثال: يُخلط العصير بنسبة 1 : 4، أي جزء عصير وأربعة أجزاء ماء. إذا أخذت 2 دسل عصير تحتاج 8 دسل ماء، لأن ‏2 : 8 = 1 : 4."),
  draw:()=>{const o=[A.wipe()],glass=(x,c,fill)=>[A.p(`M${x-26},60L${x-20},220L${x+20},220L${x+26},60`,"k",3.5),A.hatch(`M${x-23},${220-fill}L${x-20},220L${x+20},220L${x+23},${220-fill}Z`,c)];
   o.push(...glass(150,"r",120),LT2("1 del saft",150,260,26,"r"));[0,1,2,3].forEach(i=>o.push(...glass(330+i*90,"b",120)));o.push(LT2("4 delar vatten",465,260,26,"b"),
    A.tx(rt(1,4),400,340,60),...rowC([X(rt(2,8)),X("="),X(rt(1,4),"g")],400,420,52).acts);return o}},
 {drill:{gen:gRatio,n:5,intro:S("Din tur! Skriv och förenkla förhållanden.","Your turn! Write and simplify ratios.","دورك! اكتب النسب وبسّطها.")}},
]);
part("✂️",S("Dela i förhållande","Sharing in a ratio","التقسيم بنسبة")
,[
 {say:S("Ali och Sara delar 200 kr i förhållandet 3 : 2. Räkna delarna: 3 + 2 = 5. En del är 200 / 5 = 40 kr. Ali får 3 · 40 = 120 kr och Sara 2 · 40 = 80 kr.",
   "Ali and Sara share 200 kr in the ratio 3 : 2. Count the parts: 3 + 2 = 5. One part is 200 ÷ 5 = 40 kr. Ali gets 3 × 40 = 120 kr and Sara 2 × 40 = 80 kr.",
   "يتقاسم علي وسارة 200 كرونة بنسبة 3 : 2. نعدّ الأجزاء: ‏3 + 2 = 5. الجزء الواحد ‏200 ÷ 5 = 40 كرونة. يأخذ علي ‏3 × 40 = 120 وسارة ‏2 × 40 = 80."),
  draw:()=>[A.wipe(),...shareBar(3,2,200),...lines(shareL(3,2,200).L,shareL(3,2,200).notes,{s:40,y0:250,gap:84})]},
 {say:S("Exempel 1: 60 godisar delas 1 : 2. 3 delar, en del är 20. Det blir 20 och 40.","Example 1: 60 sweets are shared 1 : 2. 3 parts, one part is 20. That gives 20 and 40.","مثال 1: ‏60 حلوى تُقسم بنسبة 1 : 2. ثلاثة أجزاء، الجزء الواحد 20، فيكون 20 و40."),
  draw:()=>[A.wipe(),...shareBar(1,2,60),...lines(shareL(1,2,60).L,shareL(1,2,60).notes,{s:40,y0:250,gap:84})]},
 {say:S("Exempel 2: 160 kr delas 3 : 5. 8 delar, en del är 20 kr. Det blir 60 kr och 100 kr.","Example 2: 160 kr is shared 3 : 5. 8 parts, one part is 20 kr. That gives 60 kr and 100 kr.","مثال 2: ‏160 كرونة تُقسم بنسبة 3 : 5. ثمانية أجزاء، الجزء 20 كرونة، فيكون 60 و100."),
  draw:()=>[A.wipe(),...shareBar(3,5,160),...lines(shareL(3,5,160).L,shareL(3,5,160).notes,{s:40,y0:250,gap:84})]},
 {say:S("Exempel 3: förhållandet är 2 : 3 och den minsta delen är 40. Då är 1 del 20, och den största 3 · 20 = 60.","Example 3: the ratio is 2 : 3 and the smaller part is 40. Then 1 part is 20, and the bigger part is 3 × 20 = 60.","مثال 3: النسبة 2 : 3 والجزء الأصغر 40. إذن الجزء الواحد 20، والأكبر ‏3 × 20 = 60."),
  draw:()=>[A.wipe(),...shareBar(2,3,100),...lines(["2 delar = 40","1 del = 40 / 2 = 20","3 delar = 3 · 20 = 60"],["","",""],{s:40,y0:250,gap:84})]},
 {drill:{gen:gShare,n:5,intro:S("Din tur! Dela i förhållande.","Your turn! Share in a ratio.","دورك! قسّم بنسبة.")}},
]);
part("✖️",S("Proportion","Proportion","التناسب"),[
 {say:S("En proportion är två lika förhållanden: x/6 = 4/8. Korsmultiplicera: täljaren gånger den andra nämnaren. 8 · x = 6 · 4, alltså 8x = 24 och x = 3.",
   "A proportion is two equal ratios: x/6 = 4/8. Cross-multiply: each numerator times the other denominator. 8 × x = 6 × 4, so 8x = 24 and x = 3.",
   "التناسب نسبتان متساويتان: ‏x/6 = 4/8. نضرب ضربًا تبادليًا (الطرفين في الوسطين): ‏8 × x = 6 × 4، إذن 8x = 24 وx = 3."),
  draw:()=>[A.wipe(),...rowC([F("x",6),X("="),F(4,8)],400,50,40).acts,
   ...[[290,"x","r",6,"b"],[510,4,"b",8,"r"]].flatMap(([x,n,cn,d,cd])=>[A.tx(n,x,152,64,cn),A.p(R.line(x-34,160,x+34,160,.4),"k",4),A.tx(d,x,210,64,cd)]),
   A.arrow(334,130,470,196,"r"),A.arrow(334,196,470,130,"b"),LT2("korsmultiplicera",640,170,24,"o"),
   ...lines([[X("8 · x","r"),X("="),X("6 · 4","b")],"8x = 24","x = 24 / 8 = 3"],["","",""],{s:40,y0:290,gap:72})]},
 {say:S("Enhetsmetoden fungerar också, och är bra för vardagsproblem. 3 kg äpplen kostar 45 kr. 1 kg kostar 45 / 3 = 15 kr. 5 kg kostar 5 · 15 = 75 kr.",
   "The unit method works too, and is good for everyday problems. 3 kg of apples cost 45 kr. 1 kg costs 45 ÷ 3 = 15 kr. 5 kg cost 5 × 15 = 75 kr.",
   "طريقة الوحدة تنفع أيضًا وهي مفيدة لمسائل الحياة اليومية: ‏3 كغ تفاح بـ 45 كرونة. الكيلو الواحد ‏45 ÷ 3 = 15 كرونة، و5 كغ ‏5 × 15 = 75 كرونة."),
  draw:()=>[A.wipe(),A.tx("3 kg → 45 kr",400,90,48),A.arrow(400,120,400,170,"o"),LT2("/ 3",430,155,28,"o","start"),A.tx("1 kg → 15 kr",400,220,48,"o"),A.arrow(400,250,400,300,"g"),LT2("· 5",430,285,28,"g","start"),
   A.hl(250,320,300,74),A.tx("5 kg → 75 kr",400,375,48,"g")]},
 {say:S("Exempel 1: x/4 = 6/8. Korsmultiplicera: 8x = 24, x = 3.","Example 1: x/4 = 6/8. Cross-multiply: 8x = 24, x = 3.","مثال 1: ‏x/4 = 6/8. الضرب التبادلي: 8x = 24، إذن x = 3."),draw:()=>[A.wipe(),...lines(propL(3,4,6,8,0).L,propL(3,4,6,8,0).notes,{s:42})]},
 {say:S("Exempel 2: 5/x = 10/16. 10 · x = 5 · 16 = 80, så x = 8.","Example 2: 5/x = 10/16. 10 × x = 5 × 16 = 80, so x = 8.","مثال 2: ‏5/x = 10/16. ‏10 × x = 5 × 16 = 80، إذن x = 8."),draw:()=>[A.wipe(),...lines(propL(5,8,10,16,1).L,propL(5,8,10,16,1).notes,{s:42})]},
 {say:S("Exempel 3: 4 pennor kostar 18 kr. Vad kostar 10? En penna kostar 4,50 kr. 10 · 4,50 = 45 kr.","Example 3: 4 pens cost 18 kr. What do 10 cost? One pen costs 4.50 kr. 10 × 4.50 = 45 kr.","مثال 3: ‏4 أقلام بـ 18 كرونة، فكم ثمن 10؟ القلم ‏4,50 كرونة، و‏10 × 4,50 = 45 كرونة."),
  draw:()=>[A.wipe(),A.tx("4 pennor → 18 kr",400,90,44),...lines(["1 penna: 18 / 4 = 4,5 kr","10 pennor: 10 · 4,5 = 45 kr"],["",""],{s:44,y0:240,gap:110})]},
 {say:S("Exempel 4: x/12 = 15/20. 20x = 12 · 15 = 180, så x = 9.","Example 4: x/12 = 15/20. 20x = 12 × 15 = 180, so x = 9.","مثال 4: ‏x/12 = 15/20. ‏20x = 12 × 15 = 180، إذن x = 9."),draw:()=>[A.wipe(),...lines(propL(9,12,15,20,0).L,propL(9,12,15,20,0).notes,{s:42})]},
 {drill:{gen:gProp,n:5,intro:S("Din tur! Lös proportioner.","Your turn! Solve proportions.","دورك! حلّ التناسبات.")}},
]);
part("🗺️",S("Skala","Scale","المقياس"),[
 {say:S("Skala 1 : 50 000 på en karta betyder: 1 cm på kartan är 50 000 cm i verkligheten. Det är 500 m. Så 4 cm på kartan är 2 km.",
   "Scale 1 : 50,000 on a map means: 1 cm on the map is 50,000 cm in reality. That is 500 m. So 4 cm on the map is 2 km.",
   "مقياس 1 : 50000 على الخريطة يعني أن سنتيمترًا واحدًا على الخريطة يساوي 50000 سنتيمتر في الواقع، أي 500 متر. إذن 4 سنتيمترات تساوي 2 كيلومتر."),
  draw:()=>{const o=[A.wipe(),A.p(R.rect(60,50,330,230,.4),"k",3.5),A.p("M90,240Q160,120 230,170T360,80","b",5),A.p(R.circ(90,240,10)+R.circ(360,80,10),"r",5),LT2("skola",90,272,22,"r"),LT2("hem",336,88,22,"r","end")];
   let rl=R.line(80,330,380,330,.2);for(let i=0;i<=4;i++)rl+=R.line(80+i*75,318,80+i*75,342,.1);o.push(A.p(rl,"k",3.5),LT2("0",80,370,22),LT2("4 cm",380,370,22),
    A.tx(rt(1,"50 000"),600,100,46,"b"),LT2("1 cm = 50 000 cm",600,190,30),LT2("= 500 m",600,250,30),A.hl(440,300,320,64),LT2("4 cm = 2 km",600,345,40,"g"));return o}},
 {say:S("Skala 1 : 100 är en förminskning, verkligheten är 100 gånger större än ritningen. Skala 5 : 1 är en förstoring, bilden är 5 gånger större än verkligheten.",
   "Scale 1 : 100 is a reduction; reality is 100 times bigger than the drawing. Scale 5 : 1 is an enlargement; the picture is 5 times bigger than reality.",
   "المقياس 1 : 100 تصغير، فالواقع أكبر من الرسم 100 مرة. والمقياس 5 : 1 تكبير، فالصورة أكبر من الواقع 5 مرات."),
  draw:()=>[A.wipe(),A.band(40,40,340,420,"b"),A.tx(rt(1,100),210,110,64,"b"),LT2("förminskning",210,170,30,"b"),LT2("ritning : verklighet",210,230,24),LT2("1 cm → 100 cm",210,300,34),LT2("hus, rum, kartor",210,380,24,"o"),
   A.band(420,40,340,420,"g"),A.tx(rt(5,1),590,110,64,"g"),LT2("förstoring",590,170,30,"g"),LT2("bild : verklighet",590,230,24),LT2("1 mm blir 5 mm",590,300,34),LT2("insekter, celler",590,380,24,"o")]},
 {say:S("Exempel 1: skala 1 : 100, 3 cm på ritningen. 3 · 100 = 300 cm = 3 m.","Example 1: scale 1 : 100, 3 cm on the drawing. 3 × 100 = 300 cm = 3 m.","مثال 1: المقياس 1 : 100، و3 سنتيمترات في الرسم. ‏3 × 100 = 300 سنتيمتر = 3 أمتار."),
  draw:()=>[A.wipe(),...lines(["3 · 100 = 300 cm","300 cm = 3 m"],["skala 1 : 100","100 cm = 1 m"],{s:50})]},
 {say:S("Exempel 2: ett rum är 6 m långt och ritas i skala 1 : 200. 6 m = 600 cm. 600 / 200 = 3 cm på ritningen.","Example 2: a room is 6 m long and drawn at scale 1 : 200. 6 m = 600 cm. 600 ÷ 200 = 3 cm on the drawing.","مثال 2: غرفة طولها 6 أمتار تُرسم بمقياس 1 : 200. ‏6 م = 600 سم، و‏600 ÷ 200 = 3 سم في الرسم."),
  draw:()=>[A.wipe(),...lines(["6 m = 600 cm","600 / 200 = 3 cm"],["byt till cm","ritningen är 200 gånger mindre"],{s:50})]},
 {say:S("Exempel 3: en myra är 4 mm och ritas i skala 10 : 1. Bilden blir 10 · 4 = 40 mm = 4 cm.","Example 3: an ant is 4 mm and drawn at scale 10 : 1. The picture is 10 × 4 = 40 mm = 4 cm.","مثال 3: نملة طولها 4 ملم تُرسم بمقياس 10 : 1. الصورة ‏10 × 4 = 40 ملم = 4 سم."),
  draw:()=>[A.wipe(),...lines(["10 · 4 = 40 mm","40 mm = 4 cm"],["förstoring 10 gånger","10 mm = 1 cm"],{s:50})]},
 {drill:{gen:gScale,n:5,intro:S("Din tur! Räkna med skala.","Your turn! Work with scale.","دورك! احسب بالمقياس.")}},
]);
const card=(x,y,c,head,line,rule)=>[A.band(x,y,360,222,c),A.tx(head,x+180,y+40,28,c),A.tx(line,x+180,y+125,fitT(line,330,36),"k"),A.tx(rule,x+180,y+195,fitT(rule,330,24),"k")];
part("📋",S("Kom ihåg","Remember","تذكّر"),[
 {say:S("Allt om förhållande och proportion på en tavla.","Everything about ratio and proportion on one board.","كل شيء عن النسبة والتناسب على لوحة واحدة."),
  draw:()=>[A.wipe(),...card(30,16,"b","Förhållande",`${rt(2,6)} = ${rt(1,3)}`,"förenkla som ett bråk"),...card(410,16,"r","Dela i förhållande",`200 kr, ${rt(3,2)} → 120 och 80`,"räkna delarna, hitta 1 del"),
   ...card(30,262,"g","Proportion","x/6 = 4/8 → 8x = 24","korsmultiplicera, eller räkna 1 först"),...card(410,262,"o","Skala",`${rt(1,"50 000")}: 1 cm = 500 m`,"1 : 100 mindre, 5 : 1 större")]},
]);

LESSONS.push({id:"qprop",subject:"quick",grades:"6–9",kind:"wb",
 title:t3("Förhållande och proportion: allt på ett ställe","Ratio and proportion: everything in one place","النسبة والتناسب: كل شيء في مكان واحد"),icon:"",
 steps,parts,mount:qMount({steps})});
}
