/* ===== y6b.js ===== */
/* =====================================================================
   YEAR 6 (y6b): fractions with different denominators, mixed numbers and
   fraction × whole number, percent / fraction / decimal, proportionality.
   Everything is inside one block so helper names cannot clash.
   ===================================================================== */
{
const gcd=(a,b)=>b?gcd(b,a%b):a, lcm=(a,b)=>a*b/gcd(a,b);
const pct=n=>lang==="sv"?`${n} %`:`${n}%`;
const LRI=s=>"⁦"+s+"⁩";            /* keeps maths in order inside Arabic speech */
const nm=x=>Number.isInteger(x)?fmt(x):dfmt(x,1);
const GRY="#5b6475";
/* ---------- a row of fractions, mixed numbers, words and answer boxes, centred on (cx, y = fraction line) ---------- */
const fwid=(n,d,s)=>Math.max(String(n).length,String(d).length)*s*.42+s*.3;
const twid=(t,s)=>{t=String(t);return /[؀-ۿ]/.test(t)?t.length*s*.5+s*.2:t.length*s*.44};
const mwid=(w,n,d,s)=>String(w).length*s*.62+s*.22+fwid(n,d,s);
const mixed=(w,n,d,x,y,s,c="k")=>{const ww=String(w).length*s*.62,x0=x-mwid(w,n,d,s)/2;return[A.tx(w,x0+ww/2,y+s*.5,s*1.4,c),...A.frac(n,d,x0+ww+s*.22+fwid(n,d,s)/2,y,s,c)]};
const qwid=(d,s)=>s*1.05+fwid("?",d,s);
const qbox=(d,x,y,s,c="b")=>{const x0=x-qwid(d,s)/2;return[A.p(R.rect(x0,y-s*.62,s*.8,s*1.24,.3),c,3.5),...A.frac("?",d,x0+s*1.05+fwid("?",d,s)/2,y,s,c)]};
const wOf=(it,s)=>it[0]==="f"?fwid(it[1],it[2],s):it[0]==="m"?mwid(it[1],it[2],it[3],s):it[0]==="q"?qwid(it[1],s):twid(it[1],s);
/* items: ["f",n,d,c] | ["m",w,n,d,c] | ["q",d,c] (box + ?/d) | ["t",text,c]; rtl mirrors the order in Arabic (rows with words) */
const row=(items,cx,y,s,rtl=false,left=null)=>{const g=s*.3,ws=items.map(it=>wOf(it,s));
 const tot=ws.reduce((a,b)=>a+b,0)+g*(items.length-1),ord=items.map((_,i)=>i);if(rtl&&lang==="ar")ord.reverse();
 let x=left!=null?left:cx-tot/2;const pos=[];ord.forEach(i=>{pos[i]=x+ws[i]/2;x+=ws[i]+g});
 const out=items.map((it,i)=>it[0]==="f"?A.frac(it[1],it[2],pos[i],y,s,it[3]||"k"):it[0]==="m"?mixed(it[1],it[2],it[3],pos[i],y,s,it[4]||"k"):it[0]==="q"?qbox(it[1],pos[i],y,s,it[2]||"b"):[A.tx(it[1],pos[i],y+s*.36,s,it[2]||"k")]);
 out.pos=pos;out.ws=ws;out.tot=tot;return out};
const hlAt=(r,i,y,s,items)=>{const t=items[i][0]==="t";return A.hl(r.pos[i]-r.ws[i]/2-14,y-s*(t?.62:1.02),r.ws[i]+28,s*(t?1.24:2.02))};
/* a row with a highlighter swipe under item hi (default: the last item) */
const eqRow=(items,cx,y,s,hi=items.length-1,rtl=false,left=null)=>{const r=row(items,cx,y,s,rtl,left),o=[];r.forEach((a,i)=>{if(i===hi)o.push(hlAt(r,i,y,s,items));o.push(...a)});return o};
/* a/b = c/d with "·f" arrows over the numerators and under the denominators */
const eqArrows=(a,b,c,d,f,op,cx,y,s,c1,c2)=>{const r=row([["f",a,b,c1],["t","="],["f",c,d,c2]],cx,y,s),x1=r.pos[0]+r.ws[0]*.3,x2=r.pos[2]-r.ws[2]*.3,yt=y-s*.98,yb=y+s*1.02,lab=`${op} ${f}`;
 return{L:[...r[0],...r[1]],R:r[2],AR:[A.arrow(x1,yt,x2,yt,"r",-s*.42),A.tx(lab,cx,yt-s*.21-12,s*.6,"r"),A.arrow(x1,yb,x2,yb,"r",s*.42),A.tx(lab,cx,yb+s*.21+s*.56,s*.6,"r")]}};
/* ---------- pictures ---------- */
const prt=(x,y,w,h,n,from,k)=>`M${f1(x+w*from/n)},${y}h${f1(w*k/n)}v${h}h${f1(-w*k/n)}Z`;
const fine=(x,y,w,h,n,Lc)=>{let d="";for(let i=1;i<Lc;i++)if((i*n)%Lc)d+=R.line(x+w*i/Lc,y+3,x+w*i/Lc,y+h-3,.2);return A.p(d,"#8a96b0",2)};
const sector=(cx,cy,r,n,k)=>{if(k>=n)return`M${cx-r},${cy}a${r},${r} 0 1,0 ${2*r},0a${r},${r} 0 1,0 ${-2*r},0Z`;const a2=-Math.PI/2+2*Math.PI*k/n;
 return`M${cx},${cy}L${cx},${cy-r}A${r},${r} 0 ${k/n>.5?1:0} 1 ${f1(cx+r*Math.cos(a2))},${f1(cy+r*Math.sin(a2))}Z`};
const pizza=(cx,cy,r,n,k,c="r")=>[pieLines(cx,cy,r,n),...(k?[A.hatch(sector(cx,cy,r,n,k),c)]:[])];
const snum=(cx,cy,r,n,j,v,size)=>{const a=(-90+360*(j+.5)/n)*Math.PI/180;return qt(v,cx+Math.cos(a)*r*.55,cy+Math.sin(a)*r*.55+size*.35,size,"k")};
const ell=(cx,cy,rx,ry)=>{let d="";for(let i=0;i<=72;i++){const t=i/72*Math.PI*2,k=1+jit(i,cx+cy)*.025;d+=(i?"L":"M")+f1(cx+Math.cos(t)*rx*k)+","+f1(cy+Math.sin(t)*ry*k)}return d+"Z"};
const gridL=(x,y,s)=>{let g="";for(let i=1;i<10;i++)g+=`M${f1(x+i*s)},${y}v${f1(10*s)}M${x},${f1(y+i*s)}h${f1(10*s)}`;return[A.p(R.rect(x,y,10*s,10*s,.4),"k",4),A.p(g,"#9aa8c4",1.6)]};
const shade=(x,y,s,k,c="b")=>{const C=Math.floor(k/10),r=k%10,o=[];if(C)o.push(A.hatch(`M${x},${y}h${f1(C*s)}v${f1(10*s)}h${f1(-C*s)}Z`,c));if(r)o.push(A.hatch(`M${f1(x+C*s)},${y}h${f1(s)}v${f1(r*s)}h${f1(-s)}Z`,c));return o};
const grid=(x,y,s,k,c)=>[...gridL(x,y,s),...(k?shade(x,y,s,k,c):[])];
const roof=(x,w,y,label,size=34,c="k")=>[A.p(R.line(x,y+16,x,y,.2)+R.line(x,y,x+w,y,.3)+R.line(x+w,y,x+w,y+16,.2),c,3),A.tx(label,x+w/2,y-12,size,c)];
const wrapL=(s,max)=>{const o=[];let cur="";s.split(" ").forEach(w=>{if(cur&&(cur+" "+w).length>max){o.push(cur);cur=w}else cur=cur?cur+" "+w:w});if(cur)o.push(cur);return o};
const para=(s,y,size,gap,c="k")=>{const ar=/[؀-ۿ]/.test(s),max=Math.floor(700/(size*(ar?.5:.44)));
 return wrapL(s.replace(/(\d) (?=[^\s\d?])/g,"$1\u00a0"),max).map((l,i)=>A.tx(l,400,y+i*gap,size,c))};
const arP=n=>n===1?"شخص واحد":n===2?"شخصين":n<=10?`${n} أشخاص`:`${n} شخصًا`;

/* =================== 1. Adding and subtracting fractions =================== */
const FA={steps:[
 {say:t3("Samma nämnare är lätt, för bitarna är lika stora: 2/8 + 3/8 = 5/8. Vi lägger ihop täljarna, och nämnaren är kvar.","The same denominator is easy, because the pieces are the same size: 2/8 + 3/8 = 5/8. We add the numerators, and the denominator stays.",`المقام نفسه سهل، لأن القطع متساوية في الحجم: ${LRI("2/8 + 3/8 = 5/8")}. نجمع البسطين ويبقى المقام كما هو.`),
  draw:()=>{const x=220,w=400,h=52;return[A.wipe(),
   A.p(R.bar(x,40,w,h,8),"k",3.5),A.hatch(prt(x,40,w,h,8,0,2),"b"),...A.frac(2,8,140,66,34,"b"),
   A.p(R.bar(x,120,w,h,8),"k",3.5),A.hatch(prt(x,120,w,h,8,0,3),"g"),...A.frac(3,8,140,146,34,"g"),
   A.p(R.line(x,200,x+w,200,.3),"k",3),
   A.p(R.bar(x,214,w,h,8),"k",3.5),A.hatch(prt(x,214,w,h,8,0,2),"b"),A.hatch(prt(x,214,w,h,8,2,3),"g"),
   ...eqRow([["f",2,8,"b"],["t","+"],["f",3,8,"g"],["t","="],["f",5,8,"g"]],400,385,58)]}},
 {say:t3("Men 1/2 + 1/3? Halvor och tredjedelar är olika stora bitar. Därför blir svaret inte 2/5!","But what about 1/2 + 1/3? Halves and thirds are pieces of different sizes. So the answer is not 2/5!",`لكن ماذا عن ${LRI("1/2 + 1/3")}؟ الأنصاف والأثلاث قطع مختلفة الحجم، لذلك الناتج ليس 2/5!`),
  draw:()=>{const x=150,w=360,h=60,y=392,s=58,r=row([["f",1,2,"b"],["t","+"],["f",1,3,"g"],["t","="],["f",2,5,"r"]],400,y,s),ex=r.pos[3],fx=r.pos[4],fw=r.ws[4];
   return[A.wipe(),A.p(R.bar(x,60,w,h,2),"k",3.5),A.hatch(prt(x,60,w,h,2,0,1),"b"),...A.frac(1,2,85,90,40,"b"),
    A.p(R.bar(x,180,w,h,3),"k",3.5),A.hatch(prt(x,180,w,h,3,0,1),"g"),...A.frac(1,3,85,210,40,"g"),
    A.p(R.dashed(x+w/3,44,x+w/3,256),"r",3),A.p(R.dashed(x+w/2,44,x+w/2,256),"r",3),
    A.tx(L(t3("olika stora bitar!","pieces of different sizes!","قطع مختلفة الحجم!")),655,162,32,"r"),
    ...r.flat(),A.p(R.line(ex-12,y+28,ex+12,y-18,.2),"r",4.5),A.p(R.line(fx-fw/2-8,y-52,fx+fw/2+8,y+52,.3)+R.line(fx-fw/2-8,y+52,fx+fw/2+8,y-52,.3),"r",4.5)]}},
 {say:t3("Vi delar båda i sjättedelar, så att bitarna blir lika stora. Då är 1/2 = 3/6 och 1/3 = 2/6. Talet 6 är en gemensam nämnare.","We cut both into sixths, so that the pieces are the same size. Then 1/2 = 3/6 and 1/3 = 2/6. The number 6 is a common denominator.",`نقسم الكسرين إلى أسداس حتى تصبح القطع متساوية في الحجم. عندها ${LRI("1/2 = 3/6")} و${LRI("1/3 = 2/6")}. العدد 6 مقام مشترك.`),
  draw:()=>{const x=150,w=360,h=60;return[A.wipe(),A.p(R.bar(x,60,w,h,2),"k",3.5),A.hatch(prt(x,60,w,h,2,0,1),"b"),fine(x,60,w,h,2,6),...A.frac(1,2,85,90,40,"b"),
   A.p(R.bar(x,180,w,h,3),"k",3.5),A.hatch(prt(x,180,w,h,3,0,1),"g"),fine(x,180,w,h,3,6),...A.frac(1,3,85,210,40,"g"),
   ...row([["f",1,2,"b"],["t","="],["f",3,6,"b"]],655,90,44).flat(),...row([["f",1,3,"g"],["t","="],["f",2,6,"g"]],655,210,44).flat(),
   A.tx(L(t3("gemensam nämnare: 6","common denominator: 6","المقام المشترك: 6")),400,300,36,"r")]}},
 {say:t3("Nu är bitarna lika stora, och vi kan räkna: 3/6 + 2/6 = 5/6.","Now the pieces are the same size, and we can add: 3/6 + 2/6 = 5/6.",`الآن القطع متساوية في الحجم، ويمكننا الجمع: ${LRI("3/6 + 2/6 = 5/6")}.`),
  draw:()=>eqRow([["f",1,2,"b"],["t","+"],["f",1,3,"g"],["t","="],["f",3,6,"b"],["t","+"],["f",2,6,"g"],["t","="],["f",5,6,"g"]],400,405,50)},
 {say:t3("Nu 3/4 − 1/6. Vi letar efter ett tal som finns i både 4:ans och 6:ans tabell. Det minsta är 12, så vi använder tolftedelar.","Now 3/4 − 1/6. We look for a number that is in both the 4 times table and the 6 times table. The smallest is 12, so we use twelfths.",`الآن ${LRI("3/4 − 1/6")}. نبحث عن عدد موجود في جدول ضرب 4 وجدول ضرب 6 معًا. أصغرها 12، فنستخدم أجزاء من اثني عشر.`),
  draw:()=>{const X=[90,150,210,270],x=410,w=360,h=50;return[A.wipe(),...row([["f",3,4,"b"],["t","−"],["f",1,6,"g"]],400,62,44).flat(),
   ...[4,8,12,16].map((v,i)=>qt(v,X[i],178,38,"b")),...[6,12,18].map((v,i)=>qt(v,X[i+1],252,38,"g")),A.loop(210,202,38,74,"r"),
   A.tx(L(t3("gemensam nämnare: 12","common denominator: 12","المقام المشترك: 12")),205,322,30,"r"),
   A.p(R.bar(x,140,w,h,4),"k",3.5),A.hatch(prt(x,140,w,h,4,0,3),"b"),A.p(R.bar(x,214,w,h,6),"k",3.5),A.hatch(prt(x,214,w,h,6,0,1),"g")]}},
 {say:t3("Dela bitarna i tolftedelar: 3/4 är 9/12 och 1/6 är 2/12. Vi tar bort 2 av de 9 bitarna: 9/12 − 2/12 = 7/12.","Cut the pieces into twelfths: 3/4 is 9/12 and 1/6 is 2/12. We take away 2 of the 9 pieces: 9/12 − 2/12 = 7/12.",`نقسم القطع إلى أجزاء من اثني عشر: ${LRI("3/4 = 9/12")} و${LRI("1/6 = 2/12")}. نحذف قطعتين من القطع التسع: ${LRI("9/12 − 2/12 = 7/12")}.`),
  draw:()=>{const x=410,w=360,h=50;let d="";for(const i of [7,8]){const X=x+30*i;d+=R.line(X+5,148,X+25,182,.1)+R.line(X+5,182,X+25,148,.1)}
   return[fine(x,140,w,h,4,12),fine(x,214,w,h,6,12),...row([["f",3,4,"b"],["t","="],["f",9,12,"b"]],505,312,34).flat(),...row([["f",1,6,"g"],["t","="],["f",2,12,"g"]],680,312,34).flat(),A.p(d,"r",4),
    ...eqRow([["f",3,4],["t","−"],["f",1,6],["t","="],["f",9,12,"b"],["t","−"],["f",2,12,"r"],["t","="],["f",7,12,"g"]],400,420,48)]}}
]};
/* worked solution: two bars, a common denominator, the result bar and the calculation */
function faSol(a,b,c,d,op,head){
 const Lc=lcm(b,d),A1=a*Lc/b,C1=c*Lc/d,Rn=op==="+"?A1+C1:A1-C1,g=gcd(Rn,Lc),x=150,w=360,h=50,Y1=96,Y2=176,Y3=262;
 const o=[A.wipe(),...head,
  A.p(R.bar(x,Y1,w,h,b),"k",3.5),A.hatch(prt(x,Y1,w,h,b,0,a),"b"),...A.frac(a,b,85,Y1+h/2,32,"b"),
  A.p(R.bar(x,Y2,w,h,d),"k",3.5),A.hatch(prt(x,Y2,w,h,d,0,c),"g"),...A.frac(c,d,85,Y2+h/2,32,"g")];
 if(b!==Lc)o.push(fine(x,Y1,w,h,b,Lc));if(d!==Lc)o.push(fine(x,Y2,w,h,d,Lc));
 const hk=o.length;
 if(b!==Lc)o.push(...row([["f",a,b,"b"],["t","="],["f",A1,Lc,"b"]],655,Y1+h/2,36).flat());
 if(d!==Lc)o.push(...row([["f",c,d,"g"],["t","="],["f",C1,Lc,"g"]],655,Y2+h/2,36).flat());
 o.push(A.p(R.bar(x,Y3,w,h,Lc),"k",3),A.hatch(prt(x,Y3,w,h,Lc,0,A1),"b"));
 if(op==="+")o.push(A.hatch(prt(x,Y3,w,h,Lc,A1,C1),"g"));
 else{let dd="";const u=w/Lc;for(let i=Rn;i<A1;i++){const X=x+u*i;dd+=R.line(X+u*.18,Y3+7,X+u*.82,Y3+h-7,.1)+R.line(X+u*.18,Y3+h-7,X+u*.82,Y3+7,.1)}o.push(A.p(dd,"r",3))}
 const it=[["f",a,b],["t",op],["f",c,d],["t","="],["f",A1,Lc,"b"],["t",op],["f",C1,Lc,op==="+"?"g":"r"],["t","="],["f",Rn,Lc,"g"]];
 if(g>1)it.push(["t","="],["f",Rn/g,Lc/g,"g"]);
 o.push(...eqRow(it,400,412,44));
 return{o,hk,ans:[Rn,Lc],show:g>1?`${Rn}/${Lc} = ${Rn/g}/${Lc/g}`:`${Rn}/${Lc}`}}
const okFA=(a,b,c,d,op)=>{const Lc=lcm(b,d),A1=a*Lc/b,C1=c*Lc/d;return gcd(a,b)===1&&gcd(c,d)===1&&(op==="+"?A1+C1<Lc:A1>C1)};
LESSONS.push({id:"fracadd6",subject:"math",grades:"6",kind:"wb",
 title:t3("Addition och subtraktion av bråk","Adding and subtracting fractions","جمع الكسور وطرحها"),
 icon:`<svg viewBox="0 0 320 180"><rect width="320" height="180" fill="#fff"/><rect x="40" y="22" width="120" height="38" fill="#2257c9" fill-opacity=".3"/><rect x="40" y="22" width="240" height="38" fill="none" stroke="#1d2433" stroke-width="3"/><path d="M160 22V60" stroke="#1d2433" stroke-width="3"/><rect x="40" y="72" width="80" height="38" fill="#1e9e5a" fill-opacity=".3"/><rect x="40" y="72" width="240" height="38" fill="none" stroke="#1d2433" stroke-width="3"/><path d="M120 72V110M200 72V110" stroke="#1d2433" stroke-width="3"/><rect x="40" y="122" width="120" height="38" fill="#2257c9" fill-opacity=".3"/><rect x="160" y="122" width="80" height="38" fill="#1e9e5a" fill-opacity=".3"/><rect x="40" y="122" width="240" height="38" fill="none" stroke="#1d2433" stroke-width="3"/><path d="M80 122V160M120 122V160M160 122V160M200 122V160M240 122V160" stroke="#1d2433" stroke-width="2"/></svg>`,
 steps:FA.steps,mount:wbMount(FA),
 gen(level){
  const head=(a,b,c,d,op,c1="k",c2="k")=>row([["f",a,b,c1],["t",op],["f",c,d,c2],["t","="],["t","?"]],400,42,36).flat();
  const ask=(a,b,c,d,op)=>[A.wipe(),A.tx(L(t3("Räkna ut:","Work it out:","احسب:")),400,100,42),...row([["f",a,b],["t",op],["f",c,d],["t","="],["t","?"]],400,280,84).flat()];
  if(level<2){let a,b,c,d,op;
   if(level===0){do{b=rint(2,6);d=b*rint(2,4);a=rint(1,b-1);c=rint(1,d-1);op=rint(0,1)?"+":"−"}while(d>12||!okFA(a,b,c,d,op));
    if(op==="+"&&rint(0,1))[a,b,c,d]=[c,d,a,b]}
   else{do{[b,d]=shuffle(pick([[2,3],[2,5],[3,4],[3,5],[4,5]]));a=rint(1,b-1);c=rint(1,d-1);op=rint(0,1)?"+":"−"}while(!okFA(a,b,c,d,op))}
   const S=faSol(a,b,c,d,op,head(a,b,c,d,op));
   return{kind:"frac",ans:S.ans,show:S.show,hk:S.hk,q:ask(a,b,c,d,op),sol:S.o}}
  let a,b,c,d,op;do{[b,d]=shuffle(pick([[4,6],[4,10],[6,8],[6,9],[8,12]]));a=rint(1,b-1);c=rint(1,d-1);op=rint(0,1)?"+":"−"}while(!okFA(a,b,c,d,op));
  const xs=lang==="ar"?[560,240]:[240,560],S=faSol(a,b,c,d,op,head(a,b,c,d,op,"b","g"));
  const qq=op==="+"?t3("Hur stor del av pizzan äter de tillsammans?","What part of the pizza do they eat altogether?","ما الجزء الذي يأكلانه معًا؟")
   :t3("Hur mycket mer äter Ella än Omar?","How much more does Ella eat than Omar?","كم تأكل إيلا أكثر من عمر؟");
  return{kind:"frac",ans:S.ans,show:S.show,hk:S.hk,sol:S.o,
   q:[A.wipe(),...para(L(t3("Ella och Omar delar på en pizza.","Ella and Omar share a pizza.","إيلا وعمر يتقاسمان بيتزا.")),78,40,50),
    A.tx(L(t3("Ella","Ella","إيلا")),xs[0],168,44,"b"),A.tx(L(t3("Omar","Omar","عمر")),xs[1],168,44,"g"),...A.frac(a,b,xs[0],262,62,"b"),...A.frac(c,d,xs[1],262,62,"g"),
    ...para(L(qq),412,38,48)]}}
});

/* =================== 2. Mixed numbers and fraction × whole number =================== */
const glass=(cx,top,bot,w,n,k,c="b")=>{const x1=cx-w/2,x2=cx+w/2,H=bot-top;let m="";for(let i=1;i<n;i++){const y=bot-H*i/n;m+=`M${f1(x2-18)},${f1(y)}h18`}
 const o=[A.p(R.line(x1,top,x1,bot,.3)+R.line(x1,bot,x2,bot,.3)+R.line(x2,bot,x2,top,.3)+m,"k",4)];
 if(k)o.push(A.hatch(`M${f1(x1+3)},${f1(bot-H*k/n)}H${f1(x2-3)}V${bot-3}H${f1(x1+3)}Z`,c));return o};
const NX=v=>80+160*v,NY=250;
const LIT=()=>lang==="sv"?"liter":"L";   /* a lone "l" looks like "/" in the marker font */
const glassRow=()=>row([["t","3"],["t",MUL()],["f",2,5],["t","="],["f",2,5,"b"],["t","+"],["f",2,5,"b"],["t","+"],["f",2,5,"b"],["t","="],["f",6,5,"g"]],400,428,46);
const runRow=()=>row([["t","5"],["t",MUL()],["f",3,4],["t","="],["f",15,4],["t","="],["m",3,3,4,"g"],["t","km","g"]],400,430,46);
const MX={steps:[
 {say:t3("Tre glas med 2/5 liter saft i varje. Hur mycket saft är det? 3 · 2/5 betyder 2/5 + 2/5 + 2/5.","Three glasses with 2/5 of a litre of juice in each. How much juice is that? 3 × 2/5 means 2/5 + 2/5 + 2/5.",`ثلاثة أكواب، في كل منها 2/5 لتر من العصير. كم لترًا من العصير معنا؟ ${LRI("3 × 2/5")} تعني ${LRI("2/5 + 2/5 + 2/5")}.`),
  draw:()=>[A.wipe(),...[250,400,550].flatMap(cx=>[...glass(cx,45,215,96,5,2),...A.frac(2,5,cx,258,30,"b")]),...glassRow().slice(0,9).flat()]},
 {say:t3("Räkna femtedelarna: 3 · 2 = 6. Alltså är 3 · 2/5 = 6/5. Täljaren multipliceras med heltalet, men nämnaren är kvar.","Count the fifths: 3 × 2 = 6. So 3 × 2/5 = 6/5. The numerator is multiplied by the whole number, but the denominator stays the same.",`نعدّ الأخماس: ${LRI("3 × 2 = 6")}. إذن ${LRI("3 × 2/5 = 6/5")}. نضرب البسط في العدد الصحيح، ويبقى المقام كما هو.`),
  draw:()=>{const r=glassRow(),items=[["f",6,5]];return[...row([["t",`3 ${MUL()} 2 = 6`,"r"],["t",L(t3("femtedelar","fifths","أخماس")),"r"]],400,330,34,true).flat(),
   A.hl(r.pos[10]-r.ws[10]/2-14,428-47,r.ws[10]+28,94),...r[9],...r[10]]}},
 {say:t3("6/5 är mer än en hel. Fem femtedelar fyller ett helt glas, och 1/5 blir över. Alltså är 6/5 = 1 1/5 liter. Det kallas blandad form.","6/5 is more than one whole. Five fifths fill a whole glass, and 1/5 is left over. So 6/5 = 1 1/5 litres. This is called a mixed number.",`${LRI("6/5")} أكثر من واحد صحيح. خمسة أخماس تملأ كوبًا كاملًا، ويبقى 1/5. إذن ${LRI("6/5 = 1 1/5")} لتر، ويسمّى هذا عددًا كسريًا.`),
  draw:()=>[A.wipe(),...glass(160,80,300,104,5,5),...glass(320,80,300,104,5,1),A.tx("1",160,372,48),...A.frac(1,5,320,352,34),
   ...row([["f",6,5],["t","="],["f",5,5,"b"],["t","+"],["f",1,5,"b"]],600,110,40).flat(),
   ...eqRow([["f",6,5],["t","="],["m",1,1,5,"g"]],600,245,58),A.tx(L(t3("blandad form","mixed number","عدد كسري")),600,360,36,"b")]},
 {say:t3("Moa springer 3/4 km varje dag. Hur långt springer hon på 5 dagar? Fem hopp på 3/4: 5 · 3/4 = 15/4 km.","Moa runs 3/4 km every day. How far does she run in 5 days? Five jumps of 3/4: 5 × 3/4 = 15/4 km.",`تجري موا 3/4 كم كل يوم. كم تجري في 5 أيام؟ خمس قفزات، طول كل منها 3/4: ${LRI("5 × 3/4 = 15/4")} كم.`),
  draw:()=>{let d=R.line(60,NY,740,NY,.4);for(let i=0;i<=16;i++){const x=80+40*i,big=i%4===0;d+=R.line(x,NY-(big?16:8),x,NY+(big?16:8),.2)}
   return[A.wipe(),...row([["t","5"],["t",MUL()],["f",3,4],["t","km"]],400,62,40).flat(),A.p(d,"k",3.5),...[0,1,2,3,4].map(i=>qt(i,NX(i),294,30)),qt("km",768,294,26),
    ...[0,1,2,3,4].flatMap(i=>[A.arrow(NX(.75*i)+4,NY-6,NX(.75*(i+1))-4,NY-6,"b",-56),...A.frac(3,4,NX(.75*i+.375),178,24,"b")]),
    A.p(dots([[NX(3.75),NY]]),"r",16),...runRow().slice(0,5).flat()]}},
 {say:t3("Fyra fjärdedelar är en hel kilometer. 15 = 4 + 4 + 4 + 3, alltså 3 hela och 3/4 till. Moa springer 3 3/4 km.","Four quarters make one whole kilometre. 15 = 4 + 4 + 4 + 3, so 3 wholes and 3/4 more. Moa runs 3 3/4 km.",`كل أربعة أرباع تساوي كيلومترًا كاملًا. ${LRI("15 = 4 + 4 + 4 + 3")}، إذن 3 كيلومترات كاملة و3/4. تجري موا ${LRI("3 3/4")} كم.`),
  draw:()=>{const r=runRow(),x0=r.pos[6]-r.ws[6]/2-14,x1=r.pos[7]+r.ws[7]/2+14;
   return[A.tx("15 = 4 + 4 + 4 + 3",400,356,34,"r"),...mixed(3,3,4,NX(3.75),328,28,"r"),A.hl(x0,430-48,x1-x0,96),...r[5],...r[6],...r[7]]}},
 {say:t3("2 · 1 1/3 pizza: ta de hela och bitarna var för sig. 2 · 1 = 2 och 2 · 1/3 = 2/3. Tillsammans blir det 2 2/3 pizzor.","2 × 1 1/3 pizzas: take the wholes and the pieces separately. 2 × 1 = 2 and 2 × 1/3 = 2/3. Together that is 2 2/3 pizzas.",`${LRI("2 × 1 1/3")} بيتزا: نضرب الأعداد الصحيحة والأجزاء كلًّا على حدة. ${LRI("2 × 1 = 2")} و${LRI("2 × 1/3 = 2/3")}. المجموع ${LRI("2 2/3")} بيتزا.`),
  draw:()=>{const M=MUL();return[A.wipe(),A.p(ell(190,172,166,100)+ell(610,172,166,100),"#8a96b0",3),
   ...pizza(115,172,62,3,3,"o"),...pizza(265,172,62,3,1,"o"),...pizza(535,172,62,3,3,"o"),...pizza(685,172,62,3,1,"o"),
   ...mixed(1,1,3,190,320,28,"b"),...mixed(1,1,3,610,320,28,"b"),
   ...eqRow([["t","2"],["t",M],["m",1,1,3],["t","="],["t","2"],["t",M],["t","1"],["t","+"],["t","2"],["t",M],["f",1,3],["t","="],["m",2,2,3,"g"]],400,430,42)]}}
]};
LESSONS.push({id:"mixed6",subject:"math",grades:"6",kind:"wb",
 title:t3("Blandad form och bråk gånger heltal","Mixed numbers and fractions times whole numbers","الأعداد الكسرية وضرب الكسر في عدد صحيح"),
 icon:`<svg viewBox="0 0 320 180"><rect width="320" height="180" fill="#fff"/>${[50,135,220].map(x=>`<rect x="${x+3}" y="106" width="50" height="42" fill="#2257c9" fill-opacity=".3"/><path d="M${x} 42V150H${x+56}V42" fill="none" stroke="#1d2433" stroke-width="3.5"/><path d="M${x+44} 63.6h12M${x+44} 85.2h12M${x+44} 106.8h12M${x+44} 128.4h12" stroke="#1d2433" stroke-width="2.5"/>`).join("")}</svg>`,
 steps:MX.steps,mount:wbMount(MX),
 gen(level){const M=MUL(),D=DIVS();
  if(level===0){let n,a,b;do{n=rint(2,5);b=rint(3,8);a=rint(1,b-1)}while(gcd(a,b)>1||n*a>3*b||n*a===b);
   const N=n*a,x=230,w=340,h=36,gap=14,y0=Math.round(222-(n*h+(n-1)*gap)/2),Y=i=>y0+i*(h+gap);
   const o=[A.wipe(),...row([["t",n],["t",M],["f",a,b],["t","="],["t","?"]],400,44,38).flat()];
   for(let i=0;i<n;i++)o.push(A.p(R.bar(x,Y(i),w,h,b),"k",3.5),A.hatch(prt(x,Y(i),w,h,b,0,a),"b"),...A.frac(a,b,165,Y(i)+h/2,28,"b"));
   const hk=o.length;
   for(let i=0;i<n;i++)for(let j=0;j<a;j++)o.push(qt(i*a+j+1,x+w*(j+.5)/b,Y(i)+h/2+8,22,"b"));
   o.push(A.tx(`${n} ${M} ${a} = ${N}`,690,232,34,"r"));
   const it=[["t",n],["t",M],["f",a,b],["t","="],["f",N,b,"g"]],W=Math.floor(N/b),r=N%b;
   if(N>b){const g=gcd(r,b);it.push(["t","="],r?["m",W,r/g,b/g,"g"]:["t",W,"g"])}else if(gcd(N,b)>1){const g=gcd(N,b);it.push(["t","="],["f",N/g,b/g,"g"])}
   o.push(...eqRow(it,400,432,46,4));
   return{kind:"frac",ans:[N,b],show:`${N}/${b}`,hk,q:[A.wipe(),A.tx(L(t3("Räkna ut:","Work it out:","احسب:")),400,100,42),...row([["t",n],["t",M],["f",a,b],["t","="],["t","?"]],400,280,84).flat()],sol:o}}
  if(level===1){let n,a,b,N;do{n=rint(3,6);b=pick([2,3,4,5,6,8]);a=rint(1,b-1);N=n*a}while(gcd(a,b)>1||N<=b||N%b===0||N>4*b||gcd(N%b,b)>1);
   const W=Math.floor(N/b),r=N%b,k=rint(0,2),pz=k===2;
   const txt=[t3(`Moa springer ${a}/${b} km varje dag. Hur långt springer hon på ${n} dagar?`,`Moa runs ${a}/${b} km every day. How far does she run in ${n} days?`,`تجري موا ${a}/${b} كيلومتر كل يوم. كم كيلومترًا تجري في ${n} أيام؟`),
    t3(`En flaska rymmer ${a}/${b} liter saft. Hur mycket saft finns det i ${n} flaskor?`,`A bottle holds ${a}/${b} of a litre of juice. How much juice is there in ${n} bottles?`,`تتّسع الزجاجة لـ ${a}/${b} لتر من العصير. كم لترًا من العصير في ${n} زجاجات؟`),
    t3(`Varje person äter ${a}/${b} pizza. Hur mycket pizza äter ${n} personer?`,`Each person eats ${a}/${b} of a pizza. How much pizza do ${n} people eat?`,`يأكل كل شخص ${a}/${b} بيتزا. كم بيتزا يأكل ${n} أشخاص؟`)][k];
   const unit=["km",LIT(),L(t3("pizzor","pizzas","بيتزا"))][k];
   const P=W+1,bw=Math.min(170,(720-(P-1)*24)/P),cx=i=>400+(i-(P-1)/2)*(bw+24),y=128,h=56;
   const hd=row([["t",n],["t",M],["f",a,b],["t","="],["f",N,b,"b"]],400,48,40),o=[A.wipe(),...hd.flat()],hk=o.length;
   for(let i=0;i<P;i++){o.push(A.p(R.bar(cx(i)-bw/2,y,bw,h,b),"k",3.5),A.hatch(prt(cx(i)-bw/2,y,bw,h,b,0,i<W?b:r),i<W?"b":"o"));
    o.push(...(i<W?[A.tx("1",cx(i),y+h+52,42)]:A.frac(r,b,cx(i),y+h+40,30,"o")))}
   o.push(...row([["t",`${N} ${D} ${b} = ${W}`],["t",L(REST)],["t",r]],400,330,38,true).flat());
   o.push(...eqRow([["f",N,b],["t","="],["m",W,r,b,"g"],["t",unit,"g"]],400,428,54,2,pz));
   return{kind:"pair",ans:[W,r],labels:[t3("hela","wholes","الصحيح"),t3("täljare","numerator","البسط")],check:(x,z)=>x===W&&z===r,show:`${W} ${r}/${b} ${unit}`,hk,
    q:[A.wipe(),...para(L(txt),80,40,54),A.tx(L(t3("Svara i blandad form:","Answer as a mixed number:","أجب بعدد كسري:")),400,262,34,"b"),...row([["q",b],["t",unit]],400,360,64,pz).flat()],sol:o}}
  let n,w,a,b;do{n=rint(2,4);w=rint(1,3);b=pick([2,3,4,5,6,8]);a=rint(1,b-1)}while(gcd(a,b)>1||(n*a)%b===0||gcd((n*a)%b,b)>1);
  const na=n*a,w2=Math.floor(na/b),r=na%b,W=n*w+w2,s=44;
  const lines=[[["t","="],["t",n],["t",M],["t",w],["t","+"],["t",n],["t",M],["f",a,b]],[["t","="],["t",n*w,"b"],["t","+"],["f",na,b,"r"]]];
  if(w2)lines.push([["t","="],["t",n*w,"b"],["t","+"],["m",w2,r,b,"r"]]);
  const fin=[["t","="],["m",W,r,b,"g"]],maxW=Math.max(...[...lines,fin].map(l=>row(l,0,0,s).tot)),X0=400-maxW/2,X1=X0+twid("=",s)+s*.3,Ys=lines.length===3?[156,250,344]:[170,290];
  const o=[A.wipe(),...row([["t",n],["t",M],["m",w,a,b]],0,60,40,false,X1).flat(),...row(lines[0],0,Ys[0],s,false,X0).flat()],hk=o.length;
  lines.slice(1).forEach((l,i)=>o.push(...row(l,0,Ys[i+1],s,false,X0).flat()));
  o.push(...eqRow(fin,0,lines.length===3?438:410,s+6,1,false,X0));
  return{kind:"pair",ans:[W,r],labels:[t3("hela","wholes","الصحيح"),t3("täljare","numerator","البسط")],check:(x,z)=>x===W&&z===r,show:`${W} ${r}/${b}`,hk,
   q:[A.wipe(),A.tx(L(t3("Räkna ut och svara i blandad form:","Work it out and answer as a mixed number:","احسب وأجب بعدد كسري:")),400,100,38),...row([["t",n],["t",M],["m",w,a,b],["t","="],["q",b]],400,280,70).flat()],sol:o}}
});

/* =================== 3. Percent, fractions and decimals =================== */
const LB={fr:t3("bråk","fraction","كسر"),dec:t3("decimaltal","decimal","عدد عشري"),pc:t3("procent","percent","نسبة مئوية")};
/* the same share three ways, next to a 100-grid at (60,60,36); hi = which line is the answer (-1 none) */
const three=(k,hi=-1)=>{const dec=dfmt(k/100,k%10?2:1),C=(i,c)=>hi===i?"g":c,o=[];
 o.push(...A.frac(k,100,560,120,46,C(0,"b")),A.tx(L(LB.fr),715,128,26,GRY),A.tx("=",470,262,50));
 if(hi===1)o.push(A.hl(480,214,160,64));o.push(A.tx(dec,560,262,56,C(1,"o")),A.tx(L(LB.dec),715,254,26,GRY),A.tx("=",470,392,50));
 if(hi===2)o.push(A.hl(480,344,160,64));o.push(A.tx(pct(k),560,392,56,C(2,"g")),A.tx(L(LB.pc),715,384,26,GRY));return o};
const PC6={steps:[
 {say:t3("Samma andel kan skrivas på tre sätt. 35 av 100 rutor är målade: 35/100 = 0,35 = 35 %.","The same share can be written in three ways. 35 of the 100 squares are shaded: 35/100 = 0.35 = 35%.",`يمكن كتابة الجزء نفسه بثلاث طرق. 35 مربعًا من 100 ملوّنة: ${LRI("35/100 = 0.35 = 35%")}.`),
  draw:()=>[A.wipe(),...grid(60,60,36,35,"b"),...three(35)]},
 {say:t3("3/4 av pizzan är kvar. Förläng till hundradelar: 4 · 25 = 100, så 3/4 = 75/100. Det är 0,75 eller 75 %.","3/4 of the pizza is left. Expand to hundredths: 4 × 25 = 100, so 3/4 = 75/100. That is 0.75 or 75%.",`بقي 3/4 من البيتزا. نوسّع الكسر إلى أجزاء من مئة: ${LRI("4 × 25 = 100")}، إذن ${LRI("3/4 = 75/100")}، أي 0.75 أو 75%.`),
  draw:()=>{const E=eqArrows(3,4,75,100,25,MUL(),580,180,50,"r","g");return[A.wipe(),...pizza(190,250,140,4,3,"r"),...E.L,...E.AR,...E.R,...eqRow([["t","="],["t",dfmt(.75,2),"o"],["t","="],["t",pct(75),"g"]],580,400,52)]}},
 {say:t3("2/5: dela rutnätet i 5 lika delar. Varje del är 20 rutor, så 2/5 = 40/100 = 40 %.","2/5: split the grid into 5 equal parts. Each part is 20 squares, so 2/5 = 40/100 = 40%.",`2/5: نقسم الشبكة إلى 5 أجزاء متساوية. كل جزء 20 مربعًا، إذن ${LRI("2/5 = 40/100 = 40%")}.`),
  draw:()=>{let d="";for(let k=1;k<5;k++)d+=R.line(60+68*k,72,60+68*k,428,.2);const E=eqArrows(2,5,40,100,20,MUL(),600,190,50,"b","g");
   return[A.wipe(),...grid(60,80,34,40,"b"),A.p(d,"r",4),...E.L,...E.AR,...E.R,...eqRow([["t","="],["t",pct(40),"g"]],600,400,56)]}},
 {say:t3("0,6 är 6 tiondelar, alltså 60 hundradelar: 60 %. Men 0,06 är bara 6 hundradelar: 6 %. Decimaltalet gånger 100 ger procenten.","0.6 is 6 tenths, which is 60 hundredths: 60%. But 0.06 is only 6 hundredths: 6%. The decimal times 100 gives the percent.","0.6 تعني 6 أعشار، أي 60 جزءًا من مئة: 60%. لكن 0.06 تعني 6 أجزاء من مئة فقط: 6%. نضرب العدد العشري في 100 فنحصل على النسبة المئوية."),
  draw:()=>{const M=MUL();return[A.wipe(),...grid(90,36,26,60,"b"),...grid(450,36,26,6,"r"),A.tx(`${dfmt(.6,1)} = ${dfmt(.6,2)} = ${pct(60)}`,220,350,38,"b"),A.tx(`${dfmt(.06,2)} = ${pct(6)}`,580,350,38,"r"),
   A.hl(150,402,500,64),A.tx(L(t3(`decimaltal ${M} 100 = procent`,`decimal ${M} 100 = percent`,`العدد العشري ${M} 100 = النسبة المئوية`)),400,446,36)]}},
 {say:t3("Vilket är störst: 3/5, 0,58 eller 62 %? Gör om allt till procent: 60 %, 58 % och 62 %. Nu är det lätt att se att 62 % är störst.","Which is the biggest: 3/5, 0.58 or 62%? Change them all to percent: 60%, 58% and 62%. Now it is easy to see that 62% is the biggest.","أيها الأكبر: 3/5 أم 0.58 أم 62%؟ نحوّلها كلها إلى نسب مئوية: 60% و58% و62%. الآن يسهل أن نرى أن 62% هي الأكبر."),
  draw:()=>{const X=[180,400,620];return[A.wipe(),A.tx(L(t3("Vilket är störst?","Which is the biggest?","أيها الأكبر؟")),400,50,36),
   ...A.frac(3,5,X[0],148,54,"b"),A.tx(dfmt(.58,2),X[1],170,62,"o"),A.tx(pct(62),X[2],170,62,"g"),...X.map(x=>A.arrow(x,212,x,266,"k")),
   A.tx(pct(60),X[0],330,50,"b"),A.tx(pct(58),X[1],330,50,"o"),A.tx(pct(62),X[2],330,50,"g"),A.loop(X[2],314,78,42,"g"),
   A.hl(220,405,360,64),A.tx(`${pct(58)} < ${pct(60)} < ${pct(62)}`,400,450,46)]}}
]};
LESSONS.push({id:"pct6",subject:"math",grades:"6",kind:"wb",
 title:t3("Procent, bråk och decimaltal","Percent, fractions and decimals","النسبة المئوية والكسور والأعداد العشرية"),
 icon:`<svg viewBox="0 0 320 180"><defs><pattern id="pc6h" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(40)"><line x1="2" y1="0" x2="2" y2="8" stroke="#d63b2f" stroke-width="3" stroke-opacity=".6"/></pattern></defs><rect width="320" height="180" fill="#fff"/><path d="M95 90V30A60 60 0 1 1 35 90Z" fill="url(#pc6h)"/><circle cx="95" cy="90" r="60" fill="none" stroke="#1d2433" stroke-width="3.5"/><path d="M95 30V150M35 90H155" stroke="#1d2433" stroke-width="3"/><text x="240" y="80" font-family="Caveat,cursive" font-weight="700" font-size="44" fill="#e07b00" text-anchor="middle">0,75</text><text x="240" y="140" font-family="Caveat,cursive" font-weight="700" font-size="50" fill="#1e9e5a" text-anchor="middle">75 %</text></svg>`,
 steps:PC6.steps,mount:wbMount(PC6),
 gen(level){
  if(level===0){let k;do{k=rint(3,97)}while(k%10===0&&rint(0,2));const dir=rint(0,1),dec=dfmt(k/100,k%10?2:1),C=Math.floor(k/10),r=k%10;
   const ask=dir?t3("Skriv som decimaltal:","Write as a decimal:","اكتبها عددًا عشريًا:"):t3("Skriv i procent:","Write as a percent:","اكتبه نسبة مئوية:");
   const o=[A.wipe(),...grid(60,60,36,k,"b")];if(C)o.push(A.p(R.rect(55,55,C*36+10,370,.3),"b",4.5));if(r)o.push(A.p(R.rect(60+C*36+5,65,26,r*36-10,.2),"r",4.5));
   const hk=o.length;o.push(...three(k,dir?1:2));
   return{kind:"num",ans:dir?k/100:k,dec:!!dir,show:dir?dec:pct(k),hk,q:[A.wipe(),...grid(60,60,36,k,"b"),A.tx(L(ask),610,150,32),A.tx(dir?`${pct(k)} = ?`:`${dec} = ${pct("?")}`,610,280,56)],sol:o}}
  if(level===1){const b=pick([2,4,5,10,20,25,50]);let a;do{a=rint(1,b-1)}while(gcd(a,b)>1);const f=100/b,P=a*f,E=eqArrows(a,b,P,100,f,MUL(),590,215,50,"b","g");
   const o=[A.wipe(),...row([["f",a,b],["t","="],["t",pct("?")]],400,42,36).flat(),...gridL(50,96,32),...E.L],hk=o.length;
   o.push(...shade(50,96,32,P,"b"),...E.AR,...E.R,...eqRow([["t","="],["t",pct(P),"g"]],590,412,56));
   return{kind:"num",ans:P,show:pct(P),hk,q:[A.wipe(),A.tx(L(t3("Skriv i procent:","Write as a percent:","اكتبه نسبة مئوية:")),400,110,42),...row([["f",a,b],["t","="],["t",pct("?")]],400,290,90).flat()],sol:o}}
  let b,a,p1,p2,p3;do{b=pick([2,4,5,10,20,25]);a=rint(1,b-1);p1=a*100/b;p2=p1+rint(-9,9);p3=p1+rint(-9,9)}while(gcd(a,b)>1||p1<10||p1>90||new Set([p1,p2,p3]).size<3);
  const big=rint(0,1),vals=[p1,p2,p3],target=big?Math.max(...vals):Math.min(...vals),perm=shuffle([0,1,2]),X=[180,400,620];
  const lab=i=>i===0?`${a}/${b}`:i===1?dfmt(p2/100,p2%10?2:1):pct(p3);
  const show=(i,x,y,s)=>i===0?A.frac(a,b,x,y-s*.3,s*.88):[A.tx(lab(i),x,y,s)];
  const Q=big?t3("Vilket är störst?","Which is the biggest?","أيها الأكبر؟"):t3("Vilket är minst?","Which is the smallest?","أيها الأصغر؟");
  const o=[A.wipe(),A.tx(L(Q),400,50,36),...perm.flatMap((i,j)=>show(i,X[j],170,62)),...X.map(x=>A.arrow(x,212,x,266,"k"))],hk=o.length;
  perm.forEach((i,j)=>{if(vals[i]===target)o.push(A.loop(X[j],314,78,42,"g"));o.push(A.tx(pct(vals[i]),X[j],330,50,vals[i]===target?"g":"k"))});
  const srt=vals.slice().sort((x,y)=>x-y);o.push(A.hl(200,405,400,64),A.tx(srt.map(pct).join(" < "),400,450,46));
  return{kind:"choice",opts:perm.map(lab),ans:perm.findIndex(i=>vals[i]===target),show:lab(vals.indexOf(target)),hk,
   q:[A.wipe(),A.tx(L(Q),400,90,44),...perm.flatMap((i,j)=>show(i,X[j],290,84))],sol:o}}
});

/* =================== 4. Proportionality: unit price, comparing prices, recipes =================== */
const bunP=(cx,cy,r)=>R.circ(cx,cy,r)+`M${f1(cx-r*.5)},${f1(cy+r*.15)}Q${f1(cx-r*.35)},${f1(cy-r*.5)} ${f1(cx+r*.15)},${f1(cy-r*.4)}Q${f1(cx+r*.55)},${f1(cy-r*.1)} ${f1(cx+r*.2)},${f1(cy+r*.25)}Q${f1(cx-r*.05)},${f1(cy+r*.35)} ${f1(cx-r*.1)},${f1(cy+r*.05)}`;
const penP=(cx,cy,r)=>{const w=r*.4,t=cy-r,b=cy+r*.45;return R.rect(cx-w/2,t,w,b-t,.2)+`M${f1(cx-w/2)},${f1(b)}L${f1(cx)},${f1(cy+r)}L${f1(cx+w/2)},${f1(b)}`+R.line(cx-w/2,t+r*.3,cx+w/2,t+r*.3,.1)};
const tickP=(cx,cy,r)=>R.rect(cx-r,cy-r*.55,2*r,r*1.1,.2)+R.dashed(cx-r*.4,cy-r*.45,cx-r*.4,cy+r*.5,6)+R.line(cx-r*.1,cy-r*.15,cx+r*.7,cy-r*.15,.1)+R.line(cx-r*.1,cy+r*.2,cx+r*.5,cy+r*.2,.1);
const bottleP=(cx,bot,w,h)=>{const s=bot-h*.62,n=bot-h*.8,nw=w*.2;return R.line(cx-w/2,bot,cx-w/2,s,.3)+`M${f1(cx-w/2)},${f1(s)}Q${f1(cx-w/2)},${f1(n)} ${f1(cx-nw)},${f1(n)}`+R.line(cx-nw,n,cx-nw,bot-h,.2)+R.line(cx-nw,bot-h,cx+nw,bot-h,.2)+R.line(cx+nw,bot-h,cx+nw,n,.2)+`M${f1(cx+nw)},${f1(n)}Q${f1(cx+w/2)},${f1(n)} ${f1(cx+w/2)},${f1(s)}`+R.line(cx+w/2,s,cx+w/2,bot,.3)+R.line(cx+w/2,bot,cx-w/2,bot,.3)};
const boxP=(cx,bot,w,h)=>R.rect(cx-w/2,bot-h,w,h,.3)+R.line(cx-w/2,bot-h+18,cx+w/2,bot-h+18,.2);
const coneP=(cx,top)=>({s:R.circ(cx,top+28,28),c:`M${cx-27},${top+38}L${cx},${top+120}L${cx+27},${top+38}Z`+R.line(cx-18,top+58,cx+8,top+86,.1)+R.line(cx+18,top+58,cx-8,top+86,.1)});
const ITM=[{p:bunP,c:"o",pl:t3("kanelbullar","cinnamon buns","كعكات بالقرفة"),u:[8,16,1]},{p:penP,c:"b",pl:t3("pennor","pens","أقلام"),u:[4,12,1]},{p:tickP,c:"g",pl:t3("biobiljetter","cinema tickets","تذاكر سينما"),u:[70,130,5]}];
const ING=[t3("vetemjöl","flour","دقيق"),t3("mjölk","milk","حليب"),t3("ägg","eggs","بيض")],RY=[230,310,390];
/* a "via 1" table: header, three rows and the two steps on both sides */
const MXr=x=>lang==="ar"?800-x:x,SG=()=>lang==="ar"?-1:1;
function ladder(h1,h2,rows,ops){const XL=MXr(285),XR=MXr(495),Y=[165,265,365],o=[A.tx(h1,XL,70,32,"b"),A.tx(h2,XR,70,32,"b"),A.p(R.line(180,92,640,92,.3)+R.line(390,40,390,405,.3),"k",3)];
 const op=i=>[A.arrow(217,Y[i]+4,217,Y[i+1]-14,"r",24),A.tx(ops[i],157,(Y[i]+Y[i+1])/2+10,30,"r"),A.arrow(612,Y[i]+4,612,Y[i+1]-14,"r",-24),A.tx(ops[i],672,(Y[i]+Y[i+1])/2+10,30,"r")];
 o.push(A.tx(rows[0][0],XL,Y[0]+16,46),A.tx(rows[0][1],XR,Y[0]+16,46),...op(0),A.tx(rows[1][0],XL,Y[1]+16,46));const hk=o.length;
 o.push(A.tx(rows[1][1],XR,Y[1]+16,46),...op(1),A.hl(232,Y[2]-30,360,64),A.tx(rows[2][0],XL,Y[2]+16,46,"g"),A.tx(rows[2][1],XR,Y[2]+16,46,"g"));return{o,hk}}
const RT={steps:[
 {say:t3("4 kanelbullar kostar 36 kr. Vad kostar en bulle? Dela med 4: 36 / 4 = 9 kr. Det är styckpriset.","4 cinnamon buns cost 36 kr. How much is one bun? Divide by 4: 36 ÷ 4 = 9 kr. That is the unit price.",`ثمن 4 كعكات بالقرفة 36 كرونة. كم ثمن الكعكة الواحدة؟ نقسم على 4: ${LRI("36 ÷ 4 = 9")} كرونات. هذا سعر القطعة.`),
  draw:()=>{const D=DIVS();return[A.wipe(),...roof(70,360,84,"36 kr",36),A.p([110,200,290,380].map(x=>bunP(x,142,36)).join(""),"o",4),
   A.arrow(450,142,565,142,"r"),A.tx(`${D} 4`,507,124,32,"r"),A.p(bunP(640,142,36),"o",4),A.tx("9 kr",640,86,38,"g"),A.tx(L(t3("styckpris","unit price","سعر القطعة")),640,218,28,"b"),
   A.hl(250,236,300,56),A.tx(`36 ${D} 4 = 9 kr`,400,276,44)]}},
 {say:t3("Vad kostar då 7 bullar? 7 · 9 = 63 kr. Räkna först ut priset för en, sedan för så många du vill.","So how much do 7 buns cost? 7 × 9 = 63 kr. First find the price of one, then of as many as you like.",`فكم ثمن 7 كعكات؟ ${LRI("7 × 9 = 63")} كرونة. احسب أولًا ثمن القطعة الواحدة، ثم ثمن أي عدد تريده.`),
  draw:()=>[A.p([0,1,2,3,4,5,6].map(i=>bunP(214+i*62,362,24)).join(""),"o",3.5),A.hl(250,412,300,62),A.tx(`7 ${MUL()} 9 = 63 kr`,400,456,46,"g")]},
 {say:t3("Dubbelt så många bullar kostar dubbelt så mycket. Antal och pris växer i samma takt. Det kallas proportionalitet.","Twice as many buns cost twice as much. The number and the price grow at the same rate. This is called proportionality.","ضِعف عدد الكعكات ثمنه ضِعف الثمن. العدد والثمن يزدادان بالنسبة نفسها، ويسمّى هذا التناسب."),
  draw:()=>{const X=[310,440,570,700].map(MXr),N=[1,2,4,7],M=MUL(),sg=SG(),arr=(i,y,bend,ly)=>[A.arrow(X[i]+24*sg,y,X[i+1]-24*sg,y,"r",bend*sg),A.tx(`${M} 2`,(X[i]+X[i+1])/2,ly,30,"r")];
   return[A.wipe(),A.p(R.line(90,215,760,215,.3)+R.line(MXr(235),110,MXr(235),330,.3),"k",3.5),
    A.tx(L(t3("antal","number","العدد")),MXr(160),182,34,"b"),A.tx(L(t3("pris","price","الثمن")),MXr(160),290,34,"b"),
    ...N.map((n,i)=>A.tx(n,X[i],185,48)),...N.map((n,i)=>A.tx(`${9*n} kr`,X[i],290,40)),
    ...arr(0,128,-20,96),...arr(1,128,-20,96),...arr(0,318,20,370),...arr(1,318,20,370),
    A.hl(240,412,320,62),A.tx(L(t3("proportionalitet","proportionality","التناسب")),400,454,40,"g")]}},
 {say:t3("Liten flaska: 0,5 liter för 9 kr. Stor flaska: 2 liter för 32 kr. Jämför priset för 1 liter: 18 kr mot 16 kr. Den stora är billigare per liter.","Small bottle: 0.5 litres for 9 kr. Big bottle: 2 litres for 32 kr. Compare the price for 1 litre: 18 kr against 16 kr. The big one is cheaper per litre.","الزجاجة الصغيرة: 0.5 لتر بـ 9 كرونات. الزجاجة الكبيرة: لتران بـ 32 كرونة. نقارن سعر اللتر الواحد: 18 كرونة مقابل 16 كرونة. الكبيرة أرخص لكل لتر."),
  draw:()=>{const M=MUL(),D=DIVS(),l=LIT(),l2=l;return[A.wipe(),A.p(bottleP(220,240,86,140),"o",4),A.p(bottleP(580,240,130,210),"o",4),
   A.tx(`${dfmt(.5,1)} ${l}: 9 kr`,220,300,36),A.tx(`2 ${l2}: 32 kr`,580,300,36),
   A.tx(`1 ${l}: 9 ${M} 2 = 18 kr`,220,384,32,"r"),A.tx(`1 ${l}: 32 ${D} 2 = 16 kr`,580,384,32,"g"),A.loop(580,373,190,36,"g"),
   A.tx(L(t3("jämförpris = pris för 1 liter","unit price = price for 1 litre","سعر الوحدة = سعر اللتر الواحد")),400,462,32,"b")]}},
 {say:t3("Ett recept på pannkakor räcker till 4 personer. Men ni är 6 som ska äta! Hur mycket behövs då?","A pancake recipe is enough for 4 people. But there are 6 of you! How much do you need then?","وصفة الفطائر تكفي 4 أشخاص، لكنكم 6 أشخاص! فكم نحتاج من كل مكوّن؟"),
  draw:()=>[A.wipe(),A.p(R.rect(50,40,700,420,.3),"k",3.5),A.tx(L(t3("Pannkakor","Pancakes","الفطائر")),MXr(190),160,38,"o"),A.p(R.line(70,182,730,182,.3),"k",3),
   ...ING.map((n,i)=>A.tx(L(n),MXr(190),RY[i]+12,36)),A.tx(L(t3("4 pers.","4 people","4 أشخاص")),MXr(400),160,30),...["4 dl","8 dl","2"].map((v,i)=>A.tx(v,MXr(400),RY[i]+12,40))]},
 {say:t3("Gå via en person: dela med 4. Gångra sedan med 6. Det blir 6 dl vetemjöl, 12 dl mjölk och 3 ägg.","Go via one person: divide by 4. Then multiply by 6. That makes 6 dl of flour, 12 dl of milk and 3 eggs.","نحسب أولًا لشخص واحد: نقسم على 4، ثم نضرب في 6. فنحتاج 6 ديسيلترات من الدقيق و12 ديسيلترًا من الحليب و3 بيضات."),
  draw:()=>[A.arrow(MXr(430),112,MXr(510),112,"r",-16*SG()),A.tx(`${DIVS()} 4`,MXr(470),88,28,"r"),A.arrow(MXr(570),112,MXr(650),112,"r",-16*SG()),A.tx(`${MUL()} 6`,MXr(610),88,28,"r"),
   A.tx(L(t3("1 pers.","1 person","شخص واحد")),MXr(540),160,30,"r"),...["1 dl","2 dl",dfmt(.5,1)].map((v,i)=>A.tx(v,MXr(540),RY[i]+12,40,"r")),
   A.hl(MXr(680)-62,196,124,234),A.tx(L(t3("6 pers.","6 people","6 أشخاص")),MXr(680),160,30,"g"),...["6 dl","12 dl","3"].map((v,i)=>A.tx(v,MXr(680),RY[i]+12,40,"g"))]}
]};
LESSONS.push({id:"ratio6",subject:"math",grades:"6",kind:"wb",
 title:t3("Jämförpris och recept","Unit price and recipes","سعر الوحدة والوصفات"),
 icon:`<svg viewBox="0 0 320 180"><rect width="320" height="180" fill="#fff"/>${[[50,62],[106,62],[50,118],[106,118],[250,90]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="22" fill="#e07b00" fill-opacity=".15" stroke="#e07b00" stroke-width="3.5"/><path d="M${x-11} ${y+3}Q${x-8} ${y-11} ${x+3} ${y-9}Q${x+12} ${y-2} ${x+4} ${y+5}" fill="none" stroke="#e07b00" stroke-width="3"/>`).join("")}<path d="M150 90H208M196 80L208 90L196 100" fill="none" stroke="#d63b2f" stroke-width="3.5" stroke-linecap="round"/><text x="250" y="150" font-family="Caveat,cursive" font-weight="700" font-size="32" fill="#1e9e5a" text-anchor="middle">9 kr</text></svg>`,
 steps:RT.steps,mount:wbMount(RT),
 gen(level){const M=MUL(),D=DIVS();
  if(level===0){const it=pick(ITM),[lo,hi,st]=it.u,u=lo+st*rint(0,(hi-lo)/st);let n,m;do{n=rint(3,6);m=rint(3,9)}while(m===n);const P=n*u,ans=m*u,pl=it.pl;
   const gap=Math.min(100,620/n),X=i=>400+(i-(n-1)/2)*gap,r=Math.min(36,gap*.38);
   const Lr=ladder(L(t3("antal","number","العدد")),L(t3("pris","price","الثمن")),[[n,`${fmt(P)} kr`],[1,`${u} kr`],[m,`${fmt(ans)} kr`]],[`${D} ${n}`,`${M} ${m}`]);
   return{kind:"num",ans,show:`${fmt(ans)} kr`,hk:Lr.hk+1,sol:[A.wipe(),...Lr.o],
    q:[A.wipe(),A.tx(L(t3(`${n} ${pl.sv} kostar ${fmt(P)} kr.`,`${n} ${pl.en} cost ${fmt(P)} kr.`,`ثمن ${n} ${pl.ar} ${fmt(P)} كرونة.`)),400,72,40),
     ...roof(X(0)-r-14,X(n-1)-X(0)+2*r+28,160,`${fmt(P)} kr`,34),A.p([...Array(n)].map((_,i)=>it.p(X(i),232,r)).join(""),it.c,4),
     A.tx(L(t3(`Vad kostar ${m} ${pl.sv}?`,`How much do ${m} ${pl.en} cost?`,`كم ثمن ${m} ${pl.ar}؟`)),400,385,42)]}}
  if(level===1){const K=pick([{u:"l",lo:12,hi:30,sz:[.5,1,2,3],bottle:true,w:t3("liter","litre","لتر")},{u:"kg",lo:30,hi:80,sz:[.5,1,2],bottle:false,w:t3("kilo","kilo","كيلوغرام")}]);
   let sA,sB,uA,uB;do{[sA,sB]=shuffle(K.sz);uA=rint(K.lo,K.hi);uB=rint(K.lo,K.hi)}while(Math.abs(uA-uB)<2||Math.abs(uA-uB)>Math.max(4,uA*.25)||(sA*uA)%1||(sB*uB)%1||(sA-sB)*(sA*uA-sB*uB)<=0);
   const S=[sA,sB],U=[uA,uB],P=[sA*uA,sB*uB],ch=uA<uB?0:1,X=[220,580],nmS=s=>Number.isInteger(s)?String(s):dfmt(s,1),LT=["A","B"],U1=K.bottle?LIT():"kg",US=()=>U1;
   const pack=i=>{const s=S[i],x=X[i];if(K.bottle){const w=70+15*s,h=90+25*s;return[A.tx(LT[i],x,46,40,"b"),A.p(bottleP(x,236,w,h),"o",4),A.tx(`${nmS(s)} ${US(s)}`,x,276,32,"o")]}
    const w=90+30*s,h=70+40*s;return[A.tx(LT[i],x,46,40,"b"),A.p(boxP(x,236,w,h),"b",4),A.tx(`${nmS(s)} kg`,x,276,32,"b")]};
   const base=[...pack(0),...pack(1),A.tx(`${P[0]} kr`,X[0],326,44),A.tx(`${P[1]} kr`,X[1],326,44)];
   const per=i=>{const s=S[i];return s===.5?`1 ${U1}: ${P[i]} ${M} 2 = ${U[i]} kr`:s===1?`1 ${U1}: ${U[i]} kr`:`1 ${U1}: ${P[i]} ${D} ${s} = ${U[i]} kr`};
   const o=[A.wipe(),...base],hk=o.length;
   o.push(A.tx(per(0),X[0],394,30,ch===0?"g":"r"),A.tx(per(1),X[1],394,30,ch===1?"g":"r"),A.loop(X[ch],384,172,32,"g"),
    A.tx(L(t3(`${LT[ch]} är billigare per ${K.w.sv}.`,`${LT[ch]} is cheaper per ${K.w.en}.`,`${LT[ch]} أرخص لكل ${K.w.ar}.`)),400,458,34,"g"));
   return{kind:"choice",opts:LT,ans:ch,show:`${LT[ch]} (${U[ch]} kr/${U1})`,hk,sol:o,
    q:[A.wipe(),...base,A.tx(L(t3(`Vilken är billigare per ${K.w.sv}?`,`Which is cheaper per ${K.w.en}?`,`أيهما أرخص لكل ${K.w.ar}؟`)),400,420,40)]}}
  const IN=pick([{n:t3("mjölk","milk","حليب"),d:t3("mjölk","milk","الحليب"),u:"dl",v:[1.5,2,2.5]},{n:t3("vetemjöl","flour","دقيق"),d:t3("vetemjöl","flour","الدقيق"),u:"dl",v:[.5,1.5]},
   {n:t3("smör","butter","زبدة"),d:t3("smör","butter","الزبدة"),u:"g",v:[10,15,20,25]},{n:t3("riven ost","grated cheese","جبن مبشور"),d:t3("riven ost","grated cheese","الجبن المبشور"),u:"g",v:[20,25,30,40]}]);
  const v=pick(IN.v);let p,q;do{p=pick([3,4,5,6,8]);q=rint(3,12)}while(q===p);const a=v*p,ans=v*q;
  const Lr=ladder(L(t3("personer","people","الأشخاص")),`${L(IN.n)} (${IN.u})`,[[p,nm(a)],[1,nm(v)],[q,nm(ans)]],[`${D} ${p}`,`${M} ${q}`]);
  return{kind:"num",ans,dec:true,show:`${nm(ans)} ${IN.u}`,hk:Lr.hk+1,sol:[A.wipe(),...Lr.o],
   q:[A.wipe(),A.p(R.rect(150,36,500,200,.3),"k",3.5),A.tx(L(t3(`Recept för ${p} personer`,`Recipe for ${p} people`,`وصفة تكفي ${arP(p)}`)),400,94,36,"o"),
    A.p(R.line(170,118,630,118,.2),"k",2.5),...row([["t",`${nm(a)} ${IN.u}`],["t",L(IN.n)]],400,176,46,true).flat(),
    ...para(L(t3(`Hur mycket ${IN.d.sv} behövs till ${q} personer?`,`How much ${IN.d.en} is needed for ${q} people?`,`ما كمية ${IN.d.ar} اللازمة لـ ${arP(q)}؟`)),318,38,48),
    A.tx(`? ${IN.u}`,400,440,52,"b")]}}
});

/* =================== HELP and HINTS =================== */
Object.assign(HELPX,{
 fracadd6:[{say:t3("Tänk på pizza. Du kan inte lägga ihop halvor och fjärdedelar direkt. Skär halvan i två bitar: 1/2 = 2/4. Nu är 2/4 + 1/4 = 3/4.","Think of pizza. You can't add halves and quarters straight away. Cut the half into two slices: 1/2 = 2/4. Now 2/4 + 1/4 = 3/4.",`فكّر في البيتزا. لا يمكنك جمع الأنصاف والأرباع مباشرةً. اقطع النصف إلى قطعتين: ${LRI("1/2 = 2/4")}. الآن ${LRI("2/4 + 1/4 = 3/4")}.`),
  draw:()=>[...pizza(130,160,85,2,1,"b"),A.tx("=",265,180,64),...pizza(400,160,85,4,2,"b"),A.tx("+",535,180,64),...pizza(670,160,85,4,1,"g"),
   ...A.frac(1,2,130,300,36,"b"),...A.frac(2,4,400,300,36,"b"),...A.frac(1,4,670,300,36,"g"),
   ...eqRow([["f",2,4,"b"],["t","+"],["f",1,4,"g"],["t","="],["f",3,4,"g"]],400,420,52)]}],
 mixed6:[{say:t3("Tänk på pizzahalvor. Två halvor blir en hel pizza. 7 halvor räcker till 3 hela pizzor och en halv: 7/2 = 3 1/2.","Think of pizza halves. Two halves make one whole pizza. 7 halves make 3 whole pizzas and one half: 7/2 = 3 1/2.",`فكّر في أنصاف البيتزا. كل نصفين يكوّنان بيتزا كاملة. 7 أنصاف تكوّن 3 بيتزا كاملة ونصفًا: ${LRI("7/2 = 3 1/2")}.`),
  draw:()=>[...[115,305,495,685].flatMap((x,i)=>pizza(x,170,80,2,i<3?2:1,"o")),...[0,1,2,3,4,5,6].map(k=>snum([115,305,495,685][Math.floor(k/2)],170,80,2,k%2,k+1,32)),
   ...eqRow([["f",7,2],["t","="],["m",3,1,2,"g"]],400,385,62)]}],
 pct6:[{say:t3("Tänk på mobilens batteri. När det är halvladdat kan du säga 1/2, 0,5 eller 50 %. Det är tre sätt att säga samma sak.","Think of a phone battery. When it is half charged, you can say 1/2, 0.5 or 50%. Those are three ways to say the same thing.","فكّر في بطارية الهاتف. عندما تكون مشحونة إلى النصف يمكنك أن تقول 1/2 أو 0.5 أو 50%. هذه ثلاث طرق لقول الشيء نفسه."),
  draw:()=>[A.p(R.rect(230,60,330,140,.3)+R.rect(560,104,20,52,.2),"k",4.5),A.hatch("M236,66h159v128h-159Z","g"),
   ...row([["f",1,2,"b"],["t","="],["t",dfmt(.5,1),"o"],["t","="],["t",pct(50),"g"]],400,345,64).flat()]}],
 ratio6:[{say:t3("En glass kostar 15 kr. Tre glassar kostar tre gånger så mycket: 3 · 15 = 45 kr. Vet du priset för en, kan du räkna ut priset för hur många som helst.","One ice cream costs 15 kr. Three ice creams cost three times as much: 3 × 15 = 45 kr. If you know the price of one, you can work out the price of any number.",`ثمن البوظة الواحدة 15 كرونة. ثمن 3 بوظات ثلاثة أضعاف ذلك: ${LRI("3 × 15 = 45")} كرونة. إذا عرفت ثمن الواحدة، يمكنك حساب ثمن أي عدد منها.`),
  draw:()=>{const C=[150,460,560,660].map(x=>coneP(x,110));return[A.p(C.map(c=>c.s).join(""),"r",4),A.p(C.map(c=>c.c).join(""),"o",4),
   A.tx("15 kr",150,320,44),A.arrow(240,180,360,180,"r"),A.tx(`${MUL()} 3`,300,160,34,"r"),A.hl(400,276,320,64),A.tx(`3 ${MUL()} 15 = 45 kr`,560,320,44,"g")]}}]
});
Object.assign(HINTSX,{
 fracadd6:[{say:t3("Gör om bråket som har den mindre nämnaren, så att båda bråken får samma nämnare.","Change the fraction with the smaller denominator, so that both fractions get the same denominator.","حوّل الكسر ذا المقام الأصغر حتى يصبح للكسرين المقام نفسه."),cut:g=>g.sol.slice(0,g.hk)},
  {say:t3("Hitta en gemensam nämnare: ett tal som finns i båda nämnarnas tabeller. Förläng sedan båda bråken.","Find a common denominator: a number that is in both denominators' times tables. Then expand both fractions.","ابحث عن مقام مشترك: عدد موجود في جدولي ضرب المقامين، ثم وسّع الكسرين."),cut:g=>g.sol.slice(0,g.hk)},
  {say:t3("Tillsammans betyder plus, och hur mycket mer betyder minus. Hitta sedan minsta gemensamma nämnare.","Altogether means plus, and how much more means minus. Then find the lowest common denominator.","«معًا» تعني الجمع، و«كم أكثر» تعني الطرح. ثم ابحث عن أصغر مقام مشترك."),cut:g=>g.sol.slice(0,g.hk)}],
 mixed6:[{say:t3("Gångra bara täljaren med heltalet. Nämnaren är kvar.","Multiply only the numerator by the whole number. The denominator stays.","اضرب البسط فقط في العدد الصحيح، ويبقى المقام كما هو."),cut:g=>g.sol.slice(0,g.hk)},
  {say:t3("Räkna först ut produkten som ett bråk. Hur många hela ryms sedan i det bråket?","First work out the product as a fraction. Then how many wholes fit into it?","احسب أولًا الناتج كسرًا، ثم انظر كم واحدًا صحيحًا فيه."),cut:g=>g.sol.slice(0,g.hk)},
  {say:t3("Multiplicera de hela och bråkdelen var för sig. Lägg sedan ihop.","Multiply the wholes and the fraction part separately. Then add them.","اضرب الأعداد الصحيحة والكسر كلًّا على حدة، ثم اجمع الناتجين."),cut:g=>g.sol.slice(0,g.hk)}],
 pct6:[{say:t3("Varje kolumn är 10 rutor, alltså 10 %. Procent betyder hundradelar.","Each column is 10 squares, which is 10%. Percent means hundredths.","كل عمود 10 مربعات، أي 10%. النسبة المئوية تعني أجزاء من مئة."),cut:g=>g.sol.slice(0,g.hk)},
  {say:t3("Förläng bråket så att nämnaren blir 100. Täljaren är då procenten.","Expand the fraction so that the denominator becomes 100. The numerator is then the percent.","وسّع الكسر حتى يصبح المقام 100، فيكون البسط هو النسبة المئوية."),cut:g=>g.sol.slice(0,g.hk)},
  {say:t3("Skriv om alla tre som procent. Sedan kan du jämföra dem.","Rewrite all three as percents. Then you can compare them.","اكتب الثلاثة كلها نسبًا مئوية، ثم قارن بينها."),cut:g=>g.sol.slice(0,g.hk)}],
 ratio6:[{say:t3("Räkna först ut vad en kostar. Gångra sedan med antalet du vill köpa.","First work out what one costs. Then multiply by the number you want to buy.","احسب أولًا ثمن القطعة الواحدة، ثم اضربه في العدد الذي تريد شراءه."),cut:g=>g.sol.slice(0,g.hk)},
  {say:t3("Räkna ut priset för 1 liter eller 1 kilo för båda. Det kallas jämförpris.","Work out the price of 1 litre or 1 kilo for both. That is called the unit price.","احسب سعر اللتر الواحد أو الكيلوغرام الواحد لكليهما. هذا هو سعر الوحدة."),cut:g=>g.sol.slice(0,g.hk)},
  {say:t3("Hur mycket behövs till 1 person? Gångra sedan med antalet personer.","How much is needed for 1 person? Then multiply by the number of people.","كم نحتاج لشخص واحد؟ ثم اضرب في عدد الأشخاص."),cut:g=>g.sol.slice(0,g.hk)}]
});
}
