/* ===== y7b.js ===== */
/* =====================================================================
   YEAR 7 (y7b): frac7 multiplying and dividing fractions, pct7 part/whole/percentage,
   alg7 algebraic expressions, eq7 equations with x on both sides
   ===================================================================== */
{
/* ---------- shared helpers (local to this block) ---------- */
const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a);
const LR=s=>"⁦"+s+"⁩";                       /* keeps a formula left-to-right inside Arabic speech */
const TT=(sv,en,ar)=>L(t3(sv,en,ar));
const PC=n=>lang==="sv"?`${n} %`:`${n}%`;
const DEC=x=>{x=Math.round(x*10000)/10000;if(Number.isInteger(x))return fmt(x);return dfmt(x,String(x).split(".")[1].length)};
const MN=n=>n<0?"−"+(-n):String(n);                    /* real minus sign */
const fw=(n,d,s)=>Math.max(String(n).length,String(d).length)*s*.42+s*.3;
const tw=(t,s)=>{t=String(t);return /[؀-ۿ]/.test(t)?t.length*s*.5+s*.2:t.length*s*.44};
/* a row of fractions and texts centred on cx; y is the fraction line. items: ["f",n,d,c] | ["t",text,c]. rtl mirrors the order in Arabic */
const row=(items,cx,y,s,rtl=false)=>{const g=s*.28,ws=items.map(it=>it[0]==="f"?fw(it[1],it[2],s):tw(it[1],s)),tot=ws.reduce((a,b)=>a+b,0)+g*(items.length-1),ord=items.map((_,i)=>i);
 if(rtl&&lang==="ar")ord.reverse();let x=cx-tot/2;const pos=[];ord.forEach(i=>{pos[i]=x+ws[i]/2;x+=ws[i]+g});
 const parts=items.map((it,i)=>it[0]==="f"?A.frac(it[1],it[2],pos[i],y,s,it[3]||"k"):[A.tx(it[1],pos[i],y+s*.36,s,it[2]||"k")]);
 return{parts,pos,ws,all:parts.flat(),l:cx-tot/2,r:cx+tot/2}};
const hlR=(l,r,y,s,pad=14)=>A.hl(l-pad,y-s*.95,r-l+2*pad,s*1.9);
const keep=s=>s.replace(/(\d) (?=\d|kr|GB|min|%|m\b|كرونة|دقيقة)/g,"$1 ");
const wrap=(s,max)=>{const o=[];let cur="";keep(s).split(" ").forEach(w=>{if(cur&&(cur+" "+w).length>max){o.push(cur);cur=w}else cur=cur?cur+" "+w:w});if(cur)o.push(cur);return o};
/* balanced wrap: same number of lines as wrap(), but lines of even length (no lonely last word) */
const bwrap=(s,max)=>{const n=wrap(s,max).length;if(n<2)return[keep(s)];let m=Math.ceil(keep(s).length/n);while(wrap(s,m).length>n)m++;return wrap(s,m)};
const box=(x,y,w,h)=>`M${f1(x)},${f1(y)}h${f1(w)}v${f1(h)}h${f1(-w)}Z`;
const ICON=b=>`<svg viewBox="0 0 320 180"><rect width="320" height="180" fill="#fff"/>${b}</svg>`;
const ITX=(s,x,y,size,c="#1d2433")=>`<text direction="ltr" x="${x}" y="${y}" font-family="Caveat,cursive" font-weight="700" font-size="${size}" fill="${c}" text-anchor="middle">${s}</text>`;

/* =====================================================================
   1. frac7: multiplying and dividing fractions
   ===================================================================== */
const CHOC="#7a4a2a",BAR={x:70,y:110,w:360,h:180};
const choc=(cols,rows,x,y,w,h)=>{let d=R.rect(x,y,w,h,.4);for(let i=1;i<cols;i++)d+=R.line(x+w*i/cols,y,x+w*i/cols,y+h,.3);for(let j=1;j<rows;j++)d+=R.line(x,y+h*j/rows,x+w,y+h*j/rows,.3);return d};
const strike=(x,y,c)=>A.p(R.line(x-16,y+18,x+16,y-18,.2),c,4.5);
/* number line 0..n split in parts of 1/b; returns X() */
function fline(n,b,y,x1=80,x2=720){const X=v=>x1+(x2-x1)*v/n;let d=R.line(x1,y,x2,y,.4);for(let i=0;i<=n*b;i++){const big=i%b===0;d+=`M${f1(X(i/b))},${y-(big?16:8)}v${big?32:16}`}
 return{X,o:[A.p(d,"k",3.5),...[...Array(n+1)].map((_,i)=>qt(i,X(i),y+46,28))]}}
function jumps(X,y,step,k){const o=[];for(let j=0;j<k;j++){const xs=X(j*step),xe=X((j+1)*step),bd=Math.min(40,(xe-xs)*.5),c=j%2?"o":"b";
 o.push(A.arrow(xs+3,y-12,xe-3,y-12,c,-bd),qt(j+1,(xs+xe)/2,y-12-bd/2-14,24,c))}return o}
const FR7={steps:[
 {say:t3("Du har 3/4 av en chokladkaka kvar. Du äter hälften av det som är kvar. Hur stor del av hela kakan äter du?",
   "You have 3/4 of a chocolate bar left. You eat half of what is left. How much of the whole bar do you eat?",
   "بقي معك 3/4 لوح شوكولاتة، وأكلت نصف ما تبقّى. ما الجزء الذي أكلته من اللوح كله؟"),
  draw:()=>[A.wipe(),A.tx(TT("Hälften av det som är kvar","Half of what is left","نصف ما تبقّى"),400,58,40),
   A.p(choc(4,1,BAR.x,BAR.y,BAR.w,BAR.h),CHOC,5),A.hatch(box(BAR.x,BAR.y,BAR.w*3/4,BAR.h),"b"),
   ...A.frac(3,4,610,185,72,"b"),A.tx(TT("kvar av kakan","of the bar is left","المتبقّي من اللوح"),610,290,32,"b")]},
 {say:t3("Dela kakan på mitten åt andra hållet. Hälften av den blå delen är 3 bitar av 8. ”Av” betyder gånger: 1/2 · 3/4 = 3/8.",
   "Cut the bar in half the other way. Half of the blue part is 3 pieces out of 8. “Of” means times: 1/2 × 3/4 = 3/8.",
   `نقسم اللوح نصفين بالعرض. نصف الجزء الأزرق هو 3 قطع من 8. كلمة «من» تعني الضرب: ${LR("1/2 × 3/4 = 3/8")}.`),
  draw:()=>{const B=BAR,r=row([["f",1,2,"r"],["t",MUL()],["f",3,4,"b"],["t","="],["f",3,8,"g"]],250,400,52);
   return[A.p(R.line(B.x,B.y+B.h/2,B.x+B.w,B.y+B.h/2,.3),CHOC,5),A.hatch(box(B.x,B.y,B.w*3/4,B.h/2),"r"),A.p(R.rect(B.x,B.y,B.w*3/4,B.h/2,.3),"r",6),
    ...[0,1,2].map(i=>qt(i+1,B.x+B.w*(i+.5)/4,B.y+B.h/4+12,34,"r")),hlR(r.l,r.r,400,52),...r.all,
    A.tx(TT("”av” betyder gånger","“of” means times","«من» تعني الضرب"),610,412,34,"r")]}},
 {say:t3("Regeln: täljare gånger täljare och nämnare gånger nämnare. 2/3 · 4/5 = 8/15. Rutnätet visar samma sak: 8 rutor av 15.",
   "The rule: numerator times numerator and denominator times denominator. 2/3 × 4/5 = 8/15. The grid shows the same thing: 8 squares out of 15.",
   `القاعدة: البسط × البسط، والمقام × المقام. ${LR("2/3 × 4/5 = 8/15")}. والشبكة تُظهر الشيء نفسه: 8 مربعات من 15.`),
  draw:()=>{const M=MUL(),r=row([["f",2,3,"r"],["t",M],["f",4,5,"b"],["t","="],["f",`2 ${M} 4`,`3 ${M} 5`],["t","="],["f",8,15,"g"]],400,165,52),gx=275,gy=250,c=50;
   let g=R.rect(gx,gy,5*c,3*c,.4);for(let i=1;i<5;i++)g+=R.line(gx+i*c,gy,gx+i*c,gy+3*c,.2);for(let j=1;j<3;j++)g+=R.line(gx,gy+j*c,gx+5*c,gy+j*c,.2);
   return[A.wipe(),A.tx(`${TT("täljare","numerator","البسط")} ${M} ${TT("täljare","numerator","البسط")},  ${TT("nämnare","denominator","المقام")} ${M} ${TT("nämnare","denominator","المقام")}`,400,52,34,"k"),
    ...r.all,A.p(g,"k",3),A.hatch(box(gx,gy,4*c,3*c),"b"),A.hatch(box(gx,gy,5*c,2*c),"r"),A.p(R.rect(gx,gy,4*c,2*c,.3),"g",6),
    ...A.frac(2,3,gx-50,gy+75,32,"r"),...A.frac(4,5,gx+5*c+50,gy+75,32,"b"),A.tx(TT("8 rutor av 15","8 squares out of 15","8 مربعات من 15"),400,458,34,"g")]}},
 {say:t3("Förkorta gärna innan du multiplicerar! 3 och 9 kan delas med 3. 4 och 8 kan delas med 4. Då blir det 1/2 · 1/3 = 1/6.",
   "Simplify before you multiply! 3 and 9 can both be divided by 3. 4 and 8 can both be divided by 4. Then it is 1/2 × 1/3 = 1/6.",
   `اختصر قبل أن تضرب! نقسم 3 و9 على 3، ونقسم 4 و8 على 4. فيصبح ${LR("1/2 × 1/3 = 1/6")}.`),
  draw:()=>{const M=MUL(),s=72,y=200,r=row([["f",3,8],["t",M],["f",4,9]],400,y,s),x1=r.pos[0],x2=r.pos[2],nu=y-.47*s,de=y+.43*s,
    r2=row([["t","="],["f",1,2],["t",M],["f",1,3],["t","="],["f",1,6,"g"]],400,395,60);
   return[A.wipe(),A.tx(TT("Förkorta först","Simplify first","اختصر أولًا"),400,58,40),...r.all,
    strike(x1,nu,"r"),strike(x2,de,"r"),qt("1",x1,y-.95*s-4,34,"r"),qt("3",x2,y+.78*s+42,34,"r"),
    strike(x2,nu,"b"),strike(x1,de,"b"),qt("1",x2,y-.95*s-4,34,"b"),qt("2",x1,y+.78*s+42,34,"b"),
    A.tx(`3 ${DIVS()} 3`,x1-130,y-.3*s,30,"r"),A.tx(`4 ${DIVS()} 4`,x2+130,y-.3*s,30,"b"),
    ...r2.parts.slice(0,5).flat(),hlR(r2.pos[5]-r2.ws[5]/2,r2.pos[5]+r2.ws[5]/2,395,60),...r2.parts[5]]}},
 {say:t3("Division: hur många glas på 1/4 liter kan du fylla med 3 liter smoothie? Varje liter ger 4 glas, så 3 delat med 1/4 = 3 · 4 = 12.",
   "Division: how many 1/4-litre glasses can you fill with 3 litres of smoothie? Each litre fills 4 glasses, so 3 ÷ 1/4 = 3 × 4 = 12.",
   `القسمة: كم كأسًا سعتها 1/4 لتر تملأ من 3 لترات من العصير؟ كل لتر يملأ 4 كؤوس، إذن ${LR("3 ÷ 1/4 = 3 × 4 = 12")}.`),
  draw:()=>{const M=MUL(),D=DIVS(),W=200,G=30,x0=75,y=135,h=64,o=[A.wipe(),A.tx(TT("Hur många glas på 1/4 liter?","How many 1/4-litre glasses?","كم كأسًا سعتها 1/4 لتر؟"),400,58,40)];
   for(let i=0;i<3;i++){const x=x0+i*(W+G);o.push(A.p(R.bar(x,y,W,h,4),"b",3.5),A.tx(TT("1 liter","1 litre","1 لتر"),x+W/2,y+h+42,32,"b"))}
   for(let i=0;i<3;i++)o.push(...[0,1,2,3].map(j=>qt(i*4+j+1,x0+i*(W+G)+W*(j+.5)/4,y+h/2+10,28,"o")));
   const r=row([["t","3"],["t",D],["f",1,4],["t","="],["t","3"],["t",M],["t","4"],["t","="],["t","12","g"]],400,330,54);
   o.push(...r.parts.slice(0,8).flat(),hlR(r.pos[8]-r.ws[8]/2,r.pos[8]+r.ws[8]/2,330,54),...r.parts[8],A.tx(TT("Varje liter ger 4 glas.","Each litre fills 4 glasses.","كل لتر يملأ 4 كؤوس."),400,450,34,"b"));return o}},
 {say:t3("Att dela med ett bråk är samma sak som att multiplicera med det inverterade bråket. Vänd 4/5 till 5/4: 2/3 delat med 4/5 = 2/3 · 5/4 = 10/12 = 5/6.",
   "Dividing by a fraction is the same as multiplying by its reciprocal. Flip 4/5 to 5/4: 2/3 ÷ 4/5 = 2/3 × 5/4 = 10/12 = 5/6.",
   `القسمة على كسر هي الضرب في مقلوبه. نقلب 4/5 فيصبح 5/4: ${LR("2/3 ÷ 4/5 = 2/3 × 5/4 = 10/12 = 5/6")}.`),
  draw:()=>{const M=MUL(),D=DIVS(),s=62,y=215,r=row([["f",2,3],["t",D],["f",4,5,"b"],["t","="],["f",2,3],["t",M],["f",5,4,"r"]],400,y,s),
    r2=row([["t","="],["f",`2 ${M} 5`,`3 ${M} 4`],["t","="],["f",10,12],["t","="],["f",5,6,"g"]],400,385,54),ay=y-.82*s-10;
   return[A.wipe(),A.tx(TT("Dela med ett bråk: vänd och multiplicera","Divide by a fraction: flip it and multiply","القسمة على كسر: اقلبه ثم اضرب"),400,52,36),...r.all,
    A.arrow(r.pos[2]+10,ay,r.pos[6]-10,ay,"r",-44),A.tx(TT("vänd","flip","اقلب"),(r.pos[2]+r.pos[6])/2,ay-30,30,"r"),
    ...r2.parts.slice(0,5).flat(),hlR(r2.pos[5]-r2.ws[5]/2,r2.pos[5]+r2.ws[5]/2,385,54),...r2.parts[5]]}}
]};
const FCTX=[
 {u:t3("liter","litres","لتر"),t:(n,f)=>t3(`Du har ${n} liter smoothie. Varje glas rymmer ${f} liter.`,`You have ${n} litres of smoothie. Each glass holds ${f} litre.`,`كمية العصير: ${n} لتر. سعة كل كأس: ${f} لتر.`),
  q:t3("Hur många glas kan du fylla?","How many glasses can you fill?","كم كأسًا تستطيع أن تملأ؟")},
 {u:t3("timmar","hours","ساعة"),t:(n,f)=>t3(`Du har ${n} timmar ledigt. Varje avsnitt av serien är ${f} timme.`,`You have ${n} hours free. Each episode of the series is ${f} hour long.`,`وقت فراغك: ${n} ساعة. مدة كل حلقة من المسلسل: ${f} ساعة.`),
  q:t3("Hur många avsnitt hinner du se?","How many episodes can you watch?","كم حلقة تستطيع أن تشاهد؟")},
 {u:t3("pizzor","pizzas","بيتزا"),t:(n,f)=>t3(`Ni har ${n} pizzor på festen. Varje person äter ${f} pizza.`,`There are ${n} pizzas at the party. Each person eats ${f} of a pizza.`,`عدد البيتزا في الحفلة: ${n}. يأكل كل شخص ${f} بيتزا.`),
  q:t3("Hur många personer räcker pizzorna till?","How many people are the pizzas enough for?","لكم شخصًا تكفي البيتزا؟")},
 {u:t3("meter","metres","متر"),t:(n,f)=>t3(`Du har ${n} meter kabel. Du klipper bitar som är ${f} meter långa.`,`You have ${n} metres of cable. You cut pieces that are ${f} metre long.`,`طول السلك: ${n} متر. تقصّه قطعًا طول كل منها ${f} متر.`),
  q:t3("Hur många bitar blir det?","How many pieces do you get?","كم قطعة تحصل عليها؟")}];
LESSONS.push({id:"frac7",subject:"math",grades:"7",kind:"wb",
 title:t3("Multiplikation och division med bråk","Multiplying and dividing fractions","ضرب الكسور وقسمتها"),
 icon:ICON(`<defs><pattern id="f7b" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(40)"><line x1="2" y1="0" x2="2" y2="8" stroke="#2257c9" stroke-width="3" stroke-opacity=".5"/></pattern><pattern id="f7r" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(-40)"><line x1="2" y1="0" x2="2" y2="8" stroke="#d63b2f" stroke-width="3" stroke-opacity=".5"/></pattern></defs>
  <rect x="30" y="40" width="105" height="100" fill="url(#f7b)"/><rect x="30" y="40" width="140" height="50" fill="url(#f7r)"/><path d="M30 40H170V140H30ZM65 40V140M100 40V140M135 40V140M30 90H170" fill="none" stroke="#7a4a2a" stroke-width="3.5"/><rect x="30" y="40" width="105" height="50" fill="none" stroke="#1e9e5a" stroke-width="4"/>
  ${ITX("1/2 · 3/4",245,80,34)}${ITX("= 3/8",245,128,38,"#1e9e5a")}`),
 steps:FR7.steps,mount:wbMount(FR7),
 gen(level){const M=MUL(),D=DIVS();
  if(level===0){let a,b,c,d;do{b=rint(2,6);d=rint(2,6);a=rint(1,b-1);c=rint(1,d-1)}while(gcd(a,b)>1||gcd(c,d)>1||b*d<6);
   const n=a*c,m=b*d,k=gcd(n,m),y1=300;
   const q=[A.wipe(),A.tx(TT("Räkna ut:","Work it out:","احسب:"),400,62,40),...row([["f",a,b,"r"],["t",M],["f",c,d,"b"],["t","="],["t","?"]],400,160,72).all];
   const r=row([["t","="],["f",`${a} ${M} ${c}`,`${b} ${M} ${d}`],["t","="],["f",n,m,k>1?"k":"g"]],590,y1,46);
   const cs=Math.min(50,260/d,160/b),gw=d*cs,gh=b*cs,gx=245-gw/2,gy=330-gh/2;
   let g=R.rect(gx,gy,gw,gh,.4);for(let i=1;i<d;i++)g+=R.line(gx+i*cs,gy,gx+i*cs,gy+gh,.2);for(let j=1;j<b;j++)g+=R.line(gx,gy+j*cs,gx+gw,gy+j*cs,.2);
   const sol=[...r.parts[0],...r.parts[1]],hk=sol.length;
   sol.push(A.p(g,"k",3),A.hatch(box(gx,gy,c*cs,gh),"b"),A.hatch(box(gx,gy,gw,a*cs),"r"),A.p(R.rect(gx,gy,c*cs,a*cs,.3),"g",5),...A.frac(a,b,gx-44,gy+gh/2,36,"r"),...A.frac(c,d,gx+gw/2,gy+gh+38,36,"b"));
   if(k>1){const r2=row([["t","="],["f",n/k,m/k,"g"]],590,420,50);sol.push(...r.parts[2],...r.parts[3],hlR(r2.l,r2.r,420,50),...r2.all)}
   else sol.push(...r.parts[2],hlR(r.pos[3]-r.ws[3]/2,r.pos[3]+r.ws[3]/2,y1,46),...r.parts[3]);
   return{kind:"frac",ans:[n,m],show:`${n/k}/${m/k}`,hk,q,sol}}
  if(level===1){let n,a,b,k;do{b=rint(2,6);a=rint(1,b-1);n=rint(2,8);k=n*b/a}while(gcd(a,b)>1||!Number.isInteger(k)||k<3||k>12||n*b>36);
   const C=pick(FCTX),f=`${a}/${b}`,lines=bwrap(L(C.t(n,f)),lang==="ar"?48:54),y=280,NL=fline(n,b,y);
   const q=[A.wipe(),...lines.map((s,i)=>A.tx(s,400,50+i*40,30)),A.tx(L(C.q),400,50+lines.length*40+8,32,"b"),...NL.o,A.tx(L(C.u),400,y+86,28)];
   const items=a===1?[["t",n],["t",D],["f",a,b],["t","="],["t",n],["t",M],["t",b],["t","="],["t",k,"g"]]
    :[["t",n],["t",D],["f",a,b],["t","="],["t",n],["t",M],["f",b,a],["t","="],["f",n*b,a],["t","="],["t",k,"g"]];
   const r=row(items,400,440,44),last=items.length-1,sol=r.parts.slice(0,7).flat(),hk=sol.length;
   sol.push(...jumps(NL.X,y,a/b,k),...r.parts.slice(7,last).flat(),hlR(r.pos[last]-r.ws[last]/2,r.pos[last]+r.ws[last]/2,440,44),...r.parts[last]);
   return{kind:"num",ans:k,show:String(k),hk,q,sol}}
  let a,b,c,d,p,qq;do{b=rint(2,9);d=rint(2,9);a=rint(1,b-1);c=rint(1,d-1);const k=gcd(a*d,b*c);p=a*d/k;qq=b*c/k}while(gcd(a,b)>1||gcd(c,d)>1||qq===1||a*d===b*c);
  const n=a*d,m=b*c,k=gcd(n,m),y=360;
  const q=[A.wipe(),A.tx(TT("Räkna ut:","Work it out:","احسب:"),400,62,40),...row([["f",a,b],["t",D],["f",c,d,"b"],["t","="],["t","?"]],400,170,72).all];
  const items=[["t","="],["f",a,b],["t",M],["f",d,c,"r"],["t","="],["f",`${a} ${M} ${d}`,`${b} ${M} ${c}`],["t","="],["f",n,m,k>1?"k":"g"]];
  if(k>1)items.push(["t","="],["f",p,qq,"g"]);
  const r=row(items,400,y,50),last=items.length-1,sol=[...r.parts.slice(0,4).flat(),A.tx(TT("vänd","flip","اقلب"),r.pos[3],y-.82*50-16,28,"r"),...r.parts[4],...r.parts[5]],hk=sol.length;
  sol.push(...r.parts.slice(6,last).flat(),hlR(r.pos[last]-r.ws[last]/2,r.pos[last]+r.ws[last]/2,y,50),...r.parts[last]);
  return{kind:"frac",ans:[p,qq],show:`${p}/${qq}`,hk,q,sol}}
});

/* =====================================================================
   2. pct7: percent — the part, the whole and the percentage
   ===================================================================== */
const PART=()=>TT("delen","part","الجزء"),WHOLE=()=>TT("det hela","whole","الكل"),SHARE=()=>TT("andelen","percentage","النسبة");
const RULE={part:()=>`${PART()} = ${SHARE()} ${MUL()} ${WHOLE()}`,pct:()=>`${SHARE()} = ${PART()} ${DIVS()} ${WHOLE()}`,whole:()=>`${WHOLE()} = ${PART()} ${DIVS()} ${SHARE()}`};
const PB={x0:110,x1:690,y:185,h:56};
/* percent bar: amounts on top, percentages underneath; "?" is drawn in orange */
function pbar(p,topP,topW,botP,c="b"){const X=v=>PB.x0+(PB.x1-PB.x0)*v/100,xp=X(p),{y,h}=PB,col=s=>s==="?"?"o":null;
 return[A.p(R.rect(PB.x0,y,PB.x1-PB.x0,h,.4),"k",4),A.hatch(box(PB.x0,y,xp-PB.x0,h),c),A.p(`M${f1(xp)},${y-12}V${y+h+12}M${PB.x0},${y-12}V${y+h+12}M${PB.x1},${y-12}V${y+h+12}`,"k",3.5),
  A.tx("0",PB.x0,y-22,30),A.tx(topP,xp,y-22,30,col(topP)||c),A.tx(topW,PB.x1,y-22,30,col(topW)||"k"),
  A.tx(PC(0),PB.x0,y+h+42,30,"r"),A.tx(botP,xp,y+h+42,30,col(botP)||"r"),A.tx(PC(100),PB.x1,y+h+42,30,"r")]}
const PCT={steps:[
 {say:t3("I klassen går 30 elever. Det är det hela. 12 av dem spelar datorspel varje dag. Det är delen. Andelen är 12/30 = 0,4 = 40 %.",
   "There are 30 students in the class. That is the whole. 12 of them play video games every day. That is the part. The percentage is 12/30 = 0.4 = 40%.",
   `في الصف 30 طالبًا، وهذا هو الكل. منهم 12 يلعبون ألعاب الفيديو كل يوم، وهذا هو الجزء. والنسبة هي ${LR("12/30 = 0.4 = 40%")}.`),
  draw:()=>{const pts=[...Array(30)].map((_,i)=>[220+(i%10)*40,112+Math.floor(i/10)*42]),r=row([["t",SHARE()],["t","="],["f",PART(),WHOLE()]],400,330,38,true),
    r2=row([["f",12,30],["t","="],["t",dfmt(.4,1)],["t","="],["t",PC(40),"g"]],400,440,46);
   return[A.wipe(),A.tx(TT("Det hela, delen och andelen","The whole, the part and the percentage","الكل والجزء والنسبة"),400,52,38),
    A.p(dots(pts.slice(0,12)),"o",24),A.p(dots(pts.slice(12)),"b",24),
    A.tx(`${PART()} = 12`,260,262,34,"o"),A.tx(`${WHOLE()} = 30`,540,262,34,"b"),...r.all,
    ...r2.parts.slice(0,4).flat(),hlR(r2.pos[4]-r2.ws[4]/2,r2.pos[4]+r2.ws[4]/2,440,46),...r2.parts[4]]}},
 {say:t3("Din surfpott är 20 GB och du har använt 35 %. Hur många GB är det? Skriv 35 % som 0,35. Delen = 0,35 · 20 = 7 GB.",
   "Your data plan is 20 GB and you have used 35%. How many GB is that? Write 35% as 0.35. The part = 0.35 × 20 = 7 GB.",
   `باقة الإنترنت 20 GB واستهلكت 35% منها. كم GB هذا؟ نكتب 35% على شكل 0.35. الجزء = ${LR("0.35 × 20 = 7")} GB.`),
  draw:()=>[A.wipe(),A.tx(TT(`Hur mycket är ${PC(35)} av 20 GB?`,`What is ${PC(35)} of 20 GB?`,`كم تساوي ${PC(35)} من 20 GB؟`),400,56,40),
   ...pbar(35,"?","20 GB",PC(35)),A.tx(RULE.part(),400,345,30,"b"),A.tx(`${PC(35)} = ${dfmt(.35,2)}`,400,402,42),
   A.hl(220,422,360,64),A.tx(`${dfmt(.35,2)} ${MUL()} 20 = 7 GB`,400,468,46,"g")]},
 {say:t3("Spelet kostar 450 kr och du har sparat 270 kr. Hur många procent är det? Andelen = 270 / 450 = 0,6 = 60 %.",
   "The game costs 450 kr and you have saved 270 kr. What percentage is that? The percentage = 270 ÷ 450 = 0.6 = 60%.",
   `سعر اللعبة 450 كرونة وادّخرت 270 كرونة. ما النسبة المئوية؟ النسبة = ${LR("270 ÷ 450 = 0.6 = 60%")}.`),
  draw:()=>[A.wipe(),A.tx(TT("Hur många procent är 270 kr av 450 kr?","What percentage of 450 kr is 270 kr?","ما نسبة 270 كرونة من 450 كرونة؟"),400,56,38),
   ...pbar(60,"270 kr","450 kr","?"),A.tx(RULE.pct(),400,345,30,"b"),A.tx(`270 ${DIVS()} 450 = ${dfmt(.6,1)}`,400,402,42),
   A.hl(250,422,300,64),A.tx(`${dfmt(.6,1)} = ${PC(60)}`,400,468,46,"g")]},
 {say:t3("På rean får du 30 % rabatt på en jacka. Rabatten är 120 kr. Vad kostade jackan från början? 30 % är 120 kr, så 1 % är 120 / 30 = 4 kr och 100 % är 400 kr.",
   "In the sale you get 30% off a jacket. The discount is 120 kr. What did the jacket cost before? 30% is 120 kr, so 1% is 120 ÷ 30 = 4 kr and 100% is 400 kr.",
   `في التخفيضات تحصل على خصم 30% على سترة، أي 120 كرونة. كم كان سعرها في الأصل؟ 30% تساوي 120 كرونة، إذن 1% تساوي ${LR("120 ÷ 30 = 4")} كرونات، و100% تساوي 400 كرونة.`),
  draw:()=>[A.wipe(),A.tx(TT(`${PC(30)} är 120 kr. Vad är ${PC(100)}?`,`${PC(30)} is 120 kr. What is ${PC(100)}?`,`${PC(30)} تساوي 120 كرونة. كم تساوي ${PC(100)}؟`),400,56,40),
   ...pbar(30,"120 kr","?",PC(30)),A.tx(TT(`Gå via ${PC(1)}`,`Go via ${PC(1)}`,`احسب ${PC(1)} أولًا`),400,345,30,"b"),A.tx(`${PC(1)} = 120 ${DIVS()} 30 = 4 kr`,400,402,42),
   A.hl(200,422,400,64),A.tx(`${PC(100)} = 100 ${MUL()} 4 = 400 kr`,400,468,46,"g")]},
 {say:t3("Tre sorters frågor, en triangel. Täck över det du söker. Det som syns visar hur du räknar.",
   "Three kinds of question, one triangle. Cover the one you are looking for. What you can still see shows how to calculate.",
   "ثلاثة أنواع من الأسئلة ومثلث واحد. غطِّ ما تبحث عنه، وما يبقى ظاهرًا يبيّن لك كيف تحسب."),
  draw:()=>{const ax=200,ay=95,bl=20,br=380,by=360,my=225;const hw=(my-ay)/(by-ay)*(br-bl)/2,hb=(by-44-ay)/(by-ay)*(br-bl)/2,m=s=>Math.min(32,(hb-50)/tw(s,1));
   return[A.wipe(),A.tx(TT("Procenttriangeln","The percent triangle","مثلث النسبة المئوية"),400,52,38),
    A.p(R.line(ax,ay,br,by,.4)+R.line(br,by,bl,by,.4)+R.line(bl,by,ax,ay,.4),"k",4.5),A.p(R.line(ax-hw,my,ax+hw,my,.3)+R.line(ax,my,ax,by-100,.2)+R.line(ax,by-58,ax,by,.2),"k",3.5),
    A.tx(PART(),ax,my-22,34,"o"),A.tx(SHARE(),ax-hb/2-4,by-44,m(SHARE()),"r"),A.tx(WHOLE(),ax+hb/2+4,by-44,m(WHOLE()),"b"),A.tx(MUL(),ax,by-68,34),
    A.tx(RULE.part(),590,170,30,"o"),A.tx(RULE.pct(),590,260,30,"r"),A.tx(RULE.whole(),590,350,30,"b"),
    A.tx(TT("andelen skrivs i decimalform","write the percentage as a decimal","اكتب النسبة عددًا عشريًا"),400,450,30,"k")]}}
]};
const SALE=[{sv:"hörlurarna",en:"the headphones",ar:"السماعات",pl:1},{sv:"jackan",en:"the jacket",ar:"السترة",pl:0},{sv:"sneakersen",en:"the trainers",ar:"الحذاء الرياضي",pl:1},{sv:"spelkonsolen",en:"the games console",ar:"جهاز الألعاب",pl:0}];
const cap=s=>s[0].toUpperCase()+s.slice(1);
/* contexts: whole W, part P, percentage p (all already formatted); u = unit on the board; lo/hi/st = range and step of W */
const PCTX=[
 {u:"kr",lo:200,hi:2400,st:50,f:(lv,W,P,p)=>{const it=pick(SALE),cost=it.pl?"cost":"costs";
  return lv===0?[t3(`${cap(it.sv)} kostar ${W} kr. På rean får du ${PC(p)} rabatt.`,`${cap(it.en)} ${cost} ${W} kr. In the sale you get ${PC(p)} off.`,`سعر ${it.ar} ${W} كرونة، وفي التخفيضات تحصل على خصم ${PC(p)}.`),t3("Hur många kronor är rabatten?","How many kronor is the discount?","كم كرونة يبلغ الخصم؟")]
   :lv===1?[t3(`${cap(it.sv)} kostar ${W} kr. På rean får du ${P} kr rabatt.`,`${cap(it.en)} ${cost} ${W} kr. In the sale you get ${P} kr off.`,`سعر ${it.ar} ${W} كرونة، وفي التخفيضات تحصل على خصم ${P} كرونة.`),t3("Hur många procent är rabatten?","What percentage is the discount?","ما نسبة الخصم المئوية؟")]
   :[t3(`På rean får du ${PC(p)} rabatt på ${it.sv}. Rabatten är ${P} kr.`,`In the sale you get ${PC(p)} off ${it.en}. The discount is ${P} kr.`,`في التخفيضات تحصل على خصم ${PC(p)} على ${it.ar}، أي ${P} كرونة.`),t3(`Vad kostade ${it.sv} från början?`,`What did ${it.en} cost before the sale?`,`كم كان سعر ${it.ar} قبل التخفيضات؟`)]}},
 {u:"GB",lo:10,hi:100,st:5,f:(lv,W,P,p)=>lv===0?[t3(`Din surfpott är ${W} GB i månaden. Du har använt ${PC(p)} av den.`,`Your data plan is ${W} GB a month. You have used ${PC(p)} of it.`,`باقة الإنترنت في هاتفك ${W} GB شهريًا، واستهلكت ${PC(p)} منها.`),t3("Hur många GB har du använt?","How many GB have you used?","كم GB استهلكت؟")]
   :lv===1?[t3(`Din surfpott är ${W} GB i månaden. Du har använt ${P} GB.`,`Your data plan is ${W} GB a month. You have used ${P} GB.`,`باقة الإنترنت في هاتفك ${W} GB شهريًا، واستهلكت ${P} GB.`),t3("Hur många procent av surfen har du använt?","What percentage of your data have you used?","ما النسبة المئوية التي استهلكتها من الباقة؟")]
   :[t3(`Du har använt ${P} GB. Det är ${PC(p)} av din surfpott.`,`You have used ${P} GB. That is ${PC(p)} of your data plan.`,`استهلكت ${P} GB، وهذا ${PC(p)} من باقة الإنترنت.`),t3("Hur många GB är surfpotten?","How many GB is your data plan?","كم GB حجم الباقة؟")]},
 {u:"kr",lo:1000,hi:9000,st:100,f:(lv,W,P,p)=>lv===0?[t3(`Du sparar till en mobil som kostar ${W} kr. Du har sparat ${PC(p)} av priset.`,`You are saving for a phone that costs ${W} kr. You have saved ${PC(p)} of the price.`,`تدّخر لشراء هاتف سعره ${W} كرونة، وقد ادّخرت ${PC(p)} من سعره.`),t3("Hur många kronor har du sparat?","How many kronor have you saved?","كم كرونة ادّخرت؟")]
   :lv===1?[t3(`Du sparar till en mobil som kostar ${W} kr. Du har sparat ${P} kr.`,`You are saving for a phone that costs ${W} kr. You have saved ${P} kr.`,`تدّخر لشراء هاتف سعره ${W} كرونة، وقد ادّخرت ${P} كرونة.`),t3("Hur många procent av priset har du sparat?","What percentage of the price have you saved?","ما النسبة المئوية التي ادّخرتها من السعر؟")]
   :[t3(`Du har sparat ${P} kr till en ny mobil. Det är ${PC(p)} av priset.`,`You have saved ${P} kr for a new phone. That is ${PC(p)} of the price.`,`ادّخرت ${P} كرونة لشراء هاتف جديد، وهذا ${PC(p)} من سعره.`),t3("Vad kostar mobilen?","How much does the phone cost?","كم سعر الهاتف؟")]},
 {u:"min",lo:40,hi:200,st:10,f:(lv,W,P,p)=>lv===0?[t3(`En spellista är ${W} minuter lång. Du har lyssnat på ${PC(p)} av den.`,`A playlist is ${W} minutes long. You have listened to ${PC(p)} of it.`,`مدة قائمة التشغيل ${W} دقيقة، واستمعت إلى ${PC(p)} منها.`),t3("Hur många minuter har du lyssnat?","How many minutes have you listened to?","كم دقيقة استمعت؟")]
   :lv===1?[t3(`En spellista är ${W} minuter lång. Du har lyssnat i ${P} minuter.`,`A playlist is ${W} minutes long. You have listened for ${P} minutes.`,`مدة قائمة التشغيل ${W} دقيقة، واستمعت ${P} دقيقة.`),t3("Hur många procent av listan har du lyssnat på?","What percentage of the playlist have you heard?","ما النسبة المئوية التي استمعت إليها من القائمة؟")]
   :[t3(`Du har lyssnat i ${P} minuter. Det är ${PC(p)} av spellistan.`,`You have listened for ${P} minutes. That is ${PC(p)} of the playlist.`,`استمعت ${P} دقيقة، وهذا ${PC(p)} من قائمة التشغيل.`),t3("Hur många minuter är spellistan?","How many minutes long is the playlist?","كم دقيقة مدة القائمة؟")]}];
const PSET=[15,20,25,30,35,40,45,50,55,60,65,70,75,80];
LESSONS.push({id:"pct7",subject:"math",grades:"7",kind:"wb",
 title:t3("Procent: delen, det hela och andelen","Percent: part, whole and percentage","النسبة المئوية: الجزء والكل والنسبة"),
 icon:ICON(`<defs><pattern id="p7h" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(40)"><line x1="2" y1="0" x2="2" y2="8" stroke="#2257c9" stroke-width="3" stroke-opacity=".5"/></pattern></defs>
  <rect x="30" y="70" width="160" height="40" fill="url(#p7h)"/><path d="M30 70H290V110H30ZM190 60V120M30 60V120M290 60V120" fill="none" stroke="#1d2433" stroke-width="3.5"/>
  ${ITX("?",190,52,30,"#e07b00")}${ITX("240 kr",290,52,24)}${ITX("60 %",190,146,28,"#d63b2f")}${ITX("100 %",290,146,24,"#d63b2f")}${ITX("%",95,52,40,"#d63b2f")}`),
 steps:PCT.steps,mount:wbMount(PCT),
 gen(level){const M=MUL(),D=DIVS();let C,W,p,P;
  /* labels above and below the bar must not collide: [left, middle, right] */
  const fits=(l,m,r,xp)=>xp-tw(m,30)/2-tw(l,30)/2-PB.x0>=14&&PB.x1-xp-tw(m,30)/2-tw(r,30)/2>=14;
  const am=(v,u)=>`${fmt(v)} ${u}`;
  do{C=pick(PCTX);W=C.lo+C.st*rint(0,(C.hi-C.lo)/C.st);p=pick(PSET);P=p*W/100}
  while(!Number.isInteger(P)||P<11||!fits("0",level===0?"?":am(P,C.u),level===2?"?":am(W,C.u),PB.x0+(PB.x1-PB.x0)*p/100)||!fits(PC(0),PC(p),PC(100),PB.x0+(PB.x1-PB.x0)*p/100));
  const [sit,qq]=C.f(level,fmt(W),fmt(P),p),u=C.u,lim=lang==="ar"?50:52,ss=L(sit).split(/(?<=[.،!?])\s+/),lines=ss.length>1&&ss.length<4&&ss.every(x=>x.length<=lim)?ss:bwrap(L(sit),lim);
  const head=[A.wipe(),...lines.map((s,i)=>A.tx(s,400,44+i*38,29)),A.tx(L(qq),400,44+lines.length*38+6,31,"b")];
  const amt=v=>`${fmt(v)} ${u}`,dp=DEC(p/100);
  if(level===0){const q=[...head,...pbar(p,"?",amt(W),PC(p))],sol=[A.tx(RULE.part(),400,340,28,"b"),A.tx(`${PC(p)} = ${dp}`,400,400,40)],hk=sol.length,s=`${dp} ${M} ${fmt(W)} = ${amt(P)}`,w=tw(s,46);
   sol.push(A.hl(400-w/2-16,422,w+32,64),A.tx(s,400,468,46,"g"));return{kind:"num",ans:P,show:amt(P),hk,q,sol}}
  if(level===1){const q=[...head,...pbar(p,amt(P),amt(W),"?")],sol=[A.tx(RULE.pct(),400,340,28,"b")],hk=sol.length,s=`${dp} = ${PC(p)}`,w=tw(s,46);
   sol.push(A.tx(`${fmt(P)} ${D} ${fmt(W)} = ${dp}`,400,400,40),A.hl(400-w/2-16,422,w+32,64),A.tx(s,400,468,46,"g"));return{kind:"num",ans:p,show:PC(p),hk,q,sol}}
  const q=[...head,...pbar(p,amt(P),"?",PC(p))],sol=[A.tx(TT(`Gå via ${PC(1)}`,`Go via ${PC(1)}`,`احسب ${PC(1)} أولًا`),400,340,28,"b")],hk=sol.length,
   s=`${PC(100)} = 100 ${M} ${DEC(W/100)} = ${amt(W)}`,w=tw(s,44);
  sol.push(A.tx(`${PC(1)} = ${fmt(P)} ${D} ${p} = ${DEC(W/100)} ${u}`,400,400,40),A.hl(400-w/2-16,422,w+32,64),A.tx(s,400,468,44,"g"));return{kind:"num",ans:W,show:amt(W),hk,q,sol}}
});

/* =====================================================================
   3. alg7: algebraic expressions — write, simplify, substitute
   ===================================================================== */
const brace=(x1,x2,y)=>{const m=(x1+x2)/2;return`M${f1(x1)},${y}q0,10 10,10H${f1(m-10)}q10,0 10,10q0,-10 10,-10H${f1(x2-10)}q10,0 10,-10`};
/* a row of price boxes: {t:"box",s,c,lab} | {t:"op",s} | {t:"rep",s,c,lab} (three boxes, "…" and a brace) */
function boxes(parts,y){const bw=s=>Math.max(66,String(s).length*14+28),h=48,Wd=p=>p.t==="op"?34:p.t==="box"?bw(p.s):3*(bw(p.s)+8)+30;
 const tot=parts.reduce((a,p)=>a+Wd(p),0)+16*(parts.length-1);let x=400-tot/2;const o=[];
 parts.forEach(p=>{const w=Wd(p);
  if(p.t==="op")o.push(A.tx(p.s,x+w/2,y+h/2+14,42));
  else if(p.t==="box"){o.push(A.p(R.rect(x,y,w,h,.3),p.c,4),A.tx(p.s,x+w/2,y+h/2+10,28,p.c));if(p.lab)o.push(A.tx(p.lab,x+w/2,y+h+50,28,p.c))}
  else{const b=bw(p.s);let d="";for(let i=0;i<3;i++)d+=R.rect(x+i*(b+8),y,b,h,.3);
   o.push(A.p(d,p.c,4),...[0,1,2].map(i=>A.tx(p.s,x+i*(b+8)+b/2,y+h/2+10,28,p.c)),A.tx("…",x+3*(b+8)+12,y+h/2+12,34,p.c),A.p(brace(x,x+w,y+h+8),p.c,3),A.tx(p.lab,x+w/2,y+h+56,32,p.c))}
  x+=w+16});return o}
const pizzaT=(cx,cy)=>R.circ(cx,cy,19);
const canT=(cx,cy)=>R.rect(cx-12,cy-21,24,42,.2)+R.line(cx-12,cy-13,cx+12,cy-13,.1);
const termStr=(k,v,first)=>{const a=Math.abs(k),s=v?(a===1?v:`${a}${v}`):String(a);return first?(k<0?"−"+s:s):(k<0?`− ${s}`:`+ ${s}`)};
const AL7={steps:[
 {say:t3("En streamingtjänst kostar 49 kr i startavgift och sedan 89 kr per månad. Efter x månader har du betalat 49 + 89x kronor. 89x betyder 89 · x.",
   "A streaming service costs 49 kr to sign up and then 89 kr a month. After x months you have paid 49 + 89x kronor. 89x means 89 × x.",
   `تكلّف خدمة البث 49 كرونة رسوم اشتراك، ثم 89 كرونة كل شهر. بعد x من الأشهر تكون قد دفعت ${LR("49 + 89x")} كرونة. و${LR("89x")} تعني ${LR("89 × x")}.`),
  draw:()=>[A.wipe(),...boxes([{t:"box",s:"49 kr",c:"o",lab:TT("startavgift","sign-up fee","رسوم الاشتراك")},{t:"op",s:"+"},{t:"rep",s:"89 kr",c:"b",lab:TT("x månader","x months","x من الأشهر")}],80),
   A.tx(`49 + 89 ${MUL()} x`,400,300,52),A.hl(250,340,300,72),A.tx("49 + 89x",400,392,60,"g"),A.tx(`89x = 89 ${MUL()} x`,400,465,34,"b")]},
 {say:t3("Vad har du betalat efter 6 månader? Sätt in x = 6: 49 + 89 · 6 = 49 + 534 = 583 kr. Multiplikation först!",
   "What have you paid after 6 months? Substitute x = 6: 49 + 89 × 6 = 49 + 534 = 583 kr. Multiplication first!",
   `كم دفعت بعد 6 أشهر؟ نعوّض ${LR("x = 6")}: ${LR("49 + 89 × 6 = 49 + 534 = 583")} كرونة. الضرب أولًا!`),
  draw:()=>[A.wipe(),A.tx("49 + 89x",330,80,54),A.tx("x = 6",590,80,46,"o"),A.loop(590,64,72,36,"o"),
   A.tx(`49 + 89 ${MUL()} 6`,400,190,50),A.tx("= 49 + 534",400,280,50),A.hl(270,318,260,70),A.tx("= 583 kr",400,370,54,"g"),
   A.tx(TT("Multiplikation före addition","Multiplication before addition","الضرب قبل الجمع"),400,455,32,"b")]},
 {say:t3("Bara termer av samma sort kan läggas ihop. Om x är priset för en pizza och y för en läsk, då är 3x + 2y + 4x + y = 7x + 3y.",
   "Only like terms can be added together. If x is the price of a pizza and y the price of a soda, then 3x + 2y + 4x + y = 7x + 3y.",
   `نجمع الحدود المتشابهة فقط. إذا كان x سعر البيتزا وy سعر المشروب الغازي، فإن ${LR("3x + 2y + 4x + y = 7x + 3y")}.`),
  draw:()=>{const r=row([["t","3x","b"],["t","+"],["t","2y","o"],["t","+"],["t","4x","b"],["t","+"],["t","y","o"]],400,48,50),G=[[3,"x"],[2,"y"],[4,"x"],[1,"y"]],pw=46,cw=34,gap=50;
   const wid=G.reduce((a,[n,t])=>a+n*(t==="x"?pw:cw),0)+gap*3;let x=400-wid/2,dx="",dy="";const plus=[];
   G.forEach(([n,t],i)=>{for(let j=0;j<n;j++){if(t==="x"){dx+=pizzaT(x+pw/2,140);x+=pw}else{dy+=canT(x+cw/2,140);x+=cw}}if(i<3){plus.push(x+gap/2);x+=gap}});
   const w2=7*pw+60+3*cw;let x2=400-w2/2,sx="",sy="";for(let j=0;j<7;j++)sx+=pizzaT(x2+pw*(j+.5),250);const cx2=x2+7*pw+60;for(let j=0;j<3;j++)sy+=canT(cx2+cw*(j+.5),250);
   return[A.wipe(),...r.all,A.p(dx,"b",3.5),A.p(dy,"o",3.5),...plus.map(px=>A.tx("+",px,152,36)),A.arrow(400,182,400,214,"k"),
    A.p(sx,"b",3.5),A.p(sy,"o",3.5),A.tx("+",x2+7*pw+30,262,36),A.tx("7x",x2+7*pw/2,326,44,"b"),A.tx("3y",cx2+1.5*cw,326,44,"o"),
    A.tx(TT("x = en pizza","x = a pizza","x = بيتزا"),250,386,30,"b"),A.tx(TT("y = en läsk","y = a soda","y = مشروب غازي"),550,386,30,"o"),
    A.hl(170,422,460,64),A.tx("3x + 2y + 4x + y = 7x + 3y",400,468,42,"g")]}},
 {say:t3("Tecknet framför en term hör till termen. 5a och −2a ger 3a. 8 och −3 ger 5. Uttrycket blir 3a + 5.",
   "The sign in front of a term belongs to that term. 5a and −2a make 3a. 8 and −3 make 5. The expression becomes 3a + 5.",
   `الإشارة التي أمام الحد جزء منه. ${LR("5a")} و${LR("−2a")} تعطيان ${LR("3a")}، و8 و${LR("−3")} تعطيان 5. فيصبح المقدار ${LR("3a + 5")}.`),
  draw:()=>{const s=60,y=160,r=row([["t","5a","b"],["t","+ 8","o"],["t","− 2a","b"],["t","− 3","o"]],400,y,s),lp=i=>A.p(R.line(r.pos[i]-r.ws[i]/2,y+s*.36+16,r.pos[i]+r.ws[i]/2,y+s*.36+16,.2),i%2?"o":"b",5);
   const r2=row([["t","="],["t","5a − 2a","b"],["t","+ 8 − 3","o"]],400,280,52),r3=row([["t","="],["t","3a","b"],["t","+ 5","o"]],400,385,56);
   return[A.wipe(),A.tx(TT("Förenkla","Simplify","بسّط"),400,56,40),...r.all,lp(0),lp(1),lp(2),lp(3),...r2.all,hlR(r3.l,r3.r,385,56),...r3.all,
    A.tx(TT("Tecknet följer med termen.","The sign goes with the term.","الإشارة تنتقل مع الحد."),400,470,32,"k")]}},
 {say:t3("Omkretsen av en rektangel är O = 2a + 2b. En fotbollsplan är 105 m lång och 68 m bred. O = 2 · 105 + 2 · 68 = 210 + 136 = 346 m.",
   "The perimeter of a rectangle is P = 2a + 2b. A football pitch is 105 m long and 68 m wide. P = 2 × 105 + 2 × 68 = 210 + 136 = 346 m.",
   `محيط المستطيل ${LR("P = 2a + 2b")}. طول ملعب كرة القدم 105 م وعرضه 68 م. ${LR("P = 2 × 105 + 2 × 68 = 210 + 136 = 346")} م.`),
  draw:()=>{const M=MUL(),O=lang==="sv"?"O":"P",x=80,y=115,w=290,h=188;
   return[A.wipe(),A.tx(TT("Omkretsen av en fotbollsplan","The perimeter of a football pitch","محيط ملعب كرة القدم"),400,56,38),
    A.p(R.rect(x,y,w,h,.4)+R.line(x+w/2,y,x+w/2,y+h,.3)+R.circ(x+w/2,y+h/2,30)+R.rect(x,y+h/2-45,40,90,.2)+R.rect(x+w-40,y+h/2-45,40,90,.2),"g",4),
    A.tx("a",x+w/2,y+h+40,38,"o"),A.tx("b",x-26,y+h/2+12,38,"o"),A.tx("a = 105 m,   b = 68 m",x+w/2,y+h+110,32,"o"),
    A.tx(`${O} = 2a + 2b`,590,150,46),A.tx(`2 ${M} 105 + 2 ${M} 68`,590,240,40),A.tx("= 210 + 136",590,320,40),A.hl(480,358,220,66),A.tx("= 346 m",590,406,48,"g")]}}
]};
const SIMV=["x","a","y","n"];
LESSONS.push({id:"alg7",subject:"math",grades:"7",kind:"wb",
 title:t3("Algebraiska uttryck","Algebraic expressions","المقادير الجبرية"),
 icon:ICON(`<circle cx="60" cy="62" r="18" fill="none" stroke="#2257c9" stroke-width="3.5"/><circle cx="104" cy="62" r="18" fill="none" stroke="#2257c9" stroke-width="3.5"/><rect x="142" y="42" width="22" height="40" fill="none" stroke="#e07b00" stroke-width="3.5"/><circle cx="210" cy="62" r="18" fill="none" stroke="#2257c9" stroke-width="3.5"/><rect x="248" y="42" width="22" height="40" fill="none" stroke="#e07b00" stroke-width="3.5"/>
  ${ITX("2x + y + x + y",160,128,32)}${ITX("= 3x + 2y",160,166,32,"#1e9e5a")}`),
 steps:AL7.steps,mount:wbMount(AL7),
 gen(level){const M=MUL();
  if(level===0){const T=rint(0,3);let sit,qq,parts,pieces,ok,bad;
   if(T===0){const P=pick([85,95,120,149,180,250]),F=pick([25,29,35,49,59]);
    sit=t3(`Du köper x biljetter till en konsert. Varje biljett kostar ${P} kr och avgiften är ${F} kr.`,`You buy x tickets for a concert. Each ticket costs ${P} kr and the booking fee is ${F} kr.`,`تشتري x تذكرة لحفل موسيقي. سعر التذكرة ${P} كرونة، ورسوم الحجز ${F} كرونة.`);
    qq=t3("Vilket uttryck visar hela kostnaden?","Which expression shows the total cost?","أي مقدار يمثّل التكلفة الكلية؟");
    parts=[{t:"rep",s:`${P} kr`,c:"b",lab:"x"},{t:"op",s:"+"},{t:"box",s:`${F} kr`,c:"o"}];pieces=[[`${P} ${M} x`,"b"],["+"],[`${F}`,"o"]];
    ok=`${P}x + ${F}`;bad=[`${F}x + ${P}`,`${P+F}x`,`${P} + ${F} + x`]}
   else if(T===1){const P=pick([20,25,30,40,45]),F=pick([99,149,199,249]);
    sit=t3(`Ett gym kostar ${F} kr i månaden plus ${P} kr per pass. Du tränar x pass på en månad.`,`A gym costs ${F} kr a month plus ${P} kr per session. You train x sessions in a month.`,`اشتراك النادي الرياضي ${F} كرونة شهريًا، إضافة إلى ${P} كرونة لكل حصة. تتدرّب x حصة في الشهر.`);
    qq=t3("Vilket uttryck visar vad en månad kostar?","Which expression shows the cost of one month?","أي مقدار يمثّل تكلفة الشهر؟");
    parts=[{t:"box",s:`${F} kr`,c:"o"},{t:"op",s:"+"},{t:"rep",s:`${P} kr`,c:"b",lab:"x"}];pieces=[[`${F}`,"o"],["+"],[`${P} ${M} x`,"b"]];
    ok=`${F} + ${P}x`;bad=[`${F}x + ${P}`,`${F+P}x`,`${F} + ${P} + x`]}
   else if(T===2){const P=pick([79,99,129,149,199]),S=pick([300,400,500,600,800,1000]);
    sit=t3(`Du har ${fmt(S)} kr på ditt presentkort. Du köper x spel som kostar ${P} kr styck.`,`You have ${fmt(S)} kr on your gift card. You buy x games that cost ${P} kr each.`,`في بطاقة الهدايا ${fmt(S)} كرونة. تشتري x لعبة، سعر الواحدة ${P} كرونة.`);
    qq=t3("Vilket uttryck visar hur mycket du har kvar?","Which expression shows how much you have left?","أي مقدار يمثّل المبلغ المتبقّي؟");
    parts=[{t:"box",s:`${fmt(S)} kr`,c:"o"},{t:"op",s:"−"},{t:"rep",s:`${P} kr`,c:"b",lab:"x"}];pieces=[[`${fmt(S)}`,"o"],["−"],[`${P} ${M} x`,"b"]];
    ok=`${fmt(S)} − ${P}x`;bad=[`${P}x − ${fmt(S)}`,`${fmt(S-P)}x`,`${fmt(S)} − ${P} − x`]}
   else{sit=t3("I en liga får laget 3 poäng för vinst och 1 poäng för oavgjort. Laget har x vinster och y oavgjorda matcher.","In a league a team gets 3 points for a win and 1 point for a draw. The team has x wins and y draws.","في الدوري يحصل الفريق على 3 نقاط للفوز ونقطة واحدة للتعادل. فاز الفريق x مرة وتعادل y مرة.");
    qq=t3("Vilket uttryck visar lagets poäng?","Which expression shows the team's points?","أي مقدار يمثّل نقاط الفريق؟");
    parts=[{t:"rep",s:"3",c:"b",lab:"x"},{t:"op",s:"+"},{t:"rep",s:"1",c:"o",lab:"y"}];pieces=[[`3 ${M} x`,"b"],["+"],[`1 ${M} y`,"o"]];
    ok="3x + y";bad=["x + 3y","3xy","3 + x + y"]}
   const lines=bwrap(L(sit),lang==="ar"?50:52),opts=shuffle([ok,...bad]),r=row(pieces.map(p=>["t",p[0],p[1]||"k"]),400,384,44);
   const q=[A.wipe(),...lines.map((s,i)=>A.tx(s,400,46+i*38,29)),A.tx(L(qq),400,46+lines.length*38+8,31,"b"),...boxes(parts,196)];
   const xi=pieces.findIndex(p=>p[1]==="b"),sol=[...r.parts[xi]],hk=sol.length,w=tw(ok,52);r.parts.forEach((p,i)=>{if(i!==xi)sol.push(...p)});sol.push(A.hl(400-w/2-18,420,w+36,68),A.tx(ok,400,470,52,"g"));
   return{kind:"choice",opts,ans:opts.indexOf(ok),show:ok,hk,q,sol}}
  if(level===1){const v=pick(SIMV);let a,c,b,d;do{a=rint(2,9);c=pick([-1,1])*rint(1,8);b=rint(1,15);d=pick([-1,1])*rint(1,12)}while(a+c<2||b+d<1||(c>0&&d>0)||a+c>15);
   const T=[{k:a,v},{k:c,v},{k:b,v:""},{k:d,v:""}],first=pick([0,2]),rest=shuffle([0,1,2,3].filter(i=>i!==first)),ord=[first,...rest];
   const r=row(ord.map((i,j)=>["t",termStr(T[i].k,T[i].v,j===0),T[i].v?"b":"o"]),400,180,62),A1=a+c,B1=b+d;
   const q=[A.wipe(),A.tx(TT("Förenkla uttrycket","Simplify the expression","بسّط المقدار"),400,66,40),...r.all,A.tx(`= □${v} + □`,400,290,48,"k")];
   const vt=`${termStr(a,v,true)} ${termStr(c,v,false)}`,ct=`${termStr(b,"",false)} ${termStr(d,"",false)}`,r2=row([["t","="],["t",vt,"b"],["t",ct,"o"]],400,375,46),r3=row([["t","="],["t",termStr(A1,v,true),"b"],["t",`+ ${B1}`,"o"]],400,458,50);
   const sol=[...ord.map((i,j)=>A.p(R.line(r.pos[j]-r.ws[j]/2,218,r.pos[j]+r.ws[j]/2,218,.2),T[i].v?"b":"o",5)),...r2.all],hk=sol.length;sol.push(hlR(r3.l,r3.r,458,50,16),...r3.all);
   return{kind:"pair",ans:[A1,B1],sep:`${v} +`,show:`${A1}${v} + ${B1}`,hk,q,sol}}
  const F=rint(0,2);let expr,vals,sub,mid,ans;
  if(F===0){const a=rint(2,9),k=rint(1,6),b=rint(1,30);expr=`${a}x + ${b}`;vals=`x = −${k}`;sub=`${a} ${M} (−${k}) + ${b}`;mid=`−${a*k} + ${b}`;ans=b-a*k}
  else if(F===1){const b=rint(5,40),a=rint(2,9),k=rint(1,6);expr=`${b} − ${a}x`;vals=`x = −${k}`;sub=`${b} − ${a} ${M} (−${k})`;mid=`${b} + ${a*k}`;ans=b+a*k}
  else{const a=rint(2,6),b=rint(2,6),x=rint(1,8),k=rint(1,6);expr=`${a}x − ${b}y`;vals=`x = ${x},  y = −${k}`;sub=`${a} ${M} ${x} − ${b} ${M} (−${k})`;mid=`${a*x} + ${b*k}`;ans=a*x+b*k}
  const fin=`= ${mid} = ${MN(ans)}`,w=tw(fin,50);
  const q=[A.wipe(),A.tx(TT("Beräkna uttryckets värde","Find the value of the expression","احسب قيمة المقدار"),400,66,40),A.tx(expr,400,180,70),A.tx(vals,400,272,44,"o"),A.loop(400,256,tw(vals,44)/2+24,36,"o")];
  const sol=[A.tx(`= ${sub}`,400,370,46)],hk=sol.length;sol.push(A.hl(400-w/2-16,410,w+32,66),A.tx(fin,400,458,50,"g"));
  return{kind:"num",ans,signed:true,show:MN(ans),hk,q,sol}}
});

/* =====================================================================
   4. eq7: equations with x on both sides
   ===================================================================== */
const BL=210,BR=590,PB7=304;
const scale7=()=>[A.p(`M60,300Q${BL},334 360,300M440,300Q${BR},334 740,300`,"k",5),
 A.p(R.line(BL,317,BL,342,.2)+R.line(BR,317,BR,342,.2)+R.line(BL,342,BR,342,.3)+`M400,342L366,416L434,416Z`+R.line(320,418,480,418,.3),"k",4.5)];
const sackD=(cx,by)=>`M${cx-17},${by-58}Q${cx-42},${by-34} ${cx-30},${by-6}Q${cx},${by+4} ${cx+30},${by-6}Q${cx+42},${by-34} ${cx+17},${by-58}Z`+`M${cx-17},${by-58}L${cx-24},${by-70}M${cx+17},${by-58}L${cx+24},${by-70}M${cx-19},${by-60}H${cx+19}`;
/* k bags and m blocks centred on a pan; returns {o, B: bag centres, C: block centres} */
function pan7(cx,k,m,cols){const bw=70,cw=34,wid=k*bw+(k&&m?8:0)+(m?Math.min(m,cols)*cw-4:0);let x=cx-wid/2;const o=[],B=[],C=[];
 for(let i=0;i<k;i++){const bx=x+bw/2;o.push(A.p(sackD(bx,PB7),"b",4),A.tx("x",bx,PB7-16,36,"b"));B.push([bx,PB7-32]);x+=bw}if(k&&m)x+=8;
 if(m){let d="";for(let j=0;j<m;j++){const r=Math.floor(j/cols),X=x+(j%cols)*cw,Y=PB7-(r+1)*cw;d+=R.rect(X,Y,30,30,.2);C.push([X+15,Y+15])}o.push(A.p(d,"g",3.5))}return{o,B,C}}
const xBags=B=>A.p(B.map(([x,y])=>R.line(x-28,y+30,x+28,y-30,.2)).join(""),"r",5);
const xBlocks=C=>A.p(C.map(([x,y])=>R.line(x-16,y+16,x+16,y-16,.2)).join(""),"r",4.5);
const cx=(k,v="x")=>k===1?v:`${k}${v}`;
const EQX=330;
const eqR=(l,r,y,size=46,c="k")=>[A.tx(l,EQX-14,y,size,c,"end"),A.tx(`= ${r}`,EQX,y,size,c,"start")];
const ann=(op,y)=>[A.p(R.line(582,y-38,582,y+8,.2),"r",3.5),A.tx(op,598,y,40,"r","start")];
/* equation lines; each line: [left,right,annotation for the step to the next line]; returns one action list per line */
const eqLinesX=(L1,y0,gap,size)=>L1.map(([l,r,a],i)=>{const last=i===L1.length-1,o=eqR(l,r,y0+i*gap,size,last?"g":"k");if(a)o.push(...ann(a,y0+i*gap));
 if(last){const w=tw(`${l} = ${r}`,size);o.unshift(A.hl(EQX-14-tw(l,size)-14,y0+i*gap-size*.95,w+42,size*1.9))}return o});
const EQ7={steps:[
 {say:t3("Nu finns x på båda sidor. Vågen väger lika: tre påsar och 2 klossar väger lika mycket som en påse och 8 klossar. 3x + 2 = x + 8.",
   "Now there is x on both sides. The scales balance: three bags and 2 blocks weigh the same as one bag and 8 blocks. 3x + 2 = x + 8.",
   `الآن يوجد x في الطرفين. الميزان متوازن: ثلاثة أكياس ومكعبان تزن مثل كيس واحد و8 مكعبات. ${LR("3x + 2 = x + 8")}.`),
  draw:()=>[A.wipe(),A.tx("3x + 2 = x + 8",400,70,56),...scale7(),...pan7(BL,3,2,2).o,...pan7(BR,1,8,4).o]},
 {say:t3("Ta bort en påse från varje sida. Vågen är fortfarande i balans: 2x + 2 = 8.",
   "Take one bag off each side. The scales still balance: 2x + 2 = 8.",
   `نزيل كيسًا واحدًا من كل كفّة، فيبقى الميزان متوازنًا: ${LR("2x + 2 = 8")}.`),
  draw:()=>[xBags(pan7(BL,3,2,2).B.slice(2)),xBags(pan7(BR,1,8,4).B),A.tx("− x",BL,128,40,"r"),A.tx("− x",BR,128,40,"r"),A.tx("2x + 2 = 8",190,470,44)]},
 {say:t3("Ta bort 2 klossar från varje sida: 2x = 6. Två påsar väger som 6 klossar, så en påse väger som 3. x = 3.",
   "Take 2 blocks off each side: 2x = 6. Two bags weigh the same as 6 blocks, so one bag weighs the same as 3. x = 3.",
   `نزيل مكعبين من كل كفّة: ${LR("2x = 6")}. كيسان يزنان مثل 6 مكعبات، إذن الكيس الواحد يزن مثل 3. ${LR("x = 3")}.`),
  draw:()=>[xBlocks(pan7(BL,3,2,2).C),xBlocks(pan7(BR,1,8,4).C.slice(6)),A.tx("− 2",BL,170,40,"r"),A.tx("− 2",BR,170,40,"r"),
   A.tx("2x = 6",560,470,44),A.hl(640,424,130,62),A.tx("x = 3",705,470,46,"g")]},
 {say:t3("Utan våg gör vi likadant. 5x − 4 = 2x + 11. Dra bort 2x från båda sidor, lägg till 4 och dela med 3. x = 5. Kontrollera: båda sidor blir 21.",
   "Without scales we do the same. 5x − 4 = 2x + 11. Subtract 2x from both sides, add 4 and divide by 3. x = 5. Check: both sides make 21.",
   `من دون ميزان نفعل الشيء نفسه. ${LR("5x − 4 = 2x + 11")}. نطرح ${LR("2x")} من الطرفين، ثم نضيف 4، ثم نقسم على 3. ${LR("x = 5")}. للتحقق: كل طرف يساوي 21.`),
  draw:()=>{const M=MUL(),D=DIVS(),Ls=eqLinesX([["5x − 4","2x + 11","− 2x"],["3x − 4","11","+ 4"],["3x","15",`${D} 3`],["x","5"]],125,78,48);
   return[A.wipe(),A.tx(TT("Samla x på ena sidan","Collect the x terms on one side","اجمع حدود x في طرف واحد"),400,52,36,"b"),...Ls.flat(),
    A.tx(`5 ${M} 5 − 4 = 21`,230,462,34,"b"),A.tx(`2 ${M} 5 + 11 = 21 ✓`,560,462,34,"b")]}},
 {say:t3("Spelhall A tar 60 kr i inträde och 15 kr per spel. Hall B tar 25 kr per spel. När kostar de lika? 60 + 15x = 25x. Dra bort 15x: 60 = 10x, så x = 6 spel.",
   "Arcade A charges 60 kr to get in and 15 kr per game. Arcade B charges 25 kr per game. When do they cost the same? 60 + 15x = 25x. Subtract 15x: 60 = 10x, so x = 6 games.",
   `صالة الألعاب A تأخذ 60 كرونة رسوم دخول و15 كرونة لكل لعبة. الصالة B تأخذ 25 كرونة لكل لعبة. متى تتساوى التكلفة؟ ${LR("60 + 15x = 25x")}. نطرح ${LR("15x")}: ${LR("60 = 10x")}، إذن ${LR("x = 6")} ألعاب.`),
  draw:()=>{const D=DIVS(),Ls=eqLinesX([["60 + 15x","25x","− 15x"],["60","10x",`${D} 10`],["x","6"]],255,72,46);
   return[A.wipe(),...card7(50,TT("Spelhall A","Arcade A","صالة الألعاب A"),[TT("60 kr i inträde","60 kr entry","رسوم الدخول: 60 كرونة"),TT("+ 15 kr per spel","+ 15 kr per game","و15 كرونة لكل لعبة")],"b"),
    ...card7(420,TT("Spelhall B","Arcade B","صالة الألعاب B"),[TT("25 kr per spel","25 kr per game","25 كرونة لكل لعبة"),TT("inget inträde","no entry fee","بلا رسوم دخول")],"o"),
    ...Ls.flat(),A.tx(TT("Efter 6 spel kostar det lika mycket.","After 6 games they cost the same.","بعد 6 ألعاب تتساوى التكلفة."),400,474,30,"b")]}}
]};
function card7(x,title,lines,c){return[A.p(R.rect(x,22,330,150,.3),c,4),A.tx(title,x+165,62,34,c),...lines.map((s,i)=>A.tx(s,x+165,104+i*40,29))]}
const ECTX=[
 ()=>{const p=pick([10,15,20,25]),dl=pick([5,10,15,20]),x=rint(3,12),F=dl*x,q=p+dl,D=DIVS();
  return{x,cards:[[TT("Spelhall A","Arcade A","صالة الألعاب A"),[TT(`${F} kr i inträde`,`${F} kr entry`,`رسوم الدخول: ${F} كرونة`),TT(`+ ${p} kr per spel`,`+ ${p} kr per game`,`و${p} كرونة لكل لعبة`)]],
    [TT("Spelhall B","Arcade B","صالة الألعاب B"),[TT(`${q} kr per spel`,`${q} kr per game`,`${q} كرونة لكل لعبة`),TT("inget inträde","no entry fee","بلا رسوم دخول")]]],
   qq:t3("Efter hur många spel kostar hallarna lika mycket?","After how many games do the arcades cost the same?","بعد كم لعبة تتساوى تكلفة الصالتين؟"),
   lines:[[`${F} + ${p}x`,`${q}x`,`− ${p}x`],[`${F}`,`${dl}x`,`${D} ${dl}`],["x",`${x}`]]}},
 ()=>{const p=pick([20,25,30,40,50]),dl=pick([10,20,25,30,50]),x=rint(3,12),S2=50*rint(1,8),S1=S2+dl*x,q=p+dl,D=DIVS();
  return{x,cards:[[TT("Ali","Ali","علي"),[TT(`har ${fmt(S1)} kr`,`has ${fmt(S1)} kr`,`معه ${fmt(S1)} كرونة`),TT(`sparar ${p} kr i veckan`,`saves ${p} kr a week`,`يدّخر ${p} كرونة أسبوعيًا`)]],
    [TT("Sara","Sara","سارة"),[TT(`har ${fmt(S2)} kr`,`has ${fmt(S2)} kr`,`معها ${fmt(S2)} كرونة`),TT(`sparar ${q} kr i veckan`,`saves ${q} kr a week`,`تدّخر ${q} كرونة أسبوعيًا`)]]],
   qq:t3("Efter hur många veckor har de lika mycket?","After how many weeks do they have the same amount?","بعد كم أسبوعًا يصبح معهما المبلغ نفسه؟"),
   lines:[[`${fmt(S1)} + ${p}x`,`${fmt(S2)} + ${q}x`,`− ${p}x`],[`${fmt(S1)}`,`${fmt(S2)} + ${dl}x`,`− ${fmt(S2)}`],[`${fmt(S1-S2)}`,`${dl}x`,`${D} ${dl}`],["x",`${x}`]]}},
 ()=>{const p2=rint(8,12),dl=rint(2,5),p1=p2+dl,x=rint(4,15),F1=5*rint(5,12),F2=F1+dl*x,D=DIVS();
  return{x,cards:[[TT("Taxi A","Taxi A","سيارة الأجرة A"),[TT(`${F1} kr i startavgift`,`${F1} kr starting fee`,`رسوم البدء: ${F1} كرونة`),TT(`+ ${p1} kr per km`,`+ ${p1} kr per km`,`و${p1} كرونة لكل كيلومتر`)]],
    [TT("Taxi B","Taxi B","سيارة الأجرة B"),[TT(`${F2} kr i startavgift`,`${F2} kr starting fee`,`رسوم البدء: ${F2} كرونة`),TT(`+ ${p2} kr per km`,`+ ${p2} kr per km`,`و${p2} كرونة لكل كيلومتر`)]]],
   qq:t3("Hur många km ska resan vara för att det ska kosta lika?","How many km must the ride be for both to cost the same?","كم كيلومترًا يجب أن تكون الرحلة لتتساوى التكلفة؟"),
   lines:[[`${F1} + ${p1}x`,`${F2} + ${p2}x`,`− ${p2}x`],[`${F1} + ${dl}x`,`${F2}`,`− ${F1}`],[`${dl}x`,`${F2-F1}`,`${D} ${dl}`],["x",`${x}`]]}}];
LESSONS.push({id:"eq7",subject:"math",grades:"7",kind:"wb",
 title:t3("Ekvationer med x på båda sidor","Equations with x on both sides","معادلات فيها x في الطرفين"),
 icon:ICON(`<path d="M30 110Q85 124 140 110M180 110Q235 124 290 110" stroke="#1d2433" stroke-width="3.5" fill="none"/><path d="M85 117V130M235 117V130M85 130H235M160 130L146 160H174Z" stroke="#1d2433" stroke-width="3" fill="none"/>
  ${[52,92].map(x=>`<path d="M${x-7} 72C${x-26} 80 ${x-24} 106 ${x-6} 108H${x+6}C${x+24} 106 ${x+26} 80 ${x+7} 72Z" fill="#2257c9" fill-opacity=".12" stroke="#2257c9" stroke-width="3"/>${ITX("x",x,100,24,"#2257c9")}`).join("")}
  <rect x="112" y="88" width="18" height="18" fill="none" stroke="#1e9e5a" stroke-width="2.5"/><path d="M203 72C184 80 186 106 204 108H216C234 106 236 80 217 72Z" fill="#2257c9" fill-opacity=".12" stroke="#2257c9" stroke-width="3"/>${ITX("x",210,100,24,"#2257c9")}
  ${[0,1,2,3].map(i=>`<rect x="${236+(i%2)*21}" y="${i<2?88:67}" width="18" height="18" fill="none" stroke="#1e9e5a" stroke-width="2.5"/>`).join("")}${ITX("2x + 1 = x + 4",160,42,32)}`),
 steps:EQ7.steps,mount:wbMount(EQ7),
 gen(level){const D=DIVS(),M=MUL();
  if(level===0){let a,c,x,b,d;do{a=rint(2,3);c=rint(1,a-1);x=rint(2,5);b=rint(0,4);d=(a-c)*x+b}while(d>15||d<1);
   const L1=pan7(BL,a,b,2),R1=pan7(BR,c,d,c===1?5:4),k=a-c,left=b?`${cx(a)} + ${b}`:cx(a);
   const q=[A.wipe(),A.tx(`${left} = ${cx(c)} + ${d}`,400,70,56),...scale7(),...L1.o,...R1.o];
   const sol=[xBags(L1.B.slice(a-c)),xBags(R1.B),A.tx(`− ${cx(c)}`,BL,120,40,"r"),A.tx(`− ${cx(c)}`,BR,120,40,"r")],hk=sol.length;
   if(b)sol.push(xBlocks(L1.C),xBlocks(R1.C.slice(d-b)),A.tx(`− ${b}`,BL,165,40,"r"),A.tx(`− ${b}`,BR,165,40,"r"));
   if(k>1)sol.push(A.tx(`${k}x = ${d-b}`,560,470,44));
   sol.push(A.hl(640,424,130,62),A.tx(`x = ${x}`,705,470,46,"g"));
   return{kind:"num",ans:x,show:`x = ${x}`,hk,q,sol}}
  if(level===1){let a,c,x,b,sb,d,k;do{c=rint(1,6);k=rint(1,5);a=c+k;x=rint(2,12);b=rint(1,20);sb=pick([1,-1]);d=k*x+sb*b}while(d<1||d>60||(k===1&&sb===1&&b<3));
   const lhs=`${cx(a)} ${sb>0?"+":"−"} ${b}`,rhs=`${cx(c)} + ${d}`,swap=Math.random()<.4,kx=cx(k),op1=`− ${cx(c)}`,op2=sb>0?`− ${b}`:`+ ${b}`;
   const st=swap?[[rhs,lhs,op1],[`${d}`,`${kx} ${sb>0?"+":"−"} ${b}`,op2],[`${k*x}`,kx,k>1?`${D} ${k}`:null]]:[[lhs,rhs,op1],[`${kx} ${sb>0?"+":"−"} ${b}`,`${d}`,op2],[kx,`${k*x}`,k>1?`${D} ${k}`:null]];
   if(k>1)st.push(["x",`${x}`]);else st[st.length-1]=["x",`${x}`];
   const Ls=eqLinesX(st,150,76,46),val=a*x+sb*b,q=[A.wipe(),A.tx(TT("Lös ekvationen","Solve the equation","حلّ المعادلة"),400,62,38),...eqR(st[0][0],st[0][1],150,46)];
   const sol=[...Ls[0].slice(2),...Ls[1]],hk=sol.length;Ls.slice(2).forEach(l=>sol.push(...l));
   const yc=150+st.length*76+(st.length<4?10:-2);
   sol.push(A.tx(`${a} ${M} ${x} ${sb>0?"+":"−"} ${b} = ${val}`,swap?560:230,yc,32,"b"),A.tx(`${c===1?x:`${c} ${M} ${x}`} + ${d} = ${val} ✓`,swap?230:560,yc,32,"b"));
   return{kind:"num",ans:x,show:`x = ${x}`,hk,q,sol}}
  const T=pick(ECTX)(),cl=["b","o"];
  const q=[A.wipe(),...T.cards.flatMap((cd,i)=>card7(i?420:50,cd[0],cd[1],cl[i])),A.tx(L(T.qq),400,214,31,"k")];
  const gap=T.lines.length>3?58:68,Ls=eqLinesX(T.lines,276,gap,42),sol=[...Ls[0]],hk=sol.length;Ls.slice(1).forEach(l=>sol.push(...l));
  return{kind:"num",ans:T.x,show:String(T.x),hk,q,sol}}
});

/* =====================================================================
   HELP (simpler, everyday pictures) and HINTS (method, never the answer)
   ===================================================================== */
const pizzaD=(cx,cy,r,n)=>{let d=R.circ(cx,cy,r);for(let i=0;i<n;i++){const a=(-90+360*i/n)*Math.PI/180;d+=R.line(cx,cy,cx+r*Math.cos(a),cy+r*Math.sin(a),.3)}return d};
const sect=(cx,cy,r,a1,a2)=>{const p=a=>[cx+r*Math.cos((a-90)*Math.PI/180),cy+r*Math.sin((a-90)*Math.PI/180)],[x1,y1]=p(a1),[x2,y2]=p(a2);return`M${cx},${cy}L${f1(x1)},${f1(y1)}A${r},${r} 0 ${a2-a1>180?1:0} 1 ${f1(x2)},${f1(y2)}Z`};
const env=(x,y,w=74,h=50)=>R.rect(x,y,w,h,.2)+`M${x},${y}L${x+w/2},${y+h*.55}L${x+w},${y}`;
const apple=(cx,cy)=>R.circ(cx,cy,17)+R.line(cx,cy-17,cx+4,cy-28,.1);
const banana=(cx,cy)=>`M${cx-24},${cy-10}Q${cx},${cy+26} ${cx+24},${cy-10}Q${cx},${cy+8} ${cx-24},${cy-10}Z`;
Object.assign(HELPX,{
 frac7:[{say:t3("Du har en halv pizza och äter hälften av den. Då har du ätit en fjärdedel av hela pizzan. 1/2 · 1/2 = 1/4.",
   "You have half a pizza and eat half of it. Then you have eaten a quarter of the whole pizza. 1/2 × 1/2 = 1/4.",
   `معك نصف بيتزا وأكلت نصفه، فتكون قد أكلت ربع البيتزا كلها. ${LR("1/2 × 1/2 = 1/4")}.`),
  draw:()=>{const r=row([["f",1,2,"r"],["t",MUL()],["f",1,2,"b"],["t","="],["f",1,4,"g"]],400,420,52);return[A.p(pizzaD(220,200,120,2),"k",4),A.hatch(sect(220,200,120,0,180),"b"),
   A.arrow(370,200,440,200,"k"),A.p(pizzaD(590,200,120,4),"k",4),A.hatch(sect(590,200,120,0,180),"b"),A.hatch(sect(590,200,120,0,90),"r"),A.tx(TT("halv pizza","half a pizza","نصف بيتزا"),220,52,32,"b"),A.tx(TT("hälften av den","half of it","نصفه"),590,52,32,"r"),...r.all]}},
  {say:t3("Hur många halvor finns det i 3 pizzor? Varje pizza har 2 halvor, så 3 · 2 = 6. Alltså är 3 delat med 1/2 = 6.",
   "How many halves are there in 3 pizzas? Each pizza has 2 halves, so 3 × 2 = 6. So 3 ÷ 1/2 = 6.",
   `كم نصفًا في 3 بيتزا؟ في كل بيتزا نصفان، إذن ${LR("3 × 2 = 6")}. أي إن ${LR("3 ÷ 1/2 = 6")}.`),
  draw:()=>{const r=row([["t","3"],["t",DIVS()],["f",1,2],["t","="],["t","3"],["t",MUL()],["t","2"],["t","="],["t","6","g"]],400,420,52),X=[160,400,640];
   return[...X.map(x=>A.p(pizzaD(x,190,100,2),"k",4)),...X.flatMap((x,i)=>[qt(2*i+1,x-50,202,40,"o"),qt(2*i+2,x+50,202,40,"o")]),...r.all]}}],
 pct7:[{say:t3("Dela 250 kr i 10 lika delar. Varje del är 10 % och värd 25 kr. 30 % är tre delar: 3 · 25 = 75 kr.",
   "Split 250 kr into 10 equal parts. Each part is 10% and worth 25 kr. 30% is three parts: 3 × 25 = 75 kr.",
   `نقسم 250 كرونة إلى 10 أجزاء متساوية. كل جزء 10% ويساوي 25 كرونة. و30% ثلاثة أجزاء: ${LR("3 × 25 = 75")} كرونة.`),
  draw:()=>[A.p(R.bar(100,150,600,70,10),"k",3.5),A.hatch(box(100,150,180,70),"b"),...[...Array(10)].map((_,i)=>qt("25",130+i*60,196,26,i<3?"b":"k")),
   A.tx("250 kr",400,120,36),...[...Array(10)].map((_,i)=>qt(PC(10),130+i*60,262,22,"r")),A.hl(220,330,360,72),A.tx(`${PC(30)} = 3 ${MUL()} 25 = 75 kr`,400,380,48,"g")]},
  {say:t3("Åt andra hållet: om 10 % är 25 kr, då är det hela 10 sådana delar. 10 · 25 = 250 kr.",
   "The other way round: if 10% is 25 kr, the whole is 10 such parts. 10 × 25 = 250 kr.",
   `وبالعكس: إذا كانت 10% تساوي 25 كرونة، فالكل 10 أجزاء مثلها: ${LR("10 × 25 = 250")} كرونة.`),
  draw:()=>[A.p(R.bar(100,150,600,70,10),"k",3.5),A.hatch(box(100,150,60,70),"o"),qt("25",130,196,26,"o"),A.tx(`${PC(10)} = 25 kr`,130,120,30,"o"),
   A.p(`M100,240q0,12 12,12H388q12,0 12,12q0,-12 12,-12H688q12,0 12,-12`,"b",3),A.tx(`${PC(100)} = ?`,400,310,36,"b"),A.hl(220,350,360,72),A.tx(`10 ${MUL()} 25 = 250 kr`,400,400,48,"g")]}],
 alg7:[{say:t3("Sortera frukten! 3 äpplen, 2 bananer och 1 äpple till blir 4 äpplen och 2 bananer. Med bokstäver: 3a + 2b + a = 4a + 2b.",
   "Sort the fruit! 3 apples, 2 bananas and 1 more apple make 4 apples and 2 bananas. With letters: 3a + 2b + a = 4a + 2b.",
   `رتّب الفاكهة! 3 تفاحات وموزتان وتفاحة أخرى تساوي 4 تفاحات وموزتين. بالحروف: ${LR("3a + 2b + a = 4a + 2b")}.`),
  draw:()=>{const top=[[1,150],[1,195],[1,240],[0,320],[0,380],[1,460]],bot=[[1,170],[1,215],[1,260],[1,305],[0,470],[0,530]];
   return[A.p(top.filter(t=>t[0]).map(([,x])=>apple(x,120)).join(""),"r",4),A.p(top.filter(t=>!t[0]).map(([,x])=>banana(x,120)).join(""),"o",4),A.tx("+",280,132,40),A.tx("+",420,132,40),
    A.tx("3a + 2b + a",620,134,44),A.arrow(400,170,400,215,"k"),
    A.p(bot.filter(t=>t[0]).map(([,x])=>apple(x,265)).join(""),"r",4),A.p(bot.filter(t=>!t[0]).map(([,x])=>banana(x,265)).join(""),"o",4),A.tx("+",395,277,40),
    A.tx("4a",237,335,44,"r"),A.tx("2b",500,335,44,"o"),A.tx(TT("a = äpple, b = banan","a = apple, b = banana","a = تفاحة، b = موزة"),400,395,30,"k"),A.hl(230,420,340,64),A.tx("= 4a + 2b",400,468,48,"g")]}}],
 eq7:[{say:t3("Ali och Sara har lika mycket pengar. Ali har 3 kuvert och 20 kr. Sara har 1 kuvert och 60 kr. Alla kuvert har lika mycket i sig. Ta bort ett kuvert och 20 kr från var och en: 2 kuvert är 40 kr, så ett kuvert är 20 kr.",
   "Ali and Sara have the same amount of money. Ali has 3 envelopes and 20 kr. Sara has 1 envelope and 60 kr. All envelopes hold the same amount. Take one envelope and 20 kr away from each of them: 2 envelopes are 40 kr, so one envelope is 20 kr.",
   "مع علي وسارة المبلغ نفسه. مع علي 3 مظاريف و20 كرونة، ومع سارة مظروف واحد و60 كرونة. في كل مظروف المبلغ نفسه. نزيل مظروفًا و20 كرونة من كلٍّ منهما: مظروفان يساويان 40 كرونة، إذن المظروف الواحد 20 كرونة."),
  draw:()=>[A.tx(TT("Ali","Ali","علي"),200,50,36,"b"),A.tx(TT("Sara","Sara","سارة"),600,50,36,"o"),A.tx("=",400,140,60),
   A.p(env(70,90)+env(160,90)+env(250,90),"b",4),A.p(R.circ(200,190,26),"k",3.5),qt("20",200,199,26),
   A.p(env(480,90),"o",4),A.p(R.circ(600,190,26)+R.circ(660,190,26)+R.circ(720,190,26),"k",3.5),...[600,660,720].map(x=>qt("20",x,199,26)),
   A.p(R.line(250,145,324,85,.2)+R.line(480,145,554,85,.2),"r",5),A.p(R.line(570,215,630,165,.2),"r",5),A.p(R.line(172,215,228,165,.2),"r",5),
   A.tx(TT("2 kuvert = 40 kr","2 envelopes = 40 kr","مظروفان = 40 كرونة"),400,320,40),A.hl(230,360,340,70),A.tx(TT("1 kuvert = 20 kr","1 envelope = 20 kr","مظروف واحد = 20 كرونة"),400,410,46,"g")]}]
});
Object.assign(HINTSX,{
 frac7:[{say:t3("Multiplicera täljare med täljare och nämnare med nämnare.","Multiply numerator by numerator and denominator by denominator.","اضرب البسط في البسط، والمقام في المقام."),cut:g=>g.sol.slice(0,g.hk)},
  {say:t3("Hur många gånger ryms bråket i talet? Att dela med ett bråk är att multiplicera med det inverterade bråket.","How many times does the fraction fit into the number? Dividing by a fraction means multiplying by its reciprocal.","كم مرة يتّسع الكسر في العدد؟ القسمة على كسر هي الضرب في مقلوبه."),cut:g=>g.sol.slice(0,g.hk)},
  {say:t3("Vänd på det andra bråket och multiplicera. Förkorta svaret om det går.","Flip the second fraction and multiply. Simplify the answer if you can.","اقلب الكسر الثاني ثم اضرب، واختصر الناتج إن أمكن."),cut:g=>g.sol.slice(0,g.hk)}],
 pct7:[{say:t3("Skriv procenten i decimalform och multiplicera med det hela.","Write the percentage as a decimal and multiply by the whole.","اكتب النسبة المئوية عددًا عشريًا واضربها في الكل."),cut:g=>g.sol.slice(0,g.hk)},
  {say:t3("Dela delen med det hela. Skriv sedan svaret i procent.","Divide the part by the whole. Then write the answer as a percentage.","اقسم الجزء على الكل، ثم اكتب الناتج نسبةً مئوية."),cut:g=>g.sol.slice(0,g.hk)},
  {say:t3("Räkna ut hur mycket 1 % är. Gånger 100 ger det hela.","Work out what 1% is. Times 100 gives the whole.","احسب قيمة 1%، ثم اضربها في 100 لتحصل على الكل."),cut:g=>g.sol.slice(0,g.hk)}],
 alg7:[{say:t3("Det som upprepas x gånger skrivs som tal · x. Det som bara finns en gång skrivs som ett tal.","What is repeated x times is written as number × x. What happens only once is just a number.","ما يتكرّر x مرة نكتبه عددًا × x، وما يحدث مرة واحدة نكتبه عددًا فقط."),cut:g=>g.sol.slice(0,g.hk)},
  {say:t3("Samla termerna med bokstaven för sig och talen för sig. Tecknet framför en term följer med.","Put the letter terms together and the numbers together. The sign in front of each term goes with it.","اجمع الحدود التي فيها الحرف معًا، والأعداد معًا. الإشارة التي أمام الحد تنتقل معه."),cut:g=>g.sol.slice(0,g.hk)},
  {say:t3("Sätt in talet inom parentes där bokstaven står. Räkna multiplikationen först.","Put the number in brackets where the letter is. Do the multiplication first.","ضع العدد بين قوسين مكان الحرف، واحسب الضرب أولًا."),cut:g=>g.sol.slice(0,g.hk)}],
 eq7:[{say:t3("Ta bort lika många påsar från båda sidor.","Take the same number of bags off both sides.","أزل العدد نفسه من الأكياس من الكفّتين."),cut:g=>g.sol.slice(0,g.hk)},
  {say:t3("Dra bort den minsta x-termen från båda sidor. Sedan talet. Sist delar du.","Subtract the smaller x term from both sides. Then the number. Divide last.","اطرح حدّ x الأصغر من الطرفين، ثم العدد، ثم اقسم في النهاية."),cut:g=>g.sol.slice(0,g.hk)},
  {say:t3("Skriv ett uttryck med x för var och en och sätt dem lika med varandra.","Write an expression with x for each one and set them equal to each other.","اكتب مقدارًا فيه x لكل منهما، واجعل المقدارين متساويين."),cut:g=>g.sol.slice(0,g.hk)}]
});
}
