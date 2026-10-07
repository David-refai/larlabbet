/* ===== y7a.js ===== */
/* =====================================================================
   YEAR 7 (y7a): multiplying and dividing negative numbers, powers,
   scientific notation, rounding / significant figures / estimating.
   Everything is inside one block so helper names cannot clash.
   ===================================================================== */
{
const LRI=s=>"⁦"+s+"⁩";                       /* keeps formulas left-to-right inside Arabic speech */
const ng=n=>n<0?"−"+(-n):String(n);                      /* real minus sign */
const pn=n=>n<0?`(${ng(n)})`:String(n);                  /* negative numbers in brackets */
const SUPD="⁰¹²³⁴⁵⁶⁷⁸⁹",SUP=n=>String(n).replace(/\d/g,c=>SUPD[+c]);
const mark=(a,m)=>Object.assign(a,{m});
const upTo=m=>g=>{const k=g.sol.findIndex(a=>a.m===m);return k<0?g.sol.slice():g.sol.slice(0,k)};
const txe=(s,x,y,size,c,anc)=>Object.assign(A.tx(s,x,y,size,c,anc),{dur:170});
const ICO=b=>`<svg viewBox="0 0 320 180"><rect width="320" height="180" fill="#fff"/>${b}</svg>`;
const CV=`font-family="Caveat,cursive" font-weight="700" text-anchor="middle"`;
const non10=(a,b)=>{let r;do{r=rint(a,b)}while(r%10===0);return r};
/* Caveat glyph widths (em), so powers, loops and markers land on the right characters */
const CWD={"0":.45,"1":.45,"2":.45,"3":.45,"4":.45,"5":.43,"6":.47,"7":.45,"8":.45,"9":.44," ":.24,"·":.19,"×":.45,"÷":.45,"/":.33,"+":.45,"−":.45,"-":.33,"=":.45,"≈":.55,",":.2,".":.2,"(":.33,")":.33,"?":.37,":":.2,"<":.45,">":.45,"a":.45,"n":.46,"k":.37,"r":.36,"m":.61,"g":.36,"s":.35,"x":.34};
const cw=(s,z)=>{let w=0;for(const ch of String(s))w+=CWD[ch]??(/[A-ZÅÄÖ]/.test(ch)?.5:.38);return w*z};
const chX=(s,i,x0,z)=>x0+cw(String(s).slice(0,i),z)+cw(String(s)[i],z)/2;
/* "2^5 = 32": text with raised exponents. Returns text actions plus .w, .x0 and .sup (exponent boxes) */
const segs=s=>{const o=[];let cur="";s=String(s);for(let i=0;i<s.length;){if(s[i]==="^"){if(cur)o.push({s:cur});cur="";i++;let e="";while(i<s.length&&/[0-9?n]/.test(s[i]))e+=s[i++];o.push({s:e,sup:1})}else cur+=s[i++]}if(cur)o.push({s:cur});return o};
const SK=.62,RS=.42;
const mxw=(s,z)=>segs(s).reduce((a,g)=>a+(g.sup?cw(g.s,z*SK)+z*.06:cw(g.s,z)),0);
function mx(s,x,y,z=48,c="k",anc="middle",supC){const W=mxw(s,z);let p=anc==="middle"?x-W/2:anc==="end"?x-W:x;const o=[],sup=[],x0=p;
 for(const g of segs(s)){const zz=g.sup?z*SK:z,lead=g.s.length-g.s.trimStart().length,t=g.s.trim(),px=p+(g.sup?z*.03:0)+cw(" ".repeat(lead),zz);
  if(t&&!g.sup&&t.includes("≈")){let q=px;for(const pc of t.split(/(≈)/)){const tt=pc.trim(),ld=pc.length-pc.trimStart().length;if(tt)o.push(A.tx(tt,q+cw(" ".repeat(ld),zz)+(pc==="≈"?zz*.04:0),y,zz,c,"start"));q+=cw(pc,zz)}}
  else if(t){o.push(A.tx(t,px,g.sup?y-z*RS:y,zz,g.sup&&supC?supC:c,"start"));if(g.sup)sup.push({x:px,w:cw(t,zz),y:y-z*RS,z:zz})}
  p+=g.sup?cw(g.s,zz)+z*.06:cw(g.s,zz)}
 return Object.assign(o,{w:W,x0,sup})}
const hlc=(cx,w,y,z)=>A.hl(cx-w/2-22,y-z*.92,w+44,z*1.24);
/* "Check: 6 · (−3) = −18" with the label on the reading side */
const chk=(f,x,y,z=32)=>{const fw=mxw(f,z);return lang==="ar"?[...mx(f,x-fw/2-30,y,z,"b","start"),A.tx("تحقّق:",x+fw/2-14,y,z,"b","end")]
 :[A.tx(L(t3("Kontroll:","Check:","")),x-fw/2+20,y,z,"b","end"),...mx(f,x-fw/2+34,y,z,"b","start")]};
/* horizontal number line */
function nl(lo,hi,x1,x2,y,lab=1){const X=v=>x1+(v-lo)*(x2-x1)/(hi-lo);let d=R.line(x1-14,y,x2+14,y,.4);
 for(let v=lo;v<=hi;v++){const big=v%lab===0;d+=`M${f1(X(v))},${y-(v===0?16:big?11:6)}v${v===0?32:big?22:12}`}
 const o=[A.p(d,"k",3.5)];for(let v=Math.ceil(lo/lab)*lab;v<=hi;v+=lab)o.push(txe(ng(v),X(v),y+40,24,v<0?"b":v>0?"r":"k"));return{o,X}}
/* a row of single digits, and hops of the decimal point between them (B(j) = gap before digit j) */
function drow(ds,y,z,sp,cols){const n=ds.length,X=i=>400+(i-(n-1)/2)*sp;return{X,B:j=>X(j)-sp/2,o:ds.map((d,i)=>txe(d,X(i),y,z,cols?cols[i]:"k"))}}
function hops(B,from,to,y,up,c="o"){const o=[],s=to>from?1:-1;let k=0;for(let j=from;j!==to;j+=s){k++;const x1=B(j)+s*4,x2=B(j+s)-s*4;
 o.push(A.arrow(x1,y,x2,y,c,(up?-1:1)*s*20),qt(k,(x1+x2)/2,up?y-26:y+40,22,c))}return o}
const sepAt=(x,y,z,c)=>txe(SEP(),x,y,z,c);
const head=(x,y,r=22)=>R.circ(x,y,r)+`M${f1(x-8)},${f1(y-5)}l.1,0M${f1(x+8)},${f1(y-5)}l.1,0`+`M${f1(x-9)},${f1(y+6)}Q${f1(x)},${f1(y+14)} ${f1(x+9)},${f1(y+6)}`;
const tick=(x,y,c="g")=>A.p(`M${x-15},${y}L${x-4},${y+13}L${x+17},${y-15}`,c,6);
const cross=(x,y,c="r")=>A.p(R.line(x-13,y-13,x+13,y+13,.2)+R.line(x+13,y-13,x-13,y+13,.2),c,6);
const WORK=t3("Räkna ut","Work out","احسب");

/* ---------------------------------------------------------------
   1. int7: multiplying and dividing negative numbers
   --------------------------------------------------------------- */
const SAME=t3("lika tecken → plus","same signs → plus","إشارتان متماثلتان: الناتج موجب"),
 DIFF=t3("olika tecken → minus","different signs → minus","إشارتان مختلفتان: الناتج سالب"),
 SAME2=t3("lika tecken → plus","same signs → plus","متماثلتان: موجب"),DIFF2=t3("olika tecken → minus","different signs → minus","مختلفتان: سالب");
const INT={steps:[
 {say:t3("I ett spel tappar du 4 poäng varje runda. Efter 3 rundor har du tappat 12 poäng: 3 · (−4) = −12.",
   "In a game you lose 4 points every round. After 3 rounds you have lost 12 points: 3 × (−4) = −12.",
   `في لعبة تخسر 4 نقاط في كل جولة. بعد 3 جولات تكون قد خسرت 12 نقطة: ${LRI("3 × (−4) = −12")}.`),
  draw:()=>{const N=nl(-14,2,90,710,300,2),o=[A.wipe(),A.tx(L(t3("−4 poäng per runda","−4 points per round",`${LRI("−4")} نقاط في كل جولة`)),400,70,40,"b"),...N.o,A.p(dots([[N.X(0),300]]),"k",14)];
   for(let i=0;i<3;i++){const x1=N.X(-4*i),x2=N.X(-4*i-4),m=(x1+x2)/2;
    o.push(A.arrow(x1-4,284,x2+4,284,"r",50),qt("−4",m,228,30,"r"),txe(L(t3(`runda ${i+1}`,`round ${i+1}`,`الجولة ${i+1}`)),m,172,26,"k"))}
   const f=`3 ${MUL()} (−4) = −12`;o.push(A.p(dots([[N.X(-12),300]]),"g",18),hlc(400,mxw(f,52),445,52),...mx(f,400,445,52,"g"));return o}},
 {say:t3("Följ mönstret. Varje gång första talet minskar med 1 ökar svaret med 4. Då blir (−1) · (−4) = 4. Minus gånger minus blir plus!",
   "Follow the pattern. Each time the first number goes down by 1, the answer goes up by 4. So (−1) × (−4) = 4. Minus times minus makes plus!",
   `تتبّع النمط: كلما نقص العدد الأول 1 زاد الناتج 4. إذن ${LRI("(−1) × (−4) = 4")}. سالب في سالب يعطي موجبًا!`),
  draw:()=>{const M=MUL(),o=[A.wipe()],Y=i=>62+i*60;
   [3,2,1,0,-1,-2].forEach((a,i)=>{const c=i>=4?"g":"k";o.push(...mx(`${pn(a)} ${M} (−4)`,390,Y(i),44,c,"end"),...mx(`= ${ng(-4*a)}`,404,Y(i),44,c,"start"))});
   for(let i=0;i<5;i++)o.push(A.arrow(200,Y(i)-12,200,Y(i+1)-24,"b",16),qt("−1",152,Y(i)+22,26,"b"),A.arrow(540,Y(i)-12,540,Y(i+1)-24,"o",-16),qt("+4",588,Y(i)+22,26,"o"));
   o.push(A.hl(190,410,420,62),A.tx(L(t3("minus · minus = plus","minus × minus = plus","سالب × سالب = موجب")),400,456,42,"g"));return o}},
 {say:t3("Det här är teckenreglerna. Lika tecken ger ett positivt svar och olika tecken ger ett negativt svar.",
   "These are the sign rules. Same signs give a positive answer and different signs give a negative answer.",
   "هذه قواعد الإشارات: الإشارتان المتماثلتان تعطيان ناتجًا موجبًا، والإشارتان المختلفتان تعطيان ناتجًا سالبًا."),
  draw:()=>{const M=MUL(),rows=[["+","+","+",`3 ${M} 4 = 12`,"g"],["+","−","−",`3 ${M} (−4) = −12`,"r"],["−","+","−",`(−3) ${M} 4 = −12`,"r"],["−","−","+",`(−3) ${M} (−4) = 12`,"g"]],Y=[140,212,284,356],o=[A.wipe(),A.tx(L(t3("Teckenregler","Sign rules","قواعد الإشارات")),400,62,42,"b")];
   rows.forEach((r,i)=>o.push(A.band(90,Y[i]-46,620,62,r[4]),...mx(`${r[0]} ${M} ${r[1]} = ${r[2]}`,245,Y[i],50,r[4]),...mx(r[3],555,Y[i],38)));
   o.push(A.p(R.line(395,96,395,374,.2),"#9aa8c4",2.5),A.tx(L(SAME2),220,446,32,"g"),A.tx(L(DIFF2),580,446,32,"r"));return o}},
 {say:t3("Division följer samma regler. Temperaturen sjunker 18 grader på 6 timmar: (−18) / 6 = −3. Den sjunker alltså 3 grader per timme.",
   "Division follows the same rules. The temperature falls 18 degrees in 6 hours: (−18) ÷ 6 = −3. So it falls 3 degrees per hour.",
   `القسمة تتبع القواعد نفسها. تنخفض درجة الحرارة 18 درجة في 6 ساعات: ${LRI("(−18) ÷ 6 = −3")}، أي أنها تنخفض 3 درجات في الساعة.`),
  draw:()=>{const N=nl(-20,2,80,720,280,2),D=DIVS(),M=MUL(),o=[A.wipe(),A.tx(L(t3("18 grader kallare på 6 timmar","18 degrees colder in 6 hours","أبرد بـ 18 درجة خلال 6 ساعات")),400,66,38,"b"),
    A.tx(L(t3("Hur mycket per timme?","How much per hour?","كم في الساعة؟")),400,116,32),...N.o,A.p(dots([[N.X(0),280]]),"k",14)];
   for(let i=0;i<6;i++){const x1=N.X(-3*i),x2=N.X(-3*i-3);o.push(A.arrow(x1-3,266,x2+3,266,"b",34),qt("−3",(x1+x2)/2,224,26,"b"))}
   const f=`(−18) ${D} 6 = −3`;o.push(A.p(dots([[N.X(-18),280]]),"b",18),hlc(400,mxw(f,50),392,50),...mx(f,400,392,50,"g"),...chk(`6 ${M} (−3) = −18`,400,460,32));return o}},
 {say:t3("Hur många gånger ryms −6 i −24? Fyra gånger. Lika tecken ger plus, så (−24) / (−6) = 4.",
   "How many times does −6 fit into −24? Four times. Same signs give plus, so (−24) ÷ (−6) = 4.",
   `كم مرة يدخل ${LRI("−6")} في ${LRI("−24")}؟ أربع مرات. الإشارتان متماثلتان فالناتج موجب: ${LRI("(−24) ÷ (−6) = 4")}.`),
  draw:()=>{const N=nl(-26,2,80,720,280,2),D=DIVS(),o=[A.wipe(),A.tx(L(t3("Hur många gånger ryms −6 i −24?","How many times does −6 fit into −24?",`كم مرة يدخل ${LRI("−6")} في ${LRI("−24")}؟`)),400,62,38,"b"),...N.o,A.p(dots([[N.X(0),280]]),"k",14)];
   for(let i=0;i<4;i++){const x1=N.X(-6*i),x2=N.X(-6*i-6),m=(x1+x2)/2;o.push(A.arrow(x1-3,266,x2+3,266,"r",40),qt("−6",m,216,28,"r"),A.p(R.circ(m,152,19),"o",3),qt(i+1,m,161,26,"o"))}
   const f=`(−24) ${D} (−6) = 4`;o.push(A.p(dots([[N.X(-24),280]]),"r",18),hlc(400,mxw(f,50),392,50),...mx(f,400,392,50,"g"),A.tx(L(SAME),400,458,32,"g"));return o}},
 {say:t3("Med tre faktorer räknar du två i taget: (−2) · (−3) = 6 och 6 · (−5) = −30. Tre minustecken är ett udda antal, så svaret blir negativt.",
   "With three factors, work two at a time: (−2) × (−3) = 6 and 6 × (−5) = −30. Three minus signs is an odd number, so the answer is negative.",
   `مع ثلاثة عوامل نضرب عاملين في كل مرة: ${LRI("(−2) × (−3) = 6")} ثم ${LRI("6 × (−5) = −30")}. ثلاث إشارات سالبة عدد فردي، لذلك الناتج سالب.`),
  draw:()=>{const M=MUL(),s=`(−2) ${M} (−3) ${M} (−5)`,z=60,W=mxw(s,z),x0=400-W/2,o=[A.wipe(),...mx(s,400,150,z)],s1=`(−2) ${M} (−3)`;
   o.push(A.loop(x0+cw(s1,z)/2+3,130,cw(s1,z)/2+9,44,"b"));
   let k=0;[...s].forEach((ch,i)=>{if(ch==="−"){k++;const x=chX(s,i,x0,z);o.push(A.p(R.circ(x,52,17),"r",3),qt(k,x,61,24,"r"))}});
   const f2=`= 6 ${M} (−5)`,f3="= −30";
   o.push(...mx(f2,x0,245,52,"k","start"),A.hl(x0-18,335-50,mxw(f3,56)+36,68),...mx(f3,x0,335,56,"g","start"),
    A.tx(L(t3("3 minustecken: udda antal → minus","3 minus signs: odd number → minus","3 إشارات سالبة: عدد فردي، إذن الناتج سالب")),400,440,32,"r"));return o}}
]};
LESSONS.push({id:"int7",subject:"math",grades:"7",kind:"wb",
 title:t3("Multiplikation och division med negativa tal","Multiplying and dividing negative numbers","ضرب الأعداد السالبة وقسمتها"),
 icon:ICO(`<path d="M30 130H290" stroke="#1d2433" stroke-width="3.5"/>${[0,1,2,3,4,5,6,7,8].map(i=>`<path d="M${40+i*30} ${i===6?120:124}V${i===6?140:136}" stroke="#1d2433" stroke-width="2.5"/>`).join("")}<path d="M218 118Q190 90 162 118M158 118Q130 90 102 118" fill="none" stroke="#d63b2f" stroke-width="3.5"/><text x="220" y="166" ${CV} font-size="24" fill="#1d2433">0</text><text x="100" y="166" ${CV} font-size="24" fill="#2257c9">−4</text><text x="160" y="70" ${CV} font-size="54" fill="#1d2433">− · − = <tspan fill="#1e9e5a">+</tspan></text>`),
 steps:INT.steps,mount:wbMount(INT),
 gen(level){const M=MUL(),D=DIVS(),title=A.tx(L(WORK),400,80,40,"b");
  if(level<2){const hi=level?12:9,sg=level?pick([[-1,1],[1,-1],[-1,-1],[-1,-1]]):pick([[-1,1],[1,-1]]),div=Math.random()<.5,a=rint(2,hi),b=rint(2,hi);
   let x,y,ans;if(div){x=sg[0]*a*b;y=sg[1]*b;ans=x/y}else{x=sg[0]*a;y=sg[1]*b;ans=x*y}
   const op=div?D:M,expr=`${pn(x)} ${op} ${pn(y)}`,same=sg[0]===sg[1],fin=`${expr} = ${ng(ans)}`,ab=mx(`${Math.abs(x)} ${op} ${Math.abs(y)} = ${Math.abs(ans)}`,400,374,40);
   return{kind:"num",ans,signed:true,show:ng(ans),q:[A.wipe(),title,...mx(expr,400,220,80)],
    sol:[A.tx(L(same?SAME:DIFF),400,300,34,same?"g":"r"),mark(ab[0],"ans"),...ab.slice(1),hlc(400,mxw(fin,50),456,50),...mx(fin,400,456,50,"g")]}}
  if(Math.random()<.5){let v;do{v=[0,0,0].map(()=>rint(2,6)*(Math.random()<.5?-1:1))}while(v.every(t=>t>0));
   const k=v.filter(t=>t<0).length,p=v[0]*v[1],ans=p*v[2],expr=v.map(pn).join(` ${M} `),odd=k%2===1;
   const cnt=t3(`${k} minustecken: ${odd?"udda":"jämnt"} antal → ${odd?"minus":"plus"}`,`${k} minus sign${k>1?"s":""}: ${odd?"odd":"even"} number → ${odd?"minus":"plus"}`,
    `${k===1?"إشارة سالبة واحدة":k===2?"إشارتان سالبتان":"3 إشارات سالبة"}: ${odd?"عدد فردي، إذن الناتج سالب":"عدد زوجي، إذن الناتج موجب"}`);
   const l2=mx(`= ${ng(p)} ${M} ${pn(v[2])}`,400,372,46),f=`= ${ng(ans)}`;
   return{kind:"num",ans,signed:true,show:ng(ans),q:[A.wipe(),title,...mx(expr,400,210,68)],
    sol:[A.tx(L(cnt),400,290,32,odd?"r":"g"),mark(l2[0],"ans"),...l2.slice(1),hlc(400,mxw(f,54),456,54),...mx(f,400,456,54,"g")]}}
  let v;do{v=[0,0,0,0].map(()=>rint(2,9)*(Math.random()<.5?-1:1))}while(v.filter(t=>t<0).length<2||(v[0]*v[1]>0&&v[2]*v[3]>0));
  const s1=`${pn(v[0])} ${M} ${pn(v[1])}`,s2=`${pn(v[2])} ${M} ${pn(v[3])}`,z=60,w1=mxw(s1,z)*1.06,w2=mxw(s2,z)*1.06,gap=74,x0=400-(w1+gap+w2)/2,
   c1=x0+w1/2,c2=x0+w1+gap+w2/2,p1=v[0]*v[1],p2=v[2]*v[3],ans=p1+p2,l2=mx(`= ${ng(p1)} + ${pn(p2)}`,400,365,46),f=`= ${ng(ans)}`;
  return{kind:"num",ans,signed:true,show:ng(ans),q:[A.wipe(),title,...mx(s1,c1,210,z),A.tx("+",x0+w1+gap/2,210,z),...mx(s2,c2,210,z)],
   sol:[A.loop(c1,192,w1/2+12,44,"b"),A.loop(c2,192,w2/2+12,44,"o"),A.p(R.circ(c1,278,24),"b",3.5),txe(p1<0?"−":"+",c1,293,44,"b"),A.p(R.circ(c2,278,24),"o",3.5),txe(p2<0?"−":"+",c2,293,44,"o"),
    mark(l2[0],"ans"),...l2.slice(1),hlc(400,mxw(f,54),456,54),...mx(f,400,456,54,"g")]}}
});

/* ---------------------------------------------------------------
   2. pow7: powers and powers of ten
   --------------------------------------------------------------- */
const ZER=n=>t3(`${n} ${n===1?"nolla":"nollor"}`,`${n} ${n===1?"zero":"zeros"}`,n===1?"صفر واحد":n===2?"صفران":`${n} أصفار`);
const POW={steps:[
 {say:t3("Du skickar ett klipp till 2 kompisar. Var och en skickar det vidare till 2 nya, och så vidare. Efter 5 steg får 32 personer klippet: 2 · 2 · 2 · 2 · 2 = 32.",
   "You send a clip to 2 friends. Each of them sends it on to 2 new people, and so on. After 5 steps, 32 people get the clip: 2 × 2 × 2 × 2 × 2 = 32.",
   `ترسل مقطعًا إلى صديقين، وكل واحد منهما يرسله إلى شخصين جديدين، وهكذا. بعد 5 خطوات يصل المقطع إلى 32 شخصًا: ${LRI("2 × 2 × 2 × 2 × 2 = 32")}.`),
  draw:()=>{const M=MUL(),C=["k","b","o","g","r","b"],Y=k=>58+k*62,o=[A.wipe()];
   for(let k=0;k<6;k++){const n=2**k;o.push(A.p(dots(Array.from({length:n},(_,i)=>[460+(i-(n-1)/2)*15,Y(k)])),C[k],11),qt(n,150,Y(k)+10,34,C[k]));
    if(k<5)o.push(A.arrow(98,Y(k)+2,98,Y(k+1)-14,"o",14),qt(`${M}2`,56,Y(k)+40,24,"o"))}
   const f=`2 ${M} 2 ${M} 2 ${M} 2 ${M} 2 = 32`;o.push(qt(L(t3("du","you","أنت")),498,Y(0)+9,26),hlc(400,mxw(f,46),458,46),...mx(f,400,458,46,"g"));return o}},
 {say:t3("Ett kortare sätt att skriva är 2⁵, två upphöjt till fem. 2 är basen och 5 är exponenten. Exponenten säger hur många tvåor som multipliceras.",
   "A shorter way to write it is 2⁵, two to the power of five. 2 is the base and 5 is the exponent. The exponent tells how many 2s are multiplied.",
   `طريقة أقصر للكتابة هي ${LRI("2⁵")}، وتُقرأ «اثنان أُس خمسة». العدد 2 هو الأساس و5 هو الأس، والأس يبيّن عدد مرات ضرب العدد 2 في نفسه.`),
  draw:()=>{const M=MUL(),b=mx("2^5",200,262,140,"b","middle","o"),s=b.sup[0],f1s=`= 2 ${M} 2 ${M} 2 ${M} 2 ${M} 2`,xs=340+cw("= ",48),xe=340+mxw(f1s,48);
   return[A.wipe(),...b,A.tx(L(t3("bas","base","الأساس")),150,362,36,"b"),A.arrow(160,330,172,272,"b",-8),
    A.tx(L(t3("exponent","exponent","الأس")),320,84,36,"o"),A.arrow(300,98,s.x+s.w+6,s.y-s.z*.6,"o",-12),
    ...mx(f1s,340,220,48,"k","start"),A.p(R.line(xs,244,xe,244,.3)+`M${f1(xs)},236v16M${f1(xe)},236v16`,"o",3),txe(L(t3("5 faktorer","5 factors","5 عوامل")),(xs+xe)/2,282,28,"o"),
    A.hl(318,312,150,66),...mx("= 32",340,360,58,"g","start"),A.tx(L(t3("två upphöjt till fem","two to the power of five","اثنان أُس خمسة")),400,455,36,"b")]}},
 {say:t3("Ett tal upphöjt till 2 kallas kvadraten av talet. 4² = 4 · 4 = 16, lika många rutor som i en kvadrat med sidan 4. 1, 4, 9 och 16 är kvadrattal.",
   "A number to the power of 2 is called the square of the number. 4² = 4 × 4 = 16, as many tiles as in a square with side 4. 1, 4, 9 and 16 are square numbers.",
   `العدد المرفوع إلى الأس 2 يسمّى مربّع العدد. ${LRI("4² = 4 × 4 = 16")}، وهو عدد المربعات الصغيرة في مربع طول ضلعه 4. الأعداد 1 و4 و9 و16 أعداد مربعة.`),
  draw:()=>{const M=MUL(),u=34,C=["r","o","b","g"],o=[A.wipe(),A.tx(L(t3("Kvadrattal","Square numbers","الأعداد المربعة")),400,66,42,"b")];let x=125;
   for(let s=1;s<=4;s++){const w=s*u,y=320-w;o.push(A.hatch(`M${x},${y}h${w}v${w}h${-w}Z`,C[s-1]),...gridRect(x,y,s,s,u,C[s-1]),...mx(`${s}^2 = ${s*s}`,x+w/2,378,36));if(s===4)o.push(qt("4",x+w/2,y-12,26),qt("4",x-18,y+w/2+9,26));x+=w+70}
   const f=`4^2 = 4 ${M} 4 = 16`;o.push(hlc(400,mxw(f,48),456,48),...mx(f,400,456,48,"g"));return o}},
 {say:t3("Tiopotenser är extra enkla. Exponenten talar om hur många nollor som står efter ettan. 10⁶ är en miljon.",
   "Powers of ten are extra easy. The exponent tells you how many zeros come after the 1. 10⁶ is one million.",
   `قوى العشرة سهلة جدًا: الأس يبيّن عدد الأصفار بعد الواحد. ${LRI("10⁶")} تساوي مليونًا.`),
  draw:()=>{const Y=[122,186,250,314,378],E=[1,2,3,4,6],o=[A.wipe(),A.tx(L(t3("Tiopotenser","Powers of ten","قوى العشرة")),400,62,42,"b")];
   E.forEach((n,i)=>{const c=n===6?"g":"k";o.push(...mx(`10^${n}`,320,Y[i],50,c,"end","o"),...mx(`= ${fmt(10**n)}`,336,Y[i],50,c,"start"),txe(L(ZER(n)),690,Y[i]-4,28,"o"))});
   o.push(A.hl(196,Y[4]-48,420,64),...mx("10^6 =",392,458,44,"g","end"),A.tx(L(t3("en miljon","one million","مليون")),406,458,42,"g","lead"));return o}},
 {say:t3("Potenser räknar du först, före gånger och plus. I 3 + 2 · 4² blir 4² = 16, sedan 2 · 16 = 32 och sist 3 + 32 = 35.",
   "Work out powers first, before times and plus. In 3 + 2 × 4², first 4² = 16, then 2 × 16 = 32 and last 3 + 32 = 35.",
   `نحسب القوى أولًا، قبل الضرب والجمع. في ${LRI("3 + 2 × 4²")}: أولًا ${LRI("4² = 16")}، ثم ${LRI("2 × 16 = 32")}، وأخيرًا ${LRI("3 + 32 = 35")}.`),
  draw:()=>{const M=MUL(),z=56,xs=230,l1=mx(`3 + 2 ${M} 4^2`,xs+cw("= ",z),160,z),s=l1.sup[0];
   return[A.wipe(),A.tx(L(t3("Potenser först!","Powers first!","القوى أولًا!")),400,66,42,"b"),...l1,A.loop(s.x-4,140,27,40,"o"),
    ...mx(`= 3 + 2 ${M} 16`,xs,245,z,"k","start"),txe(L(t3("1. potensen","1. the power","أولًا: القوة")),570,240,30,"o","lead"),
    ...mx("= 3 + 32",xs,330,z,"k","start"),txe(L(t3("2. gånger","2. times","ثانيًا: الضرب")),570,325,30,"b","lead"),
    A.hl(xs-20,415-52,mxw("= 35",z)+40,70),...mx("= 35",xs,415,z,"g","start"),txe(L(t3("3. plus","3. plus","ثالثًا: الجمع")),570,410,30,"g","lead")]}}
]};
LESSONS.push({id:"pow7",subject:"math",grades:"7",kind:"wb",
 title:t3("Potenser och tiopotenser","Powers and powers of ten","القوى وقوى العشرة"),
 icon:ICO(`<text x="72" y="132" ${CV} font-size="120" fill="#2257c9">2</text><text x="118" y="70" ${CV} font-size="60" fill="#e07b00">5</text>${(()=>{let d="",c="";const Y=k=>34+k*36,X=(k,i)=>232+(i-(2**k-1)/2)*72/2**k;for(let k=0;k<4;k++)for(let i=0;i<2**k;i++){c+=`<circle cx="${X(k,i)}" cy="${Y(k)}" r="6" fill="${["#1d2433","#2257c9","#e07b00","#1e9e5a"][k]}"/>`;if(k<3)for(const j of[2*i,2*i+1])d+=`M${X(k,i)} ${Y(k)}L${X(k+1,j)} ${Y(k+1)}`}return`<path d="${d}" stroke="#9aa8c4" stroke-width="2"/>${c}`})()}<text x="232" y="172" ${CV} font-size="26" fill="#1e9e5a">= 32</text>`),
 steps:POW.steps,mount:wbMount(POW),
 gen(level){const M=MUL(),title=A.tx(L(WORK),400,80,40,"b");
  if(level===0){const [b,n]=pick([[2,rint(3,6)],[3,rint(2,4)],[4,rint(2,3)],[5,rint(2,3)],[pick([6,7,8,9,11,12]),2],[pick([6,7,8,9,11,12]),2]]),ans=b**n,fin=`${b}^${n} = ${fmt(ans)}`;
   return{kind:"num",ans,show:fmt(ans),q:[A.wipe(),title,...mx(`${b}^${n}`,400,250,120)],
    sol:[...mx(`= ${Array(n).fill(b).join(` ${M} `)}`,400,352,46),mark(hlc(400,mxw(fin,52),452,52),"ans"),...mx(fin,400,452,52,"g")]}}
  if(level===1){const t=rint(0,2);
   if(t===0){const n=rint(2,7),ans=10**n,fin=`10^${n} = ${fmt(ans)}`;
    return{kind:"num",ans,show:fmt(ans),q:[A.wipe(),title,...mx(`10^${n}`,400,250,120)],
     sol:[...mx(`10^2 = 100`,400,330,38,"b"),mark(txe(L(ZER(n)),400,384,34,"o"),"ans"),hlc(400,mxw(fin,52),456,52),...mx(fin,400,456,52,"g")]}}
   if(t===1){const a=rint(2,9),n=rint(2,5),ans=a*10**n,fin=`${a} ${M} 10^${n} = ${fmt(ans)}`;
    return{kind:"num",ans,show:fmt(ans),q:[A.wipe(),title,...mx(`${a} ${M} 10^${n}`,400,250,110)],
     sol:[...mx(`10^${n} = ${fmt(10**n)}`,400,350,42,"b"),mark(hlc(400,mxw(fin,50),452,50),"ans"),...mx(fin,400,452,50,"g")]}}
   const n=rint(3,7),str=fmt(10**n),z=86,ql=mx(`${str} = 10^?`,400,250,z,"k","middle","o"),cnt=[];let k=0;
   [...str].forEach((ch,i)=>{if(ch==="0")cnt.push(qt(++k,chX(str,i,ql.x0,z),292,24,"o"))});const fin=`${str} = 10^${n}`;
   return{kind:"num",ans:n,show:String(n),q:[A.wipe(),A.tx(L(t3("Vilken är exponenten?","What is the exponent?","ما الأس؟")),400,80,40,"b"),...ql],
    sol:[...mx("100 = 10^2",400,360,40,"b"),mark(cnt[0],"ans"),...cnt.slice(1),hlc(400,mxw(fin,50),455,50),...mx(fin,400,455,50,"g")]}}
  const t=rint(0,2);
  if(t===0){const c=rint(2,9),n=c<=4&&Math.random()<.4?3:2,a=rint(1,20),b=rint(2,5),p=c**n,ans=a+b*p,f=`= ${ans}`,ql=mx(`${a} + ${b} ${M} ${c}^${n}`,400,200,80),s=ql.sup[0],bl=s.x-2.4-cw(String(c),80),l2=mx(`= ${a} + ${b*p}`,400,376,46);
   return{kind:"num",ans,show:String(ans),q:[A.wipe(),title,...ql],
    sol:[A.loop((bl+s.x+s.w)/2,174,(s.x+s.w-bl)/2+5,46,"o"),...mx(`= ${a} + ${b} ${M} ${p}`,400,300,46),mark(l2[0],"ans"),...l2.slice(1),hlc(400,mxw(f,54),456,54),...mx(f,400,456,54,"g")]}}
  if(t===1){let a,b,plus;do{a=rint(2,9);b=rint(1,7);plus=Math.random()<.6}while(plus?a+b>15:a-b<2);const s=plus?a+b:a-b,ans=s*s,f=`= ${ans}`;
   const l2=mx(`= ${s} ${M} ${s}`,400,376,46);
   return{kind:"num",ans,show:String(ans),q:[A.wipe(),title,...mx(`(${a} ${plus?"+":"−"} ${b})^2`,400,200,84)],
    sol:[...mx(`= ${s}^2`,400,300,46),mark(l2[0],"ans"),...l2.slice(1),hlc(400,mxw(f,54),456,54),...mx(f,400,456,54,"g")]}}
  const [b,n]=pick([[2,rint(4,9)],[3,rint(3,6)],[4,rint(3,5)],[5,rint(3,4)]]),v=b**n,ch=`${Array(n).fill(b).join(` ${M} `)} = ${fmt(v)}`,z=Math.min(44,640/(mxw(ch,1))),x0=400-mxw(ch,z)/2,fin=`${b}^${n} = ${fmt(v)}`;
  const cl=mx(ch,400,370,z);
  return{kind:"num",ans:n,show:String(n),q:[A.wipe(),A.tx(L(t3("Vilken exponent fattas?","Which exponent is missing?","ما الأس الناقص؟")),400,80,40,"b"),...mx(`${b}^? = ${fmt(v)}`,400,210,84,"k","middle","o")],
   sol:[...mx(`${b}^2 = ${b*b}`,400,292,38,"b"),mark(cl[0],"ans"),...cl.slice(1),...Array.from({length:n},(_,i)=>qt(i+1,chX(ch,i*4,x0,z),404,22,"o")),hlc(400,mxw(fin,50),462,50),...mx(fin,400,462,50,"g")]}}
});

/* ---------------------------------------------------------------
   3. sci7: scientific notation for big numbers
   --------------------------------------------------------------- */
const sunP=(cx,cy,r)=>R.circ(cx,cy,r)+[...Array(10)].map((_,i)=>{const a=i*Math.PI/5;return R.line(cx+Math.cos(a)*(r+9),cy+Math.sin(a)*(r+9),cx+Math.cos(a)*(r+24),cy+Math.sin(a)*(r+24),.2)}).join("");
const MOVE=(n,right)=>t3(`Flytta decimaltecknet ${n} steg åt ${right?"höger":"vänster"}`,`Move the decimal point ${n} steps to the ${right?"right":"left"}`,`حرّك الفاصلة العشرية ${n} ${n<=10?"خطوات":"خطوة"} إلى ${right?"اليمين":"اليسار"}`);
const SCIW=t3("Skriv i grundpotensform","Write in scientific notation","اكتب بالصيغة العلمية");
/* digit row for a ·10^n, decimal point hops to the right */
const toFull=(aInt,n,dec,y,z)=>{const ds=[...String(aInt),..."0".repeat(n-dec)],R1=drow(ds,y,z,Math.min(64,620/ds.length),ds.map((_,i)=>i<=dec?"k":"o"));return{R1,ds}};
const SCI={steps:[
 {say:t3("Avståndet från jorden till solen är ungefär 150 000 000 km. Med så många nollor är det lätt att räkna fel. I grundpotensform skriver vi 1,5 · 10⁸ km.",
   "The distance from the Earth to the Sun is about 150,000,000 km. With so many zeros it is easy to make a mistake. In scientific notation we write 1.5 × 10⁸ km.",
   `المسافة بين الأرض والشمس نحو ${LRI("150000000")} كيلومتر. مع هذا العدد الكبير من الأصفار يسهل الخطأ. بالصيغة العلمية نكتب ${LRI("1.5 × 10⁸ km")}.`),
  draw:()=>{const f=`${dfmt(1.5,1)} ${MUL()} 10^8 km`;return[A.wipe(),A.hatch(R.circ(120,200,62),"o"),A.p(sunP(120,200,62),"o",4),A.hatch(R.circ(690,200,22),"b"),A.p(R.circ(690,200,22),"b",4),
   A.p(R.dashed(214,200,656,200),"k",3),A.p(`M214,188v24M656,188v24`,"k",3),A.tx(`${fmt(150000000)} km`,435,170,44),
   txe(L(t3("solen","the Sun","الشمس")),120,312,30,"o"),txe(L(t3("jorden","the Earth","الأرض")),690,262,30,"b"),A.arrow(435,222,435,288,"g"),
   hlc(435,mxw(f,58),352,58),...mx(f,435,352,58,"g"),A.tx(L(t3("grundpotensform","scientific notation","الصيغة العلمية")),435,445,36,"b")]}},
 {say:t3("Flytta decimaltecknet åt vänster tills det bara står en siffra före det: 1,5. Vi flyttade 8 steg, alltså gånger 10⁸.",
   "Move the decimal point to the left until there is only one digit in front of it: 1.5. We moved it 8 steps, so it is times 10⁸.",
   `نحرّك الفاصلة العشرية إلى اليسار حتى يبقى رقم واحد قبلها: ${LRI("1.5")}. حرّكناها 8 خطوات، إذن نضرب في ${LRI("10⁸")}.`),
  draw:()=>{const D=drow([..."150000000"],240,72,62),f=`${fmt(150000000)} = ${dfmt(1.5,1)} ${MUL()} 10^8`;
   return[A.wipe(),A.tx(L(t3("Flytta decimaltecknet","Move the decimal point","حرّك الفاصلة العشرية")),400,62,40,"b"),...D.o,sepAt(D.B(9),248,72,"#9aa8c4"),
    ...hops(D.B,9,1,176,true),sepAt(D.B(1),248,72,"r"),hlc(400,mxw(f,48),352,48),...mx(f,400,352,48,"g"),
    A.tx(L(t3("8 steg åt vänster = exponenten 8","8 steps to the left = exponent 8","8 خطوات إلى اليسار = الأس 8")),400,446,34,"o")]}},
 {say:t3("I grundpotensform står först ett tal som är minst 1 men mindre än 10, sedan en tiopotens. 3,2 · 10⁶ är rätt skrivet. 32 · 10⁵ och 0,32 · 10⁷ har samma värde, men är inte grundpotensform.",
   "In scientific notation there is first a number that is at least 1 but less than 10, then a power of ten. 3.2 × 10⁶ is written correctly. 32 × 10⁵ and 0.32 × 10⁷ have the same value, but are not scientific notation.",
   `في الصيغة العلمية نكتب أولًا عددًا لا يقل عن 1 وأصغر من 10، ثم قوة للعدد 10. الكتابة ${LRI("3.2 × 10⁶")} صحيحة. أما ${LRI("32 × 10⁵")} و${LRI("0.32 × 10⁷")} فلهما القيمة نفسها، لكنهما ليستا بالصيغة العلمية.`),
  draw:()=>{const M=MUL(),t=mx(`a ${M} 10^n`,400,122,72,"k","middle","o"),s=t.sup[0],ax=t.x0+cw("a",72)/2,rows=[[`${dfmt(3.2,1)} ${M} 10^6`,1,""],[`32 ${M} 10^5`,0,"32 > 10"],[`${dfmt(.32,2)} ${M} 10^7`,0,`${dfmt(.32,2)} < 1`]],Y=[292,362,432];
   const o=[A.wipe(),...t,A.tx(L(t3("minst 1 men mindre än 10","at least 1 but less than 10","1 على الأقل وأصغر من 10")),210,214,28,"b"),A.arrow(230,186,ax-6,136,"b",-10),
    A.tx(L(t3("en tiopotens","a power of ten","قوة للعدد 10")),640,100,28,"o"),A.arrow(556,92,s.x+s.w+12,s.y+4,"o",10),A.p(R.line(150,240,650,240,.3),"#9aa8c4",2.5)];
   rows.forEach(([e,ok,why],i)=>{o.push(...mx(e,300,Y[i],46,ok?"g":"k"),ok?tick(480,Y[i]-16):cross(480,Y[i]-16));if(why)o.push(...mx(why,610,Y[i],32,"r"))});return o}},
 {say:t3("Sverige har ungefär 1,06 · 10⁷ invånare. Nu flyttar vi decimaltecknet 7 steg åt höger och fyller på med nollor: 10 600 000.",
   "Sweden has about 1.06 × 10⁷ inhabitants. Now we move the decimal point 7 steps to the right and fill in zeros: 10,600,000.",
   `يبلغ عدد سكان السويد نحو ${LRI("1.06 × 10⁷")} نسمة. نحرّك الفاصلة العشرية 7 خطوات إلى اليمين ونملأ الخانات بالأصفار: ${LRI("10600000")}.`),
  draw:()=>{const M=MUL(),D=drow([..."10600000"],290,64,62,["k","k","k","o","o","o","o","o"]),f=`${dfmt(1.06,2)} ${M} 10^7 = ${fmt(10600000)}`;
   return[A.wipe(),A.tx(L(t3("Sveriges befolkning","Population of Sweden","عدد سكان السويد")),400,56,36,"b"),...mx(`${dfmt(1.06,2)} ${M} 10^7`,400,138,62),
    ...D.o,sepAt(D.B(1),298,64,"#9aa8c4"),...hops(D.B,1,8,310,false),hlc(400,mxw(f,46),446,46),...mx(f,400,446,46,"g")]}},
 {say:t3("Vilken planet är längst från solen? Jämför exponenterna först: 10⁹ är tio gånger så mycket som 10⁸, så Neptunus är längst bort. Med samma exponent jämför du talen framför: 7,8 är större än 1,5.",
   "Which planet is furthest from the Sun? Compare the exponents first: 10⁹ is ten times as much as 10⁸, so Neptune is furthest away. With the same exponent, compare the numbers in front: 7.8 is bigger than 1.5.",
   `أي كوكب هو الأبعد عن الشمس؟ نقارن الأسس أولًا: ${LRI("10⁹")} تساوي عشرة أضعاف ${LRI("10⁸")}، إذن نبتون هو الأبعد. وعندما يتساوى الأس نقارن العددين في المقدمة: 7.8 أكبر من 1.5.`),
  draw:()=>{const M=MUL(),P=[[t3("Jorden","Earth","الأرض"),1.5,8,"b",12],[t3("Jupiter","Jupiter","المشتري"),7.8,8,"o",24],[t3("Neptunus","Neptune","نبتون"),4.5,9,"b",18]],Y=[150,245,340],
    o=[A.wipe(),A.tx(L(t3("Avstånd till solen","Distance from the Sun","البعد عن الشمس")),400,62,40,"b")];
   P.forEach(([nm,a,e,c,r],i)=>{const l=mx(`${dfmt(a,1)} ${M} 10^${e}  km`,410,Y[i],48,"k","start"),s=l.sup[0];
    o.push(A.hatch(R.circ(150,Y[i]-16,r),c),A.p(R.circ(150,Y[i]-16,r),c,3.5),txe(L(nm),196,Y[i],38,"k","lead"),...l,A.loop(s.x+s.w/2+3,s.y-s.z*.38,15,20,e===9?"r":"o"))});
   const f=`${dfmt(4.5,1)} ${M} 10^9 > ${dfmt(7.8,1)} ${M} 10^8 > ${dfmt(1.5,1)} ${M} 10^8`;o.push(hlc(400,mxw(f,40),446,40),...mx(f,400,446,40,"g"));return o}}
]};
LESSONS.push({id:"sci7",subject:"math",grades:"7",kind:"wb",
 title:t3("Grundpotensform","Scientific notation","الصيغة العلمية"),
 icon:ICO(`<circle cx="62" cy="64" r="32" fill="#e07b00" fill-opacity=".15" stroke="#e07b00" stroke-width="3.5"/>${[...Array(8)].map((_,i)=>{const a=i*Math.PI/4;return`<path d="M${(62+Math.cos(a)*39).toFixed(1)} ${(64+Math.sin(a)*39).toFixed(1)}L${(62+Math.cos(a)*50).toFixed(1)} ${(64+Math.sin(a)*50).toFixed(1)}" stroke="#e07b00" stroke-width="3" stroke-linecap="round"/>`}).join("")}<path d="M120 64H248" stroke="#1d2433" stroke-width="3" stroke-dasharray="8 8"/><circle cx="268" cy="64" r="13" fill="#2257c9" fill-opacity=".2" stroke="#2257c9" stroke-width="3.5"/><text x="160" y="160" ${CV} font-size="52" fill="#1e9e5a">1,5 · 10<tspan font-size="32" dy="-22">8</tspan></text>`),
 steps:SCI.steps,mount:wbMount(SCI),
 gen(level){const M=MUL();
  const mk=(dmin,nmin,nmax)=>{const dec=rint(dmin,2),aInt=dec===0?rint(2,9):dec===1?non10(11,99):non10(101,999),n=rint(nmin,nmax);return{dec,aInt,n,a:aInt/10**dec,N:aInt*10**(n-dec)}};
  /* full number -> scientific notation: digit row with the decimal point hopping left */
  const toSci=({dec,aInt,n,a,N},y0)=>{const ds=[...String(N)],D=drow(ds,y0,56,Math.min(64,620/ds.length)),f=`${fmt(N)} = ${dfmt(a,dec)} ${M} 10^${n}`,h=hops(D.B,ds.length,1,y0+16,false);
   return[...D.o,sepAt(D.B(ds.length),y0+6,56,"#9aa8c4"),mark(h[0],"ans"),...h.slice(1),sepAt(D.B(1),y0+6,56,"r"),hlc(400,mxw(f,44),458,44),...mx(f,400,458,44,"g")]};
  if(level===0){const v=mk(1,3,8),{dec,aInt,n,a}=v,F=toFull(aInt,n,dec,306,56),f=`${dfmt(a,dec)} ${M} 10^${n} = ${fmt(v.N)}`;
   return{kind:"num",ans:v.N,show:fmt(v.N),q:[A.wipe(),A.tx(L(t3("Skriv talet utan tiopotens","Write the number without a power of ten","اكتب العدد دون قوة العشرة")),400,66,38,"b"),...mx(`${dfmt(a,dec)} ${M} 10^${n}`,400,170,84)],
    sol:[txe(L(MOVE(n,true)),400,234,30,"b"),mark(F.R1.o[0],"ans"),...F.R1.o.slice(1),sepAt(F.R1.B(1),312,56,"#9aa8c4"),...hops(F.R1.B,1,F.ds.length,322,false),hlc(400,mxw(f,44),458,44),...mx(f,400,458,44,"g")]}}
  if(level===1){const v=mk(0,4,9);
   return{kind:"num",ans:v.n,show:String(v.n),q:[A.wipe(),A.tx(L(SCIW),400,62,38,"b"),...mx(fmt(v.N),400,146,66),...mx(`= ${dfmt(v.a,v.dec)} ${M} 10^?`,400,226,56,"k","middle","o")],sol:toSci(v,316)}}
  if(Math.random()<.5){const [C,n1,n2]=pick([[t3("Antal visningar av en video:","Views of a video:","عدد مشاهدات مقطع فيديو:"),5,9],[t3("Antal invånare i ett land:","Population of a country:","عدد سكان بلد:"),5,8],[t3("Avstånd från solen till en komet (km):","Distance from the Sun to a comet (km):","المسافة من الشمس إلى مذنّب (بالكيلومتر):"),7,9]]),v=mk(0,n1,n2);
   return{kind:"pair",ans:[v.a,v.n],dec:true,sep:`${M} 10^`,check:(x,d)=>Math.abs(x-v.a)<1e-9&&d===v.n,show:`${dfmt(v.a,v.dec)} ${M} 10${SUP(v.n)}`,
    q:[A.wipe(),A.tx(L(C),400,62,34,"b"),...mx(`${fmt(v.N)} = ? ${M} 10^?`,400,150,60,"k","middle","o"),A.tx(L(t3("Skriv i grundpotensform.","Write it in scientific notation.","اكتبه بالصيغة العلمية.")),400,222,32)],sol:toSci(v,316)}}
  let v;do{const e=rint(5,8);v=[0,1,2].map(()=>{const m=non10(11,99),x=Math.random()<.6?e:rint(5,8);return{m,e:x,val:m*10**x}})}while(new Set(v.map(o=>o.val)).size<3||v.every(o=>o.e===v[0].e));
  const best=v.reduce((b,o,i)=>o.val>v[b].val?i:b,0),Y=[160,255,350],names=["A","B","C"].map(c=>t3(`Spel ${c}`,`Game ${c}`,`اللعبة ${c}`)),ex=v.map(o=>`${dfmt(o.m/10,1)} ${M} 10^${o.e}`),q=[A.wipe(),A.tx(L(t3("Vilket spel har laddats ner flest gånger?","Which game has been downloaded the most times?","أي لعبة نُزِّلت أكبر عدد من المرات؟")),400,62,34,"b")],L1=[];
  v.forEach((o,i)=>{const l=mx(ex[i],520,Y[i],52);q.push(A.tx(L(names[i]),230,Y[i],40,"b"),...l);const s=l.sup[0];L1.push(A.loop(s.x+s.w/2+3,s.y-s.z*.38,15,20,"o"))});
  const ord=[0,1,2].sort((i,j)=>v[j].val-v[i].val),f=ord.map(i=>ex[i]).join(" > ");
  return{kind:"choice",opts:names,ans:best,show:L(names[best]),q,sol:[...L1,mark(A.loop(400,Y[best]-18,250,44,"g"),"ans"),hlc(400,mxw(f,40),452,40),...mx(f,400,452,40,"g")]}}
});

/* ---------------------------------------------------------------
   4. round7: rounding, significant figures and estimating
   --------------------------------------------------------------- */
const KEEP=k=>t3(`${k} värdesiffr${k===1?"a":"or"}`,`${k} significant figure${k===1?"":"s"}`,k===1?"رقم معنوي واحد":"رقمان معنويان");
const UPDN=(d,up)=>t3(`${d}: ${up?"uppåt":"nedåt"}`,`${d}: round ${up?"up":"down"}`,`${d}: ${up?"للأعلى":"للأسفل"}`);
/* zoomed number line from lo to hi (in hundredths) with the value h marked */
function zoom(lo,hi,h,dec,Y,x1=130,x2=670){let d=R.line(x1-12,Y,x2+12,Y,.4);for(let i=0;i<=10;i++){const x=x1+(x2-x1)*i/10,l=i%10===0?16:i===5?12:7;d+=`M${f1(x)},${Y-l}v${2*l}`}
 const px=x1+(x2-x1)*(h-lo)/(hi-lo),up=(h-lo)*2>=hi-lo,ex=up?x2:x1;
 const pt=[A.p(dots([[px,Y]]),"r",16),qt(dfmt(h/100,2),px,Y-50,28,"r")];
 return{px,up,pt,o:[A.p(d,"k",3.5),qt(dfmt(lo/100,dec),x1,Y+44,28),qt(dfmt(hi/100,dec),x2,Y+44,28),...pt],line:[A.p(d,"k",3.5),qt(dfmt(lo/100,dec),x1,Y+44,28),qt(dfmt(hi/100,dec),x2,Y+44,28)],
  arr:A.arrow(px+(up?6:-6),Y-14,ex+(up?-4:4),Y-14,"g",up?-26:26)}}
const pizzaBox=(x,y)=>R.rect(x,y,72,72,.3);
const tkt=(x,y,w=58,h=38)=>R.rect(x,y,w,h,.3)+R.dashed(x+w*.27,y+5,x+w*.27,y+h-5,6);
const RND7={steps:[
 {say:t3("Mobilräkningen blev 237,46 kr. Till hela kronor tittar vi på tiondelarna: 4 betyder nedåt, alltså 237 kr. Till en decimal tittar vi på hundradelarna: 6 betyder uppåt, alltså 237,5 kr.",
   "The phone bill was 237.46 kr. To whole kronor we look at the tenths: 4 means round down, so 237 kr. To one decimal place we look at the hundredths: 6 means round up, so 237.5 kr.",
   `بلغت فاتورة الهاتف ${LRI("237.46")} كرونة. للتقريب إلى أقرب كرونة ننظر إلى رقم الأعشار: 4 يعني للأسفل، فتصبح 237 كرونة. وللتقريب إلى منزلة عشرية واحدة ننظر إلى رقم الأجزاء من المئة: 6 يعني للأعلى، فتصبح ${LRI("237.5")} كرونة.`),
  draw:()=>{const Z1=zoom(23700,23800,23746,0,210,80,540),Z2=zoom(23740,23750,23746,1,388,80,540);
   return[A.wipe(),A.tx(L(t3("Mobilräkningen: 237,46 kr","Phone bill: 237.46 kr",`فاتورة الهاتف: ${LRI("237.46")} كرونة`)),400,52,38,"b"),
    txe(L(t3("till hela kronor","to whole kronor","إلى أقرب كرونة")),310,118,28,"o"),...Z1.o,Z1.arr,...mx("≈ 237 kr",680,222,40,"g"),
    txe(L(t3("till en decimal","to one decimal place","إلى منزلة عشرية واحدة")),310,296,28,"o"),...Z2.o,Z2.arr,...mx(`≈ ${dfmt(237.5,1)} kr`,680,400,40,"g")]}},
 {say:t3("Matchen sågs av 52 384 personer. Med 2 värdesiffror behåller vi de två första siffrorna. Nästa siffra är 3, så vi avrundar nedåt till 52 000.",
   "The match was watched by 52,384 people. With 2 significant figures we keep the first two digits. The next digit is 3, so we round down to 52,000.",
   `شاهد المباراة ${LRI("52384")} شخصًا. بالتقريب إلى رقمين معنويين نُبقي أول رقمين. الرقم التالي هو 3، لذلك نقرّب للأسفل إلى ${LRI("52000")}.`),
  draw:()=>{const X=i=>240+i*80,f=`${fmt(52384)} ≈ ${fmt(52000)}`;
   return[A.wipe(),A.tx(L(t3("Värdesiffror","Significant figures","الأرقام المعنوية")),400,56,40,"b"),A.tx(L(t3("52 384 personer såg matchen","52,384 people watched the match","شاهد المباراة 52384 شخصًا")),400,106,30),
    ...[..."52384"].map((d,i)=>A.tx(d,X(i),232,84,i<2?"g":"k")),A.loop(280,204,76,56,"g"),txe(L(KEEP(2)),270,300,28,"g"),
    A.arrow(X(2),352,X(2),252,"b"),txe(L(UPDN(3,false)),X(2)+12,386,28,"b","lead"),hlc(400,mxw(f,52),458,52),...mx(f,400,458,52,"g")]}},
 {say:t3("Ett sandkorn kan väga 0,04728 g. Nollorna i början är inte värdesiffror, de visar bara var talet börjar. Med 2 värdesiffror blir det 0,047 g.",
   "A grain of sand can weigh 0.04728 g. The zeros at the start are not significant figures, they only show where the number begins. With 2 significant figures it becomes 0.047 g.",
   `قد تزن حبة رمل ${LRI("0.04728")} غرام. الأصفار في البداية ليست أرقامًا معنوية، فهي تبيّن فقط أين يبدأ العدد. بالتقريب إلى رقمين معنويين يصبح ${LRI("0.047")} غرام.`),
  draw:()=>{const ch=["0",SEP(),"0","4","7","2","8"],W=ch.map(c=>c===SEP()?36:72),xs=[];let x=400-W.reduce((a,b)=>a+b)/2;W.forEach(w=>{xs.push(x+w/2);x+=w});
   const f=`${dfmt(.04728,5)} g ≈ ${dfmt(.047,3)} g`,col=i=>i<3?"#9aa8c4":i<5?"g":"k";
   return[A.wipe(),A.tx(L(t3("Ett sandkorn: 0,04728 g","A grain of sand: 0.04728 g",`حبة رمل: ${LRI("0.04728")} غرام`)),400,56,38,"b"),
    ...ch.map((c,i)=>A.tx(c,xs[i],240,84,col(i))),A.p(R.line(xs[0]-28,262,xs[2]+28,262,.3),"#9aa8c4",4),txe(L(t3("räknas inte","don't count","لا تُحسب")),xs[1],302,28,"#7d8aa5"),
    A.loop((xs[3]+xs[4])/2,212,70,56,"g"),txe(L(KEEP(2)),(xs[3]+xs[4])/2,130,28,"g"),A.arrow(xs[5],356,xs[5],262,"b"),txe(L(UPDN(2,false)),xs[5]+12,388,28,"b","lead"),
    hlc(400,mxw(f,48),458,48),...mx(f,400,458,48,"g")]}},
 {say:t3("Ni ska ha fest och köper 8 pizzor för 89 kr styck. Gör ett överslag: 89 är nästan 90, och 8 · 90 = 720. Exakt blir det 712 kr, så överslaget är nära.",
   "You're having a party and buy 8 pizzas at 89 kr each. Make an estimate: 89 is almost 90, and 8 × 90 = 720. The exact cost is 712 kr, so the estimate is close.",
   `ستقيمون حفلة وتشترون 8 بيتزا سعر الواحدة 89 كرونة. لنقدّر: 89 قريب من 90، و${LRI("8 × 90 = 720")}. المبلغ بالضبط 712 كرونة، فالتقدير قريب جدًا.`),
  draw:()=>{const M=MUL(),P=[];for(let r=0;r<2;r++)for(let i=0;i<4;i++)P.push([60+i*88,138+r*92]);
   return[A.wipe(),A.tx(L(t3("Överslag","Estimate","التقدير")),400,56,42,"b"),A.tx(L(t3("89 kr/st","89 kr each","89 كرونة للواحدة")),218,112,30,"o"),
    A.p(P.map(([x,y])=>pizzaBox(x,y)).join(""),"k",3.5),A.p(P.map(([x,y])=>R.circ(x+36,y+36,25)).join(""),"o",3.5),A.p(P.map(([x,y])=>R.line(x+12,y+36,x+60,y+36,.2)+R.line(x+36,y+12,x+36,y+60,.2)).join(""),"o",2),A.p(dots(P.flatMap(([x,y])=>[[x+25,y+25],[x+48,y+26],[x+24,y+47],[x+47,y+48]])),"r",8),
    A.tx(L(t3("8 pizzor","8 pizzas","8 بيتزا")),218,354,32),...mx(`8 ${M} 89`,600,160,50),...mx(`≈ 8 ${M} 90`,600,238,50,"o"),hlc(600,mxw("= 720 kr",52),318,52),...mx("= 720 kr",600,318,52,"g"),
    A.tx(L(t3("exakt: 712 kr","exact: 712 kr","بالضبط: 712 كرونة")),400,446,34,"b")]}},
 {say:t3("Resan kostar 2 395 kr och delas av 6 kompisar. Välj ett tal som är lätt att dela: 2 395 är nära 2 400, och 2 400 / 6 = 400. Var och en betalar ungefär 400 kr.",
   "The trip costs 2,395 kr and is shared by 6 friends. Choose a number that is easy to divide: 2,395 is close to 2,400, and 2,400 ÷ 6 = 400. Each person pays about 400 kr.",
   `تكلّف الرحلة ${LRI("2395")} كرونة يتقاسمها 6 أصدقاء. نختار عددًا تسهل قسمته: 2395 قريب من 2400، و${LRI("2400 ÷ 6 = 400")}. يدفع كل واحد نحو 400 كرونة.`),
  draw:()=>{const D=DIVS(),X=i=>150+i*100;
   return[A.wipe(),A.tx(L(t3("Resan: 2 395 kr för 6 kompisar","The trip: 2,395 kr for 6 friends","الرحلة: 2395 كرونة لـ 6 أصدقاء")),400,56,36,"b"),
    ...mx(`${fmt(2395)} ${D} 6`,400,128,50),...mx(`≈ ${fmt(2400)} ${D} 6`,400,202,50,"o"),hlc(400,mxw("= 400",52),278,52),...mx("= 400",400,278,52,"g"),
    A.p([0,1,2,3,4,5].map(i=>head(X(i),352,24)).join(""),"k",3.5),...[0,1,2,3,4,5].map(i=>qt("≈ 400 kr",X(i),420,24,"g"))]}}
]};
LESSONS.push({id:"round7",subject:"math",grades:"7",kind:"wb",
 title:t3("Avrundning och överslag","Rounding and estimating","التقريب والتقدير"),
 icon:ICO(`<ellipse cx="104" cy="58" rx="54" ry="36" fill="none" stroke="#1e9e5a" stroke-width="3.5"/><text x="160" y="80" ${CV} font-size="58" fill="#1d2433"><tspan fill="#1e9e5a">52</tspan> 384</text><text x="160" y="152" ${CV} font-size="50" fill="#1e9e5a">≈ 52 000</text>`),
 steps:RND7.steps,mount:wbMount(RND7),
 gen(level){const M=MUL(),D=DIVS();
  if(level===0){const [u,a,b]=pick([["kr",12,999],["km",2,99],["s",10,59]]);let d;do{d=non10(1,99)}while(d<8||d>92);const h=rint(a,b)*100+d,to=rint(0,1);
   const lo=to?Math.floor(h/10)*10:Math.floor(h/100)*100,hi=lo+(to?10:100),Z=zoom(lo,hi,h,to,330),res=Z.up?hi:lo,ans=res/100,fin=`${dfmt(h/100,2)} ≈ ${dfmt(ans,to)} ${u}`;
   const ttl=to?pick([t3("Avrunda till en decimal","Round to one decimal place","قرّب إلى منزلة عشرية واحدة"),t3("Avrunda till tiondelar","Round to tenths","قرّب إلى الأعشار"),t3("Avrunda till närmaste tiondel","Round to the nearest tenth","قرّب إلى أقرب عُشر")]):u==="kr"?t3("Avrunda till hela kronor","Round to whole kronor","قرّب إلى أقرب كرونة"):t3("Avrunda till heltal","Round to a whole number","قرّب إلى أقرب عدد صحيح");
   return{kind:"num",dec:true,ans,show:`${dfmt(ans,to)} ${u}`,q:[A.wipe(),A.tx(L(ttl),400,76,40,"b"),A.tx(`${dfmt(h/100,2)} ${u}`,400,206,96)],
    sol:[...Z.line,mark(Z.pt[0],"ans"),Z.pt[1],Z.arr,hlc(400,mxw(fin,50),456,50),...mx(fin,400,456,50,"g")]}}
  if(level===1){let str,res,resS,k,isDec=Math.random()<.4;
   if(!isDec){const len=rint(4,6);k=rint(1,2);let N;do{N=rint(10**(len-1),10**len-1)}while(N%10===0);const p=10**(len-k);res=Math.round(N/p)*p;str=fmt(N);resS=fmt(res)}
   else{const z0=rint(1,2);let m,K;k=rint(1,2);do{m=non10(101,999);K=Math.round(m/10**(3-k))}while(K>=10**k);str=dfmt(m/10**(z0+3),z0+3);res=K/10**(z0+k);resS=dfmt(res,z0+k)}
   const chs=[...str],sp=74,W=chs.map(c=>/\d/.test(c)?sp:34),XS=[],nz=88;{let x=400-W.reduce((u,v)=>u+v,0)/2;W.forEach(w=>{XS.push(x+w/2);x+=w})}
   const idx=chs.map((c,i)=>/\d/.test(c)?i:-1).filter(i=>i>=0),f=idx.findIndex(i=>chs[i]!=="0"),kept=idx.slice(f,f+k),nx=idx[f+k],dn=+chs[nx],up=dn>=5;
   const l=XS[kept[0]]-sp/2,r=XS[kept[k-1]]+sp/2,cx=(l+r)/2,fin=`${str} ≈ ${resS}`,sol=[];
   if(isDec){const zl=XS[0]-sp/2+6,zr=XS[idx[f-1]]+sp/2-6;sol.push(A.p(R.line(zl,236,zr,236,.3),"#9aa8c4",4),txe(L(t3("räknas inte","don't count","لا تُحسب")),(zl+zr)/2,280,26,"#7d8aa5"))}
   sol.push(A.loop(cx,182,(r-l)/2-2,54,"g"),txe(L(KEEP(k)),cx,112,28,"g"));const ax=XS[nx];
   sol.push(mark(A.arrow(ax,338,ax,240,up?"r":"b"),"ans"),txe(L(UPDN(dn,up)),ax,374,28,up?"r":"b"),hlc(400,mxw(fin,48),458,48),...mx(fin,400,458,48,"g"));
   const ttl=k===1?t3("Avrunda till 1 värdesiffra","Round to 1 significant figure","قرّب إلى رقم معنوي واحد"):t3("Avrunda till 2 värdesiffror","Round to 2 significant figures","قرّب إلى رقمين معنويين");
   return{kind:"num",dec:isDec,ans:res,show:resS,q:[A.wipe(),A.tx(L(ttl),400,66,38,"b"),...chs.map((c,i)=>A.tx(c,XS[i],210,nz,"k"))],sol}}
  const r1=n=>{const p=10**(String(n).length-1);return Math.round(n/p)*p};
  if(Math.random()<.5){let a,b;do{a=non10(11,99);b=Math.random()<.5?non10(11,99):non10(101,999)}while(r1(a)===a||r1(b)===b);const ra=r1(a),rb=r1(b),ans=ra*rb,f=`= ${fmt(ans)}`;
   return{kind:"num",ans,show:fmt(ans),q:[A.wipe(),A.tx(L(t3("Gör ett överslag","Make an estimate","قدّر الناتج")),400,66,40,"b"),A.tx(L(t3("Avrunda båda talen till en värdesiffra.","Round both numbers to one significant figure.","قرّب العددين إلى رقم معنوي واحد.")),400,124,30),
     ...mx(`${fmt(a)} ${M} ${fmt(b)} ≈ ?`,400,246,80)],
    sol:[...mx(`≈ ${fmt(ra)} ${M} ${fmt(rb)}`,400,346,50,"o"),mark(hlc(400,mxw(f,54),452,54),"ans"),...mx(f,400,452,54,"g")]}}
  const n=rint(3,9),p=non10(101,999),rp=r1(p),est=n*rp,f=`= ${fmt(est)} kr`,o3=[est/10,est,est*10],sh=shuffle([0,1,2]);
  const w=58,gap=14,x0=400-(n*(w+gap)-gap)/2;
  return{kind:"choice",opts:sh.map(i=>`${fmt(o3[i])} kr`),ans:sh.indexOf(1),show:`${fmt(est)} kr`,
   q:[A.wipe(),A.tx(L(t3("Gör ett överslag","Make an estimate","قدّر الناتج")),400,66,40,"b"),A.tx(L(t3(`${n} konsertbiljetter à ${p} kr`,`${n} concert tickets at ${p} kr each`,`${n} تذاكر حفلة، سعر الواحدة ${p} كرونة`)),400,150,38),
    A.tx(L(t3("Ungefär hur mycket kostar de?","About how much do they cost?","كم تكلّف تقريبًا؟")),400,206,34),A.p([...Array(n)].map((_,i)=>tkt(x0+i*(w+gap),262)).join(""),"o",3.5)],
   sol:[...mx(`${n} ${M} ${p} ≈ ${n} ${M} ${rp}`,400,376,46,"o"),mark(hlc(400,mxw(f,52),456,52),"ans"),...mx(f,400,456,52,"g")]}}
});

/* ---------------- simpler explanations and hints ---------------- */
Object.assign(HELPX,{
 int7:[{say:t3("Tänk på skulder. Tre skulder på 5 kr är 3 · (−5) = −15 kr. Om någon stryker de tre skulderna, (−3) · (−5), blir du 15 kr rikare: +15.",
   "Think of debts. Three debts of 5 kr are 3 × (−5) = −15 kr. If someone cancels the three debts, (−3) × (−5), you become 15 kr richer: +15.",
   `فكّر في الديون. ثلاثة ديون قيمة كل منها 5 كرونات تساوي ${LRI("3 × (−5) = −15")} كرونة. وإذا ألغى أحدٌ الديون الثلاثة، ${LRI("(−3) × (−5)")}، تصبح أغنى بـ 15 كرونة: ${LRI("+15")}.`),
  draw:()=>{const M=MUL(),X=[205,405,605],f2=`(−3) ${M} (−5) = +15`;
   return[A.p(X.map(x=>R.rect(x-80,56,160,104,.3)).join(""),"r",4),...X.map(x=>txe(L(t3("skuld","debt","دَين")),x,96,30,"k")),...X.map(x=>qt("−5 kr",x,142,40,"r")),
    ...mx(`3 ${M} (−5) = −15`,400,232,44,"r"),A.p(X.map(x=>R.line(x-92,48,x+92,168,.3)+R.line(x+92,48,x-92,168,.3)).join(""),"g",3),
    hlc(400,mxw(f2,50),330,50),...mx(f2,400,330,50,"g"),A.tx(L(t3("Skulden försvinner, så du får mer.","The debt disappears, so you have more.","يختفي الدَّين، فيصبح معك أكثر.")),400,430,32,"b")]}},
  {say:t3("Kom ihåg: lika tecken ger plus, olika tecken ger minus. Det gäller både gånger och delat.",
   "Remember: same signs give plus, different signs give minus. This works for both times and divide.",
   "تذكّر: الإشارتان المتماثلتان تعطيان موجبًا، والمختلفتان تعطيان سالبًا. وهذا صحيح في الضرب والقسمة."),
  draw:()=>{const D=DIVS(),o=[],sg=(x,y,s,c)=>[A.p(R.circ(x,y,27),c,3.5),txe(s,x,y+15,46,c)];
   [[210,"g",[["+","+"],["−","−"]],"+",SAME2],[590,"r",[["+","−"],["−","+"]],"−",DIFF2]].forEach(([cx,c,P,res,lab])=>{o.push(A.band(cx-170,50,340,320,c),A.tx(L(lab),cx,96,30,c));
    P.forEach(([a,b],j)=>{const y=180+j*100;o.push(...sg(cx-120,y,a,"k"),...sg(cx-50,y,b,"k"),A.arrow(cx-8,y,cx+40,y,c),...sg(cx+90,y,res,c))})});
   o.push(...mx(`(−6) ${D} (−2) = 3`,210,450,40,"g"),...mx(`(−6) ${D} 2 = −3`,590,450,40,"r"));return o}}],
 pow7:[{say:t3("Vik ett papper på mitten: 2 lager. Vik igen: 4 lager, sedan 8 och 16. Efter 5 vikningar är det 2⁵ = 32 lager.",
   "Fold a sheet of paper in half: 2 layers. Fold again: 4 layers, then 8 and 16. After 5 folds there are 2⁵ = 32 layers.",
   `اطوِ ورقة من المنتصف فتصبح طبقتين. اطوِها مرة أخرى فتصبح 4 طبقات، ثم 8 ثم 16. بعد 5 طيّات تصبح ${LRI("2⁵ = 32")} طبقة.`),
  draw:()=>{const o=[A.tx(L(t3("Vik papperet på mitten","Fold the paper in half","اطوِ الورقة من المنتصف")),400,62,38,"b")],C=["b","o","g","r","b"];
   for(let k=1;k<=5;k++){const cx=110+(k-1)*145,n=2**k,w=120/Math.pow(1.22,k-1),gap=Math.min(12,150/n);let d="";for(let i=0;i<n;i++)d+=R.line(cx-w/2,320-i*gap,cx+w/2,320-i*gap,.2);
    o.push(A.p(d,C[k-1],k>3?2.5:3.5),qt(n,cx,372,34,C[k-1]),...mx(`2^${k}`,cx,428,38,"k"));if(k<5)o.push(A.arrow(cx+56,250,cx+88,250,"k"))}
   o.push(A.hl(630,338,120,110));return o}}],
 sci7:[{say:t3("Tiopotensen talar om hur många steg decimaltecknet ska flytta. 3,5 · 10⁶: flytta 6 steg åt höger och fyll på med nollor. Det blir 3 500 000.",
   "The power of ten tells you how many steps the decimal point moves. 3.5 × 10⁶: move 6 steps to the right and fill in zeros. You get 3,500,000.",
   `قوة العشرة تبيّن كم خطوة تتحرك الفاصلة العشرية. في ${LRI("3.5 × 10⁶")} نحرّكها 6 خطوات إلى اليمين ونملأ بالأصفار، فنحصل على ${LRI("3500000")}.`),
  draw:()=>{const Dr=drow([..."3500000"],280,72,70,["k","k","o","o","o","o","o"]),f=`${dfmt(3.5,1)} ${MUL()} 10^6 = ${fmt(3500000)}`;
   return[...mx(`${dfmt(3.5,1)} ${MUL()} 10^6`,400,110,66),...Dr.o,sepAt(Dr.B(1),288,72,"#9aa8c4"),...hops(Dr.B,1,7,212,true),hlc(400,mxw(f,48),440,48),...mx(f,400,440,48,"g")]}},
  {say:t3("Några tiopotenser har egna namn: tusen är 10³, en miljon är 10⁶ och en miljard är 10⁹. Jorden har ungefär 8 miljarder invånare, alltså 8 · 10⁹.",
   "Some powers of ten have their own names: a thousand is 10³, a million is 10⁶ and a billion is 10⁹. The Earth has about 8 billion people, that is 8 × 10⁹.",
   `لبعض قوى العشرة أسماء خاصة: الألف ${LRI("10³")}، والمليون ${LRI("10⁶")}، والمليار ${LRI("10⁹")}. يعيش على الأرض نحو 8 مليارات إنسان، أي ${LRI("8 × 10⁹")}.`),
  draw:()=>{const rows=[[t3("tusen","thousand","ألف"),3],[t3("miljon","million","مليون"),6],[t3("miljard","billion","مليار"),9]],Y=[110,195,280],o=[];
   rows.forEach(([nm,e],i)=>o.push(txe(L(nm),150,Y[i],38,"b"),qt(fmt(10**e),410,Y[i],38),...mx(`10^${e}`,660,Y[i],48,"k","middle","o")));
   o.push(A.tx(L(t3("Jordens befolkning ≈ 8 miljarder","World population ≈ 8 billion","سكان العالم ≈ 8 مليارات")),400,372,32,"b"),hlc(400,mxw(`8 ${MUL()} 10^9`,52),446,52),...mx(`8 ${MUL()} 10^9`,400,446,52,"g"));return o}}],
 round7:[{say:t3("På kvittot står 49,90 kr, 19,90 kr och 29,90 kr. Avrunda till jämna tior: 50 + 20 + 30 = 100. Du behöver ungefär 100 kr.",
   "The receipt shows 49.90 kr, 19.90 kr and 29.90 kr. Round to whole tens: 50 + 20 + 30 = 100. You need about 100 kr.",
   `في الإيصال ${LRI("49.90")} و${LRI("19.90")} و${LRI("29.90")} كرونة. نقرّب إلى أقرب عشرة: ${LRI("50 + 20 + 30 = 100")}. تحتاج إلى نحو 100 كرونة.`),
  draw:()=>{const it=L(t3(["chips","läsk","glass"],["crisps","soda","ice cream"],["رقائق","مشروب","مثلّجات"])),pr=[49.9,19.9,29.9],rd=[50,20,30],Y=[140,210,280];let zz="";for(let i=0;i<=12;i++)zz+=`L${90+i*20},${i%2?378:364}`;
   return[A.p(`M330,364L330,70L90,70L90,364`+zz.slice(1).replace(/^/,"L"),"k",3.5),...it.map((s,i)=>txe(s,110,Y[i],28,"k","lead")),...pr.map((p,i)=>txe(`${dfmt(p,2)} kr`,312,Y[i],28,"k","end")),
    ...Y.map((y,i)=>A.arrow(346,y-10,404,y-10,"o")),...rd.map((r,i)=>qt(`≈ ${r}`,470,Y[i],38,"o")),
    hlc(590,mxw("50 + 20 + 30 = 100",40),352,40),...mx("50 + 20 + 30 = 100",590,352,40,"g"),A.tx(L(t3("Du behöver ungefär 100 kr.","You need about 100 kr.","تحتاج إلى نحو 100 كرونة.")),400,452,34,"b")]}},
  {say:t3("Värdesiffror räknar du från vänster, med början vid första siffran som inte är noll. I 3 857 är 3 och 8 de två första värdesiffrorna. Nästa siffra är 5, så det blir 3 900.",
   "Count significant figures from the left, starting at the first digit that is not zero. In 3,857 the first two significant figures are 3 and 8. The next digit is 5, so it becomes 3,900.",
   `نعدّ الأرقام المعنوية من اليسار بدءًا من أول رقم ليس صفرًا. في ${LRI("3857")} أول رقمين معنويين هما 3 و8. الرقم التالي 5، لذلك يصبح العدد ${LRI("3900")}.`),
  draw:()=>{const X=i=>280+i*80,f=`${fmt(3857)} ≈ ${fmt(3900)}`;
   return[...[..."3857"].map((d,i)=>A.tx(d,X(i),220,96,i<2?"g":"k")),...[0,1].flatMap(i=>[A.p(R.circ(X(i),88,20),"g",3),qt(i+1,X(i),97,26,"g")]),A.loop(320,186,78,60,"g"),
    A.arrow(X(2),340,X(2),240,"r"),txe(L(UPDN(5,true)),X(2)+12,376,28,"r","lead"),hlc(400,mxw(f,52),456,52),...mx(f,400,456,52,"g")]}}]
});
Object.assign(HINTSX,{
 int7:[{say:t3("Bestäm tecknet först: lika tecken ger plus, olika tecken ger minus. Räkna sedan utan tecken.","Decide the sign first: same signs give plus, different signs give minus. Then calculate without the signs.","حدّد الإشارة أولًا: الإشارتان المتماثلتان تعطيان موجبًا والمختلفتان سالبًا. ثم احسب دون الإشارات."),cut:upTo("ans")},
  {say:t3("Division följer samma teckenregler som multiplikation. Bestäm tecknet först.","Division follows the same sign rules as multiplication. Decide the sign first.","القسمة تتبع قواعد الإشارات نفسها في الضرب. حدّد الإشارة أولًا."),cut:upTo("ans")},
  {say:t3("Räkna två faktorer i taget, eller varje multiplikation för sig. Håll koll på tecknen.","Work with two factors at a time, or each multiplication on its own. Keep track of the signs.","احسب عاملين في كل مرة، أو كل عملية ضرب وحدها، وانتبه إلى الإشارات."),cut:upTo("ans")}],
 pow7:[{say:t3("Exponenten säger hur många gånger basen ska multipliceras med sig själv.","The exponent tells you how many times to multiply the base by itself.","الأس يبيّن كم مرة نضرب الأساس في نفسه."),cut:upTo("ans")},
  {say:t3("För tiopotenser är exponenten lika med antalet nollor efter ettan.","For powers of ten, the exponent equals the number of zeros after the 1.","في قوى العشرة يساوي الأس عدد الأصفار بعد الواحد."),cut:upTo("ans")},
  {say:t3("Räkna parenteser först, sedan potenser, sedan gånger och sist plus. Söker du exponenten: multiplicera basen med sig själv tills du når talet.","Do brackets first, then powers, then times and last plus. Looking for the exponent? Multiply the base by itself until you reach the number.","احسب الأقواس أولًا، ثم القوى، ثم الضرب، وأخيرًا الجمع. وإذا كنت تبحث عن الأس فاضرب الأساس في نفسه حتى تصل إلى العدد."),cut:upTo("ans")}],
 sci7:[{say:t3("Exponenten säger hur många steg decimaltecknet flyttas åt höger. Tomma platser fyller du med nollor.","The exponent tells how many steps the decimal point moves to the right. Fill empty places with zeros.","الأس يبيّن كم خطوة تتحرك الفاصلة العشرية إلى اليمين. املأ الخانات الفارغة بالأصفار."),cut:upTo("ans")},
  {say:t3("Flytta decimaltecknet åt vänster tills det bara står en siffra före det. Räkna stegen.","Move the decimal point to the left until there is only one digit in front of it. Count the steps.","حرّك الفاصلة العشرية إلى اليسار حتى يبقى رقم واحد قبلها، وعُدّ الخطوات."),cut:upTo("ans")},
  {say:t3("Första talet ska vara minst 1 men mindre än 10. Jämför stora tal genom att titta på exponenten först.","The first number must be at least 1 but less than 10. To compare big numbers, look at the exponent first.","يجب أن يكون العدد الأول 1 على الأقل وأصغر من 10. ولمقارنة الأعداد الكبيرة انظر إلى الأس أولًا."),cut:upTo("ans")}],
 round7:[{say:t3("Titta på siffran direkt efter den plats du avrundar till. 0–4: nedåt. 5–9: uppåt.","Look at the digit right after the place you round to. 0–4: round down. 5–9: round up.","انظر إلى الرقم الذي يلي المنزلة التي تقرّب إليها مباشرة. من 0 إلى 4: للأسفل. من 5 إلى 9: للأعلى."),cut:upTo("ans")},
  {say:t3("Börja räkna vid första siffran som inte är 0. Titta sedan på nästa siffra: 5 eller mer betyder uppåt.","Start counting at the first digit that is not 0. Then look at the next digit: 5 or more means round up.","ابدأ العدّ من أول رقم ليس صفرًا، ثم انظر إلى الرقم التالي: 5 أو أكثر يعني للأعلى."),cut:upTo("ans")},
  {say:t3("Avrunda talen till enkla tal med en värdesiffra och räkna med dem.","Round the numbers to easy numbers with one significant figure and calculate with those.","قرّب الأعداد إلى أعداد سهلة برقم معنوي واحد، ثم احسب بها."),cut:upTo("ans")}]
});
}
