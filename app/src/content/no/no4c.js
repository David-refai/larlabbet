import {SENSE,at,bankGen,blist,body,bx,by,heartBig,label,note,organ,pointAt,ttl} from "./no-0body.js";
import {A,LESSONS,R,TERM,WORDS,f1,t3,wbMount} from "../../legacy/core.js";
/* ===== no4c.js: NO, Year 4, the human body 3 and 4 =====
   3. no4c: the heart, blood vessels and blood
   4. no4d: the lungs and breathing */
{
const W=(s)=>new RegExp("(?<![a-zåäö])"+s+"(?![a-zåäö])","i");
TERM("no_hjarta",{sv:"hjärta",m:W("hjärt(a|at|an|muskeln)"),d:t3("En muskel som pumpar blodet runt i kroppen.","A muscle that pumps blood around the body.","عضلة تضخّ الدم في الجسم."),ex:"Hjärtat är lika stort som din knutna hand.",tr:{en:"heart",ar:"القلب"}});
TERM("no_blodkarl",{sv:"blodkärl",m:W("blodkärl(et|en)?"),d:t3("Rör som blodet färdas i.","Tubes that the blood travels in.","أنابيب يسير فيها الدم."),ex:"Artärer och vener är blodkärl.",tr:{en:"blood vessel",ar:"وعاء دموي"}});
TERM("no_artar",{sv:"artär",m:W("artär(en|er|erna)?"),d:t3("Ett blodkärl som för blodet från hjärtat.","A blood vessel that carries blood away from the heart.","وعاء يحمل الدم من القلب."),ex:"Pulsen känns i en artär.",tr:{en:"artery",ar:"شريان"}});
TERM("no_ven",{sv:"ven",m:W("ven(en|er|erna)"),d:t3("Ett blodkärl som för blodet tillbaka till hjärtat.","A blood vessel that carries blood back to the heart.","وعاء يعيد الدم إلى القلب."),ex:"Venerna syns blå under huden.",tr:{en:"vein",ar:"وريد"}});
TERM("no_puls",{sv:"puls",m:W("puls(en)?"),d:t3("Hur många gånger hjärtat slår på en minut. Den känns på handleden och halsen.","How many times the heart beats in a minute. You can feel it on the wrist and neck.","عدد نبضات القلب في الدقيقة، تُحسّ في المعصم والرقبة."),ex:"Pulsen blir högre när du springer.",tr:{en:"pulse",ar:"النبض"}});
TERM("no_syre",{sv:"syre",m:W("syre(t|rik[a-z]*)?"),d:t3("En gas i luften som alla celler behöver.","A gas in the air that all cells need.","غاز في الهواء تحتاجه كل الخلايا."),ex:"Vi andas in syre.",tr:{en:"oxygen",ar:"الأكسجين"}});
TERM("no_koldioxid",{sv:"koldioxid",m:W("koldioxid(en)?"),d:t3("En gas som cellerna gör sig av med. Vi andas ut den.","A gas the cells get rid of. We breathe it out.","غاز تتخلّص منه الخلايا، نُخرجه مع الزفير."),ex:"Vi andas ut koldioxid.",tr:{en:"carbon dioxide",ar:"ثاني أكسيد الكربون"}});
TERM("no_blodkropp",{sv:"blodkropp",m:W("(röda |vita )?blodkropp(ar|arna|en)?"),d:t3("Små celler i blodet. Röda bär syre, vita bekämpar bakterier.","Tiny cells in the blood. Red ones carry oxygen, white ones fight bacteria.","خلايا صغيرة في الدم؛ الحمراء تحمل الأكسجين والبيضاء تحارب البكتيريا."),ex:"vita blodkroppar",tr:{en:"blood cell",ar:"خلية دم"}});
TERM("no_kretslopp",{sv:"blodomlopp",m:W("(blodomlopp(et)?|kretslopp(et)?)"),d:t3("Blodets väg från hjärtat, runt kroppen och tillbaka.","The blood's path from the heart, around the body and back.","طريق الدم من القلب حول الجسم ثم العودة."),ex:"det stora och det lilla kretsloppet",tr:{en:"circulation",ar:"الدورة الدموية"}});
TERM("no_lunga",{sv:"lunga / lungor",m:W("lung(a|an|or|orna)"),d:t3("Organen i bröstet där syre går över till blodet.","The organs in the chest where oxygen passes into the blood.","العضوان في الصدر حيث ينتقل الأكسجين إلى الدم."),ex:"Vi har två lungor.",tr:{en:"lung",ar:"رئة"}});
TERM("no_luftstrupe",{sv:"luftstrupe",m:W("luftstrup(e|en)"),d:t3("Röret som leder luften från halsen ner till lungorna.","The tube that leads air from the throat down to the lungs.","الأنبوب الذي يوصل الهواء من الحلق إلى الرئتين."),ex:"Luftstrupen delar sig i två luftrör.",tr:{en:"windpipe",ar:"القصبة الهوائية"}});
TERM("no_lungblasor",{sv:"lungblåsor",m:W("lungblås(a|an|or|orna)"),d:t3("Miljontals små blåsor i lungorna där syret går in i blodet.","Millions of tiny sacs in the lungs where oxygen goes into the blood.","ملايين الأكياس الصغيرة في الرئتين حيث يدخل الأكسجين الدم."),ex:"Lungblåsorna ser ut som små druvklasar.",tr:{en:"air sacs",ar:"الحويصلات الهوائية"}});
TERM("no_mellangardet",{sv:"mellangärdet",m:W("mellangärde(t)?"),d:t3("En platt muskel under lungorna som hjälper dig att andas.","A flat muscle under the lungs that helps you breathe.","عضلة مسطّحة تحت الرئتين تساعدك على التنفّس."),ex:"Mellangärdet sänks när du andas in.",tr:{en:"diaphragm",ar:"الحجاب الحاجز"}});
TERM("no_andas",{sv:"andas in / ut",m:W("(andas|inandning(en)?|utandning(en)?)"),d:t3("Ta in luft i lungorna och släppa ut den.","Take air into the lungs and let it out.","إدخال الهواء إلى الرئتين وإخراجه."),ex:"Andas in genom näsan.",tr:{en:"to breathe in / out",ar:"يتنفّس / شهيق وزفير"}});

/* ---------------------------------------------------------------
   3. no4c: the heart and the blood
   --------------------------------------------------------------- */
const fist=(x,y,s=1)=>A.p(`M${x-40*s},${y-10*s}Q${x-44*s},${y-46*s} ${x-14*s},${y-44*s}Q${x+20*s},${y-56*s} ${x+38*s},${y-30*s}Q${x+54*s},${y} ${x+30*s},${y+30*s}Q${x},${y+50*s} ${x-30*s},${y+26*s}Q${x-48*s},${y+10*s} ${x-40*s},${y-10*s}ZM${x-14*s},${y-44*s}Q${x-10*s},${y-20*s} ${x-20*s},${y-6*s}M${x+10*s},${y-50*s}Q${x+14*s},${y-24*s} ${x+4*s},${y-8*s}`,"o",3.5);
const box=(x,y,w,h,s,c)=>[A.p(R.rect(x,y,w,h,.5),c,3.5),A.tx(s,x+w/2,y+h/2+11,30,c)];
const loopArrow=(x1,y1,x2,y2,c,bend)=>A.arrow(x1,y1,x2,y2,c,bend);
const BODY3={steps:[
 {say:t3("Hjärtat är en muskel, ungefär lika stor som din knutna hand. Det sitter mitt i bröstkorgen, lite till vänster, skyddat av revbenen. Det pumpar blod hela livet utan att vila.",
   "The heart is a muscle about the size of your fist. It sits in the middle of the chest, a little to the left, protected by the ribs. It pumps blood your whole life without resting.",
   "القلب عضلة بحجم قبضة يدك تقريبًا. يقع في وسط الصدر مائلًا قليلًا إلى اليسار، تحميه الأضلاع. يضخّ الدم طوال حياتك دون راحة."),
  draw:()=>{at(250,40,.98);return[A.wipe(),...body(),...organ("heart",true),...label("heart","hjärtat",1,150),A.tx("lika stort som",600,280,30),A.tx("din knutna hand",600,316,30),fist(600,390,1)]}},
 {say:t3("Hjärtat är som en pump med fyra rum: två förmak upptill och två kammare nedtill. När hjärtmuskeln drar ihop sig trycks blodet ut. Det är det du hör när hjärtat slår: dunk dunk.",
   "The heart is like a pump with four rooms: two atria at the top and two ventricles at the bottom. When the heart muscle contracts, blood is pushed out. That is what you hear when the heart beats: thump thump.",
   "القلب مثل مضخة بأربع حجرات: أذينان في الأعلى وبطينان في الأسفل. عندما تنقبض عضلة القلب يُدفع الدم إلى الخارج، وهذا ما تسمعه عندما ينبض القلب: دُم دُم."),
  draw:()=>[A.wipe(),ttl("Hjärtat: en pump"),...heartBig(330,280,1.25),A.beat(2,330,280,1.06,.85),A.tx("förmak",272,250,28,"r"),A.tx("förmak",388,250,28,"r"),A.tx("kammare",282,320,26,"r"),A.tx("kammare",378,320,26,"r"),
   A.tx("4 rum",630,220,40,"b"),A.tx("dunk dunk!",630,320,38,"o")]},
 {say:t3("Blodet färdas i rör som heter blodkärl. Artärerna för blodet från hjärtat ut i kroppen. Venerna för blodet tillbaka till hjärtat. De allra minsta blodkärlen heter kapillärer och är tunnare än ett hårstrå.",
   "Blood travels in tubes called blood vessels. Arteries carry blood from the heart out into the body. Veins carry it back to the heart. The very smallest vessels are called capillaries and are thinner than a hair.",
   "يسير الدم في أنابيب اسمها الأوعية الدموية. الشرايين تحمل الدم من القلب إلى الجسم، والأوردة تعيده إلى القلب. وأصغر الأوعية اسمها الشعيرات الدموية، وهي أرقّ من الشعرة."),
  draw:()=>[A.wipe(),ttl("Blodkärl"),...heartBig(200,280,.7),A.p("M260 250 Q420 180 600 230","r",9),A.p("M600 330 Q420 380 260 310","b",9),A.arrow(560,214,620,236,"r"),A.arrow(300,330,250,312,"b"),
   A.p("M600 230 Q660 240 640 280 Q620 320 600 330","#9aa6bd",3),A.tx("artär: från hjärtat",420,170,30,"r"),A.tx("ven: till hjärtat",420,420,30,"b"),A.tx("kapillärer",700,290,26,"k"),
   A.flow("M262 250 Q420 180 600 230","r",7,3.2,5),A.flow("M600 330 Q420 380 262 310","b",7,3.2,5),A.beat(2,200,280,1.06,.85)]},
 {say:t3("Blodet går runt i två kretslopp. I det lilla kretsloppet pumpar hjärtat blodet till lungorna, där det hämtar syre. I det stora kretsloppet pumpar hjärtat ut det syrerika blodet till hela kroppen. Sedan kommer blodet tillbaka, utan syre men med koldioxid.",
   "Blood goes round in two circuits. In the small circuit the heart pumps blood to the lungs, where it picks up oxygen. In the big circuit the heart pumps the oxygen-rich blood to the whole body. Then the blood comes back, without oxygen but with carbon dioxide.",
   "يدور الدم في دورتين. في الدورة الصغرى يضخّ القلب الدم إلى الرئتين فيأخذ الأكسجين. وفي الدورة الكبرى يضخّ القلب الدم الغني بالأكسجين إلى الجسم كله، ثم يعود الدم بلا أكسجين ومعه ثاني أكسيد الكربون."),
  draw:()=>{const V=[["M372 228 C330 200 330 176 352 152","b"],["M448 152 C470 176 470 200 428 228","r"],["M432 296 C478 316 488 336 474 360","r"],["M326 360 C312 336 322 316 368 296","b"]];
   return[A.wipe(),ttl("Blodomloppet"),...box(310,92,180,60,"lungorna","b"),...box(290,360,220,64,"kroppens celler","k"),
   ...V.map(([d,c])=>A.p(d,c==="r"?"#f2b4ae":"#b9cbf2",16)),...heartBig(400,262,.42),A.beat(2,400,262,1.08,.85),
   ...V.map(([d,c])=>A.flow(d,c,4,2.4,7)),
   A.tx("lilla kretsloppet",160,130,26,"b"),A.tx("hämtar syre",160,164,26,"r"),A.tx("stora kretsloppet",640,330,26,"r"),A.tx("lämnar syre",640,364,26,"r"),A.tx("tar koldioxid",640,398,26,"b"),
   A.tx("röd = med syre",650,150,24,"r"),A.tx("blå = utan syre",650,182,24,"b")]}},
 {say:t3("Blodet är kroppens transportband. Det bär syre från lungorna och näring från maten till alla celler. Det tar med sig koldioxid och annat avfall bort från cellerna. Blodet sprider också värme i kroppen.",
   "Blood is the body's conveyor belt. It carries oxygen from the lungs and nutrients from food to all the cells. It takes carbon dioxide and other waste away from the cells. Blood also spreads heat through the body.",
   "الدم هو حزام النقل في الجسم. يحمل الأكسجين من الرئتين والغذاء من الطعام إلى كل الخلايا، ويأخذ ثاني أكسيد الكربون والفضلات الأخرى بعيدًا عنها، وينشر الحرارة في الجسم."),
  draw:()=>[A.wipe(),ttl("Blodet transporterar"),...blist([["syre till cellerna","r"],["näring från maten","o"],["koldioxid och avfall bort","b"],["värme runt i kroppen","r"]],200,170,64,34)]},
 {say:t3("I blodet finns små delar. Röda blodkroppar bär syret. Vita blodkroppar bekämpar bakterier när du är sjuk. Blodplättar täpper till ett sår så att det slutar blöda. Allt simmar i en gulaktig vätska som heter plasma.",
   "Blood has tiny parts. Red blood cells carry oxygen. White blood cells fight bacteria when you are ill. Platelets plug a cut so it stops bleeding. Everything floats in a yellowish liquid called plasma.",
   "في الدم أجزاء صغيرة: كريات الدم الحمراء تحمل الأكسجين، وكريات الدم البيضاء تحارب البكتيريا عندما تمرض، والصفائح الدموية تسدّ الجرح ليتوقف النزيف. وكل ذلك يسبح في سائل مصفرّ اسمه البلازما."),
  draw:()=>{const o=[A.wipe(),ttl("Blodets delar")];[[150,200],[230,170],[190,260],[120,290]].forEach(([x,y])=>o.push(A.hatch(R.circ(x,y,26),"r"),A.p(R.circ(x,y,26),"r",3.5),A.p(R.circ(x,y,9),"r",2.5)));
   o.push(A.tx("röda: bär syre",180,360,28,"r"));[[400,210],[460,260]].forEach(([x,y])=>o.push(A.p(R.loop(x,y,34,30),"v",3.5),A.p(R.loop(x+4,y,12,10),"v",3)));o.push(A.tx("vita: bekämpar",430,340,28,"v"),A.tx("bakterier",430,372,28,"v"));
   [[620,200],[650,230],[610,250],[660,190]].forEach(([x,y])=>o.push(A.p(R.loop(x,y,8,6),"o",3)));o.push(A.tx("blodplättar:",640,320,28,"o"),A.tx("stoppar blödning",640,352,28,"o"),note("allt flyter i plasma",450,"k",30));return o}},
 {say:t3("Varje gång hjärtat slår känner du en puls, på handleden eller på halsen. Hos ett barn i vila slår hjärtat ungefär 80 gånger i minuten. När du springer behöver musklerna mer syre, och då slår hjärtat mycket snabbare.",
   "Each time the heart beats you can feel a pulse, on your wrist or neck. In a resting child the heart beats about 80 times a minute. When you run your muscles need more oxygen, so the heart beats much faster.",
   "في كل نبضة للقلب تشعر بالنبض في المعصم أو الرقبة. ينبض قلب الطفل وهو مرتاح نحو 80 مرة في الدقيقة. وعندما تركض تحتاج العضلات أكسجينًا أكثر فينبض القلب أسرع بكثير."),
  draw:()=>{const ecg=(y,n,x0=90,w=620)=>{let d=`M${x0},${y}`;const st=w/n;for(let i=0;i<n;i++){const x=x0+i*st;d+=`L${f1(x+st*.4)},${y}L${f1(x+st*.5)},${y-50}L${f1(x+st*.6)},${y+26}L${f1(x+st*.7)},${y}L${f1(x+st)},${y}`}return d};
   return[A.wipe(),ttl("Pulsen"),A.tx("vila: ca 80 slag i minuten",400,140,30,"g"),A.p(ecg(220,4),"g",4),A.tx("springer: mycket snabbare",400,320,30,"r"),A.p(ecg(400,9),"r",4)]}},
 {say:t3("Kom ihåg: hjärtat pumpar blodet, artärerna för det ut och venerna för det tillbaka. Blodet hämtar syre i lungorna och lämnar det till cellerna.",
   "Remember: the heart pumps the blood, arteries carry it out and veins bring it back. The blood picks up oxygen in the lungs and gives it to the cells.",
   "تذكّر: القلب يضخّ الدم، والشرايين تحمله إلى الخارج والأوردة تعيده. يأخذ الدم الأكسجين في الرئتين ويعطيه للخلايا."),
  draw:()=>[A.wipe(),ttl("Kom ihåg"),...blist([["hjärtat = pumpen","r"],["artär: ut från hjärtat","r"],["ven: tillbaka till hjärtat","b"],["syre: från lungorna till cellerna","r"],["koldioxid: från cellerna till lungorna","b"]],140,150,60,32)]},
]};
const BANK3=[
 {lv:0,q:"Vad gör hjärtat?",a:"pumpar blodet runt i kroppen",w:["tar in luft","smälter maten","tänker"]},
 {lv:0,q:"Ungefär hur stort är hjärtat?",a:"som din knutna hand",w:["som en fotboll","som en ärta","som ett huvud"]},
 {lv:0,q:"Var sitter hjärtat?",a:"i bröstkorgen",w:["i magen","i huvudet","i halsen"]},
 {lv:0,q:"Vad heter rören som blodet färdas i?",a:"blodkärl",w:["luftrör","tarmar","senor"]},
 {lv:1,q:"Vilka blodkärl för blodet från hjärtat?",a:"artärerna",w:["venerna","lungblåsorna","senorna"]},
 {lv:1,q:"Vilka blodkärl för blodet tillbaka till hjärtat?",a:"venerna",w:["artärerna","luftrören","nerverna"]},
 {lv:1,q:"Hur många rum har hjärtat?",a:"fyra",w:["två","ett","sex"]},
 {lv:1,q:"Vad gör de röda blodkropparna?",a:"bär syre",w:["bekämpar bakterier","stoppar blödning","smälter maten"]},
 {lv:1,q:"Vad gör de vita blodkropparna?",a:"bekämpar bakterier",w:["bär syre","pumpar blodet","gör maten mindre"]},
 {lv:1,q:"Var kan du känna pulsen?",a:"på handleden",w:["på knät","på näsan","på naglarna"]},
 {lv:1,q:"Vad händer med pulsen när du springer?",a:"den blir snabbare",w:["den blir långsammare","den stannar","inget händer"]},
 {lv:2,q:"Var hämtar blodet syre?",a:"i lungorna",w:["i magsäcken","i hjärtat","i levern"]},
 {lv:2,q:"Vad tar blodet med sig bort från cellerna?",a:"koldioxid",w:["syre","kalcium","näring"]},
 {lv:2,q:"Vad gör blodplättarna?",a:"täpper till sår så att blödningen slutar",w:["bär syre","bekämpar bakterier","för blodet till hjärtat"]},
 {lv:2,q:"Varför slår hjärtat snabbare när du springer?",a:"musklerna behöver mer syre",w:["hjärtat blir rädd","blodet blir kallt","maten smälts snabbare"]},
 {lv:2,q:"Vad händer i det lilla kretsloppet?",a:"blodet går till lungorna och hämtar syre",w:["blodet går till fötterna","blodet går till magen","blodet stannar i hjärtat"]},
 {lv:1,q:"Skriv ordet: hjärtat pumpar …",a:["blod","blodet"],lines:["Skriv ordet som saknas:","Hjärtat pumpar …"]},
 {lv:2,q:"Skriv ordet: hur många gånger hjärtat slår på en minut kallas …",a:["puls","pulsen"],lines:["Skriv ordet som saknas:","Hur många gånger hjärtat slår","på en minut kallas …"]},
];
LESSONS.push({id:"no4c",subject:"science",grades:"4",kind:"wb",year:4,ord:3,
 title:t3("Hjärtat och blodet","The heart and the blood","القلب والدم"),
 icon:`<svg viewBox="0 0 320 180"><rect width="320" height="180" fill="#fff"/><path d="M120 150 Q40 90 70 50 Q95 25 120 60 Q145 25 170 50 Q200 90 120 150Z" fill="#f6c9c4" stroke="#d63b2f" stroke-width="4"/><path d="M180 70 Q240 50 290 80" fill="none" stroke="#d63b2f" stroke-width="7"/><path d="M290 120 Q240 140 180 115" fill="none" stroke="#2257c9" stroke-width="7"/></svg>`,
 steps:BODY3.steps,mount:wbMount(BODY3),gen:bankGen(BANK3)});
WORDS.no4c=["no_hjarta","no_blodkarl","no_artar","no_ven","no_kretslopp","no_syre","no_koldioxid","no_blodkropp","no_puls"];

/* ---------------------------------------------------------------
   4. no4d: the lungs and breathing
   --------------------------------------------------------------- */
/* big lungs with the windpipe and the air tubes; s = how full (1 = breathing in) */
const lungsBig=(cx,top,s=1,fill=true)=>{const P=(x,y)=>f1(cx+x*s)+","+f1(top+y*s);
  const L1=`M${P(-24,40)}Q${P(-40,20)} ${P(-80,40)}Q${P(-150,90)} ${P(-150,220)}Q${P(-150,270)} ${P(-110,270)}Q${P(-60,270)} ${P(-30,240)}Z`,
   L2=`M${P(24,40)}Q${P(40,20)} ${P(80,40)}Q${P(150,90)} ${P(150,220)}Q${P(150,270)} ${P(110,270)}Q${P(60,270)} ${P(30,240)}Z`;
  const o=[];if(fill)o.push(A.hatch(L1,"b"),A.hatch(L2,"b"));o.push(A.p(L1,"b",4),A.p(L2,"b",4),
   A.p(`M${f1(cx)},${f1(top-60*s)}L${f1(cx)},${f1(top+40*s)}M${f1(cx)},${f1(top+40*s)}Q${P(-30,60)} ${P(-60,110)}M${P(-45,85)}L${P(-90,100)}M${P(-55,100)}L${P(-70,150)}M${f1(cx)},${f1(top+40*s)}Q${P(30,60)} ${P(60,110)}M${P(45,85)}L${P(90,100)}M${P(55,100)}L${P(70,150)}`,"k",4));return o};
const grapes=(x,y,k=1)=>{const o=[];[[0,0],[-22,16],[22,16],[-10,38],[14,40],[0,62],[-26,52],[26,58]].forEach(([dx,dy])=>o.push(A.hatch(R.circ(x+dx*k,y+dy*k,14*k),"b"),A.p(R.circ(x+dx*k,y+dy*k,14*k),"b",3)));o.push(A.p(`M${x},${y-60*k}L${x},${y-12*k}`,"k",4));return o};
const BODY4={steps:[
 {say:t3("Alla celler i kroppen behöver syre för att kunna få energi ur maten. Syret finns i luften. När du andas in tar du in syre, och när du andas ut släpper du ut koldioxid.",
   "All the cells in the body need oxygen to get energy from food. Oxygen is in the air. When you breathe in you take in oxygen, and when you breathe out you let out carbon dioxide.",
   "تحتاج كل خلايا الجسم إلى الأكسجين لتحصل على الطاقة من الطعام. الأكسجين موجود في الهواء. عندما تتنفّس تُدخل الأكسجين، وعندما تزفر تُخرج ثاني أكسيد الكربون."),
  draw:()=>{at(250,40,.98);return[A.wipe(),...body(),...organ("lungR",true),...organ("lungL",true),...organ("windpipe"),A.arrow(560,120,bx(6),by(60),"g",-20),A.tx("in: syre",600,110,34,"g","start"),
   A.arrow(bx(-6),by(64),130,250,"o",-20),A.tx("ut: koldioxid",30,290,30,"o","start")]}},
 {say:t3("Luften går in genom näsan eller munnen, ner i luftstrupen och vidare i två luftrör, ett till varje lunga. Inne i lungorna delar luftrören sig i allt mindre grenar, som ett träd upp och ner.",
   "Air goes in through the nose or mouth, down the windpipe and on into two air tubes, one to each lung. Inside the lungs the tubes split into smaller and smaller branches, like an upside-down tree.",
   "يدخل الهواء من الأنف أو الفم، وينزل في القصبة الهوائية ثم في أنبوبين، واحد لكل رئة. وداخل الرئتين تتفرّع الأنابيب إلى فروع أصغر فأصغر، مثل شجرة مقلوبة."),
  draw:()=>[A.wipe(),...lungsBig(400,170,1,false),A.beat(3,400,300,1.04,3.6),A.tx("luftstrupen",470,140,30,"k","start"),A.arrow(465,132,408,128,"k",-6),A.tx("luftrör",150,200,30,"k"),A.arrow(190,206,330,240,"k",10),
   A.tx("lungorna",650,300,32,"b"),A.tx("luftens väg",400,62,40,"b"),A.tx("näsa/mun → luftstrupe → luftrör → lungor",400,470,28,"g"),
   A.flow("M400 112 L400 210 Q370 230 340 280","#3fa7c9",5,3,7),A.flow("M400 112 L400 210 Q430 230 460 280","#3fa7c9",5,3,7)]},
 {say:t3("Längst in i lungorna finns miljontals små blåsor som heter lungblåsor. De ser ut som små druvklasar. Runt dem finns tunna blodkärl. Där går syret från luften in i blodet, och koldioxid går från blodet ut i luften.",
   "Deep in the lungs there are millions of tiny sacs called air sacs. They look like little bunches of grapes. Thin blood vessels surround them. There oxygen goes from the air into the blood, and carbon dioxide goes from the blood into the air.",
   "في عمق الرئتين ملايين الأكياس الصغيرة اسمها الحويصلات الهوائية، تشبه عناقيد العنب الصغيرة، وحولها أوعية دموية رقيقة. هناك ينتقل الأكسجين من الهواء إلى الدم، وينتقل ثاني أكسيد الكربون من الدم إلى الهواء."),
  draw:()=>[A.wipe(),ttl("Lungblåsor"),...grapes(280,190,2),A.p("M170 370 Q280 440 390 370","r",6),A.arrow(420,220,520,220,"r"),A.tx("syre in i blodet",530,228,30,"r","start"),A.arrow(520,300,420,300,"b"),A.tx("koldioxid ut",530,308,30,"b","start"),
   A.tx("blodkärl",280,470,28,"r")]},
 {say:t3("Hur kommer luften in? Under lungorna finns en platt muskel som heter mellangärdet. När du andas in drar mellangärdet sig nedåt och bröstkorgen vidgas. Då sugs luft in. När du andas ut slappnar mellangärdet av och luften pressas ut.",
   "How does the air get in? Under the lungs is a flat muscle called the diaphragm. When you breathe in, the diaphragm pulls down and the chest gets wider, so air is sucked in. When you breathe out, the diaphragm relaxes and the air is pushed out.",
   "كيف يدخل الهواء؟ تحت الرئتين عضلة مسطّحة اسمها الحجاب الحاجز. عند الشهيق ينزل الحجاب الحاجز ويتّسع الصدر فيُسحب الهواء إلى الداخل، وعند الزفير يرتخي ويُدفع الهواء إلى الخارج."),
  draw:()=>[A.wipe(),...lungsBig(220,140,.88),A.p("M70 400 Q220 394 370 400","v",6),A.arrow(220,340,220,388,"v"),A.tx("andas in",220,470,32,"g"),
   ...lungsBig(580,170,.7),A.p("M450 410 Q580 330 710 410","v",6),A.arrow(580,404,580,368,"v"),A.tx("andas ut",580,470,32,"o"),A.tx("mellangärdet",400,440,28,"v")]},
 {say:t3("Andas gärna genom näsan. Inne i näsan finns små hårstrån och slem som fångar damm och bakterier. Näsan värmer också luften innan den kommer ner till lungorna.",
   "Try to breathe through your nose. Inside the nose there are tiny hairs and mucus that catch dust and bacteria. The nose also warms the air before it reaches the lungs.",
   "تنفّس من أنفك إن استطعت. داخل الأنف شعيرات صغيرة ومخاط تلتقط الغبار والبكتيريا، والأنف يدفّئ الهواء أيضًا قبل أن يصل إلى الرئتين."),
  draw:()=>[A.wipe(),ttl("Näsan rensar luften"),...SENSE.nose(240,260,2.2),...blist([["hårstrån fångar damm","g"],["slem fångar bakterier","g"],["luften blir varm","r"]],420,200,64,32)]},
 {say:t3("När du springer behöver musklerna mycket mer syre. Då andas du snabbare och djupare, och hjärtat slår snabbare så att blodet hinner bära ut syret. Lungorna och hjärtat samarbetar.",
   "When you run your muscles need much more oxygen. Then you breathe faster and deeper, and your heart beats faster so the blood can carry the oxygen out. The lungs and heart work together.",
   "عندما تركض تحتاج العضلات أكسجينًا أكثر بكثير، فتتنفّس أسرع وأعمق، وينبض قلبك أسرع ليحمل الدم الأكسجين. الرئتان والقلب تعملان معًا."),
  draw:()=>[A.wipe(),ttl("Lungor och hjärta samarbetar"),A.tx("vila",200,150,34,"g"),A.tx("ca 20 andetag i minuten",200,200,26),A.tx("springer",600,150,34,"r"),A.tx("ca 50 andetag i minuten",600,200,26),
   ...lungsBig(200,270,.55),...lungsBig(600,262,.68),...heartBig(600,390,.22)]},
 {say:t3("Lungorna mår bra av frisk luft och rörelse. Rök från cigaretter och avgaser från bilar skadar lungblåsorna, så att det blir svårare att få syre. Därför ska man aldrig röka.",
   "The lungs like fresh air and exercise. Smoke from cigarettes and exhaust from cars damage the air sacs, making it harder to get oxygen. That is why you should never smoke.",
   "تحبّ الرئتان الهواء النقي والحركة. دخان السجائر وعوادم السيارات تؤذي الحويصلات الهوائية فيصعب الحصول على الأكسجين، لذلك يجب ألا تدخّن أبدًا."),
  draw:()=>[A.wipe(),ttl("Ta hand om lungorna"),...blist([["frisk luft och rörelse","g"],["rök skadar lungblåsorna","r"],["avgaser är dåligt för lungorna","r"]],160,170,64,32),
   A.p("M560 320 L720 320 L720 344 L560 344 Z","k",3.5),A.p(R.line(540,300,740,364,.2),"r",6),A.p(R.line(740,300,540,364,.2),"r",6)]},
 {say:t3("Prova själv: lägg handen på magen och andas djupt. Känner du hur magen åker ut när mellangärdet sänks? Räkna hur många andetag du tar på en minut, först i vila och sedan efter att du har hoppat.",
   "Try it: put your hand on your belly and breathe deeply. Can you feel your belly move out when the diaphragm goes down? Count how many breaths you take in a minute, first resting and then after jumping.",
   "جرّب بنفسك: ضع يدك على بطنك وتنفّس بعمق. هل تشعر ببطنك يخرج عندما ينزل الحجاب الحاجز؟ عُدّ أنفاسك في دقيقة، أولًا وأنت مرتاح ثم بعد أن تقفز."),
  draw:()=>[A.wipe(),ttl("Experiment"),...SENSE.hand(220,280,1.6),A.tx("handen på magen",220,400,28),...blist([["1. räkna andetag i vila","g"],["2. hoppa i en minut","o"],["3. räkna igen","r"],["Vad märker du?","b"]],400,200,60,30)]},
]};
const BANK4=[
 {lv:0,q:"Vilken gas behöver cellerna från luften?",a:"syre",w:["koldioxid","rök","ånga"]},
 {lv:0,q:"Vad andas vi ut?",a:"koldioxid",w:["bara syre","blod","vatten"]},
 {lv:0,q:"Hur många lungor har vi?",a:"två",w:["en","tre","fyra"]},
 {lv:0,q:"Vad är bra för lungorna?",a:"frisk luft och rörelse",w:["rök","avgaser","att sitta stilla"]},
 {lv:1,q:"Vad heter röret som leder luften ner till lungorna?",a:"luftstrupen",w:["matstrupen","ryggmärgen","artären"]},
 {lv:1,q:"Var går syret över till blodet?",a:"i lungblåsorna",w:["i magsäcken","i näsan","i hjärtat"]},
 {lv:1,q:"Vad fångar damm och bakterier i näsan?",a:"hårstrån och slem",w:["tänderna","blodet","tungan"]},
 {lv:1,q:"Vad gör näsan med luften?",a:"rensar och värmer den",w:["gör den kall","gör den till blod","gör den till koldioxid"]},
 {lv:1,q:"Vad händer när du springer?",a:"du andas snabbare och djupare",w:["du slutar andas","du andas långsammare","lungorna blir mindre"]},
 {lv:2,q:"Vad heter muskeln under lungorna som hjälper oss att andas?",a:"mellangärdet",w:["biceps","hjärtat","luftstrupen"]},
 {lv:2,q:"Vad händer med mellangärdet när du andas in?",a:"det drar sig nedåt",w:["det åker uppåt","det försvinner","det blir till luft"]},
 {lv:2,q:"Vilken ordning har luftens väg?",a:"näsa, luftstrupe, luftrör, lungor",w:["lungor, näsa, luftrör, luftstrupe","luftstrupe, näsa, lungor, luftrör","näsa, magsäck, lungor, luftrör"]},
 {lv:2,q:"Varför är rökning farligt för lungorna?",a:"röken skadar lungblåsorna",w:["röken gör lungorna större","röken ger mer syre","röken rensar luftrören"]},
 {lv:2,q:"Vad ser lungblåsorna ut som?",a:"små druvklasar",w:["långa rör","platta stenar","små tänder"]},
 {lv:2,q:"Vilka två organ samarbetar för att ge musklerna syre?",a:"lungorna och hjärtat",w:["magsäcken och levern","hjärnan och huden","njurarna och tarmarna"]},
 {lv:1,q:"Skriv ordet: luften går ner till lungorna genom …",a:["luftstrupen","luftstrupe"],lines:["Skriv ordet som saknas:","Luften går ner till lungorna genom …"]},
 {lv:2,q:"Skriv ordet: när vi andas in tar vi in gasen …",a:["syre","syret"],lines:["Skriv ordet som saknas:","När vi andas in tar vi in gasen …"]},
 {lv:1,q:"Vad heter organet som pilen visar?",a:"lungan",w:["hjärtat","magsäcken","levern"],lines:["Vad heter organet som pilen visar?"],pic:()=>pointAt("lungL")},
];
LESSONS.push({id:"no4d",subject:"science",grades:"4",kind:"wb",year:4,ord:4,
 title:t3("Lungorna och andningen","The lungs and breathing","الرئتان والتنفّس"),
 icon:`<svg viewBox="0 0 320 180"><rect width="320" height="180" fill="#fff"/><path d="M160 20V70M160 70Q140 80 120 110M160 70Q180 80 200 110" fill="none" stroke="#1d2433" stroke-width="5"/><path d="M148 70Q130 52 104 66Q60 96 62 150Q64 170 92 168Q128 164 148 140Z M172 70Q190 52 216 66Q260 96 258 150Q256 170 228 168Q192 164 172 140Z" fill="#dce6fb" stroke="#2257c9" stroke-width="4"/></svg>`,
 steps:BODY4.steps,mount:wbMount(BODY4),gen:bankGen(BANK4)});
WORDS.no4d=["no_syre","no_koldioxid","no_lunga","no_luftstrupe","no_lungblasor","no_mellangardet","no_andas"];
}
