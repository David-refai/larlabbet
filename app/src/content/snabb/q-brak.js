import {A,LESSONS,R,pick,rint,shuffle,t3} from "../../legacy/core.js";
import {LRI,gcd,lcm,F,X,M,work,bar,barPart,pie,noM,okM,rules,qMount,qBoard,rowC,fitT} from "./q-0kit.js";
/* =====================================================================
   SNABBMATTE · BRÅK: everything about fractions in one lesson, in parts:
   basics (equivalent fractions), +, −, ·, /, mixed numbers, and a
   cheat sheet. Each part: explaining boards, 4 worked examples, 5 questions.
   ===================================================================== */
{
const ps=(x,y)=>x===1?String(y):y===1?String(x):`${x}·${y}`;     /* "a·b", without the ·1 */
const fs=(n,d)=>d===1?String(n):`${n}/${d}`;
const mx=(n,d)=>{const w=Math.floor(n/d),r=n%d;return r?`${w} ${r}/${d}`:String(w)};
const S=(sv,en,ar)=>t3(sv,en,ar);
const cop=(lo,hi)=>{let a,b;do{b=rint(lo,hi);a=rint(1,b-1)}while(gcd(a,b)>1);return[a,b]};   /* a proper fraction in simplest form */

/* ---------- the endings of a calculation: simplify, then mixed form ---------- */
function tail(n,d,rows,notes){const g=gcd(n,d),j=rows.length-1;
  if(g>1){n/=g;d/=g;rows[j].push(X("="),F(n,d));notes[j]=j===0&&notes[j]?notes[j]+`, förkorta med ${g}`:`förkorta med ${g}`}
  if(d>1&&n>d){rows.push([M(Math.floor(n/d),n%d,d)]);notes.push("blandad form")}
  return[n,d]}

/* ---------- worked solutions (also the solutions of the drill questions) ---------- */
function addSub(op,a,b,c,d){const prob=[F(a,b),X(op),F(c,d)],rows=[],notes=[],Lc=lcm(b,d),k1=Lc/b,k2=Lc/d;
  if(b!==d){if(b===1){rows.push([F(a*Lc,Lc),X(op),F(c,d)]);notes.push(`${a} = ${a*Lc}/${Lc}`)}
    else{rows.push([k1>1?F(`${a}·${k1}`,`${b}·${k1}`):F(a,b),X(op),k2>1?F(`${c}·${k2}`,`${d}·${k2}`):F(c,d)]);notes.push(`gemensam nämnare ${Lc}`);
      rows.push([F(a*k1,Lc),X(op),F(c*k2,Lc)]);notes.push("")}}
  const N=op==="+"?a*k1+c*k2:a*k1-c*k2;rows.push([F(N,Lc)]);notes.push(op==="+"?"addera täljarna":"subtrahera täljarna");
  const r=tail(N,Lc,rows,notes);return{prob,rows,notes,N,Lc,r,k1,k2}}
function mul(a,b,c,d){const prob=[F(a,b),X("·"),F(c,d)],rows=[[F(`${a}·${c}`,ps(b,d))]],notes=[b===1||d===1?"heltalet gånger täljaren":"täljare · täljare, nämnare · nämnare"];
  rows.push([F(a*c,b*d)]);notes.push("");const r=tail(a*c,b*d,rows,notes);return{prob,rows,notes,r}}
function frOf(a,b,n){const prob=[F(a,b),X("av"),X(n)],rows=[[F(`${a}·${n}`,b)],[F(a*n,b)]],notes=["av betyder gånger",""];const r=tail(a*n,b,rows,notes);return{prob,rows,notes,r}}
function div(a,b,c,d){const prob=[F(a,b),X("/"),F(c,d)],rows=[[F(a,b),X("·"),F(d,c,"r")],[F(`${a}·${d}`,ps(b,c))],[F(a*d,b*c)]],notes=["vänd på bråket du delar med","",""];
  const r=tail(a*d,b*c,rows,notes);
  /* short rows when nothing happens on a line */
  if(rows[1][0].k==="t"&&rows[2].length===1&&rows[2][0].k==="t"){rows.splice(1,1);notes.splice(1,1)}
  return{prob,rows,notes,r}}
function toMix(n,d){const w=Math.floor(n/d),r=n%d;return{prob:[F(n,d)],rows:[[F(w*d,d),X("+"),F(r,d)],[X(w),X("+"),F(r,d)],[M(w,r,d)]],notes:[`${w} hela = ${w*d}/${d}`,`${w*d}/${d} = ${w}`,""]}}
function toImp(w,r,d){return{prob:[M(w,r,d)],rows:[[F(`${w}·${d} + ${r}`,d)],[F(w*d+r,d)]],notes:["heltal · nämnare + täljare",""]}}
function mixAdd(w1,r1,d1,w2,r2,d2){const n1=w1*d1+r1,n2=w2*d2+r2,Lc=lcm(d1,d2),rows=[[F(n1,d1),X("+"),F(n2,d2)]],notes=["gör om till bråk"];
  if(d1!==d2){rows.push([F(n1*Lc/d1,Lc),X("+"),F(n2*Lc/d2,Lc)]);notes.push(`gemensam nämnare ${Lc}`)}
  const N=n1*Lc/d1+n2*Lc/d2;rows.push([F(N,Lc)]);notes.push("");const r=tail(N,Lc,rows,notes);return{prob:[M(w1,r1,d1),X("+"),M(w2,r2,d2)],rows,notes,r}}
const W=w=>work(w.prob,w.rows,w.notes);

/* ---------- what Olle says over a worked example ---------- */
const sayAS=(op,a,b,c,d,ex)=>{const w=addSub(op,a,b,c,d),pl=op==="+",[n,dd]=w.r,ans=dd>1&&n>dd?mx(n,dd):fs(n,dd),P=`${fs(a,b)} ${op} ${fs(c,d)}`;
  const sv=[`Exempel ${ex}: ${P}.`,b===d?`Nämnarna är lika, så vi ${pl?"adderar":"subtraherar"} bara täljarna.`:b===1?`Vi skriver ${a} som ${a*w.Lc}/${w.Lc}.`:`Nämnarna är olika. Gemensam nämnare: ${w.Lc}. Vi förlänger och räknar sedan med täljarna.`,`Svar: ${ans}.`].join(" ");
  const en=[`Example ${ex}: ${P}.`,b===d?`The denominators are the same, so we just ${pl?"add":"subtract"} the numerators.`:b===1?`We write ${a} as ${a*w.Lc}/${w.Lc}.`:`The denominators are different. Common denominator: ${w.Lc}. We expand, then work with the numerators.`,`Answer: ${ans}.`].join(" ");
  const ar=[`مثال ${ex}: ${LRI(P)}.`,b===d?`المقامات متساوية، لذلك ${pl?"نجمع":"نطرح"} البسوط فقط.`:b===1?`نكتب ${a} على شكل ${LRI(a*w.Lc+"/"+w.Lc)}.`:`المقامات مختلفة. المقام المشترك: ${w.Lc}. نوسّع الكسور ثم نحسب بالبسوط.`,`الجواب: ${LRI(ans)}.`].join(" ");
  return S(sv,en,ar)};

/* ---------- drills: question n (0..4) gets a little harder each time ---------- */
const hintT=(sv,en,ar,draw=[])=>({say:S(sv,en,ar),draw});
const fracQ=(title,w,ans,hint,o={})=>({kind:"frac",ans,show:o.show||fs(ans[0],ans[1]),simplest:!!o.simplest,q:qBoard(title,w.prob),sol:[A.wipe(),...W(w)],hint});
const numQ=(title,w,ans,hint,prob)=>({kind:"num",ans,show:String(ans),q:qBoard(title,prob||w.prob),sol:[A.wipe(),...W(w)],hint});
const hintLine=t=>[A.tx(t,400,440,fitT(t,700,30),"o")];

function gBas(n){
  if(n<2){const[a,b]=cop(2,n?9:5),k=rint(2,n?8:5),D=b*k;
    const w={prob:[F(a,b)],rows:[[F(`${a}·${k}`,`${b}·${k}`)],[F(a*k,D)]],notes:[`${D} / ${b} = ${k}`,""]};
    return{kind:"num",ans:a*k,show:String(a*k),q:[A.wipe(),A.tx("Förläng bråket. Vilken täljare saknas?",400,72,34,"b"),...rowC([F(a,b),X("="),F("?",D,"o")],400,236,66).acts],
      sol:[A.wipe(),...W(w)],hint:hintT(`Hur många gånger större är ${D} än ${b}? Gör lika mycket med täljaren.`,`How many times bigger is ${D} than ${b}? Do the same to the numerator.`,`كم مرة ${D} أكبر من ${b}؟ اضرب البسط في العدد نفسه.`,hintLine(`${D} / ${b} = ?`))}}
  const f=n===2?2:n===3?pick([3,4,5]):pick([6,7,8,9]),[p,q]=cop(2,n===4?7:9);
  const w={prob:[F(p*f,q*f)],rows:[[F(p,q)]],notes:[`dela uppe och nere med ${f}`]};
  return fracQ("Förkorta så långt det går:",w,[p,q],hintT(`Hitta ett tal som både ${p*f} och ${q*f} går att dela med. Prova 2, 3, 5 ...`,`Find a number that divides both ${p*f} and ${q*f}. Try 2, 3, 5 ...`,`ابحث عن عدد يقسم ${p*f} و${q*f} معًا. جرّب 2 و3 و5 ...`),{simplest:true})}

function gAS(op,n){let a,b,c,d;
  const fin=()=>{const w=addSub(op,a,b,c,d),T=op==="+"?"Addera. Svara med ett bråk:":"Subtrahera. Svara med ett bråk:",Lc=w.Lc;
    return fracQ(T,w,[w.N,Lc],b===d?hintT(`Nämnarna är lika: räkna bara med täljarna, ${a} ${op} ${c}.`,`Same denominators: just work with the numerators, ${a} ${op} ${c}.`,`المقامات متساوية: احسب بالبسوط فقط ${LRI(a+" "+op+" "+c)}.`)
      :hintT(`Gör nämnarna lika först. ${Lc} går att dela med både ${b} och ${d}.`,`Make the denominators the same first. ${Lc} can be divided by both ${b} and ${d}.`,`وحّد المقامات أولًا. العدد ${Lc} يقبل القسمة على ${b} و${d}.`,hintLine(`Gemensam nämnare: ${Lc}`)),
      {show:w.r[1]>1&&w.r[0]>w.r[1]?`${fs(w.r[0],w.r[1])} = ${mx(w.r[0],w.r[1])}`:fs(w.r[0],w.r[1])})};
  if(n===0){b=rint(5,12);do{a=rint(1,b-2);c=rint(1,b-1)}while(op==="+"?a+c>=b:a<=c||a===b);d=b}
  else if(n===1){do{b=pick([4,6,8,9,10,12]);a=rint(1,b-1);c=rint(1,b-1)}while(op==="+"?gcd(a+c,b)===1||a+c===b:a<=c||gcd(a-c,b)===1);d=b}
  else if(n===2){do{b=rint(2,5);d=b*rint(2,3);a=rint(1,b-1);c=rint(1,d-1)}while(op==="−"&&a*d/b<=c||gcd(c,d)>1||gcd(a,b)>1)}
  else if(n===3){do{b=rint(2,6);d=rint(3,7);a=rint(1,b-1);c=rint(1,d-1)}while(gcd(b,d)>1||gcd(a,b)>1||gcd(c,d)>1||op==="−"&&a*d<=c*b||op==="+"&&a*d+c*b>=b*d)}
  else if(op==="+"){do{b=rint(2,6);d=rint(3,8);a=rint(1,b-1);c=rint(1,d-1)}while(gcd(b,d)>1||gcd(a,b)>1||gcd(c,d)>1||a*d+c*b<=b*d)}
  else{a=rint(1,3);b=1;[c,d]=cop(3,8)}
  return fin()}

function gMul(n){
  if(n===0){let k,a,b;do{k=rint(2,5);[a,b]=cop(3,9)}while((k*a)%b===0);const w=mul(k,1,a,b);return fracQ("Multiplicera. Svara med ett bråk:",w,[k*a,b],
    hintT("Heltal gånger bråk: multiplicera bara täljaren. Nämnaren är kvar.","Whole number times a fraction: multiply only the numerator. The denominator stays.","عدد صحيح في كسر: اضرب البسط فقط ويبقى المقام كما هو."),{show:fs(...w.r)})}
  if(n===3){const[a,b]=cop(2,6),N=b*rint(2,8),w=frOf(a,b,N);return numQ(`Hur mycket är ${a}/${b} av ${N}?`,w,a*N/b,
    hintT(`Dela först ${N} i ${b} lika delar. Ta sedan ${a} sådana delar.`,`First split ${N} into ${b} equal parts. Then take ${a} of those parts.`,`قسّم ${N} أولًا إلى ${b} أجزاء متساوية، ثم خذ ${a} من هذه الأجزاء.`,hintLine(`${N} / ${b} = ?`)))}
  let a,b,c,d;do{[a,b]=cop(2,n===1?5:9);[c,d]=cop(2,n===1?5:9)}while(n===1?gcd(a*c,b*d)>1:gcd(a*c,b*d)===1||b===d);
  const w=mul(a,b,c,d);return fracQ("Multiplicera. Svara med ett bråk:",w,[a*c,b*d],
    hintT("Täljare gånger täljare och nämnare gånger nämnare. Förkorta sedan om det går.","Numerator times numerator and denominator times denominator. Then simplify if you can.","البسط في البسط والمقام في المقام، ثم اختصر إن أمكن."),{show:fs(...w.r)})}

function gDiv(n){
  if(n===0){const k=rint(2,6),d=rint(2,5),w=div(k,1,1,d);return numQ("Dividera:",w,k*d,
    hintT(`Hur många ${d}-delar får plats i ${k} hela? Det är ${k} · ${d}.`,`How many pieces of size 1/${d} fit in ${k} wholes? That is ${k} × ${d}.`,`كم قطعة حجمها ${LRI("1/"+d)} تتسع في ${k} أعداد كاملة؟ إنها ${LRI(k+" × "+d)}.`))}
  if(n===1){const[a,b]=cop(2,7),k=rint(2,4),w=div(a,b,k,1);return fracQ("Dividera. Svara med ett bråk:",w,[a,b*k],
    hintT(`Att dela med ${k} är samma sak som att ta gånger 1/${k}.`,`Dividing by ${k} is the same as multiplying by 1/${k}.`,`القسمة على ${k} هي نفسها الضرب في ${LRI("1/"+k)}.`),{show:fs(...w.r)})}
  let a,b,c,d;do{[a,b]=cop(2,n===2?5:8);[c,d]=cop(2,n===2?5:8)}while((a*d)%(b*c)===0||(n===4?a*d<=b*c:false));
  const w=div(a,b,c,d);return fracQ("Dividera. Svara med ett bråk:",w,[a*d,b*c],
    hintT(`Vänd på bråket du delar med: ${c}/${d} blir ${d}/${c}. Multiplicera sedan.`,`Flip the fraction you divide by: ${c}/${d} becomes ${d}/${c}. Then multiply.`,`اقلب الكسر الذي تقسم عليه: ${LRI(c+"/"+d)} يصبح ${LRI(d+"/"+c)}، ثم اضرب.`,hintLine(`${a}/${b} · ${d}/${c}`)),{show:fs(...w.r)})}

function gMix(n){
  if(n===0||n===2){let d,nn;do{d=rint(2,n?9:5);nn=rint(d+1,d*(n?5:3))}while(nn%d===0||gcd(nn%d,d)>1);const w0=Math.floor(nn/d),r=nn%d,right=`${w0} ${r}/${d}`;
    const bad=new Set([right]),opts=[right];for(const t of[`${w0+1} ${r}/${d}`,`${w0} ${d-r}/${d}`,`${r} ${w0}/${d}`,`${Math.max(1,w0-1)} ${r}/${d}`,`${w0} ${r}/${nn}`])if(!bad.has(t)&&opts.length<4&&(t.split(" ")[1].split("/")[0]|0)<(t.split("/")[1]|0)){bad.add(t);opts.push(t)}
    while(opts.length<4){const t=`${w0+opts.length} ${r}/${d}`;if(!bad.has(t)){bad.add(t);opts.push(t)}}
    const O=shuffle(opts);return{kind:"choice",opts:O,ans:O.indexOf(right),show:right,q:qBoard("Skriv i blandad form:",[F(nn,d)]),sol:[A.wipe(),...W(toMix(nn,d))],
      hint:hintT(`Hur många hela ${d}/${d} ryms i ${nn}/${d}? Det som blir över är det nya bråket.`,`How many wholes (${d}/${d}) fit in ${nn}/${d}? What is left over is the new fraction.`,`كم واحدًا كاملًا (${LRI(d+"/"+d)}) يوجد في ${LRI(nn+"/"+d)}؟ الباقي هو الكسر الجديد.`,hintLine(`${nn} / ${d} = ? rest ?`))}}
  if(n===1||n===3){const d=rint(2,n===1?5:9),w0=rint(1,n===1?3:6),r=rint(1,d-1),w=toImp(w0,r,d);
    return fracQ("Skriv som ett bråk:",w,[w0*d+r,d],hintT(`Varje hel är ${d}/${d}. ${w0} hela blir ${w0} · ${d} delar. Lägg till ${r}.`,`Each whole is ${d}/${d}. ${w0} wholes are ${w0} × ${d} pieces. Add ${r}.`,`كل واحد كامل يساوي ${LRI(d+"/"+d)}. ${w0} أعداد كاملة تساوي ${LRI(w0+" × "+d)} قطعة. أضف ${r}.`))}
  const d1=rint(2,4),d2=rint(2,5),w1=rint(1,3),w2=rint(1,3),r1=rint(1,d1-1),r2=rint(1,d2-1),w=mixAdd(w1,r1,d1,w2,r2,d2),Lc=lcm(d1,d2),N=(w1*d1+r1)*Lc/d1+(w2*d2+r2)*Lc/d2;
  return fracQ("Addera. Svara med ett bråk:",w,[N,Lc],hintT("Gör om båda till bråk först. Sedan som vanlig addition.","Turn both into fractions first. Then it is ordinary addition.","حوّل العددين إلى كسور أولًا، ثم اجمع كالمعتاد."),{show:`${fs(...w.r)} = ${mx(...w.r)}`})}

/* ======================= the boards ======================= */
const wex=(w,say)=>({say,draw:()=>[A.wipe(),...W(w)]});
const LT2=(t,x,y,s,c="k",anc)=>Object.assign(A.tx(t,x,y,s,c,anc),{dur:220});

const steps=[];const parts=[];
const part=(icon,name,list)=>{parts.push({icon,name,at:steps.length});steps.push(...list)};

/* ---------------- 0. Grunder ---------------- */
part("🍕",S("Grunder","Basics","الأساسيات"),[
 {say:S("Ett bråk är en del av en helhet. Pizzan är delad i 4 lika bitar och vi tar 3. Det skrivs 3/4. Nämnaren (4) säger hur många lika delar, täljaren (3) hur många vi tar.",
   "A fraction is a part of a whole. The pizza is cut into 4 equal slices and we take 3. We write 3/4. The denominator (4) tells how many equal parts, the numerator (3) how many we take.",
   "الكسر جزء من كل. البيتزا مقسومة إلى 4 قطع متساوية وأخذنا 3، فنكتب 3/4. المقام (4) يخبرنا بعدد الأجزاء المتساوية، والبسط (3) بعدد الأجزاء التي أخذناها."),
  draw:()=>[A.wipe(),...pie(200,250,150,4,3,"r"),A.tx("3",500,226,120,"b"),A.p(R.line(445,252,555,252,.4),"k",5),A.tx("4",500,346,120,"o"),
   A.arrow(640,165,555,195,"b",-12),LT2("täljare",650,160,36,"b","start"),LT2("delar vi tar",650,196,24,"b","start"),
   A.arrow(640,330,555,305,"o",12),LT2("nämnare",650,330,36,"o","start"),LT2("lika delar i allt",650,366,24,"o","start"),
   LT2("tre fjärdedelar",500,450,36,"k")]},
 {say:S("Samma mängd kan skrivas på många sätt. 1/2, 2/4 och 4/8 är lika mycket. Att förlänga är att multiplicera täljare och nämnare med samma tal.",
   "The same amount can be written in many ways. 1/2, 2/4 and 4/8 are equal. To expand a fraction, multiply the numerator and the denominator by the same number.",
   "يمكن كتابة الكمية نفسها بطرق كثيرة: 1/2 و2/4 و4/8 متساوية. توسيع الكسر يعني ضرب البسط والمقام في العدد نفسه."),
  draw:()=>[A.wipe(),...bar(250,40,440,60,2,1,"b"),...A.frac(1,2,150,72,42,"b"),...bar(250,130,440,60,4,2,"g"),...A.frac(2,4,150,162,42,"g"),
   ...bar(250,220,440,60,8,4,"r"),...A.frac(4,8,150,252,42,"r"),A.p(R.dashed(470,30,470,292),"k",3),
   LT2("Förlänga: gånger samma tal uppe och nere",400,350,30,"b"),...rowC([F(1,2),X("="),F("1·4","2·4","r"),X("="),F(4,8,"g")],400,410,40).acts]},
 {say:S("Att förkorta är tvärtom: dela täljare och nämnare med samma tal. 6/8 blir 3/4 när vi delar med 2. Ett bråk är i enklaste form när det inte går att förkorta mer.",
   "Simplifying is the opposite: divide the numerator and the denominator by the same number. 6/8 becomes 3/4 when we divide by 2. A fraction is in simplest form when it can't be simplified any more.",
   "الاختصار عكس ذلك: نقسم البسط والمقام على العدد نفسه. يصبح 6/8 هو 3/4 عندما نقسم على 2. يكون الكسر في أبسط صورة عندما لا يمكن اختصاره أكثر."),
  draw:()=>[A.wipe(),...bar(250,50,440,64,8,6,"b"),...A.frac(6,8,150,84,44,"b"),A.arrow(470,130,470,180,"r"),LT2("slå ihop två och två",490,165,24,"r","start"),
   ...bar(250,190,440,64,4,3,"g"),...A.frac(3,4,150,224,44,"g"),
   LT2("Förkorta: dela med samma tal uppe och nere",400,320,30,"b"),...rowC([F(6,8),X("="),F(3,4,"g")],330,400,44).acts,LT2("÷ 2",395,368,26,"r"),
   LT2("enklaste form",600,410,30,"g"),okM(720,398)]},
 wex({prob:[F(2,3)],rows:[[F("2·4","3·4")],[F(8,12)]],notes:["vi vill ha nämnaren 12: 12 / 3 = 4",""]},
   S("Exempel 1: skriv 2/3 med nämnaren 12. 12 är 3 gånger 4, så vi förlänger med 4. Svar: 8/12.","Example 1: write 2/3 with denominator 12. 12 is 3 times 4, so we expand by 4. Answer: 8/12.","مثال 1: اكتب 2/3 بمقام 12. العدد 12 يساوي 3 في 4، لذلك نوسّع بالعدد 4. الجواب: 8/12.")),
 wex({prob:[F(3,5)],rows:[[F("3·4","5·4")],[F(12,20)]],notes:["vi vill ha nämnaren 20: 20 / 5 = 4",""]},
   S("Exempel 2: skriv 3/5 med nämnaren 20. 20 delat med 5 är 4. Gånger 4 uppe och nere ger 12/20.","Example 2: write 3/5 with denominator 20. 20 divided by 5 is 4. Times 4 top and bottom gives 12/20.","مثال 2: اكتب 3/5 بمقام 20. العدد 20 مقسومًا على 5 يساوي 4. نضرب البسط والمقام في 4 فنحصل على 12/20.")),
 wex({prob:[F(12,18)],rows:[[F(2,3)]],notes:["6 går i både 12 och 18: dela med 6"]},
   S("Exempel 3: förkorta 12/18. Både 12 och 18 kan delas med 6. 12 delat med 6 är 2 och 18 delat med 6 är 3. Svar: 2/3.","Example 3: simplify 12/18. Both 12 and 18 can be divided by 6. 12 ÷ 6 = 2 and 18 ÷ 6 = 3. Answer: 2/3.","مثال 3: اختصر 12/18. يقبل 12 و18 القسمة على 6. ‏12 ÷ 6 = 2 و18 ÷ 6 = 3. الجواب: 2/3.")),
 wex({prob:[F(24,36)],rows:[[F(12,18)],[F(6,9)],[F(2,3)]],notes:["÷ 2","÷ 2","÷ 3"]},
   S("Exempel 4: ser du inte det största talet direkt? Förkorta i små steg. 24/36 blir 12/18, sedan 6/9, sedan 2/3. Samma svar!","Example 4: can't see the biggest number at once? Simplify in small steps. 24/36 becomes 12/18, then 6/9, then 2/3. Same answer!","مثال 4: لا ترى العدد الأكبر مباشرة؟ اختصر على خطوات صغيرة: 24/36 ثم 12/18 ثم 6/9 ثم 2/3. الجواب نفسه!")),
 {drill:{gen:gBas,n:5,intro:S("Din tur! Förläng och förkorta.","Your turn! Expand and simplify.","دورك! وسّع واختصر.")}},
]);

/* ---------------- 1. Addition ---------------- */
part("➕",S("Addition","Addition","الجمع"),[
 {say:S("Samma nämnare: bitarna är lika stora, så vi räknar bara bitarna. 1/5 + 2/5 = 3/5. Nämnaren ändras inte. Lägg aldrig ihop nämnarna!",
   "Same denominator: the pieces are the same size, so we just count pieces. 1/5 + 2/5 = 3/5. The denominator does not change. Never add the denominators!",
   "المقام نفسه: القطع بالحجم نفسه، فنعدّ القطع فقط. ‏1/5 + 2/5 = 3/5. المقام لا يتغير. لا تجمع المقامات أبدًا!"),
  draw:()=>[A.wipe(),...bar(240,40,440,56,5,1,"b"),...A.frac(1,5,140,70,40,"b"),A.tx("+",70,168,44),...bar(240,125,440,56,5,2,"g"),...A.frac(2,5,140,155,40,"g"),
   A.p(R.line(60,212,720,212,.6),"k",3),...bar(240,235,440,56,5,1,"b"),barPart(240,235,440,56,5,1,2,"g"),...A.frac(3,5,140,265,40,"k"),A.tx("=",60,277,44),
   ...rowC([F(1,5),X("+"),F(2,5),X("="),F(3,5,"g")],250,390,40).acts,okM(390,385),
   ...rowC([F(1,5),X("+"),F(2,5),X("="),F(3,10,"r")],600,390,40).acts,noM(740,385),A.p(R.line(470,445,730,345,.4),"r",3.5)]},
 {say:S("Olika nämnare: 1/2 och 1/3 är olika stora bitar, så de kan inte läggas ihop direkt. Vi delar allt i sjättedelar: 1/2 = 3/6 och 1/3 = 2/6. Nu går det: 3/6 + 2/6 = 5/6.",
   "Different denominators: 1/2 and 1/3 are pieces of different sizes, so they can't be added straight away. We cut everything into sixths: 1/2 = 3/6 and 1/3 = 2/6. Now it works: 3/6 + 2/6 = 5/6.",
   "مقامات مختلفة: النصف والثلث قطع بأحجام مختلفة، فلا نجمعها مباشرة. نقسم كل شيء إلى أسداس: ‏1/2 = 3/6 و1/3 = 2/6. الآن يمكن: ‏3/6 + 2/6 = 5/6."),
  draw:()=>[A.wipe(),...bar(200,30,420,54,2,1,"b"),...A.frac(1,2,110,58,38,"b"),...bar(200,105,420,54,3,1,"g"),...A.frac(1,3,110,133,38,"g"),
   LT2("olika stora",715,90,26,"r"),LT2("bitar!",715,122,26,"r"),
   A.p([1,2,3,4,5].map(i=>R.dashed(200+70*i,30,200+70*i,84)+R.dashed(200+70*i,105,200+70*i,159)).join(""),"r",2.5),
   LT2("dela allt i sjättedelar",410,205,28,"r"),
   ...bar(200,225,420,56,6,3,"b"),barPart(200,225,420,56,6,3,2,"g"),...A.frac(5,6,110,255,40,"k"),
   ...rowC([F(1,2),X("+"),F(1,3),X("="),F(3,6,"b"),X("+"),F(2,6,"g"),X("="),F(5,6,"g")],400,395,44).acts]},
 {draw:()=>rules("Så adderar du bråk",["Samma nämnare? Gå till steg 3.","Hitta en gemensam nämnare.","Förläng bråken. Addera täljarna, behåll nämnaren.","Förkorta svaret. Större än 1? Skriv i blandad form."],"b"),
  say:S("Kom ihåg fyra steg. En gemensam nämnare hittar du så här: titta i gångertabellen för den största nämnaren tills den andra nämnaren går jämnt upp. För 3 och 4: 4, 8, 12. Alltså 12.",
   "Remember four steps. To find a common denominator: go through the times table of the bigger denominator until the other one divides it. For 3 and 4: 4, 8, 12. So 12.",
   "تذكّر أربع خطوات. لإيجاد مقام مشترك: امشِ في جدول ضرب المقام الأكبر حتى يقبل القسمة على المقام الآخر. للعددين 3 و4: ‏4، 8، 12. إذن 12.")},
 wex(addSub("+",2,7,3,7),sayAS("+",2,7,3,7,1)),
 wex(addSub("+",1,4,3,8),sayAS("+",1,4,3,8,2)),
 wex(addSub("+",2,3,1,4),sayAS("+",2,3,1,4,3)),
 wex(addSub("+",5,6,3,4),sayAS("+",5,6,3,4,4)),
 {drill:{gen:n=>gAS("+",n),n:5,intro:S("Din tur! Addera bråken.","Your turn! Add the fractions.","دورك! اجمع الكسور.")}},
]);

/* ---------------- 2. Subtraktion ---------------- */
part("➖",S("Subtraktion","Subtraction","الطرح"),[
 {say:S("Subtraktion fungerar likadant. Vi har 5/6 pizza och äter upp 2 bitar. Kvar: 3/6, som kan förkortas till 1/2.",
   "Subtraction works the same way. We have 5/6 of a pizza and eat 2 slices. Left: 3/6, which simplifies to 1/2.",
   "الطرح يعمل بالطريقة نفسها. معنا 5/6 بيتزا وأكلنا قطعتين. يبقى 3/6، وهو يُختصر إلى 1/2."),
  draw:()=>{const o=[A.wipe(),...pie(200,230,150,6,5,"o")];[3,4].forEach(i=>{const a=(-90+60*(i+.5))*Math.PI/180;o.push(noM(200+Math.cos(a)*90,230+Math.sin(a)*90))});
   o.push(LT2("äter 2 bitar",200,430,30,"r"),...rowC([F(5,6),X("−"),F(2,6,"r"),X("="),F(3,6),X("="),F(1,2,"g")],570,240,46).acts,LT2("förkorta med 3",640,330,24,"o"));return o}},
 {say:S("Olika nämnare: gör dem lika först, precis som i addition. 3/4 − 1/3: gemensam nämnare 12. 9/12 − 4/12 = 5/12.",
   "Different denominators: make them the same first, just as in addition. 3/4 − 1/3: common denominator 12. 9/12 − 4/12 = 5/12.",
   "مقامات مختلفة: وحّدها أولًا كما في الجمع. ‏3/4 − 1/3: المقام المشترك 12. ‏9/12 − 4/12 = 5/12."),
  draw:()=>[A.wipe(),...bar(240,30,480,54,4,3,"b"),...A.frac(3,4,140,58,38,"b"),...bar(240,105,480,54,3,1,"r"),...A.frac(1,3,140,133,38,"r"),
   LT2("dela i tolftedelar",480,205,28,"o"),...bar(240,225,480,56,12,9,"b"),A.p([0,1,2,3].map(i=>{const x=240+40*(5+i);return R.line(x+6,231,x+34,275,.2)+R.line(x+34,231,x+6,275,.2)}).join(""),"r",3.5),
   ...rowC([F(9,12,"b"),X("−"),F(4,12,"r"),X("="),F(5,12,"g")],400,380,46).acts]},
 {say:S("Heltal minus bråk: skriv heltalet som ett bråk. 2 hela är 8 fjärdedelar. 8/4 − 3/4 = 5/4 = 1 1/4.",
   "A whole number minus a fraction: write the whole number as a fraction. 2 wholes are 8 quarters. 8/4 − 3/4 = 5/4 = 1 1/4.",
   "عدد صحيح ناقص كسر: اكتب العدد الصحيح على شكل كسر. واحدان كاملان يساويان 8 أرباع. ‏8/4 − 3/4 = 5/4 = 1 1/4."),
  draw:()=>[A.wipe(),...bar(110,60,280,60,4,4,"g"),...bar(410,60,280,60,4,4,"g"),LT2("2 = 8/4",400,170,34,"b"),
   A.p([1,2,3].map(i=>{const x=410+70*i;return R.line(x+10,66,x+60,114,.2)+R.line(x+60,66,x+10,114,.2)}).join(""),"r",4),
   ...rowC([X("2"),X("−"),F(3,4),X("="),F(8,4),X("−"),F(3,4,"r"),X("="),F(5,4),X("="),M(1,1,4,"g")],400,300,42).acts]},
 wex(addSub("−",7,9,4,9),sayAS("−",7,9,4,9,1)),
 wex(addSub("−",5,6,1,3),sayAS("−",5,6,1,3,2)),
 wex(addSub("−",3,4,2,5),sayAS("−",3,4,2,5,3)),
 wex(addSub("−",3,1,2,3),sayAS("−",3,1,2,3,4)),
 {drill:{gen:n=>gAS("−",n),n:5,intro:S("Din tur! Subtrahera.","Your turn! Subtract.","دورك! اطرح.")}},
]);

/* ---------------- 3. Multiplikation ---------------- */
part("✖️",S("Multiplikation","Multiplication","الضرب"),[
 {say:S("Heltal gånger bråk är upprepad addition. 3 · 2/5 = 2/5 + 2/5 + 2/5 = 6/5. Bara täljaren multipliceras.",
   "A whole number times a fraction is repeated addition. 3 × 2/5 = 2/5 + 2/5 + 2/5 = 6/5. Only the numerator is multiplied.",
   "عدد صحيح في كسر هو جمع متكرر. ‏3 × 2/5 = 2/5 + 2/5 + 2/5 = 6/5. نضرب البسط فقط."),
  draw:()=>[A.wipe(),...[0,1,2].flatMap(i=>[...bar(90+i*215,50,190,50,5,2,["b","g","o"][i]),...A.frac(2,5,185+i*215,160,34,["b","g","o"][i])]),
   A.tx("+",280,172,36),A.tx("+",495,172,36),
   ...rowC([X("3"),X("·"),F(2,5),X("="),F("3·2",5),X("="),F(6,5),X("="),M(1,1,5,"g")],400,320,44).acts,LT2("nämnaren är kvar",400,440,28,"o")]},
 {say:S("Bråk gånger bråk: 2/3 · 3/4 betyder 2/3 av 3/4. I rutan är 3/4 blått och 2/3 rött. Där de korsas: 6 av 12 rutor. Regeln: täljare gånger täljare, nämnare gånger nämnare.",
   "A fraction times a fraction: 2/3 × 3/4 means 2/3 of 3/4. In the square, 3/4 is blue and 2/3 is red. Where they cross: 6 of 12 squares. The rule: numerator times numerator, denominator times denominator.",
   "كسر في كسر: ‏2/3 × 3/4 تعني ثلثي 3/4. في المربع 3/4 بالأزرق و2/3 بالأحمر. حيث يتقاطعان: 6 من 12 مربعًا. القاعدة: البسط في البسط والمقام في المقام."),
  draw:()=>{const x=60,y=70,w=300,h=300,o=[A.wipe()];let g=R.rect(x,y,w,h,.4);for(let i=1;i<4;i++)g+=R.line(x+w*i/4,y,x+w*i/4,y+h,.3);for(let i=1;i<3;i++)g+=R.line(x,y+h*i/3,x+w,y+h*i/3,.3);
   o.push(A.p(g,"k",3.5),A.hatch(`M${x},${y}h${w*3/4}v${h}h${-w*3/4}Z`,"b"),LT2("3/4",x+w*3/8,y-14,30,"b"),A.hatch(`M${x},${y}h${w}v${h*2/3}h${-w}Z`,"r"),LT2("2/3",x-30,y+h/3+10,30,"r"),
    A.p(R.rect(x,y,w*3/4,h*2/3,.3),"v",6),LT2("6 av 12",x+w*3/8,y+h+50,32,"v"),
    ...rowC([F(2,3,"r"),X("·"),F(3,4,"b"),X("="),F("2·3","3·4"),X("="),F(6,12),X("="),F(1,2,"g")],590,230,40).acts);return o}},
 {say:S("Ordet av betyder gånger. 3/4 av 20: dela 20 i 4 lika delar, det blir 5 i varje. Ta 3 delar: 15.",
   "The word 'of' means times. 3/4 of 20: split 20 into 4 equal parts, that is 5 in each. Take 3 parts: 15.",
   "كلمة «من» تعني الضرب. ‏3/4 من 20: قسّم 20 إلى 4 أجزاء متساوية فيصبح في كل جزء 5. خذ 3 أجزاء: 15."),
  draw:()=>{const o=[A.wipe()];for(let gI=0;gI<4;gI++){const cx=130+gI*180;let d="";for(let k=0;k<5;k++){const xx=cx-40+k*20,yy=150+(k%2)*22;d+=`M${xx},${yy}l.1,0`}
   o.push(A.p(d,gI<3?"b":"k",18),A.p(R.loop(cx,160,72,48),gI<3?"g":"#9aa8c4",3.5),A.tx("5",cx,250,34,gI<3?"g":"k"))}
   o.push(LT2("20 delat i 4 grupper",400,70,30,"k"),...rowC([F(3,4),X("av"),X("20"),X("="),X("5 + 5 + 5"),X("="),X("15","g")],400,350,42).acts,
    ...rowC([F(3,4),X("·"),X("20"),X("="),F(60,4),X("="),X("15","g")],400,450,36).acts);return o}},
 wex(mul(4,1,3,8),S("Exempel 1: 4 · 3/8. Bara täljaren: 4 · 3 = 12. 12/8 förkortas med 4 till 3/2, alltså 1 1/2.","Example 1: 4 × 3/8. Only the numerator: 4 × 3 = 12. 12/8 simplifies by 4 to 3/2, which is 1 1/2.","مثال 1: ‏4 × 3/8. البسط فقط: ‏4 × 3 = 12. نختصر 12/8 على 4 فيصبح 3/2، أي 1 1/2.")),
 wex(mul(2,3,4,5),S("Exempel 2: 2/3 · 4/5. Täljarna: 2 · 4 = 8. Nämnarna: 3 · 5 = 15. Svar: 8/15.","Example 2: 2/3 × 4/5. Numerators: 2 × 4 = 8. Denominators: 3 × 5 = 15. Answer: 8/15.","مثال 2: ‏2/3 × 4/5. البسوط: ‏2 × 4 = 8. المقامات: ‏3 × 5 = 15. الجواب: 8/15.")),
 wex(mul(3,4,2,9),S("Exempel 3: 3/4 · 2/9 = 6/36. Förkorta med 6: 1/6. Tips: du kan förkorta innan du multiplicerar, så blir talen mindre.","Example 3: 3/4 × 2/9 = 6/36. Simplify by 6: 1/6. Tip: you can simplify before you multiply, so the numbers stay small.","مثال 3: ‏3/4 × 2/9 = 6/36. نختصر على 6: ‏1/6. نصيحة: يمكنك الاختصار قبل الضرب لتبقى الأعداد صغيرة.")),
 wex(frOf(2,5,30),S("Exempel 4: 2/5 av 30. Av betyder gånger: 2 · 30 = 60, och 60/5 = 12. Eller: 30 delat i 5 är 6, gånger 2 är 12.","Example 4: 2/5 of 30. 'Of' means times: 2 × 30 = 60, and 60/5 = 12. Or: 30 split into 5 is 6, times 2 is 12.","مثال 4: ‏2/5 من 30. «من» تعني الضرب: ‏2 × 30 = 60 و60/5 = 12. أو: 30 مقسومة على 5 تساوي 6، وفي 2 تساوي 12.")),
 {drill:{gen:gMul,n:5,intro:S("Din tur! Multiplicera.","Your turn! Multiply.","دورك! اضرب.")}},
]);

/* ---------------- 4. Division ---------------- */
part("➗",S("Division","Division","القسمة"),[
 {say:S("3 / 1/4 frågar: hur många fjärdedelar får plats i 3 hela? Varje pizza har 4 fjärdedelar, så 3 pizzor har 12. Alltså 3 / 1/4 = 3 · 4 = 12.",
   "3 ÷ 1/4 asks: how many quarters fit in 3 wholes? Each pizza has 4 quarters, so 3 pizzas have 12. So 3 ÷ 1/4 = 3 × 4 = 12.",
   "‏3 ÷ 1/4 تسأل: كم ربعًا يوجد في 3 أعداد كاملة؟ في كل بيتزا 4 أرباع، إذن في 3 بيتزا 12 ربعًا. إذن ‏3 ÷ 1/4 = 3 × 4 = 12."),
  draw:()=>{const o=[A.wipe()];let k=0;[160,400,640].forEach(cx=>{o.push(...pie(cx,170,100,4,0));for(let i=0;i<4;i++){const a=(-90+90*(i+.5))*Math.PI/180;k++;o.push(Object.assign(A.tx(k,cx+Math.cos(a)*55,170+Math.sin(a)*55+12,32,"b"),{dur:120}))}});
   o.push(LT2("12 fjärdedelar",400,330,32,"b"),...rowC([X("3"),X("/"),F(1,4),X("="),X("3"),X("·"),X("4"),X("="),X("12","g")],400,420,44).acts);return o}},
 {say:S("Bråk delat med heltal: dela 3/4 mellan 3 personer. Var och en får 1/4. Det är samma sak som 3/4 · 1/3 = 3/12 = 1/4.",
   "A fraction divided by a whole number: share 3/4 between 3 people. Each gets 1/4. That is the same as 3/4 × 1/3 = 3/12 = 1/4.",
   "كسر مقسوم على عدد صحيح: نقسم 3/4 بين 3 أشخاص فيأخذ كل واحد 1/4. وهذا هو نفسه ‏3/4 × 1/3 = 3/12 = 1/4."),
  draw:()=>[A.wipe(),...bar(180,60,440,70,4,1,"b"),barPart(180,60,440,70,4,1,1,"g"),barPart(180,60,440,70,4,2,1,"o"),...A.frac(3,4,100,96,40),
   ...["b","g","o"].map((c,i)=>A.tx(["Ali","Sara","Leo"][i],235+i*110,170,26,c)),
   ...rowC([F(3,4),X("/"),X("3"),X("="),F(3,4),X("·"),F(1,3,"r"),X("="),F(3,12),X("="),F(1,4,"g")],400,320,42).acts,LT2("dela med 3 = gånger 1/3",400,440,28,"o")]},
 {draw:()=>rules("Så dividerar du med ett bråk",["Behåll det första bråket.","Byt / mot ·.","Vänd på bråket du delar med: 4/5 blir 5/4.","Multiplicera och förkorta."],"v"),
  say:S("Regeln är: dividera med ett bråk är samma sak som att multiplicera med det vända bråket. Varför? Att dela med 1/4 gav 4 gånger så mycket, precis som gånger 4.",
   "The rule: dividing by a fraction is the same as multiplying by the flipped fraction. Why? Dividing by 1/4 gave 4 times as much, just like times 4.",
   "القاعدة: القسمة على كسر هي نفسها الضرب في مقلوبه. لماذا؟ القسمة على 1/4 أعطتنا 4 أضعاف، تمامًا مثل الضرب في 4.")},
 wex(div(2,1,1,3),S("Exempel 1: 2 / 1/3. Vänd 1/3 till 3/1, som är 3. 2 · 3 = 6. Det får plats 6 tredjedelar i 2 hela.","Example 1: 2 ÷ 1/3. Flip 1/3 to 3/1, which is 3. 2 × 3 = 6. Six thirds fit in 2 wholes.","مثال 1: ‏2 ÷ 1/3. نقلب 1/3 إلى 3/1 أي 3. ‏2 × 3 = 6. يوجد 6 أثلاث في واحدين كاملين.")),
 wex(div(3,4,2,1),S("Exempel 2: 3/4 / 2. Talet 2 är 2/1, vänt blir det 1/2. 3/4 · 1/2 = 3/8.","Example 2: 3/4 ÷ 2. The number 2 is 2/1, flipped it is 1/2. 3/4 × 1/2 = 3/8.","مثال 2: ‏3/4 ÷ 2. العدد 2 هو 2/1 ومقلوبه 1/2. ‏3/4 × 1/2 = 3/8.")),
 wex(div(2,3,4,5),S("Exempel 3: 2/3 / 4/5. Vänd 4/5 till 5/4. 2/3 · 5/4 = 10/12, förkortat 5/6.","Example 3: 2/3 ÷ 4/5. Flip 4/5 to 5/4. 2/3 × 5/4 = 10/12, simplified 5/6.","مثال 3: ‏2/3 ÷ 4/5. نقلب 4/5 إلى 5/4. ‏2/3 × 5/4 = 10/12 وبعد الاختصار 5/6.")),
 wex(div(5,6,1,3),S("Exempel 4: 5/6 / 1/3. Vänd 1/3 till 3/1. 5/6 · 3 = 15/6 = 5/2 = 2 1/2.","Example 4: 5/6 ÷ 1/3. Flip 1/3 to 3/1. 5/6 × 3 = 15/6 = 5/2 = 2 1/2.","مثال 4: ‏5/6 ÷ 1/3. نقلب 1/3 إلى 3/1. ‏5/6 × 3 = 15/6 = 5/2 = 2 1/2.")),
 {drill:{gen:gDiv,n:5,intro:S("Din tur! Dividera.","Your turn! Divide.","دورك! اقسم.")}},
]);

/* ---------------- 5. Blandad form ---------------- */
part("🔄",S("Blandad form","Mixed numbers","الأعداد الكسرية"),[
 {say:S("7/4 är mer än en hel. 4 fjärdedelar fyller en hel pizza, 3 blir över. 7/4 = 1 3/4. Räkna: 7 delat med 4 är 1, rest 3.",
   "7/4 is more than one whole. 4 quarters fill one whole pizza, 3 are left over. 7/4 = 1 3/4. Work it out: 7 divided by 4 is 1, remainder 3.",
   "‏7/4 أكبر من واحد. أربعة أرباع تملأ بيتزا كاملة ويبقى 3. ‏7/4 = 1 3/4. احسب: 7 ÷ 4 = 1 والباقي 3."),
  draw:()=>[A.wipe(),...pie(180,190,120,4,4,"g"),...pie(460,190,120,4,3,"b"),LT2("1 hel",180,350,32,"g"),LT2("3/4",460,350,32,"b"),
   ...rowC([F(7,4),X("="),M(1,3,4,"g")],680,200,48).acts,LT2("7 / 4 = 1 rest 3",400,450,36,"o")]},
 {say:S("Tillbaka till bråk: 2 1/3. Varje hel är 3 tredjedelar, så 2 hela är 6. Plus 1 blir 7. 2 1/3 = 7/3. Regeln: heltal gånger nämnare, plus täljaren.",
   "Back to a fraction: 2 1/3. Each whole is 3 thirds, so 2 wholes are 6. Plus 1 makes 7. 2 1/3 = 7/3. The rule: whole number times denominator, plus the numerator.",
   "العودة إلى كسر: ‏2 1/3. كل واحد كامل فيه 3 أثلاث، فالاثنان فيهما 6، ومع 1 يصبح 7. ‏2 1/3 = 7/3. القاعدة: العدد الصحيح في المقام ثم نضيف البسط."),
  draw:()=>{const o=[A.wipe(),...bar(60,70,210,60,3,3,"g"),...bar(295,70,210,60,3,3,"g"),...bar(530,70,210,60,3,1,"b")];let k=0;
   [60,295,530].forEach((x,bI)=>{for(let i=0;i<(bI<2?3:1);i++){k++;o.push(Object.assign(A.tx(k,x+35+70*i,112,30,bI<2?"g":"b"),{dur:110}))}});
   o.push(...rowC([M(2,1,3),X("="),F("2·3 + 1",3),X("="),F(7,3,"g")],400,290,46).acts,LT2("heltal · nämnare + täljare",400,430,32,"o"));return o}},
 wex(toMix(11,4),S("Exempel 1: 11/4. 8/4 är 2 hela, 3/4 blir över. Svar: 2 3/4.","Example 1: 11/4. 8/4 is 2 wholes, 3/4 is left over. Answer: 2 3/4.","مثال 1: ‏11/4. ‏8/4 تساوي 2، ويبقى 3/4. الجواب: 2 3/4.")),
 wex(toMix(17,5),S("Exempel 2: 17/5. 17 delat med 5 är 3, rest 2. Svar: 3 2/5.","Example 2: 17/5. 17 divided by 5 is 3, remainder 2. Answer: 3 2/5.","مثال 2: ‏17/5. ‏17 ÷ 5 = 3 والباقي 2. الجواب: 3 2/5.")),
 wex(toImp(3,1,2),S("Exempel 3: 3 1/2 som bråk. 3 · 2 = 6, plus 1 är 7. Svar: 7/2.","Example 3: 3 1/2 as a fraction. 3 × 2 = 6, plus 1 is 7. Answer: 7/2.","مثال 3: ‏3 1/2 على شكل كسر. ‏3 × 2 = 6 ومع 1 تصبح 7. الجواب: 7/2.")),
 wex(mixAdd(1,1,2,2,1,3),S("Exempel 4: 1 1/2 + 2 1/3. Gör om till bråk: 3/2 + 7/3. Gemensam nämnare 6: 9/6 + 14/6 = 23/6 = 3 5/6.","Example 4: 1 1/2 + 2 1/3. Turn them into fractions: 3/2 + 7/3. Common denominator 6: 9/6 + 14/6 = 23/6 = 3 5/6.","مثال 4: ‏1 1/2 + 2 1/3. نحوّلها إلى كسور: ‏3/2 + 7/3. المقام المشترك 6: ‏9/6 + 14/6 = 23/6 = 3 5/6.")),
 {drill:{gen:gMix,n:5,intro:S("Din tur! Blandad form och bråk.","Your turn! Mixed numbers and fractions.","دورك! الأعداد الكسرية والكسور.")}},
]);

/* ---------------- 6. Kom ihåg ---------------- */
const card=(x,y,c,head,row,rule,s=32)=>[A.band(x,y,240,222,c),A.tx(head,x+120,y+40,28,c),...rowC(row,x+120,y+112,s).acts,A.tx(rule,x+120,y+200,fitT(rule,220,22),"k")];
part("📋",S("Kom ihåg","Remember","تذكّر"),[
 {say:S("Här är allt på en tavla. Ta en skärmbild och spara den! Plus och minus: samma nämnare först. Gånger: rakt över. Delat: vänd och multiplicera.",
   "Here is everything on one board. Take a screenshot and keep it! Plus and minus: same denominator first. Times: straight across. Divide: flip and multiply.",
   "هذا كل شيء على لوحة واحدة. التقط صورة للشاشة واحتفظ بها! الجمع والطرح: وحّد المقام أولًا. الضرب: مباشرة بسط في بسط ومقام في مقام. القسمة: اقلب واضرب."),
  draw:()=>[A.wipe(),...card(20,16,"b","Förläng / förkorta",[F(2,3),X("="),F(4,6),X("="),F(8,12)],"samma tal uppe och nere"),
   ...card(280,16,"g","Addition",[F(1,4),X("+"),F(1,2),X("="),F(3,4)],"samma nämnare först"),
   ...card(540,16,"o","Subtraktion",[F(3,4),X("−"),F(1,2),X("="),F(1,4)],"samma nämnare först"),
   ...card(20,262,"r","Multiplikation",[F(2,3),X("·"),F(3,5),X("="),F(6,15)],"uppe · uppe, nere · nere"),
   ...card(280,262,"v","Division",[F(1,2),X("/"),F(3,4),X("="),F(1,2),X("·"),F(4,3,"r")],"vänd och multiplicera",26),
   ...card(540,262,"p","Blandad form",[F(7,3),X("="),M(2,1,3)],"7 / 3 = 2 rest 1")]},
]);

LESSONS.push({id:"qbrak",subject:"quick",grades:"4–9",kind:"wb",quick:"brak",
 title:t3("Bråk: allt på ett ställe","Fractions: everything in one place","الكسور: كل شيء في مكان واحد"),
 icon:`<svg viewBox="0 0 320 180"><rect width="320" height="180" fill="#fff"/><circle cx="90" cy="90" r="60" fill="none" stroke="#1d2433" stroke-width="4"/><path d="M90 90V30A60 60 0 0 1 150 90Z" fill="#d63b2f" opacity=".75"/><path d="M90 30V150M30 90H150" stroke="#1d2433" stroke-width="3"/><text x="230" y="80" font-family="Caveat,cursive" font-weight="700" font-size="54" text-anchor="middle" fill="#2257c9">3</text><path d="M200 92H260" stroke="#1d2433" stroke-width="4"/><text x="230" y="140" font-family="Caveat,cursive" font-weight="700" font-size="54" text-anchor="middle" fill="#e07b00">4</text></svg>`,
 steps,parts,mount:qMount({steps})});
}
