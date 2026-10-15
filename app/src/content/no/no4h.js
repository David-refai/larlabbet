import {IMG,place} from "./no-0art.js";
import {BRN,art,bankGen,blist,callout,dotsP,note,ntag,plant,soil,tfx,ttl} from "./no-0body.js";
import {A,LESSONS,R,TERM,WORDS,t3,wbMount} from "../../legacy/core.js";
/* ===== no4h.js: Biologi, Year 4, Djur, växter och ekosystem 1 and 2 =====
   1. bio4h: what is alive - the signs of life and what all life needs
   2. bio4i: plants - root, stem, leaf, flower, seed and simple photosynthesis */
{
const W=(s)=>new RegExp("(?<![a-zåäö])"+s+"(?![a-zåäö])","i");
TERM("no_levande",{sv:"levande",m:W("levande"),d:t3("Något som växer, behöver näring, andas och kan föröka sig.","Something that grows, needs food, breathes and can reproduce.","شيء ينمو ويحتاج إلى الغذاء ويتنفّس ويتكاثر."),ex:"Haren och björken är levande.",tr:{en:"living",ar:"حيّ"}});
TERM("no_icke_levande",{sv:"icke-levande",m:W("icke-levande"),d:t3("Något som inte växer, inte äter och inte förökar sig.","Something that does not grow, eat or reproduce.","شيء لا ينمو ولا يأكل ولا يتكاثر."),ex:"En sten är icke-levande.",tr:{en:"non-living",ar:"غير حيّ"}});
TERM("no_organism",{sv:"organism",m:W("organism(en|er|erna)?"),d:t3("Ett levande väsen: ett djur, en växt, en svamp eller en bakterie.","A living thing: an animal, a plant, a fungus or a bacterium.","كائن حيّ: حيوان أو نبات أو فطر أو بكتيريا."),ex:"En räv är en organism.",tr:{en:"organism",ar:"كائن حيّ"}});
TERM("no_forokning",{sv:"föröka sig",m:W("(föröka(r)? sig|förökning(en)?)"),d:t3("Att få ungar, lägga ägg eller sprida frön så att det blir nya individer.","To have young, lay eggs or spread seeds so there are new individuals.","أن يلد صغارًا أو يضع بيضًا أو ينشر بذورًا فتنشأ أفراد جديدة."),ex:"Växter förökar sig med frön.",tr:{en:"to reproduce",ar:"يتكاثر"}});
TERM("no_energi",{sv:"energi",m:W("energi(n)?"),d:t3("Det som behövs för att leva, växa och röra sig. Den kommer från näringen.","What is needed to live, grow and move. It comes from food.","ما يلزم للحياة والنمو والحركة، ويأتي من الغذاء."),ex:"Maten ger dig energi.",tr:{en:"energy",ar:"طاقة"}});
TERM("no_rot",{sv:"rot",m:W("rot(en|ter|terna)"),d:t3("Växtens del under jorden. Den håller fast växten och suger upp vatten.","The part of a plant under the ground. It holds the plant and takes up water.","جزء النبات تحت التربة، يثبّته ويمتصّ الماء."),ex:"Roten suger upp vatten.",tr:{en:"root",ar:"جذر"}});
TERM("no_stjalk",{sv:"stjälk / stam",m:W("(stjälk(en|ar|arna)?|stam(men)?)"),d:t3("Den del som håller upp växten och för vatten till bladen. Hos träd heter den stam.","The part that holds the plant up and carries water to the leaves. On a tree it is called the trunk.","الجزء الذي يحمل النبات وينقل الماء إلى الأوراق، ويسمّى في الشجرة جذعًا."),ex:"Granen har en rak stam.",tr:{en:"stem / trunk",ar:"ساق / جذع"}});
TERM("no_blad",{sv:"blad",m:W("blad(et|en)?"),d:t3("Växtens gröna del som fångar solljus och gör näring.","The green part of a plant that catches sunlight and makes food.","الجزء الأخضر من النبات الذي يلتقط ضوء الشمس ويصنع الغذاء."),ex:"Bladen är gröna.",tr:{en:"leaf",ar:"ورقة نبات"}});
TERM("no_blomma",{sv:"blomma",m:W("blomm(a|an|or|orna)"),d:t3("Den del av växten där fröna bildas.","The part of the plant where the seeds are made.","جزء النبات الذي تتكوّن فيه البذور."),ex:"Bina flyger till blomman.",tr:{en:"flower",ar:"زهرة"}});
TERM("no_fro",{sv:"frö",m:W("frö(et|n|na)?"),d:t3("En liten del som en ny växt kan växa upp ur.","A small part that a new plant can grow from.","جزء صغير يمكن أن ينمو منه نبات جديد."),ex:"Fröet gror i jorden.",tr:{en:"seed",ar:"بذرة"}});
TERM("no_fotosyntes",{sv:"fotosyntes",m:W("fotosyntes(en)?"),d:t3("När växten gör socker och syre av solljus, vatten och koldioxid.","When a plant makes sugar and oxygen from sunlight, water and carbon dioxide.","عندما يصنع النبات السكر والأكسجين من ضوء الشمس والماء وثاني أكسيد الكربون."),ex:"Fotosyntesen sker i bladen.",tr:{en:"photosynthesis",ar:"البناء الضوئي"}});
TERM("no_pollen",{sv:"pollen",m:W("pollen(et)?"),d:t3("Ett fint gult pulver i blomman. Det behövs för att frön ska bildas.","A fine yellow powder in a flower. It is needed for seeds to form.","مسحوق أصفر ناعم في الزهرة، يلزم لتكوين البذور."),ex:"Bina bär pollen.",tr:{en:"pollen",ar:"حبوب اللقاح"}});

/* ---------------------------------------------------------------
   1. bio4h: what is alive?
   --------------------------------------------------------------- */
/* wind lines for "luft" and a simple apple for "näring" */
const AIR="M-44 -16 Q0 -34 26 -16 Q40 -6 28 4 Q18 8 14 0 M-50 6 Q-4 -6 36 10 Q50 18 40 28 Q30 32 26 24 M-36 26 Q-10 20 6 28";
const APPLE="M0 -40 Q-30 -60 -48 -30 Q-60 10 -30 40 Q-14 50 0 40 Q14 50 30 40 Q60 10 48 -30 Q30 -60 0 -40 Z";
const apple=(x,y,s=1)=>[IMG("apple",x,y-6*s,0,{h:112*s})];
const NAT1={steps:[
 {say:t3("Titta ut i naturen: träd, blommor, djur, stenar och moln. En del av det lever och annat lever inte. I det här kapitlet lär vi oss hur djur och växter lever och hur allt i naturen hänger ihop.",
   "Look out at nature: trees, flowers, animals, stones and clouds. Some of it is alive and some is not. In this chapter we learn how animals and plants live and how everything in nature fits together.",
   "انظر إلى الطبيعة: أشجار وأزهار وحيوانات وحجارة وغيوم. بعضها حيّ وبعضها غير حيّ. في هذا الفصل نتعلّم كيف تعيش الحيوانات والنباتات وكيف يرتبط كل شيء في الطبيعة."),
  draw:()=>[A.wipe(),ttl("Djur, växter och ekosystem"),...soil(40,760,410),...art("sun",690,150,.75),...art("cloud",540,140,.9),...art("gran",110,410,1.15),...art("bjork",240,410,.95),
   ...art("fox",420,410,.85),...plant(590,410,.7),...art("stone",715,410,.75)]},
 {say:t3("Vi kan dela in naturen i två grupper. Djur, växter och svampar är levande. Stenar, vatten och moln är icke-levande. Ett levande väsen kallas en organism.",
   "We can split nature into two groups. Animals, plants and fungi are living. Stones, water and clouds are non-living. A living thing is called an organism.",
   "يمكننا تقسيم الطبيعة إلى مجموعتين: الحيوانات والنباتات والفطريات حيّة، والحجارة والماء والغيوم غير حيّة. والكائن الحيّ يسمّى عضوية أو كائنًا حيًّا."),
  draw:()=>[A.wipe(),A.band(30,90,360,330,"g"),A.band(410,90,360,330,"k"),A.tx("levande",210,140,40,"g"),A.tx("icke-levande",590,140,40,"k"),
   ...art("hare",105,320,.85),...art("bjork",215,330,.68),...art("svamp",320,320,.9),...art("stone",480,320,.8),...art("drop",590,320,1),...art("cloud",690,300,.75),
   ntag("hare",105,375),ntag("björk",215,375),ntag("svamp",320,375),ntag("sten",480,375),ntag("vatten",590,375),ntag("moln",690,375),note("levande väsen = organismer",470,"g",32)]},
 {say:t3("Det första kännetecknet: allt levande växer och utvecklas. Ett litet frö kan bli en stor björk, och en rävunge växer upp till en vuxen räv. En sten växer aldrig.",
   "The first sign: everything living grows and develops. A small seed can become a big birch, and a fox cub grows into an adult fox. A stone never grows.",
   "العلامة الأولى: كل كائن حيّ ينمو ويتطوّر. بذرة صغيرة قد تصبح شجرة بتولا كبيرة، وصغير الثعلب يكبر ليصبح ثعلبًا بالغًا. أما الحجر فلا ينمو أبدًا."),
  draw:()=>[A.wipe(),ttl("1. Växer och utvecklas"),...soil(40,760,240),...art("seed",100,234,1.3),A.arrow(140,215,195,215,"k"),...art("sprout",250,240,1.3),A.arrow(300,215,375,215,"k"),
   ...art("bjork",440,240,.5),A.arrow(510,215,575,215,"k"),...art("bjork",650,240,.82),ntag("frö",100,280),ntag("grodd",250,280),ntag("ung björk",440,280),ntag("stor björk",650,280),
   ...soil(120,680,420),...art("cub",230,420,.7),A.arrow(300,395,370,395,"k"),...art("fox",500,420,.9),ntag("rävunge",230,458),ntag("vuxen räv",500,458)]},
 {say:t3("Allt levande behöver näring för att få energi. Växter gör sin egen näring med hjälp av solljuset. Djur måste äta, till exempel äter haren gräs. Utan energi kan ingen organism leva.",
   "Everything living needs food to get energy. Plants make their own food with the help of sunlight. Animals must eat, for example the hare eats grass. Without energy no organism can live.",
   "كل كائن حيّ يحتاج إلى الغذاء ليحصل على الطاقة. النباتات تصنع غذاءها بمساعدة ضوء الشمس، والحيوانات يجب أن تأكل، فالأرنب البري مثلًا يأكل العشب. بلا طاقة لا يعيش أي كائن."),
  draw:()=>[A.wipe(),ttl("2. Behöver näring"),...art("sun",100,170,.7),...soil(40,370,400),...plant(250,400,.8),A.flow("M140 200 Q170 290 200 355","o",6,2.6,6),
   A.p(R.line(400,110,400,440,.3),"#c7cfdc",2),...soil(430,760,400),...art("grass",520,400,1.2),...art("hare",650,400,1.1,-1),A.flow("M560 360 Q585 330 605 345","g",3,1.6,5),
   ntag("växten gör egen näring",200,480,"g"),ntag("haren äter gräs",600,470,"o")]},
 {say:t3("Allt levande andas. Djur och människor andas in syre. Fisken tar syret ur vattnet med sina gälar. Även växter andas, genom små hål på bladens undersida.",
   "Everything living breathes. Animals and people breathe in oxygen. A fish takes oxygen from the water with its gills. Plants breathe too, through tiny holes under their leaves.",
   "كل كائن حيّ يتنفّس. الحيوانات والناس يستنشقون الأكسجين، والسمكة تأخذ الأكسجين من الماء بخياشيمها، وحتى النباتات تتنفّس عبر ثقوب صغيرة تحت أوراقها."),
  draw:()=>[A.wipe(),ttl("3. Andas"),A.band(40,110,340,300,"b"),A.p("M40 130 Q120 118 210 130 Q300 142 380 130","b",3),...art("perch",200,290,1),
   A.flow("M350 268 L288 288 L252 292 Q244 310 246 340","#3fa7c9",6,3,6),A.tx("vatten in",330,240,26,"b"),A.p(R.line(240,330,215,365,.3),"g",2.5),A.tx("gälar",200,390,30,"g"),
   ...art("leaf",590,280,2.5),A.p(dotsP([[520,280],[560,300],[600,270],[640,290],[680,276]]),"k",5),A.flow("M600 300 Q620 360 700 390","#3fa7c9",4,3,6),A.flow("M560 300 Q520 360 470 380","#3fa7c9",4,3.4,6),
   A.tx("små hål i bladet",590,440,30,"g"),note("allt levande andas",480,"b",30)]},
 {say:t3("Allt levande förökar sig, alltså gör nya individer av samma slag. Djur får ungar eller lägger ägg. Växter sprider frön som kan bli nya växter. Utan förökning skulle arten dö ut.",
   "Everything living reproduces, that is, makes new individuals of the same kind. Animals have young or lay eggs. Plants spread seeds that can become new plants. Without reproducing, the species would die out.",
   "كل كائن حيّ يتكاثر، أي ينتج أفرادًا جددًا من النوع نفسه. الحيوانات تلد صغارًا أو تضع بيضًا، والنباتات تنشر بذورًا تصبح نباتات جديدة. ولولا التكاثر لانقرض النوع."),
  draw:()=>[A.wipe(),ttl("4. Förökar sig"),...soil(40,380,400),...art("fox",210,320,.85),...art("cub",120,400,.7,-1),...art("cub",300,400,.7),
   A.p(R.line(400,110,400,440,.3),"#c7cfdc",2),...soil(430,760,400),...plant(560,400,.85),A.flow("M580 260 Q660 280 700 395","o",5,3.4,5),...art("seed",700,398,.7),...art("sprout",740,400,.7),
   ntag("räven får ungar",210,478,"o"),ntag("växten sprider frön",600,478,"g")]},
 {say:t3("Vad behöver allt liv? Ljus från solen, vatten, luft med syre, näring och en plats att leva på. Om något av detta saknas kan djur och växter inte överleva.",
   "What does all life need? Light from the sun, water, air with oxygen, food, and a place to live. If any of these is missing, animals and plants cannot survive.",
   "ماذا تحتاج كل الحياة؟ ضوء الشمس والماء والهواء بما فيه من أكسجين والغذاء ومكانًا تعيش فيه. إذا غاب شيء من هذا لا تستطيع الحيوانات والنباتات البقاء."),
  draw:()=>[A.wipe(),ttl("Det här behöver allt liv"),...art("sun",100,240,.68),...art("drop",250,280,1.25),A.p(tfx(AIR,400,250,1.2),"#3fa7c9",4),...apple(550,250,.9),...art("gran",700,310,.75),
   A.tx("ljus",100,370,34,"o"),A.tx("vatten",250,370,34,"b"),A.tx("luft",400,370,34,"#3fa7c9"),A.tx("näring",550,370,34,"r"),A.tx("plats",700,370,34,"g"),
   A.tx("solen",100,410,24),A.tx("regn, sjöar",250,410,24),A.tx("syre",400,410,24),A.tx("mat",550,410,24),A.tx("ett hem",700,410,24)]},
 {say:t3("Kom ihåg: en organism är levande om den växer, behöver näring, andas och förökar sig. Allt liv behöver ljus, vatten, luft, näring och plats.",
   "Remember: an organism is alive if it grows, needs food, breathes and reproduces. All life needs light, water, air, food and space.",
   "تذكّر: الكائن حيّ إذا كان ينمو ويحتاج إلى الغذاء ويتنفّس ويتكاثر. وكل حياة تحتاج إلى الضوء والماء والهواء والغذاء والمكان."),
  draw:()=>[A.wipe(),ttl("Kom ihåg"),A.tx("Levande organismer …",110,140,32,"k","start"),...blist([["växer och utvecklas","g"],["behöver näring och energi","o"],["andas","b"],["förökar sig","p"]],140,200,56,32),
   ...art("hare",650,330,1.15),note("Allt liv behöver ljus, vatten, luft, näring och plats.",450,"b",28)]},
]};
/* a small picture for each sign of life, for the questions */
const SIGN={
 grow:()=>[...soil(30,380,330),...art("seed",70,325,1),A.arrow(95,310,140,310,"k"),...art("sprout",175,330,1),A.arrow(205,310,250,310,"k"),...art("bjork",315,330,.6)],
 food:()=>[...soil(40,370,330),...art("grass",140,330,1.3),...art("hare",270,330,1.15,-1)],
 breathe:()=>[A.band(30,120,350,260,"b"),...art("perch",190,260,.95),A.flow("M275 250 Q295 200 282 140","#3fa7c9",5,3,6)],
 young:()=>[...soil(40,370,340),...art("fox",200,280,.8),...art("cub",110,340,.7,-1),...art("cub",290,340,.7)],
};
/* is it living? a picture on the left */
const PIC={hare:()=>[...soil(60,340,330),...art("hare",200,330,1.5)],stone:()=>[...soil(60,340,330),...art("stone",200,330,1.6)],svamp:()=>[...soil(60,340,340),...art("svamp",200,340,1.6)],
 cloud:()=>art("cloud",200,250,1.8),bjork:()=>[...soil(60,340,370),...art("bjork",200,370,1.4)]};
const LV=["levande","icke-levande","både och","går inte att säga"];
const BANK1=[
 {lv:0,q:"Vilken av dessa är levande?",a:"en hare",w:["en sten","ett moln","en vattendroppe"]},
 {lv:0,q:"Vilken av dessa är icke-levande?",a:"en sten",w:["en svamp","en björk","en räv"]},
 {lv:0,q:"Vad kallas ett levande väsen?",a:"en organism",w:["en mineral","en planet","en maskin"]},
 {lv:0,q:"Är det levande eller icke-levande?",a:LV[0],w:LV.slice(1),lines:["Är det här","levande eller","icke-levande?"],pic:PIC.hare},
 {lv:0,q:"Är det levande eller icke-levande?",a:LV[1],w:[LV[0],LV[2],LV[3]],lines:["Är det här","levande eller","icke-levande?"],pic:PIC.stone},
 {lv:1,q:"Är svampen levande eller icke-levande?",a:LV[0],w:LV.slice(1),lines:["Är svampen","levande eller","icke-levande?"],pic:PIC.svamp},
 {lv:1,q:"Är molnet levande eller icke-levande?",a:LV[1],w:[LV[0],LV[2],LV[3]],lines:["Är molnet","levande eller","icke-levande?"],pic:PIC.cloud},
 {lv:1,q:"Vilket kännetecken på liv visar bilden?",a:"växer",w:["förökar sig","andas","behöver näring"],lines:["Vilket kännetecken","på liv visar bilden?"],pic:SIGN.grow},
 {lv:1,q:"Vilket kännetecken på liv visar bilden?",a:"förökar sig",w:["växer","andas","behöver näring"],lines:["Vilket kännetecken","på liv visar bilden?"],pic:SIGN.young},
 {lv:1,q:"Vilket kännetecken på liv visar bilden?",a:"andas",w:["växer","förökar sig","behöver näring"],lines:["Vilket kännetecken","på liv visar bilden?"],pic:SIGN.breathe},
 {lv:1,q:"Hur får växter sin näring?",a:"de gör den själva med solljus",w:["de äter små djur","de äter sten","de behöver ingen näring"]},
 {lv:1,q:"Hur andas fisken?",a:"med gälarna",w:["med bladen","med rötterna","den andas inte"]},
 {lv:2,q:"Vad betyder att en organism förökar sig?",a:"den gör nya individer av samma slag",w:["den blir större","den äter mycket","den sover på vintern"]},
 {lv:2,q:"Varför behöver allt levande näring?",a:"för att få energi",w:["för att bli tyngre","för att kunna simma","för att få färg"]},
 {lv:2,q:"Vilket av dessa behöver INTE allt liv?",a:"godis",w:["vatten","ljus","luft"]},
 {lv:2,q:"Vilket kännetecken på liv visar bilden?",a:"behöver näring",w:["växer","förökar sig","andas"],lines:["Vilket kännetecken","på liv visar bilden?"],pic:SIGN.food},
 {lv:1,q:"Skriv ordet: ett levande väsen kallas en …",a:["organism","organismen"],lines:["Skriv ordet som saknas:","Ett levande väsen kallas en …"]},
 {lv:2,q:"Skriv ordet: en sten är inte levande, den är …",a:["icke-levande","icke levande","ickelevande","död"],lines:["Skriv ordet som saknas:","En sten är inte levande, den är …"]},
];
LESSONS.push({id:"bio4h",subject:"science",grades:"4",kind:"wb",year:4,ord:9,
 title:t3("Vad är levande?","What is alive?","ما هو الحيّ؟"),
 icon:`<svg viewBox="0 0 320 180"><rect width="320" height="180" fill="#fff"/><circle cx="60" cy="50" r="22" fill="#fde6c8" stroke="#e07b00" stroke-width="3"/><path d="M60 18V8M60 92V82M28 50H18M102 50H92M38 28L31 21M82 28L89 21" stroke="#e07b00" stroke-width="3"/><path d="M150 150Q152 110 150 80" stroke="#1e9e5a" stroke-width="4" fill="none"/><path d="M150 112Q120 92 108 110Q126 124 150 112ZM151 96Q182 76 194 94Q176 108 151 96Z" fill="#dff3e6" stroke="#1e9e5a" stroke-width="3"/><circle cx="150" cy="68" r="14" fill="#f5d0e0" stroke="#c2417a" stroke-width="3"/><path d="M220 150Q216 126 240 118Q266 110 290 124Q300 138 296 150Z" fill="#e3e6ec" stroke="#1d2433" stroke-width="3"/><path d="M20 150H300" stroke="#8a5a2b" stroke-width="3"/></svg>`,
 steps:NAT1.steps,mount:wbMount(NAT1),gen:bankGen(BANK1)});
WORDS.bio4h=["no_levande","no_icke_levande","no_organism","no_forokning","no_energi"];

/* ---------------------------------------------------------------
   2. bio4i: plants and photosynthesis
   --------------------------------------------------------------- */
/* where each part of the plant is in its own box, for pointers */
const PART={blomma:[0,-150],blad:[40,-66],stjalk:[2,-26],rot:[0,34]};
const partLabel=(x0,y0,s,k,text,ty,tx,c)=>{const [px,py]=PART[k],X=x0+px*s,Y=y0+py*s;
  return[A.p(R.line(X+(k==="blomma"?40*s:6),Y,tx-10,ty-9,.3),c,2.5),A.p(R.circ(X+(k==="blomma"?40*s:6),Y,4),c,3),A.tx(text,tx,ty,34,c,"start")]};
/* a plant with an arrow at one part: "what is this part called?" */
const pointPart=(k)=>{const x0=190,y0=330,s=1.05,[px,py]=PART[k],X=x0+px*s+(k==="blomma"?38:k==="blad"?40:8),Y=y0+py*s;
  return[...soil(50,350,y0),...plant(x0,y0,s),A.p(R.arrow(X+90,Y-50,X+8,Y-4,-16),"r",4.5),A.tx("?",X+104,Y-54,48,"r")]};
const CARROT="M-22 -56 Q0 -66 22 -56 L3 64 Q0 70 -3 64 Z M-14 -30 L-6 -28 M8 -12 L16 -14 M-10 10 L-2 12 M4 32 L9 30";
const POTATO="M-52 -6 Q-56 -36 -20 -38 Q20 -46 46 -26 Q62 -6 48 18 Q30 38 -10 34 Q-50 32 -52 -6 Z";
const NAT2={steps:[
 {say:t3("En växt har flera delar som har olika jobb: roten, stjälken, bladen och blomman. Tillsammans gör de att växten kan leva, växa och föröka sig.",
   "A plant has several parts with different jobs: the root, the stem, the leaves and the flower. Together they let the plant live, grow and reproduce.",
   "للنبات عدة أجزاء لكل منها مهمة: الجذر والساق والأوراق والزهرة. معًا تجعل النبات يعيش وينمو ويتكاثر."),
  draw:()=>[A.wipe(),A.tx("Växtens delar",600,100,44,"b"),...soil(40,420,370),...plant(250,370,1.35),
   ...partLabel(250,370,1.35,"blomma","blomma",180,480,"p"),...partLabel(250,370,1.35,"blad","blad",260,480,"g"),...partLabel(250,370,1.35,"stjalk","stjälk",335,480,"g"),...partLabel(250,370,1.35,"rot","rot",420,480,BRN)]},
 {say:t3("Roten växer ner i jorden. Den håller fast växten så att den inte blåser omkull, och den suger upp vatten och näringsämnen ur jorden. Vattnet åker sedan upp genom växten.",
   "The root grows down into the soil. It holds the plant so it does not blow over, and it takes up water and nutrients from the soil. The water then travels up through the plant.",
   "ينمو الجذر داخل التربة. يثبّت النبات فلا تُسقطه الريح، ويمتصّ الماء والمواد الغذائية من التربة، ثم يصعد الماء في النبات."),
  draw:()=>[A.wipe(),ttl("Roten"),A.band(40,330,380,150,"o"),...soil(40,420,330),...plant(230,330,1.25),A.loop(230,372,52,40,"r"),
   ...[[90,400],[130,450],[340,410],[380,455],[160,420]].flatMap(([x,y])=>art("drop",x,y,.3)),A.flow("M215 372 L229 340 L230 330 Q238 255 230 160","b",7,3.4,6),
   A.tx("roten …",480,190,36,BRN,"start"),...blist([["håller fast växten",BRN],["suger upp vatten","b"],["tar upp näring ur jorden","o"]],490,250,52,30)]},
 {say:t3("Stjälken håller upp bladen och blomman mot ljuset. Inuti finns tunna rör som för vattnet upp till bladen, ungefär som sugrör. Hos ett träd kallas stjälken för stam.",
   "The stem holds the leaves and flower up towards the light. Inside are thin tubes that carry water up to the leaves, a bit like straws. On a tree the stem is called the trunk.",
   "الساق ترفع الأوراق والزهرة نحو الضوء. وفي داخلها أنابيب رفيعة تنقل الماء إلى الأوراق مثل المصّاصات. وفي الشجرة تسمّى الساق جذعًا."),
  draw:()=>[A.wipe(),ttl("Stjälken"),...soil(40,330,400),...plant(180,400,1.2),A.p(R.circ(183,320,22),"r",3),A.p(R.line(205,316,440,180,.3),"r",2),A.p(R.line(205,330,440,420,.3),"r",2),
   A.p(R.rect(440,150,110,290,.3),"g",4),A.p("M470 152 L470 438 M495 152 L495 438 M520 152 L520 438","#3fa7c9",3),
   A.flow("M470 436 L470 156","b",5,2.6,6),A.flow("M495 436 L495 156","b",5,3,6),A.flow("M520 436 L520 156","b",5,2.8,6),
   A.tx("tunna rör",580,210,32,"b","start"),A.tx("vattnet åker upp",580,270,30,"k","start"),A.tx("som i ett sugrör",580,310,30,"k","start"),A.tx("träd: stam",580,410,32,BRN,"start")]},
 {say:t3("Bladen är växtens matfabrik. De är gröna av ett ämne som heter klorofyll, och klorofyllet fångar solljuset. Bladen är platta och breda för att fånga så mycket ljus som möjligt.",
   "The leaves are the plant's food factory. They are green because of a substance called chlorophyll, which catches the sunlight. Leaves are flat and wide to catch as much light as possible.",
   "الأوراق هي مصنع غذاء النبات. لونها أخضر بسبب مادة اسمها اليخضور، وهي تلتقط ضوء الشمس. والأوراق مسطّحة وعريضة لتلتقط أكبر قدر من الضوء."),
  draw:()=>[A.wipe(),ttl("Bladen"),...art("sun",100,180,.8),...art("leaf",480,256,2.5),A.flow("M150 200 Q300 200 420 260","o",6,2.4,6),A.flow("M140 240 Q260 300 380 300","o",6,2.8,6),
   A.tx("matfabrik",480,400,40,"g"),A.tx("klorofyll gör bladet grönt",480,450,30,"g")]},
 {say:t3("Nu zoomar vi in i ett blad! Bladet är byggt av små celler, precis som du. Men växtceller har en hård cellvägg och massor av gröna korn som heter kloroplaster. Där sker fotosyntesen.",
  "Let's zoom into a leaf! The leaf is built of tiny cells, just like you. But plant cells have a hard cell wall and lots of green grains called chloroplasts. That is where photosynthesis happens.",
  "لندخل إلى ورقة! الورقة مبنية من خلايا صغيرة مثلك تمامًا. لكن للخلايا النباتية جدار خلوي صلب وحبيبات خضراء كثيرة اسمها البلاستيدات الخضراء، وفيها يحدث البناء الضوئي."),
  draw:()=>{const T=place("tree-birch",400,262,0,{h:440}),[lx,ly]=T.at(244,92),C=place("cell-plant",300,276,0,{h:360,grow:true});
   return[A.wipe(),T.art,A.zoom(lx,ly,120),IMG("nat-leaf",lx,ly,0,{h:40}),A.zoom(lx,ly,60,1),IMG("leaf-cells-patch",lx,ly,20),A.zoom(lx,ly,26,1.2),A.wipe(),C.art,ttl("Inuti ett blad"),
   ...callout(C.at(330,128),480,160,"kloroplaster","g"),A.tx("gör socker",488,194,24,"g","start"),
   ...callout(C.at(368,300),480,330,"cellvägg","k"),...callout(C.at(250,150),140,240,"cellkärna","v",28)]}},
{say:t3("I bladen sker fotosyntesen. Växten tar solljus, vatten från roten och koldioxid från luften. Av det gör den socker, som är växtens näring, och syre, som släpps ut i luften.",
   "Photosynthesis happens in the leaves. The plant takes sunlight, water from the root and carbon dioxide from the air. From them it makes sugar, which is the plant's food, and oxygen, which goes out into the air.",
   "يحدث البناء الضوئي في الأوراق. يأخذ النبات ضوء الشمس والماء من الجذر وثاني أكسيد الكربون من الهواء، ويصنع منها السكر، وهو غذاء النبات، والأكسجين الذي يخرج إلى الهواء."),
  draw:()=>[A.wipe(),ttl("Fotosyntes"),...art("leaf",400,265,2.2),...art("sun",95,150,.62),A.tx("solljus",95,245,30,"o"),A.flow("M150 165 Q250 180 330 240","o",5,2.4,6),
   A.tx("koldioxid",120,330,30,"k"),A.flow("M190 312 Q250 290 300 278","#7d8ca6",4,2.6,6),A.tx("vatten",250,410,30,"b"),A.flow("M290 390 Q330 340 370 290","b",4,2.6,6),
   A.tx("syre",690,170,34,"#3fa7c9"),A.flow("M500 240 Q580 190 650 170","#3fa7c9",5,2.6,6),A.tx("socker",690,350,34,"p"),A.flow("M500 290 Q580 320 640 340","p",4,2.8,6),A.tx("= näring",690,385,24,"p"),
   note("solljus + vatten + koldioxid → socker + syre",470,"g",28)]},
 {say:t3("Växten använder sockret för att få energi och växa. Det som blir över sparas, till exempel i rötter, knölar och frukter. När du äter en morot, en potatis eller ett äpple äter du växtens sparade näring!",
   "The plant uses the sugar to get energy and grow. What is left over is stored, for example in roots, tubers and fruits. When you eat a carrot, a potato or an apple, you eat the plant's stored food!",
   "يستخدم النبات السكر ليحصل على الطاقة وينمو، ويخزّن ما يزيد، مثلًا في الجذور والدرنات والثمار. عندما تأكل جزرة أو بطاطس أو تفاحة فأنت تأكل الغذاء الذي خزّنه النبات!"),
  draw:()=>[A.wipe(),ttl("Växtens sparade näring"),A.hatch(tfx(CARROT,150,270,1.2),"o"),A.p(tfx(CARROT,150,270,1.2),"o",4),A.p(tfx("M-6 -66 L-18 -102 M0 -68 L0 -108 M6 -66 L18 -102",150,270,1.2),"g",4),
   A.hatch(tfx(POTATO,400,280,1.3),"o"),A.p(tfx(POTATO,400,280,1.3),BRN,4),A.p(dotsP([[370,270],[410,256],[440,292],[390,300]]),BRN,6),...apple(650,280,1.25),
   A.tx("morot",150,400,32,"o"),A.tx("en rot",150,436,26),A.tx("potatis",400,400,32,BRN),A.tx("en knöl",400,436,26),A.tx("äpple",650,400,32,"r"),A.tx("en frukt",650,436,26)]},
 {say:t3("Blomman hjälper växten att föröka sig. Bin och humlor flyger mellan blommorna och för pollen från blomma till blomma. Då kan det bildas frön, som sprids och blir nya växter.",
   "The flower helps the plant reproduce. Bees and bumblebees fly between the flowers and carry pollen from flower to flower. Then seeds can form, which spread and become new plants.",
   "الزهرة تساعد النبات على التكاثر. يطير النحل والطنّان بين الأزهار وينقل حبوب اللقاح من زهرة إلى أخرى، فتتكوّن البذور التي تنتشر وتصبح نباتات جديدة."),
  draw:()=>[A.wipe(),ttl("Blomman och fröet"),...soil(40,760,410),...plant(160,410,.95,"p"),...plant(600,410,.95,"v"),A.flow("M195 255 Q380 110 565 255","o",8,3.4,5),
   ...art("bee",380,180,1.4),A.tx("pollen",380,300,32,"o"),...art("seed",710,404,.7),...art("seed",745,406,.6),...art("sprout",300,410,.9),A.tx("frö → ny växt",300,482,28,"g")]},
 {say:t3("Utan växter skulle vi inte kunna leva. Växterna ger oss syret vi andas. Alla näringskedjor börjar med växter, så de ger mat åt djur och människor. De ger också djuren hem, och oss virke och papper.",
   "Without plants we could not live. Plants give us the oxygen we breathe. All food chains start with plants, so they give food to animals and people. They also give animals a home, and give us wood and paper.",
   "بدون النباتات لا نستطيع أن نعيش. النباتات تعطينا الأكسجين الذي نتنفّسه، وكل السلاسل الغذائية تبدأ بالنباتات فهي تطعم الحيوانات والناس، وتعطي الحيوانات مأوى وتعطينا الخشب والورق."),
  draw:()=>[A.wipe(),ttl("Därför är växterna viktiga"),...blist([["ger syret vi andas","b"],["ger mat åt djur och människor","o"],["ger hem och skydd åt djur","g"],["ger virke och papper",BRN]],80,170,66,32),
   ...soil(600,760,440),...art("gran",680,440,1.2),A.flow("M690 230 Q730 170 690 110","#3fa7c9",4,3,6),A.tx("syre",735,140,28,"#3fa7c9","start")]},
]};
const BANK2=[
 {lv:0,q:"Vilken del av växten finns under jorden?",a:"roten",w:["blomman","bladet","stjälken"]},
 {lv:0,q:"Vilken färg har bladen oftast?",a:"gröna",w:["blå","svarta","vita"]},
 {lv:0,q:"Vad behöver växten från solen?",a:"ljus",w:["mat","vatten","jord"]},
 {lv:0,q:"Vad heter delen som pilen visar?",a:"roten",w:["bladet","blomman","stjälken"],lines:["Vad heter delen","som pilen visar?"],pic:()=>pointPart("rot")},
 {lv:0,q:"Vad heter delen som pilen visar?",a:"blomman",w:["roten","bladet","stjälken"],lines:["Vad heter delen","som pilen visar?"],pic:()=>pointPart("blomma")},
 {lv:1,q:"Vad heter delen som pilen visar?",a:"bladet",w:["roten","blomman","stjälken"],lines:["Vad heter delen","som pilen visar?"],pic:()=>pointPart("blad")},
 {lv:1,q:"Vad heter delen som pilen visar?",a:"stjälken",w:["roten","blomman","bladet"],lines:["Vad heter delen","som pilen visar?"],pic:()=>pointPart("stjalk")},
 {lv:1,q:"Vad gör roten?",a:"suger upp vatten och håller fast växten",w:["fångar solljus","gör frön","lockar till sig bin"]},
 {lv:1,q:"Var sker fotosyntesen?",a:"i bladen",w:["i roten","i jorden","i fröet"]},
 {lv:1,q:"Vad kallas stjälken hos ett träd?",a:"stam",w:["rot","kvist","blad"]},
 {lv:1,q:"Vem för pollen mellan blommorna?",a:"bin och humlor",w:["maskar","fiskar","stenar"]},
 {lv:1,q:"Vilket ämne gör bladen gröna?",a:"klorofyll",w:["socker","syre","pollen"]},
 {lv:2,q:"Vad behöver växten till fotosyntesen?",a:"solljus, vatten och koldioxid",w:["socker, syre och jord","mjölk, ljus och salt","syre, socker och sand"]},
 {lv:2,q:"Vad gör växten i fotosyntesen?",a:"socker och syre",w:["vatten och jord","koldioxid och salt","sten och sand"]},
 {lv:2,q:"Vad äter du när du äter en potatis?",a:"växtens sparade näring",w:["växtens frön","växtens pollen","växtens blomma"]},
 {lv:2,q:"Varför är växter viktiga för oss?",a:"de ger syre och mat",w:["de gör luften varmare","de äter koldioxid ur vattnet","de gör jorden hård"]},
 {lv:1,q:"Skriv ordet: en ny växt kan växa upp ur ett …",a:["frö","fröet"],lines:["Skriv ordet som saknas:","En ny växt kan växa upp ur ett …"]},
 {lv:2,q:"Skriv ordet: när växten gör socker av solljus heter det …",a:["fotosyntes","fotosyntesen"],lines:["Skriv ordet som saknas:","När växten gör socker och syre","av solljus heter det …"]},
];
LESSONS.push({id:"bio4i",subject:"science",grades:"4",kind:"wb",year:4,ord:10,
 title:t3("Växter och fotosyntes","Plants and photosynthesis","النباتات والبناء الضوئي"),
 icon:`<svg viewBox="0 0 320 180"><rect width="320" height="180" fill="#fff"/><circle cx="270" cy="40" r="20" fill="#fde6c8" stroke="#e07b00" stroke-width="3"/><path d="M40 130H260" stroke="#8a5a2b" stroke-width="3"/><path d="M150 130Q156 90 150 50M150 130V152M150 138L132 156M150 140L168 158" stroke="#1e9e5a" stroke-width="4" fill="none"/><path d="M150 100Q116 80 92 98Q118 116 150 100ZM152 80Q186 60 212 78Q186 96 152 80Z" fill="#dff3e6" stroke="#1e9e5a" stroke-width="3"/><circle cx="150" cy="40" r="16" fill="#f5d0e0" stroke="#c2417a" stroke-width="3"/><circle cx="150" cy="40" r="6" fill="#e07b00"/><path d="M240 62L210 84" stroke="#e07b00" stroke-width="3" stroke-dasharray="5 5"/></svg>`,
 steps:NAT2.steps,mount:wbMount(NAT2),gen:bankGen(BANK2)});
WORDS.bio4i=["no_rot","no_stjalk","no_blad","no_blomma","no_fro","no_fotosyntes","no_pollen"];
}
