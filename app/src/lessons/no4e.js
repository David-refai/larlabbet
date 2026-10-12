import {A,LESSONS,R,TERM,WORDS,t3,wbMount} from "../legacy/core.js";
import {HEAD,OUT,SENSE,at,bankGen,blist,body,bp,bx,by,label,note,organ,pointAt,ttl} from "./no-0body.js";
/* ===== no4e.js: NO, Year 4, the human body 5, 6 and 7 =====
   5. no4e: digestion
   6. no4f: the brain, the nerves and the senses
   7. no4g: a healthy life - food, water, exercise, sleep and hygiene */
{
const W=(s)=>new RegExp("(?<![a-zåäö])"+s+"(?![a-zåäö])","i");
TERM("no_matspjalkning",{sv:"matspjälkning",m:W("matspjälkning(en)?"),d:t3("När kroppen delar upp maten i små delar som kan tas upp i blodet.","When the body breaks food down into tiny parts that can go into the blood.","تفكيك الجسم للطعام إلى أجزاء صغيرة تدخل الدم."),ex:"Matspjälkningen börjar i munnen.",tr:{en:"digestion",ar:"الهضم"}});
TERM("no_saliv",{sv:"saliv",m:W("saliv(en)?"),d:t3("Vätskan i munnen som gör maten mjuk och börjar dela upp den.","The liquid in the mouth that softens food and starts breaking it down.","السائل في الفم الذي يليّن الطعام ويبدأ بتفكيكه."),ex:"Saliv kallas också spott.",tr:{en:"saliva",ar:"اللعاب"}});
TERM("no_matstrupe",{sv:"matstrupe",m:W("matstrup(e|en)"),d:t3("Röret som för maten från munnen till magsäcken.","The tube that carries food from the mouth to the stomach.","الأنبوب الذي ينقل الطعام من الفم إلى المعدة."),ex:"Matstrupen är ungefär 25 cm.",tr:{en:"gullet",ar:"المريء"}});
TERM("no_magsack",{sv:"magsäck",m:W("magsäck(en|ar)?"),d:t3("En säck av muskler där maten blandas med magsaft.","A bag of muscle where food is mixed with stomach juice.","كيس عضلي يُخلط فيه الطعام بالعصارة المعدية."),ex:"Magsäcken knådar maten.",tr:{en:"stomach",ar:"المعدة"}});
TERM("no_tunntarm",{sv:"tunntarm",m:W("tunntarm(en)?"),d:t3("En lång, smal tarm där näringen tas upp i blodet.","A long, thin gut where nutrients go into the blood.","أمعاء طويلة رفيعة تُمتصّ فيها المواد الغذائية إلى الدم."),ex:"Tunntarmen är cirka 6 meter lång.",tr:{en:"small intestine",ar:"الأمعاء الدقيقة"}});
TERM("no_tjocktarm",{sv:"tjocktarm",m:W("tjocktarm(en)?"),d:t3("Tarmen där vatten tas upp från det som är kvar av maten.","The gut where water is taken from what is left of the food.","الأمعاء التي يُمتصّ فيها الماء مما تبقّى من الطعام."),ex:"Det som blir kvar blir bajs.",tr:{en:"large intestine",ar:"الأمعاء الغليظة"}});
TERM("no_naring",{sv:"näring / näringsämne",m:W("närings?(ämne|ämnen|ämnena)?"),d:t3("Det i maten som kroppen behöver för energi och för att växa.","What in food the body needs for energy and to grow.","ما في الطعام مما يحتاجه الجسم للطاقة والنمو."),ex:"Protein är ett näringsämne.",tr:{en:"nutrient",ar:"مادة غذائية"}});
TERM("no_hjarnan",{sv:"hjärna",m:W("hjärn(a|an|or)"),d:t3("Kroppens ledningscentral i huvudet. Den tänker, minns och styr.","The body's control centre in the head. It thinks, remembers and controls.","مركز التحكّم في الرأس؛ يفكّر ويتذكّر ويتحكّم."),ex:"Hjärnan skyddas av skallen.",tr:{en:"brain",ar:"الدماغ"}});
TERM("no_nerv",{sv:"nerv",m:W("nerv(en|er|erna|system[a-z]*)?"),d:t3("Trådar som skickar snabba signaler mellan hjärnan och kroppen.","Threads that send fast signals between the brain and the body.","خيوط ترسل إشارات سريعة بين الدماغ والجسم."),ex:"Nerverna går ut i hela kroppen.",tr:{en:"nerve",ar:"عصب"}});
TERM("no_ryggmarg",{sv:"ryggmärg",m:W("ryggmärg(en)?"),d:t3("En tjock nervsträng inuti ryggraden.","A thick bundle of nerves inside the backbone.","حبل عصبي سميك داخل العمود الفقري."),ex:"Ryggmärgen går från hjärnan ner i ryggen.",tr:{en:"spinal cord",ar:"النخاع الشوكي"}});
TERM("no_reflex",{sv:"reflex",m:W("reflex(en|er|erna)?"),d:t3("En blixtsnabb rörelse som kroppen gör utan att du tänker.","A lightning-fast movement the body makes without you thinking.","حركة سريعة جدًا يقوم بها الجسم دون تفكير."),ex:"Du drar bort handen från något varmt.",tr:{en:"reflex",ar:"رد فعل لا إرادي"}});
TERM("no_sinne",{sv:"sinne",m:W("sinne(t|n|na)?"),d:t3("Ett sätt att uppfatta världen: syn, hörsel, lukt, smak och känsel.","A way to sense the world: sight, hearing, smell, taste and touch.","طريقة لإدراك العالم: البصر والسمع والشم والتذوّق واللمس."),ex:"Vi har fem sinnen.",tr:{en:"sense",ar:"حاسّة"}});
TERM("no_pupill",{sv:"pupill",m:W("pupill(en|er|erna)?"),d:t3("Det svarta hålet i ögat där ljuset kommer in.","The black hole in the eye where light comes in.","الفتحة السوداء في العين التي يدخل منها الضوء."),ex:"Pupillen blir mindre i starkt ljus.",tr:{en:"pupil",ar:"بؤبؤ العين"}});
TERM("no_trumhinna",{sv:"trumhinna",m:W("trumhinn(a|an)"),d:t3("En tunn hinna i örat som skakar när ljud kommer.","A thin skin in the ear that shakes when sound comes.","غشاء رقيق في الأذن يهتزّ عندما يصل الصوت."),ex:"Ljudvågor får trumhinnan att vibrera.",tr:{en:"eardrum",ar:"طبلة الأذن"}});
TERM("no_tallriksmodellen",{sv:"tallriksmodellen",m:W("tallriksmodell(en)?"),d:t3("Ett sätt att lägga upp maten: mest grönsaker, sedan kolhydrater och protein.","A way to fill your plate: mostly vegetables, then carbs and protein.","طريقة لتوزيع الطعام في الصحن: أكثره خضار ثم النشويات والبروتين."),ex:"Halva tallriken grönsaker.",tr:{en:"the plate model",ar:"نموذج الصحن"}});
TERM("no_protein",{sv:"protein",m:W("protein(et|er)?"),d:t3("Näringsämne som bygger muskler och celler. Finns i kött, fisk, ägg och bönor.","A nutrient that builds muscles and cells. In meat, fish, eggs and beans.","مادة غذائية تبني العضلات والخلايا، في اللحم والسمك والبيض والفول."),ex:"Ägg innehåller protein.",tr:{en:"protein",ar:"بروتين"}});
TERM("no_kolhydrater",{sv:"kolhydrater",m:W("kolhydrat(er|erna)?"),d:t3("Näringsämnen som ger energi. Finns i bröd, pasta, ris och potatis.","Nutrients that give energy. In bread, pasta, rice and potatoes.","مواد غذائية تعطي الطاقة، في الخبز والمعكرونة والأرز والبطاطا."),ex:"Pasta ger kolhydrater.",tr:{en:"carbohydrates",ar:"النشويات / الكربوهيدرات"}});
TERM("no_vitamin",{sv:"vitamin",m:W("vitamin(et|er|erna)?"),d:t3("Små ämnen i maten som håller kroppen frisk.","Tiny substances in food that keep the body healthy.","مواد صغيرة في الطعام تحافظ على صحة الجسم."),ex:"Frukt har mycket vitaminer.",tr:{en:"vitamin",ar:"فيتامين"}});
TERM("no_bakterier",{sv:"bakterie",m:W("bakteri(e|en|er|erna)"),d:t3("Mycket små levande saker. Några kan göra oss sjuka.","Very tiny living things. Some can make us ill.","كائنات حية صغيرة جدًا، بعضها يُمرضنا."),ex:"Tvätta bort bakterier med tvål.",tr:{en:"bacteria",ar:"بكتيريا"}});

/* ---------------------------------------------------------------
   5. no4e: digestion - the food's journey
   --------------------------------------------------------------- */
const tooth=(x,y,s=1)=>A.p(`M${x-30*s},${y-30*s}Q${x-34*s},${y-56*s} ${x-14*s},${y-54*s}Q${x},${y-48*s} ${x+14*s},${y-54*s}Q${x+34*s},${y-56*s} ${x+30*s},${y-30*s}Q${x+26*s},${y} ${x+18*s},${y+40*s}Q${x+12*s},${y+50*s} ${x+6*s},${y+30*s}Q${x},${y+12*s} ${x-6*s},${y+30*s}Q${x-12*s},${y+50*s} ${x-18*s},${y+40*s}Q${x-26*s},${y} ${x-30*s},${y-30*s}Z`,"k",3.5);
const apple=(x,y,s=1)=>[A.hatch(`M${x},${y-30*s}Q${x+44*s},${y-50*s} ${x+44*s},${y}Q${x+40*s},${y+44*s} ${x},${y+40*s}Q${x-40*s},${y+44*s} ${x-44*s},${y}Q${x-44*s},${y-50*s} ${x},${y-30*s}Z`,"r"),
 A.p(`M${x},${y-30*s}Q${x+44*s},${y-50*s} ${x+44*s},${y}Q${x+40*s},${y+44*s} ${x},${y+40*s}Q${x-40*s},${y+44*s} ${x-44*s},${y}Q${x-44*s},${y-50*s} ${x},${y-30*s}ZM${x},${y-30*s}Q${x+2*s},${y-46*s} ${x+8*s},${y-52*s}`,"r",3.5),A.p(`M${x+6*s},${y-44*s}Q${x+26*s},${y-60*s} ${x+34*s},${y-46*s}Q${x+20*s},${y-36*s} ${x+6*s},${y-44*s}Z`,"g",3)];
const crumbs=(x,y,n=7,c="o")=>{const o=[];for(let i=0;i<n;i++)o.push(A.p(R.circ(x+((i*37)%70)-35,y+((i*23)%50)-25,4+(i%3)),c,3));return o};
const DIG=["gullet","stomach","liver","small","large"];
const BODY5={steps:[
 {say:t3("Maten ger kroppen energi och byggmaterial. Men en äppelbit är alldeles för stor för att komma in i blodet. Därför delar kroppen upp maten i pyttesmå delar. Det kallas matspjälkning, och det är en lång resa genom kroppen.",
   "Food gives the body energy and building material. But a piece of apple is far too big to get into the blood. So the body breaks food into tiny parts. That is called digestion, and it is a long journey through the body.",
   "يعطي الطعام الجسم الطاقة ومواد البناء. لكن قطعة التفاح كبيرة جدًا على أن تدخل الدم، لذلك يفكّك الجسم الطعام إلى أجزاء صغيرة جدًا. هذا يسمّى الهضم، وهو رحلة طويلة داخل الجسم."),
  draw:()=>[A.wipe(),ttl("Matspjälkningen"),...apple(160,260,1.3),A.arrow(240,260,330,260,"k"),...crumbs(400,260,9),A.arrow(470,260,560,260,"k"),A.p("M590 220 Q680 260 760 220 M590 300 Q680 340 760 300","r",6),
   ...[0,1,2].map(i=>A.p(R.circ(620+i*45,262+i*4,5),"o",3)),A.tx("blodet",680,370,30,"r"),A.tx("stor bit",160,360,28),A.tx("pyttesmå delar",400,360,28,"o")]},
 {say:t3("Resan börjar i munnen. Tänderna tuggar sönder maten, och tungan blandar den med saliv, alltså spott. Salivens ämnen börjar redan dela upp maten. Därför är det bra att tugga ordentligt!",
   "The journey starts in the mouth. The teeth chew the food into pieces, and the tongue mixes it with saliva. The saliva already starts to break the food down. That is why it is good to chew well!",
   "تبدأ الرحلة في الفم. الأسنان تمضغ الطعام، واللسان يخلطه باللعاب. ومواد اللعاب تبدأ بتفكيك الطعام، لذلك من الجيد أن تمضغ جيدًا!"),
  draw:()=>[A.wipe(),ttl("1. Munnen"),tooth(190,250,1.6),A.tx("tänderna tuggar",190,380,30),...SENSE.tongue(420,260,1.4),A.tx("tungan blandar",420,380,30,"r"),
   ...[0,1,2].map(i=>A.p(`M${600+i*40},${220+i*14} q-10 18 0 26 q10 -8 0 -26Z`,"b",3)),A.tx("saliv",640,380,30,"b")]},
 {say:t3("När du sväljer glider maten ner i matstrupen, ett rör från halsen till magsäcken. Musklerna i matstrupen trycker maten nedåt med en vågrörelse. Det fungerar till och med om du står på huvudet!",
   "When you swallow, the food slides down the gullet, a tube from the throat to the stomach. The muscles in the gullet push the food down with a wave. It even works if you stand on your head!",
   "عندما تبلع ينزلق الطعام في المريء، وهو أنبوب من الحلق إلى المعدة. عضلات المريء تدفع الطعام إلى الأسفل بحركة موجية، وهذا يعمل حتى لو وقفت على رأسك!"),
  draw:()=>[A.wipe(),ttl("2. Matstrupen"),A.p("M360 100 L360 440 M440 100 L440 230 Q470 250 440 270 L440 440","k",4),A.hatch(R.circ(400,250,32),"o"),A.p(R.circ(400,250,32),"o",3.5),
   A.arrow(520,200,520,320,"p"),A.tx("musklerna",540,250,30,"p","start"),A.tx("trycker nedåt",540,290,30,"p","start"),A.tx("från halsen",200,130,28),A.tx("till magsäcken",200,430,28)]},
 {say:t3("I magsäcken stannar maten några timmar. Magsäcken är en säck av muskler som knådar maten och blandar den med magsaft. Magsaften är sur och dödar många bakterier. Maten blir till en tjock gröt.",
   "In the stomach the food stays for a few hours. The stomach is a bag of muscle that kneads the food and mixes it with stomach juice. The juice is acidic and kills many bacteria. The food turns into a thick porridge.",
   "يبقى الطعام في المعدة بضع ساعات. المعدة كيس من العضلات يعجن الطعام ويخلطه بالعصارة المعدية، وهي حامضة وتقتل كثيرًا من البكتيريا. يتحوّل الطعام إلى عصيدة سميكة."),
  draw:()=>{const st="M330 110 Q340 100 360 106 Q520 140 500 300 Q480 410 360 400 Q280 392 270 340 Q350 350 380 310 Q410 260 350 200 Z";
   return[A.wipe(),ttl("3. Magsäcken"),A.hatch(st,"r"),A.p(st,"r",5),...[[400,230],[430,290],[380,330],[450,240]].map(([x,y])=>A.p(R.circ(x,y,9),"g",3)),A.tx("magsaft (sur)",600,250,30,"g"),A.tx("knådar maten",600,300,30,"r"),A.tx("några timmar",600,350,30,"k")]}},
 {say:t3("Sedan kommer maten till tunntarmen. Den är ungefär sex meter lång, hoprullad i magen! Här delas maten upp helt, och näringen går in i blodet genom tarmväggen. Blodet bär sedan näringen till alla celler.",
   "Next the food comes to the small intestine. It is about six metres long, coiled up in your belly! Here the food is broken down completely, and the nutrients pass into the blood through the gut wall. The blood then carries them to all the cells.",
   "ثم يصل الطعام إلى الأمعاء الدقيقة، وطولها نحو ستة أمتار ملفوفة في البطن! هنا يتفكّك الطعام تمامًا، وتنتقل المواد الغذائية إلى الدم عبر جدار الأمعاء، ثم يحملها الدم إلى كل الخلايا."),
  draw:()=>{let d="M220 150";for(let r=0;r<5;r++){const y=150+r*56;d+=r%2?`L240 ${y}Q200 ${y+28} 240 ${y+56}`:`L520 ${y}Q560 ${y+28} 520 ${y+56}`}
   return[A.wipe(),ttl("4. Tunntarmen"),A.p(d,"o",10),A.tx("ca 6 meter!",660,190,36,"o"),A.tx("näringen går",660,280,30,"r"),A.tx("in i blodet",660,320,30,"r"),A.arrow(560,300,600,300,"r")]}},
 {say:t3("Det som kroppen inte kan använda går vidare till tjocktarmen. Där tas vattnet upp, så att resten blir fastare. Det som blir kvar är bajs, och det lämnar kroppen när du går på toaletten.",
   "What the body can't use moves on to the large intestine. There the water is taken up, so the rest gets firmer. What is left is poo, and it leaves the body when you go to the toilet.",
   "ما لا يستطيع الجسم استعماله ينتقل إلى الأمعاء الغليظة، وهناك يُمتصّ الماء فيصبح الباقي أصلب. وما يتبقّى هو البراز، ويخرج من الجسم عندما تذهب إلى الحمّام."),
  draw:()=>[A.wipe(),ttl("5. Tjocktarmen"),A.p("M260 400 Q200 400 200 350 L200 160 Q200 120 240 120 L560 120 Q600 120 600 160 L600 350 Q600 400 540 400 L460 400","g",14),
   A.arrow(300,250,360,250,"b"),A.tx("vatten tas upp",420,258,30,"b","start"),A.arrow(450,420,450,470,"k"),A.tx("ut: bajs",520,470,28,"k","start")]},
 {say:t3("Här är hela resan: munnen, matstrupen, magsäcken, tunntarmen och tjocktarmen. Levern hjälper till genom att göra galla, som delar upp fett. Hela resan tar ungefär ett till två dygn.",
   "Here is the whole journey: mouth, gullet, stomach, small intestine and large intestine. The liver helps by making bile, which breaks down fat. The whole journey takes about one to two days.",
   "هذه الرحلة كاملة: الفم، المريء، المعدة، الأمعاء الدقيقة، الأمعاء الغليظة. ويساعد الكبد بصنع العصارة الصفراوية التي تفكّك الدهون. وتستغرق الرحلة نحو يوم إلى يومين."),
  draw:()=>{at(260,30,1);return[A.wipe(),...body(),...DIG.flatMap(k=>organ(k,true)),...label("gullet","matstrupen",1,90),...label("stomach","magsäcken",1,160),...label("liver","levern: galla",-1,240),
   ...label("small","tunntarmen",1,250),...label("large","tjocktarmen",1,330),A.tx("1–2 dygn",640,440,32,"b")]}},
 {say:t3("Kom ihåg ordningen: mun, matstrupe, magsäck, tunntarm, tjocktarm. I tunntarmen går näringen in i blodet, och i tjocktarmen tas vattnet upp.",
   "Remember the order: mouth, gullet, stomach, small intestine, large intestine. In the small intestine the nutrients go into the blood, and in the large intestine the water is taken up.",
   "تذكّر الترتيب: الفم، المريء، المعدة، الأمعاء الدقيقة، الأمعاء الغليظة. في الأمعاء الدقيقة تدخل المواد الغذائية الدم، وفي الأمعاء الغليظة يُمتصّ الماء."),
  draw:()=>[A.wipe(),ttl("Kom ihåg"),...blist([["1. munnen: tuggar, saliv","k"],["2. matstrupen: trycker ner","r"],["3. magsäcken: magsaft","r"],["4. tunntarmen: näring till blodet","o"],["5. tjocktarmen: vatten tas upp","g"]],150,150,60,32)]},
]};
const BANK5=[
 {lv:0,q:"Var börjar matspjälkningen?",a:"i munnen",w:["i magsäcken","i tarmen","i levern"]},
 {lv:0,q:"Vad gör tänderna?",a:"tuggar sönder maten",w:["tar upp vatten","pumpar blod","gör galla"]},
 {lv:0,q:"Vad heter vätskan i munnen?",a:"saliv",w:["galla","magsaft","blod"]},
 {lv:0,q:"Vad heter organet som pilen visar?",a:"magsäcken",w:["hjärtat","lungan","levern"],lines:["Vad heter organet som pilen visar?"],pic:()=>pointAt("stomach")},
 {lv:1,q:"Vad heter röret från munnen till magsäcken?",a:"matstrupen",w:["luftstrupen","tunntarmen","artären"]},
 {lv:1,q:"Vad gör magsaften?",a:"delar upp maten och dödar bakterier",w:["tar upp vatten","bär syre","gör maten större"]},
 {lv:1,q:"Var går näringen in i blodet?",a:"i tunntarmen",w:["i munnen","i matstrupen","i tjocktarmen"]},
 {lv:1,q:"Vad händer i tjocktarmen?",a:"vatten tas upp",w:["maten tuggas","syre tas upp","blodet pumpas"]},
 {lv:1,q:"Ungefär hur lång är tunntarmen?",a:"6 meter",w:["6 centimeter","60 meter","1 meter"]},
 {lv:2,q:"Vilken ordning är rätt?",a:"mun, matstrupe, magsäck, tunntarm, tjocktarm",w:["mun, magsäck, matstrupe, tjocktarm, tunntarm","matstrupe, mun, tunntarm, magsäck, tjocktarm","mun, tjocktarm, magsäck, matstrupe, tunntarm"]},
 {lv:2,q:"Vad gör levern för matspjälkningen?",a:"gör galla som delar upp fett",w:["tuggar maten","pumpar blodet","tar in syre"]},
 {lv:2,q:"Varför måste maten delas upp i små delar?",a:"så att den kan komma in i blodet",w:["så att den smakar bättre","så att den blir varm","så att magen blir större"]},
 {lv:2,q:"Hur trycker matstrupen maten nedåt?",a:"med muskler i en vågrörelse",w:["med luft","med tyngdkraften bara","med tänderna"]},
 {lv:2,q:"Ungefär hur lång tid tar matens resa genom kroppen?",a:"ett till två dygn",w:["fem minuter","en timme","en månad"]},
 {lv:1,q:"Skriv ordet: maten blandas med magsaft i …",a:["magsäcken","magsäck"],lines:["Skriv ordet som saknas:","Maten blandas med magsaft i …"]},
 {lv:2,q:"Skriv ordet: när kroppen delar upp maten kallas det …",a:["matspjälkning","matspjälkningen"],lines:["Skriv ordet som saknas:","När kroppen delar upp maten kallas det …"]},
 {lv:2,q:"Vad heter organet som pilen visar?",a:"tunntarmen",w:["magsäcken","levern","lungan"],lines:["Vad heter organet som pilen visar?"],pic:()=>pointAt("small")},
];
LESSONS.push({id:"no4e",subject:"science",grades:"4",kind:"wb",year:4,ord:5,
 title:t3("Matspjälkningen: matens resa","Digestion: the food's journey","الهضم: رحلة الطعام"),
 icon:`<svg viewBox="0 0 320 180"><rect width="320" height="180" fill="#fff"/><path d="M150 14V60Q152 74 170 80Q214 92 206 120Q198 142 166 136Q150 132 148 120" fill="none" stroke="#d63b2f" stroke-width="5"/><path d="M110 146H210M110 160Q160 170 210 160" fill="none" stroke="#e07b00" stroke-width="6"/><circle cx="70" cy="60" r="26" fill="#f6c9c4" stroke="#d63b2f" stroke-width="3"/></svg>`,
 steps:BODY5.steps,mount:wbMount(BODY5),gen:bankGen(BANK5)});
WORDS.no4e=["no_matspjalkning","no_saliv","no_matstrupe","no_magsack","no_tunntarm","no_tjocktarm","no_naring"];

/* ---------------------------------------------------------------
   6. no4f: the brain, the nerves and the five senses
   --------------------------------------------------------------- */
const NERVES="M0 76 L0 282 M0 110 L-60 112 L-84 200 L-92 290 M0 110 L60 112 L84 200 L92 290 M0 280 L-30 300 L-34 430 M0 280 L30 300 L34 430 M0 150 L-40 170 M0 150 L40 170 M0 200 L-36 230 M0 200 L36 230";
const BODY6={steps:[
 {say:t3("Hjärnan är kroppens ledningscentral. Den sitter i huvudet, skyddad av skallen. Med hjärnan tänker du, minns, känner glädje och rädsla, och den styr allt som händer i kroppen, även när du sover.",
   "The brain is the body's control centre. It sits in the head, protected by the skull. With your brain you think, remember, feel joy and fear, and it controls everything in the body, even while you sleep.",
   "الدماغ هو مركز التحكّم في الجسم. يقع في الرأس وتحميه الجمجمة. به تفكّر وتتذكّر وتشعر بالفرح والخوف، وهو يتحكّم بكل ما يحدث في الجسم حتى وأنت نائم."),
  draw:()=>{at(250,40,.98);return[A.wipe(),...body(),...organ("brain",true),...label("brain","hjärnan",1,80),...blist([["tänker","o"],["minns","o"],["känner","o"],["styr kroppen","o"]],520,200,56,32)]}},
 {say:t3("Från hjärnan går ryggmärgen ner inuti ryggraden. Från ryggmärgen går nerver ut i hela kroppen, ända ut i fingrar och tår. Nerverna skickar signaler, som blixtsnabba meddelanden, mellan hjärnan och kroppen.",
   "From the brain the spinal cord runs down inside the backbone. From the spinal cord, nerves go out to the whole body, all the way to fingers and toes. Nerves send signals, like lightning-fast messages, between the brain and the body.",
   "من الدماغ ينزل النخاع الشوكي داخل العمود الفقري، ومنه تخرج أعصاب إلى الجسم كله حتى الأصابع. الأعصاب ترسل إشارات مثل رسائل سريعة جدًا بين الدماغ والجسم."),
  draw:()=>{at(330,40,.98);return[A.wipe(),bp(OUT,"#c7cfdc",2.5),bp(HEAD,"#c7cfdc",2.5),...organ("brain",true),bp(NERVES,"v",3),A.p(R.line(bx(4),by(200),bx(140),by(180),.3),"v",2.5),A.tx("ryggmärgen",bx(146),by(186),30,"v","start"),
   A.p(R.line(bx(88),by(250),bx(140),by(270),.3),"v",2.5),A.tx("nerver",bx(146),by(276),30,"v","start"),A.tx("signaler",620,420,34,"o"),A.tx("blixtsnabbt!",620,460,30,"o")]}},
 {say:t3("Om du nuddar en het spis drar du bort handen innan du ens hunnit tänka. Det kallas en reflex. Signalen går från handen till ryggmärgen och direkt tillbaka till musklerna. Först efteråt känner hjärnan: aj, varmt!",
   "If you touch a hot stove you pull your hand away before you have even thought. That is called a reflex. The signal goes from the hand to the spinal cord and straight back to the muscles. Only afterwards does the brain feel: ouch, hot!",
   "إذا لمست موقدًا ساخنًا تسحب يدك قبل أن تفكّر، وهذا يسمّى ردّ فعل لا إرادي. تذهب الإشارة من اليد إلى النخاع الشوكي ثم تعود مباشرة إلى العضلات، وبعدها فقط يشعر الدماغ: آه، ساخن!"),
  draw:()=>[A.wipe(),ttl("En reflex"),...SENSE.hand(150,300,1.4),A.p("M80 380 L240 380","r",8),A.tx("het!",160,430,30,"r"),A.p("M200 250 Q350 160 500 220","v",4),A.arrow(330,180,400,180,"v"),A.p(R.rect(500,150,60,240,.4),"v",3.5),A.tx("ryggmärgen",530,420,28,"v"),
   A.p("M500 300 Q350 360 220 300","p",4),A.arrow(380,346,320,346,"p"),A.tx("1. signal in",340,140,26,"v"),A.tx("2. muskler drar bort handen",350,400,26,"p"),A.tx("3. sedan: aj!",680,200,30,"o")]},
 {say:t3("Hjärnan får veta vad som händer runt dig genom fem sinnen: synen med ögonen, hörseln med öronen, lukten med näsan, smaken med tungan och känseln med huden.",
   "The brain learns what is happening around you through five senses: sight with the eyes, hearing with the ears, smell with the nose, taste with the tongue and touch with the skin.",
   "يعرف الدماغ ما يحدث حولك عبر خمس حواس: البصر بالعينين، والسمع بالأذنين، والشم بالأنف، والتذوّق باللسان، واللمس بالجلد."),
  draw:()=>[A.wipe(),ttl("Fem sinnen"),...SENSE.eye(110,220,1),A.tx("syn",110,320,30,"b"),...SENSE.ear(250,220,1),A.tx("hörsel",255,320,30,"o"),...SENSE.nose(400,220,1),A.tx("lukt",400,320,30,"g"),
   ...SENSE.tongue(545,220,1),A.tx("smak",545,320,30,"r"),...SENSE.hand(690,220,1),A.tx("känsel",690,320,30,"v"),note("sinnena skickar signaler till hjärnan",430,"k",30)]},
 {say:t3("Ljus kommer in i ögat genom pupillen, det svarta hålet. Längst bak i ögat blir ljuset till signaler som går till hjärnan. Det är faktiskt hjärnan som ser! I starkt ljus blir pupillen mindre, i mörker blir den större.",
   "Light comes into the eye through the pupil, the black hole. At the back of the eye the light becomes signals that go to the brain. It is actually the brain that sees! In bright light the pupil gets smaller, in the dark it gets bigger.",
   "يدخل الضوء إلى العين عبر البؤبؤ، وهو الفتحة السوداء. وفي مؤخرة العين يتحوّل الضوء إلى إشارات تذهب إلى الدماغ، فالدماغ هو الذي يرى! في الضوء القوي يصغر البؤبؤ، وفي الظلام يكبر."),
  draw:()=>[A.wipe(),ttl("Ögat"),...SENSE.eye(280,250,3),A.p(R.line(280,250,470,180,.3),"k",2.5),A.tx("pupillen",480,186,30,"k","start"),A.p(R.line(310,226,470,270,.3),"b",2.5),A.tx("regnbågshinnan",480,276,30,"b","start"),
   A.tx("ljust: liten pupill",250,430,26,"o"),A.tx("mörkt: stor pupill",560,430,26,"v")]},
 {say:t3("Ljud är vibrationer i luften, ljudvågor. De går in i örat och får trumhinnan att skaka. Små ben inne i örat för vibrationerna vidare, och sedan blir de signaler till hjärnan. Höga ljud kan skada hörseln, så skydda öronen!",
   "Sound is vibrations in the air, sound waves. They go into the ear and make the eardrum shake. Tiny bones inside the ear pass the vibrations on, and then they become signals to the brain. Loud sounds can damage hearing, so protect your ears!",
   "الصوت اهتزازات في الهواء، أي موجات صوتية. تدخل الأذن فتهتزّ طبلة الأذن، ثم تنقل عظام صغيرة الاهتزازات، فتتحوّل إلى إشارات إلى الدماغ. الأصوات العالية قد تؤذي السمع، فاحمِ أذنيك!"),
  draw:()=>[A.wipe(),ttl("Örat"),...[0,1,2].map(i=>A.p(`M${120+i*40},${190} Q${140+i*40},${250} ${120+i*40},${310}`,"b",4)),A.tx("ljudvågor",160,360,28,"b"),
   ...SENSE.ear(380,250,2.2),A.p("M500 200 L500 300","r",6),A.tx("trumhinnan",520,256,30,"r","start"),A.arrow(560,300,660,340,"v"),A.tx("till hjärnan",680,380,28,"v")]},
 {say:t3("Hjärnan behöver sömn för att orka. När du sover sorterar hjärnan det du har lärt dig under dagen, så att du minns det bättre. Använd också hjälm när du cyklar, för att skydda hjärnan om du ramlar.",
   "The brain needs sleep. While you sleep, the brain sorts what you learned during the day, so you remember it better. Wear a helmet when you cycle too, to protect your brain if you fall.",
   "يحتاج الدماغ إلى النوم. أثناء نومك يرتّب الدماغ ما تعلّمته في النهار فتتذكّره أفضل. والبس الخوذة عندما تركب الدراجة لتحمي دماغك إذا وقعت."),
  draw:()=>[A.wipe(),ttl("Ta hand om hjärnan"),A.p("M120 300 Q120 200 220 190 Q320 190 330 300 Z","b",4),A.p("M110 300 L340 300","b",5),A.tx("hjälm",225,350,30,"b"),
   A.tx("Z z z",560,210,52,"v"),A.tx("sömn hjälper dig",560,300,30),A.tx("att minnas",560,340,30)]},
 {say:t3("Kom ihåg: hjärnan styr, ryggmärgen och nerverna skickar signaler, och de fem sinnena berättar för hjärnan om världen runt dig.",
   "Remember: the brain is in charge, the spinal cord and nerves send signals, and the five senses tell the brain about the world around you.",
   "تذكّر: الدماغ يتحكّم، والنخاع الشوكي والأعصاب ترسل الإشارات، والحواس الخمس تخبر الدماغ عن العالم من حولك."),
  draw:()=>[A.wipe(),ttl("Kom ihåg"),...blist([["hjärnan: ledningscentralen","o"],["ryggmärgen och nerverna: signaler","v"],["reflex: blixtsnabbt, utan att tänka","p"],["fem sinnen: syn, hörsel, lukt, smak, känsel","b"]],110,160,64,30)]},
]};
const BANK6=[
 {lv:0,q:"Var sitter hjärnan?",a:"i huvudet",w:["i bröstet","i magen","i ryggen"]},
 {lv:0,q:"Hur många sinnen brukar man säga att vi har?",a:"fem",w:["tre","sju","tio"]},
 {lv:0,q:"Vilket sinne använder du när du tittar?",a:"synen",w:["hörseln","lukten","smaken"]},
 {lv:0,q:"Med vilket organ känner du lukt?",a:"näsan",w:["örat","tungan","ögat"]},
 {lv:1,q:"Vad skickar nerverna?",a:"signaler",w:["blod","mat","luft"]},
 {lv:1,q:"Var finns ryggmärgen?",a:"inuti ryggraden",w:["i magsäcken","i hjärtat","i armen"]},
 {lv:1,q:"Vad heter det svarta hålet i ögat?",a:"pupillen",w:["trumhinnan","näsborren","tungan"]},
 {lv:1,q:"Vad skakar i örat när ljud kommer in?",a:"trumhinnan",w:["pupillen","tungan","mellangärdet"]},
 {lv:1,q:"Med vilket sinne känner du att något är varmt?",a:"känseln",w:["synen","hörseln","lukten"]},
 {lv:2,q:"Vad är en reflex?",a:"en blixtsnabb rörelse utan att du tänker",w:["en sorts muskel","ett ben i örat","en lång sömn"]},
 {lv:2,q:"Vad händer med pupillen i starkt ljus?",a:"den blir mindre",w:["den blir större","den blir röd","den försvinner"]},
 {lv:2,q:"Vad är ljud?",a:"vibrationer i luften",w:["små ljus","färger","värme"]},
 {lv:2,q:"Varför ska man använda hjälm när man cyklar?",a:"för att skydda hjärnan",w:["för att se bättre","för att höra bättre","för att andas lättare"]},
 {lv:2,q:"Vad gör hjärnan när du sover?",a:"sorterar det du har lärt dig",w:["stänger av helt","växer två gånger","slutar styra hjärtat"]},
 {lv:2,q:"Vilken del ser egentligen bilden?",a:"hjärnan",w:["pupillen","näsan","huden"]},
 {lv:1,q:"Skriv ordet: hjärnan, ryggmärgen och nerverna bildar …",a:["nervsystemet","nervsystem"],lines:["Skriv ordet som saknas:","Hjärnan, ryggmärgen och nerverna bildar …"]},
 {lv:2,q:"Skriv ordet: en blixtsnabb rörelse som du gör utan att tänka kallas en …",a:["reflex"],lines:["Skriv ordet som saknas:","En blixtsnabb rörelse utan att tänka","kallas en …"]},
 {lv:1,q:"Vad heter organet som pilen visar?",a:"hjärnan",w:["hjärtat","magsäcken","lungan"],lines:["Vad heter organet som pilen visar?"],pic:()=>pointAt("brain")},
];
LESSONS.push({id:"no4f",subject:"science",grades:"4",kind:"wb",year:4,ord:6,
 title:t3("Hjärnan, nerverna och sinnena","The brain, the nerves and the senses","الدماغ والأعصاب والحواس"),
 icon:`<svg viewBox="0 0 320 180"><rect width="320" height="180" fill="#fff"/><path d="M100 110Q70 108 72 80Q70 46 110 44Q130 24 160 36Q200 30 206 62Q226 80 204 104Q190 122 160 116Q130 126 100 110Z" fill="#fde6c8" stroke="#e07b00" stroke-width="4"/><path d="M150 116V170M150 140L110 166M150 140L190 166" fill="none" stroke="#7c3aed" stroke-width="4"/><ellipse cx="260" cy="70" rx="34" ry="20" fill="#fff" stroke="#1d2433" stroke-width="3"/><circle cx="260" cy="70" r="9" fill="#1d2433"/></svg>`,
 steps:BODY6.steps,mount:wbMount(BODY6),gen:bankGen(BANK6)});
WORDS.no4f=["no_hjarnan","no_ryggmarg","no_nerv","no_reflex","no_sinne","no_pupill","no_trumhinna"];

/* ---------------------------------------------------------------
   7. no4g: a healthy life
   --------------------------------------------------------------- */
const plate=(cx,cy,r)=>{const o=[A.p(R.circ(cx,cy,r+18),"k",3),A.p(R.circ(cx,cy,r),"k",3.5)];
  o.push(A.hatch(`M${cx},${cy}L${cx},${cy-r}A${r},${r} 0 0 0 ${cx},${cy+r}Z`,"g"),A.hatch(R.wedge(cx,cy,r,4,0),"o"),A.hatch(R.wedge(cx,cy,r,4,1),"r"),
   A.p(R.line(cx,cy-r,cx,cy+r,.3),"k",3),A.p(R.line(cx,cy,cx+r,cy,.3),"k",3));return o};
const BODY7={steps:[
 {say:t3("För att må bra behöver kroppen bra mat, vatten, rörelse och sömn. Ett enkelt sätt att äta bra är tallriksmodellen. Halva tallriken grönsaker, en fjärdedel kolhydrater som potatis, pasta eller ris, och en fjärdedel protein som kött, fisk, ägg eller bönor.",
   "To feel good the body needs good food, water, exercise and sleep. An easy way to eat well is the plate model. Half the plate vegetables, a quarter carbohydrates like potatoes, pasta or rice, and a quarter protein like meat, fish, eggs or beans.",
   "ليكون الجسم بخير يحتاج إلى طعام جيد وماء وحركة ونوم. وطريقة سهلة للأكل الجيد هي نموذج الصحن: نصف الصحن خضار، وربع نشويات مثل البطاطا والمعكرونة والأرز، وربع بروتين مثل اللحم والسمك والبيض والفول."),
  draw:()=>[A.wipe(),ttl("Tallriksmodellen"),...plate(270,280,150),A.tx("grönsaker",190,290,30,"g"),A.tx("½",190,330,34,"g"),A.tx("kolhyd-",345,222,22,"o"),A.tx("rater",345,248,22,"o"),A.tx("protein",345,350,26,"r"),
   ...blist([["potatis, pasta, ris, bröd","o"],["kött, fisk, ägg, bönor","r"],["morötter, sallad, broccoli","g"]],470,200,60,26)]},
 {say:t3("Maten innehåller olika näringsämnen. Kolhydrater och fett ger energi. Protein bygger muskler och celler. Vitaminer och mineraler håller kroppen frisk. Frukt och grönsaker är fulla av vitaminer.",
   "Food contains different nutrients. Carbohydrates and fat give energy. Protein builds muscles and cells. Vitamins and minerals keep the body healthy. Fruit and vegetables are full of vitamins.",
   "يحتوي الطعام على مواد غذائية مختلفة: النشويات والدهون تعطي الطاقة، والبروتين يبني العضلات والخلايا، والفيتامينات والمعادن تحافظ على صحة الجسم. والفواكه والخضار مليئة بالفيتامينات."),
  draw:()=>[A.wipe(),ttl("Näringsämnen"),...blist([["kolhydrater: energi","o"],["fett: energi och värme","o"],["protein: bygger muskler","r"],["vitaminer och mineraler: frisk kropp","g"]],140,170,66,32)]},
 {say:t3("Ungefär två tredjedelar av din kropp är vatten! Du förlorar vatten när du svettas, andas och kissar. Därför behöver du dricka varje dag. Vatten är den bästa drycken när du är törstig.",
   "About two thirds of your body is water! You lose water when you sweat, breathe and pee. So you need to drink every day. Water is the best drink when you are thirsty.",
   "نحو ثلثي جسمك ماء! تفقد الماء عندما تتعرّق وتتنفّس وتتبوّل، لذلك تحتاج أن تشرب كل يوم. والماء أفضل شراب عندما تعطش."),
  draw:()=>[A.wipe(),ttl("Vatten"),A.p("M230 120 L330 120 L320 420 L240 420 Z","k",4),A.hatch("M235 220 L325 220 L320 420 L240 420 Z","b"),A.tx("⅔ av kroppen",560,220,36,"b"),A.tx("är vatten",560,270,36,"b"),A.tx("drick varje dag",560,360,30,"g")]},
 {say:t3("Barn behöver röra sig minst en timme om dagen, gärna så att man blir andfådd. Då blir hjärtat, lungorna, musklerna och skelettet starkare. Rörelse gör också att man sover bättre och blir gladare.",
   "Children need to move at least an hour a day, ideally enough to get out of breath. Then the heart, lungs, muscles and skeleton get stronger. Exercise also helps you sleep better and feel happier.",
   "يحتاج الأطفال إلى الحركة ساعة يوميًا على الأقل، ويفضّل أن يلهثوا قليلًا. هكذا يقوى القلب والرئتان والعضلات والهيكل العظمي، والحركة تساعدك أيضًا على النوم بشكل أفضل وتجعلك أسعد."),
  draw:()=>[A.wipe(),ttl("Rörelse"),A.tx("minst 60 minuter",400,150,40,"g"),A.tx("varje dag",400,200,34,"g"),...blist([["starkare hjärta och lungor","r"],["starkare muskler och skelett","k"],["bättre sömn och humör","v"]],220,280,58,30)]},
 {say:t3("När du sover vilar kroppen och växer, och hjärnan sorterar minnen. Ett barn i din ålder behöver ungefär nio till elva timmars sömn varje natt. Lägg undan mobilen och plattan en stund innan du ska sova.",
   "While you sleep the body rests and grows, and the brain sorts memories. A child your age needs about nine to eleven hours of sleep every night. Put your phone and tablet away for a while before bedtime.",
   "أثناء النوم يرتاح الجسم وينمو، ويرتّب الدماغ الذكريات. يحتاج طفل في عمرك إلى نحو تسع إلى إحدى عشرة ساعة نوم كل ليلة. ضع الهاتف واللوح جانبًا قبل النوم بقليل."),
  draw:()=>[A.wipe(),ttl("Sömn"),A.p("M200 300 Q200 200 290 190 Q240 240 260 300 Q290 360 360 340 Q300 400 230 370 Q200 340 200 300Z","v",4),A.tx("9–11 timmar",560,230,40,"v"),A.tx("varje natt",560,280,32,"v"),A.tx("ingen skärm före sömnen",560,370,26,"o")]},
 {say:t3("Bakterier och virus kan göra oss sjuka. De sprids till exempel med händerna. Tvätta händerna med tvål innan du äter och efter toalettbesök. Borsta tänderna två gånger om dagen, så att bakterier inte ger dig hål i tänderna.",
   "Bacteria and viruses can make us ill. They spread, for example, on our hands. Wash your hands with soap before you eat and after the toilet. Brush your teeth twice a day so bacteria don't give you holes in your teeth.",
   "البكتيريا والفيروسات قد تُمرضنا، وتنتشر مثلًا عن طريق الأيدي. اغسل يديك بالصابون قبل الأكل وبعد الحمّام، واغسل أسنانك مرتين في اليوم حتى لا تسبّب البكتيريا تسوّسًا."),
  draw:()=>[A.wipe(),ttl("Renlighet"),...SENSE.hand(180,270,1.6),...[[150,180],[230,190],[260,250]].map(([x,y])=>A.p(R.loop(x,y,14,12),"g",3)),A.tx("tvätta händerna",180,400,30,"b"),
   tooth(560,250,1.4),A.tx("borsta tänderna",560,380,30,"b"),A.tx("2 gånger om dagen",560,420,26,"o")]},
 {say:t3("Att må bra handlar inte bara om kroppen. Det är också viktigt att ha vänner, att prata med någon när man är ledsen, och att vila från skärmar ibland. Kroppen och känslorna hänger ihop.",
   "Feeling good isn't only about the body. It is also important to have friends, to talk to someone when you are sad, and to take breaks from screens. The body and feelings are connected.",
   "الشعور الجيد لا يتعلّق بالجسم فقط. من المهم أيضًا أن يكون لديك أصدقاء، وأن تتحدّث مع أحد عندما تحزن، وأن ترتاح من الشاشات أحيانًا. فالجسم والمشاعر مرتبطان."),
  draw:()=>[A.wipe(),ttl("Må bra"),A.p(R.circ(300,260,70),"o",4),A.p("M270 240 l.1 0 M330 240 l.1 0","k",10),A.p("M262 286 Q300 316 338 286","k",4),...blist([["vänner","g"],["prata när du är ledsen","b"],["paus från skärmar","v"]],440,220,60,30)]},
 {say:t3("Kom ihåg de fyra sakerna för en frisk kropp: bra mat enligt tallriksmodellen, vatten, rörelse minst en timme om dagen och tillräckligt med sömn. Och tvätta händerna!",
   "Remember the four things for a healthy body: good food following the plate model, water, exercise at least an hour a day and enough sleep. And wash your hands!",
   "تذكّر الأشياء الأربعة لجسم صحي: طعام جيد حسب نموذج الصحن، والماء، والحركة ساعة يوميًا على الأقل، والنوم الكافي. واغسل يديك!"),
  draw:()=>[A.wipe(),ttl("Kom ihåg"),...blist([["mat: tallriksmodellen","g"],["vatten varje dag","b"],["rörelse: minst 1 timme","r"],["sömn: 9–11 timmar","v"],["tvätta händerna","o"]],200,150,60,32)]},
]};
const BANK7=[
 {lv:0,q:"Vad ska det finnas mest av på tallriken enligt tallriksmodellen?",a:"grönsaker",w:["godis","kött","pasta"]},
 {lv:0,q:"Vilken dryck är bäst när du är törstig?",a:"vatten",w:["läsk","saft","energidryck"]},
 {lv:0,q:"När ska du tvätta händerna?",a:"innan du äter",w:["bara på söndagar","aldrig","bara när det regnar"]},
 {lv:0,q:"Hur ofta ska du borsta tänderna?",a:"två gånger om dagen",w:["en gång i veckan","aldrig","tio gånger om dagen"]},
 {lv:1,q:"Hur länge bör barn röra sig varje dag?",a:"minst en timme",w:["fem minuter","en timme i veckan","inte alls"]},
 {lv:1,q:"Hur mycket sömn behöver ett barn i din ålder?",a:"9–11 timmar",w:["3–4 timmar","5–6 timmar","15–16 timmar"]},
 {lv:1,q:"Vad ger kolhydrater kroppen?",a:"energi",w:["syre","starka tänder","bättre syn"]},
 {lv:1,q:"Vilken mat innehåller mycket protein?",a:"fisk och ägg",w:["äpplen och päron","socker och godis","vatten och te"]},
 {lv:1,q:"Hur mycket av kroppen är vatten?",a:"ungefär två tredjedelar",w:["ingenting","en tiondel","allt"]},
 {lv:2,q:"Vad gör protein i kroppen?",a:"bygger muskler och celler",w:["ger syre","gör blodet blått","stoppar matspjälkningen"]},
 {lv:2,q:"Varför ska du tvätta händerna?",a:"för att få bort bakterier och virus",w:["för att bli starkare","för att växa","för att sova bättre"]},
 {lv:2,q:"Vad händer i hjärnan när du sover?",a:"den sorterar minnen",w:["den slutar fungera","den blir mindre","den pumpar blod"]},
 {lv:2,q:"Vad är bra med rörelse?",a:"hjärtat, lungorna och musklerna blir starkare",w:["man behöver inte sova","man slipper äta","skelettet blir svagare"]},
 {lv:2,q:"Vad ger vitaminer?",a:"en frisk kropp",w:["mer socker","mindre sömn","svagare ben"]},
 {lv:2,q:"Hur förlorar kroppen vatten?",a:"när du svettas, andas och kissar",w:["när du läser","när du sover bara","den förlorar aldrig vatten"]},
 {lv:1,q:"Skriv ordet: ett sätt att lägga upp maten med mest grönsaker heter …",a:["tallriksmodellen","tallriksmodell"],lines:["Skriv ordet som saknas:","Ett sätt att lägga upp maten","med mest grönsaker heter …"]},
 {lv:2,q:"Skriv ordet: näringsämnet som bygger muskler heter …",a:["protein","proteiner"],lines:["Skriv ordet som saknas:","Näringsämnet som bygger muskler heter …"]},
];
LESSONS.push({id:"no4g",subject:"science",grades:"4",kind:"wb",year:4,ord:7,
 title:t3("Ett friskt liv: mat, rörelse och sömn","A healthy life: food, exercise and sleep","حياة صحية: الطعام والحركة والنوم"),
 icon:`<svg viewBox="0 0 320 180"><rect width="320" height="180" fill="#fff"/><circle cx="130" cy="90" r="66" fill="none" stroke="#1d2433" stroke-width="3"/><path d="M130 30A60 60 0 0 0 130 150Z" fill="#cdeedb" stroke="#1e9e5a" stroke-width="3"/><path d="M130 90V30A60 60 0 0 1 190 90Z" fill="#fde6c8" stroke="#e07b00" stroke-width="3"/><path d="M130 90H190A60 60 0 0 1 130 150Z" fill="#f6c9c4" stroke="#d63b2f" stroke-width="3"/><path d="M240 40H290L284 150H246Z" fill="#dce6fb" stroke="#2257c9" stroke-width="3"/></svg>`,
 steps:BODY7.steps,mount:wbMount(BODY7),gen:bankGen(BANK7)});
WORDS.no4g=["no_tallriksmodellen","no_kolhydrater","no_protein","no_vitamin","no_bakterier"];

/* ---------------------------------------------------------------
   The chapter test: 21 questions, 3 from each lesson
   --------------------------------------------------------------- */
LESSONS.push({id:"prov4kropp",subject:"science",grades:"4",kind:"exam",year:4,ord:8,exam:{ids:["no4a","no4b","no4c","no4d","no4e","no4f","no4g"],n:21},steps:[],
 title:t3("Prov: Människokroppen","Test: The human body","اختبار: جسم الإنسان"),
 icon:`<svg viewBox="0 0 320 180"><rect width="320" height="180" fill="#fff"/><rect x="100" y="20" width="120" height="146" rx="8" fill="#fff" stroke="#1d2433" stroke-width="4"/><path d="M118 52H200M118 82H200M118 112H180" stroke="#9aa6bd" stroke-width="4"/><path d="M120 140L134 152L156 128" fill="none" stroke="#1e9e5a" stroke-width="6"/><path d="M230 40L270 140" stroke="#e07b00" stroke-width="10" stroke-linecap="round"/></svg>`});
}
