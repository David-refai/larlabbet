import {BRN,art,bankGen,blist,dotsP,note,soil,tfx,ttl} from "./no-0body.js";
import {A,LESSONS,R,TERM,WORDS,shuffle,t3,wbMount} from "../../legacy/core.js";
/* ===== no4j.js: Biologi, Year 4, Djur, växter och ekosystem 3 and 4 =====
   3. bio4j: food chains and food webs - producers, consumers, predators and prey
   4. bio4k: ecosystems in Sweden - the forest and the lake, common species, adaptations */
{
const W=(s)=>new RegExp("(?<![a-zåäö])"+s+"(?![a-zåäö])","i");
TERM("no_naringskedja",{sv:"näringskedja",m:W("näringskedj(a|an|or|orna)"),d:t3("En rad som visar vem som äter vem, till exempel gräs → hare → räv.","A row that shows who eats whom, for example grass → hare → fox.","سلسلة تبيّن من يأكل من، مثل العشب ← الأرنب ← الثعلب."),ex:"Alla näringskedjor börjar med en växt.",tr:{en:"food chain",ar:"سلسلة غذائية"}});
TERM("no_naringsvav",{sv:"näringsväv",m:W("näringsväv(en|ar|arna)?"),d:t3("Många näringskedjor som hänger ihop med varandra.","Many food chains linked together.","سلاسل غذائية كثيرة مترابطة."),ex:"Skogens näringsväv",tr:{en:"food web",ar:"شبكة غذائية"}});
TERM("no_producent",{sv:"producent",m:W("producent(en|er|erna)?"),d:t3("En organism som gör sin egen näring med solljus, alltså en växt.","A living thing that makes its own food with sunlight: a plant.","كائن يصنع غذاءه بنفسه بضوء الشمس، أي النبات."),ex:"Gräset är en producent.",tr:{en:"producer",ar:"منتِج"}});
TERM("no_konsument",{sv:"konsument",m:W("konsument(en|er|erna)?"),d:t3("En organism som måste äta andra organismer, till exempel ett djur.","A living thing that must eat other living things, for example an animal.","كائن يجب أن يأكل كائنات أخرى، مثل الحيوان."),ex:"Haren är en konsument.",tr:{en:"consumer",ar:"مستهلِك"}});
TERM("no_vaxtatare",{sv:"växtätare",m:W("växtätar(e|en|na)"),d:t3("Ett djur som bara äter växter.","An animal that only eats plants.","حيوان يأكل النباتات فقط."),ex:"Älgen är en växtätare.",tr:{en:"herbivore",ar:"آكل الأعشاب"}});
TERM("no_kottatare",{sv:"köttätare",m:W("köttätar(e|en|na)"),d:t3("Ett djur som äter andra djur.","An animal that eats other animals.","حيوان يأكل حيوانات أخرى."),ex:"Gäddan är en köttätare.",tr:{en:"carnivore",ar:"آكل اللحوم"}});
TERM("no_allatare",{sv:"allätare",m:W("allätar(e|en|na)"),d:t3("Ett djur som äter både växter och djur.","An animal that eats both plants and animals.","حيوان يأكل النباتات والحيوانات معًا."),ex:"Björnen är en allätare.",tr:{en:"omnivore",ar:"آكل كل شيء"}});
TERM("no_rovdjur",{sv:"rovdjur / byte",m:W("(rovdjur(et|en)?|byte(t|n|na)?)"),d:t3("Ett rovdjur jagar och äter andra djur. Djuret som blir uppätet kallas byte.","A predator hunts and eats other animals. The animal that is eaten is called prey.","المفترس يصطاد حيوانات أخرى ويأكلها، والحيوان الذي يُؤكل يسمّى فريسة."),ex:"Räven är rovdjur, haren är byte.",tr:{en:"predator / prey",ar:"مفترس / فريسة"}});
TERM("no_ekosystem",{sv:"ekosystem",m:W("ekosystem(et|en)?"),d:t3("Ett område i naturen där växter, djur och det icke-levande hänger ihop, till exempel en skog eller en sjö.","An area of nature where plants, animals and non-living things are linked, for example a forest or a lake.","منطقة في الطبيعة ترتبط فيها النباتات والحيوانات والأشياء غير الحية، مثل غابة أو بحيرة."),ex:"Sjön är ett ekosystem.",tr:{en:"ecosystem",ar:"نظام بيئي"}});
TERM("no_art",{sv:"art",m:W("art(en|er|erna)"),d:t3("En sort av djur eller växt, till exempel räv eller björk.","A kind of animal or plant, for example fox or birch.","نوع من الحيوان أو النبات، مثل الثعلب أو البتولا."),ex:"Gran och tall är två olika arter.",tr:{en:"species",ar:"نوع"}});
TERM("no_barrtrad",{sv:"barrträd",m:W("barrträd(et|en)?"),d:t3("Ett träd med barr, som gran och tall. Barren sitter kvar på vintern.","A tree with needles, like spruce and pine. The needles stay on in winter.","شجرة ذات إبر مثل التنّوب والصنوبر، تبقى إبرها في الشتاء."),ex:"Granen är ett barrträd.",tr:{en:"conifer",ar:"شجرة مخروطية"}});
TERM("no_lovtrad",{sv:"lövträd",m:W("lövträd(et|en)?"),d:t3("Ett träd med löv, som björk och ek. Löven faller av på hösten.","A tree with leaves, like birch and oak. The leaves fall in autumn.","شجرة ذات أوراق عريضة مثل البتولا والبلّوط، تسقط أوراقها في الخريف."),ex:"Björken är ett lövträd.",tr:{en:"broadleaf tree",ar:"شجرة متساقطة الأوراق"}});
TERM("no_anpassning",{sv:"anpassning",m:W("anpass(ning|ningen|ningar|ningarna|ad|ade)"),d:t3("En kroppsdel eller ett beteende som hjälper en art att överleva där den lever.","A body part or behaviour that helps a species survive where it lives.","عضو أو سلوك يساعد النوع على البقاء حيث يعيش."),ex:"Ekorrens yviga svans är en anpassning.",tr:{en:"adaptation",ar:"تكيّف"}});
TERM("no_livsmiljo",{sv:"livsmiljö",m:W("livsmiljö(n|er|erna)?"),d:t3("Platsen där en art lever och hittar mat och skydd.","The place where a species lives and finds food and shelter.","المكان الذي يعيش فيه النوع ويجد الغذاء والمأوى."),ex:"Gäddans livsmiljö är sjön.",tr:{en:"habitat",ar:"موطن"}});

/* ---------------------------------------------------------------
   3. bio4j: food chains and food webs
   --------------------------------------------------------------- */
const GRASS=[200,380],HARE=[400,380],FOX=[640,380];
const chainArt=()=>[...soil(40,760,380),...art("grass",200,380,1.3),...art("hare",400,380,1.2),...art("fox",640,380,1)];
const A1="M245 300 Q292 270 340 300",A2="M470 290 Q515 260 560 290";
/* algae: a few green strands and dots at the bottom of the water */
const ALG="M70 390 Q58 350 78 310 Q92 270 76 230 M100 390 Q114 340 96 300 Q86 270 104 240 M130 390 Q120 360 136 330";
const lake=(x,y,w,h)=>[A.band(x,y,w,h,"b"),A.p(`M${x} ${y+16} Q${x+w*.25} ${y+4} ${x+w*.5} ${y+16} Q${x+w*.75} ${y+28} ${x+w} ${y+16}`,"b",3)];
/* a food web of words; arrows go from the eaten to the eater */
const WEB={gräs:[150,420,"g"],blåbär:[400,420,"g"],granfrön:[650,420,"g"],hare:[150,290,"o"],mus:[400,290,"o"],ekorre:[650,290,"o"],räv:[260,160,"r"],mård:[540,160,"r"]};
const WEBA=[["gräs","hare"],["blåbär","hare"],["blåbär","mus"],["granfrön","mus"],["granfrön","ekorre"],["hare","räv"],["mus","räv"],["mus","mård"],["ekorre","mård"]];
const webEnds=([a,b])=>{const [x1,y1]=WEB[a],[x2,y2]=WEB[b],dx=x2-x1;return[x1+dx*.12,y1-36,x2-dx*.12,y2+14]};
const webArrow=e=>{const [x1,y1,x2,y2]=webEnds(e);return A.arrow(x1,y1,x2,y2,"k")};
const webFlow=e=>{const [x1,y1,x2,y2]=webEnds(e);return A.flow(`M${x1} ${y1} L${x2} ${y2}`,"o",3,1.6,5)};
/* the chain with one link hidden, for questions */
const chainQ=(hide)=>{const P=[["grass",70,1.15],["hare",196,1],["fox",318,.68]],o=[...soil(20,390,340)];
  P.forEach(([k,x,s],i)=>{if(i===hide)o.push(A.tx("?",x,310,80,"r"));else o.push(...art(k,x,340,s))});
  o.push(A.arrow(104,215,150,215,"k",-8),A.arrow(236,205,276,205,"k",-8));return o};
const NAT3={steps:[
 {say:t3("Alla organismer behöver energi. Från början kommer energin från solen. Växterna fångar solljuset och gör näring av det, precis som du lärde dig om fotosyntesen.",
   "All living things need energy. In the beginning the energy comes from the sun. Plants catch the sunlight and make food from it, just as you learned about photosynthesis.",
   "كل الكائنات الحيّة تحتاج إلى الطاقة، والطاقة تأتي في البداية من الشمس. النباتات تلتقط ضوء الشمس وتصنع منه الغذاء، كما تعلّمت عن البناء الضوئي."),
  draw:()=>[A.wipe(),ttl("En näringskedja"),...art("sun",95,145,.72),...chainArt(),A.flow("M140 175 Q170 260 195 330","o",6,2.6,6)]},
 {say:t3("Haren äter gräs, och räven äter haren. Det kallas en näringskedja. Pilarna pekar mot den som äter. De visar hur energin går vidare: från gräset till haren och från haren till räven.",
   "The hare eats grass, and the fox eats the hare. That is called a food chain. The arrows point to the one that eats. They show how the energy moves on: from the grass to the hare and from the hare to the fox.",
   "الأرنب البري يأكل العشب، والثعلب يأكل الأرنب. هذا يسمّى سلسلة غذائية. الأسهم تشير إلى من يأكل، وتبيّن كيف تنتقل الطاقة: من العشب إلى الأرنب ومن الأرنب إلى الثعلب."),
  draw:()=>[A.p(R.arrow(245,300,340,300,-24),"k",4),A.p(R.arrow(470,290,560,290,-24),"k",4),A.flow(A1,"o",4,1.8,6),A.flow(A2,"o",4,1.8,6),
   A.tx("gräs",200,425,32,"g"),A.tx("hare",400,425,32,BRN),A.tx("räv",640,425,32,"o")]},
 {say:t3("Gräset gör sin egen näring med solljus. Därför kallas växter producenter. Djur kan inte göra egen näring utan måste äta andra organismer. De kallas konsumenter. Alla näringskedjor börjar med en producent.",
   "The grass makes its own food with sunlight. That is why plants are called producers. Animals cannot make their own food but must eat other living things. They are called consumers. Every food chain starts with a producer.",
   "العشب يصنع غذاءه بنفسه بضوء الشمس، لذلك تسمّى النباتات منتِجات. الحيوانات لا تصنع غذاءها بل يجب أن تأكل كائنات أخرى، وتسمّى مستهلِكات. كل سلسلة غذائية تبدأ بمنتِج."),
  draw:()=>[A.tx("producent",200,465,30,"g"),A.tx("konsument",400,465,30,"o"),A.tx("konsument",640,465,30,"o")]},
 {say:t3("Konsumenter kan äta olika saker. Haren och älgen är växtätare. Räven och gäddan är köttätare, de äter andra djur. Björnen är en allätare, den äter både bär, myror och fisk. Människan är också en allätare.",
   "Consumers can eat different things. The hare and the moose are herbivores. The fox and the pike are carnivores: they eat other animals. The bear is an omnivore: it eats berries, ants and fish. Humans are omnivores too.",
   "المستهلِكات تأكل أشياء مختلفة. الأرنب البري والموظ من آكلات الأعشاب، والثعلب والكراكي من آكلات اللحوم تأكل حيوانات أخرى، والدب يأكل كل شيء: التوت والنمل والسمك. والإنسان أيضًا يأكل كل شيء."),
  draw:()=>[A.wipe(),ttl("Olika konsumenter"),...soil(40,760,330),...art("hare",140,330,1.1),...art("fox",400,330,.9),...art("bear",650,330,.92),
   A.tx("växtätare",140,385,34,"g"),A.tx("köttätare",400,385,34,"r"),A.tx("allätare",650,385,34,"o"),A.tx("äter växter",140,425,26),A.tx("äter andra djur",400,425,26),A.tx("äter både växter och djur",650,425,26)]},
 {say:t3("Ett djur som jagar och äter andra djur kallas rovdjur. Djuret som blir jagat kallas byte. Räven har vassa tänder och ett bra luktsinne. Haren har stora öron som hör faran och långa ben som springer snabbt.",
   "An animal that hunts and eats other animals is called a predator. The animal being hunted is called prey. The fox has sharp teeth and a good sense of smell. The hare has big ears to hear danger and long legs to run fast.",
   "الحيوان الذي يصطاد حيوانات أخرى ويأكلها يسمّى مفترسًا، والحيوان المطارَد يسمّى فريسة. للثعلب أسنان حادّة وحاسّة شمّ قوية، وللأرنب البري أذنان كبيرتان تسمعان الخطر وساقان طويلتان تجريان بسرعة."),
  draw:()=>[A.wipe(),ttl("Rovdjur och byte"),...soil(40,760,350),...art("fox",270,350,1.15),A.p("M60 300 L120 300 M50 320 L110 320 M70 280 L120 280","#9aa3b2",3),...art("hare",610,350,1.15),A.p("M690 250 L740 250 M700 270 L750 270","#9aa3b2",3),
   A.tx("rovdjur",270,200,40,"r"),A.tx("byte",610,180,40,"b"),A.tx("vassa tänder, bra näsa",270,410,26,"r"),A.tx("stora öron, snabba ben",610,410,26,"b")]},
 {say:t3("I sjön finns också näringskedjor. Små alger är producenter, för de gör sin egen näring med solljus. Abborren äter smådjur som lever av alger, och gäddan är ett rovdjur som äter abborren.",
   "Lakes have food chains too. Tiny algae are producers because they make their own food with sunlight. The perch eats small animals that live on algae, and the pike is a predator that eats the perch.",
   "في البحيرة أيضًا سلاسل غذائية. الطحالب الصغيرة منتِجات لأنها تصنع غذاءها بضوء الشمس، والفرخ يأكل حيوانات صغيرة تعيش على الطحالب، والكراكي مفترس يأكل الفرخ."),
  draw:()=>[A.wipe(),ttl("En näringskedja i sjön"),...lake(30,100,740,300),A.p(ALG,"g",4),A.p(dotsP([[56,280],[124,210],[156,300],[88,200],[160,370]]),"g",8),
   ...art("perch",370,270,.9),...art("pike",620,280,.75),A.p(R.arrow(180,300,265,280,-20),"k",4),A.p(R.arrow(460,250,520,250,-20),"k",4),A.flow("M180 300 Q225 270 265 280","o",4,1.8,6),A.flow("M460 250 Q490 225 520 250","o",4,1.8,6),
   A.tx("alger",110,440,32,"g"),A.tx("abborre",370,440,32,"g"),A.tx("gädda",620,440,32,"#2f6b45"),A.tx("producent",110,475,24),A.tx("konsument",370,475,24),A.tx("rovdjur",620,475,24)]},
 {say:t3("De flesta djur äter mer än en sak. Musen äter både blåbär och granfrön, och räven äter både möss och harar. När många näringskedjor hänger ihop kallas det en näringsväv.",
   "Most animals eat more than one thing. The mouse eats both blueberries and spruce seeds, and the fox eats both mice and hares. When many food chains are linked together it is called a food web.",
   "معظم الحيوانات تأكل أكثر من شيء واحد. الفأر يأكل التوت البري وبذور التنّوب، والثعلب يأكل الفئران والأرانب. عندما ترتبط سلاسل غذائية كثيرة تسمّى شبكة غذائية."),
  draw:()=>[A.wipe(),ttl("En näringsväv i skogen"),...Object.entries(WEB).map(([s,[x,y,c]])=>A.tx(s,x,y,34,c)),...WEBA.map(webArrow),
   webFlow(["gräs","hare"]),webFlow(["mus","räv"]),webFlow(["ekorre","mård"])]},
 {say:t3("Kom ihåg: producenter gör sin egen näring, konsumenter äter andra, och rovdjur jagar sitt byte. När växter och djur dör tar nedbrytare som maskar och svampar hand om dem. Mer om dem i lektion 6.",
   "Remember: producers make their own food, consumers eat others, and predators hunt their prey. When plants and animals die, decomposers such as worms and fungi take care of them. More about them in lesson 6.",
   "تذكّر: المنتِجات تصنع غذاءها، والمستهلِكات تأكل غيرها، والمفترسات تصطاد فرائسها. وعندما تموت النباتات والحيوانات تتولّاها المحلِّلات مثل الديدان والفطريات. سنتعرّف عليها أكثر في الدرس السادس."),
  draw:()=>[A.wipe(),ttl("Kom ihåg"),...blist([["producent: gör egen näring","g"],["konsument: äter andra","o"],["rovdjur jagar sitt byte","r"],["nedbrytare: bryter ner det döda","v"]],90,160,66,32),
   ...soil(590,760,420),...art("svamp",630,420,1),...art("worm",690,450,.9)]},
]};
const BANK3=[
 {lv:0,q:"Var kommer energin i en näringskedja från början?",a:"från solen",w:["från räven","från jorden","från månen"]},
 {lv:0,q:"Vad äter haren?",a:"gräs och växter",w:["rävar","fiskar","stenar"]},
 {lv:0,q:"Vad kallas ett djur som jagar andra djur?",a:"rovdjur",w:["växtätare","producent","byte"]},
 {lv:0,q:"Vad saknas i näringskedjan?",a:"hare",w:["sten","sol","gädda"],lines:["Vad saknas","i näringskedjan?"],pic:()=>chainQ(1)},
 {lv:1,q:"Vad saknas i näringskedjan?",a:"gräs",w:["räv","sten","gädda"],lines:["Vad saknas","i näringskedjan?"],pic:()=>chainQ(0)},
 {lv:1,q:"Vad saknas i näringskedjan?",a:"räv",w:["gräs","blåbär","sten"],lines:["Vad saknas","i näringskedjan?"],pic:()=>chainQ(2)},
 {lv:1,q:"Vad kallas växter i en näringskedja?",a:"producenter",w:["konsumenter","rovdjur","nedbrytare"]},
 {lv:1,q:"Vad kallas djur som måste äta andra organismer?",a:"konsumenter",w:["producenter","växter","alger"]},
 {lv:1,q:"Vilken av dessa är en växtätare?",a:"älgen",w:["räven","gäddan","vargen"]},
 {lv:1,q:"Vilken av dessa är en allätare?",a:"björnen",w:["haren","älgen","gräset"]},
 {lv:1,q:"Vad är producenten i sjöns näringskedja?",a:"alger",w:["abborre","gädda","sten"]},
 {lv:2,q:"Vilken näringskedja är rätt?",a:"gräs → hare → räv",w:["räv → hare → gräs","hare → gräs → räv","gräs → räv → hare"]},
 {lv:2,q:"Vilken näringskedja är rätt?",a:"alger → abborre → gädda",w:["gädda → abborre → alger","abborre → alger → gädda","alger → gädda → abborre"]},
 {lv:2,q:"Vart pekar pilarna i en näringskedja?",a:"mot den som äter",w:["mot den som blir uppäten","mot solen","neråt mot jorden"]},
 {lv:2,q:"Vad är en näringsväv?",a:"många näringskedjor som hänger ihop",w:["ett spindelnät","en sorts växt","ett ekosystem utan djur"]},
 {lv:2,q:"Vad händer med räven om alla harar försvinner?",a:"den får mindre mat",w:["den får mer mat","ingenting händer","den börjar äta gräs"]},
 {lv:1,q:"Skriv ordet: ett djur som blir jagat och uppätet kallas …",a:["byte","bytet"],lines:["Skriv ordet som saknas:","Ett djur som blir jagat kallas …"]},
 {lv:2,q:"Skriv ordet: en organism som gör sin egen näring kallas …",a:["producent","producenter","en producent"],lines:["Skriv ordet som saknas:","En organism som gör sin egen näring","kallas en …"]},
];
LESSONS.push({id:"bio4j",subject:"science",grades:"4",kind:"wb",year:4,ord:11,
 title:t3("Näringskedjor och näringsvävar","Food chains and food webs","السلاسل والشبكات الغذائية"),
 icon:`<svg viewBox="0 0 320 180"><rect width="320" height="180" fill="#fff"/><path d="M20 140H300" stroke="#8a5a2b" stroke-width="3"/><path d="M40 140Q36 116 30 108M50 140Q50 112 56 100M60 140Q62 120 72 112" stroke="#1e9e5a" stroke-width="4" fill="none"/><ellipse cx="160" cy="122" rx="26" ry="18" fill="none" stroke="#8a5a2b" stroke-width="3.5"/><path d="M172 104Q166 70 174 70Q182 72 180 104M180 104Q190 72 198 74Q200 80 186 106" stroke="#8a5a2b" stroke-width="3.5" fill="none"/><path d="M226 120Q236 104 262 106L270 92L276 106Q290 110 298 116Q282 124 262 124Q240 130 226 120Z" fill="#fde6c8" stroke="#e07b00" stroke-width="3.5"/><path d="M78 90Q100 76 124 90M190 70Q212 56 232 74" stroke="#1d2433" stroke-width="3.5" fill="none"/><path d="M124 90L114 82M124 90L112 94M232 74L220 68M232 74L222 80" stroke="#1d2433" stroke-width="3.5"/></svg>`,
 steps:NAT3.steps,mount:wbMount(NAT3),gen:bankGen(BANK3)});
WORDS.bio4j=["no_naringskedja","no_naringsvav","no_producent","no_konsument","no_vaxtatare","no_kottatare","no_allatare","no_rovdjur"];

/* ---------------------------------------------------------------
   4. bio4k: ecosystems in Sweden - the forest and the lake
   --------------------------------------------------------------- */
const MOSS="M-60 0 Q-58 -24 -36 -20 Q-30 -42 -10 -32 Q0 -50 18 -34 Q36 -44 42 -22 Q62 -22 60 0 Z";
const REEDS=(x,y,n=4,h=150,c="g")=>{let d="";for(let i=0;i<n;i++){const xx=x+i*16,hh=h-(i%2)*30;d+=`M${xx} ${y} Q${xx-4} ${y-hh*.5} ${xx+(i%2?6:-6)} ${y-hh}`}
  return[A.p(d,c,3.5),...[...Array(n)].filter((_,i)=>i%2===0).map((_,j)=>A.p(R.loop(x+j*32-6,y-h+16,5,14),BRN,4))]};
/* a tree trunk for the woodpecker */
const trunk=(x,y1,y2)=>[A.p(`M${x-20} ${y1} L${x-22} ${y2} M${x+20} ${y1} L${x+22} ${y2} M${x-8} ${y1+60} L${x-4} ${y1+90} M${x+6} ${y1+150} L${x+10} ${y1+180}`,BRN,4)];
/* a picture of one species for "what is this?" questions */
const SP={
 moose:()=>[...soil(40,370,360),...art("moose",170,360,1.15)],fox:()=>[...soil(40,370,330),...art("fox",200,330,1.3)],squirrel:()=>[...soil(80,330,350),...art("squirrel",200,350,1.9)],
 woodpecker:()=>[...trunk(262,110,400),...art("woodpecker",190,300,2)],perch:()=>[...lake(30,140,350,240),...art("perch",200,270,1.35)],pike:()=>[...lake(30,140,350,240),...art("pike",200,270,1.1)],
 gran:()=>[...soil(80,330,400),...art("gran",200,400,1.6)],tall:()=>[...soil(80,330,400),...art("tall",200,400,1.5)],bjork:()=>[...soil(80,330,400),...art("bjork",200,400,1.5)],
 lily:()=>[...lake(30,190,350,260),...art("lily",210,206,2)],blabar:()=>[...soil(80,330,360),...art("blabar",200,360,2.6)],svamp:()=>[...soil(80,330,360),...art("svamp",200,360,2.2)],
};
const DJUR=["älg","räv","ekorre","hackspett","abborre","gädda","hare","björn"],TRAD=["gran","tall","björk","ek"];
const spQ=(lv,k,a,list,what)=>({lv,q:what,a,get w(){return shuffle(list.filter(x=>x!==a)).slice(0,3)},lines:[what.replace(/ är det här\?$/,""),"är det här?"],pic:SP[k]});
const NAT4={steps:[
 {say:t3("Ett ekosystem är ett område i naturen, till exempel en skog eller en sjö. Där lever växter och djur tillsammans, och de behöver också det icke-levande: solljus, vatten, luft och jord.",
   "An ecosystem is an area of nature, for example a forest or a lake. Plants and animals live there together, and they also need non-living things: sunlight, water, air and soil.",
   "النظام البيئي منطقة في الطبيعة، مثل غابة أو بحيرة. تعيش فيها النباتات والحيوانات معًا، وتحتاج أيضًا إلى غير الحيّ: ضوء الشمس والماء والهواء والتربة."),
  draw:()=>[A.wipe(),ttl("Ekosystem"),...art("sun",720,140,.6),...soil(30,440,360),...art("gran",90,360,1.05),...art("tall",210,360,.95),...art("bjork",340,360,.85),
   A.p("M440 360 L770 360 M440 360 Q470 470 600 470 Q760 470 770 360","b",3.5),A.p("M470 392 q15 -8 30 0 q15 8 30 0 M690 392 q15 -8 30 0 q15 8 30 0 M560 450 q15 -8 30 0 q15 8 30 0","b",2.5),...art("lily",530,362,.6),...art("perch",640,420,.42),
   A.tx("skogen",220,420,36,"g"),A.tx("sjön",640,320,36,"b")]},
 {say:t3("I den svenska skogen växer ofta gran, tall och björk. Gran och tall är barrträd, och deras barr sitter kvar hela vintern. Björken är ett lövträd med vit stam och svarta fläckar. Den tappar löven på hösten.",
   "In the Swedish forest, spruce, pine and birch are common. Spruce and pine are conifers, and their needles stay on all winter. The birch is a broadleaf tree with a white trunk and black spots. It drops its leaves in autumn.",
   "في الغابة السويدية تنمو غالبًا أشجار التنّوب والصنوبر والبتولا. التنّوب والصنوبر شجرتان مخروطيتان تبقى إبرهما طوال الشتاء، أما البتولا فشجرة ذات أوراق، جذعها أبيض ببقع سوداء، وتُسقط أوراقها في الخريف."),
  draw:()=>[A.wipe(),ttl("Träden i skogen"),...soil(40,760,390),...art("gran",140,390,1.3),...art("tall",400,390,1.2),...art("bjork",650,390,1.2),
   A.tx("gran",140,435,34,"g"),A.tx("tall",400,435,34,"g"),A.tx("björk",650,435,34,"g"),A.tx("barrträd",140,472,26),A.tx("barrträd",400,472,26),A.tx("lövträd",650,472,26)]},
 {say:t3("På marken i skogen växer blåbärsris och mossa, och på hösten kommer svamparna upp. Blåbären är mat åt många djur och fåglar. Svamparna hjälper till att bryta ner gamla löv och barr.",
   "On the forest floor grow blueberry bushes and moss, and in autumn mushrooms come up. Blueberries are food for many animals and birds. Fungi help break down old leaves and needles.",
   "على أرض الغابة ينمو شجيرات التوت البري والطحالب، وفي الخريف يظهر الفطر. التوت البري غذاء لكثير من الحيوانات والطيور، والفطريات تساعد على تحليل الأوراق والإبر القديمة."),
  draw:()=>[A.wipe(),ttl("Skogens botten"),...soil(40,760,370),...art("blabar",150,370,2.2),...art("svamp",400,370,1.7),...art("svamp",470,370,.9),
   A.hatch(tfx(MOSS,650,370,1.6),"g"),A.p(tfx(MOSS,650,370,1.6),"g",4),A.p(tfx("M-40 -6 L-44 -16 M-14 -10 L-12 -24 M14 -8 L18 -22 M38 -6 L40 -16",650,370,1.6),"g",3),
   A.tx("blåbärsris",150,425,34,"b"),A.tx("svamp",430,425,34,"o"),A.tx("mossa",650,425,34,"g")]},
 {say:t3("I skogen lever många djur. Älgen är Sveriges största landdjur och äter blad, kvistar och ris. Räven jagar möss och harar. Ekorren äter kottar och nötter, och hackspetten hackar i träden för att hitta insekter.",
   "Many animals live in the forest. The moose is Sweden's largest land animal and eats leaves, twigs and shrubs. The fox hunts mice and hares. The squirrel eats cones and nuts, and the woodpecker pecks at trees to find insects.",
   "تعيش في الغابة حيوانات كثيرة. الموظ أكبر حيوان برّي في السويد ويأكل الأوراق والأغصان والشجيرات. الثعلب يصطاد الفئران والأرانب، والسنجاب يأكل المخاريط والجوز، ونقّار الخشب ينقر الأشجار ليجد الحشرات."),
  draw:()=>[A.wipe(),ttl("Skogens djur"),...soil(40,760,400),...art("moose",140,400,.85),...art("fox",390,400,.82),...art("squirrel",570,400,1.1),...trunk(722,120,400),...art("woodpecker",676,320,1),
   A.tx("älg",150,445,34,"#5a3d22"),A.tx("räv",390,445,34,"o"),A.tx("ekorre",570,445,34,"#b5541c"),A.tx("hackspett",700,445,32,"k")]},
 {say:t3("Arter har anpassningar, alltså kroppsdelar och beteenden som hjälper dem att överleva. Ekorren har vassa klor för att klättra och en yvig svans för balansen. Hackspetten har en stark näbb och en styv stjärt som stöd mot trädet.",
   "Species have adaptations: body parts and behaviours that help them survive. The squirrel has sharp claws for climbing and a bushy tail for balance. The woodpecker has a strong beak and a stiff tail that props it against the tree.",
   "للأنواع تكيّفات، أي أعضاء وسلوكيات تساعدها على البقاء. للسنجاب مخالب حادّة للتسلّق وذيل كثيف للتوازن، ولنقّار الخشب منقار قوي وذيل صلب يستند به إلى الشجرة."),
  draw:()=>[A.wipe(),ttl("Anpassningar"),...soil(60,340,330),...art("squirrel",200,330,1.8),...trunk(626,100,340),...art("woodpecker",560,300,1.8),
   A.tx("yvig svans: balans",200,385,28,"#b5541c"),A.tx("vassa klor: klättrar",200,425,28,"#b5541c"),A.tx("stark näbb: hackar",590,385,28,"k"),A.tx("styv stjärt: stöd",590,425,28,"k")]},
 {say:t3("Sjön är ett annat ekosystem. Vid stranden växer vass. Näckrosen har stora blad som flyter på ytan och en lång stjälk ner till botten. I vattnet simmar abborrar och gäddor, och längst ner växer alger.",
   "The lake is another ecosystem. Reeds grow along the shore. The water lily has big leaves that float on the surface and a long stem down to the bottom. Perch and pike swim in the water, and algae grow at the bottom.",
   "البحيرة نظام بيئي آخر. على الشاطئ ينمو القصب، وزنبق الماء له أوراق كبيرة تطفو على السطح وساق طويلة حتى القاع. في الماء يسبح الفرخ والكراكي، وفي القاع تنمو الطحالب."),
  draw:()=>[A.wipe(),ttl("Sjön"),A.p("M40 180 Q220 168 400 180 Q580 192 760 180 M40 180 Q60 460 400 460 Q740 460 760 180","b",3.5),A.p("M180 260 q15 -8 30 0 q15 8 30 0 M600 250 q15 -8 30 0 q15 8 30 0 M420 420 q15 -8 30 0 q15 8 30 0 M640 300 q15 -8 30 0","b",2.5),
   ...REEDS(70,250,5,170),...art("lily",300,182,.9),...art("perch",460,300,.62),...art("perch",540,340,.45),...art("pike",610,400,.55),A.p("M300 452 Q290 420 306 390 M326 452 Q338 424 322 400 M350 452 Q344 430 356 410","g",4),
   A.tx("vass",160,120,30,"g"),A.tx("näckros",320,130,30,"p"),A.tx("abborrar",470,240,28,"g"),A.tx("gädda",700,350,28,"#2f6b45"),A.tx("alger",240,410,28,"g")]},
 {say:t3("Även i sjön finns anpassningar. Gäddan är grön och randig som vassen, så bytet ser den inte. Den står stilla och gör sedan ett blixtsnabbt anfall. Abborren har taggar på ryggfenan som skydd, och simmar ofta i stim.",
   "There are adaptations in the lake too. The pike is green and striped like the reeds, so its prey does not see it. It stays still and then makes a lightning-fast attack. The perch has spikes on its back fin for protection and often swims in shoals.",
   "في البحيرة أيضًا تكيّفات. الكراكي أخضر مخطّط مثل القصب فلا تراه الفريسة، يقف ساكنًا ثم ينقضّ بسرعة البرق. وللفرخ أشواك على زعنفة ظهره تحميه، وغالبًا ما يسبح في أسراب."),
  draw:()=>[A.wipe(),ttl("Anpassningar i sjön"),...lake(30,110,740,280),...REEDS(150,380,12,240,"#9ccfa9"),...art("pike",330,270,1.35),...art("perch",640,250,.95),A.p(R.line(612,190,590,160,.3),"g",2.5),
   A.tx("taggig ryggfena",590,150,28,"g"),...art("perch",590,350,.3),...art("perch",660,365,.3),...art("perch",720,340,.3),
   A.tx("grön och randig: syns inte",330,430,28,"#2f6b45"),A.tx("simmar i stim",650,430,28,"g")]},
 {say:t3("Kom ihåg: i ett ekosystem hänger allt ihop. Om en art försvinner påverkas de andra. Försvinner alla harar får räven mindre mat. Varje art har anpassningar som hjälper den att leva i sin livsmiljö.",
   "Remember: in an ecosystem everything is linked. If one species disappears, the others are affected. If all the hares disappear, the fox gets less food. Every species has adaptations that help it live in its habitat.",
   "تذكّر: في النظام البيئي يرتبط كل شيء. إذا اختفى نوع تأثّرت الأنواع الأخرى، فإذا اختفت الأرانب قلّ طعام الثعلب. ولكل نوع تكيّفات تساعده على العيش في موطنه."),
  draw:()=>[A.wipe(),ttl("Kom ihåg"),...blist([["ekosystem: allt i ett område hänger ihop","b"],["barrträd: gran och tall","g"],["lövträd: björk","g"],["anpassning: hjälper arten att överleva","o"]],80,160,64,32),
   note("Om en art försvinner påverkas de andra.",440,"r",30)]},
]};
const BANK4=[
 spQ(0,"moose","älg",DJUR,"Vilket djur är det här?"),spQ(0,"fox","räv",DJUR,"Vilket djur är det här?"),spQ(0,"squirrel","ekorre",DJUR,"Vilket djur är det här?"),
 spQ(1,"woodpecker","hackspett",DJUR,"Vilken fågel är det här?"),spQ(1,"pike","gädda",["abborre","gädda","älg","räv"],"Vilken fisk är det här?"),spQ(1,"perch","abborre",["gädda","abborre","ekorre","hare"],"Vilken fisk är det här?"),
 spQ(0,"gran","gran",TRAD,"Vilket träd är det här?"),spQ(1,"bjork","björk",TRAD,"Vilket träd är det här?"),spQ(2,"tall","tall",TRAD,"Vilket träd är det här?"),
 spQ(2,"lily","näckros",["vass","näckros","mossa","blåbär"],"Vilken växt är det här?"),
 {lv:0,q:"Vilket är Sveriges största landdjur?",a:"älgen",w:["räven","ekorren","haren"]},
 {lv:0,q:"Vad är ett ekosystem?",a:"ett område där allt i naturen hänger ihop",w:["ett sorts djur","en stor sten","en maskin i skogen"]},
 {lv:1,q:"Vilket av dessa träd är ett lövträd?",a:"björk",w:["gran","tall","en"]},
 {lv:1,q:"Vad äter hackspetten?",a:"insekter i träden",w:["fisk","gräs","andra fåglar"]},
 {lv:2,q:"Hur hjälper ekorrens yviga svans den?",a:"den håller balansen",w:["den kan simma","den gräver hål","den skrämmer bort räven"]},
 {lv:2,q:"Varför är gäddan grön och randig?",a:"så att bytet inte ser den",w:["så att den syns bra","för att den äter gräs","för att vattnet är grönt"]},
 {lv:2,q:"Vad händer om alla harar i skogen försvinner?",a:"räven får mindre mat",w:["räven får mer mat","inget alls","gräset försvinner"]},
 {lv:1,q:"Skriv ordet: gran och tall är …",a:["barrträd","barrträden"],lines:["Skriv ordet som saknas:","Gran och tall är …"]},
 {lv:2,q:"Skriv ordet: en kroppsdel som hjälper en art att överleva är en …",a:["anpassning","anpassningar"],lines:["Skriv ordet som saknas:","En kroppsdel som hjälper en art","att överleva är en …"]},
];
LESSONS.push({id:"bio4k",subject:"science",grades:"4",kind:"wb",year:4,ord:12,
 title:t3("Ekosystem: skogen och sjön","Ecosystems: the forest and the lake","النظم البيئية: الغابة والبحيرة"),
 icon:`<svg viewBox="0 0 320 180"><rect width="320" height="180" fill="#fff"/><path d="M60 30L40 70H50L30 110H90L70 70H80Z" fill="#dff3e6" stroke="#1e9e5a" stroke-width="3.5"/><path d="M60 110V130M20 130H160" stroke="#8a5a2b" stroke-width="3.5"/><path d="M110 130V80" stroke="#9aa3b2" stroke-width="5"/><ellipse cx="110" cy="66" rx="22" ry="20" fill="#dff3e6" stroke="#3fae5e" stroke-width="3"/><path d="M160 130H300Q296 172 230 172Q164 172 160 130Z" fill="#dbe7fb" stroke="#2257c9" stroke-width="3.5"/><path d="M200 152Q220 140 246 148Q256 152 262 150L270 144L268 156Q258 160 246 156Q220 164 200 152Z" fill="#dff3e6" stroke="#1e9e5a" stroke-width="2.5"/><ellipse cx="190" cy="130" rx="18" ry="5" fill="#dff3e6" stroke="#1e9e5a" stroke-width="2.5"/></svg>`,
 steps:NAT4.steps,mount:wbMount(NAT4),gen:bankGen(BANK4)});
WORDS.bio4k=["no_ekosystem","no_art","no_barrtrad","no_lovtrad","no_anpassning","no_livsmiljo"];
}
