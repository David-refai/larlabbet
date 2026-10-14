import {OUT,at,bankGen,blist,body,bp,bx,by,cell,heartBig,joints,label,note,organ,pointAt,skeleton,ttl} from "./no-0body.js";
import {A,LESSONS,R,TERM,WORDS,f1,t3,wbMount} from "../../legacy/core.js";
/* ===== no4a.js: NO, Year 4, the human body 1 and 2 =====
   1. no4a: the body - cells, organs and organ systems
   2. no4b: the skeleton and the muscles */
{
const W=(s)=>new RegExp("(?<![a-zåäö])"+s+"(?![a-zåäö])","i");
TERM("no_cell",{sv:"cell",m:W("cell(en|er|erna)?"),d:t3("Kroppens minsta byggsten. Den syns bara i mikroskop.","The smallest building block of the body. You can only see it in a microscope.","أصغر وحدة بناء في الجسم، لا تُرى إلا بالمجهر."),ex:"Du har miljarder celler.",tr:{en:"cell",ar:"خلية"}});
TERM("no_organ",{sv:"organ",m:W("organ(et|en)?"),d:t3("En del av kroppen som har en viss uppgift.","A part of the body that has a special job.","جزء من الجسم له مهمة معيّنة."),ex:"Hjärtat är ett organ.",tr:{en:"organ",ar:"عضو"}});
TERM("no_organsystem",{sv:"organsystem",m:W("organsystem(et|en)?"),d:t3("Flera organ som samarbetar.","Several organs that work together.","عدة أعضاء تعمل معًا."),ex:"Matspjälkningen är ett organsystem.",tr:{en:"organ system",ar:"جهاز (في الجسم)"}});
TERM("no_vavnad",{sv:"vävnad",m:W("vävnad(en|er|erna)?"),d:t3("Många likadana celler som gör samma jobb.","Many cells of the same kind doing the same job.","خلايا كثيرة متشابهة تقوم بالعمل نفسه."),ex:"muskelvävnad",tr:{en:"tissue",ar:"نسيج"}});
TERM("no_huden",{sv:"hud",m:W("hud(en)?"),d:t3("Kroppens största organ. Den skyddar kroppen.","The body's largest organ. It protects the body.","أكبر عضو في الجسم، يحميه."),ex:"Huden svettas när du är varm.",tr:{en:"skin",ar:"الجلد"}});
TERM("no_svettas",{sv:"svettas",m:W("svett(as|ades|en|körtl[a-z]*)?"),d:t3("Huden släpper ut vatten så att kroppen kyls ner.","The skin lets out water so the body cools down.","يُخرج الجلد ماءً ليبرد الجسم."),ex:"Man svettas när man springer.",tr:{en:"to sweat",ar:"يتعرّق"}});
TERM("no_mikroskop",{sv:"mikroskop",m:W("mikroskop(et|en)?"),d:t3("Ett instrument som förstorar mycket små saker.","An instrument that makes very small things look big.","جهاز يكبّر الأشياء الصغيرة جدًا."),ex:"Celler syns i mikroskop.",tr:{en:"microscope",ar:"مجهر"}});
TERM("no_skelett",{sv:"skelett",m:W("skelett(et)?"),d:t3("Alla ben i kroppen tillsammans. Det bär upp och skyddar kroppen.","All the bones of the body together. It holds the body up and protects it.","كل عظام الجسم معًا، يحمل الجسم ويحميه."),ex:"Skelettet har ungefär 206 ben.",tr:{en:"skeleton",ar:"الهيكل العظمي"}});
TERM("no_led",{sv:"led",m:W("led(en|er|erna)"),d:t3("Där två ben möts så att kroppen kan böjas.","Where two bones meet so the body can bend.","مكان التقاء عظمتين ليتمكن الجسم من الانثناء."),ex:"Knät är en led.",tr:{en:"joint",ar:"مَفصِل"}});
TERM("no_muskel",{sv:"muskel",m:W("musk(el|eln|ler|lerna)"),d:t3("Den drar ihop sig och drar i benen så att du kan röra dig.","It contracts and pulls the bones so you can move.","تنقبض وتسحب العظام فتتحرّك."),ex:"Muskler kan bara dra, inte trycka.",tr:{en:"muscle",ar:"عضلة"}});
TERM("no_sena",{sv:"sena",m:W("sen(a|an|or|orna)"),d:t3("Ett starkt band som fäster en muskel vid ett ben.","A strong band that attaches a muscle to a bone.","شريط قوي يربط العضلة بالعظم."),ex:"Hälsenan sitter vid foten.",tr:{en:"tendon",ar:"وَتَر"}});
TERM("no_kota",{sv:"kota / ryggrad",m:W("(kot(a|an|or|orna)|ryggrad(en)?)"),d:t3("Ryggraden är byggd av små ben som heter kotor.","The backbone is built of small bones called vertebrae.","العمود الفقري مبني من عظام صغيرة اسمها الفقرات."),ex:"Ryggraden skyddar ryggmärgen.",tr:{en:"vertebra / backbone",ar:"فقرة / العمود الفقري"}});
TERM("no_skalle",{sv:"skalle / kranium",m:W("(skall(e|en)|kranium|kraniet)"),d:t3("Benet runt huvudet som skyddar hjärnan.","The bone around the head that protects the brain.","العظم حول الرأس يحمي الدماغ."),ex:"Skallen skyddar hjärnan.",tr:{en:"skull",ar:"الجمجمة"}});
TERM("no_revben",{sv:"revben",m:W("revben(et|en)?"),d:t3("Böjda ben som skyddar hjärtat och lungorna.","Curved bones that protect the heart and lungs.","عظام منحنية تحمي القلب والرئتين."),ex:"Vi har 12 par revben.",tr:{en:"rib",ar:"ضلع"}});

/* ---------------------------------------------------------------
   1. no4a: cells, tissue, organs, organ systems, the skin
   --------------------------------------------------------------- */
const STAIR=[["cell","g"],["vävnad","g"],["organ","r"],["organsystem","b"],["kropp","k"]];
const stair=()=>{const o=[];STAIR.forEach(([s,c],i)=>{const x=110+i*150,y=380-i*62;o.push(A.p(R.line(x-60,y+14,x+60,y+14,.4),c,4),A.tx(s,x,y,32,c));if(i)o.push(A.arrow(x-150+40,y+62-10,x-46,y+8,"k",-14))});return o};
const BODY1={steps:[
 {say:t3("Din kropp är som en stor fabrik där alla delar jobbar tillsammans. I det här kapitlet ska vi titta in i kroppen och se hur den fungerar.",
   "Your body is like a big factory where all the parts work together. In this chapter we look inside the body and see how it works.",
   "جسمك مثل مصنع كبير تعمل كل أجزائه معًا. في هذا الفصل سننظر داخل الجسم ونرى كيف يعمل."),
  draw:()=>{at(400,40,.98);return[A.wipe(),...body(),A.tx("Människokroppen",640,110,40,"b"),A.tx("Hur fungerar",640,190,30),A.tx("du inuti?",640,230,30)]}},
 {say:t3("Hela kroppen är byggd av små byggstenar som heter celler. En cell är så liten att den bara syns i mikroskop. Du har miljarder celler, och varje cell har en cellkärna som styr den.",
   "The whole body is built of tiny building blocks called cells. A cell is so small you can only see it in a microscope. You have billions of cells, and each one has a nucleus that controls it.",
   "الجسم كله مبني من وحدات صغيرة اسمها الخلايا. الخلية صغيرة جدًا فلا تُرى إلا بالمجهر. لديك مليارات الخلايا، ولكل خلية نواة تتحكّم بها."),
  draw:()=>[A.wipe(),ttl("Celler"),...cell(250,270,110),A.p(R.line(270,270,470,200,.3),"v",2.5),A.tx("cellkärna",480,206,32,"v","start"),A.p(R.line(330,350,470,380,.3),"g",2.5),A.tx("cell",480,390,32,"g","start"),
   ...cell(620,300,26),...cell(680,330,22),...cell(640,360,20),A.tx("miljarder!",660,440,30,"o")]},
 {say:t3("Många likadana celler som gör samma jobb bildar en vävnad. Olika vävnader bildar ett organ. Ett organ är en del av kroppen som har en viss uppgift, till exempel hjärtat som pumpar blod.",
   "Many cells of the same kind doing the same job form a tissue. Different tissues form an organ. An organ is a part of the body with a special job, like the heart that pumps blood.",
   "خلايا كثيرة متشابهة تقوم بالعمل نفسه تكوّن نسيجًا. والأنسجة المختلفة تكوّن عضوًا. العضو جزء من الجسم له مهمة معيّنة، مثل القلب الذي يضخّ الدم."),
  draw:()=>[A.wipe(),ttl("Från cell till organ"),...cell(130,250,40),A.tx("cell",130,340,32,"g"),A.arrow(190,250,270,250,"k"),
   ...[0,1,2].flatMap(r=>[0,1,2].flatMap(c=>[A.p(R.loop(330+c*36,214+r*36,17,14),"g",2.5)])),A.tx("vävnad",366,340,32,"g"),A.arrow(440,250,520,250,"k"),
   ...heartBig(640,240,.6),A.tx("organ: hjärtat",640,340,32,"r"),note("celler → vävnad → organ",440,"b",34)]},
 {say:t3("Här ser du några viktiga organ inuti kroppen. Hjärnan i huvudet, lungorna och hjärtat i bröstkorgen, och levern, magsäcken och tarmarna i magen.",
   "Here are some important organs inside the body. The brain in the head, the lungs and heart in the chest, and the liver, stomach and intestines in the belly.",
   "هذه بعض الأعضاء المهمة داخل الجسم: الدماغ في الرأس، والرئتان والقلب في الصدر، والكبد والمعدة والأمعاء في البطن."),
  draw:()=>{at(330,40,.98);return[A.wipe(),...body(),...["brain","lungR","lungL","heart","liver","stomach","small","large"].flatMap(k=>organ(k,true)),
   ...label("brain","hjärnan",1,90),...label("lungL","lungorna",1,170),...label("heart","hjärtat",1,230),...label("stomach","magsäcken",1,285),...label("liver","levern",-1,250),...label("small","tarmarna",1,340)]}},
 {say:t3("Flera organ som samarbetar kallas ett organsystem. Skelettet och musklerna gör att du kan röra dig. Blodomloppet transporterar saker runt i kroppen. Andningen hämtar syre. Matspjälkningen tar näring ur maten, och nervsystemet styr allt.",
   "Several organs that work together are called an organ system. The skeleton and muscles let you move. The circulation carries things around the body. Breathing gets oxygen. Digestion takes nutrients from food, and the nervous system controls it all.",
   "عدة أعضاء تعمل معًا تُسمّى جهازًا. الهيكل العظمي والعضلات تجعلك تتحرّك، والدورة الدموية تنقل الأشياء في الجسم، والتنفّس يجلب الأكسجين، والهضم يأخذ الغذاء من الطعام، والجهاز العصبي يتحكّم بكل شيء."),
  draw:()=>[A.wipe(),ttl("Organsystem"),...blist([["Skelett och muskler: rörelse","k"],["Blodomloppet: transport","r"],["Andningen: syre","b"],["Matspjälkningen: näring","o"],["Nervsystemet: styr allt","v"]],150,150,62,32)]},
 {say:t3("Huden är också ett organ, och den är kroppens största organ! Den skyddar mot smuts och bakterier, känner värme, kyla och smärta, och när du är varm svettas du så att kroppen kyls ner.",
   "The skin is an organ too, and it is the body's largest organ! It protects against dirt and bacteria, feels heat, cold and pain, and when you are hot you sweat so the body cools down.",
   "الجلد أيضًا عضو، وهو أكبر عضو في الجسم! يحمي من الأوساخ والبكتيريا، ويشعر بالحرارة والبرودة والألم، وعندما تشعر بالحر تتعرّق فيبرد جسمك."),
  draw:()=>{const top="M80 220 Q160 200 240 220 Q320 240 400 220 Q480 200 560 220 Q640 240 720 220";
   return[A.wipe(),ttl("Huden: kroppens största organ"),A.p(top,"o",5),A.p("M80 280 Q240 266 400 280 Q560 294 720 280","o",3),A.hatch("M80 220 Q160 200 240 220 Q320 240 400 220 Q480 200 560 220 Q640 240 720 220 L720 280 Q560 294 400 280 Q240 266 80 280 Z","o"),
    A.p("M200 300 L200 214 Q206 170 190 140","k",3),A.p("M500 300 L500 216","b",3),A.p("M500 196 Q490 214 500 222 Q510 214 500 196 Z","b",3),A.tx("svett",530,180,30,"b","start"),A.tx("hårstrå",220,150,30,"k","start"),
    ...blist([["skyddar mot bakterier","g"],["känner värme, kyla och smärta","r"],["kyler kroppen med svett","b"]],200,350,46,30)]}},
 {say:t3("Tänk på när du springer. Musklerna rör dig, hjärtat slår snabbare, du andas snabbare och huden blir svettig. Alla organsystem samarbetar!",
   "Think about when you run. Your muscles move you, your heart beats faster, you breathe faster and your skin gets sweaty. All the organ systems work together!",
   "فكّر عندما تركض: العضلات تحرّكك، والقلب ينبض أسرع، وتتنفّس أسرع، ويتعرّق جلدك. كل الأجهزة تعمل معًا!"),
  draw:()=>{at(300,40,.98);return[A.wipe(),...body(),...organ("heart",true),...organ("lungR"),...organ("lungL"),...label("heart","hjärtat slår snabbare",1,130,"r"),...label("lungL","du andas snabbare",1,200,"b"),
   A.p(R.line(bx(92),by(240),bx(118),by(280),.3),"k",2.5),A.tx("musklerna arbetar",bx(126),by(288),30,"k","start"),A.p(R.line(bx(-96),by(250),bx(-130),by(330),.3),"o",2.5),A.tx("huden svettas",bx(-136),by(338),30,"o","end"),A.p("M"+f1(bx(-104))+" "+f1(by(262))+" q-8 14 0 20 q8 -6 0 -20Z","b",3)]}},
 {say:t3("Kom ihåg trappan: celler bildar vävnader, vävnader bildar organ, organ samarbetar i organsystem, och alla organsystem tillsammans är din kropp.",
   "Remember the staircase: cells form tissues, tissues form organs, organs work together in organ systems, and all the organ systems together are your body.",
   "تذكّر الدرج: الخلايا تكوّن الأنسجة، والأنسجة تكوّن الأعضاء، والأعضاء تعمل معًا في أجهزة، وكل الأجهزة معًا هي جسمك."),
  draw:()=>[A.wipe(),ttl("Kom ihåg"),...stair()]},
]};
const BANK1=[
 {lv:0,q:"Vad är kroppen byggd av?",a:"celler",w:["sten","plast","vatten"]},
 {lv:0,q:"Vilket är kroppens största organ?",a:"huden",w:["hjärtat","levern","hjärnan"]},
 {lv:0,q:"Var sitter hjärnan?",a:"i huvudet",w:["i magen","i bröstet","i benet"]},
 {lv:0,q:"Hur kan man se en cell?",a:"i mikroskop",w:["med bara ögonen","i en spegel","med en ficklampa"]},
 {lv:0,q:"Vad heter organet som pilen visar?",a:"hjärtat",w:["magsäcken","levern","lungan"],lines:["Vad heter organet som pilen visar?"],pic:()=>pointAt("heart")},
 {lv:1,q:"Vad heter organet som pilen visar?",a:"magsäcken",w:["hjärtat","levern","hjärnan"],lines:["Vad heter organet som pilen visar?"],pic:()=>pointAt("stomach")},
 {lv:1,q:"Vad heter organet som pilen visar?",a:"lungan",w:["levern","magsäcken","hjärtat"],lines:["Vad heter organet som pilen visar?"],pic:()=>pointAt("lungR")},
 {lv:1,q:"Vad heter organet som pilen visar?",a:"levern",w:["lungan","hjärtat","tarmen"],lines:["Vad heter organet som pilen visar?"],pic:()=>pointAt("liver")},
 {lv:1,q:"Vad är ett organ?",a:"en del av kroppen med en viss uppgift",w:["en sorts cell","ett ben i armen","en sjukdom"]},
 {lv:1,q:"Vad kallas många likadana celler som gör samma jobb?",a:"vävnad",w:["organ","skelett","blod"]},
 {lv:1,q:"Varför svettas vi?",a:"för att kyla ner kroppen",w:["för att bli renare","för att få mer energi","för att växa"]},
 {lv:1,q:"Vad styr cellen?",a:"cellkärnan",w:["huden","blodet","skelettet"]},
 {lv:2,q:"Vilken ordning är rätt?",a:"cell, vävnad, organ, organsystem",w:["organ, cell, vävnad, organsystem","vävnad, cell, organsystem, organ","organsystem, organ, cell, vävnad"]},
 {lv:2,q:"Vad kallas flera organ som samarbetar?",a:"organsystem",w:["vävnad","cellkärna","muskel"]},
 {lv:2,q:"Vilket organsystem hämtar syre till kroppen?",a:"andningen",w:["matspjälkningen","skelettet","huden"]},
 {lv:2,q:"Vilket organsystem tar näring ur maten?",a:"matspjälkningen",w:["andningen","nervsystemet","blodomloppet"]},
 {lv:1,q:"Skriv ordet: kroppens minsta byggsten heter en …",a:["cell","cellen"],lines:["Skriv ordet som saknas:","Kroppens minsta byggsten heter en …"]},
 {lv:2,q:"Skriv ordet: hjärtat, lungorna och magsäcken är exempel på …",a:["organ"],lines:["Skriv ordet som saknas:","Hjärtat, lungorna och magsäcken är exempel på …"]},
];
LESSONS.push({id:"no4a",subject:"science",grades:"4",kind:"wb",year:4,ord:1,
 title:t3("Kroppen: celler, organ och organsystem","The body: cells, organs and organ systems","الجسم: الخلايا والأعضاء والأجهزة"),
 icon:`<svg viewBox="0 0 320 180"><rect width="320" height="180" fill="#fff"/><circle cx="110" cy="38" r="18" fill="none" stroke="#1d2433" stroke-width="3"/><path d="M98 58 L72 70 L66 130 M122 58 L148 70 L154 130 M90 62 L88 160 M130 62 L132 160 M88 160 L100 160 M120 160 L132 160" fill="none" stroke="#1d2433" stroke-width="3"/><path d="M110 104 Q96 94 101 86 Q105 81 110 87 Q115 81 119 86 Q124 94 110 104Z" fill="#f6c9c4" stroke="#d63b2f" stroke-width="2.5"/><ellipse cx="236" cy="90" rx="52" ry="42" fill="#e3f5ea" stroke="#1e9e5a" stroke-width="3"/><circle cx="242" cy="90" r="14" fill="#e9dcfb" stroke="#7c3aed" stroke-width="3"/></svg>`,
 steps:BODY1.steps,mount:wbMount(BODY1),gen:bankGen(BANK1)});
WORDS.no4a=["no_cell","no_vavnad","no_organ","no_organsystem","no_huden","no_svettas","no_mikroskop"];

/* ---------------------------------------------------------------
   2. no4b: the skeleton, joints, muscles and tendons
   --------------------------------------------------------------- */
/* an arm: shoulder S, elbow E, hand H; muscles drawn as long ovals beside the upper arm bone */
const ovalAlong=(S,E,side,fat,a0=.12,a1=.86)=>{const dx=E[0]-S[0],dy=E[1]-S[1],l=Math.hypot(dx,dy),ux=dx/l,uy=dy/l,nx=-uy*side,ny=ux*side;let d="";
  for(let i=0;i<=40;i++){const t=i/40*Math.PI*2,u=a0+(a1-a0)*(.5-.5*Math.cos(t)),w=Math.sin(t)*fat*(Math.sin(t)>0?1:.25);const off=fat*.55+10;
   d+=(i?"L":"M")+f1(S[0]+ux*l*u+nx*(off+w))+" "+f1(S[1]+uy*l*u+ny*(off+w))}return d+"Z"};
const arm=(S,E,H,bent)=>{const o=[A.p(R.line(S[0],S[1],E[0],E[1],.3),"k",9),A.p(R.line(E[0],E[1],H[0],H[1],.3),"k",9),A.p(R.circ(E[0],E[1],11),"k",4),A.p(R.circ(S[0],S[1],14),"k",4),
  A.p(R.circ(H[0],H[1],16),"k",3.5)];
  const bi=ovalAlong(S,E,-1,bent?30:14),tri=ovalAlong(S,E,1,bent?14:28);
  o.push(A.hatch(bi,"p"),A.p(bi,"p",3.5),A.hatch(tri,"b"),A.p(tri,"b",3.5));return o};
const SKEL=()=>{at(400,34,.98);return[bp(OUT,"#c7cfdc",2.5),...skeleton()]};
const BODY2={steps:[
 {say:t3("Inuti kroppen finns skelettet. Det är alla ben i kroppen tillsammans. En vuxen människa har ungefär 206 ben! Skelettet bär upp kroppen, precis som stommen i ett hus.",
   "Inside the body is the skeleton. It is all the bones of the body together. An adult has about 206 bones! The skeleton holds the body up, just like the frame of a house.",
   "داخل الجسم يوجد الهيكل العظمي، وهو كل عظام الجسم معًا. لدى الإنسان البالغ نحو 206 عظمة! الهيكل يحمل الجسم مثل هيكل البيت."),
  draw:()=>[A.wipe(),...SKEL(),A.tx("Skelettet",650,110,44,"b"),A.tx("ca 206 ben",650,170,34,"o"),A.tx("bär upp kroppen",650,230,30)]},
 {say:t3("Skelettet skyddar också organen. Skallen är en hård hjälm runt hjärnan. Revbenen bildar en bur runt hjärtat och lungorna. Ryggraden skyddar ryggmärgen, nervsträngen inuti ryggen.",
   "The skeleton also protects the organs. The skull is a hard helmet around the brain. The ribs form a cage around the heart and lungs. The backbone protects the spinal cord, the bundle of nerves inside the back.",
   "الهيكل العظمي يحمي الأعضاء أيضًا. الجمجمة خوذة صلبة حول الدماغ، والأضلاع قفص حول القلب والرئتين، والعمود الفقري يحمي النخاع الشوكي داخل الظهر."),
  draw:()=>{const o=[A.wipe(),...SKEL()];o.push(A.p(R.circ(bx(0),by(42),44),"o",4),A.p(R.loop(bx(0),by(155),58,52),"r",4),A.p(R.line(bx(0),by(80),bx(0),by(286),.2),"b",6),
   A.p(R.line(bx(26),by(40),bx(140),by(70),.3),"o",2.5),A.tx("skallen skyddar hjärnan",bx(148),by(76),28,"o","start"),
   A.p(R.line(bx(50),by(150),bx(140),by(160),.3),"r",2.5),A.tx("revbenen skyddar hjärtat",bx(148),by(150),28,"r","start"),A.tx("och lungorna",bx(148),by(186),28,"r","start"),
   A.p(R.line(bx(2),by(250),bx(-140),by(270),.3),"b",2.5),A.tx("ryggraden skyddar",bx(-148),by(266),28,"b","end"),A.tx("ryggmärgen",bx(-148),by(300),28,"b","end"));return o}},
 {say:t3("Ryggraden är inte ett enda långt ben. Den är byggd av 33 små ben som heter kotor, staplade på varandra. Därför kan du böja dig framåt och vrida på kroppen.",
   "The backbone is not one long bone. It is built of 33 small bones called vertebrae, stacked on top of each other. That is why you can bend forward and twist your body.",
   "العمود الفقري ليس عظمة طويلة واحدة، بل 33 عظمة صغيرة اسمها الفقرات، فوق بعضها. لذلك تستطيع أن تنحني وتلتفّ بجسمك."),
  draw:()=>{const o=[A.wipe(),ttl("Ryggraden")];for(let i=0;i<7;i++){const y=120+i*46;o.push(A.p(R.rect(250,y,110,30,.4),"k",3.5),A.p(`M360 ${y+8}l40 6M250 ${y+8}l-40 6`,"k",3))}
   o.push(A.p(R.line(305,110,305,450,.2),"v",5),A.tx("kota",430,150,32,"k","start"),A.arrow(425,140,370,134,"k",-8),A.tx("ryggmärgen",430,330,32,"v","start"),A.arrow(425,320,312,300,"v",10),
    A.tx("33 kotor",600,420,36,"o"));return o}},
 {say:t3("Där två ben möts finns en led. Tack vare lederna kan du böja armar, ben och fingrar. Axeln, armbågen, höften och knät är leder.",
   "Where two bones meet there is a joint. Thanks to the joints you can bend your arms, legs and fingers. The shoulder, elbow, hip and knee are joints.",
   "حيث تلتقي عظمتان يوجد مَفصِل. بفضل المفاصل تستطيع أن تثني ذراعيك ورجليك وأصابعك. الكتف والمرفق والورك والركبة مفاصل."),
  draw:()=>[A.wipe(),...SKEL(),...joints("shoulder"),...joints("elbow"),...joints("hip"),...joints("knee"),
   A.tx("axel",bx(-150),by(116),30,"r","end"),A.p(R.line(bx(-78),by(112),bx(-144),by(110),.3),"r",2.5),A.tx("armbåge",bx(-150),by(210),30,"r","end"),A.p(R.line(bx(-90),by(203),bx(-144),by(204),.3),"r",2.5),
   A.tx("höft",bx(150),by(300),30,"r","start"),A.p(R.line(bx(38),by(296),bx(144),by(294),.3),"r",2.5),A.tx("knä",bx(150),by(372),30,"r","start"),A.p(R.line(bx(42),by(368),bx(144),by(366),.3),"r",2.5),
   A.tx("leder",650,90,40,"r")]},
 {say:t3("Benen kan inte röra sig själva. Det gör musklerna. En muskel sitter fast i benet med en stark sena. När muskeln drar ihop sig blir den kortare och tjockare, och den drar i benet.",
   "Bones can't move by themselves. Muscles do that. A muscle is attached to the bone with a strong tendon. When the muscle contracts it gets shorter and thicker, and it pulls the bone.",
   "العظام لا تتحرّك وحدها، بل العضلات تحرّكها. العضلة مثبتة بالعظم بوَتَر قوي. عندما تنقبض العضلة تصبح أقصر وأسمك وتسحب العظم."),
  draw:()=>[A.wipe(),ttl("Muskler och senor"),...arm([180,170],[440,190],[620,120],false).slice(0,6),A.p(ovalAlong([180,170],[440,190],-1,22),"p",4),A.hatch(ovalAlong([180,170],[440,190],-1,22),"p"),
   A.p(R.line(410,152,470,178,.2),"o",5),A.tx("sena",500,230,32,"o","start"),A.arrow(495,220,460,182,"o",-8),A.tx("muskel",300,92,32,"p"),A.tx("ben",300,260,32,"k"),
   note("muskeln drar ihop sig → den drar i benet",440,"p",30)]},
 {say:t3("En muskel kan bara dra, aldrig trycka. Därför jobbar musklerna i par. När du böjer armen drar biceps på framsidan ihop sig. När du sträcker armen är det triceps på baksidan som drar.",
   "A muscle can only pull, never push. That is why muscles work in pairs. When you bend your arm, the biceps on the front contracts. When you straighten it, the triceps on the back pulls.",
   "العضلة تسحب فقط ولا تدفع أبدًا، لذلك تعمل العضلات في أزواج. عندما تثني ذراعك تنقبض العضلة ذات الرأسين في الأمام، وعندما تمدّها تسحب العضلة ذات الثلاثة رؤوس في الخلف."),
  draw:()=>[A.wipe(),ttl("Muskler jobbar i par"),...arm([150,140],[150,330],[300,220],true),A.tx("böjd arm",200,440,32),A.tx("biceps drar",250,140,26,"p","start"),
   ...arm([470,180],[620,250],[760,320],false),A.tx("sträckt arm",620,440,32),A.tx("triceps drar",560,330,26,"b","start"),
   A.p(R.line(400,110,400,420,.3),"#c7cfdc",2)]},
 {say:t3("Ben och muskler blir starkare när du rör dig, till exempel när du springer, hoppar och klättrar. Benen behöver också kalcium. Det finns i mjölk, ost, yoghurt och gröna grönsaker.",
   "Bones and muscles get stronger when you move, for example when you run, jump and climb. Bones also need calcium. It is in milk, cheese, yoghurt and green vegetables.",
   "تصبح العظام والعضلات أقوى عندما تتحرّك، مثل الركض والقفز والتسلّق. وتحتاج العظام أيضًا إلى الكالسيوم الموجود في الحليب والجبن واللبن والخضار الخضراء."),
  draw:()=>[A.wipe(),ttl("Starka ben och muskler"),...blist([["rör dig varje dag","g"],["spring, hoppa och klättra","g"],["kalcium: mjölk, ost, yoghurt","b"],["gröna grönsaker","g"],["sov ordentligt","v"]],180,150,58,32)]},
 {say:t3("Visste du att det största benet är lårbenet i låret? Det minsta benet heter stigbygeln och sitter inne i örat. Det är mindre än ett riskorn!",
   "Did you know the largest bone is the thigh bone? The smallest bone is called the stirrup and sits inside the ear. It is smaller than a grain of rice!",
   "هل تعلم أن أكبر عظمة هي عظمة الفخذ؟ وأصغر عظمة اسمها الرِّكاب وتوجد داخل الأذن، وهي أصغر من حبة أرز!"),
  draw:()=>[A.wipe(),ttl("Visste du?"),A.p("M140 160 Q120 140 140 130 Q160 124 170 146 L200 380 Q220 400 196 412 Q176 418 172 396 Z","k",4),A.tx("lårbenet",260,250,34,"k","start"),A.tx("störst",260,296,30,"o","start"),
   A.p("M584 300 Q614 214 644 300 M574 300 L654 300 M614 236 L614 212","k",4),A.p(R.circ(614,204,8),"k",3.5),A.tx("stigbygeln",614,360,34,"k"),A.tx("minst, i örat",614,404,30,"o"),A.tx("(i verkligheten 3 mm)",614,444,24,"k")]},
]};
const BANK2=[
 {lv:0,q:"Vad kallas alla ben i kroppen tillsammans?",a:"skelettet",w:["muskeln","organet","huden"]},
 {lv:0,q:"Ungefär hur många ben har en vuxen människa?",a:"206",w:["20","1 000","56"]},
 {lv:0,q:"Vad skyddar skallen?",a:"hjärnan",w:["hjärtat","magsäcken","lungorna"]},
 {lv:0,q:"Vad gör att du kan röra dig?",a:"musklerna",w:["levern","hjärnan bara","huden"]},
 {lv:1,q:"Vad skyddar revbenen?",a:"hjärtat och lungorna",w:["hjärnan","tarmarna","njurarna"]},
 {lv:1,q:"Vad heter de små benen som ryggraden är byggd av?",a:"kotor",w:["revben","senor","leder"]},
 {lv:1,q:"Vad kallas platsen där två ben möts?",a:"en led",w:["en sena","en kota","en muskel"]},
 {lv:1,q:"Vad fäster en muskel vid ett ben?",a:"en sena",w:["en led","en kota","en nerv"]},
 {lv:1,q:"Vilken av dessa är en led?",a:"knät",w:["låret","magen","pannan"]},
 {lv:1,q:"Vad behöver benen för att bli starka?",a:"kalcium",w:["socker","salt","fett"]},
 {lv:2,q:"Varför jobbar musklerna i par?",a:"en muskel kan bara dra, inte trycka",w:["en muskel kan bara trycka","musklerna är för små","benen är för tunga"]},
 {lv:2,q:"Vilken muskel drar när du böjer armen?",a:"biceps",w:["triceps","hälsenan","hjärtat"]},
 {lv:2,q:"Vad händer med en muskel när den drar ihop sig?",a:"den blir kortare och tjockare",w:["den blir längre och tunnare","den blir hård som ben","den försvinner"]},
 {lv:2,q:"Vad skyddar ryggraden?",a:"ryggmärgen",w:["magsäcken","hjärtat","levern"]},
 {lv:2,q:"Vilket är kroppens största ben?",a:"lårbenet",w:["stigbygeln","revbenet","skallen"]},
 {lv:1,q:"Skriv ordet: där två ben möts finns en …",a:["led","leden"],lines:["Skriv ordet som saknas:","Där två ben möts finns en …"]},
 {lv:2,q:"Skriv ordet: en muskel sitter fast i benet med en …",a:["sena","senan"],lines:["Skriv ordet som saknas:","En muskel sitter fast i benet med en …"]},
 {lv:2,q:"Skriv ordet: alla ben i kroppen tillsammans kallas …",a:["skelettet","skelett"],lines:["Skriv ordet som saknas:","Alla ben i kroppen tillsammans kallas …"]},
];
LESSONS.push({id:"no4b",subject:"science",grades:"4",kind:"wb",year:4,ord:2,
 title:t3("Skelettet och musklerna","The skeleton and the muscles","الهيكل العظمي والعضلات"),
 icon:`<svg viewBox="0 0 320 180"><rect width="320" height="180" fill="#fff"/><path d="M70 50 L70 120 L150 80" fill="none" stroke="#1d2433" stroke-width="8" stroke-linecap="round"/><ellipse cx="96" cy="84" rx="18" ry="34" fill="#f5d0e0" stroke="#c2417a" stroke-width="3"/><circle cx="70" cy="120" r="7" fill="#fff" stroke="#1d2433" stroke-width="3"/><circle cx="230" cy="40" r="20" fill="none" stroke="#1d2433" stroke-width="3"/><path d="M230 62V140M200 80Q230 74 260 80M204 96Q230 90 256 96M208 112Q230 106 252 112M216 140L206 170M244 140L254 170" fill="none" stroke="#1d2433" stroke-width="3"/></svg>`,
 steps:BODY2.steps,mount:wbMount(BODY2),gen:bankGen(BANK2)});
WORDS.no4b=["no_skelett","no_skalle","no_revben","no_kota","no_led","no_muskel","no_sena"];
}
