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
   const q=head(three?[t3(`Du har ${cnt[0]} tröjor, ${cnt[1]} par byxor och ${cnt[2]} kepsar.`,`You have ${cnt[0]} tops, ${cnt[1]} pairs of trousers and ${cnt[2]} caps.`,`لديك ${cnt[0]} قمصان و${cnt[1]} سراويل و${cnt[2]} قبعات.`),
     t3("Hur många olika kombinationer kan du välja?","How many different outfits can you choose?","كم تشكيلة مختلفة يمكنك أن تختار؟")]
    :[t3(`Du har ${cnt[0]} tröjor och ${cnt[1]} par byxor.`,`You have ${cnt[0]} tops and ${cnt[1]} pairs of trousers.`,`لديك ${cnt[0]} قمصان و${cnt[1]} سراويل.`),
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
    line1=t3(`Du slår en tärning ${n} gånger och skriver resultaten i ordning.`,`You roll a dice ${n} times and write the results in order.`,`ترمي حجر نرد ${n} مرات وتكتب النتائج بالترتيب.`)}
   else{let n,k;do{k=rint(2,4);n=rint(3,6)}while(k**n>4096);labels=Array.from({length:n},(_,i)=>L(t3(`fråga ${i+1}`,`Q${i+1}`,`سؤال ${i+1}`)));vals=Array(n).fill(k);
    line1=t3(`Ett quiz har ${n} frågor med ${k} svarsalternativ var.`,`A quiz has ${n} questions with ${k} options each.`,`في مسابقة ${n} أسئلة، لكل سؤال ${k} خيارات.`)}
   const ans=vals.reduce((a,b)=>a*b,1),S=slots(labels,230,null),q2=T===3?t3("På hur många sätt kan man svara?","In how many ways can you answer?","بكم طريقة يمكن الإجابة؟"):t3("Hur många olika följder finns det?","How many different sequences are there?","كم تسلسلًا مختلفًا يوجد؟");
   const sv=slots(labels,230,vals);
   return{kind:"num",ans,show:fmt(ans),q:[...head([line1,q2]),...S.box],sol:[...sv.val,...sv.tim,...prod(vals,ans,430,44)]}}
  /* level 2: order matters, nobody/nothing can be chosen twice */
  const T=rint(0,3);let labels,vals,line1,q2;
  if(T===0){const n=rint(5,10);vals=[n,n-1,n-2];labels=[t3("guld","gold","ذهبية"),t3("silver","silver","فضية"),t3("brons","bronze","برونزية")].map(L);
   line1=t3(`${n} lag spelar en turnering.`,`${n} teams play a tournament.`,`${n} فرق تلعب في بطولة.`);q2=t3("På hur många sätt kan guld, silver och brons fördelas?","In how many ways can gold, silver and bronze be given out?","بكم طريقة يمكن توزيع الذهبية والفضية والبرونزية؟")}
  else if(T===1){const n=rint(10,25);vals=[n,n-1];labels=[t3("ordförande","chair","رئيس"),t3("sekreterare","secretary","أمين سر")].map(L);
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

/*PROB*/
}
