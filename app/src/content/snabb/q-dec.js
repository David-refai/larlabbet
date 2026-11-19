import {A,LESSONS,R,pick,rint,shuffle,t3} from "../../legacy/core.js";
/* =====================================================================
   SNABBMATTE · DECIMALTAL: place value, decimals and fractions, +, −, ·, /,
   ×/÷ by 10, 100, 1000, rounding and estimating, and a cheat sheet.
   Column sums are drawn with the decimal commas under each other.
   ===================================================================== */
import {LRI,F,X,work,rules,qMount,qBoard,rowC,fitT,okM,noM} from "./q-0kit.js";
{
const S=(sv,en,ar)=>t3(sv,en,ar);
const dc=x=>{const s=String(+x.toFixed(6));return s.includes(".")?s.split(".")[1].length:0};
const ds=(x,d)=>(d==null?String(+(+x).toFixed(6)):(+x).toFixed(d)).replace(".",",").replace("-","−");   /* 2.5 -> "2,5" */
const LT2=(t,x,y,s,c="k",anc)=>Object.assign(A.tx(t,x,y,s,c,anc),{dur:220});
const hintT=(sv,en,ar,draw=[])=>({say:S(sv,en,ar),draw});
const hintLine=t=>[A.tx(t,400,440,fitT(t,700,30),"o")];

/* ---------- a sum or a difference in columns, commas under each other ---------- */
function column(op,a,b,o={}){const D=Math.max(dc(a),dc(b)),k=10**D,ia=Math.round(a*k),ib=Math.round(b*k),ir=op==="+"?ia+ib:ia-ib;
  const I=Math.max(...[ia,ib,ir].map(v=>String(Math.floor(v/k)).length)),N=I+D,cw=o.cw||52,s=o.s||58,x0=o.x||(400-(N*cw+(D?cw*.4:0))/2),y=o.y||[120,200,300];
  const cx=j=>x0+j*cw+cw/2+(D&&j>=I?cw*.4:0),out=[],dg=v=>String(v).padStart(N,"0");
  const row=(v,own,yy,c)=>{const t=dg(v),lead=N-Math.max(String(Math.floor(v/k)).length+D,1);
    for(let j=0;j<N;j++){if(j<lead&&j<I-1)continue;const pad=j>=I+own;out.push(A.tx(t[j],cx(j),yy,s,pad?"o":c))}
    if(D)out.push(A.tx(",",x0+I*cw+cw*.2,yy+4,s,c))};
  /* carries (addition): small and red above the top row */
  const car=[];if(op==="+"){let c=0;for(let j=N-1;j>=0;j--){const p=Math.floor(ia/10**(N-1-j))%10+Math.floor(ib/10**(N-1-j))%10+c;c=p>=10?1:0;if(c&&j>0)car.push(A.tx("1",cx(j-1),y[0]-s*.9,26,"r"))}}
  row(ia,dc(a),y[0],"k");out.push(...car);row(ib,dc(b),y[1],"k");out.push(A.tx(op,x0-cw*.5,y[1],s,"k"));
  out.push(A.p(R.line(x0-cw,y[1]+24,x0+N*cw+(D?cw*.4:0)+10,y[1]+24,.5),"k",4.5));row(ir,D,y[2],"g");
  return{acts:out,r:ir/k,D,pad:dc(a)!==dc(b),right:x0+N*cw+(D?cw*.4:0)}}
const colBoard=(op,a,b)=>{const C=column(op,a,b,{x:110}),o=[A.wipe(),...C.acts],nx=Math.max(C.right+50,430);
  o.push(LT2("kommat under kommat",nx,140,28,"b","start"));if(C.pad)o.push(LT2("fyll på med 0",nx,190,28,"o","start"));
  o.push(A.hl(nx-14,268,330,62),LT2(`${ds(a)} ${op} ${ds(b)} = ${ds(C.r)}`,nx,312,fitT(`${ds(a)} ${op} ${ds(b)} = ${ds(C.r)}`,300,36),"g","start"));return o};
const sayCol=(op,a,b,ex)=>{const r=op==="+"?a+b:a-b,P=`${ds(a)} ${op} ${ds(b)}`,pad=dc(a)!==dc(b);
  return S(`Exempel ${ex}: ${P}. Ställ upp så att kommatecknen står under varandra${pad?" och fyll på med nollor så att talen har lika många decimaler":""}. Räkna som vanligt från höger. Svar: ${ds(r)}.`,
   `Example ${ex}: ${P.replace(/,/g,".")}. Line up the decimal points${pad?" and fill in zeros so the numbers have the same number of decimals":""}. Work as usual from the right. Answer: ${String(+r.toFixed(6))}.`,
   `مثال ${ex}: ${LRI(P)}. نرتّب العددين بحيث تكون الفواصل تحت بعضها${pad?" ونضيف أصفارًا ليصبح عدد المنازل العشرية متساويًا":""}، ثم نحسب كالمعتاد من اليمين. الجواب: ${LRI(ds(r))}.`)};

/* ---------- multiplication and division as worked lines ---------- */
const mulW=(a,b)=>{const da=dc(a),db=dc(b),A_=Math.round(a*10**da),B_=Math.round(b*10**db),p=A_*B_,r=+(a*b).toFixed(6);
  return{prob:[X(`${ds(a)} · ${ds(b)}`)],rows:[[X(`${A_} · ${B_} = ${p}`)],[X(ds(r,da+db).replace(/(,\d*?)0+$/,"$1").replace(/,$/,""))]],
    notes:["räkna först utan komma",`${da} + ${db} = ${da+db} decimal${da+db===1?"":"er"}`],r}};
const divW=(a,b)=>{const db=dc(b),k=10**db,a2=+(a*k).toFixed(6),b2=Math.round(b*k),r=+(a/b).toFixed(6),rows=[],notes=[];
  if(db){rows.push([X(`${ds(a2)} / ${b2}`)]);notes.push(`gånger ${k} på båda`)}
  rows.push([X(ds(r))]);notes.push(db?"nu delar vi med ett heltal":"kommat stannar på sin plats");
  return{prob:[X(`${ds(a)} / ${ds(b)}`)],rows,notes,r}};
const W=w=>work(w.prob,w.rows,w.notes,{s:52});
/* the comma hops: × or ÷ by 10, 100, 1000 */
function hop(x,f,mulD){const z=String(f).length-1,s=ds(x),res=mulD?x*f:x/f,o=[A.wipe(),LT2(`${s} ${mulD?"·":"/"} ${f} = ${ds(+res.toFixed(6))}`,400,90,52)];
  const digits=s.replace(",",""),ci=s.indexOf(",")<0?s.length:s.indexOf(","),cw=60;
  let pad=digits;const shift=mulD?z:-z;let lead=0;if(!mulD){lead=Math.max(0,z-ci+1);pad="0".repeat(lead)+digits}
  const tail=mulD?Math.max(0,ci+z-digits.length):0;pad=pad+"0".repeat(tail);
  const x0=400-pad.length*cw/2,c0=ci+lead,c1=c0+shift,y=270;
  [...pad].forEach((d,j)=>o.push(A.tx(d,x0+j*cw+cw/2,y,64,(j<lead||j>=pad.length-tail)?"o":"k")));
  const cxp=c=>x0+c*cw;o.push(A.tx(",",cxp(c0)+2,y+8,64,"#9aa8c4"));
  for(let i=0;i<z;i++){const a=cxp(c0+(mulD?i:-i)),b=cxp(c0+(mulD?i+1:-i-1));o.push(A.arrow(a,y+40,b,y+40,"r",mulD?-22:22))}
  o.push(A.tx(",",cxp(c1)+2,y+8,64,"r"),LT2(`kommat flyttar ${z} steg ${mulD?"åt höger":"åt vänster"}`,400,400,32,"r"));return o}

/* ======================= drills ======================= */
const numQ=(title,prob,ans,sol,hint,dec=true)=>({kind:"num",dec,ans,show:ds(ans),q:qBoard(title,prob),sol,hint});
const PLACE=["tiotal","ental","tiondelar","hundradelar","tusendelar"];
function gBas(n){
  if(n===0){const t=rint(1,9),e=rint(1,9),h=rint(1,9),x=+(`${e}.${t}${h}`),which=pick([[t,2],[h,3]]),[dig,pi]=which;
    if(t===h||t===e||h===e)return gBas(0);
    const opts=shuffle([`${dig} ${PLACE[pi]}`,`${dig} ${PLACE[pi===2?3:2]}`,`${dig} ental`,`${dig} tiotal`]),right=`${dig} ${PLACE[pi]}`;
    return{kind:"choice",opts,ans:opts.indexOf(right),show:right,q:[A.wipe(),A.tx(`Vad är siffran ${dig} värd i talet ${ds(x)}?`,400,80,fitT(`Vad är siffran ${dig} värd i talet ${ds(x)}?`,740,38),"b"),A.tx(ds(x),400,280,120)],
      sol:[A.wipe(),...placeChart(x,2)],hint:hintT("Första siffran efter kommat är tiondelar, den andra hundradelar.","The first digit after the comma is tenths, the second hundredths.","الرقم الأول بعد الفاصلة أعشار، والثاني أجزاء من مئة.")}}
  if(n===1){const k=rint(1,9),D=pick([10,100]),v=D===10?k:rint(11,99);return{kind:"num",ans:v,show:String(v),q:[A.wipe(),A.tx("Skriv decimaltalet som ett bråk:",400,72,36,"b"),...rowC([X(ds(v/D)),X("="),{k:"f",n:"?",d:D,c:"o"}],400,236,66).acts],
    sol:[A.wipe(),...work([X(ds(v/D))],[[F(v,D)]],[D===10?"en decimal: tiondelar":"två decimaler: hundradelar"],{s:60})],hint:hintT("En decimal betyder tiondelar, två decimaler betyder hundradelar.","One decimal means tenths, two decimals mean hundredths.","منزلة عشرية واحدة تعني أعشارًا، ومنزلتان تعنيان أجزاء من مئة.")}}
  if(n===2||n===3){const base=rint(2,8),vals=n===2?[base/10,((base-1)*10+rint(1,9))/100,((base-1)*100+rint(11,99))/1000]:[base/10,base/10+rint(1,9)/1000,base/10+rint(1,9)/100];
    const opts=[...new Set(vals.map(v=>ds(+v.toFixed(3))))];if(opts.length<3)return gBas(n);
    const nums=opts.map(o=>+o.replace(",",".")),mx=Math.max(...nums),O=shuffle(opts);
    return{kind:"choice",opts:O,ans:O.findIndex(o=>+o.replace(",",".")===mx),show:ds(mx),q:[A.wipe(),A.tx("Vilket tal är störst?",400,80,40,"b"),...O.map((o,i)=>A.tx(o,400+(i-1)*230,280,72))],
      sol:[A.wipe(),A.tx("Fyll på med nollor och jämför:",400,70,34,"b"),...O.map((o,i)=>A.tx(ds(+o.replace(",","."),3),400,170+i*90,60,+o.replace(",",".")===mx?"g":"k")),okM(560,150+90*O.findIndex(o=>+o.replace(",",".")===mx))],
      hint:hintT("Ge talen lika många decimaler genom att fylla på med nollor. Då är det lätt att jämföra.","Give the numbers the same number of decimals by adding zeros. Then they are easy to compare.","اجعل عدد المنازل العشرية متساويًا بإضافة أصفار، فتصبح المقارنة سهلة.")}}
  const [p,q]=pick([[1,2],[1,4],[3,4],[1,5],[2,5],[3,5],[4,5],[1,8],[3,8],[7,10],[9,20]]),v=p/q,f=q===8?125:100/q;
  return numQ("Skriv bråket som decimaltal:",[F(p,q)],v,[A.wipe(),...work([F(p,q)],[[F(`${p}·${f}`,`${q}·${f}`)],[F(p*f,q*f)],[X(ds(v))]],[`förläng till ${q*f}`,"",""],{s:46})],
    hintT("Förläng så att nämnaren blir 10, 100 eller 1000. Eller räkna täljaren delat med nämnaren.","Expand so the denominator becomes 10, 100 or 1000. Or work out numerator divided by denominator.","وسّع الكسر ليصبح المقام 10 أو 100 أو 1000، أو اقسم البسط على المقام."))}
function placeChart(x,dd){const s=ds(x,dd),[i,d]=s.split(","),heads=["E",",","t","h","tu"],o=[],cw=160,x0=400-((1+d.length)*cw+30)/2;
  const cols=[[i,"ental","k"],...[...d].map((c,j)=>[c,["tiondelar","hundradelar","tusendelar"][j],["b","r","g"][j]])];
  cols.forEach(([c,h,col],j)=>{const cx=x0+j*cw+cw/2+(j?30:0);o.push(A.band(cx-70,140,140,250,col),A.tx(h,cx,180,24,col),A.tx(c,cx,320,96,col))});
  o.push(A.tx(",",x0+cw+15,330,96,"k"));void heads;return o}

function gAS(op,n){let a,b;
  if(n===0){a=rint(11,49)/10;b=rint(11,49)/10;if(op==="−"&&a<b)[a,b]=[b,a];const d1=Math.round(a*10)%10,d2=Math.round(b*10)%10;if(op==="+"?d1+d2>=10:d1<d2)return gAS(op,0)}
  else if(n===1){a=rint(15,89)/10;b=rint(15,89)/10;if(op==="−"&&a<b)[a,b]=[b,a]}
  else if(n===2){a=rint(11,99)/10;b=rint(101,999)/100;if(op==="−"&&a<b)[a,b]=[b,a]}
  else if(n===3){a=rint(3,15);b=rint(101,299)/100;if(op==="−"&&a<b)[a,b]=[b,a]}
  else{a=rint(1001,2999)/100;b=rint(101,999)/100;if(op==="−"&&a<b)[a,b]=[b,a]}
  if(a===b)return gAS(op,n);const r=+(op==="+"?a+b:a-b).toFixed(6);
  return numQ(op==="+"?"Addera:":"Subtrahera:",[X(`${ds(a)} ${op} ${ds(b)}`)],r,colBoard(op,a,b),
    hintT("Ställ upp med kommat under kommat. Fyll på med nollor så att talen får lika många decimaler.","Line up the commas. Fill in zeros so the numbers have the same number of decimals.","رتّب العددين بحيث تكون الفاصلة تحت الفاصلة، وأضف أصفارًا ليتساوى عدد المنازل العشرية."))}

function gMul(n){
  if(n===0){const f=pick([10,100,1000]),x=rint(12,987)/pick([10,100]);return numQ("Multiplicera:",[X(`${ds(x)} · ${f}`)],+(x*f).toFixed(6),hop(x,f,true),
    hintT(`Gånger ${f}: kommat flyttar ${String(f).length-1} steg åt höger.`,`Times ${f}: the comma moves ${String(f).length-1} places to the right.`,`الضرب في ${f}: تتحرك الفاصلة ${String(f).length-1} منازل إلى اليمين.`))}
  let a,b;if(n===1){a=rint(2,9)/10;b=rint(2,9)}else if(n===2){a=rint(11,49)/10;b=rint(2,9)}else if(n===3){a=rint(2,9)/10;b=rint(2,9)/10}else{a=rint(11,39)/10;b=rint(11,29)/10}
  const w=mulW(a,b);return numQ("Multiplicera:",w.prob,w.r,[A.wipe(),...W(w)],
    hintT("Räkna först utan komma. Räkna sedan hur många decimaler talen har tillsammans, så många får svaret.","First multiply without the commas. Then count the decimals in both numbers together; the answer gets that many.","اضرب أولًا من دون فاصلة، ثم عُدّ المنازل العشرية في العددين معًا؛ للجواب العدد نفسه منها."))}
function gDiv(n){
  if(n===0){const f=pick([10,100]),x=rint(5,950);return numQ("Dividera:",[X(`${ds(x)} / ${f}`)],+(x/f).toFixed(6),hop(x,f,false),
    hintT(`Delat med ${f}: kommat flyttar ${String(f).length-1} steg åt vänster.`,`Divided by ${f}: the comma moves ${String(f).length-1} places to the left.`,`القسمة على ${f}: تتحرك الفاصلة ${String(f).length-1} منازل إلى اليسار.`))}
  let a,b;if(n===1){b=rint(2,4);a=rint(11,30)*b/10}else if(n===2){b=rint(2,5);a=rint(5,25)*b/10;if(a===Math.round(a))a+=b/10}
  else if(n===3){b=rint(2,5)/10;a=rint(2,9)}else{b=rint(2,9)/100;a=rint(2,9)*b*10}
  a=+a.toFixed(4);b=+b.toFixed(4);const w=divW(a,b);return numQ("Dividera:",w.prob,w.r,[A.wipe(),...W(w)],
    dc(b)?hintT("Gör nämnaren till ett heltal: multiplicera båda talen med samma tal (10 eller 100).","Make the divisor a whole number: multiply both numbers by the same number (10 or 100).","اجعل المقسوم عليه عددًا صحيحًا: اضرب العددين في العدد نفسه (10 أو 100).")
      :hintT("Dela som vanligt. Kommat i svaret hamnar på samma ställe som i talet du delar.","Divide as usual. The comma in the answer goes in the same place as in the number you divide.","اقسم كالمعتاد، والفاصلة في الجواب في المكان نفسه كما في العدد المقسوم."))}
function gAvr(n){
  if(n===4){const a=rint(21,89)/10,b=rint(21,89)/10,ra=Math.round(a),rb=Math.round(b),e=ra*rb,opts=shuffle([e,e*10,Math.round(e/10)||1,ra+rb].map(String));
    if(new Set(opts).size<4)return gAvr(4);
    return{kind:"choice",opts,ans:opts.indexOf(String(e)),show:String(e),q:[A.wipe(),A.tx("Gör ett överslag. Ungefär hur mycket är",400,80,34,"b"),A.tx(`${ds(a)} · ${ds(b)} ?`,400,250,80)],
      sol:[A.wipe(),...work([X(`${ds(a)} · ${ds(b)}`)],[[X(`${ra} · ${rb}`)],[X(String(e))]],["avrunda till heltal",""],{s:52}).map(x=>x.t==="text"&&x.s==="="?x:x)],
      hint:hintT("Avrunda båda talen till heltal och räkna i huvudet.","Round both numbers to whole numbers and work it out in your head.","قرّب العددين إلى عددين صحيحين واحسب ذهنيًا.")}}
  const to=n===0?0:n===3?2:1,x=n===2?+(rint(1,9)+.9+rint(5,9)/100).toFixed(2):to===0?rint(101,999)/100:to===1?rint(1001,9999)/1000:rint(10001,99999)/10000;
  const r=+(Math.round(x*10**to)/10**to).toFixed(to),W0=["heltal","tiondelar","hundradelar"][to];
  return{kind:"num",dec:true,ans:r,show:ds(r,to),q:[A.wipe(),A.tx(`Avrunda till ${W0}:`,400,72,38,"b"),A.tx(ds(x),400,260,110)],sol:[A.wipe(),...roundBoard(x,to)],
    hint:hintT("Titta på siffran direkt efter den du avrundar till. 5 eller mer: avrunda uppåt. 4 eller mindre: nedåt.","Look at the digit right after the one you round to. 5 or more: round up. 4 or less: round down.","انظر إلى الرقم الذي يلي مباشرة المنزلة التي تقرّب إليها: 5 أو أكثر نقرّب إلى الأعلى، و4 أو أقل إلى الأسفل.")}}
function roundBoard(x,to){const s=ds(x),ci=s.indexOf(","),k=to===0?ci+1:ci+to+1,keep=to===0?ci-1:ci+to,r=+(Math.round(x*10**to)/10**to).toFixed(to),lo=Math.floor(x*10**to)/10**to,hi=+(lo+1/10**to).toFixed(to);
  const o=[],cw=58,x0=400-s.length*cw/2;[...s].forEach((d,j)=>o.push(A.tx(d,x0+j*cw+cw/2,120,80,j===k?"r":j===keep?"b":"k")));
  o.push(A.loop(x0+k*cw+cw/2,96,30,46,"r"),LT2(+s[k]>=5?`${s[k]} ≥ 5: uppåt`:`${s[k]} < 5: nedåt`,400,215,34,"r"));
  const L0=120,L1=680,px=v=>L0+(v-lo)/(hi-lo)*(L1-L0);o.push(A.p(R.line(L0,320,L1,320,.4),"k",4),A.p(R.line(L0,305,L0,335,.2)+R.line(L1,305,L1,335,.2)+R.line(400,310,400,330,.2),"k",3.5),
   A.tx(ds(lo,to),L0,370,34),A.tx(ds(hi,to),L1,370,34),A.p(`M${px(x)},300l.1,0`,"r",18),A.tx(s,px(x),284,26,"r"),
   A.hl(330,400,140,64),A.tx(ds(r,to),400,450,52,"g"));return o}

/* ======================= the boards ======================= */
const steps=[],parts=[];const part=(icon,name,list)=>{parts.push({icon,name,at:steps.length});steps.push(...list)};
const wex=(w,say)=>({say,draw:()=>[A.wipe(),...W(w)]});

part("🔟",S("Grunder","Basics","الأساسيات"),[
 {say:S("Efter kommat kommer delar av en hel. Första siffran är tiondelar, sedan hundradelar och tusendelar. I 3,47 har vi 3 hela, 4 tiondelar och 7 hundradelar.",
   "After the comma come parts of a whole. The first digit is tenths, then hundredths and thousandths. In 3.47 we have 3 wholes, 4 tenths and 7 hundredths.",
   "بعد الفاصلة تأتي أجزاء الواحد: الرقم الأول أعشار، ثم أجزاء من مئة، ثم من ألف. في 3,47 لدينا 3 آحاد و4 أعشار و7 أجزاء من مئة."),
  draw:()=>[A.wipe(),...placeChart(3.47,2),LT2("3 + 0,4 + 0,07",400,450,40,"b")]},
 {say:S("Tiondelar och hundradelar är bråk. 0,3 är 3 av 10 rutor, alltså 3/10. 0,25 är 25 av 100 rutor, alltså 25/100.",
   "Tenths and hundredths are fractions. 0.3 is 3 of 10 squares, so 3/10. 0.25 is 25 of 100 squares, so 25/100.",
   "الأعشار والأجزاء من مئة كسور. ‏0,3 هي 3 من 10 مربعات أي 3/10، و0,25 هي 25 من 100 مربع أي 25/100."),
  draw:()=>{const o=[A.wipe()];let g="";for(let i=1;i<10;i++)g+=R.line(60+i*30,90,60+i*30,150,.2);o.push(A.p(R.rect(60,90,300,60,.3)+g,"k",3),A.hatch(`M60,90h90v60h-90Z`,"b"),
   ...rowC([X("0,3"),X("="),F(3,10,"b")],210,240,46).acts);
   const x=470,y=60,c=24;let h="";for(let i=1;i<10;i++)h+=`M${x+i*c},${y}v${10*c}M${x},${y+i*c}h${10*c}`;o.push(A.p(R.rect(x,y,10*c,10*c,.3),"k",3.5),A.p(h,"#9aa8c4",1.4),
   A.hatch(`M${x},${y}h${2*c}v${10*c}h${-2*c}Z`,"r"),A.hatch(`M${x+2*c},${y}h${c}v${5*c}h${-c}Z`,"r"),...rowC([X("0,25"),X("="),F(25,100,"r")],590,400,42).acts);return o}},
 {say:S("Vilket är störst, 0,5 eller 0,45? Många tror 0,45 för att 45 är större än 5. Men fyll på med en nolla: 0,50 och 0,45. Nu ser du att 0,5 är störst.",
   "Which is bigger, 0.5 or 0.45? Many think 0.45 because 45 is bigger than 5. But add a zero: 0.50 and 0.45. Now you can see 0.5 is bigger.",
   "أيهما أكبر، 0,5 أم 0,45؟ يظن كثيرون أنه 0,45 لأن 45 أكبر من 5. لكن أضف صفرًا: 0,50 و0,45. الآن ترى أن 0,5 أكبر."),
  draw:()=>[A.wipe(),A.tx("0,5",250,140,90),A.tx("0,45",550,140,90),A.tx("?",400,140,70,"o"),A.arrow(250,170,250,230,"k"),
   A.tx("0,5",235,300,90),A.tx("0",318,300,90,"o"),A.tx("0,45",550,300,90),A.tx(">",400,300,80,"g"),LT2("fyll på med en nolla",250,360,26,"o"),
   LT2("50 hundradelar > 45 hundradelar",400,440,36,"g")]},
 {say:S("Bråk till decimaltal: förläng så att nämnaren blir 10, 100 eller 1000. 3/4 = 75/100 = 0,75. Det går också att räkna 3 delat med 4.",
   "Fraction to decimal: expand so the denominator becomes 10, 100 or 1000. 3/4 = 75/100 = 0.75. You can also work out 3 divided by 4.",
   "من كسر إلى عدد عشري: وسّع الكسر ليصبح المقام 10 أو 100 أو 1000. ‏3/4 = 75/100 = 0,75. ويمكنك أيضًا قسمة 3 على 4."),
  draw:()=>[A.wipe(),...work([F(3,4)],[[F("3·25","4·25")],[F(75,100)],[X("0,75")]],["4 · 25 = 100","","75 hundradelar"],{s:48})]},
 {drill:{gen:gBas,n:5,intro:S("Din tur! Platsvärde och jämförelser.","Your turn! Place value and comparing.","دورك! القيمة المكانية والمقارنة.")}},
]);
part("➕",S("Addition","Addition","الجمع"),[
 {say:S("Regeln för plus och minus med decimaltal: ställ upp så att kommatecknen står rakt under varandra. Då hamnar tiondelar under tiondelar och hundradelar under hundradelar.",
   "The rule for plus and minus with decimals: line up the decimal points straight under each other. Then tenths stand under tenths and hundredths under hundredths.",
   "قاعدة الجمع والطرح بالأعداد العشرية: رتّب العددين بحيث تكون الفواصل تحت بعضها تمامًا، فتقع الأعشار تحت الأعشار والأجزاء من مئة تحت الأجزاء من مئة."),
  draw:()=>[A.wipe(),A.tx("Rätt",200,60,40,"g"),...column("+",3.5,1.25,{x:90,y:[150,230,330],cw:46,s:52}).acts,okM(330,60),
   A.tx("Fel",600,60,40,"r"),A.tx("3,5",640,150,52),A.tx("1,25",615,230,52),A.tx("+",520,230,52),A.p(R.line(500,254,720,254,.5),"k",4.5),A.tx("1,60",620,330,52,"r"),noM(720,60),
   LT2("kommat under kommat!",400,450,34,"b")]},
 {say:sayCol("+",4.6,2.3,1),draw:()=>colBoard("+",4.6,2.3)},
 {say:sayCol("+",5.8,3.7,2),draw:()=>colBoard("+",5.8,3.7)},
 {say:sayCol("+",3.5,1.25,3),draw:()=>colBoard("+",3.5,1.25)},
 {say:sayCol("+",12,4.75,4),draw:()=>colBoard("+",12,4.75)},
 {drill:{gen:n=>gAS("+",n),n:5,intro:S("Din tur! Addera.","Your turn! Add.","دورك! اجمع.")}},
]);
part("➖",S("Subtraktion","Subtraction","الطرح"),[
 {say:S("Subtraktion ställs upp likadant. Ett heltal har ett osynligt komma längst bak: 5 = 5,00. Fyll på med nollor så att du kan låna.",
   "Subtraction is set up the same way. A whole number has an invisible comma at the end: 5 = 5.00. Fill in zeros so that you can borrow.",
   "الطرح يُرتّب بالطريقة نفسها. للعدد الصحيح فاصلة خفية في آخره: 5 = 5,00. أضف أصفارًا لتستطيع الاستلاف."),
  draw:()=>[A.wipe(),A.tx("5",260,150,100),A.arrow(320,130,440,130,"o",-20),A.tx("5,00",560,150,100),LT2("samma tal!",560,230,32,"o"),
   ...column("−",5,1.35,{x:250,y:[300,370,450],cw:44,s:48}).acts]},
 {say:sayCol("−",7.9,3.4,1),draw:()=>colBoard("−",7.9,3.4)},
 {say:sayCol("−",6.2,2.7,2),draw:()=>colBoard("−",6.2,2.7)},
 {say:sayCol("−",8.4,2.65,3),draw:()=>colBoard("−",8.4,2.65)},
 {say:sayCol("−",10,3.45,4),draw:()=>colBoard("−",10,3.45)},
 {drill:{gen:n=>gAS("−",n),n:5,intro:S("Din tur! Subtrahera.","Your turn! Subtract.","دورك! اطرح.")}},
]);
part("✖️",S("Multiplikation","Multiplication","الضرب"),[
 {say:S("Gånger 10, 100 eller 1000: kommat flyttar lika många steg åt höger som det finns nollor. 3,45 · 100 = 345.",
   "Times 10, 100 or 1000: the comma moves as many places to the right as there are zeros. 3.45 × 100 = 345.",
   "الضرب في 10 أو 100 أو 1000: تتحرك الفاصلة إلى اليمين بعدد الأصفار. ‏3,45 × 100 = 345."),draw:()=>hop(3.45,100,true)},
 {say:S("Annars: räkna först utan komma. 0,3 · 0,4: 3 · 4 = 12. Räkna sedan decimalerna: en plus en är två. Svaret får två decimaler: 0,12.",
   "Otherwise: first multiply without the commas. 0.3 × 0.4: 3 × 4 = 12. Then count the decimals: one plus one is two. The answer gets two decimals: 0.12.",
   "في غير ذلك: اضرب أولًا من دون فاصلة. ‏0,3 × 0,4: ‏3 × 4 = 12. ثم عُدّ المنازل العشرية: واحدة وواحدة تساوي اثنتين، فللجواب منزلتان: 0,12."),
  draw:()=>[A.wipe(),...rules("Så multiplicerar du decimaltal",["Räkna utan komma: 0,3 · 0,4 → 3 · 4 = 12","Räkna decimalerna i båda talen: 1 + 1 = 2","Svaret får lika många decimaler: 0,12","Kolla med överslag: ungefär rimligt?"],"r").slice(1)]},
 wex(mulW(0.4,3),S("Exempel 1: 0,4 · 3. 4 · 3 = 12. En decimal, alltså 1,2.","Example 1: 0.4 × 3. 4 × 3 = 12. One decimal, so 1.2.","مثال 1: ‏0,4 × 3. ‏4 × 3 = 12. منزلة عشرية واحدة، إذن 1,2.")),
 wex(mulW(2.5,4),S("Exempel 2: 2,5 · 4. 25 · 4 = 100. En decimal ger 10,0, alltså 10.","Example 2: 2.5 × 4. 25 × 4 = 100. One decimal gives 10.0, so 10.","مثال 2: ‏2,5 × 4. ‏25 × 4 = 100. منزلة عشرية واحدة تعطي 10,0 أي 10.")),
 wex(mulW(0.3,0.2),S("Exempel 3: 0,3 · 0,2. 3 · 2 = 6. Två decimaler: 0,06. Svaret blir mindre än talen, för vi tar en del av en del.","Example 3: 0.3 × 0.2. 3 × 2 = 6. Two decimals: 0.06. The answer is smaller than the numbers, because we take a part of a part.","مثال 3: ‏0,3 × 0,2. ‏3 × 2 = 6. منزلتان: 0,06. الجواب أصغر من العددين لأننا نأخذ جزءًا من جزء.")),
 wex(mulW(1.5,2.4),S("Exempel 4: 1,5 · 2,4. 15 · 24 = 360. Två decimaler: 3,60 = 3,6. Överslag: 2 · 2 = 4, rimligt.","Example 4: 1.5 × 2.4. 15 × 24 = 360. Two decimals: 3.60 = 3.6. Estimate: 2 × 2 = 4, reasonable.","مثال 4: ‏1,5 × 2,4. ‏15 × 24 = 360. منزلتان: 3,60 = 3,6. التقدير: ‏2 × 2 = 4، معقول.")),
 {drill:{gen:gMul,n:5,intro:S("Din tur! Multiplicera.","Your turn! Multiply.","دورك! اضرب.")}},
]);
part("➗",S("Division","Division","القسمة"),[
 {say:S("Delat med 10 eller 100: kommat flyttar åt vänster. 45 / 100 = 0,45. Saknas siffror fyller vi på med nollor framför.",
   "Divided by 10 or 100: the comma moves to the left. 45 ÷ 100 = 0.45. If digits are missing, we fill in zeros in front.",
   "القسمة على 10 أو 100: تتحرك الفاصلة إلى اليسار. ‏45 ÷ 100 = 0,45. وإذا نقصت أرقام نضيف أصفارًا في الأمام."),draw:()=>hop(45,100,false)},
 {say:S("Delar du med ett decimaltal, gör om det till ett heltal. Multiplicera båda talen med 10 eller 100, svaret blir detsamma. 6 / 0,2 = 60 / 2 = 30.",
   "If you divide by a decimal, turn it into a whole number. Multiply both numbers by 10 or 100; the answer stays the same. 6 ÷ 0.2 = 60 ÷ 2 = 30.",
   "إذا كنت تقسم على عدد عشري فحوّله إلى عدد صحيح: اضرب العددين في 10 أو 100 والجواب لا يتغير. ‏6 ÷ 0,2 = 60 ÷ 2 = 30."),
  draw:()=>[A.wipe(),A.tx("6 / 0,2",400,110,70),A.arrow(300,150,300,215,"r"),A.arrow(500,150,500,215,"r"),LT2("· 10",255,190,30,"r"),LT2("· 10",545,190,30,"r"),
   A.tx("60 / 2",400,290,70),A.hl(310,350,180,74),A.tx("= 30",400,408,64,"g"),LT2("Hur många 0,2 ryms i 6? 30 stycken.",400,475,26,"o")]},
 wex(divW(8.4,4),S("Exempel 1: 8,4 / 4. 8 delat med 4 är 2 och 4 tiondelar delat med 4 är 1 tiondel. Svar: 2,1.","Example 1: 8.4 ÷ 4. 8 divided by 4 is 2 and 4 tenths divided by 4 is 1 tenth. Answer: 2.1.","مثال 1: ‏8,4 ÷ 4. ‏8 ÷ 4 = 2 و4 أعشار ÷ 4 = عُشر واحد. الجواب: 2,1.")),
 wex(divW(7.5,3),S("Exempel 2: 7,5 / 3. 75 tiondelar delat med 3 är 25 tiondelar, alltså 2,5.","Example 2: 7.5 ÷ 3. 75 tenths divided by 3 is 25 tenths, so 2.5.","مثال 2: ‏7,5 ÷ 3. ‏75 عُشرًا ÷ 3 = 25 عُشرًا، أي 2,5.")),
 wex(divW(9,0.3),S("Exempel 3: 9 / 0,3. Gånger 10 på båda: 90 / 3 = 30.","Example 3: 9 ÷ 0.3. Times 10 on both: 90 ÷ 3 = 30.","مثال 3: ‏9 ÷ 0,3. نضرب العددين في 10: ‏90 ÷ 3 = 30.")),
 wex(divW(1.2,0.04),S("Exempel 4: 1,2 / 0,04. Två decimaler, så gånger 100 på båda: 120 / 4 = 30.","Example 4: 1.2 ÷ 0.04. Two decimals, so times 100 on both: 120 ÷ 4 = 30.","مثال 4: ‏1,2 ÷ 0,04. منزلتان، لذلك نضرب في 100: ‏120 ÷ 4 = 30.")),
 {drill:{gen:gDiv,n:5,intro:S("Din tur! Dividera.","Your turn! Divide.","دورك! اقسم.")}},
]);
part("🎯",S("Avrundning","Rounding","التقريب"),[
 {say:S("Avrunda: titta på siffran efter den du ska behålla. 5, 6, 7, 8 eller 9: avrunda uppåt. 0 till 4: nedåt. 3,47 till tiondelar: siffran efter 4 är 7, så det blir 3,5.",
   "Rounding: look at the digit after the one you keep. 5, 6, 7, 8 or 9: round up. 0 to 4: round down. 3.47 to tenths: the digit after 4 is 7, so it becomes 3.5.",
   "التقريب: انظر إلى الرقم الذي يلي الرقم الذي تحتفظ به. 5 أو 6 أو 7 أو 8 أو 9: نقرّب إلى الأعلى. من 0 إلى 4: إلى الأسفل. ‏3,47 إلى أقرب عُشر: بعد الرقم 4 يأتي 7، فتصبح 3,5."),draw:()=>[A.wipe(),...roundBoard(3.47,1)]},
 {say:S("Exempel: 12,83 till heltal. Siffran efter 12 är 8, alltså uppåt: 13.","Example: 12.83 to a whole number. The digit after 12 is 8, so up: 13.","مثال: ‏12,83 إلى أقرب عدد صحيح. الرقم بعد 12 هو 8، فنقرّب إلى الأعلى: 13."),draw:()=>[A.wipe(),...roundBoard(12.83,0)]},
 {say:S("Exempel: 2,96 till tiondelar. 9 tiondelar plus en blir 10 tiondelar, alltså en hel till: 3,0.","Example: 2.96 to tenths. 9 tenths plus one makes 10 tenths, which is one more whole: 3.0.","مثال: ‏2,96 إلى أقرب عُشر. ‏9 أعشار وواحد تصبح 10 أعشار أي واحدًا كاملًا: 3,0."),draw:()=>[A.wipe(),...roundBoard(2.96,1)]},
 {say:S("Överslag: avrunda till enkla tal och räkna i huvudet, så ser du om svaret är rimligt. 4,9 · 6,1 är ungefär 5 · 6 = 30.","Estimating: round to easy numbers and work it out in your head, so you can see if an answer is reasonable. 4.9 × 6.1 is about 5 × 6 = 30.","التقدير: قرّب إلى أعداد سهلة واحسب ذهنيًا لترى هل الجواب معقول. ‏4,9 × 6,1 تساوي تقريبًا ‏5 × 6 = 30."),
  draw:()=>[A.wipe(),...work([X("4,9 · 6,1")],[[X("5 · 6")],[X("30")]],["avrunda till heltal","ungefär"],{s:58}),LT2("exakt: 29,89",400,460,30,"b")]},
 {drill:{gen:gAvr,n:5,intro:S("Din tur! Avrunda och gör överslag.","Your turn! Round and estimate.","دورك! قرّب وقدّر.")}},
]);
const card=(x,y,c,head,line,rule)=>[A.band(x,y,240,222,c),A.tx(head,x+120,y+40,28,c),A.tx(line,x+120,y+125,fitT(line,220,36),"k"),A.tx(rule,x+120,y+200,fitT(rule,220,22),"k")];
part("📋",S("Kom ihåg","Remember","تذكّر"),[
 {say:S("Allt om decimaltal på en tavla. Kommat under kommat vid plus och minus. Räkna utan komma vid gånger. Gör nämnaren hel vid delat.",
   "Everything about decimals on one board. Comma under comma for plus and minus. Multiply without the comma. Make the divisor whole when dividing.",
   "كل شيء عن الأعداد العشرية على لوحة واحدة: الفاصلة تحت الفاصلة في الجمع والطرح، والضرب من دون فاصلة، وفي القسمة اجعل المقسوم عليه عددًا صحيحًا."),
  draw:()=>[A.wipe(),...card(20,16,"b","Platsvärde","3,47","3 + 4 tiondelar + 7 hundradelar"),...card(280,16,"g","Plus","3,50 + 1,25","kommat under kommat"),
   ...card(540,16,"o","Minus","5,00 − 1,35","fyll på med nollor"),...card(20,262,"r","Gånger","0,3 · 0,4 = 0,12","utan komma, räkna decimaler"),
   ...card(280,262,"v","Delat","6 / 0,2 = 60 / 2","gör nämnaren till heltal"),...card(540,262,"p","Avrunda","3,47 ≈ 3,5","5 eller mer: uppåt")]},
]);

LESSONS.push({id:"qdec",subject:"quick",grades:"4–9",kind:"wb",
 title:t3("Decimaltal: allt på ett ställe","Decimals: everything in one place","الأعداد العشرية: كل شيء في مكان واحد"),icon:"",
 steps,parts,mount:qMount({steps})});
}
