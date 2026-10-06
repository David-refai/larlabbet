/* ===== y8a.js ===== */
/* =====================================================================
   YEAR 8 (y8a): laws of exponents, squares and square roots,
   small numbers in scientific notation with prefixes, speed–distance–time.
   Everything is inside one block so helper names cannot clash.
   ===================================================================== */
{
/* ---------- shared helpers ---------- */
const ng=n=>n<0?"−"+(-n):String(n);
const ISO=s=>"⁦"+s+"⁩";                       /* keeps maths in order inside Arabic speech */
const dd=s=>lang==="sv"?String(s).replace(".",","):String(s);   /* exact decimal string in the right notation */
const mark=(a,m)=>Object.assign(a,{m});
const mk1=(m,...a)=>{const o=ex(...a);o[0].m=m;return o};
const upTo=m=>g=>{let k=g.sol.findIndex(a=>a.m===m);if(k<0)k=g.sol.findIndex(a=>a.m==="ans");return k<0?[]:g.sol.slice(0,k)};
const ICO=b=>`<svg viewBox="0 0 320 180"><rect width="320" height="180" fill="#fff"/>${b}</svg>`;
const CV=`font-family="Caveat,cursive" font-weight="700" text-anchor="middle"`;
const ell=(cx,cy,rx,ry)=>{let d="";for(let i=0;i<=72;i++){const t=i/72*Math.PI*2,k=1+jit(i,cx)*.012;d+=(i?"L":"M")+f1(cx+Math.cos(t)*rx*k)+","+f1(cy+Math.sin(t)*ry*k)}return d};
const brace=(x1,x2,y,h=12)=>{const m=(x1+x2)/2;return `M${f1(x1)},${y}Q${f1(x1)},${y+h} ${f1(x1+h)},${y+h}L${f1(m-h)},${y+h}Q${f1(m)},${y+h} ${f1(m)},${y+2*h}Q${f1(m)},${y+h} ${f1(m+h)},${y+h}L${f1(x2-h)},${y+h}Q${f1(x2)},${y+h} ${f1(x2)},${y}`};
/* Caveat 700 advance widths per 100px, for laying out maths with real exponents */
const CWT={"0":45,"1":45,"2":45,"3":45,"4":45,"5":43,"6":47,"7":45,"8":45,"9":44," ":24,",":20,".":20,"·":19,"×":45,"÷":45,"/":33,"=":45,"+":45,"−":45,"-":33,"(":33,")":33,"≈":55,"<":45,">":45,"?":37,"µ":37,":":20,
 a:45,b:44,c:36,d:40,e:33,f:30,g:36,h:46,i:21,k:37,l:18,m:61,n:46,o:36,p:38,r:36,s:35,t:33,u:37,v:33,x:34,y:34,"²":32,"³":32};
const cw=(s,z)=>{let w=0;for(const ch of String(s))w+=CWT[ch]??45;return w*z/100};
/* tiny maths markup: "2^{5}" exponent, "√{49}" square root, "[r|...]" colour */
const toks=(src,c0)=>{const out=[],cs=[c0],st=[];let buf="";
 const fl=()=>{if(buf){out.push({t:"run",s:buf,c:cs[cs.length-1],sup:st.includes("s")});buf=""}};
 for(let i=0;i<src.length;i++){const ch=src[i],nx=src[i+1];
  if(ch==="^"&&nx==="{"){fl();st.push("s");i++;continue}
  if(ch==="√"&&nx==="{"){fl();st.push("r");out.push({t:"ro",c:cs[cs.length-1]});i++;continue}
  if(ch==="}"&&st.length){fl();if(st.pop()==="r")out.push({t:"rc"});continue}
  if(ch==="["&&src[i+2]==="|"&&"kbrgo".includes(nx)){fl();cs.push(nx);i+=2;continue}
  if(ch==="]"&&cs.length>1){fl();cs.pop();continue}
  buf+=ch}
 fl();return out};
const SUPK=.6;
const exW=(src,z)=>{let w=0;for(const k of toks(src,"k"))w+=k.t==="run"?cw(k.s,k.sup?z*SUPK:z):k.t==="ro"?z*.48:z*.1;return w};
function ex(src,x,y,z=48,c="k",anc="middle"){const tk=toks(src,c),W=exW(src,z);let cx=anc==="middle"?x-W/2:anc==="end"?x-W:x;const x0=cx,o=[],rs=[];
 for(const k of tk){
  if(k.t==="ro"){rs.push({x:cx,i:o.length,c:k.c,sup:false});cx+=z*.48;continue}
  if(k.t==="rc"){const r=rs.pop(),H=r.sup?z*1.08:z*.84,xe=cx+z*.04;
   o.splice(r.i,0,A.p(`M${f1(r.x)},${f1(y-z*.3)}L${f1(r.x+z*.1)},${f1(y-z*.36)}L${f1(r.x+z*.24)},${f1(y+z*.05)}L${f1(r.x+z*.4)},${f1(y-H)}L${f1(xe)},${f1(y-H)}`,r.c,Math.max(2.5,z*.07)));cx=xe+z*.06;continue}
  const zz=k.sup?z*SUPK:z,yy=k.sup?y-z*.42:y,s=k.s.trim(),lead=s?k.s.indexOf(s[0]):k.s.length;
  if(k.sup)rs.forEach(r=>r.sup=true);
  cx+=cw(k.s.slice(0,lead),zz);
  if(s)o.push(Object.assign(A.tx(s,cx,yy,zz,k.c,"start"),{dur:Math.max(220,s.length*100)}));
  cx+=cw(k.s.slice(lead),zz)}
 o.w=W;o.x0=x0;return o}
const hlEx=(src,x,y,z,c="g")=>{const e=ex(src,x,y,z,c);return[A.hl(e.x0-18,y-z*.95,e.w+36,z*1.25),...e]};
const ansEx=(src,x,y,z)=>{const o=hlEx(src,x,y,z);o[0].m="ans";return o};
const sup=s=>String(s).replace(/\d/g,c=>"⁰¹²³⁴⁵⁶⁷⁸⁹"[c]);
const exFrac=(n,d,x,y,z=56,c="k")=>{const w=Math.max(exW(n,z),exW(d,z))+z*.3,o=[...ex(n,x,y-z*.2,z,c),A.p(R.line(x-w/2,y,x+w/2,y,.4),c,4),...ex(d,x,y+z*.88,z,c)];o.w=w;return o};
/* a row of pieces {s,c,z,m,hl} laid out left to right, centred on cx */
const rowEx=(items,cx,y,z,gap=z*.3)=>{const ws=items.map(it=>exW(it.s,it.z||z)),tot=ws.reduce((a,b)=>a+b,0)+gap*(items.length-1);let x=cx-tot/2;const o=[],xs=[];
 items.forEach((it,i)=>{const zz=it.z||z,part=[];if(it.hl)part.push(A.hl(x-16,y-zz*.95,ws[i]+32,zz*1.25));part.push(...ex(it.s,x,y,zz,it.c||"k","start"));if(it.m)part[0].m=it.m;o.push(...part);xs.push([x,x+ws[i]]);x+=ws[i]+gap});
 return{o,xs}};
const T=(sv,en,ar)=>L(t3(sv,en,ar));
/* Arabic counted nouns */
const arH=n=>n===1?"ساعة واحدة":n===2?"ساعتين":n<=10?`${n} ساعات`:`${n} ساعة`;
const arMin=n=>n===1?"دقيقة واحدة":n===2?"دقيقتين":n<=10?`${n} دقائق`:`${n} دقيقة`;

/* ---------------------------------------------------------------
   1. pow8: laws of exponents
   --------------------------------------------------------------- */
const facs=(b,k)=>Array(k).fill(b).join(` ${MUL()} `);
/* b^m over b^n written out as factors, n pairs crossed out */
const cancelFrac=(b,m,n,cx,yl,z,sp)=>{const X=i=>cx-(m-1)*sp/2+i*sp,o=[],yn=yl-z*.28,yd=yl+z*.9,M=MUL();
 for(let i=0;i<m;i++){o.push(A.tx(b,X(i),yn,z));if(i<m-1)o.push(A.tx(M,X(i)+sp/2,yn,z*.8))}
 o.push(A.p(R.line(X(0)-sp*.5,yl,X(m-1)+sp*.5,yl,.4),"k",4));
 for(let i=0;i<n;i++){o.push(A.tx(b,X(i),yd,z));if(i<n-1)o.push(A.tx(M,X(i)+sp/2,yd,z*.8))}
 let st="";for(let i=0;i<n;i++)st+=R.line(X(i)-z*.32,yn+z*.08,X(i)+z*.32,yn-z*.75,.2)+R.line(X(i)-z*.32,yd+z*.08,X(i)+z*.32,yd-z*.75,.2);
 o.push(A.p(st,"r",4));
 if(m>n)o.push(A.loop((X(n)+X(m-1))/2,yn-z*.3,(m-n-1)*sp/2+z*.55,z*.55,"g"));
 return o};
const P8={steps:[
 {say:t3("Ett klipp sprids på nätet. I varje omgång delar alla det med 2 nya personer. Efter 5 omgångar har 2 · 2 · 2 · 2 · 2 = 32 personer fått det.",
   "A clip spreads online. In each round, everyone shares it with 2 new people. After 5 rounds, 2 × 2 × 2 × 2 × 2 = 32 people have got it.",
   `ينتشر مقطع فيديو على الإنترنت. في كل جولة يرسله كل شخص إلى شخصين جديدين. بعد 5 جولات يصل إلى ${ISO("2 × 2 × 2 × 2 × 2 = 32")} شخصًا.`),
  draw:()=>{const M=MUL(),Y=k=>50+k*65,X=(k,j)=>{const n=2**k,sp=n>1?Math.min(56,470/(n-1)):0;return 505+(j-(n-1)/2)*sp};
   let ln="";for(let k=1;k<=5;k++)for(let j=0;j<2**k;j++)ln+=`M${f1(X(k-1,j>>1))},${Y(k-1)+8}L${f1(X(k,j))},${Y(k)-8}`;
   const o=[A.wipe(),A.p(dots([[505,Y(0)]]),"o",18),A.p(ln,"#9aa8c4",2)];
   for(let k=1;k<=5;k++)o.push(A.p(dots(Array.from({length:2**k},(_,j)=>[X(k,j),Y(k)])),k===5?"g":"b",k===5?11:15),...ex(`2^{${k}} = ${2**k}`,115,Y(k)+12,36,k===5?"g":"k"));
   o.push(...ex(`2 ${M} 2 ${M} 2 ${M} 2 ${M} 2 = 2^{5} = 32`,400,462,44));return o}},
 {say:t3("Vi skriver det kort som 2⁵, en potens. 2 är basen och 5 är exponenten. Exponenten säger hur många gånger basen multipliceras.",
   "We write it briefly as 2⁵, a power. 2 is the base and 5 is the exponent. The exponent tells you how many times the base is multiplied.",
   `نكتب ذلك باختصار ${ISO("2⁵")}، وهذه قوة. العدد 2 هو الأساس والعدد 5 هو الأس. يبيّن الأس عدد مرات ضرب الأساس في نفسه.`),
  draw:()=>{const M=MUL(),f=rowEx([{s:"="},{s:`2 ${M} 2 ${M} 2 ${M} 2 ${M} 2`}],560,210,50),[x1,x2]=f.xs[1];
   return[A.wipe(),...ex("[b|2]^{[r|5]}",190,280,150),A.tx(T("bas","base","الأساس"),110,430,40,"b"),A.arrow(122,395,160,302,"b",-14),
    A.tx(T("exponent","exponent","الأس"),330,92,40,"r"),A.arrow(300,108,258,150,"r",14),
    ...f.o,A.p(brace(x1,x2,236),"r",3),A.tx(T("5 faktorer","5 factors","5 عوامل"),(x1+x2)/2,300,32,"r"),
    ...hlEx("= 32",560,405,64)]}},
 {say:t3("Hur blir 2³ · 2⁴? Skriv ut faktorerna: tre tvåor gånger fyra tvåor är sju tvåor. Vid multiplikation adderar vi exponenterna: 2⁷.",
   "What is 2³ × 2⁴? Write out the factors: three twos times four twos is seven twos. When we multiply, we add the exponents: 2⁷.",
   `كم يساوي ${ISO("2³ × 2⁴")}؟ نكتب العوامل: ثلاثة أعداد 2 في أربعة أعداد 2 تساوي سبعة أعداد 2. عند الضرب نجمع الأسس: ${ISO("2⁷")}.`),
  draw:()=>{const M=MUL(),r=rowEx([{s:"="},{s:`(${facs(2,3)})`,c:"b"},{s:M},{s:`(${facs(2,4)})`,c:"r"}],400,205,46),[a1,a2]=r.xs[1],[b1,b2]=r.xs[3];
   return[A.wipe(),...ex(`2^{[b|3]} ${M} 2^{[r|4]}`,400,92,66),...r.o,A.p(brace(a1+10,a2-10,226),"b",3),A.tx("3",(a1+a2)/2,286,34,"b"),A.p(brace(b1+10,b2-10,226),"r",3),A.tx("4",(b1+b2)/2,286,34,"r"),
    ...ex(`= 2^{[b|3]+[r|4]} = [g|2^{7}]`,400,365,54),...hlEx(`a^{m} ${M} a^{n} = a^{m+n}`,400,458,44)]}},
 {say:t3("5⁶ delat med 5⁴: fyra femmor i nämnaren tar ut fyra femmor i täljaren. Kvar blir två, alltså 5². Vid division subtraherar vi exponenterna.",
   "5⁶ divided by 5⁴: four fives in the denominator cancel four fives in the numerator. Two are left, so 5². When we divide, we subtract the exponents.",
   `${ISO("5⁶")} مقسومًا على ${ISO("5⁴")}: أربعة أعداد 5 في المقام تختصر أربعة في البسط، فيبقى اثنان، أي ${ISO("5²")}. عند القسمة نطرح الأسس.`),
  draw:()=>{const D=DIVS();return[A.wipe(),...exFrac("5^{6}","5^{4}",120,215,58),A.tx("=",215,232,52),...cancelFrac(5,6,4,450,215,50,62),
   ...ex("= [g|5^{2}]",720,232,56),...ex("5^{6−4} = 5^{2} = 25",400,365,50),...hlEx(`a^{m} ${D} a^{n} = a^{m−n}`,400,458,44)]}},
 {say:t3("(3²)⁴ betyder 3² fyra gånger: 3² · 3² · 3² · 3². Det blir 3 upphöjt till 2 + 2 + 2 + 2 = 8. Potens av en potens: multiplicera exponenterna.",
   "(3²)⁴ means 3² four times: 3² × 3² × 3² × 3². That is 3 to the power 2 + 2 + 2 + 2 = 8. A power of a power: multiply the exponents.",
   `${ISO("(3²)⁴")} تعني ${ISO("3²")} أربع مرات: ${ISO("3² × 3² × 3² × 3²")}. والناتج 3 مرفوعًا إلى ${ISO("2 + 2 + 2 + 2 = 8")}. قوة القوة: نضرب الأسس.`),
  draw:()=>{const M=MUL(),it=[{s:"="}];for(let i=0;i<4;i++){if(i)it.push({s:M});it.push({s:"3^{[b|2]}"})}const r=rowEx(it,400,205,54,46);
   const lp=[1,3,5,7].map((j,i)=>{const [a,b]=r.xs[j];return[A.loop((a+b)/2,188,38,42,"r"),qt(i+1,(a+b)/2,268,26,"r")]}).flat();
   return[A.wipe(),...ex(`(3^{[b|2]})^{[r|4]}`,400,95,66),...r.o,...lp,...ex(`= 3^{[b|2]+[b|2]+[b|2]+[b|2]} = 3^{[b|2] ${M} [r|4]} = [g|3^{8}]`,400,350,48),
    ...hlEx(`(a^{m})^{n} = a^{m ${M} n}`,400,458,44)]}},
 {say:t3("Vad är 2⁰? Varje steg nedåt i trappan delar vi med 2: 8, 4, 2 och till sist 1. Och 7⁴ / 7⁴ = 1. Alla tal utom 0 upphöjt till 0 blir 1.",
   "What is 2⁰? Each step down the stairs we divide by 2: 8, 4, 2 and finally 1. And 7⁴ ÷ 7⁴ = 1. Any number except 0 to the power 0 is 1.",
   `كم يساوي ${ISO("2⁰")}؟ في كل درجة إلى الأسفل نقسم على 2: 8 ثم 4 ثم 2 وأخيرًا 1. كذلك ${ISO("7⁴ ÷ 7⁴ = 1")}. أي عدد غير الصفر مرفوعًا إلى 0 يساوي 1.`),
  draw:()=>{const D=DIVS(),Y=i=>120+i*85,o=[A.wipe()];
   [3,2,1,0].forEach((e,i)=>o.push(...ex(`2^{${e}} = ${2**e}`,200,Y(i),52,e?"k":"g")));
   for(let i=0;i<3;i++)o.push(A.arrow(305,Y(i)-14,305,Y(i+1)-34,"o",-18),qt(`${D} 2`,350,Y(i)+38,28,"o"));
   o.push(A.p(R.line(420,80,420,420,.3),"#9aa8c4",2.5),...ex(`7^{4} ${D} 7^{4} = 1`,600,150,46),...ex(`7^{4−4} = 7^{0}`,600,240,46),...hlEx("a^{0} = 1",600,370,60));return o}}
]};
LESSONS.push({id:"pow8",subject:"math",grades:"8",kind:"wb",
 title:t3("Potenslagar","Laws of exponents","قوانين الأسس"),
 icon:ICO(`<text x="78" y="112" ${CV} font-size="84" fill="#1d2433">a</text><text x="110" y="70" ${CV} font-size="46" fill="#2257c9">5</text><text x="140" y="104" ${CV} font-size="50" fill="#1d2433">·</text><text x="178" y="112" ${CV} font-size="84" fill="#1d2433">a</text><text x="210" y="70" ${CV} font-size="46" fill="#d63b2f">3</text>
  <rect x="96" y="128" width="128" height="40" rx="8" fill="#ffd84d" fill-opacity=".45"/><text x="146" y="160" ${CV} font-size="38" fill="#1e9e5a">= a</text><text x="186" y="142" ${CV} font-size="26" fill="#1e9e5a">8</text>`),
 steps:P8.steps,mount:wbMount(P8),
 gen(level){const M=MUL(),D=DIVS(),title=A.tx(T("Skriv som en enda potens","Write as a single power","اكتب في صورة قوة واحدة"),400,80,40);
  if(level===0){const b=pick([2,3,5,7,10,"x","a"]),mul=Math.random()<.5;let m,n;
   if(mul){m=rint(2,6);n=rint(2,6)}else{m=rint(5,11);n=rint(2,m-2)}
   const e=mul?m+n:m-n,big=String(b).length>1,sol=[];
   if(mul&&m+n<=(big?6:8)){const r=rowEx([{s:`(${facs(b,m)})`,c:"b"},{s:M},{s:`(${facs(b,n)})`,c:"r"}],400,330,40),[a1,a2]=r.xs[0],[b1,b2]=r.xs[2];
    sol.push(...r.o,A.p(brace(a1+8,a2-8,346,9),"b",3),qt(m,(a1+a2)/2,392,26,"b"),A.p(brace(b1+8,b2-8,346,9),"r",3),qt(n,(b1+b2)/2,392,26,"r"))}
   if(!mul&&m<=(big?7:8))sol.push(...cancelFrac(b,m,n,400,335,36,big?62:46));
   sol.push(...rowEx([{s:`= ${b}^{${m}${mul?"+":"−"}${n}}`},{s:`= ${b}^{${e}}`,c:"g",hl:true,m:"ans"}],400,462,48).o);
   return{kind:"num",ans:e,show:`${b}${sup(e)}`,
    q:[A.wipe(),title,...ex(`${b}^{${m}} ${mul?M:D} ${b}^{${n}} = ${b}^{[r|?]}`,400,230,72)],sol}}
  if(level===1){const b=pick([2,3,5,10,"x","a","y"]);
   if(Math.random()<.5){const m=rint(2,6),n=rint(2,4),e=m*n,sol=[];
    {const it=[{s:"="}];for(let i=0;i<n;i++){if(i)it.push({s:M});it.push({s:`${b}^{${m}}`})}const r=rowEx(it,400,340,44,40);
     for(let i=0;i<n;i++){const [a,c]=r.xs[1+2*i];sol.push(A.loop((a+c)/2,326,Math.max(30,(c-a)/2+10),34,"r"))}sol.unshift(...r.o)}
    sol.push(...rowEx([{s:`= ${b}^{${m} ${M} ${n}}`},{s:`= ${b}^{${e}}`,c:"g",hl:true,m:"ans"}],400,462,48).o);
    return{kind:"num",ans:e,show:`${b}${sup(e)}`,q:[A.wipe(),title,...ex(`(${b}^{${m}})^{${n}} = ${b}^{[r|?]}`,400,230,72)],sol}}
   let m,n,k;do{m=rint(2,7);n=rint(2,7);k=rint(2,m+n-1)}while(k===m||k===n);const e=m+n-k;
   const F=exFrac(`${b}^{${m}} ${M} ${b}^{${n}}`,`${b}^{${k}}`,0,0,60),qw=F.w+30+exW(`= ${b}^{?}`,60),fx=400-qw/2+F.w/2;
   return{kind:"num",ans:e,show:`${b}${sup(e)}`,q:[A.wipe(),title,...exFrac(`${b}^{${m}} ${M} ${b}^{${n}}`,`${b}^{${k}}`,fx,235,60),...ex(`= ${b}^{[r|?]}`,fx+F.w/2+30,252,60,"k","start")],
    sol:rowEx([{s:`= ${b}^{${m}+${n}}`},{s:`= ${b}^{${m}+${n}−${k}}`},{s:`= ${b}^{${e}}`,c:"g",hl:true,m:"ans"}],400,430,48).o}}
  /* level 2: the value of an expression */
  const b=pick([2,2,3,5,10]),mx={2:8,3:5,5:4,10:3}[b];const e=Math.random()<.25?0:rint(1,mx),v=b**e;let num,den,step;
  if(Math.random()<.55){let m,n,k;do{m=rint(2,6);n=rint(2,6);k=m+n-e}while(k<2||k===m||k===n);num=`${b}^{${m}} ${M} ${b}^{${n}}`;den=`${b}^{${k}}`;step=`${m}+${n}−${k}`}
  else{let m,n,k;do{m=rint(2,4);n=rint(2,3);k=m*n-e}while(k<2);num=`(${b}^{${m}})^{${n}}`;den=`${b}^{${k}}`;step=`${m} ${M} ${n}−${k}`}
  const F=exFrac(num,den,0,0,60),qw=F.w+30+exW("= ?",60),fx=400-qw/2+F.w/2;
  return{kind:"num",ans:v,show:fmt(v),
   q:[A.wipe(),A.tx(T("Beräkna värdet","Work out the value","احسب القيمة"),400,80,40),...exFrac(num,den,fx,235,60),...ex("= ?",fx+F.w/2+30,252,60,"k","start")],
   sol:rowEx([{s:`= ${b}^{${step}}`},{s:`= ${b}^{${e}}`,m:"e"},{s:`= ${fmt(v)}`,c:"g",hl:true,m:"ans"}],400,430,50).o}}
});

/* ---------------------------------------------------------------
   2. root8: squares and square roots
   --------------------------------------------------------------- */
/* two number lines: squares a..b on top, roots lo..lo+1 below; where does √N land? */
const estLine=(N,yT=160,yB=330)=>{const lo=Math.floor(Math.sqrt(N)),a=lo*lo,b=(lo+1)**2,XL=110,XR=690,Xt=v=>XL+(XR-XL)*(v-a)/(b-a),Xb=XL+(XR-XL)*(Math.sqrt(N)-lo);
 let d=R.line(XL-24,yT,XR+24,yT,.3);for(let v=a;v<=b;v++){const big=v===a||v===b;d+=`M${f1(Xt(v))},${yT-(big?16:8)}v${big?32:16}`}
 let e=R.line(XL-24,yB,XR+24,yB,.3);for(let i=0;i<=10;i++)e+=`M${f1(XL+(XR-XL)*i/10)},${yB-(i%10?8:16)}v${i%10?16:32}`;
 return[A.p(d,"k",3.5),qt(a,XL,yT-28,30),qt(b,XR,yT-28,30),mark(A.p(dots([[Xt(N),yT]]),"r",16),"cut"),qt(N,Xt(N),yT+46,30,"r"),
  A.p(e,"k",3.5),qt(lo,XL,yB+50,30),qt(lo+1,XR,yB+50,30),A.p(R.dashed(XL,yT+20,XL,yB-20),"#9aa8c4",2.5),A.p(R.dashed(XR,yT+20,XR,yB-20),"#9aa8c4",2.5),
  A.arrow(Xt(N),yT+60,Xb,yB-66,"r"),A.p(dots([[Xb,yB]]),"r",16),...ex(`√{${N}}`,Xb,yB-24,30,"r")]};
const sqBox=(x,y,s,c="b")=>[A.hatch(`M${x},${y}h${s}v${s}h${-s}Z`,c),A.p(R.rect(x,y,s,s,.4),"k",4.5)];
const RT={steps:[
 {say:t3("Ett kvadratiskt rum är 6 m långt och 6 m brett. Golvet är 6 · 6 = 6² = 36 m². Därför kallas 36 ett kvadrattal.",
   "A square room is 6 m long and 6 m wide. The floor is 6 × 6 = 6² = 36 m². That is why 36 is called a square number.",
   `غرفة مربعة طولها 6 م وعرضها 6 م. مساحة أرضيتها ${ISO("6 × 6 = 6² = 36")} م². لذلك يسمّى العدد 36 عددًا مربعًا.`),
  draw:()=>{const M=MUL();return[A.wipe(),...gridRect(110,90,6,6,40,"b"),A.tx("6 m",230,378,34),A.tx("6 m",64,222,34),
   ...ex(`6 ${M} 6 = 6^{2} = 36`,590,170,50),A.tx(T("Arean är 36 m²","The area is 36 m²","المساحة 36 م²"),590,270,40,"b"),
   A.hl(415,330,350,64),A.tx(T("36 är ett kvadrattal","36 is a square number","36 عدد مربع"),590,375,40,"g")]}},
 {say:t3("Nu tvärtom: en kvadratisk terrass har arean 49 m². Hur lång är sidan? Vi söker talet som gånger sig självt blir 49. 7 · 7 = 49, så roten ur 49 är 7.",
   "Now the other way round: a square patio has an area of 49 m². How long is a side? We look for the number that times itself makes 49. 7 × 7 = 49, so the square root of 49 is 7.",
   `والآن بالعكس: شرفة مربعة مساحتها 49 م². كم طول ضلعها؟ نبحث عن العدد الذي إذا ضُرب في نفسه أعطى 49. ${ISO("7 × 7 = 49")}، إذن الجذر التربيعي للعدد 49 هو 7.`),
  draw:()=>{const M=MUL();return[A.wipe(),...sqBox(90,100,230,"o"),A.tx("49 m²",205,232,46),A.tx("?",205,385,48,"r"),A.tx("?",55,232,48,"r"),
   ...ex(`? ${M} ? = 49`,590,140,52),...ex(`7 ${M} 7 = 49`,590,235,52,"b"),...hlEx("√{49} = 7",590,355,64),
   A.tx(T("Sidan är 7 m","The side is 7 m","طول الضلع 7 م"),590,450,36,"g")]}},
 {say:t3("Lär dig kvadrattalen upp till 12² = 144. Kvadrera och dra roten ur är motsatta räknesätt: 7² = 49 och √49 = 7.",
   "Learn the square numbers up to 12² = 144. Squaring and taking the square root are opposite operations: 7² = 49 and √49 = 7.",
   `احفظ الأعداد المربعة حتى ${ISO("12² = 144")}. التربيع والجذر التربيعي عمليتان متعاكستان: ${ISO("7² = 49")} و${ISO("√49 = 7")}.`),
  draw:()=>{const X=i=>106+(i-1)*58,o=[A.wipe(),A.p(R.rect(20,108,762,176,.3)+R.line(20,196,782,196,.3)+R.line(76,108,76,284,.3),"k",3)];
   o.push(...ex("n",48,167,38,"b"),...ex("n^{2}",48,255,36));
   for(let i=1;i<=12;i++)o.push(qt(i,X(i),167,32,"b"),qt(i*i,X(i),255,30));
   o.push(A.loop(X(7),206,25,82,"r"),A.loop(X(12),206,25,82,"g"));
   o.push(...ex("7^{2} = 49",250,365,46,"r"),A.arrow(370,350,450,350,"r",-16),...ex("√{49} = 7",560,365,46,"r"));
   o.push(...ex("12^{2} = 144",250,455,46,"g"),A.arrow(370,440,450,440,"g",-16),...ex("√{144} = 12",560,455,46,"g"));return o}},
 {say:t3("√50 är inget heltal. 50 ligger mellan 49 och 64, så √50 ligger mellan 7 och 8. 50 är nära 49, så √50 är bara lite mer än 7: ungefär 7,1.",
   "√50 is not a whole number. 50 lies between 49 and 64, so √50 lies between 7 and 8. 50 is close to 49, so √50 is just a little more than 7: about 7.1.",
   `${ISO("√50")} ليس عددًا صحيحًا. يقع 50 بين 49 و64، إذن يقع ${ISO("√50")} بين 7 و8. والعدد 50 قريب من 49، إذن ${ISO("√50")} أكبر من 7 بقليل: نحو 7.1.`),
  draw:()=>[A.wipe(),...rowEx([{s:"7^{2} = 49"},{s:"8^{2} = 64"}],400,62,40,160).o,...estLine(50,160,330),...hlEx(`√{50} ≈ ${dd("7.1")}`,400,458,50)]},
 {say:t3("En kvadratisk skatepark har arean 200 m². 14² = 196 och 15² = 225, så sidan är lite mer än 14 m. Räknaren ger √200 ≈ 14,1 m.",
   "A square skatepark has an area of 200 m². 14² = 196 and 15² = 225, so a side is a little more than 14 m. The calculator gives √200 ≈ 14.1 m.",
   `حديقة تزلج مربعة مساحتها 200 م². ${ISO("14² = 196")} و${ISO("15² = 225")}، إذن طول الضلع أكثر من 14 م بقليل. تعطي الآلة الحاسبة ${ISO("√200 ≈ 14.1")} م.`),
  draw:()=>[A.wipe(),...sqBox(80,110,230,"g"),A.p(`M130,272Q130,284 142,284H248Q260,284 260,272`+R.circ(156,296,8)+R.circ(234,296,8),"k",3.5),A.tx("200 m²",195,215,44),
   ...ex("14^{2} = 196",590,120,44),...ex("15^{2} = 225",590,195,44),...ex("14 < √{200} < 15",590,285,44,"b"),...hlEx(`√{200} ≈ ${dd("14.1")}`,590,385,52),
   A.tx(T(`sidan ≈ ${dd("14.1")} m`,`side ≈ 14.1 m`,`الضلع ≈ 14.1 م`),195,395,36,"g")]}
]};
LESSONS.push({id:"root8",subject:"math",grades:"8",kind:"wb",
 title:t3("Kvadrattal och kvadratrötter","Squares and square roots","المربعات والجذور التربيعية"),
 icon:ICO(`<rect x="36" y="34" width="112" height="112" fill="#2257c9" fill-opacity=".1" stroke="#1d2433" stroke-width="3.5"/>${[1,2,3].map(i=>`<path d="M${36+i*28} 34v112M36 ${34+i*28}h112" stroke="#9aa8c4" stroke-width="1.6"/>`).join("")}
  <text x="92" y="168" ${CV} font-size="24" fill="#1d2433">4</text><path d="M176 90l8-4 12 30 16-62h70" fill="none" stroke="#1e9e5a" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><text x="246" y="110" ${CV} font-size="50" fill="#1e9e5a">16</text><text x="236" y="150" ${CV} font-size="38" fill="#1d2433">= 4</text>`),
 steps:RT.steps,mount:wbMount(RT),
 gen(level){const M=MUL();
  if(level===0){
   if(Math.random()<.6){const n=rint(4,15),N=n*n,t=n-1;
    return{kind:"num",ans:n,show:String(n),q:[A.wipe(),A.tx(T("Beräkna","Work out","احسب"),400,80,40),...ex(`√{${N}} = ?`,400,250,90)],
     sol:[...ex(`${t} ${M} ${t} = ${t*t}`,400,355,40,"r"),qt(T("för litet","too small","أصغر من اللازم"),640,355,28,"r"),mark(A.hl(270,410,260,62),"ans"),...ex(`${n} ${M} ${n} = ${N}`,400,455,46,"g")]}}
   const n=rint(11,25),N=n*n,t=n%10,ten=n-t;
   return{kind:"num",ans:N,show:String(N),q:[A.wipe(),A.tx(T("Beräkna","Work out","احسب"),400,80,40),...ex(`${n}^{2} = ?`,400,250,90)],
    sol:[...ex(`${n}^{2} = ${n} ${M} ${n}`,400,340,42),...(t?ex(`= ${n} ${M} ${ten} + ${n} ${M} ${t} = ${n*ten} + ${n*t}`,400,400,38):[]),...rowEx([{s:`= ${N}`,c:"g",hl:true,m:"ans"}],400,462,48).o]}}
  if(level===1){let N;do{N=rint(6,300)}while(Number.isInteger(Math.sqrt(N)));const lo=Math.floor(Math.sqrt(N)),L0=Math.max(2,lo-rint(0,3)),sq=[];
   for(let k=L0;k<L0+5;k++)sq.push({s:`${k}^{2} = ${k*k}`,z:32});
   const r=rowEx(sq,400,320,32,40);
   return{kind:"pair",ans:[lo,lo+1],labels:[t3("mellan","between","بين"),t3("och","and","و")],check:(a,b)=>(a===lo&&b===lo+1)||(a===lo+1&&b===lo),show:T(`${lo} och ${lo+1}`,`${lo} and ${lo+1}`,`${lo} و${lo+1}`),
    q:[A.wipe(),A.tx(T("Mellan vilka två heltal ligger","Between which two whole numbers is","بين أي عددين صحيحين يقع"),400,80,38),...ex(`√{${N}}`,400,230,90)],
    sol:[...r.o,...rowEx([{s:`${lo*lo} < ${N} < ${(lo+1)**2}`,c:"k",m:"ineq"}],400,392,40).o,...ansEx(`${lo} < √{${N}} < ${lo+1}`,400,462,48)]}}
  if(Math.random()<.5){let N,r;do{N=rint(10,300);r=Math.sqrt(N)}while(Number.isInteger(r)||Math.abs(r-Math.floor(r)-.5)<.18);
   const n=Math.round(r);
   return{kind:"num",ans:n,show:String(n),q:[A.wipe(),A.tx(T("Vilket heltal ligger närmast","Which whole number is closest to","ما العدد الصحيح الأقرب إلى"),400,80,38),...ex(`√{${N}}`,400,250,90)],
    sol:[A.wipe(),...ex(`√{${N}} ≈ ?`,400,62,44),...estLine(N,150,320),...ansEx(`√{${N}} ≈ ${n}`,400,455,50)]}}
  const n=rint(6,20),N=n*n;
  return{kind:"num",ans:4*n,show:`${4*n} m`,q:[A.wipe(),A.tx(T(`En kvadratisk tomt har arean ${fmt(N)} m².`,`A square plot has an area of ${fmt(N)} m².`,`قطعة أرض مربعة مساحتها ${N} م².`),400,70,36),
    A.tx(T("Hur långt blir staketet runt hela tomten? (m)","How long is a fence around the whole plot? (m)","كم يبلغ طول السياج حول القطعة كلها؟ (م)"),400,122,32),...sqBox(300,170,170,"g"),A.tx(`${fmt(N)} m²`,385,268,36)],
   sol:[A.tx("x",385,385,36,"r"),...ex(`x = √{${N}}`,640,200,40,"r"),mark(A.tx(`x = ${n} m`,640,270,40,"b"),"cut"),...ansEx(`4 ${M} ${n} = ${4*n}`,640,355,44),A.tx(T(`${4*n} m staket`,`${4*n} m of fence`,`${4*n} م من السياج`),640,410,32,"g")]}}
});

/* ---------------------------------------------------------------
   3. sci8: small numbers in scientific notation, prefixes
   --------------------------------------------------------------- */
/* digits in a row with the comma moving: p = old comma gap, q = new gap, the first `added` digits are new zeros */
const jRow=(dig,p,q,cx,y,z,added=0)=>{const st=z*.72,n=dig.length,x0=cx-(n-1)*st/2,X=i=>x0+i*st,G=k=>x0+(k-.5)*st,o={dig:[],arcs:[],neu:[]};
 [...dig].forEach((d,i)=>o.dig.push(A.tx(d,X(i),y,z,i<added?"o":"k")));
 if(p<n)o.dig.push(A.tx(SEP(),G(p),y,z,added?"#9aa8c4":"k"));
 const dir=q>p?1:-1;for(let k=p,s=1;k!==q;k+=dir,s++)o.arcs.push(A.arrow(G(k)+dir*4,y-z*.86,G(k+dir)-dir*4,y-z*.86,"r",dir>0?-18:18),qt(s,(G(k)+G(k+dir))/2,y-z*.86-26,24,"r"));
 if(p<n&&!added)o.arcs.push(A.p(R.line(G(p)-9,y+z*.14,G(p)+9,y-z*.14,.1),"r",3.5));
 if(q<=n)o.neu.push(A.tx(SEP(),G(q),y,z,"g"));
 return o};
const dec=(mant,e)=>{/* exact decimal string of mant·10^e (e<0), mant like "3.5" */const [i,f=""]=mant.split("."),dg=i+f,z=-e-i.length;return "0."+"0".repeat(z)+dg};
const hair=`M110,78C210,40 290,116 400,78S590,42 690,80`;
const pollen=(x,y,r)=>R.circ(x,y,r)+Array.from({length:12},(_,i)=>{const a=i/12*Math.PI*2;return R.line(x+Math.cos(a)*r,y+Math.sin(a)*r,x+Math.cos(a)*(r+10),y+Math.sin(a)*(r+10),.1)}).join("");
const ant=(x,y)=>ell(x-22,y,11,8)+ell(x,y,9,7)+ell(x+24,y,14,9)+[-8,0,8].map(d=>R.line(x+d,y,x+d-10,y+16,.1)+R.line(x+d,y,x+d+8,y+16,.1)).join("")+R.line(x-30,y-4,x-40,y-16,.1);
const bact=(x,y)=>`M${x-26},${y-12}h52a12,12 0 0 1 0,24h-52a12,12 0 0 1 0,-24Z`+`M${x+38},${y}q10,-10 20,0t20,0`;
const virus=(x,y,r=20)=>R.circ(x,y,r)+Array.from({length:8},(_,i)=>{const a=i/8*Math.PI*2,c=Math.cos(a),s=Math.sin(a);return `M${f1(x+c*r)},${f1(y+s*r)}L${f1(x+c*(r+9))},${f1(y+s*(r+9))}`+R.circ(x+c*(r+12),y+s*(r+12),3)}).join("");
const mosq=(x,y)=>ell(x,y,30,6)+ell(x+36,y-2,8,7)+`M${x-4},${y-4}q-20,-34 -40,-22M${x+6},${y-4}q-4,-36 -26,-34M${x+42},${y}l26,8`+[-14,0,14].map(d=>`M${x+d},${y+4}l-12,26M${x+d},${y+4}l10,26`).join("");
const PFX=[[t3("milli","milli","ملّي"),"m",-3,"r"],[t3("mikro","micro","ميكرو"),"µ",-6,"b"],[t3("nano","nano","نانو"),"n",-9,"g"]];
const SC={steps:[
 {say:t3("Tiopotenser kan också beskriva små tal. Varje steg nedåt delar vi med 10. 10⁰ = 1, 10⁻¹ = 0,1, 10⁻² = 0,01 och 10⁻³ = 0,001.",
   "Powers of ten can also describe small numbers. Each step down we divide by 10. 10⁰ = 1, 10⁻¹ = 0.1, 10⁻² = 0.01 and 10⁻³ = 0.001.",
   `يمكن لقوى العشرة أن تصف الأعداد الصغيرة أيضًا. في كل خطوة إلى الأسفل نقسم على 10: ${ISO("10⁰ = 1")} و${ISO("10⁻¹ = 0.1")} و${ISO("10⁻² = 0.01")} و${ISO("10⁻³ = 0.001")}.`),
  draw:()=>{const D=DIVS(),Y=i=>80+i*62,o=[A.wipe(),A.band(110,Y(4)-50,490,3*62+18,"r")];
   [3,2,1,0,-1,-2,-3].forEach((e,i)=>{const c=e<0?"r":e>0?"b":"k";o.push(...ex(`10^{${ng(e)}}`,250,Y(i),42,c,"end"),A.tx("=",285,Y(i),42,c),A.tx(e>=0?fmt(10**e):dd((10**e).toFixed(-e)),320,Y(i),42,c,"start"))});
   for(let i=0;i<6;i++)o.push(A.arrow(640,Y(i)-14,640,Y(i+1)-28,"o",-16),qt(`${D} 10`,700,Y(i)+14,26,"o"));
   o.push(A.tx(T("mindre än 1","less than 1","أصغر من 1"),525,Y(5)+10,30,"r"));return o}},
 {say:t3("Ett hårstrå är ungefär 0,00008 m tjockt. Flytta kommat 5 steg åt höger, så får du 8. Därför är 0,00008 = 8 · 10⁻⁵. Minus betyder att talet är mindre än 1.",
   "A hair is about 0.00008 m thick. Move the decimal point 5 steps to the right and you get 8. So 0.00008 = 8 × 10⁻⁵. The minus means the number is less than 1.",
   `سُمك الشعرة نحو 0.00008 م. ننقل الفاصلة 5 خطوات إلى اليمين فنحصل على 8. إذن ${ISO("0.00008 = 8 × 10⁻⁵")}. الإشارة السالبة تعني أن العدد أصغر من 1.`),
  draw:()=>{const M=MUL(),J=jRow("000008",1,6,400,300,84);
   return[A.wipe(),A.p(hair,"o",7),A.tx(T(`ett hårstrå ≈ ${dd("0.00008")} m`,"a hair ≈ 0.00008 m","شعرة ≈ 0.00008 م"),400,140,34),...J.dig,...J.arcs,...J.neu,
    ...hlEx(`${dd("0.00008")} m = 8 ${M} 10^{−5} m`,400,445,46)]}},
 {say:t3("Ett pollenkorn är 0,000035 m. Talet framför tiopotensen ska vara minst 1 och mindre än 10. Därför skriver vi 3,5 · 10⁻⁵ m. 35 · 10⁻⁶ har rätt värde men är inte grundpotensform.",
   "A pollen grain is 0.000035 m. The number in front of the power of ten must be at least 1 and less than 10. So we write 3.5 × 10⁻⁵ m. 35 × 10⁻⁶ has the right value but is not scientific notation.",
   `حبة اللقاح طولها 0.000035 م. يجب أن يكون العدد أمام قوة العشرة 1 على الأقل وأصغر من 10. لذلك نكتب ${ISO("3.5 × 10⁻⁵")} م. أما ${ISO("35 × 10⁻⁶")} فقيمته صحيحة لكنه ليس بالصيغة العلمية.`),
  draw:()=>{const M=MUL(),J=jRow("0000035",1,6,400,265,76),w=ex(`35 ${M} 10^{−6} m`,330,452,42,"r");
   return[A.wipe(),A.p(pollen(110,80,26),"o",3.5),A.tx(T(`pollenkorn ≈ ${dd("0.000035")} m`,"pollen grain ≈ 0.000035 m","حبة لقاح ≈ 0.000035 م"),430,92,34),...J.dig,...J.arcs,...J.neu,
    ...ex(`${dd("3.5")} ${M} 10^{−5} m`,330,368,46,"g"),A.p(`M${f1(330+exW(`${dd("3.5")} ${M} 10^{−5} m`,46)/2+24)},350l10,12l22,-28`,"g",4.5),
    ...w,A.p(R.line(w.x0-6,437,w.x0+w.w+6,437,.2),"r",3.5),A.tx("35 > 10",610,452,32,"r")]}},
 {say:t3("Prefix är korta namn på tiopotenser. Milli betyder 10⁻³, mikro 10⁻⁶ och nano 10⁻⁹. En myra är några millimeter, en bakterie några mikrometer och ett virus omkring 100 nanometer.",
   "Prefixes are short names for powers of ten. Milli means 10⁻³, micro 10⁻⁶ and nano 10⁻⁹. An ant is a few millimetres, a bacterium a few micrometres and a virus about 100 nanometres.",
   `البادئات أسماء قصيرة لقوى العشرة: ملّي تعني ${ISO("10⁻³")}، وميكرو ${ISO("10⁻⁶")}، ونانو ${ISO("10⁻⁹")}. طول النملة بضعة مليمترات، والبكتيريا بضعة ميكرومترات، والفيروس نحو 100 نانومتر.`),
  draw:()=>{const Y=[115,245,375],o=[A.wipe(),A.p(R.line(40,180,760,180,.2)+R.line(40,310,760,310,.2),"#9aa8c4",2)];
   const ex2=[T("myra ≈ 3 mm","ant ≈ 3 mm","نملة ≈ 3 mm"),T("bakterie ≈ 2 µm","bacterium ≈ 2 µm","بكتيريا ≈ 2 µm"),T("virus ≈ 100 nm","virus ≈ 100 nm","فيروس ≈ 100 nm")],pic=[ant(520,Y[0]-12),bact(505,Y[1]-12),virus(520,Y[2]-14)];
   PFX.forEach(([nm,sy,e,c],i)=>o.push(A.tx(L(nm),110,Y[i],42,c),...ex(`${sy} = 10^{${ng(e)}}`,310,Y[i],44,c),A.p(pic[i],"k",3),A.tx(ex2[i],660,Y[i]+44,28)));
   return o}},
 {say:t3("En röd blodkropp är ungefär 7 µm bred. µ betyder 10⁻⁶, så 7 µm = 7 · 10⁻⁶ m. Som decimaltal blir det 0,000007 m.",
   "A red blood cell is about 7 µm wide. µ means 10⁻⁶, so 7 µm = 7 × 10⁻⁶ m. As a decimal that is 0.000007 m.",
   `عرض كرية الدم الحمراء نحو 7 ميكرومتر. تعني ميكرو ${ISO("10⁻⁶")}، إذن ${ISO("7 µm = 7 × 10⁻⁶ m")}. وفي صورة عدد عشري: 0.000007 م.`),
  draw:()=>{const M=MUL();return[A.wipe(),A.hatch(ell(170,200,110,70),"r"),A.p(ell(170,200,110,70),"r",4),A.p(ell(170,200,48,28),"r",3),A.tx(T("röd blodkropp","red blood cell","كرية دم حمراء"),170,320,32,"r"),
   ...ex("µ = 10^{−6}",170,420,44,"b"),A.p(R.line(330,60,330,460,.3),"#9aa8c4",2.5),
   ...ex("7 µm",560,120,60,"b"),A.arrow(560,145,560,190,"k"),...ex(`= 7 ${M} 10^{[b|−6]} m`,560,250,52),A.arrow(560,275,560,325,"k"),...hlEx(`= ${dd("0.000007")} m`,560,395,52)]}},
 {say:t3("En mygga väger ungefär 2,5 · 10⁻³ g. Exponenten −3 betyder: flytta kommat 3 steg åt vänster och fyll på med nollor. Det blir 0,0025 g.",
   "A mosquito weighs about 2.5 × 10⁻³ g. The exponent −3 means: move the decimal point 3 steps to the left and fill in zeros. That gives 0.0025 g.",
   `تزن البعوضة نحو ${ISO("2.5 × 10⁻³")} غ. الأس ${ISO("−3")} يعني أن ننقل الفاصلة 3 خطوات إلى اليسار ونضيف أصفارًا. فيكون الناتج 0.0025 غ.`),
  draw:()=>{const M=MUL(),J=jRow("00025",4,1,430,300,84,3);return[A.wipe(),A.p(mosq(110,110),"k",3),...ex(`${dd("2.5")} ${M} 10^{[r|−3]} g`,430,100,56),...J.dig,...J.arcs,...J.neu,...hlEx(`${dd("0.0025")} g`,430,445,56)]}}
]};
LESSONS.push({id:"sci8",subject:"math",grades:"8",kind:"wb",
 title:t3("Små tal och prefix","Small numbers and prefixes","الأعداد الصغيرة والبادئات"),
 icon:ICO(`<circle cx="70" cy="90" r="34" fill="#d63b2f" fill-opacity=".12" stroke="#d63b2f" stroke-width="3.5"/>${Array.from({length:10},(_,i)=>{const a=i/10*Math.PI*2;return`<path d="M${(70+Math.cos(a)*34).toFixed(1)} ${(90+Math.sin(a)*34).toFixed(1)}L${(70+Math.cos(a)*46).toFixed(1)} ${(90+Math.sin(a)*46).toFixed(1)}" stroke="#d63b2f" stroke-width="3" stroke-linecap="round"/>`}).join("")}
  <text x="196" y="88" ${CV} font-size="44" fill="#1d2433">3 · 10</text><text x="262" y="62" ${CV} font-size="28" fill="#d63b2f">−6</text><text x="210" y="148" ${CV} font-size="40" fill="#2257c9">µ  m  n</text>`),
 steps:SC.steps,mount:wbMount(SC),
 gen(level){const M=MUL(),D=DIVS(),mant=()=>Math.random()<.55?String(rint(1,9)):`${rint(1,9)}.${rint(1,9)}`;
  if(level===0){const m=mant(),e=-rint(2,7),s=dec(m,e),dg=s.replace(".",""),q=dg.search(/[1-9]/)+1;
   const J=jRow(dg,1,q,400,240,dg.length>8?70:80);
   return{kind:"num",ans:e,signed:true,show:ng(e),
    q:[A.wipe(),A.tx(T("Skriv i grundpotensform","Write in scientific notation","اكتب بالصيغة العلمية"),400,70,40),...J.dig,...ex(`= ${dd(m)} ${M} 10^{[r|?]}`,400,350,60)],
    sol:[...J.neu,mark(J.arcs[0],"cut"),...J.arcs.slice(1),qt(T(`${-e} steg åt höger`,`${-e} steps to the right`,`${-e} خطوات إلى اليمين`),400,410,28,"r"),...ansEx(`${dd(s)} = ${dd(m)} ${M} 10^{${ng(e)}}`,400,465,40)]}}
  if(level===1){let m,e;do{m=mant();e=-rint(1,5)}while(m.length>1&&e<-4);const s=dec(m,e),dg=s.replace(".",""),hasF=m.includes("."),p=-e+1;
   const J=jRow(dg,p,1,400,330,dg.length>6?66:74,-e);
   return{kind:"num",ans:+s,dec:true,show:dd(s),
    q:[A.wipe(),A.tx(T("Skriv som decimaltal","Write as a decimal number","اكتب في صورة عدد عشري"),400,70,40),...ex(`${dd(m)} ${M} 10^{[r|${ng(e)}]}`,400,175,72)],
    sol:[...J.dig.slice(-e),...J.arcs.slice(0,2),mark(J.dig[0],"cut"),...J.dig.slice(1,-e),...J.arcs.slice(2),...J.neu,...ansEx(`= ${dd(s)}`,400,462,46)]}}
  const ty=rint(0,2);
  if(ty===0){const P=pick(PFX),U=P[1]+"m",j=rint(1,2),n=j===1?rint(11,99):rint(10,99)*10,mt=String(n/10**j),a=j+P[2];
   return{kind:"num",ans:a,signed:true,show:ng(a),
    q:[A.wipe(),A.tx(T("Skriv i grundpotensform","Write in scientific notation","اكتب بالصيغة العلمية"),400,80,40),...ex(`${n} ${U} = ${dd(mt)} ${M} 10^{[r|?]} m`,400,250,64)],
    sol:[...ex(`${n} ${U} = ${n} ${M} 10^{${ng(P[2])}} m`,400,345,42,P[3]),...mk1("cut",`= ${dd(mt)} ${M} 10^{${j}} ${M} 10^{${ng(P[2])}} m`,400,405,42),...ansEx(`= ${dd(mt)} ${M} 10^{${ng(a)}} m`,400,465,44)]}}
  if(ty===1){const v=pick([rint(2,9),rint(11,99),rint(101,950)]),s=(v/1000).toFixed(3);
   return{kind:"num",ans:v,show:`${v} ms`,
    q:[A.wipe(),A.tx(T("En kamera tar en bild på","A camera takes a photo in","تلتقط كاميرا صورة في"),400,80,38),...ex(`${dd(s)} s = ? ms`,400,240,72)],
    sol:[...ex(`1 ms = 10^{−3} s = ${dd("0.001")} s`,400,340,40,"b"),...mk1("cut",`${dd(s)} ${D} ${dd("0.001")} = ${dd(s)} ${M} ${fmt(1000)}`,400,400,38),...ansEx(`${dd(s)} s = ${v} ms`,400,462,44)]}}
  const n=rint(1,19)*500,v=n/1000;
  return{kind:"num",ans:v,dec:true,show:`${dfmt(v,v%1?1:0)} µm`,
   q:[A.wipe(),A.tx(T("En bakterie är","A bacterium is","طول بكتيريا"),400,80,38),...ex(`${fmt(n)} nm = ? µm`,400,240,72)],
   sol:[...ex(`1 µm = ${fmt(1000)} nm`,400,340,42,"b"),...mk1("cut",`${fmt(n)} ${D} ${fmt(1000)}`,400,400,40),...ansEx(`${fmt(n)} nm = ${dfmt(v,v%1?1:0)} µm`,400,462,44)]}}
});

/* ---------------------------------------------------------------
   4. speed8: speed, distance and time
   --------------------------------------------------------------- */
const train=(x,y)=>R.rect(x,y,124,52,.3)+R.rect(x+12,y+10,22,18,.1)+R.rect(x+44,y+10,22,18,.1)+R.rect(x+76,y+10,22,18,.1)+`M${x+124},${y}q22,6 24,52h-24`+R.circ(x+24,y+60,8)+R.circ(x+62,y+60,8)+R.circ(x+104,y+60,8);
const bus=(x,y)=>R.rect(x,y,130,56,.3)+[0,1,2,3].map(i=>R.rect(x+10+i*28,y+10,20,18,.1)).join("")+R.rect(x+114,y+10,12,30,.1)+R.circ(x+28,y+62,9)+R.circ(x+102,y+62,9);
const bike=(x,y)=>R.circ(x,y,26)+R.circ(x+86,y,26)+`M${x},${y}L${x+30},${y-40}L${x+70},${y-40}L${x+86},${y}M${x+30},${y-40}L${x+44},${y}L${x+70},${y-40}M${x+26},${y-48}h14M${x+64},${y-46}l10,-10h10`;
const car=(x,y)=>`M${x},${y+40}v-18l20,-4l18,-22h52l22,22l26,4v18Z`+R.circ(x+28,y+42,10)+R.circ(x+104,y+42,10)+`M${x+44},${y}v18M${x+64},${y-4}v22`;
const runner=(x,y)=>R.circ(x,y,12)+`M${x-2},${y+12}L${x-10},${y+50}M${x-4},${y+22}L${x+18},${y+36}M${x-4},${y+22}L${x-28},${y+30}M${x-10},${y+50}L${x+12},${y+74}M${x-10},${y+50}L${x-30},${y+70}`;
const flag=(x,y)=>`M${x},${y}v-70M${x},${y-70}l40,12l-40,12`;
const clockHalf=(cx,cy,r,f)=>[A.hatch(f>=1?R.circ(cx,cy,r):`M${cx},${cy}L${cx},${cy-r}A${r},${r} 0 ${f>.5?1:0} 1 ${f1(cx+r*Math.sin(f*2*Math.PI))},${f1(cy-r*Math.cos(f*2*Math.PI))}Z`,"o"),A.p(R.circ(cx,cy,r)+`M${cx},${cy}v${-r*.7}M${cx},${cy}h${r*.45}`,"k",3.5)];
const SVT=t3("s = sträcka","s = distance","s = المسافة"),VVT=t3("v = hastighet","v = speed","v = السرعة"),TVT=t3("t = tid","t = time","t = الزمن");
const SP={steps:[
 {say:t3("Ett tåg kör 300 km på 2 timmar. Varje timme kommer det 150 km. Hastigheten är 300 / 2 = 150 km/h, kilometer i timmen.",
   "A train travels 300 km in 2 hours. Each hour it covers 150 km. The speed is 300 ÷ 2 = 150 km/h, kilometres per hour.",
   `يقطع قطار 300 كم في ساعتين، أي 150 كم في كل ساعة. سرعته ${ISO("300 ÷ 2 = 150")} كم/ساعة، أي كيلومتر في الساعة.`),
  draw:()=>{const D=DIVS(),X=[80,400,720];return[A.wipe(),A.tx(T("300 km på 2 h","300 km in 2 h","300 كم في ساعتين"),400,62,42),
   A.p(R.line(56,220,744,220,.3)+X.map(x=>`M${x},206v28`).join(""),"k",4),A.p(train(80,150),"b",3.5),A.p(flag(720,200),"r",3.5),
   ...X.map((x,i)=>qt(`${150*i} km`,x,268,28)),A.arrow(92,292,388,292,"o",34),A.arrow(412,292,708,292,"o",34),A.tx("1 h",240,350,34,"o"),A.tx("1 h",560,350,34,"o"),
   ...hlEx(`v = 300 ${D} 2 = 150 km/h`,400,448,48)]}},
 {say:t3("Sträcka, hastighet och tid hänger ihop: s = v · t. Täck över det du söker i triangeln. Då ser du att v = s / t och t = s / v.",
   "Distance, speed and time belong together: s = v × t. Cover what you are looking for in the triangle. Then you see that v = s ÷ t and t = s ÷ v.",
   `المسافة والسرعة والزمن مرتبطة: ${ISO("s = v × t")}. غطِّ ما تبحث عنه في المثلث، فترى أن ${ISO("v = s ÷ t")} و${ISO("t = s ÷ v")}.`),
  draw:()=>{const M=MUL(),D=DIVS();return[A.wipe(),A.p(plines([[200,70],[60,330],[340,330]])+R.line(114,230,286,230,.2)+R.line(200,230,200,330,.2),"k",4.5),
   A.tx("s",200,200,60,"r"),A.tx("v",150,300,56,"b"),A.tx("t",250,300,56,"o"),A.tx(L(SVT),200,385,28,"r"),A.tx(L(VVT),200,422,28,"b"),A.tx(L(TVT),200,459,28,"o"),
   ...ex(`[r|s] = [b|v] ${M} [o|t]`,580,140,54),...ex(`[b|v] = [r|s] ${D} [o|t]`,580,260,54),...ex(`[o|t] = [r|s] ${D} [b|v]`,580,380,54),A.p(R.line(440,75,440,430,.3),"#9aa8c4",2.5)]}},
 {say:t3("Du cyklar till träningen med 18 km/h i 30 minuter. 30 minuter är en halv timme, 0,5 h. Sträckan blir s = 18 · 0,5 = 9 km.",
   "You cycle to training at 18 km/h for 30 minutes. 30 minutes is half an hour, 0.5 h. The distance is s = 18 × 0.5 = 9 km.",
   `تذهب إلى التمرين بالدراجة بسرعة 18 كم/ساعة لمدة 30 دقيقة. الثلاثون دقيقة نصف ساعة، أي 0.5 ساعة. المسافة ${ISO("s = 18 × 0.5 = 9")} كم.`),
  draw:()=>{const M=MUL();return[A.wipe(),A.p(bike(100,190),"b",3.5),...clockHalf(145,330,56,.5),A.tx(`30 min = ${dd("0.5")} h`,145,425,30,"o"),A.p(R.line(300,60,300,460,.3),"#9aa8c4",2.5),
   ...ex("v = 18 km/h",540,100,42,"b"),...ex(`t = 30 min = ${dd("0.5")} h`,540,170,42,"o"),...ex(`s = v ${M} t`,540,265,44),...ex(`s = 18 ${M} ${dd("0.5")}`,540,345,44),...hlEx("s = 9 km",540,445,52)]}},
 {say:t3("Laget åker buss 240 km till en bortamatch. Bussen håller 80 km/h. Varje timme går 80 km, så tiden blir t = 240 / 80 = 3 h.",
   "The team takes a bus 240 km to an away game. The bus keeps 80 km/h. Each hour covers 80 km, so the time is t = 240 ÷ 80 = 3 h.",
   `يسافر الفريق بالحافلة 240 كم إلى مباراة خارج أرضه، والحافلة تسير بسرعة 80 كم/ساعة. في كل ساعة تقطع 80 كم، إذن الزمن ${ISO("t = 240 ÷ 80 = 3")} ساعات.`),
  draw:()=>{const D=DIVS(),X=i=>90+i*620/3,o=[A.wipe(),A.tx(T("240 km till bortamatchen","240 km to the away game","240 كم إلى المباراة"),400,62,38),
   A.p(R.line(70,220,730,220,.3)+[0,1,2,3].map(i=>`M${f1(X(i))},206v28`).join(""),"k",4),A.p(bus(96,146),"b",3.5),A.p(flag(710,206),"r",3.5)];
   for(let i=0;i<3;i++)o.push(qt("80 km",(X(i)+X(i+1))/2,262,26),A.arrow(X(i)+10,286,X(i+1)-10,286,"o",28),A.tx("1 h",(X(i)+X(i+1))/2,338,32,"o"));
   o.push(...ex(`t = s ${D} v = 240 ${D} 80`,400,398,42),...hlEx("t = 3 h",400,468,46));return o}},
 {say:t3("1 m/s betyder 1 meter varje sekund. En timme har 3 600 sekunder, så det blir 3 600 m = 3,6 km på en timme. Alltså är 1 m/s = 3,6 km/h.",
   "1 m/s means 1 metre every second. An hour has 3,600 seconds, so that makes 3,600 m = 3.6 km in an hour. So 1 m/s = 3.6 km/h.",
   `‏1 م/ث تعني مترًا واحدًا في كل ثانية. في الساعة 3600 ثانية، فيكون ذلك 3600 م = 3.6 كم في الساعة. إذن ${ISO("1 m/s = 3.6 km/h")}.`),
  draw:()=>{const M=MUL(),D=DIVS();return[A.wipe(),...ex("1 s → 1 m",400,72,42),...ex(`${fmt(3600)} s = 1 h → ${fmt(3600)} m = ${dd("3.6")} km`,400,140,40),...hlEx(`1 m/s = ${dd("3.6")} km/h`,400,222,48),
   A.p(R.rect(110,320,170,80,.3)+R.rect(520,320,170,80,.3),"k",4),A.tx("m/s",195,375,48,"b"),A.tx("km/h",605,375,48,"r"),
   A.arrow(296,330,504,330,"g",-34),...ex(`${M} ${dd("3.6")}`,400,300,36,"g"),A.arrow(504,392,296,392,"o",-34),...ex(`${D} ${dd("3.6")}`,400,458,36,"o")]}},
 {say:t3("Usain Bolt sprang 100 m på 9,58 s, drygt 10 m/s. Gånger 3,6 blir det ungefär 36 km/h. En bil i 72 km/h kör 72 / 3,6 = 20 meter varje sekund.",
   "Usain Bolt ran 100 m in 9.58 s, just over 10 m/s. Times 3.6 gives about 36 km/h. A car at 72 km/h travels 72 ÷ 3.6 = 20 metres every second.",
   `ركض أوسين بولت 100 م في 9.58 ثانية، أي أكثر بقليل من 10 م/ث. وبالضرب في 3.6 نحصل على نحو 36 كم/ساعة. والسيارة التي تسير بسرعة 72 كم/ساعة تقطع ${ISO("72 ÷ 3.6 = 20")} مترًا في كل ثانية.`),
  draw:()=>{const M=MUL(),D=DIVS();return[A.wipe(),A.p(runner(200,62),"b",3.5),A.p(car(536,96),"r",3.5),A.p(R.line(400,60,400,460,.3),"#9aa8c4",2.5),
   ...ex(`100 m: ${dd("9.58")} s`,200,200,38),...ex("≈ 10 m/s",200,270,42,"b"),...ex(`10 ${M} ${dd("3.6")} = 36`,200,350,40),...hlEx("≈ 36 km/h",200,440,48),
   ...ex("72 km/h",600,200,42,"r"),...ex(`72 ${D} ${dd("3.6")} = 20`,600,290,40),...hlEx("20 m/s",600,390,50),A.tx(T("20 m varje sekund","20 m every second","20 م في كل ثانية"),600,460,28,"g")]}}
]};
LESSONS.push({id:"speed8",subject:"math",grades:"8",kind:"wb",
 title:t3("Hastighet, sträcka och tid","Speed, distance and time","السرعة والمسافة والزمن"),
 icon:ICO(`<path d="M30 132H290" stroke="#1d2433" stroke-width="4" stroke-linecap="round"/><path d="M60 128v-18l20-4 18-22h52l22 22 26 4v18Z" fill="#2257c9" fill-opacity=".12" stroke="#2257c9" stroke-width="3.5" stroke-linejoin="round"/><circle cx="88" cy="130" r="10" fill="#fff" stroke="#1d2433" stroke-width="3.5"/><circle cx="164" cy="130" r="10" fill="#fff" stroke="#1d2433" stroke-width="3.5"/>
  <path d="M20 94h28M14 108h30" stroke="#9aa8c4" stroke-width="3" stroke-linecap="round"/><text x="250" y="96" ${CV} font-size="40" fill="#d63b2f">km/h</text><text x="160" y="168" ${CV} font-size="28" fill="#1d2433">s = v · t</text>`),
 steps:SP.steps,mount:wbMount(SP),
 gen(level){const M=MUL(),D=DIVS();
  if(level===0){const V=pick([["car",[5,11],10,[2,5]],["train",[12,20],10,[2,4]],["bike",[12,22],1,[2,4]],["bus",[6,9],10,[2,5]]]),v=rint(...V[1])*V[2],t=rint(...V[3]),s=v*t;
   const lines={car:t3(`En bil kör ${s} km på ${t} h.`,`A car travels ${s} km in ${t} h.`,`تقطع سيارة ${s} كم في ${arH(t)}.`),train:t3(`Ett tåg kör ${s} km på ${t} h.`,`A train travels ${s} km in ${t} h.`,`يقطع قطار ${s} كم في ${arH(t)}.`),
    bike:t3(`En cyklist cyklar ${s} km på ${t} h.`,`A cyclist rides ${s} km in ${t} h.`,`يقطع دراج ${s} كم في ${arH(t)}.`),bus:t3(`En buss kör ${s} km på ${t} h.`,`A bus travels ${s} km in ${t} h.`,`تقطع حافلة ${s} كم في ${arH(t)}.`)};
   const pic={car:car(110,150),train:train(80,140),bike:bike(110,200),bus:bus(80,140)}[V[0]];
   return{kind:"num",ans:v,show:`${v} km/h`,
    q:[A.wipe(),A.tx(L(lines[V[0]]),400,70,40),A.tx(T("Vilken är medelhastigheten i km/h?","What is the average speed in km/h?","ما متوسط السرعة بالكيلومتر في الساعة؟"),400,122,32),A.p(pic,"b",3.5),
     A.p(R.line(300,215,740,215,.3)+"M300,201v28M740,201v28","k",4),qt(`${s} km`,520,190,30),qt(`${t} h`,520,262,30,"o")],
    sol:[...ex(`v = s ${D} t`,400,335,44),...mk1("cut",`v = ${s} ${D} ${t}`,400,395,44),...ansEx(`v = ${v} km/h`,400,462,46)]}}
  const HRS={6:"0.1",12:"0.2",15:"0.25",24:"0.4",30:"0.5",36:"0.6",45:"0.75",48:"0.8",90:"1.5"};
  if(level===1){const dist=Math.random()<.5,tm=pick([6,12,15,24,30,36,45,48,90]),step={6:10,12:10,15:20,24:10,30:10,36:10,45:20,48:10,90:10}[tm];let v;do{v=step*rint(1,Math.floor(120/step))}while(v<(dist?10:40));const s=v*tm/60,h=HRS[tm];
   if(dist){
    return{kind:"num",ans:s,show:`${s} km`,
     q:[A.wipe(),A.tx(T(`Du åker i ${v} km/h i ${tm} minuter.`,`You travel at ${v} km/h for ${tm} minutes.`,`تسير بسرعة ${v} كم/ساعة لمدة ${arMin(tm)}.`),400,80,38),A.tx(T("Hur långt kommer du? (km)","How far do you get? (km)","ما المسافة التي تقطعها؟ (كم)"),400,135,34),...(tm>60?[...clockHalf(330,250,56,1),...clockHalf(470,250,56,.5)]:clockHalf(400,250,62,tm/60))],
     sol:[...ex(`t = ${tm} min = ${dd(h)} h`,400,368,40,"o"),...mk1("cut",`s = v ${M} t = ${v} ${M} ${dd(h)}`,400,420,40),...ansEx(`s = ${s} km`,400,476,40)]}}
   return{kind:"num",ans:tm,show:`${tm} min`,
    q:[A.wipe(),A.tx(T(`Ett tåg kör ${dd(s)} km med hastigheten ${v} km/h.`,`A train travels ${s} km at ${v} km/h.`,`يقطع قطار ${s} كم بسرعة ${v} كم/ساعة.`),400,80,38),A.tx(T("Hur många minuter tar det?","How many minutes does it take?","كم دقيقة تستغرق الرحلة؟"),400,135,34),A.p(train(330,190),"b",3.5),A.p(R.line(200,260,600,260,.3),"k",4)],
    sol:[...ex(`t = s ${D} v = ${dd(s)} ${D} ${v}`,400,345,40),...mk1("cut",`t = ${dd(h)} h = ${dd(h)} ${M} 60 min`,400,405,40,"o"),...ansEx(`t = ${tm} min`,400,470,42)]}}
  const ty=rint(0,2),conv=y=>[A.p(R.rect(140,y,140,64,.3)+R.rect(520,y,140,64,.3),"k",3.5),A.tx("m/s",210,y+46,40,"b"),A.tx("km/h",590,y+46,40,"r"),A.arrow(292,y+8,508,y+8,"g",-26),qt(`${M} ${dd("3.6")}`,400,y-18,28,"g"),A.arrow(508,y+58,292,y+58,"o",-26),qt(`${D} ${dd("3.6")}`,400,y+108,28,"o")];
  if(ty===0){const k=rint(1,8)*5,v=k*18/5;
   return{kind:"num",ans:k,show:`${k} m/s`,q:[A.wipe(),A.tx(T("Skriv hastigheten i m/s","Write the speed in m/s","اكتب السرعة بوحدة م/ث"),400,80,40),...ex(`${v} km/h = ? m/s`,400,200,64)],
    sol:[...conv(270),...ansEx(`${v} ${D} ${dd("3.6")} = ${k} m/s`,400,470,40)]}}
  if(ty===1){const k=rint(2,30),v=+(k*3.6).toFixed(1);
   return{kind:"num",ans:v,dec:true,show:`${dfmt(v,v%1?1:0)} km/h`,q:[A.wipe(),A.tx(T("Skriv hastigheten i km/h","Write the speed in km/h","اكتب السرعة بوحدة كم/ساعة"),400,80,40),...ex(`${k} m/s = ? km/h`,400,200,64)],
    sol:[...conv(270),...ansEx(`${k} ${M} ${dd("3.6")} = ${dfmt(v,v%1?1:0)} km/h`,400,470,40)]}}
  const [sm,vv]=pick([[100,[5,8,10]],[200,[4,5,8]],[400,[4,5,8]],[800,[4,5]]]),w=pick(vv),ts=sm/w,kh=+(w*3.6).toFixed(1);
  return{kind:"num",ans:kh,dec:true,show:`${dfmt(kh,kh%1?1:0)} km/h`,
   q:[A.wipe(),A.tx(T(`En löpare springer ${sm} m på ${dd(ts)} s.`,`A runner runs ${sm} m in ${ts} s.`,`يركض عدّاء ${sm} م في ${ts} ثانية.`),400,80,38),A.tx(T("Vilken är hastigheten i km/h?","What is the speed in km/h?","ما السرعة بالكيلومتر في الساعة؟"),400,135,34),A.p(runner(400,180),"b",3.5)],
   sol:[...ex(`v = ${sm} ${D} ${dd(ts)} = ${w} m/s`,400,345,42,"b"),...mk1("cut",`${w} m/s = ${w} ${M} ${dd("3.6")} km/h`,400,405,40),...ansEx(`v = ${dfmt(kh,kh%1?1:0)} km/h`,400,470,42)]}}
});

/* ---------------------------------------------------------------
   HELP and HINTS
   --------------------------------------------------------------- */
Object.assign(HELPX,{
 pow8:[{say:t3("Med tiotal ser du regeln direkt. 10³ · 10² = 1 000 · 100 = 100 000. Tre nollor plus två nollor blir fem nollor, alltså 10⁵.",
   "With tens you can see the rule straight away. 10³ × 10² = 1,000 × 100 = 100,000. Three zeros plus two zeros make five zeros, so 10⁵.",
   `مع العشرات ترى القاعدة مباشرة: ${ISO("10³ × 10² = 1000 × 100 = 100000")}. ثلاثة أصفار وصفران تساوي خمسة أصفار، أي ${ISO("10⁵")}.`),
   draw:()=>{const M=MUL();return[...ex(`10^{[b|3]} ${M} 10^{[r|2]}`,400,90,60),...ex(`= ${fmt(1000)} ${M} 100`,400,190,52),...ex(`= ${fmt(100000)}`,400,280,52),
    A.tx(T("3 + 2 = 5 nollor","3 + 2 = 5 zeros","3 + 2 = 5 أصفار"),400,360,38,"b"),...hlEx("= 10^{5}",400,452,56)]}},
  {say:t3("Delar du tar du bort nollor. 10⁵ / 10² = 100 000 / 100 = 1 000. Fem nollor minus två nollor blir tre nollor: 10³.",
   "When you divide, you remove zeros. 10⁵ ÷ 10² = 100,000 ÷ 100 = 1,000. Five zeros minus two zeros make three zeros: 10³.",
   `عند القسمة نحذف أصفارًا: ${ISO("10⁵ ÷ 10² = 100000 ÷ 100 = 1000")}. خمسة أصفار ناقص صفرين تساوي ثلاثة أصفار: ${ISO("10³")}.`),
   draw:()=>{const D=DIVS();return[...ex(`10^{[b|5]} ${D} 10^{[r|2]}`,400,90,60),...ex(`= ${fmt(100000)} ${D} 100`,400,190,52),...ex(`= ${fmt(1000)}`,400,280,52),
    A.tx(T("5 − 2 = 3 nollor","5 − 2 = 3 zeros","5 − 2 = 3 أصفار"),400,360,38,"b"),...hlEx("= 10^{3}",400,452,56)]}}],
 root8:[{say:t3("Du har 25 plattor och vill lägga dem som en kvadrat. Det blir 5 plattor i varje rad och 5 rader. Roten ur 25 är 5.",
   "You have 25 tiles and want to lay them as a square. That makes 5 tiles in each row and 5 rows. The square root of 25 is 5.",
   "لديك 25 بلاطة وتريد أن ترصّها على شكل مربع. سيكون في كل صف 5 بلاطات وعدد الصفوف 5. الجذر التربيعي للعدد 25 هو 5."),
   draw:()=>{const M=MUL();return[A.hatch("M100,90h250v250h-250Z","o"),...gridRect(100,90,5,5,50,"k"),A.tx("5",225,388,40,"r"),A.tx("5",62,228,40,"r"),
    ...ex(`5 ${M} 5 = 25`,600,170,52),...hlEx("√{25} = 5",600,300,64),A.tx(T("25 plattor","25 tiles","25 بلاطة"),600,410,36,"o")]}},
  {say:t3("√30 är inte ett heltal. 30 ligger mellan kvadrattalen 25 och 36. Då ligger √30 mellan 5 och 6.",
   "√30 is not a whole number. 30 lies between the square numbers 25 and 36. So √30 lies between 5 and 6.",
   `${ISO("√30")} ليس عددًا صحيحًا. يقع 30 بين العددين المربعين 25 و36، إذن يقع ${ISO("√30")} بين 5 و6.`),
   draw:()=>{const r1=rowEx([{s:"25"},{s:"<"},{s:"30",c:"r"},{s:"<"},{s:"36"}],400,140,60,30),r2=rowEx([{s:"5"},{s:"<"},{s:"√{30}",c:"r"},{s:"<"},{s:"6"}],400,330,60,30);
    const mid=i=>(r1.xs[i][0]+r1.xs[i][1])/2,mid2=i=>(r2.xs[i][0]+r2.xs[i][1])/2;
    return[...r1.o,A.arrow(mid(0),160,mid2(0),268,"b"),A.arrow(mid(2),160,mid2(2),262,"r"),A.arrow(mid(4),160,mid2(4),268,"b"),...r2.o,
     A.tx(T("roten ur","square root","الجذر"),640,222,30,"b"),A.tx(T("mellan 5 och 6","between 5 and 6","بين 5 و6"),400,430,40,"g")]}}],
 sci8:[{say:t3("En meter delas i 1 000 millimeter. En millimeter är alltså en tusendel av en meter: 0,001 m = 10⁻³ m.",
   "A metre is split into 1,000 millimetres. So a millimetre is one thousandth of a metre: 0.001 m = 10⁻³ m.",
   `ينقسم المتر إلى 1000 مليمتر. إذن المليمتر جزء من ألف من المتر: ${ISO("0.001 m = 10⁻³ m")}.`),
   draw:()=>[...ruler(130,80,5,108),A.arrow(240,200,184,162,"r",-14),A.tx("1 mm",270,226,34,"r"),...ex(`1 m = ${fmt(1000)} mm`,400,310,46,"b"),...hlEx(`1 mm = ${dd("0.001")} m = 10^{−3} m`,400,420,46)]},
  {say:t3("Minus i exponenten betyder delat med. 10⁻³ är 1 delat med 10³, alltså 1 delat med 1 000.",
   "A minus in the exponent means divided by. 10⁻³ is 1 divided by 10³, which is 1 divided by 1,000.",
   `الإشارة السالبة في الأس تعني القسمة: ${ISO("10⁻³")} تساوي 1 مقسومًا على ${ISO("10³")}، أي 1 مقسومًا على 1000.`),
   draw:()=>{const D=DIVS();return[...ex("10^{[r|−3]}",400,120,90),...ex(`= 1 ${D} 10^{3}`,400,230,52),...ex(`= 1 ${D} ${fmt(1000)}`,400,320,52),...hlEx(`= ${dd("0.001")}`,400,430,56)]}}],
 speed8:[{say:t3("Hastighet säger hur långt du kommer på en timme. Åker du 50 km/h i 3 timmar kommer du 50 + 50 + 50 = 150 km.",
   "Speed tells you how far you get in one hour. If you travel at 50 km/h for 3 hours you get 50 + 50 + 50 = 150 km.",
   `السرعة تبيّن المسافة التي تقطعها في ساعة واحدة. إذا سرت بسرعة 50 كم/ساعة مدة 3 ساعات قطعت ${ISO("50 + 50 + 50 = 150")} كم.`),
   draw:()=>{const X=i=>90+i*620/3,o=[A.p(R.line(70,200,730,200,.3)+[0,1,2,3].map(i=>`M${f1(X(i))},186v28`).join(""),"k",4),A.p(car(110,136),"b",3.5)];
    for(let i=0;i<3;i++)o.push(...clockHalf((X(i)+X(i+1))/2,300,36,1).slice(1),qt("1 h",(X(i)+X(i+1))/2,366,28,"o"),qt("50 km",(X(i)+X(i+1))/2,244,28,"b"));
    o.push(...hlEx("50 + 50 + 50 = 150 km",400,452,48));return o}},
  {say:t3("Tvärtom: kör du 150 km på 3 timmar delar du sträckan lika på timmarna. 150 / 3 = 50 km varje timme, alltså 50 km/h.",
   "The other way round: if you drive 150 km in 3 hours, share the distance equally between the hours. 150 ÷ 3 = 50 km each hour, so 50 km/h.",
   `وبالعكس: إذا قطعت 150 كم في 3 ساعات فوزّع المسافة بالتساوي على الساعات: ${ISO("150 ÷ 3 = 50")} كم في كل ساعة، أي 50 كم/ساعة.`),
   draw:()=>{const D=DIVS(),X=i=>90+i*620/3,o=[A.p(R.line(70,200,730,200,.3)+[0,1,2,3].map(i=>`M${f1(X(i))},186v28`).join(""),"k",4),qt("150 km",400,160,32,"k")];
    for(let i=0;i<3;i++)o.push(A.loop((X(i)+X(i+1))/2,250,90,34,"b"),qt("50 km",(X(i)+X(i+1))/2,260,28,"b"));
    o.push(...ex(`150 ${D} 3 = 50`,400,370,48),...hlEx("50 km/h",400,455,52));return o}}]
});
Object.assign(HINTSX,{
 pow8:[{say:t3("Multiplikation med samma bas: addera exponenterna. Division: subtrahera dem.","Multiplying with the same base: add the exponents. Dividing: subtract them.","عند الضرب مع الأساس نفسه نجمع الأسس، وعند القسمة نطرحها."),cut:upTo("ans")},
  {say:t3("Potens av en potens: multiplicera exponenterna. Ta en regel i taget.","A power of a power: multiply the exponents. Use one rule at a time.","في قوة القوة نضرب الأسس. طبّق قاعدة واحدة في كل مرة."),cut:upTo("ans")},
  {say:t3("Förenkla först till en enda potens. Räkna sedan ut värdet. Kom ihåg att a⁰ = 1.","First simplify to a single power. Then work out its value. Remember that a⁰ = 1.",`بسّط أولًا إلى قوة واحدة، ثم احسب قيمتها. وتذكّر أن ${ISO("a⁰ = 1")}.`),cut:upTo("e")}],
 root8:[{say:t3("Vilket tal gånger sig självt blir talet? Pröva dig fram. Kvadrera: talet gånger sig självt.","Which number times itself gives the number? Try your way forward. To square: the number times itself.","أي عدد إذا ضُرب في نفسه أعطى هذا العدد؟ جرّب حتى تجده. والتربيع هو ضرب العدد في نفسه."),cut:upTo("ans")},
  {say:t3("Leta upp kvadrattalen närmast under och över talet under roten.","Find the square numbers just below and just above the number under the root.","ابحث عن العددين المربعين الأقرب أسفل العدد تحت الجذر وأعلاه."),cut:upTo("ineq")},
  {say:t3("Vilket kvadrattal ligger närmast talet? Sidan i en kvadrat är roten ur arean.","Which square number is closest to the number? The side of a square is the square root of its area.","أي عدد مربع هو الأقرب إلى العدد؟ ضلع المربع هو الجذر التربيعي لمساحته."),cut:upTo("cut")}],
 sci8:[{say:t3("Flytta kommat åt höger tills det står efter den första siffran som inte är noll. Räkna stegen.","Move the decimal point to the right until it is after the first digit that is not zero. Count the steps.","انقل الفاصلة إلى اليمين حتى تقع بعد أول رقم غير الصفر، وعُدّ الخطوات."),cut:upTo("cut")},
  {say:t3("Negativ exponent: flytta kommat åt vänster lika många steg som exponenten säger. Fyll på med nollor framför.","A negative exponent: move the decimal point to the left as many steps as the exponent says. Fill in zeros in front.","الأس السالب: انقل الفاصلة إلى اليسار بعدد الخطوات الذي يحدده الأس، وأضف أصفارًا في المقدمة."),cut:upTo("cut")},
  {say:t3("Byt ut prefixet mot sin tiopotens: milli = 10⁻³, mikro = 10⁻⁶, nano = 10⁻⁹.","Replace the prefix with its power of ten: milli = 10⁻³, micro = 10⁻⁶, nano = 10⁻⁹.",`استبدل البادئة بقوة العشرة المقابلة لها: ملّي = ${ISO("10⁻³")}، ميكرو = ${ISO("10⁻⁶")}، نانو = ${ISO("10⁻⁹")}.`),cut:upTo("cut")}],
 speed8:[{say:t3("Hastighet = sträcka delat med tid.","Speed = distance divided by time.","السرعة = المسافة مقسومة على الزمن."),cut:upTo("cut")},
  {say:t3("Gör om minuterna till timmar först: 60 min = 1 h.","Turn the minutes into hours first: 60 min = 1 h.","حوّل الدقائق إلى ساعات أولًا: 60 دقيقة = ساعة واحدة."),cut:upTo("cut")},
  {say:t3("Från m/s till km/h: gånger 3,6. Från km/h till m/s: delat med 3,6.","From m/s to km/h: times 3.6. From km/h to m/s: divided by 3.6.","من م/ث إلى كم/ساعة نضرب في 3.6، ومن كم/ساعة إلى م/ث نقسم على 3.6."),cut:upTo("cut")}]
});
}
