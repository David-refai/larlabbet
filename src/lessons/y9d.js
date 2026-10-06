/* ===== y9d.js ===== */
/* =====================================================================
   YEAR 9 (y9d): combinatorics, probability with and without replacement,
   critical statistics, programming with functions and loops
   ===================================================================== */
{
const LRI=s=>"⁦"+s+"⁩";                       /* keeps formulas left-to-right inside Arabic speech */
const txe=(s,x,y,size=26,c="k",anc)=>Object.assign(A.tx(s,x,y,size,c,anc),{dur:170});
const mark=(a,m="ans")=>Object.assign(a,{m});
const upTo=(m="ans")=>g=>{const k=g.sol.findIndex(a=>a.m===m);return k<0?[]:g.sol.slice(0,k)};
const ICO=b=>`<svg viewBox="0 0 320 180"><rect width="320" height="180" fill="#fff"/>${b}</svg>`;
const CV=`font-family="Caveat,cursive" font-weight="700" text-anchor="middle"`;
const HEX={k:"#1d2433",b:"#2257c9",r:"#d63b2f",g:"#1e9e5a",o:"#e07b00"};
const gcd9=(a,b)=>b?gcd9(b,a%b):a;
const CW9={" ":.25,"·":.33,"(":.33,")":.33,"/":.28,",":.25,".":.25,":":.25,"=":.57,"+":.57,"−":.57,"×":.57,"<":.57,">":.57,"≈":.57,"%":1,"→":1,"m":.83,"M":.94,"W":1,"i":.28,"l":.28};
const tw=(s,size)=>[...String(s)].reduce((a,c)=>a+(CW9[c]??(/[0-9]/.test(c)?.5:.46)),0)*size;   /* width of handwritten Caveat text */
const polyD=pts=>"M"+pts.map(p=>f1(p[0])+","+f1(p[1])).join("L")+"Z";
const at=(pts,x,y,s=1)=>pts.map(([a,b])=>[x+a*s,y+b*s]);
/* question header: one to three centred lines, the last one blue */
const fit=(s,size,w=760)=>Math.min(size,Math.floor(w/tw(s,1)));
const head=(lines,size=30,y0=48,gap=42)=>[A.wipe(),...lines.map((t,i)=>A.tx(L(t),400,y0+i*gap,fit(L(t),size),i===lines.length-1?"b":"k"))];
/* a row of maths: strings, fractions {f:[n,d]} and coloured dots {dot:c}; y is the text baseline */
function mrow(tokens,x,y,size=40,c="k",anchor="middle"){
 const fs=size*.8,W=tokens.map(t=>t.f?Math.max(String(t.f[0]).length,String(t.f[1]).length)*fs*.42+fs*.3+size*.3:t.dot?size*.55:tw(t.s??t,size)+size*.22);
 const tot=W.reduce((a,b)=>a+b,0);let px=anchor==="start"?x:anchor==="end"?x-tot:x-tot/2;const o=[];
 tokens.forEach((t,i)=>{const cx=px+W[i]/2,col=t.c||c;let part;
  if(t.f)part=A.frac(t.f[0],t.f[1],cx,y-size*.3,fs,col);
  else if(t.dot)part=[A.p(dots([[cx,y-size*.3]]),t.dot,size*.42)];
  else part=[txe(t.s??t,cx,y,size,col)];
  if(t.ans)mark(part[0]);o.push(...part);px+=W[i]});
 return o}
const F=(n,d,ex)=>Object.assign({f:[n,d]},ex||{});

/* ---------- small pictures ---------- */
const SHIRT=[[-.2,-.5],[-.5,-.32],[-.4,-.08],[-.28,-.14],[-.28,.5],[.28,.5],[.28,-.14],[.4,-.08],[.5,-.32],[.2,-.5],[.1,-.38],[0,-.35],[-.1,-.38]];
const PANTS=[[-.3,-.5],[.3,-.5],[.36,.5],[.08,.5],[0,-.12],[-.08,.5],[-.36,.5]];
const CAP=[[-.42,.12],[-.4,-.12],[-.28,-.32],[-.08,-.4],[.12,-.36],[.3,-.2],[.36,.04],[.62,.1],[.6,.2],[-.42,.2]];
const SHOE=[[-.5,-.3],[-.18,-.3],[-.1,-.12],[.3,0],[.5,.12],[.5,.3],[-.5,.3]];
const SOCK=[[-.36,-.5],[.04,-.5],[.04,.08],[.3,.2],[.4,.34],[.32,.48],[-.12,.48],[-.36,.32]];
const CARD=[[-.32,-.46],[.32,-.46],[.32,.46],[-.32,.46]];
const TICKET=[[-.5,-.3],[.5,-.3],[.5,-.08],[.42,0],[.5,.08],[.5,.3],[-.5,.3],[-.5,.08],[-.42,0],[-.5,-.08]];
/* many copies of one shape, grouped by colour so the pen draws one stroke per colour */
function shapes(base,items,s,hatch=true,w=3.5){const by={};items.forEach(([x,y,c])=>{(by[c]=by[c]||[]).push(at(base,x,y,s))});const o=[];
 for(const c in by){o.push(A.p(by[c].map(p=>plines(p)).join(""),c,w));if(hatch&&c!=="k0")o.push(A.hatch(by[c].map(polyD).join(""),c))}return o}
const iconSvg=(base,x,y,s,c,fill=true)=>`<path d="${polyD(at(base,x,y,s))}" fill="${fill?HEX[c]:"none"}" fill-opacity=".25" stroke="${HEX[c]}" stroke-width="3" stroke-linejoin="round"/>`;

/* ---------------------------------------------------------------
   1. comb9: combinatorics, how many ways?
   --------------------------------------------------------------- */
/* boxes in a row with a label over each; vals go inside, × between */
function slots(labels,y,vals,lc="b"){const n=labels.length,G=44,W=Math.min(140,(720-(n-1)*G)/n),x0=400-(n*W+(n-1)*G)/2,X=i=>x0+i*(W+G)+W/2;
 const box=[A.p(labels.map((_,i)=>R.rect(X(i)-W/2,y,W,88,.4)).join(""),"k",3.5),...labels.map((l,i)=>txe(l,X(i),y-14,labels.some(s=>String(s).length>8)?24:26,lc))];
 const val=vals?vals.map((v,i)=>txe(v,X(i),y+62,String(v).length>2?44:52,"b")):[];
 const tim=labels.slice(1).map((_,i)=>txe(MUL(),X(i)+W/2+G/2,y+58,40,"k"));
 return{box,val,tim,X,W}}
const prod=(vals,ans,y,size=50)=>{const s=vals.map(v=>fmt(v)).join(` ${MUL()} `),w=tw(s,size)+tw(" = "+fmt(ans),size);
 return[A.hl(400-w/2-24,y-size*.95,w+48,size*1.3),...mrow([s,{s:"= "+fmt(ans),c:"g",ans:true}],400,y,size)]};
const CLO=t3({top:"tröja",pants:"byxor",shoes:"skor",cap:"keps",tops:"tröjor",pantsP:"byxor",caps:"kepsar"},
 {top:"top",pants:"trousers",shoes:"shoes",cap:"cap",tops:"tops",pantsP:"trousers",caps:"caps"},
 {top:"قميص",pants:"بنطال",shoes:"حذاء",cap:"قبعة",tops:"قمصان",pantsP:"سراويل",caps:"قبعات"});
const arN=(n,dual,pl)=>n===2?dual:`${n} ${pl}`;
const TREE_Y=[140,270,400],SHC=["r","b","g"],PC=["k","o"];
const COMB={steps:[
 {say:t3("Du ska på fest och har 3 tröjor och 2 par byxor. Hur många olika kombinationer kan du välja? Ett träddiagram visar alla: 6 stycken.",
   "You're going to a party and have 3 tops and 2 pairs of trousers. How many different outfits can you choose? A tree diagram shows them all: 6.",
   "أنت ذاهب إلى حفلة ولديك 3 قمصان وبنطالان. كم تشكيلة مختلفة يمكنك أن تختار؟ المخطط الشجري يُظهرها كلها: 6 تشكيلات."),
  draw:()=>{const W=L(CLO),o=[A.wipe(),A.tx(W.top,250,56,32,"b"),A.tx(W.pants,450,56,32,"o")];
   o.push(A.p(dots([[80,270]]),"k",16),A.p(TREE_Y.map(y=>R.line(88,270,212,y,.3)).join(""),"k",3));
   o.push(...shapes(SHIRT,TREE_Y.map((y,i)=>[250,y,SHC[i]]),62));
   const leaves=[];TREE_Y.forEach(y=>[-34,34].forEach((d,j)=>leaves.push([y,y+d,j])));
   o.push(A.p(leaves.map(([y,ly])=>R.line(286,y,418,ly,.3)).join(""),"k",3));
   o.push(...shapes(PANTS,leaves.map(([,ly,j])=>[450,ly,PC[j]]),50));
   o.push(...leaves.map(([,ly],i)=>txe(i+1,510,ly+10,30,"g")));return o}},
 {say:t3("Varje tröja kan kombineras med 2 byxor. 3 val gånger 2 val: 3 · 2 = 6. Det kallas multiplikationsprincipen.",
   "Each top goes with 2 pairs of trousers. 3 choices times 2 choices: 3 × 2 = 6. This is called the multiplication principle.",
   `كل قميص يمكن أن يُلبس مع بنطالين. عدد الخيارات 3 مضروبًا في 2: ${LRI("3 × 2 = 6")}. وهذا يُسمّى مبدأ الضرب.`),
  draw:()=>[A.p(R.loop(510,270,26,196),"g"),A.hl(568,232,192,62),A.tx(`3 ${MUL()} 2 = 6`,664,280,52,"g"),
   A.tx(L(t3("kombinationer","outfits","تشكيلات")),664,340,30,"g"),A.tx(L(t3("3 tröjor","3 tops","3 قمصان")),664,140,28,"b"),A.tx(L(t3("2 byxor var","2 trousers each","بنطالان لكل قميص")),664,180,28,"o")]},
 {say:t3("Lägg till 2 par skor. Nu blir det 3 · 2 · 2 = 12 kombinationer. Multiplicera antalet val i varje steg.",
   "Add 2 pairs of shoes. Now there are 3 × 2 × 2 = 12 outfits. Multiply the number of choices at each step.",
   `أضف زوجين من الأحذية. يصبح العدد ${LRI("3 × 2 × 2 = 12")} تشكيلة. اضرب عدد الخيارات في كل خطوة.`),
  draw:()=>{const W=L(CLO),S=slots([W.top,W.pants,W.shoes],250,[3,2,2]);
   return[A.wipe(),A.tx(L(t3("Multiplikationsprincipen","The multiplication principle","مبدأ الضرب")),400,62,42,"b"),
    ...shapes(SHIRT,[[S.X(0),160,"r"]],64),...shapes(PANTS,[[S.X(1),160,"k"]],60),...shapes(SHOE,[[S.X(2),168,"o"]],62),
    ...S.box,...S.val,...S.tim,...prod([3,2,2],12,440)]}},
 {say:t3("Mobilens PIN-kod har 4 siffror. Varje plats kan vara 0–9, alltså 10 val, och siffror får upprepas: 10 · 10 · 10 · 10 = 10 000 koder.",
   "A phone PIN has 4 digits. Each place can be 0–9, so 10 choices, and digits may repeat: 10 × 10 × 10 × 10 = 10,000 codes.",
   `رمز PIN للهاتف من 4 أرقام. كل خانة يمكن أن تكون من 0 إلى 9، أي 10 خيارات، ويجوز تكرار الأرقام: ${LRI("10 × 10 × 10 × 10 = 10000")} رمز.`),
  draw:()=>{const S=slots(["0–9","0–9","0–9","0–9"],190,[10,10,10,10]);
   return[A.wipe(),A.tx(L(t3("PIN-kod med 4 siffror","A 4-digit PIN code","رمز PIN من 4 أرقام")),400,70,42,"b"),...S.box,...S.val,...S.tim,
    A.tx(L(t3("siffrorna får upprepas, t.ex. 7 7 0 7","digits may repeat, e.g. 7 7 0 7","يجوز تكرار الأرقام، مثل 7 7 0 7")),400,340,30,"o"),...prod([10,10,10,10],10000,440,46)]}},
 {say:t3("8 löpare springer en final. Guld kan gå till 8, silver sedan till 7 och brons till 6, för ingen kan vinna två medaljer: 8 · 7 · 6 = 336.",
   "8 runners race in a final. Gold can go to 8, then silver to 7 and bronze to 6, because nobody can win two medals: 8 × 7 × 6 = 336.",
   `في السباق النهائي 8 عدّائين. الذهبية يمكن أن تذهب إلى 8، ثم الفضية إلى 7، ثم البرونزية إلى 6، لأن أحدًا لا يفوز بميداليتين: ${LRI("8 × 7 × 6 = 336")}.`),
  draw:()=>{const P=[[250,300,"silver","silver","فضية","k"],[400,240,"guld","gold","ذهبية","o"],[550,340,"brons","bronze","برونزية","r"]],B=400;
   const nm=i=>L(t3(P[i][2],P[i][3],P[i][4]));
   return[A.wipe(),A.tx(L(t3("Final med 8 löpare","A final with 8 runners","نهائي فيه 8 عدّائين")),400,62,42,"b"),
    A.p(P.map(([x,t])=>R.rect(x-75,t,150,B-t,.3)).join(""),"k",4),...[[1,1],[0,2],[2,3]].map(([i,k])=>A.tx(k,P[i][0],P[i][1]+50,40,"k")),
    ...[1,0,2].map(i=>txe(nm(i),P[i][0],P[i][1]-62,28,P[i][5])),
    ...[[1,8],[0,7],[2,6]].map(([i,v])=>A.tx(v,P[i][0],P[i][1]-16,44,"b")),...prod([8,7,6],336,470,46)]}},
 {say:t3("Du ordnar 5 låtar i en spellista. Första låten kan väljas på 5 sätt, nästa på 4, och så vidare: 5 · 4 · 3 · 2 · 1 = 120. Det skrivs 5! och kallas 5-fakultet.",
   "You put 5 songs in order in a playlist. The first song can be chosen in 5 ways, the next in 4, and so on: 5 × 4 × 3 × 2 × 1 = 120. This is written 5! and called 5 factorial.",
   `تريد ترتيب 5 أغانٍ في قائمة تشغيل. الأغنية الأولى تُختار بـ5 طرق، والتالية بـ4، وهكذا: ${LRI("5 × 4 × 3 × 2 × 1 = 120")}. ويُكتب ذلك ${LRI("5!")} ويُسمّى مضروب 5.`),
  draw:()=>{const lab=i=>L(t3(`låt ${i}`,`song ${i}`,`أغنية ${i}`)),S=slots([1,2,3,4,5].map(lab),190,[5,4,3,2,1]);
   return[A.wipe(),A.tx(L(t3("Spellista med 5 låtar","A playlist of 5 songs","قائمة تشغيل من 5 أغانٍ")),400,70,42,"b"),...S.box,...S.val,...S.tim,
    ...prod([5,4,3,2,1],120,390,46),A.tx(`5! = 120`,400,462,40,"o")]}}
]};
LESSONS.push({id:"comb9",subject:"math",grades:"9",kind:"wb",
 title:t3("Kombinatorik – på hur många sätt?","Combinatorics: how many ways?","التحليل التوافقي: بكم طريقة؟"),
 icon:ICO(`<circle cx="40" cy="92" r="6" fill="#1d2433"/>`+[40,92,144].map((y,i)=>`<path d="M46 92L104 ${y}" stroke="#1d2433" stroke-width="2.5"/>${iconSvg(SHIRT,124,y,36,SHC[i])}`+[-18,18].map((d,j)=>`<path d="M144 ${y}L192 ${y+d}" stroke="#1d2433" stroke-width="2"/>${iconSvg(PANTS,208,y+d,24,PC[j])}`).join("")).join("")
  +`<text x="272" y="80" ${CV} font-size="34" fill="#2257c9">3·2</text><text x="272" y="118" ${CV} font-size="34" fill="#1e9e5a">= 6</text>`),
 steps:COMB.steps,mount:wbMount(COMB),
 gen(level){const W=L(CLO);
  if(level===0){const three=Math.random()<.5,cnt=[rint(2,5),rint(2,4)];if(three)cnt.push(rint(2,3));const ans=cnt.reduce((a,b)=>a*b,1);
   const keys=[["tops",SHIRT,62],["pantsP",PANTS,56],["caps",CAP,64]].slice(0,cnt.length),COLS=["r","b","g","o","k"];
   const Y=three?[175,275,375]:[200,320];
   const q=head(three?[t3(`Du har ${cnt[0]} tröjor, ${cnt[1]} par byxor och ${cnt[2]} kepsar.`,`You have ${cnt[0]} tops, ${cnt[1]} pairs of trousers and ${cnt[2]} caps.`,`لديك ${arN(cnt[0],"قميصان","قمصان")} و${arN(cnt[1],"بنطالان","سراويل")} و${arN(cnt[2],"قبعتان","قبعات")}.`),
     t3("Hur många olika kombinationer kan du välja?","How many different outfits can you choose?","كم تشكيلة مختلفة يمكنك أن تختار؟")]
    :[t3(`Du har ${cnt[0]} tröjor och ${cnt[1]} par byxor.`,`You have ${cnt[0]} tops and ${cnt[1]} pairs of trousers.`,`لديك ${arN(cnt[0],"قميصان","قمصان")} و${arN(cnt[1],"بنطالان","سراويل")}.`),
     t3("Hur många olika kombinationer kan du välja?","How many different outfits can you choose?","كم تشكيلة مختلفة يمكنك أن تختار؟")]);
   keys.forEach(([k,base,s],r)=>{q.push(A.tx(W[k],140,Y[r]+10,32,"b"));const off=r===0?0:2;q.push(...shapes(base,Array.from({length:cnt[r]},(_,i)=>[250+i*78,Y[r],COLS[(i+off)%5]]),s))});
   const sol=[...cnt.flatMap((n,r)=>[A.loop(670,Y[r]-2,34,34,"b"),A.tx(n,670,Y[r]+14,44,"b")]),...mrow([cnt.join(` ${MUL()} `),{s:"= "+ans,c:"g",ans:true}],400,three?468:450,46)];
   return{kind:"num",ans,show:String(ans),q,sol}}
  if(level===1){const T=rint(0,3);let labels,vals,line1;
   if(T===0){const n=rint(3,4);labels=Array(n).fill("0–9");vals=Array(n).fill(10);
    line1=t3(`Ett cykellås har ${n} hjul med siffrorna 0–9.`,`A bike lock has ${n} wheels with the digits 0–9.`,`لقفل دراجة ${n} عجلات عليها الأرقام من 0 إلى 9.`)}
   else if(T===1){const k=rint(1,2),m=rint(1,2),Lt=pick(["D","E","F"]),nL=" ABCDEF".indexOf(Lt);labels=[...Array(k).fill("A–"+Lt),...Array(m).fill("0–9")];vals=[...Array(k).fill(nL),...Array(m).fill(10)];
    line1=t3(`En kod har ${k===1?"1 bokstav":k+" bokstäver"} (A–${Lt}) och sedan ${m===1?"1 siffra":m+" siffror"} (0–9).`,`A code has ${k===1?"1 letter":k+" letters"} (A–${Lt}) followed by ${m===1?"1 digit":m+" digits"} (0–9).`,
     `رمز يبدأ بـ${k===1?"حرف واحد":"حرفين"} (A–${Lt}) ثم ${m===1?"رقم واحد":"رقمين"} (0–9).`)}
   else if(T===2){const n=rint(2,4);labels=Array.from({length:n},(_,i)=>L(t3(`kast ${i+1}`,`roll ${i+1}`,`رمية ${i+1}`)));vals=Array(n).fill(6);
    line1=t3(`Du slår en tärning ${n} gånger och skriver resultaten i ordning.`,`You roll a dice ${n} times and write the results in order.`,`ترمي حجر نرد ${arN(n,"مرتين","مرات")} وتكتب النتائج بالترتيب.`)}
   else{let n,k;do{k=rint(2,4);n=rint(3,6)}while(k**n>4096);labels=Array.from({length:n},(_,i)=>L(t3(`fråga ${i+1}`,`Q${i+1}`,`سؤال ${i+1}`)));vals=Array(n).fill(k);
    line1=t3(`Ett quiz har ${n} frågor med ${k} svarsalternativ var.`,`A quiz has ${n} questions with ${k} options each.`,`في مسابقة ${n} أسئلة، لكل سؤال ${arN(k,"خياران","خيارات")}.`)}
   const ans=vals.reduce((a,b)=>a*b,1),S=slots(labels,230,null),q2=T===3?t3("På hur många sätt kan man svara?","In how many ways can you answer?","بكم طريقة يمكن الإجابة؟"):t3("Hur många olika följder finns det?","How many different sequences are there?","كم تسلسلًا مختلفًا يوجد؟");
   const sv=slots(labels,230,vals);
   return{kind:"num",ans,show:fmt(ans),q:[...head([line1,q2]),...S.box],sol:[...sv.val,...sv.tim,...prod(vals,ans,430,44)]}}
  /* level 2: order matters, nobody/nothing can be chosen twice */
  const T=rint(0,3);let labels,vals,line1,q2;
  if(T===0){const n=rint(5,10);vals=[n,n-1,n-2];labels=[t3("guld","gold","ذهبية"),t3("silver","silver","فضية"),t3("brons","bronze","برونزية")].map(L);
   line1=t3(`${n} lag spelar en turnering.`,`${n} teams play a tournament.`,`${n} فرق تلعب في بطولة.`);q2=t3("På hur många sätt kan guld, silver och brons fördelas?","In how many ways can gold, silver and bronze be given out?","بكم طريقة يمكن توزيع الذهبية والفضية والبرونزية؟")}
  else if(T===1){const n=rint(11,25);vals=[n,n-1];labels=[t3("ordförande","chair","رئيس"),t3("sekreterare","secretary","أمين سر")].map(L);
   line1=t3(`Elevrådet har ${n} medlemmar.`,`The student council has ${n} members.`,`في مجلس الطلاب ${n} عضوًا.`);q2=t3("På hur många sätt kan de välja en ordförande och en sekreterare?","In how many ways can they choose a chair and a secretary?","بكم طريقة يمكن اختيار رئيس وأمين سر؟")}
  else if(T===2){const n=rint(4,6);vals=Array.from({length:n},(_,i)=>n-i);labels=vals.map((_,i)=>L(t3(`låt ${i+1}`,`song ${i+1}`,`أغنية ${i+1}`)));
   line1=t3(`Du ska spela ${n} låtar på en fest.`,`You will play ${n} songs at a party.`,`ستشغّل ${n} أغانٍ في حفلة.`);q2=t3("I hur många olika ordningar kan låtarna spelas?","In how many different orders can the songs be played?","بكم ترتيب مختلف يمكن تشغيل الأغاني؟")}
  else{const n=rint(3,4);vals=Array.from({length:n},(_,i)=>10-i);labels=vals.map(()=>"0–9");
   line1=t3(`En kod har ${n} siffror (0–9), och alla siffror är olika.`,`A code has ${n} digits (0–9), and all the digits are different.`,`رمز من ${n} أرقام (0–9)، وكل أرقامه مختلفة.`);q2=t3("Hur många sådana koder finns det?","How many such codes are there?","كم رمزًا كهذا يوجد؟")}
  const ans=vals.reduce((a,b)=>a*b,1),S=slots(labels,230,null),sv=slots(labels,230,vals);
  return{kind:"num",ans,show:fmt(ans),q:[...head([line1,q2]),...S.box],
   sol:[...sv.val,...sv.tim,txe(L(t3("ett val färre för varje plats","one choice fewer for each place","خيار أقل في كل خانة")),400,370,28,"o"),...prod(vals,ans,450,44)]}}
});
Object.assign(HELPX,{comb9:[{say:t3("Tänk på en glassbar med 3 smaker och 2 sorters strutar. Ett rutnät visar alla val: 2 rader och 3 kolumner ger 2 · 3 = 6 glassar.",
   "Think of an ice-cream bar with 3 flavours and 2 kinds of cone. A grid shows every choice: 2 rows and 3 columns give 2 × 3 = 6 ice creams.",
   `تخيّل محل بوظة فيه 3 نكهات ونوعان من الأقماع. الجدول يُظهر كل الخيارات: صفّان و3 أعمدة تعطي ${LRI("2 × 3 = 6")} أنواع من البوظة.`),
  draw:()=>{const CX=[322,465,608],RY=[200,345],SC=["r","o","g"],cone=(x,y,s)=>[[x-.32*s,y],[x+.32*s,y],[x,y+.9*s]];
   const o=[A.p(R.rect(250,120,430,290,.4)+R.line(250,265,680,265,.3)+R.line(393,120,393,410,.2)+R.line(537,120,537,410,.2),"k",3)];
   o.push(...SC.map((c,i)=>A.p(dots([[CX[i],72]]),c,44)));
   o.push(A.p(RY.map((y,j)=>plines(cone(150,y-30,70))).join(""),"o",4),A.hatch(polyD(cone(150,RY[1]-30,70)),"o"));
   RY.forEach((y,j)=>CX.forEach((x,i)=>{o.push(A.p(plines(cone(x,y-6,46)),"o",3),A.p(dots([[x,y-14]]),SC[i],34))}));
   o.push(A.hatch(CX.map(x=>polyD(cone(x,RY[1]-6,46))).join(""),"o"));
   o.push(A.hl(250,430,300,58),A.tx(`2 ${MUL()} 3 = 6`,400,474,48,"g"));return o}}]});
Object.assign(HINTSX,{comb9:[
 {say:t3("Hur många val finns i varje grupp? Multiplicera antalen med varandra.","How many choices are in each group? Multiply the numbers together.","كم خيارًا في كل مجموعة؟ اضرب الأعداد بعضها في بعض."),cut:upTo()},
 {say:t3("Skriv antalet möjliga tecken i varje ruta och multiplicera.","Write the number of possible symbols in each box, then multiply.","اكتب عدد الرموز الممكنة في كل خانة ثم اضرب."),cut:upTo()},
 {say:t3("Den som redan är vald kan inte väljas igen. Det blir ett val färre för varje plats.","Someone already chosen can't be chosen again, so there is one choice fewer for each place.","من اختير لا يمكن اختياره مرة أخرى، فيقلّ عدد الخيارات بواحد في كل خانة."),cut:upTo()}]});

/* ---------------------------------------------------------------
   2. prob9: probability with and without replacement
   --------------------------------------------------------------- */
const red9=(n,d)=>{const g=gcd9(n,d);return[n/g,d/g]};
const frs=(n,d)=>{const [a,b]=red9(n,d);return a===n?`${n}/${d}`:`${n}/${d} = ${a}/${b}`};
/* a two-step tree: root, two nodes, four leaves (each leaf shows its two picks as dots) */
function ptree(o){const X1=o.x0+o.dx,X2=o.x0+2*o.dx,Y1=[o.yc-o.h1,o.yc+o.h1],Y2=[Y1[0]-o.h2,Y1[0]+o.h2,Y1[1]-o.h2,Y1[1]+o.h2],c=o.c;
 const B1=Y1.map(y=>[o.x0+8,o.yc,X1-14,y]),B2=Y2.map((y,i)=>[X1+14,Y1[i>>1],X2-16,y]);
 const sk=[A.p(dots([[o.x0,o.yc]]),"k",14),A.p([...B1,...B2].map(b=>R.line(...b,.3)).join(""),"k",3),
  ...[0,1].map(i=>A.p(dots([[X1,Y1[i]],...(i?[]:[])]),c[i],24)),
  ...[0,1].map(j=>A.p(dots(Y2.map((y,i)=>[i>>1===j?X2:-99,y]).filter(p=>p[0]>0)),c[j],20)),
  ...[0,1].map(j=>A.p(dots(Y2.map((y,i)=>[(i&1)===j?X2+24:-99,y]).filter(p=>p[0]>0)),c[j],20))];
 const fr=(b,n,d,col,sz)=>{const [x1,y1,x2,y2]=b,up=y2<y1,mx=(x1+x2)/2-10,my=(y1+y2)/2;return A.frac(n,d,mx,my+(up?-sz*1.3:sz*1.45),sz,col)};
 const sz=o.fs||32;
 const f1=o.p1?B1.map((b,i)=>fr(b,o.p1[i][0],o.p1[i][1],"k",sz)):[],f2=o.p2?B2.map((b,i)=>fr(b,o.p2[i][0],o.p2[i][1],o.c2||"k",sz)):[];
 const path=(i,col="g")=>A.p(R.line(...B1[i>>1],.3)+R.line(...B2[i],.3),col,6);
 return{sk,f1,f2,path,X2,Y2}}
const BAGS={candy:(x,y,s,a,b)=>{const P=`M${x-50*s},${y-55*s}C${x-100*s},${y+10*s} ${x-85*s},${y+78*s} ${x},${y+78*s}C${x+85*s},${y+78*s} ${x+100*s},${y+10*s} ${x+50*s},${y-55*s}Q${x},${y-40*s} ${x-50*s},${y-55*s}M${x-50*s},${y-55*s}l${-14*s},${-26*s}M${x+50*s},${y-55*s}l${14*s},${-26*s}`;
  const n=a+b,per=n>6?5:Math.min(n,4),rows=Math.ceil(n/per),pos=i=>{const r=Math.floor(i/per),inRow=Math.min(per,n-r*per),k=i-r*per;return[x+(k-(inRow-1)/2)*28*s,y+18*s+(r-(rows-1)/2)*30*s]};
  const P1=[...Array(n)].map((_,i)=>pos(i));return[A.p(P,"k",3.5),A.p(dots(P1.slice(0,a)),"r",22*s),A.p(dots(P1.slice(a)),"g",22*s)]},
 socks:(x,y,s,a,b)=>{const n=a+b,per=n>6?5:Math.min(n,4),rows=Math.ceil(n/per),W=per*34*s+24*s,H=rows*44*s+26*s;
  const it=[...Array(n)].map((_,i)=>{const r=Math.floor(i/per),inRow=Math.min(per,n-r*per),k=i-r*per;return[x+(k-(inRow-1)/2)*34*s,y+(r-(rows-1)/2)*44*s,i<a?"b":"k"]});
  return[A.p(R.rect(x-W/2,y-H/2,W,H,.3),"o",3.5),...shapes(SOCK,it,34*s,true,3)]}};
const PCX={candy:{c:["r","g"],
  intro:(a,b)=>t3(`I en påse finns ${a} röda och ${b} gröna godisbitar.`,`A bag has ${a} red and ${b} green sweets.`,`في كيس حلوى: ${a} قطع حمراء و${b} قطع خضراء.`),
  with:t3("Du tar en bit, lägger tillbaka den och tar en till.","You take a sweet, put it back and take another.","تأخذ قطعة، ثم تعيدها وتأخذ قطعة أخرى."),
  wout:t3("Du tar två bitar, en i taget, utan att lägga tillbaka.","You take two sweets, one at a time, without putting any back.","تأخذ قطعتين، واحدة بعد الأخرى، دون إعادة."),
  both:[t3("Hur stor är sannolikheten att båda är röda?","What is the probability that both are red?","ما احتمال أن تكون القطعتان حمراوين؟"),
   t3("Hur stor är sannolikheten att båda är gröna?","What is the probability that both are green?","ما احتمال أن تكون القطعتان خضراوين؟")],
  diff:t3("Hur stor är sannolikheten att de har olika färg?","What is the probability that they are different colours?","ما احتمال أن تكون القطعتان مختلفتين في اللون؟"),
  least:[t3("Hur stor är sannolikheten att minst en är röd?","What is the probability that at least one is red?","ما احتمال أن تكون قطعة واحدة على الأقل حمراء؟"),
   t3("Hur stor är sannolikheten att minst en är grön?","What is the probability that at least one is green?","ما احتمال أن تكون قطعة واحدة على الأقل خضراء؟")]},
 socks:{c:["b","k"],
  intro:(a,b)=>t3(`I en låda ligger ${a} blå och ${b} svarta strumpor.`,`A drawer has ${a} blue and ${b} black socks.`,`في درج جوارب: ${a} زرقاء و${b} سوداء.`),
  with:t3("Du tar en strumpa, lägger tillbaka den och tar en till.","You take a sock, put it back and take another.","تأخذ جوربًا، ثم تعيده وتأخذ جوربًا آخر."),
  wout:t3("Du tar två strumpor, en i taget, utan att lägga tillbaka.","You take two socks, one at a time, without putting any back.","تأخذ جوربين، واحدًا بعد الآخر، دون إعادة."),
  both:[t3("Hur stor är sannolikheten att båda är blå?","What is the probability that both are blue?","ما احتمال أن يكون الجوربان أزرقين؟"),
   t3("Hur stor är sannolikheten att båda är svarta?","What is the probability that both are black?","ما احتمال أن يكون الجوربان أسودين؟")],
  diff:t3("Hur stor är sannolikheten att de har olika färg?","What is the probability that they are different colours?","ما احتمال أن يكون الجوربان مختلفين في اللون؟"),
  least:[t3("Hur stor är sannolikheten att minst en är blå?","What is the probability that at least one is blue?","ما احتمال أن يكون جورب واحد على الأقل أزرق؟"),
   t3("Hur stor är sannolikheten att minst en är svart?","What is the probability that at least one is black?","ما احتمال أن يكون جورب واحد على الأقل أسود؟")]}};
const TS={x0:60,yc:292,dx:160,h1:100,h2:52};
const P35=[[3,5],[2,5]],PW=[[3,5],[2,5],[3,5],[2,5]],PWO=[[2,4],[2,4],[3,4],[1,4]];
const prodRow=(T,i,a,b,res,size=36,col="k")=>mrow([F(...a),MUL(),F(...b),"=",{f:res,c:"g",ans:true}],T.X2+56,T.Y2[i]+10,size,col,"start");
const Pw=(t,y,c)=>{const w=L(t),hw=(lang==="ar"?w.length*13:tw(w,40))/2,x=560;return[A.tx("P(",x-hw-4,y,44,c,"end"),A.tx(w,x,y,40,c),A.tx(") =",x+hw+4,y,44,c,"start")]};
const PRB={steps:[
 {say:t3("I påsen finns 3 röda och 2 gröna godisbitar. Du tar en utan att titta. Chansen att få en röd är 3/5.",
   "The bag has 3 red and 2 green sweets. You take one without looking. The chance of getting a red one is 3/5.",
   `في الكيس 3 قطع حلوى حمراء وقطعتان خضراوان. تأخذ واحدة دون أن تنظر. احتمال أن تكون حمراء هو ${LRI("3/5")}.`),
  draw:()=>[A.wipe(),...BAGS.candy(230,250,1.7,3,2),...Pw(t3("röd","red","حمراء"),212,"r"),...A.frac(3,5,690,198,44,"r"),
   ...Pw(t3("grön","green","خضراء"),372,"g"),...A.frac(2,5,690,358,44,"g"),
   A.tx(L(t3("5 bitar totalt","5 sweets in total","5 قطع في المجموع")),230,470,30,"k")]},
 {say:t3("Med återläggning lägger du tillbaka biten. Påsen är likadan igen, så chansen för röd är 3/5 även andra gången.",
   "With replacement you put the sweet back. The bag is the same again, so the chance of red is 3/5 the second time too.",
   `مع الإرجاع تعيد القطعة إلى الكيس. يعود الكيس كما كان، فيبقى احتمال الحمراء ${LRI("3/5")} في المرة الثانية أيضًا.`),
  draw:()=>{const T=ptree({...TS,c:["r","g"],p1:P35,p2:PW});return[A.wipe(),A.tx(L(t3("Med återläggning","With replacement","مع الإرجاع")),400,54,40,"b"),...T.sk,...T.f1.flat(),...T.f2.flat(),
   A.tx(L(t3("1:a","1st","الأولى")),TS.x0+TS.dx,108,26,"o"),A.tx(L(t3("2:a","2nd","الثانية")),TS.x0+2*TS.dx+12,92,26,"o")]}},
 {say:t3("Båda röda: följ grenarna och multiplicera. 3/5 · 3/5 = 9/25.","Both red: follow the branches and multiply. 3/5 × 3/5 = 9/25.",`كلتاهما حمراء: اتبع الفرعين واضرب: ${LRI("3/5 × 3/5 = 9/25")}.`),
  draw:()=>{const T=ptree({...TS,c:["r","g"]});return[T.path(0),...prodRow(T,0,[3,5],[3,5],[9,25])]}},
 {say:t3("Utan återläggning äter du upp biten. Tog du en röd finns 4 bitar kvar och bara 2 röda. Då blir chansen 2/4.",
   "Without replacement you eat the sweet. If you took a red one, 4 sweets are left and only 2 are red. So the chance is 2/4.",
   `دون إرجاع تأكل القطعة. إذا أخذت حمراء بقيت 4 قطع، منها قطعتان حمراوان فقط. فيصبح الاحتمال ${LRI("2/4")}.`),
  draw:()=>{const T=ptree({...TS,c:["r","g"],p1:P35,p2:PWO,c2:"o"});return[A.wipe(),A.tx(L(t3("Utan återläggning","Without replacement","دون إرجاع")),400,54,40,"b"),...T.sk,...T.f1.flat(),...T.f2.flat(),
   A.tx(L(t3("4 kvar","4 left","بقيت 4")),TS.x0+2*TS.dx+12,92,26,"o")]}},
 {say:t3("Båda röda: 3/5 · 2/4 = 6/20. Det är mindre än med återläggning, eftersom det finns färre röda kvar.",
   "Both red: 3/5 × 2/4 = 6/20. That is less than with replacement, because there are fewer red ones left.",
   `كلتاهما حمراء: ${LRI("3/5 × 2/4 = 6/20")}. وهذا أقل منه مع الإرجاع، لأن القطع الحمراء الباقية أقل.`),
  draw:()=>{const T=ptree({...TS,c:["r","g"]});return[T.path(0),...prodRow(T,0,[3,5],[2,4],[6,20])]}},
 {say:t3("Olika färg kan bli på två sätt: röd–grön och grön–röd. Räkna ut båda vägarna och addera: 6/20 + 6/20 = 12/20.",
   "Different colours can happen in two ways: red–green and green–red. Work out both paths and add: 6/20 + 6/20 = 12/20.",
   `اختلاف اللون يحدث بطريقتين: حمراء ثم خضراء، وخضراء ثم حمراء. احسب المسارين واجمع: ${LRI("6/20 + 6/20 = 12/20")}.`),
  draw:()=>{const T=ptree({...TS,c:["r","g"]}),bx=T.X2+240;return[T.path(1,"o"),T.path(2,"o"),...mrow([F(3,5),MUL(),F(2,4),"=",F(6,20)],T.X2+56,T.Y2[1]+10,36,"k","start"),
   ...mrow([F(2,5),MUL(),F(3,4),"=",F(6,20)],T.X2+56,T.Y2[2]+10,36,"k","start"),A.p(`M${bx},${T.Y2[1]-26}Q${bx+22},${T.Y2[1]-26} ${bx+22},${T.Y2[1]+8}L${bx+22},${(T.Y2[1]+T.Y2[2])/2-8}l12,8l-12,8L${bx+22},${T.Y2[2]+8}Q${bx+22},${T.Y2[2]+26} ${bx},${T.Y2[2]+26}`,"o",3.5),
   A.hl(bx+44,(T.Y2[1]+T.Y2[2])/2-36,120,72),...mrow(["=",F(12,20)],bx+104,(T.Y2[1]+T.Y2[2])/2+10,38,"g")]}}
]};
LESSONS.push({id:"prob9",subject:"math",grades:"9",kind:"wb",
 title:t3("Sannolikhet med och utan återläggning","Probability with and without replacement","الاحتمال مع الإرجاع ودون إرجاع"),
 icon:ICO(`<path d="M50 52C26 84 32 140 78 140C124 140 130 84 106 52Q78 62 50 52M50 52l-8 -14M106 52l8 -14" fill="none" stroke="#1d2433" stroke-width="3" stroke-linejoin="round"/>`+
  [[62,92,"r"],[90,92,"r"],[62,118,"g"],[90,118,"r"],[76,105,"g"]].map(([x,y,c])=>`<circle cx="${x}" cy="${y}" r="9" fill="${HEX[c]}"/>`).join("")+
  `<circle cx="150" cy="92" r="5" fill="#1d2433"/><path d="M150 92L200 56M150 92L200 128M212 56L260 36M212 56L260 76M212 128L260 108M212 128L260 148" stroke="#1d2433" stroke-width="2.5"/>`+
  [[206,56,"r"],[206,128,"g"],[268,36,"r"],[268,76,"g"],[268,108,"r"],[268,148,"g"]].map(([x,y,c])=>`<circle cx="${x}" cy="${y}" r="7" fill="${HEX[c]}"/>`).join("")+
  `<text x="166" y="58" ${CV} font-size="24" fill="#1d2433">3/5</text><text x="232" y="34" ${CV} font-size="22" fill="#e07b00">2/4</text>`),
 steps:PRB.steps,mount:wbMount(PRB),
 gen(level){const K=pick(["candy","socks"]),C=PCX[K];let a,b;do{a=rint(2,6);b=rint(2,6)}while(a+b<5||a+b>10);const n=a+b;
  const T=ptree({x0:50,yc:315,dx:150,h1:80,h2:30,c:C.c}),bag=BAGS[K](692,K==="candy"?205:212,K==="candy"?.85:1,a,b);
  const ask=t3("Svara med ett bråk.","Answer with a fraction.","أجب بكسر.");
  const Q=lines=>[...head(lines,30,46,42),...bag,...T.sk,A.tx(L(ask),692,474,26,"o")];
  if(level===0){const t=rint(0,1),x=t?b:a,N=x*x,D=n*n,T2=ptree({x0:50,yc:315,dx:150,h1:80,h2:30,c:C.c,p1:[[a,n],[b,n]],p2:[[a,n],[b,n],[a,n],[b,n]],fs:28}),i=t?3:0;
   return{kind:"frac",ans:[N,D],show:frs(N,D),q:Q([C.intro(a,b),C.with,C.both[t]]),sol:[...T2.f1.flat(),...T2.f2.flat(),T2.path(i),...prodRow(T2,i,[x,n],[x,n],[N,D],36)]}}
  const p2=[[a-1,n-1],[b,n-1],[a,n-1],[b-1,n-1]],T2=ptree({x0:50,yc:315,dx:150,h1:80,h2:30,c:C.c,p1:[[a,n],[b,n]],p2,c2:"o",fs:28}),D=n*(n-1);
  if(level===1){const t=rint(0,1),x=t?b:a,N=x*(x-1),i=t?3:0;
   return{kind:"frac",ans:[N,D],show:frs(N,D),q:Q([C.intro(a,b),C.wout,C.both[t]]),sol:[...T2.f1.flat(),...T2.f2.flat(),T2.path(i),...prodRow(T2,i,[x,n],[x-1,n-1],[N,D],36)]}}
  const base=[...T2.f1.flat(),...T2.f2.flat()];
  if(Math.random()<.5){const e=a*b,N=2*e,bx=T2.X2+236,ym=(T2.Y2[1]+T2.Y2[2])/2;
   return{kind:"frac",ans:[N,D],show:frs(N,D),q:Q([C.intro(a,b),C.wout,C.diff]),sol:[...base,T2.path(1,"o"),T2.path(2,"o"),
    ...mrow([{f:[a,n],ans:true},MUL(),F(b,n-1),"=",F(e,D)],T2.X2+46,T2.Y2[1]+10,36,"k","start"),
    ...mrow([F(b,n),MUL(),F(a,n-1),"=",F(e,D)],T2.X2+46,T2.Y2[2]+10,36,"k","start"),
    A.p(`M${bx},${T2.Y2[1]-22}Q${bx+18},${T2.Y2[1]-22} ${bx+18},${T2.Y2[1]+6}L${bx+18},${ym-8}l10,8l-10,8L${bx+18},${T2.Y2[2]+6}Q${bx+18},${T2.Y2[2]+22} ${bx},${T2.Y2[2]+22}`,"o",3.5),
    A.hl(bx+36,ym-34,118,68),...mrow(["=",{f:[N,D],c:"g"}],bx+95,ym+10,36,"g")]}}
  const t=rint(0,1),y=t?a:b,e=y*(y-1),N=D-e,i=t?0:3;
  return{kind:"frac",ans:[N,D],show:frs(N,D),q:Q([C.intro(a,b),C.wout,C.least[t]]),sol:[...base,T2.path(i,"r"),
   ...mrow([{f:[y,n],ans:true},MUL(),F(y-1,n-1),"=",F(e,D)],T2.X2+46,T2.Y2[i]+10,36,"r","start"),
   A.hl(490,290,270,74),...mrow(["1 −",F(e,D),"=",{f:[N,D],c:"g"}],625,338,36,"g")]}}
});
/* ---------------------------------------------------------------
   3. crit9: critical statistics
   --------------------------------------------------------------- */
const pct9=p=>lang==="sv"?`${p} %`:`${p}%`;
const dec9=(x,d=2)=>dfmt(x,d).replace(/([.,]\d*?)0+$/,"$1").replace(/[.,]$/,"");
/* bar chart: y-axis from base to top */
function bars9(o){const n=o.vals.length,Y=v=>o.y+o.h-(v-o.base)/(o.top-o.base)*o.h,bw=Math.min(90,o.w/n*.5),BX=i=>o.x+o.w*(i+.5)/n;
 let ax=R.line(o.x,o.y-14,o.x,o.y+o.h,.3)+R.line(o.x,o.y+o.h,o.x+o.w,o.y+o.h,.3);const tk=[];
 for(let v=o.base;v<=o.top+1e-9;v+=o.step){ax+=`M${o.x-7},${f1(Y(v))}h14`;tk.push(Object.assign(A.tx(fmt(v),o.x-14,Y(v)+8,o.ts||22,"k","end"),{dur:150}))}
 const B=o.vals.flatMap((v,i)=>{const x=BX(i)-bw/2,h=Y(o.base)-Y(v);return[A.p(R.rect(x,Y(v),bw,h,.3),o.cols[i],3.5),A.hatch(`M${f1(x)},${f1(Y(v))}h${f1(bw)}v${f1(h)}h${f1(-bw)}Z`,o.cols[i])]});
 const N=(o.names||[]).map((s,i)=>txe(s,BX(i),o.y+o.h+32,24,"k"));
 return{axis:[A.p(ax,"k",3.5),...tk],B,N,Y,BX,bw}}
const phone=(x,yb,w,h,c="b")=>A.p(R.rect(x-w/2,yb-h,w,h,.3)+R.rect(x-w/2+w*.12,yb-h+h*.1,w*.76,h*.72,.2)+`M${f1(x)},${f1(yb-h*.08)}l.1,0`,c,3.5);
const crowd=(x0,y0,cols,rows,gap)=>{const o=[];for(let r=0;r<rows;r++)for(let c=0;c<cols;c++)o.push([x0+c*gap,y0+r*gap]);return o};
const CRT={steps:[
 {say:t3("Två mobiloperatörer jämför sin täckning: A har 98 % och B har 94 %. I diagrammet ser A:s stapel ut att vara tre gånger så hög!",
   "Two phone networks compare their coverage: A has 98% and B has 94%. In the chart, A's bar looks three times as tall!",
   "شركتا اتصالات تقارنان تغطية الشبكة: للشركة A نسبة 98 % وللشركة B نسبة 94 %. في المخطط يبدو عمود A أطول بثلاث مرات!"),
  draw:()=>{const C=bars9({x:110,y:110,w:240,h:280,base:92,top:100,step:2,vals:[98,94],names:["A","B"],cols:["b","o"]});
   return[A.wipe(),A.tx(L(t3("Täckning i procent","Coverage in percent","التغطية بالنسبة المئوية")),400,56,38,"b"),...C.axis,...C.B,...C.N,
    A.tx(L(t3("3 gånger så hög?","3 times as tall?","أطول بثلاث مرات؟")),230,476,30,"r")]}},
 {say:t3("Men y-axeln börjar på 92, inte på 0. Ritar vi från 0 blir staplarna nästan lika höga. Skillnaden är bara 4 procentenheter.",
   "But the y-axis starts at 92, not at 0. If we draw from 0, the bars are almost the same height. The difference is only 4 percentage points.",
   "لكن المحور y يبدأ من 92 وليس من 0. إذا رسمنا من 0 يصبح العمودان متقاربين جدًا في الطول. الفرق 4 نقاط مئوية فقط."),
  draw:()=>{const C=bars9({x:510,y:110,w:240,h:280,base:0,top:100,step:20,vals:[98,94],names:["A","B"],cols:["b","o"]});
   return[A.loop(84,391,30,20,"r"),...C.axis,...C.B,...C.N,A.tx(L(t3("börjar på 0","starts at 0","يبدأ من 0")),630,476,30,"g")]}},
 {say:t3("Ett företag sålde 2 miljoner mobiler förra året och 4 miljoner i år. Bilden blev dubbelt så hög och dubbelt så bred, så ytan blev fyra gånger så stor. Det ser ut som fyra gånger fler!",
   "A company sold 2 million phones last year and 4 million this year. The picture got twice as tall and twice as wide, so its area became four times as big. It looks like four times as many!",
   "باعت شركة مليوني هاتف في العام الماضي و4 ملايين هذا العام. صارت الصورة أطول بمرتين وأعرض بمرتين، فأصبحت مساحتها أكبر بأربع مرات. فيبدو العدد أكبر بأربع مرات!"),
  draw:()=>[A.wipe(),A.tx(L(t3("Sålda mobiler","Phones sold","الهواتف المبيعة")),400,56,38,"b"),phone(150,380,64,110,"o"),phone(380,380,128,220,"b"),
   A.p(R.dashed(380,160,380,380,10)+R.dashed(316,270,444,270,10),"b",2.5),
   A.tx(L(t3("2 milj.","2 million","مليونان")),150,430,30),A.tx(L(t3("4 milj.","4 million","4 ملايين")),380,430,30),
   A.tx(L(t3("dubbelt så hög","twice as tall","أطول بمرتين")),630,170,30),A.tx(L(t3("dubbelt så bred","twice as wide","أعرض بمرتين")),630,220,30),
   A.tx(L(t3("ytan: 4 gånger!","area: 4 times!","المساحة: 4 مرات!")),630,290,36,"r"),A.hl(510,350,240,56),A.tx(L(t3("rätt: 2 gånger","really: 2 times","الصحيح: مرتان")),630,390,34,"g")]},
 {say:t3("Vill du veta vad alla elever på skolan tycker räcker det inte att fråga dina kompisar. I ett slumpmässigt urval har alla samma chans att bli tillfrågade.",
   "If you want to know what all the students at school think, it's not enough to ask your friends. In a random sample, everyone has the same chance of being asked.",
   "إذا أردت أن تعرف رأي كل طلاب المدرسة فلا يكفي أن تسأل أصدقاءك. في العيّنة العشوائية تكون لكل شخص الفرصة نفسها في أن يُسأل."),
  draw:()=>{const G1=crowd(80,150,7,6,40),G2=crowd(480,150,7,6,40),pickA=[0,1,7,8,14,15],pickB=[3,9,19,23,31,40];
   return[A.wipe(),A.tx(L(t3("Vem frågar du?","Who do you ask?","مَن تسأل؟")),400,56,38,"b"),A.p(dots(G1),"k",14),A.p(dots(G2),"k",14),
    A.p(dots(pickA.map(i=>G1[i])),"r",18),A.loop(120,190,58,64,"r"),A.p(dots(pickB.map(i=>G2[i])),"g",18),
    ...pickB.map(i=>A.loop(G2[i][0],G2[i][1],16,16,"g")),
    A.tx(L(t3("bara kompisarna","only your friends","الأصدقاء فقط")),200,420,30,"r"),A.tx(L(t3("slumpmässigt urval","random sample","عيّنة عشوائية")),600,420,30,"g"),
    A.tx(L(t3("missvisande","misleading","مضلِّل")),200,465,28,"r"),A.tx(L(t3("rättvist","fair","عادل")),600,465,28,"g")]}},
 {say:t3("I ett slumpmässigt urval av 50 elever spelar 18 datorspel varje dag. Det är 36 %. Skolan har 600 elever, så ungefär 0,36 · 600 = 216 elever spelar varje dag.",
   "In a random sample of 50 students, 18 play video games every day. That is 36%. The school has 600 students, so about 0.36 × 600 = 216 students play every day.",
   `في عيّنة عشوائية من 50 طالبًا، 18 منهم يلعبون ألعاب الفيديو كل يوم. هذه نسبة 36 %. في المدرسة 600 طالب، إذن نحو ${LRI("0.36 × 600 = 216")} طالبًا يلعبون كل يوم.`),
  draw:()=>{const G=crowd(80,170,10,5,28);return[A.wipe(),A.tx(L(t3("Från urval till hela skolan","From sample to the whole school","من العيّنة إلى المدرسة كلها")),400,56,38,"b"),
   A.p(dots(G.slice(18)),"k",16),A.p(dots(G.slice(0,18)),"o",18),A.tx(L(t3("18 av 50","18 of 50","18 من 50")),206,340,36,"o"),
   ...mrow([F(18,50),"=",dec9(.36),"=",pct9(36)],590,200,40),A.tx(L(t3("skolan: 600 elever","school: 600 students","المدرسة: 600 طالب")),590,300,30),
   A.hl(450,370,280,64),A.tx(`${dec9(.36)} ${MUL()} 600 = 216`,590,416,42,"g")]}},
 {say:t3("När glassförsäljningen ökar, ökar också antalet solbrända. Men glass orsakar inte solbränna! Solen orsakar båda. Ett samband är inte samma sak som en orsak.",
   "When ice-cream sales go up, so does the number of sunburns. But ice cream doesn't cause sunburn! The sun causes both. A connection is not the same as a cause.",
   "عندما تزداد مبيعات البوظة يزداد أيضًا عدد المصابين بحروق الشمس. لكن البوظة لا تسبّب حروق الشمس! الشمس هي سبب الاثنين. العلاقة ليست هي نفسها السبب."),
  draw:()=>{const rays=[...Array(8)].map((_,i)=>{const t=i*Math.PI/4;return R.line(400+52*Math.cos(t),120+52*Math.sin(t),400+72*Math.cos(t),120+72*Math.sin(t),.2)}).join("");
   return[A.wipe(),A.p(R.circ(400,120,38),"o",5),A.p(rays,"o",4),A.p(`M150,262L200,262L175,330Z`,"o",3.5),A.p(dots([[175,248]]),"r",36),
    A.p(R.circ(625,280,32),"r",4),A.p(`M612,272l.1,0M638,272l.1,0M612,292Q625,302 638,292`,"r",4),
    A.tx(L(t3("glass","ice cream","البوظة")),175,380,32),A.tx(L(t3("solbränna","sunburn","حروق الشمس")),625,380,32),
    A.arrow(352,150,215,232,"o",-10),A.arrow(448,150,590,240,"o",10),A.p(R.dashed(240,290,560,290,12),"k",3),A.p(R.line(380,266,420,314,.2)+R.line(420,266,380,314,.2),"r",5),
    A.hl(150,420,500,58),A.tx(L(t3("samband ≠ orsak","connection ≠ cause","العلاقة ≠ السبب")),400,462,40,"g")]}}
]};
const FLAW=[t3("y-axeln börjar inte på 0","the y-axis doesn't start at 0","المحور y لا يبدأ من 0"),
 t3("bilden växer både på höjden och på bredden","the picture grows in both height and width","الصورة تكبر طولًا وعرضًا معًا"),
 t3("procenten blir inte 100 % tillsammans","the percentages don't add up to 100%","مجموع النسب لا يساوي 100 %"),
 t3("stegen på x-axeln är olika stora","the steps on the x-axis are not equal","الخطوات على المحور x غير متساوية")];
const ACT=[t3("spelar datorspel varje dag","play video games every day","يلعبون ألعاب الفيديو كل يوم"),t3("åker buss till skolan","take the bus to school","يأتون إلى المدرسة بالحافلة"),
 t3("vill ha längre lunchrast","want a longer lunch break","يريدون استراحة غداء أطول"),t3("tränar en idrott","do a sport","يمارسون رياضة")];
LESSONS.push({id:"crit9",subject:"math",grades:"9",kind:"wb",
 title:t3("Kritisk granskning av statistik","Thinking critically about statistics","التفكير النقدي في الإحصاء"),
 icon:ICO(`<path d="M60 30V140H200" fill="none" stroke="#1d2433" stroke-width="3.5" stroke-linecap="round"/><path d="M52 132l16 -6M52 124l16 -6" stroke="#d63b2f" stroke-width="3"/>`+
  `<rect x="82" y="40" width="40" height="100" fill="#2257c9" fill-opacity=".25" stroke="#2257c9" stroke-width="3"/><rect x="142" y="104" width="40" height="36" fill="#e07b00" fill-opacity=".25" stroke="#e07b00" stroke-width="3"/>`+
  `<circle cx="244" cy="82" r="34" fill="#fff" stroke="#1d2433" stroke-width="5"/><path d="M268 106L296 136" stroke="#1d2433" stroke-width="9" stroke-linecap="round"/><text x="244" y="96" ${CV} font-size="44" fill="#d63b2f">?</text>`),
 steps:CRT.steps,mount:wbMount(CRT),
 gen(level){
  if(level===0){const T=rint(0,3),o=[...head([t3("Vad är missvisande i diagrammet?","What is misleading about the chart?","ما المضلِّل في هذا المخطط؟")],32,52)],sol=[];
   if(T===0){const b0=pick([100,200,300,400,500]),v=shuffle([1,2,3,4,5]).slice(0,3).map(k=>b0+k*10),C=bars9({x:240,y:130,w:360,h:260,base:b0,top:b0+60,step:10,vals:v,names:L(t3(["fre","lör","sön"],["Fri","Sat","Sun"],["الجمعة","السبت","الأحد"])),cols:["b","o","g"],ts:24});
    o.push(A.tx(L(t3("Sålda biljetter","Tickets sold","التذاكر المبيعة")),420,108,28,"b"),...C.axis,...C.B,...C.N);sol.push(A.loop(206,C.Y(b0)+1,40,22,"r"))}
   else if(T===1){const v=pick([2,3,5,10]);o.push(A.tx(L(t3("Sålda mobiler (miljoner)","Phones sold (millions)","الهواتف المبيعة (بالملايين)")),400,108,28,"b"),phone(280,400,70,120,"o"),phone(500,400,140,240,"b"),
     txe(L(t3("i fjol","last year","العام الماضي")),280,436,26),txe(L(t3("i år","this year","هذا العام")),500,436,26),A.tx(v,280,350,34,"o"),A.tx(2*v,464,250,44,"b"));
    sol.push(A.p(R.dashed(500,160,500,400,10)+R.dashed(430,280,570,280,10),"r",3),A.arrow(600,170,600,390,"r"),A.arrow(430,145,570,145,"r"))}
   else if(T===2){let p;do{p=[rint(3,6)*10,rint(2,5)*10,rint(1,4)*10]}while(p[0]+p[1]+p[2]<=110||p[0]+p[1]+p[2]>=150||new Set(p).size<3);const S=p[0]+p[1]+p[2],cx=330,cy=290,r=135;let a0=-Math.PI/2;
    const nm=L(t3(["spel","musik","film"],["games","music","films"],["الألعاب","الموسيقى","الأفلام"])),cl=["b","o","g"];
    o.push(A.tx(L(t3("Vad gör eleverna helst på kvällen?","What do students like doing most in the evening?","ماذا يفضّل الطلاب أن يفعلوا مساءً؟")),400,108,28,"b"),A.p(R.circ(cx,cy,r),"k",3.5));
    p.forEach((v,i)=>{const a1=a0+v/S*2*Math.PI,am=(a0+a1)/2;o.push(A.p(R.line(cx,cy,cx+r*Math.cos(a0),cy+r*Math.sin(a0),.3),"k",3),A.hatch(`M${cx},${cy}L${f1(cx+r*Math.cos(a0))},${f1(cy+r*Math.sin(a0))}A${r},${r} 0 0 1 ${f1(cx+r*Math.cos(a1))},${f1(cy+r*Math.sin(a1))}Z`,cl[i]),
     txe(pct9(v),cx+r*.6*Math.cos(am),cy+r*.6*Math.sin(am)+10,30,cl[i]),txe(nm[i],610,200+i*60,30,cl[i]));a0=a1});
    sol.push(A.tx(`${p.join(" + ")} = ${S}`,610,400,30,"r"))}
   else{const yrs=[2000,2010,2020,2021,2022,2023],k=pick([5,10]),s0=pick([200,300,400]),vals=yrs.map(y=>s0+k*(y-2000)),top=s0+k*25+50,X=i=>220+i*90,Y=v=>400-v/top*260;
    let ax=R.line(170,125,170,400,.3)+R.line(170,400,710,400,.3);const tk=[];for(let v=0;v<=top;v+=100){ax+=`M163,${f1(Y(v))}h14`;tk.push(Object.assign(A.tx(v,155,Y(v)+8,22,"k","end"),{dur:150}))}
    o.push(A.tx(L(t3("Antal elever på skolan","Number of students at the school","عدد طلاب المدرسة")),440,108,28,"b"),A.p(ax,"k",3.5),...tk,A.p(plines(vals.map((v,i)=>[X(i),Y(v)]),false),"b",4),A.p(dots(vals.map((v,i)=>[X(i),Y(v)])),"b",14),
     ...yrs.map((y,i)=>txe(y,X(i),432,24)));sol.push(A.loop(X(0)+45,424,86,22,"r"),A.loop(X(3)+45,424,86,22,"r"),A.tx(L(t3("10 år","10 years","10 سنوات")),X(0)+45,385,24,"r"),A.tx(L(t3("1 år","1 year","سنة")),X(3)+45,385,24,"r"))}
   const opts=FLAW.map((t,i)=>({t,i})),sh=shuffle(opts);
   const exp=L(FLAW[T]);sol.push(mark(A.hl(400-tw(exp,28)/2-24,448,tw(exp,28)+48,42)),A.tx(exp,400,478,28,"g"));
   return{kind:"choice",opts:sh.map(x=>x.t),ans:sh.findIndex(x=>x.i===T),show:FLAW[T],q:o,sol}}
  if(level===1){let N,n,k;do{N=pick([300,400,500,600,800,1200]);n=pick([20,25,50,100]);k=rint(Math.ceil(n*.1),Math.floor(n*.9))}while(N*k%n);
   const act=pick(ACT),ans=N*k/n,p=100*k/n,cols=n===25?5:10,rows=n/cols,cs=n===100?15:n===25?26:26,gx=620-cols*cs/2,gy=150;
   const ar100=n===100?"طالب":"طالبًا";
   const q=[...head([t3(`Skolan har ${N} elever. Du frågar ${n} slumpvis valda elever.`,`The school has ${N} students. You ask ${n} randomly chosen students.`,`في المدرسة ${N} طالب. تسأل ${n} ${ar100} يُختارون عشوائيًا.`),
     t3(`${k} av dem ${act.sv}.`,`${k} of them ${act.en}.`,`${k} منهم ${act.ar}.`),
     t3(`Ungefär hur många elever på hela skolan ${act.sv}?`,`About how many students at the whole school ${act.en}?`,`كم طالبًا في المدرسة كلها ${act.ar} تقريبًا؟`)],28,44,40)];
   const sch=crowd(80,180,10,8,30);let gd="";for(let r=0;r<=rows;r++)gd+=R.line(gx,gy+r*cs,gx+cols*cs,gy+r*cs,.1);for(let c=0;c<=cols;c++)gd+=R.line(gx+c*cs,gy,gx+c*cs,gy+rows*cs,.1);
   const cells=[];for(let i=0;i<k;i++){const r=Math.floor(i/cols),c=i%cols;cells.push(`M${gx+c*cs},${gy+r*cs}h${cs}v${cs}h${-cs}Z`)}
   q.push(A.p(R.rect(60,160,310,240,.3),"k",3),A.p(dots(sch),"#8a94a6",12),A.tx(L(t3(`hela skolan: ${N}`,`whole school: ${N}`,`المدرسة كلها: ${N}`)),215,440,28),
    A.hatch(cells.join(""),"o"),A.p(gd,"k",2.5),A.tx(L(t3(`urvalet: ${n}`,`sample: ${n}`,`العيّنة: ${n}`)),620,gy+rows*cs+36,28));
   const yb=gy+rows*cs+36;
   return{kind:"num",ans,show:fmt(ans),q,sol:[...mrow([F(k,n),"=",dec9(k/n,3),"=",pct9(p)],620,yb+56,32,"o"),
    mark(A.hl(470,yb+76,300,56)),A.tx(`${dec9(k/n,3)} ${MUL()} ${fmt(N)} = ${fmt(ans)}`,620,yb+116,36,"g")]}}
  let s,k,pp,B;for(;;){s=pick([2,5,10,20]);k=rint(2,4);pp=pick([5,10,20,25,40,50]);B=100*(k-1)*s/pp;if(Number.isInteger(B)&&B-s>=s&&B<=1000)break}
  const A9=B+(k-1)*s,base=B-s,ctx=rint(0,1),nm=ctx?L(t3(["konsert A","konsert B"],["concert A","concert B"],["الحفلة A","الحفلة B"])):L(t3(["kanal A","kanal B"],["channel A","channel B"],["القناة A","القناة B"]));
  const C=bars9({x:150,y:150,w:300,h:270,base,top:base+(k+1)*s,step:s,vals:[A9,B],names:nm,cols:["b","o"],ts:24});
  const q=[...head([ctx?t3("Diagrammet visar sålda biljetter till två konserter.","The chart shows tickets sold for two concerts.","يبيّن المخطط عدد التذاكر المبيعة لحفلتين."):t3("Diagrammet visar antal följare (i tusental) för två kanaler.","The chart shows followers (in thousands) of two channels.","يبيّن المخطط عدد المتابعين (بالآلاف) لقناتين."),
    ctx?t3("Hur många procent fler biljetter såldes till A än till B?","How many percent more tickets were sold for A than for B?","بكم في المئة تزيد التذاكر المبيعة للحفلة A على تذاكر الحفلة B؟"):t3("Hur många procent fler följare har A än B?","How many percent more followers does A have than B?","بكم في المئة يزيد متابعو A على متابعي B؟")],28,46,42),...C.axis,...C.B,...C.N];
  const d=A9-B;
  return{kind:"num",ans:pp,show:pct9(pp),q,sol:[A.p(R.dashed(150,C.Y(A9),C.BX(0)-C.bw/2,C.Y(A9),9)+R.dashed(150,C.Y(B),C.BX(1)-C.bw/2,C.Y(B),9),"o",3),
   A.tx(`A = ${fmt(A9)}`,630,170,32,"b"),A.tx(`B = ${fmt(B)}`,630,220,32,"o"),A.tx(`${fmt(A9)} − ${fmt(B)} = ${fmt(d)}`,630,280,32),
   ...mrow([{f:[d,B],ans:true},"=",dec9(d/B),"=",{s:pct9(pp),c:"g"}],630,365,32),
   A.tx(L(t3(`ser ut som ${k} gånger så mycket`,`looks like ${k} times as much`,k===2?"يبدو أكبر بمرتين":`يبدو أكبر بـ${k} مرات`)),630,450,24,"r")]}}
});
/* ---------------------------------------------------------------
   4. prog9: functions and loops that simulate and compute
   --------------------------------------------------------------- */
const qe9=(s,x,y,size=26,c="k",a="middle")=>Object.assign(A.tx(s,x,y,size,c,a),{dur:Math.min(700,Math.max(170,String(s).length*45))});
const CP9={x:28,w:450,y:108,lh:44,fs:28};
const cy9=i=>CP9.y+i*CP9.lh;
function code9(ls,n=ls.length){const o=[A.band(CP9.x-8,CP9.y-38,CP9.w,n*CP9.lh+20,"b")];
 ls.forEach((l,i)=>{const [ind,s]=Array.isArray(l)?l:[0,l];o.push(qe9(i+1,CP9.x+12,cy9(i),20,"#8a94a6"),Object.assign(A.tx(s,CP9.x+40+ind*30,cy9(i),CP9.fs,"k","start"),{dur:Math.min(1300,Math.max(350,s.length*50))}))});return o}
const lineHL9=i=>A.hl(CP9.x+32,cy9(i)-28,CP9.w-44,38);
function trace9(x,y,heads,ws,rows,rh=42,size=28){const W=ws.reduce((a,b)=>a+b,0),H=(rows.length+1)*rh,cx=ws.map((w,i)=>x+ws.slice(0,i).reduce((a,b)=>a+b,0)+w/2);
 let d=R.rect(x,y,W,H,.3)+R.line(x,y+rh,x+W,y+rh,.2),xx=x;ws.slice(0,-1).forEach(w=>{xx+=w;d+=R.line(xx,y,xx,y+H,.15)});
 const head=[A.band(x+3,y+3,W-6,rh-6,"b"),A.p(d,"k",3),...heads.map((h,i)=>qe9(h,cx[i],y+rh*.68,24,"b"))];
 const body=rows.map((r,k)=>r.map((v,i)=>{if(v==null||v==="")return null;const [s,c]=Array.isArray(v)?v:[v,"k"];return qe9(String(s),cx[i],y+rh*(k+1)+rh*.7,/[؀-ۿ]/.test(s)?Math.min(size,22):size,c)}).filter(Boolean));
 return{head,body}}
const out9=(v,x,y,size=38)=>{const s=`${L(t3("Utskrift:","Output:","المُخرَج:"))} ${v}`,w=tw(s,size)+40;return[A.hl(x-w/2,y-size*.9,w,size*1.22),A.tx(s,x,y,size,"g")]};
const N9=k=>(lang==="sv"?{bil:"biljett",kv:"kvadrat",vis:"visningar",tim:"timmar",sex:"sexor",kast:"kast"}:{bil:"ticket",kv:"square",vis:"views",tim:"hours",sex:"sixes",kast:"roll"})[k];
const START=t3("start","start","البداية");
const PRG={steps:[
 {say:t3("En funktion är en liten maskin med ett namn. Funktionen biljett räknar ut vad n konsertbiljetter kostar: 120 kr styck plus 15 kr i avgift.",
   "A function is a small machine with a name. The function ticket works out what n concert tickets cost: 120 kr each plus a 15 kr fee.",
   "الدالة آلة صغيرة لها اسم. الدالة ticket تحسب ثمن n من تذاكر الحفلة: 120 كرونة للتذكرة الواحدة مع رسم قدره 15 كرونة."),
  draw:()=>{const b=N9("bil");return[A.wipe(),...code9([`def ${b}(n):`,[1,"return 120 * n + 15"],`print(${b}(3))`]),
   A.p(R.rect(560,190,160,90,.3),"b",4),A.tx(b,640,246,32,"b"),A.arrow(500,235,552,235,"k"),A.tx("n",480,244,32,"o"),A.arrow(728,235,780,235,"k"),
   A.tx(L(t3("in","in","مُدخَل")),490,200,24,"o"),A.tx(L(t3("ut","out","مُخرَج")),760,200,24,"g"),
   A.tx(L(t3("def skapar funktionen","def creates the function","def تُنشئ الدالة")),250,320,28,"o"),A.tx(L(t3("return skickar tillbaka svaret","return sends back the answer","return تُعيد الجواب")),250,370,28,"o")]}},
 {say:t3("Sista raden anropar funktionen med 3. Då får n värdet 3, och return skickar tillbaka 120 · 3 + 15 = 375.",
   "The last line calls the function with 3. Then n gets the value 3, and return sends back 120 × 3 + 15 = 375.",
   `السطر الأخير يستدعي الدالة بالعدد 3، فتأخذ n القيمة 3، وتُعيد return العدد ${LRI("120 × 3 + 15 = 375")}.`),
  draw:()=>[lineHL9(2),A.tx("3",480,284,32,"o"),A.tx("n = 3",640,150,30,"o"),A.tx(`120 ${MUL()} 3 + 15 = 375`,600,420,34,"b"),A.tx("375",770,284,32,"g"),...out9("375",250,460,36)]},
 {say:t3("Funktioner och loopar fungerar bra ihop. range(1, 5) ger i värdena 1, 2, 3 och 4, för sista talet kommer inte med. Loopen lägger ihop 1 + 4 + 9 + 16 = 30.",
   "Functions and loops work well together. range(1, 5) gives i the values 1, 2, 3 and 4, because the last number is left out. The loop adds 1 + 4 + 9 + 16 = 30.",
   `الدوال والحلقات تعمل معًا جيدًا. ${LRI("range(1, 5)")} يعطي i القيم 1 و2 و3 و4، لأن العدد الأخير لا يدخل. الحلقة تجمع ${LRI("1 + 4 + 9 + 16 = 30")}.`),
  draw:()=>{const k=N9("kv"),T=trace9(510,70,["i",`${k}(i)`,"s"],[56,130,100],[["","",`${L(START)}: 0`],["1","1","1"],["2","4","5"],["3","9","14"],["4","16",["30","g"]]],46,28);
   return[A.wipe(),...code9([`def ${k}(x):`,[1,"return x * x"],"s = 0","for i in range(1, 5):",[1,`s = s + ${k}(i)`],"print(s)"]),...T.head,...T.body.flat(),
    A.tx("range(1, 5): 1, 2, 3, 4",250,390,28,"o"),...out9("30",650,440,36)]}},
 {say:t3("Datorn kan simulera tillväxt. Ett klipp får 500 visningar, och antalet fördubblas varje timme. While-loopen kör tills det är minst 10 000. Det tar 5 timmar.",
   "The computer can simulate growth. A clip gets 500 views, and the number doubles every hour. The while loop runs until there are at least 10,000. It takes 5 hours.",
   `يستطيع الحاسوب محاكاة النمو. مقطع فيديو حصل على 500 مشاهدة، ويتضاعف العدد كل ساعة. تعمل حلقة while حتى يصبح العدد 10000 على الأقل. يستغرق ذلك 5 ساعات.`),
  draw:()=>{const v=N9("vis"),h=N9("tim"),rows=[["500","0"],["1000","1"],["2000","2"],["4000","3"],["8000","4"],[["16000","g"],["5","g"]]];
   const T=trace9(540,62,[v,h],[130,100],rows,44,28);
   return[A.wipe(),...code9([`${v} = 500`,`${h} = 0`,`while ${v} < 10000:`,[1,`${v} = ${v} * 2`],[1,`${h} = ${h} + 1`],`print(${h})`]),...T.head,...T.body.flat(),
    A.tx(L(t3("16000 < 10000 är falskt","16000 < 10000 is false",`${LRI("16000 < 10000")} خطأ`)),250,400,28,"r"),...out9("5",650,440,36)]}},
 {say:t3("Datorn kan också slå en tärning 600 gånger på en sekund. Vi vet inte exakt vad den skriver ut, men ungefär en sjättedel av 600, alltså cirka 100 sexor.",
   "The computer can also roll a die 600 times in a second. We can't know exactly what it prints, but about one sixth of 600, so roughly 100 sixes.",
   "يستطيع الحاسوب أيضًا أن يرمي حجر نرد 600 مرة في ثانية واحدة. لا نعرف بالضبط ما سيطبعه، لكنه نحو سدس 600، أي قرابة 100 ستة."),
  draw:()=>{const sx=N9("sex"),k=N9("kast");return[A.wipe(),...code9(["import random",`${sx} = 0`,"for i in range(600):",[1,`${k} = random.randint(1, 6)`],[1,`if ${k} == 6:`],[2,`${sx} = ${sx} + 1`],`print(${sx})`]),
   A.tx(L(t3("== betyder ”är lika med”","== means “is equal to”","== تعني «يساوي»")),250,450,26,"o"),
   ...mrow([F(1,6),MUL(),"600","≈ 100"],650,140,40,"b"),A.tx(L(t3("tre körningar:","three runs:","ثلاث مرات تشغيل:")),650,250,28),
   A.tx("97     104     101",650,300,36,"g"),A.tx(L(t3("nästan 100 varje gång","almost 100 every time","قرابة 100 في كل مرة")),650,360,28,"g")]}}
]};
const mach=(f,k)=>[A.p(R.rect(570,110,150,76,.3),"b",4),A.tx(f,645,158,30,"b"),A.arrow(500,148,562,148,"k"),A.tx(k,520,130,28,"o"),A.arrow(728,148,782,148,"k"),A.tx("?",760,130,30,"g")];
const FNS=t3([["pris","antal"],["poang","mal"],["lon","timmar"]],[["price","count"],["points","goals"],["pay","hours"]],[["price","count"],["points","goals"],["pay","hours"]]);
LESSONS.push({id:"prog9",subject:"math",grades:"9",kind:"wb",
 title:t3("Programmering: funktioner och simuleringar","Programming: functions and simulations","البرمجة: الدوال والمحاكاة"),
 icon:ICO(`<rect x="22" y="24" width="210" height="132" rx="12" fill="#2257c9" fill-opacity=".08" stroke="#2257c9" stroke-width="3"/>${[["def f(x):",0,62],["return 2*x+1",1,98],["print(f(5))",0,134]].map(([s,ind,y])=>`<text x="${40+ind*26}" y="${y}" font-family="Caveat,cursive" font-weight="700" font-size="28" fill="#1d2433" direction="ltr">${s}</text>`).join("")}`+
  `<path d="M240 90H262" stroke="#1d2433" stroke-width="3"/><path d="M256 84L264 90L256 96" fill="none" stroke="#1d2433" stroke-width="3"/><text x="286" y="102" ${CV} font-size="40" fill="#1e9e5a">11</text>`),
 steps:PRG.steps,mount:wbMount(PRG),
 gen(level){const TQ=()=>A.tx(L(t3("Vad skriver programmet ut?","What does the program print?","ماذا يطبع البرنامج؟")),400,44,32);
  if(level===0){const [f,x]=pick(L(FNS)),a=rint(2,12),b=pick([0,5,10,15,20,25,30,40,50]),two=Math.random()<.5,body=b?`return ${a} * ${x} + ${b}`:`return ${a} * ${x}`,val=v=>a*v+b;
   const ex=v=>b?`${a} ${MUL()} ${v} + ${b} = ${val(v)}`:`${a} ${MUL()} ${v} = ${val(v)}`;
   if(!two){const k=rint(2,9),ans=val(k);
    return{kind:"num",ans,show:String(ans),q:[A.wipe(),TQ(),...code9([`def ${f}(${x}):`,[1,body],`print(${f}(${k}))`]),...mach(f,k)],
     sol:[lineHL9(2),A.tx(`${x} = ${k}`,400,300,34,"o"),mark(A.tx(ex(k),400,370,38,"b")),...out9(ans,400,450,40)]}}
   let k1=rint(1,6),k2;do{k2=rint(2,9)}while(k2===k1);const ans=val(k1)+val(k2);
   return{kind:"num",ans,show:String(ans),q:[A.wipe(),TQ(),...code9([`def ${f}(${x}):`,[1,body],`print(${f}(${k1}) + ${f}(${k2}))`]),...mach(f,`${k1}, ${k2}`)],
    sol:[lineHL9(2),A.tx(`${f}(${k1}): ${ex(k1)}`,400,290,32,"b"),A.tx(`${f}(${k2}): ${ex(k2)}`,400,340,32,"b"),mark(A.tx(`${val(k1)} + ${val(k2)} = ${ans}`,400,400,36)),...out9(ans,400,462,38)]}}
  if(level===1){const FX=[["x * x",v=>v*v],["2 * x + 1",v=>2*v+1],["3 * x",v=>3*v],["x * x + 1",v=>v*v+1],["10 - x",v=>10-v]],[e,fn]=pick(FX),n=rint(3,5),from1=Math.random()<.6;
   const is=from1?[...Array(n)].map((_,i)=>i+1):[...Array(n)].map((_,i)=>i),rng=from1?`range(1, ${n+1})`:`range(${n})`;let s=0;
   const rows=[["","",L(START)+": 0"]];is.forEach(i=>{s+=fn(i);rows.push([String(i),String(fn(i)),String(s)])});rows[rows.length-1][2]=[String(s),"g"];
   const T=trace9(510,70,["i","f(i)","s"],[60,100,110],rows,44,28);
   return{kind:"num",ans:s,show:String(s),q:[A.wipe(),TQ(),...code9(["def f(x):",[1,`return ${e}`],"s = 0",`for i in ${rng}:`,[1,"s = s + f(i)"],"print(s)"])],
    sol:[...T.head,...T.body[0],...T.body[1],mark(T.body[2][0]),...T.body.slice(2).flat().filter(a=>a!==T.body[2][0]),...out9(s,640,T.body.length>5?440:420,36)].filter(a=>a!==undefined),
    hc:0}}
  const m=pick([2,2,3]),dec=Math.random()<.35;let x0,y,t;
  for(;;){if(!dec){x0=pick([3,4,5,6,8,10,12,15,20,25,30,40,50]);t=rint(3,m===2?6:4);const lo=x0*m**(t-1),hi=x0*m**t,step=hi>500?100:hi>100?50:10;const c=[];for(let v=Math.floor(lo/step)*step+step;v<=hi;v+=step)c.push(v);if(c.length){y=pick(c);break}}
   else{t=rint(3,5);x0=m**t*pick([1,2,3,5]);if(m===3&&x0>1000)continue;const lo=x0/m**t,hi=x0/m**(t-1),c=[];for(let v=Math.ceil(lo);v<hi;v++)if(v>=lo)c.push(v);if(c.length&&hi>=2){y=pick(c);break}}}
  /* simulate exactly like the program */
  let x=x0,k=0;const rows=[[String(x0),"0"]];while(dec?x>y:x<y){x=dec?x/m:x*m;k++;rows.push([String(x),String(k)])}t=k;rows[rows.length-1]=rows[rows.length-1].map(v=>[v,"g"]);
  const fname=L(t3("steg","steps","steps")),op=dec?"/":"*";
  const ls=[`def ${fname}(x, y):`,[1,"n = 0"],[1,`while x ${dec?">":"<"} y:`],[2,`x = x ${op} ${m}`],[2,"n = n + 1"],[1,"return n"],`print(${fname}(${x0}, ${y}))`];
  const T=trace9(540,64,["x","n"],[130,90],rows,42,28);
  return{kind:"num",ans:t,show:String(t),q:[A.wipe(),TQ(),...code9(ls)],
   sol:[...T.head,...T.body[0],mark(T.body[1][0]),...T.body.slice(1).flat().filter(a=>a!==T.body[1][0]),...out9(t,250,468,36)]}}
});
Object.assign(HELPX,{
 prob9:[{say:t3("Lägger du tillbaka biten ser påsen likadan ut varje gång. Äter du upp den har påsen en bit mindre, och då ändras chansen.",
   "If you put the sweet back, the bag looks the same every time. If you eat it, the bag has one sweet fewer, and then the chance changes.",
   "إذا أعدت القطعة يبقى الكيس كما هو في كل مرة. وإذا أكلتها نقص الكيس قطعة واحدة، فيتغيّر الاحتمال."),
  draw:()=>[A.tx(L(t3("tillbaka","put back","إرجاع")),200,60,34,"b"),A.tx(L(t3("uppäten","eaten","مأكولة")),600,60,34,"o"),A.p(R.line(400,40,400,470,.2),"k",2),
   ...BAGS.candy(200,190,1,3,2),A.arrow(200,290,200,330,"k"),...BAGS.candy(200,410,1,3,2),
   ...BAGS.candy(600,190,1,3,2),A.arrow(600,290,600,330,"k"),...BAGS.candy(600,410,1,2,2),
   A.tx("3/5",310,210,34,"r"),A.tx("3/5",310,430,34,"r"),A.tx("3/5",710,210,34,"r"),A.tx("2/4",710,430,34,"o")]}],
 crit9:[{say:t3("Tänk på en gryta soppa. Rör du om först räcker det att smaka en sked för att veta hur hela grytan smakar. Ett bra urval är som en sked efter omrörning.",
   "Think of a pot of soup. If you stir it first, one spoonful is enough to know how the whole pot tastes. A good sample is like a spoonful after stirring.",
   "فكّر في قِدر حساء. إذا حرّكته أولًا تكفي ملعقة واحدة لتعرف طعم القِدر كله. العيّنة الجيدة مثل ملعقة بعد التحريك."),
  draw:()=>[A.p(`M160,200L180,400Q300,430 420,400L440,200`,"k",4.5),A.p(R.line(140,200,460,200,.3),"k",5),A.hatch(`M170,240L184,396Q300,424 416,396L430,240Z`,"o"),
   A.p(dots([[230,300],[300,330],[370,290],[260,370],[350,370],[320,270]]),"g",14),A.p("M380,80L330,300","b",6),A.p(R.loop(320,310,26,12),"b"),
   A.arrow(470,150,420,130,"b",-20),A.tx(L(t3("rör om","stir","حرّك")),540,160,34,"b"),
   A.p("M540,300Q600,320 680,300L690,290Q600,270 540,290Z","k",4),A.hatch("M550,296Q600,312 678,298L684,292Q600,280 552,292Z","o"),
   A.tx(L(t3("en sked räcker","one spoonful is enough","ملعقة واحدة تكفي")),620,380,32,"g")]}],
 prog9:[{say:t3("En funktion är som en smoothiemaskin: du stoppar in något, maskinen gör samma sak varje gång och ger tillbaka ett resultat. Här: gånger 2, plus 1.",
   "A function is like a smoothie machine: you put something in, the machine does the same thing every time and gives back a result. Here: times 2, plus 1.",
   "الدالة مثل آلة العصير: تضع فيها شيئًا، فتفعل الآلة الشيء نفسه في كل مرة وتُعيد لك نتيجة. هنا: اضرب في 2 ثم أضف 1."),
  draw:()=>[A.p(R.rect(300,120,200,240,.3),"b",5),A.p("M330,120L360,70H440L470,120","b",4),A.tx(`${MUL()} 2 + 1`,400,250,44,"b"),A.p(R.rect(380,360,40,40,.2),"b",4),
   A.tx(L(t3("in","in","مُدخَل")),150,130,30,"o"),A.tx(L(t3("ut","out","مُخرَج")),650,130,30,"g"),
   A.tx("5",150,210,48,"o"),A.arrow(185,195,290,195,"k"),A.tx("11",650,210,48,"g"),A.arrow(510,195,610,195,"k"),
   A.tx("3",150,330,48,"o"),A.arrow(185,315,290,315,"k"),A.tx("7",650,330,48,"g"),A.arrow(510,315,610,315,"k"),
   A.tx("f(x) = 2x + 1",400,460,40,"k")]}]
});
Object.assign(HINTSX,{
 prob9:[{say:t3("Biten läggs tillbaka, så sannolikheten är densamma båda gångerna. Multiplicera längs vägen.","The item is put back, so the probability is the same both times. Multiply along the path.","تُعاد القطعة، فيبقى الاحتمال نفسه في المرتين. اضرب على طول المسار."),cut:upTo()},
  {say:t3("Andra gången finns en färre kvar, både av den färgen och totalt. Multiplicera längs vägen.","The second time there is one fewer left, both of that colour and in total. Multiply along the path.","في المرة الثانية يبقى واحد أقل من ذلك اللون ومن المجموع كله. اضرب على طول المسار."),cut:upTo()},
  {say:t3("Olika färg: addera två vägar. Minst en: räkna 1 minus sannolikheten att det inte blir någon alls.","Different colours: add two paths. At least one: work out 1 minus the probability of getting none at all.","لونان مختلفان: اجمع مسارين. واحدة على الأقل: احسب 1 ناقص احتمال ألا تحصل على أي واحدة."),cut:upTo()}],
 crit9:[{say:t3("Titta noga på axlarna, bilderna och procenten. Vilken del lurar ögat?","Look carefully at the axes, the pictures and the percentages. Which part tricks the eye?","انظر بعناية إلى المحاور والصور والنسب. أي جزء يخدع العين؟"),cut:()=>[]},
  {say:t3("Hur stor andel av urvalet gäller det? Ta samma andel av hela skolan.","What share of the sample is it? Take the same share of the whole school.","ما نسبة ذلك في العيّنة؟ خذ النسبة نفسها من المدرسة كلها."),cut:upTo()},
  {say:t3("Läs av värdena på y-axeln. Dela skillnaden med B:s värde.","Read the values on the y-axis. Divide the difference by B's value.","اقرأ القيم على المحور y، ثم اقسم الفرق على قيمة B."),cut:upTo()}],
 prog9:[{say:t3("Sätt in talet i funktionen: byt ut variabeln mot talet och räkna.","Put the number into the function: replace the variable with the number and work it out.","ضع العدد في الدالة: استبدل المتغيّر بالعدد واحسب."),cut:upTo()},
  {say:t3("Gör en tabell: skriv i, f(i) och s för varje varv i loopen.","Make a table: write i, f(i) and s for each lap of the loop.","اصنع جدولًا: اكتب i و f(i) و s في كل دورة من الحلقة."),cut:upTo()},
  {say:t3("Skriv x och n efter varje varv. Sluta när villkoret i while blir falskt.","Write x and n after each lap. Stop when the while condition becomes false.","اكتب x و n بعد كل دورة، وتوقّف عندما يصبح شرط while خطأً."),cut:upTo()}]
});

}
