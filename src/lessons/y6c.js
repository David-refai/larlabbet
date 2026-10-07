/* ===== y6c.js ===== */
/* =====================================================================
   YEAR 6 (y6c): scale, area of triangle and parallelogram, the circle,
   volume of a cuboid. Everything sits in one block so helper names never
   clash with the other lesson files.
   ===================================================================== */
{
const LU=()=>lang==="sv"?"liter":"L";   /* a lone "l" looks like "/" in the marker font */
const T=(sv,en,ar)=>L(t3(sv,en,ar));
const nf=x=>{x=Math.round(x*1000)/1000;if(Number.isInteger(x))return fmt(x);return dfmt(x,Math.round(x*100)%10?2:1)};
const fin=a=>Object.assign(a,{fin:true});
const noFin=g=>g.sol.filter(a=>!a.fin);
const fitS=(s,maxw,size)=>Math.min(size,maxw/(String(s).length*(/[؀-ۿ]/.test(s)?.5:.47)));
const wrapL=(s,max)=>{const o=[];let cur="";s.split(" ").forEach(w=>{if(cur&&(cur+" "+w).length>max){o.push(cur);cur=w}else cur=cur?cur+" "+w:w});if(cur)o.push(cur);return o};
const nb=s=>s.replace(/(\d) (?=(mm|cm|dm|m|km|cm²|cm³|dm³|l|kr|سم|مم|م|كم|لترًا|لتر)(\b|\s|$|[.,?؟²³]))/g,"$1 ");
const para=(s,x,y,size,max,gap,c="k")=>{const ar=/[؀-ۿ]/.test(s);return wrapL(nb(s),ar?Math.round(max*1.3):max).map((l,i)=>A.tx(l,x,y+i*(ar?Math.round(gap*1.3):gap),size,c))};
const tf=(s,x,y,size,maxw,c="k")=>A.tx(s,x,y,fitS(s,maxw,size),c);
const ra=(x,y,dx,dy,s=18)=>A.p(`M${f1(x+dx*s)},${f1(y)}l0,${dy*s}l${-dx*s},0`,"r",3);
const vdim=(x,y1,y2,lab,c="k",side=-1)=>[A.p(R.line(x,y1,x,y2,.2)+`M${x-8},${y1}h16M${x-8},${y2}h16`,c,2.5),A.tx(lab,x+side*12,(y1+y2)/2+10,28,c,side<0?"end":"start")];
const lgrid=(x,y,c,r,u)=>{let g="";for(let i=0;i<=c;i++)g+=`M${f1(x+i*u)},${f1(y)}v${f1(r*u)}`;for(let j=0;j<=r;j++)g+=`M${f1(x)},${f1(y+j*u)}h${f1(c*u)}`;return A.p(g,"#9aa8c4",1.6)};
const poly=pts=>"M"+pts.map(([x,y])=>`${f1(x)},${f1(y)}`).join("L")+"Z";
const strike=(x,y,w,c="r")=>A.p(R.line(x-w/2,y-12,x+w/2,y-12,.3),c,4);
const tagBox=(cx,cy,s,size=32,c="o")=>{const w=Math.max(120,String(s).length*size*.5+30);return[A.p(R.rect(cx-w/2,cy-size*.95,w,size*1.45,.3),c,3.5),A.tx(s,cx,cy+size*.08,size,c)]};
const ICO=(body)=>`<svg viewBox="0 0 320 180"><rect width="320" height="180" fill="#fff"/>${body}</svg>`;
const CV=`font-family="Caveat,cursive" font-weight="700" text-anchor="middle"`;
const arTimes=k=>k===2?"مرتين":k<=10?`${k} مرات`:`${k} مرة`;

/* =====================================================================
   1. scale6: scale on maps and drawings
   ===================================================================== */
const SCL=k=>T(`skala 1:${fmt(k)}`,`scale 1:${fmt(k)}`,`المقياس 1:${fmt(k)}`);
const cmRul=(x,y,n,u)=>{let d=R.rect(x-10,y,n*u+20,50,.3);for(let i=0;i<=2*n;i++)d+=`M${f1(x+i*u/2)},${y}v${i%2?10:20}`;
 const o=[A.p(d,"k",2.5)];for(let i=0;i<=n;i++)if(u>=34||i%2===0)o.push(qt(i,x+i*u,y+43,22));return o};
const plan=(x,y,w,h)=>[A.p(R.rect(x,y,w,h,.4),"k",5.5),A.p(`M${f1(x+w*.64)},${f1(y-5)}h${f1(w*.24)}M${f1(x+w*.64)},${f1(y+5)}h${f1(w*.24)}`,"b",3),
 A.p(`M${f1(x+14)},${f1(y+h)}L${f1(x+14)},${f1(y+h-Math.min(44,h*.35))}A${f1(Math.min(44,h*.35))},${f1(Math.min(44,h*.35))} 0 0 1 ${f1(x+14+Math.min(44,h*.35))},${f1(y+h)}`,"k",2.5)];
const houseI=(x,y,s=1)=>A.p(R.rect(x-14*s,y-24*s,28*s,24*s,.2)+`M${f1(x-19*s)},${f1(y-22*s)}L${x},${f1(y-40*s)}L${f1(x+19*s)},${f1(y-22*s)}`+R.rect(x-4*s,y-12*s,8*s,12*s,.1),"r",3);
const tentI=(x,y,s=1)=>A.p(`M${f1(x-22*s)},${y}L${x},${f1(y-34*s)}L${f1(x+22*s)},${y}Z M${x},${f1(y-34*s)}L${x},${y}M${x},${f1(y-34*s)}l0,-10l12,4l-12,4`,"g",3);
const tree=(x,y)=>R.circ(x,y-26,14)+R.line(x,y-12,x,y,.1);
const mapBg=(x,y,w,h,lake)=>[A.p(R.rect(x,y,w,h,.3),"k",3.5),A.hatch(`M${lake[0]-lake[2]},${lake[1]}a${lake[2]},${lake[3]} 0 1,0 ${2*lake[2]},0a${lake[2]},${lake[3]} 0 1,0 ${-2*lake[2]},0Z`,"b"),
 A.p(`M${lake[0]-lake[2]},${lake[1]}a${lake[2]},${lake[3]} 0 1,0 ${2*lake[2]},0a${lake[2]},${lake[3]} 0 1,0 ${-2*lake[2]},0`,"b",3),
 A.p(tree(x+30,y+h-14)+tree(x+62,y+h-24)+tree(x+w-34,y+h-14)+tree(x+w-66,y+h-26),"g",3)];
const bug=(cx,cy,r)=>{const o=[A.p(`M${f1(cx-r)},${cy}a${r},${f1(r*.85)} 0 1,0 ${2*r},0a${r},${f1(r*.85)} 0 1,0 ${-2*r},0`,"r",r>30?4.5:3),A.hatch(`M${f1(cx-r)},${cy}a${r},${f1(r*.85)} 0 1,0 ${2*r},0a${r},${f1(r*.85)} 0 1,0 ${-2*r},0Z`,"r"),
 A.p(R.circ(cx+r*1.08,cy,r*.42),"k",r>30?4:2.5)];
 if(r>30){o.push(A.p(R.line(cx-r,cy,cx+r*.66,cy,.2),"k",3),A.p(dots([[cx-r*.45,cy-r*.4],[cx-r*.45,cy+r*.4],[cx+r*.2,cy-r*.45],[cx+r*.2,cy+r*.45],[cx-r*.1,cy-r*.12]]),"k",r*.24),
  A.p([-.5,0,.5].map(t=>`M${f1(cx+t*r)},${f1(cy-r*.82)}l${f1(-r*.12)},${f1(-r*.3)}M${f1(cx+t*r)},${f1(cy+r*.82)}l${f1(-r*.12)},${f1(r*.3)}`).join(""),"k",3))}
 else o.push(A.p(dots([[cx-r*.4,cy-r*.35],[cx-r*.4,cy+r*.35],[cx+r*.25,cy]]),"k",Math.max(4,r*.3)));
 return o};
const lenArrow=(x1,x2,y,lab,c="k",size=30)=>[A.p(R.line(x1,y,x2,y,.2)+`M${x1},${y-10}v20M${x2},${y-10}v20`+`M${x1+12},${y-7}L${x1},${y}L${x1+12},${y+7}M${x2-12},${y-7}L${x2},${y}L${x2-12},${y+7}`,c,2.5),A.tx(lab,(x1+x2)/2,y+size+6,size,c)];
const pool=(x,y,w,h)=>{let ln="";for(let i=1;i<4;i++)ln+=R.dashed(x+8,y+h*i/4,x+w-8,y+h*i/4,10);return[A.hatch(`M${x},${y}h${w}v${h}h${-w}Z`,"b"),A.p(R.rect(x,y,w,h,.3),"b",4),A.p(ln,"#9aa8c4",2)]};
const houseS=(x,y,w,h)=>[A.p(R.rect(x,y-h,w,h,.3)+`M${f1(x-10)},${f1(y-h+4)}L${f1(x+w/2)},${f1(y-h-h*.55)}L${f1(x+w+10)},${f1(y-h+4)}`+R.rect(x+w*.12,y-h*.55,w*.2,h*.55,.2)+R.rect(x+w*.5,y-h*.7,w*.3,h*.3,.2),"o",4)];
const busS=(x,y,w,h)=>[A.p(R.rect(x,y-h,w,h*.82,.3)+[0,1,2,3,4].map(i=>R.rect(x+w*(.05+i*.17),y-h*.9,w*.12,h*.3,.1)).join("")+R.circ(x+w*.2,y-h*.14,h*.16)+R.circ(x+w*.8,y-h*.14,h*.16),"o",4)];
const carS=(x,y,len,c="b")=>{const s=len/100,P=(a,b)=>`${f1(x+a*s)},${f1(y+b*s)}`;
 return A.p(`M${P(0,-12)}L${P(0,-28)}L${P(16,-31)}L${P(30,-48)}L${P(68,-48)}L${P(82,-31)}L${P(100,-27)}L${P(100,-12)}Z`+R.circ(x+22*s,y-11*s,9.5*s)+R.circ(x+78*s,y-11*s,9.5*s)+`M${P(34,-44)}L${P(48,-44)}L${P(48,-31)}L${P(22,-31)}Z M${P(54,-44)}L${P(66,-44)}L${P(77,-31)}L${P(54,-31)}Z`,c,len>150?4.5:3)};

const SC6={steps:[
 {say:t3("Skala 1:100 betyder att 1 cm på ritningen är 100 cm i verkligheten. Ritningen är 100 gånger mindre än verkligheten.",
   "A scale of 1:100 means that 1 cm on the drawing is 100 cm in reality. The drawing is 100 times smaller than reality.",
   "مقياس الرسم 1:100 يعني أن 1 سم في الرسم يساوي 100 سم في الواقع. فالرسم أصغر من الواقع 100 مرة."),
  draw:()=>[A.wipe(),A.tx("1",270,150,100,"b"),A.tx(":",405,140,100),A.tx("100",540,150,100,"r"),
   A.tx(T("på ritningen","on the drawing","في الرسم"),270,215,32,"b"),A.tx(T("i verkligheten","in reality","في الواقع"),540,215,32,"r"),
   A.p(R.line(90,330,150,330,.1)+"M90,318v24M150,318v24","b",5),A.tx("1 cm",120,300,30,"b"),
   A.arrow(172,330,252,330,"k"),A.tx(`${MUL()} 100`,212,306,26),
   A.p(R.line(280,330,720,330,.3)+"M280,318v24M720,318v24","r",5),A.tx("100 cm = 1 m",500,300,32,"r"),
   A.tx(T("100 gånger mindre","100 times smaller","أصغر 100 مرة"),400,430,44,"o")]},
 {say:t3("Sovrummet är ritat i skala 1:100. På ritningen är det 5 cm långt, så i verkligheten är det 5 · 100 = 500 cm, alltså 5 m. Bredden 3 cm blir 3 m.",
   "The bedroom is drawn at a scale of 1:100. On the drawing it is 5 cm long, so in reality it is 5 × 100 = 500 cm, which is 5 m. The width of 3 cm becomes 3 m.",
   "رُسمت غرفة النوم بمقياس 1:100. طولها في الرسم 5 سم، فيكون طولها في الواقع 5 × 100 = 500 سم، أي 5 م. والعرض 3 سم يصبح 3 م."),
  draw:()=>{const M=MUL();return[A.wipe(),...plan(100,150,300,180),A.p(R.rect(280,162,108,66,.2)+R.rect(290,172,28,46,.1),"b",3),A.tx(T("säng","bed","سرير"),346,206,24,"b"),
   A.tx("5 cm",250,134,32,"b"),A.tx("3 cm",88,250,30,"b","end"),...tagBox(250,392,SCL(100),30),
   A.tx(`5 cm ${M} 100 = 500 cm`,615,160,36),A.hl(475,190,280,62),A.tx("500 cm = 5 m",615,236,42,"g"),
   A.tx(`3 cm ${M} 100 = 300 cm`,615,330,36),A.tx("300 cm = 3 m",615,400,42,"g")]}},
 {say:t3("På en karta i skala 1:50 000 är 1 cm lika med 50 000 cm i verkligheten. Det är 500 m.",
   "On a map at a scale of 1:50,000, 1 cm is 50,000 cm in reality. That is 500 m.",
   "على خريطة بمقياس 1:50000 يساوي 1 سم على الخريطة 50000 سم في الواقع، أي 500 م."),
  draw:()=>[A.wipe(),...mapBg(40,60,410,390,[250,130,70,38]),houseI(110,255,1.4),tentI(390,255,1.4),A.p(dots([[110,262],[390,262]]),"k",12),
   A.tx(T("stugan","cabin","الكوخ"),110,185,28,"r"),A.tx(T("tältet","tent","الخيمة"),390,185,28,"g"),
   ...tagBox(625,120,SCL(50000),32),A.tx(`1 cm → ${fmt(50000)} cm`,625,220,34),A.tx("= 500 m",625,280,42,"b")]},
 {say:t3("Från stugan till tältet är det 4 cm på kartan. Varje cm är 500 m, så det är 4 · 500 = 2 000 m, alltså 2 km.",
   "From the cabin to the tent it is 4 cm on the map. Each cm is 500 m, so it is 4 × 500 = 2,000 m, which is 2 km.",
   "المسافة من الكوخ إلى الخيمة 4 سم على الخريطة. كل سنتيمتر يساوي 500 م، إذن المسافة 4 × 500 = 2000 م، أي 2 كم."),
  draw:()=>[A.p(R.dashed(110,262,390,262,12),"r",4),...cmRul(110,292,4,70),A.tx(`4 ${MUL()} 500 m = ${fmt(2000)} m`,625,350,34),A.hl(495,378,260,62),A.tx("= 2 km",625,424,46,"g")]},
 {say:t3("Bassängen i simhallen är 25 m lång. Hur lång blir den på en ritning i skala 1:500? 25 m = 2 500 cm, och 2 500 / 500 = 5 cm.",
   "The pool at the swimming baths is 25 m long. How long is it on a drawing at a scale of 1:500? 25 m = 2,500 cm, and 2,500 ÷ 500 = 5 cm.",
   "طول حوض السباحة 25 م. كم يكون طوله في رسم بمقياس 1:500؟ 25 م = 2500 سم، و2500 ÷ 500 = 5 سم."),
  draw:()=>{const D=DIVS();return[A.wipe(),A.tx(T("verkligheten","reality","الواقع"),400,62,32,"r"),...pool(100,100,600,110),A.tx("25 m",400,248,34,"r"),
   A.arrow(200,262,200,312,"o"),A.tx(`${D} 500`,260,296,28,"o"),...pool(100,324,200,44),A.tx(T("ritningen","drawing","الرسم"),200,410,30,"b"),...tagBox(200,462,SCL(500),26),
   A.tx(`25 m = ${fmt(2500)} cm`,575,320,36),A.tx(`${fmt(2500)} ${D} 500 = 5`,575,385,36),A.hl(475,412,200,60),A.tx("5 cm",575,456,46,"g")]}},
 {say:t3("Skala 5:1 betyder att bilden är 5 gånger större än verkligheten. Nyckelpigan är 8 mm lång, så på bilden blir den 5 · 8 = 40 mm.",
   "A scale of 5:1 means that the picture is 5 times bigger than reality. The ladybird is 8 mm long, so in the picture it is 5 × 8 = 40 mm.",
   "مقياس الرسم 5:1 يعني أن الصورة أكبر من الواقع 5 مرات. طول الدعسوقة 8 مم، فيكون طولها في الصورة 5 × 8 = 40 مم."),
  draw:()=>[A.wipe(),A.tx(T("verkligheten","reality","الواقع"),110,120,28,"r"),...bug(104,200,13),...lenArrow(90,124,236,"8 mm","k",26),
   A.arrow(165,200,245,200,"k"),A.tx(`${MUL()} 5`,205,180,28),
   A.tx(T("bilden","picture","الصورة"),420,85,30,"b"),...bug(370,200,70),...lenArrow(300,476,315,"40 mm","b",30),
   A.tx("5:1",668,150,70,"o"),A.tx(T("förstoring","enlargement","تكبير"),668,205,32,"o"),A.tx("1:100",668,290,40,"b"),A.tx(T("förminskning","reduction","تصغير"),668,335,30,"b"),
   A.hl(220,398,360,64),A.tx(`5 ${MUL()} 8 mm = 40 mm`,400,444,44,"g")]}
]};
const PLN=[t3("rummet","the room","الغرفة"),t3("köket","the kitchen","المطبخ"),t3("garaget","the garage","المرآب"),t3("klassrummet","the classroom","غرفة الصف")];
const OBJ=[
 {k:"pool",Ls:[25,50],q:(L,k)=>T(`Bassängen är ${L} m lång. Hur lång blir den på en ritning i skala 1:${fmt(k)}? Svara i cm.`,`The pool is ${L} m long. How long is it on a drawing at a scale of 1:${fmt(k)}? Answer in cm.`,`طول حوض السباحة ${L} م. كم يكون طوله في رسم بمقياس 1:${fmt(k)}؟ أجب بالسنتيمتر.`)},
 {k:"house",Ls:[8,10,12,15,16,20],q:(L,k)=>T(`Huset är ${L} m långt. Hur långt blir det på en ritning i skala 1:${fmt(k)}? Svara i cm.`,`The house is ${L} m long. How long is it on a drawing at a scale of 1:${fmt(k)}? Answer in cm.`,`طول البيت ${L} م. كم يكون طوله في رسم بمقياس 1:${fmt(k)}؟ أجب بالسنتيمتر.`)},
 {k:"bus",Ls:[12,15],q:(L,k)=>T(`Bussen är ${L} m lång. Hur lång blir den på en ritning i skala 1:${fmt(k)}? Svara i cm.`,`The bus is ${L} m long. How long is it on a drawing at a scale of 1:${fmt(k)}? Answer in cm.`,`طول الحافلة ${L} م. كم يكون طولها في رسم بمقياس 1:${fmt(k)}؟ أجب بالسنتيمتر.`)}];
LESSONS.push({id:"scale6",subject:"math",grades:"6",kind:"wb",
 title:t3("Skala på kartor och ritningar","Scale on maps and drawings","مقياس الرسم على الخرائط والرسومات"),
 icon:ICO(`<rect x="30" y="40" width="130" height="90" fill="#2257c9" fill-opacity=".06" stroke="#1d2433" stroke-width="5"/><path d="M40 130V104A26 26 0 0 1 66 130" fill="none" stroke="#1d2433" stroke-width="2.5"/><rect x="104" y="48" width="48" height="34" fill="none" stroke="#2257c9" stroke-width="3"/><text x="95" y="162" ${CV} font-size="30" fill="#e07b00">1:100</text><path d="M190 120Q215 60 250 90T295 50" fill="none" stroke="#d63b2f" stroke-width="4" stroke-dasharray="9 7"/><circle cx="190" cy="120" r="7" fill="#d63b2f"/><circle cx="295" cy="50" r="7" fill="#1e9e5a"/><text x="250" y="160" ${CV} font-size="28" fill="#1d2433">1:50 000</text>`),
 steps:SC6.steps,mount:wbMount(SC6),
 gen(level){const M=MUL(),D=DIVS(),RC=625;
  const top=s=>para(s,400,52,32,46,40);
  if(level===0){const k=pick([50,100,100,200]),a=rint(2,9),b=rint(2,Math.min(5,a)),u=Math.min(70,340/a,230/b),w=a*u,h=b*u,x=250-w/2,y=140+(270-h)/2,ans=a*k/100,n=pick(PLN);
   const q=[A.wipe(),...top(rint(0,1)?T(`Ritningen är i skala 1:${k}. Hur långt är ${n.sv} i verkligheten? Svara i meter.`,`The drawing is at a scale of 1:${k}. How long is ${n.en} in reality? Answer in metres.`,`الرسم بمقياس 1:${k}. كم طول ${n.ar} في الواقع؟ أجب بالمتر.`)
     :T(`Ritningen är en förminskning i skala 1:${k}. Beräkna längden i verkligheten i meter.`,`The drawing is a reduction at a scale of 1:${k}. Work out the real length in metres.`,`الرسم تصغير بمقياس 1:${k}. احسب الطول في الواقع بالمتر.`)),
    ...plan(x,y,w,h),A.tx(`${a} cm`,x+w/2,y+h+42,32,"b"),...tagBox(RC,180,SCL(k),32)];
   const l1=`${a} cm ${M} ${k} = ${fmt(a*k)} cm`,l2=`${fmt(a*k)} cm = ${nf(ans)} m`;
   return{kind:"num",dec:!Number.isInteger(ans),ans,show:`${nf(ans)} m`,q,
    sol:[tf(l1,RC,280,36,300),fin(A.hl(RC-150,320,300,62)),fin(tf(l2,RC,366,42,290,"g"))]}}
  if(level===1){const k=pick([10000,20000,25000,50000,100000]);let a;do{a=rint(2,10)}while(k===25000&&a%2);
   const u=Math.min(60,320/a),xa=250-a*u/2,xb=xa+a*u,Y=290,ans=a*k/100000;
   const q=[A.wipe(),...top(rint(0,1)?T("Hur långt är det fågelvägen från stugan till tältet? Svara i km.","How far is it from the cabin to the tent in a straight line? Answer in km.","كم تبعد الخيمة عن الكوخ في خط مستقيم؟ أجب بالكيلومتر.")
     :T("Beräkna avståndet fågelvägen mellan stugan och tältet. Svara i km.","Work out the straight-line distance from the cabin to the tent. Answer in km.","احسب المسافة في خط مستقيم بين الكوخ والخيمة. أجب بالكيلومتر.")),
    ...mapBg(40,118,420,350,[250,170,62,30]),houseI(xa,Y-7,1.4),tentI(xb,Y-7,1.4),A.p(dots([[xa,Y],[xb,Y]]),"k",12),A.p(R.dashed(xa,Y,xb,Y,12),"r",4),...cmRul(xa,Y+24,a,u),...tagBox(RC,180,SCL(k),30)];
   return{kind:"num",dec:!Number.isInteger(ans),ans,show:`${nf(ans)} km`,q,
    sol:[tf(`1 cm → ${fmt(k/100)} m`,RC,270,36,300,"b"),fin(tf(`${a} ${M} ${fmt(k/100)} m = ${fmt(a*k/100)} m`,RC,340,34,300)),fin(A.hl(RC-130,372,260,62)),fin(A.tx(`= ${nf(ans)} km`,RC,418,44,"g"))]}}
  const t=rint(0,2);
  if(t===0){let o,L,k,d;do{o=pick(OBJ);L=pick(o.Ls);k=pick([50,100,200,500,1000]);d=L*100/k}while(d<2||d>12||(d*2)%1);
   const pic=o.k==="pool"?pool(60,220,380,110):o.k==="house"?houseS(110,380,280,150):busS(60,360,380,150);
   const q=[A.wipe(),...top(o.q(L,k)),...pic,A.tx(`${L} m`,250,o.k==="pool"?375:420,34,"r"),...tagBox(RC,180,SCL(k),30)];
   return{kind:"num",dec:!Number.isInteger(d),ans:d,show:`${nf(d)} cm`,q,
    sol:[tf(`${L} m = ${fmt(L*100)} cm`,RC,270,36,300,"b"),fin(tf(`${fmt(L*100)} ${D} ${fmt(k)} = ${nf(d)}`,RC,340,36,300)),fin(A.hl(RC-110,372,220,62)),fin(A.tx(`${nf(d)} cm`,RC,418,46,"g"))]}}
  if(t===1){const k=pick([2,4,5,10]);let r;do{r=rint(3,12)}while(k*r>90||k*r<20);const P=k*r,R0=Math.min(95,Math.max(70,P*2.2));
   const q=[A.wipe(),...top(rint(0,1)?T(`Bilden är en förstoring i skala ${k}:1. Nyckelpigan är ${P} mm lång på bilden. Hur lång är den i verkligheten?`,`The picture is an enlargement at a scale of ${k}:1. The ladybird is ${P} mm long in it. How long is it in reality?`,`الصورة تكبير بمقياس ${k}:1. طول الدعسوقة فيها ${P} مم. كم طولها في الواقع؟`):T(`Bilden är i skala ${k}:1. På bilden är nyckelpigan ${P} mm lång. Hur lång är den i verkligheten? Svara i mm.`,`The picture is at a scale of ${k}:1. In the picture the ladybird is ${P} mm long. How long is it in reality? Answer in mm.`,`الصورة بمقياس ${k}:1. طول الدعسوقة في الصورة ${P} مم. كم طولها في الواقع؟ أجب بالمليمتر.`)),
    ...bug(230-R0*.25,270,R0),...lenArrow(230-R0*1.25,230+R0*1.27,270+R0+28,`${P} mm`,"b",30),...tagBox(RC,180,T(`skala ${k}:1`,`scale ${k}:1`,`المقياس ${k}:1`),32)];
   return{kind:"num",ans:r,show:`${r} mm`,q,
    sol:[tf(T(`${k} gånger större`,`${k} times bigger`,`أكبر ${arTimes(k)}`),RC,270,32,300,"b"),fin(A.tx(`${P} ${D} ${k} = ${r}`,RC,340,38)),fin(A.hl(RC-100,372,200,62)),fin(A.tx(`${r} mm`,RC,418,46,"g"))]}}
  let d,k,Lm;do{d=rint(2,10);k=pick([20,25,50,100,200,500]);Lm=d*k/100}while(Lm<1||Lm>40||(Lm*10)%1);
  const n=pick(PLN),u=Math.min(52,340/d),w=d*u,h=Math.min(3,d-1)*u*.8+40,x=250-w/2,y=160+(250-h)/2;
  const q=[A.wipe(),...top(T(`På ritningen är ${n.sv} ${d} cm långt. I verkligheten är det ${nf(Lm)} m. ${rint(0,1)?"Vilken skala har ritningen?":"Bestäm ritningens skala."}`,`On the drawing ${n.en} is ${d} cm long. In reality it is ${nf(Lm)} m. What is the scale of the drawing?`,`طول ${n.ar} في الرسم ${d} سم، وفي الواقع ${nf(Lm)} م. ما مقياس الرسم؟`)),
   ...plan(x,y,w,h),A.tx(`${d} cm`,x+w/2,y+h+42,32,"b"),...tagBox(RC,190,T("skala 1:?","scale 1:?","المقياس 1:?"),32)];
  return{kind:"pair",sep:":",ans:[1,k],check:(p,s)=>p>0&&Math.abs(s-p*k)<1e-9,show:`1:${fmt(k)}`,q,
   sol:[tf(`${nf(Lm)} m = ${fmt(d*k)} cm`,RC,280,36,300,"b"),fin(tf(`${fmt(d*k)} ${D} ${d} = ${fmt(k)}`,RC,345,36,300)),fin(A.hl(RC-110,372,220,62)),fin(A.tx(`1:${fmt(k)}`,RC,418,46,"g"))]}}
});
Object.assign(HELPX,{scale6:[
 {say:t3("En leksaksbil är en förminskad bil. I skala 1:10 är den riktiga bilen 10 gånger längre: 40 cm · 10 = 400 cm = 4 m.",
   "A toy car is a scaled-down car. At a scale of 1:10 the real car is 10 times longer: 40 cm × 10 = 400 cm = 4 m.",
   "السيارة اللعبة سيارة مصغّرة. بمقياس 1:10 تكون السيارة الحقيقية أطول 10 مرات: 40 سم × 10 = 400 سم = 4 م."),
  draw:()=>[carS(70,290,90,"r"),...lenArrow(70,160,320,"40 cm","r",28),A.tx(T("leksaksbil","toy car","سيارة لعبة"),115,220,28,"r"),
   A.arrow(185,255,265,255,"k"),A.tx(`${MUL()} 10`,225,235,28),
   carS(300,290,420,"b"),...lenArrow(300,720,320,"4 m","b",30),A.tx(T("riktig bil","real car","سيارة حقيقية"),510,70,30,"b"),
   ...tagBox(115,430,"1:10",34),A.hl(260,398,500,62),A.tx(`40 cm ${MUL()} 10 = 400 cm = 4 m`,510,442,38,"g")]}]});
Object.assign(HINTSX,{scale6:[
 {say:t3("1 cm på ritningen är lika med skalans andra tal i cm. Multiplicera, och gör om till meter: 100 cm = 1 m.","1 cm on the drawing equals the scale's second number in cm. Multiply, then change to metres: 100 cm = 1 m.","1 سم في الرسم يساوي العدد الثاني في المقياس بالسنتيمتر. اضرب، ثم حوّل إلى أمتار: 100 سم = 1 م."),cut:noFin},
 {say:t3("Räkna först ut hur många meter 1 cm på kartan är. Multiplicera sedan med avståndet på kartan. 1 000 m = 1 km.","First work out how many metres 1 cm on the map is. Then multiply by the distance on the map. 1,000 m = 1 km.","احسب أولًا كم مترًا يساوي 1 سم على الخريطة، ثم اضرب في المسافة على الخريطة. 1000 م = 1 كم."),cut:noFin},
 {say:t3("Skalan är ritning : verklighet. Skriv båda längderna i samma enhet och jämför dem.","The scale is drawing : reality. Write both lengths in the same unit and compare them.","المقياس هو الرسم : الواقع. اكتب الطولين بالوحدة نفسها ثم قارن بينهما."),cut:noFin}]});

/* =====================================================================
   2. tri6: area of parallelogram and triangle
   ===================================================================== */
const ARP=()=>T("Area = basen · höjden","Area = base × height","المساحة = القاعدة × الارتفاع");
const ART=()=>T("Area = basen · höjden / 2","Area = base × height ÷ 2","المساحة = القاعدة × الارتفاع ÷ 2");
const ARPg=()=>T("Area = basen · höjden","Area = base × height","القاعدة × الارتفاع");
const ARTg=()=>T("Area = basen · höjden / 2","Area = base × height ÷ 2","القاعدة × الارتفاع ÷ 2");
const TRI=[[3,4,5],[4,3,5],[6,8,10],[8,6,10]];
/* slanted side label: placed outward from side a->b, away from point c */
const sideLab=(a,b,c,lab,col="k",off=30)=>{const mx=(a[0]+b[0])/2,my=(a[1]+b[1])/2,dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy);let nx=-dy/l,ny=dx/l;
 if((c[0]-mx)*nx+(c[1]-my)*ny>0){nx=-nx;ny=-ny}return A.tx(lab,mx+nx*off,my+ny*off+10,28,col)};
const TR6={steps:[
 {say:t3("Ett parallellogram har två par parallella sidor. Basen är 6 cm. Höjden är 4 cm och står vinkelrätt mot basen.",
   "A parallelogram has two pairs of parallel sides. The base is 6 cm. The height is 4 cm and is at right angles to the base.",
   "متوازي الأضلاع له زوجان من الأضلاع المتوازية. طول القاعدة 6 سم، والارتفاع 4 سم وهو عمودي على القاعدة."),
  draw:()=>[A.wipe(),lgrid(120,160,8,4,45),A.p(poly([[120,340],[390,340],[480,160],[210,160]]),"k",5),A.p(R.dashed(210,160,210,340),"r",3.5),ra(210,340,1,-1),
   A.tx("6 cm",255,382,32),...vdim(90,160,340,"4 cm","r"),A.tx(T("parallellogram","parallelogram","متوازي الأضلاع"),645,150,38,"b"),
   A.tx(T("basen = 6 cm","base = 6 cm","القاعدة = 6 سم"),645,230,34),A.tx(T("höjden = 4 cm","height = 4 cm","الارتفاع = 4 سم"),645,290,34,"r")]},
 {say:t3("Vi klipper av triangeln längs höjden och flyttar den till andra sidan. Då blir det en rektangel: 6 · 4 = 24 cm².",
   "We cut off the triangle along the height and move it to the other side. That makes a rectangle: 6 × 4 = 24 cm².",
   "نقصّ المثلث على طول الارتفاع وننقله إلى الجهة الأخرى، فيصبح الشكل مستطيلًا: 6 × 4 = 24 سم²."),
  draw:()=>[A.hatch(poly([[120,340],[210,340],[210,160]]),"o"),A.arrow(165,150,435,150,"o",-50),A.hatch(poly([[390,340],[480,340],[480,160]]),"o"),
   A.p(poly([[390,340],[480,340],[480,160]]),"o",3),A.p(R.rect(210,160,270,180,.3),"g",6),A.tx(T("rektangel","rectangle","مستطيل"),645,370,34,"g"),A.hl(510,392,270,62),A.tx(`6 ${MUL()} 4 = 24 cm²`,645,438,42,"g")]},
 {say:t3("Arean av ett parallellogram är basen · höjden. Akta dig: den sneda sidan, 5 cm, är inte höjden!",
   "The area of a parallelogram is base × height. Watch out: the slanted side, 5 cm, is not the height!",
   "مساحة متوازي الأضلاع = القاعدة × الارتفاع. انتبه: الضلع المائل 5 سم ليس الارتفاع!"),
  draw:()=>[A.wipe(),A.p(poly([[105,370],[375,370],[510,190],[240,190]]),"k",5),A.p(R.dashed(240,190,240,370),"r",3.5),ra(240,370,1,-1),A.tx("6 cm",240,412,32),
   sideLab([375,370],[510,190],[240,190],"5 cm"),...vdim(78,190,370,"4 cm","r"),A.p(R.dashed(86,190,230,190),"#9aa8c4",2),
   tf(ARPg(),655,120,34,270,"b"),A.hl(535,180,245,62),A.tx(`6 ${MUL()} 4 = 24 cm²`,657,226,40,"g"),A.tx(`6 ${MUL()} 5 = 30`,655,330,40,"r"),strike(655,330,150),
   A.tx(T("5 cm är inte höjden","5 cm is not the height","5 سم ليس الارتفاع"),655,390,28,"r")]},
 {say:t3("Två likadana trianglar bildar tillsammans ett parallellogram. Därför är triangelns area hälften: basen · höjden / 2.",
   "Two identical triangles together make a parallelogram. So the area of the triangle is half: base × height ÷ 2.",
   "مثلثان متطابقان معًا يكوّنان متوازي أضلاع. لذلك مساحة المثلث نصفه: القاعدة × الارتفاع ÷ 2."),
  draw:()=>[A.wipe(),A.hatch(poly([[110,370],[380,370],[200,190]]),"o"),A.p(poly([[110,370],[380,370],[200,190]]),"k",5),
   A.hatch(poly([[380,370],[470,190],[200,190]]),"b"),A.p(R.dashed(380,370,470,190)+R.dashed(470,190,200,190),"b",3.5),
   A.p(R.dashed(200,190,200,370),"r",3.5),ra(200,370,1,-1),A.tx("6 cm",245,412,32),...vdim(80,190,370,"4 cm","r"),
   A.tx(`6 ${MUL()} 4 = 24`,640,150,40,"b"),A.tx(T("parallellogram","parallelogram","متوازي الأضلاع"),640,195,28,"b"),A.hl(510,250,260,62),A.tx(`24 ${DIVS()} 2 = 12 cm²`,640,296,40,"g"),A.tx(T("triangel","triangle","مثلث"),640,345,28,"o"),
   tf(ARTg(),640,430,32,300)]},
 {say:t3("I en trubbig triangel kan höjden hamna utanför. Vi förlänger basen med en streckad linje. Arean är ändå basen · höjden / 2.",
   "In an obtuse triangle the height can end up outside. We extend the base with a dashed line. The area is still base × height ÷ 2.",
   "في المثلث المنفرج قد يقع الارتفاع خارج المثلث، فنمدّ القاعدة بخط متقطع. وتبقى المساحة = القاعدة × الارتفاع ÷ 2."),
  draw:()=>[A.wipe(),A.hatch(poly([[270,370],[450,370],[135,145]]),"g"),A.p(poly([[270,370],[450,370],[135,145]]),"k",5),A.p(R.dashed(135,370,270,370,10),"#9aa8c4",3),
   A.p(R.dashed(135,145,135,370),"r",3.5),ra(135,370,1,-1),A.tx("4 cm",360,412,32),...vdim(95,145,370,"5 cm","r"),
   A.tx(T("trubbig triangel","obtuse triangle","مثلث منفرج الزاوية"),630,140,34,"b"),A.tx(T("höjden ligger utanför","the height is outside","الارتفاع خارج المثلث"),630,200,28,"r"),
   A.hl(500,262,270,62),A.tx(`4 ${MUL()} 5 ${DIVS()} 2 = 10 cm²`,635,308,38,"g")]},
 {say:t3("Seglet på båten är en triangel. Basen är 3 m och höjden 6 m. Seglets area är 3 · 6 / 2 = 9 m².",
   "The sail on the boat is a triangle. The base is 3 m and the height is 6 m. The area of the sail is 3 × 6 ÷ 2 = 9 m².",
   "شراع القارب مثلث، قاعدته 3 م وارتفاعه 6 م. مساحة الشراع 3 × 6 ÷ 2 = 9 م²."),
  draw:()=>[A.wipe(),A.hatch(poly([[250,60],[250,360],[400,360]]),"o"),A.p(poly([[250,60],[250,360],[400,360]]),"o",4.5),A.p(R.line(250,40,250,410,.2),"k",5),
   A.p("M150,410L470,410Q440,450 410,455L210,455Q175,450 150,410Z","k",4.5),A.p("M80,470q30,-14 60,0t60,0t60,0t60,0t60,0t60,0t60,0t60,0","b",3),
   A.tx("3 m",325,395,28),A.tx("6 m",215,220,30,"r","end"),
   tf(ARTg(),620,140,32,300),A.tx(`3 ${MUL()} 6 ${DIVS()} 2`,620,230,40),A.hl(490,262,260,62),A.tx("= 9 m²",620,308,46,"g")]}
]};
/* parallelogram: base b, height h, top shifted s units right; returns geometry */
const pgram=(b,h,s,u,x0,yb)=>({BL:[x0,yb],BR:[x0+b*u,yb],TR:[x0+(b+s)*u,yb-h*u],TL:[x0+s*u,yb-h*u]});
LESSONS.push({id:"tri6",subject:"math",grades:"6",kind:"wb",
 title:t3("Area av triangel och parallellogram","Area of triangles and parallelograms","مساحة المثلث ومتوازي الأضلاع"),
 icon:ICO(`${[...Array(11)].map((_,i)=>`<path d="M${50+i*22} 40V140" stroke="#9aa8c4" stroke-width="1.2"/>`).join("")}${[...Array(6)].map((_,j)=>`<path d="M50 ${40+j*20}H270" stroke="#9aa8c4" stroke-width="1.2"/>`).join("")}<path d="M50 140L94 40V140Z" fill="#e07b00" fill-opacity=".3"/><path d="M226 140L270 40V140Z" fill="#e07b00" fill-opacity=".3" stroke="#e07b00" stroke-width="2.5"/><path d="M50 140H226L270 40H94Z" fill="none" stroke="#1d2433" stroke-width="5" stroke-linejoin="round"/><path d="M94 40V140" stroke="#d63b2f" stroke-width="3" stroke-dasharray="7 6"/><path d="M80 30Q160 0 240 30" fill="none" stroke="#e07b00" stroke-width="3"/><path d="M240 30l-14 -2M240 30l-8 -12" stroke="#e07b00" stroke-width="3"/>`),
 steps:TR6.steps,mount:wbMount(TR6),
 gen(level){const M=MUL(),D=DIVS(),RC=640,ask=A.tx(pick([()=>T("Vad är arean?","What is the area?","ما المساحة؟"),()=>T("Beräkna arean.","Calculate the area.","احسب المساحة."),()=>T("Bestäm arean.","Find the area.","أوجد المساحة.")])(),RC,90,38);
  if(level===0){const b=rint(3,8),h=rint(2,5),s=rint(1,3),u=Math.min(62,330/(b+s),260/h),x0=110+(350-(b+s)*u)/2,yb=120+(300+h*u)/2,G=pgram(b,h,s,u,x0,yb),yt=yb-h*u;
   const q=[A.wipe(),lgrid(x0,yt,b+s,h,u),A.p(poly([G.BL,G.BR,G.TR,G.TL]),"k",5),A.p(R.dashed(G.TL[0],yt,G.TL[0],yb),"r",3.5),ra(G.TL[0],yb,1,-1),
    A.tx(`${b} cm`,x0+b*u/2,yb+40,32),...vdim(x0-30,yt,yb,`${h} cm`,"r"),ask];
   return{kind:"num",ans:b*h,show:`${b*h} cm²`,q,
    sol:[A.hatch(poly([G.BL,[G.TL[0],yb],G.TL]),"o"),A.arrow(x0+s*u/2,yt-10,x0+(b+s/2)*u,yt-10,"o",-40),A.hatch(poly([G.BR,[G.TR[0],yb],G.TR]),"o"),A.p(poly([G.BR,[G.TR[0],yb],G.TR]),"o",3),
     A.p(R.rect(G.TL[0],yt,b*u,h*u,.3),"g",6),A.tx(T("rektangel","rectangle","مستطيل"),RC,200,34,"g"),fin(A.hl(RC-140,262,280,62)),fin(A.tx(`${b} ${M} ${h} = ${b*h} cm²`,RC,308,40,"g"))]}}
  const triQ=(b,h,p,u,yb,lab)=>{const lt=lab==="R"||lab==null,r0=Math.min(0,p)*u,r1=Math.max(b,p)*u,W=r1-r0,x0=(lt?110+(370-W)/2:60+(290-W)/2)-r0;
   const B1=[x0,yb],B2=[x0+b*u,yb],Ap=[x0+p*u,yb-h*u],o=[A.p(poly([B1,B2,Ap]),"k",5)];
   if(p<0||p>b)o.push(A.p(p<0?R.dashed(Ap[0],yb,x0,yb,10):R.dashed(B2[0],yb,Ap[0],yb,10),"#9aa8c4",3));
   o.push(A.p(R.dashed(Ap[0],Ap[1],Ap[0],yb),"r",3.5),ra(Ap[0],yb,p<b/2?1:-1,-1),A.tx(`${b} cm`,x0+b*u/2,yb+40,32));
   const xl=Math.min(x0,Ap[0])-30,xr=Math.max(B2[0],Ap[0])+30;
   if(lt){o.push(...vdim(xl,Ap[1],yb,`${h} cm`,"r",-1),A.p(R.dashed(xl+8,Ap[1],Ap[0]-10,Ap[1]),"#9aa8c4",2))}
   else{o.push(...vdim(xr,Ap[1],yb,`${h} cm`,"r",1),A.p(R.dashed(Ap[0]+10,Ap[1],xr-8,Ap[1]),"#9aa8c4",2))}
   return{o,B1,B2,Ap}};
  if(level===1){let tr,b,p,side;do{tr=pick(TRI);side=pick(["L","R"]);b=rint(tr[0]+1,12);p=side==="L"?tr[0]:b-tr[0]}while(b*tr[1]%2);
   const h=tr[1],u=Math.min(50,(side==="L"?290:330)/b,270/h),yb=120+(290+h*u)/2,Q=triQ(b,h,p,u,yb,side);
   const sl=side==="L"?sideLab(Q.B1,Q.Ap,Q.B2,`${tr[2]} cm`):sideLab(Q.B2,Q.Ap,Q.B1,`${tr[2]} cm`);
   return{kind:"num",ans:b*h/2,show:`${b*h/2} cm²`,q:[A.wipe(),...Q.o,sl,ask],
    sol:[A.hatch(poly([Q.B1,Q.B2,Q.Ap]),"g"),tf(T(`höjden är ${h} cm, inte ${tr[2]} cm`,`the height is ${h} cm, not ${tr[2]} cm`,`الارتفاع ${h} سم وليس ${tr[2]} سم`),RC,170,30,320,"r"),tf(ARTg(),RC,225,30,320),
     fin(A.tx(`${b} ${M} ${h} = ${b*h}`,RC,295,40,"b")),fin(A.hl(RC-140,328,280,62)),fin(tf(`${b*h} ${D} 2 = ${b*h/2} cm²`,RC,374,42,270,"g"))]}}
  const t=rint(0,2);
  if(t===0){let b,h,o;do{b=rint(3,7);h=rint(3,7);o=rint(1,4)}while(b*h%2);const left=rint(0,1),u=Math.min(50,330/(b+o),270/h);
   const p=left?-o:b+o,yb=120+(290+h*u)/2,Q=triQ(b,h,p,u,yb,left?null:"L");
   return{kind:"num",ans:b*h/2,show:`${b*h/2} cm²`,q:[A.wipe(),...Q.o,ask],
    sol:[A.hatch(poly([Q.B1,Q.B2,Q.Ap]),"g"),tf(T("höjden ligger utanför","the height is outside","الارتفاع خارج المثلث"),RC,170,30,290,"r"),tf(ARTg(),RC,225,30,320),
     fin(A.tx(`${b} ${M} ${h} = ${b*h}`,RC,295,40,"b")),fin(A.hl(RC-140,328,280,62)),fin(tf(`${b*h} ${D} 2 = ${b*h/2} cm²`,RC,374,42,270,"g"))]}}
  if(t===1){const tr=pick(TRI.slice(0,3)),s=tr[0],h=tr[1],b=rint(Math.max(4,s+1),s+5),u=Math.min(50,300/(b+s),270/h),x0=110+(330-(b+s)*u)/2,yb=120+(290+h*u)/2,G=pgram(b,h,s,u,x0,yb),yt=yb-h*u;
   const q=[A.wipe(),A.p(poly([G.BL,G.BR,G.TR,G.TL]),"k",5),A.p(R.dashed(G.TL[0],yt,G.TL[0],yb),"r",3.5),ra(G.TL[0],yb,1,-1),A.tx(`${b} cm`,x0+b*u/2,yb+40,32),
    ...vdim(x0-30,yt,yb,`${h} cm`,"r"),A.p(R.dashed(x0-22,yt,G.TL[0]-10,yt),"#9aa8c4",2),sideLab(G.BR,G.TR,G.BL,`${tr[2]} cm`),ask];
   return{kind:"num",ans:b*h,show:`${b*h} cm²`,q,
    sol:[A.hatch(poly([G.BL,G.BR,G.TR,G.TL]),"b"),tf(T(`höjden är ${h} cm, inte ${tr[2]} cm`,`the height is ${h} cm, not ${tr[2]} cm`,`الارتفاع ${h} سم وليس ${tr[2]} سم`),RC,180,30,320,"r"),tf(ARPg(),RC,240,32,290),
     fin(A.hl(RC-140,290,280,62)),fin(tf(`${b} ${M} ${h} = ${b*h} cm²`,RC,336,42,270,"g"))]}}
  const b=rint(3,9),h=rint(2,7),s=rint(1,3),Ar=b*h,u=Math.min(46,320/(b+s),260/h),x0=110+(340-(b+s)*u)/2,yb=150+(280+h*u)/2,G=pgram(b,h,s,u,x0,yb),yt=yb-h*u;
  const q=[A.wipe(),A.p(poly([G.BL,G.BR,G.TR,G.TL]),"k",5),A.hatch(poly([G.BL,G.BR,G.TR,G.TL]),"b"),A.p(R.dashed(G.TL[0],yt,G.TL[0],yb),"r",3.5),ra(G.TL[0],yb,1,-1),A.tx(`${b} cm`,x0+b*u/2,yb+40,32),
   ...vdim(x0-30,yt,yb,"?","r"),A.p(R.dashed(x0-22,yt,G.TL[0]-10,yt),"#9aa8c4",2),
   tf(T(`Arean är ${Ar} cm².`,`The area is ${Ar} cm².`,`المساحة ${Ar} سم²`),RC,90,36,290),tf(rint(0,1)?T("Hur lång är höjden?","How long is the height?","ما طول الارتفاع؟"):T("Beräkna höjden.","Work out the height.","احسب الارتفاع."),RC,145,34,290,"r")];
  return{kind:"num",ans:h,show:`${h} cm`,q,
   sol:[tf(ARPg(),RC,230,32,290),A.tx(`${b} ${M} ? = ${Ar}`,RC,295,40,"b"),fin(A.hl(RC-140,330,280,62)),fin(tf(`? = ${Ar} ${D} ${b} = ${h} cm`,RC,376,42,270,"g"))]}}
});
Object.assign(HELPX,{tri6:[
 {say:t3("Ta ett papper som är format som ett parallellogram. Klipp av hörnet rakt ner och lägg det på andra sidan. Nu är det en rektangel med samma area!",
   "Take a piece of paper shaped like a parallelogram. Cut off the corner straight down and put it on the other side. Now it is a rectangle with the same area!",
   "خذ ورقة على شكل متوازي أضلاع. قصّ الزاوية بخط مستقيم إلى الأسفل وضعها في الجهة الأخرى. الآن صارت مستطيلًا له المساحة نفسها!"),
  draw:()=>[A.hatch(poly([[60,330],[260,330],[340,170],[140,170]]),"b"),A.p(poly([[60,330],[260,330],[340,170],[140,170]]),"k",4.5),A.p(R.dashed(140,170,140,330),"r",4.5),
   A.p(R.circ(118,372,12)+R.circ(150,376,12)+R.line(126,364,160,326,.1)+R.line(142,366,120,324,.1),"k",3),
   A.arrow(360,250,440,250,"k"),
   A.hatch(poly([[480,330],[600,330],[600,170],[480,170]]),"b"),A.hatch(poly([[600,330],[680,330],[680,170]]),"o"),A.hatch(poly([[600,170],[680,170],[600,330]]),"b"),A.p(R.rect(480,170,200,160,.3),"g",5),
   A.p(poly([[600,330],[680,330],[680,170]]),"o",3),A.tx(T("samma area","same area","المساحة نفسها"),580,400,40,"g")]}]});
Object.assign(HINTSX,{tri6:[
 {say:t3("Klipp av triangeln vid höjden och flytta den till andra sidan. Då får du en rektangel.","Cut off the triangle at the height and move it to the other side. Then you get a rectangle.","قصّ المثلث عند الارتفاع وانقله إلى الجهة الأخرى، فتحصل على مستطيل."),cut:noFin},
 {say:t3("Använd höjden, som står vinkelrätt mot basen, inte den sneda sidan. Ta basen · höjden / 2.","Use the height, which is at right angles to the base, not the slanted side. Take base × height ÷ 2.","استخدم الارتفاع العمودي على القاعدة، لا الضلع المائل. احسب القاعدة × الارتفاع ÷ 2."),cut:noFin},
 {say:t3("Höjden står alltid vinkelrätt mot basen och kan ligga utanför figuren. Parallellogram: basen · höjden. Triangel: hälften.","The height is always at right angles to the base and can be outside the shape. Parallelogram: base × height. Triangle: half of that.","الارتفاع عمودي دائمًا على القاعدة وقد يقع خارج الشكل. متوازي الأضلاع: القاعدة × الارتفاع، والمثلث: نصف ذلك."),cut:noFin}]});

/* =====================================================================
   3. circle6: radius, diameter, circumference
   ===================================================================== */
const PI=()=>dfmt(3.14,2);
const OSYM=()=>T("O","C","المحيط");
const circDeco=(kind,cx,cy,R0)=>{const o=[];
 if(kind==="pizza"){o.push(A.p(R.circ(cx,cy,R0*.86),"o",3));
  o.push(A.p(dots([[.5,-.45],[-.45,-.5],[.2,-.7],[-.55,.45],[.45,.5],[.05,.66]].map(([a,b])=>[cx+a*R0,cy+b*R0])),"r",R0*.17))}
 else if(kind==="plate")o.push(A.p(R.circ(cx,cy,R0*.72),"#9aa8c4",3));
 else if(kind==="clock"){let t="";for(let i=0;i<12;i++){const a=i*Math.PI/6;t+=`M${f1(cx+Math.sin(a)*R0*.86)},${f1(cy-Math.cos(a)*R0*.86)}L${f1(cx+Math.sin(a)*R0*.97)},${f1(cy-Math.cos(a)*R0*.97)}`}o.push(A.p(t,"k",3))}
 else if(kind==="wheel"){let t=R.circ(cx,cy,R0*.86);[60,120,240,300].forEach(a=>{const r=a*Math.PI/180;t+=`M${cx},${cy}L${f1(cx+Math.cos(r)*R0*.86)},${f1(cy-Math.sin(r)*R0*.86)}`});o.push(A.p(t,"#9aa8c4",2.5))}
 else if(kind==="tramp"){let z="";for(let i=0;i<=48;i++){const a=i/48*Math.PI*2,r=R0*(i%2?.8:.9);z+=(i?"L":"M")+f1(cx+Math.cos(a)*r)+","+f1(cy+Math.sin(a)*r)}o.push(A.p(z,"#9aa8c4",2))}
 else if(kind==="bed"){[[.45,-.5],[-.5,-.45],[.1,-.62],[-.5,.5],[.5,.48],[.05,.6]].forEach(([a,b])=>{const x=cx+a*R0,y=cy+b*R0;o.push(A.p(R.circ(x,y,9),"r",3),A.p(R.line(x,y+9,x,y+24,.1),"g",3))})}
 return o};
const CIRC=[
 {k:"pizza",n:t3("Pizzan","The pizza","البيتزا"),d:[26,40]},{k:"plate",n:t3("Tallriken","The plate","الطبق"),d:[18,28]},
 {k:"clock",n:t3("Klockan","The clock","الساعة"),d:[20,40]},{k:"wheel",n:t3("Cykelhjulet","The bike wheel","عجلة الدراجة"),d:[40,70]}];
const CIRC2=[
 {k:"tramp",n:t3("Studsmattan","The trampoline","الترامبولين"),r:[1,4],u:"m"},{k:"bed",n:t3("Den runda rabatten","The round flower bed","حوض الزهور الدائري"),r:[1,5],u:"m"},
 {k:"clock",n:t3("Klockan","The clock","الساعة"),r:[10,20],u:"cm"},{k:"pizza",n:t3("Pizzan","The pizza","البيتزا"),r:[12,20],u:"cm"}];
const CI6={steps:[
 {say:t3("En cirkel har en medelpunkt i mitten. Sträckan från medelpunkten till kanten heter radie, r. Här är radien 5 cm.",
   "A circle has a centre in the middle. The distance from the centre to the edge is called the radius, r. Here the radius is 5 cm.",
   "للدائرة مركز في وسطها. المسافة من المركز إلى المحيط تسمّى نصف القطر r. هنا نصف القطر 5 سم."),
  draw:()=>[A.wipe(),A.p(R.circ(250,260,170),"k",5),A.p(dots([[250,260]]),"k",14),A.tx(T("medelpunkt","centre","المركز"),250,305,28),
   A.p(R.line(250,260,359,130,.2),"r",5),A.tx("r = 5 cm",300,185,30,"r","end"),
   A.tx(T("cirkel","circle","دائرة"),620,120,44,"b"),A.tx(T("r = radie","r = radius","r = نصف القطر"),620,200,36,"r")]},
 {say:t3("Diametern, d, går rakt genom medelpunkten från kant till kant. Den är dubbelt så lång som radien: d = 2 · 5 = 10 cm.",
   "The diameter, d, goes straight through the centre from edge to edge. It is twice as long as the radius: d = 2 × 5 = 10 cm.",
   "القطر d يمرّ بالمركز من طرف الدائرة إلى طرفها الآخر، وطوله ضعف نصف القطر: d = 2 × 5 = 10 سم."),
  draw:()=>[A.p(R.line(80,260,420,260,.3),"b",5),A.tx("d = 10 cm",165,245,30,"b"),A.tx(T("d = diameter","d = diameter","d = القطر"),620,260,36,"b"),
   A.hl(500,300,240,62),A.tx(`d = 2 ${MUL()} r`,620,346,42,"g"),A.tx(`2 ${MUL()} 5 = 10 cm`,620,420,36,"g")]},
 {say:t3("Omkretsen är sträckan runt hela cirkeln. Rullar vi hjulet ett varv blir sträckan lite mer än 3 diametrar.",
   "The circumference is the distance all the way round the circle. If we roll the wheel one turn, the distance is a bit more than 3 diameters.",
   "المحيط هو طول الطريق حول الدائرة كلها. إذا دحرجنا العجلة دورة واحدة، تكون المسافة أكثر قليلًا من 3 أقطار."),
  draw:()=>{const x0=70,d=140,o=[A.wipe(),A.p(R.circ(x0+70,260,70),"k",5),A.p(R.line(x0,260,x0+140,260,.2),"b",4),A.p(dots([[x0+70,330]]),"r",14),
    A.arrow(230,200,470,200,"k",-30),A.tx(T("ett varv","one turn","دورة واحدة"),350,160,30)];
   o.push(A.p(R.line(x0,330,x0+3.14*d,330,.2),"r",6));
   for(let i=0;i<3;i++)o.push(A.p(`M${x0+i*d+4},${352}h${d-8}`,"b",4),A.tx("d",x0+i*d+d/2,390,34,"b"));
   o.push(A.p(`M${x0+3*d+3},352h${f1(.14*d-3)}`,"o",4),A.tx(T("lite till","a bit more","وقليل"),x0+3.14*d+18,400,24,"o","start"));
   o.push(A.tx(T("omkretsen","circumference","المحيط"),640,290,32,"r"),A.tx(T("≈ 3 d + lite","≈ 3 d + a bit","≈ 3 d + قليل"),640,340,32,"r"));return o}},
 {say:t3("Omkretsen är alltid ungefär 3,14 gånger diametern. Talet 3,14 kallas pi.",
   "The circumference is always about 3.14 times the diameter. The number 3.14 is called pi.",
   "المحيط دائمًا يساوي تقريبًا 3.14 ضرب القطر. ويسمّى العدد 3.14 باي."),
  draw:()=>[A.hl(220,422,360,64),A.tx(`${OSYM()} ≈ ${PI()} ${MUL()} d`,400,468,48,"g"),A.tx(`π ≈ ${PI()}`,660,130,40,"o")]},
 {say:t3("Ett cykelhjul har diametern 60 cm. Omkretsen är 3,14 · 60 = 188,4 cm. På ett varv rullar hjulet nästan 2 m.",
   "A bike wheel has a diameter of 60 cm. The circumference is 3.14 × 60 = 188.4 cm. In one turn the wheel rolls almost 2 m.",
   "قطر عجلة دراجة 60 سم. محيطها 3.14 × 60 = 188.4 سم. فالعجلة تقطع نحو 2 م في الدورة الواحدة."),
  draw:()=>[A.wipe(),A.p(R.circ(230,250,165)+R.circ(230,250,148),"k",5),...circDeco("wheel",230,250,170),A.p(dots([[230,250]]),"k",14),A.p(R.line(65,250,395,250,.3),"b",5),A.tx("60 cm",150,236,32,"b"),
   A.tx(`${OSYM()} ≈ ${PI()} ${MUL()} d`,620,130,38),A.tx(`${PI()} ${MUL()} 60`,620,215,40),A.hl(490,248,260,62),A.tx(`= ${dfmt(188.4)} cm`,620,294,42,"g"),A.tx(`≈ 2 m`,620,380,38,"o")]},
 {say:t3("Studsmattan har radien 2 m. Först dubblar vi: d = 2 · 2 = 4 m. Omkretsen är 3,14 · 4 = 12,56 m.",
   "The trampoline has a radius of 2 m. First we double it: d = 2 × 2 = 4 m. The circumference is 3.14 × 4 = 12.56 m.",
   "نصف قطر الترامبولين 2 م. نضاعفه أولًا: d = 2 × 2 = 4 م. المحيط 3.14 × 4 = 12.56 م."),
  draw:()=>[A.wipe(),A.p(R.circ(230,250,165),"k",5),...circDeco("tramp",230,250,165),A.p(dots([[230,250]]),"k",14),A.p(R.line(230,250,395,250,.2),"r",5),A.tx("r = 2 m",312,236,30,"r"),
   A.tx(`d = 2 ${MUL()} 2 = 4 m`,620,130,38,"b"),A.tx(`${OSYM()} ≈ ${PI()} ${MUL()} 4`,620,215,40),A.hl(490,248,260,62),A.tx(`= ${dfmt(12.56,2)} m`,620,294,42,"g")]}
]};
LESSONS.push({id:"circle6",subject:"math",grades:"6",kind:"wb",
 title:t3("Cirkeln: radie, diameter och omkrets","The circle: radius, diameter and circumference","الدائرة: نصف القطر والقطر والمحيط"),
 icon:ICO(`<circle cx="100" cy="92" r="66" fill="#2257c9" fill-opacity=".07" stroke="#1d2433" stroke-width="5"/><path d="M34 92H166" stroke="#2257c9" stroke-width="4"/><path d="M100 92L147 45" stroke="#d63b2f" stroke-width="4"/><circle cx="100" cy="92" r="5" fill="#1d2433"/><text x="133" y="80" ${CV} font-size="24" fill="#d63b2f">r</text><text x="70" y="84" ${CV} font-size="24" fill="#2257c9">d</text><text x="245" y="80" ${CV} font-size="46" fill="#e07b00">π</text><text x="245" y="130" ${CV} font-size="34" fill="#1e9e5a">3,14</text>`),
 steps:CI6.steps,mount:wbMount(CI6),
 gen(level){const M=MUL(),D=DIVS(),RC=608,cx=225,cy=275,R0=165;
  const circ=(kind)=>[A.p(R.circ(cx,cy,R0),"k",5),...circDeco(kind,cx,cy,R0),A.p(dots([[cx,cy]]),"k",14)];
  const rLine=(lab)=>[A.p(R.line(cx,cy,cx+R0,cy,.2),"r",5),A.tx(lab,cx+R0*.4,cy-16,32,"r")];
  const dLine=(lab)=>[A.p(R.line(cx-R0,cy,cx+R0,cy,.3),"b",5),A.tx(lab,cx-R0*.3,cy-16,32,"b")];
  /* the question; rnd = an extra test instruction such as "Avrunda till hela cm." */
  const cq=(n,rnd)=>{const P=para((rint(0,1)?T("Hur lång är omkretsen?","How long is the circumference?","ما طول المحيط؟"):T("Beräkna omkretsen.","Calculate the circumference.","احسب المحيط."))+(rnd?" "+rnd:""),RC,124,30,20,36);
   return[A.tx(L(n),RC,74,36,"b"),...P,A.tx(T(`Räkna med π ≈ ${PI()}`,`Use π ≈ ${PI()}`,`استخدم π ≈ ${PI()}`),RC,P[P.length-1].y+40,26,"o")]};
  if(level===0){const kind=pick(["plate","clock","wheel","pizza"]);
   if(rint(0,1)){const r=rint(2,30);return{kind:"num",ans:2*r,show:`${2*r} cm`,q:[A.wipe(),...circ(kind),...rLine(`r = ${r} cm`),...para(T("Hur lång är diametern?","How long is the diameter?","ما طول القطر؟"),RC,90,34,14,44)],
     sol:[A.p(R.dashed(cx-R0,cy,cx,cy,12),"b",4),A.tx(T("diametern = 2 radier","diameter = 2 radii","القطر = نصفا قطر"),RC,200,30,"b"),A.tx(`d = 2 ${M} r`,RC,265,38),fin(A.hl(RC-140,300,280,62)),fin(A.tx(`2 ${M} ${r} = ${2*r} cm`,RC,346,42,"g"))]}}
   const d=2*rint(2,30);return{kind:"num",ans:d/2,show:`${d/2} cm`,q:[A.wipe(),...circ(kind),...dLine(`d = ${d} cm`),...para(T("Hur lång är radien?","How long is the radius?","ما طول نصف القطر؟"),RC,90,34,14,44)],
    sol:[A.p(R.line(cx,cy,cx+R0,cy,.2),"r",7),A.tx(T("radien = halva diametern","radius = half the diameter","نصف القطر = نصف طول القطر"),RC,200,28,"r"),A.tx(`r = d ${D} 2`,RC,265,38),fin(A.hl(RC-140,300,280,62)),fin(A.tx(`${d} ${D} 2 = ${d/2} cm`,RC,346,42,"g"))]}}
  if(level===1){const o=pick(CIRC);let d;do{d=rint(o.d[0],o.d[1])}while((314*d)%100===50);const ex=Math.round(314*d)/100,rnd=Math.random()<.4,ans=rnd?Math.round(ex):ex;
   return{kind:"num",dec:true,ans,show:`${nf(ans)} cm`,nt:rnd?"round":"old",q:[A.wipe(),...circ(o.k),...dLine(`d = ${d} cm`),
     ...cq(o.n,rnd?T("Avrunda till hela\u00a0cm.","Round to whole\u00a0cm.","قرّب إلى أقرب سنتيمتر."):"")],
    sol:[tf(`${OSYM()} ≈ ${PI()} ${M} d`,RC,275,36,300),fin(A.tx(`${PI()} ${M} ${d}`,RC,335,40,"b")),fin(A.hl(RC-150,366,300,62)),fin(tf(`= ${nf(ex)} cm${rnd?` ≈ ${ans} cm`:""}`,RC,412,42,290,"g"))]}}
  if(Math.random()<.3){/* NP style: how far does the bike roll in n turns? */
   const d=pick([50,60,70]),n=pick([5,10,20,100]),C=314*d/100,tot=C*n,m=tot/100,wq=T(`Ett cykelhjul har diametern ${d} cm. Hur långt rullar cykeln på ${n} varv? Svara i meter.`,`A bike wheel has a diameter of ${d} cm. How far does the bike roll in ${n} turns? Answer in metres.`,`قطر عجلة دراجة ${d} سم. كم مترًا تقطع الدراجة في ${n} دورة؟ أجب بالمتر.`);
   return{kind:"num",dec:true,ans:m,show:`${nf(m)} m`,nt:"wheel",hsay:t3("Ett varv är lika långt som omkretsen. Räkna ut omkretsen och gångra med antalet varv.","One turn is as long as the circumference. Work out the circumference and multiply by the number of turns.","الدورة الواحدة تساوي المحيط. احسب المحيط ثم اضربه في عدد الدورات."),
    q:[A.wipe(),...circ("wheel"),...dLine(`d = ${d} cm`),...para(wq,RC,74,28,22,36),A.tx(T(`Räkna med π ≈ ${PI()}`,`Use π ≈ ${PI()}`,`استخدم π ≈ ${PI()}`),RC,260,26,"o")],
    sol:[tf(`${PI()} ${M} ${d} = ${nf(C)} cm`,RC,310,32,330,"b"),fin(tf(`${n} ${M} ${nf(C)} = ${nf(tot)} cm`,RC,360,32,330)),fin(A.hl(RC-150,388,300,62)),fin(tf(`= ${nf(m)} m`,RC,434,42,290,"g"))]}}
  const o=pick(CIRC2),r=rint(o.r[0],o.r[1]),ex=Math.round(314*2*r)/100,rnd=Math.random()<.4&&(628*r)%10!==0,ans=rnd?Math.round(ex*10)/10:ex;
  return{kind:"num",dec:true,ans,show:`${nf(ans)} ${o.u}`,nt:rnd?"round":"old",q:[A.wipe(),...circ(o.k),...rLine(`r = ${r} ${o.u}`),
    ...cq(o.n,rnd?T("Avrunda till en decimal.","Round to one decimal place.","قرّب إلى منزلة عشرية واحدة."):"")],
   sol:[A.p(R.dashed(cx-R0,cy,cx,cy,12),"b",4),tf(`d = 2 ${M} ${r} = ${2*r} ${o.u}`,RC,275,36,300,"b"),fin(A.tx(`${PI()} ${M} ${2*r}`,RC,335,40)),fin(A.hl(RC-150,366,300,62)),fin(tf(`= ${nf(ex)} ${o.u}${rnd?` ≈ ${nf(ans)} ${o.u}`:""}`,RC,412,42,290,"g"))]}}
});
Object.assign(HELPX,{circle6:[
 {say:t3("Linda ett snöre runt en burk och lägg det rakt. Snöret räcker till tre burkbredder och lite till.",
   "Wrap a string around a tin and lay it out straight. The string is as long as three tin widths and a bit more.",
   "لُفّ خيطًا حول علبة ثم مدّه مستقيمًا. طول الخيط يساوي عرض العلبة 3 مرات وقليلًا."),
  draw:()=>{const x0=300,d=120,o=[A.p("M60,120A60,18 0 0 0 180,120A60,18 0 0 0 60,120M60,120V330A60,18 0 0 0 180,330V120","k",4.5),A.p("M60,230A60,18 0 0 0 180,230","r",5),
    ...lenArrow(60,180,390,"d","b",34),A.arrow(200,230,280,260,"r",-20),A.p(R.line(x0,260,x0+3.14*d,260,.2),"r",6)];
   for(let i=0;i<3;i++)o.push(A.p(`M${x0+i*d+4},282h${d-8}`,"b",4),A.tx("d",x0+i*d+d/2,320,34,"b"));
   o.push(A.tx(T("+ lite","+ a bit","+ قليل"),x0+3.08*d,226,26,"o"),A.hl(400,390,300,62),A.tx(`≈ ${PI()} ${MUL()} d`,550,436,44,"g"));return o}}]});
Object.assign(HINTSX,{circle6:[
 {say:t3("Diametern går tvärs över cirkeln och är dubbelt så lång som radien.","The diameter goes right across the circle and is twice as long as the radius.","القطر يقطع الدائرة من جهة إلى أخرى، وطوله ضعف نصف القطر."),cut:noFin},
 {say:t3("Omkretsen är ungefär 3,14 gånger diametern.","The circumference is about 3.14 times the diameter.","المحيط يساوي تقريبًا 3.14 ضرب القطر."),cut:noFin},
 {say:t3("Räkna först ut diametern: d = 2 · r. Multiplicera sedan med 3,14.","First work out the diameter: d = 2 × r. Then multiply by 3.14.","احسب القطر أولًا: d = 2 × r، ثم اضرب في 3.14."),cut:noFin}]});

/* =====================================================================
   4. vol6: volume of a cuboid, cm³, dm³ and litres
   ===================================================================== */
const DXk=.46,DYk=.3;
/* oblique cuboid: (x,y) = bottom-left-front corner, L along x, W into the board, H up */
const cub=(x,y,L,W,H,u,opt={})=>{const w=L*u,h=H*u,dx=W*u*DXk,dy=W*u*DYk,fy=y-h,P=(a,b)=>`${f1(a)},${f1(b)}`,c=opt.c||"k",o=[];
 const front=[[x,y],[x+w,y],[x+w,fy],[x,fy]],top=[[x,fy],[x+w,fy],[x+w+dx,fy-dy],[x+dx,fy-dy]],side=[[x+w,y],[x+w+dx,y-dy],[x+w+dx,fy-dy],[x+w,fy]];
 if(opt.fill)o.push(A.hatch(poly(front),opt.fill),A.hatch(poly(top),opt.fill),A.hatch(poly(side),opt.fill));
 if(opt.grid){let g="";for(let i=1;i<L;i++)g+=`M${P(x+i*u,y)}L${P(x+i*u,fy)}M${P(x+i*u,fy)}L${P(x+i*u+dx,fy-dy)}`;
  for(let j=1;j<H;j++)g+=`M${P(x,y-j*u)}L${P(x+w,y-j*u)}M${P(x+w,y-j*u)}L${P(x+w+dx,y-j*u-dy)}`;
  for(let k=1;k<W;k++){const ex=dx*k/W,ey=dy*k/W;g+=`M${P(x+ex,fy-ey)}L${P(x+w+ex,fy-ey)}M${P(x+w+ex,y-ey)}L${P(x+w+ex,fy-ey)}`}
  o.push(A.p(g,opt.gc||"#8a96b0",opt.gw||1.8))}
 if(opt.hidden)o.push(A.p(R.dashed(x+dx,y-dy,x,y,9)+R.dashed(x+dx,y-dy,x+w+dx,y-dy,9)+R.dashed(x+dx,y-dy,x+dx,fy-dy,9),"#9aa8c4",2.5));
 o.push(A.p(poly([[x,y],[x+w,y],[x+w+dx,y-dy],[x+w+dx,fy-dy],[x+dx,fy-dy],[x,fy]])+R.line(x,fy,x+w,fy,.2)+R.line(x+w,fy,x+w,y,.2)+R.line(x+w,fy,x+w+dx,fy-dy,.2),c,opt.lw||4.5));
 return{o,w,h,dx,dy,front,top,side}};
/* fit a cuboid into a box centred at (cx,cy) */
const cubFit=(L,W,H,cx,cy,mw,mh,umax)=>{const u=Math.min(umax,mw/(L+W*DXk),mh/(H+W*DYk)),tw=L*u+W*u*DXk,th=H*u+W*u*DYk;return{u,x:cx-tw/2,y:cy+th/2}};
const cubLab=(B,x,y,l,w,h,c="k",sz=30)=>[A.tx(l,x+B.w/2,y+38,sz,c),A.tx(h,x-14,y-B.h/2+10,sz,c,"end"),A.tx(w,x+B.w+B.dx/2+14,y-B.dy/2+26,sz,c,"start")];
const fish=(x,y,s=1)=>A.p(`M${f1(x-22*s)},${y}Q${x},${f1(y-16*s)} ${f1(x+20*s)},${y}Q${x},${f1(y+16*s)} ${f1(x-22*s)},${y}M${f1(x-22*s)},${y}l${f1(-12*s)},${f1(-10*s)}v${f1(20*s)}Z`,"o",3);
const tank=(L,W,H,cx,cy,mw,mh,lab)=>{const F=cubFit(L,W,H,cx,cy,mw,mh,60),B=cub(F.x,F.y,L,W,H,F.u,{}),wl=F.y-B.h*.82;
 const water=[A.hatch(poly([[F.x,F.y],[F.x+B.w,F.y],[F.x+B.w,wl],[F.x,wl]]),"b"),A.hatch(poly([[F.x+B.w,F.y],[F.x+B.w+B.dx,F.y-B.dy],[F.x+B.w+B.dx,wl-B.dy],[F.x+B.w,wl]]),"b"),
  A.p(`M${f1(F.x)},${f1(wl)}L${f1(F.x+B.w)},${f1(wl)}L${f1(F.x+B.w+B.dx)},${f1(wl-B.dy)}`,"b",3)];
 return[...water,...B.o,fish(F.x+B.w*.4,F.y-B.h*.4,Math.min(1.2,F.u/30)),A.p(`M${f1(F.x+B.w*.2)},${f1(F.y-6)}q-8,-20 0,-34q8,-14 0,-28`,"g",3),...(lab?cubLab(B,F.x,F.y,...lab,"k",30):[])]};
const VO6={steps:[
 {say:t3("Volym är hur mycket plats något tar. En kub med sidan 1 cm har volymen 1 kubikcentimeter, 1 cm³. Den är ungefär lika stor som en sockerbit.",
   "Volume is how much space something takes up. A cube with sides of 1 cm has a volume of 1 cubic centimetre, 1 cm³. It is about the size of a sugar cube.",
   "الحجم هو مقدار الحيّز الذي يشغله الشيء. المكعب الذي طول حرفه 1 سم حجمه 1 سنتيمتر مكعب، أي 1 سم³. وهو بحجم مكعب سكر تقريبًا."),
  draw:()=>{const B=cub(120,370,1,1,1,190,{fill:"o"});return[A.wipe(),...B.o,...cubLab(B,120,370,"1 cm","1 cm","1 cm","k",32),
   A.tx("1 cm³",600,170,80,"o"),A.tx(T("en kubikcentimeter","one cubic centimetre","سنتيمتر مكعب واحد"),600,240,32),A.tx(T("≈ en sockerbit","≈ a sugar cube","≈ مكعب سكر"),600,320,34,"b")]}},
 {say:t3("Vi bygger ett rätblock av sådana kuber. Bottenlagret har 4 · 3 = 12 kuber. Med 2 lager blir det 2 · 12 = 24 kuber, alltså 24 cm³.",
   "We build a cuboid out of these cubes. The bottom layer has 4 × 3 = 12 cubes. With 2 layers that makes 2 × 12 = 24 cubes, so 24 cm³.",
   "نبني متوازي مستطيلات من هذه المكعبات. في الطبقة السفلى 4 × 3 = 12 مكعبًا. ومع طبقتين يصبح العدد 2 × 12 = 24 مكعبًا، أي 24 سم³."),
  draw:()=>{const x=90,y=380,u=62,B=cub(x,y,4,3,2,u,{grid:true}),M=MUL();
   return[A.wipe(),A.hatch(poly([[x,y],[x+B.w,y],[x+B.w,y-u],[x,y-u]]),"o"),A.hatch(poly([[x+B.w,y],[x+B.w+B.dx,y-B.dy],[x+B.w+B.dx,y-u-B.dy],[x+B.w,y-u]]),"o"),...B.o,
    ...cubLab(B,x,y,"4 cm","3 cm","2 cm","k",30),A.tx(`4 ${M} 3 = 12`,640,130,42,"o"),A.tx(T("kuber i ett lager","cubes in one layer","مكعبًا في الطبقة"),640,180,28,"o"),
    A.tx(`2 ${M} 12 = 24`,640,270,42),A.tx(T("2 lager","2 layers","طبقتان"),640,320,28),A.hl(520,360,240,62),A.tx("V = 24 cm³",640,406,42,"g")]}},
 {say:t3("Det går snabbare med en formel: volymen är längd · bredd · höjd. Pennskrinet är 20 cm långt, 8 cm brett och 5 cm högt. V = 20 · 8 · 5 = 800 cm³.",
   "There is a quicker way with a formula: the volume is length × width × height. The pencil case is 20 cm long, 8 cm wide and 5 cm high. V = 20 × 8 × 5 = 800 cm³.",
   "هناك طريقة أسرع بالقانون: الحجم = الطول × العرض × الارتفاع. طول علبة الأقلام 20 سم وعرضها 8 سم وارتفاعها 5 سم. V = 20 × 8 × 5 = 800 سم³."),
  draw:()=>{const x=100,y=360,B=cub(x,y,20,8,5,15,{fill:"b",hidden:true}),M=MUL();
   return[A.wipe(),...B.o,...cubLab(B,x,y,"20 cm","8 cm","5 cm","k",30),A.p(R.line(x+30,y-B.h*.5,x+B.w-30,y-B.h*.5,.2),"#9aa8c4",3),
    tf(T("V = längd · bredd · höjd","V = length × width × height","الحجم = الطول × العرض × الارتفاع"),400,82,36,700,"b"),
    A.tx(`V = 20 ${M} 8 ${M} 5`,630,250,40),A.hl(510,290,250,62),A.tx("= 800 cm³",635,336,44,"g")]}},
 {say:t3("En kub med sidan 1 dm, alltså 10 cm, har volymen 10 · 10 · 10 = 1 000 cm³. Det är 1 dm³, och den rymmer precis 1 liter.",
   "A cube with sides of 1 dm, which is 10 cm, has a volume of 10 × 10 × 10 = 1,000 cm³. That is 1 dm³, and it holds exactly 1 litre.",
   "مكعب طول حرفه 1 دسم، أي 10 سم، حجمه 10 × 10 × 10 = 1000 سم³. وهذا 1 دسم³، ويتّسع للتر واحد تمامًا."),
  draw:()=>{const x=110,y=410,B=cub(x,y,10,10,10,22,{grid:true,gc:"#b8c2d6",gw:1.3});
   return[A.wipe(),A.hatch(poly(B.front),"b"),...B.o,...cubLab(B,x,y,"10 cm","10 cm","10 cm","k",28),
    A.tx(`10 ${MUL()} 10 ${MUL()} 10 = ${fmt(1000)} cm³`,615,110,fitS("10 · 10 · 10 = 1 000 cm³",320,36)),A.tx(`1 dm³ = ${fmt(1000)} cm³`,615,190,38,"b"),
    A.hl(475,232,280,62),A.tx("1 dm³ = 1 "+LU(),615,278,44,"g"),A.tx("1 cm³ = 1 ml",615,360,34,"o")]}},
 {say:t3("Akvariet är 50 cm långt, 30 cm brett och 40 cm högt. 50 · 30 · 40 = 60 000 cm³. Varje liter är 1 000 cm³, så det rymmer 60 liter.",
   "The fish tank is 50 cm long, 30 cm wide and 40 cm high. 50 × 30 × 40 = 60,000 cm³. Each litre is 1,000 cm³, so it holds 60 litres.",
   "طول حوض السمك 50 سم وعرضه 30 سم وارتفاعه 40 سم. 50 × 30 × 40 = 60000 سم³. كل لتر 1000 سم³، إذن يتّسع الحوض لـ 60 لترًا."),
  draw:()=>{const M=MUL();return[A.wipe(),...tank(5,3,4,240,250,280,300,["50 cm","30 cm","40 cm"]),
   tf(`50 ${M} 30 ${M} 40 = ${fmt(60000)} cm³`,600,110,34,360),tf(`${fmt(60000)} ${DIVS()} ${fmt(1000)} = 60`,600,180,34,360),A.hl(490,210,220,62),A.tx("= 60 "+LU(),600,256,44,"g")]}},
 {say:t3("Snabbare: gör om till dm först. 5 · 3 · 4 = 60 dm³, och 60 dm³ = 60 liter.",
   "Quicker: change to dm first. 5 × 3 × 4 = 60 dm³, and 60 dm³ = 60 litres.",
   "طريقة أسرع: نحوّل إلى الديسيمتر أولًا. 5 × 3 × 4 = 60 دسم³، و60 دسم³ = 60 لترًا."),
  draw:()=>[A.p(R.line(470,300,730,300,.2),"#9aa8c4",2.5),A.tx("5 dm · 3 dm · 4 dm".replace(/·/g,MUL()),600,350,34,"b"),A.hl(450,382,300,62),A.tx("= 60 dm³ = 60 "+LU(),600,428,40,"g")]}
]};
LESSONS.push({id:"vol6",subject:"math",grades:"6",kind:"wb",
 title:t3("Volym av rätblock","Volume of a cuboid","حجم متوازي المستطيلات"),
 icon:ICO((()=>{const u=30,x=60,y=150,L=4,W=3,H=3,dx=W*u*DXk,dy=W*u*DYk,w=L*u,h=H*u,fy=y-h;let g="";for(let i=1;i<L;i++)g+=`M${x+i*u} ${y}V${fy}L${(x+i*u+dx).toFixed(1)} ${(fy-dy).toFixed(1)}`;for(let j=1;j<H;j++)g+=`M${x} ${y-j*u}H${x+w}l${dx.toFixed(1)} ${(-dy).toFixed(1)}`;for(let k=1;k<W;k++){const ex=(dx*k/W).toFixed(1),ey=(dy*k/W).toFixed(1);g+=`M${x+ +ex} ${fy-ey}h${w}M${x+w+ +ex} ${y-ey}V${fy-ey}`}
  return`<path d="M${x} ${y}h${w}v${-h}h${-w}Z" fill="#e07b00" fill-opacity=".15"/><path d="${g}" stroke="#8a96b0" stroke-width="1.5" fill="none"/><path d="M${x} ${y}H${x+w}L${x+w+dx} ${y-dy}V${fy-dy}H${x+dx}L${x} ${fy}ZM${x} ${fy}H${x+w}V${y}M${x+w} ${fy}l${dx} ${-dy}" fill="none" stroke="#1d2433" stroke-width="4" stroke-linejoin="round"/><text x="250" y="80" ${CV} font-size="40" fill="#2257c9">cm³</text><text x="250" y="135" ${CV} font-size="34" fill="#1e9e5a">1 dm³ = 1 l</text>`})()),
 steps:VO6.steps,mount:wbMount(VO6),
 gen(level){const M=MUL(),D=DIVS(),RC=640;
  if(level===0){const L=rint(2,6),W=rint(2,4),H=rint(1,4),F=cubFit(L,W,H,270,290,290,280,62),B=cub(F.x,F.y,L,W,H,F.u,{grid:true}),u=F.u,V=L*W*H;
   const q=[A.wipe(),...B.o,...cubLab(B,F.x,F.y,`${L} cm`,`${W} cm`,`${H} cm`,"k",28),A.tx(T("Varje kub är 1 cm³","Each cube is 1 cm³","حجم كل مكعب 1 سم³"),RC,80,30,"b"),A.tx(rint(0,1)?T("Hur stor är volymen?","What is the volume?","ما الحجم الكلي؟"):T("Beräkna volymen.","Calculate the volume.","احسب الحجم."),RC,130,32)];
   return{kind:"num",ans:V,show:`${V} cm³`,q,
    sol:[A.hatch(poly([[F.x,F.y],[F.x+B.w,F.y],[F.x+B.w,F.y-u],[F.x,F.y-u]]),"o"),A.hatch(poly([[F.x+B.w,F.y],[F.x+B.w+B.dx,F.y-B.dy],[F.x+B.w+B.dx,F.y-u-B.dy],[F.x+B.w,F.y-u]]),"o"),
     A.tx(`${L} ${M} ${W} = ${L*W}`,RC,230,40,"o"),A.tx(T("kuber i ett lager","cubes in one layer","مكعبًا في الطبقة"),RC,272,26,"o"),
     fin(A.tx(`${H} ${M} ${L*W} = ${V}`,RC,340,40)),fin(A.hl(RC-130,372,260,62)),fin(A.tx(`V = ${V} cm³`,RC,418,42,"g"))]}}
  if(level===1&&Math.random()<.3){/* 1 cm³ = 1 ml: how many ml does a carton hold? */
   const [L,W,H]=pick([[6,4,10],[8,5,20],[10,6,15],[7,7,20],[6,5,12],[9,6,15],[5,4,8]]),V=L*W*H,F=cubFit(L,W,H,270,290,290,270,40),B=cub(F.x,F.y,L,W,H,F.u,{fill:"g",hidden:true});
   const q=[A.wipe(),...B.o,...cubLab(B,F.x,F.y,`${L} cm`,`${W} cm`,`${H} cm`,"k",28),...para(rint(0,1)?T("Hur många milliliter rymmer förpackningen?","How many millilitres does the carton hold?","كم مليلترًا تتّسع العلبة؟"):T("Beräkna förpackningens volym i ml.","Work out the volume of the carton in ml.","احسب حجم العلبة بالمليلتر."),RC,90,32,20,42)];
   return{kind:"num",ans:V,show:`${fmt(V)} ml`,nt:"ml",hsay:t3("Räkna ut volymen i cm³. Varje cm³ rymmer 1 ml.","Work out the volume in cm³. Each cm³ holds 1 ml.","احسب الحجم بالسنتيمتر المكعب. كل 1 سم³ يتّسع لـ 1 مل."),q,
    sol:[fin(tf(`${L} ${M} ${W} ${M} ${H} = ${fmt(V)} cm³`,RC,250,36,300,"b")),A.tx("1 cm³ = 1 ml",RC,310,34,"o"),fin(A.hl(RC-130,342,260,62)),fin(A.tx(`= ${fmt(V)} ml`,RC,388,44,"g"))]}}
  if(level===1){
   if(rint(0,1)){let L,W,H;do{L=rint(5,20);W=rint(2,12);H=rint(2,10)}while(W>L||L*W*H>2400);const V=L*W*H,F=cubFit(L,W,H,270,290,290,270,40),B=cub(F.x,F.y,L,W,H,F.u,{fill:"o",hidden:true});
    const q=[A.wipe(),...B.o,...cubLab(B,F.x,F.y,`${L} cm`,`${W} cm`,`${H} cm`,"k",28),...para(rint(0,1)?T("Vad är lådans volym?","What is the volume of the box?","ما حجم الصندوق؟"):T("Beräkna lådans volym.","Calculate the volume of the box.","احسب حجم الصندوق."),RC,90,32,20,42)];
    return{kind:"num",ans:V,show:`${fmt(V)} cm³`,q,
     sol:[tf(T("V = längd · bredd · höjd","V = length × width × height","الطول × العرض × الارتفاع"),RC,220,30,300),fin(tf(`${L} ${M} ${W} ${M} ${H}`,RC,290,40,300,"b")),fin(A.hl(RC-140,322,280,62)),fin(tf(`= ${fmt(V)} cm³`,RC,368,42,270,"g"))]}}
   const L=rint(3,9),W=rint(2,5),H=rint(2,6),V=L*W*H;
   const q=[A.wipe(),...tank(L,W,H,270,290,290,270,[`${L} dm`,`${W} dm`,`${H} dm`]),...para(T("Hur många liter rymmer akvariet?","How many litres does the fish tank hold?","كم لترًا يسع حوض السمك؟"),RC,90,32,20,42)];
   return{kind:"num",ans:V,show:`${V} l`,q,
    sol:[A.tx("1 dm³ = 1 "+LU(),RC,220,34,"b"),fin(tf(`${L} ${M} ${W} ${M} ${H} = ${V} dm³`,RC,290,38,300)),fin(A.hl(RC-130,322,260,62)),fin(A.tx(`= ${V} ${LU()}`,RC,368,44,"g"))]}}
  const L=rint(3,8)*10,W=rint(2,4)*10,H=rint(2,5)*10,V=L*W*H/1000;
  const q=[A.wipe(),...tank(L/10,W/10,H/10,270,290,290,260,[`${L} cm`,`${W} cm`,`${H} cm`]),...para(rint(0,1)?T("Hur många liter rymmer akvariet?","How many litres does the fish tank hold?","كم لترًا يسع حوض السمك؟"):T("Beräkna akvariets volym i liter.","Work out the volume of the fish tank in litres.","احسب حجم حوض السمك باللتر."),RC,90,32,20,42)];
  return{kind:"num",ans:V,show:`${V} l`,q,
   sol:[A.tx(T("Gör om till dm:","Change to dm:","نحوّل إلى الديسيمتر:"),RC,215,30,"b"),A.tx(`${L/10} dm ${M} ${W/10} dm ${M} ${H/10} dm`,RC,265,fitS(`${L/10} dm · ${W/10} dm · ${H/10} dm`,300,32),"b"),
    fin(A.tx(`= ${V} dm³`,RC,330,40)),fin(A.hl(RC-120,362,240,62)),fin(A.tx(`= ${V} ${LU()}`,RC,408,44,"g"))]}}
});
Object.assign(HELPX,{vol6:[
 {say:t3("Tänk på en låda med sockerbitar. Volymen är hur många bitar som får plats: 3 · 2 · 2 = 12 bitar.",
   "Think of a box of sugar cubes. The volume is how many cubes fit inside: 3 × 2 × 2 = 12 cubes.",
   "فكّر في علبة مكعبات سكر. الحجم هو عدد المكعبات التي تتّسع لها العلبة: 3 × 2 × 2 = 12 مكعبًا."),
  draw:()=>{const B=cub(110,380,3,2,2,80,{grid:true,fill:"o",gc:"#1d2433",gw:2.5});return[...B.o,A.tx(T("sockerbitar","sugar cubes","مكعبات سكر"),620,150,38,"o"),A.hl(490,232,260,62),A.tx(`3 ${MUL()} 2 ${MUL()} 2 = 12`,620,278,42,"g")]}},
 {say:t3("Ett mjölkpaket på 1 liter rymmer lika mycket som en kub med sidan 1 dm. Därför är 1 dm³ = 1 l.",
   "A 1-litre milk carton holds as much as a cube with sides of 1 dm. That is why 1 dm³ = 1 l.",
   "علبة حليب سعتها لتر واحد تتّسع لما يتّسع له مكعب طول حرفه 1 دسم. لذلك 1 دسم³ = 1 لتر."),
  draw:()=>{const B=cub(110,380,1,1,1,190,{fill:"b"});return[...B.o,...cubLab(B,110,380,"1 dm","1 dm","1 dm","k",30),A.tx("=",480,300,70),
   A.p("M560,380V200L590,150H680L710,200V380Z M560,200H710M590,150V130H680V150","b",4.5),A.tx(T("MJÖLK","MILK","حليب"),635,270,30,"b"),A.tx("1 "+LU(),635,340,44,"k"),A.hl(250,412,300,62),A.tx("1 dm³ = 1 "+LU(),400,458,44,"g")]}}]});
Object.assign(HINTSX,{vol6:[
 {say:t3("Räkna kuberna i ett lager. Multiplicera sedan med antalet lager.","Count the cubes in one layer. Then multiply by the number of layers.","عُدّ المكعبات في طبقة واحدة، ثم اضرب في عدد الطبقات."),cut:noFin},
 {say:t3("Volym = längd · bredd · höjd. Kom ihåg att 1 dm³ = 1 liter.","Volume = length × width × height. Remember that 1 dm³ = 1 litre.","الحجم = الطول × العرض × الارتفاع. وتذكّر أن 1 دسم³ = 1 لتر."),cut:noFin},
 {say:t3("Gör om alla mått till dm först. Då blir svaret i dm³, och 1 dm³ = 1 liter.","Change all the measurements to dm first. Then the answer is in dm³, and 1 dm³ = 1 litre.","حوّل كل الأبعاد إلى الديسيمتر أولًا، فيكون الناتج بالدسم³، و1 دسم³ = 1 لتر."),cut:noFin}]});
/* a question type can bring its own hint text (g.hsay) and cut (g.hcut); the app calls cut(g) just before it reads say */
for(const id of ["scale6","tri6","circle6","vol6"]){const H=HINTSX[id];if(H)HINTSX[id]=H.map(h=>{let cur=null;
 return{cut:g=>{cur=g;return g.hcut?g.hcut(g):h.cut(g)},get say(){return cur&&cur.hsay||h.say}}})}
}
