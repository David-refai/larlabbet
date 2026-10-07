/* ===== y6d.js ===== */
/* =====================================================================
   YEAR 6 (y6d): equations with a balance scale, patterns and sequences,
   choosing the right average, algorithms and block programming
   ===================================================================== */
{
const LR=s=>"⁦"+s+"⁩";                                 /* keeps a formula left-to-right inside Arabic speech */
const W6=(s,z)=>{s=String(s);return /[؀-ۿ]/.test(s)?s.length*z*.46+z*.2:s.length*z*.39};
/* "label  formula" centred on cx; in Arabic the label sits on the right, the formula stays left-to-right */
const lf6=(lab,f,cx,y,z,cl="k",cf="g")=>{const wl=W6(lab,z),wf=W6(f,z),g=z*.35,x0=cx-(wl+g+wf)/2;
 return lang==="ar"?[A.tx(lab,x0+wf+g,y,z,cl,"end"),A.tx(f,x0+wf,y,z,cf,"end")]:[A.tx(lab,x0,y,z,cl,"start"),A.tx(f,x0+wl+g,y,z,cf,"start")]};
const lfW=(lab,f,z)=>W6(lab,z)+z*.35+W6(f,z);
/* Arabic counted nouns: 1, 2, 3–10, 11–99, and 100, 200 … */
const arN=(n,one,two,pl,acc,gen)=>n===1?one:n===2?two:(n%100>=3&&n%100<=10)?`${n} ${pl}`:n%100>=11?`${n} ${acc}`:`${n} ${gen}`;
const arKr=n=>n%100>=3&&n%100<=10?"كرونات":"كرونة";
const KR=n=>t3(`${fmt(n)} kr`,`${fmt(n)} kr`,`${fmt(n)} ${arKr(n)}`);
const eqR=(l,r,y,z=54,c="k")=>[A.tx(l,384,y,z,c,"end"),A.tx(`= ${r}`,398,y,z,c,"start")];
const ann=(op,y,x=590)=>[A.p(R.line(x-18,y-40,x-18,y+8,.2),"r",3.5),A.tx(op,x,y,42,"r","start")];
const chk6=(f,y,cx=400)=>lf6(L(t3("Kontroll:","Check:","تحقّق:")),f,cx,y,38,"b","b");

/* =====================================================================
   1. eq6 — equations with a balance scale, one and two steps
   ===================================================================== */
const EL=210,ER=590,EP=300,GC=["b","o","#8a3fc0"];
const balance6=()=>[A.p(`M60,${EP}Q${EL},${EP+34} 360,${EP}M440,${EP}Q${ER},${EP+34} 740,${EP}`,"k",5),
 A.p(R.line(EL,EP+17,EL,344,.2)+R.line(ER,EP+17,ER,344,.2)+R.line(EL,344,ER,344,.3)+`M400,344L368,416L432,416Z`+R.line(322,418,478,418,.3),"k",4.5)];
const sack6=(cx,by,c="b")=>{const t=by-74;return[A.p(`M${cx-9},${t+16}C${cx-36},${t+30} ${cx-33},${by-3} ${cx-14},${by}H${cx+14}C${cx+33},${by-3} ${cx+36},${t+30} ${cx+9},${t+16}Z`
 +`M${cx-9},${t+16}L${cx-15},${t+3}M${cx+9},${t+16}L${cx+15},${t+3}M${cx-12},${t+15}H${cx+12}`,c,4),A.tx("x",cx,by-17,38,c)]};
/* k sacks and m cubes centred on a pan; returns actions, cube centres C and sack centres S */
function pan6(cx,k,m,cols){const sw=64,cw=36,cub=m?Math.min(m,cols)*cw-4:0,wid=(k?k*sw-4:0)+(k&&m?14:0)+cub;let x=cx-wid/2;const o=[],C=[],S=[];
 for(let i=0;i<k;i++){S.push(x+30);o.push(...sack6(x+30,EP-1));x+=sw}if(k&&m)x+=10;
 if(m){let d="";for(let j=0;j<m;j++){const r=Math.floor(j/cols),X=x+(j%cols)*cw,Y=EP-2-(r+1)*cw;d+=R.rect(X,Y+4,32,32,.2);C.push([X+16,Y+20])}o.push(A.p(d,"g",3.5))}
 const xs=C.map(c=>c[0]);return{o,C,S,top:C.length?Math.min(...C.map(c=>c[1]))-16:EP-76,mid:C.length?(Math.min(...xs)+Math.max(...xs))/2:cx}}
const minus6=(P,a)=>A.tx(`− ${a}`,P.mid,P.top-14,40,"r");
const cross6=C=>A.p(C.map(([x,y])=>R.line(x-15,y+15,x+15,y-15,.2)).join(""),"r",4.5);
/* colour the remaining cubes in k groups of size s and ring each sack in the same colour */
const groups6=(C,S,s)=>S.flatMap((sx,g)=>[A.p(C.slice(g*s,g*s+s).map(([x,y])=>R.rect(x-16,y-16,32,32,.15)).join(""),GC[g],5.5),A.loop(sx,EP-38,31,46,GC[g])]);
const ticket6=(x,y,w=78,h=48)=>A.p(R.rect(x,y,w,h,.3)+R.dashed(x+w*.24,y+5,x+w*.24,y+h-5,7),"o",4);
const popcorn6=(cx,by)=>[A.p(`M${cx-30},${by-62}L${cx-22},${by}H${cx+22}L${cx+30},${by-62}Z`+R.line(cx-10,by-60,cx-7,by-2,.2)+R.line(cx+10,by-60,cx+7,by-2,.2),"r",4),
 A.p(R.circ(cx-16,by-70,10)+R.circ(cx,by-76,11)+R.circ(cx+16,by-70,10),"o",3.5)];
const EQ={steps:[
 {say:t3("En ekvation är som en våg i balans. Påsen x och 4 klossar väger lika mycket som 10 klossar: x + 4 = 10.",
   "An equation is like balanced scales. The bag x and 4 blocks weigh the same as 10 blocks: x + 4 = 10.",
   `المعادلة مثل ميزان متوازن. الكيس x و4 مكعبات تزن مثل 10 مكعبات: ${LR("x + 4 = 10")}.`),
  draw:()=>[A.wipe(),A.tx("x + 4 = 10",400,76,58),...balance6(),...pan6(EL,1,4,4).o,...pan6(ER,0,10,5).o]},
 {say:t3("Ta bort 4 klossar på båda sidor, så väger vågen fortfarande jämnt. Minus 4 tar bort plus 4. Kvar är x = 6.",
   "Take 4 blocks off both sides and the scales still balance. Minus 4 undoes plus 4. What is left is x = 6.",
   `نزيل 4 مكعبات من الكفّتين فيبقى الميزان متوازنًا. الطرح 4 يُلغي الجمع 4. ويبقى ${LR("x = 6")}.`),
  draw:()=>{const P=pan6(EL,1,4,4),Q=pan6(ER,0,10,5);return[minus6(P,4),minus6(Q,4),cross6(P.C),cross6(Q.C.slice(6)),
   A.hl(250,430,300,62),A.tx("x = 10 − 4 = 6",400,476,46,"g")]}},
 {say:t3("Nu två steg: 3x + 2 = 14. Steg 1: ta bort 2 klossar på båda sidor. Kvar är 3x = 12.",
   "Now two steps: 3x + 2 = 14. Step 1: take 2 blocks off both sides. That leaves 3x = 12.",
   `الآن خطوتان: ${LR("3x + 2 = 14")}. الخطوة 1: نزيل مكعبين من الكفّتين، فيبقى ${LR("3x = 12")}.`),
  draw:()=>{const P=pan6(EL,3,2,1),Q=pan6(ER,0,14,4);return[A.wipe(),A.tx("3x + 2 = 14",400,62,54),...balance6(),...P.o,...Q.o,
   minus6(P,2),minus6(Q,2),cross6(P.C),cross6(Q.C.slice(12)),...lf6(L(t3("steg 1:","step 1:","الخطوة 1:")),"3x = 12",190,476,40,"r","b")]}},
 {say:t3("Steg 2: dela båda sidor i 3 lika delar. Varje påse väger lika mycket som 4 klossar, så x = 4.",
   "Step 2: split both sides into 3 equal parts. Each bag weighs the same as 4 blocks, so x = 4.",
   `الخطوة 2: نقسم كل كفّة إلى 3 أجزاء متساوية. كل كيس يزن مثل 4 مكعبات، إذن ${LR("x = 4")}.`),
  draw:()=>{const P=pan6(EL,3,2,1),Q=pan6(ER,0,14,4);return[...groups6(Q.C,P.S,4),A.hl(372,430,400,62),...lf6(L(t3("steg 2:","step 2:","الخطوة 2:")),`x = 12 ${DIVS()} 3 = 4`,572,476,40,"b","g")]}},
 {say:t3("Utan våg gör vi likadant: samma sak på båda sidor. 2x − 5 = 13. Plus 5 ger 2x = 18. Delat med 2 ger x = 9.",
   "Without scales we do the same: the same thing to both sides. 2x − 5 = 13. Adding 5 gives 2x = 18. Dividing by 2 gives x = 9.",
   `بدون ميزان نفعل الشيء نفسه في الطرفين. ${LR("2x − 5 = 13")}. نضيف 5 فيصبح ${LR("2x = 18")}، ثم نقسم على 2 فيصبح ${LR("x = 9")}.`),
  draw:()=>[A.wipe(),A.tx(L(t3("Gör samma sak på båda sidor!","Do the same to both sides!","افعل الشيء نفسه في الطرفين!")),400,56,38,"b"),
   ...eqR("2x − 5","13",145),...ann("+ 5",145),...eqR("2x","18",235),...ann(`${DIVS()} 2`,235),...eqR("x","9",325,54,"g"),A.loop(410,307,100,40,"g"),
   ...chk6(`2 ${MUL()} 9 − 5 = 13 ✓`,435)]},
 {say:t3("Fyra biobiljetter och popcorn för 35 kr kostar 215 kr. Kalla biljettpriset x: 4x + 35 = 215. Då blir x = 45, en biljett kostar 45 kr.",
   "Four cinema tickets and popcorn for 35 kr cost 215 kr. Call the ticket price x: 4x + 35 = 215. Then x = 45, so a ticket costs 45 kr.",
   `أربع تذاكر سينما وفشار بـ35 كرونة تكلّف 215 كرونة. نسمّي سعر التذكرة x: ${LR("4x + 35 = 215")}. إذن ${LR("x = 45")}، وسعر التذكرة 45 كرونة.`),
  draw:()=>[A.wipe(),...[0,1,2,3].flatMap(i=>[ticket6(70+i*96,72),A.tx("x",128+i*96,108,34,"o")]),A.tx("+",470,112,46),...popcorn6(540,140),
   A.tx(L(KR(35)),540,176,28,"r"),A.tx("=",620,112,46),A.tx(L(KR(215)),lang==="ar"?712:705,114,lang==="ar"?34:40,"g"),
   ...eqR("4x + 35","215",265,50),...ann("− 35",265),...eqR("4x","180",345,50),...ann(`${DIVS()} 4`,345),...eqR("x","45",425,50,"g"),A.loop(410,409,96,38,"g"),
   A.tx(L(t3("En biljett kostar 45 kr.","A ticket costs 45 kr.","سعر التذكرة 45 كرونة.")),400,486,32,"g")]}
]};
const EQCTX=[
 {gen:()=>{const a=rint(3,6),b=rint(5,12)*5,x=rint(8,24)*5;return{a,b,x,c:a*x+b}},
  t:(a,b,c)=>[t3(`Ni köper ${a} biobiljetter och popcorn för ${b} kr.`,`You buy ${a} cinema tickets and popcorn for ${b} kr.`,`اشتريتم ${a} تذاكر سينما وفشارًا بـ${b} كرونة.`),
   t3(`Allt kostar ${fmt(c)} kr. Vad kostar en biljett?`,`It all costs ${fmt(c)} kr. How much is one ticket?`,`المجموع ${c} كرونة. كم سعر التذكرة الواحدة؟`)],
  x:t3("x = priset för en biljett","x = the price of one ticket","x = سعر التذكرة الواحدة")},
 {gen:()=>{const a=rint(3,5),b=pick([149,199,249,299]),x=rint(3,12)*5;return{a,b,x,c:a*x+b}},
  t:(a,b,c)=>[t3(`Ett spel kostar ${b} kr. Du köper också ${a} lika dyra skins.`,`A game costs ${b} kr. You also buy ${a} skins at the same price.`,`سعر لعبة ${b} كرونة، واشتريت معها ${a} إضافات بالسعر نفسه.`),
   t3(`Totalt betalar du ${fmt(c)} kr. Vad kostar ett skin?`,`In total you pay ${fmt(c)} kr. How much is one skin?`,`دفعت ${c} كرونة في المجموع. كم سعر الإضافة الواحدة؟`)],
  x:t3("x = priset för ett skin","x = the price of one skin","x = سعر الإضافة الواحدة")},
 {gen:()=>{const a=rint(3,9),b=rint(8,12)*5,x=rint(9,25);return{a,b,x,c:a*x+b}},
  t:(a,b,c)=>[t3(`En taxiresa kostar ${b} kr i start plus samma pris per km.`,`A taxi ride costs ${b} kr to start plus the same price per km.`,`أجرة التاكسي ${b} كرونة عند البدء، ثم السعر نفسه لكل كيلومتر.`),
   t3(`${a} km kostar ${c} kr. Vad kostar en km?`,`${a} km cost ${c} kr. What is the price per km?`,`رحلة ${a} كيلومترات تكلّف ${c} كرونة. كم سعر الكيلومتر؟`)],
  x:t3("x = priset per km","x = the price per km","x = سعر الكيلومتر")}
];
/* a boxes "x" + one box with the fixed cost = total, centred on one row */
function pic6(a,b,c,y){const bw=a>5?40:54,gp=a>5?6:10,fb=L(KR(b)),ft=L(KR(c)),w2=W6(fb,26)+24,wt=W6(ft,34),tot=a*(bw+gp)-gp+40+w2+44+wt;let x=400-tot/2;const o=[];let d="";
 for(let i=0;i<a;i++){d+=R.rect(x,y-24,bw,48,.25);o.push(A.tx("x",x+bw/2,y+10,30,"o"));x+=bw+gp}o.unshift(A.p(d,"o",4));x+=-gp+20;o.push(A.tx("+",x,y+14,40));x+=20;
 o.push(A.p(R.rect(x,y-24,w2,48,.25),"r",4),A.tx(fb,x+w2/2,y+9,26,"r"));x+=w2+22;o.push(A.tx("=",x,y+14,40));x+=22;o.push(A.tx(ft,x+wt/2,y+12,34,"g"));return o}
const askBag=()=>A.tx(L(pick([t3("Hur mycket väger påsen x?","How much does the bag x weigh?","كم يزن الكيس x؟"),t3("Lös ekvationen. Hur mycket väger påsen x?","Solve the equation. How much does the bag x weigh?","حلّ المعادلة. كم يزن الكيس x؟")])),400,44,30,"b");
LESSONS.push({id:"eq6",subject:"math",grades:"6",kind:"wb",
 title:t3("Ekvationer i ett och två steg","One- and two-step equations","معادلات بخطوة واحدة وبخطوتين"),
 icon:`<svg viewBox="0 0 320 180"><rect width="320" height="180" fill="#fff"/><path d="M28 112Q83 126 138 112M182 112Q237 126 292 112" stroke="#1d2433" stroke-width="3.5" fill="none"/><path d="M83 119V134M237 119V134M83 134H237M160 134L146 164H174Z" stroke="#1d2433" stroke-width="3" fill="none"/>${[52,84].map(x=>`<path d="M${x-5} 82C${x-20} 88 ${x-18} 110 ${x-7} 111H${x+7}C${x+18} 110 ${x+20} 88 ${x+5} 82Z" fill="#2257c9" fill-opacity=".12" stroke="#2257c9" stroke-width="2.5"/><text direction="ltr" x="${x}" y="105" font-family="Caveat,cursive" font-weight="700" font-size="20" fill="#2257c9" text-anchor="middle">x</text>`).join("")}${[[104,95]].map(([x,y])=>`<rect x="${x}" y="${y}" width="15" height="15" fill="none" stroke="#1e9e5a" stroke-width="2.5"/>`).join("")}${[0,1,2,3,4,5,6].map(i=>`<rect x="${205+(i%4)*18}" y="${i<4?95:77}" width="15" height="15" fill="none" stroke="#1e9e5a" stroke-width="2.5"/>`).join("")}<text direction="ltr" x="160" y="46" font-family="Caveat,cursive" font-weight="700" font-size="34" text-anchor="middle">2x + 1 = 7</text></svg>`,
 steps:EQ.steps,mount:wbMount(EQ),
 gen(level){const M=MUL(),D=DIVS();
  if(level===0){
   if(Math.random()<.55){const a=rint(2,8),x=rint(2,Math.min(12,20-a)),b=a+x,P=pan6(EL,1,a,a>4?3:2),Q=pan6(ER,0,b,b>14?7:5);
    return{kind:"num",ans:x,show:String(x),hc:4,q:[A.wipe(),askBag(),A.tx(`x + ${a} = ${b}`,400,100,50),...balance6(),...P.o,...Q.o],
     sol:[minus6(P,a),minus6(Q,a),cross6(P.C),cross6(Q.C.slice(b-a)),A.hl(220,430,360,62),A.tx(`x = ${b} − ${a} = ${x}`,400,476,46,"g")]}}
   const k=rint(2,3),x=rint(2,k===2?9:6),b=k*x,P=pan6(EL,k,0,1),Q=pan6(ER,0,b,b>15?6:5);
   return{kind:"num",ans:x,show:String(x),hc:0,q:[A.wipe(),askBag(),A.tx(`${k}x = ${b}`,400,100,50),...balance6(),...P.o,...Q.o],
    sol:[...groups6(Q.C,P.S,x),A.hl(230,430,340,62),A.tx(`x = ${b} ${D} ${k} = ${x}`,400,476,46,"g")]}}
  if(level===1){let k,x,a,b;do{k=rint(2,3);x=rint(2,k===2?7:5);a=rint(1,6);b=k*x+a}while(b>21);
   const P=pan6(EL,k,a,a>3?2:1),Q=pan6(ER,0,b,7);
   return{kind:"num",ans:x,show:String(x),hc:5,q:[A.wipe(),askBag(),A.tx(`${k}x + ${a} = ${b}`,400,100,50),...balance6(),...P.o,...Q.o],
    sol:[minus6(P,a),minus6(Q,a),cross6(P.C),cross6(Q.C.slice(b-a)),A.tx(`${k}x = ${b-a}`,190,476,44,"b"),
     ...groups6(Q.C,P.S,x),A.hl(390,430,330,62),A.tx(`x = ${b-a} ${D} ${k} = ${x}`,555,476,44,"g")]}}
  if(Math.random()<.3){/* NP style: which equation fits the story? */
   const ctx=pick(EQCTX),{a,b,x,c}=ctx.gen(),T=ctx.t(a,b,c),right=`${a}x + ${b} = ${c}`;
   const wrong=shuffle([`${b}x + ${a} = ${c}`,`${a}x = ${c} + ${b}`,`x + ${a} + ${b} = ${c}`,`${a}x − ${b} = ${c}`]).slice(0,2),opts=shuffle([right,...wrong]);
   return{kind:"choice",opts,ans:opts.indexOf(right),show:right,hc:1,nt:"which",
    hsay:t3("Kalla det okända priset x. Hur många x betalar du för, och vad läggs till?","Call the unknown price x. How many x do you pay for, and what is added?","سمِّ السعر المجهول x. كم x تدفع ثمنه، وما الذي يُضاف؟"),
    q:[A.wipe(),A.tx(L(T[0]),400,52,30),A.tx(L(T[1]),400,94,30,"b"),...pic6(a,b,c,190),A.tx(L(pick([t3("Vilken ekvation passar?","Which equation fits?","أي معادلة تناسب؟"),t3("Vilken ekvation beskriver texten?","Which equation describes the text?","أي معادلة تصف النص؟")])),400,300,38)],
    sol:[A.tx(L(ctx.x),400,350,28,"o"),A.hl(250,370,300,58),A.tx(right,400,412,44,"g"),...lf6(L(t3("Lösning:","Solution:","الحل:")),`x = ${x}`,400,476,32,"b","b")]}}
  if(Math.random()<.5){const ctx=pick(EQCTX),{a,b,x,c}=ctx.gen(),T=ctx.t(a,b,c);
   return{kind:"num",ans:x,show:KR(x),hc:3,q:[A.wipe(),A.tx(L(T[0]),400,52,30),A.tx(L(T[1]),400,94,30,"b"),...pic6(a,b,c,160)],
    sol:[A.tx(L(ctx.x),400,232,28,"o"),...eqR(`${a}x + ${b}`,c,292,46),...ann(`− ${b}`,292),...eqR(`${a}x`,c-b,356,46),...ann(`${D} ${a}`,356),...eqR("x",x,420,46,"g"),A.loop(410,405,96,34,"g"),
     ...chk6(`${a} ${M} ${x} + ${b} = ${c} ✓`,482)]}}
  const a=rint(2,9),x=rint(3,15),minus=Math.random()<.5;let b,c;if(minus){b=rint(2,Math.min(30,a*x-1));c=a*x-b}else{b=rint(3,40);c=a*x+b}
  const lhs=`${a}x ${minus?"−":"+"} ${b}`,op=minus?`+ ${b}`:`− ${b}`;
  return{kind:"num",ans:x,show:String(x),hc:4,q:[A.wipe(),A.tx(L(pick([t3("Lös ekvationen","Solve the equation","حلّ المعادلة"),t3("Bestäm x","Find x","أوجد x"),t3("Lös ekvationen och kontrollera svaret","Solve the equation and check the answer","حلّ المعادلة وتحقّق من الجواب")])),400,62,38),...eqR(lhs,c,160,58)],
   sol:[...ann(op,160),...eqR(`${a}x`,a*x,250),...ann(`${D} ${a}`,250),...eqR("x",x,340,54,"g"),A.loop(410,322,108,40,"g"),...chk6(`${a} ${M} ${x} ${minus?"−":"+"} ${b} = ${c} ✓`,445)]}}
});

/* =====================================================================
   2. pattern6 — patterns and sequences: the rule and the 10th figure
   ===================================================================== */
const stk6=(Ls,c="o")=>{let d="";const h=[];Ls.forEach(([x1,y1,x2,y2])=>{const l=Math.hypot(x2-x1,y2-y1),ux=(x2-x1)/l,uy=(y2-y1)/l,b=[x2-ux*7,y2-uy*7];d+=R.line(x1+ux*7,y1+uy*7,b[0],b[1],.2);h.push(b)});
 return[A.p(d,c,5.5),A.p(dots(h),c==="o"?"r":c,12)]};
const sqL=(n,x,by,u)=>{const t=by-u,o=[];for(let i=0;i<n;i++)o.push([x+i*u,t,x+(i+1)*u,t],[x+i*u,by,x+(i+1)*u,by]);for(let i=0;i<=n;i++)o.push([x+i*u,by,x+i*u,t]);return o};
const sqNew=(n,x,by,u)=>{const t=by-u;return[[x+(n-1)*u,t,x+n*u,t],[x+(n-1)*u,by,x+n*u,by],[x+n*u,by,x+n*u,t]]};
const triL=(n,x,by,u)=>{const h=u*.87,P=j=>[x+j*u/2,j%2?by-h:by],o=[];for(let j=0;j<=n;j++)o.push([...P(j),...P(j+1)]);for(let j=0;j+2<=n+1;j++)o.push([...P(j),...P(j+2)]);return o};
const FIG6={
 sq:{d:3,c:1,w:n=>n*66,h:()=>66,draw:(n,x,by)=>stk6(sqL(n,x,by,66)),
  nm:t3("stickor","sticks","أعواد"),cnt:n=>t3(`${n} stickor`,`${n} sticks`,arN(n,"عود واحد","عودان","أعواد","عودًا","عود")),acc:"عودًا"},
 tri:{d:2,c:1,w:n=>(n+1)*38,h:()=>66,draw:(n,x,by)=>stk6(triL(n,x,by,76)),
  nm:t3("stickor","sticks","أعواد"),cnt:n=>t3(`${n} stickor`,`${n} sticks`,arN(n,"عود واحد","عودان","أعواد","عودًا","عود")),acc:"عودًا"},
 tab:{d:2,c:2,w:n=>n*58+66,h:()=>124,draw:(n,x,by)=>{const u=58,r=13,g=7,t=by-33-u,x0=x+33,cy=t+u/2;let T="",C=R.circ(x+r,cy,r)+R.circ(x0+n*u+g+r,cy,r);
   for(let i=0;i<n;i++){T+=R.rect(x0+i*u,t,u,u,.3);C+=R.circ(x0+i*u+u/2,t-g-r,r)+R.circ(x0+i*u+u/2,t+u+g+r,r)}return[A.p(T,"k",4.5),A.p(C,"b",4.5)]},
  nm:t3("stolar","chairs","كراسٍ"),cnt:n=>t3(`${n} stolar`,`${n} chairs`,arN(n,"كرسي واحد","كرسيان","كراسٍ","كرسيًا","كرسي")),acc:"كرسيًا"},
 crs:{d:4,c:1,w:n=>(2*n+1)*26,h:n=>(2*n+1)*26,draw:(n,x,by)=>{const g=26,cx=x+n*g+g/2,cy=by-n*g-g/2,P=[[cx,cy]];for(let k=1;k<=n;k++)P.push([cx+k*g,cy],[cx-k*g,cy],[cx,cy+k*g],[cx,cy-k*g]);return[A.p(dots(P),"g",19)]},
  nm:t3("prickar","dots","نقاط"),cnt:n=>t3(`${n} prickar`,`${n} dots`,arN(n,"نقطة واحدة","نقطتان","نقاط","نقطة","نقطة")),acc:"نقطةً"}
};
const cnt6=(F,n)=>F.d*n+F.c;
/* figures 1..3 in a row, bottom at by; returns actions and the centre x of each figure */
function figRow(F,by,lab=true){const G=84,ws=[1,2,3].map(F.w),tot=ws[0]+ws[1]+ws[2]+2*G;let x=400-tot/2;const o=[],cx=[];
 ws.forEach((w,i)=>{o.push(...F.draw(i+1,x,by));cx.push(x+w/2);if(lab)o.push(A.tx(L(t3(`Figur ${i+1}`,`Figure ${i+1}`,`الشكل ${i+1}`)),x+w/2,by+40,28));x+=w+G});return{o,cx}}
const steps6=(cx,y,d,c="g")=>[0,1].flatMap(i=>[A.arrow(cx[i]+34,y,cx[i+1]-34,y,c,-24),A.tx(`+${d}`,(cx[i]+cx[i+1])/2,y+46,30,c)]);
const PAT={steps:[
 {say:t3("Här är ett mönster av tändstickor. Figur 1 har 4 stickor, figur 2 har 7 och figur 3 har 10.",
   "Here is a pattern made of matchsticks. Figure 1 has 4 sticks, figure 2 has 7 and figure 3 has 10.",
   "هذا نمط من أعواد الثقاب. في الشكل 1 أربعة أعواد، وفي الشكل 2 سبعة، وفي الشكل 3 عشرة."),
  draw:()=>{const F=FIG6.sq,r=figRow(F,250);return[A.wipe(),A.tx(L(t3("Ett mönster av tändstickor","A matchstick pattern","نمط من أعواد الثقاب")),400,72,42),...r.o,
   ...[1,2,3].map((n,i)=>A.tx(L(F.cnt(cnt6(F,n))),r.cx[i],342,32,"b"))]}},
 {say:t3("Varje ny figur får en ruta till, alltså 3 nya stickor. Regeln är: öka med 3 varje gång.",
   "Each new figure gets one more square, so 3 new sticks. The rule is: add 3 each time.",
   "كل شكل جديد يحصل على مربع إضافي، أي 3 أعواد جديدة. القاعدة: نزيد 3 في كل مرة."),
  draw:()=>{const F=FIG6.sq,G=84,ws=[1,2,3].map(F.w),x0=400-(ws[0]+ws[1]+ws[2]+2*G)/2,r=figRow(F,250,false);
   return[...stk6(sqNew(2,x0+ws[0]+G,250,66),"g"),...stk6(sqNew(3,x0+ws[0]+ws[1]+2*G,250,66),"g"),...steps6(r.cx,372,3)]}},
 {say:t3("Hur många stickor har figur 10? Från figur 1 till figur 10 är det 9 steg, och varje steg ger 3 till. 4 + 9 · 3 = 31.",
   "How many sticks does figure 10 have? From figure 1 to figure 10 there are 9 steps, and each step adds 3. 4 + 9 × 3 = 31.",
   `كم عودًا في الشكل 10؟ من الشكل 1 إلى الشكل 10 تسع خطوات، وكل خطوة تضيف 3. ${LR("4 + 9 × 3 = 31")}.`),
  draw:()=>{const X=i=>76+i*72,v=[4,7,10,13];return[A.wipe(),A.tx(L(t3("Från figur 1 till figur 10","From figure 1 to figure 10","من الشكل 1 إلى الشكل 10")),400,62,40),...Array.from({length:10},(_,i)=>qt(i+1,X(i),132,28,"k")),
   A.p(Array.from({length:10},(_,i)=>R.rect(X(i)-29,150,58,58,.3)).join(""),"k",3.5),...v.map((n,i)=>qt(n,X(i),191,32,"b")),
   ...Array.from({length:9},(_,i)=>A.arrow(X(i)+4,226,X(i+1)-4,226,"g",-20)),...Array.from({length:9},(_,i)=>qt("+3",X(i)+36,282,26,"g")),
   A.tx("31",X(9),193,36,"g"),A.tx(L(t3("9 steg","9 steps","9 خطوات")),400,342,36,"o"),A.hl(230,382,340,68),A.tx(`4 + 9 ${MUL()} 3 = 31`,400,432,52,"g")]}},
 {say:t3("Regeln syns också i figuren: en första sticka och sedan 3 stickor för varje ruta. Figur n har 3 · n + 1 stickor.",
   "The rule shows in the figure too: one first stick and then 3 sticks for each square. Figure n has 3 × n + 1 sticks.",
   `القاعدة تظهر في الشكل أيضًا: عود أول، ثم 3 أعواد لكل مربع. عدد الأعواد في الشكل n هو ${LR("3 × n + 1")}.`),
  draw:()=>{const u=80,x=240,by=230,o=[A.wipe(),A.tx(L(t3("Figur 4","Figure 4","الشكل 4")),400,62,38)];
   o.push(...stk6([[x,by,x,by-u]],"r"));for(let i=0;i<4;i++)o.push(...stk6([[x+i*u,by-u,x+(i+1)*u,by-u],[x+(i+1)*u,by,x+(i+1)*u,by-u],[x+i*u,by,x+(i+1)*u,by]],i%2?"g":"b"));
   o.push(A.tx("1",x-14,by+44,34,"r"),...[0,1,2,3].map(i=>A.tx("3",x+i*u+u/2,by+44,34,i%2?"g":"b")));
   o.push(A.tx(`1 + 3 + 3 + 3 + 3 = 3 ${MUL()} 4 + 1 = 13`,400,335,40),A.hl(200,375,400,68),...lf6(L(t3("figur n:","figure n:","الشكل n:")),`3 ${MUL()} n + 1`,400,425,48,"g","g"));return o}},
 {say:t3("Baklänges: vilken figur har 61 stickor? Lös 3 · n + 1 = 61. Först minus 1, sedan delat med 3. Det är figur 20.",
   "Backwards: which figure has 61 sticks? Solve 3 × n + 1 = 61. First subtract 1, then divide by 3. It is figure 20.",
   `بالعكس: أي شكل فيه 61 عودًا؟ نحلّ ${LR("3 × n + 1 = 61")}. نطرح 1 أولًا، ثم نقسم على 3. إنه الشكل 20.`),
  draw:()=>[A.wipe(),A.tx(L(t3("Vilken figur har 61 stickor?","Which figure has 61 sticks?","أي شكل فيه 61 عودًا؟")),400,60,40,"b"),
   ...eqR(`3 ${MUL()} n + 1`,"61",160),...ann("− 1",160),...eqR(`3 ${MUL()} n`,"60",250),...ann(`${DIVS()} 3`,250),...eqR("n","20",340,54,"g"),A.loop(410,322,100,40,"g"),
   A.tx(L(t3("Figur 20 har 61 stickor.","Figure 20 has 61 sticks.","في الشكل 20 واحد وستون عودًا.")),400,445,38,"g")]},
 {say:t3("Alla mönster växer inte lika mycket. Kvadraterna ökar med 3, 5, 7 och så vidare. Figur 10 har 10 · 10 = 100 prickar.",
   "Not every pattern grows by the same amount. The squares grow by 3, 5, 7 and so on. Figure 10 has 10 × 10 = 100 dots.",
   `ليست كل الأنماط تنمو بالمقدار نفسه. المربعات تزيد 3 ثم 5 ثم 7 وهكذا. في الشكل 10 يوجد ${LR("10 × 10 = 100")} نقطة.`),
  draw:()=>{const g=30,X=[130,270,440,640],by=250,o=[A.wipe(),A.tx(L(t3("Kvadrattal","Square numbers","الأعداد المربعة")),400,60,42)];
   [1,2,3,4].forEach((n,i)=>{const P=[];for(let r=0;r<n;r++)for(let c=0;c<n;c++)P.push([X[i]-(n-1)*g/2+c*g,by-(n-1-r)*g]);o.push(A.p(dots(P),"g",20),qt(n*n,X[i],by+56,34,"b"))});
   [0,1,2].forEach(i=>o.push(A.arrow(X[i]+26,by+76,X[i+1]-26,by+76,"o",-22),A.tx(`+${2*i+3}`,(X[i]+X[i+1])/2,by+124,30,"o")));
   o.push(A.hl(210,402,380,66),...lf6(L(t3("figur 10:","figure 10:","الشكل 10:")),`10 ${MUL()} 10 = 100`,400,450,44,"g","g"));return o}}
]};
LESSONS.push({id:"pattern6",subject:"math",grades:"6",kind:"wb",
 title:t3("Mönster och talföljder","Patterns and sequences","الأنماط والمتتاليات"),
 icon:`<svg viewBox="0 0 320 180"><rect width="320" height="180" fill="#fff"/>${[[30,1],[90,2],[180,3]].map(([x,n])=>{let s="";for(let i=0;i<n;i++)s+=`M${x+i*36} 70H${x+(i+1)*36}M${x+i*36} 106H${x+(i+1)*36}`;for(let i=0;i<=n;i++)s+=`M${x+i*36} 70V106`;return`<path d="${s}" stroke="#e07b00" stroke-width="4.5" stroke-linecap="round"/>`}).join("")}<text direction="ltr" x="160" y="150" font-family="Caveat,cursive" font-weight="700" font-size="30" text-anchor="middle" fill="#2257c9">4, 7, 10, …</text><text direction="ltr" x="160" y="46" font-family="Caveat,cursive" font-weight="700" font-size="26" text-anchor="middle" fill="#1e9e5a">+3  +3</text></svg>`,
 steps:PAT.steps,mount:wbMount(PAT),
 gen(level){const M=MUL(),D=DIVS();
  if(level===0&&Math.random()<.35){/* the next number in a sequence */
   const d=rint(2,9),c0=rint(1,12),v=[0,1,2,3].map(i=>c0+i*d),ans=c0+4*d,X=i=>400+(i-2)*130;
   const o=[A.wipe(),A.tx(L(pick([t3("Vilket är nästa tal i talföljden?","What is the next number in the sequence?","ما العدد التالي في المتتالية؟"),t3("Talföljden fortsätter. Vilket tal kommer sedan?","The sequence goes on. Which number comes next?","تستمر المتتالية. ما العدد الذي يأتي بعد ذلك؟")])),400,70,36),
    ...cards6([...v,"?"],X,220,"k",96)];
   return{kind:"num",ans,show:String(ans),hc:2,nt:"next",hsay:t3("Hur mycket ökar talföljden varje gång?","How much does the sequence increase by each time?","بكم تزداد المتتالية في كل مرة؟"),q:o,
    sol:[...[0,1,2,3].flatMap(i=>[A.arrow(X(i)+30,268,X(i+1)-30,268,"g",-20),qt(`+${d}`,(X(i)+X(i+1))/2,316,30,"g")]),A.loop(X(4),220,60,44,"g"),
     A.hl(220,378,360,64),...lf6(L(t3("ökar med","increases by","يزداد بمقدار")),`${d}: ${v[3]} + ${d} = ${ans}`,400,422,40,"k","g")]}}
  if(level===2&&Math.random()<.3){/* square numbers */
   const N=rint(6,12),g=34,X=[170,330,530],by=300,o=[A.wipe(),A.tx(L(t3(`Mönstret fortsätter. Hur många prickar har figur ${N}?`,`The pattern goes on. How many dots does figure ${N} have?`,`يستمر النمط. كم نقطة في الشكل ${N}؟`)),400,52,32)];
   [1,2,3].forEach((n,i)=>{const P=[];for(let r=0;r<n;r++)for(let c=0;c<n;c++)P.push([X[i]-(n-1)*g/2+c*g,by-(n-1-r)*g]);o.push(A.p(dots(P),"g",24),A.tx(L(t3(`Figur ${n}`,`Figure ${n}`,`الشكل ${n}`)),X[i],by+50,28))});
   o.push(A.tx("…",680,by-20,44));
   return{kind:"num",ans:N*N,show:String(N*N),hc:1,nt:"square",hsay:t3("Figur n är en kvadrat med n prickar på varje sida. Det är ett kvadrattal.","Figure n is a square with n dots on each side. It is a square number.","الشكل n مربع في كل ضلع منه n نقطة، وهذا عدد مربع."),q:o,
    sol:[A.tx("1, 4, 9, …",400,384,34,"b"),A.hl(200,410,400,62),...lf6(L(t3(`figur ${N}:`,`figure ${N}:`,`الشكل ${N}:`)),`${N} ${M} ${N} = ${N*N}`,400,454,42,"k","g")]}}
  if(level<2){const key=pick(Object.keys(FIG6)),F=FIG6[key],by=key==="crs"?268:272,r=figRow(F,by),c=[1,2,3].map(n=>cnt6(F,n)),N=level===0?pick([4,5]):pick([10,12,15,20]),ans=cnt6(F,N),nm=L(F.nm);
   const q=[A.wipe(),A.tx(L(rint(0,1)?t3(`Hur många ${F.nm.sv} har figur ${N}?`,`How many ${F.nm.en} does figure ${N} have?`,`كم ${F.acc} في الشكل ${N}؟`):t3(`Mönstret fortsätter. Hur många ${F.nm.sv} har figur ${N}?`,`The pattern goes on. How many ${F.nm.en} does figure ${N} have?`,`يستمر النمط. كم ${F.acc} في الشكل ${N}؟`)),400,50,34),...r.o];
   const counts=c.map((v,i)=>A.tx(v,r.cx[i],by+82,36,"b"));
   if(level===0)return{kind:"num",ans,show:F.cnt(ans),hc:7,q,sol:[...counts,...steps6(r.cx,by+98,F.d),A.hl(210,428,380,64),A.tx(N===4?`${c[2]} + ${F.d} = ${ans}`:`${c[2]} + ${F.d} + ${F.d} = ${ans}`,400,476,46,"g")]};
   return{kind:"num",ans,show:F.cnt(ans),hc:4,q:[...q,...counts],sol:[...steps6(r.cx,by+98,F.d),A.hl(220,428,360,64),A.tx(`${c[0]} + ${N-1} ${M} ${F.d} = ${ans}`,400,476,46,"g")]};}
  const d=rint(2,7),c0=rint(1,9),n=rint(12,40),N=d*n+c0,X=i=>290+i*100,o=[A.wipe(),A.tx(L(rint(0,1)?t3(`Talföljden fortsätter. Vilken figur har talet ${N}?`,`The sequence goes on. Which figure has the number ${N}?`,`تستمر المتتالية. أي شكل فيه العدد ${N}؟`):t3(`Mönstret fortsätter. Vilken figur har talet ${N}?`,`The pattern goes on. Which figure has the number ${N}?`,`يستمر النمط. أي شكل فيه العدد ${N}؟`)),400,50,30)];
  o.push(A.p(R.rect(70,86,660,128,.3)+R.line(70,150,730,150,.3)+R.line(220,86,220,214,.3),"k",3.5),A.tx(L(t3("figur","figure","الشكل")),145,130,34),A.tx(L(t3("antal","number","العدد")),145,194,34,"b"));
  [1,2,3,4].forEach(k=>o.push(qt(k,X(k-1),131,38),qt(d*k+c0,X(k-1),195,38,"b")));o.push(qt("…",X(4)-20,131,38),qt("…",X(4)-20,195,38,"b"));
  return{kind:"num",ans:n,show:String(n),hc:8,q:o,
   sol:[...[0,1,2].flatMap(i=>[A.arrow(X(i)+10,226,X(i+1)-10,226,"g",-16),qt(`+${d}`,X(i)+50,256,26,"g")]),
    ...lf6(L(t3("regel:","rule:","القاعدة:")),`${d} ${M} n + ${c0}`,400,298,36,"o","o"),
    ...eqR(`${d} ${M} n + ${c0}`,N,350,44),...ann(`− ${c0}`,350),...eqR(`${d} ${M} n`,N-c0,402,44),...ann(`${D} ${d}`,402),...eqR("n",n,454,44,"g"),A.loop(410,440,90,30,"g")]}}
});

/* =====================================================================
   3. median6 — mode, median, mean, and choosing the right one
   ===================================================================== */
const MEAN6=t3("medelvärde","mean","الوسط الحسابي"),MED6=t3("median","median","الوسيط"),TYP6=t3("typvärde","mode","المنوال");
const cards6=(vals,X,y,c="k",w=76)=>[A.p(vals.map((v,i)=>R.rect(X(i)-w/2,y-31,w,62,.3)).join(""),c,3.5),...vals.map((v,i)=>qt(typeof v==="number"?fmt(v):v,X(i),y+13,String(v).length>3?32:38,c))];
/* sort, cross the outer cards in pairs, ring the middle */
function medSort6(vals,X,y1,y2,ring=true,w=76){const s=vals.slice().sort((a,b)=>a-b),n=s.length,o=[A.arrow(400,y1+40,400,y2-40,"k"),A.tx(L(t3("sortera","sort","رتّب")),418,(y1+y2)/2+10,28,"b","lead"),...cards6(s,X,y2,"b",w)];
 const m=Math.floor((n-1)/2);o.push(A.p(Array.from({length:m},(_,i)=>[i,n-1-i]).flat().map(j=>R.line(X(j)-34,y2+28,X(j)+34,y2-28,.3)).join(""),"r",4.5));
 if(ring)o.push(n%2?A.loop(X(m),y2,52,46,"g"):A.loop((X(m)+X(m+1))/2,y2,(X(m+1)-X(m))/2+54,48,"g"));return{o,s}}
const medVal=s=>{const n=s.length;return n%2?s[(n-1)/2]:(s[n/2-1]+s[n/2])/2};
const kid6=(cx,base,h,c)=>{const hr=h*.13,top=base-h;return A.p(R.circ(cx,top+hr,hr)+R.line(cx,top+2*hr,cx,base-h*.42,.2)+R.line(cx,base-h*.42,cx-h*.14,base,.2)+R.line(cx,base-h*.42,cx+h*.14,base,.2)+R.line(cx-h*.2,top+h*.42,cx+h*.2,top+h*.42,.2),c,4)};
const MED={steps:[
 {say:t3("Laget gjorde 3, 1, 4, 2, 6 och 2 mål. Sortera först. Med sex värden finns två tal i mitten, så medianen ligger mitt emellan: 2,5.",
   "The team scored 3, 1, 4, 2, 6 and 2 goals. Sort first. With six values there are two numbers in the middle, so the median lies halfway between them: 2.5.",
   "سجّل الفريق 3 و1 و4 و2 و6 و2 أهداف. نرتّب أولًا. مع ست قيم يوجد عددان في المنتصف، فالوسيط يقع في منتصف المسافة بينهما: 2.5."),
  draw:()=>{const V=[3,1,4,2,6,2],X=i=>400+(i-2.5)*110;return[A.wipe(),A.tx(L(t3("Mål i sex matcher","Goals in six matches","الأهداف في ست مباريات")),400,52,38),...cards6(V,X,120),
   ...medSort6(V,X,120,270).o,A.hl(170,394,460,66),...lf6(`${L(MED6)} =`,`(2 + 3) ${DIVS()} 2 = ${dfmt(2.5)}`,400,442,44,"k","g")]}},
 {say:t3("Samma mål på en tallinje. Typvärdet är 2, medianen 2,5 och medelvärdet 18 / 6 = 3. Tre lägesmått, tre olika svar!",
   "The same goals on a number line. The mode is 2, the median 2.5 and the mean 18 ÷ 6 = 3. Three averages, three different answers!",
   "الأهداف نفسها على خط الأعداد. المنوال 2، والوسيط 2.5، والوسط الحسابي 18 ÷ 6 = 3. ثلاثة مقاييس وثلاث إجابات مختلفة!"),
  draw:()=>{const X=v=>130+v*90,B=250,V=[1,2,2,3,4,6],cnt={},P=V.map(v=>{cnt[v]=(cnt[v]||0)+1;return[X(v),B-30*cnt[v]+2]});
   const mk=[[2,"g",TYP6,"2",170],[2.5,"o",MED6,dfmt(2.5),400],[3,"b",MEAN6,`18 ${DIVS()} 6 = 3`,640]];
   return[A.wipe(),A.tx(L(t3("Tre lägesmått","Three averages","ثلاثة مقاييس")),400,56,40),A.p(R.line(90,B,710,B,.3)+[0,1,2,3,4,5,6].map(v=>`M${X(v)},${B-8}v16`).join(""),"k",4),
    ...[0,1,2,3,4,5,6].map(v=>qt(v,X(v),B+38,28)),A.p(dots(P),"k",20),
    ...mk.flatMap(([v,c,t,s,lx])=>[A.arrow(lx,388,X(v),B+50,c,lx<X(v)?18:lx>X(v)?-18:0),A.tx(L(t),lx,422,32,c),A.tx(s,lx,466,34,c)])]}},
 {say:t3("Fem kompisar har sparat 100, 150, 150, 200 och 900 kr. Extremvärdet 900 drar upp medelvärdet till 300 kr. Medianen, 150 kr, visar bättre vad de flesta har.",
   "Five friends have saved 100, 150, 150, 200 and 900 kr. The outlier 900 pulls the mean up to 300 kr. The median, 150 kr, shows better what most of them have.",
   "ادّخر خمسة أصدقاء 100 و150 و150 و200 و900 كرونة. القيمة المتطرفة 900 ترفع الوسط الحسابي إلى 300 كرونة. أما الوسيط، 150 كرونة، فيبيّن أفضل ما يملكه معظمهم."),
  draw:()=>{const X=v=>100+v*.62,B=230,P=[[X(100),B-14],[X(150),B-14],[X(150),B-36],[X(200),B-14],[X(900),B-14]];
   return[A.wipe(),A.tx(L(t3("Sparade pengar (kr)","Money saved (kr)","المال المدّخر (كرونة)")),400,52,38),
    A.p(R.line(80,B,740,B,.3)+[0,1,2,3,4,5,6,7,8,9,10].map(k=>`M${X(k*100)},${B-8}v16`).join(""),"k",4),...[0,2,4,6,8,10].map(k=>qt(k*100,X(k*100),B+36,24)),
    A.p(dots(P),"k",20),A.loop(X(900),B-14,30,28,"r"),A.tx(L(t3("extremvärde","outlier","قيمة متطرفة")),X(900),B-62,30,"r"),
    A.arrow(X(150),330,X(150),B+48,"g"),...lf6(`${L(MED6)} =`,"150",X(150)-6,362,32,"g","g"),
    A.arrow(X(300)+10,394,X(300),B+48,"b"),...lf6(`${L(MEAN6)} =`,"300",X(300)+110,424,32,"b","b"),
    A.tx(`(100 + 150 + 150 + 200 + 900) ${DIVS()} 5 = 300`,400,474,32,"b")]}},
 {say:t3("Ord som favoritsport har bara typvärde. Med ett extremvärde passar medianen bäst. Annars använder medelvärdet alla värden.",
   "Words like favourite sport only have a mode. With an outlier, the median fits best. Otherwise the mean uses all the values.",
   "الكلمات مثل الرياضة المفضلة لها منوال فقط. ومع وجود قيمة متطرفة يكون الوسيط الأنسب. وفي غير ذلك يستخدم الوسط الحسابي كل القيم."),
  draw:()=>{const C=[140,400,660],o=[A.wipe(),A.tx(L(t3("Vilket lägesmått passar?","Which average fits?","أي مقياس يناسب؟")),400,52,40)];
   [[t3("ord","words","كلمات"),"g"],[t3("extremvärde","outlier","قيمة متطرفة"),"o"],[t3("liknande värden","similar values","قيم متقاربة"),"b"]].forEach(([t,c],i)=>o.push(A.tx(L(t),C[i],108,30,c)));
   const sp=L(t3(["fotboll","dans","fotboll","simning"],["football","dance","football","swimming"],["كرة القدم","الرقص","كرة القدم","السباحة"]));
   sp.forEach((s,k)=>o.push(qt(s,C[0],150+k*36,27,k%2?"k":"g")));
   o.push(A.p(R.line(C[1]-100,250,C[1]+100,250,.3),"k",3.5),A.p(dots([[C[1]-86,236],[C[1]-66,236],[C[1]-66,214],[C[1]-46,236],[C[1]+86,236]]),"k",16),A.loop(C[1]+86,236,18,18,"r"));
   o.push(A.p(R.line(C[2]-100,250,C[2]+100,250,.3),"k",3.5),A.p(dots([[C[2]-60,236],[C[2]-30,236],[C[2],236],[C[2],214],[C[2]+30,236],[C[2]+60,236]]),"k",16));
   [["g",TYP6,t3("vanligast","most common","الأكثر تكرارًا")],["o",MED6,t3("påverkas inte","not pulled away","لا يتأثّر")],["b",MEAN6,t3("alla värden räknas","all values count","كل القيم تُحسب")]]
    .forEach(([c,t,w],i)=>o.push(A.arrow(C[i],290,C[i],340,c),A.hl(C[i]-108,352,216,60),A.tx(L(t),C[i],396,36,c),A.tx(L(w),C[i],450,26)));return o}},
 {say:t3("Medelvärdet på fyra prov är 15 poäng. Då är summan 4 · 15 = 60. De tre första ger 44, så sista provet gav 60 − 44 = 16.",
   "The mean of four tests is 15 points. So the total is 4 × 15 = 60. The first three make 44, so the last test gave 60 − 44 = 16.",
   "الوسط الحسابي لأربعة اختبارات 15 نقطة. إذن المجموع 4 × 15 = 60. مجموع الثلاثة الأولى 44، فالاختبار الأخير 60 − 44 = 16."),
  draw:()=>{const X=i=>400+(i-1.5)*120,M=MUL();return[A.wipe(),A.tx(L(t3("Medelvärde 15 poäng. Vad fick hon på sista provet?","Mean 15 points. What did she get on the last test?","الوسط الحسابي 15 نقطة. كم نالت في الاختبار الأخير؟")),400,52,32),
   ...cards6([12,18,14,""],X,124),...lf6(L(t3("summa:","total:","المجموع:")),`4 ${M} 15 = 60`,400,240,40,"b","b"),A.tx("12 + 18 + 14 = 44",400,310,40),
   A.hl(220,348,360,66),A.tx("? = 60 − 44 = 16",400,396,46,"g"),A.tx("16",X(3),137,38,"g"),A.loop(X(3),124,44,40,"g")]}}
]};
const MCTX6={
 goals:{t:t3("Mål per match","Goals per match","الأهداف في كل مباراة"),lo:0,hi:9,k:1},
 bus:{t:t3("Minuter på bussen","Minutes on the bus","دقائق في الحافلة"),lo:1,hi:9,k:5},
 jump:{t:t3("Längdhopp (dm)","Long jump (dm)","الوثب الطويل (دسم)"),lo:22,hi:45,k:1},
 temp:{t:t3("Temperatur kl. 12 (°C)","Temperature at noon (°C)","درجة الحرارة ظهرًا (°C)"),lo:9,hi:26,k:1},
 pts:{t:t3("Poäng på provet","Points on the test","النقاط في الاختبار"),lo:8,hi:30,k:1},
 push:{t:t3("Armhävningar","Push-ups","تمارين الضغط"),lo:10,hi:40,k:1},
 games:{t:t3("Speltid per dag (min)","Gaming time per day (min)","وقت اللعب يوميًا (دقيقة)"),lo:4,hi:12,k:5}
};
const OUT6=[
 {t:t3("Sparade pengar (kr)","Money saved (kr)","المال المدّخر (كرونة)"),lo:10,hi:25,k:10,olo:16,ohi:30,ok:50},
 {t:t3("Skärmtid i går (min)","Screen time yesterday (min)","وقت الشاشة أمس (دقيقة)"),lo:12,hi:30,k:5,olo:80,ohi:120,ok:5},
 {t:t3("Följare på kontot","Followers on the account","المتابعون على الحساب"),lo:20,hi:60,k:5,olo:10,ohi:20,ok:100}
];
const SPORT6=[[t3("fotboll","football","كرة القدم"),t3("dans","dance","الرقص"),t3("simning","swimming","السباحة"),t3("hockey","hockey","الهوكي")],
 [t3("handboll","handball","كرة اليد"),t3("ridning","riding","ركوب الخيل"),t3("fotboll","football","كرة القدم"),t3("judo","judo","الجودو")],
 [t3("basket","basketball","كرة السلة"),t3("tennis","tennis","التنس"),t3("gymnastik","gymnastics","الجمباز"),t3("fotboll","football","كرة القدم")]];
const mHead6=(q,ctx)=>[A.wipe(),A.tx(L(q),400,50,36),A.tx(L(ctx.t),400,94,30,"b")];
LESSONS.push({id:"median6",subject:"math",grades:"6",kind:"wb",
 title:t3("Lägesmått – välj rätt","Averages – pick the right one","مقاييس النزعة المركزية: اختر المناسب"),
 icon:`<svg viewBox="0 0 320 180"><rect width="320" height="180" fill="#fff"/><path d="M30 110H290" stroke="#1d2433" stroke-width="3"/>${[[50,98],[70,98],[70,78],[90,98],[270,98]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="8" fill="#1d2433"/>`).join("")}<circle cx="270" cy="98" r="16" fill="none" stroke="#d63b2f" stroke-width="3"/><path d="M70 150V122M66 128L70 120L74 128" stroke="#1e9e5a" stroke-width="3.5" fill="none"/><path d="M130 150V122M126 128L130 120L134 128" stroke="#2257c9" stroke-width="3.5" fill="none"/><text direction="ltr" x="70" y="172" font-family="Caveat,cursive" font-weight="700" font-size="20" text-anchor="middle" fill="#1e9e5a">median</text><text direction="ltr" x="140" y="172" font-family="Caveat,cursive" font-weight="700" font-size="20" text-anchor="middle" fill="#2257c9">mean</text><text direction="ltr" x="270" y="66" font-family="Caveat,cursive" font-weight="700" font-size="26" text-anchor="middle" fill="#d63b2f">!</text></svg>`,
 steps:MED.steps,mount:wbMount(MED),
 gen(level){const D=DIVS(),M=MUL();
  if(level===0&&Math.random()<.35){/* the mode */
   const ctx=MCTX6[pick(["goals","bus","pts","push"])],n=7;let v,md;
   md=rint(ctx.lo,ctx.hi)*ctx.k;const rest=shuffle(Array.from({length:ctx.hi-ctx.lo+1},(_,k)=>(ctx.lo+k)*ctx.k).filter(x=>x!==md)).slice(0,n-3);v=shuffle([md,md,md,...rest]);   /* md 3 times, the others once */
   const X=i=>400+(i-(n-1)/2)*100;
   return{kind:"num",ans:md,show:String(md),hc:0,nt:"mode",hsay:t3("Typvärdet är det värde som finns flest gånger.","The mode is the value that appears most often.","المنوال هو القيمة الأكثر تكرارًا."),
    q:[...mHead6(rint(0,1)?t3("Vad är typvärdet?","What is the mode?","ما المنوال؟"):t3("Bestäm typvärdet.","Find the mode.","أوجد المنوال."),ctx),...cards6(v,X,200,"k",84)],
    sol:[...v.flatMap((x,i)=>x===md?[A.loop(X(i),200,52,46,"g")]:[]),A.tx(L(t3(`${md} finns ${v.filter(x=>x===md).length} gånger`,`${md} appears ${v.filter(x=>x===md).length} times`,`يتكرّر ${md} ثلاث مرات`)),400,320,34,"b"),
     A.hl(220,380,360,66),...lf6(`${L(TYP6)} =`,String(md),400,428,46,"k","g")]}}
  if(level===0){const ctx=MCTX6[pick(["goals","bus","jump","temp","pts"])],n=pick([6,8]);let v,s;
   do{v=Array.from({length:n},()=>rint(ctx.lo,ctx.hi)*ctx.k);s=v.slice().sort((a,b)=>a-b)}while(new Set(v).size<n-2||s[n/2-1]===s[n/2]&&Math.random()<.7);
   const X=i=>400+(i-(n-1)/2)*(n===8?92:112),m=medVal(s),S=medSort6(v,X,180,320);
   return{kind:"num",dec:true,ans:m,show:dfmt(m,m%1?1:0),hc:n+3,q:[...mHead6(rint(0,1)?t3("Vad är medianen?","What is the median?","ما الوسيط؟"):t3("Bestäm medianen.","Find the median.","أوجد الوسيط."),ctx),...cards6(v,X,180)],
    sol:[...S.o,A.hl(150,402,500,66),...lf6(`${L(MED6)} =`,`(${s[n/2-1]} + ${s[n/2]}) ${D} 2 = ${dfmt(m,m%1?1:0)}`,400,450,44,"k","g")]}}
  if(level===1){const ctx=MCTX6[pick(["pts","jump","push"])],n=rint(5,6);let v,m;
   do{m=rint(ctx.lo+3,ctx.hi-3);v=Array.from({length:n-1},()=>rint(ctx.lo,ctx.hi));v.push(n*m-v.reduce((a,b)=>a+b,0))}while(v[n-1]<ctx.lo||v[n-1]>ctx.hi||new Set(v).size<n-1);
   const X=i=>400+(i-(n-1)/2)*112,sum=n*m;
   if(Math.random()<.5)return{kind:"num",ans:m,show:String(m),hc:1,q:[...mHead6(rint(0,1)?t3("Vad är medelvärdet?","What is the mean?","ما الوسط الحسابي؟"):t3("Beräkna medelvärdet.","Calculate the mean.","احسب الوسط الحسابي."),ctx),...cards6(v,X,180)],
    sol:[A.tx(`${v.join(" + ")} = ${sum}`,400,300,40),A.hl(200,350,400,66),...lf6(`${L(MEAN6)} =`,`${sum} ${D} ${n} = ${m}`,400,398,44,"k","g")]};
   const j=rint(0,n-1),x=v[j],shown=v.map((a,i)=>i===j?"?":a),rest=v.filter((_,i)=>i!==j),so=rest.reduce((a,b)=>a+b,0);
   return{kind:"num",ans:x,show:String(x),hc:2,q:[A.wipe(),A.tx(L(t3(`Medelvärdet är ${m}. Vilket värde saknas?`,`The mean is ${m}. Which value is missing?`,`الوسط الحسابي ${m}. ما القيمة الناقصة؟`)),400,50,36),A.tx(L(ctx.t),400,94,30,"b"),...cards6(shown,X,180)],
    sol:[...lf6(L(t3("summa:","total:","المجموع:")),`${n} ${M} ${m} = ${sum}`,400,290,40,"b","b"),A.tx(`${rest.join(" + ")} = ${so}`,400,355,40),A.hl(200,392,400,66),A.tx(`? = ${sum} − ${so} = ${x}`,400,440,46,"g")]}}
  if(Math.random()<.3){/* which average fits best? words -> mode, an outlier -> median */
   const opts=shuffle([MEAN6,MED6,TYP6]),words=Math.random()<.5,head=[A.wipe(),A.tx(L(pick([t3("Vilket lägesmått passar bäst?","Which average fits best?","أي مقياس يناسب أكثر؟"),t3("Vilket lägesmått är bäst att använda här?","Which average is best to use here?","أي مقياس هو الأفضل هنا؟")])),400,50,36)];
   if(words){const S=pick(SPORT6),fav=L(S[0]),all=shuffle([S[0],S[0],S[0],S[1],S[2],S[1],S[3]]),X=i=>400+((i%4)-1.5)*170,Y=i=>190+Math.floor(i/4)*70;
    const q=[...head,A.tx(L(t3("Favoritsport i klassen","Favourite sport in the class","الرياضة المفضلة في الصف")),400,100,30,"b"),...all.map((w,i)=>qt(L(w),X(i),Y(i),30))];
    return{kind:"choice",opts,ans:opts.indexOf(TYP6),show:TYP6,hc:0,nt:"which",hsay:t3("Är det ord eller tal? Finns det ett extremvärde?","Are they words or numbers? Is there an outlier?","هل هي كلمات أم أعداد؟ وهل توجد قيمة متطرفة؟"),q,
     sol:[...all.flatMap((w,i)=>w===S[0]?[A.loop(X(i),Y(i)-10,70,26,"g")]:[]),A.tx(L(t3("Ord har inget medelvärde eller median.","Words have no mean or median.","الكلمات ليس لها وسط حسابي ولا وسيط.")),400,350,30,"r"),
      A.hl(150,388,500,64),A.tx(`${L(TYP6)}: ${fav}`,400,432,40,"g")]}}
   const ctx=pick(OUT6);let v,o;do{v=Array.from({length:4},()=>rint(ctx.lo,ctx.hi)*ctx.k);o=rint(ctx.olo,ctx.ohi)*ctx.ok}while(new Set(v).size<3||o<3*Math.max(...v));
   const all=shuffle([...v,o]),X=i=>400+(i-2)*130;
   return{kind:"choice",opts,ans:opts.indexOf(MED6),show:MED6,hc:0,nt:"which",hsay:t3("Är det ord eller tal? Finns det ett extremvärde?","Are they words or numbers? Is there an outlier?","هل هي كلمات أم أعداد؟ وهل توجد قيمة متطرفة؟"),
    q:[...head,A.tx(L(ctx.t),400,100,30,"b"),...cards6(all,X,200,"k",100)],
    sol:[A.loop(X(all.indexOf(o)),200,62,44,"r"),A.tx(L(t3("extremvärde","outlier","قيمة متطرفة")),X(all.indexOf(o)),280,28,"r"),A.tx(L(t3("Medianen påverkas inte av extremvärdet.","The median is not pulled away by the outlier.","الوسيط لا يتأثّر بالقيمة المتطرفة.")),400,350,30,"b"),
     A.hl(220,388,360,64),A.tx(L(MED6),400,432,42,"g")]}}
  const ctx=pick(OUT6);let v,o;do{v=Array.from({length:4},()=>rint(ctx.lo,ctx.hi)*ctx.k);o=rint(ctx.olo,ctx.ohi)*ctx.ok}while(new Set(v).size<3||o<3*Math.max(...v));
  const all=shuffle([...v,o]),s=all.slice().sort((a,b)=>a-b),md=s[2],sum=s.reduce((a,b)=>a+b,0),mn=sum/5,X=i=>400+(i-2)*130,S=medSort6(all,X,160,292,false,100);
  return{kind:"pair",ans:[md,mn],labels:[MED6,MEAN6],sep:"",check:(a,b)=>a===md&&b===mn,show:t3(`median ${fmt(md)}, medelvärde ${fmt(mn)}`,`median ${fmt(md)}, mean ${fmt(mn)}`,`الوسيط ${md}، الوسط الحسابي ${mn}`),hc:8,
   q:[...mHead6(t3("Beräkna medianen och medelvärdet.","Work out the median and the mean.","احسب الوسيط والوسط الحسابي."),ctx),...cards6(all,X,160,"k",100)],
   sol:[...S.o,A.loop(X(2),292,60,42,"g"),A.loop(X(4),292,60,42,"r"),A.tx(L(t3("extremvärde","outlier","قيمة متطرفة")),X(4),240,26,"r"),
    ...lf6(`${L(MED6)} =`,fmt(md),400,374,38,"k","g"),A.tx(`${s.map(fmt).join(" + ")} = ${fmt(sum)}`,400,422,32),...lf6(`${L(MEAN6)} =`,`${fmt(sum)} ${D} 5 = ${fmt(mn)}`,400,472,38,"k","g")]}}
});

/* =====================================================================
   4. prog6 — algorithms and programming: sequence, loops, bugs
   ===================================================================== */
const BH=50;
const btx=(s,x,y,w,z=28)=>lang==="ar"?A.tx(s,x+w-16,y,z,"k","start"):A.tx(s,x+16,y,z,"k","start");
const blk6=(x,y,w,s,c)=>[A.band(x,y,w,BH,c),A.p(R.rect(x,y,w,BH,.15),c,3.5),btx(s,x,y+34,w)];
/* repeat block: top bar, arm on the left, bottom bar; inner blocks go at (x+26, y+48) */
const rep6=(x,y,w,s,inH,c="r")=>{const T=48,a=26,B=24,h=T+inH+B,pts=[[x,y],[x+w,y],[x+w,y+T],[x+a,y+T],[x+a,y+T+inH],[x+w*.55,y+T+inH],[x+w*.55,y+h],[x,y+h]];
 return[A.band(x,y,w,T,c),A.band(x,y+T-6,a,inH+12,c),A.band(x,y+T+inH,w*.55,B,c),A.p(plines(pts),c,3.5),btx(s,x,y+33,w)]};
const bubble6=(x,y,s,c="g")=>{const w=Math.max(70,W6(s,38)+40);return[A.p(R.rect(x,y-30,w,56,.2)+`M${x+4},${y+4}L${x-18},${y+18}L${x+4},${y+16}`,c,3.5),A.tx(s,x+w/2,y+12,38,c)]};
const robot6=(cx,cy,c="k")=>A.p(R.rect(cx-17,cy-14,34,30,.2)+R.line(cx,cy-14,cx,cy-26,.2)+`M${cx-7},${cy-2}l.1,0M${cx+7},${cy-2}l.1,0`+R.line(cx-8,cy+8,cx+8,cy+8,.2),c,4);
const star6=(cx,cy,r)=>Array.from({length:10},(_,i)=>{const a=-Math.PI/2+i*Math.PI/5,rr=i%2?r*.45:r;return`${i?"L":"M"}${f1(cx+Math.cos(a)*rr)},${f1(cy+Math.sin(a)*rr)}`}).join("")+"Z";
/* block texts */
const VN=[t3("poäng","points","النقاط"),t3("mynt","coins","العملات"),t3("pengar","money","المال")];
const neg6=b=>b<0?(lang==="ar"?LR("−"+(-b)):"−"+(-b)):String(b);
const B6={
 set:(v,a)=>t3(`sätt ${v.sv} till ${a}`,`set ${v.en} to ${a}`,`اجعل ${v.ar} = ${a}`),
 chg:(v,b)=>({sv:`ändra ${v.sv} med ${b<0?"−"+(-b):b}`,en:`change ${v.en} by ${b<0?"−"+(-b):b}`,ar:`غيّر ${v.ar} بمقدار ${b<0?LR("−"+(-b)):b}`}),
 mul:(v,k)=>t3(`sätt ${v.sv} till ${v.sv} · ${k}`,`set ${v.en} to ${v.en} × ${k}`,`اجعل ${v.ar} = ${v.ar} × ${k}`),
 say:v=>t3(`säg ${v.sv}`,`say ${v.en}`,`قل ${v.ar}`),
 rep:n=>t3(`upprepa ${n} gånger`,`repeat ${n} times`,n===2?"كرّر مرتين":`كرّر ${n} مرات`),
 move:n=>t3(`gå ${n} steg`,`move ${n} steps`,n===2?"تقدّم خطوتين":`تقدّم ${n} ${n<=10?"خطوات":"خطوة"}`),
 turnR:t3("vänd höger 90°","turn right 90°","استدر يمينًا 90°"),turnL:t3("vänd vänster","turn left","استدر يسارًا")
};
const PX=60,PW=350;
/* a program of plain blocks from y0; returns actions and the y of each row */
const prog6=(list,y0,gap=66)=>{const o=[],Y=[];list.forEach(([s,c],i)=>{const y=y0+i*gap;Y.push(y);o.push(...blk6(PX,y,PW,L(s),c))});return{o,Y}};
const traceAt=(y,s,c="b")=>[A.arrow(PX+PW+14,y+BH/2,PX+PW+58,y+BH/2,c),A.tx(s,PX+PW+72,y+BH/2+11,32,c,"lead")];
const vEq=(v,x)=>`${L(v)} = ${x}`;
const PRG={steps:[
 {say:t3("En algoritm är en instruktion i exakta steg. Roboten följer stegen i ordning: 3 steg fram, vänd vänster, 2 steg fram. Där är stjärnan!",
   "An algorithm is an instruction in exact steps. The robot follows the steps in order: 3 steps forward, turn left, 2 steps forward. There's the star!",
   "الخوارزمية تعليمات بخطوات دقيقة. ينفّذ الروبوت الخطوات بالترتيب: 3 خطوات إلى الأمام، ثم يستدير يسارًا، ثم خطوتان إلى الأمام. وها هي النجمة!"),
  draw:()=>{const gx=440,gy=130,u=64,C=(i,j)=>[gx+i*u+u/2,gy+j*u+u/2];let g=R.rect(gx,gy,5*u,4*u,.3);for(let i=1;i<5;i++)g+=R.line(gx+i*u,gy,gx+i*u,gy+4*u,.1);for(let j=1;j<4;j++)g+=R.line(gx,gy+j*u,gx+5*u,gy+j*u,.1);
   const P=prog6([[B6.move(3),"b"],[B6.turnL,"b"],[B6.move(2),"b"]],150,72),[sx,sy]=C(0,3),[tx,ty]=C(3,3),[ex,ey]=C(3,1);
   return[A.wipe(),A.tx(L(t3("Algoritm = steg för steg","Algorithm = step by step","الخوارزمية = خطوة بعد خطوة")),400,62,42),A.p(g,"#9aa8c4",2.5),A.p(star6(ex,ey,22),"o",4),A.hatch(star6(ex,ey,22),"o"),robot6(sx,sy+2),
    ...P.o,...[0,1,2].map(i=>qt(i+1,PX-24,P.Y[i]+35,28,"g")),A.arrow(sx+24,sy,tx-4,ty,"g"),qt("1",(sx+tx)/2,sy+28,26,"g"),A.p(R.circ(tx,ty,12),"g",3.5),qt("2",tx+26,ty+8,26,"g"),A.arrow(tx,ty-16,ex,ey+26,"g"),qt("3",tx+24,(ty+ey)/2+8,26,"g")]}},
 {say:t3("En variabel är som en låda med ett namn som minns ett tal. Läs uppifrån och ned: poäng blir 10, sedan 15, sedan 30. Programmet säger 30.",
   "A variable is like a labelled box that remembers a number. Read from top to bottom: points becomes 10, then 15, then 30. The program says 30.",
   "المتغيّر مثل صندوق له اسم يحفظ عددًا. نقرأ من الأعلى إلى الأسفل: تصبح النقاط 10، ثم 15، ثم 30. يقول البرنامج 30."),
  draw:()=>{const v=VN[0],P=prog6([[B6.set(v,10),"o"],[B6.chg(v,5),"o"],[B6.mul(v,2),"o"],[B6.say(v),"g"]],110,74);
   return[A.wipe(),A.tx(L(t3("Vad säger programmet?","What does the program say?","ماذا يقول البرنامج؟")),400,58,40),...P.o,...traceAt(P.Y[0],vEq(v,10)),...traceAt(P.Y[1],vEq(v,15)),...traceAt(P.Y[2],vEq(v,30)),
    ...bubble6(PX+PW+30,P.Y[3]+BH/2,"30")]}},
 {say:t3("En loop upprepar block. Fyra gånger: gå 100 steg och vänd 90°. Roboten ritar en kvadrat, och vi slipper skriva åtta block.",
   "A loop repeats blocks. Four times: move 100 steps and turn 90°. The robot draws a square, and we don't have to write eight blocks.",
   "الحلقة تكرّر الأوامر. أربع مرات: تقدّم 100 خطوة واستدر 90 درجة. يرسم الروبوت مربعًا، ولا نحتاج إلى كتابة ثمانية أوامر."),
  draw:()=>{const x=490,y=150,s=190;return[A.wipe(),A.tx(L(t3("Loop","Loop","الحلقة")),400,62,44),...rep6(PX,140,PW,L(B6.rep(4)),128),...blk6(PX+26,194,PW-26,L(B6.move(100)),"b"),...blk6(PX+26,254,PW-26,L(B6.turnR),"b"),
   robot6(x,y-34),A.arrow(x+10,y,x+s,y,"g"),A.arrow(x+s,y+10,x+s,y+s,"g"),A.arrow(x+s-10,y+s,x,y+s,"g"),A.arrow(x,y+s-10,x,y,"g"),
   qt("1",x+s/2,y-14,30,"o"),qt("2",x+s+24,y+s/2+10,30,"o"),qt("3",x+s/2,y+s+36,30,"o"),qt("4",x-24,y+s/2+10,30,"o")]}},
 {say:t3("Följ loopen varv för varv i en tabell. Mynten blir 4, 8 och 12. Programmet säger 12.",
   "Follow the loop one round at a time in a table. The coins become 4, 8 and 12. The program says 12.",
   "نتتبّع الحلقة دورة بعد دورة في جدول. تصبح العملات 4 ثم 8 ثم 12. يقول البرنامج 12."),
  draw:()=>{const v=VN[1];return[A.wipe(),...blk6(PX,90,PW,L(B6.set(v,0)),"o"),...rep6(PX,156,PW,L(B6.rep(3)),62),...blk6(PX+26,210,PW-26,L(B6.chg(v,4)),"o"),...blk6(PX,306,PW,L(B6.say(v)),"g"),
   ...tab6(v,["start","1","2","3"],[0,4,8,12],90,40),...bubble6(PX+PW+30,331,"12")]}},
 {say:t3("Programmet skulle rita en kvadrat, men en sida saknas. Ett sådant fel kallas en bugg. Loopen ska köras 4 gånger, inte 3.",
   "The program was meant to draw a square, but one side is missing. A mistake like this is called a bug. The loop should run 4 times, not 3.",
   "كان يُفترض أن يرسم البرنامج مربعًا، لكن ضلعًا ناقص. يسمّى هذا الخطأ «علّة برمجية». يجب أن تتكرّر الحلقة 4 مرات، لا 3."),
  draw:()=>{const x=490,y=150,s=190;return[A.wipe(),A.tx(L(t3("Hitta buggen!","Find the bug!","اعثر على العلّة!")),400,62,44,"r"),...rep6(PX,140,PW,L(B6.rep(3)),128),...blk6(PX+26,194,PW-26,L(B6.move(100)),"b"),...blk6(PX+26,254,PW-26,L(B6.turnR),"b"),
   robot6(x,y-34),A.arrow(x+10,y,x+s,y,"g"),A.arrow(x+s,y+10,x+s,y+s,"g"),A.arrow(x+s-10,y+s,x,y+s,"g"),A.p(R.dashed(x,y+s-10,x,y+10),"r",4),qt("?",x-26,y+s/2+10,36,"r"),
   A.loop(PX+PW/2,164,PW/2+16,34,"r"),A.hl(PX-6,384,PW+12,62),A.tx(L(B6.rep(4)),PX+PW/2,428,36,"g")]}}
]};
/* trace table to the right of the program: header + rows */
function tab6(v,rows,vals,y0=90,rh=44,x0=480,w=270){const o=[],h=rh*(rows.length+1);
 o.push(A.p(R.rect(x0,y0,w,h,.3)+R.line(x0,y0+rh,x0+w,y0+rh,.2)+R.line(x0+w*.45,y0,x0+w*.45,y0+h,.2),"k",3));
 o.push(A.tx(L(t3("varv","round","الدورة")),x0+w*.225,y0+rh*.5+10,26,"b"),A.tx(L(v),x0+w*.725,y0+rh*.5+10,26,"o"));
 const ty=rh*.5+10;rows.forEach((r,i)=>{const last=i===rows.length-1;o.push(qt(L(r==="start"?t3("start","start","البداية"):r),x0+w*.225,y0+rh*(i+1)+ty,26,last?"g":"k"),qt(vals[i],x0+w*.725,y0+rh*(i+1)+ty,28,last?"g":"k"))});return o}
const BUGCTX=[
 {v:1,t:(a,b,n)=>[t3(`Spelet startar med ${a} mynt. Varje runda ger ${b} mynt.`,`The game starts with ${a} coins. Each round gives ${b} coins.`,`تبدأ اللعبة بـ${a} عملة. كل جولة تعطي ${b} عملات.`),
   t3(`Du spelar ${n} rundor. Programmet ska räkna ut dina mynt.`,`You play ${n} rounds. The program should work out your coins.`,`تلعب ${n} جولات. يجب أن يحسب البرنامج عملاتك.`)]},
 {v:2,t:(a,b,n)=>[t3(`Ali har ${a} kr. Han sparar ${b} kr varje vecka i ${n} veckor.`,`Ali has ${a} kr. He saves ${b} kr every week for ${n} weeks.`,`مع علي ${a} ${arKr(a)}. يدّخر ${b} كرونة كل أسبوع لمدة ${n} أسابيع.`),
   t3("Programmet ska räkna ut hur mycket han har till slut.","The program should work out how much he has at the end.","يجب أن يحسب البرنامج كم يصبح معه في النهاية.")]},
 {v:0,t:(a,b,n)=>[t3(`Du har ${a} poäng. Varje bana ger ${b} poäng.`,`You have ${a} points. Each level gives ${b} points.`,`معك ${a} نقطة. كل مرحلة تعطي ${b} نقاط.`),
   t3(`Du klarar ${n} banor. Programmet ska räkna ut dina poäng.`,`You clear ${n} levels. The program should work out your points.`,`تجتاز ${n} مراحل. يجب أن يحسب البرنامج نقاطك.`)]}
];
LESSONS.push({id:"prog6",subject:"math",grades:"6",kind:"wb",
 title:t3("Algoritmer och programmering","Algorithms and programming","الخوارزميات والبرمجة"),
 icon:`<svg viewBox="0 0 320 180"><rect width="320" height="180" fill="#fff"/><rect x="40" y="22" width="170" height="30" rx="7" fill="#e07b00" fill-opacity=".18" stroke="#e07b00" stroke-width="3"/><path d="M40 62H210V88H62V118H140V138H40Z" fill="#d63b2f" fill-opacity=".14" stroke="#d63b2f" stroke-width="3" stroke-linejoin="round"/><rect x="62" y="88" width="148" height="30" rx="7" fill="#2257c9" fill-opacity=".18" stroke="#2257c9" stroke-width="3"/><rect x="40" y="146" width="120" height="28" rx="7" fill="#1e9e5a" fill-opacity=".18" stroke="#1e9e5a" stroke-width="3"/><path d="M240 60H290V110H240Z" fill="none" stroke="#1e9e5a" stroke-width="3.5"/><path d="M232 52l8 8" stroke="#1d2433" stroke-width="3"/></svg>`,
 steps:PRG.steps,mount:wbMount(PRG),
 gen(level){
  if(level===0&&Math.random()<.35){/* a loop: how far does the robot go? */
   const n=rint(2,6),s=pick([10,20,25,30,50,100]),e=Math.random()<.5?pick([5,10,15,20]):0,tot=n*s+e,M=MUL();
   const o=[A.wipe(),A.tx(L(rint(0,1)?t3("Hur många steg går roboten sammanlagt?","How many steps does the robot move altogether?","كم خطوة يتقدّم الروبوت في المجموع؟"):t3("Loopen körs. Hur långt går roboten totalt?","The loop runs. How far does the robot go in total?","تُنفَّذ الحلقة. كم خطوة يتقدّم الروبوت في المجموع؟")),400,62,34),
    ...rep6(PX,110,PW,L(B6.rep(n)),62),...blk6(PX+26,164,PW-26,L(B6.move(s)),"b")];
   if(e)o.push(...blk6(PX,260,PW,L(B6.move(e)),"b"));
   o.push(robot6(610,140));
   return{kind:"num",ans:tot,show:String(tot),hc:0,nt:"loop",hsay:t3("Loopen kör blocken inuti flera gånger. Hur många gånger? Glöm inte blocken efter loopen.","The loop runs the blocks inside several times. How many times? Don't forget the blocks after the loop.","الحلقة تنفّذ الأوامر التي داخلها عدة مرات. كم مرة؟ ولا تنسَ الأوامر بعد الحلقة."),q:o,
    sol:[A.tx(`${n} ${M} ${s} = ${n*s}`,610,250,38,"b"),...(e?[A.tx(`${n*s} + ${e} = ${tot}`,610,310,38)]:[]),A.hl(480,350,260,62),A.tx(L(t3(`${tot} steg`,`${tot} steps`,`${tot} خطوة`)),610,394,42,"g")]}}
  if(level===0){const v=pick(VN);let a,ops,vals;
   do{a=rint(2,20);const k=rint(2,3);ops=[];vals=[a];let x=a;for(let i=0;i<pick([2,3]);i++){const t=rint(0,2);let b;
     if(t===0){b=rint(2,15);x+=b;ops.push(B6.chg(v,b))}else if(t===1){b=-rint(2,9);x+=b;ops.push(B6.chg(v,b))}else{x*=k;ops.push(B6.mul(v,k))}vals.push(x)}}
   while(vals.some(x=>x<0)||vals[vals.length-1]>150||new Set(ops.map(o=>o.en)).size<ops.length||vals.slice(0,-1).includes(vals[vals.length-1]));
   const list=[[B6.set(v,a),"o"],...ops.map(o=>[o,"o"]),[B6.say(v),"g"]],gap=list.length>4?66:76,P=prog6(list,100,gap),ans=vals[vals.length-1];
   return{kind:"num",ans,show:String(ans),hc:4,q:[A.wipe(),A.tx(L(t3("Vad säger programmet?","What does the program say?","ماذا يقول البرنامج؟")),400,54,38),...P.o],
    sol:[...vals.flatMap((x,i)=>traceAt(P.Y[i],vEq(v,x),i===vals.length-1?"k":"b")),...bubble6(PX+PW+30,P.Y[vals.length]+BH/2,String(ans))]}}
  if(level===1){const v=pick(VN),a=rint(0,12),n=rint(3,5),b=rint(2,9),after=rint(0,2),vals=[a];for(let i=1;i<=n;i++)vals.push(a+i*b);let fin=vals[n],extra=null;
   if(after===1){const c=rint(2,9);extra=B6.chg(v,c);fin+=c}else if(after===2){extra=B6.mul(v,2);fin*=2}
   const o=[A.wipe(),A.tx(L(t3("Vad säger programmet?","What does the program say?","ماذا يقول البرنامج؟")),400,48,36),...blk6(PX,80,PW,L(B6.set(v,a)),"o"),...rep6(PX,146,PW,L(B6.rep(n)),62),...blk6(PX+26,200,PW-26,L(B6.chg(v,b)),"o")];
   let y=296;if(extra){o.push(...blk6(PX,y,PW,L(extra),"o"));y+=66}o.push(...blk6(PX,y,PW,L(B6.say(v)),"g"));
   const rows=["start",...Array.from({length:n},(_,i)=>String(i+1))],tv=vals.slice();if(extra){rows.push(t3("efter","after","بعدها"));tv.push(fin)}rows.push(t3("säger","says","يقول"));tv.push(fin);
   const rh=Math.min(44,Math.floor(360/(rows.length+1)));
   return{kind:"num",ans:fin,show:String(fin),hc:7,q:o,sol:tab6(v,rows,tv,74,rh)}}
  const C=pick(BUGCTX),v=VN[C.v],a=C.v===0?rint(2,6)*10:C.v===1?rint(3,10)*5:rint(2,10)*5,b=C.v===2?rint(2,6)*10:rint(3,9),n=rint(3,8),which=rint(0,2);
  let A2=a,N2=n,B2=b;const da=C.v===0?10:5,db=C.v===2?10:1;
  if(which===0){A2=a+pick([-1,1])*da;if(A2<=0)A2=a+da}if(which===1)N2=n+pick([-1,1]);if(which===2){B2=b+pick([-1,1])*db;if(B2<=0)B2=b+db}const T=C.t(a,b,n),right=a+n*b,got=A2+N2*B2;
  const blocks=[B6.set(v,A2),B6.rep(N2),B6.chg(v,B2)],fix=[B6.set(v,a),B6.rep(n),B6.chg(v,b)][which];
  const q=[A.wipe(),A.tx(L(T[0]),400,46,28),A.tx(L(T[1]),400,84,28),A.tx(L(t3("Programmet räknar fel. Vilket block är fel?","The program gets it wrong. Which block is wrong?","البرنامج يحسب خطأً. أي أمر فيه الخطأ؟")),400,126,28,"b"),
   ...blk6(PX,160,PW,L(blocks[0]),"o"),...rep6(PX,226,PW,L(blocks[1]),62),...blk6(PX+26,280,PW-26,L(blocks[2]),"o"),...blk6(PX,376,PW,L(B6.say(v)),"g")];
  const by=[160,226,280][which],bx=which===2?PX+26:PX,bw=which===2?PW-26:PW;
  return{kind:"choice",opts:blocks,ans:which,show:blocks[which],hc:2,q,
   sol:[A.tx(L(t3("Programmet säger","The program says","يقول البرنامج")),610,200,30,"r"),A.tx(String(got),610,246,40,"r"),
    A.loop(bx+bw/2,by+25,bw/2+14,34,"r"),A.tx(L(t3("Det ska bli","It should be","يجب أن يكون")),610,306,30,"g"),A.tx(`${a} + ${n} ${MUL()} ${b} = ${right}`,610,352,36,"g"),
    A.hl(440,404,340,58),A.tx(L(fix),610,444,32,"g")]}}
});

/* ---------------- simpler explanations and hints ---------------- */
const cone6=(cx,ty)=>[A.p(`M${cx-22},${ty+26}L${cx},${ty+92}L${cx+22},${ty+26}`+R.line(cx-14,ty+44,cx+8,ty+70,.1)+R.line(cx+14,ty+44,cx-8,ty+70,.1),"o",4),A.p(R.circ(cx,ty+14,22),"r",4),A.hatch(`M${cx-20},${ty+20}A20,20 0 1,1 ${cx+20},${ty+20}Z`,"r")];
Object.assign(HELPX,{
 eq6:[{say:t3("Tre glassar och en godispåse för 10 kr kostar 40 kr. Ta bort godiset: tre glassar kostar 30 kr. Då kostar en glass 10 kr.",
   "Three ice creams and a bag of sweets for 10 kr cost 40 kr. Take away the sweets: three ice creams cost 30 kr. So one ice cream costs 10 kr.",
   "ثلاث بوظات وكيس حلوى بـ10 كرونات تكلّف 40 كرونة. نزيل الحلوى: ثلاث بوظات بـ30 كرونة. إذن البوظة الواحدة بـ10 كرونات."),
  draw:()=>[...[0,1,2].flatMap(i=>cone6(110+i*80,90)),A.tx("+",350,160,48),A.p(R.rect(390,112,90,80,.3),"b",4),A.tx(L(KR(10)),435,162,28,"b"),A.tx("=",530,160,48),A.tx(L(KR(40)),640,166,46,"g"),
   A.p(R.line(380,200,490,104,.2),"r",5),A.tx("− 10",435,240,36,"r"),A.tx("− 10",640,240,36,"r"),
   A.tx(`3 ${L(t3("glassar","ice creams","بوظات"))} = ${L(KR(30))}`,400,330,44),A.hl(210,370,380,66),A.tx(`1 ${L(t3("glass","ice cream","بوظة"))} = 30 ${DIVS()} 3 = ${L(KR(10))}`,400,418,42,"g")]}],
 pattern6:[{say:t3("Ett bord har 4 stolar. Ställer vi bord i rad får varje nytt bord 2 stolar till: 4, 6, 8. Mönstret ökar med 2.",
   "One table has 4 chairs. If we put tables in a row, each new table adds 2 chairs: 4, 6, 8. The pattern grows by 2.",
   "للطاولة الواحدة 4 كراسٍ. إذا صففنا الطاولات، تضيف كل طاولة جديدة كرسيين: 4، 6، 8. النمط يزيد 2."),
  draw:()=>{const F=FIG6.tab,r=figRow(F,240);return[...r.o,...[4,6,8].map((n,i)=>A.tx(L(F.cnt(n)),r.cx[i],330,32,"b")),...steps6(r.cx,352,2),A.hl(250,428,300,62),A.tx("4, 6, 8, 10, 12 …",400,472,40,"g")]}}],
 median6:[{say:t3("Fyra kompisar har 20 kr var och en har 900 kr. Medelvärdet blir 196 kr, fast nästan ingen har så mycket. Medianen, 20 kr, visar vad de flesta har.",
   "Four friends have 20 kr each and one has 900 kr. The mean is 196 kr, even though almost nobody has that much. The median, 20 kr, shows what most of them have.",
   "مع كل واحد من أربعة أصدقاء 20 كرونة، ومع واحد 900 كرونة. الوسط الحسابي 196 كرونة مع أن أحدًا تقريبًا لا يملك هذا المبلغ. أما الوسيط، 20 كرونة، فيبيّن ما يملكه معظمهم."),
  draw:()=>{const X=i=>140+i*130;return[...[0,1,2,3,4].map(i=>kid6(X(i),250,150,i===4?"o":"k")),...[0,1,2,3].map(i=>A.tx("20",X(i),300,36)),A.tx("900",X(4),300,40,"o"),
   A.p(R.circ(X(4)+40,170,26),"o",4),A.tx("kr",X(4)+40,180,26,"o"),
   ...lf6(`${L(MEAN6)} =`,`980 ${DIVS()} 5 = 196`,400,370,36,"b","b"),A.hl(230,402,340,62),...lf6(`${L(MED6)} =`,"20",400,448,42,"k","g")]}}],
 prog6:[{say:t3("En algoritm är som ett recept. Ordningen är viktig: du kan inte lägga på osten innan du har tagit fram brödet.",
   "An algorithm is like a recipe. The order matters: you can't put the cheese on before you have got the bread out.",
   "الخوارزمية مثل وصفة الطبخ. الترتيب مهم: لا يمكنك أن تضع الجبن قبل أن تُخرج الخبز."),
  draw:()=>{const X=[150,400,650],y=170;return[A.p(`M${X[0]-50},${y+50}V${y-20}Q${X[0]-50},${y-58} ${X[0]-14},${y-50}Q${X[0]},${y-66} ${X[0]+14},${y-50}Q${X[0]+50},${y-58} ${X[0]+50},${y-20}V${y+50}Z`,"o",4.5),
   A.p(R.line(X[1]-60,y+20,X[1]+20,y-20,.2),"k",5),A.p(`M${X[1]+20},${y-20}L${X[1]+60},${y-40}L${X[1]+50},${y-10}Z`,"k",4),A.p(R.line(X[1]-40,y+40,X[1]+40,y+40,.2),"o",8),
   A.p(`M${X[2]-55},${y+40}L${X[2]+55},${y+40}L${X[2]+20},${y-40}Z`+R.circ(X[2]+5,y+15,8)+R.circ(X[2]+22,y-8,6),"#c79c00",4.5),
   ...[0,1,2].map(i=>A.p(R.circ(X[i],y+110,24),"g",4)),...[0,1,2].map(i=>A.tx(i+1,X[i],y+122,32,"g")),A.arrow(X[0]+40,y+110,X[1]-40,y+110,"g"),A.arrow(X[1]+40,y+110,X[2]-40,y+110,"g"),
   ...[t3("ta fram bröd","get the bread","أخرج الخبز"),t3("bred smör","spread butter","ادهن الزبدة"),t3("lägg på ost","add cheese","ضع الجبن")].map((t,i)=>A.tx(L(t),X[i],y+190,30))]}}]
});
Object.assign(HINTSX,{
 eq6:[{say:t3("Vad ska bort, eller delas lika, på båda sidor så att påsen x blir ensam?","What should you take away, or share equally, on both sides so the bag x is left on its own?","ما الذي يجب أن تزيله أو تقسمه بالتساوي في الكفّتين حتى يبقى الكيس x وحده؟"),cut:g=>g.sol.slice(0,g.hc)},
  {say:t3("Steg 1: ta bort de lösa klossarna på båda sidor. Steg 2: dela det som är kvar lika mellan påsarna.","Step 1: take the loose blocks off both sides. Step 2: share what is left equally between the bags.","الخطوة 1: أزل المكعبات المنفردة من الكفّتين. الخطوة 2: وزّع الباقي بالتساوي على الأكياس."),cut:g=>g.sol.slice(0,g.hc)},
  {say:t3("Gör samma sak på båda sidor. Ta först bort talet som läggs till eller dras ifrån, och dela sedan med talet framför x.","Do the same to both sides. First undo the number that is added or subtracted, then divide by the number in front of x.","افعل الشيء نفسه في الطرفين. ألغِ أولًا العدد المضاف أو المطروح، ثم اقسم على العدد الذي أمام x."),cut:g=>g.sol.slice(0,g.hc)}],
 pattern6:[{say:t3("Räkna i figur 1, 2 och 3. Hur många fler blir det varje gång?","Count in figures 1, 2 and 3. How many more are there each time?","عُدّ في الأشكال 1 و2 و3. كم يزيد العدد في كل مرة؟"),cut:g=>g.sol.slice(0,g.hc)},
  {say:t3("Hur många steg är det från figur 1 till den figur som efterfrågas? Hur mycket ökar det i varje steg?","How many steps are there from figure 1 to the figure you are asked about? How much does it grow in each step?","كم خطوة من الشكل 1 إلى الشكل المطلوب؟ وكم يزيد العدد في كل خطوة؟"),cut:g=>g.sol.slice(0,g.hc)},
  {say:t3("Skriv regeln som ett uttryck med n. Sätt uttrycket lika med talet och lös ekvationen.","Write the rule as an expression with n. Set it equal to the number and solve the equation.","اكتب القاعدة مقدارًا جبريًا فيه n. ثم اجعله مساويًا للعدد وحلّ المعادلة."),cut:g=>g.sol.slice(0,g.hc)}],
 median6:[{say:t3("Sortera talen. Med ett jämnt antal finns två tal i mitten. Medianen ligger mitt emellan dem.","Sort the numbers. With an even count there are two numbers in the middle. The median lies halfway between them.","رتّب الأعداد. مع عدد زوجي من القيم يوجد عددان في المنتصف، والوسيط في منتصف المسافة بينهما."),cut:g=>g.sol.slice(0,g.hc)},
  {say:t3("Medelvärde = summan delat med antalet. Saknas ett värde? Räkna först ut vad summan måste vara.","Mean = the total divided by the count. Is a value missing? First work out what the total must be.","الوسط الحسابي = المجموع ÷ العدد. هل هناك قيمة ناقصة؟ احسب أولًا كم يجب أن يكون المجموع."),cut:g=>g.sol.slice(0,g.hc)},
  {say:t3("Sortera och ta talet i mitten. För medelvärdet: lägg ihop alla fem och dela med 5.","Sort and take the middle number. For the mean: add all five and divide by 5.","رتّب وخذ العدد الأوسط. وللوسط الحسابي: اجمع الخمسة واقسم على 5."),cut:g=>g.sol.slice(0,g.hc)}],
 prog6:[{say:t3("Gå uppifrån och ned. Skriv vad variabeln är efter varje block.","Go from top to bottom. Write down what the variable is after each block.","اقرأ من الأعلى إلى الأسفل، واكتب قيمة المتغيّر بعد كل أمر."),cut:g=>g.sol.slice(0,g.hc)},
  {say:t3("Gör en tabell och gå igenom loopen ett varv i taget.","Make a table and go through the loop one round at a time.","ارسم جدولًا ونفّذ الحلقة دورة بعد دورة."),cut:g=>g.sol.slice(0,g.hc)},
  {say:t3("Jämför varje tal i programmet med texten. Vilket tal stämmer inte?","Compare each number in the program with the text. Which number doesn't match?","قارن كل عدد في البرنامج بالنص. أي عدد لا يطابقه؟"),cut:g=>g.sol.slice(0,g.hc)}]
});
/* a question type can bring its own hint text (g.hsay) and cut (g.hcut); the app calls cut(g) just before it reads say */
for(const id of ["eq6","pattern6","median6","prog6"]){const H=HINTSX[id];if(H)HINTSX[id]=H.map(h=>{let cur=null;
 return{cut:g=>{cur=g;return g.hcut?g.hcut(g):h.cut(g)},get say(){return cur&&cur.hsay||h.say}}})}
}
